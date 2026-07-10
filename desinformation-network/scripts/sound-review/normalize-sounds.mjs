#!/usr/bin/env node
// ===========================================
// LUXUS-SOUND-REVIEW — Mix-Fundament (S2): Trim + Lautheits-Normalisierung
// ===========================================
// Bringt die GANZE Nicht-Stimmen-Klangbibliothek auf einen konsistenten
// Lautheits-Korridor (EBU R128, zwei Durchgänge) — behebt den „Lautheits-Versatz"
// (die Roh-ElevenLabs-Ausgaben streuen um >50 dB). NPC-Stimmen (voice_*) werden
// bewusst NICHT angefasst (kommen später, wenn die Texte final sind).
//
// Recipe je Klasse:
//   SFX (Einzeltöne):  Stille an beiden Enden trimmen → loudnorm I=-18, TP=-1.5
//   Ambience (Betten): kein Trim (durchgehend/loopbar) → loudnorm I=-28, TP=-3
//   Musik:             kein Trim → loudnorm I=-18, TP=-1.5
//
// Zwei Durchgänge (messen → mit measured_* anwenden) = präzise, reproduzierbar.
// Einzeln idempotent genug: ein zweiter Lauf verschiebt die Werte nur minimal.
//
// Aufruf:
//   node scripts/sound-review/normalize-sounds.mjs            # in-place normalisieren + Report
//   node scripts/sound-review/normalize-sounds.mjs --dry      # nur messen/berichten
//   node scripts/sound-review/normalize-sounds.mjs --only sfx_stamp,sfx_pin

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const here = path.dirname(fileURLToPath(import.meta.url));
const SOUNDS_DIR = path.resolve(here, '..', '..', 'public', 'assets', 'sounds');
const REPORT_DIR = path.resolve(here, 'runs');

// SFX sind meist < 3 s → EBU-R128-Integralmessung ist dort unzuverlässig (loudnorm
// liefert -inf). Deshalb: SFX peak-normalisieren (Spitze auf -1 dBFS, konsistent);
// die relative Mischung setzt der Code über `config.volume` je SoundType. Ambience
// und Musik (≥ 10 s) laufen über echte Zwei-Pass-Lautheit (loudnorm).
const TARGETS = {
  // -1.5 dBFS Ziel + Limiter: schützt gegen mp3-Übersteuerung beim Re-Encode.
  sfx: { mode: 'peak', peak: -1.5, trim: true },
  ambience: { mode: 'lufs', I: -28, TP: -3, LRA: 7, trim: false },
  music: { mode: 'lufs', I: -18, TP: -1.5, LRA: 11, trim: false },
};

// Trimm-Schwelle: alles unter -45 dB an den Rändern gilt als Stille.
const TRIM = 'silenceremove=start_periods=1:start_duration=0:start_threshold=-45dB:detection=peak,'
  + 'areverse,'
  + 'silenceremove=start_periods=1:start_duration=0:start_threshold=-45dB:detection=peak,'
  + 'areverse';

function classify(id) {
  if (id.startsWith('voice_')) return 'voice';
  if (id.startsWith('music_')) return 'music';
  if (id.startsWith('sfx_amb_')) return 'ambience';
  if (id.startsWith('sfx_')) return 'sfx';
  return 'other';
}

function ff(args) {
  return execFileSync('ffmpeg', ['-hide_banner', '-nostats', '-y', ...args], {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
}

/** ffmpeg-Analyse: stdout+stderr zusammen (ffmpeg schreibt Statistik nach stderr). */
function ffCapture(args) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], {
    encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
  });
  return `${r.stdout || ''}\n${r.stderr || ''}`;
}

/** Integrierte Lautheit + True-Peak eines Files (ebur128). */
function measure(file) {
  const out = ffCapture(['-i', file, '-filter_complex', 'ebur128=peak=true', '-f', 'null', '-']);
  const i = out.match(/I:\s+(-?[0-9.]+)\s+LUFS/g);
  const tp = out.match(/Peak:\s+(-?[0-9.]+)\s+dBFS/g);
  const lastNum = (arr) => (arr ? Number(arr[arr.length - 1].match(/(-?[0-9.]+)/)[1]) : NaN);
  return { I: lastNum(i), TP: lastNum(tp) };
}

/** Spitzenpegel (max_volume, dBFS) via volumedetect. */
function peakOf(file) {
  const out = ffCapture(['-i', file, '-af', 'volumedetect', '-f', 'null', '-']);
  const m = out.match(/max_volume:\s+(-?[0-9.]+)\s+dB/);
  return m ? Number(m[1]) : NaN;
}

/** True-Peak (dBFS) via ebur128 — fängt Inter-Sample-Spitzen, die volumedetect verfehlt. */
function truePeakOf(file) { return measure(file).TP; }

/**
 * Harte True-Peak-Decke: senkt eine Datei so lange ab, bis ihr ebur128-True-Peak
 * unter der Decke liegt (mp3-Re-Encode kann Transienten über 0 dBFS heben).
 */
function ensureTruePeak(file, ceiling = -1.0) {
  for (let i = 0; i < 3; i++) {
    const tp = truePeakOf(file);
    if (!Number.isFinite(tp) || tp <= ceiling) return;
    const tmp = `${tmpFor(file)}.tp.mp3`;
    ff(['-i', file, '-af', `volume=${(ceiling - tp).toFixed(2)}dB`, ...enc, tmp]);
    replace(file, tmp);
  }
}

/** Pass 1: loudnorm-Messwerte als JSON (nur Ambience/Musik). */
function loudnormMeasure(file, t) {
  const filter = `loudnorm=I=${t.I}:TP=${t.TP}:LRA=${t.LRA}:print_format=json`;
  const out = ffCapture(['-i', file, '-af', filter, '-f', 'null', '-']);
  const m = out.match(/\{[\s\S]*?\}/);
  if (!m) throw new Error(`loudnorm-Messung fehlgeschlagen für ${file}`);
  return JSON.parse(m[0]);
}

const enc = ['-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '128k'];
const tmpFor = (file) => path.join(os.tmpdir(), `norm_${path.basename(file)}`);
const replace = (file, tmp) => { fs.copyFileSync(tmp, file); fs.rmSync(tmp, { force: true }); };

// Unter diesem Spitzenpegel gilt eine Erzeugung als „zu leise" (kaputt) → nicht
// mit +40 dB Rauschen hochziehen, sondern zur Neu-Erzeugung markieren.
const SILENT_FLOOR = -40;
const MAX_GAIN = 40;

function processFile(file, cls, dry) {
  const t = TARGETS[cls];
  const before = measure(file);
  if (dry) return { before, after: before, tooQuiet: false };

  const tmp = tmpFor(file);
  let tooQuiet = false;
  if (t.mode === 'peak') {
    // Trimmen → Spitze messen → Gain auf Ziel-Peak. Robust für kurze Einzeltöne.
    const origPeak = peakOf(file);
    tooQuiet = !Number.isFinite(origPeak) || origPeak <= SILENT_FLOOR;

    let src = file;
    const trimmed = `${tmp}.trim.mp3`;
    if (t.trim && !tooQuiet) {
      try {
        ff(['-i', file, '-af', TRIM, ...enc, trimmed]);
        if (Number.isFinite(peakOf(trimmed))) src = trimmed; // sonst Original behalten
      } catch { /* Trim schlug fehl → Original nutzen */ }
    }
    const peak = peakOf(src);
    let gain = Number.isFinite(peak) ? (t.peak - peak) : 0;
    gain = Math.max(-MAX_GAIN, Math.min(MAX_GAIN, gain)); // Rausch-Verstärkung deckeln
    ff(['-i', src, '-af', `volume=${gain.toFixed(2)}dB`, ...enc, tmp]);
    if (src === trimmed) fs.rmSync(trimmed, { force: true });
  } else {
    // Ambience/Musik: echte Zwei-Pass-Lautheit; Fallback auf EBU-Gain, falls
    // die Messung -inf/zu leise liefert (sehr leise Betten).
    const m = loudnormMeasure(file, t);
    const measuredI = Number(m.input_i);
    if (!Number.isFinite(measuredI) || measuredI <= -70) {
      const gain = t.I - before.I; // before.I ist ebur128-integriert (endlich)
      ff(['-i', file, '-af', `volume=${gain.toFixed(2)}dB,alimiter=limit=${t.TP}dB`, ...enc, tmp]);
    } else {
      const applied = `loudnorm=I=${t.I}:TP=${t.TP}:LRA=${t.LRA}:`
        + `measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:`
        + `measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
      ff(['-i', file, '-af', applied, ...enc, tmp]);
    }
  }
  replace(file, tmp);
  ensureTruePeak(file, -1.0); // harte Anti-Clipping-Decke für alle Klassen
  return { before, after: measure(file), tooQuiet };
}

function main() {
  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  const onlyArg = args.find((a, i) => args[i - 1] === '--only');
  const only = onlyArg ? new Set(onlyArg.split(',').map((s) => s.trim())) : null;

  const files = fs.readdirSync(SOUNDS_DIR).filter((f) => f.endsWith('.mp3')).sort();
  const rows = [];
  let touched = 0;

  for (const f of files) {
    const id = f.replace(/\.mp3$/, '');
    const cls = classify(id);
    if (cls === 'voice' || cls === 'other') continue; // Stimmen bewusst unangetastet
    if (only && !only.has(id)) continue;
    const file = path.join(SOUNDS_DIR, f);
    const { before, after, tooQuiet } = processFile(file, cls, dry);
    touched++;
    const t = TARGETS[cls];
    // SFX: Ziel ist der Spitzenpegel; Ambience/Musik: die integrierte Lautheit.
    const flag = dry ? '·'
      : tooQuiet ? '🔇'
      : t.mode === 'peak' ? (Math.abs(after.TP - t.peak) <= 1.5 ? 'ok' : '⚠')
      : (Math.abs(after.I - t.I) <= 2 ? 'ok' : '⚠');
    rows.push({ id, cls, mode: t.mode, beforeI: before.I, afterI: after.I, afterTP: after.TP, tooQuiet, flag });
    console.log(
      `${flag} ${id.padEnd(24)} ${cls.padEnd(9)} ` +
      `${fmt(before.I).padStart(7)} → I ${fmt(after.I).padStart(7)}  TP ${fmt(after.TP).padStart(7)} dBFS`,
    );
  }

  // Report schreiben (Klang-Karte, Lautheits-Teil).
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const json = { generatedAt: new Date().toISOString(), targets: TARGETS, dry, rows };
  fs.writeFileSync(path.join(REPORT_DIR, `loudness-${stamp}.json`), `${JSON.stringify(json, null, 2)}\n`);
  fs.writeFileSync(path.join(REPORT_DIR, 'loudness-latest.json'), `${JSON.stringify(json, null, 2)}\n`);

  const quiet = rows.filter((r) => r.tooQuiet);
  const outliers = rows.filter((r) => !dry && r.flag === '⚠');
  console.log(`\n${dry ? 'DRY — ' : ''}${touched} Dateien ${dry ? 'gemessen' : 'normalisiert'} · ` +
    `${outliers.length} Ausreißer · ${quiet.length} zu leise (🔇, neu erzeugen).`);
  if (quiet.length) console.log('Zu leise:', quiet.map((r) => r.id).join(', '));
  if (outliers.length) console.log('Ausreißer:', outliers.map((r) => r.id).join(', '));
}

function fmt(v) { return Number.isFinite(v) ? v.toFixed(1) : '?'; }

main();
