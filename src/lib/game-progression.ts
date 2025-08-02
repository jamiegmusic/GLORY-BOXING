import { supabase, GameState, Fighter } from './supabase';

export class GameProgression {
  static async advanceWeek(gameState: GameState, fighters: Fighter[]) {
    try {
      // Calculate weekly revenue
      const revenue = await this.calculateWeeklyRevenue(gameState, fighters);
      
      // Calculate new reputation
      const newReputation = this.calculateNewReputation(gameState, fighters);
      
      // Update game state
      const updatedGameState = {
        ...gameState,
        game_week: gameState.game_week + 1,
        total_money: gameState.total_money + revenue,
        reputation: Math.max(0, Math.min(100, newReputation)),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('game_state')
        .update(updatedGameState)
        .eq('id', gameState.id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error advancing week:', error);
      throw error;
    }
  }

  static async calculateWeeklyRevenue(gameState: GameState, fighters: Fighter[]): Promise<number> {
    let revenue = 0;

    // Base weekly revenue from fighter contracts
    const contractRevenue = fighters.reduce((sum, fighter) => {
      return sum + (fighter.contract_value * 0.01); // 1% of contract value per week
    }, 0);

    // Revenue from active fighters (higher reputation = more revenue)
    const activeFighterRevenue = fighters
      .filter(fighter => fighter.is_available && !fighter.is_injured)
      .reduce((sum, fighter) => {
        const baseRevenue = fighter.current_purse * 0.05; // 5% of current purse
        const reputationMultiplier = 1 + (gameState.reputation / 100);
        return sum + (baseRevenue * reputationMultiplier);
      }, 0);

    // Sponsorship revenue based on reputation
    const sponsorshipRevenue = gameState.reputation * 100; // £100 per reputation point

    // Event revenue (if any fights were held)
    const eventRevenue = 0; // This would be calculated based on actual fights

    revenue = contractRevenue + activeFighterRevenue + sponsorshipRevenue + eventRevenue;

    return Math.floor(revenue);
  }

  static calculateNewReputation(gameState: GameState, fighters: Fighter[]): number {
    let reputationChange = 0;

    // Reputation from fighter performance
    const championCount = fighters.filter(f => f.career_stage === 'champion').length;
    const contenderCount = fighters.filter(f => f.career_stage === 'contender').length;
    const prospectCount = fighters.filter(f => f.career_stage === 'prospect').length;

    reputationChange += championCount * 5; // +5 per champion
    reputationChange += contenderCount * 2; // +2 per contender
    reputationChange += prospectCount * 1; // +1 per prospect

    // Reputation from fighter quality
    const averageConfidence = fighters.reduce((sum, f) => sum + f.confidence, 0) / Math.max(fighters.length, 1);
    if (averageConfidence > 80) reputationChange += 3;
    else if (averageConfidence < 40) reputationChange -= 2;

    // Random reputation fluctuation
    reputationChange += Math.floor(Math.random() * 5) - 2; // -2 to +2

    return gameState.reputation + reputationChange;
  }

  static async updateFighterMorale(fighters: Fighter[]): Promise<void> {
    try {
      for (const fighter of fighters) {
        let moraleChange = 0;

        // Morale based on recent performance
        const winRate = fighter.record_wins / Math.max(fighter.record_wins + fighter.record_losses, 1);
        if (winRate > 0.7) moraleChange += 5;
        else if (winRate < 0.3) moraleChange -= 3;

        // Morale based on contract satisfaction
        const contractSatisfaction = fighter.current_purse / Math.max(fighter.contract_value, 1);
        if (contractSatisfaction > 1.2) moraleChange += 3;
        else if (contractSatisfaction < 0.8) moraleChange -= 2;

        // Random morale fluctuation
        moraleChange += Math.floor(Math.random() * 6) - 3; // -3 to +2

        const newConfidence = Math.max(0, Math.min(100, fighter.confidence + moraleChange));
        const newMotivation = Math.max(0, Math.min(100, fighter.motivation + moraleChange));

        await supabase
          .from('fighters')
          .update({
            confidence: newConfidence,
            motivation: newMotivation,
            updated_at: new Date().toISOString()
          })
          .eq('id', fighter.id);
      }
    } catch (error) {
      console.error('Error updating fighter morale:', error);
    }
  }

  static async generateWeeklyEvents(gameState: GameState, fighters: Fighter[]): Promise<any[]> {
    const events = [];

    // Generate random events based on game state
    if (fighters.length === 0) {
      events.push({
        type: 'info',
        title: 'No Fighters Available',
        description: 'You need to create some fighters to start your boxing empire!',
        timestamp: new Date().toISOString()
      });
    } else {
      // Random events
      const eventTypes = [
        {
          type: 'opportunity',
          title: 'Sponsorship Opportunity',
          description: 'A major sponsor is interested in your fighters. This could boost your revenue significantly.',
          effect: { reputation: 5, revenue: 5000 }
        },
        {
          type: 'challenge',
          title: 'Fighter Injury',
          description: 'One of your fighters has suffered a minor injury during training.',
          effect: { fighterMorale: -10 }
        },
        {
          type: 'success',
          title: 'Training Success',
          description: 'Your fighters have had an excellent week of training.',
          effect: { fighterMorale: 5, reputation: 2 }
        }
      ];

      // 30% chance of a random event
      if (Math.random() < 0.3) {
        const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        events.push({
          ...randomEvent,
          timestamp: new Date().toISOString()
        });
      }
    }

    return events;
  }

  static async processWeeklyProgression(): Promise<{
    gameState: GameState;
    events: any[];
    revenue: number;
  }> {
    try {
      // Get current game state
      const { data: gameStateData } = await supabase
        .from('game_state')
        .select('*')
        .limit(1)
        .single();

      if (!gameStateData) {
        throw new Error('No game state found');
      }

      // Get all fighters
      const { data: fightersData } = await supabase
        .from('fighters')
        .select('*');

      const fighters = fightersData || [];

      // Advance the week
      const updatedGameState = await this.advanceWeek(gameStateData, fighters);

      // Update fighter morale
      await this.updateFighterMorale(fighters);

      // Generate weekly events
      const events = await this.generateWeeklyEvents(updatedGameState, fighters);

      // Calculate revenue for this week
      const revenue = await this.calculateWeeklyRevenue(gameStateData, fighters);

      return {
        gameState: updatedGameState,
        events,
        revenue
      };
    } catch (error) {
      console.error('Error processing weekly progression:', error);
      throw error;
    }
  }
} 