import React, { useState } from 'react'
import { Camera, Download, RefreshCw, User } from 'lucide-react'

interface Fighter {
  id: string
  name: string
  country: string
  weight_class: string
  record: string
  status: string
}

const SAMPLE_FIGHTERS: Fighter[] = [
  { id: '1', name: 'Tyson Fury', country: 'GB', weight_class: 'Heavyweight', record: '34-0-1', status: 'Champion' },
  { id: '2', name: 'Oleksandr Usyk', country: 'UA', weight_class: 'Heavyweight', record: '21-0-0', status: 'Champion' },
  { id: '3', name: 'Anthony Joshua', country: 'GB', weight_class: 'Heavyweight', record: '26-3-0', status: 'Contender' },
  { id: '4', name: 'Deontay Wilder', country: 'US', weight_class: 'Heavyweight', record: '43-2-1', status: 'Contender' },
  { id: '5', name: 'Canelo Alvarez', country: 'MX', weight_class: 'Super Middleweight', record: '59-2-2', status: 'Champion' },
  { id: '6', name: 'David Benavidez', country: 'US', weight_class: 'Super Middleweight', record: '27-0-0', status: 'Contender' },
  { id: '7', name: 'Dmitry Bivol', country: 'RU', weight_class: 'Light Heavyweight', record: '21-0-0', status: 'Champion' },
  { id: '8', name: 'Artur Beterbiev', country: 'RU', weight_class: 'Light Heavyweight', record: '19-0-0', status: 'Champion' }
]

export default function PortraitGenerator() {
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null)
  const [generating, setGenerating] = useState(false)
  const [generatedPortrait, setGeneratedPortrait] = useState<string | null>(null)
  const [portraitStyle, setPortraitStyle] = useState<'realistic' | 'artistic' | 'vintage' | 'modern'>('realistic')
  const [portraitSettings, setPortraitSettings] = useState({
    age: 28,
    expression: 'neutral',
    lighting: 'studio',
    background: 'ring'
  })

  const handleGeneratePortrait = async () => {
    if (!selectedFighter) return

    setGenerating(true)
    try {
      // Simulate AI portrait generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generate a mock portrait URL (in real implementation, this would be an AI-generated image)
      const mockPortraitUrl = `https://picsum.photos/400/500?random=${Date.now()}`
      setGeneratedPortrait(mockPortraitUrl)
    } catch (error) {
      console.error('Error generating portrait:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadPortrait = () => {
    if (!generatedPortrait) return
    
    const link = document.createElement('a')
    link.href = generatedPortrait
    link.download = `${selectedFighter?.name}-portrait.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleRegeneratePortrait = () => {
    setGeneratedPortrait(null)
    handleGeneratePortrait()
  }

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'GB': '🇬🇧',
      'US': '🇺🇸',
      'UA': '🇺🇦',
      'MX': '🇲🇽',
      'RU': '🇷🇺'
    }
    return flags[country] || '🏳️'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">AI Portrait Generator</h2>
        <div className="text-gray-400 text-sm">
          Generate realistic portraits for your fighters using AI
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fighter Selection */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-400" />
            <span>Select Fighter</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Choose Fighter
              </label>
              <select
                value={selectedFighter?.id || ''}
                onChange={(e) => {
                  const fighter = SAMPLE_FIGHTERS.find(f => f.id === e.target.value)
                  setSelectedFighter(fighter || null)
                }}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select a fighter...</option>
                {SAMPLE_FIGHTERS.map(fighter => (
                  <option key={fighter.id} value={fighter.id}>
                    {fighter.name} ({fighter.weight_class})
                  </option>
                ))}
              </select>
            </div>

            {selectedFighter && (
              <div className="fighter-preview bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-xl">🥊</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{selectedFighter.name}</h4>
                    <div className="flex items-center space-x-2 text-gray-300 text-sm">
                      <span>{getCountryFlag(selectedFighter.country)}</span>
                      <span>{selectedFighter.country}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Weight Class:</span>
                    <div className="text-white">{selectedFighter.weight_class}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Record:</span>
                    <div className="text-white">{selectedFighter.record}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <div className="text-white">{selectedFighter.status}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Country:</span>
                    <div className="text-white">{selectedFighter.country}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Portrait Settings */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Camera className="w-5 h-5 text-green-400" />
            <span>Portrait Settings</span>
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Portrait Style
              </label>
              <select
                value={portraitStyle}
                onChange={(e) => setPortraitStyle(e.target.value as any)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="realistic">Realistic</option>
                <option value="artistic">Artistic</option>
                <option value="vintage">Vintage</option>
                <option value="modern">Modern</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={portraitSettings.age}
                  onChange={(e) => setPortraitSettings(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none"
                  min="18"
                  max="50"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Expression
                </label>
                <select
                  value={portraitSettings.expression}
                  onChange={(e) => setPortraitSettings(prev => ({ ...prev, expression: e.target.value }))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="neutral">Neutral</option>
                  <option value="confident">Confident</option>
                  <option value="intense">Intense</option>
                  <option value="focused">Focused</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Lighting
                </label>
                <select
                  value={portraitSettings.lighting}
                  onChange={(e) => setPortraitSettings(prev => ({ ...prev, lighting: e.target.value }))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="studio">Studio</option>
                  <option value="dramatic">Dramatic</option>
                  <option value="natural">Natural</option>
                  <option value="ring">Ring Lights</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Background
                </label>
                <select
                  value={portraitSettings.background}
                  onChange={(e) => setPortraitSettings(prev => ({ ...prev, background: e.target.value }))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="ring">Boxing Ring</option>
                  <option value="gym">Gym</option>
                  <option value="studio">Studio</option>
                  <option value="city">City Skyline</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGeneratePortrait}
              disabled={generating || !selectedFighter}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Portrait...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Generate Portrait</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Portrait */}
      {generatedPortrait && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Generated Portrait</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="portrait-display">
              <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-center">
                <img 
                  src={generatedPortrait} 
                  alt={`${selectedFighter?.name} portrait`}
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
            
            <div className="portrait-info">
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Portrait Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fighter:</span>
                      <span className="text-white">{selectedFighter?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Style:</span>
                      <span className="text-white capitalize">{portraitStyle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Age:</span>
                      <span className="text-white">{portraitSettings.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expression:</span>
                      <span className="text-white capitalize">{portraitSettings.expression}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lighting:</span>
                      <span className="text-white capitalize">{portraitSettings.lighting}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Background:</span>
                      <span className="text-white capitalize">{portraitSettings.background}</span>
                    </div>
                  </div>
                </div>
                
                <div className="portrait-actions space-y-3">
                  <button
                    onClick={handleDownloadPortrait}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Portrait</span>
                  </button>
                  
                  <button
                    onClick={handleRegeneratePortrait}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Regenerate Portrait</span>
                  </button>
                  
                  <button
                    onClick={() => setGeneratedPortrait(null)}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Clear Portrait
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Generation Tips */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">AI Generation Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-semibold mb-2">For Best Results:</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Choose fighters with clear reference photos</li>
              <li>• Use realistic style for authentic portraits</li>
              <li>• Adjust age to match fighter's current age</li>
              <li>• Select appropriate expression for the fighter's personality</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Style Recommendations:</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• <strong>Realistic:</strong> Best for official portraits</li>
              <li>• <strong>Artistic:</strong> Great for promotional materials</li>
              <li>• <strong>Vintage:</strong> Perfect for throwback themes</li>
              <li>• <strong>Modern:</strong> Ideal for contemporary branding</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 