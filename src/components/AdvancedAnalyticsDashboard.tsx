import React, { useState, useEffect } from 'react'
import { Fighter, Match, GameState, FinancialMetrics } from '../lib/unified-types'
import { realWorldRankingsAPI } from '../lib/real-world-rankings-api'
import { healthMonitoringSystem } from '../lib/health-monitoring-system'
import { businessEngine } from '../lib/business-engine'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Trophy, 
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Star,
  Zap,
  Shield,
  Heart,
  Brain,
  Eye
} from 'lucide-react'

interface AdvancedAnalyticsDashboardProps {
  fighters: Fighter[]
  matches: Match[]
  gameState: GameState
  financialMetrics: FinancialMetrics
}

interface AnalyticsData {
  performanceMetrics: any
  financialAnalytics: any
  healthMetrics: any
  marketAnalytics: any
  predictiveInsights: any
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
    const filteredFighters = selectedWeightClass === 'all' 
      ? fighters 
      : fighters.filter(f => f.weight_class === selectedWeightClass)

    const totalFights = matches.length
    const totalFighters = filteredFighters.length
    const activeFighters = filteredFighters.filter(f => f.status !== 'retired').length

    const avgRecord = filteredFighters.reduce((sum, f) => {
      const totalFights = f.record_wins + f.record_losses + f.record_draws
      return sum + (totalFights > 0 ? f.record_wins / totalFights : 0)
    }, 0) / totalFighters

    const topPerformers = filteredFighters
      .sort((a, b) => (b.record_wins - b.record_losses) - (a.record_wins - a.record_losses))
      .slice(0, 5)

    const weightClassDistribution = fighters.reduce((acc, f) => {
      acc[f.weight_class] = (acc[f.weight_class] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalFights,
      totalFighters,
      activeFighters,
      avgRecord: avgRecord * 100,
      topPerformers,
      weightClassDistribution,
      avgAge: filteredFighters.reduce((sum, f) => sum + (f.age || 0), 0) / totalFighters,
      avgExperience: filteredFighters.reduce((sum, f) => sum + (f.experience || 0), 0) / totalFighters
    }
  }

  const calculateFinancialAnalytics = () => {
    const revenueGrowth = financialMetrics.revenueGrowth
    const profitMargin = financialMetrics.profitMargin
    const totalRevenue = financialMetrics.totalRevenue
    const totalExpenses = financialMetrics.totalExpenses

    const revenueBreakdown = {
      ticketSales: financialMetrics.ticketRevenue,
      ppvSales: financialMetrics.ppvRevenue,
      sponsorship: financialMetrics.sponsorshipRevenue,
      merchandise: financialMetrics.merchandiseRevenue
    }

    const fighterSalaries = fighters.reduce((sum, f) => sum + (f.contract?.base_salary || 0), 0)
    const avgFighterSalary = fighterSalaries / fighters.length

    const topEarners = fighters
      .sort((a, b) => (b.contract?.base_salary || 0) - (a.contract?.base_salary || 0))
      .slice(0, 5)

    return {
      revenueGrowth,
      profitMargin,
      totalRevenue,
      totalExpenses,
      revenueBreakdown,
      fighterSalaries,
      avgFighterSalary,
      topEarners,
      revenuePerFighter: totalRevenue / fighters.length,
      expenseRatio: totalExpenses / totalRevenue
    }
  }

  const calculateHealthMetrics = () => {
    const healthAssessments = fighters.map(f => healthMonitoringSystem.assessFighterHealth(f))
    
    const healthyFighters = healthAssessments.filter(h => h.overallHealth >= 80).length
    const injuredFighters = healthAssessments.filter(h => h.overallHealth < 80).length
    const criticalFighters = healthAssessments.filter(h => h.overallHealth < 60).length

    const avgHealth = healthAssessments.reduce((sum, h) => sum + h.overallHealth, 0) / healthAssessments.length
    const avgInjuryRisk = healthAssessments.reduce((sum, h) => sum + h.injuryRisk, 0) / healthAssessments.length

    const injuryTypes = fighters.reduce((acc, f) => {
      if (f.injuries) {
        f.injuries.forEach(injury => {
          acc[injury.type] = (acc[injury.type] || 0) + 1
        })
      }
      return acc
    }, {} as Record<string, number>)

    const medicalClearance = healthAssessments.filter(h => h.medicalClearance).length

    return {
      healthyFighters,
      injuredFighters,
      criticalFighters,
      avgHealth,
      avgInjuryRisk,
      injuryTypes,
      medicalClearance,
      clearanceRate: (medicalClearance / fighters.length) * 100
    }
  }

  const calculateMarketAnalytics = async () => {
    const realWorldRankings = await realWorldRankingsAPI.fetchRealWorldRankings()
    
    const marketValueAnalysis = fighters.map(f => ({
      fighter: f,
      marketValue: businessEngine.calculateFighterMarketValue(f),
      marketAnalysis: businessEngine.analyzeFighterMarketValue(f)
    }))

    const totalMarketValue = marketValueAnalysis.reduce((sum, m) => sum + m.marketValue, 0)
    const avgMarketValue = totalMarketValue / fighters.length

    const topMarketValue = marketValueAnalysis
      .sort((a, b) => b.marketValue - a.marketValue)
      .slice(0, 5)

    const weightClassMarketValue = fighters.reduce((acc, f) => {
      const marketValue = businessEngine.calculateFighterMarketValue(f)
      acc[f.weight_class] = (acc[f.weight_class] || 0) + marketValue
      return acc
    }, {} as Record<string, number>)

    return {
      realWorldRankings,
      marketValueAnalysis,
      totalMarketValue,
      avgMarketValue,
      topMarketValue,
      weightClassMarketValue
    }
  }

  const calculatePredictiveInsights = () => {
    const insights = []

    // Performance predictions
    const youngFighters = fighters.filter(f => (f.age || 0) < 25)
    const experiencedFighters = fighters.filter(f => (f.experience || 0) > 10)
    
    if (youngFighters.length > 0) {
      insights.push({
        type: 'performance',
        title: 'Young Talent Rising',
        description: `${youngFighters.length} fighters under 25 showing high potential`,
        impact: 'positive',
        confidence: 85
      })
    }

    // Financial predictions
    if (financialMetrics.revenueGrowth > 10) {
      insights.push({
        type: 'financial',
        title: 'Strong Revenue Growth',
        description: 'Revenue growing at healthy rate, consider expansion',
        impact: 'positive',
        confidence: 90
      })
    }

    // Health predictions
    const highRiskFighters = fighters.filter(f => {
      const health = healthMonitoringSystem.assessFighterHealth(f)
      return health.injuryRisk > 70
    })

    if (highRiskFighters.length > 0) {
      insights.push({
        type: 'health',
        title: 'Injury Risk Alert',
        description: `${highRiskFighters.length} fighters at high injury risk`,
        impact: 'negative',
        confidence: 75
      })
    }

    return insights
  }

  const getMetricColor = (value: number, threshold: number = 0) => {
    if (value >= threshold + 20) return 'text-green-600'
    if (value >= threshold) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMetricIcon = (value: number, threshold: number = 0) => {
    if (value >= threshold + 20) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (value >= threshold) return <Activity className="w-4 h-4 text-yellow-600" />
    return <TrendingDown className="w-4 h-4 text-red-600" />
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500 text-center">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics Dashboard</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
            <option value="year">Year</option>
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

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-900">
                £{analyticsData.financialAnalytics.totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex items-center mt-2">
            {getMetricIcon(analyticsData.financialAnalytics.revenueGrowth)}
            <span className={`text-sm font-medium ${getMetricColor(analyticsData.financialAnalytics.revenueGrowth)}`}>
              {analyticsData.financialAnalytics.revenueGrowth.toFixed(1)}% growth
            </span>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Active Fighters</p>
              <p className="text-2xl font-bold text-green-900">
                {analyticsData.performanceMetrics.activeFighters}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <div className="flex items-center mt-2">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              {analyticsData.performanceMetrics.avgRecord.toFixed(1)}% win rate
            </span>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Avg Health</p>
              <p className="text-2xl font-bold text-yellow-900">
                {analyticsData.healthMetrics.avgHealth.toFixed(1)}%
              </p>
            </div>
            <Heart className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="flex items-center mt-2">
            {getMetricIcon(analyticsData.healthMetrics.avgHealth, 80)}
            <span className={`text-sm font-medium ${getMetricColor(analyticsData.healthMetrics.avgHealth, 80)}`}>
              {analyticsData.healthMetrics.healthyFighters} healthy
            </span>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Market Value</p>
              <p className="text-2xl font-bold text-purple-900">
                ${analyticsData.marketAnalytics.avgMarketValue.toLocaleString()}
              </p>
            </div>
            <Trophy className="w-8 h-8 text-purple-600" />
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">
              Avg per fighter
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Analytics */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Performance Analytics
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Fights</span>
              <span className="font-semibold">{analyticsData.performanceMetrics.totalFights}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Age</span>
              <span className="font-semibold">{analyticsData.performanceMetrics.avgAge.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Experience</span>
              <span className="font-semibold">{analyticsData.performanceMetrics.avgExperience.toFixed(1)} years</span>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Top Performers</h4>
              <div className="space-y-2">
                {analyticsData.performanceMetrics.topPerformers.slice(0, 3).map((fighter: Fighter, index: number) => (
                  <div key={fighter.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <span className="w-4 h-4 bg-yellow-500 text-white rounded-full text-xs flex items-center justify-center mr-2">
                        {index + 1}
                      </span>
                      {fighter.name}
                    </span>
                    <span className="font-medium">{fighter.record_wins}-{fighter.record_losses}-{fighter.record_draws}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Analytics */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Financial Analytics
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Profit Margin</span>
              <span className={`font-semibold ${getMetricColor(analyticsData.financialAnalytics.profitMargin)}`}>
                {analyticsData.financialAnalytics.profitMargin.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Fighter Salary</span>
              <span className="font-semibold">£{analyticsData.financialAnalytics.avgFighterSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Revenue per Fighter</span>
              <span className="font-semibold">£{analyticsData.financialAnalytics.revenuePerFighter.toLocaleString()}</span>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Revenue Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ticket Sales</span>
                  <span className="font-medium">${analyticsData.financialAnalytics.revenueBreakdown.ticketSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>PPV Sales</span>
                  <span className="font-medium">${analyticsData.financialAnalytics.revenueBreakdown.ppvSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sponsorship</span>
                  <span className="font-medium">${analyticsData.financialAnalytics.revenueBreakdown.sponsorship.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Health Analytics */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Health Analytics
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Healthy Fighters</span>
              <span className="font-semibold text-green-600">{analyticsData.healthMetrics.healthyFighters}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Injured Fighters</span>
              <span className="font-semibold text-yellow-600">{analyticsData.healthMetrics.injuredFighters}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Critical Condition</span>
              <span className="font-semibold text-red-600">{analyticsData.healthMetrics.criticalFighters}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Medical Clearance Rate</span>
              <span className="font-semibold">{analyticsData.healthMetrics.clearanceRate.toFixed(1)}%</span>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Injury Types</h4>
              <div className="space-y-1">
                {Object.entries(analyticsData.healthMetrics.injuryTypes).map(([type, count]) => (
                  <div key={type} className="flex justify-between text-sm">
                    <span className="capitalize">{type.replace('_', ' ')}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Market Analytics */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Market Analytics
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Market Value</span>
              <span className="font-semibold">${analyticsData.marketAnalytics.totalMarketValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Real-world Rankings</span>
              <span className="font-semibold">{analyticsData.marketAnalytics.realWorldRankings.length}</span>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Top Market Value</h4>
              <div className="space-y-2">
                {analyticsData.marketAnalytics.topMarketValue.slice(0, 3).map((item: any, index: number) => (
                  <div key={item.fighter.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <span className="w-4 h-4 bg-purple-500 text-white rounded-full text-xs flex items-center justify-center mr-2">
                        {index + 1}
                      </span>
                      {item.fighter.name}
                    </span>
                    <span className="font-medium">${item.marketValue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Predictive Insights */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2" />
          Predictive Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.predictiveInsights.map((insight: any, index: number) => (
            <div key={index} className={`p-4 rounded-lg border ${
              insight.impact === 'positive' ? 'border-green-200 bg-green-50' :
              insight.impact === 'negative' ? 'border-red-200 bg-red-50' :
              'border-yellow-200 bg-yellow-50'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{insight.title}</h4>
                {insight.impact === 'positive' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : insight.impact === 'negative' ? (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                ) : (
                  <Activity className="w-5 h-5 text-yellow-600" />
                )}
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
    </div>
  )
}

export default AdvancedAnalyticsDashboard 