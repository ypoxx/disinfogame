// ===========================================
// PFADE — alles relativ zur Repo-Wurzel, per Env überschreibbar
// ===========================================

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Repo-Wurzel (tools/asset-pipeline/src → drei Ebenen hoch). */
export const REPO_ROOT = path.resolve(here, '..', '..', '..');

/** Kanonische Spieldaten (Quelle für die Shot-Liste). */
export const GAME_DATA_DIR =
  process.env.PIPELINE_GAME_DATA_DIR ||
  path.join(REPO_ROOT, 'desinformation-network', 'src', 'story-mode', 'data');

export const BUILDING_JSON = path.join(GAME_DATA_DIR, 'building.json');
export const NPCS_JSON = path.join(GAME_DATA_DIR, 'npcs.json');

/** Stil-Anker (Single Source of Truth des Looks, gepflegt im sprite-tool). */
export const STYLE_GUIDE_MD =
  process.env.PIPELINE_STYLE_GUIDE ||
  path.join(REPO_ROOT, 'sprite-tool', 'public', 'context', 'game-style-guide.md');

/** Zielordner im Spiel (dorthin schreibt der Export). */
export const OUT_DIR =
  process.env.PIPELINE_OUT_DIR ||
  path.join(REPO_ROOT, 'desinformation-network', 'public', 'assets');

/** Stimmen-Besetzung (npcId → ElevenLabs voice_id). */
export const VOICES_JSON =
  process.env.PIPELINE_VOICES_JSON ||
  path.join(REPO_ROOT, 'tools', 'asset-pipeline', 'config', 'voices.json');

/** Laufprotokolle (gitignored). */
export const RUNS_DIR = path.join(REPO_ROOT, 'tools', 'asset-pipeline', 'runs');
