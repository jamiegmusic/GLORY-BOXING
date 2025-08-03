import React from 'react'
import { Slider } from '../ui/slider'
import { Badge } from '../ui/badge'
import { Clock, Radio } from 'lucide-react'

interface DreamTimelineSliderProps {
  currentEra: string;
  position: number;
  onPositionChange: (position: number) => void;
}

const DreamTimelineSlider: React.FC<DreamTimelineSliderProps> = ({ 
  currentEra, 
  position, 
  onPositionChange 
}) => {
  const eras = [
    { 
      name: '1920s', 
      label: 'The Jazz Age',
      description: 'Prohibition, flappers, and the birth of jazz',
      color: 'bg-amber-600'
    },
    { 
      name: '1930s', 
      label: 'The Golden Age',
      description: 'Hollywood glamour and the Great Depression',
      color: 'bg-red-600'
    },
    { 
      name: '1940s', 
      label: 'The War Years',
      description: 'Big bands, noir, and wartime entertainment',
      color: 'bg-blue-600'
    },
    { 
      name: '1950s', 
      label: 'The Television Era',
      description: 'Rock \'n\' roll and the rise of TV',
      color: 'bg-purple-600'
    }
  ]

  const currentEraData = eras.find(era => era.name === currentEra) || eras[0]
  const eraIndex = eras.findIndex(era => era.name === currentEra)

  return (
    <div className="vintage-timeline-container p-6 bg-gradient-to-r from-sepia-100 to-sepia-200 rounded-lg border-2 border-sepia-400">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-sepia-700" />
          <h3 className="text-xl font-serif font-bold text-sepia-900">
            Temporal Navigation
          </h3>
        </div>
        
        <Badge className={`${currentEraData.color} text-white border-0 px-3 py-1`}>
          {currentEra}
        </Badge>
      </div>

      {/* Era Description */}
      <div className="mb-6 text-center">
        <h4 className="text-2xl font-serif text-sepia-800 mb-1">
          {currentEraData.label}
        </h4>
        <p className="text-sm text-sepia-600 italic">
          {currentEraData.description}
        </p>
      </div>

      {/* Timeline Slider */}
      <div className="relative mb-8">
        {/* Era Markers */}
        <div className="absolute inset-x-0 top-2 flex justify-between px-2">
          {eras.map((era, index) => (
            <div 
              key={era.name}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => onPositionChange((index / (eras.length - 1)) * 100)}
            >
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  era.name === currentEra 
                    ? `${era.color} ring-4 ring-offset-2 ring-sepia-300` 
                    : 'bg-sepia-400'
                }`}
              />
              <span className={`text-xs mt-1 font-semibold transition-colors ${
                era.name === currentEra ? 'text-sepia-900' : 'text-sepia-500'
              }`}>
                {era.name}
              </span>
            </div>
          ))}
        </div>

        {/* Slider Track */}
        <div className="pt-12">
          <Slider
            value={[position]}
            onValueChange={([value]) => onPositionChange(value)}
            max={100}
            step={1}
            className="vintage-slider"
          />
        </div>

        {/* Radio Wave Effect */}
        <div className="absolute right-0 top-0 animate-pulse">
          <Radio className="w-5 h-5 text-sepia-500" />
        </div>
      </div>

      {/* Era-specific hints */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-sepia-50 rounded border border-sepia-300">
          <p className="text-xs font-semibold text-sepia-700 mb-1">Popular Venues</p>
          <p className="text-sm text-sepia-600">
            {currentEra === '1920s' && 'Cotton Club, Savoy Ballroom'}
            {currentEra === '1930s' && 'Apollo Theater, Rainbow Room'}
            {currentEra === '1940s' && 'Copacabana, USO Shows'}
            {currentEra === '1950s' && 'Birdland, Ed Sullivan Theater'}
          </p>
        </div>
        
        <div className="text-center p-3 bg-sepia-50 rounded border border-sepia-300">
          <p className="text-xs font-semibold text-sepia-700 mb-1">Key Figures</p>
          <p className="text-sm text-sepia-600">
            {currentEra === '1920s' && 'Louis Armstrong, Al Capone'}
            {currentEra === '1930s' && 'Clark Gable, Billie Holiday'}
            {currentEra === '1940s' && 'Frank Sinatra, Rita Hayworth'}
            {currentEra === '1950s' && 'Elvis Presley, Marilyn Monroe'}
          </p>
        </div>
      </div>

      {/* Temporal Stability Warning */}
      {Math.abs(position - (eraIndex / (eras.length - 1)) * 100) > 40 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded text-center">
          <p className="text-sm text-amber-800">
            ⚠️ Temporal instability detected - reality may glitch between eras
          </p>
        </div>
      )}
    </div>
  )
}

export default DreamTimelineSlider