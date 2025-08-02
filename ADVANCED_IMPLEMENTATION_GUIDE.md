# Advanced Implementation Guide - Sports Commentary AI

This guide covers advanced implementation topics for the sports commentary AI application, providing production-ready solutions for monitoring, observability, accessibility, documentation, analytics, and security.

## 1. Performance Monitoring

### Overview
Implement comprehensive performance monitoring to track API latency, AI response times, and UI render performance across the commentary system.

### Key Metrics to Track

#### API Performance Metrics
- **AI API Response Time**: Track OpenAI/Claude API latency
- **Commentary Generation Time**: End-to-end commentary creation duration
- **Error Rates**: Failed API calls and retry success rates
- **Rate Limiting**: API quota usage and throttling events

#### UI Performance Metrics
- **Commentary Panel Render Time**: Time to render commentary components
- **Audio Playback Performance**: Audio streaming and buffering metrics
- **User Interaction Latency**: Button clicks to response times
- **Memory Usage**: Component memory consumption

### Implementation with Sentry

```typescript
// lib/monitoring/sentry.ts
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
```

### Vercel Analytics Integration

```typescript
// lib/analytics/vercel.ts
import { Analytics } from '@vercel/analytics/react';

export const VercelAnalytics = () => {
  return <Analytics />;
};

// Track commentary events
export const trackCommentaryEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    window.va?.track(event, properties);
  }
};

// Usage in components
export const useCommentaryAnalytics = () => {
  const trackGeneration = (fightId: string, style: string) => {
    trackCommentaryEvent('commentary_generated', { fightId, style });
  };

  const trackPlayback = (fightId: string, duration: number) => {
    trackCommentaryEvent('commentary_played', { fightId, duration });
  };

  return { trackGeneration, trackPlayback };
};
```

### Performance Monitoring Setup

```typescript
// lib/monitoring/performance.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  trackAPILatency(endpoint: string, duration: number) {
    if (!this.metrics.has(endpoint)) {
      this.metrics.set(endpoint, []);
    }
    this.metrics.get(endpoint)!.push(duration);
    
    // Alert if latency exceeds threshold
    if (duration > 5000) {
      this.alertHighLatency(endpoint, duration);
    }
  }

  trackCommentaryGeneration(fightId: string, duration: number) {
    const key = `commentary_generation_${fightId}`;
    this.metrics.set(key, [duration]);
    
    // Track for analytics
    trackCommentaryEvent('generation_time', { fightId, duration });
  }

  private alertHighLatency(endpoint: string, duration: number) {
    console.warn(`High latency detected: ${endpoint} took ${duration}ms`);
    // Send to monitoring service
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }
}
```

## 2. Logging & Observability

### Structured Logging Architecture

```typescript
// lib/logging/logger.ts
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

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    const logEntry = this.formatLog('error', message, {
      ...metadata,
      error: error?.message,
      stack: error?.stack,
    });
    console.error(JSON.stringify(logEntry));
    this.sendToLogService(logEntry);
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
}
```

### Centralized Logging for Serverless Functions

```typescript
// lib/logging/serverless.ts
import { StructuredLogger } from './logger';

export const createServerlessLogger = (functionName: string) => {
  return new StructuredLogger(`serverless:${functionName}`);
};

// Usage in API routes
export const withLogging = (handler: Function) => {
  return async (req: Request, res: Response) => {
    const logger = createServerlessLogger(handler.name);
    const startTime = Date.now();

    try {
      logger.info('API request started', {
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
      });

      const result = await handler(req, res);

      logger.info('API request completed', {
        duration: Date.now() - startTime,
        statusCode: res.statusCode,
      });

      return result;
    } catch (error) {
      logger.error('API request failed', error as Error, {
        duration: Date.now() - startTime,
      });
      throw error;
    }
  };
};
```

### Error Dashboard Implementation

```typescript
// lib/logging/errorDashboard.ts
interface ErrorSummary {
  errorType: string;
  count: number;
  lastOccurrence: string;
  affectedUsers: number;
  averageResolutionTime: number;
}

export class ErrorDashboard {
  private static instance: ErrorDashboard;
  private errors: Map<string, ErrorSummary> = new Map();

  static getInstance(): ErrorDashboard {
    if (!ErrorDashboard.instance) {
      ErrorDashboard.instance = new ErrorDashboard();
    }
    return ErrorDashboard.instance;
  }

  recordError(errorType: string, userId?: string) {
    const existing = this.errors.get(errorType);
    
    if (existing) {
      existing.count++;
      existing.lastOccurrence = new Date().toISOString();
      if (userId) existing.affectedUsers++;
    } else {
      this.errors.set(errorType, {
        errorType,
        count: 1,
        lastOccurrence: new Date().toISOString(),
        affectedUsers: userId ? 1 : 0,
        averageResolutionTime: 0,
      });
    }
  }

  getErrorSummary(): ErrorSummary[] {
    return Array.from(this.errors.values());
  }

  getCriticalErrors(): ErrorSummary[] {
    return this.getErrorSummary().filter(error => error.count > 10);
  }
}
```

## 3. Accessibility & Internationalization

### Accessibility Audit Implementation

```typescript
// lib/accessibility/audit.ts
import axe from 'axe-core';

export class AccessibilityAuditor {
  static async runAudit(element?: HTMLElement): Promise<axe.AxeResults> {
    const context = element ? { include: [element] } : undefined;
    
    return new Promise((resolve, reject) => {
      axe.run(context, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async auditCommentaryPanel(): Promise<axe.AxeResults> {
    const panel = document.querySelector('[data-testid="commentary-panel"]');
    if (panel) {
      return this.runAudit(panel as HTMLElement);
    }
    return this.runAudit();
  }

  static generateReport(results: axe.AxeResults): string {
    const violations = results.violations.map(violation => ({
      rule: violation.id,
      description: violation.description,
      impact: violation.impact,
      nodes: violation.nodes.length,
    }));

    return JSON.stringify({ violations, timestamp: new Date().toISOString() }, null, 2);
  }
}
```

### Enhanced CommentaryPanel with Accessibility

```typescript
// components/CommentaryPanel.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';

interface CommentaryPanelProps {
  matchData: any;
  commentary?: string;
  onGenerateCommentary?: () => void;
  'aria-label'?: string;
}

export const CommentaryPanel: React.FC<CommentaryPanelProps> = ({
  matchData,
  commentary,
  onGenerateCommentary,
  'aria-label': ariaLabel,
}) => {
  const { t } = useTranslation('commentary');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div
      className="bg-gray-800 rounded-lg p-6 space-y-6"
      role="region"
      aria-label={ariaLabel || t('commentary.panel.label')}
      data-testid="commentary-panel"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mic className="w-6 h-6 text-purple-400" aria-hidden="true" />
          <h3 className="text-xl font-semibold" id="commentary-title">
            {t('commentary.title')}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition duration-300"
            aria-label={isPlaying ? t('commentary.pause') : t('commentary.play')}
            aria-pressed={isPlaying}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!commentary ? (
        <div className="text-center py-8" role="status" aria-live="polite">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
          <p className="text-gray-400 mb-4">{t('commentary.noCommentary')}</p>
          <button
            onClick={onGenerateCommentary}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition duration-300"
            aria-describedby="commentary-title"
          >
            {t('commentary.generate')}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3" id="full-commentary">
              {t('commentary.fullCommentary')}
            </h4>
            <div 
              className="text-gray-300 leading-relaxed"
              aria-labelledby="full-commentary"
              role="article"
            >
              {commentary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### Internationalization Setup

```typescript
// lib/i18n/config.ts
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

const i18n = createInstance({
  lng: 'en',
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  
  interpolation: {
    escapeValue: false,
  },
  
  resources: {
    en: {
      commentary: {
        title: 'Fight Commentary',
        panel: {
          label: 'Commentary panel for the current match',
        },
        play: 'Play commentary',
        pause: 'Pause commentary',
        noCommentary: 'No commentary generated yet',
        generate: 'Generate AI Commentary',
        fullCommentary: 'Full Commentary',
      },
    },
    es: {
      commentary: {
        title: 'Comentarios del Combate',
        panel: {
          label: 'Panel de comentarios para el combate actual',
        },
        play: 'Reproducir comentarios',
        pause: 'Pausar comentarios',
        noCommentary: 'Aún no se han generado comentarios',
        generate: 'Generar Comentarios IA',
        fullCommentary: 'Comentarios Completos',
      },
    },
  },
});

i18n.use(initReactI18next).init();

export default i18n;
```

## 4. Documentation & SDK

### TypeDoc Configuration

```json
// typedoc.json
{
  "entryPoints": ["src/lib/commentary/index.ts"],
  "out": "docs",
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeExternals": true,
  "theme": "default",
  "name": "Sports Commentary AI SDK",
  "includeVersion": true,
  "categorizeByGroup": true,
  "categoryOrder": ["Core", "AI", "Analytics", "*"],
  "readme": "README.md"
}
```

### SDK Documentation Structure

```typescript
// lib/commentary/index.ts
/**
 * Sports Commentary AI SDK
 * 
 * This SDK provides comprehensive tools for generating AI-powered sports commentary
 * with real-time event processing and customizable output formats.
 * 
 * @example
 * ```typescript
 * import { CommentaryEngine, CommentaryConfig } from '@sports-commentary/sdk';
 * 
 * const engine = new CommentaryEngine({
 *   apiKey: process.env.OPENAI_API_KEY,
 *   style: 'dramatic',
 *   language: 'en'
 * });
 * 
 * const commentary = await engine.generateCommentary(fightData);
 * ```
 */

export interface CommentaryConfig {
  /** OpenAI API key for commentary generation */
  apiKey: string;
  /** Commentary style: 'technical', 'dramatic', or 'casual' */
  style: 'technical' | 'dramatic' | 'casual';
  /** Output language for commentary */
  language: 'en' | 'es' | 'fr';
  /** Custom prompt templates */
  customPrompts?: Record<string, string>;
}

/**
 * Main commentary engine for generating AI-powered sports commentary
 */
export class CommentaryEngine {
  private config: CommentaryConfig;
  private logger: StructuredLogger;

  constructor(config: CommentaryConfig) {
    this.config = config;
    this.logger = new StructuredLogger('CommentaryEngine');
  }

  /**
   * Generates commentary for a complete fight
   * 
   * @param fightData - Complete fight data including events and fighter information
   * @returns Promise containing generated commentary
   * 
   * @example
   * ```typescript
   * const commentary = await engine.generateCommentary({
   *   fighterA: { name: 'Mike Tyson', record: '50-6-0' },
   *   fighterB: { name: 'Evander Holyfield', record: '44-10-2' },
   *   events: [...],
   *   result: { winner: 'fighter_a', method: 'ko', round: 3 }
   * });
   * ```
   */
  async generateCommentary(fightData: FightData): Promise<CommentaryResult> {
    this.logger.info('Starting commentary generation', { fightId: fightData.fightId });
    
    const startTime = Date.now();
    
    try {
      const prompt = this.buildPrompt(fightData);
      const response = await this.callAIAPI(prompt);
      
      const generationTime = Date.now() - startTime;
      this.logger.info('Commentary generation completed', { 
        fightId: fightData.fightId, 
        generationTime 
      });
      
      return this.parseResponse(response);
    } catch (error) {
      this.logger.error('Commentary generation failed', error as Error, { 
        fightId: fightData.fightId 
      });
      throw error;
    }
  }

  /**
   * Generates real-time commentary for a single event
   * 
   * @param event - Individual fight event
   * @param context - Current fight context
   * @returns Promise containing event commentary
   */
  async generateEventCommentary(
    event: FightEvent, 
    context: FightContext
  ): Promise<string> {
    const prompt = this.buildEventPrompt(event, context);
    const response = await this.callAIAPI(prompt);
    return response.choices[0].message.content;
  }

  private buildPrompt(fightData: FightData): string {
    const stylePrompt = this.getStylePrompt();
    const fighterInfo = this.formatFighterInfo(fightData);
    const events = this.formatEvents(fightData.events);
    
    return `
      ${stylePrompt}
      
      Fight Information:
      ${fighterInfo}
      
      Fight Events:
      ${events}
      
      Generate comprehensive commentary for this fight.
    `;
  }

  private getStylePrompt(): string {
    const styles = {
      technical: 'Provide technical analysis focusing on boxing fundamentals, technique, and strategic elements.',
      dramatic: 'Create dramatic, engaging commentary that captures the excitement and emotion of the fight.',
      casual: 'Generate casual, conversational commentary suitable for general audiences.'
    };
    
    return styles[this.config.style];
  }
}

/**
 * Result object containing generated commentary and metadata
 */
export interface CommentaryResult {
  /** Main commentary text */
  commentary: string;
  /** Round-by-round breakdown */
  roundByRound: string[];
  /** Key highlights and moments */
  highlights: string[];
  /** Technical analysis */
  analysis: string;
  /** Generation metadata */
  metadata: {
    generationTime: number;
    style: string;
    language: string;
    wordCount: number;
  };
}
```

## 5. Analytics & User Feedback Loop

### In-App Rating System

```typescript
// lib/analytics/rating.ts
interface CommentaryRating {
  fightId: string;
  userId: string;
  rating: number; // 1-5 stars
  feedback?: string;
  timestamp: string;
  commentaryStyle: string;
  generationTime: number;
}

export class RatingSystem {
  private static instance: RatingSystem;

  static getInstance(): RatingSystem {
    if (!RatingSystem.instance) {
      RatingSystem.instance = new RatingSystem();
    }
    return RatingSystem.instance;
  }

  async submitRating(rating: CommentaryRating): Promise<void> {
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rating),
      });

      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }

      // Track analytics
      trackCommentaryEvent('rating_submitted', {
        fightId: rating.fightId,
        rating: rating.rating,
        style: rating.commentaryStyle,
      });
    } catch (error) {
      console.error('Failed to submit rating:', error);
      throw error;
    }
  }

  async getAverageRating(fightId: string): Promise<number> {
    const response = await fetch(`/api/ratings/${fightId}/average`);
    const data = await response.json();
    return data.averageRating;
  }
}
```

### Analytics Dashboard Implementation

```typescript
// lib/analytics/dashboard.ts
interface AnalyticsData {
  totalCommentaries: number;
  averageRating: number;
  popularStyles: Array<{ style: string; count: number }>;
  generationTimes: Array<{ style: string; averageTime: number }>;
  userEngagement: {
    totalUsers: number;
    activeUsers: number;
    averageSessionDuration: number;
  };
}

export class AnalyticsDashboard {
  async getAnalyticsData(timeRange: 'day' | 'week' | 'month'): Promise<AnalyticsData> {
    const response = await fetch(`/api/analytics?range=${timeRange}`);
    return response.json();
  }

  async getFeedbackTrends(): Promise<Array<{ date: string; averageRating: number }>> {
    const response = await fetch('/api/analytics/feedback-trends');
    return response.json();
  }

  async getAIPerformanceMetrics(): Promise<{
    averageResponseTime: number;
    errorRate: number;
    successRate: number;
  }> {
    const response = await fetch('/api/analytics/ai-performance');
    return response.json();
  }
}
```

### Supabase Analytics Integration

```sql
-- Analytics tables in Supabase
CREATE TABLE commentary_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fight_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  commentary_style TEXT,
  generation_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE commentary_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fight_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'generate', 'play', 'pause', 'share'
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics views
CREATE VIEW rating_summary AS
SELECT 
  commentary_style,
  AVG(rating) as average_rating,
  COUNT(*) as total_ratings,
  COUNT(*) FILTER (WHERE rating >= 4) as positive_ratings
FROM commentary_ratings
GROUP BY commentary_style;

CREATE VIEW user_engagement AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) as total_actions
FROM commentary_analytics
GROUP BY DATE_TRUNC('day', created_at);
```

## 6. Security & Compliance

### Rate Limiting Implementation

```typescript
// lib/security/rateLimiter.ts
import { Redis } from 'ioredis';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator: (req: Request) => string;
}

export class RateLimiter {
  private redis: Redis;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.redis = new Redis(process.env.REDIS_URL);
    this.config = config;
  }

  async checkRateLimit(req: Request): Promise<{ allowed: boolean; remaining: number }> {
    const key = this.config.keyGenerator(req);
    const windowKey = `rate_limit:${key}:${Math.floor(Date.now() / this.config.windowMs)}`;
    
    const current = await this.redis.incr(windowKey);
    
    if (current === 1) {
      await this.redis.expire(windowKey, this.config.windowMs / 1000);
    }
    
    const remaining = Math.max(0, this.config.maxRequests - current);
    const allowed = current <= this.config.maxRequests;
    
    return { allowed, remaining };
  }
}

// Usage in API routes
const commentaryRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
  keyGenerator: (req) => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    return `commentary:${ip}`;
  },
});
```

### GDPR Compliance Implementation

```typescript
// lib/compliance/gdpr.ts
interface DataRetentionPolicy {
  commentaryData: number; // days
  userRatings: number; // days
  analyticsData: number; // days
}

export class GDPRCompliance {
  private retentionPolicy: DataRetentionPolicy = {
    commentaryData: 365, // 1 year
    userRatings: 730, // 2 years
    analyticsData: 2555, // 7 years
  };

  async anonymizeUserData(userId: string): Promise<void> {
    // Anonymize user ratings
    await this.supabase
      .from('commentary_ratings')
      .update({ user_id: null })
      .eq('user_id', userId);
    
    // Anonymize analytics
    await this.supabase
      .from('commentary_analytics')
      .update({ user_id: null })
      .eq('user_id', userId);
  }

  async deleteUserData(userId: string): Promise<void> {
    // Delete user ratings
    await this.supabase
      .from('commentary_ratings')
      .delete()
      .eq('user_id', userId);
    
    // Delete analytics
    await this.supabase
      .from('commentary_analytics')
      .delete()
      .eq('user_id', userId);
  }

  async cleanupExpiredData(): Promise<void> {
    const now = new Date();
    
    // Clean up old commentary data
    const commentaryCutoff = new Date(now.getTime() - this.retentionPolicy.commentaryData * 24 * 60 * 60 * 1000);
    await this.supabase
      .from('commentary_data')
      .delete()
      .lt('created_at', commentaryCutoff.toISOString());
    
    // Clean up old ratings
    const ratingsCutoff = new Date(now.getTime() - this.retentionPolicy.userRatings * 24 * 60 * 60 * 1000);
    await this.supabase
      .from('commentary_ratings')
      .delete()
      .lt('created_at', ratingsCutoff.toISOString());
  }
}
```

### Security Best Practices

```typescript
// lib/security/validation.ts
import { z } from 'zod';

// Input validation schemas
export const CommentaryRequestSchema = z.object({
  fightData: z.object({
    fightId: z.string().min(1).max(100),
    fighterA: z.object({
      name: z.string().min(1).max(100),
      record: z.string().regex(/^\d+-\d+-\d+$/),
    }),
    fighterB: z.object({
      name: z.string().min(1).max(100),
      record: z.string().regex(/^\d+-\d+-\d+$/),
    }),
    events: z.array(z.object({
      id: z.string(),
      timestamp: z.number(),
      eventType: z.enum(['punch', 'block', 'dodge', 'knockdown']),
    })).max(1000), // Prevent excessive events
  }),
  style: z.enum(['technical', 'dramatic', 'casual']),
  language: z.enum(['en', 'es', 'fr']),
});

export const sanitizeInput = (input: unknown) => {
  // Remove potentially dangerous content
  if (typeof input === 'string') {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  }
  return input;
};

// API route with security
export const secureCommentaryAPI = async (req: Request) => {
  // Rate limiting
  const rateLimit = await commentaryRateLimiter.checkRateLimit(req);
  if (!rateLimit.allowed) {
    return new Response('Rate limit exceeded', { status: 429 });
  }
  
  // Input validation
  const body = await req.json();
  const sanitizedBody = JSON.parse(JSON.stringify(body), (key, value) => 
    typeof value === 'string' ? sanitizeInput(value) : value
  );
  
  const validatedData = CommentaryRequestSchema.parse(sanitizedBody);
  
  // Generate commentary
  const engine = new CommentaryEngine({
    apiKey: process.env.OPENAI_API_KEY!,
    style: validatedData.style,
    language: validatedData.language,
  });
  
  const commentary = await engine.generateCommentary(validatedData.fightData);
  
  return new Response(JSON.stringify(commentary), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

This comprehensive guide provides production-ready implementations for all advanced topics, ensuring your sports commentary AI application is robust, secure, and maintainable. Each section includes specific code examples, configuration details, and best practices for enterprise-level deployment. 