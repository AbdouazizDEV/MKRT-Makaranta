/**
 * Middleware d'authentification JWT
 * Vérifie la présence et la validité du token dans les cookies ou headers
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ApiError } from '../../shared/utils/ApiError';
import pool from '../../config/database';

const authService = new AuthService(pool);

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Récupérer le token depuis les cookies (priorité) ou Authorization header
    const token =
      req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw ApiError.unauthorized('Token d\'authentification manquant');
    }

    // Vérifier le token
    const decoded = authService.verifyToken(token);

    // Récupérer l'utilisateur complet
    const user = await authService.getUserById(decoded.id);
    if (!user) {
      throw ApiError.unauthorized('Utilisateur non trouvé');
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(ApiError.unauthorized('Erreur d\'authentification'));
    }
  }
};
