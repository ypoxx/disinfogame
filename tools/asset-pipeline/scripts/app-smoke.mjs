// App-Smoke: lädt das echte gebaute Spiel (vite preview), drückt sich resilient
// durch den Einstieg und schiesst Screenshots der HUD/Panels. Fängt Konsolen-
// Fehler ab (z.B. kaputte Icons/Layout nach der Emoji-Entfernung).
// Voraussetzung: `vite preview --port 4173` läuft. Ausgabe → runs/app-smoke/.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { RUNS_DIR } from '../src/paths.mjs';

const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = path.join(RUNS_DIR, 'app-smoke');
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

// Neue Mission
await clickByText(/neue mission|mission starten/i);
await page.waitForTimeout(700);
await shot('02_after_newgame.png');

// Avatar-Wahl: ein Porträt anklicken, Namen tippen, bestätigen
await page.locator('img, [role="button"], button').first().click({ timeout: 1500 }).catch(() => {});
for (const inp of await page.locator('input[type="text"], input:not([type])').all()) {
  await inp.fill('Tester').catch(() => {});
}
await page.waitForTimeout(300);
await clickByText(/weiter|bestätig|starten|los|beginnen|ok|annehmen/i);
await page.waitForTimeout(700);
await shot('03_after_avatar.png');

// Ankunft + Dialoge: mehrfach klicken/Enter, um durchzuschalten
for (let i = 0; i < 8; i++) {
  await page.mouse.click(640, 360).catch(() => {});
  await page.keyboard.press('Enter').catch(() => {});
  await page.waitForTimeout(500);
}
await shot('04_after_intro.png');

// HUD evtl. einblenden (Taste H/Tab), Panels öffnen (Tasten), Gebäude (V)
for (const key of ['h', 'H', 'v', 'V', 'Tab']) { await page.keyboard.press(key).catch(() => {}); await page.waitForTimeout(250); }
await shot('05_hud.png');
// Büro betreten (Klick) / Panel
await page.mouse.click(640, 400).catch(() => {});
await page.waitForTimeout(600);
await shot('06_room_or_office.png');

fs.writeFileSync(path.join(OUT, 'console-errors.txt'), errors.join('\n') || '(keine)');
console.log('Smoke fertig. Konsolen-Fehler:', errors.length);
for (const e of errors.slice(0, 12)) console.log('  -', e.slice(0, 160));
await browser.close();
