import { Redis } from 'ioredis';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
}

export class RateLimiter {
  private redis: Redis;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.config = config;
  }

  async checkRateLimit(req: Request): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(req);
    const windowKey = `rate_limit:${key}:${Math.floor(Date.now() / this.config.windowMs)}`;
    
    const current = await this.redis.incr(windowKey);
    
    if (current === 1) {
      await this.redis.expire(windowKey, this.config.windowMs / 1000);
    }
    
    const remaining = Math.max(0, this.config.maxRequests - current);
    const allowed = current <= this.config.maxRequests;
    const resetTime = Date.now() + this.config.windowMs;
    
    return {
      allowed,
      remaining,
      resetTime,
      limit: this.config.maxRequests,
    };
  }

  async getRateLimitInfo(req: Request): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(req);
    const windowKey = `rate_limit:${key}:${Math.floor(Date.now() / this.config.windowMs)}`;
    
    const current = await this.redis.get(windowKey);
    const count = current ? parseInt(current) : 0;
    
    const remaining = Math.max(0, this.config.maxRequests - count);
    const resetTime = Date.now() + this.config.windowMs;
    
    return {
      allowed: count < this.config.maxRequests,
      remaining,
      resetTime,
      limit: this.config.maxRequests,
    };
  }

  async resetRateLimit(req: Request): Promise<void> {
    const key = this.config.keyGenerator(req);
    const windowKey = `rate_limit:${key}:${Math.floor(Date.now() / this.config.windowMs)}`;
    await this.redis.del(windowKey);
  }
}

// Pre-configured rate limiters for different endpoints
export const commentaryRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // 10 requests per minute
  keyGenerator: (req) => {
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown';
    return `commentary:${ip}`;
  },
});

export const aiApiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 AI API calls per minute
  keyGenerator: (req) => {
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown';
    return `ai_api:${ip}`;
  },
});

export const userRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 requests per minute per user
  keyGenerator: (req) => {
    const userId = req.headers.get('x-user-id') || 'anonymous';
    return `user:${userId}`;
  },
});

// Rate limiting middleware for API routes
export const withRateLimiting = (rateLimiter: RateLimiter) => {
  return (handler: Function) => {
    return async (req: Request, res: Response) => {
      const rateLimit = await rateLimiter.checkRateLimit(req);
      
      if (!rateLimit.allowed) {
        return new Response('Rate limit exceeded', {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
            'Retry-After': Math.ceil((this.config?.windowMs || 60000) / 1000).toString(),
          },
        });
      }
      
      // Add rate limit headers to response
      const originalResponse = await handler(req, res);
      const response = new Response(originalResponse.body, originalResponse);
      
      response.headers.set('X-RateLimit-Limit', rateLimit.limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
      response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());
      
      return response;
    };
  };
};

// Rate limiting decorator for class methods
export const rateLimited = (rateLimiter: RateLimiter) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const req = args[0]; // Assume first argument is the request
      if (req instanceof Request) {
        const rateLimit = await rateLimiter.checkRateLimit(req);
        
        if (!rateLimit.allowed) {
          throw new Error('Rate limit exceeded');
        }
      }
      
      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}; 