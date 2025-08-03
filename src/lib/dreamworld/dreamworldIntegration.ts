import { LegacyUnlock } from '../../types/dreamworld'
import { Fighter } from '../../types/game'

/**
 * Dreamworld Integration Utilities
 * Handles the connection between the main game and dreamworld expansion
 */

export interface DreamworldTriggerCondition {
  type: 'knockout' | 'breakdown' | 'injury'
  entityId?: string
  entityName?: string
  severity?: number
}

/**
 * Check if a fight result should trigger dreamworld
 */
export const checkFightForDreamworld = (
  winner: Fighter,
  loser: Fighter,
  isKnockout: boolean,
  injurySeverity?: number
): DreamworldTriggerCondition | null => {
  // Knockout trigger
  if (isKnockout) {
    return {
      type: 'knockout',
      entityId: loser.id,
      entityName: loser.name,
      severity: 80
    }
  }

  // Severe injury trigger
  if (injurySeverity && injurySeverity >= 75) {
    return {
      type: 'injury',
      entityId: loser.id,
      entityName: loser.name,
      severity: injurySeverity
    }
  }

  return null
}

/**
 * Check if manager stress should trigger dreamworld
 */
export const checkManagerStress = (
  stressLevel: number,
  recentEvents: string[]
): DreamworldTriggerCondition | null => {
  // Mental breakdown from high stress
  if (stressLevel >= 90) {
    return {
      type: 'breakdown',
      severity: stressLevel
    }
  }

  // Breakdown from multiple negative events
  const negativeEvents = recentEvents.filter(event => 
    event.includes('lost') || 
    event.includes('injured') || 
    event.includes('quit') ||
    event.includes('scandal')
  )

  if (negativeEvents.length >= 3) {
    return {
      type: 'breakdown',
      severity: 75
    }
  }

  return null
}

/**
 * Apply legacy unlock effects to main game state
 */
export const applyLegacyUnlockEffects = (
  unlock: LegacyUnlock,
  gameState: any
): any => {
  const updatedState = { ...gameState }

  switch (unlock.unlock_type) {
    case 'skill':
      // Apply skill bonuses
      if (unlock.effect_data.charisma) {
        updatedState.playerStats = {
          ...updatedState.playerStats,
          charisma: (updatedState.playerStats.charisma || 0) + unlock.effect_data.charisma
        }
      }
      if (unlock.effect_data.negotiation) {
        updatedState.playerStats = {
          ...updatedState.playerStats,
          negotiation: (updatedState.playerStats.negotiation || 0) + unlock.effect_data.negotiation
        }
      }
      if (unlock.effect_data.allSkills) {
        // Apply bonus to all skills
        Object.keys(updatedState.playerStats).forEach(stat => {
          if (typeof updatedState.playerStats[stat] === 'number') {
            updatedState.playerStats[stat] += unlock.effect_data.allSkills
          }
        })
      }
      break

    case 'item':
      // Add special items to inventory
      updatedState.inventory = [
        ...updatedState.inventory,
        {
          id: unlock.id,
          name: unlock.dream_item,
          type: 'legacy',
          effects: unlock.effect_data,
          rarity: unlock.rarity
        }
      ]
      break

    case 'connection':
      // Unlock new opportunities
      if (unlock.effect_data.hiddenVenues) {
        updatedState.unlockedVenues = [
          ...updatedState.unlockedVenues,
          ...generateHiddenVenues(unlock.effect_data.hiddenVenues)
        ]
      }
      if (unlock.effect_data.crossEraBookings) {
        updatedState.specialFeatures = {
          ...updatedState.specialFeatures,
          crossEraBookings: true
        }
      }
      break

    case 'knowledge':
      // Apply knowledge bonuses
      if (unlock.effect_data.trendPrediction) {
        updatedState.marketInsight = {
          ...updatedState.marketInsight,
          predictionAccuracy: (updatedState.marketInsight?.predictionAccuracy || 50) + 
            unlock.effect_data.trendPrediction
        }
      }
      if (unlock.effect_data.talentDevelopment) {
        updatedState.trainingBonus = 
          (updatedState.trainingBonus || 1) + (unlock.effect_data.talentDevelopment / 100)
      }
      break

    case 'bonus':
      // Apply passive bonuses
      if (unlock.effect_data.passiveIncome) {
        updatedState.passiveIncome = 
          (updatedState.passiveIncome || 0) + unlock.effect_data.passiveIncome
      }
      if (unlock.effect_data.lucidDreamBonus) {
        updatedState.dreamworldBonus = {
          ...updatedState.dreamworldBonus,
          lucidMeterBonus: unlock.effect_data.lucidDreamBonus
        }
      }
      break
  }

  // Add to legacy collection
  updatedState.legacyCollection = [
    ...(updatedState.legacyCollection || []),
    {
      id: unlock.id,
      name: unlock.dream_item,
      description: unlock.description,
      rarity: unlock.rarity,
      dateEarned: unlock.unlock_date
    }
  ]

  return updatedState
}

/**
 * Generate hidden venues based on legacy unlock
 */
const generateHiddenVenues = (count: number) => {
  const venues = [
    { id: 'speakeasy-1', name: 'The Hidden Flask', type: 'underground', prestige: 4 },
    { id: 'speakeasy-2', name: 'Moonlight Room', type: 'underground', prestige: 5 },
    { id: 'speakeasy-3', name: 'The Velvet Curtain', type: 'underground', prestige: 3 }
  ]
  
  return venues.slice(0, count)
}

/**
 * Calculate dreamworld entry bonuses based on trigger type
 */
export const getDreamworldEntryBonus = (
  triggerType: 'knockout' | 'breakdown' | 'injury'
): Record<string, number> => {
  switch (triggerType) {
    case 'knockout':
      return {
        startingLucidMeter: 40,
        startingWellness: 70,
        dreamCurrency: 1000
      }
    case 'breakdown':
      return {
        startingLucidMeter: 50,
        startingWellness: 30,
        dreamCurrency: 1500,
        reputationBonus: 10
      }
    case 'injury':
      return {
        startingLucidMeter: 60,
        startingWellness: 50,
        dreamCurrency: 1200,
        healingBonus: true
      }
  }
}

/**
 * Generate dreamworld summary for save games
 */
export const generateDreamworldSummary = (
  legacyUnlocks: LegacyUnlock[],
  totalDreamSessions: number,
  favoriteEra?: string
): string => {
  const totalUnlocks = legacyUnlocks.length
  const legendaryCount = legacyUnlocks.filter(u => u.rarity === 'legendary').length
  const epicCount = legacyUnlocks.filter(u => u.rarity === 'epic').length

  let summary = `Dreamworld Progress:\n`
  summary += `- Total Dream Sessions: ${totalDreamSessions}\n`
  summary += `- Legacy Items Collected: ${totalUnlocks}\n`
  
  if (legendaryCount > 0) {
    summary += `- Legendary Items: ${legendaryCount}\n`
  }
  if (epicCount > 0) {
    summary += `- Epic Items: ${epicCount}\n`
  }
  if (favoriteEra) {
    summary += `- Favorite Era: ${favoriteEra}\n`
  }

  return summary
}

/**
 * Check if player has specific dreamworld achievements
 */
export const checkDreamworldAchievements = (
  legacyUnlocks: LegacyUnlock[],
  dreamSessions: number
): string[] => {
  const achievements: string[] = []

  // Collection achievements
  if (legacyUnlocks.length >= 10) {
    achievements.push('Dream Collector - Collected 10 legacy items')
  }
  if (legacyUnlocks.length >= 25) {
    achievements.push('Dream Hoarder - Collected 25 legacy items')
  }
  if (legacyUnlocks.some(u => u.rarity === 'legendary')) {
    achievements.push('Legendary Dreamer - Found a legendary item')
  }

  // Session achievements
  if (dreamSessions >= 5) {
    achievements.push('Frequent Dreamer - Completed 5 dream sessions')
  }
  if (dreamSessions >= 20) {
    achievements.push('Dream Walker - Completed 20 dream sessions')
  }

  // Specific item achievements
  const itemNames = legacyUnlocks.map(u => u.dream_item)
  if (itemNames.includes('Ghost of Louis Armstrong')) {
    achievements.push('Jazz Legend - Met the ghost of Louis Armstrong')
  }
  if (itemNames.includes('Era-Hopping License')) {
    achievements.push('Time Traveler - Gained the ability to hop between eras')
  }

  return achievements
}