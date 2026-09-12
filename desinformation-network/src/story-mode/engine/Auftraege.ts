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

/** Fiktiver Parteiname (Zielbild §8/D2) — EIN Name statt der früheren vier. */
export const PARTEI_NAME_DE = 'Westunion Erwacht';

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
    istDefault: true,
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

/** Auftrags-spezifischer Schluss-Satz fürs Ende (DE/EN) — jeder Auftrag endet anders. */
export function auftragEpilog(id: AuftragId): { de: string; en: string } {
  switch (id) {
    case 'keil':
      return {
        de: 'Auftrag „Der Keil": Das Land ist tief gespalten — der Kulturkampf frisst jeden Diskurs.',
        en: 'Mission "The Wedge": The country is deeply split — the culture war devours every debate.',
      };
    case 'wahl':
      return {
        de: 'Auftrag „Die Wahl": Die uns nahe Kraft ist erstarkt, die etablierten Kräfte sind zermürbt.',
        en: 'Mission "The Election": Our preferred faction has risen; the establishment is worn down.',
      };
    case 'zweifel':
      return {
        de: 'Auftrag „Der Zweifel": Man glaubt nichts mehr — nicht den Wahlen, nicht den Medien, nicht einander.',
        en: 'Mission "The Doubt": Nobody believes anything anymore — not the vote, not the media, not each other.',
      };
  }
}

export function getDefaultAuftrag(): Auftrag {
  return AUFTRAEGE.wahl;   // Etappe 1: EIN Auftrag „Die Wahl" (Zielbild §8)
}

/**
 * P1-1: Erfüllungs-Verdikt des Auftrags fürs Sieg-Ende (Vertrauen = Mittel, Auftrag = Ziel).
 * Aus dem Signatur-Fortschritt (0..1): voll erfüllt ≥0.6 · teilweise ≥0.35 · sonst „hohler Sieg".
 * Macht den Auftrag mechanisch sichtbar — der Sieg fühlt sich je nach erreichtem Ziel anders an.
 */
export function auftragMissionVerdict(progress: number, titel: string): { de: string; en: string } {
  if (progress >= 0.6) {
    return { de: `Auftrag „${titel}" voll erfüllt. `, en: `Mission "${titel}" fully accomplished. ` };
  }
  if (progress >= 0.35) {
    return {
      de: `Auftrag „${titel}" nur teilweise erfüllt — der eigentliche gesellschaftliche Umbau blieb auf halbem Weg. `,
      en: `Mission "${titel}" only partly accomplished — the real societal shift stalled halfway. `,
    };
  }
  return {
    de: `Hohler Sieg: Das Institutionen-Vertrauen ist gebrochen, doch „${titel}" — Ihr eigentliches Ziel — blieb unerreicht. `,
    en: `A hollow victory: institutional trust is broken, yet "${titel}" — your actual goal — went unachieved. `,
  };
}

/**
 * Fortschritt eines Auftrags (0..1): wie weit die Signatur-Achsen ihr Ziel erreicht haben.
 *
 * - `'mean'` (Default): gemittelt — für die Anzeige (HUD/Instrument) und das Enden-Verdikt.
 * - `'min'`: die SCHWÄCHSTE Achse — für den SIEG-Check (Etappe 1). Min-Regel, damit eine
 *   überdrehte Achse keine zwei vernachlässigten trägt: gewonnen wird erst, wenn JEDE
 *   Signatur-Achse ihr Ziel erreicht.
 */
/**
 * Anteil des Weges, den JEDE Signatur-Achse zurückgelegt haben muss, damit der
 * Auftrag als erfüllt gilt.
 *
 * Die Zahl lag als private Konstante im Adapter, während die Akte gegen den
 * VOLLEN Zielwert rechnete. Folge: Im Moment des Sieges standen alle Balken bei
 * 60 % und trugen kein Häkchen — der Spieler konnte seinen Sieg nicht kommen
 * sehen. Sie steht jetzt bei der Fortschrittsrechnung, damit Engine und Anzeige
 * dieselbe Quelle haben.
 *
 * 0.6 ist eine dokumentierte Zwischenkalibrierung mit Carry-forward auf 1.0
 * (ZIELBILD §4, STATUS.md).
 */
export const AUFTRAG_SIEG_SCHWELLE = 0.6;

/** Stand einer einzelnen Signatur-Achse — gemeinsame Grundlage für Engine und Akte. */
export interface AchsenStand {
  wert: SocietyValueKey | 'vertrauen';
  richtung: 'hoch' | 'runter';
  /** Ist-Wert; `start`, solange nichts vorliegt. */
  ist: number;
  start: number;
  /** Der volle Zielwert aus der Auftrags-Signatur. */
  ziel: number;
  /** Der Wert, ab dem diese Achse als erfüllt gilt (Siegmarke). */
  siegWert: number;
  /** Zurückgelegter Anteil 0..1 zum VOLLEN Ziel. */
  fortschritt: number;
  /** Siegmarke erreicht? Das ist die Bedingung, die der Siegcheck prüft. */
  erfuellt: boolean;
  /** Volles Ziel erreicht — darüber hinaus, nicht nötig für den Sieg. */
  uebererfuellt: boolean;
  /** Die schwächste Achse: Sie allein hält den Sieg auf (Min-Regel). */
  klemmt: boolean;
}

/**
 * Der Stand aller Signatur-Achsen, inklusive Siegmarke und klemmender Achse.
 *
 * Wer diese Funktion nutzt, kann den Siegcheck nicht mehr verfehlen: Sie
 * rechnet mit derselben Formel wie `auftragProgress` und derselben Schwelle
 * wie `checkGameEnd`.
 */
export function achsenStaende(
  auftrag: Auftrag,
  values: Partial<Record<SocietyValueKey | 'vertrauen', number>>,
  schwelle: number = AUFTRAG_SIEG_SCHWELLE,
): AchsenStand[] {
  const staende: AchsenStand[] = auftrag.signatur.map((sig) => {
    const ist = typeof values[sig.wert] === 'number' ? (values[sig.wert] as number) : sig.start;
    const span = Math.abs(sig.ziel - sig.start) || 1;
    const roh = sig.richtung === 'hoch' ? (ist - sig.start) / span : (sig.start - ist) / span;
    const fortschritt = Math.max(0, Math.min(1, roh));
    // Die Siegmarke liegt auf demselben Weg, nur bei `schwelle` statt bei 1.
    const siegWert = sig.richtung === 'hoch'
      ? sig.start + span * schwelle
      : sig.start - span * schwelle;
    return {
      wert: sig.wert,
      richtung: sig.richtung,
      ist,
      start: sig.start,
      ziel: sig.ziel,
      siegWert,
      fortschritt,
      erfuellt: fortschritt >= schwelle,
      uebererfuellt: sig.richtung === 'hoch' ? ist >= sig.ziel : ist <= sig.ziel,
      klemmt: false,
    };
  });

  // Min-Regel: Die schwächste Achse entscheidet. Bei Gleichstand klemmt die erste.
  if (staende.length > 0) {
    const min = Math.min(...staende.map((s) => s.fortschritt));
    const idx = staende.findIndex((s) => s.fortschritt === min);
    if (idx >= 0 && !staende[idx].erfuellt) staende[idx].klemmt = true;
  }
  return staende;
}

export function auftragProgress(
  auftrag: Auftrag,
  values: Partial<Record<SocietyValueKey | 'vertrauen', number>>,
  mode: 'mean' | 'min' = 'mean',
): number {
  if (auftrag.signatur.length === 0) return 0;
  const perAxis: number[] = [];
  for (const sig of auftrag.signatur) {
    const v = values[sig.wert];
    if (typeof v !== 'number') continue;
    // Fortschritt = Annäherung vom Startwert ans Ziel in der vorgesehenen Richtung.
    const span = Math.abs(sig.ziel - sig.start) || 1;
    const p = sig.richtung === 'hoch'
      ? (v - sig.start) / span
      : (sig.start - v) / span;
    perAxis.push(Math.max(0, Math.min(1, p)));
  }
  if (perAxis.length === 0) return 0;
  if (mode === 'min') return Math.min(...perAxis);
  // 'mean' teilt bewusst durch die volle Signatur-Länge (fehlende Achsen zählen als 0).
  return perAxis.reduce((a, b) => a + b, 0) / auftrag.signatur.length;
}
