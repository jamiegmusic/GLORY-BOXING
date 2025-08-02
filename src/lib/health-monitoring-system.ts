import { Fighter, Injury, HealthMonitoring } from './unified-types'

export interface HealthMonitoringConfig {
  enabled: boolean
  concussionProtocol: boolean
  injuryTracking: boolean
  recoverySimulation: boolean
  medicalClearance: boolean
  riskAssessment: boolean
}

export interface HealthAssessment {
  overallHealth: number
  injuryRisk: number
  recoveryStatus: string
  medicalClearance: boolean
  restrictions: string[]
  recommendations: string[]
}

export interface InjuryAssessment {
  type: string
  severity: 'mild' | 'moderate' | 'severe'
  recoveryTime: number // in days
  impactOnPerformance: number // percentage
  medicalClearanceRequired: boolean
  treatmentRequired: string[]
}

export interface ConcussionProtocol {
  active: boolean
  severity: 'mild' | 'moderate' | 'severe'
  daysSinceIncident: number
  clearanceDate?: string
  symptoms: string[]
  restrictions: string[]
  monitoringRequired: boolean
}

export class HealthMonitoringSystem {
  private config: HealthMonitoringConfig
  private injuryDatabase: Map<string, InjuryAssessment> = new Map()
  private concussionProtocols: Map<string, ConcussionProtocol> = new Map()

  constructor(config: HealthMonitoringConfig) {
    this.config = config
    this.initializeInjuryDatabase()
  }

  private initializeInjuryDatabase() {
    // Initialize common boxing injuries with their assessments
    const injuries = [
      {
        type: 'concussion',
        severity: 'severe' as const,
        recoveryTime: 90,
        impactOnPerformance: 50,
        medicalClearanceRequired: true,
        treatmentRequired: ['rest', 'neurological_evaluation', 'gradual_return']
      },
      {
        type: 'hand_fracture',
        severity: 'moderate' as const,
        recoveryTime: 60,
        impactOnPerformance: 30,
        medicalClearanceRequired: true,
        treatmentRequired: ['immobilization', 'physical_therapy', 'strength_training']
      },
      {
        type: 'rib_fracture',
        severity: 'moderate' as const,
        recoveryTime: 45,
        impactOnPerformance: 40,
        medicalClearanceRequired: true,
        treatmentRequired: ['rest', 'pain_management', 'breathing_exercises']
      },
      {
        type: 'eye_injury',
        severity: 'severe' as const,
        recoveryTime: 120,
        impactOnPerformance: 60,
        medicalClearanceRequired: true,
        treatmentRequired: ['ophthalmological_evaluation', 'surgery', 'rehabilitation']
      },
      {
        type: 'shoulder_dislocation',
        severity: 'moderate' as const,
        recoveryTime: 75,
        impactOnPerformance: 35,
        medicalClearanceRequired: true,
        treatmentRequired: ['reduction', 'immobilization', 'physical_therapy']
      },
      {
        type: 'knee_injury',
        severity: 'moderate' as const,
        recoveryTime: 90,
        impactOnPerformance: 25,
        medicalClearanceRequired: true,
        treatmentRequired: ['mri_evaluation', 'physical_therapy', 'strength_training']
      },
      {
        type: 'cut',
        severity: 'mild' as const,
        recoveryTime: 14,
        impactOnPerformance: 10,
        medicalClearanceRequired: false,
        treatmentRequired: ['stitches', 'antibiotics', 'wound_care']
      },
      {
        type: 'bruising',
        severity: 'mild' as const,
        recoveryTime: 7,
        impactOnPerformance: 5,
        medicalClearanceRequired: false,
        treatmentRequired: ['ice', 'rest', 'anti_inflammatory']
      }
    ]

    injuries.forEach(injury => {
      this.injuryDatabase.set(injury.type, injury)
    })
  }

  public assessFighterHealth(fighter: Fighter): HealthAssessment {
    const assessment: HealthAssessment = {
      overallHealth: 100,
      injuryRisk: 0,
      recoveryStatus: 'healthy',
      medicalClearance: true,
      restrictions: [],
      recommendations: []
    }

    // Check for active injuries
    if (fighter.injuries && fighter.injuries.length > 0) {
      const activeInjuries = fighter.injuries.filter(injury => 
        new Date(injury.recovery_date) > new Date()
      )

      if (activeInjuries.length > 0) {
        assessment.recoveryStatus = 'injured'
        assessment.medicalClearance = false

        // Calculate health impact from injuries
        let totalHealthImpact = 0
        activeInjuries.forEach(injury => {
          const injuryAssessment = this.injuryDatabase.get(injury.type)
          if (injuryAssessment) {
            totalHealthImpact += injuryAssessment.impactOnPerformance
            assessment.restrictions.push(...injuryAssessment.treatmentRequired)
          }
        })

        assessment.overallHealth = Math.max(0, 100 - totalHealthImpact)
        assessment.injuryRisk = this.calculateInjuryRisk(fighter, activeInjuries)
      }
    }

    // Check concussion protocol
    const concussionProtocol = this.concussionProtocols.get(fighter.id)
    if (concussionProtocol && concussionProtocol.active) {
      assessment.recoveryStatus = 'concussion_protocol'
      assessment.medicalClearance = false
      assessment.restrictions.push(...concussionProtocol.restrictions)
      assessment.overallHealth = Math.min(assessment.overallHealth, 70)
    }

    // Generate recommendations
    assessment.recommendations = this.generateHealthRecommendations(fighter, assessment)

    return assessment
  }

  private calculateInjuryRisk(fighter: Fighter, activeInjuries: Injury[]): number {
    let baseRisk = 20 // Base risk for any fighter

    // Age factor
    if (fighter.age && fighter.age > 35) {
      baseRisk += 15
    }

    // Previous injuries factor
    if (fighter.injuries && fighter.injuries.length > 0) {
      baseRisk += fighter.injuries.length * 5
    }

    // Recent fights factor
    if (fighter.last_fight) {
      const daysSinceLastFight = (new Date().getTime() - new Date(fighter.last_fight).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceLastFight < 30) {
        baseRisk += 10
      }
    }

    // Active injuries factor
    baseRisk += activeInjuries.length * 10

    return Math.min(100, baseRisk)
  }

  private generateHealthRecommendations(fighter: Fighter, assessment: HealthAssessment): string[] {
    const recommendations: string[] = []

    if (assessment.overallHealth < 80) {
      recommendations.push('Consider postponing next fight until fully recovered')
    }

    if (assessment.injuryRisk > 50) {
      recommendations.push('Implement injury prevention program')
      recommendations.push('Increase recovery time between fights')
    }

    if (fighter.age && fighter.age > 35) {
      recommendations.push('Schedule regular medical checkups')
      recommendations.push('Consider reduced fight frequency')
    }

    if (assessment.restrictions.length > 0) {
      recommendations.push('Follow medical team recommendations strictly')
    }

    if (assessment.overallHealth < 60) {
      recommendations.push('Medical clearance required before next fight')
    }

    return recommendations
  }

  public simulateInjury(fighter: Fighter, injuryType: string, severity: 'mild' | 'moderate' | 'severe'): Injury {
    const injuryAssessment = this.injuryDatabase.get(injuryType)
    if (!injuryAssessment) {
      throw new Error(`Unknown injury type: ${injuryType}`)
    }

    // Adjust recovery time based on severity
    let recoveryTime = injuryAssessment.recoveryTime
    switch (severity) {
      case 'mild':
        recoveryTime = Math.round(recoveryTime * 0.7)
        break
      case 'moderate':
        recoveryTime = injuryAssessment.recoveryTime
        break
      case 'severe':
        recoveryTime = Math.round(recoveryTime * 1.3)
        break
    }

    const injury: Injury = {
      id: `injury-${Date.now()}`,
      fighter_id: fighter.id,
      injury_type: injuryType,
      severity: this.getSeverityNumber(severity),
      occurred_date: new Date().toISOString(),
      recovery_date: new Date(Date.now() + recoveryTime * 24 * 60 * 60 * 1000).toISOString(),
      impact_on_performance: injuryAssessment.impactOnPerformance,
      treatment_required: injuryAssessment.treatmentRequired,
      medical_clearance_required: injuryAssessment.medicalClearanceRequired,
      notes: `Simulated ${severity} ${injuryType} injury`,
      recovery_weeks: Math.ceil(recoveryTime / 7),
      is_recovered: false,
      affects_punching_power: false,
      affects_speed: false,
      affects_defense: false,
      affects_stamina: false,
      affects_chin: false,
      created_at: new Date().toISOString()
    }

    return injury
  }

  public activateConcussionProtocol(fighter: Fighter, severity: 'mild' | 'moderate' | 'severe'): ConcussionProtocol {
    const protocol: ConcussionProtocol = {
      active: true,
      severity,
      daysSinceIncident: 0,
      symptoms: this.getConcussionSymptoms(severity),
      restrictions: this.getConcussionRestrictions(severity),
      monitoringRequired: true
    }

    // Set clearance date based on severity
    let clearanceDays = 0
    switch (severity) {
      case 'mild':
        clearanceDays = 7
        break
      case 'moderate':
        clearanceDays = 14
        break
      case 'severe':
        clearanceDays = 30
        break
    }

    protocol.clearanceDate = new Date(Date.now() + clearanceDays * 24 * 60 * 60 * 1000).toISOString()
    this.concussionProtocols.set(fighter.id, protocol)

    return protocol
  }

  private getConcussionSymptoms(severity: string): string[] {
    const baseSymptoms = ['headache', 'dizziness', 'nausea']
    
    switch (severity) {
      case 'mild':
        return baseSymptoms
      case 'moderate':
        return [...baseSymptoms, 'confusion', 'memory_loss', 'sensitivity_to_light']
      case 'severe':
        return [...baseSymptoms, 'loss_of_consciousness', 'severe_headache', 'vomiting', 'seizures']
      default:
        return baseSymptoms
    }
  }

  private getConcussionRestrictions(severity: string): string[] {
    const baseRestrictions = ['no_training', 'no_contact_sports', 'rest']
    
    switch (severity) {
      case 'mild':
        return baseRestrictions
      case 'moderate':
        return [...baseRestrictions, 'no_screen_time', 'limited_physical_activity', 'medical_monitoring']
      case 'severe':
        return [...baseRestrictions, 'hospital_observation', 'complete_rest', 'neurological_evaluation']
      default:
        return baseRestrictions
    }
  }

  public checkMedicalClearance(fighter: Fighter): boolean {
    const healthAssessment = this.assessFighterHealth(fighter)
    
    if (!healthAssessment.medicalClearance) {
      return false
    }

    // Check concussion protocol
    const concussionProtocol = this.concussionProtocols.get(fighter.id)
    if (concussionProtocol && concussionProtocol.active) {
      if (concussionProtocol.clearanceDate && new Date(concussionProtocol.clearanceDate) > new Date()) {
        return false
      }
    }

    // Check active injuries
    if (fighter.injuries && fighter.injuries.length > 0) {
      const activeInjuries = fighter.injuries.filter(injury => 
        new Date(injury.recovery_date) > new Date()
      )

      if (activeInjuries.length > 0) {
        return false
      }
    }

    return true
  }

  public simulateRecovery(fighter: Fighter, daysElapsed: number): void {
    // Simulate recovery of injuries
    if (fighter.injuries && fighter.injuries.length > 0) {
      fighter.injuries = fighter.injuries.filter(injury => {
        const recoveryDate = new Date(injury.recovery_date)
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() + daysElapsed)
        return recoveryDate > currentDate
      })
    }

    // Simulate concussion protocol recovery
    const concussionProtocol = this.concussionProtocols.get(fighter.id)
    if (concussionProtocol && concussionProtocol.active) {
      concussionProtocol.daysSinceIncident += daysElapsed
      
      if (concussionProtocol.clearanceDate && new Date(concussionProtocol.clearanceDate) <= new Date()) {
        concussionProtocol.active = false
      }
    }
  }

  public getRecoveryTimeline(fighter: Fighter): {
    injuries: { injury: Injury; daysUntilRecovery: number }[]
    concussionProtocol?: { protocol: ConcussionProtocol; daysUntilClearance: number }
  } {
    const timeline = {
      injuries: [] as { injury: Injury; daysUntilRecovery: number }[],
      concussionProtocol: undefined as { protocol: ConcussionProtocol; daysUntilClearance: number } | undefined
    }

    // Calculate injury recovery timeline
    if (fighter.injuries && fighter.injuries.length > 0) {
      fighter.injuries.forEach(injury => {
        const recoveryDate = new Date(injury.recovery_date)
        const currentDate = new Date()
        const daysUntilRecovery = Math.max(0, Math.ceil((recoveryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)))
        
        timeline.injuries.push({ injury, daysUntilRecovery })
      })
    }

    // Calculate concussion protocol timeline
    const concussionProtocol = this.concussionProtocols.get(fighter.id)
    if (concussionProtocol && concussionProtocol.active && concussionProtocol.clearanceDate) {
      const clearanceDate = new Date(concussionProtocol.clearanceDate)
      const currentDate = new Date()
      const daysUntilClearance = Math.max(0, Math.ceil((clearanceDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)))
      
      timeline.concussionProtocol = { protocol: concussionProtocol, daysUntilClearance }
    }

    return timeline
  }

  public generateHealthReport(fighter: Fighter): {
    assessment: HealthAssessment
    timeline: any
    recommendations: string[]
    riskFactors: string[]
  } {
    const assessment = this.assessFighterHealth(fighter)
    const timeline = this.getRecoveryTimeline(fighter)
    const recommendations = assessment.recommendations
    const riskFactors = this.identifyRiskFactors(fighter)

    return {
      assessment,
      timeline,
      recommendations,
      riskFactors
    }
  }

  private identifyRiskFactors(fighter: Fighter): string[] {
    const riskFactors: string[] = []

    // Age risk
    if (fighter.age && fighter.age > 35) {
      riskFactors.push('Advanced age increases injury risk')
    }

    // Previous injury risk
    if (fighter.injuries && fighter.injuries.length > 0) {
      riskFactors.push('History of previous injuries')
    }

    // Recent fight risk
    if (fighter.last_fight) {
      const daysSinceLastFight = (new Date().getTime() - new Date(fighter.last_fight).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceLastFight < 30) {
        riskFactors.push('Recent fight may cause cumulative damage')
      }
    }

    // Weight class risk
    if (fighter.weight_class === 'Heavyweight') {
      riskFactors.push('Heavyweight division has higher injury risk')
    }

    // Performance risk
    if (fighter.record_losses > fighter.record_wins) {
      riskFactors.push('Losing record may indicate defensive issues')
    }

    return riskFactors
  }

  public updateConfig(newConfig: Partial<HealthMonitoringConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  public getConfig(): HealthMonitoringConfig {
    return { ...this.config }
  }

  public getInjuryDatabase(): Map<string, InjuryAssessment> {
    return new Map(this.injuryDatabase)
  }

  public getConcussionProtocols(): Map<string, ConcussionProtocol> {
    return new Map(this.concussionProtocols)
  }

  private getSeverityNumber(severity: 'mild' | 'moderate' | 'severe'): number {
    switch (severity) {
      case 'mild':
        return 1
      case 'moderate':
        return 2
      case 'severe':
        return 3
      default:
        return 1
    }
  }
}

// Export singleton instance
export const healthMonitoringSystem = new HealthMonitoringSystem({
  enabled: true,
  concussionProtocol: true,
  injuryTracking: true,
  recoverySimulation: true,
  medicalClearance: true,
  riskAssessment: true
}) 