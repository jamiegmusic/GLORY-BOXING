import axe from 'axe-core';

export interface AccessibilityViolation {
  rule: string;
  description: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  nodes: number;
  help: string;
  helpUrl: string;
}

export interface AccessibilityReport {
  violations: AccessibilityViolation[];
  passes: number;
  timestamp: string;
  url: string;
}

export class AccessibilityAuditor {
  static async runAudit(element?: HTMLElement): Promise<axe.AxeResults> {
    const context = element ? { include: [element] } : undefined;
    
    return new Promise((resolve, reject) => {
      axe.run(context, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }

  static async auditCommentaryPanel(): Promise<AccessibilityReport> {
    const panel = document.querySelector('[data-testid="commentary-panel"]');
    if (panel) {
      const results = await this.runAudit(panel as HTMLElement);
      return this.generateReport(results, window.location.href);
    }
    const results = await this.runAudit();
    return this.generateReport(results, window.location.href);
  }

  static async auditTransitionsComponent(): Promise<AccessibilityReport> {
    const transitions = document.querySelector('[data-testid="transitions-component"]');
    if (transitions) {
      const results = await this.runAudit(transitions as HTMLElement);
      return this.generateReport(results, window.location.href);
    }
    return this.generateReport({ violations: [], passes: [] }, window.location.href);
  }

  static generateReport(results: axe.AxeResults, url: string): AccessibilityReport {
    const violations: AccessibilityViolation[] = results.violations.map(violation => ({
      rule: violation.id,
      description: violation.description,
      impact: violation.impact as AccessibilityViolation['impact'],
      nodes: violation.nodes.length,
      help: violation.help,
      helpUrl: violation.helpUrl,
    }));

    return {
      violations,
      passes: results.passes.length,
      timestamp: new Date().toISOString(),
      url,
    };
  }

  static async generateDetailedReport(): Promise<AccessibilityReport> {
    const results = await this.runAudit();
    return this.generateReport(results, window.location.href);
  }

  static getCriticalViolations(report: AccessibilityReport): AccessibilityViolation[] {
    return report.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
  }

  static getViolationCountByImpact(report: AccessibilityReport): Record<string, number> {
    return report.violations.reduce((acc, violation) => {
      acc[violation.impact] = (acc[violation.impact] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  static async exportReport(report: AccessibilityReport): Promise<string> {
    return JSON.stringify(report, null, 2);
  }
}

// Accessibility monitoring hook
export const useAccessibilityMonitoring = () => {
  const runAudit = async () => {
    try {
      const report = await AccessibilityAuditor.generateDetailedReport();
      const criticalViolations = AccessibilityAuditor.getCriticalViolations(report);
      
      if (criticalViolations.length > 0) {
        console.error('Critical accessibility violations detected:', criticalViolations);
        // Send to monitoring service
        await fetch('/api/accessibility-violations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
        });
      }
      
      return report;
    } catch (error) {
      console.error('Accessibility audit failed:', error);
      throw error;
    }
  };

  return { runAudit };
}; 