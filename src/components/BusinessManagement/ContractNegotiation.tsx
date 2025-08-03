'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DollarSign, FileText, Users, TrendingUp, AlertTriangle, CheckCircle, XCircle, Percent } from 'lucide-react'
import { Fighter, Contract } from '@/lib/supabase'

interface ContractNegotiationProps {
  fighter: Fighter
  onNegotiate: (contractData: Partial<Contract>) => void
  onClose: () => void
}

const ContractNegotiation: React.FC<ContractNegotiationProps> = ({ fighter, onNegotiate, onClose }) => {
  const [negotiationStep, setNegotiationStep] = useState<'initial' | 'terms' | 'negotiation' | 'final'>('initial')
  const [contractTerms, setContractTerms] = useState({
    contract_type: 'development' as Contract['contract_type'],
    base_purse: 5000,
    win_bonus: 1000,
    knockout_bonus: 500,
    ppv_percentage: 0,
    sponsorship_split: 0,
    fights_committed: 3,
    duration_months: 12,
    is_exclusive: false,
  })
  const [negotiationHistory, setNegotiationHistory] = useState<string[]>([])
  const [fighterSatisfaction, setFighterSatisfaction] = useState(50)
  const [promoterSatisfaction, setPromoterSatisfaction] = useState(50)
  const [currentOffer, setCurrentOffer] = useState(0)

  const contractTypes = {
    amateur: { basePurse: 0, winBonus: 0, ppvPercentage: 0, description: 'Amateur contract - no purse' },
    pro_debut: { basePurse: 2000, winBonus: 500, ppvPercentage: 0, description: 'Professional debut contract' },
    development: { basePurse: 5000, winBonus: 1000, ppvPercentage: 5, description: 'Development contract for prospects' },
    championship: { basePurse: 25000, winBonus: 10000, ppvPercentage: 15, description: 'Championship level contract' },
    super_fight: { basePurse: 100000, winBonus: 50000, ppvPercentage: 25, description: 'Super fight contract' },
    retirement: { basePurse: 50000, winBonus: 25000, ppvPercentage: 20, description: 'Retirement fight contract' }
  }

  const getFighterValue = () => {
    let value = 10000 // Base value
    
    // Career stage multiplier
    const stageMultipliers = {
      amateur: 0.5,
      prospect: 1.0,
      contender: 2.0,
      champion: 5.0,
      legend: 3.0,
      retired: 1.5
    }
    value *= stageMultipliers[fighter.career_stage]
    
    // Record multiplier
    const winRate = fighter.record_wins / Math.max(1, fighter.record_wins + fighter.record_losses)
    value *= (0.5 + winRate)
    
    // Experience multiplier
    value *= (1 + fighter.experience_level * 0.1)
    
    // Reputation multiplier (based on career earnings)
    if (fighter.career_earnings > 1000000) value *= 2.0
    else if (fighter.career_earnings > 500000) value *= 1.5
    else if (fighter.career_earnings > 100000) value *= 1.2
    
    return Math.round(value)
  }

  const calculateContractValue = () => {
    const baseValue = contractTerms.base_purse * contractTerms.fights_committed
    const bonusValue = (contractTerms.win_bonus + contractTerms.knockout_bonus) * contractTerms.fights_committed * 0.7 // Assume 70% win rate
    return baseValue + bonusValue
  }

  const getNegotiationDifficulty = () => {
    let difficulty = 50
    
    // Fighter's financial situation
    if (fighter.career_earnings < 50000) difficulty -= 10 // More desperate
    if (fighter.career_earnings > 500000) difficulty += 20 // More established
    
    // Fighter's confidence and motivation
    difficulty += (fighter.confidence - 50) * 0.2
    difficulty += (fighter.motivation - 50) * 0.2
    
    // Contract type
    if (contractTerms.contract_type === 'super_fight') difficulty += 30
    if (contractTerms.contract_type === 'championship') difficulty += 20
    
    return Math.max(0, Math.min(100, difficulty))
  }

  const handleTermChange = (field: string, value: any) => {
    setContractTerms(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const makeOffer = () => {
    const offer = calculateContractValue()
    setCurrentOffer(offer)
    
    const fighterValue = getFighterValue()
    const difficulty = getNegotiationDifficulty()
    
    // Calculate satisfaction changes
    const offerRatio = offer / fighterValue
    let newFighterSatisfaction = fighterSatisfaction
    let newPromoterSatisfaction = promoterSatisfaction
    
    if (offerRatio > 1.2) {
      newFighterSatisfaction += 15
      newPromoterSatisfaction -= 10
      setNegotiationHistory(prev => [...prev, `Fighter is very happy with the generous offer`])
    } else if (offerRatio > 1.0) {
      newFighterSatisfaction += 10
      newPromoterSatisfaction -= 5
      setNegotiationHistory(prev => [...prev, `Fighter accepts the fair offer`])
    } else if (offerRatio > 0.8) {
      newFighterSatisfaction += 5
      setNegotiationHistory(prev => [...prev, `Fighter considers the offer acceptable`])
    } else if (offerRatio > 0.6) {
      newFighterSatisfaction -= 10
      setNegotiationHistory(prev => [...prev, `Fighter is disappointed with the low offer`])
    } else {
      newFighterSatisfaction -= 20
      setNegotiationHistory(prev => [...prev, `Fighter is insulted by the offer`])
    }
    
    // Difficulty affects satisfaction
    if (difficulty > 70) {
      newFighterSatisfaction -= 5
      setNegotiationHistory(prev => [...prev, `High negotiation difficulty affects satisfaction`])
    }
    
    setFighterSatisfaction(Math.max(0, Math.min(100, newFighterSatisfaction)))
    setPromoterSatisfaction(Math.max(0, Math.min(100, newPromoterSatisfaction)))
    
    setNegotiationStep('negotiation')
  }

  const finalizeContract = () => {
    const contractData = {
      fighter_id: fighter.id,
      ...contractTerms,
      contract_value: calculateContractValue(),
      negotiation_difficulty: getNegotiationDifficulty(),
      fighter_satisfaction: fighterSatisfaction,
      promoter_satisfaction: promoterSatisfaction,
      end_date: new Date(Date.now() + contractTerms.duration_months * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }
    
    onNegotiate(contractData)
  }

  const getSatisfactionColor = (satisfaction: number) => {
    if (satisfaction >= 80) return 'text-green-500'
    if (satisfaction >= 60) return 'text-blue-500'
    if (satisfaction >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getSatisfactionIcon = (satisfaction: number) => {
    if (satisfaction >= 80) return <CheckCircle className="w-5 h-5" />
    if (satisfaction >= 60) return <TrendingUp className="w-5 h-5" />
    if (satisfaction >= 40) return <AlertTriangle className="w-5 h-5" />
    return <XCircle className="w-5 h-5" />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Negotiation Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-lg border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Contract Negotiation</h2>
                <p className="text-gray-300">Negotiating with {fighter.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Fighter Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-2">Fighter Value</h3>
              <div className="text-2xl font-bold text-green-400">£{getFighterValue().toLocaleString()}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-2">Career Earnings</h3>
              <div className="text-2xl font-bold text-blue-400">£{fighter.career_earnings.toLocaleString()}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-2">Record</h3>
              <div className="text-2xl font-bold text-white">
                {fighter.record_wins}-{fighter.record_losses}-{fighter.record_draws}
              </div>
            </div>
          </div>

          {/* Contract Terms */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Contract Terms</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contract Type */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Contract Type</label>
                <select
                  value={contractTerms.contract_type}
                  onChange={(e) => handleTermChange('contract_type', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  {Object.entries(contractTypes).map(([type, info]) => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').toUpperCase()} - {info.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Duration (months)</label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  value={contractTerms.duration_months}
                  onChange={(e) => handleTermChange('duration_months', parseInt(e.target.value))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
              </div>

              {/* Financial Terms */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Base Purse ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={contractTerms.base_purse}
                    onChange={(e) => handleTermChange('base_purse', parseInt(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Win Bonus ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={contractTerms.win_bonus}
                    onChange={(e) => handleTermChange('win_bonus', parseInt(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">KO Bonus ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={contractTerms.knockout_bonus}
                    onChange={(e) => handleTermChange('knockout_bonus', parseInt(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Percentage Terms */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">PPV Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={contractTerms.ppv_percentage}
                    onChange={(e) => handleTermChange('ppv_percentage', parseFloat(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Sponsorship Split (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={contractTerms.sponsorship_split}
                    onChange={(e) => handleTermChange('sponsorship_split', parseFloat(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Fights Committed</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={contractTerms.fights_committed}
                    onChange={(e) => handleTermChange('fights_committed', parseInt(e.target.value))}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Exclusive Contract */}
            <div className="mt-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={contractTerms.is_exclusive}
                  onChange={(e) => handleTermChange('is_exclusive', e.target.checked)}
                  className="rounded border-gray-600 text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-300">Exclusive Contract (higher base purse)</span>
              </label>
            </div>
          </div>

          {/* Contract Summary */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Contract Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-300">Total Contract Value:</span>
                <div className="text-2xl font-bold text-green-400">£{calculateContractValue().toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-300">Negotiation Difficulty:</span>
                <div className="text-2xl font-bold text-yellow-400">{getNegotiationDifficulty()}%</div>
              </div>
              <div>
                <span className="text-gray-300">Per Fight Average:</span>
                <div className="text-2xl font-bold text-blue-400">
                  £{Math.round(calculateContractValue() / contractTerms.fights_committed).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Negotiation Status */}
          {negotiationStep === 'negotiation' && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Negotiation Status</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Fighter Satisfaction</span>
                    {getSatisfactionIcon(fighterSatisfaction)}
                  </div>
                  <div className={`text-2xl font-bold ${getSatisfactionColor(fighterSatisfaction)}`}>
                    {fighterSatisfaction}%
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Promoter Satisfaction</span>
                    {getSatisfactionIcon(promoterSatisfaction)}
                  </div>
                  <div className={`text-2xl font-bold ${getSatisfactionColor(promoterSatisfaction)}`}>
                    {promoterSatisfaction}%
                  </div>
                </div>
              </div>

              {/* Negotiation History */}
              <div>
                <h4 className="text-white font-semibold mb-3">Negotiation History</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {negotiationHistory.map((entry, index) => (
                    <div key={index} className="text-gray-300 text-sm bg-gray-700 rounded p-2">
                      {entry}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            {negotiationStep === 'initial' && (
              <button
                onClick={makeOffer}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <DollarSign className="w-5 h-5" />
                Make Offer
              </button>
            )}
            
            {negotiationStep === 'negotiation' && (
              <>
                <button
                  onClick={() => setNegotiationStep('initial')}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Adjust Terms
                </button>
                <button
                  onClick={finalizeContract}
                  disabled={fighterSatisfaction < 30}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Finalize Contract
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ContractNegotiation 