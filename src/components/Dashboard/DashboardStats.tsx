import React from 'react';
import { Users, Target, Zap, DollarSign } from 'lucide-react';
import { Fighter, GameState } from '@/lib/supabase';
import { GameStats } from '@/types/game';

interface DashboardStatsProps {
  fighters: Fighter[];
  gameState: GameState | null;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ fighters, gameState }) => {
  const stats: GameStats = {
    totalFighters: fighters.length,
    champions: fighters.filter(f => f.career_stage === 'champion').length,
    availableFighters: fighters.filter(f => f.is_available).length,
    totalRevenue: gameState?.total_money || 0
  };

  const statCards = [
    {
      label: 'Total Fighters',
      value: stats.totalFighters,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      label: 'Champions',
      value: stats.champions,
      icon: Target,
      color: 'text-red-400'
    },
    {
      label: 'Available',
      value: stats.availableFighters,
      icon: Zap,
      color: 'text-green-400'
    },
    {
      label: 'Total Revenue',
      value: `£${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-yellow-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{card.label}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
            <card.icon className={`w-8 h-8 ${card.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
};
