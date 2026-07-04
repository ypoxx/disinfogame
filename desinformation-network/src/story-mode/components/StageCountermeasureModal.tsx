import { useState } from 'react';
import { StoryModeColors } from '../theme';
import { PixelFrame } from './PixelFrame';
import type {
  StageCountermeasureOffer,
  StageCountermeasureChoice,
  StageCountermeasureResolution,
} from '../../game-logic/StoryEngineAdapter';

// ============================================
// STUFEN-GEGENMASSNAHME (Etappe 3, Paket B)
// ============================================
// Erscheint, wenn die ABWEHR eine Stufe (25/50/75) überschreitet: das Land feuert
// eine kuratierte DISARM-Maßnahme (Prebunking / Plattform-Sperre / Task-Force).
// Der Spieler reagiert mit 2–3 vereinheitlichten Optionen. Ton-Regel (E8): Die
// WELT (Maßnahme) darf laut sein, die AGENTUR (Quittung) bleibt kühl — grauer
// Stempel, nüchterne Zahlenzeilen, keine Feiern.

interface StageCountermeasureModalProps {
  offer: StageCountermeasureOffer | null;
  onResolve: (choice: StageCountermeasureChoice) => StageCountermeasureResolution | null;
  /** Nach der Quittung: Modal schließen (Hook prüft, ob eine weitere Stufe ansteht). */
  onClose: () => void;
}

export function StageCountermeasureModal({ offer, onResolve, onClose }: StageCountermeasureModalProps) {
  const [resolution, setResolution] = useState<StageCountermeasureResolution | null>(null);

  if (!offer && !resolution) return null;

  const stageColor =
    (offer?.stage ?? resolution?.stage ?? 25) >= 75 ? StoryModeColors.danger : StoryModeColors.warning;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[60]"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.92)' }}
    >
      <PixelFrame
        variant="alarm"
        className="w-full max-w-2xl mx-4 flex flex-col overflow-hidden"
        style={{ borderColor: stageColor }}
      >
        {/* Kopf: die Maßnahme (die Welt darf laut sein) */}
        <div className="px-6 py-4 border-b-2" style={{ borderColor: StoryModeColors.border }}>
          <div
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: stageColor }}
          >
            ABWEHR-STUFE {resolution?.stage ?? offer?.stage} — GEGENMASSNAHME
          </div>
          <h2 className="text-xl font-bold" style={{ color: StoryModeColors.textPrimary }}>
            {resolution?.label_de ?? offer?.definition.label_de}
          </h2>
        </div>

        {resolution === null && offer ? (
          <>
            <div className="px-6 py-4">
              <p className="text-sm leading-relaxed" style={{ color: StoryModeColors.textSecondary }}>
                {offer.definition.narrative_de}
              </p>
            </div>

            {/* Reaktionen: kontern / aussitzen / ablenken (vereinheitlicht, Zielbild §3) */}
            <div className="px-6 pb-6 flex flex-col gap-2">
              {offer.options.map((opt) => (
                <button
                  key={opt.id}
                  disabled={!opt.available}
                  onClick={() => setResolution(onResolve(opt.id))}
                  className="text-left px-4 py-3 border-2 font-mono"
                  style={{
                    backgroundColor: StoryModeColors.surface,
                    borderColor: opt.available ? StoryModeColors.borderLight : StoryModeColors.border,
                    color: opt.available ? StoryModeColors.textPrimary : StoryModeColors.textSecondary,
                    opacity: opt.available ? 1 : 0.5,
                    cursor: opt.available ? 'pointer' : 'not-allowed',
                  }}
                >
                  <div className="text-sm font-bold uppercase tracking-wider">{opt.label_de}</div>
                  <div className="text-xs mt-1" style={{ color: StoryModeColors.textSecondary }}>
                    {opt.folge_de}
                    {!opt.available ? ' — Budget reicht nicht' : ''}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : resolution ? (
          <>
            {/* Quittung: grauer Kastenstempel, nüchterne Zeilen (E8) */}
            <div className="px-6 py-4">
              <div
                className="inline-block px-3 py-1 border-2 text-xs font-bold tracking-widest mb-3"
                style={{ borderColor: StoryModeColors.textSecondary, color: StoryModeColors.textSecondary }}
              >
                VOLLZOGEN.
              </div>
              <ul className="flex flex-col gap-1">
                {resolution.lines_de.map((line, i) => (
                  <li key={i} className="text-sm font-mono" style={{ color: StoryModeColors.textSecondary }}>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => { setResolution(null); onClose(); }}
                className="px-4 py-2 border-2 text-sm font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: StoryModeColors.surface,
                  borderColor: StoryModeColors.borderLight,
                  color: StoryModeColors.textPrimary,
                }}
              >
                Weiter ▸
              </button>
            </div>
          </>
        ) : null}
      </PixelFrame>
    </div>
  );
}
