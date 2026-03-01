/**
 * Configuration CORS pour Express
 * Autorise uniquement l'origine du frontend
 */

import { CorsOptions } from 'cors';
import env from './env';

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // En développement, autoriser localhost
    if (env.NODE_ENV === 'development') {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'https://mkrt-makaranta.vercel.app',
      ];
      
      // Autoriser les requêtes sans origine (Postman, curl, etc.) en dev uniquement
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Non autorisé par CORS'));
      }
    } else {
      // En production, autoriser l'origine du frontend Vercel
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        // Pattern pour accepter toutes les URLs Vercel
        /^https:\/\/.*\.vercel\.app$/,
      ].filter(Boolean);
      
      // Vérifier si l'origine est autorisée
      const isAllowed = !origin || allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') {
          return origin === allowed;
        }
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Non autorisé par CORS: ${origin}`));
      }
    }
  },
  credentials: true, // Permet l'envoi de cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie', 'X-Auth-Token'], // Exposer le header X-Auth-Token pour le frontend
  optionsSuccessStatus: 200, // Pour les navigateurs plus anciens
};

export default corsOptions;
