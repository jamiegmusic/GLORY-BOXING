import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Celebrity, 
  CelebrityIndustryValue, 
  celebrityManagementEngine,
  REAL_CELEBRITIES,
  getCelebritiesByIndustry,
  getTopCelebrities,
  getCelebritiesByNetWorth
} from '@/lib/unified-types';
import { 
  getCelebrityTemplates,
  getCelebrityTemplate,
  getDefaultCelebrityStats,
  getDefaultPersonalityTraits,
  getDefaultActingSkills,
  getDefaultMusicSkills,
  getDefaultSportsSkills,
  getDefaultSocialMediaSkills,
  getDefaultBusinessSkills
} from '@/lib/celebrity-data';

const RealCelebrityDemo: React.FC = () => {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<CelebrityIndustryValue>('acting');
  const [minNetWorth, setMinNetWorth] = useState<number>(100000000);
  const [showTemplates, setShowTemplates] = useState(false);

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

  const loadCelebritiesByIndustry = (industry: CelebrityIndustryValue) => {
    const industryCelebrities = celebrityManagementEngine.getCelebritiesByIndustry(industry);
    setCelebrities(industryCelebrities);
    setSelectedIndustry(industry);
  };

  const loadTopCelebrities = (limit: number = 10) => {
    const topCelebrities = celebrityManagementEngine.getTopCelebrities(limit);
    setCelebrities(topCelebrities);
  };

  const loadCelebritiesByNetWorth = (minWorth: number) => {
    const wealthyCelebrities = celebrityManagementEngine.getCelebritiesByNetWorth(minWorth);
    setCelebrities(wealthyCelebrities);
    setMinNetWorth(minWorth);
  };

  const createCelebrityFromTemplate = (templateName: string) => {
    const celebrity = celebrityManagementEngine.createCelebrityFromTemplate(templateName);
    if (celebrity) {
      setCelebrities(prev => [...prev, celebrity]);
      setSelectedCelebrity(celebrity);
    }
  };

  const getIndustryColor = (industry: CelebrityIndustryValue) => {
    const colors = {
      acting: 'bg-blue-500',
      music: 'bg-purple-500',
      sports: 'bg-green-500',
      social_media: 'bg-pink-500',
      business: 'bg-orange-500',
      modeling: 'bg-yellow-500',
      comedy: 'bg-red-500',
      reality_tv: 'bg-indigo-500',
      fashion: 'bg-teal-500',
      technology: 'bg-gray-500'
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

  const getSkillDisplay = (celebrity: Celebrity) => {
    const skills = [];
    if (celebrity.acting_skills) skills.push('Acting');
    if (celebrity.music_skills) skills.push('Music');
    if (celebrity.sports_skills) skills.push('Sports');
    if (celebrity.social_media_skills) skills.push('Social Media');
    if (celebrity.business_skills) skills.push('Business');
    return skills.join(', ');
  };

  const getTopSkill = (celebrity: Celebrity) => {
    const skills = [];
    if (celebrity.acting_skills) {
      const avgActing = Object.values(celebrity.acting_skills).reduce((a, b) => a + b, 0) / 10;
      skills.push({ name: 'Acting', value: avgActing });
    }
    if (celebrity.music_skills) {
      const avgMusic = Object.values(celebrity.music_skills).reduce((a, b) => a + b, 0) / 10;
      skills.push({ name: 'Music', value: avgMusic });
    }
    if (celebrity.sports_skills) {
      const avgSports = Object.values(celebrity.sports_skills).reduce((a, b) => a + b, 0) / 10;
      skills.push({ name: 'Sports', value: avgSports });
    }
    if (celebrity.social_media_skills) {
      const avgSocial = Object.values(celebrity.social_media_skills).reduce((a, b) => a + b, 0) / 10;
      skills.push({ name: 'Social Media', value: avgSocial });
    }
    if (celebrity.business_skills) {
      const avgBusiness = Object.values(celebrity.business_skills).reduce((a, b) => a + b, 0) / 10;
      skills.push({ name: 'Business', value: avgBusiness });
    }
    
    return skills.sort((a, b) => b.value - a.value)[0];
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🌟 Real Celebrity Management Demo</h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage real celebrities across multiple industries with authentic stats and career paths
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Filter by Industry</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedIndustry} onChange={(e) => loadCelebritiesByIndustry(e.target.value as CelebrityIndustryValue)}>
              <option value="acting">Acting</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="social_media">Social Media</option>
              <option value="business">Business</option>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Top Celebrities</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => loadTopCelebrities(10)} className="w-full">
              Load Top 10
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Net Worth Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={minNetWorth.toString()} onChange={(e) => loadCelebritiesByNetWorth(parseInt(e.target.value))}>
              <option value="100000000">$100M+</option>
              <option value="500000000">$500M+</option>
              <option value="1000000000">$1B+</option>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowTemplates(!showTemplates)} className="w-full">
              {showTemplates ? 'Hide' : 'Show'} Templates
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Template Selection */}
      {showTemplates && (
        <Card>
          <CardHeader>
            <CardTitle>Celebrity Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {REAL_CELEBRITIES.map((celebrity) => (
                <Button
                  key={celebrity.name}
                  variant="outline"
                  size="sm"
                  onClick={() => createCelebrityFromTemplate(celebrity.name)}
                  className="text-xs"
                >
                  {celebrity.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Celebrity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {celebrities.map((celebrity) => (
          <Card 
            key={celebrity.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCelebrity?.id === celebrity.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedCelebrity(celebrity)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{celebrity.name}</CardTitle>
                <Badge className={getIndustryColor(celebrity.primary_industry)}>
                  {celebrity.primary_industry}
                </Badge>
              </div>
              {celebrity.nickname && (
                <p className="text-sm text-gray-600">"{celebrity.nickname}"</p>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Age: {celebrity.age}</span>
                <span>Net Worth: {formatNetWorth(celebrity.net_worth || 0)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Popularity</span>
                  <span>{celebrity.popularity}%</span>
                </div>
                <Progress value={celebrity.popularity} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Experience</span>
                  <span>{celebrity.experience} years</span>
                </div>
                <Progress value={Math.min(celebrity.experience || 0, 100)} className="h-2" />
              </div>

              <div className="text-xs text-gray-600">
                <p>Skills: {getSkillDisplay(celebrity)}</p>
                <p>Fan Base: {celebrity.fan_base_size?.toLocaleString() || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Celebrity Details */}
      {selectedCelebrity && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">{selectedCelebrity.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getIndustryColor(selectedCelebrity.primary_industry)}>
                {selectedCelebrity.primary_industry}
              </Badge>
              {selectedCelebrity.secondary_industries?.map((industry) => (
                <Badge key={industry} variant="outline">
                  {industry}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="career">Career</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedCelebrity.age}</p>
                    <p className="text-sm text-gray-600">Age</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatNetWorth(selectedCelebrity.net_worth || 0)}</p>
                    <p className="text-sm text-gray-600">Net Worth</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedCelebrity.popularity}%</p>
                    <p className="text-sm text-gray-600">Popularity</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedCelebrity.experience}</p>
                    <p className="text-sm text-gray-600">Experience</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p><strong>Nationality:</strong> {selectedCelebrity.nationality}</p>
                  <p><strong>Hometown:</strong> {selectedCelebrity.hometown}</p>
                  <p><strong>Fan Base:</strong> {selectedCelebrity.fan_base_size?.toLocaleString() || 0}</p>
                  <p><strong>Media Sentiment:</strong> {selectedCelebrity.media_sentiment}</p>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                {selectedCelebrity.acting_skills && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Acting Skills</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedCelebrity.acting_skills).map(([skill, value]) => (
                        <div key={skill} className="flex justify-between">
                          <span className="text-sm capitalize">{skill.replace('_', ' ')}</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCelebrity.music_skills && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Music Skills</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedCelebrity.music_skills).map(([skill, value]) => (
                        <div key={skill} className="flex justify-between">
                          <span className="text-sm capitalize">{skill.replace('_', ' ')}</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCelebrity.sports_skills && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Sports Skills</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedCelebrity.sports_skills).map(([skill, value]) => (
                        <div key={skill} className="flex justify-between">
                          <span className="text-sm capitalize">{skill.replace('_', ' ')}</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCelebrity.social_media_skills && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Social Media Skills</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedCelebrity.social_media_skills).map(([skill, value]) => (
                        <div key={skill} className="flex justify-between">
                          <span className="text-sm capitalize">{skill.replace('_', ' ')}</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCelebrity.business_skills && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Business Skills</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedCelebrity.business_skills).map(([skill, value]) => (
                        <div key={skill} className="flex justify-between">
                          <span className="text-sm capitalize">{skill.replace('_', ' ')}</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="career" className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Primary Industry:</strong> {selectedCelebrity.primary_industry}</p>
                  <p><strong>Secondary Industries:</strong> {selectedCelebrity.secondary_industries?.join(', ')}</p>
                  <p><strong>Debut Date:</strong> {selectedCelebrity.debut_date?.toLocaleDateString()}</p>
                  <p><strong>Ranking:</strong> #{selectedCelebrity.ranking}</p>
                  <p><strong>Industry Ranking:</strong> #{selectedCelebrity.industry_ranking}</p>
                </div>

                {selectedCelebrity.personality_traits && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Personality Traits</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedCelebrity.personality_traits).map(([trait, value]) => (
                        <div key={trait} className="flex justify-between">
                          <span className="text-sm capitalize">{trait.replace('_', ' ')}</span>
                          <span className="text-sm font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedCelebrity.physical_health}%</p>
                    <p className="text-sm text-gray-600">Physical Health</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedCelebrity.mental_health}%</p>
                    <p className="text-sm text-gray-600">Mental Health</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedCelebrity.energy_level}%</p>
                    <p className="text-sm text-gray-600">Energy Level</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedCelebrity.stress_level}%</p>
                    <p className="text-sm text-gray-600">Stress Level</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Public Image</span>
                    <span>{selectedCelebrity.public_image}%</span>
                  </div>
                  <Progress value={selectedCelebrity.public_image} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Fan Base Size</span>
                    <span>{selectedCelebrity.fan_base_size?.toLocaleString() || 0}</span>
                  </div>
                  <Progress value={Math.min((selectedCelebrity.fan_base_size || 0) / 1000000, 100)} className="h-2" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RealCelebrityDemo; 