import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Briefcase, 
  Music, 
  Film, 
  Gamepad2, 
  Instagram, 
  Camera, 
  Building, 
  Mic, 
  Tv, 
  ShoppingBag, 
  Cpu,
  Star,
  Target,
  Zap,
  Heart,
  Brain,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Plus,
  Settings,
  BarChart3
} from 'lucide-react';
import { 
  celebrityManagementEngine,
  CelebrityManagementEngine 
} from '../../lib/celebrity-management-engine';
import type { 
  Celebrity, 
  CelebrityIndustryValue, 
  Project, 
  CareerMilestone,
  ActingSkills,
  MusicSkills,
  SportsSkills,
  SocialMediaSkills,
  BusinessSkills
} from '../../lib/unified-types';

interface MultiIndustryCareerPanelProps {
  celebrity?: Celebrity;
  onCelebrityUpdate?: (celebrity: Celebrity) => void;
}

const MultiIndustryCareerPanel: React.FC<MultiIndustryCareerPanelProps> = ({
  celebrity,
  onCelebrityUpdate
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIndustry, setSelectedIndustry] = useState<CelebrityIndustryValue>('acting');
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<CareerMilestone[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [trainingHours, setTrainingHours] = useState(8);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({});

  useEffect(() => {
    if (celebrity) {
      loadCelebrityData();
    }
  }, [celebrity]);

  const loadCelebrityData = () => {
    if (!celebrity) return;
    
    const celebrityProjects = celebrityManagementEngine.getCelebrityProjects(celebrity.id);
    const celebrityMilestones = celebrityManagementEngine.getCelebrityMilestones(celebrity.id);
    const celebrityOpportunities = celebrityManagementEngine.generateOpportunities(celebrity);
    
    setProjects(celebrityProjects);
    setMilestones(celebrityMilestones);
    setOpportunities(celebrityOpportunities);
  };

  const handleIndustrySwitch = (newIndustry: CelebrityIndustryValue) => {
    if (!celebrity) return;
    
    const success = celebrityManagementEngine.switchPrimaryIndustry(celebrity.id, newIndustry);
    if (success && onCelebrityUpdate) {
      const updatedCelebrity = celebrityManagementEngine.getCelebrity(celebrity.id);
      if (updatedCelebrity) {
        onCelebrityUpdate(updatedCelebrity);
        loadCelebrityData();
      }
    }
  };

  const handleSkillTraining = () => {
    if (!celebrity || !selectedSkill) return;
    
    const skillType = celebrity.primary_industry;
    const success = celebrityManagementEngine.trainSkill(celebrity.id, skillType, selectedSkill, trainingHours);
    
    if (success && onCelebrityUpdate) {
      const updatedCelebrity = celebrityManagementEngine.getCelebrity(celebrity.id);
      if (updatedCelebrity) {
        onCelebrityUpdate(updatedCelebrity);
      }
    }
  };

  const handleCreateProject = () => {
    if (!celebrity || !newProject.title) return;
    
    const projectData = {
      ...newProject,
      celebrity_id: celebrity.id,
      industry: celebrity.primary_industry,
      status: 'planning' as const,
      start_date: new Date(),
      budget: newProject.budget || 0,
      revenue_potential: newProject.revenue_potential || 0,
      risk_level: newProject.risk_level || 'medium',
      critical_success_factors: newProject.critical_success_factors || [],
      team_members: newProject.team_members || [],
      location: newProject.location || '',
      description: newProject.description || ''
    };
    
    const createdProject = celebrityManagementEngine.createProject(projectData);
    setProjects([...projects, createdProject]);
    setShowCreateProject(false);
    setNewProject({});
  };

  const getIndustryIcon = (industry: CelebrityIndustryValue) => {
    const icons = {
      acting: Film,
      music: Music,
      sports: Gamepad2,
      social_media: Instagram,
      modeling: Camera,
      business: Building,
      comedy: Mic,
      reality_tv: Tv,
      fashion: ShoppingBag,
      technology: Cpu
    };
    return icons[industry] || Users;
  };

  const getIndustryColor = (industry: CelebrityIndustryValue) => {
    const colors = {
      acting: 'text-blue-600 bg-blue-100',
      music: 'text-purple-600 bg-purple-100',
      sports: 'text-green-600 bg-green-100',
      social_media: 'text-pink-600 bg-pink-100',
      modeling: 'text-yellow-600 bg-yellow-100',
      business: 'text-gray-600 bg-gray-100',
      comedy: 'text-orange-600 bg-orange-100',
      reality_tv: 'text-red-600 bg-red-100',
      fashion: 'text-indigo-600 bg-indigo-100',
      technology: 'text-cyan-600 bg-cyan-100'
    };
    return colors[industry] || 'text-gray-600 bg-gray-100';
  };

  const renderIndustryCard = (industry: CelebrityIndustryValue, isPrimary: boolean = false) => {
    const Icon = getIndustryIcon(industry);
    const colorClass = getIndustryColor(industry);
    const isCurrentIndustry = celebrity?.primary_industry === industry;
    
    return (
      <div 
        key={industry}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
          isCurrentIndustry 
            ? 'border-blue-500 bg-blue-50 shadow-lg' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleIndustrySwitch(industry)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${colorClass.split(' ')[0]}`} />
            <div>
              <h3 className="font-semibold capitalize">{industry.replace('_', ' ')}</h3>
              {isPrimary && <span className="text-xs text-blue-600 font-medium">Primary</span>}
            </div>
          </div>
          {isCurrentIndustry && (
            <CheckCircle className="w-5 h-5 text-blue-500" />
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Experience:</span>
            <span className="font-medium">{getIndustryExperience(industry)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Ranking:</span>
            <span className="font-medium">#{getIndustryRanking(industry)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Projects:</span>
            <span className="font-medium">{getIndustryProjectCount(industry)}</span>
          </div>
        </div>
      </div>
    );
  };

  const getIndustryExperience = (industry: CelebrityIndustryValue): number => {
    if (!celebrity) return 0;
    // Calculate industry-specific experience based on skills
    switch (industry) {
      case 'acting':
        return celebrity.acting_skills ? Object.values(celebrity.acting_skills).reduce((a, b) => a + b, 0) / 10 : 0;
      case 'music':
        return celebrity.music_skills ? Object.values(celebrity.music_skills).reduce((a, b) => a + b, 0) / 10 : 0;
      case 'sports':
        return celebrity.sports_skills ? Object.values(celebrity.sports_skills).reduce((a, b) => a + b, 0) / 10 : 0;
      case 'social_media':
        return celebrity.social_media_skills ? Object.values(celebrity.social_media_skills).reduce((a, b) => a + b, 0) / 10 : 0;
      case 'business':
        return celebrity.business_skills ? Object.values(celebrity.business_skills).reduce((a, b) => a + b, 0) / 10 : 0;
      default:
        return celebrity.experience || 0;
    }
  };

  const getIndustryRanking = (industry: CelebrityIndustryValue): number => {
    // Mock ranking calculation
    return Math.floor(Math.random() * 100) + 1;
  };

  const getIndustryProjectCount = (industry: CelebrityIndustryValue): number => {
    return projects.filter(p => p.industry === industry).length;
  };

  const renderSkillTraining = () => {
    if (!celebrity) return null;

    const skills = getSkillsForIndustry(celebrity.primary_industry);
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Skill Training
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Training Hours</label>
            <input
              type="range"
              min="1"
              max="16"
              value={trainingHours}
              onChange={(e) => setTrainingHours(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1h</span>
              <span>{trainingHours}h</span>
              <span>16h</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Select Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Choose a skill...</option>
              {Object.entries(skills).map(([skill, value]) => (
                <option key={skill} value={skill}>
                  {skill.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({value})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm">Energy: {celebrity.energy_level || 100}</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-blue-500" />
              <span className="text-sm">Stress: {celebrity.stress_level || 0}</span>
            </div>
          </div>
          
          <button
            onClick={handleSkillTraining}
            disabled={!selectedSkill || (celebrity.energy_level || 0) < trainingHours * 2}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Train Skill
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(skills).map(([skill, value]) => (
            <div key={skill} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium capitalize">
                  {skill.replace('_', ' ')}
                </span>
                <span className="text-sm font-bold">{value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getSkillsForIndustry = (industry: CelebrityIndustryValue) => {
    if (!celebrity) return {};
    
    switch (industry) {
      case 'acting':
        return celebrity.acting_skills || {};
      case 'music':
        return celebrity.music_skills || {};
      case 'sports':
        return celebrity.sports_skills || {};
      case 'social_media':
        return celebrity.social_media_skills || {};
      case 'business':
        return celebrity.business_skills || {};
      default:
        return {};
    }
  };

  const renderProjects = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-green-500" />
          Active Projects
        </h3>
        <button
          onClick={() => setShowCreateProject(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>
      
      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{project.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                project.status === 'completed' ? 'bg-green-100 text-green-800' :
                project.status === 'in_production' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Industry:</span>
                <div className="flex items-center gap-1">
                  {React.createElement(getIndustryIcon(project.industry), { className: 'w-4 h-4' })}
                  <span className="capitalize">{project.industry.replace('_', ' ')}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Budget:</span>
                <div className="font-medium">${project.budget.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Revenue Potential:</span>
                <div className="font-medium">${project.revenue_potential.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Risk:</span>
                <div className={`font-medium capitalize ${
                  project.risk_level === 'high' ? 'text-red-600' :
                  project.risk_level === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {project.risk_level}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No active projects</p>
            <p className="text-sm">Create your first project to get started</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderOpportunities = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500" />
        Available Opportunities
      </h3>
      
      <div className="space-y-4">
        {opportunities.map(opportunity => (
          <div key={opportunity.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{opportunity.title}</h4>
              <span className="text-lg font-bold text-green-600">
                ${opportunity.value.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span className="capitalize">{opportunity.type}</span>
              <span>•</span>
              <span>Required Popularity: {opportunity.required_popularity}</span>
            </div>
            
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Pursue Opportunity
            </button>
          </div>
        ))}
        
        {opportunities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No opportunities available</p>
            <p className="text-sm">Build your skills and popularity to unlock opportunities</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMilestones = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-purple-500" />
        Career Milestones
      </h3>
      
      <div className="space-y-4">
        {milestones.map(milestone => (
          <div key={milestone.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{milestone.title}</h4>
              <span className="text-sm text-gray-500">
                {new Date(milestone.achieved_date).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-gray-600 mb-3">{milestone.description}</p>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Impact: {milestone.impact_score}
              </span>
              <span className="flex items-center gap-1">
                {React.createElement(getIndustryIcon(milestone.industry), { className: 'w-4 h-4' })}
                {milestone.industry.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
        
        {milestones.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No milestones achieved yet</p>
            <p className="text-sm">Complete projects and build your career to earn milestones</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCreateProjectModal = () => {
    if (!showCreateProject) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Title</label>
              <input
                type="text"
                value={newProject.title || ''}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter project title..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Budget</label>
              <input
                type="number"
                value={newProject.budget || ''}
                onChange={(e) => setNewProject({...newProject, budget: parseInt(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter budget..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Revenue Potential</label>
              <input
                type="number"
                value={newProject.revenue_potential || ''}
                onChange={(e) => setNewProject({...newProject, revenue_potential: parseInt(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter revenue potential..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Risk Level</label>
              <select
                value={newProject.risk_level || 'medium'}
                onChange={(e) => setNewProject({...newProject, risk_level: e.target.value as any})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newProject.description || ''}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Enter project description..."
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowCreateProject(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProject}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!celebrity) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No celebrity selected</p>
        <p className="text-sm">Select a celebrity to manage their career</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'industries', label: 'Industries', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'training', label: 'Training', icon: <Target className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <Calendar className="w-4 h-4" /> },
    { id: 'opportunities', label: 'Opportunities', icon: <Star className="w-4 h-4" /> },
    { id: 'milestones', label: 'Milestones', icon: <Award className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{celebrity.name}</h2>
            <p className="text-gray-600 capitalize">
              {celebrity.primary_industry.replace('_', ' ')} • {celebrity.age} years old
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ${(celebrity.net_worth || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Net Worth</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{celebrity.popularity || 0}</div>
            <div className="text-sm text-gray-500">Popularity</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">{celebrity.experience || 0}</div>
            <div className="text-sm text-gray-500">Experience</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{celebrity.fan_base_size || 0}</div>
            <div className="text-sm text-gray-500">Fan Base</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">{celebrity.energy_level || 100}</div>
            <div className="text-sm text-gray-500">Energy</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderIndustryCard(celebrity.primary_industry, true)}
                {celebrity.secondary_industries.map(industry => 
                  renderIndustryCard(industry, false)
                )}
              </div>
              {renderSkillTraining()}
            </div>
          )}
          
          {activeTab === 'industries' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(celebrityManagementEngine.getIndustryOpportunities('acting')).map(industry => 
                renderIndustryCard(industry as CelebrityIndustryValue, false)
              )}
            </div>
          )}
          
          {activeTab === 'training' && renderSkillTraining()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'opportunities' && renderOpportunities()}
          {activeTab === 'milestones' && renderMilestones()}
        </div>
      </div>

      {renderCreateProjectModal()}
    </div>
  );
};

export default MultiIndustryCareerPanel; 