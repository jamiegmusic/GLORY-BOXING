import React from 'react'
import { Title } from '../lib/unified-types'
import { Trophy, Crown, Calendar, Shield } from 'lucide-react'

interface TitleCardProps {
  title: Title
  onAssignTitle?: (belt: string, champion: string) => void
  onStripTitle?: (belt: string) => void
}

const TitleCard: React.FC<TitleCardProps> = ({ title, onAssignTitle, onStripTitle }) => {
  const isVacant = !title.champion_name || title.status === 'vacant'

  const getBeltColor = (belt: string) => {
    switch (belt) {
      case 'WBC':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'WBA':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'IBF':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'WBO':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'The Ring':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold">{title.organization}</h3>
        </div>
        
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          isVacant 
            ? 'bg-gray-100 text-gray-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {title.status || 'vacant'}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-600">Current Champion</p>
          <div className="flex items-center space-x-2">
            {!isVacant && <Crown className="w-4 h-4 text-yellow-500" />}
            <p className={`text-lg font-medium ${isVacant ? 'text-gray-500' : 'text-gray-900'}`}>
              {title.champion_name || 'Vacant'}
            </p>
          </div>
        </div>

        {!isVacant && (
          <>
            <div>
              <p className="text-sm text-gray-600">Defenses</p>
              <p className="text-lg font-medium">{title.defenses || 0}</p>
            </div>

            {title.date_won && (
              <div>
                <p className="text-sm text-gray-600">Date Won</p>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-sm">
                    {new Date(title.date_won).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <div>
          <p className="text-sm text-gray-600">Weight Class</p>
          <p className="text-sm font-medium capitalize">{title.weight_class}</p>
        </div>
      </div>

      {!isVacant && onStripTitle && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onStripTitle(title.organization)}
            className="w-full px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Strip Title
          </button>
        </div>
      )}

      {isVacant && onAssignTitle && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              const champion = prompt('Enter champion name:')
              if (champion) {
                onAssignTitle(title.organization, champion)
              }
            }}
            className="w-full px-3 py-2 text-sm text-green-600 border border-green-300 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Assign Champion
          </button>
        </div>
      )}

      <div className={`mt-3 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getBeltColor(title.belt)}`}>
        <Shield className="w-3 h-3 mr-1" />
        {title.belt}
      </div>
    </div>
  )
}

export default TitleCard 