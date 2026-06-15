/**
 * Zentraler ID-Validator (P0 — Risiko R3/R4).
 *
 * actionIds/targetIds/npcIds/episodeIds werden quer als reine Strings referenziert,
 * ohne Validierung. Tote Refs (z. B. eine Episode zeigt auf eine gelöschte Aktion)
 * fallen sonst erst zur Laufzeit oder gar nicht auf. Diese pure Funktion prüft die
 * geladenen Datensätze beim Start und meldet tote Verweise als Warnungen — sie ändert
 * KEIN Spielverhalten, sie diagnostiziert nur.
 *
 * Bewusst tolerant: unbekannte Felder werden ignoriert, alles ist optional, damit der
 * Validator additiv mit neuen Datenarten (Episoden B1) mitwächst, ohne je zu werfen.
 */

import { storyLogger } from '../../utils/logger';

export interface ValidationIssue {
  severity: 'error' | 'warning';
  /** Maschinenlesbarer Code, z. B. 'dead_prerequisite' — für Tests/Filter. */
  code: string;
  message: string;
}

/** Minimale Form einer Aktion, wie der Validator sie braucht (LoadedAction erfüllt sie). */
export interface ActionRef {
  id: string;
  prerequisites?: string[];
  unlocks?: string[];
  npc_affinity?: string[];
}

/** Minimale Form eines Ziels inkl. seiner Schwachstellen-IDs. */
export interface TargetRef {
  id: string;
  vulnerabilities?: { id: string }[];
}

/** Minimale Form einer Episode (B1, P4) — alle Refs optional. */
export interface EpisodeRef {
  id: string;
  beteiligte?: {
    ziel?: string | null;
    anbieter_npc?: string | null;
    stimmen_npc?: string[];
  };
  einklink_aktionen?: string[];
  lernmoment_id?: string | null;
}

export interface ValidationInput {
  actions: ActionRef[];
  npcs: { id: string }[];
  targets?: TargetRef[];
  /** Methoden-IDs aus disinfo_methods.json (Lernmoment-Refs der Episoden). */
  methods?: { id: string }[];
  episodes?: EpisodeRef[];
}

/**
 * Prüft alle bekannten ID-Kopplungen und liefert eine Liste von Befunden.
 * Pure Funktion (keine Seiteneffekte) → leicht testbar.
 */
export function validateReferences(input: ValidationInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const actionIds = new Set<string>();
  for (const a of input.actions) {
    if (actionIds.has(a.id)) {
      issues.push({ severity: 'error', code: 'duplicate_action_id', message: `Doppelte Aktions-ID: ${a.id}` });
    }
    actionIds.add(a.id);
  }
  const npcIds = new Set(input.npcs.map(n => n.id));
  const targetIds = new Set((input.targets ?? []).map(t => t.id));
  const methodIds = new Set((input.methods ?? []).map(m => m.id));

  // Aktionen: Prerequisites/Unlocks → bekannte Aktionen; npc_affinity → bekannte NPCs.
  for (const a of input.actions) {
    for (const p of a.prerequisites ?? []) {
      if (!actionIds.has(p)) {
        issues.push({ severity: 'warning', code: 'dead_prerequisite', message: `Aktion ${a.id}: Voraussetzung „${p}" ist keine bekannte Aktion.` });
      }
    }
    for (const u of a.unlocks ?? []) {
      if (!actionIds.has(u)) {
        issues.push({ severity: 'warning', code: 'dead_unlock', message: `Aktion ${a.id}: schaltet „${u}" frei — keine bekannte Aktion.` });
      }
    }
    for (const n of a.npc_affinity ?? []) {
      if (!npcIds.has(n)) {
        issues.push({ severity: 'warning', code: 'dead_npc_affinity', message: `Aktion ${a.id}: npc_affinity „${n}" ist kein bekannter NPC.` });
      }
    }
  }

  // Episoden (B1): jede Ref muss aufgehen, sonst bricht die Wirbelsäule still.
  const episodeIds = new Set<string>();
  for (const ep of input.episodes ?? []) {
    if (episodeIds.has(ep.id)) {
      issues.push({ severity: 'error', code: 'duplicate_episode_id', message: `Doppelte Episoden-ID: ${ep.id}` });
    }
    episodeIds.add(ep.id);

    const ziel = ep.beteiligte?.ziel;
    if (ziel && !targetIds.has(ziel)) {
      issues.push({ severity: 'warning', code: 'episode_dead_target', message: `Episode ${ep.id}: Ziel „${ziel}" ist kein bekanntes Target.` });
    }
    const anbieter = ep.beteiligte?.anbieter_npc;
    if (anbieter && !npcIds.has(anbieter)) {
      issues.push({ severity: 'warning', code: 'episode_dead_npc', message: `Episode ${ep.id}: anbieter_npc „${anbieter}" ist kein bekannter NPC.` });
    }
    for (const s of ep.beteiligte?.stimmen_npc ?? []) {
      if (!npcIds.has(s)) {
        issues.push({ severity: 'warning', code: 'episode_dead_npc', message: `Episode ${ep.id}: stimmen_npc „${s}" ist kein bekannter NPC.` });
      }
    }
    for (const act of ep.einklink_aktionen ?? []) {
      if (!actionIds.has(act)) {
        issues.push({ severity: 'warning', code: 'episode_dead_action', message: `Episode ${ep.id}: Einklink-Aktion „${act}" ist keine bekannte Aktion.` });
      }
    }
    if (ep.lernmoment_id && methodIds.size > 0 && !methodIds.has(ep.lernmoment_id)) {
      issues.push({ severity: 'warning', code: 'episode_dead_method', message: `Episode ${ep.id}: lernmoment_id „${ep.lernmoment_id}" ist keine bekannte Methode.` });
    }
  }

  return issues;
}

/**
 * Loggt die Befunde (Warnungen/Fehler) einmalig. Reiner Diagnose-Ausgang —
 * kein Wurf, kein Abbruch (Spiel läuft auch mit Datenfehlern weiter).
 */
export function reportValidationIssues(issues: ValidationIssue[]): void {
  if (issues.length === 0) {
    storyLogger.log('[IdValidator] Datenintegrität OK — keine toten Referenzen.');
    return;
  }
  for (const issue of issues) {
    const prefix = issue.severity === 'error' ? '❌ [IdValidator]' : '⚠️ [IdValidator]';
    storyLogger.warn(`${prefix} ${issue.message}`);
  }
}
