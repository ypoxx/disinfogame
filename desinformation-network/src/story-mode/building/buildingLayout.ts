/**
 * buildingLayout — rechnet building.json in Stage-Pixelkoordinaten um.
 *
 * Pure TS (kein React): eine Quelle für BuildingStage (Rendering) und
 * BuildingNavigator (Wege). Neue Etagen/Räume in building.json erscheinen
 * automatisch. Konzept: docs/PLAYER_ENTRY_AND_BUILDING_PLAN.md §3.
 */
import buildingData from '../data/building.json';

export interface FloorDef {
  id: string;
  level: number;
  label_de: string;
  label_en?: string;
}

export interface RoomDef {
  id: string;
  floor: string;
  npcId?: string;
  icon: string;
  label_de: string;
  label_en?: string;
  col?: number;
  colSpan?: number;
}

/**
 * Stage-Maße (1 Stage-px = 1 CSS-px vor Kamera-Skalierung).
 * Proportionssystem (GESAMTKONZEPT_VISUELL.md §4.2): Bezug = Avatar-Höhe H.
 * Avatar ≈ 57 % der Etagenhöhe (Ziel ~60 %, K6.4), Tür ≈ 1,15 H — der Avatar
 * ist damit IMMER größer als Mobiliar (Owner-Regel „Avatar > Schreibtisch").
 */
export const STAGE = {
  colWidth: 448,
  floorHeight: 224,
  slabHeight: 24,
  pillarWidth: 48,
  shaftWidth: 184,
  roofHeight: 160,
  groundHeight: 96,
  doorWidth: 96,
  doorHeight: 144,
  avatarSize: 128, // 32px-Frames ×4 (Proportionsregel)
} as const;

export interface FloorLayout extends FloorDef {
  /** Oberkante der Etage (Stage-px). */
  y: number;
  /** Lauflinie: y der Avatar-Oberkante, Füße auf Etagenboden. */
  walkY: number;
}

export interface RoomLayout extends RoomDef {
  x: number;
  y: number;
  w: number;
  h: number;
  /** x-Mitte der Tür (Lauf-Ziel). */
  doorX: number;
  floorLevel: number;
}

export interface BuildingLayout {
  width: number;
  height: number;
  colCount: number;
  floors: FloorLayout[]; // oberste zuerst
  rooms: RoomLayout[];
  shaft: { x: number; w: number; topY: number; bottomY: number };
  /** x-Mitte vor dem Fahrstuhl (Einstiegsposition). */
  shaftEntryX: number;
  /** Lobby-Eingang (Spawn der Ankunfts-Sequenz). */
  entryX: number;
  entryFloorLevel: number;
  roofY: number;
}

const floorsRaw = (buildingData.floors as FloorDef[]).slice().sort((a, b) => b.level - a.level);
const roomsRaw = buildingData.rooms as RoomDef[];

function computeLayout(): BuildingLayout {
  const colCount = Math.max(1, ...roomsRaw.map((r) => (r.col ?? 1) + (r.colSpan ?? 1) - 1));
  const { colWidth, floorHeight, slabHeight, pillarWidth, shaftWidth, roofHeight, groundHeight, avatarSize } = STAGE;

  const shaftX = pillarWidth + colCount * colWidth;
  const width = shaftX + shaftWidth + pillarWidth;

  const floors: FloorLayout[] = floorsRaw.map((f, idx) => {
    const y = roofHeight + idx * (floorHeight + slabHeight);
    return { ...f, y, walkY: y + floorHeight - avatarSize - 6 };
  });
  const height = roofHeight + floors.length * (floorHeight + slabHeight) + groundHeight;

  const floorByIdId = new Map(floors.map((f) => [f.id, f]));
  const rooms: RoomLayout[] = roomsRaw.map((r) => {
    const floor = floorByIdId.get(r.floor);
    if (!floor) throw new Error(`building.json: Raum "${r.id}" verweist auf unbekannte Etage "${r.floor}"`);
    const col = r.col ?? 1;
    const span = r.colSpan ?? 1;
    const x = pillarWidth + (col - 1) * colWidth;
    const w = span * colWidth;
    return {
      ...r,
      x,
      y: floor.y,
      w,
      h: floorHeight,
      doorX: x + w - STAGE.doorWidth - 24 + STAGE.doorWidth / 2,
      floorLevel: floor.level,
    };
  });

  const groundFloor = floors.find((f) => f.level === 0) ?? floors[floors.length - 1];

  return {
    width,
    height,
    colCount,
    floors,
    rooms,
    shaft: { x: shaftX, w: shaftWidth, topY: floors[0].y, bottomY: floors[floors.length - 1].y + floorHeight },
    shaftEntryX: shaftX + shaftWidth / 2,
    entryX: pillarWidth + 40,
    entryFloorLevel: groundFloor.level,
    roofY: 0,
  };
}

let cached: BuildingLayout | null = null;

/** Layout des Gebäudes (gecacht — building.json ist statisch importiert). */
export function getBuildingLayout(): BuildingLayout {
  if (!cached) cached = computeLayout();
  return cached;
}

export function roomById(id: string): RoomLayout | undefined {
  return getBuildingLayout().rooms.find((r) => r.id === id);
}

export function floorByLevel(level: number): FloorLayout | undefined {
  return getBuildingLayout().floors.find((f) => f.level === level);
}
