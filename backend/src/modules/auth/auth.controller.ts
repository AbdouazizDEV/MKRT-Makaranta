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

      console.log('🔐 Tentative de connexion pour:', email);

      const authResponse = await authService.login({ email, password });

      console.log('✅ Connexion réussie pour:', email);

      // Définir le token en cookie httpOnly
      // En production, utiliser 'none' pour sameSite car frontend et backend sont sur des domaines différents
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction, // HTTPS requis en production
        sameSite: isProduction ? ('none' as const) : ('strict' as const), // 'none' pour cross-domain, 'strict' pour same-domain
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        path: '/', // Accessible sur tout le site
        domain: undefined, // Ne pas spécifier de domaine pour permettre cross-domain
      };
      
      res.cookie('token', authResponse.token, cookieOptions);

      console.log('🍪 Cookie défini avec options:', {
        httpOnly: cookieOptions.httpOnly,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path,
      });
      
      // IMPORTANT: Envoyer le token dans le header pour le frontend (nécessaire pour cross-domain)
      // Axios peut accéder aux headers personnalisés
      res.setHeader('X-Auth-Token', authResponse.token);
      res.setHeader('Access-Control-Expose-Headers', 'X-Auth-Token'); // Permettre au frontend de lire ce header
      
      console.log('🔑 Token envoyé dans header X-Auth-Token');

      res.json(ApiResponseBuilder.success(authResponse.user, 'Connexion réussie'));
    } catch (error) {
      console.error('❌ Erreur lors du login:', error);
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Déconnecte l'utilisateur en supprimant le cookie
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isProduction = process.env.NODE_ENV === 'production';
      res.clearCookie('token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'strict',
        path: '/',
      });
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
