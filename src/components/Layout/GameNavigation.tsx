import React from 'react';
import {
  Users,
  DollarSign,
  Calendar,
  Target,
  Brain,
  Heart,
  BarChart3,
  Trophy,
  Mic,
  Settings,
  Crown,
  Star,
  Play
} from 'lucide-react';
import { TabType, NavigationTab } from '@/types/game';

interface GameNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navigationTabs: NavigationTab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Target },
  { id: 'fighters', label: 'Fighters', icon: Users },
  { id: 'business', label: 'Business', icon: DollarSign },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'rankings', label: 'Rankings', icon: BarChart3 },
  { id: 'titles', label: 'Titles', icon: Trophy },
  { id: 'press', label: 'Press', icon: Mic },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'ai', label: 'AI Tools', icon: Brain },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'tournament', label: 'Tournament', icon: Crown },
  { id: 'simulation', label: 'Simulation', icon: Play },
  { id: 'premium', label: 'Premium', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const GameNavigation: React.FC<GameNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-400'
                  : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
