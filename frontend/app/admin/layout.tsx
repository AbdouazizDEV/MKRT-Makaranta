/**
 * Layout pour les pages admin
 * Exclut la page de login qui a son propre layout
 */

'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth(true); // Vérifier l'auth sur les pages admin
  const router = useRouter();

  // Ne pas appliquer le layout admin sur la page de login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    // Attendre un peu pour que useAuth ait le temps de charger
    const checkAuth = setTimeout(() => {
      if (!loading) {
        // Vérifier localStorage directement
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        
        if (!token) {
          console.log('❌ Pas de token, redirection vers login');
          router.replace('/admin/login');
          return;
        }
        
        // Si on a un token mais pas d'utilisateur, essayer de décoder le token
        if (!user && token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('✅ Token valide trouvé, utilisateur:', payload.email);
            // L'utilisateur sera défini par useAuth, on attend juste
            // Ne pas rediriger si on a un token valide
          } catch (e) {
            console.error('❌ Token invalide:', e);
            localStorage.removeItem('auth_token');
            router.replace('/admin/login');
          }
        }
      }
    }, 100); // Attendre 100ms pour que useAuth charge
    
    return () => clearTimeout(checkAuth);
  }, [user, loading, router]);

  // Vérifier aussi localStorage directement si user n'est pas encore chargé
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const hasToken = !!token;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F0E8]">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  // Si pas d'utilisateur mais qu'on a un token, attendre un peu
  if (!user && hasToken) {
    // Le token existe, useAuth devrait le charger bientôt
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F0E8]">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!user && !hasToken) {
    // Pas d'utilisateur et pas de token, rediriger
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F0E8]">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
