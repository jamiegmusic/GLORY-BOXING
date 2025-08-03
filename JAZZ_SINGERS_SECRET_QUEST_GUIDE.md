# 🎷 The Jazz Singer's Secret - Full-Stack Quest Implementation

## Overview

A complete full-stack implementation of a Dreamworld quest featuring Billie Holiday's time-transcending sheet music. Players investigate through 3 phases, making choices between lucid powers and logic, ultimately earning legacy rewards for the main game.

## 🎮 Live Demo

Access at: `/dreamworld-quest`

## 📁 Implementation Files

### Backend
- **`backend/api/dreamworld_quest.py`** - FastAPI endpoints for quest management
- **`supabase/migrations/011_dreamworld_quests.sql`** - Database tables for quests and legacy unlocks

### Frontend
- **`src/hooks/useDreamworldQuest.ts`** - React hook for quest state management
- **`src/components/Dreamworld/JazzSingersSecretQuest.tsx`** - Main quest component
- **`src/components/Dreamworld/QuestModal.tsx`** - Quest phase modal UI
- **`src/stores/dreamworldStore.ts`** - Updated with quest state management

### Demo
- **`src/app/dreamworld-quest/page.tsx`** - Demo page

## 🎭 Quest Structure

### Phase 1: The Mysterious Melody
**Description**: You hear Billie Holiday humming a tune that hasn't been written yet.

**Choices**:
1. **Lucid (20 cost)**: Use lucid power to read her thoughts
2. **Logic (0 cost)**: Observe her patterns and deduce the secret

**Clue**: "The melody contains a map to forgotten sheet music"

### Phase 2: The Cotton Club Confrontation  
**Description**: You confront Billie at the Cotton Club. Duke Ellington watches from the shadows.

**Choices**:
1. **Lucid (30 cost)**: Dreamwalk into her memories
2. **Logic (0 cost)**: Negotiate with charm and wit

**Clue**: "The sheet music can bridge dreams and reality"

### Phase 3: The Time-Lost Composition
**Description**: The secret is revealed: sheet music from the future that can alter the past.

**Choices**:
1. **Lucid (40 cost)**: Use lucid power to perfectly transcribe the music
2. **Logic (0 cost)**: Memorize what you can through careful study

**Clue**: "The music holds power over fate itself"

## 🏆 Reward System

### Legendary Path (All Lucid - 90 total cost)
**Temporal Jazz Manuscript**
- Description: Complete sheet music that transcends time
- Effects: +15 to all musical talents, temporal awareness, dream music mastery
- Rarity: Legendary

### Mixed Path (Some Lucid)
**Faded Jazz Notes**
- Description: Partial sheet music with mysterious power
- Effects: +8 to musical talents, dream music affinity
- Rarity: Rare

### Logic Path (No Lucid)
**Jazz Era Wisdom**
- Description: Deep understanding of 1920s musical innovation
- Effects: +5 to negotiation, era knowledge
- Rarity: Uncommon

## 🔧 API Endpoints

### POST `/api/dreamworld/quest/start`
Starts the quest for a player
```json
{
  "player_id": "uuid",
  "quest_id": "jazz_singers_secret"
}
```

### POST `/api/dreamworld/quest/choice`
Makes a choice in the current phase
```json
{
  "player_id": "uuid",
  "quest_id": "jazz_singers_secret",
  "phase_id": "investigation",
  "choice_id": "lucid_read_mind"
}
```

### GET `/api/dreamworld/quest/state/{player_id}/{quest_id}`
Gets current quest state and progress

### POST `/api/dreamworld/quest/apply-reward/{player_id}/{quest_id}`
Applies quest reward to main game

## 🗄️ Database Schema

### dreamworld_quests
```sql
- id: UUID (primary key)
- quest_id: VARCHAR(100)
- player_id: UUID
- current_phase: VARCHAR(50)
- phases_completed: JSONB
- clues_discovered: JSONB
- lucid_used: INTEGER
- logic_used: INTEGER
- started_at: TIMESTAMP
- completed_at: TIMESTAMP
- reward_claimed: BOOLEAN
- reward_id: UUID
```

### legacy_unlocks
```sql
- id: UUID (primary key)
- player_id: UUID
- unlock_type: VARCHAR(50)
- unlock_name: VARCHAR(255)
- unlock_data: JSONB
- dreamworld_source: VARCHAR(100)
- applied_to_main: BOOLEAN
- applied_at: TIMESTAMP
```

## 🎨 UI Components

### Quest Card
- Shows quest overview when not started
- Displays progress bar during quest
- Shows clues discovered
- Final reward display

### Quest Modal
- Phase-specific narrative
- Lucid meter display
- Choice buttons with cost indicators
- Loading states and error handling

### Reward Modal
- Completion celebration
- Reward details with rarity colors
- Apply to main game button

## 🔄 State Management

### Zustand Store Updates
```typescript
interface QuestInfo {
  quest_id: string
  current_phase: string
  phases_completed: string[]
  clues_discovered: string[]
  lucid_used: number
  logic_used: number
}

// Methods
updateQuestInfo(questInfo: QuestInfo): void
completeQuest(questId: string): void
```

### React Hook
```typescript
const {
  questState,      // Current quest progress
  currentPhase,    // Active phase data
  reward,          // Earned reward
  isLoading,       // Loading state
  error,           // Error messages
  startQuest,      // Begin quest
  makeChoice,      // Make phase choice
  applyReward,     // Apply to main game
  canAffordChoice  // Check lucid cost
} = useDreamworldQuest(playerId, questId)
```

## 🎮 Game Flow

1. **Quest Discovery**: Player sees quest card in dreamworld
2. **Quest Start**: Triggers first phase, stores state in DB
3. **Investigation**: Player makes choices, spending lucid or using logic
4. **Progress Tracking**: Clues discovered, phases completed
5. **Completion**: Final choice determines reward tier
6. **Legacy Unlock**: Reward saved to legacy_unlocks table
7. **Main Game Integration**: Applied effects persist outside dreamworld

## 🌟 Features

- **Dynamic Rewards**: Based on player choices throughout quest
- **Persistent State**: Quest progress saved to database
- **Lucid Economy**: Meaningful resource management
- **Narrative Choices**: Each decision affects the outcome
- **Visual Feedback**: Progress bars, clue tracking, animations
- **Error Handling**: Graceful failures with user feedback
- **Mobile Responsive**: Works on all screen sizes

## 💡 Extension Ideas

1. **More Quests**: Add quests for other 1920s talents
2. **Branching Paths**: Multiple endings based on choices
3. **Time Limits**: Add urgency with dream decay
4. **Multiplayer**: Cooperative quest solving
5. **Achievement System**: Track quest completions
6. **Daily Quests**: Rotating quest availability

---

The Jazz Singer's Secret demonstrates a complete quest implementation from database to UI, ready for integration into the main game! 🎷✨