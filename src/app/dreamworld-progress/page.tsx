'use client'

import React, { useState } from 'react'
import { DreamworldProgressHUD } from '@/components/Dreamworld/DreamworldProgressHUD'
import { DreamworldNotifications, NotificationCenter } from '@/components/Dreamworld/DreamworldNotifications'
import JazzSingersSecretQuest from '@/components/Dreamworld/JazzSingersSecretQuest'
import { useDreamworldProgressStore } from '@/stores/dreamworldProgressStore'
import { Bell, Plus, Clock, Trophy, Map, Book } from 'lucide-react'

export default function DreamworldProgressPage() {
  const [showNotificationCenter, setShowNotificationCenter] = useState(false)
  const playerId = '11111111-1111-1111-1111-111111111111'
  
  const {
    currentEra,
    unreadNotifications,
    totalQuestsCompleted,
    totalCluesDiscovered,
    totalDreamTime,
    milestones,
    startChapter,
    unlockEra,
    updateDreamTime,
    addNotification
  } = useDreamworldProgressStore()

  const handleTestNotification = (type: any) => {
    const notifications = {
      quest: {
        type: 'quest_complete',
        title: 'Quest Complete!',
        message: 'You\'ve successfully completed "The Speakeasy Mystery"',
        icon: '🎯'
      },
      chapter: {
        type: 'chapter_complete',
        title: 'Chapter Complete!',
        message: 'Chapter 1: The Roaring Start has been completed',
        icon: '📚'
      },
      era: {
        type: 'era_unlock',
        title: 'New Era Unlocked!',
        message: 'The 1930s are now available to explore',
        icon: '🎬'
      },
      milestone: {
        type: 'milestone',
        title: 'Milestone Achieved!',
        message: 'Dream Detective - 10 clues discovered',
        icon: '🏆'
      },
      reward: {
        type: 'reward',
        title: 'Reward Earned!',
        message: 'Legendary Item: Duke\'s Lost Trumpet',
        icon: '🎺'
      }
    }
    
    addNotification(notifications[type as keyof typeof notifications] as any)
  }

  const handleStartChapter = () => {
    startChapter('chapter_1', 'The Roaring Start', 3)
  }

  const handleUnlockEra = (era: '1920s' | '1930s' | '1940s' | '1950s') => {
    unlockEra(era)
  }

  const handleAddDreamTime = () => {
    updateDreamTime(15) // Add 15 minutes
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sepia-50 to-amber-50">
      {/* Progress HUD */}
      <div className="sticky top-0 z-30">
        <DreamworldProgressHUD />
      </div>

      {/* Notifications */}
      <DreamworldNotifications />
      
      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotificationCenter} 
        onClose={() => setShowNotificationCenter(false)} 
      />

      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-sepia-900 mb-2">
              Dreamworld Progress Tracking
            </h1>
            <p className="text-lg text-sepia-700">
              Complete quests, unlock eras, and track your journey through the dreamworld
            </p>
          </div>
          
          <button
            onClick={() => setShowNotificationCenter(true)}
            className="relative p-3 bg-sepia-200 hover:bg-sepia-300 rounded-lg transition-colors"
          >
            <Bell className="w-6 h-6 text-sepia-700" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs 
                               rounded-full flex items-center justify-center font-bold">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Quest */}
          <div>
            <h2 className="text-2xl font-bold text-sepia-900 mb-4">Active Quest</h2>
            <JazzSingersSecretQuest playerId={playerId} />
            
            {/* Progress Stats */}
            <div className="mt-6 bg-white/80 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-sepia-900 mb-4">Progress Statistics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-sepia-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    <span className="text-sm text-sepia-600">Quests Completed</span>
                  </div>
                  <div className="text-2xl font-bold text-sepia-900">{totalQuestsCompleted}</div>
                </div>
                
                <div className="bg-sepia-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Map className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-sepia-600">Clues Found</span>
                  </div>
                  <div className="text-2xl font-bold text-sepia-900">{totalCluesDiscovered}</div>
                </div>
                
                <div className="bg-sepia-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-sepia-600">Dream Time</span>
                  </div>
                  <div className="text-2xl font-bold text-sepia-900">{totalDreamTime}m</div>
                </div>
                
                <div className="bg-sepia-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Book className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-sepia-600">Milestones</span>
                  </div>
                  <div className="text-2xl font-bold text-sepia-900">{milestones.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            {/* Test Notifications */}
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-sepia-900 mb-4">Test Notifications</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleTestNotification('quest')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg 
                             transition-colors text-sm font-medium"
                >
                  Quest Complete
                </button>
                <button
                  onClick={() => handleTestNotification('chapter')}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg 
                             transition-colors text-sm font-medium"
                >
                  Chapter Complete
                </button>
                <button
                  onClick={() => handleTestNotification('era')}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                             transition-colors text-sm font-medium"
                >
                  Era Unlock
                </button>
                <button
                  onClick={() => handleTestNotification('milestone')}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg 
                             transition-colors text-sm font-medium"
                >
                  Milestone
                </button>
                <button
                  onClick={() => handleTestNotification('reward')}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg 
                             transition-colors text-sm font-medium"
                >
                  Reward
                </button>
                <button
                  onClick={handleAddDreamTime}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg 
                             transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  15m Dream Time
                </button>
              </div>
            </div>

            {/* Era Controls */}
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-sepia-900 mb-4">Era Management</h3>
              
              <div className="space-y-3">
                <button
                  onClick={handleStartChapter}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                             hover:from-purple-700 hover:to-pink-700 text-white rounded-lg 
                             transition-all text-sm font-medium"
                >
                  Start Chapter 1: The Roaring Start
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  {(['1930s', '1940s', '1950s'] as const).map((era) => (
                    <button
                      key={era}
                      onClick={() => handleUnlockEra(era)}
                      className="px-4 py-2 bg-gradient-to-r from-sepia-600 to-amber-600 
                                 hover:from-sepia-700 hover:to-amber-700 text-white rounded-lg 
                                 transition-all text-sm font-medium"
                    >
                      Unlock {era}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-sepia-100/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-sepia-900 mb-4">Features Demonstrated</h3>
              
              <ul className="space-y-2 text-sepia-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Comprehensive progress HUD showing quest, chapter, and era status</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Real-time notifications for achievements and milestones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Quest progress tracking with phase and clue indicators</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Era progression system with unlock notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Notification center with history and badge counter</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Persistent progress tracking across sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Integration with DreamEventModal showing quest context</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}