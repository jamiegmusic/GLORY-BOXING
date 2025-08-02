'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Heart, Target, TrendingUp, AlertTriangle, Smile, Frown, Zap } from 'lucide-react'
import { Fighter } from '@/lib/supabase'

interface FighterPsychologyPanelProps {
  fighter: Fighter
  onUpdate: (fighterId: string, updates: Partial<Fighter>) => void
}

const FighterPsychologyPanel: React.FC<FighterPsychologyPanelProps> = ({ fighter, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'mental' | 'personal' | 'motivation'>('mental')

  const mentalStats = [
    { name: 'Confidence', value: fighter.confidence, icon: Brain, color: 'text-blue-500' },
    { name: 'Motivation', value: fighter.motivation, icon: Heart, color: 'text-red-500' },
    { name: 'Mental Toughness', value: fighter.mental_toughness, icon: Target, color: 'text-purple-500' },
    { name: 'Stress Level', value: fighter.stress_level, icon: AlertTriangle, color: 'text-yellow-500' },
  ]

  const getMentalStateColor = (value: number) => {
    if (value >= 80) return 'text-green-500'
    if (value >= 60) return 'text-blue-500'
    if (value >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getMentalStateIcon = (value: number) => {
    if (value >= 80) return <Smile className="w-5 h-5" />
    if (value >= 60) return <TrendingUp className="w-5 h-5" />
    if (value >= 40) return <AlertTriangle className="w-5 h-5" />
    return <Frown className="w-5 h-5" />
  }

  const getStressLevelDescription = (stress: number) => {
    if (stress <= 10) return 'Calm and focused'
    if (stress <= 25) return 'Slightly anxious'
    if (stress <= 50) return 'Moderate stress'
    if (stress <= 75) return 'High stress - affecting performance'
    return 'Critical stress - needs intervention'
  }

  const handleMentalStatChange = (stat: string, value: number) => {
    const updates: Partial<Fighter> = {}
    switch (stat) {
      case 'confidence':
        updates.confidence = Math.max(0, Math.min(100, value))
        break
      case 'motivation':
        updates.motivation = Math.max(0, Math.min(100, value))
        break
      case 'mental_toughness':
        updates.mental_toughness = Math.max(0, Math.min(100, value))
        break
      case 'stress_level':
        updates.stress_level = Math.max(0, Math.min(100, value))
        break
    }
    onUpdate(fighter.id, updates)
  }

  const addPersonalIssue = (issue: string) => {
    const currentIssues = fighter.personal_issues || []
    const updatedIssues = [...currentIssues, issue]
    onUpdate(fighter.id, { personal_issues: updatedIssues })
  }

  const removePersonalIssue = (index: number) => {
    const currentIssues = fighter.personal_issues || []
    const updatedIssues = currentIssues.filter((_, i) => i !== index)
    onUpdate(fighter.id, { personal_issues: updatedIssues })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          Fighter Psychology
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Mental State Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {mentalStats.map((stat) => (
          <motion.div
            key={stat.name}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              {getMentalStateIcon(stat.value)}
            </div>
            <h4 className="text-sm font-medium text-gray-300 mb-1">{stat.name}</h4>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  stat.value >= 80 ? 'bg-green-500' :
                  stat.value >= 60 ? 'bg-blue-500' :
                  stat.value >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${stat.value}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stress Level Warning */}
      {fighter.stress_level > 50 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">High Stress Warning</span>
          </div>
          <p className="text-red-300 text-sm">
            {getStressLevelDescription(fighter.stress_level)}
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
              {[
                { id: 'mental', label: 'Mental Stats', icon: Brain },
                { id: 'personal', label: 'Personal Issues', icon: Heart },
                { id: 'motivation', label: 'Motivation', icon: Zap }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'mental' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Mental State Management</h4>
                  {mentalStats.map((stat) => (
                    <div key={stat.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">{stat.name}</span>
                        <span className="text-white font-bold">{stat.value}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stat.value}
                        onChange={(e) => handleMentalStatChange(stat.name.toLowerCase().replace(' ', '_'), parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Personal Issues</h4>
                  
                  {/* Add New Issue */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add personal issue..."
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          addPersonalIssue(e.currentTarget.value.trim())
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        if (input.value.trim()) {
                          addPersonalIssue(input.value.trim())
                          input.value = ''
                        }
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  {/* Issues List */}
                  <div className="space-y-2">
                    {(fighter.personal_issues || []).map((issue, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between bg-gray-800 rounded-lg p-3 border border-gray-700"
                      >
                        <span className="text-gray-300">{issue}</span>
                        <button
                          onClick={() => removePersonalIssue(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'motivation' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Motivation Analysis</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h5 className="text-purple-400 font-semibold mb-2">Motivation Factors</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Career Goals</span>
                          <span className="text-white">{fighter.motivation > 70 ? 'High' : fighter.motivation > 40 ? 'Medium' : 'Low'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Financial Pressure</span>
                          <span className="text-white">{fighter.career_earnings < 100000 ? 'High' : 'Low'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Personal Issues</span>
                          <span className="text-white">{(fighter.personal_issues?.length || 0) > 2 ? 'High' : 'Low'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h5 className="text-purple-400 font-semibold mb-2">Recommendations</h5>
                      <div className="space-y-2 text-sm text-gray-300">
                        {fighter.motivation < 50 && (
                          <p>• Consider motivational training or career counseling</p>
                        )}
                        {fighter.stress_level > 60 && (
                          <p>• Reduce training intensity to lower stress</p>
                        )}
                        {fighter.confidence < 40 && (
                          <p>• Focus on building confidence through easier fights</p>
                        )}
                        {(fighter.personal_issues?.length || 0) > 3 && (
                          <p>• Address personal issues affecting performance</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FighterPsychologyPanel 