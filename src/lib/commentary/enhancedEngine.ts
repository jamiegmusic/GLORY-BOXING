import { 
  EnhancedFightData, 
  FightEvent, 
  FighterMetadata, 
  isCombatEvent, 
  isScoringEvent, 
  isSignificantEvent,
  getEventDescription 
} from './schemas';
import { commentaryLogger } from '../logging/logger';
import { trackCommentaryGeneration } from '../monitoring/sentry';

export interface CommentaryStyle {
  tone: 'technical' | 'dramatic' | 'casual' | 'analytical' | 'entertaining';
  detailLevel: 'basic' | 'detailed' | 'expert';
  includeStats: boolean;
  includeBettingOdds: boolean;
  includeSponsorMentions: boolean;
  includeEnvironmentalContext: boolean;
}

export interface CommentaryContext {
  currentRound: number;
  totalRounds: number;
  timeElapsed: number;
  roundTime: number;
  crowdEnergy: number; // 0-100
  fightMomentum: 'fighter_a' | 'fighter_b' | 'even';
  significantEvents: FightEvent[];
  recentActivity: FightEvent[];
}

export class EnhancedCommentaryEngine {
  private style: CommentaryStyle;
  private logger = commentaryLogger;

  constructor(style: CommentaryStyle) {
    this.style = style;
  }

  async generateCommentary(fightData: EnhancedFightData): Promise<string> {
    const startTime = Date.now();
    
    try {
      this.logger.info('Starting enhanced commentary generation', { 
        fightId: fightData.fightId,
        style: this.style.tone 
      });

      const context = this.buildContext(fightData);
      const commentary = await this.generateFullCommentary(fightData, context);
      
      const generationTime = Date.now() - startTime;
      await trackCommentaryGeneration(fightData.fightId, generationTime, true);
      
      this.logger.info('Enhanced commentary generation completed', { 
        fightId: fightData.fightId,
        generationTime,
        wordCount: commentary.split(' ').length
      });

      return commentary;
    } catch (error) {
      this.logger.error('Enhanced commentary generation failed', error as Error, { 
        fightId: fightData.fightId 
      });
      await trackCommentaryGeneration(fightData.fightId, Date.now() - startTime, false);
      throw error;
    }
  }

  private buildContext(fightData: EnhancedFightData): CommentaryContext {
    const significantEvents = fightData.events.filter(isSignificantEvent);
    const recentActivity = fightData.events.slice(-10); // Last 10 events
    
    // Calculate fight momentum based on recent significant events
    const recentSignificant = significantEvents.slice(-5);
    const fighterAScore = recentSignificant.filter(e => e.fighter === 'fighter_a').length;
    const fighterBScore = recentSignificant.filter(e => e.fighter === 'fighter_b').length;
    
    let momentum: 'fighter_a' | 'fighter_b' | 'even' = 'even';
    if (fighterAScore > fighterBScore + 1) momentum = 'fighter_a';
    else if (fighterBScore > fighterAScore + 1) momentum = 'fighter_b';

    return {
      currentRound: Math.max(...fightData.events.map(e => e.round)),
      totalRounds: fightData.rounds,
      timeElapsed: Math.max(...fightData.events.map(e => e.timestamp)),
      roundTime: 180, // 3 minutes per round
      crowdEnergy: this.calculateCrowdEnergy(fightData.events),
      fightMomentum: momentum,
      significantEvents,
      recentActivity,
    };
  }

  private calculateCrowdEnergy(events: FightEvent[]): number {
    const reactions = events
      .map(e => e.details.crowdReaction)
      .filter(Boolean);
    
    if (reactions.length === 0) return 50; // Neutral
    
    const energyMap: Record<string, number> = {
      'roar': 90,
      'cheer': 75,
      'applause': 60,
      'gasp': 40,
      'silence': 30,
      'boo': 20,
    };
    
    const totalEnergy = reactions.reduce((sum, reaction) => {
      return sum + (energyMap[reaction!] || 50);
    }, 0);
    
    return Math.round(totalEnergy / reactions.length);
  }

  private async generateFullCommentary(fightData: EnhancedFightData, context: CommentaryContext): Promise<string> {
    const sections = [
      this.generateIntroduction(fightData),
      this.generateFighterAnalysis(fightData),
      this.generatePreFightContext(fightData),
      this.generateRoundByRoundCommentary(fightData, context),
      this.generateFightAnalysis(fightData, context),
      this.generateConclusion(fightData, context),
    ];

    return sections.filter(Boolean).join('\n\n');
  }

  private generateIntroduction(fightData: EnhancedFightData): string {
    const { fighters, venue, title, weightClass } = fightData;
    
    let intro = `Welcome to ${venue} for this ${weightClass} showdown`;
    
    if (title) {
      intro += ` for the ${title}`;
    }
    
    intro += ` between ${fighters.fighterA.name}`;
    if (fighters.fighterA.nickname) {
      intro += ` "${fighters.fighterA.nickname}"`;
    }
    intro += ` and ${fighters.fighterB.name}`;
    if (fighters.fighterB.nickname) {
      intro += ` "${fighters.fighterB.nickname}"`;
    }
    intro += '.';
    
    if (this.style.includeStats) {
      intro += `\n\n${fighters.fighterA.name} comes in with a record of ${fighters.fighterA.record.wins}-${fighters.fighterA.record.losses}-${fighters.fighterA.record.draws}`;
      intro += `, while ${fighters.fighterB.name} sports a ${fighters.fighterB.record.wins}-${fighters.fighterB.record.losses}-${fighters.fighterB.record.draws} record.`;
    }
    
    return intro;
  }

  private generateFighterAnalysis(fightData: EnhancedFightData): string {
    const { fighters } = fightData;
    let analysis = '';
    
    if (this.style.detailLevel === 'expert') {
      analysis += `\n\nFighter Analysis:\n`;
      analysis += `${fighters.fighterA.name} (${fighters.fighterA.height}, ${fighters.fighterA.reach} reach)`;
      analysis += ` brings ${fighters.fighterA.fightingStyle} style with strengths in ${fighters.fighterA.strengths.join(', ')}.`;
      analysis += ` Known for ${fighters.fighterA.signatureMoves?.join(', ') || 'technical precision'}.`;
      
      analysis += `\n\n${fighters.fighterB.name} (${fighters.fighterB.height}, ${fighters.fighterB.reach} reach)`;
      analysis += ` employs ${fighters.fighterB.fightingStyle} with ${fighters.fighterB.strengths.join(', ')}.`;
      analysis += ` Areas of concern: ${fighters.fighterB.weaknesses.join(', ')}.`;
    }
    
    return analysis;
  }

  private generatePreFightContext(fightData: EnhancedFightData): string {
    const { preFightContext, sponsorContext } = fightData;
    let context = '';
    
    if (preFightContext.preFightComments.fighterA || preFightContext.preFightComments.fighterB) {
      context += `\n\nPre-fight comments set the tone: "${preFightContext.preFightComments.fighterA}" - ${fightData.fighters.fighterA.name}.`;
      context += ` "${preFightContext.preFightComments.fighterB}" - ${fightData.fighters.fighterB.name}.`;
    }
    
    if (this.style.includeBettingOdds && preFightContext.bettingOdds) {
      context += `\n\nThe betting odds favor ${preFightContext.bettingOdds.fighterA < preFightContext.bettingOdds.fighterB ? fightData.fighters.fighterA.name : fightData.fighters.fighterB.name} at ${Math.min(preFightContext.bettingOdds.fighterA, preFightContext.bettingOdds.fighterB)} to 1.`;
    }
    
    if (this.style.includeSponsorMentions && sponsorContext.sponsorMentions.length > 0) {
      context += `\n\nTonight's event is brought to you by ${sponsorContext.sponsorMentions.join(', ')}.`;
    }
    
    return context;
  }

  private generateRoundByRoundCommentary(fightData: EnhancedFightData, context: CommentaryContext): string {
    const roundEvents = this.groupEventsByRound(fightData.events);
    let commentary = '\n\nRound by Round Commentary:\n';
    
    for (const [round, events] of Array.from(roundEvents.entries())) {
      commentary += `\nRound ${round}:\n`;
      commentary += this.generateRoundCommentary(events, fightData, context);
    }
    
    return commentary;
  }

  private groupEventsByRound(events: FightEvent[]): Map<number, FightEvent[]> {
    const rounds = new Map<number, FightEvent[]>();
    
    for (const event of events) {
      if (!rounds.has(event.round)) {
        rounds.set(event.round, []);
      }
      rounds.get(event.round)!.push(event);
    }
    
    return rounds;
  }

  private generateRoundCommentary(events: FightEvent[], fightData: EnhancedFightData, context: CommentaryContext): string {
    let commentary = '';
    const significantEvents = events.filter(isSignificantEvent);
    
    for (const event of significantEvents) {
      commentary += this.generateEventCommentary(event, fightData);
    }
    
    // Add scoring if available
    const scoringEvent = events.find(isScoringEvent);
    if (scoringEvent && scoringEvent.details.roundScore) {
      const score = scoringEvent.details.roundScore;
      commentary += `\nRound scores: ${fightData.fighters.fighterA.name} ${score.fighter_a}, ${fightData.fighters.fighterB.name} ${score.fighter_b}.`;
    }
    
    return commentary;
  }

  public generateEventCommentary(event: FightEvent, fightData: EnhancedFightData): string {
    const fighterName = event.fighter === 'fighter_a' ? fightData.fighters.fighterA.name : fightData.fighters.fighterB.name;
    const description = getEventDescription(event);
    
    let commentary = `\n${fighterName} with ${description}.`;
    
    if (event.details.significance === 'decisive') {
      commentary += ` This could be a turning point in the fight!`;
    }
    
    if (event.details.crowdReaction) {
      const reactionMap: Record<string, string> = {
        'roar': 'The crowd erupts!',
        'cheer': 'The crowd cheers!',
        'gasp': 'The crowd gasps!',
        'applause': 'Applause from the crowd.',
        'silence': 'Silence from the crowd.',
        'boo': 'The crowd boos.',
      };
      commentary += ` ${reactionMap[event.details.crowdReaction]}`;
    }
    
    if (this.style.detailLevel === 'detailed' && event.details.accuracy !== undefined) {
      commentary += ` Accuracy: ${event.details.accuracy}%.`;
    }
    
    if (this.style.detailLevel === 'detailed' && event.details.power !== undefined) {
      commentary += ` Power: ${event.details.power}/100.`;
    }
    
    return commentary;
  }

  private generateFightAnalysis(fightData: EnhancedFightData, context: CommentaryContext): string {
    let analysis = '\n\nFight Analysis:\n';
    
    analysis += `The fight has been ${context.fightMomentum === 'even' ? 'closely contested' : `dominated by ${fightData.fighters[context.fightMomentum].name}`}.`;
    
    if (this.style.includeEnvironmentalContext && fightData.ringsideStats) {
      const { temperature, humidity, attendance } = fightData.ringsideStats;
      analysis += `\n\nRing conditions: ${temperature}°C with ${humidity}% humidity.`;
      analysis += ` Attendance: ${attendance.toLocaleString()} fans.`;
    }
    
    if (context.crowdEnergy > 70) {
      analysis += `\n\nThe crowd energy is electric!`;
    } else if (context.crowdEnergy < 30) {
      analysis += `\n\nThe crowd has been relatively quiet.`;
    }
    
    return analysis;
  }

  private generateConclusion(fightData: EnhancedFightData, context: CommentaryContext): string {
    if (!fightData.result) {
      return '\n\nThe fight continues...';
    }
    
    const { result } = fightData;
    let conclusion = '\n\nFight Result:\n';
    
    if (result.winner === 'draw') {
      conclusion += `The fight ends in a draw.`;
    } else if (result.winner === 'no_contest') {
      conclusion += `The fight is declared a no contest.`;
    } else {
      const winner = fightData.fighters[result.winner];
      conclusion += `${winner.name} wins by ${result.method.toUpperCase()}`;
      
      if (result.round) {
        conclusion += ` in round ${result.round}`;
      }
      
      if (result.time) {
        conclusion += ` at ${result.time}`;
      }
      
      conclusion += '!';
    }
    
    if (result.scorecard) {
      conclusion += `\n\nFinal scorecard:`;
      conclusion += `\nJudge 1: ${result.scorecard.judge1.fighter_a}-${result.scorecard.judge1.fighter_b}`;
      conclusion += `\nJudge 2: ${result.scorecard.judge2.fighter_a}-${result.scorecard.judge2.fighter_b}`;
      conclusion += `\nJudge 3: ${result.scorecard.judge3.fighter_a}-${result.scorecard.judge3.fighter_b}`;
    }
    
    return conclusion;
  }

} 