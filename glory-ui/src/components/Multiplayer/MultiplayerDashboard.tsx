import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  BarChart3, 
  MessageSquare, 
  Gamepad2, 
  UserPlus,
  Wifi,
  WifiOff,
  Clock,
  Star,
  Award,
  Target
} from 'lucide-react';
import { 
  multiplayerEngine, 
  MultiplayerUser, 
  MultiplayerGame, 
  Tournament, 
  LeaderboardEntry,
  SocialFeature
} from '../../lib/multiplayer-engine';

interface MultiplayerDashboardProps {
  currentUserId?: string;
  currentUsername?: string;
}

const MultiplayerDashboard: React.FC<MultiplayerDashboardProps> = ({ 
  currentUserId = 'user1', 
  currentUsername = 'Player' 
}) => {
  const [activeTab, setActiveTab] = useState('games');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [users, setUsers] = useState<MultiplayerUser[]>([]);
  const [games, setGames] = useState<MultiplayerGame[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [socialFeatures, setSocialFeatures] = useState<SocialFeature[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to multiplayer engine
    const connectToMultiplayer = async () => {
      const connected = await multiplayerEngine.connect(currentUserId, currentUsername);
      setIsConnected(connected);
      setConnectionStatus(multiplayerEngine.getConnectionStatus());
      
      if (connected) {
        // Set up event listeners
        multiplayerEngine.on('userConnected', (user: MultiplayerUser) => {
          setUsers(multiplayerEngine.getUsers());
        });
        
        multiplayerEngine.on('gameCreated', (game: MultiplayerGame) => {
          setGames(multiplayerEngine.getGames());
        });
        
        multiplayerEngine.on('tournamentCreated', (tournament: Tournament) => {
          setTournaments(multiplayerEngine.getTournaments());
        });
        
        multiplayerEngine.on('leaderboardUpdated', (leaderboard: LeaderboardEntry[]) => {
          setLeaderboard(leaderboard);
        });
        
        // Load initial data
        setUsers(multiplayerEngine.getUsers());
        setGames(multiplayerEngine.getGames());
        setTournaments(multiplayerEngine.getTournaments());
        setLeaderboard(multiplayerEngine.getLeaderboard());
        setSocialFeatures(multiplayerEngine.getSocialFeatures(currentUserId));
      }
    };

    connectToMultiplayer();

    return () => {
      multiplayerEngine.disconnect(currentUserId);
    };
  }, [currentUserId, currentUsername]);

  const tabs = [
    { id: 'games', label: 'Games', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'tournaments', label: 'Tournaments', icon: <Trophy className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'social', label: 'Social', icon: <Users className="w-4 h-4" /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> }
  ];

  const renderConnectionStatus = () => (
    <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-green-600 font-medium">Connected to Multiplayer</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-red-500" />
          <span className="text-red-600 font-medium">Disconnected</span>
        </>
      )}
    </div>
  );

  const renderGamesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Active Games</h3>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => {/* TODO: Create new game */}}
        >
          Create Game
        </button>
      </div>
      
      <div className="grid gap-4">
        {games.map(game => (
          <div key={game.id} className="p-4 border rounded-lg bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{game.name}</h4>
                <p className="text-sm text-gray-600">
                  {game.type} • {game.players.length}/{game.maxPlayers} players
                </p>
                <p className="text-sm text-gray-500">
                  Status: {game.status} • Created {game.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                {game.status === 'waiting' && (
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                    Join
                  </button>
                )}
                <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {games.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Gamepad2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No active games</p>
            <p className="text-sm">Create a new game to get started!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTournamentsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tournaments</h3>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => {/* TODO: Create tournament */}}
        >
          Create Tournament
        </button>
      </div>
      
      <div className="grid gap-4">
        {tournaments.map(tournament => (
          <div key={tournament.id} className="p-4 border rounded-lg bg-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h4 className="font-semibold">{tournament.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    tournament.status === 'registration' ? 'bg-blue-100 text-blue-700' :
                    tournament.status === 'active' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {tournament.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{tournament.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Prize Pool</p>
                    <p className="font-semibold">${tournament.prizePool.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Participants</p>
                    <p className="font-semibold">{tournament.currentParticipants}/{tournament.maxParticipants}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Entry Fee</p>
                    <p className="font-semibold">${tournament.entryFee}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-semibold capitalize">{tournament.type}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {tournament.status === 'registration' && (
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                    Join
                  </button>
                )}
                <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {tournaments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No tournaments available</p>
            <p className="text-sm">Check back later for new tournaments!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderLeaderboardTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Global Leaderboard</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
            Global
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
            Weekly
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Rank</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Player</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Score</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Record</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Win Rate</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Earnings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leaderboard.map((entry, index) => (
              <tr key={entry.userId} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {index < 3 ? (
                      <Award className={`w-5 h-5 ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        'text-orange-500'
                      }`} />
                    ) : (
                      <span className="w-5 h-5 text-center text-sm font-medium">
                        {entry.rank}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {entry.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{entry.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold">{entry.score.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">
                  {entry.wins}W - {entry.losses}L - {entry.draws}D
                </td>
                <td className="px-4 py-3 text-sm">{entry.winRate.toFixed(1)}%</td>
                <td className="px-4 py-3 text-sm">${entry.totalEarnings.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Social</h3>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => {/* TODO: Add friend */}}
        >
          Add Friend
        </button>
      </div>
      
      <div className="grid gap-4">
        <div className="p-4 border rounded-lg bg-white">
          <h4 className="font-semibold mb-3">Online Players</h4>
          <div className="space-y-2">
            {users.filter(user => user.isOnline).map(user => (
              <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                  <span className="font-medium">{user.username}</span>
                  <span className="text-sm text-gray-500">Rank {user.rank}</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
                    Challenge
                  </button>
                  <button className="px-2 py-1 bg-gray-600 text-white rounded text-xs">
                    Add Friend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border rounded-lg bg-white">
          <h4 className="font-semibold mb-3">Recent Activity</h4>
          <div className="space-y-2">
            {socialFeatures.slice(0, 5).map(feature => (
              <div key={feature.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">{feature.content}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {feature.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Global Chat</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
            Global
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
            Tournament
          </button>
        </div>
      </div>
      
      <div className="bg-white border rounded-lg h-96 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            <div className="text-center text-sm text-gray-500 py-4">
              Welcome to Glory Boxing Manager Global Chat!
            </div>
            {/* Chat messages would be rendered here */}
          </div>
        </div>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'games':
        return renderGamesTab();
      case 'tournaments':
        return renderTournamentsTab();
      case 'leaderboard':
        return renderLeaderboardTab();
      case 'social':
        return renderSocialTab();
      case 'chat':
        return renderChatTab();
      default:
        return renderGamesTab();
    }
  };

  return (
    <div className="space-y-6">
      {renderConnectionStatus()}
      
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
    </div>
  );
};

export default MultiplayerDashboard; 