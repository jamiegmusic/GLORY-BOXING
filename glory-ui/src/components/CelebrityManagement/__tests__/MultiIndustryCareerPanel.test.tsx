import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import MultiIndustryCareerPanel from '../MultiIndustryCareerPanel';
import { useCelebrityProjects, useCelebrityEndorsements, useCelebrityTours, useCelebritySocialMedia } from '@/hooks/useCelebrityData';

// Mock the celebrity data hooks
vi.mock('@/hooks/useCelebrityData', () => ({
  useCelebrityProjects: vi.fn(),
  useCelebrityEndorsements: vi.fn(),
  useCelebrityTours: vi.fn(),
  useCelebritySocialMedia: vi.fn(),
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: [], error: null }),
      update: vi.fn().mockResolvedValue({ data: [], error: null }),
      delete: vi.fn().mockResolvedValue({ data: [], error: null })
    }))
  }
}));

const mockCelebrity = {
  id: '1',
  name: 'Test Celebrity',
  age: 25,
  nationality: 'American',
  primary_industry: 'acting' as any,
  secondary_industries: ['music', 'social_media'] as any[],
  acting_skills: {
    dramatic_acting: 80,
    comedic_acting: 70,
    method_acting: 75,
    voice_acting: 60,
    stage_presence: 85,
    emotional_range: 90,
    accent_work: 65,
    improvisation: 75,
    chemistry_with_co_stars: 80,
    audition_skills: 85
  },
  popularity: 75,
  experience: 1000,
  net_worth: 2000000,
  physical_health: 95,
  mental_health: 88,
  stress_level: 15,
  energy_level: 85,
  public_image: 82,
  fan_base_size: 2500000,
  media_sentiment: 'positive',
  created_at: new Date(),
  updated_at: new Date()
};

describe('MultiIndustryCareerPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock implementations
    (useCelebrityProjects as vi.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    });
    (useCelebrityEndorsements as vi.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    });
    (useCelebrityTours as vi.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    });
    (useCelebritySocialMedia as vi.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    });
  });

  it('renders celebrity information correctly', () => {
    const mockOnCelebrityUpdate = vi.fn();
    
    render(
      <MultiIndustryCareerPanel
        celebrity={mockCelebrity}
        onCelebrityUpdate={mockOnCelebrityUpdate}
      />
    );

    expect(screen.getByText('Test Celebrity')).toBeInTheDocument();
    expect(screen.getByText('acting')).toBeInTheDocument();
    expect(screen.getByText('25 years old')).toBeInTheDocument();
    expect(screen.getByText('$2,000,000')).toBeInTheDocument();
  });

  it('displays celebrity stats correctly', () => {
    const mockOnCelebrityUpdate = vi.fn();
    
    render(
      <MultiIndustryCareerPanel
        celebrity={mockCelebrity}
        onCelebrityUpdate={mockOnCelebrityUpdate}
      />
    );

    expect(screen.getByText('75')).toBeInTheDocument(); // Popularity
    expect(screen.getByText('1000')).toBeInTheDocument(); // Experience
    expect(screen.getByText('2,500,000')).toBeInTheDocument(); // Fan Base
    expect(screen.getByText('85')).toBeInTheDocument(); // Energy
  });

  it('shows industry cards for primary and secondary industries', () => {
    const mockOnCelebrityUpdate = vi.fn();
    
    render(
      <MultiIndustryCareerPanel
        celebrity={mockCelebrity}
        onCelebrityUpdate={mockOnCelebrityUpdate}
      />
    );

    expect(screen.getByText('Acting')).toBeInTheDocument();
    expect(screen.getByText('Music')).toBeInTheDocument();
    expect(screen.getByText('Social Media')).toBeInTheDocument();
  });

  it('allows switching between tabs', () => {
    const mockOnCelebrityUpdate = vi.fn();
    
    render(
      <MultiIndustryCareerPanel
        celebrity={mockCelebrity}
        onCelebrityUpdate={mockOnCelebrityUpdate}
      />
    );

    // Click on different tabs
    fireEvent.click(screen.getByText('Training'));
    expect(screen.getByText('Skill Training')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Projects'));
    expect(screen.getByText('Active Projects')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Opportunities'));
    expect(screen.getByText('Available Opportunities')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Milestones'));
    expect(screen.getByText('Career Milestones')).toBeInTheDocument();
  });

  it('displays skill training interface correctly', () => {
    const mockOnCelebrityUpdate = vi.fn();
    
    render(
      <MultiIndustryCareerPanel
        celebrity={mockCelebrity}
        onCelebrityUpdate={mockOnCelebrityUpdate}
      />
    );

    // Navigate to training tab
    fireEvent.click(screen.getByText('Training'));

    expect(screen.getByText('Skill Training')).toBeInTheDocument();
    expect(screen.getByText('Training Hours')).toBeInTheDocument();
    expect(screen.getByText('Select Skill')).toBeInTheDocument();
    expect(screen.getByText('Energy: 85')).toBeInTheDocument();
    expect(screen.getByText('Stress: 15')).toBeInTheDocument();
  });

  it('shows acting skills when acting is primary industry', () => {
    const mockOnCelebrityUpdate = vi.fn();
    
    render(
      <MultiIndustryCareerPanel
        celebrity={mockCelebrity}
        onCelebrityUpdate={mockOnCelebrityUpdate}
      />
    );

    // Navigate to training tab
    fireEvent.click(screen.getByText('Training'));

    expect(screen.getByText('Dramatic Acting (80)')).toBeInTheDocument();
    expect(screen.getByText('Comedic Acting (70)')).toBeInTheDocument();
    expect(screen.getByText('Method Acting (75)')).toBeInTheDocument();
  });

  it('allows skill training with proper validation', async () => {
    const mockOnCelebrityUpdate = vi.fn();
    // Mock the engine directly as it's not imported in this file
    const mockEngine = {
      trainSkill: vi.fn().mockResolvedValue(true),
      getCelebrity: vi.fn().mockResolvedValue(mockCelebrity),
      switchPrimaryIndustry: vi.fn().mockResolvedValue(true),
      getCelebrityProjects: vi.fn().mockResolvedValue([]),
      getCelebrityMilestones: vi.fn().mockResolvedValue([]),
      generateOpportunities: vi.fn().mockResolvedValue([]),
      getIndustryOpportunities: vi.fn().mockResolvedValue([]),
      createProject: vi.fn().mockResolvedValue({
        id: '2',
        celebrity_id: '1',
        title: 'New Project',
        industry: 'acting' as any,
        type: 'movie' as any,
        status: 'planning' as any,
        start_date: new Date(),
        budget: 500000,
        revenue_potential: 2000000,
        risk_level: 'low' as any,
        critical_success_factors: [],
        team_members: [],
        location: 'New York',
        description: 'A new project',
        created_at: new Date(),
        updated_at: new Date()
      })
    };
    vi.mock('../../../lib/celebrity-management-engine', () => ({
      celebrityManagementEngine: mockEngine
    }));

    render(
      <MultiIndustryCareerPanel
        celebrity={mockCelebrity}
        onCelebrityUpdate={mockOnCelebrityUpdate}
      />
    );

    // Navigate to training tab
    fireEvent.click(screen.getByText('Training'));

    // Select a skill
    const skillSelect = screen.getByDisplayValue('Choose a skill...');
    fireEvent.change(skillSelect, { target: { value: 'dramatic_acting' } });

    // Adjust training hours
    const hoursSlider = screen.getByRole('slider');
    fireEvent.change(hoursSlider, { target: { value: '10' } });

    // Click train skill button
    const trainButton = screen.getByText('Train Skill');
    fireEvent.click(trainButton);

    await waitFor(() => {
      expect(mockEngine.trainSkill).toHaveBeenCalledWith(
        '1',
        'acting',
        'dramatic_acting',
        10
      );
    });
  });

  it('displays projects correctly', () => {
    const mockProjects = [
      {
        id: '1',
        celebrity_id: '1',
        title: 'Test Movie',
        industry: 'acting' as any,
        type: 'movie' as any,
        status: 'in_production' as any,
        start_date: new Date(),
        budget: 1000000,
        revenue_potential: 5000000,
        risk_level: 'medium' as any,
        critical_success_factors: [],
        team_members: [],
        location: 'Los Angeles',
        description: 'A test movie project',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    (useCelebrityProjects as vi.Mock).mockReturnValue({
      data: mockProjects,
      isLoading: false,
      error: null
    });
    
    const mockOnCelebrityUpdate = vi.fn();
    
    render(
      <MultiIndustryCareerPanel
        celebrity={mockCelebrity}
        onCelebrityUpdate={mockOnCelebrityUpdate}
      />
    );

    // Navigate to projects tab
    fireEvent.click(screen.getByText('Projects'));

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('$1,000,000')).toBeInTheDocument();
    expect(screen.getByText('$5,000,000')).toBeInTheDocument();
    expect(screen.getByText('in production')).toBeInTheDocument();
  });

  it('allows creating new projects', async () => {
    const mockProject = {
      id: '2',
      celebrity_id: '1',
      title: 'New Project',
      industry: 'acting' as any,
      type: 'movie' as any,
      status: 'planning' as any,
      start_date: new Date(),
      budget: 500000,
      revenue_potential: 2000000,
      risk_level: 'low' as any,
      critical_success_factors: [],
      team_members: [],
      location: 'New York',
      description: 'A new project',
      created_at: new Date(),
      updated_at: new Date()
    };

    (useCelebrityProjects as vi.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    });
    (useCelebrityEndorsements as vi.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    });
    (useCelebrityTours as vi.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    });
    (useCelebritySocialMedia as vi.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null
    });
    const mockEngine = {
      createProject: vi.fn().mockResolvedValue(mockProject)
    };
    vi.mock('../../../lib/celebrity-management-engine', () => ({
      celebrityManagementEngine: mockEngine
    }));
    
    const mockOnCelebrityUpdate = vi.fn();
    
    render(
      <MultiIndustryCareerPanel
        celebrity={mockCelebrity}
        onCelebrityUpdate={mockOnCelebrityUpdate}
      />
    );

    // Navigate to projects tab
    fireEvent.click(screen.getByText('Projects'));

    // Click new project button
    fireEvent.click(screen.getByText('New Project'));

    // Fill in project details
    fireEvent.change(screen.getByPlaceholderText('Enter project title...'), {
      target: { value: 'New Project' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter budget...'), {
      target: { value: '500000' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter revenue potential...'), {
      target: { value: '2000000' }
    });

    // Create project
    fireEvent.click(screen.getByText('Create Project'));

    await waitFor(() => {
      expect(mockEngine.createProject).toHaveBeenCalled();
    });
  });

  it('displays opportunities correctly', () => {
    const mockOpportunities = [
      {
        id: '1',
        title: 'Lead Role in Blockbuster',
        type: 'movie',
        value: 5000000,
        required_popularity: 50
      }
    ];

    // Mock the engine directly as it's not imported in this file
    const mockEngine = {
      generateOpportunities: vi.fn().mockResolvedValue(mockOpportunities)
    };
    vi.mock('../../../lib/celebrity-management-engine', () => ({
      celebrityManagementEngine: mockEngine
    }));
    
    const mockOnCelebrityUpdate = vi.fn();
    
    render(
      <MultiIndustryCareerPanel
        celebrity={mockCelebrity}
        onCelebrityUpdate={mockOnCelebrityUpdate}
      />
    );

    // Navigate to opportunities tab
    fireEvent.click(screen.getByText('Opportunities'));

    expect(screen.getByText('Lead Role in Blockbuster')).toBeInTheDocument();
    expect(screen.getByText('$5,000,000')).toBeInTheDocument();
    expect(screen.getByText('movie')).toBeInTheDocument();
    expect(screen.getByText('Required Popularity: 50')).toBeInTheDocument();
  });

  it('displays milestones correctly', () => {
    const mockMilestones = [
      {
        id: '1',
        celebrity_id: '1',
        milestone_type: 'first_role' as any,
        title: 'First Major Role',
        description: 'Achieved first major acting role',
        achieved_date: new Date(),
        industry: 'acting' as any,
        impact_score: 85,
        rewards: [],
        created_at: new Date()
      }
    ];

    // Mock the engine directly as it's not imported in this file
    const mockEngine = {
      getCelebrityMilestones: vi.fn().mockResolvedValue(mockMilestones)
    };
    vi.mock('../../../lib/celebrity-management-engine', () => ({
      celebrityManagementEngine: mockEngine
    }));
    
    const mockOnCelebrityUpdate = vi.fn();
    
    render(
      <MultiIndustryCareerPanel
        celebrity={mockCelebrity}
        onCelebrityUpdate={mockOnCelebrityUpdate}
      />
    );

    // Navigate to milestones tab
    fireEvent.click(screen.getByText('Milestones'));

    expect(screen.getByText('First Major Role')).toBeInTheDocument();
    expect(screen.getByText('Achieved first major acting role')).toBeInTheDocument();
    expect(screen.getByText('Impact: 85')).toBeInTheDocument();
  });

  it('handles industry switching', async () => {
    const mockOnCelebrityUpdate = vi.fn();
    // Mock the engine directly as it's not imported in this file
    const mockEngine = {
      switchPrimaryIndustry: vi.fn().mockResolvedValue(true),
      getCelebrity: vi.fn().mockResolvedValue({
        ...mockCelebrity,
        primary_industry: 'music' as any
      })
    };
    vi.mock('../../../lib/celebrity-management-engine', () => ({
      celebrityManagementEngine: mockEngine
    }));
    
    render(
      <MultiIndustryCareerPanel
        celebrity={mockCelebrity}
        onCelebrityUpdate={mockOnCelebrityUpdate}
      />
    );

    // Click on music industry card
    fireEvent.click(screen.getByText('Music'));

    await waitFor(() => {
      expect(mockEngine.switchPrimaryIndustry).toHaveBeenCalledWith('1', 'music');
    });
  });

  it('shows empty states correctly', () => {
    const mockOnCelebrityUpdate = vi.fn();
    
    render(
      <MultiIndustryCareerPanel
        celebrity={mockCelebrity}
        onCelebrityUpdate={mockOnCelebrityUpdate}
      />
    );

    // Navigate to projects tab
    fireEvent.click(screen.getByText('Projects'));
    expect(screen.getByText('No active projects')).toBeInTheDocument();

    // Navigate to opportunities tab
    fireEvent.click(screen.getByText('Opportunities'));
    expect(screen.getByText('No opportunities available')).toBeInTheDocument();

    // Navigate to milestones tab
    fireEvent.click(screen.getByText('Milestones'));
    expect(screen.getByText('No milestones achieved yet')).toBeInTheDocument();
  });

  it('handles missing celebrity gracefully', () => {
    render(<MultiIndustryCareerPanel />);

    expect(screen.getByText('No celebrity selected')).toBeInTheDocument();
    expect(screen.getByText('Select a celebrity to manage their career')).toBeInTheDocument();
  });
}); 