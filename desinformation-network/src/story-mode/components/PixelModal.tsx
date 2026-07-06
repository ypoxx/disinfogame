/**
 * PixelModal — EIN Overlay-Rahmen für alle Modals (Stil-Bibel A4, „~10 Modals →
 * EIN Rahmen-System"). Vollbild-Abdunklung + zentrierter `PixelFrame`, optionale
 * Titelzeile mit Schließen-Glyph, optionaler Fuß. Schließt per Backdrop-Klick und
 * Esc (wenn `onClose` gesetzt). Kein Web-Schlagschatten/Glow als Stilträger, keine
 * abgerundeten Pillen — nur die harte Pixel-Kante des `PixelFrame`.
 *
 * Zwei Nutzungsarten:
 *  1. Einfach:   <PixelModal open title="…" onClose={…}>…Body…</PixelModal>
 *  2. Eigener Kopf (z. B. farbiges Severity-Banner): `title` weglassen und den
 *     Header als erstes Kind rendern; `onClose` steuert nur Backdrop/Esc.
 */
import { useEffect, type CSSProperties, type ReactNode } from 'react';
import { StoryModeColors } from '../theme';
import { useAssets } from '../assets/useAssets';
import { PixelFrame, type FrameVariant } from './PixelFrame';

export interface PixelModalProps {
  open: boolean;
  onClose?: () => void;
  variant?: FrameVariant;
  /** Optionale Standard-Titelzeile (links Titel, rechts Schließen-Glyph). */
  title?: ReactNode;
  /** Optionaler Fußbereich (z. B. Aktions-Buttons). */
  footer?: ReactNode;
  /** Tailwind-Breitenklasse, Default `max-w-2xl`. */
  maxWidthClass?: string;
  /** Stapel-Ebene (Default 100). */
  zIndex?: number;
  /** Backdrop-Deckkraft 0..1 (Default 0.85). */
  backdrop?: number;
  /** Backdrop-Klick schließt (Default true, wenn `onClose` gesetzt). */
  closeOnBackdrop?: boolean;
  /** Esc schließt (Default true, wenn `onClose` gesetzt). */
  closeOnEsc?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Style des inneren Body-Containers (scrollbar). */
  bodyStyle?: CSSProperties;
  children: ReactNode;
}

export function PixelModal({
  open,
  onClose,
  variant = 'standard',
  title,
  footer,
  maxWidthClass = 'max-w-2xl',
  zIndex = 100,
  backdrop = 0.85,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className,
  style,
  bodyStyle,
  children,
}: PixelModalProps): React.JSX.Element | null {
  // Kopfband-Material (ui_header_band): Kraftpapier mit Naht + roter Index-Linie
  // (§4.7). Fehlt das Asset, trägt die darkConcrete-Fläche allein.
  const assets = useAssets();
  const headerBandUrl = assets.imageUrl('ui_header_band');
  // Esc schließt (E33: Tastatur). Nur aktiv, solange offen.
  useEffect(() => {
    if (!open || !onClose || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose, closeOnEsc]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ backgroundColor: `rgba(0,0,0,${backdrop})`, zIndex }}
      onClick={onClose && closeOnBackdrop ? onClose : undefined}
    >
      <PixelFrame
        variant={variant}
        className={`w-full ${maxWidthClass} max-h-[90vh] flex flex-col overflow-hidden ${className ?? ''}`}
        style={style}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {title !== undefined && (
          // Kopfband = Kraftpapier-Träger mit Creme-Beschriftung (§4.7: Kopfbänder
          // dürfen dunkel sein; Rot bleibt Stempeln/Alarm vorbehalten).
          <div
            className="px-4 py-3 flex items-center justify-between shrink-0"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              ...(headerBandUrl
                ? {
                    // Flache Abdunklungs-Tönung über der Band-Textur: das Kraftpapier-
                    // Asset ist heller als darkConcrete — ohne Tönung säuft die helle
                    // Kopf-Beschriftung ab (Vision-Review E2 Runde 2).
                    backgroundImage: `linear-gradient(rgba(36,30,22,0.55), rgba(36,30,22,0.55)), url(${headerBandUrl})`,
                    backgroundRepeat: 'repeat-x',
                    backgroundSize: 'auto 100%, auto 100%',
                    imageRendering: 'pixelated',
                  }
                : {}),
              borderBottom: `2px solid ${StoryModeColors.border}`,
            }}
          >
            <div className="font-bold tracking-wider" style={{ color: StoryModeColors.surfaceLight }}>
              {title}
            </div>
            {onClose && (
              <button
                onClick={onClose}
                aria-label="Schließen"
                title="Schließen (Esc)"
                className="w-7 h-7 flex items-center justify-center border-2 hover:brightness-125 transition-all"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: StoryModeColors.lightConcrete,
                  color: StoryModeColors.surfaceLight,
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto" style={bodyStyle}>
          {children}
        </div>

        {footer !== undefined && (
          <div
            className="px-4 py-3 shrink-0"
            style={{ borderTop: `2px solid ${StoryModeColors.border}`, backgroundColor: StoryModeColors.surface }}
          >
            {footer}
          </div>
        )}
      </PixelFrame>
    </div>
  );
}

export default PixelModal;
