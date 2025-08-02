# Glory Boxing Manager - Complete Integration Guide

This guide provides step-by-step instructions for integrating all components of the Glory Boxing Manager application with your FastAPI/Strawberry GraphQL backend.

## 🚀 Quick Start

### 1. Backend Setup

First, ensure your FastAPI backend is running with the enhanced schema:

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install fastapi strawberry-graphql uvicorn

# Run the server
uvicorn app:app --reload --port 8000
```

Your backend should now be running at `http://localhost:8000` with GraphQL endpoint at `http://localhost:8000/graphql`.

### 2. Frontend Integration

Update your Apollo Client configuration to connect to the backend:

```typescript
// glory-ui/src/lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Add your Supabase token here
  const token = localStorage.getItem('supabase-token') || 'dev-token';
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
```

## 📋 Component Integration

### 1. Main App Integration

Update your main App component to use the enhanced components:

```typescript
// glory-ui/src/App.tsx
import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apolloClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Import enhanced components
import CreateFighterTabEnhanced from './components/Tabs/CreateFighterTabEnhanced';
import ScheduleTabEnhanced from './components/Tabs/ScheduleTabEnhanced';
import PressTabEnhanced from './components/Tabs/PressTabEnhanced';
import RankingsTabEnhanced from './components/Tabs/RankingsTabEnhanced';

function App() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Glory Boxing Manager
            </h1>
            <p className="text-gray-600">
              Professional boxing management with AI-powered features
            </p>
          </div>

          {/* Main Content */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Fighter Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="create" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create Fighter
                  </TabsTrigger>
                  <TabsTrigger value="schedule" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Match
                  </TabsTrigger>
                  <TabsTrigger value="rankings" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Rankings
                  </TabsTrigger>
                  <TabsTrigger value="press" className="flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Press
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="mt-6">
                  <CreateFighterTabEnhanced />
                </TabsContent>

                <TabsContent value="schedule" className="mt-6">
                  <ScheduleTabEnhanced />
                </TabsContent>

                <TabsContent value="rankings" className="mt-6">
                  <RankingsTabEnhanced />
                </TabsContent>

                <TabsContent value="press" className="mt-6">
                  <PressTabEnhanced />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
```

### 2. Environment Configuration

Create environment variables for your application:

```env
# .env.local
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Package Dependencies

Ensure you have all required dependencies:

```json
{
  "dependencies": {
    "@apollo/client": "^3.8.0",
    "graphql": "^16.8.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0",
    "date-fns": "^2.30.0",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-popover": "^1.0.0",
    "@radix-ui/react-switch": "^1.0.0",
    "@radix-ui/react-avatar": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

## 🔧 AI Integration Features

### 1. AI Mugshot Generation

The enhanced CreateFighter component includes AI mugshot generation:

```typescript
// Example usage in CreateFighterTabEnhanced
const handleGenerateAiMugshot = async () => {
  const result = await generateAiMugshot({
    fighterId: fighters.length + 1,
    style: 'professional'
  });

  if (result.success && result.data?.success) {
    setImagePreview(result.data.mugshot_url || '');
    updateField('mugshot_url', result.data.mugshot_url || '');
  }
};
```

### 2. AI Voice Generation

Generate voice profiles for fighters:

```typescript
// Example usage
const handleGenerateAiVoice = async () => {
  const result = await generateAiVoice({
    fighterId: fighters.length + 1,
    voiceType: 'deep_aggressive'
  });

  if (result.success && result.data?.success) {
    updateField('voice_profile', result.data.voice_profile || '');
  }
};
```

## 🎨 UI/UX Features

### 1. Cinematic Animations

Apply animations to your components:

```typescript
// Add animation classes to components
<div className="fade-slide-enter fade-slide-enter-active">
  <CreateFighterTabEnhanced />
</div>

// Use hover effects
<Card className="card-hover">
  <Button className="btn-hover">
    Submit
  </Button>
</Card>
```

### 2. Professional Styling

The components use Football Manager-inspired design:

- Professional color scheme
- Clean typography
- Consistent spacing
- Responsive design
- Loading states and error handling

## 🔄 Real-time Features

### 1. Live Data Updates

The Apollo hooks automatically refetch data when mutations occur:

```typescript
// Hooks automatically update the UI
const { createFighter } = useCreateFighter();
const { fighters } = useGetFighters(); // Updates automatically after createFighter
```

### 2. Optimistic Updates

For better UX, you can implement optimistic updates:

```typescript
const [createFighter] = useMutation(CREATE_FIGHTER, {
  update: (cache, { data }) => {
    // Optimistically update the cache
    const existingFighters = cache.readQuery({ query: GET_FIGHTERS });
    if (existingFighters && data?.createFighter) {
      cache.writeQuery({
        query: GET_FIGHTERS,
        data: {
          getFighters: [...existingFighters.getFighters, data.createFighter]
        }
      });
    }
  }
});
```

## 🧪 Testing Your Integration

### 1. Test GraphQL Queries

Use the GraphQL playground at `http://localhost:8000/graphql`:

```graphql
# Test query
query {
  getFighters {
    id
    name
    weight_class
    record
    mugshot_url
    voice_profile
    ai_generated
  }
}

# Test mutation
mutation {
  createFighter(
    name: "Test Fighter"
    weight_class: "Heavyweight"
    record: "0-0-0"
    nationality: "USA"
    age: 25
  ) {
    id
    name
    weight_class
  }
}
```

### 2. Test AI Generation

```graphql
# Test AI mugshot generation
mutation {
  generateAiMugshot(fighterId: 1, style: "professional") {
    success
    mugshot_url
    error_message
  }
}

# Test AI voice generation
mutation {
  generateAiVoice(fighterId: 1, voiceType: "deep_aggressive") {
    success
    voice_profile
    error_message
  }
}
```

## 🚀 Production Deployment

### 1. Backend Deployment

Deploy your FastAPI backend:

```bash
# Using Docker
docker build -t glory-boxing-backend .
docker run -p 8000:8000 glory-boxing-backend

# Using Railway/Heroku
railway up
```

### 2. Frontend Deployment

Deploy your React application:

```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
vercel --prod
```

### 3. Environment Variables

Set production environment variables:

```env
# Production
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-backend.railway.app/graphql
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

## 🔧 Advanced Features

### 1. Supabase Integration

For full Supabase integration, add authentication:

```typescript
// glory-ui/src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 2. Real-time Subscriptions

Add real-time updates with Supabase:

```typescript
// Subscribe to fighter changes
const subscription = supabase
  .channel('fighters')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'fighters' },
    (payload) => {
      // Update Apollo cache
      client.refetchQueries({ include: ['GetFighters'] });
    }
  )
  .subscribe();
```

### 3. File Upload to Supabase Storage

For real mugshot uploads:

```typescript
const uploadMugshot = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('mugshots')
    .upload(`${Date.now()}-${file.name}`, file);
  
  if (data) {
    const { data: urlData } = supabase.storage
      .from('mugshots')
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  }
  
  throw error;
};
```

## 📊 Performance Optimization

### 1. Apollo Client Optimization

```typescript
// Optimize Apollo Client
const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getFighters: {
            merge: false, // Don't merge, replace
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
```

### 2. Component Optimization

```typescript
// Memoize expensive components
const MemoizedRankingsTab = React.memo(RankingsTabEnhanced);

// Use React.lazy for code splitting
const CreateFighterTab = React.lazy(() => import('./components/Tabs/CreateFighterTabEnhanced'));
```

## 🎯 Next Steps

1. **Implement Real AI Services**: Replace mock AI generation with actual AI services (OpenAI, Stability AI, etc.)
2. **Add Authentication**: Implement Supabase Auth for user management
3. **Database Migration**: Move from in-memory data to Supabase PostgreSQL
4. **Real-time Features**: Add WebSocket connections for live updates
5. **Advanced Analytics**: Implement fight statistics and analytics
6. **Mobile App**: Create React Native version for mobile devices

## 🆘 Troubleshooting

### Common Issues

1. **GraphQL Connection Error**
   - Check if backend is running on port 8000
   - Verify CORS settings in FastAPI
   - Check network connectivity

2. **Authentication Errors**
   - Ensure Supabase token is valid
   - Check authorization headers
   - Verify RLS policies

3. **Component Not Rendering**
   - Check Apollo Client setup
   - Verify component imports
   - Check for TypeScript errors

4. **AI Generation Failing**
   - Verify AI service endpoints
   - Check API keys and quotas
   - Review error logs

### Debug Tools

- **Apollo Client DevTools**: Browser extension for GraphQL debugging
- **Network Tab**: Monitor API requests
- **Console Logs**: Check for JavaScript errors
- **GraphQL Playground**: Test queries directly

This integration guide provides everything you need to get the Glory Boxing Manager running with all features enabled! 