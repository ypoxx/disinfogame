/**
 * Scroll-Affordanz „▼ MEHR" — der statische Pixel-Marker, der anzeigt, dass unter
 * der Kante noch etwas liegt.
 *
 * Herkunft: Review-Punkt B24 an der `DialogBox` — „ohne ihn wirkte die letzte
 * Option ‚halb abgeschnitten'". Das `DecisionBeatModal` hat aus demselben
 * Review-Punkt nur die Höhen-Deckelung übernommen, nicht die Affordanz, und
 * genau dort meldeten beide Fremdmodelle 2026-08-22 wieder „Option C wird
 * abgeschnitten" (P2). Deshalb liegt das Muster jetzt hier statt zweimal
 * ausgeschrieben: Die dritte gedeckelte Liste soll es sich holen können.
 *
 * §4.6: kein Web-Verlauf, kein Blinken — gestempelt statt geblinkt.
 */
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { StoryModeColors, StoryModeType } from '../theme';

export interface ScrollHintSteuerung {
  /** An den scrollbaren Container hängen. */
  ref: RefObject<HTMLDivElement>;
  /** An dessen `onScroll` hängen. */
  onScroll: () => void;
  /** True, solange unterhalb der Kante noch Inhalt liegt. */
  sichtbar: boolean;
  /** Nach Inhaltswechseln neu messen (die Box existiert erst nach dem Render). */
  messen: () => void;
}

/**
 * @param abhaengigkeiten Werte, nach deren Änderung neu gemessen wird —
 *   Anzahl der Einträge, Sichtbarkeit, Textwechsel. Vor dem ersten Render gibt
 *   es die Scroll-Box noch nicht, ein einmaliges Messen beim Mount genügt nicht.
 */
export function useScrollHint(abhaengigkeiten: unknown[] = []): ScrollHintSteuerung {
  const ref = useRef<HTMLDivElement>(null);
  const [sichtbar, setSichtbar] = useState(false);

  const messen = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // Toleranz gegen Subpixel-Rundung; am Listenende verschwindet der Hinweis.
    setSichtbar(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
  }, []);

  useEffect(() => {
    messen();
    // maxHeight ist vh-abhängig — bei Fenster-Änderung stimmt die Messung sonst nicht mehr.
    window.addEventListener('resize', messen);
    return () => window.removeEventListener('resize', messen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messen, ...abhaengigkeiten]);

  return { ref, onScroll: messen, sichtbar, messen };
}

/** Den Marker rendern. Gehört in einen `relative`-Wrapper um die Scroll-Box. */
export function ScrollHint({ sichtbar, label = '▼ MEHR' }: { sichtbar: boolean; label?: string }) {
  if (!sichtbar) return null;
  return (
    // pointer-events-none, damit Klicks die Einträge darunter erreichen.
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-center">
      <span
        className="font-bold"
        style={{
          fontSize: StoryModeType.small,
          color: StoryModeColors.warning,
          backgroundColor: 'rgba(10,10,14,0.92)',
          border: `1px solid ${StoryModeColors.borderLight}`,
          padding: '1px 8px',
        }}
      >
        {label}
      </span>
    </div>
  );
}
