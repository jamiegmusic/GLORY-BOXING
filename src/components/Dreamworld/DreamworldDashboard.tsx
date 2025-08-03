import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Badge } from '../ui/badge'
import { Clock, Brain, Eye, Music, Film, Trophy, Building, Calendar, AlertTriangle, Bell } from 'lucide-react'
import { DreamworldPlayerState, DreamworldTalent, DreamEvent, DreamworldVenue, LegacyUnlock, DreamworldUIState } from '../../types/dreamworld'
import DreamTalentCard from './DreamTalentCard'
import DreamEventModal from './DreamEventModal'
import LucidMeterHUD from './LucidMeterHUD'
import DreamTimelineSlider from './DreamTimelineSlider'
import RealityGlitchEffect from './RealityGlitchEffect'
import DreamVenueManager from './DreamVenueManager'
import LegacyUnlocksPanel from './LegacyUnlocksPanel'
import { DreamworldProgressHUD } from './DreamworldProgressHUD'
import { DreamworldNotifications, NotificationCenter } from './DreamworldNotifications'
import { useDreamworldProgressStore } from '@/stores/dreamworldProgressStore'

interface DreamworldDashboardProps {
  playerId: string;
  onWakeUp: (legacyUnlocks: LegacyUnlock[]) => void;
}

const DreamworldDashboard: React.FC<DreamworldDashboardProps> = ({ playerId, onWakeUp }) => {
  const [playerState, setPlayerState] = useState<DreamworldPlayerState | null>(null)
  const [talents, setTalents] = useState<DreamworldTalent[]>([])
  const [currentEvent, setCurrentEvent] = useState<DreamEvent | null>(null)
  const [venues, setVenues] = useState<DreamworldVenue[]>([])
  const [legacyUnlocks, setLegacyUnlocks] = useState<LegacyUnlock[]>([])
  const [showNotificationCenter, setShowNotificationCenter] = useState(false)
  const [uiState, setUiState] = useState<DreamworldUIState>({
    isInDreamworld: true,
    showDreamTransition: false,
    currentView: 'dashboard',
    showLucidMeterWarning: false,
    timelinePosition: 0
  })
  
  const { unreadNotifications, updateDreamTime } = useDreamworldProgressStore()

  useEffect(() => {
    // Initialize dreamworld session
    initializeDreamworld()
    // Add vintage film grain effect
    document.body.classList.add('dreamworld-active')
    
    return () => {
      document.body.classList.remove('dreamworld-active')
    }
  }, [playerId])

  const initializeDreamworld = async () => {
    // TODO: Fetch player state, talents, venues from Supabase
    // For now, using mock data
    setPlayerState({
      id: '1',
      player_id: playerId,
      current_era: '1920s',
      lucid_meter: 50,
      dream_level: 1,
      wellness_meter: 75,
      reality_glitches: [],
      current_location: 'Harlem',
      return_conditions: [
        { type: 'lucidMeter', threshold: 0, description: 'Wake up when lucidity depletes' },
        { type: 'dreamLevel', threshold: 10, description: 'Wake up at max dream level' }
      ],
      dream_talents: [],
      dream_currency: 1000,
      reputation_points: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  const handleEraChange = (position: number) => {
    const eras: DreamworldPlayerState['current_era'][] = ['1920s', '1930s', '1940s', '1950s']
    const eraIndex = Math.floor((position / 100) * eras.length)
    const newEra = eras[Math.min(eraIndex, eras.length - 1)]
    
    if (playerState && newEra !== playerState.current_era) {
      setPlayerState({ ...playerState, current_era: newEra })
      // Add reality glitch when changing eras
      addRealityGlitch('temporal', `Time shifted to the ${newEra}`)
    }
  }

  const addRealityGlitch = (type: 'temporal' | 'visual' | 'auditory' | 'cognitive', description: string) => {
    if (!playerState) return
    
    const glitch = {
      id: Date.now().toString(),
      type,
      description,
      severity: Math.random() * 50 + 25,
      timestamp: new Date().toISOString()
    }
    
    setPlayerState({
      ...playerState,
      reality_glitches: [...playerState.reality_glitches, glitch]
    })
  }

  const handleLucidAction = (cost: number) => {
    if (!playerState) return
    
    const newLucidMeter = Math.max(0, playerState.lucid_meter - cost)
    setPlayerState({ ...playerState, lucid_meter: newLucidMeter })
    
    if (newLucidMeter < 20) {
      setUiState({ ...uiState, showLucidMeterWarning: true })
    }
    
    if (newLucidMeter === 0) {
      // Trigger wake up sequence
      handleWakeUp()
    }
  }

  const handleWakeUp = () => {
    setUiState({ ...uiState, showDreamTransition: true })
    
    // Collect unclaimed legacy unlocks
    const unclaimedUnlocks = legacyUnlocks.filter(unlock => !unlock.claimed)
    
    setTimeout(() => {
      onWakeUp(unclaimedUnlocks)
    }, 3000)
  }

  if (!playerState) return <div>Loading dreamworld...</div>

  return (
    <div className="dreamworld-container relative min-h-screen">
      {/* Vintage overlay effect */}
      <div className="vintage-overlay fixed inset-0 pointer-events-none z-50" />
      
      {/* Reality glitch effects */}
      <RealityGlitchEffect glitches={playerState.reality_glitches} />
      
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
      
      {/* Main content */}
      <div className="relative z-10 p-6">
        {/* Header with HUD */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-sepia-900 font-serif">
              The Dreamworld - {playerState.current_era}
            </h1>
            <Badge variant="outline" className="vintage-badge">
              Level {playerState.dream_level}
            </Badge>
          </div>
          
          <div className="flex items-center gap-6">
            <LucidMeterHUD 
              lucidMeter={playerState.lucid_meter}
              wellnessMeter={playerState.wellness_meter}
              showWarning={uiState.showLucidMeterWarning}
            />
            
            <Button
              onClick={() => setShowNotificationCenter(true)}
              variant="outline"
              className="vintage-button relative"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs 
                                 rounded-full flex items-center justify-center font-bold">
                  {unreadNotifications}
                </span>
              )}
            </Button>
            
            <Button
              onClick={handleWakeUp}
              variant="outline"
              className="vintage-button"
            >
              <Eye className="w-4 h-4 mr-2" />
              Wake Up
            </Button>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="mb-6">
          <DreamTimelineSlider
            currentEra={playerState.current_era}
            position={uiState.timelinePosition}
            onPositionChange={(pos) => {
              setUiState({ ...uiState, timelinePosition: pos })
              handleEraChange(pos)
            }}
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="vintage-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sepia-600">Dream Currency</p>
                  <p className="text-2xl font-bold text-sepia-900">
                    ${playerState.dream_currency.toLocaleString()}
                  </p>
                </div>
                <Building className="w-8 h-8 text-sepia-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="vintage-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sepia-600">Reputation</p>
                  <p className="text-2xl font-bold text-sepia-900">
                    {playerState.reputation_points}
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-sepia-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="vintage-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sepia-600">Location</p>
                  <p className="text-lg font-bold text-sepia-900">
                    {playerState.current_location}
                  </p>
                </div>
                <Building className="w-8 h-8 text-sepia-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="vintage-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-sepia-600">Talents</p>
                  <p className="text-2xl font-bold text-sepia-900">
                    {playerState.dream_talents.length}
                  </p>
                </div>
                <Music className="w-8 h-8 text-sepia-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="talents" className="vintage-tabs">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="talents">Talents</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="legacy">Legacy</TabsTrigger>
          </TabsList>

          <TabsContent value="talents" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {talents.map((talent) => (
                <DreamTalentCard
                  key={talent.id}
                  talent={talent}
                  onSelect={() => setUiState({ ...uiState, selectedTalent: talent })}
                  onAction={(action) => {
                    console.log('Talent action:', action)
                    handleLucidAction(10)
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <div className="space-y-4">
              {/* Events list would go here */}
              <Card className="vintage-card">
                <CardHeader>
                  <CardTitle>Upcoming Dream Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sepia-600">No active events at the moment...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="venues" className="mt-6">
            <DreamVenueManager
              venues={venues}
              currentEra={playerState.current_era}
              onVenueAction={(venue, action) => {
                console.log('Venue action:', action, venue)
                handleLucidAction(15)
              }}
            />
          </TabsContent>

          <TabsContent value="contracts" className="mt-6">
            <Card className="vintage-card">
              <CardHeader>
                <CardTitle>Era Contracts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sepia-600">No active contracts...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legacy" className="mt-6">
            <LegacyUnlocksPanel
              unlocks={legacyUnlocks}
              onClaim={(unlock) => {
                console.log('Claiming unlock:', unlock)
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dream Event Modal */}
      {currentEvent && (
        <DreamEventModal
          event={currentEvent}
          lucidMeter={playerState.lucid_meter}
          onChoice={(choice) => {
            console.log('Event choice:', choice)
            setCurrentEvent(null)
            if (choice.lucidCost) {
              handleLucidAction(choice.lucidCost)
            }
          }}
          onClose={() => setCurrentEvent(null)}
        />
      )}

      {/* Dream transition overlay */}
      {uiState.showDreamTransition && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-serif text-white mb-4 animate-fade-in">
              Waking up...
            </h2>
            <p className="text-xl text-gray-300 animate-pulse">
              Reality is calling you back
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DreamworldDashboard