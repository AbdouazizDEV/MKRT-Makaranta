/**
 * Controller pour les services
 */

import { Request, Response, NextFunction } from 'express';
import { ServiceService } from './services.service';
import { ApiResponseBuilder } from '../../shared/utils/ApiResponse';
import { CreateServiceDTO, UpdateServiceDTO } from './services.types';

export class ServiceController {
  constructor(private service: ServiceService) {}

  async getPublished(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const services = await this.service.getPublished();
      res.json(ApiResponseBuilder.success(services));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const service = await this.service.getById(id);
      res.json(ApiResponseBuilder.success(service));
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const services = await this.service.getAll();
      res.json(ApiResponseBuilder.success(services));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateServiceDTO = {
        ...req.body,
        published: req.body.published === 'true' || req.body.published === true,
        order_index: req.body.order_index ? Number(req.body.order_index) : undefined,
      };

      const service = await this.service.create(data);
      res.status(201).json(ApiResponseBuilder.success(service, 'Service créé avec succès'));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateServiceDTO = { ...req.body };

      if (updateData.published !== undefined) {
        if (typeof updateData.published === 'string') {
          updateData.published = updateData.published === 'true';
        }
        // Si c'est déjà un boolean, on le garde tel quel
      }
      if (updateData.order_index !== undefined) {
        updateData.order_index = Number(updateData.order_index);
      }

      const service = await this.service.update(id, updateData);
      res.json(ApiResponseBuilder.success(service, 'Service mis à jour avec succès'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.json(ApiResponseBuilder.success(null, 'Service supprimé avec succès'));
    } catch (error) {
      next(error);
    }
  }
}
