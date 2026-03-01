/**
 * Hook pour l'authentification
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User, LoginDTO } from '@/types/user';
import { ApiResponse } from '@/lib/api.types';
import toast from 'react-hot-toast';

export function useAuth(shouldCheck = true) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(shouldCheck);
  const router = useRouter();

  useEffect(() => {
    if (shouldCheck) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [shouldCheck]);

  const checkAuth = async () => {
    try {
      // Ne faire l'appel que si on est sur une page admin
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
        setLoading(false);
        return;
      }
      
      const response = await api.get<ApiResponse<User>>('/auth/me');
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginDTO) => {
    try {
      const response = await api.post<ApiResponse<User>>('/auth/login', credentials);
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
        toast.success('Connexion réussie');
        router.push('/admin/dashboard');
        return true;
      }
      return false;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erreur de connexion';
      toast.error(message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success('Déconnexion réussie');
      router.push('/admin/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
