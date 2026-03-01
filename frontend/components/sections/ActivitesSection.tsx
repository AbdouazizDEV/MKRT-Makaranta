/**
 * Section Activités - Aperçu des dernières activités
 */

'use client';

import Link from 'next/link';
import { useActivites } from '@/hooks/useActivites';
import { formatDateShort } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function ActivitesSection() {
  const { activites, loading } = useActivites();
  const recentActivites = activites.slice(0, 6);

  if (loading) {
    return (
      <section className="py-20 bg-[#F5F0E8]">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600">Chargement des activités...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#F5F0E8]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-display font-bold text-center text-[#0D1B2A] mb-12">
          Nos Activités
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentActivites.map((activite) => (
            <Link key={activite.id} href={`/activites/${activite.id}`}>
              <div className="relative group cursor-pointer">
                <div className="relative h-64 overflow-hidden rounded-lg">
                  {activite.image_url ? (
                    <img
                      src={activite.image_url}
                      alt={activite.image_alt || activite.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#0D1B2A] flex items-center justify-center">
                      <span className="text-white text-lg">Pas d'image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[#0D1B2A] bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center text-white px-4">
                      <h3 className="text-xl font-semibold mb-2">{activite.title}</h3>
                      <p className="text-sm">{formatDateShort(activite.date)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/activites">
            <Button size="lg" variant="primary">
              Voir toutes les activités
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
