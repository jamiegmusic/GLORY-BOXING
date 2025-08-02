-- Complete Boxing Management System Schema
-- This migration adds all missing tables for the full feature set

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Game State Table
CREATE TABLE IF NOT EXISTS game_state (
  id SERIAL PRIMARY KEY,
  player_name TEXT DEFAULT 'Boxing Manager',
  current_date DATE DEFAULT CURRENT_DATE,
  game_week INTEGER DEFAULT 1,
  total_money DECIMAL(15,2) DEFAULT 100000,
  reputation INTEGER DEFAULT 50,
  experience_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Fighters Table (if not exists)
CREATE TABLE IF NOT EXISTS fighters (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  nickname TEXT,
  age INTEGER DEFAULT 25,
  nationality TEXT DEFAULT 'British',
  weight_class TEXT NOT NULL,
  stance TEXT DEFAULT 'orthodox',
  hometown TEXT DEFAULT 'London',
  height_cm INTEGER DEFAULT 175,
  reach_cm INTEGER DEFAULT 180,
  punching_power INTEGER DEFAULT 70,
  speed INTEGER DEFAULT 70,
  defense INTEGER DEFAULT 70,
  stamina INTEGER DEFAULT 70,
  chin INTEGER DEFAULT 70,
  heart INTEGER DEFAULT 70,
  ring_iq INTEGER DEFAULT 70,
  adaptability INTEGER DEFAULT 70,
  mental_toughness INTEGER DEFAULT 70,
  recovery_time INTEGER DEFAULT 70,
  record_wins INTEGER DEFAULT 0,
  record_losses INTEGER DEFAULT 0,
  record_draws INTEGER DEFAULT 0,
  knockouts INTEGER DEFAULT 0,
  total_rounds_fought INTEGER DEFAULT 0,
  experience_level INTEGER DEFAULT 50,
  career_stage TEXT DEFAULT 'amateur',
  prime_age_start INTEGER DEFAULT 25,
  prime_age_end INTEGER DEFAULT 35,
  decline_start_age INTEGER DEFAULT 40,
  confidence INTEGER DEFAULT 75,
  motivation INTEGER DEFAULT 75,
  stress_level INTEGER DEFAULT 25,
  personal_issues TEXT[] DEFAULT '{}',
  current_purse DECIMAL(15,2) DEFAULT 5000,
  career_earnings DECIMAL(15,2) DEFAULT 0,
  contract_value DECIMAL(15,2) DEFAULT 5000,
  is_injured BOOLEAN DEFAULT FALSE,
  injury_type TEXT DEFAULT '',
  injury_severity INTEGER DEFAULT 0,
  injury_recovery_weeks INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  current_training_focus TEXT DEFAULT '',
  skill_improvement_rate DECIMAL(3,2) DEFAULT 1.0,
  last_training_date TIMESTAMP DEFAULT NOW(),
  trainer_id TEXT DEFAULT '',
  promoter_id TEXT DEFAULT '',
  manager_id TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Fights Table
CREATE TABLE IF NOT EXISTS fights (
  id SERIAL PRIMARY KEY,
  fighter1_id INTEGER REFERENCES fighters(id),
  fighter2_id INTEGER REFERENCES fighters(id),
  event_name TEXT,
  venue_name TEXT,
  venue_location TEXT,
  fight_date DATE,
  weight_class TEXT,
  rounds_scheduled INTEGER DEFAULT 12,
  championship_fight BOOLEAN DEFAULT FALSE,
  title_belt TEXT,
  winner_id INTEGER REFERENCES fighters(id),
  result_type TEXT CHECK (result_type IN ('decision', 'ko', 'tko', 'draw', 'no_contest', 'dqd')),
  round_ended INTEGER,
  time_in_round TEXT,
  fighter1_punches_landed INTEGER DEFAULT 0,
  fighter1_punches_thrown INTEGER DEFAULT 0,
  fighter2_punches_landed INTEGER DEFAULT 0,
  fighter2_punches_thrown INTEGER DEFAULT 0,
  gate_receipts DECIMAL(15,2) DEFAULT 0,
  ppv_buys INTEGER DEFAULT 0,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  fight_rating INTEGER DEFAULT 0,
  crowd_reaction INTEGER DEFAULT 0,
  media_coverage_rating INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rankings Table
CREATE TABLE IF NOT EXISTS rankings (
  id SERIAL PRIMARY KEY,
  fighter_id INTEGER REFERENCES fighters(id),
  weight_class TEXT NOT NULL,
  rank INTEGER NOT NULL,
  points INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  last_fight_date DATE,
  movement TEXT DEFAULT 'same' CHECK (movement IN ('up', 'down', 'same')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Titles Table
CREATE TABLE IF NOT EXISTS titles (
  id SERIAL PRIMARY KEY,
  belt_name TEXT NOT NULL,
  weight_class TEXT NOT NULL,
  current_champion_id INTEGER REFERENCES fighters(id),
  previous_champion_id INTEGER REFERENCES fighters(id),
  date_won DATE,
  defenses INTEGER DEFAULT 0,
  organization TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Press Articles Table
CREATE TABLE IF NOT EXISTS press_articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  published_date TIMESTAMP DEFAULT NOW(),
  category TEXT DEFAULT 'news' CHECK (category IN ('news', 'interview', 'analysis', 'rumor')),
  fighter_id INTEGER REFERENCES fighters(id),
  fight_id INTEGER REFERENCES fights(id),
  views INTEGER DEFAULT 0,
  sentiment TEXT DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL PRIMARY KEY,
  fighter_id INTEGER REFERENCES fighters(id),
  promoter_id TEXT,
  contract_type TEXT DEFAULT 'development' CHECK (contract_type IN ('amateur', 'pro_debut', 'development', 'championship', 'super_fight', 'retirement')),
  base_purse DECIMAL(15,2) NOT NULL,
  win_bonus DECIMAL(15,2) DEFAULT 0,
  knockout_bonus DECIMAL(15,2) DEFAULT 0,
  ppv_percentage DECIMAL(5,2) DEFAULT 0,
  sponsorship_split DECIMAL(5,2) DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  fights_committed INTEGER DEFAULT 0,
  fights_completed INTEGER DEFAULT 0,
  contract_value DECIMAL(15,2),
  negotiation_difficulty INTEGER DEFAULT 50,
  fighter_satisfaction INTEGER DEFAULT 75,
  promoter_satisfaction INTEGER DEFAULT 75,
  is_active BOOLEAN DEFAULT TRUE,
  is_exclusive BOOLEAN DEFAULT FALSE,
  termination_clause TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Training Camps Table
CREATE TABLE IF NOT EXISTS training_camps (
  id SERIAL PRIMARY KEY,
  fighter_id INTEGER REFERENCES fighters(id),
  camp_name TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  duration_weeks INTEGER DEFAULT 1,
  focus_punching_power BOOLEAN DEFAULT FALSE,
  focus_speed BOOLEAN DEFAULT FALSE,
  focus_defense BOOLEAN DEFAULT FALSE,
  focus_stamina BOOLEAN DEFAULT FALSE,
  focus_ring_iq BOOLEAN DEFAULT FALSE,
  camp_quality INTEGER DEFAULT 50,
  sparring_partners_quality INTEGER DEFAULT 50,
  nutrition_quality INTEGER DEFAULT 50,
  gym_atmosphere INTEGER DEFAULT 50,
  total_cost DECIMAL(15,2) DEFAULT 0,
  daily_cost DECIMAL(15,2) DEFAULT 0,
  head_trainer TEXT,
  nutritionist_hired BOOLEAN DEFAULT FALSE,
  strength_coach_hired BOOLEAN DEFAULT FALSE,
  cutman_hired BOOLEAN DEFAULT FALSE,
  skill_gains JSONB,
  camp_success_rating INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cut Scenes Table
CREATE TABLE IF NOT EXISTS cut_scenes (
  id SERIAL PRIMARY KEY,
  scene_type TEXT DEFAULT 'training' CHECK (scene_type IN ('training', 'press_conference', 'backstage', 'personal_issue', 'business_meeting', 'fight_preparation')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  choices JSONB,
  consequences JSONB,
  required_fighter_id INTEGER REFERENCES fighters(id),
  optional_fighter_id INTEGER REFERENCES fighters(id),
  is_triggered BOOLEAN DEFAULT FALSE,
  trigger_conditions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Game Settings Table
CREATE TABLE IF NOT EXISTS game_settings (
  id SERIAL PRIMARY KEY,
  game_speed TEXT DEFAULT 'normal' CHECK (game_speed IN ('slow', 'normal', 'fast')),
  ai_commentary_enabled BOOLEAN DEFAULT TRUE,
  dark_mode_enabled BOOLEAN DEFAULT TRUE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  sound_effects_enabled BOOLEAN DEFAULT TRUE,
  auto_save_enabled BOOLEAN DEFAULT TRUE,
  difficulty_level TEXT DEFAULT 'normal' CHECK (difficulty_level IN ('easy', 'normal', 'hard')),
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW(),
  user_id TEXT,
  session_id TEXT
);

-- Performance Metrics Table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id SERIAL PRIMARY KEY,
  fighter_id INTEGER REFERENCES fighters(id),
  metric_type TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  context JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_fighters_weight_class ON fighters(weight_class);
CREATE INDEX IF NOT EXISTS idx_fighters_career_stage ON fighters(career_stage);
CREATE INDEX IF NOT EXISTS idx_fighters_is_available ON fighters(is_available);
CREATE INDEX IF NOT EXISTS idx_fights_fight_date ON fights(fight_date);
CREATE INDEX IF NOT EXISTS idx_fights_weight_class ON fights(weight_class);
CREATE INDEX IF NOT EXISTS idx_rankings_weight_class ON rankings(weight_class);
CREATE INDEX IF NOT EXISTS idx_rankings_rank ON rankings(rank);
CREATE INDEX IF NOT EXISTS idx_titles_organization ON titles(organization);
CREATE INDEX IF NOT EXISTS idx_press_articles_category ON press_articles(category);
CREATE INDEX IF NOT EXISTS idx_press_articles_published_date ON press_articles(published_date);
CREATE INDEX IF NOT EXISTS idx_contracts_fighter_id ON contracts(fighter_id);
CREATE INDEX IF NOT EXISTS idx_contracts_is_active ON contracts(is_active);
CREATE INDEX IF NOT EXISTS idx_training_camps_fighter_id ON training_camps(fighter_id);

-- Row Level Security (RLS) Policies
ALTER TABLE fighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE fights ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE cut_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public read access" ON fighters FOR SELECT USING (true);
CREATE POLICY "Public read access" ON fights FOR SELECT USING (true);
CREATE POLICY "Public read access" ON rankings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON titles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON press_articles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON contracts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON training_camps FOR SELECT USING (true);
CREATE POLICY "Public read access" ON cut_scenes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON game_settings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON analytics_events FOR SELECT USING (true);
CREATE POLICY "Public read access" ON performance_metrics FOR SELECT USING (true);

-- RLS Policies for authenticated write access
CREATE POLICY "Authenticated insert" ON fighters FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated update" ON fighters FOR UPDATE USING (true);
CREATE POLICY "Authenticated insert" ON fights FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated update" ON fights FOR UPDATE USING (true);
CREATE POLICY "Authenticated insert" ON rankings FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated update" ON rankings FOR UPDATE USING (true);
CREATE POLICY "Authenticated insert" ON titles FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated update" ON titles FOR UPDATE USING (true);
CREATE POLICY "Authenticated insert" ON press_articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated update" ON press_articles FOR UPDATE USING (true);
CREATE POLICY "Authenticated insert" ON contracts FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated update" ON contracts FOR UPDATE USING (true);
CREATE POLICY "Authenticated insert" ON training_camps FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated update" ON training_camps FOR UPDATE USING (true);
CREATE POLICY "Authenticated insert" ON cut_scenes FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated update" ON cut_scenes FOR UPDATE USING (true);
CREATE POLICY "Authenticated insert" ON game_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated update" ON game_settings FOR UPDATE USING (true);
CREATE POLICY "Authenticated insert" ON analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated update" ON analytics_events FOR UPDATE USING (true);
CREATE POLICY "Authenticated insert" ON performance_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated update" ON performance_metrics FOR UPDATE USING (true);

-- Insert initial game state if not exists
INSERT INTO game_state (id, player_name, current_date, game_week, total_money, reputation, experience_points, level)
VALUES (1, 'Boxing Manager', CURRENT_DATE, 1, 100000, 50, 0, 1)
ON CONFLICT (id) DO NOTHING;

-- Insert default game settings if not exists
INSERT INTO game_settings (id, game_speed, ai_commentary_enabled, dark_mode_enabled, notifications_enabled, sound_effects_enabled, auto_save_enabled, difficulty_level, language)
VALUES (1, 'normal', true, true, true, true, true, 'normal', 'en')
ON CONFLICT (id) DO NOTHING;

-- Insert sample fighters if table is empty
INSERT INTO fighters (name, nickname, age, nationality, weight_class, stance, hometown, height_cm, reach_cm, punching_power, speed, defense, stamina, chin, heart, ring_iq, adaptability, mental_toughness, recovery_time, record_wins, record_losses, record_draws, knockouts, experience_level, career_stage, confidence, motivation, current_purse, contract_value)
SELECT * FROM (VALUES 
  ('James "The Hammer" Thompson', 'The Hammer', 28, 'British', 'welterweight', 'orthodox', 'London', 175, 180, 75, 70, 65, 80, 70, 85, 75, 70, 80, 75, 12, 2, 0, 8, 65, 'contender', 80, 85, 15000, 15000),
  ('Marcus "Lightning" Rodriguez', 'Lightning', 25, 'American', 'lightweight', 'southpaw', 'New York', 170, 175, 70, 85, 75, 75, 65, 80, 80, 75, 75, 70, 15, 1, 0, 10, 70, 'prospect', 85, 90, 12000, 12000),
  ('David "The Destroyer" Williams', 'The Destroyer', 30, 'British', 'middleweight', 'orthodox', 'Manchester', 180, 185, 85, 65, 80, 70, 85, 90, 70, 65, 85, 80, 18, 3, 1, 12, 75, 'contender', 75, 80, 20000, 20000)
) AS v(name, nickname, age, nationality, weight_class, stance, hometown, height_cm, reach_cm, punching_power, speed, defense, stamina, chin, heart, ring_iq, adaptability, mental_toughness, recovery_time, record_wins, record_losses, record_draws, knockouts, experience_level, career_stage, confidence, motivation, current_purse, contract_value)
WHERE NOT EXISTS (SELECT 1 FROM fighters LIMIT 1);

-- Insert sample rankings
INSERT INTO rankings (fighter_id, weight_class, rank, points, wins, losses, draws, movement)
SELECT f.id, f.weight_class, ROW_NUMBER() OVER (PARTITION BY f.weight_class ORDER BY f.experience_level DESC), 
       f.experience_level * 10, f.record_wins, f.record_losses, f.record_draws, 'same'
FROM fighters f
WHERE NOT EXISTS (SELECT 1 FROM rankings LIMIT 1);

-- Insert sample titles
INSERT INTO titles (belt_name, weight_class, organization, current_champion_id, defenses)
SELECT 
  CASE 
    WHEN f.weight_class = 'welterweight' THEN 'WBC Welterweight Championship'
    WHEN f.weight_class = 'lightweight' THEN 'WBA Lightweight Championship'
    WHEN f.weight_class = 'middleweight' THEN 'IBF Middleweight Championship'
  END,
  f.weight_class,
  CASE 
    WHEN f.weight_class = 'welterweight' THEN 'WBC'
    WHEN f.weight_class = 'lightweight' THEN 'WBA'
    WHEN f.weight_class = 'middleweight' THEN 'IBF'
  END,
  f.id,
  0
FROM fighters f
WHERE f.career_stage = 'contender' AND f.experience_level > 70
AND NOT EXISTS (SELECT 1 FROM titles LIMIT 1)
LIMIT 3;

-- Insert sample press articles
INSERT INTO press_articles (title, content, author, category, fighter_id, views, sentiment)
SELECT 
  'New Contender Emerges in ' || f.weight_class || ' Division',
  f.name || ' has been making waves in the ' || f.weight_class || ' division with an impressive record of ' || f.record_wins || '-' || f.record_losses || '-' || f.record_draws || '. Many experts believe this fighter has what it takes to become a champion.',
  'Boxing Weekly',
  'news',
  f.id,
  FLOOR(RANDOM() * 1000) + 100,
  CASE WHEN f.experience_level > 70 THEN 'positive' ELSE 'neutral' END
FROM fighters f
WHERE NOT EXISTS (SELECT 1 FROM press_articles LIMIT 1)
LIMIT 5; 