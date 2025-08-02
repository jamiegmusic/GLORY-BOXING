import { createClient } from '@supabase/supabase-js'
import type { 
  Fighter, 
  Match, 
  Title, 
  Ranking, 
  PressConference, 
  HealthMonitoring,
  TrainingCamp,
  Contract,
  Injury,
  GameState
} from './unified-types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for common operations
export const supabaseHelpers = {
  // Fighter operations
  async getFighters() {
    const { data, error } = await supabase
      .from('fighters')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  async getFighter(id: string) {
    const { data, error } = await supabase
      .from('fighters')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async updateFighter(id: string, updates: any) {
    const { data, error } = await supabase
      .from('fighters')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Match operations
  async getMatches() {
    const { data, error } = await supabase
      .from('fights')
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createMatch(matchData: any) {
    const { data, error } = await supabase
      .from('fights')
      .insert(matchData)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateMatch(id: string, updates: any) {
    const { data, error } = await supabase
      .from('fights')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Rankings operations
  async getRankings() {
    const { data, error } = await supabase
      .from('rankings')
      .select('*')
      .order('rank', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Titles operations
  async getTitles() {
    const { data, error } = await supabase
      .from('titles')
      .select('*')
      .order('belt_name')
    
    if (error) throw error
    return data
  },

  // Press conferences operations
  async getPressConferences() {
    const { data, error } = await supabase
      .from('press_conferences')
      .select('*')
      .order('conference_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Health monitoring operations
  async getHealthMonitoring(fighterId: string) {
    const { data, error } = await supabase
      .from('health_monitoring')
      .select('*')
      .eq('fighter_id', fighterId)
      .order('assessment_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Real-time subscriptions
  subscribeToTable(table: string, callback: (payload: any) => void) {
    return supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe()
  },

  // Analytics operations
  async trackEvent(eventType: string, eventData: any) {
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: eventType,
        event_data: eventData,
        timestamp: new Date().toISOString()
      })
    
    if (error) console.error('Failed to track event:', error)
  }
}

export default supabase 