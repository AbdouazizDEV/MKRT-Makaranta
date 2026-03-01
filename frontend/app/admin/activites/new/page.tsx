/**
 * Page de création/édition d'activité
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActivites } from '@/hooks/useActivites';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import api from '@/lib/api';
import { Activite } from '@/types/activite';
import { ApiResponse } from '@/lib/api.types';

const activiteSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide'),
  published: z.boolean().optional(),
  image_alt: z.string().optional(),
});

type ActiviteFormData = z.infer<typeof activiteSchema>;

export default function ActiviteFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { create, update } = useActivites(true);
  const [image, setImage] = useState<File | null>(null);
  const [existingActivite, setExistingActivite] = useState<Activite | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      api.get<ApiResponse<Activite>>(`/activites/${id}`).then((response) => {
        if (response.data.success && response.data.data) {
          const activite = response.data.data;
          setExistingActivite(activite);
          setValue('title', activite.title);
          setValue('description', activite.description || '');
          setValue('date', activite.date.split('T')[0]);
          setValue('published', activite.published);
          setValue('image_alt', activite.image_alt || '');
          setLoading(false);
        }
      });
    }
  }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ActiviteFormData>({
    resolver: zodResolver(activiteSchema),
    defaultValues: {
      published: false,
    },
  });

  const onSubmit = async (data: ActiviteFormData) => {
    try {
      if (id && existingActivite) {
        await update(id, { ...data, image: image || undefined });
      } else {
        await create({ ...data, image: image || undefined });
      }
      router.push('/admin/activites');
    } catch (error) {
      // Erreur gérée par le hook
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-display font-bold text-[#0D1B2A] mb-8">
        {id ? 'Modifier l\'activité' : 'Nouvelle activité'}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre *
          </label>
          <input
            type="text"
            {...register('title')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A823]"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            rows={6}
            {...register('description')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A823]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            {...register('date')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A823]"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <ImageUpload
          value={image || existingActivite?.image_url || null}
          onChange={setImage}
        />

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('published')}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">Publier</span>
          </label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : id ? 'Modifier' : 'Créer'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
