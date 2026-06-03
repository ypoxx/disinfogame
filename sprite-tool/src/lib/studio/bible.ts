// ===========================================
// STIL-BIBEL — die Konsistenz-Maschine
// ===========================================
// Eine versionierte, editierbare "eine Wahrheit" für den Look. Ihr `anchor`-Text
// wird JEDEM Generierungs-Prompt vorangestellt; `masters` verweist auf freigegebene
// Bibliotheks-Assets, die als Referenzbilder mitgeschickt werden. So sieht Asset 50
// noch aus wie Asset 1 — nicht weil Alex sich erinnert, sondern weil das Tool es erzwingt.

import { STORES, dbGet, dbGetAll, dbPut } from './db';

export interface PaletteColor {
  name: string;
  hex: string;
}

export interface StyleBible {
  id: string; // 'active' für die aktive Bibel; 'snap:<ts>' für Schnappschüsse
  styleVersion: string; // z. B. 'v1'
  directionName: string; // z. B. "Sowjet-Brutalismus"
  mood: string;
  palette: PaletteColor[];
  dos: string[];
  donts: string[];
  renderNotes: string; // Linienstärke, Licht, Perspektive, Pixel-Hinweise
  /** Master-Referenzen: Slot → Library-Asset-key. Slots z. B. 'character', 'room:medien_zentrum'. */
  masters: Record<string, string>;
  /** Optional manuell überschriebener Anchor; sonst wird er aus den Feldern gebaut. */
  anchorOverride?: string;
  updatedAt: number;
}

export const ACTIVE_BIBLE_ID = 'active';

export const DEFAULT_BIBLE: StyleBible = {
  id: ACTIVE_BIBLE_ID,
  styleVersion: 'v1',
  directionName: 'Sowjet-Brutalismus (1970er–80er)',
  mood: 'Bürokratisch, klaustrophobisch, kalt; latente Bedrohung, Kalter-Krieg-Paranoia.',
  palette: [
    { name: 'Beton-Grau', hex: '#6B7280' },
    { name: 'Beton-Grau hell', hex: '#9CA3AF' },
    { name: 'Militär-Olive', hex: '#4A5D23' },
    { name: 'Olive hell', hex: '#6B8E23' },
    { name: 'Rost-Braun', hex: '#8B4513' },
    { name: 'Beige', hex: '#D2B48C' },
    { name: 'Sowjet-Rot (Akzent)', hex: '#B22234' },
    { name: 'Warn-Gelb (Akzent)', hex: '#FFD700' },
    { name: 'Monitor-Grün (Tech)', hex: '#00FF00' },
  ],
  dos: [
    '16-bit Pixel-Art-Look (SNES-Ära), harte geometrische Kanten',
    'gedeckte Farben, sparsame rote Akzente',
    'fluoreszierende, kalte Beleuchtung; abgenutzte Texturen (Beton, Metall, Holz)',
    'klare, lesbare Silhouetten',
  ],
  donts: [
    'knallige/gesättigte Farben, Pastelltöne',
    'moderne, cleane Hochglanz-Ästhetik',
    'eingebauter Text/Schrift in der Grafik (Text kommt im Spiel-Code dazu)',
  ],
  renderNotes:
    'Seitliche/frontale orthografische Sicht für Figuren; Räume als Querschnitt/Bühne. ' +
    'Konsistente Linienstärke und Pixeldichte. Figuren mit transparentem Hintergrund.',
  masters: {},
  updatedAt: Date.now(),
};

/** Baut den Anchor-Text, der jedem Prompt vorangestellt wird. */
export function buildAnchor(bible: StyleBible): string {
  if (bible.anchorOverride && bible.anchorOverride.trim()) return bible.anchorOverride.trim();
  const palette = bible.palette.map((c) => `${c.name} ${c.hex}`).join(', ');
  return [
    `STYLE ANCHOR — ${bible.directionName} (${bible.styleVersion}).`,
    `Mood: ${bible.mood}`,
    `Palette: ${palette}.`,
    `Do: ${bible.dos.join('; ')}.`,
    `Don't: ${bible.donts.join('; ')}.`,
    `Render: ${bible.renderNotes}`,
  ].join('\n');
}

/** Lädt die aktive Bibel (oder die Default-Bibel, falls noch keine gespeichert). */
export async function loadActiveBible(): Promise<StyleBible> {
  try {
    const stored = await dbGet<StyleBible>(STORES.bible, ACTIVE_BIBLE_ID);
    if (stored) return { ...DEFAULT_BIBLE, ...stored, id: ACTIVE_BIBLE_ID };
  } catch {
    // IndexedDB nicht verfügbar → Default
  }
  return { ...DEFAULT_BIBLE };
}

export async function saveActiveBible(bible: StyleBible): Promise<void> {
  await dbPut(STORES.bible, { ...bible, id: ACTIVE_BIBLE_ID, updatedAt: Date.now() });
}

/** Schnappschuss der aktuellen Bibel (Versionierung/Historie). */
export async function snapshotBible(bible: StyleBible): Promise<void> {
  const ts = Date.now();
  await dbPut(STORES.bible, { ...bible, id: `snap:${ts}`, updatedAt: ts });
}

export async function listBibleSnapshots(): Promise<StyleBible[]> {
  try {
    const all = await dbGetAll<StyleBible>(STORES.bible);
    return all.filter((b) => b.id.startsWith('snap:')).sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}
