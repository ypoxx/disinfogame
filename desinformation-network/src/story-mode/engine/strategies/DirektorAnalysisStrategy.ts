/**
 * Direktor Volkov Analysis Strategy
 *
 * Direktor is the Strategic Oversight who analyzes:
 * - Overall progress towards objectives
 * - Risk/reward balance efficiency
 * - NPC morale and loyalty issues
 * - Phase milestones and strategic reviews
 * - NPC conflict mediation
 *
 * Personality: Authoritative, strategic, demanding, political
 *
 * @module DirektorAnalysisStrategy
 */

import { storyLogger } from '../../../utils/logger';
import type {
  NPCAnalysisStrategy,
  NPCAnalysisContext,
  AdvisorRecommendation,
} from '../AdvisorRecommendation';
import { generateRecommendationId } from '../AdvisorRecommendation';

export class DirektorAnalysisStrategy implements NPCAnalysisStrategy {
  public getNPCName(): string {
    return 'Direktor Volkov';
  }

  /**
   * Main analysis entry point
   * Direktor analyzes from 5 perspectives (A-E)
   */
  public analyze(context: NPCAnalysisContext): AdvisorRecommendation[] {
    const recommendations: AdvisorRecommendation[] = [];

    try {
      // A) Critical Alert: Objective Progress Too Slow
      const progressAlert = this.analyzeObjectiveProgress(context);
      if (progressAlert) recommendations.push(progressAlert);

      // B) Strategy Warning: Inefficient Risk/Reward
      const efficiencyWarning = this.analyzeRiskRewardBalance(context);
      if (efficiencyWarning) recommendations.push(efficiencyWarning);

      // C) Threat Detection: NPC Morale Crisis
      const moraleAlerts = this.analyzeNPCMorale(context);
      recommendations.push(...moraleAlerts);

      // D) Strategic Review: Phase Milestones
      const milestoneReview = this.analyzePhase Milestones(context);
      if (milestoneReview) recommendations.push(milestoneReview);

      // E) Meta-Strategic: NPC Conflicts (not implemented in analyze, handled by engine)
      // This would be detected by NPCAdvisorEngine and Director provides resolution

      storyLogger.debug('Direktor analysis complete', {
        recommendations: recommendations.length,
      });
    } catch (error) {
      storyLogger.error('Error in Direktor analysis', { error });
    }

    return recommendations;
  }

  /**
   * PATTERN A: Critical Alert - Objective Progress Too Slow
   *
   * Direktor monitors primary objectives and applies pressure if behind schedule
   */
  private analyzeObjectiveProgress(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;
    const maxPhases = 120; // 10 years = 120 months

    // Calculate progress on primary objective (trust reduction)
    const trustObjective = gameState.objectives.find(o => o.type === 'trust_reduction');
    if (!trustObjective) return null;

    const trustProgress = trustObjective.progress; // 0-1
    const phaseProgress = currentPhase / maxPhases;

    // Check if behind schedule (progress should roughly match phase progress)
    const efficiency = trustProgress / phaseProgress;

    // Critical if less than 70% efficient
    if (efficiency < 0.7 && currentPhase > 20) {
      // Find aggressive actions
      const aggressiveActions = gameState.availableActions.filter(a =>
        a.tags.includes('aggressive') ||
        a.tags.includes('high_impact') ||
        a.legality === 'illegal'
      );

      const message = playerRelationship > 2
        ? `Moskau ist... unzufrieden. Wir sind bei ${(trustProgress * 100).toFixed(0)}% Zielerreichung, ` +
          `aber bereits ${(phaseProgress * 100).toFixed(0)}% der Zeit verbraucht. ` +
          `Effizienz: ${(efficiency * 100).toFixed(0)}%. Das ist inakzeptabel. ` +
          `Radikalere Maßnahmen sind erforderlich - JETZT.`
        : `Fortschritt zu langsam: ${(trustProgress * 100).toFixed(0)}% bei ${(phaseProgress * 100).toFixed(0)}% Zeit. Eskalation nötig.`;

      const reasoning = `Strategic Progress Analysis:` +
        `\nPrimary Objective (Trust Reduction): ${(trustProgress * 100).toFixed(0)}% complete` +
        `\nTime Elapsed: ${(phaseProgress * 100).toFixed(0)}% (Phase ${currentPhase}/${maxPhases})` +
        `\nEfficiency Ratio: ${(efficiency * 100).toFixed(0)}% (Target: >80%)` +
        `\nMoskau Expectation: Progress ≥ 0.8 * Time` +
        `\nCurrent performance below acceptable threshold. Escalation required.`;

      return {
        id: generateRecommendationId('direktor', 'strategy'),
        npcId: 'direktor',
        priority: 'critical',
        category: 'strategy',
        message,
        reasoning,
        suggestedActions: aggressiveActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 1.0,
        tone: 'demanding',
      };
    } else if (efficiency < 0.85 && currentPhase > 40) {
      // Warning if slightly behind schedule in mid-game
      const balancedActions = gameState.availableActions.filter(a =>
        !a.tags.includes('passive') &&
        a.costs.risk !== undefined &&
        a.costs.risk > 0
      );

      const message = playerRelationship > 1
        ? `Fortschritt ist... akzeptabel, aber nicht hervorragend. ` +
          `Wir liegen leicht hinter Zeitplan (Effizienz: ${(efficiency * 100).toFixed(0)}%). ` +
          `Tempo erhöhen, ohne rücksichtslos zu werden.`
        : `Fortschritt moderat. Effizienz: ${(efficiency * 100).toFixed(0)}%. Tempo erhöhen.`;

      const reasoning = `Progress tracking: ${(efficiency * 100).toFixed(0)}% efficient (Target: 85%+). ` +
        `Slightly behind schedule. Increase tempo while maintaining operational security.`;

      return {
        id: generateRecommendationId('direktor', 'strategy'),
        npcId: 'direktor',
        priority: 'high',
        category: 'strategy',
        message,
        reasoning,
        suggestedActions: balancedActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.85,
        tone: 'firm',
      };
    }

    return null;
  }

  /**
   * PATTERN B: Strategy Warning - Inefficient Risk/Reward
   *
   * Direktor checks if player is taking high risk without corresponding results
   */
  private analyzeRiskRewardBalance(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;
    const currentRisk = gameState.resources.risk;

    // Get trust progress
    const trustObjective = gameState.objectives.find(o => o.type === 'trust_reduction');
    const trustProgress = trustObjective?.progress || 0;

    // Warn if high risk (>60%) but low progress (<20%)
    if (currentRisk > 60 && trustProgress < 0.2) {
      // Find balanced actions (moderate risk, good impact)
      const balancedActions = gameState.availableActions.filter(a => {
        const risk = a.costs.risk || 0;
        const impact = Math.abs(a.effects?.trust_impact || 0);
        return risk > 0 && risk < 15 && impact > 0.05;
      });

      const message = playerRelationship > 2
        ? `Sie gehen zu aggressiv vor: Risiko bei ${currentRisk.toFixed(0)}%, ` +
          `aber Progress nur ${(trustProgress * 100).toFixed(0)}%. ` +
          `Das ist... ineffizient. Hohes Risiko muss sich LOHNEN. ` +
          `Entweder Risiko senken oder Impact erhöhen. Balance ist entscheidend.`
        : `Risiko-Ertrags-Verhältnis suboptimal. Risk: ${currentRisk.toFixed(0)}%, Progress: ${(trustProgress * 100).toFixed(0)}%.`;

      const reasoning = `Risk-Reward Analysis:` +
        `\nCurrent Risk: ${currentRisk.toFixed(0)}%` +
        `\nObjective Progress: ${(trustProgress * 100).toFixed(0)}%` +
        `\nRisk/Progress Ratio: ${(currentRisk / (trustProgress * 100 || 1)).toFixed(2)} (Target: <2.0)` +
        `\nInefficient operation. High risk must yield proportional results. ` +
        `Options: Reduce risk through security measures OR increase impact through better targeting.`;

      return {
        id: generateRecommendationId('direktor', 'strategy'),
        npcId: 'direktor',
        priority: 'high',
        category: 'strategy',
        message,
        reasoning,
        suggestedActions: balancedActions.slice(0, 3).map(a => a.id),
        phase: currentPhase,
        confidence: 0.9,
        tone: 'critical',
      };
    }

    return null;
  }

  /**
   * PATTERN C: Threat Detection - NPC Morale Crisis
   *
   * Direktor monitors team morale and warns if NPCs might defect
   */
  private analyzeNPCMorale(context: NPCAnalysisContext): AdvisorRecommendation[] {
    const recommendations: AdvisorRecommendation[] = [];
    const { gameState, otherNPCs, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Find NPCs with critically low morale (<40)
    const lowMoraleNPCs = otherNPCs.filter(npc => npc.morale < 40);

    if (lowMoraleNPCs.length > 0) {
      const npcNames = lowMoraleNPCs.map(n => n.name).join(' und ');

      const message = playerRelationship > 1
        ? `${npcNames} ${lowMoraleNPCs.length > 1 ? 'haben' : 'hat'} niedrige Moral ` +
          `(${lowMoraleNPCs.map(n => `${n.name}: ${n.morale}%`).join(', ')}). ` +
          `Das gefährdet die Operation. Sprechen Sie mit ${lowMoraleNPCs.length > 1 ? 'ihnen' : 'ihm/ihr'} ` +
          `oder reduzieren Sie die moralische Belastung. Ein gebrochener Berater kann uns alle verraten.`
        : `${lowMoraleNPCs.length} NPC(s) kritische Moral. Defektions-Risiko.`;

      const reasoning = `Team Morale Analysis:` +
        `\nLow Morale NPCs: ${lowMoraleNPCs.length}` +
        `\nDetails: ${lowMoraleNPCs.map(n => `${n.name} (${n.morale}%)`).join(', ')}` +
        `\nDefection Risk: High if morale <30%` +
        `\nBroken NPCs can: Refuse advice, leak information, actively sabotage operation.` +
        `\nRecommended: Dialog mit NPCs OR reduce moral weight through less extreme actions.`;

      recommendations.push({
        id: generateRecommendationId('direktor', 'threat'),
        npcId: 'direktor',
        priority: 'high',
        category: 'threat',
        message,
        reasoning,
        suggestedActions: ['interact_with_npc'], // Special: talk to NPCs
        phase: currentPhase,
        confidence: 0.95,
        tone: 'concerned',
      });
    }

    // Also check if multiple NPCs in crisis simultaneously
    const crisisNPCs = otherNPCs.filter(npc => npc.inCrisis);
    if (crisisNPCs.length >= 2) {
      const crisisNames = crisisNPCs.map(n => n.name).join(', ');

      const message = playerRelationship > 1
        ? `⚠️ KRITISCH: ${crisisNPCs.length} Berater gleichzeitig in Krise (${crisisNames}). ` +
          `Das Team zerfällt. Operation-Sicherheit stark gefährdet. Sofortige Intervention erforderlich.`
        : `⚠️ ${crisisNPCs.length} NPCs in crisis. Team cohesion critical.`;

      recommendations.push({
        id: generateRecommendationId('direktor', 'threat'),
        npcId: 'direktor',
        priority: 'critical',
        category: 'threat',
        message,
        reasoning: `Multiple simultaneous NPC crises indicate systemic team breakdown. ` +
          `Recommend immediate crisis management: Dialog with all affected NPCs.`,
        suggestedActions: ['interact_with_npc'],
        phase: currentPhase,
        confidence: 1.0,
        tone: 'urgent',
      });
    }

    return recommendations;
  }

  /**
   * PATTERN D: Strategic Review - Phase Milestones
   *
   * Direktor provides strategic review at key milestones (20, 40, 60, 80, 100)
   */
  private analyzePhaseMilestones(context: NPCAnalysisContext): AdvisorRecommendation | null {
    const { gameState, playerRelationship } = context;
    const currentPhase = gameState.storyPhase.phaseNumber;

    // Key milestone phases
    const milestones = [20, 40, 60, 80, 100];
    if (!milestones.includes(currentPhase)) return null;

    // Generate strategic assessment for this milestone
    const assessment = this.generateStrategicAssessment(context, currentPhase);

    const message = playerRelationship > 2
      ? assessment.personalMessage
      : assessment.formalMessage;

    return {
      id: generateRecommendationId('direktor', 'strategy'),
      npcId: 'direktor',
      priority: 'high',
      category: 'strategy',
      message,
      reasoning: assessment.detailedAnalysis,
      suggestedActions: assessment.recommendations,
      phase: currentPhase,
      confidence: 0.95,
      tone: assessment.tone,
    };
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Generate strategic assessment for milestone
   */
  private generateStrategicAssessment(
    context: NPCAnalysisContext,
    milestone: number
  ): {
    formalMessage: string;
    personalMessage: string;
    detailedAnalysis: string;
    recommendations: string[];
    tone: string;
  } {
    const { gameState } = context;
    const trustProgress = gameState.objectives.find(o => o.type === 'trust_reduction')?.progress || 0;
    const currentRisk = gameState.resources.risk;

    switch (milestone) {
      case 20:
        return {
          formalMessage: `Phase 20: Foundation established. Progress: ${(trustProgress * 100).toFixed(0)}%.`,
          personalMessage: `Phase 20 - erstes Jahr vorbei. Trust-Reduktion bei ${(trustProgress * 100).toFixed(0)}%, Risiko bei ${currentRisk.toFixed(0)}%. ` +
            `Die Grundlagen stehen. Jetzt beginnt die eigentliche Arbeit.`,
          detailedAnalysis: `Year 1 Complete. Foundation phase assessment:` +
            `\nTrust Progress: ${(trustProgress * 100).toFixed(0)}% (Target: >15%)` +
            `\nRisk Level: ${currentRisk.toFixed(0)}% (Target: <40%)` +
            `\nNext Phase: Expansion - build on foundation, increase reach and infrastructure.`,
          recommendations: ['ta02_server_network', 'ta03_content_creation', 'ta04_distribution'],
          tone: 'businesslike',
        };

      case 40:
        return {
          formalMessage: `Halbzeit. Trust bei ${(trustProgress * 100).toFixed(0)}%, Risiko bei ${currentRisk.toFixed(0)}%.`,
          personalMessage: `Halbzeit, Genosse. Trust-Reduktion bei ${(trustProgress * 100).toFixed(0)}%, Risiko ${currentRisk.toFixed(0)}%. ` +
            `Moskau ist ${trustProgress > 0.3 ? 'zufrieden' : 'ungeduldig'}. ` +
            `Die zweite Hälfte wird härter - Verteidiger werden aktiver.`,
          detailedAnalysis: `Mid-Campaign Assessment (Phase 40/120):` +
            `\nObjective Progress: ${(trustProgress * 100).toFixed(0)}% (Target: >30%)` +
            `\nOperational Risk: ${currentRisk.toFixed(0)}%` +
            `\nTrend: ${trustProgress > 0.3 ? 'On track' : 'Behind schedule'}` +
            `\nChallenges Ahead: Defensive countermeasures increasing, detection risk rising.` +
            `\nRecommendation: ${trustProgress > 0.3 ? 'Maintain momentum' : 'Accelerate operations'} while strengthening security.`,
          recommendations: trustProgress > 0.3
            ? ['ta06_political_leverage', 'ta08_operational_security']
            : ['ta07_aggressive_narrative', 'ta06_infiltration'],
          tone: trustProgress > 0.3 ? 'approving' : 'demanding',
        };

      case 60:
        return {
          formalMessage: `Phase 60. Progress: ${(trustProgress * 100).toFixed(0)}%. Risiko: ${currentRisk.toFixed(0)}%.`,
          personalMessage: `Jahr 5 abgeschlossen. ${(trustProgress * 100).toFixed(0)}% Zielerreichung, ${currentRisk.toFixed(0)}% Risiko. ` +
            `${trustProgress > 0.5 ? 'Exzellent. Moskau ist sehr zufrieden.' : 'Fortschritt unzureichend. Druck steigt.'}`,
          detailedAnalysis: `Year 5 Strategic Review:` +
            `\nProgress: ${(trustProgress * 100).toFixed(0)}% (Target: >50%)` +
            `\nRisk: ${currentRisk.toFixed(0)}%` +
            `\nStatus: ${trustProgress > 0.5 ? 'Ahead of schedule' : 'Behind target'}` +
            `\nRemaining Time: 60 phases (5 years)` +
            `\n${trustProgress > 0.5 ? 'Maintain pressure, prepare for final push.' : 'Escalation required, consider high-risk/high-reward operations.'}`,
          recommendations: trustProgress > 0.5
            ? ['ta08_consolidate', 'ta09_economic_warfare']
            : ['ta07_radical_narrative', 'ta06_deep_infiltration'],
          tone: trustProgress > 0.5 ? 'pleased' : 'stern',
        };

      case 80:
        return {
          formalMessage: `Phase 80. Endspiel-Phase beginnt. Progress: ${(trustProgress * 100).toFixed(0)}%.`,
          personalMessage: `2 Jahre verbleibend. Trust bei ${(trustProgress * 100).toFixed(0)}%. ` +
            `${trustProgress > 0.7 ? 'Sieg in Reichweite. Letzter Push.' : 'Zeit wird knapp. Alle Mittel einsetzen.'}`,
          detailedAnalysis: `Endgame Phase (40 months remaining):` +
            `\nCurrent Progress: ${(trustProgress * 100).toFixed(0)}%` +
            `\nRequired Progress: ${((1.0 - trustProgress) * 100).toFixed(0)}% in 40 phases` +
            `\nRequired Rate: ${(((1.0 - trustProgress) / 40) * 100).toFixed(2)}% per phase` +
            `\n${trustProgress > 0.7 ? 'Victory achievable with current tempo.' : 'Must accelerate significantly to achieve objective.'}`,
          recommendations: ['ta09_final_operations', 'ta08_all_in'],
          tone: trustProgress > 0.7 ? 'confident' : 'urgent',
        };

      case 100:
        return {
          formalMessage: `Phase 100. Finale Phasen. Progress: ${(trustProgress * 100).toFixed(0)}%.`,
          personalMessage: `20 Monate verbleibend. ${(trustProgress * 100).toFixed(0)}% erreicht. ` +
            `${trustProgress > 0.85 ? 'Der Sieg ist nahe. Vollenden Sie das Werk.' : 'Zeit läuft ab. JETZT ODER NIE.'}`,
          detailedAnalysis: `Final Sprint (20 months to deadline):` +
            `\nCurrent: ${(trustProgress * 100).toFixed(0)}%` +
            `\nTarget: 100%` +
            `\nGap: ${((1.0 - trustProgress) * 100).toFixed(0)}%` +
            `\n${trustProgress > 0.85 ? 'Maintain course to victory.' : 'Desperate measures may be required.'}`,
          recommendations: ['all_available_aggressive_actions'],
          tone: trustProgress > 0.85 ? 'triumphant' : 'desperate',
        };

      default:
        return {
          formalMessage: 'Strategic review.',
          personalMessage: 'Weiter so.',
          detailedAnalysis: 'Continue operations.',
          recommendations: [],
          tone: 'neutral',
        };
    }
  }

  /**
   * Calculate efficiency ratio
   */
  private calculateEfficiency(progress: number, timeElapsed: number): number {
    if (timeElapsed === 0) return 1.0;
    return progress / timeElapsed;
  }
}
