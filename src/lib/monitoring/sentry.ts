import * as Sentry from '@sentry/nextjs';

export const initSentry = () => {
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
  Sentry.metrics.increment('api.requests', 1, {
    tags: { endpoint, status: statusCode.toString() },
  });
  
  Sentry.metrics.distribution('api.duration', duration, {
    tags: { endpoint },
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