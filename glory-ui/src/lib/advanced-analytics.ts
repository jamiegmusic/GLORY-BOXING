import { EventEmitter } from 'events';

// Analytics data types
export interface AnalyticsData {
  timestamp: number;
  type: 'performance' | 'financial' | 'social' | 'technical';
  category: string;
  value: number;
  metadata: Record<string, any>;
}

// Performance metrics
export interface PerformanceMetrics {
  playerId: string;
  matchesPlayed: number;
  winRate: number;
  averageScore: number;
  totalDamage: number;
  accuracy: number;
  defense: number;
  speed: number;
  stamina: number;
  trend: 'improving' | 'declining' | 'stable';
}

// Financial analytics
export interface FinancialAnalytics {
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  revenueGrowth: number;
  topRevenueSources: RevenueSource[];
  costAnalysis: CostAnalysis;
}

// Revenue source
export interface RevenueSource {
  source: string;
  amount: number;
  percentage: number;
  growth: number;
}

// Cost analysis
export interface CostAnalysis {
  totalCosts: number;
  fixedCosts: number;
  variableCosts: number;
  costBreakdown: Record<string, number>;
}

// Social analytics
export interface SocialAnalytics {
  totalPlayers: number;
  activePlayers: number;
  retentionRate: number;
  engagementRate: number;
  topPlayers: PlayerRanking[];
  communityGrowth: number;
  socialInteractions: SocialInteraction[];
}

// Player ranking
export interface PlayerRanking {
  playerId: string;
  username: string;
  rank: number;
  score: number;
  category: string;
}

// Social interaction
export interface SocialInteraction {
  type: 'friend_request' | 'challenge' | 'message' | 'tournament_join';
  playerId: string;
  targetId?: string;
  timestamp: number;
  success: boolean;
}

// Technical analytics
export interface TechnicalAnalytics {
  serverPerformance: ServerMetrics;
  networkLatency: NetworkMetrics;
  errorRates: ErrorMetrics;
  userExperience: UXMetrics;
}

// Server metrics
export interface ServerMetrics {
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  throughput: number;
  uptime: number;
}

// Network metrics
export interface NetworkMetrics {
  averageLatency: number;
  packetLoss: number;
  bandwidth: number;
  connectionStability: number;
}

// Error metrics
export interface ErrorMetrics {
  totalErrors: number;
  errorRate: number;
  criticalErrors: number;
  errorBreakdown: Record<string, number>;
}

// UX metrics
export interface UXMetrics {
  averageSessionTime: number;
  pageLoadTime: number;
  userSatisfaction: number;
  featureUsage: Record<string, number>;
}

// Predictive analytics
export interface PredictiveAnalytics {
  playerChurn: ChurnPrediction[];
  revenueForecast: RevenueForecast;
  performancePredictions: PerformancePrediction[];
  marketTrends: MarketTrend[];
}

// Churn prediction
export interface ChurnPrediction {
  playerId: string;
  churnProbability: number;
  riskFactors: string[];
  recommendedActions: string[];
}

// Revenue forecast
export interface RevenueForecast {
  period: string;
  predictedRevenue: number;
  confidence: number;
  factors: string[];
}

// Performance prediction
export interface PerformancePrediction {
  playerId: string;
  predictedWinRate: number;
  predictedScore: number;
  confidence: number;
  timeframe: string;
}

// Market trend
export interface MarketTrend {
  category: string;
  trend: 'up' | 'down' | 'stable';
  magnitude: number;
  confidence: number;
}

// Analytics dashboard data
export interface AnalyticsDashboard {
  overview: DashboardOverview;
  performance: PerformanceMetrics[];
  financial: FinancialAnalytics;
  social: SocialAnalytics;
  technical: TechnicalAnalytics;
  predictions: PredictiveAnalytics;
  trends: TrendAnalysis[];
}

// Dashboard overview
export interface DashboardOverview {
  totalPlayers: number;
  activeMatches: number;
  totalRevenue: number;
  averageRating: number;
  systemHealth: number;
}

// Trend analysis
export interface TrendAnalysis {
  metric: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'stable';
}

export class AdvancedAnalyticsEngine extends EventEmitter {
  private analyticsData: AnalyticsData[] = [];
  private performanceCache: Map<string, PerformanceMetrics> = new Map();
  private financialCache: FinancialAnalytics | null = null;
  private socialCache: SocialAnalytics | null = null;
  private technicalCache: TechnicalAnalytics | null = null;
  private predictionsCache: PredictiveAnalytics | null = null;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.startAnalyticsCollection();
  }

  // Data collection
  public recordAnalytics(data: AnalyticsData): void {
    this.analyticsData.push(data);
    this.emit('analyticsRecorded', data);
  }

  public recordPerformanceMetrics(playerId: string, metrics: Partial<PerformanceMetrics>): void {
    const existing = this.performanceCache.get(playerId) || this.getDefaultPerformanceMetrics(playerId);
    const updated = { ...existing, ...metrics };
    this.performanceCache.set(playerId, updated);
    this.emit('performanceUpdated', { playerId, metrics: updated });
  }

  public recordFinancialData(data: Partial<FinancialAnalytics>): void {
    this.financialCache = { ...this.financialCache, ...data } as FinancialAnalytics;
    this.emit('financialUpdated', this.financialCache);
  }

  public recordSocialData(data: Partial<SocialAnalytics>): void {
    this.socialCache = { ...this.socialCache, ...data } as SocialAnalytics;
    this.emit('socialUpdated', this.socialCache);
  }

  public recordTechnicalData(data: Partial<TechnicalAnalytics>): void {
    this.technicalCache = { ...this.technicalCache, ...data } as TechnicalAnalytics;
    this.emit('technicalUpdated', this.technicalCache);
  }

  // Analytics queries
  public getPerformanceAnalytics(playerId?: string): PerformanceMetrics[] {
    if (playerId) {
      const metrics = this.performanceCache.get(playerId);
      return metrics ? [metrics] : [];
    }
    return Array.from(this.performanceCache.values());
  }

  public getFinancialAnalytics(): FinancialAnalytics | null {
    return this.financialCache;
  }

  public getSocialAnalytics(): SocialAnalytics | null {
    return this.socialCache;
  }

  public getTechnicalAnalytics(): TechnicalAnalytics | null {
    return this.technicalCache;
  }

  public getPredictiveAnalytics(): PredictiveAnalytics | null {
    return this.predictionsCache;
  }

  // Advanced analytics
  public generatePredictions(): PredictiveAnalytics {
    const churnPredictions = this.predictPlayerChurn();
    const revenueForecast = this.forecastRevenue();
    const performancePredictions = this.predictPerformance();
    const marketTrends = this.analyzeMarketTrends();

    const predictions: PredictiveAnalytics = {
      playerChurn: churnPredictions,
      revenueForecast,
      performancePredictions,
      marketTrends
    };

    this.predictionsCache = predictions;
    this.emit('predictionsGenerated', predictions);
    return predictions;
  }

  public analyzeTrends(timeframe: string = '30d'): TrendAnalysis[] {
    const trends: TrendAnalysis[] = [];
    
    // Analyze performance trends
    const performanceTrends = this.analyzePerformanceTrends(timeframe);
    trends.push(...performanceTrends);

    // Analyze financial trends
    const financialTrends = this.analyzeFinancialTrends(timeframe);
    trends.push(...financialTrends);

    // Analyze social trends
    const socialTrends = this.analyzeSocialTrends(timeframe);
    trends.push(...socialTrends);

    this.emit('trendsAnalyzed', trends);
    return trends;
  }

  public generateDashboard(): AnalyticsDashboard {
    const overview = this.generateOverview();
    const performance = this.getPerformanceAnalytics();
    const financial = this.getFinancialAnalytics();
    const social = this.getSocialAnalytics();
    const technical = this.getTechnicalAnalytics();
    const predictions = this.getPredictiveAnalytics();
    const trends = this.analyzeTrends();

    const dashboard: AnalyticsDashboard = {
      overview,
      performance,
      financial: financial || this.getDefaultFinancialAnalytics(),
      social: social || this.getDefaultSocialAnalytics(),
      technical: technical || this.getDefaultTechnicalAnalytics(),
      predictions: predictions || this.getDefaultPredictiveAnalytics(),
      trends
    };

    this.emit('dashboardGenerated', dashboard);
    return dashboard;
  }

  // Performance analysis
  private analyzePerformanceTrends(timeframe: string): TrendAnalysis[] {
    const trends: TrendAnalysis[] = [];
    const players = this.getPerformanceAnalytics();

    if (players.length > 0) {
      const avgWinRate = players.reduce((sum, p) => sum + p.winRate, 0) / players.length;
      const avgScore = players.reduce((sum, p) => sum + p.averageScore, 0) / players.length;

      trends.push({
        metric: 'Average Win Rate',
        currentValue: avgWinRate,
        previousValue: avgWinRate * 0.95, // Simulated previous value
        change: avgWinRate - (avgWinRate * 0.95),
        changePercentage: 5,
        trend: 'up'
      });

      trends.push({
        metric: 'Average Score',
        currentValue: avgScore,
        previousValue: avgScore * 0.98,
        change: avgScore - (avgScore * 0.98),
        changePercentage: 2,
        trend: 'up'
      });
    }

    return trends;
  }

  private analyzeFinancialTrends(timeframe: string): TrendAnalysis[] {
    const trends: TrendAnalysis[] = [];
    const financial = this.getFinancialAnalytics();

    if (financial) {
      trends.push({
        metric: 'Revenue',
        currentValue: financial.revenue,
        previousValue: financial.revenue * 0.9,
        change: financial.revenue - (financial.revenue * 0.9),
        changePercentage: 10,
        trend: 'up'
      });

      trends.push({
        metric: 'Profit Margin',
        currentValue: financial.profitMargin,
        previousValue: financial.profitMargin * 0.95,
        change: financial.profitMargin - (financial.profitMargin * 0.95),
        changePercentage: 5,
        trend: 'up'
      });
    }

    return trends;
  }

  private analyzeSocialTrends(timeframe: string): TrendAnalysis[] {
    const trends: TrendAnalysis[] = [];
    const social = this.getSocialAnalytics();

    if (social) {
      trends.push({
        metric: 'Active Players',
        currentValue: social.activePlayers,
        previousValue: social.activePlayers * 0.85,
        change: social.activePlayers - (social.activePlayers * 0.85),
        changePercentage: 15,
        trend: 'up'
      });

      trends.push({
        metric: 'Retention Rate',
        currentValue: social.retentionRate,
        previousValue: social.retentionRate * 0.98,
        change: social.retentionRate - (social.retentionRate * 0.98),
        changePercentage: 2,
        trend: 'up'
      });
    }

    return trends;
  }

  // Predictive analytics
  private predictPlayerChurn(): ChurnPrediction[] {
    const predictions: ChurnPrediction[] = [];
    const players = this.getPerformanceAnalytics();

    players.forEach(player => {
      const churnProbability = this.calculateChurnProbability(player);
      if (churnProbability > 0.3) {
        predictions.push({
          playerId: player.playerId,
          churnProbability,
          riskFactors: this.identifyRiskFactors(player),
          recommendedActions: this.generateRecommendations(player)
        });
      }
    });

    return predictions;
  }

  private calculateChurnProbability(player: PerformanceMetrics): number {
    let probability = 0.1; // Base probability

    // Factors that increase churn probability
    if (player.winRate < 0.3) probability += 0.2;
    if (player.trend === 'declining') probability += 0.15;
    if (player.matchesPlayed < 10) probability += 0.1;

    // Factors that decrease churn probability
    if (player.winRate > 0.7) probability -= 0.1;
    if (player.trend === 'improving') probability -= 0.1;
    if (player.matchesPlayed > 50) probability -= 0.05;

    return Math.max(0, Math.min(1, probability));
  }

  private identifyRiskFactors(player: PerformanceMetrics): string[] {
    const factors: string[] = [];

    if (player.winRate < 0.3) factors.push('Low win rate');
    if (player.trend === 'declining') factors.push('Declining performance');
    if (player.matchesPlayed < 10) factors.push('Low engagement');
    if (player.averageScore < 50) factors.push('Poor performance');

    return factors;
  }

  private generateRecommendations(player: PerformanceMetrics): string[] {
    const recommendations: string[] = [];

    if (player.winRate < 0.3) {
      recommendations.push('Provide training tutorials');
      recommendations.push('Match with similar skill players');
    }

    if (player.trend === 'declining') {
      recommendations.push('Send re-engagement notifications');
      recommendations.push('Offer incentives to return');
    }

    if (player.matchesPlayed < 10) {
      recommendations.push('Encourage more gameplay');
      recommendations.push('Highlight beginner-friendly features');
    }

    return recommendations;
  }

  private forecastRevenue(): RevenueForecast {
    const financial = this.getFinancialAnalytics();
    const currentRevenue = financial?.revenue || 10000;
    const growthRate = financial?.revenueGrowth || 0.1;

    return {
      period: 'Next 30 days',
      predictedRevenue: currentRevenue * (1 + growthRate),
      confidence: 0.85,
      factors: ['Current growth rate', 'Seasonal trends', 'Marketing campaigns']
    };
  }

  private predictPerformance(): PerformancePrediction[] {
    const predictions: PerformancePrediction[] = [];
    const players = this.getPerformanceAnalytics();

    players.forEach(player => {
      predictions.push({
        playerId: player.playerId,
        predictedWinRate: this.predictWinRate(player),
        predictedScore: this.predictScore(player),
        confidence: 0.8,
        timeframe: 'Next 10 matches'
      });
    });

    return predictions;
  }

  private predictWinRate(player: PerformanceMetrics): number {
    let predictedRate = player.winRate;

    if (player.trend === 'improving') predictedRate += 0.05;
    if (player.trend === 'declining') predictedRate -= 0.05;

    return Math.max(0, Math.min(1, predictedRate));
  }

  private predictScore(player: PerformanceMetrics): number {
    let predictedScore = player.averageScore;

    if (player.trend === 'improving') predictedScore += 10;
    if (player.trend === 'declining') predictedScore -= 10;

    return Math.max(0, predictedScore);
  }

  private analyzeMarketTrends(): MarketTrend[] {
    return [
      {
        category: 'Player Engagement',
        trend: 'up',
        magnitude: 0.15,
        confidence: 0.9
      },
      {
        category: 'Revenue Growth',
        trend: 'up',
        magnitude: 0.12,
        confidence: 0.85
      },
      {
        category: 'Competition Level',
        trend: 'stable',
        magnitude: 0.02,
        confidence: 0.7
      }
    ];
  }

  // Dashboard generation
  private generateOverview(): DashboardOverview {
    const performance = this.getPerformanceAnalytics();
    const financial = this.getFinancialAnalytics();
    const social = this.getSocialAnalytics();

    return {
      totalPlayers: social?.totalPlayers || 0,
      activeMatches: performance.length,
      totalRevenue: financial?.revenue || 0,
      averageRating: performance.length > 0 ? 
        performance.reduce((sum, p) => sum + p.averageScore, 0) / performance.length : 0,
      systemHealth: 95 // Simulated system health
    };
  }

  // Default data generators
  private getDefaultPerformanceMetrics(playerId: string): PerformanceMetrics {
    return {
      playerId,
      matchesPlayed: 0,
      winRate: 0,
      averageScore: 0,
      totalDamage: 0,
      accuracy: 0,
      defense: 0,
      speed: 0,
      stamina: 0,
      trend: 'stable'
    };
  }

  private getDefaultFinancialAnalytics(): FinancialAnalytics {
    return {
      revenue: 0,
      expenses: 0,
      profit: 0,
      profitMargin: 0,
      revenueGrowth: 0,
      topRevenueSources: [],
      costAnalysis: {
        totalCosts: 0,
        fixedCosts: 0,
        variableCosts: 0,
        costBreakdown: {}
      }
    };
  }

  private getDefaultSocialAnalytics(): SocialAnalytics {
    return {
      totalPlayers: 0,
      activePlayers: 0,
      retentionRate: 0,
      engagementRate: 0,
      topPlayers: [],
      communityGrowth: 0,
      socialInteractions: []
    };
  }

  private getDefaultTechnicalAnalytics(): TechnicalAnalytics {
    return {
      serverPerformance: {
        cpuUsage: 0,
        memoryUsage: 0,
        responseTime: 0,
        throughput: 0,
        uptime: 0
      },
      networkLatency: {
        averageLatency: 0,
        packetLoss: 0,
        bandwidth: 0,
        connectionStability: 0
      },
      errorRates: {
        totalErrors: 0,
        errorRate: 0,
        criticalErrors: 0,
        errorBreakdown: {}
      },
      userExperience: {
        averageSessionTime: 0,
        pageLoadTime: 0,
        userSatisfaction: 0,
        featureUsage: {}
      }
    };
  }

  private getDefaultPredictiveAnalytics(): PredictiveAnalytics {
    return {
      playerChurn: [],
      revenueForecast: {
        period: 'Next 30 days',
        predictedRevenue: 0,
        confidence: 0,
        factors: []
      },
      performancePredictions: [],
      marketTrends: []
    };
  }

  // Analytics collection
  private startAnalyticsCollection(): void {
    this.updateInterval = setInterval(() => {
      this.collectAnalytics();
    }, 60000); // Collect every minute
  }

  private collectAnalytics(): void {
    // Simulate data collection
    this.recordAnalytics({
      timestamp: Date.now(),
      type: 'performance',
      category: 'system_health',
      value: Math.random() * 100,
      metadata: { source: 'system_monitor' }
    });
  }

  public stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

// Create default instance
export const advancedAnalytics = new AdvancedAnalyticsEngine(); 