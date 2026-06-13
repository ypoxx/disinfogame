// ===========================================
// V2 STYLE-LOCK + TRANSPARENZ-PROOF (Strang 1, PR 1b)
// ===========================================
// Erzeugt einen kleinen Beweis für: (a) moderne v2-Farbwelt statt 70er-Klischee,
// (b) gelöste NPC-Transparenz (Magenta→Alpha) für die "NPC groß hinter Schreibtisch"-
// Raum-Nahsicht. Ausgabe nach runs/v2-proof/ (gitignored). KEIN Manifest-Schreiben.
//
// Aufruf:  GEMINI_API_KEY=... node scripts/v2-proof.mjs
// Budget:  4 Bilder ≈ $0.5 (Nano Banana Pro, 2K-Tier).

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { generateImage } from '../src/gemini.mjs';
import { keyOutMagenta } from '../src/transparency.mjs';
import { CHROMA_PROMPT } from '../src/transparency.mjs';
import { RUNS_DIR } from '../src/paths.mjs';

const OUT = path.join(RUNS_DIR, 'v2-proof');
fs.mkdirSync(OUT, { recursive: true });

// --- v2-Stil-Anker (modern 2026, NICHT 70er-Braun, fein statt grob) ---
const V2 = (extra = '') =>
  'fine detailed pixel art, crisp clean pixels, modern high-resolution pixel art ' +
  '(not coarse, not a 1990s look), SNES-to-modern-indie game style. ' +
  'Setting: a CONTEMPORARY (2020s) government / intelligence ministry interior with ' +
  'restrained brutalist geometry — concrete, glass and steel, maintained and lived-in, ' +
  'NOT 1970s brown, NOT dark and empty. ' +
  `Cool clean slightly-desaturated modern palette: cool greys #262A31 #3A3F47 #9AA1AC #E7EAEF, ` +
  `dosed dark-red #C2253B and cyan tech #34C6D8 accents, soft context lighting. ${extra} ` +
  'Hard geometric edges, subtle grain. No saturated candy colors, no pastel tones. ' +
  'Fictional eastern-bloc-inspired state: no real-world national symbols, no hammer and sickle, ' +
  'no real flags, no emblems or insignia of any actual country, no readable text.';

// --- Halbfigur Marina (Medien-Spezialistin), 3 Stil-Varianten, transparent ---
const HALF = 'A pixel art character HALF FIGURE shown from the hips up, large and clearly ' +
  'visible like a visual-novel / adventure-game character that stands behind a desk. ' +
  'A confident woman media specialist in her late 30s, smart modern dark blazer, groomed ' +
  'short hair, a slight knowing smile, facing slightly left, calm posture. ' +
  'Centered, full upper body inside the frame, head not cropped.';

const figureVariants = [
  { id: 'marina_half_A', extra: 'neutral cool modern office lighting, balanced.', seed: 220001 },
  { id: 'marina_half_B', extra: 'a warmer, brighter media-room light (the media center is one of the brighter rooms).', seed: 221001 },
  { id: 'marina_half_C', extra: 'a slightly more dramatic cold, noir intelligence-agency mood, but still modern and clean.', seed: 222001 },
];

// --- v2-Raum: Medien-Zentrum (Marinas Raum, hellere Zone) ---
const ROOM = 'A pixel art game background scene, wide interior view of a CONTEMPORARY media / ' +
  'broadcast monitoring office: a wall of flat modern screens showing abstract news graphics, ' +
  'a long clean desk, a soft seating corner, large window with city light, plants, ' +
  'an abstract constructivist-style poster (geometric shapes only, no emblems, no text). ' +
  'One of the brighter, warmer rooms. No people, no text, no UI elements.';

async function gen(prompt, aspect, seed) {
  const r = await generateImage({ prompt, aspectRatio: aspect, seed });
  return sharp(Buffer.from(r.base64, 'base64')).png().toBuffer();
}

async function main() {
  const made = [];

  // 1) v2-Raum
  console.log('… room_medien_zentrum_v2');
  const roomPng = await gen(`${ROOM} ${V2()}`, '16:9', 230001);
  const roomFile = path.join(OUT, 'room_medien_zentrum_v2.png');
  fs.writeFileSync(roomFile, roomPng);
  made.push(roomFile);
  const roomDisplay = await sharp(roomPng).resize(960, 540, { fit: 'fill' }).png().toBuffer();

  // 2) 3 transparente Halbfiguren + Composite über den Raum
  for (const v of figureVariants) {
    console.log(`… ${v.id}`);
    const raw = await gen(`${HALF} ${CHROMA_PROMPT} ${V2(v.extra)}`, '3:4', v.seed);
    const cut = await keyOutMagenta(raw);
    const cutFile = path.join(OUT, `${v.id}_transparent.png`);
    fs.writeFileSync(cutFile, cut);
    made.push(cutFile);

    // Composite: Figur ~78% Raumhöhe, unten-zentriert (Demo "hinter Schreibtisch")
    const figH = Math.round(540 * 0.78);
    const fig = await sharp(cut).resize({ height: figH }).png().toBuffer();
    const meta = await sharp(fig).metadata();
    const comp = await sharp(roomDisplay)
      .composite([{ input: fig, top: 540 - figH, left: Math.round((960 - meta.width) / 2) }])
      .png()
      .toBuffer();
    const compFile = path.join(OUT, `composite_${v.id}.png`);
    fs.writeFileSync(compFile, comp);
    made.push(compFile);
  }

  console.log(`\nFertig: ${made.length} Dateien → ${OUT}`);
  for (const f of made) console.log('   ' + path.relative(process.cwd(), f));
}

main().catch((e) => {
  console.error('Fehler:', e.message ?? e);
  process.exit(1);
});
