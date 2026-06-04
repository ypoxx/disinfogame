'use client';

// ===========================================
// REGION-EDITOR — klickbare Hotspots auf Raum-Hintergründen
// ===========================================
// Rechtecke per Ziehen markieren → liefern x/y/w/h (in Bild-Pixeln) für die
// regions im assets.json (→ building.json/Räume im Spiel). Koordinaten werden in
// NATÜRLICHEN Bildpixeln gespeichert, unabhängig von der Anzeigegröße.

import { useRef, useState } from 'react';
import type { AssetRegion } from '@/lib/assets';

export function RegionEditor({
  base64,
  regions,
  onChange,
}: {
  base64: string;
  regions: AssetRegion[];
  onChange: (regions: AssetRegion[]) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [natural, setNatural] = useState<{ w: number; h: number }>({ w: 1, h: 1 });
  const [drag, setDrag] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  function toNatural(clientX: number, clientY: number): { x: number; y: number } {
    const el = wrapRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    const sx = natural.w / rect.width;
    const sy = natural.h / rect.height;
    return {
      x: Math.max(0, Math.min(natural.w, (clientX - rect.left) * sx)),
      y: Math.max(0, Math.min(natural.h, (clientY - rect.top) * sy)),
    };
  }

  function onDown(e: React.MouseEvent) {
    const p = toNatural(e.clientX, e.clientY);
    startRef.current = p;
    setDrag({ x: p.x, y: p.y, w: 0, h: 0 });
  }
  function onMove(e: React.MouseEvent) {
    if (!startRef.current) return;
    const p = toNatural(e.clientX, e.clientY);
    const s = startRef.current;
    setDrag({ x: Math.min(s.x, p.x), y: Math.min(s.y, p.y), w: Math.abs(p.x - s.x), h: Math.abs(p.y - s.y) });
  }
  function onUp() {
    if (drag && drag.w > 4 && drag.h > 4) {
      const id = `hotspot_${regions.length + 1}`;
      onChange([
        ...regions,
        {
          id,
          x: Math.round(drag.x),
          y: Math.round(drag.y),
          w: Math.round(drag.w),
          h: Math.round(drag.h),
        },
      ]);
    }
    startRef.current = null;
    setDrag(null);
  }

  const scaleX = (v: number) => `${(v / natural.w) * 100}%`;
  const scaleY = (v: number) => `${(v / natural.h) * 100}%`;

  return (
    <div className="space-y-2">
      <div
        ref={wrapRef}
        className="relative inline-block max-w-full cursor-crosshair select-none"
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${base64}`}
          alt="Raum"
          draggable={false}
          onLoad={(e) =>
            setNatural({ w: e.currentTarget.naturalWidth || 1, h: e.currentTarget.naturalHeight || 1 })
          }
          className="block max-h-[420px] w-auto rounded"
        />
        {regions.map((r) => (
          <div
            key={r.id}
            className="absolute border-2 border-red-500/80 bg-red-500/15"
            style={{ left: scaleX(r.x), top: scaleY(r.y), width: scaleX(r.w), height: scaleY(r.h) }}
          >
            <span className="absolute left-0 top-0 bg-red-600 px-1 text-[10px] text-white">{r.id}</span>
          </div>
        ))}
        {drag && (
          <div
            className="absolute border-2 border-blue-400 bg-blue-400/15"
            style={{ left: scaleX(drag.x), top: scaleY(drag.y), width: scaleX(drag.w), height: scaleY(drag.h) }}
          />
        )}
      </div>

      {regions.length > 0 && (
        <div className="space-y-1">
          {regions.map((r, idx) => (
            <div key={`${r.id}-${idx}`} className="flex items-center gap-2 text-xs">
              <input
                value={r.id}
                onChange={(e) =>
                  onChange(regions.map((x, i) => (i === idx ? { ...x, id: e.target.value } : x)))
                }
                className="w-32 rounded border border-gray-700 bg-gray-800 px-2 py-1 font-mono"
              />
              <span className="text-gray-500">
                {r.x},{r.y} · {r.w}×{r.h}
              </span>
              <button
                onClick={() => onChange(regions.filter((_, i) => i !== idx))}
                className="ml-auto text-gray-600 hover:text-red-400"
              >
                löschen
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-[11px] text-gray-600">Ziehe Rechtecke über klickbare Bereiche (TV, Tür, Telefon…).</p>
    </div>
  );
}
