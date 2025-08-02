import React, { useState, useEffect } from 'react';
import { Fighter, Fight } from '../../lib/supabase';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/card';
import { BarChart3, TrendingUp, DollarSign, Users, Trophy, Target, Activity, Zap } from 'lucide-react';

interface AnalyticsDashboardProps {}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = () => {
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [fights, setFights] = useState<Fight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fightersData, fightsData] = await Promise.all([
        supabase.from('fighters').select('*'),
        supabase.from('fights').select('*')
      ]);

      if (fightersData.error) throw fightersData.error;
      if (fightsData.error) throw fightsData.error;

      setFighters(fightersData.data || []);
      setFights(fightsData.data || []);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopFighters = (metric: keyof Fighter, limit: number = 5) => {
    return fighters
      .sort((a, b) => (b[metric] as number) - (a[metric] as number))
      .slice(0, limit);
  };

  const getFightStats = () => {
    const completedFights = fights.filter(f => f.winner_id);
    const totalRevenue = fights.reduce((sum, f) => sum + (f.total_revenue || 0), 0);
    const avgFightRating = completedFights.length > 0 
      ? completedFights.reduce((sum, f) => sum + (f.fight_rating || 0), 0) / completedFights.length 
      : 0;

    return {
      totalFights: fights.length,
      completedFights: completedFights.length,
      totalRevenue,
      avgFightRating: Math.round(avgFightRating),
      championshipFights: fights.filter(f => f.championship_fight).length
    };
  };

  const getFinancialMetrics = () => {
    const totalFighterContracts = fighters.reduce((sum, f) => sum + f.contract_value, 0);
    const totalCareerEarnings = fighters.reduce((sum, f) => sum + f.career_earnings, 0);
    const avgPurse = fighters.length > 0 
      ? fighters.reduce((sum, f) => sum + f.current_purse, 0) / fighters.length 
      : 0;

    return {
      totalContracts: totalFighterContracts,
      totalEarnings: totalCareerEarnings,
      avgPurse: Math.round(avgPurse),
      totalAssets: totalFighterContracts + getFightStats().totalRevenue
    };
  };

  const getPerformanceMetrics = () => {
    const topPunchers = getTopFighters('punching_power', 3);
    const topSpeedsters = getTopFighters('speed', 3);
    const topDefenders = getTopFighters('defense', 3);
    const mostExperienced = getTopFighters('experience_level', 3);

    return {
      topPunchers,
      topSpeedsters,
      topDefenders,
      mostExperienced
    };
  };

  const getWeightClassDistribution = () => {
    const distribution = fighters.reduce((acc, fighter) => {
      acc[fighter.weight_class] = (acc[fighter.weight_class] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([weightClass, count]) => ({
      weightClass,
      count,
      percentage: Math.round((count / fighters.length) * 100)
    }));
  };

  const getCareerStageDistribution = () => {
    const distribution = fighters.reduce((acc, fighter) => {
      acc[fighter.career_stage] = (acc[fighter.career_stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([stage, count]) => ({
      stage,
      count,
      percentage: Math.round((count / fighters.length) * 100)
    }));
  };

  if (loading) {
    return <div className="text-white">Loading analytics...</div>;
  }

  const fightStats = getFightStats();
  const financialMetrics = getFinancialMetrics();
  const performanceMetrics = getPerformanceMetrics();
  const weightClassDistribution = getWeightClassDistribution();
  const careerStageDistribution = getCareerStageDistribution();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Analytics Dashboard</h2>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value as any)}
          className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-red-500 focus:outline-none"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white">£{fightStats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Fights Completed</p>
              <p className="text-3xl font-bold text-white">{fightStats.completedFights}</p>
              <p className="text-gray-500 text-sm">of {fightStats.totalFights} total</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Fight Rating</p>
              <p className="text-3xl font-bold text-white">{fightStats.avgFightRating}/100</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Fighters</p>
              <p className="text-3xl font-bold text-white">{fighters.filter(f => f.is_available).length}</p>
              <p className="text-gray-500 text-sm">of {fighters.length} total</p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Performance Rankings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Top Performers</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Best Punchers</h4>
              <div className="space-y-2">
                {performanceMetrics.topPunchers.map((fighter, index) => (
                  <div key={fighter.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-yellow-400 font-bold">#{index + 1}</span>
                      <span className="text-white">{fighter.name}</span>
                    </div>
                    <span className="text-gray-300">{fighter.punching_power}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Fastest Fighters</h4>
              <div className="space-y-2">
                {performanceMetrics.topSpeedsters.map((fighter, index) => (
                  <div key={fighter.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-400 font-bold">#{index + 1}</span>
                      <span className="text-white">{fighter.name}</span>
                    </div>
                    <span className="text-gray-300">{fighter.speed}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Financial Overview</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Contracts</p>
                <p className="text-2xl font-bold text-white">£{financialMetrics.totalContracts.toLocaleString()}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Career Earnings</p>
                <p className="text-2xl font-bold text-white">£{financialMetrics.totalEarnings.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Average Purse</p>
              <p className="text-2xl font-bold text-white">£{financialMetrics.avgPurse.toLocaleString()}</p>
            </div>

            <div className="bg-green-900 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Assets</p>
              <p className="text-2xl font-bold text-green-400">£{financialMetrics.totalAssets.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Weight Class Distribution</h3>
          <div className="space-y-3">
            {weightClassDistribution.map((item) => (
              <div key={item.weightClass} className="flex items-center justify-between">
                <span className="text-white capitalize">{item.weightClass}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-300 text-sm">{item.count} ({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Career Stage Distribution</h3>
          <div className="space-y-3">
            {careerStageDistribution.map((item) => (
              <div key={item.stage} className="flex items-center justify-between">
                <span className="text-white capitalize">{item.stage}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-300 text-sm">{item.count} ({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Fight Activity</h3>
        <div className="space-y-3">
          {fights
            .filter(f => f.winner_id)
            .slice(0, 5)
            .map((fight) => {
              const fighter1 = fighters.find(f => f.id === fight.fighter1_id);
              const fighter2 = fighters.find(f => f.id === fight.fighter2_id);
              const winner = fighters.find(f => f.id === fight.winner_id);

              return (
                <div key={fight.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-white font-medium">{fighter1?.name}</p>
                      <p className="text-gray-400 text-sm">vs</p>
                      <p className="text-white font-medium">{fighter2?.name}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-400 font-bold">{winner?.name}</p>
                      <p className="text-gray-400 text-sm">{fight.result_type?.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{fight.event_name}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(fight.fight_date!).toLocaleDateString()}
                    </p>
                    <p className="text-green-400">£{fight.total_revenue?.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </Card>

      {/* Performance Trends */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Performance Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Average Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Power:</span>
                <span className="text-white">{Math.round(fighters.reduce((sum, f) => sum + f.punching_power, 0) / fighters.length)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Speed:</span>
                <span className="text-white">{Math.round(fighters.reduce((sum, f) => sum + f.speed, 0) / fighters.length)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Defense:</span>
                <span className="text-white">{Math.round(fighters.reduce((sum, f) => sum + f.defense, 0) / fighters.length)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stamina:</span>
                <span className="text-white">{Math.round(fighters.reduce((sum, f) => sum + f.stamina, 0) / fighters.length)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Morale Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">High Confidence:</span>
                <span className="text-green-400">{fighters.filter(f => f.confidence > 80).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Low Confidence:</span>
                <span className="text-red-400">{fighters.filter(f => f.confidence < 50).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">High Motivation:</span>
                <span className="text-green-400">{fighters.filter(f => f.motivation > 80).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Low Motivation:</span>
                <span className="text-red-400">{fighters.filter(f => f.motivation < 50).length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Injury Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Healthy:</span>
                <span className="text-green-400">{fighters.filter(f => !f.is_injured).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Injured:</span>
                <span className="text-red-400">{fighters.filter(f => f.is_injured).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Available:</span>
                <span className="text-blue-400">{fighters.filter(f => f.is_available).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Unavailable:</span>
                <span className="text-yellow-400">{fighters.filter(f => !f.is_available).length}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}; 