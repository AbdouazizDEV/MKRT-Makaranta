/**
 * Hook pour gérer les messages
 */

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Message, CreateMessageDTO } from '@/types/message';
import { ApiResponse } from '@/lib/api.types';
import toast from 'react-hot-toast';

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse<Message[]>>('/messages');
      if (response.data.success && response.data.data) {
        setMessages(response.data.data);
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
    fetchMessages();
  }, []);

  const create = async (data: CreateMessageDTO) => {
    try {
      const response = await api.post<ApiResponse<Message>>('/messages', data);
      if (response.data.success && response.data.data) {
        toast.success('Message envoyé avec succès');
        return response.data.data;
      }
      return null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'envoi';
      toast.error(message);
      throw err;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await api.patch<ApiResponse<Message>>(`/messages/${id}/read`);
      if (response.data.success && response.data.data) {
        toast.success('Message marqué comme lu');
        await fetchMessages();
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
      await api.delete(`/messages/${id}`);
      toast.success('Message supprimé avec succès');
      await fetchMessages();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      toast.error(message);
      throw err;
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return {
    messages,
    loading,
    error,
    unreadCount,
    fetchMessages,
    create,
    markAsRead,
    remove,
  };
}
