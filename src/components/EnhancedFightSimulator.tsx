import React, { useState, useEffect } from 'react'
import { Fighter, Match, FightResult, RoundData } from '../lib/unified-types'
import { combatEngine, CombatEngineConfig } from '../lib/combat-engine'
import { businessEngine, FinancialMetrics, MarketAnalysis } from '../lib/business-engine'
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Users,
  Trophy,
  Zap,
  BarChart3,
  Star
} from 'lucide-react'

interface EnhancedFightSimulatorProps {
  match: Match
  fighters: [Fighter, Fighter]
  onSimulationComplete: (result: FightResult) => void
  onFinancialUpdate?: (metrics: FinancialMetrics) => void
}

interface SimulationState {
  isRunning: boolean
  currentRound: number
  roundData: RoundData[]
  elapsedTime: number
  speed: 'normal' | 'fast' | 'instant'
}

const EnhancedFightSimulator: React.FC<EnhancedFightSimulatorProps> = ({
  match,
  fighters,
  onSimulationComplete,
  onFinancialUpdate
}) => {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    currentRound: 0,
    roundData: [],
    elapsedTime: 0,
    speed: 'normal'
  })

  const [fightResult, setFightResult] = useState<FightResult | null>(null)
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics | null>(null)
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis[]>([])
  const [prediction, setPrediction] = useState<any>(null)
  const [liveStats, setLiveStats] = useState<any>(null)

  const [fighterA, fighterB] = fighters

  useEffect(() => {
    // Initialize market analysis for both fighters
    const analysisA = businessEngine.analyzeFighterMarketValue(fighterA)
    const analysisB = businessEngine.analyzeFighterMarketValue(fighterB)
    setMarketAnalysis([analysisA, analysisB])

    // Get AI prediction
    const aiPrediction = combatEngine.getConfig().aiEnabled ? 
      combatEngine['aiModels'].get('prediction')?.predictWinner(fighterA, fighterB) : null
    setPrediction(aiPrediction)
  }, [fighterA, fighterB])

  const startSimulation = async () => {
    setSimulationState(prev => ({ ...prev, isRunning: true, currentRound: 1 }))
    
    try {
      const result = await combatEngine.simulateFight(match, fighters)
      setFightResult(result)
      
      // Calculate financial impact
      const financialImpact = calculateFinancialImpact(result, match, fighters)
      setFinancialMetrics(financialImpact)
      
      if (onFinancialUpdate) {
        onFinancialUpdate(financialImpact)
      }
      
      onSimulationComplete(result)
    } catch (error) {
      console.error('Simulation failed:', error)
    } finally {
      setSimulationState(prev => ({ ...prev, isRunning: false }))
    }
  }

  const pauseSimulation = () => {
    setSimulationState(prev => ({ ...prev, isRunning: false }))
  }

  const resetSimulation = () => {
    setSimulationState({
      isRunning: false,
      currentRound: 0,
      roundData: [],
      elapsedTime: 0,
      speed: 'normal'
    })
    setFightResult(null)
    setFinancialMetrics(null)
    setLiveStats(null)
  }

  const changeSpeed = (speed: 'normal' | 'fast' | 'instant') => {
    setSimulationState(prev => ({ ...prev, speed }))
  }

  const calculateFinancialImpact = (result: FightResult, match: Match, fighters: [Fighter, Fighter]): FinancialMetrics => {
    // Calculate revenue based on fight result and fighter popularity
    const [fighterA, fighterB] = fighters
    const totalPopularity = (fighterA.popularity || 0) + (fighterB.popularity || 0)
    const avgPopularity = totalPopularity / 2

    const baseRevenue = 1000000 // Base revenue for a fight
    const popularityMultiplier = 1 + (avgPopularity / 100)
    const titleFightMultiplier = match.belt ? 1.5 : 1.0
    const excitementMultiplier = 1 + ((result.fight_rating || result.rating || 0) / 10)

    const totalRevenue = Math.round(baseRevenue * popularityMultiplier * titleFightMultiplier * excitementMultiplier)

    // Calculate different revenue streams
    const ticketRevenue = Math.round(totalRevenue * 0.4)
    const ppvRevenue = Math.round(totalRevenue * 0.35)
    const sponsorshipRevenue = Math.round(totalRevenue * 0.15)
    const merchandiseRevenue = Math.round(totalRevenue * 0.1)

    // Calculate expenses
    const fighterPurses = (fighterA.current_contract_value || 0) + (fighterB.current_contract_value || 0)
    const venueCosts = 200000
    const productionCosts = 150000
    const marketingCosts = Math.round(totalRevenue * 0.1)
    const totalExpenses = fighterPurses + venueCosts + productionCosts + marketingCosts

    return {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      profitMargin: totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0,
      revenueGrowth: 0, // Would need historical data
      sponsorshipRevenue,
      ticketRevenue,
      ppvRevenue,
      merchandiseRevenue
    }
  }

  const getFighterStats = (fighter: Fighter, roundData: RoundData[]) => {
    if (!roundData.length) return null

    const totalPunches = roundData.reduce((sum, round) => 
      sum + round.punchStats.fighterA.thrown + round.punchStats.fighterB.thrown, 0)
    const totalLanded = roundData.reduce((sum, round) => 
      sum + round.punchStats.fighterA.landed + round.punchStats.fighterB.landed, 0)
    const totalPower = roundData.reduce((sum, round) => 
      sum + round.punchStats.fighterA.power + round.punchStats.fighterB.power, 0)

    return {
      punchesThrown: totalPunches,
      punchesLanded: totalLanded,
      accuracy: totalPunches > 0 ? (totalLanded / totalPunches) * 100 : 0,
      totalPower,
      knockdowns: roundData.reduce((sum, round) => sum + round.knockdowns.length, 0)
    }
  }

  const getMethodColor = (method?: string) => {
    switch (method?.toLowerCase()) {
      case 'ko':
      case 'tko':
        return 'text-red-600'
      case 'decision':
        return 'text-blue-600'
      case 'submission':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Enhanced Fight Simulator</h2>
        <div className="flex items-center space-x-2">
          {prediction && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Target className="w-4 h-4" />
              <span>AI Prediction: {prediction.winner} ({Math.round(prediction.confidence * 100)}%)</span>
            </div>
          )}
        </div>
      </div>

      {/* Fighter Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {fighters.map((fighter, index) => (
          <div key={fighter.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">{fighter.name}</h3>
              <div className="flex items-center space-x-2">
                {fighter.ranking && fighter.ranking <= 3 && (
                  <Trophy className="w-5 h-5 text-yellow-500" />
                )}
                <span className="text-sm text-gray-600">#{fighter.ranking || 'Unranked'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Record</p>
                <p className="font-semibold">{fighter.record_wins}-{fighter.record_losses}-{fighter.record_draws}</p>
              </div>
              <div>
                <p className="text-gray-600">Age</p>
                <p className="font-semibold">{fighter.age}</p>
              </div>
              <div>
                <p className="text-gray-600">Power</p>
                <div className="flex items-center space-x-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${fighter.power || 0}%` }}
                    />
                  </div>
                  <span className="text-xs">{fighter.power || 0}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600">Speed</p>
                <div className="flex items-center space-x-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${fighter.speed || 0}%` }}
                    />
                  </div>
                  <span className="text-xs">{fighter.speed || 0}</span>
                </div>
              </div>
            </div>

            {marketAnalysis[index] && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Market Value: ${marketAnalysis[index].fighterValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>Growth: {Math.round(marketAnalysis[index].growthPotential * 100)}%</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Simulation Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {!simulationState.isRunning ? (
            <button
              onClick={startSimulation}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Start Simulation</span>
            </button>
          ) : (
            <button
              onClick={pauseSimulation}
              className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
            >
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={resetSimulation}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Speed:</span>
          {(['normal', 'fast', 'instant'] as const).map((speed) => (
            <button
              key={speed}
              onClick={() => changeSpeed(speed)}
              className={`px-3 py-1 rounded text-sm ${
                simulationState.speed === speed
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {speed.charAt(0).toUpperCase() + speed.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Live Statistics */}
      {liveStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Total Punches</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{liveStats.punchesThrown}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{liveStats.accuracy.toFixed(1)}%</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">Power Shots</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{liveStats.totalPower}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium">Knockdowns</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{liveStats.knockdowns}</p>
          </div>
        </div>
      )}

      {/* Fight Result */}
      {fightResult && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Fight Result</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded text-sm font-medium ${getMethodColor(fightResult.method)}`}>
                {fightResult.method?.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600">Round {fightResult.round}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Winner</h4>
              <p className="text-2xl font-bold text-green-600">{fightResult.winner?.name}</p>
              <p className="text-sm text-gray-600 mt-1">
                {fightResult.timeInRound} in round {fightResult.round}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Fight Rating</h4>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor((fightResult.fight_rating || fightResult.rating || 0) / 2)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">({fightResult.rating}/10)</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {fightResult.rating >= 8 ? 'Excellent fight!' :
                 fightResult.rating >= 6 ? 'Good fight' :
                 fightResult.rating >= 4 ? 'Average fight' : 'Poor fight'}
              </p>
            </div>
          </div>

          {fightResult.highlights && fightResult.highlights.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Highlights</h4>
              <ul className="space-y-1">
                {fightResult.highlights.map((highlight, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Financial Impact */}
      {financialMetrics && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-lg font-bold text-green-600">${financialMetrics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-lg font-bold text-red-600">${financialMetrics.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className={`text-lg font-bold ${financialMetrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${financialMetrics.netProfit.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className={`text-lg font-bold ${financialMetrics.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {financialMetrics.profitMargin.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-sm text-gray-600">Ticket Sales</p>
              <p className="text-lg font-bold text-blue-600">${financialMetrics.ticketRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-sm text-gray-600">PPV Revenue</p>
              <p className="text-lg font-bold text-purple-600">${financialMetrics.ppvRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-sm text-gray-600">Sponsorship</p>
              <p className="text-lg font-bold text-orange-600">${financialMetrics.sponsorshipRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <p className="text-sm text-gray-600">Merchandise</p>
              <p className="text-lg font-bold text-indigo-600">${financialMetrics.merchandiseRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Round-by-Round Analysis */}
      {fightResult?.roundData && fightResult.roundData.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Round-by-Round Analysis</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {fightResult.roundData.map((round, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Round {round.round}</h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>Punches: {round.punchStats.fighterA.landed + round.punchStats.fighterB.landed}</span>
                    <span>Power: {round.punchStats.fighterA.power + round.punchStats.fighterB.power}</span>
                    {round.knockdowns.length > 0 && (
                      <span className="text-red-600 font-medium">
                        {round.knockdowns.length} KD{round.knockdowns.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                {round.commentary && (
                  <p className="text-sm text-gray-700">{round.commentary.text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedFightSimulator 