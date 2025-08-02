import { EventEmitter } from 'events';

// WebSocket connection states
export enum WebSocketState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}

// WebSocket message types
export enum MessageType {
  // Connection
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  PING = 'ping',
  PONG = 'pong',
  
  // Game events
  GAME_CREATE = 'game_create',
  GAME_JOIN = 'game_join',
  GAME_LEAVE = 'game_leave',
  GAME_START = 'game_start',
  GAME_END = 'game_end',
  GAME_UPDATE = 'game_update',
  
  // Tournament events
  TOURNAMENT_CREATE = 'tournament_create',
  TOURNAMENT_JOIN = 'tournament_join',
  TOURNAMENT_UPDATE = 'tournament_update',
  TOURNAMENT_MATCH_UPDATE = 'tournament_match_update',
  
  // Chat events
  CHAT_MESSAGE = 'chat_message',
  CHAT_JOIN = 'chat_join',
  CHAT_LEAVE = 'chat_leave',
  
  // Social events
  FRIEND_REQUEST = 'friend_request',
  FRIEND_ACCEPT = 'friend_accept',
  FRIEND_DECLINE = 'friend_decline',
  CHALLENGE_SEND = 'challenge_send',
  CHALLENGE_ACCEPT = 'challenge_accept',
  CHALLENGE_DECLINE = 'challenge_decline',
  
  // Leaderboard events
  LEADERBOARD_UPDATE = 'leaderboard_update',
  SCORE_UPDATE = 'score_update',
  
  // Spectator events
  SPECTATOR_JOIN = 'spectator_join',
  SPECTATOR_LEAVE = 'spectator_leave',
  SPECTATOR_UPDATE = 'spectator_update',
  
  // Replay events
  REPLAY_REQUEST = 'replay_request',
  REPLAY_DATA = 'replay_data',
  
  // Analytics events
  ANALYTICS_UPDATE = 'analytics_update',
  PERFORMANCE_METRICS = 'performance_metrics'
}

// WebSocket message interface
export interface WebSocketMessage {
  type: MessageType;
  data: any;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

// Connection configuration
export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  timeout: number;
}

// Advanced matchmaking criteria
export interface MatchmakingCriteria {
  skillLevel: number;
  region: string;
  preferredGameType: string[];
  maxWaitTime: number;
  customRules?: Record<string, any>;
}

// Spectator mode interface
export interface SpectatorData {
  gameId: string;
  spectators: string[];
  maxSpectators: number;
  isPublic: boolean;
}

// Replay system interface
export interface ReplayData {
  gameId: string;
  moves: any[];
  timestamps: number[];
  metadata: Record<string, any>;
}

export class WebSocketEngine extends EventEmitter {
  private socket: WebSocket | null = null;
  private state: WebSocketState = WebSocketState.DISCONNECTED;
  private reconnectAttempts: number = 0;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageQueue: WebSocketMessage[] = [];
  private config: WebSocketConfig;
  private userId: string | null = null;
  private sessionId: string | null = null;

  constructor(config: WebSocketConfig) {
    super();
    this.config = config;
  }

  // Connection management
  public connect(userId: string, sessionId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.userId = userId;
        this.sessionId = sessionId || this.generateSessionId();
        this.state = WebSocketState.CONNECTING;
        this.emit('stateChange', this.state);

        this.socket = new WebSocket(this.config.url);
        
        this.socket.onopen = () => {
          this.state = WebSocketState.CONNECTED;
          this.reconnectAttempts = 0;
          this.emit('stateChange', this.state);
          this.startHeartbeat();
          this.flushMessageQueue();
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.socket.onclose = (event) => {
          this.state = WebSocketState.DISCONNECTED;
          this.emit('stateChange', this.state);
          this.stopHeartbeat();
          
          if (!event.wasClean && this.reconnectAttempts < this.config.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.socket.onerror = (error) => {
          this.state = WebSocketState.ERROR;
          this.emit('stateChange', this.state);
          this.emit('error', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, 'User disconnected');
      this.socket = null;
    }
    this.state = WebSocketState.DISCONNECTED;
    this.stopHeartbeat();
    this.emit('stateChange', this.state);
  }

  // Message handling
  public sendMessage(type: MessageType, data: any): void {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId || undefined
    };

    if (this.state === WebSocketState.CONNECTED && this.socket) {
      this.socket.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    // Emit the message type as an event
    this.emit(message.type, message.data);
    
    // Handle specific message types
    switch (message.type) {
      case MessageType.PONG:
        this.emit('heartbeat');
        break;
      case MessageType.GAME_UPDATE:
        this.emit('gameUpdate', message.data);
        break;
      case MessageType.TOURNAMENT_UPDATE:
        this.emit('tournamentUpdate', message.data);
        break;
      case MessageType.CHAT_MESSAGE:
        this.emit('chatMessage', message.data);
        break;
      case MessageType.LEADERBOARD_UPDATE:
        this.emit('leaderboardUpdate', message.data);
        break;
      case MessageType.SPECTATOR_UPDATE:
        this.emit('spectatorUpdate', message.data);
        break;
      case MessageType.REPLAY_DATA:
        this.emit('replayData', message.data);
        break;
      case MessageType.ANALYTICS_UPDATE:
        this.emit('analyticsUpdate', message.data);
        break;
    }
  }

  // Advanced matchmaking
  public requestMatchmaking(criteria: MatchmakingCriteria): void {
    this.sendMessage(MessageType.GAME_CREATE, {
      type: 'matchmaking',
      criteria
    });
  }

  // Tournament management
  public joinTournament(tournamentId: string): void {
    this.sendMessage(MessageType.TOURNAMENT_JOIN, { tournamentId });
  }

  public createTournament(tournamentData: any): void {
    this.sendMessage(MessageType.TOURNAMENT_CREATE, tournamentData);
  }

  // Chat system
  public sendChatMessage(roomId: string, message: string): void {
    this.sendMessage(MessageType.CHAT_MESSAGE, {
      roomId,
      message,
      timestamp: Date.now()
    });
  }

  public joinChatRoom(roomId: string): void {
    this.sendMessage(MessageType.CHAT_JOIN, { roomId });
  }

  // Social features
  public sendFriendRequest(targetUserId: string): void {
    this.sendMessage(MessageType.FRIEND_REQUEST, { targetUserId });
  }

  public sendChallenge(targetUserId: string, gameType: string): void {
    this.sendMessage(MessageType.CHALLENGE_SEND, {
      targetUserId,
      gameType,
      timestamp: Date.now()
    });
  }

  // Spectator mode
  public joinAsSpectator(gameId: string): void {
    this.sendMessage(MessageType.SPECTATOR_JOIN, { gameId });
  }

  public leaveSpectatorMode(gameId: string): void {
    this.sendMessage(MessageType.SPECTATOR_LEAVE, { gameId });
  }

  // Replay system
  public requestReplay(gameId: string): void {
    this.sendMessage(MessageType.REPLAY_REQUEST, { gameId });
  }

  // Analytics
  public requestAnalytics(gameId?: string): void {
    this.sendMessage(MessageType.ANALYTICS_UPDATE, { gameId });
  }

  // Private methods
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.sendMessage(MessageType.PING, { timestamp: Date.now() });
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect(): void {
    this.state = WebSocketState.RECONNECTING;
    this.emit('stateChange', this.state);
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.connect(this.userId!, this.sessionId!);
    }, this.config.reconnectInterval);
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message && this.socket) {
        this.socket.send(JSON.stringify(message));
      }
    }
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Public getters
  public getState(): WebSocketState {
    return this.state;
  }

  public isConnected(): boolean {
    return this.state === WebSocketState.CONNECTED;
  }

  public getUserId(): string | null {
    return this.userId;
  }

  public getSessionId(): string | null {
    return this.sessionId;
  }
}

// Default configuration
export const defaultWebSocketConfig: WebSocketConfig = {
  url: 'wss://glory-boxing-manager.com/ws',
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
  heartbeatInterval: 30000,
  timeout: 10000
};

// Create default instance
export const websocketEngine = new WebSocketEngine(defaultWebSocketConfig); 