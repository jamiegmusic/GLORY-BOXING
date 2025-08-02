import { NextRequest } from 'next/server';
import { POST } from '../commentary/route';

const mockMatchSchema = {
  id: 'test-match-1',
  fighterA: {
    name: 'Carl Froch',
    record: '33-2-0',
    stats: {
      power: 85,
      speed: 75,
      defense: 80,
      stamina: 90,
      chin: 85
    }
  },
  fighterB: {
    name: 'Tony Bellew',
    record: '30-3-1',
    stats: {
      power: 80,
      speed: 80,
      defense: 75,
      stamina: 85,
      chin: 80
    }
  },
  venue: 'O2 Arena, London',
  date: '2024-01-15T20:00:00Z',
  weightClass: 'Light Heavyweight',
  titleFight: true,
  belt: 'WBC Light Heavyweight',
  rounds: 8,
  events: [
    {
      timestamp: '2024-01-15T20:03:15Z',
      round: 3,
      timeInRound: '2:15',
      action: 'knockdown',
      fighter: 'Carl Froch',
      impact: 'critical',
      location: 'head',
      eventType: 'offense'
    },
    {
      timestamp: '2024-01-15T20:04:30Z',
      round: 4,
      timeInRound: '1:30',
      action: 'punch',
      fighter: 'Tony Bellew',
      impact: 'medium',
      location: 'body',
      combo: true,
      comboCount: 3,
      eventType: 'offense'
    }
  ],
  rounds: [
    {
      round: 1,
      fighterA: 5,
      fighterB: 3,
      highlights: ['Carl Froch lands a heavy right hand']
    },
    {
      round: 2,
      fighterA: 4,
      fighterB: 6,
      highlights: ['Tony Bellew shows excellent footwork']
    }
  ],
  result: {
    winner: 'Carl Froch',
    method: 'ko',
    round: 8,
    timeInRound: '2:45',
    scorecard: {
      judge1: { fighterA: 67, fighterB: 66 },
      judge2: { fighterA: 68, fighterB: 65 },
      judge3: { fighterA: 67, fighterB: 66 }
    }
  },
  highlights: ['1 knockdown(s) in the fight', '1 significant combinations landed'],
  crowdReaction: 8,
  fightRating: 8.5
};

describe('Commentary API', () => {
  test('returns commentary for valid match schema', async () => {
    const request = new NextRequest('http://localhost:3000/api/commentary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schema: mockMatchSchema,
        style: 'aggressive',
        focus: 'drama'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('commentary');
    expect(data).toHaveProperty('highlights');
    expect(data).toHaveProperty('roundByRound');
    expect(data).toHaveProperty('analysis');
    expect(data).toHaveProperty('rating');

    expect(typeof data.commentary).toBe('string');
    expect(Array.isArray(data.highlights)).toBe(true);
    expect(Array.isArray(data.roundByRound)).toBe(true);
    expect(typeof data.analysis).toBe('string');
    expect(typeof data.rating).toBe('number');
  });

  test('handles different commentary styles', async () => {
    const styles = ['aggressive', 'analytical', 'neutral'];
    
    for (const style of styles) {
      const request = new NextRequest('http://localhost:3000/api/commentary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schema: mockMatchSchema,
          style,
          focus: 'balanced'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.commentary).toContain('Carl Froch');
      expect(data.commentary).toContain('Tony Bellew');
    }
  });

  test('handles different focus options', async () => {
    const focuses = ['technical', 'drama', 'balanced'];
    
    for (const focus of focuses) {
      const request = new NextRequest('http://localhost:3000/api/commentary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schema: mockMatchSchema,
          style: 'neutral',
          focus
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.commentary.length).toBeGreaterThan(0);
    }
  });

  test('returns error for invalid schema', async () => {
    const request = new NextRequest('http://localhost:3000/api/commentary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schema: { invalid: 'data' },
        style: 'neutral',
        focus: 'balanced'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toContain('Invalid match schema');
  });

  test('returns error for missing schema', async () => {
    const request = new NextRequest('http://localhost:3000/api/commentary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        style: 'neutral',
        focus: 'balanced'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
  });

  test('handles malformed JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/commentary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });

  test('generates commentary with knockdowns', async () => {
    const matchWithKnockdowns = {
      ...mockMatchSchema,
      events: [
        {
          timestamp: '2024-01-15T20:03:15Z',
          round: 3,
          timeInRound: '2:15',
          action: 'knockdown',
          fighter: 'Carl Froch',
          impact: 'critical',
          location: 'head',
          eventType: 'offense'
        }
      ]
    };

    const request = new NextRequest('http://localhost:3000/api/commentary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schema: matchWithKnockdowns,
        style: 'aggressive',
        focus: 'drama'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.commentary).toContain('knockdown');
    expect(data.highlights.some(h => h.includes('knockdown'))).toBe(true);
  });

  test('generates commentary with combinations', async () => {
    const matchWithCombos = {
      ...mockMatchSchema,
      events: [
        {
          timestamp: '2024-01-15T20:04:30Z',
          round: 4,
          timeInRound: '1:30',
          action: 'punch',
          fighter: 'Tony Bellew',
          impact: 'medium',
          location: 'body',
          combo: true,
          comboCount: 4,
          eventType: 'offense'
        }
      ]
    };

    const request = new NextRequest('http://localhost:3000/api/commentary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schema: matchWithCombos,
        style: 'analytical',
        focus: 'technical'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.commentary).toContain('combination');
    expect(data.highlights.some(h => h.includes('combination'))).toBe(true);
  });

  test('calculates rating based on fight events', async () => {
    const request = new NextRequest('http://localhost:3000/api/commentary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schema: mockMatchSchema,
        style: 'neutral',
        focus: 'balanced'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.rating).toBeGreaterThanOrEqual(1);
    expect(data.rating).toBeLessThanOrEqual(10);
  });

  test('includes venue and fighter information in commentary', async () => {
    const request = new NextRequest('http://localhost:3000/api/commentary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schema: mockMatchSchema,
        style: 'neutral',
        focus: 'balanced'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.commentary).toContain('O2 Arena');
    expect(data.commentary).toContain('Carl Froch');
    expect(data.commentary).toContain('Tony Bellew');
    expect(data.commentary).toContain('Light Heavyweight');
  });

  test('generates round-by-round commentary', async () => {
    const request = new NextRequest('http://localhost:3000/api/commentary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schema: mockMatchSchema,
        style: 'neutral',
        focus: 'balanced'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data.roundByRound)).toBe(true);
    expect(data.roundByRound.length).toBeGreaterThan(0);
    
    data.roundByRound.forEach(round => {
      expect(typeof round).toBe('string');
      expect(round.length).toBeGreaterThan(0);
    });
  });
}); 