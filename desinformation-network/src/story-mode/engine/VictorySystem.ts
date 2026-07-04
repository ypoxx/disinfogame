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
  | 'apparatus'        // der Apparat zerfällt (zu viele Verräter)
  | 'broke'            // mittellos (Kasse leer bei hohem Risiko)
  | 'moral_redemption' // Gewissensentscheidung
  | 'escape'           // Flucht (kritisches Risiko, Gelegenheit)
  | 'timeout';         // Zeit/Wahltag erreicht, Auftrag verfehlt

// --- Schwellen (zentral, damit Balancing sie an EINER Stelle findet) ---------
export const EXPOSED_RISK = 85;          // Enttarnung
export const IMMUNE_ABWEHR = 100;        // das Land ist immun (Etappe 3, Zielbild §4)
export const APPARATUS_BETRAYERS = 3;    // Apparat zerfällt
export const BROKE_RISK = 70;            // Mittellos (zusammen mit Budget ≤ 0)
export const MORAL_REDEMPTION_WEIGHT = 80;
export const ESCAPE_RISK_MIN = 75;       // Flucht-Fenster (bis < EXPOSED_RISK)

export interface EndEvaluationInput {
  /** Fortschritt der SCHWÄCHSTEN Signatur-Achse (0..1), Min-Regel. */
  auftragProgressMin: number;
  /** Ab hier gilt der Auftrag als erfüllt (Sieg). Default-Kalibrierung im Adapter. */
  winThreshold: number;
  /** ABWEHR 0–100 (befördertes `wehrhaftigkeit`, Etappe 3) — der zweite Rennläufer. */
  abwehr: number;
  risk: number;
  budget: number;
  betrayingNpcs: number;
  moralWeight: number;
  allNpcsLost: boolean;
  exposureCountdown: number | null;
  phaseNumber: number;
  /** Letzte Phase (aktuell Phasen-Limit; ab Etappe 2 der Wahltag). */
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

  // PRIORITY 1b: Der Apparat zerfällt von innen.
  if (i.betrayingNpcs >= APPARATUS_BETRAYERS) return { branch: 'apparatus', auftragMet };

  // PRIORITY 1c: Handlungsunfähig — Kasse leer bei hohem Risiko.
  if (i.budget <= 0 && i.risk >= BROKE_RISK) return { branch: 'broke', auftragMet };

  // PRIORITY 3: Gewissensentscheidung.
  if (i.moralWeight >= MORAL_REDEMPTION_WEIGHT && i.allNpcsLost) {
    return { branch: 'moral_redemption', auftragMet };
  }

  // PRIORITY 4: Flucht — kritisches Risiko + Fluchtgelegenheit.
  if (
    i.risk >= ESCAPE_RISK_MIN &&
    i.risk < EXPOSED_RISK &&
    i.moralWeight < 50 &&
    i.exposureCountdown !== null &&
    i.exposureCountdown <= 1
  ) {
    return { branch: 'escape', auftragMet };
  }

  // PRIORITY 5: Zeit/Wahltag erreicht, Auftrag verfehlt → am Auftrag gescheitert.
  if (i.phaseNumber >= i.maxPhases) return { branch: 'timeout', auftragMet };

  return null;
}
