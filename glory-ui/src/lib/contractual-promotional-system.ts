import { EventEmitter } from 'events';

// Contract types
export const ContractType = {
  SINGLE_FIGHT: 'single_fight',
  MULTI_FIGHT: 'multi_fight',
  EXCLUSIVE: 'exclusive',
  CO_PROMOTION: 'co_promotion',
  BROADCASTING: 'broadcasting'
} as const;

export type ContractTypeValue = typeof ContractType[keyof typeof ContractType];

// Promotional companies
export const PromotionalCompany = {
  MATCHROOM: 'Matchroom Boxing',
  TOP_RANK: 'Top Rank',
  GOLDEN_BOY: 'Golden Boy Promotions',
  PREMIER_BOXING_CHAMPIONS: 'Premier Boxing Champions',
  DIAMOND_BOXING: 'Diamond Boxing',
  BOXXER: 'Boxxer',
  FRANK_WARREN: 'Frank Warren Promotions',
  EDDIE_HEARN: 'Eddie Hearn Promotions'
} as const;

export type PromotionalCompanyValue = typeof PromotionalCompany[keyof typeof PromotionalCompany];

// Broadcast partners
export const BroadcastPartner = {
  DAZN: 'DAZN',
  ESPN: 'ESPN',
  SHOWTIME: 'Showtime',
  SKY_SPORTS: 'Sky Sports',
  BT_SPORT: 'BT Sport',
  HBO: 'HBO',
  FOX_SPORTS: 'Fox Sports',
  CBS: 'CBS'
} as const;

export type BroadcastPartnerValue = typeof BroadcastPartner[keyof typeof BroadcastPartner];

// Contract terms interface
export interface ContractTerms {
  id: string;
  type: ContractTypeValue;
  fighterId: string;
  promoterId: PromotionalCompanyValue;
  duration: number; // months
  fightCount: number;
  basePurse: number;
  winBonus: number;
  ppvShare: number; // percentage
  rematchClause: boolean;
  mandatoryDefenses: number;
  escapeOptions: string[];
  penalties: Record<string, number>;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

// Co-promotion deal interface
export interface CoPromotionDeal {
  id: string;
  primaryPromoter: PromotionalCompanyValue;
  secondaryPromoter: PromotionalCompanyValue;
  purseSplit: { primary: number; secondary: number };
  revenueSharing: Record<string, number>;
  marketingResponsibilities: string[];
  broadcastRights: string;
  territoryRights: Record<string, string>;
  disputeResolution: string;
}

// Free agency period interface
export interface FreeAgencyPeriod {
  id: string;
  fighterId: string;
  startDate: Date;
  endDate: Date;
  coolingOffPeriod: number; // days
  bids: Bid[];
  finalDecision?: PromotionalCompanyValue;
}

// Bid interface
export interface Bid {
  id: string;
  promoterId: PromotionalCompanyValue;
  amount: number;
  terms: string[];
  submittedAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

// Broadcasting deal interface
export interface BroadcastingDeal {
  id: string;
  promoterId: PromotionalCompanyValue;
  broadcasterId: BroadcastPartnerValue;
  region: string;
  revenueSplit: { promoter: number; broadcaster: number };
  minimumGuarantee: number;
  ppvThresholds: Record<string, number>;
  exclusivityPeriod: number; // months
  contentRequirements: string[];
}

// Promotional rivalry interface
export interface PromotionalRivalry {
  id: string;
  promoterA: PromotionalCompanyValue;
  promoterB: PromotionalCompanyValue;
  rivalryLevel: number; // 1-10
  crossPromotionRestrictions: boolean;
  fighterPoaching: boolean;
  currentDisputes: string[];
  historicalConflicts: string[];
}

export class ContractualPromotionalSystem extends EventEmitter {
  private contracts: Map<string, ContractTerms> = new Map();
  private coPromotions: Map<string, CoPromotionDeal> = new Map();
  private freeAgencyPeriods: Map<string, FreeAgencyPeriod> = new Map();
  private broadcastingDeals: Map<string, BroadcastingDeal> = new Map();
  private rivalries: Map<string, PromotionalRivalry> = new Map();

  constructor() {
    super();
  }

  // Contract Management
  public createContract(contract: Omit<ContractTerms, 'id'>): ContractTerms {
    const contractTerms: ContractTerms = {
      ...contract,
      id: this.generateId()
    };

    this.contracts.set(contractTerms.id, contractTerms);
    this.emit('contractCreated', contractTerms);
    return contractTerms;
  }

  public updateContract(contractId: string, updates: Partial<ContractTerms>): boolean {
    const contract = this.contracts.get(contractId);
    if (!contract) return false;

    const updatedContract = { ...contract, ...updates };
    this.contracts.set(contractId, updatedContract);
    this.emit('contractUpdated', updatedContract);
    return true;
  }

  public terminateContract(contractId: string, reason: string): boolean {
    const contract = this.contracts.get(contractId);
    if (!contract) return false;

    contract.isActive = false;
    this.contracts.set(contractId, contract);
    this.emit('contractTerminated', { contract, reason });
    return true;
  }

  public calculatePurseSplit(contractId: string, ppvBuys: number): { fighter: number; promoter: number } {
    const contract = this.contracts.get(contractId);
    if (!contract) return { fighter: 0, promoter: 0 };

    const basePurse = contract.basePurse;
    const ppvRevenue = ppvBuys * 50; // $50 per PPV buy
    const ppvShare = ppvRevenue * contract.ppvShare;
    const totalFighterPurse = basePurse + ppvShare;
    const promoterRevenue = ppvRevenue - ppvShare;

    return {
      fighter: totalFighterPurse,
      promoter: promoterRevenue
    };
  }

  // Co-Promotion Management
  public createCoPromotionDeal(deal: Omit<CoPromotionDeal, 'id'>): CoPromotionDeal {
    const coPromotionDeal: CoPromotionDeal = {
      ...deal,
      id: this.generateId()
    };

    this.coPromotions.set(coPromotionDeal.id, coPromotionDeal);
    this.emit('coPromotionCreated', coPromotionDeal);
    return coPromotionDeal;
  }

  public updateCoPromotionDeal(dealId: string, updates: Partial<CoPromotionDeal>): boolean {
    const deal = this.coPromotions.get(dealId);
    if (!deal) return false;

    const updatedDeal = { ...deal, ...updates };
    this.coPromotions.set(dealId, updatedDeal);
    this.emit('coPromotionUpdated', updatedDeal);
    return true;
  }

  // Free Agency Management
  public initiateFreeAgency(fighterId: string, duration: number = 30): FreeAgencyPeriod {
    const freeAgencyPeriod: FreeAgencyPeriod = {
      id: this.generateId(),
      fighterId,
      startDate: new Date(),
      endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      coolingOffPeriod: 7,
      bids: []
    };

    this.freeAgencyPeriods.set(freeAgencyPeriod.id, freeAgencyPeriod);
    this.emit('freeAgencyInitiated', freeAgencyPeriod);
    return freeAgencyPeriod;
  }

  public submitBid(periodId: string, bid: Omit<Bid, 'id' | 'submittedAt' | 'status'>): Bid {
    const period = this.freeAgencyPeriods.get(periodId);
    if (!period) throw new Error('Free agency period not found');

    const newBid: Bid = {
      ...bid,
      id: this.generateId(),
      submittedAt: new Date(),
      status: 'pending'
    };

    period.bids.push(newBid);
    this.freeAgencyPeriods.set(periodId, period);
    this.emit('bidSubmitted', { periodId, bid: newBid });
    return newBid;
  }

  public acceptBid(periodId: string, bidId: string): boolean {
    const period = this.freeAgencyPeriods.get(periodId);
    if (!period) return false;

    const bid = period.bids.find(b => b.id === bidId);
    if (!bid) return false;

    bid.status = 'accepted';
    period.finalDecision = bid.promoterId;
    this.freeAgencyPeriods.set(periodId, period);
    this.emit('bidAccepted', { periodId, bid });
    return true;
  }

  // Broadcasting Management
  public createBroadcastingDeal(deal: Omit<BroadcastingDeal, 'id'>): BroadcastingDeal {
    const broadcastingDeal: BroadcastingDeal = {
      ...deal,
      id: this.generateId()
    };

    this.broadcastingDeals.set(broadcastingDeal.id, broadcastingDeal);
    this.emit('broadcastingDealCreated', broadcastingDeal);
    return broadcastingDeal;
  }

  public updateBroadcastingDeal(dealId: string, updates: Partial<BroadcastingDeal>): boolean {
    const deal = this.broadcastingDeals.get(dealId);
    if (!deal) return false;

    const updatedDeal = { ...deal, ...updates };
    this.broadcastingDeals.set(dealId, updatedDeal);
    this.emit('broadcastingDealUpdated', updatedDeal);
    return true;
  }

  // Rivalry Management
  public createRivalry(rivalry: Omit<PromotionalRivalry, 'id'>): PromotionalRivalry {
    const promotionalRivalry: PromotionalRivalry = {
      ...rivalry,
      id: this.generateId()
    };

    this.rivalries.set(promotionalRivalry.id, promotionalRivalry);
    this.emit('rivalryCreated', promotionalRivalry);
    return promotionalRivalry;
  }

  public updateRivalryLevel(rivalryId: string, newLevel: number): boolean {
    const rivalry = this.rivalries.get(rivalryId);
    if (!rivalry) return false;

    rivalry.rivalryLevel = Math.max(1, Math.min(10, newLevel));
    this.rivalries.set(rivalryId, rivalry);
    this.emit('rivalryLevelUpdated', rivalry);
    return true;
  }

  public addDispute(rivalryId: string, dispute: string): boolean {
    const rivalry = this.rivalries.get(rivalryId);
    if (!rivalry) return false;

    rivalry.currentDisputes.push(dispute);
    this.rivalries.set(rivalryId, rivalry);
    this.emit('disputeAdded', { rivalryId, dispute });
    return true;
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Getters for data access
  public getContracts(): ContractTerms[] {
    return Array.from(this.contracts.values());
  }

  public getCoPromotions(): CoPromotionDeal[] {
    return Array.from(this.coPromotions.values());
  }

  public getFreeAgencyPeriods(): FreeAgencyPeriod[] {
    return Array.from(this.freeAgencyPeriods.values());
  }

  public getBroadcastingDeals(): BroadcastingDeal[] {
    return Array.from(this.broadcastingDeals.values());
  }

  public getRivalries(): PromotionalRivalry[] {
    return Array.from(this.rivalries.values());
  }
}

export const contractualPromotionalSystem = new ContractualPromotionalSystem(); 