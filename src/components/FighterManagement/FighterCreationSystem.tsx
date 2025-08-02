import React, { useState } from 'react';
import { Fighter } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Slider } from '../ui/slider';
import { Card } from '../ui/card';
import { supabase } from '../../lib/supabase';

// Define weight classes and stances as arrays for component use
const WEIGHT_CLASSES = [
  'heavyweight', 'cruiserweight', 'light_heavyweight', 'super_middleweight',
  'middleweight', 'super_welterweight', 'welterweight', 'super_lightweight',
  'lightweight', 'super_featherweight', 'featherweight', 'super_bantamweight',
  'bantamweight', 'super_flyweight', 'flyweight'
] as const;

const STANCES = ['orthodox', 'southpaw', 'switch'] as const;

interface FighterCreationSystemProps {
  onFighterCreated: (fighter: Fighter) => void;
  onCancel: () => void;
}

export const FighterCreationSystem: React.FC<FighterCreationSystemProps> = ({
  onFighterCreated,
  onCancel
}) => {
  const [fighterData, setFighterData] = useState({
    name: '',
    nickname: '',
    age: 25,
    nationality: 'British',
    weight_class: 'welterweight',
    stance: 'orthodox',
    hometown: 'London',
    height_cm: 175,
    reach_cm: 180,
    punching_power: 70,
    speed: 70,
    defense: 70,
    stamina: 70,
    chin: 70,
    heart: 70,
    ring_iq: 70,
    adaptability: 70,
    mental_toughness: 70,
    recovery_time: 70,
    record_wins: 0,
    record_losses: 0,
    record_draws: 0,
    knockouts: 0,
    total_rounds_fought: 0,
    experience_level: 50,
    career_stage: 'amateur' as const,
    prime_age_start: 25,
    prime_age_end: 35,
    decline_start_age: 40,
    confidence: 75,
    motivation: 75,
    stress_level: 25,
    personal_issues: [],
    current_purse: 5000,
    career_earnings: 0,
    contract_value: 5000,
    is_injured: false,
    injury_type: '',
    injury_severity: 0,
    injury_recovery_weeks: 0,
    is_available: true,
    current_training_focus: '',
    skill_improvement_rate: 1.0,
    last_training_date: new Date().toISOString(),
    trainer_id: '',
    promoter_id: '',
    manager_id: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFighterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateRandomFighter = () => {
    const names = [
      'James "The Hammer" Thompson',
      'Marcus "Lightning" Rodriguez',
      'David "The Destroyer" Williams',
      'Anthony "The Assassin" Johnson',
      'Michael "The Machine" Davis',
      'Robert "The Rock" Martinez',
      'Christopher "The Cobra" Wilson',
      'Daniel "The Dragon" Anderson',
      'Matthew "The Monster" Taylor',
      'Joshua "The Judge" Brown'
    ];

    const nicknames = [
      'The Hammer', 'Lightning', 'The Destroyer', 'The Assassin',
      'The Machine', 'The Rock', 'The Cobra', 'The Dragon',
      'The Monster', 'The Judge', 'The Beast', 'The Viper'
    ];

    const nationalities = ['British', 'American', 'Mexican', 'Irish', 'Cuban', 'Puerto Rican'];
    const hometowns = ['London', 'New York', 'Los Angeles', 'Chicago', 'Miami', 'Manchester'];
    const weightClasses = WEIGHT_CLASSES;
    const stances = STANCES;

    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomNickname = nicknames[Math.floor(Math.random() * nicknames.length)];
    const randomNationality = nationalities[Math.floor(Math.random() * nationalities.length)];
    const randomHometown = hometowns[Math.floor(Math.random() * hometowns.length)];
    const randomWeightClass = weightClasses[Math.floor(Math.random() * weightClasses.length)];
    const randomStance = stances[Math.floor(Math.random() * stances.length)];

    setFighterData({
      ...fighterData,
      name: randomName,
      nickname: randomNickname,
      nationality: randomNationality,
      hometown: randomHometown,
      weight_class: randomWeightClass,
      stance: randomStance,
      age: Math.floor(Math.random() * 15) + 20, // 20-35
      height_cm: Math.floor(Math.random() * 30) + 160, // 160-190
      reach_cm: Math.floor(Math.random() * 30) + 165, // 165-195
      punching_power: Math.floor(Math.random() * 40) + 60, // 60-100
      speed: Math.floor(Math.random() * 40) + 60,
      defense: Math.floor(Math.random() * 40) + 60,
      stamina: Math.floor(Math.random() * 40) + 60,
      chin: Math.floor(Math.random() * 40) + 60,
      heart: Math.floor(Math.random() * 40) + 60,
      ring_iq: Math.floor(Math.random() * 40) + 60,
      adaptability: Math.floor(Math.random() * 40) + 60,
      mental_toughness: Math.floor(Math.random() * 40) + 60,
      recovery_time: Math.floor(Math.random() * 40) + 60,
      experience_level: Math.floor(Math.random() * 50) + 30,
      confidence: Math.floor(Math.random() * 30) + 60,
      motivation: Math.floor(Math.random() * 30) + 60,
      stress_level: Math.floor(Math.random() * 30) + 10,
      current_purse: Math.floor(Math.random() * 10000) + 3000,
      contract_value: Math.floor(Math.random() * 10000) + 3000,
      career_earnings: Math.floor(Math.random() * 50000) + 10000,
      total_rounds_fought: Math.floor(Math.random() * 100) + 10,
      prime_age_start: Math.floor(Math.random() * 5) + 23,
      prime_age_end: Math.floor(Math.random() * 5) + 33,
      decline_start_age: Math.floor(Math.random() * 5) + 38
    });
  };

  const createFighter = async () => {
    if (!fighterData.name.trim()) {
      alert('Please enter a fighter name');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fighters')
        .insert({
          ...fighterData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      onFighterCreated(data);
    } catch (error) {
      console.error('Error creating fighter:', error);
      alert('Failed to create fighter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Fighter</h2>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            
            <Input
              label="Fighter Name"
              value={fighterData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter fighter name"
            />

            <Input
              label="Nickname"
              value={fighterData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              placeholder="Enter nickname"
            />

            <Input
              label="Age"
              value={fighterData.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
              type="number"
              min={16}
              max={50}
            />

            <Input
              label="Nationality"
              value={fighterData.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              placeholder="Enter nationality"
            />

            <Input
              label="Hometown"
              value={fighterData.hometown}
              onChange={(e) => handleInputChange('hometown', e.target.value)}
              placeholder="Enter hometown"
            />

            <Select
              value={fighterData.weight_class}
              onChange={(e) => handleInputChange('weight_class', e.target.value)}
            >
              {Object.entries(WeightClass).map(([key, value]) => (
                <option key={value} value={value}>
                  {key.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </Select>

            <Select
              value={fighterData.stance}
              onChange={(e) => handleInputChange('stance', e.target.value)}
            >
              {Object.entries(Stance).map(([key, value]) => (
                <option key={value} value={value}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </Select>

            <Input
              label="Height (cm)"
              value={fighterData.height_cm}
              onChange={(e) => handleInputChange('height_cm', parseInt(e.target.value))}
              type="number"
              min={150}
              max={220}
            />

            <Input
              label="Reach (cm)"
              value={fighterData.reach_cm}
              onChange={(e) => handleInputChange('reach_cm', parseInt(e.target.value))}
              type="number"
              min={150}
              max={220}
            />
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Fighter Stats</h3>
            
            <Slider
              label="Punching Power"
              value={fighterData.punching_power}
              onChange={(value) => handleInputChange('punching_power', value)}
              showValue
            />

            <Slider
              label="Speed"
              value={fighterData.speed}
              onChange={(value) => handleInputChange('speed', value)}
              showValue
            />

            <Slider
              label="Defense"
              value={fighterData.defense}
              onChange={(value) => handleInputChange('defense', value)}
              showValue
            />

            <Slider
              label="Stamina"
              value={fighterData.stamina}
              onChange={(value) => handleInputChange('stamina', value)}
              showValue
            />

            <Slider
              label="Chin"
              value={fighterData.chin}
              onChange={(value) => handleInputChange('chin', value)}
              showValue
            />

            <Slider
              label="Heart"
              value={fighterData.heart}
              onChange={(value) => handleInputChange('heart', value)}
              showValue
            />

            <Slider
              label="Ring IQ"
              value={fighterData.ring_iq}
              onChange={(value) => handleInputChange('ring_iq', value)}
              showValue
            />

            <Slider
              label="Adaptability"
              value={fighterData.adaptability}
              onChange={(value) => handleInputChange('adaptability', value)}
              showValue
            />

            <Slider
              label="Mental Toughness"
              value={fighterData.mental_toughness}
              onChange={(value) => handleInputChange('mental_toughness', value)}
              showValue
            />

            <Slider
              label="Recovery Time"
              value={fighterData.recovery_time}
              onChange={(value) => handleInputChange('recovery_time', value)}
              showValue
            />

            <Slider
              label="Experience Level"
              value={fighterData.experience_level}
              onChange={(value) => handleInputChange('experience_level', value)}
              showValue
            />

            <Slider
              label="Confidence"
              value={fighterData.confidence}
              onChange={(value) => handleInputChange('confidence', value)}
              showValue
            />

            <Slider
              label="Motivation"
              value={fighterData.motivation}
              onChange={(value) => handleInputChange('motivation', value)}
              showValue
            />

            <Slider
              label="Stress Level"
              value={fighterData.stress_level}
              onChange={(value) => handleInputChange('stress_level', value)}
              showValue
            />
          </div>
        </div>

        {/* Record */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Fight Record</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Wins"
              value={fighterData.record_wins}
              onChange={(e) => handleInputChange('record_wins', parseInt(e.target.value))}
              type="number"
              min={0}
            />
            <Input
              label="Losses"
              value={fighterData.record_losses}
              onChange={(e) => handleInputChange('record_losses', parseInt(e.target.value))}
              type="number"
              min={0}
            />
            <Input
              label="Draws"
              value={fighterData.record_draws}
              onChange={(e) => handleInputChange('record_draws', parseInt(e.target.value))}
              type="number"
              min={0}
            />
            <Input
              label="Knockouts"
              value={fighterData.knockouts}
              onChange={(e) => handleInputChange('knockouts', parseInt(e.target.value))}
              type="number"
              min={0}
            />
          </div>
        </div>

        {/* Financial */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Current Purse (£)"
              value={fighterData.current_purse}
              onChange={(e) => handleInputChange('current_purse', parseInt(e.target.value))}
              type="number"
              min={0}
            />
            <Input
              label="Contract Value (£)"
              value={fighterData.contract_value}
              onChange={(e) => handleInputChange('contract_value', parseInt(e.target.value))}
              type="number"
              min={0}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex space-x-4">
          <Button
            onClick={generateRandomFighter}
            variant="secondary"
            className="flex-1"
          >
            Generate Random Fighter
          </Button>
          <Button
            onClick={createFighter}
            disabled={loading || !fighterData.name.trim()}
            loading={loading}
            className="flex-1"
          >
            Create Fighter
          </Button>
        </div>
      </Card>
    </div>
  );
}; 