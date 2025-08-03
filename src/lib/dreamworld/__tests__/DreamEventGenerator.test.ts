import { DreamEventGenerator, dreamEventGenerator } from '../DreamEventGenerator'
import { DreamEvent, DreamworldTalent, DreamworldPlayerState } from '@/types/dreamworld'

describe('DreamEventGenerator', () => {
  let generator: DreamEventGenerator

  beforeEach(() => {
    generator = new DreamEventGenerator()
  })

  describe('generateEvent', () => {
    const mockPlayerState: DreamworldPlayerState = {
      id: 'player-1',
      player_id: 'player-1',
      current_era: '1920s',
      lucid_meter: 75,
      dream_level: 2,
      wellness_meter: 80,
      reality_glitches: [],
      current_location: 'Speakeasy',
      return_conditions: {},
      created_at: new Date().toISOString()
    }

    const mockTalent: DreamworldTalent = {
      id: 'talent-1',
      name: 'Duke Ellington',
      dream_era: '1920s',
      career_path: 'musician',
      era_specific_skills: {
        jazzImprovisation: 95,
        bandLeadership: 90,
        composition: 88
      },
      dream_anomaly: 'Sometimes plays songs from the future',
      lucid_events: [],
      real_world_link: null,
      notoriety: 85,
      current_location: 'Cotton Club',
      relationships: {},
      status: 'active',
      created_at: new Date().toISOString()
    }

    test('generates prophecy events correctly', () => {
      const event = generator.generateEvent('prophecy', 'boxer', '1920s', mockPlayerState, mockTalent)

      expect(event.dream_type).toBe('prophecy')
      expect(event.content).toBeTruthy()
      expect(event.impact_score).toBeGreaterThanOrEqual(70)
      expect(event.impact_score).toBeLessThanOrEqual(95)
      expect(event.actionable_insight).toBeTruthy()
      expect(event.career_path).toBe('boxer')
    })

    test('generates warning events with appropriate severity', () => {
      const event = generator.generateEvent('warning', 'singer', '1930s', mockPlayerState, mockTalent)

      expect(event.dream_type).toBe('warning')
      expect(event.impact_score).toBeGreaterThanOrEqual(60)
      expect(event.impact_score).toBeLessThanOrEqual(85)
      expect(event.content).toMatch(/danger|threat|risk|careful/i)
    })

    test('generates inspiration events with creative insights', () => {
      const event = generator.generateEvent('inspiration', 'actor', '1940s', mockPlayerState, mockTalent)

      expect(event.dream_type).toBe('inspiration')
      expect(event.impact_score).toBeGreaterThanOrEqual(65)
      expect(event.impact_score).toBeLessThanOrEqual(90)
      expect(event.content).toMatch(/style|approach|technique|method/i)
    })

    test('generates nightmare events with high impact', () => {
      const event = generator.generateEvent('nightmare', 'manager', '1950s', mockPlayerState, mockTalent)

      expect(event.dream_type).toBe('nightmare')
      expect(event.impact_score).toBeGreaterThanOrEqual(80)
      expect(event.impact_score).toBeLessThanOrEqual(95)
      expect(event.content).toMatch(/fear|shadow|dark|haunting/i)
    })

    test('generates vision events with mystical elements', () => {
      const event = generator.generateEvent('vision', 'promoter', '1920s', mockPlayerState, mockTalent)

      expect(event.dream_type).toBe('vision')
      expect(event.impact_score).toBeGreaterThanOrEqual(75)
      expect(event.impact_score).toBeLessThanOrEqual(100)
      expect(event.content).toMatch(/spirit|mystic|cosmic|ethereal/i)
    })

    test('incorporates talent information when provided', () => {
      const event = generator.generateEvent('prophecy', 'musician', '1920s', mockPlayerState, mockTalent)

      expect(event.content).toContain('Duke Ellington')
      expect(event.content.toLowerCase()).toMatch(/jazz|music|band|rhythm/)
    })

    test('adjusts content based on era', () => {
      const event1920s = generator.generateEvent('inspiration', 'singer', '1920s', mockPlayerState)
      const event1950s = generator.generateEvent('inspiration', 'singer', '1950s', mockPlayerState)

      expect(event1920s.content).toMatch(/jazz|speakeasy|prohibition|flapper/i)
      expect(event1950s.content).toMatch(/rock|diner|cadillac|television/i)
    })

    test('incorporates player state into events', () => {
      const lowLucidState = { ...mockPlayerState, lucid_meter: 20 }
      const highLucidState = { ...mockPlayerState, lucid_meter: 90 }

      const lowLucidEvent = generator.generateEvent('vision', 'boxer', '1920s', lowLucidState)
      const highLucidEvent = generator.generateEvent('vision', 'boxer', '1920s', highLucidState)

      // High lucid meter should generally produce higher impact events
      expect(highLucidEvent.impact_score).toBeGreaterThanOrEqual(lowLucidEvent.impact_score - 10)
    })
  })

  describe('generateMultipleEvents', () => {
    const mockPlayerState: DreamworldPlayerState = {
      id: 'player-1',
      player_id: 'player-1',
      current_era: '1930s',
      lucid_meter: 60,
      dream_level: 2,
      wellness_meter: 75,
      reality_glitches: [],
      current_location: 'Movie Theater',
      return_conditions: {},
      created_at: new Date().toISOString()
    }

    test('generates requested number of events', () => {
      const events = generator.generateMultipleEvents(5, 'actor', '1930s', mockPlayerState)

      expect(events).toHaveLength(5)
      events.forEach(event => {
        expect(event.dream_type).toBeDefined()
        expect(event.content).toBeTruthy()
        expect(event.impact_score).toBeGreaterThan(0)
      })
    })

    test('generates diverse event types', () => {
      const events = generator.generateMultipleEvents(10, 'manager', '1940s', mockPlayerState)
      
      const eventTypes = new Set(events.map(e => e.dream_type))
      expect(eventTypes.size).toBeGreaterThan(1) // Should have variety
    })

    test('maintains consistency with career path', () => {
      const events = generator.generateMultipleEvents(5, 'boxer', '1920s', mockPlayerState)

      events.forEach(event => {
        expect(event.career_path).toBe('boxer')
      })
    })
  })

  describe('generateDreamChoices', () => {
    test('generates appropriate number of choices', () => {
      const choices = generator.generateDreamChoices('prophecy', 75)

      expect(choices).toHaveLength(2) // Most events have 2 choices
      choices.forEach(choice => {
        expect(choice.text).toBeTruthy()
        expect(choice.impact).toBeTruthy()
        expect(choice.consequence).toBeTruthy()
      })
    })

    test('includes lucid choice when meter is sufficient', () => {
      const choices = generator.generateDreamChoices('vision', 80)

      const lucidChoice = choices.find(c => c.text.toLowerCase().includes('lucid'))
      expect(lucidChoice).toBeTruthy()
      expect(lucidChoice?.lucidCost).toBeGreaterThan(0)
    })

    test('excludes lucid choice when meter is too low', () => {
      const choices = generator.generateDreamChoices('nightmare', 10)

      const lucidChoice = choices.find(c => c.lucidCost && c.lucidCost > 0)
      expect(lucidChoice).toBeFalsy()
    })

    test('generates thematically appropriate choices', () => {
      const prophecyChoices = generator.generateDreamChoices('prophecy', 50)
      const nightmareChoices = generator.generateDreamChoices('nightmare', 50)

      expect(prophecyChoices[0].text).toMatch(/embrace|accept|follow/i)
      expect(nightmareChoices[0].text).toMatch(/face|confront|overcome/i)
    })
  })

  describe('Era Context', () => {
    const mockPlayerState: DreamworldPlayerState = {
      id: 'player-1',
      player_id: 'player-1',
      current_era: '1920s',
      lucid_meter: 50,
      dream_level: 1,
      wellness_meter: 100,
      reality_glitches: [],
      current_location: 'Dreamworld Entrance',
      return_conditions: {},
      created_at: new Date().toISOString()
    }

    test('generates era-appropriate content for 1920s', () => {
      const event = generator.generateEvent('inspiration', 'singer', '1920s', mockPlayerState)

      expect(event.content).toMatch(/jazz|speakeasy|prohibition|charleston|flapper|bootleg/i)
    })

    test('generates era-appropriate content for 1930s', () => {
      const event = generator.generateEvent('warning', 'actor', '1930s', mockPlayerState)

      expect(event.content).toMatch(/depression|hollywood|golden age|studio|talkies/i)
    })

    test('generates era-appropriate content for 1940s', () => {
      const event = generator.generateEvent('vision', 'manager', '1940s', mockPlayerState)

      expect(event.content).toMatch(/war|swing|big band|noir|victory/i)
    })

    test('generates era-appropriate content for 1950s', () => {
      const event = generator.generateEvent('prophecy', 'promoter', '1950s', mockPlayerState)

      expect(event.content).toMatch(/rock|television|atomic|suburban|diner/i)
    })
  })

  describe('Performance', () => {
    const mockPlayerState: DreamworldPlayerState = {
      id: 'player-1',
      player_id: 'player-1',
      current_era: '1920s',
      lucid_meter: 50,
      dream_level: 1,
      wellness_meter: 100,
      reality_glitches: [],
      current_location: 'Dreamworld',
      return_conditions: {},
      created_at: new Date().toISOString()
    }

    test('generates single event quickly', () => {
      const startTime = performance.now()
      
      generator.generateEvent('prophecy', 'boxer', '1920s', mockPlayerState)
      
      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(executionTime).toBeLessThan(10) // Should be very fast
    })

    test('generates bulk events efficiently', () => {
      const startTime = performance.now()
      
      generator.generateMultipleEvents(100, 'singer', '1930s', mockPlayerState)
      
      const endTime = performance.now()
      const executionTime = endTime - startTime

      expect(executionTime).toBeLessThan(100) // 100 events in under 100ms
    })

    test('handles concurrent generation', async () => {
      const promises = []
      
      for (let i = 0; i < 50; i++) {
        promises.push(
          Promise.resolve(
            generator.generateEvent('vision', 'actor', '1940s', mockPlayerState)
          )
        )
      }

      const startTime = performance.now()
      const results = await Promise.all(promises)
      const endTime = performance.now()

      expect(results).toHaveLength(50)
      expect(endTime - startTime).toBeLessThan(200)
    })
  })

  describe('Edge Cases', () => {
    test('handles missing player state gracefully', () => {
      const event = generator.generateEvent('prophecy', 'boxer', '1920s')

      expect(event).toBeDefined()
      expect(event.dream_type).toBe('prophecy')
      expect(event.content).toBeTruthy()
    })

    test('handles missing talent gracefully', () => {
      const mockPlayerState: DreamworldPlayerState = {
        id: 'player-1',
        player_id: 'player-1',
        current_era: '1920s',
        lucid_meter: 50,
        dream_level: 1,
        wellness_meter: 100,
        reality_glitches: [],
        current_location: 'Dreamworld',
        return_conditions: {},
        created_at: new Date().toISOString()
      }

      const event = generator.generateEvent('inspiration', 'singer', '1920s', mockPlayerState)

      expect(event).toBeDefined()
      expect(event.content).not.toContain('undefined')
    })

    test('handles invalid dream type by defaulting', () => {
      const event = generator.generateEvent('invalid_type' as any, 'boxer', '1920s')

      expect(event).toBeDefined()
      expect(['prophecy', 'warning', 'inspiration', 'nightmare', 'vision']).toContain(event.dream_type)
    })

    test('handles invalid era gracefully', () => {
      const event = generator.generateEvent('prophecy', 'singer', 'invalid_era' as any)

      expect(event).toBeDefined()
      expect(event.content).toBeTruthy()
      expect(event.content).not.toContain('undefined')
    })
  })

  describe('Module Export', () => {
    test('exports singleton instance', () => {
      expect(dreamEventGenerator).toBeInstanceOf(DreamEventGenerator)
    })

    test('generateDreamEvent function works correctly', async () => {
      const { generateDreamEvent } = require('../DreamEventGenerator')
      
      const event = await generateDreamEvent({
        dreamType: 'prophecy',
        careerPath: 'boxer',
        era: '1920s'
      })

      expect(event).toBeDefined()
      expect(event.dream_type).toBe('prophecy')
    })
  })
})