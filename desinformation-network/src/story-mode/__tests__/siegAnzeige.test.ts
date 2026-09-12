import { describe, it, expect } from 'vitest';
import {
  achsenStaende,
  auftragProgress,
  getAuftrag,
  AUFTRAG_SIEG_SCHWELLE,
  type Auftrag,
} from '../engine/Auftraege';
import { StoryEngineAdapter } from '../../game-logic/StoryEngineAdapter';

/**
 * Wache: Die Akte muss dasselbe rechnen wie der Siegcheck.
 *
 * Vorgeschichte: `checkGameEnd` verlangt, dass jede Signatur-Achse 60 % ihres
 * Weges zurückgelegt hat. Das MissionPanel rechnete dagegen gegen den VOLLEN
 * Zielwert und beschriftete „Ziel 55", während der Sieg schon bei 43 fiel.
 * Im Moment des Sieges standen damit alle Balken bei 60 % und trugen kein
 * Häkchen — der Spieler konnte seinen Sieg weder kommen sehen noch erkennen.
 *
 * Beide Seiten nutzen jetzt `achsenStaende`. Diese Tests halten fest, dass die
 * Ableitung deckungsgleich mit dem Siegcheck bleibt.
 */

const wahl: Auftrag = getAuftrag('wahl');

/** Setzt jede Achse genau auf den Anteil `p` ihres Weges. */
function werteBei(auftrag: Auftrag, p: number): Record<string, number> {
  const v: Record<string, number> = {};
  for (const s of auftrag.signatur) {
    const span = Math.abs(s.ziel - s.start) || 1;
    v[s.wert] = s.richtung === 'hoch' ? s.start + span * p : s.start - span * p;
  }
  return v;
}

describe('Siegmarke und Anzeige', () => {
  it('die Schwelle ist die, mit der die Engine rechnet', () => {
    const engine = new StoryEngineAdapter('sieg-anzeige');
    expect(engine.getWinThreshold()).toBe(AUFTRAG_SIEG_SCHWELLE);
  });

  it('am Startwert ist keine Achse erfüllt', () => {
    const staende = achsenStaende(wahl, werteBei(wahl, 0));
    expect(staende.length).toBeGreaterThan(0);
    expect(staende.every((s) => !s.erfuellt)).toBe(true);
  });

  it('genau an der Schwelle gilt jede Achse als erfüllt', () => {
    const staende = achsenStaende(wahl, werteBei(wahl, AUFTRAG_SIEG_SCHWELLE));
    expect(staende.every((s) => s.erfuellt), 'Bei exakt 60 % muss das Häkchen stehen').toBe(true);
  });

  it('knapp unter der Schwelle ist noch keine Achse erfüllt', () => {
    const staende = achsenStaende(wahl, werteBei(wahl, AUFTRAG_SIEG_SCHWELLE - 0.02));
    expect(staende.every((s) => !s.erfuellt)).toBe(true);
  });

  it('erfüllt-Zustand und Min-Fortschritt sagen dasselbe', () => {
    // Der Siegcheck nimmt auftragProgress(..., 'min') >= Schwelle. Beide Wege
    // müssen bei jedem Stand zum selben Urteil kommen.
    for (const p of [0, 0.2, 0.59, 0.6, 0.61, 0.9, 1]) {
      const werte = werteBei(wahl, p);
      const alleErfuellt = achsenStaende(wahl, werte).every((s) => s.erfuellt);
      const minProgress = auftragProgress(wahl, werte, 'min');
      expect(alleErfuellt, `Bei Anteil ${p} widersprechen sich Anzeige und Siegcheck`)
        .toBe(minProgress >= AUFTRAG_SIEG_SCHWELLE - 1e-9);
    }
  });

  it('die Siegmarke liegt auf dem Weg zwischen Start und Ziel', () => {
    for (const s of achsenStaende(wahl, werteBei(wahl, 0))) {
      const min = Math.min(s.start, s.ziel);
      const max = Math.max(s.start, s.ziel);
      expect(s.siegWert).toBeGreaterThanOrEqual(min);
      expect(s.siegWert).toBeLessThanOrEqual(max);
    }
  });

  it('markiert genau eine klemmende Achse, solange der Auftrag offen ist', () => {
    const werte = werteBei(wahl, 0.7);
    // Eine Achse absichtlich zurückhalten.
    const erste = wahl.signatur[0];
    const span = Math.abs(erste.ziel - erste.start) || 1;
    werte[erste.wert] = erste.richtung === 'hoch' ? erste.start + span * 0.1 : erste.start - span * 0.1;

    const staende = achsenStaende(wahl, werte);
    const klemmende = staende.filter((s) => s.klemmt);
    expect(klemmende).toHaveLength(1);
    expect(klemmende[0].wert).toBe(erste.wert);
  });

  it('markiert keine klemmende Achse, wenn alle erfüllt sind', () => {
    const staende = achsenStaende(wahl, werteBei(wahl, 1));
    expect(staende.some((s) => s.klemmt)).toBe(false);
  });

  it('unterscheidet erfüllt von übererfüllt', () => {
    const anDerMarke = achsenStaende(wahl, werteBei(wahl, AUFTRAG_SIEG_SCHWELLE));
    expect(anDerMarke.every((s) => s.erfuellt)).toBe(true);
    expect(anDerMarke.every((s) => !s.uebererfuellt), 'An der Marke ist das volle Ziel noch nicht erreicht').toBe(true);

    const amZiel = achsenStaende(wahl, werteBei(wahl, 1));
    expect(amZiel.every((s) => s.uebererfuellt)).toBe(true);
  });
});
