/**
 * terminalCuration — M2 „kuratieren statt Katalog" (Plan L2, UX-Entscheid §4.5):
 * Die Eingangstür des Terminals zeigt eine anlassbezogene Auswahl (3–8
 * Vorgänge); der volle Katalog liegt bewusst eine Schublade tiefer („ARCHIV").
 *
 * Pure Funktion, testbar ohne React. Rangfolge (stabil innerhalb der Stufe):
 *   0 aktiver Episoden-Strang (einklink_aktionen)
 *   1 Berater-Empfehlung
 *   2 leistbar UND Masche nicht überall verbrannt (E7: Frische zählt)
 *   3 leistbar, aber abgenutzt
 *   4 Rest (aktuell nicht leistbar)
 * Gesperrte/verbrauchte Aktionen erscheinen in der Tür NIE (nur im Archiv).
 */
import type { StoryAction, MaschenVorschau } from './ActionCard';

export interface CurationInput {
  actions: StoryAction[];
  episodeActionIds: string[];
  recommendedActionIds: string[];
  resources: { budget: number; capacity: number };
  getMaschenVorschau?: (actionId: string) => MaschenVorschau | null;
  /** Obergrenze der Tür-Auswahl (M2: 8). */
  max?: number;
}

export function istLeistbar(a: StoryAction, resources: { budget: number; capacity: number }): boolean {
  if (a.costs.budget && a.costs.budget > resources.budget) return false;
  if (a.costs.capacity && a.costs.capacity > resources.capacity) return false;
  return true;
}

/** Masche in ALLEN Ziel-Milieus verbrannt ⇒ Geld verbrennen wäre absehbar (E7). */
export function istVerbrannt(vorschau: MaschenVorschau | null | undefined): boolean {
  if (!vorschau || vorschau.stempel.length === 0) return false;
  return vorschau.stempel.every((s) => s.stempel === 'verbrannt');
}

export function kuratiereVorgaenge(input: CurationInput): StoryAction[] {
  const { actions, resources, getMaschenVorschau } = input;
  const episode = new Set(input.episodeActionIds);
  const empfohlen = new Set(input.recommendedActionIds);
  const max = Math.max(3, Math.min(input.max ?? 8, 8));

  const pool = actions.filter((a) => a.isUnlocked && !a.isUsed);
  const rang = (a: StoryAction): number => {
    if (episode.has(a.id)) return 0;
    if (empfohlen.has(a.id)) return 1;
    const leistbar = istLeistbar(a, resources);
    if (leistbar && !istVerbrannt(getMaschenVorschau?.(a.id))) return 2;
    if (leistbar) return 3;
    return 4;
  };
  // Stabil sortieren: Rang entscheidet, Eingangs-Reihenfolge bleibt sonst erhalten.
  return pool
    .map((a, i) => ({ a, r: rang(a), i }))
    .sort((x, y) => x.r - y.r || x.i - y.i)
    .slice(0, max)
    .map((x) => x.a);
}
