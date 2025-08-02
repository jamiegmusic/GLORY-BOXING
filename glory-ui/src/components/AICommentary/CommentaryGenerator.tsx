import React, { useState, useEffect } from 'react';
import { Brain, Zap, BarChart3, Play, Pause, Download } from 'lucide-react';
import type { FightData, CommentaryRequest, CommentaryResponse } from '../../lib/test-export';

interface CommentaryGeneratorProps {
  fightData?: FightData;
}

const CommentaryGenerator: React.FC<CommentaryGeneratorProps> = ({ fightData }) => {
  const [request, setRequest] = useState<CommentaryRequest>({
    fightData: fightData || undefined,
    style: 'dramatic',
    focus: 'mixed',
    language: 'en',
    targetAudience: 'mixed',
    includeStatistics: true,
    includeHistoricalContext: true,
    maxLength: 1000
  });
  
  const [response, setResponse] = useState<CommentaryResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
  };

  const generateCommentary = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const fight = fightData || sampleFightData;
    const commentary: string[] = [];
    const roundSummaries: string[] = [];
    const highlights: string[] = [];
    const technicalNotes: string[] = [];
    
    // Generate commentary based on events
    fight.events.forEach((event, index) => {
      if (event.eventType === 'punch') {
        const fighter = event.fighter === 'fighter_a' ? fight.fighterA : fight.fighterB;
        const opponent = event.fighter === 'fighter_a' ? fight.fighterB : fight.fighterA;
        
        let line = '';
        if (event.details.punchType && event.details.damageLevel) {
          const punchDescriptions = {
            jab: 'flicks out a sharp jab',
            cross: 'fires a powerful right cross',
            hook: 'unleashes a devastating left hook',
            uppercut: 'delivers a crushing uppercut',
            body: 'targets the body with a punishing shot'
          };
          
          const damageDescriptions = {
            light: 'lands cleanly',
            medium: 'connects solidly',
            heavy: 'lands with devastating impact',
            critical: 'lands a fight-changing blow'
          };
          
          line = `${fighter.name} ${punchDescriptions[event.details.punchType]} that ${damageDescriptions[event.details.damageLevel]}!`;
          
          if (event.significance === 'significant') {
            line += ` That could be a game-changer!`;
            highlights.push(line);
          }
        }
        
        if (line) commentary.push(line);
      } else if (event.eventType === 'dodge') {
        const fighter = event.fighter === 'fighter_a' ? fight.fighterA : fight.fighterB;
        const dodgeDescriptions = {
          slip: 'beautifully slips that punch',
          duck: 'ducks under the incoming shot',
          step_back: 'steps back to avoid the attack',
          roll: 'rolls with the punch to minimize damage'
        };
        
        const line = `${fighter.name} ${dodgeDescriptions[event.details.dodgeType!]}!`;
        commentary.push(line);
      } else if (event.details.commentary) {
        commentary.push(event.details.commentary);
      }
    });
    
    // Generate round summaries
    const rounds = Math.max(...fight.events.map(e => e.round));
    for (let i = 1; i <= rounds; i++) {
      const roundEvents = fight.events.filter(e => e.round === i);
      if (roundEvents.length > 0) {
        roundSummaries.push(`Round ${i} saw ${fight.fighterA.name} and ${fight.fighterB.name} trading blows, with both fighters showing their skills.`);
      }
    }
    
    // Generate technical notes
    technicalNotes.push(`${fight.fighterA.name} showed superior footwork throughout the fight.`);
    technicalNotes.push(`${fight.fighterB.name} demonstrated excellent power punching.`);
    technicalNotes.push('The fight was a masterclass in technical boxing.');
    
    const response: CommentaryResponse = {
      commentary,
      roundSummaries,
      fightSummary: `${fight.fighterA.name} defeated ${fight.fighterB.name} by unanimous decision in a closely contested battle.`,
      highlights,
      technicalNotes,
      statistics: [
        `${fight.fighterA.name}: 156 punches thrown, 89 landed (57% accuracy)`,
        `${fight.fighterB.name}: 142 punches thrown, 78 landed (55% accuracy)`,
        'Total knockdowns: 0',
        'Fight duration: 12 rounds'
      ],
      metadata: {
        totalEvents: fight.events.length,
        significantEvents: fight.events.filter(e => e.significance === 'significant').length,
        roundsCovered: rounds,
        generationTime: 2.0,
        style: request.style
      }
    };
    
    setResponse(response);
    setIsGenerating(false);
  };

  const playCommentary = () => {
    if (!response) return;
    
    setIsPlaying(true);
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < response.commentary.length) {
        setCurrentLine(currentIndex);
        currentIndex++;
      } else {
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 3000);
  };

  const pauseCommentary = () => {
    setIsPlaying(false);
  };

  const exportCommentary = () => {
    if (!response) return;
    
    const content = `
GLORY BOXING - FIGHT COMMENTARY
================================

FIGHT SUMMARY:
${response.fightSummary}

HIGHLIGHTS:
${response.highlights.map(h => `• ${h}`).join('\n')}

ROUND SUMMARIES:
${response.roundSummaries.map((summary, i) => `${i + 1}. ${summary}`).join('\n')}

TECHNICAL ANALYSIS:
${response.technicalNotes.map(note => `• ${note}`).join('\n')}

STATISTICS:
${response.statistics.map(stat => `• ${stat}`).join('\n')}

PLAY-BY-PLAY COMMENTARY:
${response.commentary.map((line, i) => `${i + 1}. ${line}`).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fight-commentary.txt';
    a.click();
  };

  useEffect(() => {
    if (fightData || sampleFightData) {
      generateCommentary();
    }
  }, [fightData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Brain className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold">AI Commentary Generator</h2>
      </div>

      {/* Generation Controls */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Generation Settings</h3>
          <div className="flex items-center space-x-4">
            <select
              value={request.style}
              onChange={(e) => setRequest({...request, style: e.target.value as any})}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-sm"
            >
              <option value="technical">Technical</option>
              <option value="dramatic">Dramatic</option>
              <option value="casual">Casual</option>
              <option value="expert">Expert</option>
              <option value="colorful">Colorful</option>
            </select>
            
            <select
              value={request.focus}
              onChange={(e) => setRequest({...request, focus: e.target.value as any})}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-sm"
            >
              <option value="play_by_play">Play-by-Play</option>
              <option value="analysis">Analysis</option>
              <option value="entertainment">Entertainment</option>
              <option value="technical">Technical</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={generateCommentary}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300"
          >
            {isGenerating ? <Zap className="w-4 h-4 animate-pulse" /> : <Brain className="w-4 h-4" />}
            <span>{isGenerating ? 'Generating...' : 'Generate Commentary'}</span>
          </button>
          
          {response && (
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

      {/* Generated Commentary */}
      {response && (
        <div className="space-y-6">
          {/* Fight Summary */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Fight Summary</h3>
            <p className="text-gray-300">{response.fightSummary}</p>
          </div>

          {/* Highlights */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Key Highlights</h3>
            <div className="space-y-2">
              {response.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-300">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Commentary Display */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Generated Commentary</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {response.commentary.map((line, index) => (
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

          {/* Statistics */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Fight Statistics</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {response.statistics.map((stat, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <p className="text-sm text-gray-300">{stat}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Analysis */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Technical Analysis</h3>
            <div className="space-y-2">
              {response.technicalNotes.map((note, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-300">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentaryGenerator; 