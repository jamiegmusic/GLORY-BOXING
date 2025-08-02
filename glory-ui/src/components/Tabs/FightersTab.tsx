import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_FIGHTER } from '../../graphql/mutations';
import { apiClient } from '../../lib/api-client';
import { useFighters } from '../../hooks/useApi';
import { User, Plus, Camera, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

const FightersTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [isGeneratingMugshot, setIsGeneratingMugshot] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    weight_class: '',
    record: '',
    nationality: '',
    age: 25,
    mugshot_url: ''
  });

  // Use REST API for now since GraphQL has compatibility issues
  const { fighters, loading, error } = useFighters();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.createFighter(formData);
      
      // Reset form
      setFormData({
        name: '',
        weight_class: '',
        record: '',
        nationality: '',
        age: 25,
        mugshot_url: ''
      });
      setShowForm(false);
      
      alert('Fighter created successfully!');
    } catch (error) {
      console.error('Failed to create fighter:', error);
      alert('Failed to create fighter. Please try again.');
    }
  };

  const generateMugshot = async () => {
    if (!formData.name) {
      alert('Please enter a fighter name first');
      return;
    }

    setIsGeneratingMugshot(true);
    try {
      // Simulate AI mugshot generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a placeholder URL (in real implementation, this would call an AI service)
      const mugshotUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name.toLowerCase().replace(/\s+/g, '')}`;
      
      setFormData({ ...formData, mugshot_url: mugshotUrl });
      alert('Mugshot generated successfully!');
    } catch (error) {
      console.error('Failed to generate mugshot:', error);
      alert('Failed to generate mugshot. Please try again.');
    } finally {
      setIsGeneratingMugshot(false);
    }
  };

  const generateRandomFighter = () => {
    const names = ['Tyson Fury', 'Anthony Joshua', 'Oleksandr Usyk', 'Deontay Wilder', 'Andy Ruiz Jr'];
    const weightClasses = ['Heavyweight', 'Light Heavyweight', 'Cruiserweight', 'Light Heavyweight'];
    const nationalities = ['UK', 'USA', 'Ukraine', 'Mexico', 'Canada'];
    const records = ['33-0-1', '26-3-0', '21-0-0', '43-2-1', '35-2-0'];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomWeightClass = weightClasses[Math.floor(Math.random() * weightClasses.length)];
    const randomNationality = nationalities[Math.floor(Math.random() * nationalities.length)];
    const randomRecord = records[Math.floor(Math.random() * records.length)];
    const randomAge = Math.floor(Math.random() * 15) + 25; // 25-40 years old
    
    setFormData({
      name: randomName,
      weight_class: randomWeightClass,
      record: randomRecord,
      nationality: randomNationality,
      age: randomAge,
      mugshot_url: ''
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-2 mb-6">
          <User className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold">Fighters</h2>
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
          <User className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold">Fighters</h2>
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <User className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold">Fighters</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Create Fighter</span>
        </button>
      </div>

      {/* Create Fighter Form */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-xl border border-gray-700 animate-slide-in">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Create New Fighter</span>
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 transition duration-200"
                  placeholder="e.g., Tyson Fury"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Weight Class</label>
                <select
                  value={formData.weight_class}
                  onChange={(e) => setFormData({...formData, weight_class: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 transition duration-200"
                  required
                >
                  <option value="">Select Weight Class</option>
                  <option value="Heavyweight">Heavyweight</option>
                  <option value="Light Heavyweight">Light Heavyweight</option>
                  <option value="Middleweight">Middleweight</option>
                  <option value="Welterweight">Welterweight</option>
                  <option value="Lightweight">Lightweight</option>
                  <option value="Featherweight">Featherweight</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Record</label>
                <input
                  type="text"
                  value={formData.record}
                  onChange={(e) => setFormData({...formData, record: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 transition duration-200"
                  placeholder="e.g., 33-0-1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nationality</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 transition duration-200"
                  placeholder="e.g., UK"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 transition duration-200"
                  min="18"
                  max="50"
                  required
                />
              </div>
            </div>

            {/* Mugshot Section */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Fighter Mugshot</span>
                </h4>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={generateMugshot}
                    disabled={isGeneratingMugshot || !formData.name}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition duration-300 flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isGeneratingMugshot ? 'Generating...' : 'AI Generate'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={generateRandomFighter}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition duration-300 flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Random Fighter</span>
                  </button>
                </div>
              </div>
              
              {formData.mugshot_url && (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Mugshot generated successfully!</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition duration-300 shadow-lg hover:shadow-xl"
              >
                Create Fighter
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

      {/* Fighters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fighters.map((fighter) => (
          <div 
            key={fighter.id} 
            className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-700"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {fighter.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-semibold text-white text-lg">{fighter.name}</h4>
                <p className="text-gray-300 text-sm">{fighter.weight_class}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Record:</span>
                <span className="text-white font-medium">{`${fighter.record_wins}-${fighter.record_losses}-${fighter.record_draws}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Nationality:</span>
                <span className="text-white">{fighter.nationality || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Age:</span>
                <span className="text-white">{fighter.age || 'N/A'}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition duration-300">
                  View Profile
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition duration-300">
                  Schedule Fight
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {fighters.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No fighters found. Create your first fighter to get started!</p>
        </div>
      )}
    </div>
  );
};

export default FightersTab; 