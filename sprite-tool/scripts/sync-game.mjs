// Spielkonzept-Snapshot ins Studio kopieren (lokal ausführen: `npm run sync:game`).
// Hält public/game/*.json mit den kanonischen Spieldaten in Sync. Der Build/Deploy
// nutzt den committeten Snapshot (das gehostete Tool sieht das Spiel-Repo nicht).
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';

const SRC = '../desinformation-network/src/story-mode/data';
const OUT = 'public/game';

mkdirSync(OUT, { recursive: true });
let ok = 0;
for (const f of ['building.json', 'npcs.json']) {
  const src = `${SRC}/${f}`;
  if (existsSync(src)) {
    copyFileSync(src, `${OUT}/${f}`);
    console.log('✓ synced', f);
    ok++;
  } else {
    console.warn('⚠ Quelle fehlt (übersprungen):', src);
  }
}
console.log(`Fertig: ${ok} Datei(en). (Style-Guide: public/context/game-style-guide.md separat pflegen.)`);
