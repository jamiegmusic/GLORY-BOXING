import React from 'react'
import { Brain, Heart, AlertTriangle } from 'lucide-react'
import { Progress } from '../ui/progress'

interface LucidMeterHUDProps {
  lucidMeter: number;
  wellnessMeter: number;
  showWarning: boolean;
}

const LucidMeterHUD: React.FC<LucidMeterHUDProps> = ({ lucidMeter, wellnessMeter, showWarning }) => {
  const getLucidMeterColor = () => {
    if (lucidMeter > 70) return 'bg-purple-500'
    if (lucidMeter > 40) return 'bg-blue-500'
    if (lucidMeter > 20) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getWellnessColor = () => {
    if (wellnessMeter > 70) return 'bg-green-500'
    if (wellnessMeter > 40) return 'bg-yellow-500'
    if (wellnessMeter > 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="vintage-hud-container flex flex-col gap-3 p-4 bg-sepia-900/90 rounded-lg border-2 border-sepia-700 shadow-lg">
      {/* Lucid Meter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-semibold text-sepia-100">Lucid</span>
        </div>
        
        <div className="relative w-32">
          <div className="h-4 bg-sepia-800 rounded-full overflow-hidden border border-sepia-600">
            <div 
              className={`h-full ${getLucidMeterColor()} transition-all duration-500 relative overflow-hidden`}
              style={{ width: `${lucidMeter}%` }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
          
          {/* Warning indicator */}
          {showWarning && lucidMeter < 20 && (
            <AlertTriangle className="absolute -right-6 top-0 w-4 h-4 text-amber-400 animate-pulse" />
          )}
        </div>
        
        <span className="text-sm font-bold text-sepia-100 min-w-[3ch] text-right">
          {lucidMeter}
        </span>
      </div>

      {/* Wellness Meter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400" />
          <span className="text-sm font-semibold text-sepia-100">Well</span>
        </div>
        
        <div className="relative w-32">
          <div className="h-4 bg-sepia-800 rounded-full overflow-hidden border border-sepia-600">
            <div 
              className={`h-full ${getWellnessColor()} transition-all duration-500 relative overflow-hidden`}
              style={{ width: `${wellnessMeter}%` }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
        
        <span className="text-sm font-bold text-sepia-100 min-w-[3ch] text-right">
          {wellnessMeter}
        </span>
      </div>

      {/* Status Messages */}
      {lucidMeter < 20 && (
        <div className="text-xs text-amber-300 text-center animate-pulse">
          Reality is pulling you back...
        </div>
      )}
      
      {wellnessMeter < 30 && (
        <div className="text-xs text-orange-300 text-center">
          Your mind needs rest
        </div>
      )}
    </div>
  )
}

export default LucidMeterHUD