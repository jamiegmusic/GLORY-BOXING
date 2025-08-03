'use client'

import React, { useEffect } from 'react'
import { Music, Sparkles, Book, Users, Star } from 'lucide-react'
import { useLegacyUnlocks } from '@/hooks/useDreamworldQuest'

interface LegacyUnlocksDisplayProps {
  playerId: string
  onUnlockApplied?: (unlock: any) => void
}

const LegacyUnlocksDisplay: React.FC<LegacyUnlocksDisplayProps> = ({ 
  playerId, 
  onUnlockApplied 
}) => {
  const { unlocks, isLoading, applyUnlock } = useLegacyUnlocks(playerId)

  const getUnlockIcon = (type: string) => {
    switch (type) {
      case 'item': return Music
      case 'skill': return Sparkles
      case 'knowledge': return Book
      case 'connection': return Users
      case 'bonus': return Star
      default: return Sparkles
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-orange-400 bg-orange-50'
      case 'epic': return 'border-purple-400 bg-purple-50'
      case 'rare': return 'border-blue-400 bg-blue-50'
      case 'uncommon': return 'border-green-400 bg-green-50'
      default: return 'border-gray-400 bg-gray-50'
    }
  }

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-orange-700'
      case 'epic': return 'text-purple-700'
      case 'rare': return 'text-blue-700'
      case 'uncommon': return 'text-green-700'
      default: return 'text-gray-700'
    }
  }

  const handleApplyUnlock = async (unlock: any) => {
    await applyUnlock(unlock.id)
    onUnlockApplied?.(unlock)
  }

  const appliedUnlocks = unlocks.filter(u => u.applied_to_main)
  const pendingUnlocks = unlocks.filter(u => !u.applied_to_main)

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Pending Unlocks */}
      {pendingUnlocks.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            New Legacy Unlocks from Dreamworld
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingUnlocks.map((unlock) => {
              const Icon = getUnlockIcon(unlock.unlock_type)
              const data = unlock.unlock_data as any
              
              return (
                <div
                  key={unlock.id}
                  className={`relative overflow-hidden rounded-xl border-2 p-4 
                             ${getRarityColor(data.rarity)} 
                             transform hover:scale-[1.02] transition-all duration-200`}
                >
                  {/* Shimmer effect for legendary items */}
                  {data.rarity === 'legendary' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                    animate-shimmer pointer-events-none" />
                  )}
                  
                  <div className="relative">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-white/80`}>
                        <Icon className={`w-6 h-6 ${getRarityTextColor(data.rarity)}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{unlock.unlock_name}</h4>
                          <span className={`text-xs font-medium uppercase ${getRarityTextColor(data.rarity)}`}>
                            {data.rarity}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">
                          {data.description}
                        </p>
                        
                        {/* Effects */}
                        <div className="text-xs space-y-1 mb-3">
                          {Object.entries(data.effects || {}).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-1">
                              <span className="text-gray-600">•</span>
                              <span className="text-gray-700">
                                {formatEffect(key, value)}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Source */}
                        {data.from_quest && (
                          <div className="text-xs text-gray-500 mb-3">
                            From: {formatQuestName(data.from_quest)}
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleApplyUnlock(unlock)}
                          className="w-full py-2 bg-white/80 hover:bg-white text-gray-900 
                                     font-medium rounded-lg transition-colors duration-200
                                     border border-gray-300 hover:border-gray-400"
                        >
                          Apply to Character
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {/* Applied Unlocks */}
      {appliedUnlocks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Active Legacy Effects
          </h3>
          
          <div className="space-y-2">
            {appliedUnlocks.map((unlock) => {
              const Icon = getUnlockIcon(unlock.unlock_type)
              const data = unlock.unlock_data as any
              
              return (
                <div
                  key={unlock.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <Icon className={`w-5 h-5 ${getRarityTextColor(data.rarity)}`} />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{unlock.unlock_name}</span>
                      <span className={`text-xs ${getRarityTextColor(data.rarity)}`}>
                        {data.rarity}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600 mt-0.5">
                      {Object.entries(data.effects || {}).map(([key, value], idx) => (
                        <span key={key}>
                          {idx > 0 && ' • '}
                          {formatEffect(key, value)}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-xs text-green-600 font-medium">
                    Active
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      
      {unlocks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No legacy unlocks yet</p>
          <p className="text-sm mt-1">Complete dreamworld quests to earn permanent rewards!</p>
        </div>
      )}
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}

// Helper functions
function formatEffect(key: string, value: any): string {
  if (typeof value === 'boolean') {
    return value ? key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''
  }
  
  if (typeof value === 'number') {
    const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    return `${formattedKey} +${value}`
  }
  
  return `${key}: ${value}`
}

function formatQuestName(questId: string): string {
  return questId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default LegacyUnlocksDisplay