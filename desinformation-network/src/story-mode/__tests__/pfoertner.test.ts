/**
 * pfoertner (Strang 5): der Stimmungs-Hinweis liest den Spielzustand —
 * hohes Risiko macht nervös, eine frische Sendung wird aufgegriffen, sonst spricht
 * die Publikums-Stimmung. Pure Funktion, deterministisch.
 */
import { describe, it, expect } from 'vitest';
import { pfoertnerLine, dominantMood } from '../building/pfoertner';

describe('pfoertnerLine', () => {
  it('hohes Risiko übertönt alles (nervös)', () => {
    const l = pfoertnerLine({ risk: 80, publicMood: 'ruhig', lastHeadline: 'Etwas' });
    expect(l).toMatch(/vorsichtig|Fragen/i);
  });

  it('greift eine frische Sendung bei spürbarem Risiko auf', () => {
    const l = pfoertnerLine({ risk: 40, publicMood: 'ruhig', lastHeadline: 'Skandal um X' });
    expect(l).toContain('Skandal um X');
  });

  it('spricht sonst die Publikums-Stimmung', () => {
    expect(pfoertnerLine({ risk: 10, publicMood: 'wuetend', lastHeadline: null })).toMatch(/brodelt/i);
    expect(pfoertnerLine({ risk: 10, publicMood: 'ruhig', lastHeadline: null })).toMatch(/Ruhiger Tag/i);
    // unbekannte Stimmung → Fallback ruhig
    expect(pfoertnerLine({ risk: 10, publicMood: 'xyz', lastHeadline: null })).toMatch(/Ruhiger Tag/i);
  });
});

describe('dominantMood', () => {
  it('liefert die häufigste Stimmung', () => {
    expect(dominantMood(['ruhig', 'wuetend', 'wuetend'])).toBe('wuetend');
    expect(dominantMood([])).toBe('ruhig');
  });
});
