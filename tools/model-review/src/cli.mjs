#!/usr/bin/env node
// ===========================================
// CLI — ein fremdes Modell schaut über das Spiel
// ===========================================
//   node src/cli.mjs lenses
//   node src/cli.mjs pack   --lens konzept
//   node src/cli.mjs models --filter gemini
//   node src/cli.mjs key
//   node src/cli.mjs review --lens konzept --model openai/gpt-5.1 --live
//
// Standard ist DRY-RUN: ohne --live entsteht kein API-Aufruf und keine Kosten.

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnvFile, getApiKey, defaults, maskKey, findeAnbieter, KonfigFehler } from './config.mjs';
import { LINSEN, findeLinse, linsenIds, AUSGABE_REGELN } from './lenses.mjs';
import { ladeBilder, ladeVideos, bildTokens, videoTokens, BildFehler } from './images.mjs';
import {
  liesManifest, baueBuendel, buendelFrage, syntheseFrage, parallelBegrenzt, ERNTE_DIR, SerienFehler,
} from './serie.mjs';
import { ziehe, FrameFehler } from './frames.mjs';
import { baueKontext, schaetzeTokens, QuellenFehler } from './pack.mjs';
import { preise, schaetzeKosten, pruefeBudget, usd, BudgetUeberschritten } from './cost.mjs';
import {
  listeModelle, schluesselInfo, frageModell, findeModell, kannBilder, kannVideo, sehendeModelle, ApiFehler,
} from './openrouter.mjs';
import { rendereBericht, schreibeBericht, berichtDateiname } from './report.mjs';
import { RUNS_DIR, REPORT_DIR, relToRepo } from './paths.mjs';

// ---------- Proxy ----------
//
// Node liest Proxy-Umgebungsvariablen für fetch() nur beim Prozessstart
// (--use-env-proxy / NODE_USE_ENV_PROXY, ab Node 22). Wo ein Proxy gesetzt ist
// — z. B. in der Claude-Code-Sandbox — landet fetch() sonst am Egress-Gateway
// und bekommt 403, während curl längst durchkommt. Darum: einmal mit gesetztem
// Schalter neu starten. Ohne Proxy passiert hier nichts.
function ggfMitProxyNeustarten() {
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  if (!proxy) return false;
  if (process.env.NODE_USE_ENV_PROXY === '1' || process.env.MODEL_REVIEW_NO_REEXEC === '1') return false;

  const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_USE_ENV_PROXY: '1',
      MODEL_REVIEW_NO_REEXEC: '1',
      // Der Proxy-Agent ist als experimentell markiert und warnt bei jedem Start — für
      // ein Werkzeug, das genau dafür neu startet, ist das nur Rauschen.
      NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --disable-warning=UNDICI-EHPA`.trim(),
    },
  });
  process.exit(r.status ?? 1);
}

// ---------- Argumente ----------

function parseArgs(argv) {
  const args = { _: [], model: [], datei: [], bild: [], video: [], buendel: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) {
      args._.push(a);
      continue;
    }
    const [name, inline] = a.slice(2).split('=');
    const braucht = [
      'lens', 'linse', 'model', 'modell', 'max-cost', 'max-tokens', 'max-chars',
      'temperature', 'frage', 'out', 'filter', 'datei', 'bild', 'max-bilder',
      'video', 'max-videos', 'ernte', 'buendel', 'pro-buendel', 'parallel', 'denk-aufwand',
      'anzahl', 'name', 'anbieter',
    ];
    if (braucht.includes(name)) {
      const wert = inline !== undefined ? inline : argv[++i];
      if (wert === undefined) fehler(`--${name} braucht einen Wert.`);
      if (name === 'model' || name === 'modell') args.model.push(wert);
      else if (name === 'datei') args.datei.push(wert);
      else if (name === 'bild') args.bild.push(wert);
      else if (name === 'video') args.video.push(wert);
      else if (name === 'buendel') args.buendel.push(...wert.split(',').map((x) => x.trim()).filter(Boolean));
      else args[name] = wert;
    } else {
      args[name] = true;
    }
  }
  if (args.linse && !args.lens) args.lens = args.linse;
  return args;
}

function fehler(msg, code = 1) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(code);
}

const HILFE = `
model-review — ein fremdes Modell (via openrouter.ai) begutachtet das Spiel

BEFEHLE
  lenses                     Verfügbare Linsen (Ausschnitt + Frage) auflisten
  pack    --lens <id>        Kontext-Paket bauen, Größe/Kosten zeigen, nach runs/ schreiben
  models  [--filter <text>]  Modell-Katalog von OpenRouter (mit Preisen)
  key                        Schlüssel prüfen (Guthaben/Limit) — verrät den Schlüssel nicht
  review  --lens <id>        Review durchführen (ohne --live nur Trockenlauf)
  serie   [--lens ui]        Ausführlicher Durchgang: ein Aufruf je Bildschirm-Bündel
                             aus der Visual-Review-Ernte + Synthese über alle Berichte
  frames  [--anzahl 4]       Einzelbilder aus den Clips der Ernte ziehen (ffmpeg),
                             Ersatz für Video-Eingabe

WICHTIGE OPTIONEN
  --live                     Echten API-Aufruf erlauben (sonst passiert nichts Kostenpflichtiges)
  --model <slug>             Modell, mehrfach erlaubt (z. B. --model x/y --model a/b)
                             "konto" = das bei OpenRouter hinterlegte Standardmodell
  --lens <id>                ${linsenIds().join(' | ')}
  --frage "<text>"           Eigene Frage statt der Linsen-Frage
  --datei <pfad>             Zusätzliche Datei ins Paket (mehrfach erlaubt)
  --bild <pfad>              Screenshot ins Paket; Verzeichnis = alle Bilder darin
                             (mehrfach erlaubt, Default max. 40 — für die Linse "ui")
  --video <pfad>             Clip ins Paket (nur Modelle mit Video-Eingabe)
  --ernte <verzeichnis>      Ernte-Ordner für "serie" (Default runs/visual-review/latest)
  --buendel a,b              Nur diese Bündel (serie); ohne Angabe: alle
  --pro-buendel <n>          Aufnahmen je Durchgang (Default 12); größere Bündel
                             werden geteilt, nicht beschnitten
  --parallel <n>             Gleichzeitige Durchgänge bei "serie" (Default 3)
  --name <kennung>           Kennung im Dateinamen des Berichts (mehrere Läufe
                             derselben Linse am selben Tag auseinanderhalten)
  --anbieter <name>          openrouter (Default) | openai — openai spricht api.openai.com
                             direkt an (OPENAI_API_KEY, Modellname OHNE "openai/"-Präfix)
  --denk-aufwand <stufe>     low | high | max — bei Denk-Modellen der Zeitregler
  --kein-strom               Antwort am Stück holen statt zu streamen (Default: Strom)
  --max-cost <usd>           Kostenbremse pro Modell (Default ${defaults().maxCostUsd})
  --max-tokens <n>           Maximale Antwortlänge (Default ${defaults().maxCompletionTokens})
  --max-chars <n>            Maximale Paketgröße (Default ${defaults().maxContextChars})
  --temperature <n>          Default ${defaults().temperature} (bei --anbieter openai: Modell-Vorgabe)
  --preis-unbekannt-ok       Auch Modelle ohne Preisangabe erlauben
  --erlaube-datensammlung    Anbieter mit Daten-Sammlung zulassen (Default: ausgeschlossen)
  --out <verzeichnis>        Zielordner der Berichte (Default ${relToRepo(REPORT_DIR)})

SCHLÜSSEL
  export OPENROUTER_API_KEY="sk-or-v1-..."   oder tools/model-review/.env (gitignored)
`;

// ---------- Hilfsfunktionen ----------

function heute() {
  return new Date().toISOString().slice(0, 10);
}

function stempel() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function protokoll(befehl, datensatz) {
  fs.mkdirSync(RUNS_DIR, { recursive: true });
  const datei = path.join(RUNS_DIR, `run-${heute()}-${befehl}.jsonl`);
  fs.appendFileSync(datei, `${JSON.stringify({ ts: new Date().toISOString(), ...datensatz })}\n`, 'utf8');
  return datei;
}

function baueAuftrag(linse, args) {
  const frage = args.frage || linse.auftrag;
  return { frage, system: linse.rolle };
}

function quellenFuer(linse, args) {
  const extra = args.datei.map((p) => ({ pfad: p, hinweis: 'zusätzlich per --datei' }));
  return [...linse.quellen, ...extra];
}

const KONTO = 'konto';

/** Optionen, die für jeden Modell-Aufruf gleich sind. */
function aufrufOptionen(args, cfg) {
  return {
    denkAufwand: args['denk-aufwand'] || null,
    anbieter: findeAnbieter(args.anbieter || 'openrouter').id,
    strom: !args['kein-strom'],
    denyDataCollection: args['erlaube-datensammlung'] ? false : cfg.denyDataCollection,
  };
}

/** Anbieter + passende Basis-URL + passender Schlüssel in einem Griff. */
function anbieterKontext(args) {
  const anbieter = findeAnbieter(args.anbieter || 'openrouter');
  return { anbieter, baseUrl: anbieter.baseUrl() };
}

/**
 * Temperatur für diesen Lauf — oder `null`, wenn das Feld gar nicht mitgehen soll.
 *
 * Nicht jeder Anbieter nimmt jede Temperatur: OpenAIs Denk-Modelle akzeptieren
 * ausschließlich ihre eigene Vorgabe und quittieren alles andere mit HTTP 400.
 * Der CLI-Default (0.3) darf dort also nicht stillschweigend mitfahren — sonst
 * scheitert jeder Lauf an einer Voreinstellung, die niemand gewählt hat.
 * Ausdrücklich verlangt (`--temperature`) geht der Wert trotzdem raus: Dann ist
 * es eine Entscheidung, und die Fehlermeldung des Anbieters ist die Antwort darauf.
 */
function temperaturFuer(args, cfg, anbieter) {
  if (args.temperature) {
    const wert = Number.parseFloat(args.temperature);
    if (anbieter && anbieter.nimmtTemperatur === false) {
      console.warn(
        `  ⚠ ${anbieter.id} nimmt bei Denk-Modellen nur die eigene Temperatur-Vorgabe — ` +
          `--temperature ${wert} kann mit HTTP 400 abgelehnt werden.`
      );
    }
    return wert;
  }
  return anbieter && anbieter.nimmtTemperatur === false ? null : cfg.temperature;
}

/**
 * Fortschrittsanzeige beim Streamen. Ein Denk-Modell schweigt erst minutenlang
 * (es denkt) und schüttet dann Text aus — ohne Anzeige sieht das aus wie ein Hänger.
 */
function fortschritt(etikett) {
  let letzte = 0;
  return (_zuwachs, gesamt) => {
    if (gesamt - letzte < 2000) return;
    letzte = gesamt;
    process.stdout.write(`  … ${etikett}: ${gesamt.toLocaleString('de-DE')} Zeichen\n`);
  };
}

/** `--model konto` → Feld weglassen, OpenRouter nimmt die Kontovorgabe. */
function istKonto(id) {
  return id === KONTO || id === null;
}

function bilderFuer(args, pfade = args.bild) {
  if (!pfade.length) return [];
  const maxAnzahl = args['max-bilder'] ? Number.parseInt(args['max-bilder'], 10) : 40;
  return ladeBilder(pfade, { maxAnzahl });
}

function videosFuer(args, pfade = args.video) {
  if (!pfade.length) return [];
  const maxAnzahl = args['max-videos'] ? Number.parseInt(args['max-videos'], 10) : 8;
  return ladeVideos(pfade, { maxAnzahl });
}

function zeigeMedien(bilder, videos = []) {
  if (!bilder.length && !videos.length) return;
  console.log('');
  for (const b of bilder) {
    console.log(`  🖼 ${b.rel.padEnd(62)} ${String(Math.round(b.bytes / 1024)).padStart(6)} kB`);
  }
  for (const v of videos) {
    console.log(`  🎬 ${v.rel.padEnd(62)} ${String(Math.round(v.bytes / 1024)).padStart(6)} kB`);
  }
  const tok = bildTokens(bilder.length) + videoTokens(videos.length);
  const teile = [];
  if (bilder.length) teile.push(`${bilder.length} Bild(er)`);
  if (videos.length) teile.push(`${videos.length} Clip(s)`);
  console.log(`  Σ ${teile.join(' + ')} ≈ ${tok.toLocaleString('de-DE')} Tokens (grobe Schätzung, modellabhängig)`);
}

function kontextFuer(linse, args, cfg) {
  const maxChars = args['max-chars'] ? Number.parseInt(args['max-chars'], 10) : cfg.maxContextChars;
  return baueKontext(quellenFuer(linse, args), { maxChars });
}

function nachrichtFuer(frage, kontext, regeln = AUSGABE_REGELN) {
  return [
    frage.trim(),
    '',
    regeln,
    '',
    '---',
    '',
    '# Kontext-Paket: Auszüge aus dem Projekt',
    '',
    'Jeder Block beginnt mit `===== <pfad> · <modus> =====`. Zitiere Pfade wörtlich, wenn du Belege nennst.',
    kontext.text,
  ].join('\n');
}

function zeigeKontext(kontext) {
  for (const t of kontext.teile) {
    const marke = t.status === 'ausgelassen' ? '✗' : t.status === 'gekürzt' ? '~' : '✓';
    console.log(
      `  ${marke} ${t.rel.padEnd(62)} ${String(t.chars).padStart(8)} Zeichen  (${t.modus}, ${t.status})`
    );
  }
  console.log(
    `\n  Σ ${kontext.chars.toLocaleString('de-DE')} Zeichen ≈ ${kontext.tokens.toLocaleString('de-DE')} Tokens (geschätzt)`
  );
  if (kontext.ausgelassen > 0) {
    console.log(`  ⚠ ${kontext.ausgelassen} Quelle(n) ausgelassen — Budget erschöpft (--max-chars erhöhen).`);
  }
}

/** Katalog laden; schlägt das fehl (kein Netz/Schlüssel), geht es ohne Preise weiter. */
async function katalogVersuch(apiKey, cfg, anbieter = null, baseUrl = null) {
  // OpenAIs Katalog nennt keine Preise; die Kostenbremse kann dort nicht greifen
  // und die Modellprüfung liefe ins Leere. Deshalb dort gar nicht erst abfragen.
  if (anbieter && !anbieter.hatPreise) return { katalog: [], fehler: null };
  try {
    return { katalog: await listeModelle({ apiKey, baseUrl: baseUrl || cfg.baseUrl }), fehler: null };
  } catch (err) {
    return { katalog: [], fehler: err };
  }
}

// ---------- Befehle ----------

function cmdLenses() {
  console.log('\nLinsen — je ein Ausschnitt des Spiels plus die Frage dazu:\n');
  for (const l of LINSEN) {
    console.log(`  ${l.id.padEnd(13)} ${l.titel}`);
    console.log(`  ${''.padEnd(13)} ${l.kurz}`);
    console.log(`  ${''.padEnd(13)} ${l.quellen.length} Quellen\n`);
  }
  console.log('Benutzung:  node src/cli.mjs review --lens <id> --model <slug> --live\n');
}

function cmdPack(args, cfg) {
  const linse = findeLinse(args.lens);
  if (!linse) fehler(`Unbekannte Linse "${args.lens || '(fehlt)'}" — verfügbar: ${linsenIds().join(', ')}`);

  const kontext = kontextFuer(linse, args, cfg);
  const bilder = bilderFuer(args);
  const videos = videosFuer(args);
  const { frage, system } = baueAuftrag(linse, args);
  const nachricht = nachrichtFuer(frage, kontext, linse.regeln);

  console.log(`\nLinse: ${linse.id} — ${linse.titel}\n`);
  zeigeKontext(kontext);
  zeigeMedien(bilder, videos);

  fs.mkdirSync(RUNS_DIR, { recursive: true });
  const ziel = path.join(RUNS_DIR, `paket-${stempel()}-${linse.id}.md`);
  fs.writeFileSync(ziel, `<!-- SYSTEM -->\n${system}\n\n<!-- USER -->\n${nachricht}`, 'utf8');
  const gesamt = schaetzeTokens(system + nachricht) + bildTokens(bilder.length) + videoTokens(videos.length);
  console.log(`\n  Gesamter Prompt (System + Frage + Paket${bilder.length || videos.length ? ' + Medien' : ''}): ${gesamt.toLocaleString('de-DE')} Tokens (geschätzt)`);
  console.log(`  Zum Nachlesen geschrieben: ${relToRepo(ziel)}\n`);
}

async function cmdModels(args, cfg) {
  loadEnvFile();
  let apiKey = null;
  try {
    apiKey = getApiKey();
  } catch {
    /* /models geht auch ohne Schlüssel */
  }
  const katalog = await listeModelle({ apiKey, baseUrl: cfg.baseUrl });
  const filter = (args.filter || '').toLowerCase();
  const treffer = katalog
    .filter((m) => !filter || m.id.toLowerCase().includes(filter) || (m.name || '').toLowerCase().includes(filter))
    .sort((a, b) => a.id.localeCompare(b.id));

  console.log(`\n${treffer.length} von ${katalog.length} Modellen${filter ? ` (Filter: "${filter}")` : ''}:\n`);
  console.log(`${'Modell'.padEnd(46)} ${'Kontext'.padStart(9)}  ${'$/1M Prompt'.padStart(12)} ${'$/1M Antwort'.padStart(13)}`);
  for (const m of treffer.slice(0, 200)) {
    const p = preise(m);
    const f = (v) => (v == null ? '—' : (v * 1_000_000).toFixed(2));
    console.log(
      `${m.id.padEnd(46)} ${String(m.context_length ?? '—').padStart(9)}  ${f(p.prompt).padStart(12)} ${f(p.completion).padStart(13)}`
    );
  }
  if (treffer.length > 200) console.log(`… ${treffer.length - 200} weitere (mit --filter eingrenzen)`);
  console.log('');
}

async function cmdKey(cfg) {
  loadEnvFile();
  const apiKey = getApiKey();
  const info = await schluesselInfo({ apiKey, baseUrl: cfg.baseUrl });
  console.log(`\nSchlüssel ${info.maskiert}`);
  console.log(`  Bezeichnung : ${info.label ?? '—'}`);
  console.log(`  Verbraucht  : ${info.usage != null ? usd(info.usage) : '—'}`);
  console.log(`  Limit       : ${info.limit != null ? usd(info.limit) : 'kein Limit gesetzt'}`);
  console.log(`  Rest        : ${info.limit_remaining != null ? usd(info.limit_remaining) : '—'}`);
  console.log(`  Gratis-Tier : ${info.is_free_tier ? 'ja' : 'nein'}\n`);
}

async function cmdReview(args, cfg) {
  loadEnvFile();
  const linse = findeLinse(args.lens);
  if (!linse) fehler(`Unbekannte Linse "${args.lens || '(fehlt)'}" — verfügbar: ${linsenIds().join(', ')}`);

  const modelle = args.model.length ? args.model : [cfg.model];
  const maxCostUsd = args['max-cost'] ? Number.parseFloat(args['max-cost']) : cfg.maxCostUsd;
  const maxTokens = args['max-tokens'] ? Number.parseInt(args['max-tokens'], 10) : cfg.maxCompletionTokens;
  const denyDataCollection = args['erlaube-datensammlung'] ? false : cfg.denyDataCollection;
  const outDir = args.out ? path.resolve(args.out) : REPORT_DIR;

  const { anbieter, baseUrl } = anbieterKontext(args);
  const temperature = temperaturFuer(args, cfg, anbieter);
  const kontext = kontextFuer(linse, args, cfg);
  const bilder = bilderFuer(args);
  const videos = videosFuer(args);
  const { frage, system } = baueAuftrag(linse, args);
  const nachricht = nachrichtFuer(frage, kontext, linse.regeln);
  const promptTokens = schaetzeTokens(system + nachricht) + bildTokens(bilder.length) + videoTokens(videos.length);

  console.log(`\nLinse: ${linse.id} — ${linse.titel}`);
  console.log(`Modelle: ${modelle.map((m) => (istKonto(m) ? 'Kontovorgabe (OpenRouter-Standardmodell)' : m)).join(', ')}`);
  console.log(`Anbieter-Datensammlung: ${denyDataCollection ? 'ausgeschlossen (deny)' : 'ZUGELASSEN'}\n`);
  zeigeKontext(kontext);
  zeigeMedien(bilder, videos);
  console.log(`\n  Prompt gesamt: ~${promptTokens.toLocaleString('de-DE')} Tokens · Antwort max. ${maxTokens.toLocaleString('de-DE')} Tokens`);

  let apiKey = null;
  try {
    apiKey = getApiKey(process.env, anbieter);
  } catch (err) {
    if (args.live) throw err;
    console.log('\n  (Kein Schlüssel gesetzt — für den Trockenlauf nicht nötig.)');
  }

  const { katalog, fehler: katalogFehler } = await katalogVersuch(apiKey, cfg, anbieter, baseUrl);
  if (katalogFehler) {
    console.log(`\n  ⚠ Modell-Katalog nicht erreichbar (${katalogFehler.message.split('\n')[0]})`);
    if (args.live) throw katalogFehler;
  }

  // Plan je Modell aufstellen (Preis prüfen, bevor irgendetwas gesendet wird).
  const plan = [];
  for (const id of modelle) {
    if (istKonto(id)) {
      // Kein Katalog-Eintrag und damit kein Preis: welches Modell das Konto
      // hinterlegt hat, erfahren wir erst aus der Antwort.
      plan.push({ id: null, anzeige: 'Kontovorgabe', model: null, pricing: {}, geschaetzt: null, konto: true });
      continue;
    }
    const { model, vorschlaege } = katalog.length ? findeModell(katalog, id) : { model: null, vorschlaege: [] };
    if (katalog.length && !model) {
      const hinweis = vorschlaege.length ? `\n  Meintest du: ${vorschlaege.join(', ')}` : '';
      fehler(`Modell "${id}" gibt es bei OpenRouter nicht.${hinweis}\n  Katalog ansehen: node src/cli.mjs models --filter <text>`);
    }
    if (videos.length && model && !kannVideo(model)) {
      fehler(
        `Modell "${id}" kann keine Clips lesen (input_modalities ohne "video") — ` +
          `${videos.length} Clip(s) wären verschenkt.\n  Ohne --video laufen lassen, oder ein Modell mit Video-Eingabe wählen.`
      );
    }
    if (bilder.length && model && !kannBilder(model)) {
      fehler(
        `Modell "${id}" kann keine Bilder lesen (architecture.input_modalities ohne "image") — ` +
          `${bilder.length} Screenshot(s) wären verschenkt.\n  Sehende Modelle z. B.: ${sehendeModelle(katalog).join(', ')}`
      );
    }
    const pricing = model ? preise(model) : { prompt: null, completion: null };
    const geschaetzt = schaetzeKosten({ promptTokens, completionTokens: maxTokens, pricing });
    plan.push({ id, anzeige: id, model, pricing, geschaetzt });
  }

  console.log('\nKostenschätzung (Höchstfall — volle Antwortlänge):');
  for (const p of plan) console.log(`  ${p.anzeige.padEnd(46)} ${usd(p.geschaetzt).padStart(12)}`);
  if (plan.some((p) => p.konto)) {
    console.log('  ⚠ Kontovorgabe: welches Modell (und welcher Preis) das ist, steht erst in der Antwort.');
  }
  console.log(`  Kostenbremse pro Modell: ${usd(maxCostUsd)}`);

  if (!args.live) {
    fs.mkdirSync(RUNS_DIR, { recursive: true });
    const ziel = path.join(RUNS_DIR, `paket-${stempel()}-${linse.id}.md`);
    fs.writeFileSync(ziel, `<!-- SYSTEM -->\n${system}\n\n<!-- USER -->\n${nachricht}`, 'utf8');
    console.log(`\n  TROCKENLAUF — nichts gesendet, keine Kosten.`);
    console.log(`  Genau das würde gesendet: ${relToRepo(ziel)}`);
    console.log(`  Wirklich ausführen: denselben Befehl mit --live\n`);
    return;
  }

  for (const p of plan) {
    pruefeBudget({
      geschaetzt: p.geschaetzt,
      maxCostUsd,
      modelId: p.id,
      erlaubeUnbekannt: Boolean(args['preis-unbekannt-ok']) || Boolean(p.konto) || !anbieter.hatPreise,
    });
  }

  const zeitstempel = new Date().toISOString();
  const datum = heute();
  const ergebnisse = [];

  for (const p of plan) {
    console.log(`\n▶ ${p.anzeige} …`);
    const start = Date.now();
    try {
      const antwort = await frageModell({
        apiKey,
        baseUrl,
        model: p.id,
        system,
        user: nachricht,
        bilder,
        videos,
        maxTokens,
        temperature,
        timeoutMs: cfg.timeoutMs,
        ...aufrufOptionen(args, cfg),
        onStueck: fortschritt(p.anzeige),
      });
      const dauerMs = Date.now() - start;
      const u = antwort.usage || {};
      const kosten =
        u.cost != null
          ? Number(u.cost)
          : schaetzeKosten({
              promptTokens: u.prompt_tokens ?? promptTokens,
              completionTokens: u.completion_tokens ?? 0,
              pricing: p.pricing,
            });

      const markdown = rendereBericht({
        linse,
        model: p.anzeige,
        verwendetesModell: antwort.verwendetesModell,
        datum,
        zeitstempel,
        kontext,
        bilder,
        videos,
        antwort: antwort.text,
        usage: antwort.usage,
        kosten,
        dauerMs,
        frage,
        denyDataCollection,
      });
      const ziel = schreibeBericht(
        markdown,
        // Bei einem ausdrücklich gewählten Modell zählt der angeforderte Name (sonst
        // könnten zwei Modelle mit gleicher Rückmeldung einander überschreiben);
        // nur bei der Kontovorgabe erfahren wir den Namen erst aus der Antwort.
        berichtDateiname({
          linse: linse.id,
          model: p.konto ? antwort.verwendetesModell || 'kontovorgabe' : p.id,
          datum,
          name: args.name || null,
        }),
        outDir
      );

      console.log(`  ✓ ${usd(kosten)} · ${(dauerMs / 1000).toFixed(1)} s · ${antwort.text.length.toLocaleString('de-DE')} Zeichen`);
      console.log(`  → ${relToRepo(ziel)}`);
      if (antwort.finishReason === 'length') {
        console.log('  ⚠ Antwort lief ins Token-Limit — mit --max-tokens erhöhen.');
      }
      ergebnisse.push({ model: p.anzeige, kosten, ziel, ok: true });
      protokoll('review', {
        linse: linse.id, model: antwort.verwendetesModell || p.anzeige, kosten, dauerMs,
        usage: antwort.usage, bericht: relToRepo(ziel), kontextChars: kontext.chars,
        bilder: bilder.length, videos: videos.length,
        denkzeichen: (antwort.reasoning || '').length,
      });
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
      ergebnisse.push({ model: p.anzeige, ok: false, fehler: err.message });
      protokoll('review', { linse: linse.id, model: p.anzeige, fehler: err.message });
    }
  }

  const gesamt = ergebnisse.filter((e) => e.ok && e.kosten != null).reduce((s, e) => s + e.kosten, 0);
  const fehlgeschlagen = ergebnisse.filter((e) => !e.ok);
  console.log(`\nFertig: ${ergebnisse.length - fehlgeschlagen.length}/${ergebnisse.length} Berichte · Gesamtkosten ${usd(gesamt)}`);
  if (fehlgeschlagen.length) {
    console.log(`Fehlgeschlagen: ${fehlgeschlagen.map((e) => e.model).join(', ')}`);
    process.exitCode = 1;
  }
  console.log('');
}

function cmdFrames(args) {
  const { anbieter, baseUrl } = anbieterKontext(args);
  const ernteDir = args.ernte ? path.resolve(args.ernte) : ERNTE_DIR;
  const manifest = liesManifest(ernteDir);
  const clips = manifest.filter((e) => e.kind === 'clip' && e.file);
  if (!clips.length) fehler(`Keine Clips im Manifest von ${relToRepo(ernteDir)}.`);

  const anzahl = args.anzahl ? Number.parseInt(args.anzahl, 10) : 4;
  const ziel = path.join(ernteDir, 'frames');
  console.log(`\n${clips.length} Clips → je ${anzahl} Einzelbilder nach ${relToRepo(ziel)}\n`);

  let gesamt = 0;
  for (const clip of clips) {
    const datei = path.join(ernteDir, clip.file);
    if (!fs.existsSync(datei)) continue;
    try {
      const bilder = ziehe(datei, path.join(ziel, clip.bundle || 'clips'), {
        anzahl,
        durationMs: clip.durationMs || 6000,
      });
      gesamt += bilder.length;
      console.log(`  ✓ ${(clip.id || path.basename(datei)).padEnd(28)} ${bilder.length} Bilder`);
    } catch (err) {
      console.error(`  ✗ ${clip.id || path.basename(datei)}: ${err.message}`);
    }
  }

  console.log(`\n${gesamt} Einzelbilder geschrieben.`);
  console.log('Weiterverwenden:  node src/cli.mjs review --lens ui --model konto \\');
  console.log(`                    --bild ${relToRepo(path.join(ziel, clips[0].bundle || 'clips'))} --live`);
  console.log('\nHinweis für den Bericht: Einzelbilder zeigen, WAS sich bewegt und WO die Dinge');
  console.log('dabei stehen — nicht, wie flüssig es läuft.\n');
}

async function cmdSerie(args, cfg) {
  loadEnvFile();
  const linse = findeLinse(args.lens || 'ui');
  if (!linse) fehler(`Unbekannte Linse "${args.lens}" — verfügbar: ${linsenIds().join(', ')}`);

  const { anbieter, baseUrl } = anbieterKontext(args);
  const ernteDir = args.ernte ? path.resolve(args.ernte) : ERNTE_DIR;
  const manifest = liesManifest(ernteDir);
  const buendel = baueBuendel(manifest, ernteDir, {
    nurBuendel: args.buendel.length ? args.buendel : null,
    maxProBuendel: args['pro-buendel'] ? Number.parseInt(args['pro-buendel'], 10) : 12,
  });
  if (!buendel.length) fehler(`Keine passenden Bündel in ${relToRepo(ernteDir)} gefunden.`);

  const modellWunsch = args.model.length ? args.model[0] : cfg.model;
  const maxTokens = args['max-tokens'] ? Number.parseInt(args['max-tokens'], 10) : 32_000;
  const temperature = temperaturFuer(args, cfg, anbieter);
  const denyDataCollection = args['erlaube-datensammlung'] ? false : cfg.denyDataCollection;
  const outDir = args.out ? path.resolve(args.out) : REPORT_DIR;
  const kontext = kontextFuer(linse, args, cfg);
  const { system } = baueAuftrag(linse, args);

  console.log(`\nSerie: Linse "${linse.id}" über ${buendel.length} Bündel aus ${relToRepo(ernteDir)}`);
  console.log(`Modell: ${istKonto(modellWunsch) ? 'Kontovorgabe (OpenRouter-Standardmodell)' : modellWunsch}`);
  console.log(`Antwortlänge je Durchgang: max. ${maxTokens.toLocaleString('de-DE')} Tokens\n`);
  for (const b of buendel) {
    console.log(`  ${b.kind === 'clip' ? '🎬' : '🖼'} ${b.name.padEnd(24)} ${String(b.dateien.length).padStart(3)} Aufnahmen`);
  }

  if (!args.live) {
    console.log(`\n  TROCKENLAUF — nichts gesendet, keine Kosten.`);
    console.log(`  Wirklich ausführen: denselben Befehl mit --live\n`);
    return;
  }

  const apiKey = getApiKey(process.env, anbieter);
  const { katalog } = await katalogVersuch(apiKey, cfg, anbieter, baseUrl);
  const modell = istKonto(modellWunsch) ? null : findeModell(katalog, modellWunsch).model;
  if (!istKonto(modellWunsch) && katalog.length && !modell) {
    fehler(`Modell "${modellWunsch}" gibt es bei OpenRouter nicht.`);
  }
  const kannClips = modell ? kannVideo(modell) : true; // Kontovorgabe: erst die Antwort weiß es

  const datum = heute();
  const zeitstempel = new Date().toISOString();
  const gleichzeitig = args.parallel ? Number.parseInt(args.parallel, 10) : 3;
  let gesamtkosten = 0;

  const zuTun = buendel.filter((b) => {
    if (b.kind === 'clip' && !kannClips) {
      console.log(`\n▶ ${b.name} — übersprungen (Modell liest kein Video)`);
      return false;
    }
    return true;
  });

  console.log(`\nStarte ${zuTun.length} Durchgänge, ${gleichzeitig} gleichzeitig …`);

  const roh = await parallelBegrenzt(
    zuTun.map((b) => async () => {
    const start = Date.now();
    try {
      // In der Serie bestimmt --pro-buendel die Größe eines Durchgangs; die
      // allgemeinen Medien-Grenzen dürfen ein Bündel nicht nachträglich kappen.
      const proDurchgang = { ...args, 'max-bilder': String(b.dateien.length), 'max-videos': String(b.dateien.length) };
      const bilder = b.kind === 'clip' ? [] : bilderFuer(proDurchgang, b.dateien);
      const videos = b.kind === 'clip' ? videosFuer(proDurchgang, b.dateien) : [];
      const frage = buendelFrage(linse, b, args);
      const nachricht = nachrichtFuer(frage, kontext, linse.regeln);

      const antwort = await frageModell({
        apiKey, baseUrl, model: istKonto(modellWunsch) ? null : modellWunsch,
        system, user: nachricht, bilder, videos, maxTokens, temperature,
        timeoutMs: cfg.timeoutMs, ...aufrufOptionen(args, cfg),
        onStueck: fortschritt(b.name),
      });
      const dauerMs = Date.now() - start;
      const kosten = antwort.usage?.cost != null ? Number(antwort.usage.cost) : null;
      if (kosten) gesamtkosten += kosten;

      const markdown = rendereBericht({
        linse: { ...linse, titel: `${linse.titel} — Bündel „${b.name}"` },
        model: modellWunsch, verwendetesModell: antwort.verwendetesModell, datum, zeitstempel,
        kontext, bilder, videos, antwort: antwort.text, usage: antwort.usage, kosten, dauerMs,
        frage, denyDataCollection,
      });
      const ziel = schreibeBericht(
        markdown,
        berichtDateiname({ linse: `${linse.id}-${b.name}`, model: antwort.verwendetesModell || 'kontovorgabe', datum }),
        outDir
      );
      console.log(`  ✓ ${b.name.padEnd(24)} ${usd(kosten)} · ${(dauerMs / 1000).toFixed(0)} s · ${antwort.text.length.toLocaleString('de-DE')} Zeichen → ${relToRepo(ziel)}`);
      if (antwort.finishReason === 'length') console.log(`  ⚠ ${b.name}: Antwort lief ins Token-Limit (--max-tokens erhöhen).`);
      protokoll('serie', {
        linse: linse.id, buendel: b.name, model: antwort.verwendetesModell, kosten, dauerMs,
        usage: antwort.usage, bericht: relToRepo(ziel), aufnahmen: b.dateien.length,
      });
      return { name: b.name, text: antwort.text };
    } catch (err) {
      console.error(`  ✗ ${b.name}: ${err.message}`);
      protokoll('serie', { linse: linse.id, buendel: b.name, fehler: err.message });
      return null;
    }
    }),
    gleichzeitig
  );

  const berichte = roh.filter(Boolean);

  // Synthese über die Einzelberichte — der eigentliche Mehrwert der Serie.
  if (berichte.length >= 2) {
    console.log(`\n▶ Synthese über ${berichte.length} Einzelberichte …`);
    const start = Date.now();
    try {
      const antwort = await frageModell({
        apiKey, baseUrl, model: istKonto(modellWunsch) ? null : modellWunsch,
        system, user: syntheseFrage(berichte), maxTokens, temperature,
        timeoutMs: cfg.timeoutMs, ...aufrufOptionen(args, cfg),
        onStueck: fortschritt('Synthese'),
      });
      const dauerMs = Date.now() - start;
      const kosten = antwort.usage?.cost != null ? Number(antwort.usage.cost) : null;
      if (kosten) gesamtkosten += kosten;
      const markdown = rendereBericht({
        linse: { ...linse, titel: `${linse.titel} — SYNTHESE über ${berichte.length} Bündel` },
        model: modellWunsch, verwendetesModell: antwort.verwendetesModell, datum, zeitstempel,
        kontext: { chars: 0, tokens: 0, teile: [] }, bilder: [], videos: [],
        antwort: antwort.text, usage: antwort.usage, kosten, dauerMs,
        frage: `Zusammenführung der Einzel-Gutachten: ${berichte.map((b) => b.name).join(', ')}`,
        denyDataCollection,
      });
      const ziel = schreibeBericht(
        markdown,
        // Eine Synthese über eine Auswahl (--buendel) ist etwas anderes als die
        // über den ganzen Lauf und bekommt deshalb einen eigenen Namen.
        berichtDateiname({
          linse: `${linse.id}-00-SYNTHESE${args.buendel.length ? '-teil' : ''}`,
          model: antwort.verwendetesModell || 'kontovorgabe',
          datum,
          name: args.name || (args.buendel.length ? args.buendel.join('-') : null),
        }),
        outDir
      );
      console.log(`  ✓ ${(dauerMs / 1000).toFixed(1)} s → ${relToRepo(ziel)}`);
    } catch (err) {
      console.error(`  ✗ Synthese fehlgeschlagen: ${err.message}`);
    }
  }

  console.log(`\nFertig: ${berichte.length} Einzelberichte · Gesamtkosten ${usd(gesamtkosten)}\n`);
}

// ---------- Einstieg ----------

async function main() {
  ggfMitProxyNeustarten();
  const args = parseArgs(process.argv.slice(2));
  const befehl = args._[0];
  const cfg = defaults();

  if (!befehl || args.help || args.h) {
    console.log(HILFE);
    return;
  }

  switch (befehl) {
    case 'lenses':
    case 'linsen':
      return cmdLenses();
    case 'pack':
    case 'paket':
      return cmdPack(args, cfg);
    case 'models':
    case 'modelle':
      return cmdModels(args, cfg);
    case 'key':
    case 'schluessel':
      return cmdKey(cfg);
    case 'review':
      return cmdReview(args, cfg);
    case 'serie':
      return cmdSerie(args, cfg);
    case 'frames':
    case 'einzelbilder':
      return cmdFrames(args);
    default:
      fehler(`Unbekannter Befehl "${befehl}".${HILFE}`);
  }
}

main().catch((err) => {
  if (
    err instanceof KonfigFehler ||
    err instanceof BudgetUeberschritten ||
    err instanceof QuellenFehler ||
    err instanceof BildFehler ||
    err instanceof SerienFehler ||
    err instanceof FrameFehler
  ) {
    fehler(err.message);
  }
  if (err instanceof ApiFehler) {
    fehler(`OpenRouter: ${err.message}`);
  }
  console.error(err);
  process.exit(1);
});
