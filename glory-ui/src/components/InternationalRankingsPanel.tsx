import React, { useState, useEffect } from 'react'
import { Fighter, InternationalRanking } from '../lib/unified-types'
import { realWorldRankingsAPI, RealWorldRanking } from '../lib/real-world-rankings-api'
import { 
  Globe, 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Medal, 
  Flag,
  Calendar,
  Target,
  RefreshCw,
  Filter,
  Search,
  Star,
  Award,
  Users,
  Activity,
  CheckCircle,
  Plus,
  XCircle
} from 'lucide-react'

interface InternationalRankingsPanelProps {
  fighters: Fighter[]
  onSyncRankings?: (updatedFighters: Fighter[]) => void
}

const InternationalRankingsPanel: React.FC<InternationalRankingsPanelProps> = ({
  fighters,
  onSyncRankings
}) => {
  const [realWorldRankings, setRealWorldRankings] = useState<RealWorldRanking[]>([])
  const [filteredRankings, setFilteredRankings] = useState<RealWorldRanking[]>([])
  const [selectedOrganization, setSelectedOrganization] = useState<string>('all')
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle')

  useEffect(() => {
    loadRealWorldRankings()
  }, [])

  useEffect(() => {
    filterRankings()
  }, [realWorldRankings, selectedOrganization, selectedWeightClass, searchTerm])

  const loadRealWorldRankings = async () => {
    setLoading(true)
    try {
      const rankings = await realWorldRankingsAPI.fetchRealWorldRankings()
      setRealWorldRankings(rankings)
      setLastSync(new Date())
    } catch (error) {
      console.error('Failed to load real-world rankings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterRankings = () => {
    let filtered = realWorldRankings

    if (selectedOrganization !== 'all') {
      filtered = filtered.filter(r => r.organization === selectedOrganization)
    }

    if (selectedWeightClass !== 'all') {
      filtered = filtered.filter(r => r.weight_class === selectedWeightClass)
    }

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.fighter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredRankings(filtered)
  }

  const handleSyncRankings = async () => {
    setSyncStatus('syncing')
    try {
      const syncResult = await realWorldRankingsAPI.syncWithGameRankings(fighters)
      
      if (syncResult.updated.length > 0 || syncResult.newFighters.length > 0) {
        const updatedFighters = [...fighters]
        
        // Update existing fighters
        syncResult.updated.forEach(updatedFighter => {
          const index = updatedFighters.findIndex(f => f.id === updatedFighter.id)
          if (index !== -1) {
            updatedFighters[index] = updatedFighter
          }
        })

        // Add new fighters
        updatedFighters.push(...syncResult.newFighters)
        
        onSyncRankings?.(updatedFighters)
        setSyncStatus('success')
      } else {
        setSyncStatus('success')
      }
    } catch (error) {
      console.error('Failed to sync rankings:', error)
      setSyncStatus('error')
    }
  }

  const getMovementIcon = (movement: string) => {
    switch (movement) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getOrganizationColor = (organization: string) => {
    switch (organization) {
      case 'WBC':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'WBA':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'IBF':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'WBO':
        return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'The Ring':
        return 'text-purple-600 bg-purple-100 border-purple-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="w-5 h-5 text-yellow-500 fill-current" />
    if (rank <= 3) return <Trophy className="w-4 h-4 text-blue-500" />
    return null
  }

  const organizations = Array.from(new Set(realWorldRankings.map(r => r.organization)))
  const weightClasses = Array.from(new Set(realWorldRankings.map(r => r.weight_class)))

  const findGameFighter = (realWorldFighter: RealWorldRanking) => {
    return fighters.find(f => 
      f.name.toLowerCase() === realWorldFighter.fighter_name.toLowerCase() &&
      f.weight_class.toLowerCase() === realWorldFighter.weight_class.toLowerCase()
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Globe className="w-6 h-6 mr-2 text-blue-600" />
          International Rankings
        </h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadRealWorldRankings}
            disabled={loading}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleSyncRankings}
            disabled={syncStatus === 'syncing'}
            className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            Sync with Game
          </button>
        </div>
      </div>

      {/* Sync Status */}
      {syncStatus !== 'idle' && (
        <div className={`mb-4 p-3 rounded-lg ${
          syncStatus === 'success' ? 'bg-green-50 border border-green-200' :
          syncStatus === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center">
            {syncStatus === 'syncing' && <RefreshCw className="w-4 h-4 mr-2 animate-spin text-blue-600" />}
            {syncStatus === 'success' && <CheckCircle className="w-4 h-4 mr-2 text-green-600" />}
            {syncStatus === 'error' && <XCircle className="w-4 h-4 mr-2 text-red-600" />}
            <span className={`text-sm font-medium ${
              syncStatus === 'success' ? 'text-green-800' :
              syncStatus === 'error' ? 'text-red-800' :
              'text-blue-800'
            }`}>
              {syncStatus === 'syncing' && 'Syncing rankings...'}
              {syncStatus === 'success' && 'Rankings synced successfully!'}
              {syncStatus === 'error' && 'Failed to sync rankings'}
            </span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
          <select
            value={selectedOrganization}
            onChange={(e) => setSelectedOrganization(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Organizations</option>
            {organizations.map(org => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight Class</label>
          <select
            value={selectedWeightClass}
            onChange={(e) => setSelectedWeightClass(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Weight Classes</option>
            {weightClasses.map(wc => (
              <option key={wc} value={wc}>{wc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search fighters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-end">
          <div className="text-sm text-gray-600">
            <p>Last updated: {lastSync ? lastSync.toLocaleTimeString() : 'Never'}</p>
            <p>{filteredRankings.length} fighters found</p>
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fighter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weight Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Record
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Movement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Game Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                    Loading rankings...
                  </div>
                </td>
              </tr>
            ) : filteredRankings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No rankings found
                </td>
              </tr>
            ) : (
              filteredRankings.map((ranking, index) => {
                const gameFighter = findGameFighter(ranking)
                
                return (
                  <tr key={`${ranking.fighter_name}-${ranking.organization}-${ranking.weight_class}`} 
                      className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRankIcon(ranking.rank)}
                        <span className="text-sm font-medium text-gray-900 ml-1">
                          {ranking.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {ranking.fighter_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Age: {ranking.age} | {ranking.height || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrganizationColor(ranking.organization)}`}>
                        {ranking.organization}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ranking.weight_class}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{ranking.record}</div>
                      <div className="text-sm text-gray-500">
                        KO: {ranking.ko_percentage}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Flag className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{ranking.country}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getMovementIcon(ranking.movement)}
                        <span className="text-sm text-gray-900 ml-1 capitalize">
                          {ranking.movement}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {gameFighter ? (
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              In Game
                            </div>
                            <div className="text-xs text-gray-500">
                              Rank: {gameFighter.real_world_ranking || 'Unranked'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Plus className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm text-blue-600">Add to Game</span>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Globe className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Rankings</p>
              <p className="text-2xl font-bold text-blue-900">{realWorldRankings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">In Game</p>
              <p className="text-2xl font-bold text-green-900">
                {realWorldRankings.filter(r => findGameFighter(r)).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Organizations</p>
              <p className="text-2xl font-bold text-yellow-900">{organizations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <Activity className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Weight Classes</p>
              <p className="text-2xl font-bold text-purple-900">{weightClasses.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InternationalRankingsPanel 