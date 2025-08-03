import { renderHook, act, waitFor } from '@testing-library/react'
import { useDreamworldQuest } from '../useDreamworldQuest'
import { useDreamworldStore } from '@/stores/dreamworldStore'

// Mock fetch
global.fetch = jest.fn()

// Mock the dreamworld store
jest.mock('@/stores/dreamworldStore', () => ({
  useDreamworldStore: jest.fn()
}))

describe('useDreamworldQuest', () => {
  const mockPlayerId = 'test-player-id'
  const mockQuestId = 'jazz_singers_secret'
  
  const mockStore = {
    lucidMeter: 75,
    updateLucidMeter: jest.fn(),
    addDreamEvent: jest.fn()
  }

  const mockQuestState = {
    quest_id: mockQuestId,
    player_id: mockPlayerId,
    current_phase: 'investigation',
    phases_completed: ['intro'],
    clues_discovered: ['sheet_music'],
    lucid_used: 20,
    logic_used: 10,
    started_at: new Date().toISOString(),
    completed_at: null,
    reward_claimed: false,
    reward_id: null
  }

  const mockPhaseData = {
    id: 'investigation',
    name: 'The Investigation',
    description: 'Search for clues in the speakeasy',
    dream_type: 'vision',
    choices: [
      {
        id: 'use_lucid',
        text: 'Use lucid power to reveal hidden clues',
        type: 'lucid',
        cost: 15,
        clues: ['hidden_note'],
        next_phase: 'revelation'
      },
      {
        id: 'investigate_normally',
        text: 'Search methodically',
        type: 'logic',
        cost: 0,
        clues: [],
        next_phase: 'revelation'
      }
    ]
  }

  const mockReward = {
    id: 'reward-1',
    player_id: mockPlayerId,
    unlock_type: 'item',
    unlock_name: 'Temporal Jazz Manuscript',
    unlock_data: {
      description: 'A mysterious sheet music that transcends time',
      effects: { charisma: 10, creativity: 15 },
      rarity: 'legendary'
    },
    dreamworld_source: mockQuestId,
    applied_to_main: false,
    created_at: new Date().toISOString()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useDreamworldStore as unknown as jest.Mock).mockReturnValue(mockStore)
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: null })
    })
  })

  describe('Initialization', () => {
    test('fetches quest state on mount', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          quest_state: mockQuestState,
          current_phase: mockPhaseData,
          reward: null
        })
      })

      const { result } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.questState).toEqual(mockQuestState)
      expect(result.current.currentPhase).toEqual(mockPhaseData)
      expect(fetch).toHaveBeenCalledWith(
        `/api/dreamworld/quest/state/${mockPlayerId}/${mockQuestId}`
      )
    })

    test('handles fetch errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.error).toBe('Failed to fetch quest state')
      expect(result.current.questState).toBeNull()
      
      consoleError.mockRestore()
    })

    test('handles missing quest state', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          quest_state: null,
          current_phase: null,
          reward: null
        })
      })

      const { result } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.questState).toBeNull()
      expect(result.current.currentPhase).toBeNull()
    })
  })

  describe('Starting Quest', () => {
    test('successfully starts a new quest', async () => {
      const newQuestState = { ...mockQuestState, current_phase: 'intro' }
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          quest_state: newQuestState,
          current_phase: { ...mockPhaseData, id: 'intro' }
        })
      })

      const { result } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await act(async () => {
        await result.current.startQuest()
      })

      expect(fetch).toHaveBeenCalledWith('/api/dreamworld/quest/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: mockPlayerId,
          quest_id: mockQuestId
        })
      })

      expect(result.current.questState).toEqual(newQuestState)
      expect(mockStore.addDreamEvent).toHaveBeenCalledWith({
        dream_type: 'inspiration',
        content: expect.stringContaining('new quest begins'),
        impact_score: 50,
        actionable_insight: 'Pay attention to the clues in your dreams',
        career_path: 'dreamer'
      })
    })

    test('handles start quest errors', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request'
      })

      const { result } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await act(async () => {
        await result.current.startQuest()
      })

      expect(result.current.error).toBe('Failed to start quest')
      
      consoleError.mockRestore()
    })
  })

  describe('Making Choices', () => {
    test('successfully makes a lucid choice', async () => {
      const updatedQuestState = {
        ...mockQuestState,
        current_phase: 'revelation',
        phases_completed: ['intro', 'investigation'],
        clues_discovered: ['sheet_music', 'hidden_note'],
        lucid_used: 35
      }

      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            quest_state: mockQuestState,
            current_phase: mockPhaseData,
            reward: null
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            quest_state: updatedQuestState,
            current_phase: { ...mockPhaseData, id: 'revelation' },
            clues_found: ['hidden_note']
          })
        })

      const { result } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await waitFor(() => {
        expect(result.current.questState).toBeTruthy()
      })

      await act(async () => {
        await result.current.makeChoice('use_lucid')
      })

      expect(mockStore.updateLucidMeter).toHaveBeenCalledWith(60) // 75 - 15
      expect(fetch).toHaveBeenCalledWith('/api/dreamworld/quest/choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player_id: mockPlayerId,
          quest_id: mockQuestId,
          choice_id: 'use_lucid'
        })
      })
      expect(result.current.questState).toEqual(updatedQuestState)
    })

    test('prevents choice when lucid meter is insufficient', async () => {
      mockStore.lucidMeter = 10 // Less than required 15

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          quest_state: mockQuestState,
          current_phase: mockPhaseData,
          reward: null
        })
      })

      const { result } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await waitFor(() => {
        expect(result.current.questState).toBeTruthy()
      })

      await act(async () => {
        await result.current.makeChoice('use_lucid')
      })

      expect(result.current.error).toBe('Insufficient lucid power')
      expect(mockStore.updateLucidMeter).not.toHaveBeenCalled()
      expect(fetch).toHaveBeenCalledTimes(1) // Only initial fetch
    })

    test('handles completed quest reward', async () => {
      const completedQuestState = {
        ...mockQuestState,
        current_phase: 'completed',
        phases_completed: ['intro', 'investigation', 'revelation'],
        completed_at: new Date().toISOString(),
        reward_id: 'reward-1'
      }

      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            quest_state: mockQuestState,
            current_phase: mockPhaseData,
            reward: null
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            quest_state: completedQuestState,
            current_phase: null,
            reward: mockReward
          })
        })

      const { result } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await waitFor(() => {
        expect(result.current.questState).toBeTruthy()
      })

      await act(async () => {
        await result.current.makeChoice('investigate_normally')
      })

      expect(result.current.questState?.current_phase).toBe('completed')
      expect(result.current.reward).toEqual(mockReward)
      expect(mockStore.addDreamEvent).toHaveBeenCalledWith({
        dream_type: 'vision',
        content: expect.stringContaining('Temporal Jazz Manuscript'),
        impact_score: 90,
        actionable_insight: expect.stringContaining('legacy'),
        career_path: 'dreamer'
      })
    })

    test('handles invalid choice gracefully', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          quest_state: mockQuestState,
          current_phase: mockPhaseData,
          reward: null
        })
      })

      const { result } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await waitFor(() => {
        expect(result.current.questState).toBeTruthy()
      })

      await act(async () => {
        await result.current.makeChoice('invalid_choice')
      })

      expect(result.current.error).toBe('Invalid choice')
    })
  })

  describe('Applying Rewards', () => {
    test('successfully applies quest reward', async () => {
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            quest_state: { ...mockQuestState, current_phase: 'completed', reward_id: 'reward-1' },
            current_phase: null,
            reward: mockReward
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ applied: true })
        })

      const { result } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await waitFor(() => {
        expect(result.current.reward).toBeTruthy()
      })

      await act(async () => {
        await result.current.applyReward()
      })

      expect(fetch).toHaveBeenCalledWith(
        `/api/dreamworld/quest/apply-reward/${mockPlayerId}/${mockQuestId}`,
        { method: 'POST' }
      )
      expect(result.current.questState?.reward_claimed).toBe(true)
      expect(result.current.reward?.applied_to_main).toBe(true)
    })

    test('prevents applying reward when not completed', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          quest_state: mockQuestState, // Not completed
          current_phase: mockPhaseData,
          reward: null
        })
      })

      const { result } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await waitFor(() => {
        expect(result.current.questState).toBeTruthy()
      })

      await act(async () => {
        await result.current.applyReward()
      })

      expect(result.current.error).toBe('No reward to apply')
    })
  })

  describe('Helper Functions', () => {
    test('canAffordChoice correctly checks lucid cost', async () => {
      mockStore.lucidMeter = 20

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          quest_state: mockQuestState,
          current_phase: mockPhaseData,
          reward: null
        })
      })

      const { result } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await waitFor(() => {
        expect(result.current.currentPhase).toBeTruthy()
      })

      const lucidChoice = mockPhaseData.choices[0] // Costs 15
      const logicChoice = mockPhaseData.choices[1] // Costs 0

      expect(result.current.canAffordChoice(lucidChoice)).toBe(true) // 20 >= 15
      expect(result.current.canAffordChoice(logicChoice)).toBe(true) // Always true for 0 cost

      // Test with insufficient lucid
      mockStore.lucidMeter = 10
      const { result: result2 } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await waitFor(() => {
        expect(result2.current.currentPhase).toBeTruthy()
      })

      expect(result2.current.canAffordChoice(lucidChoice)).toBe(false) // 10 < 15
    })
  })

  describe('Edge Cases', () => {
    test('handles rapid choice making', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          quest_state: mockQuestState,
          current_phase: mockPhaseData,
          reward: null
        })
      })

      const { result } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await waitFor(() => {
        expect(result.current.questState).toBeTruthy()
      })

      // Make multiple choices rapidly
      const promises = []
      for (let i = 0; i < 5; i++) {
        promises.push(result.current.makeChoice('investigate_normally'))
      }

      await act(async () => {
        await Promise.all(promises)
      })

      // Should handle concurrent calls gracefully
      expect(result.current.error).toBeFalsy()
    })

    test('handles missing player or quest ID', () => {
      const { result: result1 } = renderHook(() => 
        useDreamworldQuest('', mockQuestId)
      )
      expect(result1.current.questState).toBeNull()

      const { result: result2 } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, '')
      )
      expect(result2.current.questState).toBeNull()
    })

    test('recovers from network errors', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      
      // First call fails
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const { result, rerender } = renderHook(() => 
        useDreamworldQuest(mockPlayerId, mockQuestId)
      )

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to fetch quest state')
      })

      // Subsequent call succeeds
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          quest_state: mockQuestState,
          current_phase: mockPhaseData,
          reward: null
        })
      })

      rerender()

      await waitFor(() => {
        expect(result.current.questState).toEqual(mockQuestState)
        expect(result.current.error).toBeNull()
      })
      
      consoleError.mockRestore()
    })
  })
})