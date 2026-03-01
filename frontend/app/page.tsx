/**
 * Page d'accueil
 */

import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ActivitesSection } from '@/components/sections/ActivitesSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ActivitesSection />
      <ContactSection />
    </>
  );
}
