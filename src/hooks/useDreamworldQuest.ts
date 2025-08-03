import { useState, useCallback, useEffect } from 'react'
import { useDreamworldStore } from '@/stores/dreamworldStore'

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
  clue?: string
}

interface QuestState {
  quest_id: string
  player_id: string
  current_phase: string
  phases_completed: string[]
  clues_discovered: string[]
  lucid_used: number
  logic_used: number
  started_at: string
  completed_at?: string
  reward_claimed: boolean
  reward_id?: string
}

interface LegacyUnlock {
  id: string
  unlock_type: string
  name: string
  description: string
  rarity: string
  effects: Record<string, any>
}

interface UseQuestReturn {
  questState: QuestState | null
  currentPhase: QuestPhase | null
  reward: LegacyUnlock | null
  isLoading: boolean
  error: string | null
  startQuest: () => Promise<void>
  makeChoice: (choiceId: string) => Promise<void>
  applyReward: () => Promise<void>
  canAffordChoice: (choice: QuestChoice) => boolean
}

export const useDreamworldQuest = (playerId: string, questId: string = 'jazz_singers_secret'): UseQuestReturn => {
  const [questState, setQuestState] = useState<QuestState | null>(null)
  const [currentPhase, setCurrentPhase] = useState<QuestPhase | null>(null)
  const [reward, setReward] = useState<LegacyUnlock | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { lucidMeter, updateLucidMeter, addDreamEvent } = useDreamworldStore()

  // Fetch quest state
  const fetchQuestState = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/dreamworld/quest/state/${playerId}/${questId}`)
      const data = await response.json()
      
      if (data.exists) {
        setQuestState(data.quest_state)
        setCurrentPhase(data.current_phase)
        setReward(data.reward)
      }
    } catch (err) {
      setError('Failed to fetch quest state')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [playerId, questId])

  // Start quest
  const startQuest = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/dreamworld/quest/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: playerId, quest_id: questId })
      })
      
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        return
      }
      
      setQuestState(data.quest_state)
      setCurrentPhase(data.current_phase)
      
      // Add dream event for quest start
      await addDreamEvent({
        dream_type: 'inspiration',
        content: 'A mysterious melody draws you to Billie Holiday...',
        impact_score: 80,
        actionable_insight: 'Follow the music to uncover hidden secrets',
        career_path: 'quest'
      })
      
    } catch (err) {
      setError('Failed to start quest')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [playerId, questId, addDreamEvent])

  // Make a choice
  const makeChoice = useCallback(async (choiceId: string) => {
    if (!questState || !currentPhase) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      const choice = currentPhase.choices.find(c => c.choice_id === choiceId)
      if (!choice) return
      
      // Check if player can afford lucid cost
      if (choice.choice_type === 'lucid' && choice.lucid_cost > lucidMeter) {
        setError('Not enough lucid power!')
        return
      }
      
      const response = await fetch('/api/dreamworld/quest/choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: playerId,
          quest_id: questId,
          phase_id: currentPhase.phase_id,
          choice_id: choiceId
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to make choice')
      }
      
      const data = await response.json()
      
      // Update local state
      setQuestState(data.quest_state)
      
      if (data.quest_complete) {
        // Quest completed!
        setCurrentPhase(null)
        setReward(data.reward)
        
        // Add completion event
        await addDreamEvent({
          dream_type: 'vision',
          content: `You've uncovered the Jazz Singer's Secret! ${data.reward.description}`,
          impact_score: 100,
          actionable_insight: 'Return to reality to claim your reward',
          career_path: 'quest'
        })
      } else {
        // Move to next phase
        setCurrentPhase(data.next_phase)
        
        // Update lucid meter if it was a lucid choice
        if (choice.choice_type === 'lucid') {
          await updateLucidMeter(-choice.lucid_cost)
        }
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to make choice')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [questState, currentPhase, playerId, questId, lucidMeter, updateLucidMeter, addDreamEvent])

  // Apply reward to main game
  const applyReward = useCallback(async () => {
    if (!questState || !reward) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/dreamworld/quest/apply-reward/${playerId}/${questId}`, {
        method: 'POST'
      })
      
      if (!response.ok) {
        throw new Error('Failed to apply reward')
      }
      
      const data = await response.json()
      
      // Update quest state
      setQuestState(prev => prev ? { ...prev, reward_claimed: true } : null)
      
      // Success notification
      await addDreamEvent({
        dream_type: 'inspiration',
        content: `The ${reward.name} has been integrated into your reality!`,
        impact_score: 50,
        actionable_insight: 'Check your main game inventory for new abilities',
        career_path: 'quest'
      })
      
    } catch (err) {
      setError('Failed to apply reward')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [questState, reward, playerId, questId, addDreamEvent])

  // Check if player can afford a choice
  const canAffordChoice = useCallback((choice: QuestChoice): boolean => {
    if (choice.choice_type === 'logic') return true
    return lucidMeter >= choice.lucid_cost
  }, [lucidMeter])

  // Initial fetch
  useEffect(() => {
    if (playerId) {
      fetchQuestState()
    }
  }, [playerId, fetchQuestState])

  return {
    questState,
    currentPhase,
    reward,
    isLoading,
    error,
    startQuest,
    makeChoice,
    applyReward,
    canAffordChoice
  }
}

// Hook for managing legacy unlocks in main game
export const useLegacyUnlocks = (playerId: string) => {
  const [unlocks, setUnlocks] = useState<LegacyUnlock[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const fetchUnlocks = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/legacy-unlocks/${playerId}`)
      const data = await response.json()
      setUnlocks(data)
    } catch (err) {
      console.error('Failed to fetch legacy unlocks:', err)
    } finally {
      setIsLoading(false)
    }
  }, [playerId])
  
  const applyUnlock = useCallback(async (unlockId: string) => {
    const unlock = unlocks.find(u => u.id === unlockId)
    if (!unlock) return
    
    // Apply effects based on unlock type
    switch (unlock.unlock_type) {
      case 'item':
        // Add to inventory
        console.log('Adding item to inventory:', unlock)
        break
      case 'skill':
        // Apply skill bonus
        console.log('Applying skill bonus:', unlock.effects)
        break
      case 'knowledge':
        // Unlock knowledge
        console.log('Unlocking knowledge:', unlock)
        break
      case 'connection':
        // Add connection
        console.log('Adding connection:', unlock)
        break
      case 'bonus':
        // Apply passive bonus
        console.log('Applying bonus:', unlock.effects)
        break
    }
  }, [unlocks])
  
  useEffect(() => {
    if (playerId) {
      fetchUnlocks()
    }
  }, [playerId, fetchUnlocks])
  
  return {
    unlocks,
    isLoading,
    applyUnlock,
    refetch: fetchUnlocks
  }
}