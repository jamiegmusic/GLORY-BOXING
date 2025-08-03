# 🎭 Dreamworld 1920s Talents Seed Data

## Overview

Created seed data for 5 iconic 1920s figures with interconnected relationships and dream anomalies.

## 📁 Seed Files

1. **`supabase/seeds/dreamworld_talents_1920s.sql`** - Version with UUIDs for precise relationships
2. **`supabase/seeds/dreamworld_talents_1920s_simple.sql`** - Simple INSERT version

## 🌟 The 5 Talents

### 1. **Billie Holiday** - Singer
- **Primary Skill**: jazzSense: 98
- **Other Skills**: vocalControl (92), emotionalDepth (96), stagePresence (88)
- **Dream Anomaly**: "Sometimes sings lyrics from songs that won't be written for decades"
- **Location**: Harlem Jazz Club
- **Relationships**: 
  - Duke Ellington (collaborator)
  - Al Capone (patron)
  - Clara Bow (friend)

### 2. **Jack Dempsey** - Boxer
- **Primary Skill**: power: 96
- **Other Skills**: intimidation (94), endurance (92), crowdAppeal (90)
- **Dream Anomaly**: "Uses boxing combinations that haven't been invented yet"
- **Location**: Madison Square Garden
- **Relationships**:
  - Al Capone (business associate)
  - Clara Bow (admirer)
  - Duke Ellington (acquaintance)

### 3. **Clara Bow** - Actor
- **Primary Skill**: charisma: 94
- **Other Skills**: flirtation (96), modernStyle (93), screenPresence (92)
- **Dream Anomaly**: "Acts out scenes from movies that will be made in the future"
- **Location**: Hollywood Studio Lot
- **Relationships**:
  - Billie Holiday (friend)
  - Jack Dempsey (romantic interest)
  - Duke Ellington (party guest)
  - Al Capone (wary acquaintance)

### 4. **Al Capone** - Management
- **Primary Skill**: influence: 97
- **Other Skills**: intimidation (95), resourceControl (94), networking (93)
- **Dream Anomaly**: "Occasionally mentions business strategies from the digital age"
- **Location**: Chicago Headquarters
- **Relationships**:
  - Duke Ellington (business partner)
  - Billie Holiday (talent patron)
  - Jack Dempsey (investment)
  - Clara Bow (distant admirer)

### 5. **Duke Ellington** - Singer/Management
- **Primary Skill**: musicality: 95
- **Other Skills**: pianoMastery (94), composition (93), arrangement (92)
- **Dream Anomaly**: "Composes melodies that sound like they're from another dimension"
- **Location**: Cotton Club
- **Relationships**:
  - Billie Holiday (collaborator)
  - Al Capone (business partner)
  - Clara Bow (friend)
  - Jack Dempsey (acquaintance)

## 🚀 How to Seed

### Option 1: Using Supabase CLI
```bash
# Navigate to your project
cd your-project

# Run the seed file
supabase db seed -f supabase/seeds/dreamworld_talents_1920s_simple.sql
```

### Option 2: Via Supabase Dashboard
1. Open SQL Editor in Supabase Dashboard
2. Copy contents of `dreamworld_talents_1920s_simple.sql`
3. Run the query

### Option 3: Direct PostgreSQL
```bash
psql -h your-host -U postgres -d your-db -f supabase/seeds/dreamworld_talents_1920s_simple.sql
```

## 📊 Verify Seed Data

```sql
-- Check all 1920s talents
SELECT name, career_path, notoriety, dream_anomaly 
FROM dreamworld_talents 
WHERE dream_era = '1920s'
ORDER BY notoriety DESC;

-- View relationships
SELECT 
  name,
  relationships
FROM dreamworld_talents 
WHERE dream_era = '1920s';

-- Check specific skills
SELECT 
  name,
  era_specific_skills->>'jazzSense' as jazz_sense,
  era_specific_skills->>'power' as power,
  era_specific_skills->>'charisma' as charisma,
  era_specific_skills->>'influence' as influence,
  era_specific_skills->>'musicality' as musicality
FROM dreamworld_talents 
WHERE dream_era = '1920s';
```

## 🎮 Integration Notes

### Relationship Network
The talents form an interconnected web:
- **Capone** is central to the business side (patron/partner to many)
- **Duke & Billie** have a strong musical collaboration
- **Clara & Jack** have a romantic subplot
- **Everyone** has some connection to each other

### Dream Anomalies Theme
All anomalies reference "future knowledge":
- Musical futures (Billie, Duke)
- Fighting techniques (Jack)
- Cinema futures (Clara)
- Business strategies (Capone)

### Notoriety Rankings
1. Al Capone - 98 (most notorious)
2. Jack Dempsey - 95
3. Clara Bow - 91
4. Duke Ellington - 89
5. Billie Holiday - 87

## 🔄 Customization

To add more talents:
```sql
INSERT INTO dreamworld_talents (
  name, dream_era, career_path, era_specific_skills,
  dream_anomaly, notoriety, current_location, relationships, status
) VALUES (
  'Babe Ruth', '1920s', 'sports',
  '{"hitting": 99, "charisma": 90, "showmanship": 95}',
  'Predicts exact scores of future games',
  93, 'Yankee Stadium',
  '{"Jack Dempsey": "friend", "Al Capone": "drinking_buddy"}',
  'active'
);
```

---

Your 1920s dreamworld is now populated with legendary figures! 🌙✨