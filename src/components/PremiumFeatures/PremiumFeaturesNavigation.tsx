import React, { useState } from 'react';
import { 
  Video, 
  Archive, 
  Trophy, 
  Building2, 
  Landmark, 
  Accessibility, 
  Activity, 
  Coins, 
  Users, 
  CloudRain,
  Settings,
  Play,
  Pause,
  Volume2,
  Camera,
  Mic,
  Globe,
  Shield,
  Zap,
  Star
} from 'lucide-react';

interface PremiumFeaturesNavigationProps {
  onFeatureSelect: (feature: string) => void;
  currentFeature?: string;
  isLive?: boolean;
  isStreaming?: boolean;
}

export default function PremiumFeaturesNavigation({ 
  onFeatureSelect, 
  currentFeature = 'dashboard',
  isLive = false,
  isStreaming = false
}: PremiumFeaturesNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const premiumFeatures = [
    {
      id: 'live-broadcast',
      name: 'Glory Live',
      icon: Video,
      description: 'Professional broadcast experience',
      status: isLive ? 'LIVE' : isStreaming ? 'STREAMING' : 'READY',
      color: isLive ? 'text-red-500' : isStreaming ? 'text-blue-500' : 'text-green-500'
    },
    {
      id: 'historic-content',
      name: 'Legends Archive',
      icon: Archive,
      description: 'Historic boxing content hub',
      status: 'AVAILABLE',
      color: 'text-yellow-500'
    },
    {
      id: 'esports-competition',
      name: 'Championship Series',
      icon: Trophy,
      description: 'Competitive boxing management',
      status: 'ACTIVE',
      color: 'text-purple-500'
    },
    {
      id: 'sponsorship-management',
      name: 'Corporate Warfare',
      icon: Building2,
      description: 'Dynamic sponsorship management',
      status: 'READY',
      color: 'text-blue-500'
    },
    {
      id: 'museum-hall-of-fame',
      name: 'Glory Hall of Fame',
      icon: Landmark,
      description: 'Interactive legacy museum',
      status: 'OPEN',
      color: 'text-gold-500'
    },
    {
      id: 'accessibility-settings',
      name: 'Glory for Everyone',
      icon: Accessibility,
      description: 'Universal access system',
      status: 'ENABLED',
      color: 'text-green-500'
    },
    {
      id: 'health-science',
      name: 'Glory Genetics',
      icon: Activity,
      description: 'Scientific boxing management',
      status: 'ACTIVE',
      color: 'text-cyan-500'
    },
    {
      id: 'blockchain-collectibles',
      name: 'Glory Collectibles',
      icon: Coins,
      description: 'Digital asset management',
      status: 'CONNECTED',
      color: 'text-orange-500'
    },
    {
      id: 'community-hub',
      name: 'Glory Social',
      icon: Users,
      description: 'Community boxing hub',
      status: 'ONLINE',
      color: 'text-pink-500'
    },
    {
      id: 'weather-effects',
      name: 'Glory Elements',
      icon: CloudRain,
      description: 'Dynamic environmental boxing',
      status: 'ACTIVE',
      color: 'text-indigo-500'
    }
  ];

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Premium Features</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className={`grid gap-3 ${isExpanded ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {premiumFeatures.map((feature) => {
          const IconComponent = feature.icon;
          const isActive = currentFeature === feature.id;
          
          return (
            <button
              key={feature.id}
              onClick={() => onFeatureSelect(feature.id)}
              className={`
                relative p-4 rounded-lg border transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-5 h-5 ${feature.color}`} />
                  <div className="text-left">
                    <div className="font-semibold text-sm">{feature.name}</div>
                    <div className="text-xs opacity-75">{feature.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`
                    px-2 py-1 text-xs rounded-full font-medium
                    ${feature.status === 'LIVE' ? 'bg-red-600 text-white animate-pulse' :
                      feature.status === 'STREAMING' ? 'bg-blue-600 text-white' :
                      feature.status === 'ACTIVE' ? 'bg-green-600 text-white' :
                      feature.status === 'READY' ? 'bg-yellow-600 text-white' :
                      'bg-gray-600 text-gray-300'
                    }
                  `}>
                    {feature.status}
                  </span>
                  
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Access Controls */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <Play className="w-4 h-4 inline mr-1" />
              Start Live
            </button>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <Camera className="w-4 h-4 inline mr-1" />
              Stream
            </button>
            
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <Mic className="w-4 h-4 inline mr-1" />
              Commentary
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <Globe className="w-4 h-4 inline mr-1" />
              Multi-Lang
            </button>
            
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <Shield className="w-4 h-4 inline mr-1" />
              Security
            </button>
            
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <Zap className="w-4 h-4 inline mr-1" />
              Performance
            </button>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">All Systems Online</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400">Premium Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-400">Ready for Deployment</span>
          </div>
        </div>
      </div>
    </div>
  );
} 