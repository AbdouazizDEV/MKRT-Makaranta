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
      console.log('Login response:', response);
      console.log('Response headers:', response.headers);
      
      if (response.data.success && response.data.data) {
        // Récupérer le token depuis le header X-Auth-Token ou depuis la réponse JSON
        const token = response.headers['x-auth-token'] || 
                     response.headers['X-Auth-Token'] ||
                     (response.headers as any)['x-auth-token'] ||
                     (response.data.data as any)?.token; // Fallback: token dans la réponse JSON
        
        console.log('Token from header:', response.headers['x-auth-token']);
        console.log('Token from data:', (response.data.data as any)?.token);
        console.log('Final token:', token);
        
        if (token && typeof token === 'string') {
          // Stocker le token dans localStorage
          localStorage.setItem('auth_token', token);
          console.log('✅ Token stocké dans localStorage');
          
          // Extraire les données utilisateur (sans le token)
          const userData = {
            id: response.data.data.id,
            email: response.data.data.email,
            role: response.data.data.role,
          };
          
          // Décoder le token pour récupérer les infos utilisateur
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({
              id: payload.id,
              email: payload.email,
              role: payload.role,
            });
            console.log('✅ User défini depuis token décodé');
          } catch (e) {
            console.error('Erreur décodage token:', e);
            // Utiliser les données de la réponse si le décodage échoue
            setUser(userData);
            console.log('✅ User défini depuis données réponse');
          }
        } else {
          console.warn('⚠️ Pas de token trouvé, utilisation des données de réponse uniquement');
          // Si pas de token, utiliser les données de la réponse
          const userData = {
            id: response.data.data.id,
            email: response.data.data.email,
            role: response.data.data.role,
          };
          setUser(userData);
        }
        
        toast.success('Connexion réussie');
        
        // Attendre un peu pour que l'état soit mis à jour
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Rediriger
        console.log('Redirection vers /admin/dashboard');
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
