import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Trophy } from 'lucide-react';

const RankingsTab = () => {
  const [selectedWeightClass, setSelectedWeightClass] = useState('Heavyweight');

  const weightClasses = ['Heavyweight', 'Light Heavyweight', 'Middleweight', 'Welterweight'];
  
  const rankings = [
    {
      rank: 1,
      name: 'Oleksandr Usyk',
      record: '21-0-0',
      movement: 'up',
      lastFight: 'W vs Dmitry Bivol',
      belt: 'WBA'
    },
    {
      rank: 2,
      name: 'Dmitry Bivol',
      record: '21-1-0',
      movement: 'down',
      lastFight: 'L vs Oleksandr Usyk',
      belt: null
    },
    {
      rank: 3,
      name: 'Carl Froch',
      record: '33-2-0',
      movement: 'up',
      lastFight: 'W vs Tony Bellew',
      belt: 'WBC'
    },
    {
      rank: 4,
      name: 'Tony Bellew',
      record: '30-3-1',
      movement: 'down',
      lastFight: 'L vs Carl Froch',
      belt: null
    },
    {
      rank: 5,
      name: 'Jermell Charlo',
      record: '35-1-1',
      movement: 'none',
      lastFight: 'W vs Previous Opponent',
      belt: null
    }
  ];

  const getMovementIcon = (movement: string) => {
    switch (movement) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold">Fighter Rankings</h2>
      </div>

      {/* Weight Class Selector */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Weight Class</h3>
        <div className="flex space-x-2">
          {weightClasses.map((weightClass) => (
            <button
              key={weightClass}
              onClick={() => setSelectedWeightClass(weightClass)}
              className={`px-4 py-2 rounded-md transition duration-300 ${
                selectedWeightClass === weightClass
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {weightClass}
            </button>
          ))}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{selectedWeightClass} Rankings</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-medium">Rank</th>
                <th className="text-left py-3 px-4 font-medium">Fighter</th>
                <th className="text-left py-3 px-4 font-medium">Record</th>
                <th className="text-left py-3 px-4 font-medium">Movement</th>
                <th className="text-left py-3 px-4 font-medium">Last Fight</th>
                <th className="text-left py-3 px-4 font-medium">Title</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((fighter) => (
                <tr key={fighter.rank} className="border-b border-gray-700 hover:bg-gray-700 transition duration-200">
                  <td className="py-3 px-4">
                    <span className="font-bold text-lg">{fighter.rank}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold">{fighter.name}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{fighter.record}</td>
                  <td className="py-3 px-4">
                    {getMovementIcon(fighter.movement)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">{fighter.lastFight}</td>
                  <td className="py-3 px-4">
                    {fighter.belt ? (
                      <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                        <Trophy className="w-3 h-3" />
                        <span>{fighter.belt}</span>
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ranking Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Ranking Management</h3>
            <p className="text-gray-400 text-sm">Update rankings after recent fights</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-300">
            Update Rankings
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankingsTab; 