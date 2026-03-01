/**
 * Middleware Next.js pour protéger les routes admin
 * Note: L'authentification est maintenant gérée par le layout admin avec localStorage
 * Ce middleware ne fait plus de vérification pour éviter les conflits
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Laisser passer toutes les requêtes
  // L'authentification est gérée côté client par le layout admin
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
