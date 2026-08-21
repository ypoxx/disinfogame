// ===========================================
// BILDER — Screenshots für die UI-Linse
// ===========================================
// Ohne Pixel kann kein Modell sagen, dass eine Grafik zu tief sitzt. Bilder
// gehen als Daten-URL im user-Inhalt mit (OpenRouter: ImageContentPart,
// `image_url.url` nimmt URL oder base64). Jedes Bild wird im Prompt mit
// seinem Dateinamen angekündigt, damit das Modell sich präzise darauf
// beziehen kann ("in 05_hud.png …").

import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, relToRepo } from './paths.mjs';

export class BildFehler extends Error {}

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

export const BILD_ENDUNGEN = Object.keys(MIME);

/** Grobe Token-Schätzung je Bild — modellabhängig, daher bewusst konservativ. */
export function bildTokens(anzahl, proBild = Number.parseInt(process.env.MODEL_REVIEW_BILD_TOKENS ?? '', 10) || 1600) {
  return anzahl * proBild;
}

/** Ein Pfad → eine Liste von Bilddateien (Verzeichnis = alle Bilder darin, sortiert). */
export function sammleBildpfade(pfad) {
  const abs = path.isAbsolute(pfad) ? pfad : path.join(REPO_ROOT, pfad);
  if (!fs.existsSync(abs)) throw new BildFehler(`Bild/Verzeichnis fehlt: ${pfad}`);
  if (fs.statSync(abs).isDirectory()) {
    const drin = fs
      .readdirSync(abs)
      .filter((n) => BILD_ENDUNGEN.includes(path.extname(n).toLowerCase()))
      .sort()
      .map((n) => path.join(abs, n));
    if (drin.length === 0) throw new BildFehler(`Keine Bilder in ${pfad} (erlaubt: ${BILD_ENDUNGEN.join(' ')})`);
    return drin;
  }
  return [abs];
}

/**
 * Bilder laden und als Daten-URLs aufbereiten.
 * `maxAnzahl` und `maxBytes` sind Kostenbremsen: Bilder sind im Prompt teuer.
 */
export function ladeBilder(pfade, { maxAnzahl = 8, maxBytes = 4 * 1024 * 1024 } = {}) {
  const alle = pfade.flatMap((p) => sammleBildpfade(p));
  if (alle.length > maxAnzahl) {
    throw new BildFehler(
      `${alle.length} Bilder gefunden, erlaubt sind ${maxAnzahl} pro Lauf. ` +
        'Weniger auswählen oder --max-bilder erhöhen (Bilder kosten im Prompt am meisten).'
    );
  }

  return alle.map((abs) => {
    const endung = path.extname(abs).toLowerCase();
    const mime = MIME[endung];
    if (!mime) throw new BildFehler(`${relToRepo(abs)}: ${endung} wird nicht unterstützt (${BILD_ENDUNGEN.join(' ')}).`);
    const roh = fs.readFileSync(abs);
    if (roh.length > maxBytes) {
      throw new BildFehler(
        `${relToRepo(abs)} ist ${(roh.length / 1024 / 1024).toFixed(1)} MB — Grenze ${(maxBytes / 1024 / 1024).toFixed(1)} MB. ` +
          'Screenshot verkleinern (z. B. Viewport 1280×720 statt Vollbild).'
      );
    }
    return {
      rel: relToRepo(abs),
      name: path.basename(abs),
      mime,
      bytes: roh.length,
      dataUrl: `data:${mime};base64,${roh.toString('base64')}`,
    };
  });
}
