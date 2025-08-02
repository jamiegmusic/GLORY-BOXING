import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Share2, Download, Star, Clock, Users, Eye } from 'lucide-react';
import { replaySystem } from '../../lib/replay-system';
import type { ReplayData, ReplayFilter } from '../../lib/replay-system';

interface ReplaySystemProps {
  currentUserId: string;
  currentUsername: string;
}

const ReplaySystem: React.FC<ReplaySystemProps> = ({
  currentUserId,
  currentUsername
}) => {
  const [replays, setReplays] = useState<ReplayData[]>([]);
  const [selectedReplay, setSelectedReplay] = useState<ReplayData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<ReplayFilter>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Set up event listeners
    const handleReplayStarted = (data: any) => {
      setIsPlaying(true);
    };

    const handleReplayPaused = (data: any) => {
      setIsPlaying(false);
    };

    const handleReplayResumed = (data: any) => {
      setIsPlaying(true);
    };

    const handleReplayStopped = (data: any) => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleReplaySeeked = (data: any) => {
      setCurrentTime(data.time);
    };

    const handleReplaySpeedChanged = (data: any) => {
      setPlaybackSpeed(data.speed);
    };

    const handleReplayLoopSet = (data: any) => {
      setIsLooping(true);
      setLoopStart(data.start);
      setLoopEnd(data.end);
    };

    const handleReplayLoopCleared = (data: any) => {
      setIsLooping(false);
      setLoopStart(0);
      setLoopEnd(0);
    };

    const handleHighlightCreated = (data: any) => {
      updateReplays();
    };

    const handleReplayShared = (data: any) => {
      // Handle share success
    };

    const handleReplayRated = (data: any) => {
      updateReplays();
    };

    // Add event listeners
    replaySystem.on('replayStarted', handleReplayStarted);
    replaySystem.on('replayPaused', handleReplayPaused);
    replaySystem.on('replayResumed', handleReplayResumed);
    replaySystem.on('replayStopped', handleReplayStopped);
    replaySystem.on('replaySeeked', handleReplaySeeked);
    replaySystem.on('replaySpeedChanged', handleReplaySpeedChanged);
    replaySystem.on('replayLoopSet', handleReplayLoopSet);
    replaySystem.on('replayLoopCleared', handleReplayLoopCleared);
    replaySystem.on('highlightCreated', handleHighlightCreated);
    replaySystem.on('replayShared', handleReplayShared);
    replaySystem.on('replayRated', handleReplayRated);

    // Initialize with mock data
    initializeMockReplays();
    updateReplays();

    return () => {
      // Clean up event listeners
      replaySystem.off('replayStarted', handleReplayStarted);
      replaySystem.off('replayPaused', handleReplayPaused);
      replaySystem.off('replayResumed', handleReplayResumed);
      replaySystem.off('replayStopped', handleReplayStopped);
      replaySystem.off('replaySeeked', handleReplaySeeked);
      replaySystem.off('replaySpeedChanged', handleReplaySpeedChanged);
      replaySystem.off('replayLoopSet', handleReplayLoopSet);
      replaySystem.off('replayLoopCleared', handleReplayLoopCleared);
      replaySystem.off('highlightCreated', handleHighlightCreated);
      replaySystem.off('replayShared', handleReplayShared);
      replaySystem.off('replayRated', handleReplayRated);
    };
  }, []);

  const initializeMockReplays = () => {
    const mockReplays: ReplayData[] = [
      {
        id: 'replay_1',
        matchId: 'match_1',
        title: 'Epic Championship Fight',
        description: 'An incredible match between two top contenders',
        createdAt: Date.now() - 86400000, // 1 day ago
        duration: 540, // 9 minutes
        players: [
          {
            id: 'player1',
            username: 'Champion',
            initialStats: { health: 100, stamina: 100, score: 0, punchesLanded: 0, punchesThrown: 0, accuracy: 0, defense: 0, speed: 0 },
            finalStats: { health: 85, stamina: 70, score: 120, punchesLanded: 45, punchesThrown: 80, accuracy: 56, defense: 75, speed: 80 },
            actions: []
          },
          {
            id: 'player2',
            username: 'Challenger',
            initialStats: { health: 100, stamina: 100, score: 0, punchesLanded: 0, punchesThrown: 0, accuracy: 0, defense: 0, speed: 0 },
            finalStats: { health: 92, stamina: 80, score: 95, punchesLanded: 38, punchesThrown: 75, accuracy: 51, defense: 82, speed: 75 },
            actions: []
          }
        ],
        events: [],
        metadata: {
          gameVersion: '1.0.0',
          rules: 'standard',
          tags: ['championship', 'epic', 'close'],
          rating: 4.8,
          views: 1250,
          shares: 45
        },
        highlights: [
          { id: 'hl1', timestamp: 120, duration: 15, type: 'knockdown', title: 'Amazing Knockdown', description: 'Champion delivers a devastating blow', playerId: 'player1' },
          { id: 'hl2', timestamp: 300, duration: 20, type: 'combo', title: 'Brilliant Combo', description: 'Perfect combination of punches', playerId: 'player2' }
        ],
        analysis: {
          overallScore: 85,
          keyMoments: [],
          statistics: {
            totalRounds: 3,
            totalTime: 540,
            totalPunches: 155,
            totalDamage: 2800,
            knockdowns: 1,
            knockouts: 0,
            accuracy: 54,
            defense: 78,
            aggression: 65
          },
          insights: [],
          recommendations: []
        }
      },
      {
        id: 'replay_2',
        matchId: 'match_2',
        title: 'Rookie vs Veteran',
        description: 'Experience meets raw talent',
        createdAt: Date.now() - 172800000, // 2 days ago
        duration: 480, // 8 minutes
        players: [
          {
            id: 'player3',
            username: 'Rookie',
            initialStats: { health: 100, stamina: 100, score: 0, punchesLanded: 0, punchesThrown: 0, accuracy: 0, defense: 0, speed: 0 },
            finalStats: { health: 78, stamina: 60, score: 85, punchesLanded: 32, punchesThrown: 65, accuracy: 49, defense: 65, speed: 70 },
            actions: []
          },
          {
            id: 'player4',
            username: 'Veteran',
            initialStats: { health: 100, stamina: 100, score: 0, punchesLanded: 0, punchesThrown: 0, accuracy: 0, defense: 0, speed: 0 },
            finalStats: { health: 95, stamina: 85, score: 145, punchesLanded: 52, punchesThrown: 85, accuracy: 61, defense: 88, speed: 75 },
            actions: []
          }
        ],
        events: [],
        metadata: {
          gameVersion: '1.0.0',
          rules: 'standard',
          tags: ['rookie', 'veteran', 'learning'],
          rating: 4.2,
          views: 850,
          shares: 23
        },
        highlights: [
          { id: 'hl3', timestamp: 180, duration: 12, type: 'defense', title: 'Perfect Defense', description: 'Veteran shows masterful defense', playerId: 'player4' }
        ],
        analysis: {
          overallScore: 72,
          keyMoments: [],
          statistics: {
            totalRounds: 3,
            totalTime: 480,
            totalPunches: 150,
            totalDamage: 2300,
            knockdowns: 0,
            knockouts: 0,
            accuracy: 56,
            defense: 76,
            aggression: 58
          },
          insights: [],
          recommendations: []
        }
      }
    ];

    // Add mock replays to the system
    mockReplays.forEach(replay => {
      // In a real implementation, these would be added to the replay system
    });
  };

  const updateReplays = () => {
    const allReplays = replaySystem.getAllReplays();
    setReplays(allReplays);
  };

  const handlePlayReplay = (replayId: string) => {
    try {
      setError('');
      const success = replaySystem.playReplay(replayId);
      if (success) {
        const replay = replays.find(r => r.id === replayId);
        setSelectedReplay(replay || null);
        setTotalTime(replay?.duration || 0);
      } else {
        setError('Failed to play replay');
      }
    } catch (err) {
      setError('Failed to play replay');
    }
  };

  const handlePauseReplay = () => {
    if (selectedReplay) {
      replaySystem.pauseReplay(selectedReplay.id);
    }
  };

  const handleResumeReplay = () => {
    if (selectedReplay) {
      replaySystem.resumeReplay(selectedReplay.id);
    }
  };

  const handleStopReplay = () => {
    if (selectedReplay) {
      replaySystem.stopReplay(selectedReplay.id);
    }
  };

  const handleSeekReplay = (time: number) => {
    if (selectedReplay) {
      replaySystem.seekReplay(selectedReplay.id, time);
    }
  };

  const handleSetSpeed = (speed: number) => {
    if (selectedReplay) {
      replaySystem.setReplaySpeed(selectedReplay.id, speed);
    }
  };

  const handleCreateHighlight = () => {
    if (selectedReplay) {
      const startTime = currentTime;
      const endTime = Math.min(currentTime + 30, totalTime);
      const highlight = replaySystem.createHighlight(
        selectedReplay.id,
        startTime,
        endTime,
        'New Highlight',
        'User created highlight'
      );
      if (highlight) {
        updateReplays();
      }
    }
  };

  const handleShareReplay = (platform: string) => {
    if (selectedReplay) {
      const shareUrl = replaySystem.shareReplay(selectedReplay.id, platform);
      // In a real implementation, this would open the share dialog
      console.log(`Sharing to ${platform}: ${shareUrl}`);
    }
  };

  const handleRateReplay = (rating: number) => {
    if (selectedReplay) {
      replaySystem.rateReplay(selectedReplay.id, rating);
    }
  };

  const handleExportReplay = (format: 'json' | 'mp4' | 'gif') => {
    if (selectedReplay) {
      const exportData = replaySystem.exportReplay(selectedReplay.id, format);
      // In a real implementation, this would trigger a download
      console.log(`Exporting as ${format}:`, exportData);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const filteredReplays = replays.filter(replay => {
    if (searchQuery && !replay.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !replay.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filter.playerId && !replay.players.some(p => p.id === filter.playerId)) {
      return false;
    }
    if (filter.minRating && replay.metadata.rating < filter.minRating) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Replay System</h3>
        <div className="flex items-center space-x-2">
          <Play className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600">
            {replays.length} replays available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Replay Library */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search replays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredReplays.map(replay => (
              <div
                key={replay.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedReplay?.id === replay.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedReplay(replay)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 truncate">{replay.title}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{replay.metadata.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{replay.description}</p>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>{replay.players[0]?.username} vs {replay.players[1]?.username}</span>
                    <span>{formatTime(replay.duration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{formatDate(replay.createdAt)}</span>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-3 h-3" />
                      <span>{replay.metadata.views}</span>
                    </div>
                  </div>
                </div>

                {replay.highlights.length > 0 && (
                  <div className="mt-2 flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-gray-600">{replay.highlights.length} highlights</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Replay Player */}
        <div className="lg:col-span-2">
          {selectedReplay ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-700">{selectedReplay.title}</h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleShareReplay('twitter')}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExportReplay('mp4')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Video Player Placeholder */}
              <div className="bg-gray-900 rounded-lg p-8 mb-4 text-center">
                <div className="text-white text-lg mb-2">Replay Video Player</div>
                <div className="text-gray-400 text-sm">
                  {formatTime(currentTime)} / {formatTime(totalTime)}
                </div>
              </div>

              {/* Playback Controls */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-700">Playback Controls</h5>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSetSpeed(0.5)}
                      className={`px-2 py-1 text-xs rounded ${playbackSpeed === 0.5 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                      0.5x
                    </button>
                    <button
                      onClick={() => handleSetSpeed(1)}
                      className={`px-2 py-1 text-xs rounded ${playbackSpeed === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                      1x
                    </button>
                    <button
                      onClick={() => handleSetSpeed(2)}
                      className={`px-2 py-1 text-xs rounded ${playbackSpeed === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                      2x
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mb-3">
                  <button
                    onClick={() => handleSeekReplay(Math.max(0, currentTime - 10))}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  
                  {isPlaying ? (
                    <button
                      onClick={handlePauseReplay}
                      className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                      <Pause className="w-6 h-6" />
                    </button>
                  ) : (
                    <button
                      onClick={handleResumeReplay}
                      className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                    >
                      <Play className="w-6 h-6" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleSeekReplay(Math.min(totalTime, currentTime + 10))}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <SkipBack className="w-4 h-4 text-gray-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(currentTime / totalTime) * 100}%` }}
                    />
                  </div>
                  <SkipForward className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Match Statistics */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h5 className="font-medium text-gray-700 mb-3">Match Statistics</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedReplay.analysis.statistics.totalRounds}
                    </div>
                    <div className="text-gray-600">Rounds</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedReplay.analysis.statistics.totalPunches}
                    </div>
                    <div className="text-gray-600">Punches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedReplay.analysis.statistics.accuracy}%
                    </div>
                    <div className="text-gray-600">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedReplay.analysis.statistics.knockdowns}
                    </div>
                    <div className="text-gray-600">Knockdowns</div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              {selectedReplay.highlights.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-700">Highlights</h5>
                    <button
                      onClick={handleCreateHighlight}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Create Highlight
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedReplay.highlights.map(highlight => (
                      <div key={highlight.id} className="flex items-center justify-between p-3 bg-white rounded">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            highlight.type === 'knockdown' ? 'bg-red-500' :
                            highlight.type === 'knockout' ? 'bg-purple-500' :
                            highlight.type === 'combo' ? 'bg-green-500' :
                            highlight.type === 'defense' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`} />
                          <div>
                            <div className="font-medium text-gray-900">{highlight.title}</div>
                            <div className="text-sm text-gray-600">{highlight.description}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(highlight.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              <div className="mt-4 flex items-center space-x-4">
                <span className="text-sm text-gray-600">Rate this replay:</span>
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleRateReplay(rating)}
                    className={`p-1 ${selectedReplay.metadata.rating >= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    <Star className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Play className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a replay to view</p>
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

export default ReplaySystem; 