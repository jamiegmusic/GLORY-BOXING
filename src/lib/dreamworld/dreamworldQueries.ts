/**
 * Dreamworld Database Queries
 * Example queries for the three core dreamworld tables
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client (use your existing client)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ============================================
// DREAMWORLD_TALENTS QUERIES
// ============================================

/**
 * Get all talents for a specific era
 */
export async function getDreamworldTalentsByEra(era: string) {
  const { data, error } = await supabase
    .from('dreamworld_talents')
    .select('*')
    .eq('dream_era', era)
    .order('notoriety', { ascending: false })

  return { data, error }
}

/**
 * Create a dreamworld talent with link to main game
 */
export async function createDreamworldTalent(
  talent: {
    name: string
    dream_era: string
    career_path: string
    real_world_link?: string // UUID from main game celebrities table
  }
) {
  const { data, error } = await supabase
    .from('dreamworld_talents')
    .insert({
      ...talent,
      era_specific_skills: {
        // Default skills based on career path
        ...(talent.career_path === 'boxer' && { power: 70, speed: 70, defense: 70 }),
        ...(talent.career_path === 'singer' && { vocals: 70, charisma: 75, stage_presence: 70 }),
        ...(talent.career_path === 'actor' && { acting: 75, charisma: 70, versatility: 65 })
      }
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Update talent relationships (for rivalry/alliance system)
 */
export async function updateTalentRelationships(
  talentId: string,
  newRelationship: { targetId: string; type: 'ally' | 'rival' | 'mentor' | 'student' }
) {
  // First get current relationships
  const { data: talent } = await supabase
    .from('dreamworld_talents')
    .select('relationships')
    .eq('id', talentId)
    .single()

  const updatedRelationships = {
    ...talent?.relationships,
    [newRelationship.targetId]: newRelationship.type
  }

  const { data, error } = await supabase
    .from('dreamworld_talents')
    .update({ relationships: updatedRelationships })
    .eq('id', talentId)
    .select()
    .single()

  return { data, error }
}

// ============================================
// DREAM_EVENTS QUERIES
// ============================================

/**
 * Generate and store a dream event
 */
export async function createDreamEvent(
  playerId: string,
  eventData: {
    dream_type: 'prophecy' | 'warning' | 'inspiration' | 'nightmare' | 'vision'
    content: string
    impact_score: number
    career_path?: string
  }
) {
  const { data, error } = await supabase
    .from('dream_events')
    .insert({
      player_id: playerId,
      ...eventData,
      actionable_insight: generateInsight(eventData.dream_type, eventData.impact_score)
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Get recent dream events for a player
 */
export async function getPlayerDreamEvents(playerId: string, limit = 10) {
  const { data, error } = await supabase
    .from('dream_events')
    .select('*')
    .eq('player_id', playerId)
    .order('triggered_at', { ascending: false })
    .limit(limit)

  return { data, error }
}

/**
 * Get high-impact prophecies (for main game integration)
 */
export async function getHighImpactProphecies(playerId: string, minScore = 70) {
  const { data, error } = await supabase
    .from('dream_events')
    .select('*')
    .eq('player_id', playerId)
    .eq('dream_type', 'prophecy')
    .gte('impact_score', minScore)
    .order('impact_score', { ascending: false })

  return { data, error }
}

// ============================================
// DREAMWORLD_PLAYER_STATE QUERIES
// ============================================

/**
 * Initialize or get player's dreamworld state
 */
export async function initializeDreamworldState(playerId: string) {
  // Try to get existing state
  const { data: existing } = await supabase
    .from('dreamworld_player_state')
    .select('*')
    .eq('player_id', playerId)
    .single()

  if (existing) return { data: existing, error: null }

  // Create new state
  const { data, error } = await supabase
    .from('dreamworld_player_state')
    .insert({
      player_id: playerId,
      current_era: '1920s',
      lucid_meter: 50,
      dream_level: 1,
      wellness_meter: 75,
      return_conditions: {
        lucid_meter_zero: true,
        max_dream_level: 10,
        critical_wellness: 10
      }
    })
    .select()
    .single()

  return { data, error }
}

/**
 * Update lucid meter (main gameplay mechanic)
 */
export async function updateLucidMeter(playerId: string, change: number) {
  // Get current state
  const { data: state } = await supabase
    .from('dreamworld_player_state')
    .select('lucid_meter')
    .eq('player_id', playerId)
    .single()

  const newValue = Math.max(0, Math.min(100, (state?.lucid_meter || 50) + change))

  const { data, error } = await supabase
    .from('dreamworld_player_state')
    .update({ lucid_meter: newValue })
    .eq('player_id', playerId)
    .select()
    .single()

  // Check if player should wake up
  if (newValue === 0) {
    await triggerWakeUp(playerId)
  }

  return { data, error }
}

/**
 * Add reality glitch
 */
export async function addRealityGlitch(
  playerId: string,
  glitch: { type: string; severity: number; description: string }
) {
  const { data: state } = await supabase
    .from('dreamworld_player_state')
    .select('reality_glitches')
    .eq('player_id', playerId)
    .single()

  const updatedGlitches = [
    ...(state?.reality_glitches || []),
    { ...glitch, timestamp: new Date().toISOString() }
  ]

  const { data, error } = await supabase
    .from('dreamworld_player_state')
    .update({ reality_glitches: updatedGlitches })
    .eq('player_id', playerId)
    .select()
    .single()

  return { data, error }
}

/**
 * Change dreamworld era
 */
export async function changeDreamEra(playerId: string, newEra: string) {
  const { data, error } = await supabase
    .from('dreamworld_player_state')
    .update({ 
      current_era: newEra,
      current_location: getDefaultLocation(newEra)
    })
    .eq('player_id', playerId)
    .select()
    .single()

  // Add temporal glitch when changing eras
  await addRealityGlitch(playerId, {
    type: 'temporal',
    severity: 30,
    description: `Time shifted to the ${newEra}`
  })

  return { data, error }
}

// ============================================
// INTEGRATION HELPERS
// ============================================

/**
 * Check if player meets wake up conditions
 */
export async function checkWakeUpConditions(playerId: string): Promise<boolean> {
  const { data: state } = await supabase
    .from('dreamworld_player_state')
    .select('*')
    .eq('player_id', playerId)
    .single()

  if (!state) return false

  // Check various conditions
  if (state.lucid_meter <= 0) return true
  if (state.wellness_meter <= 10) return true
  if (state.dream_level >= 10) return true

  return false
}

/**
 * Link dreamworld talent to main game celebrity
 */
export async function linkToMainGame(dreamTalentId: string, mainCelebrityId: string) {
  const { data, error } = await supabase
    .from('dreamworld_talents')
    .update({ real_world_link: mainCelebrityId })
    .eq('id', dreamTalentId)
    .select()
    .single()

  return { data, error }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateInsight(dreamType: string, impactScore: number): string {
  const insights = {
    prophecy: 'Pay attention to upcoming opportunities',
    warning: 'Take preventive measures soon',
    inspiration: 'Apply this creative vision to your current situation',
    nightmare: 'Address underlying fears to prevent setbacks',
    vision: 'This glimpse of the future can guide your strategy'
  }
  
  const prefix = impactScore > 70 ? 'CRITICAL: ' : ''
  return prefix + insights[dreamType as keyof typeof insights]
}

function getDefaultLocation(era: string): string {
  const locations = {
    '1920s': 'Harlem',
    '1930s': 'Hollywood',
    '1940s': 'Times Square',
    '1950s': 'Las Vegas'
  }
  return locations[era as keyof typeof locations] || 'New York'
}

async function triggerWakeUp(playerId: string) {
  // This would trigger the return to main game
  console.log(`Player ${playerId} is waking up from dreamworld...`)
  // Implementation would depend on your main game architecture
}