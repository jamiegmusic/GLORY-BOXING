// Example: Using Error Boundaries in Your Components

import React, { useState } from 'react';
import { ErrorBoundary, useErrorHandler, withErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';

// Example 1: Using ErrorBoundary component directly
export function ExampleWithErrorBoundary() {
  return (
    <ErrorBoundary service="example-component" showDetails>
      <ComponentThatMightThrow />
    </ErrorBoundary>
  );
}

// Example 2: Using the HOC approach
const SafeComponent = withErrorBoundary(ComponentThatMightThrow, {
  service: 'safe-component',
  showDetails: process.env.NODE_ENV === 'development',
});

// Example 3: Using error handler hook in functional components
export function ExampleWithErrorHandler() {
  const { handleError, handleAsyncError } = useErrorHandler('example-handler');
  const [data, setData] = useState(null);

  const handleClick = () => {
    try {
      // Some risky operation
      riskyOperation();
    } catch (error) {
      const errorId = handleError(error as Error, {
        action: 'button-click',
        component: 'ExampleWithErrorHandler',
      });
      console.log('Error tracked with ID:', errorId);
    }
  };

  const handleAsyncClick = async () => {
    const result = await handleAsyncError(async () => {
      // Some async operation that might throw
      const response = await fetch('/api/risky-endpoint');
      if (!response.ok) {
        throw new Error('API request failed');
      }
      return response.json();
    });
    
    if (result) {
      setData(result);
    }
  };

  return (
    <div>
      <Button onClick={handleClick}>Try Risky Operation</Button>
      <Button onClick={handleAsyncClick}>Try Async Operation</Button>
    </div>
  );
}

// Example 4: Custom error fallback UI
export function ExampleWithCustomFallback() {
  const CustomErrorFallback = (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <h3 className="text-red-800">Oops! Something went wrong</h3>
      <p className="text-red-600">We're working on fixing this issue.</p>
    </div>
  );

  return (
    <ErrorBoundary service="custom-fallback" fallback={CustomErrorFallback}>
      <ComponentThatMightThrow />
    </ErrorBoundary>
  );
}

// Example component that throws errors (for testing)
function ComponentThatMightThrow() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Intentional error for testing error boundaries');
  }

  return (
    <div className="p-4">
      <h2>Component Content</h2>
      <Button onClick={() => setShouldThrow(true)} variant="destructive">
        Trigger Error
      </Button>
    </div>
  );
}

// Example risky operation
function riskyOperation() {
  if (Math.random() > 0.5) {
    throw new Error('Random error occurred!');
  }
  return 'Success!';
}