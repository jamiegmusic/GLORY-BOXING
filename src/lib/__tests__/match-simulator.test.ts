import { EnhancedMatchSimulator } from '../match-simulator';

const mockFighterA = {
  name: 'Carl Froch',
  record: '33-2-0',
  stats: {
    power: 85,
    speed: 75,
    defense: 80,
    stamina: 90,
    chin: 85
  }
};

const mockFighterB = {
  name: 'Tony Bellew',
  record: '30-3-1',
  stats: {
    power: 80,
    speed: 80,
    defense: 75,
    stamina: 85,
    chin: 80
  }
};

describe('EnhancedMatchSimulator', () => {
  let simulator: EnhancedMatchSimulator;

  beforeEach(() => {
    simulator = new EnhancedMatchSimulator(
      mockFighterA,
      mockFighterB,
      'O2 Arena, London',
      'Light Heavyweight',
      true,
      'WBC Light Heavyweight'
    );
  });

  test('creates simulator with correct initial state', () => {
    expect(simulator).toBeInstanceOf(EnhancedMatchSimulator);
  });

  test('simulates match and returns valid result', () => {
    const result = simulator.simulateMatch();

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('fighterA', mockFighterA);
    expect(result).toHaveProperty('fighterB', mockFighterB);
    expect(result).toHaveProperty('venue', 'O2 Arena, London');
    expect(result).toHaveProperty('weightClass', 'Light Heavyweight');
    expect(result).toHaveProperty('titleFight', true);
    expect(result).toHaveProperty('belt', 'WBC Light Heavyweight');
    expect(result).toHaveProperty('events');
    expect(result).toHaveProperty('rounds');
    expect(result).toHaveProperty('result');
    expect(result).toHaveProperty('highlights');
    expect(result).toHaveProperty('crowdReaction');
    expect(result).toHaveProperty('fightRating');
  });

  test('generates events with correct structure', () => {
    const result = simulator.simulateMatch();
    
    expect(Array.isArray(result.events)).toBe(true);
    expect(result.events.length).toBeGreaterThan(0);

    result.events.forEach(event => {
      expect(event).toHaveProperty('timestamp');
      expect(event).toHaveProperty('round');
      expect(event).toHaveProperty('timeInRound');
      expect(event).toHaveProperty('action');
      expect(event).toHaveProperty('fighter');
      expect(event).toHaveProperty('eventType');
      
      // Validate action types
      expect(['punch', 'block', 'dodge', 'clinched', 'slip', 'counter', 'feint', 'knockdown', 'standingEight', 'cornerAdvice']).toContain(event.action);
      
      // Validate event types
      expect(['offense', 'defense', 'tactical']).toContain(event.eventType);
      
      // Validate fighter names
      expect([mockFighterA.name, mockFighterB.name]).toContain(event.fighter);
    });
  });

  test('generates round scores correctly', () => {
    const result = simulator.simulateMatch();
    
    expect(Array.isArray(result.rounds)).toBe(true);
    expect(result.rounds.length).toBeGreaterThan(0);

    result.rounds.forEach(round => {
      expect(round).toHaveProperty('round');
      expect(round).toHaveProperty('fighterA');
      expect(round).toHaveProperty('fighterB');
      expect(round).toHaveProperty('highlights');
      
      expect(typeof round.fighterA).toBe('number');
      expect(typeof round.fighterB).toBe('number');
      expect(Array.isArray(round.highlights)).toBe(true);
    });
  });

  test('determines winner correctly', () => {
    const result = simulator.simulateMatch();
    
    expect(result.result).toHaveProperty('winner');
    expect(result.result).toHaveProperty('method');
    
    const validMethods = ['decision', 'ko', 'tko', 'draw', 'no_contest'];
    expect(validMethods).toContain(result.result.method);
    
    // Winner should be one of the fighters or 'Draw'
    const validWinners = [mockFighterA.name, mockFighterB.name, 'Draw'];
    expect(validWinners).toContain(result.result.winner);
  });

  test('generates highlights based on events', () => {
    const result = simulator.simulateMatch();
    
    expect(Array.isArray(result.highlights)).toBe(true);
    
    const knockdowns = result.events.filter(e => e.action === 'knockdown');
    const combos = result.events.filter(e => e.combo && e.comboCount && e.comboCount >= 3);
    const clinches = result.events.filter(e => e.action === 'clinched');
    
    if (knockdowns.length > 0) {
      expect(result.highlights.some(h => h.includes('knockdown'))).toBe(true);
    }
    
    if (combos.length > 0) {
      expect(result.highlights.some(h => h.includes('combination'))).toBe(true);
    }
    
    if (clinches.length > 0) {
      expect(result.highlights.some(h => h.includes('clinches'))).toBe(true);
    }
  });

  test('calculates crowd reaction and fight rating', () => {
    const result = simulator.simulateMatch();
    
    expect(typeof result.crowdReaction).toBe('number');
    expect(result.crowdReaction).toBeGreaterThanOrEqual(1);
    expect(result.crowdReaction).toBeLessThanOrEqual(10);
    
    expect(typeof result.fightRating).toBe('number');
    expect(result.fightRating).toBeGreaterThanOrEqual(1);
    expect(result.fightRating).toBeLessThanOrEqual(10);
  });

  test('handles title fights with 12 rounds', () => {
    const titleSimulator = new EnhancedMatchSimulator(
      mockFighterA,
      mockFighterB,
      'O2 Arena, London',
      'Light Heavyweight',
      true
    );
    
    const result = titleSimulator.simulateMatch();
    expect(result.rounds).toBeLessThanOrEqual(12);
  });

  test('handles non-title fights with 10 rounds', () => {
    const nonTitleSimulator = new EnhancedMatchSimulator(
      mockFighterA,
      mockFighterB,
      'O2 Arena, London',
      'Light Heavyweight',
      false
    );
    
    const result = nonTitleSimulator.simulateMatch();
    expect(result.rounds).toBeLessThanOrEqual(10);
  });

  test('generates events with impact levels for punches', () => {
    const result = simulator.simulateMatch();
    
    const punches = result.events.filter(e => e.action === 'punch');
    
    punches.forEach(punch => {
      expect(punch).toHaveProperty('impact');
      expect(['light', 'medium', 'heavy', 'critical']).toContain(punch.impact);
      expect(punch).toHaveProperty('location');
      expect(['head', 'body', 'arms', 'legs']).toContain(punch.location);
    });
  });

  test('generates combo events correctly', () => {
    const result = simulator.simulateMatch();
    
    const combos = result.events.filter(e => e.combo);
    
    combos.forEach(combo => {
      expect(combo).toHaveProperty('comboCount');
      expect(typeof combo.comboCount).toBe('number');
      expect(combo.comboCount).toBeGreaterThanOrEqual(2);
      expect(combo.comboCount).toBeLessThanOrEqual(5);
    });
  });

  test('generates corner advice when stamina is low', () => {
    const result = simulator.simulateMatch();
    
    const cornerAdvice = result.events.filter(e => e.action === 'cornerAdvice');
    
    if (cornerAdvice.length > 0) {
      cornerAdvice.forEach(advice => {
        expect(advice).toHaveProperty('description');
        expect(typeof advice.description).toBe('string');
        expect(advice.description.length).toBeGreaterThan(0);
      });
    }
  });

  test('generates scorecard with judge scores', () => {
    const result = simulator.simulateMatch();
    
    if (result.result.scorecard) {
      expect(result.result.scorecard).toHaveProperty('judge1');
      expect(result.result.scorecard).toHaveProperty('judge2');
      expect(result.result.scorecard).toHaveProperty('judge3');
      
      expect(result.result.scorecard.judge1).toHaveProperty('fighterA');
      expect(result.result.scorecard.judge1).toHaveProperty('fighterB');
      expect(result.result.scorecard.judge2).toHaveProperty('fighterA');
      expect(result.result.scorecard.judge2).toHaveProperty('fighterB');
      expect(result.result.scorecard.judge3).toHaveProperty('fighterA');
      expect(result.result.scorecard.judge3).toHaveProperty('fighterB');
    }
  });
}); 