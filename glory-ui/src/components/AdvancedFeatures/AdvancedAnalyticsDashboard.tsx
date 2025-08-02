import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { advancedAnalytics } from '../../lib/advanced-analytics';
import type { AnalyticsDashboard, PredictiveAnalytics } from '../../lib/advanced-analytics';

interface AdvancedAnalyticsDashboardProps {
  currentUserId: string;
}

const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = () => {
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('performance');
  const [predictions, setPredictions] = useState<PredictiveAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Generate dashboard data
        const dashboardData = advancedAnalytics.generateDashboard();
        setDashboard(dashboardData);
        
        // Generate predictions
        const predictionsData = advancedAnalytics.generatePredictions();
        setPredictions(predictionsData);
        
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
    
    // Set up periodic updates
    const interval = setInterval(loadDashboard, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'performance':
        return 'text-blue-600';
      case 'financial':
        return 'text-green-600';
      case 'social':
        return 'text-purple-600';
      case 'technical':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Advanced Analytics Dashboard</h3>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="performance">Performance</option>
            <option value="financial">Financial</option>
            <option value="social">Social</option>
            <option value="technical">Technical</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total Players</p>
              <p className="text-2xl font-bold text-blue-900">{dashboard.overview.totalPlayers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Active Matches</p>
              <p className="text-2xl font-bold text-green-900">{dashboard.overview.activeMatches}</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-900">{formatCurrency(dashboard.overview.totalRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">System Health</p>
              <p className="text-2xl font-bold text-orange-900">{dashboard.overview.systemHealth}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Trends */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Key Trends</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboard.trends.map((trend, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{trend.metric}</span>
                {getTrendIcon(trend.trend)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">{trend.currentValue}</span>
                <span className={`text-sm ${trend.changePercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.changePercentage > 0 ? '+' : ''}{trend.changePercentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Analytics */}
      {selectedMetric === 'performance' && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Performance Analytics</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Win Rate Distribution</h5>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dashboard.performance.slice(0, 5).map(p => ({
                  name: p.playerId,
                  winRate: p.winRate * 100,
                  avgScore: p.averageScore
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="winRate" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Performance Metrics</h5>
              <div className="space-y-3">
                {dashboard.performance.slice(0, 5).map((player, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                    <div>
                      <div className="font-medium text-gray-900">Player {player.playerId}</div>
                      <div className="text-sm text-gray-600">
                        Win Rate: {formatPercentage(player.winRate)} • Score: {player.averageScore}
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      player.trend === 'improving' ? 'text-green-600' :
                      player.trend === 'declining' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {player.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Analytics */}
      {selectedMetric === 'financial' && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Financial Analytics</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Revenue Growth</h5>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={[
                  { month: 'Jan', revenue: dashboard.financial.revenue * 0.8 },
                  { month: 'Feb', revenue: dashboard.financial.revenue * 0.9 },
                  { month: 'Mar', revenue: dashboard.financial.revenue }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Financial Metrics</h5>
              <div className="space-y-3">
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-medium">{formatCurrency(dashboard.financial.revenue)}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Profit</span>
                  <span className="font-medium">{formatCurrency(dashboard.financial.profit)}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Profit Margin</span>
                  <span className="font-medium">{formatPercentage(dashboard.financial.profitMargin)}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Growth Rate</span>
                  <span className="font-medium">{formatPercentage(dashboard.financial.revenueGrowth)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Social Analytics */}
      {selectedMetric === 'social' && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Social Analytics</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Player Engagement</h5>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  { day: 'Mon', active: dashboard.social.activePlayers * 0.8 },
                  { day: 'Tue', active: dashboard.social.activePlayers * 0.9 },
                  { day: 'Wed', active: dashboard.social.activePlayers },
                  { day: 'Thu', active: dashboard.social.activePlayers * 0.95 },
                  { day: 'Fri', active: dashboard.social.activePlayers * 0.85 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="active" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Community Metrics</h5>
              <div className="space-y-3">
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Total Players</span>
                  <span className="font-medium">{dashboard.social.totalPlayers}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Active Players</span>
                  <span className="font-medium">{dashboard.social.activePlayers}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Retention Rate</span>
                  <span className="font-medium">{formatPercentage(dashboard.social.retentionRate)}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Engagement Rate</span>
                  <span className="font-medium">{formatPercentage(dashboard.social.engagementRate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Analytics */}
      {selectedMetric === 'technical' && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Technical Analytics</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Server Performance</h5>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { metric: 'CPU', value: dashboard.technical.serverPerformance.cpuUsage },
                  { metric: 'Memory', value: dashboard.technical.serverPerformance.memoryUsage },
                  { metric: 'Response', value: dashboard.technical.serverPerformance.responseTime }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">System Metrics</h5>
              <div className="space-y-3">
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">CPU Usage</span>
                  <span className="font-medium">{dashboard.technical.serverPerformance.cpuUsage}%</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Memory Usage</span>
                  <span className="font-medium">{dashboard.technical.serverPerformance.memoryUsage}%</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium">{dashboard.technical.serverPerformance.responseTime}ms</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-gray-600">Error Rate</span>
                  <span className="font-medium">{formatPercentage(dashboard.technical.errorRates.errorRate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predictive Analytics */}
      {predictions && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Predictive Analytics</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Churn Risk Analysis</h5>
              <div className="space-y-3">
                {predictions.playerChurn.slice(0, 5).map((churn, index) => (
                  <div key={index} className="p-3 bg-white rounded border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Player {churn.playerId}</span>
                      <span className="text-sm text-red-600">
                        {(churn.churnProbability * 100).toFixed(1)}% risk
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="mb-1">Risk Factors:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {churn.riskFactors.slice(0, 2).map((factor, idx) => (
                          <li key={idx} className="text-xs">{factor}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Revenue Forecast</h5>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Next 30 Days</span>
                    <span className="text-sm text-green-600">
                      {formatCurrency(predictions.revenueForecast.predictedRevenue)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Confidence: {(predictions.revenueForecast.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Factors:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {predictions.revenueForecast.factors.slice(0, 3).map((factor, idx) => (
                        <li key={idx} className="text-xs">{factor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalyticsDashboard; 