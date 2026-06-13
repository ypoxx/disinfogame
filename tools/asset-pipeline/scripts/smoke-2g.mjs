// 2g-Smoke: HUD standard aus (Pause/HUD-Cluster sichtbar) → Taste H blendet HUD ein.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { RUNS_DIR } from '../src/paths.mjs';

const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = path.join(RUNS_DIR, 'smoke-2g');
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
for (let i = 0; i < 10; i++) { await page.mouse.click(640, 360).catch(() => {}); await page.keyboard.press('Enter').catch(() => {}); await page.waitForTimeout(280); }
for (let i = 0; i < 14; i++) { await page.keyboard.press('Space').catch(() => {}); await page.waitForTimeout(180); }
await clickByText(/fortsetzen/i).catch(() => {});
await page.waitForTimeout(500);

await shot('01_hud_hidden.png');
const clusterBtn = await page.locator('[aria-label="HUD einblenden"]').count();
// HUD einblenden per Taste H
await page.keyboard.press('h').catch(() => {});
await page.waitForTimeout(500);
await shot('02_hud_shown.png');
const hideBtn = await page.locator('[aria-label="HUD ausblenden"]').count();
// wieder ausblenden
await page.keyboard.press('h').catch(() => {});
await page.waitForTimeout(400);
const clusterAgain = await page.locator('[aria-label="HUD einblenden"]').count();

fs.writeFileSync(path.join(OUT, 'console-errors.txt'), errors.join('\n') || '(keine)');
console.log('2g-Smoke fertig. cluster(hidden):', clusterBtn, 'hideBtn(shown):', hideBtn, 'clusterAgain:', clusterAgain, 'Konsolen-Fehler:', errors.length);
for (const e of errors.slice(0, 10)) console.log('  -', e.slice(0, 160));
await browser.close();
