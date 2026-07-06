// Browser-seitige Helfer der Visual-Review-Ernte. Alle Funktionen werden via
// page.evaluate(...) im Spiel ausgeführt und setzen ?vqa=1 voraus
// (window.__VQA__ aus src/story-mode/harness/vqaHook.ts).

/**
 * Geometrie-Messung im Gebäude-Querschnitt: findet die skalierte Bühne, misst
 * jedes standlinien-relevante Element (Türen, Deko, Statisten, Pförtner, Avatar,
 * Fahrstuhl-Kabine) und rechnet die Screen-Boxen zurück in Stage-Pixel.
 * Ergebnis: { stage:{...}, floors:[...], elements:[...] } — Vergleich gegen die
 * Wand-Fuß-Linie passiert in Node (analyze-geometry.mjs).
 */
export function measureStageGeometry() {
  const V = window.__VQA__;
  if (!V) return { error: 'no __VQA__ (vqa=1 fehlt?)' };
  const container = document.querySelector('[data-testid="building-stage"]');
  if (!container) return { error: 'building-stage nicht im DOM' };
  const layout = V.layout;
  // Seit dem Ebenen-Split (Auflösungs-Etappe) trägt die skalierte Welt-Ebene eine
  // eigene testid; Fallback = alte Heuristik (Kind mit inline width == layout.width).
  const stageEl =
    container.querySelector('[data-testid="building-stage-world"]') ??
    Array.from(container.children).find(
      (el) => el instanceof HTMLElement && el.style.width === `${layout.width}px`,
    );
  if (!stageEl) return { error: 'Bühnen-Element nicht gefunden' };
  const sb = stageEl.getBoundingClientRect();
  const scale = sb.width / layout.width;
  const toStage = (r) => ({
    x: (r.left - sb.left) / scale,
    y: (r.top - sb.top) / scale,
    w: r.width / scale,
    h: r.height / scale,
    bottom: (r.top + r.height - sb.top) / scale,
  });
  const assetIdFromUrl = (url) => {
    const m = /\/(?:images|sheets)\/([^/.]+)\.png/.exec(url ?? '');
    return m ? m[1] : null;
  };
  const els = [];
  // 1) Alle <img> in der Bühne (Türen, Deko, Kabine): Asset-id aus src.
  for (const img of stageEl.querySelectorAll('img')) {
    const id = assetIdFromUrl(img.currentSrc || img.src);
    if (!id) continue;
    const r = img.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const st = window.getComputedStyle(img);
    if (st.opacity === '0' || st.visibility === 'hidden') continue;
    els.push({ kind: 'img', assetId: id, stage: toStage(r), opacity: Number(st.opacity) });
  }
  // 2) Sprite-Spans (PixelSprite): background-image auf sheets/*.png.
  for (const span of stageEl.querySelectorAll('span')) {
    const st = window.getComputedStyle(span);
    const id = assetIdFromUrl(st.backgroundImage);
    if (!id) continue;
    const r = span.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (st.opacity === '0' || st.visibility === 'hidden') continue;
    // Kontext-Label: Avatar / Walker / Dummy / klickbare Statisten.
    const ctx = span.closest('[data-testid="building-avatar"]')
      ? 'avatar'
      : span.closest('[data-bs-walker]')
        ? 'walker'
        : span.closest('[data-bs-dummy]')
          ? 'doorDummy'
          : span.closest('button')
            ? 'clickableFigure'
            : 'sprite';
    els.push({ kind: 'sprite', context: ctx, assetId: id, stage: toStage(r), opacity: Number(st.opacity) });
  }
  return {
    stage: { scale, screen: { x: sb.left, y: sb.top, w: sb.width, h: sb.height } },
    STAGE: V.STAGE,
    floors: layout.floors.map((f) => ({
      id: f.id,
      level: f.level,
      y: f.y,
      walkY: f.walkY,
      wallFootLine: f.y + V.STAGE.floorHeight - V.STAGE.floorStrip,
      frontEdge: f.y + V.STAGE.floorHeight,
    })),
    rooms: layout.rooms.map((r) => ({ id: r.id, floor: r.floor, doorX: r.doorX, x: r.x, w: r.w })),
    minutes: V.getMinutes ? V.getMinutes() : null,
    elements: els,
  };
}

/**
 * Boden-Linien-Overlay in die Bühne zeichnen (für die Wahrnehmungs-Prüfung):
 * Magenta = Wand-Fuß-Linie (Soll-Standlinie), Cyan gestrichelt = vordere
 * Bodenkante. Entfernbar über removeFloorLineOverlay().
 */
export function drawFloorLineOverlay() {
  const V = window.__VQA__;
  if (!V) return false;
  const container = document.querySelector('[data-testid="building-stage"]');
  if (!container) return false;
  const layout = V.layout;
  const stageEl =
    container.querySelector('[data-testid="building-stage-world"]') ??
    Array.from(container.children).find(
      (el) => el instanceof HTMLElement && el.style.width === `${layout.width}px`,
    );
  if (!stageEl) return false;
  // Self-contained halten: page.evaluate serialisiert NUR diese Funktion.
  for (const el of stageEl.querySelectorAll('[data-vqa-overlay]')) el.remove();
  const mk = (top, color, dashed, label) => {
    const d = document.createElement('div');
    d.setAttribute('data-vqa-overlay', '1');
    d.style.cssText = `position:absolute;left:0;width:${layout.width}px;top:${top - 1}px;height:2px;` +
      (dashed
        ? `background:repeating-linear-gradient(90deg, ${color} 0 12px, transparent 12px 24px);`
        : `background:${color};`) +
      'z-index:9999;pointer-events:none;';
    if (label) {
      const t = document.createElement('span');
      t.textContent = label;
      t.style.cssText = `position:absolute;right:6px;top:-16px;font:12px monospace;color:${color};` +
        'background:rgba(0,0,0,0.65);padding:0 4px;letter-spacing:1px;';
      d.appendChild(t);
    }
    stageEl.appendChild(d);
  };
  for (const f of layout.floors) {
    const wallFoot = f.y + V.STAGE.floorHeight - V.STAGE.floorStrip;
    mk(wallFoot, '#ff00cc', false, `BODEN-LINIE ${f.label_de ?? f.id}`);
    mk(f.y + V.STAGE.floorHeight, '#00e5ff', true, null);
  }
  return true;
}

export function removeFloorLineOverlay() {
  for (const el of document.querySelectorAll('[data-vqa-overlay]')) el.remove();
  return true;
}

/**
 * Horizontale Referenz-Linie in einem Vollbild-Raum (Raum-Nahsicht/Büro):
 * zeichnet bei yFrac (0..1 der Viewport-Höhe) eine Linie — genutzt, um die
 * gemalte Boden-Linie des Raum-Assets für Prüfer sichtbar zu verankern.
 */
export function drawViewportLine(yFrac, color, label) {
  const d = document.createElement('div');
  d.setAttribute('data-vqa-overlay', '1');
  d.style.cssText = `position:fixed;left:0;right:0;top:${(yFrac * 100).toFixed(2)}vh;height:2px;background:${color};z-index:99999;pointer-events:none;`;
  const t = document.createElement('span');
  t.textContent = label ?? '';
  t.style.cssText = `position:absolute;right:8px;top:-16px;font:12px monospace;color:${color};background:rgba(0,0,0,0.65);padding:0 4px;`;
  d.appendChild(t);
  document.body.appendChild(d);
  return true;
}
