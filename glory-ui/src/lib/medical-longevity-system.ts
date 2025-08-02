import { EventEmitter } from 'events';

// Medical conditions and injuries
export enum InjuryType {
  CONCUSSION = 'concussion',
  CUT = 'cut',
  BROKEN_NOSE = 'broken_nose',
  BROKEN_JAW = 'broken_jaw',
  SHOULDER_INJURY = 'shoulder_injury',
  HAND_INJURY = 'hand_injury',
  KNEE_INJURY = 'knee_injury',
  BACK_INJURY = 'back_injury',
  EYE_INJURY = 'eye_injury',
  BRAIN_TRAUMA = 'brain_trauma'
}

export enum InjurySeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  CRITICAL = 'critical'
}

export interface Injury {
  id: string;
  fighterId: string;
  type: InjuryType;
  severity: InjurySeverity;
  date: Date;
  cause: string;
  recoveryTime: number; // days
  treatment: Treatment[];
  complications: string[];
  permanentEffects: string[];
  isHealed: boolean;
}

export interface Treatment {
  type: TreatmentType;
  duration: number; // days
  effectiveness: number; // 1-10
  cost: number;
  sideEffects: string[];
}

export enum TreatmentType {
  REST = 'rest',
  SURGERY = 'surgery',
  PHYSICAL_THERAPY = 'physical_therapy',
  MEDICATION = 'medication',
  REHABILITATION = 'rehabilitation',
  ALTERNATIVE_THERAPY = 'alternative_therapy'
}

// Cumulative damage tracking
export interface CumulativeDamage {
  id: string;
  fighterId: string;
  totalFights: number;
  roundsFought: number;
  punchesAbsorbed: number;
  cutsSustained: number;
  concussions: number;
  brainTraumaScore: number; // 1-10
  cteRisk: number; // 1-10
  damageHistory: DamageEvent[];
  recoveryEfficiency: number; // 1-10
}

export interface DamageEvent {
  id: string;
  date: Date;
  type: DamageType;
  severity: number; // 1-10
  impact: string;
  recoveryTime: number; // days
}

export enum DamageType {
  HEAD_SHOT = 'head_shot',
  BODY_SHOT = 'body_shot',
  CUT = 'cut',
  KNOCKDOWN = 'knockdown',
  KNOCKOUT = 'knockout',
  ACCUMULATED_DAMAGE = 'accumulated_damage'
}

// CTE and brain health
export interface BrainHealth {
  id: string;
  fighterId: string;
  cteRisk: number; // 1-10
  cognitiveFunction: number; // 1-10
  memoryRetention: number; // 1-10
  reactionTime: number; // 1-10
  moodStability: number; // 1-10
  brainScans: BrainScan[];
  symptoms: CTESymptom[];
  recommendations: string[];
}

export interface BrainScan {
  date: Date;
  type: ScanType;
  results: string;
  abnormalities: string[];
  recommendations: string[];
}

export enum ScanType {
  MRI = 'mri',
  CT_SCAN = 'ct_scan',
  PET_SCAN = 'pet_scan',
  NEUROPSYCHOLOGICAL = 'neuropsychological'
}

export interface CTESymptom {
  symptom: string;
  severity: number; // 1-10
  frequency: number; // percentage
  impact: string;
  management: string;
}

// Drug testing and PEDs
export enum DrugTestType {
  URINE = 'urine',
  BLOOD = 'blood',
  HAIR = 'hair',
  SALIVA = 'saliva'
}

export interface DrugTest {
  id: string;
  fighterId: string;
  type: DrugTestType;
  date: Date;
  result: TestResult;
  substances: string[];
  penalty: Penalty;
  appealStatus: AppealStatus;
}

export enum TestResult {
  NEGATIVE = 'negative',
  POSITIVE = 'positive',
  INCONCLUSIVE = 'inconclusive',
  ADVERSE = 'adverse'
}

export interface Penalty {
  type: PenaltyType;
  duration: number; // months
  fine: number;
  suspension: boolean;
  titleStripped: boolean;
  reputationImpact: number; // 1-10
}

export enum PenaltyType {
  WARNING = 'warning',
  FINE = 'fine',
  SUSPENSION = 'suspension',
  BAN = 'ban',
  TITLE_STRIP = 'title_strip'
}

export enum AppealStatus {
  NONE = 'none',
  PENDING = 'pending',
  APPROVED = 'approved',
  DENIED = 'denied'
}

// Age-related decline
export interface AgeDecline {
  id: string;
  fighterId: string;
  age: number;
  declineFactors: DeclineFactor[];
  performanceImpact: PerformanceImpact;
  recoveryRate: number; // percentage of youth
  injuryRisk: number; // 1-10
  recommendations: string[];
}

export interface DeclineFactor {
  factor: string;
  impact: number; // 1-10
  onsetAge: number;
  progression: number; // percentage per year
  mitigation: string[];
}

export interface PerformanceImpact {
  speed: number; // percentage reduction
  power: number; // percentage reduction
  stamina: number; // percentage reduction
  recovery: number; // percentage reduction
  reactionTime: number; // percentage reduction
}

// Recovery and rehabilitation
export interface RecoveryPlan {
  id: string;
  fighterId: string;
  injuryId: string;
  duration: number; // days
  phases: RecoveryPhase[];
  milestones: Milestone[];
  successRate: number; // percentage
  complications: string[];
}

export interface RecoveryPhase {
  phase: number;
  duration: number; // days
  activities: string[];
  restrictions: string[];
  goals: string[];
  progress: number; // percentage
}

export interface Milestone {
  description: string;
  targetDate: Date;
  achieved: boolean;
  achievementDate?: Date;
  notes: string;
}

export class MedicalLongevitySystem extends EventEmitter {
  private injuries: Map<string, Injury> = new Map();
  private cumulativeDamage: Map<string, CumulativeDamage> = new Map();
  private brainHealth: Map<string, BrainHealth> = new Map();
  private drugTests: Map<string, DrugTest> = new Map();
  private ageDecline: Map<string, AgeDecline> = new Map();
  private recoveryPlans: Map<string, RecoveryPlan> = new Map();

  constructor() {
    super();
  }

  // Injury Management
  public recordInjury(injury: Omit<Injury, 'id' | 'isHealed'>): Injury {
    const newInjury: Injury = {
      ...injury,
      id: this.generateId(),
      isHealed: false
    };

    this.injuries.set(newInjury.id, newInjury);
    this.updateCumulativeDamage(newInjury.fighterId, newInjury);
    this.emit('injuryRecorded', newInjury);
    return newInjury;
  }

  public healInjury(injuryId: string): boolean {
    const injury = this.injuries.get(injuryId);
    if (!injury) return false;

    injury.isHealed = true;
    this.injuries.set(injuryId, injury);
    this.emit('injuryHealed', injury);
    return true;
  }

  public createRecoveryPlan(fighterId: string, injuryId: string): RecoveryPlan {
    const injury = this.injuries.get(injuryId);
    if (!injury) throw new Error('Injury not found');

    const recoveryPlan: RecoveryPlan = {
      id: this.generateId(),
      fighterId,
      injuryId,
      duration: injury.recoveryTime,
      phases: this.createRecoveryPhases(injury),
      milestones: this.createMilestones(injury),
      successRate: this.calculateSuccessRate(injury),
      complications: []
    };

    this.recoveryPlans.set(recoveryPlan.id, recoveryPlan);
    this.emit('recoveryPlanCreated', recoveryPlan);
    return recoveryPlan;
  }

  // Cumulative Damage Tracking
  public updateCumulativeDamage(fighterId: string, injury: Injury): void {
    let damage = this.cumulativeDamage.get(fighterId);
    
    if (!damage) {
      damage = {
        id: this.generateId(),
        fighterId,
        totalFights: 0,
        roundsFought: 0,
        punchesAbsorbed: 0,
        cutsSustained: 0,
        concussions: 0,
        brainTraumaScore: 1,
        cteRisk: 1,
        damageHistory: [],
        recoveryEfficiency: 8
      };
    }

    // Update damage statistics
    if (injury.type === InjuryType.CONCUSSION) {
      damage.concussions++;
      damage.brainTraumaScore = Math.min(10, damage.brainTraumaScore + 1);
    }

    if (injury.type === InjuryType.CUT) {
      damage.cutsSustained++;
    }

    // Add damage event
    const damageEvent: DamageEvent = {
      id: this.generateId(),
      date: injury.date,
      type: this.mapInjuryToDamageType(injury.type),
      severity: this.mapSeverityToNumber(injury.severity),
      impact: injury.cause,
      recoveryTime: injury.recoveryTime
    };

    damage.damageHistory.push(damageEvent);
    this.cumulativeDamage.set(fighterId, damage);
    this.emit('cumulativeDamageUpdated', damage);
  }

  // Brain Health and CTE
  public assessBrainHealth(fighterId: string): BrainHealth {
    const damage = this.cumulativeDamage.get(fighterId);
    if (!damage) throw new Error('Cumulative damage not found');

    const brainHealth: BrainHealth = {
      id: this.generateId(),
      fighterId,
      cteRisk: this.calculateCTERisk(damage),
      cognitiveFunction: this.calculateCognitiveFunction(damage),
      memoryRetention: this.calculateMemoryRetention(damage),
      reactionTime: this.calculateReactionTime(damage),
      moodStability: this.calculateMoodStability(damage),
      brainScans: [],
      symptoms: this.assessCTESymptoms(damage),
      recommendations: this.generateBrainHealthRecommendations(damage)
    };

    this.brainHealth.set(fighterId, brainHealth);
    this.emit('brainHealthAssessed', brainHealth);
    return brainHealth;
  }

  // Drug Testing
  public conductDrugTest(test: Omit<DrugTest, 'id'>): DrugTest {
    const drugTest: DrugTest = {
      ...test,
      id: this.generateId()
    };

    this.drugTests.set(drugTest.id, drugTest);
    
    if (drugTest.result === TestResult.POSITIVE) {
      this.emit('positiveDrugTest', drugTest);
    }
    
    this.emit('drugTestConducted', drugTest);
    return drugTest;
  }

  public calculatePenalty(test: DrugTest): Penalty {
    const penalty: Penalty = {
      type: PenaltyType.SUSPENSION,
      duration: 6, // Default 6 months
      fine: 50000, // Default $50,000
      suspension: true,
      titleStripped: false,
      reputationImpact: 7
    };

    // Adjust based on substances found
    if (test.substances.includes('anabolic steroids')) {
      penalty.duration = 12;
      penalty.fine = 100000;
      penalty.reputationImpact = 9;
    }

    if (test.substances.includes('recreational drugs')) {
      penalty.duration = 3;
      penalty.fine = 25000;
      penalty.reputationImpact = 5;
    }

    return penalty;
  }

  // Age-Related Decline
  public assessAgeDecline(fighterId: string, age: number): AgeDecline {
    const ageDecline: AgeDecline = {
      id: this.generateId(),
      fighterId,
      age,
      declineFactors: this.calculateDeclineFactors(age),
      performanceImpact: this.calculatePerformanceImpact(age),
      recoveryRate: this.calculateRecoveryRate(age),
      injuryRisk: this.calculateInjuryRisk(age),
      recommendations: this.generateAgeRecommendations(age)
    };

    this.ageDecline.set(fighterId, ageDecline);
    this.emit('ageDeclineAssessed', ageDecline);
    return ageDecline;
  }

  // Recovery and Rehabilitation
  private createRecoveryPhases(injury: Injury): RecoveryPhase[] {
    const phases: RecoveryPhase[] = [];
    const totalDuration = injury.recoveryTime;

    // Phase 1: Acute Phase (20% of recovery time)
    phases.push({
      phase: 1,
      duration: Math.round(totalDuration * 0.2),
      activities: ['Rest', 'Ice therapy', 'Pain management'],
      restrictions: ['No training', 'No contact', 'Limited movement'],
      goals: ['Reduce inflammation', 'Manage pain', 'Prevent complications'],
      progress: 0
    });

    // Phase 2: Rehabilitation Phase (50% of recovery time)
    phases.push({
      phase: 2,
      duration: Math.round(totalDuration * 0.5),
      activities: ['Physical therapy', 'Light exercise', 'Range of motion'],
      restrictions: ['No contact training', 'Limited intensity'],
      goals: ['Restore function', 'Build strength', 'Improve mobility'],
      progress: 0
    });

    // Phase 3: Return to Sport Phase (30% of recovery time)
    phases.push({
      phase: 3,
      duration: Math.round(totalDuration * 0.3),
      activities: ['Sport-specific training', 'Gradual return to contact', 'Performance testing'],
      restrictions: ['Supervised training', 'Progressive intensity'],
      goals: ['Full function', 'Sport readiness', 'Performance optimization'],
      progress: 0
    });

    return phases;
  }

  private createMilestones(injury: Injury): Milestone[] {
    const milestones: Milestone[] = [];
    const startDate = new Date();

    milestones.push({
      description: 'Pain-free movement',
      targetDate: new Date(startDate.getTime() + injury.recoveryTime * 0.3 * 24 * 60 * 60 * 1000),
      achieved: false,
      notes: 'Should be able to move without pain'
    });

    milestones.push({
      description: 'Full range of motion',
      targetDate: new Date(startDate.getTime() + injury.recoveryTime * 0.6 * 24 * 60 * 60 * 1000),
      achieved: false,
      notes: 'Should achieve full range of motion'
    });

    milestones.push({
      description: 'Return to training',
      targetDate: new Date(startDate.getTime() + injury.recoveryTime * 0.8 * 24 * 60 * 60 * 1000),
      achieved: false,
      notes: 'Should be able to return to light training'
    });

    return milestones;
  }

  private calculateSuccessRate(injury: Injury): number {
    let successRate = 85; // Base success rate

    // Adjust based on injury type
    switch (injury.type) {
      case InjuryType.CONCUSSION:
        successRate = 90;
        break;
      case InjuryType.CUT:
        successRate = 95;
        break;
      case InjuryType.BROKEN_JAW:
        successRate = 80;
        break;
      case InjuryType.BRAIN_TRAUMA:
        successRate = 70;
        break;
    }

    // Adjust based on severity
    switch (injury.severity) {
      case InjurySeverity.MINOR:
        successRate += 5;
        break;
      case InjurySeverity.SEVERE:
        successRate -= 10;
        break;
      case InjurySeverity.CRITICAL:
        successRate -= 20;
        break;
    }

    return Math.max(50, Math.min(100, successRate));
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private mapInjuryToDamageType(injuryType: InjuryType): DamageType {
    switch (injuryType) {
      case InjuryType.CONCUSSION:
      case InjuryType.BRAIN_TRAUMA:
        return DamageType.HEAD_SHOT;
      case InjuryType.CUT:
        return DamageType.CUT;
      default:
        return DamageType.ACCUMULATED_DAMAGE;
    }
  }

  private mapSeverityToNumber(severity: InjurySeverity): number {
    switch (severity) {
      case InjurySeverity.MINOR:
        return 3;
      case InjurySeverity.MODERATE:
        return 6;
      case InjurySeverity.SEVERE:
        return 8;
      case InjurySeverity.CRITICAL:
        return 10;
    }
  }

  private calculateCTERisk(damage: CumulativeDamage): number {
    let risk = 1; // Base risk

    risk += damage.concussions * 1.5;
    risk += damage.brainTraumaScore * 0.5;
    risk += damage.totalFights * 0.1;

    return Math.min(10, Math.max(1, Math.round(risk)));
  }

  private calculateCognitiveFunction(damage: CumulativeDamage): number {
    let cognitiveFunction = 10; // Base function

    cognitiveFunction -= damage.concussions * 0.5;
    cognitiveFunction -= damage.brainTraumaScore * 0.3;

    return Math.max(1, Math.min(10, Math.round(cognitiveFunction)));
  }

  private calculateMemoryRetention(damage: CumulativeDamage): number {
    let retention = 10;

    retention -= damage.concussions * 0.4;
    retention -= damage.brainTraumaScore * 0.2;

    return Math.max(1, Math.min(10, Math.round(retention)));
  }

  private calculateReactionTime(damage: CumulativeDamage): number {
    let reactionTime = 10;

    reactionTime -= damage.concussions * 0.3;
    reactionTime -= damage.brainTraumaScore * 0.2;

    return Math.max(1, Math.min(10, Math.round(reactionTime)));
  }

  private calculateMoodStability(damage: CumulativeDamage): number {
    let stability = 10;

    stability -= damage.concussions * 0.6;
    stability -= damage.brainTraumaScore * 0.4;

    return Math.max(1, Math.min(10, Math.round(stability)));
  }

  private assessCTESymptoms(damage: CumulativeDamage): CTESymptom[] {
    const symptoms: CTESymptom[] = [];

    if (damage.concussions > 3) {
      symptoms.push({
        symptom: 'Memory problems',
        severity: Math.min(8, damage.concussions),
        frequency: 70,
        impact: 'Difficulty remembering recent events',
        management: 'Memory exercises and cognitive therapy'
      });
    }

    if (damage.brainTraumaScore > 6) {
      symptoms.push({
        symptom: 'Mood swings',
        severity: Math.min(7, damage.brainTraumaScore - 3),
        frequency: 60,
        impact: 'Unpredictable emotional responses',
        management: 'Mood stabilization therapy'
      });
    }

    return symptoms;
  }

  private generateBrainHealthRecommendations(damage: CumulativeDamage): string[] {
    const recommendations: string[] = [];

    if (damage.concussions > 2) {
      recommendations.push('Consider retirement to prevent further brain damage');
    }

    if (damage.brainTraumaScore > 5) {
      recommendations.push('Regular brain scans and cognitive assessments');
    }

    if (damage.cteRisk > 7) {
      recommendations.push('Consult with neurologist for CTE assessment');
    }

    return recommendations;
  }

  private calculateDeclineFactors(age: number): DeclineFactor[] {
    const factors: DeclineFactor[] = [];

    if (age > 30) {
      factors.push({
        factor: 'Recovery rate decline',
        impact: Math.min(8, (age - 30) * 0.2),
        onsetAge: 30,
        progression: 2,
        mitigation: ['Optimized nutrition', 'Extended recovery periods', 'Active recovery techniques']
      });
    }

    if (age > 35) {
      factors.push({
        factor: 'Reaction time decline',
        impact: Math.min(7, (age - 35) * 0.3),
        onsetAge: 35,
        progression: 1.5,
        mitigation: ['Reaction training', 'Cognitive exercises', 'Speed drills']
      });
    }

    if (age > 40) {
      factors.push({
        factor: 'Power decline',
        impact: Math.min(9, (age - 40) * 0.4),
        onsetAge: 40,
        progression: 2.5,
        mitigation: ['Strength maintenance', 'Power training', 'Hormone optimization']
      });
    }

    return factors;
  }

  private calculatePerformanceImpact(age: number): PerformanceImpact {
    const baseAge = 25;
    const ageDifference = Math.max(0, age - baseAge);

    return {
      speed: Math.min(30, ageDifference * 0.8),
      power: Math.min(25, ageDifference * 0.6),
      stamina: Math.min(20, ageDifference * 0.5),
      recovery: Math.min(40, ageDifference * 1.2),
      reactionTime: Math.min(35, ageDifference * 1.0)
    };
  }

  private calculateRecoveryRate(age: number): number {
    const baseRate = 100;
    const agePenalty = Math.max(0, age - 25) * 2;
    return Math.max(30, baseRate - agePenalty);
  }

  private calculateInjuryRisk(age: number): number {
    let risk = 3; // Base risk
    risk += Math.max(0, age - 25) * 0.3;
    return Math.min(10, Math.max(1, Math.round(risk)));
  }

  private generateAgeRecommendations(age: number): string[] {
    const recommendations: string[] = [];

    if (age > 35) {
      recommendations.push('Consider reducing fight frequency');
      recommendations.push('Focus on technical skills over power');
    }

    if (age > 40) {
      recommendations.push('Regular medical check-ups');
      recommendations.push('Consider retirement planning');
    }

    if (age > 45) {
      recommendations.push('Strongly consider retirement');
      recommendations.push('Focus on coaching or management');
    }

    return recommendations;
  }

  public calculateBrainHealth(fighterId: string): number {
    const damage = this.cumulativeDamage.get(fighterId);
    if (!damage) return 10; // Perfect health if no damage recorded

    let brainFunction = 10; // Base function
    brainFunction -= damage.concussions * 0.5;
    brainFunction -= damage.brainTraumaScore * 0.3;
    
    // Ensure brain function stays within 1-10 range
    return Math.max(1, Math.min(10, Math.round(brainFunction)));
  }

  // Getters for data access
  public getInjuries(): Injury[] {
    return Array.from(this.injuries.values());
  }

  public getCumulativeDamage(): CumulativeDamage[] {
    return Array.from(this.cumulativeDamage.values());
  }

  public getBrainHealth(): BrainHealth[] {
    return Array.from(this.brainHealth.values());
  }

  public getDrugTests(): DrugTest[] {
    return Array.from(this.drugTests.values());
  }

  public getAgeDecline(): AgeDecline[] {
    return Array.from(this.ageDecline.values());
  }

  public getRecoveryPlans(): RecoveryPlan[] {
    return Array.from(this.recoveryPlans.values());
  }
}

export const medicalLongevitySystem = new MedicalLongevitySystem(); 