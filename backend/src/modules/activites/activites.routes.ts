/**
 * Routes pour les activités
 */

import { Router } from 'express';
import { z } from 'zod';
import { ActiviteController } from './activites.controller';
import { ActiviteService } from './activites.service';
import { ActiviteRepository } from './activites.repository';
import { validate } from '../../shared/middlewares/validate';
import { authenticate } from '../auth/auth.middleware';
import { uploadSingle } from '../../shared/middlewares/upload';
import pool from '../../config/database';

const router = Router();

// Injection de dépendances (respect du principe Dependency Inversion)
const repository = new ActiviteRepository(pool);
const service = new ActiviteService(repository);
const controller = new ActiviteController(service);

// Schémas de validation
const createActiviteSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  published: z.union([z.boolean(), z.string()]).optional(),
  image_alt: z.string().optional(),
});

const updateActiviteSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  published: z.union([z.boolean(), z.string()]).optional(),
  image_alt: z.string().optional(),
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
  uploadSingle,
  validate(createActiviteSchema),
  controller.create.bind(controller)
);

router.put(
  '/:id',
  authenticate,
  uploadSingle,
  validate(updateActiviteSchema),
  controller.update.bind(controller)
);

router.delete(
  '/:id',
  authenticate,
  controller.delete.bind(controller)
);

export default router;
