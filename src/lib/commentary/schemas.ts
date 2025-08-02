// Enhanced Event Schema for Sports Commentary AI
export interface FightEvent {
  id: string;
  timestamp: number;
  round: number;
  eventType: 
    | 'punch' | 'block' | 'dodge' | 'knockdown' | 'cut' | 'foul' 
    | 'round_end' | 'fight_end' | 'clinch' | 'slip' | 'warning'
    | 'timeout' | 'doctor_check' | 'referee_action' | 'corner_advice';
  fighter: 'fighter_a' | 'fighter_b';
  details: {
    // Combat events
    punchType?: 'jab' | 'cross' | 'hook' | 'uppercut' | 'body' | 'head' | 'overhand' | 'straight';
    punchLocation?: 'head' | 'body' | 'arms' | 'legs' | 'ribs' | 'liver' | 'chin';
    damageLevel?: 'light' | 'medium' | 'heavy' | 'critical' | 'devastating';
    accuracy?: number; // 0-100
    power?: number; // 0-100
    blockType?: 'high' | 'low' | 'cross' | 'parry' | 'slipping';
    dodgeType?: 'slip' | 'duck' | 'step_back' | 'roll' | 'weave' | 'bob';
    knockdownType?: 'flash' | 'heavy' | 'technical' | 'standing';
    cutLocation?: 'eye' | 'nose' | 'mouth' | 'brow' | 'cheek' | 'ear';
    foulType?: 'low_blow' | 'headbutt' | 'holding' | 'pushing' | 'elbow' | 'knee';
    
    // Non-combat events
    clinchType?: 'defensive' | 'offensive' | 'break' | 'dirty_boxing';
    slipType?: 'defensive' | 'offensive' | 'counter_opportunity';
    warningType?: 'verbal' | 'point_deduction' | 'disqualification';
    timeoutReason?: 'injury' | 'equipment' | 'referee_discretion';
    doctorCheckReason?: 'cut' | 'swelling' | 'concussion' | 'injury';
    refereeAction?: 'warning' | 'point_deduction' | 'break' | 'stop_fight';
    cornerAdvice?: 'technical' | 'motivational' | 'strategic' | 'recovery';
    
    // Scoring and analysis
    roundScore?: {
      fighter_a: number;
      fighter_b: number;
      judge1?: { fighter_a: number; fighter_b: number };
      judge2?: { fighter_a: number; fighter_b: number };
      judge3?: { fighter_a: number; fighter_b: number };
    };
    commentary?: string;
    
    // Environmental and context
    crowdReaction?: 'cheer' | 'boo' | 'silence' | 'roar' | 'gasp' | 'applause';
    significance?: 'routine' | 'notable' | 'significant' | 'decisive' | 'historic';
    mediaUrl?: string; // For highlights or replays
    liveMetadata?: {
      network?: string;
      commentator?: string;
      timeRemaining?: number;
      roundTime?: number;
    };
  };
}

// Extended Fighter Metadata
export interface FighterRecord {
  wins: number;
  losses: number;
  draws: number;
  noContests?: number;
  knockouts?: number;
  submissions?: number;
  decisions?: number;
}

export interface FighterStats {
  staminaRating: number; // 1-100
  powerRating: number; // 1-100
  speedRating: number; // 1-100
  techniqueRating: number; // 1-100
  chinRating: number; // 1-100
  footworkRating: number; // 1-100
  iqRating: number; // 1-100
}

export interface FighterMetadata {
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
  favoredByBetting?: number; // decimal odds
  ranking?: number;
  titleHolder?: boolean;
  titleType?: string;
  previousFights?: Array<{
    opponent: string;
    result: 'win' | 'loss' | 'draw';
    method: string;
    date: string;
  }>;
  strengths: string[];
  weaknesses: string[];
  fightingStyle: string;
  signatureMoves?: string[];
  injuryHistory?: Array<{
    injury: string;
    date: string;
    recoveryTime?: string;
  }>;
}

// Enhanced Match Context
export interface RingsideStats {
  temperature: number; // Celsius
  humidity: number; // percentage
  venueCapacity: number;
  attendance: number;
  altitude?: number; // for high-altitude venues
  airQuality?: number; // AQI
  lighting?: 'bright' | 'dim' | 'spotlight';
  ringSize?: 'standard' | 'large' | 'small';
}

export interface PreFightContext {
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
  expertPredictions?: Array<{
    expert: string;
    prediction: 'fighter_a' | 'fighter_b' | 'draw';
    reasoning: string;
  }>;
}

export interface SponsorContext {
  sponsorMentions: string[];
  sponsorLogos?: string[];
  commercialBreaks?: Array<{
    time: number;
    sponsor: string;
    duration: number;
  }>;
  brandedContent?: Array<{
    type: 'replay' | 'statistic' | 'highlight';
    sponsor: string;
    content: string;
  }>;
}

// Complete Fight Data Structure
export interface EnhancedFightData {
  fightId: string;
  eventName: string;
  date: string;
  venue: string;
  location: string;
  title?: string;
  weightClass: string;
  rounds: number;
  scheduledDuration: number; // minutes
  
  fighters: {
    fighterA: FighterMetadata;
    fighterB: FighterMetadata;
  };
  
  preFightContext: PreFightContext;
  ringsideStats: RingsideStats;
  sponsorContext: SponsorContext;
  
  events: FightEvent[];
  
  result?: {
    winner: 'fighter_a' | 'fighter_b' | 'draw' | 'no_contest';
    method: 'decision' | 'ko' | 'tko' | 'dqd' | 'draw' | 'no_contest';
    round?: number;
    time?: string;
    scorecard?: {
      judge1: { fighter_a: number; fighter_b: number };
      judge2: { fighter_a: number; fighter_b: number };
      judge3: { fighter_a: number; fighter_b: number };
    };
    finalScore?: {
      fighter_a: number;
      fighter_b: number;
    };
  };
  
  metadata: {
    broadcastNetwork?: string;
    commentators?: string[];
    productionQuality?: 'standard' | 'premium' | 'ppv';
    audienceType?: 'casual' | 'hardcore' | 'mixed';
    historicalSignificance?: string;
  };
}

// Event Type Guards and Utilities
export const isCombatEvent = (event: FightEvent): boolean => {
  return ['punch', 'block', 'dodge', 'knockdown', 'cut', 'foul'].includes(event.eventType);
};

export const isScoringEvent = (event: FightEvent): boolean => {
  return event.eventType === 'round_end' && event.details.roundScore !== undefined;
};

export const isSignificantEvent = (event: FightEvent): boolean => {
  return event.details.significance === 'significant' || event.details.significance === 'decisive';
};

export const getEventDescription = (event: FightEvent): string => {
  const { eventType, details } = event;
  
  switch (eventType) {
    case 'punch':
      return `${details.punchType} to the ${details.punchLocation}`;
    case 'knockdown':
      return `${details.knockdownType} knockdown`;
    case 'cut':
      return `Cut on the ${details.cutLocation}`;
    case 'foul':
      return `${details.foulType} foul`;
    case 'clinch':
      return `${details.clinchType} clinch`;
    case 'warning':
      return `${details.warningType} warning`;
    case 'doctor_check':
      return `Doctor check for ${details.doctorCheckReason}`;
    default:
      return eventType.replace('_', ' ');
  }
};

// Validation Schemas
export const validateFightEvent = (event: FightEvent): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!event.id || event.id.length === 0) {
    errors.push('Event ID is required');
  }
  
  if (event.timestamp < 0) {
    errors.push('Timestamp must be positive');
  }
  
  if (event.round < 1) {
    errors.push('Round must be at least 1');
  }
  
  if (!['fighter_a', 'fighter_b'].includes(event.fighter)) {
    errors.push('Fighter must be fighter_a or fighter_b');
  }
  
  // Validate combat event details
  if (isCombatEvent(event)) {
    if (event.details.accuracy !== undefined && (event.details.accuracy < 0 || event.details.accuracy > 100)) {
      errors.push('Accuracy must be between 0 and 100');
    }
    
    if (event.details.power !== undefined && (event.details.power < 0 || event.details.power > 100)) {
      errors.push('Power must be between 0 and 100');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateFighterMetadata = (fighter: FighterMetadata): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!fighter.name || fighter.name.length === 0) {
    errors.push('Fighter name is required');
  }
  
  if (fighter.stats.staminaRating < 1 || fighter.stats.staminaRating > 100) {
    errors.push('Stamina rating must be between 1 and 100');
  }
  
  if (fighter.stats.powerRating < 1 || fighter.stats.powerRating > 100) {
    errors.push('Power rating must be between 1 and 100');
  }
  
  if (fighter.favoredByBetting !== undefined && fighter.favoredByBetting <= 1) {
    errors.push('Betting odds must be greater than 1');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}; 