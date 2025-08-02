'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Users, DollarSign, TrendingUp, AlertTriangle, Heart, Brain, Zap } from 'lucide-react'
import { CutScene, Fighter } from '@/lib/supabase'

interface InteractiveCutSceneProps {
  cutScene: CutScene
  fighter?: Fighter
  onChoice: (choice: string, consequences: any) => void
  onClose: () => void
}

const InteractiveCutScene: React.FC<InteractiveCutSceneProps> = ({ 
  cutScene, 
  fighter, 
  onChoice, 
  onClose 
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const sceneTypes = {
    training: { icon: Zap, color: 'text-blue-500', bg: 'bg-blue-900/20' },
    press_conference: { icon: MessageSquare, color: 'text-yellow-500', bg: 'bg-yellow-900/20' },
    backstage: { icon: Users, color: 'text-purple-500', bg: 'bg-purple-900/20' },
    personal_issue: { icon: Heart, color: 'text-red-500', bg: 'bg-red-900/20' },
    business_meeting: { icon: DollarSign, color: 'text-green-500', bg: 'bg-green-900/20' },
    fight_preparation: { icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-900/20' }
  }

  const sceneType = sceneTypes[cutScene.scene_type]

  const choices = cutScene.choices || []
  const consequences = cutScene.consequences || {}

  const handleChoice = (choice: string) => {
    setSelectedChoice(choice)
    setIsAnimating(true)
    
    setTimeout(() => {
      const choiceConsequences = consequences[choice] || {}
      onChoice(choice, choiceConsequences)
      setIsAnimating(false)
    }, 1000)
  }

  const getConsequenceDescription = (consequence: any) => {
    const descriptions = []
    
    if (consequence.confidence) {
      descriptions.push(`Confidence ${consequence.confidence > 0 ? '+' : ''}${consequence.confidence}`)
    }
    if (consequence.motivation) {
      descriptions.push(`Motivation ${consequence.motivation > 0 ? '+' : ''}${consequence.motivation}`)
    }
    if (consequence.stress_level) {
      descriptions.push(`Stress ${consequence.stress_level > 0 ? '+' : ''}${consequence.stress_level}`)
    }
    if (consequence.reputation) {
      descriptions.push(`Reputation ${consequence.reputation > 0 ? '+' : ''}${consequence.reputation}`)
    }
    if (consequence.money) {
      descriptions.push(`Money ${consequence.money > 0 ? '+' : ''}$${Math.abs(consequence.money).toLocaleString()}`)
    }
    
    return descriptions.join(', ')
  }

  const getSceneBackground = () => {
    switch (cutScene.scene_type) {
      case 'training':
        return 'bg-gradient-to-br from-blue-900/50 to-blue-800/50'
      case 'press_conference':
        return 'bg-gradient-to-br from-yellow-900/50 to-yellow-800/50'
      case 'backstage':
        return 'bg-gradient-to-br from-purple-900/50 to-purple-800/50'
      case 'personal_issue':
        return 'bg-gradient-to-br from-red-900/50 to-red-800/50'
      case 'business_meeting':
        return 'bg-gradient-to-br from-green-900/50 to-green-800/50'
      case 'fight_preparation':
        return 'bg-gradient-to-br from-orange-900/50 to-orange-800/50'
      default:
        return 'bg-gradient-to-br from-gray-900/50 to-gray-800/50'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Scene Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg border border-gray-700 ${getSceneBackground()}`}
      >
        {/* Scene Header */}
        <div className={`p-6 border-b border-gray-700 ${sceneType.bg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <sceneType.icon className={`w-8 h-8 ${sceneType.color}`} />
              <div>
                <h2 className="text-2xl font-bold text-white">{cutScene.title}</h2>
                <p className="text-gray-300 text-sm capitalize">
                  {cutScene.scene_type.replace('_', ' ')} Scene
                </p>
              </div>
            </div>
            {fighter && (
              <div className="text-right">
                <p className="text-white font-semibold">{fighter.name}</p>
                <p className="text-gray-300 text-sm">{fighter.weight_class}</p>
              </div>
            )}
          </div>
        </div>

        {/* Scene Content */}
        <div className="p-6 space-y-6">
          {/* Scene Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/50 rounded-lg p-6 border border-gray-700"
          >
            <p className="text-gray-200 text-lg leading-relaxed">
              {cutScene.description}
            </p>
          </motion.div>

          {/* Fighter Stats (if applicable) */}
          {fighter && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300 text-sm">Confidence</span>
                </div>
                <div className="text-white font-bold">{fighter.confidence}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-gray-300 text-sm">Motivation</span>
                </div>
                <div className="text-white font-bold">{fighter.motivation}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300 text-sm">Stress</span>
                </div>
                <div className="text-white font-bold">{fighter.stress_level}</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300 text-sm">Record</span>
                </div>
                <div className="text-white font-bold">
                  {fighter.record_wins}-{fighter.record_losses}-{fighter.record_draws}
                </div>
              </div>
            </motion.div>
          )}

          {/* Choices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h3 className="text-xl font-semibold text-white mb-4">What do you do?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {choices.map((choice: string, index: number) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChoice(choice)}
                  disabled={selectedChoice !== null || isAnimating}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedChoice === choice
                      ? 'border-green-500 bg-green-900/20'
                      : 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700'
                  } ${selectedChoice !== null && selectedChoice !== choice ? 'opacity-50' : ''}`}
                >
                  <p className="text-white font-medium mb-2">{choice}</p>
                  {consequences[choice] && (
                    <p className="text-gray-400 text-sm">
                      {getConsequenceDescription(consequences[choice])}
                    </p>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Loading Animation */}
          <AnimatePresence>
            {isAnimating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-8"
              >
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <span className="text-white">Processing your choice...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )
}

export default InteractiveCutScene 