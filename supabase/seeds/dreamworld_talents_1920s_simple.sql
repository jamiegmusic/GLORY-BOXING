-- Seed data for dreamworld_talents table
-- 5 iconic 1920s figures - Simple INSERT version

-- Clear existing 1920s talents (optional - uncomment if needed)
-- DELETE FROM dreamworld_talents WHERE dream_era = '1920s';

-- 1. Billie Holiday - Singer
INSERT INTO dreamworld_talents (
  name,
  dream_era,
  career_path,
  era_specific_skills,
  dream_anomaly,
  lucid_events,
  notoriety,
  current_location,
  relationships,
  status
) VALUES (
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
  }',
  'Sometimes sings lyrics from songs that won''t be written for decades',
  '[
    {"event": "Performed at Cotton Club opening", "impact": "high"},
    {"event": "Collaborated with Duke Ellington", "impact": "legendary"}
  ]',
  87,
  'Harlem Jazz Club',
  '{"Duke Ellington": "collaborator", "Al Capone": "patron", "Clara Bow": "friend"}',
  'active'
);

-- 2. Jack Dempsey - Boxer
INSERT INTO dreamworld_talents (
  name,
  dream_era,
  career_path,
  era_specific_skills,
  dream_anomaly,
  lucid_events,
  notoriety,
  current_location,
  relationships,
  status
) VALUES (
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
  }',
  'Uses boxing combinations that haven''t been invented yet',
  '[
    {"event": "Defended heavyweight title", "impact": "legendary"},
    {"event": "Secret training with Capone''s crew", "impact": "controversial"}
  ]',
  95,
  'Madison Square Garden',
  '{"Al Capone": "business_associate", "Clara Bow": "admirer", "Duke Ellington": "acquaintance"}',
  'active'
);

-- 3. Clara Bow - Actor
INSERT INTO dreamworld_talents (
  name,
  dream_era,
  career_path,
  era_specific_skills,
  dream_anomaly,
  lucid_events,
  notoriety,
  current_location,
  relationships,
  status
) VALUES (
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
  }',
  'Acts out scenes from movies that will be made in the future',
  '[
    {"event": "Starred in ''It'' - defining the It Girl", "impact": "cultural"},
    {"event": "Secret jazz club performances", "impact": "scandalous"}
  ]',
  91,
  'Hollywood Studio Lot',
  '{"Billie Holiday": "friend", "Jack Dempsey": "romantic_interest", "Duke Ellington": "party_guest", "Al Capone": "wary_acquaintance"}',
  'active'
);

-- 4. Al Capone - Management/Mogul
INSERT INTO dreamworld_talents (
  name,
  dream_era,
  career_path,
  era_specific_skills,
  dream_anomaly,
  lucid_events,
  notoriety,
  current_location,
  relationships,
  status
) VALUES (
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
  }',
  'Occasionally mentions business strategies from the digital age',
  '[
    {"event": "Opened the most exclusive speakeasy", "impact": "empire_building"},
    {"event": "Sponsored jazz talent across Chicago", "impact": "cultural_patron"}
  ]',
  98,
  'Chicago Headquarters',
  '{"Duke Ellington": "business_partner", "Billie Holiday": "talent_patron", "Jack Dempsey": "investment", "Clara Bow": "distant_admirer"}',
  'active'
);

-- 5. Duke Ellington - Singer/Management
INSERT INTO dreamworld_talents (
  name,
  dream_era,
  career_path,
  era_specific_skills,
  dream_anomaly,
  lucid_events,
  notoriety,
  current_location,
  relationships,
  status
) VALUES (
  'Duke Ellington',
  '1920s',
  'singer',
  '{
    "musicality": 95,
    "composition": 93,
    "bandLeadership": 91,
    "pianoMastery": 94,
    "arrangement": 92,
    "businessSense": 87,
    "innovation": 90,
    "collaboration": 88
  }',
  'Composes melodies that sound like they''re from another dimension',
  '[
    {"event": "Residency at Cotton Club", "impact": "career_defining"},
    {"event": "Created new jazz orchestration style", "impact": "revolutionary"}
  ]',
  89,
  'Cotton Club',
  '{"Billie Holiday": "collaborator", "Al Capone": "business_partner", "Clara Bow": "friend", "Jack Dempsey": "acquaintance"}',
  'active'
);