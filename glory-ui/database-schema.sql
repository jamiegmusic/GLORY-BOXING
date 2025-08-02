-- Glory Boxing Manager - Complete Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fighters table (enhanced)
CREATE TABLE IF NOT EXISTS fighters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  age INTEGER,
  nationality TEXT,
  division TEXT NOT NULL,
  weight_class TEXT,
  stance TEXT CHECK (stance IN ('orthodox', 'southpaw', 'switch')),
  promoter TEXT,
  amateur_record TEXT,
  pro_record TEXT,
  debut_date TIMESTAMPTZ,
  retired BOOLEAN DEFAULT FALSE,
  
  -- Fight record
  record_wins INTEGER DEFAULT 0,
  record_losses INTEGER DEFAULT 0,
  record_draws INTEGER DEFAULT 0,
  knockouts INTEGER DEFAULT 0,
  
  -- Physical stats (0-100)
  power INTEGER CHECK (power >= 0 AND power <= 100),
  speed INTEGER CHECK (speed >= 0 AND speed <= 100),
  stamina INTEGER CHECK (stamina >= 0 AND stamina <= 100),
  defense INTEGER CHECK (defense >= 0 AND defense <= 100),
  chin INTEGER CHECK (chin >= 0 AND chin <= 100),
  heart INTEGER CHECK (heart >= 0 AND heart <= 100),
  ring_iq INTEGER CHECK (ring_iq >= 0 AND ring_iq <= 100),
  
  -- Career stats
  popularity INTEGER DEFAULT 0,
  experience INTEGER DEFAULT 0,
  ranking INTEGER,
  real_world_ranking INTEGER,
  real_world_record TEXT,
  
  -- Health
  is_injured BOOLEAN DEFAULT FALSE,
  last_fight TIMESTAMPTZ,
  
  -- Additional info
  nickname TEXT,
  height_cm INTEGER,
  reach_cm INTEGER,
  hometown TEXT,
  region TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches/Fights table
CREATE TABLE IF NOT EXISTS fights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fighter_a UUID REFERENCES fighters(id) NOT NULL,
  fighter_b UUID REFERENCES fighters(id) NOT NULL,
  venue TEXT NOT NULL,
  scheduled_rounds INTEGER DEFAULT 12,
  actual_rounds INTEGER,
  result JSONB,
  scorecard JSONB,
  winner UUID REFERENCES fighters(id),
  title_fight BOOLEAN DEFAULT FALSE,
  title_id UUID,
  date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')) DEFAULT 'scheduled',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Titles table
CREATE TABLE IF NOT EXISTS titles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  belt_name TEXT,
  division TEXT NOT NULL,
  sanctioning_body TEXT NOT NULL,
  current_holder UUID REFERENCES fighters(id),
  is_lineal BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rankings table
CREATE TABLE IF NOT EXISTS rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  division TEXT NOT NULL,
  sanctioning_body TEXT NOT NULL,
  rank INTEGER NOT NULL,
  fighter_id UUID REFERENCES fighters(id) NOT NULL,
  points INTEGER DEFAULT 0,
  previous_rank INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(division, sanctioning_body, rank)
);

-- International Rankings table
CREATE TABLE IF NOT EXISTS international_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fighter_id UUID REFERENCES fighters(id) NOT NULL,
  organization TEXT NOT NULL,
  weight_class TEXT NOT NULL,
  rank INTEGER NOT NULL,
  points INTEGER DEFAULT 0,
  previous_rank INTEGER,
  movement TEXT CHECK (movement IN ('up', 'down', 'unchanged')) DEFAULT 'unchanged',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  
  UNIQUE(fighter_id, organization, weight_class)
);

-- Press Conferences table
CREATE TABLE IF NOT EXISTS press_conferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES fights(id),
  conference_date TIMESTAMPTZ DEFAULT NOW(),
  reporter_questions JSONB,
  fighter_responses JSONB,
  ai_generated BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health Monitoring table
CREATE TABLE IF NOT EXISTS health_monitoring (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fighter_id UUID REFERENCES fighters(id) NOT NULL,
  assessment_date TIMESTAMPTZ DEFAULT NOW(),
  overall_health INTEGER CHECK (overall_health >= 0 AND overall_health <= 100),
  injury_risk INTEGER CHECK (injury_risk >= 0 AND injury_risk <= 100),
  recovery_status TEXT,
  medical_clearance BOOLEAN DEFAULT TRUE,
  restrictions JSONB,
  recommendations JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Injuries table
CREATE TABLE IF NOT EXISTS injuries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fighter_id UUID REFERENCES fighters(id) NOT NULL,
  type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe')) NOT NULL,
  date_occurred TIMESTAMPTZ NOT NULL,
  recovery_date TIMESTAMPTZ,
  description TEXT,
  medical_notes TEXT,
  treatment_plan JSONB,
  impact_on_performance INTEGER CHECK (impact_on_performance >= 0 AND impact_on_performance <= 100),
  active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training Camps table
CREATE TABLE IF NOT EXISTS training_camps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fighter_id UUID REFERENCES fighters(id) NOT NULL,
  camp_name TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  focus_areas JSONB,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  results JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fighter_id UUID REFERENCES fighters(id) NOT NULL,
  promoter_id UUID,
  type TEXT CHECK (type IN ('exclusive', 'non-exclusive', 'development')) NOT NULL,
  base_salary DECIMAL(12,2),
  duration_months INTEGER,
  fights_per_year INTEGER,
  performance_bonuses JSONB,
  sponsorship_split DECIMAL(5,2),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT CHECK (status IN ('active', 'expired', 'terminated')) DEFAULT 'active',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promoters table
CREATE TABLE IF NOT EXISTS promoters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  organization TEXT,
  region TEXT,
  reputation INTEGER CHECK (reputation >= 0 AND reputation <= 100),
  financial_capacity DECIMAL(15,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  capacity INTEGER,
  region TEXT,
  facilities JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  event_data JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID,
  session_id TEXT
);

-- Game State table
CREATE TABLE IF NOT EXISTS game_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  current_period INTEGER DEFAULT 1,
  total_revenue DECIMAL(15,2) DEFAULT 0,
  total_expenses DECIMAL(15,2) DEFAULT 0,
  previous_period_revenue DECIMAL(15,2) DEFAULT 0,
  sponsorship_revenue DECIMAL(15,2) DEFAULT 0,
  ticket_revenue DECIMAL(15,2) DEFAULT 0,
  ppv_revenue DECIMAL(15,2) DEFAULT 0,
  merchandise_revenue DECIMAL(15,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Coverage table
CREATE TABLE IF NOT EXISTS media_coverage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fighter_id UUID REFERENCES fighters(id),
  media_type TEXT,
  title TEXT,
  content TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  reach INTEGER,
  date TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsorships table
CREATE TABLE IF NOT EXISTS sponsorships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fighter_id UUID REFERENCES fighters(id) NOT NULL,
  sponsor_name TEXT NOT NULL,
  deal_value DECIMAL(12,2),
  duration_months INTEGER,
  requirements JSONB,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT CHECK (status IN ('active', 'expired', 'terminated')) DEFAULT 'active',
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fighters_division ON fighters(division);
CREATE INDEX IF NOT EXISTS idx_fighters_weight_class ON fighters(weight_class);
CREATE INDEX IF NOT EXISTS idx_fights_date ON fights(date);
CREATE INDEX IF NOT EXISTS idx_fights_fighter_a ON fights(fighter_a);
CREATE INDEX IF NOT EXISTS idx_fights_fighter_b ON fights(fighter_b);
CREATE INDEX IF NOT EXISTS idx_rankings_division ON rankings(division);
CREATE INDEX IF NOT EXISTS idx_rankings_rank ON rankings(rank);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to tables with updated_at columns
CREATE TRIGGER update_fighters_updated_at BEFORE UPDATE ON fighters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fights_updated_at BEFORE UPDATE ON fights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_titles_updated_at BEFORE UPDATE ON titles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rankings_updated_at BEFORE UPDATE ON rankings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_press_conferences_updated_at BEFORE UPDATE ON press_conferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_injuries_updated_at BEFORE UPDATE ON injuries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_state_updated_at BEFORE UPDATE ON game_state FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional but recommended)
ALTER TABLE fighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE fights ENABLE ROW LEVEL SECURITY;
ALTER TABLE titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_conferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE injuries ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allow all for now - customize based on your auth needs)
CREATE POLICY "Public Access" ON fighters FOR ALL USING (true);
CREATE POLICY "Public Access" ON fights FOR ALL USING (true);
CREATE POLICY "Public Access" ON titles FOR ALL USING (true);
CREATE POLICY "Public Access" ON rankings FOR ALL USING (true);
CREATE POLICY "Public Access" ON press_conferences FOR ALL USING (true);
CREATE POLICY "Public Access" ON health_monitoring FOR ALL USING (true);
CREATE POLICY "Public Access" ON injuries FOR ALL USING (true);
CREATE POLICY "Public Access" ON training_camps FOR ALL USING (true);
CREATE POLICY "Public Access" ON contracts FOR ALL USING (true);
CREATE POLICY "Public Access" ON analytics_events FOR ALL USING (true);

-- Sample data insertion
INSERT INTO fighters (name, division, stance, power, speed, stamina, defense, chin, heart, ring_iq, popularity, weight_class) VALUES
('Mike Tyson', 'Heavyweight', 'orthodox', 95, 88, 85, 75, 85, 90, 80, 95, 'heavyweight'),
('Muhammad Ali', 'Heavyweight', 'orthodox', 85, 92, 90, 88, 90, 95, 95, 98, 'heavyweight'),
('Sugar Ray Robinson', 'Middleweight', 'orthodox', 90, 95, 88, 92, 85, 90, 92, 85, 'middleweight'),
('Floyd Mayweather Jr.', 'Welterweight', 'orthodox', 75, 88, 85, 98, 88, 85, 98, 90, 'welterweight');

-- Sample titles
INSERT INTO titles (name, belt_name, division, sanctioning_body) VALUES
('WBC Heavyweight Championship', 'WBC Heavyweight Title', 'Heavyweight', 'WBC'),
('WBA Heavyweight Championship', 'WBA Heavyweight Title', 'Heavyweight', 'WBA'),
('IBF Heavyweight Championship', 'IBF Heavyweight Title', 'Heavyweight', 'IBF'),
('WBO Heavyweight Championship', 'WBO Heavyweight Title', 'Heavyweight', 'WBO');

-- Sample rankings
INSERT INTO rankings (division, sanctioning_body, rank, fighter_id) 
SELECT 'Heavyweight', 'WBC', 1, id FROM fighters WHERE name = 'Mike Tyson';

-- Sample game state
INSERT INTO game_state (total_revenue, total_expenses, sponsorship_revenue, ticket_revenue, ppv_revenue, merchandise_revenue) VALUES
(1000000, 600000, 200000, 300000, 400000, 100000);
