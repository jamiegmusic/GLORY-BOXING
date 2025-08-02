// Script & Song Selection Engine
// Handles AI-generated content with risk/reward profiles and market trend analysis

import type { 
  Celebrity, 
  CelebrityIndustryValue,
  Project,
  ProjectTypeValue
} from './unified-types';

export interface ContentPiece {
  id: string;
  title: string;
  type: ContentTypeValue;
  industry: CelebrityIndustryValue;
  genre: string;
  content: string;
  ai_generated: boolean;
  risk_level: 'low' | 'medium' | 'high';
  reward_potential: number; // 0-100
  market_trend_score: number; // 0-100
  target_audience: string[];
  estimated_budget: number;
  estimated_revenue: number;
  production_time: number; // days
  complexity_score: number; // 1-10
  created_at: Date;
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: ContentTypeValue;
  industry: CelebrityIndustryValue;
  structure: string[];
  variables: ContentVariable[];
  default_genre: string;
  complexity_range: {
    min: number;
    max: number;
  };
}

export interface ContentVariable {
  name: string;
  type: 'string' | 'number' | 'array' | 'object';
  description: string;
  required: boolean;
  default_value?: any;
  options?: string[];
}

export interface MarketTrend {
  industry: CelebrityIndustryValue;
  genre: string;
  trend_score: number; // 0-100
  popularity_change: number; // percentage
  audience_demographics: Record<string, number>;
  competitor_analysis: CompetitorInfo[];
  forecast: TrendForecast;
  created_at: Date;
}

export interface CompetitorInfo {
  name: string;
  market_share: number;
  recent_performance: number;
  strengths: string[];
  weaknesses: string[];
}

export interface TrendForecast {
  short_term: number; // 3 months
  medium_term: number; // 6 months
  long_term: number; // 12 months
  confidence_level: number; // 0-100
}

export const ContentType = {
  MOVIE_SCRIPT: 'movie_script',
  TV_EPISODE: 'tv_episode',
  THEATER_PLAY: 'theater_play',
  SONG_LYRICS: 'song_lyrics',
  MUSIC_COMPOSITION: 'music_composition',
  PODCAST_SCRIPT: 'podcast_script',
  SPEECH: 'speech',
  BOOK_CHAPTER: 'book_chapter',
  ADVERTISEMENT: 'advertisement',
  SOCIAL_MEDIA_CONTENT: 'social_media_content'
} as const;

export type ContentTypeValue = typeof ContentType[keyof typeof ContentType];

export const ContentGenre = {
  // Acting genres
  DRAMA: 'drama',
  COMEDY: 'comedy',
  ACTION: 'action',
  THRILLER: 'thriller',
  ROMANCE: 'romance',
  HORROR: 'horror',
  SCI_FI: 'sci_fi',
  FANTASY: 'fantasy',
  DOCUMENTARY: 'documentary',
  
  // Music genres
  POP: 'pop',
  ROCK: 'rock',
  HIP_HOP: 'hip_hop',
  COUNTRY: 'country',
  JAZZ: 'jazz',
  CLASSICAL: 'classical',
  ELECTRONIC: 'electronic',
  R_AND_B: 'r_and_b',
  
  // Business genres
  BUSINESS_PLAN: 'business_plan',
  MARKETING_STRATEGY: 'marketing_strategy',
  INVESTMENT_PROPOSAL: 'investment_proposal',
  EDUCATIONAL: 'educational',
  MOTIVATIONAL: 'motivational'
} as const;

export type ContentGenreValue = typeof ContentGenre[keyof typeof ContentGenre];

export class ScriptSongEngine {
  private contentPieces: Map<string, ContentPiece> = new Map();
  private templates: Map<string, ContentTemplate> = new Map();
  private marketTrends: Map<string, MarketTrend> = new Map();
  private aiGenerators: Map<ContentTypeValue, any> = new Map();

  constructor() {
    this.initializeTemplates();
    this.initializeMarketTrends();
  }

  // ===== CONTENT GENERATION =====

  generateContent(
    type: ContentTypeValue,
    industry: CelebrityIndustryValue,
    genre: string,
    parameters: Record<string, any> = {}
  ): ContentPiece {
    const template = this.getTemplateForType(type);
    if (!template) {
      throw new Error(`No template found for content type: ${type}`);
    }

    const id = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    // Generate content using AI or template
    const content = this.generateContentFromTemplate(template, parameters);
    
    // Calculate risk and reward
    const riskLevel = this.calculateRiskLevel(type, genre, parameters);
    const rewardPotential = this.calculateRewardPotential(type, genre, parameters);
    const marketTrendScore = this.getMarketTrendScore(industry, genre);
    
    // Estimate budget and revenue
    const estimatedBudget = this.estimateBudget(type, genre, parameters);
    const estimatedRevenue = this.estimateRevenue(type, genre, rewardPotential, marketTrendScore);
    
    const contentPiece: ContentPiece = {
      id,
      title: this.generateTitle(type, genre, parameters),
      type,
      industry,
      genre,
      content,
      ai_generated: true,
      risk_level: riskLevel,
      reward_potential: rewardPotential,
      market_trend_score: marketTrendScore,
      target_audience: this.identifyTargetAudience(type, genre),
      estimated_budget: estimatedBudget,
      estimated_revenue: estimatedRevenue,
      production_time: this.estimateProductionTime(type, genre, parameters),
      complexity_score: this.calculateComplexityScore(type, genre, parameters),
      created_at: now
    };

    this.contentPieces.set(id, contentPiece);
    return contentPiece;
  }

  private generateContentFromTemplate(template: ContentTemplate, parameters: Record<string, any>): string {
    // This would integrate with actual AI content generation
    // For now, generate structured content based on template
    let content = '';
    
    template.structure.forEach(section => {
      content += this.generateSection(section, template.variables, parameters);
      content += '\n\n';
    });

    return content.trim();
  }

  private generateSection(section: string, variables: ContentVariable[], parameters: Record<string, any>): string {
    // Generate section content based on variables and parameters
    let sectionContent = section;
    
    variables.forEach(variable => {
      const value = parameters[variable.name] || variable.default_value || '';
      sectionContent = sectionContent.replace(`{{${variable.name}}}`, String(value));
    });

    return sectionContent;
  }

  private generateTitle(type: ContentTypeValue, genre: string, parameters: Record<string, any>): string {
    const titles = {
      movie_script: [
        'The Last Stand',
        'Echoes of Tomorrow',
        'Breaking Point',
        'Silent Whispers',
        'The Edge of Reality'
      ],
      song_lyrics: [
        'Heartbeat',
        'Midnight Dreams',
        'Rising Sun',
        'Ocean Waves',
        'City Lights'
      ],
      podcast_script: [
        'Behind the Scenes',
        'Industry Insights',
        'Success Stories',
        'Trend Analysis',
        'Expert Perspectives'
      ]
    };

    const typeTitles = titles[type as keyof typeof titles] || ['Untitled'];
    return typeTitles[Math.floor(Math.random() * typeTitles.length)];
  }

  // ===== RISK/REWARD ANALYSIS =====

  private calculateRiskLevel(type: ContentTypeValue, genre: string, parameters: Record<string, any>): 'low' | 'medium' | 'high' {
    let riskScore = 0;

    // Content type risk
    const typeRisk = {
      movie_script: 70,
      tv_episode: 60,
      theater_play: 50,
      song_lyrics: 40,
      music_composition: 45,
      podcast_script: 20,
      speech: 30,
      book_chapter: 35,
      advertisement: 25,
      social_media_content: 15
    };

    riskScore += typeRisk[type] || 50;

    // Genre risk
    const genreRisk = {
      drama: 60,
      comedy: 40,
      action: 80,
      thriller: 70,
      romance: 30,
      horror: 75,
      sci_fi: 85,
      fantasy: 80,
      pop: 30,
      rock: 50,
      hip_hop: 45,
      electronic: 40
    };

    riskScore += genreRisk[genre as keyof typeof genreRisk] || 50;

    // Parameter-based risk adjustments
    if (parameters.budget && parameters.budget > 1000000) riskScore += 20;
    if (parameters.complexity && parameters.complexity > 7) riskScore += 15;
    if (parameters.controversial && parameters.controversial) riskScore += 25;

    if (riskScore < 40) return 'low';
    if (riskScore < 70) return 'medium';
    return 'high';
  }

  private calculateRewardPotential(type: ContentTypeValue, genre: string, parameters: Record<string, any>): number {
    let rewardScore = 0;

    // Base reward by type
    const typeReward = {
      movie_script: 80,
      tv_episode: 70,
      theater_play: 60,
      song_lyrics: 65,
      music_composition: 70,
      podcast_script: 40,
      speech: 50,
      book_chapter: 55,
      advertisement: 45,
      social_media_content: 35
    };

    rewardScore += typeReward[type] || 50;

    // Genre reward
    const genreReward = {
      drama: 75,
      comedy: 70,
      action: 85,
      thriller: 80,
      romance: 65,
      horror: 70,
      sci_fi: 90,
      fantasy: 85,
      pop: 80,
      rock: 75,
      hip_hop: 85,
      electronic: 70
    };

    rewardScore += genreReward[genre as keyof typeof genreReward] || 60;

    // Market trend bonus
    const marketTrend = this.getMarketTrendScore(type as CelebrityIndustryValue, genre);
    rewardScore += marketTrend * 0.3;

    return Math.min(100, Math.max(0, rewardScore));
  }

  // ===== MARKET TREND ANALYSIS =====

  private getMarketTrendScore(industry: CelebrityIndustryValue, genre: string): number {
    const trendKey = `${industry}_${genre}`;
    const trend = this.marketTrends.get(trendKey);
    return trend ? trend.trend_score : 50; // Default neutral score
  }

  getMarketTrends(industry?: CelebrityIndustryValue): MarketTrend[] {
    const trends = Array.from(this.marketTrends.values());
    if (industry) {
      return trends.filter(trend => trend.industry === industry);
    }
    return trends;
  }

  updateMarketTrend(industry: CelebrityIndustryValue, genre: string, trendData: Partial<MarketTrend>): MarketTrend {
    const trendKey = `${industry}_${genre}`;
    const existingTrend = this.marketTrends.get(trendKey);
    const now = new Date();

    const updatedTrend: MarketTrend = {
      industry,
      genre,
      trend_score: trendData.trend_score || existingTrend?.trend_score || 50,
      popularity_change: trendData.popularity_change || existingTrend?.popularity_change || 0,
      audience_demographics: trendData.audience_demographics || existingTrend?.audience_demographics || {},
      competitor_analysis: trendData.competitor_analysis || existingTrend?.competitor_analysis || [],
      forecast: trendData.forecast || existingTrend?.forecast || {
        short_term: 50,
        medium_term: 50,
        long_term: 50,
        confidence_level: 50
      },
      created_at: existingTrend?.created_at || now
    };

    this.marketTrends.set(trendKey, updatedTrend);
    return updatedTrend;
  }

  // ===== BUDGET & REVENUE ESTIMATION =====

  private estimateBudget(type: ContentTypeValue, genre: string, parameters: Record<string, any>): number {
    const baseBudgets = {
      movie_script: 50000,
      tv_episode: 25000,
      theater_play: 15000,
      song_lyrics: 5000,
      music_composition: 8000,
      podcast_script: 2000,
      speech: 3000,
      book_chapter: 4000,
      advertisement: 10000,
      social_media_content: 1000
    };

    let budget = baseBudgets[type] || 5000;

    // Adjust for genre complexity
    const genreMultiplier = {
      action: 1.5,
      sci_fi: 1.8,
      fantasy: 1.6,
      thriller: 1.3,
      comedy: 0.8,
      romance: 0.9,
      pop: 1.0,
      rock: 1.2,
      hip_hop: 1.1,
      electronic: 1.3
    };

    budget *= genreMultiplier[genre as keyof typeof genreMultiplier] || 1.0;

    // Adjust for parameters
    if (parameters.complexity) {
      budget *= (parameters.complexity / 5);
    }

    if (parameters.duration) {
      budget *= (parameters.duration / 60); // Assuming 60 minutes as baseline
    }

    return Math.round(budget);
  }

  private estimateRevenue(type: ContentTypeValue, genre: string, rewardPotential: number, marketTrendScore: number): number {
    const baseRevenue = this.estimateBudget(type, genre, {});
    
    // Revenue potential based on reward and market trends
    const potentialMultiplier = (rewardPotential / 100) * (marketTrendScore / 100) * 3;
    
    return Math.round(baseRevenue * potentialMultiplier);
  }

  private estimateProductionTime(type: ContentTypeValue, genre: string, parameters: Record<string, any>): number {
    const baseTimes = {
      movie_script: 90,
      tv_episode: 30,
      theater_play: 45,
      song_lyrics: 7,
      music_composition: 14,
      podcast_script: 3,
      speech: 5,
      book_chapter: 10,
      advertisement: 7,
      social_media_content: 1
    };

    let time = baseTimes[type] || 10;

    // Adjust for complexity
    if (parameters.complexity) {
      time *= (parameters.complexity / 5);
    }

    return Math.round(time);
  }

  private calculateComplexityScore(type: ContentTypeValue, genre: string, parameters: Record<string, any>): number {
    let complexity = 5; // Base complexity

    // Type complexity
    const typeComplexity = {
      movie_script: 8,
      tv_episode: 7,
      theater_play: 6,
      song_lyrics: 4,
      music_composition: 6,
      podcast_script: 3,
      speech: 4,
      book_chapter: 5,
      advertisement: 4,
      social_media_content: 2
    };

    complexity = typeComplexity[type] || 5;

    // Genre complexity
    const genreComplexity = {
      sci_fi: 9,
      fantasy: 8,
      thriller: 7,
      action: 8,
      drama: 6,
      comedy: 5,
      romance: 4,
      hip_hop: 6,
      rock: 5,
      electronic: 7
    };

    complexity = Math.max(complexity, genreComplexity[genre as keyof typeof genreComplexity] || 5);

    // Parameter adjustments
    if (parameters.complexity) {
      complexity = Math.min(10, Math.max(1, parameters.complexity));
    }

    return complexity;
  }

  // ===== TARGET AUDIENCE IDENTIFICATION =====

  private identifyTargetAudience(type: ContentTypeValue, genre: string): string[] {
    const audiences: Record<string, string[]> = {
      drama: ['Adults 25-54', 'Females 18-45', 'Urban professionals'],
      comedy: ['Adults 18-49', 'College students', 'Young professionals'],
      action: ['Males 18-34', 'Teenagers', 'Action enthusiasts'],
      thriller: ['Adults 25-54', 'Mystery fans', 'Urban audiences'],
      romance: ['Females 18-45', 'Romance readers', 'Young adults'],
      pop: ['Teenagers', 'Young adults 18-25', 'Mainstream listeners'],
      rock: ['Adults 18-45', 'Music enthusiasts', 'Alternative listeners'],
      hip_hop: ['Young adults 18-35', 'Urban audiences', 'Music fans']
    };

    return audiences[genre] || ['General audience'];
  }

  // ===== CONTENT RECOMMENDATIONS =====

  getContentRecommendations(
    celebrity: Celebrity,
    preferences: {
      risk_tolerance: 'low' | 'medium' | 'high';
      budget_range: { min: number; max: number };
      time_constraint: number; // days
      target_audience?: string[];
    }
  ): ContentPiece[] {
    const recommendations: ContentPiece[] = [];
    const allContent = Array.from(this.contentPieces.values());

    // Filter by preferences
    const filteredContent = allContent.filter(content => {
      // Risk tolerance filter
      if (preferences.risk_tolerance === 'low' && content.risk_level !== 'low') return false;
      if (preferences.risk_tolerance === 'high' && content.risk_level === 'low') return false;

      // Budget range filter
      if (content.estimated_budget < preferences.budget_range.min || 
          content.estimated_budget > preferences.budget_range.max) return false;

      // Time constraint filter
      if (content.production_time > preferences.time_constraint) return false;

      // Target audience filter
      if (preferences.target_audience && 
          !preferences.target_audience.some(audience => 
            content.target_audience.includes(audience))) return false;

      return true;
    });

    // Sort by potential ROI
    const sortedContent = filteredContent.sort((a, b) => {
      const aROI = (a.estimated_revenue - a.estimated_budget) / a.estimated_budget;
      const bROI = (b.estimated_revenue - b.estimated_budget) / b.estimated_budget;
      return bROI - aROI;
    });

    return sortedContent.slice(0, 10); // Return top 10 recommendations
  }

  // ===== TEMPLATE MANAGEMENT =====

  private initializeTemplates(): void {
    const templates: ContentTemplate[] = [
      {
        id: 'movie_script_template',
        name: 'Standard Movie Script',
        type: 'movie_script',
        industry: 'acting',
        structure: [
          'FADE IN:',
          '{{location}}',
          '{{character_name}}',
          '{{dialogue}}',
          'FADE OUT.'
        ],
        variables: [
          { name: 'location', type: 'string', description: 'Scene location', required: true },
          { name: 'character_name', type: 'string', description: 'Character name', required: true },
          { name: 'dialogue', type: 'string', description: 'Character dialogue', required: true }
        ],
        default_genre: 'drama',
        complexity_range: { min: 5, max: 9 }
      },
      {
        id: 'song_lyrics_template',
        name: 'Song Lyrics Template',
        type: 'song_lyrics',
        industry: 'music',
        structure: [
          '[Verse 1]',
          '{{verse1_lyrics}}',
          '',
          '[Chorus]',
          '{{chorus_lyrics}}',
          '',
          '[Verse 2]',
          '{{verse2_lyrics}}'
        ],
        variables: [
          { name: 'verse1_lyrics', type: 'string', description: 'First verse lyrics', required: true },
          { name: 'chorus_lyrics', type: 'string', description: 'Chorus lyrics', required: true },
          { name: 'verse2_lyrics', type: 'string', description: 'Second verse lyrics', required: true }
        ],
        default_genre: 'pop',
        complexity_range: { min: 3, max: 7 }
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  private getTemplateForType(type: ContentTypeValue): ContentTemplate | null {
    for (const template of this.templates.values()) {
      if (template.type === type) {
        return template;
      }
    }
    return null;
  }

  private initializeMarketTrends(): void {
    const trends: MarketTrend[] = [
      {
        industry: 'acting',
        genre: 'drama',
        trend_score: 75,
        popularity_change: 5.2,
        audience_demographics: { '18-25': 15, '26-35': 25, '36-45': 30, '46+': 30 },
        competitor_analysis: [
          { name: 'Netflix', market_share: 25, recent_performance: 85, strengths: ['Original content'], weaknesses: ['High costs'] }
        ],
        forecast: { short_term: 80, medium_term: 75, long_term: 70, confidence_level: 80 },
        created_at: new Date()
      },
      {
        industry: 'music',
        genre: 'pop',
        trend_score: 85,
        popularity_change: 8.5,
        audience_demographics: { '13-17': 30, '18-25': 40, '26-35': 20, '36+': 10 },
        competitor_analysis: [
          { name: 'Spotify', market_share: 30, recent_performance: 90, strengths: ['User experience'], weaknesses: ['Royalty rates'] }
        ],
        forecast: { short_term: 90, medium_term: 85, long_term: 80, confidence_level: 85 },
        created_at: new Date()
      }
    ];

    trends.forEach(trend => {
      const trendKey = `${trend.industry}_${trend.genre}`;
      this.marketTrends.set(trendKey, trend);
    });
  }

  // ===== GETTER METHODS =====

  getContentPiece(id: string): ContentPiece | null {
    return this.contentPieces.get(id) || null;
  }

  getAllContentPieces(): ContentPiece[] {
    return Array.from(this.contentPieces.values());
  }

  getContentByType(type: ContentTypeValue): ContentPiece[] {
    return Array.from(this.contentPieces.values()).filter(content => content.type === type);
  }

  getContentByIndustry(industry: CelebrityIndustryValue): ContentPiece[] {
    return Array.from(this.contentPieces.values()).filter(content => content.industry === industry);
  }
}

// Export singleton instance
export const scriptSongEngine = new ScriptSongEngine(); 