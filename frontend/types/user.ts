/**
 * Types pour les utilisateurs
 */

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
