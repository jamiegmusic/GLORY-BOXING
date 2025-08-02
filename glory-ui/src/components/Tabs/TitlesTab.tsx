import React from 'react';
import { Trophy, Crown, Calendar, MapPin } from 'lucide-react';

const TitlesTab = () => {
  const titleBelts = [
    {
      organization: 'WBC',
      weightClass: 'Heavyweight',
      champion: 'Oleksandr Usyk',
      record: '21-0-0',
      dateWon: '2023-08-26',
      venue: 'TKO Arena, Poland',
      opponent: 'Daniel Dubois',
      defenses: 1,
      status: 'active'
    },
    {
      organization: 'WBA',
      weightClass: 'Heavyweight',
      champion: 'Oleksandr Usyk',
      record: '21-0-0',
      dateWon: '2021-09-25',
      venue: 'Tottenham Hotspur Stadium',
      opponent: 'Anthony Joshua',
      defenses: 3,
      status: 'active'
    },
    {
      organization: 'WBC',
      weightClass: 'Light Heavyweight',
      champion: 'Carl Froch',
      record: '33-2-0',
      dateWon: '2024-01-15',
      venue: 'O2 Arena, London',
      opponent: 'Tony Bellew',
      defenses: 0,
      status: 'active'
    },
    {
      organization: 'IBF',
      weightClass: 'Heavyweight',
      champion: 'Vacant',
      record: '-',
      dateWon: '-',
      venue: '-',
      opponent: '-',
      defenses: 0,
      status: 'vacant'
    },
    {
      organization: 'WBO',
      weightClass: 'Heavyweight',
      champion: 'Vacant',
      record: '-',
      dateWon: '-',
      venue: '-',
      opponent: '-',
      defenses: 0,
      status: 'vacant'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600 text-green-100';
      case 'vacant':
        return 'bg-gray-600 text-gray-300';
      default:
        return 'bg-red-600 text-red-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h2 className="text-2xl font-bold">Title Belts</h2>
      </div>

      {/* Title Belts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {titleBelts.map((title, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <h3 className="font-semibold text-lg">{title.organization}</h3>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(title.status)}`}>
                {title.status === 'active' ? 'ACTIVE' : 'VACANT'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Weight Class</p>
                <p className="font-semibold">{title.weightClass}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Champion</p>
                <p className="font-semibold text-lg">{title.champion}</p>
                {title.status === 'active' && (
                  <p className="text-gray-300 text-sm">{title.record}</p>
                )}
              </div>

              {title.status === 'active' && (
                <>
                  <div>
                    <p className="text-gray-400 text-sm">Date Won</p>
                    <p className="text-sm">{title.dateWon}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Venue</p>
                    <p className="text-sm">{title.venue}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Defeated</p>
                    <p className="text-sm">{title.opponent}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm">Defenses</p>
                    <p className="text-sm">{title.defenses}</p>
                  </div>
                </>
              )}
            </div>

            {title.status === 'active' && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition duration-300">
                    Schedule Defense
                  </button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-300">
                    Strip Title
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Title Management */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Title Management</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Active Champions</h4>
            <p className="text-2xl font-bold text-green-400">
              {titleBelts.filter(t => t.status === 'active').length}
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Vacant Belts</h4>
            <p className="text-2xl font-bold text-gray-400">
              {titleBelts.filter(t => t.status === 'vacant').length}
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Total Defenses</h4>
            <p className="text-2xl font-bold text-blue-400">
              {titleBelts.reduce((sum, t) => sum + t.defenses, 0)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-300">
            Create Title Fight
          </button>
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-md transition duration-300">
            Unify Belts
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition duration-300">
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default TitlesTab; 