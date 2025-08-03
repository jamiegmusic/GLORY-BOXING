import { useCallback } from 'react';
import * as Sentry from '@sentry/nextjs';
import { StructuredLogger } from '@/lib/logging/logger';

export function useErrorHandler(service?: string) {
  const logger = new StructuredLogger(service || 'error-handler');

  const handleError = useCallback((error: Error, errorInfo?: any) => {
    // Generate error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log error to our structured logger
    logger.error('Error caught by useErrorHandler', error, {
      errorHandler: true,
      errorId,
      service,
      ...errorInfo,
    });

    // Also send to Sentry with additional context
    Sentry.withScope((scope) => {
      scope.setTag('errorHandler', true);
      scope.setTag('errorId', errorId);
      scope.setContext('errorInfo', {
        service,
        ...errorInfo,
      });
      Sentry.captureException(error);
    });

    return errorId;
  }, [logger, service]);

  const handleAsyncError = useCallback(async (asyncFn: () => Promise<any>) => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, { async: true });
      throw error;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
  };
}