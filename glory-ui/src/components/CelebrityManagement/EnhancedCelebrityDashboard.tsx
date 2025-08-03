import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Award,
  Briefcase,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  DollarSign,
  Building,
  Home,
  ChartLine,
  Star,
  MessageSquare,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Minus,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  Zap
} from 'lucide-react';
import { celebrityManagementEngine } from '../../lib/celebrity-management-engine';
import CelebrityAnalytics from './CelebrityAnalytics';
import CareerPlanner from './CareerPlanner';
import AIContentGenerator from './AIContentGenerator';
import AIBenchmarkDashboard from './AIBenchmarkDashboard';
import type { 
  Celebrity, 
  CelebrityIndustryValue,
  SocialMediaAccount,
  SocialMediaPost,
  ReputationEvent,
  ReputationProfile,
  FinancialPortfolio,
  Investment,
  Property,
  Business,
  EndorsementDeal,
  MediaInterview,
  IndustryContact,
  Project,
  CareerMilestone
} from '../../lib/unified-types';

const EnhancedCelebrityDashboard: React.FC = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'social' | 'reputation' | 'finance' | 'endorsements' | 'media' | 'network' | 'analytics' | 'career' | 'ai-content' | 'ai-benchmark'>('overview');
  
  // Enhanced data states
  const [socialAccounts, setSocialAccounts] = useState<SocialMediaAccount[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialMediaPost[]>([]);
  const [reputationProfile, setReputationProfile] = useState<ReputationProfile | null>(null);
  const [reputationEvents, setReputationEvents] = useState<ReputationEvent[]>([]);
  const [financialPortfolio, setFinancialPortfolio] = useState<FinancialPortfolio | null>(null);
  const [endorsementDeals, setEndorsementDeals] = useState<EndorsementDeal[]>([]);
  const [mediaInterviews, setMediaInterviews] = useState<MediaInterview[]>([]);
  const [industryContacts, setIndustryContacts] = useState<IndustryContact[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [careerMilestones, setCareerMilestones] = useState<CareerMilestone[]>([]);

  useEffect(() => {
    createSampleCelebrities();
  }, []);

  useEffect(() => {
    if (selectedCelebrity) {
      loadCelebrityData(selectedCelebrity.id);
    }
  }, [selectedCelebrity]);

  const createSampleCelebrities = () => {
    const sampleCelebrities = [
      {
        name: 'Alex "The Thunder" Rodriguez',
        age: 28,
        nationality: 'American',
        primary_industry: 'sports' as CelebrityIndustryValue,
        secondary_industries: ['social_media', 'business'] as CelebrityIndustryValue[],
        popularity: 85,
        experience: 75,
        ranking: 3,
        industry_ranking: 5,
        net_worth: 2500000,
        physical_health: 95,
        mental_health: 88,
        stress_level: 15,
        energy_level: 90,
        public_image: 82,
        fan_base_size: 2500000,
        media_sentiment: 'positive' as const,
        social_media_skills: {
          content_creation: 85,
          audience_engagement: 90,
          trend_awareness: 88,
          platform_mastery: 92,
          viral_potential: 87,
          brand_voice: 85,
          community_building: 89,
          crisis_management: 75,
          monetization: 80,
          authenticity: 88
        },
        business_skills: {
          entrepreneurship: 70,
          investment_acumen: 65,
          negotiation: 75,
          strategic_planning: 68,
          brand_management: 80,
          financial_literacy: 72,
          market_analysis: 65,
          networking: 85,
          risk_management: 70,
          innovation: 75
        },
        personality_traits: {
          confidence: 90,
          aggression: 85,
          intelligence: 80,
          charisma: 88,
          work_ethic: 92
        }
      },
      {
        name: 'Sarah "The Queen" Johnson',
        age: 32,
        nationality: 'British',
        primary_industry: 'acting' as CelebrityIndustryValue,
        secondary_industries: ['social_media', 'business'] as CelebrityIndustryValue[],
        popularity: 92,
        experience: 88,
        ranking: 1,
        industry_ranking: 2,
        net_worth: 4500000,
        physical_health: 88,
        mental_health: 85,
        stress_level: 25,
        energy_level: 85,
        public_image: 90,
        fan_base_size: 5000000,
        media_sentiment: 'positive' as const,
        social_media_skills: {
          content_creation: 92,
          audience_engagement: 95,
          trend_awareness: 90,
          platform_mastery: 88,
          viral_potential: 94,
          brand_voice: 92,
          community_building: 90,
          crisis_management: 85,
          monetization: 88,
          authenticity: 90
        },
        business_skills: {
          entrepreneurship: 85,
          investment_acumen: 80,
          negotiation: 88,
          strategic_planning: 85,
          brand_management: 92,
          financial_literacy: 82,
          market_analysis: 78,
          networking: 90,
          risk_management: 85,
          innovation: 88
        },
        personality_traits: {
          confidence: 95,
          aggression: 70,
          intelligence: 90,
          charisma: 95,
          work_ethic: 88
        }
      }
    ];

    const createdCelebrities = sampleCelebrities.map(celebrity => 
      celebrityManagementEngine.createCelebrity(celebrity)
    );

    setCelebrities(createdCelebrities);
    setSelectedCelebrity(createdCelebrities[0]);

    // Create sample social media accounts and posts
    createdCelebrities.forEach(celebrity => {
      // Create social media accounts
      celebrityManagementEngine.createSocialMediaAccount(celebrity.id, 'instagram', `@${celebrity.name.toLowerCase().replace(/\s+/g, '')}`);
      celebrityManagementEngine.createSocialMediaAccount(celebrity.id, 'twitter', `@${celebrity.name.toLowerCase().replace(/\s+/g, '')}`);
      celebrityManagementEngine.createSocialMediaAccount(celebrity.id, 'youtube', `${celebrity.name} Official`);

      // Create sample posts
      celebrityManagementEngine.createSocialMediaPost(
        celebrity.id, 
        'instagram', 
        'Training hard today! 💪 Ready for the next challenge. #boxing #training #glory', 
        ['boxing', 'training', 'glory', 'fitness']
      );
      celebrityManagementEngine.createSocialMediaPost(
        celebrity.id, 
        'twitter', 
        'Big announcement coming soon! Stay tuned 👀 #excited #news', 
        ['excited', 'news', 'announcement']
      );

      // Create sample reputation events
      celebrityManagementEngine.createReputationEvent(
        celebrity.id,
        'achievement',
        'Championship Victory',
        'Won the world championship in a spectacular fight',
        75
      );

      // Create sample investments
      celebrityManagementEngine.addInvestment(
        celebrity.id,
        'stocks',
        'Tech Growth Fund',
        500000,
        0.12,
        'medium'
      );

      // Create sample properties
      celebrityManagementEngine.addProperty(
        celebrity.id,
        'luxury',
        '123 Celebrity Lane, Beverly Hills, CA',
        2500000,
        15000
      );

      // Create sample businesses
      celebrityManagementEngine.addBusiness(
        celebrity.id,
        'Thunder Fitness',
        'fitness',
        'corporation',
        1000000,
        500000,
        100
      );

      // Create sample endorsement deals
      celebrityManagementEngine.createEndorsementDeal(
        celebrity.id,
        'Nike',
        'sports',
        'brand_ambassador',
        2000000,
        24
      );

      // Create sample media interviews
      celebrityManagementEngine.createMediaInterview(
        celebrity.id,
        'ESPN',
        'Mike Johnson',
        'television',
        ['Career highlights', 'Future plans', 'Training routine']
      );

      // Create sample industry contacts
      celebrityManagementEngine.createIndustryContact(
        celebrity.id,
        'Michael Thompson',
        'Universal Sports Management',
        'Senior Agent',
        'sports',
        'agent',
        9
      );
    });
  };

  const loadCelebrityData = (celebrityId: string) => {
    setSocialAccounts(celebrityManagementEngine.getSocialMediaAccounts(celebrityId));
    setSocialPosts(celebrityManagementEngine.getSocialMediaPosts(celebrityId));
    setReputationProfile(celebrityManagementEngine.getReputationProfile(celebrityId));
    setReputationEvents(celebrityManagementEngine.getReputationEvents(celebrityId));
    setFinancialPortfolio(celebrityManagementEngine.getFinancialPortfolio(celebrityId));
    setEndorsementDeals(celebrityManagementEngine.getEndorsementDeals(celebrityId));
    setMediaInterviews(celebrityManagementEngine.getMediaInterviews(celebrityId));
    setIndustryContacts(celebrityManagementEngine.getIndustryContacts(celebrityId));
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'negative': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'mixed': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhanced Celebrity Management Dashboard</h1>
          <p className="text-gray-600">Comprehensive celebrity career management with social media, reputation, and financial tracking</p>
        </div>

        {/* Celebrity Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Celebrity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {celebrities.map(celebrity => (
              <div
                key={celebrity.id}
                onClick={() => setSelectedCelebrity(celebrity)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCelebrity?.id === celebrity.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{celebrity.name}</h3>
                    <p className="text-sm text-gray-600">{celebrity.primary_industry}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{celebrity.popularity}</span>
                    </div>
                    <p className="text-sm text-gray-600">{formatCurrency(celebrity.net_worth || 0)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedCelebrity && (
          <>
            {/* Celebrity Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedCelebrity.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {selectedCelebrity.primary_industry}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Rank #{selectedCelebrity.ranking}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedCelebrity.popularity}</div>
                  <div className="text-sm text-gray-600">Popularity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(selectedCelebrity.net_worth || 0)}</div>
                  <div className="text-sm text-gray-600">Net Worth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatNumber(selectedCelebrity.fan_base_size || 0)}</div>
                  <div className="text-sm text-gray-600">Fan Base</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{selectedCelebrity.public_image}</div>
                  <div className="text-sm text-gray-600">Public Image</div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', label: 'Overview', icon: Users },
                    { id: 'social', label: 'Social Media', icon: Instagram },
                    { id: 'reputation', label: 'Reputation', icon: Star },
                    { id: 'finance', label: 'Finance', icon: DollarSign },
                    { id: 'endorsements', label: 'Endorsements', icon: Briefcase },
                    { id: 'media', label: 'Media', icon: MessageSquare },
                    { id: 'network', label: 'Network', icon: Target },
                    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                    { id: 'career', label: 'Career', icon: Target },
                    { id: 'ai-content', label: 'AI Content', icon: Sparkles }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Health & Wellness */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">Health & Wellness</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Physical Health</span>
                          <span className="font-semibold">{selectedCelebrity.physical_health}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mental Health</span>
                          <span className="font-semibold">{selectedCelebrity.mental_health}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Energy Level</span>
                          <span className="font-semibold">{selectedCelebrity.energy_level}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stress Level</span>
                          <span className="font-semibold">{selectedCelebrity.stress_level}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">Quick Stats</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Experience</span>
                          <span className="font-semibold">{selectedCelebrity.experience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Industry Ranking</span>
                          <span className="font-semibold">#{selectedCelebrity.industry_ranking}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Media Sentiment</span>
                          <div className="flex items-center gap-1">
                            {getSentimentIcon(selectedCelebrity.media_sentiment || 'neutral')}
                            <span className="font-semibold capitalize">{selectedCelebrity.media_sentiment}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="space-y-6">
                  {/* Social Media Accounts */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Social Media Accounts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {socialAccounts.map(account => (
                        <div key={account.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {account.platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
                            {account.platform === 'twitter' && <Twitter className="w-5 h-5 text-blue-500" />}
                            {account.platform === 'youtube' && <Youtube className="w-5 h-5 text-red-500" />}
                            <span className="font-semibold capitalize">{account.platform}</span>
                            {account.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">@{account.username}</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="font-semibold">{formatNumber(account.followers)}</div>
                              <div className="text-gray-600">Followers</div>
                            </div>
                            <div>
                              <div className="font-semibold">{account.engagement_rate.toFixed(1)}%</div>
                              <div className="text-gray-600">Engagement</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Posts */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
                    <div className="space-y-4">
                      {socialPosts.slice(0, 5).map(post => (
                        <div key={post.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {post.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                            {post.platform === 'twitter' && <Twitter className="w-4 h-4 text-blue-500" />}
                            {post.platform === 'youtube' && <Youtube className="w-4 h-4 text-red-500" />}
                            <span className="text-sm text-gray-600 capitalize">{post.platform}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.posted_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-800 mb-3">{post.content}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>❤️ {formatNumber(post.engagement.likes)}</span>
                            <span>💬 {formatNumber(post.engagement.comments)}</span>
                            <span>🔄 {formatNumber(post.engagement.shares)}</span>
                            <span>👁️ {formatNumber(post.reach)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reputation' && (
                <div className="space-y-6">
                  {/* Reputation Profile */}
                  {reputationProfile && (
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Reputation Profile</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{reputationProfile.overall_reputation}</div>
                          <div className="text-sm text-gray-600">Overall Reputation</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{reputationProfile.public_trust}</div>
                          <div className="text-sm text-gray-600">Public Trust</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{reputationProfile.crisis_resilience}</div>
                          <div className="text-sm text-gray-600">Crisis Resilience</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{formatCurrency(reputationProfile.brand_value)}</div>
                          <div className="text-sm text-gray-600">Brand Value</div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm text-gray-600">Media Sentiment:</span>
                        {getSentimentIcon(reputationProfile.media_sentiment)}
                        <span className="font-semibold capitalize">{reputationProfile.media_sentiment}</span>
                      </div>
                    </div>
                  )}

                  {/* Reputation Events */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Recent Reputation Events</h3>
                    <div className="space-y-4">
                      {reputationEvents.slice(0, 5).map(event => (
                        <div key={event.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{event.title}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              event.impact_score > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {event.impact_score > 0 ? '+' : ''}{event.impact_score}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="capitalize">{event.event_type.replace('_', ' ')}</span>
                            <span>{event.duration_days} days</span>
                            <span>{event.media_coverage.toFixed(1)}% coverage</span>
                            <div className="flex items-center gap-1">
                              {getSentimentIcon(event.public_reaction)}
                              <span className="capitalize">{event.public_reaction}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'finance' && (
                <div className="space-y-6">
                  {/* Financial Overview */}
                  {financialPortfolio && (
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Financial Portfolio</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{formatCurrency(financialPortfolio.net_worth)}</div>
                          <div className="text-sm text-gray-600">Net Worth</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{formatCurrency(financialPortfolio.total_assets)}</div>
                          <div className="text-sm text-gray-600">Total Assets</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{formatCurrency(financialPortfolio.liquid_cash)}</div>
                          <div className="text-sm text-gray-600">Liquid Cash</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{formatCurrency(financialPortfolio.monthly_income)}</div>
                          <div className="text-sm text-gray-600">Monthly Income</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Investments */}
                  {financialPortfolio && financialPortfolio.investments.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Investments</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {financialPortfolio.investments.map(investment => (
                          <div key={investment.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{investment.name}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                investment.risk_level === 'low' ? 'bg-green-100 text-green-800' :
                                investment.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {investment.risk_level}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <div className="font-semibold">{formatCurrency(investment.value)}</div>
                                <div className="text-gray-600">Value</div>
                              </div>
                              <div>
                                <div className="font-semibold">{(investment.return_rate * 100).toFixed(1)}%</div>
                                <div className="text-gray-600">Return Rate</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Properties */}
                  {financialPortfolio && financialPortfolio.properties.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Properties</h3>
                      <div className="space-y-4">
                        {financialPortfolio.properties.map(property => (
                          <div key={property.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{property.address}</h4>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium capitalize">
                                {property.type}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="font-semibold">{formatCurrency(property.value)}</div>
                                <div className="text-gray-600">Value</div>
                              </div>
                              {property.monthly_rent && (
                                <div>
                                  <div className="font-semibold">{formatCurrency(property.monthly_rent)}</div>
                                  <div className="text-gray-600">Monthly Rent</div>
                                </div>
                              )}
                              <div>
                                <div className="font-semibold">{(property.appreciation_rate * 100).toFixed(1)}%</div>
                                <div className="text-gray-600">Appreciation</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Businesses */}
                  {financialPortfolio && financialPortfolio.businesses.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Businesses</h3>
                      <div className="space-y-4">
                        {financialPortfolio.businesses.map(business => (
                          <div key={business.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{business.name}</h4>
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium capitalize">
                                {business.type.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="font-semibold">{formatCurrency(business.value)}</div>
                                <div className="text-gray-600">Value</div>
                              </div>
                              <div>
                                <div className="font-semibold">{formatCurrency(business.annual_revenue)}</div>
                                <div className="text-gray-600">Annual Revenue</div>
                              </div>
                              <div>
                                <div className="font-semibold">{(business.profit_margin * 100).toFixed(1)}%</div>
                                <div className="text-gray-600">Profit Margin</div>
                              </div>
                              <div>
                                <div className="font-semibold">{(business.ownership_percentage * 100).toFixed(0)}%</div>
                                <div className="text-gray-600">Ownership</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'endorsements' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Endorsement Deals</h3>
                  <div className="space-y-4">
                    {endorsementDeals.map(deal => (
                      <div key={deal.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{deal.brand_name}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            deal.status === 'active' ? 'bg-green-100 text-green-800' :
                            deal.status === 'expired' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {deal.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-semibold">{formatCurrency(deal.deal_value)}</div>
                            <div className="text-gray-600">Deal Value</div>
                          </div>
                          <div>
                            <div className="font-semibold">{deal.duration_months} months</div>
                            <div className="text-gray-600">Duration</div>
                          </div>
                          <div>
                            <div className="font-semibold">{deal.social_media_obligations}</div>
                            <div className="text-gray-600">Social Media Posts</div>
                          </div>
                          <div>
                            <div className="font-semibold">{deal.public_appearances}</div>
                            <div className="text-gray-600">Public Appearances</div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {new Date(deal.start_date).toLocaleDateString()} - {new Date(deal.end_date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Media Interviews</h3>
                  <div className="space-y-4">
                    {mediaInterviews.map(interview => (
                      <div key={interview.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{interview.outlet_name}</h4>
                          <div className="flex items-center gap-2">
                            {getSentimentIcon(interview.sentiment)}
                            <span className="text-xs text-gray-500 capitalize">{interview.interview_type}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Interviewer: {interview.interviewer}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>👁️ {formatNumber(interview.reach)} reach</span>
                          <span>📊 {interview.impact_score.toFixed(1)} impact</span>
                          <span>📅 {new Date(interview.interview_date).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">Topics: </span>
                          <span className="text-xs text-gray-700">{interview.topics.join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'network' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold mb-4">Industry Network</h3>
                  <div className="space-y-4">
                    {industryContacts.map(contact => (
                      <div key={contact.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{contact.contact_name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium capitalize">
                              {contact.relationship_type}
                            </span>
                            <span className="text-sm text-gray-600">Influence: {contact.influence_level}/10</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{contact.position} at {contact.company}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="capitalize">{contact.industry}</span>
                          <span>📅 {new Date(contact.last_contact).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && selectedCelebrity && (
                <CelebrityAnalytics
                  celebrity={selectedCelebrity}
                  socialPosts={socialPosts}
                  reputationEvents={reputationEvents}
                  financialPortfolio={financialPortfolio}
                  endorsementDeals={endorsementDeals}
                  mediaInterviews={mediaInterviews}
                />
              )}

              {activeTab === 'career' && selectedCelebrity && (
                <CareerPlanner
                  celebrity={selectedCelebrity}
                  projects={projects}
                  milestones={careerMilestones}
                />
              )}

              {activeTab === 'ai-content' && selectedCelebrity && (
                <AIContentGenerator
                  celebrity={selectedCelebrity}
                  onContentGenerated={(content) => {
                    console.log('Generated content:', content);
                    // Here you could save the generated content or trigger other actions
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedCelebrityDashboard; 