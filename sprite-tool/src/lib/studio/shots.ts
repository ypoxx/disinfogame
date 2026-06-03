// ===========================================
// SHOT-LISTE — der Asset-Backlog, abgeleitet aus den Spieldaten
// ===========================================
// `deriveShots` macht aus building.json + npcs.json eine geordnete Aufgabenliste.
// Reihenfolge = echte Abhängigkeit des Spiels (VISION_LOCK §5): zuerst der EINE
// Lauf-Zyklus (Linchpin fürs lebendige Gebäude), dann Gebäude, Räume, Figuren.
// MODULARITÄT: Neue Etage/Raum/Person in den Daten → neuer Shot, ohne Code.

import { STORES, dbGetAll, dbPut, dbDelete } from './db';
import { describeNpc, npcById, type GameConcept } from './concept';

export type ShotKind = 'walkcycle' | 'building' | 'room' | 'character' | 'prop';
export type ShotStatus = 'todo' | 'in_progress' | 'approved';

export interface Shot {
  id: string; // stabil & ableitbar, z. B. 'room:medien_zentrum'
  kind: ShotKind;
  subjectId?: string; // Raum- bzw. NPC-id
  title: string;
  brief: string; // kurze, menschenlesbare Beschreibung (auto)
  status: ShotStatus;
  assetKey?: string; // gewähltes Library-Asset
  order: number;
  custom?: boolean; // von Alex manuell ergänzt (nicht aus Daten abgeleitet)
}

const KIND_ORDER: Record<ShotKind, number> = {
  walkcycle: 0,
  building: 1,
  room: 2,
  character: 3,
  prop: 4,
};

/** Leitet die Standard-Shots deterministisch aus dem Konzept ab. */
export function deriveShots(concept: GameConcept): Shot[] {
  const shots: Shot[] = [];

  // 1) Der eine Lauf-Zyklus (harte Abhängigkeit des Spiels).
  shots.push({
    id: 'walkcycle:player',
    kind: 'walkcycle',
    subjectId: 'player',
    title: 'Lauf-Zyklus — Spielfigur',
    brief:
      'Seitlicher 8-Frame-Walk-Cycle des Protagonisten (sowjetischer Bürokrat, grauer Anzug, Aktentasche). Transparenter Hintergrund. Linchpin fürs lebendige Gebäude (useSprite).',
    status: 'todo',
    order: 0,
  });

  // 2) Gebäude-Querschnitt / Außenansicht.
  shots.push({
    id: 'building:cross_section',
    kind: 'building',
    title: 'Gebäude — Querschnitt/Fassade',
    brief: `Mehrstöckiges Agentur-Gebäude im Querschnitt (TVTower-Stil), ${concept.floors.length} Etagen, ${concept.rooms.length} Räume.`,
    status: 'todo',
    order: 1,
  });

  // 3) Räume (je Raum ein Hintergrund) — nach Etage (oben→unten), dann Spalte.
  const floorRank = new Map(concept.floors.map((f, i) => [f.id, i]));
  const sortedRooms = [...concept.rooms].sort((a, b) => {
    const fa = floorRank.get(a.floor) ?? 99;
    const fb = floorRank.get(b.floor) ?? 99;
    if (fa !== fb) return fa - fb;
    return (a.col ?? 0) - (b.col ?? 0);
  });
  sortedRooms.forEach((room, idx) => {
    const npc = npcById(concept, room.npcId);
    shots.push({
      id: `room:${room.id}`,
      kind: 'room',
      subjectId: room.id,
      title: `Raum — ${room.label_de}`,
      brief: [
        `Hintergrund für „${room.label_de}"${room.icon ? ` ${room.icon}` : ''}.`,
        npc ? `Bewohner: ${describeNpc(npc)}.` : 'Kein zugeordneter NPC.',
        'Brutalistischer Raum-Querschnitt, klickbare Hotspots später möglich.',
      ].join(' '),
      status: 'todo',
      order: 100 + idx,
    });
  });

  // 4) Figuren (Portrait/Sprite je NPC).
  concept.npcs.forEach((npc, idx) => {
    shots.push({
      id: `character:${npc.id}`,
      kind: 'character',
      subjectId: npc.id,
      title: `Figur — ${npc.name}`,
      brief: `${describeNpc(npc)}. Konsistent zur Spielfigur (gleiche Familie/Linienstärke).`,
      status: 'todo',
      order: 200 + idx,
    });
  });

  return shots.sort(sortShots);
}

function sortShots(a: Shot, b: Shot): number {
  if (KIND_ORDER[a.kind] !== KIND_ORDER[b.kind]) return KIND_ORDER[a.kind] - KIND_ORDER[b.kind];
  return a.order - b.order;
}

/**
 * Führt abgeleitete Shots mit gespeichertem Stand zusammen:
 * - bekannte Shots behalten Status/Asset,
 * - neue abgeleitete Shots kommen hinzu,
 * - manuell ergänzte (custom) Shots bleiben erhalten.
 */
export function mergeShots(derived: Shot[], persisted: Shot[]): Shot[] {
  const persistedById = new Map(persisted.map((s) => [s.id, s]));
  const merged: Shot[] = derived.map((d) => {
    const p = persistedById.get(d.id);
    return p ? { ...d, status: p.status, assetKey: p.assetKey } : d;
  });
  const derivedIds = new Set(derived.map((d) => d.id));
  for (const p of persisted) {
    if (p.custom && !derivedIds.has(p.id)) merged.push(p);
  }
  return merged.sort(sortShots);
}

export async function loadPersistedShots(): Promise<Shot[]> {
  try {
    return await dbGetAll<Shot>(STORES.shots);
  } catch {
    return [];
  }
}

export async function saveShot(shot: Shot): Promise<void> {
  await dbPut(STORES.shots, shot);
}

export async function deleteShot(id: string): Promise<void> {
  await dbDelete(STORES.shots, id);
}

let customCounter = 0;

export function makeCustomShot(title: string, kind: ShotKind = 'prop'): Shot {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? `custom:${crypto.randomUUID()}`
      : `custom:${Date.now()}_${customCounter++}`;
  return {
    id,
    kind,
    title: title.trim() || 'Neues Asset',
    brief: '',
    status: 'todo',
    order: 300 + customCounter,
    custom: true,
  };
}
