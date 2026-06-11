// ===========================================
// STIL-ANKER — englischer Prompt-Kern aus dem Style-Guide
// ===========================================
// Der Guide (sprite-tool/public/context/game-style-guide.md) ist die Quelle
// der Wahrheit fürs Aussehen. Bild-Prompts sind englisch (siehe Vorlage im
// Guide + claude.ts im sprite-tool); hier wird ein kompakter, deterministischer
// Kern gebaut und die Palette aus dem Guide übernommen.

import fs from 'node:fs';
import { STYLE_GUIDE_MD } from './paths.mjs';

const FALLBACK_PALETTE = ['#6B7280', '#4A5D23', '#8B4513', '#D2B48C', '#B22234', '#FFD700', '#00FF00'];

export function loadPalette(styleGuidePath = STYLE_GUIDE_MD) {
  try {
    const md = fs.readFileSync(styleGuidePath, 'utf8');
    const hexes = [...new Set(md.match(/#[0-9A-Fa-f]{6}\b/g) ?? [])];
    return hexes.length >= 4 ? hexes : FALLBACK_PALETTE;
  } catch {
    return FALLBACK_PALETTE;
  }
}

/** Englischer Stil-Kern, der jedem Bild-Prompt vorangestellt wird. */
export function styleCore(styleGuidePath = STYLE_GUIDE_MD) {
  const palette = loadPalette(styleGuidePath).join(', ');
  return (
    '16-bit pixel art, SNES-era retro game style. Soviet-era brutalist aesthetic ' +
    '(1970s-80s): raw concrete walls, cold fluorescent lighting, worn metal and wood, ' +
    'bureaucratic claustrophobic atmosphere. Hard geometric edges. ' +
    `Muted color palette (${palette}); dark-red accents only for important elements. ` +
    'No modern clean design, no saturated candy colors, no pastel tones. ' +
    'Fictional eastern-bloc setting: no real-world national symbols, no hammer and sickle, ' +
    'no real flags, no state emblems or insignia of any actual country, no readable text.'
  );
}
