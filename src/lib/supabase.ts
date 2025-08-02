import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Fighter {
  id: string
  name: string
  nickname?: string
  age: number
  weight_class: string
  nationality?: string
  hometown?: string
  height_cm?: number
  reach_cm?: number
  stance: 'orthodox' | 'southpaw' | 'switch'
  punching_power: number
  speed: number
  defense: number
  stamina: number
  chin: number
  heart: number
  ring_iq: number
  adaptability: number
  mental_toughness: number
  recovery_time: number
  record_wins: number
  record_losses: number
  record_draws: number
  knockouts: number
  total_rounds_fought: number
  experience_level: number
  career_stage: 'amateur' | 'prospect' | 'contender' | 'champion' | 'legend' | 'retired'
  prime_age_start: number
  prime_age_end: number
  decline_start_age: number
  confidence: number
  motivation: number
  stress_level: number
  personal_issues?: string[]
  current_purse: number
  career_earnings: number
  contract_value: number
  is_injured: boolean
  injury_type?: string
  injury_severity: number
  injury_recovery_weeks: number
  is_available: boolean
  current_training_focus?: string
  skill_improvement_rate: number
  last_training_date: string
  trainer_id?: string
  promoter_id?: string
  manager_id?: string
  created_at: string
  updated_at: string
}

export interface GameState {
  id: string
  player_name: string
  current_date: string
  game_week: number
  total_money: number
  reputation: number
  experience_points: number
  level: number
  created_at: string
  updated_at: string
}

export interface TrainingCamp {
  id: string
  fighter_id: string
  camp_name?: string
  start_date: string
  end_date?: string
  duration_weeks: number
  focus_punching_power: boolean
  focus_speed: boolean
  focus_defense: boolean
  focus_stamina: boolean
  focus_ring_iq: boolean
  camp_quality: number
  sparring_partners_quality: number
  nutrition_quality: number
  gym_atmosphere: number
  total_cost: number
  daily_cost: number
  head_trainer?: string
  nutritionist_hired: boolean
  strength_coach_hired: boolean
  cutman_hired: boolean
  skill_gains?: any
  camp_success_rating?: number
  notes?: string
  created_at: string
}

export interface Contract {
  id: string
  fighter_id: string
  promoter_id?: string
  contract_type: 'amateur' | 'pro_debut' | 'development' | 'championship' | 'super_fight' | 'retirement'
  base_purse: number
  win_bonus: number
  knockout_bonus: number
  ppv_percentage: number
  sponsorship_split: number
  start_date: string
  end_date?: string
  fights_committed: number
  fights_completed: number
  contract_value?: number
  negotiation_difficulty: number
  fighter_satisfaction: number
  promoter_satisfaction: number
  is_active: boolean
  is_exclusive: boolean
  termination_clause?: string
  created_at: string
  updated_at: string
}

export interface Fight {
  id: string
  fighter1_id?: string
  fighter2_id?: string
  event_name?: string
  venue_name?: string
  venue_location?: string
  fight_date?: string
  weight_class?: string
  rounds_scheduled: number
  championship_fight: boolean
  title_belt?: string
  winner_id?: string
  result_type?: 'decision' | 'ko' | 'tko' | 'draw' | 'no_contest' | 'dqd'
  round_ended?: number
  time_in_round?: string
  fighter1_punches_landed?: number
  fighter1_punches_thrown?: number
  fighter2_punches_landed?: number
  fighter2_punches_thrown?: number
  gate_receipts?: number
  ppv_buys?: number
  total_revenue?: number
  fight_rating?: number
  crowd_reaction?: number
  media_coverage_rating?: number
  created_at: string
}

export interface CutScene {
  id: string
  scene_type: 'training' | 'press_conference' | 'backstage' | 'personal_issue' | 'business_meeting' | 'fight_preparation'
  title: string
  description: string
  choices?: any
  consequences?: any
  required_fighter_id?: string
  optional_fighter_id?: string
  is_triggered: boolean
  trigger_conditions?: any
  created_at: string
} 