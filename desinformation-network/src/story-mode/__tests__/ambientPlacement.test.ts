/**
 * Wache über die Standorte der Flur-Statisten (2026-08-23).
 *
 * Anlass: Beim Beleben der leeren Etagen landete der Archivar auf xFrac 0,62 —
 * exakt in der Tür-Klickzone des Tresors (0,56–0,67). Sichtbar war er nur, wenn
 * gerade niemand an der Tür stand; der Avatar verdeckte ihn restlos. Am Bild
 * geschätzte Positionen gehen so aus, deshalb rechnet der Test sie nach.
 *
 * Die Zonen kommen aus derselben Formel wie der Renderer (`BuildingStage`:
 * `doorX ± (doorWidth/2 + 24)`), abgeleitet aus `building.json` — nicht aus einer
 * abgeschriebenen Zahlenliste, die beim nächsten Umbau still falsch wird.
 */
import { describe, it, expect } from 'vitest';
import { FLOOR_AMBIENT } from '../building/corridorDecor';
import { getBuildingLayout, STAGE } from '../building/buildingLayout';

const layout = getBuildingLayout();
const spielflaeche = layout.shaft.x - STAGE.pillarWidth;

/** Klickzonen der Türen einer Etage, als Anteil der Spielfläche. */
function tuerzonen(floorId: string): { von: number; bis: number; raum: string }[] {
  return layout.rooms
    .filter((r) => r.floor === floorId)
    .map((r) => {
      const halb = STAGE.doorWidth / 2 + 24;
      return {
        von: (r.doorX - halb - STAGE.pillarWidth) / spielflaeche,
        bis: (r.doorX + halb - STAGE.pillarWidth) / spielflaeche,
        raum: r.id,
      };
    });
}

describe('Standorte der Flur-Statisten', () => {
  it('belebt jede Etage — keine bleibt menschenleer', () => {
    // Der Owner-Befund war „leere Etagen lesen sich als Fehler". Vorher stand nur
    // auf etage1 jemand; die Laufagenten sind je Etage höchstens einer und
    // zwischen zwei Durchgängen ist der Flur leer.
    // Das Erdgeschoss ist ausgenommen: Dort steht der Pförtner, eine eigene
    // Figur mit eigener Sprechblase — kein FLOOR_AMBIENT-Eintrag.
    for (const floor of layout.floors.filter((f) => f.id !== 'erdgeschoss')) {
      expect(FLOOR_AMBIENT[floor.id]?.length ?? 0, `${floor.id} hat keinen Statisten`).toBeGreaterThan(0);
    }
  });

  it('stellt niemanden in eine Tür-Klickzone', () => {
    const konflikte: string[] = [];
    for (const [floorId, figuren] of Object.entries(FLOOR_AMBIENT)) {
      for (const f of figuren) {
        for (const z of tuerzonen(floorId)) {
          if (f.xFrac > z.von && f.xFrac < z.bis) {
            konflikte.push(`${floorId}: ${f.who} auf ${f.xFrac} liegt in der Tür „${z.raum}" (${z.von.toFixed(2)}–${z.bis.toFixed(2)})`);
          }
        }
      }
    }
    expect(konflikte, konflikte.join('\n  ')).toEqual([]);
  });

  it('gibt jedem Statisten eine eigene Stimme', () => {
    const saetze = Object.values(FLOOR_AMBIENT).flat();
    expect(new Set(saetze.map((f) => f.line)).size, 'zwei Statisten sagen dasselbe').toBe(saetze.length);
    expect(new Set(saetze.map((f) => f.who)).size, 'zwei Statisten haben dieselbe Rolle').toBe(saetze.length);
  });

  it('hält die Reinigung als EINE Person im Haus', () => {
    // Sonst stehen zwei identische Reinigungs-Sprites nebeneinander und sehen aus
    // wie ein Render-Fehler — genau so gesehen im Keller (Ernte 2026-08-23).
    const stehendeReinigung = Object.values(FLOOR_AMBIENT).flat().filter((f) => f.figure.includes('cleaner'));
    expect(stehendeReinigung, 'Reinigung ist der wandernde Agent, kein Statist').toEqual([]);
  });
});
