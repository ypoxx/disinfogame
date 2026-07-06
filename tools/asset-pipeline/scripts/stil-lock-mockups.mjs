// Stil-Lock-Mockups fürs UI-Luxus-Paket (Owner-Entscheidung §4.7 Materialwelt).
// Erzeugt 3 Materialwelten × (Berater-Panel + Aktions-Terminal) = 6 Bilder.
// Lauf:  node scripts/stil-lock-mockups.mjs   (aus tools/asset-pipeline)
// Ausgabe: ../../desinformation-network/runs/visual-review/mockups/*.png (gitignored)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateImage } from '../src/gemini.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', '..', '..', 'desinformation-network', 'runs', 'visual-review', 'mockups');
fs.mkdirSync(OUT, { recursive: true });

const BASE =
  'Fine detailed 16-bit pixel art game UI mockup, crisp clean pixels, strictly flat frontal view, ' +
  'no photorealism, no 3D render. Setting: a fictional eastern-bloc style ministry of disinformation ' +
  '(modern 2020s, NOT soviet-retro kitsch), cool but characterful. Accent color: deep ministry red. ' +
  'IMPORTANT: almost no text — only tiny unreadable placeholder tick marks where labels would be ' +
  '(real text is rendered by the game engine on top). No real-world national symbols, no emblems, no logos.';

const PANEL_LAYOUT =
  'Layout: a tall vertical ADVISOR PANEL for the game sidebar. Header band at top. Below it a stack of ' +
  'four personnel cards, each card with: a small square portrait placeholder frame on the left, a name line area, ' +
  'a horizontal morale meter, and space for one recommendation note. ONE card is visually highlighted as urgent. ' +
  'The panel must read as a physical object of the ministry world, not as software.';

const TERMINAL_LAYOUT =
  'Layout: a full-screen ACTION TERMINAL view — the player desk computer filling the frame: a monitor bezel around ' +
  'a screen that lists four action/operation entries as distinct cards or file rows, each with a cost chip area, an effect ' +
  'chips area and a round stamp area (fresh/known/burned). Include a small filter row at top of the screen. The hardware ' +
  'and screen styling must match the material world. It must feel like a diegetic machine in the ministry, not a website.';

const WORLDS = {
  a_akte: {
    name: 'Behörden-Akte',
    desc:
      'MATERIAL WORLD "BUREAU FILE": everything made of paper and cardboard — manila folders, index cards on a ' +
      'clipboard, red classification rubber stamps, typewriter-style labels, paperclips, staples, kraft paper texture, ' +
      'slightly worn edges. Palette: warm beige/cream paper, charcoal ink, deep ministry red stamps, small warning-yellow markers.',
  },
  b_beton: {
    name: 'Beton & Bakelit',
    desc:
      'MATERIAL WORLD "CONCRETE & BAKELITE": everything made of cast concrete panels and dark bakelite/metal hardware — ' +
      'riveted brushed-metal frames, toggle switches, small amber indicator lamps, engraved metal label plates, cable conduits. ' +
      'Palette: cool concrete grey, near-black bakelite, amber lamp glow, deep ministry red accents.',
  },
  c_oliv: {
    name: 'Oliv-Militaria',
    desc:
      'MATERIAL WORLD "OLIVE FIELD GEAR": the current olive identity made physical — waxed canvas and olive-drab painted ' +
      'metal, stencil-cut markings, metal clasps and webbing straps, map-table green surfaces, field-telephone hardware. ' +
      'Palette: olive drab, grey-green canvas, gunmetal, deep ministry red stamps, warning-yellow stencil accents.',
  },
};

const seedFor = (id) => [...id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 1000000, 7);

const shots = [];
for (const [key, w] of Object.entries(WORLDS)) {
  shots.push({ id: `mock_panel_${key}`, aspectRatio: '9:16', prompt: `${BASE} ${w.desc} ${PANEL_LAYOUT}` });
  shots.push({ id: `mock_terminal_${key}`, aspectRatio: '16:9', prompt: `${BASE} ${w.desc} ${TERMINAL_LAYOUT}` });
}

for (const s of shots) {
  const file = path.join(OUT, `${s.id}.png`);
  if (fs.existsSync(file) && !process.argv.includes('--force')) {
    console.log(`⏭  ${s.id} existiert`);
    continue;
  }
  process.stdout.write(`🎨 ${s.id} … `);
  try {
    const img = await generateImage({ prompt: s.prompt, aspectRatio: s.aspectRatio, seed: seedFor(s.id) });
    fs.writeFileSync(file, Buffer.from(img.base64, 'base64'));
    console.log(`ok (${Math.round(fs.statSync(file).size / 1024)} KB)`);
  } catch (e) {
    console.log(`FEHLER: ${e.message}`);
  }
}
console.log(`Fertig → ${OUT}`);
