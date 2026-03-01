/**
 * Page Dashboard admin
 */

'use client';

import { useActivites } from '@/hooks/useActivites';
import { useServices } from '@/hooks/useServices';
import { useMessages } from '@/hooks/useMessages';
import { Card, CardContent } from '@/components/ui/Card';
import { Activity, Briefcase, Mail, TrendingUp } from 'lucide-react';
import { StatsChart } from '@/components/charts/StatsChart';

export default function DashboardPage() {
  const { activites } = useActivites(true);
  const { services } = useServices(true);
  const { messages, unreadCount } = useMessages();

  const stats = [
    {
      label: 'Activités',
      value: activites.length,
      icon: Activity,
      color: 'bg-[#F4A823]',
    },
    {
      label: 'Services',
      value: services.length,
      icon: Briefcase,
      color: 'bg-[#0D1B2A]',
    },
    {
      label: 'Messages',
      value: messages.length,
      unread: unreadCount,
      icon: Mail,
      color: 'bg-blue-500',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-[#0D1B2A] mb-8">
        Dashboard
      </h1>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#0D1B2A]">
                      {stat.value}
                    </p>
                    {stat.unread !== undefined && stat.unread > 0 && (
                      <p className="text-sm text-red-600 mt-1">
                        {stat.unread} non lus
                      </p>
                    )}
                  </div>
                  <div className={`${stat.color} p-4 rounded-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Graphique en courbes */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-[#0D1B2A]" />
            <h2 className="text-2xl font-display font-bold text-[#0D1B2A]">
              Évolution des données (6 derniers mois)
            </h2>
          </div>
          <StatsChart 
            activites={activites} 
            services={services} 
            messages={messages} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
