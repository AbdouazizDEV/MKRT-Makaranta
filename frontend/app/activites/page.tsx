/**
 * Page de la galerie d'activités
 */

'use client';

import { useActivites } from '@/hooks/useActivites';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';

export default function ActivitesPage() {
  const { activites, loading } = useActivites();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <p className="text-center text-gray-600">Chargement des activités...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-display font-bold text-center text-[#0D1B2A] mb-12">
        Nos Activités
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activites.map((activite) => (
          <Link key={activite.id} href={`/activites/${activite.id}`}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              {activite.image_url && (
                <img
                  src={activite.image_url}
                  alt={activite.image_alt || activite.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <CardContent>
                <h2 className="text-xl font-semibold text-[#0D1B2A] mb-2">
                  {activite.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {formatDate(activite.date)}
                </p>
                {activite.description && (
                  <p className="text-gray-600 line-clamp-3">
                    {activite.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
