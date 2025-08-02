import { useState, useEffect } from 'react';
import { Fighter, GameState, Fight } from '@/lib/supabase';
import { GameDataService } from '@/services/gameDataService';
import { TabType } from '@/types/game';
import { GameProgression } from '@/lib/game-progression';

export const useGameState = () => {
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(true);
  const [fights, setFights] = useState<Fight[]>([]);

  // Modal states
  const [showCutScene, setShowCutScene] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [currentCutScene, setCurrentCutScene] = useState<any>(null);
  const [showFightScheduler, setShowFightScheduler] = useState(false);
  const [showFighterCreation, setShowFighterCreation] = useState(false);
  const [showPortraitGenerator, setShowPortraitGenerator] = useState(false);
  const [showAdvancedFightEngine, setShowAdvancedFightEngine] = useState(false);
  const [selectedFight, setSelectedFight] = useState<Fight | null>(null);
  const [showCommentary, setShowCommentary] = useState(false);

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    setLoading(true);
    try {
      const result = await GameDataService.loadAllGameData();
      if (result.success) {
        setFighters(result.fighters);
        setGameState(result.gameState);
        setFights(result.fights);
      }
    } catch (error) {
      console.error('Error loading game data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFighter = async (fighterId: string, updates: Partial<Fighter>) => {
    const updatedFighter = await GameDataService.updateFighter(fighterId, updates);
    if (updatedFighter) {
      setFighters(prev => prev.map(f => f.id === fighterId ? { ...f, ...updates } : f));
      if (selectedFighter?.id === fighterId) {
        setSelectedFighter(prev => prev ? { ...prev, ...updates } : null);
      }
    }
  };

  const handleAdvanceWeek = async () => {
    if (!gameState) return;
    
    try {
      const result = await GameProgression.processWeeklyProgression();
      setGameState(result.gameState);
      
      // Reload fighters to get updated morale
      const updatedFighters = await GameDataService.loadFighters();
      setFighters(updatedFighters);

      // Show weekly summary
      alert(`Week ${result.gameState.game_week} completed!\nRevenue: £${result.revenue.toLocaleString()}\nReputation: ${result.gameState.reputation}`);
    } catch (error) {
      console.error('Error advancing week:', error);
      alert('Failed to advance week. Please try again.');
    }
  };

  const handleFightCreated = (fight: Fight) => {
    setFights(prev => [...prev, fight]);
    setShowFightScheduler(false);
  };

  const handleFighterCreated = (fighter: Fighter) => {
    setFighters(prev => [fighter, ...prev]);
    setShowFighterCreation(false);
  };

  const handleTrainingComplete = (updatedFighter: Fighter) => {
    setFighters(prev => prev.map(f => f.id === updatedFighter.id ? updatedFighter : f));
    if (selectedFighter?.id === updatedFighter.id) {
      setSelectedFighter(updatedFighter);
    }
  };

  return {
    // State
    fighters,
    gameState,
    selectedFighter,
    activeTab,
    loading,
    fights,
    
    // Modal states
    showCutScene,
    showContract,
    currentCutScene,
    showFightScheduler,
    showFighterCreation,
    showPortraitGenerator,
    showAdvancedFightEngine,
    selectedFight,
    showCommentary,

    // Actions
    setSelectedFighter,
    setActiveTab,
    setShowCutScene,
    setShowContract,
    setCurrentCutScene,
    setShowFightScheduler,
    setShowFighterCreation,
    setShowPortraitGenerator,
    setShowAdvancedFightEngine,
    setSelectedFight,
    setShowCommentary,
    
    // Handlers
    updateFighter,
    loadGameData,
    handleAdvanceWeek,
    handleFightCreated,
    handleFighterCreated,
    handleTrainingComplete
  };
};
