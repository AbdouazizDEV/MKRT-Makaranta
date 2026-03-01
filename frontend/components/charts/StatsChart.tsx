/**
 * Composant de graphique en courbes pour les statistiques
 */

'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Activite } from '@/types/activite';
import { Service } from '@/types/service';
import { Message } from '@/types/message';

interface StatsChartProps {
  activites: Activite[];
  services: Service[];
  messages: Message[];
}

interface ChartData {
  month: string;
  activites: number;
  services: number;
  messages: number;
}

export function StatsChart({ activites, services, messages }: StatsChartProps) {
  const chartData = useMemo(() => {
    // Obtenir les 6 derniers mois
    const months: ChartData[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      
      months.push({
        month: monthKey,
        activites: 0,
        services: 0,
        messages: 0,
      });
    }

    // Fonction helper pour trouver l'index du mois
    const getMonthIndex = (date: Date): number => {
      const year = date.getFullYear();
      const month = date.getMonth();
      
      return months.findIndex((m) => {
        const monthDate = new Date(m.month + ' 1');
        return monthDate.getMonth() === month && monthDate.getFullYear() === year;
      });
    };

    // Compter les activités par mois (utiliser created_at)
    activites.forEach((activite) => {
      const date = new Date(activite.created_at);
      const monthIndex = getMonthIndex(date);
      if (monthIndex >= 0) {
        months[monthIndex].activites++;
      }
    });

    // Compter les services par mois
    services.forEach((service) => {
      const date = new Date(service.created_at);
      const monthIndex = getMonthIndex(date);
      if (monthIndex >= 0) {
        months[monthIndex].services++;
      }
    });

    // Compter les messages par mois
    messages.forEach((message) => {
      const date = new Date(message.created_at);
      const monthIndex = getMonthIndex(date);
      if (monthIndex >= 0) {
        months[monthIndex].messages++;
      }
    });

    return months;
  }, [activites, services, messages]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="month" 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '12px'
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
        />
        <Line 
          type="monotone" 
          dataKey="activites" 
          stroke="#F4A823" 
          strokeWidth={3}
          name="Activités"
          dot={{ fill: '#F4A823', r: 5 }}
        />
        <Line 
          type="monotone" 
          dataKey="services" 
          stroke="#0D1B2A" 
          strokeWidth={3}
          name="Services"
          dot={{ fill: '#0D1B2A', r: 5 }}
        />
        <Line 
          type="monotone" 
          dataKey="messages" 
          stroke="#3b82f6" 
          strokeWidth={3}
          name="Messages"
          dot={{ fill: '#3b82f6', r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
