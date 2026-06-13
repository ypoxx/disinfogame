/**
 * PixelFrame — EIN gerahmter Pixel-Container statt der ~14 verschiedenen
 * CSS-Brutalismus-Varianten (border-4/8 + Glow- ODER harter Schlagschatten).
 * Stil-Bibel A4: klare, harte Pixel-Kante + dezenter Innen-Highlight, KEIN
 * abgerundeter Web-Look, KEIN Schlagschatten als Stilträger. Drei Gewichte.
 *
 * Hinweis: bewusst CSS-basiert (kein 9-Slice-Asset nötig) — kohärent, leicht,
 * sofort auf alle Modals/Panels anwendbar. Ein echtes 9-Slice-Asset kann später
 * transparent darunter gelegt werden, ohne die API zu ändern.
 */
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { StoryModeColors } from '../theme';

export type FrameVariant = 'standard' | 'alarm' | 'light';

const VARIANT: Record<FrameVariant, { border: string; bg: string; width: number }> = {
  standard: { border: StoryModeColors.borderLight, bg: StoryModeColors.surface, width: 2 },
  alarm: { border: StoryModeColors.ministryRed, bg: StoryModeColors.surface, width: 3 },
  light: { border: StoryModeColors.borderLight, bg: StoryModeColors.surfaceLight, width: 1 },
};

export interface PixelFrameProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: FrameVariant;
  className?: string;
  style?: CSSProperties;
}

export function PixelFrame({ children, variant = 'standard', className, style, ...rest }: PixelFrameProps): JSX.Element {
  const v = VARIANT[variant];
  return (
    <div
      className={className}
      style={{
        backgroundColor: v.bg,
        border: `${v.width}px solid ${v.border}`,
        borderRadius: 0,
        // dezenter Pixel-Innenrand statt Web-Schatten (oben hell, unten dunkel)
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
        imageRendering: 'pixelated',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default PixelFrame;

