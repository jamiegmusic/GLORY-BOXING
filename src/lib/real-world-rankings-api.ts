import { Fighter, Ranking, InternationalRanking, OfficialRecord } from './unified-types'

export interface RankingsAPIConfig {
  enabled: boolean
  updateFrequency: 'hourly' | 'daily' | 'weekly'
  sources: string[]
  autoSync: boolean
  cacheEnabled: boolean
}

export interface RealWorldRanking {
  fighter_name: string
  weight_class: string
  organization: string
  rank: number
  record: string
  last_fight: string
  next_fight?: string
  points: number
  movement: 'up' | 'down' | 'unchanged'
  country: string
  age: number
  height?: string
  reach?: string
  ko_percentage: number
}

export interface RankingsAPIResponse {
  success: boolean
  data: RealWorldRanking[]
  last_updated: string
  source: string
  total_fighters: number
}

export class RealWorldRankingsAPI {
  private config: RankingsAPIConfig
  private cache: Map<string, any> = new Map()
  private lastUpdate: Date | null = null

  constructor(config: RankingsAPIConfig) {
    this.config = config
    this.initializeCache()
  }

  private initializeCache() {
    if (this.config.cacheEnabled) {
      // Initialize cache with empty data
      this.cache.set('rankings', [])
      this.cache.set('lastUpdate', null)
    }
  }

  public async fetchRealWorldRankings(weightClass?: string, organization?: string): Promise<RealWorldRanking[]> {
    try {
      // Check cache first
      if (this.config.cacheEnabled && this.isCacheValid()) {
        const cachedData = this.cache.get('rankings') as RealWorldRanking[]
        return this.filterRankings(cachedData, weightClass, organization)
      }

      // Fetch from multiple sources
      const rankings = await this.fetchFromMultipleSources()
      
      // Update cache
      if (this.config.cacheEnabled) {
        this.cache.set('rankings', rankings)
        this.cache.set('lastUpdate', new Date())
      }

      return this.filterRankings(rankings, weightClass, organization)
    } catch (error) {
      console.error('Failed to fetch real-world rankings:', error)
      return []
    }
  }

  private async fetchFromMultipleSources(): Promise<RealWorldRanking[]> {
    const allRankings: RealWorldRanking[] = []

    for (const source of this.config.sources) {
      try {
        const sourceRankings = await this.fetchFromSource(source)
        allRankings.push(...sourceRankings)
      } catch (error) {
        console.error(`Failed to fetch from ${source}:`, error)
      }
    }

    return this.mergeRankings(allRankings)
  }

  private async fetchFromSource(source: string): Promise<RealWorldRanking[]> {
    // Simulate API calls to different ranking organizations
    switch (source) {
      case 'wbc':
        return this.simulateWBCRankings()
      case 'wba':
        return this.simulateWBARankings()
      case 'ibf':
        return this.simulateIBFRankings()
      case 'wbo':
        return this.simulateWBORankings()
      case 'ring':
        return this.simulateRingRankings()
      default:
        return []
    }
  }

  private simulateWBCRankings(): RealWorldRanking[] {
    return [
      {
        fighter_name: 'Tyson Fury',
        weight_class: 'Heavyweight',
        organization: 'WBC',
        rank: 1,
        record: '34-0-1',
        last_fight: '2024-02-17',
        points: 950,
        movement: 'unchanged',
        country: 'UK',
        age: 35,
        height: '6\'9"',
        reach: '85"',
        ko_percentage: 73.5
      },
      {
        fighter_name: 'Anthony Joshua',
        weight_class: 'Heavyweight',
        organization: 'WBC',
        rank: 2,
        record: '26-3-0',
        last_fight: '2024-03-09',
        points: 890,
        movement: 'up',
        country: 'UK',
        age: 34,
        height: '6\'6"',
        reach: '82"',
        ko_percentage: 88.5
      },
      {
        fighter_name: 'Deontay Wilder',
        weight_class: 'Heavyweight',
        organization: 'WBC',
        rank: 3,
        record: '43-3-1',
        last_fight: '2023-12-23',
        points: 820,
        movement: 'down',
        country: 'USA',
        age: 38,
        height: '6\'7"',
        reach: '83"',
        ko_percentage: 95.3
      }
    ]
  }

  private simulateWBARankings(): RealWorldRanking[] {
    return [
      {
        fighter_name: 'Oleksandr Usyk',
        weight_class: 'Heavyweight',
        organization: 'WBA',
        rank: 1,
        record: '21-0-0',
        last_fight: '2024-05-18',
        points: 980,
        movement: 'unchanged',
        country: 'Ukraine',
        age: 37,
        height: '6\'3"',
        reach: '78"',
        ko_percentage: 71.4
      },
      {
        fighter_name: 'Daniel Dubois',
        weight_class: 'Heavyweight',
        organization: 'WBA',
        rank: 2,
        record: '19-2-0',
        last_fight: '2024-08-26',
        points: 850,
        movement: 'up',
        country: 'UK',
        age: 26,
        height: '6\'5"',
        reach: '78"',
        ko_percentage: 89.5
      }
    ]
  }

  private simulateIBFRankings(): RealWorldRanking[] {
    return [
      {
        fighter_name: 'Filip Hrgovic',
        weight_class: 'Heavyweight',
        organization: 'IBF',
        rank: 1,
        record: '16-0-0',
        last_fight: '2024-06-01',
        points: 920,
        movement: 'unchanged',
        country: 'Croatia',
        age: 32,
        height: '6\'6"',
        reach: '81"',
        ko_percentage: 81.3
      }
    ]
  }

  private simulateWBORankings(): RealWorldRanking[] {
    return [
      {
        fighter_name: 'Zhilei Zhang',
        weight_class: 'Heavyweight',
        organization: 'WBO',
        rank: 1,
        record: '26-1-1',
        last_fight: '2024-09-23',
        points: 880,
        movement: 'up',
        country: 'China',
        age: 41,
        height: '6\'6"',
        reach: '80"',
        ko_percentage: 76.9
      }
    ]
  }

  private simulateRingRankings(): RealWorldRanking[] {
    return [
      {
        fighter_name: 'Tyson Fury',
        weight_class: 'Heavyweight',
        organization: 'The Ring',
        rank: 1,
        record: '34-0-1',
        last_fight: '2024-02-17',
        points: 1000,
        movement: 'unchanged',
        country: 'UK',
        age: 35,
        height: '6\'9"',
        reach: '85"',
        ko_percentage: 73.5
      }
    ]
  }

  private mergeRankings(rankings: RealWorldRanking[]): RealWorldRanking[] {
    // Merge rankings from different sources and remove duplicates
    const merged = new Map<string, RealWorldRanking>()

    rankings.forEach(ranking => {
      const key = `${ranking.fighter_name}-${ranking.weight_class}`
      if (!merged.has(key) || merged.get(key)!.rank > ranking.rank) {
        merged.set(key, ranking)
      }
    })

    return Array.from(merged.values()).sort((a, b) => a.rank - b.rank)
  }

  private filterRankings(rankings: RealWorldRanking[], weightClass?: string, organization?: string): RealWorldRanking[] {
    let filtered = rankings

    if (weightClass) {
      filtered = filtered.filter(r => r.weight_class.toLowerCase() === weightClass.toLowerCase())
    }

    if (organization) {
      filtered = filtered.filter(r => r.organization.toLowerCase() === organization.toLowerCase())
    }

    return filtered
  }

  private isCacheValid(): boolean {
    if (!this.config.cacheEnabled) return false

    const lastUpdate = this.cache.get('lastUpdate') as Date
    if (!lastUpdate) return false

    const now = new Date()
    const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)

    switch (this.config.updateFrequency) {
      case 'hourly':
        return hoursSinceUpdate < 1
      case 'daily':
        return hoursSinceUpdate < 24
      case 'weekly':
        return hoursSinceUpdate < 168
      default:
        return false
    }
  }

  public async syncWithGameRankings(gameFighters: Fighter[]): Promise<{
    updated: Fighter[]
    newFighters: Fighter[]
    removedFighters: Fighter[]
  }> {
    const realWorldRankings = await this.fetchRealWorldRankings()
    const result = {
      updated: [] as Fighter[],
      newFighters: [] as Fighter[],
      removedFighters: [] as Fighter[]
    }

    // Update existing fighters with real-world data
    for (const fighter of gameFighters) {
      const realWorldData = realWorldRankings.find(r => 
        r.fighter_name.toLowerCase() === fighter.name.toLowerCase() &&
        r.weight_class.toLowerCase() === fighter.weight_class.toLowerCase()
      )

      if (realWorldData) {
        const updatedFighter = this.mergeFighterData(fighter, realWorldData)
        result.updated.push(updatedFighter)
      }
    }

    // Identify new fighters from real-world rankings
    for (const ranking of realWorldRankings) {
      const existsInGame = gameFighters.some(f => 
        f.name.toLowerCase() === ranking.fighter_name.toLowerCase()
      )

      if (!existsInGame) {
        const newFighter = this.createFighterFromRanking(ranking)
        result.newFighters.push(newFighter)
      }
    }

    return result
  }

  private mergeFighterData(gameFighter: Fighter, realWorldData: RealWorldRanking): Fighter {
    return {
      ...gameFighter,
      real_world_ranking: realWorldData.rank,
      real_world_record: realWorldData.record,
      ranking: realWorldData.rank,
      record_wins: parseInt(realWorldData.record.split('-')[0]),
      record_losses: parseInt(realWorldData.record.split('-')[1]),
      record_draws: parseInt(realWorldData.record.split('-')[2]) || 0,
      age: realWorldData.age,
      height: realWorldData.height,
      reach: realWorldData.reach,
      ko_percentage: realWorldData.ko_percentage,
      last_updated: new Date().toISOString()
    }
  }

  private createFighterFromRanking(ranking: RealWorldRanking): Fighter {
    const [wins, losses, draws] = ranking.record.split('-').map(n => parseInt(n))
    
    return {
      id: `real-world-${ranking.fighter_name.toLowerCase().replace(/\s+/g, '-')}`,
      name: ranking.fighter_name,
      weight_class: ranking.weight_class,
      ranking: ranking.rank,
      record_wins: wins,
      record_losses: losses,
      record_draws: draws || 0,
      age: ranking.age,
      height: ranking.height,
      reach: ranking.reach,
      ko_percentage: ranking.ko_percentage,
      country: ranking.country,
      real_world_ranking: ranking.rank,
      real_world_record: ranking.record,
      organization: ranking.organization,
      points: ranking.points,
      movement: ranking.movement,
      last_fight: ranking.last_fight,
      next_fight: ranking.next_fight,
      power: 70 + Math.random() * 20,
      speed: 70 + Math.random() * 20,
      stamina: 70 + Math.random() * 20,
      defense: 70 + Math.random() * 20,
      accuracy: 70 + Math.random() * 20,
      experience: Math.max(1, ranking.age - 18),
      popularity: 50 + Math.random() * 30,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  public async getFighterOfficialRecord(fighterName: string): Promise<OfficialRecord | null> {
    try {
      const rankings = await this.fetchRealWorldRankings()
      const fighter = rankings.find(r => 
        r.fighter_name.toLowerCase() === fighterName.toLowerCase()
      )

      if (!fighter) return null

      return {
        fighter_name: fighter.fighter_name,
        weight_class: fighter.weight_class,
        organization: fighter.organization,
        record: fighter.record,
        wins: parseInt(fighter.record.split('-')[0]),
        losses: parseInt(fighter.record.split('-')[1]),
        draws: parseInt(fighter.record.split('-')[2]) || 0,
        ko_wins: Math.round(parseInt(fighter.record.split('-')[0]) * (fighter.ko_percentage / 100)),
        last_fight: fighter.last_fight,
        next_fight: fighter.next_fight,
        verified: true,
        source: fighter.organization,
        last_verified: new Date().toISOString()
      }
    } catch (error) {
      console.error('Failed to get official record:', error)
      return null
    }
  }

  public async getInternationalRankings(weightClass: string): Promise<InternationalRanking[]> {
    const rankings = await this.fetchRealWorldRankings(weightClass)
    
    return rankings.map(ranking => ({
      fighter_name: ranking.fighter_name,
      weight_class: ranking.weight_class,
      organization: ranking.organization,
      rank: ranking.rank,
      record: ranking.record,
      country: ranking.country,
      points: ranking.points,
      movement: ranking.movement,
      last_fight: ranking.last_fight,
      next_fight: ranking.next_fight,
      verified: true,
      source: ranking.organization,
      last_updated: new Date().toISOString()
    }))
  }

  public updateConfig(newConfig: Partial<RankingsAPIConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  public getConfig(): RankingsAPIConfig {
    return { ...this.config }
  }

  public clearCache() {
    this.cache.clear()
    this.initializeCache()
  }

  public getCacheStats() {
    return {
      enabled: this.config.cacheEnabled,
      lastUpdate: this.cache.get('lastUpdate'),
      cacheSize: this.cache.size,
      rankingsCount: (this.cache.get('rankings') as RealWorldRanking[])?.length || 0
    }
  }
}

// Export singleton instance
export const realWorldRankingsAPI = new RealWorldRankingsAPI({
  enabled: true,
  updateFrequency: 'daily',
  sources: ['wbc', 'wba', 'ibf', 'wbo', 'ring'],
  autoSync: true,
  cacheEnabled: true
}) 