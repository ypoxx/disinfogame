// Navigations-Audit (PLAN 2026-07-07 NAV-Entschlackung): fotografiert die
// Chrome-/Navigations-Zustände einer frischen Partie und prüft die Kern-DoD:
//   - FEIERABEND sichtbar & klickbar, Tagesuhr lesbar (kein Überlapp oben rechts)
//   - Hotspot-Polygone liegen in allen Layout-Zuständen auf den Möbeln
//   - Klick auf den Wand-Monitor öffnet das LAGEBILD
//   - Tafel ohne Zweitkatalog, Panel ohne Tab-Bar, kein Chrome über Overlays
//
// Lauf:  npm run dev -- --port 5173 &   (oder preview)
//        node scripts/visual-review/nav-audit.mjs [--url http://localhost:5173]
// Ausgabe: runs/nav-audit/<shots>.png + Konsolen-Checks (JA/NEIN).
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const argUrl = process.argv.indexOf('--url');
const BASE = argUrl !== -1 ? process.argv[argUrl + 1] : 'http://localhost:5173';
const OUT = path.join(ROOT, 'runs', 'nav-audit');
mkdirSync(OUT, { recursive: true });

const EXECUTABLE = process.env.PLAYWRIGHT_CHROMIUM ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const vqa = (page, fn, ...args) => page.evaluate(fn, ...args);
const results = [];
function check(name, ok) {
  results.push({ name, ok });
  console.log(`${ok ? '✔' : '✘'} ${name}`);
}

async function clickButton(page, re, { timeout = 2500 } = {}) {
  try { await page.getByRole('button', { name: re }).first().click({ timeout }); return true; }
  catch { return false; }
}

async function dismissAll(page, { maxTries = 16 } = {}) {
  for (let i = 0; i < maxTries; i++) {
    if (await clickButton(page, /NÄCHSTER TAG/i, { timeout: 400 })) { await sleep(900); continue; }
    if (await clickButton(page, /Morgenbriefing weiter|^Verstanden/i, { timeout: 400 })) { await sleep(400); continue; }
    const hasDialog = await vqa(page, () => !!window.__VQA__?.hasDialog).catch(() => false);
    if (hasDialog) {
      await page.keyboard.press(' ').catch(() => {});
      await sleep(350);
      const st2 = await vqa(page, () => !!window.__VQA__?.hasDialog).catch(() => false);
      if (st2) await vqa(page, () => window.__VQA__.dismissDialog()).catch(() => {});
      await sleep(350);
      continue;
    }
    // Offene Funktions-Views schließen (wie harvest.mjs) — ein hängengebliebenes
    // Lagebild/Board machte die Folge-Checks sonst falsch-negativ (Review-Befund).
    await vqa(page, () => {
      const ui = window.__VQA__?.ui;
      if (!ui) return;
      ui.setShowNewsroom(false); ui.setShowPreTest(false); ui.setShowOperationsAkte(false);
      ui.setShowFokusgruppe(false); ui.setShowLagebild(false); ui.setShowBoard(false);
    }).catch(() => {});
    return;
  }
}

/** Bild-Koordinate (room_spieler_buero, 1344×768) → Seiten-Koordinate über das SVG-Overlay. */
async function officePoint(page, ix, iy) {
  return vqa(page, ([x, y]) => {
    const svg = document.querySelector('svg[viewBox="0 0 1344 768"]');
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    return { x: r.x + (x / 1344) * r.width, y: r.y + (y / 768) * r.height };
  }, [ix, iy]);
}

async function shot(page, id) {
  await page.screenshot({ path: path.join(OUT, `${id}.png`) });
  console.log('  shot:', id);
}

const browser = await chromium.launch({ executablePath: EXECUTABLE });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(e.message));

// Scheitert der Vorlauf (z. B. umbenannter Intro-Knopf → __VQA__.ui fehlt), soll das
// Skript geordnet mit ✘-Summary enden statt mit Stacktrace + Chromium-Leiche.
try {

// Frische Partie bis ins Büro
await page.goto(`${BASE}/?vqa=1`, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear()).catch(() => {});
await page.reload({ waitUntil: 'networkidle' });
await sleep(1200);
await clickButton(page, /NEUE MISSION/i);
await sleep(700);
await page.locator('button[aria-label*="(männlich)"]').nth(1).click({ timeout: 2000 }).catch(() => {});
await clickButton(page, /MISSION BEGINNEN/i);
await sleep(1400);
await clickButton(page, /Sequenz überspringen|Überspringen/i);
await sleep(900);
await clickButton(page, /AKTE ÜBERNEHMEN/i);
await sleep(1800);
await dismissAll(page);
await vqa(page, () => window.__VQA__.setMinutes(120)).catch(() => {});
await vqa(page, () => window.__VQA__.ui.setViewMode('office'));
await sleep(1200);

// ── DoD 1: FEIERABEND sichtbar/klickbar, Uhr lesbar ──────────────────────────
const feierabend = page.getByRole('button', { name: /FEIERABEND/ });
check('FEIERABEND sichtbar', await feierabend.isVisible().catch(() => false));
const clockVisible = await vqa(page, () => {
  const el = [...document.querySelectorAll('div,span')].find((n) => /^\d{2}:\d{2}$/.test(n.textContent?.trim() ?? ''));
  if (!el) return false;
  const r = el.getBoundingClientRect();
  const topEl = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
  return !!topEl && (el === topEl || el.contains(topEl) || topEl.contains(el));
});
check('Tagesuhr lesbar (nicht überdeckt)', clockVisible);
await shot(page, '01_office_default');

// ── DoD 2: Wand-Monitor-Klick öffnet LAGEBILD (Polygon-Treffer) ───────────────
const monitorPt = await officePoint(page, 373, 290);
if (monitorPt) {
  await page.mouse.click(monitorPt.x, monitorPt.y);
  await sleep(800);
  const open = (await page.getByText(/LAGEBILD — TAG/).count()) > 0;
  check('Wand-Monitor öffnet Lagebild', open);
  const altVokabular = (await page.getByText(/RISIKO|AUFMERKSAMKEIT|Informationslast/i).count()) === 0;
  check('Lagebild ohne Alt-Vokabular (Risiko/Aufmerksamkeit/Informationslast)', altVokabular);
  check('Lagebild zeigt DAS RENNEN', (await page.getByText('DAS RENNEN').count()) > 0);
  await shot(page, '02_lagebild');
  await page.keyboard.press('Escape');
  await sleep(400);
} else {
  check('Wand-Monitor öffnet Lagebild', false);
}

// ── DoD 3: Terminal → Anheften → Badge an der Tafel → Tafel ohne Katalog ─────
await page.keyboard.press('a');
await sleep(1000);
const chromeHidden = await vqa(page, () => {
  // Berater-Leiste + Eck-Cluster dürfen NICHT über dem Terminal liegen.
  const advisor = document.querySelector('[title="Berater ausklappen"], [aria-label*="Berater"]');
  const hud = [...document.querySelectorAll('button')].find((b) => /HUD · H/.test(b.textContent ?? ''));
  return !advisor && !hud;
});
check('Kein Dauer-Chrome über dem Terminal', chromeHidden);
await shot(page, '03_terminal');
const pinned = await clickButton(page, /ANHEFTEN/i, { timeout: 2500 });
check('Terminal: Maßnahme angeheftet', pinned);
await page.keyboard.press('a');
await sleep(600);
await shot(page, '04_office_badge');

// Tafel öffnen (Korkbrett-Polygon: Bild 548,370)
const boardPt = await officePoint(page, 548, 370);
if (boardPt) {
  await page.mouse.click(boardPt.x, boardPt.y);
  await sleep(900);
  const boardOpen = (await page.getByText('NARRATIV-TAFEL').count()) > 0;
  check('Korkbrett öffnet Narrativ-Tafel', boardOpen);
  check('Tafel ohne Zweitkatalog (kein MASSNAHMEN-Deck)', (await page.getByText(/MASSNAHMEN — je Büro/).count()) === 0);
  check('Tafel zeigt Wettrennen-Notizen', (await page.locator('[data-testid="board-sonntagsfrage"]').count()) > 0);
  check('Tafel: angeheftete Karte sichtbar', pinned ? (await page.locator('[data-testid="narrative-board"] button[aria-label*="lösen"]').count()) > 0 : true);
  await shot(page, '05_board');
  await page.keyboard.press('Escape');
  await sleep(400);
} else {
  check('Korkbrett öffnet Narrativ-Tafel', false);
}

// ── DoD 4: Seitenpanel ohne Tab-Bar ───────────────────────────────────────────
await page.keyboard.press('n');
await sleep(700);
// Im PANEL suchen (nicht seitenweit): das Telefon-Polygon trägt aria/title „KONTAKTE".
check('Seitenpanel ohne Tab-Bar (kein KONTAKTE-Reiter)',
  (await page.locator('.animate-slide-in-right').getByText('KONTAKTE', { exact: true }).count()) === 0);
await shot(page, '06_panel');
await page.keyboard.press('n');
await sleep(300);

// ── DoD 5: HUD = vier Größen, kein Ziel-Tracker ──────────────────────────────
await page.keyboard.press('h');
await sleep(600);
check('HUD ohne Ziel-Tracker (kein „Aktuelles Ziel")', (await page.getByText('Aktuelles Ziel').count()) === 0);
check('HUD zeigt SONNTAGSFRAGE', (await page.getByText('SONNTAGSFRAGE').count()) > 0);
await shot(page, '07_hud');
await page.keyboard.press('h');

check('Keine Seiten-Fehler (pageerror)', pageErrors.length === 0);
if (pageErrors.length) console.log('pageerrors:', pageErrors.slice(0, 5));

} catch (err) {
  console.error('Audit-Ablauf abgebrochen:', err?.message ?? err);
  check('Audit-Ablauf ohne Absturz', false);
} finally {
  await browser.close().catch(() => {});
}
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} Checks bestanden.`);
process.exit(failed.length ? 1 : 0);
