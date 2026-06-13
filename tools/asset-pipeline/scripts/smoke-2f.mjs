// 2f-Smoke: Büro betreten → Pinnwand-Hotspot → Narrativ-Tafel → Karte anheften.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { RUNS_DIR } from '../src/paths.mjs';

const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = path.join(RUNS_DIR, 'smoke-2f');
fs.mkdirSync(OUT, { recursive: true });
const URL = process.env.SMOKE_URL || 'http://localhost:4174/';

const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
const shot = (n) => page.screenshot({ path: path.join(OUT, n) });
const clickByText = async (re) => {
  for (const el of await page.getByRole('button').all()) {
    const t = (await el.textContent().catch(() => '')) || '';
    if (re.test(t)) { await el.click({ timeout: 1500 }).catch(() => {}); return t.trim(); }
  }
  return null;
};

await page.goto(URL, { waitUntil: 'networkidle' }).catch(() => {});
await page.waitForTimeout(700);
await clickByText(/neue mission|mission starten/i);
await page.waitForTimeout(500);
await page.locator('img, button').first().click({ timeout: 1500 }).catch(() => {});
for (const inp of await page.locator('input[type="text"], input:not([type])').all()) await inp.fill('Tester').catch(() => {});
await clickByText(/beginnen|starten|los|weiter|bestätig/i);
await page.waitForTimeout(600);
// Dialoge mit Leertaste durchschalten (KEIN Escape — würde pausieren)
for (let i = 0; i < 14; i++) { await page.keyboard.press('Space').catch(() => {}); await page.waitForTimeout(220); }
await clickByText(/fortsetzen/i).catch(() => {}); // Sicherheit, falls doch pausiert
await page.waitForTimeout(300);

// Ins Büro: Etagen-Tableau (F) → „Ihr Büro" per Hotkey 7 (deterministisch)
await page.keyboard.press('f').catch(() => {});
await page.waitForTimeout(600);
const dirCount = await page.locator('[data-testid="floor-directory"]').count();
await shot('00_directory.png');
await page.keyboard.press('7').catch(() => {});
// Laufweg + Fahrstuhl abwarten, bis der Büro-Hotspot da ist
await page.waitForSelector('[aria-label="NARRATIV-TAFEL"]', { timeout: 12000 }).catch(() => {});
await page.waitForTimeout(500);
await shot('01_office.png');
const hotspotCount = await page.locator('[aria-label="NARRATIV-TAFEL"]').count();
console.log('directory:', dirCount, 'office-hotspot:', hotspotCount);

// Pinnwand-Hotspot → Narrativ-Tafel
await page.locator('[aria-label="NARRATIV-TAFEL"]').click({ timeout: 3000 }).catch(() => {});
await page.waitForTimeout(700);
await shot('02_board.png');
const boardCount = await page.locator('[data-testid="narrative-board"]').count();

// Erste Karte anheften
await clickByText(/anheften/i);
await page.waitForTimeout(500);
await shot('03_pinned.png');

fs.writeFileSync(path.join(OUT, 'console-errors.txt'), errors.join('\n') || '(keine)');
console.log('2f-Smoke fertig. board:', boardCount, 'Konsolen-Fehler:', errors.length);
for (const e of errors.slice(0, 10)) console.log('  -', e.slice(0, 160));
await browser.close();
