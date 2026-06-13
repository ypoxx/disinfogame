// Browser-Smoke der Gebäude-Teile: rendert die Kacheln mit DERSELBEN CSS-Technik
// wie BuildingStage (background-repeat x/y, image-rendering:pixelated) im echten
// Container-Chromium und schiesst einen Screenshot. Prüft Nähte/Ton/Chroma im Browser.
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { OUT_DIR, RUNS_DIR } from '../src/paths.mjs';

const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = path.join(RUNS_DIR, 'build-check');
fs.mkdirSync(OUT, { recursive: true });
const u = (id) => `file://${path.join(OUT_DIR, 'images', id + '.png')}`;

const html = `<!doctype html><html><head><meta charset="utf8"><style>
*{margin:0;box-sizing:border-box} html,body{background:#0c0c10}
.stage{position:relative;width:900px;height:560px;overflow:hidden;image-rendering:pixelated}
.city{position:absolute;left:0;right:0;bottom:80px;height:210px;background:url(${u('bld_city_far')}) repeat-x;background-size:auto 100%;background-position:center bottom;opacity:.85;image-rendering:pixelated}
.street{position:absolute;left:0;right:0;bottom:0;height:80px;background:url(${u('bld_street')}) repeat-x;background-size:auto 80px;image-rendering:pixelated}
.bld{position:absolute;left:230px;top:30px;width:460px;height:480px}
.roof{position:absolute;top:0;left:0;width:100%;height:80px;object-fit:cover;object-position:bottom;image-rendering:pixelated}
.pillar{position:absolute;top:80px;height:400px;width:28px;background:url(${u('bld_facade_pillar')}) repeat-y;background-size:28px auto;image-rendering:pixelated}
.floor{position:absolute;left:28px;width:404px;height:112px;background:linear-gradient(rgba(8,8,12,.12),rgba(8,8,12,.22)),url(${u('bld_corridor')}) repeat-x;background-size:auto 100%;background-position:left bottom;image-rendering:pixelated}
.slab{position:absolute;left:0;width:460px;height:14px;background:url(${u('bld_floor_slab')}) repeat-x;background-size:auto 14px;image-rendering:pixelated}
.shaft{position:absolute;top:120px;left:340px;width:92px;height:360px;background:url(${u('bld_shaft')}) repeat-y;background-size:92px auto;image-rendering:pixelated}
.door{position:absolute;width:46px;height:72px;image-rendering:pixelated}
.cabin{position:absolute;width:80px;height:106px;left:346px;image-rendering:pixelated}
</style></head><body><div class="stage">
<div class="city"></div><div class="street"></div>
<div class="bld">
  <img class="roof" src="${u('bld_roof')}">
  <div class="pillar" style="left:0"></div><div class="pillar" style="right:0"></div>
  <div class="floor" style="top:120px"></div><div class="slab" style="top:106px"></div>
  <div class="floor" style="top:246px"></div><div class="slab" style="top:232px"></div>
  <div class="floor" style="top:372px"></div><div class="slab" style="top:358px"></div>
  <div class="shaft"></div>
  <img class="cabin" src="${u('elevator_cabin_open')}" style="top:374px">
  <img class="door" src="${u('bld_door_closed')}" style="left:70px;top:174px">
  <img class="door" src="${u('bld_door_open')}" style="left:180px;top:300px">
  <img class="door" src="${u('bld_door_closed')}" style="left:120px;top:426px">
</div></div></body></html>`;

const htmlFile = path.join(OUT, 'building_smoke.html');
fs.writeFileSync(htmlFile, html);

const browser = await chromium.launch({ executablePath: EXE });
const page = await browser.newPage({ viewport: { width: 900, height: 560 } });
await page.goto(`file://${htmlFile}`);
await page.waitForTimeout(600);
await page.screenshot({ path: path.join(OUT, 'building_browser.png') });
await browser.close();
console.log('Smoke-Screenshot →', path.join(OUT, 'building_browser.png'));
