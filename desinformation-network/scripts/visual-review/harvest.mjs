// Visual-Review-Ernte (wiederverwendbar): fährt das gebaute Spiel (vite preview)
// mit Playwright durch ALLE Screens/Zustände, schießt Screenshots (+ Boden-
// Linien-Overlay-Varianten), misst Standlinien-Geometrie und nimmt kurze
// Video-Clips aller animierten Elemente auf.
//
// Lauf:  npm run build && npm run preview -- --port 4173 &
//        node scripts/visual-review/harvest.mjs [--url http://localhost:4173]
//          [--out runs/visual-review/latest] [--only id1,id2] [--no-clips] [--no-shots]
//
// Ausgabe: <out>/shots/*.png, <out>/overlay/*.png, <out>/clips/*.webm,
//          <out>/geometry/*.json, <out>/manifest.json (ein Eintrag je Artefakt).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { measureStageGeometry, drawFloorLineOverlay, removeFloorLineOverlay, drawViewportLine } from './browser-snippets.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

// ── CLI ──────────────────────────────────────────────────────────────────────
const arg = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : dflt;
};
const has = (name) => process.argv.includes(`--${name}`);
const BASE = arg('url', 'http://localhost:4173');
const OUT = path.resolve(ROOT, arg('out', 'runs/visual-review/latest'));
const ONLY = arg('only', '') ? arg('only', '').split(',') : null;
const DO_CLIPS = !has('no-clips');
const DO_SHOTS = !has('no-shots');
const EXE = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const VIEW = { width: 1280, height: 720 };

for (const d of ['shots', 'overlay', 'clips', 'geometry']) fs.mkdirSync(path.join(OUT, d), { recursive: true });

const manifest = [];
const consoleErrors = [];

// ── Kleine Helfer ────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const wanted = (id) => !ONLY || ONLY.includes(id);

function attachConsole(page, label) {
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`[${label}] ${m.text()}`); });
  page.on('pageerror', (e) => consoleErrors.push(`[${label}] PAGEERROR: ${e.message}`));
}

async function vqa(page, fn, ...args) {
  return page.evaluate(fn, ...args);
}

/** Screenshot + optional Overlay-Variante + optional Geometrie-Dump. */
async function shot(page, id, { bundle, desc, overlay = false, geometry = false } = {}) {
  if (!wanted(id) || !DO_SHOTS) return;
  // Pre-Shot-Guard 1: Ein Krisen-Modal (z-70) kann JEDERZEIT aufgehen und legt
  // sich dann über jeden folgenden Screen, bis es jemand wegräumt. Am
  // 2026-08-22 hat es so ein ganzes Bündel gekostet: sämtliche dialog_*-
  // Aufnahmen zeigten statt Porträt und Raum das Fenster „Influencer-Kontakt".
  // Kein einziger Shot dieser Ernte will je eine Krise zeigen — also gilt der
  // Wächter ohne Ausnahme, und er gehört hierher statt an einzelne Aufrufe.
  // Weggedrückt, nicht entschieden: Die Ernte soll den Spielstand nicht verbiegen.
  if (await vqa(page, () => !!window.__VQA__?.hasCrisis).catch(() => false)) {
    await vqa(page, () => window.__VQA__.dismissCrisis()).catch(() => {});
    await sleep(400);
  }
  // Pre-Shot-Guard 2: Der Tagesbericht. Die Uhr läuft in Echtzeit weiter; wer
  // sie fürs Nacht-Motiv auf 17:58 stellt, überschreitet während der nächsten
  // Sekunden 18:00 — der Auto-Feierabend öffnet den Bericht, und der bleibt
  // über allem liegen. Genau so wurden poster_detail und ambient_bubble zu
  // „LAGEBERICHT – TAG 1". Zumachen statt wegklicken: `setShowDayReport(false)`
  // schließt nur die Ansicht, „NÄCHSTER TAG" würde den Spielstand weiterdrehen.
  if (!/briefing|day_report/.test(id)) {
    await vqa(page, () => window.__VQA__?.ui?.setShowDayReport?.(false)).catch(() => {});
  }
  // Pre-Shot-Guard 3: Ein anstehender Entscheidungs-Beat blendet sein Modal
  // über jeden Screen. Im ersten Fremdmodell-Durchgang hat das die halbe
  // Panel-Strecke gekostet (panel_news/stats/npcs/mission/events, shortcuts,
  // hud_on zeigten alle dasselbe Modal „Die reale Vorlage"). Einzige Ausnahme
  // ist der Shot, der das Modal absichtlich zeigt.
  if (id !== 'decision_beat') {
    await vqa(page, () => window.__VQA__?.directorStore?.setState({ pendingDecisionBeatId: null })).catch(() => {});
  }
  // Pre-Shot-Guard 4: das Tag-Briefing erscheint zeitversetzt und würde sonst
  // beliebige Screens verdecken — außer wenn der Shot es selbst zeigen soll.
  if (!/briefing|day_report/.test(id)) {
    if (await clickButton(page, /Morgenbriefing weiter|^Verstanden/i, { timeout: 300 })) await sleep(450);
  }
  const file = path.join(OUT, 'shots', `${id}.png`);
  await page.screenshot({ path: file });
  const entry = { id, kind: 'shot', file: path.relative(OUT, file), bundle, desc };
  if (geometry) {
    const geo = await vqa(page, measureStageGeometry).catch((e) => ({ error: e.message }));
    const gf = path.join(OUT, 'geometry', `${id}.json`);
    fs.writeFileSync(gf, JSON.stringify(geo, null, 2));
    entry.geometry = path.relative(OUT, gf);
  }
  if (overlay) {
    await vqa(page, drawFloorLineOverlay).catch(() => {});
    await sleep(120);
    const of = path.join(OUT, 'overlay', `${id}__floorlines.png`);
    await page.screenshot({ path: of });
    await vqa(page, removeFloorLineOverlay).catch(() => {});
    entry.overlay = path.relative(OUT, of);
  }
  manifest.push(entry);
  console.log(`  📸 ${id}`);
}

/** Screenshot + Overlay-Variante mit Viewport-Referenzlinien (Vollbild-Räume). */
async function shotWithViewportLines(page, id, lines, meta) {
  if (!wanted(id) || !DO_SHOTS) return;
  const file = path.join(OUT, 'shots', `${id}.png`);
  await page.screenshot({ path: file });
  for (const l of lines) await vqa(page, drawViewportLine, l.yFrac, l.color ?? '#ff00cc', l.label ?? '').catch(() => {});
  await sleep(100);
  const of = path.join(OUT, 'overlay', `${id}__lines.png`);
  await page.screenshot({ path: of });
  await vqa(page, removeFloorLineOverlay).catch(() => {});
  manifest.push({ id, kind: 'shot', file: path.relative(OUT, file), overlay: path.relative(OUT, of), ...meta });
  console.log(`  📸 ${id} (+lines)`);
}

/** Resilienter Klick auf einen Button per Text-RegExp. */
async function clickButton(page, re, { timeout = 2500 } = {}) {
  const btn = page.getByRole('button', { name: re }).first();
  try {
    await btn.click({ timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Auf ein sichtbares Element warten, statt blind zu schlafen.
 *
 * Drei Aufnahmen des Durchgangs 2026-08-22 waren reine Wartezeit-Fehler:
 * `poster_detail` (Overlay noch nicht offen), `ambient_bubble` (Blase noch nicht
 * da oder schon abgelaufen), `broadcast_expanded` (im zugeklappten Zustand).
 * Ein festes sleep() rät; das hier prüft nach.
 *
 * @returns {Promise<boolean>} false, wenn die Frist ohne Treffer verstreicht.
 */
async function warteAuf(page, selektor, { maxWaitMs = 4000 } = {}) {
  try {
    await page.locator(selektor).first().waitFor({ state: 'visible', timeout: maxWaitMs });
    return true;
  } catch {
    return false;
  }
}

/** Sprechende Namen der vier Wahlabend-Schritte (WahlabendScene: 0..LAST_STEP). */
const WAHLABEND_SCHRITTE = ['Titelkarte', 'Hochrechnung/Sondersendung', 'Ergebnis', 'Wohnzimmer'];

/**
 * Welchen Schritt zeigt der Wahlabend gerade? Aus dem DOM abgelesen, NICHT aus
 * einer Kopie der Delay-Tabelle — sonst müsste die Ernte jede dramaturgische
 * Pause der Szene nachpflegen und liefe bei der nächsten Änderung wieder schief.
 *
 *   0  Titelkarte („DIE HOCHRECHNUNG", noch kein TV-Set)
 *   1  TV-Set läuft, Ergebnis noch offen
 *   2  Ergebnis steht (Ansage gewechselt bzw. Schlagzeilen durchgestrichen)
 *   3  Wohnzimmer-Schnitt mit „WEITER ▸"
 *
 * @returns {Promise<number|null>} null, wenn die Szene gar nicht (mehr) offen ist.
 */
async function wahlabendSchritt(page) {
  return page.evaluate(() => {
    const szene = document.querySelector('[role="dialog"][aria-label="Wahlabend"]');
    if (!szene) return null;
    const text = szene.textContent || '';
    if (Array.from(szene.querySelectorAll('button')).some((b) => /WEITER/i.test(b.textContent || ''))) return 3;
    if (/DIE HOCHRECHNUNG/.test(text)) return 0;
    // Schritt 2 wechselt die Ansage des Sprechers bzw. streicht die Schlagzeilen durch.
    const offen = /Erste Hochrechnung aus den Wahllokalen|Wir unterbrechen das Programm/.test(text);
    return offen ? 1 : 2;
  }).catch(() => null);
}

/** Auf einen Wahlabend-Schritt warten (die Szene schaltet von allein weiter). */
async function warteAufWahlabendSchritt(page, ziel, { maxWaitMs = 12000 } = {}) {
  const bis = Date.now() + maxWaitMs;
  while (Date.now() < bis) {
    const jetzt = await wahlabendSchritt(page);
    if (jetzt === null) return false;
    if (jetzt >= ziel) {
      await sleep(500); // Einblend-Animation (wa-rise, 500-600 ms) auslaufen lassen
      return (await wahlabendSchritt(page)) !== null;
    }
    await sleep(150);
  }
  return false;
}

/** Das am weitesten scrollbare Element der Seite finden (Overlays scrollen innen). */
async function scrollerInfo(page) {
  return page.evaluate(() => {
    for (const alt of document.querySelectorAll('[data-vqa-scroller]')) alt.removeAttribute('data-vqa-scroller');
    let best = { strecke: 0, el: null };
    for (const el of document.querySelectorAll('*')) {
      const strecke = el.scrollHeight - el.clientHeight;
      if (strecke > best.strecke && el.clientHeight > 200) best = { strecke, el };
    }
    if (best.el) best.el.setAttribute('data-vqa-scroller', '1');
    const doc = document.scrollingElement;
    const docStrecke = doc ? doc.scrollHeight - doc.clientHeight : 0;
    return { strecke: Math.max(best.strecke, docStrecke), innen: best.strecke >= docStrecke };
  }).catch(() => ({ strecke: 0, innen: false }));
}

/** Wie viele Pixel lassen sich hier überhaupt scrollen? */
async function scrollbareStrecke(page) {
  return (await scrollerInfo(page)).strecke;
}

/** Auf einen Anteil (0..1) der scrollbaren Strecke fahren — statt fester Pixel. */
async function scrolleAufAnteil(page, anteil) {
  await page.evaluate((a) => {
    const innen = document.querySelector('[data-vqa-scroller="1"]');
    const doc = document.scrollingElement;
    const ziel = innen && innen.scrollHeight - innen.clientHeight > (doc ? doc.scrollHeight - doc.clientHeight : 0)
      ? innen
      : doc;
    if (!ziel) return;
    ziel.scrollTop = (ziel.scrollHeight - ziel.clientHeight) * a;
  }, anteil).catch(() => {});
}

/** Offene Dialoge/Views/Briefings schließen, bis die Bühne frei ist. */
async function dismissAll(page, { maxTries = 16 } = {}) {
  for (let i = 0; i < maxTries; i++) {
    // Tagesbericht (falls der Feierabend ausgelöst wurde): NÄCHSTER TAG klickt
    // den Report weg — das folgende Morgenbriefing fängt die nächste Runde ab.
    if (await clickButton(page, /NÄCHSTER TAG/i, { timeout: 400 })) { await sleep(900); continue; }
    // Morgenbriefing & Co.: expliziter Bestätigungs-Knopf hat Vorrang.
    if (await clickButton(page, /Morgenbriefing weiter|^Verstanden/i, { timeout: 400 })) { await sleep(400); continue; }
    // Krisen-Modal (z-70) liegt über allem und wartet auf eine Entscheidung.
    // Am 2026-08-22 hat es vier Aufnahmen gefressen — decision_beat,
    // day_report, day_report_bottom und morning_briefing zeigten alle dasselbe
    // Krisenfenster, weil niemand es je weggeräumt hat. Wegdrücken statt
    // entscheiden: Die Ernte soll den Spielstand nicht verbiegen.
    if (await vqa(page, () => !!window.__VQA__?.hasCrisis).catch(() => false)) {
      await vqa(page, () => window.__VQA__.dismissCrisis()).catch(() => {});
      await sleep(400);
      continue;
    }
    const st = await vqa(page, () => ({
      hasDialog: !!window.__VQA__?.hasDialog,
    })).catch(() => ({ hasDialog: false }));
    if (st.hasDialog) {
      // Erst weiterklicken (Space), dann hart schließen.
      await page.keyboard.press(' ').catch(() => {});
      await sleep(350);
      const st2 = await vqa(page, () => !!window.__VQA__?.hasDialog).catch(() => false);
      if (st2) await vqa(page, () => window.__VQA__.dismissDialog()).catch(() => {});
      await sleep(350);
      continue;
    }
    // Bekannte Funktions-Views schließen (idempotent).
    await vqa(page, () => {
      const ui = window.__VQA__?.ui;
      if (!ui) return;
      ui.setShowNewsroom(false); ui.setShowPreTest(false); ui.setShowOperationsAkte(false);
      ui.setShowFokusgruppe(false); ui.setShowLagebild(false); ui.setShowBoard(false);
    }).catch(() => {});
    return;
  }
}

/** Falls das Spiel pausiert ist (Escape-Nebenwirkung), fortsetzen. */
async function ensurePlaying(page) {
  const phase = await vqa(page, () => window.__VQA__?.gamePhase).catch(() => null);
  if (phase === 'paused') {
    await vqa(page, () => window.__VQA__.resumeGame()).catch(() => {});
    await sleep(400);
  }
}

async function freshPage(browser, { url = '/', clearStorage = true, label = 'page' } = {}) {
  const ctx = await browser.newContext({ viewport: VIEW });
  const page = await ctx.newPage();
  attachConsole(page, label);
  await page.goto(`${BASE}${url}${url.includes('?') ? '&' : '?'}vqa=1`, { waitUntil: 'networkidle' }).catch(() => {});
  if (clearStorage) {
    await page.evaluate(() => localStorage.clear()).catch(() => {});
    await page.reload({ waitUntil: 'networkidle' }).catch(() => {});
  }
  await sleep(900);
  return { ctx, page };
}

/** Intro bis ins Gebäude durchspielen (Avatar wählbar). */
async function newGameToBuilding(page, { portrait = 'm2', name = 'Tester', shotsDuringIntro = false } = {}) {
  await clickButton(page, /NEUE MISSION/i);
  await sleep(700);
  if (shotsDuringIntro) await shot(page, 'avatar_choice', { bundle: 'intro', desc: 'Personalakte / Avatar-Wahl (Grundzustand)' });
  const kind = portrait.startsWith('f') ? 'weiblich' : 'männlich';
  const idx = { 1: 0, 2: 1, 3: 2 }[portrait[1]] ?? 1;
  await page.locator(`button[aria-label*="(${kind})"]`).nth(idx).click({ timeout: 2000 }).catch(() => {});
  await page.locator('input[aria-label="Ihr Name"]').fill(name).catch(() => {});
  if (shotsDuringIntro) await shot(page, `avatar_choice_${portrait}`, { bundle: 'intro', desc: `Avatar-Wahl: Porträt ${portrait} gewählt, Deckname eingetragen` });
  await clickButton(page, /MISSION BEGINNEN/i);
  await sleep(1400);
  if (shotsDuringIntro) {
    await shot(page, 'arrival_early', { bundle: 'intro', desc: 'Ankunfts-Sequenz kurz nach Start (Lobby, Avatar läuft)' });
    await sleep(4500);
    await shot(page, 'arrival_mid', { bundle: 'intro', desc: 'Ankunfts-Sequenz Mitte (Fahrstuhl/Etagen)' });
  }
  await clickButton(page, /Sequenz überspringen|Überspringen/i);
  await sleep(900);
  if (shotsDuringIntro) await shot(page, 'vergabe_akte', { bundle: 'intro', desc: 'Vergabe-Szene: EINE Akte „Die Wahl" der Zentrale' });
  await clickButton(page, /AKTE ÜBERNEHMEN/i);
  await sleep(1800);
  if (shotsDuringIntro) {
    const hasDialog = await vqa(page, () => !!window.__VQA__?.hasDialog).catch(() => false);
    if (hasDialog) await shot(page, 'direktor_intro', { bundle: 'dialog', desc: 'Kurator-/Direktor-Intro-Dialog direkt nach Vergabe (DialogBox + Porträt)' });
  }
  await dismissAll(page);
  await sleep(400);
}

/**
 * Über das Etagen-Tableau zu einem Raum navigieren (Avatar läuft/fährt echt).
 * Wartet auf Ankunft (Dialog/View öffnet sich bzw. Timeout) und schließt danach
 * optional alles, sodass der Flur frei sichtbar ist.
 */
async function gotoRoom(page, roomLabelRe, { settleMs = 1200, close = true, maxWaitMs = 26000 } = {}) {
  await page.keyboard.press('f');
  await sleep(600);
  const opt = page.getByRole('option', { name: roomLabelRe }).first();
  try {
    await opt.click({ timeout: 2500 });
  } catch {
    await page.keyboard.press('Escape');
    return false;
  }
  // Auf Ankunft warten: Dialog/View geht auf ODER Zeit läuft ab (reine Lauf-Ziele).
  const t0 = Date.now();
  let arrived = false;
  while (Date.now() - t0 < maxWaitMs) {
    await sleep(700);
    const st = await vqa(page, () => ({ hasDialog: !!window.__VQA__?.hasDialog, view: window.__VQA__?.viewMode })).catch(() => null);
    if (st && (st.hasDialog || st.view === 'office')) { arrived = true; break; }
  }
  await sleep(settleMs);
  if (close) {
    await dismissAll(page);
    await vqa(page, () => window.__VQA__.ui.setViewMode('building')).catch(() => {});
    await sleep(600);
  }
  return arrived;
}

// ── Clips ────────────────────────────────────────────────────────────────────
async function recordClip(browser, id, { bundle, desc, durationMs, drive }) {
  if (!wanted(id) || !DO_CLIPS) return;
  const dir = path.join(OUT, 'clips');
  const ctx = await browser.newContext({ viewport: VIEW, recordVideo: { dir, size: VIEW } });
  const page = await ctx.newPage();
  attachConsole(page, `clip:${id}`);
  try {
    await drive(page);
    await sleep(durationMs);
  } catch (e) {
    console.log(`  ⚠️ clip ${id}: ${e.message}`);
  }
  const video = page.video();
  await page.close();
  await ctx.close();
  if (video) {
    const tmp = await video.path();
    const file = path.join(dir, `${id}.webm`);
    fs.renameSync(tmp, file);
    manifest.push({ id, kind: 'clip', file: path.relative(OUT, file), bundle, desc, durationMs });
    console.log(`  🎬 ${id}`);
  }
}

// ── Hauptlauf ────────────────────────────────────────────────────────────────
// Playwright hängt im Headless-Modus zwingend `--hide-scrollbars` an. Das
// Projekt stylet Scrollleisten aber ausdrücklich sichtbar (10 px, Tinten-Daumen
// auf Papier-Track, src/index.css:506-521) — sie sind hier also KEIN Web-Chrome,
// sondern die Affordanz, die einen Innen-Scroller als Innen-Scroller ausweist.
// Ohne sie sieht in der Ernte jede gedeckelte Liste nach „hart abgeschnitten"
// aus, und Fremdmodell-Reviews melden folgerichtig Scheinbefunde: Beim Durchgang
// am 2026-08-21 hing daran ein ganzer Befund-Cluster („Beschnitt ohne Affordanz").
const browser = await chromium.launch({
  executablePath: EXE,
  ignoreDefaultArgs: ['--hide-scrollbars'],
});
console.log(`Ernte → ${OUT}\nBasis: ${BASE}`);

// 1) Titel (frisch, ohne Save).
if (wanted('title')) {
  const { ctx, page } = await freshPage(browser, { label: 'title' });
  await sleep(3200); // Einblend-Animation des Menüs abwarten
  await shot(page, 'title', { bundle: 'intro', desc: 'Titelbildschirm (Menü, Gebäude-Key-Art, Version)' });
  await ctx.close();
}

// 2) Intro-Strecke m + Gebäude + Tageszeiten + Etagen + Büro/Panels (eine Session).
{
  const { ctx, page } = await freshPage(browser, { label: 'main' });
  await newGameToBuilding(page, { portrait: 'm2', shotsDuringIntro: true });

  // Gebäude EG (Lobby) am Vormittag. (Briefing erscheint verzögert → nochmal schließen.)
  await vqa(page, () => window.__VQA__.setMinutes(120));
  await sleep(1600);
  await dismissAll(page);
  await sleep(400);
  await shot(page, 'building_lobby_day', { bundle: 'building', desc: 'Gebäude-Querschnitt, EG/Lobby, Vormittag (11:00)', overlay: true, geometry: true });

  // Pförtner-Sprechblase.
  await page.locator('button[aria-label="Pförtner ansprechen"]').click({ timeout: 1500 }).catch(() => {});
  await sleep(400);
  await shot(page, 'pfoertner_bubble', { bundle: 'building', desc: 'Pförtner in der Lobby mit geöffneter Sprechblase' });
  await page.locator('button[aria-label="Pförtner ansprechen"]').click({ timeout: 1500 }).catch(() => {});

  // Etagen-Tableau selbst.
  await page.keyboard.press('f');
  await sleep(600);
  await shot(page, 'floor_directory', { bundle: 'panels', desc: 'Etagen-Tableau (Fahrstuhl-Navigation, Taste F)' });
  await page.keyboard.press('Escape');
  await sleep(300);

  // L2: Vorgangs-Terminal (Taste A) — Tür-Auswahl (M2) und Archiv-Schublade.
  await page.keyboard.press('a');
  await sleep(1000);
  await shot(page, 'terminal_vorgaenge', { bundle: 'panels', desc: 'Vorgangs-Terminal (L2): kuratierte Tür-Auswahl mit M1-Vorgangsblättern (Wirkung/Preis/Frische-Stempel)' });
  await clickButton(page, /ARCHIV \(/i);
  await sleep(700);
  await shot(page, 'terminal_archiv', { bundle: 'panels', desc: 'Vorgangs-Terminal (L2): ARCHIV-Schublade mit Filter-/Such-/Porträt-Zeile (voller Katalog)' });
  await page.keyboard.press('Escape');
  await sleep(400);

  // Alle Etagen ablaufen: je Etage ein Ziel-Raum (öffnet sich → wird geschlossen),
  // dann Flur-Shot mit Overlay + Geometrie (Avatar steht vor der Tür).
  const floorTargets = [
    ['etage4', /Medien-Zentrum/i, 'Etage 4 — Spezial-Operationen'],
    ['etage3', /Newsroom/i, 'Etage 3 — Analyse & Medien'],
    ['etage2', /Feld-Operationen/i, 'Etage 2 — Feld-Operationen'],
    ['etage1', /Direktor/i, 'Etage 1 — Zentrale'],
    ['keller', /Finanzen/i, 'Keller — Geheimoperationen'],
  ];
  for (const [floorId, roomRe, label] of floorTargets) {
    const ok = await gotoRoom(page, roomRe);
    if (!ok) console.log(`  ⚠️ ${floorId}: Ankunft nicht bestätigt (Shot trotzdem)`);
    await shot(page, `building_${floorId}`, { bundle: 'building', desc: `Gebäude-Querschnitt, ${label} (Avatar vor Ort)`, overlay: true, geometry: true });
  }

  // Tageszeiten-Reihe auf Etage 1 (Avatar steht): 6 Stützpunkte der Tagesuhr.
  // 538 statt 540: exakt 18:00 löst den Auto-Feierabend aus (dayEnded) und der
  // Tagesbericht legt sich über ALLE Folge-Shots (Ernte-Artefakt Etappe 2).
  for (const [mins, label] of [[0, '0900'], [180, '1200'], [324, '1425'], [420, '1600'], [486, '1706'], [538, '1800']]) {
    await vqa(page, (m) => window.__VQA__.setMinutes(m), mins);
    await sleep(1600); // Sky-Transition 800ms + Skyline-Blende 1200ms
    await shot(page, `sky_${label}`, { bundle: 'daynight', desc: `Tageszeit-Stimmung um ${label.slice(0, 2)}:${label.slice(2)} Uhr (Himmel/Skyline/Tönung)` });
  }
  // Nacht in der Lobby (Regressions-Blick: Lobby-Kacheln + Nacht-Skyline).
  await gotoRoom(page, /Lobby/i, { close: false, maxWaitMs: 30000 });
  // Der Weg kostet Spielzeit — Uhr erst NACH Ankunft auf 17:58 pinnen, sonst
  // kippt der Auto-Feierabend doch noch (Code-Review E2).
  await vqa(page, () => window.__VQA__.setMinutes(538)).catch(() => {});
  await sleep(1200);
  await shot(page, 'building_lobby_night', { bundle: 'daynight', desc: 'Lobby bei Nacht (18:00, Tönung + Nacht-Skyline)', overlay: true, geometry: true });
  await vqa(page, () => window.__VQA__.setMinutes(180));
  await sleep(1200);

  // Detail-Overlays der klickbaren Umgebung: Plakat (Etage 4).
  await gotoRoom(page, /Medien-Zentrum/i);
  await page.locator('img[src*="prop_poster"]').first().click({ timeout: 1500 }).catch(() => {});
  if (await warteAuf(page, '[role="dialog"][aria-label^="Plakat:"]')) {
    await sleep(300); // Einblendung auslaufen lassen
    await shot(page, 'poster_detail', { bundle: 'building', desc: 'Vergrößertes Propaganda-Plakat (Detail-Overlay, §14.4)' });
  } else {
    console.log('  ⚠️ poster_detail: Plakat-Overlay ging nicht auf — Aufnahme übersprungen');
  }
  await page.mouse.click(640, 690);
  await sleep(400);

  // Statist ansprechen (Sprechblase) — zweiter Klick schließt sie wieder.
  await page.locator('button[aria-label$="ansprechen"]').first().click({ timeout: 1500 }).catch(() => {});
  if (await warteAuf(page, '[data-testid="ambient-bubble"]')) {
    await shot(page, 'ambient_bubble', { bundle: 'building', desc: 'Flur-Statist mit Flavor-Sprechblase' });
  } else {
    console.log('  ⚠️ ambient_bubble: keine Sprechblase erschienen — Aufnahme übersprungen');
  }
  await page.locator('button[aria-label$="ansprechen"]').first().click({ timeout: 1500 }).catch(() => {});

  // ── Büro + Panels + Spiel-UI ──
  // Uhr zurückstellen: Wege kosten Spielzeit (K1) — die Gebäude-Tour kann sonst
  // 18:00 überschreiten und der Auto-Feierabend legt den Tagesbericht über alles.
  await vqa(page, () => window.__VQA__.setMinutes(240)).catch(() => {});
  await dismissAll(page);
  await ensurePlaying(page);
  await vqa(page, () => window.__VQA__.ui.setViewMode('office'));
  await sleep(1000);
  await shot(page, 'office', { bundle: 'office', desc: 'Spielerbüro (PlayerOfficeView) mit Hotspots/Einsteiger-Hinweisen' });

  const openByHotspot = async (label, id, desc) => {
    const ok = await clickButton(page, new RegExp(label, 'i'));
    await sleep(1000);
    if (ok) await shot(page, id, { bundle: 'office', desc });
    await dismissAll(page);
    await sleep(400);
  };
  await openByHotspot('NARRATIV-TAFEL', 'board_korkbrett', 'Narrativ-Tafel / Korkbrett (Kampagnen-Planer)');
  await openByHotspot('LAGEBILD', 'lagebild', 'Lagebild-Ansicht (TV im Büro)');

  // L2: Taste A gehört jetzt dem Vorgangs-Terminal (eigene Shots terminal_*) —
  // der frühere 'panel_actions'-Eintrag schoss nur ein Duplikat unter irreführendem Namen.
  for (const [key, id, desc] of [
    ['n', 'panel_news', 'Seiten-Panel: Nachrichten'],
    ['s', 'panel_stats', 'Seiten-Panel: Statistiken/Gesellschaft'],
    ['p', 'panel_npcs', 'Seiten-Panel: Kontakte/NPCs'],
    ['m', 'panel_mission', 'Seiten-Panel: Auftrag/Mission'],
    ['e', 'panel_events', 'Seiten-Panel: Welt-Ereignisse'],
  ]) {
    await ensurePlaying(page);
    await page.keyboard.press(key);
    await sleep(900);
    await shot(page, id, { bundle: 'panels', desc });
    await page.keyboard.press(key); // Toggle schließt das Panel (kein Escape → keine Pause-Nebenwirkung)
    await sleep(300);
  }

  await ensurePlaying(page);
  await page.keyboard.press('h');
  await sleep(600);
  await shot(page, 'hud_on', { bundle: 'panels', desc: 'HUD eingeblendet (Sonntagsfrage · Abwehr · Kasse · Tag)' });
  await page.keyboard.press('h');
  // Nicht über die Taste: `b` schaltet UM, die Aufnahme traf deshalb schon den
  // zugeklappten Zustand. Der VQA-Setter sagt, was er meint.
  await vqa(page, () => window.__VQA__.ui.setBroadcastExpanded(true)).catch(() => {});
  await sleep(1000);
  await shot(page, 'broadcast_expanded', { bundle: 'broadcast', desc: 'Broadcast ausgeklappt: Sendung + Publikums-Wohnzimmer (Milieus)' });
  await vqa(page, () => window.__VQA__.ui.setBroadcastExpanded(false)).catch(() => {});
  await page.keyboard.press('i');
  await sleep(900);
  await shot(page, 'encyclopedia', { bundle: 'panels', desc: 'Nachschlagewerk/Enzyklopädie (Taste I)' });
  await page.keyboard.press('i');
  await page.keyboard.press('?');
  await sleep(400);
  await shot(page, 'shortcuts', { bundle: 'panels', desc: 'Tastenkürzel-Hilfe' });
  await page.keyboard.press('Escape'); // schließt die Hilfe
  await sleep(300);
  await ensurePlaying(page);
  await page.keyboard.press('Escape'); // jetzt bewusst: Pause
  await sleep(600);
  await shot(page, 'pause_menu', { bundle: 'panels', desc: 'Pausenmenü (Sound-Mixer, Speichern, Beenden)' });
  await clickButton(page, /FORTSETZEN/i);
  await sleep(400);

  // ── Raum-Nahsichten: jeden NPC ansprechen (direkt, ohne Laufweg) ──
  await vqa(page, () => window.__VQA__.setMinutes(240)).catch(() => {});
  await dismissAll(page);
  await ensurePlaying(page);
  await vqa(page, () => window.__VQA__.ui.setViewMode('building'));
  await sleep(600);
  const npcIds = await vqa(page, () => window.__VQA__.layout.rooms.filter((r) => r.npcId).map((r) => r.npcId));
  for (const npcId of npcIds) {
    await vqa(page, (n) => window.__VQA__.interactWithNpc(n), npcId);
    await sleep(1500);
    await shotWithViewportLines(
      page,
      `dialog_${npcId}`,
      [{ yFrac: 0.995, color: '#00e5ff', label: 'BILDUNTERKANTE' }],
      { bundle: 'dialog', desc: `Raum-Nahsicht + DialogBox: ${npcId} (Porträt, Raum-Hintergrund, Mimik)` },
    );
    await dismissAll(page);
    await sleep(500);
  }

  // ── Funktionsräume (direkt geöffnet) ──
  const openView = async (setter, id, desc) => {
    await vqa(page, (s) => window.__VQA__.ui[s](true), setter);
    await sleep(1100);
    await shot(page, id, { bundle: 'rooms', desc });
    await vqa(page, (s) => window.__VQA__.ui[s](false), setter);
    await sleep(400);
  };
  await openView('setShowNewsroom', 'newsroom', 'Newsroom-Vertiefung (Monitore, GEGENSEITE-Streifen)');
  await openView('setShowPreTest', 'fokusgruppe_pretest', 'Analyse-Raum: Fokusgruppen-Pre-Test');
  await openView('setShowOperationsAkte', 'operations_akte', 'Operations-Akte (Kommunikations-Schlachtfeld)');
  await openView('setShowFokusgruppe', 'fokusgruppe', 'Fokusgruppen-Ansicht');
  await openView('setShowBoard', 'board_direct', 'Narrativ-Tafel direkt (Vergleich zur Hotspot-Version)');

  // ── Extras: Aktions-Karte + Ausführungs-Feedback (M1/M5) + Entscheidungs-Beat ──
  await ensurePlaying(page);
  await page.keyboard.press('a');
  await sleep(900);
  const executed = await clickButton(page, /^AUSFÜHREN/i, { timeout: 2000 });
  if (executed) {
    await sleep(1400);
    await shot(page, 'action_feedback', { bundle: 'panels', desc: 'Ergebnis einer ausgeführten Aktion (Feedback/Quittung, M1/M5)' });
    await dismissAll(page);
  }
  // L2: AUSFÜHREN schließt das Terminal selbst — ein blindes zweites 'a'
  // ÖFFNETE es wieder (Review E4: decision_beat-Shot entstand über dem Schirm).
  const terminalNochOffen = await page.evaluate(() => !!document.querySelector('[data-testid="terminal-view"]'));
  if (terminalNochOffen) {
    await page.keyboard.press('a');
    await sleep(300);
  }
  await ensurePlaying(page);
  // Bühne frei: ein noch offenes Krisen-/Dialogfenster läge SONST über dem
  // Beat-Modal — und genau das ist am 2026-08-22 passiert.
  await dismissAll(page);
  await vqa(page, () => window.__VQA__.directorStore.setState({ pendingDecisionBeatId: 'stadtrat' })).catch(() => {});
  await sleep(900);
  await shot(page, 'decision_beat', { bundle: 'panels', desc: 'Entscheidungs-Beat-Modal (Stadtrat) mit Optionen + Berater-Badge' });
  await vqa(page, () => window.__VQA__.directorStore.setState({ pendingDecisionBeatId: null })).catch(() => {});
  await sleep(300);

  // ── Tagesende: Heimweg → Tagesfazit → nächster Morgen ──
  await dismissAll(page);
  await vqa(page, () => window.__VQA__.setMinutes(540));
  await vqa(page, () => window.__VQA__.requestEndDay());
  await sleep(11000); // Heimweg-Lauf
  await shot(page, 'day_report', { bundle: 'daycycle', desc: 'Tagesfazit (DayReport) nach dem Heimweg' });
  // „Nächster Tag"-Button liegt am Ende des scrollbaren Berichts.
  await page.mouse.move(640, 360);
  await page.mouse.wheel(0, 4000);
  await sleep(600);
  await shot(page, 'day_report_bottom', { bundle: 'daycycle', desc: 'Tagesfazit, unteres Ende (Über Nacht / Tranche / Weiter-Button)' });
  await clickButton(page, /Nächster Tag|WEITER|SCHLIESSEN/i);
  await sleep(2800);
  await shot(page, 'morning_briefing', { bundle: 'daycycle', desc: 'Morgenbriefing des nächsten Kampagnentags' });
  await clickButton(page, /WEITER|VERSTANDEN|SCHLIESSEN|OK/i);
  await sleep(600);

  await ctx.close();
}

// 3) Weiblicher Avatar: Gebäude + Lauf-Sheet-Kopplung (Regressions-Blick V16).
if (wanted('building_avatar_f')) {
  const { ctx, page } = await freshPage(browser, { label: 'female' });
  await newGameToBuilding(page, { portrait: 'f1', name: 'Testerin' });
  await vqa(page, () => window.__VQA__.setMinutes(150));
  await sleep(1600);
  await dismissAll(page);
  // Kurz durch die Lobby laufen lassen, damit die Lauf-Figur sichtbar Frames zeigt.
  await page.mouse.click(900, 520).catch(() => {});
  await sleep(1200);
  await shot(page, 'building_avatar_f', { bundle: 'building', desc: 'Gebäude mit weiblichem Avatar (Lauf-/Idle-Sheet-Kopplung an Porträt-Wahl, V16)', overlay: true, geometry: true });
  await ctx.close();
}

// 4) Spielende erzwingen: echter Wahlabend → GameEndScreen → EndReport.
async function forceEnd(browser, branchId, mutate, shotsPrefix) {
  if (!ONLY && !DO_SHOTS) return false;
  if (ONLY && !ONLY.some((o) => o.startsWith(shotsPrefix))) return false;
  const { ctx, page } = await freshPage(browser, { label: `end:${branchId}` });
  await newGameToBuilding(page, { portrait: 'm2' });
  const endInfo = await page.evaluate(async (mutateSrc) => {
    const V = window.__VQA__;
    // eslint-disable-next-line no-new-func
    const mutateFn = new Function('engine', 'V', mutateSrc);
    try { mutateFn(V.engine, V); } catch (e) { return { error: 'mutate: ' + e.message }; }
    V.endPhase();
    return { ok: true };
  }, mutate).catch((e) => ({ error: e.message }));
  await sleep(2000);
  const state = await vqa(page, () => ({ phase: window.__VQA__.gamePhase, end: window.__VQA__.gameEnd })).catch(() => ({}));
  if (state.phase !== 'ended') {
    console.log(`  ⚠️ forceEnd(${branchId}) hat kein Spielende erzeugt`, JSON.stringify(endInfo), JSON.stringify(state?.end ?? null));
    await ctx.close();
    return false;
  }
  console.log(`  🏁 forceEnd(${branchId}) → branch=${state.end?.branch ?? '?'} type=${state.end?.type ?? '?'}`);

  // Die Szene schaltet PER TIMER weiter (WahlabendScene delays [1900, 2600, 3000]).
  // Die alte Ernte schlief blind 2000 ms und klickte dann dreimal — der 1900-ms-Tick
  // war da längst durch, „s0" zeigte also Schritt 1, die ganze Reihe war um einen
  // Schritt versetzt, und der dritte Klick fiel hinter LAST_STEP auf onComplete().
  // Deshalb wird jetzt auf den ZUSTAND gewartet statt auf die Uhr, und gar nicht
  // mehr geklickt: Die Szene läuft von allein, wir fotografieren nur mit.
  for (let s = 0; s <= 3; s++) {
    if (!(await warteAufWahlabendSchritt(page, s))) {
      console.log(`  ⚠️ Wahlabend-Schritt ${s} (${branchId}) nicht erreicht — Aufnahme übersprungen`);
      continue;
    }
    await shot(page, `${shotsPrefix}_wahlabend_s${s}`, {
      bundle: 'ending',
      desc: `Wahlabend (echt, ${branchId}), ${WAHLABEND_SCHRITTE[s]}`,
    });
  }

  // Ab hier klicken wir bewusst: Schritt 3 wartet auf „WEITER ▸".
  await clickButton(page, /WEITER/i);
  await sleep(1800);
  // Nach dem Wahlabend öffnet der End-Report VON SELBST (StoryModeGame.tsx:392-401,
  // „End-Report IST der Lernmoment"). Ohne dieses Zuklappen zeigte `_gameend` also nie
  // den GameEndScreen, sondern immer schon den Report.
  await vqa(page, () => window.__VQA__.ui.setShowEndReport(false)).catch(() => {});
  await sleep(700);
  await shot(page, `${shotsPrefix}_gameend`, { bundle: 'ending', desc: `GameEndScreen (${branchId})` });

  await vqa(page, () => window.__VQA__.ui.setShowEndReport(true)).catch(() => {});
  await sleep(1400);
  await shot(page, `${shotsPrefix}_endreport_top`, { bundle: 'ending', desc: `End-Report (${branchId}), Anfang: „Das Rennen"-Kurven` });
  await page.mouse.move(640, 400);
  // Anteilig statt in festen Pixeln scrollen: Der Report eines erzwungenen Endes ist
  // kürzer als die früher fest verdrahteten 1400 px — `mid` und `bottom` liefen dann
  // beide in denselben Anschlag und lieferten zweimal dasselbe Bild.
  const strecke = await scrollbareStrecke(page);
  if (strecke > 400) {
    await scrolleAufAnteil(page, 0.5);
    await sleep(600);
    await shot(page, `${shotsPrefix}_endreport_mid`, { bundle: 'ending', desc: `End-Report (${branchId}), Mitte: Methoden-Atlas/Bilanz` });
    await scrolleAufAnteil(page, 1);
    await sleep(600);
    await shot(page, `${shotsPrefix}_endreport_bottom`, { bundle: 'ending', desc: `End-Report (${branchId}), Ende: Gegenmaßnahmen/Debrief` });
  } else {
    console.log(`  ↔ End-Report (${branchId}) ist nur ${Math.round(strecke)} px scrollbar — eine Aufnahme genügt`);
    if (strecke > 40) {
      await scrolleAufAnteil(page, 1);
      await sleep(600);
      await shot(page, `${shotsPrefix}_endreport_bottom`, { bundle: 'ending', desc: `End-Report (${branchId}), Ende: Gegenmaßnahmen/Debrief` });
    }
  }
  await ctx.close();
  return true;
}

await forceEnd(
  browser,
  'timeout',
  `const wa = engine.getWahlabendData();
   // Wahltag auf heute ziehen: electionDay − currentDay aus der Phase ableiten.
   const phase = engine.getCurrentPhase ? engine.getCurrentPhase() : null;
   const electionDay = (phase && phase.electionDay) ?? engine.electionDay ?? 40;
   const current = (phase && phase.number) ?? 1;
   engine.shiftElectionDay(-(electionDay - current), 'VQA-Ernte', 'VQA harvest');`,
  'end_timeout',
);
await forceEnd(browser, 'immune', `engine.raiseAbwehr(100);`, 'end_immune');
await forceEnd(
  browser,
  'victory',
  `const snap = engine.getSocietySnapshot();
   const boosted = {};
   for (const k of Object.keys(snap)) boosted[k] = typeof snap[k] === 'number' ? 100 : snap[k];
   engine.getSocietySnapshot = () => boosted;
   const obj = engine.objectives && engine.objectives.find((o) => o.id === 'obj_destabilize');
   if (obj) obj.currentValue = obj.targetValue ?? 0;`,
  'end_victory',
);

// 5) Wahlabend-Fixtures (deterministisch, alle 4 Branches inkl. exposed).
for (const branch of ['victory', 'timeout', 'immune', 'exposed']) {
  if (!wanted(`fixture_wahlabend_${branch}_s0`)) continue;
  const { ctx, page } = await freshPage(browser, { url: `/vqa.html?scene=wahlabend&branch=${branch}`, clearStorage: false, label: `fixture:${branch}` });
  await shot(page, `fixture_wahlabend_${branch}_s0`, { bundle: 'ending', desc: `Wahlabend-Fixture (${branch}): Titelkarte` });
  for (let s = 1; s <= 3; s++) {
    await page.mouse.click(640, 300);
    await sleep(1000);
    await shot(page, `fixture_wahlabend_${branch}_s${s}`, { bundle: 'ending', desc: `Wahlabend-Fixture (${branch}): Schritt ${s} (${s === 1 ? 'Hochrechnung/Sondersendung' : s === 2 ? 'Ergebnis/Stempel' : 'Wohnzimmer-Schnitt + Nachsatz'})` });
  }
  await ctx.close();
}

// 6) Video-Clips der animierten Elemente.
if (DO_CLIPS) {
  console.log('Clips…');
  await recordClip(browser, 'clip_arrival', {
    bundle: 'intro', desc: 'Ankunfts-Sequenz (Lobby → Fahrstuhl → Direktor), ungeschnitten', durationMs: 16000,
    drive: async (page) => {
      await page.goto(`${BASE}/?vqa=1`, { waitUntil: 'networkidle' });
      await page.evaluate(() => localStorage.clear());
      await page.reload({ waitUntil: 'networkidle' });
      await sleep(900);
      await clickButton(page, /NEUE MISSION/i);
      await sleep(600);
      await page.locator('button[aria-label*="(männlich)"]').nth(1).click({ timeout: 2000 }).catch(() => {});
      await page.locator('input[aria-label="Ihr Name"]').fill('Tester').catch(() => {});
      await clickButton(page, /MISSION BEGINNEN/i);
    },
  });

  const buildingClip = (id, desc, durationMs, drive) =>
    recordClip(browser, id, {
      bundle: 'animation', desc, durationMs,
      drive: async (page) => {
        await page.goto(`${BASE}/?vqa=1`, { waitUntil: 'networkidle' });
        await page.evaluate(() => localStorage.clear());
        await page.reload({ waitUntil: 'networkidle' });
        await sleep(900);
        await newGameToBuilding(page, { portrait: 'm2' });
        await page.evaluate(() => window.__VQA__.setMinutes(150));
        await sleep(400);
        await drive(page);
      },
    });

  await buildingClip('clip_avatar_walk', 'Avatar-Laufzyklus in der Lobby (Schrittfrequenz vs. Bewegung — Foot-Sliding-Check)', 8000, async (page) => {
    await page.mouse.click(1000, 500);
    await sleep(3500);
    await page.mouse.click(280, 500);
  });

  await buildingClip('clip_elevator', 'Fahrstuhl: Tableau → Kabinenfahrt → Türen öffnen → Raum (Timing/Überblendung)', 15000, async (page) => {
    await page.keyboard.press('f');
    await sleep(600);
    await page.getByRole('option', { name: /Medien-Zentrum/i }).first().click({ timeout: 2000 }).catch(() => {});
  });

  // LB „Lebendiges Gebäude" (Abnahme §3b c): Abnahmefenster je Etage — Statisten
  // erscheinen aus Türen, laufen echte Routen, verschwinden in Türen (kein Fade,
  // kein Teleport). Das Fenster startet erst, wenn der Nudge ANGENOMMEN wurde
  // (Review E3: fire-and-forget verpasste auf Reinigungs-Etagen den Tür-zu-Beat),
  // und ist lang genug für einen vollen Zyklus (Tür → Route → Idle → Tür, ~25–40 s).
  const ambientClip = (floorId, level, roomRe) =>
    buildingClip(`clip_ambient_${floorId}`, `LB: Routen-Statisten auf ${floorId} (Abnahmefenster: Tür auf → heraustreten → Route → Tür zu)`, 44000, async (page) => {
      await page.keyboard.press('f');
      await sleep(600);
      await page.getByRole('option', { name: roomRe }).first().click({ timeout: 2000 }).catch(() => {});
      await sleep(9000);
      await dismissAll(page);
      await vqa(page, () => window.__VQA__.ui.setViewMode('building')).catch(() => {});
      await sleep(400);
      // Warten, bis ein verborgener Agent den Auftritt übernimmt (Fenster-Anker).
      await page
        .waitForFunction((lvl) => window.__VQA__?.ambientNudge?.(lvl) === true, level, { timeout: 25000, polling: 1000 })
        .catch(() => {});
      // Zweiter Auftritt in der Fenster-Mitte (falls ein weiterer Agent frei ist).
      await page.evaluate((lvl) => {
        setTimeout(() => window.__VQA__?.ambientNudge?.(lvl), 20000);
      }, level);
    });

  await ambientClip('etage4', 4, /Medien-Zentrum/i);
  await ambientClip('etage3', 3, /Newsroom/i);
  await ambientClip('etage2', 2, /Feld-Operationen/i);
  await ambientClip('etage1', 1, /Direktor/i);
  await ambientClip('keller', -1, /Finanzen/i);

  await buildingClip('clip_daynight_sweep', 'Tagesuhr-Sweep 09:00→18:00 in ~11s (Himmel, Skyline-Blenden, Tönung)', 13000, async (page) => {
    await page.evaluate(() => {
      let m = 0;
      const t = setInterval(() => {
        m += 9;
        window.__VQA__.setMinutes(m);
        if (m >= 540) clearInterval(t);
      }, 180);
    });
  });

  await buildingClip('clip_broadcast', 'Broadcast-Leiste ausklappen: Sendung + Publikums-Wohnzimmer (Ticker/Reaktionen)', 11000, async (page) => {
    await page.keyboard.press('b');
  });

  await buildingClip('clip_walkhome_dayreport', 'Tagesende: Heimweg durch das Gebäude → Tagesfazit', 15000, async (page) => {
    await page.evaluate(() => { window.__VQA__.setMinutes(540); window.__VQA__.requestEndDay(); });
  });

  for (const branch of ['victory', 'timeout', 'exposed']) {
    await recordClip(browser, `clip_wahlabend_${branch}`, {
      bundle: 'ending', desc: `Wahlabend-Szene (${branch}) im Auto-Vorlauf — Balken-Animation, Stempel, Blink-Timing`, durationMs: 14000,
      drive: async (page) => {
        await page.goto(`${BASE}/vqa.html?scene=wahlabend&branch=${branch}`, { waitUntil: 'networkidle' });
      },
    });
  }
}

// ── Abschluss ────────────────────────────────────────────────────────────────
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
fs.writeFileSync(path.join(OUT, 'console-errors.txt'), consoleErrors.join('\n') || '(keine)');
console.log(`\nFertig: ${manifest.length} Artefakte, ${consoleErrors.length} Konsolen-Fehler.`);
await browser.close();
