// Unified TypeScript types for Glory Boxing Manager
// This file contains all the type definitions used across the application

// ===== CELEBRITY MANAGEMENT SYSTEM =====

// Core celebrity interface - replaces Fighter for celebrity management
export interface Celebrity {
  id: string;
  name: string;
  age?: number;
  nationality?: string;
  primary_industry: CelebrityIndustryValue;
  secondary_industries: CelebrityIndustryValue[];
  debut_date?: Date;
  retired?: boolean;
  created_at?: Date;
  updated_at?: Date;
  
  // Career stats
  popularity?: number;
  experience?: number;
  ranking?: number;
  industry_ranking?: number;
  net_worth?: number;
  
  // Industry-specific stats
  acting_skills?: ActingSkills;
  music_skills?: MusicSkills;
  sports_skills?: SportsSkills;
  social_media_skills?: SocialMediaSkills;
  business_skills?: BusinessSkills;
  
  // Health & Wellness
  physical_health?: number;
  mental_health?: number;
  stress_level?: number;
  energy_level?: number;
  injuries?: any[];
  is_injured?: boolean;
  
  // Personal & Professional
  personality_traits?: PersonalityTraits;
  public_image?: number;
  fan_base_size?: number;
  media_sentiment?: 'positive' | 'negative' | 'neutral' | 'mixed';
  
  // Additional properties
  nickname?: string;
  hometown?: string;
  region?: string;
  voice_profile?: VoiceProfile;
  portrait_url?: string;
}

// Industry types for multi-career management
export const CelebrityIndustry = {
  ACTING: 'acting',
  MUSIC: 'music', 
  SPORTS: 'sports',
  SOCIAL_MEDIA: 'social_media',
  MODELING: 'modeling',
  BUSINESS: 'business',
  COMEDY: 'comedy',
  REALITY_TV: 'reality_tv',
  FASHION: 'fashion',
  TECHNOLOGY: 'technology'
} as const;

export type CelebrityIndustryValue = typeof CelebrityIndustry[keyof typeof CelebrityIndustry];

// Industry-specific skill systems
export interface ActingSkills {
  dramatic_acting: number;
  comedic_acting: number;
  method_acting: number;
  voice_acting: number;
  stage_presence: number;
  emotional_range: number;
  accent_work: number;
  improvisation: number;
  chemistry_with_co_stars: number;
  audition_skills: number;
}

export interface MusicSkills {
  vocal_ability: number;
  instrumental_skill: number;
  songwriting: number;
  stage_performance: number;
  studio_recording: number;
  musical_theory: number;
  genre_versatility: number;
  live_performance: number;
  collaboration: number;
  music_production: number;
}

export interface SportsSkills {
  athletic_ability: number;
  technical_skill: number;
  mental_toughness: number;
  teamwork: number;
  leadership: number;
  strategic_thinking: number;
  physical_endurance: number;
  competitive_spirit: number;
  injury_recovery: number;
  peak_performance: number;
}

export interface SocialMediaSkills {
  content_creation: number;
  audience_engagement: number;
  trend_awareness: number;
  platform_mastery: number;
  viral_potential: number;
  brand_voice: number;
  community_building: number;
  crisis_management: number;
  monetization: number;
  authenticity: number;
}

// ===== ENHANCED CELEBRITY MANAGEMENT TYPES =====

// Social Media Presence System
export interface SocialMediaAccount {
  id: string;
  celebrity_id: string;
  platform: SocialMediaPlatformValue;
  username: string;
  followers: number;
  engagement_rate: number;
  verified: boolean;
  last_post_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export const SocialMediaPlatform = {
  INSTAGRAM: 'instagram',
  TWITTER: 'twitter',
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  FACEBOOK: 'facebook',
  LINKEDIN: 'linkedin',
  SNAPCHAT: 'snapchat',
  TWITCH: 'twitch',
  DISCORD: 'discord',
  PATREON: 'patreon'
} as const;

export type SocialMediaPlatformValue = typeof SocialMediaPlatform[keyof typeof SocialMediaPlatform];

export interface SocialMediaPost {
  id: string;
  celebrity_id: string;
  platform: SocialMediaPlatformValue;
  content: string;
  media_urls?: string[];
  hashtags: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  reach: number;
  viral_score: number;
  posted_at: Date;
  created_at: Date;
}

// Enhanced Reputation Management System
export interface ReputationEvent {
  id: string;
  celebrity_id: string;
  event_type: ReputationEventTypeValue;
  title: string;
  description: string;
  impact_score: number; // -100 to +100
  media_coverage: number;
  public_reaction: 'positive' | 'negative' | 'neutral' | 'mixed' | 'controversial';
  industry_impact: CelebrityIndustryValue[];
  duration_days: number;
  resolved: boolean;
  occurred_at: Date;
  created_at: Date;
}

export const ReputationEventType = {
  SCANDAL: 'scandal',
  ACHIEVEMENT: 'achievement',
  CONTROVERSY: 'controversy',
  CHARITY_WORK: 'charity_work',
  PUBLIC_APPEARANCE: 'public_appearance',
  INTERVIEW: 'interview',
  AWARD_WIN: 'award_win',
  BUSINESS_DEAL: 'business_deal',
  PERSONAL_CRISIS: 'personal_crisis',
  COMEBACK: 'comeback',
  FEUD: 'feud',
  ENDORSEMENT: 'endorsement',
  PHILANTHROPY: 'philanthropy',
  LEGAL_ISSUE: 'legal_issue',
  HEALTH_CRISIS: 'health_crisis'
} as const;

export type ReputationEventTypeValue = typeof ReputationEventType[keyof typeof ReputationEventType];

export interface ReputationProfile {
  id: string;
  celebrity_id: string;
  overall_reputation: number; // 0-100
  industry_reputation: Record<CelebrityIndustryValue, number>;
  public_trust: number;
  media_sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  crisis_resilience: number;
  brand_value: number;
  last_updated: Date;
  created_at: Date;
}

// Financial Portfolio System
export interface FinancialPortfolio {
  id: string;
  celebrity_id: string;
  total_assets: number;
  liquid_cash: number;
  investments: Investment[];
  properties: Property[];
  businesses: Business[];
  debt: number;
  monthly_income: number;
  monthly_expenses: number;
  net_worth: number;
  last_updated: Date;
  created_at: Date;
}

export interface Investment {
  id: string;
  portfolio_id: string;
  type: InvestmentTypeValue;
  name: string;
  value: number;
  return_rate: number;
  risk_level: 'low' | 'medium' | 'high';
  maturity_date?: Date;
  created_at: Date;
}

export const InvestmentType = {
  STOCKS: 'stocks',
  BONDS: 'bonds',
  REAL_ESTATE: 'real_estate',
  CRYPTO: 'crypto',
  MUTUAL_FUNDS: 'mutual_funds',
  PRIVATE_EQUITY: 'private_equity',
  VENTURE_CAPITAL: 'venture_capital',
  COMMODITIES: 'commodities',
  FOREX: 'forex',
  ART: 'art',
  WINE: 'wine',
  COLLECTIBLES: 'collectibles'
} as const;

export type InvestmentTypeValue = typeof InvestmentType[keyof typeof InvestmentType];

export interface Property {
  id: string;
  portfolio_id: string;
  type: PropertyTypeValue;
  address: string;
  value: number;
  monthly_rent?: number;
  mortgage?: number;
  appreciation_rate: number;
  created_at: Date;
}

export const PropertyType = {
  RESIDENTIAL: 'residential',
  COMMERCIAL: 'commercial',
  LUXURY: 'luxury',
  INVESTMENT: 'investment',
  VACATION: 'vacation',
  LAND: 'land'
} as const;

export type PropertyTypeValue = typeof PropertyType[keyof typeof PropertyType];

export interface Business {
  id: string;
  portfolio_id: string;
  name: string;
  industry: string;
  type: BusinessTypeValue;
  value: number;
  annual_revenue: number;
  profit_margin: number;
  ownership_percentage: number;
  created_at: Date;
}

export const BusinessType = {
  SOLE_PROPRIETORSHIP: 'sole_proprietorship',
  PARTNERSHIP: 'partnership',
  CORPORATION: 'corporation',
  LLC: 'llc',
  FRANCHISE: 'franchise',
  STARTUP: 'startup',
  CONSULTING: 'consulting',
  E_COMMERCE: 'e_commerce',
  RESTAURANT: 'restaurant',
  FITNESS: 'fitness',
  ENTERTAINMENT: 'entertainment',
  TECHNOLOGY: 'technology'
} as const;

export type BusinessTypeValue = typeof BusinessType[keyof typeof BusinessType];

// Endorsement and Sponsorship Enhancement
export interface EndorsementDeal {
  id: string;
  celebrity_id: string;
  brand_name: string;
  industry: string;
  deal_type: EndorsementTypeValue;
  deal_value: number;
  duration_months: number;
  requirements: string[];
  performance_metrics: string[];
  social_media_obligations: number;
  public_appearances: number;
  start_date: Date;
  end_date: Date;
  status: 'active' | 'expired' | 'terminated' | 'negotiating';
  created_at: Date;
}

export const EndorsementType = {
  BRAND_AMBASSADOR: 'brand_ambassador',
  PRODUCT_ENDORSEMENT: 'product_endorsement',
  SPONSORSHIP: 'sponsorship',
  COLLABORATION: 'collaboration',
  LICENSING: 'licensing',
  EQUITY_DEAL: 'equity_deal',
  REVENUE_SHARE: 'revenue_share',
  PERFORMANCE_BASED: 'performance_based'
} as const;

export type EndorsementTypeValue = typeof EndorsementType[keyof typeof EndorsementType];

// Media and PR System
export interface MediaInterview {
  id: string;
  celebrity_id: string;
  outlet_name: string;
  interviewer: string;
  interview_type: InterviewTypeValue;
  topics: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  reach: number;
  impact_score: number;
  interview_date: Date;
  published_date: Date;
  created_at: Date;
}

export const InterviewType = {
  TELEVISION: 'television',
  RADIO: 'radio',
  PODCAST: 'podcast',
  PRINT: 'print',
  ONLINE: 'online',
  PRESS_CONFERENCE: 'press_conference',
  TALK_SHOW: 'talk_show',
  DOCUMENTARY: 'documentary'
} as const;

export type InterviewTypeValue = typeof InterviewType[keyof typeof InterviewType];

// Networking and Industry Relationships
export interface IndustryContact {
  id: string;
  celebrity_id: string;
  contact_name: string;
  company: string;
  position: string;
  industry: CelebrityIndustryValue;
  relationship_type: ContactTypeValue;
  influence_level: number; // 1-10
  last_contact: Date;
  notes: string;
  created_at: Date;
}

export const ContactType = {
  MENTOR: 'mentor',
  COLLABORATOR: 'collaborator',
  INVESTOR: 'investor',
  AGENT: 'agent',
  MANAGER: 'manager',
  PRODUCER: 'producer',
  DIRECTOR: 'director',
  EXECUTIVE: 'executive',
  INFLUENCER: 'influencer',
  FRIEND: 'friend'
} as const;

export type ContactTypeValue = typeof ContactType[keyof typeof ContactType];

// Business Skills
export interface BusinessSkills {
  entrepreneurship: number;
  investment_acumen: number;
  negotiation: number;
  strategic_planning: number;
  brand_management: number;
  financial_literacy: number;
  market_analysis: number;
  networking: number;
  risk_management: number;
  innovation: number;
}

// Project management system
export interface Project {
  id: string;
  celebrity_id: string;
  title: string;
  industry: CelebrityIndustryValue;
  type: ProjectTypeValue;
  status: ProjectStatusValue;
  start_date: Date;
  end_date?: Date;
  budget: number;
  revenue_potential: number;
  risk_level: 'low' | 'medium' | 'high';
  critical_success_factors: string[];
  team_members: string[];
  location: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export const ProjectType = {
  MOVIE: 'movie',
  TV_SHOW: 'tv_show',
  ALBUM: 'album',
  TOUR: 'tour',
  SPORTS_EVENT: 'sports_event',
  SOCIAL_MEDIA_CAMPAIGN: 'social_media_campaign',
  BUSINESS_VENTURE: 'business_venture',
  ENDORSEMENT: 'endorsement',
  REALITY_SHOW: 'reality_show',
  PODCAST: 'podcast',
  BOOK: 'book',
  FASHION_LINE: 'fashion_line',
  TECHNOLOGY_PRODUCT: 'technology_product'
} as const;

export type ProjectTypeValue = typeof ProjectType[keyof typeof ProjectType];

export const ProjectStatus = {
  PLANNING: 'planning',
  IN_PRODUCTION: 'in_production',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ON_HOLD: 'on_hold'
} as const;

export type ProjectStatusValue = typeof ProjectStatus[keyof typeof ProjectStatus];

// Career progression system
export interface CareerMilestone {
  id: string;
  celebrity_id: string;
  milestone_type: MilestoneTypeValue;
  title: string;
  description: string;
  achieved_date: Date;
  industry: CelebrityIndustryValue;
  impact_score: number;
  rewards: MilestoneReward[];
  created_at: Date;
}

export const MilestoneType = {
  FIRST_ROLE: 'first_role',
  BREAKOUT_ROLE: 'breakout_role',
  AWARD_WIN: 'award_win',
  PLATINUM_ALBUM: 'platinum_album',
  CHAMPIONSHIP_WIN: 'championship_win',
  VIRAL_MOMENT: 'viral_moment',
  BUSINESS_SUCCESS: 'business_success',
  INDUSTRY_RECOGNITION: 'industry_recognition',
  INTERNATIONAL_SUCCESS: 'international_success',
  LEGACY_ACHIEVEMENT: 'legacy_achievement'
} as const;

export type MilestoneTypeValue = typeof MilestoneType[keyof typeof MilestoneType];

export interface MilestoneReward {
  type: 'popularity' | 'experience' | 'money' | 'skill_boost' | 'opportunity';
  value: number;
  description: string;
}

// Core fighter interface (keeping for backward compatibility)
export interface Fighter {
  id: string;
  name: string;
  age?: number;
  nationality?: string;
  division: string;
  weight_class?: string;
  stance: string;
  promoter?: string;
  amateur_record?: string;
  pro_record?: string;
  debut_date?: Date;
  retired?: boolean;
  created_at?: Date;
  updated_at?: Date;
  
  // Fight record
  record_wins?: number;
  record_losses?: number;
  record_draws?: number;
  knockouts?: number;
  
  // Physical stats
  power?: number;
  speed?: number;
  stamina?: number;
  defense?: number;
  chin?: number;
  heart?: number;
  ring_iq?: number;
  
  // Career stats
  popularity?: number;
  experience?: number;
  ranking?: number;
  real_world_ranking?: number;
  real_world_record?: string;
  
  // Health
  injuries?: any[];
  is_injured?: boolean;
  last_fight?: string | Date;
  
  // Additional properties that might be needed
  nickname?: string;
  height_cm?: number;
  reach_cm?: number;
  hometown?: string;
  region?: string;
}

// International ranking interface
export interface InternationalRanking {
  id: string;
  fighter_id: string;
  organization: string;
  weight_class: string;
  rank: number;
  points: number;
  previous_rank: number;
  movement: 'up' | 'down' | 'unchanged';
  last_updated: Date;
  verified: boolean;
}

// Official record interface
export interface OfficialRecord {
  id: string;
  fighter_id: string;
  organization: string;
  wins: number;
  losses: number;
  draws: number;
  no_contests: number;
  knockouts: number;
  technical_knockouts: number;
  decisions: number;
  total_fights: number;
  win_percentage: number;
  ko_percentage: number;
  last_updated: Date;
  verified: boolean;
}

// Match interface
export interface Match {
  id: string;
  fighter_a: string;
  fighter_b: string;
  venue: string;
  scheduled_rounds: number;
  actual_rounds?: number;
  result?: FightResult;
  scorecard?: any;
  winner?: string;
  title_fight: boolean;
  title_id?: string;
  fight_date: Date;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

// Title interface
export interface Title {
  id: string;
  name: string;
  division: string;
  sanctioning_body: string;
  current_holder?: string;
  is_lineal: boolean;
  created_at: Date;
  updated_at: Date;
}

// Press conference interface
export interface PressConference {
  id: string;
  match_id: string;
  reporter_questions: string[];
  fighter_responses: string[];
  ai_generated: boolean;
  created_at: Date;
  updated_at: Date;
}

// Ranking interface
export interface Ranking {
  id: string;
  division: string;
  sanctioning_body: string;
  rank: number;
  fighter_id: string;
  updated_at: Date;
}

// Weight class constants
export const WeightClass = {
  STRAWWEIGHT: 'strawweight',
  FLYWEIGHT: 'flyweight',
  BANTAMWEIGHT: 'bantamweight',
  SUPER_BANTAMWEIGHT: 'super_bantamweight',
  FEATHERWEIGHT: 'featherweight',
  SUPER_FEATHERWEIGHT: 'super_featherweight',
  LIGHTWEIGHT: 'lightweight',
  SUPER_LIGHTWEIGHT: 'super_lightweight',
  WELTERWEIGHT: 'welterweight',
  SUPER_WELTERWEIGHT: 'super_welterweight',
  MIDDLEWEIGHT: 'middleweight',
  SUPER_MIDDLEWEIGHT: 'super_middleweight',
  LIGHT_HEAVYWEIGHT: 'light_heavyweight',
  CRUISERWEIGHT: 'cruiserweight',
  HEAVYWEIGHT: 'heavyweight'
} as const

// Stance constants
export const Stance = {
  ORTHODOX: 'orthodox',
  SOUTHPAW: 'southpaw',
  SWITCH: 'switch'
} as const;

export type StanceValue = typeof Stance[keyof typeof Stance];

// Organization constants
export const Organization = {
  WBC: 'WBC',
  WBA: 'WBA',
  IBF: 'IBF',
  WBO: 'WBO',
  RING: 'The Ring',
  LINEAL: 'Lineal'
} as const;

export type OrganizationValue = typeof Organization[keyof typeof Organization];

// Match result constants
export const MatchResult = {
  WIN: 'win',
  LOSS: 'loss',
  DRAW: 'draw',
  NO_CONTEST: 'no_contest',
  TECHNICAL_DRAW: 'technical_draw'
} as const;

export type MatchResultValue = typeof MatchResult[keyof typeof MatchResult];

// Decision type constants
export const DecisionType = {
  UNANIMOUS: 'unanimous',
  SPLIT: 'split',
  MAJORITY: 'majority',
  TECHNICAL: 'technical'
} as const;

export type DecisionTypeValue = typeof DecisionType[keyof typeof DecisionType];

export interface FightResult {
  winner: string
  method: 'ko' | 'tko' | 'decision' | 'submission' | 'draw' | 'KO/TKO' | 'Decision'
  rounds: number
  roundData: RoundData[]
  punchStats: PunchStats
  knockdowns: KnockdownEvent[]
  analysis?: any
  scorecards?: Scorecard[]
  highlights?: string[]
  rating?: number
}

// Injury interface
export interface Injury {
  id: string
  fighter_id: string
  type: string
  severity: 'mild' | 'moderate' | 'severe'
  date_occurred: Date
  recovery_date: Date
  description?: string
  medical_notes?: string
  treatment_plan?: string[]
  impact_on_performance?: number
  active: boolean
}

export interface Scorecard {
  judge: string
  fighter_a_score: number
  fighter_b_score: number
  winner: string
}

export interface CommentaryEntry {
  round: number
  text: string
  highlights: string[]
  emotion: 'intense' | 'dramatic' | 'tactical' | 'excited'
  timestamp: string
}

export interface Venue {
  id: string
  name: string
  city: string
  country: string
  capacity: number
  region: string
  facilities: string[]
  created_at: string
}

export interface Promoter {
  id: string
  name: string
  organization: string
  region: string
  reputation: number
  financial_capacity: number
  created_at: string
}

export interface Scout {
  id: string
  name: string
  region: string
  expertise: string[]
  success_rate: number
  created_at: string
}

export interface ScoutingReport {
  id: string
  scout_id: string
  fighter_id: string
  report_date: string
  assessment: string
  potential: number
  risk_factors: string[]
  recommendations: string[]
  created_at: string
}

export interface Contract {
  id: string
  fighter_id: string
  promoter_id: string
  type: 'exclusive' | 'non-exclusive' | 'development'
  base_salary: number
  duration_months: number
  fights_per_year: number
  performance_bonuses: any[]
  sponsorship_split: number
  start_date: string
  end_date: string
  status: 'active' | 'expired' | 'terminated'
  created_at: string
}

export interface Rivalry {
  id: string
  fighter_a_id: string
  fighter_b_id: string
  intensity: number
  history: string[]
  last_meeting?: string
  next_meeting?: string
  created_at: string
}

// Health monitoring interface
export interface HealthMonitoring {
  id: string
  fighter_id: string
  assessment_date: string
  overall_health: number
  injury_risk: number
  recovery_status: string
  medical_clearance: boolean
  restrictions: string[]
  recommendations: string[]
  created_at: string
}

export interface AnalyticsEvent {
  id: string
  event_type: string
  event_data: any
  timestamp: string
  user_id?: string
  session_id?: string
}

export interface PerformanceMetric {
  id: string
  fighter_id: string
  metric_type: string
  value: number
  date: string
  context: any
  created_at: string
}

export interface RealTimeEvent {
  id: string
  event_type: string
  event_data: any
  timestamp: string
  processed: boolean
}

export interface GameState {
  id: string
  current_period: number
  total_revenue: number
  total_expenses: number
  previous_period_revenue: number
  sponsorship_revenue: number
  ticket_revenue: number
  ppv_revenue: number
  merchandise_revenue: number
  created_at: string
  updated_at: string
}

export interface TrainingCamp {
  id: string
  fighter_id: string
  camp_name: string
  start_date: string
  end_date: string
  focus_areas: string[]
  intensity: number
  results: any
  created_at: string
}

export interface MediaCoverage {
  id: string
  fighter_id: string
  media_type: string
  title: string
  content: string
  sentiment: 'positive' | 'negative' | 'neutral'
  reach: number
  date: string
  created_at: string
}

export interface Sponsorship {
  id: string
  fighter_id: string
  sponsor_name: string
  deal_value: number
  duration_months: number
  requirements: string[]
  start_date: string
  end_date: string
  status: 'active' | 'expired' | 'terminated'
  created_at: string
}

export interface SkillDevelopment {
  id: string
  fighter_id: string
  skill_type: string
  current_level: number
  target_level: number
  training_methods: string[]
  progress: number
  created_at: string
  updated_at: string
}

export interface CutScene {
  id: string
  scene_type: string
  title: string
  description: string
  choices: CutSceneChoice[]
  consequences: any
  triggered_by: string
  created_at: string
}

export interface CutSceneChoice {
  id: string
  scene_id: string
  text: string
  consequences: any
  created_at: string
}

export interface GameEvent {
  id: string
  event_type: string
  title: string
  description: string
  affected_fighters: string[]
  consequences: any
  date: string
  created_at: string
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
  intelligence: number
  charisma: number
  work_ethic: number
}

// Fight Simulation Types
export interface RoundData {
  round: number
  duration: number
  events: any[]
  fighterAHealth: number
  fighterBHealth: number
  fighterAStamina: number
  fighterBStamina: number
  punchStats: PunchStats
  knockdowns: KnockdownEvent[]
  commentary?: string
  analysis?: string
}

export interface PunchStats {
  fighterA: {
    total: number
    landed: number
    accuracy: number
    power: number
  }
  fighterB: {
    total: number
    landed: number
    accuracy: number
    power: number
  }
}

export interface KnockdownEvent {
  fighter: string
  round: number
  timeInRound: number
  damage: number
  type: 'knockdown' | 'flash'
}

// Financial Types
export interface FinancialMetrics {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  revenueGrowth: number
  sponsorshipRevenue: number
  ticketRevenue: number
  ppvRevenue: number
  merchandiseRevenue: number
}

// Constants
export const TABLE_NAMES = {
  FIGHTERS: 'fighters',
  MATCHES: 'fights',
  RANKINGS: 'rankings',
  TITLES: 'titles',
  PRESS_CONFERENCES: 'press_conferences',
  PRESS_QUESTIONS: 'press_questions',
  VENUES: 'venues',
  PROMOTERS: 'promoters',
  SCOUTS: 'scouts',
  SCOUTING_REPORTS: 'scouting_reports',
  CONTRACTS: 'contracts',
  RIVALRIES: 'rivalries',
  HEALTH_MONITORING: 'health_monitoring',
  INTERNATIONAL_RANKINGS: 'international_rankings',
  OFFICIAL_RECORDS: 'official_records',
  ANALYTICS_EVENTS: 'analytics_events',
  PERFORMANCE_METRICS: 'performance_metrics',
  REAL_TIME_EVENTS: 'real_time_events',
  GAME_STATE: 'game_state',
  TRAINING_CAMPS: 'training_camps',
  INJURIES: 'injuries',
  MEDIA_COVERAGE: 'media_coverage',
  SPONSORSHIPS: 'sponsorships',
  SKILL_DEVELOPMENT: 'skill_development',
  CUT_SCENES: 'cut_scenes',
  GAME_EVENTS: 'game_events'
} as const

export const REAL_TIME_EVENTS = {
  FIGHT_STARTED: 'fight_started',
  ROUND_ENDED: 'round_ended',
  KNOCKDOWN: 'knockdown',
  FIGHT_ENDED: 'fight_ended',
  INJURY_OCCURRED: 'injury_occurred',
  RANKING_UPDATED: 'ranking_updated',
  TITLE_CHANGED: 'title_changed',
  CONTRACT_SIGNED: 'contract_signed',
  TRAINING_COMPLETED: 'training_completed',
  PRESS_CONFERENCE: 'press_conference'
} as const

export const AI_MODELS = {
  COMMENTARY: 'gpt-4',
  VOICE_GENERATION: 'elevenlabs',
  IMAGE_GENERATION: 'dall-e-3',
  PREDICTION: 'gpt-4',
  ANALYSIS: 'gpt-4'
} as const 