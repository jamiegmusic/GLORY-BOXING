import React from 'react'
import { PressQuestion } from '../lib/unified-types'
import { Mic, User, MessageSquare, Calendar, Target } from 'lucide-react'

interface PressCardProps {
  question: PressQuestion
  matchInfo?: {
    fighter_a: string
    fighter_b: string
    venue?: string
    date?: string
  }
  onAnswer?: (questionId: string, answer: string) => void
}

const PressCard: React.FC<PressCardProps> = ({ question, matchInfo, onAnswer }) => {
  const getTargetColor = (target: string) => {
    switch (target.toLowerCase()) {
      case 'winner':
        return 'bg-green-100 text-green-800'
      case 'loser':
        return 'bg-red-100 text-red-800'
      case 'both':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return 'text-red-600'
    if (importance >= 6) return 'text-orange-600'
    return 'text-gray-600'
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'pre-fight':
        return '🥊'
      case 'post-fight':
        return '🏆'
      case 'controversy':
        return '⚠️'
      case 'injury':
        return '🏥'
      default:
        return '📰'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
      <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0">
          <Mic className="w-5 h-5 text-red-500 mt-1" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            {matchInfo ? `${matchInfo.fighter_a} vs ${matchInfo.fighter_b}` : 'Unknown Match'}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <User className="w-4 h-4" />
            <span>{question.journalist}</span>
            <span>•</span>
            <span className="capitalize">{question.category}</span>
            <span>•</span>
            <span>{getCategoryIcon(question.category)}</span>
          </div>
          {matchInfo?.venue && (
            <div className="text-xs text-gray-400 mt-1">
              {matchInfo.venue}
              {matchInfo.date && ` • ${new Date(matchInfo.date).toLocaleDateString()}`}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-gray-700">{question.question}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-gray-500" />
            <span className={`px-2 py-1 rounded ${getTargetColor(question.target)}`}>
              {question.target}
            </span>
          </div>
          <span className={`font-medium ${getImportanceColor(question.importance)}`}>
            <MessageSquare className="inline w-4 h-4 mr-1" />
            Importance: {question.importance}/10
          </span>
        </div>

        {onAnswer && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <textarea
              placeholder="Enter your answer..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  const answer = e.currentTarget.value
                  if (answer.trim()) {
                    onAnswer(question.id, answer.trim())
                    e.currentTarget.value = ''
                  }
                }
              }}
            />
            <div className="mt-2 text-xs text-gray-500">
              Press Ctrl+Enter to submit answer
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PressCard 