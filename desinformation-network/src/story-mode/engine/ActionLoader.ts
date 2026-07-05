/**
 * Story Mode Action Loader
 * Loads and manages actions from JSON data files
 */

// Import action data directly (bundled with the app)
import actionsData from '../data/actions.json';
import actionsContinuedData from '../data/actions_continued.json';
import actionsP1cData from '../data/actions_p1c.json';
import actionsP3PhenomenaData from '../data/actions_p3_phenomena.json';
import type { OperationParams } from '../battlefield/BattlefieldChain';
import { storyLogger } from '../../utils/logger';

// ============================================
// TYPES
// ============================================

export interface RawAction {
  id: string;
  phase: string;
  disarm_ref?: string | null;
  label_de: string;
  label_en?: string;
  /** Plakative Maßnahmen-Überschrift fürs Ausspielen (B5): „Bot-Netzwerk gestartet". */
  headline_de?: string;
  headline_en?: string;
  narrative_de?: string;
  narrative_en?: string;
  /** Draußen-O-Ton: wie die Botschaft in der Welt ankommt (ein Satz, für die Vortest-Karte). */
  botschaft_de?: string;
  costs: {
    budget?: number;
    capacity?: number;
    risk?: number;
    attention?: number;
    moral_weight?: number;
  };
  effects?: Record<string, unknown>;
  prerequisites?: string[];
  unlocks?: string[];
  npc_affinity: string[];
  legality: 'legal' | 'grey' | 'illegal';
  tags: string[];
  /**
   * P2 „Kommunikations-Schlachtfeld" — Verbreiter×Plattform-Auswahl als ids (additiv,
   * rückwärtskompatibel/heute leer). Die Engine löst sie über BattlefieldChain auf.
   * Schema: docs/STRANG34_P2_VERBREITER_PLATTFORM_KONZEPT.md §6.
   */
  params?: OperationParams;
}

export interface LoadedAction extends RawAction {
  // Runtime state
  isUnlocked: boolean;
  isUsed: boolean;
  useCount: number;
}

export interface ActionFilters {
  phase?: string;
  legality?: 'legal' | 'grey' | 'illegal';
  npcAffinity?: string;
  tags?: string[];
  unlockedOnly?: boolean;
  unusedOnly?: boolean;
}

// ============================================
// ACTION LOADER CLASS
// ============================================

/**
 * ARCHIVIERTE Aktionen (Etappe 5, Zielbild §12.7): der Katalog wird von 143 auf 60–80
 * kuratiert. Diese IDs sind aus dem Spiel-Draw genommen — der Datenbestand bleibt in den
 * JSON-Dateien erhalten (Repo-Regel „archivieren, nicht löschen"; jederzeit re-aktivierbar),
 * aber der Loader überspringt sie. So bleibt jede GELADENE Aktion Vokabular der Episoden/
 * Beats und bewegt sichtbar einen Läufer (ActionRunnerInvariant). Referenz-sicher gewählt:
 * keine wird von Episoden/Consequences/Combos/Tests referenziert oder ist prereq/unlock-
 * Provider einer geladenen Aktion (Planer-Closure).
 */
export const ARCHIVED_ACTION_IDS: ReadonlySet<string> = new Set<string>([
  '1.8', '1.9', '1.10', '2.5', '2.7', '2.9', '2.14', '2.15', '2.20',
  '3.7', '3.13', '3.14', '3.16', '3.17', '3.19',
  '4.5', '4.6', '4.7', '4.8', '4.9', '4.10', '4.11', '4.12', '4.13', '4.14', '4.15',
  '5.5', '5.8', '5.10', '5.11', '5.12',
  '6.3', '6.4', '6.5', '6.6', '6.8', '6.10',
  '7.4', '7.6', '7.7', '7.8',
  '8.3', '8.10', '8.12', '8.14', '8.15', '8.16',
  '9.1', '9.2', '9.4', '9.5', '9.6', '9.7', '9.8', '9.9', '9.10', '9.12', '9.13', '9.14', '9.15',
  '11.1', '11.6', '11.7', '11.12',
]);

export class ActionLoader {
  private actions: Map<string, LoadedAction> = new Map();
  private actionsByPhase: Map<string, LoadedAction[]> = new Map();
  private unlockedActionIds: Set<string> = new Set();
  private usedActionIds: Set<string> = new Set();

  constructor() {
    this.loadAllActions();
  }

  /**
   * Load all actions from JSON data
   */
  private loadAllActions(): void {
    const allRawActions: RawAction[] = [];

    // Load from actions.json
    if (actionsData.actions) {
      allRawActions.push(...(actionsData.actions as RawAction[]));
    }

    // Load from actions_continued.json (multiple phase arrays)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const continued = actionsContinuedData as any;
    const phaseKeys = [
      'actions_phase3',
      'actions_phase4',
      'actions_phase5',
      'actions_phase6_politics',
      'actions_phase7_society',
      'actions_phase8_targeting',
    ];

    for (const key of phaseKeys) {
      if (continued[key]) {
        allRawActions.push(...continued[key]);
      }
    }

    // P1c-Content (granulare Maßnahmen je Büro, separat geladen — kein Churn an den Bestandsdateien)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p1c = actionsP1cData as any;
    if (Array.isArray(p1c.actions_p1c)) {
      allRawActions.push(...p1c.actions_p1c);
    }

    // P3-Phänomene (Angriffs-„Verben", Konzept §5) — separat geladen, kein Churn.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p3 = actionsP3PhenomenaData as any;
    if (Array.isArray(p3.actions_p3_phenomena)) {
      allRawActions.push(...p3.actions_p3_phenomena);
    }

    // Process and store actions
    for (const raw of allRawActions) {
      // Kuratierung (Zielbild §12.7): archivierte Aktionen aus dem Draw nehmen.
      if (ARCHIVED_ACTION_IDS.has(raw.id)) continue;
      const action: LoadedAction = {
        ...raw,
        isUnlocked: this.shouldBeInitiallyUnlocked(raw),
        isUsed: false,
        useCount: 0,
      };

      this.actions.set(action.id, action);

      // Index by phase
      const phaseActions = this.actionsByPhase.get(action.phase) || [];
      phaseActions.push(action);
      this.actionsByPhase.set(action.phase, phaseActions);

      // Track initially unlocked
      if (action.isUnlocked) {
        this.unlockedActionIds.add(action.id);
      }
    }

    storyLogger.log(`ActionLoader: Loaded ${this.actions.size} actions`);
  }

  /**
   * Determine if action should be unlocked at game start
   */
  private shouldBeInitiallyUnlocked(action: RawAction): boolean {
    // Actions with no prerequisites are unlocked
    if (!action.prerequisites || action.prerequisites.length === 0) {
      return true;
    }
    return false;
  }

  // ============================================
  // GETTERS
  // ============================================

  /**
   * Get action by ID
   */
  getAction(id: string): LoadedAction | undefined {
    return this.actions.get(id);
  }

  /**
   * Get all actions
   */
  getAllActions(): LoadedAction[] {
    return Array.from(this.actions.values());
  }

  /**
   * Get actions with filters
   */
  getFilteredActions(filters: ActionFilters): LoadedAction[] {
    let result = this.getAllActions();

    if (filters.phase) {
      result = result.filter(a => a.phase === filters.phase);
    }

    if (filters.legality) {
      result = result.filter(a => a.legality === filters.legality);
    }

    if (filters.npcAffinity) {
      result = result.filter(a => a.npc_affinity.includes(filters.npcAffinity!));
    }

    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(a =>
        filters.tags!.some(tag => a.tags.includes(tag))
      );
    }

    if (filters.unlockedOnly) {
      result = result.filter(a => a.isUnlocked);
    }

    if (filters.unusedOnly) {
      result = result.filter(a => !a.isUsed);
    }

    return result;
  }

  /**
   * Get actions by phase
   */
  getActionsByPhase(phase: string): LoadedAction[] {
    return this.actionsByPhase.get(phase) || [];
  }

  /**
   * Get available actions (unlocked and not exhausted)
   */
  getAvailableActions(): LoadedAction[] {
    return this.getAllActions().filter(a => a.isUnlocked);
  }

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  /**
   * Mark action as used
   */
  markAsUsed(actionId: string): void {
    const action = this.actions.get(actionId);
    if (action) {
      action.useCount++;
      action.isUsed = true;
      this.usedActionIds.add(actionId);

      // Check unlocks
      if (action.unlocks) {
        for (const unlockId of action.unlocks) {
          this.unlockAction(unlockId);
        }
      }
    }
  }

  /**
   * Unlock an action
   */
  unlockAction(actionId: string): boolean {
    const action = this.actions.get(actionId);
    if (action && !action.isUnlocked) {
      // Check if prerequisites are met
      if (this.arePrerequisitesMet(action)) {
        action.isUnlocked = true;
        this.unlockedActionIds.add(actionId);
        storyLogger.log(`Action unlocked: ${action.label_de}`);
        return true;
      }
    }
    return false;
  }

  /**
   * Check if prerequisites are met for an action
   */
  arePrerequisitesMet(action: LoadedAction): boolean {
    if (!action.prerequisites || action.prerequisites.length === 0) {
      return true;
    }

    return action.prerequisites.every(prereqId => {
      const prereq = this.actions.get(prereqId);
      return prereq && prereq.isUsed;
    });
  }

  /**
   * Check all locked actions for newly met prerequisites
   */
  checkUnlocks(completedActionId: string): string[] {
    const newlyUnlocked: string[] = [];

    for (const action of this.actions.values()) {
      if (!action.isUnlocked && action.prerequisites?.includes(completedActionId)) {
        if (this.arePrerequisitesMet(action)) {
          action.isUnlocked = true;
          this.unlockedActionIds.add(action.id);
          newlyUnlocked.push(action.id);
          storyLogger.log(`Action unlocked: ${action.label_de}`);
        }
      }
    }

    return newlyUnlocked;
  }

  /**
   * Check if player can afford action
   */
  canAfford(actionId: string, resources: {
    budget: number;
    capacity: number;
    actionPoints: number;
  }): { canAfford: boolean; reason?: string } {
    const action = this.actions.get(actionId);
    if (!action) {
      return { canAfford: false, reason: 'Action not found' };
    }

    if (!action.isUnlocked) {
      return { canAfford: false, reason: 'Action locked' };
    }

    if (resources.actionPoints <= 0) {
      return { canAfford: false, reason: 'No action points remaining' };
    }

    if (action.costs.budget && resources.budget < action.costs.budget) {
      return { canAfford: false, reason: `Need ${action.costs.budget}K budget` };
    }

    if (action.costs.capacity && resources.capacity < action.costs.capacity) {
      return { canAfford: false, reason: `Need ${action.costs.capacity} capacity` };
    }

    return { canAfford: true };
  }

  // ============================================
  // STATISTICS
  // ============================================

  /**
   * Get action statistics
   */
  getStatistics(): {
    total: number;
    unlocked: number;
    used: number;
    byLegality: Record<string, number>;
    byPhase: Record<string, number>;
  } {
    const all = this.getAllActions();

    const byLegality: Record<string, number> = { legal: 0, grey: 0, illegal: 0 };
    const byPhase: Record<string, number> = {};

    for (const action of all) {
      byLegality[action.legality]++;
      byPhase[action.phase] = (byPhase[action.phase] || 0) + 1;
    }

    return {
      total: all.length,
      unlocked: this.unlockedActionIds.size,
      used: this.usedActionIds.size,
      byLegality,
      byPhase,
    };
  }

  // ============================================
  // SERIALIZATION
  // ============================================

  /**
   * Export state for save
   */
  exportState(): {
    unlockedIds: string[];
    usedIds: string[];
    useCounts: Record<string, number>;
  } {
    const useCounts: Record<string, number> = {};
    for (const action of this.actions.values()) {
      if (action.useCount > 0) {
        useCounts[action.id] = action.useCount;
      }
    }

    return {
      unlockedIds: Array.from(this.unlockedActionIds),
      usedIds: Array.from(this.usedActionIds),
      useCounts,
    };
  }

  /**
   * Import state from save
   */
  importState(state: {
    unlockedIds: string[];
    usedIds: string[];
    useCounts: Record<string, number>;
  }): void {
    // Reset all
    for (const action of this.actions.values()) {
      action.isUnlocked = this.shouldBeInitiallyUnlocked(action);
      action.isUsed = false;
      action.useCount = 0;
    }

    this.unlockedActionIds.clear();
    this.usedActionIds.clear();

    // Apply saved state
    for (const id of state.unlockedIds) {
      const action = this.actions.get(id);
      if (action) {
        action.isUnlocked = true;
        this.unlockedActionIds.add(id);
      }
    }

    for (const id of state.usedIds) {
      const action = this.actions.get(id);
      if (action) {
        action.isUsed = true;
        this.usedActionIds.add(id);
      }
    }

    for (const [id, count] of Object.entries(state.useCounts)) {
      const action = this.actions.get(id);
      if (action) {
        action.useCount = count;
      }
    }
  }

  /**
   * Reset all action state
   */
  reset(): void {
    for (const action of this.actions.values()) {
      action.isUnlocked = this.shouldBeInitiallyUnlocked(action);
      action.isUsed = false;
      action.useCount = 0;
    }

    this.unlockedActionIds.clear();
    this.usedActionIds.clear();

    // Re-track initially unlocked
    for (const action of this.actions.values()) {
      if (action.isUnlocked) {
        this.unlockedActionIds.add(action.id);
      }
    }
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

let actionLoaderInstance: ActionLoader | null = null;

export function getActionLoader(): ActionLoader {
  if (!actionLoaderInstance) {
    actionLoaderInstance = new ActionLoader();
  }
  return actionLoaderInstance;
}

export function resetActionLoader(): void {
  if (actionLoaderInstance) {
    actionLoaderInstance.reset();
  }
}
