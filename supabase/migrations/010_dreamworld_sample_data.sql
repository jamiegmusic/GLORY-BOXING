-- Sample Data for Dreamworld Tables
-- This migration adds example data to help get started with the dreamworld system

-- Insert sample dreamworld talents
INSERT INTO dreamworld_talents (name, dream_era, career_path, era_specific_skills, dream_anomaly, notoriety, current_location, relationships, status) VALUES
-- 1920s Talents
('Louis Armstrong', '1920s', 'singer', 
  '{"trumpet": 95, "vocals": 88, "charisma": 92, "jazz_innovation": 97, "stage_presence": 90}',
  'Sometimes plays melodies from the future', 85, 'Cotton Club', 
  '{"duke_ellington": "friend", "al_capone": "acquaintance"}', 'active'),

('Bessie Smith', '1920s', 'singer',
  '{"blues_vocals": 98, "stage_presence": 90, "songwriting": 85, "charisma": 88}',
  'Her voice echoes through time itself', 82, 'Chicago Theater',
  '{"ma_rainey": "mentor", "louis_armstrong": "colleague"}', 'active'),

('Jack Dempsey', '1920s', 'boxer',
  '{"power": 94, "speed": 85, "defense": 82, "intimidation": 90, "stamina": 88}',
  'Uses boxing techniques not yet invented', 92, 'Madison Square Garden',
  '{"gene_tunney": "rival", "jack_johnson": "inspiration"}', 'active'),

('Charlie Chaplin', '1920s', 'actor',
  '{"physical_comedy": 98, "directing": 90, "charisma": 85, "creativity": 95}',
  'His films contain hidden messages about the future', 88, 'Hollywood',
  '{"mary_pickford": "colleague", "douglas_fairbanks": "friend"}', 'active'),

('Al Capone', '1920s', 'mogul',
  '{"intimidation": 95, "business_acumen": 88, "networking": 92, "strategy": 85}',
  'Knows about crimes that haven''t happened yet', 96, 'Chicago',
  '{"frank_nitti": "lieutenant", "eliot_ness": "nemesis"}', 'active'),

-- 1930s Talents  
('Clark Gable', '1930s', 'actor',
  '{"charm": 92, "screen_presence": 95, "dramatic_range": 88, "voice": 85}',
  'Can see alternate film endings', 89, 'MGM Studios',
  '{"vivien_leigh": "co-star", "spencer_tracy": "friend"}', 'active'),

('Billie Holiday', '1930s', 'singer',
  '{"jazz_vocals": 96, "emotional_depth": 98, "phrasing": 94, "stage_presence": 88}',
  'Sings songs that haven''t been written', 86, 'Harlem',
  '{"count_basie": "collaborator", "lester_young": "close_friend"}', 'active'),

('Joe Louis', '1930s', 'boxer',
  '{"power": 96, "technique": 90, "endurance": 92, "focus": 88}',
  'Dreams of future heavyweight champions', 94, 'Detroit',
  '{"max_schmeling": "rival", "jack_blackburn": "trainer"}', 'active'),

-- 1940s Talents
('Frank Sinatra', '1940s', 'singer',
  '{"vocals": 94, "phrasing": 96, "charisma": 92, "stage_presence": 90}',
  'His voice carries memories of the future', 91, 'New York',
  '{"dean_martin": "friend", "sammy_davis_jr": "friend"}', 'active'),

('Humphrey Bogart', '1940s', 'actor',
  '{"tough_guy_persona": 95, "dramatic_timing": 92, "screen_presence": 94}',
  'Speaks lines from unmade films', 90, 'Warner Bros',
  '{"lauren_bacall": "love", "john_huston": "director"}', 'active'),

-- 1950s Talents
('Elvis Presley', '1950s', 'singer',
  '{"vocals": 92, "hip_movement": 98, "charisma": 96, "guitar": 85}',
  'Moves to rhythms from another dimension', 95, 'Memphis',
  '{"colonel_parker": "manager", "scotty_moore": "guitarist"}', 'active'),

('Marilyn Monroe', '1950s', 'actor',
  '{"sex_appeal": 98, "comedy_timing": 88, "vulnerability": 92, "singing": 82}',
  'Knows secrets about everyone''s future', 93, 'Hollywood',
  '{"joe_dimaggio": "ex_husband", "arthur_miller": "husband"}', 'active');

-- Insert sample dream events for a demo player
INSERT INTO dream_events (player_id, dream_type, content, impact_score, actionable_insight, career_path) VALUES
('11111111-1111-1111-1111-111111111111', 'prophecy', 
  'You see a vision of the Cotton Club bathed in golden light. Louis Armstrong whispers that tomorrow''s performance will change everything.',
  75, 'Book your best talent at the Cotton Club immediately', 'singer'),

('11111111-1111-1111-1111-111111111111', 'warning',
  'Dark shadows gather over Madison Square Garden. A rival promoter plots to steal your champion.',
  60, 'Strengthen your contracts and watch for betrayal', 'boxer'),

('11111111-1111-1111-1111-111111111111', 'inspiration',
  'In a burst of creative energy, you see Charlie Chaplin performing an impossible routine that merges past and future.',
  50, 'Combine traditional and modern techniques in your next project', 'actor'),

('11111111-1111-1111-1111-111111111111', 'vision',
  'Time becomes fluid as you witness the evolution of entertainment from speakeasies to television studios.',
  85, 'The future of entertainment lies in adapting to new mediums', 'mogul');

-- Insert sample player state
INSERT INTO dreamworld_player_state (player_id, current_era, lucid_meter, dream_level, wellness_meter, current_location, reality_glitches, return_conditions) VALUES
('11111111-1111-1111-1111-111111111111', '1920s', 75, 1, 80, 'Harlem', 
  '[]',
  '{"lucid_meter_zero": true, "max_dream_level": 10, "critical_wellness": 10}');