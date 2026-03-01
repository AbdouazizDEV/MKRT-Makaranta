/**
 * Page de détails d'une activité
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Activite } from '@/types/activite';
import { ApiResponse } from '@/lib/api.types';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ActiviteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activite, setActivite] = useState<Activite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivite = async () => {
      try {
        setLoading(true);
        const response = await api.get<ApiResponse<Activite>>(`/activites/${id}`);
        if (response.data.success && response.data.data) {
          setActivite(response.data.data);
          setError(null);
        } else {
          setError('Activité non trouvée');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erreur lors du chargement';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActivite();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <p className="text-gray-600">Chargement de l'activité...</p>
        </div>
      </div>
    );
  }

  if (error || !activite) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-[#0D1B2A] mb-4">
            Activité non trouvée
          </h1>
          <p className="text-gray-600 mb-8">{error || "L'activité demandée n'existe pas."}</p>
          <Link href="/activites">
            <Button variant="primary">
              Retour aux activités
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Bouton retour */}
      <Link href="/activites">
        <Button variant="outline" className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux activités
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* Image */}
        {activite.image_url && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-xl">
            <img
              src={activite.image_url}
              alt={activite.image_alt || activite.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
          </div>
        )}

        {/* Contenu */}
        <Card>
          <CardContent className="p-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[#0D1B2A] mb-6">
              {activite.title}
            </h1>

            {/* Date */}
            <div className="flex items-center text-gray-600 mb-6">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="text-lg">{formatDate(activite.date)}</span>
            </div>

            {/* Description */}
            {activite.description && (
              <div className="prose prose-lg max-w-none mb-8">
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {activite.description}
                </div>
              </div>
            )}

            {/* Informations supplémentaires */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                {activite.image_alt && (
                  <div>
                    <span className="font-semibold">Image :</span> {activite.image_alt}
                  </div>
                )}
                <div>
                  <span className="font-semibold">ID :</span> {activite.id}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
