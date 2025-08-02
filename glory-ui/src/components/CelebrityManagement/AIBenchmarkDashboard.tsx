import React, { useState, useEffect } from 'react';
import { 
  Play, 
  BarChart3, 
  TrendingUp, 
  Brain,
  Target,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Sparkles,
  Users,
  DollarSign,
  Award,
  MessageSquare,
  Network,
  Shield,
  Building
} from 'lucide-react';
import { 
  aiCelebrityBenchmarkRunner,
  AI_CELEBRITY_PROFILES,
  BENCHMARK_SCENARIOS,
  BENCHMARK_METRICS,
  type BenchmarkConfig,
  type BenchmarkResult,
  type AICelebrityProfile
} from '../../lib/ai-benchmark-system';
import type { Celebrity } from '../../lib/unified-types';

interface AIBenchmarkDashboardProps {
  celebrities: Celebrity[];
}

const AIBenchmarkDashboard: React.FC<AIBenchmarkDashboardProps> = ({ celebrities }) => {
  const [activeTab, setActiveTab] = useState<'run' | 'results' | 'analysis'>('run');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>(['defensive_mastermind', 'aggressive_showman']);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(['rising_star']);
  const [duration, setDuration] = useState(90); // Days
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [currentRun, setCurrentRun] = useState<BenchmarkResult[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const runBenchmark = async () => {
    setIsRunning(true);
    setProgress(0);

    const config: BenchmarkConfig = {
      profiles: selectedProfiles,
      celebrities: celebrities.slice(0, 3), // Limit to 3 celebrities for performance
      duration,
      scenarios: BENCHMARK_SCENARIOS.filter(s => selectedScenarios.includes(s.id)),
      metrics: BENCHMARK_METRICS
    };

    try {
      const benchmarkResults = await aiCelebrityBenchmarkRunner.runBenchmark(config);
      setCurrentRun(benchmarkResults);
      setResults(prev => [...benchmarkResults, ...prev]);
      setProgress(100);
    } catch (error) {
      console.error('Benchmark failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getProfileIcon = (profileId: string) => {
    switch (profileId) {
      case 'defensive_mastermind': return <Shield className="w-5 h-5 text-blue-500" />;
      case 'aggressive_showman': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'opportunistic_tactician': return <Target className="w-5 h-5 text-green-500" />;
      case 'dream_manipulator': return <Sparkles className="w-5 h-5 text-purple-500" />;
      default: return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getProfileColor = (profileId: string) => {
    switch (profileId) {
      case 'defensive_mastermind': return 'text-blue-600 bg-blue-100';
      case 'aggressive_showman': return 'text-yellow-600 bg-yellow-100';
      case 'opportunistic_tactician': return 'text-green-600 bg-green-100';
      case 'dream_manipulator': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMetricIcon = (metricName: string) => {
    switch (metricName) {
      case 'popularity_growth': return <Users className="w-4 h-4" />;
      case 'net_worth_growth': return <DollarSign className="w-4 h-4" />;
      case 'reputation_stability': return <Shield className="w-4 h-4" />;
      case 'social_media_engagement': return <MessageSquare className="w-4 h-4" />;
      case 'dream_trigger_success': return <Sparkles className="w-4 h-4" />;
      case 'career_progression': return <Award className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getAverageScore = (profileId: string) => {
    const profileResults = results.filter(r => r.profileId === profileId);
    if (profileResults.length === 0) return 0;
    return profileResults.reduce((sum, r) => sum + r.totalScore, 0) / profileResults.length;
  };

  const getProfilePerformance = (profileId: string) => {
    const profileResults = results.filter(r => r.profileId === profileId);
    if (profileResults.length === 0) return null;

    const avgMetrics = {
      dreamTriggerCount: profileResults.reduce((sum, r) => sum + r.dreamTriggerCount, 0) / profileResults.length,
      dreamTriggerSuccess: profileResults.reduce((sum, r) => sum + r.dreamTriggerSuccess, 0) / profileResults.length,
      careerProgression: profileResults.reduce((sum, r) => sum + r.careerProgression, 0) / profileResults.length,
      reputationStability: profileResults.reduce((sum, r) => sum + r.reputationStability, 0) / profileResults.length,
      financialGrowth: profileResults.reduce((sum, r) => sum + r.financialGrowth, 0) / profileResults.length,
      socialMediaEngagement: profileResults.reduce((sum, r) => sum + r.socialMediaEngagement, 0) / profileResults.length
    };

    return avgMetrics;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-900">AI Benchmark Dashboard</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {results.length} benchmark runs completed
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'run', label: 'Run Benchmark', icon: Play },
          { id: 'results', label: 'Results', icon: BarChart3 },
          { id: 'analysis', label: 'Analysis', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Run Benchmark Tab */}
      {activeTab === 'run' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Benchmark Configuration</h3>
                
                {/* AI Profiles Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI Profiles</label>
                  <div className="space-y-2">
                    {AI_CELEBRITY_PROFILES.map(profile => (
                      <label key={profile.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedProfiles.includes(profile.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProfiles(prev => [...prev, profile.id]);
                            } else {
                              setSelectedProfiles(prev => prev.filter(p => p !== profile.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <div className="flex items-center gap-2">
                          {getProfileIcon(profile.id)}
                          <span className="font-medium">{profile.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Scenarios Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scenarios</label>
                  <div className="space-y-2">
                    {BENCHMARK_SCENARIOS.map(scenario => (
                      <label key={scenario.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedScenarios.includes(scenario.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedScenarios(prev => [...prev, scenario.id]);
                            } else {
                              setSelectedScenarios(prev => prev.filter(s => s !== scenario.id));
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="font-medium">{scenario.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Simulation Duration: {duration} days
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="365"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Run Button */}
                <button
                  onClick={runBenchmark}
                  disabled={isRunning || selectedProfiles.length === 0 || selectedScenarios.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isRunning ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Running Benchmark... {progress}%
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Benchmark
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">AI Profile Details</h3>
                <div className="space-y-4">
                  {AI_CELEBRITY_PROFILES.filter(p => selectedProfiles.includes(p.id)).map(profile => (
                    <div key={profile.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {getProfileIcon(profile.id)}
                        <h4 className="font-semibold">{profile.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{profile.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Dream Logic:</span>
                          <span className="ml-1 font-medium">{profile.dreamLogicAwareness}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Era Adaptation:</span>
                          <span className="ml-1 font-medium">{profile.eraAdaptation}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Narrative Coherence:</span>
                          <span className="ml-1 font-medium">{profile.narrativeCoherence}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Social Media:</span>
                          <span className="ml-1 font-medium">{profile.characteristics.socialMediaStrategy}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {results.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Results Yet</h3>
              <p className="text-gray-500">Run a benchmark to see results here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span className="font-semibold">Total Runs</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{results.length}</div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold">Best Score</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.max(...results.map(r => r.totalScore)).toFixed(1)}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="font-semibold">Dream Triggers</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {results.reduce((sum, r) => sum + r.dreamTriggerCount, 0)}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">Success Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {((results.filter(r => r.dreamTriggerSuccess > 0).length / results.length) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Profile Performance Comparison */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Profile Performance</h3>
                <div className="space-y-4">
                  {AI_CELEBRITY_PROFILES.map(profile => {
                    const avgScore = getAverageScore(profile.id);
                    const performance = getProfilePerformance(profile.id);
                    
                    return (
                      <div key={profile.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getProfileIcon(profile.id)}
                            <h4 className="font-semibold">{profile.name}</h4>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{avgScore.toFixed(1)}</div>
                            <div className="text-sm text-gray-600">Average Score</div>
                          </div>
                        </div>
                        
                        {performance && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Dream Triggers:</span>
                              <span className="ml-1 font-medium">{performance.dreamTriggerCount.toFixed(1)}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Success Rate:</span>
                              <span className="ml-1 font-medium">
                                {performance.dreamTriggerCount > 0 
                                  ? ((performance.dreamTriggerSuccess / performance.dreamTriggerCount) * 100).toFixed(1)
                                  : 0}%
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Career Progression:</span>
                              <span className="ml-1 font-medium">{performance.careerProgression.toFixed(1)}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Reputation Stability:</span>
                              <span className="ml-1 font-medium">{performance.reputationStability.toFixed(1)}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Financial Growth:</span>
                              <span className="ml-1 font-medium">{performance.financialGrowth.toFixed(1)}%</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Social Engagement:</span>
                              <span className="ml-1 font-medium">{formatNumber(performance.socialMediaEngagement)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Results */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Results</h3>
                <div className="space-y-3">
                  {results.slice(0, 10).map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getProfileIcon(result.profileId)}
                        <div>
                          <div className="font-medium">
                            {AI_CELEBRITY_PROFILES.find(p => p.id === result.profileId)?.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {BENCHMARK_SCENARIOS.find(s => s.id === result.scenarioId)?.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{result.totalScore.toFixed(1)}</div>
                        <div className="text-sm text-gray-600">
                          {result.dreamTriggerCount} dreams, {result.dreamTriggerSuccess} successful
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {results.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data for Analysis</h3>
              <p className="text-gray-500">Run benchmarks to generate analysis data.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Performance Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
                  <div className="space-y-3">
                    {AI_CELEBRITY_PROFILES
                      .map(profile => ({
                        profile,
                        avgScore: getAverageScore(profile.id)
                      }))
                      .sort((a, b) => b.avgScore - a.avgScore)
                      .slice(0, 3)
                      .map(({ profile, avgScore }, index) => (
                        <div key={profile.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                            {getProfileIcon(profile.id)}
                            <span className="font-medium">{profile.name}</span>
                          </div>
                          <span className="font-semibold">{avgScore.toFixed(1)}</span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold mb-4">Dream Logic Analysis</h3>
                  <div className="space-y-3">
                    {AI_CELEBRITY_PROFILES
                      .map(profile => {
                        const performance = getProfilePerformance(profile.id);
                        return {
                          profile,
                          dreamSuccess: performance ? 
                            (performance.dreamTriggerCount > 0 
                              ? (performance.dreamTriggerSuccess / performance.dreamTriggerCount) * 100 
                              : 0) : 0
                        };
                      })
                      .sort((a, b) => b.dreamSuccess - a.dreamSuccess)
                      .map(({ profile, dreamSuccess }) => (
                        <div key={profile.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getProfileIcon(profile.id)}
                            <span className="font-medium">{profile.name}</span>
                          </div>
                          <span className="font-semibold">{dreamSuccess.toFixed(1)}%</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4">AI Recommendations</h3>
                <div className="space-y-4">
                  {AI_CELEBRITY_PROFILES.map(profile => {
                    const avgScore = getAverageScore(profile.id);
                    const performance = getProfilePerformance(profile.id);
                    
                    let recommendation = '';
                    let icon = <CheckCircle className="w-4 h-4 text-green-500" />;
                    
                    if (avgScore < 50) {
                      recommendation = 'Needs improvement in overall performance';
                      icon = <AlertTriangle className="w-4 h-4 text-yellow-500" />;
                    } else if (avgScore < 70) {
                      recommendation = 'Good performance, consider minor optimizations';
                    } else {
                      recommendation = 'Excellent performance, maintain current strategy';
                    }

                    return (
                      <div key={profile.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        {icon}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getProfileIcon(profile.id)}
                            <span className="font-medium">{profile.name}</span>
                            <span className="text-sm text-gray-600">({avgScore.toFixed(1)} avg score)</span>
                          </div>
                          <p className="text-sm text-gray-600">{recommendation}</p>
                          {performance && (
                            <div className="mt-2 text-xs text-gray-500">
                              Dream triggers: {performance.dreamTriggerCount.toFixed(1)} avg, 
                              Success rate: {(performance.dreamTriggerCount > 0 
                                ? (performance.dreamTriggerSuccess / performance.dreamTriggerCount) * 100 
                                : 0).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIBenchmarkDashboard; 