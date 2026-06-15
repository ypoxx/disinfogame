/**
 * Strategische Aufträge (P5, Konzept §14.1) — „Vertrauen = Mittel, Auftrag = Ziel".
 *
 * In der Realität bricht eine Gesellschaft durch Desinfo nicht einfach „zusammen" —
 * man erreicht bestimmte Ziele. Vertrauenserosion ist das gemeinsame MITTEL; der
 * Auftrag ist das ZIEL und hat eine eigene Wert-SIGNATUR + ein erzählerisches
 * Mess-Instrument (§14.2). v1: obj_destabilize bleibt der spielbare Sieg, die Signatur
 * bestimmt WELCHES Ende + macht den Fortschritt lesbar.
 *
 * Pure Daten + Helfer, kein Math.random/React → testbar.
 */

import type { SocietyValueKey } from '../../game-logic/StoryEngineAdapter';

export type AuftragId = 'keil' | 'wahl' | 'zweifel';

/** Eine Signatur-Achse: in welche Richtung sich ein Wert für den Auftrag bewegen soll. */
export interface AuftragSignatur {
  wert: SocietyValueKey | 'vertrauen';
  richtung: 'hoch' | 'runter';
  /** Startwert (createInitialResources) — Bezugspunkt für den Fortschritt. */
  start: number;
  /** Zielmarke (0–100), an der die Achse als „erfüllt" gilt. */
  ziel: number;
}

export interface Auftrag {
  id: AuftragId;
  titel_de: string;
  kurz_de: string;
  beschreibung_de: string;
  /** Erzählerisches Mess-Instrument (§14.2), das den Fortschritt sichtbar macht. */
  instrument_de: string;
  signatur: AuftragSignatur[];
  istDefault?: boolean;
}

export const AUFTRAEGE: Record<AuftragId, Auftrag> = {
  keil: {
    id: 'keil',
    titel_de: 'Der Keil',
    kurz_de: 'Gesellschaft an einem Reizthema spalten',
    beschreibung_de:
      'Ein Reizthema so aufladen, dass der Kulturkampf den Diskurs frisst. Nicht überzeugen — spalten.',
    instrument_de: 'Westunion-Stimmungsbarometer (Lager-Abstand)',
    signatur: [
      { wert: 'polarisierung', richtung: 'hoch', start: 25, ziel: 65 },
      { wert: 'fragmentierung', richtung: 'hoch', start: 15, ziel: 45 },
      { wert: 'diskursqualitaet', richtung: 'runter', start: 70, ziel: 40 },
    ],
    istDefault: true,
  },
  wahl: {
    id: 'wahl',
    titel_de: 'Die Wahl',
    kurz_de: 'Eine politische Kraft kippen',
    beschreibung_de:
      'Eine uns nahe Kraft stärken und die Beteiligung der anderen drücken, bis das Land driftet.',
    instrument_de: 'Westunion-Wahltrend / Politbarometer',
    signatur: [
      { wert: 'fraktionsstaerke', richtung: 'hoch', start: 25, ziel: 55 },
      { wert: 'vertrauen', richtung: 'runter', start: 100, ziel: 50 },
      { wert: 'zynismus', richtung: 'hoch', start: 20, ziel: 45 },
    ],
  },
  zweifel: {
    id: 'zweifel',
    titel_de: 'Der Zweifel',
    kurz_de: 'Wahlen, Fakten, Institutionen delegitimieren',
    beschreibung_de:
      'Nicht eine Lüge durchsetzen, sondern dass man nichts mehr glaubt — Wahlen „manipuliert", Experten „gekauft".',
    instrument_de: 'Westunion-Vertrauensindex (Institutionen/Medien)',
    signatur: [
      { wert: 'vertrauen', richtung: 'runter', start: 100, ziel: 45 },
      { wert: 'zynismus', richtung: 'hoch', start: 20, ziel: 60 },
      { wert: 'diskursqualitaet', richtung: 'runter', start: 70, ziel: 35 },
    ],
  },
};

export function getAuftrag(id: AuftragId): Auftrag {
  return AUFTRAEGE[id];
}

export function getDefaultAuftrag(): Auftrag {
  return AUFTRAEGE.keil;
}

/**
 * Fortschritt eines Auftrags (0..1): wie weit die Signatur-Achsen ihr Ziel erreicht haben,
 * gemittelt. Für die Anzeige (HUD/Instrument) und die spätere Enden-Auswahl.
 */
export function auftragProgress(
  auftrag: Auftrag,
  values: Partial<Record<SocietyValueKey | 'vertrauen', number>>,
): number {
  if (auftrag.signatur.length === 0) return 0;
  let sum = 0;
  for (const sig of auftrag.signatur) {
    const v = values[sig.wert];
    if (typeof v !== 'number') continue;
    // Fortschritt = Annäherung vom Startwert ans Ziel in der vorgesehenen Richtung.
    const span = Math.abs(sig.ziel - sig.start) || 1;
    const p = sig.richtung === 'hoch'
      ? (v - sig.start) / span
      : (sig.start - v) / span;
    sum += Math.max(0, Math.min(1, p));
  }
  return sum / auftrag.signatur.length;
}
