import React, { useState, useEffect } from 'react';
import { Eye, Users, MessageSquare, Play, Pause, SkipBack, SkipForward, Volume2, Settings, Star } from 'lucide-react';
import { spectatorSystem } from '../../lib/spectator-system';
import type { Spectator, SpectatorSettings, LiveMatchData } from '../../lib/spectator-system';

interface SpectatorModeProps {
  currentUserId: string;
  currentUsername: string;
}

const SpectatorMode: React.FC<SpectatorModeProps> = ({
  currentUserId,
  currentUsername
}) => {
  const [publicMatches, setPublicMatches] = useState<LiveMatchData[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<LiveMatchData | null>(null);
  const [spectatorSettings, setSpectatorSettings] = useState<SpectatorSettings>({
    allowSpectators: true,
    maxSpectators: 100,
    isPublic: true,
    requireApproval: false,
    showPlayerNames: true,
    showChat: true,
    showReplayControls: true
  });
  const [chatMessage, setChatMessage] = useState('');
  const [isWatching, setIsWatching] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(1);
  const [isReplayPlaying, setIsReplayPlaying] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Set up event listeners
    const handleMatchUpdate = (data: any) => {
      if (selectedMatch && data.matchId === selectedMatch.matchId) {
        setSelectedMatch(data.data);
      }
      updatePublicMatches();
    };

    const handleSpectatorJoined = (data: any) => {
      if (data.matchId === selectedMatch?.matchId) {
        updatePublicMatches();
      }
    };

    const handleSpectatorLeft = (data: any) => {
      if (data.matchId === selectedMatch?.matchId) {
        updatePublicMatches();
      }
    };

    const handleChatMessage = (data: any) => {
      if (data.matchId === selectedMatch?.matchId) {
        // Update chat in selected match
        setSelectedMatch(prev => prev ? {
          ...prev,
          chat: [...prev.chat, data.message]
        } : null);
      }
    };

    const handleHighlightsDetected = (data: any) => {
      if (data.matchId === selectedMatch?.matchId) {
        setSelectedMatch(prev => prev ? {
          ...prev,
          highlights: [...prev.highlights, ...data.highlights]
        } : null);
      }
    };

    // Add event listeners
    spectatorSystem.on('matchUpdate', handleMatchUpdate);
    spectatorSystem.on('spectatorJoined', handleSpectatorJoined);
    spectatorSystem.on('spectatorLeft', handleSpectatorLeft);
    spectatorSystem.on('chatMessage', handleChatMessage);
    spectatorSystem.on('highlightsDetected', handleHighlightsDetected);

    // Initialize with mock data
    initializeMockMatches();
    updatePublicMatches();

    return () => {
      // Clean up event listeners
      spectatorSystem.off('matchUpdate', handleMatchUpdate);
      spectatorSystem.off('spectatorJoined', handleSpectatorJoined);
      spectatorSystem.off('spectatorLeft', handleSpectatorLeft);
      spectatorSystem.off('chatMessage', handleChatMessage);
      spectatorSystem.off('highlightsDetected', handleHighlightsDetected);
    };
  }, [selectedMatch]);

  const initializeMockMatches = () => {
    const mockMatches: LiveMatchData[] = [
      {
        matchId: 'match_1',
        players: [
          { id: 'player1', username: 'BoxerPro', health: 85, stamina: 70, score: 120, currentAction: 'jab' },
          { id: 'player2', username: 'FightMaster', health: 92, stamina: 80, score: 95, currentAction: 'block' }
        ],
        round: 2,
        timeRemaining: 145,
        status: 'active',
        spectators: [
          { id: 'spec1', username: 'Viewer1', joinTime: Date.now() - 30000, isPremium: true, region: 'US' },
          { id: 'spec2', username: 'Viewer2', joinTime: Date.now() - 15000, isPremium: false, region: 'EU' }
        ],
        chat: [
          { id: 'chat1', spectatorId: 'spec1', username: 'Viewer1', message: 'Great fight!', timestamp: Date.now() - 10000, isModerated: false },
          { id: 'chat2', spectatorId: 'spec2', username: 'Viewer2', message: 'BoxerPro is dominating!', timestamp: Date.now() - 5000, isModerated: false }
        ],
        highlights: [
          { id: 'hl1', timestamp: Date.now() - 30000, type: 'great_move', description: 'Amazing combo!', playerId: 'player1' },
          { id: 'hl2', timestamp: Date.now() - 15000, type: 'close_call', description: 'Close call!', playerId: 'player2' }
        ]
      },
      {
        matchId: 'match_2',
        players: [
          { id: 'player3', username: 'Champion', health: 100, stamina: 90, score: 0, currentAction: undefined },
          { id: 'player4', username: 'Challenger', health: 100, stamina: 90, score: 0, currentAction: undefined }
        ],
        round: 1,
        timeRemaining: 180,
        status: 'waiting',
        spectators: [],
        chat: [],
        highlights: []
      }
    ];

    mockMatches.forEach(match => {
      spectatorSystem.createSpectatorMatch(match.matchId, match.players, spectatorSettings);
    });
  };

  const updatePublicMatches = () => {
    const matches = spectatorSystem.getPublicMatches();
    setPublicMatches(matches);
  };

  const handleJoinSpectator = (matchId: string) => {
    try {
      setError('');
      const spectator: Spectator = {
        id: currentUserId,
        username: currentUsername,
        joinTime: Date.now(),
        isPremium: false,
        region: 'US'
      };

      const success = spectatorSystem.joinAsSpectator(matchId, spectator);
      if (success) {
        setIsWatching(true);
        const match = publicMatches.find(m => m.matchId === matchId);
        setSelectedMatch(match || null);
      } else {
        setError('Failed to join as spectator');
      }
    } catch (err) {
      setError('Failed to join spectator mode');
    }
  };

  const handleLeaveSpectator = () => {
    if (selectedMatch) {
      spectatorSystem.leaveSpectatorMode(selectedMatch.matchId, currentUserId);
      setIsWatching(false);
      setSelectedMatch(null);
    }
  };

  const handleSendChatMessage = () => {
    if (selectedMatch && chatMessage.trim()) {
      const success = spectatorSystem.sendChatMessage(selectedMatch.matchId, currentUserId, chatMessage);
      if (success) {
        setChatMessage('');
      } else {
        setError('Failed to send message');
      }
    }
  };

  const handleReplayControl = (action: 'play' | 'pause' | 'speed') => {
    if (!selectedMatch) return;

    switch (action) {
      case 'play':
        setIsReplayPlaying(true);
        break;
      case 'pause':
        setIsReplayPlaying(false);
        break;
      case 'speed':
        setReplaySpeed(prev => prev === 1 ? 2 : prev === 2 ? 4 : 1);
        break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getHealthColor = (health: number) => {
    if (health > 80) return 'text-green-600';
    if (health > 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStaminaColor = (stamina: number) => {
    if (stamina > 80) return 'text-blue-600';
    if (stamina > 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Spectator Mode</h3>
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600">
            {publicMatches.length} public matches
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Matches */}
        <div className="lg:col-span-1">
          <h4 className="font-medium text-gray-700 mb-3">Available Matches</h4>
          <div className="space-y-3">
            {publicMatches.map(match => (
              <div
                key={match.matchId}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedMatch?.matchId === match.matchId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedMatch(match)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {match.players[0]?.username} vs {match.players[1]?.username}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    match.status === 'active' ? 'bg-green-100 text-green-800' :
                    match.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {match.status}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Round {match.round} • {formatTime(match.timeRemaining)}</div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{match.spectators.length} spectators</span>
                  </div>
                </div>

                {match.status === 'active' && (
                  <div className="mt-2 flex space-x-2">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Health</div>
                      <div className="flex space-x-1">
                        {match.players.map(player => (
                          <div key={player.id} className="flex-1">
                            <div className={`text-xs font-medium ${getHealthColor(player.health)}`}>
                              {player.health}%
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className={`h-1 rounded-full ${getHealthColor(player.health).replace('text-', 'bg-')}`}
                                style={{ width: `${player.health}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live Match View */}
        <div className="lg:col-span-2">
          {selectedMatch ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-700">Live Match</h4>
                <div className="flex items-center space-x-2">
                  {isWatching ? (
                    <button
                      onClick={handleLeaveSpectator}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Leave
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinSpectator(selectedMatch.matchId)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>

              {/* Match Status */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  {selectedMatch.players.map(player => (
                    <div key={player.id} className="text-center">
                      <div className="font-medium text-gray-900 mb-2">{player.username}</div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs text-gray-500">Health</div>
                          <div className={`text-lg font-bold ${getHealthColor(player.health)}`}>
                            {player.health}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Stamina</div>
                          <div className={`text-lg font-bold ${getStaminaColor(player.stamina)}`}>
                            {player.stamina}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Score</div>
                          <div className="text-lg font-bold text-gray-900">{player.score}</div>
                        </div>
                        {player.currentAction && (
                          <div>
                            <div className="text-xs text-gray-500">Action</div>
                            <div className="text-sm font-medium text-blue-600 capitalize">
                              {player.currentAction}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    Round {selectedMatch.round}
                  </div>
                  <div className="text-lg text-gray-600">
                    {formatTime(selectedMatch.timeRemaining)}
                  </div>
                </div>
              </div>

              {/* Replay Controls */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-700">Replay Controls</h5>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReplayControl('play')}
                      className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReplayControl('pause')}
                      className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReplayControl('speed')}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      {replaySpeed}x
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <SkipBack className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                  <SkipForward className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Chat */}
              {spectatorSettings.showChat && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-700">Chat</h5>
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="h-32 overflow-y-auto mb-3 space-y-2">
                    {selectedMatch.chat.map(message => (
                      <div key={message.id} className="text-sm">
                        <span className="font-medium text-blue-600">{message.username}:</span>
                        <span className="text-gray-700 ml-2">{message.message}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSendChatMessage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}

              {/* Highlights */}
              {selectedMatch.highlights.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-700">Highlights</h5>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                  
                  <div className="space-y-2">
                    {selectedMatch.highlights.map(highlight => (
                      <div key={highlight.id} className="flex items-center space-x-2 p-2 bg-white rounded">
                        <div className={`w-2 h-2 rounded-full ${
                          highlight.type === 'knockdown' ? 'bg-red-500' :
                          highlight.type === 'knockout' ? 'bg-purple-500' :
                          highlight.type === 'great_move' ? 'bg-green-500' :
                          'bg-blue-500'
                        }`} />
                        <span className="text-sm text-gray-700">{highlight.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a match to spectate</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpectatorMode; 