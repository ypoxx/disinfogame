import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { zahlDe, deltaDe } from '../zahlen';

/**
 * Wache für deutsche Zahlen in der Oberfläche.
 *
 * Der Tagesbericht schrieb „12,6", der Wahlabend daneben „12.6" — dieselbe
 * Absicht, zwei Schreibweisen, und eine davon war gar keine. Auffallen konnte
 * das nur im Bild.
 */

const SRC = resolve(__dirname, '../..');
/** Nachkommastellen in einer Ansicht gehören durchs Komma. */
const ROHE_NACHKOMMA = /\.toFixed\([1-9]\)/;

/** Stellen, an denen die Zahl nicht gelesen, sondern gerechnet wird. */
const AUSNAHMEN: Record<string, string> = {
  'story-mode/building/BuildingStage.tsx': 'CSS-Alphawert in rgba(), keine Anzeige',
};

function dateien(dir: string, treffer: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const voll = join(dir, name);
    if (statSync(voll).isDirectory()) {
      if (name === 'node_modules' || name === 'dist') continue;
      dateien(voll, treffer);
    } else if (name.endsWith('.tsx')) {
      treffer.push(voll);
    }
  }
  return treffer;
}

describe('Zahlen in der Oberfläche', () => {
  it('schreibt Nachkommastellen mit Komma', () => {
    expect(zahlDe(21.64)).toBe('21,6');
    expect(zahlDe(9)).toBe('9,0');
    expect(zahlDe(0.126, 2)).toBe('0,13');
    expect(deltaDe(12.6)).toBe('+12,6');
    expect(deltaDe(-3.42)).toBe('−3,4');   // echtes Minuszeichen, kein Bindestrich
    expect(deltaDe(0)).toBe('+0,0');
  });

  it('keine Ansicht formatiert Nachkommastellen selbst', () => {
    const verstoesse: string[] = [];
    for (const datei of dateien(SRC)) {
      const rel = relative(SRC, datei).replace(/\\/g, '/');
      if (rel in AUSNAHMEN) continue;
      readFileSync(datei, 'utf8').split('\n').forEach((zeile, i) => {
        if (ROHE_NACHKOMMA.test(zeile)) verstoesse.push(`${rel}:${i + 1} — ${zeile.trim().slice(0, 80)}`);
      });
    }
    expect(
      verstoesse,
      'Nachkommastellen gehören durch zahlDe()/deltaDe() (deutsches Komma):\n  ' + verstoesse.join('\n  ')
    ).toEqual([]);
  });

  it('trägt zu jeder Ausnahme eine Begründung', () => {
    expect(Object.entries(AUSNAHMEN).filter(([, g]) => !g.trim()).map(([f]) => f)).toEqual([]);
  });
});
