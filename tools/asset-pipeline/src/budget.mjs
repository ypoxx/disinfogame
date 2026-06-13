// ===========================================
// BUDGET-WÄCHTER + LAUFPROTOKOLL
// ===========================================
// Harte Obergrenzen pro Lauf (Env überschreibbar), damit ein automatisierter
// Agent-Lauf niemals unbegrenzt API-Kosten erzeugen kann. Standard ist
// Dry-Run: echte API-Aufrufe nur mit --live. Jeder Aufruf landet im JSONL-Log.

import fs from 'node:fs';
import path from 'node:path';
import { RUNS_DIR } from './paths.mjs';

function intEnv(name, fallback) {
  const v = Number.parseInt(process.env[name] ?? '', 10);
  return Number.isFinite(v) && v >= 0 ? v : fallback;
}

export const LIMITS = {
  imagesPerRun: () => intEnv('PIPELINE_MAX_IMAGES', 12),
  audioPerRun: () => intEnv('PIPELINE_MAX_AUDIO', 20),
  ttsCharsPerRun: () => intEnv('PIPELINE_MAX_TTS_CHARS', 2500),
  musicPerRun: () => intEnv('PIPELINE_MAX_MUSIC', 1),
};

export class Budget {
  constructor({ maxImages, maxAudio, maxTtsChars, maxMusic } = {}) {
    this.maxImages = maxImages ?? LIMITS.imagesPerRun();
    this.maxAudio = maxAudio ?? LIMITS.audioPerRun();
    this.maxTtsChars = maxTtsChars ?? LIMITS.ttsCharsPerRun();
    this.maxMusic = maxMusic ?? LIMITS.musicPerRun();
    this.images = 0;
    this.audio = 0;
    this.ttsChars = 0;
    this.music = 0;
  }

  /** wirft, wenn das Limit überschritten würde — VOR dem API-Aufruf prüfen. */
  takeImage() {
    if (this.images + 1 > this.maxImages) {
      throw new BudgetExceeded(`Bild-Limit erreicht (${this.maxImages}/Lauf — PIPELINE_MAX_IMAGES).`);
    }
    this.images++;
  }

  takeAudio() {
    if (this.audio + 1 > this.maxAudio) {
      throw new BudgetExceeded(`Audio-Limit erreicht (${this.maxAudio}/Lauf — PIPELINE_MAX_AUDIO).`);
    }
    this.audio++;
  }

  takeTtsChars(count) {
    if (this.ttsChars + count > this.maxTtsChars) {
      throw new BudgetExceeded(
        `TTS-Zeichen-Limit erreicht (${this.maxTtsChars}/Lauf — PIPELINE_MAX_TTS_CHARS).`
      );
    }
    this.ttsChars += count;
  }

  takeMusic() {
    if (this.music + 1 > this.maxMusic) {
      throw new BudgetExceeded(`Musik-Limit erreicht (${this.maxMusic}/Lauf — PIPELINE_MAX_MUSIC).`);
    }
    this.music++;
  }

  summary() {
    return (
      `Bilder ${this.images}/${this.maxImages} · Audio ${this.audio}/${this.maxAudio} · ` +
      `TTS-Zeichen ${this.ttsChars}/${this.maxTtsChars} · Musik ${this.music}/${this.maxMusic}`
    );
  }
}

export class BudgetExceeded extends Error {}

/** JSONL-Laufprotokoll unter runs/ (gitignored). */
export class RunLog {
  constructor(command) {
    fs.mkdirSync(RUNS_DIR, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.file = path.join(RUNS_DIR, `run-${stamp}-${command}.jsonl`);
  }

  write(record) {
    const line = JSON.stringify({ ts: new Date().toISOString(), ...record });
    fs.appendFileSync(this.file, `${line}\n`, 'utf8');
  }
}
