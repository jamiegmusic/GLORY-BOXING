import React, { useState, useEffect } from 'react';
import { Fighter } from '../../lib/supabase';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Card } from '../ui/card';
import { Trophy, Users, Calendar, Target, Play, Eye, Award, DollarSign } from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  weight_class: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed';
  prize_pool: number;
  participants: number;
  max_participants: number;
  current_round: number;
  total_rounds: number;
  created_at: string;
}

interface TournamentMatch {
  id: string;
  tournament_id: string;
  fighter1_id: string;
  fighter2_id: string;
  round: number;
  winner_id?: string;
  scheduled_date?: string;
  result_type?: string;
  round_ended?: number;
}

interface TournamentSystemProps {}

export const TournamentSystem: React.FC<TournamentSystemProps> = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [tournamentMatches, setTournamentMatches] = useState<TournamentMatch[]>([]);
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [showTournamentDetails, setShowTournamentDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  // Tournament creation form state
  const [tournamentName, setTournamentName] = useState('');
  const [weightClass, setWeightClass] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prizePool, setPrizePool] = useState(100000);
  const [maxParticipants, setMaxParticipants] = useState(8);
  const [selectedFighters, setSelectedFighters] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fightersData, tournamentsData] = await Promise.all([
        supabase.from('fighters').select('*').eq('is_available', true),
        supabase.from('tournaments').select('*').order('created_at', { ascending: false })
      ]);

      if (fightersData.error) throw fightersData.error;
      if (tournamentsData.error) throw tournamentsData.error;

      setFighters(fightersData.data || []);
      setTournaments(tournamentsData.data || []);
    } catch (error) {
      console.error('Error loading tournament data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTournamentMatches = async (tournamentId: string) => {
    try {
      const { data, error } = await supabase
        .from('tournament_matches')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('round', { ascending: true });

      if (error) throw error;
      setTournamentMatches(data || []);
    } catch (error) {
      console.error('Error loading tournament matches:', error);
    }
  };

  const createTournament = async () => {
    if (!tournamentName || !weightClass || !startDate || !endDate || selectedFighters.length < 2) {
      alert('Please fill in all required fields and select at least 2 fighters');
      return;
    }

    if (selectedFighters.length !== maxParticipants) {
      alert(`Please select exactly ${maxParticipants} fighters`);
      return;
    }

    try {
      // Create tournament
      const { data: tournament, error: tournamentError } = await supabase
        .from('tournaments')
        .insert({
          name: tournamentName,
          weight_class: weightClass,
          start_date: startDate,
          end_date: endDate,
          status: 'upcoming',
          prize_pool: prizePool,
          participants: selectedFighters.length,
          max_participants: maxParticipants,
          current_round: 1,
          total_rounds: Math.log2(maxParticipants)
        })
        .select()
        .single();

      if (tournamentError) throw tournamentError;

      // Create tournament matches (bracket)
      const matches = generateTournamentBracket(selectedFighters, tournament.id);
      
      const { error: matchesError } = await supabase
        .from('tournament_matches')
        .insert(matches);

      if (matchesError) throw matchesError;

      // Update fighter availability
      await supabase
        .from('fighters')
        .update({ is_available: false })
        .in('id', selectedFighters);

      await loadData();
      setShowCreateTournament(false);
      resetTournamentForm();
      alert('Tournament created successfully!');
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Failed to create tournament');
    }
  };

  const generateTournamentBracket = (fighterIds: string[], tournamentId: string): TournamentMatch[] => {
    const matches: TournamentMatch[] = [];
    const totalRounds = Math.log2(fighterIds.length);
    
    // Shuffle fighters for random seeding
    const shuffledFighters = [...fighterIds].sort(() => Math.random() - 0.5);
    
    // First round matches
    for (let i = 0; i < shuffledFighters.length; i += 2) {
      matches.push({
        id: `${tournamentId}_${matches.length + 1}`,
        tournament_id: tournamentId,
        fighter1_id: shuffledFighters[i],
        fighter2_id: shuffledFighters[i + 1],
        round: 1
      });
    }

    // Generate placeholder matches for subsequent rounds
    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = Math.pow(2, totalRounds - round);
      for (let i = 0; i < matchesInRound; i++) {
        matches.push({
          id: `${tournamentId}_${matches.length + 1}`,
          tournament_id: tournamentId,
          fighter1_id: '', // Will be filled when previous round completes
          fighter2_id: '',
          round: round
        });
      }
    }

    return matches;
  };

  const simulateTournamentMatch = async (match: TournamentMatch) => {
    const fighter1 = fighters.find(f => f.id === match.fighter1_id);
    const fighter2 = fighters.find(f => f.id === match.fighter2_id);

    if (!fighter1 || !fighter2) return;

    // Simple simulation
    const fighter1Score = calculateFighterScore(fighter1);
    const fighter2Score = calculateFighterScore(fighter2);
    const totalScore = fighter1Score + fighter2Score;
    const fighter1Chance = fighter1Score / totalScore;
    const random = Math.random();

    const winnerId = random < fighter1Chance ? fighter1.id : fighter2.id;
    const resultType = Math.random() < 0.3 ? 'ko' : 'decision';
    const roundEnded = resultType === 'ko' ? Math.floor(Math.random() * 12) + 1 : 12;

    try {
      // Update match result
      const { error: matchError } = await supabase
        .from('tournament_matches')
        .update({
          winner_id: winnerId,
          result_type: resultType,
          round_ended: roundEnded
        })
        .eq('id', match.id);

      if (matchError) throw matchError;

      // Update fighter records
      const winner = winnerId === fighter1.id ? fighter1 : fighter2;
      const loser = winnerId === fighter1.id ? fighter2 : fighter1;

      await supabase
        .from('fighters')
        .update({
          record_wins: winner.record_wins + 1,
          knockouts: resultType === 'ko' ? winner.knockouts + 1 : winner.knockouts,
          experience_level: Math.min(100, winner.experience_level + 3),
          confidence: Math.min(100, winner.confidence + 5)
        })
        .eq('id', winner.id);

      await supabase
        .from('fighters')
        .update({
          record_losses: loser.record_losses + 1,
          confidence: Math.max(0, loser.confidence - 3)
        })
        .eq('id', loser.id);

      // Advance tournament if needed
      await advanceTournament(match.tournament_id, match.round, winnerId);

      await loadTournamentMatches(match.tournament_id);
      alert(`${winner.name} wins by ${resultType.toUpperCase()} in round ${roundEnded}!`);
    } catch (error) {
      console.error('Error simulating tournament match:', error);
      alert('Failed to simulate match');
    }
  };

  const advanceTournament = async (tournamentId: string, currentRound: number, winnerId: string) => {
    // Find next match in the tournament
    const nextMatch = tournamentMatches.find(m => 
      m.tournament_id === tournamentId && 
      m.round === currentRound + 1 &&
      (m.fighter1_id === '' || m.fighter2_id === '')
    );

    if (nextMatch) {
      // Update the next match with the winner
      const updateData = nextMatch.fighter1_id === '' 
        ? { fighter1_id: winnerId }
        : { fighter2_id: winnerId };

      await supabase
        .from('tournament_matches')
        .update(updateData)
        .eq('id', nextMatch.id);

      // Check if tournament is complete
      const remainingMatches = tournamentMatches.filter(m => 
        m.tournament_id === tournamentId && 
        m.round === currentRound + 1 &&
        m.winner_id === null
      );

      if (remainingMatches.length === 0) {
        // Tournament complete
        await supabase
          .from('tournaments')
          .update({ 
            status: 'completed',
            current_round: currentRound + 1
          })
          .eq('id', tournamentId);
      } else {
        // Update tournament round
        await supabase
          .from('tournaments')
          .update({ current_round: currentRound + 1 })
          .eq('id', tournamentId);
      }
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

  const getFighterName = (id: string) => {
    const fighter = fighters.find(f => f.id === id);
    return fighter?.name || 'Unknown Fighter';
  };

  const resetTournamentForm = () => {
    setTournamentName('');
    setWeightClass('');
    setStartDate('');
    setEndDate('');
    setPrizePool(100000);
    setMaxParticipants(8);
    setSelectedFighters([]);
  };

  const handleFighterSelection = (fighterId: string) => {
    if (selectedFighters.includes(fighterId)) {
      setSelectedFighters(selectedFighters.filter(id => id !== fighterId));
    } else if (selectedFighters.length < maxParticipants) {
      setSelectedFighters([...selectedFighters, fighterId]);
    }
  };

  const getWeightClassOptions = () => {
    const weightClasses = Array.from(new Set(fighters.map(f => f.weight_class)));
    return weightClasses.map(wc => ({
      value: wc,
      label: wc.charAt(0).toUpperCase() + wc.slice(1)
    }));
  };

  const getAvailableFighters = () => {
    return fighters.filter(f => f.weight_class === weightClass && f.is_available);
  };

  if (loading) {
    return <div className="text-white">Loading tournaments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Tournament Management</h2>
        <Button
          onClick={() => setShowCreateTournament(true)}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <Trophy className="w-4 h-4" />
          <span>Create Tournament</span>
        </Button>
      </div>

      {/* Tournament Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Tournaments</p>
              <p className="text-2xl font-bold text-white">{tournaments.length}</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-white">
                {tournaments.filter(t => t.status === 'active').length}
              </p>
            </div>
            <Play className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-white">
                {tournaments.filter(t => t.status === 'completed').length}
              </p>
            </div>
            <Award className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Prize Pool</p>
              <p className="text-2xl font-bold text-white">
                £{tournaments.reduce((sum, t) => sum + t.prize_pool, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </Card>
      </div>

      {/* Tournaments List */}
      <div className="space-y-4">
        {tournaments.map((tournament) => (
          <Card key={tournament.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-lg font-semibold text-white">{tournament.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    tournament.status === 'completed' ? 'bg-green-600 text-white' :
                    tournament.status === 'active' ? 'bg-blue-600 text-white' :
                    'bg-yellow-600 text-white'
                  }`}>
                    {tournament.status}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-purple-600 text-white">
                    {tournament.weight_class}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Participants</p>
                    <p className="text-white">{tournament.participants}/{tournament.max_participants}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Current Round</p>
                    <p className="text-white">{tournament.current_round}/{tournament.total_rounds}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Prize Pool</p>
                    <p className="text-green-400">£{tournament.prize_pool.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Dates</p>
                    <p className="text-white">
                      {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-4">
                <Button
                  onClick={() => {
                    setSelectedTournament(tournament);
                    loadTournamentMatches(tournament.id);
                    setShowTournamentDetails(true);
                  }}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Bracket</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {tournaments.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-400">No tournaments created yet.</p>
          <p className="text-gray-500 text-sm mt-2">Create a tournament to get started!</p>
        </Card>
      )}

      {/* Create Tournament Modal */}
      {showCreateTournament && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Create Tournament</h3>
              <Button
                onClick={() => setShowCreateTournament(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tournament Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">Tournament Details</h4>
                
                <Input
                  label="Tournament Name"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  placeholder="Enter tournament name"
                />

                <Select
                  label="Weight Class"
                  value={weightClass}
                  onChange={(e) => setWeightClass(e.target.value)}
                >
                  <option value="">Select Weight Class</option>
                  {getWeightClassOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                  />
                  <Input
                    label="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    type="date"
                  />
                </div>

                <Input
                  label="Prize Pool (£)"
                  value={prizePool}
                  onChange={(e) => setPrizePool(parseInt(e.target.value))}
                  type="number"
                  min={10000}
                />

                <Select
                  label="Participants"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                >
                  <option value={4}>4 Fighters</option>
                  <option value={8}>8 Fighters</option>
                  <option value={16}>16 Fighters</option>
                  <option value={32}>32 Fighters</option>
                </Select>
              </div>

              {/* Fighter Selection */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white">
                  Select Fighters ({selectedFighters.length}/{maxParticipants})
                </h4>

                {weightClass ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getAvailableFighters().map((fighter) => (
                      <div
                        key={fighter.id}
                                                 onClick={() => handleFighterSelection(fighter.id.toString())}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                                     selectedFighters.includes(fighter.id.toString())
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{fighter.name}</p>
                            <p className="text-sm opacity-75">
                              Record: {fighter.record_wins}-{fighter.record_losses}-{fighter.record_draws}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">Power: {fighter.punching_power}</p>
                            <p className="text-sm">Speed: {fighter.speed}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">Select a weight class to see available fighters</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button
                onClick={() => setShowCreateTournament(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={createTournament}
                disabled={selectedFighters.length !== maxParticipants}
                variant="primary"
              >
                Create Tournament
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Tournament Details Modal */}
      {showTournamentDetails && selectedTournament && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">{selectedTournament.name} - Bracket</h3>
              <Button
                onClick={() => setShowTournamentDetails(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>

            <div className="space-y-6">
              {Array.from({ length: selectedTournament.total_rounds }, (_, roundIndex) => {
                const round = roundIndex + 1;
                const roundMatches = tournamentMatches.filter(m => m.round === round);
                
                return (
                  <div key={round} className="space-y-4">
                    <h4 className="text-lg font-medium text-white">Round {round}</h4>
                    <div className="grid gap-4">
                      {roundMatches.map((match) => (
                        <div key={match.id} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <p className={`font-medium ${
                                  match.winner_id === match.fighter1_id ? 'text-green-400' : 'text-white'
                                }`}>
                                  {getFighterName(match.fighter1_id)}
                                </p>
                                <p className="text-gray-400 text-sm">vs</p>
                                <p className={`font-medium ${
                                  match.winner_id === match.fighter2_id ? 'text-green-400' : 'text-white'
                                }`}>
                                  {getFighterName(match.fighter2_id)}
                                </p>
                              </div>
                              
                              {match.winner_id && (
                                <div className="text-center">
                                  <p className="text-green-400 font-bold">Winner</p>
                                  <p className="text-white">{getFighterName(match.winner_id)}</p>
                                  <p className="text-gray-400 text-sm">{match.result_type?.toUpperCase()}</p>
                                </div>
                              )}
                            </div>

                            {!match.winner_id && match.fighter1_id && match.fighter2_id && (
                              <Button
                                onClick={() => simulateTournamentMatch(match)}
                                variant="primary"
                                className="flex items-center space-x-2"
                              >
                                <Play className="w-4 h-4" />
                                <span>Simulate</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}; 