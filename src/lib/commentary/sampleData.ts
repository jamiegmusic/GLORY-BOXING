import { EnhancedFightData, FightEvent, FighterMetadata } from './schemas';

// Sample Enhanced Fighter Data
export const sampleFighterA: FighterMetadata = {
  id: 'fighter-001',
  name: 'Mike "Iron" Tyson',
  nickname: 'Iron Mike',
  record: {
    wins: 50,
    losses: 6,
    draws: 0,
    knockouts: 44,
    submissions: 0,
    decisions: 6,
  },
  weightClass: 'Heavyweight',
  height: "5'10\"",
  reach: '71in',
  age: 57,
  nationality: 'American',
  hometown: 'Brooklyn, NY',
  gym: 'Cus D\'Amato Boxing',
  trainer: 'Cus D\'Amato',
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
  ranking: 1,
  titleHolder: true,
  titleType: 'WBC Heavyweight',
  previousFights: [
    {
      opponent: 'Evander Holyfield',
      result: 'loss',
      method: 'TKO',
      date: '1997-06-28',
    },
    {
      opponent: 'Frank Bruno',
      result: 'win',
      method: 'KO',
      date: '1996-03-16',
    },
  ],
  strengths: ['Devastating power', 'Aggressive style', 'Intimidation factor', 'Peek-a-boo defense'],
  weaknesses: ['Susceptible to body shots', 'Can be outboxed', 'Emotional fighter'],
  fightingStyle: 'Peek-a-boo with devastating power',
  signatureMoves: ['Peek-a-boo defense', 'Devastating hooks', 'Aggressive pressure'],
  injuryHistory: [
    {
      injury: 'Eye injury',
      date: '1991-02-11',
      recoveryTime: '3 months',
    },
  ],
};

export const sampleFighterB: FighterMetadata = {
  id: 'fighter-002',
  name: 'Evander "Real Deal" Holyfield',
  nickname: 'Real Deal',
  record: {
    wins: 44,
    losses: 10,
    draws: 2,
    knockouts: 29,
    submissions: 0,
    decisions: 15,
  },
  weightClass: 'Heavyweight',
  height: "6'2\"",
  reach: '78in',
  age: 61,
  nationality: 'American',
  hometown: 'Atmore, AL',
  gym: 'Holyfield Boxing',
  trainer: 'Lou Duva',
  stats: {
    staminaRating: 90,
    powerRating: 85,
    speedRating: 82,
    techniqueRating: 88,
    chinRating: 85,
    footworkRating: 85,
    iqRating: 90,
  },
  favoredByBetting: 2.2,
  ranking: 2,
  titleHolder: false,
  previousFights: [
    {
      opponent: 'Mike Tyson',
      result: 'win',
      method: 'TKO',
      date: '1997-06-28',
    },
    {
      opponent: 'Riddick Bowe',
      result: 'loss',
      method: 'Decision',
      date: '1995-11-04',
    },
  ],
  strengths: ['Technical boxing', 'Excellent stamina', 'Smart fighter', 'Good chin'],
  weaknesses: ['Can be outmuscled', 'Not the biggest puncher', 'Age factor'],
  fightingStyle: 'Technical boxer with good power',
  signatureMoves: ['Technical combinations', 'Smart defense', 'Conditioning'],
  injuryHistory: [
    {
      injury: 'Shoulder injury',
      date: '1993-05-15',
      recoveryTime: '6 months',
    },
  ],
};

// Sample Enhanced Fight Data
export const sampleEnhancedFightData: EnhancedFightData = {
  fightId: 'tyson-holyfield-1997-rematch',
  eventName: 'Tyson vs Holyfield II',
  date: '1997-06-28',
  venue: 'MGM Grand Garden Arena',
  location: 'Las Vegas, NV',
  title: 'WBA Heavyweight Championship',
  weightClass: 'Heavyweight',
  rounds: 12,
  scheduledDuration: 36, // minutes
  
  fighters: {
    fighterA: sampleFighterA,
    fighterB: sampleFighterB,
  },
  
  preFightContext: {
    preFightComments: {
      fighterA: "I'm coming to dominate and take back what's mine. Holyfield won't last 3 rounds.",
      fighterB: "I've studied his weaknesses. I'm ready for anything he brings. This is my time.",
    },
    pressConferenceHighlights: [
      'Tyson promises early knockout',
      'Holyfield confident in his game plan',
      'Tense staredown at weigh-in',
    ],
    weighInResults: {
      fighterA: 218,
      fighterB: 215,
    },
    staredownIntensity: 'hostile',
    bettingOdds: {
      fighterA: 1.8,
      fighterB: 2.2,
      draw: 25.0,
    },
    expertPredictions: [
      {
        expert: 'Larry Merchant',
        prediction: 'fighter_a',
        reasoning: 'Tyson\'s power and aggression will be too much for Holyfield.',
      },
      {
        expert: 'Jim Lampley',
        prediction: 'fighter_b',
        reasoning: 'Holyfield\'s technical skills and experience will prevail.',
      },
    ],
  },
  
  ringsideStats: {
    temperature: 22,
    humidity: 45,
    venueCapacity: 16500,
    attendance: 16331,
    altitude: 2000, // Las Vegas elevation
    airQuality: 45, // Good AQI
    lighting: 'bright',
    ringSize: 'standard',
  },
  
  sponsorContext: {
    sponsorMentions: ['Showtime', 'MGM Grand', 'Everlast', 'Budweiser'],
    sponsorLogos: ['showtime-logo.png', 'mgm-logo.png'],
    commercialBreaks: [
      {
        time: 180,
        sponsor: 'Budweiser',
        duration: 30,
      },
      {
        time: 540,
        sponsor: 'Everlast',
        duration: 30,
      },
    ],
    brandedContent: [
      {
        type: 'statistic',
        sponsor: 'Showtime',
        content: 'Tyson has 44 KOs in 50 wins',
      },
      {
        type: 'highlight',
        sponsor: 'MGM Grand',
        content: 'Previous fight highlights',
      },
    ],
  },
  
  events: [
    // Round 1
    {
      id: 'event-1',
      timestamp: 0,
      round: 1,
      eventType: 'punch',
      fighter: 'fighter_a',
      details: {
        punchType: 'jab',
        punchLocation: 'head',
        damageLevel: 'light',
        accuracy: 75,
        power: 60,
        crowdReaction: 'cheer',
        significance: 'routine',
      },
    },
    {
      id: 'event-2',
      timestamp: 15,
      round: 1,
      eventType: 'punch',
      fighter: 'fighter_b',
      details: {
        punchType: 'cross',
        punchLocation: 'body',
        damageLevel: 'medium',
        accuracy: 85,
        power: 70,
        crowdReaction: 'applause',
        significance: 'notable',
      },
    },
    {
      id: 'event-3',
      timestamp: 45,
      round: 1,
      eventType: 'clinch',
      fighter: 'fighter_a',
      details: {
        clinchType: 'defensive',
        crowdReaction: 'silence',
        significance: 'routine',
      },
    },
    {
      id: 'event-4',
      timestamp: 60,
      round: 1,
      eventType: 'punch',
      fighter: 'fighter_a',
      details: {
        punchType: 'hook',
        punchLocation: 'head',
        damageLevel: 'heavy',
        accuracy: 80,
        power: 90,
        crowdReaction: 'roar',
        significance: 'significant',
      },
    },
    {
      id: 'event-5',
      timestamp: 90,
      round: 1,
      eventType: 'round_end',
      fighter: 'fighter_a',
      details: {
        roundScore: {
          fighter_a: 10,
          fighter_b: 9,
          judge1: { fighter_a: 10, fighter_b: 9 },
          judge2: { fighter_a: 10, fighter_b: 9 },
          judge3: { fighter_a: 10, fighter_b: 9 },
        },
        crowdReaction: 'applause',
        significance: 'routine',
      },
    },
    
    // Round 2
    {
      id: 'event-6',
      timestamp: 180,
      round: 2,
      eventType: 'punch',
      fighter: 'fighter_b',
      details: {
        punchType: 'uppercut',
        punchLocation: 'chin',
        damageLevel: 'critical',
        accuracy: 90,
        power: 85,
        crowdReaction: 'gasp',
        significance: 'decisive',
      },
    },
    {
      id: 'event-7',
      timestamp: 185,
      round: 2,
      eventType: 'knockdown',
      fighter: 'fighter_a',
      details: {
        knockdownType: 'heavy',
        crowdReaction: 'roar',
        significance: 'decisive',
        mediaUrl: 'knockdown-replay.mp4',
      },
    },
    {
      id: 'event-8',
      timestamp: 200,
      round: 2,
      eventType: 'referee_action',
      fighter: 'fighter_a',
      details: {
        refereeAction: 'break',
        crowdReaction: 'silence',
        significance: 'routine',
      },
    },
    {
      id: 'event-9',
      timestamp: 240,
      round: 2,
      eventType: 'punch',
      fighter: 'fighter_a',
      details: {
        punchType: 'overhand',
        punchLocation: 'head',
        damageLevel: 'devastating',
        accuracy: 85,
        power: 95,
        crowdReaction: 'roar',
        significance: 'decisive',
      },
    },
    {
      id: 'event-10',
      timestamp: 245,
      round: 2,
      eventType: 'knockdown',
      fighter: 'fighter_b',
      details: {
        knockdownType: 'flash',
        crowdReaction: 'roar',
        significance: 'decisive',
      },
    },
    {
      id: 'event-11',
      timestamp: 300,
      round: 2,
      eventType: 'doctor_check',
      fighter: 'fighter_b',
      details: {
        doctorCheckReason: 'concussion',
        crowdReaction: 'silence',
        significance: 'significant',
      },
    },
    {
      id: 'event-12',
      timestamp: 360,
      round: 2,
      eventType: 'fight_end',
      fighter: 'fighter_a',
      details: {
        crowdReaction: 'roar',
        significance: 'historic',
        mediaUrl: 'fight-end-replay.mp4',
        liveMetadata: {
          network: 'Showtime',
          commentator: 'Jim Lampley',
          timeRemaining: 0,
          roundTime: 180,
        },
      },
    },
  ],
  
  result: {
    winner: 'fighter_a',
    method: 'tko',
    round: 2,
    time: '2:45',
    scorecard: {
      judge1: { fighter_a: 10, fighter_b: 9 },
      judge2: { fighter_a: 10, fighter_b: 9 },
      judge3: { fighter_a: 10, fighter_b: 9 },
    },
    finalScore: {
      fighter_a: 20,
      fighter_b: 18,
    },
  },
  
  metadata: {
    broadcastNetwork: 'Showtime',
    commentators: ['Jim Lampley', 'Larry Merchant', 'George Foreman'],
    productionQuality: 'ppv',
    audienceType: 'mixed',
    historicalSignificance: 'Tyson\'s comeback victory and return to championship form',
  },
};

// Sample Event Generation Functions
export const generateSampleEvent = (
  id: string,
  timestamp: number,
  round: number,
  eventType: FightEvent['eventType'],
  fighter: 'fighter_a' | 'fighter_b',
  details: Partial<FightEvent['details']> = {}
): FightEvent => {
  return {
    id,
    timestamp,
    round,
    eventType,
    fighter,
    details: {
      crowdReaction: 'cheer',
      significance: 'routine',
      ...details,
    },
  };
};

export const generateSampleRound = (
  roundNumber: number,
  baseTimestamp: number,
  events: Array<{
    eventType: FightEvent['eventType'];
    fighter: 'fighter_a' | 'fighter_b';
    details?: Partial<FightEvent['details']>;
  }>
): FightEvent[] => {
  return events.map((event, index) => 
    generateSampleEvent(
      `round-${roundNumber}-event-${index + 1}`,
      baseTimestamp + (index * 15),
      roundNumber,
      event.eventType,
      event.fighter,
      event.details
    )
  );
};

// Utility function to create realistic fight data
export const createRealisticFightData = (
  fighterA: FighterMetadata,
  fighterB: FighterMetadata,
  eventName: string,
  venue: string
): EnhancedFightData => {
  return {
    ...sampleEnhancedFightData,
    fightId: `${fighterA.name.toLowerCase().replace(/\s+/g, '-')}-${fighterB.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    eventName,
    venue,
    fighters: {
      fighterA,
      fighterB,
    },
    events: [], // Start with empty events
  };
}; 