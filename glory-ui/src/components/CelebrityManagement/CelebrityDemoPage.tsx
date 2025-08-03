import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Star,
  TrendingUp,
  Award,
  Briefcase
} from 'lucide-react';
import { celebrityManagementEngine } from '../../lib/celebrity-management-engine';
import type { Celebrity, CelebrityIndustryValue } from '../../lib/unified-types';
import MultiIndustryCareerPanel from './MultiIndustryCareerPanel';

const CelebrityDemoPage: React.FC = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState<CelebrityIndustryValue | 'all'>('all');
  const [showCreateCelebrity, setShowCreateCelebrity] = useState(false);

  useEffect(() => {
    createSampleCelebrities();
  }, []);

  const createSampleCelebrities = () => {
    // Create sample celebrities for demonstration
    const sampleCelebrities = [
      {
        name: 'Alex Rivera',
        age: 28,
        nationality: 'American',
        primary_industry: 'acting' as CelebrityIndustryValue,
        secondary_industries: ['social_media', 'modeling'] as CelebrityIndustryValue[],
        acting_skills: {
          dramatic_acting: 85,
          comedic_acting: 70,
          method_acting: 75,
          voice_acting: 60,
          stage_presence: 80,
          emotional_range: 90,
          accent_work: 65,
          improvisation: 75,
          chemistry_with_co_stars: 85,
          audition_skills: 80
        },
        popularity: 75,
        experience: 1200,
        net_worth: 2500000,
        physical_health: 95,
        mental_health: 88,
        stress_level: 15,
        energy_level: 85,
        public_image: 82,
        fan_base_size: 2500000,
        media_sentiment: 'positive' as const
      },
      {
        name: 'Maya Chen',
        age: 24,
        nationality: 'Canadian',
        primary_industry: 'music' as CelebrityIndustryValue,
        secondary_industries: ['acting', 'social_media'] as CelebrityIndustryValue[],
        music_skills: {
          vocal_ability: 90,
          instrumental_skill: 75,
          songwriting: 85,
          stage_performance: 88,
          studio_recording: 80,
          musical_theory: 70,
          genre_versatility: 85,
          live_performance: 92,
          collaboration: 80,
          music_production: 65
        },
        popularity: 65,
        experience: 800,
        net_worth: 1800000,
        physical_health: 92,
        mental_health: 85,
        stress_level: 25,
        energy_level: 90,
        public_image: 78,
        fan_base_size: 1800000,
        media_sentiment: 'positive' as const
      },
      {
        name: 'Jordan Williams',
        age: 26,
        nationality: 'British',
        primary_industry: 'sports' as CelebrityIndustryValue,
        secondary_industries: ['business', 'social_media'] as CelebrityIndustryValue[],
        sports_skills: {
          athletic_ability: 95,
          technical_skill: 88,
          mental_toughness: 90,
          teamwork: 85,
          leadership: 80,
          strategic_thinking: 75,
          physical_endurance: 92,
          competitive_spirit: 95,
          injury_recovery: 85,
          peak_performance: 90
        },
        popularity: 85,
        experience: 1500,
        net_worth: 3500000,
        physical_health: 98,
        mental_health: 90,
        stress_level: 10,
        energy_level: 95,
        public_image: 88,
        fan_base_size: 3200000,
        media_sentiment: 'positive' as const
      },
      {
        name: 'Zara Patel',
        age: 22,
        nationality: 'Indian',
        primary_industry: 'social_media' as CelebrityIndustryValue,
        secondary_industries: ['modeling', 'business'] as CelebrityIndustryValue[],
        social_media_skills: {
          content_creation: 95,
          audience_engagement: 90,
          trend_awareness: 88,
          platform_mastery: 92,
          viral_potential: 85,
          brand_voice: 80,
          community_building: 88,
          crisis_management: 75,
          monetization: 85,
          authenticity: 90
        },
        popularity: 95,
        experience: 600,
        net_worth: 1200000,
        physical_health: 88,
        mental_health: 82,
        stress_level: 35,
        energy_level: 85,
        public_image: 90,
        fan_base_size: 8500000,
        media_sentiment: 'positive' as const
      },
      {
        name: 'Marcus Johnson',
        age: 35,
        nationality: 'American',
        primary_industry: 'business' as CelebrityIndustryValue,
        secondary_industries: ['technology', 'social_media'] as CelebrityIndustryValue[],
        business_skills: {
          entrepreneurship: 90,
          investment_acumen: 85,
          negotiation: 88,
          strategic_planning: 92,
          brand_management: 85,
          financial_literacy: 90,
          market_analysis: 88,
          networking: 85,
          risk_management: 80,
          innovation: 85
        },
        popularity: 70,
        experience: 2000,
        net_worth: 15000000,
        physical_health: 85,
        mental_health: 88,
        stress_level: 20,
        energy_level: 80,
        public_image: 85,
        fan_base_size: 1200000,
        media_sentiment: 'positive' as const
      }
    ];

    const createdCelebrities = sampleCelebrities.map(celebrity => 
      celebrityManagementEngine.createCelebrity(celebrity)
    );

    setCelebrities(createdCelebrities);
    if (createdCelebrities.length > 0) {
      setSelectedCelebrity(createdCelebrities[0]);
    }
  };

  const handleCelebrityUpdate = (updatedCelebrity: Celebrity) => {
    setCelebrities(prev => 
      prev.map(c => c.id === updatedCelebrity.id ? updatedCelebrity : c)
    );
    setSelectedCelebrity(updatedCelebrity);
  };

  const filteredCelebrities = celebrities.filter(celebrity => {
    const matchesSearch = celebrity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = filterIndustry === 'all' || celebrity.primary_industry === filterIndustry;
    return matchesSearch && matchesIndustry;
  });

  const getIndustryIcon = (industry: CelebrityIndustryValue) => {
    const icons = {
      acting: '🎬',
      music: '🎵',
      sports: '⚽',
      social_media: '📱',
      modeling: '📸',
      business: '💼',
      comedy: '🎭',
      reality_tv: '📺',
      fashion: '👗',
      technology: '💻'
    };
    return icons[industry] || '👤';
  };

  const getIndustryColor = (industry: CelebrityIndustryValue) => {
    const colors = {
      acting: 'bg-blue-100 text-blue-800',
      music: 'bg-purple-100 text-purple-800',
      sports: 'bg-green-100 text-green-800',
      social_media: 'bg-pink-100 text-pink-800',
      modeling: 'bg-yellow-100 text-yellow-800',
      business: 'bg-gray-100 text-gray-800',
      comedy: 'bg-orange-100 text-orange-800',
      reality_tv: 'bg-red-100 text-red-800',
      fashion: 'bg-indigo-100 text-indigo-800',
      technology: 'bg-cyan-100 text-cyan-800'
    };
    return colors[industry] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Celebrity Management</h1>
              <p className="text-gray-600">Multi-Industry Career Paths Demo</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{celebrities.length}</div>
                <div className="text-sm text-gray-500">Celebrities</div>
              </div>
              <button
                onClick={() => setShowCreateCelebrity(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Celebrity
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search celebrities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value as CelebrityIndustryValue | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Industries</option>
                <option value="acting">Acting</option>
                <option value="music">Music</option>
                <option value="sports">Sports</option>
                <option value="social_media">Social Media</option>
                <option value="business">Business</option>
                <option value="modeling">Modeling</option>
                <option value="comedy">Comedy</option>
                <option value="reality_tv">Reality TV</option>
                <option value="fashion">Fashion</option>
                <option value="technology">Technology</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Celebrity List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Celebrities
                </h2>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {filteredCelebrities.map(celebrity => (
                    <div
                      key={celebrity.id}
                      onClick={() => setSelectedCelebrity(celebrity)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedCelebrity?.id === celebrity.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                            {getIndustryIcon(celebrity.primary_industry)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{celebrity.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">
                              {celebrity.primary_industry.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-600">
                            £{(celebrity.net_worth || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Net Worth</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            {celebrity.popularity || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-blue-500" />
                            {celebrity.experience || 0}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIndustryColor(celebrity.primary_industry)}`}>
                          {celebrity.primary_industry.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredCelebrities.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No celebrities found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Career Management Panel */}
          <div className="lg:col-span-2">
            {selectedCelebrity ? (
              <MultiIndustryCareerPanel
                celebrity={selectedCelebrity}
                onCelebrityUpdate={handleCelebrityUpdate}
              />
            ) : (
              <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">Select a Celebrity</h3>
                <p className="text-gray-500">Choose a celebrity from the list to manage their career</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Net Worth</p>
                <p className="text-2xl font-bold text-green-600">
                  £{celebrities.reduce((sum, c) => sum + (c.net_worth || 0), 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Popularity</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(celebrities.reduce((sum, c) => sum + (c.popularity || 0), 0) / celebrities.length)}
                </p>
              </div>
              <Star className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Experience</p>
                <p className="text-2xl font-bold text-purple-600">
                  {celebrities.reduce((sum, c) => sum + (c.experience || 0), 0).toLocaleString()}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-orange-600">
                  {celebrities.reduce((sum, c) => sum + celebrityManagementEngine.getCelebrityProjects(c.id).length, 0)}
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CelebrityDemoPage; 