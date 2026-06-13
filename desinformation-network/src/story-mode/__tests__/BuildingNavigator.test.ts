/**
 * Tests für buildingLayout + BuildingNavigator (pure TS, ohne React).
 */
import { describe, it, expect } from 'vitest';
import { getBuildingLayout, roomById, STAGE } from '../building/buildingLayout';
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
