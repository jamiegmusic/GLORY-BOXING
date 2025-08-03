# 🎯 Dreamworld Quest Progression Tracking System

## Overview

A comprehensive quest progression tracking system for the Dreamworld expansion, featuring real-time progress indicators, milestone notifications, and persistent state management using Zustand.

## 🎮 Live Demo

Access at: `/dreamworld-progress`

## 🌟 Key Features

### 1. **Progress HUD**
- **Current Era Display**: Shows active era with color-coded badge
- **Era Progress Bar**: Visual indicator of chapter completion
- **Overall Progress**: Circular progress meter showing total dreamworld completion
- **Quest Context**: Current quest name, phase, and clue tracking
- **Chapter Progress**: Active chapter with quest completion tracking
- **Era Status Indicators**: Visual unlock status for all four eras

### 2. **Notification System**
- **Real-time Notifications**: Auto-dismiss toast notifications
- **Multiple Types**: Quest, Chapter, Era, Milestone, and Reward notifications
- **Notification Center**: Full history with read/unread states
- **Badge Counter**: Unread notification count on bell icon
- **Custom Icons**: Emoji or icon support for each notification type

### 3. **Quest Integration**
- **Phase Tracking**: Progress through multi-phase quests
- **Clue Discovery**: Track clues found vs total available
- **Choice Context**: Quest info displayed in DreamEventModal
- **Automatic Updates**: Progress syncs as players advance

### 4. **Milestone System**
- **Achievement Tracking**: First quest, veteran status, detective badges
- **Time-based Milestones**: Track total dreamworld time
- **Automatic Detection**: Milestones trigger automatically
- **Persistent Storage**: Progress saved across sessions

## 📁 Implementation Files

### State Management
- **`src/stores/dreamworldProgressStore.ts`** - Zustand store with persist middleware

### Components
- **`src/components/Dreamworld/DreamworldProgressHUD.tsx`** - Progress header display
- **`src/components/Dreamworld/DreamworldNotifications.tsx`** - Notification system
- **Updated `DreamworldDashboard.tsx`** - Integrated progress tracking
- **Updated `DreamEventModal.tsx`** - Shows quest context
- **Updated `JazzSingersSecretQuest.tsx`** - Progress store integration

### Demo
- **`src/app/dreamworld-progress/page.tsx`** - Interactive demo page

## 🏗️ Architecture

### Store Structure
```typescript
interface DreamworldProgressStore {
  // Current state
  currentEra: '1920s' | '1930s' | '1940s' | '1950s'
  currentChapterId: string | null
  currentQuestId: string | null
  
  // Progress tracking
  questProgress: Record<string, QuestProgress>
  chapterProgress: Record<string, ChapterProgress>
  eraProgress: Record<string, EraProgress>
  
  // Stats & Achievements
  totalDreamTime: number
  totalQuestsCompleted: number
  totalCluesDiscovered: number
  totalLegacyUnlocks: number
  milestones: string[]
  
  // Notifications
  notifications: Notification[]
  unreadNotifications: number
}
```

### Progress Types
```typescript
interface QuestProgress {
  questId: string
  questName: string
  currentPhase: number
  totalPhases: number
  phasesCompleted: string[]
  cluesFound: number
  totalClues: number
  status: 'not_started' | 'in_progress' | 'completed' | 'failed'
}

interface ChapterProgress {
  chapterId: string
  chapterName: string
  currentQuest: number
  totalQuests: number
  questsCompleted: string[]
  unlockedRewards: string[]
  status: 'locked' | 'active' | 'completed'
}

interface EraProgress {
  era: '1920s' | '1930s' | '1940s' | '1950s'
  unlocked: boolean
  currentChapter: number
  totalChapters: number
  chaptersCompleted: string[]
  completionPercentage: number
}
```

## 🎨 UI Components

### Progress HUD Layout
```
┌─────────────────────────────────────────────────────────┐
│ [1920s] Era Progress: ████████░░ 80%    Overall: 25% ⭐ │
├─────────────────────────────────────────────────────────┤
│ 🗺️ Current Quest        📚 Chapter              🕐 Eras │
│ Jazz Singer's Secret    The Roaring Start      20 30 40 50│
│ Phase 2/3 ████░░        Quest 1/3              ●  ○  ○  ○ │
│ 1/3 clues found         ████████░░             1/3 done   │
└─────────────────────────────────────────────────────────┘
```

### Notification Types & Colors
- **Quest Complete** (Amber): Quest completion alerts
- **Chapter Complete** (Purple): Chapter milestones
- **Era Unlock** (Blue): New era availability
- **Milestone** (Green): Achievement notifications
- **Reward** (Orange): Item/unlock notifications

## 🔧 Usage

### Starting a Quest
```typescript
const { startQuest } = useDreamworldProgressStore()

startQuest(
  'jazz_singers_secret',     // questId
  'The Jazz Singer\'s Secret', // questName
  3,                          // totalPhases
  3                           // totalClues
)
```

### Updating Progress
```typescript
const { updateQuestProgress } = useDreamworldProgressStore()

// When completing a phase
updateQuestProgress(
  'jazz_singers_secret',  // questId
  'investigation',        // phaseCompleted
  1                       // cluesFound
)
```

### Adding Notifications
```typescript
const { addNotification } = useDreamworldProgressStore()

addNotification({
  type: 'quest_complete',
  title: 'Quest Complete!',
  message: 'You\'ve uncovered the Jazz Singer\'s Secret!',
  icon: '🎷'
})
```

### Tracking Milestones
```typescript
// Automatic milestone checking
const { checkMilestones } = useDreamworldProgressStore()
checkMilestones() // Called automatically after quest completion
```

## 🎮 Player Experience Flow

1. **Quest Start**
   - Progress HUD updates with quest info
   - "Quest Started" notification appears
   - Phase 1/X displayed in HUD

2. **Phase Completion**
   - Progress bar advances
   - Clue counter updates
   - Phase completion tracked

3. **Quest Complete**
   - Completion notification with fanfare
   - Stats update (total quests, clues)
   - Milestone check triggered

4. **Era Progression**
   - Chapter completion updates era %
   - New era unlock notifications
   - Era indicators update in HUD

## 🌟 Best Practices

1. **Quest Design**
   - Always specify total phases and clues upfront
   - Use meaningful phase names for tracking
   - Include quest context in event modals

2. **Notification Usage**
   - Use appropriate notification types
   - Keep messages concise and actionable
   - Include relevant icons or emojis

3. **Progress Updates**
   - Update progress immediately after player actions
   - Sync with backend for persistence
   - Show visual feedback for all changes

4. **Performance**
   - Progress store uses Zustand persist middleware
   - Notifications auto-dismiss to prevent clutter
   - Selective re-renders with store subscriptions

## 📊 Tracking Metrics

The system tracks:
- Total quests completed
- Clues discovered across all quests
- Time spent in dreamworld (minutes)
- Legacy unlocks earned
- Milestone achievements
- Era completion percentages

## 🚀 Future Enhancements

1. **Quest Chains**: Link related quests
2. **Seasonal Events**: Time-limited quests
3. **Leaderboards**: Compare progress
4. **Achievement Gallery**: Visual milestone display
5. **Progress Export**: Share achievements

---

The quest progression system provides a complete framework for tracking player journey through the dreamworld! 🌙✨