# World Glory Management - Integration Plan

## Executive Summary
Transform Glory Boxing Manager into "World Glory Management" - a comprehensive multi-industry management simulation that spans different eras and industries while maintaining the core boxing foundation.

## Core Architecture Changes

### 1. Enhanced Game State Structure
```typescript
// New unified game state structure
interface WorldGloryGameState {
  // Core Boxing Elements (existing)
  fighters: Fighter[]
  matches: Match[]
  venues: Venue[]
  
  // New Multi-Industry Elements
  businessEmpire: BusinessEmpire
  currentEra: HistoricalEra
  availableIndustries: Industry[]
  
  // Enhanced Management Systems
  actorCareer: ActorCareer
  seasonMode: SeasonManager
  dreamLogic: DreamLogicState
  
  // Progressive Unlocking
  unlockedFeatures: UnlockedFeature[]
  eraProgression: EraProgression
}
```

### 2. Multi-Industry Framework
Integrate the following management systems from project-world-management:

#### A. Actor/Entertainment Career Management
- **Location**: `src/components/ActorCareer/`
- **Features**: 
  - Multi-career paths (Movies, Music, Sports, Business, Influencer)
  - Skill trees and training systems
  - Agent relationships and contract negotiations
  - Media presence and reputation management

#### B. Business Empire Management
- **Location**: `src/components/BusinessEmpire/`
- **Features**:
  - Multi-sport expansion system
  - Venue portfolio management
  - Employee hiring and management
  - Partnership negotiations
  - Legacy building

#### C. Era-Based Progression
- **Location**: `src/components/EraProgression/`
- **Features**:
  - Historical era theming and mechanics
  - Technology progression
  - Social and economic changes
  - Era-specific opportunities and challenges

## Integration Strategy

### Phase 1: Core Framework Enhancement (Week 1-2)

#### 1.1 Create New Type Definitions
```bash
# New files to create:
src/types/world-glory.ts        # Unified type system
src/types/business-empire.ts    # Business management types
src/types/career-paths.ts       # Multi-career system types
src/types/era-progression.ts    # Historical progression types
```

#### 1.2 Enhanced Game State Management
```bash
# Enhance existing files:
src/lib/game-state.ts          # Expand to handle multi-industry
src/hooks/useGameState.ts      # Add new state management
src/lib/supabase.ts            # Expand database schema
```

#### 1.3 Database Schema Extensions
```sql
-- New tables to add to Supabase
CREATE TABLE business_empires (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  founded_year INTEGER,
  current_era TEXT,
  reputation INTEGER DEFAULT 50,
  global_reach INTEGER DEFAULT 0
);

CREATE TABLE career_paths (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES auth.users(id),
  career_type TEXT NOT NULL, -- 'actor', 'musician', 'business', etc.
  experience INTEGER DEFAULT 0,
  reputation INTEGER DEFAULT 0,
  wealth BIGINT DEFAULT 0
);

CREATE TABLE era_progression (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES auth.users(id),
  current_era TEXT NOT NULL,
  current_year INTEGER NOT NULL,
  unlocked_features TEXT[],
  dream_logic_awareness INTEGER DEFAULT 0
);
```

### Phase 2: Multi-Industry Components (Week 3-4)

#### 2.1 Actor Career System
Copy and adapt from project-world-management:
```bash
# Copy these components:
src/components/ActorCareerManager.tsx
src/components/mechanics/         # All mechanic components
src/hooks/useActorCareer.ts
src/types/actor.ts
```

**Adaptations needed:**
- Integrate with existing UI theme (Football Manager style)
- Connect to Supabase backend
- Align with Glory Boxing's progression system

#### 2.2 Business Empire Management
```bash
# Copy and adapt:
src/components/BusinessEmpireManager.tsx
src/components/MultiSportExpansion.tsx
src/hooks/useBusinessEmpire.ts
```

**Key Features to Integrate:**
- Start with boxing as the foundation sport
- Gradual expansion into other sports and entertainment
- Venue management system (enhanced from existing venues)
- Employee and partnership systems

#### 2.3 Season Management System
```bash
# Copy and adapt:
src/components/SeasonMode.tsx
src/hooks/useSeasonManager.ts
src/types/season.ts
```

**Integration Points:**
- Connect with existing fight simulation
- Add AI difficulty system based on benchmarks
- Integrate dream logic progression

### Phase 3: Era Progression & Theming (Week 5-6)

#### 3.1 Historical Era System
```bash
# Copy and adapt:
src/components/EraProgression.tsx
src/components/EraTheming.tsx
src/data/historicalData.ts
```

**Implementation:**
- Start in early 20th century boxing era
- Progress through different time periods
- Unlock new industries and technologies over time
- Visual themes change based on era

#### 3.2 Dream Logic Integration
```bash
# Copy unique features:
src/components/DreamLogic/        # All dream logic components
src/hooks/useDreamLogic.ts
```

**Features:**
- Reality awareness system
- Glitch detection mechanics
- Hospital scene progression
- Multiplayer dream sharing (advanced feature)

### Phase 4: Enhanced UI Integration (Week 7-8)

#### 4.1 Navigation System Enhancement
Expand the existing Football Manager-style layout:

```typescript
// Enhanced navigation tabs
const worldGloryTabs = [
  // Existing boxing tabs
  { id: 'fighters', name: 'Fighters', icon: Users },
  { id: 'matches', name: 'Matches', icon: Trophy },
  
  // New multi-industry tabs  
  { id: 'career', name: 'Career Paths', icon: Star },
  { id: 'business', name: 'Business Empire', icon: Building },
  { id: 'expansion', name: 'Industry Expansion', icon: TrendingUp },
  { id: 'season', name: 'Season Mode', icon: Calendar },
  { id: 'legacy', name: 'Legacy & Era', icon: Award }
]
```

#### 4.2 Dashboard Integration
Create a unified dashboard that shows:
- Boxing management (existing)
- Business empire overview
- Career progression across all paths
- Era-specific opportunities
- Dream logic awareness meter

### Phase 5: Advanced Features Integration (Week 9-10)

#### 5.1 AI System Enhancement
Integrate the AI benchmarking system:
```bash
# Copy AI components:
src/ai/                         # Full AI system
src/components/AIBenchmark/     # AI difficulty management
```

#### 5.2 Multiplayer & Social Features
```bash
# Advanced features:
src/components/SharedDreams/    # Dream sharing system
src/components/Multiplayer/     # Multiplayer agency system
```

## File Integration Priority

### High Priority (Core Functionality)
1. `src/types/game.ts` → Merge type definitions
2. `src/components/BusinessEmpireManager.tsx` → Core business management
3. `src/components/ActorCareerManager.tsx` → Multi-career system
4. `src/hooks/useGameState.ts` → Enhanced state management
5. `src/components/MultiSportExpansion.tsx` → Industry expansion

### Medium Priority (Enhanced Experience)
1. `src/components/SeasonMode.tsx` → Season management
2. `src/components/EraProgression.tsx` → Historical progression
3. `src/components/EraTheming.tsx` → Visual theming
4. `src/data/historicalData.ts` → Era-specific data

### Low Priority (Advanced Features)
1. `src/components/DreamLogic/` → Dream logic system
2. `src/ai/` → AI enhancement
3. `src/components/SharedDreams/` → Social features

## Integration Checklist

### Technical Requirements
- [ ] Merge type definitions from both projects
- [ ] Expand Supabase schema for new features
- [ ] Update existing components to handle multi-industry
- [ ] Create unified navigation system
- [ ] Implement era-based progression
- [ ] Integrate AI difficulty system

### Content Requirements
- [ ] Historical data for different eras
- [ ] Industry-specific mechanics and rules
- [ ] Career progression trees
- [ ] Era-appropriate UI themes
- [ ] Dream logic narrative content

### Testing Requirements
- [ ] Cross-industry feature compatibility
- [ ] Era progression testing
- [ ] Multi-career path validation
- [ ] Dream logic trigger testing
- [ ] AI benchmark integration

## Expected Outcome

**World Glory Management** will become a comprehensive management simulation that:

1. **Starts with Boxing** - Players begin as boxing promoters (existing functionality)
2. **Expands Across Industries** - Gradually unlock entertainment, sports, and business opportunities
3. **Progresses Through Eras** - Experience different time periods with unique challenges and opportunities
4. **Builds Legacy** - Create a lasting impact across multiple industries and generations
5. **Incorporates Dream Logic** - Unique narrative elements that question the nature of reality
6. **Offers Multiple Career Paths** - Manage fighters, actors, musicians, athletes, and business ventures
7. **Features Advanced AI** - Sophisticated opponent AI with configurable difficulty
8. **Supports Season Play** - Structured gameplay with goals and progression

The result will be a unique, genre-defining management simulation that combines the depth of Football Manager with the narrative innovation of games like The Stanley Parable, all wrapped in a historically-aware, multi-industry framework.
