import { supabase, Fighter, GameState, Fight } from '@/lib/supabase';

export class GameDataService {
  static async loadAllGameData() {
    try {
      const [fightersResult, gameStateResult, fightsResult] = await Promise.all([
        this.loadFighters(),
        this.loadGameState(),
        this.loadFights()
      ]);

      return {
        fighters: fightersResult,
        gameState: gameStateResult,
        fights: fightsResult,
        success: true
      };
    } catch (error) {
      console.error('Error loading game data:', error);
      return {
        fighters: [],
        gameState: null,
        fights: [],
        success: false,
        error
      };
    }
  }

  static async loadFighters(): Promise<Fighter[]> {
    const { data: fightersData } = await supabase
      .from('fighters')
      .select('*')
      .order('created_at', { ascending: false });

    return fightersData || [];
  }

  static async loadGameState(): Promise<GameState | null> {
    const { data: gameStateData } = await supabase
      .from('game_state')
      .select('*')
      .limit(1)
      .single();

    return gameStateData;
  }

  static async loadFights(): Promise<Fight[]> {
    const { data: fightsData } = await supabase
      .from('fights')
      .select('*')
      .order('fight_date', { ascending: true });

    return fightsData || [];
  }

  static async updateFighter(fighterId: string, updates: Partial<Fighter>): Promise<Fighter | null> {
    try {
      const { data, error } = await supabase
        .from('fighters')
        .update(updates)
        .eq('id', fighterId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating fighter:', error);
      return null;
    }
  }

  static async createTrainingCamp(campData: any) {
    try {
      const { data, error } = await supabase
        .from('training_camps')
        .insert(campData)
        .select()
        .single();

      if (error) throw error;

      // Update fighter's skill improvement rate
      const improvementRate = 1.0 + (campData.camp_quality / 100) * 0.5;
      await this.updateFighter(campData.fighter_id, {
        skill_improvement_rate: improvementRate,
        last_training_date: new Date().toISOString()
      });

      return data;
    } catch (error) {
      console.error('Error creating training camp:', error);
      throw error;
    }
  }

  static async createContract(contractData: any) {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert(contractData)
        .select()
        .single();

      if (error) throw error;

      // Update fighter's contract value
      await this.updateFighter(contractData.fighter_id, {
        contract_value: contractData.contract_value,
        current_purse: contractData.base_purse
      });

      return data;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  }
}
