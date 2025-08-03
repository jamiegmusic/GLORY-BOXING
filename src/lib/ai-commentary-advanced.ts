import { Fighter, FightEvent } from '@/types/game'

// Advanced AI Commentary Types
export interface CommentaryStyle {
  id: string
  name: string
  tone: 'technical' | 'dramatic' | 'casual' | 'expert' | 'colorful'
  vocabulary: 'basic' | 'intermediate' | 'advanced' | 'expert'
  emotionalIntensity: number // 0-100
  technicalDepth: number // 0-100
  entertainmentValue: number // 0-100
}

export interface EmotionalContext {
  crowdEnergy: number // 0-100
  tension: number // 0-100
  excitement: number // 0-100
  drama: number // 0-100
  momentum: 'fighter_a' | 'fighter_b' | 'shifting' | 'even'
  significantMoments: number
}

export interface HistoricalContext {
  previousMeetings: FightHistory[]
  fighterLegacy: FighterLegacy[]
  historicalComparisons: HistoricalComparison[]
  recordBreakingPotential: RecordBreaking[]
}

export interface FightHistory {
  date: Date
  winner: string
  method: string
  round: number
  significance: string
}

export interface FighterLegacy {
  fighterId: string
  achievements: string[]
  historicalRank: number
  eraDefining: boolean
  legendStatus: number // 0-100
}

export interface HistoricalComparison {
  event: string
  comparison: string
  similarity: number // 0-100
  historicalFight: string
  year: number
}

export interface RecordBreaking {
  type: string
  current: string
  potential: string
  likelihood: number // 0-100
}

export interface AICommentaryConfig {
  style: CommentaryStyle
  emotionalAdaptation: boolean
  historicalReferences: boolean
  realTimeAnalysis: boolean
  predictiveCommentary: boolean
  audienceEngagement: boolean
}

// Pre-defined commentary styles
export const COMMENTARY_STYLES: Record<string, CommentaryStyle> = {
  TECHNICAL: {
    id: 'technical',
    name: 'Technical Analysis',
    tone: 'technical',
    vocabulary: 'expert',
    emotionalIntensity: 30,
    technicalDepth: 95,
    entertainmentValue: 50
  },
  DRAMATIC: {
    id: 'dramatic',
    name: 'Dramatic Storytelling',
    tone: 'dramatic',
    vocabulary: 'intermediate',
    emotionalIntensity: 90,
    technicalDepth: 40,
    entertainmentValue: 95
  },
  CASUAL: {
    id: 'casual',
    name: 'Casual Fan-Friendly',
    tone: 'casual',
    vocabulary: 'basic',
    emotionalIntensity: 60,
    technicalDepth: 30,
    entertainmentValue: 80
  },
  EXPERT: {
    id: 'expert',
    name: 'Expert Breakdown',
    tone: 'expert',
    vocabulary: 'advanced',
    emotionalIntensity: 40,
    technicalDepth: 90,
    entertainmentValue: 60
  },
  COLORFUL: {
    id: 'colorful',
    name: 'Colorful Entertainment',
    tone: 'colorful',
    vocabulary: 'intermediate',
    emotionalIntensity: 85,
    technicalDepth: 50,
    entertainmentValue: 100
  }
}

export class AdvancedAICommentaryEngine {
  private config: AICommentaryConfig
  private emotionalContext: EmotionalContext
  private historicalContext: HistoricalContext
  private commentaryBuffer: string[] = []
  private phraseDatabase: Map<string, string[]> = new Map()

  constructor(config: AICommentaryConfig) {
    this.config = config
    this.emotionalContext = this.initializeEmotionalContext()
    this.historicalContext = this.initializeHistoricalContext()
    this.initializePhraseDatabase()
  }

  private initializeEmotionalContext(): EmotionalContext {
    return {
      crowdEnergy: 50,
      tension: 50,
      excitement: 50,
      drama: 50,
      momentum: 'even',
      significantMoments: 0
    }
  }

  private initializeHistoricalContext(): HistoricalContext {
    return {
      previousMeetings: [],
      fighterLegacy: [],
      historicalComparisons: [],
      recordBreakingPotential: []
    }
  }

  private initializePhraseDatabase() {
    // Technical phrases
    this.phraseDatabase.set('technical_strike', [
      'Textbook execution of the {technique}',
      'Perfect biomechanics on that {technique}',
      'Excellent weight transfer into the {technique}',
      'Fundamentally sound {technique} landing flush'
    ])

    // Dramatic phrases
    this.phraseDatabase.set('dramatic_strike', [
      'DEVASTATING {technique} rocks {target}!',
      'OH MY! What a {technique}!',
      'The crowd ERUPTS as the {technique} lands!',
      'UNBELIEVABLE {technique} sends shockwaves through the arena!'
    ])

    // Casual phrases
    this.phraseDatabase.set('casual_strike', [
      'Nice {technique} there by {fighter}',
      'That {technique} definitely got their attention',
      '{fighter} lands a solid {technique}',
      'Good {technique} connects for {fighter}'
    ])

    // Expert phrases
    this.phraseDatabase.set('expert_strike', [
      'Notice the subtle hip rotation generating power for that {technique}',
      'The timing on that {technique} exploited a defensive lapse',
      'Excellent distance management setting up the {technique}',
      'Strategic use of the {technique} to disrupt rhythm'
    ])

    // Colorful phrases
    this.phraseDatabase.set('colorful_strike', [
      '{fighter} painting a masterpiece with that {technique}!',
      'Like a cobra strike - that {technique} was lightning fast!',
      'Poetry in motion as {fighter} delivers the {technique}!',
      'That {technique} was smoother than silk!'
    ])
  }

  async generateRealTimeCommentary(
    event: FightEvent,
    fighterA: Fighter,
    fighterB: Fighter,
    context?: any
  ): Promise<string> {
    // Update emotional context based on event
    this.updateEmotionalContext(event)

    // Generate base commentary
    let commentary = this.generateBaseCommentary(event, fighterA, fighterB)

    // Add emotional adaptation
    if (this.config.emotionalAdaptation) {
      commentary = this.addEmotionalLayer(commentary, event)
    }

    // Add historical context
    if (this.config.historicalReferences && this.shouldAddHistoricalContext(event)) {
      commentary += this.generateHistoricalReference(event, fighterA, fighterB)
    }

    // Add predictive elements
    if (this.config.predictiveCommentary && this.isPredictiveOpportunity(event)) {
      commentary += this.generatePredictiveCommentary(event, fighterA, fighterB)
    }

    // Add audience engagement
    if (this.config.audienceEngagement) {
      commentary = this.enhanceAudienceEngagement(commentary, event)
    }

    this.commentaryBuffer.push(commentary)
    return commentary
  }

  private updateEmotionalContext(event: FightEvent) {
    // Update crowd energy based on event type
    if (event.type === 'knockdown') {
      this.emotionalContext.crowdEnergy = Math.min(100, this.emotionalContext.crowdEnergy + 20)
      this.emotionalContext.excitement = Math.min(100, this.emotionalContext.excitement + 25)
      this.emotionalContext.drama = Math.min(100, this.emotionalContext.drama + 30)
      this.emotionalContext.significantMoments++
    } else if (event.type === 'significant_strike') {
      this.emotionalContext.crowdEnergy = Math.min(100, this.emotionalContext.crowdEnergy + 10)
      this.emotionalContext.excitement = Math.min(100, this.emotionalContext.excitement + 15)
    }

    // Update momentum
    if (event.type === 'knockdown' || event.type === 'significant_strike') {
      const currentMomentum = this.emotionalContext.momentum
      if (currentMomentum === 'even' || currentMomentum === 'shifting') {
        this.emotionalContext.momentum = event.fighter as 'fighter_a' | 'fighter_b'
      } else if (currentMomentum !== event.fighter) {
        this.emotionalContext.momentum = 'shifting'
      }
    }

    // Natural decay
    this.emotionalContext.crowdEnergy = Math.max(30, this.emotionalContext.crowdEnergy - 1)
    this.emotionalContext.excitement = Math.max(20, this.emotionalContext.excitement - 2)
  }

  private generateBaseCommentary(
    event: FightEvent,
    fighterA: Fighter,
    fighterB: Fighter
  ): string {
    const fighter = event.fighter === 'fighter_a' ? fighterA : fighterB
    const opponent = event.fighter === 'fighter_a' ? fighterB : fighterA
    const styleKey = `${this.config.style.tone}_${event.type}`
    
    let phrases = this.phraseDatabase.get(styleKey) || this.phraseDatabase.get(`${this.config.style.tone}_strike`) || []
    let template = phrases[Math.floor(Math.random() * phrases.length)] || '{fighter} lands a {technique}'

    // Replace placeholders
    template = template.replace('{fighter}', fighter.name)
    template = template.replace('{opponent}', opponent.name)
    template = template.replace('{target}', opponent.name)
    template = template.replace('{technique}', event.details?.technique || event.type)

    return template
  }

  private addEmotionalLayer(commentary: string, event: FightEvent): string {
    const intensity = this.emotionalContext.excitement / 100
    
    if (intensity > 0.8) {
      commentary = commentary.toUpperCase() + '!!!'
    } else if (intensity > 0.6) {
      commentary = commentary + '!!'
    } else if (intensity > 0.4) {
      commentary = commentary + '!'
    }

    // Add crowd reaction based on energy
    if (this.emotionalContext.crowdEnergy > 80) {
      commentary += ' The crowd is on their feet!'
    } else if (this.emotionalContext.crowdEnergy > 60) {
      commentary += ' The crowd roars its approval!'
    }

    return commentary
  }

  private shouldAddHistoricalContext(event: FightEvent): boolean {
    return event.type === 'knockdown' || 
           event.type === 'finish' || 
           this.emotionalContext.significantMoments % 3 === 0
  }

  private generateHistoricalReference(
    event: FightEvent,
    fighterA: Fighter,
    fighterB: Fighter
  ): string {
    const references = [
      '\n\nThis reminds me of Ali vs Frazier in 1971!',
      '\n\nShades of Hagler vs Hearns with this intensity!',
      '\n\nWe haven\'t seen action like this since Gatti vs Ward!',
      '\n\nThis is giving me flashbacks to Corrales vs Castillo!',
      '\n\nThe ghost of Rocky Marciano would be proud of this warrior spirit!'
    ]

    if (this.historicalContext.previousMeetings.length > 0) {
      const lastMeeting = this.historicalContext.previousMeetings[0]
      return `\n\nTheir last meeting ended with ${lastMeeting.winner} winning by ${lastMeeting.method} in round ${lastMeeting.round}.`
    }

    return references[Math.floor(Math.random() * references.length)]
  }

  private isPredictiveOpportunity(event: FightEvent): boolean {
    return this.emotionalContext.momentum !== 'even' && 
           (event.type === 'significant_strike' || event.type === 'knockdown')
  }

  private generatePredictiveCommentary(
    event: FightEvent,
    fighterA: Fighter,
    fighterB: Fighter
  ): string {
    const momentum = this.emotionalContext.momentum
    const fighter = momentum === 'fighter_a' ? fighterA : fighterB
    
    const predictions = [
      `\n\nIf ${fighter.name} keeps this pressure up, we could see a stoppage soon!`,
      `\n\nThe momentum is clearly with ${fighter.name} now - their opponent needs to weather this storm!`,
      `\n\nThis could be the beginning of the end if ${fighter.name} can capitalize!`,
      `\n\nWe might be witnessing a turning point in this fight!`
    ]

    return predictions[Math.floor(Math.random() * predictions.length)]
  }

  private enhanceAudienceEngagement(commentary: string, event: FightEvent): string {
    const engagementPhrases = [
      '\nWhat do you think at home?',
      '\nTweet us your scorecards!',
      '\nThis is why we love boxing!',
      '\nAre you not entertained?!',
      '\nInstant classic in the making!'
    ]

    if (this.emotionalContext.excitement > 70) {
      commentary += engagementPhrases[Math.floor(Math.random() * engagementPhrases.length)]
    }

    return commentary
  }

  async generateMultiStyleCommentary(
    event: FightEvent,
    fighterA: Fighter,
    fighterB: Fighter,
    styles: CommentaryStyle[]
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>()

    for (const style of styles) {
      // Temporarily switch style
      const originalStyle = this.config.style
      this.config.style = style

      const commentary = await this.generateRealTimeCommentary(event, fighterA, fighterB)
      results.set(style.id, commentary)

      // Restore original style
      this.config.style = originalStyle
    }

    return results
  }

  async generateSummaryCommentary(
    round: number,
    events: FightEvent[],
    fighterA: Fighter,
    fighterB: Fighter
  ): Promise<string> {
    let summary = `\n\nRound ${round} Summary:\n`

    // Calculate round statistics
    const fighterAStrikes = events.filter(e => e.fighter === 'fighter_a' && e.type.includes('strike')).length
    const fighterBStrikes = events.filter(e => e.fighter === 'fighter_b' && e.type.includes('strike')).length
    const knockdowns = events.filter(e => e.type === 'knockdown')

    // Style-appropriate summary
    switch (this.config.style.tone) {
      case 'technical':
        summary += `Strike statistics: ${fighterA.name} ${fighterAStrikes}, ${fighterB.name} ${fighterBStrikes}. `
        summary += `Effective aggression and ring control will be key scoring factors.`
        break
      case 'dramatic':
        summary += `An EXPLOSIVE round with ${events.length} significant moments! `
        if (knockdowns.length > 0) {
          summary += `${knockdowns.length} knockdown${knockdowns.length > 1 ? 's' : ''} had the crowd on their feet!`
        }
        break
      case 'casual':
        summary += `Good action in that round! ${fighterAStrikes > fighterBStrikes ? fighterA.name : fighterB.name} seemed to land more shots.`
        break
      case 'expert':
        summary += `Tactical adjustments evident. ${fighterA.name} utilizing ${this.identifyStrategy(events, 'fighter_a')}, `
        summary += `while ${fighterB.name} counters with ${this.identifyStrategy(events, 'fighter_b')}.`
        break
      case 'colorful':
        summary += `Like a symphony of violence! Both warriors painting their masterpiece on the canvas of combat!`
        break
    }

    return summary
  }

  private identifyStrategy(events: FightEvent[], fighter: string): string {
    const fighterEvents = events.filter(e => e.fighter === fighter)
    const jabs = fighterEvents.filter(e => e.details?.technique?.includes('jab')).length
    const power = fighterEvents.filter(e => e.details?.power && e.details.power > 70).length

    if (jabs > power) return 'measured boxing'
    if (power > jabs) return 'power punching'
    return 'balanced attack'
  }

  getEmotionalContext(): EmotionalContext {
    return { ...this.emotionalContext }
  }

  setHistoricalContext(context: HistoricalContext) {
    this.historicalContext = context
  }

  getCommentaryHistory(): string[] {
    return [...this.commentaryBuffer]
  }
}