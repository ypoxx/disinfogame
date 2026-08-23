/**
 * PixelFrame — EIN gerahmter Pixel-Container statt der ~14 verschiedenen
 * CSS-Brutalismus-Varianten (border-4/8 + Glow- ODER harter Schlagschatten).
 *
 * v3 „Behörden-Akte" (Stil-Bibel §4.7, L1): Der Rahmen ist aus PAPIER —
 * Creme-Fläche (mit kachelbarer Papier-Textur, sobald das Asset da ist),
 * dunkle Akten-Kante, 2-px-Pixel-VERSATZKANTE statt Web-Schatten (das Papier
 * „liegt auf"). Drei Gewichte: light (Karteikarte) / standard (Mappe) /
 * alarm (rot gestempelter Rand). Jedes Material hat einen CSS-Fallback.
 */
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { StoryModeColors } from '../theme';
import { useAssets } from '../assets/useAssets';

export type FrameVariant = 'standard' | 'alarm' | 'light';

const VARIANT: Record<FrameVariant, { border: string; bg: string; width: number }> = {
  standard: { border: StoryModeColors.border, bg: StoryModeColors.surface, width: 2 },
  alarm: { border: StoryModeColors.ministryRed, bg: StoryModeColors.surface, width: 3 },
  light: { border: StoryModeColors.borderLight, bg: StoryModeColors.surfaceLight, width: 1 },
};

export interface PixelFrameProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: FrameVariant;
  className?: string;
  style?: CSSProperties;
}

// forwardRef, damit PixelModal den Rahmen fokussieren und den Fokusfang darauf
// aufsetzen kann (React 18 reicht `ref` bei Funktionskomponenten nicht durch).
export const PixelFrame = forwardRef<HTMLDivElement, PixelFrameProps>(function PixelFrame(
  { children, variant = 'standard', className, style, ...rest },
  ref,
) {
  const v = VARIANT[variant];
  const assets = useAssets();
  // Papier-Textur (ui_panel_paper) unter dem Inhalt — sehr kontrastarm, Text bleibt
  // Engine-Ebene (E35). Fehlt das Asset, trägt die Flächenfarbe allein.
  const paperUrl = assets.imageUrl('ui_panel_paper');
  // Aufrufer-Override respektieren: wer eine eigene Flächenfarbe setzt, bekommt
  // KEINE opake Papier-Kachel darübergelegt (Code-Review E2).
  const hasBgOverride = style && 'backgroundColor' in style;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        backgroundColor: v.bg,
        ...(paperUrl && !hasBgOverride
          ? {
              backgroundImage: `url(${paperUrl})`,
              backgroundRepeat: 'repeat',
              backgroundSize: '256px 256px',
            }
          : {}),
        border: `${v.width}px solid ${v.border}`,
        borderRadius: 0,
        // §4.7: Papier liegt mit harter 2-px-Versatzkante auf (KEIN weicher Schatten).
        boxShadow: `2px 2px 0 rgba(30, 25, 18, 0.55)`,
        imageRendering: 'pixelated',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

export default PixelFrame;
