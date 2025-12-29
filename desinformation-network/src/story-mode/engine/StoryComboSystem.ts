/**
 * StoryComboSystem - Combo tracking for Story Mode
 *
 * Adapts the core combo system for Story Mode's action-based gameplay.
 * Combos are "discoverable" - not shown until partially triggered.
 *
 * Design Decision: Combos are meant to be discovered, not planned.
 * Players only see hints once they've started a combo.
 */

import comboData from '../../data/game/combo-definitions.json';
import type { ComboDefinition, ComboBonus } from '../../game-logic/combo-system';

// ============================================
// STORY MODE COMBO TYPES
// ============================================

/**
 * Story Mode action to combo ability mapping
 * Maps action IDs (like "3.4") to combo ability names (like "spread_fake_news")
 */
const ACTION_TO_COMBO_ABILITY: Record<string, string[]> = {
  // Content Creation (ta03)
  '3.1': ['spread_fake_news', 'conspiracy_theory'],       // Narrative entwickeln
  '3.2': ['fearmongering', 'exploit_emotion'],            // Emotionale Hooks
  '3.3': ['spread_fake_news', 'amplify_disinformation'],  // Memes
  '3.4': ['spread_fake_news', 'conspiracy_theory'],       // Fake News
  '3.5': ['conspiracy_theory', 'sow_doubt'],              // Verschwörungstheorie

  // Amplification (ta04)
  '4.1': ['amplify_disinformation', 'astroturfing'],      // Social Media Kampagne
  '4.2': ['build_bot_network', 'sockpuppet_account'],     // Bot-Netzwerk
  '4.3': ['amplify_disinformation', 'astroturfing'],      // Hashtag-Kampagne
  '4.4': ['echo_chamber', 'algorithmic_manipulation'],    // Echo Chamber

  // Attacks (ta05)
  '5.1': ['character_assassination', 'sow_doubt'],        // Journalist attackieren
  '5.2': ['character_assassination', 'fearmongering'],    // Doxxing
  '5.3': ['fearmongering', 'exploit_emotion'],            // Harassment

  // Political (ta06)
  '6.1': ['fake_credentials', 'sow_doubt'],               // Politician infiltration
  '6.2': ['astroturfing', 'divide_conquer'],              // Lobby contacts

  // Polarization (ta07)
  '7.1': ['divide_conquer', 'exploit_emotion'],           // Polarisierung verstärken
  '7.2': ['sow_doubt', 'conspiracy_theory'],              // Whataboutism
};

/**
 * Tag-based combo ability mapping (for flexibility)
 */
const TAG_TO_COMBO_ABILITY: Record<string, string[]> = {
  'fake_news': ['spread_fake_news', 'conspiracy_theory'],
  'propaganda': ['spread_fake_news', 'amplify_disinformation'],
  'conspiracy': ['conspiracy_theory', 'sow_doubt'],
  'meme': ['spread_fake_news'],
  'bot': ['build_bot_network', 'sockpuppet_account'],
  'amplification': ['amplify_disinformation', 'astroturfing'],
  'viral': ['amplify_disinformation'],
  'astroturfing': ['astroturfing', 'sockpuppet_account'],
  'attack': ['character_assassination'],
  'discredit': ['character_assassination', 'sow_doubt'],
  'harassment': ['fearmongering', 'exploit_emotion'],
  'doxxing': ['character_assassination', 'fearmongering'],
  'polarization': ['divide_conquer', 'exploit_emotion'],
  'exploit': ['exploit_emotion', 'fearmongering'],
  'emotional': ['exploit_emotion', 'fearmongering'],
  'infiltration': ['fake_credentials'],
  'platform': ['algorithmic_manipulation', 'echo_chamber'],
  'election': ['divide_conquer', 'amplify_disinformation'],
};

/**
 * Active combo progress in Story Mode
 */
export interface StoryComboProgress {
  comboId: string;
  comboName: string;
  completedAbilities: string[];       // Which combo abilities are done
  remainingAbilities: string[];       // What's left to complete
  startPhase: number;
  expiresPhase: number;
  progress: number;                   // 0-1 percentage
  isDiscovered: boolean;              // Has player seen this combo hint?
}

/**
 * Completed combo for effects
 */
export interface StoryComboActivation {
  comboId: string;
  comboName: string;
  description: string;
  completedPhase: number;
  bonus: ComboBonus;
  category: string;
}

/**
 * Combo hint shown to player
 */
export interface ComboHint {
  comboId: string;
  comboName: string;
  progress: number;
  hint_de: string;
  hint_en: string;
  nextAction_de?: string;
  nextAction_en?: string;
  expiresIn: number;  // Phases until expiration
}

// ============================================
// STORY COMBO SYSTEM CLASS
// ============================================

export class StoryComboSystem {
  private comboDefinitions: ComboDefinition[] = [];
  private activeProgress: Map<string, StoryComboProgress> = new Map();
  private completedCombos: string[] = [];  // History of completed combo IDs
  private discoveredCombos: Set<string> = new Set();  // Player knows about these

  constructor() {
    this.loadCombos();
  }

  private loadCombos(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.comboDefinitions = comboData as any;
    console.log(`[StoryComboSystem] Loaded ${this.comboDefinitions.length} combo definitions`);
  }

  /**
   * Get combo abilities triggered by an action
   */
  private getAbilitiesForAction(actionId: string, tags: string[]): string[] {
    const abilities = new Set<string>();

    // Direct action mapping
    if (ACTION_TO_COMBO_ABILITY[actionId]) {
      ACTION_TO_COMBO_ABILITY[actionId].forEach(a => abilities.add(a));
    }

    // Tag-based mapping
    for (const tag of tags) {
      if (TAG_TO_COMBO_ABILITY[tag]) {
        TAG_TO_COMBO_ABILITY[tag].forEach(a => abilities.add(a));
      }
    }

    return Array.from(abilities);
  }

  /**
   * Process an action execution and update combo progress
   * Returns completed combos and new hints
   */
  processAction(
    actionId: string,
    tags: string[],
    currentPhase: number
  ): {
    completedCombos: StoryComboActivation[];
    newHints: ComboHint[];
    progressUpdates: StoryComboProgress[];
  } {
    const triggeredAbilities = this.getAbilitiesForAction(actionId, tags);
    if (triggeredAbilities.length === 0) {
      return { completedCombos: [], newHints: [], progressUpdates: [] };
    }

    const completedCombos: StoryComboActivation[] = [];
    const newHints: ComboHint[] = [];
    const progressUpdates: StoryComboProgress[] = [];

    // Check each combo definition
    for (const combo of this.comboDefinitions) {
      const progressKey = combo.id;
      let progress = this.activeProgress.get(progressKey);

      // Check if any triggered ability matches the combo's required abilities
      for (const ability of triggeredAbilities) {
        if (!combo.requiredAbilities.includes(ability)) continue;

        if (progress) {
          // Check if this ability is next in sequence or fills a gap
          if (progress.remainingAbilities.includes(ability)) {
            // Progress the combo
            const newCompleted = [...progress.completedAbilities, ability];
            const newRemaining = progress.remainingAbilities.filter(a => a !== ability);

            if (newRemaining.length === 0) {
              // COMBO COMPLETE!
              completedCombos.push({
                comboId: combo.id,
                comboName: combo.name,
                description: combo.description,
                completedPhase: currentPhase,
                bonus: combo.bonusEffect,
                category: combo.category,
              });

              this.completedCombos.push(combo.id);
              this.activeProgress.delete(progressKey);
              this.discoveredCombos.add(combo.id);

              console.log(`[COMBO] Completed: ${combo.name}`);
            } else {
              // Update progress
              progress = {
                ...progress,
                completedAbilities: newCompleted,
                remainingAbilities: newRemaining,
                progress: newCompleted.length / combo.requiredAbilities.length,
              };
              this.activeProgress.set(progressKey, progress);
              progressUpdates.push(progress);

              // If more than half done and not discovered, show hint
              if (progress.progress >= 0.5 && !progress.isDiscovered) {
                progress.isDiscovered = true;
                this.discoveredCombos.add(combo.id);
                newHints.push(this.createHint(combo, progress, currentPhase));
              }
            }
            break; // Only process one ability per combo per action
          }
        } else {
          // Check if this ability starts the combo
          if (combo.requiredAbilities[0] === ability ||
              combo.requiredAbilities.includes(ability)) {
            // Start new combo progress
            const completedAbilities = [ability];
            const remainingAbilities = combo.requiredAbilities.filter(a => a !== ability);

            progress = {
              comboId: combo.id,
              comboName: combo.name,
              completedAbilities,
              remainingAbilities,
              startPhase: currentPhase,
              expiresPhase: currentPhase + this.getPhaseWindow(combo),
              progress: completedAbilities.length / combo.requiredAbilities.length,
              isDiscovered: false,
            };

            this.activeProgress.set(progressKey, progress);
            progressUpdates.push(progress);

            console.log(`[COMBO] Started: ${combo.name} (${progress.progress * 100}%)`);
            break;
          }
        }
      }
    }

    return { completedCombos, newHints, progressUpdates };
  }

  /**
   * Convert round-based window to phase-based window
   */
  private getPhaseWindow(combo: ComboDefinition): number {
    // Roughly 3 phases per combo round seems balanced
    return combo.windowRounds * 3;
  }

  /**
   * Create a hint for a partially completed combo
   */
  private createHint(
    combo: ComboDefinition,
    progress: StoryComboProgress,
    currentPhase: number
  ): ComboHint {
    const expiresIn = progress.expiresPhase - currentPhase;

    // Get next ability and translate to action hint
    const nextAbility = progress.remainingAbilities[0];
    const nextActionHints = this.getActionHintForAbility(nextAbility);

    return {
      comboId: combo.id,
      comboName: combo.name,
      progress: progress.progress,
      hint_de: `Kombination "${combo.name}" in Arbeit... (${Math.round(progress.progress * 100)}%)`,
      hint_en: `Combo "${combo.name}" in progress... (${Math.round(progress.progress * 100)}%)`,
      nextAction_de: nextActionHints.de,
      nextAction_en: nextActionHints.en,
      expiresIn,
    };
  }

  /**
   * Get suggested action for a combo ability
   */
  private getActionHintForAbility(ability: string): { de: string; en: string } {
    const hints: Record<string, { de: string; en: string }> = {
      spread_fake_news: {
        de: 'Verbreite Fake News oder Memes',
        en: 'Spread fake news or memes',
      },
      amplify_disinformation: {
        de: 'Starte eine Amplifikations-Kampagne',
        en: 'Start an amplification campaign',
      },
      conspiracy_theory: {
        de: 'Entwickle eine Verschwörungstheorie',
        en: 'Develop a conspiracy theory',
      },
      sow_doubt: {
        de: 'Säe Zweifel in die Bevölkerung',
        en: 'Sow doubt among the population',
      },
      fearmongering: {
        de: 'Nutze emotionale Hooks oder Angst',
        en: 'Use emotional hooks or fear',
      },
      exploit_emotion: {
        de: 'Verstärke emotionale Polarisierung',
        en: 'Amplify emotional polarization',
      },
      character_assassination: {
        de: 'Attackiere einen Gegner',
        en: 'Attack an opponent',
      },
      build_bot_network: {
        de: 'Baue ein Bot-Netzwerk auf',
        en: 'Build a bot network',
      },
      astroturfing: {
        de: 'Starte eine Social-Media-Kampagne',
        en: 'Start a social media campaign',
      },
      sockpuppet_account: {
        de: 'Erstelle Fake-Accounts',
        en: 'Create fake accounts',
      },
      echo_chamber: {
        de: 'Etabliere eine Echo-Kammer',
        en: 'Establish an echo chamber',
      },
      algorithmic_manipulation: {
        de: 'Manipuliere Plattform-Algorithmen',
        en: 'Manipulate platform algorithms',
      },
      divide_conquer: {
        de: 'Vertiefe die gesellschaftliche Spaltung',
        en: 'Deepen social division',
      },
      fake_credentials: {
        de: 'Nutze falsche Autorität',
        en: 'Use fake authority',
      },
    };

    return hints[ability] || {
      de: 'Setze die Kampagne fort',
      en: 'Continue the campaign',
    };
  }

  /**
   * Clean up expired combo progress
   */
  cleanupExpired(currentPhase: number): void {
    const expired: string[] = [];

    for (const [key, progress] of this.activeProgress) {
      if (currentPhase > progress.expiresPhase) {
        expired.push(key);
        console.log(`[COMBO] Expired: ${progress.comboName}`);
      }
    }

    for (const key of expired) {
      this.activeProgress.delete(key);
    }
  }

  /**
   * Get active combo hints for display
   * Only shows combos that are discovered (50%+ complete)
   */
  getActiveHints(currentPhase: number): ComboHint[] {
    const hints: ComboHint[] = [];

    for (const progress of this.activeProgress.values()) {
      if (progress.isDiscovered && currentPhase <= progress.expiresPhase) {
        const combo = this.comboDefinitions.find(c => c.id === progress.comboId);
        if (combo) {
          hints.push(this.createHint(combo, progress, currentPhase));
        }
      }
    }

    return hints;
  }

  /**
   * Get all active combos (for internal tracking)
   */
  getAllActiveProgress(): StoryComboProgress[] {
    return Array.from(this.activeProgress.values());
  }

  /**
   * Get completed combo count by category
   */
  getComboStats(): {
    total: number;
    byCategory: Record<string, number>;
    discoveredCombos: string[];
  } {
    const byCategory: Record<string, number> = {};

    for (const comboId of this.completedCombos) {
      const combo = this.comboDefinitions.find(c => c.id === comboId);
      if (combo) {
        byCategory[combo.category] = (byCategory[combo.category] || 0) + 1;
      }
    }

    return {
      total: this.completedCombos.length,
      byCategory,
      discoveredCombos: Array.from(this.discoveredCombos),
    };
  }

  /**
   * Export state for save/load
   */
  exportState(): {
    activeProgress: [string, StoryComboProgress][];
    completedCombos: string[];
    discoveredCombos: string[];
  } {
    return {
      activeProgress: Array.from(this.activeProgress.entries()),
      completedCombos: this.completedCombos,
      discoveredCombos: Array.from(this.discoveredCombos),
    };
  }

  /**
   * Import state from save
   */
  importState(state: ReturnType<typeof this.exportState>): void {
    this.activeProgress = new Map(state.activeProgress);
    this.completedCombos = state.completedCombos || [];
    this.discoveredCombos = new Set(state.discoveredCombos || []);
  }

  /**
   * Reset combo system
   */
  reset(): void {
    this.activeProgress.clear();
    this.completedCombos = [];
    this.discoveredCombos.clear();
  }

  /**
   * Get count of completed combos
   */
  getCompletedCount(): number {
    return this.completedCombos.length;
  }
}

// Singleton instance
let storyComboSystemInstance: StoryComboSystem | null = null;

export function getStoryComboSystem(): StoryComboSystem {
  if (!storyComboSystemInstance) {
    storyComboSystemInstance = new StoryComboSystem();
  }
  return storyComboSystemInstance;
}

export function resetStoryComboSystem(): void {
  if (storyComboSystemInstance) {
    storyComboSystemInstance.reset();
  }
  storyComboSystemInstance = null;
}
