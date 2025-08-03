import { create } from 'zustand'
import { DreamworldTalent, DreamEvent, DreamworldPlayerState, DreamEra } from '../types/dreamworld'

interface DreamworldStore {
  // State
  playerState: DreamworldPlayerState | null
  talents: DreamworldTalent[]
  dreamEvents: DreamEvent[]
  currentView: 'dashboard' | 'talents' | 'events' | 'lucidMeter' | 'timeline' | 'calendar'
  selectedTalent: DreamworldTalent | null
  activeDreamEvent: DreamEvent | null
  loading: boolean
  
  // Actions
  setPlayerState: (state: DreamworldPlayerState) => void
  updateLucidMeter: (value: number) => void
  changeEra: (era: DreamEra) => void
  setTalents: (talents: DreamworldTalent[]) => void
  addDreamEvent: (event: DreamEvent) => void
  setCurrentView: (view: DreamworldStore['currentView']) => void
  selectTalent: (talent: DreamworldTalent | null) => void
  setActiveDreamEvent: (event: DreamEvent | null) => void
  addRealityGlitch: (glitch: any) => void
  resetDreamworld: () => void
}

export const useDreamworldStore = create<DreamworldStore>((set, get) => ({
  // Initial state
  playerState: null,
  talents: [],
  dreamEvents: [],
  currentView: 'dashboard',
  selectedTalent: null,
  activeDreamEvent: null,
  loading: false,

  // Actions
  setPlayerState: (state) => set({ playerState: state }),
  
  updateLucidMeter: (value) => set((state) => ({
    playerState: state.playerState 
      ? { ...state.playerState, lucid_meter: Math.max(0, Math.min(100, value)) }
      : null
  })),
  
  changeEra: (era) => set((state) => ({
    playerState: state.playerState 
      ? { ...state.playerState, current_era: era }
      : null
  })),
  
  setTalents: (talents) => set({ talents }),
  
  addDreamEvent: (event) => set((state) => ({
    dreamEvents: [...state.dreamEvents, event]
  })),
  
  setCurrentView: (view) => set({ currentView: view }),
  
  selectTalent: (talent) => set({ selectedTalent: talent }),
  
  setActiveDreamEvent: (event) => set({ activeDreamEvent: event }),
  
  addRealityGlitch: (glitch) => set((state) => ({
    playerState: state.playerState 
      ? {
          ...state.playerState,
          reality_glitches: [...state.playerState.reality_glitches, glitch]
        }
      : null
  })),
  
  resetDreamworld: () => set({
    playerState: null,
    talents: [],
    dreamEvents: [],
    currentView: 'dashboard',
    selectedTalent: null,
    activeDreamEvent: null,
    loading: false
  })
}))

// Mock data generator for development
export const generateMockDreamworldData = (): {
  playerState: DreamworldPlayerState
  talents: DreamworldTalent[]
  events: DreamEvent[]
} => {
  const playerState: DreamworldPlayerState = {
    id: '1',
    player_id: 'player-1',
    current_era: '1920s',
    lucid_meter: 75,
    dream_level: 3,
    wellness_meter: 80,
    reality_glitches: [],
    current_location: 'Harlem, New York',
    return_conditions: [
      { type: 'lucidMeter', threshold: 0, description: 'Wake when lucidity depletes' }
    ],
    dream_talents: [],
    dream_currency: 2500,
    reputation_points: 45,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const talents: DreamworldTalent[] = [
    {
      id: '1',
      name: 'Louis Armstrong',
      dream_era: '1920s',
      career_path: 'singer',
      era_specific_skills: {
        trumpet: 95,
        vocals: 88,
        charisma: 92,
        jazz_innovation: 97,
        stage_presence: 90
      },
      dream_anomaly: 'Sometimes plays melodies from the future',
      lucid_events: [],
      notoriety: 85,
      current_location: 'Cotton Club',
      relationships: { 'duke_ellington': 'friend', 'al_capone': 'acquaintance' },
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Bessie Smith',
      dream_era: '1920s',
      career_path: 'singer',
      era_specific_skills: {
        blues_vocals: 98,
        stage_presence: 90,
        songwriting: 85,
        charisma: 88
      },
      dream_anomaly: 'Her voice echoes through time',
      lucid_events: [],
      notoriety: 82,
      current_location: 'Chicago Theater',
      relationships: { 'ma_rainey': 'mentor' },
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Jack Dempsey',
      dream_era: '1920s',
      career_path: 'boxer',
      era_specific_skills: {
        power: 94,
        speed: 85,
        defense: 82,
        intimidation: 90,
        stamina: 88
      },
      dream_anomaly: 'Uses boxing techniques not yet invented',
      lucid_events: [],
      notoriety: 92,
      current_location: 'Madison Square Garden',
      relationships: { 'gene_tunney': 'rival' },
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Charlie Chaplin',
      dream_era: '1920s',
      career_path: 'actor',
      era_specific_skills: {
        physical_comedy: 98,
        directing: 90,
        charisma: 85,
        creativity: 95
      },
      dream_anomaly: 'His films contain hidden messages about the future',
      lucid_events: [],
      notoriety: 88,
      current_location: 'Hollywood',
      relationships: { 'mary_pickford': 'colleague' },
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const events: DreamEvent[] = [
    {
      id: '1',
      player_id: 'player-1',
      dream_type: 'prophecy',
      content: 'You see a vision of the Cotton Club filled with golden light. A mysterious figure whispers that tomorrow\'s performance will change everything.',
      impact_score: 75,
      actionable_insight: 'Book your best talent at the Cotton Club immediately',
      career_path: 'singer',
      era: '1920s',
      choices: [
        { label: 'Follow the prophecy', effect: 'Book Cotton Club performance' },
        { label: 'Investigate the figure', effect: 'Discover hidden connection', lucidCost: 10 },
        { label: 'Ignore the vision', effect: 'Continue as normal' }
      ],
      triggered_at: new Date().toISOString()
    }
  ]

  return { playerState, talents, events }
}