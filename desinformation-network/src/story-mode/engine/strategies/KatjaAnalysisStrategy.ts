/**
 * Katja Orlova Analysis Strategy
 *
 * Katja is the Field Operative who analyzes:
 * - Recruitment opportunities (vulnerable actors)
 * - Field operations balance
 * - Agent safety and compromise risks
 * - Crisis-driven recruitment timing
 *
 * Personality: Pragmatic, protective, risk-aware, people-focused
 *
 * @module KatjaAnalysisStrategy
 */

import { storyLogger } from '../../../utils/logger';
import type {
  NPCAnalysisStrategy,
  NPCAnalysisContext,
  AdvisorRecommendation,
} from '../AdvisorRecommendation';
import { generateRecommendationId } from '../AdvisorRecommendation';

export class KatjaAnalysisStrategy implements NPCAnalysisStrategy {
  public getNPCName(): string {
    return 'Katja Orlova';
  }

  /**
   * Main analysis entry point
   * Katja analyzes from 4 perspectives (A-D)
   */
  public analyze(context: NPCAnalysisContext): AdvisorRecommendation[] {
    const recommendations: AdvisorRecommendation[] = [];

    try {
      // A) Opportunity Detection: Recruitable Actors
      const recruitmentOpps = this.analyzeRecruitmentOpportunities(context);
      if (recruitmentOpps) recommendations.push(recruitmentOpps);

      // B) Strategy Warning: Neglected Field Operations
      const fieldWarning = this.analyzeFieldOperationsBalance(context);
      if (fieldWarning) recommendations.push(fieldWarning);

      // C) Threat Detection: Source Compromise
      const compromiseAlerts = this.analyzeAgentSafety(context);
      recommendations.push(...compromiseAlerts);

      // D) Tactical Opportunity: Event-Based Recruitment
      const eventRecruitment = this.analyzeEventRecruitment(context);
      if (eventRecruitment) recommendations.push(eventRecruitment);

      storyLogger.debug('Katja analysis complete', {
        recommendations: recommendations.length,
      });
    } catch (error) {
      storyLogger.error('Error in Katja analysis', { error });
    }

    return recommendations;
  }

  /**
   * PATTERN A: Opportunity Detection - Recruitable Actors
   *
   * Katja identifies vulnerable actors perfect for recruitment
   * Low trust + high influence = valuable asset
   */
  private analyzeRecruitmentOpportunities(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Need actor data
    if (!gameState.actors || gameState.actors.length === 0) return null;

    // Find recruitable targets: low trust, high influence, not yet recruited
    const recruitableActors = gameState.actors.filter(a =>
      a.trust < 0.4 && // Vulnerable (low trust)
      a.influence > 0.6 && // Valuable (high influence)
      !a.isRecruited &&
      ['expert', 'media', 'lobby'].includes(a.category) // Relevant categories
    );

    if (recruitableActors.length > 0) {
      // Find recruitment actions
      const recruitmentActions = gameState.availableActions.filter(a =>
        a.tags.includes('recruitment') ||
        a.id.includes('recruit') ||
        a.id.includes('ta01') ||
        a.id.includes('ta06_infiltrate')
      );

      const topTargets = recruitableActors.slice(0, 3);
      const targetNames = topTargets.map(a => a.name).join(', ');

      const message = playerRelationship > 1
        ? `Ich habe ${recruitableActors.length} potenzielle Kontakte identifiziert: ${targetNames}. ` +
          `Niedrige Trust-Level, hohe Reichweite - perfekte Targets. ` +
          `Diese Leute können unsere Multiplikatoren werden.`
        : `${recruitableActors.length} Recruitment-Targets identifiziert: ${targetNames}.`;

      const reasoning = `Recruitment-Analyse:` +
        `\nKandidaten: ${recruitableActors.length}` +
        `\nTop Targets: ${topTargets.map(a => `${a.name} (Trust: ${(a.trust * 100).toFixed(0)}%, Influence: ${(a.influence * 100).toFixed(0)}%)`).join('; ')}` +
        `\nLow trust + high influence = perfect recruitment targets. ` +
        `Enttäuschte oder desillusionierte Akteure mit großer Reichweite sind am empfänglichsten für unsere Botschaften.`;

      return {
        id: generateRecommendationId('katja', 'opportunity'),
        npcId: 'katja',
        priority: 'medium',
        category: 'opportunity',
        message,
        reasoning,
        suggestedActions: recruitmentActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.8,
        tone: 'pragmatic',
      };
    }

    return null;
  }

  /**
   * PATTERN B: Strategy Warning - Neglected Field Operations
   *
   * Katja warns if player focuses too much on digital and neglects human assets
   */
  private analyzeFieldOperationsBalance(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, actionHistory, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Only relevant after phase 30
    if (currentPhase < 30) return null;

    // Count field operations
    const fieldActions = actionHistory.filter(a =>
      a.actionId.includes('recruit') ||
      a.actionId.includes('infiltrate') ||
      a.actionId.includes('ta01') ||
      a.actionId.includes('ta06')
    );

    const digitalActions = actionHistory.filter(a =>
      a.actionId.includes('bot') ||
      a.actionId.includes('social') ||
      a.actionId.includes('ta04') ||
      a.actionId.includes('ta05')
    );

    const fieldCount = fieldActions.length;
    const digitalCount = digitalActions.length;

    // Warn if field operations severely neglected (less than 20% of digital)
    if (fieldCount < 2 && digitalCount > 10) {
      // Find field operation actions
      const fieldOps = gameState.availableActions.filter(a =>
        a.tags.includes('field_ops') ||
        a.tags.includes('recruitment') ||
        a.tags.includes('infiltration')
      );

      const message = playerRelationship > 2
        ? `Sie fokussieren zu stark auf digitale Ops (${digitalCount} Aktionen) und vernachlässigen Feldarbeit (${fieldCount} Aktionen). ` +
          `Das ist... unbalanciert. Menschliche Assets sind unverzichtbar für Glaubwürdigkeit und Ground Truth.`
        : `Feldarbeit vernachlässigt: ${fieldCount} vs ${digitalCount} Digital-Ops. Balance empfohlen.`;

      const reasoning = `Operations Balance Analysis:` +
        `\nField Operations: ${fieldCount}` +
        `\nDigital Operations: ${digitalCount}` +
        `\nRatio: ${((fieldCount / (digitalCount || 1)) * 100).toFixed(0)}% (Ziel: >20%)` +
        `\nRein digitale Kampagnen fehlt Legitimität. ` +
        `Human assets provide: Ground truth, credibility, insider intelligence, narrative authenticity.`;

      return {
        id: generateRecommendationId('katja', 'strategy'),
        npcId: 'katja',
        priority: 'medium',
        category: 'strategy',
        message,
        reasoning,
        suggestedActions: fieldOps.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.75,
        tone: 'concerned',
      };
    }

    return null;
  }

  /**
   * PATTERN C: Threat Detection - Source Compromise
   *
   * Katja monitors recruited agents and warns if they're compromised
   */
  private analyzeAgentSafety(context: NPCAnalysisContext): AdvisorRecommendation[] {
    const recommendations: AdvisorRecommendation[] = [];
    const { gameState, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Need actor data with recruitment status
    if (!gameState.actors || gameState.actors.length === 0) return [];

    // Find recruited agents under suspicion
    const compromisedAgents = gameState.actors.filter(a =>
      a.isRecruited &&
      a.suspicionLevel !== undefined &&
      a.suspicionLevel > 0.7 // High suspicion = compromised
    );

    if (compromisedAgents.length > 0) {
      // Find defensive actions (burn assets, exfiltrate, etc.)
      const defensiveActions = gameState.availableActions.filter(a =>
        a.tags.includes('defensive') ||
        a.tags.includes('counter_intelligence') ||
        a.id.includes('burn') ||
        a.id.includes('exfiltrate')
      );

      const agentNames = compromisedAgents.map(a => a.name).join(', ');

      const message = playerRelationship > 1
        ? `⚠️ ${compromisedAgents.length} unserer Kontakte stehen unter Verdacht: ${agentNames}. ` +
          `Suspicion-Levels kritisch. Empfehle sofortigen Kontaktabbruch oder Exfiltration. ` +
          `Ein kompromittierter Agent kann das gesamte Netzwerk auffliegen lassen.`
        : `⚠️ ${compromisedAgents.length} Agents kompromittiert: ${agentNames}. Defensive Aktion erforderlich.`;

      const reasoning = `Agent Compromise Analysis:` +
        `\nKompromittierte Assets: ${compromisedAgents.length}` +
        `\nDetails: ${compromisedAgents.map(a => `${a.name} (Suspicion: ${(a.suspicionLevel! * 100).toFixed(0)}%)`).join('; ')}` +
        `\nAgent compromise risiko: Cascade failure des gesamten Networks. ` +
        `Cut losses now or risk complete exposure. Options: Burn assets, exfiltrate, false flag attribution.`;

      recommendations.push({
        id: generateRecommendationId('katja', 'threat'),
        npcId: 'katja',
        priority: 'high',
        category: 'threat',
        message,
        reasoning,
        suggestedActions: defensiveActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.9,
        tone: 'urgent',
      });
    }

    return recommendations;
  }

  /**
   * PATTERN D: Tactical Opportunity - Event-Based Recruitment
   *
   * Katja identifies crisis events that make people more receptive to recruitment
   */
  private analyzeEventRecruitment(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Find active crisis, political, or scandal events
    const recruitmentEvents = gameState.worldEvents.filter(e =>
      e.active &&
      (e.type === 'political' || e.type === 'scandal' || e.type === 'crisis')
    );

    if (recruitmentEvents.length > 0) {
      const event = recruitmentEvents[0]; // Focus on most recent

      // Find recruitment actions
      const recruitmentActions = gameState.availableActions.filter(a =>
        a.tags.includes('recruitment') ||
        a.tags.includes('exploitation') ||
        a.id.includes('recruit')
      );

      const message = playerRelationship > 1
        ? `Der ${event.name} schafft Unzufriedenheit und Desillusionierung. ` +
          `Perfekter Zeitpunkt für Rekrutierung - Menschen sind in Krisenzeiten deutlich empfänglicher. ` +
          `Wir sollten diese emotionale Vulnerabilität nutzen.`
        : `Event "${event.name}" = Recruitment-Opportunity. Emotionale Vulnerabilität.`;

      const reasoning = `Event-Driven Recruitment Analysis:` +
        `\nEvent: ${event.name} (${event.type})` +
        `\nCrisis events schaffen ideologische Vulnerabilität. ` +
        `Menschen in Krisenzeiten suchen nach Erklärungen und Schuldigen - ` +
        `das macht sie empfänglicher für alternative Narrative (+40% Recruitment Success Rate). ` +
        `Window: ${3 - (currentPhase - event.phase)} Phasen.`;

      return {
        id: generateRecommendationId('katja', 'opportunity'),
        npcId: 'katja',
        priority: 'medium',
        category: 'opportunity',
        message,
        reasoning,
        suggestedActions: recruitmentActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        expiresPhase: event.phase + 3, // Event window
        confidence: 0.8,
        tone: 'pragmatic',
      };
    }

    return null;
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Check if actor is suitable recruitment target
   */
  private isRecruitmentTarget(actor: any): boolean {
    return (
      actor.trust < 0.4 && // Vulnerable
      actor.influence > 0.6 && // Valuable
      !actor.isRecruited &&
      ['expert', 'media', 'lobby'].includes(actor.category)
    );
  }

  /**
   * Calculate recruitment difficulty based on actor properties
   */
  private calculateRecruitmentDifficulty(actor: any): number {
    let difficulty = 0.5; // Base difficulty

    // Lower trust = easier recruitment
    difficulty -= (1 - actor.trust) * 0.3;

    // Higher influence = harder (more scrutinized)
    difficulty += actor.influence * 0.2;

    return Math.max(0.1, Math.min(0.9, difficulty));
  }
}
