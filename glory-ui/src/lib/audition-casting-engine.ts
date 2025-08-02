// Audition & Casting System Engine
// Handles interactive audition mini-games, casting calls, and performance evaluation

import type { 
  Celebrity, 
  CelebrityIndustryValue,
  ActingSkills,
  MusicSkills,
  SportsSkills
} from './unified-types';

export interface Audition {
  id: string;
  celebrity_id: string;
  role_title: string;
  project_name: string;
  industry: CelebrityIndustryValue;
  audition_type: AuditionTypeValue;
  difficulty_level: number; // 1-10
  requirements: AuditionRequirement[];
  performance_score: number; // 0-100
  suitability_score: number; // 0-100
  feedback: string[];
  status: 'scheduled' | 'completed' | 'passed' | 'failed';
  scheduled_date: Date;
  completed_date?: Date;
  created_at: Date;
}

export interface CastingCall {
  id: string;
  project_name: string;
  role_title: string;
  industry: CelebrityIndustryValue;
  audition_type: AuditionTypeValue;
  requirements: AuditionRequirement[];
  difficulty_level: number;
  compensation_range: {
    min: number;
    max: number;
  };
  deadline: Date;
  location: string;
  description: string;
  created_at: Date;
}

export interface AuditionRequirement {
  skill_name: string;
  minimum_level: number;
  weight: number; // 0-1, importance in scoring
}

export interface AuditionPerformance {
  audition_id: string;
  skill_scores: Record<string, number>;
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface AuditionMiniGame {
  id: string;
  type: AuditionGameTypeValue;
  difficulty: number;
  instructions: string;
  success_criteria: string[];
  time_limit?: number; // seconds
  max_score: number;
}

export const AuditionType = {
  ACTING_SCENE: 'acting_scene',
  MONOLOGUE: 'monologue',
  IMPROVISATION: 'improvisation',
  COLD_READING: 'cold_reading',
  SINGING: 'singing',
  DANCING: 'dancing',
  PHYSICAL_PERFORMANCE: 'physical_performance',
  VOICE_ACTING: 'voice_acting',
  AUDITION_TAPE: 'audition_tape',
  LIVE_PERFORMANCE: 'live_performance'
} as const;

export type AuditionTypeValue = typeof AuditionType[keyof typeof AuditionType];

export const AuditionGameType = {
  EMOTION_MATCHING: 'emotion_matching',
  LINE_DELIVERY: 'line_delivery',
  CHARACTER_ANALYSIS: 'character_analysis',
  IMPROV_CHALLENGE: 'improv_challenge',
  VOCAL_RANGE: 'vocal_range',
  DANCE_COMBINATION: 'dance_combination',
  PHYSICAL_CHALLENGE: 'physical_challenge',
  VOICE_MODULATION: 'voice_modulation',
  MEMORY_TEST: 'memory_test',
  CHEMISTRY_TEST: 'chemistry_test'
} as const;

export type AuditionGameTypeValue = typeof AuditionGameType[keyof typeof AuditionGameType];

export class AuditionCastingEngine {
  private auditions: Map<string, Audition> = new Map();
  private castingCalls: Map<string, CastingCall> = new Map();
  private performances: Map<string, AuditionPerformance> = new Map();
  private miniGames: Map<string, AuditionMiniGame> = new Map();

  constructor() {
    this.initializeMiniGames();
  }

  // ===== CASTING CALL MANAGEMENT =====

  createCastingCall(data: Omit<CastingCall, 'id' | 'created_at'>): CastingCall {
    const id = `casting_call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const castingCall: CastingCall = {
      ...data,
      id,
      created_at: now
    };

    this.castingCalls.set(id, castingCall);
    return castingCall;
  }

  getCastingCalls(industry?: CelebrityIndustryValue): CastingCall[] {
    const calls = Array.from(this.castingCalls.values());
    if (industry) {
      return calls.filter(call => call.industry === industry);
    }
    return calls;
  }

  getCastingCall(id: string): CastingCall | null {
    return this.castingCalls.get(id) || null;
  }

  // ===== AUDITION MANAGEMENT =====

  scheduleAudition(celebrityId: string, castingCallId: string, scheduledDate: Date): Audition {
    const castingCall = this.castingCalls.get(castingCallId);
    if (!castingCall) {
      throw new Error('Casting call not found');
    }

    const id = `audition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const audition: Audition = {
      id,
      celebrity_id: celebrityId,
      role_title: castingCall.role_title,
      project_name: castingCall.project_name,
      industry: castingCall.industry,
      audition_type: castingCall.audition_type,
      difficulty_level: castingCall.difficulty_level,
      requirements: castingCall.requirements,
      performance_score: 0,
      suitability_score: 0,
      feedback: [],
      status: 'scheduled',
      scheduled_date: scheduledDate,
      created_at: now
    };

    this.auditions.set(id, audition);
    return audition;
  }

  getAuditions(celebrityId?: string): Audition[] {
    const auditions = Array.from(this.auditions.values());
    if (celebrityId) {
      return auditions.filter(audition => audition.celebrity_id === celebrityId);
    }
    return auditions;
  }

  getAudition(id: string): Audition | null {
    return this.auditions.get(id) || null;
  }

  // ===== AUDITION PERFORMANCE EVALUATION =====

  evaluateAudition(auditionId: string, performanceData: any): AuditionPerformance {
    const audition = this.auditions.get(auditionId);
    if (!audition) {
      throw new Error('Audition not found');
    }

    const skillScores: Record<string, number> = {};
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Evaluate each requirement
    audition.requirements.forEach(requirement => {
      const skillScore = this.evaluateSkill(audition.celebrity_id, requirement.skill_name, performanceData);
      skillScores[requirement.skill_name] = skillScore;

      if (skillScore >= requirement.minimum_level) {
        strengths.push(`${requirement.skill_name}: ${skillScore}/100`);
      } else {
        weaknesses.push(`${requirement.skill_name}: ${skillScore}/100 (required: ${requirement.minimum_level})`);
      }
    });

    // Calculate overall score
    const overallScore = this.calculateOverallScore(audition.requirements, skillScores);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(audition, skillScores, overallScore);

    const performance: AuditionPerformance = {
      audition_id: auditionId,
      skill_scores: skillScores,
      overall_score: overallScore,
      strengths,
      weaknesses,
      recommendations
    };

    this.performances.set(auditionId, performance);

    // Update audition with results
    audition.performance_score = overallScore;
    audition.suitability_score = this.calculateSuitabilityScore(audition, performance);
    audition.status = overallScore >= 70 ? 'passed' : 'failed';
    audition.completed_date = new Date();
    audition.feedback = this.generateFeedback(performance);

    return performance;
  }

  private evaluateSkill(celebrityId: string, skillName: string, performanceData: any): number {
    // This would integrate with the celebrity's actual skills
    // For now, generate a realistic score based on performance data
    const baseScore = Math.random() * 40 + 30; // 30-70 base score
    const performanceBonus = performanceData[skillName] || 0;
    const difficultyModifier = performanceData.difficulty || 1;
    
    return Math.min(100, Math.max(0, baseScore + performanceBonus - (difficultyModifier * 10)));
  }

  private calculateOverallScore(requirements: AuditionRequirement[], skillScores: Record<string, number>): number {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    requirements.forEach(requirement => {
      const score = skillScores[requirement.skill_name] || 0;
      totalWeightedScore += score * requirement.weight;
      totalWeight += requirement.weight;
    });

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  }

  private calculateSuitabilityScore(audition: Audition, performance: AuditionPerformance): number {
    // Calculate suitability based on performance and requirements match
    const requirementMatch = audition.requirements.reduce((match, requirement) => {
      const score = performance.skill_scores[requirement.skill_name] || 0;
      return match + (score >= requirement.minimum_level ? 1 : 0);
    }, 0) / audition.requirements.length;

    const performanceWeight = 0.7;
    const requirementWeight = 0.3;

    return (performance.overall_score * performanceWeight) + (requirementMatch * 100 * requirementWeight);
  }

  private generateRecommendations(audition: Audition, skillScores: Record<string, number>, overallScore: number): string[] {
    const recommendations: string[] = [];

    // Performance-based recommendations
    if (overallScore < 50) {
      recommendations.push('Consider additional training before next audition');
      recommendations.push('Focus on fundamental skills development');
    } else if (overallScore < 70) {
      recommendations.push('Practice specific skills that were below requirements');
      recommendations.push('Work on audition technique and presentation');
    } else {
      recommendations.push('Excellent performance - maintain current training regimen');
      recommendations.push('Consider more challenging roles');
    }

    // Skill-specific recommendations
    audition.requirements.forEach(requirement => {
      const score = skillScores[requirement.skill_name] || 0;
      if (score < requirement.minimum_level) {
        recommendations.push(`Focus on improving ${requirement.skill_name} skills`);
      }
    });

    return recommendations;
  }

  private generateFeedback(performance: AuditionPerformance): string[] {
    const feedback: string[] = [];

    if (performance.strengths.length > 0) {
      feedback.push(`Strengths: ${performance.strengths.join(', ')}`);
    }

    if (performance.weaknesses.length > 0) {
      feedback.push(`Areas for improvement: ${performance.weaknesses.join(', ')}`);
    }

    feedback.push(`Overall score: ${performance.overall_score}/100`);

    if (performance.overall_score >= 80) {
      feedback.push('Outstanding performance - highly recommended for the role');
    } else if (performance.overall_score >= 70) {
      feedback.push('Good performance - suitable for the role with minor considerations');
    } else if (performance.overall_score >= 50) {
      feedback.push('Adequate performance - consider for supporting roles');
    } else {
      feedback.push('Performance needs significant improvement before consideration');
    }

    return feedback;
  }

  // ===== AUDITION MINI-GAMES =====

  private initializeMiniGames(): void {
    const games: AuditionMiniGame[] = [
      {
        id: 'emotion_matching_1',
        type: 'emotion_matching',
        difficulty: 5,
        instructions: 'Match the emotional expression to the given scenario',
        success_criteria: ['Accurate emotion portrayal', 'Consistent character voice', 'Appropriate intensity'],
        time_limit: 60,
        max_score: 100
      },
      {
        id: 'line_delivery_1',
        type: 'line_delivery',
        difficulty: 7,
        instructions: 'Deliver the given lines with proper emotion and timing',
        success_criteria: ['Clear articulation', 'Emotional authenticity', 'Proper pacing'],
        time_limit: 120,
        max_score: 100
      },
      {
        id: 'improv_challenge_1',
        type: 'improv_challenge',
        difficulty: 8,
        instructions: 'Create a scene based on the given prompt',
        success_criteria: ['Quick thinking', 'Character consistency', 'Engaging storytelling'],
        time_limit: 180,
        max_score: 100
      },
      {
        id: 'vocal_range_1',
        type: 'vocal_range',
        difficulty: 6,
        instructions: 'Demonstrate vocal range and control',
        success_criteria: ['Pitch accuracy', 'Tone quality', 'Breath control'],
        time_limit: 90,
        max_score: 100
      },
      {
        id: 'dance_combination_1',
        type: 'dance_combination',
        difficulty: 7,
        instructions: 'Perform the choreographed dance combination',
        success_criteria: ['Precise movements', 'Rhythm accuracy', 'Performance energy'],
        time_limit: 150,
        max_score: 100
      }
    ];

    games.forEach(game => {
      this.miniGames.set(game.id, game);
    });
  }

  getMiniGame(gameId: string): AuditionMiniGame | null {
    return this.miniGames.get(gameId) || null;
  }

  getMiniGamesByType(type: AuditionGameTypeValue): AuditionMiniGame[] {
    return Array.from(this.miniGames.values()).filter(game => game.type === type);
  }

  playMiniGame(gameId: string, celebrityId: string): { score: number; feedback: string[] } {
    const game = this.miniGames.get(gameId);
    if (!game) {
      throw new Error('Mini-game not found');
    }

    // Simulate mini-game performance
    const baseScore = Math.random() * 40 + 30; // 30-70 base
    const difficultyModifier = (10 - game.difficulty) * 2; // Easier games get bonus
    const finalScore = Math.min(100, Math.max(0, baseScore + difficultyModifier));

    const feedback: string[] = [];
    
    if (finalScore >= 80) {
      feedback.push('Excellent performance!');
      feedback.push('All criteria met with exceptional quality');
    } else if (finalScore >= 60) {
      feedback.push('Good performance');
      feedback.push('Most criteria met satisfactorily');
    } else {
      feedback.push('Performance needs improvement');
      feedback.push('Focus on fundamental skills');
    }

    return { score: finalScore, feedback };
  }

  // ===== ROLE SUITABILITY ANALYSIS =====

  analyzeRoleSuitability(celebrityId: string, castingCallId: string): {
    suitability_score: number;
    match_factors: string[];
    mismatch_factors: string[];
    recommendations: string[];
  } {
    const castingCall = this.castingCalls.get(castingCallId);
    if (!castingCall) {
      throw new Error('Casting call not found');
    }

    // This would integrate with actual celebrity skills
    // For now, generate realistic analysis
    const suitabilityScore = Math.random() * 40 + 40; // 40-80 range
    const matchFactors: string[] = [];
    const mismatchFactors: string[] = [];
    const recommendations: string[] = [];

    castingCall.requirements.forEach(requirement => {
      const skillMatch = Math.random() > 0.5;
      if (skillMatch) {
        matchFactors.push(`Strong ${requirement.skill_name} skills`);
      } else {
        mismatchFactors.push(`Limited ${requirement.skill_name} experience`);
        recommendations.push(`Develop ${requirement.skill_name} skills`);
      }
    });

    if (suitabilityScore >= 70) {
      recommendations.push('Excellent role match - highly recommended');
    } else if (suitabilityScore >= 50) {
      recommendations.push('Good potential - consider with preparation');
    } else {
      recommendations.push('May not be the best fit for this role');
    }

    return {
      suitability_score: suitabilityScore,
      match_factors: matchFactors,
      mismatch_factors: mismatchFactors,
      recommendations
    };
  }

  // ===== AUDITION STATISTICS =====

  getAuditionStats(celebrityId: string): {
    total_auditions: number;
    passed_auditions: number;
    failed_auditions: number;
    average_score: number;
    success_rate: number;
    best_performance: number;
    recent_trend: 'improving' | 'declining' | 'stable';
  } {
    const celebrityAuditions = this.getAuditions(celebrityId);
    
    const totalAuditions = celebrityAuditions.length;
    const passedAuditions = celebrityAuditions.filter(a => a.status === 'passed').length;
    const failedAuditions = celebrityAuditions.filter(a => a.status === 'failed').length;
    const averageScore = celebrityAuditions.length > 0 ? 
      celebrityAuditions.reduce((sum, a) => sum + a.performance_score, 0) / celebrityAuditions.length : 0;
    const successRate = totalAuditions > 0 ? (passedAuditions / totalAuditions) * 100 : 0;
    const bestPerformance = celebrityAuditions.length > 0 ? 
      Math.max(...celebrityAuditions.map(a => a.performance_score)) : 0;

    // Calculate recent trend (simplified)
    const recentAuditions = celebrityAuditions.slice(-5);
    const recentAverage = recentAuditions.length > 0 ? 
      recentAuditions.reduce((sum, a) => sum + a.performance_score, 0) / recentAuditions.length : 0;
    
    let recentTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentAverage > averageScore + 5) recentTrend = 'improving';
    else if (recentAverage < averageScore - 5) recentTrend = 'declining';

    return {
      total_auditions: totalAuditions,
      passed_auditions: passedAuditions,
      failed_auditions: failedAuditions,
      average_score: averageScore,
      success_rate: successRate,
      best_performance: bestPerformance,
      recent_trend: recentTrend
    };
  }

  // ===== UTILITY METHODS =====

  getAuditionPerformance(auditionId: string): AuditionPerformance | null {
    return this.performances.get(auditionId) || null;
  }

  getAllPerformances(): AuditionPerformance[] {
    return Array.from(this.performances.values());
  }
}

// Export singleton instance
export const auditionCastingEngine = new AuditionCastingEngine(); 