/**
 * Client HTTP centralisé avec Axios
 * Configure les intercepteurs et les options par défaut
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse } from './api.types';

// Construire l'URL de l'API en s'assurant qu'elle se termine par /api
const getApiUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    // Si l'URL se termine déjà par /api, on la garde telle quelle
    // Sinon, on l'ajoute
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }
  // Fallback pour le développement local
  if (typeof window !== 'undefined') {
    return window.location.origin.replace('3000', '5000') + '/api';
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

// Création de l'instance Axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important pour les cookies httpOnly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // Gestion des erreurs HTTP
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        // Non authentifié - rediriger vers login uniquement sur les pages admin
        if (typeof window !== 'undefined' && 
            window.location.pathname.startsWith('/admin') && 
            !window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
        // Ne pas rejeter l'erreur pour les pages publiques
        // Laissez le composant gérer l'erreur silencieusement
      }
      
      // Retourner l'erreur avec le message de l'API
      return Promise.reject(new Error(data?.message || 'Une erreur est survenue'));
    }
    
    return Promise.reject(error);
  }
);

export default api;
