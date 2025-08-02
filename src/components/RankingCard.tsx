import React from 'react'
import { Ranking } from '../lib/unified-types'
import { TrendingUp, TrendingDown, Minus, Medal, Trophy } from 'lucide-react'

interface RankingCardProps {
  ranking: Ranking
  index: number
  onViewFighter?: (fighterName: string) => void
}

const RankingCard: React.FC<RankingCardProps> = ({ ranking, index, onViewFighter }) => {
  const getMovementIcon = (movement?: string) => {
    switch (movement) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600'
    if (rank === 2) return 'text-gray-600'
    if (rank === 3) return 'text-amber-600'
    return 'text-gray-900'
  }

  const getRankBackground = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200'
    if (rank === 2) return 'bg-gray-50 border-gray-200'
    if (rank === 3) return 'bg-amber-50 border-amber-200'
    return 'bg-white border-gray-200'
  }

  return (
    <div className={`rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border ${getRankBackground(ranking.rank_position)}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`text-2xl font-bold ${getRankColor(ranking.rank_position)}`}>
            {ranking.rank_position}
          </div>
          
          {ranking.rank_position <= 3 && (
            <Medal className={`w-5 h-5 ${
              ranking.rank_position === 1 ? 'text-yellow-500' :
              ranking.rank_position === 2 ? 'text-gray-400' :
              'text-amber-500'
            }`} />
          )}
        </div>

        <div className="flex items-center space-x-2">
          {getMovementIcon(ranking.movement)}
          <span className="text-sm capitalize text-gray-600">
            {ranking.movement || 'unchanged'}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <h3 
          className={`font-semibold text-gray-900 ${onViewFighter ? 'cursor-pointer hover:text-blue-600' : ''}`}
          onClick={() => onViewFighter?.(ranking.fighter_name)}
        >
          {ranking.fighter_name}
        </h3>
        <p className="text-sm text-gray-600 capitalize">{ranking.weight_class}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-gray-600 text-xs">Points</p>
          <p className="font-semibold">{ranking.points || 0}</p>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-gray-600 text-xs">Record</p>
          <p className="font-semibold">
            {ranking.record_wins || 0}-{ranking.record_losses || 0}-{ranking.record_draws || 0}
          </p>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-gray-600 text-xs">Win Streak</p>
          <p className="font-semibold">{ranking.win_streak || 0}</p>
        </div>
        
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-gray-600 text-xs">Last Fight</p>
          <p className="font-semibold text-xs">
            {ranking.last_fight ? new Date(ranking.last_fight).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      {ranking.rank_position === 1 && (
        <div className="mt-3 flex items-center space-x-1">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-xs font-medium text-yellow-700">Champion</span>
        </div>
      )}
    </div>
  )
}

export default RankingCard 