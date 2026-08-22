// ===========================================
// PFADE — alles relativ zur Repo-Wurzel, per Env überschreibbar
// ===========================================

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Repo-Wurzel (tools/model-review/src → drei Ebenen hoch). */
export const REPO_ROOT = path.resolve(here, '..', '..', '..');

/** Werkzeug-Wurzel. */
export const TOOL_ROOT = path.resolve(here, '..');

/** Das Spiel. */
export const GAME_ROOT = path.join(REPO_ROOT, 'desinformation-network');

/** Kanonische Spieldaten. */
export const GAME_DATA_DIR = path.join(GAME_ROOT, 'src', 'story-mode', 'data');

/** Story-Mode-Quellcode (für die Architektur-Linse). */
export const STORY_SRC_DIR = path.join(GAME_ROOT, 'src', 'story-mode');

/** Zielordner der Berichte (werden committet — das ist der Sinn der Übung). */
export const REPORT_DIR =
  process.env.MODEL_REVIEW_OUT_DIR || path.join(REPO_ROOT, 'docs', 'MODEL_REVIEWS');

/** Laufprotokolle + Kontext-Abzüge (gitignored). */
export const RUNS_DIR = path.join(TOOL_ROOT, 'runs');

/** Optionale lokale Schlüsseldatei (gitignored, NIEMALS committen). */
export const ENV_FILE = path.join(TOOL_ROOT, '.env');

/**
 * Pfad relativ zur Repo-Wurzel — für lesbare Ausgaben. Liegt die Datei außerhalb
 * des Repos (z. B. Screenshots in /tmp), bleibt der absolute Pfad stehen: eine
 * Kette aus `../../..` ist schlechter lesbar als das Original.
 */
export function relToRepo(p) {
  const rel = path.relative(REPO_ROOT, p).split(path.sep).join('/');
  return rel.startsWith('../') ? p : rel;
}
