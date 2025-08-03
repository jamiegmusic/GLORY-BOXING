# 🚀 Dreamworld Tables - Quick Start Guide

## Migration Files Created

I've created the three Supabase tables you requested with comprehensive migrations:

### 📁 Migration Files

1. **`009_dreamworld_core_tables_clean.sql`** - The three core tables
2. **`010_dreamworld_sample_data.sql`** - Sample data to get started

## 🗄️ The Three Tables

### 1. **dreamworld_talents**
- Historical entertainment figures (Louis Armstrong, Jack Dempsey, etc.)
- Era-specific skills in JSONB format
- Dream anomalies (surreal abilities)
- Relationships tracking

### 2. **dream_events** 
- 5 dream types: prophecy, warning, inspiration, nightmare, vision
- Impact scores (0-100)
- Actionable insights for players
- Career path connections

### 3. **dreamworld_player_state**
- Player progress tracking
- Lucid meter (0-100)
- Wellness meter (0-100)
- Reality glitches array
- Wake-up conditions

## ⚡ Quick Setup

### Option 1: Supabase CLI
```bash
# Apply the tables migration
supabase db push 009_dreamworld_core_tables_clean.sql

# Add sample data
supabase db push 010_dreamworld_sample_data.sql
```

### Option 2: Supabase Dashboard
1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of `009_dreamworld_core_tables_clean.sql`
3. Run the query
4. Optionally run `010_dreamworld_sample_data.sql` for sample data

### Option 3: Direct Connection
```bash
# Using psql
psql -h your-db-host -U postgres -d your-db-name -f supabase/migrations/009_dreamworld_core_tables_clean.sql
```

## 🔍 Verify Tables

```sql
-- Check tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'dream%';

-- Check sample data
SELECT COUNT(*) as talent_count FROM dreamworld_talents;
SELECT COUNT(*) as event_count FROM dream_events;
```

## 💡 Key Features

- **UUID Primary Keys** - Auto-generated unique IDs
- **JSONB Fields** - Flexible data storage for skills, relationships, glitches
- **Check Constraints** - Ensures data validity (meters 0-100, levels 1-10)
- **Indexes** - Optimized queries on era, career path, player_id
- **Enum Validation** - Dream types restricted to valid values
- **Timestamps** - Automatic created_at tracking

## 🎮 Integration Ready

These tables are designed to work with:
- The Zustand store (`src/stores/dreamworldStore.ts`)
- The Dream Event Generator (`src/lib/dreamworld/DreamEventGenerator.ts`)
- All UI components in the dreamworld system

## 📚 Full Documentation

- **Complete Guide**: See `DREAMWORLD_TABLES_GUIDE.md`
- **Integration Patterns**: See `DREAMWORLD_INTEGRATION_GUIDE.md`
- **UI Components**: See `DREAMWORLD_DASHBOARD_README.md`

---

Your dreamworld tables are ready to power surreal 1920s dream adventures! 🌙✨