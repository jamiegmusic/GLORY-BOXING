import { act, renderHook } from '@testing-library/react'
import { useDreamworldProgressStore } from '../dreamworldProgressStore'

// Mock localStorage for persist middleware
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock as any

describe('DreamworldProgressStore', () => {
  beforeEach(() => {
    // Clear localStorage and reset store
    localStorageMock.clear()
    const { result } = renderHook(() => useDreamworldProgressStore())
    act(() => {
      result.current.clearAllNotifications()
      // Reset to initial state
      useDreamworldProgressStore.setState({
        currentEra: '1920s',
        currentChapterId: null,
        currentQuestId: null,
        questProgress: {},
        chapterProgress: {},
        eraProgress: {
          '1920s': {
            era: '1920s',
            unlocked: true,
            currentChapter: 1,
            totalChapters: 3,
            chaptersCompleted: [],
            completionPercentage: 0,
            majorUnlocks: []
          },
          '1930s': {
            era: '1930s',
            unlocked: false,
            currentChapter: 0,
            totalChapters: 3,
            chaptersCompleted: [],
            completionPercentage: 0,
            majorUnlocks: []
          },
          '1940s': {
            era: '1940s',
            unlocked: false,
            currentChapter: 0,
            totalChapters: 3,
            chaptersCompleted: [],
            completionPercentage: 0,
            majorUnlocks: []
          },
          '1950s': {
            era: '1950s',
            unlocked: false,
            currentChapter: 0,
            totalChapters: 3,
            chaptersCompleted: [],
            completionPercentage: 0,
            majorUnlocks: []
          }
        },
        totalDreamTime: 0,
        totalQuestsCompleted: 0,
        totalCluesDiscovered: 0,
        totalLegacyUnlocks: 0,
        milestones: [],
        notifications: [],
        unreadNotifications: 0
      })
    })
  })

  describe('Quest Management', () => {
    test('starts a new quest', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.startQuest('quest1', 'The Mystery Quest', 3, 5)
      })

      expect(result.current.currentQuestId).toBe('quest1')
      expect(result.current.questProgress['quest1']).toMatchObject({
        questId: 'quest1',
        questName: 'The Mystery Quest',
        currentPhase: 1,
        totalPhases: 3,
        phasesCompleted: [],
        cluesFound: 0,
        totalClues: 5,
        status: 'in_progress'
      })
      expect(result.current.notifications).toHaveLength(1)
      expect(result.current.notifications[0].type).toBe('quest_complete')
      expect(result.current.notifications[0].title).toBe('Quest Started')
    })

    test('updates quest progress', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.startQuest('quest1', 'Test Quest', 3, 5)
      })

      act(() => {
        result.current.updateQuestProgress('quest1', 'phase1', 2)
      })

      const quest = result.current.questProgress['quest1']
      expect(quest.currentPhase).toBe(2)
      expect(quest.phasesCompleted).toContain('phase1')
      expect(quest.cluesFound).toBe(2)
    })

    test('completes quest and triggers milestone', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.startQuest('quest1', 'Test Quest', 2, 3)
        result.current.updateQuestProgress('quest1', 'phase1', 1)
        result.current.updateQuestProgress('quest1', 'phase2', 2)
      })

      const quest = result.current.questProgress['quest1']
      expect(quest.status).toBe('completed')
      expect(result.current.totalQuestsCompleted).toBe(1)
      expect(result.current.totalCluesDiscovered).toBe(3)
      
      // Should trigger first quest milestone
      expect(result.current.milestones).toContain('first_quest')
      expect(result.current.notifications.some(n => n.title === 'First Steps')).toBe(true)
    })

    test('does not update non-existent quest', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.updateQuestProgress('nonexistent', 'phase1', 1)
      })

      expect(result.current.questProgress['nonexistent']).toBeUndefined()
    })
  })

  describe('Chapter Management', () => {
    test('starts a new chapter', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.startChapter('chapter1', 'The Beginning', 4)
      })

      expect(result.current.currentChapterId).toBe('chapter1')
      expect(result.current.chapterProgress['chapter1']).toMatchObject({
        chapterId: 'chapter1',
        chapterName: 'The Beginning',
        currentQuest: 1,
        totalQuests: 4,
        questsCompleted: [],
        unlockedRewards: [],
        status: 'active'
      })
    })

    test('completes chapter and updates era progress', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.startChapter('chapter1', 'Chapter One', 3)
        result.current.completeChapter('chapter1', ['reward1', 'reward2'])
      })

      const chapter = result.current.chapterProgress['chapter1']
      expect(chapter.status).toBe('completed')
      expect(chapter.unlockedRewards).toEqual(['reward1', 'reward2'])
      expect(result.current.totalLegacyUnlocks).toBe(2)

      const eraProgress = result.current.eraProgress['1920s']
      expect(eraProgress.chaptersCompleted).toContain('chapter1')
      expect(eraProgress.completionPercentage).toBeCloseTo(33.33, 1)
    })
  })

  describe('Era Management', () => {
    test('unlocks new era', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.unlockEra('1930s')
      })

      expect(result.current.currentEra).toBe('1930s')
      expect(result.current.eraProgress['1930s'].unlocked).toBe(true)
      expect(result.current.notifications.some(n => 
        n.type === 'era_unlock' && n.message.includes('1930s')
      )).toBe(true)
    })

    test('updates era progress correctly', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.updateEraProgress('1920s', 'chapter1')
        result.current.updateEraProgress('1920s', 'chapter2')
      })

      const era = result.current.eraProgress['1920s']
      expect(era.chaptersCompleted).toHaveLength(2)
      expect(era.completionPercentage).toBeCloseTo(66.67, 1)
      expect(era.currentChapter).toBe(3)
    })

    test('calculates overall progress across all eras', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        // Complete 1920s
        result.current.updateEraProgress('1920s', 'chapter1')
        result.current.updateEraProgress('1920s', 'chapter2')
        result.current.updateEraProgress('1920s', 'chapter3')
        
        // Partially complete 1930s
        result.current.unlockEra('1930s')
        result.current.updateEraProgress('1930s', 'chapter1')
      })

      const overallProgress = result.current.getOverallProgress()
      expect(overallProgress).toBeCloseTo(33.33, 1) // (100 + 33.33 + 0 + 0) / 4
    })
  })

  describe('Notification System', () => {
    test('adds notifications with proper structure', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.addNotification({
          type: 'milestone',
          title: 'Test Milestone',
          message: 'You achieved something!',
          icon: '🏆'
        })
      })

      expect(result.current.notifications).toHaveLength(1)
      expect(result.current.unreadNotifications).toBe(1)
      
      const notification = result.current.notifications[0]
      expect(notification).toMatchObject({
        type: 'milestone',
        title: 'Test Milestone',
        message: 'You achieved something!',
        icon: '🏆',
        read: false
      })
      expect(notification.id).toBeDefined()
      expect(notification.timestamp).toBeDefined()
    })

    test('marks notification as read', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.addNotification({
          type: 'reward',
          title: 'Reward',
          message: 'New item!'
        })
      })

      const notificationId = result.current.notifications[0].id

      act(() => {
        result.current.markNotificationRead(notificationId)
      })

      expect(result.current.notifications[0].read).toBe(true)
      expect(result.current.unreadNotifications).toBe(0)
    })

    test('clears all notifications', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.addNotification({ type: 'quest_complete', title: 'Quest 1', message: 'Done' })
        result.current.addNotification({ type: 'chapter_complete', title: 'Chapter 1', message: 'Done' })
      })

      act(() => {
        result.current.clearAllNotifications()
      })

      expect(result.current.notifications).toHaveLength(0)
      expect(result.current.unreadNotifications).toBe(0)
    })
  })

  describe('Milestone Tracking', () => {
    test('triggers quest veteran milestone after 5 quests', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        // Complete 5 quests
        for (let i = 1; i <= 5; i++) {
          result.current.startQuest(`quest${i}`, `Quest ${i}`, 1, 1)
          result.current.updateQuestProgress(`quest${i}`, 'complete', 1)
        }
      })

      expect(result.current.milestones).toContain('first_quest')
      expect(result.current.milestones).toContain('quest_veteran')
      expect(result.current.totalQuestsCompleted).toBe(5)
    })

    test('triggers detective milestone after 10 clues', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.startQuest('quest1', 'Big Quest', 5, 15)
        // Find 10 clues across phases
        for (let i = 1; i <= 5; i++) {
          result.current.updateQuestProgress('quest1', `phase${i}`, 2)
        }
      })

      expect(result.current.totalCluesDiscovered).toBe(10)
      expect(result.current.milestones).toContain('detective')
    })

    test('triggers hour dreamer milestone', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.updateDreamTime(60)
      })

      expect(result.current.totalDreamTime).toBe(60)
      expect(result.current.milestones).toContain('hour_dreamer')
    })

    test('does not duplicate milestones', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.updateDreamTime(60)
        result.current.checkMilestones()
        result.current.checkMilestones()
      })

      expect(result.current.milestones.filter(m => m === 'hour_dreamer')).toHaveLength(1)
    })
  })

  describe('Getters', () => {
    test('getCurrentQuestProgress returns current quest', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.startQuest('quest1', 'Current Quest', 3, 5)
      })

      const currentQuest = result.current.getCurrentQuestProgress()
      expect(currentQuest?.questId).toBe('quest1')
      expect(currentQuest?.questName).toBe('Current Quest')
    })

    test('getCurrentChapterProgress returns current chapter', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.startChapter('chapter1', 'Current Chapter', 3)
      })

      const currentChapter = result.current.getCurrentChapterProgress()
      expect(currentChapter?.chapterId).toBe('chapter1')
      expect(currentChapter?.chapterName).toBe('Current Chapter')
    })

    test('getCurrentEraProgress returns current era data', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      const currentEra = result.current.getCurrentEraProgress()
      expect(currentEra?.era).toBe('1920s')
      expect(currentEra?.unlocked).toBe(true)
    })
  })

  describe('Persistence', () => {
    test('persists critical state data', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())

      act(() => {
        result.current.startQuest('quest1', 'Test Quest', 2, 3)
        result.current.updateDreamTime(30)
        result.current.unlockEra('1930s')
      })

      // Simulate store persistence
      const state = useDreamworldProgressStore.getState()
      const persistedData = {
        currentEra: state.currentEra,
        questProgress: state.questProgress,
        chapterProgress: state.chapterProgress,
        eraProgress: state.eraProgress,
        totalDreamTime: state.totalDreamTime,
        totalQuestsCompleted: state.totalQuestsCompleted,
        totalCluesDiscovered: state.totalCluesDiscovered,
        totalLegacyUnlocks: state.totalLegacyUnlocks,
        milestones: state.milestones
      }

      expect(persistedData.currentEra).toBe('1930s')
      expect(persistedData.totalDreamTime).toBe(30)
      expect(persistedData.questProgress['quest1']).toBeDefined()
    })
  })

  describe('Performance', () => {
    test('handles many notifications efficiently', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())
      const startTime = performance.now()

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.addNotification({
            type: 'milestone',
            title: `Notification ${i}`,
            message: `Message ${i}`
          })
        }
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(executionTime).toBeLessThan(100) // Should be very fast
      expect(result.current.notifications).toHaveLength(100)
    })

    test('efficiently tracks multiple quests', () => {
      const { result } = renderHook(() => useDreamworldProgressStore())
      const startTime = performance.now()

      act(() => {
        // Start and update 50 quests
        for (let i = 0; i < 50; i++) {
          result.current.startQuest(`quest${i}`, `Quest ${i}`, 3, 5)
          result.current.updateQuestProgress(`quest${i}`, 'phase1', 1)
        }
      })

      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(executionTime).toBeLessThan(500) // Should handle 50 quests quickly
      expect(Object.keys(result.current.questProgress)).toHaveLength(50)
    })
  })
})