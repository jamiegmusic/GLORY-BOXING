import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Settings } from 'lucide-react'
import { Fighter, Fight } from '@/lib/supabase'

interface FightAction {
  type: 'punch' | 'defense' | 'movement'
  punch_type?: 'jab' | 'cross' | 'hook' | 'uppercut' | 'combination'
  defense_type?: 'block' | 'parry' | 'slip' | 'roll'
  position?: { x: number; y: number }
  landed?: boolean
  damage?: number
  stamina_cost?: number
}

interface RoundData {
  round: number
  fighter1_actions: FightAction[]
  fighter2_actions: FightAction[]
  knockdown: boolean
  knockdown_fighter?: string
  fighter1_stamina_end: number
  fighter2_stamina_end: number
  fighter1_damage_taken: number
  fighter2_damage_taken: number
  commentary: string[]
}

interface FightSimulationData {
  fighter1: Fighter
  fighter2: Fighter
  rounds: RoundData[]
  winner?: Fighter
  method?: string
  round_stopped?: number
  statistics: {
    fighter1_punches: { jabs: number; power: number; combinations: number; accuracy: number }
    fighter2_punches: { jabs: number; power: number; combinations: number; accuracy: number }
    fighter1_movement: any[]
    fighter2_movement: any[]
    damage_taken: { fighter1: number; fighter2: number }
  }
  analytics: any
}

export default function AdvancedFightEngine() {
  const [fightData, setFightData] = useState<FightSimulationData | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [currentSecond, setCurrentSecond] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [selectedFighter1, setSelectedFighter1] = useState<string>('')
  const [selectedFighter2, setSelectedFighter2] = useState<string>('')
  const [fighters, setFighters] = useState<Fighter[]>([])
  const [commentary, setCommentary] = useState<string[]>([])
  const simulationRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadFighters()
  }, [])

  const loadFighters = async () => {
    try {
      const { data, error } = await supabase
        .from('fighters')
        .select('*')
        .eq('is_available', true)

      if (error) throw error
      setFighters(data || [])
    } catch (error) {
      console.error('Error loading fighters:', error)
    }
  }

  const startFightSimulation = async () => {
    if (!selectedFighter1 || !selectedFighter2) {
      alert('Please select both fighters')
      return
    }

    const fighter1 = fighters.find(f => f.id === selectedFighter1)
    const fighter2 = fighters.find(f => f.id === selectedFighter2)

    if (!fighter1 || !fighter2) return

    setIsSimulating(true)
    setCurrentRound(1)
    setCurrentSecond(0)
    setCommentary([])

    try {
      const simulationData = await simulateCompleteFight(fighter1, fighter2)
      setFightData(simulationData)
      startPlayback()
    } catch (error) {
      console.error('Error simulating fight:', error)
    } finally {
      setIsSimulating(false)
    }
  }

  const simulateCompleteFight = async (fighter1: Fighter, fighter2: Fighter): Promise<FightSimulationData> => {
    const rounds: RoundData[] = []
    let fighter1Stamina = 100
    let fighter2Stamina = 100
    let fighter1Damage = 0
    let fighter2Damage = 0

    for (let round = 1; round <= 12; round++) {
      const roundData = await simulateRound(fighter1, fighter2, round, fighter1Stamina, fighter2Stamina, fighter1Damage, fighter2Damage)
      rounds.push(roundData)

      // Update stamina and damage
      fighter1Stamina = roundData.fighter1_stamina_end
      fighter2Stamina = roundData.fighter2_stamina_end
      fighter1Damage += roundData.fighter1_damage_taken
      fighter2Damage += roundData.fighter2_damage_taken

      // Check for knockout
      if (roundData.knockdown) {
        const winner = roundData.knockdown_fighter === fighter1.id ? fighter2 : fighter1
        return {
          fighter1,
          fighter2,
          rounds,
          winner,
          method: 'knockout',
          round_stopped: round,
          statistics: calculateFightStatistics(rounds),
          analytics: await generatePostFightAnalytics(rounds, fighter1, fighter2)
        }
      }

      // Check for TKO
      if (fighter1Damage > 80 || fighter2Damage > 80) {
        const winner = fighter1Damage > fighter2Damage ? fighter2 : fighter1
        return {
          fighter1,
          fighter2,
          rounds,
          winner,
          method: 'tko',
          round_stopped: round,
          statistics: calculateFightStatistics(rounds),
          analytics: await generatePostFightAnalytics(rounds, fighter1, fighter2)
        }
      }
    }

    // Decision
    const winner = fighter1Damage < fighter2Damage ? fighter1 : fighter2
    return {
      fighter1,
      fighter2,
      rounds,
      winner,
      method: 'decision',
      statistics: calculateFightStatistics(rounds),
      analytics: await generatePostFightAnalytics(rounds, fighter1, fighter2)
    }
  }

  const simulateRound = async (fighter1: Fighter, fighter2: Fighter, roundNum: number, stamina1: number, stamina2: number, damage1: number, damage2: number): Promise<RoundData> => {
    const roundData: RoundData = {
      round: roundNum,
      fighter1_actions: [],
      fighter2_actions: [],
      knockdown: false,
      fighter1_stamina_end: stamina1,
      fighter2_stamina_end: stamina2,
      fighter1_damage_taken: 0,
      fighter2_damage_taken: 0,
      commentary: []
    }

    // Add round start commentary
    roundData.commentary.push(`Round ${roundNum} begins!`)
    roundData.commentary.push(`${fighter1.name} and ${fighter2.name} are ready to fight!`)

    // Simulate 3 minutes of action (180 seconds)
    for (let second = 0; second < 180; second++) {
      const fighter1Action = determineFighterAction(fighter1, fighter2, stamina1, damage1)
      const fighter2Action = determineFighterAction(fighter2, fighter1, stamina2, damage2)

      const outcome = calculateActionOutcome(fighter1Action, fighter2Action, fighter1, fighter2, stamina1, stamina2)

      roundData.fighter1_actions.push(fighter1Action)
      roundData.fighter2_actions.push(fighter2Action)

      // Update stamina and damage
      stamina1 -= outcome.fighter1_stamina_cost
      stamina2 -= outcome.fighter2_stamina_cost
      damage1 += outcome.fighter1_damage_taken
      damage2 += outcome.fighter2_damage_taken

      // Add commentary for significant events
      if (outcome.fighter1_damage_taken > 5) {
        roundData.commentary.push(`${fighter2.name} lands a powerful shot on ${fighter1.name}!`)
      }
      if (outcome.fighter2_damage_taken > 5) {
        roundData.commentary.push(`${fighter1.name} connects with a solid punch on ${fighter2.name}!`)
      }

      // Check for knockdown
      if (outcome.knockdown) {
        roundData.knockdown = true
        roundData.knockdown_fighter = outcome.knockdown_fighter
        roundData.commentary.push(`${outcome.knockdown_fighter === fighter1.id ? fighter1.name : fighter2.name} goes down!`)
        break
      }
    }

    roundData.fighter1_stamina_end = stamina1
    roundData.fighter2_stamina_end = stamina2
    roundData.fighter1_damage_taken = damage1
    roundData.fighter2_damage_taken = damage2

    return roundData
  }

  const determineFighterAction = (fighter: Fighter, opponent: Fighter, stamina: number, damage: number): FightAction => {
    const actionTypes = ['punch', 'defense', 'movement']
    const punchTypes = ['jab', 'cross', 'hook', 'uppercut', 'combination']
    const defenseTypes = ['block', 'parry', 'slip', 'roll']

    // AI-driven decision making
    const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)]
    
    if (actionType === 'punch') {
      const punchType = punchTypes[Math.floor(Math.random() * punchTypes.length)]
      const accuracy = calculatePunchAccuracy(fighter, opponent)
      const landed = Math.random() < accuracy

      return {
        type: 'punch',
        punch_type: punchType as any,
        landed,
        damage: landed ? calculatePunchDamage(fighter, punchType) : 0,
        stamina_cost: getPunchStaminaCost(punchType)
      }
    } else if (actionType === 'defense') {
      const defenseType = defenseTypes[Math.floor(Math.random() * defenseTypes.length)]
      return {
        type: 'defense',
        defense_type: defenseType as any,
        stamina_cost: getDefenseStaminaCost(defenseType)
      }
    } else {
      return {
        type: 'movement',
        position: { x: Math.random() * 20, y: Math.random() * 20 },
        stamina_cost: 1
      }
    }
  }

  const calculatePunchAccuracy = (fighter: Fighter, opponent: Fighter): number => {
    const baseAccuracy = 0.6
    const speedBonus = fighter.speed / 100 * 0.2
    const defensePenalty = opponent.defense / 100 * 0.1
    return Math.min(0.95, baseAccuracy + speedBonus - defensePenalty)
  }

  const calculatePunchDamage = (fighter: Fighter, punchType: string): number => {
    const baseDamage = {
      jab: 3,
      cross: 7,
      hook: 8,
      uppercut: 9,
      combination: 6
    }
    const powerBonus = fighter.punching_power / 100
    return baseDamage[punchType as keyof typeof baseDamage] * (1 + powerBonus)
  }

  const getPunchStaminaCost = (punchType: string): number => {
    const costs = {
      jab: 2,
      cross: 4,
      hook: 5,
      uppercut: 6,
      combination: 8
    }
    return costs[punchType as keyof typeof costs]
  }

  const getDefenseStaminaCost = (defenseType: string): number => {
    const costs = {
      block: 1,
      parry: 2,
      slip: 3,
      roll: 2
    }
    return costs[defenseType as keyof typeof costs]
  }

  const calculateActionOutcome = (action1: FightAction, action2: FightAction, fighter1: Fighter, fighter2: Fighter, stamina1: number, stamina2: number) => {
    const outcome = {
      fighter1_stamina_cost: action1.stamina_cost || 0,
      fighter2_stamina_cost: action2.stamina_cost || 0,
      fighter1_damage_taken: 0,
      fighter2_damage_taken: 0,
      knockdown: false,
      knockdown_fighter: null as string | null
    }

    // Calculate damage based on actions
    if (action1.type === 'punch' && action1.landed) {
      outcome.fighter2_damage_taken = action1.damage || 0
    }
    if (action2.type === 'punch' && action2.landed) {
      outcome.fighter1_damage_taken = action2.damage || 0
    }

    // Check for knockdown (1% chance per landed punch)
    if (action1.type === 'punch' && action1.landed && Math.random() < 0.01) {
      outcome.knockdown = true
      outcome.knockdown_fighter = fighter1.id
    }
    if (action2.type === 'punch' && action2.landed && Math.random() < 0.01) {
      outcome.knockdown = true
      outcome.knockdown_fighter = fighter2.id
    }

    return outcome
  }

  const calculateFightStatistics = (rounds: RoundData[]) => {
    const stats = {
      fighter1_punches: { jabs: 0, power: 0, combinations: 0, accuracy: 0 },
      fighter2_punches: { jabs: 0, power: 0, combinations: 0, accuracy: 0 },
      fighter1_movement: [],
      fighter2_movement: [],
      damage_taken: { fighter1: 0, fighter2: 0 }
    }

    let fighter1TotalPunches = 0
    let fighter1LandedPunches = 0
    let fighter2TotalPunches = 0
    let fighter2LandedPunches = 0

    rounds.forEach(round => {
      round.fighter1_actions.forEach(action => {
        if (action.type === 'punch') {
          fighter1TotalPunches++
          if (action.landed) {
            fighter1LandedPunches++
            if (action.punch_type === 'jab') stats.fighter1_punches.jabs++
            else if (['cross', 'hook', 'uppercut'].includes(action.punch_type || '')) stats.fighter1_punches.power++
            else if (action.punch_type === 'combination') stats.fighter1_punches.combinations++
          }
        }
      })

      round.fighter2_actions.forEach(action => {
        if (action.type === 'punch') {
          fighter2TotalPunches++
          if (action.landed) {
            fighter2LandedPunches++
            if (action.punch_type === 'jab') stats.fighter2_punches.jabs++
            else if (['cross', 'hook', 'uppercut'].includes(action.punch_type || '')) stats.fighter2_punches.power++
            else if (action.punch_type === 'combination') stats.fighter2_punches.combinations++
          }
        }
      })

      stats.damage_taken.fighter1 += round.fighter1_damage_taken
      stats.damage_taken.fighter2 += round.fighter2_damage_taken
    })

    stats.fighter1_punches.accuracy = fighter1TotalPunches > 0 ? (fighter1LandedPunches / fighter1TotalPunches) * 100 : 0
    stats.fighter2_punches.accuracy = fighter2TotalPunches > 0 ? (fighter2LandedPunches / fighter2TotalPunches) * 100 : 0

    return stats
  }

  const generatePostFightAnalytics = async (rounds: RoundData[], fighter1: Fighter, fighter2: Fighter) => {
    const stats = calculateFightStatistics(rounds)
    
    return {
      punch_statistics: stats,
      movement_heatmap: generateMovementHeatmap(rounds),
      damage_analysis: analyzeDamageDistribution(rounds),
      ai_fight_report: generateAIFightReport(rounds, fighter1, fighter2),
      key_moments: identifyKeyMoments(rounds)
    }
  }

  const generateMovementHeatmap = (rounds: RoundData[]) => {
    const ringSize = 20
    const heatmap = Array(ringSize).fill(0).map(() => Array(ringSize).fill(0))
    
    rounds.forEach(round => {
      round.fighter1_actions.forEach(action => {
        if (action.position) {
          const x = Math.floor(action.position.x)
          const y = Math.floor(action.position.y)
          if (x >= 0 && x < ringSize && y >= 0 && y < ringSize) {
            heatmap[y][x]++
          }
        }
      })
    })
    
    return heatmap
  }

  const analyzeDamageDistribution = (rounds: RoundData[]) => {
    const damageByRound = rounds.map(round => ({
      round: round.round,
      fighter1_damage: round.fighter1_damage_taken,
      fighter2_damage: round.fighter2_damage_taken
    }))
    
    return damageByRound
  }

  const generateAIFightReport = (rounds: RoundData[], fighter1: Fighter, fighter2: Fighter) => {
    const stats = calculateFightStatistics(rounds)
    const totalRounds = rounds.length
    
    let report = `Fight Report: ${fighter1.name} vs ${fighter2.name}\n\n`
    report += `Total Rounds: ${totalRounds}\n`
    report += `Fighter Statistics:\n`
    report += `${fighter1.name}: ${stats.fighter1_punches.accuracy.toFixed(1)}% accuracy\n`
    report += `${fighter2.name}: ${stats.fighter2_punches.accuracy.toFixed(1)}% accuracy\n`
    
    return report
  }

  const identifyKeyMoments = (rounds: RoundData[]) => {
    const keyMoments = []
    
    rounds.forEach(round => {
      if (round.knockdown) {
        keyMoments.push({
          round: round.round,
          description: `Knockdown in round ${round.round}`,
          type: 'knockdown'
        })
      }
      
      const highDamageRounds = round.fighter1_damage_taken > 10 || round.fighter2_damage_taken > 10
      if (highDamageRounds) {
        keyMoments.push({
          round: round.round,
          description: `High damage round ${round.round}`,
          type: 'damage'
        })
      }
    })
    
    return keyMoments
  }

  const startPlayback = () => {
    if (simulationRef.current) clearInterval(simulationRef.current)
    
    simulationRef.current = setInterval(() => {
      setCurrentSecond(prev => {
        if (prev >= 180) {
          setCurrentRound(prevRound => {
            if (prevRound >= (fightData?.rounds.length || 12)) {
              setIsPlaying(false)
              return prevRound
            }
            return prevRound + 1
          })
          return 0
        }
        return prev + 1
      })
    }, 1000 / playbackSpeed)
  }

  const stopPlayback = () => {
    if (simulationRef.current) {
      clearInterval(simulationRef.current)
      simulationRef.current = null
    }
    setIsPlaying(false)
  }

  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback()
    } else {
      setIsPlaying(true)
      startPlayback()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Advanced Fight Engine</h2>
        <div className="flex items-center space-x-4">
          <select
            value={selectedFighter1}
            onChange={(e) => setSelectedFighter1(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-red-500 focus:outline-none"
          >
            <option value="">Select Fighter 1</option>
            {fighters.map(fighter => (
              <option key={fighter.id} value={fighter.id}>
                {fighter.name} ({fighter.weight_class})
              </option>
            ))}
          </select>
          
          <span className="text-white">vs</span>
          
          <select
            value={selectedFighter2}
            onChange={(e) => setSelectedFighter2(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-red-500 focus:outline-none"
          >
            <option value="">Select Fighter 2</option>
            {fighters.map(fighter => (
              <option key={fighter.id} value={fighter.id}>
                {fighter.name} ({fighter.weight_class})
              </option>
            ))}
          </select>
          
          <button
            onClick={startFightSimulation}
            disabled={isSimulating || !selectedFighter1 || !selectedFighter2}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {isSimulating ? 'Simulating...' : 'Start Fight'}
          </button>
        </div>
      </div>

      {fightData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fight Visualization */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Fight Visualization</h3>
            
            <div className="fight-ring bg-gray-700 rounded-lg p-4 mb-4">
              <div className="ring-content text-center">
                <div className="fighter fighter1">
                  <div className="fighter-name text-white">{fightData.fighter1.name}</div>
                  <div className="fighter-stats text-gray-300 text-sm">
                    Stamina: {fightData.rounds[currentRound - 1]?.fighter1_stamina_end || 100}%
                  </div>
                </div>
                
                <div className="vs-text text-white text-2xl font-bold my-4">VS</div>
                
                <div className="fighter fighter2">
                  <div className="fighter-name text-white">{fightData.fighter2.name}</div>
                  <div className="fighter-stats text-gray-300 text-sm">
                    Stamina: {fightData.rounds[currentRound - 1]?.fighter2_stamina_end || 100}%
                  </div>
                </div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="playback-controls flex items-center justify-center space-x-4">
              <button
                onClick={() => setCurrentSecond(Math.max(0, currentSecond - 10))}
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              
              <button
                onClick={togglePlayback}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => setCurrentSecond(Math.min(180, currentSecond + 10))}
                className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded"
              >
                <SkipForward className="w-4 h-4" />
              </button>
              
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
              </select>
            </div>

            <div className="fight-info mt-4 text-center">
              <div className="text-white">Round {currentRound} / {fightData.rounds.length}</div>
              <div className="text-gray-400 text-sm">
                {Math.floor(currentSecond / 60)}:{(currentSecond % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Fight Statistics */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Fight Statistics</h3>
            
            {fightData.statistics && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-white font-semibold">{fightData.fighter1.name}</h4>
                    <div className="text-gray-300 text-sm space-y-1">
                      <div>Accuracy: {fightData.statistics.fighter1_punches.accuracy.toFixed(1)}%</div>
                      <div>Jabs: {fightData.statistics.fighter1_punches.jabs}</div>
                      <div>Power Shots: {fightData.statistics.fighter1_punches.power}</div>
                      <div>Combinations: {fightData.statistics.fighter1_punches.combinations}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold">{fightData.fighter2.name}</h4>
                    <div className="text-gray-300 text-sm space-y-1">
                      <div>Accuracy: {fightData.statistics.fighter2_punches.accuracy.toFixed(1)}%</div>
                      <div>Jabs: {fightData.statistics.fighter2_punches.jabs}</div>
                      <div>Power Shots: {fightData.statistics.fighter2_punches.power}</div>
                      <div>Combinations: {fightData.statistics.fighter2_punches.combinations}</div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white font-semibold mb-2">Damage Taken</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-300 text-sm">{fightData.fighter1.name}</div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (fightData.statistics.damage_taken.fighter1 / 100) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-300 text-sm">{fightData.fighter2.name}</div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (fightData.statistics.damage_taken.fighter2 / 100) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Commentary Panel */}
      {fightData && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Live Commentary</h3>
          <div className="commentary-container max-h-60 overflow-y-auto bg-gray-700 rounded-lg p-4">
            {fightData.rounds[currentRound - 1]?.commentary.map((comment, index) => (
              <div key={index} className="text-gray-300 text-sm mb-2">
                {comment}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fight Result */}
      {fightData?.winner && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Fight Result</h3>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {fightData.winner.name} wins by {fightData.method}!
            </div>
            {fightData.round_stopped && (
              <div className="text-gray-300">
                Fight ended in round {fightData.round_stopped}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 