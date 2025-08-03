-- Dreamworld Core Tables Migration
-- Three essential tables for the dreamworld expansion system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. dreamworld_talents table
-- Stores historical entertainment figures that exist in the dreamworld
CREATE TABLE IF NOT EXISTS dreamworld_talents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  dream_era TEXT NOT NULL,
  career_path TEXT NOT NULL,
  era_specific_skills JSONB DEFAULT '{}',
  dream_anomaly TEXT,
  lucid_events JSONB DEFAULT '[]',
  real_world_link UUID,
  notoriety INTEGER DEFAULT 0,
  current_location TEXT,
  relationships JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. dream_events table
-- Tracks dream events and their impact on the player's journey
CREATE TABLE IF NOT EXISTS dream_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL,
  dream_type TEXT NOT NULL CHECK (dream_type IN ('prophecy', 'warning', 'inspiration', 'nightmare', 'vision')),
  content TEXT NOT NULL,
  impact_score INTEGER DEFAULT 0,
  actionable_insight TEXT,
  career_path TEXT,
  triggered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. dreamworld_player_state table
-- Maintains the player's current state within the dreamworld
CREATE TABLE IF NOT EXISTS dreamworld_player_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL,
  current_era TEXT NOT NULL,
  lucid_meter INTEGER DEFAULT 50,
  dream_level INTEGER DEFAULT 1,
  wellness_meter INTEGER DEFAULT 50,
  reality_glitches JSONB DEFAULT '[]',
  current_location TEXT,
  return_conditions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_dreamworld_talents_era ON dreamworld_talents(dream_era);
CREATE INDEX IF NOT EXISTS idx_dreamworld_talents_career ON dreamworld_talents(career_path);
CREATE INDEX IF NOT EXISTS idx_dreamworld_talents_real_link ON dreamworld_talents(real_world_link);
CREATE INDEX IF NOT EXISTS idx_dream_events_player ON dream_events(player_id);
CREATE INDEX IF NOT EXISTS idx_dream_events_type ON dream_events(dream_type);
CREATE INDEX IF NOT EXISTS idx_dreamworld_player_state_player ON dreamworld_player_state(player_id);

-- Add constraints
ALTER TABLE dreamworld_talents ADD CONSTRAINT check_notoriety CHECK (notoriety >= 0 AND notoriety <= 100);
ALTER TABLE dream_events ADD CONSTRAINT check_impact_score CHECK (impact_score >= 0 AND impact_score <= 100);
ALTER TABLE dreamworld_player_state ADD CONSTRAINT check_lucid_meter CHECK (lucid_meter >= 0 AND lucid_meter <= 100);
ALTER TABLE dreamworld_player_state ADD CONSTRAINT check_dream_level CHECK (dream_level >= 1 AND dream_level <= 10);
ALTER TABLE dreamworld_player_state ADD CONSTRAINT check_wellness_meter CHECK (wellness_meter >= 0 AND wellness_meter <= 100);
ALTER TABLE dreamworld_player_state ADD CONSTRAINT unique_player_state UNIQUE (player_id);

-- Grant permissions for authenticated users
GRANT ALL ON dreamworld_talents TO authenticated;
GRANT ALL ON dream_events TO authenticated;
GRANT ALL ON dreamworld_player_state TO authenticated;

-- Add table comments for documentation
COMMENT ON TABLE dreamworld_talents IS 'Historical entertainment figures in the dreamworld with era-specific attributes';
COMMENT ON TABLE dream_events IS 'Dream events that occur during the player''s dreamworld journey';
COMMENT ON TABLE dreamworld_player_state IS 'Current state and progress of a player within the dreamworld';

-- Add column comments for key fields
COMMENT ON COLUMN dreamworld_talents.era_specific_skills IS 'JSONB object containing skill names and values, e.g. {"jazz_vocals": 95, "stage_presence": 88}';
COMMENT ON COLUMN dreamworld_talents.lucid_events IS 'Array of significant events involving this talent';
COMMENT ON COLUMN dreamworld_talents.real_world_link IS 'UUID reference to corresponding entity in main game if applicable';
COMMENT ON COLUMN dreamworld_talents.relationships IS 'JSONB object mapping talent IDs to relationship types, e.g. {"uuid": "rival"}';

COMMENT ON COLUMN dream_events.dream_type IS 'Type of dream event: prophecy, warning, inspiration, nightmare, or vision';
COMMENT ON COLUMN dream_events.impact_score IS 'Numerical impact of the event on game progression (0-100)';
COMMENT ON COLUMN dream_events.actionable_insight IS 'Guidance for the player based on the dream event';

COMMENT ON COLUMN dreamworld_player_state.reality_glitches IS 'Array of glitch objects with type, severity, and timestamp';
COMMENT ON COLUMN dreamworld_player_state.return_conditions IS 'JSONB object defining conditions for returning to reality';