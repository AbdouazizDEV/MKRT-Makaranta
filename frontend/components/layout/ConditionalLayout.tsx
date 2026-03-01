/**
 * Layout conditionnel qui affiche la Navbar et le Footer
 * sauf sur certaines routes (comme /admin/login)
 */

'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Routes où on ne veut pas la Navbar et le Footer
  const hideLayoutRoutes = ['/admin/login'];

  const shouldHideLayout = hideLayoutRoutes.includes(pathname);

  if (shouldHideLayout) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
