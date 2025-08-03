import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Building, Users, Star, Calendar, DollarSign } from 'lucide-react'
import { DreamworldVenue } from '../../types/dreamworld'

interface DreamVenueManagerProps {
  venues: DreamworldVenue[];
  currentEra: string;
  onVenueAction: (venue: DreamworldVenue, action: 'book' | 'visit' | 'invest') => void;
}

const DreamVenueManager: React.FC<DreamVenueManagerProps> = ({ 
  venues, 
  currentEra, 
  onVenueAction 
}) => {
  const filteredVenues = venues.filter(venue => venue.era === currentEra)

  const getVenueTypeIcon = (type: string) => {
    switch (type) {
      case 'club': return '🎷'
      case 'theater': return '🎭'
      case 'arena': return '🥊'
      case 'studio': return '🎬'
      case 'office': return '🏢'
      default: return '🏛️'
    }
  }

  const getPrestigeStars = (level: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < level ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} 
      />
    ))
  }

  if (filteredVenues.length === 0) {
    return (
      <Card className="vintage-card">
        <CardContent className="p-6 text-center">
          <p className="text-sepia-600">No venues available in the {currentEra}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-serif text-sepia-900">
          {currentEra} Entertainment Venues
        </h3>
        <Badge variant="outline" className="vintage-badge">
          {filteredVenues.length} Available
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVenues.map((venue) => (
          <Card key={venue.id} className="vintage-venue-card hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-serif text-sepia-900 flex items-center gap-2">
                    <span className="text-2xl">{getVenueTypeIcon(venue.venue_type)}</span>
                    {venue.name}
                  </CardTitle>
                  <p className="text-sm text-sepia-600 mt-1">
                    📍 {venue.location}
                  </p>
                </div>
                <Badge className="vintage-badge text-xs">
                  {venue.venue_type}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              {/* Venue Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sepia-600" />
                    <span className="text-sm text-sepia-700">Capacity</span>
                  </div>
                  <span className="text-sm font-semibold text-sepia-900">
                    {venue.capacity.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-sepia-700">Prestige</span>
                  <div className="flex">{getPrestigeStars(venue.prestige_level)}</div>
                </div>
              </div>

              {/* Special Features */}
              {venue.special_features.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-sepia-700 mb-2">Special Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {venue.special_features.map((feature, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="text-xs bg-sepia-100 text-sepia-700"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="vintage-button text-xs"
                  onClick={() => onVenueAction(venue, 'book')}
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  Book
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="vintage-button text-xs"
                  onClick={() => onVenueAction(venue, 'visit')}
                >
                  <Building className="w-3 h-3 mr-1" />
                  Visit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="vintage-button text-xs"
                  onClick={() => onVenueAction(venue, 'invest')}
                >
                  <DollarSign className="w-3 h-3 mr-1" />
                  Invest
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Era-specific venue tips */}
      <Card className="vintage-card bg-sepia-50">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-sepia-800 mb-2">
            💡 {currentEra} Venue Tips
          </h4>
          <p className="text-sm text-sepia-700">
            {currentEra === '1920s' && 'Jazz clubs are the hottest spots! The Cotton Club and Savoy Ballroom attract the biggest names in entertainment.'}
            {currentEra === '1930s' && 'The Apollo Theater\'s Amateur Night can launch careers. High society gathers at the Rainbow Room.'}
            {currentEra === '1940s' && 'USO shows boost morale. The Copacabana is where Latin music meets mainstream America.'}
            {currentEra === '1950s' && 'Television is king! Ed Sullivan Theater bookings can make you a household name overnight.'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default DreamVenueManager