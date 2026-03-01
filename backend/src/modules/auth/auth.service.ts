/**
 * Service d'authentification
 * Gère la logique métier : vérification des identifiants, génération de tokens
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import env from '../../config/env';
import { ApiError } from '../../shared/utils/ApiError';
import { LoginDTO, AuthResponse, User } from './auth.types';

export class AuthService {
  constructor(private db: Pool) {}

  /**
   * Authentifie un utilisateur et génère un token JWT
   */
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      // Récupérer l'utilisateur par email
      const result = await this.db.query<User>(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        throw ApiError.unauthorized('Email ou mot de passe incorrect');
      }

      const user = result.rows[0];

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw ApiError.unauthorized('Email ou mot de passe incorrect');
      }

      // Générer le token JWT
      const payload = { id: user.id, email: user.email, role: user.role };
      // @ts-ignore - expiresIn accepte string (comme "7d") mais le type est strict
      const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      // Log l'erreur pour le débogage
      console.error('Erreur lors du login:', error);
      
      // Si c'est déjà une ApiError, la relancer
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Sinon, envelopper dans une erreur générique
      throw ApiError.internal('Erreur lors de l\'authentification');
    }
  }

  /**
   * Récupère les informations d'un utilisateur par son ID
   */
  async getUserById(userId: string): Promise<User | null> {
    const result = await this.db.query<User>(
      'SELECT id, email, role, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    );

    return result.rows[0] || null;
  }

  /**
   * Vérifie la validité d'un token JWT
   */
  verifyToken(token: string): { id: string; email: string; role: string } {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as {
        id: string;
        email: string;
        role: string;
      };
      return decoded;
    } catch (error) {
      throw ApiError.unauthorized('Token invalide ou expiré');
    }
  }
}
