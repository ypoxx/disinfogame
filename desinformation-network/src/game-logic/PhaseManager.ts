/**
 * PhaseManager -- Extracted from StoryEngineAdapter (Strangler Fig)
 *
 * Orchestrates a phase transition by calling into deps for all subsystem operations:
 * 1. Transition to next phase, check game end
 * 2. Clean up expired opportunity windows & combo progress
 * 3. Regenerate resources (capacity, AP, budget, attention decay, risk decay)
 * 4. Decrement exposure countdown
 * 5. Check & activate pending consequences
 * 6. Generate world events, NPC crisis events, resource trend events
 * 7. Process NPC event reactions
 * 8. Check for crisis moments
 * 9. Process Actor-AI (arms race, defender spawns, AI actions)
 * 10. Apply AI action effects & emit phase event
 *
 * Follows Strangler Fig pattern: StoryEngineAdapter delegates to this class.
 */

import type {
  StoryPhase,
  StoryResources,
  ActiveConsequence,
  NewsEvent,
} from './StoryEngineAdapter';

import type { CrisisMoment } from '../story-mode/engine/CrisisMomentSystem';
import type { AIAction, DefensiveActor } from '../story-mode/engine/StoryActorAI';
import type { GameEvent } from './GameEventBus';

import { storyLogger } from '../utils/logger';

// ============================================
// Dependency Interface (Constructor Injection)
// ============================================

export interface PhaseManagerDeps {
  // State access
  getPhase(): StoryPhase;
  getResources(): StoryResources;
  getExposureCountdown(): number | null;
  getNewsEvents(): NewsEvent[];
  getActionHistoryLength(): number;
  getRecentActionIds(): string[];
  getRecentActionTags(): string[];

  // State mutation
  setPhase(phase: StoryPhase): void;
  setResources(resources: StoryResources): void;
  setExposureCountdown(countdown: number | null): void;
  prependNewsEvent(event: NewsEvent): void;

  // Subsystem delegations
  checkConsequences(phase: number): ActiveConsequence[];
  generateWorldEvents(phase: number): NewsEvent[];
  generateNPCCrisisEvents(phase: number): NewsEvent[];
  generateResourceTrendEvents(phase: number): NewsEvent[];
  generateNPCEventReactions(events: NewsEvent[]): NewsEvent[];
  cleanupExpiredOpportunityWindows(): void;

  // Subsystem refs (narrow interfaces)
  comboSystem: {
    cleanupExpired(phase: number): void;
  };
  crisisMomentSystem: {
    checkForCrises(state: {
      phase: number;
      risk: number;
      attention: number;
      actionCount: number;
      lowTrustActors: number;
    }): CrisisMoment[];
    cleanupExpiredCrises(phase: number): void;
  };
  actorAI: {
    checkSpawnConditions(
      phase: number,
      risk: number,
      recentCrisis: boolean
    ): DefensiveActor[];
    processPhase(
      phase: number,
      context: {
        risk: number;
        attention: number;
        recentActions: string[];
        recentTags: string[];
      }
    ): AIAction[];
  };

  // Utilities
  createPhase(phaseNumber: number): StoryPhase;
  playSound(sound: string): void;
  emitEvent(event: GameEvent): void;

  // Constants
  PHASES_PER_YEAR: number;
  MAX_YEARS: number;
  CAPACITY_REGEN_PER_PHASE: number;
  ACTION_POINTS_PER_PHASE: number;
}

// ============================================
// PhaseManager Class
// ============================================

export class PhaseManager {
  constructor(private deps: PhaseManagerDeps) {}

  /**
   * Advance to the next phase -- main entry point.
   * This is a 1:1 behavioral copy of StoryEngineAdapter.advancePhase().
   */
  advance(): {
    newPhase: StoryPhase;
    resourceChanges: Partial<StoryResources>;
    triggeredConsequences: ActiveConsequence[];
    worldEvents: NewsEvent[];
    triggeredCrises: CrisisMoment[];
    aiActions: AIAction[];
    newDefenders: DefensiveActor[];
  } {
    // Play phase transition sound
    this.deps.playSound('phaseEnd');

    const previousPhase = this.deps.getPhase().number;
    const newPhaseNumber = previousPhase + 1;

    // Prüfe Spielende
    if (newPhaseNumber > this.deps.PHASES_PER_YEAR * this.deps.MAX_YEARS) {
      // Zeit abgelaufen - Spielende
    }

    // Phase aktualisieren
    const newPhase = this.deps.createPhase(newPhaseNumber);
    this.deps.setPhase(newPhase);

    // Clean up expired opportunity windows
    this.deps.cleanupExpiredOpportunityWindows();

    // Clean up expired combo progress
    this.deps.comboSystem.cleanupExpired(newPhaseNumber);

    // Ressourcen regenerieren
    const resources = this.deps.getResources();
    const resourceChanges: Partial<StoryResources> = {
      capacity: Math.min(
        resources.capacity + this.deps.CAPACITY_REGEN_PER_PHASE,
        10 // Max Capacity
      ),
      actionPointsRemaining: this.deps.ACTION_POINTS_PER_PHASE,
      budget: resources.budget + 5,
      attention: Math.max(0, resources.attention - 2),
      risk: Math.max(0, resources.risk - 5),
    };

    Object.assign(resources, resourceChanges);
    this.deps.setResources(resources);

    // Decrement exposure countdown if active
    const exposureCountdown = this.deps.getExposureCountdown();
    if (exposureCountdown !== null) {
      const newCountdown = exposureCountdown - 1;
      this.deps.setExposureCountdown(newCountdown);
      if (newCountdown <= 0) {
        const res = this.deps.getResources();
        res.risk = 100;
        this.deps.setResources(res);
        storyLogger.log('[ExposureCountdown] Countdown expired - exposure imminent!');
      }
    }

    // Konsequenzen prüfen
    const triggeredConsequences = this.deps.checkConsequences(newPhaseNumber);

    // Welt-Events generieren
    const worldEvents = this.deps.generateWorldEvents(newPhaseNumber);

    // NPC Crisis → World Events
    const npcCrisisEvents = this.deps.generateNPCCrisisEvents(newPhaseNumber);
    worldEvents.push(...npcCrisisEvents);

    // Resource Trends → Dynamic Events
    const resourceTrendEvents = this.deps.generateResourceTrendEvents(newPhaseNumber);
    worldEvents.push(...resourceTrendEvents);

    // NPCs comment on world events and recent action news
    const recentNews = this.deps.getNewsEvents().slice(0, 10);
    const npcReactions = this.deps.generateNPCEventReactions([...worldEvents, ...recentNews]);
    for (const reaction of npcReactions) {
      this.deps.prependNewsEvent(reaction);
    }

    // Check for crisis moments
    const triggeredCrises = this.deps.crisisMomentSystem.checkForCrises({
      phase: newPhaseNumber,
      risk: this.deps.getResources().risk,
      attention: this.deps.getResources().attention,
      actionCount: this.deps.getActionHistoryLength(),
      lowTrustActors: 0,
    });

    // Play crisis sound if new crisis
    if (triggeredCrises.length > 0) {
      this.deps.playSound('crisis');
      for (const crisis of triggeredCrises) {
        this.deps.prependNewsEvent({
          id: `news_crisis_${crisis.id}_${Date.now()}`,
          phase: newPhase.number,
          headline_de: crisis.name_de,
          headline_en: crisis.name_en,
          description_de: crisis.description_de,
          description_en: crisis.description_en,
          type: 'consequence',
          severity: crisis.severity === 'critical' ? 'danger' : crisis.severity === 'high' ? 'warning' : 'info',
          read: false,
          pinned: true,
        });
      }
    }

    // Cleanup expired crises
    this.deps.crisisMomentSystem.cleanupExpiredCrises(newPhaseNumber);

    // Process Actor-AI (Arms Race)
    const recentCrisis = triggeredCrises.length > 0;
    const newDefenders = this.deps.actorAI.checkSpawnConditions(
      newPhaseNumber,
      this.deps.getResources().risk,
      recentCrisis
    );

    // Add news for newly spawned defenders
    for (const defender of newDefenders) {
      this.deps.prependNewsEvent({
        id: `news_defender_${defender.id}_${Date.now()}`,
        phase: newPhase.number,
        headline_de: defender.newsOnSpawn_de,
        headline_en: defender.newsOnSpawn_en,
        description_de: `Ein neuer Akteur formiert sich gegen Desinformation.`,
        description_en: `A new actor mobilizes against disinformation.`,
        type: 'world_event',
        severity: 'warning',
        read: false,
        pinned: false,
      });
      this.deps.playSound('countermeasure');
    }

    // Process AI actions
    const recentActions = this.deps.getRecentActionIds();
    const recentTags = this.deps.getRecentActionTags();
    const aiActions = this.deps.actorAI.processPhase(newPhaseNumber, {
      risk: this.deps.getResources().risk,
      attention: this.deps.getResources().attention,
      recentActions,
      recentTags,
    });

    // Apply AI action effects
    for (const aiAction of aiActions) {
      for (const effect of aiAction.effects) {
        switch (effect.type) {
          case 'risk_increase': {
            const res = this.deps.getResources();
            res.risk = Math.min(100, res.risk + effect.value);
            this.deps.setResources(res);
            break;
          }
          case 'attention_increase': {
            const res = this.deps.getResources();
            res.attention = Math.min(100, res.attention + effect.value);
            this.deps.setResources(res);
            break;
          }
          case 'reach_reduction':
            break;
          case 'countdown_start':
            if (this.deps.getExposureCountdown() === null) {
              this.deps.setExposureCountdown(effect.value);
              storyLogger.log(`[ActorAI] Exposure countdown started: ${effect.value} phases`);
            }
            break;
        }
      }

      // Add AI action to news
      this.deps.prependNewsEvent({
        id: `news_ai_${aiAction.id}`,
        phase: newPhase.number,
        headline_de: aiAction.news_de,
        headline_en: aiAction.news_en,
        description_de: `Verteidigungsakteur ergreift Maßnahmen.`,
        description_en: `Defensive actor takes action.`,
        type: 'world_event',
        severity: aiAction.type === 'investigation' ? 'danger' : 'warning',
        read: false,
        pinned: aiAction.type === 'investigation',
      });
    }

    this.deps.emitEvent({
      type: 'PHASE_ADVANCED',
      from: previousPhase,
      to: newPhaseNumber,
      resources: { ...this.deps.getResources() },
    });

    return {
      newPhase,
      resourceChanges,
      triggeredConsequences,
      worldEvents,
      triggeredCrises,
      aiActions,
      newDefenders,
    };
  }
}
