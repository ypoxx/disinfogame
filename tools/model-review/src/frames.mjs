// ===========================================
// EINZELBILDER AUS CLIPS
// ===========================================
// Video-Eingabe ist bei OpenRouter an echtes Guthaben gebunden (HTTP 402:
// „requires at least $1.00 in balance for video"), auch bei Gratis-Modellen.
// Der Ersatzweg: mehrere Einzelbilder je Clip ziehen und als Bilder schicken.
// Damit lässt sich beurteilen, WAS sich bewegt und WO die Dinge dabei stehen —
// nicht aber, wie flüssig es läuft. Das gehört ehrlich in den Bericht.
//
// Container-Falle (siehe scripts/visual-review/README.md): Das mitgelieferte
// ffmpeg ist ein gestrippter Build OHNE fps-Filter. Einzelbilder deshalb per
// `-ss <sek> -frames:v 1` ziehen, nicht per `-vf fps=…`. Und weil die Clips
// vorne den Spiel-Vorlauf enthalten, wird vom ENDE her gesucht (`-sseof`).

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export const FFMPEG = process.env.MODEL_REVIEW_FFMPEG || '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux';

export class FrameFehler extends Error {}

/** Sekunden-Marken vom Clip-Ende her: gleichmäßig über die letzten `fensterSek`. */
export function marken(anzahl, fensterSek) {
  if (anzahl < 1) return [];
  if (anzahl === 1) return [-Math.max(1, Math.round(fensterSek / 2))];
  const schritt = fensterSek / (anzahl - 1);
  return Array.from({ length: anzahl }, (_, i) => -Math.max(0.2, Number((fensterSek - i * schritt).toFixed(1))));
}

/**
 * Einzelbilder eines Clips ziehen. Gibt die geschriebenen Pfade zurück.
 * `durationMs` ist die im Manifest vermerkte Länge des RELEVANTEN Teils.
 */
export function ziehe(clipDatei, zielDir, { anzahl = 4, durationMs = 6000, ffmpeg = FFMPEG } = {}) {
  if (!fs.existsSync(clipDatei)) throw new FrameFehler(`Clip fehlt: ${clipDatei}`);
  if (!fs.existsSync(ffmpeg)) {
    throw new FrameFehler(
      `ffmpeg nicht gefunden (${ffmpeg}). Pfad über MODEL_REVIEW_FFMPEG setzen.`
    );
  }
  fs.mkdirSync(zielDir, { recursive: true });

  const stamm = path.basename(clipDatei).replace(/\.[^.]+$/, '');
  const fenster = Math.max(1, durationMs / 1000);
  const geschrieben = [];

  marken(anzahl, fenster).forEach((sekundenVomEnde, i) => {
    const ziel = path.join(zielDir, `${stamm}__f${i + 1}.png`);
    try {
      execFileSync(
        ffmpeg,
        ['-y', '-sseof', String(sekundenVomEnde), '-i', clipDatei, '-frames:v', '1', ziel],
        { stdio: 'ignore', timeout: 60_000 }
      );
    } catch {
      return; // Einzelne Marke kann danebenliegen (zu kurzer Clip) — kein Grund abzubrechen.
    }
    if (fs.existsSync(ziel) && fs.statSync(ziel).size > 0) geschrieben.push(ziel);
  });

  if (!geschrieben.length) throw new FrameFehler(`Aus ${path.basename(clipDatei)} ließ sich kein Bild ziehen.`);
  return geschrieben;
}
