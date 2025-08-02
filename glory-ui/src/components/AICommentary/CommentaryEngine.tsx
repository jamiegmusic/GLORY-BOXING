import { useState, useEffect } from 'react';
import { Mic, Play, Pause, Volume2, Download, Share2 } from 'lucide-react';

// Event Schema Definition
interface FightEvent {
  id: string;
  timestamp: number;
  round: number;
  eventType: 'punch' | 'block' | 'dodge' | 'knockdown' | 'cut' | 'foul' | 'round_end' | 'fight_end';
  fighter: 'fighter_a' | 'fighter_b';
  details: {
    punchType?: 'jab' | 'cross' | 'hook' | 'uppercut' | 'body' | 'head';
    punchLocation?: 'head' | 'body' | 'arms' | 'legs';
    damageLevel?: 'light' | 'medium' | 'heavy' | 'critical';
    accuracy?: number; // 0-100
    power?: number; // 0-100
    blockType?: 'high' | 'low' | 'cross';
    dodgeType?: 'slip' | 'duck' | 'step_back' | 'roll';
    knockdownType?: 'flash' | 'heavy' | 'technical';
    cutLocation?: 'eye' | 'nose' | 'mouth' | 'brow';
    foulType?: 'low_blow' | 'headbutt' | 'holding' | 'pushing';
    roundScore?: {
      fighter_a: number;
      fighter_b: number;
    };
    commentary?: string;
  };
  crowdReaction?: 'cheer' | 'boo' | 'silence' | 'roar';
  significance?: 'routine' | 'notable' | 'significant' | 'decisive';
}

interface FightData {
  fightId: string;
  fighterA: {
    name: string;
    record: string;
    style: string;
    strengths: string[];
    weaknesses: string[];
  };
  fighterB: {
    name: string;
    record: string;
    style: string;
    strengths: string[];
    weaknesses: string[];
  };
  venue: string;
  date: string;
  title?: string;
  weightClass: string;
  rounds: number;
  events: FightEvent[];
  result?: {
    winner: 'fighter_a' | 'fighter_b' | 'draw';
    method: 'decision' | 'ko' | 'tko' | 'dqd' | 'draw';
    round?: number;
    time?: string;
    scorecard?: {
      judge1: { fighter_a: number; fighter_b: number };
      judge2: { fighter_a: number; fighter_b: number };
      judge3: { fighter_a: number; fighter_b: number };
    };
  };
}

const CommentaryEngine = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [commentary, setCommentary] = useState<string[]>([]);
  const [fightData, setFightData] = useState<FightData | null>(null);
  const [commentaryStyle, setCommentaryStyle] = useState<'technical' | 'dramatic' | 'casual'>('dramatic');

  // Sample fight data
  const sampleFightData: FightData = {
    fightId: 'usyk_bivol_2024',
    fighterA: {
      name: 'Oleksandr Usyk',
      record: '21-0-0',
      style: 'Technical boxer with exceptional footwork',
      strengths: ['Footwork', 'Ring IQ', 'Stamina', 'Technical precision'],
      weaknesses: ['Power', 'Size disadvantage']
    },
    fighterB: {
      name: 'Dmitry Bivol',
      record: '22-0-0',
      style: 'Power puncher with solid fundamentals',
      strengths: ['Power', 'Size', 'Fundamentals', 'Punch variety'],
      weaknesses: ['Footwork', 'Defense']
    },
    venue: 'Madison Square Garden',
    date: '2024-01-10',
    title: 'WBC Heavyweight Championship',
    weightClass: 'Heavyweight',
    rounds: 12,
    events: [
      {
        id: '1',
        timestamp: 0,
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
        id: '2',
        timestamp: 15,
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
        id: '3',
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

  useEffect(() => {
    setFightData(sampleFightData);
    generateCommentary(sampleFightData);
  }, []);

  const generateCommentary = (fight: FightData) => {
    const commentaryLines: string[] = [];
    
    fight.events.forEach((event, index) => {
      let line = '';
      
      switch (event.eventType) {
        case 'punch':
          line = generatePunchCommentary(event, fight);
          break;
        case 'block':
          line = generateBlockCommentary(event, fight);
          break;
        case 'dodge':
          line = generateDodgeCommentary(event, fight);
          break;
        case 'knockdown':
          line = generateKnockdownCommentary(event, fight);
          break;
        case 'round_end':
          line = generateRoundEndCommentary(event, fight);
          break;
        default:
          line = event.details.commentary || '';
      }
      
      if (line) {
        commentaryLines.push(line);
      }
    });
    
    setCommentary(commentaryLines);
  };

  const generatePunchCommentary = (event: FightEvent, fight: FightData): string => {
    const fighter = event.fighter === 'fighter_a' ? fight.fighterA : fight.fighterB;
    const opponent = event.fighter === 'fighter_a' ? fight.fighterB : fight.fighterA;
    
    let commentary = '';
    
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
      
      commentary = `${fighter.name} ${punchDescriptions[event.details.punchType]} that ${damageDescriptions[event.details.damageLevel]}!`;
      
      if (event.significance === 'significant') {
        commentary += ` That could be a game-changer!`;
      }
    }
    
    return commentary;
  };

  const generateBlockCommentary = (event: FightEvent, fight: FightData): string => {
    const fighter = event.fighter === 'fighter_a' ? fight.fighterA : fight.fighterB;
    
    return `${fighter.name} shows excellent defensive skills, blocking that shot with precision!`;
  };

  const generateDodgeCommentary = (event: FightEvent, fight: FightData): string => {
    const fighter = event.fighter === 'fighter_a' ? fight.fighterA : fight.fighterB;
    
    const dodgeDescriptions = {
      slip: 'beautifully slips that punch',
      duck: 'ducks under the incoming shot',
      step_back: 'steps back to avoid the attack',
      roll: 'rolls with the punch to minimize damage'
    };
    
    return `${fighter.name} ${dodgeDescriptions[event.details.dodgeType!]}!`;
  };

  const generateKnockdownCommentary = (event: FightEvent, fight: FightData): string => {
    const fighter = event.fighter === 'fighter_a' ? fight.fighterA : fight.fighterB;
    
    return `DOWN GOES ${fighter.name.toUpperCase()}! The referee is counting!`;
  };

  const generateRoundEndCommentary = (event: FightEvent, fight: FightData): string => {
    return `End of round ${event.round}! Let's see how the judges scored that one.`;
  };

  const playCommentary = () => {
    setIsPlaying(true);
    // Simulate commentary playback
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < commentary.length) {
        setCurrentTime(currentIndex);
        currentIndex++;
      } else {
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 2000);
  };

  const pauseCommentary = () => {
    setIsPlaying(false);
  };

  const exportCommentary = () => {
    const commentaryText = commentary.join('\n\n');
    const blob = new Blob([commentaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fight-commentary.txt';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Mic className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold">AI Commentary Engine</h2>
      </div>

      {/* Fight Information */}
      {fightData && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Fight Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-400">{fightData.fighterA.name}</h4>
              <p className="text-gray-400 text-sm">{fightData.fighterA.record}</p>
              <p className="text-gray-300 text-sm">{fightData.fighterA.style}</p>
            </div>
            <div>
              <h4 className="font-medium text-red-400">{fightData.fighterB.name}</h4>
              <p className="text-gray-400 text-sm">{fightData.fighterB.record}</p>
              <p className="text-gray-300 text-sm">{fightData.fighterB.style}</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-400">{fightData.venue} • {fightData.date}</p>
            {fightData.title && <p className="text-yellow-400 font-medium">{fightData.title}</p>}
          </div>
        </div>
      )}

      {/* Commentary Controls */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Commentary Controls</h3>
          <div className="flex items-center space-x-4">
            <select
              value={commentaryStyle}
              onChange={(e) => setCommentaryStyle(e.target.value as any)}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1 text-sm"
            >
              <option value="technical">Technical</option>
              <option value="dramatic">Dramatic</option>
              <option value="casual">Casual</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={isPlaying ? pauseCommentary : playCommentary}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'} Commentary</span>
          </button>
          
          <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300">
            <Volume2 className="w-4 h-4" />
            <span>Generate New</span>
          </button>
          
          <button
            onClick={exportCommentary}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-300"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          
          <button className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition duration-300">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Commentary Display */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Generated Commentary</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {commentary.map((line, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg transition-all duration-300 ${
                index === currentTime && isPlaying
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              <p className="text-sm">{line}</p>
              <p className="text-xs text-gray-500 mt-1">
                Round {Math.floor(index / 3) + 1} • {index * 15}s
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Event Schema Display */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Event Schema</h3>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre className="text-green-400">
{`{
  "id": "event_001",
  "timestamp": 15,
  "round": 1,
  "eventType": "punch",
  "fighter": "fighter_a",
  "details": {
    "punchType": "jab",
    "punchLocation": "head",
    "damageLevel": "light",
    "accuracy": 85,
    "power": 60,
    "commentary": "Usyk establishes his jab early..."
  },
  "crowdReaction": "cheer",
  "significance": "routine"
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CommentaryEngine; 