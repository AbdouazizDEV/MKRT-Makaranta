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

  const checkAuth = () => {
    // Vérifier uniquement si un token existe dans localStorage
    // Plus besoin d'appeler /api/auth/me
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Décoder le token JWT pour récupérer les infos utilisateur
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({
            id: payload.id,
            email: payload.email,
            role: payload.role,
          });
        } catch {
          // Token invalide, le supprimer
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (credentials: LoginDTO) => {
    try {
      const response = await api.post<ApiResponse<User>>('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        // Récupérer le token depuis le header X-Auth-Token
        const token = response.headers['x-auth-token'] || response.headers['X-Auth-Token'];
        
        if (token && typeof token === 'string') {
          // Stocker le token dans localStorage
          localStorage.setItem('auth_token', token);
          
          // Décoder le token pour récupérer les infos utilisateur
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({
              id: payload.id,
              email: payload.email,
              role: payload.role,
            });
          } catch {
            // Utiliser les données de la réponse si le décodage échoue
            setUser(response.data.data);
          }
        } else {
          // Si pas de token dans le header, utiliser les données de la réponse
          setUser(response.data.data);
        }
        
        toast.success('Connexion réussie');
        
        // Rediriger immédiatement
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
      // Supprimer le token du localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      setUser(null);
      toast.success('Déconnexion réussie');
      router.push('/admin/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Supprimer quand même le token local
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      setUser(null);
      router.push('/admin/login');
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
