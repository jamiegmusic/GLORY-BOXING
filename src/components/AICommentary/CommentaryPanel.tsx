import React, { useState, useEffect } from 'react'
import { Mic, Play, Pause, Volume2, Settings } from 'lucide-react'
import { Fight, Fighter } from '@/lib/supabase'

interface CommentaryPanelProps {
  fight?: Fight
  fighter1?: Fighter
  fighter2?: Fighter
  commentary?: string[]
  isLive?: boolean
}

export default function CommentaryPanel({ 
  fight, 
  fighter1, 
  fighter2, 
  commentary = [], 
  isLive = false 
}: CommentaryPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentCommentaryIndex, setCurrentCommentaryIndex] = useState(0)
  const [commentaryStyle, setCommentaryStyle] = useState<'technical' | 'dramatic' | 'casual'>('dramatic')
  const [volume, setVolume] = useState(0.8)

  useEffect(() => {
    if (isLive && isPlaying) {
      const interval = setInterval(() => {
        setCurrentCommentaryIndex(prev => {
          if (prev < commentary.length - 1) {
            return prev + 1
          } else {
            setIsPlaying(false)
            return prev
          }
        })
      }, 3000) // New commentary every 3 seconds

      return () => clearInterval(interval)
    }
  }, [isLive, isPlaying, commentary.length])

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      if (!isLive) {
        setCurrentCommentaryIndex(0)
      }
    }
  }

  const generateCommentary = async () => {
    if (!fight || !fighter1 || !fighter2) return

    try {
      const response = await fetch('/api/commentary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fightData: {
            fighter1,
            fighter2,
            fight,
            style: commentaryStyle
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate commentary')
      }

      const data = await response.json()
      // Handle the generated commentary
      console.log('Generated commentary:', data)
    } catch (error) {
      console.error('Error generating commentary:', error)
    }
  }

  const getCommentaryStyleColor = (style: string) => {
    switch (style) {
      case 'technical':
        return 'text-blue-400'
      case 'dramatic':
        return 'text-red-400'
      case 'casual':
        return 'text-green-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Mic className="w-6 h-6 text-red-400" />
          <h3 className="text-xl font-semibold text-white">AI Commentary</h3>
          {isLive && (
            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full animate-pulse">
              LIVE
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={commentaryStyle}
            onChange={(e) => setCommentaryStyle(e.target.value as any)}
            className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-red-500 focus:outline-none text-sm"
          >
            <option value="technical">Technical</option>
            <option value="dramatic">Dramatic</option>
            <option value="casual">Casual</option>
          </select>
          
          <button
            onClick={handlePlayPause}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {commentary.length === 0 ? (
        <div className="text-center py-8">
          <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No commentary available</p>
          <button
            onClick={generateCommentary}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Generate Commentary
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
            {commentary.map((comment, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded ${
                  index === currentCommentaryIndex && isPlaying
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300'
                }`}
              >
                <p className="text-sm">{comment}</p>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Style: <span className={getCommentaryStyleColor(commentaryStyle)}>{commentaryStyle}</span></span>
            <span>{currentCommentaryIndex + 1} / {commentary.length}</span>
          </div>
        </div>
      )}

      {fight && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-lg font-semibold text-white mb-2">Fight Info</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Event</p>
              <p className="text-white">{fight.event_name}</p>
            </div>
            <div>
              <p className="text-gray-400">Venue</p>
              <p className="text-white">{fight.venue_name}</p>
            </div>
            <div>
              <p className="text-gray-400">Weight Class</p>
              <p className="text-white">{fight.weight_class}</p>
            </div>
            <div>
              <p className="text-gray-400">Rounds</p>
              <p className="text-white">{fight.rounds_scheduled}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 