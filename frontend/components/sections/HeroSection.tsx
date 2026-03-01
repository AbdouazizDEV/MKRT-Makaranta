/**
 * Section Hero - Page d'accueil
 */

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-[#0D1B2A] to-[#1A2B3D] text-white overflow-hidden">
      {/* Image de fond avec overlay */}
      <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-[#0D1B2A] opacity-60" />

      {/* Contenu */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
          Éclairer les esprits,
          <br />
          <span className="text-[#F4A823]">bâtir l'avenir</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200">
          LUMINA œuvre pour l'éducation et l'autonomisation des jeunes en Afrique de l'Ouest
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/activites">
            <Button size="lg" variant="primary">
              Découvrir nos actions
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0D1B2A]">
              Nous contacter
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-[#F4A823]" />
      </div>
    </section>
  );
}
