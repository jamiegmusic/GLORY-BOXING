import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Title } from '../lib/unified-types'

export const useTitles = () => {
  const [titles, setTitles] = useState<Title[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTitles = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('titles')
        .select('*')

      if (error) throw error
      setTitles(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch titles')
    } finally {
      setLoading(false)
    }
  }

  const assignTitle = async (belt: string, champion: string, weightClass: string) => {
    try {
      const { data, error } = await supabase
        .from('titles')
        .upsert({
          belt,
          weight_class: weightClass,
          champion,
          status: 'active',
          date_won: new Date().toISOString(),
          defenses: 0
        }, { onConflict: 'belt' })
        .select()

      if (error) throw error
      await fetchTitles()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign title')
      throw err
    }
  }

  const stripTitle = async (belt: string) => {
    try {
      const { data, error } = await supabase
        .from('titles')
        .update({
          champion: null,
          status: 'vacant',
          date_won: null,
          defenses: 0
        })
        .eq('belt', belt)
        .select()

      if (error) throw error
      await fetchTitles()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to strip title')
      throw err
    }
  }

  const updateTitleDefense = async (belt: string) => {
    try {
      const title = titles.find(t => t.belt === belt)
      if (!title) throw new Error('Title not found')

      const { data, error } = await supabase
        .from('titles')
        .update({
          defenses: (title.defenses || 0) + 1
        })
        .eq('belt', belt)
        .select()

      if (error) throw error
      await fetchTitles()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update title defense')
      throw err
    }
  }

  const getTitleByWeightClass = (weightClass: string) => {
    return titles.find(t => t.weight_class === weightClass)
  }

  const getActiveTitles = () => {
    return titles.filter(t => t.status === 'active' && t.champion)
  }

  const getVacantTitles = () => {
    return titles.filter(t => t.status === 'vacant' || !t.champion)
  }

  useEffect(() => {
    fetchTitles()
  }, [])

  return {
    titles,
    loading,
    error,
    fetchTitles,
    assignTitle,
    stripTitle,
    updateTitleDefense,
    getTitleByWeightClass,
    getActiveTitles,
    getVacantTitles
  }
} 