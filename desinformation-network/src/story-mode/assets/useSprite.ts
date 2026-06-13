// ===========================================
// useSprite — Sprite-Sheet-Animation per background-position
// ===========================================
// Umsetzung des Bauplans aus BUILDING_CONCEPT.md (§Sprite Animation System):
// Frames liegen als Raster im Sheet; pro Tick wandert background-position um
// eine Frame-Breite. Kein Canvas nötig, Pixel-Look via imageRendering.
// Gerendert wird in natürlicher Frame-Größe; Skalierung machen Aufrufer
// bei Bedarf per CSS-Transform auf einem Wrapper.

import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { SheetInfo } from './types';

export interface SpriteRender {
  /** Style für ein <span>/<div>, das genau einen Frame zeigt. */
  style: CSSProperties;
  frame: number;
}

/**
 * Animiert ein Sheet. `sheet` darf null sein (Asset fehlt) — dann kommt null
 * zurück und der Aufrufer rendert seinen Fallback (z. B. Emoji).
 * `frameTimeMsOverride` koppelt die Abspielgeschwindigkeit an die Bewegung
 * (Godot-speed_scale-Prinzip): Laufgeschwindigkeit ↔ Schrittweite bleiben
 * synchron, kein „Foot Sliding".
 */
export function useSprite(
  sheet: SheetInfo | null,
  animationName: string,
  frameTimeMsOverride?: number
): SpriteRender | null {
  const animation = sheet?.animations[animationName] ?? null;
  const [frame, setFrame] = useState(0);
  const frameTime = frameTimeMsOverride ?? animation?.frameTime ?? 120;

  useEffect(() => {
    setFrame(0);
    if (!sheet || !animation || animation.frames <= 1) return;
    const interval = setInterval(() => {
      setFrame((f) => {
        const next = f + 1;
        if (next < animation.frames) return next;
        return animation.loop ? 0 : f;
      });
    }, Math.max(30, frameTime));
    return () => clearInterval(interval);
  }, [sheet, animation, animationName, frameTime]);

  return useMemo(() => {
    if (!sheet || !animation) return null;
    const row = animation.row ?? 0;
    const style: CSSProperties = {
      display: 'inline-block',
      width: sheet.frameWidth,
      height: sheet.frameHeight,
      backgroundImage: `url(${sheet.url})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: `-${frame * sheet.frameWidth}px -${row * sheet.frameHeight}px`,
      imageRendering: 'pixelated',
    };
    return { style, frame };
  }, [sheet, animation, frame]);
}
