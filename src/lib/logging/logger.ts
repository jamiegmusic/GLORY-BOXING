interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  service: string;
  message: string;
  metadata: Record<string, any>;
  traceId?: string;
  userId?: string;
}

export class StructuredLogger {
  private service: string;
  private traceId: string;

  constructor(service: string) {
    this.service = service;
    this.traceId = this.generateTraceId();
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatLog(level: LogEntry['level'], message: string, metadata: Record<string, any> = {}): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      message,
      metadata: {
        ...metadata,
        traceId: this.traceId,
      },
      traceId: this.traceId,
    };
  }

  info(message: string, metadata?: Record<string, any>) {
    const logEntry = this.formatLog('info', message, metadata);
    console.log(JSON.stringify(logEntry));
    this.sendToLogService(logEntry);
  }

  warn(message: string, metadata?: Record<string, any>) {
    const logEntry = this.formatLog('warn', message, metadata);
    console.warn(JSON.stringify(logEntry));
    this.sendToLogService(logEntry);
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    const logEntry = this.formatLog('error', message, {
      ...metadata,
      error: error?.message,
      stack: error?.stack,
    });
    console.error(JSON.stringify(logEntry));
    this.sendToLogService(logEntry);
  }

  debug(message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      const logEntry = this.formatLog('debug', message, metadata);
      console.debug(JSON.stringify(logEntry));
      this.sendToLogService(logEntry);
    }
  }

  private async sendToLogService(logEntry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      console.error('Failed to send log to service:', error);
    }
  }

  // Create child logger with additional context
  child(additionalContext: Record<string, any>): StructuredLogger {
    const childLogger = new StructuredLogger(this.service);
    childLogger.traceId = this.traceId;
    return childLogger;
  }
}

// Create logger instances for different services
export const commentaryLogger = new StructuredLogger('commentary');
export const apiLogger = new StructuredLogger('api');
export const analyticsLogger = new StructuredLogger('analytics'); 