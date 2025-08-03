-- Dreamworld Core Tables Migration
-- Integrates with existing Glory Boxing Manager system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Dreamworld Talents Table
-- Stores historical entertainment figures that exist in the dreamworld
CREATE TABLE IF NOT EXISTS dreamworld_talents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  dream_era TEXT NOT NULL CHECK (dream_era IN ('1920s', '1930s', '1940s', '1950s')),
  career_path TEXT NOT NULL CHECK (career_path IN ('actor', 'singer', 'boxer', 'sports', 'management', 'mogul')),
  era_specific_skills JSONB DEFAULT '{}', -- e.g. {"jazz_vocals": 95, "stage_presence": 88}
  dream_anomaly TEXT, -- e.g. "Knows songs from the future"
  lucid_events JSONB DEFAULT '[]', -- Array of significant dream events
  real_world_link UUID, -- Links to main game's celebrities table if applicable
  notoriety INTEGER DEFAULT 0 CHECK (notoriety >= 0 AND notoriety <= 100),
  current_location TEXT DEFAULT 'New York',
  relationships JSONB DEFAULT '{}', -- e.g. {"louis_armstrong": "mentor", "al_capone": "rival"}
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'retired', 'deceased', 'vanished')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Dream Events Table
-- Tracks story events and prophecies in the dreamworld
CREATE TABLE IF NOT EXISTS dream_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL,
  dream_type TEXT NOT NULL CHECK (dream_type IN ('prophecy', 'warning', 'inspiration', 'nightmare', 'vision')),
  content TEXT NOT NULL, -- The narrative content of the dream event
  impact_score INTEGER DEFAULT 0 CHECK (impact_score >= 0 AND impact_score <= 100),
  actionable_insight TEXT, -- What the player should do based on this dream
  career_path TEXT CHECK (career_path IN ('actor', 'singer', 'boxer', 'sports', 'management', 'mogul')),
  triggered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dreamworld Player State Table
-- Tracks the player's current state within the dreamworld
CREATE TABLE IF NOT EXISTS dreamworld_player_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL UNIQUE,
  current_era TEXT DEFAULT '1920s' CHECK (current_era IN ('1920s', '1930s', '1940s', '1950s')),
  lucid_meter INTEGER DEFAULT 50 CHECK (lucid_meter >= 0 AND lucid_meter <= 100),
  dream_level INTEGER DEFAULT 1 CHECK (dream_level >= 1 AND dream_level <= 10),
  wellness_meter INTEGER DEFAULT 50 CHECK (wellness_meter >= 0 AND wellness_meter <= 100),
  reality_glitches JSONB DEFAULT '[]', -- Array of glitch events e.g. [{"type": "temporal", "severity": 30}]
  current_location TEXT DEFAULT 'Harlem',
  return_conditions JSONB DEFAULT '{}', -- e.g. {"lucid_meter_zero": true, "max_dream_level": 10}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_dreamworld_talents_era ON dreamworld_talents(dream_era);
CREATE INDEX idx_dreamworld_talents_career ON dreamworld_talents(career_path);
CREATE INDEX idx_dreamworld_talents_real_link ON dreamworld_talents(real_world_link);
CREATE INDEX idx_dream_events_player ON dream_events(player_id);
CREATE INDEX idx_dream_events_type ON dream_events(dream_type);
CREATE INDEX idx_dreamworld_player_state_player ON dreamworld_player_state(player_id);

-- Grant permissions for authenticated users
GRANT ALL ON dreamworld_talents TO authenticated;
GRANT ALL ON dream_events TO authenticated;
GRANT ALL ON dreamworld_player_state TO authenticated;

-- Sample data insertion for testing
INSERT INTO dreamworld_talents (name, dream_era, career_path, era_specific_skills, dream_anomaly, notoriety) VALUES
('Louis Armstrong', '1920s', 'singer', '{"trumpet": 95, "vocals": 88, "charisma": 92}', 'Sometimes plays music from the future', 75),
('Bessie Smith', '1920s', 'singer', '{"blues_vocals": 98, "stage_presence": 90}', 'Empress of the Blues knows modern anthems', 80),
('Jack Dempsey', '1920s', 'boxer', '{"power": 94, "speed": 85, "defense": 82}', 'Uses modern training techniques', 95);

-- Comments for integration documentation
COMMENT ON TABLE dreamworld_talents IS 'Historical entertainment figures in the dreamworld. Links to main game via real_world_link.';
COMMENT ON TABLE dream_events IS 'Story events triggered in dreamworld. Integrates with main event pipeline.';
COMMENT ON TABLE dreamworld_player_state IS 'Player progress in dreamworld. Parallel to main game state.';
COMMENT ON COLUMN dreamworld_talents.real_world_link IS 'Foreign key to celebrities table in main game for crossover characters.';
COMMENT ON COLUMN dream_events.career_path IS 'Links to existing career system for skill/event relevance.';
COMMENT ON COLUMN dreamworld_player_state.return_conditions IS 'Conditions that trigger return to main game with bonuses.';