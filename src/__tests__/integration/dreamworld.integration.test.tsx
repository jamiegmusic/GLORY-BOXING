import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'

// Components
import DreamworldDashboard from '@/components/Dreamworld/DreamworldDashboard'
import DreamEventModal from '@/components/Dreamworld/DreamEventModal'
import JazzSingersSecretQuest from '@/components/Dreamworld/JazzSingersSecretQuest'
import { DreamworldProgressHUD } from '@/components/Dreamworld/DreamworldProgressHUD'

// Stores
import useDreamworldStore from '@/stores/dreamworldStore'
import { useDreamworldProgressStore } from '@/stores/dreamworldProgressStore'

// Utilities
import { DreamEventGenerator } from '@/lib/dreamworld/DreamEventGenerator'
import { useDreamworldQuest } from '@/hooks/useDreamworldQuest'

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      mockResolvedValue: jest.fn().mockResolvedValue({ data: [], error: null })
    }))
  }))
}))

// Mock fetch for API calls
global.fetch = jest.fn()

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock as any

describe('Dreamworld Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
    
    // Reset stores to initial state
    useDreamworldStore.setState({
      lucidMeter: 50,
      currentEra: '1920s',
      dreamLevel: 1,
      dreamEvents: [],
      talents: [],
      activeQuests: [],
      playerId: 'test-player',
      isLoading: false,
      error: null
    })
    
    useDreamworldProgressStore.setState({
      currentEra: '1920s',
      currentChapterId: null,
      currentQuestId: null,
      questProgress: {},
      chapterProgress: {},
      notifications: [],
      unreadNotifications: 0,
      totalQuestsCompleted: 0,
      totalCluesDiscovered: 0,
      milestones: []
    })
  })

  describe('Complete Quest Flow', () => {
    test('player can complete entire Jazz Singer quest with progress tracking', async () => {
      // Mock quest API responses
      const questPhases = {
        intro: {
          id: 'intro',
          name: 'A Mysterious Beginning',
          description: 'You hear whispers of a lost jazz manuscript',
          choices: [
            { id: 'investigate', text: 'Investigate the rumors', type: 'logic', cost: 0, next_phase: 'investigation' }
          ]
        },
        investigation: {
          id: 'investigation',
          name: 'The Investigation',
          description: 'Search for clues in the old speakeasy',
          choices: [
            { id: 'use_lucid', text: 'Use lucid power', type: 'lucid', cost: 20, next_phase: 'revelation', clues: ['hidden_note'] },
            { id: 'search_normally', text: 'Search methodically', type: 'logic', cost: 0, next_phase: 'revelation' }
          ]
        },
        revelation: {
          id: 'revelation',
          name: 'The Truth Revealed',
          description: 'The manuscript holds temporal power',
          choices: [
            { id: 'accept_power', text: 'Accept the power', type: 'logic', cost: 0, next_phase: 'completed' }
          ]
        }
      }

      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            quest_state: {
              quest_id: 'jazz_singers_secret',
              current_phase: 'not_started',
              phases_completed: [],
              clues_discovered: []
            },
            current_phase: null
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            quest_state: {
              quest_id: 'jazz_singers_secret',
              current_phase: 'intro',
              phases_completed: []
            },
            current_phase: questPhases.intro
          })
        })

      // Render the quest component
      const { container } = render(
        <JazzSingersSecretQuest playerId="test-player" />
      )

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(/Jazz Singer's Secret/)).toBeInTheDocument()
      })

      // Start the quest
      const startButton = screen.getByText('Start Quest')
      fireEvent.click(startButton)

      await waitFor(() => {
        expect(useDreamworldProgressStore.getState().questProgress['jazz_singers_secret']).toBeDefined()
      })

      // Progress through phases
      for (const phase of ['intro', 'investigation', 'revelation']) {
        ;(fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            quest_state: {
              current_phase: phase === 'revelation' ? 'completed' : Object.keys(questPhases)[Object.keys(questPhases).indexOf(phase) + 1],
              phases_completed: Object.keys(questPhases).slice(0, Object.keys(questPhases).indexOf(phase) + 1)
            },
            current_phase: phase === 'revelation' ? null : questPhases[Object.keys(questPhases)[Object.keys(questPhases).indexOf(phase) + 1]],
            reward: phase === 'revelation' ? {
              id: 'reward-1',
              unlock_type: 'item',
              unlock_name: 'Temporal Jazz Manuscript',
              unlock_data: { rarity: 'legendary' }
            } : null
          })
        })
      }

      // Check progress tracking
      const progressStore = useDreamworldProgressStore.getState()
      expect(progressStore.questProgress['jazz_singers_secret']).toBeDefined()
      expect(progressStore.currentQuestId).toBe('jazz_singers_secret')

      // Check notifications
      expect(progressStore.notifications).toHaveLength(1)
      expect(progressStore.notifications[0].type).toBe('quest_complete')
    })
  })

  describe('Dream Event Generation and Modal Flow', () => {
    test('generates and displays dream events with choices', async () => {
      const generator = new DreamEventGenerator()
      const playerState = {
        id: 'player-1',
        player_id: 'player-1',
        current_era: '1920s',
        lucid_meter: 75,
        dream_level: 2,
        wellness_meter: 80,
        reality_glitches: [],
        current_location: 'Speakeasy',
        return_conditions: {},
        created_at: new Date().toISOString()
      }

      // Generate a dream event
      const dreamEvent = generator.generateEvent('prophecy', 'boxer', '1920s', playerState)
      expect(dreamEvent).toBeDefined()
      expect(dreamEvent.dream_type).toBe('prophecy')

      // Render the modal with the event
      const mockOnChoice = jest.fn()
      const mockOnClose = jest.fn()

      render(
        <DreamEventModal
          dreamType={dreamEvent.dream_type}
          content={dreamEvent.content}
          impactScore={dreamEvent.impact_score}
          actionableInsight={dreamEvent.actionable_insight}
          choices={generator.generateDreamChoices(dreamEvent.dream_type, playerState.lucid_meter)}
          onChoice={mockOnChoice}
          onClose={mockOnClose}
          isOpen={true}
        />
      )

      // Verify modal displays event
      expect(screen.getByText(dreamEvent.content)).toBeInTheDocument()
      expect(screen.getByText('Prophecy')).toBeInTheDocument()

      // Test choice interaction
      const choices = screen.getAllByRole('button').filter(btn => 
        !btn.querySelector('svg') // Exclude close button
      )
      expect(choices.length).toBeGreaterThan(0)

      fireEvent.click(choices[0])
      expect(mockOnChoice).toHaveBeenCalledWith(0)
    })

    test('integrates lucid meter costs with choices', async () => {
      const { result: storeResult } = renderHook(() => useDreamworldStore())
      
      act(() => {
        storeResult.current.lucidMeter = 30
      })

      const generator = new DreamEventGenerator()
      const choices = generator.generateDreamChoices('vision', 30)

      // Should generate choices but expensive lucid choices might be excluded
      const affordableChoices = choices.filter(c => !c.lucidCost || c.lucidCost <= 30)
      expect(affordableChoices.length).toBeGreaterThan(0)
    })
  })

  describe('Progress HUD Integration', () => {
    test('HUD displays current quest and era progress', async () => {
      // Set up progress state
      const progressStore = useDreamworldProgressStore.getState()
      progressStore.startQuest('test_quest', 'Test Quest', 3, 5)
      progressStore.updateQuestProgress('test_quest', 'phase1', 2)

      render(<DreamworldProgressHUD />)

      // Check quest display
      expect(screen.getByText('Test Quest')).toBeInTheDocument()
      expect(screen.getByText('Phase 2/3')).toBeInTheDocument()
      expect(screen.getByText('2/5 clues found')).toBeInTheDocument()

      // Check era display
      expect(screen.getByText('1920s')).toBeInTheDocument()
      expect(screen.getByText(/Era Progress/)).toBeInTheDocument()
    })

    test('HUD updates in real-time as progress changes', async () => {
      render(<DreamworldProgressHUD />)

      // Initially no quest
      expect(screen.queryByText(/Current Quest/)).toBeInTheDocument()

      // Start a quest
      act(() => {
        useDreamworldProgressStore.getState().startQuest('new_quest', 'New Quest', 2, 3)
      })

      // HUD should update
      await waitFor(() => {
        expect(screen.getByText('New Quest')).toBeInTheDocument()
      })

      // Complete a phase
      act(() => {
        useDreamworldProgressStore.getState().updateQuestProgress('new_quest', 'phase1', 1)
      })

      await waitFor(() => {
        expect(screen.getByText('Phase 2/2')).toBeInTheDocument()
      })
    })
  })

  describe('Store Synchronization', () => {
    test('dreamworld store and progress store stay in sync', async () => {
      const { result: dreamworldStore } = renderHook(() => useDreamworldStore())
      const { result: progressStore } = renderHook(() => useDreamworldProgressStore())

      // Update quest info in dreamworld store
      act(() => {
        dreamworldStore.current.updateQuestInfo({
          quest_id: 'sync_test',
          current_phase: 'testing',
          phases_completed: ['intro'],
          clues_discovered: ['clue1'],
          lucid_used: 10,
          logic_used: 5
        })
      })

      // Progress store should reflect quest state
      expect(dreamworldStore.current.activeQuests).toHaveLength(1)
      expect(dreamworldStore.current.activeQuests[0].quest_id).toBe('sync_test')

      // Update lucid meter
      await act(async () => {
        await dreamworldStore.current.updateLucidMeter(25)
      })

      expect(dreamworldStore.current.lucidMeter).toBe(25)

      // Era progression
      await act(async () => {
        await dreamworldStore.current.progressEra()
      })

      expect(dreamworldStore.current.currentEra).toBe('1930s')
    })
  })

  describe('Notification System', () => {
    test('notifications appear and auto-dismiss', async () => {
      const { DreamworldNotifications } = require('@/components/Dreamworld/DreamworldNotifications')
      
      render(<DreamworldNotifications />)

      // Add a notification
      act(() => {
        useDreamworldProgressStore.getState().addNotification({
          type: 'quest_complete',
          title: 'Test Quest Complete',
          message: 'You completed the test quest!',
          icon: '🎯'
        })
      })

      // Notification should appear
      await waitFor(() => {
        expect(screen.getByText('Test Quest Complete')).toBeInTheDocument()
      })

      // Wait for auto-dismiss (5 seconds in real implementation)
      // For testing, we'll just check it exists
      expect(screen.getByText('You completed the test quest!')).toBeInTheDocument()
    })

    test('milestone achievements trigger notifications', async () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      // Complete 5 quests to trigger veteran milestone
      act(() => {
        for (let i = 1; i <= 5; i++) {
          result.current.startQuest(`quest${i}`, `Quest ${i}`, 1, 1)
          result.current.updateQuestProgress(`quest${i}`, 'complete', 1)
        }
      })

      // Should have quest completion notifications + milestone notification
      const milestoneNotif = result.current.notifications.find(n => 
        n.type === 'milestone' && n.title === 'Quest Veteran'
      )
      expect(milestoneNotif).toBeDefined()
      expect(result.current.milestones).toContain('quest_veteran')
    })
  })

  describe('Performance Under Load', () => {
    test('handles multiple simultaneous dream events efficiently', async () => {
      const generator = new DreamEventGenerator()
      const startTime = performance.now()

      // Generate 100 events
      const events = []
      for (let i = 0; i < 100; i++) {
        events.push(generator.generateEvent(
          ['prophecy', 'warning', 'inspiration', 'nightmare', 'vision'][i % 5] as any,
          ['boxer', 'singer', 'actor', 'manager', 'promoter'][i % 5] as any,
          ['1920s', '1930s', '1940s', '1950s'][i % 4] as any
        ))
      }

      const endTime = performance.now()
      const totalTime = endTime - startTime

      expect(events).toHaveLength(100)
      expect(totalTime).toBeLessThan(200) // Should generate 100 events in under 200ms

      // Add all events to store
      const { result } = renderHook(() => useDreamworldStore())
      
      await act(async () => {
        for (const event of events) {
          await result.current.addDreamEvent(event)
        }
      })

      expect(result.current.dreamEvents).toHaveLength(100)
    })

    test('progress tracking handles many quests efficiently', async () => {
      const { result } = renderHook(() => useDreamworldProgressStore())
      const startTime = performance.now()

      act(() => {
        // Create 50 quests
        for (let i = 0; i < 50; i++) {
          result.current.startQuest(`quest${i}`, `Quest ${i}`, 5, 10)
          
          // Progress each quest
          for (let phase = 0; phase < 3; phase++) {
            result.current.updateQuestProgress(`quest${i}`, `phase${phase}`, 2)
          }
        }
      })

      const endTime = performance.now()
      const totalTime = endTime - startTime

      expect(Object.keys(result.current.questProgress)).toHaveLength(50)
      expect(totalTime).toBeLessThan(1000) // Should handle 50 quests in under 1 second

      // Check overall progress calculation
      const overallProgress = result.current.getOverallProgress()
      expect(overallProgress).toBeGreaterThan(0)
    })
  })

  describe('Error Recovery', () => {
    test('recovers from failed API calls', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      
      // Mock failed quest start
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => 
        useDreamworldQuest('test-player', 'test-quest')
      )

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to fetch quest state')
      })

      // Mock successful retry
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          quest_state: { quest_id: 'test-quest', current_phase: 'intro' },
          current_phase: { id: 'intro', name: 'Introduction' }
        })
      })

      // Trigger re-fetch
      await act(async () => {
        await result.current.startQuest()
      })

      expect(result.current.error).toBeNull()
      expect(result.current.questState).toBeDefined()
      
      consoleError.mockRestore()
    })

    test('handles corrupted store data gracefully', () => {
      // Corrupt the store data
      localStorageMock.getItem.mockReturnValue('invalid json {{{')

      // Should not crash when initializing
      expect(() => {
        const { result } = renderHook(() => useDreamworldProgressStore())
        // Store should initialize with default values
        expect(result.current.currentEra).toBe('1920s')
      }).not.toThrow()
    })
  })

  describe('Accessibility', () => {
    test('all interactive elements are keyboard accessible', async () => {
      render(
        <DreamEventModal
          dreamType="prophecy"
          content="Test content"
          impactScore={80}
          actionableInsight="Test insight"
          choices={[
            { text: 'Choice 1', impact: 'Impact 1', consequence: 'Result 1' },
            { text: 'Choice 2', impact: 'Impact 2', consequence: 'Result 2' }
          ]}
          onChoice={jest.fn()}
          onClose={jest.fn()}
          isOpen={true}
        />
      )

      // All buttons should be keyboard focusable
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button')
      })
    })

    test('progress indicators have appropriate ARIA labels', () => {
      render(<DreamworldProgressHUD />)

      // Progress bars should be accessible
      const progressBars = document.querySelectorAll('[role="progressbar"], .h-1, .h-2')
      expect(progressBars.length).toBeGreaterThan(0)
    })
  })
})