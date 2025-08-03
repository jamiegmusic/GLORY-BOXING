-- Seed data for dreamworld_talents table
-- 5 iconic 1920s figures with interconnected relationships

-- First, let's get the IDs we'll use for relationships
DO $$
DECLARE
  billie_id UUID := 'a1111111-1111-1111-1111-111111111111';
  jack_id UUID := 'a2222222-2222-2222-2222-222222222222';
  clara_id UUID := 'a3333333-3333-3333-3333-333333333333';
  capone_id UUID := 'a4444444-4444-4444-4444-444444444444';
  duke_id UUID := 'a5555555-5555-5555-5555-555555555555';
BEGIN

-- Clear existing 1920s talents (optional - remove if you want to keep existing data)
-- DELETE FROM dreamworld_talents WHERE dream_era = '1920s';

-- 1. Billie Holiday - Singer
INSERT INTO dreamworld_talents (
  id,
  name,
  dream_era,
  career_path,
  era_specific_skills,
  dream_anomaly,
  lucid_events,
  notoriety,
  current_location,
  relationships,
  status,
  created_at
) VALUES (
  billie_id,
  'Billie Holiday',
  '1920s',
  'singer',
  '{
    "jazzSense": 98,
    "vocalControl": 92,
    "emotionalDepth": 96,
    "stagePresence": 88,
    "improvisation": 90,
    "crowdConnection": 85
  }'::jsonb,
  'Sometimes sings lyrics from songs that won''t be written for decades',
  '[
    {"event": "Performed at Cotton Club opening", "impact": "high"},
    {"event": "Collaborated with Duke Ellington", "impact": "legendary"}
  ]'::jsonb,
  87,
  'Harlem Jazz Club',
  json_build_object(
    duke_id::text, 'collaborator',
    capone_id::text, 'patron',
    clara_id::text, 'friend'
  )::jsonb,
  'active',
  NOW()
);

-- 2. Jack Dempsey - Boxer
INSERT INTO dreamworld_talents (
  id,
  name,
  dream_era,
  career_path,
  era_specific_skills,
  dream_anomaly,
  lucid_events,
  notoriety,
  current_location,
  relationships,
  status,
  created_at
) VALUES (
  jack_id,
  'Jack Dempsey',
  '1920s',
  'boxer',
  '{
    "power": 96,
    "speed": 88,
    "endurance": 92,
    "technique": 85,
    "intimidation": 94,
    "ringStrategy": 87,
    "crowdAppeal": 90
  }'::jsonb,
  'Uses boxing combinations that haven''t been invented yet',
  '[
    {"event": "Defended heavyweight title", "impact": "legendary"},
    {"event": "Secret training with Capone''s crew", "impact": "controversial"}
  ]'::jsonb,
  95,
  'Madison Square Garden',
  json_build_object(
    capone_id::text, 'business_associate',
    clara_id::text, 'admirer',
    duke_id::text, 'acquaintance'
  )::jsonb,
  'active',
  NOW()
);

-- 3. Clara Bow - Actor
INSERT INTO dreamworld_talents (
  id,
  name,
  dream_era,
  career_path,
  era_specific_skills,
  dream_anomaly,
  lucid_events,
  notoriety,
  current_location,
  relationships,
  status,
  created_at
) VALUES (
  clara_id,
  'Clara Bow',
  '1920s',
  'actor',
  '{
    "charisma": 94,
    "screenPresence": 92,
    "emotionalRange": 87,
    "comedyTiming": 89,
    "flirtation": 96,
    "dancing": 85,
    "modernStyle": 93
  }'::jsonb,
  'Acts out scenes from movies that will be made in the future',
  '[
    {"event": "Starred in ''It'' - defining the It Girl", "impact": "cultural"},
    {"event": "Secret jazz club performances", "impact": "scandalous"}
  ]'::jsonb,
  91,
  'Hollywood Studio Lot',
  json_build_object(
    billie_id::text, 'friend',
    jack_id::text, 'romantic_interest',
    duke_id::text, 'party_guest',
    capone_id::text, 'wary_acquaintance'
  )::jsonb,
  'active',
  NOW()
);

-- 4. Al Capone - Management/Mogul
INSERT INTO dreamworld_talents (
  id,
  name,
  dream_era,
  career_path,
  era_specific_skills,
  dream_anomaly,
  lucid_events,
  notoriety,
  current_location,
  relationships,
  status,
  created_at
) VALUES (
  capone_id,
  'Al Capone',
  '1920s',
  'management',
  '{
    "influence": 97,
    "intimidation": 95,
    "businessAcumen": 90,
    "networking": 93,
    "strategy": 88,
    "negotiation": 91,
    "resourceControl": 94
  }'::jsonb,
  'Occasionally mentions business strategies from the digital age',
  '[
    {"event": "Opened the most exclusive speakeasy", "impact": "empire_building"},
    {"event": "Sponsored jazz talent across Chicago", "impact": "cultural_patron"}
  ]'::jsonb,
  98,
  'Chicago Headquarters',
  json_build_object(
    duke_id::text, 'business_partner',
    billie_id::text, 'talent_patron',
    jack_id::text, 'investment',
    clara_id::text, 'distant_admirer'
  )::jsonb,
  'active',
  NOW()
);

-- 5. Duke Ellington - Singer/Management
INSERT INTO dreamworld_talents (
  id,
  name,
  dream_era,
  career_path,
  era_specific_skills,
  dream_anomaly,
  lucid_events,
  notoriety,
  current_location,
  relationships,
  status,
  created_at
) VALUES (
  duke_id,
  'Duke Ellington',
  '1920s',
  'singer',  -- Primary path is singer, but has management skills
  '{
    "musicality": 95,
    "composition": 93,
    "bandLeadership": 91,
    "pianoMastery": 94,
    "arrangement": 92,
    "businessSense": 87,
    "innovation": 90,
    "collaboration": 88
  }'::jsonb,
  'Composes melodies that sound like they''re from another dimension',
  '[
    {"event": "Residency at Cotton Club", "impact": "career_defining"},
    {"event": "Created new jazz orchestration style", "impact": "revolutionary"}
  ]'::jsonb,
  89,
  'Cotton Club',
  json_build_object(
    billie_id::text, 'collaborator',
    capone_id::text, 'business_partner',
    clara_id::text, 'friend',
    jack_id::text, 'acquaintance'
  )::jsonb,
  'active',
  NOW()
);

END $$;