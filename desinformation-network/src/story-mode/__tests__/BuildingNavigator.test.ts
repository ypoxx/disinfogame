/**
 * Tests für buildingLayout + BuildingNavigator (pure TS, ohne React).
 */
import { describe, it, expect } from 'vitest';
import { floorDoorFootY, floorWalkFootY, getBuildingLayout, roomById, STAGE, wallFootY } from '../building/buildingLayout';
import {
  planRoute,
  routeDurationMs,
  routeTimeCostMin,
  entryPosition,
  defaultPosition,
} from '../building/BuildingNavigator';

describe('buildingLayout', () => {
  it('berechnet ein Layout mit allen Etagen und Räumen aus building.json', () => {
    const layout = getBuildingLayout();
    expect(layout.floors.length).toBeGreaterThanOrEqual(4);
    expect(layout.rooms.length).toBeGreaterThanOrEqual(7);
    expect(layout.width).toBeGreaterThan(0);
    expect(layout.height).toBeGreaterThan(0);
  });

  it('sortiert Etagen von oben nach unten und positioniert sie überschneidungsfrei', () => {
    const { floors } = getBuildingLayout();
    for (let i = 1; i < floors.length; i++) {
      expect(floors[i].level).toBeLessThan(floors[i - 1].level);
      expect(floors[i].y).toBeGreaterThanOrEqual(floors[i - 1].y + STAGE.floorHeight);
    }
  });

  it('hat die Operationszentrale (P2) als NPC-losen Raum auf Etage 4', () => {
    // NPC-los ⇒ BuildingView routet das Betreten über onEnterRoom → Operations-Akte.
    const ops = roomById('operations');
    expect(ops).toBeDefined();
    expect(ops!.npcId).toBeUndefined();
    expect(ops!.floor).toBe('etage4');
  });

  it('lässt die Lobby per colSpan die volle Breite überspannen', () => {
    const lobby = roomById('lobby');
    const layout = getBuildingLayout();
    expect(lobby).toBeDefined();
    expect(lobby!.w).toBe(layout.colCount * STAGE.colWidth);
  });

  it('legt den Fahrstuhl-Schacht rechts neben die Raum-Spalten', () => {
    const layout = getBuildingLayout();
    expect(layout.shaft.x).toBe(STAGE.pillarWidth + layout.colCount * STAGE.colWidth);
    for (const room of layout.rooms) {
      expect(room.x + room.w).toBeLessThanOrEqual(layout.shaft.x);
    }
  });

  it('platziert Türen innerhalb des jeweiligen Raums', () => {
    for (const room of getBuildingLayout().rooms) {
      expect(room.doorX).toBeGreaterThan(room.x);
      expect(room.doorX).toBeLessThan(room.x + room.w);
    }
  });

  it('richtet die Türen an den festen Buchten der finalen Etagenpanoramen aus', () => {
    const expected: Record<string, number> = {
      cyber_lab: 0.332,
      operations: 0.586,
      medien_zentrum: 0.948,
      analyse: 0.324,
      newsroom: 0.95,
      feld_ops: 0.595,
      zentrale: 0.32,
      spieler_buero: 0.596,
      finanzen: 0.628,
    };
    const layout = getBuildingLayout();
    const playableWidth = layout.colCount * STAGE.colWidth;
    for (const [roomId, fraction] of Object.entries(expected)) {
      const room = roomById(roomId)!;
      expect(room.doorX).toBeCloseTo(STAGE.pillarWidth + fraction * playableWidth, 5);
    }
  });

  it('setzt die Türen von Etage 1 und Keller hinter den Laufweg', () => {
    const layout = getBuildingLayout();
    const floor1 = layout.floors.find((f) => f.level === 1)!;
    const basement = layout.floors.find((f) => f.level === -1)!;

    expect(floorDoorFootY(floor1)).toBe(wallFootY(floor1) - 10);
    expect(floorDoorFootY(basement)).toBe(wallFootY(basement) - 12);
    expect(roomById('zentrale')!.doorFootY).toBe(floorDoorFootY(floor1));
    expect(roomById('spieler_buero')!.doorFootY).toBe(floorDoorFootY(floor1));
    expect(roomById('finanzen')!.doorFootY).toBe(floorDoorFootY(basement));
  });

  it('legt die sichtbaren Laufebenen von Etage 2–4 tiefer ins Panorama', () => {
    const floors = getBuildingLayout().floors;
    expect(floorWalkFootY(floors.find((f) => f.level === 4)!)).toBe(wallFootY(floors.find((f) => f.level === 4)!) + 18);
    expect(floorWalkFootY(floors.find((f) => f.level === 3)!)).toBe(wallFootY(floors.find((f) => f.level === 3)!) + 16);
    expect(floorWalkFootY(floors.find((f) => f.level === 2)!)).toBe(wallFootY(floors.find((f) => f.level === 2)!) + 16);
    expect(floorDoorFootY(floors.find((f) => f.level === 4)!)).toBe(floorWalkFootY(floors.find((f) => f.level === 4)!));
  });
});

describe('BuildingNavigator.planRoute', () => {
  it('läuft auf derselben Etage nur zur Tür (walk + door)', () => {
    const zentrale = roomById('zentrale')!;
    const steps = planRoute({ floorLevel: zentrale.floorLevel, x: zentrale.x + 10 }, 'spieler_buero');
    expect(steps.map((s) => s.kind)).toEqual(['walk', 'door']);
  });

  it('nimmt zwischen Etagen den Fahrstuhl (walk → elevator → walk → door)', () => {
    const steps = planRoute(entryPosition(), 'zentrale');
    expect(steps.map((s) => s.kind)).toEqual(['walk', 'elevator', 'walk', 'door']);
    const ride = steps.find((s) => s.kind === 'elevator');
    expect(ride && ride.kind === 'elevator' && ride.fromLevel).toBe(0);
    expect(ride && ride.kind === 'elevator' && ride.toLevel).toBe(1);
  });

  it('endet jede Route mit einem Tür-Schritt am Zielraum', () => {
    for (const target of ['cyber_lab', 'finanzen', 'lobby', 'spieler_buero']) {
      const steps = planRoute(defaultPosition(), target);
      const last = steps[steps.length - 1];
      expect(last.kind).toBe('door');
      expect(last.kind === 'door' && last.roomId).toBe(target);
    }
  });

  it('startet direkt vor der Tür nur mit dem Tür-Schritt', () => {
    const office = roomById('spieler_buero')!;
    const steps = planRoute({ floorLevel: office.floorLevel, x: office.doorX }, 'spieler_buero');
    expect(steps.map((s) => s.kind)).toEqual(['door']);
  });

  it('wirft bei unbekanntem Raum einen Fehler', () => {
    expect(() => planRoute(defaultPosition(), 'sauna')).toThrow(/unbekannter Raum/);
  });

  it('hat positive Animationsdauer und aktivierte Zeitkosten (K1: Wege kosten Spielminuten)', () => {
    const steps = planRoute(entryPosition(), 'finanzen');
    expect(routeDurationMs(steps)).toBeGreaterThan(0);
    expect(routeTimeCostMin(steps)).toBeGreaterThan(0);
    const door = steps.find((s) => s.kind === 'door')!;
    expect(door.timeCostMin).toBe(2);
    const ride = steps.find((s) => s.kind === 'elevator')!;
    expect(ride.timeCostMin).toBe(5 * Math.abs((ride.kind === 'elevator' ? ride.toLevel - ride.fromLevel : 0)));
  });

  it('skaliert die Fahrstuhl-Dauer mit der Etagen-Distanz', () => {
    const fromTop = planRoute({ floorLevel: 2, x: getBuildingLayout().shaftEntryX }, 'finanzen');
    const fromFirst = planRoute({ floorLevel: 1, x: getBuildingLayout().shaftEntryX }, 'finanzen');
    const rideTop = fromTop.find((s) => s.kind === 'elevator')!;
    const rideFirst = fromFirst.find((s) => s.kind === 'elevator')!;
    expect(rideTop.durationMs).toBeGreaterThan(rideFirst.durationMs);
  });
});
