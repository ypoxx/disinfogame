/**
 * Marina Petrova Analysis Strategy
 *
 * Marina is the Media Specialist who analyzes:
 * - World events (crisis opportunities)
 * - Reach and amplification efficiency
 * - Content strategy and targeting
 * - Media landscape vulnerabilities
 *
 * Personality: Ambitious, creative, confident, sometimes overconfident
 *
 * @module MarinaAnalysisStrategy
 */

import { storyLogger } from '../../../utils/logger';
import type {
  NPCAnalysisStrategy,
  NPCAnalysisContext,
  AdvisorRecommendation,
} from '../AdvisorRecommendation';
import { generateRecommendationId } from '../AdvisorRecommendation';

export class MarinaAnalysisStrategy implements NPCAnalysisStrategy {
  public getNPCName(): string {
    return 'Marina Petrova';
  }

  /**
   * Main analysis entry point
   * Marina analyzes from 4 perspectives (A-D)
   */
  public analyze(context: NPCAnalysisContext): AdvisorRecommendation[] {
    const recommendations: AdvisorRecommendation[] = [];

    try {
      // A) Opportunity Detection: Active World Events
      const eventOpportunities = this.analyzeWorldEvents(context);
      recommendations.push(...eventOpportunities);

      // B) Efficiency Analysis: Reach Stagnation
      const reachAnalysis = this.analyzeReachEfficiency(context);
      if (reachAnalysis) recommendations.push(reachAnalysis);

      // C) Strategy Warning: Unused Analysis
      const analysisWarning = this.checkUnusedAnalysis(context);
      if (analysisWarning) recommendations.push(analysisWarning);

      // D) Content Strategy: Media Landscape Analysis
      const mediaAnalysis = this.analyzeMediaLandscape(context);
      if (mediaAnalysis) recommendations.push(mediaAnalysis);

      storyLogger.debug('Marina analysis complete', {
        recommendations: recommendations.length,
      });
    } catch (error) {
      storyLogger.error('Error in Marina analysis', { error });
    }

    return recommendations;
  }

  /**
   * PATTERN A: Opportunity Detection - Active World Events
   *
   * Marina scans for crisis events that can be exploited
   * Crisis = Opportunity for disinformation campaigns
   */
  private analyzeWorldEvents(context: NPCAnalysisContext): AdvisorRecommendation[] {
    const recommendations: AdvisorRecommendation[] = [];
    const { gameState, npc, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Find active crisis or political events
    const exploitableEvents = gameState.worldEvents.filter(
      e => e.active && (e.type === 'crisis' || e.type === 'political' || e.type === 'scandal')
    );

    for (const event of exploitableEvents) {
      // Find relevant actions for this event
      const relevantActions = this.findEventRelevantActions(event, gameState.availableActions);

      if (relevantActions.length === 0) continue;

      // Determine priority based on event type and expiration
      let priority: 'critical' | 'high' | 'medium' = 'high';
      if (event.type === 'crisis') priority = 'critical'; // Crises are urgent
      if (currentPhase - event.phase > 2) priority = 'medium'; // Older events less urgent

      // Craft message based on relationship level
      const message = this.craftEventOpportunityMessage(event, playerRelationship);

      // Detailed reasoning (educational)
      const reasoning = `Event-Type: ${event.type}. ` +
        `Crisis events schaffen emotionale Vulnerabilität in der Bevölkerung. ` +
        `Wenn die Öffentlichkeit verwirrt oder verärgert ist, sind Desinformationskampagnen ` +
        `deutlich effektiver (+40% Impact). Window: ${3 - (currentPhase - event.phase)} Phasen verbleibend.`;

      recommendations.push({
        id: generateRecommendationId('marina', 'opportunity'),
        npcId: 'marina',
        priority,
        category: 'opportunity',
        message,
        reasoning,
        suggestedActions: relevantActions.map(a => a.id),
        phase: currentPhase,
        expiresPhase: event.phase + 3, // Events stay relevant for 3 phases
        confidence: 0.9,
        tone: 'enthusiastic',
      });
    }

    return recommendations;
  }

  /**
   * PATTERN B: Efficiency Analysis - Reach Stagnation
   *
   * Marina tracks reach growth and warns if amplification is insufficient
   */
  private analyzeReachEfficiency(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, metricsHistory, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Need at least 3 data points for trend analysis
    if (metricsHistory.reachHistory.length < 3) return null;

    const recentReach = metricsHistory.reachHistory.slice(-3);
    const growthRate = this.calculateGrowthRate(recentReach);

    // Warn if growth is below 10% over 3 phases
    if (growthRate < 10) {
      const currentReach = recentReach[recentReach.length - 1];

      // Find amplification actions
      const amplificationActions = gameState.availableActions.filter(a =>
        a.tags.includes('amplification') ||
        a.tags.includes('bots') ||
        a.tags.includes('infrastructure')
      );

      const message = playerRelationship > 1
        ? `Unsere Reichweite stagniert bei ${(currentReach / 1000000).toFixed(1)}M. ` +
          `Das ist inakzeptabel! Ich schlage vor: Botfarm ausbauen oder neue Plattformen erschließen.`
        : `Reichweite stagniert. Empfehle Amplifikations-Infrastruktur.`;

      const reasoning = `Reach-Wachstum: ${growthRate.toFixed(1)}% über 3 Phasen (Ziel: >10%). ` +
        `Ohne Amplifikations-Infrastruktur (Bots, Influencer-Netzwerke) bleibt unsere Wirkung begrenzt. ` +
        `Investition in Reichweite zahlt sich exponentiell aus.`;

      return {
        id: generateRecommendationId('marina', 'efficiency'),
        npcId: 'marina',
        priority: 'medium',
        category: 'efficiency',
        message,
        reasoning,
        suggestedActions: amplificationActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.8,
        tone: 'concerned',
      };
    }

    return null;
  }

  /**
   * PATTERN C: Strategy Warning - Unused Analysis
   *
   * Marina checks if player did analysis but didn't act on it
   */
  private checkUnusedAnalysis(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, actionHistory, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Check if player completed target analysis
    const analysisAction = actionHistory.find(a =>
      a.actionId === 'ta01_target_analysis' || a.actionId.includes('analyse')
    );

    if (!analysisAction) return null;

    const phasesSinceAnalysis = currentPhase - analysisAction.phase;

    // Check if player launched any campaigns since analysis
    const campaignActions = actionHistory.filter(a =>
      a.phase > analysisAction.phase &&
      (a.actionId.includes('campaign') || a.actionId.includes('kampagne'))
    );

    // Warn if analysis done but no campaigns for 5+ phases
    if (phasesSinceAnalysis > 5 && campaignActions.length === 0) {
      const priority = phasesSinceAnalysis > 10 ? 'high' : 'medium';

      // Find campaign actions
      const campaignOptions = gameState.availableActions.filter(a =>
        a.tags.includes('campaign') || a.tags.includes('content')
      );

      const message = playerRelationship > 2
        ? `Sie haben Zielgruppen analysiert vor ${phasesSinceAnalysis} Phasen, aber noch keine Kampagne gestartet. ` +
          `Die Daten veralten! Wir verlieren wertvolle Zeit.`
        : `Zielgruppenanalyse liegt ${phasesSinceAnalysis} Phasen zurück. ` +
          `Daten veralten. Kampagne starten!`;

      const reasoning = `Analyse-Phase: ${analysisAction.phase}, Aktuelle Phase: ${currentPhase}. ` +
        `Zielgruppen-Daten verlieren nach ~10 Phasen an Relevanz (Meinungen/Trends ändern sich). ` +
        `Analysis ohne Execution ist verschwendete Ressource.`;

      return {
        id: generateRecommendationId('marina', 'strategy'),
        npcId: 'marina',
        priority,
        category: 'strategy',
        message,
        reasoning,
        suggestedActions: campaignOptions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.85,
        tone: phasesSinceAnalysis > 10 ? 'urgent' : 'concerned',
      };
    }

    return null;
  }

  /**
   * PATTERN D: Content Strategy - Media Landscape Analysis
   *
   * Marina analyzes which media actors are vulnerable
   */
  private analyzeMediaLandscape(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Need actor data for this analysis
    if (!gameState.actors || gameState.actors.length === 0) return null;

    // Find vulnerable media actors (low trust)
    const vulnerableMedia = gameState.actors.filter(a =>
      a.category === 'media' && a.trust < 0.5
    );

    // Only recommend if we have 3+ vulnerable targets
    if (vulnerableMedia.length >= 3) {
      // Find media manipulation actions
      const mediaActions = gameState.availableActions.filter(a =>
        a.tags.includes('media') || a.tags.includes('manipulation')
      );

      const actorNames = vulnerableMedia.slice(0, 3).map(a => a.name).join(', ');

      const message = playerRelationship > 1
        ? `${vulnerableMedia.length} Medienakteure sind geschwächt (${actorNames}). ` +
          `Perfekter Zeitpunkt für eine koordinierte Desinformationskampagne!`
        : `${vulnerableMedia.length} Medien-Akteure verwundbar. Koordinierter Angriff empfohlen.`;

      const reasoning = `Geschwächte Mainstream-Medien (Trust <50%) ermöglichen es alternativen Narrativen, ` +
        `schneller Fuß zu fassen. Wenn das Publikum den etablierten Medien nicht mehr vertraut, ` +
        `werden sie empfänglicher für unsere Botschaften (+30% Effectiveness).`;

      return {
        id: generateRecommendationId('marina', 'opportunity'),
        npcId: 'marina',
        priority: 'medium',
        category: 'opportunity',
        message,
        reasoning,
        suggestedActions: mediaActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.75,
        tone: 'enthusiastic',
      };
    }

    return null;
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Find actions relevant to a world event
   * Matches event tags with action tags
   */
  private findEventRelevantActions(event: any, availableActions: any[]): any[] {
    const eventTags = event.tags || [];

    return availableActions.filter(action => {
      // Check if action tags overlap with event tags
      const actionTags = action.tags || [];
      const hasOverlap = actionTags.some((tag: string) =>
        eventTags.includes(tag) ||
        tag === 'crisis' ||
        tag === 'narrative' ||
        tag === 'campaign'
      );

      return hasOverlap;
    });
  }

  /**
   * Craft message based on player relationship level
   * Higher relationship = more personal, detailed messages
   */
  private craftEventOpportunityMessage(event: any, relationshipLevel: number): string {
    const eventName = event.name || 'Event';

    switch (relationshipLevel) {
      case 0: // Neutral
        return `Event "${eventName}" erkannt. Exploitierbar. Empfehle sofortige Kampagne.`;

      case 1: // Known
        return `Der ${eventName} ist eine gute Gelegenheit. Wir sollten schnell handeln.`;

      case 2: // Trusted
        return `Der ${eventName} ist perfekt für uns! Die Öffentlichkeit ist emotional - ` +
               `genau dann sind sie am empfänglichsten. Ich habe bereits Kampagnen-Ideen vorbereitet.`;

      case 3: // Loyal
        return `${eventName}! Das ist UNSERE Chance! Ich habe die ganze Nacht an Kampagnen-Konzepten ` +
               `gearbeitet. Vertrau mir, das wird ein Volltreffer. Wir müssen JETZT zuschlagen!`;

      default:
        return `${eventName} - Gelegenheit erkannt.`;
    }
  }

  /**
   * Calculate growth rate over array of values
   * Returns percentage growth
   */
  private calculateGrowthRate(values: number[]): number {
    if (values.length < 2) return 0;

    const first = values[0];
    const last = values[values.length - 1];

    if (first === 0) return 100; // Avoid division by zero

    return ((last - first) / first) * 100;
  }

  /**
   * Calculate trend direction and rate
   */
  private calculateTrend(values: number[]): { direction: string; rate: number } {
    if (values.length < 2) return { direction: 'stable', rate: 0 };

    const rate = this.calculateGrowthRate(values);

    let direction = 'stable';
    if (rate > 5) direction = 'increasing';
    if (rate < -5) direction = 'decreasing';

    return { direction, rate };
  }

  /**
   * Check if values are stagnating (very low growth)
   */
  private isStagnating(values: number[], threshold: number = 5): boolean {
    const rate = this.calculateGrowthRate(values);
    return Math.abs(rate) < threshold;
  }
}
