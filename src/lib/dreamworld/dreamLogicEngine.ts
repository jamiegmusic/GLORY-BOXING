import { 
  DreamEvent, 
  DreamChoice, 
  DreamworldTalent, 
  DreamworldPlayerState,
  LegacyUnlock,
  DreamType,
  CareerPath,
  DreamEra
} from '../../types/dreamworld'

export class DreamLogicEngine {
  private eventTemplates: Map<DreamType, string[]> = new Map()
  private choiceTemplates: Map<string, DreamChoice[]> = new Map()

  constructor() {
    this.initializeEventTemplates()
    this.initializeChoiceTemplates()
  }

  private initializeEventTemplates() {
    // Prophecy events
    this.eventTemplates.set('prophecy', [
      "You see yourself performing at {venue} as a mysterious benefactor offers a golden contract. The vision shows two paths diverging...",
      "In the haze of dream, you witness {talent} achieving unprecedented success. Their secret whispers through time...",
      "A newspaper from the future flutters past, revealing tomorrow's headline about your {career} breakthrough...",
    ])

    // Warning events
    this.eventTemplates.set('warning', [
      "Dark clouds gather over {venue}. A rival manager schemes to poach your best talent...",
      "You overhear whispers in the shadows - someone plans to sabotage tonight's performance...",
      "A cracked mirror shows {talent} walking away from your management. The reflection fractures with each step...",
    ])

    // Inspiration events
    this.eventTemplates.set('inspiration', [
      "The ghost of {historical_figure} appears, sharing wisdom about the entertainment business...",
      "You discover a hidden sheet of music that could revolutionize {era} jazz...",
      "A moment of clarity strikes - you see the perfect promotional strategy for {talent}...",
    ])

    // Nightmare events
    this.eventTemplates.set('nightmare', [
      "The stage collapses during {talent}'s biggest performance. The audience turns to shadows...",
      "You're trapped in an endless contract negotiation where the terms keep changing...",
      "All your talents vanish into smoke, leaving only empty contracts behind...",
    ])

    // Vision events
    this.eventTemplates.set('vision', [
      "Time fractures, showing you glimpses of {venue} across multiple decades simultaneously...",
      "You witness the birth of a new music genre that won't exist for another {years} years...",
      "Reality glitches, revealing modern technology in the {era} setting. You could use this knowledge...",
    ])

    // Memory events
    this.eventTemplates.set('memory', [
      "You recall a forgotten conversation with {talent} that holds the key to their loyalty...",
      "An old photograph surfaces in your mind, showing the location of a hidden speakeasy...",
      "Memories of the real world seep through - you remember management techniques from 2024...",
    ])
  }

  private initializeChoiceTemplates() {
    // Standard choices for different scenarios
    this.choiceTemplates.set('prophecy_standard', [
      {
        label: "Follow the vision's guidance",
        effect: "Gain insight into future opportunities",
        lucidCost: 10
      },
      {
        label: "Question the prophecy",
        effect: "Maintain skepticism but gain wisdom",
        lucidCost: 5
      },
      {
        label: "Use lucid power to alter the vision",
        effect: "Change the predicted outcome",
        lucidCost: 25,
        requirements: { lucidMeter: 40 }
      }
    ])

    this.choiceTemplates.set('warning_standard', [
      {
        label: "Take immediate action",
        effect: "Prevent the threatened disaster",
        lucidCost: 15
      },
      {
        label: "Investigate further",
        effect: "Gather more information before acting",
        lucidCost: 8
      },
      {
        label: "Set a trap for the schemer",
        effect: "Turn the situation to your advantage",
        lucidCost: 20,
        requirements: { dreamLevel: 3 }
      }
    ])

    this.choiceTemplates.set('inspiration_standard', [
      {
        label: "Embrace the creative spark",
        effect: "Gain a temporary skill boost",
        lucidCost: 12
      },
      {
        label: "Share the inspiration with your talent",
        effect: "Improve talent loyalty and performance",
        lucidCost: 15
      },
      {
        label: "Document the idea for the waking world",
        effect: "Create a legacy unlock",
        lucidCost: 30,
        requirements: { lucidMeter: 50, dreamLevel: 5 }
      }
    ])
  }

  generateDreamEvent(
    playerState: DreamworldPlayerState, 
    context: {
      talents?: DreamworldTalent[],
      currentVenue?: string,
      recentActions?: string[]
    }
  ): DreamEvent {
    // Determine event type based on player state and context
    const dreamType = this.selectDreamType(playerState)
    const templates = this.eventTemplates.get(dreamType) || []
    const template = templates[Math.floor(Math.random() * templates.length)]

    // Fill in template variables
    const content = this.fillTemplate(template, {
      venue: context.currentVenue || 'The Cotton Club',
      talent: context.talents?.[0]?.name || 'your star performer',
      era: playerState.current_era,
      career: this.getRandomCareerPath(),
      historical_figure: this.getHistoricalFigure(playerState.current_era),
      years: Math.floor(Math.random() * 30) + 10
    })

    // Generate appropriate choices
    const choices = this.generateChoices(dreamType, playerState)

    // Calculate impact score
    const impactScore = this.calculateImpactScore(dreamType, playerState)

    return {
      id: this.generateId(),
      player_id: playerState.player_id,
      dream_type: dreamType,
      content,
      impact_score: impactScore,
      actionable_insight: this.generateActionableInsight(dreamType, context),
      career_path: this.getRandomCareerPath(),
      era: playerState.current_era,
      choices,
      triggered_at: new Date().toISOString()
    }
  }

  private selectDreamType(playerState: DreamworldPlayerState): DreamType {
    // Weight dream types based on player state
    const weights = {
      prophecy: playerState.lucid_meter > 70 ? 30 : 15,
      warning: playerState.wellness_meter < 30 ? 25 : 10,
      inspiration: playerState.dream_level > 3 ? 25 : 15,
      nightmare: playerState.wellness_meter < 20 ? 20 : 5,
      vision: playerState.lucid_meter > 50 && playerState.dream_level > 5 ? 20 : 10,
      memory: playerState.reality_glitches.length > 3 ? 15 : 10
    }

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
    let random = Math.random() * totalWeight
    
    for (const [type, weight] of Object.entries(weights)) {
      random -= weight
      if (random <= 0) return type as DreamType
    }

    return 'vision' // fallback
  }

  private generateChoices(dreamType: DreamType, playerState: DreamworldPlayerState): DreamChoice[] {
    const baseChoices = this.choiceTemplates.get(`${dreamType}_standard`) || []
    const choices = [...baseChoices]

    // Add special lucid choice if player has high lucid meter
    if (playerState.lucid_meter > 80) {
      choices.push({
        label: "Bend reality to your will",
        effect: "Dramatically alter the dream's outcome",
        lucidCost: 40,
        requirements: { lucidMeter: 80 }
      })
    }

    // Add wake up option if wellness is low
    if (playerState.wellness_meter < 30) {
      choices.push({
        label: "Force yourself to wake up",
        effect: "Return to reality immediately",
        lucidCost: 0
      })
    }

    return choices
  }

  private calculateImpactScore(dreamType: DreamType, playerState: DreamworldPlayerState): number {
    const baseScores = {
      prophecy: 60,
      warning: 70,
      inspiration: 50,
      nightmare: 40,
      vision: 80,
      memory: 30
    }

    let score = baseScores[dreamType] || 50
    
    // Modify based on player state
    score += (playerState.dream_level - 1) * 5
    score += playerState.reality_glitches.length * 3
    
    // Add randomness
    score += Math.floor(Math.random() * 20) - 10

    return Math.max(0, Math.min(100, score))
  }

  generateLegacyUnlock(
    playerState: DreamworldPlayerState,
    achievement: string
  ): LegacyUnlock {
    const unlockTypes = ['skill', 'item', 'connection', 'knowledge', 'bonus']
    const rarities = this.determineRarity(playerState, achievement)
    
    const unlockTemplates = {
      skill: [
        { name: "Jazz Improvisation Mastery", effect: { charisma: 10, negotiation: 5 } },
        { name: "Golden Age Charm", effect: { publicity: 15, fanBase: 10 } },
        { name: "Prohibition Era Connections", effect: { venueAccess: 20, protection: 10 } }
      ],
      item: [
        { name: "1920s Jazz Sheet Music", effect: { talentHappiness: 10, creativity: 15 } },
        { name: "Vintage Microphone", effect: { performanceQuality: 20 } },
        { name: "Art Deco Contract Template", effect: { negotiationPower: 15 } }
      ],
      connection: [
        { name: "Ghost of Louis Armstrong", effect: { jazzTalentBonus: 25 } },
        { name: "Speakeasy Network Access", effect: { hiddenVenues: 3, revenue: 10 } },
        { name: "Time-Lost Promoter", effect: { crossEraBookings: true } }
      ],
      knowledge: [
        { name: "Future Music Trends", effect: { trendPrediction: 30 } },
        { name: "Lost Entertainment Secrets", effect: { talentDevelopment: 20 } },
        { name: "Temporal Business Wisdom", effect: { allSkills: 5 } }
      ],
      bonus: [
        { name: "Dreamworld Residual Income", effect: { passiveIncome: 1000 } },
        { name: "Reality Glitch Exploiter", effect: { lucidDreamBonus: 20 } },
        { name: "Era-Hopping License", effect: { timeTravel: true } }
      ]
    }

    const type = unlockTypes[Math.floor(Math.random() * unlockTypes.length)] as keyof typeof unlockTemplates
    const template = unlockTemplates[type][Math.floor(Math.random() * unlockTemplates[type].length)]

    return {
      id: this.generateId(),
      player_id: playerState.player_id,
      dream_item: template.name,
      unlock_type: type as any,
      description: `Earned by ${achievement} in the ${playerState.current_era} dreamworld`,
      effect_data: template.effect,
      rarity: rarities,
      unlock_date: new Date().toISOString(),
      claimed: false
    }
  }

  private determineRarity(playerState: DreamworldPlayerState, achievement: string): 'common' | 'rare' | 'epic' | 'legendary' {
    const score = playerState.dream_level * 10 + 
                  playerState.reputation_points / 10 +
                  (achievement.includes('perfect') ? 30 : 0) +
                  (achievement.includes('flawless') ? 20 : 0) +
                  Math.random() * 20

    if (score > 90) return 'legendary'
    if (score > 70) return 'epic'
    if (score > 40) return 'rare'
    return 'common'
  }

  private fillTemplate(template: string, variables: Record<string, string | number>): string {
    let filled = template
    for (const [key, value] of Object.entries(variables)) {
      filled = filled.replace(new RegExp(`{${key}}`, 'g'), String(value))
    }
    return filled
  }

  private generateActionableInsight(dreamType: DreamType, context: any): string {
    const insights = {
      prophecy: "Seek out the mentioned opportunity within the next dream cycle",
      warning: "Take preventive action before the next performance",
      inspiration: "Apply this creative insight to your current talents",
      nightmare: "Address the underlying fear to prevent its manifestation",
      vision: "Use this glimpse of the future to your advantage",
      memory: "This recollection holds the key to a current challenge"
    }
    return insights[dreamType] || "Pay attention to the dream's message"
  }

  private getRandomCareerPath(): CareerPath {
    const paths: CareerPath[] = ['actor', 'singer', 'boxer', 'sports', 'management', 'mogul']
    return paths[Math.floor(Math.random() * paths.length)]
  }

  private getHistoricalFigure(era: DreamEra): string {
    const figures = {
      '1920s': ['Charlie Chaplin', 'Josephine Baker', 'Duke Ellington', 'Babe Ruth'],
      '1930s': ['Clark Gable', 'Greta Garbo', 'Fred Astaire', 'Joe Louis'],
      '1940s': ['Humphrey Bogart', 'Rita Hayworth', 'Frank Sinatra', 'Joe DiMaggio'],
      '1950s': ['Marilyn Monroe', 'Elvis Presley', 'James Dean', 'Rocky Marciano']
    }
    const eraFigures = figures[era] || figures['1920s']
    return eraFigures[Math.floor(Math.random() * eraFigures.length)]
  }

  private generateId(): string {
    return `dream-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Method to check if player should wake up
  checkWakeUpConditions(playerState: DreamworldPlayerState): boolean {
    if (playerState.lucid_meter <= 0) return true
    if (playerState.wellness_meter <= 0) return true
    if (playerState.dream_level >= 10) return true
    
    // Check custom return conditions
    for (const condition of playerState.return_conditions) {
      if (condition.type === 'lucidMeter' && playerState.lucid_meter <= condition.threshold) return true
      if (condition.type === 'dreamLevel' && playerState.dream_level >= condition.threshold) return true
    }
    
    return false
  }

  // Apply reality glitch effects
  applyGlitchEffects(playerState: DreamworldPlayerState): DreamworldPlayerState {
    const recentGlitches = playerState.reality_glitches.filter(g => {
      const glitchTime = new Date(g.timestamp).getTime()
      return Date.now() - glitchTime < 30000 // Last 30 seconds
    })

    let updatedState = { ...playerState }

    for (const glitch of recentGlitches) {
      if (glitch.type === 'temporal' && glitch.severity > 50) {
        // Random era shift chance
        if (Math.random() < 0.1) {
          const eras: DreamEra[] = ['1920s', '1930s', '1940s', '1950s']
          const newEra = eras[Math.floor(Math.random() * eras.length)]
          updatedState.current_era = newEra
        }
      }
      
      if (glitch.type === 'cognitive' && glitch.severity > 60) {
        // Lucid meter fluctuation
        updatedState.lucid_meter += Math.floor(Math.random() * 10) - 5
        updatedState.lucid_meter = Math.max(0, Math.min(100, updatedState.lucid_meter))
      }
    }

    return updatedState
  }
}

export const dreamLogicEngine = new DreamLogicEngine()