import React from 'react';

const TitleCard: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Title Cards</h2>
      <p className="text-gray-600">Manage championship belts and title fights.</p>
      
      <div className="mt-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">Championship Belts</h3>
          <p className="text-yellow-700 text-sm">
            Track title holders, mandatory challengers, and championship history.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TitleCard; 