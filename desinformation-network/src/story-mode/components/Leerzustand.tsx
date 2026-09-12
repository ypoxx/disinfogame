/**
 * Leerzustand — „hier ist nichts, und das ist in Ordnung".
 *
 * P9 (Fremdmodell-Durchgang 2026-08-22): Acht Fundstellen erfanden vier
 * verschiedene Formen; genau eine (EventsPanel) hatte Icon + Überschrift +
 * Unterzeile, der Rest war nackter Text.
 *
 * Die eigentliche Ursache nennt keiner der beiden Berichte: Die Leerzustände
 * saßen in Containern OHNE vertikale Zentrierung — der Satz klebte oben, darunter
 * blieb die volle Panelhöhe leer. Genau deshalb lasen sie sich wie FEHLENDER
 * INHALT statt wie ein Zustand. Der tragende Teil ist die Zentrierung, nicht das
 * Icon: `variant="panel"` füllt die Höhe und rückt die Mitte, `variant="inline"`
 * ist für Abschnitte innerhalb eines Berichts, wo eine ganze leere Fläche falsch
 * wäre.
 */
import { StoryModeColors, StoryModeType } from '../theme';
import { Icon } from './Icon';
import type { ComponentProps } from 'react';

type IconName = ComponentProps<typeof Icon>['name'];

export interface LeerzustandProps {
  /** Was fehlt — eine Zeile, ohne Punkt. */
  titel: string;
  /** Warum das in Ordnung ist oder was es füllen würde. */
  hinweis?: string;
  icon?: IconName;
  /** `panel` füllt die Fläche und zentriert; `inline` bleibt kompakt. */
  variant?: 'panel' | 'inline';
}

export function Leerzustand({ titel, hinweis, icon, variant = 'panel' }: LeerzustandProps) {
  if (variant === 'inline') {
    return (
      <div style={{ color: StoryModeColors.textMuted, fontSize: StoryModeType.small, lineHeight: 1.5 }}>
        <span style={{ fontWeight: 700 }}>{titel}</span>
        {hinweis && <span> · {hinweis}</span>}
      </div>
    );
  }

  return (
    <div
      // `h-full` statt `flex-1`: Die Eltern-Container sind teils Flex-Kinder,
      // teils gewöhnliche Scroll-Boxen — ein `flex-1` würde in den letzteren
      // wirkungslos bleiben und der Satz klebte weiter oben, also genau der
      // Zustand, den P9 beschreibt. Die Mindesthöhe trägt den Fall, in dem der
      // Container selbst nur so hoch ist wie sein Inhalt.
      className="h-full min-h-[9rem] flex flex-col items-center justify-center text-center px-6 py-10"
      style={{ color: StoryModeColors.textMuted }}
      data-testid="leerzustand"
    >
      {icon && (
        <div className="mb-3 opacity-60">
          <Icon name={icon} size={40} title="" fallback="" />
        </div>
      )}
      <div style={{ fontSize: StoryModeType.body, fontWeight: 700, marginBottom: hinweis ? 6 : 0 }}>{titel}</div>
      {hinweis && (
        <div style={{ fontSize: StoryModeType.small, maxWidth: '32rem', lineHeight: 1.5 }}>{hinweis}</div>
      )}
    </div>
  );
}

export default Leerzustand;
