/**
 * VictorySystem — die Sieg-/Niederlage-ENTSCHEIDUNG als pure, testbare Funktion.
 * =============================================================================
 * Etappe 1 „Auftrag = Sieg" (2026-07-04, `ZIELBILD_2026-07-04_WETTRENNEN.md`).
 *
 * Bisher entschied `StoryEngineAdapter.checkGameEnd()` (im 6463-Zeilen-Monolithen)
 * den Ausgang inline — und der Sieg hing an `obj_destabilize` (Institutionen-Vertrauen
 * unter 40 % über 3 Phasen HALTEN). Das war die „zweite Anzeigetafel", die vom
 * eigentlichen Auftrag entkoppelt war.
 *
 * Neu: **Der Auftrag IST der Sieg.** Gewonnen wird, wenn die schwächste Achse der
 * Auftrags-Signatur ihr Ziel erreicht (Min-Regel — eine überdrehte Achse trägt keine
 * vernachlässigte; siehe `auftragProgress(..., 'min')`). Vertrauen ist nur noch das
 * Mittel (eine Signatur-Achse unter mehreren), nicht mehr das Ziel. Das „3 Phasen
 * halten" entfällt; in Etappe 2 erzwingt der Wahltag (Stichtag) + die nächtliche
 * Regeneration das Verteidigen bis zum Schluss.
 *
 * Diese Datei enthält NUR die Entscheidung (welcher Ausgangs-Zweig). Die erzählerischen
 * Texte/Endings bleiben im Adapter. So ist die Logik isoliert testbar und Etappe 3
 * (ImmuneSystem) kann denselben Weg gehen.
 */

/** Die möglichen Spielausgänge, in Prioritätsreihenfolge ausgewertet. */
export type EndBranch =
  | 'victory'          // Auftrag erfüllt
  | 'exposed'          // enttarnt (Risiko ≥ Schwelle, Auftrag noch nicht erfüllt)
  | 'immune'           // das Land hält stand (Abwehr ≥ 100, Etappe 3)
  | 'timeout';         // Wahltag erreicht, Auftrag verfehlt („Wahlabend verloren")
// Etappe 5 (Paket C) — Enden-Beschnitt (Zielbild §4/§12.5, D4): EIN Siegweg, DREI
// Verlustwege (immune · timeout · exposed). Weggefallen als eigene Game-Over:
//   - 'broke' → die Pleite ist nur die VORSTUFE von „Wahlabend verloren" (kein eigener
//     Bildschirm): kein Geld → keine Aktionen → kein Fortschritt → Timeout (§4/§11).
//   - 'moral_redemption'/'escape' → Epilog-Färbungen statt eigener End-Checks.
//   - 'apparatus' (Verrat) → schon in Etappe 3 zum +15-ABWEHR-Ereignis geworden.

// --- Schwellen (zentral, damit Balancing sie an EINER Stelle findet) ---------
export const EXPOSED_RISK = 85;          // Enttarnung
export const IMMUNE_ABWEHR = 100;        // das Land ist immun (Etappe 3, Zielbild §4)

export interface EndEvaluationInput {
  /** Fortschritt der SCHWÄCHSTEN Signatur-Achse (0..1), Min-Regel. */
  auftragProgressMin: number;
  /** Ab hier gilt der Auftrag als erfüllt (Sieg). Default-Kalibrierung im Adapter. */
  winThreshold: number;
  /** ABWEHR 0–100 (befördertes `wehrhaftigkeit`, Etappe 3) — der zweite Rennläufer. */
  abwehr: number;
  risk: number;
  phaseNumber: number;
  /** Der Wahltag (electionDay) — Timeout = „Wahlabend verloren". */
  maxPhases: number;
}

export interface EndDecision {
  branch: EndBranch;
  /** true, wenn der Auftrag erfüllt ist — für „Enttarnung schlägt noch nicht gesicherten Sieg". */
  auftragMet: boolean;
}

/**
 * Wertet den Spielzustand aus und liefert den Ausgangs-Zweig — oder null (Spiel läuft weiter).
 * Prioritätsreihenfolge bewusst identisch zur bisherigen `checkGameEnd`, nur die
 * Sieg-BEDINGUNG ist neu (Auftrags-Signatur statt gehaltenem Vertrauen).
 */
export function evaluateEnd(i: EndEvaluationInput): EndDecision | null {
  const auftragMet = i.auftragProgressMin >= i.winThreshold;

  // PRIORITY 0: Enttarnung schlägt einen noch NICHT erfüllten Auftrag.
  if (i.risk >= EXPOSED_RISK && !auftragMet) return { branch: 'exposed', auftragMet };

  // PRIORITY 0b: Das Land hält stand — die Abwehr ist voll, das Land ist immun.
  // Bewusst VOR dem Sieg: Der Sieg verlangt „Abwehr unter 100" (Zielbild §4) —
  // erreicht das Immunsystem die 100 zuerst, ist die Operation gescheitert,
  // selbst wenn die Signatur rechnerisch im Ziel steht.
  if (i.abwehr >= IMMUNE_ABWEHR) return { branch: 'immune', auftragMet };

  // PRIORITY 1: Sieg — der Auftrag ist erfüllt.
  if (auftragMet) return { branch: 'victory', auftragMet };

  // (Ehemals 'apparatus'/'broke'/'moral_redemption'/'escape' — Etappe 5 Enden-Beschnitt:
  //  Verrat = Abwehr-Ereignis, Pleite = Vorstufe des Timeout, Gewissen/Flucht = Epilog-Farbe.)

  // PRIORITY 2: Wahltag erreicht, Auftrag verfehlt → am Auftrag gescheitert.
  if (i.phaseNumber >= i.maxPhases) return { branch: 'timeout', auftragMet };

  return null;
}
