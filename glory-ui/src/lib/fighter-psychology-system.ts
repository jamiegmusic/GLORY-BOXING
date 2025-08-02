import { EventEmitter } from 'events';

// Fighter personality traits
export enum PersonalityTrait {
  CONFIDENT = 'confident',
  ANXIOUS = 'anxious',
  AGGRESSIVE = 'aggressive',
  CALCULATED = 'calculated',
  EMOTIONAL = 'emotional',
  RESILIENT = 'resilient',
  IMPULSIVE = 'impulsive',
  DISCIPLINED = 'disciplined'
}

export interface FighterPsychology {
  id: string;
  fighterId: string;
  basePersonality: PersonalityProfile;
  currentState: MentalState;
  fightHistory: FightMentalState[];
  adaptationPatterns: AdaptationPattern[];
  behavioralEvolution: BehavioralChange[];
  archetype: FighterArchetype;
  triggers: PsychologicalTrigger[];
}

export interface PersonalityProfile {
  primaryTraits: PersonalityTrait[];
  secondaryTraits: PersonalityTrait[];
  confidence: number; // 1-10
  anxiety: number; // 1-10
  aggression: number; // 1-10
  discipline: number; // 1-10
  resilience: number; // 1-10
  adaptability: number; // 1-10
}

export interface MentalState {
  currentConfidence: number; // 1-10
  currentAnxiety: number; // 1-10
  currentAggression: number; // 1-10
  focus: number; // 1-10
  motivation: number; // 1-10
  pressureHandling: number; // 1-10
  lastUpdated: Date;
}

export interface FightMentalState {
  fightId: string;
  preFightState: MentalState;
  inFightStates: InFightState[];
  postFightState: MentalState;
  performanceImpact: number; // 1-10
  lessonsLearned: string[];
}

export interface InFightState {
  round: number;
  timeInRound: number; // seconds
  mentalState: MentalState;
  tacticalAdjustments: TacticalAdjustment[];
  emotionalResponses: EmotionalResponse[];
}

export interface TacticalAdjustment {
  type: AdjustmentType;
  reason: string;
  effectiveness: number; // 1-10
  round: number;
}

export enum AdjustmentType {
  AGGRESSIVE_TO_DEFENSIVE = 'aggressive_to_defensive',
  DEFENSIVE_TO_AGGRESSIVE = 'defensive_to_aggressive',
  COUNTER_PUNCHING = 'counter_punching',
  PRESSURE_FIGHTING = 'pressure_fighting',
  CLINCHING = 'clinch_work',
  DISTANCE_FIGHTING = 'distance_fighting'
}

export interface EmotionalResponse {
  emotion: Emotion;
  intensity: number; // 1-10
  trigger: string;
  impact: string;
}

export enum Emotion {
  FRUSTRATION = 'frustration',
  ANGER = 'anger',
  FEAR = 'fear',
  EXCITEMENT = 'excitement',
  CONFIDENCE = 'confidence',
  DESPERATION = 'desperation',
  CALMNESS = 'calmness'
}

export interface AdaptationPattern {
  pattern: string;
  frequency: number; // percentage of fights
  effectiveness: number; // 1-10
  conditions: string[];
  evolution: PatternEvolution;
}

export interface PatternEvolution {
  started: Date;
  currentEffectiveness: number; // 1-10
  trend: 'improving' | 'declining' | 'stable';
  modifications: string[];
}

export interface BehavioralChange {
  id: string;
  type: BehavioralChangeType;
  description: string;
  trigger: string;
  date: Date;
  permanence: number; // 1-10
  impact: BehavioralImpact;
}

export enum BehavioralChangeType {
  STYLE_ADAPTATION = 'style_adaptation',
  MENTAL_TOUGHNESS = 'mental_toughness',
  CONFIDENCE_SHIFT = 'confidence_shift',
  AGGRESSION_LEVEL = 'aggression_level',
  DISCIPLINE_CHANGE = 'discipline_change',
  PRESSURE_HANDLING = 'pressure_handling'
}

export interface BehavioralImpact {
  positiveChanges: string[];
  negativeChanges: string[];
  overallImpact: number; // 1-10
  affectedAreas: string[];
}

export enum FighterArchetype {
  SLOW_STARTER = 'slow_starter',
  FAST_FINISHER = 'fast_finisher',
  PRESSURE_FIGHTER = 'pressure_fighter',
  COUNTER_PUNCHER = 'counter_puncher',
  TECHNICAL_BOXER = 'technical_boxer',
  POWER_PUNCHER = 'power_puncher',
  DEFENSIVE_SPECIALIST = 'defensive_specialist',
  SWARMER = 'swarmer'
}

export interface PsychologicalTrigger {
  trigger: string;
  response: string;
  intensity: number; // 1-10
  frequency: number; // percentage of fights
  management: TriggerManagement;
}

export interface TriggerManagement {
  strategy: string;
  effectiveness: number; // 1-10
  coachInvolvement: boolean;
  mentalPreparation: string[];
}

export class FighterPsychologySystem extends EventEmitter {
  private fighterPsychologies: Map<string, FighterPsychology> = new Map();
  private archetypePatterns: Map<FighterArchetype, ArchetypePattern> = new Map();

  constructor() {
    super();
    this.initializeArchetypePatterns();
  }

  // Psychology Management
  public createFighterPsychology(psychology: Omit<FighterPsychology, 'id'>): FighterPsychology {
    const fighterPsychology: FighterPsychology = {
      ...psychology,
      id: this.generateId()
    };

    this.fighterPsychologies.set(fighterPsychology.id, fighterPsychology);
    this.emit('fighterPsychologyCreated', fighterPsychology);
    return fighterPsychology;
  }

  public updateMentalState(fighterId: string, newState: Partial<MentalState>): MentalState | null {
    const psychology = this.fighterPsychologies.get(fighterId);
    if (!psychology) return null;

    const updatedState: MentalState = {
      ...psychology.currentState,
      ...newState,
      lastUpdated: new Date()
    };

    psychology.currentState = updatedState;
    this.fighterPsychologies.set(fighterId, psychology);
    this.emit('mentalStateUpdated', { fighterId, state: updatedState });
    return updatedState;
  }

  public addFightMentalState(fighterId: string, fightState: Omit<FightMentalState, 'fightId'>): FightMentalState {
    const psychology = this.fighterPsychologies.get(fighterId);
    if (!psychology) throw new Error('Fighter psychology not found');

    const newFightState: FightMentalState = {
      ...fightState,
      fightId: this.generateId()
    };

    psychology.fightHistory.push(newFightState);
    this.analyzeFightImpact(psychology, newFightState);
    this.fighterPsychologies.set(fighterId, psychology);
    this.emit('fightMentalStateAdded', { fighterId, fightState: newFightState });
    return newFightState;
  }

  // In-Fight Adaptation
  public processInFightAdaptation(fighterId: string, round: number, timeInRound: number, currentState: MentalState): TacticalAdjustment[] {
    const psychology = this.fighterPsychologies.get(fighterId);
    if (!psychology) return [];

    const adjustments: TacticalAdjustment[] = [];
    const archetype = psychology.archetype;
    const pattern = this.archetypePatterns.get(archetype);

    if (!pattern) return adjustments;

    // Analyze current state and determine adjustments
    if (currentState.confidence < 5 && currentState.anxiety > 6) {
      adjustments.push({
        type: AdjustmentType.DEFENSIVE_TO_AGGRESSIVE,
        reason: 'Low confidence and high anxiety - switching to defensive mode',
        effectiveness: 7,
        round
      });
    }

    if (currentState.aggression > 8 && round > 6) {
      adjustments.push({
        type: AdjustmentType.AGGRESSIVE_TO_DEFENSIVE,
        reason: 'High aggression in later rounds - conserving energy',
        effectiveness: 8,
        round
      });
    }

    // Archetype-specific adjustments
    if (archetype === FighterArchetype.SLOW_STARTER && round <= 3) {
      adjustments.push({
        type: AdjustmentType.DEFENSIVE_TO_AGGRESSIVE,
        reason: 'Slow starter - building confidence in early rounds',
        effectiveness: 6,
        round
      });
    }

    if (archetype === FighterArchetype.FAST_FINISHER && round >= 8) {
      adjustments.push({
        type: AdjustmentType.PRESSURE_FIGHTING,
        reason: 'Fast finisher - increasing pressure in later rounds',
        effectiveness: 9,
        round
      });
    }

    return adjustments;
  }

  // Behavioral Evolution
  public trackBehavioralChange(fighterId: string, change: Omit<BehavioralChange, 'id'>): BehavioralChange {
    const psychology = this.fighterPsychologies.get(fighterId);
    if (!psychology) throw new Error('Fighter psychology not found');

    const behavioralChange: BehavioralChange = {
      ...change,
      id: this.generateId()
    };

    psychology.behavioralEvolution.push(behavioralChange);
    this.analyzeBehavioralImpact(psychology, behavioralChange);
    this.fighterPsychologies.set(fighterId, psychology);
    this.emit('behavioralChangeTracked', { fighterId, change: behavioralChange });
    return behavioralChange;
  }

  // Psychological Analysis
  public analyzeFightImpact(psychology: FighterPsychology, fightState: FightMentalState): void {
    const performanceImpact = this.calculatePerformanceImpact(fightState);
    const lessonsLearned = this.extractLessonsLearned(fightState);

    fightState.performanceImpact = performanceImpact;
    fightState.lessonsLearned = lessonsLearned;

    // Update adaptation patterns
    this.updateAdaptationPatterns(psychology, fightState);
  }

  private calculatePerformanceImpact(fightState: FightMentalState): number {
    let impact = 5; // Base impact

    // Analyze pre-fight to post-fight state changes
    const confidenceChange = fightState.postFightState.currentConfidence - fightState.preFightState.currentConfidence;
    const anxietyChange = fightState.postFightState.currentAnxiety - fightState.preFightState.currentAnxiety;

    impact += confidenceChange * 0.5;
    impact -= anxietyChange * 0.3;

    // Analyze in-fight adaptations
    const successfulAdaptations = fightState.inFightStates.reduce((count, state) => {
      return count + state.tacticalAdjustments.filter(adj => adj.effectiveness > 7).length;
    }, 0);

    impact += successfulAdaptations * 0.2;

    return Math.max(1, Math.min(10, Math.round(impact)));
  }

  private extractLessonsLearned(fightState: FightMentalState): string[] {
    const lessons: string[] = [];

    // Analyze emotional responses
    const emotionalResponses = fightState.inFightStates.flatMap(state => state.emotionalResponses);
    const negativeEmotions = emotionalResponses.filter(response => 
      response.emotion === Emotion.FRUSTRATION || 
      response.emotion === Emotion.FEAR || 
      response.emotion === Emotion.DESPERATION
    );

    if (negativeEmotions.length > 0) {
      lessons.push('Need to better manage negative emotions during fights');
    }

    // Analyze tactical adjustments
    const adjustments = fightState.inFightStates.flatMap(state => state.tacticalAdjustments);
    const effectiveAdjustments = adjustments.filter(adj => adj.effectiveness > 7);

    if (effectiveAdjustments.length > 0) {
      lessons.push('Successfully adapted tactics during the fight');
    }

    // Analyze pressure handling
    const pressureHandling = fightState.postFightState.pressureHandling;
    if (pressureHandling < 6) {
      lessons.push('Need to improve pressure handling in high-stakes situations');
    }

    return lessons;
  }

  private updateAdaptationPatterns(psychology: FighterPsychology, fightState: FightMentalState): void {
    const adjustments = fightState.inFightStates.flatMap(state => state.tacticalAdjustments);
    
    adjustments.forEach(adjustment => {
      const existingPattern = psychology.adaptationPatterns.find(p => p.pattern === adjustment.type);
      
      if (existingPattern) {
        existingPattern.frequency = (existingPattern.frequency + 1) / 2; // Update frequency
        existingPattern.effectiveness = (existingPattern.effectiveness + adjustment.effectiveness) / 2;
      } else {
        psychology.adaptationPatterns.push({
          pattern: adjustment.type,
          frequency: 1,
          effectiveness: adjustment.effectiveness,
          conditions: [adjustment.reason],
          evolution: {
            started: new Date(),
            currentEffectiveness: adjustment.effectiveness,
            trend: 'stable',
            modifications: []
          }
        });
      }
    });
  }

  private analyzeBehavioralImpact(psychology: FighterPsychology, change: BehavioralChange): void {
    const positiveChanges: string[] = [];
    const negativeChanges: string[] = [];

    switch (change.type) {
      case BehavioralChangeType.CONFIDENCE_SHIFT:
        if (change.impact.overallImpact > 7) {
          positiveChanges.push('Increased confidence in high-pressure situations');
        } else {
          negativeChanges.push('Decreased confidence affecting performance');
        }
        break;

      case BehavioralChangeType.MENTAL_TOUGHNESS:
        if (change.impact.overallImpact > 7) {
          positiveChanges.push('Improved mental toughness and resilience');
        } else {
          negativeChanges.push('Decline in mental toughness');
        }
        break;

      case BehavioralChangeType.STYLE_ADAPTATION:
        if (change.impact.overallImpact > 7) {
          positiveChanges.push('Successfully adapted fighting style');
        } else {
          negativeChanges.push('Style adaptation not effective');
        }
        break;
    }

    change.impact.positiveChanges = positiveChanges;
    change.impact.negativeChanges = negativeChanges;
  }

  // Archetype Analysis
  public determineArchetype(psychology: FighterPsychology): FighterArchetype {
    const personality = psychology.basePersonality;
    const fightHistory = psychology.fightHistory;

    // Analyze fighting patterns
    const earlyRoundPerformance = this.analyzeEarlyRoundPerformance(fightHistory);
    const lateRoundPerformance = this.analyzeLateRoundPerformance(fightHistory);
    const aggressionLevel = personality.aggression;
    const technicalSkill = this.analyzeTechnicalSkill(fightHistory);

    if (earlyRoundPerformance < 5 && lateRoundPerformance > 7) {
      return FighterArchetype.SLOW_STARTER;
    }

    if (earlyRoundPerformance > 7 && lateRoundPerformance < 5) {
      return FighterArchetype.FAST_FINISHER;
    }

    if (aggressionLevel > 8) {
      return FighterArchetype.PRESSURE_FIGHTER;
    }

    if (technicalSkill > 8) {
      return FighterArchetype.TECHNICAL_BOXER;
    }

    if (this.analyzePowerPunching(fightHistory) > 7) {
      return FighterArchetype.POWER_PUNCHER;
    }

    if (this.analyzeDefensiveSkill(fightHistory) > 7) {
      return FighterArchetype.DEFENSIVE_SPECIALIST;
    }

    return FighterArchetype.COUNTER_PUNCHER;
  }

  private analyzeEarlyRoundPerformance(fightHistory: FightMentalState[]): number {
    if (fightHistory.length === 0) return 5;

    const earlyRoundStates = fightHistory.flatMap(fight => 
      fight.inFightStates.filter(state => state.round <= 3)
    );

    if (earlyRoundStates.length === 0) return 5;

    const avgPerformance = earlyRoundStates.reduce((sum, state) => 
      sum + state.mentalState.currentConfidence, 0
    ) / earlyRoundStates.length;

    return Math.round(avgPerformance);
  }

  private analyzeLateRoundPerformance(fightHistory: FightMentalState[]): number {
    if (fightHistory.length === 0) return 5;

    const lateRoundStates = fightHistory.flatMap(fight => 
      fight.inFightStates.filter(state => state.round >= 8)
    );

    if (lateRoundStates.length === 0) return 5;

    const avgPerformance = lateRoundStates.reduce((sum, state) => 
      sum + state.mentalState.currentConfidence, 0
    ) / lateRoundStates.length;

    return Math.round(avgPerformance);
  }

  private analyzeTechnicalSkill(fightHistory: FightMentalState[]): number {
    // Simplified analysis - in real implementation would analyze actual fight data
    return 6 + Math.random() * 4;
  }

  private analyzePowerPunching(fightHistory: FightMentalState[]): number {
    // Simplified analysis
    return 5 + Math.random() * 5;
  }

  private analyzeDefensiveSkill(fightHistory: FightMentalState[]): number {
    // Simplified analysis
    return 5 + Math.random() * 5;
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private initializeArchetypePatterns(): void {
    this.archetypePatterns.set(FighterArchetype.SLOW_STARTER, {
      name: 'Slow Starter',
      characteristics: ['Builds confidence gradually', 'Strong late rounds', 'Defensive early'],
      adaptationPatterns: ['Defensive to aggressive', 'Counter-punching early'],
      mentalTraits: ['Patient', 'Resilient', 'Confident in later rounds']
    });

    this.archetypePatterns.set(FighterArchetype.FAST_FINISHER, {
      name: 'Fast Finisher',
      characteristics: ['Explosive early rounds', 'May tire later', 'Aggressive start'],
      adaptationPatterns: ['Aggressive early', 'Pressure fighting'],
      mentalTraits: ['Confident', 'Aggressive', 'May become anxious if fight goes long']
    });

    this.archetypePatterns.set(FighterArchetype.PRESSURE_FIGHTER, {
      name: 'Pressure Fighter',
      characteristics: ['Constant forward movement', 'High aggression', 'Physical style'],
      adaptationPatterns: ['Pressure fighting', 'Aggressive to defensive'],
      mentalTraits: ['Aggressive', 'Disciplined', 'Resilient']
    });
  }

  // Getters for data access
  public getFighterPsychologies(): FighterPsychology[] {
    return Array.from(this.fighterPsychologies.values());
  }

  public getArchetypePatterns(): ArchetypePattern[] {
    return Array.from(this.archetypePatterns.values());
  }
}

export interface ArchetypePattern {
  name: string;
  characteristics: string[];
  adaptationPatterns: string[];
  mentalTraits: string[];
}

export const fighterPsychologySystem = new FighterPsychologySystem(); 