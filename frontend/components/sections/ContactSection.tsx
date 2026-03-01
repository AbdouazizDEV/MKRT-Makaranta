/**
 * Section Contact avec formulaire
 */

'use client';

import { ContactForm } from '@/components/forms/ContactForm';

export function ContactSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-display font-bold text-center text-[#0D1B2A] mb-4">
            Contactez-nous
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Une question ? Une suggestion ? N'hésitez pas à nous écrire.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
