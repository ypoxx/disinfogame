#!/usr/bin/env node
// ===========================================
// ASSET-PIPELINE CLI
// ===========================================
// Kommandos:
//   shotlist      Soll-Liste aller Assets (aus building.json/npcs.json abgeleitet)
//   status        Abdeckung: Manifest/Dateien vs. Shot-Liste
//   placeholders  Platzhalter-PNGs für alle Bild-/Sheet-Shots (ohne API-Keys)
//   generate      KI-Erzeugung (Standard: Dry-Run; echte Aufrufe nur mit --live)
//   validate      assets.json + Dateien prüfen (Exit-Code ≠ 0 bei Fehlern)
//   voices        ElevenLabs-Stimmen auflisten (für config/voices.json)
//
// Sicherheitsmodell: Dry-Run als Default, harte Budgets pro Lauf (budget.mjs),
// idempotent (vorhandene Dateien werden ohne --force übersprungen), JSONL-Log.

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { OUT_DIR, RUNS_DIR, VOICES_JSON } from './paths.mjs';
import { buildShotlist } from './shotlist.mjs';
import {
  buildEntry,
  filePathFor,
  mergeManifest,
  readManifest,
  validateManifest,
  writeAssetFile,
  writeManifest,
} from './manifest.mjs';
import { renderPlaceholder } from './placeholders.mjs';
import { Budget, BudgetExceeded, RunLog } from './budget.mjs';

// ---------- Argument-Parsing (bewusst ohne Abhängigkeit) ----------

function parseArgs(argv) {
  const args = { _: [], flags: new Set(), values: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) {
      args._.push(a);
      continue;
    }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (['only', 'limit', 'kind', 'priority', 'out'].includes(key) && next && !next.startsWith('--')) {
      args.values[key] = next;
      i++;
    } else {
      args.flags.add(key);
    }
  }
  return args;
}

function filterShots(shots, args) {
  let result = shots;
  if (args.values.only) {
    const wanted = new Set(args.values.only.split(',').map((s) => s.trim()));
    result = result.filter((s) => wanted.has(s.id));
  }
  if ((args.values.priority ?? 'must') === 'must' && !args.values.only) {
    result = result.filter((s) => s.priority === 'must');
  }
  if (args.values.kind) {
    const kinds = new Set(args.values.kind.split(',').map((s) => s.trim()));
    result = result.filter((s) => kinds.has(s.kind));
  }
  const limit = Number.parseInt(args.values.limit ?? '', 10);
  if (Number.isFinite(limit) && limit >= 0) result = result.slice(0, limit);
  return result;
}

function outDir(args) {
  return args.values.out ? path.resolve(args.values.out) : OUT_DIR;
}

function targetFile(shot) {
  return filePathFor({ type: shot.type, id: shot.id, mime: shot.type === 'image' || shot.type === 'sheet' ? 'image/png' : 'audio/mpeg' });
}

function existsInOut(dir, shot) {
  return fs.existsSync(path.join(dir, targetFile(shot)));
}

// ---------- Kommandos ----------

function cmdShotlist(args) {
  const shots = buildShotlist();
  if (args.flags.has('json')) {
    console.log(JSON.stringify(shots, null, 2));
    return 0;
  }
  const byKind = new Map();
  for (const s of shots) {
    if (!byKind.has(s.kind)) byKind.set(s.kind, []);
    byKind.get(s.kind).push(s);
  }
  console.log(`Shot-Liste: ${shots.length} Assets gesamt\n`);
  for (const [kind, list] of byKind) {
    const must = list.filter((s) => s.priority === 'must').length;
    console.log(`■ ${kind} — ${list.length} (davon Muss: ${must})`);
    for (const s of list) {
      console.log(`   ${s.priority === 'must' ? '●' : '○'} ${s.id}`);
    }
  }
  console.log('\n(● = Muss, ○ = Kür. Details: --json)');
  return 0;
}

function cmdStatus(args) {
  const dir = outDir(args);
  const shots = buildShotlist();
  const manifest = readManifest(dir);
  const inManifest = new Set(manifest.assets.map((a) => `${a.type}/${a.id}`));
  let done = 0;
  const missingMust = [];
  for (const s of shots) {
    const ok = inManifest.has(`${s.type}/${s.id}`) && existsInOut(dir, s);
    if (ok) done++;
    else if (s.priority === 'must') missingMust.push(s.id);
  }
  console.log(`Ziel: ${dir}`);
  console.log(`Abdeckung: ${done}/${shots.length} Assets vorhanden (Manifest + Datei).`);
  const placeholders = manifest.assets.filter((a) => a.provider === 'placeholder').length;
  if (placeholders > 0) console.log(`Davon Platzhalter: ${placeholders}.`);
  if (missingMust.length > 0) {
    console.log(`\nFehlende MUSS-Assets (${missingMust.length}):`);
    for (const id of missingMust) console.log(`   ● ${id}`);
  } else {
    console.log('Alle MUSS-Assets vorhanden. ✔');
  }
  return 0;
}

async function cmdPlaceholders(args) {
  const dir = outDir(args);
  const all = buildShotlist().filter((s) => s.type === 'image' || s.type === 'sheet');
  const shots = filterShots(all, { ...args, values: { priority: 'all', ...args.values } });
  const log = new RunLog('placeholders');
  const entries = [];
  let written = 0;
  for (const shot of shots) {
    if (!args.flags.has('force') && existsInOut(dir, shot)) continue;
    const t0 = Date.now();
    const png = await renderPlaceholder(shot);
    const file = targetFile(shot);
    writeAssetFile(dir, file, png);
    entries.push(
      buildEntry({
        id: shot.id,
        type: shot.type,
        file,
        provider: 'placeholder',
        styleVersion: 'placeholder',
        frameWidth: shot.frameWidth,
        frameHeight: shot.frameHeight,
        animations: shot.animations,
      })
    );
    log.write({ shot: shot.id, action: 'placeholder', ok: true, ms: Date.now() - t0, bytes: png.length });
    written++;
  }
  if (entries.length > 0) {
    writeManifest(dir, mergeManifest(readManifest(dir), entries));
  }
  console.log(`Platzhalter: ${written} Dateien geschrieben → ${dir}`);
  console.log('Manifest aktualisiert (assets.json). Spiel zeigt jetzt den Asset-Pfad.');
  return 0;
}

function cmdValidate(args) {
  const dir = outDir(args);
  const manifest = readManifest(dir);
  const errors = validateManifest(manifest, dir);
  if (errors.length === 0) {
    console.log(`assets.json gültig: ${manifest.assets.length} Assets, alle Dateien vorhanden. ✔`);
    return 0;
  }
  console.error(`Validierung fehlgeschlagen (${errors.length}):`);
  for (const e of errors) console.error(`   ✖ ${e}`);
  return 1;
}

async function generateImageShot(shot, dir, budget, log, force) {
  const { generateImage, DEFAULT_IMAGE_MODEL } = await import('./gemini.mjs');
  const file = targetFile(shot);
  if (!force && fs.existsSync(path.join(dir, file))) return { skipped: true };
  budget.takeImage();

  // Gewinner-Seed aus dem Stil-Lock übernehmen (nur zusammen mit --only sinnvoll).
  const seedOverride = Number.parseInt(process.env.PIPELINE_SEED_OVERRIDE ?? '', 10);
  const seed = Number.isFinite(seedOverride) ? seedOverride : shot.seed;

  // Stimmungs-Varianten referenzieren das Basis-Porträt (gleiches Gesicht).
  const referenceImagesBase64 = [];
  if (shot.referenceId) {
    const refPath = path.join(dir, 'images', `${shot.referenceId}.png`);
    if (fs.existsSync(refPath)) {
      referenceImagesBase64.push(fs.readFileSync(refPath).toString('base64'));
    }
  }

  const t0 = Date.now();
  const result = await generateImage({
    prompt: shot.prompt,
    aspectRatio: shot.aspectRatio,
    seed,
    referenceImagesBase64,
  });
  let image = sharp(Buffer.from(result.base64, 'base64'));
  if (shot.size) {
    // Exakte Zielmaße erzwingen (Sheets brauchen das Frame-Raster pixelgenau).
    image = image.resize(shot.size.w, shot.size.h, { fit: 'fill', kernel: 'nearest' });
  }
  const png = await image.png().toBuffer();
  writeAssetFile(dir, file, png);
  log.write({ shot: shot.id, action: 'generate-image', ok: true, ms: Date.now() - t0, bytes: png.length });
  return {
    entry: buildEntry({
      id: shot.id,
      type: shot.type,
      file,
      provider: DEFAULT_IMAGE_MODEL,
      prompt: shot.prompt,
      seed,
      styleVersion: 'v1',
      frameWidth: shot.frameWidth,
      frameHeight: shot.frameHeight,
      animations: shot.animations,
    }),
  };
}

async function generateAudioShot(shot, dir, budget, log, force, casting) {
  const eleven = await import('./elevenlabs.mjs');
  const file = targetFile(shot);
  if (!force && fs.existsSync(path.join(dir, file))) return { skipped: true };

  let result;
  const t0 = Date.now();
  if (shot.type === 'sfx') {
    budget.takeAudio();
    result = await eleven.generateSfx(shot.sfx);
  } else if (shot.type === 'music') {
    budget.takeMusic();
    budget.takeAudio();
    result = await eleven.composeMusic(shot.music);
  } else if (shot.type === 'voice') {
    const voiceId = casting[shot.voice.npcId];
    if (!voiceId) return { skipped: true, reason: `keine voice_id für „${shot.voice.npcId}" (config/voices.json)` };
    budget.takeAudio();
    budget.takeTtsChars(shot.voice.text.length);
    result = await eleven.synthesizeSpeech({ text: shot.voice.text, voiceId });
  } else {
    return { skipped: true };
  }
  writeAssetFile(dir, file, result.buffer);
  log.write({ shot: shot.id, action: `generate-${shot.type}`, ok: true, ms: Date.now() - t0, bytes: result.buffer.length });
  return { entry: buildEntry({ id: shot.id, type: shot.type, file, provider: 'elevenlabs' }) };
}

async function cmdGenerate(args) {
  const dir = outDir(args);
  const wantImages = args.flags.has('images') || !args.flags.has('audio');
  const wantAudio = args.flags.has('audio') || !args.flags.has('images');
  const all = buildShotlist().filter((s) => {
    const isImage = s.type === 'image' || s.type === 'sheet';
    return (isImage && wantImages) || (!isImage && wantAudio);
  });
  const shots = filterShots(all, args);
  const force = args.flags.has('force');
  const live = args.flags.has('live');

  const pending = shots.filter((s) => force || !existsInOut(dir, s));
  const images = pending.filter((s) => s.type === 'image' || s.type === 'sheet');
  const audio = pending.filter((s) => s.type === 'sfx' || s.type === 'music' || s.type === 'voice');
  const ttsChars = audio.filter((s) => s.type === 'voice').reduce((sum, s) => sum + s.voice.text.length, 0);

  console.log(`Geplant: ${pending.length} Shots (${images.length} Bilder/Sheets, ${audio.length} Audio, ~${ttsChars} TTS-Zeichen)`);
  console.log(`Ziel: ${dir}`);
  for (const s of pending) console.log(`   ${s.priority === 'must' ? '●' : '○'} ${s.id} [${s.type}]`);

  if (!live) {
    console.log(
      '\nDRY-RUN (Standard). Echte Erzeugung: --live anhängen.\n' +
        'Voraussetzungen: GOOGLE_AI_API_KEY (Bilder) bzw. ELEVENLABS_API_KEY (Audio) als Env;\n' +
        'Netz-Allowlist: generativelanguage.googleapis.com bzw. api.elevenlabs.io.\n' +
        'Budgets pro Lauf: PIPELINE_MAX_IMAGES/AUDIO/TTS_CHARS/MUSIC (siehe README).'
    );
    return 0;
  }

  const budget = new Budget();
  const log = new RunLog('generate');
  const casting = fs.existsSync(VOICES_JSON) ? JSON.parse(fs.readFileSync(VOICES_JSON, 'utf8')) : {};
  const entries = [];
  const failures = [];
  let skipped = 0;

  for (const shot of pending) {
    try {
      const result =
        shot.type === 'image' || shot.type === 'sheet'
          ? await generateImageShot(shot, dir, budget, log, force)
          : await generateAudioShot(shot, dir, budget, log, force, casting);
      if (result.entry) {
        entries.push(result.entry);
        // Inkrementell schreiben: ein Abbruch verliert keine fertigen Assets.
        writeManifest(dir, mergeManifest(readManifest(dir), [result.entry]));
        console.log(`   ✔ ${shot.id}`);
      } else {
        skipped++;
        if (result.reason) console.log(`   ↷ ${shot.id} übersprungen: ${result.reason}`);
      }
    } catch (error) {
      if (error instanceof BudgetExceeded) {
        console.error(`\n⛔ ${error.message} — Lauf beendet. ${budget.summary()}`);
        log.write({ shot: shot.id, action: 'budget-stop', ok: false, error: error.message });
        break;
      }
      failures.push({ id: shot.id, error: String(error.message ?? error) });
      log.write({ shot: shot.id, action: 'generate', ok: false, error: String(error.message ?? error) });
      console.error(`   ✖ ${shot.id}: ${error.message ?? error}`);
    }
  }

  console.log(`\nFertig: ${entries.length} erzeugt, ${skipped} übersprungen, ${failures.length} Fehler.`);
  console.log(`Budget: ${budget.summary()}`);
  return failures.length > 0 ? 1 : 0;
}

async function cmdVoices(args) {
  if (!args.flags.has('live')) {
    console.log('Listet ElevenLabs-Stimmen (echter API-Aufruf). Ausführen mit: --live');
    return 0;
  }
  const { listVoices } = await import('./elevenlabs.mjs');
  const voices = await listVoices();
  for (const v of voices) {
    const labels = v.labels ? Object.values(v.labels).join(', ') : '';
    console.log(`${v.voice_id}  ${v.name}${labels ? `  (${labels})` : ''}`);
  }
  console.log(`\n${voices.length} Stimmen. voice_id in config/voices.json je NPC eintragen.`);
  return 0;
}

async function cmdStylelock(args) {
  // Phase 1: N Varianten EINES Shots in runs/stylelock/ erzeugen — bewusst
  // OHNE Manifest/Spielordner. Mensch (oder Agent mit Vision) wählt; der
  // Gewinner wird danach regulär übernommen (generate --only <id> --live,
  // Seed des Gewinners via PIPELINE_SEED_<ID> bzw. künftiger Master-Referenz).
  const id = args.values.only;
  if (!id) {
    console.error('stylelock braucht --only <shot-id>, z. B. --only room_zentrale');
    return 1;
  }
  const shot = buildShotlist().find((s) => s.id === id && (s.type === 'image' || s.type === 'sheet'));
  if (!shot) {
    console.error(`Unbekannter Bild-Shot: ${id}`);
    return 1;
  }
  const variants = Math.min(Math.max(Number.parseInt(args.values.limit ?? '3', 10) || 3, 1), 4);
  const targetDir = path.join(RUNS_DIR, 'stylelock');

  if (!args.flags.has('live')) {
    console.log(`DRY-RUN: würde ${variants} Varianten von „${id}" nach ${targetDir} erzeugen (--live für echt).`);
    console.log(`Prompt:\n${shot.prompt}`);
    return 0;
  }

  const { generateImage } = await import('./gemini.mjs');
  const budget = new Budget();
  const log = new RunLog('stylelock');
  fs.mkdirSync(targetDir, { recursive: true });
  const written = [];
  for (let i = 0; i < variants; i++) {
    budget.takeImage();
    const seed = shot.seed + i * 1000; // bewusst weit auseinander → echte Alternativen
    const t0 = Date.now();
    const result = await generateImage({ prompt: shot.prompt, aspectRatio: shot.aspectRatio, seed });
    let image = sharp(Buffer.from(result.base64, 'base64'));
    if (shot.size) image = image.resize(shot.size.w, shot.size.h, { fit: 'fill', kernel: 'nearest' });
    const file = path.join(targetDir, `${id}_seed${seed}.png`);
    fs.writeFileSync(file, await image.png().toBuffer());
    log.write({ shot: id, action: 'stylelock', seed, ok: true, ms: Date.now() - t0 });
    written.push(file);
    console.log(`   ✔ Variante ${i + 1}/${variants}: ${file}`);
  }
  console.log(`\n${written.length} Kandidaten. Gewinner-Seed merken → Übernahme:`);
  console.log(`   PIPELINE_SEED_OVERRIDE=<seed> node src/cli.mjs generate --images --only ${id} --live --force`);
  return 0;
}

function help() {
  console.log(`Asset-Pipeline — Headless-Erzeugung der Spiel-Assets

  node src/cli.mjs shotlist [--json]
  node src/cli.mjs status [--out DIR]
  node src/cli.mjs placeholders [--only id,id] [--force] [--out DIR]
  node src/cli.mjs stylelock --only <shot-id> [--limit N=3] [--live]
  node src/cli.mjs generate [--images|--audio] [--only id,id] [--kind room,portrait,...]
                            [--priority must|all] [--limit N] [--force] [--live] [--out DIR]
  node src/cli.mjs validate [--out DIR]
  node src/cli.mjs voices --live

Ohne --live ist generate ein Dry-Run. Details: README.md`);
  return 0;
}

const args = parseArgs(process.argv.slice(2));
const command = args._[0];

const commands = {
  shotlist: cmdShotlist,
  status: cmdStatus,
  placeholders: cmdPlaceholders,
  validate: cmdValidate,
  generate: cmdGenerate,
  stylelock: cmdStylelock,
  voices: cmdVoices,
};

try {
  const fn = commands[command] ?? help;
  const code = await fn(args);
  process.exit(code ?? 0);
} catch (error) {
  console.error(`Fehler: ${error.message ?? error}`);
  process.exit(1);
}
