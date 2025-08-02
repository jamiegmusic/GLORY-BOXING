import React from 'react';

const FighterManagement: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Fighter Management</h2>
      <p className="text-gray-600">Manage your boxing roster and fighter profiles.</p>
      
      <div className="mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Fighter Database</h3>
          <p className="text-blue-700 text-sm">
            View, edit, and manage fighter profiles, statistics, and career information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FighterManagement; 