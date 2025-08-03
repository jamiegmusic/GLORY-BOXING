-- Verification queries for dreamworld_talents seed data

-- 1. Overview of all 1920s talents
SELECT 
  name,
  career_path,
  notoriety,
  current_location,
  dream_anomaly
FROM dreamworld_talents 
WHERE dream_era = '1920s'
ORDER BY notoriety DESC;

-- 2. Detailed skill breakdown
SELECT 
  name,
  career_path,
  CASE 
    WHEN career_path = 'singer' THEN 
      COALESCE(era_specific_skills->>'jazzSense', era_specific_skills->>'musicality')
    WHEN career_path = 'boxer' THEN 
      era_specific_skills->>'power'
    WHEN career_path = 'actor' THEN 
      era_specific_skills->>'charisma'
    WHEN career_path = 'management' THEN 
      era_specific_skills->>'influence'
  END as primary_skill_value,
  era_specific_skills
FROM dreamworld_talents 
WHERE dream_era = '1920s'
ORDER BY name;

-- 3. Relationship network visualization
SELECT 
  t1.name as talent,
  t1.relationships
FROM dreamworld_talents t1
WHERE t1.dream_era = '1920s'
ORDER BY t1.name;

-- 4. Dream anomalies summary
SELECT 
  name,
  dream_anomaly,
  CASE 
    WHEN dream_anomaly LIKE '%future%' THEN 'Future Knowledge'
    WHEN dream_anomaly LIKE '%dimension%' THEN 'Dimensional Awareness'
    WHEN dream_anomaly LIKE '%decades%' THEN 'Time Displacement'
    WHEN dream_anomaly LIKE '%invented%' THEN 'Temporal Innovation'
    WHEN dream_anomaly LIKE '%digital%' THEN 'Anachronistic Knowledge'
    ELSE 'Other'
  END as anomaly_type
FROM dreamworld_talents 
WHERE dream_era = '1920s';

-- 5. Lucid events impact summary
SELECT 
  name,
  jsonb_array_length(lucid_events) as event_count,
  lucid_events
FROM dreamworld_talents 
WHERE dream_era = '1920s' 
  AND lucid_events IS NOT NULL 
  AND lucid_events != '[]'::jsonb;

-- 6. Location distribution
SELECT 
  current_location,
  COUNT(*) as talent_count,
  STRING_AGG(name, ', ') as talents_at_location
FROM dreamworld_talents 
WHERE dream_era = '1920s'
GROUP BY current_location
ORDER BY talent_count DESC;

-- 7. Career path distribution
SELECT 
  career_path,
  COUNT(*) as count,
  STRING_AGG(name, ', ') as talents
FROM dreamworld_talents 
WHERE dream_era = '1920s'
GROUP BY career_path
ORDER BY count DESC;