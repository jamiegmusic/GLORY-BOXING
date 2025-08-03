import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { Button } from '../ui/button'
import { Brain, Zap, Moon } from 'lucide-react'
import DreamworldDashboard from './DreamworldDashboard'
import { LegacyUnlock } from '../../types/dreamworld'

interface DreamworldTriggerProps {
  playerId: string;
  triggerType: 'knockout' | 'breakdown' | 'injury' | null;
  fighterName?: string;
  onComplete: (legacyUnlocks: LegacyUnlock[]) => void;
}

const DreamworldTrigger: React.FC<DreamworldTriggerProps> = ({ 
  playerId, 
  triggerType, 
  fighterName,
  onComplete 
}) => {
  const [showTransition, setShowTransition] = useState(false)
  const [enterDreamworld, setEnterDreamworld] = useState(false)

  useEffect(() => {
    if (triggerType) {
      setShowTransition(true)
    }
  }, [triggerType])

  const handleEnterDreamworld = () => {
    setEnterDreamworld(true)
    setShowTransition(false)
  }

  const handleSkipDreamworld = () => {
    setShowTransition(false)
    onComplete([])
  }

  const handleWakeUp = (legacyUnlocks: LegacyUnlock[]) => {
    setEnterDreamworld(false)
    onComplete(legacyUnlocks)
  }

  const getTransitionMessage = () => {
    switch (triggerType) {
      case 'knockout':
        return {
          title: "Knocked Out!",
          description: `${fighterName || 'Your fighter'} has been knocked unconscious. As darkness takes hold, a strange dream begins...`,
          icon: <Zap className="w-12 h-12 text-yellow-500" />
        }
      case 'breakdown':
        return {
          title: "Mental Breakdown",
          description: "The stress of management has become too much. Your mind retreats to a different time and place...",
          icon: <Brain className="w-12 h-12 text-purple-500" />
        }
      case 'injury':
        return {
          title: "Severe Injury",
          description: `${fighterName || 'Your fighter'} has sustained a serious injury. While unconscious, visions of the past emerge...`,
          icon: <Moon className="w-12 h-12 text-blue-500" />
        }
      default:
        return {
          title: "Dreamworld Beckons",
          description: "A mysterious force pulls you into the realm of dreams...",
          icon: <Moon className="w-12 h-12 text-indigo-500" />
        }
    }
  }

  if (enterDreamworld) {
    return (
      <div className="fixed inset-0 z-50">
        <DreamworldDashboard 
          playerId={playerId}
          onWakeUp={handleWakeUp}
        />
      </div>
    )
  }

  if (!showTransition) return null

  const message = getTransitionMessage()

  return (
    <Dialog open={showTransition} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg">
        <div className="text-center py-6">
          <div className="mb-6 flex justify-center">
            {message.icon}
          </div>
          
          <h2 className="text-3xl font-bold mb-4">{message.title}</h2>
          
          <p className="text-lg text-gray-600 mb-8">
            {message.description}
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-sepia-50 rounded-lg border border-sepia-300">
              <h3 className="font-semibold text-sepia-800 mb-2">
                Enter the Dreamworld - 1920s
              </h3>
              <p className="text-sm text-sepia-600 mb-3">
                Experience a lucid dream where you manage historical entertainment figures. 
                Your actions in the dream can unlock bonuses for the real world!
              </p>
              <ul className="text-xs text-sepia-600 text-left list-disc list-inside">
                <li>Manage jazz singers, actors, and boxing legends</li>
                <li>Navigate the prohibition era entertainment scene</li>
                <li>Earn legacy items that persist after waking</li>
                <li>Experience reality glitches and temporal anomalies</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleEnterDreamworld}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
              >
                <Moon className="w-4 h-4 mr-2" />
                Enter Dreamworld
              </Button>
              
              <Button
                onClick={handleSkipDreamworld}
                variant="outline"
                className="flex-1"
              >
                Skip & Wake Up
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Note: The dreamworld is optional but offers unique rewards and gameplay
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DreamworldTrigger