import React, { useState, useEffect } from 'react'
import { Trophy, Crown, Calendar } from 'lucide-react'
import { supabase, Fighter } from '@/lib/supabase'

interface Title {
  id: string
  belt_name: string
  weight_class: string
  current_champion_id?: string
  previous_champion_id?: string
  date_won?: string
  defenses: number
  organization: string
}

export default function TitlesManager() {
  const [titles, setTitles] = useState<Title[]>([])
  const [fighters, setFighters] = useState<Fighter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTitles()
    loadFighters()
  }, [])

  const loadTitles = async () => {
    try {
      const { data, error } = await supabase
        .from('titles')
        .select('*')
        .order('weight_class', { ascending: true })

      if (error) throw error
      setTitles(data || [])
    } catch (error) {
      console.error('Error loading titles:', error)
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
    return fighter?.name || 'Vacant'
  }

  const organizations = ['WBC', 'WBA', 'IBF', 'WBO', 'RING']

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Championship Titles</h2>

      {loading ? (
        <div className="text-white">Loading titles...</div>
      ) : (
        <div className="grid gap-6">
          {organizations.map(org => (
            <div key={org} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span>{org} Championships</span>
              </h3>
              
              <div className="grid gap-4">
                {titles
                  .filter(title => title.organization === org)
                  .map(title => (
                    <div key={title.id} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-white">
                            {title.belt_name} ({title.weight_class})
                          </h4>
                          <p className="text-gray-300">
                            Champion: {getFighterName(title.current_champion_id!)}
                          </p>
                          {title.date_won && (
                            <p className="text-gray-400 text-sm">
                              Won: {new Date(title.date_won).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-400">
                            {title.defenses}
                          </div>
                          <div className="text-gray-400 text-sm">Defenses</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 