// UI-MARATHON (Verify-Suite, 2026-07-13) — erster mehrtägiger REINER UI-Durchlauf.
// =================================================================================
// Steuerung AUSSCHLIESSLICH über sichtbare Spieler-Affordanzen (Buttons, Hotkeys,
// Klicks) — window.__VQA__ wird NUR ZUM LESEN benutzt (Tag, Minuten, gamePhase,
// hasDialog, viewMode), damit die Assertions Ground-Truth haben.
//
// Tagesschleife (echter Spielerpfad):
//   Morgen-Overlays (Briefing/Beats/Gegenmaßnahmen/Dialoge) über sichtbare Knöpfe
//   schließen → Taste F (Fahrstuhl-Tableau) → Raum „Ihr Büro" → Knopf „FEIERABEND →"
//   → Heimweg-Animation → Tagesfazit → „Nächster Tag ▸" → Assertion Tag+1.
//
// Erklärter Workaround (WIRD IM REPORT MARKIERT): scheitert der UI-Feierabend
// objektiv (Büro nicht erreichbar / Knopf wirkungslos / Fazit erscheint nie), wird
// EINMAL pro Tag __VQA__.requestEndDay() benutzt, um weiterzukommen — das ist
// Steuerung über den Test-Hook und zählt als HAUPTBEFUND, nicht als Erfolg.
// (Hinweis: __VQA__.setMinutes(540) allein KANN den Feierabend nicht auslösen,
// weil setMinutes das dayEnded-Flag des dayClockStore nicht setzt.)
//
// Stall-Detektor: 75 s ohne beobachtbare Zustandsänderung → DOM-Dump + Screenshot
// + sauberer Abbruch mit Befund. Gesamt-Zeitbox: 35 Minuten.
//
// Lauf:   node scripts/verify-suite/ui-marathon.mjs [--url http://localhost:4173]
// Output: runs/verify-suite/ui-marathon/report.json + shots/*.png + dom-dumps
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'runs', 'verify-suite', 'ui-marathon');
const SHOTS = path.join(OUT, 'shots');
fs.mkdirSync(SHOTS, { recursive: true });

const argOf = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
};
const BASE = argOf('url', 'http://localhost:4173');
const EXE = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const TIMEBOX_MS = 35 * 60 * 1000;   // Gesamt-Zeitbox
const STALL_MS = 75 * 1000;          // Stall-Detektor
const TARGET_DAY = 40;               // Ziel: Spielende oder Tag 40

const startedAt = Date.now();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Report-Zustand ───────────────────────────────────────────────────────────
const report = {
  startedAt: new Date(startedAt).toISOString(),
  url: BASE,
  targetDay: TARGET_DAY,
  daysCompleted: 0,
  lastDaySeen: 0,
  stopReason: null,
  gameEnd: null,
  perDay: [],
  findings: [],
  workaroundsUsed: 0,
  consoleErrors: [],
};
const finding = (severity, text, evidence = {}) => {
  report.findings.push({ severity, text, ...evidence });
  console.log(`  [BEFUND/${severity}] ${text}`);
};

// ── Browser-Setup ────────────────────────────────────────────────────────────
const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on('console', (m) => { if (m.type() === 'error') report.consoleErrors.push(m.text().slice(0, 300)); });
page.on('pageerror', (e) => report.consoleErrors.push('PAGEERROR: ' + String(e.message).slice(0, 300)));

let shotCounter = 0;
async function shot(label) {
  const file = `${String(++shotCounter).padStart(2, '0')}_${label}.png`;
  await page.screenshot({ path: path.join(SHOTS, file) }).catch(() => {});
  return path.join('shots', file);
}
async function domDump(label) {
  const file = path.join(OUT, `dom_${label}.html`);
  const html = await page.content().catch(() => '(content() fehlgeschlagen)');
  fs.writeFileSync(file, html);
  return file;
}

// NUR LESEN: Spielzustand über den VQA-Hook (?vqa=1) für Assertions.
async function readState() {
  return page.evaluate(() => {
    const V = window.__VQA__;
    let day = null;
    try { day = V?.engine?.getCurrentPhase?.().number ?? null; } catch { /* leer */ }
    return {
      day,
      minutes: (() => { try { return V?.getMinutes?.() ?? null; } catch { return null; } })(),
      gamePhase: V?.gamePhase ?? null,
      hasDialog: !!V?.hasDialog,
      viewMode: V?.viewMode ?? null,
      hasEnd: !!V?.gameEnd,
      endInfo: V?.gameEnd ? { type: V.gameEnd.type, branch: V.gameEnd.branch } : null,
    };
  }).catch(() => ({ day: null, minutes: null, gamePhase: null, hasDialog: false, viewMode: null, hasEnd: false, endInfo: null }));
}

// ── Stall-Detektor: jede beobachtete Zustandsänderung setzt die Uhr zurück ───
let lastSignature = '';
let lastChangeTs = Date.now();
class StallError extends Error {}
async function observe(label) {
  const st = await readState();
  const btns = await buttonTexts();
  const sig = JSON.stringify([st.day, st.minutes, st.gamePhase, st.hasDialog, st.viewMode, st.hasEnd, btns.slice(0, 12)]);
  if (sig !== lastSignature) { lastSignature = sig; lastChangeTs = Date.now(); }
  if (Date.now() - lastChangeTs > STALL_MS) throw new StallError(`Stall (${STALL_MS / 1000}s ohne Zustandsänderung) bei: ${label}`);
  if (Date.now() - startedAt > TIMEBOX_MS) throw new StallError(`Zeitbox (${TIMEBOX_MS / 60000} min) erreicht bei: ${label}`);
  return st;
}

// ── UI-Helfer (Spieler-Affordanzen) ──────────────────────────────────────────
async function buttonTexts() {
  return page.evaluate(() =>
    [...document.querySelectorAll('button')]
      .filter((b) => b.offsetParent !== null)
      .map((b) => (b.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 48))
      .filter(Boolean),
  ).catch(() => []);
}
async function clickButton(re, { timeout = 1200 } = {}) {
  const btn = page.getByRole('button', { name: re }).first();
  try { await btn.click({ timeout }); return true; } catch { return false; }
}

/**
 * Sichtbare Overlays wie ein Spieler wegklicken (Morgenbriefing, Entscheidungs-
 * Beats, Abwehr-Gegenmaßnahmen, Verrat/Krisen/Konsequenzen, laufende Dialoge).
 * Liefert Notizen über alles, was behandelt wurde.
 */
async function clearOverlaysUI(dayNotes, { maxTries = 24 } = {}) {
  for (let i = 0; i < maxTries; i++) {
    const st = await observe('clearOverlaysUI');
    if (st.gamePhase === 'ended' || st.hasEnd) return;

    // Tagesfazit hier = Anomalie (Auto-Feierabend hat gefeuert) — trotzdem behandeln.
    if (await clickButton(/Nächster Tag/i, { timeout: 400 })) {
      dayNotes.push('UNERWARTET: Tagesfazit während Morgen-Phase (Auto-Feierabend?)');
      await sleep(900); continue;
    }
    // Morgenbriefing (aria-label "Morgenbriefing weiter", Text "Verstanden ▸").
    if (await clickButton(/Morgenbriefing weiter|^Verstanden/i, { timeout: 400 })) { await sleep(450); dayNotes.push('Briefing bestätigt'); continue; }
    // Entscheidungs-Beat: Option A/B/C wählen (echte Spieler-Wahl), dann Quittung schließen.
    if (await clickButton(/^[ABC]\s*·\s/, { timeout: 400 })) {
      dayNotes.push('Entscheidungs-Beat: Option gewählt');
      await sleep(800);
      await clickButton(/ZURÜCK AN DIE ARBEIT/i, { timeout: 1500 });
      await sleep(450); continue;
    }
    if (await clickButton(/ZURÜCK AN DIE ARBEIT/i, { timeout: 300 })) { await sleep(450); continue; }
    // Abwehr-Stufen-Gegenmaßnahme: Quittung ("Weiter ▸") oder Verrat/Feedback.
    if (await clickButton(/^Weiter ▸$/i, { timeout: 300 })) { dayNotes.push('Gegenmaßnahme-Quittung geschlossen'); await sleep(450); continue; }
    if (await clickButton(/VERSTANDEN • FORTFAHREN|^VERSTANDEN$/i, { timeout: 300 })) { dayNotes.push('Ereignis-Modal bestätigt'); await sleep(450); continue; }
    if (await clickButton(/✕ SCHLIESSEN|^SCHLIESSEN$/i, { timeout: 300 })) { await sleep(450); continue; }
    // Laufender NPC-/Direktor-Dialog: Leertaste = Spieler-Weiterschalten.
    if (st.hasDialog) { await page.keyboard.press(' ').catch(() => {}); await sleep(400); continue; }
    // Generischer Modal-Fallback (deckt auch Krisen-Momente ab): oberste
    // Vollbild-Ebene finden, darin den besten Knopf MARKIEREN und dann mit einem
    // ECHTEN Playwright-Klick treffen (Text-Regex traf zuvor falsche Buttons —
    // Tag-6-Befund: Krisen-Modal blieb offen, weil /X/i woanders andockte).
    const generic = await page.evaluate(() => {
      const roots = [];
      for (const el of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(el);
        if (cs.position !== 'fixed' || cs.display === 'none' || cs.visibility === 'hidden') continue;
        const r = el.getBoundingClientRect();
        if (r.width < innerWidth * 0.9 || r.height < innerHeight * 0.9) continue;
        const z = parseInt(cs.zIndex, 10);
        if (!Number.isFinite(z) || z < 50) continue;
        if (roots.some((p) => p.contains(el))) continue;
        roots.push(el);
      }
      const top = roots.sort((a, b) => parseInt(getComputedStyle(b).zIndex, 10) - parseInt(getComputedStyle(a).zIndex, 10))[0];
      if (!top) return null;
      document.querySelectorAll('[data-verify-target]').forEach((n) => n.removeAttribute('data-verify-target'));
      const btns = [...top.querySelectorAll('button')].filter((b) => !b.disabled && b.offsetParent !== null);
      if (btns.length === 0) return null;
      // Spieler-Logik: verfügbare inhaltliche Wahl vor dem Schließen-Glyph („X"/„✕").
      const txt = (b) => (b.textContent || '').replace(/\s+/g, ' ').trim();
      const pick =
        btns.find((b) => txt(b).length > 2 && !/NICHT VERFÜGBAR|Unzureichende/i.test(txt(b)))
        ?? btns.find((b) => /^[X✕×]$/.test(txt(b)))
        ?? btns[0];
      pick.setAttribute('data-verify-target', '1');
      return { text: txt(pick).slice(0, 80) };
    }).catch(() => null);
    if (generic) {
      let ok = true;
      try { await page.locator('[data-verify-target="1"]').first().click({ timeout: 1500 }); } catch { ok = false; }
      if (ok) { dayNotes.push(`Generischer Modal-Klick: „${generic.text.slice(0, 60)}"`); await sleep(700); continue; }
      dayNotes.push(`Generischer Modal-Klick FEHLGESCHLAGEN auf „${generic.text.slice(0, 60)}"`);
    }
    return; // nichts mehr offen
  }
  dayNotes.push('WARNUNG: clearOverlaysUI hat maxTries erreicht (Overlay-Schleife?)');
}

/** Auf eine Bedingung warten; pollt zustandslesend, Stall-Uhr läuft mit. */
async function waitState(pred, { timeoutMs, label, pollMs = 700 }) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const st = await observe(label);
    if (pred(st)) return st;
    await sleep(pollMs);
  }
  return null;
}

/** Bis zu N billige Aktionen über das Terminal (Taste A → AUSFÜHREN) spielen. */
async function playCheapActions(n, dayNotes) {
  for (let i = 0; i < n; i++) {
    await page.keyboard.press('a').catch(() => {});
    await sleep(1200);
    const executed = await clickButton(/^AUSFÜHREN/i, { timeout: 2500 });
    if (!executed) {
      dayNotes.push('Terminal: kein AUSFÜHREN-Knopf (AP/Budget erschöpft?)');
      await page.keyboard.press('Escape').catch(() => {});
      await sleep(400);
      return i;
    }
    dayNotes.push('Aktion über Terminal ausgeführt');
    await sleep(1500);
    await clickButton(/^VERSTANDEN$|verstanden|schließen/i, { timeout: 2000 });
    await sleep(500);
    // Terminal schließt sich nach AUSFÜHREN normalerweise selbst; falls nicht: A togglet zu.
    const terminalOffen = await page.evaluate(() => !!document.querySelector('[data-testid="terminal-view"]')).catch(() => false);
    if (terminalOffen) { await page.keyboard.press('a').catch(() => {}); await sleep(400); }
  }
  return n;
}

/**
 * Feierabend über die ECHTE Spieler-Affordanz:
 * Taste F → Fahrstuhl-Tableau → Option „Ihr Büro" → Ankunft (viewMode 'office')
 * → Knopf „FEIERABEND →". Liefert 'ui' | 'workaround' | null.
 */
async function feierabendViaUI(day, dayNotes) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    let st = await observe('feierabend:start');
    if (st.viewMode !== 'office') {
      await page.keyboard.press('f').catch(() => {});
      await sleep(800);
      const opt = page.getByRole('option', { name: /Ihr Büro/i }).first();
      let clicked = true;
      try { await opt.click({ timeout: 2500 }); } catch { clicked = false; }
      if (!clicked) {
        dayNotes.push(`Versuch ${attempt}: Etagen-Tableau/Option „Ihr Büro" nicht klickbar`);
        await page.keyboard.press('Escape').catch(() => {});
        await clearOverlaysUI(dayNotes, { maxTries: 6 });
        continue;
      }
      // Ankunft abwarten — der Avatar läuft/fährt echt (kostet Spielzeit + Echtzeit).
      st = await waitState((s) => s.viewMode === 'office' || s.hasEnd, { timeoutMs: 40000, label: 'feierabend:ankunft-buero' });
      if (!st) {
        dayNotes.push(`Versuch ${attempt}: Büro-Ankunft nicht bestätigt (viewMode blieb != office)`);
        await clearOverlaysUI(dayNotes, { maxTries: 6 });
        continue;
      }
      if (st.hasEnd) return 'ui';
    }
    // Im Büro: FEIERABEND drücken.
    const pressed = await clickButton(/FEIERABEND/i, { timeout: 3000 });
    if (!pressed) {
      dayNotes.push(`Versuch ${attempt}: FEIERABEND-Knopf nicht klickbar (Büro offen?)`);
      await clearOverlaysUI(dayNotes, { maxTries: 6 });
      continue;
    }
    // Heimweg → Tagesfazit (Knopf „Nächster Tag ▸").
    const t0 = Date.now();
    while (Date.now() - t0 < 45000) {
      await observe('feierabend:heimweg');
      if (await page.getByRole('button', { name: /Nächster Tag/i }).first().isVisible().catch(() => false)) return 'ui';
      const s2 = await readState();
      if (s2.hasEnd || s2.gamePhase === 'ended') return 'ui';
      await sleep(800);
    }
    dayNotes.push(`Versuch ${attempt}: Tagesfazit erschien nach FEIERABEND nicht binnen 45 s`);
  }

  // UI objektiv gescheitert → HAUPTBEFUND + markierter Workaround über den Test-Hook.
  const shotPath = await shot(`tag${String(day).padStart(2, '0')}_feierabend_FEHLT`);
  const dump = await domDump(`tag${day}_feierabend_fehlt`);
  finding('hoch', `Tag ${day}: Feierabend über die UI nicht erreichbar (2 Versuche: Tableau→Büro→FEIERABEND)`, { screenshot: shotPath, domDump: path.basename(dump), day });
  report.workaroundsUsed++;
  dayNotes.push('WORKAROUND: __VQA__.requestEndDay() (Test-Hook, KEINE Spieler-Affordanz)');
  await page.evaluate(() => window.__VQA__?.requestEndDay?.()).catch(() => {});
  const t0 = Date.now();
  while (Date.now() - t0 < 45000) {
    await observe('feierabend:workaround');
    if (await page.getByRole('button', { name: /Nächster Tag/i }).first().isVisible().catch(() => false)) return 'workaround';
    const s2 = await readState();
    if (s2.hasEnd || s2.gamePhase === 'ended') return 'workaround';
    await sleep(800);
  }
  return null;
}

// ── Hauptlauf ────────────────────────────────────────────────────────────────
try {
  console.log(`UI-Marathon → ${OUT}\nBasis: ${BASE}?vqa=1 (Hook NUR lesend)`);
  await page.goto(`${BASE}/?vqa=1`, { waitUntil: 'networkidle' }).catch(() => {});
  await page.evaluate(() => localStorage.clear()).catch(() => {});
  await page.reload({ waitUntil: 'networkidle' }).catch(() => {});
  await sleep(1500);
  await shot('00_title');

  // Intro per Klicks (Muster t3-runthrough/harvest, aber ohne Steuer-Hooks).
  await clickButton(/NEUE MISSION/i, { timeout: 5000 });
  await sleep(900);
  await page.locator('button[aria-label*="(männlich)"]').nth(1).click({ timeout: 2500 }).catch(() => {});
  await page.locator('input[aria-label="Ihr Name"]').fill('Marathon').catch(() => {});
  await clickButton(/MISSION BEGINNEN/i, { timeout: 2500 });
  await sleep(1400);
  await clickButton(/Sequenz überspringen|Überspringen/i, { timeout: 4000 });
  await sleep(1000);
  await clickButton(/AKTE ÜBERNEHMEN/i, { timeout: 4000 });
  await sleep(1800);

  // Direktor-Intro-Dialog per Leertaste durchschalten (Spieler-Affordanz).
  for (let i = 0; i < 30; i++) {
    const st = await observe('intro:dialoge');
    if (!st.hasDialog) break;
    await page.keyboard.press(' ').catch(() => {});
    await sleep(400);
  }
  // Auftragswahl: Karte „Der Keil" + „… beginnen" (t3-Muster).
  await clickButton(/der keil|einstieg/i, { timeout: 3000 });
  await sleep(600);
  await clickButton(/beginnen/i, { timeout: 3000 });
  await sleep(1200);
  await shot('01_nach_auftrag');

  let st = await observe('intro:fertig');
  if (st.day !== 1) finding('mittel', `Nach Intro ist der Engine-Tag ${st.day} statt 1`, { day: st.day });
  report.lastDaySeen = st.day ?? 0;

  // ── Tagesschleife ──
  for (let guard = 0; guard < TARGET_DAY + 10; guard++) {
    st = await observe('tagesschleife:kopf');
    const day = st.day ?? report.lastDaySeen;
    report.lastDaySeen = day;
    const dayRec = { day, startMinutes: st.minutes, notes: [], method: null, ms: 0, ok: false };
    const dayT0 = Date.now();
    report.perDay.push(dayRec);
    console.log(`— Tag ${day} (Spielzeit ${st.minutes} min, ${Math.round((Date.now() - startedAt) / 1000)}s Echtzeit) —`);

    if (st.gamePhase === 'ended' || st.hasEnd) { report.stopReason = 'gameEnd'; break; }
    if (day > TARGET_DAY) { report.stopReason = `Tag ${day} > Ziel ${TARGET_DAY} ohne Ende (Befund!)`; break; }

    // 1) Morgen-Overlays über sichtbare Knöpfe schließen.
    await clearOverlaysUI(dayRec.notes);

    // 2) Feierabend über die echte Spieler-Affordanz herbeiführen.
    let method = await feierabendViaUI(day, dayRec.notes);
    if (method === null) {
      // Auch der Workaround kam nicht durch → bis zu 2 billige Aktionen spielen
      // (Zeit verbrauchen) und ein letztes Mal versuchen.
      await playCheapActions(2, dayRec.notes);
      method = await feierabendViaUI(day, dayRec.notes);
    }
    dayRec.method = method;
    if (method === null) {
      const s = await shot(`tag${String(day).padStart(2, '0')}_blockiert`);
      await domDump(`tag${day}_blockiert`);
      finding('hoch', `Tag ${day}: Tageswechsel weder über UI noch über Workaround erreichbar — Abbruch`, { screenshot: s, day });
      report.stopReason = `Tag ${day}: Tageswechsel unerreichbar`;
      break;
    }

    // 3) Spielende erreicht? (Wahlabend statt Fazit)
    st = await readState();
    if (st.hasEnd || st.gamePhase === 'ended') {
      report.gameEnd = st.endInfo;
      dayRec.ok = true;
      dayRec.ms = Date.now() - dayT0;
      report.stopReason = 'gameEnd';
      break;
    }

    // 4) Tagesfazit: erschien (Assertion), unteres Ende ansehen, „Nächster Tag ▸".
    const fazitDa = await page.getByRole('button', { name: /Nächster Tag/i }).first().isVisible().catch(() => false);
    if (!fazitDa) {
      const s = await shot(`tag${String(day).padStart(2, '0')}_fazit_fehlt`);
      finding('hoch', `Tag ${day}: Tagesfazit nicht sichtbar, obwohl Feierabend-Pfad '${method}' meldete`, { screenshot: s, day });
    }
    await page.mouse.move(640, 360).catch(() => {});
    await page.mouse.wheel(0, 4000).catch(() => {});
    await sleep(400);
    if (!(await clickButton(/Nächster Tag/i, { timeout: 4000 }))) {
      // Sichtbar, aber verdeckt (z. B. Krisen-Modal über dem Fazit): erst räumen, dann erneut.
      dayRec.notes.push('„Nächster Tag" beim 1. Versuch nicht klickbar — Overlay-Räumung + Retry');
      await clearOverlaysUI(dayRec.notes, { maxTries: 8 });
      await clickButton(/Nächster Tag/i, { timeout: 4000 });
    }

    // 5) Assertion: Tag+1 (oder Spielende am Wahltag).
    const next = await waitState((s) => s.day === day + 1 || s.hasEnd || s.gamePhase === 'ended', { timeoutMs: 20000, label: 'tageswechsel' });
    if (!next) {
      const s = await shot(`tag${String(day).padStart(2, '0')}_kein_tagplus1`);
      await domDump(`tag${day}_kein_tagplus1`);
      finding('hoch', `Tag ${day}: Nach „Nächster Tag" wurde weder Tag ${day + 1} noch ein Spielende erreicht`, { screenshot: s, day });
      report.stopReason = `Tag ${day}: Tag+1 blieb aus`;
      break;
    }
    dayRec.ok = true;
    dayRec.ms = Date.now() - dayT0;
    if (next.hasEnd || next.gamePhase === 'ended') {
      report.gameEnd = next.endInfo;
      report.daysCompleted++;
      report.stopReason = 'gameEnd';
      break;
    }
    report.daysCompleted++;
    report.lastDaySeen = next.day;

    // Screenshot alle 5 Tage.
    if (day % 5 === 0) await shot(`tag${String(day).padStart(2, '0')}_abgeschlossen`);
  }

  // Wahlabend/Endscreen dokumentieren (best effort, per Klicks wie ein Spieler).
  st = await readState();
  if (st.hasEnd || st.gamePhase === 'ended') {
    report.gameEnd = st.endInfo ?? report.gameEnd;
    await shot('99_wahlabend_0');
    for (let s = 1; s <= 3; s++) { await page.mouse.click(640, 300).catch(() => {}); await sleep(1100); }
    await shot('99_wahlabend_3');
    await clickButton(/WEITER/i, { timeout: 3000 });
    await sleep(1500);
    await shot('99_gameend');
  }
  if (!report.stopReason) report.stopReason = 'Schleifen-Guard erreicht';
} catch (e) {
  const s = await shot('ERR_stall_oder_zeitbox');
  const dump = await domDump('err_stall');
  if (e instanceof StallError) {
    finding('hoch', `Abbruch: ${e.message}`, { screenshot: s, domDump: path.basename(dump) });
    report.stopReason = e.message;
  } else {
    finding('hoch', `Unerwartete Harness-Exception: ${e.message}`, { screenshot: s, domDump: path.basename(dump), stack: String(e.stack).slice(0, 800) });
    report.stopReason = `Exception: ${e.message}`;
  }
}

report.finishedAt = new Date().toISOString();
report.elapsedMin = Math.round((Date.now() - startedAt) / 6000) / 10;
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log(`\nFERTIG: ${report.daysCompleted} Tage abgeschlossen (letzter Tag ${report.lastDaySeen}), Stop: ${report.stopReason}`);
console.log(`Ende: ${JSON.stringify(report.gameEnd)} · Workarounds: ${report.workaroundsUsed} · Befunde: ${report.findings.length} · Konsolen-Fehler: ${report.consoleErrors.length}`);
console.log(`Report: ${path.join(OUT, 'report.json')}`);
await browser.close();
process.exit(0);
