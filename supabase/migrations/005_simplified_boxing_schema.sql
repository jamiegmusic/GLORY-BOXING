-- Simplified Boxing Management Schema
-- Based on user's provided structure with enhancements

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Fighters Table
CREATE TABLE fighters (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  weight_class TEXT NOT NULL,
  record TEXT DEFAULT '0-0-0',
  nationality TEXT,
  age INTEGER,
  mugshot_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Matches Table
CREATE TABLE matches (
  id SERIAL PRIMARY KEY,
  fighter_a_id INTEGER REFERENCES fighters(id),
  fighter_b_id INTEGER REFERENCES fighters(id),
  venue TEXT,
  date DATE,
  result TEXT,
  scorecard JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Press Conferences
CREATE TABLE press_conferences (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id),
  questions TEXT[],
  transcript TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Titles Table
CREATE TABLE titles (
  id SERIAL PRIMARY KEY,
  organization TEXT NOT NULL,
  weight_class TEXT NOT NULL,
  current_champion_id INTEGER REFERENCES fighters(id),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Rankings Table
CREATE TABLE rankings (
  id SERIAL PRIMARY KEY,
  fighter_id INTEGER REFERENCES fighters(id),
  organization TEXT,
  weight_class TEXT,
  rank INTEGER,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_fighters_weight_class ON fighters(weight_class);
CREATE INDEX idx_fighters_name ON fighters(name);
CREATE INDEX idx_matches_fighter_a ON matches(fighter_a_id);
CREATE INDEX idx_matches_fighter_b ON matches(fighter_b_id);
CREATE INDEX idx_matches_date ON matches(date);
CREATE INDEX idx_rankings_fighter ON rankings(fighter_id);
CREATE INDEX idx_rankings_organization ON rankings(organization);

-- Row Level Security (RLS) Policies
ALTER TABLE fighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_conferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public read access" ON fighters FOR SELECT USING (true);
CREATE POLICY "Public read access" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read access" ON press_conferences FOR SELECT USING (true);
CREATE POLICY "Public read access" ON titles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON rankings FOR SELECT USING (true);

-- RLS Policies for authenticated write access
CREATE POLICY "Authenticated insert" ON fighters FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON fighters FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated insert" ON matches FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON matches FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated insert" ON press_conferences FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON press_conferences FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO fighters (name, weight_class, record, nationality, age, mugshot_url) VALUES
('Mike Tyson', 'Heavyweight', '50-6-0', 'USA', 57, 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=MT'),
('Muhammad Ali', 'Heavyweight', '56-5-0', 'USA', 74, 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=MA'),
('Floyd Mayweather', 'Welterweight', '50-0-0', 'USA', 46, 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=FM'),
('Manny Pacquiao', 'Welterweight', '62-8-2', 'Philippines', 44, 'https://via.placeholder.com/150/96CEB4/FFFFFF?text=MP'),
('Canelo Alvarez', 'Super Middleweight', '59-2-2', 'Mexico', 33, 'https://via.placeholder.com/150/FFEAA7/000000?text=CA');

INSERT INTO titles (organization, weight_class, current_champion_id) VALUES
('WBC', 'Heavyweight', 1),
('WBA', 'Heavyweight', 1),
('IBF', 'Welterweight', 3),
('WBO', 'Welterweight', 4);

INSERT INTO rankings (fighter_id, organization, weight_class, rank) VALUES
(1, 'WBC', 'Heavyweight', 1),
(2, 'WBC', 'Heavyweight', 2),
(3, 'IBF', 'Welterweight', 1),
(4, 'WBO', 'Welterweight', 1),
(5, 'WBC', 'Super Middleweight', 1); 