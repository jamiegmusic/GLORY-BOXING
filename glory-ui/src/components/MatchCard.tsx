import React from 'react';

const MatchCard: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Match Cards</h2>
      <p className="text-gray-600">View and manage individual match details and results.</p>
      
      <div className="mt-6">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">Match Details</h3>
          <p className="text-purple-700 text-sm">
            Display match information, fighter details, and fight results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchCard; 