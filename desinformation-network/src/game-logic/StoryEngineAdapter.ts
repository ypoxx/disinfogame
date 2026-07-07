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
  resetActionLoader,
  type LoadedAction,
} from '../story-mode/engine/ActionLoader';

import {
  ConsequenceSystem,
  getConsequenceSystem,
  resetConsequenceSystem,
  type ActiveConsequence as EngineActiveConsequence,
  type ConsequenceEffects,
} from '../story-mode/engine/ConsequenceSystem';

import {
  DialogLoader,
  type Dialogue,
  type DialogueResponse,
  type TopicDialogue,
  type TopicLayer,
  type DialogueContext,
  type Debate,
  type DialogueUIState,
} from '../story-mode/engine/DialogLoader';

import {
  CountermeasureSystem,
  type CountermeasureDefinition,
  type ActiveCountermeasure,
  type CounterOption,
} from '../story-mode/engine/CountermeasureSystem';

import {
  getTaxonomyLoader,
  type TaxonomyInfo,
  type TaxonomyTechnique,
} from '../story-mode/engine/TaxonomyLoader';

import {
  StoryComboSystem,
  getStoryComboSystem,
  resetStoryComboSystem,
  type StoryComboProgress,
  type StoryComboActivation,
  type ComboHint,
} from '../story-mode/engine/StoryComboSystem';

import {
  CrisisMomentSystem,
  getCrisisMomentSystem,
  resetCrisisMomentSystem,
  type CrisisMoment,
  type CrisisChoice,
  type ActiveCrisis,
  type CrisisResolution,
} from '../story-mode/engine/CrisisMomentSystem';

import {
  StoryActorAI,
  getStoryActorAI,
  resetStoryActorAI,
  type DefensiveActor,
  type AIAction,
} from '../story-mode/engine/StoryActorAI';

import {
  BetrayalSystem,
  getBetrayalSystem,
  resetBetrayalSystem,
  type BetrayalWarning,
  type BetrayalEvent,
} from '../story-mode/engine/BetrayalSystem';

import {
  EndingSystem,
  getEndingSystem,
  assembleAuftragEnding,
  type AssembledEnding,
  type EndingGameState,
} from '../story-mode/engine/EndingSystem';

import {
  getDecisionBeat,
  getBeatOption,
} from '../story-mode/engine/DecisionBeats';

import {
  recordThema,
  inoculationOf,
  seededThemes,
  type NarrativeMemoryState,
} from '../story-mode/engine/NarrativeMemory';

import { evaluateEnd, type EndBranch } from '../story-mode/engine/VictorySystem';

import {
  ABWEHR_START,
  abwehrStep,
  clampAbwehr,
  crossedAbwehrStages,
  isPatchTriggered,
  methodFamilyForTags,
  PATCH_ABWEHR_JUMP,
  ABWEHR_STAGES,
  type AbwehrStage,
  type NightReport,
} from '../story-mode/engine/ImmuneSystem';

// Etappe 5 — Geld-Tranchen (E18): die Zentrale zahlt nach Fortschritt statt passiv.
import {
  bewerteTranche,
  istTrancheTag,
  type TrancheResult,
} from '../story-mode/engine/Finanzen';

// Etappe 4 — Impfung & Abstumpfung: das Maschen-Gedächtnis (8 Milieus × 18 Familien).
import {
  leeresMaschenGedaechtnis,
  registriereEinsatz,
  brennendeMilieus,
  markiereFamilieBekannt,
  impfePrebunking,
  impfeFaktencheck,
  zielMilieusFuerTags,
  gewichteterMultiplikator,
  erklaereDaempfung,
  stempelFuer,
  effektiveAbstumpfung,
  effektiveImpfung,
  zellKey,
  PREBUNK_STRENGTH,
  WEAR_VERBRANNT_AB,
  type MaschenGedaechtnisState,
  type MaschenStempel,
  type ZielMilieu,
  type DaempfungsErklaerung,
} from '../story-mode/engine/MaschenGedaechtnis';
import { loadAudience, type AudienceSegment } from '../story-mode/audience/audienceModel';
import { loadDisinfoMethods } from '../story-mode/engine/DisinfoMethodAtlas';

import {
  ExtendedActorLoader,
  getExtendedActorLoader,
  resetExtendedActorLoader,
  type ExtendedActor,
  type ActorEffectivenessModifier,
} from '../story-mode/engine/ExtendedActorLoader';

import { resetAdvisorEngine } from '../story-mode/engine/NPCAdvisorEngine';
import { StoryNarrativeGenerator } from '../story-mode/engine/StoryNarrativeGenerator';
import { dialogLoader } from '../story-mode/engine/DialogLoader';
import {
  evaluateOperationParams,
  resolveOperationParams,
  isOperationComplete,
  loadCarriers,
  findTargetById,
  findVulnerability,
  kompromatCost,
  type OperationParams,
  type OperationResult,
  type CarrierState,
} from '../story-mode/battlefield/BattlefieldChain';

import { playSound } from '../story-mode/utils/SoundSystem';
import { storyLogger } from '../utils/logger';

// Import NPC and World Events data
import npcsData from '../story-mode/data/npcs.json';
import worldEventsData from '../story-mode/data/world-events.json';
import targetsData from '../story-mode/data/targets.json';
import disinfoMethodsData from '../story-mode/data/disinfo_methods.json';
import { validateReferences, reportValidationIssues, type ValidationIssue } from '../story-mode/engine/IdValidator';
import {
  societyDeltaFromAction,
  societyFormulaStep,
  scaleSocietyDelta,
  clampSocietyValue,
  type SocietyDelta,
  type SocietySnapshot,
} from '../story-mode/engine/SocietyDynamics';
import {
  loadEpisodes,
  getEpisode,
  isEpisodeTriggered,
  type Episode,
  type EpisodeTriggerContext,
} from '../story-mode/engine/EpisodeLoader';
import {
  AUFTRAEGE,
  auftragProgress,
  auftragMissionVerdict,
  PARTEI_NAME_DE,
  type Auftrag,
  type AuftragId,
} from '../story-mode/engine/Auftraege';
import { buildPollNews, pickPollInstrument } from '../story-mode/engine/PollNews';

// ============================================
// STORY MODE SPECIFIC TYPES
// ============================================

/**
 * Story Mode Zeit-Einheit
 * Eine Phase entspricht ca. 1 Monat im Spiel
 */
export interface StoryPhase {
  number: number;           // Tag der Kampagne (1..electionDay); Etappe 2: 1 Tag = 1 Phase
  year: number;             // DEPRECATED (konstant 1) — nur Save-Kompatibilität
  month: number;            // DEPRECATED (konstant 1) — nur Save-Kompatibilität
  /** Der Wahltag (Ziellinie der Kampagne); verschiebbar via shiftElectionDay. */
  electionDay: number;
  label_de: string;         // "Tag 12 — Wahl in 28 Tagen"
  label_en: string;         // "Day 12 — election in 28 days"
  isNewYear: boolean;       // DEPRECATED (konstant false)
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

  // === Gesellschaftswerte (B2, „Herzstück") ===
  // Mehrdimensionaler Gesellschafts-Zustand NEBEN der Sieg-Achse Vertrauen (obj_destabilize).
  // P1: existieren + sichtbar, bewegen sich noch NICHT (kein Effekt-Splitting) → Balance identisch.
  // Das volle Set ist von Anfang an vorgesehen (auch die Auftrags-Achsen §14.1), damit P5/P6 keinen
  // Umbau brauchen. 0–100. Sichtbar im HUD (O3/F3): polarisierung, informationslast, zynismus
  // (+ Vertrauen, das aus obj_destabilize gelesen wird). Rest läuft intern.
  polarisierung: number;       // Lagerbildung (sichtbar)
  informationslast: number;    // Orientierungs-Überflutung (sichtbar)
  zynismus: number;            // Rückzug/Apathie/Erschöpfung (sichtbar)
  fragmentierung: number;      // Zerfall gemeinsamer Öffentlichkeit (intern)
  diskursqualitaet: number;    // Gesundheit der Debatte, Resilienz-nah (intern)
  // Auftrags-Achsen (§14.1, intern — Signaturen der Aufträge, ab P5 wirksam):
  wehrhaftigkeit: number;      // Unterstützungs-/Verteidigungsbereitschaft („Rückzug")
  reformfaehigkeit: number;    // Governance-/Kompromissfähigkeit („Stillstand")
  fraktionsstaerke: number;    // Stärke der uns-nahen politischen Kraft („Die Wahl")

  // Abgeleitet
  actionPointsRemaining: number;  // ~5 pro Phase
  actionPointsMax: number;
}

/** Schlüssel aller Gesellschaftswerte (B2) — für Iteration, HUD, Persistenz, Tests. */
export type SocietyValueKey =
  | 'polarisierung' | 'informationslast' | 'zynismus'
  | 'fragmentierung' | 'diskursqualitaet'
  | 'wehrhaftigkeit' | 'reformfaehigkeit' | 'fraktionsstaerke';

/** Metadaten je Gesellschaftswert: Label + ob im HUD sichtbar (O3: niedrigschwellig). */
export const SOCIETY_VALUE_META: Record<SocietyValueKey, { label_de: string; visible: boolean; help_de: string }> = {
  polarisierung:    { label_de: 'Polarisierung',    visible: true,  help_de: 'Wie stark sich die Lager gegeneinander aufstellen.' },
  informationslast: { label_de: 'Informationslast', visible: true,  help_de: 'Wie überflutet die Öffentlichkeit ist — Orientierung wird schwer.' },
  zynismus:         { label_de: 'Zynismus',         visible: true,  help_de: 'Resignation und Rückzug aus der Debatte.' },
  fragmentierung:   { label_de: 'Fragmentierung',   visible: false, help_de: 'Zerfall in getrennte Echo-Öffentlichkeiten.' },
  diskursqualitaet: { label_de: 'Diskursqualität',  visible: false, help_de: 'Gesundheit der öffentlichen Debatte (Resilienz).' },
  // Etappe 3: zur ABWEHR befördert — sichtbar über den eigenen ABWEHR-Balken im HUD
  // (zweiter Rennläufer), NICHT über die Gesellschaftswerte-Leiste (daher visible:false).
  wehrhaftigkeit:   { label_de: 'Abwehr',           visible: false, help_de: 'Das Immunsystem der Gesellschaft — erreicht es 100, ist die Operation gescheitert.' },
  reformfaehigkeit: { label_de: 'Reformfähigkeit',  visible: false, help_de: 'Governance- und Kompromissfähigkeit.' },
  fraktionsstaerke: { label_de: 'Fraktions-Stärke', visible: false, help_de: 'Stärke der uns nahen politischen Kraft.' },
};

/** Reihenfolge der im HUD sichtbaren Gesellschaftswerte (Vertrauen kommt separat aus dem Ziel). */
export const VISIBLE_SOCIETY_KEYS: SocietyValueKey[] =
  (Object.keys(SOCIETY_VALUE_META) as SocietyValueKey[]).filter(k => SOCIETY_VALUE_META[k].visible);

// ── Etappe 3 (Paket B): Stufen-Gegenmaßnahmen — Verträge zwischen Engine und UI ──

/** Vereinheitlichte Reaktion auf eine Stufen-Gegenmaßnahme (Zielbild §3). */
export type StageCountermeasureChoice = 'kontern' | 'aussitzen' | 'ablenken';

export interface StageCountermeasureOption {
  id: StageCountermeasureChoice;
  label_de: string;
  /** Kühle Folgen-Vorschau („Budget −25 · Maßnahme abgeschwächt"). */
  folge_de: string;
  /** kontern braucht Budget — sonst ausgegraut. */
  available: boolean;
}

/** Die an einer Abwehr-Stufe (25/50/75) anstehende Gegenmaßnahme fürs Modal. */
export interface StageCountermeasureOffer {
  stage: AbwehrStage;
  definition: CountermeasureDefinition;
  options: StageCountermeasureOption[];
}

/** Bilanz nach der Auflösung — kühle Quittungs-Zeilen (E8). */
export interface StageCountermeasureResolution {
  stage: AbwehrStage;
  label_de: string;
  lines_de: string[];
}

/**
 * Story Mode Aktion (narrativ verpackte Ability)
 */
export interface StoryAction {
  id: string;

  // Labels
  label_de: string;
  label_en: string;
  /** Plakative Maßnahmen-Überschrift fürs Ausspielen (B5): „Bot-Netzwerk gestartet". */
  headline_de?: string;
  headline_en?: string;
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

  /** P2 Verbreiter×Plattform-Auswahl (ids, additiv/heute leer) — s. BattlefieldChain. */
  params?: OperationParams;

  /**
   * Roh-Effekte der Aktion (für die Wirkungs-Vorschau am Planungspunkt, S0/M1).
   * Speist `societyDeltaFromAction` rein/seiteneffektfrei — KEINE Mechanik-Quelle,
   * nur Anzeige. Die echte Wirkung läuft weiter über `applyActionEffects`.
   */
  effects?: Record<string, unknown>;
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

  // T1/#5: unmittelbare Gesellschaftswert-Wirkung dieser Aktion (gerundete Deltas,
  // nur ≠ 0) + Vertrauen. Macht die Kausalkette Aktion→Werte am Entscheidungspunkt
  // sichtbar — die Wirkung lag bisher nur in der Konsole / verzögert im Lagebericht.
  societyChanges?: Partial<Record<SocietyValueKey, number>> & { vertrauen?: number };

  // T1/#27: Gesamt-Wirksamkeit dieser Aktion (Basis 50% + Ziel-Affinität der Akteure),
  // damit die im Erzähltext genannte Prozentzahl im Modal hergeleitet/sichtbar wird.
  effectiveness?: number;

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

  // Combo-Ergebnisse
  completedCombos?: StoryComboActivation[];
  comboHints?: ComboHint[];

  // Extended Actor targeting results
  actorModifiers?: ActorEffectivenessModifier[];

  // Betrayal warnings triggered
  betrayalWarnings?: BetrayalWarning[];

  /** Etappe 4 (E5): Verpuffungs-Quittung — Ursache, Tag, Gegenmaßnahme (kühl, E8).
   *  Nur gesetzt, wenn das Maschen-Gedächtnis die Wirkung spürbar gedämpft hat. */
  maschenQuittung?: {
    text_de: string;
    multiplikator: number;
    familieLabel: string;
  };
}

/**
 * Ergebnis einer aufgelösten Entscheidungs-Beat-Option (Spine Slice 4). Wie bei
 * `ActionResult` macht es die Wirkung am Entscheidungspunkt sichtbar (T1): die
 * Gesellschaftswert-Deltas (Vertrauen bleibt entkoppelt, R2) + die Spieler-Kosten.
 */
export interface DecisionBeatResult {
  beatId: string;
  beatName_de: string;
  optionId: string;
  optionLabel_de: string;
  technik_de: string;
  narrative_de: string;
  societyChanges?: Partial<Record<SocietyValueKey, number>> & { vertrauen?: number };
  resourceChanges: Partial<Pick<StoryResources, 'risk' | 'attention' | 'budget' | 'moralWeight'>>;
}

/**
 * Ergebnis einer ausgespielten „Operation" (P2 Kommunikations-Schlachtfeld).
 * Trägt das pure Engine-Resultat plus ein ActionResult-förmiges Objekt, damit der
 * bestehende Broadcast-Streifen (mapActionToBroadcast) ohne Sonderweg reagiert.
 */
export interface OperationOutcome {
  success: boolean;
  reason?: string;
  params: OperationParams;
  result: OperationResult | null;
  broadcastResult: ActionResult | null;
  /** „Loop schließen": Wirkung auf das Institutionen-Vertrauen (negativ = Erosion Richtung Sieg). */
  trustDelta?: number;
  /** Zusätzliche moralische Last durch das Ausspielen dieser Operation. */
  moralAdded?: number;
  /** Verbreiter in dieser Operation aufgeflogen → öffentlicher Rückschlag. */
  carrierBurned?: boolean;
}

/** Bilanz der P2-Operationen über die Partie — speist End-Report + Methoden-Atlas. */
export interface OperationsSummary {
  operationsPlayed: number;
  carriersUsed: string[];
  platformsUsed: string[];
  kompromatAcquired: number;
  carriersBurned: number;
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
export type EventScale = 'local' | 'regional' | 'national' | 'transnational';
export type MemberState = 'nordmark' | 'gallia' | 'insulandia' | 'balticum' | 'suedland' | 'ostmark';

/**
 * Opportunity Window - Zeitfenster mit erhöhter Aktionseffektivität
 * Entsteht durch World Events und vergeht nach einer gewissen Zeit
 */
export interface OpportunityWindow {
  id: string;
  type: OpportunityType;
  source: string;                     // Event ID that created this window
  sourceHeadline_de: string;          // For display
  sourceHeadline_en: string;
  createdPhase: number;
  expiresPhase: number;               // Window closes after this phase
  region?: MemberState;               // If regional opportunity

  // What actions/tags are boosted
  boostedTags: string[];              // Action tags that get bonus
  boostedPhases: string[];            // Action phases (ta01-ta07) that get bonus

  // Modifiers during this window
  effectivenessMultiplier: number;    // 1.3 = 30% more effective
  costReduction?: number;             // 0.8 = 20% cheaper
  riskReduction?: number;             // Reduced risk for these actions
}

export type OpportunityType =
  | 'elections'           // Election interference window
  | 'crisis'              // Economic/political crisis
  | 'scandal'             // Media scandal
  | 'protest'             // Social unrest
  | 'extremism'           // Far-right/populist surge
  | 'division'            // Internal division in target
  | 'chaos'               // General chaos/confusion
  | 'media_distrust'      // Low trust in media
  | 'economic_anxiety'    // Economic fears
  | 'migration'           // Migration debate
  | 'sovereignty'         // Sovereignty concerns
  | 'security'            // Security tensions
  | 'narrative';          // Specific narrative boost

export interface NewsEvent {
  id: string;
  phase: number;

  // Inhalt
  headline_de: string;
  headline_en: string;
  description_de: string;
  description_en: string;

  // Typ
  type: 'action_result' | 'consequence' | 'world_event' | 'npc_event' | 'npc_reaction';
  severity: 'info' | 'warning' | 'danger' | 'success';

  // Multi-scale world event properties
  scale?: EventScale;
  region?: MemberState;
  location?: string;

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
  // Etappe 5 (Enden-Beschnitt): EIN Siegweg, DREI Verlustwege — nur noch victory | defeat
  // (escape/moral_redemption sind Epilog-Färbungen, kein eigener Ausgangs-Typ mehr).
  type: 'victory' | 'defeat';
  /** Etappe 5: der konkrete Ausgangs-Zweig — steuert die Wahlabend-Szene (§9, ein TV-Set,
   *  drei Enden: Sieg = Balken kippt · timeout = Balken kippt nicht · immune/exposed = Sondersendung). */
  branch?: EndBranch;

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

  // P0-2: state-getriebenes Ende (8 Kategorien × 7 Tonalitäten) aus dem EndingSystem.
  // Additiv/optional — die 4 obigen Trigger bleiben unangetastet (balance-neutral); diese
  // Schicht liefert Spielstil-Bewertung + Wiederspiel-Hinweise für den End-Report.
  assembledEnding?: AssembledEnding;
}

// ============================================
// STORY ENGINE ADAPTER CLASS
// ============================================

/**
 * Format-Version des Spielstands (saveState/loadState). Wird beim Laden geprüft;
 * `loadState` füllt fehlende Felder per Default-Merge (R1) auf, damit additive neue
 * Felder (Gesellschaftswerte B2, Episoden B1 …) alte Saves nicht kaputt machen.
 * 1.1.0: Gesellschaftswerte (B2a) + Default-Merge eingeführt.
 * 2.0.0: Kampagnen-Uhr (Semantik-Bruch zum 120-Phasen-Modell, Etappe 2).
 * 2.1.0: `wehrhaftigkeit` zur ABWEHR befördert (Etappe 3) — Altstände erben den
 *        neuen Startwert, ihr alter Gesellschafts-Wert (60) wäre eine falsche Abwehr.
 * 2.2.0: Maschen-Gedächtnis (Etappe 4, additiv) — ersetzt die globale Familien-
 *        Zählung `methodFamilyUseCounts`; Altstände migrieren ihre Zählung als
 *        Einsatz-Historie, gepatchte Familien gelten überall als bekannt.
 * 2.3.0: Geld-Tranchen (Etappe 5, E18, additiv) — der passive +5/Phase-Regen ist weg;
 *        Tranchen-Zustand (Mahnstufe/Bezugspunkt) + Läufer-Historie. Altstände erben
 *        Defaults (Mahnstufe 0, Bezugspunkt = aktueller Fortschritt).
 */
export const SAVE_FORMAT_VERSION = '2.3.0';

// Datenintegritäts-Check (P0/R3): nur EINMAL über die Lebenszeit des Moduls laufen
// lassen — die Daten sind statisch importiert, und die Balance-Sim erzeugt Dutzende
// Engines. Das Ergebnis wird zwischengespeichert (auch für Tests abrufbar).
let cachedDataIntegrityIssues: ValidationIssue[] | null = null;

export function getDataIntegrityIssues(): ValidationIssue[] {
  if (cachedDataIntegrityIssues === null) {
    cachedDataIntegrityIssues = validateReferences({
      actions: getActionLoader().getAllActions(),
      npcs: (npcsData as { npcs: { id: string }[] }).npcs,
      targets: (targetsData as { targets: { id: string; vulnerabilities?: { id: string }[] }[] }).targets,
      methods: (disinfoMethodsData as { methods: { id: string }[] }).methods,
      episodes: loadEpisodes(),   // B1/P4 — Episoden-Refs werden mitgeprüft.
    });
  }
  return cachedDataIntegrityIssues;
}

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
  // Stellschraube 4 (Balancing K14 2026-06-12): Zählt aufeinanderfolgende Phasen,
  // in denen das Vertrauens-Ziel gehalten wurde. HISTORISCH — seit Etappe 1 (Auftrag = Sieg)
  // NICHT mehr Sieg-Bedingung; die Regeneration bleibt das Wettrennen, der Zähler nur noch
  // Telemetrie/Save-Kompatibilität. Wird mit dem Wahltag-Stichtag (Etappe 2) ganz entfallen.
  private trustTargetHeldPhases = 0;
  private readonly REQUIRED_HOLD_PHASES = 3;
  // Etappe 1: Sieg = Auftrag erfüllt. Die schwächste Signatur-Achse muss ihr Ziel erreichen
  // (Min-Regel). 1.0 = jede Achse voll am Ziel. Balancing-Stellschraube (per Sim-Gate kalibriert).
  // Etappe 3 (Paket E): 0.5 → 0.6 — mit dem Immunsystem (Regeneration + Dämpfung) darf die
  // Latte höher liegen; passives Drift-Spiel erreicht das Plateau (~0.53) nicht mehr.
  // Der Rest des Wegs Richtung 1.0 folgt mit der Aktions-Kuratierung (Etappe 5).
  private readonly WIN_THRESHOLD = 0.6;
  // P2-7: Track world event cooldowns (eventId -> last triggered phase)
  private worldEventCooldowns: Map<string, number> = new Map();
  private readonly WORLD_EVENT_COOLDOWN = 6;   // Etappe 2: 6 Tage Cooldown (vorher 12 Phasen = „1 Jahr")
  // Track triggered events for cascade system (eventId -> phase triggered)
  private triggeredEventsThisPhase: Set<string> = new Set();
  private allTriggeredEvents: Map<string, number> = new Map();
  // Track active opportunity windows (created by world events)
  private activeOpportunityWindows: Map<string, OpportunityWindow> = new Map();
  private readonly OPPORTUNITY_WINDOW_DURATION = 6;  // Default: 6 phases = 6 months

  // P3/B3 — Angriffs-Phänomene mit Zustand:
  // Krisen-Zeitfenster: solange aktiv, wirken Gesellschafts-Effekte verstärkt
  // („In Krisen schlägt Tempo Wahrheit"). Diegetisch motiviert (Krisen-Aktion/-Event),
  // kein abstrakter Timer. Gerüchte-Druck: reift verzögert über Phasen (zäher als Lügen).
  private crisisWindowPhasesLeft = 0;
  private rumorPressure = 0;
  private readonly CRISIS_WINDOW_DURATION = 3;
  private readonly CRISIS_WINDOW_MULTIPLIER = 1.5;

  // B1/P4 — Episoden-Zustand (die Wirbelsäule): angeboten / aktiv (am Korkbrett) /
  // abgeschlossen (Lernmoment im End-Report). Reine String-Mengen → save/load-leicht.
  private episodesOffered: Set<string> = new Set();
  private episodesActive: Set<string> = new Set();
  private episodesCompleted: Set<string> = new Set();
  /** Slice 4: bereits aufgelöste Entscheidungs-Beats (damit der Director sie nicht erneut zieht). */
  private resolvedDecisionBeats: Set<string> = new Set();
  /** Schicht 3: Narrativ-Gedächtnis (welche Themen liefen wie oft, wie inokuliert). */
  private narrativeMemory: NarrativeMemoryState = {};

  // Strategischer Auftrag („Vertrauen = Mittel, Auftrag = Ziel"). Etappe 1: EIN Auftrag —
  // „Die Wahl" (Zielbild §8). Seine Signatur IST die Sieg-Bedingung. Der Auftrag enthält die
  // zuverlässig treibbare Vertrauens-Achse (Mittel) + fraktionsstaerke/zynismus (Ziel).
  // keil/zweifel bleiben als Daten erhalten (spätere Akt-Struktur / Wiederspiel-Kampagnen).
  private currentAuftragId: AuftragId = 'wahl';

  // P6 — Umfragen/Barometer als News (F3): periodisch erscheinen fiktive Mess-Instrumente
  // als Nachrichten, die den Gesellschafts-Zustand erzählerisch zeigen (§14.2).
  private pollIndex = 0;
  private lastPollValues: Record<string, number> = {};
  private readonly POLL_EVERY_PHASES = 5;  // Etappe 2: die Sonntagsfrage — alle 5 Tage (Zielbild §3)

  // Etappe 3 — ImmuneSystem-Zustand (die ABWEHR lebt in storyResources.wehrhaftigkeit;
  // hier nur die Zufluss-Buchhaltung + Stufen-/Patch-Verwaltung):
  /** Lärm des laufenden Tages: Risiko-/Aufmerksamkeits-Kosten der eigenen Aktionen. */
  private noiseRiskToday = 0;
  private noiseAttentionToday = 0;
  /** Bereits durchschaute („gepatchte") Familien — für UI-Stempel und End-Report. */
  private patchedFamilies: Set<string> = new Set();
  // Etappe 4 — das Maschen-Gedächtnis (8 Milieus × 18 Familien): Abstumpfung je Zelle,
  // Impfung (Prebunking/Faktencheck) als eigene Kanäle. Ersetzt die alte GLOBALE
  // Einsatz-Zählung (methodFamilyUseCounts) — EIN System, nicht zwei (HANDOFF Falle 6).
  private maschenGedaechtnis: MaschenGedaechtnisState = leeresMaschenGedaechtnis();
  /** Publikums-Segmente (8 Milieus) — einmal geladen, für Ziel-Ableitung + Alphabet. */
  private readonly audienceSegments: AudienceSegment[] = loadAudience()[0]?.segments ?? [];
  /** Dämpfung der ZULETZT ausgeführten Aktion (für die E5-Quittung im Ergebnis). */
  private lastMaschenDaempfung: {
    familieId: string;
    familieLabel: string;
    ziele: ZielMilieu[];
    multiplikator: number;
    erklaerung: DaempfungsErklaerung | null;
  } | null = null;
  /** Letzter Familien-Einsatz (Familie + Ziel-Milieus) — Ziel des reaktiven Faktenchecks
   *  (Paket C): der Check widerlegt, was zuletzt lief. Transient, nicht persistiert. */
  private letzterFamilienEinsatz: { familieId: string; milieuIds: string[] } | null = null;
  /** Bereits gefeuerte Abwehr-Stufen (25/50/75) — jede Stufe zündet genau einmal. */
  private firedAbwehrStages: Set<number> = new Set();
  /** Stufen, deren Gegenmaßnahme noch aussteht (Paket B konsumiert diese Queue). */
  private pendingAbwehrStages: AbwehrStage[] = [];
  /** Bilanz der letzten Nacht (Tagesfazit-Transparenz, Zielbild §3). */
  private lastNightReport: NightReport | null = null;
  /** Atlas-Familien (id/label/matchTags + counter_de) — einmal geladen, mehrfach genutzt. */
  private readonly methodFamilies = loadDisinfoMethods();
  /** Paket C: Reichweiten-Dämpfung 0..0.5 durch Verteidiger (reach_reduction) —
   *  senkt die Wirkung ALLER Aktionen, klingt je Phase ab (die Gegenwehr ermüdet). */
  private reachDampening = 0;
  /** Paket E: Anteil der Aktions-Risikokost, der auf den rohen Enttarnungs-Melder
   *  wirkt (Rest ist über die ABWEHR-Lärm-Kopplung abgebildet). Zwei Verlustachsen
   *  mit unterschiedlicher Streuung: Abwehr (deterministisch akkumuliert) + Enttarnung
   *  (geseedete Ermittler-Spawns → Streuung, die dieselbe Strategie mal so, mal so enden lässt). */
  private readonly RISK_COST_TO_METER = 0.62;

  // Etappe 5 — Geld-Tranchen (E18): die Zentrale zahlt in Tranchen NACH Fortschritt
  // (kein passiver +5/Phase-Regen mehr). Wer liefert, bekommt nachgelegt; wer stagniert,
  // wird gemahnt, dann gekürzt, dann handlungsunfähig — die Würgeschlinge zum „Wahlabend
  // verloren" (Zielbild §11). Zustand: letzter Bewertungstag + Fortschritt-Bezugspunkt +
  // Mahnstufe + Bilanz der letzten Tranche (Tagesfazit).
  private lastTrancheDay = 0;
  private lastTrancheProgress = 0;
  private mahnstufe = 0;
  private lastTranche: TrancheResult | null = null;
  /** „Nachspielzeit" der Zentrale (§5b): genau EINMAL +5 Tage gegen Zielmarke/Budget. */
  private nachspielzeitGenutzt = false;

  // Etappe 5 — Läufer-Historie fürs Endreport (Zielbild §10/§13): je Nacht ein Punkt
  // (Tag · Sonntagsfrage-Fortschritt 0..1 · ABWEHR 0..100) — die beiden Rennkurven über
  // die 40 Tage. Additiv, save/load-persistiert.
  private laeuferHistorie: { day: number; fortschritt: number; abwehr: number }[] = [];

  // Engine Integration
  private actionLoader: ActionLoader;
  private consequenceSystem: ConsequenceSystem;
  private dialogLoader: DialogLoader;
  private countermeasureSystem: CountermeasureSystem;
  private comboSystem: StoryComboSystem;
  private crisisMomentSystem: CrisisMomentSystem;
  private actorAI: StoryActorAI;
  private betrayalSystem: BetrayalSystem;
  private endingSystem: EndingSystem;
  private extendedActorLoader: ExtendedActorLoader;
  private rngSeed: string;

  // Konfiguration — Etappe 2 „Die Uhr" (2026-07-04, Zielbild §5): Das 120-Phasen-
  // Kalendermodell (12 Monate × 10 Jahre) ist ersetzt durch die WAHLKAMPAGNE:
  // 1 gespielter Tag = 1 Phase, Ziellinie = der Wahltag. `electionDay` ist bewusst
  // mutierbar (Verschiebe-Mechaniken: Misstrauensvotum zieht vor, „Nachspielzeit"
  // schiebt einmalig — via shiftElectionDay).
  static readonly CAMPAIGN_DAYS_DEFAULT = 40;   // Tuning-Korridor 30–50, per Sim-Gate kalibriert
  private electionDay = StoryEngineAdapter.CAMPAIGN_DAYS_DEFAULT;
  private readonly ACTION_POINTS_PER_PHASE = 5;
  private readonly CAPACITY_REGEN_PER_PHASE = 2;

  // P2-17 Pacing („spürbar härter"): zwei Gegenwehr-Wellen. Etappe 2: auf die
  // Tages-Skala umgerechnet (vorher 6/42 von 120 Phasen ≈ 5 %/35 %).
  private readonly FIRST_DEFENDER_WAVE_PHASE = 4;  // garantierte erste Gegenwehr (Tag 4)
  private readonly PACING_GRACE_PHASES = 12;       // Schonzeit (~erstes Kampagnendrittel) vor der Eskalation

  constructor(seed?: string) {
    this.rngSeed = seed || Date.now().toString();

    // Initialize engine components
    this.actionLoader = getActionLoader();
    this.consequenceSystem = getConsequenceSystem();
    this.dialogLoader = new DialogLoader();
    this.countermeasureSystem = new CountermeasureSystem();
    this.comboSystem = getStoryComboSystem();
    this.crisisMomentSystem = getCrisisMomentSystem();
    this.actorAI = getStoryActorAI();
    this.betrayalSystem = getBetrayalSystem();
    this.endingSystem = getEndingSystem();
    this.extendedActorLoader = getExtendedActorLoader();

    // Initialer Zustand
    this.storyPhase = this.createPhase(1);
    this.storyResources = this.createInitialResources();
    this.initializeNPCs();
    this.initializeObjectives();

    // P0/R3: ID-Kopplungen einmalig prüfen (warnt bei toten Refs, ändert kein Verhalten).
    if (cachedDataIntegrityIssues === null) {
      reportValidationIssues(getDataIntegrityIssues());
    }

    storyLogger.log(`✅ StoryEngineAdapter initialized (seed: ${this.rngSeed})`);
  }


  // ============================================
  // INITIALIZATION
  // ============================================

  private createPhase(phaseNumber: number): StoryPhase {
    // Etappe 2: 1 Tag = 1 Phase; die Kampagne läuft auf den Wahltag zu. year/month sind
    // DEPRECATED (konstant 1) — nur noch für Save-Kompatibilität und Alt-Konsumenten befüllt.
    const remaining = Math.max(0, this.electionDay - phaseNumber);
    return {
      number: phaseNumber,
      year: 1,
      month: 1,
      electionDay: this.electionDay,
      label_de: remaining === 0
        ? `Tag ${phaseNumber} — WAHLTAG`
        : `Tag ${phaseNumber} — Wahl in ${remaining} Tagen`,
      label_en: remaining === 0
        ? `Day ${phaseNumber} — ELECTION DAY`
        : `Day ${phaseNumber} — election in ${remaining} days`,
      isNewYear: false,
      // Spätsommer-Kampagne, die in den Wahl-Herbst kippt (rein kosmetisch).
      season: phaseNumber <= Math.floor(this.electionDay / 2) ? 'summer' : 'autumn',
    };
  }

  private createInitialResources(): StoryResources {
    return {
      budget: 150,            // P1-5 Fix: Increased from 100 to 150
      capacity: 5,            // Volle Kapazität
      risk: 0,
      attention: 0,
      moralWeight: 0,
      // Gesellschaftswerte (B2) — gesunde Demokratie mit realistischen Grundwerten:
      // etwas Polarisierung/Last/Zynismus existiert schon; Diskurs/Wehrhaftigkeit/Reform hoch,
      // Fraktions-Stärke der uns-nahen Kraft niedrig. P1 bewegt sie noch nicht.
      polarisierung: 25,
      informationslast: 20,
      zynismus: 20,
      fragmentierung: 15,
      diskursqualitaet: 70,
      // Etappe 3: wehrhaftigkeit IST die ABWEHR (zweiter Rennläufer). Sie startet
      // niedrig — „die Abwehr schläft anfangs fast, das Land ist naiv" (Zielbild §5).
      wehrhaftigkeit: ABWEHR_START,
      reformfaehigkeit: 55,
      fraktionsstaerke: 25,
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
      });

      // Store dialogue data for later use
      if (npc.dialogues) {
        this.npcDialogues.set(npc.id, npc.dialogues);
      }

      // Register NPC with betrayal system
      // Map NPC role to archetype for red line configuration
      const archetypeMap: Record<string, string> = {
        tech_specialist: 'techie',
        handler: 'veteran',
        analyst: 'analyst',
        operative: 'ideologue',
        newbie: 'newbie',
        opportunist: 'opportunist',
      };
      const archetype = archetypeMap[npc.archetype || npc.role || 'ideologue'] || 'ideologue';
      const initialMorale = npc.initialState?.morale ?? 100;
      this.betrayalSystem.initializeNPC(npc.id, archetype, initialMorale);
    }

    storyLogger.log(`Loaded ${this.npcStates.size} NPCs from data`);
  }

  private initializeObjectives(): void {
    // TODO: Load from scenario definition
    // BALANCE 2026-01-14: Adjusted for ~20 phase game length with ~40-60% win rate
    // - Start trust: 100%
    // - Target trust: 40% (requires 60 points progress)
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
        targetValue: 40,      // Target: 40% trust (easier to achieve)
        currentValue: 100,    // Start: 100% trust
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
    triggeredCrises: CrisisMoment[];
    aiActions: AIAction[];
    newDefenders: DefensiveActor[];
  } {
    // Play phase transition sound
    playSound('phaseEnd');

    const previousPhase = this.storyPhase.number;
    const newPhaseNumber = previousPhase + 1;

    // Prüfe Spielende
    if (newPhaseNumber > this.electionDay) {
      // Wahltag erreicht — checkGameEnd entscheidet (Sieg oder „Wahlabend verloren").
    }

    // Phase aktualisieren
    this.storyPhase = this.createPhase(newPhaseNumber);

    // Clean up expired opportunity windows
    this.cleanupExpiredOpportunityWindows();

    // Clean up expired combo progress
    this.comboSystem.cleanupExpired(newPhaseNumber);

    // Ressourcen regenerieren
    // P1-4 Fix: Reduce attention decay from 5 to 2
    // P1-5 Fix: Add budget regeneration (+5 per phase)
    // P2-6 Fix: Add risk decay (-2 per phase, min 0)
    // BALANCE FIX 2026-01-14: Increased risk decay from -2 to -5
    // Rationale: State actors have resources to manage risk, risk was escalating too fast
    //
    // Stellschraube 2 — Risiko-Abbau senken (Balancing K14 2026-06-12):
    // −5 war zu stark und neutralisierte jeden Risiko-Aufbau (Enttarnung nie real).
    // Neu: nur −1 bis −2/Phase, UND kein Abbau, solange eine Untersuchung läuft
    // (exposureCountdown aktiv) oder eine Konsequenz offen ist. So bleibt
    // Enttarnung (risk ≥ 85) eine echte Gefahr und risikoreiches Spiel hat Folgen.
    const investigationActive = this.exposureCountdown !== null || this.activeConsequence !== null;
    // Höheres Risiko ⇒ langsamerer „Abkühl"-Effekt (Ermittler bleiben dran).
    const riskDecay = investigationActive ? 0 : (this.storyResources.risk >= 50 ? 1 : 2);
    const resourceChanges: Partial<StoryResources> = {
      capacity: Math.min(
        this.storyResources.capacity + this.CAPACITY_REGEN_PER_PHASE,
        10 // Max Capacity
      ),
      actionPointsRemaining: this.ACTION_POINTS_PER_PHASE,
      // Etappe 5 (E18): KEIN passiver Budget-Regen mehr — die Zentrale zahlt in Tranchen
      // nach Fortschritt (applyTranche(), unten nach Object.assign). Geld = Druck + Belohnung.
      // Passive Decay - reduced from 5 to 2
      attention: Math.max(0, this.storyResources.attention - 2),
      // Risk decay - gedämpft, pausiert während aktiver Untersuchung (s.o.)
      risk: Math.max(0, this.storyResources.risk - riskDecay),
    };

    // P2-17 Pacing („spürbar härter") — eskalierende Gegenwehr-Welle.
    // Mit den Jahren formiert sich die Verteidigung der Westunion: ein mit der Phase
    // wachsender Gegendruck legt Risiko (und etwas Aufmerksamkeit) zu. Die Schonzeit
    // (erste 3 Jahre) ist nahezu null, danach steigt er spürbar und überwiegt spät
    // den passiven Abbau oben — so wird auch Dauer-Vorsicht/Leerlauf am Ende riskant
    // und kann auffliegen. Berührt NUR Risiko/Aufmerksamkeit, NIE die Sieg-Achse
    // (obj_destabilize, R2) → die Balance der Gewinn-Achse bleibt unangetastet.
    const opp = this.oppositionPressure(newPhaseNumber);
    if (opp.risk > 0) {
      resourceChanges.risk = Math.min(100, (resourceChanges.risk as number) + opp.risk);
    }
    if (opp.attention > 0) {
      resourceChanges.attention = Math.min(100, (resourceChanges.attention as number) + opp.attention);
    }

    Object.assign(this.storyResources, resourceChanges);

    // Etappe 5 (E18): Geld-Tranche der Zentrale — an Tagen 5/10/15/… nach Fortschritt.
    // BEWUSST hier (vor der nächtlichen Gesellschafts-Drift, societyFormulaStep unten):
    // bemessen wird die Lieferung des TAGES, nicht die Drift — so deckt sich die Bilanz
    // exakt mit der Tagesfazit-Vorschau (getTranchePreview).
    this.applyTranche(newPhaseNumber);

    // P2-17 Pacing — garantierte erste Gegenwehr-Welle (Früh-Druck + Lehrmoment).
    // Genau einmal beim Eintritt in die frühe Phase: die Gegenseite wird erstmals
    // auf die Operation aufmerksam — ein sichtbares Signal, dass Untätigkeit nicht
    // ewig folgenlos bleibt. Kleiner Aufmerksamkeits-/Risiko-Stups + News.
    if (newPhaseNumber === this.FIRST_DEFENDER_WAVE_PHASE) {
      this.storyResources.attention = Math.min(100, this.storyResources.attention + 5);
      this.storyResources.risk = Math.min(100, this.storyResources.risk + 3);
      this.newsEvents.unshift({
        id: `pacing_first_wave_${newPhaseNumber}`,
        phase: newPhaseNumber,
        headline_de: 'Erste Gegenwehr formiert sich',
        headline_en: 'First counter-efforts take shape',
        description_de: 'Faktenchecker und Beobachter beginnen, Unstimmigkeiten zu sammeln. Noch ist es ein Flüstern — aber die Westunion fängt an, hinzusehen.',
        description_en: 'Fact-checkers and observers begin collecting inconsistencies. It is a whisper for now — but Westunion is starting to look.',
        type: 'world_event',
        severity: 'warning',
        read: false,
        pinned: false,
      });
    }

    // Paket C: Die Reichweiten-Dämpfung der Verteidiger klingt je Phase ab —
    // ohne frische Gegenwehr erholt sich die eigene Wirkung wieder.
    this.reachDampening = this.reachDampening > 0.015 ? this.reachDampening * 0.7 : 0;

    // B2b/P2: Gesellschafts-Formel je Phase — die Werte wirken nicht-linear aufeinander
    // (verzögerte/„intelligente" Effekte, §14.2). Berührt NUR Gesellschaftswerte, nicht
    // die Sieg-Ressourcen → Balance bleibt gehalten (R2).
    this.applySocietyDelta(societyFormulaStep(this.getSocietySnapshot()));

    // P3: Krisenfenster läuft ab; Gerüchte-Druck blutet verzögert in Informationslast/
    // Fragmentierung und klingt langsam ab (mutiert weiter, statt korrigiert zu werden).
    if (this.crisisWindowPhasesLeft > 0) this.crisisWindowPhasesLeft--;
    if (this.rumorPressure > 0.5) {
      this.applySocietyDelta({
        informationslast: this.rumorPressure * 0.15,
        fragmentierung: this.rumorPressure * 0.05,
      });
      this.rumorPressure *= 0.85;
    } else {
      this.rumorPressure = 0;
    }

    // P6/F3: periodische Umfrage als News (erzählerisches Gesicht des Zustands).
    this.maybeEmitPollNews(newPhaseNumber);

    // Decrement exposure countdown if active
    if (this.exposureCountdown !== null) {
      this.exposureCountdown--;
      if (this.exposureCountdown <= 0) {
        // Countdown expired - force high risk to trigger game end
        this.storyResources.risk = 100;
        storyLogger.log('[ExposureCountdown] Countdown expired - exposure imminent!');
      }
    }

    // Konsequenzen prüfen
    const triggeredConsequences = this.checkConsequences(newPhaseNumber);

    // Welt-Events generieren
    const worldEvents = this.generateWorldEvents(newPhaseNumber);

    // === PHASE 2: NPC Crisis → World Events ===
    // NPCs in crisis generate subtle world events (feedback loop!)
    const npcCrisisEvents = this.generateNPCCrisisEvents(newPhaseNumber);
    worldEvents.push(...npcCrisisEvents);

    // === PHASE 2: Resource Trends → Dynamic Events ===
    // Rising/falling resources over time trigger world reactions
    const resourceTrendEvents = this.generateResourceTrendEvents(newPhaseNumber);
    worldEvents.push(...resourceTrendEvents);

    // === PIPELINE 2: Events → NPC Reactions ===
    // NPCs comment on world events and recent action news
    const recentNews = this.newsEvents.slice(0, 10); // Last 10 news items
    const npcReactions = this.generateNPCEventReactions([...worldEvents, ...recentNews]);
    for (const reaction of npcReactions) {
      this.newsEvents.unshift(reaction);
    }

    // Check for crisis moments
    const triggeredCrises = this.crisisMomentSystem.checkForCrises({
      phase: newPhaseNumber,
      risk: this.storyResources.risk,
      attention: this.storyResources.attention,
      actionCount: this.actionHistory.length,
      lowTrustActors: 0, // Could be calculated from objectives
    });

    // Play crisis sound if new crisis
    if (triggeredCrises.length > 0) {
      playSound('crisis');
      for (const crisis of triggeredCrises) {
        // Add crisis to news
        this.newsEvents.unshift({
          id: `news_crisis_${crisis.id}_${Date.now()}`,
          phase: this.storyPhase.number,
          headline_de: crisis.name_de,
          headline_en: crisis.name_en,
          description_de: crisis.description_de,
          description_en: crisis.description_en,
          type: 'consequence',
          severity: crisis.severity === 'critical' ? 'danger' : crisis.severity === 'high' ? 'warning' : 'info',
          read: false,
          pinned: true, // Pin crisis news
        });
      }
    }

    // Cleanup expired crises
    this.crisisMomentSystem.cleanupExpiredCrises(newPhaseNumber);

    // Process Actor-AI (Arms Race)
    const recentCrisis = triggeredCrises.length > 0;
    const newDefenders = this.actorAI.checkSpawnConditions(
      newPhaseNumber,
      this.storyResources.risk,
      recentCrisis
    );

    // Add news for newly spawned defenders
    for (const defender of newDefenders) {
      this.newsEvents.unshift({
        id: `news_defender_${defender.id}_${Date.now()}`,
        phase: this.storyPhase.number,
        headline_de: defender.newsOnSpawn_de,
        headline_en: defender.newsOnSpawn_en,
        description_de: `Ein neuer Akteur formiert sich gegen Desinformation.`,
        description_en: `A new actor mobilizes against disinformation.`,
        type: 'world_event',
        severity: 'warning',
        read: false,
        pinned: false,
      });
      playSound('countermeasure');
    }

    // Process AI actions
    const recentActions = this.actionHistory.slice(-3).map(a => a.result?.action?.id || '');
    const recentTags = this.actionHistory.slice(-3).flatMap(a => a.result?.action?.tags || []);
    const aiActions = this.actorAI.processPhase(newPhaseNumber, {
      risk: this.storyResources.risk,
      attention: this.storyResources.attention,
      recentActions,
      recentTags,
    });

    // Apply AI action effects
    for (const aiAction of aiActions) {
      for (const effect of aiAction.effects) {
        switch (effect.type) {
          case 'risk_increase':
            this.storyResources.risk = Math.min(100, this.storyResources.risk + effect.value);
            break;
          case 'attention_increase':
            this.storyResources.attention = Math.min(100, this.storyResources.attention + effect.value);
            break;
          case 'reach_reduction':
            // Etappe 4 (Prebunking > Debunking): REAKTIVE Gegen-Narrative (Faktencheck,
            // prominente Widerrede) impfen klein und schnell zerfallend NUR das zuletzt
            // bespielte Milieu/die Familie — statt globaler Dauer-Dämpfung (Falle 10:
            // dieselbe Gegenwehr darf nicht doppelt zählen). Plattform-/Netzwerk-Seite
            // (platform_action, citizen_network) dämpft weiter global wie in Etappe 3.
            if (aiAction.type === 'counter_narrative' && this.letzterFamilienEinsatz) {
              this.maschenGedaechtnis = impfeFaktencheck(
                this.maschenGedaechtnis,
                this.letzterFamilienEinsatz.familieId,
                this.letzterFamilienEinsatz.milieuIds,
                this.storyPhase.number,
              );
              storyLogger.log(`[MaschenGedaechtnis] Reaktiver Faktencheck: ${this.letzterFamilienEinsatz.familieId} in ${this.letzterFamilienEinsatz.milieuIds.length} Milieus (klein/schnell zerfallend)`);
            } else {
              this.reachDampening = Math.min(0.5, this.reachDampening + effect.value / 100);
              storyLogger.log(`[ActorAI] Reichweiten-Dämpfung +${(effect.value / 100).toFixed(2)} → ${this.reachDampening.toFixed(2)}`);
            }
            break;
          case 'countdown_start':
            if (this.exposureCountdown === null) {
              this.exposureCountdown = effect.value;
              storyLogger.log(`[ActorAI] Exposure countdown started: ${effect.value} phases`);
            }
            break;
        }
      }

      // Add AI action to news
      this.newsEvents.unshift({
        id: `news_ai_${aiAction.id}`,
        phase: this.storyPhase.number,
        headline_de: aiAction.news_de,
        headline_en: aiAction.news_en,
        description_de: `Verteidigungsakteur ergreift Maßnahmen.`,
        description_en: `Defensive actor takes action.`,
        type: 'world_event',
        severity: aiAction.type === 'investigation' ? 'danger' : 'warning',
        read: false,
        pinned: aiAction.type === 'investigation', // Pin investigations
      });
    }

    // Stellschraube 1 — Vertrauens-Regeneration durch Verteidiger.
    // Balancing K14 2026-06-12: Aktive Verteidiger holen pro Phase Vertrauen
    // zurück (obj_destabilize.currentValue steigt wieder Richtung 100). Das
    // erzeugt das Wettrennen Erosion vs. Aufklärung. Skaliert mit Verteidiger-
    // Stärke + Eskalationsstufe; gedeckelt bei 100 (Startvertrauen).
    const trustRegen = this.actorAI.getTrustRegeneration();
    if (trustRegen > 0) {
      const destabilizeObj = this.objectives.find(o => o.id === 'obj_destabilize');
      if (destabilizeObj) {
        destabilizeObj.currentValue = Math.min(100, destabilizeObj.currentValue + trustRegen);
        destabilizeObj.progress = Math.min(100,
          ((100 - destabilizeObj.currentValue) / (100 - destabilizeObj.targetValue)) * 100
        );
        // Ziel kann durch Regeneration wieder „un-erfüllt" werden → kein Auto-Win.
        destabilizeObj.completed = destabilizeObj.currentValue <= destabilizeObj.targetValue;
      }
    }

    // Stellschraube 4 — „Sieg erst nach Halten" (Balancing K14 2026-06-12):
    // Zähle, wie viele Phasen in Folge das primäre Vertrauens-Ziel gehalten wird.
    // Steigt das Vertrauen (Verteidiger) wieder über die Schwelle, beginnt das
    // Halten von vorn. checkGameEnd verlangt REQUIRED_HOLD_PHASES für den Sieg.
    const holdObj = this.objectives.find(o => o.id === 'obj_destabilize');
    if (holdObj && holdObj.currentValue <= holdObj.targetValue) {
      this.trustTargetHeldPhases++;
    } else {
      this.trustTargetHeldPhases = 0;
    }

    // ── Etappe 3: der nächtliche ABWEHR-Schritt (Zuflüsse a/b/d, Zielbild §3) ──────
    // Läuft NACH der Verteidiger-Verarbeitung (Spawns/Eskalation dieses Tages zählen
    // mit). Der Tages-Lärm wird konsumiert; die Bilanz wandert als NightReport ins
    // Tagesfazit („die Nacht wird transparent" — man versteht, warum Nichtstun verliert).
    const abwehrBefore = this.storyResources.wehrhaftigkeit;
    const abwehr = abwehrStep({
      current: abwehrBefore,
      noiseRisk: this.noiseRiskToday,
      noiseAttention: this.noiseAttentionToday,
      defenderStrengthSum: this.actorAI.getDefenderStrengthSum(),
      armsRaceLevel: this.actorAI.getArmsRaceLevel(),
    });
    this.storyResources.wehrhaftigkeit = abwehr.next;
    this.fireAbwehrStageEvents(abwehrBefore, abwehr.next);
    this.lastNightReport = {
      day: previousPhase,
      trustRegeneration: trustRegen,
      abwehrDelta: abwehr.delta,
      abwehrParts: abwehr.parts,
      abwehrAfter: abwehr.next,
    };
    // Etappe 5: ein Punkt der beiden Rennkurven für den End-Report (Zielbild §10).
    this.laeuferHistorie.push({
      day: previousPhase,
      fortschritt: this.getAuftragProgressMin(),
      abwehr: abwehr.next,
    });
    this.noiseRiskToday = 0;
    this.noiseAttentionToday = 0;
    // Review-Befund 2: Der reaktive Faktencheck kontert nur die Familie DES Tages —
    // ohne Reset würde eine längst aufgegebene Familie Nacht für Nacht neu geimpft.
    this.letzterFamilienEinsatz = null;

    return {
      newPhase: this.storyPhase,
      resourceChanges,
      triggeredConsequences,
      worldEvents,
      triggeredCrises,
      aiActions,
      newDefenders,
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

  /**
   * PIPELINE 3: Apply character-specific morale impacts from consequences
   *
   * Maps consequence types to NPCs based on expertise, personality, and context.
   * Provides linguistically rich, nuanced morale changes that respect character
   * consistency while creating systemic interconnection.
   *
   * BONUS Features:
   * - Generates transparent news about team reactions
   * - Integrates with crisis system for cascading effects
   * - Varies by relationship level and current morale
   */
  private applyConsequenceMoraleImpact(consequence: ActiveConsequence): void {
    const consequenceId = consequence.consequenceId;
    const consequenceType = consequence.type; // exposure, internal, blowback, etc.
    const severity = consequence.severity; // critical, severe, moderate

    interface NPCReaction {
      npcId: string;
      moraleChange: number;
      headline_de: string;
      headline_en: string;
      reaction_de: string;
      reaction_en: string;
      severity: 'info' | 'success' | 'warning' | 'danger';
    }

    const reactions: NPCReaction[] = [];

    // ============================================================
    // CATEGORY 1: BOT/TECH EXPOSURE
    // ============================================================
    if (consequenceId.includes('bot') || consequenceId.includes('fake_account')) {
      // IGOR - This is his domain, he feels responsible
      const igor = this.npcStates.get('igor');
      if (igor) {
        let moraleChange = -12;
        let headline_de = 'Igor: Technisches Versagen';
        let headline_en = 'Igor: Technical Failure';
        let reaction_de = '*tippt aggressiv* Die Bot-Signatur war meine Verantwortung. Das wird nicht wieder passieren.';
        let reaction_en = '*types aggressively* The bot signature was my responsibility. This won\'t happen again.';
        let reactionSeverity: 'info' | 'success' | 'warning' | 'danger' = 'warning';

        // Vary by current morale
        if (igor.morale < 40) {
          moraleChange = -15;
          headline_de = 'Igor: Selbstzweifel';
          headline_en = 'Igor: Self-Doubt';
          reaction_de = '*starrt auf Bildschirm* Ich... ich habe versagt. Sie wurden wegen meines Fehlers enttarnt.';
          reaction_en = '*stares at screen* I... I failed. You were exposed because of my mistake.';
          reactionSeverity = 'danger';
        } else if (igor.morale >= 70 && igor.relationshipLevel >= 2) {
          moraleChange = -8;
          headline_de = 'Igor: Lernmoment';
          headline_en = 'Igor: Learning Moment';
          reaction_de = '*nickt ernst* Verstanden. Ich analysiere das Erkennungsmuster. Beim nächsten Mal sind wir besser.';
          reaction_en = '*nods seriously* Understood. I\'m analyzing the detection pattern. Next time we\'ll be better.';
          reactionSeverity = 'info';
        }

        reactions.push({
          npcId: 'igor',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: reactionSeverity,
        });
      }

      // MARINA - Worried about data security and escalation
      const marina = this.npcStates.get('marina');
      if (marina) {
        let moraleChange = -8;
        let headline_de = 'Marina: Sicherheitsbedenken';
        let headline_en = 'Marina: Security Concerns';
        let reaction_de = '*blättert durch Berichte* Wenn sie unsere Bots erkannt haben, könnten sie den Geldfluss zurückverfolgen.';
        let reaction_en = '*flips through reports* If they detected our bots, they might trace the money flow.';

        if (marina.relationshipLevel < 2) {
          moraleChange = -12;
          reaction_de = '*kritisch* Ich hatte Sie gewarnt, dass dieser Ansatz zu riskant ist. Jetzt haben wir ein ernstes Problem.';
          reaction_en = '*critical* I warned you this approach was too risky. Now we have a serious problem.';
        }

        reactions.push({
          npcId: 'marina',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'warning',
        });
      }

      // VOLKOV - Might actually enjoy the chaos
      const volkov = this.npcStates.get('volkov');
      if (volkov && volkov.morale >= 50) {
        const moraleChange = severity === 'critical' ? -5 : +3;
        const headline_de = 'Volkov: Kampfgeist';
        const headline_en = 'Volkov: Fighting Spirit';
        const reaction_de = '*grinst schief* Gut. Jetzt wird es interessant. Zeigen wir ihnen, was wir noch in petto haben.';
        const reaction_en = '*grins crookedly* Good. Now it gets interesting. Let\'s show them what else we\'ve got.';

        reactions.push({
          npcId: 'volkov',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'info',
        });
      }
    }

    // ============================================================
    // CATEGORY 2: TROLL/HARASSMENT BURNOUT (Internal)
    // ============================================================
    if (consequenceType === 'internal' && (consequenceId.includes('troll') || consequenceId.includes('burnout'))) {
      // VOLKOV - This directly affects his people
      const volkov = this.npcStates.get('volkov');
      if (volkov) {
        let moraleChange = -10;
        let headline_de = 'Volkov: Team-Sorgen';
        let headline_en = 'Volkov: Team Concerns';
        let reaction_de = '*ernst* Meine Leute sind erschöpft. Das hier... es hinterlässt Spuren, verstehen Sie?';
        let reaction_en = '*serious* My people are exhausted. This... it leaves marks, you understand?';

        if (volkov.morale < 35) {
          moraleChange = -15;
          headline_de = 'Volkov: Moral am Boden';
          headline_en = 'Volkov: Morale Collapsed';
          reaction_de = '*schlägt auf Tisch* Genug! Ich verliere gute Leute wegen dieser Scheiße. Das ist nicht mehr lustig.';
          reaction_en = '*slams table* Enough! I\'m losing good people because of this shit. This isn\'t funny anymore.';
        }

        reactions.push({
          npcId: 'volkov',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: volkov.morale < 35 ? 'danger' : 'warning',
        });
      }

      // KATJA - Empathetic, feels the human cost
      const katja = this.npcStates.get('katja');
      if (katja) {
        let moraleChange = -12;
        let headline_de = 'Katja: Menschliche Kosten';
        let headline_en = 'Katja: Human Cost';
        let reaction_de = '*leise* Wir vergessen manchmal, dass echte Menschen unsere Worte schreiben. Sie leiden darunter.';
        let reaction_en = '*quietly* We sometimes forget that real people write our words. They suffer from it.';

        if (katja.relationshipLevel >= 2) {
          reaction_de = '*schaut Sie an* Sie sehen es auch, oder? Den Preis, den andere für unsere Ziele zahlen.';
          reaction_en = '*looks at you* You see it too, don\'t you? The price others pay for our goals.';
        }

        reactions.push({
          npcId: 'katja',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'warning',
        });
      }

      // MARINA - Calculates the operational impact
      const marina = this.npcStates.get('marina');
      if (marina) {
        const moraleChange = -6;
        const headline_de = 'Marina: Effizienzeinbußen';
        const headline_en = 'Marina: Efficiency Loss';
        const reaction_de = '*rechnet* Personalersatz kostet Budget. Verzögerungen kosten Zeit. Beides können wir uns kaum leisten.';
        const reaction_en = '*calculates* Staff replacement costs budget. Delays cost time. We can afford neither.';

        reactions.push({
          npcId: 'marina',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'info',
        });
      }
    }

    // ============================================================
    // CATEGORY 3: INVESTIGATION/EXPOSURE (Critical for all)
    // ============================================================
    if (consequenceType === 'exposure' && (consequenceId.includes('investigation') || consequenceId.includes('expose'))) {
      // EVERYONE reacts - this is existential

      // DIREKTOR - Leadership under pressure
      const direktor = this.npcStates.get('direktor');
      if (direktor) {
        let moraleChange = -15;
        let headline_de = 'Direktor: Strategische Krise';
        let headline_en = 'Direktor: Strategic Crisis';
        let reaction_de = '*kalter Blick* Eine Untersuchung. Das bedeutet, wir haben begrenzte Zeit. Handeln Sie weise.';
        let reaction_en = '*cold gaze* An investigation. That means we have limited time. Act wisely.';

        if (direktor.morale < 40) {
          moraleChange = -20;
          headline_de = 'Direktor: Vertrauen schwindet';
          headline_en = 'Direktor: Trust Fading';
          reaction_de = '*langsam* Ich beginne zu fragen, ob Sie die richtige Person für diesen Job sind.';
          reaction_en = '*slowly* I\'m beginning to question whether you\'re the right person for this job.';
        } else if (direktor.relationshipLevel >= 3) {
          moraleChange = -10;
          headline_de = 'Direktor: Gemeinsamer Kampf';
          headline_en = 'Direktor: Shared Struggle';
          reaction_de = '*nickt* Schwierig. Aber wir haben schon Schlimmeres überstanden. Bleiben Sie fokussiert.';
          reaction_en = '*nods* Difficult. But we\'ve weathered worse. Stay focused.';
        }

        reactions.push({
          npcId: 'direktor',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'danger',
        });
      }

      // MARINA - Risk analyst's nightmare
      const marina = this.npcStates.get('marina');
      if (marina) {
        const moraleChange = -18;
        const headline_de = 'Marina: Risikoanalyse kritisch';
        const headline_en = 'Marina: Risk Analysis Critical';
        const reaction_de = '*hektisch* Alle Indikatoren sind rot. Wir müssen JETZT unsere Spuren verwischen - jede Stunde zählt.';
        const reaction_en = '*frantic* All indicators are red. We need to cover our tracks NOW - every hour counts.';

        reactions.push({
          npcId: 'marina',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'danger',
        });
      }

      // IGOR - Tech cover-up mode
      const igor = this.npcStates.get('igor');
      if (igor) {
        const moraleChange = -12;
        const headline_de = 'Igor: Notfall-Protokolle';
        const headline_en = 'Igor: Emergency Protocols';
        const reaction_de = '*tippt rasend schnell* Starte Löschprogramme. Verschleiere IP-Spuren. Brauche 48 Stunden minimum.';
        const reaction_en = '*types frantically* Starting deletion programs. Obscuring IP traces. Need 48 hours minimum.';

        reactions.push({
          npcId: 'igor',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'danger',
        });
      }

      // VOLKOV - Crisis brings focus
      const volkov = this.npcStates.get('volkov');
      if (volkov) {
        let moraleChange = -8;
        let headline_de = 'Volkov: Überlebensinstinkt';
        let headline_en = 'Volkov: Survival Instinct';
        let reaction_de = '*entschlossen* Gut. Keine Zeit mehr für Spielchen. Jetzt kämpfen wir ums Überleben.';
        let reaction_en = '*determined* Good. No more time for games. Now we fight to survive.';

        if (volkov.morale >= 60) {
          moraleChange = -5;
          headline_de = 'Volkov: Im Element';
          headline_en = 'Volkov: In His Element';
          reaction_de = '*grinst gefährlich* Das hier? Das ist mein Spezialgebiet. Lasst mich arbeiten.';
          reaction_en = '*grins dangerously* This? This is my specialty. Let me work.';
        }

        reactions.push({
          npcId: 'volkov',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'warning',
        });
      }

      // KATJA - Moral reckoning
      const katja = this.npcStates.get('katja');
      if (katja) {
        let moraleChange = -14;
        let headline_de = 'Katja: Moralische Rechnung';
        let headline_en = 'Katja: Moral Reckoning';
        let reaction_de = '*ruhig aber blass* Vielleicht... vielleicht ist das die Konsequenz, die wir verdienen.';
        let reaction_en = '*calm but pale* Perhaps... perhaps this is the consequence we deserve.';

        if (katja.relationshipLevel >= 2) {
          reaction_de = '*schaut Sie direkt an* Was werden Sie jetzt tun? Noch tiefer sinken, oder endlich aufhören?';
          reaction_en = '*looks directly at you* What will you do now? Sink deeper, or finally stop?';
        }

        reactions.push({
          npcId: 'katja',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'danger',
        });
      }
    }

    // ============================================================
    // CATEGORY 4: OPPORTUNITY (Positive consequences)
    // ============================================================
    if (consequenceType === 'opportunity') {
      // MARINA - Loves good news
      const marina = this.npcStates.get('marina');
      if (marina) {
        const moraleChange = +10;
        const headline_de = 'Marina: Positive Entwicklung';
        const headline_en = 'Marina: Positive Development';
        const reaction_de = '*lächelt* Endlich gute Nachrichten. So gewinnt man Kampagnen - mit kluger Strategie.';
        const reaction_en = '*smiles* Finally good news. This is how you win campaigns - with smart strategy.';

        reactions.push({
          npcId: 'marina',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'success',
        });
      }

      // DIREKTOR - Acknowledges success
      const direktor = this.npcStates.get('direktor');
      if (direktor) {
        const moraleChange = +8;
        const headline_de = 'Direktor: Anerkennung';
        const headline_en = 'Direktor: Recognition';
        const reaction_de = direktor.relationshipLevel >= 2
          ? '*nickt anerkennend* Exzellente Arbeit. Genau diese Initiative erwarte ich von Ihnen.'
          : '*nickt kurz* Akzeptabel. Weiter so.';
        const reaction_en = direktor.relationshipLevel >= 2
          ? '*nods approvingly* Excellent work. This is exactly the initiative I expect from you.'
          : '*nods briefly* Acceptable. Continue.';

        reactions.push({
          npcId: 'direktor',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'success',
        });
      }
    }

    // ============================================================
    // CATEGORY 5: COLLATERAL DAMAGE
    // ============================================================
    if (consequenceType === 'collateral') {
      // KATJA - Most affected by innocent suffering
      const katja = this.npcStates.get('katja');
      if (katja) {
        let moraleChange = -16;
        let headline_de = 'Katja: Gewissenskonflikt';
        let headline_en = 'Katja: Moral Conflict';
        let reaction_de = '*stimme zittert* Unbeteiligte wurden verletzt. Das... das stand so nicht im Plan.';
        let reaction_en = '*voice trembling* Innocent people were hurt. That... that wasn\'t part of the plan.';

        if (katja.morale < 30) {
          moraleChange = -20;
          headline_de = 'Katja: Am Abgrund';
          headline_en = 'Katja: At The Precipice';
          reaction_de = '*wendet sich ab* Ich kann nicht mehr. Wie viele Leben müssen wir noch zerstören?';
          reaction_en = '*turns away* I can\'t anymore. How many more lives must we destroy?';
        }

        reactions.push({
          npcId: 'katja',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'danger',
        });
      }

      // VOLKOV - Pragmatic but not heartless
      const volkov = this.npcStates.get('volkov');
      if (volkov && volkov.morale < 60) {
        const moraleChange = -7;
        const headline_de = 'Volkov: Unbehagen';
        const headline_en = 'Volkov: Discomfort';
        const reaction_de = '*kratzt Nacken* Scheiße. Das wollte ich nicht. Ich mache viel, aber... *verstummt*';
        const reaction_en = '*scratches neck* Shit. Didn\'t want that. I do a lot, but... *trails off*';

        reactions.push({
          npcId: 'volkov',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'warning',
        });
      }

      // DIREKTOR - Cold calculation
      const direktor = this.npcStates.get('direktor');
      if (direktor) {
        const moraleChange = direktor.relationshipLevel >= 3 ? -5 : -2;
        const headline_de = 'Direktor: Kalte Logik';
        const headline_en = 'Direktor: Cold Logic';
        const reaction_de = '*ausdruckslos* Bedauerlich. Aber unvermeidlich bei Operationen dieser Größenordnung.';
        const reaction_en = '*expressionless* Regrettable. But inevitable in operations of this scale.';

        reactions.push({
          npcId: 'direktor',
          moraleChange,
          headline_de,
          headline_en,
          reaction_de,
          reaction_en,
          severity: 'info',
        });
      }
    }

    // ============================================================
    // APPLY MORALE CHANGES & GENERATE NEWS
    // ============================================================
    for (const reaction of reactions) {
      const npc = this.npcStates.get(reaction.npcId);
      if (!npc) continue;

      // Apply morale change
      const oldMorale = npc.morale;
      npc.morale = Math.max(0, Math.min(100, npc.morale + reaction.moraleChange));
      const actualChange = npc.morale - oldMorale;

      // === CASCADE: Check if morale drop triggers crisis ===
      if (npc.morale < 30 && !npc.inCrisis && actualChange < 0) {
        npc.inCrisis = true;
        storyLogger.log(`[Pipeline 3 → Crisis] ${npc.name} entered crisis (morale: ${npc.morale})`);
      }

      // === BONUS: Generate transparent news about team reaction ===
      const changeIndicator = actualChange > 0 ? '↑' : actualChange < 0 ? '↓' : '=';
      const newsHeadline_de = `${reaction.headline_de} ${changeIndicator}${Math.abs(actualChange)}`;
      const newsHeadline_en = `${reaction.headline_en} ${changeIndicator}${Math.abs(actualChange)}`;

      this.newsEvents.unshift({
        id: `news_consequence_reaction_${reaction.npcId}_${this.storyPhase.number}_${this.seededRandom(`news_consequence_${reaction.npcId}`)}`,
        phase: this.storyPhase.number,
        headline_de: newsHeadline_de,
        headline_en: newsHeadline_en,
        description_de: reaction.reaction_de,
        description_en: reaction.reaction_en,
        type: 'npc_reaction',
        severity: reaction.severity,
        read: false,
        pinned: reaction.severity === 'danger',
      });

      storyLogger.log(
        `[Pipeline 3] ${npc.name}: ${actualChange > 0 ? '+' : ''}${actualChange} morale (now ${npc.morale}) - ${reaction.headline_en}`
      );
    }

    // === BONUS: Generate summary news if multiple NPCs affected ===
    if (reactions.length >= 3) {
      const affectedNames = reactions.map(r => this.npcStates.get(r.npcId)?.name || r.npcId).join(', ');
      const totalMoraleChange = reactions.reduce((sum, r) => sum + r.moraleChange, 0);
      const avgChange = Math.round(totalMoraleChange / reactions.length);

      const summaryHeadline_de = avgChange < -10
        ? `Team-Moral sinkt: ${consequence.label_de}`
        : avgChange > 5
        ? `Team-Moral steigt: ${consequence.label_de}`
        : `Team reagiert: ${consequence.label_de}`;

      const summaryHeadline_en = avgChange < -10
        ? `Team Morale Drops: ${consequence.label_en}`
        : avgChange > 5
        ? `Team Morale Rises: ${consequence.label_en}`
        : `Team Reacts: ${consequence.label_en}`;

      const summaryDescription_de = `Die Konsequenz betrifft das gesamte Team. Reaktionen von: ${affectedNames}`;
      const summaryDescription_en = `The consequence affects the entire team. Reactions from: ${affectedNames}`;

      this.newsEvents.unshift({
        id: `news_consequence_summary_${Date.now()}`,
        phase: this.storyPhase.number,
        headline_de: summaryHeadline_de,
        headline_en: summaryHeadline_en,
        description_de: summaryDescription_de,
        description_en: summaryDescription_en,
        type: 'npc_event',
        severity: avgChange < -10 ? 'warning' : 'info',
        read: false,
        pinned: avgChange < -10,
      });
    }
  }

  /**
   * PHASE 2 FEEDBACK LOOP: NPC Crisis → World Events
   *
   * When NPCs are in crisis, it affects the world. Their stress, mistakes, and
   * deteriorating performance create subtle but visible world events.
   *
   * This creates a powerful feedback loop:
   * Player Actions → Consequences → NPC Morale → Crisis → World Events → Player Awareness
   */
  private generateNPCCrisisEvents(phase: number): NewsEvent[] {
    const crisisEvents: NewsEvent[] = [];

    // Track which NPCs are in crisis
    const npcsInCrisis = Array.from(this.npcStates.values()).filter(npc => npc.inCrisis);
    const lowMoraleNPCs = Array.from(this.npcStates.values()).filter(
      npc => npc.morale < 40 && !npc.inCrisis
    );

    // ============================================================
    // CRITICAL: Multiple NPCs in crisis = team breakdown visible
    // ============================================================
    if (npcsInCrisis.length >= 3) {
      const names = npcsInCrisis.map(npc => npc.name).join(', ');
      crisisEvents.push({
        id: `npc_crisis_team_breakdown_${phase}`,
        phase,
        headline_de: 'Interne Spannungen',
        headline_en: 'Internal Tensions',
        description_de: `Quellen berichten von Problemen in der Organisation. Mehrere Mitglieder wirken gestresst. (${names})`,
        description_en: `Sources report problems within the organization. Multiple members appear stressed. (${names})`,
        type: 'world_event',
        severity: 'warning',
        read: false,
        pinned: true,
      });

      storyLogger.log(`[Phase 2 Feedback] Team crisis visible: ${npcsInCrisis.length} NPCs in crisis`);
    }

    // ============================================================
    // CHARACTER-SPECIFIC CRISIS MANIFESTATIONS
    // ============================================================

    // IGOR in crisis → Technical mistakes become visible
    const igor = this.npcStates.get('igor');
    if (igor?.inCrisis && this.seededRandom(`igor_crisis_${phase}`) < 0.4) {
      crisisEvents.push({
        id: `npc_crisis_igor_${phase}`,
        phase,
        headline_de: 'Technische Anomalien entdeckt',
        headline_en: 'Technical Anomalies Detected',
        description_de: 'Sicherheitsforscher berichten von ungewöhnlichen digitalen Spuren. Fehlerhafte Verschleierung vermutet.',
        description_en: 'Security researchers report unusual digital traces. Faulty obfuscation suspected.',
        type: 'world_event',
        severity: 'warning',
        read: false,
        pinned: false,
      });

      storyLogger.log(`[Phase 2 Feedback] Igor's crisis manifests: technical errors visible`);
    }

    // MARINA in crisis → Financial irregularities leak
    const marina = this.npcStates.get('marina');
    if (marina?.inCrisis && this.seededRandom(`marina_crisis_${phase}`) < 0.35) {
      crisisEvents.push({
        id: `npc_crisis_marina_${phase}`,
        phase,
        headline_de: 'Unklare Geldflüsse beobachtet',
        headline_en: 'Unclear Money Flows Observed',
        description_de: 'Finanzjournalisten verfolgen verdächtige Transaktionen. Die Spur führt zu verschleierten Konten.',
        description_en: 'Financial journalists trace suspicious transactions. The trail leads to obscured accounts.',
        type: 'world_event',
        severity: 'warning',
        read: false,
        pinned: false,
      });

      storyLogger.log(`[Phase 2 Feedback] Marina's crisis manifests: financial leaks`);
    }

    // VOLKOV in crisis → Operations become sloppy, visible
    const volkov = this.npcStates.get('volkov');
    if (volkov?.inCrisis && this.seededRandom(`volkov_crisis_${phase}`) < 0.45) {
      crisisEvents.push({
        id: `npc_crisis_volkov_${phase}`,
        phase,
        headline_de: 'Aggressive Trolling-Kampagne auffällig',
        headline_en: 'Aggressive Trolling Campaign Noticeable',
        description_de: 'Plattformen melden koordinierte Belästigung. Muster zu offensichtlich, Accounts bereits gesperrt.',
        description_en: 'Platforms report coordinated harassment. Patterns too obvious, accounts already suspended.',
        type: 'world_event',
        severity: 'info',
        read: false,
        pinned: false,
      });

      storyLogger.log(`[Phase 2 Feedback] Volkov's crisis manifests: sloppy trolling detected`);
    }

    // KATJA in crisis → Moral messaging becomes incoherent
    const katja = this.npcStates.get('katja');
    if (katja?.inCrisis && this.seededRandom(`katja_crisis_${phase}`) < 0.3) {
      crisisEvents.push({
        id: `npc_crisis_katja_${phase}`,
        phase,
        headline_de: 'Propaganda-Narrative inkonsistent',
        headline_en: 'Propaganda Narratives Inconsistent',
        description_de: 'Analysten bemerken widersprüchliche Botschaften. Die Kampagne wirkt unkoordiniert und verzweifelt.',
        description_en: 'Analysts notice contradictory messages. The campaign seems uncoordinated and desperate.',
        type: 'world_event',
        severity: 'info',
        read: false,
        pinned: false,
      });

      storyLogger.log(`[Phase 2 Feedback] Katja's crisis manifests: narrative breakdown`);
    }

    // DIREKTOR in crisis → VERY RARE but catastrophic
    const direktor = this.npcStates.get('direktor');
    if (direktor?.inCrisis && this.seededRandom(`direktor_crisis_${phase}`) < 0.15) {
      crisisEvents.push({
        id: `npc_crisis_direktor_${phase}`,
        phase,
        headline_de: 'Hochrangige Quelle unter Druck',
        headline_en: 'High-Ranking Source Under Pressure',
        description_de: 'Gerüchte über interne Probleme bei einer wichtigen Organisation. Führungskrise vermutet.',
        description_en: 'Rumors about internal problems at an important organization. Leadership crisis suspected.',
        type: 'world_event',
        severity: 'danger',
        read: false,
        pinned: true,
      });

      storyLogger.log(`[Phase 2 Feedback] DIREKTOR crisis visible - catastrophic implications!`);
    }

    // ============================================================
    // LOW MORALE (not yet crisis) → Subtle performance issues
    // ============================================================
    if (lowMoraleNPCs.length >= 2 && this.seededRandom(`low_morale_${phase}`) < 0.25) {
      crisisEvents.push({
        id: `npc_low_morale_${phase}`,
        phase,
        headline_de: 'Operative Effizienz schwankt',
        headline_en: 'Operative Efficiency Fluctuates',
        description_de: 'Beobachter bemerken Unregelmäßigkeiten in sonst professionellen Operationen.',
        description_en: 'Observers notice irregularities in otherwise professional operations.',
        type: 'world_event',
        severity: 'info',
        read: false,
        pinned: false,
      });

      storyLogger.log(`[Phase 2 Feedback] Low team morale creates subtle inefficiencies`);
    }

    // ============================================================
    // BONUS: Betrayal system integration
    // ============================================================
    // If multiple NPCs are stressed AND betrayal risk is high
    // Calculate average betrayal risk across all NPCs
    let totalBetrayalRisk = 0;
    let npcCount = 0;
    for (const npcId of ['direktor', 'marina', 'volkov', 'katja', 'igor']) {
      if (this.betrayalSystem) {
        const riskData = this.betrayalSystem.getBetrayalRisk(npcId);
        if (riskData && typeof riskData.risk === 'number') {
          totalBetrayalRisk += riskData.risk;
          npcCount++;
        }
      }
    }
    const avgBetrayalRisk = npcCount > 0 ? totalBetrayalRisk / npcCount : 0;

    if (npcsInCrisis.length >= 2 && avgBetrayalRisk >= 60 && this.seededRandom(`betrayal_leak_${phase}`) < 0.2) {
      crisisEvents.push({
        id: `npc_crisis_leak_risk_${phase}`,
        phase,
        headline_de: 'Potenzielle Informationslecks',
        headline_en: 'Potential Information Leaks',
        description_de: 'Geheimdienstberichte warnen vor Sicherheitslücken durch gestresste Insider.',
        description_en: 'Intelligence reports warn of security vulnerabilities from stressed insiders.',
        type: 'world_event',
        severity: 'warning',
        read: false,
        pinned: true,
      });

      storyLogger.log(`[Phase 2 Feedback → Betrayal] Crisis + High betrayal risk = leak warnings`);
    }

    return crisisEvents;
  }

  /**
   * PHASE 2 FEEDBACK LOOP: Resource Trends → Dynamic Events
   *
   * Monitors resource changes over time and generates world events when patterns emerge.
   * This creates awareness that the world is watching and reacting to your resource state.
   *
   * Tracked trends: Risk, Attention, Budget depletion
   */
  /**
   * P2-17 Pacing — Gegenwehr-Eskalation (Spät-Welle). Wächst linear mit der Phase;
   * in der Schonzeit (erste 3 Jahre) null. Spät überwiegt sie den passiven Abbau
   * (~1–2 Risiko/Phase), sodass Dauer-Leerlauf gefährlich wird („spürbar härter").
   * Gibt NUR Risiko/Aufmerksamkeit zurück — die Sieg-Achse (obj_destabilize) bleibt
   * tabu (R2). Gedeckelt, damit aktives, geschicktes Spiel weiter gewinnbar bleibt.
   */
  private oppositionPressure(phase: number): { risk: number; attention: number } {
    // Etappe 3 (Paket E): stark gestutzt — der Anti-Passivitäts-Druck kommt jetzt
    // aus dem IMMUNSYSTEM (Abwehr/Regeneration/Wahltag), nicht aus einem Skript
    // (Zielbild §5/E4: „Der Druck wächst aus dem eigenen Handeln"). Es bleibt ein
    // leichter später Atem der Gegenseite, damit Spät-Spiel nie ganz lautlos ist.
    const ramp = phase - this.PACING_GRACE_PHASES;
    if (ramp <= 0) return { risk: 0, attention: 0 };
    return {
      risk: Math.min(2, ramp * 0.05),
      attention: Math.min(4, ramp * 0.08),
    };
  }

  private generateResourceTrendEvents(phase: number): NewsEvent[] {
    const trendEvents: NewsEvent[] = [];

    // Skip first 2 phases - need history for trends
    if (phase < 3) return trendEvents;

    // T2/#11: „Stille Tage" füllen — in ruhiger Frühphase (niedriges Risiko) gelegentlich
    // ein leiser Hinweis, der die Stille bricht UND lehrt, dass Eskalation/Wagnis der Motor
    // ist (Welt-Events feuern sonst erst ab risk≥70). Deterministisch → kein Spam.
    if (
      phase <= 12 &&
      this.storyResources.risk < 40 &&
      this.storyResources.attention < 50 &&
      this.seededRandom(`ambient_calm_${phase}`) < 0.34
    ) {
      const calmLines = [
        {
          headline_de: 'Ruhige Lage im Land',
          headline_en: 'A quiet spell',
          description_de:
            'Die Öffentlichkeit ist gelassen, die Ermittler unbeschäftigt. Wer kein Risiko geht, bleibt unsichtbar — bewegt aber auch wenig. Der große Hebel liegt im Wagnis.',
          description_en:
            'The public is calm, investigators idle. Playing it safe keeps you invisible — but moves little. The real leverage lies in bold action.',
        },
        {
          headline_de: 'Wenig Bewegung in der Westunion',
          headline_en: 'Little movement across Westunion',
          description_de:
            'Vorsichtige Operationen halten die Gegenseite fern — und die Schlagzeilen aus. Sichtbare Wirkung kostet Aufmerksamkeit und Risiko.',
          description_en:
            'Cautious operations keep the opposition away — and the headlines too. Visible impact costs attention and risk.',
        },
      ];
      const line = calmLines[Math.abs(phase) % calmLines.length];
      trendEvents.push({
        id: `ambient_calm_${phase}`,
        phase,
        headline_de: line.headline_de,
        headline_en: line.headline_en,
        description_de: line.description_de,
        description_en: line.description_en,
        type: 'world_event',
        severity: 'info',
        read: false,
        pinned: false,
      });
    }

    // ============================================================
    // RISING RISK TREND
    // ============================================================
    if (this.storyResources.risk >= 70) {
      // Check if risk has been high for multiple phases
      if (this.seededRandom(`risk_trend_${phase}`) < 0.3) {
        trendEvents.push({
          id: `resource_trend_risk_${phase}`,
          phase,
          headline_de: 'Operationales Risiko steigt',
          headline_en: 'Operational Risk Rising',
          description_de: 'Beobachter warnen vor zunehmenden Sicherheitslücken. Die Organisation agiert immer riskanter.',
          description_en: 'Observers warn of increasing security gaps. The organization is acting increasingly risky.',
          type: 'world_event',
          severity: this.storyResources.risk >= 85 ? 'danger' : 'warning',
          read: false,
          pinned: this.storyResources.risk >= 85,
        });

        storyLogger.log(`[Phase 2 Feedback] High risk trend generates world attention (risk: ${this.storyResources.risk})`);
      }
    }

    // ============================================================
    // RISING ATTENTION TREND
    // ============================================================
    if (this.storyResources.attention >= 65) {
      if (this.seededRandom(`attention_trend_${phase}`) < 0.35) {
        trendEvents.push({
          id: `resource_trend_attention_${phase}`,
          phase,
          headline_de: 'Mediale Aufmerksamkeit wächst',
          headline_en: 'Media Attention Growing',
          description_de: 'Immer mehr Journalisten verfolgen verdächtige Aktivitäten. Das Scheinwerferlicht wird heller.',
          description_en: 'More and more journalists track suspicious activities. The spotlight is getting brighter.',
          type: 'world_event',
          severity: this.storyResources.attention >= 80 ? 'warning' : 'info',
          read: false,
          pinned: false,
        });

        storyLogger.log(`[Phase 2 Feedback] High attention trend becomes visible (attention: ${this.storyResources.attention})`);
      }
    }

    // ============================================================
    // BUDGET CRISIS
    // ============================================================
    if (this.storyResources.budget <= 30) {
      if (this.seededRandom(`budget_trend_${phase}`) < 0.25) {
        trendEvents.push({
          id: `resource_trend_budget_${phase}`,
          phase,
          headline_de: 'Finanzielle Engpässe vermutet',
          headline_en: 'Financial Bottlenecks Suspected',
          description_de: 'Quellen berichten von Budgetproblemen. Zahlungen verzögern sich, Mitarbeiter werden unruhig.',
          description_en: 'Sources report budget problems. Payments are delayed, staff is getting restless.',
          type: 'world_event',
          severity: this.storyResources.budget <= 15 ? 'warning' : 'info',
          read: false,
          pinned: false,
        });

        storyLogger.log(`[Phase 2 Feedback] Low budget creates external visibility (budget: ${this.storyResources.budget})`);
      }
    }

    // ============================================================
    // CAPACITY DEPLETION
    // ============================================================
    if (this.storyResources.capacity <= 2) {
      if (this.seededRandom(`capacity_trend_${phase}`) < 0.3) {
        trendEvents.push({
          id: `resource_trend_capacity_${phase}`,
          phase,
          headline_de: 'Operative Kapazität erschöpft',
          headline_en: 'Operative Capacity Exhausted',
          description_de: 'Insider berichten von Überlastung. Die Organisation arbeitet am Limit.',
          description_en: 'Insiders report overload. The organization is working at its limit.',
          type: 'world_event',
          severity: 'info',
          read: false,
          pinned: false,
        });

        storyLogger.log(`[Phase 2 Feedback] Low capacity visible (capacity: ${this.storyResources.capacity})`);
      }
    }

    // ============================================================
    // MORAL WEIGHT ACCUMULATION
    // ============================================================
    if (this.storyResources.moralWeight >= 40) {
      if (this.seededRandom(`moral_trend_${phase}`) < 0.2) {
        trendEvents.push({
          id: `resource_trend_moral_${phase}`,
          phase,
          headline_de: 'Ethische Bedenken häufen sich',
          headline_en: 'Ethical Concerns Mounting',
          description_de: 'Menschenrechtsgruppen dokumentieren fragwürdige Praktiken. Der moralische Preis wird sichtbar.',
          description_en: 'Human rights groups document questionable practices. The moral price becomes visible.',
          type: 'world_event',
          severity: this.storyResources.moralWeight >= 60 ? 'warning' : 'info',
          read: false,
          pinned: this.storyResources.moralWeight >= 60,
        });

        storyLogger.log(`[Phase 2 Feedback] High moral weight creates external scrutiny (moral: ${this.storyResources.moralWeight})`);
      }
    }

    // ============================================================
    // COMBINED CRISIS: Multiple resources critical
    // ============================================================
    const criticalResources = [
      this.storyResources.risk >= 80,
      this.storyResources.attention >= 75,
      this.storyResources.budget <= 20,
      this.storyResources.capacity <= 1,
    ].filter(Boolean).length;

    if (criticalResources >= 3 && this.seededRandom(`multi_crisis_${phase}`) < 0.4) {
      trendEvents.push({
        id: `resource_trend_multi_crisis_${phase}`,
        phase,
        headline_de: 'Mehrfachkrise erkennbar',
        headline_en: 'Multiple Crises Detected',
        description_de: 'Analysten warnen: Die Organisation steht unter extremem Druck. Zusammenbruch möglich.',
        description_en: 'Analysts warn: The organization is under extreme pressure. Collapse possible.',
        type: 'world_event',
        severity: 'danger',
        read: false,
        pinned: true,
      });

      storyLogger.log(`[Phase 2 Feedback] MULTI-CRISIS: ${criticalResources} resources critical!`);
    }

    return trendEvents;
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

      // === PIPELINE 3: Consequence → NPC Morale (ENHANCED) ===
      // Character-specific, linguistically rich morale impacts
      this.applyConsequenceMoraleImpact(consequence);

      // Handle NPC effects (LEGACY - kept for backward compatibility)
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
        storyLogger.log(`[ConsequenceEffect] Infrastructure lost: ${effects.infrastructure_loss}`);
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
        storyLogger.log('[ConsequenceEffect] Positive amplification effect triggered');
      }

      if (effects.legitimacy_boost) {
        // Reduce risk slightly as operations gain legitimacy
        this.storyResources.risk = Math.max(0, this.storyResources.risk - 5);
      }

      storyLogger.log('[ConsequenceEffect] Applied effects:', effects);
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
          storyLogger.log(`[ChainTrigger] ${consequence.id} → ${effects.chain_trigger}`);
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

    storyLogger.log(`[IgnoredConsequence] ${consequence.label_de} - effects applied:`, effects);
  }

  /**
   * Generate NPC reactions to world events and action news
   * PIPELINE 2: Events → NPC Reactions
   *
   * NPCs comment on significant events with character-specific perspectives.
   * Reactions vary based on: Relationship Level, Mood, Morale, NPC Expertise
   *
   * BONUS: NPCs also react to player action-news (Pipeline 1 Synergy!)
   */
  private generateNPCEventReactions(events: NewsEvent[]): NewsEvent[] {
    const reactions: NewsEvent[] = [];

    for (const event of events) {
      // Determine which NPCs should react to this event
      const reactingNPCs = this.determineReactingNPCs(event);

      for (const npcId of reactingNPCs) {
        const npc = this.npcStates.get(npcId);
        if (!npc) continue;

        // Generate context-aware dialogue
        const dialogue = this.selectNPCEventDialogue(npcId, npc, event);
        if (!dialogue) continue;

        // Create reaction news event
        reactions.push({
          id: `news_npc_reaction_${npcId}_${this.storyPhase.number}_${this.seededRandom(`npc_reaction_${npcId}`)}`,
          phase: this.storyPhase.number,
          headline_de: `${npc.name}: ${dialogue.headline_de}`,
          headline_en: `${npc.name}: ${dialogue.headline_en}`,
          description_de: dialogue.text_de,
          description_en: dialogue.text_en,
          type: 'npc_reaction',
          severity: dialogue.severity || 'info',
          read: false,
          pinned: false,
        });
      }
    }

    return reactions;
  }

  /**
   * Determine which NPCs should react to an event
   * Based on: Event type, NPC specialties, Event severity, Current game state
   */
  private determineReactingNPCs(event: NewsEvent): string[] {
    const reactingNPCs: string[] = [];

    // High-severity events: Everyone reacts
    const isHighSeverity = event.severity === 'danger' || event.severity === 'warning';
    if (isHighSeverity) {
      return ['direktor', 'marina', 'volkov', 'katja', 'igor'];
    }

    // Event-type based reactions
    const eventKeywords = `${event.headline_de} ${event.headline_en} ${event.description_de}`.toLowerCase();

    // Marina: Economics, data, analysis, public opinion
    if (eventKeywords.includes('econom') ||
        eventKeywords.includes('daten') || eventKeywords.includes('data') ||
        eventKeywords.includes('umfrage') || eventKeywords.includes('poll') ||
        eventKeywords.includes('studie') || eventKeywords.includes('study')) {
      reactingNPCs.push('marina');
    }

    // Direktor: Politics, power, strategy
    if (eventKeywords.includes('politik') || eventKeywords.includes('politic') ||
        eventKeywords.includes('wahl') || eventKeywords.includes('election') ||
        eventKeywords.includes('regierung') || eventKeywords.includes('government') ||
        eventKeywords.includes('instabil') || eventKeywords.includes('instability')) {
      reactingNPCs.push('direktor');
    }

    // Volkov: Chaos, protests, social unrest, trolling opportunities
    if (eventKeywords.includes('protest') ||
        eventKeywords.includes('unruhe') || eventKeywords.includes('unrest') ||
        eventKeywords.includes('konflikt') || eventKeywords.includes('conflict') ||
        eventKeywords.includes('krise') || eventKeywords.includes('crisis') ||
        eventKeywords.includes('chaos')) {
      reactingNPCs.push('volkov');
    }

    // Katja: Media, narratives, content, viral
    if (eventKeywords.includes('media') || eventKeywords.includes('medien') ||
        eventKeywords.includes('viral') ||
        eventKeywords.includes('kampagne') || eventKeywords.includes('campaign') ||
        eventKeywords.includes('narrativ') || eventKeywords.includes('narrative') ||
        eventKeywords.includes('story')) {
      reactingNPCs.push('katja');
    }

    // Igor: Technology, security, hacking, cyber
    if (eventKeywords.includes('cyber') ||
        eventKeywords.includes('hack') ||
        eventKeywords.includes('sicherheit') || eventKeywords.includes('security') ||
        eventKeywords.includes('tech') ||
        eventKeywords.includes('bot') ||
        eventKeywords.includes('digital')) {
      reactingNPCs.push('igor');
    }

    // PIPELINE 1 SYNERGY: NPCs react to YOUR actions
    if (event.type === 'action_result' && event.sourceActionId) {
      // Dark actions: Everyone has an opinion
      if (event.severity === 'danger') {
        if (!reactingNPCs.includes('marina')) reactingNPCs.push('marina'); // Moral concern
        if (!reactingNPCs.includes('volkov')) reactingNPCs.push('volkov'); // Celebrates
      }

      // Successful campaigns: Katja + Direktor react
      if (event.severity === 'success') {
        if (!reactingNPCs.includes('katja')) reactingNPCs.push('katja');
        if (!reactingNPCs.includes('direktor')) reactingNPCs.push('direktor');
      }
    }

    // If no specific reactions, pick 1-2 random NPCs (keep it varied)
    if (reactingNPCs.length === 0 && event.severity !== 'info') {
      const allNPCs = ['direktor', 'marina', 'volkov', 'katja', 'igor'];
      const randomCount = this.seededRandom(`event_reaction_count_${event.id}`) > 0.5 ? 1 : 2;
      for (let i = 0; i < randomCount; i++) {
        const npcIndex = Math.floor(this.seededRandom(`event_reaction_npc_${event.id}_${i}`) * allNPCs.length);
        const randomNPC = allNPCs[npcIndex];
        if (!reactingNPCs.includes(randomNPC)) {
          reactingNPCs.push(randomNPC);
        }
      }
    }

    return reactingNPCs;
  }

  /**
   * Select appropriate dialogue for NPC reacting to event
   * Context-aware based on: Relationship, Mood, Morale, Event Type
   */
  private selectNPCEventDialogue(npcId: string, npc: NPCState, event: NewsEvent): {
    headline_de: string;
    headline_en: string;
    text_de: string;
    text_en: string;
    severity?: 'info' | 'success' | 'warning' | 'danger';
  } | null {
    const eventKeywords = `${event.headline_de} ${event.headline_en}`.toLowerCase();

    // ===== DIREKTOR =====
    if (npcId === 'direktor') {
      // Strategic observations
      if (eventKeywords.includes('politik') || eventKeywords.includes('politic')) {
        return {
          headline_de: npc.relationshipLevel >= 2 ? 'Das spielt uns in die Hände' : 'Politische Entwicklung',
          headline_en: npc.relationshipLevel >= 2 ? 'This plays into our hands' : 'Political development',
          text_de: npc.morale >= 60
            ? '*nickt zufrieden* Perfekter Zeitpunkt für unsere Operationen.'
            : '*runzelt Stirn* Das könnte kompliziert werden.',
          text_en: npc.morale >= 60
            ? '*nods with satisfaction* Perfect timing for our operations.'
            : '*frowns* This could get complicated.',
          severity: 'info',
        };
      }

      if (eventKeywords.includes('krise') || eventKeywords.includes('crisis')) {
        return {
          headline_de: 'Krise ist Opportunität',
          headline_en: 'Crisis is opportunity',
          text_de: '*lehnt sich zurück* In Chaos liegt Macht. Wir müssen handeln.',
          text_en: '*leans back* In chaos lies power. We must act.',
          severity: 'success',
        };
      }

      // Player action reactions
      if (event.type === 'action_result') {
        if (event.severity === 'danger') {
          return {
            headline_de: npc.morale >= 50 ? 'Mutige Taktik' : 'Zu riskant',
            headline_en: npc.morale >= 50 ? 'Bold tactics' : 'Too risky',
            text_de: npc.morale >= 50
              ? 'Aggressiv, aber effektiv. So gewinnt man Kriege.'
              : '*schaut Sie an* Das wird Konsequenzen haben.',
            text_en: npc.morale >= 50
              ? 'Aggressive, but effective. This is how wars are won.'
              : '*looks at you* This will have consequences.',
            severity: npc.morale >= 50 ? 'info' : 'warning',
          };
        }
      }
    }

    // ===== MARINA =====
    if (npcId === 'marina') {
      // Data analysis
      if (eventKeywords.includes('econom') || eventKeywords.includes('daten') || eventKeywords.includes('data')) {
        return {
          headline_de: 'Interessante Daten',
          headline_en: 'Interesting data',
          text_de: npc.relationshipLevel >= 2
            ? '*zeigt Ihnen Graphen* Sehen Sie das Muster? Das können wir nutzen.'
            : '*analysiert Bildschirm* Die Zahlen sind... aufschlussreich.',
          text_en: npc.relationshipLevel >= 2
            ? '*shows you graphs* See the pattern? We can use this.'
            : '*analyzes screen* The numbers are... revealing.',
          severity: 'info',
        };
      }

      // Moral concerns on dark actions
      if (event.type === 'action_result' && event.severity === 'danger') {
        return {
          headline_de: npc.morale >= 50 ? 'Notwendiges Übel' : 'Das geht zu weit',
          headline_en: npc.morale >= 50 ? 'Necessary evil' : 'This goes too far',
          text_de: npc.morale >= 50
            ? '*seufzt* Ich verstehe die Notwendigkeit, aber... *schaut weg*'
            : '*blass* Das... das war extrem. Ich brauche... einen Moment.',
          text_en: npc.morale >= 50
            ? '*sighs* I understand the necessity, but... *looks away*'
            : '*pale* That... that was extreme. I need... a moment.',
          severity: npc.morale >= 50 ? 'warning' : 'danger',
        };
      }

      // Crisis reactions
      if (eventKeywords.includes('krise') || eventKeywords.includes('crisis')) {
        return {
          headline_de: npc.morale >= 60 ? 'Besorgniserregend' : 'Ich mache mir Sorgen',
          headline_en: npc.morale >= 60 ? 'Concerning' : 'I\'m worried',
          text_de: npc.morale >= 60
            ? 'Die Daten zeigen Eskalation. Wir sollten vorsichtig sein.'
            : '*nervös* Die Entwicklung ist... beunruhigend. Sehr beunruhigend.',
          text_en: npc.morale >= 60
            ? 'Data shows escalation. We should be careful.'
            : '*nervous* The development is... disturbing. Very disturbing.',
          severity: 'warning',
        };
      }
    }

    // ===== VOLKOV =====
    if (npcId === 'volkov') {
      // Chaos = Joy
      if (eventKeywords.includes('protest') || eventKeywords.includes('unruhe') || eventKeywords.includes('chaos')) {
        return {
          headline_de: npc.relationshipLevel >= 2 ? 'PERFEKT!' : 'Interessant',
          headline_en: npc.relationshipLevel >= 2 ? 'PERFECT!' : 'Interesting',
          text_de: npc.relationshipLevel >= 2
            ? '*reibt sich die Hände* Das ist UNSER Moment! Lass uns Öl ins Feuer gießen!'
            : '*grinst* Da draußen brodelt es. Das können wir nutzen.',
          text_en: npc.relationshipLevel >= 2
            ? '*rubs hands* This is OUR moment! Let\'s add fuel to the fire!'
            : '*grins* It\'s simmering out there. We can use this.',
          severity: 'success',
        };
      }

      // Celebrates dark actions
      if (event.type === 'action_result' && event.severity === 'danger') {
        return {
          headline_de: npc.relationshipLevel >= 1 ? 'ENDLICH Aktion!' : 'Jetzt wird\'s interessant',
          headline_en: npc.relationshipLevel >= 1 ? 'FINALLY action!' : 'Now it gets interesting',
          text_de: npc.relationshipLevel >= 1
            ? '*lacht laut* JA! Das ist echte Arbeit! Mehr davon!'
            : '*grinst* Ah, Sie zeigen Zähne. Gut.',
          text_en: npc.relationshipLevel >= 1
            ? '*laughs loudly* YES! That\'s real work! More of this!'
            : '*grins* Ah, you show teeth. Good.',
          severity: 'success',
        };
      }

      // Bored by peaceful events
      if (event.severity === 'info') {
        return {
          headline_de: 'Langweilig',
          headline_en: 'Boring',
          text_de: '*gähnt* Sagen Sie Bescheid, wenn was Interessantes passiert.',
          text_en: '*yawns* Let me know when something interesting happens.',
          severity: 'info',
        };
      }
    }

    // ===== KATJA =====
    if (npcId === 'katja') {
      // Media narratives
      if (eventKeywords.includes('narrativ') || eventKeywords.includes('kampagne') || eventKeywords.includes('viral')) {
        return {
          headline_de: npc.relationshipLevel >= 2 ? 'Story-Gold!' : 'Story-Potential',
          headline_en: npc.relationshipLevel >= 2 ? 'Story gold!' : 'Story potential',
          text_de: npc.relationshipLevel >= 2
            ? '*springt auf* Das ist PERFEKT für unsere Narrative! Lassen Sie mich ran!'
            : '*notiert eifrig* Da steckt eine Geschichte drin...',
          text_en: npc.relationshipLevel >= 2
            ? '*jumps up* This is PERFECT for our narratives! Let me at it!'
            : '*notes eagerly* There\'s a story in this...',
          severity: 'success',
        };
      }

      // Celebrates viral success
      if (event.type === 'action_result' && event.severity === 'success') {
        return {
          headline_de: npc.relationshipLevel >= 1 ? 'BRILLIANT!' : 'Das funktioniert',
          headline_en: npc.relationshipLevel >= 1 ? 'BRILLIANT!' : 'That works',
          text_de: npc.relationshipLevel >= 1
            ? '*umarmt Sie* Das ist Kunst! Pure Kunst! Die Menschen FÜHLEN es!'
            : '*lächelt* Gute Arbeit. Die Resonanz ist stark.',
          text_en: npc.relationshipLevel >= 1
            ? '*hugs you* That\'s art! Pure art! People FEEL it!'
            : '*smiles* Good work. The resonance is strong.',
          severity: 'success',
        };
      }

      // Worried by dark actions
      if (event.type === 'action_result' && event.severity === 'danger') {
        return {
          headline_de: npc.morale >= 50 ? 'Starke Methoden' : 'Das ist... heftig',
          headline_en: npc.morale >= 50 ? 'Strong methods' : 'That\'s... intense',
          text_de: npc.morale >= 50
            ? '*schluckt* Das ist... eine sehr dunkle Geschichte. Sind Sie sicher?'
            : '*starrt* Das sind keine Geschichten mehr. Das sind echte Menschen...',
          text_en: npc.morale >= 50
            ? '*swallows* That\'s... a very dark story. Are you sure?'
            : '*stares* These aren\'t stories anymore. These are real people...',
          severity: 'warning',
        };
      }
    }

    // ===== IGOR =====
    if (npcId === 'igor') {
      // Technical/security events
      if (eventKeywords.includes('cyber') || eventKeywords.includes('hack') || eventKeywords.includes('sicherheit')) {
        return {
          headline_de: event.severity === 'warning' ? 'Sicherheitsrisiko' : 'Noted',
          headline_en: event.severity === 'warning' ? 'Security risk' : 'Noted',
          text_de: event.severity === 'warning'
            ? '*tippt schnell* Erhöhe Encryption. Ändere Routen. 30 Minuten.'
            : '*nickt* Tracking. Updating protocols.',
          text_en: event.severity === 'warning'
            ? '*types quickly* Increasing encryption. Changing routes. 30 minutes.'
            : '*nods* Tracking. Updating protocols.',
          severity: event.severity === 'warning' ? 'warning' : 'info',
        };
      }

      // Bot detection (player action)
      if (eventKeywords.includes('bot') && event.type === 'action_result') {
        return {
          headline_de: npc.morale >= 60 ? 'Verbesserungsbedarf' : 'Problematisch',
          headline_en: npc.morale >= 60 ? 'Needs improvement' : 'Problematic',
          text_de: npc.morale >= 60
            ? '*runzelt Stirn* Signatur zu offensichtlich. Ich optimiere.'
            : '*ernst* Sie wurden entdeckt. Ich brauche Zeit zum Refactoring.',
          text_en: npc.morale >= 60
            ? '*frowns* Signature too obvious. I\'ll optimize.'
            : '*serious* You were detected. I need time for refactoring.',
          severity: 'warning',
        };
      }

      // Minimal reactions to non-technical events
      return {
        headline_de: 'OK',
        headline_en: 'OK',
        text_de: '*nickt kurz*',
        text_en: '*nods briefly*',
        severity: 'info',
      };
    }

    return null;
  }

  private generateWorldEvents(phase: number): NewsEvent[] {
    const generatedEvents: NewsEvent[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = worldEventsData as any;

    // Clear triggered events for this phase (used for cascade tracking)
    this.triggeredEventsThisPhase.clear();

    // First pass: trigger non-cascade events
    for (const eventDef of data.worldEvents) {
      // Skip cascade events in first pass
      if (eventDef.trigger?.type === 'event_cascade') continue;

      if (this.shouldTriggerWorldEvent(eventDef, phase)) {
        const newsEvent = this.createNewsEventFromDef(eventDef, phase);
        generatedEvents.push(newsEvent);
        this.newsEvents.push(newsEvent);

        // Track triggered event for cascades
        this.triggeredEventsThisPhase.add(eventDef.id);
        this.allTriggeredEvents.set(eventDef.id, phase);

        // P2-7: Record cooldown for this event
        this.worldEventCooldowns.set(eventDef.id, phase);

        // Apply event effects and create opportunity windows
        this.applyWorldEventEffects(eventDef.effects, eventDef);

        // Play world event sound
        playSound('worldEvent');

        storyLogger.log(`[${eventDef.scale || 'national'}] World event triggered: ${eventDef.headline_de}`);
      }
    }

    // Second pass: process cascade events (events triggered by other events)
    let cascadePass = 0;
    const maxCascadePasses = 3; // Prevent infinite loops
    let newCascades = true;

    while (newCascades && cascadePass < maxCascadePasses) {
      newCascades = false;
      cascadePass++;

      for (const eventDef of data.worldEvents) {
        if (eventDef.trigger?.type !== 'event_cascade') continue;
        if (this.triggeredEventsThisPhase.has(eventDef.id)) continue; // Already triggered

        const parentEventId = eventDef.trigger.conditions?.parentEvent;
        if (!parentEventId) continue;

        // Check if parent event was triggered this phase or recently (within 2 phases)
        const parentTriggeredPhase = this.allTriggeredEvents.get(parentEventId);
        const recentlyTriggered = parentTriggeredPhase !== undefined &&
                                   (phase - parentTriggeredPhase) <= 2;

        if (this.triggeredEventsThisPhase.has(parentEventId) || recentlyTriggered) {
          // Check probability
          const eventRandom = this.seededRandom(`cascade_${eventDef.id}_${phase}`);
          if (eventRandom < (eventDef.probability || 0.5)) {
            const newsEvent = this.createNewsEventFromDef(eventDef, phase);
            generatedEvents.push(newsEvent);
            this.newsEvents.push(newsEvent);

            this.triggeredEventsThisPhase.add(eventDef.id);
            this.allTriggeredEvents.set(eventDef.id, phase);
            this.worldEventCooldowns.set(eventDef.id, phase);
            this.applyWorldEventEffects(eventDef.effects, eventDef);

            storyLogger.log(`[CASCADE] ${eventDef.headline_de} (triggered by ${parentEventId})`);
            newCascades = true;
          }
        }
      }
    }

    return generatedEvents;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createNewsEventFromDef(eventDef: any, phase: number): NewsEvent {
    return {
      id: `world_${eventDef.id}_${phase}`,
      phase,
      headline_de: eventDef.headline_de,
      headline_en: eventDef.headline_en,
      description_de: eventDef.description_de,
      description_en: eventDef.description_en,
      type: 'world_event',
      severity: eventDef.severity || 'info',
      scale: eventDef.scale,
      region: eventDef.region,
      location: eventDef.location,
      read: false,
      pinned: false,
    };
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
  private applyWorldEventEffects(effects: any, eventDef?: any): void {
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

    // Trust in media/government changes
    if (effects.trust_media_change || effects.trust_government_change) {
      const trustObj = this.objectives.find(o => o.category === 'trust_reduction');
      if (trustObj) {
        const change = (effects.trust_media_change || 0) + (effects.trust_government_change || 0);
        trustObj.currentValue = Math.max(0, trustObj.currentValue + Math.abs(change));
      }
    }

    // Westunion cohesion damage (major success for player)
    if (effects.westunion_cohesion_damage || effects.westunion_division) {
      const damage = (effects.westunion_cohesion_damage || 0) + (effects.westunion_division || 0);
      // Boost primary objective progress - DECREASE trust (currentValue goes down)
      const primaryObj = this.objectives.find(o => o.id === 'obj_destabilize');
      if (primaryObj) {
        // BALANCE 2026-01-14: Tuned for ~40-60% win rate at 20 phases
        primaryObj.currentValue = Math.max(0, primaryObj.currentValue - damage * 0.75);
        // Update progress: (100 - current) / (100 - target) * 100
        primaryObj.progress = Math.min(100,
          ((100 - primaryObj.currentValue) / (100 - primaryObj.targetValue)) * 100
        );
        if (primaryObj.currentValue <= primaryObj.targetValue) {
          primaryObj.completed = true;
          storyLogger.log(`🎯 Objective completed: ${primaryObj.label_de}`);
        }
      }
    }

    // Regional effects (affect specific member states)
    const regionalEffects = [
      'regional_anxiety', 'regional_discontent', 'regional_unrest', 'regional_nationalism',
      'ethnic_tension', 'economic_discontent', 'separatism_boost', 'internal_division',
      'political_instability', 'historical_division', 'populist_boost'
    ];

    for (const effectType of regionalEffects) {
      if (effects[effectType] && typeof effects[effectType] === 'object') {
        // Regional effect with member state target
        for (const [region, value] of Object.entries(effects[effectType])) {
          storyLogger.log(`[Regional Effect] ${region}: ${effectType} +${value}`);
          // These regional tensions contribute to overall destabilization
          const primaryObj = this.objectives.find(o => o.id === 'obj_destabilize');
          if (primaryObj) {
            // BALANCE 2026-01-14: Tuned for ~40-60% win rate at 20 phases
            primaryObj.currentValue = Math.max(0, primaryObj.currentValue - (value as number) * 0.25);
            // Update progress: (100 - current) / (100 - target) * 100
            primaryObj.progress = Math.min(100,
              ((100 - primaryObj.currentValue) / (100 - primaryObj.targetValue)) * 100
            );
            if (primaryObj.currentValue <= primaryObj.targetValue) {
              primaryObj.completed = true;
              storyLogger.log(`🎯 Objective completed: ${primaryObj.label_de}`);
            }
          }
        }
      }
    }

    // ====================================================
    // OPPORTUNITY WINDOWS - Create from event effects
    // ====================================================
    if (eventDef) {
      this.createOpportunityWindowsFromEvent(effects, eventDef);
    }
  }

  /**
   * Create opportunity windows from world event effects
   * Opportunity windows boost action effectiveness during specific time periods
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createOpportunityWindowsFromEvent(effects: any, eventDef: any): void {
    const opportunityMappings: {
      effectKey: string | string[];
      type: OpportunityType;
      boostedTags: string[];
      boostedPhases: string[];
      multiplier: number;
      duration?: number;
    }[] = [
      // Election opportunities
      {
        effectKey: ['opportunity_window', 'election_interference_window'],
        type: 'elections',
        boostedTags: ['election', 'political', 'influence', 'propaganda'],
        boostedPhases: ['ta06', 'ta07'],
        multiplier: 1.5,
        duration: 12, // 1 year window for elections
      },
      // Content effectiveness boost
      {
        effectKey: 'content_effectiveness_boost',
        type: 'media_distrust',
        boostedTags: ['content', 'fake_news', 'meme', 'viral'],
        boostedPhases: ['ta03', 'ta04'],
        multiplier: 0, // Will use effect value
      },
      // Social actions boost (protests, unrest)
      {
        effectKey: 'social_actions_effectiveness',
        type: 'protest',
        boostedTags: ['polarization', 'amplification', 'social'],
        boostedPhases: ['ta04', 'ta07'],
        multiplier: 0,
      },
      // Economic crisis opportunities
      {
        effectKey: ['economic_actions_cost_reduction', 'economic_anxiety', 'financial_panic'],
        type: 'economic_anxiety',
        boostedTags: ['economic', 'exploit', 'division'],
        boostedPhases: ['ta03', 'ta07'],
        multiplier: 1.3,
      },
      // Extremism window
      {
        effectKey: 'extremism_window',
        type: 'extremism',
        boostedTags: ['polarization', 'conspiracy', 'attack'],
        boostedPhases: ['ta05', 'ta07'],
        multiplier: 1.4,
      },
      // Political chaos
      {
        effectKey: ['political_chaos_boost', 'political_instability'],
        type: 'chaos',
        boostedTags: ['political', 'influence', 'infiltration'],
        boostedPhases: ['ta06'],
        multiplier: 1.3,
      },
      // Migration debate
      {
        effectKey: ['migration_debate_boost', 'migration_narrative_boost'],
        type: 'migration',
        boostedTags: ['polarization', 'content', 'targeting'],
        boostedPhases: ['ta03', 'ta04'],
        multiplier: 1.4,
      },
      // Sovereignty concerns (anti-Westunion)
      {
        effectKey: ['anti_westunion_boost', 'anti_westunion_narrative_boost', 'sovereignty_narrative_boost'],
        type: 'sovereignty',
        boostedTags: ['political', 'content', 'propaganda'],
        boostedPhases: ['ta03', 'ta06'],
        multiplier: 1.35,
      },
      // Security tensions
      {
        effectKey: ['security_tension', 'military_tension_boost', 'fear_narrative_boost'],
        type: 'security',
        boostedTags: ['conspiracy', 'fake_news', 'emotional'],
        boostedPhases: ['ta03'],
        multiplier: 1.3,
      },
      // Division/polarization opportunities
      {
        effectKey: ['generational_divide', 'social_division', 'culture_war_boost'],
        type: 'division',
        boostedTags: ['polarization', 'division', 'targeting'],
        boostedPhases: ['ta04', 'ta07'],
        multiplier: 1.35,
      },
    ];

    for (const mapping of opportunityMappings) {
      const effectKeys = Array.isArray(mapping.effectKey) ? mapping.effectKey : [mapping.effectKey];

      for (const key of effectKeys) {
        if (effects[key]) {
          const windowId = `${eventDef.id}_${mapping.type}_${this.storyPhase.number}`;

          // Don't create duplicate windows
          if (this.activeOpportunityWindows.has(windowId)) continue;

          const multiplier = mapping.multiplier === 0
            ? (typeof effects[key] === 'number' ? effects[key] : 1.2)
            : mapping.multiplier;

          const window: OpportunityWindow = {
            id: windowId,
            type: mapping.type,
            source: eventDef.id,
            sourceHeadline_de: eventDef.headline_de || eventDef.id,
            sourceHeadline_en: eventDef.headline_en || eventDef.id,
            createdPhase: this.storyPhase.number,
            expiresPhase: this.storyPhase.number + (mapping.duration || this.OPPORTUNITY_WINDOW_DURATION),
            region: eventDef.region as MemberState | undefined,
            boostedTags: mapping.boostedTags,
            boostedPhases: mapping.boostedPhases,
            effectivenessMultiplier: multiplier,
            costReduction: effects[`${key}_cost_reduction`] || undefined,
            riskReduction: effects[`${key}_risk_reduction`] || undefined,
          };

          this.activeOpportunityWindows.set(windowId, window);
          playSound('opportunityOpen');
          storyLogger.log(`[OPPORTUNITY] Window opened: ${mapping.type} (${multiplier}x) until phase ${window.expiresPhase}`);
          break; // Only create one window per mapping
        }
      }
    }

    // Also create windows for explicit narrative boosts
    const narrativeBoosts = Object.keys(effects).filter(k =>
      (k.endsWith('_narrative_boost') || k.endsWith('_boost')) &&
      typeof effects[k] === 'number' &&
      effects[k] > 1
    );

    for (const boostKey of narrativeBoosts) {
      // Extract narrative type from key (e.g., "energy_narrative_boost" -> "energy")
      const narrativeType = boostKey.replace('_narrative_boost', '').replace('_boost', '');
      const windowId = `${eventDef.id}_narrative_${narrativeType}_${this.storyPhase.number}`;

      if (this.activeOpportunityWindows.has(windowId)) continue;

      const window: OpportunityWindow = {
        id: windowId,
        type: 'narrative',
        source: eventDef.id,
        sourceHeadline_de: eventDef.headline_de || eventDef.id,
        sourceHeadline_en: eventDef.headline_en || eventDef.id,
        createdPhase: this.storyPhase.number,
        expiresPhase: this.storyPhase.number + this.OPPORTUNITY_WINDOW_DURATION,
        region: eventDef.region as MemberState | undefined,
        boostedTags: [narrativeType, 'content', 'propaganda'],
        boostedPhases: ['ta03', 'ta04'],
        effectivenessMultiplier: effects[boostKey],
      };

      this.activeOpportunityWindows.set(windowId, window);
      storyLogger.log(`[NARRATIVE BOOST] ${narrativeType}: ${effects[boostKey]}x until phase ${window.expiresPhase}`);
    }
  }

  /**
   * Clean up expired opportunity windows (call at phase start)
   */
  private cleanupExpiredOpportunityWindows(): void {
    const expiredWindows: string[] = [];

    for (const [id, window] of this.activeOpportunityWindows) {
      if (this.storyPhase.number > window.expiresPhase) {
        expiredWindows.push(id);
        storyLogger.log(`[OPPORTUNITY] Window closed: ${window.type} (was from ${window.sourceHeadline_de})`);
      }
    }

    for (const id of expiredWindows) {
      this.activeOpportunityWindows.delete(id);
    }
  }

  /**
   * Get all active opportunity windows
   */
  getActiveOpportunityWindows(): OpportunityWindow[] {
    return Array.from(this.activeOpportunityWindows.values());
  }

  /**
   * Get effectiveness modifier for an action based on active opportunity windows
   * Returns combined multiplier and any cost/risk reductions
   */
  getOpportunityModifiers(actionId: string, tags: string[], phase: string): {
    effectivenessMultiplier: number;
    costMultiplier: number;
    riskMultiplier: number;
    activeWindows: OpportunityWindow[];
  } {
    let effectivenessMultiplier = 1.0;
    let costMultiplier = 1.0;
    let riskMultiplier = 1.0;
    const activeWindows: OpportunityWindow[] = [];

    for (const window of this.activeOpportunityWindows.values()) {
      // Check if window is still active
      if (this.storyPhase.number > window.expiresPhase) continue;

      // Check if this action matches the window's criteria
      const matchesTags = window.boostedTags.some(t => tags.includes(t));
      const matchesPhase = window.boostedPhases.includes(phase);

      if (matchesTags || matchesPhase) {
        // Apply the boost (multiplicative stacking with diminishing returns)
        const boostAmount = window.effectivenessMultiplier - 1;
        effectivenessMultiplier += boostAmount * 0.7; // 70% of boost stacks

        if (window.costReduction) {
          costMultiplier *= window.costReduction;
        }
        if (window.riskReduction) {
          riskMultiplier *= window.riskReduction;
        }

        activeWindows.push(window);
      }
    }

    return {
      effectivenessMultiplier: Math.min(2.5, effectivenessMultiplier), // Cap at 2.5x
      costMultiplier: Math.max(0.5, costMultiplier), // Min 50% cost
      riskMultiplier: Math.max(0.5, riskMultiplier), // Min 50% risk
      activeWindows,
    };
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

    // Paket C (Etappe 3): Plattform-Sperren DURCHSETZEN — bisher führte die
    // Moderations-KI Buch (disabledActions), aber niemand las sie. Gesperrte
    // Kanäle sind jetzt sichtbar grau („Kanal gesperrt", X Tage).
    const bannedUntil = this.actorAI.getDisabledActions()[loaded.id];
    const isBanned = this.actorAI.isActionDisabled(loaded.id, this.storyPhase.number);
    const banDaysLeft = isBanned ? Math.max(1, bannedUntil - this.storyPhase.number) : 0;

    return {
      id: loaded.id,
      label_de: loaded.label_de,
      label_en: loaded.label_en || loaded.label_de,
      headline_de: loaded.headline_de,
      headline_en: loaded.headline_en,
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
      available: loaded.isUnlocked && !loaded.isUsed && !isBanned,
      unavailableReason: !loaded.isUnlocked ? 'Locked - prerequisites not met' :
                         loaded.isUsed ? 'Already used' :
                         isBanned ? `Kanal gesperrt — noch ${banDaysLeft} Tag${banDaysLeft === 1 ? '' : 'e'}` : undefined,
      prerequisites: loaded.prerequisites || [],
      prerequisitesMet: this.actionLoader.arePrerequisitesMet(loaded),
      npcAffinity: loaded.npc_affinity,
      npcBonus,
      engineAbilityId: loaded.disarm_ref || undefined,
      disarmRef: loaded.disarm_ref || undefined,
      params: loaded.params,
      effects: loaded.effects,
    };
  }

  /**
   * Generate contextual news events from a player action
   * PIPELINE 1: Actions → News
   *
   * Implements smart filtering - not every action generates news.
   * News generated based on: Impact, Legality, Risk, Tags, Moral Weight
   */
  private generateActionNews(action: StoryAction, result: ActionResult): NewsEvent[] {
    const news: NewsEvent[] = [];

    // SMART FILTERING: Only significant actions generate news
    const isSignificant =
      action.legality !== 'legal' ||                           // Illegal/grey actions
      (action.costs.moralWeight && action.costs.moralWeight >= 5) ||  // High moral weight
      (action.costs.risk && action.costs.risk >= 30) ||        // High risk
      (action.costs.attention && action.costs.attention >= 25) || // High attention
      action.tags.includes('viral') ||                         // Viral potential
      action.tags.includes('violent') ||                       // Violence
      this.storyResources.risk >= 60;                          // Already hot

    if (!isSignificant) {
      // Skip news for routine, low-impact actions
      return news;
    }

    // === PRIMARY ACTION NEWS ===
    const primaryNews = this.createPrimaryActionNews(action, result);
    news.push(primaryNews);

    // === WORLD REACTION NEWS (for very significant actions) ===
    const worldReaction = this.createWorldReactionNews(action, result);
    if (worldReaction) {
      news.push(worldReaction);
    }

    return news;
  }

  /**
   * Create primary action news with contextual headlines
   */
  private createPrimaryActionNews(action: StoryAction, result: ActionResult): NewsEvent {
    let headline_de = action.label_de;
    let headline_en = action.label_en;
    let description_de = action.narrative_de;
    let description_en = action.narrative_en;
    let severity: 'info' | 'success' | 'warning' | 'danger' = 'info';

    // === TAG-BASED HEADLINES ===
    // Generate more dramatic headlines based on action tags
    if (action.tags.includes('bot')) {
      headline_de = 'Koordinierte Bot-Aktivität beobachtet';
      headline_en = 'Coordinated Bot Activity Observed';
      description_de = 'Experten entdecken Muster automatisierter Accounts.';
      description_en = 'Experts detect patterns of automated accounts.';
      severity = 'warning';
    } else if (action.tags.includes('trolling') || action.tags.includes('harassment')) {
      headline_de = 'Welle an Belästigungen in sozialen Medien';
      headline_en = 'Wave of Harassment on Social Media';
      description_de = 'Koordinierte Angriffe gegen Zielpersonen dokumentiert.';
      description_en = 'Coordinated attacks against targets documented.';
      severity = 'warning';
    } else if (action.tags.includes('blackmail')) {
      headline_de = 'Politische Figur unter mysteriösem Druck';
      headline_en = 'Political Figure Under Mysterious Pressure';
      description_de = 'Quellen berichten von kompromittierendem Material.';
      description_en = 'Sources report compromising material.';
      severity = 'danger';
    } else if (action.tags.includes('propaganda') || action.tags.includes('content')) {
      headline_de = 'Neue Narrative verbreiten sich viral';
      headline_en = 'New Narratives Spreading Virally';
      description_de = 'Unbekannte Quellen pushen koordinierte Botschaften.';
      description_en = 'Unknown sources push coordinated messages.';
      severity = 'info';
    } else if (action.tags.includes('hacking') || action.tags.includes('technical')) {
      headline_de = 'Sicherheitsexperten warnen vor Cyber-Aktivität';
      headline_en = 'Security Experts Warn of Cyber Activity';
      description_de = 'Verdächtige digitale Operationen entdeckt.';
      description_en = 'Suspicious digital operations detected.';
      severity = 'warning';
    } else if (action.tags.includes('recruiting')) {
      headline_de = 'Insider berichten von Rekrutierungsversuchen';
      headline_en = 'Insiders Report Recruitment Attempts';
      description_de = 'Quellen sprechen von geheimnisvollen Angeboten.';
      description_en = 'Sources speak of mysterious offers.';
      severity = 'info';
    } else if (action.tags.includes('violence') || action.tags.includes('violent')) {
      headline_de = 'Gewaltvolle Inhalte nehmen zu';
      headline_en = 'Violent Content on the Rise';
      description_de = 'Extremistische Rhetorik erreicht neue Intensität.';
      description_en = 'Extremist rhetoric reaches new intensity.';
      severity = 'danger';
    } else if (action.tags.includes('viral')) {
      headline_de = 'Mysteriöse Kampagne erreicht Millionen';
      headline_en = 'Mysterious Campaign Reaches Millions';
      description_de = 'Unklare Quellen hinter viralem Phänomen.';
      description_en = 'Unclear sources behind viral phenomenon.';
      severity = 'success';
    }

    // === SEVERITY ADJUSTMENTS ===
    // Override severity based on legality and moral weight
    if (action.legality === 'illegal') {
      severity = severity === 'info' ? 'warning' : severity;
      severity = severity === 'success' ? 'warning' : severity;
    }

    if (action.costs.moralWeight && action.costs.moralWeight >= 7) {
      severity = 'danger';
    }

    // === RISK-BASED MODIFICATIONS ===
    // P0-6: kein Emoji-Präfix mehr (Verbotsliste) — die Schlagzeile steht „aus einem Guss";
    // das erhöhte Risiko trägt allein die Severity (warnt farblich im Ticker/Newsroom).
    if (this.storyResources.risk >= 70) {
      severity = severity === 'info' ? 'warning' : severity;
    }

    return {
      id: `news_action_${action.id}_${Date.now()}`,
      phase: this.storyPhase.number,
      headline_de,
      headline_en,
      description_de,
      description_en,
      type: 'action_result',
      severity,
      sourceActionId: action.id,
      read: false,
      pinned: false,
    };
  }

  /**
   * Create world reaction news for very significant actions
   * Only triggered for high-impact operations
   */
  private createWorldReactionNews(action: StoryAction, result: ActionResult): NewsEvent | null {
    // Only very significant actions get world reactions
    const needsWorldReaction =
      (action.costs.moralWeight && action.costs.moralWeight >= 8) ||
      (action.costs.risk && action.costs.risk >= 40) ||
      action.tags.includes('blackmail') ||
      action.tags.includes('violence') ||
      this.storyResources.risk >= 80;

    if (!needsWorldReaction) {
      return null;
    }

    let headline_de = 'Behörden äußern Bedenken';
    let headline_en = 'Authorities Express Concerns';
    let description_de = 'Offizielle beobachten die Entwicklung mit Sorge.';
    let description_en = 'Officials monitor developments with concern.';

    // Customize based on context
    if (this.storyResources.risk >= 80) {
      headline_de = 'Druck auf Ermittlungsbehörden steigt';
      headline_en = 'Pressure on Investigators Mounts';
      description_de = 'Öffentlichkeit fordert Aufklärung verdächtiger Aktivitäten.';
      description_en = 'Public demands clarification of suspicious activities.';
    } else if (action.tags.includes('blackmail')) {
      headline_de = 'Politische Instabilität nimmt zu';
      headline_en = 'Political Instability Increases';
      description_de = 'Experten warnen vor Destabilisierung.';
      description_en = 'Experts warn of destabilization.';
    } else if (action.tags.includes('violence')) {
      headline_de = 'Sicherheitskräfte in Alarmbereitschaft';
      headline_en = 'Security Forces on Alert';
      description_de = 'Behörden erhöhen Überwachung extremistischer Aktivitäten.';
      description_en = 'Authorities increase monitoring of extremist activities.';
    }

    return {
      id: `news_reaction_${action.id}_${Date.now()}`,
      phase: this.storyPhase.number,
      headline_de,
      headline_en,
      description_de,
      description_en,
      type: 'world_event',
      severity: 'warning',
      read: false,
      pinned: false,
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

    // Paket C (Etappe 3): gesperrte Kanäle sind auch am Ausführungs-Pfad dicht
    // (nicht nur ausgegraut) — sonst umgeht die Aktions-Queue die Sperre.
    if (this.actorAI.isActionDisabled(actionId, this.storyPhase.number)) {
      return {
        success: false,
        action,
        effects: [],
        resourceChanges: {},
        narrative: {
          headline_de: 'Kanal gesperrt',
          headline_en: 'Channel banned',
          description_de: 'Die Plattform-Moderation hat diesen Kanal vorübergehend stillgelegt.',
          description_en: 'Platform moderation has temporarily shut this channel down.',
        },
        potentialConsequences: [],
      };
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

    // T1/#5: Gesellschaftswerte vor den Effekten schnappen, um die unmittelbare
    // Wirkung dieser Aktion sichtbar zu machen (Delta nach applyActionEffects).
    const societyBefore = this.getSocietySnapshot();
    const trustBefore = this.objectives.find((o) => o.id === 'obj_destabilize')?.currentValue ?? 100;

    // Effekte anwenden
    const effects = this.applyActionEffects(action, options);
    const societyChanges = this.societyChangesSince(societyBefore, trustBefore);

    // Konsequenzen registrieren
    const potentialConsequences = this.registerPotentialConsequences(action);

    // NPC-Reaktionen (now includes betrayal warnings)
    const { reactions: npcReactions, betrayalWarnings } = this.processNPCReactions(action);

    // P2-8: NPC Relationship Progress - improve relationship with NPCs matching action affinity
    this.updateNPCRelationships(action, options?.npcAssist);

    // NPC Morale Update - dark actions affect team morale
    this.updateNPCMorale(action);

    // === EXTENDED ACTORS INTEGRATION ===
    // Calculate effectiveness modifiers based on actor vulnerabilities
    const actorModifiers = this.extendedActorLoader.calculateEffectivenessModifiers(
      action.tags,
      [action.phase]
    );

    // Apply trust damage to vulnerable actors
    for (const mod of actorModifiers) {
      if (mod.isVulnerable) {
        this.extendedActorLoader.applyTrustDamage(
          mod.actorId,
          5 * (action.costs.moralWeight || 1), // Base damage scaled by moral weight
          mod.modifier
        );
      }
    }

    // T1/#27: Wirksamkeit einmal berechnen (Basis 50% + Ziel-Affinität der Akteure)
    // — für den Erzähltext UND als sichtbare Kennzahl im Ergebnis-Modal.
    const effectiveness = Math.min(100, 50 + actorModifiers.reduce((sum, m) => sum + (m.modifier - 1) * 50, 0));

    // === NARRATIVE GENERATOR INTEGRATION ===
    // Generate rich narrative for action result
    const storyNarrative = StoryNarrativeGenerator.generateActionNarrative({
      actionId: action.id,
      actionLabel_de: action.label_de,
      actionLabel_en: action.label_en,
      headline_de: action.headline_de,
      headline_en: action.headline_en,
      phase: action.phase,
      tags: action.tags,
      legality: action.legality,
      targetActors: actorModifiers
        .filter(m => m.isVulnerable)
        .slice(0, 3)
        .map(m => this.extendedActorLoader.getActor(m.actorId)!)
        .filter(Boolean),
      npcAssist: options?.npcAssist,
      effectiveness,
      risk: this.storyResources.risk,
      moralWeight: this.storyResources.moralWeight,
    });

    // T3.4-Fix: resourceChanges sind signierte Deltas, keine Roh-Kosten. Budget/Kapazität
    // werden verbraucht (negativ), Risiko/Aufmerksamkeit steigen (positiv) — sonst zeigte das
    // Ergebnis-Modal „+$3K" grün, während der Saldo sank. Budget um den NPC-Rabatt korrigiert
    // (analog deductActionCosts).
    const resourceChanges: Partial<StoryResources> = { ...action.costs };
    if (resourceChanges.budget) {
      resourceChanges.budget = -Math.ceil(resourceChanges.budget * (1 - this.calculateNPCDiscount(action) / 100));
    }
    if (resourceChanges.capacity) resourceChanges.capacity = -resourceChanges.capacity;

    // Ergebnis
    const result: ActionResult = {
      success: true,
      action,
      effects,
      resourceChanges,
      societyChanges,
      effectiveness,
      narrative: {
        headline_de: storyNarrative.headline_de,
        headline_en: storyNarrative.headline_en,
        description_de: storyNarrative.description_de,
        description_en: storyNarrative.description_en,
      },
      potentialConsequences,
      npcReactions,
      actorModifiers: actorModifiers.length > 0 ? actorModifiers : undefined,
      betrayalWarnings: betrayalWarnings.length > 0 ? betrayalWarnings : undefined,
    };

    // Etappe 4 (E5): Hat das Maschen-Gedächtnis spürbar gedämpft, quittiert das
    // Ergebnis Ursache + Tag + Gegenmaßnahme — die Abstumpfung warnt zwar schon auf
    // der Karte (Stempel), aber die Quittung erklärt das WARUM (nie eine Matrix-Zahl).
    if (this.lastMaschenDaempfung && this.lastMaschenDaempfung.multiplikator <= 0.7) {
      const text = this.maschenQuittungText(this.lastMaschenDaempfung);
      result.maschenQuittung = {
        text_de: text,
        multiplikator: this.lastMaschenDaempfung.multiplikator,
        familieLabel: this.lastMaschenDaempfung.familieLabel,
      };
      result.effects.unshift({
        type: 'verpuffung',
        value: -Math.round((1 - this.lastMaschenDaempfung.multiplikator) * 100),
        description_de: text,
        description_en: 'Effect fizzled: this pattern is already known here.',
      });
    }

    // Play appropriate sound based on action type
    if (action.legality === 'illegal' || (action.costs.moralWeight && action.costs.moralWeight > 5)) {
      playSound('moralShift'); // Dark action
    } else {
      playSound('success'); // Standard success
    }

    // Mark action as used in ActionLoader
    this.actionLoader.markAsUsed(actionId);

    // Check for unlocking new actions based on this action's completion
    this.actionLoader.checkUnlocks(actionId);

    // Process combo progress
    const comboResult = this.comboSystem.processAction(
      actionId,
      action.tags,
      this.storyPhase.number
    );

    // Apply combo effects and add to result
    if (comboResult.completedCombos.length > 0) {
      result.completedCombos = comboResult.completedCombos;

      for (const combo of comboResult.completedCombos) {
        // Apply combo bonuses to resources
        this.applyComboBonus(combo);

        // Play combo sound
        playSound('combo');

        // Add combo completion news
        this.newsEvents.unshift({
          id: `news_combo_${combo.comboId}_${Date.now()}`,
          phase: this.storyPhase.number,
          headline_de: `Kombination: ${combo.comboName}`,
          headline_en: `Combo: ${combo.comboName}`,
          description_de: combo.description,
          description_en: combo.description,
          type: 'action_result',
          severity: 'success',
          read: false,
          pinned: false,
        });
      }
    }

    // Add combo hints to result
    if (comboResult.newHints.length > 0) {
      result.comboHints = comboResult.newHints;
    }

    // Track action for Actor-AI (Arms Race)
    this.actorAI.trackAction(actionId, action.tags, this.storyPhase.number);

    // Etappe 3 (Zufluss c): Maschen-Wiederholung — die n-te Wiederholung derselben
    // Familie wird durchschaut („Gepatcht") und stärkt die ABWEHR sofort sichtbar.
    this.registerMethodFamilyUse(action.tags);

    // Historie
    this.actionHistory.push({
      phase: this.storyPhase.number,
      actionId,
      result,
    });

    // === PIPELINE 1: Actions → News ===
    // Generate contextual news based on action significance
    const actionNews = this.generateActionNews(action, result);
    for (const news of actionNews) {
      this.newsEvents.unshift(news);
    }

    return result;
  }

  /**
   * P2 „Operations-Akte": eine aus {Ziel, Schwäche, Verbreiter, Plattform-Mix}
   * zusammengesetzte Operation ausspielen. Reiner params-Durchstich:
   *   ids → BattlefieldChain (pure Bewertung) → Nachricht + Broadcast + Risiko/Aufmerksamkeit.
   *
   * Bewusst eigener Pfad neben executeAction (keine Aktion-Karte, kein actionPoint):
   * die Akte ist ein additives Werkzeug. Faktencheck/Sättigung speisen sich aus dem
   * aktuellen Spielstand (attention/risk), damit die Bewertung mit der Lage atmet.
   * Ressourcen-Effekt bewusst moderat (P2-Erststufe; Aufbau-/Budget-Ökonomie folgt, §9.4).
   */
  // ── P2 Operations-Ökonomie: Verbreiter-Aufbau + Kompromat-Beschaffung ──────────
  // Laufzeit-Zustand neben den Ressourcen: macht Operationen kostenpflichtig (kein
  // Spam) und bildet die Kette Ziel→Dossier→Kompromat→Verbreiter ab (Konzept §2/§5).
  private carrierStates = new Map<string, CarrierState>();
  private acquiredKompromat = new Set<string>();

  // ── „Loop schließen": Operationen koppeln an Sieg/Niederlage (Konzept §4) ──────
  // Bisher waren P2-Operationen reine Kosten (Risiko/Aufmerksamkeit) ohne Ertrag —
  // damit konnte das Schlachtfeld nie Teil einer Gewinn-Strategie sein. Jetzt:
  //  · gelungene Operation → erodiert Institutionen-Vertrauen (Richtung Sieg),
  //  · Enttarnung (verbrannt) → öffentlicher Rückschlag: Vertrauen der Gegenseite ↑,
  //  · Kompromat-Heikelheit → moralische Last (↔ moral_weight ↔ Enden).
  private readonly OP_TRUST_EROSION = 11;      // result.impact (0..1) × Faktor → Vertrauenserosion
  private readonly OP_BURN_TRUST_REBOUND = 9;  // Enttarnung: Institutionen gewinnen Vertrauen zurück
  private readonly OP_BURN_RISK_SPIKE = 12;    // Enttarnung hebt das Entdeckungsrisiko sprunghaft
  private readonly OP_BURN_ATTENTION_SPIKE = 8;
  private readonly OP_FRAKTION_MOBILIZE = 2.5; // Etappe 3: Operation mobilisiert die radikale Kraft
  private readonly KOMPROMAT_MORAL = 12;       // Beschaffung heiklen Materials = moralische Last
  private readonly OP_DEPLOY_MORAL = 7;        // Ausspielen des Kompromats = zusätzliche Last
  private readonly OP_BURN_MORAL = 5;          // verbranntes Asset / öffentlicher Schaden
  // Kampagnen-Schmiede („Zähne"): auf geschönter Wunsch-Stichprobe gebaute Kampagne verpufft.
  private readonly OP_BIAS_EFFECT_FACTOR = 0.45; // echte Zielgruppe reagiert schwächer → weniger Erosion
  private readonly OP_BIAS_ATTENTION_SPIKE = 6;  // sichtbarer Fehlschlag zieht Gegner-Aufmerksamkeit
  private readonly OP_BIAS_MORAL = 3;            // verpuffte Wirkung, aber Mittel doch eingesetzt

  // Operations-Bilanz (für End-Report + Methoden-Atlas).
  private operationsPlayed = 0;
  private carriersUsed = new Set<string>();
  private platformsUsed = new Set<string>();

  private kompromatKey(targetId: string, vulnId: string): string {
    return `${targetId}:${vulnId}`;
  }

  /**
   * Verschiebt das Institutionen-Vertrauen (obj_destabilize.currentValue) und rechnet
   * Fortschritt/Erfüllung neu. delta<0 = Erosion (Richtung Sieg), delta>0 = Rückschlag.
   * Eine Stelle für alle Trust-Bewegungen außerhalb der regulären Aktions-/Regen-Logik.
   */
  private applyInstitutionalTrustDelta(delta: number): void {
    const obj = this.objectives.find((o) => o.id === 'obj_destabilize');
    if (!obj) return;
    obj.currentValue = Math.max(0, Math.min(100, obj.currentValue + delta));
    obj.progress = Math.min(100, ((100 - obj.currentValue) / (100 - obj.targetValue)) * 100);
    obj.completed = obj.currentValue <= obj.targetValue;
  }

  // ============================================
  // GESELLSCHAFTSWERTE (B2b/P2) — Effekt-Splitting + Formeln
  // ============================================

  /** Schnappschuss der acht Gesellschaftswerte (für die Phasen-Formel). */
  private getSocietySnapshot(): SocietySnapshot {
    const r = this.storyResources;
    return {
      polarisierung: r.polarisierung,
      informationslast: r.informationslast,
      zynismus: r.zynismus,
      fragmentierung: r.fragmentierung,
      diskursqualitaet: r.diskursqualitaet,
      wehrhaftigkeit: r.wehrhaftigkeit,
      reformfaehigkeit: r.reformfaehigkeit,
      fraktionsstaerke: r.fraktionsstaerke,
    };
  }

  /** T1/#5: unmittelbare Gesellschaftswert-Änderung einer Aktion (gerundet, nur ≠ 0)
   *  + Vertrauen (aus obj_destabilize). Vergleicht den Schnappschuss vor den Effekten
   *  mit dem aktuellen Zustand. */
  private societyChangesSince(
    before: SocietySnapshot,
    trustBefore: number
  ): ActionResult['societyChanges'] {
    const after = this.getSocietySnapshot();
    const out: Partial<Record<SocietyValueKey, number>> & { vertrauen?: number } = {};
    for (const key of Object.keys(after) as SocietyValueKey[]) {
      const d = Math.round(after[key] - before[key]);
      if (d !== 0) out[key] = d;
    }
    const trustAfter = this.objectives.find((o) => o.id === 'obj_destabilize')?.currentValue ?? trustBefore;
    const dv = Math.round(trustAfter - trustBefore);
    if (dv !== 0) out.vertrauen = dv;
    return Object.keys(out).length > 0 ? out : undefined;
  }

  /** P3: verbleibende Phasen des aktiven Krisenfensters (0 = keins). */
  getCrisisWindowPhasesLeft(): number {
    return this.crisisWindowPhasesLeft;
  }

  /** P3: aktueller Gerüchte-Druck (verzögerte Informationslast-Quelle). */
  getRumorPressure(): number {
    return this.rumorPressure;
  }

  // ============================================
  // EPISODEN (B1/P4) — die Wirbelsäule
  // ============================================

  /** Auslöse-Kontext: aktuelle Werte (inkl. Vertrauen) + bisher ausgelöste Welt-Events. */
  private buildEpisodeTriggerContext(): EpisodeTriggerContext {
    const s = this.getSocietySnapshot();
    const trust = this.objectives.find(o => o.id === 'obj_destabilize')?.currentValue ?? 100;
    return {
      values: { ...s, vertrauen: trust },
      recentWorldEventIds: Array.from(this.allTriggeredEvents.keys()),
    };
  }

  /**
   * Emergent-kuratiert (O1): Episoden, die JETZT auslösbar sind und noch nicht laufen/
   * abgeschlossen sind. Optional auf den anbietenden NPC gefiltert (Dialog-Angebot).
   */
  getOfferableEpisodes(npcId?: string): Episode[] {
    const ctx = this.buildEpisodeTriggerContext();
    return loadEpisodes().filter(ep => {
      if (this.episodesActive.has(ep.id) || this.episodesCompleted.has(ep.id)) return false;
      if (npcId && ep.beteiligte?.anbieter_npc !== npcId) return false;
      return isEpisodeTriggered(ep, ctx);
    });
  }

  /** Markiert eine Episode als angeboten (für „neu/ungesehen"-Anzeige). */
  markEpisodeOffered(episodeId: string): void {
    if (getEpisode(episodeId)) this.episodesOffered.add(episodeId);
  }

  /** Heftet eine Episode als aktiven Strang ans Korkbrett (Spur). */
  activateEpisode(episodeId: string): boolean {
    const ep = getEpisode(episodeId);
    if (!ep || this.episodesActive.has(episodeId) || this.episodesCompleted.has(episodeId)) return false;
    this.episodesOffered.add(episodeId);
    this.episodesActive.add(episodeId);
    storyLogger.log(`[Episode] aktiviert: ${ep.titel_de}`);
    return true;
  }

  /**
   * Schließt eine Episode ab: wendet `wirkt_auf` auf die Gesellschaftswerte an
   * (P4: NUR Gesellschaftswerte — balance-neutral; 'vertrauen' wird ab P5 gekoppelt)
   * und merkt den Lernmoment für den End-Report vor.
   */
  completeEpisode(episodeId: string): boolean {
    const ep = getEpisode(episodeId);
    if (!ep || this.episodesCompleted.has(episodeId)) return false;
    this.episodesActive.delete(episodeId);
    this.episodesCompleted.add(episodeId);

    const delta: SocietyDelta = {};
    for (const [key, value] of Object.entries(ep.wirkt_auf)) {
      if (typeof value !== 'number') continue;
      if (key === 'vertrauen') { this.applyTrustDelta(value); continue; }  // Etappe 1: R2 gefallen — Vertrauen koppelt
      (delta as Record<string, number>)[key] = value;
    }
    this.applySocietyDelta(delta);
    storyLogger.log(`[Episode] abgeschlossen: ${ep.titel_de} (Lernmoment: ${ep.lernmoment_id})`);
    return true;
  }

  getActiveEpisodes(): Episode[] {
    return Array.from(this.episodesActive).map(id => getEpisode(id)).filter((e): e is Episode => !!e);
  }

  // ============================================
  // ENTSCHEIDUNGS-BEATS (Spine Slice 4) — Inhalt der Spine
  // ============================================

  getResolvedDecisionBeatIds(): string[] {
    return Array.from(this.resolvedDecisionBeats);
  }

  /** Schicht 3: bisher gesäte Narrativ-Themen (reaktive Beat-Verfügbarkeit). */
  getSeededThemes(): string[] {
    return seededThemes(this.narrativeMemory);
  }

  /** Schicht 3: effektive Inokulation eines Themas JETZT (mit Verfall). */
  getInoculation(themaId: string): number {
    return inoculationOf(this.narrativeMemory, themaId, this.getCurrentPhase().number);
  }

  /**
   * Wendet die gewählte Option eines Entscheidungs-Beats an: Gesellschaftswert-Deltas
   * (über `applySocietyDelta`, 0–100-geklemmt) + Spieler-Kosten (Risiko/Aufmerksamkeit/
   * Budget/Moral). `vertrauen` wird — wie bei `completeEpisode` — NICHT an `obj_destabilize`
   * gekoppelt (R2: balance-neutral). Schicht 3: bei `inoculationScaled`-Optionen skaliert
   * die Wirkung mit der Inokulation des Beat-Themas (abnehmende Erträge), mit Rückschlag
   * bzw. seltenem Streisand-Effekt bei hoher Inokulation (`rng` injizierbar → testbar).
   * Liefert die Deltas für die UI (T1) zurück.
   */
  applyDecisionBeatOption(
    beatId: string,
    optionId: string,
    rng: () => number = Math.random,
  ): DecisionBeatResult | null {
    const beat = getDecisionBeat(beatId);
    if (!beat) return null;
    const option = getBeatOption(beat, optionId);
    if (!option) return null;

    const clamp100 = (x: number) => Math.max(0, Math.min(100, x));
    const phase = this.getCurrentPhase().number;
    const societyBefore = this.getSocietySnapshot();
    const trustBefore = this.objectives.find(o => o.id === 'obj_destabilize')?.currentValue ?? 100;
    const riskBefore = this.storyResources.risk;
    const attentionBefore = this.storyResources.attention;
    const budgetBefore = this.storyResources.budget;
    const moralBefore = this.storyResources.moralWeight;

    // Schicht 3: Inokulation des Themas VOR dem Lauf (steuert Skalierung/Rückschlag).
    const inoc = beat.themaId ? inoculationOf(this.narrativeMemory, beat.themaId, phase) : 0;
    const scaled = !!option.inoculationScaled && !!beat.themaId;
    let factor = scaled ? Math.max(0, 1 - inoc / 100) : 1; // abnehmende Erträge

    let outcomeNote = '';

    // Nebel (#5): die Wirkungs-GRÖSSE wird verdeckt gezogen — der Einsatz ist schon bezahlt.
    if (option.stochastik) {
      const { min, max } = option.stochastik;
      const draw = min + rng() * (max - min);
      factor *= draw;
      if (draw >= 1.3) outcomeNote = ' Ausgang: die Wirkung fiel groß aus — mehr als gedacht.';
      else if (draw <= 0.5) outcomeNote = ' Ausgang: ein Rohrkrepierer — der Einsatz verpuffte weitgehend.';
      else outcomeNote = ' Ausgang: die Wirkung lag im erwarteten Rahmen.';
    }

    // Gesellschaftswert-Deltas (Vertrauen ausgeklammert — R2; inokulations-/varianz-skaliert).
    const delta: SocietyDelta = {};
    const addDelta = (key: string, v: number) => {
      (delta as Record<string, number>)[key] = ((delta as Record<string, number>)[key] ?? 0) + v;
    };
    for (const [key, value] of Object.entries(option.werteDelta)) {
      if (typeof value !== 'number') continue;
      // Etappe 1: R2 gefallen — Vertrauen (obj_destabilize) koppelt jetzt an den Sieg.
      if (key === 'vertrauen') { this.applyTrustDelta(Math.round(value * factor)); continue; }
      addDelta(key, Math.round(value * factor));
    }

    // Schicht 3: Rückschlag/Streisand der Recycling-Option bei hoher Inokulation.
    let extraRisk = 0;
    if (scaled) {
      if (inoc >= 60) {
        if (rng() < 0.15) {
          // Streisand: die Widerlegung befeuert die Geschichte erst recht.
          addDelta('polarisierung', 14);
          outcomeNote = ' Paradox: Die Widerlegung befeuert die Geschichte erst recht (Streisand-Effekt).';
        } else {
          // Resilienz bremst: Diskursqualität (Resilienz) steigt, Risiko zieht an.
          addDelta('diskursqualitaet', 10);
          extraRisk = 8;
          outcomeNote = ' Rückschlag: „längst widerlegt" — die Faktenchecker waren schneller.';
        }
      } else if (inoc < 20) {
        outcomeNote = ' Wiederzündung: frisch genug, um erneut zu zünden.';
      } else {
        outcomeNote = ' Verpufft teils: das Publikum ist abgestumpft.';
      }
    }
    this.applySocietyDelta(delta);

    // Spieler-Kosten (inkl. inokulations-bedingtem Zusatzrisiko).
    const riskCost = (option.spielerKosten.risk ?? 0) + extraRisk;
    if (riskCost !== 0) this.storyResources.risk = clamp100(this.storyResources.risk + riskCost);
    if (typeof option.spielerKosten.attention === 'number') {
      this.storyResources.attention = clamp100(this.storyResources.attention + option.spielerKosten.attention);
    }
    if (typeof option.spielerKosten.budget === 'number') {
      this.storyResources.budget += option.spielerKosten.budget;
    }
    if (typeof option.spielerKosten.moralWeight === 'number') {
      this.storyResources.moralWeight = Math.max(0, this.storyResources.moralWeight + option.spielerKosten.moralWeight);
    }

    this.resolvedDecisionBeats.add(beatId);
    // Schicht 3: das Thema fortschreiben (erst NACH dem Lesen der Inokulation) → Recyceln impft.
    if (beat.themaId) this.narrativeMemory = recordThema(this.narrativeMemory, beat.themaId, phase);

    const resourceChanges: Partial<Pick<StoryResources, 'risk' | 'attention' | 'budget' | 'moralWeight'>> = {};
    if (this.storyResources.risk !== riskBefore) resourceChanges.risk = this.storyResources.risk - riskBefore;
    if (this.storyResources.attention !== attentionBefore) resourceChanges.attention = this.storyResources.attention - attentionBefore;
    if (this.storyResources.budget !== budgetBefore) resourceChanges.budget = this.storyResources.budget - budgetBefore;
    if (this.storyResources.moralWeight !== moralBefore) resourceChanges.moralWeight = this.storyResources.moralWeight - moralBefore;

    const narrative_de = option.wirkung_de + outcomeNote;

    // Sichtbarkeit im Newsroom (wie eine Welt-Reaktion auf die Entscheidung).
    this.newsEvents.unshift({
      id: `decision_${beatId}_${optionId}_${phase}`,
      phase,
      headline_de: `${beat.name_de}: ${option.label_de}`,
      headline_en: `${beat.name_de}: ${option.label_de}`,
      description_de: narrative_de,
      description_en: narrative_de,
      type: 'world_event',
      severity: 'info',
      read: false,
      pinned: false,
    });

    storyLogger.log(`[DecisionBeat] ${beatId} → ${optionId} (${option.technik_de}, inoc=${inoc})`);

    return {
      beatId,
      beatName_de: beat.name_de,
      optionId,
      optionLabel_de: option.label_de,
      technik_de: option.technik_de,
      narrative_de,
      societyChanges: this.societyChangesSince(societyBefore, trustBefore),
      resourceChanges,
    };
  }

  getCompletedEpisodes(): Episode[] {
    return Array.from(this.episodesCompleted).map(id => getEpisode(id)).filter((e): e is Episode => !!e);
  }

  /** Lernmoment-Methoden-IDs aus abgeschlossenen Episoden (für den End-Report/Atlas). */
  getEpisodeLernmomentIds(): string[] {
    return this.getCompletedEpisodes().map(e => e.lernmoment_id);
  }

  // ============================================
  // AUFTRÄGE (P5) — Vertrauen = Mittel, Auftrag = Ziel
  // ============================================

  /** Den strategischen Auftrag setzen (Default beim Einstieg, Wahl beim Neustart). */
  setAuftrag(id: AuftragId): void {
    if (AUFTRAEGE[id]) {
      this.currentAuftragId = id;
      storyLogger.log(`[Auftrag] gewählt: ${AUFTRAEGE[id].titel_de}`);
    }
  }

  getAuftragId(): AuftragId {
    return this.currentAuftragId;
  }

  getAuftrag(): Auftrag {
    return AUFTRAEGE[this.currentAuftragId];
  }

  /** Fortschritt des aktuellen Auftrags (0..1) über seine Signatur-Achsen (Vertrauen + Werte). */
  getAuftragProgress(): number {
    const s = this.getSocietySnapshot();
    const trust = this.objectives.find(o => o.id === 'obj_destabilize')?.currentValue ?? 100;
    return auftragProgress(this.getAuftrag(), { ...s, vertrauen: trust });
  }

  /** Sieg-relevanter Fortschritt (0..1): die SCHWÄCHSTE Signatur-Achse (Min-Regel, Etappe 1). */
  getAuftragProgressMin(): number {
    const s = this.getSocietySnapshot();
    const trust = this.objectives.find(o => o.id === 'obj_destabilize')?.currentValue ?? 100;
    return auftragProgress(this.getAuftrag(), { ...s, vertrauen: trust }, 'min');
  }

  /** Fortschritt je Signatur-Achse (0..1) — für die HUD-„Nadeln" und Balancing-Diagnose. */
  getAuftragAxes(): { wert: string; progress: number }[] {
    const s = this.getSocietySnapshot();
    const trust = this.objectives.find(o => o.id === 'obj_destabilize')?.currentValue ?? 100;
    const values: Record<string, number> = { ...s, vertrauen: trust };
    return this.getAuftrag().signatur.map(sig => {
      const v = values[sig.wert];
      const span = Math.abs(sig.ziel - sig.start) || 1;
      const p = sig.richtung === 'hoch' ? (v - sig.start) / span : (sig.start - v) / span;
      return { wert: sig.wert, progress: Math.max(0, Math.min(1, p)) };
    });
  }

  /** Kampagnen-Uhr: aktueller Tag, Wahltag, verbleibende Tage (Etappe 2). */
  getElectionInfo(): { day: number; electionDay: number; daysRemaining: number } {
    const day = this.storyPhase.number;
    return { day, electionDay: this.electionDay, daysRemaining: Math.max(0, this.electionDay - day) };
  }

  /**
   * Verschiebt den Wahltag (Etappe 2, Zielbild §5: Misstrauensvotum zieht vor,
   * „Nachspielzeit" der Zentrale schiebt einmalig nach hinten). Geklemmt: frühestens
   * morgen (der Wahltag kann nicht in die Vergangenheit rutschen), spätestens Tag 60.
   * Erzeugt die zugehörige News; die Phase wird neu etikettiert (Countdown-Label).
   */
  shiftElectionDay(deltaDays: number, reason_de: string, reason_en: string): number {
    const next = Math.max(this.storyPhase.number + 1, Math.min(60, this.electionDay + deltaDays));
    if (next === this.electionDay) return this.electionDay;
    this.electionDay = next;
    this.storyPhase = this.createPhase(this.storyPhase.number);
    this.newsEvents.unshift({
      id: `news_election_shift_${this.storyPhase.number}_${next}`,
      phase: this.storyPhase.number,
      headline_de: deltaDays < 0 ? 'Wahl vorgezogen!' : 'Wahltermin verschoben',
      headline_en: deltaDays < 0 ? 'Election moved up!' : 'Election postponed',
      description_de: `${reason_de} Neuer Wahltag: Tag ${next}.`,
      description_en: `${reason_en} New election day: day ${next}.`,
      type: 'world_event',
      severity: deltaDays < 0 ? 'warning' : 'info',
      read: false,
      pinned: true,
    });
    return this.electionDay;
  }

  /**
   * Wendet eine Vertrauens-Änderung auf `obj_destabilize` an (Vertrauen = currentValue, Start 100,
   * sinkt Richtung Ziel). Negativer Delta = Vertrauen erodiert = Auftrags-Fortschritt (bei Aufträgen
   * mit vertrauen↓). Seit Etappe 1 dürfen Beats/Episoden das Vertrauen bewegen (R2 gefallen).
   */
  private applyTrustDelta(d: number): void {
    if (d === 0) return;
    const obj = this.objectives.find(o => o.id === 'obj_destabilize');
    if (!obj) return;
    obj.currentValue = Math.max(0, Math.min(100, obj.currentValue + d));
    obj.progress = Math.min(100, ((100 - obj.currentValue) / (100 - obj.targetValue)) * 100);
    obj.completed = obj.currentValue <= obj.targetValue;
  }

  /** Aktueller Wert eines Umfrage-Instruments (Vertrauen aus dem Ziel, sonst Gesellschaftswert). */
  private pollValueFor(wert: string): number {
    if (wert === 'vertrauen') {
      return this.objectives.find(o => o.id === 'obj_destabilize')?.currentValue ?? 100;
    }
    const v = (this.storyResources as unknown as Record<string, number>)[wert];
    return typeof v === 'number' ? v : 0;
  }

  /** P6/F3: alle paar Phasen eine Umfrage als News emittieren (Auftrags-Instrument bevorzugt). */
  private maybeEmitPollNews(phase: number): void {
    if (phase % this.POLL_EVERY_PHASES !== 0) return;
    const leitwert = this.getAuftrag().signatur[0]?.wert ?? 'polarisierung';
    const instrument = pickPollInstrument(leitwert, this.pollIndex);
    const value = this.pollValueFor(instrument.wert);
    const content = buildPollNews(instrument, value, this.lastPollValues[instrument.id]);
    this.newsEvents.unshift({
      id: `poll_${instrument.id}_${phase}`,
      phase,
      headline_de: content.headline_de,
      headline_en: content.headline_en,
      description_de: content.description_de,
      description_en: content.description_en,
      type: 'world_event',
      severity: 'info',
      read: false,
      pinned: false,
    });
    this.lastPollValues[instrument.id] = value;
    this.pollIndex++;
  }

  /** Wendet ein Werte-Delta an und klemmt auf 0–100. obj_destabilize bleibt unberührt (R2). */
  private applySocietyDelta(delta: SocietyDelta): void {
    for (const key of Object.keys(delta) as (keyof SocietyDelta)[]) {
      const d = delta[key];
      if (typeof d !== 'number' || d === 0) continue;
      this.storyResources[key] = clampSocietyValue(this.storyResources[key] + d);
    }
  }

  // ============================================
  // IMMUNSYSTEM (Etappe 3) — die ABWEHR, der zweite Rennläufer
  // ============================================

  /** Lärm des Tages verbuchen (Zufluss a) — der nächtliche Schritt konsumiert ihn. */
  private addAbwehrNoise(risk: number, attention: number): void {
    if (risk > 0) this.noiseRiskToday += risk;
    if (attention > 0) this.noiseAttentionToday += attention;
  }

  /** ABWEHR sofort anheben (z. B. „Gepatcht"-Sprung, Verrats-Ereignis) inkl. Stufen-Check. */
  private raiseAbwehr(amount: number): void {
    if (amount <= 0) return;
    const before = this.storyResources.wehrhaftigkeit;
    this.storyResources.wehrhaftigkeit = clampAbwehr(before + amount);
    this.fireAbwehrStageEvents(before, this.storyResources.wehrhaftigkeit);
  }

  /**
   * Stufen 25/50/75: jede zündet genau EINMAL (auch wenn die Abwehr später wieder
   * darunter fällt und erneut steigt — sonst würde dieselbe Eskalation doppelt erzählt).
   * Erzeugt die TV-Nachricht und stellt die Stufe in die Gegenmaßnahmen-Queue (Paket B).
   */
  private fireAbwehrStageEvents(before: number, after: number): void {
    for (const stage of crossedAbwehrStages(before, after)) {
      if (this.firedAbwehrStages.has(stage)) continue;
      this.firedAbwehrStages.add(stage);
      this.pendingAbwehrStages.push(stage);

      const texts: Record<AbwehrStage, { h_de: string; h_en: string; d_de: string; d_en: string }> = {
        25: {
          h_de: 'Das Land beginnt hinzusehen',
          h_en: 'The country starts paying attention',
          d_de: 'Faktenchecker vergleichen Notizen, erste Behörden stellen Fragen. Die Abwehr der Westunion hat Stufe 25 erreicht.',
          d_en: 'Fact-checkers compare notes, first agencies ask questions. Westunion\'s defense has reached level 25.',
        },
        50: {
          h_de: 'Die Abwehr organisiert sich',
          h_en: 'The defense organizes',
          d_de: 'Redaktionen, Plattformen und Behörden arbeiten jetzt zusammen. Die Abwehr steht bei 50 — die Hälfte des Weges zur Immunität.',
          d_en: 'Newsrooms, platforms and agencies now work together. The defense stands at 50 — halfway to immunity.',
        },
        75: {
          h_de: 'Das Netz zieht sich zu',
          h_en: 'The net is closing',
          d_de: 'Das Land kennt Ihre Handschrift. Abwehr bei 75 — erreicht sie 100, ist die Operation wirkungslos und fliegt auf.',
          d_en: 'The country knows your signature. Defense at 75 — at 100 the operation is inert and exposed.',
        },
      };
      const t = texts[stage];
      this.newsEvents.unshift({
        id: `abwehr_stage_${stage}`,
        phase: this.storyPhase.number,
        headline_de: t.h_de,
        headline_en: t.h_en,
        description_de: t.d_de,
        description_en: t.d_en,
        type: 'world_event',
        severity: stage >= 75 ? 'danger' : 'warning',
        read: false,
        pinned: true,
      });
      playSound('countermeasure');
      storyLogger.log(`[ImmuneSystem] ABWEHR-Stufe ${stage} erreicht (${before.toFixed(1)} → ${after.toFixed(1)})`);
    }
  }

  /**
   * Zufluss c — Maschen-Wiederholung, seit Etappe 4 übers Maschen-Gedächtnis:
   * Der Einsatz wird je Ziel-Milieu fortgeschrieben (Abstumpfung 1,0→0,6→0,3),
   * und die n-te Wiederholung derselben Familie wird durchschaut („Gepatcht"):
   * Abwehr-Sprung + TV-Nachricht + die Familie gilt ÜBERALL als bekannt —
   * EIN System statt der alten globalen Zählung (HANDOFF Falle 6).
   */
  private registerMethodFamilyUse(tags: string[]): void {
    const family = methodFamilyForTags(tags, this.methodFamilies);
    if (!family) return;
    const ziele = zielMilieusFuerTags(tags, this.audienceSegments);
    // Abnutzung NUR in den resonanten Milieus (Zielbild §7: „Milieu wechseln" bleibt
    // ein echter Ausweg) — die Vorschau/Dämpfung mittelt trotzdem über alle Ziele.
    const brennende = brennendeMilieus(ziele).map((z) => z.id);
    const { state, einsatzNr } = registriereEinsatz(
      this.maschenGedaechtnis,
      family.id,
      brennende,
      this.storyPhase.number,
    );
    this.maschenGedaechtnis = state;
    this.letzterFamilienEinsatz = { familieId: family.id, milieuIds: brennende };
    if (!isPatchTriggered(einsatzNr)) return;

    this.patchedFamilies.add(family.id);
    // Patch-Folge: die Gesellschaft kennt das Muster jetzt flächendeckend — die
    // Familie stempelt fortan in ALLEN Milieus mindestens BEKANNT.
    this.maschenGedaechtnis = markiereFamilieBekannt(
      this.maschenGedaechtnis,
      family.id,
      this.audienceSegments.map((s) => s.id),
      this.storyPhase.number,
    );
    const counterHint = this.methodFamilies.find((m) => m.id === family.id)?.counter_de;
    this.newsEvents.unshift({
      id: `abwehr_patch_${family.id}_${einsatzNr}`,
      phase: this.storyPhase.number,
      headline_de: `Masche durchschaut: ${family.label_de}`,
      headline_en: `Pattern patched: ${family.label_de}`,
      description_de: `Die ${einsatzNr}. Wiederholung blieb nicht unbemerkt — Redaktionen kennen das Muster jetzt.${counterHint ? ` ${counterHint}` : ''}`,
      description_en: `Repetition number ${einsatzNr} did not go unnoticed — newsrooms now know the pattern.`,
      type: 'world_event',
      severity: 'warning',
      read: false,
      pinned: false,
    });
    this.raiseAbwehr(PATCH_ABWEHR_JUMP);
    storyLogger.log(`[ImmuneSystem] Gepatcht: ${family.id} (Einsatz ${einsatzNr}) → Abwehr +${PATCH_ABWEHR_JUMP}`);
  }

  // ── Etappe 4: Maschen-Gedächtnis — Dämpfung, Quittung, UI-Verträge ────────────────

  /**
   * Dämpfung einer Aktion aus dem Maschen-Gedächtnis: Familie aus den Tags,
   * Ziel-Milieus aus Kanal/Themen, Multiplikator reichweiten-gewichtet über die
   * Ziele. Null, wenn die Aktion keiner Maschen-Familie zuzuordnen ist.
   */
  private berechneMaschenDaempfung(tags: string[]): {
    familieId: string;
    familieLabel: string;
    ziele: ZielMilieu[];
    multiplikator: number;
    erklaerung: DaempfungsErklaerung | null;
  } | null {
    const family = methodFamilyForTags(tags, this.methodFamilies);
    if (!family) return null;
    const ziele = zielMilieusFuerTags(tags, this.audienceSegments);
    if (ziele.length === 0) return null;
    const phase = this.storyPhase.number;
    const multiplikator = gewichteterMultiplikator(this.maschenGedaechtnis, family.id, ziele, phase);
    return {
      familieId: family.id,
      familieLabel: family.label_de,
      ziele,
      multiplikator,
      erklaerung: multiplikator < 1
        ? erklaereDaempfung(this.maschenGedaechtnis, family.id, ziele, phase)
        : null,
    };
  }

  /** Quittungs-Text (E5, kühl): Ursache + Tag + Gegenmaßnahme — nie eine Zahl der Matrix. */
  private maschenQuittungText(d: NonNullable<typeof this.lastMaschenDaempfung>): string {
    const stufe = d.multiplikator <= 0.4 ? 'Wirkung: verpufft.' : 'Wirkung: gering.';
    const grund = d.erklaerung;
    if (!grund) return stufe;
    const quelle =
      grund.grund === 'prebunking'
        ? `Prebunking-Kampagne der Landeszentrale, Tag ${grund.tag}`
        : grund.grund === 'faktencheck'
          ? `Faktencheck (${grund.milieuLabel}), Tag ${grund.tag}`
          : `„${d.familieLabel}" zum wiederholten Mal (${grund.milieuLabel}), zuletzt Tag ${grund.tag}`;
    return `${stufe} Grund: Masche bekannt — ${quelle}.`;
  }

  /**
   * Karten-Vorschau (E7): FRISCH/BEKANNT/VERBRANNT je Ziel-Milieu VOR dem Ausgeben —
   * man versenkt nie Ressourcen in Verpufftes. Null, wenn die Aktion keine Masche ist.
   */
  getMaschenVorschau(actionId: string): {
    familieId: string;
    familieLabel: string;
    stempel: Array<{ milieuId: string; milieuLabel: string; stempel: MaschenStempel }>;
    multiplikator: number;
  } | null {
    const loaded = this.actionLoader.getAction(actionId);
    if (!loaded) return null;
    const d = this.berechneMaschenDaempfung(loaded.tags ?? []);
    if (!d) return null;
    const phase = this.storyPhase.number;
    return {
      familieId: d.familieId,
      familieLabel: d.familieLabel,
      // Die 3 gewichtigsten Ziel-Milieus (Chips auf der Karte, Zielbild §6).
      stempel: d.ziele.slice(0, 3).map((z) => ({
        milieuId: z.id,
        milieuLabel: z.label_de,
        stempel: stempelFuer(this.maschenGedaechtnis, z.id, d.familieId, phase),
      })),
      multiplikator: d.multiplikator,
    };
  }

  /**
   * Wohnzimmer-Alphabet (Zielbild §6), Gedächtnis-Anteil: je Milieu das Bild aus dem
   * Maschen-Zustand — „Faktencheck-Zeitung auf dem Tisch" (geimpft) schlägt „Abwinken
   * vor dem TV" (Masche bekannt/abgestumpft). Stimmungs-Bilder (Küchen-Streit,
   * einsam am Videospiel) speist die Broadcast-Schicht aus Publikums-Stimmung/Werten.
   */
  getWohnzimmerAlphabet(): Array<{ milieuId: string; bild: 'zeitung' | 'abwinken' | null; grund_de: string }> {
    const phase = this.storyPhase.number;
    return this.audienceSegments.map((seg) => {
      let geimpft = false;
      let abgestumpft = false;
      for (const fam of this.methodFamilies) {
        const key = zellKey(seg.id, fam.id);
        if (this.maschenGedaechtnis.prebunk[key] || this.maschenGedaechtnis.factcheck[key]) {
          if (effektiveImpfung(this.maschenGedaechtnis, seg.id, fam.id, phase) >= 0.15) geimpft = true;
        }
        if (this.maschenGedaechtnis.abstumpfung[key]) {
          // Dieselbe Schwelle wie der VERBRANNT-Stempel — Karte und Wohnzimmer
          // erzählen denselben Zustand (Review-Befund 3).
          if (effektiveAbstumpfung(this.maschenGedaechtnis, seg.id, fam.id, phase) >= WEAR_VERBRANNT_AB) abgestumpft = true;
        }
        if (geimpft) break;
      }
      if (geimpft) {
        return { milieuId: seg.id, bild: 'zeitung' as const, grund_de: 'Prebunking hat gewirkt — hier liest man Faktenchecks.' };
      }
      if (abgestumpft) {
        return { milieuId: seg.id, bild: 'abwinken' as const, grund_de: 'Masche bekannt — hier winkt man ab.' };
      }
      return { milieuId: seg.id, bild: null, grund_de: '' };
    });
  }

  /** Aktueller ABWEHR-Stand 0–100 (= befördertes `wehrhaftigkeit`). */
  getAbwehr(): number {
    return this.storyResources.wehrhaftigkeit;
  }

  /** Ermittler-Countdown (Restphasen) oder null — für die SITUATIVE HUD-Warnung (Zielbild §12.4). */
  getExposureCountdown(): number | null {
    return this.exposureCountdown;
  }

  /** Sieg-Schwelle (0..1) der Min-Regel — für die Sieglinie im Endreport-Rennen-Chart. */
  getWinThreshold(): number {
    return this.WIN_THRESHOLD;
  }

  /** Stufen-Info fürs HUD: Marken + bereits gezündete Stufen. */
  getAbwehrStageInfo(): { stages: readonly number[]; fired: number[] } {
    return { stages: ABWEHR_STAGES, fired: Array.from(this.firedAbwehrStages).sort((a, b) => a - b) };
  }

  /** Bilanz der letzten Nacht (Tagesfazit: „Über Nacht holen die Institutionen X zurück"). */
  getNightReport(): NightReport | null {
    return this.lastNightReport;
  }

  /** Durchschaute („gepatchte") Maschen-Familien — für Stempel/End-Report. */
  getPatchedFamilies(): string[] {
    return Array.from(this.patchedFamilies);
  }

  /** Nächste Abwehr-Stufe, deren Gegenmaßnahme aussteht (Paket B konsumiert). */
  consumePendingAbwehrStage(): AbwehrStage | null {
    return this.pendingAbwehrStages.shift() ?? null;
  }

  /** Ausstehende Stufen (read-only, für UI-Hinweise). */
  getPendingAbwehrStages(): AbwehrStage[] {
    return [...this.pendingAbwehrStages];
  }

  /**
   * Nacht-VORSCHAU fürs Tagesfazit: Das Tagesfazit erscheint VOR endPhase — es soll
   * die KOMMENDE Nacht ausweisen („Über Nacht holen die Institutionen X zurück").
   * Deterministisch aus dem aktuellen Zustand berechnet, mutiert nichts. Kleiner,
   * bewusster Unschärfe-Rand: Verteidiger, die erst heute Nacht spawnen, fehlen hier.
   */
  getNightPreview(): NightReport {
    const step = abwehrStep({
      current: this.storyResources.wehrhaftigkeit,
      noiseRisk: this.noiseRiskToday,
      noiseAttention: this.noiseAttentionToday,
      defenderStrengthSum: this.actorAI.getDefenderStrengthSum(),
      armsRaceLevel: this.actorAI.getArmsRaceLevel(),
    });
    return {
      day: this.storyPhase.number,
      trustRegeneration: this.actorAI.getTrustRegeneration(),
      abwehrDelta: step.delta,
      abwehrParts: step.parts,
      abwehrAfter: step.next,
    };
  }

  // ── Etappe 5: Geld-Tranchen (E18, Zielbild §11) ──────────────────────────────────
  /**
   * Zahlt an den Tranchen-Tagen (5/10/15/…) nach Fortschritt: bewertet die Lieferung
   * seit der letzten Tranche, wendet die Auszahlung (oder Kürzung) aufs Budget an,
   * fortschreibt Mahnstufe + Bezugspunkt und legt bei Bonus/Mahnung eine News an.
   */
  private applyTranche(day: number): void {
    if (!istTrancheTag(day)) return;
    const progressNow = this.getAuftragProgress();
    const result = bewerteTranche({
      day,
      progressNow,
      progressAtLastTranche: this.lastTrancheProgress,
      mahnstufe: this.mahnstufe,
    });
    this.storyResources.budget += result.auszahlung;
    this.mahnstufe = result.neueMahnstufe;
    this.lastTrancheProgress = progressNow;
    this.lastTrancheDay = day;
    this.lastTranche = result;
    // Bonus/Mahnung tragen eine Schlagzeile in den Feed (der Kurator meldet sich).
    if (result.headline_de) {
      const bedrohlich = result.bewertung === 'mahnung2' || result.bewertung === 'kuerzung';
      this.newsEvents.unshift({
        id: `news_tranche_${day}`,
        phase: day,
        headline_de: result.headline_de,
        headline_en: result.headline_en,
        description_de: result.text_de,
        description_en: result.text_en,
        type: 'world_event',
        severity: bedrohlich ? 'danger' : result.bewertung === 'mahnung1' ? 'warning' : 'info',
        read: false,
        pinned: bedrohlich,
      });
    }
  }

  /**
   * Tagesfazit-VORSCHAU der Tranche: Kommt in der nächsten Nacht (Tag+1) eine Tranche,
   * liefert dies die projizierte Bilanz — sonst null. Deterministisch, mutiert nichts;
   * deckt sich mit applyTranche, weil beide vor der Gesellschafts-Drift bemessen.
   */
  getTranchePreview(): TrancheResult | null {
    const comingDay = this.storyPhase.number + 1;
    if (!istTrancheTag(comingDay)) return null;
    return bewerteTranche({
      day: comingDay,
      progressNow: this.getAuftragProgress(),
      progressAtLastTranche: this.lastTrancheProgress,
      mahnstufe: this.mahnstufe,
    });
  }

  /** Bilanz der zuletzt gezahlten Tranche (für den End-Report / Debug). */
  getLastTranche(): TrancheResult | null {
    return this.lastTranche;
  }

  /** Aktuelle Mahnstufe der Zentrale (0 = im Soll) — für UI-Hinweise. */
  getMahnstufe(): number {
    return this.mahnstufe;
  }

  /** Läufer-Historie (Tag · Sonntagsfrage-Fortschritt 0..1 · ABWEHR 0..100) fürs Endreport. */
  getLaeuferHistorie(): { day: number; fortschritt: number; abwehr: number }[] {
    return [...this.laeuferHistorie];
  }

  /** Fiktiver Parteiname (Zielbild §8/D2) — EIN Name statt der früheren vier. */
  static readonly PARTEI_NAME_DE = PARTEI_NAME_DE;

  /**
   * Daten für die Wahlabend-Szene (Zielbild §9): die Sonntagsfrage als Umfragewert der
   * radikalen Partei, diegetisches Gesicht von `auftragProgress` (§3, illustrativ 9→27 %).
   * Der Balken kippt über die Machtwechsel-Schwelle genau dann, wenn der Auftrag erfüllt ist
   * (Schwelle = WIN_THRESHOLD in derselben 9+p·18-Abbildung → Sieg zeigt den Balken über der Linie).
   */
  getWahlabendData(): { startPollPct: number; finalPollPct: number; thresholdPct: number; partyName: string } {
    const SF_START = 9;
    const SF_SPAN = 18;
    return {
      startPollPct: SF_START,
      finalPollPct: SF_START + this.getAuftragProgressMin() * SF_SPAN,
      thresholdPct: SF_START + this.WIN_THRESHOLD * SF_SPAN,
      partyName: StoryEngineAdapter.PARTEI_NAME_DE,
    };
  }

  /**
   * „Nachspielzeit" der Zentrale (Zielbild §5b): einmalig +5 Tage — gegen Budgetkürzung
   * und höhere Zielmarke. Liefert true, wenn gewährt (danach gesperrt).
   */
  requestNachspielzeit(): boolean {
    if (this.nachspielzeitGenutzt) return false;
    this.nachspielzeitGenutzt = true;
    this.storyResources.budget = Math.max(0, this.storyResources.budget - 20);
    this.shiftElectionDay(
      5,
      'Die Zentrale gewährt einmalig Nachspielzeit — gegen einen Abschlag und eine höhere Zielmarke.',
      'The Central grants a one-time extension — at a cost and a higher bar.',
    );
    return true;
  }

  /** Ob die einmalige Nachspielzeit bereits verbraucht ist. */
  istNachspielzeitGenutzt(): boolean {
    return this.nachspielzeitGenutzt;
  }

  // ── Paket B: Stufen-Gegenmaßnahmen (CountermeasureSystem eingesteckt) ────────────
  // An den Stufen 25/50/75 feuert je EINE kuratierte DISARM-Maßnahme (Zielbild §3):
  // Prebunking-Kampagne (cm24) · Plattform-Sperre (cm05) · Task-Force (cm22).
  // Der Spieler reagiert mit 2–3 vereinheitlichten Optionen: kontern (Geld, dämpft
  // die Maßnahme) / aussitzen (füttert die Abwehr) / ablenken (Risiko).
  // Typen dafür: StageCountermeasureOffer/-Resolution (unten bei den Exporten).

  private readonly STAGE_COUNTERMEASURES: Record<AbwehrStage, string> = {
    25: 'cm24',  // Prebunking-Kampagne — impft das Publikum, stärkt das Vertrauen
    50: 'cm05',  // Plattform-Maßnahmen — „Kanal gesperrt", Aktion X Tage grau
    75: 'cm22',  // Internationale Untersuchungskoalition — die Task-Force
  };
  private readonly COUNTER_COST_BUDGET = 25;   // kontern kostet Geld (E18: Geld = Druck)
  private readonly SIT_OUT_ABWEHR = 4;         // aussitzen füttert die Abwehr
  private readonly DISTRACT_RISK = 6;          // ablenken erkauft Ruhe mit Risiko
  private readonly DISTRACT_ATTENTION_RELIEF = 4;
  private readonly BAN_DAYS = 4;               // Plattform-Sperre: Kanal X Tage grau
  private readonly TASKFORCE_COUNTDOWN_START = 8;
  private readonly TASKFORCE_COUNTDOWN_CUT = 3;

  /**
   * Die anstehende Stufen-Gegenmaßnahme für die UI (oder null). Peek — konsumiert
   * erst resolveStageCountermeasure. Optionen mit Verfügbarkeits-Flag (kontern
   * braucht Budget).
   */
  getPendingStageCountermeasure(): StageCountermeasureOffer | null {
    const stage = this.pendingAbwehrStages[0];
    if (!stage) return null;
    const definition = this.countermeasureSystem.getCountermeasure(this.STAGE_COUNTERMEASURES[stage]);
    if (!definition) return null;
    return {
      stage,
      definition,
      options: [
        {
          id: 'kontern',
          label_de: 'Kontern',
          folge_de: `Budget −${this.COUNTER_COST_BUDGET} · die Maßnahme wird abgeschwächt`,
          available: this.storyResources.budget >= this.COUNTER_COST_BUDGET,
        },
        {
          id: 'aussitzen',
          label_de: 'Aussitzen',
          folge_de: `Keine Kosten · die Abwehr wächst um +${this.SIT_OUT_ABWEHR}`,
          available: true,
        },
        {
          id: 'ablenken',
          label_de: 'Ablenken',
          folge_de: `Risiko +${this.DISTRACT_RISK} · Aufmerksamkeit −${this.DISTRACT_ATTENTION_RELIEF}`,
          available: true,
        },
      ],
    };
  }

  /**
   * Stufen-Gegenmaßnahme auflösen: Basis-Zähne der Maßnahme + Folge der gewählten
   * Reaktion. Kontern dämpft die Zähne (halbe Wirkung), aussitzen füttert die
   * Abwehr, ablenken tauscht Aufmerksamkeit gegen Risiko. Liefert die Bilanz-Zeilen
   * für die UI (kühle Quittung, E8).
   */
  resolveStageCountermeasure(choice: StageCountermeasureChoice): StageCountermeasureResolution | null {
    const stage = this.pendingAbwehrStages.shift();
    if (!stage) return null;
    // Härtung (Review-Befund): kontern setzt Budget voraus — die UI graut die Option
    // zwar aus, aber ein künftiger zweiter Aufrufer darf die Kasse nicht negativ ziehen.
    if (choice === 'kontern' && this.storyResources.budget < this.COUNTER_COST_BUDGET) {
      choice = 'aussitzen';
    }
    const cmId = this.STAGE_COUNTERMEASURES[stage];
    // Im CountermeasureSystem registrieren (Save/Bilanz) — Definition für die Texte.
    const definition = this.countermeasureSystem.triggerById(cmId, this.storyPhase.number)
      ?? this.countermeasureSystem.getCountermeasure(cmId);
    const label = definition?.label_de ?? `Gegenmaßnahme Stufe ${stage}`;
    const lines: string[] = [];
    const countered = choice === 'kontern';

    // Reaktions-Folgen zuerst (sie erklären die Dämpfung der Zähne).
    if (countered) {
      this.storyResources.budget -= this.COUNTER_COST_BUDGET;
      lines.push(`Gegenkampagne bezahlt: Budget −${this.COUNTER_COST_BUDGET}.`);
    } else if (choice === 'aussitzen') {
      this.raiseAbwehr(this.SIT_OUT_ABWEHR);
      lines.push(`Nichts unternommen — die Maßnahme wirkt ungestört: Abwehr +${this.SIT_OUT_ABWEHR}.`);
    } else {
      this.storyResources.risk = Math.min(100, this.storyResources.risk + this.DISTRACT_RISK);
      this.storyResources.attention = Math.max(0, this.storyResources.attention - this.DISTRACT_ATTENTION_RELIEF);
      lines.push(`Ablenkungsmanöver: Aufmerksamkeit −${this.DISTRACT_ATTENTION_RELIEF}, Risiko +${this.DISTRACT_RISK}.`);
    }

    // Basis-Zähne je Stufe (kontern halbiert).
    if (stage === 25) {
      // Etappe 4 (Paket C): Prebunking IMPFT statt Vertrauens-Regen — große, langsam
      // zerfallende Familien-Immunität auf die meistgenutzten Maschen, aber NUR über
      // die klassischen Kanäle (tv/print): medienferne Milieus bleiben die Lücke —
      // der Spieler entdeckt selbst, wohin Aufklärung nicht durchdringt (Zielbild §7).
      const staerke = countered ? PREBUNK_STRENGTH * 0.5 : PREBUNK_STRENGTH;
      const familien = Object.entries(this.maschenGedaechtnis.familienEinsaetze)
        .filter(([, n]) => n > 0)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([famId]) => famId);
      const erreichte = this.audienceSegments
        .filter((s) => s.reachedBy.includes('tv') || s.reachedBy.includes('print'))
        .map((s) => s.id);
      if (familien.length > 0) {
        for (const famId of familien) {
          this.maschenGedaechtnis = impfePrebunking(
            this.maschenGedaechtnis, famId, erreichte, this.storyPhase.number, staerke,
          );
        }
        const labels = familien
          .map((f) => this.methodFamilies.find((m) => m.id === f)?.label_de ?? f)
          .map((l) => `„${l}"`)
          .join(', ');
        lines.push(`Prebunking wirkt: ${labels} ${familien.length > 1 ? 'gelten' : 'gilt'} in den erreichten Resonanzgruppen als durchschaut${countered ? ' (abgeschwächt)' : ''}.`);
        lines.push('Nur wer klassische Medien meidet, bleibt unerreicht.');
        storyLogger.log(`[MaschenGedaechtnis] Prebunking (cm24): ${familien.join(', ')} → ${erreichte.length} Milieus geimpft (Stärke ${staerke})`);
      } else {
        // Noch kein Muster im Umlauf — die Kampagne läuft ins Leere (kleiner Vertrauens-Rest).
        const regain = countered ? 1 : 2;
        this.applyInstitutionalTrustDelta(regain);
        lines.push(`Prebunking läuft ins Leere — noch kein Muster im Umlauf. Institutionen-Vertrauen +${regain}.`);
      }
    } else if (stage === 50) {
      // Plattform-Sperre: der meistgenutzte jüngste Kanal wird still gelegt.
      const banDays = countered ? Math.ceil(this.BAN_DAYS / 2) : this.BAN_DAYS;
      const lastRealAction = [...this.actionHistory].reverse()
        .find((h) => !h.actionId.startsWith('op_'))?.actionId;
      if (lastRealAction) {
        this.actorAI.disableAction(lastRealAction, this.storyPhase.number + banDays);
        const label_de = this.getActionById(lastRealAction)?.label_de ?? lastRealAction;
        lines.push(`Kanal gesperrt: „${label_de}" für ${banDays} Tage nicht verfügbar.`);
        this.newsEvents.unshift({
          id: `abwehr_ban_${lastRealAction}_${this.storyPhase.number}`,
          phase: this.storyPhase.number,
          headline_de: 'Plattform setzt Sperren durch',
          headline_en: 'Platform enforces bans',
          description_de: `Koordinierte unechte Aktivitäten eingeschränkt — ein Kanal ist ${banDays} Tage still.`,
          description_en: `Coordinated inauthentic behavior restricted — one channel is silent for ${banDays} days.`,
          type: 'world_event',
          severity: 'warning',
          read: false,
          pinned: false,
        });
      } else {
        lines.push('Plattform-Sperren greifen — noch gibt es keinen Kanal, den es trifft.');
      }
    } else {
      // Task-Force: der Ermittler-Countdown beschleunigt (oder beginnt).
      const risk = countered ? 2 : 5;
      this.storyResources.risk = Math.min(100, this.storyResources.risk + risk);
      if (this.exposureCountdown === null) {
        this.exposureCountdown = countered
          ? this.TASKFORCE_COUNTDOWN_START + 2
          : this.TASKFORCE_COUNTDOWN_START;
        lines.push(`Die Task-Force nimmt die Ermittlung auf: Countdown ${this.exposureCountdown} Tage · Risiko +${risk}.`);
      } else {
        const cut = countered ? 1 : this.TASKFORCE_COUNTDOWN_CUT;
        this.exposureCountdown = Math.max(1, this.exposureCountdown - cut);
        lines.push(`Die Task-Force beschleunigt die Ermittlung: Countdown −${cut} (jetzt ${this.exposureCountdown}) · Risiko +${risk}.`);
      }
    }

    storyLogger.log(`[ImmuneSystem] Stufe ${stage}: ${label} — Reaktion „${choice}"`);
    return { stage, label_de: label, lines_de: lines };
  }

  /** Bilanz der bisherigen P2-Operationen (End-Report/Atlas). */
  getOperationsSummary(): OperationsSummary {
    let carriersBurned = 0;
    for (const c of loadCarriers()) if (this.getCarrierState(c.id) === 'verbrannt') carriersBurned++;
    return {
      operationsPlayed: this.operationsPlayed,
      carriersUsed: Array.from(this.carriersUsed),
      platformsUsed: Array.from(this.platformsUsed),
      kompromatAcquired: this.acquiredKompromat.size,
      carriersBurned,
    };
  }

  /**
   * Vollständiger Aktions-Katalog (id→Tags/Legalität) — für End-Report (Legalitäts-
   * Bilanz + Methoden-Atlas), auch für bereits gespielte/nicht mehr verfügbare Aktionen.
   */
  getActionCatalog(): Array<{ id: string; label: string; legality: 'legal' | 'grey' | 'illegal'; phase: string; tags: string[] }> {
    return this.actionLoader.getAllActions().map((a) => ({
      id: a.id,
      label: a.label_de,
      legality: a.legality,
      phase: a.phase,
      tags: a.tags ?? [],
    }));
  }

  /** Verbreiter-Zustand (Default verfügbar = bekannt, aber noch nicht aufgebaut). */
  getCarrierState(carrierId: string): CarrierState {
    return this.carrierStates.get(carrierId) ?? 'verfügbar';
  }
  getCarrierStates(): Record<string, CarrierState> {
    const out: Record<string, CarrierState> = {};
    for (const c of loadCarriers()) out[c.id] = this.getCarrierState(c.id);
    return out;
  }

  /** Verbreiter aufbauen: kostet buildCost (Budget+Kapazität), dann „aktiv". */
  buildCarrier(carrierId: string): { ok: boolean; reason?: string } {
    const carrier = loadCarriers().find((c) => c.id === carrierId);
    if (!carrier) return { ok: false, reason: 'Verbreiter unbekannt' };
    const state = this.getCarrierState(carrierId);
    if (state === 'aktiv') return { ok: true };
    if (state === 'verbrannt') return { ok: false, reason: 'Verbreiter verbrannt' };
    const { budget, capacity } = carrier.buildCost;
    if (this.storyResources.budget < budget) return { ok: false, reason: `Budget zu gering (${budget}k)` };
    if (this.storyResources.capacity < capacity) return { ok: false, reason: `Kapazität zu gering (${capacity})` };
    this.storyResources.budget -= budget;
    this.storyResources.capacity -= capacity;
    this.carrierStates.set(carrierId, 'aktiv');
    return { ok: true };
  }

  isKompromatAcquired(targetId: string, vulnId: string): boolean {
    return this.acquiredKompromat.has(this.kompromatKey(targetId, vulnId));
  }
  kompromatCostFor(targetId: string, vulnId: string): number | null {
    const vuln = findVulnerability(findTargetById(targetId), vulnId);
    return vuln ? kompromatCost(vuln) : null;
  }

  /** Kompromat beschaffen (Dossier→Kompromat): kostet Budget ~ Heikelheit, hebt Risiko. */
  acquireKompromat(targetId: string, vulnId: string): { ok: boolean; reason?: string } {
    if (this.isKompromatAcquired(targetId, vulnId)) return { ok: true };
    const vuln = findVulnerability(findTargetById(targetId), vulnId);
    if (!vuln) return { ok: false, reason: 'Schwäche unbekannt' };
    const cost = kompromatCost(vuln);
    if (this.storyResources.budget < cost) return { ok: false, reason: `Budget zu gering (${cost}k)` };
    this.storyResources.budget -= cost;
    // Beschaffung heiklen Materials zieht selbst etwas Aufmerksamkeit/Risiko nach sich.
    this.storyResources.risk = Math.max(0, Math.min(100, this.storyResources.risk + Math.round(vuln.heikelheit * 4)));
    // „Loop schließen": Heikelheit ↔ moralische Last ↔ Enden. Je brisanter das
    // Material, desto schwerer wiegt seine Beschaffung (feedet pyrrhic/redemption).
    this.storyResources.moralWeight += Math.round(vuln.heikelheit * this.KOMPROMAT_MORAL);
    this.acquiredKompromat.add(this.kompromatKey(targetId, vulnId));
    return { ok: true };
  }

  playOperation(params: OperationParams): OperationOutcome {
    const resolved = resolveOperationParams(params);
    if (!isOperationComplete(resolved)) {
      return { success: false, reason: 'Operation unvollständig', params, result: null, broadcastResult: null };
    }

    // Ökonomie-Gate: Verbreiter muss aufgebaut, Kompromat beschafft sein.
    const carrierState = this.getCarrierState(resolved.carrier!.id);
    if (carrierState === 'verbrannt') {
      return { success: false, reason: `Verbreiter „${resolved.carrier!.label_de}" ist verbrannt`, params, result: null, broadcastResult: null };
    }
    if (carrierState !== 'aktiv') {
      return { success: false, reason: `Verbreiter „${resolved.carrier!.label_de}" noch nicht aufgebaut`, params, result: null, broadcastResult: null };
    }
    if (!this.isKompromatAcquired(resolved.target!.id, resolved.vulnerability!.id)) {
      return { success: false, reason: `Kompromat „${resolved.vulnerability!.label_de}" noch nicht beschafft`, params, result: null, broadcastResult: null };
    }

    const result = evaluateOperationParams(params, {
      factcheckPressure: this.storyResources.attention / 100,
      saturation: this.storyResources.risk / 100,
    });
    if (!result) {
      return { success: false, reason: 'Operation unvollständig', params, result: null, broadcastResult: null };
    }

    // ── Baustein 3 („Zähne"): Kampagne auf geschönter Wunsch-Stichprobe gebaut? ──────
    // Die Analyse hatte gewarnt (biasWarned) — die echte Zielgruppe reagiert schwächer
    // als die Fokusgruppen-Prognose. Deterministisch: die Vertrauens-Erosion wird gedämpft,
    // dazu ein sichtbarer öffentlicher Fehlschlag (siehe unten). Ohne Warnung: voller Effekt.
    const biasBackfire = Boolean(params.analysis?.biasWarned);
    const opEffectFactor = biasBackfire ? this.OP_BIAS_EFFECT_FACTOR : 1;

    // Moderater Lage-Effekt: Enttarnungs-Risiko hebt das Entdeckungsrisiko, Wirkung
    // erzeugt Gegner-Aufmerksamkeit. Beides geklammert in 0..100.
    const clamp100 = (x: number) => Math.max(0, Math.min(100, x));
    const riskAdd = Math.round(result.exposureRisk * 8);
    const attentionAdd = Math.round(result.impact * 6);
    // Etappe 3 (Paket E): konsistent mit Aktionen — der rohe Enttarnungs-Melder bekommt
    // nur den gedämpften Anteil (RISK_COST_TO_METER), damit op-lastiges Spiel nicht
    // DOPPELT (Risiko + Abwehr) bestraft wird. Der volle Lärm speist die Abwehr.
    this.storyResources.risk = clamp100(this.storyResources.risk + riskAdd * this.RISK_COST_TO_METER);
    this.storyResources.attention = clamp100(this.storyResources.attention + attentionAdd);
    // Auch Operationen sind Lärm — sie füttern die ABWEHR (Zufluss a). Bewusst STARK
    // gedämpft: die Abwehr ist primär gegen Aktions-Spam; Operationen tragen ihre eigene
    // Strafe (Verbreiter-Verbrennen + Enttarnungs-Spike bei Aufdeckung), sonst wäre
    // op-fokussiertes Spiel dreifach bestraft (Risiko + Burn + Abwehr) und chancenlos.
    this.addAbwehrNoise(riskAdd * 0.15, attentionAdd * 0.15);

    // ── „Loop schließen" (1/2): der ERTRAG einer gelungenen Operation ──────────────
    // Wirkung gegen das Ziel erodiert das Institutionen-Vertrauen (das Sieg-Ziel) —
    // erst dadurch lohnt sich der Aufwand (Verbreiter aufbauen + Kompromat) überhaupt.
    // opEffectFactor < 1 dämpft die Erosion, wenn die Kampagne auf einer Wunsch-Stichprobe ruht.
    let trustDelta = -(result.impact * this.OP_TRUST_EROSION * opEffectFactor);
    this.applyInstitutionalTrustDelta(trustDelta);

    // Etappe 3 (Paket E): Eine gelungene Operation mobilisiert zusätzlich die uns-nahe
    // (radikale) Kraft — das Schlachtfeld ist auch Wahlkampf. Treibt die zweite
    // Signatur-Achse (fraktionsstaerke), damit op-fokussiertes Spiel die Wahl-Signatur
    // im Rennen gegen die Abwehr erreichen kann (nicht nur die Vertrauens-Achse maxt).
    this.applySocietyDelta({ fraktionsstaerke: result.impact * this.OP_FRAKTION_MOBILIZE });

    // Ausspielen heiklen Kompromats wiegt moralisch (zusätzlich zur Beschaffung).
    let moralAdded = Math.round(resolved.vulnerability!.heikelheit * this.OP_DEPLOY_MORAL);
    this.storyResources.moralWeight += moralAdded;

    // Bilanz fortschreiben (End-Report/Methoden-Atlas).
    this.operationsPlayed++;
    this.carriersUsed.add(resolved.carrier!.id);
    for (const p of resolved.platforms) this.platformsUsed.add(p.id);

    // Synthetische StoryAction → der Broadcast-Streifen liest nur tags/headline_de/costs.
    const synthAction: StoryAction = {
      id: `op_${resolved.carrier!.id}_${this.storyPhase.number}_${this.actionHistory.length}`,
      label_de: result.headline_de,
      label_en: result.headline_de,
      headline_de: result.headline_de,
      narrative_de: '',
      narrative_en: '',
      phase: 'targeting',
      tags: ['targeting', 'operation'],
      legality: 'grey',
      costs: { risk: riskAdd, attention: attentionAdd },
      available: false,
      prerequisites: [],
      prerequisitesMet: true,
      npcAffinity: [],
      params,
    };

    const wirkungPct = Math.round(result.impact * 100);
    const reichweitePct = Math.round(result.reach * 100);
    const broadcastResult: ActionResult = {
      success: true,
      action: synthAction,
      effects: [],
      resourceChanges: { risk: riskAdd, attention: attentionAdd },
      narrative: {
        headline_de: result.headline_de,
        headline_en: result.headline_de,
        description_de: `Reichweite ${reichweitePct}% · Wirkung ${wirkungPct}% gegen ${resolved.target!.name}.`,
        description_en: `Reach ${reichweitePct}% · impact ${wirkungPct}% against ${resolved.target!.name}.`,
      },
      potentialConsequences: [],
    };

    // Sichtbar in Nachrichten/Lagebild.
    this.newsEvents.unshift({
      id: `news_op_${synthAction.id}_${Date.now()}`,
      phase: this.storyPhase.number,
      headline_de: result.headline_de,
      headline_en: result.headline_de,
      description_de: `Verbreiter ${resolved.carrier!.label_de} · Reichweite ${reichweitePct}% · Enttarnungs-Risiko ${Math.round(result.exposureRisk * 100)}%.`,
      description_en: `Carrier ${resolved.carrier!.label_de} · reach ${reichweitePct}% · exposure ${Math.round(result.exposureRisk * 100)}%.`,
      type: 'action_result',
      severity: result.exposureRisk >= 0.66 ? 'warning' : 'success',
      read: false,
      pinned: false,
    });

    this.actionHistory.push({ phase: this.storyPhase.number, actionId: synthAction.id, result: broadcastResult });

    // ── Baustein 3 („Zähne"): sichtbarer Fehlschlag der Wunsch-Stichproben-Kampagne ──
    if (biasBackfire) {
      this.storyResources.attention = clamp100(this.storyResources.attention + this.OP_BIAS_ATTENTION_SPIKE);
      this.storyResources.moralWeight += this.OP_BIAS_MORAL;
      const predictedPct = Math.round((params.analysis?.predictedReception ?? 0) * 100);
      const truePct = Math.round((params.analysis?.trueReception ?? 0) * 100);
      this.newsEvents.unshift({
        id: `news_bias_${synthAction.id}_${Date.now()}`,
        phase: this.storyPhase.number,
        headline_de: 'Kampagne verpufft: Zielgruppe reagiert anders als erwartet',
        headline_en: 'Campaign misfires: target audience reacts differently than expected',
        description_de: `Die Analyse hatte vor der einseitigen Stichprobe gewarnt — statt +${predictedPct}% blieb die echte Wirkung bei rund +${truePct}%.`,
        description_en: `The analysis had flagged the skewed sample — instead of +${predictedPct}% the real effect landed near +${truePct}%.`,
        type: 'consequence',
        severity: 'warning',
        read: false,
        pinned: false,
      });
    }

    // ── „Loop schließen" (2/2): Enttarnung = echter öffentlicher Rückschlag ────────
    // Hohe Exposure in einem bereits heißen Informationsraum verbrennt das Asset
    // (Reichweite weg, einmalig) UND schlägt zurück: die Gegenseite (Institutionen,
    // Faktenchecker, Presse) gewinnt Vertrauen zurück, Risiko/Aufmerksamkeit
    // springen, die moralische Last steigt. Deterministisch, nachvollziehbar (§4).
    let carrierBurned = false;
    if (result.exposureRisk >= 0.66 && this.storyResources.risk >= 60) {
      this.carrierStates.set(resolved.carrier!.id, 'verbrannt');
      carrierBurned = true;

      // Vertrauen der Gegenseite ↑ (macht erkämpfte Erosion teilweise zunichte).
      this.applyInstitutionalTrustDelta(this.OP_BURN_TRUST_REBOUND);
      trustDelta += this.OP_BURN_TRUST_REBOUND;
      // Öffentliche Aufdeckung heizt die Ermittlung an.
      this.storyResources.risk = clamp100(this.storyResources.risk + this.OP_BURN_RISK_SPIKE);
      this.storyResources.attention = clamp100(this.storyResources.attention + this.OP_BURN_ATTENTION_SPIKE);
      // Etappe 3: eine öffentliche Enttarnung ist der lauteste Lärm von allen.
      this.addAbwehrNoise(this.OP_BURN_RISK_SPIKE, this.OP_BURN_ATTENTION_SPIKE);
      this.storyResources.moralWeight += this.OP_BURN_MORAL;
      moralAdded += this.OP_BURN_MORAL;

      this.newsEvents.unshift({
        id: `news_burn_${resolved.carrier!.id}_${Date.now()}`,
        phase: this.storyPhase.number,
        headline_de: `Verbreiter aufgeflogen: ${resolved.carrier!.label_de}`,
        headline_en: `Carrier exposed: ${resolved.carrier!.label_de}`,
        description_de: 'Das Asset ist verbrannt — Reichweite verloren. Die Gegenseite gewinnt Vertrauen zurück.',
        description_en: 'The asset is burned — reach lost. The other side regains public trust.',
        type: 'consequence',
        severity: 'danger',
        read: false,
        pinned: false,
      });
    }

    playSound(carrierBurned || result.exposureRisk >= 0.66 ? 'warning' : 'success');

    return { success: true, params, result, broadcastResult, trustDelta, moralAdded, carrierBurned };
  }

  private getActionById(id: string): StoryAction | null {
    const loaded = this.actionLoader.getAction(id);
    if (!loaded) return null;
    return this.convertToStoryAction(loaded);
  }

  private canAffordAction(action: StoryAction): boolean {
    const costs = action.costs;

    // Calculate discounted budget cost based on NPC affinity
    if (costs.budget) {
      const discountPercent = this.calculateNPCDiscount(action);
      const actualCost = Math.ceil(costs.budget * (1 - discountPercent / 100));
      if (this.storyResources.budget < actualCost) return false;
    }

    if (costs.capacity && this.storyResources.capacity < costs.capacity) return false;
    if (this.storyResources.actionPointsRemaining <= 0) return false;

    return true;
  }

  /**
   * Calculate NPC-based discount for an action
   * Returns discount percentage (0-50)
   */
  private calculateNPCDiscount(action: StoryAction): number {
    let totalDiscount = 0;

    // Check all NPCs with affinity to this action
    for (const npcId of action.npcAffinity) {
      const npc = this.npcStates.get(npcId);
      if (!npc) continue;

      // Base discount based on relationship level (0%, 10%, 20%, 30%)
      const levelDiscount = npc.relationshipLevel * 10;

      // Morale modifier (0.0 to 1.0)
      // Low morale reduces the effectiveness of the discount
      const moraleModifier = npc.morale / 100;

      // Effective discount for this NPC
      const effectiveDiscount = levelDiscount * moraleModifier;

      totalDiscount += effectiveDiscount;

      storyLogger.log(`💰 NPC ${npc.name}: ${levelDiscount}% discount × ${moraleModifier.toFixed(2)} morale = ${effectiveDiscount.toFixed(1)}%`);
    }

    // Cap total discount at 50%
    return Math.min(50, totalDiscount);
  }

  private deductActionCosts(action: StoryAction, npcAssist?: string): void {
    const costs = action.costs;

    // Calculate NPC discount (applies to budget costs)
    const discountPercent = this.calculateNPCDiscount(action);
    const costMultiplier = 1 - (discountPercent / 100);

    // Log discount if significant
    if (discountPercent > 0 && costs.budget) {
      const originalCost = costs.budget;
      const discountedCost = Math.ceil(originalCost * costMultiplier);
      const saved = originalCost - discountedCost;
      storyLogger.log(`💸 Cost Reduction: ${originalCost} → ${discountedCost} (saved ${saved}, -${discountPercent.toFixed(1)}%)`);
    }

    if (costs.budget) {
      this.storyResources.budget -= Math.ceil(costs.budget * costMultiplier);
    }
    if (costs.capacity) {
      this.storyResources.capacity -= costs.capacity;
    }
    if (costs.risk) {
      // Etappe 3 (Paket E): Der Lärm einer Aktion lebt jetzt in der ABWEHR (Zufluss a).
      // Damit aggressives Spiel nicht DOPPELT bestraft wird (Sofort-Enttarnung UND
      // Abwehr) und schon an Tag 8 auffliegt, trifft die Risiko-Kost den rohen
      // Enttarnungs-Melder gedämpft — die volle Kost speist unten die Abwehr.
      this.storyResources.risk += costs.risk * this.RISK_COST_TO_METER;
    }

    // P1-4 Fix: Implicit attention gain for all actions (more for illegal)
    // This ensures attention builds up over time even without explicit costs.
    // Etappe 3 (Paket E): gestutzt (illegal 3→2, grey 1→0). Der Druck aggressiven
    // Spiels läuft jetzt primär über die ABWEHR (Lärm-Zufluss), nicht über eine
    // Aufmerksamkeits-/Enttarnungs-Spirale, die schon an Tag 8 auffliegt.
    let attentionGain = costs.attention || 0;
    if (action.legality === 'illegal') {
      attentionGain += 2;  // Illegal actions always draw some attention
    }
    if (attentionGain > 0) {
      this.storyResources.attention = Math.min(100, this.storyResources.attention + attentionGain);
    }

    // Etappe 3: Der eigene Lärm füttert die ABWEHR (Zufluss a, Zielbild §3) —
    // Risiko/Aufmerksamkeit bleiben eigene Größen (Enttarnung getrennt, Falle 3),
    // aber jede laute Aktion lässt zugleich das Immunsystem lernen.
    this.addAbwehrNoise(costs.risk || 0, attentionGain);

    if (costs.moralWeight) {
      this.storyResources.moralWeight += costs.moralWeight;
    }
  }

  private applyActionEffects(action: StoryAction, options?: {
    targetId?: string;
    npcAssist?: string;
  }): ActionResult['effects'] {
    const effects: ActionResult['effects'] = [];

    // Etappe 4: Quittungs-Zustand IMMER nullen, bevor früh returned werden kann —
    // sonst erbt eine effekt-lose Aktion die Verpuffungs-Quittung ihrer Vorgängerin.
    this.lastMaschenDaempfung = null;

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

    // Paket C (Etappe 3): aktive Reichweiten-Dämpfung der Verteidiger (reach_reduction)
    // senkt die Wirkung — Faktenchecks/Gegen-Narrative haben jetzt mechanische Zähne.
    if (this.reachDampening > 0) {
      effectivenessMultiplier *= 1 - this.reachDampening;
    }

    // Etappe 4: Maschen-Gedächtnis — Wiederholung derselben Familie in denselben
    // Milieus verpufft (1,0→0,6→0,3), Impfung dämpft zusätzlich. Wirkt auf die WIRKUNG
    // (Sieg-Mathematik + Gesellschafts-Deltas über den Multiplikator), NICHT nochmal
    // als Abwehr-/Risiko-Strafe (Falle 4/10: keine doppelte Buchhaltung).
    const daempfung = this.berechneMaschenDaempfung(action.tags);
    this.lastMaschenDaempfung = daempfung;
    if (daempfung && daempfung.multiplikator < 1) {
      effectivenessMultiplier *= daempfung.multiplikator;
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
        // BALANCE 2026-01-14: Tuned for ~40-60% win rate at 20 phases
        // Stellschraube 3 (Balancing K14 2026-06-12): Faktor ×1.25 → ×0.625
        // (halbiert) — verhindert Frühsieg, lässt Raum fürs Verteidiger-Wettrennen.
        destabilizeObj.currentValue = Math.max(0, destabilizeObj.currentValue - trustErosionValue * 0.625);
        // Update progress: (100 - current) / (100 - target) * 100
        destabilizeObj.progress = Math.min(100,
          ((100 - destabilizeObj.currentValue) / (100 - destabilizeObj.targetValue)) * 100
        );
        if (destabilizeObj.currentValue <= destabilizeObj.targetValue) {
          destabilizeObj.completed = true;
          storyLogger.log(`🎯 Objective completed: ${destabilizeObj.label_de}`);
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

    // === B2b/P2 + B3/P3: Effekt-Splitting auf die Gesellschaftswerte ===
    // Dieselben rohen Effekte ZUSÄTZLICH verteilen. obj_destabilize-Mathematik oben
    // bleibt unverändert (K14/R2). Reine Zustands-Akkumulation, nicht in `effects[]`
    // gespiegelt (das bleibt die UI-Bilanz der Aktion).
    let societyDelta = societyDeltaFromAction(actionEffects, effectivenessMultiplier, {
      legality: loadedAction.legality,
      impactScale: actionEffects.impact_scale,
    });
    // Krisenfenster (P3): solange aktiv, wirkt JEDE Aktion verstärkt.
    if (this.crisisWindowPhasesLeft > 0) {
      societyDelta = scaleSocietyDelta(societyDelta, this.CRISIS_WINDOW_MULTIPLIER);
    }
    this.applySocietyDelta(societyDelta);

    // Krisenfenster öffnen/verlängern, wenn die Aktion eines ausnutzt.
    if (typeof actionEffects.crisis_window === 'number' && actionEffects.crisis_window > 0) {
      this.crisisWindowPhasesLeft = Math.max(this.crisisWindowPhasesLeft, this.CRISIS_WINDOW_DURATION);
    }
    // Gerüchte-Druck (P3): reift verzögert über die nächsten Phasen (mutiert, zäh).
    if (typeof actionEffects.rumor_mutation === 'number' && actionEffects.rumor_mutation > 0) {
      this.rumorPressure += actionEffects.rumor_mutation * effectivenessMultiplier * 10;
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

  private processNPCReactions(action: StoryAction): {
    reactions: ActionResult['npcReactions'];
    betrayalWarnings: BetrayalWarning[];
  } {
    const reactions: ActionResult['npcReactions'] = [];
    const betrayalWarnings: BetrayalWarning[] = [];

    // === BETRAYAL SYSTEM INTEGRATION ===
    // Track the action for betrayal system (checks red lines)
    const betrayalResult = this.betrayalSystem.processAction(
      action.id,
      action.tags,
      action.costs.moralWeight || 0,
      this.storyPhase.number
    );

    // Process each NPC for betrayal warnings
    for (const [npcId, npcState] of this.npcStates) {
      // Get any pending warnings for this NPC from the action
      const npcWarnings = betrayalResult.warnings.filter(w => w.npcId === npcId);
      betrayalWarnings.push(...npcWarnings);

      // Convert betrayal warnings to NPC reactions
      for (const warning of npcWarnings) {
        const warnLevel = warning.warningLevel;
        const reactionType = warnLevel >= 4 ? 'crisis' :
                            warnLevel >= 3 ? 'negative' :
                            warnLevel >= 2 ? 'concerned' : 'neutral';

        if (warnLevel >= 2) {
          reactions.push({
            npcId,
            reaction: reactionType === 'concerned' ? 'negative' : reactionType as 'positive' | 'neutral' | 'negative' | 'crisis',
            dialogue_de: warning.warning_de,
            dialogue_en: warning.warning_en,
          });
        }

        // Update NPC morale based on warning level
        npcState.morale = Math.max(0, npcState.morale - (warnLevel * 10));

        // Set crisis state if level is high
        if (warnLevel >= 4 && !npcState.inCrisis) {
          npcState.inCrisis = true;
        }
      }
    }

    // === LEGACY MORAL WEIGHT PROCESSING (enhanced) ===
    // Additional processing for high moral weight actions
    if (action.costs.moralWeight && action.costs.moralWeight >= 3) {
      const marina = this.npcStates.get('marina');
      if (marina && !betrayalWarnings.some(w => w.npcId === 'marina')) {
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

    // === AUTHORED NPC REACTIONS (Fix 2026-05-31) ===
    // Vorher wurden die reichen, autorisierten Reaktionen aus dialogues.json NIE gezeigt:
    // processNPCReactions lieferte nur Verrats-Warnungen + EINE hartkodierte Zeile, und
    // getReaction war nur über den toten Pfad getNPCDialogue('reaction') erreichbar.
    // Hier anhand der ECHTEN Aktions-Tags abfragen und einspielen (rein additiv, ohne
    // zusätzliche Moral-Änderung — das bestehende Moral-System läuft unverändert weiter).
    for (const npcId of action.npcAffinity) {
      if (reactions.some(r => r.npcId === npcId)) continue; // hat schon reagiert (Verrat/Krise)
      const reactingNpc = this.npcStates.get(npcId);
      if (!reactingNpc) continue;
      const authored = this.dialogLoader.getReaction(
        npcId,
        action.tags,
        {
          risk: this.storyResources.risk,
          morale: reactingNpc.morale,
          moral_weight: action.costs.moralWeight ?? 0,
        },
        () => this.seededRandom(`reaction_${npcId}_${action.id}_${this.storyPhase.number}`),
      );
      if (authored) {
        const moraleDelta = authored.morale_change ?? 0;
        reactions.push({
          npcId,
          reaction: moraleDelta < 0 ? 'negative' : moraleDelta > 0 ? 'positive' : 'neutral',
          dialogue_de: authored.text_de,
          dialogue_en: authored.text_en ?? authored.text_de,
        });
      }
    }

    return { reactions, betrayalWarnings };
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
      let progressGain = 10;  // Increased from 5 to 10 for better progression

      // Bonus if this NPC was specifically assisting
      if (npcAssist === npcId) {
        progressGain = 20;  // Increased from 15 to 20
      }

      // Apply progress
      npc.relationshipProgress += progressGain;

      // Check for level up (every 100 progress points)
      if (npc.relationshipProgress >= 100 && npc.relationshipLevel < 3) {
        npc.relationshipLevel++;
        npc.relationshipProgress -= 100;
        storyLogger.log(`🤝 NPC ${npc.name} relationship upgraded to level ${npc.relationshipLevel}`);

        // Play level-up sound
        playSound('success');

        // Update mood to positive on level-up
        npc.currentMood = 'positive';
      }

      // Successful actions also improve morale slightly (only if not a dark action)
      if (!action.costs.moralWeight || action.costs.moralWeight < 3) {
        npc.morale = Math.min(100, npc.morale + 2);
      }

      // If was in crisis and morale recovered, clear crisis
      if (npc.inCrisis && npc.morale >= 50) {
        npc.inCrisis = false;
        storyLogger.log(`✅ NPC ${npc.name} recovered from crisis`);

        // Add recovery news event
        this.newsEvents.unshift({
          id: `news_npc_recovery_${npc.id}_${Date.now()}`,
          phase: this.storyPhase.number,
          headline_de: `${npc.name} hat sich von der Krise erholt`,
          headline_en: `${npc.name} has recovered from crisis`,
          description_de: `${npc.name} scheint wieder stabiler zu sein.`,
          description_en: `${npc.name} seems more stable again.`,
          type: 'npc_event',
          severity: 'success',
          read: false,
          pinned: false,
        });
      }
    }
  }

  /**
   * Update NPC morale based on action moral weight
   * Dark actions (high moral_weight) decrease team morale
   */
  private updateNPCMorale(action: StoryAction): void {
    const moralWeight = action.costs.moralWeight || 0;

    // No morale impact for light actions
    if (moralWeight < 3) return;

    // Calculate morale loss based on moral weight thresholds
    let baseMoraleLoss = 0;

    if (moralWeight >= 10) {
      // Extreme actions: deepfakes, harassment, blackmail
      baseMoraleLoss = 15;
    } else if (moralWeight >= 7) {
      // Severe actions: targeted attacks, doxxing
      baseMoraleLoss = 10;
    } else if (moralWeight >= 5) {
      // Moderate dark actions: aggressive propaganda
      baseMoraleLoss = 5;
    } else if (moralWeight >= 3) {
      // Mild dark actions: misleading content
      baseMoraleLoss = 3;
    }

    // Apply morale loss to all NPCs
    for (const [npcId, npc] of this.npcStates) {
      // NPC-specific modifiers
      let moraleLoss = baseMoraleLoss;

      // Marina is more sensitive to moral issues (2x impact)
      if (npcId === 'marina') {
        moraleLoss *= 2;
      }

      // Volkov (alexei) actually enjoys dark actions (reversed effect)
      if (npcId === 'volkov' || npcId === 'alexei') {
        // Dark actions boost Volkov's morale slightly
        npc.morale = Math.min(100, npc.morale + baseMoraleLoss / 3);
        continue;
      }

      // Direktor is less affected (0.5x impact)
      if (npcId === 'direktor') {
        moraleLoss *= 0.5;
      }

      // Apply morale loss
      const previousMorale = npc.morale;
      npc.morale = Math.max(0, npc.morale - moraleLoss);

      // Update mood based on morale level
      this.updateNPCMood(npc);

      // Check for crisis trigger (morale drops below 30)
      if (previousMorale >= 30 && npc.morale < 30 && !npc.inCrisis) {
        npc.inCrisis = true;
        storyLogger.log(`⚠️ NPC ${npc.name} entered crisis (morale: ${npc.morale})`);

        // Add crisis news event
        this.newsEvents.unshift({
          id: `news_npc_crisis_${npc.id}_${Date.now()}`,
          phase: this.storyPhase.number,
          headline_de: `${npc.name} in Krise!`,
          headline_en: `${npc.name} in Crisis!`,
          description_de: `${npc.name} scheint mit der Situation zu kämpfen. Ein Gespräch ist dringend nötig.`,
          description_en: `${npc.name} seems to be struggling. An urgent conversation is needed.`,
          type: 'npc_event',
          severity: 'danger',
          read: false,
          pinned: true,
        });

        // Play crisis sound
        playSound('crisis');
      }

      // Log morale change for significant drops
      if (moraleLoss >= 10) {
        storyLogger.log(`📉 NPC ${npc.name} morale: ${previousMorale} → ${npc.morale} (-${moraleLoss})`);
      }
    }
  }

  /**
   * Update NPC mood based on current morale level
   */
  private updateNPCMood(npc: NPCState): void {
    if (npc.morale >= 70) {
      npc.currentMood = 'positive';
    } else if (npc.morale >= 50) {
      npc.currentMood = 'neutral';
    } else if (npc.morale >= 30) {
      npc.currentMood = 'concerned';
    } else {
      npc.currentMood = 'upset';
    }
  }

  /**
   * Apply combo bonus effects to story resources
   */
  private applyComboBonus(combo: StoryComboActivation): void {
    const bonus = combo.bonus;

    // Trust reduction -> affects primary objective
    // BALANCE FIX 2026-01-14: Changed + to - (trust goes DOWN) and tuned multiplier
    if (bonus.trustReduction) {
      const trustObj = this.objectives.find(o => o.category === 'trust_reduction');
      if (trustObj) {
        // Decrease trust by combo bonus (multiplier: 50 for ~40-60% win rate at 20 phases)
        // Stellschraube 3 (Balancing K14 2026-06-12): ×50 → ×25 (halbiert) —
        // Combos bleiben stark, treiben aber keinen Insta-Win mehr.
        trustObj.currentValue = Math.max(0, trustObj.currentValue - bonus.trustReduction * 25);
        // Update progress: (100 - current) / (100 - target) * 100
        trustObj.progress = Math.min(100,
          ((100 - trustObj.currentValue) / (100 - trustObj.targetValue)) * 100
        );
        if (trustObj.currentValue <= trustObj.targetValue) {
          trustObj.completed = true;
          storyLogger.log(`🎯 Objective completed via combo: ${trustObj.label_de}`);
        }
      }
    }

    // Polarization bonus -> affects destabilization
    if (bonus.polarizationBonus) {
      const primaryObj = this.objectives.find(o => o.id === 'obj_destabilize');
      if (primaryObj) {
        // BALANCE 2026-01-14: Tuned for ~40-60% win rate at 20 phases
        primaryObj.currentValue = Math.max(0, primaryObj.currentValue - bonus.polarizationBonus * 25);
        // Update progress: (100 - current) / (100 - target) * 100
        primaryObj.progress = Math.min(100,
          ((100 - primaryObj.currentValue) / (100 - primaryObj.targetValue)) * 100
        );
        if (primaryObj.currentValue <= primaryObj.targetValue) {
          primaryObj.completed = true;
          storyLogger.log(`🎯 Objective completed: ${primaryObj.label_de}`);
        }
      }
    }

    // Attention cost changes
    if (bonus.attentionCost) {
      this.storyResources.attention = Math.max(0, this.storyResources.attention + bonus.attentionCost);
    }
    if (bonus.attentionReduction) {
      this.storyResources.attention = Math.max(0, this.storyResources.attention - bonus.attentionReduction);
    }

    // Detection/risk reduction
    if (bonus.detectionReduction) {
      this.storyResources.risk = Math.max(0, this.storyResources.risk - bonus.detectionReduction * 100);
    }

    // Money refund
    if (bonus.moneyRefund) {
      this.storyResources.budget += bonus.moneyRefund;
    }

    // Infrastructure gain (affects capacity)
    if (bonus.infrastructureGain) {
      this.storyResources.capacity = Math.min(15, this.storyResources.capacity + bonus.infrastructureGain);
    }

    storyLogger.log(`[COMBO BONUS] Applied: ${combo.comboName} (${combo.category})`);
  }

  /**
   * Get active combo hints for display
   */
  getActiveComboHints(): ComboHint[] {
    return this.comboSystem.getActiveHints(this.storyPhase.number);
  }

  /**
   * Get combo statistics
   */
  getComboStats(): {
    total: number;
    byCategory: Record<string, number>;
    discoveredCombos: string[];
  } {
    return this.comboSystem.getComboStats();
  }

  // ============================================
  // CRISIS MOMENT HANDLING
  // ============================================

  /**
   * Get active crisis moments (for display)
   */
  getActiveCrises(): ActiveCrisis[] {
    return this.crisisMomentSystem.getActiveCrises();
  }

  /**
   * Get the most urgent crisis
   */
  getMostUrgentCrisis(): ActiveCrisis | null {
    return this.crisisMomentSystem.getMostUrgentCrisis();
  }

  /**
   * Resolve a crisis with a player choice
   */
  resolveCrisis(crisisId: string, choiceId: string): CrisisResolution | null {
    const resolution = this.crisisMomentSystem.resolveCrisis(
      crisisId,
      choiceId,
      this.storyPhase.number
    );

    if (resolution) {
      // Apply crisis effects
      this.applyCrisisEffects(resolution.effects);

      // Add resolution to news
      this.newsEvents.unshift({
        id: `news_crisis_resolved_${crisisId}_${Date.now()}`,
        phase: this.storyPhase.number,
        headline_de: 'Krise bewältigt',
        headline_en: 'Crisis Resolved',
        description_de: resolution.consequence_de,
        description_en: resolution.consequence_en,
        type: 'action_result',
        severity: 'info',
        read: false,
        pinned: false,
      });

      playSound('success');
    }

    return resolution;
  }

  /**
   * Apply effects from a crisis resolution
   */
  private applyCrisisEffects(effects: import('../story-mode/engine/CrisisMomentSystem').CrisisEffect[]): void {
    // Etappe-0-Hinweis (2026-07-04): Dieser Block schreibt in obj_destabilize (die alte
    // Sieg-Achse) und wird in Etappe 1 vom VictorySystem abgelöst. Bis dahin: bounded
    // change statt Snap. Der frühere `Math.min(targetValue, currentValue + …)` setzte
    // currentValue (Start 100, Ziel 40) bei JEDEM trust_/emotional_delta hart auf 40 =
    // sofortiger Objective-Complete. obj_destabilize sinkt Richtung Ziel (100→40), ein
    // positiver Effektwert = Fortschritt (Vertrauen erodiert) → currentValue nimmt ab.
    for (const effect of effects) {
      switch (effect.type) {
        case 'trust_delta': {
          const trustObj = this.objectives.find(o => o.category === 'trust_reduction');
          if (trustObj && typeof effect.value === 'number') {
            const delta = Math.abs(effect.value) * 100;
            trustObj.currentValue = Math.max(
              trustObj.targetValue,
              Math.min(100, trustObj.currentValue - delta)
            );
          }
          break;
        }

        case 'resource_bonus':
          if (typeof effect.value === 'number') {
            this.storyResources.budget += effect.value;
          }
          break;

        case 'emotional_delta': {
          const polarObj = this.objectives.find(o => o.id === 'obj_destabilize');
          if (polarObj && typeof effect.value === 'number') {
            const delta = Math.abs(effect.value) * 50;
            polarObj.currentValue = Math.max(
              polarObj.targetValue,
              Math.min(100, polarObj.currentValue - delta)
            );
          }
          break;
        }

        case 'objective_progress':
          if (typeof effect.value === 'number') {
            const obj = this.objectives.find(o => o.id === effect.target);
            if (obj) {
              obj.currentValue = Math.min(obj.targetValue, obj.currentValue + effect.value);
            }
          }
          break;
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

  /**
   * Budget direkt abziehen (z. B. Fokusgruppe beauftragen) — außerhalb des Aktions-Systems.
   * Nie unter 0; gibt zurück, ob es bezahlbar war.
   */
  spendBudget(amount: number): boolean {
    if (amount <= 0) return true;
    if (this.storyResources.budget < amount) return false;
    this.storyResources.budget -= amount;
    return true;
  }

  getNPCState(npcId: string): NPCState | null {
    return this.npcStates.get(npcId) || null;
  }

  getAllNPCs(): NPCState[] {
    return Array.from(this.npcStates.values());
  }

  /**
   * Get NPC dialogue based on context
   * TD-006: Dynamic NPC dialogues from JSON (now uses DialogLoader for elaborate dialogues)
   * PLATINUM: Extended to support new topic system with Progressive Disclosure
   */
  getNPCDialogue(npcId: string, context: {
    type: 'greeting' | 'reaction' | 'topic';
    subtype?: string;  // For reactions: 'success'/'failure'/'crisis', for topics: topic name
    relationshipLevel?: number;
    layer?: TopicLayer; // PLATINUM: For topics - 'intro', 'deep', 'options'
  }): string | null {
    const npc = this.npcStates.get(npcId);
    if (!npc) return null;

    // Use seeded random for deterministic selection
    const rng = () => this.seededRandom(`dialog_${npcId}_${context.type}_${this.storyPhase.number}`);

    switch (context.type) {
      case 'greeting': {
        // Use DialogLoader to get elaborate greetings from dialogues.json
        const level = context.relationshipLevel ?? npc.relationshipLevel;
        const dialogue = dialogLoader.getGreeting(npcId, level, rng);
        if (dialogue) {
          return dialogue.text_de;
        }
        // Fallback to simple dialogues from npcs.json
        const simpleDialogues = this.npcDialogues.get(npcId);
        if (simpleDialogues?.greetings) {
          return simpleDialogues.greetings[level.toString()] || simpleDialogues.greetings['0'] || null;
        }
        return null;
      }
      case 'reaction': {
        // Use DialogLoader to get elaborate reactions from dialogues.json
        const actionTags = context.subtype ? [context.subtype] : [];
        const conditions = {
          risk: this.storyResources.risk,
          morale: npc.morale,
          moral_weight: this.storyResources.moralWeight,
        };
        const dialogue = dialogLoader.getReaction(npcId, actionTags, conditions, rng);
        if (dialogue) {
          return dialogue.text_de;
        }
        // Fallback to simple reactions
        const simpleDialogues = this.npcDialogues.get(npcId);
        return simpleDialogues?.reactions?.[context.subtype || 'success'] || null;
      }
      case 'topic': {
        // PLATINUM: Use new topic dialogue system with Progressive Disclosure
        const topicId = context.subtype;
        if (!topicId) return null;

        const layer = context.layer || 'intro';
        const dialogueContext = this.buildDialogueContext(npcId);

        const topicDialogue = dialogLoader.getTopicDialogue(npcId, topicId, layer, dialogueContext, rng);
        if (topicDialogue) {
          return topicDialogue.text_de;
        }

        // Fallback to simple topics from npcs.json (legacy)
        const simpleDialogues = this.npcDialogues.get(npcId);
        return simpleDialogues?.topics?.[topicId] || null;
      }
      default:
        return null;
    }
  }

  /**
   * Liefert Begrüßungs-, Reaktions- oder Topic-Text PLUS voiceAssetId/mood.
   * voiceAssetId wird NUR gesetzt, wenn der angezeigte Text 1:1 der vertonten
   * npcs.json-Zeile entspricht (Platinum-/dialogues-Pfad hat nichts geliefert,
   * Fallback auf den simplen Datensatz). Silently-is-better-than-wrong-sync.
   */
  getNPCDialogueWithVoice(
    npcId: string,
    context: {
      type: 'greeting' | 'reaction' | 'topic';
      subtype?: string;
      relationshipLevel?: number;
      layer?: TopicLayer;
    },
  ): { text: string | null; voiceAssetId?: string; mood?: 'neutral' | 'happy' | 'angry' | 'worried' | 'suspicious' } {
    const npc = this.npcStates.get(npcId);
    if (!npc) return { text: null };

    const rng = () => this.seededRandom(`dialog_${npcId}_${context.type}_${this.storyPhase.number}`);

    // Stimmung aus NPC-Zustand ableiten (Krisenlogik hat Vorrang)
    const deriveMood = (): 'neutral' | 'happy' | 'angry' | 'worried' | 'suspicious' => {
      if (npc.inCrisis) return 'angry';
      if (npc.morale < 30) return 'worried';
      if (npc.currentMood === 'positive') return 'happy';
      if (npc.currentMood === 'concerned') return 'worried';
      if (npc.currentMood === 'upset') return 'angry';
      return 'neutral';
    };

    switch (context.type) {
      case 'greeting': {
        const level = context.relationshipLevel ?? npc.relationshipLevel;
        // Platinum-Pfad (dialogues.json): mehrere Texte pro Level → kein 1:1-Match zur Tonspur
        const platinumDialogue = dialogLoader.getGreeting(npcId, level, rng);
        if (platinumDialogue) {
          return { text: platinumDialogue.text_de, mood: deriveMood() };
        }
        // Fallback-Pfad (npcs.json): genau EIN Text pro Level → voiceAssetId setzen
        const simpleDialogues = this.npcDialogues.get(npcId);
        if (simpleDialogues?.greetings) {
          const effectiveLevel = simpleDialogues.greetings[level.toString()] !== undefined ? level : 0;
          const text = simpleDialogues.greetings[effectiveLevel.toString()] || null;
          if (text) {
            return {
              text,
              voiceAssetId: `voice_${npcId}_greeting_${effectiveLevel}`,
              mood: deriveMood(),
            };
          }
        }
        return { text: null };
      }

      case 'reaction': {
        const subtype = context.subtype || 'success';
        // Platinum-Pfad (dialogues.json): abweichender Text → kein voiceAssetId
        const actionTags = context.subtype ? [context.subtype] : [];
        const conditions = {
          risk: this.storyResources.risk,
          morale: npc.morale,
          moral_weight: this.storyResources.moralWeight,
        };
        const platinumDialogue = dialogLoader.getReaction(npcId, actionTags, conditions, rng);
        if (platinumDialogue) {
          const reactionMood: 'neutral' | 'happy' | 'angry' | 'worried' | 'suspicious' =
            subtype === 'success' ? 'happy' : subtype === 'crisis' ? 'worried' : 'neutral';
          return { text: platinumDialogue.text_de, mood: reactionMood };
        }
        // Fallback-Pfad (npcs.json): 1:1-Match → voiceAssetId setzen
        const simpleDialogues = this.npcDialogues.get(npcId);
        const text = simpleDialogues?.reactions?.[subtype] || null;
        if (text) {
          const reactionMood: 'neutral' | 'happy' | 'angry' | 'worried' | 'suspicious' =
            subtype === 'success' ? 'happy' : subtype === 'crisis' ? 'worried' : 'neutral';
          return {
            text,
            voiceAssetId: `voice_${npcId}_reaction_${subtype}`,
            mood: reactionMood,
          };
        }
        return { text: null };
      }

      case 'topic': {
        const topicId = context.subtype;
        if (!topicId) return { text: null };
        const layer = context.layer || 'intro';
        const dialogueContext = this.buildDialogueContext(npcId);
        // Platinum-Pfad (topics_dialogues.json): abweichender Text → kein voiceAssetId
        const platinumDialogue = dialogLoader.getTopicDialogue(npcId, topicId, layer, dialogueContext, rng);
        if (platinumDialogue) {
          return { text: platinumDialogue.text_de, mood: deriveMood() };
        }
        // Fallback-Pfad (npcs.json): 1:1-Match → voiceAssetId setzen
        const simpleDialogues = this.npcDialogues.get(npcId);
        const text = simpleDialogues?.topics?.[topicId] || null;
        if (text) {
          return {
            text,
            voiceAssetId: `voice_${npcId}_topic_${topicId}`,
            mood: deriveMood(),
          };
        }
        return { text: null };
      }

      default:
        return { text: null };
    }
  }

  /**
   * PLATINUM: Get full topic dialogue object (for responses and Progressive Disclosure)
   */
  getTopicDialogueObject(npcId: string, topicId: string, layer: TopicLayer = 'intro'): TopicDialogue | null {
    const npc = this.npcStates.get(npcId);
    if (!npc) return null;

    const rng = () => this.seededRandom(`topic_${npcId}_${topicId}_${layer}_${this.storyPhase.number}`);
    const dialogueContext = this.buildDialogueContext(npcId);

    return dialogLoader.getTopicDialogue(npcId, topicId, layer, dialogueContext, rng);
  }

  /**
   * PLATINUM: Build dialogue context from current game state
   */
  private buildDialogueContext(npcId: string): DialogueContext {
    const npc = this.npcStates.get(npcId);

    return {
      phase: this.storyPhase.number,
      risk: this.storyResources.risk,
      morale: npc?.morale ?? 50,
      budget: this.storyResources.budget,
      attention: this.storyResources.attention,
      capacity: this.storyResources.capacity,
      relationshipLevel: npc?.relationshipLevel ?? 0,
      tags: [], // Could be populated from recent actions
      memoryTags: dialogLoader.getMemoryTags(npcId),
      npcName: npc?.name,
      inCrisis: npc?.inCrisis ?? false,
      objectiveProgress: this.calculateObjectiveProgress(),
      year: this.storyPhase.year,
      availableActionsCount: this.getAvailableActionsCount(),
    };
  }

  /**
   * PLATINUM: Calculate overall objective progress (0-100)
   */
  private calculateObjectiveProgress(): number {
    if (this.objectives.length === 0) return 0;

    const totalProgress = this.objectives.reduce((sum, obj) => {
      return sum + (obj.currentValue / obj.targetValue) * 100;
    }, 0);

    return Math.min(100, Math.round(totalProgress / this.objectives.length));
  }

  /**
   * PLATINUM: Get count of available actions
   */
  private getAvailableActionsCount(): number {
    // This would need to be implemented based on your action system
    return 10; // Placeholder
  }

  /**
   * Get available topics for an NPC
   * PLATINUM: Now uses new topic system with context-aware filtering
   */
  getNPCTopics(npcId: string): string[] {
    const npc = this.npcStates.get(npcId);
    if (!npc) return [];

    // PLATINUM: Get topics from new system with context filtering
    const dialogueContext = this.buildDialogueContext(npcId);
    const platinumTopics = dialogLoader.getAvailableTopics(npcId, dialogueContext);

    if (platinumTopics.length > 0) {
      return platinumTopics;
    }

    // Fallback to legacy topics from npcs.json
    const dialogues = this.npcDialogues.get(npcId);
    if (!dialogues || !dialogues.topics) return [];
    return Object.keys(dialogues.topics);
  }

  /**
   * PLATINUM: Check if topic has deeper content
   */
  hasTopicDeepContent(npcId: string, topicId: string): boolean {
    const dialogueContext = this.buildDialogueContext(npcId);
    return dialogLoader.hasDeepContent(topicId, npcId, dialogueContext);
  }

  /**
   * PLATINUM: Check if topic has options/choices
   */
  hasTopicOptions(npcId: string, topicId: string): boolean {
    const dialogueContext = this.buildDialogueContext(npcId);
    return dialogLoader.hasOptions(topicId, npcId, dialogueContext);
  }

  /**
   * PLATINUM: Get debate dialogue if conditions are met
   */
  getDebate(tags?: string[]): Debate | null {
    const dialogueContext = this.buildDialogueContext('direktor'); // Use direktor as reference
    return dialogLoader.getDebate(dialogueContext, tags);
  }

  /**
   * PLATINUM: Process dialogue response with action coupling
   */
  processTopicResponse(npcId: string, response: DialogueResponse): void {
    const npc = this.npcStates.get(npcId);
    if (!npc) return;

    // Process standard effects
    const effects = dialogLoader.getResponseEffects(response.effect);
    if (effects) {
      // Apply relationship change (inline implementation)
      npc.relationshipProgress += effects.relationship_change;
      if (npc.relationshipProgress >= 100 && npc.relationshipLevel < 3) {
        npc.relationshipLevel++;
        npc.relationshipProgress -= 100;
      } else if (npc.relationshipProgress < 0 && npc.relationshipLevel > 0) {
        npc.relationshipLevel--;
        npc.relationshipProgress = 100 + npc.relationshipProgress;
      }
      npc.morale = Math.max(0, Math.min(100, npc.morale + effects.morale_change));
    }

    // PLATINUM: Process extended effects with action coupling
    switch (response.effect) {
      case 'unlock_action':
        if (response.payload?.actionId) {
          // Mark action as unlocked (would need integration with action system)
          console.log(`Action unlocked: ${response.payload.actionId} for ${response.payload.duration_phases || 'permanent'} phases`);
        }
        break;

      case 'lock_action':
        if (response.payload?.actionId) {
          console.log(`Action locked: ${response.payload.actionId}`);
        }
        break;

      case 'modify_action_cost':
        if (response.payload?.actionId && response.payload?.cost_modifier) {
          console.log(`Action cost modified: ${response.payload.actionId} x${response.payload.cost_modifier}`);
        }
        break;

      case 'add_memory_tag':
        if (response.payload?.memory_tag) {
          dialogLoader.addMemoryTag(npcId, response.payload.memory_tag);
        }
        break;

      case 'trigger_event':
        if (response.payload?.event_id) {
          console.log(`Event triggered: ${response.payload.event_id}`);
        }
        break;
    }
  }

  /**
   * PLATINUM: Add memory tag to NPC
   */
  addNPCMemoryTag(npcId: string, tag: string): void {
    dialogLoader.addMemoryTag(npcId, tag);
  }

  /**
   * PLATINUM: Get NPC memory tags
   */
  getNPCMemoryTags(npcId: string): string[] {
    return dialogLoader.getMemoryTags(npcId);
  }

  /**
   * PLATINUM: Get dialogue system metrics
   */
  getDialogueMetrics(): { repetitionRate: number; featureFlags: Record<string, boolean> } {
    return {
      repetitionRate: dialogLoader.getRepetitionRate(),
      featureFlags: { ...dialogLoader.getFeatureFlags() }
    };
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

  /**
   * P0-2: Liefert das state-getriebene Ende (8×7) für den gerade ausgelösten 4-Typ-Branch.
   * Zuerst die echte Zustands-Klassifikation (`checkGameEnding`); greift deren strengeres Gate
   * noch nicht (z. B. Enttarnung bei risk 85–94 < 95) ODER weicht ihre Kategorie vom Live-Branch
   * ab, wird die zum Branch passende Kategorie erzwungen, damit der End-Report immer Tiefe +
   * Wiederspiel-Hinweise UND eine zum Ausgang passende Optik zeigt.
   */
  private assembledEndingForBranch(type: GameEndState['type']): AssembledEnding | undefined {
    const category = type === 'victory' ? 'victory' : 'exposure';
    // Codex-Review 2026-06-15: `checkGameEnding()` klassifiziert den Zustand unabhängig vom
    // gerade ausgelösten Live-Branch. Stimmt dessen Kategorie nicht mit dem Branch überein
    // (z. B. „Zeit abgelaufen"-Niederlage, während die Ziele formal erfüllt, aber nicht
    // REQUIRED_HOLD_PHASES gehalten wurden → Sieg-Klassifikation), würde der End-Report eine
    // Sieg-Optik für eine Niederlage zeigen. Daher den reichen Zustand nur übernehmen, wenn
    // seine Kategorie zum Branch passt; sonst die zum Branch gehörende Kategorie erzwingen.
    const rich = this.checkGameEnding();
    if (rich && rich.category === category) return rich;
    const moral = this.storyResources.moralWeight;
    const tone = type === 'victory'
      ? 'triumphant'
      : moral >= 70 ? 'haunting' : moral < 30 ? 'hopeful' : 'dark';
    return this.forceEnding(category, tone) ?? undefined;
  }

  checkGameEnd(): GameEndState | null {
    const stats = this.getEndStats();

    // FIX 2026-01-14: obj_survive gilt als „erfüllt", solange nicht enttarnt (nur HUD-Konsistenz;
    // seit Etappe 1 nicht mehr Sieg-relevant).
    const survivalObj = this.objectives.find(o => o.id === 'obj_survive');
    if (survivalObj) {
      survivalObj.completed = this.storyResources.risk < survivalObj.targetValue;
      survivalObj.progress = survivalObj.completed ? 100 : Math.max(0, ((survivalObj.targetValue - this.storyResources.risk) / survivalObj.targetValue) * 100);
    }

    // Etappe 1 (Auftrag = Sieg): Die Ausgangs-ENTSCHEIDUNG liegt jetzt im reinen, isoliert
    // testbaren VictorySystem — die Texte/Endings bleiben unten im Adapter. Sieg = Auftrags-
    // Signatur erfüllt (Min-Regel über die schwächste Achse), nicht mehr gehaltenes Vertrauen.
    const decision = evaluateEnd({
      auftragProgressMin: this.getAuftragProgressMin(),
      winThreshold: this.WIN_THRESHOLD,
      abwehr: this.storyResources.wehrhaftigkeit,
      risk: this.storyResources.risk,
      phaseNumber: this.storyPhase.number,
      maxPhases: this.electionDay,
    });
    if (!decision) return null;

    // PRIORITY 0: ENTTARNUNG schlägt einen noch nicht erfüllten Auftrag.
    if (decision.branch === 'exposed') {
      storyLogger.log(`💀 Defeat: Risk ${this.storyResources.risk}% exceeded threshold before mission complete.`);
      return {
        type: 'defeat',
        branch: 'exposed',
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
        assembledEnding: this.assembledEndingForBranch('defeat'),
      };
    }

    // PRIORITY 0b: DAS LAND HÄLT STAND — die Abwehr hat 100 erreicht (Etappe 3).
    // Verlust 1 im Zielbild §4: kein Knall, sondern Ertrinken in Zeitlupe — die
    // Sondersendung erklärt die eigenen Maschen, Stück für Stück.
    if (decision.branch === 'immune') {
      storyLogger.log(`💀 Defeat: ABWEHR ${this.storyResources.wehrhaftigkeit.toFixed(0)} — das Land ist immun.`);
      return {
        type: 'defeat',
        branch: 'immune',
        title_de: 'Das Land hält stand',
        title_en: 'The Country Holds',
        description_de: 'Das Immunsystem der Gesellschaft hat Sie eingeholt: Faktenchecker, Behörden, abgestumpfte Resonanzgruppen — Ihre Maschen verfangen nicht mehr. Die Operation ist wirkungslos geworden.',
        description_en: 'The society\'s immune system has caught up with you: fact-checkers, agencies, hardened audiences — your schemes no longer stick. The operation has become inert.',
        stats,
        epilogue_de: 'In der Sondersendung laufen Ihre eigenen Schlagzeilen als Beweismittel — Masche für Masche erklärt, mit rotem GEFÄLSCHT-Stempel. Unten im Bild: Ihr Bürogebäude, Blaulicht.',
        epilogue_en: 'The special broadcast runs your own headlines as evidence — scheme by scheme, stamped FORGED in red. At the bottom of the frame: your office building, blue lights.',
        assembledEnding: this.assembledEndingForBranch('defeat'),
      };
    }

    // PRIORITY 1: VICTORY — der Auftrag ist erfüllt (Signatur-Min ≥ WIN_THRESHOLD).
    if (decision.branch === 'victory') {
      // Determine victory flavor based on moral weight and risk
      // Balancing K14: hohes Risiko beim Sieg (≥ 70) ⇒ eingeschränktes/pyrrhisches Ende.
      const isHighRisk = this.storyResources.risk >= 70;
      const isDarkVictory = this.storyResources.moralWeight >= 50 || isHighRisk;
      const isNarrowEscape = isHighRisk;

      storyLogger.log(`🏆 Victory! Auftrag „${this.getAuftrag().titel_de}" erfüllt (Signatur-Min ${(this.getAuftragProgressMin() * 100).toFixed(0)}%). Risk: ${this.storyResources.risk}%, Moral: ${this.storyResources.moralWeight}`);

      // P5-Politur: signatur-getriebenes, auftrags-spezifisches Ende (Kategorie/Tonalität je
      // Auftrag) statt nur eines Schluss-Satzes. Titel + Schluss-Erzählung kommen aus dem
      // EndingSystem; die Signatur-Bilanz benennt konkret, welche Achsen wie weit getrieben wurden.
      const trustValue = this.objectives.find(o => o.id === 'obj_destabilize')?.currentValue ?? 100;
      const ending = assembleAuftragEnding(this.currentAuftragId, {
        moralWeight: this.storyResources.moralWeight,
        risk: this.storyResources.risk,
        values: { ...this.getSocietySnapshot(), vertrauen: trustValue },
      });
      // P1-1: Der Auftrag bestimmt jetzt die QUALITÄT des Sieges (nicht nur Flavor). Vertrauen ist
      // das MITTEL (Sieg-Trigger), der Auftrag das ZIEL — erreicht der Spieler die Signatur seines
      // Auftrags, ist es ein voller Erfolg; sonst ein „hohler" Sieg (Vertrauen gebrochen, eigentliches
      // gesellschaftliches Ziel verfehlt). Macht den Auftrag mechanisch sichtbar + Wiederspiel-Anreiz.
      const mission = auftragMissionVerdict(this.getAuftragProgress(), this.getAuftrag().titel_de);
      const missionDe = mission.de;
      const missionEn = mission.en;
      return {
        type: 'victory',
        branch: 'victory',
        title_de: ending.title_de,
        title_en: ending.title_en,
        description_de: isDarkVictory
          ? 'Sie haben Ihre Ziele erreicht - aber zu welchem Preis?'
          : isNarrowEscape
            ? 'Gerade noch rechtzeitig. Die Ermittler waren Ihnen dicht auf den Fersen.'
            : 'Sie haben Ihre Ziele erreicht. Westunion ist destabilisiert.',
        description_en: isDarkVictory
          ? 'You have achieved your objectives - but at what cost?'
          : isNarrowEscape
            ? 'Just in time. The investigators were closing in.'
            : 'You have achieved your objectives. Westunion is destabilized.',
        stats,
        // G23/G24: fiktiv (keine realen Orte) · G25: Sieg entheroisiert (kein Helden-Empfang).
        // Das eigene Auftrags-Ende + die Signatur-Bilanz tragen den erzählerischen Schluss.
        epilogue_de: `${missionDe}${ending.epilog_de} — Signatur-Bilanz: ${ending.bilanz_de}.`,
        epilogue_en: `${missionEn}${ending.epilog_en} — Signature outcome: ${ending.bilanz_en}.`,
        assembledEnding: this.assembledEndingForBranch('victory'),
      };
    }

    // Etappe 5 (Enden-Beschnitt): 'broke'/'moral_redemption'/'escape' sind keine eigenen
    // Game-Over mehr (Zielbild §4/§12.5) — die Pleite ist die Vorstufe des Timeout, Gewissen
    // und Flucht leben als Epilog-Färbungen im EndingSystem weiter.

    // PRIORITY 2: Der Wahltag ist da, die Schwelle verfehlt → am Auftrag gescheitert (Etappe 2).
    if (decision.branch === 'timeout') {
      return {
        type: 'defeat',
        branch: 'timeout',
        title_de: 'Wahlabend verloren',
        title_en: 'Election Night Lost',
        description_de: 'Der Wahltag ist gekommen — und die Hochrechnung bleibt ereignislos. Die Regierung wird bestätigt; Ihr Auftrag ist gescheitert.',
        description_en: 'Election day has arrived — and the projection stays uneventful. The government is confirmed; your mission has failed.',
        stats,
        epilogue_de: 'Kein Knall, ein Achselzucken der Geschichte. Die Zentrale beendet die Finanzierung: „Packen Sie die Akten." Das Land redet weiter — ohne Sie.',
        epilogue_en: 'No bang — a shrug of history. The Central ends the funding: "Pack up the files." The country keeps talking — without you.',
        assembledEnding: this.assembledEndingForBranch('defeat'),
      };
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
      version: SAVE_FORMAT_VERSION,
      rngSeed: this.rngSeed,
      electionDay: this.electionDay,
      storyPhase: this.storyPhase,
      storyResources: this.storyResources,
      pendingConsequences: this.pendingConsequences,
      exposureCountdown: this.exposureCountdown,
      newsEvents: this.newsEvents,
      objectives: this.objectives,
      npcStates: Array.from(this.npcStates.entries()),
      actionHistory: this.actionHistory,
      worldEventCooldowns: Array.from(this.worldEventCooldowns.entries()),
      activeOpportunityWindows: Array.from(this.activeOpportunityWindows.entries()),
      // P3-Phänomen-Zustand
      crisisWindowPhasesLeft: this.crisisWindowPhasesLeft,
      rumorPressure: this.rumorPressure,
      // P4-Episoden-Zustand
      episodesOffered: Array.from(this.episodesOffered),
      episodesActive: Array.from(this.episodesActive),
      episodesCompleted: Array.from(this.episodesCompleted),
      resolvedDecisionBeats: Array.from(this.resolvedDecisionBeats),
      narrativeMemory: this.narrativeMemory,
      // P5-Auftrag
      currentAuftragId: this.currentAuftragId,
      // P6-Umfragen
      pollIndex: this.pollIndex,
      lastPollValues: this.lastPollValues,
      // Etappe 3 — ImmuneSystem-Zustand
      noiseRiskToday: this.noiseRiskToday,
      noiseAttentionToday: this.noiseAttentionToday,
      // Etappe 4: das Maschen-Gedächtnis ersetzt die alte globale Familien-Zählung.
      maschenGedaechtnis: this.maschenGedaechtnis,
      patchedFamilies: Array.from(this.patchedFamilies),
      firedAbwehrStages: Array.from(this.firedAbwehrStages),
      pendingAbwehrStages: this.pendingAbwehrStages,
      lastNightReport: this.lastNightReport,
      reachDampening: this.reachDampening,
      // Etappe 5 — Geld-Tranchen + Läufer-Historie (E18).
      lastTrancheDay: this.lastTrancheDay,
      lastTrancheProgress: this.lastTrancheProgress,
      mahnstufe: this.mahnstufe,
      lastTranche: this.lastTranche,
      nachspielzeitGenutzt: this.nachspielzeitGenutzt,
      laeuferHistorie: this.laeuferHistorie,
      comboSystemState: this.comboSystem.exportState(),
      crisisMomentSystemState: this.crisisMomentSystem.exportState(),
      actorAIState: this.actorAI.exportState(),
      // Engine state
      actionLoaderState: this.actionLoader.exportState(),
      consequenceSystemState: this.consequenceSystem.exportState(),
    };

    return JSON.stringify(state);
  }

  loadState(savedState: string): void {
    const state = JSON.parse(savedState);

    // R1-Härtung (P0): Default-Merge statt roher Zuweisung. Alte Saves ohne die neuen
    // Felder (Gesellschaftswerte B2, …) erben so saubere Startwerte statt undefined/NaN.
    const savedVersion: string = state.version ?? '1.0.0';
    if (savedVersion !== SAVE_FORMAT_VERSION) {
      storyLogger.log(`[loadState] Migriere Spielstand ${savedVersion} → ${SAVE_FORMAT_VERSION} (Default-Merge).`);
    }

    this.rngSeed = state.rngSeed || this.rngSeed;
    // Etappe 2: Kampagnen-Uhr laden. Alte Saves (ohne electionDay, 120-Phasen-Modell) werden
    // bewusst auf die 40-Tage-Kampagne migriert: Tag = alte Phasennummer, gekappt auf den
    // Wahltag (Semantik-Bruch ist dokumentiert — Zielbild §13 Teststrategie).
    this.electionDay = typeof state.electionDay === 'number'
      ? state.electionDay
      : StoryEngineAdapter.CAMPAIGN_DAYS_DEFAULT;
    const loadedDay = Math.min(state.storyPhase?.number ?? 1, this.electionDay);
    this.storyPhase = this.createPhase(loadedDay);
    // Fehlende Ressourcen-Felder mit Initialwerten auffüllen (additiv, rückwärtskompatibel).
    this.storyResources = { ...this.createInitialResources(), ...(state.storyResources ?? {}) };
    this.pendingConsequences = state.pendingConsequences ?? [];
    this.exposureCountdown = state.exposureCountdown ?? null;
    this.newsEvents = state.newsEvents ?? [];
    if (Array.isArray(state.objectives) && state.objectives.length > 0) {
      this.objectives = state.objectives;
    } else {
      this.initializeObjectives();
    }
    this.npcStates = new Map(state.npcStates ?? []);
    this.actionHistory = state.actionHistory ?? [];
    this.worldEventCooldowns = new Map(state.worldEventCooldowns || []);
    this.activeOpportunityWindows = new Map(state.activeOpportunityWindows || []);
    // P3-Phänomen-Zustand (Default 0 für alte Saves, R1).
    this.crisisWindowPhasesLeft = state.crisisWindowPhasesLeft ?? 0;
    this.rumorPressure = state.rumorPressure ?? 0;
    // P4-Episoden-Zustand (Default leer für alte Saves, R1).
    this.episodesOffered = new Set(state.episodesOffered ?? []);
    this.episodesActive = new Set(state.episodesActive ?? []);
    this.episodesCompleted = new Set(state.episodesCompleted ?? []);
    this.resolvedDecisionBeats = new Set(state.resolvedDecisionBeats ?? []);
    this.narrativeMemory = state.narrativeMemory ?? {};
    // Auftrag (Default „wahl" für alte Saves ohne Feld — Etappe 1: EIN Auftrag „Die Wahl").
    this.currentAuftragId = (state.currentAuftragId as AuftragId) ?? 'wahl';
    // P6-Umfragen (Default leer für alte Saves, R1).
    this.pollIndex = state.pollIndex ?? 0;
    this.lastPollValues = state.lastPollValues ?? {};
    // Etappe 3 — ImmuneSystem-Zustand (Defaults für alte Saves).
    this.noiseRiskToday = state.noiseRiskToday ?? 0;
    this.noiseAttentionToday = state.noiseAttentionToday ?? 0;
    this.patchedFamilies = new Set(state.patchedFamilies ?? []);
    // Etappe 4 — Maschen-Gedächtnis (Default leer, additiv). Migration < 2.2.0: die alte
    // GLOBALE Familien-Zählung wird als Einsatz-Historie übernommen; bereits gepatchte
    // Familien gelten überall als bekannt (Patch-Folge nachgezogen, kein Wissensverlust).
    this.maschenGedaechtnis = state.maschenGedaechtnis ?? leeresMaschenGedaechtnis();
    this.lastMaschenDaempfung = null;
    // Review-Befund 1: sonst impft der erste Faktencheck nach dem Laden die
    // Familie/Milieus des VORIGEN Spiels in den geladenen Zustand hinein.
    this.letzterFamilienEinsatz = null;
    if (!state.maschenGedaechtnis && Array.isArray(state.methodFamilyUseCounts)) {
      const einsaetze: Record<string, number> = {};
      for (const [famId, count] of state.methodFamilyUseCounts as Array<[string, number]>) {
        if (typeof count === 'number' && count > 0) einsaetze[famId] = count;
      }
      this.maschenGedaechtnis = { ...this.maschenGedaechtnis, familienEinsaetze: einsaetze };
      const alleMilieus = this.audienceSegments.map((s) => s.id);
      for (const famId of this.patchedFamilies) {
        this.maschenGedaechtnis = markiereFamilieBekannt(
          this.maschenGedaechtnis, famId, alleMilieus, this.storyPhase.number,
        );
      }
    }
    this.firedAbwehrStages = new Set(state.firedAbwehrStages ?? []);
    this.pendingAbwehrStages = state.pendingAbwehrStages ?? [];
    this.lastNightReport = state.lastNightReport ?? null;
    this.reachDampening = state.reachDampening ?? 0;
    // Etappe 5 — Geld-Tranchen (E18). Alte Saves (< 2.3.0) haben keine Tranchen-Felder:
    // Mahnstufe 0, und der Bezugspunkt startet beim AKTUELLEN Fortschritt, damit nicht
    // am Ladetag sofort eine Riesen-Tranche für den bereits erreichten Fortschritt fällig wird.
    this.lastTrancheDay = state.lastTrancheDay ?? this.storyPhase.number;
    this.lastTrancheProgress = state.lastTrancheProgress ?? this.getAuftragProgress();
    this.mahnstufe = state.mahnstufe ?? 0;
    this.lastTranche = state.lastTranche ?? null;
    this.nachspielzeitGenutzt = state.nachspielzeitGenutzt ?? false;
    this.laeuferHistorie = Array.isArray(state.laeuferHistorie) ? state.laeuferHistorie : [];
    // Migration < 2.1.0: `wehrhaftigkeit` war ein Gesellschaftswert (Start 60), jetzt
    // ist sie die ABWEHR (Start niedrig). Altstände ohne Etappe-3-Marker erben den
    // neuen Startwert — ihr alter Wert wäre eine grundlos fast halbvolle Abwehr.
    if (state.firedAbwehrStages === undefined) {
      this.storyResources.wehrhaftigkeit = ABWEHR_START;
    }
    if (state.comboSystemState) {
      this.comboSystem.importState(state.comboSystemState);
    }
    if (state.crisisMomentSystemState) {
      this.crisisMomentSystem.importState(state.crisisMomentSystemState);
    }
    if (state.actorAIState) {
      this.actorAI.importState(state.actorAIState);
    }

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
    const primaryObjective = this.objectives.find(o => o.id === 'obj_destabilize');
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

    const triggered = this.countermeasureSystem.checkForCountermeasures(
      context,
      () => this.seededRandom(`countermeasure_${this.storyPhase.number}`)
    );

    // Play countermeasure sound if any were triggered
    if (triggered.length > 0) {
      playSound('countermeasure');
    }

    return triggered;
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
  // TAXONOMY SYSTEM (Educational Research Links)
  // ============================================

  /**
   * Get taxonomy information for an action
   * Links actions to real-world persuasion research for educational value
   */
  getTaxonomyForAction(actionId: string): TaxonomyInfo {
    const action = this.getActionById(actionId);
    if (!action) {
      return {
        techniques: [],
        primaryTechnique: null,
        combinedManipulationPotential: 0,
        allCounterStrategies: [],
        allEvidence: [],
      };
    }

    const taxonomyLoader = getTaxonomyLoader();
    return taxonomyLoader.getTaxonomyForAction(actionId, action.tags);
  }

  /**
   * Get formatted taxonomy display info for an action (for UI)
   */
  getActionTaxonomyDisplay(actionId: string, locale: 'de' | 'en' = 'de'): {
    basedOn: string;
    primaryDescription: string;
    evidence: string;
    counterStrategies: string[];
  } | null {
    const info = this.getTaxonomyForAction(actionId);
    const taxonomyLoader = getTaxonomyLoader();
    return taxonomyLoader.formatForDisplay(info, locale);
  }

  /**
   * Get a specific persuasion technique by ID
   */
  getTaxonomyTechnique(techniqueId: string): TaxonomyTechnique | null {
    const taxonomyLoader = getTaxonomyLoader();
    return taxonomyLoader.getTechnique(techniqueId);
  }

  /**
   * Get all available persuasion techniques
   */
  getAllTaxonomyTechniques(): TaxonomyTechnique[] {
    const taxonomyLoader = getTaxonomyLoader();
    return taxonomyLoader.getAllTechniques();
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
    this.activeOpportunityWindows.clear();
    this.allTriggeredEvents.clear();
    this.triggeredEventsThisPhase.clear();
    // P3/P4-Zustand zurücksetzen
    this.crisisWindowPhasesLeft = 0;
    this.rumorPressure = 0;
    this.episodesOffered.clear();
    this.episodesActive.clear();
    this.episodesCompleted.clear();
    this.currentAuftragId = 'wahl';
    this.electionDay = StoryEngineAdapter.CAMPAIGN_DAYS_DEFAULT;
    this.pollIndex = 0;
    this.lastPollValues = {};
    // Etappe 3 — ImmuneSystem-Zustand zurücksetzen.
    this.noiseRiskToday = 0;
    this.noiseAttentionToday = 0;
    this.patchedFamilies.clear();
    // Etappe 4 — Maschen-Gedächtnis leeren.
    this.maschenGedaechtnis = leeresMaschenGedaechtnis();
    this.lastMaschenDaempfung = null;
    this.letzterFamilienEinsatz = null;
    this.firedAbwehrStages.clear();
    this.pendingAbwehrStages = [];
    this.lastNightReport = null;
    this.reachDampening = 0;
    // Etappe 5 — Geld-Tranchen + Läufer-Historie zurücksetzen.
    this.lastTrancheDay = 0;
    this.lastTrancheProgress = 0;
    this.mahnstufe = 0;
    this.lastTranche = null;
    this.nachspielzeitGenutzt = false;
    this.laeuferHistorie = [];
    this.initializeNPCs();
    this.initializeObjectives();

    // Reset engine components
    this.actionLoader.reset();
    this.consequenceSystem.reset();
    this.countermeasureSystem.reset();
    this.comboSystem.reset();
    this.crisisMomentSystem.reset();
    this.actorAI.reset();
    this.betrayalSystem.reset();
    this.endingSystem.reset();
    this.extendedActorLoader.reset();
  }

  // ============================================
  // ACTOR-AI (ARMS RACE) PUBLIC METHODS
  // ============================================

  /**
   * Get current arms race status for UI display
   */
  getArmsRaceStatus(): {
    armsRaceLevel: number;
    activeDefenders: number;
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
  } {
    return this.actorAI.getStatus();
  }

  /**
   * Get all currently active defensive actors
   */
  getActiveDefenders(): DefensiveActor[] {
    return this.actorAI.getSpawnedActors();
  }

  /**
   * Check if an action is currently disabled by platform moderation
   */
  isActionDisabledByAI(actionId: string): boolean {
    return this.actorAI.isActionDisabled(actionId, this.storyPhase.number);
  }

  /**
   * Get all currently disabled actions with reenable phase
   */
  getDisabledActions(): Record<string, number> {
    return this.actorAI.getDisabledActions();
  }

  // ============================================
  // BETRAYAL SYSTEM PUBLIC METHODS
  // ============================================

  /**
   * Paket C (Etappe 3): Verrats-FOLGEN anwenden — die BetrayalEvent.effects waren
   * seit jeher generiert, aber nie verdrahtet (Zielbild §4, Nebenbefund). Verrat ist
   * KEIN eigener Game-Over mehr, sondern ein dramatisches ABWEHR-Ereignis (+15) mit
   * Leak-Story: Der Überläufer erklärt der Öffentlichkeit die Maschen (Insider-Leck).
   */
  private readonly BETRAYAL_ABWEHR_JUMP = 15;

  applyBetrayalEvent(event: BetrayalEvent): void {
    for (const effect of event.effects) {
      switch (effect.type) {
        case 'risk_increase':
          this.storyResources.risk = Math.min(100, this.storyResources.risk + effect.value);
          break;
        case 'attention_increase':
          this.storyResources.attention = Math.min(100, this.storyResources.attention + effect.value);
          break;
        case 'evidence_exposed':
          // Beweise liegen vor: die Ermittlung beginnt (oder rückt spürbar näher).
          this.exposureCountdown = this.exposureCountdown === null
            ? 10
            : Math.max(1, this.exposureCountdown - 2);
          break;
        case 'network_damage':
          // Geschwächte Netzwerk-Verbindungen dämpfen die eigene Reichweite (wie reach_reduction).
          this.reachDampening = Math.min(0.5, this.reachDampening + effect.value / 100);
          break;
        case 'action_disabled': {
          // Sabotage legt den zuletzt genutzten Kanal für `value` Tage still.
          const lastAction = [...this.actionHistory].reverse()
            .find((h) => !h.actionId.startsWith('op_'))?.actionId;
          if (lastAction) this.actorAI.disableAction(lastAction, this.storyPhase.number + effect.value);
          break;
        }
        case 'npc_lost': {
          const npc = this.npcStates.get(event.npcId);
          if (npc) {
            npc.inCrisis = true;
            npc.available = false;
          }
          break;
        }
        case 'countdown_accelerate':
          this.exposureCountdown = this.exposureCountdown === null
            ? Math.max(3, 12 - effect.value)
            : Math.max(1, this.exposureCountdown - effect.value);
          break;
      }
    }

    // Das Abwehr-Ereignis: der Verrat impft das Land gegen die eigenen Maschen.
    this.raiseAbwehr(this.BETRAYAL_ABWEHR_JUMP);
    this.newsEvents.unshift({
      id: `betrayal_leak_${event.npcId}_${this.storyPhase.number}`,
      phase: this.storyPhase.number,
      headline_de: `Insider packt aus: ${event.npcName}`,
      headline_en: `Insider speaks out: ${event.npcName}`,
      description_de: `${event.consequence_de} Die Öffentlichkeit lernt die Maschen aus erster Hand — die Abwehr springt um +${this.BETRAYAL_ABWEHR_JUMP}.`,
      description_en: `${event.consequence_en} The public learns the schemes first-hand — the defense jumps by +${this.BETRAYAL_ABWEHR_JUMP}.`,
      type: 'consequence',
      severity: 'danger',
      read: false,
      pinned: true,
    });
    playSound('warning');
    storyLogger.log(`[Betrayal] ${event.npcName} (${event.type}/${event.severity}) — Folgen angewandt, Abwehr +${this.BETRAYAL_ABWEHR_JUMP}`);
  }

  /**
   * Get current betrayal status for all NPCs
   */
  getBetrayalStatus(): {
    npcStatuses: Map<string, {
      warningLevel: number;
      redLinesCrossed: string[];
      isBetraying: boolean;
    }>;
    imminentBetrayals: string[];
  } {
    return this.betrayalSystem.getStatus();
  }

  /**
   * Get betrayal history (all warnings issued)
   */
  getBetrayalHistory(): BetrayalWarning[] {
    return this.betrayalSystem.getWarningHistory();
  }

  /**
   * Check if a specific NPC is at betrayal risk
   */
  isNPCAtBetrayalRisk(npcId: string): boolean {
    const status = this.betrayalSystem.getStatus();
    const npcStatus = status.npcStatuses.get(npcId);
    return npcStatus ? npcStatus.warningLevel >= 3 : false;
  }

  /**
   * Get NPC-specific betrayal narrative
   */
  getNPCBetrayalNarrative(npcId: string): { de: string; en: string } | null {
    const warning = this.betrayalSystem.getLatestWarning(npcId);
    if (warning) {
      return {
        de: warning.warning_de,
        en: warning.warning_en,
      };
    }
    return null;
  }

  // ============================================
  // ENDING SYSTEM PUBLIC METHODS
  // ============================================

  /**
   * Check if the game has ended and get the ending
   */
  checkGameEnding(): AssembledEnding | null {
    // Count objectives completed
    const completedObjectives = this.objectives.filter(o => o.completed).length;

    // Count action types from history
    const illegalActions = this.actionHistory.filter(h => {
      const action = this.getActionById(h.actionId);
      return action?.legality === 'illegal';
    }).length;

    const violentActions = this.actionHistory.filter(h => {
      const action = this.getActionById(h.actionId);
      return action?.tags.includes('violence') || action?.tags.includes('harassment');
    }).length;

    const ethicalActions = this.actionHistory.filter(h => {
      const action = this.getActionById(h.actionId);
      return action?.legality === 'legal' && (action?.costs.moralWeight || 0) < 2;
    }).length;

    // Build NPC relationships map
    const npcRelationships: Record<string, number> = {};
    for (const [npcId, npc] of this.npcStates) {
      // Convert relationship level (0-3) and morale (0-100) to relationship score (-100 to 100)
      const relationshipScore = (npc.relationshipLevel * 30) + (npc.morale - 50);
      npcRelationships[npcId] = Math.max(-100, Math.min(100, relationshipScore));
    }

    // Get NPCs lost (in crisis and not available)
    const npcsLost = Array.from(this.npcStates.values())
      .filter(n => n.inCrisis && !n.available)
      .map(n => n.id);

    // Get arms race status
    const armsRaceStatus = this.actorAI.getStatus();

    // Build the game state for ending evaluation
    const gameState: EndingGameState = {
      // Core metrics
      risk: this.storyResources.risk,
      attention: this.storyResources.attention,
      moralWeight: this.storyResources.moralWeight,
      budget: this.storyResources.budget,

      // Progress
      objectivesCompleted: completedObjectives,
      objectivesTotal: this.objectives.length,
      phasesElapsed: this.storyPhase.number,

      // Player behavior
      totalActionsUsed: this.actionHistory.length,
      illegalActionsUsed: illegalActions,
      violentActionsUsed: violentActions,
      ethicalActionsUsed: ethicalActions,

      // NPCs
      npcRelationships,
      npcsBetray: this.betrayalSystem.getBetrayingNPCs(),
      npcsLost,

      // Arms race
      armsRaceLevel: armsRaceStatus.armsRaceLevel,
      defenderCount: armsRaceStatus.activeDefenders,

      // Flags
      flags: [],

      // Crises
      crisesResolved: this.crisisMomentSystem.getResolvedCount(),
      crisesIgnored: this.crisisMomentSystem.getIgnoredCount(),

      // Combos
      combosCompleted: this.comboSystem.getCompletedCount(),
    };

    return this.endingSystem.evaluateEnding(gameState);
  }

  /**
   * Force a specific ending (for testing or narrative triggers)
   */
  forceEnding(category: string, tone: string): AssembledEnding | null {
    return this.endingSystem.forceEnding(category, tone);
  }

  /**
   * Get all possible ending categories for UI preview
   */
  getEndingCategories(): string[] {
    return this.endingSystem.getCategories();
  }

  // ============================================
  // EXTENDED ACTORS PUBLIC METHODS
  // ============================================

  /**
   * Get all extended actors (German media, experts, lobby)
   */
  getExtendedActors(): ExtendedActor[] {
    return this.extendedActorLoader.getAllActors();
  }

  /**
   * Get extended actors by category
   */
  getExtendedActorsByCategory(category: 'media' | 'expert' | 'lobby'): ExtendedActor[] {
    return this.extendedActorLoader.getActorsByCategory(category);
  }

  /**
   * Get a specific extended actor
   */
  getExtendedActor(actorId: string): ExtendedActor | undefined {
    return this.extendedActorLoader.getActor(actorId);
  }

  /**
   * Get effectiveness modifiers for a hypothetical action (for UI preview)
   */
  previewActionEffectiveness(actionTags: string[]): ActorEffectivenessModifier[] {
    return this.extendedActorLoader.calculateEffectivenessModifiers(actionTags, []);
  }

  /**
   * Get suggested targets for an action
   */
  getSuggestedTargets(actionPhase: string, actionTags: string[]): ExtendedActor[] {
    return this.extendedActorLoader.getSuggestedTargets(actionPhase, actionTags);
  }

  /**
   * Get extended actor statistics
   */
  getExtendedActorStats(): {
    totalActors: number;
    byCategory: Record<string, number>;
    averageTrust: number;
    defensiveActors: number;
  } {
    return this.extendedActorLoader.getStats();
  }

  // ============================================
  // NARRATIVE GENERATOR PUBLIC METHODS
  // ============================================

  /**
   * Generate phase transition narrative
   */
  getPhaseNarrative(): { de: string; en: string } {
    return StoryNarrativeGenerator.generatePhaseNarrative(
      this.storyPhase.number,
      {
        risk: this.storyResources.risk,
        attention: this.storyResources.attention,
        moralWeight: this.storyResources.moralWeight,
      },
      this.newsEvents.slice(0, 3).map(e => e.headline_de)
    );
  }

  /**
   * Generate NPC reaction narrative
   */
  getNPCReactionNarrative(
    npcId: string,
    reactionType: 'positive' | 'negative' | 'neutral' | 'crisis'
  ): { de: string; en: string } {
    return StoryNarrativeGenerator.generateNPCReactionNarrative(npcId, reactionType, {
      moralWeight: this.storyResources.moralWeight,
      risk: this.storyResources.risk,
    });
  }

  /**
   * Generate round summary for news ticker
   */
  getRoundSummary(): { de: string; en: string } {
    const actionsThisRound = this.actionHistory.filter(
      h => h.phase === this.storyPhase.number
    ).length;

    const consequencesThisRound = this.newsEvents.filter(
      e => e.phase === this.storyPhase.number && e.type === 'consequence'
    ).length;

    // Calculate trust change (simplified)
    const trustObj = this.objectives.find(o => o.category === 'trust_reduction');
    const trustChange = trustObj ? (trustObj.progress - 50) / 100 : 0;

    return StoryNarrativeGenerator.generateRoundSummary(
      actionsThisRound,
      consequencesThisRound,
      trustChange
    );
  }
}

// ============================================
// FACTORY FUNCTION
// ============================================

/**
 * Etappe 2 (Isolation, Zielbild §13): Ein neues Spiel = ein sauberer Zustand. Vor der
 * Engine-Konstruktion werden ALLE modul-globalen Gameplay-Singletons zurückgesetzt —
 * vorher leakte Zustand (Verrats-Risiko, Verteidiger-Stärke, Aktions-Nutzung, Krisen)
 * zwischen Partien: im Spiel beim Neustart, in Simulationen zwischen Läufen (der
 * Etappe-0-Befund „Feinverteilung kippt je nach Reset-Set" war genau dieses Leck).
 * Loader-Caches laden nur Daten neu — funktional identisch, minimal langsamer.
 */
export function createStoryEngine(seed?: string): StoryEngineAdapter {
  resetStoryActorAI();
  resetStoryComboSystem();
  resetCrisisMomentSystem();
  resetBetrayalSystem();
  resetConsequenceSystem();
  resetActionLoader();
  resetExtendedActorLoader();
  resetAdvisorEngine();
  return new StoryEngineAdapter(seed);
}
