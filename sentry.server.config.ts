import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Adjust this value in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Additional options
  beforeSend(event, hint) {
    // Modify event here
    if (event.exception) {
      // Add additional context
      event.tags = {
        ...event.tags,
        component: 'server',
      };
    }
    return event;
  },
  
  // Integrations
  integrations: [
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],
  
  // ProfilesSampleRate is relative to TracesSampleRate
  profilesSampleRate: 1.0,
  
  // Ignore specific errors
  ignoreErrors: [
    // Ignore non-critical database errors
    'ECONNREFUSED',
    'ETIMEDOUT',
  ],
  
  // Filter transactions
  beforeTransaction(transaction) {
    // Don't send transactions for health checks
    if (transaction.transaction === 'GET /api/health') {
      return null;
    }
    return transaction;
  },
});