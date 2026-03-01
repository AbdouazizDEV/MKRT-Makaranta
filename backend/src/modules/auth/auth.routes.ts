/**
 * Routes d'authentification
 */

import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from './auth.controller';
import { validate } from '../../shared/middlewares/validate';
import { authenticate } from './auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();
const authController = new AuthController();

// Rate limiting pour les routes d'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: 'Trop de tentatives de connexion. Réessayez plus tard.',
});

// Schéma de validation pour le login
const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  }),
});

// Routes
router.post(
  '/login',
  authLimiter,
  validate(loginSchema.shape.body),
  authController.login.bind(authController)
);

router.post('/logout', authController.logout.bind(authController));

router.get(
  '/me',
  authenticate,
  authController.getMe.bind(authController)
);

export default router;
