-- Dreamworld Expansion Migration
-- This adds the dreamworld side mission feature where players manage historical entertainment figures

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Dreamworld Talents (actors, singers, boxers, moguls, etc.)
CREATE TABLE IF NOT EXISTS dreamworld_talents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  dream_era TEXT NOT NULL CHECK (dream_era IN ('1920s', '1930s', '1940s', '1950s')),
  career_path TEXT NOT NULL CHECK (career_path IN ('actor', 'singer', 'boxer', 'sports', 'management', 'mogul')),
  era_specific_skills JSONB DEFAULT '{}',
  dream_anomaly TEXT, -- "Talks like a modern person", "Knows future events", etc.
  lucid_events JSONB DEFAULT '[]', -- List of key dream events for this talent
  real_world_link UUID REFERENCES celebrities(id), -- Maps to real-world person if relevant
  notoriety INTEGER DEFAULT 0 CHECK (notoriety >= 0 AND notoriety <= 100),
  current_location TEXT DEFAULT 'New York',
  relationships JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'retired', 'deceased', 'vanished')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dream Events (for the lucid arc)
CREATE TABLE IF NOT EXISTS dream_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL,
  dream_type TEXT NOT NULL CHECK (dream_type IN ('prophecy', 'warning', 'inspiration', 'nightmare', 'vision', 'memory')),
  content TEXT NOT NULL,
  impact_score INTEGER DEFAULT 0 CHECK (impact_score >= 0 AND impact_score <= 100),
  actionable_insight TEXT,
  career_path TEXT CHECK (career_path IN ('actor', 'singer', 'boxer', 'sports', 'management', 'mogul')),
  era TEXT NOT NULL CHECK (era IN ('1920s', '1930s', '1940s', '1950s')),
  choices JSONB DEFAULT '[]', -- Array of choice options with effects
  chosen_option TEXT,
  outcome JSONB DEFAULT '{}',
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Lucid Meter and Player Dream State
CREATE TABLE IF NOT EXISTS dreamworld_player_state (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL UNIQUE,
  current_era TEXT DEFAULT '1920s' CHECK (current_era IN ('1920s', '1930s', '1940s', '1950s')),
  lucid_meter INTEGER DEFAULT 50 CHECK (lucid_meter >= 0 AND lucid_meter <= 100),
  dream_level INTEGER DEFAULT 1 CHECK (dream_level >= 1 AND dream_level <= 10),
  wellness_meter INTEGER DEFAULT 50 CHECK (wellness_meter >= 0 AND wellness_meter <= 100),
  reality_glitches JSONB DEFAULT '[]', -- Array of glitch events
  current_location TEXT DEFAULT 'Harlem',
  return_conditions JSONB DEFAULT '{}', -- Conditions to wake up
  dream_talents JSONB DEFAULT '[]', -- Array of talent IDs being managed
  dream_currency INTEGER DEFAULT 1000, -- Era-specific currency
  reputation_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legacy Unlocks (items/bonuses that carry over to main game)
CREATE TABLE IF NOT EXISTS legacy_unlocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL,
  dream_item TEXT NOT NULL,
  unlock_type TEXT CHECK (unlock_type IN ('skill', 'item', 'connection', 'knowledge', 'bonus')),
  description TEXT,
  effect_data JSONB DEFAULT '{}', -- Data about how it affects main game
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  unlock_date TIMESTAMPTZ DEFAULT NOW(),
  claimed BOOLEAN DEFAULT FALSE,
  claimed_date TIMESTAMPTZ
);

-- Dream World Venues (era-specific locations)
CREATE TABLE IF NOT EXISTS dreamworld_venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  era TEXT NOT NULL CHECK (era IN ('1920s', '1930s', '1940s', '1950s')),
  venue_type TEXT CHECK (venue_type IN ('club', 'theater', 'arena', 'studio', 'office')),
  location TEXT NOT NULL,
  capacity INTEGER DEFAULT 100,
  prestige_level INTEGER DEFAULT 1 CHECK (prestige_level >= 1 AND prestige_level <= 5),
  special_features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dream Contracts (era-specific entertainment contracts)
CREATE TABLE IF NOT EXISTS dreamworld_contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_id UUID REFERENCES dreamworld_talents(id) ON DELETE CASCADE,
  player_id UUID NOT NULL,
  contract_type TEXT CHECK (contract_type IN ('performance', 'recording', 'fight', 'management', 'exclusive')),
  terms JSONB DEFAULT '{}',
  era_value INTEGER DEFAULT 0, -- Value in era currency
  duration_weeks INTEGER DEFAULT 4,
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'completed', 'broken')),
  signed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_dreamworld_talents_era ON dreamworld_talents(dream_era);
CREATE INDEX idx_dreamworld_talents_career ON dreamworld_talents(career_path);
CREATE INDEX idx_dream_events_player ON dream_events(player_id);
CREATE INDEX idx_dream_events_type ON dream_events(dream_type);
CREATE INDEX idx_dreamworld_player_state_player ON dreamworld_player_state(player_id);
CREATE INDEX idx_legacy_unlocks_player ON legacy_unlocks(player_id);
CREATE INDEX idx_dreamworld_venues_era ON dreamworld_venues(era);
CREATE INDEX idx_dreamworld_contracts_player ON dreamworld_contracts(player_id);

-- Create update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dreamworld_talents_updated_at BEFORE UPDATE ON dreamworld_talents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dreamworld_player_state_updated_at BEFORE UPDATE ON dreamworld_player_state
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample dreamworld venues
INSERT INTO dreamworld_venues (name, era, venue_type, location, capacity, prestige_level, special_features) VALUES
-- 1920s venues
('The Cotton Club', '1920s', 'club', 'Harlem, New York', 500, 5, '["Jazz performances", "Celebrity hotspot", "Mob connections"]'),
('The Savoy Ballroom', '1920s', 'club', 'Harlem, New York', 4000, 4, '["Dance competitions", "Integrated venue", "Live orchestras"]'),
('Madison Square Garden', '1920s', 'arena', 'New York', 18000, 5, '["Boxing matches", "Major events", "Press coverage"]'),
('Paramount Theatre', '1920s', 'theater', 'Times Square, New York', 3664, 5, '["Vaudeville shows", "Film premieres", "Stage performances"]'),

-- 1930s venues
('Rainbow Room', '1930s', 'club', 'Rockefeller Center, New York', 250, 5, '["High society", "Art deco design", "Exclusive events"]'),
('Apollo Theater', '1930s', 'theater', 'Harlem, New York', 1506, 5, '["Amateur Night", "Star maker", "Cultural landmark"]'),

-- 1940s venues
('Copacabana', '1940s', 'club', 'Manhattan, New York', 750, 5, '["Latin music", "Celebrity performances", "Mob presence"]'),
('Hollywood Palladium', '1940s', 'theater', 'Los Angeles', 4000, 4, '["Big band era", "Dance venue", "Radio broadcasts"]'),

-- 1950s venues
('Birdland', '1950s', 'club', 'Broadway, New York', 500, 4, '["Jazz legends", "Cool jazz era", "Late night sessions"]'),
('Ed Sullivan Theater', '1950s', 'theater', 'Broadway, New York', 1000, 5, '["TV broadcasts", "Variety shows", "Career launcher"]');

-- Insert sample 1920s dreamworld talents
INSERT INTO dreamworld_talents (name, dream_era, career_path, era_specific_skills, dream_anomaly, notoriety, current_location) VALUES
('Louis Armstrong', '1920s', 'singer', '{"trumpet": 95, "vocals": 88, "charisma": 92, "jazz_innovation": 97}', 'Sometimes plays music from the future', 75, 'New Orleans'),
('Bessie Smith', '1920s', 'singer', '{"blues_vocals": 98, "stage_presence": 90, "songwriting": 85}', 'Empress of the Blues knows modern feminist anthems', 80, 'Chicago'),
('Jack Dempsey', '1920s', 'boxer', '{"power": 94, "speed": 85, "defense": 82, "intimidation": 90}', 'Uses modern training techniques in dreams', 95, 'New York'),
('Buster Keaton', '1920s', 'actor', '{"physical_comedy": 98, "directing": 90, "stunts": 95}', 'Dreams of CGI and special effects', 85, 'Hollywood'),
('Al Capone', '1920s', 'mogul', '{"business": 88, "intimidation": 95, "networking": 92}', 'Mentions cryptocurrency in his sleep', 90, 'Chicago');

-- Grant permissions
GRANT ALL ON dreamworld_talents TO authenticated;
GRANT ALL ON dream_events TO authenticated;
GRANT ALL ON dreamworld_player_state TO authenticated;
GRANT ALL ON legacy_unlocks TO authenticated;
GRANT ALL ON dreamworld_venues TO authenticated;
GRANT ALL ON dreamworld_contracts TO authenticated;