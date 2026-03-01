/**
 * Page Dashboard admin
 */

'use client';

import { useActivites } from '@/hooks/useActivites';
import { useServices } from '@/hooks/useServices';
import { useMessages } from '@/hooks/useMessages';
import { Card, CardContent } from '@/components/ui/Card';
import { Activity, Briefcase, Mail } from 'lucide-react';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
}
