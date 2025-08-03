import * as Sentry from '@sentry/nextjs';

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    integrations: [
      // BrowserTracing is automatically included in newer versions
    ],
  });
};

export const trackCommentaryGeneration = async (
  fightId: string,
  generationTime: number,
  success: boolean
) => {
  Sentry.addBreadcrumb({
    category: 'commentary',
    message: `Commentary generation ${success ? 'completed' : 'failed'}`,
    data: { fightId, generationTime },
    level: success ? 'info' : 'error',
  });
};

export const trackAPIPerformance = (
  endpoint: string,
  duration: number,
  statusCode: number
) => {
  // Use Sentry's performance monitoring instead of metrics
  const transaction = Sentry.getCurrentHub().getScope()?.getTransaction();
  if (transaction) {
    transaction.setTag('endpoint', endpoint);
    transaction.setTag('status', statusCode.toString());
    transaction.setMeasurement('api.duration', duration, 'millisecond');
  }
  
  // Add breadcrumb for API performance
  Sentry.addBreadcrumb({
    category: 'api',
    message: `API call to ${endpoint}`,
    data: { duration, statusCode },
    level: 'info',
  });
};

export const captureCommentaryError = (error: Error, context: Record<string, any>) => {
  Sentry.captureException(error, {
    tags: {
      service: 'commentary',
      ...context,
    },
  });
}; 