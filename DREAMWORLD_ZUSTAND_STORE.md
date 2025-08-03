# 🏪 Dreamworld Zustand Store

A focused Zustand store implementation for the Dreamworld expansion with full Supabase integration.

## 🚀 Live Demo

Visit: `/dreamworld-store` to see the store in action!

## 📁 Files

- **`src/stores/dreamworldStore.ts`** - The Zustand store
- **`src/components/DreamworldStoreDemo.tsx`** - Demo component
- **`src/app/dreamworld-store/page.tsx`** - Demo route

## 🎯 Store Properties

### State
```typescript
{
  lucidMeter: number      // Player's lucid energy (0-100)
  currentEra: string      // Current time period ('1920s', etc.)
  dreamLevel: number      // Progression level (1-10)
  dreamEvents: DreamEvent[] // Array of dream events
  talents: Talent[]       // Available talents in current era
  
  // Additional state
  playerId: string | null // Current player ID
  isLoading: boolean      // Loading state
  error: string | null    // Error messages
}
```

### Methods

#### `initializeStore(playerId: string)`
Initializes the store with player data from Supabase.
```typescript
await initializeStore('player-123')
```

#### `addDreamEvent(event)`
Adds a new dream event to the database and state.
```typescript
await addDreamEvent({
  dream_type: 'prophecy',
  content: 'A vision appears...',
  impact_score: 75,
  actionable_insight: 'Trust your instincts'
})
```

#### `updateLucidMeter(value: number)`
Updates the lucid meter with bounds checking (0-100).
```typescript
await updateLucidMeter(85) // Set to 85%
await updateLucidMeter(lucidMeter + 10) // Increase by 10
```

#### `recruitTalent(talentId: string)`
Recruits a talent (costs 20 lucid energy).
```typescript
await recruitTalent('talent-uuid')
```

#### `progressEra()`
Advances to the next era (costs 25 lucid energy).
```typescript
await progressEra() // 1920s → 1930s
```

#### `wakeUpFromDream()`
Ends the dream session and calculates legacy rewards.
```typescript
const result = await wakeUpFromDream()
// result.legacyItems contains earned rewards
```

## 💻 Usage Example

```typescript
import useDreamworldStore from '@/stores/dreamworldStore'

function MyComponent() {
  const {
    // State
    lucidMeter,
    currentEra,
    dreamLevel,
    dreamEvents,
    talents,
    
    // Methods
    initializeStore,
    addDreamEvent,
    updateLucidMeter,
    recruitTalent,
    progressEra,
    wakeUpFromDream
  } = useDreamworldStore()

  // Initialize on mount
  useEffect(() => {
    initializeStore('player-id')
  }, [])

  return (
    <div>
      <h2>Lucid Energy: {lucidMeter}%</h2>
      <h3>Era: {currentEra}</h3>
      <button onClick={() => updateLucidMeter(lucidMeter + 10)}>
        Meditate (+10 Lucid)
      </button>
    </div>
  )
}
```

## 🔄 Supabase Integration

The store automatically syncs with three tables:

1. **`dreamworld_player_state`**
   - Tracks lucid meter, era, dream level
   - Creates new state if none exists
   - Updates on every state change

2. **`dream_events`**
   - Stores all dream events
   - Ordered by timestamp
   - Linked to player_id

3. **`dreamworld_talents`**
   - Loads talents based on current era
   - Filters by dream_era field

## 🎮 Game Mechanics

### Lucid Energy System
- Start with 50% lucid energy
- Recruit talent: -20 lucid
- Progress era: -25 lucid
- Auto wake up at 0 lucid

### Era Progression
- 4 eras: 1920s → 1930s → 1940s → 1950s
- Each progression increases dream level
- New talents load for each era

### Legacy Rewards
Based on performance:
- **Dream Master** (Level 5+): +10 perception, +5 focus
- **Prophet's Wisdom** (3+ high impact events): +15 strategy
- **Timeless Network** (2+ recruits): +20 networking

## 🔧 Error Handling

The store includes comprehensive error handling:
```typescript
if (error) {
  return <div>{error}</div>
}
```

Common errors:
- "Not enough lucid energy" - Insufficient lucid for action
- "Cannot progress further" - Already at 1950s
- "No player ID set" - Store not initialized

## 📊 Store Flow

```
Initialize Store
    ↓
Load/Create Player State
    ↓
Load Era Talents
    ↓
Load Recent Events
    ↓
Ready for Actions
    ↓
Update Supabase on Changes
```

## 🎯 Best Practices

1. **Always initialize first**
   ```typescript
   useEffect(() => {
     initializeStore(playerId)
   }, [])
   ```

2. **Check lucid costs**
   ```typescript
   if (lucidMeter >= 20) {
     await recruitTalent(id)
   }
   ```

3. **Handle async operations**
   ```typescript
   const handleAction = async () => {
     try {
       await progressEra()
     } catch (err) {
       console.error(err)
     }
   }
   ```

4. **Use loading states**
   ```typescript
   if (isLoading) {
     return <Loader />
   }
   ```

## 🔍 Debugging

Check store state:
```typescript
const state = useDreamworldStore.getState()
console.log(state)
```

Force sync:
```typescript
await syncFromSupabase()
```

---

The Dreamworld Zustand store provides a clean, type-safe interface for managing dreamworld state with automatic Supabase synchronization! 🌙✨