-- Boxing Management Core Schema Migration
-- Comprehensive database schema for Glory Boxing Manager

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Core Fighters Table
CREATE TABLE IF NOT EXISTS fighters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    weight_class VARCHAR(50) NOT NULL,
    record_wins INTEGER DEFAULT 0,
    record_losses INTEGER DEFAULT 0,
    record_draws INTEGER DEFAULT 0,
    nationality VARCHAR(100),
    age INTEGER,
    mugshot_url VARCHAR(500),
    stance VARCHAR(20) DEFAULT 'orthodox',
    promoter VARCHAR(255),
    amateur_record VARCHAR(50),
    pro_record VARCHAR(50),
    debut_date DATE,
    retired BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Core Matches Table
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fighter_a_id UUID REFERENCES fighters(id) ON DELETE CASCADE,
    fighter_b_id UUID REFERENCES fighters(id) ON DELETE CASCADE,
    venue VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    result VARCHAR(50),
    scorecard JSONB DEFAULT '{}',
    scheduled_rounds INTEGER DEFAULT 12,
    actual_rounds INTEGER,
    winner_id UUID REFERENCES fighters(id),
    title_fight BOOLEAN DEFAULT FALSE,
    title_id UUID,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Press Conferences Table
CREATE TABLE IF NOT EXISTS press_conferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    questions JSONB DEFAULT '[]',
    transcript TEXT,
    event_name VARCHAR(255),
    conference_date TIMESTAMP,
    participants JSONB DEFAULT '[]',
    highlights TEXT[],
    controversies TEXT[],
    ai_generated_quotes JSONB DEFAULT '[]',
    media_reactions JSONB DEFAULT '[]',
    public_sentiment_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Titles Table
CREATE TABLE IF NOT EXISTS titles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    division VARCHAR(50) NOT NULL,
    sanctioning_body VARCHAR(100) NOT NULL,
    current_holder_id UUID REFERENCES fighters(id),
    is_lineal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rankings Table
CREATE TABLE IF NOT EXISTS rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    division VARCHAR(50) NOT NULL,
    sanctioning_body VARCHAR(100) NOT NULL,
    rank INTEGER NOT NULL,
    fighter_id UUID REFERENCES fighters(id) ON DELETE CASCADE,
    points DECIMAL(10,2) DEFAULT 0,
    previous_rank INTEGER,
    movement VARCHAR(20),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venues Table
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    capacity INTEGER,
    region VARCHAR(100),
    facilities TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Promoters Table
CREATE TABLE IF NOT EXISTS promoters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    region VARCHAR(100),
    reputation INTEGER DEFAULT 50,
    financial_capacity DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Press Questions Table
CREATE TABLE IF NOT EXISTS press_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    press_conference_id UUID REFERENCES press_conferences(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    target VARCHAR(100),
    category VARCHAR(50),
    importance INTEGER DEFAULT 5,
    journalist VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_fighters_weight_class ON fighters(weight_class);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_fighters_name ON fighters(name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_fighters_nationality ON fighters(nationality);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_fighter_a ON matches(fighter_a_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_fighter_b ON matches(fighter_b_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_date ON matches(date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_press_conferences_match ON press_conferences(match_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rankings_division ON rankings(division);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rankings_fighter ON rankings(fighter_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_titles_division ON titles(division);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_titles_holder ON titles(current_holder_id);

-- Full-text search indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_fighters_name_search ON fighters USING gin(to_tsvector('english', name));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_venues_name_search ON venues USING gin(to_tsvector('english', name));

-- Row Level Security (RLS) Policies
ALTER TABLE fighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_conferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE promoters ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public read access" ON fighters FOR SELECT USING (true);
CREATE POLICY "Public read access" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read access" ON press_conferences FOR SELECT USING (true);
CREATE POLICY "Public read access" ON titles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON rankings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON venues FOR SELECT USING (true);
CREATE POLICY "Public read access" ON promoters FOR SELECT USING (true);
CREATE POLICY "Public read access" ON press_questions FOR SELECT USING (true);

-- RLS Policies for authenticated write access
CREATE POLICY "Authenticated insert" ON fighters FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON fighters FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated insert" ON matches FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON matches FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated insert" ON press_conferences FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON press_conferences FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated insert" ON press_questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated update" ON press_questions FOR UPDATE USING (auth.role() = 'authenticated');

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_fighters_updated_at BEFORE UPDATE ON fighters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_press_conferences_updated_at BEFORE UPDATE ON press_conferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate fighter record
CREATE OR REPLACE FUNCTION calculate_fighter_record(fighter_id UUID)
RETURNS TABLE(wins INTEGER, losses INTEGER, draws INTEGER, total INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN winner_id = fighter_id THEN 1 ELSE 0 END), 0) as wins,
        COALESCE(SUM(CASE WHEN winner_id IS NOT NULL AND winner_id != fighter_id THEN 1 ELSE 0 END), 0) as losses,
        COALESCE(SUM(CASE WHEN winner_id IS NULL AND result = 'draw' THEN 1 ELSE 0 END), 0) as draws,
        COUNT(*) as total
    FROM matches 
    WHERE (fighter_a_id = fighter_id OR fighter_b_id = fighter_id)
    AND status = 'completed';
END;
$$ LANGUAGE plpgsql;

-- Function to update fighter record
CREATE OR REPLACE FUNCTION update_fighter_record()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.status != NEW.status AND NEW.status = 'completed' THEN
        -- Update fighter A record
        UPDATE fighters 
        SET 
            record_wins = (SELECT wins FROM calculate_fighter_record(NEW.fighter_a_id)),
            record_losses = (SELECT losses FROM calculate_fighter_record(NEW.fighter_a_id)),
            record_draws = (SELECT draws FROM calculate_fighter_record(NEW.fighter_a_id))
        WHERE id = NEW.fighter_a_id;
        
        -- Update fighter B record
        UPDATE fighters 
        SET 
            record_wins = (SELECT wins FROM calculate_fighter_record(NEW.fighter_b_id)),
            record_losses = (SELECT losses FROM calculate_fighter_record(NEW.fighter_b_id)),
            record_draws = (SELECT draws FROM calculate_fighter_record(NEW.fighter_b_id))
        WHERE id = NEW.fighter_b_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update fighter records when match is completed
CREATE TRIGGER update_fighter_records_trigger
    AFTER UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION update_fighter_record();

-- Insert sample data for testing
INSERT INTO venues (name, city, country, capacity, region) VALUES
('Madison Square Garden', 'New York', 'USA', 20789, 'Northeast'),
('MGM Grand Garden Arena', 'Las Vegas', 'USA', 17000, 'West'),
('O2 Arena', 'London', 'UK', 20000, 'Europe'),
('Saitama Super Arena', 'Saitama', 'Japan', 37000, 'Asia');

INSERT INTO promoters (name, organization, region, reputation, financial_capacity) VALUES
('Top Rank', 'Top Rank Boxing', 'USA', 85, 10000000),
('Matchroom Boxing', 'Matchroom Sport', 'UK', 80, 8000000),
('Golden Boy Promotions', 'Golden Boy', 'USA', 75, 6000000);

INSERT INTO titles (name, division, sanctioning_body, is_lineal) VALUES
('WBC Heavyweight Championship', 'heavyweight', 'WBC', TRUE),
('WBA Heavyweight Championship', 'heavyweight', 'WBA', FALSE),
('IBF Heavyweight Championship', 'heavyweight', 'IBF', FALSE),
('WBO Heavyweight Championship', 'heavyweight', 'WBO', FALSE); 