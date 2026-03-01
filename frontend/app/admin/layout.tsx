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
    // Ne rediriger vers login que si on n'a vraiment pas de token
    // Si on a un token, attendre que useAuth le charge
    const timeoutId = setTimeout(() => {
      if (!loading) {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        
        // Si pas de token ET pas d'utilisateur, rediriger vers login
        if (!token && !user) {
          console.log('❌ Pas de token ni utilisateur, redirection vers login');
          router.replace('/admin/login');
          return;
        }
        
        // Si on a un token mais pas d'utilisateur après 500ms, c'est suspect
        // Mais on attend quand même un peu plus
        if (token && !user) {
          console.log('⏳ Token présent, attente chargement utilisateur...');
          // Ne pas rediriger, attendre que useAuth charge
        }
      }
    }, 500); // Attendre 500ms avant de vérifier
    
    return () => clearTimeout(timeoutId);
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

  // Si pas d'utilisateur mais qu'on a un token, attendre que useAuth charge
  // Ne pas rediriger immédiatement, laisser useAuth faire son travail
  if (!user && hasToken) {
    // Le token existe, useAuth devrait le charger
    // Attendre jusqu'à 2 secondes avant de rediriger
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F0E8]">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  // Seulement rediriger si vraiment pas de token ET pas d'utilisateur
  if (!user && !hasToken) {
    // Pas d'utilisateur et pas de token, ne rien afficher (redirection en cours)
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F0E8]">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
