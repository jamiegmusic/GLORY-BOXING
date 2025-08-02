import type { 
  Celebrity, 
  CelebrityIndustryValue,
  SocialMediaPost,
  ReputationEvent,
  FinancialPortfolio,
  EndorsementDeal,
  MediaInterview
} from './unified-types';

// AI Profile Types for Celebrity Management
export interface AICelebrityProfile {
  id: string;
  name: string;
  description: string;
  characteristics: AICelebrityCharacteristics;
  dreamLogicAwareness: number; // 0-100, how much the AI understands dream logic
  eraAdaptation: number; // 0-100, how well it adapts to different eras
  narrativeCoherence: number; // 0-100, how well it maintains story consistency
}

export interface AICelebrityCharacteristics {
  socialMediaStrategy: number; // 0-100, social media management effectiveness
  reputationManagement: number; // 0-100, reputation crisis handling
  financialAcumen: number; // 0-100, investment and financial decisions
  networkingAbility: number; // 0-100, industry relationship building
  contentCreation: number; // 0-100, AI content generation quality
  crisisManagement: number; // 0-100, handling scandals and controversies
  careerPlanning: number; // 0-100, long-term career strategy
  brandBuilding: number; // 0-100, personal brand development
}

export interface BenchmarkConfig {
  profiles: string[];
  celebrities: Celebrity[];
  duration: number; // Days to simulate
  scenarios: BenchmarkScenario[];
  metrics: BenchmarkMetric[];
}

export interface BenchmarkScenario {
  id: string;
  name: string;
  description: string;
  celebrityProfile: Partial<Celebrity>;
  events: BenchmarkEvent[];
  expectedOutcomes: ExpectedOutcome[];
}

export interface BenchmarkEvent {
  type: 'scandal' | 'achievement' | 'opportunity' | 'crisis' | 'milestone';
  description: string;
  impact: number; // -100 to +100
  probability: number; // 0-1
  day: number; // When it occurs
}

export interface ExpectedOutcome {
  metric: string;
  minValue: number;
  maxValue: number;
  weight: number; // 0-1, importance for overall score
}

export interface BenchmarkMetric {
  name: string;
  description: string;
  calculation: (data: BenchmarkData) => number;
  weight: number; // 0-1, importance for overall score
}

export interface BenchmarkData {
  celebrity: Celebrity;
  socialPosts: SocialMediaPost[];
  reputationEvents: ReputationEvent[];
  financialPortfolio: FinancialPortfolio | null;
  endorsementDeals: EndorsementDeal[];
  mediaInterviews: MediaInterview[];
  dreamTriggers: DreamTrigger[];
  careerMilestones: any[];
}

export interface DreamTrigger {
  id: string;
  type: 'prophecy' | 'reality_distortion' | 'narrative_hook' | 'temporal_shift';
  description: string;
  impact: number; // -100 to +100
  awarenessLevel: number; // 0-100
  narrativeWeight: number; // 0-1
}

export interface BenchmarkResult {
  profileId: string;
  celebrityId: string;
  scenarioId: string;
  totalScore: number;
  metrics: Record<string, number>;
  dreamTriggerCount: number;
  dreamTriggerSuccess: number;
  narrativeCoherence: number;
  careerProgression: number;
  reputationStability: number;
  financialGrowth: number;
  socialMediaEngagement: number;
  networkExpansion: number;
  crisisHandling: number;
  brandValue: number;
  created_at: Date;
}

// AI Profiles for Celebrity Management
export const AI_CELEBRITY_PROFILES: AICelebrityProfile[] = [
  {
    id: 'defensive_mastermind',
    name: 'Defensive Mastermind',
    description: 'Conservative, risk-averse celebrity manager focused on reputation protection and steady growth',
    characteristics: {
      socialMediaStrategy: 65,
      reputationManagement: 90,
      financialAcumen: 75,
      networkingAbility: 60,
      contentCreation: 50,
      crisisManagement: 95,
      careerPlanning: 80,
      brandBuilding: 70
    },
    dreamLogicAwareness: 20,
    eraAdaptation: 70,
    narrativeCoherence: 60
  },
  {
    id: 'aggressive_showman',
    name: 'Aggressive Showman',
    description: 'High-risk, high-reward manager focused on viral moments and rapid fame building',
    characteristics: {
      socialMediaStrategy: 90,
      reputationManagement: 40,
      financialAcumen: 60,
      networkingAbility: 85,
      contentCreation: 95,
      crisisManagement: 30,
      careerPlanning: 70,
      brandBuilding: 90
    },
    dreamLogicAwareness: 30,
    eraAdaptation: 85,
    narrativeCoherence: 75
  },
  {
    id: 'opportunistic_tactician',
    name: 'Opportunistic Tactician',
    description: 'Adaptive manager who capitalizes on trends and opportunities as they arise',
    characteristics: {
      socialMediaStrategy: 75,
      reputationManagement: 70,
      financialAcumen: 80,
      networkingAbility: 75,
      contentCreation: 70,
      crisisManagement: 65,
      careerPlanning: 85,
      brandBuilding: 75
    },
    dreamLogicAwareness: 50,
    eraAdaptation: 90,
    narrativeCoherence: 80
  },
  {
    id: 'dream_manipulator',
    name: 'Dream Manipulator',
    description: 'Mysterious manager who understands the dream logic of celebrity culture and can manipulate reality',
    characteristics: {
      socialMediaStrategy: 85,
      reputationManagement: 80,
      financialAcumen: 70,
      networkingAbility: 90,
      contentCreation: 90,
      crisisManagement: 85,
      careerPlanning: 95,
      brandBuilding: 95
    },
    dreamLogicAwareness: 100,
    eraAdaptation: 95,
    narrativeCoherence: 100
  }
];

// Benchmark Scenarios
export const BENCHMARK_SCENARIOS: BenchmarkScenario[] = [
  {
    id: 'rising_star',
    name: 'Rising Star',
    description: 'Manage a young celebrity with high potential but limited experience',
    celebrityProfile: {
      age: 22,
      popularity: 30,
      experience: 20,
      fan_base_size: 50000,
      net_worth: 100000
    },
    events: [
      {
        type: 'opportunity',
        description: 'Major movie role offer',
        impact: 50,
        probability: 0.7,
        day: 30
      },
      {
        type: 'scandal',
        description: 'Social media controversy',
        impact: -30,
        probability: 0.4,
        day: 45
      },
      {
        type: 'achievement',
        description: 'Award nomination',
        impact: 40,
        probability: 0.6,
        day: 90
      }
    ],
    expectedOutcomes: [
      { metric: 'popularity', minValue: 60, maxValue: 90, weight: 0.3 },
      { metric: 'net_worth', minValue: 500000, maxValue: 2000000, weight: 0.3 },
      { metric: 'reputation_stability', minValue: 70, maxValue: 95, weight: 0.2 },
      { metric: 'social_media_engagement', minValue: 200000, maxValue: 1000000, weight: 0.2 }
    ]
  },
  {
    id: 'established_celebrity',
    name: 'Established Celebrity',
    description: 'Manage a well-known celebrity with established career and high expectations',
    celebrityProfile: {
      age: 35,
      popularity: 75,
      experience: 80,
      fan_base_size: 5000000,
      net_worth: 10000000
    },
    events: [
      {
        type: 'crisis',
        description: 'Major scandal involving past behavior',
        impact: -60,
        probability: 0.3,
        day: 20
      },
      {
        type: 'opportunity',
        description: 'International brand deal',
        impact: 70,
        probability: 0.8,
        day: 60
      },
      {
        type: 'milestone',
        description: 'Career retrospective documentary',
        impact: 30,
        probability: 0.9,
        day: 120
      }
    ],
    expectedOutcomes: [
      { metric: 'reputation_stability', minValue: 80, maxValue: 95, weight: 0.3 },
      { metric: 'net_worth', minValue: 15000000, maxValue: 30000000, weight: 0.3 },
      { metric: 'brand_value', minValue: 85, maxValue: 95, weight: 0.2 },
      { metric: 'career_progression', minValue: 80, maxValue: 95, weight: 0.2 }
    ]
  },
  {
    id: 'comeback_artist',
    name: 'Comeback Artist',
    description: 'Manage a celebrity attempting to rebuild their career after a major setback',
    celebrityProfile: {
      age: 40,
      popularity: 25,
      experience: 70,
      fan_base_size: 200000,
      net_worth: 500000,
      media_sentiment: 'negative'
    },
    events: [
      {
        type: 'crisis',
        description: 'Continued negative media coverage',
        impact: -40,
        probability: 0.6,
        day: 15
      },
      {
        type: 'opportunity',
        description: 'Redemption story opportunity',
        impact: 80,
        probability: 0.5,
        day: 60
      },
      {
        type: 'achievement',
        description: 'Successful comeback project',
        impact: 90,
        probability: 0.4,
        day: 90
      }
    ],
    expectedOutcomes: [
      { metric: 'reputation_stability', minValue: 60, maxValue: 85, weight: 0.4 },
      { metric: 'popularity', minValue: 40, maxValue: 70, weight: 0.3 },
      { metric: 'net_worth', minValue: 1000000, maxValue: 5000000, weight: 0.2 },
      { metric: 'media_sentiment', minValue: 60, maxValue: 85, weight: 0.1 }
    ]
  }
];

// Benchmark Metrics
export const BENCHMARK_METRICS: BenchmarkMetric[] = [
  {
    name: 'popularity_growth',
    description: 'Percentage increase in celebrity popularity',
    calculation: (data) => {
      const initialPopularity = data.celebrity.popularity || 0;
      const finalPopularity = data.celebrity.popularity || 0;
      return ((finalPopularity - initialPopularity) / Math.max(1, initialPopularity)) * 100;
    },
    weight: 0.2
  },
  {
    name: 'net_worth_growth',
    description: 'Percentage increase in net worth',
    calculation: (data) => {
      const initialNetWorth = data.celebrity.net_worth || 0;
      const finalNetWorth = data.financialPortfolio?.net_worth || initialNetWorth;
      return ((finalNetWorth - initialNetWorth) / Math.max(1, initialNetWorth)) * 100;
    },
    weight: 0.2
  },
  {
    name: 'reputation_stability',
    description: 'Average reputation score throughout simulation',
    calculation: (data) => {
      const events = data.reputationEvents;
      if (events.length === 0) return 100;
      
      const totalImpact = events.reduce((sum, event) => sum + event.impact_score, 0);
      const averageImpact = totalImpact / events.length;
      return Math.max(0, Math.min(100, 50 + averageImpact));
    },
    weight: 0.2
  },
  {
    name: 'social_media_engagement',
    description: 'Total social media engagement across all platforms',
    calculation: (data) => {
      return data.socialPosts.reduce((sum, post) => 
        sum + post.engagement.likes + post.engagement.comments + post.engagement.shares, 0
      );
    },
    weight: 0.15
  },
  {
    name: 'dream_trigger_success',
    description: 'Percentage of successful dream triggers',
    calculation: (data) => {
      if (data.dreamTriggers.length === 0) return 0;
      const successfulTriggers = data.dreamTriggers.filter(trigger => trigger.impact > 0);
      return (successfulTriggers.length / data.dreamTriggers.length) * 100;
    },
    weight: 0.15
  },
  {
    name: 'career_progression',
    description: 'Overall career advancement score',
    calculation: (data) => {
      const experience = data.celebrity.experience || 0;
      const ranking = data.celebrity.industry_ranking || 100;
      const milestones = data.careerMilestones.length;
      
      return (experience * 0.4) + ((100 - ranking) * 0.4) + (milestones * 10 * 0.2);
    },
    weight: 0.1
  }
];

export class AICelebrityBenchmarkRunner {
  private profiles: Map<string, AICelebrityProfile> = new Map();
  private scenarios: Map<string, BenchmarkScenario> = new Map();
  private results: BenchmarkResult[] = [];

  constructor() {
    // Initialize profiles
    AI_CELEBRITY_PROFILES.forEach(profile => {
      this.profiles.set(profile.id, profile);
    });

    // Initialize scenarios
    BENCHMARK_SCENARIOS.forEach(scenario => {
      this.scenarios.set(scenario.id, scenario);
    });
  }

  async runBenchmark(config: BenchmarkConfig): Promise<BenchmarkResult[]> {
    const results: BenchmarkResult[] = [];

    for (const profileId of config.profiles) {
      const profile = this.profiles.get(profileId);
      if (!profile) continue;

      for (const celebrity of config.celebrities) {
        for (const scenarioId of config.scenarios.map(s => s.id)) {
          const scenario = this.scenarios.get(scenarioId);
          if (!scenario) continue;

          const result = await this.simulateCelebrityManagement(
            profile,
            celebrity,
            scenario,
            config.duration
          );

          results.push(result);
        }
      }
    }

    this.results = results;
    return results;
  }

  private async simulateCelebrityManagement(
    profile: AICelebrityProfile,
    celebrity: Celebrity,
    scenario: BenchmarkScenario,
    duration: number
  ): Promise<BenchmarkResult> {
    // Clone celebrity for simulation
    const simulatedCelebrity = { ...celebrity };
    const socialPosts: SocialMediaPost[] = [];
    const reputationEvents: ReputationEvent[] = [];
    const endorsementDeals: EndorsementDeal[] = [];
    const mediaInterviews: MediaInterview[] = [];
    const dreamTriggers: DreamTrigger[] = [];

    // Simulate each day
    for (let day = 1; day <= duration; day++) {
      // Generate daily events based on AI profile characteristics
      const dailyEvents = this.generateDailyEvents(profile, simulatedCelebrity, day);
      
      // Process events
      for (const event of dailyEvents) {
        if (event.type === 'social_post') {
          socialPosts.push(event.data as SocialMediaPost);
        } else if (event.type === 'reputation_event') {
          reputationEvents.push(event.data as ReputationEvent);
        } else if (event.type === 'dream_trigger') {
          dreamTriggers.push(event.data as DreamTrigger);
        }
      }

      // Update celebrity stats based on AI profile
      this.updateCelebrityStats(profile, simulatedCelebrity, dailyEvents);
    }

    // Calculate metrics
    const metrics = this.calculateMetrics(simulatedCelebrity, {
      celebrity: simulatedCelebrity,
      socialPosts,
      reputationEvents,
      financialPortfolio: null,
      endorsementDeals,
      mediaInterviews,
      dreamTriggers,
      careerMilestones: []
    });

    // Calculate total score
    const totalScore = this.calculateTotalScore(metrics, BENCHMARK_METRICS);

    return {
      profileId: profile.id,
      celebrityId: celebrity.id,
      scenarioId: scenario.id,
      totalScore,
      metrics,
      dreamTriggerCount: dreamTriggers.length,
      dreamTriggerSuccess: dreamTriggers.filter(t => t.impact > 0).length,
      narrativeCoherence: profile.narrativeCoherence,
      careerProgression: metrics.career_progression || 0,
      reputationStability: metrics.reputation_stability || 0,
      financialGrowth: metrics.net_worth_growth || 0,
      socialMediaEngagement: metrics.social_media_engagement || 0,
      networkExpansion: 0, // TODO: Implement network expansion tracking
      crisisHandling: 0, // TODO: Implement crisis handling tracking
      brandValue: 0, // TODO: Implement brand value calculation
      created_at: new Date()
    };
  }

  private generateDailyEvents(
    profile: AICelebrityProfile,
    celebrity: Celebrity,
    day: number
  ): Array<{ type: string; data: any }> {
    const events: Array<{ type: string; data: any }> = [];

    // Social media posts based on profile characteristics
    if (Math.random() < profile.characteristics.socialMediaStrategy / 100) {
      events.push({
        type: 'social_post',
        data: this.generateSocialMediaPost(profile, celebrity, day)
      });
    }

    // Reputation events based on profile characteristics
    if (Math.random() < (100 - profile.characteristics.reputationManagement) / 100) {
      events.push({
        type: 'reputation_event',
        data: this.generateReputationEvent(profile, celebrity, day)
      });
    }

    // Dream triggers based on awareness level
    if (Math.random() < profile.dreamLogicAwareness / 100) {
      events.push({
        type: 'dream_trigger',
        data: this.generateDreamTrigger(profile, celebrity, day)
      });
    }

    return events;
  }

  private generateSocialMediaPost(
    profile: AICelebrityProfile,
    celebrity: Celebrity,
    day: number
  ): SocialMediaPost {
    const platforms: Array<'instagram' | 'twitter' | 'youtube' | 'facebook'> = 
      ['instagram', 'twitter', 'youtube', 'facebook'];
    
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const engagement = Math.floor(Math.random() * profile.characteristics.contentCreation * 100);

    return {
      id: `post_${day}_${Math.random()}`,
      celebrity_id: celebrity.id,
      platform,
      content: `AI-generated content for ${celebrity.name} on day ${day}`,
      media_urls: [],
      hashtags: ['#celebrity', '#ai', '#management'],
      engagement: {
        likes: engagement * 0.7,
        comments: engagement * 0.2,
        shares: engagement * 0.1,
        views: engagement * 2
      },
      reach: engagement * 5,
      viral_score: Math.random() * profile.characteristics.contentCreation / 100,
      posted_at: new Date(Date.now() + day * 24 * 60 * 60 * 1000),
      created_at: new Date()
    };
  }

  private generateReputationEvent(
    profile: AICelebrityProfile,
    celebrity: Celebrity,
    day: number
  ): ReputationEvent {
    const eventTypes: Array<'scandal' | 'achievement' | 'controversy' | 'charity_work'> = 
      ['scandal', 'achievement', 'controversy', 'charity_work'];
    
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const impact = (Math.random() - 0.5) * 100; // -50 to +50

    return {
      id: `event_${day}_${Math.random()}`,
      celebrity_id: celebrity.id,
      event_type: eventType,
      title: `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} on day ${day}`,
      description: `AI-generated ${eventType} event for ${celebrity.name}`,
      impact_score: impact,
      media_coverage: Math.random() * 100,
      public_reaction: impact > 0 ? 'positive' : impact < 0 ? 'negative' : 'neutral',
      industry_impact: [celebrity.primary_industry],
      duration_days: Math.floor(Math.random() * 30) + 1,
      resolved: false,
      occurred_at: new Date(Date.now() + day * 24 * 60 * 60 * 1000),
      created_at: new Date()
    };
  }

  private generateDreamTrigger(
    profile: AICelebrityProfile,
    celebrity: Celebrity,
    day: number
  ): DreamTrigger {
    const triggerTypes: Array<'prophecy' | 'reality_distortion' | 'narrative_hook' | 'temporal_shift'> = 
      ['prophecy', 'reality_distortion', 'narrative_hook', 'temporal_shift'];
    
    const triggerType = triggerTypes[Math.floor(Math.random() * triggerTypes.length)];
    const impact = (Math.random() - 0.3) * 100; // Slightly positive bias

    return {
      id: `dream_${day}_${Math.random()}`,
      type: triggerType,
      description: `${triggerType.replace('_', ' ')} dream trigger for ${celebrity.name}`,
      impact,
      awarenessLevel: profile.dreamLogicAwareness,
      narrativeWeight: profile.narrativeCoherence / 100
    };
  }

  private updateCelebrityStats(
    profile: AICelebrityProfile,
    celebrity: Celebrity,
    events: Array<{ type: string; data: any }>
  ): void {
    // Update popularity based on events
    const popularityChange = events.reduce((change, event) => {
      if (event.type === 'reputation_event') {
        return change + (event.data.impact_score / 10);
      }
      return change;
    }, 0);

    celebrity.popularity = Math.max(0, Math.min(100, (celebrity.popularity || 0) + popularityChange));

    // Update experience
    celebrity.experience = Math.min(100, (celebrity.experience || 0) + 0.5);

    // Update net worth based on financial acumen
    const financialGrowth = profile.characteristics.financialAcumen / 100;
    celebrity.net_worth = (celebrity.net_worth || 0) * (1 + financialGrowth * 0.01);
  }

  private calculateMetrics(celebrity: Celebrity, data: BenchmarkData): Record<string, number> {
    const metrics: Record<string, number> = {};

    BENCHMARK_METRICS.forEach(metric => {
      metrics[metric.name] = metric.calculation(data);
    });

    return metrics;
  }

  private calculateTotalScore(metrics: Record<string, number>, metricDefinitions: BenchmarkMetric[]): number {
    return metricDefinitions.reduce((total, metric) => {
      return total + (metrics[metric.name] || 0) * metric.weight;
    }, 0);
  }

  getResults(): BenchmarkResult[] {
    return this.results;
  }

  getProfilePerformance(profileId: string): BenchmarkResult[] {
    return this.results.filter(result => result.profileId === profileId);
  }

  getAverageScore(profileId: string): number {
    const profileResults = this.getProfilePerformance(profileId);
    if (profileResults.length === 0) return 0;
    
    return profileResults.reduce((sum, result) => sum + result.totalScore, 0) / profileResults.length;
  }
}

// Export singleton instance
export const aiCelebrityBenchmarkRunner = new AICelebrityBenchmarkRunner(); 