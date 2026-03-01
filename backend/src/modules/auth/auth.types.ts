/**
 * Types pour le module d'authentification
 */

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
  };
  token: string;
}
