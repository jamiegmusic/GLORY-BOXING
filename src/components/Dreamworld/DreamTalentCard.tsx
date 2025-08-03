import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { User, Star, Briefcase, Music, Film, Trophy } from 'lucide-react'
import { DreamworldTalent } from '../../types/dreamworld'

interface DreamTalentCardProps {
  talent: DreamworldTalent;
  onSelect: () => void;
  onAction: (action: 'sign' | 'negotiate' | 'train' | 'promote') => void;
}

const DreamTalentCard: React.FC<DreamTalentCardProps> = ({ talent, onSelect, onAction }) => {
  const getCareerIcon = () => {
    switch (talent.career_path) {
      case 'actor': return <Film className="w-5 h-5" />
      case 'singer': return <Music className="w-5 h-5" />
      case 'boxer': return <Trophy className="w-5 h-5" />
      case 'mogul': return <Briefcase className="w-5 h-5" />
      default: return <User className="w-5 h-5" />
    }
  }

  const getTopSkills = () => {
    const skills = Object.entries(talent.era_specific_skills)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
    
    return skills
  }

  const getNotorietyColor = (notoriety: number) => {
    if (notoriety >= 80) return 'text-yellow-600'
    if (notoriety >= 60) return 'text-orange-600'
    if (notoriety >= 40) return 'text-blue-600'
    return 'text-gray-600'
  }

  return (
    <Card 
      className="vintage-talent-card cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-sepia-300"
      onClick={onSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getCareerIcon()}
            <CardTitle className="text-lg font-serif text-sepia-900">
              {talent.name}
            </CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className="vintage-badge text-xs"
          >
            {talent.dream_era}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Star className={`w-4 h-4 ${getNotorietyColor(talent.notoriety)}`} />
            <span className="text-sm font-semibold">{talent.notoriety}</span>
          </div>
          <span className="text-xs text-sepia-600">Notoriety</span>
        </div>
      </CardHeader>

      <CardContent>
        {/* Dream Anomaly */}
        {talent.dream_anomaly && (
          <div className="mb-3 p-2 bg-amber-50 rounded border border-amber-200">
            <p className="text-xs text-amber-800 italic">
              ✨ {talent.dream_anomaly}
            </p>
          </div>
        )}

        {/* Top Skills */}
        <div className="space-y-2 mb-4">
          {getTopSkills().map(([skill, value]) => (
            <div key={skill} className="flex justify-between items-center">
              <span className="text-xs text-sepia-700 capitalize">
                {skill.replace(/_/g, ' ')}
              </span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-sepia-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sepia-400 to-sepia-600 transition-all duration-500"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-sepia-800 w-8 text-right">
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Location & Status */}
        <div className="flex justify-between items-center mb-3 text-xs text-sepia-600">
          <span>📍 {talent.current_location}</span>
          <Badge 
            variant={talent.status === 'active' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {talent.status}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="vintage-button text-xs"
            onClick={(e) => {
              e.stopPropagation()
              onAction('sign')
            }}
          >
            Sign
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="vintage-button text-xs"
            onClick={(e) => {
              e.stopPropagation()
              onAction('negotiate')
            }}
          >
            Negotiate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default DreamTalentCard