// Fokus-Smoke: Title → Avatar → Ankunft → TAG-0-HOAX-TUTORIAL → Vergabe.
// Lauf: npm run build → npm run preview -- --port 4173 (bg) → node scripts/tag0-smoke.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXE = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = path.join(__dirname, '..', 'runs', 'tag0-smoke');
fs.mkdirSync(OUT, { recursive: true });
const URL = process.env.SMOKE_URL || 'http://localhost:4173/';

const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
const shot = (n) => page.screenshot({ path: path.join(OUT, n) });
const clickText = async (re, timeout = 2500) => {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    for (const el of await page.locator('button, [role="button"]').all()) {
      const t = (await el.textContent().catch(() => '')) || '';
      if (re.test(t)) { await el.click({ timeout: 1000 }).catch(() => {}); return t.trim(); }
    }
    await page.waitForTimeout(200);
  }
  return null;
};

await page.goto(URL, { waitUntil: 'networkidle' }).catch(() => {});
await page.waitForTimeout(600);
await shot('01_title.png');
console.log('title clicked:', await clickText(/neue mission|mission starten|neues spiel|neue/i));
await page.waitForTimeout(500);
// Avatar-Wahl
await page.locator('img, button, [role="button"]').first().click({ timeout: 1500 }).catch(() => {});
for (const inp of await page.locator('input[type="text"], input:not([type])').all()) await inp.fill('Tester').catch(() => {});
await shot('02_avatar.png');
console.log('avatar confirm:', await clickText(/weiter|bestätig|starten|los|beginnen|ok|annehmen|bereit/i));
await page.waitForTimeout(500);
// Ankunft überspringen / durchklicken
await clickText(/überspringen|skip|weiter/i, 1500);
for (let i = 0; i < 8; i++) { await page.mouse.click(640, 400).catch(() => {}); await page.keyboard.press('Enter').catch(() => {}); await page.waitForTimeout(300); }
await shot('03_after_arrival.png');
// TAG-0-TUTORIAL
const zeig = await clickText(/ZEIG MIR DAS/i, 3000);
console.log('tag0 intro found:', zeig);
await page.waitForTimeout(300);
await shot('04_tag0_choose.png');
console.log('koeder clicked:', await clickText(/Stadttauben|Trinkwasser|Brücke/i, 2000));
await page.waitForTimeout(1800); // Balken-Animation abwarten
await shot('05_tag0_onair.png');
console.log('weiter:', await clickText(/WEITER/i, 2000));
await page.waitForTimeout(300);
await shot('06_tag0_lesson.png');
console.log('verstanden:', await clickText(/VERSTANDEN/i, 2000));
await page.waitForTimeout(300);
await shot('07_tag0_bridge.png');
console.log('an die arbeit:', await clickText(/AN DIE ARBEIT/i, 2000));
await page.waitForTimeout(500);
await shot('08_vergabe.png');
const uebernehmen = await clickText(/AKTE ÜBERNEHMEN/i, 3000);
console.log('vergabe found:', uebernehmen);
await page.waitForTimeout(800);
await shot('09_ingame.png');

console.log('CONSOLE ERRORS:', errors.length);
for (const e of errors.slice(0, 10)) console.log('  ', e);
await browser.close();
