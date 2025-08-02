import { EventEmitter } from 'events';

// Replay data structure
export interface ReplayData {
  id: string;
  matchId: string;
  title: string;
  description: string;
  createdAt: number;
  duration: number;
  players: ReplayPlayer[];
  events: ReplayEvent[];
  metadata: ReplayMetadata;
  highlights: ReplayHighlight[];
  analysis: ReplayAnalysis;
}

// Replay player
export interface ReplayPlayer {
  id: string;
  username: string;
  initialStats: PlayerStats;
  finalStats: PlayerStats;
  actions: PlayerAction[];
}

// Player stats
export interface PlayerStats {
  health: number;
  stamina: number;
  score: number;
  punchesLanded: number;
  punchesThrown: number;
  accuracy: number;
  defense: number;
  speed: number;
}

// Player action
export interface PlayerAction {
  timestamp: number;
  type: 'punch' | 'block' | 'dodge' | 'combo' | 'special';
  target?: string;
  damage?: number;
  position: { x: number; y: number };
  success: boolean;
}

// Replay event
export interface ReplayEvent {
  timestamp: number;
  type: 'round_start' | 'round_end' | 'knockdown' | 'knockout' | 'timeout' | 'foul';
  playerId?: string;
  data: any;
}

// Replay metadata
export interface ReplayMetadata {
  gameVersion: string;
  rules: string;
  tournament?: string;
  venue?: string;
  weather?: string;
  tags: string[];
  rating: number;
  views: number;
  shares: number;
}

// Replay highlight
export interface ReplayHighlight {
  id: string;
  timestamp: number;
  duration: number;
  type: 'knockdown' | 'knockout' | 'combo' | 'defense' | 'clutch';
  title: string;
  description: string;
  playerId?: string;
  thumbnail?: string;
}

// Replay analysis
export interface ReplayAnalysis {
  overallScore: number;
  keyMoments: KeyMoment[];
  statistics: MatchStatistics;
  insights: AnalysisInsight[];
  recommendations: string[];
}

// Key moment
export interface KeyMoment {
  timestamp: number;
  type: 'turning_point' | 'mistake' | 'brilliant_move' | 'lucky_break';
  description: string;
  impact: number; // -100 to 100
  playerId?: string;
}

// Match statistics
export interface MatchStatistics {
  totalRounds: number;
  totalTime: number;
  totalPunches: number;
  totalDamage: number;
  knockdowns: number;
  knockouts: number;
  accuracy: number;
  defense: number;
  aggression: number;
}

// Analysis insight
export interface AnalysisInsight {
  type: 'performance' | 'strategy' | 'timing' | 'technique';
  title: string;
  description: string;
  confidence: number;
  playerId?: string;
}

// Replay controls
export interface ReplayControls {
  isPlaying: boolean;
  currentTime: number;
  totalTime: number;
  speed: number;
  isPaused: boolean;
  isLooping: boolean;
  loopStart?: number;
  loopEnd?: number;
}

// Replay filter
export interface ReplayFilter {
  playerId?: string;
  eventType?: string;
  timeRange?: { start: number; end: number };
  highlightOnly?: boolean;
  minRating?: number;
}

export class ReplaySystem extends EventEmitter {
  private replays: Map<string, ReplayData> = new Map();
  private activeReplays: Map<string, ReplayControls> = new Map();
  private recordingBuffer: Map<string, ReplayEvent[]> = new Map();
  private analysisEngine: ReplayAnalysisEngine;

  constructor() {
    super();
    this.analysisEngine = new ReplayAnalysisEngine();
  }

  // Recording system
  public startRecording(matchId: string): void {
    this.recordingBuffer.set(matchId, []);
    this.emit('recordingStarted', { matchId });
  }

  public recordEvent(matchId: string, event: ReplayEvent): void {
    const buffer = this.recordingBuffer.get(matchId);
    if (buffer) {
      buffer.push(event);
      this.emit('eventRecorded', { matchId, event });
    }
  }

  public recordPlayerAction(matchId: string, playerId: string, action: PlayerAction): void {
    const event: ReplayEvent = {
      timestamp: action.timestamp,
      type: 'action',
      playerId,
      data: action
    };
    this.recordEvent(matchId, event);
  }

  public stopRecording(matchId: string, metadata: Partial<ReplayMetadata>): ReplayData | null {
    const buffer = this.recordingBuffer.get(matchId);
    if (!buffer) return null;

    const replayData = this.createReplayData(matchId, buffer, metadata);
    this.replays.set(replayData.id, replayData);
    this.recordingBuffer.delete(matchId);

    // Analyze the replay
    const analysis = this.analysisEngine.analyzeReplay(replayData);
    replayData.analysis = analysis;

    this.emit('recordingStopped', { matchId, replayData });
    return replayData;
  }

  // Playback system
  public playReplay(replayId: string): boolean {
    const replay = this.replays.get(replayId);
    if (!replay) return false;

    const controls: ReplayControls = {
      isPlaying: true,
      currentTime: 0,
      totalTime: replay.duration,
      speed: 1,
      isPaused: false,
      isLooping: false
    };

    this.activeReplays.set(replayId, controls);
    this.emit('replayStarted', { replayId, replay });
    return true;
  }

  public pauseReplay(replayId: string): void {
    const controls = this.activeReplays.get(replayId);
    if (controls) {
      controls.isPaused = true;
      controls.isPlaying = false;
      this.emit('replayPaused', { replayId });
    }
  }

  public resumeReplay(replayId: string): void {
    const controls = this.activeReplays.get(replayId);
    if (controls) {
      controls.isPaused = false;
      controls.isPlaying = true;
      this.emit('replayResumed', { replayId });
    }
  }

  public stopReplay(replayId: string): void {
    this.activeReplays.delete(replayId);
    this.emit('replayStopped', { replayId });
  }

  public seekReplay(replayId: string, time: number): void {
    const controls = this.activeReplays.get(replayId);
    const replay = this.replays.get(replayId);
    
    if (controls && replay) {
      controls.currentTime = Math.max(0, Math.min(replay.duration, time));
      this.emit('replaySeeked', { replayId, time: controls.currentTime });
    }
  }

  public setReplaySpeed(replayId: string, speed: number): void {
    const controls = this.activeReplays.get(replayId);
    if (controls) {
      controls.speed = Math.max(0.25, Math.min(4, speed));
      this.emit('replaySpeedChanged', { replayId, speed: controls.speed });
    }
  }

  public setReplayLoop(replayId: string, start: number, end: number): void {
    const controls = this.activeReplays.get(replayId);
    if (controls) {
      controls.isLooping = true;
      controls.loopStart = start;
      controls.loopEnd = end;
      this.emit('replayLoopSet', { replayId, start, end });
    }
  }

  public clearReplayLoop(replayId: string): void {
    const controls = this.activeReplays.get(replayId);
    if (controls) {
      controls.isLooping = false;
      controls.loopStart = undefined;
      controls.loopEnd = undefined;
      this.emit('replayLoopCleared', { replayId });
    }
  }

  // Highlight system
  public createHighlight(replayId: string, startTime: number, endTime: number, title: string, description: string): ReplayHighlight | null {
    const replay = this.replays.get(replayId);
    if (!replay) return null;

    const highlight: ReplayHighlight = {
      id: this.generateId(),
      timestamp: startTime,
      duration: endTime - startTime,
      type: this.determineHighlightType(replay, startTime, endTime),
      title,
      description,
      playerId: this.getHighlightPlayerId(replay, startTime, endTime)
    };

    replay.highlights.push(highlight);
    this.emit('highlightCreated', { replayId, highlight });
    return highlight;
  }

  public getHighlights(replayId: string): ReplayHighlight[] {
    const replay = this.replays.get(replayId);
    return replay?.highlights || [];
  }

  public removeHighlight(replayId: string, highlightId: string): boolean {
    const replay = this.replays.get(replayId);
    if (!replay) return false;

    const index = replay.highlights.findIndex(h => h.id === highlightId);
    if (index !== -1) {
      replay.highlights.splice(index, 1);
      this.emit('highlightRemoved', { replayId, highlightId });
      return true;
    }
    return false;
  }

  // Search and filter
  public searchReplays(query: string, filter?: ReplayFilter): ReplayData[] {
    const results: ReplayData[] = [];
    
    this.replays.forEach(replay => {
      if (this.matchesSearch(replay, query, filter)) {
        results.push(replay);
      }
    });

    return results.sort((a, b) => b.metadata.rating - a.metadata.rating);
  }

  public getReplayById(replayId: string): ReplayData | null {
    return this.replays.get(replayId) || null;
  }

  public getAllReplays(): ReplayData[] {
    return Array.from(this.replays.values());
  }

  // Sharing system
  public shareReplay(replayId: string, platform: string): string {
    const replay = this.replays.get(replayId);
    if (!replay) return '';

    replay.metadata.shares++;
    const shareUrl = this.generateShareUrl(replayId, platform);
    
    this.emit('replayShared', { replayId, platform, shareUrl });
    return shareUrl;
  }

  public rateReplay(replayId: string, rating: number): void {
    const replay = this.replays.get(replayId);
    if (replay) {
      replay.metadata.rating = Math.max(1, Math.min(5, rating));
      this.emit('replayRated', { replayId, rating });
    }
  }

  // Export system
  public exportReplay(replayId: string, format: 'json' | 'mp4' | 'gif'): any {
    const replay = this.replays.get(replayId);
    if (!replay) return null;

    switch (format) {
      case 'json':
        return this.exportAsJSON(replay);
      case 'mp4':
        return this.exportAsVideo(replay);
      case 'gif':
        return this.exportAsGIF(replay);
      default:
        return null;
    }
  }

  // Private methods
  private createReplayData(matchId: string, events: ReplayEvent[], metadata: Partial<ReplayMetadata>): ReplayData {
    const replayData: ReplayData = {
      id: this.generateId(),
      matchId,
      title: metadata.title || `Match ${matchId}`,
      description: metadata.description || '',
      createdAt: Date.now(),
      duration: this.calculateDuration(events),
      players: this.extractPlayers(events),
      events,
      metadata: {
        gameVersion: '1.0.0',
        rules: 'standard',
        tags: [],
        rating: 0,
        views: 0,
        shares: 0,
        ...metadata
      },
      highlights: [],
      analysis: this.analysisEngine.analyzeReplay({} as ReplayData) // Placeholder
    };

    return replayData;
  }

  private calculateDuration(events: ReplayEvent[]): number {
    if (events.length === 0) return 0;
    return Math.max(...events.map(e => e.timestamp));
  }

  private extractPlayers(events: ReplayEvent[]): ReplayPlayer[] {
    const playerMap = new Map<string, ReplayPlayer>();
    
    events.forEach(event => {
      if (event.playerId) {
        if (!playerMap.has(event.playerId)) {
          playerMap.set(event.playerId, {
            id: event.playerId,
            username: `Player ${event.playerId}`,
            initialStats: this.getDefaultStats(),
            finalStats: this.getDefaultStats(),
            actions: []
          });
        }
      }
    });

    return Array.from(playerMap.values());
  }

  private getDefaultStats(): PlayerStats {
    return {
      health: 100,
      stamina: 100,
      score: 0,
      punchesLanded: 0,
      punchesThrown: 0,
      accuracy: 0,
      defense: 0,
      speed: 0
    };
  }

  private determineHighlightType(replay: ReplayData, startTime: number, endTime: number): ReplayHighlight['type'] {
    const events = replay.events.filter(e => e.timestamp >= startTime && e.timestamp <= endTime);
    
    if (events.some(e => e.type === 'knockout')) return 'knockout';
    if (events.some(e => e.type === 'knockdown')) return 'knockdown';
    if (events.some(e => e.type === 'action' && e.data?.type === 'combo')) return 'combo';
    if (events.some(e => e.type === 'action' && e.data?.type === 'block')) return 'defense';
    
    return 'clutch';
  }

  private getHighlightPlayerId(replay: ReplayData, startTime: number, endTime: number): string | undefined {
    const events = replay.events.filter(e => e.timestamp >= startTime && e.timestamp <= endTime);
    return events[0]?.playerId;
  }

  private matchesSearch(replay: ReplayData, query: string, filter?: ReplayFilter): boolean {
    const lowerQuery = query.toLowerCase();
    
    // Text search
    if (query && !replay.title.toLowerCase().includes(lowerQuery) && 
        !replay.description.toLowerCase().includes(lowerQuery)) {
      return false;
    }

    // Filter by player
    if (filter?.playerId && !replay.players.some(p => p.id === filter.playerId)) {
      return false;
    }

    // Filter by event type
    if (filter?.eventType && !replay.events.some(e => e.type === filter.eventType)) {
      return false;
    }

    // Filter by time range
    if (filter?.timeRange) {
      const { start, end } = filter.timeRange;
      if (replay.duration < start || replay.duration > end) {
        return false;
      }
    }

    // Filter by rating
    if (filter?.minRating && replay.metadata.rating < filter.minRating) {
      return false;
    }

    return true;
  }

  private generateShareUrl(replayId: string, platform: string): string {
    return `https://glory-boxing-manager.com/replay/${replayId}?platform=${platform}`;
  }

  private exportAsJSON(replay: ReplayData): any {
    return JSON.stringify(replay, null, 2);
  }

  private exportAsVideo(replay: ReplayData): any {
    // Placeholder for video export
    return { format: 'mp4', replayId: replay.id };
  }

  private exportAsGIF(replay: ReplayData): any {
    // Placeholder for GIF export
    return { format: 'gif', replayId: replay.id };
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

// Replay analysis engine
class ReplayAnalysisEngine {
  public analyzeReplay(replay: ReplayData): ReplayAnalysis {
    // Placeholder analysis - in a real implementation, this would analyze the replay data
    return {
      overallScore: 75,
      keyMoments: [],
      statistics: {
        totalRounds: 3,
        totalTime: 540,
        totalPunches: 150,
        totalDamage: 2500,
        knockdowns: 2,
        knockouts: 0,
        accuracy: 65,
        defense: 70,
        aggression: 60
      },
      insights: [],
      recommendations: []
    };
  }
}

// Create default instance
export const replaySystem = new ReplaySystem(); 