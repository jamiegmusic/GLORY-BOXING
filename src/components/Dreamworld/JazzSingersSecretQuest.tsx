'use client'

import React, { useState, useEffect } from 'react'
import { Music, Trophy, Sparkles, Clock, Brain, ChevronRight } from 'lucide-react'
import { useDreamworldQuest } from '@/hooks/useDreamworldQuest'
import { useDreamworldStore } from '@/stores/dreamworldStore'
import { useDreamworldProgressStore } from '@/stores/dreamworldProgressStore'
import QuestModal from './QuestModal'
import DreamEventModal from './DreamEventModal'

interface JazzSingersSecretQuestProps {
  playerId: string
}

const JazzSingersSecretQuest: React.FC<JazzSingersSecretQuestProps> = ({ playerId }) => {
  const [showQuestModal, setShowQuestModal] = useState(false)
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [showCompletionEvent, setShowCompletionEvent] = useState(false)
  
  const { lucidMeter, updateQuestInfo, completeQuest } = useDreamworldStore()
  const { 
    startQuest: startQuestProgress, 
    updateQuestProgress,
    completeQuest: completeQuestProgress,
    addNotification 
  } = useDreamworldProgressStore()
  
  const {
    questState,
    currentPhase,
    reward,
    isLoading,
    error,
    startQuest,
    makeChoice,
    applyReward,
    canAffordChoice
  } = useDreamworldQuest(playerId, 'jazz_singers_secret')

  // Update store when quest state changes
  useEffect(() => {
    if (questState) {
      updateQuestInfo({
        quest_id: questState.quest_id,
        current_phase: questState.current_phase,
        phases_completed: questState.phases_completed,
        clues_discovered: questState.clues_discovered,
        lucid_used: questState.lucid_used,
        logic_used: questState.logic_used
      })
      
      // Show completion modal when quest is done
      if (questState.current_phase === 'completed' && !questState.reward_claimed) {
        setShowCompletionEvent(true)
      }
    }
  }, [questState, updateQuestInfo])

  const handleStartQuest = async () => {
    await startQuest()
    // Update progress store
    startQuestProgress(
      'jazz_singers_secret', 
      'The Jazz Singer\'s Secret',
      3, // total phases
      3  // total clues
    )
    setShowQuestModal(true)
  }

  const handleChoice = async (choiceId: string) => {
    const previousPhase = questState?.current_phase
    await makeChoice(choiceId)
    
    // Update progress if phase completed
    if (questState && previousPhase && questState.current_phase !== previousPhase) {
      updateQuestProgress(
        'jazz_singers_secret',
        previousPhase,
        1 // assume 1 clue found per phase
      )
    }
    
    // If quest completed, close modal and show reward
    if (questState?.current_phase === 'completed') {
      setShowQuestModal(false)
      setShowRewardModal(true)
      completeQuestProgress('jazz_singers_secret')
      
      // Add completion notification
      addNotification({
        type: 'quest_complete',
        title: 'Quest Complete!',
        message: 'You\'ve uncovered the Jazz Singer\'s Secret!',
        icon: '🎷'
      })
    }
  }

  const handleClaimReward = async () => {
    await applyReward()
    completeQuest('jazz_singers_secret')
    setShowRewardModal(false)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-orange-400 to-red-500'
      case 'rare': return 'from-blue-400 to-purple-500'
      case 'uncommon': return 'from-green-400 to-teal-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  if (!questState || questState.current_phase === 'not_started') {
    // Quest not started - show quest card
    return (
      <div className="bg-gradient-to-br from-sepia-100 to-amber-100 rounded-2xl p-6 
                      border-2 border-sepia-300 shadow-lg hover:shadow-xl 
                      transition-all duration-300 transform hover:scale-[1.02]">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Music className="w-8 h-8 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-sepia-900 mb-2">
              The Jazz Singer's Secret
            </h3>
            <p className="text-sepia-700 mb-4">
              Billie Holiday holds a secret that could change the dreamworld forever. 
              Investigate the mystery using lucid powers or old-school detective work.
            </p>
            
            <div className="flex items-center gap-4 text-sm text-sepia-600 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>3 Phases</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="w-4 h-4" />
                <span>Lucid Optional</span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>Rare Reward</span>
              </div>
            </div>
            
            <button
              onClick={handleStartQuest}
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                         text-white font-bold rounded-xl hover:from-purple-700 
                         hover:to-pink-700 transform hover:scale-105 
                         transition-all duration-200 flex items-center gap-2"
            >
              Start Quest
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (questState.current_phase === 'completed') {
    // Quest completed - show reward
    return (
      <>
        <div className="bg-gradient-to-br from-sepia-100 to-amber-100 rounded-2xl p-6 
                        border-2 border-sepia-300 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="w-8 h-8 text-amber-600" />
            <h3 className="text-xl font-bold text-sepia-900">Quest Complete!</h3>
          </div>
          
          {reward && (
            <div className={`bg-gradient-to-r ${getRarityColor(reward.rarity)} 
                            text-white rounded-xl p-4 mb-4`}>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6" />
                <h4 className="text-lg font-bold">{reward.name}</h4>
              </div>
              <p className="text-sm opacity-90">{reward.description}</p>
            </div>
          )}
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sepia-700">
              <span>Lucid Power Used:</span>
              <span className="font-bold">{questState.lucid_used}</span>
            </div>
            <div className="flex justify-between text-sepia-700">
              <span>Logic Choices:</span>
              <span className="font-bold">{questState.logic_used}</span>
            </div>
            <div className="flex justify-between text-sepia-700">
              <span>Clues Discovered:</span>
              <span className="font-bold">{questState.clues_discovered.length}/3</span>
            </div>
          </div>
          
          {!questState.reward_claimed && (
            <button
              onClick={handleClaimReward}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 
                         text-white font-bold rounded-xl hover:from-green-700 
                         hover:to-teal-700 transform hover:scale-105 
                         transition-all duration-200"
            >
              Apply Reward to Main Game
            </button>
          )}
          
          {questState.reward_claimed && (
            <div className="text-center text-green-600 font-medium">
              ✓ Reward Applied to Main Game
            </div>
          )}
        </div>

        {/* Completion Event Modal */}
        {showCompletionEvent && reward && (
          <DreamEventModal
            dreamType="vision"
            content={`You've uncovered the Jazz Singer's Secret! The ${reward.name} is now yours.`}
            impactScore={100}
            actionableInsight="Return to reality and apply your newfound knowledge to the main game."
            choices={[
              { text: 'Claim your reward', impact: 'legendary discovery' }
            ]}
            onChoice={() => {
              setShowCompletionEvent(false)
              setShowRewardModal(true)
            }}
            isOpen={true}
          />
        )}
      </>
    )
  }

  // Quest in progress
  return (
    <>
      <div className="bg-gradient-to-br from-sepia-100 to-amber-100 rounded-2xl p-6 
                      border-2 border-sepia-300 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-sepia-900">
              The Jazz Singer's Secret
            </h3>
          </div>
          
          <button
            onClick={() => setShowQuestModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg 
                       hover:bg-purple-700 transition-colors"
          >
            Continue Quest
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-sepia-600 mb-1">
            <span>Progress</span>
            <span>{questState.phases_completed.length}/3 Phases</span>
          </div>
          <div className="w-full h-3 bg-sepia-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(questState.phases_completed.length / 3) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Clues Discovered */}
        {questState.clues_discovered.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sepia-800">Clues Discovered:</h4>
            {questState.clues_discovered.map((clue, index) => (
              <div key={index} className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 mt-0.5" />
                <p className="text-sm text-sepia-700">{clue}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quest Modal */}
      {showQuestModal && currentPhase && (
        <QuestModal
          phase={currentPhase}
          lucidMeter={lucidMeter}
          onChoice={handleChoice}
          onClose={() => setShowQuestModal(false)}
          isLoading={isLoading}
          error={error}
        />
      )}

      {/* Reward Modal */}
      {showRewardModal && reward && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
                        flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <Trophy className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Quest Complete!
              </h2>
              <p className="text-gray-600">
                You've successfully uncovered the Jazz Singer's Secret
              </p>
            </div>
            
            <div className={`bg-gradient-to-r ${getRarityColor(reward.rarity)} 
                            text-white rounded-xl p-4 mb-6`}>
              <h3 className="text-lg font-bold mb-2">{reward.name}</h3>
              <p className="text-sm opacity-90">{reward.description}</p>
            </div>
            
            <button
              onClick={handleClaimReward}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 
                         text-white font-bold rounded-xl hover:from-green-700 
                         hover:to-teal-700 transform hover:scale-105 
                         transition-all duration-200"
            >
              Apply to Main Game
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default JazzSingersSecretQuest