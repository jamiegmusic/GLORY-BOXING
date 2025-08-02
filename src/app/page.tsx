'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Target, 
  Brain, 
  Heart, 
  Zap,
  Dumbbell,
  FileText,
  MessageSquare,
  Settings,
  Trophy,
  BarChart3,
  Mic,
  Crown,
  Globe,
  Activity,
  Star,
  Shield,
  Eye,
  Camera,
  Play
} from 'lucide-react'
import { supabase, Fighter, GameState, Fight } from '@/lib/supabase'
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
import { GameProgression } from '@/lib/game-progression'
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
  const [fighters, setFighters] = useState<Fighter[]>([])
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fighters' | 'business' | 'events' | 'rankings' | 'titles' | 'press' | 'settings' | 'analytics' | 'ai' | 'health' | 'premium' | 'tournament' | 'simulation'>('dashboard')
  const [showCutScene, setShowCutScene] = useState(false)
  const [showContract, setShowContract] = useState(false)
  const [currentCutScene, setCurrentCutScene] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fights, setFights] = useState<Fight[]>([])
  const [showFightScheduler, setShowFightScheduler] = useState(false)
  const [showFighterCreation, setShowFighterCreation] = useState(false)
  const [showPortraitGenerator, setShowPortraitGenerator] = useState(false)
  const [showAdvancedFightEngine, setShowAdvancedFightEngine] = useState(false)
  const [selectedFight, setSelectedFight] = useState<Fight | null>(null)
  const [showCommentary, setShowCommentary] = useState(false)

  useEffect(() => {
    loadGameData()
  }, [])

  const loadGameData = async () => {
    try {
      // Load fighters
      const { data: fightersData } = await supabase
        .from('fighters')
        .select('*')
        .order('created_at', { ascending: false })

      if (fightersData) {
        setFighters(fightersData)
      }

      // Load game state
      const { data: gameStateData } = await supabase
        .from('game_state')
        .select('*')
        .limit(1)
        .single()

      if (gameStateData) {
        setGameState(gameStateData)
      }

      // Load fights
      const { data: fightsData } = await supabase
        .from('fights')
        .select('*')
        .order('fight_date', { ascending: true })

      if (fightsData) {
        setFights(fightsData)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error loading game data:', error)
      setLoading(false)
    }
  }

  const updateFighter = async (fighterId: string, updates: Partial<Fighter>) => {
    try {
      const { data, error } = await supabase
        .from('fighters')
        .update(updates)
        .eq('id', fighterId)
        .select()
        .single()

      if (error) throw error

      setFighters(prev => prev.map(f => f.id === fighterId ? { ...f, ...updates } : f))
      if (selectedFighter?.id === fighterId) {
        setSelectedFighter(prev => prev ? { ...prev, ...updates } : null)
      }
    } catch (error) {
      console.error('Error updating fighter:', error)
    }
  }

  const createTrainingCamp = async (campData: any) => {
    try {
      const { data, error } = await supabase
        .from('training_camps')
        .insert(campData)
        .select()
        .single()

      if (error) throw error

      // Update fighter's skill improvement rate
      const improvementRate = 1.0 + (campData.camp_quality / 100) * 0.5
      await updateFighter(campData.fighter_id, {
        skill_improvement_rate: improvementRate,
        last_training_date: new Date().toISOString()
      })

      return data
    } catch (error) {
      console.error('Error creating training camp:', error)
      throw error
    }
  }

  const handleCutSceneChoice = (choice: string, consequences: any) => {
    if (selectedFighter) {
      // Apply consequences to fighter
      updateFighter(selectedFighter.id, {
        confidence: Math.max(0, Math.min(100, selectedFighter.confidence + (consequences.confidence || 0))),
        motivation: Math.max(0, Math.min(100, selectedFighter.motivation + (consequences.motivation || 0))),
        stress_level: Math.max(0, Math.min(100, selectedFighter.stress_level + (consequences.stress || 0)))
      })
    }
    setShowCutScene(false)
  }

  const handleContractNegotiation = async (contractData: any) => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert(contractData)
        .select()
        .single()

      if (error) throw error

      // Update fighter's contract value
      await updateFighter(contractData.fighter_id, {
        contract_value: contractData.contract_value,
        current_purse: contractData.base_purse
      })

      setShowContract(false)
      return data
    } catch (error) {
      console.error('Error creating contract:', error)
      throw error
    }
  }

  const triggerCutScene = (fighter: Fighter) => {
    const cutScenes = [
      {
        title: "Training Drama",
        description: `${fighter.name} is having issues with their training partner. How do you handle this?`,
        choices: [
          {
            text: "Intervene and resolve the conflict",
            consequences: { confidence: 5, stress: -3 }
          },
          {
            text: "Let them work it out themselves",
            consequences: { confidence: -2, stress: 5 }
          }
        ]
      },
      {
        title: "Personal Crisis",
        description: `${fighter.name} is dealing with personal issues affecting their focus.`,
        choices: [
          {
            text: "Offer support and counseling",
            consequences: { motivation: 10, stress: -5 }
          },
          {
            text: "Focus on training, ignore personal issues",
            consequences: { motivation: -5, stress: 10 }
          }
        ]
      }
    ]

    const randomScene = cutScenes[Math.floor(Math.random() * cutScenes.length)]
    setCurrentCutScene(randomScene)
    setShowCutScene(true)
  }

  const handleFightCreated = (fight: Fight) => {
    setFights(prev => [...prev, fight])
    setShowFightScheduler(false)
  }

  const handleFighterCreated = (fighter: Fighter) => {
    setFighters(prev => [fighter, ...prev])
    setShowFighterCreation(false)
  }

  const handleAdvanceWeek = async () => {
    if (!gameState) return;
    
    try {
      const result = await GameProgression.processWeeklyProgression();
      setGameState(result.gameState);
      
      // Reload fighters to get updated morale
      const { data: fightersData } = await supabase
        .from('fighters')
        .select('*')
        .order('created_at', { ascending: false });

      if (fightersData) {
        setFighters(fightersData);
      }

      // Show weekly summary
      alert(`Week ${result.gameState.game_week} completed!\nRevenue: £${result.revenue.toLocaleString()}\nReputation: ${result.gameState.reputation}`);
    } catch (error) {
      console.error('Error advancing week:', error);
      alert('Failed to advance week. Please try again.');
    }
  }

  const handleTrainingComplete = (updatedFighter: Fighter) => {
    setFighters(prev => prev.map(f => f.id === updatedFighter.id ? updatedFighter : f));
    if (selectedFighter?.id === updatedFighter.id) {
      setSelectedFighter(updatedFighter);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Glory Management...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-red-500 mr-3" />
              <h1 className="text-2xl font-bold text-white">Glory Management</h1>
            </div>
            {gameState && (
              <div className="flex items-center space-x-6 text-white">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="font-semibold">£{gameState.total_money.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">Rep: {gameState.reputation}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold">Week {gameState.game_week}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
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
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Game Dashboard</h2>
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Fighters</p>
                      <p className="text-2xl font-bold text-white">{fighters.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Champions</p>
                      <p className="text-2xl font-bold text-white">
                        {fighters.filter(f => f.career_stage === 'champion').length}
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-red-400" />
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Available</p>
                      <p className="text-2xl font-bold text-white">
                        {fighters.filter(f => f.is_available).length}
                      </p>
                    </div>
                    <Zap className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Injured</p>
                      <p className="text-2xl font-bold text-white">
                        {fighters.filter(f => f.is_injured).length}
                      </p>
                    </div>
                    <Heart className="w-8 h-8 text-red-400" />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Game Progression</h3>
                  <button
                    onClick={handleAdvanceWeek}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Advance Week
                  </button>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-300">Welcome to Glory Management! Start by managing your fighters and building your boxing empire.</p>
                  <p className="text-gray-300">Click "Advance Week" to progress your game and generate revenue.</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'fighters' && (
            <motion.div
              key="fighters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Fighter Management</h2>
                <button 
                  onClick={() => setShowFighterCreation(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add Fighter
                </button>
              </div>

              <FighterRoster 
                fighters={fighters}
                onFighterSelected={setSelectedFighter}
              />
            </motion.div>
          )}

          {activeTab === 'business' && (
            <motion.div
              key="business"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white">Business Management</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Financial Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Assets</span>
                      <span className="text-white font-semibold">£{gameState?.total_money.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Fighter Contracts</span>
                      <span className="text-white font-semibold">£{fighters.reduce((sum, f) => sum + f.contract_value, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Active Fighters</span>
                      <span className="text-white font-semibold">{fighters.filter(f => f.is_available).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Champions</span>
                      <span className="text-white font-semibold">{fighters.filter(f => f.career_stage === 'champion').length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowContract(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Negotiate New Contract
                    </button>
                    <button 
                      onClick={() => setActiveTab('fighters')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Plan Training Camp
                    </button>
                    <button 
                      onClick={() => setShowFightScheduler(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Schedule Fight
                    </button>
                    <button 
                      onClick={() => setActiveTab('tournament')}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Create Tournament
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span>Revenue Streams</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Fight Revenue</span>
                      <span className="text-white">£{(fights.reduce((sum, f) => sum + ((f as any).revenue || 0), 0)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Sponsorships</span>
                      <span className="text-white">£{((gameState?.total_money || 0) * 0.1).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Merchandise</span>
                      <span className="text-white">£{((gameState?.total_money || 0) * 0.05).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span>Fighter Management</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Fighters</span>
                      <span className="text-white">{fighters.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Available</span>
                      <span className="text-white">{fighters.filter(f => f.is_available).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Injured</span>
                      <span className="text-white">{fighters.filter(f => f.is_injured).length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span>Event Schedule</span>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Scheduled Fights</span>
                      <span className="text-white">{fights.filter(f => !(f as any).is_completed).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Completed Fights</span>
                      <span className="text-white">{fights.filter(f => (f as any).is_completed).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">This Week</span>
                      <span className="text-white">{fights.filter(f => !(f as any).is_completed && new Date(f.fight_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Events & Schedule</h2>
                <button
                  onClick={() => setShowFightScheduler(!showFightScheduler)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Fight</span>
                </button>
              </div>

              {showFightScheduler && (
                <FightScheduler onFightCreated={handleFightCreated} />
              )}

              <FightManager />
            </motion.div>
          )}

          {activeTab === 'rankings' && (
            <motion.div
              key="rankings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Rankings & International</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('health')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Health Monitoring
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Game Rankings</h3>
                  <RankingsSystem />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">International Rankings</h3>
                  <InternationalRankingsPanel 
                    fighters={fighters as any}
                    onSyncRankings={(updatedFighters: any) => {
                      setFighters(updatedFighters);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'titles' && (
            <motion.div
              key="titles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <TitlesManager />
            </motion.div>
          )}

          {activeTab === 'press' && (
            <motion.div
              key="press"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <PressSystem />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <SettingsSystem />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Advanced Analytics</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Basic Analytics
                  </button>
                </div>
              </div>
              <AdvancedAnalyticsDashboard 
                fighters={fighters as any}
                matches={fights as any}
                gameState={gameState as any}
                financialMetrics={{
                  totalRevenue: gameState?.total_money || 0,
                  fighterContracts: fighters.reduce((sum, f) => sum + f.contract_value, 0),
                  eventRevenue: fights.reduce((sum, f) => sum + ((f as any).revenue || 0), 0),
                  expenses: 0
                }}
              />
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">AI Tools</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowPortraitGenerator(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Portrait Generator</span>
                  </button>
                  <button
                    onClick={() => setShowCommentary(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Mic className="w-4 h-4" />
                    <span>AI Commentary</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span>AI Portrait Generation</span>
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Generate realistic portraits for your fighters using advanced AI technology.
                  </p>
                  <button
                    onClick={() => setShowPortraitGenerator(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Generate Portrait
                  </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Mic className="w-5 h-5 text-green-400" />
                    <span>AI Commentary</span>
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Generate dynamic commentary for fights using AI-powered analysis.
                  </p>
                  <button
                    onClick={() => setShowCommentary(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Generate Commentary
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'health' && (
            <motion.div
              key="health"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white">Health Monitoring</h2>
              <HealthMonitoringPanel 
                fighters={fighters as any}
                onUpdateFighter={(fighter: any) => updateFighter(fighter.id, fighter)}
              />
            </motion.div>
          )}

          {activeTab === 'tournament' && (
            <motion.div
              key="tournament"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white">Tournament Management</h2>
              <TournamentSystem />
            </motion.div>
          )}

          {activeTab === 'simulation' && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Advanced Fight Simulation</h2>
                <button
                  onClick={() => setShowAdvancedFightEngine(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Advanced Engine</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Play className="w-5 h-5 text-red-400" />
                    <span>Enhanced Fight Simulator</span>
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Advanced fight simulation with detailed round-by-round analysis.
                  </p>
                  <button
                    onClick={() => setShowAdvancedFightEngine(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Launch Simulator
                  </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    <span>Fight Analytics</span>
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Detailed analytics and statistics for fight performance.
                  </p>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'premium' && (
            <motion.div
              key="premium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white">Premium Features</h2>
              <PremiumFeaturesDashboard />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Fighter Details */}
        {selectedFighter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">
                {selectedFighter.name} - {selectedFighter.nickname}
              </h3>
              <button
                onClick={() => setSelectedFighter(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FighterPsychologyPanel 
                fighter={selectedFighter} 
                onUpdate={updateFighter} 
              />
              <TrainingSystem 
                fighter={selectedFighter} 
                onTrainingComplete={handleTrainingComplete}
              />
            </div>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showCutScene && currentCutScene && selectedFighter && (
          <InteractiveCutScene
            cutScene={currentCutScene}
            fighter={selectedFighter}
            onChoice={handleCutSceneChoice}
            onClose={() => setShowCutScene(false)}
          />
        )}

        {showContract && selectedFighter && (
          <ContractNegotiation
            fighter={selectedFighter}
            onNegotiate={handleContractNegotiation}
            onClose={() => setShowContract(false)}
          />
        )}

        {showFighterCreation && (
          <FighterCreationSystem
            onFighterCreated={handleFighterCreated}
            onCancel={() => setShowFighterCreation(false)}
          />
        )}

        {showPortraitGenerator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">AI Portrait Generator</h3>
                <button
                  onClick={() => setShowPortraitGenerator(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
              <PortraitGenerator />
            </div>
          </div>
        )}

        {showAdvancedFightEngine && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Advanced Fight Engine</h3>
                <button
                  onClick={() => setShowAdvancedFightEngine(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
              <AdvancedFightEngine />
            </div>
          </div>
        )}

        {showCommentary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">AI Commentary</h3>
                <button
                  onClick={() => setShowCommentary(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
              <CommentaryPanel 
                fight={selectedFight}
                fighter1={fighters.find(f => f.id === selectedFight?.fighter1_id) || undefined}
                fighter2={fighters.find(f => f.id === selectedFight?.fighter2_id) || undefined}
                isLive={false}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
} 