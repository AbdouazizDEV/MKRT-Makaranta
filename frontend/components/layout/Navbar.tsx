/**
 * Composant Navbar
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/activites', label: 'Activités' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-[#0D1B2A] text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-display font-bold text-[#F4A823]">
            LUMINA
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'hover:text-[#F4A823] transition-colors',
                  pathname === link.href && 'text-[#F4A823] font-medium'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
