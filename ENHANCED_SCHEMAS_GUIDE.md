# Enhanced Schemas Guide - Sports Commentary AI

This guide covers the enhanced event schemas and fighter metadata extensions that provide deeper context and personalization for sports commentary AI.

## Overview

The enhanced schemas introduce comprehensive event types, detailed fighter metadata, environmental context, and sponsor integration to create more engaging and realistic commentary.

## 1. Enhanced Event Schema

### New Event Types

The enhanced schema supports 15 event types, including both combat and non-combat events:

#### Combat Events
- `punch` - Various punch types and locations
- `block` - Defensive blocks and parries
- `dodge` - Evasive maneuvers
- `knockdown` - Different knockdown types
- `cut` - Injury locations
- `foul` - Various rule violations

#### Non-Combat Events
- `clinch` - Grappling situations
- `slip` - Defensive/offensive slips
- `warning` - Referee warnings
- `timeout` - Fight interruptions
- `doctor_check` - Medical assessments
- `referee_action` - Official interventions
- `corner_advice` - Between-round coaching
- `round_end` - Scoring and analysis
- `fight_end` - Final result

### Event Details Structure

```typescript
interface FightEvent {
  id: string;
  timestamp: number;
  round: number;
  eventType: EventType;
  fighter: 'fighter_a' | 'fighter_b';
  details: {
    // Combat details
    punchType?: 'jab' | 'cross' | 'hook' | 'uppercut' | 'body' | 'head' | 'overhand' | 'straight';
    punchLocation?: 'head' | 'body' | 'arms' | 'legs' | 'ribs' | 'liver' | 'chin';
    damageLevel?: 'light' | 'medium' | 'heavy' | 'critical' | 'devastating';
    accuracy?: number; // 0-100
    power?: number; // 0-100
    
    // Non-combat details
    clinchType?: 'defensive' | 'offensive' | 'break' | 'dirty_boxing';
    warningType?: 'verbal' | 'point_deduction' | 'disqualification';
    doctorCheckReason?: 'cut' | 'swelling' | 'concussion' | 'injury';
    
    // Scoring and context
    roundScore?: JudgeScores;
    crowdReaction?: 'cheer' | 'boo' | 'silence' | 'roar' | 'gasp' | 'applause';
    significance?: 'routine' | 'notable' | 'significant' | 'decisive' | 'historic';
    mediaUrl?: string; // For highlights
    liveMetadata?: LiveStreamData;
  };
}
```

### Usage Example

```typescript
import { generateSampleEvent } from './sampleData';

const knockdownEvent = generateSampleEvent(
  'event-1',
  120,
  2,
  'knockdown',
  'fighter_a',
  {
    knockdownType: 'heavy',
    crowdReaction: 'roar',
    significance: 'decisive',
    mediaUrl: 'knockdown-replay.mp4',
  }
);
```

## 2. Extended Fighter Metadata

### Fighter Record Structure

```typescript
interface FighterRecord {
  wins: number;
  losses: number;
  draws: number;
  noContests?: number;
  knockouts?: number;
  submissions?: number;
  decisions?: number;
}
```

### Fighter Stats System

Comprehensive rating system (1-100 scale):

```typescript
interface FighterStats {
  staminaRating: number;    // Endurance and conditioning
  powerRating: number;      // Punching power
  speedRating: number;      // Hand and foot speed
  techniqueRating: number;  // Technical skill
  chinRating: number;       // Ability to take punches
  footworkRating: number;   // Movement and positioning
  iqRating: number;         // Fight intelligence
}
```

### Complete Fighter Profile

```typescript
interface FighterMetadata {
  id: string;
  name: string;
  nickname?: string;
  record: FighterRecord;
  weightClass: string;
  height: string;
  reach: string;
  age?: number;
  nationality?: string;
  hometown?: string;
  gym?: string;
  trainer?: string;
  stats: FighterStats;
  favoredByBetting?: number; // Decimal odds
  ranking?: number;
  titleHolder?: boolean;
  titleType?: string;
  previousFights?: FightHistory[];
  strengths: string[];
  weaknesses: string[];
  fightingStyle: string;
  signatureMoves?: string[];
  injuryHistory?: InjuryRecord[];
}
```

### Sample Fighter Data

```typescript
const mikeTyson: FighterMetadata = {
  id: 'fighter-001',
  name: 'Mike "Iron" Tyson',
  nickname: 'Iron Mike',
  record: {
    wins: 50,
    losses: 6,
    draws: 0,
    knockouts: 44,
  },
  weightClass: 'Heavyweight',
  height: "5'10\"",
  reach: '71in',
  stats: {
    staminaRating: 85,
    powerRating: 95,
    speedRating: 88,
    techniqueRating: 75,
    chinRating: 80,
    footworkRating: 70,
    iqRating: 82,
  },
  favoredByBetting: 1.8,
  strengths: ['Devastating power', 'Aggressive style', 'Intimidation factor'],
  weaknesses: ['Susceptible to body shots', 'Can be outboxed'],
  fightingStyle: 'Peek-a-boo with devastating power',
  signatureMoves: ['Peek-a-boo defense', 'Devastating hooks'],
};
```

## 3. Environmental Context

### Ringside Statistics

```typescript
interface RingsideStats {
  temperature: number;      // Celsius
  humidity: number;         // Percentage
  venueCapacity: number;
  attendance: number;
  altitude?: number;        // For high-altitude venues
  airQuality?: number;      // AQI
  lighting?: 'bright' | 'dim' | 'spotlight';
  ringSize?: 'standard' | 'large' | 'small';
}
```

### Pre-Fight Context

```typescript
interface PreFightContext {
  preFightComments: {
    fighterA: string;
    fighterB: string;
  };
  pressConferenceHighlights?: string[];
  weighInResults?: {
    fighterA: number;
    fighterB: number;
  };
  staredownIntensity?: 'calm' | 'tense' | 'hostile';
  bettingOdds?: {
    fighterA: number;
    fighterB: number;
    draw?: number;
  };
  expertPredictions?: ExpertPrediction[];
}
```

## 4. Sponsor Integration

### Sponsor Context

```typescript
interface SponsorContext {
  sponsorMentions: string[];
  sponsorLogos?: string[];
  commercialBreaks?: CommercialBreak[];
  brandedContent?: BrandedContent[];
}
```

### Commercial Integration

```typescript
interface CommercialBreak {
  time: number;           // Seconds into fight
  sponsor: string;
  duration: number;       // Seconds
}

interface BrandedContent {
  type: 'replay' | 'statistic' | 'highlight';
  sponsor: string;
  content: string;
}
```

## 5. Enhanced Commentary Engine

### Commentary Styles

```typescript
interface CommentaryStyle {
  tone: 'technical' | 'dramatic' | 'casual' | 'analytical' | 'entertaining';
  detailLevel: 'basic' | 'detailed' | 'expert';
  includeStats: boolean;
  includeBettingOdds: boolean;
  includeSponsorMentions: boolean;
  includeEnvironmentalContext: boolean;
}
```

### Usage Example

```typescript
import { EnhancedCommentaryEngine } from './enhancedEngine';
import { sampleEnhancedFightData } from './sampleData';

const engine = new EnhancedCommentaryEngine({
  tone: 'dramatic',
  detailLevel: 'expert',
  includeStats: true,
  includeBettingOdds: true,
  includeSponsorMentions: true,
  includeEnvironmentalContext: true,
});

const commentary = await engine.generateCommentary(sampleEnhancedFightData);
```

## 6. API Integration

### Generate Full Commentary

```typescript
// POST /api/commentary
const response = await fetch('/api/commentary', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fightData: enhancedFightData,
    style: 'dramatic',
    detailLevel: 'expert',
    includeStats: true,
    includeBettingOdds: true,
  }),
});

const { commentary, metadata } = await response.json();
```

### Real-Time Event Commentary

```typescript
// PUT /api/commentary/event
const eventCommentary = await fetch('/api/commentary/event', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: knockdownEvent,
    fightData: enhancedFightData,
    style: 'dramatic',
  }),
});
```

## 7. Validation and Error Handling

### Event Validation

```typescript
import { validateFightEvent } from './schemas';

const validation = validateFightEvent(event);
if (!validation.valid) {
  console.error('Event validation failed:', validation.errors);
}
```

### Fighter Validation

```typescript
import { validateFighterMetadata } from './schemas';

const validation = validateFighterMetadata(fighter);
if (!validation.valid) {
  console.error('Fighter validation failed:', validation.errors);
}
```

## 8. Sample Data Generation

### Create Realistic Fight Data

```typescript
import { createRealisticFightData } from './sampleData';

const fightData = createRealisticFightData(
  mikeTyson,
  evanderHolyfield,
  'Tyson vs Holyfield II',
  'MGM Grand Garden Arena'
);
```

### Generate Sample Events

```typescript
import { generateSampleRound } from './sampleData';

const round1Events = generateSampleRound(1, 0, [
  {
    eventType: 'punch',
    fighter: 'fighter_a',
    details: {
      punchType: 'jab',
      punchLocation: 'head',
      accuracy: 75,
      power: 60,
    },
  },
  {
    eventType: 'punch',
    fighter: 'fighter_b',
    details: {
      punchType: 'cross',
      punchLocation: 'body',
      accuracy: 85,
      power: 70,
    },
  },
]);
```

## 9. Benefits of Enhanced Schemas

### 1. **Rich Context**
- Detailed fighter profiles enable personalized commentary
- Environmental factors add realism
- Historical context improves narrative depth

### 2. **Flexible Event System**
- 15 event types cover all fight scenarios
- Non-combat events add realism
- Scoring integration provides analysis

### 3. **Commercial Integration**
- Sponsor mentions for revenue
- Branded content opportunities
- Commercial break management

### 4. **Analytics and Insights**
- Detailed performance metrics
- Crowd reaction tracking
- Significance levels for highlights

### 5. **Live Streaming Support**
- Real-time event commentary
- Network-specific metadata
- Live audience engagement

## 10. Implementation Checklist

- [ ] Install enhanced schemas package
- [ ] Set up fighter database with extended metadata
- [ ] Configure environmental monitoring
- [ ] Integrate sponsor management system
- [ ] Implement real-time event tracking
- [ ] Set up validation middleware
- [ ] Configure commentary style options
- [ ] Test with sample data
- [ ] Deploy API endpoints
- [ ] Monitor performance and analytics

## 11. Performance Considerations

### Data Size Optimization
- Use efficient data structures
- Implement lazy loading for large datasets
- Cache frequently accessed fighter data

### Real-Time Processing
- Optimize event validation
- Use efficient algorithms for context building
- Implement rate limiting for API endpoints

### Memory Management
- Clean up event objects after processing
- Use streaming for large fight datasets
- Implement garbage collection for temporary data

This enhanced schema system provides a comprehensive foundation for creating engaging, realistic, and personalized sports commentary that can adapt to different audiences and contexts. 