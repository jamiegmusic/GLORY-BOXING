import React, { useState } from 'react'
import { Trophy, Flag, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface RealWorldFighter {
  rank: number
  name: string
  record: string
  country: string
  status: 'Champion' | 'Contender' | 'Prospect'
  movement?: 'up' | 'down' | 'same'
  lastFight?: string
  nextFight?: string
}

const REAL_WORLD_RANKINGS = {
  heavyweight: [
    { rank: 1, name: "Tyson Fury", record: "34-0-1", country: "GB", status: "Champion" as const, movement: "same" as const },
    { rank: 2, name: "Oleksandr Usyk", record: "21-0-0", country: "UA", status: "Champion" as const, movement: "same" as const },
    { rank: 3, name: "Anthony Joshua", record: "26-3-0", country: "GB", status: "Contender" as const, movement: "up" as const },
    { rank: 4, name: "Deontay Wilder", record: "43-2-1", country: "US", status: "Contender" as const, movement: "down" as const },
    { rank: 5, name: "Daniel Dubois", record: "19-2-0", country: "GB", status: "Contender" as const, movement: "up" as const },
    { rank: 6, name: "Jared Anderson", record: "16-0-0", country: "US", status: "Prospect" as const, movement: "up" as const },
    { rank: 7, name: "Frank Sanchez", record: "23-0-0", country: "CU", status: "Contender" as const, movement: "same" as const },
    { rank: 8, name: "Viktor Faust", record: "12-0-0", country: "UA", status: "Prospect" as const, movement: "up" as const },
    { rank: 9, name: "Lenier Pero", record: "10-0-0", country: "CU", status: "Prospect" as const, movement: "same" as const },
    { rank: 10, name: "Ivan Dychko", record: "11-0-0", country: "KZ", status: "Prospect" as const, movement: "down" as const },
    { rank: 11, name: "Viktor Shevtsov", record: "8-0-0", country: "UA", status: "Prospect" as const, movement: "up" as const },
    { rank: 12, name: "Bakhodir Jalolov", record: "13-0-0", country: "UZ", status: "Prospect" as const, movement: "same" as const },
    { rank: 13, name: "Justis Huni", record: "8-0-0", country: "AU", status: "Prospect" as const, movement: "down" as const },
    { rank: 14, name: "Lenier Pero", record: "10-0-0", country: "CU", status: "Prospect" as const, movement: "same" as const },
    { rank: 15, name: "Viktor Faust", record: "12-0-0", country: "UA", status: "Prospect" as const, movement: "up" as const }
  ],
  
  cruiserweight: [
    { rank: 1, name: "Jai Opetaia", record: "23-0-0", country: "AU", status: "Champion" as const, movement: "same" as const },
    { rank: 2, name: "Mairis Briedis", record: "28-2-0", country: "LV", status: "Contender" as const, movement: "same" as const },
    { rank: 3, name: "Badou Jack", record: "28-3-3", country: "SE", status: "Contender" as const, movement: "up" as const },
    { rank: 4, name: "Ilunga Makabu", record: "29-3-0", country: "CD", status: "Contender" as const, movement: "down" as const },
    { rank: 5, name: "Lawrence Okolie", record: "19-1-0", country: "GB", status: "Contender" as const, movement: "same" as const },
    { rank: 6, name: "Chris Billam-Smith", record: "18-1-0", country: "GB", status: "Contender" as const, movement: "up" as const },
    { rank: 7, name: "Richard Riakporhe", record: "16-0-0", country: "GB", status: "Prospect" as const, movement: "up" as const },
    { rank: 8, name: "Isaac Chamberlain", record: "15-2-0", country: "GB", status: "Contender" as const, movement: "down" as const },
    { rank: 9, name: "Michal Cieslak", record: "24-2-0", country: "PL", status: "Contender" as const, movement: "same" as const },
    { rank: 10, name: "Yuniel Dorticos", record: "26-2-0", country: "CU", status: "Contender" as const, movement: "down" as const },
    { rank: 11, name: "Thabiso Mchunu", record: "23-6-0", country: "ZA", status: "Contender" as const, movement: "same" as const },
    { rank: 12, name: "Kevin Lerena", record: "28-2-0", country: "ZA", status: "Contender" as const, movement: "up" as const },
    { rank: 13, name: "Mateusz Masternak", record: "47-5-0", country: "PL", status: "Contender" as const, movement: "same" as const },
    { rank: 14, name: "Tommy McCarthy", record: "20-4-0", country: "IE", status: "Contender" as const, movement: "down" as const },
    { rank: 15, name: "Viktor Faust", record: "12-0-0", country: "UA", status: "Prospect" as const, movement: "up" as const }
  ],
  
  light_heavyweight: [
    { rank: 1, name: "Dmitry Bivol", record: "21-0-0", country: "RU", status: "Champion" as const, movement: "same" as const },
    { rank: 2, name: "Artur Beterbiev", record: "19-0-0", country: "RU", status: "Champion" as const, movement: "same" as const },
    { rank: 3, name: "Joshua Buatsi", record: "17-0-0", country: "GB", status: "Contender" as const, movement: "up" as const },
    { rank: 4, name: "Callum Smith", record: "29-1-0", country: "GB", status: "Contender" as const, movement: "down" as const },
    { rank: 5, name: "Dan Azeez", record: "19-0-0", country: "GB", status: "Contender" as const, movement: "up" as const },
    { rank: 6, name: "Anthony Yarde", record: "24-3-0", country: "GB", status: "Contender" as const, movement: "same" as const },
    { rank: 7, name: "Lyndon Arthur", record: "22-1-0", country: "GB", status: "Contender" as const, movement: "down" as const },
    { rank: 8, name: "Craig Richards", record: "17-3-1", country: "GB", status: "Contender" as const, movement: "same" as const },
    { rank: 9, name: "Willy Hutchinson", record: "16-1-0", country: "GB", status: "Prospect" as const, movement: "up" as const },
    { rank: 10, name: "Shakan Pitters", record: "17-1-0", country: "GB", status: "Contender" as const, movement: "down" as const },
    { rank: 11, name: "Mark Heffron", record: "29-3-1", country: "GB", status: "Contender" as const, movement: "same" as const },
    { rank: 12, name: "Zach Parker", record: "22-0-0", country: "GB", status: "Contender" as const, movement: "up" as const },
    { rank: 13, name: "Lerrone Richards", record: "17-0-0", country: "GB", status: "Contender" as const, movement: "same" as const },
    { rank: 14, name: "Sergiy Derevyanchenko", record: "14-3-0", country: "UA", status: "Contender" as const, movement: "down" as const },
    { rank: 15, name: "Steven Ward", record: "13-1-0", country: "IE", status: "Contender" as const, movement: "same" as const }
  ],
  
  super_middleweight: [
    { rank: 1, name: "Canelo Alvarez", record: "59-2-2", country: "MX", status: "Champion" as const, movement: "same" as const },
    { rank: 2, name: "David Benavidez", record: "27-0-0", country: "US", status: "Contender" as const, movement: "up" as const },
    { rank: 3, name: "Caleb Plant", record: "22-2-0", country: "US", status: "Contender" as const, movement: "down" as const },
    { rank: 4, name: "John Ryder", record: "32-6-0", country: "GB", status: "Contender" as const, movement: "same" as const },
    { rank: 5, name: "Christian Mbilli", record: "25-0-0", country: "FR", status: "Contender" as const, movement: "up" as const },
    { rank: 6, name: "Sergiy Derevyanchenko", record: "14-3-0", country: "UA", status: "Contender" as const, movement: "down" as const },
    { rank: 7, name: "Carlos Gongora", record: "21-1-0", country: "EC", status: "Contender" as const, movement: "same" as const },
    { rank: 8, name: "Vladimir Shishkin", record: "14-0-0", country: "RU", status: "Contender" as const, movement: "up" as const },
    { rank: 9, name: "Steven Nelson", record: "18-0-0", country: "US", status: "Contender" as const, movement: "same" as const },
    { rank: 10, name: "Aidos Yerbossynuly", record: "16-0-0", country: "KZ", status: "Contender" as const, movement: "down" as const },
    { rank: 11, name: "Lerrone Richards", record: "17-0-0", country: "GB", status: "Contender" as const, movement: "same" as const },
    { rank: 12, name: "Zach Parker", record: "22-0-0", country: "GB", status: "Contender" as const, movement: "up" as const },
    { rank: 13, name: "Sergiy Derevyanchenko", record: "14-3-0", country: "UA", status: "Contender" as const, movement: "down" as const },
    { rank: 14, name: "Steven Ward", record: "13-1-0", country: "IE", status: "Contender" as const, movement: "same" as const },
    { rank: 15, name: "Viktor Faust", record: "12-0-0", country: "UA", status: "Prospect" as const, movement: "up" as const }
  ]
}

const weightClasses = [
  { id: 'heavyweight', name: 'Heavyweight', icon: '🥊' },
  { id: 'cruiserweight', name: 'Cruiserweight', icon: '🥊' },
  { id: 'light_heavyweight', name: 'Light Heavyweight', icon: '🥊' },
  { id: 'super_middleweight', name: 'Super Middleweight', icon: '🥊' },
  { id: 'middleweight', name: 'Middleweight', icon: '🥊' },
  { id: 'super_welterweight', name: 'Super Welterweight', icon: '🥊' },
  { id: 'welterweight', name: 'Welterweight', icon: '🥊' },
  { id: 'super_lightweight', name: 'Super Lightweight', icon: '🥊' },
  { id: 'lightweight', name: 'Lightweight', icon: '🥊' },
  { id: 'super_featherweight', name: 'Super Featherweight', icon: '🥊' },
  { id: 'featherweight', name: 'Featherweight', icon: '🥊' },
  { id: 'super_bantamweight', name: 'Super Bantamweight', icon: '🥊' },
  { id: 'bantamweight', name: 'Bantamweight', icon: '🥊' },
  { id: 'super_flyweight', name: 'Super Flyweight', icon: '🥊' },
  { id: 'flyweight', name: 'Flyweight', icon: '🥊' }
]

export default function RealWorldRankings() {
  const [selectedWeightClass, setSelectedWeightClass] = useState('heavyweight')
  const [selectedFighter, setSelectedFighter] = useState<RealWorldFighter | null>(null)
  const [showFighterDetail, setShowFighterDetail] = useState(false)

  const rankings = REAL_WORLD_RANKINGS[selectedWeightClass as keyof typeof REAL_WORLD_RANKINGS] || []

  const getMovementIcon = (movement?: string) => {
    switch (movement) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Champion':
        return 'bg-yellow-500 text-black'
      case 'Contender':
        return 'bg-blue-500 text-white'
      case 'Prospect':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'GB': '🇬🇧',
      'US': '🇺🇸',
      'UA': '🇺🇦',
      'AU': '🇦🇺',
      'CU': '🇨🇺',
      'LV': '🇱🇻',
      'SE': '🇸🇪',
      'CD': '🇨🇩',
      'PL': '🇵🇱',
      'ZA': '🇿🇦',
      'IE': '🇮🇪',
      'RU': '🇷🇺',
      'MX': '🇲🇽',
      'FR': '🇫🇷',
      'EC': '🇪🇨',
      'KZ': '🇰🇿',
      'UZ': '🇺🇿'
    }
    return flags[country] || '🏳️'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Real-World Boxing Rankings</h2>
        <div className="text-gray-400 text-sm">
          Current rankings as of July 2025
        </div>
      </div>

      {/* Weight Class Selector */}
      <div className="weight-class-selector">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {weightClasses.map(wc => (
            <button
              key={wc.id}
              className={`weight-class-btn p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedWeightClass === wc.id 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
              onClick={() => setSelectedWeightClass(wc.id)}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{wc.icon}</span>
                <span className="font-medium text-sm">{wc.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="rankings-table-container bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fighter</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Record</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Country</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Movement</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rankings.map(fighter => (
                <tr 
                  key={fighter.rank}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    fighter.status === 'Champion' ? 'bg-yellow-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedFighter(fighter)
                    setShowFighterDetail(true)
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className={`rank-badge w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        fighter.status === 'Champion' 
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {fighter.rank}
                      </div>
                      {fighter.status === 'Champion' && (
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-lg">🥊</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{fighter.name}</div>
                        <div className="text-sm text-gray-500">{fighter.record}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {fighter.record}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCountryFlag(fighter.country)}</span>
                      <span className="text-sm text-gray-600">{fighter.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fighter.status)}`}>
                      {fighter.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      {getMovementIcon(fighter.movement)}
                      <span className="text-sm text-gray-500 capitalize">
                        {fighter.movement || 'same'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        Manage
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fighter Detail Panel */}
      {showFighterDetail && selectedFighter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{selectedFighter.name}</h3>
              <button
                onClick={() => setShowFighterDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🥊</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{selectedFighter.name}</div>
                  <div className="text-sm text-gray-500">#{selectedFighter.rank} in {selectedWeightClass.replace('_', ' ')}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Record</label>
                  <div className="text-gray-900 font-semibold">{selectedFighter.record}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Country</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getCountryFlag(selectedFighter.country)}</span>
                    <span className="text-gray-900">{selectedFighter.country}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedFighter.status)}`}>
                    {selectedFighter.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Movement</label>
                  <div className="flex items-center space-x-1">
                    {getMovementIcon(selectedFighter.movement)}
                    <span className="text-gray-900 capitalize">{selectedFighter.movement || 'same'}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">AI Generation</h4>
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Generate AI Portrait
                  </button>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Generate AI Voice
                  </button>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Generate AI Lore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 