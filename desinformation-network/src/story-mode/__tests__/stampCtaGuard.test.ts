/**
 * Wache über die Stempel-Regel (P3, Fremdmodell-Durchgang 2026-08-22).
 *
 * theme.ts schreibt seit v3 §4.7 vor: „Primär-Aktionen sind GESTEMPELT statt rot
 * geflutet … Rot bleibt Stempel/Kopfband vorbehalten." `stampCtaStyle` war dazu
 * aber nur eine Opt-in-Konstante — kein ESLint, keine Wache, kein geteiltes
 * Primitiv. Am 2026-08-21 brachen 4 Knöpfe die Regel, am 2026-08-22 waren es 9.
 * Ohne diesen Test stünde derselbe Befund in drei Monaten wieder da.
 *
 * Wichtig ist die Trennschärfe: Kopfbänder, Balkenfüllungen, Stempel-Badges und
 * Fortschritts-Balken DÜRFEN Ministeriums-Rot fluten — das ist der erlaubte
 * Rot-Ort. Nur `<button>` darf es nicht. Der Test liest deshalb den öffnenden
 * Button-Tag heraus, statt nach Farbnamen im ganzen File zu greppen.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STORY_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function tsxDateien(dir = STORY_DIR): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : tsxDateien(p);
    return e.name.endsWith('.tsx') ? [p] : [];
  });
}

/**
 * Öffnende `<button …>`-Tags eines Files ausschneiden.
 *
 * Ein Regex bis zum ersten `>` reicht nicht: JSX-Ausdrücke wie
 * `style={{ a: b > c }}` oder Pfeilfunktionen (`onClick={() => …}`) enthalten
 * selbst `>`. Deshalb wird die Klammertiefe mitgezählt und in Strings nicht
 * gesucht.
 */
function buttonTags(text: string): { tag: string; zeile: number }[] {
  const treffer: { tag: string; zeile: number }[] = [];
  for (const m of text.matchAll(/<button(?=[\s/>])/g)) {
    const start = m.index ?? 0;
    let tiefe = 0;
    let quote: string | null = null;
    for (let i = start; i < text.length; i++) {
      const c = text[i];
      if (quote) {
        if (c === quote && text[i - 1] !== '\\') quote = null;
        continue;
      }
      if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
      if (c === '{') tiefe++;
      else if (c === '}') tiefe--;
      else if (c === '>' && tiefe === 0) {
        treffer.push({ tag: text.slice(start, i + 1), zeile: text.slice(0, start).split('\n').length });
        break;
      }
    }
  }
  return treffer;
}

describe('Stempel-Regel (§4.7): kein Knopf wird rot geflutet', () => {
  it('findet überhaupt Knöpfe zum Prüfen', () => {
    const anzahl = tsxDateien().reduce((n, f) => n + buttonTags(fs.readFileSync(f, 'utf8')).length, 0);
    expect(anzahl).toBeGreaterThan(50);
  });

  it('kennt keinen <button> mit Ministeriums-Rot als Fläche', () => {
    const verstoesse: string[] = [];
    for (const datei of tsxDateien()) {
      const text = fs.readFileSync(datei, 'utf8');
      for (const { tag, zeile } of buttonTags(text)) {
        // `background`/`backgroundColor`/`background-color` mit ministryRed oder
        // darkRed als Wert. Rand und Schrift dürfen rot sein — das IST der Stempel.
        if (/background(?:Color)?: *(?:`)?\$?\{?StoryModeColors\.(ministryRed|darkRed)/.test(tag)) {
          verstoesse.push(`${path.relative(STORY_DIR, datei)}:${zeile}`);
        }
      }
    }
    expect(
      verstoesse,
      'Rot geflutete Knöpfe — bitte stampCtaStyle (Primäraktion) oder ' +
        `paperButtonStyle (Schließen/Abbrechen) verwenden:\n  ${verstoesse.join('\n  ')}`,
    ).toEqual([]);
  });
});
