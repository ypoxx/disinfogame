// Geometrie-Analyse (Realitätssicht, Schicht a): verbindet die DOM-Messungen
// der Ernte (geometry/*.json) mit dem Asset-Padding-Audit (asset-audit.json)
// zu pixelgenauen Befunden je Figur/Prop:
//   engineGapPx  = Wand-Fuß-Linie − Box-Unterkante        (Engine-Platzierung)
//   visualGapPx  = engineGapPx + eingebacktes Boden-Padding × Anzeige-Skalierung
//                  (>0 = schwebt sichtbar, <0 = versinkt sichtbar)
// plus Maßstabs-Prüfung: Referenz Avatar = 1,75 m ⇒ px/m; Soll-Bereiche je
// Objektklasse; Konsistenz einer Klasse über alle Etagen.
//
// Lauf: node scripts/visual-review/analyze-geometry.mjs [--run runs/visual-review/latest]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GAME = path.resolve(__dirname, '..', '..');
const arg = (name, dflt) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : dflt;
};
const RUN = path.resolve(GAME, arg('run', 'runs/visual-review/latest'));

const AVATAR_M = 1.75; // Referenz-Maßstab (Owner-Vorgabe dieser Prüfung)
const AVATAR_PX = 128; // STAGE.avatarSize
const PX_PER_M = AVATAR_PX / AVATAR_M;

// Soll-Bereiche je Objektklasse in Metern (aus der Referenz 1,75 m abgeleitet;
// bewusst großzügig — Verstöße sind dann wirklich auffällig).
const REAL_RANGES_M = {
  door: [1.9, 2.3],
  prop_plant_tall: [1.0, 1.9],
  prop_plant_small: [0.5, 1.2],
  prop_plant_wilted: [1.0, 1.9],
  prop_watercooler: [0.9, 1.4],
  prop_vending: [1.5, 2.0],
  prop_coffee_station: [0.85, 1.5],
  prop_bench: [0.7, 1.1],
  prop_chairs: [0.7, 1.2],
  prop_shredder: [0.5, 1.1],
  prop_trashcan: [0.3, 0.9],
  figure: [1.5, 1.95],
  pfoertner: [1.5, 1.85],
};

const audit = JSON.parse(fs.readFileSync(path.join(RUN, 'asset-audit.json'), 'utf8'));
const auditById = new Map(audit.results.map((r) => [r.id, r]));

const geomDir = path.join(RUN, 'geometry');
const files = fs.existsSync(geomDir) ? fs.readdirSync(geomDir).filter((f) => f.endsWith('.json')) : [];
if (!files.length) {
  console.error(`Keine Geometrie-Dumps in ${geomDir} — erst harvest.mjs laufen lassen.`);
  process.exit(1);
}

const findings = [];
const scaleRows = new Map(); // assetId → [{shot, floor, displayH, meters}]
const perShot = [];

for (const f of files) {
  const g = JSON.parse(fs.readFileSync(path.join(geomDir, f), 'utf8'));
  if (g.error) { perShot.push({ shot: f, error: g.error }); continue; }
  const floorFor = (yMid) =>
    g.floors.find((fl) => yMid >= fl.y - g.STAGE.slabHeight && yMid < fl.y + g.STAGE.floorHeight + g.STAGE.slabHeight) ?? null;

  const rows = [];
  for (const el of g.elements) {
    const a = auditById.get(el.assetId);
    const yMid = el.stage.y + el.stage.h / 2;
    const floor = floorFor(yMid);
    if (!floor) continue;
    const isDoor = el.assetId.startsWith('bld_door');
    const isCabin = el.assetId.startsWith('elevator_cabin');
    const isFloorProp = el.assetId.startsWith('prop_') && !isWallProp(el, floor, g);
    const isFigure = el.kind === 'sprite';
    if (!isDoor && !isFloorProp && !isFigure && !isCabin) continue;

    // Eingebacktes Boden-Padding in Anzeige-Pixeln.
    let padBottomDisplay = null;
    let contentMeta = null;
    if (a) {
      if (a.type === 'image' && a.box) {
        const scale = el.stage.h / a.h;
        padBottomDisplay = a.box.padBottom * scale;
        contentMeta = { natural: `${a.w}×${a.h}`, padBottomPx: a.box.padBottom };
      } else if (a.type === 'sheet') {
        const scale = el.stage.h / a.frameHeight;
        padBottomDisplay = a.padBottomMin * scale; // konservativ: bester Frame
        contentMeta = { frame: `${a.frameWidth}×${a.frameHeight}`, padBottomPx: `${a.padBottomMin}–${a.padBottomMax}` };
      }
    }

    const engineGap = floor.wallFootLine - el.stage.bottom; // >0: Box endet ÜBER der Linie
    const visualGap = padBottomDisplay != null ? engineGap + padBottomDisplay : null;

    // Maßstab: sichtbare Inhalts-Höhe in Metern.
    let visibleH = el.stage.h;
    if (a?.type === 'image' && a.box) visibleH = el.stage.h * (a.box.contentH / a.h);
    if (a?.type === 'sheet') visibleH = el.stage.h * (a.contentHMax / a.frameHeight);
    const meters = visibleH / PX_PER_M;

    const cls = isDoor ? 'door' : isCabin ? 'cabin' : el.context === 'avatar' ? 'avatar' : el.assetId.includes('pfoertner') ? 'pfoertner' : isFigure ? 'figure' : el.assetId;
    rows.push({
      assetId: el.assetId, kind: el.kind, context: el.context ?? null, class: cls,
      floor: floor.id,
      boxBottom: round2(el.stage.bottom), wallFootLine: floor.wallFootLine,
      engineGapPx: round2(engineGap),
      bakedPadBottomDisplayPx: padBottomDisplay != null ? round2(padBottomDisplay) : null,
      visualGapPx: visualGap != null ? round2(visualGap) : null,
      displayH: round2(el.stage.h), visibleH: round2(visibleH), meters: round2(meters),
      contentMeta,
    });
    if (!scaleRows.has(cls)) scaleRows.set(cls, []);
    scaleRows.get(cls).push({ shot: f.replace('.json', ''), floor: floor.id, meters: round2(meters), displayH: round2(el.stage.h) });
  }
  perShot.push({ shot: f.replace('.json', ''), minutes: g.minutes, elements: rows });

  // Befunde: schwebt/versinkt (Schwellen: >4px sichtbar bei ×~0.5-Skalierung ≈ >2 Screen-px).
  for (const r of rows) {
    const gap = r.visualGapPx ?? r.engineGapPx;
    if (gap == null) continue;
    if (r.class === 'cabin') continue; // Kabine füllt den Schacht, keine Standlinie
    if (gap > 4) {
      findings.push({
        severity: gap > 12 ? 'hoch' : 'mittel',
        type: 'schwebt',
        shot: f.replace('.json', ''),
        assetId: r.assetId, class: r.class, floor: r.floor,
        messwert: `Unterkante ${gap.toFixed(1)} Stage-px über der Wand-Fuß-Linie (Engine ${r.engineGapPx}px, eingebacktes Padding ${r.bakedPadBottomDisplayPx ?? '?'}px)`,
      });
    } else if (gap < -4) {
      findings.push({
        severity: gap < -12 ? 'hoch' : 'mittel',
        type: 'versinkt',
        shot: f.replace('.json', ''),
        assetId: r.assetId, class: r.class, floor: r.floor,
        messwert: `Unterkante ${(-gap).toFixed(1)} Stage-px unter der Wand-Fuß-Linie`,
      });
    }
  }
}

// Duplikate über Shots dedupen (jede Etage ist in mehreren Shots sichtbar):
// gleicher Befund = gleiche (type, assetId, floor, gerundeter Messwert).
{
  const seen = new Map();
  for (const f of findings) {
    const key = `${f.type}|${f.assetId}|${f.class}|${f.floor}|${f.messwert.replace(/\d+\.\d+/g, (m) => Math.round(Number(m)))}`;
    if (seen.has(key)) seen.get(key).shots.push(f.shot);
    else seen.set(key, { ...f, shots: [f.shot], shot: undefined });
  }
  findings.length = 0;
  findings.push(...seen.values());
}

// Maßstabs-/Konsistenz-Befunde je Klasse.
const scaleReport = [];
for (const [cls, rowsAll] of scaleRows) {
  const uniq = [];
  const seen = new Set();
  for (const r of rowsAll) {
    const k = `${r.floor}:${r.displayH}`;
    if (!seen.has(k)) { seen.add(k); uniq.push(r); }
  }
  const meters = uniq.map((r) => r.meters);
  const min = Math.min(...meters), max = Math.max(...meters);
  const range = REAL_RANGES_M[cls] ?? (cls.startsWith('prop_') ? REAL_RANGES_M[cls] : null);
  scaleReport.push({ class: cls, samples: uniq.length, metersMin: min, metersMax: max, sollBereichM: range ?? null, floors: [...new Set(uniq.map((r) => r.floor))] });
  if (range && (max < range[0] || min > range[1])) {
    findings.push({
      severity: 'mittel',
      type: 'massstab',
      assetId: cls, class: cls, floor: '-',
      messwert: `sichtbare Höhe ${min.toFixed(2)}–${max.toFixed(2)} m (Referenz Avatar 1,75 m = ${AVATAR_PX}px) außerhalb Soll ${range[0]}–${range[1]} m`,
    });
  }
  if (max - min > 0.12 && cls !== 'figure') {
    findings.push({
      severity: 'niedrig',
      type: 'klassen-inkonsistenz',
      assetId: cls, class: cls, floor: '-',
      messwert: `Klasse variiert über Etagen: ${min.toFixed(2)}–${max.toFixed(2)} m (Δ ${(max - min).toFixed(2)} m)`,
    });
  }
}

function isWallProp(el, floor, g) {
  // Wand-Objekte hängen im oberen Drittel (mount 'wall' — Rekonstruktion über die Lage).
  const topThirdEnd = floor.y + g.STAGE.floorHeight * 0.55;
  return el.stage.y + el.stage.h < topThirdEnd;
}
function round2(x) { return Math.round(x * 100) / 100; }

const out = {
  reference: { avatarMeters: AVATAR_M, avatarPx: AVATAR_PX, pxPerMeter: round2(PX_PER_M) },
  findings: findings.sort((a, b) => ({ hoch: 0, mittel: 1, niedrig: 2 }[a.severity] - { hoch: 0, mittel: 1, niedrig: 2 }[b.severity])),
  scaleReport,
  perShot,
};
const outFile = path.join(RUN, 'geometry-report.json');
fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
console.log(`Geometrie-Report: ${findings.length} Befunde → ${outFile}`);
for (const f of out.findings.slice(0, 25)) {
  console.log(`  [${f.severity}] ${f.type} · ${f.assetId} (${f.floor}) — ${f.messwert}`);
}
