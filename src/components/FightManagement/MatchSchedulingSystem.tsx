import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Fighter, Match, WeightClass } from '../../lib/unified-types';
import { GloryCombatEngine } from '../../lib/combat-engine';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import { Calendar } from '../ui/calendar';

interface MatchSchedulingSystemProps {
  fighters: Fighter[];
  onMatchScheduled: (match: Match) => void;
  onFightCompleted: (result: any) => void;
}

export const MatchSchedulingSystem: React.FC<MatchSchedulingSystemProps> = ({
  fighters,
  onMatchScheduled,
  onFightCompleted
}) => {
  const [selectedFighterA, setSelectedFighterA] = useState<string>('');
  const [selectedFighterB, setSelectedFighterB] = useState<string>('');
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>('');
  const [scheduledRounds, setScheduledRounds] = useState<number>(12);
  const [fightDate, setFightDate] = useState<Date>(new Date());
  const [venue, setVenue] = useState<string>('O2 Arena, London');
  const [titleFight, setTitleFight] = useState<boolean>(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableFighters, setAvailableFighters] = useState<Fighter[]>([]);

  const combatEngine = new GloryCombatEngine();

  useEffect(() => {
    // Filter available fighters based on weight class
    if (selectedWeightClass) {
      const filtered = fighters.filter(fighter => 
        fighter.weight_class === selectedWeightClass && 
        !fighter.is_injured && 
        fighter.is_available
      );
      setAvailableFighters(filtered);
    } else {
      const available = fighters.filter(fighter => 
        !fighter.is_injured && 
        fighter.is_available
      );
      setAvailableFighters(available);
    }
  }, [fighters, selectedWeightClass]);

  const validateMatch = (): boolean => {
    if (!selectedFighterA || !selectedFighterB) {
      setError('Please select both fighters');
      return false;
    }

    if (selectedFighterA === selectedFighterB) {
      setError('Fighters cannot fight themselves');
      return false;
    }

    if (scheduledRounds < 4 || scheduledRounds > 12) {
      setError('Rounds must be between 4 and 12');
      return false;
    }

    if (fightDate < new Date()) {
      setError('Fight date cannot be in the past');
      return false;
    }

    setError(null);
    return true;
  };

  const scheduleMatch = async () => {
    if (!validateMatch()) return;

    setIsScheduling(true);
    setError(null);

    try {
      const matchData = {
        fighter_a: selectedFighterA,
        fighter_b: selectedFighterB,
        venue,
        scheduled_rounds: scheduledRounds,
        fight_date: fightDate.toISOString(),
        title_fight: titleFight,
        status: 'scheduled' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('fights')
        .insert([matchData])
        .select()
        .single();

      if (error) throw error;

      onMatchScheduled(data);
      
      // Reset form
      setSelectedFighterA('');
      setSelectedFighterB('');
      setScheduledRounds(12);
      setFightDate(new Date());
      setTitleFight(false);
    } catch (err) {
      console.error('Error scheduling match:', err);
      setError('Failed to schedule match. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  const simulateFight = async () => {
    if (!selectedFighterA || !selectedFighterB) {
      setError('Please select both fighters to simulate');
      return;
    }

    const fighterA = fighters.find(f => f.id === selectedFighterA);
    const fighterB = fighters.find(f => f.id === selectedFighterB);

    if (!fighterA || !fighterB) {
      setError('Selected fighters not found');
      return;
    }

    try {
      const match: Match = {
        id: 'simulation',
        fighter_a: selectedFighterA,
        fighter_b: selectedFighterB,
        venue,
        scheduled_rounds: scheduledRounds,
        title_fight: titleFight,
        fight_date: new Date(),
        status: 'in_progress',
        created_at: new Date(),
        updated_at: new Date()
      };

      const result = await combatEngine.simulateFight(match, [fighterA, fighterB]);
      
      // Update fighter records
      await updateFighterRecords(fighterA, fighterB, result);
      
      onFightCompleted(result);
    } catch (err) {
      console.error('Error simulating fight:', err);
      setError('Failed to simulate fight. Please try again.');
    }
  };

  const updateFighterRecords = async (fighterA: Fighter, fighterB: Fighter, result: any) => {
    try {
      const winner = result.winner === fighterA.id ? fighterA : fighterB;
      const loser = result.winner === fighterA.id ? fighterB : fighterA;

      // Update winner record
      await supabase
        .from('fighters')
        .update({
          record_wins: winner.record_wins + 1,
          knockouts: result.method === 'ko' || result.method === 'tko' ? winner.knockouts + 1 : winner.knockouts,
          total_rounds_fought: winner.total_rounds_fought + result.rounds,
          updated_at: new Date().toISOString()
        })
        .eq('id', winner.id);

      // Update loser record
      await supabase
        .from('fighters')
        .update({
          record_losses: loser.record_losses + 1,
          total_rounds_fought: loser.total_rounds_fought + result.rounds,
          updated_at: new Date().toISOString()
        })
        .eq('id', loser.id);
    } catch (err) {
      console.error('Error updating fighter records:', err);
    }
  };

  const getFighterDisplayName = (fighter: Fighter) => {
    return `${fighter.name}${fighter.nickname ? ` "${fighter.nickname}"` : ''} (${fighter.record_wins}-${fighter.record_losses}-${fighter.record_draws})`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Schedule Match</h2>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weight Class Filter */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Weight Class</h3>
            <Select
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
          </Card>

          {/* Fight Details */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Fight Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rounds
                </label>
                <Select
                  value={scheduledRounds}
                  onChange={(e) => setScheduledRounds(parseInt(e.target.value))}
                >
                  <option value={4}>4 Rounds</option>
                  <option value={6}>6 Rounds</option>
                  <option value={8}>8 Rounds</option>
                  <option value={10}>10 Rounds</option>
                  <option value={12}>12 Rounds</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  placeholder="Enter venue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fight Date
                </label>
                <input
                  type="date"
                  value={fightDate.toISOString().split('T')[0]}
                  onChange={(e) => setFightDate(new Date(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="titleFight"
                  checked={titleFight}
                  onChange={(e) => setTitleFight(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="titleFight" className="text-gray-300">
                  Title Fight
                </label>
              </div>
            </div>
          </Card>

          {/* Fighter Selection */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Fighter A</h3>
            <Select
              value={selectedFighterA}
              onChange={(e) => setSelectedFighterA(e.target.value)}
            >
              <option value="">Select Fighter A</option>
              {availableFighters.map(fighter => (
                <option key={fighter.id} value={fighter.id}>
                  {getFighterDisplayName(fighter)}
                </option>
              ))}
            </Select>
            
            {selectedFighterA && (
              <div className="mt-4 p-3 bg-gray-700 rounded">
                <h4 className="font-semibold text-white">
                  {getFighterDisplayName(availableFighters.find(f => f.id === selectedFighterA)!)}
                </h4>
                <p className="text-gray-300 text-sm">
                  {availableFighters.find(f => f.id === selectedFighterA)?.weight_class.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            )}
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Fighter B</h3>
            <Select
              value={selectedFighterB}
              onChange={(e) => setSelectedFighterB(e.target.value)}
            >
              <option value="">Select Fighter B</option>
              {availableFighters
                .filter(fighter => fighter.id !== selectedFighterA)
                .map(fighter => (
                  <option key={fighter.id} value={fighter.id}>
                    {getFighterDisplayName(fighter)}
                  </option>
                ))}
            </Select>
            
            {selectedFighterB && (
              <div className="mt-4 p-3 bg-gray-700 rounded">
                <h4 className="font-semibold text-white">
                  {getFighterDisplayName(availableFighters.find(f => f.id === selectedFighterB)!)}
                </h4>
                <p className="text-gray-300 text-sm">
                  {availableFighters.find(f => f.id === selectedFighterB)?.weight_class.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            onClick={simulateFight}
            variant="secondary"
            disabled={!selectedFighterA || !selectedFighterB || isScheduling}
          >
            Simulate Fight
          </Button>
          <Button
            onClick={scheduleMatch}
            disabled={!selectedFighterA || !selectedFighterB || isScheduling}
            loading={isScheduling}
          >
            {isScheduling ? 'Scheduling...' : 'Schedule Match'}
          </Button>
        </div>

        {/* Available Fighters Summary */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Available Fighters ({availableFighters.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableFighters.slice(0, 6).map(fighter => (
              <div key={fighter.id} className="bg-gray-700 p-3 rounded">
                <h4 className="font-semibold text-white">{fighter.name}</h4>
                <p className="text-gray-300 text-sm">
                  {fighter.weight_class.replace('_', ' ').toUpperCase()} • {fighter.record_wins}-{fighter.record_losses}-{fighter.record_draws}
                </p>
              </div>
            ))}
            {availableFighters.length > 6 && (
              <div className="bg-gray-700 p-3 rounded flex items-center justify-center">
                <span className="text-gray-300">+{availableFighters.length - 6} more</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 