/**
 * Middleware de validation avec Zod
 * Valide les données de la requête (body, query, params) selon un schéma Zod
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (
  schema: ZodSchema,
  target: ValidationTarget = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[target];
      const validated = schema.parse(data);
      req[target] = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        throw ApiError.badRequest(
          `Validation échouée: ${errors.map((e) => e.message).join(', ')}`
        );
      }
      next(error);
    }
  };
};
