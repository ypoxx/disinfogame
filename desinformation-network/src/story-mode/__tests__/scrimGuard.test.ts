/**
 * Wache über die Abdunklungs-Stufen (P14, Fremdmodell-Durchgang 2026-08-22).
 *
 * Der Story-Mode hatte 21 Vollbild-Scrims mit ACHT verschiedenen Schwarzwerten
 * (0,75 · 0,78 · 0,82 · 0,85 · 0,90 · 0,92 · 0,95 · 0,97). Die Cluster sahen nicht
 * nach Absicht aus, sondern nach „ungefähr so dunkel wie das Nachbar-Modal" —
 * Folge einer halbfertigen Migration: PixelModal wurde gebaut, nur ein Teil der
 * Aufrufstellen zog nach, der Rest behielt sein Literal daneben. Genau so wächst
 * die Zahl zurück, wenn niemand hinsieht.
 *
 * Geprüft wird nur die VOLLBILD-Abdunklung (`fixed inset-0` bzw.
 * `position: 'fixed', inset: 0`). Vignetten, Verläufe und Innen-Schatten sind
 * etwas anderes und dürfen ihre eigenen Werte behalten.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { StoryModeScrims } from '../theme';

const STORY_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function tsxDateien(dir = STORY_DIR): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : tsxDateien(p);
    return e.name.endsWith('.tsx') ? [p] : [];
  });
}

describe('Abdunklungs-Stufen (StoryModeScrims)', () => {
  it('bietet genau drei Stufen — eine vierte muss begründet werden', () => {
    expect(Object.keys(StoryModeScrims)).toEqual(['leicht', 'normal', 'schwer']);
  });

  it('kennt kein hartes Schwarz-Literal an einem Vollbild-Overlay', () => {
    const verstoesse: string[] = [];
    for (const datei of tsxDateien()) {
      // PixelModal ist die Hülle selbst — sie DARF die Stufe in eine Farbe auflösen.
      if (datei.endsWith('PixelModal.tsx')) continue;
      const zeilen = fs.readFileSync(datei, 'utf8').split('\n');
      zeilen.forEach((zeile, i) => {
        const vollbild = /(?:className="[^"]*\bfixed inset-0|position: 'fixed', inset: 0)/.test(zeile);
        if (!vollbild) return;
        // Das Literal steht bei diesen Overlays auf derselben oder der nächsten Zeile.
        const fenster = [zeile, zeilen[i + 1] ?? '', zeilen[i + 2] ?? ''].join(' ');
        const m = fenster.match(/background(?:Color)?: *'?(?:rgba\([^)]*, *0\.\d+\)|#[0-9a-fA-F]{6}[0-9a-fA-F]{2})/);
        if (m) verstoesse.push(`${path.relative(STORY_DIR, datei)}:${i + 1} → ${m[0]}`);
      });
    }
    expect(
      verstoesse,
      `Vollbild-Abdunklung mit hartem Wert — bitte scrim('leicht'|'normal'|'schwer'):\n  ${verstoesse.join('\n  ')}`,
    ).toEqual([]);
  });
});
