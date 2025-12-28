// ============================================
// STORY ENGINE ADAPTER
// Façade between Story Mode UI and Wargaming Engine
// ============================================

import type {
  GameState,
  Resources,
  Ability,
  Actor,
  GameEvent,
  EventChoice,
  ResourceCost,
} from './types';

import {
  ActionLoader,
  getActionLoader,
  type LoadedAction,
} from '../story-mode/engine/ActionLoader';

import {
  ConsequenceSystem,
  getConsequenceSystem,
  type ActiveConsequence as EngineActiveConsequence,
} from '../story-mode/engine/ConsequenceSystem';

// ============================================
// STORY MODE SPECIFIC TYPES
// ============================================

/**
 * Story Mode Zeit-Einheit
 * Eine Phase entspricht ca. 1 Monat im Spiel
 */
export interface StoryPhase {
  number: number;           // 1-120 (10 Jahre × 12 Monate)
  year: number;             // 1-10
  month: number;            // 1-12
  label_de: string;         // "Jahr 3, Monat 7"
  label_en: string;         // "Year 3, Month 7"
  isNewYear: boolean;       // Für spezielle Events
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

/**
 * Story Mode Ressourcen (erweitert Engine Resources)
 */
export interface StoryResources {
  // Aktive Ressourcen (pro Aktion bezahlt)
  budget: number;           // 💰 Geld in Tausend Euro
  capacity: number;         // ⚡ Operative Kapazität (regeneriert)

  // Passive Ressourcen (akkumulieren)
  risk: number;             // ⚠️ Entdeckungsrisiko (0-100)
  attention: number;        // 👁️ Aufmerksamkeit der Gegner (0-100)
  moralWeight: number;      // 💀 Moralische Last (beeinflusst NPCs & Enden)

  // Abgeleitet
  actionPointsRemaining: number;  // ~5 pro Phase
  actionPointsMax: number;
}

/**
 * Story Mode Aktion (narrativ verpackte Ability)
 */
export interface StoryAction {
  id: string;

  // Labels
  label_de: string;
  label_en: string;
  narrative_de: string;
  narrative_en: string;

  // Kategorisierung
  phase: string;            // ta01-ta07 oder targeting
  tags: string[];
  legality: 'legal' | 'grey' | 'illegal';

  // Kosten
  costs: {
    budget?: number;
    capacity?: number;
    risk?: number;
    attention?: number;
    moralWeight?: number;
  };

  // Verfügbarkeit
  available: boolean;
  unavailableReason?: string;
  prerequisites: string[];
  prerequisitesMet: boolean;

  // NPC-Bonus
  npcAffinity: string[];
  npcBonus?: {
    npcId: string;
    costReduction: number;
    riskReduction: number;
    effectBonus: number;
  };

  // Engine-Referenz
  engineAbilityId?: string;
  disarmRef?: string;
}

/**
 * Ergebnis einer ausgeführten Aktion
 */
export interface ActionResult {
  success: boolean;
  action: StoryAction;

  // Effekte
  effects: {
    type: string;
    value: number;
    description_de: string;
    description_en: string;
  }[];

  // Ressourcen-Änderungen
  resourceChanges: Partial<StoryResources>;

  // Narrative Reaktion
  narrative: {
    headline_de: string;
    headline_en: string;
    description_de: string;
    description_en: string;
  };

  // Potenzielle Konsequenzen (für UI Feedback)
  potentialConsequences: string[];

  // NPC-Reaktionen (falls vorhanden)
  npcReactions?: {
    npcId: string;
    reaction: 'positive' | 'neutral' | 'negative' | 'crisis';
    dialogue_de: string;
    dialogue_en: string;
  }[];
}

/**
 * NPC-Status für Story Mode
 */
export interface NPCState {
  id: string;
  name: string;
  role_de: string;
  role_en: string;

  // Beziehung zum Spieler
  relationshipLevel: 0 | 1 | 2 | 3;  // Neutral → Bekannt → Vertraut → Loyal
  relationshipProgress: number;       // 0-100, Fortschritt zum nächsten Level

  // Zustand
  morale: number;                     // 0-100
  inCrisis: boolean;
  available: boolean;

  // Aktuelle Stimmung
  currentMood: 'positive' | 'neutral' | 'concerned' | 'upset';

  // Spezialisierung
  specialtyAreas: string[];
  enhancedActions: string[];          // Action IDs mit Bonus
}

/**
 * Ausstehende Konsequenz
 */
export interface PendingConsequence {
  id: string;
  consequenceId: string;

  // Timing
  triggeredAtPhase: number;
  activatesAtPhase: number;

  // Info
  label_de: string;
  label_en: string;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  type: 'exposure' | 'blowback' | 'escalation' | 'internal' | 'collateral' | 'opportunity';

  // Spieler-Optionen (wenn aktiviert)
  choices?: {
    id: string;
    label_de: string;
    label_en: string;
    cost?: Partial<StoryResources>;
    outcome_de: string;
    outcome_en: string;
  }[];
}

/**
 * Aktive Konsequenz, die Spieler-Input erfordert
 */
export interface ActiveConsequence extends PendingConsequence {
  requiresChoice: boolean;
  deadline?: number;  // Phase, bis wann entschieden werden muss
}

/**
 * News-Event für die News-Liste
 */
export interface NewsEvent {
  id: string;
  phase: number;

  // Inhalt
  headline_de: string;
  headline_en: string;
  description_de: string;
  description_en: string;

  // Typ
  type: 'action_result' | 'consequence' | 'world_event' | 'npc_event';
  severity: 'info' | 'warning' | 'danger' | 'success';

  // Quelle
  sourceActionId?: string;
  sourceConsequenceId?: string;

  // Status
  read: boolean;
  pinned: boolean;
}

/**
 * Spielziel (OKR-Style)
 */
export interface Objective {
  id: string;
  label_de: string;
  label_en: string;
  description_de: string;
  description_en: string;

  // Fortschritt
  progress: number;         // 0-100
  completed: boolean;

  // Typ
  type: 'primary' | 'secondary' | 'hidden';
  category: 'trust_reduction' | 'infrastructure' | 'political' | 'narrative' | 'survival';

  // Bedingungen
  targetValue: number;
  currentValue: number;
}

/**
 * Spiel-Ende Information
 */
export interface GameEndState {
  type: 'victory' | 'defeat' | 'escape' | 'moral_redemption';

  // Beschreibung
  title_de: string;
  title_en: string;
  description_de: string;
  description_en: string;

  // Statistiken
  stats: {
    phasesPlayed: number;
    actionsExecuted: number;
    consequencesTriggered: number;
    npcsCrisis: number;
    moralWeight: number;
  };

  // Epilog
  epilogue_de: string;
  epilogue_en: string;
}

// ============================================
// STORY ENGINE ADAPTER CLASS
// ============================================

export class StoryEngineAdapter {
  private engineState: GameState | null = null;
  private storyPhase: StoryPhase;
  private storyResources: StoryResources;
  private pendingConsequences: PendingConsequence[] = [];
  private activeConsequence: ActiveConsequence | null = null;
  private newsEvents: NewsEvent[] = [];
  private objectives: Objective[] = [];
  private npcStates: Map<string, NPCState> = new Map();
  private actionHistory: { phase: number; actionId: string; result: ActionResult }[] = [];

  // Engine Integration
  private actionLoader: ActionLoader;
  private consequenceSystem: ConsequenceSystem;
  private rngSeed: string;

  // Konfiguration
  private readonly PHASES_PER_YEAR = 12;
  private readonly MAX_YEARS = 10;
  private readonly ACTION_POINTS_PER_PHASE = 5;
  private readonly CAPACITY_REGEN_PER_PHASE = 2;

  constructor(seed?: string) {
    this.rngSeed = seed || Date.now().toString();

    // Initialize engine components
    this.actionLoader = getActionLoader();
    this.consequenceSystem = getConsequenceSystem();

    // Initialer Zustand
    this.storyPhase = this.createPhase(1);
    this.storyResources = this.createInitialResources();
    this.initializeNPCs();
    this.initializeObjectives();

    console.log(`✅ StoryEngineAdapter initialized (seed: ${this.rngSeed})`);
  }

  /**
   * Simple seeded random number generator
   */
  private seededRandom(): number {
    // Simple hash-based RNG for consequence probabilities
    const x = Math.sin(parseInt(this.rngSeed, 36) + this.storyPhase.number) * 10000;
    return x - Math.floor(x);
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  private createPhase(phaseNumber: number): StoryPhase {
    const year = Math.ceil(phaseNumber / this.PHASES_PER_YEAR);
    const month = ((phaseNumber - 1) % this.PHASES_PER_YEAR) + 1;

    const seasons: Array<'winter' | 'spring' | 'summer' | 'autumn'> =
      ['winter', 'winter', 'spring', 'spring', 'spring', 'summer',
       'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'];

    return {
      number: phaseNumber,
      year,
      month,
      label_de: `Jahr ${year}, Monat ${month}`,
      label_en: `Year ${year}, Month ${month}`,
      isNewYear: month === 1,
      season: seasons[month - 1],
    };
  }

  private createInitialResources(): StoryResources {
    return {
      budget: 100,            // Startbudget
      capacity: 5,            // Volle Kapazität
      risk: 0,
      attention: 0,
      moralWeight: 0,
      actionPointsRemaining: this.ACTION_POINTS_PER_PHASE,
      actionPointsMax: this.ACTION_POINTS_PER_PHASE,
    };
  }

  private initializeNPCs(): void {
    // TODO: Load from npcs.json
    const npcIds = ['direktor', 'marina', 'volkov', 'katja', 'igor'];

    npcIds.forEach(id => {
      this.npcStates.set(id, {
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        role_de: 'Mitarbeiter',
        role_en: 'Staff',
        relationshipLevel: 0,
        relationshipProgress: 0,
        morale: 100,
        inCrisis: false,
        available: true,
        currentMood: 'neutral',
        specialtyAreas: [],
        enhancedActions: [],
      });
    });
  }

  private initializeObjectives(): void {
    // TODO: Load from scenario definition
    this.objectives = [
      {
        id: 'obj_destabilize',
        label_de: 'Westunion destabilisieren',
        label_en: 'Destabilize Westunion',
        description_de: 'Senke das durchschnittliche Vertrauen in Institutionen auf unter 40%',
        description_en: 'Reduce average institutional trust to below 40%',
        progress: 0,
        completed: false,
        type: 'primary',
        category: 'trust_reduction',
        targetValue: 40,
        currentValue: 75,
      },
      {
        id: 'obj_survive',
        label_de: 'Nicht enttarnt werden',
        label_en: 'Avoid exposure',
        description_de: 'Halte das Entdeckungsrisiko unter dem kritischen Level',
        description_en: 'Keep detection risk below critical level',
        progress: 100,
        completed: false,
        type: 'primary',
        category: 'survival',
        targetValue: 85,
        currentValue: 0,
      },
    ];
  }

  // ============================================
  // CORE GAME LOOP
  // ============================================

  /**
   * Fortschritt zur nächsten Phase
   */
  advancePhase(): {
    newPhase: StoryPhase;
    resourceChanges: Partial<StoryResources>;
    triggeredConsequences: ActiveConsequence[];
    worldEvents: NewsEvent[];
  } {
    const previousPhase = this.storyPhase.number;
    const newPhaseNumber = previousPhase + 1;

    // Prüfe Spielende
    if (newPhaseNumber > this.PHASES_PER_YEAR * this.MAX_YEARS) {
      // Zeit abgelaufen - Spielende
    }

    // Phase aktualisieren
    this.storyPhase = this.createPhase(newPhaseNumber);

    // Ressourcen regenerieren
    const resourceChanges: Partial<StoryResources> = {
      capacity: Math.min(
        this.storyResources.capacity + this.CAPACITY_REGEN_PER_PHASE,
        10 // Max Capacity
      ),
      actionPointsRemaining: this.ACTION_POINTS_PER_PHASE,
      // Passive Decay
      attention: Math.max(0, this.storyResources.attention - 5),
    };

    Object.assign(this.storyResources, resourceChanges);

    // Konsequenzen prüfen
    const triggeredConsequences = this.checkConsequences(newPhaseNumber);

    // Welt-Events generieren
    const worldEvents = this.generateWorldEvents(newPhaseNumber);

    return {
      newPhase: this.storyPhase,
      resourceChanges,
      triggeredConsequences,
      worldEvents,
    };
  }

  /**
   * Prüfe, ob Konsequenzen aktiviert werden
   */
  private checkConsequences(currentPhase: number): ActiveConsequence[] {
    const activated: ActiveConsequence[] = [];

    // Check ConsequenceSystem for activating consequences
    const engineActive = this.consequenceSystem.checkPhase(currentPhase);

    if (engineActive) {
      // Convert engine active consequence to adapter format
      const active: ActiveConsequence = {
        id: engineActive.id,
        consequenceId: engineActive.consequence.id,
        triggeredAtPhase: currentPhase - 2, // Approximate
        activatesAtPhase: currentPhase,
        label_de: engineActive.consequence.label_de,
        label_en: engineActive.consequence.label_en,
        severity: engineActive.consequence.severity,
        type: engineActive.consequence.type,
        requiresChoice: engineActive.choices.length > 0,
        deadline: engineActive.deadline,
        choices: engineActive.choices.map(c => ({
          id: c.id,
          label_de: c.label_de,
          label_en: c.label_en,
          cost: c.costs ? {
            budget: c.costs.budget,
            moralWeight: c.costs.moral_weight,
          } : undefined,
          outcome_de: c.outcome_de,
          outcome_en: c.outcome_en,
        })),
      };

      activated.push(active);

      if (active.requiresChoice) {
        this.activeConsequence = active;
      } else {
        // Auto-apply
        this.applyConsequenceEffects(active);
      }

      // Remove from our pending list
      this.pendingConsequences = this.pendingConsequences.filter(
        p => p.id !== active.id
      );
    }

    return activated;
  }

  private applyConsequenceEffects(consequence: ActiveConsequence): void {
    // TODO: Apply effects based on consequence type

    // Add to news
    this.newsEvents.unshift({
      id: `news_${Date.now()}`,
      phase: this.storyPhase.number,
      headline_de: consequence.label_de,
      headline_en: consequence.label_en,
      description_de: `Eine Konsequenz Ihrer Aktionen...`,
      description_en: `A consequence of your actions...`,
      type: 'consequence',
      severity: consequence.severity === 'critical' ? 'danger' :
                consequence.severity === 'severe' ? 'warning' : 'info',
      sourceConsequenceId: consequence.consequenceId,
      read: false,
      pinned: consequence.severity === 'critical' || consequence.severity === 'severe',
    });
  }

  private generateWorldEvents(phase: number): NewsEvent[] {
    // TODO: Generate based on game state and random events
    return [];
  }

  // ============================================
  // ACTION SYSTEM
  // ============================================

  /**
   * Hole alle verfügbaren Aktionen
   */
  getAvailableActions(): StoryAction[] {
    const loadedActions = this.actionLoader.getAvailableActions();

    return loadedActions.map(loaded => this.convertToStoryAction(loaded));
  }

  /**
   * Convert LoadedAction to StoryAction format
   */
  private convertToStoryAction(loaded: LoadedAction): StoryAction {
    // Check for NPC bonus
    let npcBonus: StoryAction['npcBonus'] | undefined;
    if (loaded.npc_affinity.length > 0) {
      const primaryNpc = loaded.npc_affinity[0];
      const npcState = this.npcStates.get(primaryNpc);
      if (npcState && npcState.relationshipLevel > 0) {
        npcBonus = {
          npcId: primaryNpc,
          costReduction: npcState.relationshipLevel * 0.1,
          riskReduction: npcState.relationshipLevel * 0.05,
          effectBonus: npcState.relationshipLevel * 0.1,
        };
      }
    }

    return {
      id: loaded.id,
      label_de: loaded.label_de,
      label_en: loaded.label_en || loaded.label_de,
      narrative_de: loaded.narrative_de || '',
      narrative_en: loaded.narrative_en || loaded.narrative_de || '',
      phase: loaded.phase,
      tags: loaded.tags,
      legality: loaded.legality,
      costs: {
        budget: loaded.costs.budget,
        capacity: loaded.costs.capacity,
        risk: loaded.costs.risk,
        attention: loaded.costs.attention,
        moralWeight: loaded.costs.moral_weight,
      },
      available: loaded.isUnlocked && !loaded.isUsed,
      unavailableReason: !loaded.isUnlocked ? 'Locked - prerequisites not met' :
                         loaded.isUsed ? 'Already used' : undefined,
      prerequisites: loaded.prerequisites || [],
      prerequisitesMet: this.actionLoader.arePrerequisitesMet(loaded),
      npcAffinity: loaded.npc_affinity,
      npcBonus,
      engineAbilityId: loaded.disarm_ref || undefined,
      disarmRef: loaded.disarm_ref || undefined,
    };
  }

  /**
   * Führe eine Aktion aus
   */
  executeAction(actionId: string, options?: {
    targetId?: string;
    npcAssist?: string;
  }): ActionResult {
    // TODO: Implement action execution

    const action = this.getActionById(actionId);
    if (!action) {
      throw new Error(`Action ${actionId} not found`);
    }

    // Prüfe Ressourcen
    if (!this.canAffordAction(action)) {
      return {
        success: false,
        action,
        effects: [],
        resourceChanges: {},
        narrative: {
          headline_de: 'Nicht genug Ressourcen',
          headline_en: 'Not enough resources',
          description_de: 'Diese Aktion kann nicht durchgeführt werden.',
          description_en: 'This action cannot be performed.',
        },
        potentialConsequences: [],
      };
    }

    // Kosten abziehen
    this.deductActionCosts(action, options?.npcAssist);

    // Aktion Points reduzieren
    this.storyResources.actionPointsRemaining--;

    // Effekte anwenden
    const effects = this.applyActionEffects(action, options);

    // Konsequenzen registrieren
    const potentialConsequences = this.registerPotentialConsequences(action);

    // NPC-Reaktionen
    const npcReactions = this.processNPCReactions(action);

    // Ergebnis
    const result: ActionResult = {
      success: true,
      action,
      effects,
      resourceChanges: action.costs,
      narrative: {
        headline_de: action.label_de,
        headline_en: action.label_en,
        description_de: action.narrative_de,
        description_en: action.narrative_en,
      },
      potentialConsequences,
      npcReactions,
    };

    // Mark action as used in ActionLoader
    this.actionLoader.markAsUsed(actionId);

    // Check for unlocking new actions based on this action's completion
    this.actionLoader.checkUnlocks(actionId);

    // Historie
    this.actionHistory.push({
      phase: this.storyPhase.number,
      actionId,
      result,
    });

    // News
    this.newsEvents.unshift({
      id: `news_action_${Date.now()}`,
      phase: this.storyPhase.number,
      headline_de: action.label_de,
      headline_en: action.label_en,
      description_de: action.narrative_de,
      description_en: action.narrative_en,
      type: 'action_result',
      severity: action.legality === 'illegal' ? 'warning' : 'info',
      sourceActionId: actionId,
      read: false,
      pinned: false,
    });

    return result;
  }

  private getActionById(id: string): StoryAction | null {
    const loaded = this.actionLoader.getAction(id);
    if (!loaded) return null;
    return this.convertToStoryAction(loaded);
  }

  private canAffordAction(action: StoryAction): boolean {
    const costs = action.costs;

    if (costs.budget && this.storyResources.budget < costs.budget) return false;
    if (costs.capacity && this.storyResources.capacity < costs.capacity) return false;
    if (this.storyResources.actionPointsRemaining <= 0) return false;

    return true;
  }

  private deductActionCosts(action: StoryAction, npcAssist?: string): void {
    const costs = action.costs;
    let costMultiplier = 1.0;

    // NPC-Bonus
    if (npcAssist && action.npcAffinity.includes(npcAssist)) {
      const npc = this.npcStates.get(npcAssist);
      if (npc) {
        const levelBonus = [1.0, 0.9, 0.8, 0.7][npc.relationshipLevel];
        costMultiplier = levelBonus;
      }
    }

    if (costs.budget) {
      this.storyResources.budget -= Math.ceil(costs.budget * costMultiplier);
    }
    if (costs.capacity) {
      this.storyResources.capacity -= costs.capacity;
    }
    if (costs.risk) {
      this.storyResources.risk += costs.risk;
    }
    if (costs.attention) {
      this.storyResources.attention += costs.attention;
    }
    if (costs.moralWeight) {
      this.storyResources.moralWeight += costs.moralWeight;
    }
  }

  private applyActionEffects(action: StoryAction, options?: {
    targetId?: string;
    npcAssist?: string;
  }): ActionResult['effects'] {
    const effects: ActionResult['effects'] = [];

    // Get loaded action for raw effects data
    const loadedAction = this.actionLoader.getAction(action.id);
    if (!loadedAction || !loadedAction.effects) {
      return effects;
    }

    // Calculate effectiveness multiplier based on NPC assist
    let effectivenessMultiplier = 1.0;
    if (options?.npcAssist && action.npcAffinity.includes(options.npcAssist)) {
      const npc = this.npcStates.get(options.npcAssist);
      if (npc) {
        effectivenessMultiplier = 1 + (npc.relationshipLevel * 0.1);
      }
    }

    // Process effects from loaded action
    const actionEffects = loadedAction.effects as Record<string, unknown>;

    // Content quality effect - increases trust erosion potential
    if (actionEffects.content_quality && typeof actionEffects.content_quality === 'number') {
      const value = Math.round(actionEffects.content_quality * effectivenessMultiplier * 10);
      effects.push({
        type: 'content_quality',
        value,
        description_de: `Inhaltsqualität +${value}%`,
        description_en: `Content quality +${value}%`,
      });
    }

    // Virality boost
    if (actionEffects.virality_boost && typeof actionEffects.virality_boost === 'number') {
      const value = Math.round(actionEffects.virality_boost * effectivenessMultiplier * 10);
      effects.push({
        type: 'virality',
        value,
        description_de: `Virale Reichweite +${value}%`,
        description_en: `Viral reach +${value}%`,
      });
    }

    // Trust erosion effect - contributes to objective progress
    if (actionEffects.trust_erosion && typeof actionEffects.trust_erosion === 'number') {
      const value = Math.round(actionEffects.trust_erosion * effectivenessMultiplier * 10);
      effects.push({
        type: 'trust_erosion',
        value,
        description_de: `Vertrauenserosion +${value}%`,
        description_en: `Trust erosion +${value}%`,
      });

      // Update primary objective progress
      const destabilizeObj = this.objectives.find(o => o.id === 'obj_destabilize');
      if (destabilizeObj) {
        destabilizeObj.currentValue = Math.max(0, destabilizeObj.currentValue - value);
        destabilizeObj.progress = Math.min(100,
          ((75 - destabilizeObj.currentValue) / (75 - destabilizeObj.targetValue)) * 100
        );
        if (destabilizeObj.currentValue <= destabilizeObj.targetValue) {
          destabilizeObj.completed = true;
        }
      }
    }

    // Polarization effect
    if (actionEffects.polarization && typeof actionEffects.polarization === 'number') {
      const value = Math.round(actionEffects.polarization * effectivenessMultiplier * 10);
      effects.push({
        type: 'polarization',
        value,
        description_de: `Gesellschaftliche Spaltung +${value}%`,
        description_en: `Social polarization +${value}%`,
      });
    }

    // Infrastructure boost
    if (actionEffects.infrastructure_boost && typeof actionEffects.infrastructure_boost === 'number') {
      const value = actionEffects.infrastructure_boost;
      effects.push({
        type: 'infrastructure',
        value,
        description_de: 'Infrastruktur ausgebaut',
        description_en: 'Infrastructure expanded',
      });
    }

    // Network reach
    if (actionEffects.network_reach && typeof actionEffects.network_reach === 'number') {
      const value = Math.round(actionEffects.network_reach * effectivenessMultiplier * 10);
      effects.push({
        type: 'network',
        value,
        description_de: `Netzwerk-Reichweite +${value}%`,
        description_en: `Network reach +${value}%`,
      });
    }

    // Political leverage
    if (actionEffects.political_leverage && typeof actionEffects.political_leverage === 'number') {
      const value = Math.round(actionEffects.political_leverage * effectivenessMultiplier * 10);
      effects.push({
        type: 'political',
        value,
        description_de: `Politischer Einfluss +${value}%`,
        description_en: `Political leverage +${value}%`,
      });
    }

    return effects;
  }

  private registerPotentialConsequences(action: StoryAction): string[] {
    // Use ConsequenceSystem to check for triggered consequences
    const pendingFromSystem = this.consequenceSystem.onActionExecuted(
      action.id,
      this.storyPhase.number,
      () => this.seededRandom()
    );

    // Convert to UI-friendly pending consequences and add to our list
    const consequenceLabels: string[] = [];

    for (const pending of pendingFromSystem) {
      const def = this.consequenceSystem['definitions'].get(pending.consequenceId);
      if (def) {
        // Add to adapter's pending list for UI display
        this.pendingConsequences.push({
          id: pending.id,
          consequenceId: pending.consequenceId,
          triggeredAtPhase: pending.triggeredAtPhase,
          activatesAtPhase: pending.activatesAtPhase,
          label_de: def.label_de,
          label_en: def.label_en,
          severity: def.severity,
          type: def.type,
          choices: def.player_choices.map(c => ({
            id: c.id,
            label_de: c.label_de,
            label_en: c.label_en,
            cost: c.costs ? {
              budget: c.costs.budget,
              moralWeight: c.costs.moral_weight,
            } : undefined,
            outcome_de: c.outcome_de,
            outcome_en: c.outcome_en,
          })),
        });

        consequenceLabels.push(def.label_de);
      }
    }

    return consequenceLabels;
  }

  private processNPCReactions(action: StoryAction): ActionResult['npcReactions'] {
    const reactions: ActionResult['npcReactions'] = [];

    // Prüfe moralische Last
    if (action.costs.moralWeight && action.costs.moralWeight >= 3) {
      const marina = this.npcStates.get('marina');
      if (marina) {
        marina.morale -= action.costs.moralWeight * 5;
        if (marina.morale < 30 && !marina.inCrisis) {
          marina.inCrisis = true;
          reactions.push({
            npcId: 'marina',
            reaction: 'crisis',
            dialogue_de: 'Das geht zu weit. Ich kann das nicht mehr mittragen.',
            dialogue_en: 'This goes too far. I can\'t support this anymore.',
          });
        }
      }
    }

    return reactions;
  }

  // ============================================
  // CONSEQUENCE HANDLING
  // ============================================

  /**
   * Hole aktive Konsequenz (falls vorhanden)
   */
  getActiveConsequence(): ActiveConsequence | null {
    return this.activeConsequence;
  }

  /**
   * Beantworte aktive Konsequenz
   */
  handleConsequenceChoice(choiceId: string): {
    success: boolean;
    outcome_de?: string;
    outcome_en?: string;
  } {
    if (!this.activeConsequence) {
      throw new Error('No active consequence');
    }

    const choice = this.activeConsequence.choices?.find(c => c.id === choiceId);
    if (!choice) {
      throw new Error(`Choice ${choiceId} not found`);
    }

    // Use ConsequenceSystem to resolve
    const result = this.consequenceSystem.resolveConsequence(choiceId);

    if (!result.success) {
      return { success: false };
    }

    // Apply costs from the choice
    if (choice.cost) {
      if (choice.cost.budget) this.storyResources.budget -= choice.cost.budget;
      if (choice.cost.capacity) this.storyResources.capacity -= choice.cost.capacity;
      if (choice.cost.moralWeight) this.storyResources.moralWeight += choice.cost.moralWeight;
    }

    // Apply effects from the system
    if (result.effects) {
      if (result.effects.risk_change) {
        this.storyResources.risk += result.effects.risk_change;
      }
      if (result.effects.attention_change) {
        this.storyResources.attention += result.effects.attention_change;
      }
      if (result.effects.npc_relationship) {
        const npc = this.npcStates.get(result.effects.npc_relationship.npc);
        if (npc) {
          npc.relationshipProgress += result.effects.npc_relationship.change * 10;
          // Check for level up/down
          if (npc.relationshipProgress >= 100 && npc.relationshipLevel < 3) {
            npc.relationshipLevel++;
            npc.relationshipProgress = 0;
          } else if (npc.relationshipProgress < 0 && npc.relationshipLevel > 0) {
            npc.relationshipLevel--;
            npc.relationshipProgress = 50;
          }
        }
      }
    }

    // Add news event
    this.newsEvents.unshift({
      id: `news_consequence_${Date.now()}`,
      phase: this.storyPhase.number,
      headline_de: this.activeConsequence.label_de,
      headline_en: this.activeConsequence.label_en,
      description_de: choice.outcome_de,
      description_en: choice.outcome_en,
      type: 'consequence',
      severity: this.activeConsequence.severity === 'critical' ? 'danger' :
                this.activeConsequence.severity === 'severe' ? 'warning' : 'info',
      sourceConsequenceId: this.activeConsequence.consequenceId,
      read: false,
      pinned: false,
    });

    this.activeConsequence = null;

    return {
      success: true,
      outcome_de: choice.outcome_de,
      outcome_en: choice.outcome_en,
    };
  }

  // ============================================
  // STATE GETTERS
  // ============================================

  getCurrentPhase(): StoryPhase {
    return this.storyPhase;
  }

  getResources(): StoryResources {
    return { ...this.storyResources };
  }

  getNPCState(npcId: string): NPCState | null {
    return this.npcStates.get(npcId) || null;
  }

  getAllNPCs(): NPCState[] {
    return Array.from(this.npcStates.values());
  }

  getNewsEvents(options?: { unreadOnly?: boolean; limit?: number }): NewsEvent[] {
    let events = [...this.newsEvents];

    if (options?.unreadOnly) {
      events = events.filter(e => !e.read);
    }

    if (options?.limit) {
      events = events.slice(0, options.limit);
    }

    return events;
  }

  getObjectives(): Objective[] {
    return [...this.objectives];
  }

  getPendingConsequences(): PendingConsequence[] {
    return [...this.pendingConsequences];
  }

  // ============================================
  // WIN/LOSE CONDITIONS
  // ============================================

  checkGameEnd(): GameEndState | null {
    // Entdeckung
    if (this.storyResources.risk >= 85) {
      return {
        type: 'defeat',
        title_de: 'Enttarnt',
        title_en: 'Exposed',
        description_de: 'Ihre Operationen wurden aufgedeckt. Die Verbindung zu Ostland ist bewiesen.',
        description_en: 'Your operations have been uncovered. The connection to Ostland is proven.',
        stats: this.getEndStats(),
        epilogue_de: 'Sie werden zur persona non grata erklärt...',
        epilogue_en: 'You are declared persona non grata...',
      };
    }

    // Zeitablauf mit Erfolg
    const primaryObjectives = this.objectives.filter(o => o.type === 'primary');
    const allCompleted = primaryObjectives.every(o => o.completed);

    if (this.storyPhase.number >= this.PHASES_PER_YEAR * this.MAX_YEARS) {
      if (allCompleted) {
        return {
          type: 'victory',
          title_de: 'Mission erfüllt',
          title_en: 'Mission Accomplished',
          description_de: 'Nach 10 Jahren haben Sie Ihre Ziele erreicht.',
          description_en: 'After 10 years, you have achieved your objectives.',
          stats: this.getEndStats(),
          epilogue_de: 'Westunion ist gespalten. Moskau ist zufrieden.',
          epilogue_en: 'Westunion is divided. Moscow is pleased.',
        };
      } else {
        return {
          type: 'defeat',
          title_de: 'Zeit abgelaufen',
          title_en: 'Time\'s Up',
          description_de: 'Die Zeit ist abgelaufen, ohne dass die Ziele erreicht wurden.',
          description_en: 'Time has run out without achieving the objectives.',
          stats: this.getEndStats(),
          epilogue_de: 'Sie werden abberufen. Ihre Karriere ist beendet.',
          epilogue_en: 'You are recalled. Your career is over.',
        };
      }
    }

    return null;
  }

  private getEndStats(): GameEndState['stats'] {
    return {
      phasesPlayed: this.storyPhase.number,
      actionsExecuted: this.actionHistory.length,
      consequencesTriggered: this.newsEvents.filter(e => e.type === 'consequence').length,
      npcsCrisis: Array.from(this.npcStates.values()).filter(n => n.inCrisis).length,
      moralWeight: this.storyResources.moralWeight,
    };
  }

  // ============================================
  // SAVE / LOAD
  // ============================================

  saveState(): string {
    const state = {
      version: '1.0.0',
      rngSeed: this.rngSeed,
      storyPhase: this.storyPhase,
      storyResources: this.storyResources,
      pendingConsequences: this.pendingConsequences,
      newsEvents: this.newsEvents,
      objectives: this.objectives,
      npcStates: Array.from(this.npcStates.entries()),
      actionHistory: this.actionHistory,
      // Engine state
      actionLoaderState: this.actionLoader.exportState(),
      consequenceSystemState: this.consequenceSystem.exportState(),
    };

    return JSON.stringify(state);
  }

  loadState(savedState: string): void {
    const state = JSON.parse(savedState);

    this.rngSeed = state.rngSeed || this.rngSeed;
    this.storyPhase = state.storyPhase;
    this.storyResources = state.storyResources;
    this.pendingConsequences = state.pendingConsequences;
    this.newsEvents = state.newsEvents;
    this.objectives = state.objectives;
    this.npcStates = new Map(state.npcStates);
    this.actionHistory = state.actionHistory;

    // Restore engine state
    if (state.actionLoaderState) {
      this.actionLoader.importState(state.actionLoaderState);
    }
    if (state.consequenceSystemState) {
      this.consequenceSystem.importState(state.consequenceSystemState);
    }
  }

  /**
   * Reset game to initial state
   */
  reset(): void {
    this.storyPhase = this.createPhase(1);
    this.storyResources = this.createInitialResources();
    this.pendingConsequences = [];
    this.activeConsequence = null;
    this.newsEvents = [];
    this.actionHistory = [];
    this.initializeNPCs();
    this.initializeObjectives();

    // Reset engine components
    this.actionLoader.reset();
    this.consequenceSystem.reset();
  }
}

// ============================================
// FACTORY FUNCTION
// ============================================

export function createStoryEngine(seed?: string): StoryEngineAdapter {
  return new StoryEngineAdapter(seed);
}
