-- Dreamworld Quests and Legacy Unlocks Tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create dreamworld_quests table
CREATE TABLE IF NOT EXISTS dreamworld_quests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quest_id VARCHAR(100) NOT NULL,
    player_id UUID NOT NULL,
    current_phase VARCHAR(50) NOT NULL,
    phases_completed JSONB DEFAULT '[]'::jsonb,
    clues_discovered JSONB DEFAULT '[]'::jsonb,
    lucid_used INTEGER DEFAULT 0,
    logic_used INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    reward_claimed BOOLEAN DEFAULT FALSE,
    reward_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint for player-quest combination
    UNIQUE(player_id, quest_id)
);

-- Create legacy_unlocks table
CREATE TABLE IF NOT EXISTS legacy_unlocks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    player_id UUID NOT NULL,
    unlock_type VARCHAR(50) NOT NULL CHECK (unlock_type IN ('skill', 'item', 'connection', 'knowledge', 'bonus')),
    unlock_name VARCHAR(255) NOT NULL,
    unlock_data JSONB NOT NULL,
    dreamworld_source VARCHAR(100),
    applied_to_main BOOLEAN DEFAULT FALSE,
    applied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index for quick player lookups
    INDEX idx_legacy_unlocks_player (player_id),
    INDEX idx_legacy_unlocks_applied (applied_to_main)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dreamworld_quests_player ON dreamworld_quests(player_id);
CREATE INDEX IF NOT EXISTS idx_dreamworld_quests_quest ON dreamworld_quests(quest_id);
CREATE INDEX IF NOT EXISTS idx_dreamworld_quests_status ON dreamworld_quests(current_phase);

-- Comments for documentation
COMMENT ON TABLE dreamworld_quests IS 'Tracks player progress through dreamworld story quests';
COMMENT ON TABLE legacy_unlocks IS 'Rewards earned in dreamworld that affect the main game';

COMMENT ON COLUMN dreamworld_quests.quest_id IS 'Identifier for the quest template';
COMMENT ON COLUMN dreamworld_quests.current_phase IS 'Current phase of the quest (investigation, confrontation, etc.)';
COMMENT ON COLUMN dreamworld_quests.lucid_used IS 'Total lucid power spent during quest';
COMMENT ON COLUMN dreamworld_quests.logic_used IS 'Number of logic-based choices made';

COMMENT ON COLUMN legacy_unlocks.unlock_type IS 'Type of reward: skill, item, connection, knowledge, or bonus';
COMMENT ON COLUMN legacy_unlocks.unlock_data IS 'JSON data containing effects, description, rarity, etc.';
COMMENT ON COLUMN legacy_unlocks.dreamworld_source IS 'Quest or event that generated this unlock';

-- Grant permissions (adjust based on your setup)
GRANT ALL ON dreamworld_quests TO authenticated;
GRANT ALL ON legacy_unlocks TO authenticated;

-- Row Level Security (if enabled)
ALTER TABLE dreamworld_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy_unlocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Players can view their own quests" ON dreamworld_quests
    FOR SELECT USING (auth.uid()::uuid = player_id);

CREATE POLICY "Players can update their own quests" ON dreamworld_quests
    FOR UPDATE USING (auth.uid()::uuid = player_id);

CREATE POLICY "Players can insert their own quests" ON dreamworld_quests
    FOR INSERT WITH CHECK (auth.uid()::uuid = player_id);

CREATE POLICY "Players can view their own unlocks" ON legacy_unlocks
    FOR SELECT USING (auth.uid()::uuid = player_id);

CREATE POLICY "Players can view applied unlocks" ON legacy_unlocks
    FOR SELECT USING (applied_to_main = true);

-- Sample data for testing
INSERT INTO legacy_unlocks (player_id, unlock_type, unlock_name, unlock_data, dreamworld_source) VALUES
(
    '11111111-1111-1111-1111-111111111111'::uuid,
    'item',
    'Vintage Sheet Music',
    '{
        "description": "A mysterious composition from the dreamworld",
        "rarity": "rare",
        "effects": {
            "music_skill_bonus": 5,
            "dream_affinity": true
        }
    }'::jsonb,
    'tutorial_quest'
)
ON CONFLICT DO NOTHING;