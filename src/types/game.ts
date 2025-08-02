// Core game types and constants
export type TabType = 
  | 'dashboard' 
  | 'fighters' 
  | 'business' 
  | 'events' 
  | 'rankings' 
  | 'titles' 
  | 'press' 
  | 'settings' 
  | 'analytics' 
  | 'ai' 
  | 'health' 
  | 'premium' 
  | 'tournament' 
  | 'simulation';

export interface GameStats {
  totalFighters: number;
  champions: number;
  availableFighters: number;
  totalRevenue: number;
}

export interface CutScene {
  title: string;
  description: string;
  choices: Array<{
    text: string;
    consequences: {
      confidence?: number;
      motivation?: number;
      stress?: number;
    };
  }>;
}

export interface NavigationTab {
  id: TabType;
  label: string;
  icon: any;
}
