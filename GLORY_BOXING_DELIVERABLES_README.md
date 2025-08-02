# Glory Boxing Manager - Integration Deliverables

This document provides the three core deliverables for integrating Supabase database, Apollo GraphQL mutations, and React UI components for the Glory Boxing Manager application.

## 📋 Table of Contents

1. [Supabase SQL Migration File](#1-supabase-sql-migration-file)
2. [Apollo GraphQL Hook Examples](#2-apollo-graphql-hook-examples)
3. [ShadCN Form Components](#3-shadcn-form-components)
4. [Usage Instructions](#usage-instructions)
5. [Technical Specifications](#technical-specifications)

---

## 1. Supabase SQL Migration File

**File:** `supabase/migrations/004_boxing_management_core.sql`

### Overview
Complete database schema migration for the boxing management system with all required tables, relationships, indexes, and security policies.

### Key Features
- **Core Tables**: fighters, matches, press_conferences, titles, rankings, venues, promoters, press_questions
- **Row Level Security (RLS)**: Proper authentication policies for all tables
- **Performance Indexes**: Optimized queries with strategic indexing
- **Automatic Triggers**: Fighter record updates, timestamp management
- **Sample Data**: Pre-populated venues, promoters, and titles
- **Full-text Search**: Name-based search capabilities

### Database Schema

#### Core Tables
```sql
-- Fighters with comprehensive stats
CREATE TABLE fighters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    weight_class VARCHAR(50) NOT NULL,
    record_wins INTEGER DEFAULT 0,
    record_losses INTEGER DEFAULT 0,
    record_draws INTEGER DEFAULT 0,
    nationality VARCHAR(100),
    age INTEGER,
    mugshot_url VARCHAR(500),
    -- Additional fields...
);

-- Matches with fight details
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fighter_a_id UUID REFERENCES fighters(id),
    fighter_b_id UUID REFERENCES fighters(id),
    venue VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    result VARCHAR(50),
    scorecard JSONB DEFAULT '{}',
    -- Additional fields...
);

-- Press conferences with AI content
CREATE TABLE press_conferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id),
    questions JSONB DEFAULT '[]',
    transcript TEXT,
    -- Additional fields...
);
```

### Security Features
- **RLS Policies**: Public read access, authenticated write access
- **Foreign Key Constraints**: Proper referential integrity
- **UUID Primary Keys**: Secure, non-sequential identifiers
- **Automatic Timestamps**: Created/updated tracking

---

## 2. Apollo GraphQL Hook Examples

**File:** `glory-ui/src/hooks/useApolloMutations.ts`

### Overview
TypeScript React hooks using @apollo/client for GraphQL mutations and queries with comprehensive error handling and form validation.

### Key Features
- **Mutation Hooks**: useCreateFighter, useScheduleMatch, useSubmitPressQuestion
- **Query Hooks**: useGetFighters, useGetMatches, useGetPressConferences
- **Form State Management**: useFormState hook for form handling
- **Validation Utilities**: Input validation functions
- **Error Handling**: Comprehensive error management
- **TypeScript Types**: Full type safety

### Available Hooks

#### Mutation Hooks
```typescript
// Create new fighter
const { createFighter, loading, error } = useCreateFighter();

// Schedule new match
const { scheduleMatch, loading, error } = useScheduleMatch();

// Submit press question
const { submitPressQuestion, loading, error } = useSubmitPressQuestion();
```

#### Query Hooks
```typescript
// Fetch fighters
const { fighters, loading, error, refetch } = useGetFighters();

// Fetch matches
const { matches, loading, error, refetch } = useGetMatches();

// Fetch press conferences
const { pressConferences, loading, error, refetch } = useGetPressConferences();
```

#### Form State Management
```typescript
const { formData, errors, updateField, setFieldError, clearErrors, resetForm } = useFormState({
  fighter_a_id: '',
  fighter_b_id: '',
  venue: '',
  date: '',
  // ... other fields
});
```

### Validation Functions
```typescript
// Validate fighter input
const fighterErrors = validateFighterInput(input);

// Validate match input
const matchErrors = validateMatchInput(input);

// Validate press question input
const questionErrors = validatePressQuestionInput(input);
```

---

## 3. ShadCN Form Components

### ScheduleTabEnhanced Component
**File:** `glory-ui/src/components/Tabs/ScheduleTabEnhanced.tsx`

#### Features
- **Fighter Selection**: Dropdown with fighter records
- **Date Picker**: Calendar component for match scheduling
- **Venue Input**: Text input for venue selection
- **Match Details**: Rounds, title fight toggle
- **Form Validation**: Real-time validation with error display
- **Upcoming Matches**: Side panel showing recent schedules
- **Loading States**: Proper loading indicators
- **Error Handling**: User-friendly error messages

#### Key Components Used
- `Card`, `CardHeader`, `CardContent` - Layout structure
- `Select` - Fighter dropdowns
- `Calendar` - Date picker
- `Switch` - Title fight toggle
- `Button` - Submit actions
- `Badge` - Status indicators

### PressTabEnhanced Component
**File:** `glory-ui/src/components/Tabs/PressTabEnhanced.tsx`

#### Features
- **Tabbed Interface**: Submit questions and view conferences
- **Press Conference Selection**: Dropdown with match details
- **Question Input**: Rich textarea with character count
- **Category Selection**: Question categorization
- **Importance Levels**: Priority setting
- **Recent Conferences**: View past press conferences
- **Transcript Display**: Show conference transcripts
- **Highlights & Controversies**: Display key moments

#### Key Components Used
- `Tabs`, `TabsContent`, `TabsList` - Tab navigation
- `Textarea` - Question input
- `Select` - Category and importance selection
- `Avatar` - User avatars
- `ScrollArea` - Scrollable content
- `Badge` - Status indicators

---

## Usage Instructions

### 1. Database Setup
```bash
# Apply the migration to your Supabase project
supabase db push

# Or manually run the SQL file
psql -h your-project.supabase.co -U postgres -d postgres -f supabase/migrations/004_boxing_management_core.sql
```

### 2. Apollo Client Setup
```typescript
// Ensure Apollo Client is configured in your app
import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apolloClient';

function App() {
  return (
    <ApolloProvider client={client}>
      {/* Your app components */}
    </ApolloProvider>
  );
}
```

### 3. Component Integration
```typescript
// Import and use the enhanced components
import ScheduleTabEnhanced from './components/Tabs/ScheduleTabEnhanced';
import PressTabEnhanced from './components/Tabs/PressTabEnhanced';

// Use in your app
<ScheduleTabEnhanced />
<PressTabEnhanced />
```

### 4. Hook Usage
```typescript
// Import hooks
import { 
  useCreateFighter, 
  useScheduleMatch, 
  useSubmitPressQuestion,
  useFormState,
  validateMatchInput 
} from './hooks/useApolloMutations';

// Use in components
const { createFighter, loading, error } = useCreateFighter();
const { formData, updateField } = useFormState(initialState);
```

---

## Technical Specifications

### Prerequisites
- **Node.js**: 18+ 
- **pnpm**: Package manager
- **Supabase**: Database and authentication
- **Apollo Client**: GraphQL client
- **ShadCN UI**: Component library
- **TailwindCSS**: Styling
- **TypeScript**: Type safety

### Dependencies
```json
{
  "@apollo/client": "^3.8.0",
  "graphql": "^16.8.0",
  "date-fns": "^2.30.0",
  "lucide-react": "^0.294.0",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-tabs": "^1.0.0",
  "@radix-ui/react-popover": "^1.0.0",
  "@radix-ui/react-switch": "^1.0.0"
}
```

### File Structure
```
glory-ui/
├── src/
│   ├── hooks/
│   │   └── useApolloMutations.ts
│   ├── components/
│   │   └── Tabs/
│   │       ├── ScheduleTabEnhanced.tsx
│   │       └── PressTabEnhanced.tsx
│   └── lib/
│       └── unified-types.ts
supabase/
└── migrations/
    └── 004_boxing_management_core.sql
```

### Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Apollo GraphQL
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
```

---

## Production Considerations

### Security
- All database operations use RLS policies
- GraphQL mutations require authentication
- Input validation on both client and server
- Proper error handling without exposing internals

### Performance
- Database indexes for common queries
- Apollo Client caching strategies
- Optimistic UI updates
- Lazy loading for large datasets

### Accessibility
- ARIA labels on all form inputs
- Keyboard navigation support
- Screen reader compatibility
- Focus management

### Testing
- Unit tests for hooks and validation
- Integration tests for form submissions
- E2E tests for user workflows
- Database migration testing

---

## Support & Maintenance

### Common Issues
1. **GraphQL Connection**: Ensure endpoint is accessible
2. **Authentication**: Check Supabase token validity
3. **Form Validation**: Verify input types match schema
4. **Database Migrations**: Run migrations in order

### Debugging
- Apollo Client DevTools for GraphQL debugging
- Supabase Dashboard for database inspection
- Browser DevTools for component debugging
- Network tab for API request monitoring

### Updates
- Regular dependency updates
- Security patches
- Feature enhancements
- Performance optimizations

---

This comprehensive integration provides a solid foundation for the Glory Boxing Manager application with modern React patterns, type safety, and professional UI components. 