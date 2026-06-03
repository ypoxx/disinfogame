// ===========================================
// SPIELKONZEPT-LOADER (die "Wissensquelle" des Studios)
// ===========================================
// Das Studio ist ein eigenständiges (gehostetes) Tool, kann also nicht das
// Spiel-Repo zur Laufzeit lesen. Stattdessen liegt ein SNAPSHOT der kanonischen
// Spieldaten unter public/game/ (+ public/context/game-style-guide.md).
// Refresh per `npm run sync:game` (kopiert aus ../desinformation-network).
//
// WICHTIG für Modularität: Alles Weitere (Shot-Liste, Briefing, Prompts) wird
// AUS diesen Daten abgeleitet. Neue Etage/Raum/Person in den JSONs → erscheint
// automatisch im Studio, ohne Code-Änderung.

export interface ConceptFloor {
  id: string;
  level: number;
  label_de: string;
  label_en?: string;
}

export interface ConceptRoom {
  id: string;
  floor: string;
  col?: number;
  npcId?: string;
  icon?: string;
  label_de: string;
  label_en?: string;
}

export interface ConceptNpc {
  id: string;
  name: string;
  role_de?: string;
  role_en?: string;
  portrait?: string;
  personality?: {
    traits?: string[];
    motivation?: string;
    weakness?: string;
  };
}

export interface GameConcept {
  floors: ConceptFloor[];
  rooms: ConceptRoom[];
  npcs: ConceptNpc[];
  styleGuide: string;
  /** 'bundle' = aus public/game geladen, 'partial' = teils Fallback. */
  source: 'bundle' | 'partial';
  warnings: string[];
}

const FALLBACK_STYLE_GUIDE =
  'Sowjet-Brutalismus der 1970er–80er. Gedeckte Farben (Beton-Grau, Olive, Rost), ' +
  'Akzent in Sowjet-Rot. 16-bit Pixel-Art-Look, harte geometrische Kanten, ' +
  'fluoreszierende kalte Beleuchtung, bürokratisch-klaustrophobische Stimmung.';

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** Lädt das Spielkonzept aus dem gebündelten Snapshot — tolerant gegen Lücken. */
export async function loadGameConcept(): Promise<GameConcept> {
  const warnings: string[] = [];

  const building = await fetchJson<{ floors?: ConceptFloor[]; rooms?: ConceptRoom[] }>(
    '/game/building.json'
  );
  const npcsDoc = await fetchJson<{ npcs?: ConceptNpc[] }>('/game/npcs.json');
  const styleGuide = (await fetchText('/context/game-style-guide.md')) ?? '';

  if (!building) warnings.push('building.json nicht gefunden — Räume/Etagen leer.');
  if (!npcsDoc) warnings.push('npcs.json nicht gefunden — Personen leer.');
  if (!styleGuide) warnings.push('game-style-guide.md nicht gefunden — Fallback-Stil aktiv.');

  const floors = (building?.floors ?? []).filter((f) => f && f.id);
  const rooms = (building?.rooms ?? []).filter((r) => r && r.id);
  const npcs = (npcsDoc?.npcs ?? []).filter((n) => n && n.id);

  return {
    floors: [...floors].sort((a, b) => (b.level ?? 0) - (a.level ?? 0)),
    rooms,
    npcs,
    styleGuide: styleGuide || FALLBACK_STYLE_GUIDE,
    source: building && npcsDoc && styleGuide ? 'bundle' : 'partial',
    warnings,
  };
}

export function npcById(concept: GameConcept, id?: string): ConceptNpc | undefined {
  if (!id) return undefined;
  return concept.npcs.find((n) => n.id === id);
}

export function floorById(concept: GameConcept, id: string): ConceptFloor | undefined {
  return concept.floors.find((f) => f.id === id);
}

export function roomsForFloor(concept: GameConcept, floorId: string): ConceptRoom[] {
  return concept.rooms
    .filter((r) => r.floor === floorId)
    .sort((a, b) => (a.col ?? 0) - (b.col ?? 0));
}

/** Kurz-Beschreibung einer Person fürs Briefing/Prompt (deterministisch). */
export function describeNpc(npc: ConceptNpc): string {
  const traits = npc.personality?.traits?.join(', ');
  return [
    npc.name,
    npc.role_de ? `(${npc.role_de})` : '',
    traits ? `— ${traits}` : '',
  ]
    .filter(Boolean)
    .join(' ');
}
