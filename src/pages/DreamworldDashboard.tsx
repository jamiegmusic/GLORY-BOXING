'use client'

import React, { useEffect, useState } from 'react'
import { useDreamworldStore, generateMockDreamworldData } from '../stores/dreamworldStore'
import { DreamworldTalent, DreamEvent } from '../types/dreamworld'
import { 
  Brain, Calendar, Clock, Home, Moon, Users, Zap, 
  ChevronRight, Star, AlertTriangle, Eye, Sparkles,
  Building, Trophy, Music, Film, Target, Briefcase
} from 'lucide-react'

const DreamworldDashboard: React.FC = () => {
  const {
    playerState,
    talents,
    dreamEvents,
    currentView,
    activeDreamEvent,
    setPlayerState,
    setTalents,
    addDreamEvent,
    setCurrentView,
    setActiveDreamEvent,
    updateLucidMeter,
    changeEra
  } = useDreamworldStore()

  const [isReturning, setIsReturning] = useState(false)

  // Initialize with mock data on mount
  useEffect(() => {
    const mockData = generateMockDreamworldData()
    setPlayerState(mockData.playerState)
    setTalents(mockData.talents)
    mockData.events.forEach(event => addDreamEvent(event))
  }, [])

  const handleReturnToReality = () => {
    setIsReturning(true)
    // Trigger wake up animation/logic
    setTimeout(() => {
      window.location.href = '/' // Return to main game
    }, 2000)
  }

  const handleEventChoice = (event: DreamEvent, choiceIndex: number) => {
    const choice = event.choices[choiceIndex]
    if (choice.lucidCost && playerState) {
      updateLucidMeter(playerState.lucid_meter - choice.lucidCost)
    }
    setActiveDreamEvent(null)
    // Process choice effects...
  }

  const getCareerIcon = (career: string) => {
    switch (career) {
      case 'singer': return <Music className="w-4 h-4" />
      case 'actor': return <Film className="w-4 h-4" />
      case 'boxer': return <Target className="w-4 h-4" />
      case 'mogul': return <Briefcase className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const getLucidMeterColor = () => {
    if (!playerState) return 'bg-gray-400'
    if (playerState.lucid_meter > 70) return 'bg-purple-500'
    if (playerState.lucid_meter > 40) return 'bg-blue-500'
    if (playerState.lucid_meter > 20) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'talents', label: 'Talents', icon: Users },
    { id: 'events', label: 'Events', icon: Zap },
    { id: 'lucidMeter', label: 'Lucid Meter', icon: Brain },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'calendar', label: 'Calendar', icon: Calendar }
  ]

  if (!playerState) return <div className="min-h-screen bg-sepia-100 flex items-center justify-center">
    <div className="text-sepia-800">Loading dreamworld...</div>
  </div>

  return (
    <div className="min-h-screen bg-sepia-50 sepia-theme">
      {/* Sepia Filter Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-br from-amber-100/20 to-yellow-100/20 mix-blend-multiply" />
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-sepia-900/95 backdrop-blur-sm border-b-2 border-sepia-700">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Era Display */}
          <div className="flex items-center gap-4">
            <div className="text-sepia-100">
              <div className="text-xs uppercase tracking-wider opacity-75">Current Era</div>
              <div className="text-xl font-bold">{playerState.current_era}</div>
            </div>
            <div className="w-px h-8 bg-sepia-700" />
            <div className="text-sepia-100">
              <div className="text-xs uppercase tracking-wider opacity-75">Location</div>
              <div className="text-sm">{playerState.current_location}</div>
            </div>
          </div>

          {/* Center Info */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-sepia-300 uppercase tracking-wider">Dream Level</div>
              <div className="text-2xl font-bold text-sepia-100">{playerState.dream_level}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-sepia-300 uppercase tracking-wider">Reputation</div>
              <div className="text-2xl font-bold text-sepia-100">{playerState.reputation_points}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-sepia-300 uppercase tracking-wider">Currency</div>
              <div className="text-xl font-bold text-sepia-100">${playerState.dream_currency}</div>
            </div>
          </div>

          {/* Lucid Meter & Return Button */}
          <div className="flex items-center gap-4">
            <div className="w-48">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-sepia-300 uppercase tracking-wider">Lucid Meter</span>
                <span className="text-sm font-bold text-sepia-100">{playerState.lucid_meter}%</span>
              </div>
              <div className="h-3 bg-sepia-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getLucidMeterColor()} transition-all duration-500`}
                  style={{ width: `${playerState.lucid_meter}%` }}
                />
              </div>
            </div>
            <button
              onClick={handleReturnToReality}
              className="px-4 py-2 bg-sepia-700 hover:bg-sepia-600 text-sepia-100 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Return to Reality
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex pt-16">
        {/* Sidebar */}
        <div className="w-64 bg-sepia-800 min-h-screen fixed left-0 top-16 bottom-0 border-r-2 border-sepia-700">
          <div className="p-4">
            <h2 className="text-xl font-bold text-sepia-100 mb-6">Dreamworld Manager</h2>
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = currentView === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-sepia-700 text-sepia-100' 
                        : 'text-sepia-300 hover:bg-sepia-700/50 hover:text-sepia-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <div>
              <h1 className="text-3xl font-bold text-sepia-900 mb-6">Dreamworld Dashboard</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-sepia-100 rounded-lg p-4 border-2 border-sepia-300">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-sepia-600" />
                    <span className="text-2xl font-bold text-sepia-900">{talents.length}</span>
                  </div>
                  <div className="text-sm text-sepia-700">Active Talents</div>
                </div>
                <div className="bg-sepia-100 rounded-lg p-4 border-2 border-sepia-300">
                  <div className="flex items-center justify-between mb-2">
                    <Zap className="w-8 h-8 text-sepia-600" />
                    <span className="text-2xl font-bold text-sepia-900">{dreamEvents.length}</span>
                  </div>
                  <div className="text-sm text-sepia-700">Dream Events</div>
                </div>
                <div className="bg-sepia-100 rounded-lg p-4 border-2 border-sepia-300">
                  <div className="flex items-center justify-between mb-2">
                    <Building className="w-8 h-8 text-sepia-600" />
                    <span className="text-2xl font-bold text-sepia-900">5</span>
                  </div>
                  <div className="text-sm text-sepia-700">Venues</div>
                </div>
                <div className="bg-sepia-100 rounded-lg p-4 border-2 border-sepia-300">
                  <div className="flex items-center justify-between mb-2">
                    <Trophy className="w-8 h-8 text-sepia-600" />
                    <span className="text-2xl font-bold text-sepia-900">3</span>
                  </div>
                  <div className="text-sm text-sepia-700">Achievements</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-sepia-100 rounded-lg p-6 border-2 border-sepia-300">
                <h2 className="text-xl font-bold text-sepia-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sepia-700">
                    <Sparkles className="w-5 h-5 text-sepia-600" />
                    <span>Louis Armstrong performed at Cotton Club</span>
                  </div>
                  <div className="flex items-center gap-3 text-sepia-700">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span>Reality glitch detected in Harlem</span>
                  </div>
                  <div className="flex items-center gap-3 text-sepia-700">
                    <Star className="w-5 h-5 text-sepia-600" />
                    <span>Jack Dempsey's notoriety increased to 92</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Talents View */}
          {currentView === 'talents' && (
            <div>
              <h1 className="text-3xl font-bold text-sepia-900 mb-6">Dreamworld Talents</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {talents.map((talent) => (
                  <TalentCard key={talent.id} talent={talent} />
                ))}
              </div>
            </div>
          )}

          {/* Events View */}
          {currentView === 'events' && (
            <div>
              <h1 className="text-3xl font-bold text-sepia-900 mb-6">Dream Events</h1>
              <div className="space-y-4">
                {dreamEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="bg-sepia-100 rounded-lg p-4 border-2 border-sepia-300 cursor-pointer hover:border-sepia-400"
                    onClick={() => setActiveDreamEvent(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {event.dream_type === 'prophecy' && <Eye className="w-5 h-5 text-purple-600" />}
                          {event.dream_type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                          {event.dream_type === 'inspiration' && <Sparkles className="w-5 h-5 text-blue-600" />}
                          <span className="font-semibold text-sepia-900 capitalize">{event.dream_type}</span>
                        </div>
                        <p className="text-sepia-700">{event.content}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-sepia-600">Impact</div>
                        <div className="text-xl font-bold text-sepia-900">{event.impact_score}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lucid Meter View */}
          {currentView === 'lucidMeter' && (
            <div>
              <h1 className="text-3xl font-bold text-sepia-900 mb-6">Lucid Meter Management</h1>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-sepia-100 rounded-lg p-6 border-2 border-sepia-300">
                  <h2 className="text-xl font-bold text-sepia-900 mb-4">Current Status</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sepia-700">Lucid Energy</span>
                        <span className="font-bold text-sepia-900">{playerState.lucid_meter}%</span>
                      </div>
                      <div className="h-8 bg-sepia-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getLucidMeterColor()} transition-all duration-500`}
                          style={{ width: `${playerState.lucid_meter}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sepia-700">Wellness</span>
                        <span className="font-bold text-sepia-900">{playerState.wellness_meter}%</span>
                      </div>
                      <div className="h-8 bg-sepia-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 transition-all duration-500"
                          style={{ width: `${playerState.wellness_meter}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-sepia-50 rounded border border-sepia-300">
                    <h3 className="font-semibold text-sepia-800 mb-2">Lucid Actions Cost</h3>
                    <ul className="text-sm text-sepia-700 space-y-1">
                      <li>• Basic Talent Action: -10 Lucid</li>
                      <li>• Era Travel: -25 Lucid</li>
                      <li>• Reality Manipulation: -40 Lucid</li>
                      <li>• Wake Up Early: -50 Lucid</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-sepia-100 rounded-lg p-6 border-2 border-sepia-300">
                  <h2 className="text-xl font-bold text-sepia-900 mb-4">Reality Glitches</h2>
                  
                  {playerState.reality_glitches.length === 0 ? (
                    <p className="text-sepia-600">No reality glitches detected</p>
                  ) : (
                    <div className="space-y-3">
                      {playerState.reality_glitches.slice(-5).map((glitch, idx) => (
                        <div key={idx} className="p-3 bg-amber-50 rounded border border-amber-300">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xs font-semibold text-amber-800 uppercase">{glitch.type}</span>
                              <p className="text-sm text-amber-700 mt-1">{glitch.description}</p>
                            </div>
                            <span className="text-xs text-amber-600">Severity: {glitch.severity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline View */}
          {currentView === 'timeline' && (
            <div>
              <h1 className="text-3xl font-bold text-sepia-900 mb-6">Era Timeline</h1>
              
              <div className="bg-sepia-100 rounded-lg p-6 border-2 border-sepia-300">
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-8 top-0 bottom-0 w-1 bg-sepia-400"></div>
                  
                  {/* Era Nodes */}
                  <div className="space-y-8">
                    {['1920s', '1930s', '1940s', '1950s'].map((era, idx) => {
                      const isCurrentEra = playerState.current_era === era
                      return (
                        <div key={era} className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg ${
                            isCurrentEra 
                              ? 'bg-sepia-700 text-sepia-100 ring-4 ring-sepia-400' 
                              : 'bg-sepia-300 text-sepia-700'
                          }`}>
                            {era}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-sepia-900">
                              {era === '1920s' && 'The Jazz Age'}
                              {era === '1930s' && 'The Golden Age'}
                              {era === '1940s' && 'The War Years'}
                              {era === '1950s' && 'The Television Era'}
                            </h3>
                            <p className="text-sepia-700 mt-1">
                              {era === '1920s' && 'Prohibition, flappers, and the birth of jazz'}
                              {era === '1930s' && 'Hollywood glamour and the Great Depression'}
                              {era === '1940s' && 'Big bands, noir, and wartime entertainment'}
                              {era === '1950s' && 'Rock \'n\' roll and the rise of TV'}
                            </p>
                            {isCurrentEra && (
                              <div className="mt-2 text-sm text-sepia-600">
                                <Clock className="inline w-4 h-4 mr-1" />
                                You are here
                              </div>
                            )}
                          </div>
                          
                          {!isCurrentEra && (
                            <button
                              onClick={() => {
                                changeEra(era as any)
                                updateLucidMeter(playerState.lucid_meter - 25)
                              }}
                              className="px-4 py-2 bg-sepia-600 hover:bg-sepia-700 text-sepia-100 rounded-lg font-medium transition-colors"
                            >
                              Travel (-25 Lucid)
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar View */}
          {currentView === 'calendar' && (
            <div>
              <h1 className="text-3xl font-bold text-sepia-900 mb-6">Dream Calendar</h1>
              
              <div className="bg-sepia-100 rounded-lg p-6 border-2 border-sepia-300">
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-sepia-700 p-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Sample calendar days */}
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                    <div 
                      key={day} 
                      className="aspect-square bg-sepia-50 border border-sepia-300 rounded p-2 hover:bg-sepia-200 cursor-pointer transition-colors"
                    >
                      <div className="text-sm font-semibold text-sepia-800">{day}</div>
                      {day === 15 && (
                        <div className="mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mx-auto" title="Dream Event" />
                        </div>
                      )}
                      {day === 22 && (
                        <div className="mt-1">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mx-auto" title="Performance" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <span className="text-sepia-700">Dream Events</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full" />
                    <span className="text-sepia-700">Performances</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-sepia-700">Contracts</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dream Event Modal */}
      {activeDreamEvent && (
        <DreamEventModal 
          event={activeDreamEvent} 
          onChoice={handleEventChoice}
          onClose={() => setActiveDreamEvent(null)}
          lucidMeter={playerState.lucid_meter}
        />
      )}

      {/* Return to Reality Overlay */}
      {isReturning && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-center">
            <Moon className="w-16 h-16 text-white mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-white mb-2">Waking Up...</h2>
            <p className="text-gray-300">Returning to reality</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Talent Card Component
const TalentCard: React.FC<{ talent: DreamworldTalent }> = ({ talent }) => {
  const topSkills = Object.entries(talent.era_specific_skills)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)

  return (
    <div className="bg-sepia-100 rounded-lg p-4 border-2 border-sepia-300 hover:border-sepia-400 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-sepia-900">{talent.name}</h3>
          <div className="flex items-center gap-2 text-sm text-sepia-700">
            {talent.career_path === 'singer' && <Music className="w-4 h-4" />}
            {talent.career_path === 'actor' && <Film className="w-4 h-4" />}
            {talent.career_path === 'boxer' && <Target className="w-4 h-4" />}
            {talent.career_path === 'mogul' && <Briefcase className="w-4 h-4" />}
            <span className="capitalize">{talent.career_path}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-sepia-600">Notoriety</div>
          <div className="text-lg font-bold text-sepia-900">{talent.notoriety}</div>
        </div>
      </div>

      {/* Dream Anomaly */}
      {talent.dream_anomaly && (
        <div className="mb-3 p-2 bg-amber-100 rounded border border-amber-300">
          <p className="text-xs text-amber-800 italic">✨ {talent.dream_anomaly}</p>
        </div>
      )}

      {/* Skills */}
      <div className="space-y-2">
        {topSkills.map(([skill, value]) => (
          <div key={skill} className="flex justify-between items-center">
            <span className="text-xs text-sepia-700 capitalize">{skill.replace(/_/g, ' ')}</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-sepia-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sepia-600"
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-sepia-800 w-6 text-right">{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Location & Status */}
      <div className="mt-3 pt-3 border-t border-sepia-300 flex justify-between items-center text-xs">
        <span className="text-sepia-600">📍 {talent.current_location}</span>
        <span className={`px-2 py-1 rounded font-medium ${
          talent.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
        }`}>
          {talent.status}
        </span>
      </div>
    </div>
  )
}

// Dream Event Modal Component
const DreamEventModal: React.FC<{
  event: DreamEvent
  onChoice: (event: DreamEvent, choiceIndex: number) => void
  onClose: () => void
  lucidMeter: number
}> = ({ event, onChoice, onClose, lucidMeter }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-sepia-50 rounded-lg max-w-2xl w-full border-4 border-sepia-700 shadow-2xl">
        <div className="p-6 border-b-2 border-sepia-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {event.dream_type === 'prophecy' && <Eye className="w-8 h-8 text-purple-600" />}
              {event.dream_type === 'warning' && <AlertTriangle className="w-8 h-8 text-amber-600" />}
              {event.dream_type === 'inspiration' && <Sparkles className="w-8 h-8 text-blue-600" />}
              <div>
                <h2 className="text-2xl font-bold text-sepia-900 capitalize">{event.dream_type}</h2>
                <p className="text-sm text-sepia-600">Impact Score: {event.impact_score}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-sepia-600 hover:text-sepia-800"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-lg text-sepia-800 mb-4">{event.content}</p>
          
          {event.actionable_insight && (
            <div className="mb-6 p-3 bg-amber-100 rounded-lg border border-amber-300">
              <p className="text-sm text-amber-800">
                <strong>Insight:</strong> {event.actionable_insight}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-sepia-700 uppercase tracking-wider">
              Choose Your Response:
            </h3>
            {event.choices.map((choice, index) => {
              const canAfford = !choice.lucidCost || lucidMeter >= choice.lucidCost
              return (
                <button
                  key={index}
                  onClick={() => onChoice(event, index)}
                  disabled={!canAfford}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    canAfford 
                      ? 'bg-sepia-100 border-sepia-300 hover:border-sepia-400 text-sepia-900' 
                      : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{choice.label}</div>
                      <div className="text-sm mt-1">{choice.effect}</div>
                    </div>
                    {choice.lucidCost && (
                      <div className={`text-sm font-medium ${canAfford ? 'text-purple-600' : 'text-gray-400'}`}>
                        -{choice.lucidCost} Lucid
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DreamworldDashboard