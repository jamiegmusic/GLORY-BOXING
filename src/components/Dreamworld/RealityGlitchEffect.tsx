import React, { useEffect, useState } from 'react'
import { RealityGlitch } from '../../types/dreamworld'

interface RealityGlitchEffectProps {
  glitches: RealityGlitch[];
}

const RealityGlitchEffect: React.FC<RealityGlitchEffectProps> = ({ glitches }) => {
  const [activeGlitches, setActiveGlitches] = useState<RealityGlitch[]>([])

  useEffect(() => {
    // Only show recent glitches (last 10 seconds)
    const recentGlitches = glitches.filter(glitch => {
      const glitchTime = new Date(glitch.timestamp).getTime()
      const now = Date.now()
      return now - glitchTime < 10000
    })
    
    setActiveGlitches(recentGlitches)
  }, [glitches])

  const getGlitchStyle = (glitch: RealityGlitch) => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 100,
      animation: 'glitch-fade 3s ease-out forwards',
    }

    switch (glitch.type) {
      case 'temporal':
        return {
          ...baseStyle,
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 80}%`,
          width: '200px',
          height: '50px',
          background: 'linear-gradient(45deg, transparent, rgba(139, 69, 19, 0.3), transparent)',
          filter: 'blur(2px)',
          transform: 'skewX(-20deg)',
        }
      
      case 'visual':
        return {
          ...baseStyle,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${50 + Math.random() * 150}px`,
          height: `${20 + Math.random() * 40}px`,
          background: `rgba(${Math.random() * 255}, ${Math.random() * 100}, 0, 0.5)`,
          mixBlendMode: 'difference' as const,
          clipPath: 'polygon(0 0, 100% 10%, 95% 90%, 5% 100%)',
        }
      
      case 'auditory':
        // Create visual representation of audio glitch
        return {
          ...baseStyle,
          bottom: '20px',
          right: '20px',
          width: '150px',
          height: '40px',
          background: 'repeating-linear-gradient(90deg, #8B4513, #8B4513 2px, transparent 2px, transparent 4px)',
          opacity: 0.6,
          borderRadius: '4px',
        }
      
      case 'cognitive':
        return {
          ...baseStyle,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(139, 69, 19, 0.2) 0%, transparent 70%)',
          filter: 'blur(10px)',
        }
      
      default:
        return baseStyle
    }
  }

  const getGlitchText = (glitch: RealityGlitch) => {
    switch (glitch.type) {
      case 'temporal':
        return (
          <div className="glitch-text animate-glitch-text">
            <span className="text-sepia-700 font-mono text-sm">
              {glitch.description}
            </span>
          </div>
        )
      
      case 'visual':
        return null // Visual glitches don't have text
      
      case 'auditory':
        return (
          <div className="flex items-center gap-2 p-2">
            <div className="sound-wave">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="wave-bar"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    height: `${10 + Math.random() * 20}px`
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-sepia-600">Audio distortion</span>
          </div>
        )
      
      case 'cognitive':
        return (
          <div className="text-center">
            <p className="text-sepia-800 font-serif italic animate-pulse">
              {glitch.description}
            </p>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <>
      {/* Glitch effects */}
      {activeGlitches.map((glitch) => (
        <div
          key={glitch.id}
          style={getGlitchStyle(glitch)}
          className="glitch-effect"
        >
          {getGlitchText(glitch)}
        </div>
      ))}

      {/* Global glitch filter when severity is high */}
      {activeGlitches.some(g => g.severity > 70) && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="glitch-overlay" />
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glitch-fade {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          20% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          80% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(1.1);
          }
        }

        @keyframes glitch-text {
          0%, 100% {
            text-shadow: -2px 0 #D2691E, 2px 0 #8B4513;
          }
          25% {
            text-shadow: 2px 0 #D2691E, -2px 0 #8B4513;
          }
          50% {
            text-shadow: -1px 0 #8B4513, 1px 0 #D2691E;
          }
          75% {
            text-shadow: 1px 0 #8B4513, -1px 0 #D2691E;
          }
        }

        .animate-glitch-text {
          animation: glitch-text 0.5s infinite;
        }

        .sound-wave {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .wave-bar {
          width: 3px;
          background: #8B4513;
          animation: wave 1s ease-in-out infinite;
        }

        @keyframes wave {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(2);
          }
        }

        .glitch-overlay {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(139, 69, 19, 0.03) 2px,
            rgba(139, 69, 19, 0.03) 4px
          );
          animation: scan-lines 8s linear infinite;
        }

        @keyframes scan-lines {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 10px;
          }
        }
      `}} />
    </>
  )
}

export default RealityGlitchEffect