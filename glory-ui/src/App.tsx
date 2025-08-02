import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { 
  Users, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Activity,
  Heart,
  Globe,
  Camera,
  Award,
  Scale,
  Dumbbell,
  UserCheck,
  Building,
  Mic
} from 'lucide-react';

// New Tab Components with Apollo Client Integration
import MatchesTab from './components/Tabs/MatchesTab';
import ScheduleTab from './components/Tabs/ScheduleTab';
import FightersTab from './components/Tabs/FightersTab';
import PressTab from './components/Tabs/PressTab';

// Advanced Systems
import AdvancedAnalyticsDashboard from './components/AdvancedAnalyticsDashboard';
import type { Fighter, Match, GameState, FinancialMetrics } from './lib/unified-types';
import HealthMonitoringPanel from './components/HealthMonitoringPanel';
import InternationalRankingsPanel from './components/InternationalRankingsPanel';
import EnhancedAICommentary from './components/AICommentary/EnhancedAICommentary';
import MultiplayerDashboard from './components/Multiplayer/MultiplayerDashboard';
import WebSocketConnection from './components/AdvancedFeatures/WebSocketConnection';
import AdvancedMatchmaking from './components/AdvancedFeatures/AdvancedMatchmaking';
import SpectatorMode from './components/AdvancedFeatures/SpectatorMode';
import ReplaySystem from './components/AdvancedFeatures/ReplaySystem';
import AdvancedAnalyticsDashboard2 from './components/AdvancedFeatures/AdvancedAnalyticsDashboard';

// Advanced Boxing Systems
import ContractualPromotionalPanel from './components/AdvancedSystems/ContractualPromotionalPanel';
import WeightManagementPanel from './components/AdvancedSystems/WeightManagementPanel';
import TrainingCampPanel from './components/AdvancedSystems/TrainingCampPanel';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const App: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const currentUserId = 'user-1'; // Mock user ID

  // Mock data for AdvancedAnalyticsDashboard
  const mockFighters: Fighter[] = [
    { id: '1', name: 'Mike Tyson', record_wins: 50, record_losses: 6, age: 25, power: 95, speed: 88, weight_class: 'Heavyweight', popularity: 85, division: 'Heavyweight', stance: 'Orthodox' },
    { id: '2', name: 'Muhammad Ali', record_wins: 56, record_losses: 5, age: 28, power: 85, speed: 92, weight_class: 'Heavyweight', popularity: 90, division: 'Heavyweight', stance: 'Orthodox' }
  ];
  
  const mockMatches: Match[] = [
    { 
      id: '1', 
      fighter_a: '1', 
      fighter_b: '2', 
      fight_date: new Date(), 
      venue: 'Madison Square Garden', 
      status: 'completed',
      scheduled_rounds: 12,
      title_fight: false,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];
  
  const mockGameState: GameState = {
    id: '1',
    current_period: 1,
    total_revenue: 1000000,
    total_expenses: 600000,
    previous_period_revenue: 900000,
    sponsorship_revenue: 200000,
    ticket_revenue: 300000,
    ppv_revenue: 500000,
    merchandise_revenue: 150000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const mockFinancialMetrics: FinancialMetrics = {
    totalRevenue: 1000000,
    totalExpenses: 600000,
    netProfit: 400000,
    revenueGrowth: 15,
    profitMargin: 40,
    sponsorshipRevenue: 200000,
    ticketRevenue: 300000,
    ppvRevenue: 500000,
    merchandiseRevenue: 150000
  };

  const AnalyticsWrapper = () => (
    <AdvancedAnalyticsDashboard 
      fighters={mockFighters}
      matches={mockMatches}
      gameState={mockGameState}
      financialMetrics={mockFinancialMetrics}
    />
  );

  const HealthWrapper = () => (
    <HealthMonitoringPanel fighters={mockFighters} />
  );

  const InternationalWrapper = () => (
    <InternationalRankingsPanel fighters={mockFighters} />
  );

  const tabs = [
    // New Apollo Client Integrated Tabs
    { name: 'Fighters', icon: Users, component: FightersTab },
    { name: 'Schedule', icon: Calendar, component: ScheduleTab },
    { name: 'Matches', icon: Activity, component: MatchesTab },
    { name: 'Press', icon: Mic, component: PressTab },
    
    // Phase 2: Enhanced Systems
    { name: 'Analytics', icon: TrendingUp, component: AnalyticsWrapper },
    
    // Phase 3: Health & International
    { name: 'Health Monitor', icon: Heart, component: HealthWrapper },
    { name: 'International', icon: Globe, component: InternationalWrapper },
    
    // Phase 4: AI Integration
    { name: 'AI Commentary', icon: Mic, component: EnhancedAICommentary },
    
    // Phase 5: Multiplayer
    { name: 'Multiplayer', icon: Users, component: MultiplayerDashboard },
    
    // Phase 6: Advanced Features
    { name: 'WebSocket', icon: Activity, component: WebSocketConnection },
    { name: 'Matchmaking', icon: UserCheck, component: AdvancedMatchmaking },
    { name: 'Spectator', icon: Camera, component: SpectatorMode },
    { name: 'Replay', icon: Award, component: ReplaySystem },
    { name: 'Advanced Analytics', icon: TrendingUp, component: AdvancedAnalyticsDashboard2 },
    
    // Phase 7: Advanced Boxing Systems
    { name: 'Contracts & Promo', icon: Building, component: ContractualPromotionalPanel },
    { name: 'Weight Management', icon: Scale, component: WeightManagementPanel },
    { name: 'Training Camps', icon: Dumbbell, component: TrainingCampPanel },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="py-6">
          <h1 className="text-3xl font-bold text-white mb-2 gradient-text">Glory Management</h1>
          <p className="text-gray-400">Professional Boxing Management Simulation</p>
        </div>

        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 bg-gray-800 rounded-xl p-1 shadow-lg overflow-x-auto border border-gray-700">
            {tabs.map((tab, _) => (
              <Tab
                key={tab.name}
                className={({ selected }: { selected: boolean }) =>
                  classNames(
                    'flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
                    selected
                      ? 'bg-blue-600 text-white shadow-md animate-scale-in'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  )
                }
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-6">
            {tabs.map((tab, _) => (
              <Tab.Panel
                key={tab.name}
                className={classNames(
                  'bg-gray-800 rounded-xl shadow-xl border border-gray-700',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900',
                  'animate-fade-in'
                )}
              >
                <div className="p-6">
                {(() => {
                  const Component = tab.component;
                  
                  // Handle components with different prop requirements
                  if (tab.name === 'WebSocket') {
                    return <Component userId={currentUserId} />;
                  } else if (tab.name === 'Matchmaking') {
                    return <Component currentUserId={currentUserId} currentUsername="Player" />;
                  } else if (tab.name === 'Fighters' || tab.name === 'Schedule' || 
                             tab.name === 'Matches' || tab.name === 'Press' ||
                             tab.name === 'Weight Management' || tab.name === 'Training Camps' ||
                             tab.name === 'Contracts & Promo') {
                    // Core components and some advanced systems that don't need user props
                    return <Component />;
                  } else {
                    // Advanced components that need user props
                    return <Component currentUserId={currentUserId} currentUsername="Player" />;
                  }
                })()}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default App;
