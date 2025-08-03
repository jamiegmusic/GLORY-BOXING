# 🌙 Dreamworld Expansion - Complete Implementation Guide

## Overview

The Dreamworld Expansion is a comprehensive side mission feature for Glory Boxing Manager that transports players to the 1920s-1950s entertainment era through lucid dreaming mechanics. When a fighter gets knocked out or a manager has a breakdown, players can optionally enter a dreamworld where they manage historical entertainment figures and earn legacy rewards that persist in the main game.

## 🎮 Demo

Try the live demo at: `/dreamworld-demo`

## 🚀 Quick Start

### 1. Database Setup

Run the migration to create dreamworld tables:

```bash
# Run migration
psql -U your_user -d your_database -f supabase/migrations/007_dreamworld_expansion.sql
```

### 2. Import Styles

Add to your main layout or app file:

```tsx
import '@/styles/dreamworld.css'
```

### 3. Basic Integration

```tsx
import DreamworldTrigger from '@/components/Dreamworld/DreamworldTrigger'
import { LegacyUnlock } from '@/types/dreamworld'

// In your fight component
const handleKnockout = (fighter: Fighter) => {
  setDreamworldTrigger({
    type: 'knockout',
    fighterName: fighter.name
  })
}

// In your component render
{dreamworldTrigger && (
  <DreamworldTrigger
    playerId={currentPlayer.id}
    triggerType={dreamworldTrigger.type}
    fighterName={dreamworldTrigger.fighterName}
    onComplete={handleDreamworldComplete}
  />
)}

// Handle legacy unlocks
const handleDreamworldComplete = (unlocks: LegacyUnlock[]) => {
  // Apply legacy effects to main game
  unlocks.forEach(unlock => {
    if (unlock.effect_data.charisma) {
      updatePlayerStats({ charisma: unlock.effect_data.charisma })
    }
    // ... handle other effects
  })
}
```

## 🎯 Core Features

### 1. **Lucid Dreaming System**
- **Lucid Meter**: Awareness level that affects available actions
- **Wellness Meter**: Mental health that impacts dream stability
- **Dream Levels**: Progress through 10 levels of lucidity
- **Reality Glitches**: Visual and gameplay distortions

### 2. **Era Navigation**
- **1920s**: Jazz Age - Prohibition, flappers, jazz clubs
- **1930s**: Golden Age - Hollywood glamour, Great Depression
- **1940s**: War Years - Big bands, noir, wartime entertainment
- **1950s**: Television Era - Rock 'n' roll, rise of TV

### 3. **Dream Events**
- **Prophecy**: Future visions with opportunities
- **Warning**: Threats to avoid or overcome
- **Inspiration**: Creative boosts and insights
- **Nightmare**: Challenges that test resolve
- **Vision**: Glimpses across time periods
- **Memory**: Forgotten knowledge resurfaces

### 4. **Legacy System**
Items and bonuses that carry over to the main game:
- **Skills**: Permanent stat boosts
- **Items**: Special equipment and tools
- **Connections**: Unlock new opportunities
- **Knowledge**: Strategic advantages
- **Bonuses**: Passive benefits

## 📁 File Structure

```
src/
├── components/Dreamworld/
│   ├── DreamworldDashboard.tsx    # Main dreamworld UI
│   ├── DreamworldTrigger.tsx      # Entry point component
│   ├── DreamTalentCard.tsx        # Talent display cards
│   ├── DreamEventModal.tsx        # Event choice system
│   ├── LucidMeterHUD.tsx          # HUD display
│   ├── DreamTimelineSlider.tsx    # Era navigation
│   ├── RealityGlitchEffect.tsx    # Visual effects
│   ├── DreamVenueManager.tsx      # Venue management
│   └── LegacyUnlocksPanel.tsx     # Rewards display
├── lib/dreamworld/
│   └── dreamLogicEngine.ts         # Game logic engine
├── hooks/
│   └── useDreamworld.ts           # State management hook
├── types/
│   └── dreamworld.ts              # TypeScript definitions
├── styles/
│   └── dreamworld.css             # Vintage 1920s styling
└── app/
    └── dreamworld-demo/
        └── page.tsx               # Demo page
```

## 🗄️ Database Schema

### Core Tables

1. **dreamworld_talents** - Historical entertainment figures
2. **dream_events** - Story events and player choices
3. **dreamworld_player_state** - Player progress and status
4. **legacy_unlocks** - Rewards earned in dreamworld
5. **dreamworld_venues** - Era-specific locations
6. **dreamworld_contracts** - Talent agreements

See `supabase/migrations/007_dreamworld_expansion.sql` for full schema.

## 🎨 UI Components

### DreamworldDashboard
The main interface featuring:
- Vintage 1920s aesthetic with sepia tones
- Film grain and flicker effects
- Era-appropriate typography
- Art deco design elements

### Key UI Elements
- **Lucid Meter HUD**: Always visible awareness indicator
- **Timeline Slider**: Navigate between decades
- **Talent Cards**: Manage historical figures
- **Event Modals**: Story-driven choices
- **Venue Manager**: Book and invest in locations
- **Legacy Panel**: Track earned rewards

## 🔧 Customization

### Adding New Dream Events

```typescript
// In dreamLogicEngine.ts
private initializeEventTemplates() {
  this.eventTemplates.set('prophecy', [
    "Your custom prophecy event text with {variables}...",
    // Add more templates
  ])
}
```

### Creating New Legacy Unlocks

```typescript
const unlockTemplates = {
  skill: [
    { 
      name: "Custom Skill Name", 
      effect: { stat: value } 
    }
  ]
}
```

### Styling Modifications

Edit `src/styles/dreamworld.css` to customize:
- Color schemes (sepia tones)
- Animation effects
- Typography styles
- Visual filters

## 🎮 Game Mechanics

### Trigger Conditions
1. **Knockout**: Fighter loses consciousness (40 lucid meter)
2. **Breakdown**: Manager stress overload (50 lucid meter)
3. **Injury**: Severe fighter injury (60 lucid meter)

### Wake Up Conditions
- Lucid meter reaches 0
- Wellness meter depleted
- Reach dream level 10
- Player chooses to wake up

### Reality Glitches
- **Temporal**: Time period shifts
- **Visual**: Display distortions
- **Auditory**: Sound anomalies
- **Cognitive**: Memory alterations

## 📊 Integration Examples

### Fight Result Handler

```typescript
const processFightResult = (result: FightResult) => {
  if (result.knockout) {
    // Trigger dreamworld
    setDreamworldTrigger({
      type: 'knockout',
      fighterName: result.loser.name
    })
  }
}
```

### Manager Stress System

```typescript
const updateManagerStress = (stress: number) => {
  if (stress >= 100) {
    // Mental breakdown triggers dreamworld
    setDreamworldTrigger({
      type: 'breakdown'
    })
  }
}
```

### Legacy Effect Application

```typescript
const applyLegacyEffects = (unlock: LegacyUnlock) => {
  switch (unlock.unlock_type) {
    case 'skill':
      Object.entries(unlock.effect_data).forEach(([stat, value]) => {
        increasePlayerStat(stat, value)
      })
      break
    case 'item':
      addToInventory(unlock.dream_item)
      break
    case 'connection':
      unlockNewOpportunity(unlock.effect_data)
      break
  }
}
```

## 🌟 Best Practices

1. **Optional Experience**: Always provide skip option
2. **Save Progress**: Store dreamworld state in database
3. **Balance Rewards**: Don't make legacy items overpowered
4. **Performance**: Lazy load dreamworld components
5. **Accessibility**: Provide options to reduce visual effects

## 🐛 Troubleshooting

### Common Issues

1. **Styles not loading**: Ensure dreamworld.css is imported
2. **Database errors**: Check migration ran successfully
3. **Component not found**: Verify import paths
4. **Performance issues**: Reduce glitch effect frequency

### Debug Mode

```typescript
// Enable debug logging
const dreamLogicEngine = new DreamLogicEngine({ debug: true })
```

## 📚 API Reference

### DreamworldTrigger Props

```typescript
interface DreamworldTriggerProps {
  playerId: string
  triggerType: 'knockout' | 'breakdown' | 'injury' | null
  fighterName?: string
  onComplete: (legacyUnlocks: LegacyUnlock[]) => void
}
```

### useDreamworld Hook

```typescript
const {
  isInDreamworld,
  playerState,
  talents,
  currentEvent,
  venues,
  legacyUnlocks,
  enterDreamworld,
  exitDreamworld,
  updateLucidMeter,
  generateDreamEvent,
  resolveDreamEvent,
  claimLegacyUnlock,
  changeEra,
  manageTalent
} = useDreamworld()
```

## 🚢 Deployment Checklist

- [ ] Run database migration
- [ ] Import dreamworld styles
- [ ] Add DreamworldTrigger to fight/management screens
- [ ] Test all three trigger types
- [ ] Verify legacy unlocks apply correctly
- [ ] Check performance with glitch effects
- [ ] Test skip functionality
- [ ] Ensure proper error handling

## 🎯 Future Enhancements

1. **Multiplayer Dreams**: Shared dreamworld experiences
2. **Custom Talents**: Player-created historical figures
3. **Dream Tournaments**: Era-specific competitions
4. **Persistent Dreams**: Return to previous dream states
5. **Dream Trading**: Exchange legacy items with other players

## 📞 Support

For questions or issues with the Dreamworld expansion:
1. Check the demo at `/dreamworld-demo`
2. Review this documentation
3. Check the codebase for implementation examples
4. Submit issues with detailed reproduction steps

---

**Remember**: The dreamworld is meant to be a surreal, optional experience that enhances the main game without being required for progression. Keep it mysterious, rewarding, and fun! 🌙✨