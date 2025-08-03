# 🗄️ Dreamworld Tables Guide

## Overview

Three core Supabase tables power the Dreamworld expansion system. This guide covers their structure, usage, and integration patterns.

## 📊 Table Structures

### 1. **dreamworld_talents**
Stores historical entertainment figures with era-specific attributes.

```sql
CREATE TABLE dreamworld_talents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  dream_era TEXT NOT NULL,
  career_path TEXT NOT NULL,
  era_specific_skills JSONB DEFAULT '{}',
  dream_anomaly TEXT,
  lucid_events JSONB DEFAULT '[]',
  real_world_link UUID,
  notoriety INTEGER DEFAULT 0,
  current_location TEXT,
  relationships JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Fields:**
- `era_specific_skills`: JSON object with skill ratings (0-100)
  ```json
  {
    "trumpet": 95,
    "vocals": 88,
    "charisma": 92
  }
  ```
- `relationships`: Maps talent IDs to relationship types
  ```json
  {
    "uuid-1": "rival",
    "uuid-2": "mentor",
    "uuid-3": "friend"
  }
  ```
- `lucid_events`: Array of significant dream events
- `real_world_link`: Optional UUID linking to main game entities

### 2. **dream_events**
Tracks dream occurrences and their narrative impact.

```sql
CREATE TABLE dream_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL,
  dream_type TEXT NOT NULL CHECK (dream_type IN ('prophecy', 'warning', 'inspiration', 'nightmare', 'vision')),
  content TEXT NOT NULL,
  impact_score INTEGER DEFAULT 0,
  actionable_insight TEXT,
  career_path TEXT,
  triggered_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Dream Types:**
- `prophecy`: Future visions with high impact
- `warning`: Danger alerts requiring action
- `inspiration`: Creative breakthroughs
- `nightmare`: Fear manifestations
- `vision`: Timeline glimpses

### 3. **dreamworld_player_state**
Maintains player progress and current dreamworld status.

```sql
CREATE TABLE dreamworld_player_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL,
  current_era TEXT NOT NULL,
  lucid_meter INTEGER DEFAULT 50,
  dream_level INTEGER DEFAULT 1,
  wellness_meter INTEGER DEFAULT 50,
  reality_glitches JSONB DEFAULT '[]',
  current_location TEXT,
  return_conditions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Important Fields:**
- `reality_glitches`: Array of anomalies
  ```json
  [
    {
      "type": "temporal",
      "severity": 30,
      "description": "Time shifted unexpectedly",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
  ```
- `return_conditions`: Wake-up triggers
  ```json
  {
    "lucid_meter_zero": true,
    "max_dream_level": 10,
    "critical_wellness": 10
  }
  ```

## 🚀 Running Migrations

### Step 1: Create Tables
```bash
# Run the main migration
supabase migration up 009_dreamworld_core_tables_clean.sql

# Or apply directly via Supabase dashboard
```

### Step 2: Add Sample Data (Optional)
```bash
# Run sample data migration
supabase migration up 010_dreamworld_sample_data.sql
```

## 💻 Usage Examples

### JavaScript/TypeScript Integration

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(url, key)

// Fetch talents for current era
const getTalentsByEra = async (era: string) => {
  const { data, error } = await supabase
    .from('dreamworld_talents')
    .select('*')
    .eq('dream_era', era)
    .order('notoriety', { ascending: false })
  
  return data
}

// Create a dream event
const createDreamEvent = async (playerId: string, eventData: any) => {
  const { data, error } = await supabase
    .from('dream_events')
    .insert({
      player_id: playerId,
      dream_type: eventData.type,
      content: eventData.content,
      impact_score: eventData.impact,
      actionable_insight: eventData.insight,
      career_path: eventData.career
    })
    .select()
    .single()
  
  return data
}

// Update player's lucid meter
const updateLucidMeter = async (playerId: string, newValue: number) => {
  const { data, error } = await supabase
    .from('dreamworld_player_state')
    .update({ lucid_meter: newValue })
    .eq('player_id', playerId)
  
  return data
}
```

### SQL Queries

```sql
-- Find high-notoriety talents in current era
SELECT * FROM dreamworld_talents 
WHERE dream_era = '1920s' 
AND notoriety > 80
ORDER BY notoriety DESC;

-- Get player's recent prophecies
SELECT * FROM dream_events
WHERE player_id = 'uuid-here'
AND dream_type = 'prophecy'
AND impact_score > 70
ORDER BY triggered_at DESC
LIMIT 5;

-- Check if player should wake up
SELECT * FROM dreamworld_player_state
WHERE player_id = 'uuid-here'
AND (lucid_meter <= 0 OR wellness_meter <= 10 OR dream_level >= 10);

-- Find talents with specific skills
SELECT * FROM dreamworld_talents
WHERE era_specific_skills->>'jazz_vocals' > '90';

-- Update talent relationships
UPDATE dreamworld_talents
SET relationships = relationships || '{"new-uuid": "ally"}'::jsonb
WHERE id = 'talent-uuid';
```

## 🔗 Integration Patterns

### 1. Talent Recruitment Flow
```typescript
async function recruitTalent(playerId: string, talentId: string) {
  // Check player's lucid meter
  const { data: playerState } = await supabase
    .from('dreamworld_player_state')
    .select('lucid_meter')
    .eq('player_id', playerId)
    .single()
  
  if (playerState.lucid_meter < 20) {
    throw new Error('Not enough lucid energy')
  }
  
  // Deduct lucid energy
  await supabase
    .from('dreamworld_player_state')
    .update({ lucid_meter: playerState.lucid_meter - 20 })
    .eq('player_id', playerId)
  
  // Create recruitment event
  await supabase
    .from('dream_events')
    .insert({
      player_id: playerId,
      dream_type: 'inspiration',
      content: `You've recruited a legendary talent!`,
      impact_score: 60
    })
}
```

### 2. Reality Glitch System
```typescript
async function addRealityGlitch(playerId: string, glitch: any) {
  // Get current glitches
  const { data: state } = await supabase
    .from('dreamworld_player_state')
    .select('reality_glitches')
    .eq('player_id', playerId)
    .single()
  
  // Add new glitch
  const updatedGlitches = [
    ...state.reality_glitches,
    {
      ...glitch,
      timestamp: new Date().toISOString()
    }
  ]
  
  // Update state
  await supabase
    .from('dreamworld_player_state')
    .update({ reality_glitches: updatedGlitches })
    .eq('player_id', playerId)
}
```

### 3. Era Progression
```typescript
async function progressEra(playerId: string) {
  const eras = ['1920s', '1930s', '1940s', '1950s']
  
  // Get current state
  const { data: state } = await supabase
    .from('dreamworld_player_state')
    .select('current_era, dream_level')
    .eq('player_id', playerId)
    .single()
  
  const currentIndex = eras.indexOf(state.current_era)
  if (currentIndex < eras.length - 1) {
    // Progress to next era
    await supabase
      .from('dreamworld_player_state')
      .update({
        current_era: eras[currentIndex + 1],
        dream_level: state.dream_level + 1
      })
      .eq('player_id', playerId)
  }
}
```

## 🎯 Best Practices

1. **JSONB Usage**
   - Use JSONB operators for efficient queries
   - Index frequently queried JSONB fields
   - Keep structures consistent

2. **Performance**
   - Create indexes on foreign keys
   - Use `select()` to limit returned fields
   - Batch updates when possible

3. **Data Integrity**
   - Use constraints for valid ranges
   - Enforce unique player states
   - Validate dream types

4. **Security**
   - Use Row Level Security (RLS)
   - Validate player ownership
   - Sanitize JSONB inputs

## 📈 Monitoring Queries

```sql
-- Player activity overview
SELECT 
  dps.current_era,
  dps.dream_level,
  dps.lucid_meter,
  COUNT(de.id) as total_events,
  AVG(de.impact_score) as avg_impact
FROM dreamworld_player_state dps
LEFT JOIN dream_events de ON de.player_id = dps.player_id
GROUP BY dps.id;

-- Popular talents by era
SELECT 
  dream_era,
  COUNT(*) as talent_count,
  AVG(notoriety) as avg_notoriety
FROM dreamworld_talents
GROUP BY dream_era
ORDER BY dream_era;

-- High-impact events analysis
SELECT 
  dream_type,
  COUNT(*) as event_count,
  AVG(impact_score) as avg_impact,
  MAX(impact_score) as max_impact
FROM dream_events
GROUP BY dream_type
ORDER BY avg_impact DESC;
```

---

These tables provide a robust foundation for the Dreamworld expansion, supporting complex game mechanics while maintaining clean data structures and efficient queries!