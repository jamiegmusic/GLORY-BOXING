import React, { useState, useEffect } from 'react';
import { contractualPromotionalSystem, ContractType, PromotionalCompany, BroadcastPartner } from '../../lib/contractual-promotional-system';
import type {
  ContractTerms,
  CoPromotionDeal,
  FreeAgencyPeriod,
  BroadcastingDeal,
  PromotionalRivalry,
} from '../../lib/contractual-promotional-system';

const ContractualPromotionalPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contracts');
  const [contracts, setContracts] = useState<ContractTerms[]>([]);
  const [coPromotions, setCoPromotions] = useState<CoPromotionDeal[]>([]);
  const [freeAgencyPeriods, setFreeAgencyPeriods] = useState<FreeAgencyPeriod[]>([]);
  const [broadcastingDeals, setBroadcastingDeals] = useState<BroadcastingDeal[]>([]);
  const [rivalries, setRivalries] = useState<PromotionalRivalry[]>([]);

  useEffect(() => {
    // Load data from the system
    setContracts(contractualPromotionalSystem.getContracts());
    setCoPromotions(contractualPromotionalSystem.getCoPromotions());
    setFreeAgencyPeriods(contractualPromotionalSystem.getFreeAgencyPeriods());
    setBroadcastingDeals(contractualPromotionalSystem.getBroadcastingDeals());
    setRivalries(contractualPromotionalSystem.getRivalries());

    // Listen for events
    const handleContractCreated = (contract: ContractTerms) => {
      setContracts(prev => [...prev, contract]);
    };

    const handleCoPromotionCreated = (deal: CoPromotionDeal) => {
      setCoPromotions(prev => [...prev, deal]);
    };

    const handleFreeAgencyInitiated = (period: FreeAgencyPeriod) => {
      setFreeAgencyPeriods(prev => [...prev, period]);
    };

    const handleBroadcastingDealCreated = (deal: BroadcastingDeal) => {
      setBroadcastingDeals(prev => [...prev, deal]);
    };

    const handleRivalryCreated = (rivalry: PromotionalRivalry) => {
      setRivalries(prev => [...prev, rivalry]);
    };

    contractualPromotionalSystem.on('contractCreated', handleContractCreated);
    contractualPromotionalSystem.on('coPromotionCreated', handleCoPromotionCreated);
    contractualPromotionalSystem.on('freeAgencyInitiated', handleFreeAgencyInitiated);
    contractualPromotionalSystem.on('broadcastingDealCreated', handleBroadcastingDealCreated);
    contractualPromotionalSystem.on('rivalryCreated', handleRivalryCreated);

    return () => {
      contractualPromotionalSystem.off('contractCreated', handleContractCreated);
      contractualPromotionalSystem.off('coPromotionCreated', handleCoPromotionCreated);
      contractualPromotionalSystem.off('freeAgencyInitiated', handleFreeAgencyInitiated);
      contractualPromotionalSystem.off('broadcastingDealCreated', handleBroadcastingDealCreated);
      contractualPromotionalSystem.off('rivalryCreated', handleRivalryCreated);
    };
  }, []);

  const createSampleContract = () => {
    const contract: Omit<ContractTerms, 'id'> = {
      type: ContractType.MULTI_FIGHT,
      fighterId: 'fighter-1',
      promoterId: PromotionalCompany.MATCHROOM,
      duration: 24,
      fightCount: 6,
      basePurse: 500000,
      winBonus: 100000,
      ppvShare: 0.15,
      rematchClause: true,
      mandatoryDefenses: 2,
      escapeOptions: ['Buyout clause', 'Performance clause'],
      penalties: { 'No-show': 50000, 'Weight miss': 25000 },
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000),
      isActive: true
    };

    contractualPromotionalSystem.createContract(contract);
  };

  const createSampleCoPromotion = () => {
    const deal: Omit<CoPromotionDeal, 'id'> = {
      primaryPromoter: PromotionalCompany.MATCHROOM,
      secondaryPromoter: PromotionalCompany.TOP_RANK,
      purseSplit: { primary: 60, secondary: 40 },
      revenueSharing: { 'PPV': 50, 'Gate': 50, 'Sponsorship': 60 },
      marketingResponsibilities: ['Primary: UK market', 'Secondary: US market'],
      broadcastRights: 'Shared',
      territoryRights: { 'UK': 'Primary', 'US': 'Secondary', 'Global': 'Shared' },
      disputeResolution: 'Arbitration'
    };

    contractualPromotionalSystem.createCoPromotionDeal(deal);
  };

  const createSampleBroadcastingDeal = () => {
    const deal: Omit<BroadcastingDeal, 'id'> = {
      promoterId: PromotionalCompany.MATCHROOM,
      broadcasterId: BroadcastPartner.DAZN,
      region: 'Global',
      revenueSplit: { promoter: 70, broadcaster: 30 },
      minimumGuarantee: 1000000,
      ppvThresholds: { '500k': 0.1, '1M': 0.15, '2M': 0.2 },
      exclusivityPeriod: 36,
      contentRequirements: ['12 fights per year', 'Exclusive content', 'Behind-the-scenes']
    };

    contractualPromotionalSystem.createBroadcastingDeal(deal);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contractual & Promotional System</h1>
          <p className="text-gray-600">Manage contracts, free agency, broadcasting deals, and promotional rivalries</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6">
          {[
            { id: 'contracts', label: 'Contracts', count: contracts.length },
            { id: 'co-promotions', label: 'Co-Promotions', count: coPromotions.length },
            { id: 'free-agency', label: 'Free Agency', count: freeAgencyPeriods.length },
            { id: 'broadcasting', label: 'Broadcasting', count: broadcastingDeals.length },
            { id: 'rivalries', label: 'Rivalries', count: rivalries.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'contracts' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Fighter Contracts</h2>
                <button
                  onClick={createSampleContract}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Create Sample Contract
                </button>
              </div>
              
              <div className="grid gap-4">
                {contracts.map(contract => (
                  <div key={contract.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{contract.type.replace('_', ' ')} Contract</h3>
                        <p className="text-gray-600">Fighter ID: {contract.fighterId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        contract.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {contract.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Duration:</span> {contract.duration} months
                      </div>
                      <div>
                        <span className="font-medium">Fights:</span> {contract.fightCount}
                      </div>
                      <div>
                        <span className="font-medium">Base Purse:</span> ${contract.basePurse.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Win Bonus:</span> ${contract.winBonus.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'co-promotions' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Co-Promotion Deals</h2>
                <button
                  onClick={createSampleCoPromotion}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Create Sample Deal
                </button>
              </div>
              
              <div className="grid gap-4">
                {coPromotions.map(deal => (
                  <div key={deal.id} className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-3">
                      {deal.primaryPromoter} vs {deal.secondaryPromoter}
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Purse Split:</span> {deal.purseSplit.primary}% / {deal.purseSplit.secondary}%
                      </div>
                      <div>
                        <span className="font-medium">Broadcast Rights:</span> {deal.broadcastRights}
                      </div>
                      <div>
                        <span className="font-medium">Dispute Resolution:</span> {deal.disputeResolution}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'free-agency' && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Free Agency Periods</h2>
              
              <div className="grid gap-4">
                {freeAgencyPeriods.map(period => (
                  <div key={period.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">Free Agency Period</h3>
                        <p className="text-gray-600">Fighter ID: {period.fighterId}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                        {period.finalDecision ? 'Decided' : 'Active'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Start Date:</span> {period.startDate.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">End Date:</span> {period.endDate.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Bids:</span> {period.bids.length}
                      </div>
                      <div>
                        <span className="font-medium">Cooling Off:</span> {period.coolingOffPeriod} days
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'broadcasting' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Broadcasting Deals</h2>
                <button
                  onClick={createSampleBroadcastingDeal}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Create Sample Deal
                </button>
              </div>
              
              <div className="grid gap-4">
                {broadcastingDeals.map(deal => (
                  <div key={deal.id} className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-semibold text-lg mb-3">
                      {deal.promoterId} - {deal.broadcasterId}
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Region:</span> {deal.region}
                      </div>
                      <div>
                        <span className="font-medium">Revenue Split:</span> {deal.revenueSplit.promoter}% / {deal.revenueSplit.broadcaster}%
                      </div>
                      <div>
                        <span className="font-medium">Min Guarantee:</span> ${deal.minimumGuarantee.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Exclusivity:</span> {deal.exclusivityPeriod} months
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rivalries' && (
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Promotional Rivalries</h2>
              
              <div className="grid gap-4">
                {rivalries.map(rivalry => (
                  <div key={rivalry.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {rivalry.promoterA} vs {rivalry.promoterB}
                        </h3>
                        <p className="text-gray-600">Rivalry Level: {rivalry.rivalryLevel}/10</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        rivalry.rivalryLevel > 7 ? 'bg-red-100 text-red-800' : 
                        rivalry.rivalryLevel > 4 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {rivalry.rivalryLevel > 7 ? 'High' : rivalry.rivalryLevel > 4 ? 'Medium' : 'Low'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Cross-Promotion:</span> {rivalry.crossPromotionRestrictions ? 'Restricted' : 'Allowed'}
                      </div>
                      <div>
                        <span className="font-medium">Fighter Poaching:</span> {rivalry.fighterPoaching ? 'Yes' : 'No'}
                      </div>
                    </div>
                    
                    {rivalry.currentDisputes.length > 0 && (
                      <div className="mt-3">
                        <span className="font-medium text-sm">Current Disputes:</span>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                          {rivalry.currentDisputes.map((dispute, index) => (
                            <li key={index}>{dispute}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractualPromotionalPanel; 