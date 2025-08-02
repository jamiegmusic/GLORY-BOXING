import React, { useState } from 'react';
import PremiumFeaturesNavigation from './PremiumFeaturesNavigation';
import DeploymentReadyPanel from './DeploymentReadyPanel';
import { 
  Crown, 
  TrendingUp, 
  Users, 
  Activity, 
  Star,
  Award,
  Target,
  Zap,
  Globe,
  Shield
} from 'lucide-react';

interface PremiumFeaturesDashboardProps {
  onFeatureSelect?: (feature: string) => void;
  onDeploy?: () => void;
  onMonitor?: () => void;
}

export default function PremiumFeaturesDashboard({ 
  onFeatureSelect, 
  onDeploy, 
  onMonitor 
}: PremiumFeaturesDashboardProps) {
  const [currentFeature, setCurrentFeature] = useState('dashboard');
  const [isLive, setIsLive] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleFeatureSelect = (feature: string) => {
    setCurrentFeature(feature);
    onFeatureSelect?.(feature);
  };

  const premiumStats = [
    {
      title: 'Active Users',
      value: '12,847',
      change: '+15%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Live Events',
      value: '23',
      change: '+8',
      trend: 'up',
      icon: Activity,
      color: 'text-red-500'
    },
    {
      title: 'Revenue',
      value: '$2.4M',
      change: '+22%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      title: 'Tournaments',
      value: '156',
      change: '+12',
      trend: 'up',
      icon: Crown,
      color: 'text-purple-500'
    }
  ];

  const featureHighlights = [
    {
      title: 'Glory Live',
      description: 'Professional broadcast experience with real-time commentary',
      status: 'ACTIVE',
      users: '8,234',
      icon: Globe,
      color: 'bg-blue-600'
    },
    {
      title: 'Championship Series',
      description: 'Competitive multiplayer with ranked matchmaking',
      status: 'LIVE',
      users: '5,671',
      icon: Crown,
      color: 'bg-purple-600'
    },
    {
      title: 'Glory Genetics',
      description: 'Advanced health science and biometric monitoring',
      status: 'ACTIVE',
      users: '3,892',
      icon: Activity,
      color: 'bg-cyan-600'
    },
    {
      title: 'Glory Collectibles',
      description: 'NFT marketplace and digital asset management',
      status: 'CONNECTED',
      users: '2,156',
      icon: Star,
      color: 'bg-orange-600'
    }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-yellow-500';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Glory Management</h1>
            <p className="text-gray-400">Premium Features Dashboard</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">All Systems Online</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-blue-400">Premium Active</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-yellow-400">Ready for Deployment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Premium Features Navigation */}
          <div className="lg:col-span-1">
            <PremiumFeaturesNavigation
              onFeatureSelect={handleFeatureSelect}
              currentFeature={currentFeature}
              isLive={isLive}
              isStreaming={isStreaming}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {premiumStats.map((stat, index) => {
                const IconComponent = stat.icon;
                
                return (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className={`w-6 h-6 ${stat.color}`} />
                      <span className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                        {getTrendIcon(stat.trend)} {stat.change}
                      </span>
                    </div>
                    
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      {stat.title}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureHighlights.map((feature, index) => {
                const IconComponent = feature.icon;
                
                return (
                  <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${feature.color}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      
                      <span className={`
                        px-2 py-1 text-xs rounded-full font-medium
                        ${feature.status === 'LIVE' ? 'bg-red-600 text-white animate-pulse' :
                          feature.status === 'ACTIVE' ? 'bg-green-600 text-white' :
                          'bg-blue-600 text-white'
                        }
                      `}>
                        {feature.status}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    
                    <p className="text-sm text-gray-400 mb-3">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {feature.users} active users
                      </span>
                      
                      <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Deployment Ready Panel */}
            <DeploymentReadyPanel
              onDeploy={onDeploy}
              onMonitor={onMonitor}
            />

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors">
                  <Target className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Start Live Event</div>
                </button>
                
                <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors">
                  <Crown className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Create Tournament</div>
                </button>
                
                <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors">
                  <Activity className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Health Monitor</div>
                </button>
                
                <button className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg transition-colors">
                  <Star className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">NFT Marketplace</div>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-white">Database</div>
                    <div className="text-xs text-gray-400">99.9% uptime</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-white">AI Services</div>
                    <div className="text-xs text-gray-400">2.3s avg response</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-white">WebSocket</div>
                    <div className="text-xs text-gray-400">1.2ms latency</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-white">CDN</div>
                    <div className="text-xs text-gray-400">150ms avg load</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 