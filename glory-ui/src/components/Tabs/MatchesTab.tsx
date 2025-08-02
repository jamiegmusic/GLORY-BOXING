import React, { useState } from 'react';
import { Play, Eye, MessageSquare, Trophy, AlertCircle, Plus } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MATCHES, SCHEDULE_MATCH } from '../../graphql/queries';
import { apiClient } from '../../lib/api-client';
import { useMatches } from '../../hooks/useApi';
import CommentaryPanel from '../CommentaryPanel';

const MatchesTab = () => {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [commentaryData, setCommentaryData] = useState<any>(null);
  const [isGeneratingCommentary, setIsGeneratingCommentary] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  
  // Form state for scheduling matches
  const [scheduleForm, setScheduleForm] = useState({
    fighterAId: 1,
    fighterBId: 2,
    venue: '',
    date: ''
  });

  // Use REST API for now since GraphQL has compatibility issues
  const { matches, loading, error } = useMatches();

  const handleGenerateCommentary = async (match: any) => {
    setIsGeneratingCommentary(true);
    try {
      // Simulate API call to generate commentary
      const response = await fetch('/api/commentary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schema: match,
          style: 'neutral',
          focus: 'balanced'
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

  const handleScheduleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createMatch({
        fighter_a_id: scheduleForm.fighterAId,
        fighter_b_id: scheduleForm.fighterBId,
        venue: scheduleForm.venue,
        date: scheduleForm.date
      });
      
      // Reset form and hide
      setScheduleForm({ fighterAId: 1, fighterBId: 2, venue: '', date: '' });
      setShowScheduleForm(false);
      
      // Refresh matches
      window.location.reload();
    } catch (error) {
      console.error('Failed to schedule match:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <Play className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold">Match Results</h2>
        </div>
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <Play className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold">Match Results</h2>
        </div>
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error loading matches</span>
          </div>
          <p className="text-red-300 mt-2">{error}</p>
          <p className="text-red-300 text-sm mt-2">
            Make sure the REST API backend is running on http://localhost:8000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Play className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold">Match Results</h2>
        </div>
        <button
          onClick={() => setShowScheduleForm(!showScheduleForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Match</span>
        </button>
      </div>

      {/* Schedule Match Form */}
      {showScheduleForm && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Schedule New Match</h3>
          <form onSubmit={handleScheduleMatch} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fighter A ID</label>
                <input
                  type="number"
                  value={scheduleForm.fighterAId}
                  onChange={(e) => setScheduleForm({...scheduleForm, fighterAId: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fighter B ID</label>
                <input
                  type="number"
                  value={scheduleForm.fighterBId}
                  onChange={(e) => setScheduleForm({...scheduleForm, fighterBId: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  min="1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Venue</label>
              <input
                type="text"
                value={scheduleForm.venue}
                onChange={(e) => setScheduleForm({...scheduleForm, venue: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                placeholder="e.g., O2 Arena"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={scheduleForm.date}
                onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Schedule Match
              </button>
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Match List */}
      <div className="grid gap-4">
        {matches.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400">No matches found. Schedule some matches to see them here.</p>
          </div>
        ) : (
          matches.map((match) => (
            <div key={match.id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {match.fighter_a.name} vs {match.fighter_b.name}
                  </h3>
                  {match.result ? (
                    <p className="text-green-400 font-medium mt-1">{match.result}</p>
                  ) : (
                    <p className="text-yellow-400 font-medium mt-1">Scheduled</p>
                  )}
                  <p className="text-gray-400 text-sm mt-1">{match.date} • {match.venue}</p>
                  <div className="mt-2 flex space-x-2">
                    <span className="bg-blue-600 text-blue-100 px-2 py-1 rounded text-xs font-medium">
                      {match.fighter_a.weight_class}
                    </span>
                    <span className="bg-gray-600 text-gray-100 px-2 py-1 rounded text-xs font-medium">
                      {match.fighter_a.record} vs {match.fighter_b.record}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{selectedMatch === match.id ? 'Hide' : 'View'} Details</span>
                </button>
              </div>

              {/* Expanded Match Details */}
              {selectedMatch === match.id && (
                <div className="mt-4 space-y-4 border-t border-gray-700 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-blue-400">{match.fighter_a.name}</h4>
                      <p className="text-sm text-gray-300">Weight Class: {match.fighter_a.weight_class}</p>
                      <p className="text-sm text-gray-300">Record: {match.fighter_a.record}</p>
                      {match.fighter_a.nationality && (
                        <p className="text-sm text-gray-300">Nationality: {match.fighter_a.nationality}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-red-400">{match.fighter_b.name}</h4>
                      <p className="text-sm text-gray-300">Weight Class: {match.fighter_b.weight_class}</p>
                      <p className="text-sm text-gray-300">Record: {match.fighter_b.record}</p>
                      {match.fighter_b.nationality && (
                        <p className="text-sm text-gray-300">Nationality: {match.fighter_b.nationality}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition duration-300">
                      View Press Conference
                    </button>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition duration-300">
                      Update Rankings
                    </button>
                    <button 
                      onClick={() => handleGenerateCommentary(match)}
                      disabled={isGeneratingCommentary}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition duration-300"
                    >
                      {isGeneratingCommentary ? 'Generating...' : 'AI Commentary'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Commentary Panel */}
      {commentaryData && (
        <CommentaryPanel
          matchData={matches[0]}
          commentary={commentaryData.commentary}
          highlights={commentaryData.highlights}
          roundByRound={commentaryData.roundByRound}
          analysis={commentaryData.analysis}
          rating={commentaryData.rating}
          onGenerateCommentary={() => handleGenerateCommentary(matches[0])}
        />
      )}

      {/* Simulate All Matches Button */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Batch Operations</h3>
            <p className="text-gray-400 text-sm">Simulate all upcoming matches at once</p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition duration-300">
            Simulate All Matches
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchesTab; 