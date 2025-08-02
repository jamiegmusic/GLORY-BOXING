import React from 'react';

const PressCard: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Press Cards</h2>
      <p className="text-gray-600">Manage press conferences and media interactions.</p>
      
      <div className="mt-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="font-semibold text-indigo-900 mb-2">Media Management</h3>
          <p className="text-indigo-700 text-sm">
            Handle press conferences, interviews, and media relations for fighters and events.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PressCard; 