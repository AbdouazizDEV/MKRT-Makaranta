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
  const { user, loading } = useAuth();
  const router = useRouter();

  // Ne pas appliquer le layout admin sur la page de login
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5F0E8]">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F0E8]">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
