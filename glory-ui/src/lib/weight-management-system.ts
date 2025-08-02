import { EventEmitter } from 'events';

// Weight classes
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
} as const;

export type WeightClassValue = typeof WeightClass[keyof typeof WeightClass];

// Weight cutting methods
export const WeightCuttingMethod = {
  GRADUAL: 'gradual',
  RAPID: 'rapid',
  SAUNA: 'sauna',
  SWEAT_SUIT: 'sweat_suit',
  DIURETICS: 'diuretics',
  COMBINATION: 'combination'
} as const;

export type WeightCuttingMethodValue = typeof WeightCuttingMethod[keyof typeof WeightCuttingMethod];

// Weight cutting plan interface
export interface WeightCuttingPlan {
  id: string;
  fighterId: string;
  targetWeight: number;
  currentWeight: number;
  startWeight: number;
  timeline: number; // days
  method: WeightCuttingMethodValue;
  nutritionPlan: NutritionPlan;
  hydrationStrategy: HydrationStrategy;
  riskAssessment: RiskAssessment;
  dailyProgress: DailyProgress[];
}

export interface NutritionPlan {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  supplements: string[];
  mealTiming: string[];
  hydrationTarget: number; // liters
}

export interface HydrationStrategy {
  preWeighIn: HydrationPhase;
  postWeighIn: HydrationPhase;
  fightNight: HydrationPhase;
  recovery: HydrationPhase;
}

export interface HydrationPhase {
  duration: number; // hours
  fluidIntake: number; // liters
  electrolyteBalance: ElectrolyteBalance;
  monitoring: HydrationMonitoring;
}

export interface ElectrolyteBalance {
  sodium: number; // mg
  potassium: number; // mg
  magnesium: number; // mg
  calcium: number; // mg
}

export interface HydrationMonitoring {
  urineColor: string;
  thirstLevel: number; // 1-10
  energyLevel: number; // 1-10
  crampRisk: number; // 1-10
}

export interface RiskAssessment {
  dehydrationRisk: number; // 1-10
  performanceImpact: number; // 1-10
  healthRisk: number; // 1-10
  recoveryTime: number; // days
  recommendations: string[];
}

export interface DailyProgress {
  date: Date;
  weight: number;
  hydrationLevel: number; // 1-10
  energyLevel: number; // 1-10
  symptoms: string[];
  notes: string;
}

// Catchweight negotiation interface
export interface CatchweightNegotiation {
  id: string;
  fighterA: string;
  fighterB: string;
  requestedWeight: number;
  financialPenalty: number;
  performanceImpact: PerformanceImpact;
  agreementReached: boolean;
}

export interface PerformanceImpact {
  staminaReduction: number; // percentage
  powerReduction: number; // percentage
  speedReduction: number; // percentage
  recoveryTime: number; // days
}

// Walk-around weight interface
export interface WalkAroundWeight {
  fighterId: string;
  naturalWeight: number;
  comfortableWeight: number;
  weightClassComfort: WeightClassComfort[];
  transitionDifficulty: number; // 1-10
}

export interface WeightClassComfort {
  weightClass: WeightClassValue;
  comfortLevel: number; // 1-10
  performanceImpact: number; // 1-10
  sustainability: number; // months
}

export class WeightManagementSystem extends EventEmitter {
  private weightCuttingPlans: Map<string, WeightCuttingPlan> = new Map();
  private catchweightNegotiations: Map<string, CatchweightNegotiation> = new Map();
  private walkAroundWeights: Map<string, WalkAroundWeight> = new Map();

  constructor() {
    super();
  }

  // Weight Cutting Management
  public createWeightCuttingPlan(plan: Omit<WeightCuttingPlan, 'id' | 'dailyProgress'>): WeightCuttingPlan {
    const weightCuttingPlan: WeightCuttingPlan = {
      ...plan,
      id: this.generateId(),
      dailyProgress: []
    };

    this.weightCuttingPlans.set(weightCuttingPlan.id, weightCuttingPlan);
    this.emit('weightCuttingPlanCreated', weightCuttingPlan);
    return weightCuttingPlan;
  }

  public updateWeightCuttingPlan(planId: string, updates: Partial<WeightCuttingPlan>): boolean {
    const plan = this.weightCuttingPlans.get(planId);
    if (!plan) return false;

    const updatedPlan = { ...plan, ...updates };
    this.weightCuttingPlans.set(planId, updatedPlan);
    this.emit('weightCuttingPlanUpdated', updatedPlan);
    return true;
  }

  public addDailyProgress(planId: string, progress: Omit<DailyProgress, 'date'>): boolean {
    const plan = this.weightCuttingPlans.get(planId);
    if (!plan) return false;

    const dailyProgress: DailyProgress = {
      ...progress,
      date: new Date()
    };

    plan.dailyProgress.push(dailyProgress);
    this.weightCuttingPlans.set(planId, plan);
    this.emit('dailyProgressAdded', { planId, progress: dailyProgress });
    return true;
  }

  public assessCuttingRisk(plan: WeightCuttingPlan): RiskAssessment {
    const weightLoss = plan.startWeight - plan.targetWeight;
    const dailyLoss = weightLoss / plan.timeline;
    
    let dehydrationRisk = 3; // Base risk
    let performanceImpact = 2; // Base impact
    let healthRisk = 2; // Base risk
    let recoveryTime = 1; // Base recovery
    const recommendations: string[] = [];

    // Assess based on method
    if (plan.method === WeightCuttingMethod.RAPID) {
      dehydrationRisk += 3;
      performanceImpact += 2;
      healthRisk += 2;
      recommendations.push('Consider extending timeline');
    }

    if (plan.method === WeightCuttingMethod.DIURETICS) {
      dehydrationRisk += 4;
      healthRisk += 3;
      recommendations.push('Monitor electrolyte levels closely');
    }

    // Assess based on weight loss rate
    if (dailyLoss > 2) {
      dehydrationRisk += 2;
      performanceImpact += 1;
      recommendations.push('Reduce daily weight loss target');
    }

    // Assess based on timeline
    if (plan.timeline < 14) {
      dehydrationRisk += 2;
      performanceImpact += 2;
      healthRisk += 1;
      recommendations.push('Extend cutting timeline');
    }

    // Calculate recovery time
    recoveryTime = Math.ceil(weightLoss / 2); // 2 lbs per day recovery

    return {
      dehydrationRisk: Math.min(10, dehydrationRisk),
      performanceImpact: Math.min(10, performanceImpact),
      healthRisk: Math.min(10, healthRisk),
      recoveryTime: Math.max(1, recoveryTime),
      recommendations
    };
  }

  public createRehydrationPlan(plan: WeightCuttingPlan): HydrationStrategy {
    const weightLoss = plan.startWeight - plan.targetWeight;
    
    return {
      preWeighIn: {
        duration: 24,
        fluidIntake: 0.5,
        electrolyteBalance: {
          sodium: 500,
          potassium: 200,
          magnesium: 50,
          calcium: 200
        },
        monitoring: {
          urineColor: 'Dark',
          thirstLevel: 8,
          energyLevel: 4,
          crampRisk: 7
        }
      },
      postWeighIn: {
        duration: 24,
        fluidIntake: 2.4,
        electrolyteBalance: {
          sodium: 2000,
          potassium: 1000,
          magnesium: 200,
          calcium: 500
        },
        monitoring: {
          urineColor: 'Light',
          thirstLevel: 3,
          energyLevel: 7,
          crampRisk: 3
        }
      },
      fightNight: {
        duration: 6,
        fluidIntake: 1.2,
        electrolyteBalance: {
          sodium: 1500,
          potassium: 800,
          magnesium: 150,
          calcium: 400
        },
        monitoring: {
          urineColor: 'Clear',
          thirstLevel: 2,
          energyLevel: 9,
          crampRisk: 2
        }
      },
      recovery: {
        duration: 48,
        fluidIntake: 0.4,
        electrolyteBalance: {
          sodium: 1000,
          potassium: 600,
          magnesium: 100,
          calcium: 300
        },
        monitoring: {
          urineColor: 'Light',
          thirstLevel: 1,
          energyLevel: 8,
          crampRisk: 1
        }
      }
    };
  }

  // Catchweight Negotiation Management
  public createCatchweightNegotiation(negotiation: Omit<CatchweightNegotiation, 'id'>): CatchweightNegotiation {
    const catchweightNegotiation: CatchweightNegotiation = {
      ...negotiation,
      id: this.generateId()
    };

    this.catchweightNegotiations.set(catchweightNegotiation.id, catchweightNegotiation);
    this.emit('catchweightNegotiationCreated', catchweightNegotiation);
    return catchweightNegotiation;
  }

  public assessCatchweightImpact(requestedWeight: number, naturalWeight: number): PerformanceImpact {
    const weightDifference = naturalWeight - requestedWeight;
    const percentageLoss = (weightDifference / naturalWeight) * 100;
    
    return {
      staminaReduction: Math.min(20, percentageLoss * 2),
      powerReduction: Math.min(15, percentageLoss * 1.5),
      speedReduction: Math.min(10, percentageLoss * 1),
      recoveryTime: Math.ceil(weightDifference / 3)
    };
  }

  // Walk-Around Weight Management
  public setWalkAroundWeight(weight: WalkAroundWeight): WalkAroundWeight {
    this.walkAroundWeights.set(weight.fighterId, weight);
    this.emit('walkAroundWeightSet', weight);
    return weight;
  }

  public calculateWeightClassComfort(fighterId: string): WeightClassComfort[] {
    const weight = this.walkAroundWeights.get(fighterId);
    if (!weight) return [];

    const comfortLevels: WeightClassComfort[] = [];
    
    // Calculate comfort for each weight class
    Object.values(WeightClass).forEach(weightClass => {
      const classWeight = this.getWeightClassLimit(weightClass);
      const difference = Math.abs(weight.naturalWeight - classWeight);
      
      let comfortLevel = 10;
      let performanceImpact = 1;
      let sustainability = 12;
      
      if (difference > 10) {
        comfortLevel = Math.max(1, 10 - Math.floor(difference / 5));
        performanceImpact = Math.min(10, Math.floor(difference / 3));
        sustainability = Math.max(1, 12 - Math.floor(difference / 4));
      }
      
      comfortLevels.push({
        weightClass,
        comfortLevel,
        performanceImpact,
        sustainability
      });
    });
    
    return comfortLevels.sort((a, b) => b.comfortLevel - a.comfortLevel);
  }

  private getWeightClassLimit(weightClass: WeightClassValue): number {
    const limits: Record<WeightClassValue, number> = {
      [WeightClass.STRAWWEIGHT]: 105,
      [WeightClass.FLYWEIGHT]: 112,
      [WeightClass.BANTAMWEIGHT]: 118,
      [WeightClass.SUPER_BANTAMWEIGHT]: 122,
      [WeightClass.FEATHERWEIGHT]: 126,
      [WeightClass.SUPER_FEATHERWEIGHT]: 130,
      [WeightClass.LIGHTWEIGHT]: 135,
      [WeightClass.SUPER_LIGHTWEIGHT]: 140,
      [WeightClass.WELTERWEIGHT]: 147,
      [WeightClass.SUPER_WELTERWEIGHT]: 154,
      [WeightClass.MIDDLEWEIGHT]: 160,
      [WeightClass.SUPER_MIDDLEWEIGHT]: 168,
      [WeightClass.LIGHT_HEAVYWEIGHT]: 175,
      [WeightClass.CRUISERWEIGHT]: 200,
      [WeightClass.HEAVYWEIGHT]: 200
    };
    
    return limits[weightClass];
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Getters for data access
  public getWeightCuttingPlans(): WeightCuttingPlan[] {
    return Array.from(this.weightCuttingPlans.values());
  }

  public getCatchweightNegotiations(): CatchweightNegotiation[] {
    return Array.from(this.catchweightNegotiations.values());
  }

  public getWalkAroundWeights(): WalkAroundWeight[] {
    return Array.from(this.walkAroundWeights.values());
  }
}

export const weightManagementSystem = new WeightManagementSystem(); 