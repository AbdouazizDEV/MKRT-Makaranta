/**
 * Controller d'authentification
 * Gère les requêtes HTTP liées à l'authentification
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ApiResponseBuilder } from '../../shared/utils/ApiResponse';
import { ApiError } from '../../shared/utils/ApiError';
import pool from '../../config/database';

const authService = new AuthService(pool);

export class AuthController {
  /**
   * POST /api/auth/login
   * Authentifie un utilisateur et retourne un token
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const authResponse = await authService.login({ email, password });

      // Définir le token en cookie httpOnly
      res.cookie('token', authResponse.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      });

      res.json(ApiResponseBuilder.success(authResponse.user, 'Connexion réussie'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Déconnecte l'utilisateur en supprimant le cookie
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie('token');
      res.json(ApiResponseBuilder.success(null, 'Déconnexion réussie'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Retourne les informations de l'utilisateur connecté
   */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Utilisateur non authentifié');
      }

      const userInfo = {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      };

      res.json(ApiResponseBuilder.success(userInfo));
    } catch (error) {
      next(error);
    }
  }
}
