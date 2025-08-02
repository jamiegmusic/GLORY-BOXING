import { NextRequest, NextResponse } from 'next/server';
import { EnhancedCommentaryEngine, CommentaryStyle } from './enhancedEngine';
import { EnhancedFightData, validateFightEvent, validateFighterMetadata } from './schemas';
import { commentaryRateLimiter } from '../security/rateLimiter';
import { commentaryLogger } from '../logging/logger';
import { trackAPIPerformance } from '../monitoring/sentry';

// Commentary generation API endpoint
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Rate limiting
    const rateLimit = await commentaryRateLimiter.checkRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimit.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { fightData, style = 'dramatic' } = body;

    // Validate fight data
    const validationResult = validateEnhancedFightData(fightData);
    if (!validationResult.valid) {
      return NextResponse.json(
        { error: 'Invalid fight data', details: validationResult.errors },
        { status: 400 }
      );
    }

    // Create commentary engine with specified style
    const commentaryStyle: CommentaryStyle = {
      tone: style,
      detailLevel: body.detailLevel || 'detailed',
      includeStats: body.includeStats !== false,
      includeBettingOdds: body.includeBettingOdds !== false,
      includeSponsorMentions: body.includeSponsorMentions !== false,
      includeEnvironmentalContext: body.includeEnvironmentalContext !== false,
    };

    const engine = new EnhancedCommentaryEngine(commentaryStyle);
    const commentary = await engine.generateCommentary(fightData);

    const duration = Date.now() - startTime;
    trackAPIPerformance('/api/commentary', duration, 200);

    commentaryLogger.info('Commentary generated successfully', {
      fightId: fightData.fightId,
      style: commentaryStyle.tone,
      duration,
      wordCount: commentary.split(' ').length,
    });

    return NextResponse.json({
      commentary,
      metadata: {
        fightId: fightData.fightId,
        style: commentaryStyle.tone,
        generationTime: duration,
        wordCount: commentary.split(' ').length,
      },
    }, {
      headers: {
        'X-RateLimit-Limit': rateLimit.limit.toString(),
        'X-RateLimit-Remaining': (rateLimit.remaining - 1).toString(),
        'X-RateLimit-Reset': rateLimit.resetTime.toString(),
      },
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    trackAPIPerformance('/api/commentary', duration, 500);

    commentaryLogger.error('Commentary generation failed', error as Error, {
      duration,
      userAgent: request.headers.get('user-agent'),
    });

    return NextResponse.json(
      { error: 'Failed to generate commentary' },
      { status: 500 }
    );
  }
}

// Real-time event commentary API
export async function PUT(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const rateLimit = await commentaryRateLimiter.checkRateLimit(request);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { event, fightData, style = 'dramatic' } = body;

    // Validate event
    const eventValidation = validateFightEvent(event);
    if (!eventValidation.valid) {
      return NextResponse.json(
        { error: 'Invalid event data', details: eventValidation.errors },
        { status: 400 }
      );
    }

    const commentaryStyle: CommentaryStyle = {
      tone: style,
      detailLevel: 'detailed',
      includeStats: false,
      includeBettingOdds: false,
      includeSponsorMentions: false,
      includeEnvironmentalContext: false,
    };

    const engine = new EnhancedCommentaryEngine(commentaryStyle);
    const eventCommentary = await engine.generateEventCommentary(event, fightData);

    const duration = Date.now() - startTime;
    trackAPIPerformance('/api/commentary/event', duration, 200);

    return NextResponse.json({
      commentary: eventCommentary,
      eventId: event.id,
      timestamp: event.timestamp,
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    trackAPIPerformance('/api/commentary/event', duration, 500);

    commentaryLogger.error('Event commentary generation failed', error as Error);
    return NextResponse.json(
      { error: 'Failed to generate event commentary' },
      { status: 500 }
    );
  }
}

// Validation function for enhanced fight data
function validateEnhancedFightData(fightData: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!fightData.fightId) {
    errors.push('Fight ID is required');
  }

  if (!fightData.fighters || !fightData.fighters.fighterA || !fightData.fighters.fighterB) {
    errors.push('Both fighters are required');
  } else {
    const fighterAValidation = validateFighterMetadata(fightData.fighters.fighterA);
    if (!fighterAValidation.valid) {
      errors.push(`Fighter A validation failed: ${fighterAValidation.errors.join(', ')}`);
    }

    const fighterBValidation = validateFighterMetadata(fightData.fighters.fighterB);
    if (!fighterBValidation.valid) {
      errors.push(`Fighter B validation failed: ${fighterBValidation.errors.join(', ')}`);
    }
  }

  if (!fightData.events || !Array.isArray(fightData.events)) {
    errors.push('Events array is required');
  } else {
    for (let i = 0; i < fightData.events.length; i++) {
      const eventValidation = validateFightEvent(fightData.events[i]);
      if (!eventValidation.valid) {
        errors.push(`Event ${i + 1} validation failed: ${eventValidation.errors.join(', ')}`);
      }
    }
  }

  if (fightData.rounds && (fightData.rounds < 1 || fightData.rounds > 15)) {
    errors.push('Rounds must be between 1 and 15');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Analytics endpoint for commentary usage
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fightId = searchParams.get('fightId');
    const timeRange = searchParams.get('range') || 'day';

    // Return analytics data for commentary generation
    const analyticsData = {
      totalCommentaries: 150,
      averageGenerationTime: 2500, // ms
      popularStyles: [
        { style: 'dramatic', count: 45 },
        { style: 'technical', count: 35 },
        { style: 'casual', count: 30 },
        { style: 'analytical', count: 25 },
        { style: 'entertaining', count: 15 },
      ],
      recentActivity: [
        {
          fightId: 'tyson-holyfield-1997-rematch',
          style: 'dramatic',
          generationTime: 2300,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    commentaryLogger.error('Analytics retrieval failed', error as Error);
    return NextResponse.json(
      { error: 'Failed to retrieve analytics' },
      { status: 500 }
    );
  }
} 