/**
 * Helpers pour l'authentification
 * Gère le stockage et la vérification des tokens
 */

import { User } from '@/types/user';

/**
 * Vérifie si l'utilisateur est authentifié
 * En vérifiant la présence d'un cookie (géré par le serveur)
 * Ne fait l'appel que si on est sur une page admin
 */
export async function checkAuth(): Promise<User | null> {
  // Ne pas faire l'appel sur les pages publiques
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
    return null;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (!apiUrl) {
      return null;
    }

    const response = await fetch(`${apiUrl}/auth/me`, {
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
