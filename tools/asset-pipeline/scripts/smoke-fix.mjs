// Fix-Smoke: (2) Direktor-Raum-Nahsicht beim Eröffnungsdialog; (1) Avatar läuft (Sprite).
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { RUNS_DIR } from '../src/paths.mjs';

const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = path.join(RUNS_DIR, 'smoke-fix');
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

// Ankunfts-Sequenz überspringen/durchklicken, bis die Raum-Nahsicht (Eröffnung) erscheint.
await clickByText(/überspringen|skip|weiter/i).catch(() => {});
let roomViewAtStart = 0;
for (let i = 0; i < 18; i++) {
  roomViewAtStart = await page.locator('[data-testid="npc-room-view"]').count();
  if (roomViewAtStart > 0) break;
  await page.mouse.click(640, 360).catch(() => {});
  await page.keyboard.press('Enter').catch(() => {});
  await page.waitForTimeout(450);
}
await shot('01_welcome_roomview.png');
console.log('Eröffnung: npc-room-view =', roomViewAtStart);

// Dialog schließen, ins Gebäude; Avatar laufen lassen (Sprite-Check).
for (let i = 0; i < 12; i++) { await page.keyboard.press('Space').catch(() => {}); await page.waitForTimeout(180); }
await clickByText(/fortsetzen/i).catch(() => {});
await page.waitForTimeout(400);
// Etagen-Tableau → weit weg (Cyber-Lab, Etage 4, Hotkey 1) → Avatar läuft + Fahrstuhl
await page.keyboard.press('f').catch(() => {});
await page.waitForTimeout(500);
await page.keyboard.press('1').catch(() => {});
await page.waitForTimeout(900); // mitten im Laufweg
const avatar = await page.locator('[data-testid="building-avatar"]').count();
await shot('02_avatar_walking.png');
await page.waitForTimeout(700);
await shot('03_avatar_walking2.png');
console.log('Gebäude: building-avatar =', avatar);

fs.writeFileSync(path.join(OUT, 'console-errors.txt'), errors.join('\n') || '(keine)');
console.log('Fix-Smoke fertig. Konsolen-Fehler:', errors.length);
for (const e of errors.slice(0, 10)) console.log('  -', e.slice(0, 160));
await browser.close();
