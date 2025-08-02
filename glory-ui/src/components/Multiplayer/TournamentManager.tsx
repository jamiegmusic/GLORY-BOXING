import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  DollarSign, 
  Clock, 
  Target,
  Plus,
  Eye,
  Play,
  Award,
  UserCheck,
  Settings
} from 'lucide-react';
import { 
  multiplayerEngine, 
  Tournament, 
  TournamentParticipant,
  TournamentBracket,
  TournamentMatch,
  TournamentRules
} from '../../lib/multiplayer-engine';

interface TournamentManagerProps {
  currentUserId?: string;
  currentUsername?: string;
}

const TournamentManager: React.FC<TournamentManagerProps> = ({ 
  currentUserId = 'user1', 
  currentUsername = 'Player' 
}) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBrackets, setShowBrackets] = useState(false);
  const [activeTab, setActiveTab] = useState('available');

  // Form state for creating tournaments
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'weekly' as const,
    entryFee: 0,
    prizePool: 1000,
    maxParticipants: 16,
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    rules: {
      maxRounds: 12,
      timeLimit: 180,
      weightClass: 'open',
      allowSubstitutions: false,
      tiebreaker: 'judges_decision' as const
    }
  });

  useEffect(() => {
    // Load tournaments
    setTournaments(multiplayerEngine.getTournaments());
    
    // Set up event listeners
    multiplayerEngine.on('tournamentCreated', (tournament: Tournament) => {
      setTournaments(multiplayerEngine.getTournaments());
    });
    
    multiplayerEngine.on('tournamentJoined', () => {
      setTournaments(multiplayerEngine.getTournaments());
    });
    
    multiplayerEngine.on('tournamentStarted', (tournament: Tournament) => {
      setTournaments(multiplayerEngine.getTournaments());
      if (selectedTournament?.id === tournament.id) {
        setSelectedTournament(tournament);
      }
    });
  }, [selectedTournament]);

  const handleCreateTournament = async () => {
    try {
      const tournament = await multiplayerEngine.createTournament(currentUserId, formData);
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        type: 'weekly',
        entryFee: 0,
        prizePool: 1000,
        maxParticipants: 16,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        rules: {
          maxRounds: 12,
          timeLimit: 180,
          weightClass: 'open',
          allowSubstitutions: false,
          tiebreaker: 'judges_decision'
        }
      });
    } catch (error) {
      console.error('Failed to create tournament:', error);
    }
  };

  const handleJoinTournament = async (tournamentId: string) => {
    try {
      const success = await multiplayerEngine.joinTournament(currentUserId, tournamentId);
      if (success) {
        // Update tournaments list
        setTournaments(multiplayerEngine.getTournaments());
      }
    } catch (error) {
      console.error('Failed to join tournament:', error);
    }
  };

  const renderCreateForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Tournament</h2>
          <button 
            onClick={() => setShowCreateForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tournament Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter tournament name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter tournament description"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tournament Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="special">Special</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Participants
              </label>
              <select
                value={formData.maxParticipants}
                onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={8}>8 Players</option>
                <option value={16}>16 Players</option>
                <option value={32}>32 Players</option>
                <option value={64}>64 Players</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entry Fee ($)
              </label>
              <input
                type="number"
                value={formData.entryFee}
                onChange={(e) => setFormData({...formData, entryFee: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prize Pool ($)
              </label>
              <input
                type="number"
                value={formData.prizePool}
                onChange={(e) => setFormData({...formData, prizePool: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={formData.startDate.toISOString().slice(0, 16)}
                onChange={(e) => setFormData({...formData, startDate: new Date(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="datetime-local"
                value={formData.endDate.toISOString().slice(0, 16)}
                onChange={(e) => setFormData({...formData, endDate: new Date(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Tournament Rules</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Rounds
                </label>
                <input
                  type="number"
                  value={formData.rules.maxRounds}
                  onChange={(e) => setFormData({
                    ...formData, 
                    rules: {...formData.rules, maxRounds: parseInt(e.target.value)}
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="15"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Limit (seconds)
                </label>
                <input
                  type="number"
                  value={formData.rules.timeLimit}
                  onChange={(e) => setFormData({
                    ...formData, 
                    rules: {...formData.rules, timeLimit: parseInt(e.target.value)}
                  })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="60"
                  max="300"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCreateTournament}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Tournament
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTournamentCard = (tournament: Tournament) => (
    <div key={tournament.id} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h4 className="font-semibold text-lg">{tournament.name}</h4>
            <span className={`px-2 py-1 rounded text-xs ${
              tournament.status === 'registration' ? 'bg-blue-100 text-blue-700' :
              tournament.status === 'active' ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {tournament.status}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{tournament.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span>Prize: ${tournament.prizePool.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span>{tournament.currentParticipants}/{tournament.maxParticipants}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span>{tournament.type}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>{tournament.entryFee > 0 ? `$${tournament.entryFee}` : 'Free'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Starts: {tournament.startDate.toLocaleDateString()}</span>
            <span>•</span>
            <span>Ends: {tournament.endDate.toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          {tournament.status === 'registration' && (
            <button 
              onClick={() => handleJoinTournament(tournament.id)}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Join
            </button>
          )}
          <button 
            onClick={() => {
              setSelectedTournament(tournament);
              setShowBrackets(true);
            }}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );

  const renderBrackets = (tournament: Tournament) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{tournament.name} - Tournament Brackets</h2>
          <button 
            onClick={() => setShowBrackets(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {tournament.brackets ? (
          <div className="space-y-6">
            {tournament.brackets.map((bracket, bracketIndex) => (
              <div key={bracket.round} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Round {bracket.round}</h3>
                <div className="grid gap-4">
                  {bracket.matches.map((match, matchIndex) => (
                    <div key={match.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Match {matchIndex + 1}</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              match.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                              match.status === 'active' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {match.status}
                            </span>
                          </div>
                          
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                              <span className="text-sm">{match.player1Id}</span>
                              {match.winnerId === match.player1Id && (
                                <Award className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                              <span className="text-sm">{match.player2Id}</span>
                              {match.winnerId === match.player2Id && (
                                <Award className="w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {match.status === 'scheduled' && (
                            <button className="px-2 py-1 bg-green-600 text-white rounded text-xs">
                              Start
                            </button>
                          )}
                          <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Brackets will be generated when tournament starts</p>
          </div>
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'available', label: 'Available Tournaments', icon: <Trophy className="w-4 h-4" /> },
    { id: 'my-tournaments', label: 'My Tournaments', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'completed', label: 'Completed', icon: <Award className="w-4 h-4" /> }
  ];

  const renderTabContent = () => {
    const availableTournaments = tournaments.filter(t => t.status === 'registration');
    const myTournaments = tournaments.filter(t => 
      t.participants.some(p => p.userId === currentUserId)
    );
    const completedTournaments = tournaments.filter(t => t.status === 'completed');

    switch (activeTab) {
      case 'available':
        return (
          <div className="space-y-4">
            {availableTournaments.map(renderTournamentCard)}
            {availableTournaments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No available tournaments</p>
                <p className="text-sm">Check back later for new tournaments!</p>
              </div>
            )}
          </div>
        );
      case 'my-tournaments':
        return (
          <div className="space-y-4">
            {myTournaments.map(renderTournamentCard)}
            {myTournaments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <UserCheck className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>You haven't joined any tournaments yet</p>
                <p className="text-sm">Join a tournament to get started!</p>
              </div>
            )}
          </div>
        );
      case 'completed':
        return (
          <div className="space-y-4">
            {completedTournaments.map(renderTournamentCard)}
            {completedTournaments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No completed tournaments</p>
                <p className="text-sm">Complete tournaments to see results here!</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tournament Manager</h2>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Create Tournament
        </button>
      </div>
      
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        {renderTabContent()}
      </div>
      
      {showCreateForm && renderCreateForm()}
      {showBrackets && selectedTournament && renderBrackets(selectedTournament)}
    </div>
  );
};

export default TournamentManager; 