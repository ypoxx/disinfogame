/**
 * usePixelFit — Browser-Hooks für die pixel-saubere Skalierung (§4.1/B1):
 * Elementgröße beobachten, native Bildmaße ermitteln, Cover-Snap berechnen.
 * Die reine Mathematik liegt in building/pixelScale.ts (getestet).
 */
import { useEffect, useLayoutEffect, useState, type RefObject } from 'react';
import { snapCoverScale, type CoverSnap } from '../building/pixelScale';

export function useElementSize(ref: RefObject<HTMLElement | null>): { w: number; h: number } {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    // jsdom (vitest) kennt keinen ResizeObserver — dort reicht die Erstmessung.
    if (typeof ResizeObserver === 'undefined') return;
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return size;
}

const naturalSizeCache = new Map<string, { w: number; h: number }>();

/** Native Bildmaße (gecacht) — Grundlage für ganzzahlige Anzeige-Faktoren. */
export function useNaturalSize(url: string | null | undefined): { w: number; h: number } | null {
  const [size, setSize] = useState<{ w: number; h: number } | null>(url ? naturalSizeCache.get(url) ?? null : null);
  useEffect(() => {
    if (!url) { setSize(null); return; }
    const cached = naturalSizeCache.get(url);
    if (cached) { setSize(cached); return; }
    let alive = true;
    const img = new Image();
    img.onload = () => {
      const s = { w: img.naturalWidth, h: img.naturalHeight };
      naturalSizeCache.set(url, s);
      if (alive) setSize(s);
    };
    img.src = url;
    return () => { alive = false; };
  }, [url]);
  return size;
}

/**
 * Pixel-sauberer Ersatz für `background-size: cover`/`object-fit: cover`.
 * Liefert null, solange Fläche oder Bildmaße noch unbekannt sind.
 */
export function usePixelCover(
  area: { w: number; h: number },
  natural: { w: number; h: number } | null,
  maxCrop = 0.2,
): CoverSnap | null {
  if (!natural || area.w <= 0 || area.h <= 0) return null;
  return snapCoverScale(area.w, area.h, natural.w, natural.h, undefined, maxCrop);
}
