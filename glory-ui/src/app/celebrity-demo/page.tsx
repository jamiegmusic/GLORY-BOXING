'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Celebrity, 
  CelebrityIndustryValue, 
  celebrityManagementEngine,
  REAL_CELEBRITIES
} from '@/lib/unified-types';

const CelebrityDemoPage: React.FC = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null);

  useEffect(() => {
    loadRealCelebrities();
  }, []);

  const loadRealCelebrities = () => {
    const loadedCelebrities = celebrityManagementEngine.loadRealCelebrities();
    setCelebrities(loadedCelebrities);
    if (loadedCelebrities.length > 0) {
      setSelectedCelebrity(loadedCelebrities[0]);
    }
  };

  const getIndustryColor = (industry: CelebrityIndustryValue) => {
    const colors = {
      acting: 'bg-blue-500',
      music: 'bg-purple-500',
      sports: 'bg-green-500',
      social_media: 'bg-pink-500',
      business: 'bg-orange-500'
    };
    return colors[industry] || 'bg-gray-500';
  };

  const formatNetWorth = (netWorth: number) => {
    if (netWorth >= 1000000000) {
      return `$${(netWorth / 1000000000).toFixed(1)}B`;
    } else if (netWorth >= 1000000) {
      return `$${(netWorth / 1000000).toFixed(1)}M`;
    } else if (netWorth >= 1000) {
      return `$${(netWorth / 1000).toFixed(1)}K`;
    }
    return `$${netWorth}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🌟 Real Celebrity Management Game
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Manage real celebrities across multiple industries with authentic stats and career paths
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{celebrities.length}</p>
                <p className="text-sm text-gray-400">Total Celebrities</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">5</p>
                <p className="text-sm text-gray-400">Industries</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">$200B+</p>
                <p className="text-sm text-gray-400">Total Net Worth</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-400">98%</p>
                <p className="text-sm text-gray-400">Max Popularity</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Celebrity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {celebrities.map((celebrity) => (
            <Card 
              key={celebrity.id} 
              className={`cursor-pointer transition-all hover:shadow-2xl hover:scale-105 ${
                selectedCelebrity?.id === celebrity.id ? 'ring-2 ring-blue-500 bg-gray-800' : 'bg-gray-800 border-gray-700'
              }`}
              onClick={() => setSelectedCelebrity(celebrity)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white">{celebrity.name}</CardTitle>
                  <Badge className={getIndustryColor(celebrity.primary_industry)}>
                    {celebrity.primary_industry}
                  </Badge>
                </div>
                {celebrity.nickname && (
                  <p className="text-sm text-gray-400">"{celebrity.nickname}"</p>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Age: {celebrity.age}</span>
                  <span className="text-gray-400">Net Worth: {formatNetWorth(celebrity.net_worth || 0)}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Popularity</span>
                    <span className="text-white">{celebrity.popularity}%</span>
                  </div>
                  <Progress value={celebrity.popularity} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Experience</span>
                    <span className="text-white">{celebrity.experience} years</span>
                  </div>
                  <Progress value={Math.min(celebrity.experience || 0, 100)} className="h-2" />
                </div>

                <div className="text-xs text-gray-400">
                  <p>Fan Base: {celebrity.fan_base_size?.toLocaleString() || 0}</p>
                  <p>Media Sentiment: {celebrity.media_sentiment}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Celebrity Details */}
        {selectedCelebrity && (
          <Card className="bg-gray-800 border-gray-700 mt-8">
            <CardHeader>
              <CardTitle className="text-3xl text-white">{selectedCelebrity.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={getIndustryColor(selectedCelebrity.primary_industry)}>
                  {selectedCelebrity.primary_industry}
                </Badge>
                {selectedCelebrity.secondary_industries?.map((industry) => (
                  <Badge key={industry} variant="outline" className="border-gray-600 text-gray-300">
                    {industry}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{selectedCelebrity.age}</p>
                  <p className="text-sm text-gray-400">Age</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{formatNetWorth(selectedCelebrity.net_worth || 0)}</p>
                  <p className="text-sm text-gray-400">Net Worth</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">{selectedCelebrity.popularity}%</p>
                  <p className="text-sm text-gray-400">Popularity</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-pink-400">{selectedCelebrity.experience}</p>
                  <p className="text-sm text-gray-400">Experience</p>
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Nationality:</strong> {selectedCelebrity.nationality || 'Unknown'}</p>
                    <p><strong>Hometown:</strong> {selectedCelebrity.hometown || 'Unknown'}</p>
                    <p><strong>Fan Base:</strong> {selectedCelebrity.fan_base_size?.toLocaleString() || 0}</p>
                    <p><strong>Media Sentiment:</strong> {selectedCelebrity.media_sentiment}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Health & Wellness</h3>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>Physical Health:</strong> {selectedCelebrity.physical_health || 0}%</p>
                    <p><strong>Mental Health:</strong> {selectedCelebrity.mental_health || 0}%</p>
                    <p><strong>Energy Level:</strong> {selectedCelebrity.energy_level || 0}%</p>
                    <p><strong>Stress Level:</strong> {selectedCelebrity.stress_level || 0}%</p>
                  </div>
                </div>
              </div>

              {/* Skills Overview */}
              {selectedCelebrity.acting_skills && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Acting Skills</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.entries(selectedCelebrity.acting_skills).map(([skill, value]) => (
                      <div key={skill} className="text-center">
                        <p className="text-sm text-gray-400 capitalize">{skill.replace('_', ' ')}</p>
                        <p className="text-lg font-bold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCelebrity.music_skills && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Music Skills</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.entries(selectedCelebrity.music_skills).map(([skill, value]) => (
                      <div key={skill} className="text-center">
                        <p className="text-sm text-gray-400 capitalize">{skill.replace('_', ' ')}</p>
                        <p className="text-lg font-bold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCelebrity.sports_skills && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Sports Skills</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.entries(selectedCelebrity.sports_skills).map(([skill, value]) => (
                      <div key={skill} className="text-center">
                        <p className="text-sm text-gray-400 capitalize">{skill.replace('_', ' ')}</p>
                        <p className="text-lg font-bold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCelebrity.social_media_skills && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Social Media Skills</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.entries(selectedCelebrity.social_media_skills).map(([skill, value]) => (
                      <div key={skill} className="text-center">
                        <p className="text-sm text-gray-400 capitalize">{skill.replace('_', ' ')}</p>
                        <p className="text-lg font-bold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCelebrity.business_skills && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Business Skills</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.entries(selectedCelebrity.business_skills).map(([skill, value]) => (
                      <div key={skill} className="text-center">
                        <p className="text-sm text-gray-400 capitalize">{skill.replace('_', ' ')}</p>
                        <p className="text-lg font-bold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personality Traits */}
              {selectedCelebrity.personality_traits && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Personality Traits</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.entries(selectedCelebrity.personality_traits).map(([trait, value]) => (
                      <div key={trait} className="text-center">
                        <p className="text-sm text-gray-400 capitalize">{trait.replace('_', ' ')}</p>
                        <p className="text-lg font-bold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Game Features */}
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🎮 Game Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">🌟 Real Celebrities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Manage 15 real celebrities including Tom Hanks, Taylor Swift, LeBron James, Elon Musk, and more with authentic stats and career information.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">🏢 Multi-Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Navigate careers across 5 industries: Acting, Music, Sports, Social Media, and Business with industry-specific skills and opportunities.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">📊 Detailed Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Track popularity, net worth, skills, personality traits, health metrics, and career progression with realistic data.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CelebrityDemoPage; 