// AI Commentary Engine - Event Schema Definition
// This schema captures both granular in-round events and high-level match outcomes
// It gives AI the data needed to generate context-rich narrative recaps

export interface FightEvent {
  id: string;
  timestamp: number; // seconds from round start
  round: number;
  eventType: FightEventType;
  fighter: 'fighter_a' | 'fighter_b';
  details: EventDetails;
  crowdReaction?: CrowdReaction;
  significance?: EventSignificance;
  metadata?: {
    roundTime?: number; // seconds remaining in round
    totalFightTime?: number; // cumulative fight time
    energyLevel?: number; // 0-100 for both fighters
    ringPosition?: 'center' | 'corner' | 'ropes' | 'neutral';
  };
}

export type FightEventType = 
  | 'punch' 
  | 'block' 
  | 'dodge' 
  | 'knockdown' 
  | 'cut' 
  | 'foul' 
  | 'round_start'
  | 'round_end' 
  | 'fight_end'
  | 'timeout'
  | 'corner_advice'
  | 'referee_warning'
  | 'ring_entrance'
  | 'ring_exit';

export interface EventDetails {
  // Punch Events
  punchType?: PunchType;
  punchLocation?: PunchLocation;
  damageLevel?: DamageLevel;
  accuracy?: number; // 0-100
  power?: number; // 0-100
  comboCount?: number; // number of consecutive punches
  counterPunch?: boolean;
  
  // Defensive Events
  blockType?: BlockType;
  dodgeType?: DodgeType;
  parryType?: 'high' | 'low' | 'cross';
  
  // Knockdown Events
  knockdownType?: KnockdownType;
  knockdownCount?: number; // which knockdown of the round
  recoveryTime?: number; // seconds to get up
  
  // Injury Events
  cutLocation?: CutLocation;
  cutSeverity?: 'minor' | 'moderate' | 'severe';
  swellingLocation?: 'eye' | 'cheek' | 'nose' | 'mouth';
  
  // Foul Events
  foulType?: FoulType;
  foulSeverity?: 'warning' | 'point_deduction' | 'disqualification';
  refereeAction?: 'warning' | 'point_deduction' | 'disqualification';
  
  // Round/Fight Events
  roundScore?: {
    fighter_a: number;
    fighter_b: number;
  };
  methodOfVictory?: MethodOfVictory;
  timeOfVictory?: string; // "2:34" format
  
  // Commentary
  commentary?: string;
  technicalNotes?: string;
  crowdReactionDescription?: string;
}

export type PunchType = 
  | 'jab' 
  | 'cross' 
  | 'hook' 
  | 'uppercut' 
  | 'body' 
  | 'head'
  | 'overhand'
  | 'straight'
  | 'chopping_right'
  | 'chopping_left';

export type PunchLocation = 
  | 'head' 
  | 'body' 
  | 'arms' 
  | 'legs'
  | 'temple'
  | 'jaw'
  | 'nose'
  | 'eye'
  | 'ribs'
  | 'liver'
  | 'kidney';

export type DamageLevel = 
  | 'light' 
  | 'medium' 
  | 'heavy' 
  | 'critical'
  | 'devastating';

export type BlockType = 
  | 'high' 
  | 'low' 
  | 'cross'
  | 'shell'
  | 'peek_a_boo';

export type DodgeType = 
  | 'slip' 
  | 'duck' 
  | 'step_back' 
  | 'roll'
  | 'bob'
  | 'weave'
  | 'pull_back';

export type KnockdownType = 
  | 'flash' 
  | 'heavy' 
  | 'technical'
  | 'devastating'
  | 'accumulation';

export type CutLocation = 
  | 'eye' 
  | 'nose' 
  | 'mouth' 
  | 'brow'
  | 'cheek'
  | 'ear'
  | 'chin';

export type FoulType = 
  | 'low_blow' 
  | 'headbutt' 
  | 'holding' 
  | 'pushing'
  | 'hitting_after_bell'
  | 'hitting_on_break'
  | 'spitting'
  | 'biting'
  | 'kicking'
  | 'elbowing';

export type MethodOfVictory = 
  | 'decision' 
  | 'ko' 
  | 'tko' 
  | 'dqd' 
  | 'draw'
  | 'technical_draw'
  | 'no_contest';

export type CrowdReaction = 
  | 'cheer' 
  | 'boo' 
  | 'silence' 
  | 'roar'
  | 'gasp'
  | 'applause'
  | 'mixed';

export type EventSignificance = 
  | 'routine' 
  | 'notable' 
  | 'significant' 
  | 'decisive'
  | 'fight_changing'
  | 'historic';

// Fighter Information Schema
export interface Fighter {
  id: string;
  name: string;
  record: string; // "W-L-D"
  nickname?: string;
  age: number;
  height: string;
  reach: string;
  weight: number;
  stance: 'orthodox' | 'southpaw' | 'switch';
  style: string;
  strengths: string[];
  weaknesses: string[];
  trainer: string;
  promoter: string;
  nationality: string;
  hometown: string;
  ranking?: number;
  titles?: string[];
  stats: {
    totalFights: number;
    wins: number;
    losses: number;
    draws: number;
    kos: number;
    tkos: number;
    decisions: number;
    koPercentage: number;
  };
}

// Complete Fight Data Schema
export interface FightData {
  fightId: string;
  eventName: string;
  venue: string;
  date: string;
  time: string;
  title?: string;
  weightClass: string;
  rounds: number;
  roundLength: number; // minutes
  fighterA: Fighter;
  fighterB: Fighter;
  referee: string;
  judges: string[];
  promoter: string;
  broadcast: string;
  attendance?: number;
  gate?: number;
  events: FightEvent[];
  result?: FightResult;
  statistics?: FightStatistics;
  commentary?: CommentaryData;
}

export interface FightResult {
  winner: 'fighter_a' | 'fighter_b' | 'draw';
  method: MethodOfVictory;
  round?: number;
  time?: string; // "2:34" format
  scorecard?: {
    judge1: { fighter_a: number; fighter_b: number };
    judge2: { fighter_a: number; fighter_b: number };
    judge3: { fighter_a: number; fighter_b: number };
  };
  notes?: string;
}

export interface FightStatistics {
  totalPunches: {
    fighter_a: number;
    fighter_b: number;
  };
  landedPunches: {
    fighter_a: number;
    fighter_b: number;
  };
  punchAccuracy: {
    fighter_a: number;
    fighter_b: number;
  };
  powerPunches: {
    fighter_a: number;
    fighter_b: number;
  };
  jabs: {
    fighter_a: number;
    fighter_b: number;
  };
  bodyShots: {
    fighter_a: number;
    fighter_b: number;
  };
  knockdowns: {
    fighter_a: number;
    fighter_b: number;
  };
  cuts: {
    fighter_a: number;
    fighter_b: number;
  };
  fouls: {
    fighter_a: number;
    fighter_b: number;
  };
}

export interface CommentaryData {
  playByPlay: string[];
  roundSummaries: string[];
  fightSummary: string;
  highlights: string[];
  technicalAnalysis: string[];
  crowdReactions: string[];
  refereeCalls: string[];
  cornerAdvice: string[];
}

// AI Commentary Generation Schema
export interface CommentaryRequest {
  fightData: FightData;
  style: 'technical' | 'dramatic' | 'casual' | 'expert' | 'colorful';
  focus: 'play_by_play' | 'analysis' | 'entertainment' | 'technical' | 'mixed';
  language: string;
  targetAudience: 'casual' | 'expert' | 'mixed';
  includeStatistics: boolean;
  includeHistoricalContext: boolean;
  maxLength?: number;
}

export interface CommentaryResponse {
  commentary: string[];
  roundSummaries: string[];
  fightSummary: string;
  highlights: string[];
  technicalNotes: string[];
  statistics: string[];
  metadata: {
    totalEvents: number;
    significantEvents: number;
    roundsCovered: number;
    generationTime: number;
    style: string;
  };
}

// Utility Functions for Schema Validation
export const validateFightEvent = (event: FightEvent): boolean => {
  // Basic validation
  if (!event.id || !event.timestamp || !event.round || !event.eventType || !event.fighter) {
    return false;
  }
  
  // Event-specific validation
  switch (event.eventType) {
    case 'punch':
      return !!(event.details.punchType && event.details.punchLocation);
    case 'block':
      return !!event.details.blockType;
    case 'dodge':
      return !!event.details.dodgeType;
    case 'knockdown':
      return !!event.details.knockdownType;
    case 'cut':
      return !!(event.details.cutLocation && event.details.cutSeverity);
    case 'foul':
      return !!(event.details.foulType && event.details.foulSeverity);
    default:
      return true;
  }
};

export const calculateFightStatistics = (events: FightEvent[]): FightStatistics => {
  const stats: FightStatistics = {
    totalPunches: { fighter_a: 0, fighter_b: 0 },
    landedPunches: { fighter_a: 0, fighter_b: 0 },
    punchAccuracy: { fighter_a: 0, fighter_b: 0 },
    powerPunches: { fighter_a: 0, fighter_b: 0 },
    jabs: { fighter_a: 0, fighter_b: 0 },
    bodyShots: { fighter_a: 0, fighter_b: 0 },
    knockdowns: { fighter_a: 0, fighter_b: 0 },
    cuts: { fighter_a: 0, fighter_b: 0 },
    fouls: { fighter_a: 0, fighter_b: 0 }
  };

  events.forEach(event => {
    const fighter = event.fighter;
    
    if (event.eventType === 'punch') {
      stats.totalPunches[fighter]++;
      if (event.details.accuracy && event.details.accuracy > 50) {
        stats.landedPunches[fighter]++;
      }
      if (event.details.punchType === 'jab') {
        stats.jabs[fighter]++;
      }
      if (event.details.punchLocation === 'body') {
        stats.bodyShots[fighter]++;
      }
      if (event.details.power && event.details.power > 70) {
        stats.powerPunches[fighter]++;
      }
    } else if (event.eventType === 'knockdown') {
      stats.knockdowns[fighter]++;
    } else if (event.eventType === 'cut') {
      stats.cuts[fighter]++;
    } else if (event.eventType === 'foul') {
      stats.fouls[fighter]++;
    }
  });

  // Calculate accuracy percentages
  stats.punchAccuracy.fighter_a = stats.totalPunches.fighter_a > 0 
    ? (stats.landedPunches.fighter_a / stats.totalPunches.fighter_a) * 100 
    : 0;
  stats.punchAccuracy.fighter_b = stats.totalPunches.fighter_b > 0 
    ? (stats.landedPunches.fighter_b / stats.totalPunches.fighter_b) * 100 
    : 0;

  return stats;
};

export default {
  validateFightEvent,
  calculateFightStatistics
};
