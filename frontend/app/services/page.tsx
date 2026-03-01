/**
 * Page des services
 */

'use client';

import { useServices } from '@/hooks/useServices';
import { Card, CardContent } from '@/components/ui/Card';
import { BookOpen, GraduationCap, Users, Heart } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  GraduationCap,
  Users,
  Heart,
};

export default function ServicesPage() {
  const { services, loading } = useServices();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <p className="text-center text-gray-600">Chargement des services...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-display font-bold text-center text-[#0D1B2A] mb-12">
        Nos Services
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => {
          const Icon = service.icon ? iconMap[service.icon] || BookOpen : BookOpen;
          return (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#F4A823] rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-[#0D1B2A] mb-2">
                  {service.title}
                </h2>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
