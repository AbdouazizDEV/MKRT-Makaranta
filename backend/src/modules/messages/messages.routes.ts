/**
 * Routes pour les messages
 */

import { Router } from 'express';
import { z } from 'zod';
import { MessageController } from './messages.controller';
import { MessageService } from './messages.service';
import { MessageRepository } from './messages.repository';
import { validate } from '../../shared/middlewares/validate';
import { authenticate } from '../auth/auth.middleware';
import rateLimit from 'express-rate-limit';
import pool from '../../config/database';

const router = Router();

const repository = new MessageRepository(pool);
const service = new MessageService(repository);
const controller = new MessageController(service);

// Rate limiting pour le formulaire de contact
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 messages max
  message: 'Trop de messages envoyés. Réessayez plus tard.',
});

const createMessageSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  subject: z.string().optional(),
  body: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

// Route publique
router.post(
  '/',
  contactLimiter,
  validate(createMessageSchema),
  controller.create.bind(controller)
);

// Routes protégées (admin)
router.get(
  '/',
  authenticate,
  controller.getAll.bind(controller)
);

router.get(
  '/unread',
  authenticate,
  controller.getUnread.bind(controller)
);

router.get(
  '/:id',
  authenticate,
  controller.getById.bind(controller)
);

router.patch(
  '/:id/read',
  authenticate,
  controller.markAsRead.bind(controller)
);

router.delete(
  '/:id',
  authenticate,
  controller.delete.bind(controller)
);

export default router;
