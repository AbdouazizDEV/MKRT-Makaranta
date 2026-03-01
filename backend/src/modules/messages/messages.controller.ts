/**
 * Controller pour les messages
 */

import { Request, Response, NextFunction } from 'express';
import { MessageService } from './messages.service';
import { ApiResponseBuilder } from '../../shared/utils/ApiResponse';
import { CreateMessageDTO } from './messages.types';

export class MessageController {
  constructor(private service: MessageService) {}

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await this.service.getAll();
      res.json(ApiResponseBuilder.success(messages));
    } catch (error) {
      next(error);
    }
  }

  async getUnread(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await this.service.getUnread();
      res.json(ApiResponseBuilder.success(messages));
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const message = await this.service.getById(id);
      res.json(ApiResponseBuilder.success(message));
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateMessageDTO = req.body;
      const message = await this.service.create(data);
      res.status(201).json(ApiResponseBuilder.success(message, 'Message envoyé avec succès'));
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const message = await this.service.markAsRead(id);
      res.json(ApiResponseBuilder.success(message, 'Message marqué comme lu'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.json(ApiResponseBuilder.success(null, 'Message supprimé avec succès'));
    } catch (error) {
      next(error);
    }
  }
}
