import type { Fighter, Match, FightResult, RoundData, PunchStats, KnockdownEvent } from './unified-types';
import { EventEmitter } from 'events';

export interface CombatEngine {
  simulateFight(fighterA: Fighter, fighterB: Fighter, match: Match): FightResult;
  analyzeMatchup(fighterA: Fighter, fighterB: Fighter): any;
  calculatePunchAccuracy(attackingFighter: Fighter, defendingFighter: Fighter): number;
  calculatePunchPower(attackingFighter: Fighter): number;
  calculateDefense(defendingFighter: Fighter): number;
  calculateStamina(fighter: Fighter, round: number): number;
  calculateDamage(power: number, accuracy: number, defense: number): number;
  checkForKnockdown(damage: number, fighterStamina: number): boolean;
  checkForFinish(roundData: RoundData, fighterA: Fighter, fighterB: Fighter): boolean;
}

export class GloryCombatEngine extends EventEmitter implements CombatEngine {
  private fightHistory: Map<string, FightResult[]> = new Map();

  constructor() {
    super();
  }

  public simulateFight(fighterA: Fighter, fighterB: Fighter, match: Match): FightResult {
    const totalRounds = match.scheduled_rounds || 12;
    const roundData: RoundData[] = [];
    let currentRound = 1;
    let fighterAHealth = 100;
    let fighterBHealth = 100;
    let fighterAStamina = 100;
    let fighterBStamina = 100;

    // Pre-fight analysis
    const preFightAnalysis = this.analyzeMatchup(fighterA, fighterB);

    // Simulate each round
    while (currentRound <= totalRounds && fighterAHealth > 0 && fighterBHealth > 0) {
      const roundResult = this.simulateRound(
        fighterA,
        fighterB,
        currentRound,
        fighterAHealth,
        fighterBHealth,
        fighterAStamina,
        fighterBStamina
      );

      roundData.push(roundResult);

      // Update health and stamina
      fighterAHealth = roundResult.fighterAHealth;
      fighterBHealth = roundResult.fighterBHealth;
      fighterAStamina = roundResult.fighterAStamina;
      fighterBStamina = roundResult.fighterBStamina;

      // Check for finish
      if (this.checkForFinish(roundResult, fighterA, fighterB)) {
        break;
      }

      currentRound++;
    }

    // Determine winner
    let winner: Fighter;
    let method: 'ko' | 'tko' | 'decision' | 'submission' | 'draw' | 'KO/TKO' | 'Decision';
    let finalRounds: number;

    if (fighterAHealth <= 0) {
      winner = fighterB;
      method = 'KO/TKO';
      finalRounds = currentRound - 1;
    } else if (fighterBHealth <= 0) {
      winner = fighterA;
      method = 'KO/TKO';
      finalRounds = currentRound - 1;
    } else {
      // Decision
      const fighterAScore = this.calculateDecisionScore(roundData, fighterA);
      const fighterBScore = this.calculateDecisionScore(roundData, fighterB);
      
      if (fighterAScore > fighterBScore) {
        winner = fighterA;
        method = 'Decision';
      } else if (fighterBScore > fighterAScore) {
        winner = fighterB;
        method = 'Decision';
      } else {
        winner = fighterA; // Default to fighter A in case of draw
        method = 'draw';
      }
      finalRounds = currentRound - 1;
    }

    const result: FightResult = {
      winner: winner.id,
      method,
      rounds: finalRounds,
      roundData,
      punchStats: this.calculatePunchStats(roundData, fighterA, fighterB),
      knockdowns: this.checkForKnockdowns(roundData, fighterA, fighterB),
      analysis: {
        technicalScore: this.calculateTechnicalScore(roundData),
        entertainmentValue: this.calculateEntertainmentValue(roundData),
        historicalSignificance: this.calculateHistoricalSignificance(match, winner),
        keyMoments: this.identifyKeyMoments(roundData),
        fighterAnalysis: [
          this.analyzeFighterPerformance(roundData, fighterA),
          this.analyzeFighterPerformance(roundData, fighterB)
        ],
        tacticalBreakdown: this.analyzeTacticalBreakdown(roundData, fighterA, fighterB)
      }
    };

    // Store fight history
    const fighterAHistory = this.fightHistory.get(fighterA.id) || [];
    const fighterBHistory = this.fightHistory.get(fighterB.id) || [];
    fighterAHistory.push(result);
    fighterBHistory.push(result);
    this.fightHistory.set(fighterA.id, fighterAHistory);
    this.fightHistory.set(fighterB.id, fighterBHistory);

    this.emit('fightCompleted', result);
    return result;
  }

  private simulateRound(
    fighterA: Fighter,
    fighterB: Fighter,
    roundNumber: number,
    fighterAHealth: number,
    fighterBHealth: number,
    fighterAStamina: number,
    fighterBStamina: number
  ): RoundData {
    const events: any[] = [];
    let roundTime = 0;
    const roundDuration = 180; // 3 minutes

    while (roundTime < roundDuration && fighterAHealth > 0 && fighterBHealth > 0) {
      // Determine who attacks
      const fighterAAttacks = Math.random() > 0.5;
      const attackingFighter = fighterAAttacks ? fighterA : fighterB;
      const defendingFighter = fighterAAttacks ? fighterB : fighterA;

      // Calculate attack
      const accuracy = this.calculatePunchAccuracy(attackingFighter, defendingFighter);
      const power = this.calculatePunchPower(attackingFighter);
      const defense = this.calculateDefense(defendingFighter);
      const damage = this.calculateDamage(power, accuracy, defense);

      // Apply damage
      if (fighterAAttacks) {
        fighterBHealth -= damage;
      } else {
        fighterAHealth -= damage;
      }

      // Check for knockdown
      if (this.checkForKnockdown(damage, fighterAAttacks ? fighterAStamina : fighterBStamina)) {
        events.push({
          type: 'knockdown',
          time: roundTime,
          fighter: fighterAAttacks ? fighterA.id : fighterB.id,
          damage
        });
      }

      // Add punch event
      events.push({
        type: 'punch',
        time: roundTime,
        fighter: attackingFighter.id,
        accuracy,
        power,
        damage,
        landed: accuracy > defense
      });

      // Update stamina
      const staminaLoss = 2 + Math.random() * 3;
      if (fighterAAttacks) {
        fighterAStamina -= staminaLoss;
      } else {
        fighterBStamina -= staminaLoss;
      }

      roundTime += 10 + Math.random() * 20; // Random time between actions
    }

    return {
      round: roundNumber,
      duration: roundDuration,
      events,
      fighterAHealth: Math.max(0, fighterAHealth),
      fighterBHealth: Math.max(0, fighterBHealth),
      fighterAStamina: Math.max(0, fighterAStamina),
      fighterBStamina: Math.max(0, fighterBStamina),
      punchStats: this.calculatePunchStats(events, fighterA, fighterB),
      knockdowns: this.checkForKnockdowns(events, fighterA, fighterB)
    };
  }

  public analyzeMatchup(fighterA: Fighter, fighterB: Fighter): any {
    const avgPower = ((fighterA.power || 50) + (fighterB.power || 50)) / 2;
    const avgSpeed = ((fighterA.speed || 50) + (fighterB.speed || 50)) / 2;
    const avgStamina = ((fighterA.stamina || 50) + (fighterB.stamina || 50)) / 2;

    const powerAdvantage = (fighterA.power || 50) - (fighterB.power || 50);
    const speedAdvantage = (fighterA.speed || 50) - (fighterB.speed || 50);
    const staminaAdvantage = (fighterA.stamina || 50) - (fighterB.stamina || 50);

    const totalAdvantage = powerAdvantage + speedAdvantage + staminaAdvantage;
    const fighterAFavor = totalAdvantage > 0;
    const advantageMagnitude = Math.abs(totalAdvantage) / 3;

    const probability = 0.5 + (advantageMagnitude * 0.1);
    let cumulative = 0.5;

    return {
      avgPower,
      avgSpeed,
      avgStamina,
      powerAdvantage,
      speedAdvantage,
      staminaAdvantage,
      totalAdvantage,
      fighterAFavor,
      advantageMagnitude,
      probability: Math.min(0.9, Math.max(0.1, probability)),
      cumulative
    };
  }

  public calculatePunchAccuracy(attackingFighter: Fighter, defendingFighter: Fighter): number {
    const baseAccuracy = 50;
    const speedBonus = (attackingFighter.speed || 50) * 0.5;
    const experienceBonus = (attackingFighter.experience || 0) * 0.2;
    const defensePenalty = (defendingFighter.defense || 50) * 0.3;

    return Math.min(95, Math.max(5, baseAccuracy + speedBonus + experienceBonus - defensePenalty));
  }

  public calculatePunchPower(attackingFighter: Fighter): number {
    const basePower = 50;
    const powerBonus = (attackingFighter.power || 50) * 0.6;
    const staminaBonus = (attackingFighter.stamina || 50) * 0.2;

    return Math.min(100, Math.max(10, basePower + powerBonus + staminaBonus));
  }

  public calculateDefense(defendingFighter: Fighter): number {
    const baseDefense = 50;
    const defenseBonus = (defendingFighter.defense || 50) * 0.6;
    const speedBonus = (defendingFighter.speed || 50) * 0.3;

    return Math.min(95, Math.max(5, baseDefense + defenseBonus + speedBonus));
  }

  public calculateStamina(fighter: Fighter, round: number): number {
    const baseStamina = fighter.stamina || 50;
    const roundPenalty = round * 5;
    const experienceBonus = (fighter.experience || 0) * 0.5;

    return Math.max(0, baseStamina - roundPenalty + experienceBonus);
  }

  public calculateDamage(power: number, accuracy: number, defense: number): number {
    const hitChance = accuracy / 100;
    const damageReduction = defense / 100;
    const baseDamage = power * 0.8;

    if (Math.random() < hitChance) {
      return Math.max(0, baseDamage * (1 - damageReduction));
    }
    return 0;
  }

  public checkForKnockdown(damage: number, fighterStamina: number): boolean {
    const knockdownThreshold = 15 + (100 - fighterStamina) * 0.2;
    return damage > knockdownThreshold && Math.random() < 0.3;
  }

  public checkForFinish(roundData: RoundData, fighterA: Fighter, fighterB: Fighter): boolean {
    return roundData.fighterAHealth <= 0 || roundData.fighterBHealth <= 0;
  }

  private calculatePunchStats(events: any[], fighterA: Fighter, fighterB: Fighter): PunchStats {
    const fighterAPunches = events.filter(e => e.type === 'punch' && e.fighter === fighterA.id);
    const fighterBPunches = events.filter(e => e.type === 'punch' && e.fighter === fighterB.id);

    return {
      fighterA: {
        total: fighterAPunches.length,
        landed: fighterAPunches.filter(p => p.landed).length,
        accuracy: fighterAPunches.length > 0 ? fighterAPunches.filter(p => p.landed).length / fighterAPunches.length : 0,
        power: fighterAPunches.reduce((sum, p) => sum + p.power, 0) / Math.max(1, fighterAPunches.length)
      },
      fighterB: {
        total: fighterBPunches.length,
        landed: fighterBPunches.filter(p => p.landed).length,
        accuracy: fighterBPunches.length > 0 ? fighterBPunches.filter(p => p.landed).length / fighterBPunches.length : 0,
        power: fighterBPunches.reduce((sum, p) => sum + p.power, 0) / Math.max(1, fighterBPunches.length)
      }
    };
  }

  private checkForKnockdowns(events: any[], fighterA: Fighter, fighterB: Fighter): KnockdownEvent[] {
    return events
      .filter(e => e.type === 'knockdown')
      .map(e => ({
        fighter: e.fighter,
        round: 1, // This would need to be calculated based on timing
        timeInRound: e.time,
        damage: e.damage,
        type: 'knockdown' as const
      }));
  }

  private calculateDecisionScore(roundData: RoundData[], fighter: Fighter): number {
    return roundData.reduce((score, round) => {
      // For now, assume fighter A is the first fighter in the match
      // This would need to be properly determined based on the match data
      const fighterHealth = round.fighterAHealth; // Simplified for now
      const fighterStamina = round.fighterAStamina; // Simplified for now
      
      return score + (fighterHealth * 0.6 + fighterStamina * 0.4);
    }, 0);
  }

  private calculateTechnicalScore(roundData: RoundData[]): number {
    const totalEvents = roundData.reduce((sum, round) => sum + round.events.length, 0);
    const knockdowns = roundData.reduce((sum, round) => sum + round.events.filter(e => e.type === 'knockdown').length, 0);
    
    return Math.min(10, Math.max(1, (totalEvents / 10) + (knockdowns * 2)));
  }

  private calculateEntertainmentValue(roundData: RoundData[]): number {
    const knockdowns = roundData.reduce((sum, round) => sum + round.events.filter(e => e.type === 'knockdown').length, 0);
    const totalDamage = roundData.reduce((sum, round) => sum + round.events.reduce((roundSum, event) => roundSum + (event.damage || 0), 0), 0);
    
    return Math.min(10, Math.max(1, (knockdowns * 3) + (totalDamage / 100)));
  }

  private calculateHistoricalSignificance(match: Match, winner: Fighter): number {
    let significance = 5; // Base significance
    
    if (match.title_fight) significance += 3;
    if (winner.popularity && winner.popularity > 80) significance += 2;
    if (match.scheduled_rounds && match.scheduled_rounds >= 12) significance += 1;
    
    return Math.min(10, significance);
  }

  private identifyKeyMoments(roundData: RoundData[]): any[] {
    const keyMoments: any[] = [];
    
    roundData.forEach((round, index) => {
      const knockdowns = round.events.filter(e => e.type === 'knockdown');
      const highDamagePunches = round.events.filter(e => e.type === 'punch' && e.damage > 20);
      
      knockdowns.forEach(kd => {
        keyMoments.push({
          round: index + 1,
          time: kd.time,
          type: 'knockdown',
          fighter: kd.fighter,
          significance: 8
        });
      });
      
      highDamagePunches.forEach(punch => {
        keyMoments.push({
          round: index + 1,
          time: punch.time,
          type: 'power_punch',
          fighter: punch.fighter,
          significance: 6
        });
      });
    });
    
    return keyMoments;
  }

  private analyzeFighterPerformance(roundData: RoundData[], fighter: Fighter): any {
    const totalHealth = roundData.reduce((sum, round) => {
      // For now, assume this fighter is fighter A
      // This would need to be properly determined based on the match data
      const health = round.fighterAHealth; // Simplified for now
      return sum + health;
    }, 0);
    
    const avgHealth = totalHealth / roundData.length;
    const performance = (avgHealth / 100) * 10;
    
    return {
      fighterId: fighter.id,
      performance: Math.min(10, Math.max(1, performance)),
      strengths: this.identifyStrengths(roundData, fighter),
      weaknesses: this.identifyWeaknesses(roundData, fighter),
      adjustments: this.suggestAdjustments(roundData, fighter)
    };
  }

  private identifyStrengths(roundData: RoundData[], fighter: Fighter): string[] {
    const strengths: string[] = [];
    
    if (fighter.power && fighter.power > 70) strengths.push('Power punching');
    if (fighter.speed && fighter.speed > 70) strengths.push('Speed');
    if (fighter.defense && fighter.defense > 70) strengths.push('Defense');
    if (fighter.stamina && fighter.stamina > 70) strengths.push('Stamina');
    
    return strengths;
  }

  private identifyWeaknesses(roundData: RoundData[], fighter: Fighter): string[] {
    const weaknesses: string[] = [];
    
    if (fighter.power && fighter.power < 40) weaknesses.push('Lack of power');
    if (fighter.speed && fighter.speed < 40) weaknesses.push('Slow movement');
    if (fighter.defense && fighter.defense < 40) weaknesses.push('Poor defense');
    if (fighter.stamina && fighter.stamina < 40) weaknesses.push('Poor stamina');
    
    return weaknesses;
  }

  private suggestAdjustments(roundData: RoundData[], fighter: Fighter): string[] {
    const adjustments: string[] = [];
    
    // This would be more sophisticated in a real implementation
    if (fighter.power && fighter.power < 50) adjustments.push('Focus on power training');
    if (fighter.speed && fighter.speed < 50) adjustments.push('Improve footwork and speed');
    if (fighter.defense && fighter.defense < 50) adjustments.push('Work on defensive skills');
    
    return adjustments;
  }

  private analyzeTacticalBreakdown(roundData: RoundData[], fighterA: Fighter, fighterB: Fighter): any {
    const fighterAPerformance = this.analyzeFighterPerformance(roundData, fighterA);
    const fighterBPerformance = this.analyzeFighterPerformance(roundData, fighterB);
    
    return {
      fighterA: {
        approach: this.determineApproach(roundData, fighterA),
        effectiveness: fighterAPerformance.performance,
        adaptability: this.calculateAdaptability(roundData, fighterA),
        execution: fighterAPerformance.performance
      },
      fighterB: {
        approach: this.determineApproach(roundData, fighterB),
        effectiveness: fighterBPerformance.performance,
        adaptability: this.calculateAdaptability(roundData, fighterB),
        execution: fighterBPerformance.performance
      },
      comparison: this.compareApproaches(roundData, fighterA, fighterB),
      winner: fighterAPerformance.performance > fighterBPerformance.performance ? fighterA.id : fighterB.id,
      reasoning: this.generateReasoning(roundData, fighterA, fighterB)
    };
  }

  private determineApproach(roundData: RoundData[], fighter: Fighter): string {
    const totalPunches = roundData.reduce((sum, round) => {
      return sum + round.events.filter(e => e.type === 'punch' && e.fighter === fighter.id).length;
    }, 0);
    
    if (totalPunches > 50) return 'Aggressive';
    if (totalPunches > 30) return 'Balanced';
    return 'Defensive';
  }

  private calculateAdaptability(roundData: RoundData[], fighter: Fighter): number {
    // This would be more sophisticated in a real implementation
    return Math.floor(Math.random() * 4) + 6; // 6-10 range
  }

  private compareApproaches(roundData: RoundData[], fighterA: Fighter, fighterB: Fighter): string {
    const approachA = this.determineApproach(roundData, fighterA);
    const approachB = this.determineApproach(roundData, fighterB);
    
    if (approachA === approachB) return 'Similar approaches';
    if (approachA === 'Aggressive' && approachB === 'Defensive') return 'Aggressor vs Defender';
    if (approachA === 'Defensive' && approachB === 'Aggressive') return 'Defender vs Aggressor';
    return 'Different tactical approaches';
  }

  private generateReasoning(roundData: RoundData[], fighterA: Fighter, fighterB: Fighter): string {
    const fighterAPerformance = this.analyzeFighterPerformance(roundData, fighterA);
    const fighterBPerformance = this.analyzeFighterPerformance(roundData, fighterB);
    
    if (fighterAPerformance.performance > fighterBPerformance.performance) {
      return `${fighterA.name} executed their game plan more effectively`;
    } else {
      return `${fighterB.name} executed their game plan more effectively`;
    }
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Getters for data access
  public getFightHistory(fighterId: string): FightResult[] {
    return this.fightHistory.get(fighterId) || [];
  }
}

export const gloryCombatEngine = new GloryCombatEngine(); 