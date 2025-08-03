import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Gift, Star, Lock, Unlock, Sparkles, Trophy } from 'lucide-react'
import { LegacyUnlock } from '../../types/dreamworld'

interface LegacyUnlocksPanelProps {
  unlocks: LegacyUnlock[];
  onClaim: (unlock: LegacyUnlock) => void;
}

const LegacyUnlocksPanel: React.FC<LegacyUnlocksPanelProps> = ({ unlocks, onClaim }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500'
      case 'rare': return 'bg-blue-500'
      case 'epic': return 'bg-purple-500'
      case 'legendary': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="w-4 h-4" />
      case 'rare': return <Sparkles className="w-4 h-4" />
      case 'epic': return <Trophy className="w-4 h-4" />
      case 'legendary': return <Gift className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const getUnlockTypeIcon = (type: string) => {
    switch (type) {
      case 'skill': return '🎯'
      case 'item': return '📦'
      case 'connection': return '🤝'
      case 'knowledge': return '📚'
      case 'bonus': return '🎁'
      default: return '✨'
    }
  }

  const unclaimedUnlocks = unlocks.filter(u => !u.claimed)
  const claimedUnlocks = unlocks.filter(u => u.claimed)

  return (
    <div className="space-y-6">
      {/* Unclaimed Unlocks */}
      {unclaimedUnlocks.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-serif text-sepia-900">Available Legacy Items</h3>
            <Badge className="vintage-badge">
              {unclaimedUnlocks.length} Unclaimed
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unclaimedUnlocks.map((unlock) => (
              <Card key={unlock.id} className="vintage-unlock-card hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getUnlockTypeIcon(unlock.unlock_type)}</span>
                      <CardTitle className="text-lg font-serif text-sepia-900">
                        {unlock.dream_item}
                      </CardTitle>
                    </div>
                    <Badge className={`${getRarityColor(unlock.rarity)} text-white border-0`}>
                      <span className="flex items-center gap-1">
                        {getRarityIcon(unlock.rarity)}
                        {unlock.rarity}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  {unlock.description && (
                    <p className="text-sm text-sepia-700 mb-3">
                      {unlock.description}
                    </p>
                  )}

                  {/* Effect Preview */}
                  {unlock.effect_data && Object.keys(unlock.effect_data).length > 0 && (
                    <div className="mb-3 p-2 bg-sepia-50 rounded border border-sepia-200">
                      <p className="text-xs font-semibold text-sepia-700 mb-1">Effects in Reality:</p>
                      <ul className="text-xs text-sepia-600 space-y-1">
                        {Object.entries(unlock.effect_data).map(([key, value]) => (
                          <li key={key}>
                            • {key}: <span className="font-semibold">+{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    className="w-full vintage-button"
                    onClick={() => onClaim(unlock)}
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    Claim Legacy Item
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Claimed Unlocks */}
      {claimedUnlocks.length > 0 && (
        <div>
          <h3 className="text-xl font-serif text-sepia-900 mb-4">Claimed Legacy Items</h3>
          
          <div className="space-y-2">
            {claimedUnlocks.map((unlock) => (
              <div
                key={unlock.id}
                className="flex items-center justify-between p-3 bg-sepia-50 rounded border border-sepia-200"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-sepia-400" />
                  <span className="text-sepia-700">{unlock.dream_item}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getRarityColor(unlock.rarity)} text-white`}
                  >
                    {unlock.rarity}
                  </Badge>
                </div>
                <span className="text-xs text-sepia-500">
                  Claimed {new Date(unlock.claimed_date!).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {unlocks.length === 0 && (
        <Card className="vintage-card">
          <CardContent className="p-8 text-center">
            <Gift className="w-12 h-12 text-sepia-400 mx-auto mb-4" />
            <p className="text-sepia-600">
              Complete dream events and achievements to unlock legacy items
            </p>
            <p className="text-sm text-sepia-500 mt-2">
              These items will enhance your abilities in the waking world
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Box */}
      <Card className="vintage-card bg-amber-50 border-amber-300">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            About Legacy Items
          </h4>
          <p className="text-sm text-amber-700">
            Legacy items are special rewards earned in the dreamworld that persist when you wake up. 
            They provide permanent bonuses to your management abilities, unlock new features, 
            or grant unique advantages in the real world.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default LegacyUnlocksPanel