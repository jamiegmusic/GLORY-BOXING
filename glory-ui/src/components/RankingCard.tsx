import React from 'react';

const RankingCard: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Ranking Cards</h2>
      <p className="text-gray-600">View fighter rankings and position changes.</p>
      
      <div className="mt-6">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-semibold text-orange-900 mb-2">Rankings System</h3>
          <p className="text-orange-700 text-sm">
            Track fighter positions, movement, and ranking criteria across divisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RankingCard; 