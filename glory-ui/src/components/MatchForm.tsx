import React from 'react';

const MatchForm: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Match Form</h2>
      <p className="text-gray-600">Schedule and manage boxing matches.</p>
      
      <div className="mt-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Match Scheduling</h3>
          <p className="text-green-700 text-sm">
            Create new matches, set venues, and manage fight cards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchForm; 