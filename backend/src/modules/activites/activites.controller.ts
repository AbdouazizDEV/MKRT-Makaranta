/**
 * Controller pour les activités
 * Gère les requêtes HTTP
 */

import { Request, Response, NextFunction } from 'express';
import { ActiviteService } from './activites.service';
import { ApiResponseBuilder } from '../../shared/utils/ApiResponse';
import { ApiError } from '../../shared/utils/ApiError';
import { uploadToCloudinary } from '../../shared/utils/cloudinary';
import { CreateActiviteDTO, UpdateActiviteDTO } from './activites.types';

export class ActiviteController {
  constructor(private service: ActiviteService) {}

  /**
   * GET /api/activites
   * Liste publique des activités publiées
   */
  async getPublished(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activites = await this.service.getPublished();
      res.json(ApiResponseBuilder.success(activites));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/activites/:id
   * Détail d'une activité
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const activite = await this.service.getById(id);
      res.json(ApiResponseBuilder.success(activite));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/activites
   * Liste complète (admin uniquement, avec non publiées)
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activites = await this.service.getAll();
      res.json(ApiResponseBuilder.success(activites));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/activites
   * Créer une activité (avec upload d'image)
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      let imageUrl: string | undefined;
      let imageAlt: string | undefined;

      // Upload de l'image vers Cloudinary si fournie
      if (file) {
        const uploadResult = await uploadToCloudinary(file.buffer);
        imageUrl = uploadResult.url;
        imageAlt = req.body.image_alt || req.body.title || 'Image activité';
      }

      const data: CreateActiviteDTO = {
        title: req.body.title,
        description: req.body.description,
        image_url: imageUrl,
        image_alt: imageAlt,
        date: req.body.date,
        published: req.body.published === 'true' || req.body.published === true,
      };

      const activite = await this.service.create(data);
      res.status(201).json(ApiResponseBuilder.success(activite, 'Activité créée avec succès'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/activites/:id
   * Modifier une activité
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const file = req.file;
      const updateData: UpdateActiviteDTO = { ...req.body };

      // Upload de la nouvelle image si fournie
      if (file) {
        const uploadResult = await uploadToCloudinary(file.buffer);
        updateData.image_url = uploadResult.url;
        if (!updateData.image_alt) {
          updateData.image_alt = req.body.image_alt || req.body.title || 'Image activité';
        }
      }

      // Convertir published en boolean si présent
      if (updateData.published !== undefined) {
        updateData.published = updateData.published === 'true' || updateData.published === true;
      }

      const activite = await this.service.update(id, updateData);
      res.json(ApiResponseBuilder.success(activite, 'Activité mise à jour avec succès'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/activites/:id
   * Supprimer une activité
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.json(ApiResponseBuilder.success(null, 'Activité supprimée avec succès'));
    } catch (error) {
      next(error);
    }
  }
}
