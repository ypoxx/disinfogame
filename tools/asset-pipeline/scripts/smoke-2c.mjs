// Gezielter 2c-Smoke: Intro durchklicken → Gebäude-Ansicht (kein Tab-Umschalter,
// ETAGEN-Plakette am Fahrstuhl) → Taste F → Etagen-Tableau. Schreibt Screenshots.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { RUNS_DIR } from '../src/paths.mjs';

const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = path.join(RUNS_DIR, 'smoke-2c');
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
// Avatar-Wahl: Porträt + Name + Bestätigen
await page.locator('img, button').first().click({ timeout: 1500 }).catch(() => {});
for (const inp of await page.locator('input[type="text"], input:not([type])').all()) await inp.fill('Tester').catch(() => {});
await clickByText(/beginnen|starten|los|weiter|bestätig/i);
await page.waitForTimeout(600);
// Ankunft + Director-Dialog wegklicken
for (let i = 0; i < 10; i++) { await page.mouse.click(640, 360).catch(() => {}); await page.keyboard.press('Enter').catch(() => {}); await page.waitForTimeout(350); }
// Dialoge schließen (Esc), bis Gebäude frei bedienbar
for (let i = 0; i < 3; i++) { await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(250); }
await shot('01_building_no_tabbar.png');
// Etagen-Tableau öffnen (Taste F)
await page.keyboard.press('f').catch(() => {});
await page.waitForTimeout(500);
await shot('02_floor_directory.png');
// Tastatur: runter + Enter (Raum betreten)
await page.keyboard.press('ArrowDown').catch(() => {});
await page.waitForTimeout(200);
await shot('03_directory_cursor.png');
await page.keyboard.press('Escape').catch(() => {});
await page.waitForTimeout(300);
await shot('04_after_close.png');

fs.writeFileSync(path.join(OUT, 'console-errors.txt'), errors.join('\n') || '(keine)');
console.log('2c-Smoke fertig. Konsolen-Fehler:', errors.length);
for (const e of errors.slice(0, 10)) console.log('  -', e.slice(0, 160));
await browser.close();
