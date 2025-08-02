# Glory Boxing Manager FastAPI Backend

A comprehensive FastAPI + GraphQL backend for the Glory Boxing Manager system, providing professional boxing management capabilities with real-time data integration.

## 🚀 Features

- **FastAPI + GraphQL**: Modern API with GraphQL support using Strawberry
- **Supabase Integration**: Seamless integration with your existing Supabase database
- **REST & GraphQL APIs**: Dual API support for maximum flexibility
- **Real-time Data**: Live updates and real-time event system
- **Comprehensive Models**: Full support for fighters, matches, rankings, titles, and more
- **Health Monitoring**: Advanced fighter health tracking system
- **Press Conference System**: AI-powered press conference management
- **Venue Management**: Complete venue and promoter system
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling and logging
- **Documentation**: Auto-generated API documentation

## 📋 Prerequisites

- Python 3.8+
- Supabase project (already configured)
- Redis (optional, for caching)

## 🛠️ Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

## ⚙️ Configuration

Update the `.env` file with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yutwoddmzgntofygfdve.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key

# FastAPI Configuration
NODE_ENV=development
SECRET_KEY=your-secret-key-here

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379

# Optional: AI features
OPENAI_API_KEY=your_openai_api_key_here
```

## 🚀 Running the Server

### Development Mode
```bash
python run.py
```

### Production Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### With Auto-reload
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 API Documentation

Once the server is running, you can access:

- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc Documentation**: http://localhost:8000/redoc
- **GraphQL Playground**: http://localhost:8000/graphql

## 🔍 API Endpoints

### REST API Endpoints

#### Fighters
- `GET /api/fighters` - Get all fighters
- `GET /api/fighters/{id}` - Get specific fighter
- `POST /api/fighters` - Create new fighter

#### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/{id}` - Get specific match
- `POST /api/matches` - Create new match

#### Rankings
- `GET /api/rankings` - Get rankings
- `GET /api/rankings?weight_class=heavyweight` - Filter by weight class

#### Titles
- `GET /api/titles` - Get all titles

#### Venues
- `GET /api/venues` - Get all venues

#### Press Conferences
- `GET /api/press-conferences` - Get press conferences
- `POST /api/press-conferences` - Create press conference

#### Health Monitoring
- `GET /api/health-monitoring` - Get health data
- `POST /api/health-monitoring` - Create health record

### GraphQL Queries

#### Get All Fighters
```graphql
query {
  fighters(limit: 10, offset: 0) {
    id
    name
    age
    nationality
    weightClass
    stance
    promoter
    proRecord
    realWorldRanking
  }
}
```

#### Get Specific Fighter
```graphql
query {
  fighter(id: "fighter-id-here") {
    id
    name
    age
    nationality
    weightClass
    stance
    promoter
    amateurRecord
    proRecord
    aiPortraitUrl
    realWorldRanking
  }
}
```

#### Get Matches
```graphql
query {
  matches(limit: 10, offset: 0) {
    id
    fighterA
    fighterB
    venue
    scheduledRounds
    result
    winner
    titleFight
    fightDate
  }
}
```

#### Get Rankings
```graphql
query {
  rankings(weightClass: "heavyweight") {
    id
    weightClass
    rankPosition
    fighterId
    points
    realWorldRanking
    organization
    winStreak
  }
}
```

### GraphQL Mutations

#### Create Fighter
```graphql
mutation {
  createFighter(fighter: {
    name: "Tyson Fury"
    age: 35
    nationality: "UK"
    weightClass: "heavyweight"
    stance: "orthodox"
    promoter: "Top Rank"
    proRecord: "33-0-1"
  }) {
    id
    name
    age
    nationality
    weightClass
  }
}
```

#### Create Match
```graphql
mutation {
  createMatch(match: {
    fighterA: "fighter-a-id"
    fighterB: "fighter-b-id"
    venue: "O2 Arena"
    scheduledRounds: 12
    titleFight: true
    titleId: "title-id"
  }) {
    id
    fighterA
    fighterB
    venue
    scheduledRounds
    titleFight
  }
}
```

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── config.py          # Configuration settings
│   ├── database.py        # Supabase database integration
│   ├── models.py          # Pydantic models
│   ├── schema.py          # GraphQL schema
│   └── main.py           # FastAPI application
├── requirements.txt       # Python dependencies
├── run.py                # Startup script
├── env.example           # Environment variables template
└── README.md            # This file
```

## 🔧 Database Integration

The backend integrates seamlessly with your existing Supabase database using the enhanced schema from `supabase/migrations/002_unified_enhanced_system.sql`. It supports:

- **Fighters**: Complete fighter profiles with AI content
- **Matches**: Fight scheduling and results
- **Rankings**: Dynamic ranking system
- **Titles**: Championship management
- **Press Conferences**: AI-generated press events
- **Venues**: Venue and promoter management
- **Health Monitoring**: Fighter health tracking
- **Real-time Events**: Live updates system

## 🚀 Deployment

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp env.example .env
# Edit .env with your values

# Run the server
python run.py
```

### Production Deployment
```bash
# Install production dependencies
pip install -r requirements.txt

# Set production environment variables
export NODE_ENV=production
export SECRET_KEY=your-production-secret

# Run with gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 🔍 Health Check

Check if the API is running:
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "fighters_count": 5
}
```

## 📊 Monitoring

The API includes comprehensive logging and monitoring:

- **Request Logging**: All API requests are logged
- **Error Tracking**: Detailed error logging with stack traces
- **Database Monitoring**: Connection health checks
- **Performance Metrics**: Response time tracking

## 🔐 Security

- **CORS Protection**: Configured for your frontend domains
- **Input Validation**: Pydantic models ensure data integrity
- **Error Handling**: Secure error responses
- **Environment Variables**: Sensitive data kept in environment

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with your existing React/Next.js frontend:

1. **CORS Configuration**: Already configured for your frontend domains
2. **API Endpoints**: REST and GraphQL endpoints match your frontend expectations
3. **Data Models**: Consistent with your existing TypeScript interfaces
4. **Real-time Updates**: Supports your existing real-time features

## 🚀 Next Steps

1. **Start the server**: `python run.py`
2. **Test the API**: Visit http://localhost:8000/docs
3. **Integrate with frontend**: Update your frontend to use the new API endpoints
4. **Add authentication**: Implement JWT authentication if needed
5. **Scale up**: Add Redis for caching and background tasks

## 📞 Support

For issues or questions:
1. Check the API documentation at `/docs`
2. Review the logs for error details
3. Test the health endpoint at `/health`
4. Verify your Supabase configuration

---

**Glory Boxing Manager API** - Professional Boxing Management System 