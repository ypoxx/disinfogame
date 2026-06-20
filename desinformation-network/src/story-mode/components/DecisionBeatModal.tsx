import { StoryModeColors } from '../theme';
import { PixelFrame } from './PixelFrame';
import { SOCIETY_VALUE_META, type SocietyValueKey, type DecisionBeatResult } from '../../game-logic/StoryEngineAdapter';
import type { DecisionBeat, WerteDelta } from '../engine/DecisionBeats';

interface DecisionBeatModalProps {
  isVisible: boolean;
  beat: DecisionBeat | null;
  /** Gesetzt, sobald gewählt wurde → Ergebnis-Ansicht (T1: Wirkung sichtbar). */
  result: DecisionBeatResult | null;
  onChoose: (optionId: string) => void;
  onClose: () => void;
}

/** Werte-Deltas als lesbare Chips (Vertrauen bleibt entkoppelt → nicht angezeigt). */
function WerteChips({ delta }: { delta: WerteDelta }) {
  const keys = (Object.keys(delta) as (keyof WerteDelta)[]).filter(
    (k) => k !== 'vertrauen' && typeof delta[k] === 'number' && delta[k] !== 0,
  ) as SocietyValueKey[];
  if (keys.length === 0) {
    return <span className="text-xs" style={{ color: StoryModeColors.textMuted }}>kein Werte-Effekt</span>;
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {keys.map((k) => {
        const v = delta[k] as number;
        const up = v > 0;
        return (
          <span
            key={k}
            className="text-xs px-1.5 py-0.5 border"
            style={{
              borderColor: StoryModeColors.border,
              color: up ? StoryModeColors.warning : StoryModeColors.textSecondary,
            }}
          >
            {SOCIETY_VALUE_META[k].label_de} {up ? '▲' : '▼'}
          </span>
        );
      })}
    </div>
  );
}

function KostenChips({ kosten }: { kosten: { risk?: number; attention?: number; budget?: number; moralWeight?: number } }) {
  const items: string[] = [];
  if (kosten.risk) items.push(`${kosten.risk > 0 ? '+' : ''}${kosten.risk}% Risiko`);
  if (kosten.attention) items.push(`${kosten.attention > 0 ? '+' : ''}${kosten.attention}% Aufmerksamkeit`);
  if (kosten.budget) items.push(`${kosten.budget > 0 ? '+' : '-'}$${Math.abs(kosten.budget)}K`);
  if (kosten.moralWeight) items.push(`${kosten.moralWeight > 0 ? '+' : ''}${kosten.moralWeight} Moral`);
  if (items.length === 0) return null;
  return (
    <div className="flex gap-2 text-xs" style={{ color: StoryModeColors.danger }}>
      {items.map((t) => <span key={t}>{t}</span>)}
    </div>
  );
}

export function DecisionBeatModal({ isVisible, beat, result, onChoose, onClose }: DecisionBeatModalProps) {
  if (!isVisible || !beat) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
      <PixelFrame variant="standard" className="w-full max-w-xl mx-4">
        {/* Header */}
        <div
          className="px-6 py-4 border-b-4"
          style={{ backgroundColor: StoryModeColors.ministryRed, borderColor: StoryModeColors.border }}
        >
          <h2 className="font-bold text-xl" style={{ color: '#fff' }}>{beat.name_de}</h2>
          <span className="text-xs uppercase" style={{ color: 'rgba(255,255,255,0.8)' }}>
            ENTSCHEIDUNG · {beat.ort_de} · {beat.leitspannung_de}
          </span>
        </div>

        {result ? (
          /* === Ergebnis-Ansicht === */
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-bold" style={{ color: StoryModeColors.textPrimary }}>
              {result.optionLabel_de}
            </h3>
            <p className="text-xs uppercase" style={{ color: StoryModeColors.textMuted }}>
              Reale Technik: {result.technik_de}
            </p>
            <p className="text-sm" style={{ color: StoryModeColors.textSecondary }}>{result.narrative_de}</p>

            <div className="space-y-2 border-t-2 pt-3" style={{ borderColor: StoryModeColors.border }}>
              <h4 className="font-bold text-sm" style={{ color: StoryModeColors.textSecondary }}>
                WIRKUNG AUF DIE GESELLSCHAFT
              </h4>
              {result.societyChanges && Object.keys(result.societyChanges).filter((k) => k !== 'vertrauen').length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(result.societyChanges) as (SocietyValueKey | 'vertrauen')[])
                    .filter((k) => k !== 'vertrauen' && result.societyChanges![k] !== 0)
                    .map((k) => {
                      const v = result.societyChanges![k] as number;
                      return (
                        <span
                          key={k}
                          className="text-xs px-1.5 py-0.5 border"
                          style={{ borderColor: StoryModeColors.border, color: v > 0 ? StoryModeColors.warning : StoryModeColors.textSecondary }}
                        >
                          {SOCIETY_VALUE_META[k as SocietyValueKey].label_de} {v > 0 ? `+${v}` : v}
                        </span>
                      );
                    })}
                </div>
              ) : (
                <span className="text-xs" style={{ color: StoryModeColors.textMuted }}>keine messbare Verschiebung</span>
              )}
              <KostenChips kosten={result.resourceChanges} />
            </div>

            <button
              onClick={onClose}
              className="w-full p-3 border-4 font-bold hover:brightness-110 active:translate-y-0.5"
              style={{ backgroundColor: StoryModeColors.darkConcrete, borderColor: StoryModeColors.border, color: StoryModeColors.textPrimary }}
            >
              ZURÜCK AN DIE ARBEIT
            </button>
          </div>
        ) : (
          /* === Auswahl-Ansicht === */
          <div className="p-6 space-y-4">
            <p className="text-sm" style={{ color: StoryModeColors.textSecondary }}>{beat.anlass_de}</p>
            <h4 className="font-bold text-sm" style={{ color: StoryModeColors.textSecondary }}>
              IHRE ENTSCHEIDUNG (abgewogen gegen: {beat.kostenAchse_de}):
            </h4>
            <div className="space-y-3">
              {beat.optionen.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChoose(opt.id)}
                  className="w-full text-left p-4 border-4 transition-all hover:brightness-110 active:translate-y-0.5"
                  style={{
                    backgroundColor: StoryModeColors.darkConcrete,
                    borderColor: StoryModeColors.border,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
                  }}
                >
                  <div className="flex justify-between items-start mb-1 gap-3">
                    <span className="font-bold" style={{ color: StoryModeColors.textPrimary }}>
                      {opt.id} · {opt.label_de}
                    </span>
                    <KostenChips kosten={opt.spielerKosten} />
                  </div>
                  <p className="text-xs mb-2" style={{ color: StoryModeColors.textMuted }}>
                    Technik: {opt.technik_de}
                  </p>
                  <p className="text-sm mb-2" style={{ color: StoryModeColors.textSecondary }}>{opt.wirkung_de}</p>
                  <WerteChips delta={opt.werteDelta} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="px-6 py-3 border-t-4 text-center text-xs"
          style={{ backgroundColor: StoryModeColors.darkConcrete, borderColor: StoryModeColors.border, color: StoryModeColors.textMuted }}
        >
          Keine Option ist überall die beste — jede zahlt woanders.
        </div>
      </PixelFrame>
    </div>
  );
}

export default DecisionBeatModal;
