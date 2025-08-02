import React, { useState, useEffect } from 'react'
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { supabase, Fighter } from '@/lib/supabase'

interface Ranking {
  id: string
  fighter_id: string
  weight_class: string
  rank: number
  points: number
  wins: number
  losses: number
  draws: number
  last_fight_date?: string
  movement: 'up' | 'down' | 'same'
}

export default function RankingsSystem() {
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [fighters, setFighters] = useState<Fighter[]>([])
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRankings()
    loadFighters()
  }, [])

  const loadRankings = async () => {
    try {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('rank', { ascending: true })

      if (error) throw error
      setRankings(data || [])
    } catch (error) {
      console.error('Error loading rankings:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFighters = async () => {
    try {
      const { data, error } = await supabase
        .from('fighters')
        .select('*')

      if (error) throw error
      setFighters(data || [])
    } catch (error) {
      console.error('Error loading fighters:', error)
    }
  }

  const getFighterName = (fighterId: string) => {
    const fighter = fighters.find(f => f.id === fighterId)
    return fighter?.name || 'Unknown Fighter'
  }

  const getMovementIcon = (movement: string) => {
    switch (movement) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const filteredRankings = selectedWeightClass === 'all' 
    ? rankings 
    : rankings.filter(r => r.weight_class === selectedWeightClass)

  const weightClasses = ['all', ...Array.from(new Set(rankings.map(r => r.weight_class)))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Rankings</h2>
        <select
          value={selectedWeightClass}
          onChange={(e) => setSelectedWeightClass(e.target.value)}
          className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-red-500 focus:outline-none"
        >
          {weightClasses.map(wc => (
            <option key={wc} value={wc}>
              {wc === 'all' ? 'All Weight Classes' : wc}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-white">Loading rankings...</div>
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-4 bg-gray-700 text-white font-semibold">
            <div>Rank</div>
            <div>Fighter</div>
            <div>Record</div>
            <div>Points</div>
            <div>Movement</div>
            <div>Weight Class</div>
          </div>
          
          {filteredRankings.map((ranking) => (
            <div key={ranking.id} className="grid grid-cols-6 gap-4 p-4 border-t border-gray-700 hover:bg-gray-700 transition-colors">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white">{ranking.rank}</span>
                {ranking.rank <= 3 && <Trophy className="w-4 h-4 text-yellow-400" />}
              </div>
              <div className="text-white font-medium">
                {getFighterName(ranking.fighter_id)}
              </div>
              <div className="text-gray-300">
                {ranking.wins}-{ranking.losses}-{ranking.draws}
              </div>
              <div className="text-white font-semibold">
                {ranking.points}
              </div>
              <div className="flex items-center">
                {getMovementIcon(ranking.movement)}
              </div>
              <div className="text-gray-300">
                {ranking.weight_class}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 