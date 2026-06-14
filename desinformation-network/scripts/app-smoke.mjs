// App-Smoke (self-contained, playwright-core): lädt das gebaute Spiel via
// `vite preview`, klickt sich resilient durch den Einstieg, schießt Screenshots
// und sammelt Konsolen-Fehler. Browser-Binary liegt bereits im Container.
// Lauf: `npm run build` → `npm run preview -- --port 4173` (bg) → `node scripts/app-smoke.mjs`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = dirname();
function dirname() { return path.dirname(fileURLToPath(import.meta.url)); }

const EXE = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = path.join(__dirname, '..', 'runs', 'app-smoke');
fs.mkdirSync(OUT, { recursive: true });
const URL = process.env.SMOKE_URL || 'http://localhost:4173/';

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
await page.waitForTimeout(800);
await shot('01_title.png');

await clickByText(/neue mission|mission starten|neues spiel/i);
await page.waitForTimeout(700);
await shot('02_after_newgame.png');

// Avatar-Wahl: erstes Porträt, Name, bestätigen
await page.locator('img, [role="button"], button').first().click({ timeout: 1500 }).catch(() => {});
for (const inp of await page.locator('input[type="text"], input:not([type])').all()) {
  await inp.fill('Tester').catch(() => {});
}
await page.waitForTimeout(300);
await clickByText(/weiter|bestätig|starten|los|beginnen|ok|annehmen/i);
await page.waitForTimeout(700);
await shot('03_after_avatar.png');

// Ankunft + Dialoge durchklicken
for (let i = 0; i < 10; i++) {
  await page.mouse.click(640, 360).catch(() => {});
  await page.keyboard.press('Enter').catch(() => {});
  await page.waitForTimeout(450);
}
await shot('04_building.png');

// HUD/Panels
for (const key of ['h', 'v', 'Tab']) { await page.keyboard.press(key).catch(() => {}); await page.waitForTimeout(250); }
await shot('05_hud.png');
await page.mouse.click(640, 400).catch(() => {});
await page.waitForTimeout(600);
await shot('06_room_or_office.png');

fs.writeFileSync(path.join(OUT, 'console-errors.txt'), errors.join('\n') || '(keine)');
console.log('Smoke fertig. Konsolen-Fehler:', errors.length);
for (const e of errors.slice(0, 12)) console.log('  -', e.slice(0, 200));
await browser.close();
