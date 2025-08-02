import React, { useState, useEffect } from 'react';
import { 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  DollarSign,
  Users,
  Award,
  Plus,
  Edit,
  Trash2,
  ArrowRight
} from 'lucide-react';
import type { 
  Celebrity, 
  CelebrityIndustryValue,
  Project,
  CareerMilestone
} from '../../lib/unified-types';

interface CareerGoal {
  id: string;
  title: string;
  description: string;
  category: 'popularity' | 'finance' | 'reputation' | 'skills' | 'career';
  targetValue: number;
  currentValue: number;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'overdue';
  progress: number;
  rewards: string[];
  created_at: Date;
}

interface CareerPlan {
  id: string;
  celebrity_id: string;
  title: string;
  description: string;
  duration_months: number;
  goals: CareerGoal[];
  milestones: string[];
  budget: number;
  risk_level: 'low' | 'medium' | 'high';
  success_probability: number;
  created_at: Date;
  updated_at: Date;
}

interface CareerPlannerProps {
  celebrity: Celebrity;
  projects: Project[];
  milestones: CareerMilestone[];
}

const CareerPlanner: React.FC<CareerPlannerProps> = ({
  celebrity,
  projects,
  milestones
}) => {
  const [activeTab, setActiveTab] = useState<'goals' | 'plans' | 'timeline' | 'insights'>('goals');
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<CareerGoal | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<CareerPlan | null>(null);

  // Sample career goals
  const [careerGoals, setCareerGoals] = useState<CareerGoal[]>([
    {
      id: 'goal_1',
      title: 'Reach 1M Instagram Followers',
      description: 'Build social media presence to 1 million followers across all platforms',
      category: 'popularity',
      targetValue: 1000000,
      currentValue: celebrity.fan_base_size || 0,
      deadline: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months
      priority: 'high',
      status: 'active',
      progress: Math.min(100, ((celebrity.fan_base_size || 0) / 1000000) * 100),
      rewards: ['Increased brand value', 'Better endorsement deals', 'Higher media reach'],
      created_at: new Date()
    },
    {
      id: 'goal_2',
      title: 'Achieve $5M Net Worth',
      description: 'Build diverse investment portfolio to reach $5 million net worth',
      category: 'finance',
      targetValue: 5000000,
      currentValue: celebrity.net_worth || 0,
      deadline: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000), // 12 months
      priority: 'high',
      status: 'active',
      progress: Math.min(100, ((celebrity.net_worth || 0) / 5000000) * 100),
      rewards: ['Financial security', 'Investment opportunities', 'Lifestyle upgrade'],
      created_at: new Date()
    },
    {
      id: 'goal_3',
      title: 'Win Industry Award',
      description: 'Receive recognition in primary industry through awards or nominations',
      category: 'reputation',
      targetValue: 1,
      currentValue: 0,
      deadline: new Date(Date.now() + 8 * 30 * 24 * 60 * 60 * 1000), // 8 months
      priority: 'medium',
      status: 'active',
      progress: 0,
      rewards: ['Industry recognition', 'Career advancement', 'Media coverage'],
      created_at: new Date()
    }
  ]);

  // Sample career plans
  const [careerPlans, setCareerPlans] = useState<CareerPlan[]>([
    {
      id: 'plan_1',
      celebrity_id: celebrity.id,
      title: 'Social Media Domination',
      description: 'Comprehensive plan to become a top social media influencer',
      duration_months: 12,
      goals: careerGoals.filter(g => g.category === 'popularity'),
      milestones: ['100K followers', '500K followers', '1M followers', 'Verified status'],
      budget: 50000,
      risk_level: 'low',
      success_probability: 85,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'plan_2',
      celebrity_id: celebrity.id,
      title: 'Financial Empire Building',
      description: 'Strategic plan to build wealth through diverse investments',
      duration_months: 24,
      goals: careerGoals.filter(g => g.category === 'finance'),
      milestones: ['$1M net worth', 'First property', 'Business venture', '$5M net worth'],
      budget: 200000,
      risk_level: 'medium',
      success_probability: 70,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  const getGoalIcon = (category: string) => {
    switch (category) {
      case 'popularity': return <Users className="w-5 h-5 text-blue-500" />;
      case 'finance': return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'reputation': return <Award className="w-5 h-5 text-purple-500" />;
      case 'skills': return <Star className="w-5 h-5 text-yellow-500" />;
      case 'career': return <TrendingUp className="w-5 h-5 text-orange-500" />;
      default: return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'active': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

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

  const calculateGoalProgress = (goal: CareerGoal) => {
    return Math.min(100, (goal.currentValue / goal.targetValue) * 100);
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Career Planner</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateGoal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>
          <button
            onClick={() => setShowCreatePlan(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Plan
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'goals', label: 'Goals', icon: Target },
          { id: 'plans', label: 'Career Plans', icon: TrendingUp },
          { id: 'timeline', label: 'Timeline', icon: Calendar },
          { id: 'insights', label: 'Insights', icon: Star }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Goals Tab */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careerGoals.map(goal => (
              <div key={goal.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getGoalIcon(goal.category)}
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                      {goal.priority}
                    </span>
                    {getStatusIcon(goal.status)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold">{Math.round(calculateGoalProgress(goal))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateGoalProgress(goal)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Current</div>
                    <div className="font-semibold">
                      {goal.category === 'finance' ? formatCurrency(goal.currentValue) : formatNumber(goal.currentValue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Target</div>
                    <div className="font-semibold">
                      {goal.category === 'finance' ? formatCurrency(goal.targetValue) : formatNumber(goal.targetValue)}
                    </div>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={`text-sm ${
                    getDaysUntilDeadline(goal.deadline) < 0 ? 'text-red-600' : 
                    getDaysUntilDeadline(goal.deadline) < 30 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {getDaysUntilDeadline(goal.deadline) < 0 ? 'Overdue' :
                     getDaysUntilDeadline(goal.deadline) === 0 ? 'Due today' :
                     `${getDaysUntilDeadline(goal.deadline)} days left`}
                  </div>
                </div>

                {/* Rewards */}
                {goal.rewards.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Rewards:</div>
                    <div className="space-y-1">
                      {goal.rewards.map((reward, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{reward}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700">
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {careerPlans.map(plan => (
              <div key={plan.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-xl mb-2">{plan.title}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      plan.risk_level === 'high' ? 'text-red-600 bg-red-100' :
                      plan.risk_level === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                      'text-green-600 bg-green-100'
                    }`}>
                      {plan.risk_level} risk
                    </span>
                  </div>
                </div>

                {/* Plan Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-semibold">{plan.duration_months} months</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Budget</div>
                    <div className="font-semibold">{formatCurrency(plan.budget)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Success Probability</div>
                    <div className="font-semibold">{plan.success_probability}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Goals</div>
                    <div className="font-semibold">{plan.goals.length}</div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Milestones:</div>
                  <div className="space-y-2">
                    {plan.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-600">{index + 1}</span>
                        </div>
                        <span>{milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall Progress</span>
                    <span className="text-sm font-semibold">
                      {Math.round(plan.goals.reduce((sum, goal) => sum + calculateGoalProgress(goal), 0) / plan.goals.length)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${plan.goals.reduce((sum, goal) => sum + calculateGoalProgress(goal), 0) / plan.goals.length}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                    View Details
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Career Timeline</h3>
            <div className="space-y-4">
              {[...careerGoals, ...milestones].sort((a, b) => 
                new Date(a.deadline || a.achieved_date).getTime() - new Date(b.deadline || b.achieved_date).getTime()
              ).map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">
                        {'title' in item ? item.title : item.milestone_type}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {new Date(item.deadline || item.achieved_date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {'description' in item ? item.description : item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Goal Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed Goals</span>
                  <span className="font-semibold">
                    {careerGoals.filter(g => g.status === 'completed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Goals</span>
                  <span className="font-semibold">
                    {careerGoals.filter(g => g.status === 'active').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overdue Goals</span>
                  <span className="font-semibold text-red-600">
                    {careerGoals.filter(g => g.status === 'overdue').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Progress</span>
                  <span className="font-semibold">
                    {Math.round(careerGoals.reduce((sum, goal) => sum + calculateGoalProgress(goal), 0) / careerGoals.length)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Career Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Primary Industry</span>
                  <span className="font-semibold capitalize">{celebrity.primary_industry}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Experience Level</span>
                  <span className="font-semibold">{celebrity.experience}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Popularity</span>
                  <span className="font-semibold">{celebrity.popularity}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Net Worth</span>
                  <span className="font-semibold">{formatCurrency(celebrity.net_worth || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Star className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">Focus on Social Media</h4>
                  <p className="text-sm text-blue-700">Your social media engagement is strong. Consider increasing posting frequency to accelerate follower growth.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900">Diversify Investments</h4>
                  <p className="text-sm text-green-700">Consider adding more diverse investment types to reduce risk and increase potential returns.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <Award className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-900">Build Industry Relationships</h4>
                  <p className="text-sm text-purple-700">Network with key industry contacts to open up new opportunities and career advancement.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerPlanner; 