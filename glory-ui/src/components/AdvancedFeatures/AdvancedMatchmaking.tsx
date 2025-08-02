import React, { useState, useEffect } from 'react';
import { Users, Target, MapPin, Clock, Star, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { advancedMatchmaking } from '../../lib/advanced-matchmaking';
import type { MatchmakingPlayer, MatchmakingCriteria } from '../../lib/advanced-matchmaking';

interface AdvancedMatchmakingProps {
  currentUserId: string;
  currentUsername: string;
  onMatchFound?: (match: any) => void;
}

const AdvancedMatchmaking: React.FC<AdvancedMatchmakingProps> = ({
  currentUserId,
  currentUsername,
  onMatchFound
}) => {
  const [isInQueue, setIsInQueue] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(0);
  const [matchmakingCriteria, setMatchmakingCriteria] = useState<MatchmakingCriteria>({
    skillLevel: 5,
    region: 'US',
    preferredGameTypes: ['competitive'],
    maxWaitTime: 60,
    skillTolerance: 2,
    regionPriority: true
  });
  const [queueStats, setQueueStats] = useState<any>(null);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Set up event listeners
    const handlePlayerQueued = (data: any) => {
      if (data.playerId === currentUserId) {
        setIsInQueue(true);
        setError('');
      }
    };

    const handlePlayerRemoved = (data: any) => {
      if (data.playerId === currentUserId) {
        setIsInQueue(false);
        setQueuePosition(0);
      }
    };

    const handleMatchFound = (match: any) => {
      setIsInQueue(false);
      setQueuePosition(0);
      setRecentMatches(prev => [match, ...prev.slice(0, 4)]);
      onMatchFound?.(match);
    };

    const handlePlayerExpired = (data: any) => {
      if (data.playerId === currentUserId) {
        setIsInQueue(false);
        setQueuePosition(0);
        setError('Matchmaking timeout - no suitable opponents found');
      }
    };

    // Add event listeners
    advancedMatchmaking.on('playerQueued', handlePlayerQueued);
    advancedMatchmaking.on('playerRemoved', handlePlayerRemoved);
    advancedMatchmaking.on('matchFound', handleMatchFound);
    advancedMatchmaking.on('playerExpired', handlePlayerExpired);

    // Update queue stats periodically
    const updateStats = () => {
      const stats = advancedMatchmaking.getQueueStatus();
      setQueueStats(stats);
      
      if (isInQueue) {
        const playerStats = advancedMatchmaking.getQueueStatus(currentUserId);
        setQueuePosition(playerStats.position);
        setEstimatedWaitTime(playerStats.estimatedWaitTime);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);

    return () => {
      // Clean up event listeners
      advancedMatchmaking.off('playerQueued', handlePlayerQueued);
      advancedMatchmaking.off('playerRemoved', handlePlayerRemoved);
      advancedMatchmaking.off('matchFound', handleMatchFound);
      advancedMatchmaking.off('playerExpired', handlePlayerExpired);
      clearInterval(interval);
    };
  }, [currentUserId, isInQueue, onMatchFound]);

  const handleJoinQueue = () => {
    try {
      setError('');
      const player: MatchmakingPlayer = {
        id: currentUserId,
        username: currentUsername,
        skillLevel: matchmakingCriteria.skillLevel,
        region: matchmakingCriteria.region,
        preferredGameTypes: matchmakingCriteria.preferredGameTypes,
        currentRating: 1500,
        winRate: 0.5,
        totalGames: 25,
        lastActive: Date.now(),
        isOnline: true
      };

      advancedMatchmaking.addToQueue(player, matchmakingCriteria);
    } catch (err) {
      setError('Failed to join queue');
    }
  };

  const handleLeaveQueue = () => {
    try {
      advancedMatchmaking.removeFromQueue(currentUserId);
    } catch (err) {
      setError('Failed to leave queue');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSkillLevelColor = (level: number) => {
    if (level >= 8) return 'text-purple-600';
    if (level >= 6) return 'text-blue-600';
    if (level >= 4) return 'text-green-600';
    if (level >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Advanced Matchmaking</h3>
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-gray-600">
            {queueStats?.totalPlayers || 0} in queue
          </span>
        </div>
      </div>

      {/* Matchmaking Criteria */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Matchmaking Criteria</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Skill Level
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="10"
                value={matchmakingCriteria.skillLevel}
                onChange={(e) => setMatchmakingCriteria(prev => ({
                  ...prev,
                  skillLevel: parseInt(e.target.value)
                }))}
                className="flex-1"
              />
              <span className={`font-bold ${getSkillLevelColor(matchmakingCriteria.skillLevel)}`}>
                {matchmakingCriteria.skillLevel}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Region
            </label>
            <select
              value={matchmakingCriteria.region}
              onChange={(e) => setMatchmakingCriteria(prev => ({
                ...prev,
                region: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="US">United States</option>
              <option value="EU">Europe</option>
              <option value="AS">Asia</option>
              <option value="SA">South America</option>
              <option value="AF">Africa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Game Types
            </label>
            <div className="space-y-1">
              {['competitive', 'casual', 'tournament', 'practice'].map(type => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={matchmakingCriteria.preferredGameTypes.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setMatchmakingCriteria(prev => ({
                          ...prev,
                          preferredGameTypes: [...prev.preferredGameTypes, type]
                        }));
                      } else {
                        setMatchmakingCriteria(prev => ({
                          ...prev,
                          preferredGameTypes: prev.preferredGameTypes.filter(t => t !== type)
                        }));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Max Wait Time (seconds)
            </label>
            <input
              type="number"
              min="30"
              max="300"
              value={matchmakingCriteria.maxWaitTime}
              onChange={(e) => setMatchmakingCriteria(prev => ({
                ...prev,
                maxWaitTime: parseInt(e.target.value)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Skill Tolerance
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={matchmakingCriteria.skillTolerance}
              onChange={(e) => setMatchmakingCriteria(prev => ({
                ...prev,
                skillTolerance: parseInt(e.target.value)
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={matchmakingCriteria.regionPriority}
                onChange={(e) => setMatchmakingCriteria(prev => ({
                  ...prev,
                  regionPriority: e.target.checked
                }))}
                className="mr-2"
              />
              <span className="text-sm">Regional Priority</span>
            </label>
          </div>
        </div>
      </div>

      {/* Queue Status */}
      {isInQueue && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
              <span className="font-medium text-blue-700">In Queue</span>
            </div>
            <div className="text-sm text-blue-600">
              Position: {queuePosition}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{queuePosition}</div>
              <div className="text-blue-600">Position</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {formatTime(estimatedWaitTime)}
              </div>
              <div className="text-green-600">Est. Wait</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {queueStats?.totalPlayers || 0}
              </div>
              <div className="text-purple-600">In Queue</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">
                {queueStats?.averageWaitTime ? formatTime(queueStats.averageWaitTime) : '0:00'}
              </div>
              <div className="text-orange-600">Avg Wait</div>
            </div>
          </div>

          <button
            onClick={handleLeaveQueue}
            className="mt-3 w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Leave Queue
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {!isInQueue && (
        <div className="mb-6">
          <button
            onClick={handleJoinQueue}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <Target className="w-5 h-5" />
            <span>Find Match</span>
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Recent Matches */}
      {recentMatches.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Recent Matches</h4>
          <div className="space-y-2">
            {recentMatches.map((match, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Match Found</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {match.players?.map((player: any) => player.username).join(' vs ') || 'Match details'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queue Statistics */}
      {queueStats && (
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Queue Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {queueStats.totalPlayers || 0}
              </div>
              <div className="text-gray-600">Total Players</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {queueStats.averageWaitTime ? formatTime(queueStats.averageWaitTime) : '0:00'}
              </div>
              <div className="text-gray-600">Avg Wait Time</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(queueStats.regionalDistribution || {}).length}
              </div>
              <div className="text-gray-600">Regions</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {advancedMatchmaking.getStats().activeMatches}
              </div>
              <div className="text-gray-600">Active Matches</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedMatchmaking; 