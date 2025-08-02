import { EventEmitter } from 'events';

// Amateur stages
export const AmateurStage = {
  YOUTH: 'youth',
  JUNIOR: 'junior',
  SENIOR: 'senior',
  ELITE: 'elite'
} as const;

export type AmateurStageValue = typeof AmateurStage[keyof typeof AmateurStage];

// Tournament types
export const TournamentType = {
  NATIONAL: 'national',
  REGIONAL: 'regional',
  INTERNATIONAL: 'international',
  OLYMPIC_QUALIFIER: 'olympic_qualifier',
  WORLD_CHAMPIONSHIP: 'world_championship',
  CONTINENTAL: 'continental'
} as const;

export type TournamentTypeValue = typeof TournamentType[keyof typeof TournamentType];

// Medal types
export const MedalType = {
  GOLD: 'gold',
  SILVER: 'silver',
  BRONZE: 'bronze'
} as const;

export type MedalTypeValue = typeof MedalType[keyof typeof MedalType];

// Fighting style origins
export const FightingStyleOrigin = {
  CUBA: 'cuba',
  RUSSIA: 'russia',
  USA: 'usa',
  UKRAINE: 'ukraine',
  KAZAKHSTAN: 'kazakhstan',
  UZBEKISTAN: 'uzbekistan',
  CHINA: 'china',
  JAPAN: 'japan',
  SOUTH_KOREA: 'south_korea',
  THAILAND: 'thailand',
  PHILIPPINES: 'philippines',
  MEXICO: 'mexico',
  PUERTO_RICO: 'puerto_rico',
  DOMINICAN_REPUBLIC: 'dominican_republic',
  UK: 'uk',
  IRELAND: 'ireland',
  GERMANY: 'germany',
  ITALY: 'italy',
  FRANCE: 'france',
  SPAIN: 'spain',
  NIGERIA: 'nigeria',
  GHANA: 'ghana',
  KENYA: 'kenya',
  SOUTH_AFRICA: 'south_africa',
  AUSTRALIA: 'australia',
  NEW_ZEALAND: 'new_zealand',
  BRAZIL: 'brazil',
  ARGENTINA: 'argentina',
  COLOMBIA: 'colombia',
  VENEZUELA: 'venezuela'
} as const;

export type FightingStyleOriginValue = typeof FightingStyleOrigin[keyof typeof FightingStyleOrigin];

// Decision points
export const DecisionPoint = {
  AGE_THRESHOLD: 'age_threshold',
  AMATEUR_ACHIEVEMENT: 'amateur_achievement',
  MARKET_DEMAND: 'market_demand',
  FINANCIAL_READINESS: 'financial_readiness',
  FAMILY_PRESSURE: 'family_pressure',
  COACH_RECOMMENDATION: 'coach_recommendation',
  INJURY_CONCERNS: 'injury_concerns',
  OPPORTUNITY_TIMING: 'opportunity_timing'
} as const;

export type DecisionPointValue = typeof DecisionPoint[keyof typeof DecisionPoint];

// Amateur career interface
export interface AmateurCareer {
  id: string;
  fighterId: string;
  startAge: number;
  endAge?: number;
  totalFights: number;
  wins: number;
  losses: number;
  draws: number;
  tournaments: Tournament[];
  achievements: Achievement[];
  development: DevelopmentStage[];
  countryStyle: CountryStyle;
  transitionFactors: TransitionFactor[];
}

export interface Tournament {
  id: string;
  name: string;
  type: TournamentTypeValue;
  location: string;
  date: Date;
  result: 'gold' | 'silver' | 'bronze' | 'participant';
  opponents: string[];
  performance: number; // 1-10
  significance: number; // 1-10
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'medal' | 'title' | 'record' | 'recognition';
  significance: number; // 1-10
  impact: string;
}

export interface DevelopmentStage {
  id: string;
  stage: AmateurStageValue;
  startDate: Date;
  endDate?: Date;
  focus: string[];
  improvements: string[];
  challenges: string[];
  coachNotes: string;
}

export interface CountryStyle {
  origin: FightingStyleOriginValue;
  characteristics: StyleCharacteristic[];
  strengths: string[];
  weaknesses: string[];
  adaptation: number; // 1-10
}

export interface StyleCharacteristic {
  name: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  intensity: number; // 1-10
}

export interface TransitionFactor {
  factor: DecisionPointValue;
  weight: number; // 1-10
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface TransitionTiming {
  recommendedAge: number;
  confidence: number; // 1-10
  factors: TransitionFactor[];
  risks: string[];
  benefits: string[];
  alternativePaths: string[];
}

export class AmateurProfessionalPathway extends EventEmitter {
  private amateurCareers: Map<string, AmateurCareer> = new Map();
  private countryStyles: Map<string, CountryStyle> = new Map();

  constructor() {
    super();
  }

  // Amateur Career Management
  public createAmateurCareer(career: Omit<AmateurCareer, 'id'>): AmateurCareer {
    const amateurCareer: AmateurCareer = {
      ...career,
      id: this.generateId()
    };

    this.amateurCareers.set(amateurCareer.id, amateurCareer);
    this.emit('amateurCareerCreated', amateurCareer);
    return amateurCareer;
  }

  public addTournament(careerId: string, tournament: Omit<Tournament, 'id'>): Tournament {
    const career = this.amateurCareers.get(careerId);
    if (!career) throw new Error('Amateur career not found');

    const newTournament: Tournament = {
      ...tournament,
      id: this.generateId()
    };

    career.tournaments.push(newTournament);
    this.amateurCareers.set(careerId, career);
    this.emit('tournamentAdded', { careerId, tournament: newTournament });
    return newTournament;
  }

  public addAchievement(careerId: string, achievement: Omit<Achievement, 'id'>): Achievement {
    const career = this.amateurCareers.get(careerId);
    if (!career) throw new Error('Amateur career not found');

    const newAchievement: Achievement = {
      ...achievement,
      id: this.generateId()
    };

    career.achievements.push(newAchievement);
    this.amateurCareers.set(careerId, career);
    this.emit('achievementAdded', { careerId, achievement: newAchievement });
    return newAchievement;
  }

  public addDevelopmentStage(careerId: string, stage: Omit<DevelopmentStage, 'id'>): DevelopmentStage {
    const career = this.amateurCareers.get(careerId);
    if (!career) throw new Error('Amateur career not found');

    const newStage: DevelopmentStage = {
      ...stage,
      id: this.generateId()
    };

    career.development.push(newStage);
    this.amateurCareers.set(careerId, career);
    this.emit('developmentStageAdded', { careerId, stage: newStage });
    return newStage;
  }

  // Career Analysis
  public evaluateTransitionTiming(currentAge: number, amateurExperience: number): TransitionTiming {
    const factors: TransitionFactor[] = [];
    let recommendedAge = 22; // Default recommendation
    let confidence = 5; // Base confidence

    // Age factor
    if (currentAge >= 25) {
      factors.push({
        factor: DecisionPoint.AGE_THRESHOLD,
        weight: 8,
        description: 'Fighter is approaching optimal transition age',
        impact: 'positive'
      });
      confidence += 2;
    } else if (currentAge < 20) {
      factors.push({
        factor: DecisionPoint.AGE_THRESHOLD,
        weight: 6,
        description: 'Fighter is young, consider more amateur experience',
        impact: 'negative'
      });
      confidence -= 2;
    }

    // Experience factor
    if (amateurExperience >= 50) {
      factors.push({
        factor: DecisionPoint.AMATEUR_ACHIEVEMENT,
        weight: 9,
        description: 'Significant amateur experience gained',
        impact: 'positive'
      });
      confidence += 3;
    } else if (amateurExperience < 20) {
      factors.push({
        factor: DecisionPoint.AMATEUR_ACHIEVEMENT,
        weight: 7,
        description: 'Limited amateur experience, need more fights',
        impact: 'negative'
      });
      confidence -= 2;
    }

    // Market demand factor
    factors.push({
      factor: DecisionPoint.MARKET_DEMAND,
      weight: 6,
      description: 'Current market conditions favorable',
      impact: 'positive'
    });

    const risks = [
      'Insufficient amateur experience',
      'Market oversaturation',
      'Financial unpreparedness',
      'Family pressure'
    ];

    const benefits = [
      'Peak physical condition',
      'Amateur success momentum',
      'Market opportunity',
      'Coach recommendation'
    ];

    const alternativePaths = [
      'Continue amateur career for 1-2 more years',
      'Focus on specific amateur tournaments',
      'Develop additional skills',
      'Build financial foundation'
    ];

    return {
      recommendedAge,
      confidence: Math.min(10, Math.max(1, confidence)),
      factors,
      risks,
      benefits,
      alternativePaths
    };
  }

  public assessTransitionRisk(career: AmateurCareer): number {
    let risk = 5; // Base risk

    // Assess based on experience
    if (career.totalFights < 30) risk += 3;
    if (career.totalFights > 100) risk -= 2;

    // Assess based on achievements
    const significantAchievements = career.achievements.filter(a => a.significance >= 7);
    if (significantAchievements.length < 3) risk += 2;
    if (significantAchievements.length > 8) risk -= 2;

    // Assess based on age
    const currentAge = career.endAge || career.startAge + 5;
    if (currentAge < 20) risk += 2;
    if (currentAge > 28) risk += 1;

    // Assess based on win rate
    const winRate = career.wins / career.totalFights;
    if (winRate < 0.6) risk += 3;
    if (winRate > 0.8) risk -= 2;

    return Math.min(10, Math.max(1, risk));
  }

  // Country Style Development
  public developCountryStyle(origin: FightingStyleOriginValue): CountryStyle {
    const characteristics: StyleCharacteristic[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Define characteristics based on origin
    switch (origin) {
      case FightingStyleOrigin.CUBA:
        characteristics.push(
          { name: 'Technical Excellence', description: 'Superior technical skills', impact: 'positive', intensity: 9 },
          { name: 'Footwork', description: 'Exceptional movement', impact: 'positive', intensity: 8 },
          { name: 'Defense', description: 'Strong defensive skills', impact: 'positive', intensity: 8 }
        );
        strengths.push('Technical boxing', 'Footwork', 'Defense');
        weaknesses.push('Power punching', 'Aggression');
        break;

      case FightingStyleOrigin.RUSSIA:
        characteristics.push(
          { name: 'Power', description: 'Strong punching power', impact: 'positive', intensity: 8 },
          { name: 'Aggression', description: 'Forward pressure', impact: 'positive', intensity: 7 },
          { name: 'Stamina', description: 'Good conditioning', impact: 'positive', intensity: 7 }
        );
        strengths.push('Power punching', 'Aggression', 'Stamina');
        weaknesses.push('Technical skills', 'Footwork');
        break;

      case FightingStyleOrigin.USA:
        characteristics.push(
          { name: 'Versatility', description: 'Adaptable style', impact: 'positive', intensity: 7 },
          { name: 'Athleticism', description: 'Natural athletic ability', impact: 'positive', intensity: 8 },
          { name: 'Power', description: 'Good punching power', impact: 'positive', intensity: 7 }
        );
        strengths.push('Versatility', 'Athleticism', 'Power');
        weaknesses.push('Technical precision', 'Defense');
        break;

      default:
        characteristics.push(
          { name: 'Balanced', description: 'Well-rounded approach', impact: 'neutral', intensity: 6 },
          { name: 'Adaptable', description: 'Can adjust style', impact: 'positive', intensity: 6 }
        );
        strengths.push('Balance', 'Adaptability');
        weaknesses.push('Specialization', 'Unique characteristics');
    }

    const countryStyle: CountryStyle = {
      origin,
      characteristics,
      strengths,
      weaknesses,
      adaptation: 7
    };

    this.countryStyles.set(origin, countryStyle);
    this.emit('countryStyleDeveloped', countryStyle);
    return countryStyle;
  }

  public applyStyleCharacteristics(style: CountryStyle): StyleCharacteristic[] {
    return style.characteristics.map(char => ({
      ...char,
      intensity: Math.min(10, char.intensity + Math.floor(Math.random() * 3))
    }));
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Getters for data access
  public getAmateurCareers(): AmateurCareer[] {
    return Array.from(this.amateurCareers.values());
  }

  public getCountryStyles(): CountryStyle[] {
    return Array.from(this.countryStyles.values());
  }
}

export const amateurProfessionalPathway = new AmateurProfessionalPathway(); 