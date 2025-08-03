import { create } from 'zustand'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Types
interface DreamEvent {
  id: string
  player_id: string
  dream_type: 'prophecy' | 'warning' | 'inspiration' | 'nightmare' | 'vision'
  content: string
  impact_score: number
  actionable_insight?: string
  career_path?: string
  triggered_at: string
}

interface Talent {
  id: string
  name: string
  dream_era: string
  career_path: string
  era_specific_skills: Record<string, number>
  dream_anomaly?: string
  notoriety: number
  current_location?: string
  relationships?: Record<string, string>
  status: string
}

interface DreamworldStore {
  // State
  lucidMeter: number
  currentEra: string
  dreamLevel: number
  dreamEvents: DreamEvent[]
  talents: Talent[]
  
  // Player ID for Supabase sync
  playerId: string | null
  
  // Loading states
  isLoading: boolean
  error: string | null
  
  // Methods
  addDreamEvent: (event: Omit<DreamEvent, 'id' | 'triggered_at' | 'player_id'>) => Promise<void>
  updateLucidMeter: (value: number) => Promise<void>
  recruitTalent: (talentId: string) => Promise<void>
  progressEra: () => Promise<void>
  wakeUpFromDream: () => Promise<{ success: boolean; legacyItems: any[] }>
  
  // Initialization
  initializeStore: (playerId: string) => Promise<void>
  
  // Helpers
  setError: (error: string | null) => void
  syncFromSupabase: () => Promise<void>
}

const useDreamworldStore = create<DreamworldStore>((set, get) => ({
  // Initial state
  lucidMeter: 50,
  currentEra: '1920s',
  dreamLevel: 1,
  dreamEvents: [],
  talents: [],
  playerId: null,
  isLoading: false,
  error: null,

  // Initialize store with player data
  initializeStore: async (playerId: string) => {
    set({ isLoading: true, error: null, playerId })
    
    try {
      // Get or create player state
      let { data: playerState, error: stateError } = await supabase
        .from('dreamworld_player_state')
        .select('*')
        .eq('player_id', playerId)
        .single()
      
      if (stateError && stateError.code === 'PGRST116') {
        // Create new player state
        const { data: newState, error: createError } = await supabase
          .from('dreamworld_player_state')
          .insert({
            player_id: playerId,
            current_era: '1920s',
            lucid_meter: 50,
            dream_level: 1,
            wellness_meter: 75,
            current_location: 'Harlem',
            reality_glitches: [],
            return_conditions: { lucid_meter_zero: true }
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
      
      if (talentsError) throw talentsError
      
      // Load recent dream events
      const { data: events, error: eventsError } = await supabase
        .from('dream_events')
        .select('*')
        .eq('player_id', playerId)
        .order('triggered_at', { ascending: false })
        .limit(50)
      
      if (eventsError) throw eventsError
      
      set({
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
    const { playerId } = get()
    if (!playerId) {
      set({ error: 'No player ID set' })
      return
    }
    
    try {
      const { data, error } = await supabase
        .from('dream_events')
        .insert({
          player_id: playerId,
          ...eventData
        })
        .select()
        .single()
      
      if (error) throw error
      
      set(state => ({
        dreamEvents: [data, ...state.dreamEvents]
      }))
      
    } catch (error: any) {
      set({ error: error.message || 'Failed to add dream event' })
    }
  },

  // Update lucid meter
  updateLucidMeter: async (value: number) => {
    const { playerId } = get()
    if (!playerId) {
      set({ error: 'No player ID set' })
      return
    }
    
    const newValue = Math.max(0, Math.min(100, value))
    
    try {
      const { error } = await supabase
        .from('dreamworld_player_state')
        .update({ lucid_meter: newValue })
        .eq('player_id', playerId)
      
      if (error) throw error
      
      set({ lucidMeter: newValue })
      
      // Auto wake up if lucid meter hits 0
      if (newValue === 0) {
        await get().wakeUpFromDream()
      }
      
    } catch (error: any) {
      set({ error: error.message || 'Failed to update lucid meter' })
    }
  },

  // Recruit a talent
  recruitTalent: async (talentId: string) => {
    const { playerId, lucidMeter, talents } = get()
    if (!playerId) {
      set({ error: 'No player ID set' })
      return
    }
    
    const recruitCost = 20
    if (lucidMeter < recruitCost) {
      set({ error: 'Not enough lucid energy to recruit' })
      return
    }
    
    try {
      // Find the talent
      const talent = talents.find(t => t.id === talentId)
      if (!talent) throw new Error('Talent not found')
      
      // Deduct lucid energy
      await get().updateLucidMeter(lucidMeter - recruitCost)
      
      // Add recruitment event
      await get().addDreamEvent({
        dream_type: 'inspiration',
        content: `You have successfully recruited ${talent.name} to your dreamworld team!`,
        impact_score: 60,
        actionable_insight: `${talent.name} brings unique ${talent.career_path} skills to your roster`,
        career_path: talent.career_path
      })
      
      // Update talent status locally (in a real app, you'd update the database)
      set(state => ({
        talents: state.talents.map(t => 
          t.id === talentId ? { ...t, status: 'recruited' } : t
        )
      }))
      
    } catch (error: any) {
      set({ error: error.message || 'Failed to recruit talent' })
    }
  },

  // Progress to next era
  progressEra: async () => {
    const { playerId, currentEra, lucidMeter, dreamLevel } = get()
    if (!playerId) {
      set({ error: 'No player ID set' })
      return
    }
    
    const eras = ['1920s', '1930s', '1940s', '1950s']
    const currentIndex = eras.indexOf(currentEra)
    
    if (currentIndex === -1 || currentIndex === eras.length - 1) {
      set({ error: 'Cannot progress further in time' })
      return
    }
    
    const progressCost = 25
    if (lucidMeter < progressCost) {
      set({ error: 'Not enough lucid energy to travel through time' })
      return
    }
    
    const nextEra = eras[currentIndex + 1]
    
    try {
      // Update player state
      const { error } = await supabase
        .from('dreamworld_player_state')
        .update({ 
          current_era: nextEra,
          dream_level: dreamLevel + 1
        })
        .eq('player_id', playerId)
      
      if (error) throw error
      
      // Load new era's talents
      const { data: newTalents, error: talentsError } = await supabase
        .from('dreamworld_talents')
        .select('*')
        .eq('dream_era', nextEra)
      
      if (talentsError) throw talentsError
      
      // Update local state
      set({
        currentEra: nextEra,
        dreamLevel: dreamLevel + 1,
        talents: newTalents || [],
        lucidMeter: lucidMeter - progressCost
      })
      
      // Add era transition event
      await get().addDreamEvent({
        dream_type: 'vision',
        content: `Time shifts around you as you enter the ${nextEra}. New talents and opportunities await.`,
        impact_score: 80,
        actionable_insight: 'Explore the new era and discover its unique talents'
      })
      
      // Update lucid meter in database
      await supabase
        .from('dreamworld_player_state')
        .update({ lucid_meter: lucidMeter - progressCost })
        .eq('player_id', playerId)
      
    } catch (error: any) {
      set({ error: error.message || 'Failed to progress era' })
    }
  },

  // Wake up from dream
  wakeUpFromDream: async () => {
    const { playerId, dreamLevel, dreamEvents } = get()
    if (!playerId) {
      set({ error: 'No player ID set' })
      return { success: false, legacyItems: [] }
    }
    
    try {
      // Calculate legacy items based on performance
      const legacyItems = []
      
      // Dream level achievement
      if (dreamLevel >= 5) {
        legacyItems.push({
          type: 'skill',
          name: 'Dream Master',
          description: 'Enhanced perception from deep dream exploration',
          bonus: { perception: 10, focus: 5 }
        })
      }
      
      // High impact events achievement
      const highImpactEvents = dreamEvents.filter(e => e.impact_score >= 70)
      if (highImpactEvents.length >= 3) {
        legacyItems.push({
          type: 'knowledge',
          name: 'Prophet\'s Wisdom',
          description: 'Gained foresight from powerful dream visions',
          bonus: { strategy: 15 }
        })
      }
      
      // Talent recruitment achievement
      const recruitmentEvents = dreamEvents.filter(
        e => e.dream_type === 'inspiration' && e.content.includes('recruited')
      )
      if (recruitmentEvents.length >= 2) {
        legacyItems.push({
          type: 'connection',
          name: 'Timeless Network',
          description: 'Connections that transcend time itself',
          bonus: { networking: 20 }
        })
      }
      
      // Reset dreamworld state
      await supabase
        .from('dreamworld_player_state')
        .update({
          lucid_meter: 50,
          dream_level: 1,
          current_era: '1920s',
          wellness_meter: 75,
          reality_glitches: []
        })
        .eq('player_id', playerId)
      
      // Clear local state
      set({
        lucidMeter: 50,
        currentEra: '1920s',
        dreamLevel: 1,
        dreamEvents: [],
        talents: [],
        playerId: null
      })
      
      return { success: true, legacyItems }
      
    } catch (error: any) {
      set({ error: error.message || 'Failed to wake up from dream' })
      return { success: false, legacyItems: [] }
    }
  },

  // Sync from Supabase
  syncFromSupabase: async () => {
    const { playerId } = get()
    if (!playerId) return
    
    await get().initializeStore(playerId)
  },

  // Set error
  setError: (error) => set({ error })
}))

export default useDreamworldStore