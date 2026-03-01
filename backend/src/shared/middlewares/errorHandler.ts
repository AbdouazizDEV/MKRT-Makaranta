/**
 * Middleware global de gestion des erreurs
 * Capture toutes les erreurs et retourne une réponse standardisée
 */

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponseBuilder } from '../utils/ApiResponse';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Si la réponse a déjà été envoyée, passer au middleware suivant
  if (res.headersSent) {
    return next(err);
  }

  // Si c'est une ApiError, utiliser ses propriétés
  if (err instanceof ApiError) {
    logger.error(`ApiError [${err.statusCode}]: ${err.message}`);
    res.status(err.statusCode).json(
      ApiResponseBuilder.error(err.message)
    );
    return;
  }

  // Erreur inattendue
  logger.error('Erreur inattendue:', err);
  res.status(500).json(
    ApiResponseBuilder.error(
      'Une erreur interne est survenue',
      process.env.NODE_ENV === 'development' ? err.message : undefined
    )
  );
};
