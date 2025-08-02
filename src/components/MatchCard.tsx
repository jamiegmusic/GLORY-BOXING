import React from 'react'
import { Match } from '../lib/unified-types'
import { Calendar, MapPin, Trophy, Play, Eye, Users } from 'lucide-react'

interface MatchCardProps {
  match: Match
  onSimulate?: (matchId: string) => void
  onViewCommentary?: (match: Match) => void
  onViewDetails?: (match: Match) => void
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  onSimulate, 
  onViewCommentary,
  onViewDetails
}) => {
  const isCompleted = !!match.result
  const isTitleBout = !!match.belt

  const getMethodColor = (method?: string) => {
    switch (method?.toLowerCase()) {
      case 'ko':
      case 'tko':
        return 'text-red-600'
      case 'decision':
        return 'text-blue-600'
      case 'submission':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              {match.fighter_a_name} vs {match.fighter_b_name}
            </h3>
          </div>
          
          <div className="flex items-center text-gray-600 mb-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{match.venue_name}</span>
          </div>
          
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {new Date(match.match_date).toLocaleDateString()} at {new Date(match.match_date).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          {!isCompleted && onSimulate && (
            <button
              onClick={() => onSimulate(match.id)}
              className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              title="Simulate Match"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          
          {isCompleted && match.commentary && onViewCommentary && (
            <button
              onClick={() => onViewCommentary(match)}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              title="View Commentary"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {onViewDetails && (
            <button
              onClick={() => onViewDetails(match)}
              className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {isTitleBout && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            <Trophy className="w-3 h-3 mr-1" />
            {match.belt} Title Fight
          </span>
        </div>
      )}

      {isCompleted && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium text-gray-900">{match.result}</p>
            {match.method && (
              <span className={`text-sm font-medium ${getMethodColor(match.method)}`}>
                {match.method.toUpperCase()}
              </span>
            )}
          </div>
          
          {match.rounds && (
            <p className="text-sm text-gray-600">Rounds: {match.rounds}</p>
          )}
          
          {match.total_punches_a && match.total_punches_b && (
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <p>Punches: {match.fighter_a} {match.total_punches_a} - {match.fighter_b} {match.total_punches_b}</p>
              {match.total_power_shots_a && match.total_power_shots_b && (
                <p>Power Shots: {match.fighter_a} {match.total_power_shots_a} - {match.fighter_b} {match.total_power_shots_b}</p>
              )}
              {match.knockdowns_a && match.knockdowns_b && (
                <p>KDs: {match.fighter_a} {match.knockdowns_a} - {match.fighter_b} {match.knockdowns_b}</p>
              )}
            </div>
          )}
        </div>
      )}

      {!isCompleted && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700 font-medium">Scheduled</p>
          <p className="text-xs text-blue-600">
            Click simulate to run the fight
          </p>
        </div>
      )}
    </div>
  )
}

export default MatchCard 