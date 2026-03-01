/**
 * Sidebar pour le dashboard admin
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Activity, Briefcase, Mail, LogOut } from 'lucide-react';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/activites', label: 'Activités', icon: Activity },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-[#0D1B2A] text-white min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-display font-bold text-[#F4A823] mb-8">
          LUMINA Admin
        </h1>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-[#F4A823] text-[#0D1B2A]'
                    : 'hover:bg-[#1A2B3D]'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="mt-8 w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#1A2B3D] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
