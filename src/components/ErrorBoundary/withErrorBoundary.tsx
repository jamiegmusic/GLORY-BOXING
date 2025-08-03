import React, { ComponentType, ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface WithErrorBoundaryOptions {
  fallback?: ReactNode;
  service?: string;
  showDetails?: boolean;
}

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options?: WithErrorBoundaryOptions
) {
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary
        fallback={options?.fallback}
        service={options?.service || Component.displayName || Component.name}
        showDetails={options?.showDetails}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}