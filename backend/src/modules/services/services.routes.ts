/**
 * Routes pour les services
 */

import { Router } from 'express';
import { z } from 'zod';
import { ServiceController } from './services.controller';
import { ServiceService } from './services.service';
import { ServiceRepository } from './services.repository';
import { validate } from '../../shared/middlewares/validate';
import { authenticate } from '../auth/auth.middleware';
import pool from '../../config/database';

const router = Router();

const repository = new ServiceRepository(pool);
const service = new ServiceService(repository);
const controller = new ServiceController(service);

const createServiceSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  icon: z.string().optional(),
  order_index: z.number().int().min(0).optional(),
  published: z.union([z.boolean(), z.string()]).optional(),
});

const updateServiceSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  icon: z.string().optional(),
  order_index: z.number().int().min(0).optional(),
  published: z.union([z.boolean(), z.string()]).optional(),
});

// Routes protégées (admin) - doivent être avant les routes avec paramètres
router.get(
  '/admin/all',
  authenticate,
  controller.getAll.bind(controller)
);

// Routes publiques
router.get('/', controller.getPublished.bind(controller));
router.get('/:id', controller.getById.bind(controller));

// Routes protégées (admin)
router.post(
  '/',
  authenticate,
  validate(createServiceSchema),
  controller.create.bind(controller)
);

router.put(
  '/:id',
  authenticate,
  validate(updateServiceSchema),
  controller.update.bind(controller)
);

router.delete(
  '/:id',
  authenticate,
  controller.delete.bind(controller)
);

export default router;
