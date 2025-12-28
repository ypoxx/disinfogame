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
  type ConsequenceEffects,
} from '../story-mode/engine/ConsequenceSystem';

import {
  DialogLoader,
  type Dialogue,
  type DialogueResponse,
} from '../story-mode/engine/DialogLoader';

import {
  CountermeasureSystem,
  type CountermeasureDefinition,
  type ActiveCountermeasure,
  type CounterOption,
} from '../story-mode/engine/CountermeasureSystem';

// Import NPC and World Events data
import npcsData from '../story-mode/data/npcs.json';
import worldEventsData from '../story-mode/data/world-events.json';

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
  effects?: ConsequenceEffects;  // Effects to apply when consequence activates
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private npcDialogues: Map<string, any> = new Map();
  private actionHistory: { phase: number; actionId: string; result: ActionResult }[] = [];
  private exposureCountdown: number | null = null;  // Countdown to forced exposure/game end
  // P2-7: Track world event cooldowns (eventId -> last triggered phase)
  private worldEventCooldowns: Map<string, number> = new Map();
  private readonly WORLD_EVENT_COOLDOWN = 12;  // 12 phases = 1 year cooldown

  // Engine Integration
  private actionLoader: ActionLoader;
  private consequenceSystem: ConsequenceSystem;
  private dialogLoader: DialogLoader;
  private countermeasureSystem: CountermeasureSystem;
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
    this.dialogLoader = new DialogLoader();
    this.countermeasureSystem = new CountermeasureSystem();

    // Initialer Zustand
    this.storyPhase = this.createPhase(1);
    this.storyResources = this.createInitialResources();
    this.initializeNPCs();
    this.initializeObjectives();

    console.log(`✅ StoryEngineAdapter initialized (seed: ${this.rngSeed})`);
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
    // Load NPCs from JSON data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = npcsData as any;

    for (const npc of data.npcs) {
      this.npcStates.set(npc.id, {
        id: npc.id,
        name: npc.name,
        role_de: npc.role_de,
        role_en: npc.role_en,
        relationshipLevel: npc.initialState?.relationshipLevel ?? 0,
        relationshipProgress: 0,
        morale: npc.initialState?.morale ?? 100,
        inCrisis: false,
        available: npc.initialState?.available ?? true,
        currentMood: 'neutral',
        specialtyAreas: npc.specialtyAreas || [],
        enhancedActions: npc.enhancedActions || [],
      });

      // Store dialogue data for later use
      if (npc.dialogues) {
        this.npcDialogues.set(npc.id, npc.dialogues);
      }
    }

    console.log(`Loaded ${this.npcStates.size} NPCs from data`);
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
    // P1-4 Fix: Reduce attention decay from 5 to 2
    // P1-5 Fix: Add budget regeneration (+5 per phase)
    // P2-6 Fix: Add risk decay (-2 per phase, min 0)
    const resourceChanges: Partial<StoryResources> = {
      capacity: Math.min(
        this.storyResources.capacity + this.CAPACITY_REGEN_PER_PHASE,
        10 // Max Capacity
      ),
      actionPointsRemaining: this.ACTION_POINTS_PER_PHASE,
      // Budget regeneration (operational funding)
      budget: this.storyResources.budget + 5,
      // Passive Decay - reduced from 5 to 2
      attention: Math.max(0, this.storyResources.attention - 2),
      // Risk decay - counter-intelligence loses track over time
      risk: Math.max(0, this.storyResources.risk - 2),
    };

    Object.assign(this.storyResources, resourceChanges);

    // Decrement exposure countdown if active
    if (this.exposureCountdown !== null) {
      this.exposureCountdown--;
      if (this.exposureCountdown <= 0) {
        // Countdown expired - force high risk to trigger game end
        this.storyResources.risk = 100;
        console.log('[ExposureCountdown] Countdown expired - exposure imminent!');
      }
    }

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

    // First, check if active consequence deadline has passed (TD-004: Effects bei Ignorieren)
    if (this.activeConsequence && this.activeConsequence.deadline) {
      if (currentPhase > this.activeConsequence.deadline) {
        this.handleIgnoredConsequence(currentPhase);
      }
    }

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
        effects: engineActive.consequence.effects,
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
    const effects = consequence.effects;

    if (effects) {
      // Apply resource changes
      if (effects.risk_increase) {
        this.storyResources.risk = Math.min(100, this.storyResources.risk + effects.risk_increase);
      }
      if (effects.attention_increase) {
        this.storyResources.attention = Math.min(100, this.storyResources.attention + effects.attention_increase);
      }
      if (effects.capacity_reduction) {
        this.storyResources.capacity = Math.max(0, this.storyResources.capacity - effects.capacity_reduction);
      }
      if (effects.budget_reduction_permanent) {
        this.storyResources.budget = Math.max(0,
          this.storyResources.budget * (1 - effects.budget_reduction_permanent)
        );
      }
      if (effects.moral_weight_increase) {
        this.storyResources.moralWeight += effects.moral_weight_increase;
      }

      // Apply countdown effects (critical - can end the game)
      if (effects.countdown_to_exposure) {
        // Store countdown in a special tracking variable
        this.exposureCountdown = effects.countdown_to_exposure;
      }
      if (effects.final_countdown) {
        this.exposureCountdown = effects.final_countdown;
      }

      // Apply efficiency/effectiveness modifiers
      if (effects.all_risks_increased) {
        // Increase base risk for all future actions
        this.storyResources.risk = Math.min(100,
          this.storyResources.risk + (this.storyResources.risk * effects.all_risks_increased)
        );
      }

      // Handle NPC effects
      if (effects.npc_moral_crisis) {
        // Trigger moral crisis for NPCs
        for (const npc of this.npcStates.values()) {
          if (npc.morale > 0) {
            npc.morale = Math.max(0, npc.morale - 20);
            if (npc.morale < 30) {
              npc.inCrisis = true;
            }
          }
        }
      }

      if (effects.npc_effectiveness_reduction) {
        // Reduce NPC effectiveness (simplified: reduce relationship progress and morale)
        for (const npc of this.npcStates.values()) {
          npc.relationshipProgress = Math.max(0,
            npc.relationshipProgress - Math.round(effects.npc_effectiveness_reduction * 30)
          );
          npc.morale = Math.max(0,
            npc.morale - Math.round(effects.npc_effectiveness_reduction * 20)
          );
        }
      }

      // Handle infrastructure loss
      if (effects.infrastructure_loss) {
        console.log(`[ConsequenceEffect] Infrastructure lost: ${effects.infrastructure_loss}`);
        // Track infrastructure losses for gameplay effects
        // This could affect action availability or costs
      }

      // Handle investigation/emergency flags
      if (effects.investigation_active || effects.critical_exposure_risk) {
        // Increase risk significantly
        this.storyResources.risk = Math.min(100, this.storyResources.risk + 15);
        this.storyResources.attention = Math.min(100, this.storyResources.attention + 10);
      }

      if (effects.emergency_mode) {
        // Critical state - everything becomes harder
        this.storyResources.risk = Math.min(100, this.storyResources.risk + 25);
      }

      // Handle positive effects (opportunity type)
      if (effects.organic_amplification || effects.massive_reach_bonus) {
        // Positive effect - could unlock bonuses
        console.log('[ConsequenceEffect] Positive amplification effect triggered');
      }

      if (effects.legitimacy_boost) {
        // Reduce risk slightly as operations gain legitimacy
        this.storyResources.risk = Math.max(0, this.storyResources.risk - 5);
      }

      console.log('[ConsequenceEffect] Applied effects:', effects);
    }

    // Add to news - get description from consequence definition
    const definition = this.consequenceSystem.getDefinition(consequence.consequenceId);
    const description_de = definition?.description_de || 'Eine Konsequenz Ihrer Aktionen...';
    const description_en = definition?.description_en || 'A consequence of your actions...';

    this.newsEvents.unshift({
      id: `news_${Date.now()}`,
      phase: this.storyPhase.number,
      headline_de: consequence.label_de,
      headline_en: consequence.label_en,
      description_de,
      description_en,
      type: 'consequence',
      severity: consequence.severity === 'critical' ? 'danger' :
                consequence.severity === 'severe' ? 'warning' : 'info',
      sourceConsequenceId: consequence.consequenceId,
      read: false,
      pinned: consequence.severity === 'critical' || consequence.severity === 'severe',
    });
  }

  /**
   * Handle a consequence that was ignored (deadline passed)
   * TD-004: Apply effects_if_ignored and TD-003: Trigger chain consequences
   */
  private handleIgnoredConsequence(currentPhase: number): void {
    if (!this.activeConsequence) return;

    // Call the ConsequenceSystem to handle the ignore
    const result = this.consequenceSystem.ignoreConsequence();
    if (!result) return;

    const { consequence, effects } = result;

    // Apply effects_if_ignored
    if (effects) {
      if (effects.risk_increase) {
        this.storyResources.risk = Math.min(100, this.storyResources.risk + effects.risk_increase);
      }
      if (effects.attention_increase) {
        this.storyResources.attention = Math.min(100, this.storyResources.attention + effects.attention_increase);
      }

      // TD-003: Handle chain_trigger - trigger another consequence
      if (effects.chain_trigger) {
        const chainDef = this.consequenceSystem.getDefinition(effects.chain_trigger);
        if (chainDef) {
          // Manually trigger the chained consequence
          this.consequenceSystem.triggerConsequence(effects.chain_trigger, 'chain_from_' + consequence.id, currentPhase);
          console.log(`[ChainTrigger] ${consequence.id} → ${effects.chain_trigger}`);
        }
      }
    }

    // Add news event about the ignored consequence
    this.newsEvents.unshift({
      id: `news_ignored_${Date.now()}`,
      phase: currentPhase,
      headline_de: `${consequence.label_de} - Ignoriert!`,
      headline_en: `${consequence.label_en} - Ignored!`,
      description_de: `Sie haben nicht rechtzeitig reagiert. Die Situation eskaliert.`,
      description_en: `You failed to respond in time. The situation escalates.`,
      type: 'consequence',
      severity: 'danger',
      sourceConsequenceId: consequence.id,
      read: false,
      pinned: true,
    });

    // Clear the active consequence in adapter
    this.activeConsequence = null;

    console.log(`[IgnoredConsequence] ${consequence.label_de} - effects applied:`, effects);
  }

  private generateWorldEvents(phase: number): NewsEvent[] {
    const generatedEvents: NewsEvent[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = worldEventsData as any;

    for (const eventDef of data.worldEvents) {
      // Check if event should trigger
      if (this.shouldTriggerWorldEvent(eventDef, phase)) {
        const newsEvent: NewsEvent = {
          id: `world_${eventDef.id}_${phase}`,
          phase,
          headline_de: eventDef.headline_de,
          headline_en: eventDef.headline_en,
          description_de: eventDef.description_de,
          description_en: eventDef.description_en,
          type: 'world_event',
          severity: eventDef.severity || 'info',
          read: false,
          pinned: false,
        };

        generatedEvents.push(newsEvent);
        this.newsEvents.push(newsEvent);

        // P2-7: Record cooldown for this event
        this.worldEventCooldowns.set(eventDef.id, phase);

        // Apply event effects
        this.applyWorldEventEffects(eventDef.effects);

        console.log(`World event triggered: ${eventDef.headline_de}`);
      }
    }

    return generatedEvents;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private shouldTriggerWorldEvent(eventDef: any, phase: number): boolean {
    const trigger = eventDef.trigger;
    if (!trigger) return false;

    // P2-7: Check cooldown - prevent same event from triggering too often
    const lastTriggered = this.worldEventCooldowns.get(eventDef.id);
    if (lastTriggered !== undefined) {
      const phasesSinceLastTrigger = phase - lastTriggered;
      if (phasesSinceLastTrigger < this.WORLD_EVENT_COOLDOWN) {
        return false;  // Still on cooldown
      }
    }

    // Use seeded random for consistency
    const eventRandom = this.seededRandom(`event_${eventDef.id}_${phase}`);

    switch (trigger.type) {
      case 'phase':
        // Triggers at specific phase
        if (trigger.conditions.phaseNumber && phase === trigger.conditions.phaseNumber) {
          return true;
        }
        // Triggers at phase multiples (e.g., every 24 phases)
        if (trigger.conditions.phaseMultiple && phase % trigger.conditions.phaseMultiple === 0) {
          return true;
        }
        return false;

      case 'random':
        // Random trigger with minimum phase requirement
        if (trigger.conditions.minPhase && phase < trigger.conditions.minPhase) {
          return false;
        }
        return eventRandom < (trigger.conditions.probability || eventDef.probability || 0.1);

      case 'risk_threshold':
        // Trigger when risk exceeds threshold
        if (this.storyResources.risk > (trigger.conditions.riskAbove || 50)) {
          return eventRandom < (trigger.conditions.probability || 0.2);
        }
        return false;

      case 'attention_threshold':
        // Trigger when attention exceeds threshold
        if (this.storyResources.attention > (trigger.conditions.attentionAbove || 50)) {
          return eventRandom < (trigger.conditions.probability || 0.2);
        }
        return false;

      case 'objective_progress':
        // Trigger based on objective progress
        const objective = this.objectives.find(o => o.category === trigger.conditions.objective);
        if (objective && objective.currentValue >= (trigger.conditions.progressAbove || 50)) {
          return eventRandom < (trigger.conditions.probability || 0.3);
        }
        return false;

      case 'relationship_threshold':
        // Trigger when any NPC relationship exceeds threshold
        for (const npc of this.npcStates.values()) {
          if (npc.relationshipLevel >= (trigger.conditions.anyNpcAbove || 2)) {
            return eventRandom < (trigger.conditions.probability || 0.3);
          }
        }
        return false;

      default:
        return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private applyWorldEventEffects(effects: any): void {
    if (!effects) return;

    // Budget changes
    if (effects.budget_increase) {
      this.storyResources.budget += effects.budget_increase;
    }

    // Risk changes
    if (effects.risk_increase) {
      this.storyResources.risk = Math.min(100, this.storyResources.risk + effects.risk_increase);
    }

    // Attention changes
    if (effects.attention_increase) {
      this.storyResources.attention = Math.min(100, this.storyResources.attention + effects.attention_increase);
    }

    // Polarization boost affects trust objective
    if (effects.polarization_boost) {
      const trustObj = this.objectives.find(o => o.category === 'trust_reduction');
      if (trustObj) {
        trustObj.currentValue = Math.max(0, trustObj.currentValue - effects.polarization_boost);
      }
    }
  }

  private seededRandom(seed: string = `phase_${this.storyPhase.number}`): number {
    // Simple hash-based seeded random
    let hash = 0;
    const fullSeed = this.rngSeed + seed;
    for (let i = 0; i < fullSeed.length; i++) {
      const char = fullSeed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash % 1000) / 1000;
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

    // P2-8: NPC Relationship Progress - improve relationship with NPCs matching action affinity
    this.updateNPCRelationships(action, options?.npcAssist);

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
    // P1-3 Fix: Calculate implicit trust_erosion from action effects and phase
    let trustErosionValue = 0;

    // Explicit trust_erosion
    if (actionEffects.trust_erosion && typeof actionEffects.trust_erosion === 'number') {
      trustErosionValue += Math.round(actionEffects.trust_erosion * effectivenessMultiplier * 10);
    }

    // Implicit trust_erosion from other effects (content/amplification actions contribute)
    if (actionEffects.content_quality && typeof actionEffects.content_quality === 'number') {
      trustErosionValue += Math.round(actionEffects.content_quality * effectivenessMultiplier * 2);
    }
    if (actionEffects.virality_boost && typeof actionEffects.virality_boost === 'number') {
      trustErosionValue += Math.round(actionEffects.virality_boost * effectivenessMultiplier * 3);
    }
    if (actionEffects.polarization && typeof actionEffects.polarization === 'number') {
      trustErosionValue += Math.round(actionEffects.polarization * effectivenessMultiplier * 4);
    }
    if (actionEffects.amplification_base && typeof actionEffects.amplification_base === 'number') {
      trustErosionValue += Math.round(actionEffects.amplification_base * effectivenessMultiplier * 5);
    }
    if (actionEffects.amplification_bonus && typeof actionEffects.amplification_bonus === 'number') {
      trustErosionValue += Math.round(actionEffects.amplification_bonus * effectivenessMultiplier * 3);
    }

    // Base trust erosion for aggressive actions (grey/illegal with no specific effects)
    if (trustErosionValue === 0) {
      const loadedAction = this.actionLoader.getAction(action.id);
      if (loadedAction) {
        // Content/amplification phases contribute to trust erosion
        const aggressivePhases = ['ta03', 'ta04', 'ta05', 'targeting'];
        if (aggressivePhases.includes(loadedAction.phase)) {
          trustErosionValue = loadedAction.legality === 'illegal' ? 3 :
                              loadedAction.legality === 'grey' ? 2 : 1;
        }
      }
    }

    if (trustErosionValue > 0) {
      effects.push({
        type: 'trust_erosion',
        value: trustErosionValue,
        description_de: `Vertrauenserosion +${trustErosionValue}%`,
        description_en: `Trust erosion +${trustErosionValue}%`,
      });

      // Update primary objective progress
      const destabilizeObj = this.objectives.find(o => o.id === 'obj_destabilize');
      if (destabilizeObj) {
        destabilizeObj.currentValue = Math.max(0, destabilizeObj.currentValue - trustErosionValue);
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
    // P0-2 Fix: Use unique seed per RNG call to ensure different random values
    let rngCounter = 0;
    const pendingFromSystem = this.consequenceSystem.onActionExecuted(
      action.id,
      this.storyPhase.number,
      () => this.seededRandom(`action_${action.id}_${this.storyPhase.number}_${rngCounter++}`)
    );

    // Convert to UI-friendly pending consequences and add to our list
    const consequenceLabels: string[] = [];

    for (const pending of pendingFromSystem) {
      const def = this.consequenceSystem.getDefinition(pending.consequenceId);
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

  /**
   * P2-8: Update NPC relationships based on action execution
   */
  private updateNPCRelationships(action: StoryAction, npcAssist?: string): void {
    // NPCs with affinity to this action get relationship progress
    for (const npcId of action.npcAffinity) {
      const npc = this.npcStates.get(npcId);
      if (!npc) continue;

      // Base progress for actions in their specialty
      let progressGain = 5;

      // Bonus if this NPC was specifically assisting
      if (npcAssist === npcId) {
        progressGain = 15;
      }

      // Apply progress
      npc.relationshipProgress += progressGain;

      // Check for level up (every 100 progress points)
      if (npc.relationshipProgress >= 100 && npc.relationshipLevel < 3) {
        npc.relationshipLevel++;
        npc.relationshipProgress -= 100;
        console.log(`🤝 NPC ${npc.name} relationship upgraded to level ${npc.relationshipLevel}`);
      }

      // Successful actions also improve morale slightly
      npc.morale = Math.min(100, npc.morale + 2);

      // If was in crisis and morale recovered, clear crisis
      if (npc.inCrisis && npc.morale >= 50) {
        npc.inCrisis = false;
        console.log(`✅ NPC ${npc.name} recovered from crisis`);
      }
    }
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

  /**
   * Get NPC dialogue based on context
   * TD-006: Dynamic NPC dialogues from JSON
   */
  getNPCDialogue(npcId: string, context: {
    type: 'greeting' | 'reaction' | 'topic';
    subtype?: string;  // For reactions: 'success'/'failure'/'crisis', for topics: topic name
    relationshipLevel?: number;
  }): string | null {
    const dialogues = this.npcDialogues.get(npcId);
    if (!dialogues) return null;

    const npc = this.npcStates.get(npcId);
    if (!npc) return null;

    switch (context.type) {
      case 'greeting': {
        const level = context.relationshipLevel ?? npc.relationshipLevel;
        const greetings = dialogues.greetings;
        return greetings?.[level.toString()] || greetings?.['0'] || null;
      }
      case 'reaction': {
        const reactions = dialogues.reactions;
        return reactions?.[context.subtype || 'success'] || null;
      }
      case 'topic': {
        const topics = dialogues.topics;
        return topics?.[context.subtype || ''] || null;
      }
      default:
        return null;
    }
  }

  /**
   * Get available topics for an NPC
   */
  getNPCTopics(npcId: string): string[] {
    const dialogues = this.npcDialogues.get(npcId);
    if (!dialogues || !dialogues.topics) return [];
    return Object.keys(dialogues.topics);
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
    const stats = this.getEndStats();
    const primaryObjectives = this.objectives.filter(o => o.type === 'primary');
    const allCompleted = primaryObjectives.every(o => o.completed);
    const npcArray = Array.from(this.npcStates.values());
    const npcsInCrisis = npcArray.filter(npc => npc.inCrisis).length;
    const allNpcsLost = npcsInCrisis >= npcArray.length - 1; // Almost all NPCs in crisis

    // ENDING 1: Exposure/Defeat - Risk too high
    if (this.storyResources.risk >= 85) {
      // Check if player chose to flee (escape ending)
      // This would be set by a specific consequence choice
      return {
        type: 'defeat',
        title_de: 'Enttarnt',
        title_en: 'Exposed',
        description_de: this.exposureCountdown === 0
          ? 'Die Untersuchung hat Sie erreicht. Es gibt kein Entkommen mehr.'
          : 'Ihre Operationen wurden aufgedeckt. Die Verbindung zu Ostland ist bewiesen.',
        description_en: this.exposureCountdown === 0
          ? 'The investigation has caught up with you. There is no escape.'
          : 'Your operations have been uncovered. The connection to Ostland is proven.',
        stats,
        epilogue_de: 'Sie werden zur persona non grata erklärt. Diplomatische Beziehungen werden eingefroren. Ihre Karriere endet in Schande.',
        epilogue_en: 'You are declared persona non grata. Diplomatic relations are frozen. Your career ends in disgrace.',
      };
    }

    // ENDING 2: Moral Redemption - High moral weight and player turned
    // Triggered when moral weight is extremely high and specific conditions are met
    if (this.storyResources.moralWeight >= 80 && allNpcsLost) {
      return {
        type: 'moral_redemption',
        title_de: 'Gewissensentscheidung',
        title_en: 'Crisis of Conscience',
        description_de: 'Die Last Ihrer Taten ist unerträglich geworden. Sie haben beschlossen, auszusteigen.',
        description_en: 'The weight of your actions has become unbearable. You have decided to defect.',
        stats,
        epilogue_de: 'Sie kontaktieren westliche Geheimdienste und bieten Ihre Kooperation an. Ein neues Leben unter neuem Namen beginnt.',
        epilogue_en: 'You contact Western intelligence and offer your cooperation. A new life under a new name begins.',
      };
    }

    // ENDING 3: Escape - Risk is critical but player chose to flee
    // This can be triggered by specific consequence choices or if risk hits 75-84
    if (this.storyResources.risk >= 75 && this.storyResources.risk < 85 && this.storyResources.moralWeight < 50) {
      // Check if there's an active escape opportunity (from consequence choice)
      const hasEscapeOpportunity = this.exposureCountdown !== null && this.exposureCountdown <= 1;

      if (hasEscapeOpportunity) {
        return {
          type: 'escape',
          title_de: 'Flucht nach Osten',
          title_en: 'Flight to the East',
          description_de: 'Sie haben die Zeichen erkannt. Bevor die Schlinge sich zuzieht, setzen Sie sich nach Ostland ab.',
          description_en: 'You recognized the signs. Before the noose tightens, you escape to Ostland.',
          stats,
          epilogue_de: 'In Ostland werden Sie als Held empfangen. Doch die Schatten Ihrer Taten folgen Ihnen.',
          epilogue_en: 'In Ostland you are received as a hero. But the shadows of your deeds follow you.',
        };
      }
    }

    // ENDING 4: Victory - Time limit with objectives completed
    if (this.storyPhase.number >= this.PHASES_PER_YEAR * this.MAX_YEARS) {
      if (allCompleted) {
        // Determine victory flavor based on moral weight
        const isDarkVictory = this.storyResources.moralWeight >= 50;

        return {
          type: 'victory',
          title_de: isDarkVictory ? 'Pyrrhussieg' : 'Mission erfüllt',
          title_en: isDarkVictory ? 'Pyrrhic Victory' : 'Mission Accomplished',
          description_de: isDarkVictory
            ? 'Sie haben Ihre Ziele erreicht - aber zu welchem Preis?'
            : 'Nach 10 Jahren haben Sie Ihre Ziele erreicht.',
          description_en: isDarkVictory
            ? 'You have achieved your objectives - but at what cost?'
            : 'After 10 years, you have achieved your objectives.',
          stats,
          epilogue_de: isDarkVictory
            ? 'Westunion ist destabilisiert. Moskau ist zufrieden. Doch nachts verfolgen Sie die Gesichter derer, die Sie geopfert haben.'
            : 'Westunion ist gespalten. Moskau ist zufrieden. Sie werden befördert und kehren als Held heim.',
          epilogue_en: isDarkVictory
            ? 'Westunion is destabilized. Moscow is pleased. But at night, the faces of those you sacrificed haunt you.'
            : 'Westunion is divided. Moscow is pleased. You are promoted and return home as a hero.',
        };
      } else {
        return {
          type: 'defeat',
          title_de: 'Zeit abgelaufen',
          title_en: 'Time\'s Up',
          description_de: 'Die Zeit ist abgelaufen, ohne dass die Ziele erreicht wurden.',
          description_en: 'Time has run out without achieving the objectives.',
          stats,
          epilogue_de: 'Sie werden abberufen. Ihre Karriere stagniert. Jüngere Agenten überholen Sie.',
          epilogue_en: 'You are recalled. Your career stagnates. Younger agents surpass you.',
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
      exposureCountdown: this.exposureCountdown,
      newsEvents: this.newsEvents,
      objectives: this.objectives,
      npcStates: Array.from(this.npcStates.entries()),
      actionHistory: this.actionHistory,
      worldEventCooldowns: Array.from(this.worldEventCooldowns.entries()),
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
    this.exposureCountdown = state.exposureCountdown ?? null;
    this.newsEvents = state.newsEvents;
    this.objectives = state.objectives;
    this.npcStates = new Map(state.npcStates);
    this.actionHistory = state.actionHistory;
    this.worldEventCooldowns = new Map(state.worldEventCooldowns || []);

    // Restore engine state
    if (state.actionLoaderState) {
      this.actionLoader.importState(state.actionLoaderState);
    }
    if (state.consequenceSystemState) {
      this.consequenceSystem.importState(state.consequenceSystemState);
    }
  }

  // ============================================
  // DIALOGUE SYSTEM
  // ============================================

  /**
   * Get greeting dialogue for an NPC based on current relationship
   */
  getNPCGreeting(npcId: string): Dialogue | null {
    const npc = this.npcStates.get(npcId);
    if (!npc) return null;

    return this.dialogLoader.getGreeting(
      npcId,
      npc.relationshipLevel,
      () => this.seededRandom(`greeting_${npcId}_${this.storyPhase.number}`)
    );
  }

  /**
   * Get briefing dialogue for an NPC
   */
  getNPCBriefing(npcId: string): Dialogue | null {
    return this.dialogLoader.getBriefing(
      npcId,
      this.storyPhase.number,
      () => this.seededRandom(`briefing_${npcId}_${this.storyPhase.number}`)
    );
  }

  /**
   * Get NPC reaction to an action
   */
  getNPCReaction(npcId: string, actionTags: string[]): Dialogue | null {
    const npc = this.npcStates.get(npcId);
    if (!npc) return null;

    const conditions = {
      morale: npc.morale,
      risk: this.storyResources.risk,
      moral_weight: this.storyResources.moralWeight || 0
    };

    return this.dialogLoader.getReaction(
      npcId,
      actionTags,
      conditions,
      () => this.seededRandom(`reaction_${npcId}_${this.storyPhase.number}`)
    );
  }

  /**
   * Get crisis dialogue for an NPC (if in crisis state)
   */
  getNPCCrisisDialogue(npcId: string): Dialogue | null {
    const npc = this.npcStates.get(npcId);
    if (!npc || !npc.inCrisis) return null;

    // Calculate objective progress
    const primaryObjective = this.objectives.find(o => o.id === 'destabilize_westunion');
    const objectiveProgress = primaryObjective
      ? (primaryObjective.currentValue / primaryObjective.targetValue) * 100
      : 0;

    const conditions = {
      morale: npc.morale,
      risk: this.storyResources.risk,
      moscow_pressure: this.storyPhase.number > 60 && objectiveProgress < 50,
      moral_weight: this.storyResources.moralWeight || 0
    };

    return this.dialogLoader.getCrisisDialogue(npcId, conditions);
  }

  /**
   * Get first meeting dialogue for an NPC
   */
  getNPCFirstMeeting(npcId: string): Dialogue | null {
    return this.dialogLoader.getFirstMeetingDialogue(npcId);
  }

  /**
   * Get game end dialogue for an NPC
   */
  getNPCGameEndDialogue(npcId: string, isVictory: boolean): string | null {
    return this.dialogLoader.getGameEndDialogue(npcId, isVictory);
  }

  /**
   * Process player response to dialogue
   */
  processDialogueResponse(response: DialogueResponse, npcId: string): void {
    const effects = this.dialogLoader.getResponseEffects(response.effect);
    if (!effects) return;

    const npc = this.npcStates.get(npcId);
    if (!npc) return;

    // Apply relationship change
    npc.relationshipProgress += effects.relationship_change;
    if (npc.relationshipProgress >= 100 && npc.relationshipLevel < 3) {
      npc.relationshipLevel++;
      npc.relationshipProgress -= 100;
    } else if (npc.relationshipProgress < 0 && npc.relationshipLevel > 0) {
      npc.relationshipLevel--;
      npc.relationshipProgress = 100 + npc.relationshipProgress;
    }

    // Apply morale change
    npc.morale = Math.max(0, Math.min(100, npc.morale + effects.morale_change));

    // Check for crisis triggers
    if (effects.triggers?.includes('npc_fear')) {
      npc.inCrisis = true;
    }
  }

  // ============================================
  // COUNTERMEASURE SYSTEM
  // ============================================

  /**
   * Check for countermeasures after an action
   */
  checkForCountermeasures(actionId?: string, actionTags?: string[]): CountermeasureDefinition[] {
    const context = {
      risk: this.storyResources.risk,
      attention: this.storyResources.attention,
      phase: this.storyPhase.number,
      actionId,
      actionTags,
      moralWeight: this.storyResources.moralWeight || 0,
      teamSize: this.npcStates.size
    };

    return this.countermeasureSystem.checkForCountermeasures(
      context,
      () => this.seededRandom(`countermeasure_${this.storyPhase.number}`)
    );
  }

  /**
   * Get all active countermeasures
   */
  getActiveCountermeasures(): Array<{ active: ActiveCountermeasure; definition: CountermeasureDefinition }> {
    return this.countermeasureSystem.getActiveCountermeasures();
  }

  /**
   * Resolve a countermeasure with the chosen option
   */
  resolveCountermeasure(cmId: string, optionIndex: number): CounterOption | null {
    const option = this.countermeasureSystem.resolveCountermeasure(
      cmId,
      optionIndex,
      this.storyPhase.number
    );

    if (option && option.cost) {
      // Apply costs
      if (option.cost.budget) {
        this.storyResources.budget -= option.cost.budget;
      }
      if (option.cost.capacity) {
        this.storyResources.capacity -= option.cost.capacity;
      }
      if (option.cost.risk) {
        this.storyResources.risk += option.cost.risk;
      }
    }

    return option;
  }

  /**
   * Get potential countermeasures that could be triggered by an action
   */
  getPotentialCountermeasures(actionId: string, actionTags: string[]): CountermeasureDefinition[] {
    return this.countermeasureSystem.getPotentialCountermeasuresForAction(actionId, actionTags);
  }

  // ============================================
  // SAVE/LOAD/RESET
  // ============================================

  /**
   * Reset game to initial state
   */
  reset(): void {
    this.storyPhase = this.createPhase(1);
    this.storyResources = this.createInitialResources();
    this.pendingConsequences = [];
    this.activeConsequence = null;
    this.exposureCountdown = null;
    this.newsEvents = [];
    this.actionHistory = [];
    this.worldEventCooldowns.clear();
    this.initializeNPCs();
    this.initializeObjectives();

    // Reset engine components
    this.actionLoader.reset();
    this.consequenceSystem.reset();
    this.countermeasureSystem.reset();
  }
}

// ============================================
// FACTORY FUNCTION
// ============================================

export function createStoryEngine(seed?: string): StoryEngineAdapter {
  return new StoryEngineAdapter(seed);
}
