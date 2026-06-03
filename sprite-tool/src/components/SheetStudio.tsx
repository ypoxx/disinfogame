'use client';

// ===========================================
// SPRITE-SHEET-STUDIO (M3) — slicen, Animation prüfen, spielfertig speichern
// ===========================================
// Zwei Wege: (1) ein generiertes Sheet-Bild in cols×rows FRAMES zerlegen, oder
// (2) einzelne Frames zu einem Raster PACKEN. Ergebnis: type:"sheet" mit
// frameWidth/height + animations → genau das, was useSprite im Spiel braucht.

import { useEffect, useState } from 'react';
import { useStudio } from '@/lib/studio/StudioContext';
import { listAssets, putAsset } from '@/lib/library';
import { createLibraryAsset, type LibraryAsset, type SheetAnimation } from '@/lib/assets';
import { sliceGrid, packFrames, type SliceResult } from '@/lib/studio/sheet';
import { keyOutBackground } from '@/lib/studio/pixel';
import { DEFAULT_IMAGE_MODEL } from '@/lib/constants';

export function SheetStudio() {
  const { bumpLibrary, libraryVersion } = useStudio();
  const [assets, setAssets] = useState<LibraryAsset[]>([]);
  const [source, setSource] = useState<string | null>(null);
  const [cols, setCols] = useState(8);
  const [rows, setRows] = useState(1);
  const [slice, setSlice] = useState<SliceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [animName, setAnimName] = useState('walk');
  const [fps, setFps] = useState(10);
  const [loop, setLoop] = useState(true);
  const [assetId, setAssetId] = useState('player_walk');
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Animations-Vorschau
  const [playing, setPlaying] = useState(true);
  const [frameIdx, setFrameIdx] = useState(0);

  // Pack-Auswahl
  const [packSel, setPackSel] = useState<string[]>([]);

  useEffect(() => {
    listAssets().then(setAssets);
  }, [libraryVersion, saveMsg]);

  useEffect(() => {
    if (!playing || !slice || slice.frames.length === 0) return;
    const id = window.setInterval(
      () => setFrameIdx((i) => (i + 1) % slice.frames.length),
      Math.max(40, 1000 / Math.max(1, fps))
    );
    return () => window.clearInterval(id);
  }, [playing, slice, fps]);

  const imgAssets = assets.filter((a) => a.type === 'image' || a.type === 'sheet');

  async function doSlice() {
    if (!source) return;
    setError(null);
    try {
      const result = await sliceGrid(source, cols, rows);
      setSlice(result);
      setFrameIdx(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Slicing fehlgeschlagen');
    }
  }

  async function keyOutSource() {
    if (!source) return;
    setSource(await keyOutBackground(source, { sample: 'corner', tolerance: 30 }));
    setSlice(null);
  }

  async function doPack() {
    const chosen = packSel
      .map((k) => assets.find((a) => a.key === k))
      .filter((a): a is LibraryAsset => Boolean(a));
    if (chosen.length === 0) return;
    setError(null);
    try {
      const result = await packFrames(chosen.map((a) => a.dataBase64), chosen.length);
      setSource(result.sheetBase64);
      setCols(result.cols);
      setRows(result.rows);
      setSlice(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Packen fehlgeschlagen');
    }
  }

  function onUpload(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSource((reader.result?.toString() || '').split(',')[1] || null);
      setSlice(null);
    };
    reader.readAsDataURL(file);
  }

  async function save() {
    if (!source || !slice) return;
    const id = (assetId || 'sheet').replace(/[^a-z0-9_]+/g, '_');
    const frameTime = Math.round(1000 / Math.max(1, fps));
    const animations: SheetAnimation[] =
      slice.rows <= 1
        ? [{ name: animName || 'default', row: 0, frames: slice.cols, frameTime, loop }]
        : Array.from({ length: slice.rows }, (_, r) => ({
            name: `${animName || 'anim'}_${r}`,
            row: r,
            frames: slice.cols,
            frameTime,
            loop,
          }));
    const asset = createLibraryAsset({
      id,
      type: 'sheet',
      dataBase64: source,
      mime: 'image/png',
      provider: DEFAULT_IMAGE_MODEL,
      frameWidth: slice.frameWidth,
      frameHeight: slice.frameHeight,
      cols: slice.cols,
      rows: slice.rows,
      animations,
      chosen: true,
    });
    await putAsset(asset);
    bumpLibrary();
    setSaveMsg(`✓ Sheet „${id}" gespeichert (${slice.cols}×${slice.rows}, ${slice.frameWidth}×${slice.frameHeight}px)`);
    window.setTimeout(() => setSaveMsg(null), 3500);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="mb-1 text-lg font-bold">🎞️ Sprite-Sheet-Studio</h2>
        <p className="text-sm text-gray-400">
          Mach aus einem generierten Sheet-Bild ein spielfertiges Sprite-Sheet: in Frames zerlegen, Animation
          prüfen, mit Frame-Maßen speichern (→ <code className="rounded bg-gray-800 px-1">useSprite</code> im Spiel).
        </p>
      </div>

      {error && <div className="rounded-lg border border-red-700 bg-red-900/40 p-3 text-sm text-red-300">{error}</div>}

      {/* Quelle */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-300">1) Quelle wählen</h3>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-gray-400">
            Datei:{' '}
            <input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0] ?? null)} className="text-xs" />
          </label>
          {source && (
            <button onClick={keyOutSource} className="rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600">
              Hintergrund → transparent
            </button>
          )}
        </div>
        {imgAssets.length > 0 && (
          <div className="mt-3">
            <div className="mb-1 text-xs text-gray-500">…oder aus der Bibliothek:</div>
            <div className="flex flex-wrap gap-2">
              {imgAssets.slice(0, 24).map((a) => (
                <button
                  key={a.key}
                  onClick={() => {
                    setSource(a.dataBase64);
                    setSlice(null);
                    setAssetId(a.id);
                  }}
                  className={`h-14 w-14 overflow-hidden rounded border ${
                    source === a.dataBase64 ? 'border-blue-500' : 'border-gray-700'
                  }`}
                  title={a.id}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`data:${a.mime};base64,${a.dataBase64}`} alt={a.id} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pack */}
        {imgAssets.length > 1 && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-gray-500">Mehrere Frames zu einem Sheet zusammenfügen…</summary>
            <div className="mt-2 flex flex-wrap gap-2">
              {imgAssets.slice(0, 24).map((a) => {
                const picked = packSel.includes(a.key);
                return (
                  <button
                    key={a.key}
                    onClick={() => setPackSel((p) => (picked ? p.filter((k) => k !== a.key) : [...p, a.key]))}
                    className={`relative h-12 w-12 overflow-hidden rounded border ${picked ? 'border-green-500' : 'border-gray-700'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`data:${a.mime};base64,${a.dataBase64}`} alt={a.id} className="h-full w-full object-contain" />
                    {picked && <span className="absolute right-0 top-0 bg-green-600 px-1 text-[9px]">{packSel.indexOf(a.key) + 1}</span>}
                  </button>
                );
              })}
            </div>
            <button onClick={doPack} disabled={packSel.length === 0} className="mt-2 rounded bg-gray-700 px-3 py-1 text-xs hover:bg-gray-600 disabled:opacity-50">
              {packSel.length} Frames packen → Quelle
            </button>
          </details>
        )}
      </div>

      {/* Slice */}
      {source && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-300">2) Zerlegen</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`data:image/png;base64,${source}`} alt="Quelle" className="max-h-56 w-auto rounded border border-gray-800" />
            </div>
            <div className="space-y-3 text-sm">
              <label className="flex items-center gap-2">
                <span className="w-20">Spalten</span>
                <input type="number" min={1} value={cols} onChange={(e) => setCols(Math.max(1, Number(e.target.value)))} className="w-20 rounded border border-gray-700 bg-gray-800 px-2 py-1" />
              </label>
              <label className="flex items-center gap-2">
                <span className="w-20">Zeilen</span>
                <input type="number" min={1} value={rows} onChange={(e) => setRows(Math.max(1, Number(e.target.value)))} className="w-20 rounded border border-gray-700 bg-gray-800 px-2 py-1" />
              </label>
              <button onClick={doSlice} className="rounded bg-green-600 px-4 py-2 font-medium hover:bg-green-700">
                In {cols}×{rows} Frames zerlegen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Frames + Animation */}
      {slice && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-300">
            3) Frames ({slice.cols}×{slice.rows} · {slice.frameWidth}×{slice.frameHeight}px)
          </h3>
          {slice.warnings.map((w, i) => (
            <div key={i} className="mb-2 rounded border border-yellow-700 bg-yellow-900/30 p-2 text-xs text-yellow-200">⚠ {w}</div>
          ))}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-wrap gap-1">
              {slice.frames.map((f, i) => (
                <div key={i} className={`relative ${i === frameIdx ? 'ring-2 ring-blue-500' : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`data:image/png;base64,${f}`} alt={`Frame ${i}`} className="h-12 w-12 rounded border border-gray-800 bg-gray-950 object-contain" />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-800 bg-gray-950 p-3 text-center">
                <div className="mb-2 text-xs text-gray-500">Vorschau</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`data:image/png;base64,${slice.frames[frameIdx] ?? slice.frames[0]}`}
                  alt="Animation"
                  className="mx-auto h-32 w-32 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="mt-2 flex items-center justify-center gap-3 text-sm">
                  <button onClick={() => setPlaying((p) => !p)} className="rounded bg-gray-700 px-3 py-1 hover:bg-gray-600">
                    {playing ? '⏸' : '▶'}
                  </button>
                  <label className="flex items-center gap-1 text-xs">
                    FPS
                    <input type="range" min={1} max={24} value={fps} onChange={(e) => setFps(Number(e.target.value))} className="w-24" />
                    {fps}
                  </label>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <span className="w-24">Animation</span>
                  <input value={animName} onChange={(e) => setAnimName(e.target.value)} className="flex-1 rounded border border-gray-700 bg-gray-800 px-2 py-1" />
                </label>
                <label className="flex items-center gap-2">
                  <span className="w-24">Asset-id</span>
                  <input value={assetId} onChange={(e) => setAssetId(e.target.value)} className="flex-1 rounded border border-gray-700 bg-gray-800 px-2 py-1 font-mono text-xs" />
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
                  loop
                </label>
                <button onClick={save} className="w-full rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700">
                  Als Sprite-Sheet speichern
                </button>
                {saveMsg && <div className="text-sm text-green-400">{saveMsg}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
