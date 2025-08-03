import { useState, useCallback, useEffect } from 'react'
import { 
  DreamworldPlayerState, 
  DreamworldTalent, 
  DreamEvent,
  LegacyUnlock,
  DreamworldVenue 
} from '../types/dreamworld'
import { dreamLogicEngine } from '../lib/dreamworld/dreamLogicEngine'

interface UseDreamworldReturn {
  // State
  isInDreamworld: boolean
  playerState: DreamworldPlayerState | null
  talents: DreamworldTalent[]
  currentEvent: DreamEvent | null
  venues: DreamworldVenue[]
  legacyUnlocks: LegacyUnlock[]
  
  // Actions
  enterDreamworld: (playerId: string, trigger: 'knockout' | 'breakdown' | 'injury') => void
  exitDreamworld: () => void
  updateLucidMeter: (amount: number) => void
  generateDreamEvent: () => void
  resolveDreamEvent: (choiceIndex: number) => void
  claimLegacyUnlock: (unlockId: string) => void
  changeEra: (era: string) => void
  manageTalent: (talentId: string, action: string) => void
}

export const useDreamworld = (): UseDreamworldReturn => {
  const [isInDreamworld, setIsInDreamworld] = useState(false)
  const [playerState, setPlayerState] = useState<DreamworldPlayerState | null>(null)
  const [talents, setTalents] = useState<DreamworldTalent[]>([])
  const [currentEvent, setCurrentEvent] = useState<DreamEvent | null>(null)
  const [venues, setVenues] = useState<DreamworldVenue[]>([])
  const [legacyUnlocks, setLegacyUnlocks] = useState<LegacyUnlock[]>([])

  // Initialize sample venues (would normally fetch from database)
  useEffect(() => {
    setVenues([
      {
        id: '1',
        name: 'The Cotton Club',
        era: '1920s',
        venue_type: 'club',
        location: 'Harlem, New York',
        capacity: 500,
        prestige_level: 5,
        special_features: ['Jazz performances', 'Celebrity hotspot', 'Mob connections'],
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'The Savoy Ballroom',
        era: '1920s',
        venue_type: 'club',
        location: 'Harlem, New York',
        capacity: 4000,
        prestige_level: 4,
        special_features: ['Dance competitions', 'Integrated venue', 'Live orchestras'],
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Madison Square Garden',
        era: '1920s',
        venue_type: 'arena',
        location: 'New York',
        capacity: 18000,
        prestige_level: 5,
        special_features: ['Boxing matches', 'Major events', 'Press coverage'],
        created_at: new Date().toISOString()
      }
    ])

    // Initialize sample talents
    setTalents([
      {
        id: '1',
        name: 'Louis Armstrong',
        dream_era: '1920s',
        career_path: 'singer',
        era_specific_skills: { trumpet: 95, vocals: 88, charisma: 92, jazz_innovation: 97 },
        dream_anomaly: 'Sometimes plays music from the future',
        lucid_events: [],
        notoriety: 75,
        current_location: 'New Orleans',
        relationships: {},
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Bessie Smith',
        dream_era: '1920s',
        career_path: 'singer',
        era_specific_skills: { blues_vocals: 98, stage_presence: 90, songwriting: 85 },
        dream_anomaly: 'Empress of the Blues knows modern feminist anthems',
        lucid_events: [],
        notoriety: 80,
        current_location: 'Chicago',
        relationships: {},
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Jack Dempsey',
        dream_era: '1920s',
        career_path: 'boxer',
        era_specific_skills: { power: 94, speed: 85, defense: 82, intimidation: 90 },
        dream_anomaly: 'Uses modern training techniques in dreams',
        lucid_events: [],
        notoriety: 95,
        current_location: 'New York',
        relationships: {},
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
  }, [])

  const enterDreamworld = useCallback((playerId: string, trigger: 'knockout' | 'breakdown' | 'injury') => {
    setIsInDreamworld(true)
    
    // Initialize player state
    const newPlayerState: DreamworldPlayerState = {
      id: Date.now().toString(),
      player_id: playerId,
      current_era: '1920s',
      lucid_meter: trigger === 'knockout' ? 40 : trigger === 'breakdown' ? 50 : 60,
      dream_level: 1,
      wellness_meter: trigger === 'breakdown' ? 30 : 70,
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
    }
    
    setPlayerState(newPlayerState)
    
    // Generate initial dream event after a short delay
    setTimeout(() => {
      generateDreamEvent()
    }, 2000)
  }, [])

  const exitDreamworld = useCallback(() => {
    setIsInDreamworld(false)
    setCurrentEvent(null)
    
    // Apply legacy unlocks to main game
    if (legacyUnlocks.length > 0) {
      console.log('Applying legacy unlocks:', legacyUnlocks)
      // TODO: Apply effects to main game state
    }
  }, [legacyUnlocks])

  const updateLucidMeter = useCallback((amount: number) => {
    if (!playerState) return
    
    const newLucidMeter = Math.max(0, Math.min(100, playerState.lucid_meter + amount))
    setPlayerState({ ...playerState, lucid_meter: newLucidMeter })
    
    // Check wake up conditions
    if (dreamLogicEngine.checkWakeUpConditions({ ...playerState, lucid_meter: newLucidMeter })) {
      exitDreamworld()
    }
  }, [playerState, exitDreamworld])

  const generateDreamEvent = useCallback(() => {
    if (!playerState) return
    
    const event = dreamLogicEngine.generateDreamEvent(playerState, {
      talents,
      currentVenue: venues.find(v => v.era === playerState.current_era)?.name,
      recentActions: []
    })
    
    setCurrentEvent(event)
  }, [playerState, talents, venues])

  const resolveDreamEvent = useCallback((choiceIndex: number) => {
    if (!currentEvent || !playerState) return
    
    const choice = currentEvent.choices[choiceIndex]
    if (!choice) return
    
    // Apply lucid cost
    if (choice.lucidCost) {
      updateLucidMeter(-choice.lucidCost)
    }
    
    // Generate potential legacy unlock based on choice
    if (choice.effect.includes('legacy') || currentEvent.impact_score > 70) {
      const unlock = dreamLogicEngine.generateLegacyUnlock(
        playerState,
        `Resolved ${currentEvent.dream_type} event perfectly`
      )
      setLegacyUnlocks([...legacyUnlocks, unlock])
    }
    
    // Increase dream level occasionally
    if (Math.random() < 0.2) {
      setPlayerState({ 
        ...playerState, 
        dream_level: Math.min(10, playerState.dream_level + 1),
        reputation_points: playerState.reputation_points + currentEvent.impact_score
      })
    }
    
    // Clear current event
    setCurrentEvent(null)
    
    // Generate next event after delay
    setTimeout(() => {
      generateDreamEvent()
    }, 3000)
  }, [currentEvent, playerState, updateLucidMeter, legacyUnlocks, generateDreamEvent])

  const claimLegacyUnlock = useCallback((unlockId: string) => {
    setLegacyUnlocks(unlocks => 
      unlocks.map(unlock => 
        unlock.id === unlockId 
          ? { ...unlock, claimed: true, claimed_date: new Date().toISOString() }
          : unlock
      )
    )
  }, [])

  const changeEra = useCallback((era: string) => {
    if (!playerState) return
    
    setPlayerState({ 
      ...playerState, 
      current_era: era as any,
      reality_glitches: [
        ...playerState.reality_glitches,
        {
          id: Date.now().toString(),
          type: 'temporal',
          description: `Time shifted to the ${era}`,
          severity: 30,
          timestamp: new Date().toISOString()
        }
      ]
    })
    
    // Update lucid meter cost for era travel
    updateLucidMeter(-5)
  }, [playerState, updateLucidMeter])

  const manageTalent = useCallback((talentId: string, action: string) => {
    const talent = talents.find(t => t.id === talentId)
    if (!talent || !playerState) return
    
    switch (action) {
      case 'sign':
        setPlayerState({
          ...playerState,
          dream_talents: [...playerState.dream_talents, talentId],
          dream_currency: playerState.dream_currency - 500
        })
        updateLucidMeter(-10)
        break
        
      case 'negotiate':
        // Increase talent loyalty/relationship
        setTalents(talents => 
          talents.map(t => 
            t.id === talentId 
              ? { ...t, notoriety: Math.min(100, t.notoriety + 10) }
              : t
          )
        )
        updateLucidMeter(-15)
        break
        
      default:
        break
    }
  }, [talents, playerState, updateLucidMeter])

  // Apply reality glitch effects periodically
  useEffect(() => {
    if (!isInDreamworld || !playerState) return
    
    const interval = setInterval(() => {
      const updatedState = dreamLogicEngine.applyGlitchEffects(playerState)
      if (updatedState !== playerState) {
        setPlayerState(updatedState)
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isInDreamworld, playerState])

  return {
    isInDreamworld,
    playerState,
    talents,
    currentEvent,
    venues,
    legacyUnlocks,
    enterDreamworld,
    exitDreamworld,
    updateLucidMeter,
    generateDreamEvent,
    resolveDreamEvent,
    claimLegacyUnlock,
    changeEra,
    manageTalent
  }
}