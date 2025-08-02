import React, { useState } from 'react';
import { Fighter } from '../../lib/supabase';
import { WeightClass } from '../../lib/unified-types';
import { Card } from '../ui/card';
import { Select } from '../ui/select';

interface FighterRosterProps {
  fighters: Fighter[];
  onFighterSelected: (fighter: Fighter) => void;
}

export const FighterRoster: React.FC<FighterRosterProps> = ({
  fighters,
  onFighterSelected
}) => {
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFighters = fighters.filter(fighter => {
    const matchesWeightClass = !selectedWeightClass || fighter.weight_class === selectedWeightClass;
    const matchesSearch = !searchTerm || 
      fighter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fighter.nickname && fighter.nickname.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesWeightClass && matchesSearch;
  });

  const sortedFighters = [...filteredFighters].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'record':
        const aRecord = a.record_wins - a.record_losses;
        const bRecord = b.record_wins - b.record_losses;
        return bRecord - aRecord;
      case 'experience':
        return b.experience_level - a.experience_level;
      case 'age':
        return a.age - b.age;
      case 'confidence':
        return b.confidence - a.confidence;
      default:
        return 0;
    }
  });

  const getCareerStageColor = (stage: string) => {
    switch (stage) {
      case 'champion': return 'bg-yellow-600 text-white';
      case 'contender': return 'bg-blue-600 text-white';
      case 'prospect': return 'bg-green-600 text-white';
      case 'amateur': return 'bg-gray-600 text-white';
      case 'legend': return 'bg-purple-600 text-white';
      case 'retired': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getAvailabilityColor = (isAvailable: boolean, isInjured: boolean) => {
    if (isInjured) return 'text-red-400';
    if (isAvailable) return 'text-green-400';
    return 'text-yellow-400';
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search fighters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <Select
          label="Weight Class"
          value={selectedWeightClass}
          onChange={(e) => setSelectedWeightClass(e.target.value)}
        >
          <option value="">All Weight Classes</option>
          {Object.entries(WeightClass).map(([key, value]) => (
            <option key={value} value={value}>
              {key.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </Select>

        <Select
          label="Sort By"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="record">Record</option>
          <option value="experience">Experience</option>
          <option value="age">Age</option>
          <option value="confidence">Confidence</option>
        </Select>
      </div>

      {/* Fighter Count */}
      <div className="text-gray-300 text-sm">
        Showing {sortedFighters.length} of {fighters.length} fighters
      </div>

      {/* Fighter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedFighters.map(fighter => (
          <Card
            key={fighter.id}
            className="p-4 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => onFighterSelected(fighter)}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white text-lg">{fighter.name}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getCareerStageColor(fighter.career_stage)}`}>
                {fighter.career_stage}
              </span>
            </div>
            
            {fighter.nickname && (
              <p className="text-blue-400 text-sm mb-2">"{fighter.nickname}"</p>
            )}
            
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                {fighter.weight_class.replace('_', ' ').toUpperCase()} • {fighter.age} years old
              </p>
              <p className="text-gray-300">
                Record: {fighter.record_wins}-{fighter.record_losses}-{fighter.record_draws}
                {fighter.knockouts > 0 && ` (${fighter.knockouts} KOs)`}
              </p>
              <p className="text-gray-300">
                {fighter.hometown}, {fighter.nationality}
              </p>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <span className="text-gray-400 text-xs">Power:</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full" 
                        style={{ width: `${fighter.punching_power}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-300 text-xs">{fighter.punching_power}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400 text-xs">Speed:</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${fighter.speed}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-300 text-xs">{fighter.speed}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400 text-xs">Defense:</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{ width: `${fighter.defense}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-300 text-xs">{fighter.defense}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-400 text-xs">Stamina:</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-yellow-500 h-1.5 rounded-full" 
                        style={{ width: `${fighter.stamina}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-300 text-xs">{fighter.stamina}</span>
                  </div>
                </div>
              </div>
              
              {/* Status and Financial */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs ${getAvailabilityColor(fighter.is_available, fighter.is_injured)}`}>
                    {fighter.is_injured ? 'Injured' : fighter.is_available ? 'Available' : 'Unavailable'}
                  </span>
                  <span className="text-gray-400 text-xs">Exp: {fighter.experience_level}</span>
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-xs font-medium">
                    £{fighter.current_purse.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs">
                    Conf: {fighter.confidence}%
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sortedFighters.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No fighters found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}; 