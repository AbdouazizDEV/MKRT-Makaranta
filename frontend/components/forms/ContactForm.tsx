/**
 * Formulaire de contact
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMessages } from '@/hooks/useMessages';
import { Button } from '@/components/ui/Button';

const contactSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  subject: z.string().optional(),
  body: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { create } = useMessages();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await create(data);
      reset();
    } catch (error) {
      // L'erreur est déjà gérée par le hook useMessages
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nom *
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A823] focus:border-transparent"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A823] focus:border-transparent"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Sujet
        </label>
        <input
          id="subject"
          type="text"
          {...register('subject')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A823] focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          id="body"
          rows={6}
          {...register('body')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A823] focus:border-transparent"
        />
        {errors.body && (
          <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" variant="primary" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
      </Button>
    </form>
  );
}
