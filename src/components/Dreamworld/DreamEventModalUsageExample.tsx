'use client'

// Example of how to integrate DreamEventModal into your Dreamworld game

import React, { useState } from 'react'
import DreamEventModal from './DreamEventModal'
import { useDreamworldStore } from '@/stores/dreamworldStore'

export const DreamEventModalUsageExample = () => {
  const [currentEvent, setCurrentEvent] = useState<any>(null)
  
  // Get store methods
  const { 
    dreamEvents, 
    updateLucidMeter, 
    addDreamEvent 
  } = useDreamworldStore()

  // Example of triggering a dream event
  const triggerDreamEvent = async () => {
    // Generate event (normally would use DreamEventGenerator)
    const newEvent = {
      dreamType: 'prophecy' as const,
      content: 'You see your fighter\'s future championship victory...',
      impactScore: 85,
      actionableInsight: 'Focus on defensive training to counter aggressive opponents',
      choices: [
        { 
          text: 'Invest heavily in defense training', 
          impact: 'high commitment',
          lucidCost: 20
        },
        { 
          text: 'Balance offense and defense', 
          impact: 'moderate approach',
          lucidCost: 10
        },
        { 
          text: 'Trust current training plan', 
          impact: 'conservative',
          lucidCost: 0
        }
      ]
    }

    // Add to store
    await addDreamEvent({
      dream_type: newEvent.dreamType,
      content: newEvent.content,
      impact_score: newEvent.impactScore,
      actionable_insight: newEvent.actionableInsight,
      career_path: 'boxer'
    })

    // Show modal
    setCurrentEvent(newEvent)
  }

  // Handle player choice
  const handleChoice = async (choiceIndex: number) => {
    if (!currentEvent) return

    const choice = currentEvent.choices[choiceIndex]
    
    // Apply lucid cost if any
    if (choice.lucidCost) {
      await updateLucidMeter(-choice.lucidCost)
    }

    // Apply choice effects based on your game logic
    switch (choiceIndex) {
      case 0: // Heavy investment
        // Apply training bonus, costs, etc.
        console.log('Applied heavy defense training bonus')
        break
      case 1: // Balanced approach
        // Apply moderate bonuses
        console.log('Applied balanced training approach')
        break
      case 2: // Conservative
        // No change
        console.log('Maintaining current training')
        break
    }

    // Log the choice for legacy calculation
    // You might want to store this in the database
    console.log(`Player chose: ${choice.text}`)

    // Close modal
    setCurrentEvent(null)
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dream Event Modal Integration</h2>
      
      {/* Trigger Button */}
      <button
        onClick={triggerDreamEvent}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg 
                   hover:bg-purple-700 transition-colors"
      >
        Trigger Dream Event
      </button>

      {/* Dream Event Modal */}
      {currentEvent && (
        <DreamEventModal
          dreamType={currentEvent.dreamType}
          content={currentEvent.content}
          impactScore={currentEvent.impactScore}
          actionableInsight={currentEvent.actionableInsight}
          choices={currentEvent.choices}
          onChoice={handleChoice}
          onClose={() => setCurrentEvent(null)}
          isOpen={true}
        />
      )}

      {/* Recent Events Display */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-3">Recent Dream Events</h3>
        <div className="space-y-2">
          {dreamEvents.slice(-3).map((event, idx) => (
            <div key={idx} className="p-3 bg-gray-100 rounded-lg">
              <span className="font-medium capitalize">{event.dream_type}:</span>
              <span className="ml-2 text-gray-700">
                {event.content.substring(0, 80)}...
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Integration patterns for different scenarios:

// 1. Random Dream Events During Gameplay
export const useRandomDreamEvents = () => {
  const [activeEvent, setActiveEvent] = useState(null)
  
  const checkForDreamEvent = (gameState: any) => {
    // 10% chance after each fight
    if (Math.random() < 0.1) {
      const event = generateContextualDreamEvent(gameState)
      setActiveEvent(event)
    }
  }
  
  return { activeEvent, setActiveEvent, checkForDreamEvent }
}

// 2. Triggered by Specific Conditions
export const useConditionalDreamEvents = () => {
  const triggerKnockoutDream = (fighter: any) => {
    return {
      dreamType: 'warning' as const,
      content: `${fighter.name}'s defeat echoes through the dreamworld...`,
      impactScore: 70,
      actionableInsight: 'Consider a new training approach or rest period',
      choices: [
        { text: 'Intensive recovery program', impact: 'quick recovery' },
        { text: 'Strategic rest period', impact: 'full recovery' },
        { text: 'Push through the pain', impact: 'risky' }
      ]
    }
  }
  
  return { triggerKnockoutDream }
}

// 3. Story-Driven Dream Sequences
export const useStoryDreams = () => {
  const storyDreams = {
    chapter1_prophecy: {
      dreamType: 'prophecy' as const,
      content: 'The ghost of Jack Dempsey shows you the path to glory...',
      impactScore: 90,
      actionableInsight: 'A legendary fighter\'s wisdom guides your next steps',
      choices: [
        { text: 'Follow Dempsey\'s aggressive style', impact: 'offensive boost' },
        { text: 'Learn from his defeats', impact: 'defensive wisdom' },
        { text: 'Forge your own path', impact: 'unique style' }
      ]
    }
  }
  
  return storyDreams
}

// Helper function (normally imported from DreamEventGenerator)
function generateContextualDreamEvent(gameState: any) {
  // Simplified example
  const types = ['prophecy', 'warning', 'inspiration', 'nightmare', 'vision'] as const
  return {
    dreamType: types[Math.floor(Math.random() * types.length)],
    content: 'A mysterious vision appears...',
    impactScore: Math.floor(Math.random() * 40) + 60,
    actionableInsight: 'The dreamworld offers guidance',
    choices: [
      { text: 'Accept the vision', impact: 'positive' },
      { text: 'Question its meaning', impact: 'neutral' },
      { text: 'Reject the dream', impact: 'negative' }
    ]
  }
}