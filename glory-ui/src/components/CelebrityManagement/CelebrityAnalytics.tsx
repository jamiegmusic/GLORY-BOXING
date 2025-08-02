import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  Target,
  Award,
  DollarSign,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import type { 
  Celebrity, 
  SocialMediaPost, 
  ReputationEvent, 
  FinancialPortfolio,
  EndorsementDeal,
  MediaInterview
} from '../../lib/unified-types';

interface CelebrityAnalyticsProps {
  celebrity: Celebrity;
  socialPosts: SocialMediaPost[];
  reputationEvents: ReputationEvent[];
  financialPortfolio: FinancialPortfolio | null;
  endorsementDeals: EndorsementDeal[];
  mediaInterviews: MediaInterview[];
}

const CelebrityAnalytics: React.FC<CelebrityAnalyticsProps> = ({
  celebrity,
  socialPosts,
  reputationEvents,
  financialPortfolio,
  endorsementDeals,
  mediaInterviews
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeMetric, setActiveMetric] = useState<'engagement' | 'reputation' | 'finance' | 'career'>('engagement');

  // Calculate analytics data
  const calculateEngagementMetrics = () => {
    const recentPosts = socialPosts.filter(post => {
      const postDate = new Date(post.posted_at);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - getDaysFromRange(timeRange));
      return postDate >= cutoffDate;
    });

    const totalEngagement = recentPosts.reduce((sum, post) => 
      sum + post.engagement.likes + post.engagement.comments + post.engagement.shares, 0
    );
    const avgEngagement = recentPosts.length > 0 ? totalEngagement / recentPosts.length : 0;
    const viralPosts = recentPosts.filter(post => post.viral_score > 0.5).length;
    const engagementGrowth = recentPosts.length > 0 ? 
      (totalEngagement / recentPosts.length) / Math.max(1, celebrity.social_media_skills?.audience_engagement || 1) * 100 : 0;

    return {
      totalPosts: recentPosts.length,
      totalEngagement,
      avgEngagement: Math.round(avgEngagement),
      viralPosts,
      engagementGrowth: Math.round(engagementGrowth),
      topPlatform: getTopPlatform(recentPosts)
    };
  };

  const calculateReputationMetrics = () => {
    const recentEvents = reputationEvents.filter(event => {
      const eventDate = new Date(event.occurred_at);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - getDaysFromRange(timeRange));
      return eventDate >= cutoffDate;
    });

    const positiveEvents = recentEvents.filter(event => event.impact_score > 0);
    const negativeEvents = recentEvents.filter(event => event.impact_score < 0);
    const totalImpact = recentEvents.reduce((sum, event) => sum + event.impact_score, 0);
    const avgImpact = recentEvents.length > 0 ? totalImpact / recentEvents.length : 0;
    const reputationTrend = recentEvents.length > 0 ? 
      (positiveEvents.length - negativeEvents.length) / recentEvents.length * 100 : 0;

    return {
      totalEvents: recentEvents.length,
      positiveEvents: positiveEvents.length,
      negativeEvents: negativeEvents.length,
      avgImpact: Math.round(avgImpact),
      reputationTrend: Math.round(reputationTrend),
      topEventType: getTopEventType(recentEvents)
    };
  };

  const calculateFinancialMetrics = () => {
    if (!financialPortfolio) return null;

    const portfolioGrowth = financialPortfolio.net_worth > 0 ? 
      ((financialPortfolio.total_assets - financialPortfolio.net_worth) / financialPortfolio.net_worth) * 100 : 0;
    
    const investmentDiversity = financialPortfolio.investments.length + 
      financialPortfolio.properties.length + 
      financialPortfolio.businesses.length;

    const monthlyIncomeGrowth = financialPortfolio.monthly_income > 0 ? 
      (financialPortfolio.monthly_income / Math.max(1, celebrity.net_worth || 1)) * 100 : 0;

    return {
      netWorth: financialPortfolio.net_worth,
      totalAssets: financialPortfolio.total_assets,
      liquidCash: financialPortfolio.liquid_cash,
      monthlyIncome: financialPortfolio.monthly_income,
      portfolioGrowth: Math.round(portfolioGrowth),
      investmentDiversity,
      monthlyIncomeGrowth: Math.round(monthlyIncomeGrowth)
    };
  };

  const calculateCareerMetrics = () => {
    const activeDeals = endorsementDeals.filter(deal => deal.status === 'active');
    const totalDealValue = activeDeals.reduce((sum, deal) => sum + deal.deal_value, 0);
    const avgDealValue = activeDeals.length > 0 ? totalDealValue / activeDeals.length : 0;

    const recentInterviews = mediaInterviews.filter(interview => {
      const interviewDate = new Date(interview.interview_date);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - getDaysFromRange(timeRange));
      return interviewDate >= cutoffDate;
    });

    const positiveInterviews = recentInterviews.filter(interview => interview.sentiment === 'positive');
    const totalReach = recentInterviews.reduce((sum, interview) => sum + interview.reach, 0);
    const avgReach = recentInterviews.length > 0 ? totalReach / recentInterviews.length : 0;

    return {
      activeDeals: activeDeals.length,
      totalDealValue,
      avgDealValue: Math.round(avgDealValue),
      recentInterviews: recentInterviews.length,
      positiveInterviews: positiveInterviews.length,
      avgReach: Math.round(avgReach),
      careerGrowth: Math.round((celebrity.popularity || 0) / Math.max(1, celebrity.experience || 1) * 100)
    };
  };

  const getDaysFromRange = (range: string) => {
    switch (range) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 30;
    }
  };

  const getTopPlatform = (posts: SocialMediaPost[]) => {
    const platformCounts = posts.reduce((acc, post) => {
      acc[post.platform] = (acc[post.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(platformCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
  };

  const getTopEventType = (events: ReputationEvent[]) => {
    const typeCounts = events.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
  };

  const engagementMetrics = calculateEngagementMetrics();
  const reputationMetrics = calculateReputationMetrics();
  const financialMetrics = calculateFinancialMetrics();
  const careerMetrics = calculateCareerMetrics();

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

  const getGrowthIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Metric Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'engagement', label: 'Engagement', icon: Users },
          { id: 'reputation', label: 'Reputation', icon: Award },
          { id: 'finance', label: 'Finance', icon: DollarSign },
          { id: 'career', label: 'Career', icon: Target }
        ].map(metric => (
          <button
            key={metric.id}
            onClick={() => setActiveMetric(metric.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeMetric === metric.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <metric.icon className="w-4 h-4" />
            {metric.label}
          </button>
        ))}
      </div>

      {/* Engagement Analytics */}
      {activeMetric === 'engagement' && engagementMetrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Posts</h3>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{engagementMetrics.totalPosts}</div>
              <p className="text-sm text-gray-600 mt-2">Posts in selected period</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Avg Engagement</h3>
                <BarChart3 className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{formatNumber(engagementMetrics.avgEngagement)}</div>
              <div className="flex items-center gap-2 mt-2">
                {getGrowthIcon(engagementMetrics.engagementGrowth)}
                <span className={`text-sm ${engagementMetrics.engagementGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {engagementMetrics.engagementGrowth > 0 ? '+' : ''}{engagementMetrics.engagementGrowth}%
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Viral Posts</h3>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{engagementMetrics.viralPosts}</div>
              <p className="text-sm text-gray-600 mt-2">High viral score posts</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">Instagram</div>
                <div className="text-sm text-gray-600">Primary platform</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{engagementMetrics.topPlatform}</div>
                <div className="text-sm text-gray-600">Most active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatNumber(engagementMetrics.totalEngagement)}</div>
                <div className="text-sm text-gray-600">Total engagement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{Math.round(engagementMetrics.avgEngagement / Math.max(1, engagementMetrics.totalPosts))}</div>
                <div className="text-sm text-gray-600">Engagement per post</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reputation Analytics */}
      {activeMetric === 'reputation' && reputationMetrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Total Events</h3>
                <Award className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{reputationMetrics.totalEvents}</div>
              <p className="text-sm text-gray-600 mt-2">Reputation events</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Avg Impact</h3>
                <BarChart3 className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{reputationMetrics.avgImpact}</div>
              <div className="flex items-center gap-2 mt-2">
                {getGrowthIcon(reputationMetrics.reputationTrend)}
                <span className={`text-sm ${reputationMetrics.reputationTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {reputationMetrics.reputationTrend > 0 ? '+' : ''}{reputationMetrics.reputationTrend}%
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Positive Events</h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{reputationMetrics.positiveEvents}</div>
              <p className="text-sm text-gray-600 mt-2">vs {reputationMetrics.negativeEvents} negative</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Event Analysis</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{reputationMetrics.positiveEvents}</div>
                <div className="text-sm text-gray-600">Positive events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{reputationMetrics.negativeEvents}</div>
                <div className="text-sm text-gray-600">Negative events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{reputationMetrics.topEventType}</div>
                <div className="text-sm text-gray-600">Most common type</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{reputationMetrics.reputationTrend}%</div>
                <div className="text-sm text-gray-600">Reputation trend</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Analytics */}
      {activeMetric === 'finance' && financialMetrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Net Worth</h3>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{formatCurrency(financialMetrics.netWorth)}</div>
              <div className="flex items-center gap-2 mt-2">
                {getGrowthIcon(financialMetrics.portfolioGrowth)}
                <span className={`text-sm ${financialMetrics.portfolioGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {financialMetrics.portfolioGrowth > 0 ? '+' : ''}{financialMetrics.portfolioGrowth}%
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Monthly Income</h3>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{formatCurrency(financialMetrics.monthlyIncome)}</div>
              <div className="flex items-center gap-2 mt-2">
                {getGrowthIcon(financialMetrics.monthlyIncomeGrowth)}
                <span className={`text-sm ${financialMetrics.monthlyIncomeGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {financialMetrics.monthlyIncomeGrowth > 0 ? '+' : ''}{financialMetrics.monthlyIncomeGrowth}%
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Investment Diversity</h3>
                <PieChart className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{financialMetrics.investmentDiversity}</div>
              <p className="text-sm text-gray-600 mt-2">Total investments</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Portfolio Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(financialMetrics.totalAssets)}</div>
                <div className="text-sm text-gray-600">Total assets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(financialMetrics.liquidCash)}</div>
                <div className="text-sm text-gray-600">Liquid cash</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{financialMetrics.investmentDiversity}</div>
                <div className="text-sm text-gray-600">Diverse investments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{financialMetrics.portfolioGrowth}%</div>
                <div className="text-sm text-gray-600">Portfolio growth</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Career Analytics */}
      {activeMetric === 'career' && careerMetrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Active Deals</h3>
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{careerMetrics.activeDeals}</div>
              <p className="text-sm text-gray-600 mt-2">Endorsement deals</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Avg Deal Value</h3>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{formatCurrency(careerMetrics.avgDealValue)}</div>
              <p className="text-sm text-gray-600 mt-2">Per endorsement</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Career Growth</h3>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{careerMetrics.careerGrowth}%</div>
              <p className="text-sm text-gray-600 mt-2">Popularity/Experience ratio</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Media Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{careerMetrics.recentInterviews}</div>
                <div className="text-sm text-gray-600">Recent interviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{careerMetrics.positiveInterviews}</div>
                <div className="text-sm text-gray-600">Positive coverage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatNumber(careerMetrics.avgReach)}</div>
                <div className="text-sm text-gray-600">Avg reach</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(careerMetrics.totalDealValue)}</div>
                <div className="text-sm text-gray-600">Total deal value</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CelebrityAnalytics; 