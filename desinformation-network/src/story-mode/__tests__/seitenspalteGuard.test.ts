import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { SEITENPANEL_BREITE_PX } from '../components/SidePanel';

/**
 * Wache für die Unterkante.
 *
 * Morgenbriefing und Dialogbox lagen als `fixed bottom-0 left-0 right-0` über
 * der ganzen Fensterbreite — also auch unter der geöffneten Seitenspalte. Im
 * Missions-Panel fehlte dadurch die letzte Zeile („Denken Sie daran: Jede
 * Aktion hat …"), und am Tag 1 deckte das Briefing das Terminal zur Hälfte zu.
 *
 * Die Regel: Ein Streifen an der Unterkante endet an der Spalte. Er bekommt
 * seinen Versatz als Prop, nicht `right-0`.
 */

const SRC = resolve(__dirname, '../..');
const UEBER_VOLLE_BREITE = /fixed[^"'`]*\bbottom-0\b[^"'`]*\bright-0\b|fixed[^"'`]*\bright-0\b[^"'`]*\bbottom-0\b/;

/** Vollbild-Overlays dürfen die Spalte überdecken — sie ERSETZEN die Ansicht. */
const AUSNAHMEN: Record<string, string> = {};

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

describe('Streifen an der Unterkante', () => {
  it('laufen nicht unter der Seitenspalte durch', () => {
    const verstoesse: string[] = [];
    for (const datei of dateien(SRC)) {
      const rel = relative(SRC, datei).replace(/\\/g, '/');
      if (rel in AUSNAHMEN) continue;
      readFileSync(datei, 'utf8').split('\n').forEach((zeile, i) => {
        if (UEBER_VOLLE_BREITE.test(zeile)) verstoesse.push(`${rel}:${i + 1} — ${zeile.trim().slice(0, 90)}`);
      });
    }
    expect(
      verstoesse,
      'Ein `fixed bottom-0 … right-0` deckt die offene Seitenspalte zu.\n' +
        '  Stattdessen `right: rechtsVersatzPx` setzen (SEITENPANEL_BREITE_PX).\n  ' +
        verstoesse.join('\n  ')
    ).toEqual([]);
  });

  it('die Breite der Spalte steht an genau einer Stelle', () => {
    const quelle = readFileSync(resolve(SRC, 'story-mode/components/SidePanel.tsx'), 'utf8');
    // Einmal die Konstante, zweimal ihre Verwendung — keine nackte Zahl mehr.
    expect(quelle.match(/\b420\b/g) ?? []).toHaveLength(1);
    expect(SEITENPANEL_BREITE_PX).toBe(420);

    const spiel = readFileSync(resolve(SRC, 'story-mode/StoryModeGame.tsx'), 'utf8');
    expect(spiel, 'StoryModeGame darf die Breite nicht erneut hinschreiben').not.toMatch(/rightOffsetPx=\{[^}]*\b420\b/);
  });
});
