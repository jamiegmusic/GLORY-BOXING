# Implementation Setup Guide - Advanced Features

This guide provides step-by-step instructions for implementing all advanced features in your sports commentary AI application.

## Prerequisites

Before implementing these features, ensure you have:

- Node.js 18+ installed
- A Supabase project set up
- Redis instance (for rate limiting)
- Sentry account (for monitoring)
- Vercel account (for analytics)

## 1. Performance Monitoring Setup

### Step 1: Install Sentry Dependencies

```bash
npm install @sentry/nextjs
```

### Step 2: Configure Sentry

Create `sentry.client.config.ts`:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'your-domain.com'],
    }),
  ],
});
```

Create `sentry.server.config.ts`:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Step 3: Add Environment Variables

```env
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_DSN=your_sentry_dsn
```

### Step 4: Initialize Monitoring in Your App

```typescript
// app/layout.tsx
import { initSentry } from '@/lib/monitoring/sentry';

if (process.env.NODE_ENV === 'production') {
  initSentry();
}
```

## 2. Logging & Observability Setup

### Step 1: Create Logging API Route

Create `app/api/logs/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const logEntry = await request.json();
    
    // Store in Supabase
    await supabase
      .from('application_logs')
      .insert({
        timestamp: logEntry.timestamp,
        level: logEntry.level,
        service: logEntry.service,
        message: logEntry.message,
        metadata: logEntry.metadata,
        trace_id: logEntry.traceId,
        user_id: logEntry.userId,
      });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to store log:', error);
    return NextResponse.json({ error: 'Failed to store log' }, { status: 500 });
  }
}
```

### Step 2: Create Logs Table in Supabase

```sql
CREATE TABLE application_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error', 'debug')),
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  trace_id TEXT,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX idx_logs_timestamp ON application_logs(timestamp);
CREATE INDEX idx_logs_level ON application_logs(level);
CREATE INDEX idx_logs_service ON application_logs(service);
CREATE INDEX idx_logs_trace_id ON application_logs(trace_id);
```

## 3. Accessibility & Internationalization Setup

### Step 1: Install Accessibility Dependencies

```bash
npm install axe-core @axe-core/react
npm install next-i18next i18next react-i18next
```

### Step 2: Configure i18n

Create `next-i18next.config.js`:
```javascript
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'],
  },
  localePath: './public/locales',
};
```

### Step 3: Create Translation Files

Create `public/locales/en/commentary.json`:
```json
{
  "title": "Fight Commentary",
  "panel": {
    "label": "Commentary panel for the current match"
  },
  "play": "Play commentary",
  "pause": "Pause commentary",
  "noCommentary": "No commentary generated yet",
  "generate": "Generate AI Commentary",
  "fullCommentary": "Full Commentary"
}
```

### Step 4: Set Up Accessibility Testing

Create `lib/accessibility/setup.ts`:
```typescript
import { configureAxe } from 'jest-axe';

export const axe = configureAxe({
  rules: {
    'color-contrast': { enabled: true },
    'button-name': { enabled: true },
    'form-field-multiple-labels': { enabled: true },
  },
});
```

## 4. Documentation & SDK Setup

### Step 1: Install TypeDoc

```bash
npm install --save-dev typedoc
```

### Step 2: Configure TypeDoc

Create `typedoc.json`:
```json
{
  "entryPoints": ["src/lib/commentary/index.ts"],
  "out": "docs",
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeExternals": true,
  "theme": "default",
  "name": "Sports Commentary AI SDK",
  "includeVersion": true,
  "categorizeByGroup": true,
  "categoryOrder": ["Core", "AI", "Analytics", "*"],
  "readme": "README.md"
}
```

### Step 3: Add Documentation Scripts

Update `package.json`:
```json
{
  "scripts": {
    "docs:generate": "typedoc",
    "docs:serve": "npx http-server docs -p 8080"
  }
}
```

## 5. Analytics & User Feedback Setup

### Step 1: Create Analytics Tables

```sql
-- Ratings table
CREATE TABLE commentary_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fight_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  commentary_style TEXT,
  generation_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE commentary_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fight_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_ratings_fight_id ON commentary_ratings(fight_id);
CREATE INDEX idx_ratings_user_id ON commentary_ratings(user_id);
CREATE INDEX idx_analytics_action ON commentary_analytics(action);
CREATE INDEX idx_analytics_created_at ON commentary_analytics(created_at);
```

### Step 2: Create Analytics API Routes

Create `app/api/ratings/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const rating = await request.json();
    
    const { data, error } = await supabase
      .from('commentary_ratings')
      .insert(rating)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to submit rating:', error);
    return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 });
  }
}
```

### Step 3: Set Up Vercel Analytics

Install Vercel Analytics:
```bash
npm install @vercel/analytics
```

Add to your app:
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## 6. Security & Compliance Setup

### Step 1: Install Security Dependencies

```bash
npm install ioredis zod
```

### Step 2: Set Up Redis

Add to your environment variables:
```env
REDIS_URL=redis://localhost:6379
```

### Step 3: Create Security Middleware

Create `lib/security/middleware.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { commentaryRateLimiter } from './rateLimiter';
import { CommentaryRequestSchema, sanitizeInput } from './validation';

export async function securityMiddleware(request: NextRequest) {
  // Rate limiting
  const rateLimit = await commentaryRateLimiter.checkRateLimit(request);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // Input validation for POST requests
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const sanitizedBody = JSON.parse(JSON.stringify(body), (key, value) => 
        typeof value === 'string' ? sanitizeInput(value) : value
      );
      
      CommentaryRequestSchema.parse(sanitizedBody);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
  }
  
  return NextResponse.next();
}
```

### Step 4: Set Up GDPR Compliance

Create `lib/compliance/gdpr.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export class GDPRCompliance {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  async anonymizeUserData(userId: string): Promise<void> {
    await this.supabase
      .from('commentary_ratings')
      .update({ user_id: null })
      .eq('user_id', userId);
    
    await this.supabase
      .from('commentary_analytics')
      .update({ user_id: null })
      .eq('user_id', userId);
  }

  async deleteUserData(userId: string): Promise<void> {
    await this.supabase
      .from('commentary_ratings')
      .delete()
      .eq('user_id', userId);
    
    await this.supabase
      .from('commentary_analytics')
      .delete()
      .eq('user_id', userId);
  }
}
```

## 7. Testing Setup

### Step 1: Install Testing Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-axe
```

### Step 2: Configure Jest

Create `jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
```

### Step 3: Create Test Setup

Create `jest.setup.js`:
```javascript
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
```

## 8. Deployment Configuration

### Step 1: Update Vercel Configuration

Create `vercel.json`:
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "REDIS_URL": "@redis-url",
    "SENTRY_DSN": "@sentry-dsn",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key"
  }
}
```

### Step 2: Set Up Environment Variables in Vercel

Add these environment variables in your Vercel dashboard:
- `REDIS_URL`
- `SENTRY_DSN`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`

## 9. Monitoring Dashboard Setup

### Step 1: Create Monitoring API Routes

Create `app/api/monitoring/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || 'day';
    
    // Get analytics data
    const { data: ratings } = await supabase
      .from('commentary_ratings')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    const { data: logs } = await supabase
      .from('application_logs')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    
    return NextResponse.json({
      ratings: ratings || [],
      logs: logs || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to get monitoring data:', error);
    return NextResponse.json({ error: 'Failed to get monitoring data' }, { status: 500 });
  }
}
```

## 10. Final Integration Steps

### Step 1: Update Your Main App

```typescript
// app/layout.tsx
import { initSentry } from '@/lib/monitoring/sentry';
import { Analytics } from '@vercel/analytics/react';

if (process.env.NODE_ENV === 'production') {
  initSentry();
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Step 2: Add Security Middleware to API Routes

```typescript
// app/api/commentary/route.ts
import { securityMiddleware } from '@/lib/security/middleware';

export async function POST(request: NextRequest) {
  // Apply security middleware
  const securityResponse = await securityMiddleware(request);
  if (securityResponse.status !== 200) {
    return securityResponse;
  }
  
  // Your commentary generation logic here
  // ...
}
```

### Step 3: Test All Features

Run the following commands to test your implementation:

```bash
# Run tests
npm test

# Run accessibility tests
npm run test:a11y

# Generate documentation
npm run docs:generate

# Start development server
npm run dev
```

## Troubleshooting

### Common Issues and Solutions

1. **Sentry not working**: Ensure your DSN is correct and environment variables are set
2. **Rate limiting errors**: Check Redis connection and configuration
3. **Accessibility violations**: Run `npm run test:a11y` to identify issues
4. **Analytics not tracking**: Verify Vercel Analytics is properly installed
5. **Logging failures**: Check Supabase connection and table permissions

### Performance Optimization

1. **Enable caching** for frequently accessed data
2. **Use connection pooling** for database connections
3. **Implement lazy loading** for heavy components
4. **Optimize bundle size** with code splitting

This setup guide provides a complete foundation for implementing all advanced features in your sports commentary AI application. Each section includes specific code examples and configuration details to ensure successful implementation. 