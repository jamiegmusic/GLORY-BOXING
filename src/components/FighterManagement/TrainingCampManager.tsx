'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dumbbell, Users, Utensils, Shield, Zap, DollarSign, Calendar, Target, TrendingUp, Chef, Brain } from 'lucide-react'
import { Fighter, TrainingCamp } from '@/lib/supabase'

interface TrainingCampManagerProps {
  fighter: Fighter
  onUpdate: (fighterId: string, updates: Partial<Fighter>) => void
  onCreateCamp: (campData: Partial<TrainingCamp>) => void
}

const TrainingCampManager: React.FC<TrainingCampManagerProps> = ({ fighter, onUpdate, onCreateCamp }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'current' | 'plan' | 'history'>('current')
  const [campForm, setCampForm] = useState({
    camp_name: '',
    duration_weeks: 8,
    focus_punching_power: false,
    focus_speed: false,
    focus_defense: false,
    focus_stamina: false,
    focus_ring_iq: false,
    camp_quality: 50,
    sparring_partners_quality: 50,
    nutrition_quality: 50,
    gym_atmosphere: 50,
    head_trainer: '',
    nutritionist_hired: false,
    strength_coach_hired: false,
    cutman_hired: false,
  })

  const staffCosts = {
    nutritionist: 2000,
    strength_coach: 1500,
    cutman: 1000,
  }

  const calculateDailyCost = () => {
    let baseCost = campForm.camp_quality * 10
    if (campForm.nutritionist_hired) baseCost += staffCosts.nutritionist / 30
    if (campForm.strength_coach_hired) baseCost += staffCosts.strength_coach / 30
    if (campForm.cutman_hired) baseCost += staffCosts.cutman / 30
    return Math.round(baseCost)
  }

  const calculateTotalCost = () => {
    return calculateDailyCost() * campForm.duration_weeks * 7
  }

  const getSkillImprovementRate = () => {
    let rate = 1.0
    if (campForm.camp_quality > 70) rate += 0.3
    if (campForm.sparring_partners_quality > 70) rate += 0.2
    if (campForm.nutrition_quality > 70) rate += 0.2
    if (campForm.gym_atmosphere > 70) rate += 0.1
    if (campForm.nutritionist_hired) rate += 0.1
    if (campForm.strength_coach_hired) rate += 0.1
    if (campForm.cutman_hired) rate += 0.05
    return Math.min(rate, 2.0)
  }

  const handleCampFormChange = (field: string, value: any) => {
    setCampForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStartCamp = () => {
    const campData = {
      fighter_id: fighter.id,
      ...campForm,
      daily_cost: calculateDailyCost(),
      total_cost: calculateTotalCost(),
    }
    onCreateCamp(campData)
    setCampForm({
      camp_name: '',
      duration_weeks: 8,
      focus_punching_power: false,
      focus_speed: false,
      focus_defense: false,
      focus_stamina: false,
      focus_ring_iq: false,
      camp_quality: 50,
      sparring_partners_quality: 50,
      nutrition_quality: 50,
      gym_atmosphere: 50,
      head_trainer: '',
      nutritionist_hired: false,
      strength_coach_hired: false,
      cutman_hired: false,
    })
  }

  const focusAreas = [
    { key: 'focus_punching_power', label: 'Punching Power', icon: Zap, color: 'text-red-500' },
    { key: 'focus_speed', label: 'Speed', icon: Zap, color: 'text-blue-500' },
    { key: 'focus_defense', label: 'Defense', icon: Shield, color: 'text-green-500' },
    { key: 'focus_stamina', label: 'Stamina', icon: Target, color: 'text-yellow-500' },
    { key: 'focus_ring_iq', label: 'Ring IQ', icon: Brain, color: 'text-purple-500' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-blue-400" />
          Training Camp Manager
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Current Training Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300 text-sm">Current Focus</span>
          </div>
          <div className="text-white font-semibold">
            {fighter.current_training_focus || 'No focus set'}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-gray-300 text-sm">Improvement Rate</span>
          </div>
          <div className="text-white font-semibold">
            {fighter.skill_improvement_rate.toFixed(2)}x
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span className="text-gray-300 text-sm">Last Training</span>
          </div>
          <div className="text-white font-semibold">
            {new Date(fighter.last_training_date).toLocaleDateString()}
          </div>
        </div>
      </div>

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
                { id: 'current', label: 'Current Camp', icon: Calendar },
                { id: 'plan', label: 'Plan New Camp', icon: Target },
                { id: 'history', label: 'Camp History', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'current' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Current Training Status</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h5 className="text-blue-400 font-semibold mb-3">Training Focus</h5>
                      <div className="space-y-2">
                        <select
                          value={fighter.current_training_focus || ''}
                          onChange={(e) => onUpdate(fighter.id, { current_training_focus: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        >
                          <option value="">Select focus area...</option>
                          <option value="punching_power">Punching Power</option>
                          <option value="speed">Speed</option>
                          <option value="defense">Defense</option>
                          <option value="stamina">Stamina</option>
                          <option value="ring_iq">Ring IQ</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h5 className="text-blue-400 font-semibold mb-3">Skill Development</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Improvement Rate</span>
                          <span className="text-white">{fighter.skill_improvement_rate.toFixed(2)}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Last Training</span>
                          <span className="text-white">{new Date(fighter.last_training_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'plan' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Plan New Training Camp</h4>
                  
                  {/* Basic Camp Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Camp Name</label>
                      <input
                        type="text"
                        value={campForm.camp_name}
                        onChange={(e) => handleCampFormChange('camp_name', e.target.value)}
                        placeholder="Enter camp name..."
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Duration (weeks)</label>
                      <input
                        type="number"
                        min="1"
                        max="16"
                        value={campForm.duration_weeks}
                        onChange={(e) => handleCampFormChange('duration_weeks', parseInt(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  {/* Focus Areas */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-3">Focus Areas</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {focusAreas.map((area) => (
                        <label key={area.key} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={campForm[area.key as keyof typeof campForm] as boolean}
                            onChange={(e) => handleCampFormChange(area.key, e.target.checked)}
                            className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-300 text-sm">{area.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Camp Quality Settings */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-3">Camp Quality Settings</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'camp_quality', label: 'Overall Quality', icon: Dumbbell },
                        { key: 'sparring_partners_quality', label: 'Sparring Partners', icon: Users },
                        { key: 'nutrition_quality', label: 'Nutrition', icon: Utensils },
                        { key: 'gym_atmosphere', label: 'Gym Atmosphere', icon: Shield }
                      ].map((setting) => (
                        <div key={setting.key}>
                          <div className="flex items-center gap-2 mb-2">
                            <setting.icon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300 text-sm">{setting.label}</span>
                            <span className="text-white font-bold ml-auto">
                              {campForm[setting.key as keyof typeof campForm] as number}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={campForm[setting.key as keyof typeof campForm] as number}
                            onChange={(e) => handleCampFormChange(setting.key, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Staff Hiring */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-3">Staff Hiring</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Head Trainer</label>
                        <input
                          type="text"
                          value={campForm.head_trainer}
                          onChange={(e) => handleCampFormChange('head_trainer', e.target.value)}
                          placeholder="Enter trainer name..."
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                        />
                      </div>
                      <div className="space-y-3">
                        {[
                          { key: 'nutritionist_hired', label: 'Hire Nutritionist', cost: staffCosts.nutritionist },
                          { key: 'strength_coach_hired', label: 'Hire Strength Coach', cost: staffCosts.strength_coach },
                          { key: 'cutman_hired', label: 'Hire Cutman', cost: staffCosts.cutman }
                        ].map((staff) => (
                          <label key={staff.key} className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={campForm[staff.key as keyof typeof campForm] as boolean}
                                onChange={(e) => handleCampFormChange(staff.key, e.target.checked)}
                                className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-gray-300 text-sm">{staff.label}</span>
                            </div>
                            <span className="text-gray-400 text-sm">${staff.cost.toLocaleString()}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cost Summary */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h5 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Cost Summary
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-300">Daily Cost:</span>
                        <span className="text-white font-bold ml-2">${calculateDailyCost().toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Total Cost:</span>
                        <span className="text-white font-bold ml-2">${calculateTotalCost().toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Improvement Rate:</span>
                        <span className="text-green-400 font-bold ml-2">{getSkillImprovementRate().toFixed(2)}x</span>
                      </div>
                    </div>
                  </div>

                  {/* Start Camp Button */}
                  <button
                    onClick={handleStartCamp}
                    disabled={!campForm.camp_name.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Target className="w-5 h-5" />
                    Start Training Camp
                  </button>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Training Camp History</h4>
                  
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-400 text-center py-8">
                      Training camp history will be displayed here once camps are completed.
                    </p>
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

export default TrainingCampManager 