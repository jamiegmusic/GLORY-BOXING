import { Fighter } from '@/lib/supabase';
import { CutScene } from '@/types/game';

export class CutSceneService {
  static generateCutScene(fighter: Fighter): CutScene {
    const cutScenes: CutScene[] = [
      {
        title: "Training Drama",
        description: `${fighter.name} is having issues with their training partner. How do you handle this?`,
        choices: [
          {
            text: "Intervene and resolve the conflict",
            consequences: { confidence: 5, stress: -3 }
          },
          {
            text: "Let them work it out themselves",
            consequences: { confidence: -2, stress: 5 }
          }
        ]
      },
      {
        title: "Personal Crisis",
        description: `${fighter.name} is dealing with personal issues affecting their focus.`,
        choices: [
          {
            text: "Offer support and counseling",
            consequences: { motivation: 10, stress: -5 }
          },
          {
            text: "Focus on training, ignore personal issues",
            consequences: { motivation: -5, stress: 10 }
          }
        ]
      },
      {
        title: "Media Attention",
        description: `${fighter.name} is getting negative press coverage. How do you respond?`,
        choices: [
          {
            text: "Hold a press conference to address it",
            consequences: { confidence: 3, stress: 2 }
          },
          {
            text: "Ignore the media and focus on training",
            consequences: { confidence: -1, stress: -2 }
          }
        ]
      },
      {
        title: "Contract Dispute",
        description: `${fighter.name} is unhappy with their current contract terms.`,
        choices: [
          {
            text: "Negotiate a better deal",
            consequences: { motivation: 8, stress: -3 }
          },
          {
            text: "Stand firm on current terms",
            consequences: { motivation: -3, stress: 5 }
          }
        ]
      }
    ];

    return cutScenes[Math.floor(Math.random() * cutScenes.length)];
  }

  static applyCutSceneConsequences(
    fighter: Fighter, 
    consequences: { confidence?: number; motivation?: number; stress?: number }
  ): Partial<Fighter> {
    const updates: Partial<Fighter> = {};

    if (consequences.confidence !== undefined) {
      updates.confidence = Math.max(0, Math.min(100, 
        (fighter.confidence || 75) + consequences.confidence
      ));
    }

    if (consequences.motivation !== undefined) {
      updates.motivation = Math.max(0, Math.min(100, 
        (fighter.motivation || 75) + consequences.motivation
      ));
    }

    if (consequences.stress !== undefined) {
      updates.stress_level = Math.max(0, Math.min(100, 
        (fighter.stress_level || 25) + consequences.stress
      ));
    }

    return updates;
  }
}
