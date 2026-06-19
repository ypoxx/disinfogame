// T3-Durchlauf: bestätigt visuell den verschmolzenen Aktions-Ergebnis-Dialog
// (T3.6: NPC-Porträt + Daten in EINEM Modal) und das Budget-Vorzeichen (T3.4),
// und versucht den Tageswechsel/Heimweg (T3.5). Best-effort + resilient.
// Lauf: npm run build → npm run preview -- --port 4173 (bg) → node scripts/t3-runthrough.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXE = process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = path.join(__dirname, '..', 'runs', 't3-runthrough');
fs.mkdirSync(OUT, { recursive: true });
const URL = process.env.SMOKE_URL || 'http://localhost:4173/';

const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

const shot = (n) => page.screenshot({ path: path.join(OUT, n), fullPage: false }).catch(() => {});
const log = (...a) => console.log(...a);
const buttonTexts = async () => {
  const out = [];
  for (const el of await page.getByRole('button').all()) {
    const t = ((await el.textContent().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    if (t) out.push(t.slice(0, 40));
  }
  return out;
};
const clickByText = async (re) => {
  for (const el of await page.getByRole('button').all()) {
    const t = (await el.textContent().catch(() => '')) || '';
    if (re.test(t)) { await el.click({ timeout: 1500 }).catch(() => {}); return t.replace(/\s+/g, ' ').trim(); }
  }
  return null;
};
const bodyHas = async (re) => re.test(((await page.locator('body').textContent().catch(() => '')) || ''));

await page.goto(URL, { waitUntil: 'networkidle' }).catch(() => {});
await page.waitForTimeout(900);
await shot('01_title.png');

await clickByText(/neue mission|mission starten|neues spiel/i);
await page.waitForTimeout(700);
// Avatar + Name
await page.locator('img, [role="button"], button').first().click({ timeout: 1500 }).catch(() => {});
for (const inp of await page.locator('input[type="text"], input:not([type])').all()) await inp.fill('Tester').catch(() => {});
await clickByText(/weiter|bestätig|starten|los|beginnen|ok|annehmen/i);
await page.waitForTimeout(700);
await shot('02_after_avatar.png');

// Ankunft + Dialoge: DialogBox schaltet per Leertaste / Klick auf die Box (unten)
// weiter; Auswahl (Auftrag) per Zahlentaste — NICHT Enter, NICHT × (× überspringt).
for (let i = 0; i < 28; i++) {
  await page.mouse.click(640, 662).catch(() => {});
  await page.keyboard.press('Space').catch(() => {});
  if (i % 3 === 2) await page.keyboard.press('1').catch(() => {});
  await page.waitForTimeout(330);
}
await shot('03_free_play.png');
log('Buttons @ free play:', JSON.stringify(await buttonTexts()).slice(0, 500));

// Auftrag bestätigen: Karte „Der Keil" wählen + „… beginnen" (sonst bleibt das
// Auftrags-Overlay offen und blockiert das Aktionen-Panel dahinter).
await clickByText(/der keil|einstieg/i);
await page.waitForTimeout(400);
const begun = await clickByText(/beginnen/i);
log('Auftrag bestätigt via:', begun);
await page.waitForTimeout(900);
await shot('03b_auftrag_confirmed.png');

// Restliche Dialoge per Leertaste/Box-Klick schließen (× vermeiden — würde überspringen)
for (let i = 0; i < 10; i++) {
  if (!(await bodyHas(/weiter ▸/i))) break;
  await page.mouse.click(640, 662).catch(() => {});
  await page.keyboard.press('Space').catch(() => {});
  await page.waitForTimeout(250);
}
await shot('04_dialogs_cleared.png');
log('Buttons nach Dialog-Clear:', JSON.stringify(await buttonTexts()).slice(0, 500));

// Aktionen-Panel öffnen (Taste 'a')
await page.keyboard.press('a').catch(() => {});
await page.waitForTimeout(800);
await shot('05_actions_panel.png');
log('Buttons @ actions panel:', JSON.stringify(await buttonTexts()).slice(0, 900));

// Mehrere Aktionen durchprobieren, bis das Ergebnis-Modal einen GESELLSCHAFT-Block
// zeigt (Analyse-Aktionen bewegen die Werte nicht). #5-Beweis. Das Panel schließt
// nach jeder Ausführung → vor jeder Iteration neu öffnen + i-ten Knopf wählen.
const collectExec = async () => {
  const out = [];
  for (const el of await page.getByRole('button').all()) {
    if (/ausführen/i.test((await el.textContent().catch(() => '')) || '')) out.push(el);
  }
  return out;
};
let shown = false;
for (let i = 0; i < 8 && !shown; i++) {
  let btns = await collectExec();
  if (btns.length === 0) {
    await page.keyboard.press('a').catch(() => {}); // Aktionen-Panel erneut öffnen
    await page.waitForTimeout(500);
    await clickByText(/^\s*alle\s*$/i);
    await page.waitForTimeout(300);
    btns = await collectExec();
  }
  if (btns.length === 0) { log(`#${i}: keine Ausführen-Knöpfe (AP erschöpft?)`); break; }
  await btns[Math.min(i, btns.length - 1)].click({ timeout: 1500 }).catch(() => {});
  await page.waitForTimeout(1000);
  const hasSoc = await bodyHas(/WIRKUNG DIESER AKTION/i);
  log(`exec #${i}: Modal=${await bodyHas(/AKTION ERFOLGREICH|RESSOURCEN/i)} NPC=${await bodyHas(/NPC-REAKTIONEN/i)} GESELLSCHAFT=${hasSoc}`);
  if (hasSoc) { await shot('06_RESULT_MODAL.png'); shown = true; break; }
  await clickByText(/verstanden|schließen/i);
  await page.waitForTimeout(500);
}
log('Gesellschaft-Block gezeigt:', shown);

// T3.5: Tageswechsel/Heimweg versuchen
log('--- T3.5 Tageswechsel-Versuch ---');
await clickByText(/tag beenden|feierabend|nach hause|heimweg|tag abschließen|beenden/i);
for (let i = 0; i < 20; i++) {
  await page.keyboard.press('Enter').catch(() => {});
  await page.mouse.click(640, 360).catch(() => {});
  await page.waitForTimeout(500);
  if (await bodyHas(/lagebericht|tagesbericht|deutungshoheit|tag \d|abschlussbericht/i)) { log(`-> Tagesbericht nach ~${i} Klicks erschienen`); break; }
}
await shot('07_day_transition.png');
log('Tagesbericht sichtbar:', await bodyHas(/lagebericht|tagesbericht|deutungshoheit|abschlussbericht/i));

fs.writeFileSync(path.join(OUT, 'console-errors.txt'), errors.join('\n') || '(keine)');
log('FERTIG. Konsolen-Fehler:', errors.length);
for (const e of errors.slice(0, 15)) log('  -', e.slice(0, 200));
await browser.close();
