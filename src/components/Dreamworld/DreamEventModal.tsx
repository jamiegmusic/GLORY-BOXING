'use client'

import React from 'react'
import { X, Sparkles, AlertTriangle, Eye, Moon, Zap } from 'lucide-react'

interface DreamChoice {
  text: string
  impact?: string
  consequence?: string
}

interface DreamEventModalProps {
  dreamType: 'prophecy' | 'warning' | 'inspiration' | 'nightmare' | 'vision'
  content: string
  impactScore: number
  actionableInsight: string
  choices?: DreamChoice[]
  onChoice: (choiceIndex: number) => void
  onClose?: () => void
  isOpen?: boolean
}

const DreamEventModal: React.FC<DreamEventModalProps> = ({
  dreamType,
  content,
  impactScore,
  actionableInsight,
  choices = [],
  onChoice,
  onClose,
  isOpen = true
}) => {
  if (!isOpen) return null

  // Dream type configurations
  const dreamTypeConfig = {
    prophecy: {
      icon: Eye,
      color: 'from-amber-600 to-yellow-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      label: 'Prophecy'
    },
    warning: {
      icon: AlertTriangle,
      color: 'from-red-600 to-orange-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-300',
      label: 'Warning'
    },
    inspiration: {
      icon: Sparkles,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      label: 'Inspiration'
    },
    nightmare: {
      icon: Moon,
      color: 'from-gray-800 to-purple-900',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-400',
      label: 'Nightmare'
    },
    vision: {
      icon: Zap,
      color: 'from-blue-600 to-teal-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      label: 'Vision'
    }
  }

  const config = dreamTypeConfig[dreamType]
  const Icon = config.icon

  // Default choices if none provided
  const displayChoices = choices.length > 0 ? choices : [
    { text: 'Accept the dream\'s wisdom', impact: 'positive' },
    { text: 'Question its meaning', impact: 'neutral' },
    { text: 'Reject the vision', impact: 'negative' }
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="relative bg-gradient-to-br from-sepia-50 via-sepia-100 to-amber-50 
                        rounded-3xl shadow-2xl max-w-2xl w-full 
                        border-4 border-sepia-300/50 
                        animate-slide-in transform transition-all">
          
          {/* Vintage texture overlay */}
          <div className="absolute inset-0 rounded-3xl opacity-20 mix-blend-multiply"
               style={{
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.5"/%3E%3C/svg%3E")'
               }} />

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full 
                         bg-sepia-200/80 hover:bg-sepia-300/80 
                         transition-colors duration-200 z-10"
            >
              <X className="w-6 h-6 text-sepia-700" />
            </button>
          )}

          <div className="relative p-8 space-y-6">
            {/* Dream Type Badge */}
            <div className="flex items-center justify-center">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full 
                              bg-gradient-to-r ${config.color} text-white 
                              shadow-lg transform hover:scale-105 transition-transform`}>
                <Icon className="w-6 h-6" />
                <span className="text-xl font-bold tracking-wide">{config.label}</span>
              </div>
            </div>

            {/* Impact Score */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <span className="text-sepia-600 text-lg font-medium">Impact:</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < Math.ceil(impactScore / 20)
                          ? 'bg-gradient-to-r ' + config.color
                          : 'bg-sepia-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sepia-700 font-bold text-lg">{impactScore}/100</span>
              </div>
            </div>

            {/* Dream Content */}
            <div className={`${config.bgColor} ${config.borderColor} 
                            border-2 rounded-2xl p-6 relative overflow-hidden`}>
              <div className="absolute -top-4 -right-4 opacity-10">
                <Icon className="w-32 h-32" />
              </div>
              <p className="relative text-xl leading-relaxed text-sepia-800 font-serif italic">
                "{content}"
              </p>
            </div>

            {/* Actionable Insight */}
            <div className="bg-gradient-to-r from-sepia-100 to-amber-100 
                            rounded-2xl p-5 border-2 border-sepia-200">
              <h3 className="text-lg font-bold text-sepia-700 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Insight
              </h3>
              <p className="text-sepia-700 text-lg leading-relaxed">
                {actionableInsight}
              </p>
            </div>

            {/* Choice Buttons */}
            <div className="space-y-3 pt-4">
              <h3 className="text-center text-xl font-bold text-sepia-700 mb-4">
                What will you do?
              </h3>
              {displayChoices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => onChoice(index)}
                  className="w-full py-4 px-6 rounded-2xl text-lg font-medium
                             bg-gradient-to-r from-sepia-200 to-amber-200 
                             hover:from-sepia-300 hover:to-amber-300 
                             text-sepia-800 border-2 border-sepia-300
                             transform hover:scale-[1.02] transition-all duration-200
                             shadow-md hover:shadow-lg"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{choice.text}</span>
                    {choice.impact && (
                      <span className="text-sm text-sepia-600 italic">
                        ({choice.impact} impact)
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 
                          border-sepia-400 rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 
                          border-sepia-400 rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 
                          border-sepia-400 rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 
                          border-sepia-400 rounded-br-3xl" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </>
  )
}

export default DreamEventModal