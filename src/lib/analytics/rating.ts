interface CommentaryRating {
  fightId: string;
  userId: string;
  rating: number; // 1-5 stars
  feedback?: string;
  timestamp: string;
  commentaryStyle: string;
  generationTime: number;
  metadata?: Record<string, any>;
}

interface RatingSummary {
  fightId: string;
  averageRating: number;
  totalRatings: number;
  ratingDistribution: Record<number, number>;
  recentRatings: CommentaryRating[];
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
      this.trackRatingEvent('rating_submitted', {
        fightId: rating.fightId,
        rating: rating.rating,
        style: rating.commentaryStyle,
        generationTime: rating.generationTime,
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

  async getRatingSummary(fightId: string): Promise<RatingSummary> {
    const response = await fetch(`/api/ratings/${fightId}/summary`);
    return response.json();
  }

  async getUserRatings(userId: string): Promise<CommentaryRating[]> {
    const response = await fetch(`/api/ratings/user/${userId}`);
    return response.json();
  }

  async getPopularStyles(): Promise<Array<{ style: string; averageRating: number; count: number }>> {
    const response = await fetch('/api/ratings/popular-styles');
    return response.json();
  }

  async getRatingTrends(timeRange: 'day' | 'week' | 'month'): Promise<Array<{ date: string; averageRating: number }>> {
    const response = await fetch(`/api/ratings/trends?range=${timeRange}`);
    return response.json();
  }

  private trackRatingEvent(event: string, properties: Record<string, any>) {
    // Track with analytics service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, properties);
    }
    
    // Track with Vercel Analytics
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va.track(event, properties);
    }
  }

  // Rating validation
  validateRating(rating: CommentaryRating): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!rating.fightId) {
      errors.push('Fight ID is required');
    }

    if (!rating.userId) {
      errors.push('User ID is required');
    }

    if (rating.rating < 1 || rating.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }

    if (rating.feedback && rating.feedback.length > 1000) {
      errors.push('Feedback must be less than 1000 characters');
    }

    if (!['technical', 'dramatic', 'casual'].includes(rating.commentaryStyle)) {
      errors.push('Invalid commentary style');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// React hook for rating functionality
export const useRatingSystem = () => {
  const ratingSystem = RatingSystem.getInstance();

  const submitRating = async (rating: Omit<CommentaryRating, 'timestamp'>) => {
    const fullRating: CommentaryRating = {
      ...rating,
      timestamp: new Date().toISOString(),
    };

    const validation = ratingSystem.validateRating(fullRating);
    if (!validation.valid) {
      throw new Error(`Rating validation failed: ${validation.errors.join(', ')}`);
    }

    await ratingSystem.submitRating(fullRating);
  };

  const getRating = async (fightId: string) => {
    return ratingSystem.getAverageRating(fightId);
  };

  const getRatingSummary = async (fightId: string) => {
    return ratingSystem.getRatingSummary(fightId);
  };

  return {
    submitRating,
    getRating,
    getRatingSummary,
  };
}; 