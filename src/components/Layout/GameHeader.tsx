import React from 'react';
import { Target, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { GameState } from '@/lib/supabase';

interface GameHeaderProps {
  gameState: GameState | null;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ gameState }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-red-500 mr-3" />
            <h1 className="text-2xl font-bold text-white">Glory Management</h1>
          </div>
          {gameState && (
            <div className="flex items-center space-x-6 text-white">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="font-semibold">£{gameState.total_money.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">Rep: {gameState.reputation}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">Week {gameState.game_week}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
