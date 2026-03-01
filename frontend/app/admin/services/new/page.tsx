/**
 * Page de création/édition de service
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useServices } from '@/hooks/useServices';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { Service } from '@/types/service';
import { ApiResponse } from '@/lib/api.types';

const serviceSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  icon: z.string().optional(),
  order_index: z.number().int().min(0).optional(),
  published: z.boolean().optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function ServiceFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { create, update } = useServices(true);
  const [existingService, setExistingService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      api.get<ApiResponse<Service>>(`/services/${id}`).then((response) => {
        if (response.data.success && response.data.data) {
          const service = response.data.data;
          setExistingService(service);
          setValue('title', service.title);
          setValue('description', service.description);
          setValue('icon', service.icon || '');
          setValue('order_index', service.order_index);
          setValue('published', service.published);
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
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      published: true,
      order_index: 0,
    },
  });

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (id && existingService) {
        await update(id, data);
      } else {
        await create(data);
      }
      router.push('/admin/services');
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
        {id ? 'Modifier le service' : 'Nouveau service'}
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
            Description *
          </label>
          <textarea
            rows={6}
            {...register('description')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A823]"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icône (BookOpen, GraduationCap, Users, Heart)
          </label>
          <input
            type="text"
            {...register('icon')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A823]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordre d'affichage
          </label>
          <input
            type="number"
            {...register('order_index', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A823]"
          />
        </div>

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
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
}
