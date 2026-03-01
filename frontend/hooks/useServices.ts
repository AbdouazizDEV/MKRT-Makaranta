/**
 * Hook pour gérer les services
 */

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Service, CreateServiceDTO, UpdateServiceDTO } from '@/types/service';
import { ApiResponse } from '@/lib/api.types';
import toast from 'react-hot-toast';

export function useServices(includeUnpublished = false) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const endpoint = includeUnpublished ? '/services/admin/all' : '/services';
      const response = await api.get<ApiResponse<Service[]>>(endpoint);
      if (response.data.success && response.data.data) {
        setServices(response.data.data);
        setError(null);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeUnpublished]);

  const create = async (data: CreateServiceDTO) => {
    try {
      const response = await api.post<ApiResponse<Service>>('/services', data);
      if (response.data.success && response.data.data) {
        toast.success('Service créé avec succès');
        await fetchServices();
        return response.data.data;
      }
      return null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création';
      toast.error(message);
      throw err;
    }
  };

  const update = async (id: string, data: UpdateServiceDTO) => {
    try {
      const response = await api.put<ApiResponse<Service>>(`/services/${id}`, data);
      if (response.data.success && response.data.data) {
        toast.success('Service mis à jour avec succès');
        await fetchServices();
        return response.data.data;
      }
      return null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      toast.error(message);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/services/${id}`);
      toast.success('Service supprimé avec succès');
      await fetchServices();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      toast.error(message);
      throw err;
    }
  };

  return {
    services,
    loading,
    error,
    fetchServices,
    create,
    update,
    remove,
  };
}
