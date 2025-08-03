import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Brain, Sparkles, AlertTriangle, Eye, Moon, Zap } from 'lucide-react'
import { DreamEvent, DreamChoice } from '../../types/dreamworld'

interface DreamEventModalProps {
  event: DreamEvent;
  lucidMeter: number;
  onChoice: (choice: DreamChoice) => void;
  onClose: () => void;
}

const DreamEventModal: React.FC<DreamEventModalProps> = ({ event, lucidMeter, onChoice, onClose }) => {
  const getDreamTypeIcon = () => {
    switch (event.dream_type) {
      case 'prophecy': return <Eye className="w-6 h-6 text-purple-600" />
      case 'warning': return <AlertTriangle className="w-6 h-6 text-amber-600" />
      case 'inspiration': return <Sparkles className="w-6 h-6 text-blue-600" />
      case 'nightmare': return <Moon className="w-6 h-6 text-red-600" />
      case 'vision': return <Zap className="w-6 h-6 text-cyan-600" />
      case 'memory': return <Brain className="w-6 h-6 text-gray-600" />
    }
  }

  const getDreamTypeColor = () => {
    switch (event.dream_type) {
      case 'prophecy': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'inspiration': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'nightmare': return 'bg-red-100 text-red-800 border-red-300'
      case 'vision': return 'bg-cyan-100 text-cyan-800 border-cyan-300'
      case 'memory': return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const canChooseOption = (choice: DreamChoice) => {
    if (!choice.requirements) return true
    
    if (choice.requirements.lucidMeter && lucidMeter < choice.requirements.lucidMeter) {
      return false
    }
    
    // Additional requirement checks would go here
    return true
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="vintage-modal max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {getDreamTypeIcon()}
            <DialogTitle className="text-2xl font-serif text-sepia-900">
              Dream Event
            </DialogTitle>
            <Badge className={`${getDreamTypeColor()} border`}>
              {event.dream_type}
            </Badge>
          </div>
          
          {event.actionable_insight && (
            <DialogDescription className="text-base text-sepia-700 mt-2 italic">
              💡 {event.actionable_insight}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Event Content */}
        <div className="my-6 p-4 bg-sepia-50 rounded-lg border-2 border-sepia-200">
          <p className="text-lg text-sepia-800 leading-relaxed font-serif">
            {event.content}
          </p>
          
          {/* Impact Score */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-sepia-600">Impact:</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < Math.floor(event.impact_score / 20)
                      ? 'bg-amber-500'
                      : 'bg-sepia-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-sepia-700">
              {event.impact_score}/100
            </span>
          </div>
        </div>

        {/* Choice Options */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-sepia-700 uppercase tracking-wider">
            Choose Your Response:
          </h4>
          
          {event.choices.map((choice, index) => {
            const isDisabled = !canChooseOption(choice)
            
            return (
              <div key={index} className="relative">
                <Button
                  variant="outline"
                  className={`w-full text-left justify-start p-4 h-auto vintage-choice-button ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isDisabled}
                  onClick={() => onChoice(choice)}
                >
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-sepia-900">
                        {choice.label}
                      </span>
                      
                      {choice.lucidCost && (
                        <Badge variant="secondary" className="ml-2">
                          <Brain className="w-3 h-3 mr-1" />
                          -{choice.lucidCost} Lucid
                        </Badge>
                      )}
                    </div>
                    
                    <span className="text-sm text-sepia-600">
                      {choice.effect}
                    </span>
                    
                    {/* Requirements */}
                    {choice.requirements && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {choice.requirements.lucidMeter && (
                          <Badge 
                            variant={lucidMeter >= choice.requirements.lucidMeter ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            Requires {choice.requirements.lucidMeter} Lucid
                          </Badge>
                        )}
                        {choice.requirements.dreamLevel && (
                          <Badge variant="outline" className="text-xs">
                            Level {choice.requirements.dreamLevel}+
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </Button>
                
                {/* Disabled overlay message */}
                {isDisabled && choice.requirements?.lucidMeter && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/80 text-white px-3 py-1 rounded text-sm">
                      Not enough lucid energy
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Current Lucid Meter Display */}
        <div className="mt-4 pt-4 border-t border-sepia-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-sepia-600">Your Lucid Energy:</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-3 bg-sepia-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    lucidMeter > 50 ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                    lucidMeter > 20 ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                    'bg-gradient-to-r from-red-400 to-red-600'
                  }`}
                  style={{ width: `${lucidMeter}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-sepia-800">
                {lucidMeter}/100
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DreamEventModal