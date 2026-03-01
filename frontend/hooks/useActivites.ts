/**
 * Hook pour gérer les activités
 */

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Activite, CreateActiviteDTO, UpdateActiviteDTO } from '@/types/activite';
import { ApiResponse } from '@/lib/api.types';
import toast from 'react-hot-toast';

export function useActivites(includeUnpublished = false) {
  const [activites, setActivites] = useState<Activite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivites = async () => {
    try {
      setLoading(true);
      const endpoint = includeUnpublished ? '/activites/admin/all' : '/activites';
      const response = await api.get<ApiResponse<Activite[]>>(endpoint);
      if (response.data.success && response.data.data) {
        setActivites(response.data.data);
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
    fetchActivites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeUnpublished]);

  const create = async (data: CreateActiviteDTO) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.date) formData.append('date', data.date);
      if (data.image_alt) formData.append('image_alt', data.image_alt);
      formData.append('published', String(data.published || false));
      if (data.image) formData.append('image', data.image);

      const response = await api.post<ApiResponse<Activite>>('/activites', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success && response.data.data) {
        toast.success('Activité créée avec succès');
        await fetchActivites();
        return response.data.data;
      }
      return null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la création';
      toast.error(message);
      throw err;
    }
  };

  const update = async (id: string, data: UpdateActiviteDTO) => {
    try {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.description !== undefined) formData.append('description', data.description || '');
      if (data.date) formData.append('date', data.date);
      if (data.image_alt) formData.append('image_alt', data.image_alt);
      if (data.published !== undefined) formData.append('published', String(data.published));
      if (data.image) formData.append('image', data.image);

      const response = await api.put<ApiResponse<Activite>>(`/activites/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success && response.data.data) {
        toast.success('Activité mise à jour avec succès');
        await fetchActivites();
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
      await api.delete(`/activites/${id}`);
      toast.success('Activité supprimée avec succès');
      await fetchActivites();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      toast.error(message);
      throw err;
    }
  };

  return {
    activites,
    loading,
    error,
    fetchActivites,
    create,
    update,
    remove,
  };
}
