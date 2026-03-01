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
      console.log('Login response:', response);
      
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
        toast.success('Connexion réussie');
        
        // Vérifier si le cookie est présent dans la réponse
        console.log('Response headers:', response.headers);
        
        // Attendre un peu pour que le cookie soit défini
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Vérifier à nouveau l'auth pour s'assurer que le cookie est bien défini
        try {
          await checkAuth();
          console.log('Auth check successful after login');
        } catch (authError) {
          console.error('Auth check failed after login:', authError);
          // Continuer quand même, le cookie pourrait être défini
        }
        
        // Utiliser window.location pour forcer un rechargement complet
        window.location.href = '/admin/dashboard';
        return true;
      }
      return false;
    } catch (error: unknown) {
      console.error('Login error:', error);
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
