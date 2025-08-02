# 🥊 Glory Boxing Manager - FastAPI + GraphQL Backend

A simple but powerful FastAPI + GraphQL backend for your Glory Boxing Manager application.

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
python run_enhanced.py
```

### 2. Test the API
```bash
python test_enhanced.py
```

### 3. Visit the API Documentation
- **GraphQL Playground**: http://localhost:8000/graphql
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🔐 Authentication

The GraphQL API requires authentication. Use this token for development:
```
Bearer dev-token
```

## 📝 Example Queries

### Get All Fighters
```graphql
query {
  getFighters {
    id
    name
    weightClass
    record
    nationality
    age
  }
}
```

### Get All Matches
```graphql
query {
  getMatches {
    id
    fighterA {
      id
      name
      weightClass
    }
    fighterB {
      id
      name
      weightClass
    }
    venue
    date
    result
  }
}
```

### Create a Fighter
```graphql
mutation {
  createFighter(
    name: "Tyson Fury"
    weightClass: "Heavyweight"
    record: "33-0-1"
    nationality: "UK"
    age: 35
  ) {
    id
    name
    weightClass
    record
  }
}
```

### Schedule a Match
```graphql
mutation {
  scheduleMatch(
    fighterAId: 1
    fighterBId: 2
    venue: "O2 Arena"
    date: "2024-12-25"
  ) {
    id
    fighterA {
      name
    }
    fighterB {
      name
    }
    venue
    date
  }
}
```

## 🔗 Frontend Integration

Your frontend is now configured to use this GraphQL API. The `MatchesTab` component has been updated to fetch data from the backend instead of using hardcoded data.

### Key Files Updated:
- `glory-ui/src/lib/graphql-client.ts` - GraphQL client setup
- `glory-ui/src/hooks/useGraphQL.ts` - Custom hooks for data fetching
- `glory-ui/src/components/Tabs/MatchesTab.tsx` - Updated to use GraphQL

## 🎯 Next Steps

1. **Start both servers**:
   - Backend: `python run_enhanced.py` (port 8000)
   - Frontend: `pnpm dev` (port 3000)

2. **Test the integration**:
   - Visit http://localhost:3000
   - Go to the Matches tab
   - You should see real data from the GraphQL API

3. **Add more features**:
   - Real Supabase authentication
   - More GraphQL mutations
   - Real-time updates
   - Database persistence

## 🔧 Troubleshooting

### Backend not starting?
- Make sure you're in the `backend` directory
- Check that all dependencies are installed: `pip install -r requirements-minimal.txt`
- Verify Python 3.8+ is installed

### Frontend can't connect?
- Make sure the backend is running on port 8000
- Check the browser console for CORS errors
- Verify the GraphQL client URL is correct

### Authentication errors?
- Make sure you're using `Bearer dev-token` in the Authorization header
- Check that the token is being sent with GraphQL requests

## 📚 Available Endpoints

- **GraphQL**: `http://localhost:8000/graphql`
- **REST Fighters**: `http://localhost:8000/api/fighters`
- **REST Matches**: `http://localhost:8000/api/matches`
- **Health**: `http://localhost:8000/health`

## 🎉 Success!

Your Glory Boxing Manager now has a working FastAPI + GraphQL backend that integrates seamlessly with your React frontend! 