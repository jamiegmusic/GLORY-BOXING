import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface QuestProgress {
  questId: string
  questName: string
  currentPhase: number
  totalPhases: number
  phasesCompleted: string[]
  cluesFound: number
  totalClues: number
  startedAt: Date
  completedAt?: Date
  status: 'not_started' | 'in_progress' | 'completed' | 'failed'
}

export interface ChapterProgress {
  chapterId: string
  chapterName: string
  currentQuest: number
  totalQuests: number
  questsCompleted: string[]
  unlockedRewards: string[]
  status: 'locked' | 'active' | 'completed'
}

export interface EraProgress {
  era: '1920s' | '1930s' | '1940s' | '1950s'
  unlocked: boolean
  currentChapter: number
  totalChapters: number
  chaptersCompleted: string[]
  completionPercentage: number
  majorUnlocks: string[]
}

export interface Notification {
  id: string
  type: 'quest_complete' | 'chapter_complete' | 'era_unlock' | 'milestone' | 'reward'
  title: string
  message: string
  icon?: string
  timestamp: Date
  read: boolean
  data?: any
}

interface DreamworldProgressStore {
  // Current state
  currentEra: '1920s' | '1930s' | '1940s' | '1950s'
  currentChapterId: string | null
  currentQuestId: string | null
  
  // Progress tracking
  questProgress: Record<string, QuestProgress>
  chapterProgress: Record<string, ChapterProgress>
  eraProgress: Record<string, EraProgress>
  
  // Milestones & Achievements
  totalDreamTime: number // in minutes
  totalQuestsCompleted: number
  totalCluesDiscovered: number
  totalLegacyUnlocks: number
  milestones: string[]
  
  // Notifications
  notifications: Notification[]
  unreadNotifications: number
  
  // Methods
  startQuest: (questId: string, questName: string, totalPhases: number, totalClues: number) => void
  updateQuestProgress: (questId: string, phaseCompleted: string, cluesFound?: number) => void
  completeQuest: (questId: string) => void
  
  startChapter: (chapterId: string, chapterName: string, totalQuests: number) => void
  completeChapter: (chapterId: string, rewards: string[]) => void
  
  unlockEra: (era: '1920s' | '1930s' | '1940s' | '1950s') => void
  updateEraProgress: (era: string, chapterCompleted: string) => void
  
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markNotificationRead: (notificationId: string) => void
  clearAllNotifications: () => void
  
  checkMilestones: () => void
  updateDreamTime: (minutes: number) => void
  
  // Getters
  getCurrentQuestProgress: () => QuestProgress | null
  getCurrentChapterProgress: () => ChapterProgress | null
  getCurrentEraProgress: () => EraProgress | null
  getOverallProgress: () => number
}

const initialEraProgress: Record<string, EraProgress> = {
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
}

export const useDreamworldProgressStore = create<DreamworldProgressStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentEra: '1920s',
      currentChapterId: null,
      currentQuestId: null,
      
      questProgress: {},
      chapterProgress: {},
      eraProgress: initialEraProgress,
      
      totalDreamTime: 0,
      totalQuestsCompleted: 0,
      totalCluesDiscovered: 0,
      totalLegacyUnlocks: 0,
      milestones: [],
      
      notifications: [],
      unreadNotifications: 0,
      
      // Quest methods
      startQuest: (questId, questName, totalPhases, totalClues) => {
        set(state => ({
          currentQuestId: questId,
          questProgress: {
            ...state.questProgress,
            [questId]: {
              questId,
              questName,
              currentPhase: 1,
              totalPhases,
              phasesCompleted: [],
              cluesFound: 0,
              totalClues,
              startedAt: new Date(),
              status: 'in_progress'
            }
          }
        }))
        
        get().addNotification({
          type: 'quest_complete',
          title: 'Quest Started',
          message: `Beginning "${questName}" - ${totalPhases} phases await you`,
          icon: '🎭'
        })
      },
      
      updateQuestProgress: (questId, phaseCompleted, cluesFound = 0) => {
        set(state => {
          const quest = state.questProgress[questId]
          if (!quest) return state
          
          const updatedQuest = {
            ...quest,
            currentPhase: quest.currentPhase + 1,
            phasesCompleted: [...quest.phasesCompleted, phaseCompleted],
            cluesFound: quest.cluesFound + cluesFound
          }
          
          return {
            questProgress: {
              ...state.questProgress,
              [questId]: updatedQuest
            }
          }
        })
        
        // Check if quest is complete
        const quest = get().questProgress[questId]
        if (quest && quest.currentPhase > quest.totalPhases) {
          get().completeQuest(questId)
        }
      },
      
      completeQuest: (questId) => {
        set(state => {
          const quest = state.questProgress[questId]
          if (!quest) return state
          
          return {
            questProgress: {
              ...state.questProgress,
              [questId]: {
                ...quest,
                status: 'completed',
                completedAt: new Date()
              }
            },
            totalQuestsCompleted: state.totalQuestsCompleted + 1,
            totalCluesDiscovered: state.totalCluesDiscovered + quest.cluesFound
          }
        })
        
        const quest = get().questProgress[questId]
        get().addNotification({
          type: 'quest_complete',
          title: 'Quest Complete!',
          message: `You've completed "${quest.questName}" and discovered ${quest.cluesFound}/${quest.totalClues} clues`,
          icon: '🏆'
        })
        
        get().checkMilestones()
      },
      
      // Chapter methods
      startChapter: (chapterId, chapterName, totalQuests) => {
        set(state => ({
          currentChapterId: chapterId,
          chapterProgress: {
            ...state.chapterProgress,
            [chapterId]: {
              chapterId,
              chapterName,
              currentQuest: 1,
              totalQuests,
              questsCompleted: [],
              unlockedRewards: [],
              status: 'active'
            }
          }
        }))
        
        get().addNotification({
          type: 'chapter_complete',
          title: 'New Chapter',
          message: `Chapter "${chapterName}" has begun`,
          icon: '📖'
        })
      },
      
      completeChapter: (chapterId, rewards) => {
        set(state => ({
          chapterProgress: {
            ...state.chapterProgress,
            [chapterId]: {
              ...state.chapterProgress[chapterId],
              status: 'completed',
              unlockedRewards: rewards
            }
          },
          totalLegacyUnlocks: state.totalLegacyUnlocks + rewards.length
        }))
        
        const chapter = get().chapterProgress[chapterId]
        get().addNotification({
          type: 'chapter_complete',
          title: 'Chapter Complete!',
          message: `"${chapter.chapterName}" completed! ${rewards.length} rewards unlocked`,
          icon: '🌟'
        })
        
        // Update era progress
        const currentEra = get().currentEra
        get().updateEraProgress(currentEra, chapterId)
      },
      
      // Era methods
      unlockEra: (era) => {
        set(state => ({
          currentEra: era,
          eraProgress: {
            ...state.eraProgress,
            [era]: {
              ...state.eraProgress[era],
              unlocked: true
            }
          }
        }))
        
        get().addNotification({
          type: 'era_unlock',
          title: 'New Era Unlocked!',
          message: `Welcome to the ${era}! New talents and stories await`,
          icon: '🚀'
        })
      },
      
      updateEraProgress: (era, chapterCompleted) => {
        set(state => {
          const eraData = state.eraProgress[era]
          const updatedChapters = [...eraData.chaptersCompleted, chapterCompleted]
          const percentage = (updatedChapters.length / eraData.totalChapters) * 100
          
          return {
            eraProgress: {
              ...state.eraProgress,
              [era]: {
                ...eraData,
                chaptersCompleted: updatedChapters,
                completionPercentage: percentage,
                currentChapter: Math.min(eraData.currentChapter + 1, eraData.totalChapters)
              }
            }
          }
        })
      },
      
      // Notification methods
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date(),
          read: false
        }
        
        set(state => ({
          notifications: [newNotification, ...state.notifications],
          unreadNotifications: state.unreadNotifications + 1
        }))
      },
      
      markNotificationRead: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
          ),
          unreadNotifications: Math.max(0, state.unreadNotifications - 1)
        }))
      },
      
      clearAllNotifications: () => {
        set({ notifications: [], unreadNotifications: 0 })
      },
      
      // Milestone tracking
      checkMilestones: () => {
        const state = get()
        const newMilestones: string[] = []
        
        // Quest milestones
        if (state.totalQuestsCompleted === 1 && !state.milestones.includes('first_quest')) {
          newMilestones.push('first_quest')
          get().addNotification({
            type: 'milestone',
            title: 'First Steps',
            message: 'You\'ve completed your first dreamworld quest!',
            icon: '🎯'
          })
        }
        
        if (state.totalQuestsCompleted === 5 && !state.milestones.includes('quest_veteran')) {
          newMilestones.push('quest_veteran')
          get().addNotification({
            type: 'milestone',
            title: 'Quest Veteran',
            message: '5 quests completed! You\'re becoming a dreamworld expert',
            icon: '⭐'
          })
        }
        
        // Clue milestones
        if (state.totalCluesDiscovered >= 10 && !state.milestones.includes('detective')) {
          newMilestones.push('detective')
          get().addNotification({
            type: 'milestone',
            title: 'Dream Detective',
            message: '10 clues discovered! Nothing escapes your notice',
            icon: '🔍'
          })
        }
        
        // Time milestones
        if (state.totalDreamTime >= 60 && !state.milestones.includes('hour_dreamer')) {
          newMilestones.push('hour_dreamer')
          get().addNotification({
            type: 'milestone',
            title: 'Dedicated Dreamer',
            message: 'You\'ve spent an hour in the dreamworld!',
            icon: '⏰'
          })
        }
        
        if (newMilestones.length > 0) {
          set(state => ({
            milestones: [...state.milestones, ...newMilestones]
          }))
        }
      },
      
      updateDreamTime: (minutes) => {
        set(state => ({
          totalDreamTime: state.totalDreamTime + minutes
        }))
      },
      
      // Getters
      getCurrentQuestProgress: () => {
        const state = get()
        return state.currentQuestId ? state.questProgress[state.currentQuestId] : null
      },
      
      getCurrentChapterProgress: () => {
        const state = get()
        return state.currentChapterId ? state.chapterProgress[state.currentChapterId] : null
      },
      
      getCurrentEraProgress: () => {
        const state = get()
        return state.eraProgress[state.currentEra]
      },
      
      getOverallProgress: () => {
        const state = get()
        const totalProgress = Object.values(state.eraProgress).reduce((acc, era) => 
          acc + era.completionPercentage, 0
        )
        return totalProgress / 4 // Average across 4 eras
      }
    }),
    {
      name: 'dreamworld-progress',
      partialize: (state) => ({
        currentEra: state.currentEra,
        questProgress: state.questProgress,
        chapterProgress: state.chapterProgress,
        eraProgress: state.eraProgress,
        totalDreamTime: state.totalDreamTime,
        totalQuestsCompleted: state.totalQuestsCompleted,
        totalCluesDiscovered: state.totalCluesDiscovered,
        totalLegacyUnlocks: state.totalLegacyUnlocks,
        milestones: state.milestones
      })
    }
  )
)