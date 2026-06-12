/**
 * PixelSprite — animiertes Sheet-Sprite (×skaliert, pixelig) mit Emoji-Fallback.
 * Gemeinsamer Baustein für BuildingStage (Figuren) und BroadcastBar (Publikum).
 */
import type { ReactNode } from 'react';
import { useAssets } from './useAssets';
import { useSprite } from './useSprite';

export function PixelSprite({
  sheetId,
  animation,
  fallback,
  flip = false,
  scale = 2,
  title,
}: {
  sheetId: string;
  animation: string;
  fallback: ReactNode;
  flip?: boolean;
  scale?: number;
  title?: string;
}) {
  const assets = useAssets();
  const sprite = useSprite(assets.sheet(sheetId), animation);
  if (!sprite) {
    return (
      <span style={{ fontSize: 14 * scale }} title={title}>
        {fallback}
      </span>
    );
  }
  return (
    <span
      style={{
        ...sprite.style,
        imageRendering: 'pixelated',
        transform: `scale(${scale}) ${flip ? 'scaleX(-1)' : ''}`,
        transformOrigin: 'bottom center',
      }}
      title={title}
      aria-label={title}
    />
  );
}

export default PixelSprite;
