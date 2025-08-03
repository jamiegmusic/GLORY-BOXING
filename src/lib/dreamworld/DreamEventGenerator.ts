import { DreamEvent, DreamworldTalent, DreamworldPlayerState, DreamChoice } from '@/types/dreamworld'
import { useDreamworldStore } from '@/stores/dreamworldStore'

export interface DreamEventGeneratorOptions {
  dreamType?: 'prophecy' | 'warning' | 'inspiration' | 'nightmare' | 'vision'
  careerPath?: string
  era?: string
  playerState?: DreamworldPlayerState
  talents?: DreamworldTalent[]
  forceHighImpact?: boolean
}

export class DreamEventGenerator {
  private dreamTemplates: Record<string, any[]> = {}
  private careerPathThemes: Record<string, any> = {}
  private eraContexts: Record<string, any> = {}

  constructor() {
    this.initializeTemplates()
    this.initializeCareerThemes()
    this.initializeEraContexts()
  }

  /**
   * Generate a dream event based on provided options
   */
  async generateDreamEvent(options: DreamEventGeneratorOptions): Promise<Omit<DreamEvent, 'id' | 'triggered_at'>> {
    const dreamType = options.dreamType || this.selectDreamType(options.playerState)
    const careerPath = options.careerPath || this.selectCareerPath(options.talents)
    const era = options.era || options.playerState?.current_era || '1920s'
    
    const content = this.generateContent(dreamType, careerPath, era, options.talents)
    const choices = this.generateChoices(dreamType, careerPath, options.playerState)
    const impactScore = this.calculateImpactScore(dreamType, options.playerState, options.forceHighImpact)
    const actionableInsight = this.generateInsight(dreamType, careerPath, impactScore)

    return {
      player_id: options.playerState?.player_id || '',
      dream_type: dreamType,
      content,
      impact_score: impactScore,
      actionable_insight: actionableInsight,
      career_path: careerPath,
      era,
      choices,
      chosen_option: null,
      outcome: null
    }
  }

  /**
   * Generate and immediately add event to store
   */
  async generateAndAddToStore(options: DreamEventGeneratorOptions): Promise<void> {
    const event = await this.generateDreamEvent(options)
    const store = useDreamworldStore.getState()
    await store.addDreamEvent(event)
  }

  /**
   * Generate content based on dream type, career, and era
   */
  private generateContent(
    dreamType: string, 
    careerPath: string, 
    era: string, 
    talents?: DreamworldTalent[]
  ): string {
    const templates = this.dreamTemplates[dreamType] || []
    const careerTheme = this.careerPathThemes[careerPath] || {}
    const eraContext = this.eraContexts[era] || {}
    
    // Select random template
    const template = templates[Math.floor(Math.random() * templates.length)]
    if (!template) return 'A strange dream unfolds...'
    
    // Replace variables in template
    let content = template
    
    // Era-specific replacements
    content = content.replace(/\{location\}/g, eraContext.locations?.[0] || 'unknown place')
    content = content.replace(/\{era_figure\}/g, eraContext.figures?.[0] || 'mysterious figure')
    content = content.replace(/\{era_event\}/g, eraContext.events?.[0] || 'significant moment')
    
    // Career-specific replacements
    content = content.replace(/\{venue\}/g, careerTheme.venues?.[0] || 'venue')
    content = content.replace(/\{skill\}/g, careerTheme.skills?.[0] || 'talent')
    content = content.replace(/\{rival\}/g, careerTheme.rivals?.[0] || 'competitor')
    
    // Talent-specific replacements
    if (talents && talents.length > 0) {
      const randomTalent = talents[Math.floor(Math.random() * talents.length)]
      content = content.replace(/\{talent_name\}/g, randomTalent.name)
      content = content.replace(/\{talent_location\}/g, randomTalent.current_location)
    }
    
    return content
  }

  /**
   * Generate choices based on dream type and player state
   */
  private generateChoices(
    dreamType: string, 
    careerPath: string,
    playerState?: DreamworldPlayerState
  ): DreamChoice[] {
    const baseChoices: DreamChoice[] = []
    
    switch (dreamType) {
      case 'prophecy':
        baseChoices.push(
          {
            label: 'Embrace the vision',
            effect: 'Gain prophetic insight',
            requirements: { lucidMeter: 30 }
          },
          {
            label: 'Question the prophecy',
            effect: 'Seek deeper understanding',
            lucidCost: 10
          },
          {
            label: 'Ignore the signs',
            effect: 'Continue as normal'
          }
        )
        break
        
      case 'warning':
        baseChoices.push(
          {
            label: 'Heed the warning',
            effect: 'Take preventive action',
            requirements: { lucidMeter: 20 }
          },
          {
            label: 'Investigate the threat',
            effect: 'Uncover hidden dangers',
            lucidCost: 15
          },
          {
            label: 'Face it head-on',
            effect: 'Confront the danger directly',
            requirements: { dreamLevel: 3 }
          }
        )
        break
        
      case 'inspiration':
        baseChoices.push(
          {
            label: 'Channel the inspiration',
            effect: 'Create something new',
            lucidCost: 5
          },
          {
            label: 'Share the vision',
            effect: 'Inspire others',
            requirements: { reputation: 30 }
          },
          {
            label: 'Document the idea',
            effect: 'Save for later use'
          }
        )
        break
        
      case 'nightmare':
        baseChoices.push(
          {
            label: 'Face your fears',
            effect: 'Overcome the nightmare',
            lucidCost: 20,
            requirements: { lucidMeter: 40 }
          },
          {
            label: 'Escape the dream',
            effect: 'Wake up immediately',
            lucidCost: 30
          },
          {
            label: 'Surrender to darkness',
            effect: 'Let the nightmare consume you'
          }
        )
        break
        
      case 'vision':
        baseChoices.push(
          {
            label: 'Focus the vision',
            effect: 'See clearer details',
            lucidCost: 15
          },
          {
            label: 'Alter the timeline',
            effect: 'Change what you see',
            requirements: { lucidMeter: 60, dreamLevel: 5 }
          },
          {
            label: 'Record the vision',
            effect: 'Remember for the future'
          }
        )
        break
    }
    
    // Add career-specific choice
    if (careerPath === 'boxer') {
      baseChoices.push({
        label: 'Train in dream boxing',
        effect: 'Improve fighting skills',
        lucidCost: 10
      })
    } else if (careerPath === 'singer') {
      baseChoices.push({
        label: 'Perform dream concert',
        effect: 'Boost performance ability',
        lucidCost: 10
      })
    }
    
    // Add high-lucidity special choice
    if (playerState && playerState.lucid_meter >= 80) {
      baseChoices.push({
        label: 'Bend reality to your will',
        effect: 'Manipulate the dreamworld',
        lucidCost: 40,
        requirements: { lucidMeter: 80 }
      })
    }
    
    return baseChoices
  }

  /**
   * Calculate impact score based on various factors
   */
  private calculateImpactScore(
    dreamType: string, 
    playerState?: DreamworldPlayerState,
    forceHighImpact?: boolean
  ): number {
    if (forceHighImpact) return Math.floor(Math.random() * 20) + 80
    
    let baseScore = 50
    
    // Dream type modifiers
    const typeModifiers: Record<string, number> = {
      prophecy: 15,
      warning: 10,
      inspiration: 5,
      nightmare: -10,
      vision: 20
    }
    
    baseScore += typeModifiers[dreamType] || 0
    
    // Player state modifiers
    if (playerState) {
      // Higher dream level = higher impact
      baseScore += playerState.dream_level * 3
      
      // Low lucidity = more chaotic/impactful
      if (playerState.lucid_meter < 30) {
        baseScore += 15
      }
      
      // Reality glitches increase impact
      baseScore += (playerState.reality_glitches?.length || 0) * 5
    }
    
    // Add randomness
    baseScore += Math.floor(Math.random() * 20) - 10
    
    // Clamp to valid range
    return Math.max(0, Math.min(100, baseScore))
  }

  /**
   * Generate actionable insight based on dream type and impact
   */
  private generateInsight(dreamType: string, careerPath: string, impactScore: number): string {
    const highImpact = impactScore > 70
    const insights: Record<string, string[]> = {
      prophecy: [
        highImpact ? 
          'CRITICAL: This vision reveals a major turning point ahead' :
          'Pay attention to upcoming opportunities in your career',
        `The ${careerPath} industry holds secrets waiting to be discovered`,
        'Your future success depends on the choices you make now'
      ],
      warning: [
        highImpact ?
          'URGENT: Take immediate action to prevent disaster' :
          'Be cautious in your upcoming decisions',
        `Watch for betrayal in the ${careerPath} world`,
        'Danger lurks where you least expect it'
      ],
      inspiration: [
        'Channel this creative energy into your next project',
        `Revolutionary ideas for the ${careerPath} industry await`,
        'Your unique vision can change everything'
      ],
      nightmare: [
        highImpact ?
          'Face these fears or they will manifest in reality' :
          'Your anxieties are trying to tell you something',
        'Transform this darkness into strength',
        'Sometimes nightmares reveal our greatest potential'
      ],
      vision: [
        highImpact ?
          'This glimpse of the future can alter your destiny' :
          'The timeline is more flexible than you think',
        `The future of ${careerPath} is in your hands`,
        'What you\'ve seen is one possible path among many'
      ]
    }
    
    const typeInsights = insights[dreamType] || ['The meaning remains unclear...']
    return typeInsights[Math.floor(Math.random() * typeInsights.length)]
  }

  /**
   * Select dream type based on player state
   */
  private selectDreamType(playerState?: DreamworldPlayerState): 'prophecy' | 'warning' | 'inspiration' | 'nightmare' | 'vision' {
    if (!playerState) {
      const types: ('prophecy' | 'warning' | 'inspiration' | 'nightmare' | 'vision')[] = 
        ['prophecy', 'warning', 'inspiration', 'nightmare', 'vision']
      return types[Math.floor(Math.random() * types.length)]
    }
    
    // Weight dream types based on player state
    const weights = {
      prophecy: 20,
      warning: 20,
      inspiration: 20,
      nightmare: 20,
      vision: 20
    }
    
    // Low lucidity = more nightmares
    if (playerState.lucid_meter < 30) {
      weights.nightmare += 30
      weights.warning += 10
    }
    
    // High lucidity = more visions and prophecies
    if (playerState.lucid_meter > 70) {
      weights.vision += 20
      weights.prophecy += 15
      weights.nightmare -= 10
    }
    
    // Low wellness = more warnings and nightmares
    if (playerState.wellness_meter < 40) {
      weights.warning += 20
      weights.nightmare += 15
    }
    
    // High dream level = more prophecies and visions
    if (playerState.dream_level > 5) {
      weights.prophecy += 10
      weights.vision += 15
    }
    
    // Reality glitches = more chaotic dreams
    if (playerState.reality_glitches.length > 3) {
      weights.nightmare += 10
      weights.vision += 10
    }
    
    // Convert weights to probability
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
    const random = Math.random() * totalWeight
    
    let cumulative = 0
    for (const [type, weight] of Object.entries(weights)) {
      cumulative += weight
      if (random <= cumulative) {
        return type as any
      }
    }
    
    return 'vision' // fallback
  }

  /**
   * Select career path from available talents
   */
  private selectCareerPath(talents?: DreamworldTalent[]): string {
    if (!talents || talents.length === 0) {
      const paths = ['boxer', 'singer', 'actor', 'mogul']
      return paths[Math.floor(Math.random() * paths.length)]
    }
    
    // Count career paths in current talents
    const pathCounts: Record<string, number> = {}
    talents.forEach(talent => {
      pathCounts[talent.career_path] = (pathCounts[talent.career_path] || 0) + 1
    })
    
    // Weight selection towards most common path
    const paths = Object.entries(pathCounts)
    const totalCount = paths.reduce((sum, [_, count]) => sum + count, 0)
    const random = Math.random() * totalCount
    
    let cumulative = 0
    for (const [path, count] of paths) {
      cumulative += count
      if (random <= cumulative) {
        return path
      }
    }
    
    return 'singer' // fallback
  }

  /**
   * Initialize dream content templates
   */
  private initializeTemplates() {
    this.dreamTemplates = {
      prophecy: [
        'You see a vision of {location} bathed in golden light. A figure resembling {era_figure} whispers of {era_event} that will change everything.',
        'In your dream, {talent_name} appears at {venue}, revealing a future where {skill} becomes the key to unprecedented success.',
        'The dreamworld shows you tomorrow\'s headlines: a {career_path} from {location} will rise to legendary status.',
        'Time fractures, showing glimpses of what\'s to come. You see yourself at {venue}, achieving what was thought impossible.',
        'A prophetic voice echoes: "When the {era_event} arrives, those who master {skill} will shape the future."'
      ],
      warning: [
        'Dark clouds gather over {location}. A shadowy {rival} plots against you in the {venue}.',
        'You dream of {talent_name} in distress, warning you about a betrayal in the {career_path} world.',
        'The dreamworld trembles as {era_figure} appears, cautioning about the dangers of {era_event}.',
        'A nightmare vision: your {skill} fails you at the crucial moment in {venue}.',
        'Warning bells echo through {location} as reality itself seems to crack around you.'
      ],
      inspiration: [
        'In a burst of creative energy, you see {talent_name} performing an impossible feat at {venue}.',
        'The spirit of {era_figure} fills you with inspiration, revealing new ways to use {skill}.',
        'You dream of revolutionizing the {career_path} industry with an idea that transcends {era_event}.',
        'Colors and sounds merge in {location}, showing you a performance that hasn\'t been invented yet.',
        'The dreamworld gifts you a vision: combining {skill} with the essence of {location} creates magic.'
      ],
      nightmare: [
        'You\'re trapped in {venue} as it crumbles around you, your {skill} powerless to help.',
        'The ghost of {era_figure} haunts you, showing a future where {career_path} leads to ruin.',
        '{talent_name} transforms into something monstrous, representing your deepest fears about {era_event}.',
        'You relive your worst failure in {location}, but this time there\'s no escape.',
        'The dreamworld becomes a twisted version of {venue} where every {rival} has surpassed you.'
      ],
      vision: [
        'Time becomes fluid as you witness {location} across multiple eras, seeing how {era_event} echoes through time.',
        'You experience life through {talent_name}\'s eyes, understanding the true nature of {skill}.',
        'The dreamworld reveals the hidden connections between {career_path} and {era_figure}\'s legacy.',
        'You see yourself in {venue}, but it\'s a version from a timeline where you made different choices.',
        'A cosmic vision shows how mastering {skill} in this era will impact future generations.'
      ]
    }
  }

  /**
   * Initialize career path themes
   */
  private initializeCareerThemes() {
    this.careerPathThemes = {
      boxer: {
        venues: ['Madison Square Garden', 'the ring', 'the training gym', 'the championship arena'],
        skills: ['knockout power', 'defensive prowess', 'ring strategy', 'mental toughness'],
        rivals: ['the undefeated champion', 'your former sparring partner', 'the rising contender']
      },
      singer: {
        venues: ['Cotton Club', 'the recording studio', 'the grand stage', 'the jazz lounge'],
        skills: ['vocal range', 'stage presence', 'musical innovation', 'audience connection'],
        rivals: ['the reigning diva', 'the chart-topper', 'the critics\' darling']
      },
      actor: {
        venues: ['the movie set', 'Broadway theater', 'the premiere', 'the audition room'],
        skills: ['method acting', 'emotional range', 'screen presence', 'character transformation'],
        rivals: ['the leading star', 'the director\'s favorite', 'the award winner']
      },
      mogul: {
        venues: ['the boardroom', 'the exclusive club', 'the penthouse office', 'the deal table'],
        skills: ['negotiation mastery', 'business acumen', 'network building', 'market foresight'],
        rivals: ['the industry titan', 'the corporate shark', 'the rival mogul']
      }
    }
  }

  /**
   * Initialize era-specific contexts
   */
  private initializeEraContexts() {
    this.eraContexts = {
      '1920s': {
        locations: ['Harlem', 'speakeasy', 'jazz-filled streets', 'prohibition hideout'],
        figures: ['Louis Armstrong', 'Al Capone', 'Josephine Baker', 'Babe Ruth'],
        events: ['the Jazz Revolution', 'Prohibition\'s end', 'the Harlem Renaissance', 'the Wall Street boom']
      },
      '1930s': {
        locations: ['Hollywood', 'dust bowl farm', 'art deco skyscraper', 'breadline'],
        figures: ['Clark Gable', 'Eleanor Roosevelt', 'Joe Louis', 'Billie Holiday'],
        events: ['the Great Depression', 'the Golden Age of Hollywood', 'the New Deal', 'the rise of swing']
      },
      '1940s': {
        locations: ['USO stage', 'factory floor', 'victory garden', 'noir cityscape'],
        figures: ['Frank Sinatra', 'Rosie the Riveter', 'Humphrey Bogart', 'Duke Ellington'],
        events: ['the war effort', 'the atomic age', 'film noir\'s peak', 'bebop\'s birth']
      },
      '1950s': {
        locations: ['TV studio', 'drive-in theater', 'suburban paradise', 'rock venue'],
        figures: ['Elvis Presley', 'Marilyn Monroe', 'James Dean', 'Rosa Parks'],
        events: ['rock and roll\'s birth', 'the TV revolution', 'the space race', 'civil rights awakening']
      }
    }
  }
}

// Export singleton instance
export const dreamEventGenerator = new DreamEventGenerator()

// Helper function for easy generation
export async function generateDreamEvent(options: DreamEventGeneratorOptions) {
  return dreamEventGenerator.generateDreamEvent(options)
}

// Helper function to generate and add to store
export async function generateAndAddDreamEvent(options: DreamEventGeneratorOptions) {
  return dreamEventGenerator.generateAndAddToStore(options)
}