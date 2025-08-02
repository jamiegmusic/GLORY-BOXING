import type { Fighter, Contract, Sponsorship, Venue, Promoter, GameState } from './unified-types'

export interface BusinessEngineConfig {
  aiNegotiation: boolean
  realTimePricing: boolean
  marketFluctuation: boolean
  sponsorshipTracking: boolean
  revenueOptimization: boolean
}

export interface FinancialMetrics {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  revenueGrowth: number
  sponsorshipRevenue: number
  ticketRevenue: number
  ppvRevenue: number
  merchandiseRevenue: number
}

export interface MarketAnalysis {
  fighterValue: number
  marketDemand: number
  sponsorshipPotential: number
  ticketSalesPotential: number
  ppvSalesPotential: number
  riskAssessment: number
  growthPotential: number
}

export class GloryBusinessEngine {
  private config: BusinessEngineConfig
  private marketData: Map<string, any> = new Map()
  private aiModels: Map<string, any> = new Map()

  constructor(config: BusinessEngineConfig) {
    this.config = config
    this.initializeAI()
    this.initializeMarketData()
  }

  private initializeAI() {
    if (this.config.aiNegotiation) {
      this.aiModels.set('negotiation', this.createNegotiationAI())
      this.aiModels.set('pricing', this.createPricingAI())
      this.aiModels.set('marketing', this.createMarketingAI())
    }
  }

  private initializeMarketData() {
    // Initialize market data for different regions and weight classes
    const regions = ['US', 'UK', 'Europe', 'Asia', 'Latin America']
    const weightClasses = ['Heavyweight', 'Light Heavyweight', 'Middleweight', 'Welterweight', 'Lightweight']

    regions.forEach(region => {
      weightClasses.forEach(weightClass => {
        this.marketData.set(`${region}-${weightClass}`, {
          baseDemand: Math.random() * 100,
          priceMultiplier: 0.8 + Math.random() * 0.4,
          sponsorshipMultiplier: 0.7 + Math.random() * 0.6,
          growthRate: 0.05 + Math.random() * 0.1
        })
      })
    })
  }

  private createNegotiationAI() {
    return {
      analyzeContract: (fighter: Fighter, contract: Contract) => {
        const marketValue = this.calculateFighterMarketValue(fighter)
        const fairValue = this.calculateFairContractValue(fighter, contract)
        
        return {
          marketValue,
          fairValue,
          negotiationLeverage: this.calculateNegotiationLeverage(fighter, contract),
          recommendedTerms: this.generateRecommendedTerms(fighter, contract),
          riskFactors: this.assessContractRisk(fighter, contract)
        }
      },
      
      generateCounterOffer: (fighter: Fighter, initialOffer: Contract) => {
        const analysis = this.aiModels.get('negotiation').analyzeContract(fighter, initialOffer)
        const counterOffer = this.calculateCounterOffer(fighter, initialOffer, analysis)
        
        return {
          counterOffer,
          reasoning: this.generateCounterOfferReasoning(fighter, initialOffer, counterOffer),
          confidence: this.calculateOfferConfidence(fighter, counterOffer)
        }
      }
    }
  }

  private createPricingAI() {
    return {
      calculateOptimalPricing: (event: any, venue: Venue, fighters: Fighter[]) => {
        const marketAnalysis = this.analyzeEventMarket(event, venue, fighters)
        
        return {
          ticketPrices: this.calculateTicketPricing(event, venue, fighters),
          ppvPrice: this.calculatePPVPricing(event, fighters),
          sponsorshipRates: this.calculateSponsorshipRates(event, fighters),
          revenueProjection: this.projectEventRevenue(event, venue, fighters)
        }
      }
    }
  }

  private createMarketingAI() {
    return {
      generateMarketingStrategy: (fighter: Fighter, event: any) => {
        const targetAudience = this.analyzeTargetAudience(fighter)
        const marketingChannels = this.determineMarketingChannels(fighter, event)
        
        return {
          targetAudience,
          marketingChannels,
          campaignStrategy: this.generateCampaignStrategy(fighter, event),
          budgetAllocation: this.allocateMarketingBudget(fighter, event),
          roiProjection: this.projectMarketingROI(fighter, event)
        }
      }
    }
  }

  private analyzeTargetAudience(fighter: Fighter): any {
    return {
      demographics: {
        ageRange: '18-45',
        gender: 'Male dominant',
        income: 'Middle to upper class'
      },
      interests: ['Combat sports', 'Fitness', 'Entertainment'],
      geographic: fighter.region || 'US'
    }
  }

  private determineMarketingChannels(fighter: Fighter, event: any): string[] {
    const channels = ['Social media', 'TV commercials', 'Radio spots']
    if (fighter.popularity && fighter.popularity > 80) {
      channels.push('Celebrity endorsements', 'Press conferences')
    }
    return channels
  }

  private generateCampaignStrategy(fighter: Fighter, event: any): any {
    return {
      theme: `${fighter.name} - The Next Champion`,
      messaging: `Don't miss the fight of the year`,
      timeline: '4 weeks pre-event',
      budget: 50000
    }
  }

  private allocateMarketingBudget(fighter: Fighter, event: any): any {
    return {
      socialMedia: 20000,
      tvCommercials: 15000,
      radioSpots: 10000,
      printAds: 5000
    }
  }

  private projectMarketingROI(fighter: Fighter, event: any): number {
    const popularity = fighter.popularity || 50
    const baseROI = 2.5
    return baseROI * (popularity / 100)
  }

  public calculateFighterMarketValue(fighter: Fighter): number {
    let baseValue = 100000 // Base value for any fighter

    // Adjust based on record
    const winRate = fighter.record_wins / (fighter.record_wins + fighter.record_losses)
    baseValue *= (0.5 + winRate * 1.5)

    // Adjust based on experience
    baseValue *= (1 + (fighter.experience || 0) * 0.1)

    // Adjust based on popularity
    baseValue *= (1 + (fighter.popularity || 0) * 0.02)

    // Adjust based on weight class (heavier classes generally more valuable)
    const weightClassMultiplier = this.getWeightClassMultiplier(fighter.weight_class)
    baseValue *= weightClassMultiplier

    // Adjust based on current ranking
    if (fighter.ranking && fighter.ranking <= 10) {
      baseValue *= (1.5 - (fighter.ranking - 1) * 0.05)
    }

    // Market fluctuations
    if (this.config.marketFluctuation) {
      const marketFactor = 0.8 + Math.random() * 0.4 // 0.8 to 1.2
      baseValue *= marketFactor
    }

    return Math.round(baseValue)
  }

  private getWeightClassMultiplier(weightClass: string): number {
    const multipliers: Record<string, number> = {
      'Heavyweight': 1.5,
      'Light Heavyweight': 1.3,
      'Middleweight': 1.2,
      'Welterweight': 1.1,
      'Lightweight': 1.0,
      'Featherweight': 0.9,
      'Bantamweight': 0.8
    }
    return multipliers[weightClass] || 1.0
  }

  public calculateFairContractValue(fighter: Fighter, contract: Contract): number {
    const marketValue = this.calculateFighterMarketValue(fighter)
    const contractLength = contract.duration_months || 12
    const fightFrequency = contract.fights_per_year || 4

    let fairValue = marketValue * (contractLength / 12) * (fightFrequency / 4)

    // Adjust for contract type
    switch (contract.type) {
      case 'exclusive':
        fairValue *= 1.3
        break
      case 'non-exclusive':
        fairValue *= 0.8
        break
      case 'development':
        fairValue *= 0.6
        break
    }

    // Adjust for performance bonuses
    if (contract.performance_bonuses) {
      fairValue += contract.performance_bonuses.reduce((sum, bonus) => sum + bonus.amount, 0)
    }

    return Math.round(fairValue)
  }

  private calculateNegotiationLeverage(fighter: Fighter, contract: Contract): number {
    let leverage = 0.5 // Base leverage

    // High ranking fighters have more leverage
    if (fighter.ranking && fighter.ranking <= 5) {
      leverage += 0.3
    }

    // Popular fighters have more leverage
    if (fighter.popularity && fighter.popularity > 80) {
      leverage += 0.2
    }

    // Undefeated fighters have more leverage
    if (fighter.record_losses === 0) {
      leverage += 0.2
    }

    // Market demand affects leverage
    const marketDemand = this.getMarketDemand(fighter.weight_class, fighter.region)
    leverage += marketDemand * 0.1

    return Math.min(1.0, leverage)
  }

  private getMarketDemand(weightClass: string, region: string): number {
    const key = `${region}-${weightClass}`
    const marketData = this.marketData.get(key)
    return marketData ? marketData.baseDemand : 50
  }

  private generateRecommendedTerms(fighter: Fighter, contract: Contract): Contract {
    const marketValue = this.calculateFighterMarketValue(fighter)
    const leverage = this.calculateNegotiationLeverage(fighter, contract)

    const recommendedContract: Contract = {
      ...contract,
      base_salary: Math.round(marketValue * leverage),
      duration_months: contract.duration_months || 12,
      fights_per_year: contract.fights_per_year || 4,
      performance_bonuses: this.generatePerformanceBonuses(fighter),
      sponsorship_split: this.calculateSponsorshipSplit(fighter, leverage)
    }

    return recommendedContract
  }

  private generatePerformanceBonuses(fighter: Fighter): any[] {
    const bonuses = []

    // Win bonus
    bonuses.push({
      type: 'win',
      amount: 10000,
      description: 'Win bonus per fight'
    })

    // Title fight bonus
    bonuses.push({
      type: 'title_fight',
      amount: 25000,
      description: 'Title fight bonus'
    })

    // KO/TKO bonus
    bonuses.push({
      type: 'ko_tko',
      amount: 15000,
      description: 'KO/TKO bonus'
    })

    // Performance of the night
    bonuses.push({
      type: 'performance',
      amount: 20000,
      description: 'Performance of the night bonus'
    })

    return bonuses
  }

  private calculateSponsorshipSplit(fighter: Fighter, leverage: number): number {
    // Higher leverage fighters get better sponsorship splits
    return Math.max(0.3, Math.min(0.7, 0.5 + leverage * 0.2))
  }

  private assessContractRisk(fighter: Fighter, contract: Contract): any[] {
    const risks = []

    // Age risk
    if (fighter.age && fighter.age > 35) {
      risks.push({
        type: 'age',
        severity: 'medium',
        description: 'Fighter is approaching retirement age'
      })
    }

    // Injury risk
    if (fighter.injuries && fighter.injuries.length > 0) {
      risks.push({
        type: 'injury',
        severity: 'high',
        description: 'Fighter has injury history'
      })
    }

    // Performance risk
    if (fighter.record_losses > fighter.record_wins) {
      risks.push({
        type: 'performance',
        severity: 'medium',
        description: 'Fighter has losing record'
      })
    }

    // Market risk
    const marketDemand = this.getMarketDemand(fighter.weight_class, fighter.region)
    if (marketDemand < 30) {
      risks.push({
        type: 'market',
        severity: 'low',
        description: 'Low market demand for weight class/region'
      })
    }

    return risks
  }

  private calculateCounterOffer(fighter: Fighter, initialOffer: Contract, analysis: any): Contract {
    const marketValue = analysis.marketValue
    const leverage = analysis.negotiationLeverage
    const fairValue = analysis.fairValue

    // Calculate counter offer based on leverage and market value
    const counterValue = fairValue * (1 + leverage * 0.3)

    return {
      ...initialOffer,
      base_salary: Math.round(counterValue),
      performance_bonuses: this.enhancePerformanceBonuses(initialOffer.performance_bonuses, leverage),
      sponsorship_split: this.calculateSponsorshipSplit(fighter, leverage)
    }
  }

  private enhancePerformanceBonuses(bonuses: any[], leverage: number): any[] {
    return bonuses.map(bonus => ({
      ...bonus,
      amount: Math.round(bonus.amount * (1 + leverage * 0.2))
    }))
  }

  private generateCounterOfferReasoning(fighter: Fighter, initialOffer: Contract, counterOffer: Contract): string {
    const marketValue = this.calculateFighterMarketValue(fighter)
    const leverage = this.calculateNegotiationLeverage(fighter, initialOffer)

    let reasoning = `Based on ${fighter.name}'s market value of $${marketValue.toLocaleString()} and current leverage, `

    if (counterOffer.base_salary > initialOffer.base_salary) {
      reasoning += `we're requesting a higher base salary to reflect their market value. `
    }

    if (counterOffer.sponsorship_split > initialOffer.sponsorship_split) {
      reasoning += `We're also seeking a better sponsorship split given their popularity. `
    }

    reasoning += `This offer better reflects ${fighter.name}'s value in the current market.`

    return reasoning
  }

  private calculateOfferConfidence(fighter: Fighter, offer: Contract): number {
    const marketValue = this.calculateFighterMarketValue(fighter)
    const offerValue = offer.base_salary || 0
    const leverage = this.calculateNegotiationLeverage(fighter, offer)

    // Calculate confidence based on how close the offer is to market value
    const valueRatio = offerValue / marketValue
    const leverageFactor = leverage * 0.3

    let confidence = 0.5 // Base confidence

    if (valueRatio >= 0.8 && valueRatio <= 1.2) {
      confidence += 0.3
    } else if (valueRatio >= 0.6 && valueRatio <= 1.4) {
      confidence += 0.2
    }

    confidence += leverageFactor

    return Math.min(1.0, confidence)
  }

  public calculateTicketPricing(event: any, venue: Venue, fighters: Fighter[]): any {
    const basePrice = 50 // Base ticket price
    const marketAnalysis = this.analyzeEventMarket(event, venue, fighters)
    
    const pricing = {
      general: Math.round(basePrice * marketAnalysis.demandMultiplier),
      premium: Math.round(basePrice * 2 * marketAnalysis.demandMultiplier),
      vip: Math.round(basePrice * 5 * marketAnalysis.demandMultiplier),
      ringside: Math.round(basePrice * 10 * marketAnalysis.demandMultiplier)
    }

    return pricing
  }

  public calculatePPVPricing(event: any, fighters: Fighter[]): number {
    const basePPVPrice = 49.99
    const fighterPopularity = fighters.reduce((sum, fighter) => sum + (fighter.popularity || 0), 0) / fighters.length
    const titleFightMultiplier = event.title_bout ? 1.5 : 1.0

    const ppvPrice = basePPVPrice * (1 + fighterPopularity / 100) * titleFightMultiplier

    return Math.round(ppvPrice)
  }

  public calculateSponsorshipRates(event: any, fighters: Fighter[]): any {
    const baseSponsorshipRate = 10000
    const totalPopularity = fighters.reduce((sum, fighter) => sum + (fighter.popularity || 0), 0)
    const titleFightMultiplier = event.title_bout ? 1.3 : 1.0

    const rates = {
      ring_corner: Math.round(baseSponsorshipRate * (1 + totalPopularity / 200) * titleFightMultiplier),
      ring_canvas: Math.round(baseSponsorshipRate * 0.8 * (1 + totalPopularity / 200) * titleFightMultiplier),
      fighter_gear: Math.round(baseSponsorshipRate * 0.6 * (1 + totalPopularity / 200) * titleFightMultiplier),
      broadcast: Math.round(baseSponsorshipRate * 1.5 * (1 + totalPopularity / 200) * titleFightMultiplier)
    }

    return rates
  }

  private analyzeEventMarket(event: any, venue: Venue, fighters: Fighter[]): any {
    const totalPopularity = fighters.reduce((sum, fighter) => sum + (fighter.popularity || 0), 0)
    const avgPopularity = totalPopularity / fighters.length
    const venueCapacity = venue.capacity || 10000
    const regionDemand = this.getRegionalDemand(venue.region)

    return {
      demandMultiplier: 0.8 + (avgPopularity / 100) * 0.4 + (regionDemand / 100) * 0.3,
      capacityUtilization: Math.min(1.0, (avgPopularity / 100) * 0.8 + (regionDemand / 100) * 0.2),
      sponsorshipPotential: avgPopularity / 100 * regionDemand / 100
    }
  }

  private getRegionalDemand(region: string): number {
    const regionalDemand: Record<string, number> = {
      'US': 85,
      'UK': 75,
      'Europe': 70,
      'Asia': 60,
      'Latin America': 65
    }
    return regionalDemand[region] || 50
  }

  public projectEventRevenue(event: any, venue: Venue, fighters: Fighter[]): any {
    const marketAnalysis = this.analyzeEventMarket(event, venue, fighters)
    const ticketPricing = this.calculateTicketPricing(event, venue, fighters)
    const ppvPricing = this.calculatePPVPricing(event, fighters)
    const sponsorshipRates = this.calculateSponsorshipRates(event, fighters)

    const venueCapacity = venue.capacity || 10000
    const expectedAttendance = Math.round(venueCapacity * marketAnalysis.capacityUtilization)

    const revenue = {
      ticketSales: {
        general: expectedAttendance * 0.6 * ticketPricing.general,
        premium: expectedAttendance * 0.2 * ticketPricing.premium,
        vip: expectedAttendance * 0.15 * ticketPricing.vip,
        ringside: expectedAttendance * 0.05 * ticketPricing.ringside,
        total: 0
      },
      ppvSales: {
        price: ppvPricing,
        expectedBuys: this.projectPPVBuyRate(fighters, event),
        revenue: 0
      },
      sponsorship: {
        ringCorner: sponsorshipRates.ring_corner * 4,
        ringCanvas: sponsorshipRates.ring_canvas,
        fighterGear: sponsorshipRates.fighter_gear * fighters.length,
        broadcast: sponsorshipRates.broadcast,
        total: 0
      },
      merchandise: this.projectMerchandiseRevenue(fighters, expectedAttendance),
      total: 0
    }

    // Calculate totals
    revenue.ticketSales.total = Object.values(revenue.ticketSales).reduce((sum, val) => 
      typeof val === 'number' ? sum + val : sum, 0)
    revenue.ppvSales.revenue = revenue.ppvSales.price * revenue.ppvSales.expectedBuys
    revenue.sponsorship.total = Object.values(revenue.sponsorship).reduce((sum, val) => 
      typeof val === 'number' ? sum + val : sum, 0)
    revenue.total = revenue.ticketSales.total + revenue.ppvSales.revenue + 
                   revenue.sponsorship.total + revenue.merchandise

    return revenue
  }

  private projectPPVBuyRate(fighters: Fighter[], event: any): number {
    const totalPopularity = fighters.reduce((sum, fighter) => sum + (fighter.popularity || 0), 0)
    const avgPopularity = totalPopularity / fighters.length
    const titleFightMultiplier = event.title_bout ? 1.5 : 1.0

    // Base PPV buy rate
    let buyRate = 100000 // Base buys

    // Adjust for fighter popularity
    buyRate *= (0.5 + avgPopularity / 100)

    // Adjust for title fight
    buyRate *= titleFightMultiplier

    // Add some randomness
    buyRate *= 0.8 + Math.random() * 0.4

    return Math.round(buyRate)
  }

  private projectMerchandiseRevenue(fighters: Fighter[], attendance: number): number {
    const avgPopularity = fighters.reduce((sum, fighter) => sum + (fighter.popularity || 0), 0) / fighters.length
    const merchandisePerAttendee = 15 + (avgPopularity / 100) * 10

    return Math.round(attendance * merchandisePerAttendee * 0.3) // 30% of attendees buy merchandise
  }

  public calculateFinancialMetrics(gameState: GameState): FinancialMetrics {
    const currentPeriod = gameState.current_period || 1
    const revenue = gameState.total_revenue || 0
    const expenses = gameState.total_expenses || 0
    const previousRevenue = gameState.previous_period_revenue || revenue

    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit: revenue - expenses,
      profitMargin: revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0,
      revenueGrowth: previousRevenue > 0 ? ((revenue - previousRevenue) / previousRevenue) * 100 : 0,
      sponsorshipRevenue: gameState.sponsorship_revenue || 0,
      ticketRevenue: gameState.ticket_revenue || 0,
      ppvRevenue: gameState.ppv_revenue || 0,
      merchandiseRevenue: gameState.merchandise_revenue || 0
    }
  }

  public analyzeFighterMarketValue(fighter: Fighter): MarketAnalysis {
    const marketValue = this.calculateFighterMarketValue(fighter)
    const marketDemand = this.getMarketDemand(fighter.weight_class, fighter.region)
    const sponsorshipPotential = (fighter.popularity || 0) * marketDemand / 100

    return {
      fighterValue: marketValue,
      marketDemand: marketDemand,
      sponsorshipPotential: sponsorshipPotential,
      ticketSalesPotential: this.calculateTicketSalesPotential(fighter),
      ppvSalesPotential: this.calculatePPVSalesPotential(fighter),
      riskAssessment: this.assessFighterRisk(fighter),
      growthPotential: this.calculateGrowthPotential(fighter)
    }
  }

  private calculateTicketSalesPotential(fighter: Fighter): number {
    const popularity = fighter.popularity || 0
    const marketDemand = this.getMarketDemand(fighter.weight_class, fighter.region)
    
    return Math.round((popularity * marketDemand) / 100)
  }

  private calculatePPVSalesPotential(fighter: Fighter): number {
    const popularity = fighter.popularity || 0
    const ranking = fighter.ranking || 100
    
    let potential = 50000 // Base PPV potential
    
    if (ranking <= 5) potential *= 2
    else if (ranking <= 10) potential *= 1.5
    else if (ranking <= 20) potential *= 1.2
    
    potential *= (popularity / 100)
    
    return Math.round(potential)
  }

  private assessFighterRisk(fighter: Fighter): number {
    let risk = 0.5 // Base risk

    // Age risk
    if (fighter.age && fighter.age > 35) risk += 0.2
    if (fighter.age && fighter.age > 40) risk += 0.3

    // Injury risk
    if (fighter.injuries && fighter.injuries.length > 0) risk += 0.2

    // Performance risk
    if (fighter.record_losses > fighter.record_wins) risk += 0.3

    // Market risk
    const marketDemand = this.getMarketDemand(fighter.weight_class, fighter.region)
    if (marketDemand < 30) risk += 0.2

    return Math.min(1.0, risk)
  }

  private calculateGrowthPotential(fighter: Fighter): number {
    let potential = 0.5 // Base potential

    // Young fighters have more potential
    if (fighter.age && fighter.age < 25) potential += 0.3
    else if (fighter.age && fighter.age < 30) potential += 0.2

    // Undefeated fighters have more potential
    if (fighter.record_losses === 0) potential += 0.2

    // High ranking fighters have more potential
    if (fighter.ranking && fighter.ranking <= 10) potential += 0.2

    // Popular fighters have more potential
    if (fighter.popularity && fighter.popularity > 70) potential += 0.1

    return Math.min(1.0, potential)
  }

  public updateConfig(newConfig: Partial<BusinessEngineConfig>) {
    this.config = { ...this.config, ...newConfig }
    if (newConfig.aiNegotiation !== undefined) {
      this.initializeAI()
    }
  }

  public getConfig(): BusinessEngineConfig {
    return { ...this.config }
  }
}

// Export singleton instance
export const businessEngine = new GloryBusinessEngine({
  aiNegotiation: true,
  realTimePricing: true,
  marketFluctuation: true,
  sponsorshipTracking: true,
  revenueOptimization: true
}) 