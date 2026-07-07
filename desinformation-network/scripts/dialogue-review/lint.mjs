#!/usr/bin/env node
/**
 * Dialog-Review-Harness (Auftrag 2026-07-06, Etappe R6).
 *
 * Fängt automatisch und wiederholbar die billigen 80 % der Dialog-Mängel —
 * die Klassen, die in der Owner-Stichprobe auftauchten:
 *   - Verbotsliste (Emoji, Anglizismen-Soße, Behörden-Floskeln, Möbel/Dev-Vokabular)
 *   - Platzhalter-Integrität ({x} ohne Insert; Insert ohne Nutzung)
 *   - Kasus-/Numerus-Fallen (Dativ „mit {budget_value}" → Talern; Singular-Risiko
 *     bei hart-plural verdrahteten Substantiven; „liegt bei {fallback-Adjektiv}")
 *   - Bindestrich-Kaskade (Voll-Satz per „ - " in einen Satz geklebt)
 *   - de/en-Parität, tone-Abdeckung, ID-Eindeutigkeit
 *
 * Ausgabe: runs/dialogue-review/latest/BEFUNDE.json (gitignored) + Konsolen-Report.
 * Rein lesend, kein LLM. `--strict` → Exit 1, wenn Befunde der Stufe „error".
 *
 * Lauf:  node scripts/dialogue-review/lint.mjs [--strict]
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '../../src/story-mode/data');
const OUT_DIR = join(__dirname, '../../runs/dialogue-review/latest');

const load = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const dialogues = load('dialogues.json');
const topics = load('topics_dialogues.json');
const inserts = load('insert_library.json').inserts;

const findings = [];
const add = (level, category, id, file, detail, sample) =>
  findings.push({ level, category, id, file, detail, sample });

// --- Zeilen einsammeln: jedes Objekt mit text_de gilt als Dialogzeile ---
/** @returns {Array<{id,text_de,text_en,tone,file,path}>} */
function collectLines(root, file) {
  const out = [];
  const walk = (node, path) => {
    if (Array.isArray(node)) {
      node.forEach((n, i) => walk(n, `${path}[${i}]`));
    } else if (node && typeof node === 'object') {
      if (typeof node.text_de === 'string') {
        out.push({
          id: node.id ?? path,
          text_de: node.text_de,
          text_en: typeof node.text_en === 'string' ? node.text_en : undefined,
          tone: node.tone,
          file,
          path,
        });
      }
      for (const [k, v] of Object.entries(node)) {
        if (k === 'text_de' || k === 'text_en') continue;
        walk(v, `${path}.${k}`);
      }
    }
  };
  walk(root, file.replace('.json', ''));
  return out;
}

const lines = [...collectLines(dialogues, 'dialogues.json'), ...collectLines(topics, 'topics_dialogues.json')];

// --- Regeln ---
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u;
// „Team" bewusst NICHT gelistet — im Deutschen naturalisiert (Duden). Nur echte Soße.
const ANGLIZISMEN = /\b(Content|Feature|Deadline|Meeting|gepusht|Fake-News|Skillset|Mindset|Deepdive)\b/;
const FLOSKELN = /\b(im Rahmen (der|des|unserer)|diesbezüglich|entsprechend der Maßgabe|nach Maßgabe|zwecks)\b/i;
const MOEBEL = /(Sendeplan|Narrativ-Tafel|Maßnahme(n)? ausspielen|auf dem Korkbrett|Barometer-Panel)/;
// ASCII-Ersatz für Umlaute/ß — kuratierte Stämme (keine Fehlalarme auf neue/heute/Leute/Steuer …).
const ASCII_UMLAUT = /\b\w*(nuetzl|erklaer|aktivitaet|nachschiess|moegl|koenn(?!en\b)|muess|ueberl|gefaehr|schoen|groess|zaehl|naehe|haett|waer|fuer\b|ueber\b)\w*/i;

const PLACEHOLDER = /\{(\w+)\}/g;
const usedInserts = new Set();

for (const l of lines) {
  const t = l.text_de;

  // Verbotsliste
  if (EMOJI.test(t)) add('error', 'verbotsliste-emoji', l.id, l.file, 'Emoji im Dialogtext', t);
  const ang = t.match(ANGLIZISMEN);
  if (ang) add('warn', 'verbotsliste-anglizismus', l.id, l.file, `Anglizismus „${ang[0]}"`, t);
  const flo = t.match(FLOSKELN);
  if (flo) add('warn', 'verbotsliste-floskel', l.id, l.file, `Behörden-Floskel „${flo[0]}"`, t);
  const moe = t.match(MOEBEL);
  if (moe) add('error', 'verbotsliste-moebel', l.id, l.file, `Möbel/Dev-Vokabular „${moe[0]}" im NPC-Text`, t);
  const asc = t.match(ASCII_UMLAUT);
  if (asc) add('warn', 'ascii-umlaut', l.id, l.file, `ASCII-Ersatz statt Umlaut/ß: „${asc[0]}"`, t);

  // Platzhalter-Integrität
  let m;
  PLACEHOLDER.lastIndex = 0;
  while ((m = PLACEHOLDER.exec(t))) {
    const key = m[1];
    usedInserts.add(key);
    if (!inserts[key]) add('error', 'platzhalter-fehlt', l.id, l.file, `{${key}} hat keinen Eintrag in insert_library.json`, t);
  }

  // Kasus-Falle: Dativ vor {budget_value} (Insert liefert Nominativ „ Taler" → müsste „Talern")
  if (/\b(mit|von|aus|bei|zu)\s+\{budget_value\}/i.test(t))
    add('error', 'kasus-dativ-taler', l.id, l.file, 'Dativ-Rahmen vor {budget_value}: „Taler" statt „Talern" (Insert ist kasus-blind)', t);

  // Numerus-Risiko: hart-pluraler Substantiv-Rahmen hinter einer Zähl-Einsetzung
  if (/\{budget_option_count\}\s+[^.]*\bOperationen\b/.test(t))
    add('error', 'numerus-plural', l.id, l.file, '{budget_option_count} kann 1 sein → „1 … Operationen" (Substantiv hart plural)', t);
  if (/\{days_remaining\}/.test(t))
    add('warn', 'numerus-tage', l.id, l.file, '{days_remaining} hängt hart „ Tage" an → bei 1 „1 Tage" statt „1 Tag"', t);

  // Bindestrich-Kaskade: Satz enthält " - " UND ein Insert, dessen Text selbst " - " führt
  if (/ - \{(risk_state)\}/.test(t) || (/ - /.test(t) && /\{risk_state\}/.test(t)))
    add('warn', 'bindestrich-kaskade', l.id, l.file, 'risk_state enthält selbst „ - …" → verschachtelte Bindestrich-Splices', t);

  // Fallback-Rahmen: „liegt bei {x}" wo der Insert-Default ein Adjektiv ist
  const beiMatch = t.match(/liegt bei \{(\w+)\}/);
  if (beiMatch) {
    const ins = inserts[beiMatch[1]];
    const def = ins?.default?.text_de || ins?.fallback?.text_de;
    if (def && /^(unbekannt|kritisch|niedrig|stabil|hoch|knapp)/i.test(def))
      add('warn', 'fallback-rahmen', l.id, l.file, `„liegt bei {${beiMatch[1]}}" + Fallback „${def}" ergibt „liegt bei ${def}"`, t);
  }

  // de/en-Parität
  if (!l.text_en) add('warn', 'parity-en-fehlt', l.id, l.file, 'text_en fehlt zu text_de', t);
}

// Ungenutzte Inserts
for (const key of Object.keys(inserts)) {
  if (!usedInserts.has(key)) add('info', 'insert-ungenutzt', key, 'insert_library.json', `Insert „${key}" wird in keinem Dialogtext genutzt`, '');
}

// tone-Abdeckung (nur dialogues.json — dort ist tone das Metadatum)
const dlgLines = lines.filter((l) => l.file === 'dialogues.json');
const withTone = dlgLines.filter((l) => l.tone).length;
const toneCoverage = dlgLines.length ? Math.round((withTone / dlgLines.length) * 100) : 0;
if (toneCoverage < 100)
  add('info', 'tone-abdeckung', '-', 'dialogues.json', `tone auf ${withTone}/${dlgLines.length} Zeilen (${toneCoverage}%)`, '');

// ID-Eindeutigkeit
const idSeen = new Map();
for (const l of lines) {
  if (typeof l.id !== 'string' || l.id.includes('[')) continue; // synthetische Pfade überspringen
  if (idSeen.has(l.id)) add('warn', 'id-doppelt', l.id, l.file, `ID auch in ${idSeen.get(l.id)}`, '');
  else idSeen.set(l.id, l.file);
}

// --- Report ---
const byLevel = { error: 0, warn: 0, info: 0 };
for (const f of findings) byLevel[f.level]++;
const byCategory = {};
for (const f of findings) byCategory[f.category] = (byCategory[f.category] || 0) + 1;

const report = {
  generatedFor: 'Dialog-Review-Harness R6',
  scannedLines: lines.length,
  toneCoverage: `${toneCoverage}%`,
  totals: byLevel,
  byCategory,
  findings,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'BEFUNDE.json'), JSON.stringify(report, null, 2));

console.log(`\n📋 Dialog-Review-Harness — ${lines.length} Zeilen gescannt`);
console.log(`   tone-Abdeckung: ${toneCoverage}%`);
console.log(`   Befunde:  ${byLevel.error} error · ${byLevel.warn} warn · ${byLevel.info} info`);
console.log('   nach Kategorie:');
for (const [c, n] of Object.entries(byCategory).sort((a, b) => b[1] - a[1]))
  console.log(`     ${String(n).padStart(3)} × ${c}`);
console.log(`\n   → ${join('runs/dialogue-review/latest', 'BEFUNDE.json')}\n`);

if (process.argv.includes('--strict') && byLevel.error > 0) {
  console.error(`❌ ${byLevel.error} Error-Befund(e) — strict-Modus schlägt fehl.`);
  process.exit(1);
}
