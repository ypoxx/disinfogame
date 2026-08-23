import { StoryModeColors, scrim } from '../theme';
import { PixelFrame } from './PixelFrame';
import { useScrollHint, ScrollHint } from './ScrollHint';
import { SOCIETY_VALUE_META, type SocietyValueKey, type DecisionBeatResult } from '../../game-logic/StoryEngineAdapter';
import type { DecisionBeat, WerteDelta } from '../engine/DecisionBeats';

interface DecisionBeatModalProps {
  isVisible: boolean;
  beat: DecisionBeat | null;
  /** Gesetzt, sobald gewählt wurde → Ergebnis-Ansicht (T1: Wirkung sichtbar). */
  result: DecisionBeatResult | null;
  /** Vom Berater für die aktuelle Lage empfohlene Option (strategie-/lage-relativ). */
  recommendedOptionId?: string;
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
  // B23: Budget symbolfrei („-40K") — kein „$" in der fiktiven Ost-Block-Welt.
  if (kosten.budget) items.push(`${kosten.budget > 0 ? '+' : '-'}${Math.abs(kosten.budget)}K`);
  if (kosten.moralWeight) items.push(`${kosten.moralWeight > 0 ? '+' : ''}${kosten.moralWeight} Moral`);
  if (items.length === 0) return null;
  return (
    // P11 (Fremdmodell-Durchgang 2026-08-22): Die Wirkungswerte standen auf drei
    // x-Positionen. Es gibt nur EINEN Codepfad — die scheinbare „Spalte" war ein
    // Umbruch INNERHALB jedes Chips: Ohne `shrink-0` schrumpfte die Kosten-Zeile
    // proportional zum Titel, ohne `whitespace-nowrap` brach jeder Chip zwischen
    // Zahl und Label um. Option A (kurzer Titel) blieb einzeilig, B und C nicht.
    // Genau diese Werte vergleicht der Spieler, wenn er sich entscheidet.
    <div className="flex gap-2 text-xs shrink-0 whitespace-nowrap" style={{ color: StoryModeColors.danger }}>
      {items.map((t) => <span key={t}>{t}</span>)}
    </div>
  );
}

export function DecisionBeatModal({ isVisible, beat, result, recommendedOptionId, onChoose, onClose }: DecisionBeatModalProps) {
  const optionenHint = useScrollHint([isVisible, beat?.id, result]);
  if (!isVisible || !beat) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: scrim('schwer') }}>
      {/* B24: nie höher als der Bildschirm — Kopf/Fuß bleiben fix, der Mittelteil
          (Optionen) scrollt innen; sonst wurde Option D unterhalb der Kante gekappt.

          P2 (Fremdmodell-Durchgang 2026-08-22): 100vh war der Ausreißer — JEDES
          andere Modal deckelt bei 80–94vh (PixelModal 90, CrisisModal 90,
          BetrayalEventModal 90, NpcPanel/MissionPanel/EventsPanel 85,
          NarrativeBoard 94). Bei 1280×720 fiel die Papierkante des PixelFrame
          damit exakt mit der Bildschirmkante zusammen: 720 von 720 px, Rand null,
          kein sichtbarer Fensterabschluss. Beide Modelle lasen das als
          „abgeschnitten" — und schlugen einen Fußleisten-Umbau vor, der wirkungslos
          geblieben wäre: Kopf, Scrollbereich und Fuß sind längst drei Geschwister. */}
      <PixelFrame variant="standard" className="w-full max-w-xl mx-4 max-h-[90vh] flex flex-col min-h-0">
        {/* Header */}
        <div
          className="px-6 py-4 border-b-4 shrink-0"
          style={{ backgroundColor: StoryModeColors.ministryRed, borderColor: StoryModeColors.border }}
        >
          <h2 className="font-bold text-xl" style={{ color: '#fff' }}>{beat.name_de}</h2>
          <span className="text-xs uppercase" style={{ color: 'rgba(255,255,255,0.8)' }}>
            ENTSCHEIDUNG · {beat.ort_de} · {beat.leitspannung_de}
          </span>
        </div>

        {result ? (
          /* === Ergebnis-Ansicht === */
          <div className="p-6 space-y-4 flex-1 min-h-0 overflow-y-auto">
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
              // v3 §4.7: dunkles Kraftband → helle Beschriftung (Tinte wäre unlesbar).
              style={{ backgroundColor: StoryModeColors.darkConcrete, borderColor: StoryModeColors.border, color: StoryModeColors.surfaceLight }}
            >
              ZURÜCK AN DIE ARBEIT
            </button>
          </div>
        ) : (
          /* === Auswahl-Ansicht === */
          <div className="relative flex-1 min-h-0 flex flex-col">
          <div
            ref={optionenHint.ref}
            onScroll={optionenHint.onScroll}
            className="p-6 space-y-4 flex-1 min-h-0 overflow-y-auto"
          >
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
                    // v3 §4.7: Options-Karten sind Papier — Tinten-Text bleibt lesbar.
                    backgroundColor: StoryModeColors.surface,
                    borderColor: StoryModeColors.border,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
                  }}
                >
                  <div className="flex justify-between items-start mb-1 gap-3">
                    <span className="font-bold min-w-0" style={{ color: StoryModeColors.textPrimary }}>
                      {opt.id} · {opt.label_de}
                      {recommendedOptionId === opt.id && (
                        <span
                          className="ml-2 text-xs px-1.5 py-0.5 border align-middle"
                          style={{ borderColor: StoryModeColors.warning, color: StoryModeColors.warning }}
                        >
                          ★ BERATER RÄT
                        </span>
                      )}
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
          {/* Aus B24 hatte dieses Modal nur die Höhen-Deckelung übernommen, nicht
              die Affordanz — der Beat „stadtrat" hat vier Optionen, sichtbar waren
              A, B und der Kopf von C. */}
          <ScrollHint sichtbar={optionenHint.sichtbar} />
          </div>
        )}

        {/* Footer */}
        <div
          className="px-6 py-3 border-t-4 text-center text-xs shrink-0"
          // v3: Fußzeile Papier + Tinte (wie PixelModal-Footer)
          style={{ backgroundColor: StoryModeColors.surface, borderColor: StoryModeColors.border, color: StoryModeColors.textMuted }}
        >
          Keine Option ist überall die beste — jede zahlt woanders.
        </div>
      </PixelFrame>
    </div>
  );
}

export default DecisionBeatModal;
