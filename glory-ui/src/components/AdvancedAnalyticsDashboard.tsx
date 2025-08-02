import React, { useState, useEffect } from 'react'
import type { Fighter, Match, GameState, FinancialMetrics } from '../lib/unified-types'
import { healthMonitoringSystem } from '../lib/health-monitoring-system'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Trophy, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Star, 
  Heart, 
  Brain,
  Target,
  Zap 
} from 'lucide-react'

interface AdvancedAnalyticsDashboardProps {
  fighters: Fighter[]
  matches: Match[]
  gameState: GameState | null
  financialMetrics: FinancialMetrics | null
}

interface AnalyticsData {
  performanceMetrics: {
    totalFights: number
    winRate: number
    averageRating: number
    topPerformers: Fighter[]
    risingStars: Fighter[]
  }
  financialAnalytics: {
    revenueGrowth: number
    profitMargin: number
    sponsorshipRevenue: number
    ticketSales: number
    ppvRevenue: number
  }
  healthMetrics: {
    averageHealth: number
    injuryRate: number
    medicalClearance: number
    recoveryTime: number
    riskFactors: string[]
  }
  marketAnalytics: {
    fighterValue: number
    marketTrends: string[]
    popularityIndex: number
    sponsorshipOpportunities: number
  }
  predictiveInsights: {
    type: string
    title: string
    description: string
    impact: 'positive' | 'negative' | 'neutral'
    confidence: number
  }[]
}

const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({
  fighters,
  matches,
  gameState,
  financialMetrics
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    calculateAnalytics()
  }, [fighters, matches, gameState, financialMetrics, selectedTimeframe, selectedWeightClass])

  const calculateAnalytics = async () => {
    setLoading(true)
    
    try {
      const data: AnalyticsData = {
        performanceMetrics: calculatePerformanceMetrics(),
        financialAnalytics: calculateFinancialAnalytics(),
        healthMetrics: calculateHealthMetrics(),
        marketAnalytics: await calculateMarketAnalytics(),
        predictiveInsights: calculatePredictiveInsights()
      }
      
      setAnalyticsData(data)
    } catch (error) {
      console.error('Failed to calculate analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculatePerformanceMetrics = () => {
    const completedMatches = matches.filter(m => m.status === 'completed')
    const totalFights = completedMatches.length
    const winRate = totalFights > 0 ? (completedMatches.filter(m => m.result?.winner).length / totalFights) * 100 : 0
    const averageRating = totalFights > 0 ? 
      completedMatches.reduce((sum, m) => sum + (m.result?.rating || 0), 0) / totalFights : 0

    // Top performers (fighters with best win rates)
    const topPerformers = fighters
      .filter(f => (f.record_wins || 0) > 0)
      .sort((a, b) => {
        const aWins = a.record_wins || 0;
        const aLosses = a.record_losses || 0;
        const bWins = b.record_wins || 0;
        const bLosses = b.record_losses || 0;
        return (bWins / (bWins + bLosses)) - (aWins / (aWins + aLosses));
      })
      .slice(0, 5)

    // Rising stars (young fighters with potential)
    const risingStars = fighters
      .filter(f => (f.age || 0) < 25 && (f.record_wins || 0) > 0)
      .sort((a, b) => (b.power || 0) + (b.speed || 0) - (a.power || 0) - (a.speed || 0))
      .slice(0, 5)

    return {
      totalFights,
      winRate,
      averageRating,
      topPerformers,
      risingStars
    }
  }

  const calculateFinancialAnalytics = () => {
    if (!financialMetrics) {
      return {
        revenueGrowth: 0,
        profitMargin: 0,
        sponsorshipRevenue: 0,
        ticketSales: 0,
        ppvRevenue: 0
      }
    }

    return {
      revenueGrowth: financialMetrics.revenueGrowth || 0,
      profitMargin: financialMetrics.profitMargin || 0,
      sponsorshipRevenue: financialMetrics.sponsorshipRevenue || 0,
      ticketSales: financialMetrics.ticketRevenue || 0,
      ppvRevenue: financialMetrics.ppvRevenue || 0
    }
  }

  const calculateHealthMetrics = () => {
    const healthAssessments = fighters.map(f => healthMonitoringSystem.assessFighterHealth(f))
    const averageHealth = healthAssessments.reduce((sum, h) => sum + h.overallHealth, 0) / healthAssessments.length
    const injuryRate = (healthAssessments.filter(h => h.recoveryStatus === 'injured').length / healthAssessments.length) * 100
    const medicalClearance = healthAssessments.filter(h => h.medicalClearance).length
    const recoveryTime = healthAssessments
      .filter(h => h.recoveryStatus === 'injured')
      .reduce((sum, h) => sum + h.restrictions.length, 0) * 7 // Average 7 days per restriction

    const riskFactors = []
    if (injuryRate > 20) riskFactors.push('High injury rate detected')
    if (averageHealth < 80) riskFactors.push('Overall health below optimal levels')
    if (medicalClearance < fighters.length * 0.8) riskFactors.push('Multiple fighters need medical clearance')

    return {
      averageHealth,
      injuryRate,
      medicalClearance,
      recoveryTime,
      riskFactors
    }
  }

  const calculateMarketAnalytics = async () => {
    // Simulate market analysis
    const fighterValue = fighters.reduce((sum, f) => sum + (f.popularity || 0), 0) / fighters.length
    const popularityIndex = fighters.reduce((sum, f) => sum + (f.popularity || 0), 0) / fighters.length
    
    const marketTrends = []
    if (popularityIndex > 70) marketTrends.push('High market interest in fighters')
    if (fighterValue > 50) marketTrends.push('Strong fighter valuation')
    if (fighters.filter(f => f.age && f.age < 25).length > fighters.length * 0.3) {
      marketTrends.push('Young talent pool attracting sponsors')
    }

    const sponsorshipOpportunities = fighters.filter(f => (f.popularity || 0) > 60).length

    return {
      fighterValue,
      marketTrends,
      popularityIndex,
      sponsorshipOpportunities
    }
  }

  const calculatePredictiveInsights = () => {
    const insights = []

    // Performance predictions
    const youngFighters = fighters.filter(f => (f.age || 0) < 25)
    if (youngFighters.length > 0) {
      insights.push({
        type: 'performance',
        title: 'Young Talent Rising',
        description: `${youngFighters.length} fighters under 25 showing high potential`,
        impact: 'positive' as const,
        confidence: 85
      })
    }

    // Financial predictions
    if (financialMetrics && financialMetrics.revenueGrowth > 10) {
      insights.push({
        type: 'financial',
        title: 'Strong Revenue Growth',
        description: 'Revenue growing at healthy rate, consider expansion',
        impact: 'positive' as const,
        confidence: 90
      })
    }

    // Health predictions
    const healthMetrics = calculateHealthMetrics()
    if (healthMetrics.injuryRate > 15) {
      insights.push({
        type: 'health',
        title: 'Injury Risk Alert',
        description: 'High injury rate detected, implement prevention measures',
        impact: 'negative' as const,
        confidence: 75
      })
    }

    // Market predictions
    const popularFighters = fighters.filter(f => (f.popularity || 0) > 70)
    if (popularFighters.length > 0) {
      insights.push({
        type: 'market',
        title: 'Sponsorship Opportunities',
        description: `${popularFighters.length} fighters ready for major sponsorships`,
        impact: 'positive' as const,
        confidence: 80
      })
    }

    return insights
  }

  const getMetricColor = (value: number, threshold: number = 50) => {
    if (value >= threshold) return 'text-green-600'
    if (value >= threshold * 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMetricIcon = (value: number, threshold: number = 50) => {
    if (value >= threshold) return <TrendingUp className="w-5 h-5 text-green-600" />
    if (value >= threshold * 0.7) return <Activity className="w-5 h-5 text-yellow-600" />
    return <TrendingDown className="w-5 h-5 text-red-600" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Calculating analytics...</p>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="text-center text-gray-500">
        No analytics data available
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
          Advanced Analytics Dashboard
        </h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <select
            value={selectedWeightClass}
            onChange={(e) => setSelectedWeightClass(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Weight Classes</option>
            <option value="Heavyweight">Heavyweight</option>
            <option value="Light Heavyweight">Light Heavyweight</option>
            <option value="Middleweight">Middleweight</option>
            <option value="Welterweight">Welterweight</option>
            <option value="Lightweight">Lightweight</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
            <Trophy className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Fights</span>
              <span className="font-semibold">{analyticsData.performanceMetrics.totalFights}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Win Rate</span>
              <div className="flex items-center">
                {getMetricIcon(analyticsData.performanceMetrics.winRate)}
                <span className={`font-semibold ml-1 ${getMetricColor(analyticsData.performanceMetrics.winRate)}`}>
                  {analyticsData.performanceMetrics.winRate.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Rating</span>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-semibold">{analyticsData.performanceMetrics.averageRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Financial</h3>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revenue Growth</span>
              <div className="flex items-center">
                {getMetricIcon(analyticsData.financialAnalytics.revenueGrowth)}
                <span className={`font-semibold ml-1 ${getMetricColor(analyticsData.financialAnalytics.revenueGrowth)}`}>
                  {analyticsData.financialAnalytics.revenueGrowth.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Profit Margin</span>
              <div className="flex items-center">
                {getMetricIcon(analyticsData.financialAnalytics.profitMargin)}
                <span className={`font-semibold ml-1 ${getMetricColor(analyticsData.financialAnalytics.profitMargin)}`}>
                  {analyticsData.financialAnalytics.profitMargin.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sponsorship Rev</span>
              <span className="font-semibold">${(analyticsData.financialAnalytics.sponsorshipRevenue / 1000).toFixed(1)}k</span>
            </div>
          </div>
        </div>

        {/* Health Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Health</h3>
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Health</span>
              <div className="flex items-center">
                {getMetricIcon(analyticsData.healthMetrics.averageHealth)}
                <span className={`font-semibold ml-1 ${getMetricColor(analyticsData.healthMetrics.averageHealth)}`}>
                  {analyticsData.healthMetrics.averageHealth.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Injury Rate</span>
              <div className="flex items-center">
                {analyticsData.healthMetrics.injuryRate > 15 ? 
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-1" /> :
                  <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                }
                <span className={`font-semibold ${analyticsData.healthMetrics.injuryRate > 15 ? 'text-red-600' : 'text-green-600'}`}>
                  {analyticsData.healthMetrics.injuryRate.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Medical Clearance</span>
              <span className="font-semibold">{analyticsData.healthMetrics.medicalClearance}/{fighters.length}</span>
            </div>
          </div>
        </div>

        {/* Market Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Market</h3>
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Fighter Value</span>
              <div className="flex items-center">
                {getMetricIcon(analyticsData.marketAnalytics.fighterValue)}
                <span className={`font-semibold ml-1 ${getMetricColor(analyticsData.marketAnalytics.fighterValue)}`}>
                  {analyticsData.marketAnalytics.fighterValue.toFixed(0)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Popularity Index</span>
              <div className="flex items-center">
                {getMetricIcon(analyticsData.marketAnalytics.popularityIndex)}
                <span className={`font-semibold ml-1 ${getMetricColor(analyticsData.marketAnalytics.popularityIndex)}`}>
                  {analyticsData.marketAnalytics.popularityIndex.toFixed(0)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sponsorship Opps</span>
              <span className="font-semibold">{analyticsData.marketAnalytics.sponsorshipOpportunities}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Predictive Insights */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          Predictive Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.predictiveInsights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              insight.impact === 'positive' ? 'border-green-200 bg-green-50' :
              insight.impact === 'negative' ? 'border-red-200 bg-red-50' :
              'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                <div className="flex items-center">
                  {insight.impact === 'positive' ? 
                    <CheckCircle className="w-4 h-4 text-green-600" /> :
                    insight.impact === 'negative' ?
                    <AlertTriangle className="w-4 h-4 text-red-600" /> :
                    <Activity className="w-4 h-4 text-gray-600" />
                  }
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">{insight.type}</span>
                <span className="text-xs font-medium text-gray-700">{insight.confidence}% confidence</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
            Top Performers
          </h3>
          <div className="space-y-3">
            {analyticsData.performanceMetrics.topPerformers.map((fighter, index) => (
              <div key={fighter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{fighter.name}</p>
                    <p className="text-sm text-gray-600">{fighter.weight_class}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{fighter.record_wins || 0}-{fighter.record_losses || 0}</p>
                  <p className="text-xs text-gray-500">
                    {(((fighter.record_wins || 0) / ((fighter.record_wins || 0) + (fighter.record_losses || 0))) * 100).toFixed(0)}% win rate
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-600" />
            Rising Stars
          </h3>
          <div className="space-y-3">
            {analyticsData.performanceMetrics.risingStars.map((fighter, index) => (
              <div key={fighter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{fighter.name}</p>
                    <p className="text-sm text-gray-600">Age: {fighter.age}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{(fighter.power || 0) + (fighter.speed || 0)}</p>
                  <p className="text-xs text-gray-500">Power + Speed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Market Trends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.marketAnalytics.marketTrends.map((trend, index) => (
            <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm text-gray-700">{trend}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Risk Factors */}
      {analyticsData.healthMetrics.riskFactors.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            Health Risk Factors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyticsData.healthMetrics.riskFactors.map((factor, index) => (
              <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                <span className="text-sm text-gray-700">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvancedAnalyticsDashboard 