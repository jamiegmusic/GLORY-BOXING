'use client'

import React from 'react'
import { Book, Map, Trophy, Clock, Sparkles } from 'lucide-react'
import { useDreamworldProgressStore } from '@/stores/dreamworldProgressStore'

export const DreamworldProgressHUD: React.FC = () => {
  const {
    currentEra,
    getCurrentQuestProgress,
    getCurrentChapterProgress,
    getCurrentEraProgress,
    getOverallProgress
  } = useDreamworldProgressStore()

  const questProgress = getCurrentQuestProgress()
  const chapterProgress = getCurrentChapterProgress()
  const eraProgress = getCurrentEraProgress()
  const overallProgress = getOverallProgress()

  const getEraColor = (era: string) => {
    switch (era) {
      case '1920s': return 'from-amber-600 to-yellow-600'
      case '1930s': return 'from-blue-600 to-cyan-600'
      case '1940s': return 'from-red-600 to-pink-600'
      case '1950s': return 'from-purple-600 to-indigo-600'
      default: return 'from-gray-600 to-gray-700'
    }
  }

  return (
    <div className="bg-gradient-to-r from-sepia-900/90 to-amber-900/90 backdrop-blur-md 
                    border-b-4 border-sepia-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Top Row - Era and Overall Progress */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${getEraColor(currentEra)} 
                            text-white font-bold text-lg shadow-lg`}>
              {currentEra}
            </div>
            
            <div className="text-sepia-100">
              <div className="text-sm opacity-80">Era Progress</div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-sepia-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getEraColor(currentEra)} transition-all duration-500`}
                    style={{ width: `${eraProgress?.completionPercentage || 0}%` }}
                  />
                </div>
                <span className="text-xs font-medium">
                  {Math.round(eraProgress?.completionPercentage || 0)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-sepia-200 opacity-80">Overall Progress</div>
              <div className="text-2xl font-bold text-white">
                {Math.round(overallProgress)}%
              </div>
            </div>
            
            <div className="relative w-16 h-16">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-sepia-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - overallProgress / 100)}`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="progressGradient">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
              <Trophy className="absolute inset-0 m-auto w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Bottom Row - Quest and Chapter Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Current Quest */}
          {questProgress && (
            <div className="bg-sepia-800/50 rounded-lg px-4 py-2 border border-sepia-600">
              <div className="flex items-start gap-3">
                <Map className="w-5 h-5 text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs text-sepia-300 uppercase tracking-wider">Current Quest</div>
                  <div className="text-white font-medium">{questProgress.questName}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs text-sepia-300">
                      Phase {questProgress.currentPhase}/{questProgress.totalPhases}
                    </div>
                    <div className="flex-1 h-1 bg-sepia-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ 
                          width: `${(questProgress.currentPhase / questProgress.totalPhases) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  {questProgress.cluesFound > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-sepia-300">
                        {questProgress.cluesFound}/{questProgress.totalClues} clues found
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Current Chapter */}
          {chapterProgress && (
            <div className="bg-sepia-800/50 rounded-lg px-4 py-2 border border-sepia-600">
              <div className="flex items-start gap-3">
                <Book className="w-5 h-5 text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs text-sepia-300 uppercase tracking-wider">Chapter</div>
                  <div className="text-white font-medium">{chapterProgress.chapterName}</div>
                  <div className="text-xs text-sepia-300 mt-1">
                    Quest {chapterProgress.currentQuest}/{chapterProgress.totalQuests}
                  </div>
                  <div className="h-1 bg-sepia-700 rounded-full overflow-hidden mt-1">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-300"
                      style={{ 
                        width: `${(chapterProgress.questsCompleted.length / chapterProgress.totalQuests) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Era Unlocks */}
          <div className="bg-sepia-800/50 rounded-lg px-4 py-2 border border-sepia-600">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-green-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-sepia-300 uppercase tracking-wider">Era Status</div>
                <div className="flex gap-2 mt-1">
                  {(['1920s', '1930s', '1940s', '1950s'] as const).map((era) => {
                    const eraData = useDreamworldProgressStore.getState().eraProgress[era]
                    return (
                      <div
                        key={era}
                        className={`w-12 h-6 rounded-full border-2 transition-all duration-300 ${
                          eraData.unlocked
                            ? 'bg-gradient-to-r ' + getEraColor(era) + ' border-transparent'
                            : 'bg-sepia-700 border-sepia-600'
                        }`}
                        title={`${era} - ${eraData.unlocked ? 'Unlocked' : 'Locked'}`}
                      >
                        <span className="block text-xs text-center text-white font-bold leading-5">
                          {era.slice(2, 4)}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div className="text-xs text-sepia-300 mt-1">
                  {eraProgress?.chaptersCompleted.length || 0}/{eraProgress?.totalChapters || 0} chapters complete
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}