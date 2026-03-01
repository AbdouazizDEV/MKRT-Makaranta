/**
 * Helpers pour l'authentification
 * Gère le stockage et la vérification des tokens
 */

import { User } from '@/types/user';

/**
 * Vérifie si l'utilisateur est authentifié
 * En vérifiant la présence d'un token dans localStorage
 * Plus besoin d'appeler l'API
 */
export function checkAuth(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem('auth_token');
  if (!token) {
    return null;
  }

  try {
    // Décoder le token JWT pour récupérer les infos utilisateur
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    // Token invalide, le supprimer
    localStorage.removeItem('auth_token');
    return null;
  }
}

/**
 * Déconnecte l'utilisateur
 */
export async function logout(): Promise<void> {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
}
