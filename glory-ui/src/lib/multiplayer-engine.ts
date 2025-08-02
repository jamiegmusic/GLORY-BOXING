// Multiplayer Engine for Glory Boxing Manager
// Handles real-time multiplayer functionality, tournaments, leaderboards, and social features

export interface MultiplayerUser {
  id: string;
  username: string;
  avatar?: string;
  rank: number;
  level: number;
  experience: number;
  joinDate: Date;
  lastActive: Date;
  isOnline: boolean;
  currentGame?: string;
}

export interface MultiplayerGame {
  id: string;
  name: string;
  type: 'tournament' | 'challenge' | 'cooperative' | 'competitive';
  status: 'waiting' | 'active' | 'completed' | 'cancelled';
  players: MultiplayerUser[];
  maxPlayers: number;
  createdBy: string;
  createdAt: Date;
  startTime?: Date;
  endTime?: Date;
  settings: GameSettings;
  results?: GameResult[];
}

export interface GameSettings {
  tournamentType?: 'single_elimination' | 'double_elimination' | 'round_robin';
  maxRounds?: number;
  timeLimit?: number;
  weightClass?: string;
  allowSubstitutions?: boolean;
  spectatorMode?: boolean;
  bettingEnabled?: boolean;
}

export interface GameResult {
  playerId: string;
  position: number;
  score: number;
  earnings: number;
  experience: number;
  achievements: string[];
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  status: 'registration' | 'active' | 'completed';
  startDate: Date;
  endDate: Date;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  currentParticipants: number;
  participants: TournamentParticipant[];
  brackets?: TournamentBracket[];
  rules: TournamentRules;
}

export interface TournamentParticipant {
  userId: string;
  username: string;
  rank: number;
  joinDate: Date;
  status: 'registered' | 'active' | 'eliminated' | 'winner';
  currentMatch?: string;
}

export interface TournamentBracket {
  round: number;
  matches: TournamentMatch[];
}

export interface TournamentMatch {
  id: string;
  player1Id: string;
  player2Id: string;
  winnerId?: string;
  status: 'scheduled' | 'active' | 'completed';
  startTime?: Date;
  endTime?: Date;
  score?: MatchScore;
}

export interface MatchScore {
  player1Score: number;
  player2Score: number;
  rounds: RoundScore[];
}

export interface RoundScore {
  round: number;
  player1Points: number;
  player2Points: number;
  winner?: string;
}

export interface TournamentRules {
  maxRounds: number;
  timeLimit: number;
  weightClass: string;
  allowSubstitutions: boolean;
  tiebreaker: 'sudden_death' | 'judges_decision' | 'coin_flip';
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  rank: number;
  score: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  totalEarnings: number;
  tournamentsWon: number;
  achievements: string[];
  lastActive: Date;
}

export interface SocialFeature {
  id: string;
  type: 'friend_request' | 'challenge' | 'message' | 'achievement' | 'tournament_invite';
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  metadata?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'achievement' | 'tournament';
}

export class MultiplayerEngine {
  private users: Map<string, MultiplayerUser> = new Map();
  private games: Map<string, MultiplayerGame> = new Map();
  private tournaments: Map<string, Tournament> = new Map();
  private leaderboards: Map<string, LeaderboardEntry[]> = new Map();
  private socialFeatures: Map<string, SocialFeature[]> = new Map();
  private chatRooms: Map<string, ChatMessage[]> = new Map();
  
  private eventListeners: Map<string, Function[]> = new Map();
  private connectionStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';

  constructor() {
    this.initializeMockData();
  }

  // Connection Management
  async connect(userId: string, username: string): Promise<boolean> {
    try {
      this.connectionStatus = 'connecting';
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user: MultiplayerUser = {
        id: userId,
        username,
        rank: 1,
        level: 1,
        experience: 0,
        joinDate: new Date(),
        lastActive: new Date(),
        isOnline: true
      };
      
      this.users.set(userId, user);
      this.connectionStatus = 'connected';
      
      this.emit('userConnected', user);
      return true;
    } catch (error) {
      this.connectionStatus = 'disconnected';
      console.error('Failed to connect:', error);
      return false;
    }
  }

  async disconnect(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.isOnline = false;
      user.lastActive = new Date();
      this.emit('userDisconnected', user);
    }
    this.connectionStatus = 'disconnected';
  }

  // Game Management
  async createGame(creatorId: string, gameData: Partial<MultiplayerGame>): Promise<MultiplayerGame> {
    const game: MultiplayerGame = {
      id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: gameData.name || 'New Game',
      type: gameData.type || 'competitive',
      status: 'waiting',
      players: [],
      maxPlayers: gameData.maxPlayers || 2,
      createdBy: creatorId,
      createdAt: new Date(),
      settings: gameData.settings || {}
    };

    this.games.set(game.id, game);
    this.emit('gameCreated', game);
    return game;
  }

  async joinGame(userId: string, gameId: string): Promise<boolean> {
    const game = this.games.get(gameId);
    const user = this.users.get(userId);
    
    if (!game || !user) return false;
    
    if (game.players.length >= game.maxPlayers) return false;
    
    if (game.players.find(p => p.id === userId)) return false;
    
    game.players.push(user);
    this.emit('playerJoined', { game, user });
    
    if (game.players.length >= game.maxPlayers) {
      game.status = 'active';
      game.startTime = new Date();
      this.emit('gameStarted', game);
    }
    
    return true;
  }

  async leaveGame(userId: string, gameId: string): Promise<boolean> {
    const game = this.games.get(gameId);
    if (!game) return false;
    
    game.players = game.players.filter(p => p.id !== userId);
    
    if (game.players.length === 0) {
      game.status = 'cancelled';
      this.emit('gameCancelled', game);
    }
    
    this.emit('playerLeft', { game, userId });
    return true;
  }

  // Tournament Management
  async createTournament(creatorId: string, tournamentData: Partial<Tournament>): Promise<Tournament> {
    const tournament: Tournament = {
      id: `tournament_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: tournamentData.name || 'New Tournament',
      description: tournamentData.description || '',
      type: tournamentData.type || 'weekly',
      status: 'registration',
      startDate: tournamentData.startDate || new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endDate: tournamentData.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      entryFee: tournamentData.entryFee || 0,
      prizePool: tournamentData.prizePool || 1000,
      maxParticipants: tournamentData.maxParticipants || 16,
      currentParticipants: 0,
      participants: [],
      rules: tournamentData.rules || {
        maxRounds: 12,
        timeLimit: 180,
        weightClass: 'open',
        allowSubstitutions: false,
        tiebreaker: 'judges_decision'
      }
    };

    this.tournaments.set(tournament.id, tournament);
    this.emit('tournamentCreated', tournament);
    return tournament;
  }

  async joinTournament(userId: string, tournamentId: string): Promise<boolean> {
    const tournament = this.tournaments.get(tournamentId);
    const user = this.users.get(userId);
    
    if (!tournament || !user) return false;
    
    if (tournament.currentParticipants >= tournament.maxParticipants) return false;
    
    if (tournament.participants.find(p => p.userId === userId)) return false;
    
    const participant: TournamentParticipant = {
      userId,
      username: user.username,
      rank: user.rank,
      joinDate: new Date(),
      status: 'registered'
    };
    
    tournament.participants.push(participant);
    tournament.currentParticipants++;
    
    this.emit('tournamentJoined', { tournament, participant });
    
    if (tournament.currentParticipants >= tournament.maxParticipants) {
      tournament.status = 'active';
      this.generateTournamentBrackets(tournament);
      this.emit('tournamentStarted', tournament);
    }
    
    return true;
  }

  private generateTournamentBrackets(tournament: Tournament): void {
    const participants = [...tournament.participants];
    const brackets: TournamentBracket[] = [];
    
    // Simple single elimination bracket generation
    const rounds = Math.ceil(Math.log2(participants.length));
    
    for (let round = 1; round <= rounds; round++) {
      const matches: TournamentMatch[] = [];
      const roundParticipants = round === 1 ? participants : [];
      
      if (round === 1) {
        // First round - pair participants
        for (let i = 0; i < participants.length; i += 2) {
          if (i + 1 < participants.length) {
            matches.push({
              id: `match_${tournament.id}_${round}_${i/2}`,
              player1Id: participants[i].userId,
              player2Id: participants[i + 1].userId,
              status: 'scheduled'
            });
          }
        }
      }
      
      brackets.push({ round, matches });
    }
    
    tournament.brackets = brackets;
  }

  // Leaderboard Management
  async updateLeaderboard(userId: string, gameResult: GameResult): Promise<void> {
    let leaderboard = this.leaderboards.get('global') || [];
    
    let entry = leaderboard.find(e => e.userId === userId);
    if (!entry) {
      const user = this.users.get(userId);
      if (!user) return;
      
      entry = {
        userId,
        username: user.username,
        rank: leaderboard.length + 1,
        score: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        totalEarnings: 0,
        tournamentsWon: 0,
        achievements: [],
        lastActive: new Date()
      };
      leaderboard.push(entry);
    }
    
    // Update stats based on game result
    if (gameResult.position === 1) {
      entry.wins++;
    } else if (gameResult.position === 2) {
      entry.losses++;
    } else {
      entry.draws++;
    }
    
    entry.score += gameResult.score;
    entry.totalEarnings += gameResult.earnings;
    entry.winRate = (entry.wins / (entry.wins + entry.losses + entry.draws)) * 100;
    entry.lastActive = new Date();
    
    // Add achievements
    entry.achievements.push(...gameResult.achievements);
    
    // Re-sort leaderboard
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    
    this.leaderboards.set('global', leaderboard);
    this.emit('leaderboardUpdated', leaderboard);
  }

  // Social Features
  async sendFriendRequest(fromUserId: string, toUserId: string): Promise<boolean> {
    const fromUser = this.users.get(fromUserId);
    const toUser = this.users.get(toUserId);
    
    if (!fromUser || !toUser) return false;
    
    const request: SocialFeature = {
      id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'friend_request',
      fromUserId,
      toUserId,
      content: `${fromUser.username} wants to be your friend`,
      timestamp: new Date(),
      status: 'pending'
    };
    
    let userRequests = this.socialFeatures.get(toUserId) || [];
    userRequests.push(request);
    this.socialFeatures.set(toUserId, userRequests);
    
    this.emit('friendRequestSent', request);
    return true;
  }

  async sendChallenge(fromUserId: string, toUserId: string, gameType: string): Promise<boolean> {
    const fromUser = this.users.get(fromUserId);
    const toUser = this.users.get(toUserId);
    
    if (!fromUser || !toUser) return false;
    
    const challenge: SocialFeature = {
      id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'challenge',
      fromUserId,
      toUserId,
      content: `${fromUser.username} has challenged you to a ${gameType} match!`,
      timestamp: new Date(),
      status: 'pending',
      metadata: { gameType }
    };
    
    let userRequests = this.socialFeatures.get(toUserId) || [];
    userRequests.push(challenge);
    this.socialFeatures.set(toUserId, userRequests);
    
    this.emit('challengeSent', challenge);
    return true;
  }

  // Chat System
  async sendMessage(roomId: string, userId: string, message: string): Promise<boolean> {
    const user = this.users.get(userId);
    if (!user) return false;
    
    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      roomId,
      userId,
      username: user.username,
      message,
      timestamp: new Date(),
      type: 'text'
    };
    
    let roomMessages = this.chatRooms.get(roomId) || [];
    roomMessages.push(chatMessage);
    this.chatRooms.set(roomId, roomMessages);
    
    this.emit('messageSent', chatMessage);
    return true;
  }

  // Event System
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Getters
  getConnectionStatus(): string {
    return this.connectionStatus;
  }

  getUsers(): MultiplayerUser[] {
    return Array.from(this.users.values());
  }

  getGames(): MultiplayerGame[] {
    return Array.from(this.games.values());
  }

  getTournaments(): Tournament[] {
    return Array.from(this.tournaments.values());
  }

  getLeaderboard(type: string = 'global'): LeaderboardEntry[] {
    return this.leaderboards.get(type) || [];
  }

  getSocialFeatures(userId: string): SocialFeature[] {
    return this.socialFeatures.get(userId) || [];
  }

  getChatMessages(roomId: string): ChatMessage[] {
    return this.chatRooms.get(roomId) || [];
  }

  // Mock Data Initialization
  private initializeMockData(): void {
    // Mock users
    const mockUsers: MultiplayerUser[] = [
      {
        id: 'user1',
        username: 'ChampionBoxer',
        rank: 1,
        level: 25,
        experience: 15000,
        joinDate: new Date('2024-01-01'),
        lastActive: new Date(),
        isOnline: true
      },
      {
        id: 'user2',
        username: 'RingMaster',
        rank: 2,
        level: 20,
        experience: 12000,
        joinDate: new Date('2024-01-15'),
        lastActive: new Date(),
        isOnline: true
      },
      {
        id: 'user3',
        username: 'HeavyHitter',
        rank: 3,
        level: 18,
        experience: 10000,
        joinDate: new Date('2024-02-01'),
        lastActive: new Date(),
        isOnline: false
      }
    ];

    mockUsers.forEach(user => this.users.set(user.id, user));

    // Mock leaderboard
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        userId: 'user1',
        username: 'ChampionBoxer',
        rank: 1,
        score: 2500,
        wins: 45,
        losses: 5,
        draws: 2,
        winRate: 86.5,
        totalEarnings: 150000,
        tournamentsWon: 8,
        achievements: ['First Win', 'Tournament Champion', 'Win Streak'],
        lastActive: new Date()
      },
      {
        userId: 'user2',
        username: 'RingMaster',
        rank: 2,
        score: 2200,
        wins: 38,
        losses: 12,
        draws: 3,
        winRate: 71.7,
        totalEarnings: 120000,
        tournamentsWon: 5,
        achievements: ['Tournament Champion', 'Comeback King'],
        lastActive: new Date()
      },
      {
        userId: 'user3',
        username: 'HeavyHitter',
        rank: 3,
        score: 1900,
        wins: 32,
        losses: 18,
        draws: 4,
        winRate: 59.3,
        totalEarnings: 95000,
        tournamentsWon: 3,
        achievements: ['First Win', 'Heavy Hitter'],
        lastActive: new Date()
      }
    ];

    this.leaderboards.set('global', mockLeaderboard);

    // Mock tournaments
    const mockTournament: Tournament = {
      id: 'tournament1',
      name: 'Weekly Championship',
      description: 'Weekly tournament for all weight classes',
      type: 'weekly',
      status: 'registration',
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      entryFee: 100,
      prizePool: 5000,
      maxParticipants: 16,
      currentParticipants: 8,
      participants: mockUsers.slice(0, 2).map(user => ({
        userId: user.id,
        username: user.username,
        rank: user.rank,
        joinDate: new Date(),
        status: 'registered' as const
      })),
      rules: {
        maxRounds: 12,
        timeLimit: 180,
        weightClass: 'open',
        allowSubstitutions: false,
        tiebreaker: 'judges_decision'
      }
    };

    this.tournaments.set('tournament1', mockTournament);
  }
}

// Export singleton instance
export const multiplayerEngine = new MultiplayerEngine(); 