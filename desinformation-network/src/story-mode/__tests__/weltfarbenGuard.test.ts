import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { StoryModeWorld } from '../theme';

/**
 * Wache für die Signalfarben der Welt.
 *
 * Das Muster ist in diesem Projekt dreimal aufgetreten: `stampCtaStyle` stand
 * seit v3 im Theme und wurde trotzdem gebrochen (4 Verstöße am 21.08., 9 am
 * 22.08.); die Scrims zerfielen in acht verschiedene Schwarzwerte; die
 * Schriftgrößen in 23 Stufen. Jedes Mal gab es die Regel — und keine
 * Durchsetzung.
 *
 * Das Weltgelb `#F0B429` und das Weltrot `#E5484D` standen als Literale in neun
 * Dateien. Diese Wache hält sie an einer Stelle fest, BEVOR sie ein viertes Mal
 * auseinanderlaufen.
 *
 * Sie prüft die Regel, nicht die heutige Zahl: Wer eine neue Welt-Signalfarbe
 * braucht, trägt sie ins Theme ein — dann gilt sie überall.
 */

const SRC = resolve(__dirname, '../..');

/** Dateien, in denen ein Literal seine Berechtigung hat, jeweils mit Grund. */
const AUSNAHMEN: Record<string, string> = {
  'story-mode/theme.ts': 'die Quelle selbst',
  'story-mode/__tests__/weltfarbenGuard.test.ts': 'diese Wache',
  // CSS kann den TypeScript-Token nicht importieren. Die eine erlaubte
  // Zweitschrift steht als Variable `--welt-amber` — der Test unten hält
  // sie mit dem Token deckungsgleich.
  'index.css': 'CSS-Variable --welt-amber, gegen den Token geprüft',
};

function dateien(dir: string, treffer: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const voll = join(dir, name);
    if (statSync(voll).isDirectory()) {
      if (name === 'node_modules' || name === 'dist') continue;
      dateien(voll, treffer);
    } else if (/\.(ts|tsx|css)$/.test(name)) {
      treffer.push(voll);
    }
  }
  return treffer;
}

describe('Welt-Signalfarben', () => {
  it('stehen nur im Theme, nicht als Literal im Code', () => {
    const werte = Object.values(StoryModeWorld).map((v) => v.toLowerCase());
    const verstoesse: string[] = [];

    for (const datei of dateien(SRC)) {
      const rel = relative(SRC, datei).replace(/\\/g, '/');
      if (rel in AUSNAHMEN) continue;
      const inhalt = readFileSync(datei, 'utf8');
      inhalt.split('\n').forEach((zeile, i) => {
        for (const wert of werte) {
          if (zeile.toLowerCase().includes(wert)) {
            verstoesse.push(`${rel}:${i + 1} — ${wert}`);
          }
        }
      });
    }

    expect(
      verstoesse,
      'Welt-Signalfarben gehören ins Theme (StoryModeWorld), nicht in den Code:\n  ' +
        verstoesse.join('\n  ')
    ).toEqual([]);
  });

  it('sind hell genug für die dunkle Bühne', () => {
    // Der Grund, warum diese Töne NICHT die Papier-Tinten sind: Die Welt ist
    // dunkel. Fällt jemand in Versuchung, sie „an die Papierwelt anzugleichen",
    // schlägt dieser Test an.
    const luminanz = (hex: string) => {
      const c = hex.replace('#', '');
      const v = [0, 2, 4].map((i) => {
        const x = parseInt(c.substr(i, 2), 16) / 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
    };
    const kontrastAufDunkel = (hex: string) => (luminanz(hex) + 0.05) / (luminanz('#1a1a1f') + 0.05);

    for (const [name, wert] of Object.entries(StoryModeWorld)) {
      const k = kontrastAufDunkel(wert);
      expect(k, `${name} (${wert}) hat auf dunklem Grund nur ${k.toFixed(2)}:1`).toBeGreaterThanOrEqual(3);
    }
  });

  it('die CSS-Variable stimmt mit dem Token überein', () => {
    // Die einzige erlaubte Zweitschrift. Läuft sie auseinander, hat das Spiel
    // zwei Gelbtöne — nur sieht man es erst im Bild, nicht im Code.
    const css = readFileSync(resolve(SRC, 'index.css'), 'utf8');
    const treffer = css.match(/--welt-amber:\s*(#[0-9a-fA-F]{6})/);
    expect(treffer, '--welt-amber fehlt in index.css').toBeTruthy();
    expect(treffer![1].toLowerCase()).toBe(StoryModeWorld.amber.toLowerCase());
  });

  it('verwendet die Variable, statt das Literal erneut zu schreiben', () => {
    const css = readFileSync(resolve(SRC, 'index.css'), 'utf8');
    // Genau eine Definition, sonst nur Verweise.
    const definitionen = (css.match(/#f0b429/gi) ?? []).length;
    expect(definitionen, 'In index.css darf das Gelb nur einmal stehen: in --welt-amber').toBe(1);
  });

  it('trägt zu jeder Ausnahme eine Begründung', () => {
    expect(Object.entries(AUSNAHMEN).filter(([, g]) => !g.trim()).map(([f]) => f)).toEqual([]);
  });
});
