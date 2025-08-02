import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PRESS_CONFERENCE } from '../../graphql/mutations';
import { apiClient } from '../../lib/api-client';
import { useMatches } from '../../hooks/useApi';
import { Mic, MessageSquare, Send, AlertCircle, CheckCircle, Users, Calendar, Sparkles } from 'lucide-react';

const PressTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    matchId: '',
    question: '',
    reporter: 'Sports Journalist'
  });

  // Use REST API for now since GraphQL has compatibility issues
  const { matches, loading, error } = useMatches();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate press conference submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would call the API
      console.log('Press question submitted:', formData);
      
      // Reset form
      setFormData({
        matchId: '',
        question: '',
        reporter: 'Sports Journalist'
      });
      setShowForm(false);
      
      alert('Press question submitted successfully!');
    } catch (error) {
      console.error('Failed to submit press question:', error);
      alert('Failed to submit press question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateRandomQuestion = () => {
    const questions = [
      "How do you feel about your opponent's recent performance?",
      "What's your strategy for this upcoming fight?",
      "Do you think you have what it takes to win the title?",
      "How has your training camp been going?",
      "What's your prediction for the fight outcome?",
      "How do you handle the pressure of big fights?",
      "What motivates you to keep fighting at this level?",
      "How do you prepare mentally for a championship fight?"
    ];
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setFormData({ ...formData, question: randomQuestion });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-2 mb-6">
          <Mic className="w-6 h-6 text-orange-400" />
          <h2 className="text-2xl font-bold">Press Conference</h2>
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

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-2 mb-6">
          <Mic className="w-6 h-6 text-orange-400" />
          <h2 className="text-2xl font-bold">Press Conference</h2>
        </div>
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error loading matches</span>
          </div>
          <p className="text-red-300 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Mic className="w-6 h-6 text-orange-400" />
          <h2 className="text-2xl font-bold">Press Conference</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Submit Question</span>
        </button>
      </div>

      {/* Submit Press Question Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-xl border border-gray-700 animate-slide-in">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Mic className="w-5 h-5" />
            <span>Submit Press Question</span>
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Match</label>
                <select
                  value={formData.matchId}
                  onChange={(e) => setFormData({...formData, matchId: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-orange-500 transition duration-200"
                  required
                >
                  <option value="">Choose a match</option>
                  {matches.map((match) => (
                    <option key={match.id} value={match.id}>
                      {match.fighter_a.name} vs {match.fighter_b.name} - {match.venue}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Reporter</label>
                <input
                  type="text"
                  value={formData.reporter}
                  onChange={(e) => setFormData({...formData, reporter: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-orange-500 transition duration-200"
                  placeholder="e.g., Sports Journalist"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Press Question</label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-orange-500 transition duration-200 h-32 resize-none"
                placeholder="Enter your press conference question..."
                required
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={generateRandomQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Question</span>
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-md transition duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Question'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recent Press Conferences */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <MessageSquare className="w-5 h-5" />
          <span>Recent Press Conferences</span>
        </h3>
        
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-orange-500 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-orange-400" />
                <span className="font-medium text-white">Tyson Fury vs Anthony Joshua</span>
              </div>
              <span className="text-xs text-gray-400">2 hours ago</span>
            </div>
            <p className="text-gray-300 mb-3">
              "Tyson, how do you feel about facing Anthony Joshua in what many are calling the biggest British boxing match in history?"
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Reporter: Sports Journalist</span>
              <span>•</span>
              <span>O2 Arena, London</span>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-orange-500 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-orange-400" />
                <span className="font-medium text-white">Oleksandr Usyk vs Deontay Wilder</span>
              </div>
              <span className="text-xs text-gray-400">1 day ago</span>
            </div>
            <p className="text-gray-300 mb-3">
              "Deontay, what's your strategy for dealing with Usyk's technical boxing style?"
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Reporter: Boxing Insider</span>
              <span>•</span>
              <span>Madison Square Garden, NYC</span>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-orange-500 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-orange-400" />
                <span className="font-medium text-white">Andy Ruiz Jr vs Daniel Dubois</span>
              </div>
              <span className="text-xs text-gray-400">3 days ago</span>
            </div>
            <p className="text-gray-300 mb-3">
              "Andy, after your victory over Anthony Joshua, how do you maintain that level of performance?"
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Reporter: Fight News</span>
              <span>•</span>
              <span>MGM Grand, Las Vegas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Press Events */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Upcoming Press Events</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span className="font-medium text-white">Championship Press Conference</span>
            </div>
            <p className="text-gray-300 text-sm mb-2">Tyson Fury vs Anthony Joshua</p>
            <p className="text-gray-400 text-xs">Tomorrow, 2:00 PM • O2 Arena, London</p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span className="font-medium text-white">Pre-Fight Media Day</span>
            </div>
            <p className="text-gray-300 text-sm mb-2">Oleksandr Usyk vs Deontay Wilder</p>
            <p className="text-gray-400 text-xs">Friday, 1:00 PM • Madison Square Garden</p>
          </div>
        </div>
      </div>

      {matches.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No matches found. Schedule some matches to enable press conferences!</p>
        </div>
      )}
    </div>
  );
};

export default PressTab; 