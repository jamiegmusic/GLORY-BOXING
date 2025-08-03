import React, { useState } from 'react'
import { Fighter } from '../../types/game'
import { LegacyUnlock } from '../../types/dreamworld'
import DreamworldTrigger from './DreamworldTrigger'
import { checkFightForDreamworld, applyLegacyUnlockEffects } from '../../lib/dreamworld/dreamworldIntegration'

/**
 * Example Integration Component
 * Shows how to integrate Dreamworld with your existing fight system
 */

interface FightResult {
  winner: Fighter
  loser: Fighter
  isKnockout: boolean
  injurySeverity?: number
  roundsCompleted: number
}

const ExampleFightIntegration: React.FC = () => {
  const [dreamworldTrigger, setDreamworldTrigger] = useState<{
    type: 'knockout' | 'breakdown' | 'injury'
    fighterName?: string
  } | null>(null)
  
  const [gameState, setGameState] = useState({
    playerStats: {
      charisma: 50,
      negotiation: 60,
      experience: 100
    },
    inventory: [],
    passiveIncome: 0,
    legacyCollection: []
  })

  // Example fight result handler
  const handleFightResult = (result: FightResult) => {
    console.log('Fight completed:', result)

    // Check if dreamworld should trigger
    const dreamTrigger = checkFightForDreamworld(
      result.winner,
      result.loser,
      result.isKnockout,
      result.injurySeverity
    )

    if (dreamTrigger) {
      // Trigger dreamworld
      setDreamworldTrigger({
        type: dreamTrigger.type,
        fighterName: dreamTrigger.entityName
      })
    }

    // Continue with normal fight result processing...
  }

  // Handle dreamworld completion
  const handleDreamworldComplete = (legacyUnlocks: LegacyUnlock[]) => {
    console.log('Dreamworld completed with unlocks:', legacyUnlocks)

    // Apply each legacy unlock to the game state
    let updatedState = { ...gameState }
    
    legacyUnlocks.forEach(unlock => {
      updatedState = applyLegacyUnlockEffects(unlock, updatedState)
      
      // Show notification to player
      showUnlockNotification(unlock)
    })

    setGameState(updatedState)
    setDreamworldTrigger(null)
  }

  const showUnlockNotification = (unlock: LegacyUnlock) => {
    // In a real implementation, show a toast or modal
    console.log(`🎁 Legacy Unlock: ${unlock.dream_item} (${unlock.rarity})`)
  }

  // Example manager stress handler
  const handleManagerStress = (stressLevel: number) => {
    if (stressLevel >= 90) {
      setDreamworldTrigger({
        type: 'breakdown'
      })
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dreamworld Integration Example</h2>
      
      {/* Game State Display */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Current Game State:</h3>
        <pre className="text-sm">{JSON.stringify(gameState, null, 2)}</pre>
      </div>

      {/* Example Triggers */}
      <div className="space-y-4">
        <button
          onClick={() => handleFightResult({
            winner: { id: '1', name: 'Winner' } as Fighter,
            loser: { id: '2', name: 'Demo Fighter' } as Fighter,
            isKnockout: true,
            roundsCompleted: 5
          })}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Simulate Knockout
        </button>

        <button
          onClick={() => handleManagerStress(95)}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Simulate Manager Breakdown
        </button>
      </div>

      {/* Dreamworld Trigger Component */}
      {dreamworldTrigger && (
        <DreamworldTrigger
          playerId="example-player"
          triggerType={dreamworldTrigger.type}
          fighterName={dreamworldTrigger.fighterName}
          onComplete={handleDreamworldComplete}
        />
      )}
    </div>
  )
}

export default ExampleFightIntegration

/**
 * Example Usage in Your Main Game Component:
 * 
 * import ExampleFightIntegration from '@/components/Dreamworld/ExampleIntegration'
 * 
 * // In your game component
 * <ExampleFightIntegration />
 * 
 * 
 * Or integrate directly into your existing fight handler:
 * 
 * import { checkFightForDreamworld } from '@/lib/dreamworld/dreamworldIntegration'
 * import DreamworldTrigger from '@/components/Dreamworld/DreamworldTrigger'
 * 
 * // In your fight result handler
 * const dreamTrigger = checkFightForDreamworld(winner, loser, isKnockout, injurySeverity)
 * if (dreamTrigger) {
 *   setShowDreamworld(dreamTrigger)
 * }
 * 
 * // In your render
 * {showDreamworld && (
 *   <DreamworldTrigger
 *     playerId={currentPlayer.id}
 *     triggerType={showDreamworld.type}
 *     fighterName={showDreamworld.entityName}
 *     onComplete={handleDreamworldComplete}
 *   />
 * )}
 */