import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

/**
 * Wache gegen das Null-Leck in JSX.
 *
 * `{zahl && <Chip/>}` rendert bei `zahl === 0` nicht „nichts“, sondern die NULL.
 * Im Vorgangs-Terminal stand deshalb hinter „Zielgruppe analysieren“ eine nackte
 * 0 neben Budget- und Kapazitäts-Chip — in der Pixel-Schrift eine geschlitzte
 * Null, die wie ein leeres Klammerpaar aussah. Vier Stellen in `ActionCard`
 * hatten sie, eine weitere im Berater-Fenster.
 *
 * Sichtbar wurde das erst im Bild, nie im Test und nie in `tsc`: Der Ausdruck
 * ist typkorrekt. Also prüft diese Wache die Regel — vor einer Zahl wird
 * verglichen, nicht „geundet“.
 */

const SRC = resolve(__dirname, '../..');

/** Endungen von Bezeichnern, die eine Zahl tragen. */
const ZAHLWORT =
  /(length|count|Count|budget|capacity|risk|attention|moral_weight|amount|total|size|index|Anzahl|anzahl|wert|Wert|score|Score|level|Level|percent|Prozent|prozent|delta|punkte|Punkte|minuten|Minuten|tage|Tage)$/;

/** Rückrufe und Prädikate sind Funktionen bzw. Booleans — kein Null-Leck. */
const KEIN_LECK = /^(on[A-Z]|is[A-Z]|has[A-Z]|can[A-Z]|show[A-Z]|hat[A-Z]|ist[A-Z]|zeig)/;

const MUSTER = /\{\s*([A-Za-z_$][\w$]*(?:[.?]\[?[\w$]+\]?)*)\s*&&/g;

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

describe('Null-Leck in JSX', () => {
  it('keine Zahl steht ungeprüft vor &&', () => {
    const verstoesse: string[] = [];

    for (const datei of dateien(SRC)) {
      const rel = relative(SRC, datei).replace(/\\/g, '/');
      readFileSync(datei, 'utf8')
        .split('\n')
        .forEach((zeile, i) => {
          for (const m of zeile.matchAll(MUSTER)) {
            const kette = m[1];
            const letztes = kette.split('.').pop()!.replace(/\?/g, '').replace(/[[\]]/g, '');
            if (KEIN_LECK.test(letztes) || KEIN_LECK.test(kette)) continue;
            if (!ZAHLWORT.test(letztes)) continue;
            verstoesse.push(`${rel}:${i + 1} — {${kette} && …}`);
          }
        });
    }

    expect(
      verstoesse,
      'Vor einer Zahl gehört ein Vergleich, sonst rendert React die 0:\n' +
        '  statt {n && <X/>} → {(n ?? 0) > 0 && <X/>}\n  ' +
        verstoesse.join('\n  ')
    ).toEqual([]);
  });
});
