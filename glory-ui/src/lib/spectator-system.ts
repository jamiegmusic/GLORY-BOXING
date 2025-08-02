import { EventEmitter } from 'events';

// Spectator interface
export interface Spectator {
  id: string;
  username: string;
  joinTime: number;
  isPremium: boolean;
  region: string;
}

// Spectator mode settings
export interface SpectatorSettings {
  allowSpectators: boolean;
  maxSpectators: number;
  isPublic: boolean;
  requireApproval: boolean;
  showPlayerNames: boolean;
  showChat: boolean;
  showReplayControls: boolean;
}

// Live match data
export interface LiveMatchData {
  matchId: string;
  players: {
    id: string;
    username: string;
    health: number;
    stamina: number;
    score: number;
    currentAction?: string;
  }[];
  round: number;
  timeRemaining: number;
  status: 'waiting' | 'active' | 'paused' | 'finished';
  spectators: Spectator[];
  chat: ChatMessage[];
  highlights: MatchHighlight[];
}

// Match highlight
export interface MatchHighlight {
  id: string;
  timestamp: number;
  type: 'knockdown' | 'knockout' | 'great_move' | 'close_call';
  description: string;
  playerId?: string;
}

// Chat message
export interface ChatMessage {
  id: string;
  spectatorId: string;
  username: string;
  message: string;
  timestamp: number;
  isModerated: boolean;
}

// Replay controls
export interface ReplayControls {
  isPlaying: boolean;
  currentTime: number;
  totalTime: number;
  speed: number;
  isPaused: boolean;
}

// Spectator analytics
export interface SpectatorAnalytics {
  totalSpectators: number;
  peakSpectators: number;
  averageWatchTime: number;
  engagementRate: number;
  chatActivity: number;
  highlightsGenerated: number;
}

export class SpectatorSystem extends EventEmitter {
  private activeMatches: Map<string, LiveMatchData> = new Map();
  private spectatorSettings: Map<string, SpectatorSettings> = new Map();
  private replayControls: Map<string, ReplayControls> = new Map();
  private analytics: Map<string, SpectatorAnalytics> = new Map();
  private chatFilters: Set<string> = new Set();
  private highlightDetection: HighlightDetector;

  constructor() {
    super();
    this.highlightDetection = new HighlightDetector();
  }

  // Match management
  public createSpectatorMatch(matchId: string, players: any[], settings: SpectatorSettings): void {
    const matchData: LiveMatchData = {
      matchId,
      players: players.map(player => ({
        id: player.id,
        username: player.username,
        health: 100,
        stamina: 100,
        score: 0,
        currentAction: undefined
      })),
      round: 1,
      timeRemaining: 180, // 3 minutes per round
      status: 'waiting',
      spectators: [],
      chat: [],
      highlights: []
    };

    this.activeMatches.set(matchId, matchData);
    this.spectatorSettings.set(matchId, settings);
    this.initializeAnalytics(matchId);

    this.emit('matchCreated', { matchId, settings });
  }

  public startMatch(matchId: string): void {
    const match = this.activeMatches.get(matchId);
    if (match) {
      match.status = 'active';
      this.emit('matchStarted', { matchId });
    }
  }

  public endMatch(matchId: string): void {
    const match = this.activeMatches.get(matchId);
    if (match) {
      match.status = 'finished';
      this.updateAnalytics(matchId);
      this.emit('matchEnded', { matchId });
    }
  }

  // Spectator management
  public joinAsSpectator(matchId: string, spectator: Spectator): boolean {
    const match = this.activeMatches.get(matchId);
    const settings = this.spectatorSettings.get(matchId);

    if (!match || !settings) return false;

    // Check if spectators are allowed
    if (!settings.allowSpectators) return false;

    // Check if max spectators reached
    if (match.spectators.length >= settings.maxSpectators) return false;

    // Check if approval is required
    if (settings.requireApproval) {
      this.emit('spectatorRequest', { matchId, spectator });
      return false;
    }

    // Add spectator
    match.spectators.push(spectator);
    this.emit('spectatorJoined', { matchId, spectator });

    return true;
  }

  public leaveSpectatorMode(matchId: string, spectatorId: string): boolean {
    const match = this.activeMatches.get(matchId);
    if (!match) return false;

    const index = match.spectators.findIndex(s => s.id === spectatorId);
    if (index !== -1) {
      const spectator = match.spectators.splice(index, 1)[0];
      this.emit('spectatorLeft', { matchId, spectator });
      return true;
    }

    return false;
  }

  // Real-time updates
  public updateMatchData(matchId: string, updates: Partial<LiveMatchData>): void {
    const match = this.activeMatches.get(matchId);
    if (!match) return;

    // Update match data
    Object.assign(match, updates);

    // Detect highlights
    const highlights = this.highlightDetection.detectHighlights(match);
    if (highlights.length > 0) {
      match.highlights.push(...highlights);
      this.emit('highlightsDetected', { matchId, highlights });
    }

    // Emit update to all spectators
    this.emit('matchUpdate', { matchId, data: match });
  }

  public updatePlayerAction(matchId: string, playerId: string, action: string): void {
    const match = this.activeMatches.get(matchId);
    if (!match) return;

    const player = match.players.find(p => p.id === playerId);
    if (player) {
      player.currentAction = action;
      this.emit('playerAction', { matchId, playerId, action });
    }
  }

  public updatePlayerStats(matchId: string, playerId: string, stats: any): void {
    const match = this.activeMatches.get(matchId);
    if (!match) return;

    const player = match.players.find(p => p.id === playerId);
    if (player) {
      Object.assign(player, stats);
      this.emit('playerStatsUpdate', { matchId, playerId, stats });
    }
  }

  // Chat system
  public sendChatMessage(matchId: string, spectatorId: string, message: string): boolean {
    const match = this.activeMatches.get(matchId);
    const settings = this.spectatorSettings.get(matchId);

    if (!match || !settings || !settings.showChat) return false;

    // Check for inappropriate content
    if (this.isInappropriateContent(message)) {
      this.emit('inappropriateMessage', { matchId, spectatorId, message });
      return false;
    }

    const spectator = match.spectators.find(s => s.id === spectatorId);
    if (!spectator) return false;

    const chatMessage: ChatMessage = {
      id: this.generateId(),
      spectatorId,
      username: spectator.username,
      message,
      timestamp: Date.now(),
      isModerated: false
    };

    match.chat.push(chatMessage);
    this.emit('chatMessage', { matchId, message: chatMessage });

    return true;
  }

  public moderateChatMessage(matchId: string, messageId: string, action: 'approve' | 'reject' | 'delete'): void {
    const match = this.activeMatches.get(matchId);
    if (!match) return;

    const message = match.chat.find(m => m.id === messageId);
    if (message) {
      switch (action) {
        case 'approve':
          message.isModerated = false;
          break;
        case 'reject':
        case 'delete':
          const index = match.chat.indexOf(message);
          match.chat.splice(index, 1);
          break;
      }

      this.emit('messageModerated', { matchId, messageId, action });
    }
  }

  // Replay system
  public startReplay(matchId: string): void {
    const controls: ReplayControls = {
      isPlaying: true,
      currentTime: 0,
      totalTime: 0,
      speed: 1,
      isPaused: false
    };

    this.replayControls.set(matchId, controls);
    this.emit('replayStarted', { matchId });
  }

  public pauseReplay(matchId: string): void {
    const controls = this.replayControls.get(matchId);
    if (controls) {
      controls.isPaused = true;
      controls.isPlaying = false;
      this.emit('replayPaused', { matchId });
    }
  }

  public resumeReplay(matchId: string): void {
    const controls = this.replayControls.get(matchId);
    if (controls) {
      controls.isPaused = false;
      controls.isPlaying = true;
      this.emit('replayResumed', { matchId });
    }
  }

  public setReplaySpeed(matchId: string, speed: number): void {
    const controls = this.replayControls.get(matchId);
    if (controls) {
      controls.speed = Math.max(0.25, Math.min(4, speed));
      this.emit('replaySpeedChanged', { matchId, speed: controls.speed });
    }
  }

  public seekReplay(matchId: string, time: number): void {
    const controls = this.replayControls.get(matchId);
    if (controls) {
      controls.currentTime = Math.max(0, Math.min(controls.totalTime, time));
      this.emit('replaySeeked', { matchId, time: controls.currentTime });
    }
  }

  // Analytics
  private initializeAnalytics(matchId: string): void {
    const analytics: SpectatorAnalytics = {
      totalSpectators: 0,
      peakSpectators: 0,
      averageWatchTime: 0,
      engagementRate: 0,
      chatActivity: 0,
      highlightsGenerated: 0
    };

    this.analytics.set(matchId, analytics);
  }

  private updateAnalytics(matchId: string): void {
    const match = this.activeMatches.get(matchId);
    const analytics = this.analytics.get(matchId);

    if (match && analytics) {
      analytics.totalSpectators = match.spectators.length;
      analytics.peakSpectators = Math.max(analytics.peakSpectators, match.spectators.length);
      analytics.chatActivity = match.chat.length;
      analytics.highlightsGenerated = match.highlights.length;

      this.emit('analyticsUpdated', { matchId, analytics });
    }
  }

  // Utility methods
  public getMatchData(matchId: string): LiveMatchData | null {
    return this.activeMatches.get(matchId) || null;
  }

  public getSpectatorSettings(matchId: string): SpectatorSettings | null {
    return this.spectatorSettings.get(matchId) || null;
  }

  public getReplayControls(matchId: string): ReplayControls | null {
    return this.replayControls.get(matchId) || null;
  }

  public getAnalytics(matchId: string): SpectatorAnalytics | null {
    return this.analytics.get(matchId) || null;
  }

  public getPublicMatches(): LiveMatchData[] {
    return Array.from(this.activeMatches.values()).filter(match => {
      const settings = this.spectatorSettings.get(match.matchId);
      return settings?.isPublic && settings?.allowSpectators;
    });
  }

  private isInappropriateContent(message: string): boolean {
    const inappropriateWords = ['spam', 'inappropriate', 'offensive'];
    const lowerMessage = message.toLowerCase();
    return inappropriateWords.some(word => lowerMessage.includes(word));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  public cleanup(): void {
    this.activeMatches.clear();
    this.spectatorSettings.clear();
    this.replayControls.clear();
    this.analytics.clear();
  }
}

// Highlight detection system
class HighlightDetector {
  private highlightRules: Map<string, (match: LiveMatchData) => MatchHighlight[]> = new Map();

  constructor() {
    this.initializeHighlightRules();
  }

  private initializeHighlightRules(): void {
    // Knockdown detection
    this.highlightRules.set('knockdown', (match: LiveMatchData) => {
      const highlights: MatchHighlight[] = [];
      match.players.forEach(player => {
        if (player.health < 20 && player.currentAction === 'knockdown') {
          highlights.push({
            id: this.generateId(),
            timestamp: Date.now(),
            type: 'knockdown',
            description: `${player.username} is knocked down!`,
            playerId: player.id
          });
        }
      });
      return highlights;
    });

    // Knockout detection
    this.highlightRules.set('knockout', (match: LiveMatchData) => {
      const highlights: MatchHighlight[] = [];
      match.players.forEach(player => {
        if (player.health <= 0) {
          highlights.push({
            id: this.generateId(),
            timestamp: Date.now(),
            type: 'knockout',
            description: `${player.username} is knocked out!`,
            playerId: player.id
          });
        }
      });
      return highlights;
    });

    // Great move detection
    this.highlightRules.set('great_move', (match: LiveMatchData) => {
      const highlights: MatchHighlight[] = [];
      match.players.forEach(player => {
        if (player.currentAction && player.currentAction.includes('combo')) {
          highlights.push({
            id: this.generateId(),
            timestamp: Date.now(),
            type: 'great_move',
            description: `${player.username} executes a brilliant combo!`,
            playerId: player.id
          });
        }
      });
      return highlights;
    });

    // Close call detection
    this.highlightRules.set('close_call', (match: LiveMatchData) => {
      const highlights: MatchHighlight[] = [];
      const healthDiffs = match.players.map(p => p.health);
      const minHealth = Math.min(...healthDiffs);
      const maxHealth = Math.max(...healthDiffs);

      if (maxHealth - minHealth < 10 && maxHealth < 50) {
        highlights.push({
          id: this.generateId(),
          timestamp: Date.now(),
          type: 'close_call',
          description: 'This is a close match! Both fighters are evenly matched!'
        });
      }
      return highlights;
    });
  }

  public detectHighlights(match: LiveMatchData): MatchHighlight[] {
    const highlights: MatchHighlight[] = [];

    this.highlightRules.forEach((rule, type) => {
      const ruleHighlights = rule(match);
      highlights.push(...ruleHighlights);
    });

    return highlights;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

// Create default instance
export const spectatorSystem = new SpectatorSystem(); 