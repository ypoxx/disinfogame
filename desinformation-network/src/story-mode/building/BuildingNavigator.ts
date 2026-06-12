/**
 * BuildingNavigator — plant Wege des Avatars durch das Gebäude.
 *
 * Pure TS, testbar ohne React. Jeder Schritt trägt `durationMs` (Animation)
 * UND `timeCostMin` (Spielzeit-Hook, v1 = 0 — Bewegung ist atmosphärisch;
 * Zeitkosten sind später nur ein Parameter). Owner-Entscheidung 2026-06-12,
 * siehe docs/PLAYER_ENTRY_AND_BUILDING_PLAN.md.
 */
import { getBuildingLayout, roomById, floorByLevel, type BuildingLayout } from './buildingLayout';

export interface AvatarPosition {
  floorLevel: number;
  x: number;
}

export type NavStep =
  | { kind: 'walk'; floorLevel: number; fromX: number; toX: number; durationMs: number; timeCostMin: number }
  | { kind: 'elevator'; fromLevel: number; toLevel: number; x: number; durationMs: number; timeCostMin: number }
  | { kind: 'door'; roomId: string; floorLevel: number; x: number; durationMs: number; timeCostMin: number };

/** Geschwindigkeiten (Stage-px bzw. ms je Etage). */
export const NAV_SPEED = {
  walkPxPerSecond: 220,
  elevatorMsPerFloor: 1100,
  elevatorDoorMs: 500,
  doorMs: 650,
} as const;

function walkStep(floorLevel: number, fromX: number, toX: number): NavStep {
  const dist = Math.abs(toX - fromX);
  return {
    kind: 'walk',
    floorLevel,
    fromX,
    toX,
    durationMs: Math.max(120, Math.round((dist / NAV_SPEED.walkPxPerSecond) * 1000)),
    timeCostMin: 0,
  };
}

/**
 * Route von `from` zur Tür von `toRoomId`.
 * Gleiches Stockwerk: laufen. Sonst: laufen → Fahrstuhl → laufen. Abschluss: Tür.
 */
export function planRoute(from: AvatarPosition, toRoomId: string, layout: BuildingLayout = getBuildingLayout()): NavStep[] {
  const room = roomById(toRoomId);
  if (!room) throw new Error(`BuildingNavigator: unbekannter Raum "${toRoomId}"`);
  if (!floorByLevel(from.floorLevel)) throw new Error(`BuildingNavigator: unbekannte Etage ${from.floorLevel}`);

  const steps: NavStep[] = [];
  let x = from.x;
  let level = from.floorLevel;

  if (level !== room.floorLevel) {
    if (Math.abs(x - layout.shaftEntryX) > 1) {
      steps.push(walkStep(level, x, layout.shaftEntryX));
      x = layout.shaftEntryX;
    }
    steps.push({
      kind: 'elevator',
      fromLevel: level,
      toLevel: room.floorLevel,
      x,
      durationMs:
        NAV_SPEED.elevatorDoorMs * 2 + Math.abs(room.floorLevel - level) * NAV_SPEED.elevatorMsPerFloor,
      timeCostMin: 0,
    });
    level = room.floorLevel;
  }

  if (Math.abs(x - room.doorX) > 1) {
    steps.push(walkStep(level, x, room.doorX));
    x = room.doorX;
  }

  steps.push({ kind: 'door', roomId: room.id, floorLevel: level, x, durationMs: NAV_SPEED.doorMs, timeCostMin: 0 });
  return steps;
}

/** Gesamtdauer einer Route (Animations-Zeit). */
export function routeDurationMs(steps: NavStep[]): number {
  return steps.reduce((sum, s) => sum + s.durationMs, 0);
}

/** Gesamt-Zeitkosten einer Route (Spielzeit; v1 immer 0). */
export function routeTimeCostMin(steps: NavStep[]): number {
  return steps.reduce((sum, s) => sum + s.timeCostMin, 0);
}

/** Spawn-Position für die Ankunfts-Sequenz (Lobby-Eingang). */
export function entryPosition(layout: BuildingLayout = getBuildingLayout()): AvatarPosition {
  return { floorLevel: layout.entryFloorLevel, x: layout.entryX };
}

/** Standard-Position im Spiel: vor der Tür des Spielerbüros (Fallback: Lobby). */
export function defaultPosition(): AvatarPosition {
  const office = roomById('spieler_buero');
  if (office) return { floorLevel: office.floorLevel, x: office.doorX };
  return entryPosition();
}
