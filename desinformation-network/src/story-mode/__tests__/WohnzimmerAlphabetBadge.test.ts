/**
 * Etappe 4 Paket D (Zielbild §6): Wohnzimmer-Alphabet-Priorität als pure Funktion
 * getestet — fahne (Milieu gekippt) > zeitung (geimpft) > abwinken (Masche bekannt)
 * > streit (wütend) > einsam (misstrauisch). Feste Bildsprache: dasselbe Badge
 * bedeutet immer dasselbe.
 */
import { describe, it, expect } from 'vitest';
import { wohnzimmerBadgeFor, FAHNE_BELIEF_SCHWELLE } from '../broadcast/broadcastMapping';

describe('wohnzimmerBadgeFor — Prioritätsreihenfolge', () => {
  it('fahne schlägt zeitung, abwinken und jede Stimmung, sobald das Milieu gekippt ist', () => {
    const r = wohnzimmerBadgeFor({ bild: 'zeitung', grund_de: 'x', mood: 'wuetend', belief: FAHNE_BELIEF_SCHWELLE });
    expect(r.badge).toBe('fahne');
  });

  it('zeitung (geimpft) schlägt abwinken und Stimmungs-Bilder', () => {
    const r = wohnzimmerBadgeFor({ bild: 'zeitung', grund_de: 'Prebunking hat gewirkt.', mood: 'wuetend', belief: 0.4 });
    expect(r.badge).toBe('zeitung');
    expect(r.title_de).toBe('Prebunking hat gewirkt.');
  });

  it('abwinken (Masche bekannt) schlägt Stimmungs-Bilder', () => {
    const r = wohnzimmerBadgeFor({ bild: 'abwinken', grund_de: 'Masche bekannt — hier winkt man ab.', mood: 'misstrauisch', belief: 0.3 });
    expect(r.badge).toBe('abwinken');
  });

  it('streit bei wütender Stimmung ohne Gedächtnis-Bild', () => {
    const r = wohnzimmerBadgeFor({ bild: null, grund_de: '', mood: 'wuetend', belief: 0.3 });
    expect(r.badge).toBe('streit');
  });

  it('einsam bei misstrauischer Stimmung ohne Gedächtnis-Bild', () => {
    const r = wohnzimmerBadgeFor({ bild: null, grund_de: '', mood: 'misstrauisch', belief: 0.3 });
    expect(r.badge).toBe('einsam');
  });

  it('kein Badge bei ruhiger/verunsicherter Stimmung ohne Gedächtnis-Bild oder Kippen', () => {
    expect(wohnzimmerBadgeFor({ bild: null, grund_de: '', mood: 'ruhig', belief: 0.3 }).badge).toBeNull();
    expect(wohnzimmerBadgeFor({ bild: null, grund_de: '', mood: 'verunsichert', belief: 0.3 }).badge).toBeNull();
  });

  it('dasselbe Badge bedeutet immer dasselbe: identischer Input → identisches Ergebnis', () => {
    const a = wohnzimmerBadgeFor({ bild: 'abwinken', grund_de: 'g', mood: 'ruhig', belief: 0.1 });
    const b = wohnzimmerBadgeFor({ bild: 'abwinken', grund_de: 'g', mood: 'ruhig', belief: 0.1 });
    expect(a).toEqual(b);
  });
});
