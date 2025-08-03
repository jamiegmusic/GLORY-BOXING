# Logging and Monitoring System Documentation

## Overview

This document describes the comprehensive logging and monitoring infrastructure implemented in the Glory Management application. The system provides structured logging, error tracking, and performance monitoring across all application layers.

## Architecture

### 1. Structured Logging System

#### Core Logger (`src/lib/logging/logger.ts`)
- **Purpose**: Centralized logging with consistent format
- **Features**:
  - Structured JSON logs
  - Automatic trace ID generation
  - Log levels: info, warn, error, debug
  - Metadata support
  - Automatic transmission to logging API

#### Usage Examples:

```typescript
import { commentaryLogger, apiLogger } from '@/lib/logging/logger';

// Log an info message
commentaryLogger.info('Commentary generated', {
  fightId: '123',
  duration: 1500
});

// Log an error with stack trace
apiLogger.error('API request failed', error, {
  endpoint: '/api/commentary',
  statusCode: 500
});
```

### 2. Logging API Endpoint

#### Endpoint: `/api/logs`
- **POST**: Write logs to database
- **GET**: Retrieve logs with filtering

#### Database Schema:
```sql
application_logs
├── id (UUID)
├── timestamp (TIMESTAMPTZ)
├── level (TEXT)
├── service (TEXT)
├── message (TEXT)
├── metadata (JSONB)
├── trace_id (TEXT)
├── user_id (UUID)
└── created_at (TIMESTAMPTZ)
```

#### API Usage:

```typescript
// Write a log
await fetch('/api/logs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'error',
    service: 'frontend',
    message: 'User action failed',
    metadata: { userId: '123', action: 'createFighter' }
  })
});

// Query logs
const response = await fetch('/api/logs?level=error&service=frontend&limit=50');
const { logs } = await response.json();
```

### 3. Sentry Error Monitoring

#### Configuration Files:
- `sentry.client.config.ts` - Browser-side tracking
- `sentry.server.config.ts` - Server-side tracking
- `sentry.edge.config.ts` - Edge runtime tracking

#### Features:
- Automatic error capture
- Performance monitoring
- Session replay on errors
- Source map support
- Custom error filtering

#### Environment Variables Required:
```env
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_organization
SENTRY_PROJECT=your_project
SENTRY_AUTH_TOKEN=your_auth_token
```

### 4. Error Boundary System

#### Components:

##### `ErrorBoundary` Component
- Catches React component errors
- Logs to structured logger
- Reports to Sentry
- Provides user-friendly error UI
- Offers recovery options

##### `useErrorHandler` Hook
```typescript
const { handleError, handleAsyncError } = useErrorHandler('my-service');

// Handle synchronous errors
try {
  riskyOperation();
} catch (error) {
  const errorId = handleError(error, { context: 'additional info' });
}

// Handle async errors
const result = await handleAsyncError(async () => {
  return await riskyAsyncOperation();
});
```

##### `withErrorBoundary` HOC
```typescript
// Wrap any component with error boundary
const SafeComponent = withErrorBoundary(MyComponent, {
  service: 'my-component',
  showDetails: true,
  fallback: <CustomErrorUI />
});
```

## Implementation Guide

### 1. Basic Setup

1. **Install Dependencies**:
```bash
npm install @sentry/nextjs
```

2. **Run Database Migration**:
```bash
npx supabase migration up
```

3. **Configure Environment Variables**:
Create `.env.local` with required values

### 2. Using the Logger

```typescript
import { StructuredLogger } from '@/lib/logging/logger';

// Create service-specific logger
const myLogger = new StructuredLogger('my-service');

// Log different levels
myLogger.info('Operation started');
myLogger.warn('Deprecated method used');
myLogger.error('Operation failed', error);
myLogger.debug('Debug information');
```

### 3. Implementing Error Boundaries

#### At Component Level:
```tsx
function MyPage() {
  return (
    <ErrorBoundary service="my-page">
      <MyPageContent />
    </ErrorBoundary>
  );
}
```

#### Using HOC:
```tsx
export default withErrorBoundary(MyComponent, {
  service: 'my-component',
  showDetails: process.env.NODE_ENV === 'development'
});
```

#### In Layout (Application-wide):
Already implemented in `src/app/layout.tsx`

### 4. Monitoring Dashboard

Access logs programmatically:
```typescript
// Get recent errors
const errorLogs = await fetch('/api/logs?level=error&limit=100');

// Get logs for specific service
const serviceLogs = await fetch('/api/logs?service=commentary&limit=50');

// Get logs with pagination
const pagedLogs = await fetch('/api/logs?offset=100&limit=50');
```

## Best Practices

### 1. Logging Guidelines

- **DO**:
  - Log meaningful events (API calls, user actions, errors)
  - Include relevant metadata
  - Use appropriate log levels
  - Include trace IDs for distributed tracing

- **DON'T**:
  - Log sensitive information (passwords, tokens)
  - Log excessively in loops
  - Use console.log in production
  - Log large objects without filtering

### 2. Error Handling

- Always use try-catch for async operations
- Provide meaningful error messages
- Include context in error metadata
- Use error boundaries for UI components
- Test error scenarios

### 3. Performance Considerations

- Logs are batched and sent asynchronously
- Old logs are automatically cleaned up (30 days for info, 90 days for errors)
- Sentry sampling reduces overhead in production
- Use debug logs only in development

## Troubleshooting

### Common Issues:

1. **Logs not appearing in database**:
   - Check SUPABASE_SERVICE_ROLE_KEY is set
   - Verify application_logs table exists
   - Check RLS policies

2. **Sentry not capturing errors**:
   - Verify SENTRY_DSN is set
   - Check network requests to Sentry
   - Ensure error isn't filtered by ignoreErrors

3. **Error boundary not catching errors**:
   - Error boundaries only catch errors in child components
   - They don't catch errors in event handlers (use try-catch)
   - They don't catch errors in async code (use handleAsyncError)

## Maintenance

### Regular Tasks:

1. **Monitor Log Volume**:
   - Check database size
   - Adjust retention policies if needed
   - Monitor API rate limits

2. **Review Error Patterns**:
   - Identify recurring errors
   - Update error filtering rules
   - Improve error messages

3. **Update Dependencies**:
   - Keep Sentry SDK updated
   - Update Next.js for latest features
   - Review security advisories

## Security Considerations

1. **Data Privacy**:
   - Never log PII or sensitive data
   - Use RLS policies to restrict access
   - Sanitize error messages

2. **Access Control**:
   - Service role key only on server
   - User-specific log access via RLS
   - Admin access for full logs

3. **Rate Limiting**:
   - Implement rate limiting on log API
   - Monitor for abuse
   - Set up alerts for unusual activity

## Future Enhancements

1. **Planned Features**:
   - Log aggregation dashboard
   - Real-time error alerts
   - Performance metrics visualization
   - Custom log retention policies

2. **Integration Opportunities**:
   - Integrate with monitoring services
   - Add custom Sentry integrations
   - Implement distributed tracing
   - Add business metrics logging

---

For questions or issues, please refer to the error tracking dashboard or contact the development team.