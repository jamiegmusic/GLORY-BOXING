// Dreamworld Types

export type DreamEra = '1920s' | '1930s' | '1940s' | '1950s';
export type CareerPath = 'actor' | 'singer' | 'boxer' | 'sports' | 'management' | 'mogul';
export type DreamType = 'prophecy' | 'warning' | 'inspiration' | 'nightmare' | 'vision' | 'memory';
export type TalentStatus = 'active' | 'retired' | 'deceased' | 'vanished';
export type VenueType = 'club' | 'theater' | 'arena' | 'studio' | 'office';
export type ContractType = 'performance' | 'recording' | 'fight' | 'management' | 'exclusive';
export type UnlockType = 'skill' | 'item' | 'connection' | 'knowledge' | 'bonus';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface EraSpecificSkills {
  [key: string]: number;
}

export interface DreamworldTalent {
  id: string;
  name: string;
  dream_era: DreamEra;
  career_path: CareerPath;
  era_specific_skills: EraSpecificSkills;
  dream_anomaly?: string;
  lucid_events: any[];
  real_world_link?: string;
  notoriety: number;
  current_location: string;
  relationships: Record<string, any>;
  status: TalentStatus;
  created_at: string;
  updated_at: string;
}

export interface DreamChoice {
  label: string;
  effect: string;
  lucidCost?: number;
  requirements?: {
    lucidMeter?: number;
    dreamLevel?: number;
    skills?: Record<string, number>;
  };
}

export interface DreamEvent {
  id: string;
  player_id: string;
  dream_type: DreamType;
  content: string;
  impact_score: number;
  actionable_insight?: string;
  career_path?: CareerPath;
  era: DreamEra;
  choices: DreamChoice[];
  chosen_option?: string;
  outcome?: Record<string, any>;
  triggered_at: string;
  resolved_at?: string;
}

export interface RealityGlitch {
  id: string;
  type: 'temporal' | 'visual' | 'auditory' | 'cognitive';
  description: string;
  severity: number;
  timestamp: string;
}

export interface ReturnCondition {
  type: 'lucidMeter' | 'dreamLevel' | 'event' | 'time';
  threshold: number | string;
  description: string;
}

export interface DreamworldPlayerState {
  id: string;
  player_id: string;
  current_era: DreamEra;
  lucid_meter: number;
  dream_level: number;
  wellness_meter: number;
  reality_glitches: RealityGlitch[];
  current_location: string;
  return_conditions: ReturnCondition[];
  dream_talents: string[];
  dream_currency: number;
  reputation_points: number;
  created_at: string;
  updated_at: string;
}

export interface LegacyUnlock {
  id: string;
  player_id: string;
  dream_item: string;
  unlock_type: UnlockType;
  description?: string;
  effect_data: Record<string, any>;
  rarity: Rarity;
  unlock_date: string;
  claimed: boolean;
  claimed_date?: string;
}

export interface DreamworldVenue {
  id: string;
  name: string;
  era: DreamEra;
  venue_type: VenueType;
  location: string;
  capacity: number;
  prestige_level: number;
  special_features: string[];
  created_at: string;
}

export interface DreamworldContract {
  id: string;
  talent_id: string;
  player_id: string;
  contract_type: ContractType;
  terms: Record<string, any>;
  era_value: number;
  duration_weeks: number;
  status: 'pending' | 'active' | 'completed' | 'broken';
  signed_at?: string;
  expires_at?: string;
  created_at: string;
}

// UI State Types
export interface DreamworldUIState {
  isInDreamworld: boolean;
  showDreamTransition: boolean;
  currentView: 'dashboard' | 'talents' | 'events' | 'venues' | 'contracts' | 'legacy';
  selectedTalent?: DreamworldTalent;
  activeEvent?: DreamEvent;
  showLucidMeterWarning: boolean;
  timelinePosition: number; // 0-100 for timeline slider
}