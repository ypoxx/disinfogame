// 2d-Smoke: permanenter Broadcast-Streifen + Ausklappen per B.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { RUNS_DIR } from '../src/paths.mjs';

const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = path.join(RUNS_DIR, 'smoke-2d');
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
for (let i = 0; i < 10; i++) { await page.mouse.click(640, 360).catch(() => {}); await page.keyboard.press('Enter').catch(() => {}); await page.waitForTimeout(300); }
// Director-Begrüßung schließen: EIN Escape verwirft den offenen Dialog (ohne zu
// pausieren), danach ist der permanente Streifen frei bedienbar.
await page.keyboard.press('Escape').catch(() => {});
await page.waitForTimeout(300);
await clickByText(/fortsetzen/i).catch(() => {}); // falls doch pausiert
// Auto-Peek (falls aktiv) abklingen lassen.
await page.waitForTimeout(5000);
await shot('01_strip_collapsed.png');
const stripCount = await page.locator('[data-testid="broadcast-strip"]').count();
// Ausklappen per Klick auf den Streifen (umgeht Tastatur-Gating)
await page.locator('[data-testid="broadcast-strip"]').click({ timeout: 2000 }).catch(() => {});
await page.waitForTimeout(600);
await shot('02_expanded.png');
const barCount = await page.locator('[data-testid="broadcast-bar"]').count();
// Wieder einklappen per Taste B
await page.keyboard.press('b').catch(() => {});
await page.waitForTimeout(500);
await shot('03_collapsed_again.png');
const stripAgain = await page.locator('[data-testid="broadcast-strip"]').count();
console.log('strip-again:', stripAgain);

fs.writeFileSync(path.join(OUT, 'console-errors.txt'), errors.join('\n') || '(keine)');
console.log('2d-Smoke fertig. strip:', stripCount, 'bar(expanded):', barCount, 'Konsolen-Fehler:', errors.length);
for (const e of errors.slice(0, 10)) console.log('  -', e.slice(0, 160));
await browser.close();
