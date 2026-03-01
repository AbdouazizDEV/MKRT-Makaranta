/**
 * Configuration CORS pour Express
 * Autorise uniquement l'origine du frontend
 */

import { CorsOptions } from 'cors';
import env from './env';

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // En développement, autoriser localhost
    if (env.NODE_ENV === 'development') {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
      ];
      
      // Autoriser les requêtes sans origine (Postman, curl, etc.) en dev uniquement
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Non autorisé par CORS'));
      }
    } else {
      // En production, autoriser uniquement l'origine du frontend
      const allowedOrigin = process.env.FRONTEND_URL || 'https://lumina.org';
      if (origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error('Non autorisé par CORS'));
      }
    }
  },
  credentials: true, // Permet l'envoi de cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
};

export default corsOptions;
