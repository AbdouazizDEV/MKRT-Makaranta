/**
 * Helpers pour l'authentification
 * Gère le stockage et la vérification des tokens
 */

import { User } from '@/types/user';

/**
 * Vérifie si l'utilisateur est authentifié
 * En vérifiant la présence d'un cookie (géré par le serveur)
 */
export async function checkAuth(): Promise<User | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.data || null;
    }

    return null;
  } catch {
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
