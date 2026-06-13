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
          <div
            className="px-4 py-3 flex items-center justify-between shrink-0"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              borderBottom: `2px solid ${StoryModeColors.border}`,
            }}
          >
            <div className="font-bold tracking-wider" style={{ color: StoryModeColors.textPrimary }}>
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
                  borderColor: StoryModeColors.borderLight,
                  color: StoryModeColors.textSecondary,
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
