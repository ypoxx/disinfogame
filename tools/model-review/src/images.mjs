// ===========================================
// BILDER & CLIPS — Anschauungsmaterial für die UI-Linse
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

const VIDEO_MIME = {
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
};

export const VIDEO_ENDUNGEN = Object.keys(VIDEO_MIME);

/**
 * Grobe Token-Schätzung je Clip. Video ist deutlich teurer als ein Standbild
 * und stark modellabhängig — nur als Größenordnung für die Vorschau gedacht.
 */
export function videoTokens(anzahl, proClip = Number.parseInt(process.env.MODEL_REVIEW_VIDEO_TOKENS ?? '', 10) || 12_000) {
  return anzahl * proClip;
}

/** Grobe Token-Schätzung je Bild — modellabhängig, daher bewusst konservativ. */
export function bildTokens(anzahl, proBild = Number.parseInt(process.env.MODEL_REVIEW_BILD_TOKENS ?? '', 10) || 1600) {
  return anzahl * proBild;
}

/** Ein Pfad → Dateiliste (Verzeichnis = alle passenden Dateien darin, sortiert). */
export function sammlePfade(pfad, endungen = BILD_ENDUNGEN) {
  const abs = path.isAbsolute(pfad) ? pfad : path.join(REPO_ROOT, pfad);
  if (!fs.existsSync(abs)) throw new BildFehler(`Datei/Verzeichnis fehlt: ${pfad}`);
  if (fs.statSync(abs).isDirectory()) {
    const drin = fs
      .readdirSync(abs)
      .filter((n) => endungen.includes(path.extname(n).toLowerCase()))
      .sort()
      .map((n) => path.join(abs, n));
    if (drin.length === 0) throw new BildFehler(`Nichts Passendes in ${pfad} (erlaubt: ${endungen.join(' ')})`);
    return drin;
  }
  return [abs];
}

/** Rückwärtskompatibler Name — Bilder sind der Regelfall. */
export const sammleBildpfade = (pfad) => sammlePfade(pfad, BILD_ENDUNGEN);

/**
 * Bilder laden und als Daten-URLs aufbereiten.
 * `maxAnzahl` und `maxBytes` sind Kostenbremsen: Bilder sind im Prompt teuer.
 */
function ladeMedien(pfade, { tabelle, endungen, maxAnzahl, maxBytes, art, flagge, rat }) {
  const alle = pfade.flatMap((p) => sammlePfade(p, endungen));
  if (alle.length > maxAnzahl) {
    throw new BildFehler(
      `${alle.length} ${art} gefunden, erlaubt sind ${maxAnzahl} pro Lauf. ` +
        `Weniger auswählen oder ${flagge} erhöhen.`
    );
  }

  return alle.map((abs) => {
    const endung = path.extname(abs).toLowerCase();
    const mime = tabelle[endung];
    if (!mime) throw new BildFehler(`${relToRepo(abs)}: ${endung} wird nicht unterstützt (${endungen.join(' ')}).`);
    const roh = fs.readFileSync(abs);
    if (roh.length > maxBytes) {
      throw new BildFehler(
        `${relToRepo(abs)} ist ${(roh.length / 1024 / 1024).toFixed(1)} MB — Grenze ${(maxBytes / 1024 / 1024).toFixed(1)} MB. ${rat}`
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

/** Screenshots laden. `maxAnzahl` ist die Bremse — bei Gratis-Modellen darf sie hoch sein. */
export function ladeBilder(pfade, { maxAnzahl = 40, maxBytes = 8 * 1024 * 1024 } = {}) {
  return ladeMedien(pfade, {
    tabelle: MIME,
    endungen: BILD_ENDUNGEN,
    maxAnzahl,
    maxBytes,
    art: 'Bilder',
    flagge: '--max-bilder',
    rat: 'Screenshot verkleinern (z. B. Viewport 1280×720 statt Vollbild).',
  });
}

/**
 * Clips laden. Nur Modelle mit `video` in den input_modalities können damit
 * etwas anfangen — die CLI prüft das vor dem Aufruf.
 */
export function ladeVideos(pfade, { maxAnzahl = 8, maxBytes = 24 * 1024 * 1024 } = {}) {
  return ladeMedien(pfade, {
    tabelle: VIDEO_MIME,
    endungen: VIDEO_ENDUNGEN,
    maxAnzahl,
    maxBytes,
    art: 'Clips',
    flagge: '--max-videos',
    rat: 'Clip kürzen oder kleiner aufnehmen.',
  });
}
