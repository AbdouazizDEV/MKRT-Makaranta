/**
 * Middleware Next.js pour protéger les routes admin
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si on accède à une route admin
  if (pathname.startsWith('/admin')) {
    // Exclure la route de login
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Vérifier la présence du cookie token
    const token = request.cookies.get('token');

    if (!token) {
      // Rediriger vers la page de login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
