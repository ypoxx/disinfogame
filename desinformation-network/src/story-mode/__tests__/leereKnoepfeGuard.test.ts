import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { initialen } from '../components/AdvisorPanel';

/**
 * Wache gegen Knöpfe ohne Aufschrift.
 *
 * Ein Durchlauf, der farbige Emojis aus der Oberfläche nahm (cd18212), erwischte
 * auch das geometrische ◀ und ▶ der Berater-Leiste. Übrig blieben zwei Knöpfe
 * mit Klickfläche, aber ohne jedes sichtbare Zeichen: Der Griff zum Ausklappen
 * war seither unsichtbar. Weder `tsc` noch ein Test sahen das — nur das Bild.
 *
 * Diese Wache prüft die Regel: Ein <button> hat Inhalt. Wer eine Fläche ohne
 * Aufschrift braucht, schreibt sie als `<button …>{null}</button>` mit
 * aria-label — dann steht die Absicht da.
 */

const SRC = resolve(__dirname, '../..');
/** Öffnendes Tag, dessen erstes Zeichen danach schon das Ende ist. */
const LEER = /(?:<button\b[^<>]*>|\n\s*>)\s*<\/button>/g;

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

describe('Knöpfe', () => {
  it('tragen eine Aufschrift', () => {
    const verstoesse: string[] = [];
    for (const datei of dateien(SRC)) {
      const quelle = readFileSync(datei, 'utf8');
      for (const m of quelle.matchAll(LEER)) {
        const zeile = quelle.slice(0, m.index).split('\n').length;
        verstoesse.push(`${relative(SRC, datei).replace(/\\/g, '/')}:${zeile}`);
      }
    }
    expect(
      verstoesse,
      'Diese <button> haben keinen Inhalt — sie sind auf dem Schirm nicht zu sehen:\n  ' +
        verstoesse.join('\n  ')
    ).toEqual([]);
  });
});

describe('Berater-Kürzel', () => {
  const NAMEN = ['Kurator Volkov', 'Marina Petrova', 'Alexei Petrov', 'Katja Orlova', 'Igor Smirnov'];

  it('unterscheidet die Berater der eingeklappten Leiste', () => {
    const kuerzel = NAMEN.map(initialen);
    expect(new Set(kuerzel).size, `doppelte Kürzel: ${kuerzel.join(', ')}`).toBe(NAMEN.length);
  });

  it('bleibt kurz genug für das 32px-Feld', () => {
    for (const n of NAMEN) expect(initialen(n).length).toBeLessThanOrEqual(2);
  });

  it('hält auch bei einteiligen und leeren Namen stand', () => {
    expect(initialen('Pförtner')).toBe('PF');
    expect(initialen('   ')).toBe('?');
  });
});
