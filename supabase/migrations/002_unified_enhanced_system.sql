-- Unified Enhanced Glory Boxing System
-- Comprehensive migration consolidating all features from unified framework

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enhanced Fighters Table with AI Content and Real-World Integration
ALTER TABLE fighters ADD COLUMN IF NOT EXISTS ai_portrait_url VARCHAR(500);
ALTER TABLE fighters ADD COLUMN IF NOT EXISTS ai_voice_profile JSONB DEFAULT '{}';
ALTER TABLE fighters ADD COLUMN IF NOT EXISTS ai_lore_background TEXT;
ALTER TABLE fighters ADD COLUMN IF NOT EXISTS ai_personality_traits JSONB DEFAULT '{}';
ALTER TABLE fighters ADD COLUMN IF NOT EXISTS real_world_ranking INTEGER;
ALTER TABLE fighters ADD COLUMN IF NOT EXISTS real_world_record VARCHAR(50);
ALTER TABLE fighters ADD COLUMN IF NOT EXISTS licensing_status VARCHAR(50);
ALTER TABLE fighters ADD COLUMN IF NOT EXISTS official_fighter_id VARCHAR(100);
ALTER TABLE fighters ADD COLUMN IF NOT EXISTS health_risk_assessment INTEGER DEFAULT 0;
ALTER TABLE fighters ADD COLUMN IF NOT EXISTS concussion_protocol_active BOOLEAN DEFAULT FALSE;
ALTER TABLE fighters ADD COLUMN IF NOT EXISTS cumulative_damage JSONB DEFAULT '{}';

-- Enhanced Matches Table with Advanced Fight Data
ALTER TABLE fights ADD COLUMN IF NOT EXISTS round_by_round_data JSONB DEFAULT '{}';
ALTER TABLE fights ADD COLUMN IF NOT EXISTS punch_statistics JSONB DEFAULT '{}';
ALTER TABLE fights ADD COLUMN IF NOT EXISTS knockdowns JSONB DEFAULT '[]';
ALTER TABLE fights ADD COLUMN IF NOT EXISTS referee_decisions JSONB DEFAULT '{}';
ALTER TABLE fights ADD COLUMN IF NOT EXISTS ai_commentary JSONB DEFAULT '[]';
ALTER TABLE fights ADD COLUMN IF NOT EXISTS fight_rating INTEGER;
ALTER TABLE fights ADD COLUMN IF NOT EXISTS crowd_reaction INTEGER;
ALTER TABLE fights ADD COLUMN IF NOT EXISTS media_coverage_rating INTEGER;

-- Enhanced Rankings Table with Real-World Integration
ALTER TABLE rankings ADD COLUMN IF NOT EXISTS real_world_ranking INTEGER;
ALTER TABLE rankings ADD COLUMN IF NOT EXISTS real_world_points DECIMAL(10,2);
ALTER TABLE rankings ADD COLUMN IF NOT EXISTS organization VARCHAR(10);
ALTER TABLE rankings ADD COLUMN IF NOT EXISTS movement VARCHAR(20);
ALTER TABLE rankings ADD COLUMN IF NOT EXISTS win_streak INTEGER DEFAULT 0;
ALTER TABLE rankings ADD COLUMN IF NOT EXISTS quality_wins INTEGER DEFAULT 0;
ALTER TABLE rankings ADD COLUMN IF NOT EXISTS last_fight_date TIMESTAMP;
ALTER TABLE rankings ADD COLUMN IF NOT EXISTS activity_score DECIMAL(5,2) DEFAULT 0;

-- Enhanced Titles Table with History
ALTER TABLE titles ADD COLUMN IF NOT EXISTS title_history JSONB DEFAULT '[]';
ALTER TABLE titles ADD COLUMN IF NOT EXISTS mandatory_challenger_id UUID REFERENCES fighters(id);
ALTER TABLE titles ADD COLUMN IF NOT EXISTS mandatory_challenger_name VARCHAR(255);
ALTER TABLE titles ADD COLUMN IF NOT EXISTS mandatory_due_date TIMESTAMP;

-- Press Conference System
CREATE TABLE IF NOT EXISTS press_conferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES fights(id) ON DELETE CASCADE,
    event_name VARCHAR(255) NOT NULL,
    conference_date TIMESTAMP NOT NULL,
    participants JSONB DEFAULT '[]',
    highlights TEXT[],
    controversies TEXT[],
    ai_generated_quotes JSONB DEFAULT '[]',
    media_reactions JSONB DEFAULT '[]',
    public_sentiment_score DECIMAL(3,2),
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

-- AI Content Generation Tracking
CREATE TABLE IF NOT EXISTS ai_generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fighter_id UUID REFERENCES fighters(id),
    content_type VARCHAR(50) NOT NULL,
    content_data JSONB NOT NULL,
    generation_prompt TEXT,
    ai_model_used VARCHAR(100),
    generation_cost DECIMAL(8,4),
    quality_score INTEGER,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real-Time Event System
CREATE TABLE IF NOT EXISTS real_time_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    affected_entities JSONB,
    priority INTEGER DEFAULT 5,
    is_processed BOOLEAN DEFAULT FALSE,
    processing_result JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Venues System
CREATE TABLE IF NOT EXISTS venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    capacity INTEGER,
    venue_tier VARCHAR(50) CHECK (venue_tier IN ('small_club', 'medium_arena', 'large_stadium', 'premium_venue')),
    base_rental_cost DECIMAL(10,2),
    revenue_split DECIMAL(5,2),
    amenities TEXT[],
    coordinates JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Promoters System
CREATE TABLE IF NOT EXISTS promoters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    organization VARCHAR(100),
    reputation INTEGER DEFAULT 50,
    financial_strength INTEGER DEFAULT 50,
    network_connections INTEGER DEFAULT 50,
    negotiation_style VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Scouts System
CREATE TABLE IF NOT EXISTS scouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    expertise_regions TEXT[],
    success_rate DECIMAL(5,2),
    network_quality INTEGER DEFAULT 50,
    evaluation_accuracy INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scouting Reports
CREATE TABLE IF NOT EXISTS scouting_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scout_id UUID REFERENCES scouts(id),
    fighter_id UUID REFERENCES fighters(id),
    potential_rating INTEGER CHECK (potential_rating BETWEEN 1 AND 100),
    risk_assessment INTEGER CHECK (risk_assessment BETWEEN 1 AND 100),
    market_value_estimate DECIMAL(12,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Contracts with AI Negotiation
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS ai_negotiation_data JSONB DEFAULT '{}';
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS negotiation_rounds INTEGER DEFAULT 0;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS final_agreement_terms JSONB DEFAULT '{}';

-- Rivalry Heat System
CREATE TABLE IF NOT EXISTS rivalries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fighter1_id UUID REFERENCES fighters(id),
    fighter2_id UUID REFERENCES fighters(id),
    rivalry_type VARCHAR(50) CHECK (rivalry_type IN ('personal', 'professional', 'territorial', 'championship')),
    intensity INTEGER DEFAULT 50 CHECK (intensity BETWEEN 1 AND 100),
    start_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    public_interest INTEGER DEFAULT 50,
    media_coverage_level INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Media Coverage with AI
ALTER TABLE media_coverage ADD COLUMN IF NOT EXISTS ai_generated_content JSONB DEFAULT '{}';
ALTER TABLE media_coverage ADD COLUMN IF NOT EXISTS sentiment_analysis JSONB DEFAULT '{}';
ALTER TABLE media_coverage ADD COLUMN IF NOT EXISTS viral_potential INTEGER DEFAULT 0;

-- Enhanced Sponsorships with AI
ALTER TABLE sponsorships ADD COLUMN IF NOT EXISTS ai_generated_opportunities JSONB DEFAULT '[]';
ALTER TABLE sponsorships ADD COLUMN IF NOT EXISTS market_fit_score INTEGER DEFAULT 0;

-- Health Monitoring System
CREATE TABLE IF NOT EXISTS health_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fighter_id UUID REFERENCES fighters(id),
    assessment_date DATE DEFAULT CURRENT_DATE,
    overall_health_score INTEGER CHECK (overall_health_score BETWEEN 1 AND 100),
    concussion_risk INTEGER DEFAULT 0,
    cumulative_damage_assessment JSONB DEFAULT '{}',
    recommended_recovery_time INTEGER,
    medical_clearance_status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- International Systems
CREATE TABLE IF NOT EXISTS international_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fighter_id UUID REFERENCES fighters(id),
    country VARCHAR(100),
    regional_ranking INTEGER,
    international_points DECIMAL(10,2),
    regional_organization VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Licensing and Official Records
CREATE TABLE IF NOT EXISTS official_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fighter_id UUID REFERENCES fighters(id),
    organization VARCHAR(100),
    official_record VARCHAR(50),
    verification_status VARCHAR(50),
    last_verified_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Analytics System
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    user_id UUID,
    fighter_id UUID REFERENCES fighters(id),
    event_data JSONB NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4),
    metric_unit VARCHAR(50),
    fighter_id UUID REFERENCES fighters(id),
    match_id UUID REFERENCES fights(id),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_fighters_ai_content ON fighters USING GIN (ai_personality_traits);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_fighters_real_world ON fighters(real_world_ranking, licensing_status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_matches_round_data ON matches USING GIN (round_by_round_data);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rankings_real_world ON rankings(real_world_ranking, organization);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_press_conferences_match ON press_conferences(match_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_content_fighter ON ai_generated_content(fighter_id, content_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_real_time_events_type ON real_time_events(event_type, priority);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rivalries_fighters ON rivalries(fighter1_id, fighter2_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_health_monitoring_fighter ON health_monitoring(fighter_id, assessment_date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type, timestamp);

-- Create full-text search indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_fighters_name_search ON fighters USING gin(to_tsvector('english', name));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_venues_name_search ON venues USING gin(to_tsvector('english', name));

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_fighter_ai_content()
RETURNS TRIGGER AS $$
BEGIN
    -- Update AI content when fighter data changes
    IF NEW.ai_personality_traits IS DISTINCT FROM OLD.ai_personality_traits THEN
        INSERT INTO ai_generated_content (fighter_id, content_type, content_data, ai_model_used)
        VALUES (NEW.id, 'personality_update', NEW.ai_personality_traits, 'claude-3-sonnet');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fighter_ai_content_trigger
    AFTER UPDATE ON fighters
    FOR EACH ROW
    EXECUTE FUNCTION update_fighter_ai_content();

-- Function to calculate rivalry heat
CREATE OR REPLACE FUNCTION calculate_rivalry_heat(fighter1_id UUID, fighter2_id UUID)
RETURNS INTEGER AS $$
DECLARE
    heat_score INTEGER := 0;
    weight_class_match BOOLEAN;
    ranking_proximity INTEGER;
    previous_fights_count INTEGER;
BEGIN
    -- Check if same weight class
    SELECT COUNT(*) > 0 INTO weight_class_match
    FROM fighters f1, fighters f2
    WHERE f1.id = fighter1_id AND f2.id = fighter2_id
    AND f1.weight_class = f2.weight_class;
    
    IF weight_class_match THEN
        heat_score := heat_score + 20;
    END IF;
    
    -- Calculate ranking proximity
    SELECT ABS(r1.rank_position - r2.rank_position) INTO ranking_proximity
    FROM rankings r1, rankings r2
    WHERE r1.fighter_id = fighter1_id AND r2.fighter_id = fighter2_id
    AND r1.weight_class = r2.weight_class;
    
    heat_score := heat_score + GREATEST(0, 20 - ranking_proximity);
    
    -- Count previous fights
    SELECT COUNT(*) INTO previous_fights_count
    FROM fights
    WHERE (fighter1_id = fighter1_id AND fighter2_id = fighter2_id)
    OR (fighter1_id = fighter2_id AND fighter2_id = fighter1_id);
    
    heat_score := heat_score + (previous_fights_count * 15);
    
    RETURN LEAST(100, heat_score);
END;
$$ LANGUAGE plpgsql;

-- Function to update real-time events
CREATE OR REPLACE FUNCTION publish_real_time_event(event_type VARCHAR, event_data JSONB)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO real_time_events (event_type, event_data)
    VALUES (event_type, event_data)
    RETURNING id INTO event_id;
    
    -- Notify real-time subscribers
    PERFORM pg_notify('real_time_events', json_build_object(
        'event_id', event_id,
        'event_type', event_type,
        'event_data', event_data
    )::text);
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for enhanced systems
INSERT INTO venues (name, location, capacity, venue_tier, base_rental_cost, revenue_split) VALUES
('Madison Square Garden', 'New York, NY', 20789, 'premium_venue', 500000.00, 0.15),
('MGM Grand Garden Arena', 'Las Vegas, NV', 17000, 'large_stadium', 400000.00, 0.20),
('O2 Arena', 'London, England', 20000, 'large_stadium', 350000.00, 0.18),
('T-Mobile Arena', 'Las Vegas, NV', 20000, 'large_stadium', 450000.00, 0.22);

INSERT INTO promoters (name, organization, reputation, financial_strength, network_connections) VALUES
('Bob Arum', 'Top Rank', 85, 90, 95),
('Eddie Hearn', 'Matchroom Boxing', 80, 85, 90),
('Oscar De La Hoya', 'Golden Boy Promotions', 75, 80, 85),
('Al Haymon', 'Premier Boxing Champions', 90, 95, 90);

INSERT INTO scouts (name, expertise_regions, success_rate, network_quality, evaluation_accuracy) VALUES
('John Smith', ARRAY['United States', 'Mexico'], 85.5, 90, 88),
('Maria Garcia', ARRAY['Cuba', 'Puerto Rico'], 82.3, 85, 85),
('David Johnson', ARRAY['United Kingdom', 'Ireland'], 87.1, 88, 90);

-- Update existing fighters with AI content placeholders
UPDATE fighters SET 
    ai_personality_traits = '{"confidence": 75, "aggression": 70, "discipline": 80, "charisma": 65}',
    real_world_ranking = CASE 
        WHEN name = 'Oleksandr Usyk' THEN 1
        WHEN name = 'Dmitry Bivol' THEN 2
        WHEN name = 'Jermell Charlo' THEN 3
        ELSE NULL
    END,
    licensing_status = 'verified'
WHERE name IN ('Oleksandr Usyk', 'Dmitry Bivol', 'Jermell Charlo');

-- Create sample rivalries
INSERT INTO rivalries (fighter1_id, fighter2_id, rivalry_type, intensity, description) 
SELECT f1.id, f2.id, 'championship', 85, 'Championship rivalry between top contenders'
FROM fighters f1, fighters f2 
WHERE f1.name = 'Oleksandr Usyk' AND f2.name = 'Dmitry Bivol';

-- Create sample health monitoring records
INSERT INTO health_monitoring (fighter_id, overall_health_score, concussion_risk, medical_clearance_status)
SELECT id, 95, 5, 'cleared'
FROM fighters 
WHERE name IN ('Oleksandr Usyk', 'Dmitry Bivol', 'Jermell Charlo');

-- Create sample analytics events
INSERT INTO analytics_events (event_type, fighter_id, event_data)
SELECT 'fighter_viewed', id, '{"view_duration": 45, "user_engagement": "high"}'
FROM fighters 
LIMIT 5;

-- Update triggers for enhanced functionality
CREATE OR REPLACE FUNCTION update_rankings_on_fight_result()
RETURNS TRIGGER AS $$
BEGIN
    -- Update rankings when fight result is recorded
    IF NEW.winner_id IS NOT NULL AND OLD.winner_id IS NULL THEN
        -- Update winner ranking
        UPDATE rankings 
        SET points = points + 100,
            win_streak = win_streak + 1,
            last_fight = 'WIN vs ' || (SELECT name FROM fighters WHERE id = NEW.loser_id),
            last_fight_date = CURRENT_TIMESTAMP
        WHERE fighter_id = NEW.winner_id;
        
        -- Update loser ranking
        UPDATE rankings 
        SET points = points + 10,
            win_streak = 0,
            last_fight = 'LOSS vs ' || (SELECT name FROM fighters WHERE id = NEW.winner_id),
            last_fight_date = CURRENT_TIMESTAMP
        WHERE fighter_id = NEW.loser_id;
        
        -- Publish real-time event
        PERFORM publish_real_time_event('fight_completed', json_build_object(
            'match_id', NEW.id,
            'winner_id', NEW.winner_id,
            'loser_id', NEW.loser_id,
            'method', NEW.result_type
        ));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rankings_on_fight_result_trigger
    AFTER UPDATE ON fights
    FOR EACH ROW
    EXECUTE FUNCTION update_rankings_on_fight_result(); 