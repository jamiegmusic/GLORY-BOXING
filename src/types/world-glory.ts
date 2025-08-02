// World Glory Management - Unified Type System
// This file merges types from both projects and adds new multi-industry types

import { Fighter, Match, Venue } from '../lib/unified-types';

// ===== CORE WORLD GLORY TYPES =====

export interface WorldGloryGameState {
  // Core Boxing Elements (existing)
  fighters: Fighter[];
  matches: Match[];
  venues: Venue[];
  playerFunds: number;
  reputation: number;
  
  // New Multi-Industry Elements
  businessEmpire: BusinessEmpire;
  currentEra: HistoricalEra;
  currentYear: number;
  availableIndustries: Industry[];
  
  // Enhanced Management Systems
  careerPaths: CareerPath[];
  seasonMode?: SeasonManager;
  dreamLogic: DreamLogicState;
  
  // Progressive Unlocking
  unlockedFeatures: UnlockedFeature[];
  eraProgression: EraProgression;
  
  // Player Profile
  playerProfile: PlayerProfile;
}

// ===== BUSINESS EMPIRE MANAGEMENT =====

export interface BusinessEmpire {
  id: string;
  name: string;
  founded: number;
  currentEra: HistoricalEra;
  reputation: number;
  globalReach: number;
  
  // Business Portfolio
  sports: Sport[];
  venues: EnhancedVenue[];
  employees: Employee[];
  technologies: Technology[];
  partnerships: Partnership[];
  
  // Performance Metrics
  legacyPoints: number;
  dreamLogicScore: number;
  totalRevenue: number;
  marketShare: number;
}

export interface Sport {
  id: string;
  name: string;
  popularity: number;
  profitability: number;
  complexity: number;
  seasonality: 'year-round' | 'seasonal';
  ukSpecific: boolean;
  unlockYear: number;
  requiredReputation: number;
  governingBodies: string[];
  keyVenues: string[];
}

export interface EnhancedVenue extends Venue {
  businessImpact: number;
  culturalSignificance: number;
  revenueStream: RevenueStream[];
  upgradeOptions: VenueUpgrade[];
}

export interface RevenueStream {
  type: 'tickets' | 'hospitality' | 'merchandise' | 'media' | 'naming-rights';
  monthlyRevenue: number;
  growthRate: number;
}

export interface VenueUpgrade {
  id: string;
  name: string;
  cost: number;
  benefit: string;
  impactOnCapacity?: number;
  impactOnRevenue?: number;
}

// ===== CAREER PATH SYSTEM =====

export interface CareerPath {
  id: string;
  type: CareerType;
  name: string;
  experience: number;
  reputation: number;
  wealth: number;
  
  // Career-specific data
  actorCareer?: ActorCareer;
  musicianCareer?: MusicianCareer;
  businessCareer?: BusinessCareer;
  influencerCareer?: InfluencerCareer;
  
  // Progress tracking
  milestones: Milestone[];
  currentProjects: Project[];
  relationships: ProfessionalRelationship[];
}

export type CareerType = 'actor' | 'musician' | 'business' | 'influencer' | 'sports' | 'boxing-promoter';

export interface ActorCareer {
  filmography: Film[];
  awards: Award[];
  agentId?: string;
  castingDirectorRelationships: CastingRelationship[];
  actingSkills: ActingSkills;
  publicImage: PublicImage;
}

export interface ActingSkills {
  dramatic: number;
  comedic: number;
  action: number;
  character: number;
  improvisation: number;
  physicality: number;
  dialogue: number;
  emotional_range: number;
}

export interface Film {
  id: string;
  title: string;
  role: string;
  genre: string;
  budget: number;
  boxOffice?: number;
  criticalRating?: number;
  userRating?: number;
  releaseYear: number;
  awards?: Award[];
}

// ===== HISTORICAL ERA SYSTEM =====

export interface HistoricalEra {
  name: string;
  startYear: number;
  endYear: number;
  characteristics: EraCharacteristics;
  availableSports: Sport[];
  availableIndustries: Industry[];
  keyEvents: HistoricalEvent[];
  culturalContext: CulturalContext;
}

export interface EraCharacteristics {
  technology: string[];
  media: string[];
  transportation: string[];
  communication: string[];
  medicalAdvances: string[];
  socialIssues: string[];
  economicConditions: string;
  regulatoryEnvironment: string[];
}

export interface CulturalContext {
  musicGenres: string[];
  filmStyles: string[];
  fashionTrends: string[];
  socialMovements: string[];
  popularEntertainment: string[];
}

export interface Industry {
  id: string;
  name: string;
  type: 'entertainment' | 'sports' | 'business' | 'technology' | 'media';
  unlockEra: string;
  requiredReputation: number;
  baseInvestment: number;
  potentialReturn: number;
  complexity: number;
  marketSaturation: number;
}

// ===== DREAM LOGIC SYSTEM =====

export interface DreamLogicState {
  awarenessLevel: number; // 0-100
  lucidMoments: DreamMoment[];
  realityGlitches: number;
  protagonistMemories: Memory[];
  hospitalSceneUnlocked: boolean;
  hospitalSceneProgress: number;
  multiplayerDreamSpace: boolean;
  
  // New dream logic features
  recursiveDreams: RecursiveDream[];
  realityFragments: RealityFragment[];
  timeDistortions: TimeDistortion[];
}

export interface DreamMoment {
  id: string;
  description: string;
  triggerEvent: string;
  awarenessIncrease: number;
  unlockConditions: string[];
  emotionalImpact: number;
  timestamp: Date;
}

export interface RecursiveDream {
  id: string;
  level: number; // How deep in the dream recursion
  description: string;
  exitConditions: string[];
  consequencesForReality: RealityConsequence[];
}

export interface RealityFragment {
  id: string;
  content: string;
  truthLevel: number; // How close to actual reality
  playerDiscovered: boolean;
  linkedMemories: Memory[];
}

// ===== SEASON MANAGEMENT =====

export interface SeasonManager {
  currentSeason?: Season;
  previousSeasons: Season[];
  isLoading: boolean;
  
  // Season management methods would be in hooks
}

export interface Season {
  id: string;
  year: number;
  era: HistoricalEra;
  currentWeek: number;
  totalWeeks: number;
  
  // Season content
  upcomingMatches: Match[];
  completedMatches: Match[];
  seasonGoals: SeasonGoal[];
  
  // Progress tracking
  playerStats: PlayerSeasonStats;
  dreamLogicState: DreamLogicState;
  lastSaved: Date;
}

export interface SeasonGoal {
  id: string;
  title: string;
  description: string;
  type: 'wins' | 'revenue' | 'reputation' | 'expansion' | 'legacy';
  target: number;
  current: number;
  reward: GoalReward;
  deadline?: Date;
}

export interface GoalReward {
  type: 'funds' | 'reputation' | 'unlock' | 'bonus';
  value: number;
  description: string;
}

// ===== PROGRESSION SYSTEM =====

export interface EraProgression {
  currentEra: string;
  currentYear: number;
  nextEraUnlock: EraUnlock;
  completedEras: string[];
  eraPoints: number;
  
  // Unlock conditions
  unlockedFeatures: UnlockedFeature[];
  availableTransitions: EraTransition[];
}

export interface EraUnlock {
  eraName: string;
  requiredYear: number;
  requiredReputation: number;
  requiredLegacyPoints: number;
  requiredAchievements: Achievement[];
}

export interface UnlockedFeature {
  id: string;
  name: string;
  type: 'career' | 'industry' | 'technology' | 'venue' | 'mechanic';
  unlockedDate: Date;
  unlockCondition: string;
}

export interface EraTransition {
  fromEra: string;
  toEra: string;
  transitionYear: number;
  automaticChanges: string[];
  playerChoices: TransitionChoice[];
}

export interface TransitionChoice {
  id: string;
  title: string;
  description: string;
  consequences: string[];
  requirements?: string[];
}

// ===== PLAYER & RELATIONSHIP SYSTEM =====

export interface PlayerProfile {
  name: string;
  companyName: string;
  avatar: string;
  startingEra: string;
  preferences: PlayerPreferences;
  
  // Career progression
  totalPlaytime: number;
  achievementsUnlocked: Achievement[];
  favoriteCareerPath?: CareerType;
  
  // Social features
  friends: PlayerConnection[];
  sharedDreams?: SharedDream[];
}

export interface PlayerPreferences {
  favoriteIndustry: string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  focusAreas: string[];
  startingBonus: number;
}

export interface PlayerConnection {
  playerId: string;
  playerName: string;
  relationshipType: 'friend' | 'rival' | 'business-partner';
  sharedHistory: SharedEvent[];
}

// ===== SHARED EVENTS & MULTIPLAYER =====

export interface SharedEvent {
  id: string;
  type: 'competition' | 'collaboration' | 'dream-share' | 'business-deal';
  participants: string[];
  outcome: string;
  legacyImpact: number;
  dreamLogicSignificance: number;
  timestamp: Date;
}

export interface SharedDream {
  id: string;
  dreamerId: string;
  dreamerName: string;
  timestamp: Date;
  fragment: string;
  interpretedMeaning?: string;
  locationContext: string;
  narrativeImpact: NarrativeImpact;
  votes: DreamVote[];
  era: string;
  dreamType: 'prophetic' | 'memory' | 'nightmare' | 'lucid' | 'collective';
}

export interface NarrativeImpact {
  memoryAlterations: string[];
  aiOpponentChanges: string[];
  unlockedDialogue: string[];
  worldStateChanges: Record<string, any>;
}

// ===== UTILITY TYPES =====

export interface Employee {
  id: string;
  name: string;
  role: string;
  skill: number;
  loyalty: number;
  salary: number;
  hiredDate: Date;
  specializations: string[];
  era: string;
  personality: string;
  background: string;
}

export interface Technology {
  id: string;
  name: string;
  description: string;
  era: string;
  cost: number;
  adoptionYear: number;
  businessImpact: number;
  obsolescenceYear?: number;
}

export interface Partnership {
  id: string;
  partnerName: string;
  type: 'media' | 'venue' | 'sponsor' | 'regulatory' | 'international';
  strength: number;
  startYear: number;
  benefits: string[];
  obligations: string[];
  era: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  achievedDate?: Date;
  requirements: string[];
  rewards: string[];
}

export interface Project {
  id: string;
  title: string;
  type: string;
  status: 'planning' | 'in-progress' | 'completed' | 'cancelled';
  startDate: Date;
  deadline?: Date;
  budget?: number;
  expectedReturn?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedDate?: Date;
  requirements: string[];
}

// ===== ADDITIONAL SUPPORTING TYPES =====

export interface Memory {
  id: string;
  era: string;
  description: string;
  emotional: boolean;
  clarity: number;
  linkedToReality: boolean;
  hospitalConnection?: string;
}

export interface Award {
  id: string;
  name: string;
  category: string;
  year: number;
  prestige: number;
}

export interface ProfessionalRelationship {
  id: string;
  personName: string;
  relationship: string;
  strength: number;
  industry: string;
  benefits: string[];
}

export interface CastingRelationship {
  directorId: string;
  directorName: string;
  relationshipStrength: number;
  projectsWorkedTogether: number;
  lastProject?: string;
}

export interface PublicImage {
  likability: number;
  controversy: number;
  marketability: number;
  trendsFollowing: string[];
  fanDemographics: FanDemographic[];
}

export interface FanDemographic {
  ageGroup: string;
  region: string;
  percentage: number;
  engagement: number;
}

export interface PlayerSeasonStats {
  wins: number;
  losses: number;
  draws: number;
  winPercentage: number;
  fanBase: number;
  revenue: number;
  reputation: number;
}

export interface HistoricalEvent {
  id: string;
  name: string;
  year: number;
  impact: string;
  affectedIndustries: string[];
  businessOpportunities: string[];
  socialChanges: string[];
}

export interface TimeDistortion {
  id: string;
  type: 'loop' | 'skip' | 'rewind' | 'branch';
  description: string;
  triggerConditions: string[];
  affectedTimeframe: string;
  playerAwareness: boolean;
}

export interface RealityConsequence {
  type: 'memory_alteration' | 'world_change' | 'character_change' | 'timeline_shift';
  description: string;
  permanence: 'temporary' | 'until_next_dream' | 'permanent';
  affectedSystems: string[];
}

export interface DreamVote {
  voterId: string;
  voterName: string;
  interpretation: string;
  confidence: number;
  timestamp: Date;
}

export interface MusicianCareer {
  albums: Album[];
  tours: Tour[];
  collaborations: Collaboration[];
  recordLabel?: string;
  fanBase: FanBase;
  musicalSkills: MusicalSkills;
}

export interface Album {
  id: string;
  title: string;
  releaseYear: number;
  genre: string;
  sales: number;
  criticalRating: number;
  chartPosition?: number;
}

export interface Tour {
  id: string;
  name: string;
  year: number;
  venues: string[];
  totalAttendance: number;
  revenue: number;
}

export interface Collaboration {
  id: string;
  collaboratorName: string;
  projectName: string;
  type: 'song' | 'album' | 'tour' | 'performance';
  year: number;
  success: number;
}

export interface FanBase {
  total: number;
  demographics: FanDemographic[];
  loyalty: number;
  growth: number;
}

export interface MusicalSkills {
  vocals: number;
  instrument: number;
  songwriting: number;
  production: number;
  performance: number;
  collaboration: number;
}

export interface BusinessCareer {
  companies: Company[];
  investments: Investment[];
  boardPositions: BoardPosition[];
  businessSkills: BusinessSkills;
  networkConnections: BusinessConnection[];
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  foundedYear: number;
  role: 'founder' | 'ceo' | 'executive' | 'advisor';
  valuation: number;
  employees: number;
  status: 'startup' | 'growing' | 'established' | 'public' | 'sold' | 'failed';
}

export interface Investment {
  id: string;
  target: string;
  amount: number;
  currentValue: number;
  roi: number;
  investmentDate: Date;
  exitDate?: Date;
}

export interface BoardPosition {
  companyName: string;
  role: string;
  compensation: number;
  startDate: Date;
  endDate?: Date;
}

export interface BusinessSkills {
  leadership: number;
  strategy: number;
  finance: number;
  marketing: number;
  operations: number;
  networking: number;
  negotiation: number;
  innovation: number;
}

export interface BusinessConnection {
  name: string;
  position: string;
  company: string;
  relationshipStrength: number;
  industry: string;
  canProvide: string[];
}

export interface InfluencerCareer {
  platforms: SocialPlatform[];
  contentCreation: ContentCreationSkills;
  brandPartnerships: BrandPartnership[];
  merchandising: MerchandisingData;
  audienceMetrics: AudienceMetrics;
}

export interface SocialPlatform {
  name: string;
  followers: number;
  engagement: number;
  contentType: string[];
  monthlyViews: number;
  revenue: number;
}

export interface ContentCreationSkills {
  videography: number;
  photography: number;
  writing: number;
  editing: number;
  trend_awareness: number;
  authenticity: number;
}

export interface BrandPartnership {
  brandName: string;
  dealValue: number;
  duration: number;
  deliverables: string[];
  performance: number;
}

export interface MerchandisingData {
  products: Product[];
  totalSales: number;
  profitMargin: number;
}

export interface Product {
  name: string;
  type: string;
  unitsSold: number;
  revenue: number;
  profitMargin: number;
}

export interface AudienceMetrics {
  totalFollowers: number;
  engagementRate: number;
  demographics: FanDemographic[];
  growthRate: number;
  reachPotential: number;
}
