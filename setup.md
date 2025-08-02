# 🥊 Glory Boxing Manager - Setup Guide

## Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier works)

### 2. Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd glory-boxing-manager

# Install dependencies
npm install
```

### 3. Supabase Setup

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Wait for the project to be ready (usually 1-2 minutes)

#### Get Your Credentials
1. Go to your project dashboard
2. Navigate to Settings → API
3. Copy your Project URL and anon public key

#### Set Up Environment Variables
1. Copy `env.example` to `.env.local`
2. Replace the placeholder values with your actual Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Database Setup

#### Option A: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Push the database schema
supabase db push
```

#### Option B: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/001_create_enhanced_fighter_system.sql`
4. Paste and run the SQL in the editor

### 5. Start the Development Server
```bash
npm run dev
```

### 6. Open Your Browser
Navigate to `http://localhost:3000`

## 🎮 What You'll See

### Initial Game State
- **5 Legendary Fighters**: Carl Froch, Tony Bellew, Oleksandr Usyk, Dmitry Bivol, Jermell Charlo
- **Starting Money**: $10,000
- **Reputation**: 50
- **Game Week**: 1

### Available Features
1. **Dashboard**: Overview of your boxing empire
2. **Fighter Management**: Detailed fighter profiles with psychology
3. **Training Camps**: Plan comprehensive training programs
4. **Contract Negotiations**: Complex business deals
5. **Cut Scenes**: Interactive story events with consequences

## 🎯 First Steps

### 1. Explore Your Roster
- Click on any fighter to see their detailed profile
- Review their stats, psychology, and career stage
- Notice the different career stages: amateur, prospect, contender, champion, legend, retired

### 2. Try a Cut Scene
- Click the "Cut Scene" button on any fighter card
- Make choices and see how they affect fighter psychology
- Experience the branching storyline system

### 3. Plan a Training Camp
- Select a fighter and expand the Training Camp Manager
- Design a camp with specific focus areas
- Hire staff and see how it affects costs and improvement rates

### 4. Negotiate a Contract
- Click "Contract" on any fighter
- Set terms and see how they affect fighter satisfaction
- Experience the realistic negotiation system

## 🔧 Troubleshooting

### Common Issues

#### "Cannot connect to Supabase"
- Check your environment variables in `.env.local`
- Verify your Supabase project is active
- Ensure your anon key is correct

#### "Database tables not found"
- Run the database migration: `supabase db push`
- Or manually run the SQL in Supabase dashboard

#### "Build errors"
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

#### "Styling issues"
- Ensure Tailwind CSS is properly configured
- Check that `globals.css` is imported in `layout.tsx`

### Getting Help
- Check the browser console for error messages
- Verify all environment variables are set correctly
- Ensure Supabase project is properly configured

## 🚀 Next Steps

### Advanced Features to Explore
1. **Fighter Psychology Management**: Monitor and adjust mental states
2. **Training Camp Optimization**: Balance quality vs. cost
3. **Contract Strategy**: Different approaches for different career stages
4. **Story Development**: Create compelling narratives through cut scenes

### Customization Ideas
1. **Add New Fighters**: Insert custom fighters into the database
2. **Create New Cut Scenes**: Add branching storylines
3. **Modify Training Systems**: Adjust camp mechanics
4. **Enhance Business Logic**: Add new contract types or negotiation factors

## 🎉 You're Ready!

Your Glory Boxing Manager is now running! Start building your boxing empire and taking fighters from amateur to glory. Remember, every decision matters - from training intensity to contract negotiations, everything affects your fighters' psychology and career trajectory.

**Good luck, promoter!** 🥊👑 