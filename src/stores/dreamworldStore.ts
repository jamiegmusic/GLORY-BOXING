import { create } from 'zustand'
import { createClient } from '@supabase/supabase-js'
import { DreamworldTalent, DreamEvent, DreamworldPlayerState, DreamEra } from '../types/dreamworld'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface DreamworldStore {
  // Core State
  lucidMeter: number
  currentEra: string
  dreamLevel: number
  dreamEvents: DreamEvent[]
  talents: DreamworldTalent[]
  
  // Additional State
  playerState: DreamworldPlayerState | null
  isLoading: boolean
  error: string | null
  
  // Core Methods
  addDreamEvent: (event: Omit<DreamEvent, 'id' | 'triggered_at'>) => Promise<void>
  updateLucidMeter: (value: number) => Promise<void>
  recruitTalent: (talentId: string) => Promise<void>
  progressEra: () => Promise<void>
  wakeUpFromDream: () => Promise<{ legacyItems: any[] }>
  
  // Additional Methods
  initializeDreamworld: (playerId: string) => Promise<void>
  syncWithSupabase: () => Promise<void>
  setError: (error: string | null) => void
  
  // Helper Methods
  generateAndAddDreamEvent: (dreamType: string, careerPath?: string) => Promise<void>
  checkWakeUpConditions: () => boolean
}

export const useDreamworldStore = create<DreamworldStore>((set, get) => ({
  // Initial state
  lucidMeter: 50,
  currentEra: '1920s',
  dreamLevel: 1,
  dreamEvents: [],
  talents: [],
  playerState: null,
  isLoading: false,
  error: null,

  // Initialize dreamworld for a player
  initializeDreamworld: async (playerId: string) => {
    set({ isLoading: true, error: null })
    
    try {
      // Get or create player state
      let { data: playerState, error: stateError } = await supabase
        .from('dreamworld_player_state')
        .select('*')
        .eq('player_id', playerId)
        .single()
      
      if (stateError && stateError.code === 'PGRST116') {
        // No state exists, create new one
        const { data: newState, error: createError } = await supabase
          .from('dreamworld_player_state')
          .insert({
            player_id: playerId,
            current_era: '1920s',
            lucid_meter: 50,
            dream_level: 1,
            wellness_meter: 75,
            reality_glitches: [],
            current_location: 'Harlem',
            return_conditions: {
              lucid_meter_zero: true,
              max_dream_level: 10,
              critical_wellness: 10
            }
          })
          .select()
          .single()
        
        if (createError) throw createError
        playerState = newState
      }
      
      // Load talents for current era
      const { data: talents, error: talentsError } = await supabase
        .from('dreamworld_talents')
        .select('*')
        .eq('dream_era', playerState.current_era)
        .order('notoriety', { ascending: false })
      
      if (talentsError) throw talentsError
      
      // Load recent dream events
      const { data: events, error: eventsError } = await supabase
        .from('dream_events')
        .select('*')
        .eq('player_id', playerId)
        .order('triggered_at', { ascending: false })
        .limit(20)
      
      if (eventsError) throw eventsError
      
      set({
        playerState,
        lucidMeter: playerState.lucid_meter,
        currentEra: playerState.current_era,
        dreamLevel: playerState.dream_level,
        talents: talents || [],
        dreamEvents: events || [],
        isLoading: false
      })
      
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to initialize dreamworld',
        isLoading: false 
      })
    }
  },

  // Add a dream event
  addDreamEvent: async (eventData) => {
    const state = get()
    if (!state.playerState) return
    
    try {
      const { data, error } = await supabase
        .from('dream_events')
        .insert({
          player_id: state.playerState.player_id,
          ...eventData
        })
        .select()
        .single()
      
      if (error) throw error
      
      set(state => ({
        dreamEvents: [data, ...state.dreamEvents]
      }))
      
      // Update lucid meter based on event impact
      if (eventData.impact_score > 70) {
        await get().updateLucidMeter(state.lucidMeter - 5)
      }
      
    } catch (error: any) {
      set({ error: error.message || 'Failed to add dream event' })
    }
  },

  // Update lucid meter
  updateLucidMeter: async (value: number) => {
    const state = get()
    if (!state.playerState) return
    
    const newValue = Math.max(0, Math.min(100, value))
    
    try {
      const { error } = await supabase
        .from('dreamworld_player_state')
        .update({ lucid_meter: newValue })
        .eq('player_id', state.playerState.player_id)
      
      if (error) throw error
      
      set({ 
        lucidMeter: newValue,
        playerState: { ...state.playerState, lucid_meter: newValue }
      })
      
      // Check wake up conditions
      if (get().checkWakeUpConditions()) {
        await get().wakeUpFromDream()
      }
      
    } catch (error: any) {
      set({ error: error.message || 'Failed to update lucid meter' })
    }
  },

  // Recruit a talent
  recruitTalent: async (talentId: string) => {
    const state = get()
    if (!state.playerState) return
    
    try {
      // Get the talent
      const talent = state.talents.find(t => t.id === talentId)
      if (!talent) throw new Error('Talent not found')
      
      // Check lucid cost (base 20)
      const lucidCost = 20
      if (state.lucidMeter < lucidCost) {
        throw new Error('Not enough lucid energy')
      }
      
      // Update player's dream_talents array
      const updatedDreamTalents = [
        ...(state.playerState.dream_talents || []),
        talentId
      ]
      
      const { error } = await supabase
        .from('dreamworld_player_state')
        .update({ 
          dream_talents: updatedDreamTalents,
          dream_currency: (state.playerState.dream_currency || 0) - 500
        })
        .eq('player_id', state.playerState.player_id)
      
      if (error) throw error
      
      // Update local state
      set(state => ({
        playerState: state.playerState ? {
          ...state.playerState,
          dream_talents: updatedDreamTalents,
          dream_currency: (state.playerState.dream_currency || 0) - 500
        } : null
      }))
      
      // Deduct lucid energy
      await get().updateLucidMeter(state.lucidMeter - lucidCost)
      
      // Generate recruitment event
      await get().addDreamEvent({
        dream_type: 'inspiration',
        content: `You've successfully recruited ${talent.name} to your dreamworld team!`,
        impact_score: 60,
        actionable_insight: `${talent.name}'s unique skills will help shape your dream reality`,
        career_path: talent.career_path,
        era: state.currentEra
      })
      
    } catch (error: any) {
      set({ error: error.message || 'Failed to recruit talent' })
    }
  },

  // Progress to next era
  progressEra: async () => {
    const state = get()
    if (!state.playerState) return
    
    const eras = ['1920s', '1930s', '1940s', '1950s']
    const currentIndex = eras.indexOf(state.currentEra)
    
    if (currentIndex === -1 || currentIndex === eras.length - 1) {
      set({ error: 'Cannot progress further' })
      return
    }
    
    const nextEra = eras[currentIndex + 1]
    const lucidCost = 25
    
    if (state.lucidMeter < lucidCost) {
      set({ error: 'Not enough lucid energy to travel through time' })
      return
    }
    
    try {
      // Update player state
      const { error } = await supabase
        .from('dreamworld_player_state')
        .update({ 
          current_era: nextEra,
          dream_level: state.dreamLevel + 1
        })
        .eq('player_id', state.playerState.player_id)
      
      if (error) throw error
      
      // Load new era's talents
      const { data: talents } = await supabase
        .from('dreamworld_talents')
        .select('*')
        .eq('dream_era', nextEra)
        .order('notoriety', { ascending: false })
      
      // Add reality glitch for era travel
      const glitches = [
        ...(state.playerState.reality_glitches || []),
        {
          type: 'temporal',
          severity: 30,
          description: `Time shifted to the ${nextEra}`,
          timestamp: new Date().toISOString()
        }
      ]
      
      await supabase
        .from('dreamworld_player_state')
        .update({ reality_glitches: glitches })
        .eq('player_id', state.playerState.player_id)
      
      set({
        currentEra: nextEra,
        dreamLevel: state.dreamLevel + 1,
        talents: talents || [],
        playerState: state.playerState ? {
          ...state.playerState,
          current_era: nextEra,
          dream_level: state.dreamLevel + 1,
          reality_glitches: glitches
        } : null
      })
      
      // Deduct lucid energy
      await get().updateLucidMeter(state.lucidMeter - lucidCost)
      
      // Generate era transition event
      await get().addDreamEvent({
        dream_type: 'vision',
        content: `The world shifts around you as time flows forward to the ${nextEra}...`,
        impact_score: 80,
        actionable_insight: 'New opportunities and talents await in this era',
        era: nextEra
      })
      
    } catch (error: any) {
      set({ error: error.message || 'Failed to progress era' })
    }
  },

  // Wake up from dream
  wakeUpFromDream: async () => {
    const state = get()
    if (!state.playerState) return { legacyItems: [] }
    
    try {
      // Calculate legacy items based on performance
      const legacyItems = []
      
      // Achievement-based unlocks
      if (state.dreamLevel >= 5) {
        legacyItems.push({
          type: 'skill',
          name: 'Dream Vision',
          description: 'Enhanced perception from dreamworld experiences',
          effect: { perception: +10, charisma: +5 }
        })
      }
      
      if (state.playerState.reputation_points > 50) {
        legacyItems.push({
          type: 'connection',
          name: 'Timeless Network',
          description: 'Connections that transcend time',
          effect: { networking: +15, opportunities: +20 }
        })
      }
      
      if (state.dreamEvents.filter(e => e.dream_type === 'prophecy').length >= 3) {
        legacyItems.push({
          type: 'knowledge',
          name: 'Prophetic Insights',
          description: 'Ability to foresee future trends',
          effect: { foresight: +20, strategy: +10 }
        })
      }
      
      // Store legacy items (you would implement this based on your main game structure)
      console.log('Legacy items earned:', legacyItems)
      
      // Reset dreamworld state
      await supabase
        .from('dreamworld_player_state')
        .update({
          lucid_meter: 50,
          dream_level: 1,
          wellness_meter: 75,
          current_era: '1920s',
          reality_glitches: [],
          dream_talents: []
        })
        .eq('player_id', state.playerState.player_id)
      
      // Clear local state
      set({
        lucidMeter: 50,
        currentEra: '1920s',
        dreamLevel: 1,
        dreamEvents: [],
        talents: [],
        playerState: null
      })
      
      return { legacyItems }
      
    } catch (error: any) {
      set({ error: error.message || 'Failed to wake up properly' })
      return { legacyItems: [] }
    }
  },

  // Helper: Generate and add dream event
  generateAndAddDreamEvent: async (dreamType: string, careerPath?: string) => {
    const state = get()
    if (!state.playerState) return
    
    // Import and use DreamEventGenerator
    const { generateDreamEvent } = await import('@/lib/dreamworld/DreamEventGenerator')
    
    const event = await generateDreamEvent({
      dreamType: dreamType as any,
      careerPath,
      era: state.currentEra,
      playerState: state.playerState,
      talents: state.talents
    })
    
    await get().addDreamEvent(event)
  },

  // Helper: Check wake up conditions
  checkWakeUpConditions: () => {
    const state = get()
    if (!state.playerState) return false
    
    return (
      state.lucidMeter <= 0 ||
      state.playerState.wellness_meter <= 10 ||
      state.dreamLevel >= 10
    )
  },

  // Sync with Supabase
  syncWithSupabase: async () => {
    const state = get()
    if (!state.playerState) return
    
    await get().initializeDreamworld(state.playerState.player_id)
  },

  // Set error
  setError: (error) => set({ error })
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