'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Zap, Heart, AlertTriangle } from 'lucide-react'
import DreamworldTrigger from '@/components/Dreamworld/DreamworldTrigger'
import { LegacyUnlock } from '@/types/dreamworld'
// Import dreamworld styles in your main layout

export default function DreamworldDemoPage() {
  const [triggerType, setTriggerType] = useState<'knockout' | 'breakdown' | 'injury' | null>(null)
  const [legacyUnlocks, setLegacyUnlocks] = useState<LegacyUnlock[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleTrigger = (type: 'knockout' | 'breakdown' | 'injury') => {
    setTriggerType(type)
    setShowResults(false)
  }

  const handleDreamworldComplete = (unlocks: LegacyUnlock[]) => {
    setLegacyUnlocks(unlocks)
    setTriggerType(null)
    setShowResults(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Dreamworld Expansion Demo
          </h1>
          <p className="text-lg text-gray-300">
            Experience the 1920s dreamworld side mission where you manage historical entertainment figures
          </p>
        </div>

        {/* Trigger Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-500" />
                Fighter Knockout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Simulate a fighter getting knocked out during a match. 
                The dreamworld activates while they're unconscious.
              </p>
              <Button
                onClick={() => handleTrigger('knockout')}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                Trigger Knockout
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-500" />
                Manager Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Simulate a manager having a mental breakdown from stress. 
                Their mind escapes to a different time period.
              </p>
              <Button
                onClick={() => handleTrigger('breakdown')}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Trigger Breakdown
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Severe Injury
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Simulate a fighter sustaining a severe injury. 
                Visions of the past emerge during recovery.
              </p>
              <Button
                onClick={() => handleTrigger('injury')}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Trigger Injury
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Dreamworld Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Game Mechanics</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Lucid dreaming system with awareness meter</li>
                  <li>• Time travel between 1920s-1950s eras</li>
                  <li>• Manage historical entertainment figures</li>
                  <li>• Reality glitches that blur dream and reality</li>
                  <li>• Dream events with multiple choice outcomes</li>
                  <li>• Era-specific venues and contracts</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Legacy System</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Earn items that persist after waking</li>
                  <li>• Unlock bonuses for the main game</li>
                  <li>• Discover hidden connections and secrets</li>
                  <li>• Gain skills from historical figures</li>
                  <li>• Collect rare and legendary rewards</li>
                  <li>• Build cross-era entertainment empire</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Display */}
        {showResults && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Dreamworld Session Results</CardTitle>
            </CardHeader>
            <CardContent>
              {legacyUnlocks.length > 0 ? (
                <div>
                  <p className="text-gray-300 mb-4">
                    You earned {legacyUnlocks.length} legacy unlock{legacyUnlocks.length > 1 ? 's' : ''}!
                  </p>
                  <div className="space-y-3">
                    {legacyUnlocks.map((unlock) => (
                      <div key={unlock.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold">{unlock.dream_item}</h4>
                          <span className={`px-2 py-1 rounded text-sm ${
                            unlock.rarity === 'legendary' ? 'bg-orange-600' :
                            unlock.rarity === 'epic' ? 'bg-purple-600' :
                            unlock.rarity === 'rare' ? 'bg-blue-600' :
                            'bg-gray-600'
                          } text-white`}>
                            {unlock.rarity}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{unlock.description}</p>
                        {unlock.effect_data && Object.keys(unlock.effect_data).length > 0 && (
                          <div className="mt-2 text-sm text-gray-400">
                            Effects: {Object.entries(unlock.effect_data).map(([key, value]) => (
                              <span key={key}>{key}: +{value} </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">
                  You woke up without earning any legacy unlocks. Try again to discover the dreamworld's secrets!
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Dreamworld Trigger Component */}
        {triggerType && (
          <DreamworldTrigger
            playerId="demo-player"
            triggerType={triggerType}
            fighterName="Demo Fighter"
            onComplete={handleDreamworldComplete}
          />
        )}

        {/* Info Section */}
        <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Integration Guide
          </h3>
          <div className="space-y-3 text-gray-300">
            <p>
              To integrate the Dreamworld expansion into your game:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Run the database migration (007_dreamworld_expansion.sql)</li>
              <li>Import the DreamworldTrigger component in your fight/management screens</li>
              <li>Detect knockout/breakdown/injury events and set the trigger</li>
              <li>Handle the legacy unlocks in the onComplete callback</li>
              <li>Apply legacy effects to your main game state</li>
            </ol>
            <p className="mt-4">
              The dreamworld is completely optional - players can skip it if they prefer to continue with the main game.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}