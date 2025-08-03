import React, { useState, useEffect } from 'react';
import { Fighter, Fight } from '../../lib/supabase';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Calendar, MapPin, Users, Trophy, DollarSign, Play, Eye } from 'lucide-react';

interface FightManagerProps {
  fights?: Fight[];
  fighters?: Fighter[];
  onFightSelect?: (fight: Fight) => void;
}

export const FightManager: React.FC<FightManagerProps> = () => {
  const [fights, setFights] = useState<Fight[]>([]);
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFight, setSelectedFight] = useState<Fight | null>(null);
  const [showFightDetails, setShowFightDetails] = useState(false);

  useEffect(() => {
    loadFights();
    loadFighters();
  }, []);

  const loadFights = async () => {
    try {
      const { data, error } = await supabase
        .from('fights')
        .select('*')
        .order('fight_date', { ascending: true });

      if (error) throw error;
      setFights(data || []);
    } catch (error) {
      console.error('Error loading fights:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFighters = async () => {
    try {
      const { data, error } = await supabase
        .from('fighters')
        .select('*');

      if (error) throw error;
      setFighters(data || []);
    } catch (error) {
      console.error('Error loading fighters:', error);
    }
  };

  const getFighterById = (id: number) => {
    return fighters.find(f => f.id === id);
  };

  const getFighterName = (id: number) => {
    const fighter = getFighterById(id);
    return fighter?.name || 'Unknown Fighter';
  };

  const simulateFight = async (fight: Fight) => {
    if (!fight.fighter1_id || !fight.fighter2_id) return;

    const fighter1 = getFighterById(fight.fighter1_id);
    const fighter2 = getFighterById(fight.fighter2_id);

    if (!fighter1 || !fighter2) return;

    // Simple fight simulation
    const fighter1Score = calculateFighterScore(fighter1);
    const fighter2Score = calculateFighterScore(fighter2);
    
    const totalScore = fighter1Score + fighter2Score;
    const fighter1Chance = fighter1Score / totalScore;
    const random = Math.random();

    let winnerId: number;
    let resultType: string;
    let roundEnded: number;

    if (random < fighter1Chance) {
      winnerId = fighter1.id;
      resultType = Math.random() < 0.3 ? 'ko' : 'decision';
      roundEnded = resultType === 'ko' ? Math.floor(Math.random() * 12) + 1 : 12;
    } else {
      winnerId = fighter2.id;
      resultType = Math.random() < 0.3 ? 'ko' : 'decision';
      roundEnded = resultType === 'ko' ? Math.floor(Math.random() * 12) + 1 : 12;
    }

    // Calculate fight statistics
    const fighter1PunchesThrown = Math.floor(Math.random() * 300) + 200;
    const fighter1PunchesLanded = Math.floor(fighter1PunchesThrown * (Math.random() * 0.4 + 0.2));
    const fighter2PunchesThrown = Math.floor(Math.random() * 300) + 200;
    const fighter2PunchesLanded = Math.floor(fighter2PunchesThrown * (Math.random() * 0.4 + 0.2));

    // Calculate fight rating
    const fightRating = Math.floor(Math.random() * 50) + 50;
    const crowdReaction = Math.floor(Math.random() * 30) + 70;
    const mediaCoverageRating = Math.floor(Math.random() * 40) + 60;

    try {
      const { data, error } = await supabase
        .from('fights')
        .update({
          winner_id: winnerId,
          result_type: resultType,
          round_ended: roundEnded,
          fighter1_punches_landed: fighter1PunchesLanded,
          fighter1_punches_thrown: fighter1PunchesThrown,
          fighter2_punches_landed: fighter2PunchesLanded,
          fighter2_punches_thrown: fighter2PunchesThrown,
          fight_rating: fightRating,
          crowd_reaction: crowdReaction,
          media_coverage_rating: mediaCoverageRating
        })
        .eq('id', fight.id)
        .select()
        .single();

      if (error) throw error;

      // Update fighter records
      await updateFighterRecords(fighter1, fighter2, winnerId, resultType);

      // Make fighters available again
      await supabase
        .from('fighters')
        .update({ is_available: true })
        .in('id', [fighter1.id, fighter2.id]);

      // Reload fights
      await loadFights();
      await loadFighters();

      alert(`Fight completed! ${getFighterName(winnerId)} wins by ${resultType.toUpperCase()} in round ${roundEnded}`);
    } catch (error) {
      console.error('Error simulating fight:', error);
      alert('Failed to simulate fight');
    }
  };

  const calculateFighterScore = (fighter: Fighter) => {
    return (
      fighter.punching_power * 0.2 +
      fighter.speed * 0.2 +
      fighter.defense * 0.15 +
      fighter.stamina * 0.15 +
      fighter.chin * 0.1 +
      fighter.heart * 0.1 +
      fighter.ring_iq * 0.1
    );
  };

  const updateFighterRecords = async (fighter1: Fighter, fighter2: Fighter, winnerId: number, resultType: string) => {
    const isFighter1Winner = winnerId === fighter1.id;
    const winner = isFighter1Winner ? fighter1 : fighter2;
    const loser = isFighter1Winner ? fighter2 : fighter1;

    // Update winner record
    await supabase
      .from('fighters')
      .update({
        record_wins: winner.record_wins + 1,
        knockouts: resultType === 'ko' ? winner.knockouts + 1 : winner.knockouts,
        experience_level: Math.min(100, winner.experience_level + 2),
        confidence: Math.min(100, winner.confidence + 5),
        motivation: Math.min(100, winner.motivation + 3)
      })
      .eq('id', winner.id);

    // Update loser record
    await supabase
      .from('fighters')
      .update({
        record_losses: loser.record_losses + 1,
        confidence: Math.max(0, loser.confidence - 3),
        motivation: Math.max(0, loser.motivation - 2)
      })
      .eq('id', loser.id);
  };

  const getFightStatus = (fight: Fight) => {
    if (fight.winner_id) {
      return { status: 'completed', color: 'text-green-400' };
    }
    const fightDate = new Date(fight.fight_date!);
    const today = new Date();
    if (fightDate < today) {
      return { status: 'overdue', color: 'text-red-400' };
    }
    return { status: 'scheduled', color: 'text-blue-400' };
  };

  const getResultText = (fight: Fight) => {
    if (!fight.winner_id) return 'Not fought yet';
    
    const winner = getFighterName(fight.winner_id);
    const result = fight.result_type?.toUpperCase() || 'DECISION';
    const round = fight.round_ended || 12;
    
    return `${winner} wins by ${result} in round ${round}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-white">Loading fights...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Fight Management</h2>
        <div className="text-gray-300">
          Total Fights: {fights.length}
        </div>
      </div>

      {/* Fight Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Scheduled</p>
              <p className="text-2xl font-bold text-white">
                {fights.filter(f => !f.winner_id).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">
                {fights.filter(f => f.winner_id).length}
              </p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Championship</p>
              <p className="text-2xl font-bold text-white">
                {fights.filter(f => f.championship_fight).length}
              </p>
            </div>
            <Trophy className="w-8 h-8 text-red-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">
                £{fights.reduce((sum, f) => sum + (f.total_revenue || 0), 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Fights List */}
      <div className="space-y-4">
        {fights.map((fight) => {
          const status = getFightStatus(fight);
          const fighter1 = getFighterById(fight.fighter1_id!);
          const fighter2 = getFighterById(fight.fighter2_id!);

          return (
            <Card key={fight.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold text-white">{fight.event_name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                      {status.status}
                    </span>
                    {fight.championship_fight && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-600 text-white">
                        Championship
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Fighters</p>
                      <p className="text-white">
                        {fighter1?.name} vs {fighter2?.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">Venue</p>
                      <p className="text-white flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {fight.venue_name}, {fight.venue_location}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400">Date</p>
                      <p className="text-white flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(fight.fight_date!)}
                      </p>
                    </div>
                  </div>

                  {fight.winner_id && (
                    <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                      <p className="text-gray-400 text-sm">Result</p>
                      <p className="text-white font-medium">{getResultText(fight)}</p>
                      {fight.fight_rating && (
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-gray-400">Rating: <span className="text-white">{fight.fight_rating}/100</span></span>
                          <span className="text-gray-400">Crowd: <span className="text-white">{fight.crowd_reaction}/100</span></span>
                          <span className="text-gray-400">Media: <span className="text-white">{fight.media_coverage_rating}/100</span></span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {!fight.winner_id && (
                    <Button
                      onClick={() => simulateFight(fight)}
                      variant="primary"
                      className="flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Simulate</span>
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => {
                      setSelectedFight(fight);
                      setShowFightDetails(true);
                    }}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Details</span>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {fights.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-400">No fights scheduled yet.</p>
          <p className="text-gray-500 text-sm mt-2">Schedule a fight to get started!</p>
        </Card>
      )}

      {/* Fight Details Modal */}
      {showFightDetails && selectedFight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Fight Details</h3>
              <Button
                onClick={() => setShowFightDetails(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-medium text-white mb-2">{selectedFight.event_name}</h4>
                <p className="text-gray-300">{selectedFight.venue_name}, {selectedFight.venue_location}</p>
                <p className="text-gray-400">{formatDate(selectedFight.fight_date!)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-2">Fighter 1</h5>
                  <p className="text-white">{getFighterName(selectedFight.fighter1_id!)}</p>
                  {selectedFight.fighter1_punches_landed && (
                    <p className="text-gray-300 text-sm">
                      Punches: {selectedFight.fighter1_punches_landed}/{selectedFight.fighter1_punches_thrown}
                    </p>
                  )}
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-2">Fighter 2</h5>
                  <p className="text-white">{getFighterName(selectedFight.fighter2_id!)}</p>
                  {selectedFight.fighter2_punches_landed && (
                    <p className="text-gray-300 text-sm">
                      Punches: {selectedFight.fighter2_punches_landed}/{selectedFight.fighter2_punches_thrown}
                    </p>
                  )}
                </div>
              </div>

              {selectedFight.winner_id && (
                <div className="bg-green-900 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-2">Result</h5>
                  <p className="text-white">{getResultText(selectedFight)}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Weight Class:</span>
                  <p className="text-white">{selectedFight.weight_class}</p>
                </div>
                <div>
                  <span className="text-gray-400">Rounds:</span>
                  <p className="text-white">{selectedFight.rounds_scheduled}</p>
                </div>
                <div>
                  <span className="text-gray-400">Revenue:</span>
                  <p className="text-green-400">£{selectedFight.total_revenue?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}; 