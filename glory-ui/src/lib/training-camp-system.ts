import { EventEmitter } from 'events';

// Training camp locations
export const CampLocation = {
  BIG_BEAR: 'big_bear',
  MIAMI: 'miami',
  LAS_VEGAS: 'las_vegas',
  PHILIPPINES: 'philippines',
  MEXICO: 'mexico',
  UK: 'uk',
  CUSTOM: 'custom'
} as const;

export type CampLocationValue = typeof CampLocation[keyof typeof CampLocation];

// Training focus areas
export const TrainingFocus = {
  STRENGTH_CONDITIONING: 'strength_conditioning',
  TECHNICAL_SKILLS: 'technical_skills',
  STRATEGY_GAMEPLAN: 'strategy_gameplan',
  MENTAL_PREPARATION: 'mental_preparation',
  RECOVERY_REHABILITATION: 'recovery_rehabilitation',
  OPPONENT_SPECIFIC: 'opponent_specific'
} as const;

export type TrainingFocusValue = typeof TrainingFocus[keyof typeof TrainingFocus];

// Training camp interface
export interface TrainingCamp {
  id: string;
  fighterId: string;
  location: CampLocationValue;
  startDate: Date;
  endDate: Date;
  focus: TrainingFocusValue;
  facilities: string[];
  dailySchedule: DailyActivity[];
  budget: number;
  staffCount: number;
  sparringPartners: string[];
  filmStudySessions: string[];
  opponentAnalysis?: OpponentAnalysis;
}

export interface DailyActivity {
  time: string;
  activity: string;
  duration: number; // minutes
}

export interface OpponentAnalysis {
  opponentId: string;
  strengths: string[];
  weaknesses: string[];
  gamePlan: string;
  keyTactics: string[];
}

// Coaching staff interface
export interface CoachingStaff {
  id: string;
  name: string;
  role: string;
  experience: number; // years
  salary: number;
  specialties: string[];
  availability: number; // hours per week
  fighterId: string;
  campId: string;
}

// Sparring partner interface
export interface SparringPartner {
  id: string;
  name: string;
  weightClass: string;
  style: string;
  experience: number; // years
  compensation: number;
  availability: number; // hours per week
  fighterId: string;
  campId: string;
}

// Film study session interface
export interface FilmStudySession {
  id: string;
  fighterId: string;
  opponentId: string;
  duration: number; // minutes
  focus: string;
  keyInsights: string[];
  gamePlanAdjustments: string[];
  campId: string;
}

export class TrainingCampSystem extends EventEmitter {
  private trainingCamps: Map<string, TrainingCamp> = new Map();
  private coachingStaff: Map<string, CoachingStaff> = new Map();
  private sparringPartners: Map<string, SparringPartner> = new Map();
  private filmStudySessions: Map<string, FilmStudySession> = new Map();

  constructor() {
    super();
  }

  // Training Camp Management
  public createTrainingCamp(camp: Omit<TrainingCamp, 'id'>): TrainingCamp {
    const trainingCamp: TrainingCamp = {
      ...camp,
      id: this.generateId()
    };

    this.trainingCamps.set(trainingCamp.id, trainingCamp);
    this.emit('trainingCampCreated', trainingCamp);
    return trainingCamp;
  }

  public updateTrainingCamp(campId: string, updates: Partial<TrainingCamp>): boolean {
    const camp = this.trainingCamps.get(campId);
    if (!camp) return false;

    const updatedCamp = { ...camp, ...updates };
    this.trainingCamps.set(campId, updatedCamp);
    this.emit('trainingCampUpdated', updatedCamp);
    return true;
  }

  public endTrainingCamp(campId: string): boolean {
    const camp = this.trainingCamps.get(campId);
    if (!camp) return false;

    camp.endDate = new Date();
    this.trainingCamps.set(campId, camp);
    this.emit('trainingCampEnded', camp);
    return true;
  }

  // Coaching Staff Management
  public hireCoachingStaff(staff: Omit<CoachingStaff, 'id'>): CoachingStaff {
    const coachingStaff: CoachingStaff = {
      ...staff,
      id: this.generateId()
    };

    this.coachingStaff.set(coachingStaff.id, coachingStaff);
    this.emit('coachingStaffHired', coachingStaff);
    return coachingStaff;
  }

  public fireCoachingStaff(staffId: string): boolean {
    const staff = this.coachingStaff.get(staffId);
    if (!staff) return false;

    this.coachingStaff.delete(staffId);
    this.emit('coachingStaffFired', staff);
    return true;
  }

  // Sparring Partner Management
  public addSparringPartner(partner: Omit<SparringPartner, 'id'>): SparringPartner {
    const sparringPartner: SparringPartner = {
      ...partner,
      id: this.generateId()
    };

    this.sparringPartners.set(sparringPartner.id, sparringPartner);
    this.emit('sparringPartnerAdded', sparringPartner);
    return sparringPartner;
  }

  public removeSparringPartner(partnerId: string): boolean {
    const partner = this.sparringPartners.get(partnerId);
    if (!partner) return false;

    this.sparringPartners.delete(partnerId);
    this.emit('sparringPartnerRemoved', partner);
    return true;
  }

  // Film Study Management
  public createFilmStudySession(session: Omit<FilmStudySession, 'id'>): FilmStudySession {
    const filmStudySession: FilmStudySession = {
      ...session,
      id: this.generateId()
    };

    this.filmStudySessions.set(filmStudySession.id, filmStudySession);
    this.emit('filmStudySessionCreated', filmStudySession);
    return filmStudySession;
  }

  public updateFilmStudySession(sessionId: string, updates: Partial<FilmStudySession>): boolean {
    const session = this.filmStudySessions.get(sessionId);
    if (!session) return false;

    const updatedSession = { ...session, ...updates };
    this.filmStudySessions.set(sessionId, updatedSession);
    this.emit('filmStudySessionUpdated', updatedSession);
    return true;
  }

  // Analysis and Planning
  public analyzeOpponent(fighterId: string, opponentId: string): OpponentAnalysis {
    // Simulate opponent analysis
    const analysis: OpponentAnalysis = {
      opponentId,
      strengths: this.generateStrengths(),
      weaknesses: this.generateWeaknesses(),
      gamePlan: this.generateGamePlan(),
      keyTactics: this.generateKeyTactics()
    };

    return analysis;
  }

  public calculateCampEffectiveness(campId: string): number {
    const camp = this.trainingCamps.get(campId);
    if (!camp) return 0;

    // Calculate effectiveness based on various factors
    let effectiveness = 50; // Base score

    // Add points for good facilities
    effectiveness += camp.facilities.length * 5;

    // Add points for staff
    effectiveness += camp.staffCount * 3;

    // Add points for sparring partners
    effectiveness += camp.sparringPartners.length * 4;

    // Add points for film study sessions
    effectiveness += camp.filmStudySessions.length * 6;

    // Subtract points for short camps
    const campDuration = (camp.endDate.getTime() - camp.startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (campDuration < 30) effectiveness -= 10;
    if (campDuration < 14) effectiveness -= 20;

    return Math.min(100, Math.max(0, effectiveness));
  }

  public generateTrainingSchedule(focus: TrainingFocusValue): DailyActivity[] {
    const schedules = {
      [TrainingFocus.STRENGTH_CONDITIONING]: [
        { time: '6:00 AM', activity: 'Morning run', duration: 60 },
        { time: '8:00 AM', activity: 'Breakfast', duration: 30 },
        { time: '9:00 AM', activity: 'Strength training', duration: 90 },
        { time: '12:00 PM', activity: 'Lunch', duration: 60 },
        { time: '2:00 PM', activity: 'Conditioning', duration: 60 },
        { time: '4:00 PM', activity: 'Recovery', duration: 30 },
        { time: '6:00 PM', activity: 'Dinner', duration: 60 },
        { time: '8:00 PM', activity: 'Stretching', duration: 30 }
      ],
      [TrainingFocus.TECHNICAL_SKILLS]: [
        { time: '6:00 AM', activity: 'Morning run', duration: 45 },
        { time: '8:00 AM', activity: 'Breakfast', duration: 30 },
        { time: '9:00 AM', activity: 'Technical training', duration: 120 },
        { time: '12:00 PM', activity: 'Lunch', duration: 60 },
        { time: '2:00 PM', activity: 'Sparring', duration: 90 },
        { time: '4:00 PM', activity: 'Bag work', duration: 60 },
        { time: '6:00 PM', activity: 'Dinner', duration: 60 },
        { time: '8:00 PM', activity: 'Film study', duration: 45 }
      ],
      [TrainingFocus.STRATEGY_GAMEPLAN]: [
        { time: '6:00 AM', activity: 'Light cardio', duration: 30 },
        { time: '8:00 AM', activity: 'Breakfast', duration: 30 },
        { time: '9:00 AM', activity: 'Strategy session', duration: 90 },
        { time: '12:00 PM', activity: 'Lunch', duration: 60 },
        { time: '2:00 PM', activity: 'Tactical sparring', duration: 90 },
        { time: '4:00 PM', activity: 'Game plan practice', duration: 60 },
        { time: '6:00 PM', activity: 'Dinner', duration: 60 },
        { time: '8:00 PM', activity: 'Film study', duration: 60 }
      ]
    };

    return schedules[focus] || schedules[TrainingFocus.TECHNICAL_SKILLS];
  }

  private generateStrengths(): string[] {
    const strengths = ['Power', 'Speed', 'Defense', 'Stamina', 'Accuracy', 'Footwork', 'Ring IQ', 'Chin'];
    return strengths.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  private generateWeaknesses(): string[] {
    const weaknesses = ['Defense', 'Stamina', 'Power', 'Speed', 'Accuracy', 'Footwork', 'Ring IQ', 'Chin'];
    return weaknesses.sort(() => Math.random() - 0.5).slice(0, 2);
  }

  private generateGamePlan(): string {
    const gamePlans = [
      'Use movement and counter-punching',
      'Pressure and body work',
      'Box from the outside',
      'Aggressive inside fighting',
      'Technical boxing with jabs'
    ];
    return gamePlans[Math.floor(Math.random() * gamePlans.length)];
  }

  private generateKeyTactics(): string[] {
    const tactics = [
      'Stay on outside',
      'Counter with jabs',
      'Work body',
      'Use footwork',
      'Pressure early',
      'Box and move',
      'Inside fighting',
      'Counter-punching'
    ];
    return tactics.sort(() => Math.random() - 0.5).slice(0, 3);
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Getters for data access
  public getTrainingCamps(): TrainingCamp[] {
    return Array.from(this.trainingCamps.values());
  }

  public getCoachingStaff(): CoachingStaff[] {
    return Array.from(this.coachingStaff.values());
  }

  public getSparringPartners(): SparringPartner[] {
    return Array.from(this.sparringPartners.values());
  }

  public getFilmStudySessions(): FilmStudySession[] {
    return Array.from(this.filmStudySessions.values());
  }
}

export const trainingCampSystem = new TrainingCampSystem(); 