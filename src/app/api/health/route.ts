import { NextRequest, NextResponse } from 'next/server';
import { apiLogger } from '@/lib/logging/logger';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Log health check request
    apiLogger.info('Health check requested', {
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: new Date().toISOString(),
    });

    // Check various system components
    const checks = {
      api: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV,
      logging: 'operational',
    };

    // Test logging system by writing a test log
    try {
      const testLogResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'info',
          service: 'health-check',
          message: 'Health check log test',
          metadata: { test: true },
        }),
      });
      
      checks.logging = testLogResponse.ok ? 'operational' : 'degraded';
    } catch (error) {
      checks.logging = 'unavailable';
    }

    const duration = Date.now() - startTime;
    
    apiLogger.info('Health check completed', {
      duration,
      status: 'healthy',
      checks,
    });

    return NextResponse.json({
      status: 'healthy',
      checks,
      duration: `${duration}ms`,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    apiLogger.error('Health check failed', error as Error, {
      duration,
    });

    return NextResponse.json({
      status: 'unhealthy',
      error: (error as Error).message,
      duration: `${duration}ms`,
    }, { status: 500 });
  }
}