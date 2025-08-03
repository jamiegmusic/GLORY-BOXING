import { act, renderHook } from '@testing-library/react'
import useDreamworldStore from '../dreamworldStore'
import { createClient } from '@supabase/supabase-js'

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
          data: null,
          error: null
        }))
      })),
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
      update: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ data: null, error: null })
      })),
      upsert: jest.fn().mockResolvedValue({ data: null, error: null })
    }))
  }))
}))

describe('DreamworldStore', () => {
  let mockSupabase: any

  beforeEach(() => {
    // Reset store state
    const { result } = renderHook(() => useDreamworldStore())
    act(() => {
      result.current.lucidMeter = 50
      result.current.currentEra = '1920s'
      result.current.dreamLevel = 1
      result.current.dreamEvents = []
      result.current.talents = []
      result.current.activeQuests = []
      result.current.playerId = null
      result.current.isLoading = false
      result.current.error = null
    })

    // Get mocked Supabase instance
    mockSupabase = createClient('', '')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('initializeStore', () => {
    test('initializes store with player data from Supabase', async () => {
      const mockPlayerState = {
        current_era: '1930s',
        lucid_meter: 75,
        dream_level: 2
      }
      
      const mockTalents = [
        { id: '1', name: 'Billie Holiday', dream_era: '1920s' }
      ]
      
      const mockEvents = [
        { id: '1', dream_type: 'prophecy', content: 'Test event' }
      ]

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'dreamworld_player_state') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockPlayerState,
                error: null
              })
            })
          }
        }
        if (table === 'dreamworld_talents') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockTalents,
                error: null
              })
            })
          }
        }
        if (table === 'dream_events') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockEvents,
                error: null
              })
            })
          }
        }
      })

      const { result } = renderHook(() => useDreamworldStore())
      
      await act(async () => {
        await result.current.initializeStore('test-player-id')
      })

      expect(result.current.playerId).toBe('test-player-id')
      expect(result.current.currentEra).toBe('1930s')
      expect(result.current.lucidMeter).toBe(75)
      expect(result.current.dreamLevel).toBe(2)
      expect(result.current.talents).toHaveLength(1)
      expect(result.current.dreamEvents).toHaveLength(1)
    })

    test('creates new player state if none exists', async () => {
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'dreamworld_player_state') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: null,
                error: null
              })
            }),
            insert: jest.fn().mockResolvedValue({
              data: null,
              error: null
            })
          }
        }
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: [],
              error: null
            })
          })
        }
      })

      const { result } = renderHook(() => useDreamworldStore())
      
      await act(async () => {
        await result.current.initializeStore('new-player-id')
      })

      expect(mockSupabase.from('dreamworld_player_state').insert).toHaveBeenCalledWith({
        player_id: 'new-player-id',
        current_era: '1920s',
        lucid_meter: 50,
        dream_level: 1,
        wellness_meter: 100,
        reality_glitches: [],
        current_location: 'Dreamworld Entrance',
        return_conditions: {}
      })
    })

    test('handles Supabase errors gracefully', async () => {
      const mockError = new Error('Database connection failed')
      
      mockSupabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockRejectedValue(mockError)
        })
      }))

      const { result } = renderHook(() => useDreamworldStore())
      
      await act(async () => {
        await result.current.initializeStore('test-player-id')
      })

      expect(result.current.error).toBe('Database connection failed')
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('addDreamEvent', () => {
    test('adds dream event to store and Supabase', async () => {
      const mockEvent = {
        dream_type: 'prophecy' as const,
        content: 'A vision of future glory',
        impact_score: 85,
        actionable_insight: 'Train harder',
        career_path: 'boxer'
      }

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          data: { id: 'event-1', ...mockEvent },
          error: null
        })
      })

      const { result } = renderHook(() => useDreamworldStore())
      
      // Initialize first
      act(() => {
        result.current.playerId = 'test-player-id'
      })

      await act(async () => {
        await result.current.addDreamEvent(mockEvent)
      })

      expect(result.current.dreamEvents).toHaveLength(1)
      expect(result.current.dreamEvents[0]).toMatchObject(mockEvent)
      expect(mockSupabase.from('dream_events').insert).toHaveBeenCalledWith({
        ...mockEvent,
        player_id: 'test-player-id'
      })
    })

    test('does not add event without player ID', async () => {
      const { result } = renderHook(() => useDreamworldStore())
      
      await act(async () => {
        await result.current.addDreamEvent({
          dream_type: 'prophecy',
          content: 'Test',
          impact_score: 50,
          actionable_insight: 'Test',
          career_path: 'boxer'
        })
      })

      expect(result.current.dreamEvents).toHaveLength(0)
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })
  })

  describe('updateLucidMeter', () => {
    test('updates lucid meter within valid range', async () => {
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: null })
        })
      })

      const { result } = renderHook(() => useDreamworldStore())
      
      act(() => {
        result.current.playerId = 'test-player-id'
        result.current.lucidMeter = 50
      })

      await act(async () => {
        await result.current.updateLucidMeter(75)
      })

      expect(result.current.lucidMeter).toBe(75)
      expect(mockSupabase.from('dreamworld_player_state').update).toHaveBeenCalledWith({
        lucid_meter: 75
      })
    })

    test('clamps lucid meter to 0-100 range', async () => {
      const { result } = renderHook(() => useDreamworldStore())
      
      act(() => {
        result.current.playerId = 'test-player-id'
      })

      await act(async () => {
        await result.current.updateLucidMeter(150)
      })
      expect(result.current.lucidMeter).toBe(100)

      await act(async () => {
        await result.current.updateLucidMeter(-50)
      })
      expect(result.current.lucidMeter).toBe(0)
    })
  })

  describe('recruitTalent', () => {
    test('recruits talent and creates recruitment event', async () => {
      const mockTalent = {
        id: 'talent-1',
        name: 'Duke Ellington',
        dream_era: '1920s',
        career_path: 'musician'
      }

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'dreamworld_talents') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockTalent,
                error: null
              })
            }),
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({ data: null, error: null })
            })
          }
        }
        if (table === 'dream_events') {
          return {
            insert: jest.fn().mockResolvedValue({ data: null, error: null })
          }
        }
      })

      const { result } = renderHook(() => useDreamworldStore())
      
      act(() => {
        result.current.playerId = 'test-player-id'
      })

      await act(async () => {
        await result.current.recruitTalent('talent-1')
      })

      expect(result.current.talents).toHaveLength(1)
      expect(result.current.talents[0]).toMatchObject(mockTalent)
      expect(result.current.dreamEvents).toHaveLength(1)
      expect(result.current.dreamEvents[0].dream_type).toBe('inspiration')
    })
  })

  describe('progressEra', () => {
    test('progresses to next era and loads new talents', async () => {
      const new1930sTalents = [
        { id: 'talent-2', name: 'Cary Grant', dream_era: '1930s' }
      ]

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'dreamworld_player_state') {
          return {
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({ data: null, error: null })
            })
          }
        }
        if (table === 'dreamworld_talents') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: new1930sTalents,
                error: null
              })
            })
          }
        }
      })

      const { result } = renderHook(() => useDreamworldStore())
      
      act(() => {
        result.current.playerId = 'test-player-id'
        result.current.currentEra = '1920s'
      })

      await act(async () => {
        await result.current.progressEra()
      })

      expect(result.current.currentEra).toBe('1930s')
      expect(result.current.dreamLevel).toBe(2)
      expect(result.current.talents).toHaveLength(1)
      expect(result.current.talents[0].name).toBe('Cary Grant')
    })

    test('does not progress beyond 1950s', async () => {
      const { result } = renderHook(() => useDreamworldStore())
      
      act(() => {
        result.current.playerId = 'test-player-id'
        result.current.currentEra = '1950s'
      })

      await act(async () => {
        await result.current.progressEra()
      })

      expect(result.current.currentEra).toBe('1950s')
    })
  })

  describe('wakeUpFromDream', () => {
    test('calculates legacy items and resets state', async () => {
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: null, error: null })
        })
      })

      const { result } = renderHook(() => useDreamworldStore())
      
      act(() => {
        result.current.playerId = 'test-player-id'
        result.current.currentEra = '1930s'
        result.current.dreamLevel = 3
        result.current.dreamEvents = [
          { dream_type: 'prophecy', impact_score: 90 },
          { dream_type: 'inspiration', impact_score: 85 }
        ] as any
      })

      let wakeUpResult: any
      await act(async () => {
        wakeUpResult = await result.current.wakeUpFromDream()
      })

      expect(wakeUpResult.success).toBe(true)
      expect(wakeUpResult.legacyItems).toHaveLength(2)
      expect(result.current.currentEra).toBe('1920s')
      expect(result.current.lucidMeter).toBe(50)
      expect(result.current.dreamLevel).toBe(1)
    })
  })

  describe('Quest Management', () => {
    test('updates quest info correctly', () => {
      const { result } = renderHook(() => useDreamworldStore())
      
      const questInfo = {
        quest_id: 'jazz_singers_secret',
        current_phase: 'investigation',
        phases_completed: ['intro'],
        clues_discovered: ['sheet_music'],
        lucid_used: 20,
        logic_used: 10
      }

      act(() => {
        result.current.updateQuestInfo(questInfo)
      })

      expect(result.current.activeQuests).toHaveLength(1)
      expect(result.current.activeQuests[0]).toMatchObject(questInfo)
    })

    test('completes quest and removes from active list', () => {
      const { result } = renderHook(() => useDreamworldStore())
      
      act(() => {
        result.current.activeQuests = [
          {
            quest_id: 'quest1',
            current_phase: 'active',
            phases_completed: [],
            clues_discovered: [],
            lucid_used: 0,
            logic_used: 0
          },
          {
            quest_id: 'quest2',
            current_phase: 'active',
            phases_completed: [],
            clues_discovered: [],
            lucid_used: 0,
            logic_used: 0
          }
        ]
      })

      act(() => {
        result.current.completeQuest('quest1')
      })

      expect(result.current.activeQuests).toHaveLength(1)
      expect(result.current.activeQuests[0].quest_id).toBe('quest2')
    })
  })

  describe('Performance', () => {
    test('handles bulk operations efficiently', async () => {
      const startTime = performance.now()
      
      const { result } = renderHook(() => useDreamworldStore())
      
      act(() => {
        result.current.playerId = 'test-player-id'
      })

      // Add multiple events
      const promises = []
      for (let i = 0; i < 100; i++) {
        promises.push(
          result.current.addDreamEvent({
            dream_type: 'prophecy',
            content: `Event ${i}`,
            impact_score: 50,
            actionable_insight: 'Test',
            career_path: 'boxer'
          })
        )
      }

      await act(async () => {
        await Promise.all(promises)
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(executionTime).toBeLessThan(1000) // Should complete within 1 second
      expect(result.current.dreamEvents).toHaveLength(100)
    })
  })
})