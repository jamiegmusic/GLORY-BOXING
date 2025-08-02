export interface MatchEvent {
  timestamp: string;
  round: number;
  timeInRound: string;
  action: 'punch' | 'block' | 'dodge' | 'clinched' | 'slip' | 'counter' | 'feint' | 'knockdown' | 'standingEight' | 'cornerAdvice';
  fighter: string;
  target?: string;
  impact?: 'light' | 'medium' | 'heavy' | 'critical';
  location?: 'head' | 'body' | 'arms' | 'legs';
  eventType?: 'offense' | 'defense' | 'tactical';
  description?: string;
  combo?: boolean;
  comboCount?: number;
}

export interface RoundScore {
  round: number;
  fighterA: number;
  fighterB: number;
  highlights: string[];
}

export interface MatchSchema {
  id: string;
  fighterA: {
    name: string;
    record: string;
    stats: {
      power: number;
      speed: number;
      defense: number;
      stamina: number;
      chin: number;
    };
  };
  fighterB: {
    name: string;
    record: string;
    stats: {
      power: number;
      speed: number;
      defense: number;
      stamina: number;
      chin: number;
    };
  };
  venue: string;
  date: string;
  weightClass: string;
  titleFight: boolean;
  belt?: string;
  rounds: number;
  events: MatchEvent[];
  roundScores: RoundScore[];
  result: {
    winner: string;
    method: 'decision' | 'ko' | 'tko' | 'draw' | 'no_contest';
    round?: number;
    timeInRound?: string;
    scorecard?: {
      judge1: { fighterA: number; fighterB: number };
      judge2: { fighterA: number; fighterB: number };
      judge3: { fighterA: number; fighterB: number };
    };
  };
  commentary?: string;
  highlights: string[];
  crowdReaction: number; // 1-10
  fightRating: number; // 1-10
}

export interface CommentaryRequest {
  schema: MatchSchema;
  style?: 'aggressive' | 'analytical' | 'neutral';
  focus?: 'technical' | 'drama' | 'balanced';
}

export interface CommentaryResponse {
  commentary: string;
  highlights: string[];
  roundByRound: string[];
  analysis: string;
  rating: number;
} 