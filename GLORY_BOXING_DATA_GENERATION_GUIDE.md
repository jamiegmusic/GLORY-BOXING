# Glory Boxing Manager - Data Generation Guide

This guide shows you how to generate realistic data for your Glory Boxing Manager application using the enhanced data generation system.

## 🚀 Quick Start

### 1. Generate Data and Populate Backend

```bash
# Navigate to backend directory
cd backend

# Run the data generator and populate backend
python data_loader.py
```

This will:
- Generate 100 fighters and 50 matches
- Export data to JSON and CSV files
- Populate your GraphQL backend
- Display a summary of the generated data

### 2. Start Your Backend

```bash
# Start the FastAPI server with populated data
uvicorn app:app --reload --port 8000
```

### 3. Test GraphQL Queries

Visit `http://localhost:8000/graphql` and test these queries:

```graphql
# Get all fighters
query {
  getFighters {
    id
    name
    weight_class
    record
    nationality
    age
    mugshot_url
    voice_profile
    ai_generated
  }
}

# Get all matches
query {
  getMatches {
    id
    fighter_a_id
    fighter_b_id
    venue
    date
    status
    title_fight
  }
}

# Get rankings
query {
  getRankings {
    id
    fighter_id
    organization
    weight_class
    rank
  }
}
```

## 📊 Data Generation Features

### 1. Realistic Fighter Data

The system generates fighters with:

- **Realistic Names**: Based on famous boxers and common names
- **Age Groups**: Junior (16-17), Amateur (18-21), Pro (22-35), Veteran (36-45)
- **Weight Classes**: All 15 official boxing weight classes
- **Nationalities**: 23 countries with strong boxing traditions
- **Records**: Realistic win-loss-draw records based on age and experience
- **AI Content**: Mugshots and voice profiles with AI generation flags

### 2. Comprehensive Match Data

Matches include:

- **Realistic Venues**: Famous boxing venues worldwide
- **Date Ranges**: Past and future matches
- **Status Tracking**: Completed vs scheduled matches
- **Results**: KO, TKO, UD, SD, MD, DQ for completed matches
- **Title Fights**: Championship bout flags
- **Scorecards**: Detailed fight results

### 3. Championship System

- **Multiple Organizations**: WBC, WBA, IBF, WBO, The Ring, Lineal
- **Weight Class Champions**: Each weight class has champions
- **Ranking System**: Realistic rankings for all fighters

### 4. Press Conference System

- **Media Questions**: Realistic press conference questions
- **AI Generated Quotes**: Simulated fighter quotes
- **Sentiment Analysis**: Public reaction scores
- **Transcripts**: Press conference transcripts

## 🔧 Customization Options

### 1. Adjust Data Volume

```python
# In data_loader.py, modify these parameters:
generate_and_populate(num_fighters=200, num_matches=100)
```

### 2. Custom Fighter Generation

```python
# In data_generator.py, modify these lists:
first_names = ["Your", "Custom", "Names", "Here"]
last_names = ["Your", "Custom", "Surnames", "Here"]
nationalities = ["Your", "Preferred", "Countries"]
```

### 3. Custom Venues

```python
# Add your preferred venues:
venues = [
    "Your Custom Arena, City",
    "Another Venue, Location"
]
```

## 📈 Data Export Options

### 1. JSON Export

```python
# Export to JSON for API consumption
export_to_json(data, "custom_glory_data.json")
```

### 2. CSV Export

```python
# Export to CSV for analysis
export_to_csv(data, "custom_prefix")
```

### 3. Database Integration

```python
# For Supabase integration, you can modify the data loader:
def export_to_supabase(data):
    # Upload to Supabase tables
    pass
```

## 🎯 Advanced Usage

### 1. Generate Specific Data Types

```python
from data_generator import generate_fighter_data, generate_matches_data

# Generate only fighters
fighters = generate_fighter_data(50)

# Generate only matches
matches = generate_matches_data(fighters, 25)
```

### 2. Custom AI Content Generation

```python
def custom_ai_content(fighter_id, name):
    return {
        "mugshot_url": f"https://your-ai-service.com/{fighter_id}.png",
        "voice_profile": "custom_voice_type",
        "ai_generated": True
    }
```

### 3. Realistic Record Generation

```python
def custom_record_generation(age, division):
    # Your custom logic for realistic records
    if division == "Pro":
        wins = random.randint(10, 40)
        losses = random.randint(0, 8)
        draws = random.randint(0, 3)
    return f"{wins}-{losses}-{draws}"
```

## 🔄 Integration with Frontend

### 1. Apollo Client Setup

```typescript
// glory-ui/src/lib/apolloClient.ts
const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});
```

### 2. Test with Enhanced Components

```typescript
// Test the CreateFighterTabEnhanced with real data
import CreateFighterTabEnhanced from './components/Tabs/CreateFighterTabEnhanced';

// The component will now show realistic fighter data
```

### 3. Rankings Display

```typescript
// Test RankingsTabEnhanced with populated rankings
import RankingsTabEnhanced from './components/Tabs/RankingsTabEnhanced';

// Will display realistic ranking data
```

## 📊 Data Analysis

### 1. Weight Class Distribution

```python
# Analyze weight class distribution
weight_class_counts = {}
for fighter in fighters:
    weight_class = fighter["weight_class"]
    weight_class_counts[weight_class] = weight_class_counts.get(weight_class, 0) + 1

for weight_class, count in sorted(weight_class_counts.items()):
    print(f"{weight_class}: {count} fighters")
```

### 2. Nationality Analysis

```python
# Analyze nationality distribution
nationality_counts = {}
for fighter in fighters:
    nationality = fighter["nationality"]
    nationality_counts[nationality] = nationality_counts.get(nationality, 0) + 1
```

### 3. Match Statistics

```python
# Analyze match data
completed_matches = [m for m in matches if m["status"] == "completed"]
scheduled_matches = [m for m in matches if m["status"] == "scheduled"]
title_fights = [m for m in matches if m["title_fight"]]

print(f"Completed: {len(completed_matches)}")
print(f"Scheduled: {len(scheduled_matches)}")
print(f"Title Fights: {len(title_fights)}")
```

## 🚀 Production Deployment

### 1. Database Migration

For production, migrate from in-memory to Supabase:

```python
# Create Supabase tables
CREATE TABLE fighters (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    weight_class TEXT NOT NULL,
    record TEXT DEFAULT '0-0-0',
    nationality TEXT,
    age INTEGER,
    mugshot_url TEXT,
    voice_profile TEXT,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Data Seeding

```python
# Seed production database
def seed_production_database():
    data = generate_complete_dataset(1000, 500)
    # Upload to Supabase
    pass
```

### 3. Real AI Integration

```python
# Replace mock AI with real services
def generate_real_ai_mugshot(fighter_name, style):
    # Call OpenAI DALL-E or Stability AI
    pass

def generate_real_ai_voice(fighter_name, voice_type):
    # Call ElevenLabs or similar
    pass
```

## 🧪 Testing Your Data

### 1. GraphQL Playground Tests

```graphql
# Test fighter queries
query GetFighter($id: Int!) {
  getFighter(fighterId: $id) {
    name
    weight_class
    record
    ai_generated
  }
}

# Test AI generation
mutation GenerateMugshot($fighterId: Int!) {
  generateAiMugshot(fighterId: $fighterId, style: "professional") {
    success
    mugshot_url
  }
}
```

### 2. Frontend Component Tests

```typescript
// Test with real data
const { fighters, loading } = useGetFighters();
const { createFighter } = useCreateFighter();

// Should work with populated backend
```

### 3. Performance Testing

```python
# Test with large datasets
generate_and_populate(num_fighters=1000, num_matches=500)
```

## 📋 Sample Generated Data

### Fighter Example:
```json
{
  "id": 1,
  "name": "Miguel Alvarez",
  "age": 28,
  "division": "Pro",
  "weight_class": "Welterweight",
  "nationality": "Mexico",
  "record": "25-3-1",
  "mugshot_url": "https://api.fakeimages.com/fighters/uuid_professional.png",
  "voice_profile": "deep_aggressive",
  "ai_generated": true,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Match Example:
```json
{
  "id": 1,
  "fighter_a_id": 1,
  "fighter_b_id": 2,
  "venue": "MGM Grand Garden Arena, Las Vegas",
  "date": "2024-02-15T20:00:00Z",
  "result": "KO",
  "scorecard": "{\"rounds\": 8, \"method\": \"KO\", \"judges\": [\"Judge 1\", \"Judge 2\", \"Judge 3\"]}",
  "scheduled_rounds": 12,
  "title_fight": true,
  "status": "completed",
  "created_at": "2024-01-15T10:30:00Z"
}
```

## 🎯 Next Steps

1. **Run the data generator**: `python data_loader.py`
2. **Start your backend**: `uvicorn app:app --reload --port 8000`
3. **Test GraphQL queries**: Visit the playground
4. **Connect frontend**: Update Apollo Client
5. **Test components**: Use the enhanced React components
6. **Customize data**: Modify generation parameters
7. **Deploy to production**: Migrate to Supabase

Your Glory Boxing Manager is now ready with realistic, comprehensive data! 🥊✨ 