import { Fighter, Fight } from './supabase'

export interface FightResult {
  winner_id: string
  loser_id: string
  result_type: 'decision' | 'ko' | 'tko' | 'draw' | 'no_contest'
  round_ended?: number
  time_in_round?: string
  fighter1_punches_landed: number
  fighter1_punches_thrown: number
  fighter2_punches_landed: number
  fighter2_punches_thrown: number
  gate_receipts: number
  ppv_buys: number
  total_revenue: number
  fight_rating: number
  crowd_reaction: number
  media_coverage_rating: number
  commentary: string[]
}

export class MatchSimulator {
  private fighter1: Fighter
  private fighter2: Fighter
  private fight: Fight
  private rounds: number

  constructor(fighter1: Fighter, fighter2: Fighter, fight: Fight) {
    this.fighter1 = fighter1
    this.fighter2 = fighter2
    this.fight = fight
    this.rounds = fight.rounds_scheduled
  }

  simulate(): FightResult {
    const commentary: string[] = []
    let fighter1Score = 0
    let fighter2Score = 0
    let fighter1PunchesLanded = 0
    let fighter1PunchesThrown = 0
    let fighter2PunchesLanded = 0
    let fighter2PunchesThrown = 0
    let roundEnded = 0
    let resultType: 'decision' | 'ko' | 'tko' | 'draw' | 'no_contest' = 'decision'

    // Add fight intro commentary
    commentary.push(`Welcome to ${this.fight.event_name}!`)
    commentary.push(`${this.fighter1.name} vs ${this.fighter2.name} in a ${this.rounds}-round bout.`)

    // Simulate each round
    for (let round = 1; round <= this.rounds; round++) {
      const roundResult = this.simulateRound(round)
      
      fighter1Score += roundResult.fighter1Score
      fighter2Score += roundResult.fighter2Score
      fighter1PunchesLanded += roundResult.fighter1PunchesLanded
      fighter1PunchesThrown += roundResult.fighter1PunchesThrown
      fighter2PunchesLanded += roundResult.fighter2PunchesLanded
      fighter2PunchesThrown += roundResult.fighter2PunchesThrown

      commentary.push(...roundResult.commentary)

      // Check for knockout
      if (roundResult.knockout) {
        roundEnded = round
        resultType = 'ko'
        commentary.push(`${roundResult.knockoutWinner} wins by knockout in round ${round}!`)
        break
      }

      // Check for TKO
      if (roundResult.tko) {
        roundEnded = round
        resultType = 'tko'
        commentary.push(`${roundResult.tkoWinner} wins by TKO in round ${round}!`)
        break
      }
    }

    // Determine winner
    let winner_id = this.fighter1.id
    let loser_id = this.fighter2.id

    if (resultType === 'decision') {
      if (fighter1Score > fighter2Score) {
        commentary.push(`${this.fighter1.name} wins by decision!`)
      } else if (fighter2Score > fighter1Score) {
        winner_id = this.fighter2.id
        loser_id = this.fighter1.id
        commentary.push(`${this.fighter2.name} wins by decision!`)
      } else {
        resultType = 'draw'
        commentary.push("It's a draw!")
      }
    }

    // Calculate revenue
    const baseGate = 50000
    const fighter1Popularity = this.fighter1.record_wins / (this.fighter1.record_wins + this.fighter1.record_losses)
    const fighter2Popularity = this.fighter2.record_wins / (this.fighter2.record_wins + this.fighter2.record_losses)
    const totalPopularity = fighter1Popularity + fighter2Popularity
    
    const gateReceipts = baseGate * (1 + totalPopularity)
    const ppvBuys = this.fight.championship_fight ? 100000 : 25000
    const totalRevenue = gateReceipts + (ppvBuys * 50) // $50 per PPV

    const fightRating = Math.min(10, (fighter1Score + fighter2Score) / this.rounds / 10)
    const crowdReaction = Math.min(10, totalPopularity * 5)
    const mediaCoverageRating = this.fight.championship_fight ? 9 : 6

    return {
      winner_id,
      loser_id,
      result_type: resultType,
      round_ended: roundEnded || undefined,
      fighter1_punches_landed: fighter1PunchesLanded,
      fighter1_punches_thrown: fighter1PunchesThrown,
      fighter2_punches_landed: fighter2PunchesLanded,
      fighter2_punches_thrown: fighter2PunchesThrown,
      gate_receipts: gateReceipts,
      ppv_buys: ppvBuys,
      total_revenue: totalRevenue,
      fight_rating: fightRating,
      crowd_reaction: crowdReaction,
      media_coverage_rating: mediaCoverageRating,
      commentary
    }
  }

  private simulateRound(round: number): {
    fighter1Score: number
    fighter2Score: number
    fighter1PunchesLanded: number
    fighter1PunchesThrown: number
    fighter2PunchesLanded: number
    fighter2PunchesThrown: number
    commentary: string[]
    knockout?: boolean
    knockoutWinner?: string
    tko?: boolean
    tkoWinner?: string
  } {
    const commentary: string[] = []
    commentary.push(`Round ${round} begins!`)

    // Calculate fighter effectiveness
    const fighter1Effectiveness = this.calculateEffectiveness(this.fighter1)
    const fighter2Effectiveness = this.calculateEffectiveness(this.fighter2)

    // Simulate punches
    const fighter1PunchesThrown = Math.floor(Math.random() * 50) + 30
    const fighter2PunchesThrown = Math.floor(Math.random() * 50) + 30

    const fighter1PunchesLanded = Math.floor(fighter1PunchesThrown * fighter1Effectiveness)
    const fighter2PunchesLanded = Math.floor(fighter2PunchesThrown * fighter2Effectiveness)

    // Calculate round scores
    const fighter1Score = Math.floor(fighter1PunchesLanded * 0.3 + Math.random() * 10)
    const fighter2Score = Math.floor(fighter2PunchesLanded * 0.3 + Math.random() * 10)

    // Add round commentary
    if (fighter1PunchesLanded > fighter2PunchesLanded) {
      commentary.push(`${this.fighter1.name} lands more punches this round.`)
    } else if (fighter2PunchesLanded > fighter1PunchesLanded) {
      commentary.push(`${this.fighter2.name} lands more punches this round.`)
    } else {
      commentary.push("Both fighters are evenly matched this round.")
    }

    // Check for knockout (1% chance per round)
    if (Math.random() < 0.01) {
      const knockoutWinner = Math.random() > 0.5 ? this.fighter1.name : this.fighter2.name
      commentary.push(`${knockoutWinner} lands a devastating knockout punch!`)
      return {
        fighter1Score,
        fighter2Score,
        fighter1PunchesLanded,
        fighter1PunchesThrown,
        fighter2PunchesLanded,
        fighter2PunchesThrown,
        commentary,
        knockout: true,
        knockoutWinner
      }
    }

    // Check for TKO (0.5% chance per round)
    if (Math.random() < 0.005) {
      const tkoWinner = Math.random() > 0.5 ? this.fighter1.name : this.fighter2.name
      commentary.push(`The referee stops the fight! ${tkoWinner} wins by TKO!`)
      return {
        fighter1Score,
        fighter2Score,
        fighter1PunchesLanded,
        fighter1PunchesThrown,
        fighter2PunchesLanded,
        fighter2PunchesThrown,
        commentary,
        tko: true,
        tkoWinner
      }
    }

    return {
      fighter1Score,
      fighter2Score,
      fighter1PunchesLanded,
      fighter1PunchesThrown,
      fighter2PunchesLanded,
      fighter2PunchesThrown,
      commentary
    }
  }

  private calculateEffectiveness(fighter: Fighter): number {
    const baseEffectiveness = (
      fighter.punching_power * 0.2 +
      fighter.speed * 0.2 +
      fighter.defense * 0.15 +
      fighter.stamina * 0.15 +
      fighter.ring_iq * 0.15 +
      fighter.mental_toughness * 0.15
    ) / 100

    // Apply confidence and motivation modifiers
    const confidenceModifier = fighter.confidence / 100
    const motivationModifier = fighter.motivation / 100

    return baseEffectiveness * (1 + confidenceModifier * 0.3 + motivationModifier * 0.2)
  }
} 