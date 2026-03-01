/**
 * Layout racine de l'application
 */

import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { ConditionalLayout } from '@/components/layout/ConditionalLayout';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LUMINA - Éclairer les esprits, bâtir l\'avenir',
  description: 'ONG dédiée à l\'éducation et à l\'autonomisation des jeunes en Afrique de l\'Ouest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
