# Frontend Integration Guide

This guide shows how to integrate the FastAPI + GraphQL backend with your existing React/Next.js frontend.

## 🔗 API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:8000/graphql`
- **Authentication**: Required (Bearer token)
- **Playground**: `http://localhost:8000/graphql` (for testing queries)

### REST Endpoints
- **Fighters**: `GET http://localhost:8000/api/fighters`
- **Matches**: `GET http://localhost:8000/api/matches`
- **Health**: `GET http://localhost:8000/health`

## 🔐 Authentication

The GraphQL API requires authentication. Use the following token for development:

```javascript
const headers = {
  "Authorization": "Bearer dev-token",
  "Content-Type": "application/json"
};
```

## 📝 Example Frontend Integration

### 1. GraphQL Client Setup

Create a GraphQL client in your frontend:

```typescript
// lib/graphql-client.ts
import { createClient } from 'graphql-ws';
import { GraphQLClient } from 'graphql-request';

const GRAPHQL_URL = 'http://localhost:8000/graphql';

export const graphqlClient = new GraphQLClient(GRAPHQL_URL, {
  headers: {
    authorization: 'Bearer dev-token',
  },
});

// Example query
export const GET_FIGHTERS = `
  query GetFighters {
    getFighters {
      id
      name
      weightClass
      record
      nationality
      age
    }
  }
`;

// Example mutation
export const CREATE_FIGHTER = `
  mutation CreateFighter($name: String!, $weightClass: String!, $record: String!, $nationality: String, $age: Int) {
    createFighter(name: $name, weightClass: $weightClass, record: $record, nationality: $nationality, age: $age) {
      id
      name
      weightClass
      record
    }
  }
`;
```

### 2. React Hook for GraphQL

```typescript
// hooks/useGraphQL.ts
import { useState, useEffect } from 'react';
import { graphqlClient, GET_FIGHTERS } from '../lib/graphql-client';

export const useFighters = () => {
  const [fighters, setFighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFighters = async () => {
      try {
        const data = await graphqlClient.request(GET_FIGHTERS);
        setFighters(data.getFighters);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFighters();
  }, []);

  return { fighters, loading, error };
};
```

### 3. Component Integration

```typescript
// components/FightersList.tsx
import { useFighters } from '../hooks/useGraphQL';

export const FightersList = () => {
  const { fighters, loading, error } = useFighters();

  if (loading) return <div>Loading fighters...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Fighters</h2>
      {fighters.map(fighter => (
        <div key={fighter.id}>
          <h3>{fighter.name}</h3>
          <p>Weight Class: {fighter.weightClass}</p>
          <p>Record: {fighter.record}</p>
          <p>Nationality: {fighter.nationality}</p>
        </div>
      ))}
    </div>
  );
};
```

### 4. Mutation Example

```typescript
// components/CreateFighter.tsx
import { useState } from 'react';
import { graphqlClient, CREATE_FIGHTER } from '../lib/graphql-client';

export const CreateFighter = () => {
  const [formData, setFormData] = useState({
    name: '',
    weightClass: '',
    record: '',
    nationality: '',
    age: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const variables = {
        name: formData.name,
        weightClass: formData.weightClass,
        record: formData.record,
        nationality: formData.nationality || null,
        age: formData.age ? parseInt(formData.age) : null
      };

      const data = await graphqlClient.request(CREATE_FIGHTER, variables);
      console.log('Fighter created:', data.createFighter);
      
      // Reset form
      setFormData({ name: '', weightClass: '', record: '', nationality: '', age: '' });
    } catch (error) {
      console.error('Error creating fighter:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <input
        type="text"
        placeholder="Weight Class"
        value={formData.weightClass}
        onChange={(e) => setFormData({...formData, weightClass: e.target.value})}
      />
      <input
        type="text"
        placeholder="Record (e.g., 12-1-0)"
        value={formData.record}
        onChange={(e) => setFormData({...formData, record: e.target.value})}
      />
      <input
        type="text"
        placeholder="Nationality"
        value={formData.nationality}
        onChange={(e) => setFormData({...formData, nationality: e.target.value})}
      />
      <input
        type="number"
        placeholder="Age"
        value={formData.age}
        onChange={(e) => setFormData({...formData, age: e.target.value})}
      />
      <button type="submit">Create Fighter</button>
    </form>
  );
};
```

## 🔄 Integration with Existing Components

### Update your existing components to use GraphQL:

1. **Replace Supabase calls** with GraphQL queries
2. **Add authentication headers** to all GraphQL requests
3. **Update TypeScript types** to match GraphQL schema
4. **Handle loading and error states** properly

### Example: Updating MatchesTab

```typescript
// Tabs/MatchesTab.tsx (updated)
import { useState, useEffect } from 'react';
import { graphqlClient } from '../../lib/graphql-client';

const GET_MATCHES = `
  query GetMatches {
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
`;

export const MatchesTab = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await graphqlClient.request(GET_MATCHES);
        setMatches(data.getMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) return <div>Loading matches...</div>;

  return (
    <div>
      <h2>Matches</h2>
      {matches.map(match => (
        <div key={match.id}>
          <h3>{match.fighterA.name} vs {match.fighterB.name}</h3>
          <p>Venue: {match.venue}</p>
          <p>Date: {match.date}</p>
          {match.result && <p>Result: {match.result}</p>}
        </div>
      ))}
    </div>
  );
};
```

## 🚀 Next Steps

1. **Start the backend**: `python run_enhanced.py`
2. **Test the API**: `python test_enhanced.py`
3. **Update your frontend** to use the new GraphQL endpoints
4. **Add real Supabase authentication** to replace the dev token
5. **Implement real-time updates** using GraphQL subscriptions

## 🔧 Troubleshooting

- **CORS issues**: Make sure your backend allows your frontend domain
- **Authentication errors**: Verify the Bearer token is correct
- **GraphQL errors**: Check the GraphQL playground for query validation
- **Connection issues**: Ensure the backend is running on port 8000 