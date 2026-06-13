// ===========================================
// PLATZHALTER-GRAFIKEN — ohne API-Keys, rein lokal (sharp: SVG → PNG)
// ===========================================
// Zweck: die komplette Kette „Manifest → Spiel lädt → BuildingView/Porträts/
// useSprite rendern" testbar machen, BEVOR echte KI-Bilder existieren.
// Platzhalter sind bewusst als solche erkennbar (Beschriftung + Schraffur)
// und werden beim echten Lauf einfach überschrieben (gleiche ids/Pfade).

import sharp from 'sharp';

// Gedeckte Palette aus dem Style-Guide für wiedererkennbare Akzente.
const ACCENTS = ['#B22234', '#4A5D23', '#8B4513', '#6B7280', '#FFD700'];

function accentFor(id) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Flächiger Platzhalter (Raum/Porträt/Prop) mit Label + Schraffur. */
export function flatPlaceholderSvg(id, w, h) {
  const accent = accentFor(id);
  const fontSize = Math.max(14, Math.round(Math.min(w, h) / 12));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <pattern id="hatch" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="24" height="24" fill="#1a1a1a"/>
      <line x1="0" y1="0" x2="0" y2="24" stroke="#242424" stroke-width="10"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#hatch)"/>
  <rect x="0" y="0" width="100%" height="${Math.max(6, Math.round(h * 0.04))}" fill="${accent}"/>
  <rect x="2" y="2" width="${w - 4}" height="${h - 4}" fill="none" stroke="#3a3a3a" stroke-width="4"/>
  <text x="50%" y="50%" fill="#9CA3AF" font-family="monospace" font-size="${fontSize}"
        text-anchor="middle" dominant-baseline="middle">${escapeXml(id)}</text>
  <text x="50%" y="${h - fontSize}" fill="#555" font-family="monospace" font-size="${Math.round(fontSize * 0.7)}"
        text-anchor="middle">PLATZHALTER</text>
</svg>`;
}

/**
 * Sheet-Platzhalter: exakte Frame-Raster, transparenter Hintergrund, je Frame
 * eine simple Figur mit frame-abhängiger Beinstellung → useSprite-Animation
 * ist sichtbar prüfbar.
 */
export function sheetPlaceholderSvg(id, frameWidth, frameHeight, cols, rows) {
  const accent = accentFor(id);
  const w = frameWidth * cols;
  const h = frameHeight * rows;
  let frames = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * frameWidth;
      const y = row * frameHeight;
      const idx = row * cols + col;
      const phase = Math.sin((idx / Math.max(1, cols)) * Math.PI * 2);
      const legSpread = Math.round(phase * frameWidth * 0.12);
      const bob = Math.round(Math.abs(phase) * 2);
      const cx = x + frameWidth / 2;
      const headR = Math.round(frameWidth * 0.14);
      const bodyW = Math.round(frameWidth * 0.3);
      const bodyH = Math.round(frameHeight * 0.38);
      const bodyY = y + Math.round(frameHeight * 0.3) + bob;
      frames += `
  <g>
    <rect x="${x}" y="${y}" width="${frameWidth}" height="${frameHeight}" fill="none" stroke="#333" stroke-width="1" stroke-dasharray="2,2"/>
    <circle cx="${cx}" cy="${y + Math.round(frameHeight * 0.2) + bob}" r="${headR}" fill="#D2B48C"/>
    <rect x="${cx - bodyW / 2}" y="${bodyY}" width="${bodyW}" height="${bodyH}" fill="${accent}"/>
    <line x1="${cx}" y1="${bodyY + bodyH}" x2="${cx - legSpread - 2}" y2="${y + frameHeight - 2}" stroke="#6B7280" stroke-width="3"/>
    <line x1="${cx}" y1="${bodyY + bodyH}" x2="${cx + legSpread + 2}" y2="${y + frameHeight - 2}" stroke="#6B7280" stroke-width="3"/>
  </g>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${frames}\n</svg>`;
}

/** Rendert den Platzhalter eines Bild-/Sheet-Shots als PNG-Buffer. */
export async function renderPlaceholder(shot) {
  if (shot.type === 'sheet') {
    const svg = sheetPlaceholderSvg(shot.id, shot.frameWidth, shot.frameHeight, shot.cols ?? 1, shot.rows ?? 1);
    return sharp(Buffer.from(svg)).png().toBuffer();
  }
  // Räume in Zielauflösung; Porträts/Props kompakt (Manifest trägt keine Maße).
  const w = shot.kind === 'room' ? shot.size.w : Math.min(shot.size?.w ?? 256, 256);
  const h = shot.kind === 'room' ? shot.size.h : Math.min(shot.size?.h ?? 256, 256);
  const svg = flatPlaceholderSvg(shot.id, w, h);
  return sharp(Buffer.from(svg)).png().toBuffer();
}
