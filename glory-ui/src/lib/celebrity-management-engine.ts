import type { 
  Celebrity, 
  CelebrityIndustryValue, 
  Project, 
  ProjectStatusValue,
  CareerMilestone,
  ActingSkills,
  MusicSkills,
  SportsSkills,
  SocialMediaSkills,
  BusinessSkills,
  PersonalityTraits,
  // Enhanced types
  SocialMediaAccount,
  SocialMediaPlatformValue,
  SocialMediaPost,
  ReputationEvent,
  ReputationEventTypeValue,
  ReputationProfile,
  FinancialPortfolio,
  Investment,
  InvestmentTypeValue,
  Property,
  PropertyTypeValue,
  Business,
  BusinessTypeValue,
  EndorsementDeal,
  EndorsementTypeValue,
  MediaInterview,
  InterviewTypeValue,
  IndustryContact,
  ContactTypeValue
} from './unified-types';

import { 
  REAL_CELEBRITIES, 
  DEFAULT_CELEBRITY_STATS, 
  DEFAULT_PERSONALITY_TRAITS,
  DEFAULT_ACTING_SKILLS,
  DEFAULT_MUSIC_SKILLS,
  DEFAULT_SPORTS_SKILLS,
  DEFAULT_SOCIAL_MEDIA_SKILLS,
  DEFAULT_BUSINESS_SKILLS,
  getRandomCelebrity,
  getCelebritiesByIndustry,
  getTopCelebrities,
  getCelebritiesByNetWorth
} from './celebrity-data';

// ===== CELEBRITY MANAGEMENT ENGINE =====
// Supercharged multi-industry career management system

export class CelebrityManagementEngine {
  private celebrities: Map<string, Celebrity> = new Map();
  private projects: Map<string, Project> = new Map();
  private milestones: Map<string, CareerMilestone> = new Map();
  private industryOpportunities: Map<CelebrityIndustryValue, any[]> = new Map();
  
  // Enhanced systems
  private socialMediaAccounts: Map<string, SocialMediaAccount> = new Map();
  private socialMediaPosts: Map<string, SocialMediaPost> = new Map();
  private reputationEvents: Map<string, ReputationEvent> = new Map();
  private reputationProfiles: Map<string, ReputationProfile> = new Map();
  private financialPortfolios: Map<string, FinancialPortfolio> = new Map();
  private endorsementDeals: Map<string, EndorsementDeal> = new Map();
  private mediaInterviews: Map<string, MediaInterview> = new Map();
  private industryContacts: Map<string, IndustryContact> = new Map();

  constructor() {
    this.initializeIndustryOpportunities();
  }

  // ===== CORE CELEBRITY MANAGEMENT =====

  createCelebrity(data: Omit<Celebrity, 'id' | 'created_at' | 'updated_at'>): Celebrity {
    const id = `celebrity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const celebrity: Celebrity = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
      // Initialize default values
      popularity: data.popularity || 0,
      experience: data.experience || 0,
      ranking: data.ranking || 0,
      industry_ranking: data.industry_ranking || 0,
      net_worth: data.net_worth || 0,
      physical_health: data.physical_health || 100,
      mental_health: data.mental_health || 100,
      stress_level: data.stress_level || 0,
      energy_level: data.energy_level || 100,
      public_image: data.public_image || 50,
      fan_base_size: data.fan_base_size || 0,
      media_sentiment: data.media_sentiment || 'neutral',
      injuries: data.injuries || [],
      is_injured: data.is_injured || false
    };

    this.celebrities.set(id, celebrity);
    
    // Initialize enhanced systems
    this.initializeCelebritySystems(id);
    
    this.triggerCareerEvent(celebrity, 'celebrity_created');
    return celebrity;
  }

  private initializeCelebritySystems(celebrityId: string) {
    const now = new Date();
    
    // Initialize reputation profile
    const reputationProfile: ReputationProfile = {
      id: `reputation_${celebrityId}`,
      celebrity_id: celebrityId,
      overall_reputation: 50,
      industry_reputation: {} as Record<CelebrityIndustryValue, number>,
      public_trust: 50,
      media_sentiment: 'neutral',
      crisis_resilience: 50,
      brand_value: 0,
      last_updated: now,
      created_at: now
    };
    this.reputationProfiles.set(reputationProfile.id, reputationProfile);
    
    // Initialize financial portfolio
    const financialPortfolio: FinancialPortfolio = {
      id: `portfolio_${celebrityId}`,
      celebrity_id: celebrityId,
      total_assets: 0,
      liquid_cash: 0,
      investments: [],
      properties: [],
      businesses: [],
      debt: 0,
      monthly_income: 0,
      monthly_expenses: 0,
      net_worth: 0,
      last_updated: now,
      created_at: now
    };
    this.financialPortfolios.set(financialPortfolio.id, financialPortfolio);
  }

  updateCelebrity(id: string, updates: Partial<Celebrity>): Celebrity | null {
    const celebrity = this.celebrities.get(id);
    if (!celebrity) return null;

    const updatedCelebrity: Celebrity = {
      ...celebrity,
      ...updates,
      updated_at: new Date()
    };

    this.celebrities.set(id, updatedCelebrity);
    this.triggerCareerEvent(updatedCelebrity, 'celebrity_updated');
    return updatedCelebrity;
  }

  getCelebrity(id: string): Celebrity | null {
    return this.celebrities.get(id) || null;
  }

  getAllCelebrities(): Celebrity[] {
    return Array.from(this.celebrities.values());
  }

  // ===== MULTI-INDUSTRY CAREER PATHS =====

  switchPrimaryIndustry(celebrityId: string, newIndustry: CelebrityIndustryValue): boolean {
    const celebrity = this.celebrities.get(celebrityId);
    if (!celebrity) return false;

    const oldIndustry = celebrity.primary_industry;
    celebrity.primary_industry = newIndustry;
    celebrity.updated_at = new Date();

    // Adjust skills and experience for new industry
    this.adjustSkillsForIndustry(celebrity, oldIndustry, newIndustry);
    
    this.celebrities.set(celebrityId, celebrity);
    this.triggerCareerEvent(celebrity, 'industry_switch');
    return true;
  }

  addSecondaryIndustry(celebrityId: string, industry: CelebrityIndustryValue): boolean {
    const celebrity = this.celebrities.get(celebrityId);
    if (!celebrity) return false;

    if (!celebrity.secondary_industries.includes(industry)) {
      celebrity.secondary_industries.push(industry);
      celebrity.updated_at = new Date();
      this.celebrities.set(celebrityId, celebrity);
      this.triggerCareerEvent(celebrity, 'secondary_industry_added');
    }
    return true;
  }

  // ===== SKILL PROGRESSION SYSTEM =====

  trainSkill(celebrityId: string, skillType: string, skillName: string, hours: number): boolean {
    const celebrity = this.celebrities.get(celebrityId);
    if (!celebrity) return false;

    const skillBoost = this.calculateSkillBoost(hours, celebrity.experience || 0);
    const energyCost = this.calculateEnergyCost(hours);
    const stressIncrease = this.calculateStressIncrease(hours);

    // Apply skill training
    this.applySkillTraining(celebrity, skillType, skillName, skillBoost);
    
    // Update energy and stress
    celebrity.energy_level = Math.max(0, (celebrity.energy_level || 100) - energyCost);
    celebrity.stress_level = Math.min(100, (celebrity.stress_level || 0) + stressIncrease);
    celebrity.updated_at = new Date();

    this.celebrities.set(celebrityId, celebrity);
    this.triggerCareerEvent(celebrity, 'skill_trained');
    return true;
  }

  private applySkillTraining(celebrity: Celebrity, skillType: string, skillName: string, boost: number) {
    switch (skillType) {
      case 'acting':
        if (celebrity.acting_skills && celebrity.acting_skills[skillName as keyof ActingSkills]) {
          celebrity.acting_skills[skillName as keyof ActingSkills] = 
            Math.min(100, celebrity.acting_skills[skillName as keyof ActingSkills] + boost);
        }
        break;
      case 'music':
        if (celebrity.music_skills && celebrity.music_skills[skillName as keyof MusicSkills]) {
          celebrity.music_skills[skillName as keyof MusicSkills] = 
            Math.min(100, celebrity.music_skills[skillName as keyof MusicSkills] + boost);
        }
        break;
      case 'sports':
        if (celebrity.sports_skills && celebrity.sports_skills[skillName as keyof SportsSkills]) {
          celebrity.sports_skills[skillName as keyof SportsSkills] = 
            Math.min(100, celebrity.sports_skills[skillName as keyof SportsSkills] + boost);
        }
        break;
      case 'social_media':
        if (celebrity.social_media_skills && celebrity.social_media_skills[skillName as keyof SocialMediaSkills]) {
          celebrity.social_media_skills[skillName as keyof SocialMediaSkills] = 
            Math.min(100, celebrity.social_media_skills[skillName as keyof SocialMediaSkills] + boost);
        }
        break;
      case 'business':
        if (celebrity.business_skills && celebrity.business_skills[skillName as keyof BusinessSkills]) {
          celebrity.business_skills[skillName as keyof BusinessSkills] = 
            Math.min(100, celebrity.business_skills[skillName as keyof BusinessSkills] + boost);
        }
        break;
    }
  }

  // ===== PROJECT MANAGEMENT =====

  createProject(data: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project {
    const id = this.generateId();
    const now = new Date();
    
    const project: Project = {
      ...data,
      id,
      created_at: now,
      updated_at: now
    };

    this.projects.set(id, project);
    this.triggerProjectEvent(project, 'project_created');
    return project;
  }

  updateProjectStatus(projectId: string, newStatus: ProjectStatusValue): boolean {
    const project = this.projects.get(projectId);
    if (!project) return false;

    project.status = newStatus;
    project.updated_at = new Date();

    if (newStatus === 'completed') {
      this.handleProjectCompletion(project);
    }

    this.projects.set(projectId, project);
    this.triggerProjectEvent(project, 'project_status_updated');
    return true;
  }

  getCelebrityProjects(celebrityId: string): Project[] {
    return Array.from(this.projects.values()).filter(p => p.celebrity_id === celebrityId);
  }

  // ===== CAREER MILESTONES =====

  createMilestone(data: Omit<CareerMilestone, 'id' | 'created_at'>): CareerMilestone {
    const id = this.generateId();
    const now = new Date();
    
    const milestone: CareerMilestone = {
      ...data,
      id,
      created_at: now
    };

    this.milestones.set(id, milestone);
    this.applyMilestoneRewards(milestone);
    this.triggerMilestoneEvent(milestone, 'milestone_achieved');
    return milestone;
  }

  getCelebrityMilestones(celebrityId: string): CareerMilestone[] {
    return Array.from(this.milestones.values()).filter(m => m.celebrity_id === celebrityId);
  }

  // ===== OPPORTUNITY SYSTEM =====

  getIndustryOpportunities(industry: CelebrityIndustryValue): any[] {
    return this.industryOpportunities.get(industry) || [];
  }

  generateOpportunities(celebrity: Celebrity): any[] {
    const opportunities = [];
    const primaryOpportunities = this.getIndustryOpportunities(celebrity.primary_industry);
    
    // Filter opportunities based on celebrity's skills and popularity
    for (const opportunity of primaryOpportunities) {
      if (this.isEligibleForOpportunity(celebrity, opportunity)) {
        opportunities.push(opportunity);
      }
    }

    // Add opportunities from secondary industries
    for (const secondaryIndustry of celebrity.secondary_industries) {
      const secondaryOpportunities = this.getIndustryOpportunities(secondaryIndustry);
      for (const opportunity of secondaryOpportunities) {
        if (this.isEligibleForOpportunity(celebrity, opportunity)) {
          opportunities.push(opportunity);
        }
      }
    }

    return opportunities;
  }

  // ===== ADVANCED GAMEPLAY MECHANICS =====

  private calculateSkillBoost(hours: number, experience: number): number {
    const baseBoost = hours * 0.5;
    const experienceMultiplier = 1 + (experience / 1000);
    return Math.round(baseBoost * experienceMultiplier);
  }

  private calculateEnergyCost(hours: number): number {
    return hours * 2; // 2 energy per hour of training
  }

  private calculateStressIncrease(hours: number): number {
    return hours * 0.5; // 0.5 stress per hour of training
  }

  private adjustSkillsForIndustry(celebrity: Celebrity, oldIndustry: CelebrityIndustryValue, newIndustry: CelebrityIndustryValue) {
    // Transfer some skills between related industries
    const skillTransferMap: Record<CelebrityIndustryValue, string[]> = {
      'acting': ['comedy', 'reality_tv'],
      'music': ['acting', 'social_media'],
      'sports': ['business', 'social_media'],
      'social_media': ['acting', 'music', 'business'],
      'business': ['social_media', 'technology'],
      'modeling': ['acting', 'social_media', 'business'],
      'comedy': ['acting', 'reality_tv'],
      'reality_tv': ['acting', 'social_media'],
      'fashion': ['modeling', 'social_media'],
      'technology': ['business', 'social_media']
    };

    const transferableSkills = skillTransferMap[oldIndustry] || [];
    if (transferableSkills.includes(newIndustry)) {
      // Apply skill transfer bonus
      celebrity.experience = (celebrity.experience || 0) + 50;
    }
  }

  private handleProjectCompletion(project: Project) {
    const celebrity = this.celebrities.get(project.celebrity_id);
    if (!celebrity) return;

    // Calculate rewards based on project success
    const successMultiplier = this.calculateProjectSuccess(project);
    const revenue = project.revenue_potential * successMultiplier;
    const experienceGain = Math.round(project.revenue_potential / 1000);
    const popularityGain = Math.round(project.revenue_potential / 10000);

    // Apply rewards
    celebrity.net_worth = (celebrity.net_worth || 0) + revenue;
    celebrity.experience = (celebrity.experience || 0) + experienceGain;
    celebrity.popularity = (celebrity.popularity || 0) + popularityGain;
    celebrity.updated_at = new Date();

    this.celebrities.set(project.celebrity_id, celebrity);
  }

  private calculateProjectSuccess(project: Project): number {
    // Complex success calculation based on various factors
    const baseSuccess = 0.7;
    const riskModifier = project.risk_level === 'high' ? 0.8 : project.risk_level === 'medium' ? 0.9 : 1.0;
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    
    return Math.min(1.5, baseSuccess * riskModifier * randomFactor);
  }

  private isEligibleForOpportunity(celebrity: Celebrity, opportunity: any): boolean {
    // Check if celebrity meets opportunity requirements
    const requiredPopularity = opportunity.required_popularity || 0;
    const requiredExperience = opportunity.required_experience || 0;
    
    return (celebrity.popularity || 0) >= requiredPopularity && 
           (celebrity.experience || 0) >= requiredExperience;
  }

  private applyMilestoneRewards(milestone: CareerMilestone) {
    const celebrity = this.celebrities.get(milestone.celebrity_id);
    if (!celebrity) return;

    for (const reward of milestone.rewards) {
      switch (reward.type) {
        case 'popularity':
          celebrity.popularity = (celebrity.popularity || 0) + reward.value;
          break;
        case 'experience':
          celebrity.experience = (celebrity.experience || 0) + reward.value;
          break;
        case 'money':
          celebrity.net_worth = (celebrity.net_worth || 0) + reward.value;
          break;
        case 'skill_boost':
          // Apply skill boost to relevant skills
          this.applySkillBoost(celebrity, milestone.industry, reward.value);
          break;
        case 'opportunity':
          // Generate special opportunities
          this.generateSpecialOpportunities(celebrity, reward.value);
          break;
      }
    }

    celebrity.updated_at = new Date();
    this.celebrities.set(milestone.celebrity_id, celebrity);
  }

  private applySkillBoost(celebrity: Celebrity, industry: CelebrityIndustryValue, boost: number) {
    // Apply skill boost based on industry
    switch (industry) {
      case 'acting':
        if (celebrity.acting_skills) {
          Object.keys(celebrity.acting_skills).forEach(skill => {
            celebrity.acting_skills![skill as keyof ActingSkills] = 
              Math.min(100, celebrity.acting_skills![skill as keyof ActingSkills] + boost);
          });
        }
        break;
      // Similar for other industries...
    }
  }

  private generateSpecialOpportunities(celebrity: Celebrity, count: number) {
    // Generate special high-value opportunities
    for (let i = 0; i < count; i++) {
      const specialOpportunity = this.createSpecialOpportunity(celebrity);
      // Add to opportunity pool
    }
  }

  private createSpecialOpportunity(celebrity: Celebrity): any {
    // Create unique, high-value opportunities based on celebrity's profile
    return {
      id: this.generateId(),
      title: `Special Opportunity for ${celebrity.name}`,
      type: 'special',
      value: 1000000,
      requirements: {
        popularity: celebrity.popularity || 0,
        experience: celebrity.experience || 0
      }
    };
  }

  // ===== EVENT SYSTEM =====

  private triggerCareerEvent(celebrity: Celebrity, eventType: string) {
    // Trigger career-related events and notifications
    console.log(`Career event: ${eventType} for ${celebrity.name}`);
  }

  private triggerProjectEvent(project: Project, eventType: string) {
    // Trigger project-related events and notifications
    console.log(`Project event: ${eventType} for ${project.title}`);
  }

  private triggerMilestoneEvent(milestone: CareerMilestone, eventType: string) {
    // Trigger milestone-related events and notifications
    console.log(`Milestone event: ${eventType}: ${milestone.title}`);
  }

  // ===== UTILITY FUNCTIONS =====

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private initializeIndustryOpportunities() {
    // Initialize opportunities for each industry
    const industries: CelebrityIndustryValue[] = [
      'acting', 'music', 'sports', 'social_media', 'modeling', 
      'business', 'comedy', 'reality_tv', 'fashion', 'technology'
    ];

    for (const industry of industries) {
      this.industryOpportunities.set(industry, this.generateIndustryOpportunities(industry));
    }
  }

  private generateIndustryOpportunities(industry: CelebrityIndustryValue): any[] {
    // Generate industry-specific opportunities
    const opportunities = [];
    
    switch (industry) {
      case 'acting':
        opportunities.push(
          { id: '1', title: 'Lead Role in Blockbuster', type: 'movie', value: 5000000, required_popularity: 50 },
          { id: '2', title: 'TV Series Regular', type: 'tv_show', value: 2000000, required_popularity: 30 },
          { id: '3', title: 'Indie Film Role', type: 'movie', value: 500000, required_popularity: 10 }
        );
        break;
      case 'music':
        opportunities.push(
          { id: '4', title: 'Major Label Album', type: 'album', value: 3000000, required_popularity: 40 },
          { id: '5', title: 'World Tour', type: 'tour', value: 8000000, required_popularity: 60 },
          { id: '6', title: 'Festival Headliner', type: 'tour', value: 1000000, required_popularity: 25 }
        );
        break;
      // Add more industries...
    }

    return opportunities;
  }

  // ===== SOCIAL MEDIA PRESENCE SYSTEM =====

  createSocialMediaAccount(celebrityId: string, platform: SocialMediaPlatformValue, username: string): SocialMediaAccount {
    const id = `social_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const account: SocialMediaAccount = {
      id,
      celebrity_id: celebrityId,
      platform,
      username,
      followers: 0,
      engagement_rate: 0,
      verified: false,
      created_at: now,
      updated_at: now
    };
    
    this.socialMediaAccounts.set(id, account);
    return account;
  }

  createSocialMediaPost(celebrityId: string, platform: SocialMediaPlatformValue, content: string, hashtags: string[] = []): SocialMediaPost {
    const id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    // Calculate engagement based on celebrity's social media skills
    const celebrity = this.celebrities.get(celebrityId);
    const socialSkills = celebrity?.social_media_skills;
    const baseEngagement = socialSkills ? 
      (socialSkills.content_creation + socialSkills.audience_engagement + socialSkills.viral_potential) / 3 : 10;
    
    const engagement = {
      likes: Math.floor(baseEngagement * (0.5 + Math.random() * 0.5)),
      comments: Math.floor(baseEngagement * 0.1 * (0.5 + Math.random() * 0.5)),
      shares: Math.floor(baseEngagement * 0.05 * (0.5 + Math.random() * 0.5)),
      views: Math.floor(baseEngagement * 10 * (0.5 + Math.random() * 0.5))
    };
    
    const reach = engagement.views || engagement.likes * 10;
    const viralScore = (engagement.shares * 2 + engagement.comments * 1.5 + engagement.likes) / 100;
    
    const post: SocialMediaPost = {
      id,
      celebrity_id: celebrityId,
      platform,
      content,
      hashtags,
      engagement,
      reach,
      viral_score: viralScore,
      posted_at: now,
      created_at: now
    };
    
    this.socialMediaPosts.set(id, post);
    this.updateSocialMediaAccount(celebrityId, platform, post);
    return post;
  }

  private updateSocialMediaAccount(celebrityId: string, platform: SocialMediaPlatformValue, post: SocialMediaPost) {
    const account = Array.from(this.socialMediaAccounts.values())
      .find(acc => acc.celebrity_id === celebrityId && acc.platform === platform);
    
    if (account) {
      account.followers += Math.floor(post.engagement.likes * 0.01);
      account.engagement_rate = (account.engagement_rate + post.viral_score) / 2;
      account.last_post_date = post.posted_at;
      account.updated_at = new Date();
    }
  }

  // ===== REPUTATION MANAGEMENT SYSTEM =====

  createReputationEvent(celebrityId: string, eventType: ReputationEventTypeValue, title: string, description: string, impactScore: number): ReputationEvent {
    const id = `reputation_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const event: ReputationEvent = {
      id,
      celebrity_id: celebrityId,
      event_type: eventType,
      title,
      description,
      impact_score: Math.max(-100, Math.min(100, impactScore)),
      media_coverage: Math.abs(impactScore) * 0.1,
      public_reaction: impactScore > 20 ? 'positive' : impactScore < -20 ? 'negative' : 'neutral',
      industry_impact: [],
      duration_days: Math.abs(impactScore) > 50 ? 30 : Math.abs(impactScore) > 20 ? 14 : 7,
      resolved: false,
      occurred_at: now,
      created_at: now
    };
    
    this.reputationEvents.set(id, event);
    this.updateReputationProfile(celebrityId, event);
    return event;
  }

  private updateReputationProfile(celebrityId: string, event: ReputationEvent) {
    const profile = this.reputationProfiles.get(`reputation_${celebrityId}`);
    if (profile) {
      const impact = event.impact_score * 0.1;
      profile.overall_reputation = Math.max(0, Math.min(100, profile.overall_reputation + impact));
      profile.public_trust = Math.max(0, Math.min(100, profile.public_trust + impact * 0.5));
      // Map the broader sentiment to the MediaInterview's expected values
      profile.media_sentiment = event.public_reaction === 'controversial' ? 'negative' : 
                               event.public_reaction === 'mixed' ? 'neutral' : 
                               event.public_reaction;
      profile.brand_value += event.impact_score * 1000;
      profile.last_updated = new Date();
    }
  }

  // ===== FINANCIAL PORTFOLIO SYSTEM =====

  addInvestment(celebrityId: string, type: InvestmentTypeValue, name: string, value: number, returnRate: number, riskLevel: 'low' | 'medium' | 'high'): Investment {
    const portfolio = this.financialPortfolios.get(`portfolio_${celebrityId}`);
    if (!portfolio) throw new Error('Portfolio not found');
    
    const id = `investment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const investment: Investment = {
      id,
      portfolio_id: portfolio.id,
      type,
      name,
      value,
      return_rate: returnRate,
      risk_level: riskLevel,
      created_at: now
    };
    
    portfolio.investments.push(investment);
    portfolio.total_assets += value;
    portfolio.net_worth += value;
    portfolio.last_updated = new Date();
    
    return investment;
  }

  addProperty(celebrityId: string, type: PropertyTypeValue, address: string, value: number, monthlyRent?: number): Property {
    const portfolio = this.financialPortfolios.get(`portfolio_${celebrityId}`);
    if (!portfolio) throw new Error('Portfolio not found');
    
    const id = `property_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const property: Property = {
      id,
      portfolio_id: portfolio.id,
      type,
      address,
      value,
      monthly_rent: monthlyRent,
      appreciation_rate: 0.05, // 5% annual appreciation
      created_at: now
    };
    
    portfolio.properties.push(property);
    portfolio.total_assets += value;
    portfolio.net_worth += value;
    portfolio.last_updated = new Date();
    
    return property;
  }

  addBusiness(celebrityId: string, name: string, industry: string, type: BusinessTypeValue, value: number, annualRevenue: number, ownershipPercentage: number): Business {
    const portfolio = this.financialPortfolios.get(`portfolio_${celebrityId}`);
    if (!portfolio) throw new Error('Portfolio not found');
    
    const id = `business_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const business: Business = {
      id,
      portfolio_id: portfolio.id,
      name,
      industry,
      type,
      value,
      annual_revenue: annualRevenue,
      profit_margin: 0.15, // 15% profit margin
      ownership_percentage: ownershipPercentage,
      created_at: now
    };
    
    portfolio.businesses.push(business);
    portfolio.total_assets += value;
    portfolio.net_worth += value;
    portfolio.monthly_income += (annualRevenue * ownershipPercentage) / 12;
    portfolio.last_updated = new Date();
    
    return business;
  }

  // ===== ENDORSEMENT DEALS SYSTEM =====

  createEndorsementDeal(celebrityId: string, brandName: string, industry: string, dealType: EndorsementTypeValue, dealValue: number, durationMonths: number): EndorsementDeal {
    const id = `endorsement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    const endDate = new Date(now.getTime() + durationMonths * 30 * 24 * 60 * 60 * 1000);
    
    const deal: EndorsementDeal = {
      id,
      celebrity_id: celebrityId,
      brand_name: brandName,
      industry,
      deal_type: dealType,
      deal_value: dealValue,
      duration_months: durationMonths,
      requirements: [],
      performance_metrics: [],
      social_media_obligations: Math.floor(durationMonths * 0.5),
      public_appearances: Math.floor(durationMonths * 0.3),
      start_date: now,
      end_date: endDate,
      status: 'active',
      created_at: now
    };
    
    this.endorsementDeals.set(id, deal);
    this.updateFinancialPortfolio(celebrityId, dealValue);
    return deal;
  }

  private updateFinancialPortfolio(celebrityId: string, income: number) {
    const portfolio = this.financialPortfolios.get(`portfolio_${celebrityId}`);
    if (portfolio) {
      portfolio.liquid_cash += income;
      portfolio.net_worth += income;
      portfolio.monthly_income += income / 12;
      portfolio.last_updated = new Date();
    }
  }

  // ===== MEDIA INTERVIEWS SYSTEM =====

  createMediaInterview(celebrityId: string, outletName: string, interviewer: string, interviewType: InterviewTypeValue, topics: string[]): MediaInterview {
    const id = `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const celebrity = this.celebrities.get(celebrityId);
    const reputationProfile = this.reputationProfiles.get(`reputation_${celebrityId}`);
    
    // Map the reputation profile sentiment to MediaInterview's expected values
    const reputationSentiment = reputationProfile?.media_sentiment || 'neutral';
    const sentiment = reputationSentiment === 'mixed' ? 'neutral' : reputationSentiment;
    const reach = celebrity?.fan_base_size || 1000;
    const impactScore = (reputationProfile?.overall_reputation || 50) * 0.1;
    
    const interview: MediaInterview = {
      id,
      celebrity_id: celebrityId,
      outlet_name: outletName,
      interviewer,
      interview_type: interviewType,
      topics,
      sentiment,
      reach,
      impact_score: impactScore,
      interview_date: now,
      published_date: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Published next day
      created_at: now
    };
    
    this.mediaInterviews.set(id, interview);
    return interview;
  }

  // ===== INDUSTRY NETWORKING SYSTEM =====

  createIndustryContact(celebrityId: string, contactName: string, company: string, position: string, industry: CelebrityIndustryValue, relationshipType: ContactTypeValue, influenceLevel: number): IndustryContact {
    const id = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const contact: IndustryContact = {
      id,
      celebrity_id: celebrityId,
      contact_name: contactName,
      company,
      position,
      industry,
      relationship_type: relationshipType,
      influence_level: Math.max(1, Math.min(10, influenceLevel)),
      last_contact: now,
      notes: '',
      created_at: now
    };
    
    this.industryContacts.set(id, contact);
    return contact;
  }

  // ===== GETTER METHODS =====

  getSocialMediaAccounts(celebrityId: string): SocialMediaAccount[] {
    return Array.from(this.socialMediaAccounts.values())
      .filter(account => account.celebrity_id === celebrityId);
  }

  getSocialMediaPosts(celebrityId: string): SocialMediaPost[] {
    return Array.from(this.socialMediaPosts.values())
      .filter(post => post.celebrity_id === celebrityId)
      .sort((a, b) => b.posted_at.getTime() - a.posted_at.getTime());
  }

  getReputationProfile(celebrityId: string): ReputationProfile | null {
    return this.reputationProfiles.get(`reputation_${celebrityId}`) || null;
  }

  getReputationEvents(celebrityId: string): ReputationEvent[] {
    return Array.from(this.reputationEvents.values())
      .filter(event => event.celebrity_id === celebrityId)
      .sort((a, b) => b.occurred_at.getTime() - a.occurred_at.getTime());
  }

  getFinancialPortfolio(celebrityId: string): FinancialPortfolio | null {
    return this.financialPortfolios.get(`portfolio_${celebrityId}`) || null;
  }

  getEndorsementDeals(celebrityId: string): EndorsementDeal[] {
    return Array.from(this.endorsementDeals.values())
      .filter(deal => deal.celebrity_id === celebrityId);
  }

  getMediaInterviews(celebrityId: string): MediaInterview[] {
    return Array.from(this.mediaInterviews.values())
      .filter(interview => interview.celebrity_id === celebrityId)
      .sort((a, b) => b.interview_date.getTime() - a.interview_date.getTime());
  }

  getIndustryContacts(celebrityId: string): IndustryContact[] {
    return Array.from(this.industryContacts.values())
      .filter(contact => contact.celebrity_id === celebrityId);
  }

  // ===== REAL CELEBRITY DATA INTEGRATION =====

  loadRealCelebrities(): Celebrity[] {
    const loadedCelebrities: Celebrity[] = [];
    
    REAL_CELEBRITIES.forEach(celebrityData => {
      const celebrity = this.createCelebrity(celebrityData);
      loadedCelebrities.push(celebrity);
    });
    
    return loadedCelebrities;
  }

  getRandomRealCelebrity(): Celebrity {
    const randomData = getRandomCelebrity();
    return this.createCelebrity(randomData);
  }

  getCelebritiesByIndustry(industry: CelebrityIndustryValue): Celebrity[] {
    const industryCelebrities = getCelebritiesByIndustry(industry);
    return industryCelebrities.map(data => this.createCelebrity(data));
  }

  getTopCelebrities(limit: number = 10): Celebrity[] {
    const topCelebritiesData = getTopCelebrities(limit);
    return topCelebritiesData.map(data => this.createCelebrity(data));
  }

  getCelebritiesByNetWorth(minNetWorth: number): Celebrity[] {
    const wealthyCelebrities = getCelebritiesByNetWorth(minNetWorth);
    return wealthyCelebrities.map(data => this.createCelebrity(data));
  }

  createCelebrityFromTemplate(templateName: string): Celebrity | null {
    const template = REAL_CELEBRITIES.find(celebrity => celebrity.name === templateName);
    if (!template) return null;
    
    return this.createCelebrity(template);
  }

  getCelebrityTemplates(): string[] {
    return REAL_CELEBRITIES.map(celebrity => celebrity.name);
  }

  getCelebrityTemplate(celebrityName: string): Omit<Celebrity, 'id' | 'created_at' | 'updated_at'> | null {
    return REAL_CELEBRITIES.find(celebrity => celebrity.name === celebrityName) || null;
  }

  // ===== DEFAULT CONFIGURATIONS =====

  getDefaultCelebrityStats() {
    return DEFAULT_CELEBRITY_STATS;
  }

  getDefaultPersonalityTraits(): PersonalityTraits {
    return DEFAULT_PERSONALITY_TRAITS;
  }

  getDefaultActingSkills(): ActingSkills {
    return DEFAULT_ACTING_SKILLS;
  }

  getDefaultMusicSkills(): MusicSkills {
    return DEFAULT_MUSIC_SKILLS;
  }

  getDefaultSportsSkills(): SportsSkills {
    return DEFAULT_SPORTS_SKILLS;
  }

  getDefaultSocialMediaSkills(): SocialMediaSkills {
    return DEFAULT_SOCIAL_MEDIA_SKILLS;
  }

  getDefaultBusinessSkills(): BusinessSkills {
    return DEFAULT_BUSINESS_SKILLS;
  }
}

// Export singleton instance
export const celebrityManagementEngine = new CelebrityManagementEngine(); 