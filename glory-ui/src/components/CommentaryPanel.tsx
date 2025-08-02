import React, { useState, useEffect } from 'react';
import { Mic, Play, Pause, Volume2, Star, Clock, MessageSquare } from 'lucide-react';

interface CommentaryPanelProps {
  matchData: any;
  commentary?: string;
  highlights?: string[];
  roundByRound?: string[];
  analysis?: string;
  rating?: number;
  onGenerateCommentary?: () => void;
}

const CommentaryPanel: React.FC<CommentaryPanelProps> = ({
  matchData,
  commentary,
  highlights = [],
  roundByRound = [],
  analysis,
  rating = 0,
  onGenerateCommentary
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [showFullCommentary, setShowFullCommentary] = useState(false);

  const handleGenerateCommentary = async () => {
    if (onGenerateCommentary) {
      onGenerateCommentary();
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mic className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold">Fight Commentary</h3>
        </div>
        <div className="flex items-center space-x-2">
          {rating > 0 && (
            <div className="flex items-center space-x-1">
              {renderStars(rating)}
              <span className="text-sm text-gray-400">({rating}/5)</span>
            </div>
          )}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition duration-300"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!commentary ? (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No commentary generated yet</p>
          <button
            onClick={handleGenerateCommentary}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition duration-300"
          >
            Generate AI Commentary
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Full Commentary */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold flex items-center space-x-2">
                <Volume2 className="w-4 h-4" />
                <span>Full Commentary</span>
              </h4>
              <button
                onClick={() => setShowFullCommentary(!showFullCommentary)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                {showFullCommentary ? 'Show Less' : 'Show More'}
              </button>
            </div>
            <div className={`text-gray-300 leading-relaxed ${showFullCommentary ? '' : 'max-h-32 overflow-hidden'}`}>
              {commentary}
            </div>
          </div>

          {/* Round by Round */}
          {roundByRound.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Round by Round</span>
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {roundByRound.map((round, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-3">
                    <p className="text-sm text-gray-300">{round}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis */}
          {analysis && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Fight Analysis</h4>
              <p className="text-gray-300 leading-relaxed">{analysis}</p>
            </div>
          )}

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Key Highlights</h4>
              <div className="space-y-2">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-300 text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fight Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">{matchData?.rounds || 0}</p>
              <p className="text-xs text-gray-400">Rounds</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-400">
                {matchData?.events?.filter((e: any) => e.action === 'knockdown').length || 0}
              </p>
              <p className="text-xs text-gray-400">Knockdowns</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-400">
                {matchData?.events?.filter((e: any) => e.combo).length || 0}
              </p>
              <p className="text-xs text-gray-400">Combos</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {matchData?.result?.method?.toUpperCase() || 'DEC'}
              </p>
              <p className="text-xs text-gray-400">Result</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentaryPanel; 