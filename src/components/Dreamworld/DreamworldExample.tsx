'use client'

import React, { useState, useEffect } from 'react'
import { useDreamworldStore } from '@/stores/dreamworldStore'
import { generateDreamEvent } from '@/lib/dreamworld/DreamEventGenerator'
import { DreamEvent } from '@/types/dreamworld'
import { 
  Brain, Zap, Moon, TrendingUp, Users, Eye, AlertTriangle, 
  Sparkles, Ghost, Stars, ChevronRight, Loader2 
} from 'lucide-react'

export const DreamworldExample: React.FC = () => {
  const {
    lucidMeter,
    currentEra,
    dreamLevel,
    dreamEvents,
    talents,
    playerState,
    isLoading,
    error,
    initializeDreamworld,
    addDreamEvent,
    updateLucidMeter,
    recruitTalent,
    progressEra,
    wakeUpFromDream,
    generateAndAddDreamEvent,
    setError
  } = useDreamworldStore()

  const [playerId] = useState('demo-player-001')
  const [selectedEvent, setSelectedEvent] = useState<DreamEvent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Initialize on mount
  useEffect(() => {
    initializeDreamworld(playerId)
  }, [playerId])

  const handleGenerateEvent = async (type?: string) => {
    setIsGenerating(true)
    try {
      await generateAndAddDreamEvent(type || 'random')
    } catch (err) {
      console.error('Failed to generate event:', err)
    }
    setIsGenerating(false)
  }

  const handleManualEventGeneration = async () => {
    if (!playerState) return
    
    setIsGenerating(true)
    try {
      const event = await generateDreamEvent({
        playerState,
        talents,
        forceHighImpact: Math.random() > 0.7
      })
      
      await addDreamEvent(event)
    } catch (err) {
      console.error('Failed to generate manual event:', err)
    }
    setIsGenerating(false)
  }

  const handleRecruitTalent = async (talentId: string) => {
    try {
      await recruitTalent(talentId)
    } catch (err) {
      console.error('Failed to recruit talent:', err)
    }
  }

  const handleWakeUp = async () => {
    const result = await wakeUpFromDream()
    console.log('Wake up result:', result)
    alert(`You've woken up with ${result.legacyItems.length} legacy items!`)
  }

  const getDreamTypeIcon = (type: string) => {
    switch (type) {
      case 'prophecy': return <Eye className="w-5 h-5 text-purple-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />
      case 'inspiration': return <Sparkles className="w-5 h-5 text-blue-500" />
      case 'nightmare': return <Ghost className="w-5 h-5 text-red-500" />
      case 'vision': return <Stars className="w-5 h-5 text-indigo-500" />
      default: return <Zap className="w-5 h-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading dreamworld...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dreamworld Store & Generator Example</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-sm underline mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Core Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-6 h-6 text-purple-500" />
              <span className="text-2xl font-bold">{lucidMeter}%</span>
            </div>
            <p className="text-sm text-gray-600">Lucid Meter</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => updateLucidMeter(lucidMeter + 10)}
                className="text-xs bg-green-500 text-white px-2 py-1 rounded"
              >
                +10
              </button>
              <button
                onClick={() => updateLucidMeter(lucidMeter - 10)}
                className="text-xs bg-red-500 text-white px-2 py-1 rounded"
              >
                -10
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-2">
              <Moon className="w-6 h-6 text-indigo-500" />
              <span className="text-2xl font-bold">{currentEra}</span>
            </div>
            <p className="text-sm text-gray-600">Current Era</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <span className="text-2xl font-bold">{dreamLevel}</span>
            </div>
            <p className="text-sm text-gray-600">Dream Level</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-6 h-6 text-amber-500" />
              <span className="text-2xl font-bold">{dreamEvents.length}</span>
            </div>
            <p className="text-sm text-gray-600">Total Events</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg p-6 shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Dream Actions</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold mb-2">Generate Events</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleGenerateEvent('prophecy')}
                  disabled={isGenerating}
                  className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
                >
                  Generate Prophecy
                </button>
                <button
                  onClick={() => handleGenerateEvent('warning')}
                  disabled={isGenerating}
                  className="w-full bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 disabled:opacity-50"
                >
                  Generate Warning
                </button>
                <button
                  onClick={() => handleGenerateEvent('inspiration')}
                  disabled={isGenerating}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Generate Inspiration
                </button>
                <button
                  onClick={handleManualEventGeneration}
                  disabled={isGenerating}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Generate Random Event
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">World Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={progressEra}
                  disabled={lucidMeter < 25}
                  className="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
                >
                  Progress Era (-25 Lucid)
                </button>
                <button
                  onClick={handleWakeUp}
                  className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Wake Up From Dream
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Talents */}
        <div className="bg-white rounded-lg p-6 shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Available Talents ({talents.length})</h2>
          <div className="grid grid-cols-3 gap-4">
            {talents.slice(0, 6).map(talent => (
              <div key={talent.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{talent.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{talent.career_path} • {talent.dream_era}</p>
                <p className="text-xs text-indigo-600 mb-2">{talent.dream_anomaly}</p>
                <button
                  onClick={() => handleRecruitTalent(talent.id)}
                  disabled={lucidMeter < 20}
                  className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Recruit (-20 Lucid)
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Recent Dream Events</h2>
          <div className="space-y-3">
            {dreamEvents.slice(0, 5).map(event => (
              <div 
                key={event.id} 
                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getDreamTypeIcon(event.dream_type)}
                    <div>
                      <h3 className="font-semibold capitalize">{event.dream_type}</h3>
                      <p className="text-sm text-gray-700 mt-1">{event.content}</p>
                      <p className="text-xs text-indigo-600 mt-2">
                        <strong>Insight:</strong> {event.actionable_insight}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{event.impact_score}</span>
                    <p className="text-xs text-gray-500">Impact</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold capitalize flex items-center gap-2">
                  {getDreamTypeIcon(selectedEvent.dream_type)}
                  {selectedEvent.dream_type} Event
                </h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-gray-700 mb-4">{selectedEvent.content}</p>
              
              <div className="bg-indigo-50 rounded p-3 mb-4">
                <p className="text-sm">
                  <strong>Actionable Insight:</strong> {selectedEvent.actionable_insight}
                </p>
              </div>
              
              {selectedEvent.choices && selectedEvent.choices.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Available Choices:</h3>
                  <div className="space-y-2">
                    {selectedEvent.choices.map((choice, idx) => (
                      <div key={idx} className="border rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{choice.label}</p>
                            <p className="text-sm text-gray-600">{choice.effect}</p>
                          </div>
                          {choice.lucidCost && (
                            <span className="text-sm text-purple-600 font-medium">
                              -{choice.lucidCost} Lucid
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>Era: {selectedEvent.era}</span>
                <span>Career Path: {selectedEvent.career_path}</span>
                <span>Impact: {selectedEvent.impact_score}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DreamworldExample