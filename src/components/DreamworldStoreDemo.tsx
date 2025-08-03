'use client'

import React, { useEffect } from 'react'
import useDreamworldStore from '@/stores/dreamworldStore'
import { Loader2, Brain, Moon, TrendingUp, Zap, Users } from 'lucide-react'

const DreamworldStoreDemo: React.FC = () => {
  const {
    // State
    lucidMeter,
    currentEra,
    dreamLevel,
    dreamEvents,
    talents,
    isLoading,
    error,
    
    // Methods
    initializeStore,
    addDreamEvent,
    updateLucidMeter,
    recruitTalent,
    progressEra,
    wakeUpFromDream,
    setError
  } = useDreamworldStore()

  // Initialize on mount with demo player
  useEffect(() => {
    initializeStore('demo-player-123')
  }, [initializeStore])

  const handleAddEvent = async () => {
    await addDreamEvent({
      dream_type: 'prophecy',
      content: 'A vision of future success appears before you...',
      impact_score: 75,
      actionable_insight: 'Trust your instincts in the coming challenges'
    })
  }

  const handleLucidChange = (change: number) => {
    updateLucidMeter(lucidMeter + change)
  }

  const handleProgressEra = async () => {
    await progressEra()
  }

  const handleWakeUp = async () => {
    const result = await wakeUpFromDream()
    if (result.success) {
      alert(`You've woken up with ${result.legacyItems.length} legacy items!`)
      // Reinitialize for demo purposes
      setTimeout(() => initializeStore('demo-player-123'), 1000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Dreamworld Store Demo</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="underline">Dismiss</button>
        </div>
      )}

      {/* State Display */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-600">Lucid Meter</span>
          </div>
          <p className="text-2xl font-bold">{lucidMeter}%</p>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Current Era</span>
          </div>
          <p className="text-2xl font-bold">{currentEra}</p>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Dream Level</span>
          </div>
          <p className="text-2xl font-bold">{dreamLevel}</p>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">Events</span>
          </div>
          <p className="text-2xl font-bold">{dreamEvents.length}</p>
        </div>

        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-indigo-500" />
            <span className="text-sm text-gray-600">Talents</span>
          </div>
          <p className="text-2xl font-bold">{talents.length}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Lucid Meter Controls</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleLucidChange(10)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              +10 Lucid
            </button>
            <button
              onClick={() => handleLucidChange(-10)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              -10 Lucid
            </button>
            <button
              onClick={() => updateLucidMeter(100)}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Max Lucid
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Dream Actions</h2>
          <div className="flex gap-2">
            <button
              onClick={handleAddEvent}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Event
            </button>
            <button
              onClick={handleProgressEra}
              disabled={lucidMeter < 25}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              Progress Era (-25)
            </button>
            <button
              onClick={handleWakeUp}
              className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
            >
              Wake Up
            </button>
          </div>
        </div>
      </div>

      {/* Talents */}
      <div className="bg-white rounded-lg p-6 shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Talents</h2>
        <div className="grid grid-cols-3 gap-4">
          {talents.slice(0, 6).map(talent => (
            <div key={talent.id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{talent.name}</h3>
              <p className="text-sm text-gray-600">{talent.career_path} • {talent.dream_era}</p>
              <p className="text-xs text-blue-600 mt-1">{talent.dream_anomaly}</p>
              <button
                onClick={() => recruitTalent(talent.id)}
                disabled={lucidMeter < 20 || talent.status === 'recruited'}
                className="mt-2 text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {talent.status === 'recruited' ? 'Recruited' : 'Recruit (-20)'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Dream Events</h2>
        <div className="space-y-3">
          {dreamEvents.slice(0, 5).map(event => (
            <div key={event.id} className="border-b pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-sm font-semibold capitalize text-purple-600">
                    {event.dream_type}
                  </span>
                  <p className="text-sm mt-1">{event.content}</p>
                  {event.actionable_insight && (
                    <p className="text-xs text-gray-600 mt-1 italic">
                      Insight: {event.actionable_insight}
                    </p>
                  )}
                </div>
                <span className="text-sm font-bold">Impact: {event.impact_score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DreamworldStoreDemo