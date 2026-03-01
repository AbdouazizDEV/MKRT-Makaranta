/**
 * Extension des types Express pour ajouter des propriétés personnalisées
 */

import { User } from '../../modules/auth/auth.types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
