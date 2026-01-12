/**
 * Igor Smirnov Analysis Strategy
 *
 * Igor is the Financial Analyst who analyzes:
 * - Budget levels and spending patterns
 * - ROI (Return on Investment) of actions
 * - Cost-effectiveness and efficiency
 * - Long-term financial sustainability
 *
 * Personality: Conservative, analytical, cautious, pragmatic
 *
 * @module IgorAnalysisStrategy
 */

import { storyLogger } from '../../../utils/logger';
import type {
  NPCAnalysisStrategy,
  NPCAnalysisContext,
  AdvisorRecommendation,
  ROIAnalysis,
} from '../AdvisorRecommendation';
import { generateRecommendationId } from '../AdvisorRecommendation';

export class IgorAnalysisStrategy implements NPCAnalysisStrategy {
  public getNPCName(): string {
    return 'Igor Smirnov';
  }

  /**
   * Main analysis entry point
   * Igor analyzes from 4 perspectives (A-D)
   */
  public analyze(context: NPCAnalysisContext): AdvisorRecommendation[] {
    const recommendations: AdvisorRecommendation[] = [];

    try {
      // A) Critical Alert: Low Budget
      const budgetAlert = this.analyzeBudgetLevel(context);
      if (budgetAlert) recommendations.push(budgetAlert);

      // B) Efficiency Analysis: Low ROI Actions
      const roiAnalysis = this.analyzeROI(context);
      if (roiAnalysis) recommendations.push(roiAnalysis);

      // C) Strategic Opportunity: Front Companies
      const frontOpportunity = this.analyzeFrontCompanies(context);
      if (frontOpportunity) recommendations.push(frontOpportunity);

      // D) Budget Planning: Upcoming Expensive Phase
      const planningWarning = this.analyzeFutureBudgetNeeds(context);
      if (planningWarning) recommendations.push(planningWarning);

      storyLogger.debug('Igor analysis complete', {
        recommendations: recommendations.length,
      });
    } catch (error) {
      storyLogger.error('Error in Igor analysis', { error });
    }

    return recommendations;
  }

  /**
   * PATTERN A: Critical Alert - Low Budget
   *
   * Igor monitors budget and warns when funds run low
   */
  private analyzeBudgetLevel(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    const currentBudget = gameState.resources.budget;
    const maxBudget = gameState.resources.maxBudget;
    const budgetPercentage = (currentBudget / maxBudget) * 100;

    // Critical threshold: 30%
    // Warning threshold: 50%
    if (budgetPercentage < 30) {
      // CRITICAL - Very low funds
      const cheapActions = this.getCheapActions(gameState.availableActions);

      const message = playerRelationship > 1
        ? `Budget kritisch niedrig: ${currentBudget.toFixed(0)}k von ${maxBudget.toFixed(0)}k ` +
          `(${budgetPercentage.toFixed(0)}%). Das ist... besorgniserregend. ` +
          `Priorisieren Sie kostengünstige Aktionen oder warten Sie auf nächste Phase-Finanzierung.`
        : `Budget kritisch: ${budgetPercentage.toFixed(0)}%. Kostengünstige Aktionen empfohlen.`;

      const reasoning = `Verfügbare Mittel: ${currentBudget.toFixed(0)}k (${budgetPercentage.toFixed(0)}% von Maximum). ` +
        `Kritische Schwelle unterschritten (<30%). ` +
        `Risiko operativer Paralyse wenn keine Einnahmen in nächsten Phasen. ` +
        `Empfehlung: Fokus auf low-cost/high-impact Aktionen oder Budget-Generierung.`;

      return {
        id: generateRecommendationId('igor', 'threat'),
        npcId: 'igor',
        priority: 'high',
        category: 'threat',
        message,
        reasoning,
        suggestedActions: cheapActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.95,
        tone: 'concerned',
      };
    } else if (budgetPercentage < 50) {
      // WARNING - Budget getting low
      const cheapActions = this.getCheapActions(gameState.availableActions);

      const message = playerRelationship > 1
        ? `Budget bei ${budgetPercentage.toFixed(0)}% (${currentBudget.toFixed(0)}k). ` +
          `Noch nicht kritisch, aber ich empfehle vorsichtiges Spending. ` +
          `Die Zahlen lügen nicht.`
        : `Budget bei ${budgetPercentage.toFixed(0)}%. Vorsicht empfohlen.`;

      const reasoning = `Budget-Status: ${budgetPercentage.toFixed(0)}%. ` +
        `Warnbereich (30-50%). Konservatives Budget-Management empfohlen um kritische Situation zu vermeiden.`;

      return {
        id: generateRecommendationId('igor', 'efficiency'),
        npcId: 'igor',
        priority: 'medium',
        category: 'efficiency',
        message,
        reasoning,
        suggestedActions: cheapActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.85,
        tone: 'cautious',
      };
    }

    return null;
  }

  /**
   * PATTERN B: Efficiency Analysis - Low ROI Actions
   *
   * Igor tracks cost-effectiveness and warns about inefficient spending
   */
  private analyzeROI(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, actionHistory, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Need at least 5 actions to analyze
    if (actionHistory.length < 5) return null;

    // Analyze last 5 actions
    const recentActions = actionHistory.slice(-5);
    const roiAnalyses = recentActions.map(action => this.calculateROI(action));

    // Find low ROI actions (ROI < 0.1 = less than 0.1 trust impact per 10k budget)
    const lowROIActions = roiAnalyses.filter(analysis =>
      analysis.roi < 0.1 && !analysis.isEfficient
    );

    if (lowROIActions.length >= 2) {
      // Multiple inefficient actions detected
      const actionNames = lowROIActions.map(a => a.actionId).join(', ');
      const avgROI = this.calculateAverageROI(roiAnalyses);

      // Find high-ROI alternatives
      const highROIActions = gameState.availableActions.filter(a =>
        this.estimateActionROI(a) > 0.15
      );

      const message = playerRelationship > 2
        ? `Ich habe die Zahlen durchgerechnet. Diese Aktionen waren ineffizient: ${actionNames}. ` +
          `Durchschnittlicher ROI: ${avgROI.toFixed(2)} (Ziel: >0.15). ` +
          `Das ist... nicht akzeptabel. Ich habe bessere Alternativen identifiziert.`
        : `Aktionen ineffizient: ${actionNames}. Bessere ROI-Optionen verfügbar.`;

      const reasoning = `ROI-Analyse der letzten 5 Aktionen:` +
        `\nDurchschnittlicher Impact pro 10k Budget: ${avgROI.toFixed(2)} (Ziel: >0.15)` +
        `\nIneffiziente Aktionen (ROI <0.10): ${lowROIActions.length}` +
        `\nRecommended: Fokus auf high-leverage Aktionen die mehr Impact pro investiertem Euro generieren.`;

      return {
        id: generateRecommendationId('igor', 'efficiency'),
        npcId: 'igor',
        priority: 'medium',
        category: 'efficiency',
        message,
        reasoning,
        suggestedActions: highROIActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.8,
        tone: 'neutral',
      };
    }

    return null;
  }

  /**
   * PATTERN C: Strategic Opportunity - Front Companies
   *
   * Igor recommends establishing fronts for long-term cost reduction
   */
  private analyzeFrontCompanies(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, actionHistory, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Only relevant after phase 20
    if (currentPhase < 20) return null;

    // Check if player has established front companies
    const hasFrontCompanies = actionHistory.some(a =>
      a.actionId.includes('front') ||
      a.actionId.includes('shell') ||
      a.actionId === 'ta05_establish_front'
    );

    if (!hasFrontCompanies) {
      // Calculate potential savings
      const potentialSavings = this.calculateFrontCompanySavings(actionHistory, gameState);

      // Find front company actions
      const frontActions = gameState.availableActions.filter(a =>
        a.id.includes('front') ||
        a.id.includes('ta05_establish') ||
        a.tags.includes('infrastructure')
      );

      const message = playerRelationship > 1
        ? `Sie haben keine Tarnfirmen etabliert (Phase ${currentPhase}). ` +
          `Das ist... suboptimal. Tarnfirmen reduzieren langfristig Kosten um ~15% und Risiko um ~10%. ` +
          `Geschätzte Ersparnis über nächste 20 Phasen: ${potentialSavings.toFixed(0)}k.`
        : `Tarnfirmen fehlen. Langfrist-Ersparnis: ~${potentialSavings.toFixed(0)}k.`;

      const reasoning = `Front Companies nicht etabliert nach Phase 20. ` +
        `Financial Impact Analysis:` +
        `\n- Cost Reduction: ~15% auf zukünftige Aktionen` +
        `\n- Risk Reduction: ~10% (bessere Verschleierung)` +
        `\n- Projected Savings (20 Phasen): ${potentialSavings.toFixed(0)}k` +
        `\nInitial Investment amortisiert sich in ~5 Phasen.`;

      return {
        id: generateRecommendationId('igor', 'strategy'),
        npcId: 'igor',
        priority: 'medium',
        category: 'strategy',
        message,
        reasoning,
        suggestedActions: frontActions.slice(0, 2).map(a => a.id),
        phase: currentPhase,
        confidence: 0.85,
        tone: 'cautious',
      };
    }

    return null;
  }

  /**
   * PATTERN D: Budget Planning - Upcoming Expensive Phase
   *
   * Igor forecasts future costs and warns if budget insufficient
   */
  private analyzeFutureBudgetNeeds(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;
    const currentBudget = gameState.resources.budget;

    // Get actions that will be available in next phase
    const nextPhaseName = this.getNextPhaseName(gameState.storyPhase.phaseName);
    const nextPhaseActions = gameState.availableActions.filter(a =>
      a.phase === nextPhaseName
    );

    if (nextPhaseActions.length === 0) return null;

    // Calculate average cost of next phase actions
    const avgCost = this.calculateAverageCost(nextPhaseActions);
    const recommendedBuffer = avgCost * 3; // Should have budget for ~3 actions

    // Warn if budget < recommended buffer
    if (currentBudget < recommendedBuffer) {
      const deficit = recommendedBuffer - currentBudget;

      // Find budget-generating or cheap actions
      const budgetActions = gameState.availableActions.filter(a =>
        a.tags.includes('fundraising') ||
        a.tags.includes('economic') ||
        a.id.includes('ta09')
      );

      const message = playerRelationship > 1
        ? `Nächste Phase (${nextPhaseName}) wird teuer (Ø ${avgCost.toFixed(0)}k pro Aktion). ` +
          `Aktuelles Budget: ${currentBudget.toFixed(0)}k. Deficit: ${deficit.toFixed(0)}k. ` +
          `Empfehle: Entweder jetzt konservativ sparen oder Budget-Generierung fokussieren.`
        : `Next phase expensive. Budget insufficient. Deficit: ${deficit.toFixed(0)}k.`;

      const reasoning = `Budget Forecast Analysis:` +
        `\nCurrent Budget: ${currentBudget.toFixed(0)}k` +
        `\nNext Phase Avg Cost: ${avgCost.toFixed(0)}k` +
        `\nRecommended Buffer: ${recommendedBuffer.toFixed(0)}k (3x avg cost)` +
        `\nDeficit: ${deficit.toFixed(0)}k` +
        `\nRecommendation: Conservative spending now or focus on revenue generation.`;

      return {
        id: generateRecommendationId('igor', 'strategy'),
        npcId: 'igor',
        priority: 'medium',
        category: 'strategy',
        message,
        reasoning,
        suggestedActions: budgetActions.slice(0, 2).map(a => a.id),
        phase: currentPhase,
        confidence: 0.75,
        tone: 'cautious',
      };
    }

    return null;
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Get cheap actions (budget cost < 30k)
   */
  private getCheapActions(availableActions: any[]): any[] {
    return availableActions
      .filter(a => (a.costs.budget || 0) < 30)
      .sort((a, b) => (a.costs.budget || 0) - (b.costs.budget || 0));
  }

  /**
   * Calculate ROI for a single action
   */
  private calculateROI(action: any): ROIAnalysis {
    const cost = action.costs.budget || 1; // Avoid division by zero
    const impact = Math.abs(action.effects?.trustImpact || 0);
    const roi = impact / (cost / 10); // Impact per 10k budget

    return {
      actionId: action.actionId,
      cost,
      impact,
      roi,
      isEfficient: roi > 0.15,
    };
  }

  /**
   * Estimate ROI for an available action (before execution)
   */
  private estimateActionROI(action: any): number {
    const cost = action.costs.budget || 1;
    const estimatedImpact = action.effects?.trust_impact || 0.1;
    return Math.abs(estimatedImpact) / (cost / 10);
  }

  /**
   * Calculate average ROI across multiple analyses
   */
  private calculateAverageROI(analyses: ROIAnalysis[]): number {
    if (analyses.length === 0) return 0;
    const sum = analyses.reduce((acc, a) => acc + a.roi, 0);
    return sum / analyses.length;
  }

  /**
   * Calculate average cost of actions
   */
  private calculateAverageCost(actions: any[]): number {
    if (actions.length === 0) return 50; // Default

    const costs = actions.map(a => a.costs.budget || 0);
    const sum = costs.reduce((acc, cost) => acc + cost, 0);
    return sum / costs.length;
  }

  /**
   * Calculate potential savings from front companies
   */
  private calculateFrontCompanySavings(
    actionHistory: any[],
    gameState: any
  ): number {
    // Estimate based on past spending
    const recentSpending = actionHistory
      .slice(-10)
      .reduce((sum, a) => sum + (a.costs.budget || 0), 0);

    const avgSpendingPerPhase = recentSpending / Math.min(10, actionHistory.length);

    // Front companies save ~15% over 20 phases
    const projectedSpending = avgSpendingPerPhase * 20;
    const savings = projectedSpending * 0.15;

    return savings;
  }

  /**
   * Get next phase name based on current phase
   */
  private getNextPhaseName(currentPhase: string): string {
    const match = currentPhase.match(/ta(\d+)/);
    if (!match) return 'ta02';

    const currentNum = parseInt(match[1], 10);
    const nextNum = currentNum + 1;

    return `ta${nextNum.toString().padStart(2, '0')}`;
  }
}
