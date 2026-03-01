/**
 * Application Express principale
 * Configure tous les middlewares et routes
 */

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import env from './config/env';
import corsOptions from './config/corsOptions';
import { errorHandler } from './shared/middlewares/errorHandler';

// Routes
import authRoutes from './modules/auth/auth.routes';
import activitesRoutes from './modules/activites/activites.routes';
import servicesRoutes from './modules/services/services.routes';
import messagesRoutes from './modules/messages/messages.routes';

const app: Express = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/activites', activitesRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/messages', messagesRoutes);

// Route 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' });
});

// Middleware de gestion d'erreurs (doit être le dernier)
app.use(errorHandler);

export default app;
