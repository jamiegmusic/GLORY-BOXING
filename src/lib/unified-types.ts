// Unified TypeScript Types for Glory Boxing Manager
// Comprehensive type definitions supporting all enhanced features

import { createClient } from '@supabase/supabase-js'

// Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Enhanced Fighter Types
export interface Fighter {
  id: string
  name: string
  nickname?: string
  age: number
  weight_class: string
  nationality?: string
  hometown?: string
  
  // Physical Attributes
  height_cm?: number
  height?: string
  reach_cm?: number
  reach?: string
  stance: 'orthodox' | 'southpaw' | 'switch'
  
  // Enhanced Boxing Stats (1-100 scale)
  punching_power: number
  speed: number
  defense: number
  stamina: number
  chin: number
  heart: number
  ring_iq: number
  adaptability: number
  mental_toughness: number
  recovery_time: number
  experience: number
  morale: number
  
  // Additional Stats (for combat engine)
  power?: number
  accuracy?: number
  
  // Career Information
  record_wins: number
  record_losses: number
  record_draws: number
  knockouts: number
  total_rounds_fought: number
  career_stage: 'amateur' | 'prospect' | 'contender' | 'champion' | 'legend' | 'retired'
  career_earnings: number
  current_contract_value: number
  ko_percentage?: number
  
  // Record string for display
  record?: string
  
  // Popularity & Marketability
  popularity?: number
  ranking?: number
  region?: string
  
  // Health & Performance
  injury_status: string
  cumulative_damage: Record<string, any>
  health_risk_assessment: number
  concussion_protocol_active: boolean
  injuries?: Injury[]
  last_fight?: string
  
  // AI-Generated Content
  ai_portrait_url?: string
  ai_voice_profile?: VoiceProfile
  ai_lore_background?: string
  ai_personality_traits?: PersonalityTraits
  
  // Real-World Integration
  real_world_ranking?: number
  real_world_record?: string
  licensing_status?: string
  official_fighter_id?: string
  
  // Status
  is_injured: boolean
  injury_type?: string
  injury_severity: number
  injury_recovery_weeks: number
  is_available: boolean
  
  // Training & Development
  current_training_focus?: string
  skill_improvement_rate: number
  last_training_date: string
  
  // Relationships
  trainer_id?: string
  promoter_id?: string
  manager_id?: string
  
  // Additional properties for real-world integration
  last_updated?: string
  
  created_at: string
  updated_at: string
}

// AI Content Types
export interface VoiceProfile {
  voice_id: string
  voice_name: string
  accent: string
  language: string
  voice_characteristics: string[]
  sample_audio_url?: string
}

export interface PersonalityTraits {
  confidence: number
  aggression: number
  discipline: number
  charisma: number
  loyalty: number
  ambition: number
  temperament: string
  media_savvy: number
}

export interface AIGeneratedContent {
  id: string
  fighter_id: string
  content_type: 'portrait' | 'voice' | 'lore' | 'personality' | 'commentary'
  content_data: Record<string, any>
  generation_prompt?: string
  ai_model_used: string
  generation_cost: number
  quality_score: number
  is_approved: boolean
  created_at: string
}

// Enhanced Match Types
export interface Match {
  id: string
  fighter_a_id?: string
  fighter_b_id?: string
  fighter_a_name: string
  fighter_b_name: string
  venue_name: string
  venue_location?: string
  match_date: string
  result?: string
  winner_id?: string
  loser_id?: string
  method?: 'decision' | 'ko' | 'tko' | 'draw' | 'no_contest' | 'dqd'
  rounds: number
  title_bout: boolean
  belt?: string
  status: 'scheduled' | 'in_progress' | 'completed'
  
  // Enhanced Fight Data
  round_by_round_data?: RoundData[]
  punch_statistics?: PunchStats
  knockdowns?: Knockdown[]
  referee_decisions?: RefereeDecision[]
  ai_commentary?: CommentaryLine[]
  
  // Financial Data
  gate_receipts?: number
  ppv_buys?: number
  total_revenue?: number
  
  // Ratings & Reactions
  fight_rating?: number
  crowd_reaction?: number
  media_coverage_rating?: number
  
  // Additional properties for enhanced functionality
  venue?: Venue
  officials?: string[]
  
  created_at: string
  updated_at: string
}

export interface RoundData {
  round_number: number
  fighter_a_score: number
  fighter_b_score: number
  fighter_a_punches: number
  fighter_b_punches: number
  fighter_a_power_shots: number
  fighter_b_power_shots: number
  knockdowns: string[] | KnockdownEvent[]
  round_winner: 'A' | 'B' | 'EVEN'
  round_notes: string[]
  
  // Additional properties for enhanced combat engine
  round?: number
  events?: any[]
  punchStats?: PunchStats
  analysis?: string
  commentary?: string
  duration?: number
}

export interface PunchStats {
  fighter_a_total_punches: number
  fighter_b_total_punches: number
  fighter_a_accuracy: number
  fighter_b_accuracy: number
  fighter_a_power_punches: number
  fighter_b_power_punches: number
  fighter_a_jabs: number
  fighter_b_jabs: number
  
  // Additional properties for enhanced combat engine
  fighterA?: {
    thrown: number
    landed: number
    power: number
  }
  fighterB?: {
    thrown: number
    landed: number
    power: number
  }
  
  // Required properties for combat engine compatibility
  totalPunches?: {
    fighterA: number
    fighterB: number
  }
  totalLanded?: {
    fighterA: number
    fighterB: number
  }
  totalPower?: {
    fighterA: number
    fighterB: number
  }
  knockdowns?: {
    fighterA: number
    fighterB: number
  }
}

export interface Knockdown {
  round: number
  time_in_round: string
  fighter_knocked_down: 'A' | 'B'
  knockdown_type: 'flash' | 'heavy' | 'technical'
  recovery_time: number
}

export interface KnockdownEvent {
  fighter: string
  round: number
  time: string
  type: 'flash' | 'heavy' | 'technical' | 'knockdown'
  recovery_time: number
  timeInRound?: string
}

export interface RefereeDecision {
  round: number
  decision_type: 'point_deduction' | 'warning' | 'disqualification'
  fighter_affected: 'A' | 'B' | 'both'
  reason: string
}

export interface CommentaryLine {
  round?: number
  timestamp: string
  commentator: string
  line: string
  emotion: 'excited' | 'calm' | 'surprised' | 'analytical'
  importance: number
}

// Enhanced Rankings Types
export interface Ranking {
  id: string
  fighter_id: string
  fighter_name: string
  weight_class: string
  rank_position: number
  points: number
  previous_rank?: number
  movement?: 'up' | 'down' | 'new' | 'unchanged'
  last_fight?: string
  win_streak: number
  quality_wins: number
  last_fight_date?: string
  activity_score: number
  
  // Real-World Integration
  real_world_ranking?: number
  real_world_points?: number
  organization?: string
  
  created_at: string
  updated_at: string
}

// Enhanced Titles Types
export interface Title {
  id: string
  organization: string
  weight_class: string
  champion_id?: string
  champion_name?: string
  date_won?: string
  defenses: number
  mandatory_challenger_id?: string
  mandatory_challenger_name?: string
  mandatory_due_date?: string
  status: 'active' | 'vacant' | 'interim'
  title_history: TitleHistory[]
  created_at: string
  updated_at: string
}

export interface TitleHistory {
  champion_name: string
  date_won: string
  date_lost?: string
  defenses: number
  reason?: string
}

// Press Conference Types
export interface PressConference {
  id: string
  match_id: string
  event_name: string
  conference_date: string
  participants: string[]
  highlights: string[]
  controversies: string[]
  ai_generated_quotes: Quote[]
  media_reactions: MediaReaction[]
  public_sentiment_score?: number
  created_at: string
}

export interface Quote {
  id: string
  fighter_name: string
  quote_text: string
  emotion: string
  impact_score: number
  media_reaction: string
}

export interface MediaReaction {
  outlet: string
  headline: string
  sentiment: 'positive' | 'negative' | 'neutral'
  viral_potential: number
}

export interface PressQuestion {
  id: string
  press_conference_id: string
  question: string
  target?: string
  category?: string
  importance: number
  journalist?: string
  created_at: string
}

// Venue Types
export interface Venue {
  id: string
  name: string
  location?: string
  capacity?: number
  venue_tier: 'small_club' | 'medium_arena' | 'large_stadium' | 'premium_venue'
  base_rental_cost?: number
  revenue_split?: number
  amenities?: string[]
  coordinates?: { lat: number; lng: number }
  region?: string
  created_at: string
}

// Promoter Types
export interface Promoter {
  id: string
  name: string
  organization?: string
  reputation: number
  financial_strength: number
  network_connections: number
  negotiation_style?: string
  created_at: string
}

// Scout Types
export interface Scout {
  id: string
  name: string
  expertise_regions: string[]
  success_rate: number
  network_quality: number
  evaluation_accuracy: number
  created_at: string
}

export interface ScoutingReport {
  id: string
  scout_id: string
  fighter_id: string
  potential_rating: number
  risk_assessment: number
  market_value_estimate?: number
  notes?: string
  created_at: string
}

// Enhanced Contract Types
export interface Contract {
  id: string
  fighter_id: string
  promoter_id?: string
  contract_type: 'amateur' | 'pro_debut' | 'development' | 'championship' | 'super_fight' | 'retirement'
  
  // Financial Terms
  base_purse: number
  win_bonus: number
  knockout_bonus: number
  ppv_percentage: number
  sponsorship_split: number
  
  // Additional Financial Terms
  base_salary?: number
  performance_bonuses?: PerformanceBonus[]
  
  // Contract Details
  start_date: string
  end_date?: string
  fights_committed: number
  fights_completed: number
  contract_value?: number
  duration_months?: number
  fights_per_year?: number
  
  // Contract Type
  type?: string
  
  // Negotiation Terms
  negotiation_difficulty: number
  fighter_satisfaction: number
  promoter_satisfaction: number
  
  // AI Negotiation
  ai_negotiation_data?: Record<string, any>
  negotiation_rounds: number
  final_agreement_terms?: Record<string, any>
  
  // Status
  is_active: boolean
  is_exclusive: boolean
  termination_clause?: string
  
  created_at: string
  updated_at: string
}

export interface PerformanceBonus {
  type: string
  amount: number
  conditions: string[]
}

// Rivalry Types
export interface Rivalry {
  id: string
  fighter1_id: string
  fighter2_id: string
  rivalry_type: 'personal' | 'professional' | 'territorial' | 'championship'
  intensity: number
  start_date: string
  is_active: boolean
  description?: string
  public_interest: number
  media_coverage_level: number
  created_at: string
}

// Health Monitoring Types
export interface HealthMonitoring {
  id: string
  fighter_id: string
  assessment_date: string
  overall_health_score: number
  concussion_risk: number
  cumulative_damage_assessment: Record<string, any>
  recommended_recovery_time?: number
  medical_clearance_status?: string
  notes?: string
  created_at: string
}

// International Rankings Types
export interface InternationalRanking {
  id: string
  fighter_id: string
  country: string
  regional_ranking?: number
  international_points?: number
  regional_organization?: string
  created_at: string
  
  // Additional properties for real-world rankings
  fighter_name?: string
  weight_class?: string
  organization?: string
  rank?: number
  record?: string
  points?: number
  movement?: 'up' | 'down' | 'unchanged'
  last_fight?: string
  next_fight?: string
  verified?: boolean
  source?: string
  last_updated?: string
}

// Official Records Types
export interface OfficialRecord {
  id: string
  fighter_id: string
  organization: string
  official_record?: string
  verification_status?: string
  last_verified_date?: string
  fighter_name?: string
  weight_class?: string
  record?: string
  created_at: string
}

// Analytics Types
export interface AnalyticsEvent {
  id: string
  event_type: string
  user_id?: string
  fighter_id?: string
  event_data: Record<string, any>
  timestamp: string
}

export interface PerformanceMetric {
  id: string
  metric_name: string
  metric_value?: number
  metric_unit?: string
  fighter_id?: string
  match_id?: string
  recorded_at: string
}

// Real-Time Event Types
export interface RealTimeEvent {
  id: string
  event_type: string
  event_data: Record<string, any>
  affected_entities?: Record<string, any>
  priority: number
  is_processed: boolean
  processing_result?: Record<string, any>
  created_at: string
}

// Game State Types
export interface GameState {
  id: string
  player_name: string
  current_date: string
  game_week: number
  total_money: number
  reputation: number
  experience_points: number
  level: number
  
  // Game Progression
  current_period?: number
  
  // Financial Data
  total_revenue?: number
  total_expenses?: number
  previous_period_revenue?: number
  sponsorship_revenue?: number
  ticket_revenue?: number
  ppv_revenue?: number
  merchandise_revenue?: number
  
  created_at: string
  updated_at: string
}

// Training Camp Types
export interface TrainingCamp {
  id: string
  fighter_id: string
  camp_name?: string
  start_date: string
  end_date?: string
  duration_weeks: number
  
  // Camp Focus Areas
  focus_punching_power: boolean
  focus_speed: boolean
  focus_defense: boolean
  focus_stamina: boolean
  focus_ring_iq: boolean
  
  // Camp Quality
  camp_quality: number
  sparring_partners_quality: number
  nutrition_quality: number
  gym_atmosphere: number
  
  // Costs
  total_cost: number
  daily_cost: number
  
  // Staff
  head_trainer?: string
  nutritionist_hired: boolean
  strength_coach_hired: boolean
  cutman_hired: boolean
  
  // Results
  skill_gains?: Record<string, any>
  camp_success_rating?: number
  notes?: string
  
  created_at: string
}

// Injury Types
export interface Injury {
  id: string
  fighter_id: string
  injury_type: string
  severity: number
  description?: string
  recovery_weeks: number
  permanent_effects?: string[]
  occurred_date: string
  expected_recovery_date?: string
  actual_recovery_date?: string
  is_recovered: boolean
  
  // Additional properties
  type?: string
  recovery_date?: string
  impact_on_performance?: number
  treatment_required?: string[]
  medical_clearance_required?: boolean
  notes?: string
  
  // Long-term effects
  affects_punching_power: boolean
  affects_speed: boolean
  affects_defense: boolean
  affects_stamina: boolean
  affects_chin: boolean
  
  created_at: string
}

// Media Coverage Types
export interface MediaCoverage {
  id: string
  fighter_id: string
  headline: string
  content: string
  media_type: 'press_conference' | 'interview' | 'social_media' | 'scandal' | 'achievement'
  impact_on_reputation: number
  impact_on_marketability: number
  published_date: string
  
  // Public Reaction
  public_reaction: 'positive' | 'negative' | 'neutral' | 'controversial'
  social_media_buzz: number
  
  // AI Enhancement
  ai_generated_content?: Record<string, any>
  sentiment_analysis?: Record<string, any>
  viral_potential: number
  
  created_at: string
}

// Sponsorship Types
export interface Sponsorship {
  id: string
  fighter_id: string
  sponsor_name: string
  deal_value?: number
  duration_months?: number
  start_date: string
  end_date?: string
  is_active: boolean
  
  // Deal Terms
  requirements?: string[]
  bonus_conditions?: string[]
  termination_clause?: string
  
  // AI Enhancement
  ai_generated_opportunities?: Record<string, any>[]
  market_fit_score: number
  
  created_at: string
}

// Skill Development Types
export interface SkillDevelopment {
  id: string
  fighter_id: string
  skill_type: 'punching_power' | 'speed' | 'defense' | 'stamina' | 'chin' | 'heart' | 'ring_iq' | 'adaptability' | 'mental_toughness' | 'recovery_time'
  old_value: number
  new_value: number
  improvement_amount: number
  improvement_date: string
  improvement_reason?: string
  created_at: string
}

// Cut Scene Types
export interface CutScene {
  id: string
  scene_type: 'training' | 'press_conference' | 'backstage' | 'personal_issue' | 'business_meeting' | 'fight_preparation'
  title: string
  description: string
  choices?: Record<string, any>
  consequences?: Record<string, any>
  required_fighter_id?: string
  optional_fighter_id?: string
  is_triggered: boolean
  trigger_conditions?: Record<string, any>
  created_at: string
}

// Game Event Types
export interface GameEvent {
  id: string
  event_type: 'fighter_retirement' | 'injury' | 'contract_negotiation' | 'sponsorship_opportunity' | 'media_scandal' | 'championship_opportunity'
  title: string
  description: string
  affected_fighter_id?: string
  game_week: number
  is_resolved: boolean
  resolution_choice?: string
  consequences?: Record<string, any>
  created_at: string
}

// API Response Types
export interface APIResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Real-World Integration Types
export interface RealWorldRanking {
  rank: number
  name: string
  record: string
  country: string
  status: string
  organization?: string
  points?: number
}

export interface RealWorldFighter {
  id: string
  name: string
  record: string
  nationality: string
  weight_class: string
  ranking?: number
  organization?: string
}

// AI Content Generation Types
export interface FighterCreationData {
  name: string
  age: number
  nationality: string
  weight_class: string
  hometown?: string
  height_cm?: number
  reach_cm?: number
  stance: 'orthodox' | 'southpaw' | 'switch'
  base_stats?: Partial<FighterStats>
}

export interface FighterStats {
  punching_power: number
  speed: number
  defense: number
  stamina: number
  chin: number
  heart: number
  ring_iq: number
  adaptability: number
  mental_toughness: number
  recovery_time: number
  experience: number
  morale: number
}

export interface FighterContent {
  portrait_url: string
  voice_profile: VoiceProfile
  lore_background: string
  personality_traits: PersonalityTraits
}

// Training Results Types
export interface TrainingResults {
  skill_improvements: Partial<FighterStats>
  health_impact: number
  fatigue_level: number
  motivation_change: number
  notes?: string
}

// Fight Result Types
export interface FightResult {
  match: Match
  winner?: Fighter
  loser?: Fighter
  method: string
  rounds_completed: number
  total_punches: number
  knockdowns: number
  fight_rating: number
  crowd_reaction: number
  media_coverage: number
  
  // Additional properties for enhanced combat engine
  round?: number
  fighterA?: Fighter
  fighterB?: Fighter
  timeInRound?: string
}

// Contract Negotiation Types
export interface NegotiationData {
  fighter_id: string
  promoter_id: string
  initial_offer: ContractOffer
  ai_strategy: NegotiationStrategy
  negotiation_history: NegotiationRound[]
}

export interface ContractOffer {
  base_purse: number
  win_bonus: number
  knockout_bonus: number
  ppv_percentage: number
  sponsorship_split: number
  fights_committed: number
  contract_duration_months: number
}

export interface NegotiationStrategy {
  approach: 'aggressive' | 'conservative' | 'balanced'
  key_priorities: string[]
  fallback_positions: Record<string, number>
  deal_breakers: string[]
}

export interface NegotiationRound {
  round_number: number
  offer: ContractOffer
  fighter_satisfaction: number
  promoter_satisfaction: number
  counter_offer?: ContractOffer
  notes?: string
}

// Event System Types
export interface EventSubscription {
  event_type: string
  callback: (data: any) => void
  filters?: Record<string, any>
}

export interface EventBus {
  subscribe: (subscription: EventSubscription) => void
  unsubscribe: (event_type: string) => void
  publish: (event_type: string, data: any) => void
}

// Utility Types
export type WeightClass = 
  | 'heavyweight' 
  | 'cruiserweight' 
  | 'light_heavyweight' 
  | 'super_middleweight' 
  | 'middleweight' 
  | 'super_welterweight' 
  | 'welterweight' 
  | 'super_lightweight' 
  | 'lightweight' 
  | 'super_featherweight' 
  | 'featherweight' 
  | 'super_bantamweight' 
  | 'bantamweight' 
  | 'super_flyweight' 
  | 'flyweight'

export type Organization = 'WBC' | 'WBA' | 'IBF' | 'WBO' | 'RING'

export type FightMethod = 'decision' | 'ko' | 'tko' | 'draw' | 'no_contest' | 'dqd'

export type CareerStage = 'amateur' | 'prospect' | 'contender' | 'champion' | 'legend' | 'retired'

export type Stance = 'orthodox' | 'southpaw' | 'switch'

export type VenueTier = 'small_club' | 'medium_arena' | 'large_stadium' | 'premium_venue'

export type RivalryType = 'personal' | 'professional' | 'territorial' | 'championship'

export type MediaType = 'press_conference' | 'interview' | 'social_media' | 'scandal' | 'achievement'

export type PublicReaction = 'positive' | 'negative' | 'neutral' | 'controversial'

export type ContractType = 'amateur' | 'pro_debut' | 'development' | 'championship' | 'super_fight' | 'retirement'

export type SceneType = 'training' | 'press_conference' | 'backstage' | 'personal_issue' | 'business_meeting' | 'fight_preparation'

export type GameEventType = 'fighter_retirement' | 'injury' | 'contract_negotiation' | 'sponsorship_opportunity' | 'media_scandal' | 'championship_opportunity'

export type ContentType = 'portrait' | 'voice' | 'lore' | 'personality' | 'commentary'

export type SkillType = 'punching_power' | 'speed' | 'defense' | 'stamina' | 'chin' | 'heart' | 'ring_iq' | 'adaptability' | 'mental_toughness' | 'recovery_time'

// Celebrity Management Types
export type CelebrityIndustryValue = 'acting' | 'music' | 'sports' | 'social_media' | 'business' | 'modeling'

export interface Celebrity {
  id: string
  name: string
  age: number
  primary_industry: CelebrityIndustryValue
  net_worth: number
  popularity: number
  experience: number
  fan_base: number
  energy: number
  stress: number
  reputation: number
  
  // Additional properties for enhanced functionality
  nickname?: string
  fan_base_size?: number
  media_sentiment?: string
  secondary_industries?: CelebrityIndustryValue[]
  career_stage?: string
  industry_focus?: string
  marketability_score?: number
  social_media_presence?: number
  brand_endorsements?: string[]
  audition_history?: string[]
  casting_preferences?: string[]
  
  // Industry-specific skills
  acting_skills: {
    dramatic_acting: number
    comedic_acting: number
    method_acting: number
    voice_acting: number
    stage_presence: number
    improvisation: number
    character_development: number
    emotional_range: number
    physicality: number
    memorization: number
  }
  
  music_skills: {
    vocals: number
    instruments: number
    songwriting: number
    performance: number
    rhythm: number
    harmony: number
    production: number
    composition: number
    stage_presence: number
    audience_connection: number
  }
  
  sports_skills: {
    athletics: number
    coordination: number
    endurance: number
    strength: number
    agility: number
    mental_toughness: number
    teamwork: number
    leadership: number
    strategy: number
    competitiveness: number
  }
  
  social_media_skills: {
    content_creation: number
    engagement: number
    branding: number
    marketing: number
    trend_awareness: number
    photography: number
    video_editing: number
    audience_growth: number
    monetization: number
    platform_management: number
  }
  
  // Career data
  projects: Project[]
  milestones: CareerMilestone[]
  opportunities: CareerOpportunity[]
  
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  celebrity_id: string
  title: string
  industry: CelebrityIndustryValue
  description?: string
  status: 'planning' | 'in_production' | 'completed' | 'cancelled'
  start_date: Date
  end_date?: Date
  budget: number
  revenue_potential: number
  actual_revenue?: number
  risk_level: 'low' | 'medium' | 'high'
  skill_requirements: Record<string, number>
  team_members?: string[]
  milestones?: string[]
  notes?: string
  created_at?: Date
  updated_at?: Date
}

export interface CareerMilestone {
  id: string
  celebrity_id: string
  milestone_type: string
  title: string
  description: string
  achieved_date: Date
  impact_score: number
  industry: CelebrityIndustryValue
  skill_improvements?: Record<string, number>
  reputation_change?: number
  fan_base_change?: number
  created_at: Date
}

export interface CareerOpportunity {
  id: string
  title: string
  industry: CelebrityIndustryValue
  type: 'project' | 'endorsement' | 'appearance' | 'collaboration'
  description: string
  potential_revenue: number
  risk_level: 'low' | 'medium' | 'high'
  requirements: {
    popularity_min?: number
    experience_min?: number
    skill_requirements?: Record<string, number>
    industry_specific?: string[]
  }
  deadline?: Date
  duration_weeks?: number
  created_at: Date
}

export interface CareerGoal {
  id: string
  celebrity_id: string
  title: string
  description: string
  target_industry?: CelebrityIndustryValue
  deadline: Date
  priority: 'low' | 'medium' | 'high'
  progress: number
  milestones: string[]
  requirements: Record<string, any>
  is_completed: boolean
  created_at: Date
  updated_at: Date
}

// Mock data and engines
export const REAL_CELEBRITIES: Celebrity[] = []

export const celebrityManagementEngine = {
  getCelebrity: (id: string): Celebrity | null => null,
  getCelebrityProjects: (celebrityId: string): Project[] => [],
  getCelebrityMilestones: (celebrityId: string): CareerMilestone[] => [],
  generateOpportunities: (celebrityId: string): CareerOpportunity[] => [],
  switchPrimaryIndustry: (celebrityId: string, industry: CelebrityIndustryValue): boolean => false,
  trainSkill: (celebrityId: string, skill: string, hours: number): boolean => false,
  createProject: (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project | null => null,
  getIndustryOpportunities: (industry: CelebrityIndustryValue): CareerOpportunity[] => [],
  loadRealCelebrities: (): Celebrity[] => [],
  getCelebritiesByIndustry: (industry: CelebrityIndustryValue): Celebrity[] => [],
  getTopCelebrities: (limit: number): Celebrity[] => [],
  getCelebritiesByNetWorth: (minWorth: number): Celebrity[] => [],
  createCelebrityFromTemplate: (templateName: string): Celebrity | null => null
}

export const getCelebritiesByIndustry = (industry: CelebrityIndustryValue): Celebrity[] => []
export const getTopCelebrities = (limit: number): Celebrity[] => []
export const getCelebritiesByNetWorth = (minNetWorth: number): Celebrity[] => []

// Database Table Names
export const TABLES = {
  FIGHTERS: 'fighters',
  MATCHES: 'fights',
  RANKINGS: 'rankings',
  TITLES: 'titles',
  CONTRACTS: 'contracts',
  TRAINING_CAMPS: 'training_camps',
  INJURIES: 'injuries',
  MEDIA_COVERAGE: 'media_coverage',
  SPONSORSHIPS: 'sponsorships',
  SKILL_DEVELOPMENT: 'skill_development',
  RIVALRIES: 'rivalries',
  CUT_SCENES: 'cut_scenes',
  GAME_EVENTS: 'game_events',
  GAME_STATE: 'game_state',
  PRESS_CONFERENCES: 'press_conferences',
  PRESS_QUESTIONS: 'press_questions',
  AI_GENERATED_CONTENT: 'ai_generated_content',
  REAL_TIME_EVENTS: 'real_time_events',
  VENUES: 'venues',
  PROMOTERS: 'promoters',
  SCOUTS: 'scouts',
  SCOUTING_REPORTS: 'scouting_reports',
  HEALTH_MONITORING: 'health_monitoring',
  INTERNATIONAL_RANKINGS: 'international_rankings',
  OFFICIAL_RECORDS: 'official_records',
  ANALYTICS_EVENTS: 'analytics_events',
  PERFORMANCE_METRICS: 'performance_metrics'
} as const

// Real-time event types
export const REAL_TIME_EVENTS = {
  FIGHT_COMPLETED: 'fight_completed',
  RANKING_UPDATED: 'ranking_updated',
  TITLE_CHANGED: 'title_changed',
  CONTRACT_SIGNED: 'contract_signed',
  INJURY_OCCURRED: 'injury_occurred',
  PRESS_CONFERENCE_SCHEDULED: 'press_conference_scheduled',
  AI_CONTENT_GENERATED: 'ai_content_generated',
  RIVALRY_INTENSIFIED: 'rivalry_intensified'
} as const

// AI Model types
export const AI_MODELS = {
  OPENAI_GPT4: 'gpt-4',
  OPENAI_GPT35: 'gpt-3.5-turbo',
  CLAUDE_3_SONNET: 'claude-3-sonnet',
  CLAUDE_3_HAIKU: 'claude-3-haiku',
  STABLE_DIFFUSION: 'stable-diffusion-xl',
  ELEVENLABS: 'elevenlabs'
} as const

// Default values
export const DEFAULT_FIGHTER_STATS: FighterStats = {
  punching_power: 70,
  speed: 70,
  defense: 70,
  stamina: 70,
  chin: 70,
  heart: 70,
  ring_iq: 70,
  adaptability: 70,
  mental_toughness: 70,
  recovery_time: 70,
  experience: 50,
  morale: 75
}

export const DEFAULT_PERSONALITY_TRAITS: PersonalityTraits = {
  confidence: 75,
  aggression: 70,
  discipline: 80,
  charisma: 65,
  loyalty: 75,
  ambition: 80,
  temperament: 'balanced',
  media_savvy: 60
}

// Weight class configurations
export const WEIGHT_CLASS_CONFIG = {
  heavyweight: { min_weight: 200, max_weight: null },
  cruiserweight: { min_weight: 175, max_weight: 200 },
  light_heavyweight: { min_weight: 168, max_weight: 175 },
  super_middleweight: { min_weight: 160, max_weight: 168 },
  middleweight: { min_weight: 154, max_weight: 160 },
  super_welterweight: { min_weight: 147, max_weight: 154 },
  welterweight: { min_weight: 140, max_weight: 147 },
  super_lightweight: { min_weight: 135, max_weight: 140 },
  lightweight: { min_weight: 130, max_weight: 135 },
  super_featherweight: { min_weight: 122, max_weight: 130 },
  featherweight: { min_weight: 118, max_weight: 122 },
  super_bantamweight: { min_weight: 115, max_weight: 118 },
  bantamweight: { min_weight: 112, max_weight: 115 },
  super_flyweight: { min_weight: 108, max_weight: 112 },
  flyweight: { min_weight: 105, max_weight: 108 }
} as const 