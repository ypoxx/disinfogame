/**
 * Wache über die Schrift-Leiter (P4, Fremdmodell-Durchgang 2026-08-22).
 *
 * Der Befund war nicht „die Schrift ist zu klein", sondern: es gab GAR KEINE
 * Skala. 23 verschiedene Größen, darunter krumme rem-Werte (10,88 / 11,52 /
 * 12,8 / 13,6 / 14,4 / 15,2 px) — jede Komponente erfand ihre eigene, und nichts
 * hielt das auf. Eine einmalige Aufräumaktion hätte in drei Monaten denselben
 * Befund erzeugt; deshalb steht hier die Wache statt nur der Aufräumung.
 *
 * Was der Test durchlässt: `clamp()`-Größen (bewusst responsiv) und Werte, die
 * aus StoryModeType kommen. Was er meldet: alles daneben.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { StoryModeType } from '../theme';

const STORY_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LEITER = new Set<number>(Object.values(StoryModeType));

/** Alle .tsx unter src/story-mode, ohne Tests. */
function tsxDateien(dir = STORY_DIR): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : tsxDateien(p);
    return e.name.endsWith('.tsx') ? [p] : [];
  });
}

/** Fundstelle als `datei:zeile` — direkt anklickbar in der Fehlermeldung. */
function stelle(datei: string, text: string, index: number): string {
  const zeile = text.slice(0, index).split('\n').length;
  return `${path.relative(STORY_DIR, datei)}:${zeile}`;
}

describe('Schrift-Leiter (StoryModeType)', () => {
  const dateien = tsxDateien();

  it('findet überhaupt Komponenten zum Prüfen', () => {
    expect(dateien.length).toBeGreaterThan(20);
  });

  it('kennt keine Inline-Schriftgröße neben der Leiter', () => {
    const daneben: string[] = [];
    for (const datei of dateien) {
      const text = fs.readFileSync(datei, 'utf8');
      // Nur Zahl-Literale: `fontSize: 13` und `fontSize: '13px'`. Ausdrücke
      // (`fontSize: istGross ? a : b`, clamp(), Token-Zugriffe) prüft der Test
      // nicht — dort steht die Entscheidung schon im Code.
      for (const m of text.matchAll(/fontSize: '?(\d+(?:\.\d+)?)(px)?'?(?=[,;}\s)])/g)) {
        const wert = Number.parseFloat(m[1]);
        if (!LEITER.has(wert)) daneben.push(`${stelle(datei, text, m.index ?? 0)} → ${wert}px`);
      }
      // Krumme rem-Größen waren die eigentliche Quelle der 23 Werte.
      for (const m of text.matchAll(/fontSize: '(\d*\.\d+)rem'/g)) {
        daneben.push(`${stelle(datei, text, m.index ?? 0)} → ${m[1]}rem (rem-Größen bitte als px-Sprosse)`);
      }
    }
    expect(daneben, `Neben der Leiter [${[...LEITER].sort((a, b) => a - b).join(', ')}]:\n  ${daneben.join('\n  ')}`)
      .toEqual([]);
  });

  it('kennt keine Tailwind-Schriftgröße neben der Leiter', () => {
    const daneben: string[] = [];
    for (const datei of dateien) {
      const text = fs.readFileSync(datei, 'utf8');
      for (const m of text.matchAll(/text-\[(\d+)px\]/g)) {
        const wert = Number.parseInt(m[1], 10);
        if (!LEITER.has(wert)) daneben.push(`${stelle(datei, text, m.index ?? 0)} → text-[${wert}px]`);
      }
    }
    expect(daneben, `Neben der Leiter:\n  ${daneben.join('\n  ')}`).toEqual([]);
  });

  it('hält den 10-px-Boden ein', () => {
    // VT323 trägt size-adjust: 132 % — 10 px ergeben 7,4 px Versalhöhe. Darunter
    // franst Pixelschrift auf dem Papier-Untergrund aus.
    expect(Math.min(...LEITER)).toBe(10);
  });
});
