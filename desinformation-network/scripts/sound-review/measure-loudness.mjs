// ===========================================
// LAUTHEITS-MESSUNG (Musik) — browsergestützt, ffmpeg-frei
// ===========================================
// In diesem Container ist kein ffmpeg installierbar (apt-Deps 404, statischer
// Build via GitHub-Release 403), und Playwrights gebündeltes ffmpeg ist ein
// Minimal-Build ohne `loudnorm`/`ebur128` und ohne mp3-Decoder. Deshalb misst
// dieses Werkzeug die Lautheit über Chromiums Web-Audio `decodeAudioData` —
// exakt der Decoder, mit dem das Spiel die Tracks auch abspielt.
//
// Es ist das hörbare Gegenstück zu `normalize-sounds.mjs` für den Fall „kein
// ffmpeg": ein *messbares* Belegstück (Report unter runs/, gitignored), kein
// destruktives Re-Encoding. Angeglichen wird nicht-destruktiv über den
// Per-Track-Trim im SoundSystem (musicTrim), nicht durch Umschreiben der Dateien.
//
// Kennzahl: gated RMS in dBFS (400-ms-Blöcke, absolutes Gate −70 dB) als
// robuster *relativer* Lautheits-Proxy für gleichartige Musikbetten — plus
// Sample-Peak in dBFS (Clipping-Kontrolle). Bewusst kein K-Weighting (LUFS):
// für die Angleichung *innerhalb* eines Pools zählt die relative Differenz,
// nicht der Absolutwert.
//
// Nutzung:
//   node scripts/sound-review/measure-loudness.mjs            # alle music_*
//   node scripts/sound-review/measure-loudness.mjs --only music_gameplay,music_tense
//   PW_CHROME=/pfad/zu/chrome node scripts/sound-review/measure-loudness.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SOUNDS_DIR = path.resolve(HERE, '../../public/assets/sounds');
const RUNS_DIR = path.resolve(HERE, 'runs');
const EXE = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

function parseOnly() {
  const i = process.argv.indexOf('--only');
  if (i === -1) return null;
  return new Set((process.argv[i + 1] ?? '').split(',').map((s) => s.trim()).filter(Boolean));
}

function musicFiles(only) {
  return fs
    .readdirSync(SOUNDS_DIR)
    .filter((f) => f.startsWith('music_') && f.endsWith('.mp3'))
    .map((f) => ({ id: f.replace(/\.mp3$/, ''), file: path.join(SOUNDS_DIR, f) }))
    .filter((m) => !only || only.has(m.id))
    .sort((a, b) => a.id.localeCompare(b.id));
}

// Im Browser-Kontext: base64 → ArrayBuffer → decodeAudioData → gated RMS + Peak.
async function measureInPage(page, base64) {
  return page.evaluate(async (b64) => {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    // OfflineAudioContext braucht keine Ausgabe-Hardware (headless-tauglich).
    const ctx = new OfflineAudioContext(1, 1, 44100);
    const buf = await ctx.decodeAudioData(bytes.buffer);
    const sr = buf.sampleRate;
    const chs = [];
    for (let c = 0; c < buf.numberOfChannels; c++) chs.push(buf.getChannelData(c));
    const n = buf.length;
    const blockLen = Math.max(1, Math.round(sr * 0.4)); // 400-ms-Blöcke
    const gateAbs = Math.pow(10, -70 / 20); // absolutes Gate −70 dBFS (RMS)
    let peak = 0;
    let gatedSumSq = 0;
    let gatedSamples = 0;
    for (let start = 0; start < n; start += blockLen) {
      const end = Math.min(n, start + blockLen);
      let sumSq = 0;
      let count = 0;
      for (let i = start; i < end; i++) {
        let mono = 0;
        for (let c = 0; c < chs.length; c++) {
          const v = chs[c][i];
          mono += v;
          const a = Math.abs(v);
          if (a > peak) peak = a;
        }
        mono /= chs.length;
        sumSq += mono * mono;
        count++;
      }
      const blockRms = Math.sqrt(sumSq / count);
      if (blockRms >= gateAbs) {
        gatedSumSq += sumSq;
        gatedSamples += count;
      }
    }
    const rms = gatedSamples > 0 ? Math.sqrt(gatedSumSq / gatedSamples) : 0;
    const toDb = (x) => (x > 0 ? 20 * Math.log10(x) : -Infinity);
    return {
      durationSec: +(n / sr).toFixed(1),
      channels: buf.numberOfChannels,
      rmsDb: +toDb(rms).toFixed(2),
      peakDb: +toDb(peak).toFixed(2),
    };
  }, base64);
}

async function main() {
  const only = parseOnly();
  const files = musicFiles(only);
  if (files.length === 0) {
    console.error('Keine music_*.mp3 gefunden' + (only ? ' (nach --only-Filter)' : '') + '.');
    process.exit(1);
  }

  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage();
  await page.goto('about:blank');

  const results = [];
  for (const { id, file } of files) {
    const base64 = fs.readFileSync(file).toString('base64');
    try {
      const m = await measureInPage(page, base64);
      results.push({ id, ...m });
    } catch (err) {
      results.push({ id, error: String(err?.message ?? err) });
    }
  }
  await browser.close();

  // Report + Tabelle
  const ok = results.filter((r) => !r.error);
  const rmsVals = ok.map((r) => r.rmsDb).filter((v) => Number.isFinite(v));
  const spread = rmsVals.length ? +(Math.max(...rmsVals) - Math.min(...rmsVals)).toFixed(2) : 0;

  console.log('\n  id                          dur   ch   RMS dBFS   Peak dBFS');
  console.log('  ' + '-'.repeat(62));
  for (const r of results) {
    if (r.error) {
      console.log(`  ${r.id.padEnd(26)}  FEHLER: ${r.error}`);
      continue;
    }
    const clip = r.peakDb > -1.0 ? ' ⚠clip' : '';
    console.log(
      `  ${r.id.padEnd(26)}  ${String(r.durationSec).padStart(4)}s  ${String(r.channels).padStart(2)}   ` +
        `${String(r.rmsDb).padStart(8)}   ${String(r.peakDb).padStart(8)}${clip}`
    );
  }
  console.log('  ' + '-'.repeat(62));
  console.log(`  RMS-Spanne über alle Tracks: ${spread} dB (Ziel: eng, für ruckelfreie Pool-Rotation)`);

  fs.mkdirSync(RUNS_DIR, { recursive: true });
  const report = { tool: 'measure-loudness', metric: 'gated-rms-dbfs+peak', spreadDb: spread, tracks: results };
  fs.writeFileSync(path.join(RUNS_DIR, 'music-loudness-latest.json'), JSON.stringify(report, null, 2));
  console.log(`\n  Report: ${path.relative(process.cwd(), path.join(RUNS_DIR, 'music-loudness-latest.json'))}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
