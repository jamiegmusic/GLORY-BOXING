-- Enhanced Boxing Management Game Database Schema
-- From Amateur to Glory - Complete Fighter & Business Management System

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Game State Management
CREATE TABLE game_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_name VARCHAR(100) NOT NULL,
    current_date DATE DEFAULT CURRENT_DATE,
    game_week INTEGER DEFAULT 1,
    total_money DECIMAL(15,2) DEFAULT 10000.00,
    reputation INTEGER DEFAULT 50,
    experience_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fighter Profiles with Enhanced Stats
CREATE TABLE fighters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    nickname VARCHAR(100),
    age INTEGER NOT NULL,
    weight_class VARCHAR(50) NOT NULL,
    nationality VARCHAR(100),
    hometown VARCHAR(100),
    
    -- Physical Attributes
    height_cm INTEGER,
    reach_cm INTEGER,
    stance VARCHAR(20) CHECK (stance IN ('orthodox', 'southpaw', 'switch')),
    
    -- Core Boxing Stats (1-100 scale)
    punching_power INTEGER DEFAULT 50,
    speed INTEGER DEFAULT 50,
    defense INTEGER DEFAULT 50,
    stamina INTEGER DEFAULT 50,
    chin INTEGER DEFAULT 50,
    heart INTEGER DEFAULT 50,
    ring_iq INTEGER DEFAULT 50,
    adaptability INTEGER DEFAULT 50,
    mental_toughness INTEGER DEFAULT 50,
    recovery_time INTEGER DEFAULT 50,
    
    -- Career Stats
    record_wins INTEGER DEFAULT 0,
    record_losses INTEGER DEFAULT 0,
    record_draws INTEGER DEFAULT 0,
    knockouts INTEGER DEFAULT 0,
    total_rounds_fought INTEGER DEFAULT 0,
    
    -- Career Progression
    experience_level INTEGER DEFAULT 1,
    career_stage VARCHAR(30) DEFAULT 'amateur' CHECK (career_stage IN ('amateur', 'prospect', 'contender', 'champion', 'legend', 'retired')),
    prime_age_start INTEGER DEFAULT 25,
    prime_age_end INTEGER DEFAULT 32,
    decline_start_age INTEGER DEFAULT 35,
    
    -- Psychological State
    confidence INTEGER DEFAULT 50,
    motivation INTEGER DEFAULT 50,
    stress_level INTEGER DEFAULT 0,
    personal_issues TEXT[],
    
    -- Financial
    current_purse DECIMAL(10,2) DEFAULT 0,
    career_earnings DECIMAL(15,2) DEFAULT 0,
    contract_value DECIMAL(15,2) DEFAULT 0,
    
    -- Status
    is_injured BOOLEAN DEFAULT FALSE,
    injury_type VARCHAR(100),
    injury_severity INTEGER DEFAULT 0,
    injury_recovery_weeks INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    
    -- Training & Development
    current_training_focus VARCHAR(50),
    skill_improvement_rate DECIMAL(3,2) DEFAULT 1.0,
    last_training_date DATE DEFAULT CURRENT_DATE,
    
    -- Relationships
    trainer_id UUID,
    promoter_id UUID,
    manager_id UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Training Camps
CREATE TABLE training_camps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fighter_id UUID REFERENCES fighters(id) ON DELETE CASCADE,
    camp_name VARCHAR(100),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    duration_weeks INTEGER DEFAULT 8,
    
    -- Camp Focus Areas
    focus_punching_power BOOLEAN DEFAULT FALSE,
    focus_speed BOOLEAN DEFAULT FALSE,
    focus_defense BOOLEAN DEFAULT FALSE,
    focus_stamina BOOLEAN DEFAULT FALSE,
    focus_ring_iq BOOLEAN DEFAULT FALSE,
    
    -- Camp Quality
    camp_quality INTEGER DEFAULT 50,
    sparring_partners_quality INTEGER DEFAULT 50,
    nutrition_quality INTEGER DEFAULT 50,
    gym_atmosphere INTEGER DEFAULT 50,
    
    -- Costs
    total_cost DECIMAL(10,2) DEFAULT 0,
    daily_cost DECIMAL(8,2) DEFAULT 0,
    
    -- Staff
    head_trainer VARCHAR(100),
    nutritionist_hired BOOLEAN DEFAULT FALSE,
    strength_coach_hired BOOLEAN DEFAULT FALSE,
    cutman_hired BOOLEAN DEFAULT FALSE,
    
    -- Results
    skill_gains JSONB,
    camp_success_rating INTEGER,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Injury System
CREATE TABLE injuries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fighter_id UUID REFERENCES fighters(id) ON DELETE CASCADE,
    injury_type VARCHAR(100) NOT NULL,
    severity INTEGER CHECK (severity BETWEEN 1 AND 10),
    description TEXT,
    recovery_weeks INTEGER NOT NULL,
    permanent_effects TEXT[],
    occurred_date DATE DEFAULT CURRENT_DATE,
    expected_recovery_date DATE,
    actual_recovery_date DATE,
    is_recovered BOOLEAN DEFAULT FALSE,
    
    -- Long-term effects
    affects_punching_power BOOLEAN DEFAULT FALSE,
    affects_speed BOOLEAN DEFAULT FALSE,
    affects_defense BOOLEAN DEFAULT FALSE,
    affects_stamina BOOLEAN DEFAULT FALSE,
    affects_chin BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Contracts System
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fighter_id UUID REFERENCES fighters(id) ON DELETE CASCADE,
    promoter_id UUID,
    contract_type VARCHAR(50) CHECK (contract_type IN ('amateur', 'pro_debut', 'development', 'championship', 'super_fight', 'retirement')),
    
    -- Financial Terms
    base_purse DECIMAL(10,2) NOT NULL,
    win_bonus DECIMAL(10,2) DEFAULT 0,
    knockout_bonus DECIMAL(10,2) DEFAULT 0,
    ppv_percentage DECIMAL(5,2) DEFAULT 0,
    sponsorship_split DECIMAL(5,2) DEFAULT 0,
    
    -- Contract Details
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    fights_committed INTEGER DEFAULT 1,
    fights_completed INTEGER DEFAULT 0,
    contract_value DECIMAL(15,2),
    
    -- Negotiation Terms
    negotiation_difficulty INTEGER DEFAULT 50,
    fighter_satisfaction INTEGER DEFAULT 50,
    promoter_satisfaction INTEGER DEFAULT 50,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    is_exclusive BOOLEAN DEFAULT FALSE,
    termination_clause TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fights & Events
CREATE TABLE fights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fighter1_id UUID REFERENCES fighters(id),
    fighter2_id UUID REFERENCES fighters(id),
    event_name VARCHAR(200),
    venue_name VARCHAR(200),
    venue_location VARCHAR(200),
    fight_date DATE,
    
    -- Fight Details
    weight_class VARCHAR(50),
    rounds_scheduled INTEGER DEFAULT 12,
    championship_fight BOOLEAN DEFAULT FALSE,
    title_belt VARCHAR(100),
    
    -- Fight Results
    winner_id UUID REFERENCES fighters(id),
    result_type VARCHAR(50) CHECK (result_type IN ('decision', 'ko', 'tko', 'draw', 'no_contest', 'dqd')),
    round_ended INTEGER,
    time_in_round VARCHAR(10),
    
    -- Performance Stats
    fighter1_punches_landed INTEGER,
    fighter1_punches_thrown INTEGER,
    fighter2_punches_landed INTEGER,
    fighter2_punches_thrown INTEGER,
    
    -- Financial
    gate_receipts DECIMAL(12,2),
    ppv_buys INTEGER,
    total_revenue DECIMAL(15,2),
    
    -- Ratings
    fight_rating INTEGER,
    crowd_reaction INTEGER,
    media_coverage_rating INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rankings System
CREATE TABLE rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fighter_id UUID REFERENCES fighters(id) ON DELETE CASCADE,
    weight_class VARCHAR(50) NOT NULL,
    organization VARCHAR(20) CHECK (organization IN ('WBC', 'WBA', 'IBF', 'WBO', 'RING')),
    rank_position INTEGER,
    points INTEGER DEFAULT 0,
    last_updated DATE DEFAULT CURRENT_DATE,
    
    UNIQUE(fighter_id, weight_class, organization)
);

-- Media & Public Relations
CREATE TABLE media_coverage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fighter_id UUID REFERENCES fighters(id) ON DELETE CASCADE,
    headline VARCHAR(200),
    content TEXT,
    media_type VARCHAR(50) CHECK (media_type IN ('press_conference', 'interview', 'social_media', 'scandal', 'achievement')),
    impact_on_reputation INTEGER DEFAULT 0,
    impact_on_marketability INTEGER DEFAULT 0,
    published_date DATE DEFAULT CURRENT_DATE,
    
    -- Public Reaction
    public_reaction VARCHAR(20) CHECK (public_reaction IN ('positive', 'negative', 'neutral', 'controversial')),
    social_media_buzz INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsorship Deals
CREATE TABLE sponsorships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fighter_id UUID REFERENCES fighters(id) ON DELETE CASCADE,
    sponsor_name VARCHAR(100),
    deal_value DECIMAL(10,2),
    duration_months INTEGER,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Deal Terms
    requirements TEXT[],
    bonus_conditions TEXT[],
    termination_clause TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Development Tracking
CREATE TABLE skill_development (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fighter_id UUID REFERENCES fighters(id) ON DELETE CASCADE,
    skill_type VARCHAR(50) CHECK (skill_type IN ('punching_power', 'speed', 'defense', 'stamina', 'chin', 'heart', 'ring_iq', 'adaptability', 'mental_toughness', 'recovery_time')),
    old_value INTEGER,
    new_value INTEGER,
    improvement_amount INTEGER,
    improvement_date DATE DEFAULT CURRENT_DATE,
    improvement_reason VARCHAR(200),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rivalries & Feuds
CREATE TABLE rivalries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fighter1_id UUID REFERENCES fighters(id) ON DELETE CASCADE,
    fighter2_id UUID REFERENCES fighters(id) ON DELETE CASCADE,
    rivalry_type VARCHAR(50) CHECK (rivalry_type IN ('personal', 'professional', 'territorial', 'championship')),
    intensity INTEGER DEFAULT 50 CHECK (intensity BETWEEN 1 AND 100),
    start_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    
    -- Public Interest
    public_interest INTEGER DEFAULT 50,
    media_coverage_level INTEGER DEFAULT 50,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cut Scenes & Story Events
CREATE TABLE cut_scenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scene_type VARCHAR(50) CHECK (scene_type IN ('training', 'press_conference', 'backstage', 'personal_issue', 'business_meeting', 'fight_preparation')),
    title VARCHAR(200),
    description TEXT,
    choices JSONB,
    consequences JSONB,
    required_fighter_id UUID REFERENCES fighters(id),
    optional_fighter_id UUID REFERENCES fighters(id),
    is_triggered BOOLEAN DEFAULT FALSE,
    trigger_conditions JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game Events & Triggers
CREATE TABLE game_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) CHECK (event_type IN ('fighter_retirement', 'injury', 'contract_negotiation', 'sponsorship_opportunity', 'media_scandal', 'championship_opportunity')),
    title VARCHAR(200),
    description TEXT,
    affected_fighter_id UUID REFERENCES fighters(id),
    game_week INTEGER,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolution_choice VARCHAR(100),
    consequences JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_fighters_weight_class ON fighters(weight_class);
CREATE INDEX idx_fighters_career_stage ON fighters(career_stage);
CREATE INDEX idx_fighters_is_available ON fighters(is_available);
CREATE INDEX idx_contracts_fighter_id ON contracts(fighter_id);
CREATE INDEX idx_contracts_is_active ON contracts(is_active);
CREATE INDEX idx_fights_fighter1_id ON fights(fighter1_id);
CREATE INDEX idx_fights_fighter2_id ON fights(fighter2_id);
CREATE INDEX idx_fights_fight_date ON fights(fight_date);
CREATE INDEX idx_rankings_weight_class_org ON rankings(weight_class, organization);
CREATE INDEX idx_training_camps_fighter_id ON training_camps(fighter_id);
CREATE INDEX idx_injuries_fighter_id ON injuries(fighter_id);
CREATE INDEX idx_injuries_is_recovered ON injuries(is_recovered);

-- Insert legendary fighters
INSERT INTO fighters (name, nickname, age, weight_class, nationality, hometown, height_cm, reach_cm, stance, 
                     punching_power, speed, defense, stamina, chin, heart, ring_iq, adaptability, mental_toughness, recovery_time,
                     record_wins, record_losses, record_draws, knockouts, career_stage, experience_level, confidence, motivation) VALUES
('Carl Froch', 'The Cobra', 46, 'super_middleweight', 'British', 'Nottingham, England', 183, 185, 'orthodox', 
 85, 75, 80, 90, 95, 95, 88, 82, 90, 85, 33, 2, 0, 24, 'legend', 20, 90, 85),
('Tony Bellew', 'Bomber', 41, 'cruiserweight', 'British', 'Liverpool, England', 183, 183, 'orthodox',
 80, 70, 75, 85, 85, 90, 80, 75, 85, 80, 30, 3, 1, 20, 'legend', 18, 85, 80),
('Oleksandr Usyk', 'The Cat', 36, 'heavyweight', 'Ukrainian', 'Simferopol, Ukraine', 191, 198, 'southpaw',
 75, 90, 95, 90, 85, 90, 95, 90, 95, 90, 21, 0, 0, 14, 'champion', 15, 95, 95),
('Dmitry Bivol', 'The Silent Assassin', 32, 'light_heavyweight', 'Russian', 'Tajikistan', 183, 183, 'orthodox',
 80, 85, 90, 85, 85, 85, 90, 85, 90, 85, 21, 0, 0, 11, 'champion', 12, 90, 90),
('Jermell Charlo', 'Iron Man', 33, 'super_welterweight', 'American', 'Houston, Texas', 180, 185, 'orthodox',
 85, 80, 80, 85, 85, 90, 85, 80, 90, 85, 35, 1, 1, 19, 'champion', 16, 90, 90);

-- Insert initial game state
INSERT INTO game_state (player_name, total_money, reputation, experience_points, level) VALUES
('New Promoter', 10000.00, 50, 0, 1);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_fighter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fighter_updated_at
    BEFORE UPDATE ON fighters
    FOR EACH ROW
    EXECUTE FUNCTION update_fighter_updated_at();

-- Function to calculate fighter age and career stage
CREATE OR REPLACE FUNCTION update_fighter_career_stage()
RETURNS TRIGGER AS $$
BEGIN
    -- Update age based on game date
    NEW.age = NEW.age + EXTRACT(YEAR FROM CURRENT_DATE - NEW.created_at::DATE);
    
    -- Update career stage based on age and experience
    IF NEW.age < 20 THEN
        NEW.career_stage = 'amateur';
    ELSIF NEW.age < 25 THEN
        NEW.career_stage = 'prospect';
    ELSIF NEW.age < NEW.prime_age_end THEN
        NEW.career_stage = 'contender';
    ELSIF NEW.age < NEW.decline_start_age THEN
        NEW.career_stage = 'champion';
    ELSIF NEW.age < 40 THEN
        NEW.career_stage = 'legend';
    ELSE
        NEW.career_stage = 'retired';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fighter_career_stage
    BEFORE UPDATE ON fighters
    FOR EACH ROW
    EXECUTE FUNCTION update_fighter_career_stage(); 