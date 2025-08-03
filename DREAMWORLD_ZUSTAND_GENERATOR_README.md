# 🌙 Dreamworld Zustand Store & Event Generator

## Overview

A complete state management solution with Supabase sync and a sophisticated dream event generation system for the Dreamworld expansion.

## 🚀 Live Demo

Visit: `/dreamworld-example` to see the full implementation in action!

## 📁 Files Created

1. **`src/stores/dreamworldStore.ts`** - Enhanced Zustand store with Supabase sync
2. **`src/lib/dreamworld/DreamEventGenerator.ts`** - Intelligent dream event generator
3. **`src/components/Dreamworld/DreamworldExample.tsx`** - Example implementation
4. **`src/app/dreamworld-example/page.tsx`** - Demo route

## 🏪 Zustand Store Features

### Core State Properties
```typescript
{
  lucidMeter: number        // Player's lucid energy (0-100)
  currentEra: string        // Current time period ('1920s', etc.)
  dreamLevel: number        // Progression level (1-10)
  dreamEvents: DreamEvent[] // Array of all dream events
  talents: DreamworldTalent[] // Available talents in current era
}
```

### Core Methods

#### `initializeDreamworld(playerId: string)`
- Creates or loads player state from Supabase
- Loads talents for current era
- Fetches recent dream events
- Sets up initial state

#### `addDreamEvent(event)`
- Adds event to Supabase database
- Updates local state
- Deducts lucid energy for high-impact events
- Maintains event history

#### `updateLucidMeter(value: number)`
- Updates lucid energy with bounds checking
- Syncs to Supabase
- Triggers wake-up if depleted
- Real-time state updates

#### `recruitTalent(talentId: string)`
- Validates lucid energy cost (20)
- Updates player's talent roster
- Deducts dream currency
- Generates recruitment event

#### `progressEra()`
- Advances to next historical era
- Costs 25 lucid energy
- Loads new era's talents
- Creates temporal reality glitch

#### `wakeUpFromDream()`
- Calculates legacy items based on:
  - Dream level reached
  - Reputation points earned
  - Prophecies received
- Resets dreamworld state
- Returns legacy rewards

### Supabase Integration

The store automatically syncs with three core tables:
- `dreamworld_player_state` - Player progress
- `dreamworld_talents` - Historical figures
- `dream_events` - Story events

## 🎲 Dream Event Generator

### Features

1. **Dynamic Content Generation**
   - Era-specific locations and figures
   - Career-path themed venues and skills
   - Talent-specific narratives
   - Variable substitution system

2. **Intelligent Dream Type Selection**
   - Based on player state:
     - Low lucidity → More nightmares
     - High lucidity → More visions/prophecies
     - Low wellness → More warnings
     - High dream level → More prophecies
   - Weighted probability system

3. **Context-Aware Choices**
   - Dream type specific options
   - Career path actions
   - Lucidity-gated special choices
   - Dynamic requirements

4. **Impact Score Calculation**
   - Dream type modifiers
   - Player state factors
   - Reality glitch influence
   - Randomness for variety

### Usage Examples

```typescript
// Generate event with specific type
const event = await generateDreamEvent({
  dreamType: 'prophecy',
  playerState,
  talents,
  forceHighImpact: true
})

// Generate and add to store
await generateAndAddDreamEvent({
  careerPath: 'boxer',
  era: '1920s'
})

// Let generator decide type
const autoEvent = await dreamEventGenerator.generateDreamEvent({
  playerState,
  talents
})
```

### Content Templates

The generator includes rich templates for each dream type:

- **Prophecy**: Visions of future success and opportunity
- **Warning**: Dangers and betrayals to avoid
- **Inspiration**: Creative breakthroughs and innovations
- **Nightmare**: Fears and failures manifested
- **Vision**: Timeline glimpses and cosmic insights

### Era Contexts

Each era has unique elements:

**1920s**
- Locations: Harlem, speakeasies, jazz streets
- Figures: Louis Armstrong, Al Capone, Josephine Baker
- Events: Jazz Revolution, Prohibition, Harlem Renaissance

**1930s**
- Locations: Hollywood, dust bowl farms, art deco towers
- Figures: Clark Gable, Eleanor Roosevelt, Joe Louis
- Events: Great Depression, Golden Age of Hollywood

**1940s**
- Locations: USO stages, factory floors, noir cityscapes
- Figures: Frank Sinatra, Rosie the Riveter, Humphrey Bogart
- Events: War effort, atomic age, film noir peak

**1950s**
- Locations: TV studios, drive-ins, suburban paradises
- Figures: Elvis Presley, Marilyn Monroe, James Dean
- Events: Rock and roll birth, TV revolution, space race

## 🎮 Example Implementation

The example component demonstrates:

1. **State Display**
   - Real-time lucid meter
   - Current era and level
   - Event count tracking

2. **Event Generation**
   - Type-specific generation
   - Random generation
   - Manual control options

3. **World Actions**
   - Era progression
   - Talent recruitment
   - Wake up with legacy items

4. **Event Interaction**
   - Detailed event modals
   - Choice display
   - Impact visualization

## 🔧 Integration Guide

### Basic Setup

```typescript
import { useDreamworldStore } from '@/stores/dreamworldStore'
import { generateDreamEvent } from '@/lib/dreamworld/DreamEventGenerator'

// Initialize for a player
const store = useDreamworldStore.getState()
await store.initializeDreamworld(playerId)

// Generate events periodically
setInterval(async () => {
  await store.generateAndAddDreamEvent()
}, 30000) // Every 30 seconds
```

### React Component Usage

```typescript
function DreamworldComponent() {
  const {
    lucidMeter,
    dreamEvents,
    updateLucidMeter,
    progressEra
  } = useDreamworldStore()

  return (
    <div>
      <h2>Lucid Energy: {lucidMeter}%</h2>
      <button onClick={() => updateLucidMeter(lucidMeter + 10)}>
        Meditate (+10 Lucid)
      </button>
    </div>
  )
}
```

### Custom Event Generation

```typescript
// Generate high-impact prophecy for boxer
const boxerProphecy = await generateDreamEvent({
  dreamType: 'prophecy',
  careerPath: 'boxer',
  era: '1920s',
  forceHighImpact: true,
  playerState,
  talents: boxerTalents
})

// Add to store
await store.addDreamEvent(boxerProphecy)
```

## 📊 State Flow

```
Player Enters Dreamworld
    ↓
Initialize State from Supabase
    ↓
Load Era Talents & Events
    ↓
Generate Dream Events (Auto/Manual)
    ↓
Player Makes Choices
    ↓
Update Lucid Meter & State
    ↓
Progress Through Eras
    ↓
Wake Up Conditions Met
    ↓
Calculate Legacy Items
    ↓
Return to Main Game
```

## 🎯 Best Practices

1. **Event Generation**
   - Generate events based on player actions
   - Use high-impact events sparingly
   - Match dream types to player state

2. **State Management**
   - Always check player state before actions
   - Handle errors gracefully
   - Sync critical changes immediately

3. **Performance**
   - Batch Supabase updates when possible
   - Cache frequently accessed data
   - Limit event history to recent items

## 🔒 Error Handling

The store includes built-in error handling:
- Network failures gracefully handled
- Invalid states prevented
- User-friendly error messages
- Automatic retry for critical operations

---

The Zustand store and DreamEventGenerator provide a complete, production-ready solution for managing the Dreamworld expansion with rich, dynamic content generation! 🎭