/**
 * Alexei Petrov Analysis Strategy
 *
 * Alexei is the Technical Lead who analyzes:
 * - Security and risk levels
 * - Technical infrastructure adequacy
 * - Countermeasure threats
 * - Operational security
 *
 * Personality: Analytical, paranoid, perfectionist, overly cautious
 *
 * @module AlexeiAnalysisStrategy
 */

import { storyLogger } from '../../../utils/logger';
import type {
  NPCAnalysisStrategy,
  NPCAnalysisContext,
  AdvisorRecommendation,
} from '../AdvisorRecommendation';
import { generateRecommendationId } from '../AdvisorRecommendation';

export class AlexeiAnalysisStrategy implements NPCAnalysisStrategy {
  public getNPCName(): string {
    return 'Alexei Petrov';
  }

  /**
   * Main analysis entry point
   * Alexei analyzes from 4 perspectives (A-D)
   */
  public analyze(context: NPCAnalysisContext): AdvisorRecommendation[] {
    const recommendations: AdvisorRecommendation[] = [];

    try {
      // A) Critical Alert: High Risk
      const riskAlert = this.analyzeRiskLevel(context);
      if (riskAlert) recommendations.push(riskAlert);

      // B) Infrastructure Warning: Insufficient Capacity
      const infraWarning = this.analyzeInfrastructure(context);
      if (infraWarning) recommendations.push(infraWarning);

      // C) Threat Detection: Recent Countermeasures
      const countermeasureAlerts = this.analyzeCountermeasures(context);
      recommendations.push(...countermeasureAlerts);

      // D) Proactive Security: Risk Trending
      const trendWarning = this.analyzeRiskTrend(context);
      if (trendWarning) recommendations.push(trendWarning);

      storyLogger.debug('Alexei analysis complete', {
        recommendations: recommendations.length,
      });
    } catch (error) {
      storyLogger.error('Error in Alexei analysis', { error });
    }

    return recommendations;
  }

  /**
   * PATTERN A: Critical Alert - High Risk
   *
   * Alexei monitors risk level and issues urgent warnings
   * when detection becomes likely
   */
  private analyzeRiskLevel(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;
    const currentRisk = gameState.resources.risk;

    // Critical threshold: 70%
    // Warning threshold: 60%
    if (currentRisk >= 70) {
      // CRITICAL - Immediate danger
      const phasesUntilDetection = this.estimatePhasesUntilDetection(currentRisk);

      // Find security actions
      const securityActions = gameState.availableActions.filter(a =>
        a.tags.includes('security') ||
        a.tags.includes('cover_tracks') ||
        a.id.includes('ta08')
      );

      const message = playerRelationship > 1
        ? `⚠️ KRITISCH! Risiko bei ${currentRisk.toFixed(0)}%! ` +
          `Entdeckung wahrscheinlich in ${phasesUntilDetection} Phasen. ` +
          `Empfehle SOFORTIGE Sicherheitsmaßnahmen - das ist kein Spiel mehr!`
        : `⚠️ Risiko kritisch: ${currentRisk.toFixed(0)}%. Sofortige Aktion erforderlich.`;

      const reasoning = `Risk-Schwelle überschritten (>70%). ` +
        `Bei diesem Level sind Verteidiger aktiv auf der Suche nach Beweisen. ` +
        `Geschätzte Zeit bis Aufdeckung: ${phasesUntilDetection} Phasen. ` +
        `Operation-Kompromittierung droht. Sofortmaßnahmen: Cover Tracks, False Flags, Infrastruktur-Wechsel.`;

      return {
        id: generateRecommendationId('alexei', 'threat'),
        npcId: 'alexei',
        priority: 'critical',
        category: 'threat',
        message,
        reasoning,
        suggestedActions: securityActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.95,
        tone: 'urgent',
      };
    } else if (currentRisk >= 60) {
      // WARNING - Approaching danger zone
      const securityActions = gameState.availableActions.filter(a =>
        a.tags.includes('security') || a.tags.includes('operational_security')
      );

      const message = playerRelationship > 1
        ? `Risiko bei ${currentRisk.toFixed(0)}%. Wir nähern uns der kritischen Schwelle. ` +
          `Ich empfehle präventive Sicherheitsmaßnahmen, BEVOR es zu spät ist.`
        : `Risiko bei ${currentRisk.toFixed(0)}%. Präventive Maßnahmen empfohlen.`;

      const reasoning = `Risk-Level im Warnbereich (60-70%). ` +
        `Jetzt handeln ist günstiger als später reagieren. ` +
        `Proaktive Security-Investments reduzieren späteres Krisen-Management.`;

      return {
        id: generateRecommendationId('alexei', 'threat'),
        npcId: 'alexei',
        priority: 'high',
        category: 'threat',
        message,
        reasoning,
        suggestedActions: securityActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.85,
        tone: 'concerned',
      };
    }

    return null;
  }

  /**
   * PATTERN B: Infrastructure Warning - Insufficient Capacity
   *
   * Alexei checks if technical infrastructure can support operations
   */
  private analyzeInfrastructure(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, actionHistory, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Calculate infrastructure level based on completed actions
    const infrastructureLevel = this.calculateInfrastructureLevel(actionHistory);

    // Estimate complexity needed for next phase
    const nextPhaseComplexity = this.estimateNextPhaseComplexity(gameState.storyPhase.phaseName);

    // Warn if infrastructure is insufficient
    if (infrastructureLevel < nextPhaseComplexity) {
      const deficit = nextPhaseComplexity - infrastructureLevel;

      // Find infrastructure actions
      const infraActions = gameState.availableActions.filter(a =>
        a.tags.includes('infrastructure') ||
        a.id.includes('ta02')
      );

      const message = playerRelationship > 2
        ? `Ihre Infrastruktur ist unzureichend (Level ${infrastructureLevel}/${nextPhaseComplexity}). ` +
          `Ich habe die Berechnungen dreifach überprüft - ohne Upgrades werden Aktionen ` +
          `~30% teurer und ~20% risikoreicher. Das ist mathematisch unvermeidbar.`
        : `Infrastruktur-Defizit: ${deficit} Level. Upgrade empfohlen.`;

      const reasoning = `Infrastruktur-Level: ${infrastructureLevel}, Benötigt: ${nextPhaseComplexity}. ` +
        `Unzureichende Infrastruktur führt zu:` +
        `- +30% Kosten auf Aktionen (ineffiziente Prozesse)` +
        `- +20% Risiko (schlechtere Verschleierung)` +
        `- Längere Ausführungszeiten` +
        `Investment jetzt spart Ressourcen langfristig.`;

      return {
        id: generateRecommendationId('alexei', 'efficiency'),
        npcId: 'alexei',
        priority: 'high',
        category: 'efficiency',
        message,
        reasoning,
        suggestedActions: infraActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.9,
        tone: 'cautious',
      };
    }

    return null;
  }

  /**
   * PATTERN C: Threat Detection - Recent Countermeasures
   *
   * Alexei monitors defensive actor responses
   */
  private analyzeCountermeasures(context: NPCAnalysisContext): AdvisorRecommendation[] {
    const recommendations: AdvisorRecommendation[] = [];
    const { gameState, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Find recent countermeasures (last 2 phases)
    const recentCountermeasures = gameState.newsEvents.filter(e =>
      e.type === 'countermeasure' &&
      e.phase >= currentPhase - 2
    );

    if (recentCountermeasures.length > 0) {
      // Find defensive actions
      const defensiveActions = gameState.availableActions.filter(a =>
        a.tags.includes('defensive') ||
        a.tags.includes('adaptation') ||
        a.id.includes('ta08')
      );

      const countermeasureNames = recentCountermeasures
        .map(c => c.headline_de || c.description_de)
        .join('; ');

      const message = playerRelationship > 1
        ? `Gegner hat ${recentCountermeasures.length} Countermeasures aktiviert: ` +
          `"${countermeasureNames}". ` +
          `Unsere aktuellen Angriffsvektoren könnten kompromittiert sein. ` +
          `Ich empfehle dringend Taktikwechsel.`
        : `${recentCountermeasures.length} Countermeasures detektiert. Adaptation erforderlich.`;

      const reasoning = `Defensive Akteure reagieren auf unsere Operationen. ` +
        `Countermeasures: ${recentCountermeasures.length}. ` +
        `Kontinuierte Nutzung kompromittierter Taktiken erhöht Detection-Wahrscheinlichkeit exponentiell. ` +
        `Pivot erforderlich: Infrastruktur wechseln, Narrative anpassen, neue Kanäle nutzen.`;

      recommendations.push({
        id: generateRecommendationId('alexei', 'threat'),
        npcId: 'alexei',
        priority: 'high',
        category: 'threat',
        message,
        reasoning,
        suggestedActions: defensiveActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.88,
        tone: 'urgent',
      });
    }

    return recommendations;
  }

  /**
   * PATTERN D: Proactive Security - Risk Trending
   *
   * Alexei analyzes risk trends to predict future problems
   */
  private analyzeRiskTrend(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, metricsHistory, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Need at least 5 data points for trend analysis
    if (metricsHistory.riskHistory.length < 5) return null;

    const recentRisk = metricsHistory.riskHistory.slice(-5);
    const trendRate = this.calculateTrendRate(recentRisk);

    // Warn if risk is increasing by >5% per phase
    if (trendRate > 5) {
      const projectedRisk = gameState.resources.risk + (trendRate * 3);

      // Find preventive security actions
      const securityActions = gameState.availableActions.filter(a =>
        a.tags.includes('security') ||
        a.tags.includes('operational_security') ||
        a.id.includes('ta02_encryption') ||
        a.id.includes('ta08')
      );

      const message = playerRelationship > 1
        ? `Risiko steigt kontinuierlich (+${trendRate.toFixed(1)}% pro Phase). ` +
          `Wenn dieser Trend anhält, erreichen wir kritische Schwelle in ~3 Phasen. ` +
          `Präventive Maßnahmen JETZT empfohlen, bevor Notfall-Interventionen nötig werden.`
        : `Risiko-Trend: +${trendRate.toFixed(1)}%/Phase. Präventive Aktion empfohlen.`;

      const reasoning = `Risiko-Entwicklung zeigt konstanten Aufwärtstrend: +${trendRate.toFixed(1)}% pro Phase. ` +
        `Projected Risk in 3 Phasen: ${projectedRisk.toFixed(0)}%. ` +
        `Frühzeitige Intervention ist kostengünstiger als späteres Krisen-Management. ` +
        `Security-Investments jetzt verhindern teure Schadensbegrenzung später.`;

      return {
        id: generateRecommendationId('alexei', 'threat'),
        npcId: 'alexei',
        priority: 'medium',
        category: 'threat',
        message,
        reasoning,
        suggestedActions: securityActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.75,
        tone: 'concerned',
      };
    }

    return null;
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Estimate phases until detection based on risk level
   */
  private estimatePhasesUntilDetection(risk: number): number {
    if (risk >= 90) return 1;
    if (risk >= 80) return 2;
    if (risk >= 70) return 3;
    if (risk >= 60) return 5;
    return 10;
  }

  /**
   * Calculate infrastructure level from action history
   * Each infrastructure action adds to level
   */
  private calculateInfrastructureLevel(actionHistory: any[]): number {
    const infraActions = actionHistory.filter(a =>
      a.actionId.includes('ta02') || // Infrastructure phase actions
      a.actionId.includes('server') ||
      a.actionId.includes('encryption') ||
      a.actionId.includes('proxy') ||
      a.actionId.includes('infrastructure')
    );

    return Math.min(10, infraActions.length * 2); // Cap at 10
  }

  /**
   * Estimate complexity needed for upcoming phase
   * Later phases require more sophisticated infrastructure
   */
  private estimateNextPhaseComplexity(phaseName: string): number {
    // Extract phase number from name (e.g., "ta03" -> 3)
    const match = phaseName.match(/ta(\d+)/);
    if (!match) return 5; // Default complexity

    const phaseNum = parseInt(match[1], 10);

    // Complexity increases with phase
    if (phaseNum <= 2) return 3;
    if (phaseNum <= 4) return 5;
    if (phaseNum <= 6) return 7;
    return 9;
  }

  /**
   * Calculate trend rate (% change per phase)
   */
  private calculateTrendRate(values: number[]): number {
    if (values.length < 2) return 0;

    // Calculate average change between consecutive values
    let totalChange = 0;
    for (let i = 1; i < values.length; i++) {
      totalChange += values[i] - values[i - 1];
    }

    return totalChange / (values.length - 1);
  }

  /**
   * Check if value is increasing significantly
   */
  private isIncreasing(values: number[], threshold: number = 5): boolean {
    const rate = this.calculateTrendRate(values);
    return rate > threshold;
  }
}
