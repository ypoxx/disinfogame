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

/** Englischer Stil-Kern (v2 — modern 2026 statt 70er-Klischee, E16/E17).
 * Enthält bewusst die Marker „16-bit pixel art" und „brutalist" (Stil-Lock +
 * Pipeline-Tests). Feine Pixel statt grob; kühl-cleaner Neutral-Kern + dosierte
 * Akzente; Zonen-Licht kommt je Shot aus dem konkreten Prompt. */
/**
 * Objekt-Stil (für freistehende Props/Deko): WIE styleCore, aber OHNE den
 * „Setting: … interior"-Satz — der verleitet das Modell sonst dazu, ein ganzes
 * Raum-Szenario um das Objekt zu malen (R4-Befund: Deko kam als Mini-Szene).
 */
export function styleObject() {
  return (
    'Fine, detailed 16-bit pixel art with crisp clean pixels (modern high-resolution ' +
    'pixel art, not coarse, not a 1990s look), SNES-to-modern-indie game style. ' +
    'Cool, clean, slightly desaturated modern palette: cool greys (#262A31, #3A3F47, ' +
    '#9AA1AC, #E7EAEF), with dosed dark-red (#C2253B) and cyan tech (#34C6D8) accents. ' +
    'Hard geometric edges, subtle grain. No saturated candy colors, no pastel tones. ' +
    'No real-world national symbols, no readable text.'
  );
}

/**
 * Heim-Stil (Fernsehfamilie/Westunion-Wohnzimmer): WARM, hell, freundlich —
 * bewusst NICHT die kühl-graue Ministeriums-Anmutung (Owner: „nicht wie die
 * Propaganda-Fabrik, viel freundlicher, heller, eben die Westunion").
 */
export function styleHome() {
  return (
    'Fine, detailed 16-bit pixel art with crisp clean pixels (modern high-resolution ' +
    'pixel art, SNES-to-modern-indie game style). A WARM, BRIGHT, COZY contemporary ' +
    '(2020s) western middle-class HOME interior — friendly, lived-in and welcoming, ' +
    'absolutely NOT institutional, NOT a ministry, NOT grim, NOT a cold concrete office. ' +
    'Warm inviting palette: warm wood floor, cream and soft-beige walls, warm lamp glow ' +
    'and soft daylight, gentle warm highlights, only a few cool accents. Soft homely ' +
    'lighting, cozy and bright. No saturated candy colors, no pastel-only look. ' +
    'No real-world national symbols, no readable text.'
  );
}

export function styleCore() {
  return (
    'Fine, detailed 16-bit pixel art with crisp clean pixels (modern high-resolution ' +
    'pixel art, not coarse, not a 1990s look), SNES-to-modern-indie game style. ' +
    'Setting: a CONTEMPORARY (2020s) state ministry / intelligence agency interior with ' +
    'restrained brutalist geometry — concrete, glass and steel, maintained and lived-in, ' +
    'NOT 1970s brown, NOT dark and empty. ' +
    'Cool, clean, slightly desaturated modern palette: cool greys (#262A31, #3A3F47, ' +
    '#9AA1AC, #E7EAEF), with dosed dark-red (#C2253B) and cyan tech (#34C6D8) accents and ' +
    'soft context lighting. Hard geometric edges, subtle grain. No saturated candy colors, ' +
    'no pastel tones. Fictional eastern-bloc-inspired state: no real-world national symbols, ' +
    'no hammer and sickle, no real flags, no state emblems or insignia of any actual country, ' +
    'no readable text.'
  );
}
