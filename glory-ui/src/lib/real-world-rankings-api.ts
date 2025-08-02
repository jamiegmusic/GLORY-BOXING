import type { Fighter, InternationalRanking, OfficialRecord } from './unified-types'

export interface RankingsAPIConfig {
  enabled: boolean
  cacheEnabled: boolean
  cacheDuration: number // in minutes
  sources: string[]
  syncEnabled: boolean
  updateInterval: number // in hours
}

export interface RealWorldRanking {
  fighter_name: string
  weight_class: string
  organization: string
  rank: number
  record: string
  country: string
  age?: number
  height?: string
  ko_percentage?: number
  points: number
  movement: 'up' | 'down' | 'unchanged'
  last_fight: string
  next_fight?: string
  verified: boolean
  source: string
  last_updated: string
}

export interface RankingsAPIResponse {
  success: boolean
  data: RealWorldRanking[]
  timestamp: string
  source: string
  error?: string
}

export interface SyncResult {
  updated: Fighter[]
  newFighters: Fighter[]
  conflicts: any[]
  summary: {
    totalProcessed: number
    updated: number
    added: number
    conflicts: number
  }
}

export class RealWorldRankingsAPI {
  private config: RankingsAPIConfig
  private cache: Map<string, { data: RealWorldRanking[]; timestamp: number }> = new Map()
  private lastSync: Date | null = null

  constructor(config: RankingsAPIConfig) {
    this.config = config
  }

  public async fetchRealWorldRankings(): Promise<RealWorldRanking[]> {
    try {
      // Check cache first
      if (this.config.cacheEnabled) {
        const cached = this.getCachedRankings()
        if (cached && this.isCacheValid(cached.timestamp)) {
          return cached.data
        }
      }

      // Fetch from multiple sources
      const allRankings = await this.fetchFromMultipleSources()
      
      // Cache the results
      if (this.config.cacheEnabled) {
        this.cacheRankings(allRankings)
      }

      this.lastSync = new Date()
      return allRankings
    } catch (error) {
      console.error('Failed to fetch real-world rankings:', error)
      throw error
    }
  }

  private async fetchFromMultipleSources(): Promise<RealWorldRanking[]> {
    const allRankings: RealWorldRanking[] = []
    
    for (const source of this.config.sources) {
      try {
        const sourceRankings = await this.fetchFromSource(source)
        allRankings.push(...sourceRankings)
      } catch (error) {
        console.error(`Failed to fetch from source ${source}:`, error)
      }
    }
    
    return this.mergeRankings(allRankings)
  }

  private async fetchFromSource(source: string): Promise<RealWorldRanking[]> {
    // Simulate API calls to different boxing organizations
    const mockData = this.generateMockRankings(source)
    
    // In a real implementation, this would be actual API calls
    // const response = await fetch(`${this.config.baseUrl}/${source}/rankings`)
    // const data = await response.json()
    
    return mockData
  }

  private generateMockRankings(source: string): RealWorldRanking[] {
    const organizations = ['WBC', 'WBA', 'IBF', 'WBO', 'The Ring']
    const weightClasses = ['Heavyweight', 'Light Heavyweight', 'Middleweight', 'Welterweight', 'Lightweight']
    const countries = ['USA', 'UK', 'Mexico', 'Cuba', 'Ukraine', 'Russia', 'Japan', 'Philippines']
    
    const rankings: RealWorldRanking[] = []
    
    for (const weightClass of weightClasses) {
      for (let rank = 1; rank <= 15; rank++) {
        const fighter = {
          fighter_name: `Fighter ${rank} ${weightClass}`,
          weight_class: weightClass,
          organization: source,
          rank: rank,
          record: `${Math.floor(Math.random() * 30) + 10}-${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 2)}`,
          country: countries[Math.floor(Math.random() * countries.length)],
          age: Math.floor(Math.random() * 20) + 20,
          height: `${Math.floor(Math.random() * 6) + 5}'${Math.floor(Math.random() * 12)}"`,
          ko_percentage: Math.floor(Math.random() * 60) + 20,
          points: Math.floor(Math.random() * 1000) + 100,
          movement: ['up', 'down', 'unchanged'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'unchanged',
          last_fight: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          next_fight: Math.random() > 0.7 ? new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          verified: Math.random() > 0.3,
          source: source,
          last_updated: new Date().toISOString()
        }
        
        rankings.push(fighter)
      }
    }
    
    return rankings
  }

  private mergeRankings(rankings: RealWorldRanking[]): RealWorldRanking[] {
    // Remove duplicates and merge rankings from different sources
    const uniqueRankings = new Map<string, RealWorldRanking>()
    
    rankings.forEach(ranking => {
      const key = `${ranking.fighter_name}-${ranking.weight_class}-${ranking.organization}`
      
      if (!uniqueRankings.has(key) || uniqueRankings.get(key)!.last_updated < ranking.last_updated) {
        uniqueRankings.set(key, ranking)
      }
    })
    
    return Array.from(uniqueRankings.values())
  }

  private getCachedRankings(): { data: RealWorldRanking[]; timestamp: number } | null {
    const cached = this.cache.get('rankings')
    return cached || null
  }

  private isCacheValid(timestamp: number): boolean {
    const now = Date.now()
    const cacheAge = now - timestamp
    const maxAge = this.config.cacheDuration * 60 * 1000 // Convert minutes to milliseconds
    return cacheAge < maxAge
  }

  private cacheRankings(rankings: RealWorldRanking[]): void {
    this.cache.set('rankings', {
      data: rankings,
      timestamp: Date.now()
    })
  }

  public async syncWithGameRankings(fighters: Fighter[]): Promise<SyncResult> {
    const result: SyncResult = {
      updated: [],
      newFighters: [],
      conflicts: [],
      summary: {
        totalProcessed: 0,
        updated: 0,
        added: 0,
        conflicts: 0
      }
    }

    try {
      const realWorldRankings = await this.fetchRealWorldRankings()
      
      for (const ranking of realWorldRankings) {
        result.summary.totalProcessed++
        
        // Try to find matching fighter in game
        const matchingFighter = this.findMatchingFighter(fighters, ranking)
        
        if (matchingFighter) {
          // Update existing fighter
          const updatedFighter = this.mergeFighterData(matchingFighter, ranking)
          result.updated.push(updatedFighter)
          result.summary.updated++
        } else {
          // Create new fighter
          const newFighter = this.createFighterFromRanking(ranking)
          result.newFighters.push(newFighter)
          result.summary.added++
        }
      }
      
      this.lastSync = new Date()
      return result
    } catch (error) {
      console.error('Failed to sync rankings:', error)
      throw error
    }
  }

  private findMatchingFighter(fighters: Fighter[], ranking: RealWorldRanking): Fighter | null {
    return fighters.find(fighter => 
      fighter.name.toLowerCase() === ranking.fighter_name.toLowerCase() &&
      fighter.weight_class.toLowerCase() === ranking.weight_class.toLowerCase()
    ) || null
  }

  private mergeFighterData(gameFighter: Fighter, realWorldData: RealWorldRanking): Fighter {
    return {
      ...gameFighter,
      real_world_ranking: realWorldData.rank,
      real_world_record: realWorldData.record,
      ranking: realWorldData.rank,
      // Update other fields as needed
      updated_at: new Date().toISOString()
    }
  }

  private createFighterFromRanking(ranking: RealWorldRanking): Fighter {
    const [wins, losses, draws] = ranking.record.split('-').map(Number)
    
    return {
      id: `fighter-${Date.now()}-${Math.random()}`,
      name: ranking.fighter_name,
      age: ranking.age || 25,
      weight_class: ranking.weight_class,
      country: ranking.country,
      record_wins: wins || 0,
      record_losses: losses || 0,
      record_draws: draws || 0,
      ko_percentage: ranking.ko_percentage || 0,
      ranking: ranking.rank,
      real_world_ranking: ranking.rank,
      real_world_record: ranking.record,
      status: 'active',
      
      // Default stats
      power: Math.floor(Math.random() * 50) + 30,
      speed: Math.floor(Math.random() * 50) + 30,
      stamina: Math.floor(Math.random() * 50) + 30,
      defense: Math.floor(Math.random() * 50) + 30,
      accuracy: Math.floor(Math.random() * 50) + 30,
      experience: Math.floor(Math.random() * 20) + 5,
      popularity: Math.floor(Math.random() * 50) + 20,
      
      // Health monitoring
      health_risk_assessment: Math.floor(Math.random() * 30) + 10,
      concussion_protocol_active: false,
      cumulative_damage: {},
      
      // Timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_fight: ranking.last_fight,
      next_fight: ranking.next_fight
    }
  }

  public async getOfficialRecords(fighterName: string, weightClass: string): Promise<OfficialRecord[]> {
    try {
      // Simulate fetching official records
      const records: OfficialRecord[] = []
      
      for (const org of ['WBC', 'WBA', 'IBF', 'WBO']) {
        const record: OfficialRecord = {
          fighter_name: fighterName,
          weight_class: weightClass,
          organization: org,
          record: `${Math.floor(Math.random() * 30) + 10}-${Math.floor(Math.random() * 5)}-${Math.floor(Math.random() * 2)}`,
          wins: Math.floor(Math.random() * 30) + 10,
          losses: Math.floor(Math.random() * 5),
          draws: Math.floor(Math.random() * 2),
          ko_wins: Math.floor(Math.random() * 15) + 5,
          last_fight: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          next_fight: Math.random() > 0.7 ? new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          verified: Math.random() > 0.3,
          source: org,
          last_verified: new Date().toISOString()
        }
        
        records.push(record)
      }
      
      return records
    } catch (error) {
      console.error('Failed to fetch official records:', error)
      throw error
    }
  }

  public async validateFighterData(fighter: Fighter): Promise<{
    verified: boolean
    discrepancies: string[]
    suggestions: string[]
  }> {
    const result = {
      verified: false,
      discrepancies: [] as string[],
      suggestions: [] as string[]
    }

    try {
      const realWorldRankings = await this.fetchRealWorldRankings()
      const matchingRanking = realWorldRankings.find(r => 
        r.fighter_name.toLowerCase() === fighter.name.toLowerCase() &&
        r.weight_class.toLowerCase() === fighter.weight_class.toLowerCase()
      )

      if (matchingRanking) {
        result.verified = true
        
        // Check for discrepancies
        if (fighter.record_wins !== parseInt(matchingRanking.record.split('-')[0])) {
          result.discrepancies.push(`Record mismatch: Game shows ${fighter.record_wins} wins, real-world shows ${matchingRanking.record.split('-')[0]}`)
        }
        
        if (fighter.ranking !== matchingRanking.rank) {
          result.discrepancies.push(`Ranking mismatch: Game shows rank ${fighter.ranking}, real-world shows rank ${matchingRanking.rank}`)
        }
      } else {
        result.suggestions.push('Fighter not found in real-world rankings')
      }
    } catch (error) {
      console.error('Failed to validate fighter data:', error)
    }

    return result
  }

  public async getRankingHistory(fighterName: string, weightClass: string): Promise<{
    rankings: { date: string; rank: number; organization: string }[]
    trends: { direction: 'up' | 'down' | 'stable'; period: string }
  }> {
    // Simulate ranking history
    const rankings = []
    const now = new Date()
    
    for (let i = 12; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 30 * 24 * 60 * 60 * 1000)
      rankings.push({
        date: date.toISOString(),
        rank: Math.floor(Math.random() * 15) + 1,
        organization: ['WBC', 'WBA', 'IBF', 'WBO'][Math.floor(Math.random() * 4)]
      })
    }
    
    const trends = {
      direction: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
      period: '6 months'
    }
    
    return { rankings, trends }
  }

  public getLastSyncTime(): Date | null {
    return this.lastSync
  }

  public getSyncStatus(): {
    lastSync: Date | null
    cacheStatus: 'valid' | 'expired' | 'none'
    nextSync: Date | null
  } {
    const cache = this.getCachedRankings()
    const cacheStatus = cache ? (this.isCacheValid(cache.timestamp) ? 'valid' : 'expired') : 'none'
    
    const nextSync = this.lastSync ? 
      new Date(this.lastSync.getTime() + this.config.updateInterval * 60 * 60 * 1000) : 
      null
    
    return {
      lastSync: this.lastSync,
      cacheStatus,
      nextSync
    }
  }

  public updateConfig(newConfig: Partial<RankingsAPIConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  public getConfig(): RankingsAPIConfig {
    return { ...this.config }
  }

  public clearCache(): void {
    this.cache.clear()
  }
}

// Export singleton instance
export const realWorldRankingsAPI = new RealWorldRankingsAPI({
  enabled: true,
  cacheEnabled: true,
  cacheDuration: 60, // 1 hour
  sources: ['WBC', 'WBA', 'IBF', 'WBO', 'The Ring'],
  syncEnabled: true,
  updateInterval: 24 // 24 hours
}) 