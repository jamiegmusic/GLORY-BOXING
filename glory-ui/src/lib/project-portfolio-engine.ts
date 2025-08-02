// Project Portfolio Management Engine
// Handles multi-project tracking, risk assessment, and portfolio diversification

import type { 
  Project, 
  ProjectTypeValue, 
  ProjectStatusValue,
  Celebrity,
  CelebrityIndustryValue
} from './unified-types';

export interface ProjectPortfolio {
  id: string;
  celebrity_id: string;
  projects: Project[];
  total_value: number;
  risk_score: number;
  diversification_score: number;
  industry_distribution: Record<CelebrityIndustryValue, number>;
  completion_rate: number;
  average_roi: number;
  created_at: Date;
  updated_at: Date;
}

export interface PortfolioRiskAssessment {
  overall_risk: 'low' | 'medium' | 'high';
  risk_factors: string[];
  risk_score: number; // 0-100
  mitigation_strategies: string[];
  recommended_actions: string[];
}

export interface ProjectDependency {
  project_id: string;
  depends_on: string[];
  blocks: string[];
  critical_path: boolean;
  slack_time: number;
}

export interface ResourceAllocation {
  project_id: string;
  budget_allocation: number;
  time_allocation: number;
  skill_allocation: Record<string, number>;
  priority_level: number;
}

export class ProjectPortfolioEngine {
  private portfolios: Map<string, ProjectPortfolio> = new Map();
  private dependencies: Map<string, ProjectDependency> = new Map();
  private resourceAllocations: Map<string, ResourceAllocation> = new Map();

  // ===== PORTFOLIO MANAGEMENT =====

  createPortfolio(celebrityId: string): ProjectPortfolio {
    const id = `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const portfolio: ProjectPortfolio = {
      id,
      celebrity_id: celebrityId,
      projects: [],
      total_value: 0,
      risk_score: 0,
      diversification_score: 0,
      industry_distribution: {
        acting: 0,
        music: 0,
        sports: 0,
        social_media: 0,
        modeling: 0,
        business: 0,
        comedy: 0,
        reality_tv: 0,
        fashion: 0,
        technology: 0
      },
      completion_rate: 0,
      average_roi: 0,
      created_at: now,
      updated_at: now
    };

    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  addProjectToPortfolio(portfolioId: string, project: Project): boolean {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) return false;

    portfolio.projects.push(project);
    this.updatePortfolioMetrics(portfolio);
    return true;
  }

  removeProjectFromPortfolio(portfolioId: string, projectId: string): boolean {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) return false;

    portfolio.projects = portfolio.projects.filter(p => p.id !== projectId);
    this.updatePortfolioMetrics(portfolio);
    return true;
  }

  // ===== RISK ASSESSMENT =====

  assessPortfolioRisk(portfolioId: string): PortfolioRiskAssessment {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    const riskFactors: string[] = [];
    let totalRiskScore = 0;
    let projectCount = 0;

    // Analyze each project's risk
    portfolio.projects.forEach(project => {
      const projectRisk = this.calculateProjectRisk(project);
      totalRiskScore += projectRisk;
      projectCount++;

      if (projectRisk > 70) {
        riskFactors.push(`High-risk project: ${project.title}`);
      }
    });

    // Calculate portfolio-level risks
    const averageRisk = projectCount > 0 ? totalRiskScore / projectCount : 0;
    
    // Concentration risk
    const industryConcentration = this.calculateIndustryConcentration(portfolio);
    if (industryConcentration > 0.6) {
      riskFactors.push('High industry concentration risk');
      totalRiskScore += 20;
    }

    // Resource allocation risk
    const resourceRisk = this.calculateResourceAllocationRisk(portfolio);
    if (resourceRisk > 0.7) {
      riskFactors.push('Resource allocation imbalance');
      totalRiskScore += 15;
    }

    // Dependency risk
    const dependencyRisk = this.calculateDependencyRisk(portfolio);
    if (dependencyRisk > 0.5) {
      riskFactors.push('Critical path dependency risk');
      totalRiskScore += 25;
    }

    const overallRiskScore = Math.min(100, totalRiskScore);
    const overallRisk: 'low' | 'medium' | 'high' = 
      overallRiskScore < 30 ? 'low' : 
      overallRiskScore < 60 ? 'medium' : 'high';

    const mitigationStrategies = this.generateMitigationStrategies(portfolio, riskFactors);
    const recommendedActions = this.generateRecommendedActions(portfolio, overallRiskScore);

    return {
      overall_risk: overallRisk,
      risk_factors: riskFactors,
      risk_score: overallRiskScore,
      mitigation_strategies: mitigationStrategies,
      recommended_actions: recommendedActions
    };
  }

  private calculateProjectRisk(project: Project): number {
    let riskScore = 0;

    // Risk level contribution
    switch (project.risk_level) {
      case 'low': riskScore += 20; break;
      case 'medium': riskScore += 50; break;
      case 'high': riskScore += 80; break;
    }

    // Budget risk
    if (project.budget > 1000000) riskScore += 15;
    if (project.budget < 10000) riskScore += 10;

    // Timeline risk
    const projectDuration = project.end_date ? 
      (new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24) : 0;
    if (projectDuration > 365) riskScore += 20;
    if (projectDuration < 30) riskScore += 10;

    // Status risk
    if (project.status === 'delayed') riskScore += 30;
    if (project.status === 'cancelled') riskScore += 50;

    return Math.min(100, riskScore);
  }

  private calculateIndustryConcentration(portfolio: ProjectPortfolio): number {
    const totalProjects = portfolio.projects.length;
    if (totalProjects === 0) return 0;

    const industryCounts = Object.values(portfolio.industry_distribution);
    const maxIndustryCount = Math.max(...industryCounts);
    return maxIndustryCount / totalProjects;
  }

  private calculateResourceAllocationRisk(portfolio: ProjectPortfolio): number {
    // Calculate resource allocation imbalance
    const allocations = Array.from(this.resourceAllocations.values())
      .filter(ra => portfolio.projects.some(p => p.id === ra.project_id));

    if (allocations.length === 0) return 0;

    const totalBudget = allocations.reduce((sum, ra) => sum + ra.budget_allocation, 0);
    const totalTime = allocations.reduce((sum, ra) => sum + ra.time_allocation, 0);

    const budgetVariance = this.calculateVariance(allocations.map(ra => ra.budget_allocation / totalBudget));
    const timeVariance = this.calculateVariance(allocations.map(ra => ra.time_allocation / totalTime));

    return (budgetVariance + timeVariance) / 2;
  }

  private calculateDependencyRisk(portfolio: ProjectPortfolio): number {
    const dependencies = Array.from(this.dependencies.values())
      .filter(dep => portfolio.projects.some(p => p.id === dep.project_id));

    if (dependencies.length === 0) return 0;

    const criticalPaths = dependencies.filter(dep => dep.critical_path).length;
    const totalDependencies = dependencies.length;

    return criticalPaths / totalDependencies;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }

  private generateMitigationStrategies(portfolio: ProjectPortfolio, riskFactors: string[]): string[] {
    const strategies: string[] = [];

    if (riskFactors.some(factor => factor.includes('High industry concentration'))) {
      strategies.push('Diversify into new industries');
      strategies.push('Reduce exposure to dominant industry');
    }

    if (riskFactors.some(factor => factor.includes('Resource allocation'))) {
      strategies.push('Reallocate resources across projects');
      strategies.push('Implement resource leveling');
    }

    if (riskFactors.some(factor => factor.includes('Critical path'))) {
      strategies.push('Add buffer time to critical path');
      strategies.push('Identify alternative project sequences');
    }

    if (riskFactors.some(factor => factor.includes('High-risk project'))) {
      strategies.push('Implement additional oversight');
      strategies.push('Develop contingency plans');
    }

    return strategies;
  }

  private generateRecommendedActions(portfolio: ProjectPortfolio, riskScore: number): string[] {
    const actions: string[] = [];

    if (riskScore > 70) {
      actions.push('Immediate portfolio review required');
      actions.push('Consider project cancellation for highest risk items');
      actions.push('Implement weekly risk monitoring');
    } else if (riskScore > 40) {
      actions.push('Monthly portfolio assessment');
      actions.push('Develop risk mitigation plans');
      actions.push('Monitor project dependencies closely');
    } else {
      actions.push('Quarterly portfolio review');
      actions.push('Continue current risk management practices');
    }

    return actions;
  }

  // ===== PORTFOLIO DIVERSIFICATION =====

  calculateDiversificationScore(portfolioId: string): number {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) return 0;

    const industries = Object.keys(portfolio.industry_distribution) as CelebrityIndustryValue[];
    const nonZeroIndustries = industries.filter(industry => portfolio.industry_distribution[industry] > 0);
    
    if (nonZeroIndustries.length === 0) return 0;

    // Calculate Herfindahl-Hirschman Index (HHI) for diversification
    const totalValue = Object.values(portfolio.industry_distribution).reduce((sum, val) => sum + val, 0);
    if (totalValue === 0) return 0;

    const marketShares = industries.map(industry => portfolio.industry_distribution[industry] / totalValue);
    const hhi = marketShares.reduce((sum, share) => sum + Math.pow(share, 2), 0);

    // Convert HHI to diversification score (0-100)
    // Lower HHI = higher diversification
    const diversificationScore = Math.max(0, 100 - (hhi * 100));
    
    return Math.round(diversificationScore);
  }

  recommendDiversification(portfolioId: string): string[] {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) return [];

    const recommendations: string[] = [];
    const industries = Object.keys(portfolio.industry_distribution) as CelebrityIndustryValue[];
    
    // Find underrepresented industries
    const totalValue = Object.values(portfolio.industry_distribution).reduce((sum, val) => sum + val, 0);
    const averageIndustryValue = totalValue / industries.length;

    industries.forEach(industry => {
      const industryValue = portfolio.industry_distribution[industry];
      if (industryValue < averageIndustryValue * 0.5) {
        recommendations.push(`Consider expanding into ${industry} industry`);
      }
    });

    // Check for over-concentration
    const maxIndustryValue = Math.max(...Object.values(portfolio.industry_distribution));
    if (maxIndustryValue > totalValue * 0.4) {
      const dominantIndustry = industries.find(industry => 
        portfolio.industry_distribution[industry] === maxIndustryValue
      );
      if (dominantIndustry) {
        recommendations.push(`Reduce concentration in ${dominantIndustry} industry`);
      }
    }

    return recommendations;
  }

  // ===== RESOURCE ALLOCATION =====

  optimizeResourceAllocation(portfolioId: string): ResourceAllocation[] {
    const portfolio = this.portfolios.get(portfolioId);
    if (!portfolio) return [];

    const allocations: ResourceAllocation[] = [];
    const totalBudget = portfolio.projects.reduce((sum, project) => sum + project.budget, 0);
    const totalRevenuePotential = portfolio.projects.reduce((sum, project) => sum + project.revenue_potential, 0);

    portfolio.projects.forEach(project => {
      // Calculate optimal allocation based on ROI and risk
      const projectROI = project.revenue_potential / project.budget;
      const projectRisk = this.calculateProjectRisk(project);
      const riskAdjustedROI = projectROI * (1 - projectRisk / 100);

      const optimalBudgetAllocation = (project.budget / totalBudget) * 100;
      const optimalTimeAllocation = this.calculateOptimalTimeAllocation(project);

      allocations.push({
        project_id: project.id,
        budget_allocation: optimalBudgetAllocation,
        time_allocation: optimalTimeAllocation,
        skill_allocation: this.calculateSkillAllocation(project),
        priority_level: this.calculatePriorityLevel(project, riskAdjustedROI)
      });
    });

    return allocations;
  }

  private calculateOptimalTimeAllocation(project: Project): number {
    // Calculate time allocation based on project complexity and duration
    const duration = project.end_date ? 
      (new Date(project.end_date).getTime() - new Date(project.start_date).getTime()) / (1000 * 60 * 60 * 24) : 30;
    
    const complexity = project.critical_success_factors.length;
    const teamSize = project.team_members.length;

    // Weight factors for time allocation
    const durationWeight = 0.4;
    const complexityWeight = 0.3;
    const teamWeight = 0.3;

    const normalizedDuration = Math.min(duration / 365, 1); // Normalize to 1 year
    const normalizedComplexity = Math.min(complexity / 10, 1);
    const normalizedTeamSize = Math.min(teamSize / 20, 1);

    return (normalizedDuration * durationWeight + 
            normalizedComplexity * complexityWeight + 
            normalizedTeamSize * teamWeight) * 100;
  }

  private calculateSkillAllocation(project: Project): Record<string, number> {
    // Calculate skill allocation based on project requirements
    const skillAllocation: Record<string, number> = {};
    
    // This would be enhanced with actual skill requirements analysis
    // For now, distribute evenly across common skills
    const commonSkills = ['acting', 'music', 'sports', 'social_media', 'business'];
    const allocationPerSkill = 100 / commonSkills.length;
    
    commonSkills.forEach(skill => {
      skillAllocation[skill] = allocationPerSkill;
    });

    return skillAllocation;
  }

  private calculatePriorityLevel(project: Project, riskAdjustedROI: number): number {
    // Calculate priority level (1-10) based on multiple factors
    let priority = 5; // Base priority

    // ROI contribution
    priority += riskAdjustedROI * 2;

    // Risk level contribution
    switch (project.risk_level) {
      case 'low': priority += 1; break;
      case 'medium': priority += 0; break;
      case 'high': priority -= 1; break;
    }

    // Status contribution
    switch (project.status) {
      case 'planning': priority += 1; break;
      case 'in_progress': priority += 2; break;
      case 'completed': priority -= 2; break;
      case 'delayed': priority -= 1; break;
    }

    return Math.max(1, Math.min(10, Math.round(priority)));
  }

  // ===== PROJECT DEPENDENCIES =====

  addProjectDependency(projectId: string, dependsOn: string[], blocks: string[] = []): ProjectDependency {
    const dependency: ProjectDependency = {
      project_id: projectId,
      depends_on: dependsOn,
      blocks: blocks,
      critical_path: this.isCriticalPath(projectId, dependsOn),
      slack_time: this.calculateSlackTime(projectId, dependsOn)
    };

    this.dependencies.set(projectId, dependency);
    return dependency;
  }

  private isCriticalPath(projectId: string, dependencies: string[]): boolean {
    // Determine if project is on critical path
    // This is a simplified implementation
    return dependencies.length > 0;
  }

  private calculateSlackTime(projectId: string, dependencies: string[]): number {
    // Calculate slack time for project
    // This is a simplified implementation
    return dependencies.length * 7; // 7 days per dependency
  }

  // ===== PORTFOLIO METRICS =====

  private updatePortfolioMetrics(portfolio: ProjectPortfolio): void {
    // Update total value
    portfolio.total_value = portfolio.projects.reduce((sum, project) => sum + project.budget, 0);

    // Update industry distribution
    portfolio.industry_distribution = this.calculateIndustryDistribution(portfolio.projects);

    // Update completion rate
    const completedProjects = portfolio.projects.filter(p => p.status === 'completed').length;
    portfolio.completion_rate = portfolio.projects.length > 0 ? 
      (completedProjects / portfolio.projects.length) * 100 : 0;

    // Update average ROI
    const totalRevenue = portfolio.projects.reduce((sum, project) => sum + project.revenue_potential, 0);
    portfolio.average_roi = portfolio.total_value > 0 ? 
      ((totalRevenue - portfolio.total_value) / portfolio.total_value) * 100 : 0;

    // Update diversification score
    portfolio.diversification_score = this.calculateDiversificationScore(portfolio.id);

    // Update risk score
    const riskAssessment = this.assessPortfolioRisk(portfolio.id);
    portfolio.risk_score = riskAssessment.risk_score;

    portfolio.updated_at = new Date();
  }

  private calculateIndustryDistribution(projects: Project[]): Record<CelebrityIndustryValue, number> {
    const distribution: Record<CelebrityIndustryValue, number> = {
      acting: 0,
      music: 0,
      sports: 0,
      social_media: 0,
      modeling: 0,
      business: 0,
      comedy: 0,
      reality_tv: 0,
      fashion: 0,
      technology: 0
    };

    projects.forEach(project => {
      if (distribution[project.industry] !== undefined) {
        distribution[project.industry] += project.budget;
      }
    });

    return distribution;
  }

  // ===== GETTER METHODS =====

  getPortfolio(portfolioId: string): ProjectPortfolio | null {
    return this.portfolios.get(portfolioId) || null;
  }

  getPortfolioByCelebrity(celebrityId: string): ProjectPortfolio | null {
    for (const portfolio of this.portfolios.values()) {
      if (portfolio.celebrity_id === celebrityId) {
        return portfolio;
      }
    }
    return null;
  }

  getProjectDependencies(projectId: string): ProjectDependency | null {
    return this.dependencies.get(projectId) || null;
  }

  getResourceAllocation(projectId: string): ResourceAllocation | null {
    return this.resourceAllocations.get(projectId) || null;
  }
}

// Export singleton instance
export const projectPortfolioEngine = new ProjectPortfolioEngine(); 