// CHAOS-MONKEY (Verify-Suite, 2026-07-13) — seeded Input-Sturm gegen das Spiel.
// ==============================================================================
// mulberry32-geseedeter Zufalls-Input: 60 % Zufallsklick im Viewport, 30 % Hotkey
// aus dem echten Spieler-Set, 10 % Mausrad. Alle 15 Schritte Invarianten-Check:
//   I1: höchstens 1 Modal-EBENE sichtbar. Heuristik aus dem Code abgeleitet:
//       PixelModal & Co. sind `position:fixed`-Vollbild-Container (inset-0) mit
//       zIndex ≥ 50 und Abdunklungs-Backdrop bzw. role="dialog" (AuftragSelect,
//       WahlabendScene, FokusgruppeView, …). Gezählt werden nur Wurzeln
//       (keine verschachtelten Treffer).
//   I2: Seite lebt — ein injizierter rAF-Zähler wächst zwischen den Checks.
//   I3: keine NEUEN pageerror/console-error seit dem letzten Check.
//   I4: window.__VQA__ bleibt lesbar (getMinutes liefert eine Zahl).
// Verletzung → {seed, schritt, invariante, detail, screenshot, letzte 30 Events}
// nach runs/verify-suite/chaos/ schreiben und WEITERLAUFEN (sammeln, nicht abbrechen).
//
// 3 Seeds (7, 1337, 90210) × ~4 Minuten. Startzustand je Seed: frische Partie bis
// ins Gebäude (newGameToBuilding-Muster aus scripts/visual-review/harvest.mjs).
//
// Lauf:   node scripts/verify-suite/chaos-monkey.mjs [--url http://localhost:4173]
//         [--seeds 7,1337,90210] [--minutes 4]
// Output: runs/verify-suite/chaos/report.json + violation_*.json + shots
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'runs', 'verify-suite', 'chaos');
fs.mkdirSync(OUT, { recursive: true });

const argOf = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
};
const BASE = argOf('url', 'http://localhost:4173');
const SEEDS = argOf('seeds', '7,1337,90210').split(',').map(Number);
const MINUTES_PER_SEED = Number(argOf('minutes', '4'));
const EXE = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const VIEW = { width: 1280, height: 720 };
const CHECK_EVERY = 15;

// Hotkey-Set: echte Spieler-Tasten (s. StoryModeGame-Shortcuts + Dialog-Space).
const HOTKEYS = ['a', 't', 'b', 'f', 'm', 'n', 'e', 'i', 'h', '?', 'Escape', 'Enter', 'Space', 'ArrowLeft', 'ArrowRight'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Seeded PRNG (mulberry32) ─────────────────────────────────────────────────
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Browser-Helfer (newGameToBuilding-Muster aus harvest.mjs) ────────────────
async function clickButton(page, re, { timeout = 2500 } = {}) {
  const btn = page.getByRole('button', { name: re }).first();
  try { await btn.click({ timeout }); return true; } catch { return false; }
}

async function newGameToBuilding(page) {
  await clickButton(page, /NEUE MISSION/i, { timeout: 6000 });
  await sleep(700);
  await page.locator('button[aria-label*="(männlich)"]').nth(1).click({ timeout: 2000 }).catch(() => {});
  await page.locator('input[aria-label="Ihr Name"]').fill('Chaos').catch(() => {});
  await clickButton(page, /MISSION BEGINNEN/i);
  await sleep(1400);
  await clickButton(page, /Sequenz überspringen|Überspringen/i, { timeout: 4000 });
  await sleep(900);
  await clickButton(page, /AKTE ÜBERNEHMEN/i, { timeout: 4000 });
  await sleep(1800);
  // Intro-Dialoge per Leertaste durch; Auftrag wählen, damit das freie Spiel steht.
  for (let i = 0; i < 24; i++) {
    const hasDialog = await page.evaluate(() => !!window.__VQA__?.hasDialog).catch(() => false);
    if (!hasDialog) break;
    await page.keyboard.press(' ').catch(() => {});
    await sleep(350);
  }
  await clickButton(page, /der keil|einstieg/i, { timeout: 2500 });
  await sleep(500);
  await clickButton(page, /beginnen/i, { timeout: 2500 });
  await sleep(1000);
  await clickButton(page, /Morgenbriefing weiter|^Verstanden/i, { timeout: 1500 });
  await sleep(400);
}

// I1-Heuristik: Modal-EBENEN zählen (fixe Vollbild-Wurzeln mit Backdrop/role=dialog).
const countModalLayersFn = () => {
  const roots = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' || cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width < innerWidth * 0.9 || r.height < innerHeight * 0.9) continue;
    const z = parseInt(cs.zIndex, 10);
    if (!Number.isFinite(z) || z < 50) continue;
    const isDialog = el.getAttribute('role') === 'dialog';
    const m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/);
    const alpha = m ? (m[1].split(',')[3] !== undefined ? parseFloat(m[1].split(',')[3]) : 1) : 0;
    if (!isDialog && alpha < 0.05) continue; // reine Layout-Fixed-Container ohne Backdrop
    if (roots.some((p) => p.el.contains(el))) continue;
    roots.push({ el, z, role: el.getAttribute('role') || null });
  }
  return roots.map((r) => ({
    z: r.z,
    role: r.role,
    cls: String(r.el.className || '').slice(0, 80),
    text: (r.el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100),
  }));
};

// ── Ein Seed-Lauf ────────────────────────────────────────────────────────────
async function runSeed(browser, seed) {
  const rng = mulberry32(seed);
  const ctx = await browser.newContext({ viewport: VIEW });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e.message).slice(0, 300)));

  await page.goto(`${BASE}/?vqa=1`, { waitUntil: 'networkidle' }).catch(() => {});
  await page.evaluate(() => localStorage.clear()).catch(() => {});
  await page.reload({ waitUntil: 'networkidle' }).catch(() => {});
  await sleep(1200);
  await newGameToBuilding(page);
  await page.screenshot({ path: path.join(OUT, `seed${seed}_start.png`) }).catch(() => {});

  // I2: rAF-Zähler injizieren (überlebt KEINE Navigation — wird je Check re-injiziert).
  const injectRaf = () => page.evaluate(() => {
    if (window.__chaosRaf === undefined) {
      window.__chaosRaf = 0;
      const loop = () => { window.__chaosRaf++; requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
  }).catch(() => {});
  await injectRaf();

  const events = [];           // Ring-Puffer der letzten 30 Eingaben
  const violations = [];
  let errorsSeen = 0;
  let lastRaf = -1;
  let steps = 0;
  const t0 = Date.now();

  const pushEvent = (kind, detail) => {
    events.push({ step: steps, kind, detail, t: Date.now() - t0 });
    if (events.length > 30) events.shift();
  };

  const recordViolation = async (invariant, detail) => {
    const id = `seed${seed}_step${steps}_${invariant}`;
    const shotFile = path.join(OUT, `violation_${id}.png`);
    await page.screenshot({ path: shotFile }).catch(() => {});
    const v = { seed, step: steps, invariant, detail, screenshot: path.basename(shotFile), last30Events: [...events], at: new Date().toISOString() };
    fs.writeFileSync(path.join(OUT, `violation_${id}.json`), JSON.stringify(v, null, 2));
    violations.push(v);
    console.log(`  [VERLETZUNG] seed=${seed} step=${steps} ${invariant}: ${String(detail).slice(0, 140)}`);
  };

  while (Date.now() - t0 < MINUTES_PER_SEED * 60 * 1000) {
    steps++;
    const roll = rng();
    try {
      if (roll < 0.6) {
        const x = Math.floor(rng() * VIEW.width);
        const y = Math.floor(rng() * VIEW.height);
        pushEvent('click', `${x},${y}`);
        await page.mouse.click(x, y, { delay: 20 }).catch(() => {});
      } else if (roll < 0.9) {
        const key = HOTKEYS[Math.floor(rng() * HOTKEYS.length)];
        pushEvent('key', key);
        await page.keyboard.press(key).catch(() => {});
      } else {
        const dy = Math.floor((rng() - 0.5) * 1600);
        pushEvent('wheel', String(dy));
        await page.mouse.move(Math.floor(rng() * VIEW.width), Math.floor(rng() * VIEW.height)).catch(() => {});
        await page.mouse.wheel(0, dy).catch(() => {});
      }
    } catch { /* Eingabe darf scheitern — der Sturm läuft weiter */ }
    await sleep(90);

    if (steps % CHECK_EVERY === 0) {
      // I4: __VQA__ lesbar.
      const vqaOk = await page.evaluate(() => {
        try { return typeof window.__VQA__?.getMinutes === 'function' && Number.isFinite(window.__VQA__.getMinutes()); }
        catch { return false; }
      }).catch(() => null);
      if (vqaOk !== true) await recordViolation('I4_vqa_unlesbar', `evaluate lieferte ${vqaOk}`);

      // I2: rAF-Zähler wächst.
      await injectRaf();
      const raf = await page.evaluate(() => window.__chaosRaf ?? -1).catch(() => -1);
      if (raf !== -1 && lastRaf !== -1 && raf <= lastRaf) {
        await recordViolation('I2_raf_steht', `rAF-Zähler ${lastRaf} -> ${raf}`);
      }
      lastRaf = raf;

      // I3: keine neuen Fehler.
      if (errors.length > errorsSeen) {
        await recordViolation('I3_neue_fehler', errors.slice(errorsSeen).join(' | ').slice(0, 500));
        errorsSeen = errors.length;
      }

      // I1: höchstens 1 Modal-Ebene.
      const layers = await page.evaluate(countModalLayersFn).catch(() => null);
      if (Array.isArray(layers) && layers.length > 1) {
        await recordViolation('I1_modal_stapel', JSON.stringify(layers));
      }
    }
  }

  const endState = await page.evaluate(() => ({
    day: (() => { try { return window.__VQA__?.engine?.getCurrentPhase?.().number ?? null; } catch { return null; } })(),
    gamePhase: window.__VQA__?.gamePhase ?? null,
    minutes: (() => { try { return window.__VQA__?.getMinutes?.() ?? null; } catch { return null; } })(),
  })).catch(() => null);
  await page.screenshot({ path: path.join(OUT, `seed${seed}_end.png`) }).catch(() => {});
  await ctx.close();
  return { seed, steps, violations: violations.length, byInvariant: violations.reduce((m, v) => { m[v.invariant] = (m[v.invariant] || 0) + 1; return m; }, {}), consoleErrorsTotal: errors.length, consoleErrorSample: errors.slice(0, 5), endState };
}

// ── Hauptlauf (Seeds NACHEINANDER — 4 Kerne, keine Parallel-Läufe) ───────────
const browser = await chromium.launch({ executablePath: EXE });
console.log(`Chaos-Monkey → ${OUT}\nBasis: ${BASE} · Seeds: ${SEEDS.join(', ')} · ${MINUTES_PER_SEED} min/Seed`);
const results = [];
for (const seed of SEEDS) {
  console.log(`— Seed ${seed} —`);
  results.push(await runSeed(browser, seed));
}
const report = { finishedAt: new Date().toISOString(), url: BASE, minutesPerSeed: MINUTES_PER_SEED, results };
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
console.log('\nFERTIG:');
for (const r of results) {
  console.log(`  seed=${r.seed}: ${r.steps} Schritte, ${r.violations} Verletzungen ${JSON.stringify(r.byInvariant)}, Konsolen-Fehler gesamt ${r.consoleErrorsTotal}, Ende ${JSON.stringify(r.endState)}`);
}
console.log(`Report: ${path.join(OUT, 'report.json')}`);
await browser.close();
process.exit(0);
