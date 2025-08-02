import { EventEmitter } from 'events';

// Matchmaking player interface
export interface MatchmakingPlayer {
  id: string;
  username: string;
  skillLevel: number;
  region: string;
  preferredGameTypes: string[];
  currentRating: number;
  winRate: number;
  totalGames: number;
  lastActive: number;
  isOnline: boolean;
  customRules?: Record<string, any>;
}

// Matchmaking criteria
export interface MatchmakingCriteria {
  skillLevel: number;
  region: string;
  preferredGameTypes: string[];
  maxWaitTime: number;
  customRules?: Record<string, any>;
  skillTolerance: number;
  regionPriority: boolean;
}

// Matchmaking result
export interface MatchmakingResult {
  success: boolean;
  matchId?: string;
  players: MatchmakingPlayer[];
  estimatedWaitTime?: number;
  error?: string;
}

// Matchmaking queue entry
export interface QueueEntry {
  player: MatchmakingPlayer;
  criteria: MatchmakingCriteria;
  joinTime: number;
  priority: number;
}

// Skill calculation interface
export interface SkillMetrics {
  rating: number;
  confidence: number;
  volatility: number;
  recentPerformance: number[];
}

// Regional matching interface
export interface RegionalMatch {
  region: string;
  latency: number;
  playerCount: number;
  averageSkill: number;
}

export class AdvancedMatchmakingEngine extends EventEmitter {
  private queue: QueueEntry[] = [];
  private activeMatches: Map<string, MatchmakingPlayer[]> = new Map();
  private playerSkills: Map<string, SkillMetrics> = new Map();
  private regionalData: Map<string, RegionalMatch> = new Map();
  private matchmakingInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor() {
    super();
    this.startMatchmaking();
  }

  // Core matchmaking methods
  public addToQueue(player: MatchmakingPlayer, criteria: MatchmakingCriteria): string {
    const entry: QueueEntry = {
      player,
      criteria,
      joinTime: Date.now(),
      priority: this.calculatePriority(player, criteria)
    };

    this.queue.push(entry);
    this.queue.sort((a, b) => b.priority - a.priority);
    
    this.emit('playerQueued', { playerId: player.id, position: this.queue.length });
    return player.id;
  }

  public removeFromQueue(playerId: string): boolean {
    const index = this.queue.findIndex(entry => entry.player.id === playerId);
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.emit('playerRemoved', { playerId });
      return true;
    }
    return false;
  }

  public findMatch(playerId: string): MatchmakingResult | null {
    const entry = this.queue.find(e => e.player.id === playerId);
    if (!entry) return null;

    const potentialMatches = this.findPotentialMatches(entry);
    if (potentialMatches.length === 0) return null;

    const bestMatch = this.selectBestMatch(entry, potentialMatches);
    if (!bestMatch) return null;

    return this.createMatch(entry, bestMatch);
  }

  // Advanced matching algorithms
  private findPotentialMatches(entry: QueueEntry): QueueEntry[] {
    const { player, criteria } = entry;
    const currentTime = Date.now();
    const maxWaitTime = criteria.maxWaitTime * 1000;

    return this.queue.filter(other => {
      if (other.player.id === player.id) return false;
      
      // Check if player has been waiting too long
      if (currentTime - other.joinTime > maxWaitTime) return false;

      // Skill level matching
      const skillDiff = Math.abs(player.skillLevel - other.player.skillLevel);
      if (skillDiff > criteria.skillTolerance) return false;

      // Region matching (if priority is set)
      if (criteria.regionPriority && player.region !== other.player.region) {
        const regionalLatency = this.getRegionalLatency(player.region, other.player.region);
        if (regionalLatency > 100) return false; // High latency threshold
      }

      // Game type compatibility
      const compatibleGameTypes = player.preferredGameTypes.filter(type => 
        other.player.preferredGameTypes.includes(type)
      );
      if (compatibleGameTypes.length === 0) return false;

      // Custom rules compatibility
      if (!this.checkCustomRulesCompatibility(player, other.player)) return false;

      return true;
    });
  }

  private selectBestMatch(entry: QueueEntry, potentialMatches: QueueEntry[]): QueueEntry | null {
    if (potentialMatches.length === 0) return null;

    // Score each potential match
    const scoredMatches = potentialMatches.map(match => ({
      entry: match,
      score: this.calculateMatchScore(entry, match)
    }));

    // Sort by score and return the best match
    scoredMatches.sort((a, b) => b.score - a.score);
    return scoredMatches[0].entry;
  }

  private calculateMatchScore(entry: QueueEntry, match: QueueEntry): number {
    const { player, criteria } = entry;
    const otherPlayer = match.player;
    let score = 0;

    // Skill level proximity (higher score for closer skill levels)
    const skillDiff = Math.abs(player.skillLevel - otherPlayer.skillLevel);
    score += (100 - skillDiff) * 2;

    // Regional proximity
    if (player.region === otherPlayer.region) {
      score += 50;
    } else {
      const latency = this.getRegionalLatency(player.region, otherPlayer.region);
      score += Math.max(0, 50 - latency / 10);
    }

    // Wait time consideration (prioritize players who have been waiting longer)
    const waitTimeDiff = Math.abs(entry.joinTime - match.joinTime);
    score += Math.min(30, waitTimeDiff / 1000);

    // Game type compatibility
    const compatibleTypes = player.preferredGameTypes.filter(type => 
      otherPlayer.preferredGameTypes.includes(type)
    );
    score += compatibleTypes.length * 20;

    // Rating similarity
    const ratingDiff = Math.abs(player.currentRating - otherPlayer.currentRating);
    score += Math.max(0, 100 - ratingDiff);

    // Win rate similarity
    const winRateDiff = Math.abs(player.winRate - otherPlayer.winRate);
    score += Math.max(0, 50 - winRateDiff * 100);

    return score;
  }

  private createMatch(entry: QueueEntry, match: QueueEntry): MatchmakingResult {
    const matchId = this.generateMatchId();
    const players = [entry.player, match.player];

    // Remove both players from queue
    this.removeFromQueue(entry.player.id);
    this.removeFromQueue(match.player.id);

    // Create the match
    this.activeMatches.set(matchId, players);
    
    // Update regional data
    this.updateRegionalData(players);

    const result: MatchmakingResult = {
      success: true,
      matchId,
      players
    };

    this.emit('matchCreated', result);
    return result;
  }

  // Skill rating system
  public updatePlayerSkill(playerId: string, gameResult: any): void {
    const currentSkill = this.playerSkills.get(playerId) || this.initializeSkillMetrics();
    const newSkill = this.calculateNewSkill(currentSkill, gameResult);
    this.playerSkills.set(playerId, newSkill);
  }

  private initializeSkillMetrics(): SkillMetrics {
    return {
      rating: 1500,
      confidence: 350,
      volatility: 0.06,
      recentPerformance: []
    };
  }

  private calculateNewSkill(current: SkillMetrics, gameResult: any): SkillMetrics {
    // Simplified ELO-like rating system
    const expectedScore = 1 / (1 + Math.pow(10, (gameResult.opponentRating - current.rating) / 400));
    const actualScore = gameResult.won ? 1 : 0;
    const kFactor = Math.min(32, Math.max(16, current.confidence));
    
    const newRating = current.rating + kFactor * (actualScore - expectedScore);
    const newConfidence = Math.max(50, current.confidence - 1);
    
    return {
      rating: newRating,
      confidence: newConfidence,
      volatility: current.volatility,
      recentPerformance: [...current.recentPerformance.slice(-9), actualScore]
    };
  }

  // Regional optimization
  private getRegionalLatency(region1: string, region2: string): number {
    const regionalData = this.regionalData.get(region1);
    if (region1 === region2) return 0;
    return regionalData?.latency || 50; // Default latency
  }

  private updateRegionalData(players: MatchmakingPlayer[]): void {
    const regions = [...new Set(players.map(p => p.region))];
    
    regions.forEach(region => {
      const existing = this.regionalData.get(region);
      const playerCount = players.filter(p => p.region === region).length;
      const averageSkill = players
        .filter(p => p.region === region)
        .reduce((sum, p) => sum + p.skillLevel, 0) / playerCount;

      this.regionalData.set(region, {
        region,
        latency: existing?.latency || 20,
        playerCount: (existing?.playerCount || 0) + playerCount,
        averageSkill
      });
    });
  }

  // Priority calculation
  private calculatePriority(player: MatchmakingPlayer, criteria: MatchmakingCriteria): number {
    let priority = 0;

    // Higher skill players get priority
    priority += player.skillLevel * 10;

    // Players with higher win rates get priority
    priority += player.winRate * 100;

    // Players with more games get priority (experience)
    priority += Math.min(100, player.totalGames);

    // Regional priority
    if (criteria.regionPriority) {
      priority += 50;
    }

    // Custom rules priority
    if (criteria.customRules) {
      priority += 25;
    }

    return priority;
  }

  // Custom rules compatibility
  private checkCustomRulesCompatibility(player1: MatchmakingPlayer, player2: MatchmakingPlayer): boolean {
    if (!player1.customRules || !player2.customRules) return true;

    // Check if custom rules are compatible
    const rules1 = player1.customRules;
    const rules2 = player2.customRules;

    // Example compatibility check
    if (rules1.gameMode && rules2.gameMode && rules1.gameMode !== rules2.gameMode) {
      return false;
    }

    if (rules1.maxPlayers && rules2.maxPlayers && rules1.maxPlayers !== rules2.maxPlayers) {
      return false;
    }

    return true;
  }

  // Queue management
  public getQueueStatus(playerId?: string): any {
    if (playerId) {
      const position = this.queue.findIndex(entry => entry.player.id === playerId);
      return {
        position: position !== -1 ? position + 1 : -1,
        totalPlayers: this.queue.length,
        estimatedWaitTime: this.estimateWaitTime(playerId)
      };
    }

    return {
      totalPlayers: this.queue.length,
      averageWaitTime: this.calculateAverageWaitTime(),
      regionalDistribution: this.getRegionalDistribution()
    };
  }

  private estimateWaitTime(playerId: string): number {
    const entry = this.queue.find(e => e.player.id === playerId);
    if (!entry) return 0;

    const position = this.queue.indexOf(entry);
    const averageMatchTime = 30000; // 30 seconds average
    return position * averageMatchTime;
  }

  private calculateAverageWaitTime(): number {
    if (this.queue.length === 0) return 0;
    
    const currentTime = Date.now();
    const totalWaitTime = this.queue.reduce((sum, entry) => 
      sum + (currentTime - entry.joinTime), 0
    );
    
    return totalWaitTime / this.queue.length;
  }

  private getRegionalDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    this.queue.forEach(entry => {
      const region = entry.player.region;
      distribution[region] = (distribution[region] || 0) + 1;
    });

    return distribution;
  }

  // Matchmaking loop
  private startMatchmaking(): void {
    this.isRunning = true;
    this.matchmakingInterval = setInterval(() => {
      this.processQueue();
    }, 1000); // Check every second
  }

  private processQueue(): void {
    if (this.queue.length < 2) return;

    // Process queue in priority order
    for (let i = 0; i < this.queue.length; i++) {
      const entry = this.queue[i];
      const match = this.findMatch(entry.player.id);
      
      if (match) {
        this.emit('matchFound', match);
        break; // Process one match at a time
      }
    }

    // Clean up expired entries
    this.cleanupExpiredEntries();
  }

  private cleanupExpiredEntries(): void {
    const currentTime = Date.now();
    const expiredEntries = this.queue.filter(entry => {
      const waitTime = currentTime - entry.joinTime;
      return waitTime > entry.criteria.maxWaitTime * 1000;
    });

    expiredEntries.forEach(entry => {
      this.removeFromQueue(entry.player.id);
      this.emit('playerExpired', { playerId: entry.player.id });
    });
  }

  // Utility methods
  private generateMatchId(): string {
    return `match_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  public stop(): void {
    this.isRunning = false;
    if (this.matchmakingInterval) {
      clearInterval(this.matchmakingInterval);
      this.matchmakingInterval = null;
    }
  }

  public getStats(): any {
    return {
      queueLength: this.queue.length,
      activeMatches: this.activeMatches.size,
      totalPlayers: this.playerSkills.size,
      regions: this.regionalData.size,
      isRunning: this.isRunning
    };
  }
}

// Create default instance
export const advancedMatchmaking = new AdvancedMatchmakingEngine(); 