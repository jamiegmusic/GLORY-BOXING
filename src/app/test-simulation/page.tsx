'use client';

import React, { useState } from 'react';
import { EnhancedMatchSimulator } from '@/lib/match-simulator';
import CommentaryPanel from '../../../glory-ui/src/components/CommentaryPanel';

export default function TestSimulationPage() {
  const [matchResult, setMatchResult] = useState<any>(null);
  const [commentaryData, setCommentaryData] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isGeneratingCommentary, setIsGeneratingCommentary] = useState(false);

  const testFighterA = {
    name: 'Carl Froch',
    record: '33-2-0',
    stats: {
      power: 85,
      speed: 75,
      defense: 80,
      stamina: 90,
      chin: 85
    }
  };

  const testFighterB = {
    name: 'Tony Bellew',
    record: '30-3-1',
    stats: {
      power: 80,
      speed: 80,
      defense: 75,
      stamina: 85,
      chin: 80
    }
  };

  const simulateMatch = () => {
    setIsSimulating(true);
    
    // Simulate the match
    const simulator = new EnhancedMatchSimulator(
      testFighterA,
      testFighterB,
      'O2 Arena, London',
      'Light Heavyweight',
      true,
      'WBC Light Heavyweight'
    );
    
    const result = simulator.simulateMatch();
    setMatchResult(result);
    setIsSimulating(false);
  };

  const generateCommentary = async () => {
    if (!matchResult) return;
    
    setIsGeneratingCommentary(true);
    try {
      const response = await fetch('/api/commentary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schema: matchResult,
          style: 'aggressive',
          focus: 'drama'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCommentaryData(data);
      }
    } catch (error) {
      console.error('Failed to generate commentary:', error);
    } finally {
      setIsGeneratingCommentary(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Enhanced Match Simulation Test</h1>
          <p className="text-gray-400">Test the new detailed event system and AI commentary</p>
        </div>

        {/* Simulation Controls */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Simulation Controls</h2>
          <div className="flex space-x-4">
            <button
              onClick={simulateMatch}
              disabled={isSimulating}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-md transition duration-300"
            >
              {isSimulating ? 'Simulating...' : 'Simulate Match'}
            </button>
            {matchResult && (
              <button
                onClick={generateCommentary}
                disabled={isGeneratingCommentary}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-md transition duration-300"
              >
                {isGeneratingCommentary ? 'Generating...' : 'Generate AI Commentary'}
              </button>
            )}
          </div>
        </div>

        {/* Match Result */}
        {matchResult && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Match Result</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Fighters</h3>
                <div className="space-y-2">
                  <p><span className="text-blue-400">{matchResult.fighterA.name}</span> vs <span className="text-red-400">{matchResult.fighterB.name}</span></p>
                  <p className="text-sm text-gray-400">{matchResult.venue}</p>
                  <p className="text-sm text-gray-400">{matchResult.weightClass}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Result</h3>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-green-400">
                    {matchResult.result.winner} wins by {matchResult.result.method.toUpperCase()}
                  </p>
                  {matchResult.result.round && (
                    <p className="text-sm text-gray-400">
                      Round {matchResult.result.round} at {matchResult.result.timeInRound}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Event Statistics */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Event Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-blue-400">{matchResult.events.length}</p>
                  <p className="text-xs text-gray-400">Total Events</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {matchResult.events.filter((e: any) => e.action === 'knockdown').length}
                  </p>
                  <p className="text-xs text-gray-400">Knockdowns</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-purple-400">
                    {matchResult.events.filter((e: any) => e.combo).length}
                  </p>
                  <p className="text-xs text-gray-400">Combos</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-yellow-400">
                    {matchResult.events.filter((e: any) => e.action === 'clinched').length}
                  </p>
                  <p className="text-xs text-gray-400">Clinches</p>
                </div>
              </div>
            </div>

            {/* Event Timeline */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Event Timeline</h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {matchResult.events.slice(0, 20).map((event: any, index: number) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm">
                          <span className="text-blue-400">Round {event.round}</span> at{' '}
                          <span className="text-gray-400">{event.timeInRound}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-yellow-400">{event.fighter}</span> -{' '}
                          <span className="text-green-400">{event.action}</span>
                          {event.impact && (
                            <span className="text-red-400"> ({event.impact})</span>
                          )}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        event.eventType === 'offense' ? 'bg-red-600' :
                        event.eventType === 'defense' ? 'bg-blue-600' :
                        'bg-purple-600'
                      }`}>
                        {event.eventType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Commentary Panel */}
        {commentaryData && (
          <CommentaryPanel
            matchData={matchResult}
            commentary={commentaryData.commentary}
            highlights={commentaryData.highlights}
            roundByRound={commentaryData.roundByRound}
            analysis={commentaryData.analysis}
            rating={commentaryData.rating}
            onGenerateCommentary={generateCommentary}
          />
        )}
      </div>
    </div>
  );
} 