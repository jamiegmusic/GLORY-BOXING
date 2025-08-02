import type { FightData, FightEvent, CommentaryRequest, CommentaryResponse } from './eventSchema'

export interface AICommentaryConfig {
  style: 'technical' | 'dramatic' | 'casual' | 'expert' | 'colorful'
  focus: 'play_by_play' | 'analysis' | 'entertainment' | 'technical' | 'mixed'
  language: string
  targetAudience: 'casual' | 'expert' | 'mixed'
  includeStatistics: boolean
  includeHistoricalContext: boolean
  emotionalIntensity: number // 0-100
  crowdReaction: 'cheer' | 'boo' | 'silence' | 'roar' | 'gasp' | 'applause' | 'mixed'
}

export interface CommentaryContext {
  round: number
  timeInRound: number
  totalFightTime: number
  energyLevels: { fighter_a: number; fighter_b: number }
  ringPosition: 'center' | 'corner' | 'ropes' | 'neutral'
  fightMomentum: 'fighter_a' | 'fighter_b' | 'even'
  significantEvents: number
  knockdowns: { fighter_a: number; fighter_b: number }
  cuts: { fighter_a: number; fighter_b: number }
}

export class AICommentaryEngine {
  private config: AICommentaryConfig
  private historicalData: Map<string, any> = new Map()
  private styleTemplates: Map<string, any> = new Map()
  private emotionalStates: Map<string, any> = new Map()

  constructor(config: AICommentaryConfig) {
    this.config = config
    this.initializeStyleTemplates()
    this.initializeEmotionalStates()
    this.loadHistoricalData()
  }

  private initializeStyleTemplates() {
    // Technical Style - Analytical and precise
    this.styleTemplates.set('technical', {
      punchDescriptions: {
        jab: 'delivers a precise jab',
        cross: 'executes a powerful right cross',
        hook: 'launches a calculated left hook',
        uppercut: 'delivers a strategic uppercut',
        body: 'targets the body with precision'
      },
      damageDescriptions: {
        light: 'lands with technical accuracy',
        medium: 'connects with solid technique',
        heavy: 'delivers with devastating power',
        critical: 'executes a fight-altering blow'
      },
      dodgeDescriptions: {
        slip: 'demonstrates superior defensive technique',
        duck: 'exhibits excellent defensive awareness',
        step_back: 'shows tactical retreat',
        roll: 'displays advanced defensive skills'
      },
      commentaryTone: 'analytical',
      technicalFocus: true,
      statisticalEmphasis: true
    })

    // Dramatic Style - Emotional and exciting
    this.styleTemplates.set('dramatic', {
      punchDescriptions: {
        jab: 'UNLEASHES a lightning-fast jab',
        cross: 'THUNDERS a devastating right cross',
        hook: 'EXPLODES with a monstrous left hook',
        uppercut: 'LAUNCHES a bone-crushing uppercut',
        body: 'HAMMERS the body with brutal force'
      },
      damageDescriptions: {
        light: 'strikes with surgical precision',
        medium: 'lands with thunderous impact',
        heavy: 'delivers with earth-shattering power',
        critical: 'unleashes a fight-ending blow'
      },
      dodgeDescriptions: {
        slip: 'dances away from danger',
        duck: 'weaves through the storm',
        step_back: 'retreats with tactical brilliance',
        roll: 'defies gravity with defensive mastery'
      },
      commentaryTone: 'emotional',
      technicalFocus: false,
      statisticalEmphasis: false
    })

    // Casual Style - Relaxed and conversational
    this.styleTemplates.set('casual', {
      punchDescriptions: {
        jab: 'throws out a quick jab',
        cross: 'lets go with a solid right',
        hook: 'comes over with a nice left hook',
        uppercut: 'goes upstairs with an uppercut',
        body: 'goes to the body with a good shot'
      },
      damageDescriptions: {
        light: 'gets in there nicely',
        medium: 'lands a good one',
        heavy: 'really connects with that',
        critical: 'lands a big one that could change things'
      },
      dodgeDescriptions: {
        slip: 'gets out of the way nicely',
        duck: 'ducks under that one',
        step_back: 'backs up to avoid trouble',
        roll: 'rolls with the punches'
      },
      commentaryTone: 'conversational',
      technicalFocus: false,
      statisticalEmphasis: false
    })

    // Expert Style - Professional and knowledgeable
    this.styleTemplates.set('expert', {
      punchDescriptions: {
        jab: 'establishes the jab effectively',
        cross: 'delivers a textbook right cross',
        hook: 'executes a perfectly timed left hook',
        uppercut: 'demonstrates excellent uppercut technique',
        body: 'shows intelligent body work'
      },
      damageDescriptions: {
        light: 'demonstrates superior technique',
        medium: 'shows excellent timing and power',
        heavy: 'displays world-class punching power',
        critical: 'executes a masterful combination'
      },
      dodgeDescriptions: {
        slip: 'shows elite defensive skills',
        duck: 'demonstrates excellent head movement',
        step_back: 'exhibits superior footwork',
        roll: 'displays masterful defensive technique'
      },
      commentaryTone: 'professional',
      technicalFocus: true,
      statisticalEmphasis: true
    })

    // Colorful Style - Entertaining and descriptive
    this.styleTemplates.set('colorful', {
      punchDescriptions: {
        jab: 'snakes out a lightning jab',
        cross: 'fires a rocket of a right hand',
        hook: 'unleashes a thunderous left hook',
        uppercut: 'launches a missile of an uppercut',
        body: 'hammers the body like a blacksmith'
      },
      damageDescriptions: {
        light: 'lands like a butterfly with a sting',
        medium: 'connects like a freight train',
        heavy: 'lands with the force of a hurricane',
        critical: 'delivers a knockout blow for the ages'
      },
      dodgeDescriptions: {
        slip: 'dances away like a matador',
        duck: 'weaves through punches like a ghost',
        step_back: 'glides away with the grace of a gazelle',
        roll: 'defies physics with defensive wizardry'
      },
      commentaryTone: 'entertaining',
      technicalFocus: false,
      statisticalEmphasis: false
    })
  }

  private initializeEmotionalStates() {
    this.emotionalStates.set('cheer', {
      intensity: 0.8,
      vocabulary: ['amazing', 'incredible', 'fantastic', 'brilliant'],
      exclamations: ['Wow!', 'Incredible!', 'Fantastic!', 'Brilliant!']
    })

    this.emotionalStates.set('roar', {
      intensity: 1.0,
      vocabulary: ['devastating', 'explosive', 'thunderous', 'earth-shattering'],
      exclamations: ['BOOM!', 'THUNDER!', 'EXPLOSION!', 'DEVASTATION!']
    })

    this.emotionalStates.set('gasp', {
      intensity: 0.9,
      vocabulary: ['shocking', 'stunning', 'unbelievable', 'incredible'],
      exclamations: ['OH MY!', 'UNBELIEVABLE!', 'STUNNING!', 'INCREDIBLE!']
    })

    this.emotionalStates.set('silence', {
      intensity: 0.3,
      vocabulary: ['careful', 'measured', 'precise', 'calculated'],
      exclamations: ['Hmm...', 'Interesting...', 'Careful...', 'Measured...']
    })

    this.emotionalStates.set('boo', {
      intensity: 0.4,
      vocabulary: ['disappointing', 'lackluster', 'poor', 'weak'],
      exclamations: ['Oh...', 'Disappointing...', 'Weak...', 'Poor...']
    })
  }

  private loadHistoricalData() {
    // Load historical fight data for context
    this.historicalData.set('usyk', {
      style: 'Technical boxer with exceptional footwork',
      strengths: ['Footwork', 'Ring IQ', 'Stamina', 'Technical precision'],
      weaknesses: ['Power', 'Size disadvantage'],
      notableFights: ['Usyk vs Joshua', 'Usyk vs Bellew', 'Usyk vs Gassiev']
    })

    this.historicalData.set('bivol', {
      style: 'Power puncher with solid fundamentals',
      strengths: ['Power', 'Size', 'Fundamentals', 'Punch variety'],
      weaknesses: ['Footwork', 'Defense'],
      notableFights: ['Bivol vs Alvarez', 'Bivol vs Smith', 'Bivol vs Pascal']
    })
  }

  public generateAdvancedCommentary(fightData: FightData, context: CommentaryContext): CommentaryResponse {
    const template = this.styleTemplates.get(this.config.style)
    const emotionalState = this.emotionalStates.get(this.config.crowdReaction)
    
    const commentary: string[] = []
    const roundSummaries: string[] = []
    const highlights: string[] = []
    const technicalNotes: string[] = []
    const statistics: string[] = []

    // Generate commentary for each event
    fightData.events.forEach((event, index) => {
      const commentaryLine = this.generateEventCommentary(event, fightData, context, template, emotionalState)
      if (commentaryLine) {
        commentary.push(commentaryLine)
        
        // Add to highlights if significant
        if (event.significance === 'significant' || event.significance === 'decisive') {
          highlights.push(commentaryLine)
        }
      }
    })

    // Generate round summaries
    const rounds = Math.max(...fightData.events.map(e => e.round))
    for (let i = 1; i <= rounds; i++) {
      const roundEvents = fightData.events.filter(e => e.round === i)
      if (roundEvents.length > 0) {
        const roundSummary = this.generateRoundSummary(i, roundEvents, fightData, context)
        roundSummaries.push(roundSummary)
      }
    }

    // Generate technical analysis
    technicalNotes.push(...this.generateTechnicalAnalysis(fightData, context))

    // Generate statistics
    if (this.config.includeStatistics) {
      statistics.push(...this.generateStatistics(fightData, context))
    }

    // Generate fight summary
    const fightSummary = this.generateFightSummary(fightData, context)

    return {
      commentary,
      roundSummaries,
      fightSummary,
      highlights,
      technicalNotes,
      statistics,
      metadata: {
        totalEvents: fightData.events.length,
        significantEvents: fightData.events.filter(e => e.significance === 'significant').length,
        roundsCovered: rounds,
        generationTime: 1.5,
        style: this.config.style
      }
    }
  }

  private generateEventCommentary(
    event: FightEvent, 
    fightData: FightData, 
    context: CommentaryContext,
    template: any,
    emotionalState: any
  ): string {
    const fighter = event.fighter === 'fighter_a' ? fightData.fighterA : fightData.fighterB
    const opponent = event.fighter === 'fighter_a' ? fightData.fighterB : fightData.fighterA

    if (event.eventType === 'punch') {
      return this.generatePunchCommentary(event, fighter, opponent, template, emotionalState, context)
    } else if (event.eventType === 'dodge') {
      return this.generateDodgeCommentary(event, fighter, opponent, template, emotionalState, context)
    } else if (event.eventType === 'knockdown') {
      return this.generateKnockdownCommentary(event, fighter, opponent, template, emotionalState, context)
    } else if (event.details.commentary) {
      return this.adaptCommentaryToStyle(event.details.commentary, template, emotionalState)
    }

    return ''
  }

  private generatePunchCommentary(
    event: FightEvent,
    fighter: any,
    opponent: any,
    template: any,
    emotionalState: any,
    context: CommentaryContext
  ): string {
    const punchType = event.details.punchType
    const damageLevel = event.details.damageLevel
    const accuracy = event.details.accuracy || 0
    const power = event.details.power || 0

    if (!punchType || !damageLevel) return ''

    const punchDescription = template.punchDescriptions[punchType] || 'throws a punch'
    const damageDescription = template.damageDescriptions[damageLevel] || 'lands'
    
    let commentary = `${fighter.name} ${punchDescription} that ${damageDescription}!`

    // Add emotional intensity
    if (emotionalState.intensity > 0.7) {
      const exclamation = emotionalState.exclamations[Math.floor(Math.random() * emotionalState.exclamations.length)]
      commentary += ` ${exclamation}`
    }

    // Add technical details for expert/technical styles
    if (template.technicalFocus) {
      if (accuracy > 80) commentary += ` Excellent accuracy!`
      if (power > 80) commentary += ` Tremendous power!`
      if (event.details.counterPunch) commentary += ` Beautiful counter-punching!`
    }

    // Add historical context
    if (this.config.includeHistoricalContext) {
      const historicalContext = this.getHistoricalContext(fighter, event)
      if (historicalContext) {
        commentary += ` ${historicalContext}`
      }
    }

    return commentary
  }

  private generateDodgeCommentary(
    event: FightEvent,
    fighter: any,
    opponent: any,
    template: any,
    emotionalState: any,
    context: CommentaryContext
  ): string {
    const dodgeType = event.details.dodgeType
    if (!dodgeType) return ''

    const dodgeDescription = template.dodgeDescriptions[dodgeType] || 'avoids the punch'
    let commentary = `${fighter.name} ${dodgeDescription}!`

    // Add emotional intensity
    if (emotionalState.intensity > 0.6) {
      const exclamation = emotionalState.exclamations[Math.floor(Math.random() * emotionalState.exclamations.length)]
      commentary += ` ${exclamation}`
    }

    return commentary
  }

  private generateKnockdownCommentary(
    event: FightEvent,
    fighter: any,
    opponent: any,
    template: any,
    emotionalState: any,
    context: CommentaryContext
  ): string {
    const knockdownType = event.details.knockdownType
    if (!knockdownType) return ''

    let commentary = ''
    
    if (knockdownType === 'devastating') {
      commentary = `${fighter.name} delivers a DEVASTATING blow that sends ${opponent.name} crashing to the canvas!`
    } else if (knockdownType === 'heavy') {
      commentary = `${fighter.name} lands a HEAVY shot that drops ${opponent.name}!`
    } else if (knockdownType === 'flash') {
      commentary = `${fighter.name} catches ${opponent.name} with a flash knockdown!`
    } else {
      commentary = `${fighter.name} scores a knockdown against ${opponent.name}!`
    }

    // Add emotional intensity
    if (emotionalState.intensity > 0.8) {
      commentary += ` ${emotionalState.exclamations[0]}`
    }

    return commentary
  }

  private adaptCommentaryToStyle(originalCommentary: string, template: any, emotionalState: any): string {
    let adapted = originalCommentary

    // Adapt vocabulary based on style
    if (template.commentaryTone === 'dramatic') {
      adapted = adapted.replace(/lands/g, 'THUNDERS')
      adapted = adapted.replace(/throws/g, 'UNLEASHES')
      adapted = adapted.replace(/hits/g, 'HAMMERS')
    } else if (template.commentaryTone === 'technical') {
      adapted = adapted.replace(/lands/g, 'delivers with precision')
      adapted = adapted.replace(/throws/g, 'executes')
      adapted = adapted.replace(/hits/g, 'connects with technique')
    }

    // Add emotional intensity
    if (emotionalState.intensity > 0.7) {
      const exclamation = emotionalState.exclamations[Math.floor(Math.random() * emotionalState.exclamations.length)]
      adapted += ` ${exclamation}`
    }

    return adapted
  }

  private generateRoundSummary(round: number, events: FightEvent[], fightData: FightData, context: CommentaryContext): string {
    const template = this.styleTemplates.get(this.config.style)
    
    let summary = `Round ${round} saw `
    
    if (template.commentaryTone === 'technical') {
      summary += `${fightData.fighterA.name} and ${fightData.fighterB.name} engaging in a technical battle, `
      summary += `with both fighters demonstrating excellent skills and strategic thinking.`
    } else if (template.commentaryTone === 'dramatic') {
      summary += `${fightData.fighterA.name} and ${fightData.fighterB.name} trading FIRE in an explosive round, `
      summary += `with both warriors leaving everything in the ring!`
    } else {
      summary += `${fightData.fighterA.name} and ${fightData.fighterB.name} trading blows, `
      summary += `with both fighters showing their skills.`
    }

    return summary
  }

  private generateTechnicalAnalysis(fightData: FightData, context: CommentaryContext): string[] {
    const analysis: string[] = []

    // Analyze fighter performance
    if (context.fightMomentum === 'fighter_a') {
      analysis.push(`${fightData.fighterA.name} is controlling the pace and dictating the action.`)
    } else if (context.fightMomentum === 'fighter_b') {
      analysis.push(`${fightData.fighterB.name} is gaining momentum and taking control.`)
    } else {
      analysis.push('Both fighters are evenly matched, creating an exciting back-and-forth battle.')
    }

    // Analyze energy levels
    if (context.energyLevels.fighter_a < 30) {
      analysis.push(`${fightData.fighterA.name} is showing signs of fatigue.`)
    }
    if (context.energyLevels.fighter_b < 30) {
      analysis.push(`${fightData.fighterB.name} is beginning to tire.`)
    }

    // Analyze significant events
    if (context.significantEvents > 5) {
      analysis.push('This has been an action-packed fight with numerous significant moments.')
    }

    return analysis
  }

  private generateStatistics(fightData: FightData, context: CommentaryContext): string[] {
    const stats: string[] = []

    // Calculate basic statistics
    const totalPunches = fightData.events.filter(e => e.eventType === 'punch').length
    const landedPunches = fightData.events.filter(e => 
      e.eventType === 'punch' && (e.details.accuracy || 0) > 50
    ).length
    const accuracy = totalPunches > 0 ? Math.round((landedPunches / totalPunches) * 100) : 0

    stats.push(`Total punches thrown: ${totalPunches}`)
    stats.push(`Punches landed: ${landedPunches} (${accuracy}% accuracy)`)
    stats.push(`Total knockdowns: ${context.knockdowns.fighter_a + context.knockdowns.fighter_b}`)
    stats.push(`Fight duration: ${Math.floor(context.totalFightTime / 60)}:${(context.totalFightTime % 60).toString().padStart(2, '0')}`)

    return stats
  }

  private generateFightSummary(fightData: FightData, context: CommentaryContext): string {
    const template = this.styleTemplates.get(this.config.style)
    
    if (template.commentaryTone === 'technical') {
      return `${fightData.fighterA.name} demonstrated superior technical skills to defeat ${fightData.fighterB.name} by unanimous decision in a masterclass of boxing technique.`
    } else if (template.commentaryTone === 'dramatic') {
      return `${fightData.fighterA.name} emerged victorious in an EPIC battle against ${fightData.fighterB.name}, winning by unanimous decision in a fight that will be remembered for years to come!`
    } else {
      return `${fightData.fighterA.name} defeated ${fightData.fighterB.name} by unanimous decision in a closely contested battle.`
    }
  }

  private getHistoricalContext(fighter: any, event: FightEvent): string {
    const historicalData = this.historicalData.get(fighter.id)
    if (!historicalData) return ''

    // Add historical references based on event type
    if (event.eventType === 'punch' && event.details.punchType === 'jab') {
      return `This is the same jab that made ${fighter.name} famous in his previous fights.`
    } else if (event.eventType === 'dodge' && event.details.dodgeType === 'slip') {
      return `${fighter.name}'s defensive skills are reminiscent of his earlier career.`
    }

    return ''
  }

  public updateConfig(newConfig: Partial<AICommentaryConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  public getConfig(): AICommentaryConfig {
    return { ...this.config }
  }
}

// Export singleton instance
export const aiCommentaryEngine = new AICommentaryEngine({
  style: 'dramatic',
  focus: 'mixed',
  language: 'en',
  targetAudience: 'mixed',
  includeStatistics: true,
  includeHistoricalContext: true,
  emotionalIntensity: 75,
  crowdReaction: 'roar'
}) 