// ===========================================
// VOICE DESIGN — eigene, synthetische Stimmen statt Bibliotheks-Stimmen
// ===========================================
// Reine Buchhaltung um die ElevenLabs-Aufrufe herum (testbar ohne Netz):
// Beschreibungen laden, Kandidaten-Lauf ablegen, Gewinner ins Casting schreiben.
//
// Ablauf (zwei Kommandos, weil dazwischen ein Mensch hört):
//   1. design-voice --role narrator --live         → Kandidaten als MP3 in runs/
//   2. design-voice --role narrator --pick 2 --save --live
//                                                  → Stimme anlegen + voices.json

import fs from 'node:fs';
import path from 'node:path';
import { VOICE_DESIGN_JSON, VOICES_JSON, RUNS_DIR } from './paths.mjs';

/** Ordner der Kandidaten-Läufe (gitignored, wie alles unter runs/). */
export const DESIGN_RUN_DIR = path.join(RUNS_DIR, 'voice-design');

export function readVoiceDesign(file = VOICE_DESIGN_JSON) {
  if (!fs.existsSync(file)) throw new Error(`Voice-Design-Konfiguration fehlt: ${file}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/**
 * Rolle + Design-Variante auflösen.
 * @param {object} config  Inhalt von voice-design.json
 * @param {string} role    z. B. "narrator"
 * @param {string} [designKey]  überschreibt `roles[role].design`
 */
export function resolveDesign(config, role, designKey) {
  const entry = config?.roles?.[role];
  if (!entry) {
    const known = Object.keys(config?.roles ?? {}).join(', ') || '—';
    throw new Error(`Unbekannte Rolle „${role}". Bekannt: ${known}`);
  }
  const key = designKey || entry.design;
  const design = entry.designs?.[key];
  if (!design) {
    const known = Object.keys(entry.designs ?? {}).join(', ') || '—';
    throw new Error(`Unbekannte Design-Variante „${key}" für „${role}". Bekannt: ${known}`);
  }
  if (!entry.previewText) throw new Error(`„${role}" hat keinen previewText (Probetext für die Kandidaten).`);
  return {
    role,
    designKey: key,
    name: entry.name || role,
    description: design.description,
    previewText: entry.previewText,
  };
}

/** Dateiname eines Kandidaten — sprechend, damit man beim Hören weiß, was man hört. */
export function previewFileName(role, designKey, index) {
  return `${role}_${designKey}_${String(index + 1).padStart(2, '0')}.mp3`;
}

/** Merkzettel eines Kandidaten-Laufs (generated_voice_ids überleben den Prozess). */
export function runFileName(role) {
  return path.join(DESIGN_RUN_DIR, `${role}.json`);
}

export function writeDesignRun(run) {
  fs.mkdirSync(DESIGN_RUN_DIR, { recursive: true });
  fs.writeFileSync(runFileName(run.role), `${JSON.stringify(run, null, 2)}\n`, 'utf8');
  return runFileName(run.role);
}

export function readDesignRun(role) {
  const file = runFileName(role);
  if (!fs.existsSync(file)) {
    throw new Error(`Kein Kandidaten-Lauf für „${role}". Erst: design-voice --role ${role} --live`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** Kandidat 1..n aus einem Lauf holen (1-basiert, wie in der Konsolen-Ausgabe). */
export function pickCandidate(run, oneBased) {
  const index = Number.parseInt(String(oneBased), 10);
  const candidate = Number.isFinite(index) ? run.candidates?.[index - 1] : undefined;
  if (!candidate) {
    throw new Error(`Kandidat ${oneBased} gibt es nicht (Lauf hat ${run.candidates?.length ?? 0}).`);
  }
  return candidate;
}

/** voice_id ins Casting schreiben — Reihenfolge der übrigen Einträge bleibt. */
export function saveCasting(role, voiceId, file = VOICES_JSON) {
  const casting = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  const previous = casting[role] ?? null;
  casting[role] = voiceId;
  fs.writeFileSync(file, `${JSON.stringify(casting, null, 2)}\n`, 'utf8');
  return { file, previous };
}
