'use client'

import React from 'react'
import { Music, Brain, Eye, Sparkles } from 'lucide-react'
import DreamEventModal from './DreamEventModal'

interface QuestChoice {
  choice_id: string
  choice_text: string
  choice_type: 'lucid' | 'logic'
  lucid_cost: number
  consequence?: string
}

interface QuestPhase {
  phase_id: string
  phase_name: string
  description: string
  choices: QuestChoice[]
}

interface QuestModalProps {
  phase: QuestPhase
  lucidMeter: number
  onChoice: (choiceId: string) => void
  onClose?: () => void
  isLoading?: boolean
  error?: string | null
}

const QuestModal: React.FC<QuestModalProps> = ({
  phase,
  lucidMeter,
  onChoice,
  onClose,
  isLoading = false,
  error = null
}) => {
  const getDreamType = (phaseId: string): 'prophecy' | 'warning' | 'inspiration' | 'nightmare' | 'vision' => {
    switch (phaseId) {
      case 'investigation': return 'inspiration'
      case 'confrontation': return 'warning'
      case 'revelation': return 'vision'
      default: return 'prophecy'
    }
  }

  const getImpactScore = (phaseId: string): number => {
    switch (phaseId) {
      case 'investigation': return 70
      case 'confrontation': return 85
      case 'revelation': return 95
      default: return 75
    }
  }

  const formatChoices = (choices: QuestChoice[]) => {
    return choices.map(choice => ({
      text: choice.choice_text,
      impact: choice.choice_type === 'lucid' 
        ? `Uses ${choice.lucid_cost} lucid power` 
        : 'No lucid cost',
      consequence: choice.consequence
    }))
  }

  return (
    <>
      {/* Main Quest Modal */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
           onClick={onClose} />
      
      <div className="fixed inset-0 flex items-center justify-center z-40 p-4">
        <div className="relative bg-gradient-to-br from-sepia-50 via-amber-50 to-sepia-100 
                        rounded-3xl shadow-2xl max-w-3xl w-full 
                        border-4 border-sepia-300/50 animate-slide-in">
          
          {/* Quest Header */}
          <div className="bg-gradient-to-r from-sepia-700 to-amber-800 
                          text-white p-6 rounded-t-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-8 h-8" />
              <h2 className="text-2xl font-bold">The Jazz Singer's Secret</h2>
            </div>
            <h3 className="text-xl text-sepia-100">{phase.phase_name}</h3>
          </div>

          <div className="p-8 space-y-6">
            {/* Phase Description */}
            <div className="bg-sepia-100/50 rounded-2xl p-6 border-2 border-sepia-200">
              <p className="text-lg text-sepia-800 leading-relaxed font-serif">
                {phase.description}
              </p>
            </div>

            {/* Lucid Meter Display */}
            <div className="flex items-center justify-center gap-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <div className="flex items-center gap-2">
                <span className="text-sepia-700 font-medium">Lucid Power:</span>
                <div className="w-48 h-4 bg-sepia-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-500"
                    style={{ width: `${lucidMeter}%` }}
                  />
                </div>
                <span className="text-sepia-800 font-bold">{lucidMeter}/100</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 text-red-800">
                {error}
              </div>
            )}

            {/* Choice Buttons */}
            <div className="space-y-3">
              <h4 className="text-center text-xl font-bold text-sepia-700 mb-4">
                Choose Your Approach
              </h4>
              
              {phase.choices.map((choice) => {
                const canAfford = choice.choice_type === 'logic' || lucidMeter >= choice.lucid_cost
                
                return (
                  <button
                    key={choice.choice_id}
                    onClick={() => onChoice(choice.choice_id)}
                    disabled={!canAfford || isLoading}
                    className={`w-full p-5 rounded-2xl text-left transition-all duration-200
                                ${canAfford 
                                  ? 'bg-gradient-to-r from-sepia-200 to-amber-200 hover:from-sepia-300 hover:to-amber-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg' 
                                  : 'bg-gray-200 opacity-50 cursor-not-allowed'}
                                border-2 ${choice.choice_type === 'lucid' ? 'border-purple-300' : 'border-sepia-300'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {choice.choice_type === 'lucid' ? (
                          <Sparkles className="w-6 h-6 text-purple-600" />
                        ) : (
                          <Eye className="w-6 h-6 text-sepia-600" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-lg text-sepia-900">
                            {choice.choice_text}
                          </span>
                          {choice.choice_type === 'lucid' && (
                            <span className={`text-sm font-medium px-3 py-1 rounded-full
                                            ${canAfford ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                              -{choice.lucid_cost} Lucid
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-sepia-600">
                          {choice.choice_type === 'lucid' 
                            ? 'Use dreamworld powers for direct results'
                            : 'Apply wit and observation'}
                        </div>
                        
                        {!canAfford && choice.choice_type === 'lucid' && (
                          <div className="text-red-600 text-sm mt-2">
                            Requires {choice.lucid_cost} lucid power (you have {lucidMeter})
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center text-sepia-600">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sepia-600"></div>
                <p className="mt-2">Processing your choice...</p>
              </div>
            )}
          </div>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full 
                         bg-white/80 hover:bg-white transition-colors"
            >
              <span className="sr-only">Close</span>
              <svg className="w-6 h-6 text-sepia-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </>
  )
}

export default QuestModal