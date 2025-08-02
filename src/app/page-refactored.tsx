'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameState } from '@/hooks/useGameState'
import { GameHeader } from '@/components/Layout/GameHeader'
import { GameNavigation } from '@/components/Layout/GameNavigation'
import { DashboardStats } from '@/components/Dashboard/DashboardStats'
import { CutSceneService } from '@/services/cutSceneService'
import { GameDataService } from '@/services/gameDataService'

// Import existing components
import FighterPsychologyPanel from '@/components/FighterManagement/FighterPsychologyPanel'
import TrainingCampManager from '@/components/FighterManagement/TrainingCampManager'
import InteractiveCutScene from '@/components/CutScenes/InteractiveCutScene'
import ContractNegotiation from '@/components/BusinessManagement/ContractNegotiation'
import { FightScheduler } from '@/components/FightScheduling/FightScheduler'
import { FightManager } from '@/components/FightManagement/FightManager'
import RankingsSystem from '@/components/Rankings/RankingsSystem'
import TitlesManager from '@/components/Titles/TitlesManager'
import PressSystem from '@/components/Press/PressSystem'
import SettingsSystem from '@/components/Settings/SettingsSystem'
import { FighterCreationSystem } from '@/components/FighterManagement/FighterCreationSystem'
import { FighterRoster } from '@/components/FighterManagement/FighterRoster'
import { TrainingSystem } from '@/components/FighterManagement/TrainingSystem'
import AdvancedAnalyticsDashboard from '@/components/AdvancedAnalyticsDashboard'
import EnhancedFightSimulator from '@/components/EnhancedFightSimulator'
import InternationalRankingsPanel from '@/components/InternationalRankingsPanel'
import HealthMonitoringPanel from '@/components/HealthMonitoringPanel'
import PortraitGenerator from '@/components/AI/PortraitGenerator'
import CommentaryPanel from '@/components/AICommentary/CommentaryPanel'
import AdvancedFightEngine from '@/components/FightSimulation/AdvancedFightEngine'
import PremiumFeaturesDashboard from '@/components/PremiumFeatures/PremiumFeaturesDashboard'
import { AnalyticsDashboard } from '@/components/Analytics/AnalyticsDashboard'
import { TournamentSystem } from '@/components/Tournament/TournamentSystem'

export default function Home() {
  const gameState = useGameState();

  const {
    fighters,
    gameState: currentGameState,
    selectedFighter,
    activeTab,
    loading,
    fights,
    showCutScene,
    showContract,
    currentCutScene,
    showFightScheduler,
    showFighterCreation,
    showPortraitGenerator,
    showAdvancedFightEngine,
    selectedFight,
    showCommentary,
    setActiveTab,
    setSelectedFighter,
    setShowCutScene,
    setCurrentCutScene,
    setShowContract,
    updateFighter,
    handleAdvanceWeek,
    handleFightCreated,
    handleFighterCreated,
    handleTrainingComplete
  } = gameState;

  const triggerCutScene = (fighter: typeof selectedFighter) => {
    if (!fighter) return;
    const cutScene = CutSceneService.generateCutScene(fighter);
    setCurrentCutScene(cutScene);
    setShowCutScene(true);
  };

  const handleCutSceneChoice = (choice: string, consequences: any) => {
    if (selectedFighter) {
      const updates = CutSceneService.applyCutSceneConsequences(selectedFighter, consequences);
      updateFighter(selectedFighter.id, updates);
    }
    setShowCutScene(false);
  };

  const handleContractNegotiation = async (contractData: any) => {
    try {
      await GameDataService.createContract(contractData);
      setShowContract(false);
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Glory Boxing Manager...</div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Game Dashboard</h2>
            <DashboardStats fighters={fighters} gameState={currentGameState} />
            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <button
                onClick={() => setShowFighterCreation(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors"
              >
                Create New Fighter
              </button>
              <button
                onClick={() => setShowFightScheduler(true)}
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors"
              >
                Schedule Fight
              </button>
              <button
                onClick={handleAdvanceWeek}
                className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors"
              >
                Advance Week
              </button>
            </div>
          </motion.div>
        );

      case 'fighters':
        return (
          <motion.div
            key="fighters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <FighterRoster
                  fighters={fighters}
                  onFighterSelected={setSelectedFighter}
                />
              </div>
              <div className="space-y-6">
                {selectedFighter && (
                  <>
                    <FighterPsychologyPanel
                      fighter={selectedFighter}
                      onTriggerCutScene={() => triggerCutScene(selectedFighter)}
                    />
                    <TrainingSystem
                      fighter={selectedFighter}
                      onTrainingComplete={handleTrainingComplete}
                    />
                  </>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 'business':
        return (
          <motion.div
            key="business"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FightManager 
              fights={fights}
              fighters={fighters}
              onFightSelect={setSelectedFight}
            />
          </motion.div>
        );

      case 'events':
        return (
          <motion.div
            key="events"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FightScheduler onFightCreated={handleFightCreated} />
          </motion.div>
        );

      case 'rankings':
        return (
          <motion.div
            key="rankings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <RankingsSystem />
          </motion.div>
        );

      case 'titles':
        return (
          <motion.div
            key="titles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TitlesManager />
          </motion.div>
        );

      case 'press':
        return (
          <motion.div
            key="press"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <PressSystem />
          </motion.div>
        );

      case 'analytics':
        return (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AnalyticsDashboard />
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SettingsSystem />
          </motion.div>
        );

      default:
        return (
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Feature Coming Soon</h2>
            <p>This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <GameHeader gameState={currentGameState} />
      <GameNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </main>

      {/* Modals */}
      {showCutScene && currentCutScene && (
        <InteractiveCutScene
          cutScene={currentCutScene}
          onChoice={handleCutSceneChoice}
          onClose={() => setShowCutScene(false)}
        />
      )}

      {showContract && selectedFighter && (
        <ContractNegotiation
          fighter={selectedFighter}
          onComplete={handleContractNegotiation}
          onClose={() => setShowContract(false)}
        />
      )}

      {showFighterCreation && (
        <FighterCreationSystem
          onFighterCreated={handleFighterCreated}
          onCancel={() => setShowFighterCreation(false)}
        />
      )}

      {showPortraitGenerator && selectedFighter && (
        <PortraitGenerator
          fighter={selectedFighter}
          onClose={() => setShowPortraitGenerator(false)}
        />
      )}

      {showAdvancedFightEngine && selectedFight && (
        <AdvancedFightEngine
          fight={selectedFight}
          onClose={() => setShowAdvancedFightEngine(false)}
        />
      )}

      {showCommentary && selectedFight && (
        <CommentaryPanel
          matchData={selectedFight}
          onClose={() => setShowCommentary(false)}
        />
      )}
    </div>
  )
}
