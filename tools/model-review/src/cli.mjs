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
import { loadEnvFile, getApiKey, defaults, maskKey, KonfigFehler } from './config.mjs';
import { LINSEN, findeLinse, linsenIds, AUSGABE_REGELN } from './lenses.mjs';
import { baueKontext, schaetzeTokens, QuellenFehler } from './pack.mjs';
import { preise, schaetzeKosten, pruefeBudget, usd, BudgetUeberschritten } from './cost.mjs';
import { listeModelle, schluesselInfo, frageModell, findeModell, ApiFehler } from './openrouter.mjs';
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
  const args = { _: [], model: [], datei: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) {
      args._.push(a);
      continue;
    }
    const [name, inline] = a.slice(2).split('=');
    const braucht = [
      'lens', 'linse', 'model', 'modell', 'max-cost', 'max-tokens', 'max-chars',
      'temperature', 'frage', 'out', 'filter', 'datei',
    ];
    if (braucht.includes(name)) {
      const wert = inline !== undefined ? inline : argv[++i];
      if (wert === undefined) fehler(`--${name} braucht einen Wert.`);
      if (name === 'model' || name === 'modell') args.model.push(wert);
      else if (name === 'datei') args.datei.push(wert);
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

WICHTIGE OPTIONEN
  --live                     Echten API-Aufruf erlauben (sonst passiert nichts Kostenpflichtiges)
  --model <slug>             Modell, mehrfach erlaubt (z. B. --model x/y --model a/b)
  --lens <id>                ${linsenIds().join(' | ')}
  --frage "<text>"           Eigene Frage statt der Linsen-Frage
  --datei <pfad>             Zusätzliche Datei ins Paket (mehrfach erlaubt)
  --max-cost <usd>           Kostenbremse pro Modell (Default ${defaults().maxCostUsd})
  --max-tokens <n>           Maximale Antwortlänge (Default ${defaults().maxCompletionTokens})
  --max-chars <n>            Maximale Paketgröße (Default ${defaults().maxContextChars})
  --temperature <n>          Default ${defaults().temperature}
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

function kontextFuer(linse, args, cfg) {
  const maxChars = args['max-chars'] ? Number.parseInt(args['max-chars'], 10) : cfg.maxContextChars;
  return baueKontext(quellenFuer(linse, args), { maxChars });
}

function nachrichtFuer(frage, kontext) {
  return [
    frage.trim(),
    '',
    AUSGABE_REGELN,
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
async function katalogVersuch(apiKey, cfg) {
  try {
    return { katalog: await listeModelle({ apiKey, baseUrl: cfg.baseUrl }), fehler: null };
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
  const { frage, system } = baueAuftrag(linse, args);
  const nachricht = nachrichtFuer(frage, kontext);

  console.log(`\nLinse: ${linse.id} — ${linse.titel}\n`);
  zeigeKontext(kontext);

  fs.mkdirSync(RUNS_DIR, { recursive: true });
  const ziel = path.join(RUNS_DIR, `paket-${stempel()}-${linse.id}.md`);
  fs.writeFileSync(ziel, `<!-- SYSTEM -->\n${system}\n\n<!-- USER -->\n${nachricht}`, 'utf8');
  console.log(`\n  Gesamter Prompt (System + Frage + Paket): ${schaetzeTokens(system + nachricht).toLocaleString('de-DE')} Tokens (geschätzt)`);
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
  const temperature = args.temperature ? Number.parseFloat(args.temperature) : cfg.temperature;
  const denyDataCollection = args['erlaube-datensammlung'] ? false : cfg.denyDataCollection;
  const outDir = args.out ? path.resolve(args.out) : REPORT_DIR;

  const kontext = kontextFuer(linse, args, cfg);
  const { frage, system } = baueAuftrag(linse, args);
  const nachricht = nachrichtFuer(frage, kontext);
  const promptTokens = schaetzeTokens(system + nachricht);

  console.log(`\nLinse: ${linse.id} — ${linse.titel}`);
  console.log(`Modelle: ${modelle.join(', ')}`);
  console.log(`Anbieter-Datensammlung: ${denyDataCollection ? 'ausgeschlossen (deny)' : 'ZUGELASSEN'}\n`);
  zeigeKontext(kontext);
  console.log(`\n  Prompt gesamt: ~${promptTokens.toLocaleString('de-DE')} Tokens · Antwort max. ${maxTokens.toLocaleString('de-DE')} Tokens`);

  let apiKey = null;
  try {
    apiKey = getApiKey();
  } catch (err) {
    if (args.live) throw err;
    console.log('\n  (Kein Schlüssel gesetzt — für den Trockenlauf nicht nötig.)');
  }

  const { katalog, fehler: katalogFehler } = await katalogVersuch(apiKey, cfg);
  if (katalogFehler) {
    console.log(`\n  ⚠ Modell-Katalog nicht erreichbar (${katalogFehler.message.split('\n')[0]})`);
    if (args.live) throw katalogFehler;
  }

  // Plan je Modell aufstellen (Preis prüfen, bevor irgendetwas gesendet wird).
  const plan = [];
  for (const id of modelle) {
    const { model, vorschlaege } = katalog.length ? findeModell(katalog, id) : { model: null, vorschlaege: [] };
    if (katalog.length && !model) {
      const hinweis = vorschlaege.length ? `\n  Meintest du: ${vorschlaege.join(', ')}` : '';
      fehler(`Modell "${id}" gibt es bei OpenRouter nicht.${hinweis}\n  Katalog ansehen: node src/cli.mjs models --filter <text>`);
    }
    const pricing = model ? preise(model) : { prompt: null, completion: null };
    const geschaetzt = schaetzeKosten({ promptTokens, completionTokens: maxTokens, pricing });
    plan.push({ id, model, pricing, geschaetzt });
  }

  console.log('\nKostenschätzung (Höchstfall — volle Antwortlänge):');
  for (const p of plan) console.log(`  ${p.id.padEnd(46)} ${usd(p.geschaetzt).padStart(12)}`);
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
      erlaubeUnbekannt: Boolean(args['preis-unbekannt-ok']),
    });
  }

  const zeitstempel = new Date().toISOString();
  const datum = heute();
  const ergebnisse = [];

  for (const p of plan) {
    console.log(`\n▶ ${p.id} …`);
    const start = Date.now();
    try {
      const antwort = await frageModell({
        apiKey,
        baseUrl: cfg.baseUrl,
        model: p.id,
        system,
        user: nachricht,
        maxTokens,
        temperature,
        timeoutMs: cfg.timeoutMs,
        denyDataCollection,
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
        model: p.id,
        verwendetesModell: antwort.verwendetesModell,
        datum,
        zeitstempel,
        kontext,
        antwort: antwort.text,
        usage: antwort.usage,
        kosten,
        dauerMs,
        frage,
        denyDataCollection,
      });
      const ziel = schreibeBericht(markdown, berichtDateiname({ linse: linse.id, model: p.id, datum }), outDir);

      console.log(`  ✓ ${usd(kosten)} · ${(dauerMs / 1000).toFixed(1)} s · ${antwort.text.length.toLocaleString('de-DE')} Zeichen`);
      console.log(`  → ${relToRepo(ziel)}`);
      if (antwort.finishReason === 'length') {
        console.log('  ⚠ Antwort lief ins Token-Limit — mit --max-tokens erhöhen.');
      }
      ergebnisse.push({ model: p.id, kosten, ziel, ok: true });
      protokoll('review', {
        linse: linse.id, model: p.id, kosten, dauerMs, usage: antwort.usage,
        bericht: relToRepo(ziel), kontextChars: kontext.chars,
      });
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
      ergebnisse.push({ model: p.id, ok: false, fehler: err.message });
      protokoll('review', { linse: linse.id, model: p.id, fehler: err.message });
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
    default:
      fehler(`Unbekannter Befehl "${befehl}".${HILFE}`);
  }
}

main().catch((err) => {
  if (err instanceof KonfigFehler || err instanceof BudgetUeberschritten || err instanceof QuellenFehler) {
    fehler(err.message);
  }
  if (err instanceof ApiFehler) {
    fehler(`OpenRouter: ${err.message}`);
  }
  console.error(err);
  process.exit(1);
});
