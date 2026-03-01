/**
 * Client HTTP centralisé avec Axios
 * Configure les intercepteurs et les options par défaut
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiResponse } from './api.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
        // Non authentifié - rediriger vers login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
      
      // Retourner l'erreur avec le message de l'API
      return Promise.reject(new Error(data?.message || 'Une erreur est survenue'));
    }
    
    return Promise.reject(error);
  }
);

export default api;
