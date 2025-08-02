import React, { useState, useEffect } from 'react';
import { Fighter, Fight } from '../../lib/supabase';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import { WeightClass } from '../../lib/unified-types';

interface FightSchedulerProps {
  onFightCreated: (fight: Fight) => void;
}

export const FightScheduler: React.FC<FightSchedulerProps> = ({ onFightCreated }) => {
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [selectedFighter1, setSelectedFighter1] = useState<string>('');
  const [selectedFighter2, setSelectedFighter2] = useState<string>('');
  const [eventName, setEventName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueLocation, setVenueLocation] = useState('');
  const [fightDate, setFightDate] = useState('');
  const [weightClass, setWeightClass] = useState<string>('');
  const [rounds, setRounds] = useState<number>(12);
  const [isChampionship, setIsChampionship] = useState(false);
  const [titleBelt, setTitleBelt] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableFighters, setAvailableFighters] = useState<Fighter[]>([]);

  useEffect(() => {
    loadFighters();
  }, []);

  const loadFighters = async () => {
    try {
      const { data, error } = await supabase
        .from('fighters')
        .select('*')
        .eq('is_available', true)
        .eq('is_injured', false)
        .order('name');

      if (error) throw error;
      setFighters(data || []);
      setAvailableFighters(data || []);
    } catch (error) {
      console.error('Error loading fighters:', error);
    }
  };

  const getFighterById = (id: string) => {
    return fighters.find(f => f.id === parseInt(id));
  };

  const getFighterOptions = (excludeId?: string) => {
    return fighters
      .filter(f => !excludeId || f.id !== parseInt(excludeId))
      .map(fighter => ({
        value: fighter.id.toString(),
        label: `${fighter.name} (${fighter.weight_class}, ${fighter.record_wins}-${fighter.record_losses}-${fighter.record_draws})`
      }));
  };

  const validateFight = () => {
    if (!selectedFighter1 || !selectedFighter2) {
      alert('Please select both fighters');
      return false;
    }

    if (selectedFighter1 === selectedFighter2) {
      alert('A fighter cannot fight themselves');
      return false;
    }

    if (!eventName.trim()) {
      alert('Please enter an event name');
      return false;
    }

    if (!venueName.trim()) {
      alert('Please enter a venue name');
      return false;
    }

    if (!venueLocation.trim()) {
      alert('Please enter a venue location');
      return false;
    }

    if (!fightDate) {
      alert('Please select a fight date');
      return false;
    }

    const fighter1 = getFighterById(selectedFighter1);
    const fighter2 = getFighterById(selectedFighter2);

    if (fighter1 && fighter2 && fighter1.weight_class !== fighter2.weight_class) {
      alert('Fighters must be in the same weight class');
      return false;
    }

    if (fighter1 && fighter2) {
      setWeightClass(fighter1.weight_class);
    }

    return true;
  };

  const calculateFightRevenue = (fighter1: Fighter, fighter2: Fighter) => {
    const baseRevenue = 50000;
    const fighter1Popularity = fighter1.experience_level * 100;
    const fighter2Popularity = fighter2.experience_level * 100;
    const totalPopularity = fighter1Popularity + fighter2Popularity;
    
    return Math.floor(baseRevenue + (totalPopularity * 100));
  };

  const createFight = async () => {
    if (!validateFight()) return;

    setLoading(true);
    try {
      const fighter1 = getFighterById(selectedFighter1);
      const fighter2 = getFighterById(selectedFighter2);

      if (!fighter1 || !fighter2) {
        alert('Invalid fighter selection');
        return;
      }

      const fightData = {
        fighter1_id: fighter1.id,
        fighter2_id: fighter2.id,
        event_name: eventName,
        venue_name: venueName,
        venue_location: venueLocation,
        fight_date: fightDate,
        weight_class: weightClass,
        rounds_scheduled: rounds,
        championship_fight: isChampionship,
        title_belt: isChampionship ? titleBelt : null,
        gate_receipts: calculateFightRevenue(fighter1, fighter2),
        ppv_buys: Math.floor(Math.random() * 100000) + 50000,
        total_revenue: calculateFightRevenue(fighter1, fighter2) + (Math.floor(Math.random() * 100000) + 50000) * 50,
        fight_rating: 0,
        crowd_reaction: 0,
        media_coverage_rating: 0
      };

      const { data, error } = await supabase
        .from('fights')
        .insert(fightData)
        .select()
        .single();

      if (error) throw error;

      // Update fighter availability
      await supabase
        .from('fighters')
        .update({ is_available: false })
        .in('id', [fighter1.id, fighter2.id]);

      onFightCreated(data);
      
      // Reset form
      setSelectedFighter1('');
      setSelectedFighter2('');
      setEventName('');
      setVenueName('');
      setVenueLocation('');
      setFightDate('');
      setWeightClass('');
      setRounds(12);
      setIsChampionship(false);
      setTitleBelt('');

      alert('Fight scheduled successfully!');
    } catch (error) {
      console.error('Error creating fight:', error);
      alert('Failed to schedule fight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateEventName = () => {
    const eventNames = [
      'Fight Night',
      'Championship Showdown',
      'Battle Royale',
      'The Main Event',
      'Fight Club',
      'Boxing Spectacular',
      'The Showdown',
      'Fight Night Live',
      'Championship Boxing',
      'The Big Fight'
    ];
    return eventNames[Math.floor(Math.random() * eventNames.length)];
  };

  const generateVenue = () => {
    const venues = [
      { name: 'Wembley Arena', location: 'London, UK' },
      { name: 'Madison Square Garden', location: 'New York, USA' },
      { name: 'MGM Grand', location: 'Las Vegas, USA' },
      { name: 'O2 Arena', location: 'London, UK' },
      { name: 'Staples Center', location: 'Los Angeles, USA' },
      { name: 'Manchester Arena', location: 'Manchester, UK' },
      { name: 'T-Mobile Arena', location: 'Las Vegas, USA' },
      { name: 'Barclays Center', location: 'Brooklyn, USA' }
    ];
    const venue = venues[Math.floor(Math.random() * venues.length)];
    setVenueName(venue.name);
    setVenueLocation(venue.location);
  };

  const getNextWeekend = () => {
    const today = new Date();
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7;
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    return nextSaturday.toISOString().split('T')[0];
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Schedule Fight</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fighter Selection */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Fighter Selection</h4>
          
          <Select
            label="Fighter 1"
            value={selectedFighter1}
            onChange={(e) => setSelectedFighter1(e.target.value)}
          >
            <option value="">Select Fighter 1</option>
            {getFighterOptions(selectedFighter2).map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <Select
            label="Fighter 2"
            value={selectedFighter2}
            onChange={(e) => setSelectedFighter2(e.target.value)}
          >
            <option value="">Select Fighter 2</option>
            {getFighterOptions(selectedFighter1).map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          {/* Fighter Comparison */}
          {selectedFighter1 && selectedFighter2 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h5 className="text-white font-medium mb-3">Fighter Comparison</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Fighter 1: {getFighterById(selectedFighter1)?.name}</p>
                  <p className="text-gray-300">Record: {getFighterById(selectedFighter1)?.record_wins}-{getFighterById(selectedFighter1)?.record_losses}-{getFighterById(selectedFighter1)?.record_draws}</p>
                  <p className="text-gray-300">Power: {getFighterById(selectedFighter1)?.punching_power}</p>
                  <p className="text-gray-300">Speed: {getFighterById(selectedFighter1)?.speed}</p>
                </div>
                <div>
                  <p className="text-gray-400">Fighter 2: {getFighterById(selectedFighter2)?.name}</p>
                  <p className="text-gray-300">Record: {getFighterById(selectedFighter2)?.record_wins}-{getFighterById(selectedFighter2)?.record_losses}-{getFighterById(selectedFighter2)?.record_draws}</p>
                  <p className="text-gray-300">Power: {getFighterById(selectedFighter2)?.punching_power}</p>
                  <p className="text-gray-300">Speed: {getFighterById(selectedFighter2)?.speed}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Event Details</h4>
          
          <div className="flex space-x-2">
            <Input
              label="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
              className="flex-1"
            />
            <Button
              onClick={() => setEventName(generateEventName())}
              variant="secondary"
              className="mt-6"
            >
              Generate
            </Button>
          </div>

          <div className="flex space-x-2">
            <Input
              label="Venue Name"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="Enter venue name"
              className="flex-1"
            />
            <Button
              onClick={generateVenue}
              variant="secondary"
              className="mt-6"
            >
              Generate
            </Button>
          </div>

          <Input
            label="Venue Location"
            value={venueLocation}
            onChange={(e) => setVenueLocation(e.target.value)}
            placeholder="Enter venue location"
          />

          <Input
            label="Fight Date"
            value={fightDate}
            onChange={(e) => setFightDate(e.target.value)}
            type="date"
            min={new Date().toISOString().split('T')[0]}
          />

          <Select
            label="Rounds"
            value={rounds}
            onChange={(e) => setRounds(parseInt(e.target.value))}
          >
            <option value={4}>4 Rounds</option>
            <option value={6}>6 Rounds</option>
            <option value={8}>8 Rounds</option>
            <option value={10}>10 Rounds</option>
            <option value={12}>12 Rounds</option>
          </Select>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isChampionship}
                onChange={(e) => setIsChampionship(e.target.checked)}
                className="form-checkbox text-red-600 bg-gray-700 border-gray-600 rounded"
              />
              <span className="text-gray-300">Championship Fight</span>
            </label>
          </div>

          {isChampionship && (
            <Select
              label="Title Belt"
              value={titleBelt}
              onChange={(e) => setTitleBelt(e.target.value)}
            >
              <option value="">Select Title Belt</option>
              <option value="WBC Welterweight Championship">WBC Welterweight Championship</option>
              <option value="WBA Lightweight Championship">WBA Lightweight Championship</option>
              <option value="IBF Middleweight Championship">IBF Middleweight Championship</option>
              <option value="WBO Super Middleweight Championship">WBO Super Middleweight Championship</option>
              <option value="The Ring Heavyweight Championship">The Ring Heavyweight Championship</option>
            </Select>
          )}
        </div>
      </div>

      {/* Revenue Preview */}
      {selectedFighter1 && selectedFighter2 && (
        <div className="mt-6 bg-gray-700 rounded-lg p-4">
          <h5 className="text-white font-medium mb-3">Revenue Preview</h5>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Gate Receipts:</span>
              <span className="text-white ml-2">£{calculateFightRevenue(getFighterById(selectedFighter1)!, getFighterById(selectedFighter2)!).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400">PPV Buys:</span>
              <span className="text-white ml-2">{(Math.floor(Math.random() * 100000) + 50000).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400">Total Revenue:</span>
              <span className="text-green-400 ml-2">£{(calculateFightRevenue(getFighterById(selectedFighter1)!, getFighterById(selectedFighter2)!) + (Math.floor(Math.random() * 100000) + 50000) * 50).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-4">
        <Button
          onClick={() => setFightDate(getNextWeekend())}
          variant="secondary"
        >
          Set Next Weekend
        </Button>
        <Button
          onClick={createFight}
          disabled={loading || !selectedFighter1 || !selectedFighter2}
          loading={loading}
          className="flex-1"
        >
          {loading ? 'Scheduling Fight...' : 'Schedule Fight'}
        </Button>
      </div>
    </Card>
  );
}; 