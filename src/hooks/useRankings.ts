import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Ranking } from '../lib/unified-types'

export const useRankings = () => {
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRankings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('rank', { ascending: true })

      if (error) throw error
      setRankings(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rankings')
    } finally {
      setLoading(false)
    }
  }

  const addFighter = async (fighter: Omit<Ranking, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('rankings')
        .insert(fighter)
        .select()

      if (error) throw error
      await fetchRankings()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add fighter')
      throw err
    }
  }

  const updateRanking = async (id: string, updates: Partial<Ranking>) => {
    try {
      const { data, error } = await supabase
        .from('rankings')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      await fetchRankings()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ranking')
      throw err
    }
  }

  const updateRankingsAfterFight = async (winnerId: string, loserId: string, fightResult: any) => {
    try {
      // Update winner ranking
      const winnerRanking = rankings.find(r => r.fighter_name === winnerId)
      if (winnerRanking) {
        await updateRanking(winnerRanking.id, {
          points: (winnerRanking.points || 0) + 10,
          record_wins: (winnerRanking.record_wins || 0) + 1,
          win_streak: (winnerRanking.win_streak || 0) + 1,
          last_fight: new Date().toISOString(),
          movement: 'up'
        })
      }

      // Update loser ranking
      const loserRanking = rankings.find(r => r.fighter_name === loserId)
      if (loserRanking) {
        await updateRanking(loserRanking.id, {
          record_losses: (loserRanking.record_losses || 0) + 1,
          win_streak: 0,
          last_fight: new Date().toISOString(),
          movement: 'down'
        })
      }

      await fetchRankings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rankings after fight')
      throw err
    }
  }

  useEffect(() => {
    fetchRankings()
  }, [])

  return {
    rankings,
    loading,
    error,
    fetchRankings,
    addFighter,
    updateRanking,
    updateRankingsAfterFight
  }
} 