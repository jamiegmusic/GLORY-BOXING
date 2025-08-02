import React, { useState, useEffect } from 'react'
import { Brain, Zap, FileText, BarChart3, Play, Pause, Download, Settings, Target, TrendingUp, AlertTriangle, Crown, Clock, Activity, Shield, Eye, Brain as BrainIcon, Sparkles, Target as TargetIcon, BarChart3 as BarChart3Icon } from 'lucide-react'
import { FightData, FightEvent, CommentaryRequest, CommentaryResponse } from '../../lib/test-export'
import { aiCommentaryEngine, AICommentaryConfig, CommentaryContext } from '../../lib/ai-commentary-engine'
import { aiFightPrediction, FightPrediction, PredictionContext } from '../../lib/ai-fight-prediction'

interface EnhancedAICommentaryProps {
  fightData?: FightData
}

const EnhancedAICommentary: React.FC<EnhancedAICommentaryProps> = ({ fightData }) => {
  const [commentaryConfig, setCommentaryConfig] = useState<AICommentaryConfig>({
    style: 'dramatic',
    focus: 'mixed',
    language: 'en',
    targetAudience: 'mixed',
    includeStatistics: true,
    includeHistoricalContext: true,
    emotionalIntensity: 75,
    crowdReaction: 'roar'
  })

  const [commentaryResponse, setCommentaryResponse] = useState<CommentaryResponse | null>(null)
  const [fightPrediction, setFightPrediction] = useState<FightPrediction | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<'commentary' | 'prediction' | 'analysis' | 'settings'>('commentary')

  // Sample fight data for demonstration
  const sampleFightData: FightData = {
    fightId: 'usyk_bivol_2024',
    eventName: 'Glory Boxing Championship',
    venue: 'Madison Square Garden',
    date: '2024-01-10',
    time: '22:00',
    title: 'WBC Heavyweight Championship',
    weightClass: 'Heavyweight',
    rounds: 12,
    roundLength: 3,
    fighterA: {
      id: 'usyk',
      name: 'Oleksandr Usyk',
      record: '21-0-0',
      nickname: 'The Cat',
      age: 36,
      height: '6\'3"',
      reach: '78"',
      weight: 220,
      stance: 'southpaw',
      style: 'Technical boxer with exceptional footwork',
      strengths: ['Footwork', 'Ring IQ', 'Stamina', 'Technical precision'],
      weaknesses: ['Power', 'Size disadvantage'],
      trainer: 'Anatoly Lomachenko',
      promoter: 'K2 Promotions',
      nationality: 'Ukrainian',
      hometown: 'Simferopol, Ukraine',
      ranking: 1,
      titles: ['WBC Heavyweight'],
      stats: {
        totalFights: 21,
        wins: 21,
        losses: 0,
        draws: 0,
        kos: 14,
        tkos: 14,
        decisions: 7,
        koPercentage: 66.7
      }
    },
    fighterB: {
      id: 'bivol',
      name: 'Dmitry Bivol',
      record: '22-0-0',
      nickname: 'The Russian Hammer',
      age: 33,
      height: '6\'0"',
      reach: '72"',
      weight: 175,
      stance: 'orthodox',
      style: 'Power puncher with solid fundamentals',
      strengths: ['Power', 'Size', 'Fundamentals', 'Punch variety'],
      weaknesses: ['Footwork', 'Defense'],
      trainer: 'Vadim Kornilov',
      promoter: 'World of Boxing',
      nationality: 'Russian',
      hometown: 'Saint Petersburg, Russia',
      ranking: 2,
      titles: ['WBA Light Heavyweight'],
      stats: {
        totalFights: 22,
        wins: 22,
        losses: 0,
        draws: 0,
        kos: 11,
        tkos: 11,
        decisions: 11,
        koPercentage: 50.0
      }
    },
    referee: 'Tony Weeks',
    judges: ['Steve Weisfeld', 'Glenn Feldman', 'Don Trella'],
    promoter: 'Matchroom Boxing',
    broadcast: 'DAZN',
    attendance: 18500,
    gate: 2500000,
    events: [
      {
        id: '1',
        timestamp: 0,
        round: 1,
        eventType: 'round_start',
        fighter: 'fighter_a',
        details: { commentary: 'Round 1 begins! Both fighters touch gloves and we\'re underway.' },
        significance: 'routine'
      },
      {
        id: '2',
        timestamp: 15,
        round: 1,
        eventType: 'punch',
        fighter: 'fighter_a',
        details: {
          punchType: 'jab',
          punchLocation: 'head',
          damageLevel: 'light',
          accuracy: 85,
          power: 60,
          commentary: 'Usyk establishes his jab early, keeping Bivol at bay with his superior reach.'
        },
        crowdReaction: 'cheer',
        significance: 'routine'
      },
      {
        id: '3',
        timestamp: 25,
        round: 1,
        eventType: 'punch',
        fighter: 'fighter_b',
        details: {
          punchType: 'cross',
          punchLocation: 'body',
          damageLevel: 'medium',
          accuracy: 75,
          power: 80,
          commentary: 'Bivol responds with a powerful right hand to the body, looking to slow down Usyk\'s movement.'
        },
        crowdReaction: 'roar',
        significance: 'notable'
      },
      {
        id: '4',
        timestamp: 45,
        round: 1,
        eventType: 'dodge',
        fighter: 'fighter_a',
        details: {
          dodgeType: 'slip',
          commentary: 'Beautiful slip from Usyk! He\'s showing his defensive skills early in this fight.'
        },
        crowdReaction: 'cheer',
        significance: 'notable'
      },
      {
        id: '5',
        timestamp: 60,
        round: 1,
        eventType: 'punch',
        fighter: 'fighter_a',
        details: {
          punchType: 'hook',
          punchLocation: 'head',
          damageLevel: 'medium',
          accuracy: 70,
          power: 75,
          commentary: 'Usyk lands a sharp left hook that catches Bivol clean!'
        },
        crowdReaction: 'roar',
        significance: 'significant'
      }
    ],
    result: {
      winner: 'fighter_a',
      method: 'decision',
      scorecard: {
        judge1: { fighter_a: 116, fighter_b: 112 },
        judge2: { fighter_a: 117, fighter_b: 111 },
        judge3: { fighter_a: 115, fighter_b: 113 }
      }
    }
  }

  const generateEnhancedCommentary = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const fight = fightData || sampleFightData
    
    // Create commentary context
    const commentaryContext: CommentaryContext = {
      round: Math.max(...fight.events.map(e => e.round)),
      timeInRound: 180,
      totalFightTime: fight.events.length * 30,
      energyLevels: { fighter_a: 85, fighter_b: 78 },
      ringPosition: 'center',
      fightMomentum: 'fighter_a',
      significantEvents: fight.events.filter(e => e.significance === 'significant').length,
      knockdowns: { fighter_a: 0, fighter_b: 0 },
      cuts: { fighter_a: 0, fighter_b: 0 }
    }
    
    // Generate advanced commentary
    const commentary = aiCommentaryEngine.generateAdvancedCommentary(fight, commentaryContext)
    setCommentaryResponse(commentary)
    
    // Create prediction context
    const predictionContext: PredictionContext = {
      currentRound: commentaryContext.round,
      timeInRound: commentaryContext.timeInRound,
      totalFightTime: commentaryContext.totalFightTime,
      energyLevels: commentaryContext.energyLevels,
      damageAccumulated: { fighter_a: 15, fighter_b: 25 },
      momentum: commentaryContext.fightMomentum,
      significantEvents: commentaryContext.significantEvents,
      knockdowns: commentaryContext.knockdowns,
      cuts: commentaryContext.cuts,
      fouls: { fighter_a: 0, fighter_b: 0 }
    }
    
    // Generate fight prediction
    const prediction = aiFightPrediction.predictFightOutcome(fight, predictionContext)
    setFightPrediction(prediction)
    
    setIsGenerating(false)
  }

  const playCommentary = () => {
    if (!commentaryResponse) return
    
    setIsPlaying(true)
    let currentIndex = 0
    
    const interval = setInterval(() => {
      if (currentIndex < commentaryResponse.commentary.length) {
        setCurrentLine(currentIndex)
        currentIndex++
      } else {
        setIsPlaying(false)
        clearInterval(interval)
      }
    }, 3000)
  }

  const pauseCommentary = () => {
    setIsPlaying(false)
  }

  const exportCommentary = () => {
    if (!commentaryResponse) return
    
    const content = `
GLORY BOXING - ENHANCED AI COMMENTARY
=====================================

FIGHT SUMMARY:
${commentaryResponse.fightSummary}

AI PREDICTION:
${fightPrediction ? `
Winner: ${fightPrediction.winner === 'fighter_a' ? sampleFightData.fighterA.name : sampleFightData.fighterB.name}
Confidence: ${(fightPrediction.confidence * 100).toFixed(1)}%
Method: ${fightPrediction.method.toUpperCase()}
Round: ${fightPrediction.round}
Time: ${Math.floor(fightPrediction.timeInRound / 60)}:${(fightPrediction.timeInRound % 60).toString().padStart(2, '0')}

Reasoning:
${fightPrediction.reasoning.map(r => `• ${r}`).join('\n')}

Risk Factors:
${fightPrediction.riskFactors.map(rf => `• ${rf.description} (${rf.severity} risk)`).join('\n')}
` : 'No prediction available'}

HIGHLIGHTS:
${commentaryResponse.highlights.map(h => `• ${h}`).join('\n')}

ROUND SUMMARIES:
${commentaryResponse.roundSummaries.map((summary, i) => `${i + 1}. ${summary}`).join('\n')}

TECHNICAL ANALYSIS:
${commentaryResponse.technicalNotes.map(note => `• ${note}`).join('\n')}

STATISTICS:
${commentaryResponse.statistics.map(stat => `• ${stat}`).join('\n')}

PLAY-BY-PLAY COMMENTARY:
${commentaryResponse.commentary.map((line, i) => `${i + 1}. ${line}`).join('\n')}
    `
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'enhanced-ai-commentary.txt'
    a.click()
  }

  const updateCommentaryConfig = (newConfig: Partial<AICommentaryConfig>) => {
    setCommentaryConfig({ ...commentaryConfig, ...newConfig })
    aiCommentaryEngine.updateConfig(newConfig)
  }

  useEffect(() => {
    if (fightData || sampleFightData) {
      generateEnhancedCommentary()
    }
  }, [fightData])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <BrainIcon className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold">Enhanced AI Commentary & Prediction</h2>
        <Sparkles className="w-5 h-5 text-yellow-400" />
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('commentary')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'commentary' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Commentary</span>
        </button>
        <button
          onClick={() => setActiveTab('prediction')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'prediction' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
        >
          <TargetIcon className="w-4 h-4" />
          <span>Prediction</span>
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'analysis' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
        >
          <BarChart3Icon className="w-4 h-4" />
          <span>Analysis</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
            activeTab === 'settings' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Generation Controls */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">AI Generation Controls</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={generateEnhancedCommentary}
              disabled={isGenerating}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300"
            >
              {isGenerating ? <Zap className="w-4 h-4 animate-pulse" /> : <Brain className="w-4 h-4" />}
              <span>{isGenerating ? 'Generating...' : 'Generate Enhanced Commentary'}</span>
            </button>
            
            {commentaryResponse && (
              <>
                <button
                  onClick={isPlaying ? pauseCommentary : playCommentary}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause' : 'Play'} Commentary</span>
                </button>
                
                <button
                  onClick={exportCommentary}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      {activeTab === 'commentary' && commentaryResponse && (
        <div className="space-y-6">
          {/* Fight Summary */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">AI-Generated Fight Summary</h3>
            <p className="text-gray-300">{commentaryResponse.fightSummary}</p>
          </div>

          {/* Highlights */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Key Highlights</h3>
            <div className="space-y-2">
              {commentaryResponse.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-300">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Commentary Display */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Enhanced AI Commentary</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {commentaryResponse.commentary.map((line, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    index === currentLine && isPlaying
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  <p className="text-sm">{line}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Event {index + 1} • Round {Math.floor(index / 3) + 1}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'prediction' && fightPrediction && (
        <div className="space-y-6">
          {/* Prediction Summary */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>AI Fight Prediction</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-400 mb-2">Predicted Winner</h4>
                  <p className="text-2xl font-bold">
                    {fightPrediction.winner === 'fighter_a' ? sampleFightData.fighterA.name : sampleFightData.fighterB.name}
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-400 mb-2">Confidence</h4>
                  <p className="text-2xl font-bold">{(fightPrediction.confidence * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-green-400 mb-2">Method</h4>
                  <p className="text-xl font-bold">{fightPrediction.method.toUpperCase()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-400 mb-2">Round</h4>
                  <p className="text-2xl font-bold">{fightPrediction.round}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-red-400 mb-2">Time</h4>
                  <p className="text-xl font-bold">
                    {Math.floor(fightPrediction.timeInRound / 60)}:{(fightPrediction.timeInRound % 60).toString().padStart(2, '0')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reasoning */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">AI Reasoning</h3>
            <div className="space-y-2">
              {fightPrediction.reasoning.map((reason, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-300">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Risk Assessment</span>
            </h3>
            <div className="space-y-3">
              {fightPrediction.riskFactors.map((risk, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-red-400">{risk.type.toUpperCase()}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      risk.severity === 'critical' ? 'bg-red-600' :
                      risk.severity === 'high' ? 'bg-orange-600' :
                      risk.severity === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                    }`}>
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{risk.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <span>Probability: {(risk.probability * 100).toFixed(1)}%</span>
                    <span>Impact: {(risk.impact * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analysis' && commentaryResponse && (
        <div className="space-y-6">
          {/* Technical Analysis */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Technical Analysis</h3>
            <div className="space-y-2">
              {commentaryResponse.technicalNotes.map((note, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-300">{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Fight Statistics</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {commentaryResponse.statistics.map((stat, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-300">{stat}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Round Summaries */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Round-by-Round Analysis</h3>
            <div className="space-y-3">
              {commentaryResponse.roundSummaries.map((summary, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-400 mb-2">Round {index + 1}</h4>
                  <p className="text-gray-300">{summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">AI Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Commentary Style</label>
              <select
                value={commentaryConfig.style}
                onChange={(e) => updateCommentaryConfig({ style: e.target.value as any })}
                className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm w-full"
              >
                <option value="technical">Technical</option>
                <option value="dramatic">Dramatic</option>
                <option value="casual">Casual</option>
                <option value="expert">Expert</option>
                <option value="colorful">Colorful</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Focus</label>
              <select
                value={commentaryConfig.focus}
                onChange={(e) => updateCommentaryConfig({ focus: e.target.value as any })}
                className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm w-full"
              >
                <option value="play_by_play">Play-by-Play</option>
                <option value="analysis">Analysis</option>
                <option value="entertainment">Entertainment</option>
                <option value="technical">Technical</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Emotional Intensity</label>
              <input
                type="range"
                min="0"
                max="100"
                value={commentaryConfig.emotionalIntensity}
                onChange={(e) => updateCommentaryConfig({ emotionalIntensity: parseInt(e.target.value) })}
                className="w-full"
              />
              <span className="text-sm text-gray-400">{commentaryConfig.emotionalIntensity}%</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Crowd Reaction</label>
              <select
                value={commentaryConfig.crowdReaction}
                onChange={(e) => updateCommentaryConfig({ crowdReaction: e.target.value as any })}
                className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm w-full"
              >
                <option value="cheer">Cheer</option>
                <option value="roar">Roar</option>
                <option value="gasp">Gasp</option>
                <option value="silence">Silence</option>
                <option value="boo">Boo</option>
                <option value="applause">Applause</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={commentaryConfig.includeStatistics}
                  onChange={(e) => updateCommentaryConfig({ includeStatistics: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-300">Include Statistics</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={commentaryConfig.includeHistoricalContext}
                  onChange={(e) => updateCommentaryConfig({ includeHistoricalContext: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-300">Include Historical Context</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnhancedAICommentary 