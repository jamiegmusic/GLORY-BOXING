import { Fighter, Match, FightResult, RoundData, PunchStats, KnockdownEvent } from './unified-types'

export interface CombatEngineConfig {
  aiEnabled: boolean
  realTimeSimulation: boolean
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert'
  commentaryEnabled: boolean
  healthMonitoring: boolean
}

export interface CombatStats {
  punchesThrown: number
  punchesLanded: number
  powerShots: number
  knockdowns: number
  stamina: number
  damage: number
  accuracy: number
  defense: number
}

export class GloryCombatEngine {
  private config: CombatEngineConfig
  private aiModels: Map<string, any> = new Map()

  constructor(config: CombatEngineConfig) {
    this.config = config
    this.initializeAI()
  }

  private initializeAI() {
    if (this.config.aiEnabled) {
      // Initialize AI models for different aspects
      this.aiModels.set('commentary', this.createCommentaryAI())
      this.aiModels.set('tactics', this.createTacticsAI())
      this.aiModels.set('prediction', this.createPredictionAI())
    }
  }

  private createCommentaryAI() {
    return {
      generateRoundCommentary: (roundData: RoundData, fighters: [Fighter, Fighter]) => {
        const [fighterA, fighterB] = fighters
        const commentary = this.generateAICommentary(roundData, fighterA, fighterB)
        return {
          text: commentary,
          highlights: this.extractHighlights(roundData),
          emotion: this.analyzeEmotion(roundData)
        }
      }
    }
  }

  private createTacticsAI() {
    return {
      analyzeFighter: (fighter: Fighter, opponent: Fighter) => {
        return {
          strengths: this.analyzeStrengths(fighter),
          weaknesses: this.analyzeWeaknesses(fighter),
          strategy: this.generateStrategy(fighter, opponent),
          adjustments: this.suggestAdjustments(fighter, opponent)
        }
      }
    }
  }

  private createPredictionAI() {
    return {
      predictWinner: (fighterA: Fighter, fighterB: Fighter) => {
        const analysis = this.analyzeMatchup(fighterA, fighterB)
        return {
          winner: analysis.predictedWinner,
          confidence: analysis.confidence,
          reasoning: analysis.reasoning,
          keyFactors: analysis.keyFactors
        }
      }
    }
  }

  public async simulateFight(match: Match, fighters: [Fighter, Fighter]): Promise<FightResult> {
    const [fighterA, fighterB] = fighters
    const rounds = match.rounds || 12
    const roundData: RoundData[] = []
    let currentRound = 1

    // Pre-fight analysis
    const preFightAnalysis = this.analyzeMatchup(fighterA, fighterB)
    const prediction = this.aiModels.get('prediction')?.predictWinner(fighterA, fighterB)

    // Real-time simulation
    while (currentRound <= rounds) {
      const roundResult = await this.simulateRound(
        currentRound,
        fighterA,
        fighterB,
        roundData
      )

      roundData.push(roundResult)

      // Check for early finish
      if (this.checkForFinish(roundResult, fighterA, fighterB)) {
        break
      }

      // AI commentary for this round
      if (this.config.commentaryEnabled) {
        const commentary = this.aiModels.get('commentary')?.generateRoundCommentary(
          roundResult,
          [fighterA, fighterB]
        )
        roundResult.commentary = commentary
      }

      currentRound++
    }

    // Determine winner and method
    const finalResult = this.determineWinner(roundData, fighterA, fighterB)
    
    // Generate comprehensive fight analysis
    const analysis = this.generateFightAnalysis(roundData, fighterA, fighterB, finalResult)

    const result: FightResult = {
      match,
      winner: finalResult.winner,
      loser: finalResult.winner === fighterA ? fighterB : fighterA,
      method: finalResult.method,
      rounds_completed: currentRound - 1,
      total_punches: this.calculateTotalPunches(roundData),
      knockdowns: this.calculateTotalKnockdowns(roundData),
      fight_rating: this.calculateFightRating(roundData, finalResult),
      crowd_reaction: 8,
      media_coverage: 7,
      round: finalResult.round,
      roundData,
      fighterA,
      fighterB,
      timeInRound: finalResult.timeInRound || '0:00',
      rating: this.calculateFightRating(roundData, finalResult)
    }

    // Store additional data separately if needed
    ;(result as any).analysis = analysis
    ;(result as any).prediction = prediction
    ;(result as any).statistics = this.calculateFightStatistics(roundData)
    ;(result as any).highlights = this.extractFightHighlights(roundData)

    return result
  }

  private async simulateRound(
    roundNumber: number,
    fighterA: Fighter,
    fighterB: Fighter,
    previousRounds: RoundData[]
  ): Promise<RoundData> {
    const roundData: RoundData = {
      round_number: roundNumber,
      fighter_a_score: 0,
      fighter_b_score: 0,
      fighter_a_punches: 0,
      fighter_b_punches: 0,
      fighter_a_power_shots: 0,
      fighter_b_power_shots: 0,
      knockdowns: [],
      round_winner: 'EVEN',
      round_notes: [],
      round: roundNumber,
      duration: 180, // 3 minutes
      events: [],
      punchStats: {
        fighter_a_total_punches: 0,
        fighter_b_total_punches: 0,
        fighter_a_accuracy: 0,
        fighter_b_accuracy: 0,
        fighter_a_power_punches: 0,
        fighter_b_power_punches: 0,
        fighter_a_jabs: 0,
        fighter_b_jabs: 0,
        fighterA: { thrown: 0, landed: 0, power: 0 },
        fighterB: { thrown: 0, landed: 0, power: 0 },
        totalPunches: { fighterA: 0, fighterB: 0 },
        totalLanded: { fighterA: 0, fighterB: 0 },
        totalPower: { fighterA: 0, fighterB: 0 },
        knockdowns: { fighterA: 0, fighterB: 0 }
      },
      commentary: '',
      analysis: ''
    }

    // Simulate round events
    const events = this.generateRoundEvents(fighterA, fighterB, roundNumber, previousRounds)
    roundData.events = events

    // Calculate punch statistics
    roundData.punchStats = this.calculatePunchStats(events, fighterA, fighterB)

    // Check for knockdowns
    roundData.knockdowns = this.checkForKnockdowns(events, fighterA, fighterB)

    // Generate round analysis
    roundData.analysis = this.analyzeRound(roundData, fighterA, fighterB)

    return roundData
  }

  private generateRoundEvents(
    fighterA: Fighter,
    fighterB: Fighter,
    roundNumber: number,
    previousRounds: RoundData[]
  ): any[] {
    const events = []
    const timeInRound = 180 // 3 minutes in seconds
    let currentTime = 0

    while (currentTime < timeInRound) {
      // Determine action based on fighter stats and AI
      const action = this.determineAction(fighterA, fighterB, currentTime, previousRounds)
      
      if (action) {
        events.push({
          ...action,
          timeInRound: this.formatTime(currentTime)
        })
      }

      currentTime += this.getActionInterval()
    }

    return events
  }

  private determineAction(
    fighterA: Fighter,
    fighterB: Fighter,
    timeInRound: number,
    previousRounds: RoundData[]
  ): any {
    // AI-driven action determination
    const tacticsAI = this.aiModels.get('tactics')
    const fighterAAnalysis = tacticsAI?.analyzeFighter(fighterA, fighterB)
    const fighterBAnalysis = tacticsAI?.analyzeFighter(fighterB, fighterA)

    // Calculate action probabilities based on fighter stats and AI analysis
    const actionProbabilities = this.calculateActionProbabilities(
      fighterA,
      fighterB,
      fighterAAnalysis,
      fighterBAnalysis,
      timeInRound
    )

    // Select action based on probabilities
    const selectedAction = this.selectAction(actionProbabilities)

    return {
      type: selectedAction.type,
      fighter: selectedAction.fighter,
      target: selectedAction.target,
      success: this.calculateSuccess(selectedAction, fighterA, fighterB),
      damage: this.calculateDamage(selectedAction, fighterA, fighterB),
      combo: selectedAction.combo || false
    }
  }

  private calculateActionProbabilities(
    fighterA: Fighter,
    fighterB: Fighter,
    analysisA: any,
    analysisB: any,
    timeInRound: number
  ) {
    // Complex probability calculation based on:
    // - Fighter stats (power, speed, stamina, etc.)
    // - AI analysis (strengths, weaknesses, strategy)
    // - Time in round (stamina effects)
    // - Previous rounds (momentum, damage accumulation)
    
    const baseProbabilities = {
      punch: 0.4,
      powerShot: 0.2,
      defense: 0.2,
      movement: 0.1,
      clinch: 0.1
    }

    // Adjust based on fighter stats
    const adjustedProbabilities = this.adjustProbabilitiesByStats(
      baseProbabilities,
      fighterA,
      fighterB,
      timeInRound
    )

    return adjustedProbabilities
  }

  private adjustProbabilitiesByStats(
    base: any,
    fighterA: Fighter,
    fighterB: Fighter,
    timeInRound: number
  ) {
    // Adjust probabilities based on fighter characteristics
    const staminaFactor = this.calculateStaminaFactor(timeInRound)
    const powerFactor = this.calculatePowerFactor(fighterA, fighterB)
    const speedFactor = this.calculateSpeedFactor(fighterA, fighterB)

    return {
      punch: base.punch * staminaFactor * speedFactor,
      powerShot: base.powerShot * staminaFactor * powerFactor,
      defense: base.defense * (1 - staminaFactor * 0.5),
      movement: base.movement * speedFactor,
      clinch: base.clinch * staminaFactor
    }
  }

  private calculateStaminaFactor(timeInRound: number): number {
    // Stamina decreases over time
    const staminaDecay = timeInRound / 180 // 3 minutes
    return Math.max(0.3, 1 - staminaDecay * 0.7)
  }

  private calculatePowerFactor(fighterA: Fighter, fighterB: Fighter): number {
    const avgPower = (fighterA.power + fighterB.power) / 2
    return Math.min(1.5, avgPower / 50) // Normalize to 0-1.5 range
  }

  private calculateSpeedFactor(fighterA: Fighter, fighterB: Fighter): number {
    const avgSpeed = (fighterA.speed + fighterB.speed) / 2
    return Math.min(1.5, avgSpeed / 50)
  }

  private selectAction(probabilities: any): any {
    const random = Math.random()
    let cumulative = 0

    for (const [action, probability] of Object.entries(probabilities)) {
      cumulative += probability as number
      if (random <= cumulative) {
        return {
          type: action,
          fighter: Math.random() > 0.5 ? 'fighterA' : 'fighterB',
          target: 'head', // Could be randomized
          combo: Math.random() > 0.8 // 20% chance of combo
        }
      }
    }

    return { type: 'punch', fighter: 'fighterA', target: 'head' }
  }

  private calculateSuccess(action: any, fighterA: Fighter, fighterB: Fighter): boolean {
    const attackingFighter = action.fighter === 'fighterA' ? fighterA : fighterB
    const defendingFighter = action.fighter === 'fighterA' ? fighterB : fighterA

    const accuracy = attackingFighter.accuracy || 50
    const defense = defendingFighter.defense || 50
    const speed = attackingFighter.speed || 50

    // Calculate success probability
    const baseSuccess = accuracy / 100
    const defenseFactor = (100 - defense) / 100
    const speedBonus = speed / 100 * 0.2

    const successProbability = baseSuccess * defenseFactor + speedBonus
    return Math.random() < successProbability
  }

  private calculateDamage(action: any, fighterA: Fighter, fighterB: Fighter): number {
    const attackingFighter = action.fighter === 'fighterA' ? fighterA : fighterB
    const power = attackingFighter.power || 50

    let baseDamage = power / 10

    // Adjust damage based on action type
    switch (action.type) {
      case 'powerShot':
        baseDamage *= 1.5
        break
      case 'combo':
        baseDamage *= 1.2
        break
      case 'punch':
      default:
        baseDamage *= 1.0
        break
    }

    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4 // 0.8 to 1.2
    return Math.round(baseDamage * randomFactor)
  }

  private calculatePunchStats(events: any[], fighterA: Fighter, fighterB: Fighter): PunchStats {
    const stats: PunchStats = {
      fighter_a_total_punches: 0,
      fighter_b_total_punches: 0,
      fighter_a_accuracy: 0,
      fighter_b_accuracy: 0,
      fighter_a_power_punches: 0,
      fighter_b_power_punches: 0,
      fighter_a_jabs: 0,
      fighter_b_jabs: 0,
      fighterA: { thrown: 0, landed: 0, power: 0 },
      fighterB: { thrown: 0, landed: 0, power: 0 },
      totalPunches: { fighterA: 0, fighterB: 0 },
      totalLanded: { fighterA: 0, fighterB: 0 },
      totalPower: { fighterA: 0, fighterB: 0 },
      knockdowns: { fighterA: 0, fighterB: 0 }
    }

    events.forEach(event => {
      if (event.type === 'punch' || event.type === 'powerShot') {
        const fighter = event.fighter === 'fighterA' ? 'fighterA' : 'fighterB'
        stats[fighter].thrown++
        
        if (event.success) {
          stats[fighter].landed++
          stats[fighter].power += event.damage
        }
      }
    })

    return stats
  }

  private checkForKnockdowns(events: any[], fighterA: Fighter, fighterB: Fighter): KnockdownEvent[] {
    const knockdowns: KnockdownEvent[] = []

    events.forEach(event => {
      if (event.success && event.damage > 15) { // High damage threshold
        const knockdownChance = event.damage / 100
        if (Math.random() < knockdownChance) {
          knockdowns.push({
            fighter: event.fighter,
            round: event.round,
            time: event.timeInRound || '0:00',
            timeInRound: event.timeInRound || '0:00',
            type: event.damage > 25 ? 'knockdown' : 'flash',
            recovery_time: Math.floor(Math.random() * 10) + 5
          })
        }
      }
    })

    return knockdowns
  }

  private checkForFinish(roundData: RoundData, fighterA: Fighter, fighterB: Fighter): boolean {
    // Check for KO/TKO conditions
    const knockdownsA = roundData.knockdowns.filter(kd => 
      typeof kd === 'string' ? kd === 'fighterA' : kd.fighter === 'fighterA'
    ).length
    const knockdownsB = roundData.knockdowns.filter(kd => 
      typeof kd === 'string' ? kd === 'fighterB' : kd.fighter === 'fighterB'
    ).length

    // Three knockdown rule
    if (knockdownsA >= 3 || knockdownsB >= 3) {
      return true
    }

    // Check for severe damage
    const damageThreshold = 50
    const totalDamageA = roundData.punchStats.fighterA.power
    const totalDamageB = roundData.punchStats.fighterB.power

    if (totalDamageA > damageThreshold || totalDamageB > damageThreshold) {
      return true
    }

    return false
  }

  private determineWinner(roundData: RoundData[], fighterA: Fighter, fighterB: Fighter): any {
    // Calculate total damage and knockdowns
    let damageA = 0, damageB = 0
    let knockdownsA = 0, knockdownsB = 0

    roundData.forEach(round => {
      damageA += round.punchStats.fighterA.power
      damageB += round.punchStats.fighterB.power
      knockdownsA += round.knockdowns.filter(kd => 
        typeof kd === 'string' ? kd === 'fighterA' : kd.fighter === 'fighterA'
      ).length
      knockdownsB += round.knockdowns.filter(kd => 
        typeof kd === 'string' ? kd === 'fighterB' : kd.fighter === 'fighterB'
      ).length
    })

    // Determine winner and method
    if (knockdownsA >= 3) {
      return { winner: fighterB.name, method: 'tko', round: roundData.length, timeInRound: '0:00' }
    } else if (knockdownsB >= 3) {
      return { winner: fighterA.name, method: 'tko', round: roundData.length, timeInRound: '0:00' }
    } else if (damageA > damageB * 1.5) {
      return { winner: fighterA.name, method: 'ko', round: roundData.length, timeInRound: '0:00' }
    } else if (damageB > damageA * 1.5) {
      return { winner: fighterB.name, method: 'ko', round: roundData.length, timeInRound: '0:00' }
    } else {
      // Decision based on damage and knockdowns
      const scoreA = damageA + knockdownsA * 10
      const scoreB = damageB + knockdownsB * 10
      
      if (scoreA > scoreB) {
        return { winner: fighterA.name, method: 'decision', round: roundData.length, timeInRound: '0:00' }
      } else {
        return { winner: fighterB.name, method: 'decision', round: roundData.length, timeInRound: '0:00' }
      }
    }
  }

  private generateAICommentary(roundData: RoundData, fighterA: Fighter, fighterB: Fighter): string {
    // AI-generated commentary based on round events
    const events = roundData.events
    const knockdowns = roundData.knockdowns
    const punchStats = roundData.punchStats

    let commentary = `Round ${roundData.round}: `

    if (knockdowns.length > 0) {
      const firstKnockdown = knockdowns[0]
      const fighterName = typeof firstKnockdown === 'string' 
        ? (firstKnockdown === 'fighterA' ? fighterA.name : fighterB.name)
        : (firstKnockdown.fighter === 'fighterA' ? fighterA.name : fighterB.name)
      commentary += `DRAMATIC MOMENT! ${fighterName} scores a knockdown! `
    }

    if (punchStats.fighterA.landed > punchStats.fighterB.landed) {
      commentary += `${fighterA.name} is controlling the pace with superior accuracy. `
    } else if (punchStats.fighterB.landed > punchStats.fighterA.landed) {
      commentary += `${fighterB.name} is landing the cleaner shots. `
    }

    if (punchStats.fighterA.power > punchStats.fighterB.power) {
      commentary += `${fighterA.name} is doing the heavier damage. `
    } else if (punchStats.fighterB.power > punchStats.fighterA.power) {
      commentary += `${fighterB.name} is landing the more powerful shots. `
    }

    return commentary
  }

  private extractHighlights(roundData: RoundData): string[] {
    const highlights: string[] = []

    if (roundData.knockdowns.length > 0) {
      highlights.push(`${roundData.knockdowns.length} knockdown(s) in the round`)
    }

    const totalPunches = roundData.punchStats.fighterA.landed + roundData.punchStats.fighterB.landed
    if (totalPunches > 20) {
      highlights.push('High volume of punches landed')
    }

    const powerShots = roundData.punchStats.fighterA.power + roundData.punchStats.fighterB.power
    if (powerShots > 30) {
      highlights.push('Significant power shots landed')
    }

    return highlights
  }

  private analyzeEmotion(roundData: RoundData): string {
    const knockdowns = roundData.knockdowns.length
    const totalDamage = roundData.punchStats.fighterA.power + roundData.punchStats.fighterB.power

    if (knockdowns > 0) {
      return 'dramatic'
    } else if (totalDamage > 40) {
      return 'intense'
    } else if (totalDamage > 20) {
      return 'competitive'
    } else {
      return 'tactical'
    }
  }

  private analyzeMatchup(fighterA: Fighter, fighterB: Fighter): any {
    const analysis = {
      predictedWinner: null as string | null,
      confidence: 0,
      reasoning: '',
      keyFactors: [] as string[]
    }

    // Compare key attributes
    const powerDiff = (fighterA.power || 50) - (fighterB.power || 50)
    const speedDiff = (fighterA.speed || 50) - (fighterB.speed || 50)
    const experienceDiff = (fighterA.experience || 0) - (fighterB.experience || 0)

    if (Math.abs(powerDiff) > 20) {
      analysis.keyFactors.push('Power advantage')
    }
    if (Math.abs(speedDiff) > 20) {
      analysis.keyFactors.push('Speed advantage')
    }
    if (Math.abs(experienceDiff) > 5) {
      analysis.keyFactors.push('Experience advantage')
    }

    // Predict winner based on attributes
    const totalScoreA = (fighterA.power || 50) + (fighterA.speed || 50) + (fighterA.experience || 0)
    const totalScoreB = (fighterB.power || 50) + (fighterB.speed || 50) + (fighterB.experience || 0)

    if (totalScoreA > totalScoreB) {
      analysis.predictedWinner = fighterA.name
      analysis.confidence = Math.min(0.9, (totalScoreA - totalScoreB) / 100)
    } else {
      analysis.predictedWinner = fighterB.name
      analysis.confidence = Math.min(0.9, (totalScoreB - totalScoreA) / 100)
    }

    analysis.reasoning = `Based on power, speed, and experience comparison`

    return analysis
  }

  private analyzeStrengths(fighter: Fighter): string[] {
    const strengths: string[] = []

    if ((fighter.power || 0) > 70) strengths.push('Power punching')
    if ((fighter.speed || 0) > 70) strengths.push('Hand speed')
    if ((fighter.defense || 0) > 70) strengths.push('Defensive skills')
    if ((fighter.experience || 0) > 10) strengths.push('Ring experience')
    if ((fighter.stamina || 0) > 70) strengths.push('Endurance')

    return strengths
  }

  private analyzeWeaknesses(fighter: Fighter): string[] {
    const weaknesses: string[] = []

    if ((fighter.power || 0) < 30) weaknesses.push('Lack of power')
    if ((fighter.speed || 0) < 30) weaknesses.push('Slow hands')
    if ((fighter.defense || 0) < 30) weaknesses.push('Poor defense')
    if ((fighter.experience || 0) < 5) weaknesses.push('Inexperience')
    if ((fighter.stamina || 0) < 30) weaknesses.push('Poor stamina')

    return weaknesses
  }

  private generateStrategy(fighter: Fighter, opponent: Fighter): string {
    const fighterPower = fighter.power || 50
    const opponentDefense = opponent.defense || 50
    const fighterSpeed = fighter.speed || 50

    if (fighterPower > opponentDefense + 20) {
      return 'Aggressive power punching strategy'
    } else if (fighterSpeed > 70) {
      return 'Speed and movement-based strategy'
    } else {
      return 'Technical boxing strategy'
    }
  }

  private suggestAdjustments(fighter: Fighter, opponent: Fighter): string[] {
    const adjustments: string[] = []

    if ((fighter.power || 0) < (opponent.defense || 0)) {
      adjustments.push('Focus on body shots to wear down opponent')
    }

    if ((fighter.speed || 0) < (opponent.speed || 0)) {
      adjustments.push('Use timing and angles to compensate for speed')
    }

    if ((fighter.stamina || 0) < 50) {
      adjustments.push('Conserve energy for later rounds')
    }

    return adjustments
  }

  private analyzeRound(roundData: RoundData, fighterA: Fighter, fighterB: Fighter): string {
    const stats = roundData.punchStats
    const knockdowns = roundData.knockdowns

    let analysis = `Round ${roundData.round} analysis: `

    if (knockdowns.length > 0) {
      analysis += `Major moment with knockdown(s). `
    }

    if (stats.fighterA.landed > stats.fighterB.landed) {
      analysis += `${fighterA.name} controlled the round with better accuracy. `
    } else if (stats.fighterB.landed > stats.fighterA.landed) {
      analysis += `${fighterB.name} landed more punches. `
    }

    if (stats.fighterA.power > stats.fighterB.power) {
      analysis += `${fighterA.name} did more damage. `
    } else if (stats.fighterB.power > stats.fighterA.power) {
      analysis += `${fighterB.name} landed the harder shots. `
    }

    return analysis
  }

  private calculateTotalPunches(roundData: RoundData[]): number {
    return roundData.reduce((total, round) => {
      return total + round.fighter_a_punches + round.fighter_b_punches
    }, 0)
  }

  private calculateTotalKnockdowns(roundData: RoundData[]): number {
    return roundData.reduce((total, round) => {
      return total + (round.knockdowns?.length || 0)
    }, 0)
  }

  private generateFightAnalysis(
    roundData: RoundData[],
    fighterA: Fighter,
    fighterB: Fighter,
    result: any
  ): string {
    let analysis = `This was a ${result.method.toUpperCase()} victory for ${result.winner}. `

    const totalRounds = roundData.length
    const totalDamageA = roundData.reduce((sum, round) => sum + round.punchStats.fighterA.power, 0)
    const totalDamageB = roundData.reduce((sum, round) => sum + round.punchStats.fighterB.power, 0)
    const totalKnockdowns = roundData.reduce((sum, round) => sum + round.knockdowns.length, 0)

    if (totalKnockdowns > 0) {
      analysis += `The fight featured ${totalKnockdowns} knockdown(s). `
    }

    if (result.winner === fighterA.name) {
      analysis += `${fighterA.name} showed superior ${totalDamageA > totalDamageB ? 'power' : 'technique'}. `
    } else {
      analysis += `${fighterB.name} demonstrated better ${totalDamageB > totalDamageA ? 'power' : 'technique'}. `
    }

    analysis += `The key turning point came when ${result.winner} began to land the heavier shots.`

    return analysis
  }

  private calculateFightStatistics(roundData: RoundData[]): any {
    const stats = {
      totalPunches: { fighterA: 0, fighterB: 0 },
      totalLanded: { fighterA: 0, fighterB: 0 },
      totalPower: { fighterA: 0, fighterB: 0 },
      knockdowns: { fighterA: 0, fighterB: 0 },
      accuracy: { fighterA: 0, fighterB: 0 }
    }

    roundData.forEach(round => {
      stats.totalPunches.fighterA += round.punchStats.fighterA.thrown
      stats.totalPunches.fighterB += round.punchStats.fighterB.thrown
      stats.totalLanded.fighterA += round.punchStats.fighterA.landed
      stats.totalLanded.fighterB += round.punchStats.fighterB.landed
      stats.totalPower.fighterA += round.punchStats.fighterA.power
      stats.totalPower.fighterB += round.punchStats.fighterB.power

      round.knockdowns.forEach(kd => {
        if (typeof kd === 'string' ? kd === 'fighterA' : kd.fighter === 'fighterA') {
          stats.knockdowns!.fighterA++
        } else {
          stats.knockdowns!.fighterB++
        }
      })
    })

    // Calculate accuracy percentages
    stats.accuracy.fighterA = stats.totalPunches.fighterA > 0 
      ? (stats.totalLanded.fighterA / stats.totalPunches.fighterA) * 100 
      : 0
    stats.accuracy.fighterB = stats.totalPunches.fighterB > 0 
      ? (stats.totalLanded.fighterB / stats.totalPunches.fighterB) * 100 
      : 0

    return stats
  }

  private extractFightHighlights(roundData: RoundData[]): string[] {
    const highlights: string[] = []

    const totalKnockdowns = roundData.reduce((sum, round) => sum + round.knockdowns.length, 0)
    if (totalKnockdowns > 0) {
      highlights.push(`${totalKnockdowns} knockdown(s) in the fight`)
    }

    const totalPunches = roundData.reduce((sum, round) => 
      sum + round.punchStats.fighterA.landed + round.punchStats.fighterB.landed, 0)
    if (totalPunches > 100) {
      highlights.push('High volume of punches landed')
    }

    const totalPower = roundData.reduce((sum, round) => 
      sum + round.punchStats.fighterA.power + round.punchStats.fighterB.power, 0)
    if (totalPower > 200) {
      highlights.push('Significant power shots landed')
    }

    return highlights
  }

  private calculateFightRating(roundData: RoundData[], result: any): number {
    let rating = 5.0 // Base rating

    // Add points for excitement factors
    const totalKnockdowns = roundData.reduce((sum, round) => sum + round.knockdowns.length, 0)
    const totalRounds = roundData.length
    const totalDamage = roundData.reduce((sum, round) => 
      sum + round.punchStats.fighterA.power + round.punchStats.fighterB.power, 0)

    // Knockdowns add excitement
    rating += totalKnockdowns * 0.5

    // Close fights are more exciting
    const damageDiff = Math.abs(totalDamage / 2 - totalDamage / 2)
    if (damageDiff < 50) rating += 0.5

    // Early finishes can be exciting
    if (result.method === 'ko' || result.method === 'tko') {
      if (result.round <= 6) rating += 0.5
    }

    // Cap at 10.0
    return Math.min(10.0, rating)
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  private getActionInterval(): number {
    // Random interval between actions (2-8 seconds)
    return 2 + Math.random() * 6
  }

  public updateConfig(newConfig: Partial<CombatEngineConfig>) {
    this.config = { ...this.config, ...newConfig }
    if (newConfig.aiEnabled !== undefined) {
      this.initializeAI()
    }
  }

  public getConfig(): CombatEngineConfig {
    return { ...this.config }
  }
}

// Export singleton instance
export const combatEngine = new GloryCombatEngine({
  aiEnabled: true,
  realTimeSimulation: true,
  difficultyLevel: 'medium',
  commentaryEnabled: true,
  healthMonitoring: true
}) 