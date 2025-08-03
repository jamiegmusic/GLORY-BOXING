'use client'

import React, { useState } from 'react'
import DreamEventModal from './DreamEventModal'

const DreamEventModalDemo: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [lastChoice, setLastChoice] = useState<string>('')

  const dreamExamples = [
    {
      id: 'prophecy',
      dreamType: 'prophecy' as const,
      content: 'In the smoke-filled speakeasy, you see your fighter standing victorious in Madison Square Garden. The crowd chants a name that isn\'t yet known, but the golden belt gleams with certainty.',
      impactScore: 85,
      actionableInsight: 'Your fighter\'s training regimen shows promise. Consider investing in specialized defensive techniques to counter aggressive opponents.',
      choices: [
        { text: 'Double down on training intensity', impact: 'high risk, high reward' },
        { text: 'Seek wisdom from veteran trainers', impact: 'moderate, steady progress' },
        { text: 'Trust in fate\'s design', impact: 'maintain current path' }
      ]
    },
    {
      id: 'warning',
      dreamType: 'warning' as const,
      content: 'Clara Bow whispers of a rival manager spreading rumors about fixed fights. The shadows of scandal threaten to engulf your rising star before their prime.',
      impactScore: 70,
      actionableInsight: 'Reputation management is crucial. Build relationships with trustworthy journalists and maintain transparent records of all matches.',
      choices: [
        { text: 'Confront the rival directly', impact: 'aggressive resolution' },
        { text: 'Launch a PR counter-offensive', impact: 'strategic defense' },
        { text: 'Let your fighter\'s fists do the talking', impact: 'risky but bold' }
      ]
    },
    {
      id: 'inspiration',
      dreamType: 'inspiration' as const,
      content: 'Duke Ellington\'s melody flows through your mind, revealing a new training rhythm that synchronizes perfectly with your fighter\'s natural movements.',
      impactScore: 75,
      actionableInsight: 'Music and rhythm can enhance training effectiveness. Consider incorporating jazz tempo into workout routines for improved coordination.',
      choices: [
        { text: 'Hire a musician for training sessions', impact: 'innovative approach' },
        { text: 'Develop a signature entrance theme', impact: 'psychological advantage' },
        { text: 'Study the rhythm of champions', impact: 'analytical improvement' }
      ]
    },
    {
      id: 'nightmare',
      dreamType: 'nightmare' as const,
      content: 'The ring transforms into quicksand. Your fighter sinks deeper with each punch thrown, while Al Capone counts money in the corner, each bill a lost opportunity.',
      impactScore: 60,
      actionableInsight: 'Financial pressures may be affecting performance. Review contracts and ensure your fighter isn\'t overextended with obligations.',
      choices: [
        { text: 'Renegotiate existing contracts', impact: 'financial relief' },
        { text: 'Cut ties with suspicious backers', impact: 'ethical stance' },
        { text: 'Embrace the darkness for power', impact: 'dangerous path' }
      ]
    },
    {
      id: 'vision',
      dreamType: 'vision' as const,
      content: 'Time fractures, showing multiple futures: Your fighter as champion, as fallen hero, as legendary trainer. Each path glimmers with equal possibility.',
      impactScore: 90,
      actionableInsight: 'Career crossroads approaching. The next three fights will determine your fighter\'s legacy. Choose opponents wisely.',
      choices: [
        { text: 'Pursue the championship path', impact: 'glory or defeat' },
        { text: 'Build a lasting legacy', impact: 'long-term success' },
        { text: 'Forge an unexpected destiny', impact: 'unique outcome' }
      ]
    }
  ]

  const handleChoice = (dreamId: string, choiceIndex: number) => {
    const dream = dreamExamples.find(d => d.id === dreamId)
    const choice = dream?.choices[choiceIndex]
    setLastChoice(`${dream?.dreamType}: "${choice?.text}" - ${choice?.impact}`)
    setActiveModal(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sepia-50 to-amber-50 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-sepia-900 mb-2">Dream Event Modal Demo</h1>
        <p className="text-lg text-sepia-700">Experience different types of dreamworld visions</p>
        {lastChoice && (
          <div className="mt-4 p-3 bg-sepia-100 rounded-lg border border-sepia-300">
            <p className="text-sepia-800">Last choice: {lastChoice}</p>
          </div>
        )}
      </div>

      {/* Dream Type Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dreamExamples.map((dream) => (
          <button
            key={dream.id}
            onClick={() => setActiveModal(dream.id)}
            className="p-6 bg-white rounded-2xl shadow-lg border-2 border-sepia-200 
                       hover:border-sepia-400 hover:shadow-xl transform hover:scale-105 
                       transition-all duration-200"
          >
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-sepia-900 capitalize">
                {dream.dreamType}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-sepia-600">Impact:</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < Math.ceil(dream.impactScore / 20)
                          ? 'bg-amber-500'
                          : 'bg-sepia-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-sepia-700 line-clamp-2">
                {dream.content}
              </p>
              <div className="pt-2">
                <span className="inline-block px-3 py-1 bg-sepia-100 rounded-full 
                                 text-xs font-medium text-sepia-700">
                  Click to experience
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Render Active Modal */}
      {activeModal && (() => {
        const dream = dreamExamples.find(d => d.id === activeModal)
        if (!dream) return null
        return (
          <DreamEventModal
            dreamType={dream.dreamType}
            content={dream.content}
            impactScore={dream.impactScore}
            actionableInsight={dream.actionableInsight}
            choices={dream.choices}
            onChoice={(index) => handleChoice(dream.id, index)}
            onClose={() => setActiveModal(null)}
            isOpen={true}
          />
        )
      })()}

      {/* Instructions */}
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-sepia-100/50 rounded-2xl border border-sepia-200">
        <h2 className="text-2xl font-bold text-sepia-900 mb-4">Modal Features</h2>
        <ul className="space-y-2 text-sepia-700">
          <li>• <strong>Vintage 1920s styling</strong> with sepia tones and art deco elements</li>
          <li>• <strong>Dream type badges</strong> with unique colors and icons</li>
          <li>• <strong>Impact score visualization</strong> showing dream importance</li>
          <li>• <strong>Actionable insights</strong> for strategic decision-making</li>
          <li>• <strong>Multiple choice options</strong> with impact descriptions</li>
          <li>• <strong>Soft focus effects</strong> and rounded corners for dreamy aesthetic</li>
          <li>• <strong>Large, readable fonts</strong> for comfortable viewing</li>
        </ul>
      </div>
    </div>
  )
}

export default DreamEventModalDemo