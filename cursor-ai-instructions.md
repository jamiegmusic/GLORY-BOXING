# Glory Boxing Manager - Cursor AI Instructions

## Project Overview
This is a multi-industry management simulation game project called "Glory Boxing Manager" - a comprehensive boxing management simulation with AI-powered features, real-time match simulation, and professional UI design inspired by Football Manager.

## Tech Stack
- **Frontend**: React, TailwindCSS, and ShadCN UI components
- **Backend**: GraphQL API (Strawberry) wrapped with FastAPI
- **Authentication**: Secured via Supabase tokens
- **Database**: Supabase with Realtime API and Edge Functions
- **AI Runtime**: GPT via OpenRouter or OpenAI SDKs
- **Package Manager**: pnpm for dependency management and build commands
- **State Management**: Zustand for game state management
- **Real-time**: Supabase Realtime subscriptions for live updates

## Database Schema
Use Supabase tables with proper foreign keys and RLS policies:
- `fighters` (stats, portraits, voice_profile, health monitoring)
- `matches` (results, commentary_audio, round-by-round data)
- `events` (fight cards, venues, promoters)
- `press_conferences` (AI-generated content, audio)
- `rankings` (international rankings, official records)
- `titles` (championship belts, sanctioning bodies)
- `training_camps` (fighter development, skill progression)
- `contracts` (promotional agreements, financial terms)
- `injuries` (health monitoring, medical clearance)
- `analytics_events` (performance metrics, game analytics)

## Development Guidelines

### Component Architecture
- Use clean modular component logic per tab:
  - `ScheduleTab` - Fight scheduling and event management
  - `RankingsTab` - International rankings and official records
  - `FightersTab` - Fighter management and development
  - `MatchesTab` - Match results and fight simulation
  - `PressTab` - Media coverage and press conferences
  - `TitlesTab` - Championship management
  - `SettingsTab` - Game configuration
- Apply cinematic transitions throughout the UI
- Maintain consistent styling with TailwindCSS and ShadCN components
- Follow Football Manager-inspired professional UI design

### Data Layer
- Connect all forms via ApolloClient to GraphQL mutations
- Ensure proper error handling and loading states
- Implement real-time updates using Supabase Realtime API
- Use Zustand for centralized game state management
- Store media (audio/images) in Supabase Storage

### Code Organization
- Keep components modular and reusable
- Use TypeScript for type safety (see `unified-types.ts`)
- Follow React best practices and hooks patterns
- Implement proper state management with Zustand
- Use Supabase Edge Functions for AI integrations

### UI/UX Standards
- Apply cinematic transitions and animations
- Use ShadCN UI components for consistency
- Ensure responsive design with TailwindCSS
- Maintain professional boxing management theme
- Style like Football Manager: professional and slick
- Implement real-time updates for match results

## AI-Powered Features Integration
- **Voice Generation**: AI-generated fighter voices and commentary
- **Portrait Creation**: Dynamic fighter portraits and promotional materials
- **Match Commentary**: Real-time AI commentary during fights
- **Press Conferences**: AI-generated press interactions
- **Fight Predictions**: AI-powered match outcome analysis
- **Personality Traits**: Dynamic fighter personality development

## Key Integration Points
- Supabase authentication flow with proper RLS policies
- GraphQL schema alignment with database tables
- Real-time data synchronization for live match updates
- AI-powered features integration via Supabase Edge Functions
- Media storage and retrieval from Supabase Storage
- Cross-platform state management with Zustand
- Professional UI/UX following Football Manager design patterns

## Advanced Features
- **Fight Simulation**: Round-by-round combat engine with real-time commentary
- **Health Monitoring**: Injury tracking and medical clearance systems
- **Training Camps**: Skill development and fighter progression
- **Business Management**: Contract negotiations and financial modeling
- **International Rankings**: Real-world ranking system integration
- **Multiplayer Features**: Social features and tournament management
- **Analytics Dashboard**: Advanced performance metrics and analytics
- **Cut Scenes**: Interactive narrative elements and decision points

## Code Patterns
- Use Supabase Edge Functions for AI integrations
- Store media (audio/images) in Supabase Storage
- Use Zustand for game state management
- Implement real-time updates for match results
- Follow ShadCN component patterns for UI
- Use TypeScript interfaces from `unified-types.ts`
- Implement proper error handling and loading states
- Follow React hooks patterns and best practices
