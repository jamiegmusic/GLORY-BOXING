'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StructuredLogger } from '@/lib/logging/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  service?: string;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  private logger: StructuredLogger;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
    this.logger = new StructuredLogger(props.service || 'error-boundary');
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
      errorId: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Generate error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log error to our structured logger
    this.logger.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      errorId,
      service: this.props.service,
    });

    // Also send to Sentry with additional context
    Sentry.withScope((scope) => {
      scope.setTag('errorBoundary', true);
      scope.setTag('errorId', errorId);
      scope.setContext('errorInfo', {
        componentStack: errorInfo.componentStack,
        service: this.props.service,
      });
      Sentry.captureException(error);
    });

    // Update state with error details
    this.setState({
      errorInfo,
      errorId,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>
                We apologize for the inconvenience. The error has been logged and our team will investigate.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Details</AlertTitle>
                <AlertDescription>
                  {this.state.error?.message || 'An unexpected error occurred'}
                </AlertDescription>
              </Alert>

              {this.state.errorId && (
                <div className="text-sm text-gray-500">
                  Error ID: <code className="bg-gray-100 px-2 py-1 rounded">{this.state.errorId}</code>
                </div>
              )}

              {this.props.showDetails && this.state.errorInfo && process.env.NODE_ENV === 'development' && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    Technical Details (Development Only)
                  </summary>
                  <div className="mt-2 space-y-2">
                    <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
                      {this.state.error?.stack}
                    </pre>
                    <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}
            </CardContent>

            <CardFooter className="flex flex-wrap gap-2">
              <Button onClick={this.handleReset} variant="default">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={this.handleReload} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
              <Button onClick={this.handleGoHome} variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;