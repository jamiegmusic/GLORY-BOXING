import React, { useState } from 'react';
import { Calendar, Users, MapPin, Clock, Plus, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_FIGHTERS } from '../../graphql/queries';
import { SCHEDULE_MATCH } from '../../graphql/mutations';
import { apiClient } from '../../lib/api-client';
import { useFighters } from '../../hooks/useApi';

const ScheduleTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fighterAId: 1,
    fighterBId: 2,
    venue: '',
    date: '',
    time: ''
  });

  // Use REST API for now since GraphQL has compatibility issues
  const { fighters, loading, error } = useFighters();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createMatch({
        fighter_a_id: formData.fighterAId,
        fighter_b_id: formData.fighterBId,
        venue: formData.venue,
        date: formData.date
      });
      
      // Reset form
      setFormData({ fighterAId: 1, fighterBId: 2, venue: '', date: '', time: '' });
      setShowForm(false);
      
      alert('Match scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule match:', error);
      alert('Failed to schedule match. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">Schedule Matches</h2>
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
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">Schedule Matches</h2>
        </div>
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Error loading fighters</span>
          </div>
          <p className="text-red-300 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">Schedule Matches</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Match</span>
        </button>
      </div>

      {/* Available Fighters */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Available Fighters</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fighters.map((fighter) => (
            <div key={fighter.id} className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white">{fighter.name}</h4>
              <p className="text-gray-300 text-sm">{fighter.weight_class}</p>
              <p className="text-gray-400 text-sm">Record: {fighter.record}</p>
              {fighter.nationality && (
                <p className="text-gray-400 text-sm">Nationality: {fighter.nationality}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Schedule New Match</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fighter A</label>
                <select
                  value={formData.fighterAId}
                  onChange={(e) => setFormData({...formData, fighterAId: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                >
                  {fighters.map((fighter) => (
                    <option key={fighter.id} value={fighter.id}>
                      {fighter.name} ({fighter.weight_class})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fighter B</label>
                <select
                  value={formData.fighterBId}
                  onChange={(e) => setFormData({...formData, fighterBId: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                >
                  {fighters.map((fighter) => (
                    <option key={fighter.id} value={fighter.id}>
                      {fighter.name} ({fighter.weight_class})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Venue</span>
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  placeholder="e.g., O2 Arena, London"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Time</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-300"
              >
                Schedule Match
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

      {/* Upcoming Events */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-white">Boxing Night at O2 Arena</h4>
                <p className="text-gray-300 text-sm">December 25, 2024 • 8:00 PM</p>
                <p className="text-gray-400 text-sm">London, UK</p>
              </div>
              <span className="bg-blue-600 text-blue-100 px-2 py-1 rounded text-xs font-medium">
                Main Event
              </span>
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-white">Championship Fight</h4>
                <p className="text-gray-300 text-sm">January 15, 2025 • 9:00 PM</p>
                <p className="text-gray-400 text-sm">Madison Square Garden, NYC</p>
              </div>
              <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs font-medium">
                Title Fight
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTab; 