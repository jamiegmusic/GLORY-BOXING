import React, { useState } from 'react';
import { Fighter } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Select } from '../ui/select';
import { Slider } from '../ui/slider';
import { supabase } from '../../lib/supabase';

interface TrainingSystemProps {
  fighter: Fighter;
  onTrainingComplete: (updatedFighter: Fighter) => void;
}

export const TrainingSystem: React.FC<TrainingSystemProps> = ({
  fighter,
  onTrainingComplete
}) => {
  const [selectedFocus, setSelectedFocus] = useState<string>('');
  const [trainingIntensity, setTrainingIntensity] = useState<number>(50);
  const [trainingDuration, setTrainingDuration] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const trainingOptions = [
    { name: 'Punching Power', stat: 'punching_power', cost: 1000 },
    { name: 'Speed', stat: 'speed', cost: 1000 },
    { name: 'Defense', stat: 'defense', cost: 1000 },
    { name: 'Stamina', stat: 'stamina', cost: 1000 },
    { name: 'Chin', stat: 'chin', cost: 1500 },
    { name: 'Heart', stat: 'heart', cost: 1200 },
    { name: 'Ring IQ', stat: 'ring_iq', cost: 1500 },
    { name: 'Adaptability', stat: 'adaptability', cost: 1200 },
    { name: 'Mental Toughness', stat: 'mental_toughness', cost: 1200 },
    { name: 'Recovery Time', stat: 'recovery_time', cost: 1000 }
  ];

  const conductTraining = async () => {
    if (!selectedFocus) return;

    setLoading(true);
    try {
      const selectedOption = trainingOptions.find(option => option.stat === selectedFocus);
      if (!selectedOption) return;

      // Calculate improvement based on intensity and duration
      const baseImprovement = Math.floor((trainingIntensity / 100) * 3) + 1;
      const durationMultiplier = trainingDuration;
      const totalImprovement = Math.min(10, baseImprovement * durationMultiplier);

      // Calculate cost
      const totalCost = selectedOption.cost * trainingDuration;

      // Update fighter stats
      const updatedFighter = {
        ...fighter,
        [selectedFocus]: Math.min(100, fighter[selectedFocus as keyof Fighter] + totalImprovement),
        experience_level: Math.min(100, fighter.experience_level + Math.floor(totalImprovement / 2)),
        last_training_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Update in database
      const { data, error } = await supabase
        .from('fighters')
        .update(updatedFighter)
        .eq('id', fighter.id)
        .select()
        .single();

      if (error) throw error;

      onTrainingComplete(data);
      
      // Reset form
      setSelectedFocus('');
      setTrainingIntensity(50);
      setTrainingDuration(1);
      
    } catch (error) {
      console.error('Error conducting training:', error);
      alert('Failed to conduct training. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTrainingCost = () => {
    const selectedOption = trainingOptions.find(option => option.stat === selectedFocus);
    return selectedOption ? selectedOption.cost * trainingDuration : 0;
  };

  const getExpectedImprovement = () => {
    if (!selectedFocus) return 0;
    const baseImprovement = Math.floor((trainingIntensity / 100) * 3) + 1;
    const durationMultiplier = trainingDuration;
    return Math.min(10, baseImprovement * durationMultiplier);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Training Camp</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label="Training Focus"
              value={selectedFocus}
              onChange={(e) => setSelectedFocus(e.target.value)}
            >
              <option value="">Select focus area</option>
              {trainingOptions.map(option => (
                <option key={option.stat} value={option.stat}>
                  {option.name} (Current: {fighter[option.stat as keyof Fighter]})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Select
              label="Training Duration (Weeks)"
              value={trainingDuration}
              onChange={(e) => setTrainingDuration(parseInt(e.target.value))}
            >
              <option value={1}>1 Week</option>
              <option value={2}>2 Weeks</option>
              <option value={3}>3 Weeks</option>
              <option value={4}>4 Weeks</option>
            </Select>
          </div>
        </div>

        <Slider
          label="Training Intensity"
          value={trainingIntensity}
          onChange={setTrainingIntensity}
          min={10}
          max={100}
          showValue
        />

        {/* Training Preview */}
        {selectedFocus && (
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Training Preview</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Current Level:</span>
                <span className="text-white ml-2">{fighter[selectedFocus as keyof Fighter]}</span>
              </div>
              <div>
                <span className="text-gray-400">Expected Improvement:</span>
                <span className="text-green-400 ml-2">+{getExpectedImprovement()}</span>
              </div>
              <div>
                <span className="text-gray-400">New Level:</span>
                <span className="text-white ml-2">
                  {fighter[selectedFocus as keyof Fighter] + getExpectedImprovement()}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Training Cost:</span>
                <span className="text-yellow-400 ml-2">£{getTrainingCost().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Fighter Stats Overview */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-white font-medium mb-3">Current Stats</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-gray-400">Power:</span>
              <span className="text-white ml-2">{fighter.punching_power}</span>
            </div>
            <div>
              <span className="text-gray-400">Speed:</span>
              <span className="text-white ml-2">{fighter.speed}</span>
            </div>
            <div>
              <span className="text-gray-400">Defense:</span>
              <span className="text-white ml-2">{fighter.defense}</span>
            </div>
            <div>
              <span className="text-gray-400">Stamina:</span>
              <span className="text-white ml-2">{fighter.stamina}</span>
            </div>
            <div>
              <span className="text-gray-400">Chin:</span>
              <span className="text-white ml-2">{fighter.chin}</span>
            </div>
            <div>
              <span className="text-gray-400">Heart:</span>
              <span className="text-white ml-2">{fighter.heart}</span>
            </div>
            <div>
              <span className="text-gray-400">Ring IQ:</span>
              <span className="text-white ml-2">{fighter.ring_iq}</span>
            </div>
            <div>
              <span className="text-gray-400">Adaptability:</span>
              <span className="text-white ml-2">{fighter.adaptability}</span>
            </div>
            <div>
              <span className="text-gray-400">Mental Toughness:</span>
              <span className="text-white ml-2">{fighter.mental_toughness}</span>
            </div>
            <div>
              <span className="text-gray-400">Recovery:</span>
              <span className="text-white ml-2">{fighter.recovery_time}</span>
            </div>
            <div>
              <span className="text-gray-400">Experience:</span>
              <span className="text-white ml-2">{fighter.experience_level}</span>
            </div>
            <div>
              <span className="text-gray-400">Confidence:</span>
              <span className="text-white ml-2">{fighter.confidence}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={conductTraining}
          disabled={loading || !selectedFocus}
          loading={loading}
          className="w-full"
        >
          {loading ? 'Training...' : 'Conduct Training'}
        </Button>
      </div>
    </Card>
  );
}; 