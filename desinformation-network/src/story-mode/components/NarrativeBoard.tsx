/**
 * NarrativeBoard — die Narrativ-Tafel (Korkbrett) als diegetisches Planungs-
 * Herzstück (Strang 2 / 2f). Sie ist unser „Sendeplan" (GESAMTKONZEPT §2):
 *
 *  - 2–3 laufende Narrative als SPUREN (E2: Start 2, max 3 via Gebäude-Wachstum).
 *  - Gelegenheits-Fenster als ROTE FÄDEN mit Ablaufdatum (Combos mit Verfall).
 *
 * N3 (PLAN 2026-07-07): Der Zweitkatalog („MASSNAHMEN je Büro" samt SOFORT)
 * ist entfallen — Regel §4.1: das TERMINAL wählt Maßnahmen (Taste A, dort
 * „Anheften"), die TAFEL plant und spielt aus. A1: nichts geht verloren —
 * Lösen = removeFromQueue, „Ausspielen" = executeQueue; Wählen/Sofort lebt
 * am Terminal. Engine unangetastet.
 */
import { useEffect, useMemo } from 'react';
import { StoryModeColors } from '../theme';
import { Icon } from './Icon';
import { playSound } from '../utils/SoundSystem';
import { isQueueBudgetFeasible } from '../utils/queueAffordability';
import type { QueuedAction } from '../hooks/useStoryGameState';

// ─── Typen ────────────────────────────────────────────────────────────────────

export interface BoardObjective {
  id: string;
  label_de: string;
  currentValue: number;
  targetValue: number;
  completed: boolean;
  isPrimary: boolean;
  /** Engine-Kategorie: 'survival' = Halte-Ziel ohne lebendes currentValue (B22). */
  category?: string;
}

export interface BoardThread {
  id: string;
  name: string;
  hint: string;
  progress: number; // 0..1
  expiresIn: number; // Phasen bis Ablauf
}

interface NarrativeBoardProps {
  objectives: BoardObjective[];
  queue: QueuedAction[];
  threads: BoardThread[];
  resources: { budget: number; capacity: number; actionPoints: number };
  /** N2 (PLAN 2026-07-07): das Wettrennen als Kopf-Notiz — die zwei Läufer
   *  ersetzen das Alt-Vokabular („destabilisieren unter 40"). */
  sonntagsfrage?: { pollPct: number; thresholdPct: number };
  abwehr?: number;
  /** E2: gleichzeitige Narrativ-Spuren (Start 2, max 3). */
  narrativeSlots?: number;
  onUnpin: (queueItemId: string) => void;
  onPlay: () => void;
  onClear: () => void;
  onClose: () => void;
}

const LEGAL_COLOR: Record<QueuedAction['legality'], string> = {
  legal: StoryModeColors.success,
  grey: StoryModeColors.warning,
  illegal: StoryModeColors.danger,
};

const SPUR_LABELS = ['SPUR A', 'SPUR B', 'SPUR C'];

const KEYFRAMES = `
  @keyframes nb-pin-in { 0% { transform: scale(0.7); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
  @keyframes nb-thread-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
  @keyframes nb-fade-in { from { opacity: 0; } to { opacity: 1; } }
`;

// ─── Komponente ───────────────────────────────────────────────────────────────

export function NarrativeBoard({
  objectives,
  queue,
  threads,
  resources,
  sonntagsfrage,
  abwehr,
  narrativeSlots = 2,
  onUnpin,
  onPlay,
  onClear,
  onClose,
}: NarrativeBoardProps): React.JSX.Element {
  const slots = Math.max(1, Math.min(3, narrativeSlots));

  // Esc schließt (E33) — Capture + Stop, damit nicht zusätzlich das Pausemenü greift.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); onClose(); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  // Angeheftete Karten (Queue) auf die aktiven Spuren verteilen (Index-Rotation —
  // die Spur ist diegetische Organisation; die Engine-Queue bleibt flach).
  const laneOf = (index: number) => index % slots;
  const queueBySpur = useMemo(() => {
    const lanes: QueuedAction[][] = Array.from({ length: slots }, () => []);
    queue.forEach((q, i) => lanes[laneOf(i)].push(q));
    return lanes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, slots]);

  // N2: Liegt das Wettrennen an (sonntagsfrage-Prop), sprechen die Kopf-Notizen
  // dessen Vokabular — das Alt-Primärziel („destabilisieren") entfällt dann;
  // Halte-Ziele bleiben (sie sind type=primary MIT category=survival, B22).
  const sortedObjectives = useMemo(
    () => [...objectives]
      .filter((o) => (sonntagsfrage ? o.category === 'survival' : true))
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
      .slice(0, 4),
    [objectives, sonntagsfrage],
  );

  const planCost = queue.reduce(
    (a, q) => ({
      budget: a.budget + (q.costs.budget || 0),
      capacity: a.capacity + (q.costs.capacity || 0),
      actionPoints: a.actionPoints + (q.costs.actionPoints || 0),
    }),
    { budget: 0, capacity: 0, actionPoints: 0 },
  );
  // Budget prefix-genau prüfen (Kredite zählen erst an ihrer Position, Codex-Review #80).
  const canPlay = queue.length > 0 &&
    isQueueBudgetFeasible(queue, resources.budget) &&
    planCost.capacity <= resources.capacity &&
    planCost.actionPoints <= resources.actionPoints;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-3"
      style={{ backgroundColor: 'rgba(0,0,0,0.82)', zIndex: 80 }}
      onClick={onClose}
      data-testid="narrative-board"
    >
      <style>{KEYFRAMES}</style>
      <div
        className="w-full max-w-6xl max-h-[94vh] flex flex-col"
        style={{
          // Holzrahmen ums Korkbrett (diegetisches Objekt, kein Web-Panel)
          backgroundColor: '#4a361f',
          border: `6px solid #2c1f12`,
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.05), inset 0 -2px 0 rgba(0,0,0,0.4)',
          imageRendering: 'pixelated',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kopfleiste */}
        <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ backgroundColor: '#2c1f12' }}>
          <div className="flex items-baseline gap-3">
            <span className="font-bold tracking-widest text-sm" style={{ color: StoryModeColors.document }}>
              NARRATIV-TAFEL
            </span>
            <span className="text-[11px]" style={{ color: '#c9b48f' }}>Sendeplan — Maßnahmen planen &amp; ausspielen</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Tafel schließen"
            title="Schließen (Esc)"
            className="w-7 h-7 flex items-center justify-center border-2 hover:brightness-125"
            style={{ borderColor: '#6b5436', color: StoryModeColors.document, background: 'transparent' }}
          >
            ✕
          </button>
        </div>

        {/* Korkfläche */}
        <div
          className="flex-1 min-h-0 overflow-y-auto p-4"
          style={{
            backgroundColor: '#7a5a36',
            backgroundImage:
              'radial-gradient(rgba(0,0,0,0.16) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '6px 6px, 6px 6px',
            backgroundPosition: '0 0, 3px 3px',
            imageRendering: 'pixelated',
          }}
        >
          {/* Kopf-Notizen: das Wettrennen (N2) + Halte-Ziele — volle Mission in der Akte (M). */}
          {(sortedObjectives.length > 0 || sonntagsfrage) && (
            <div className="mb-3 flex flex-wrap gap-2">
              {sonntagsfrage && (
                <div
                  className="px-3 py-1.5 inline-flex items-center gap-2"
                  style={{
                    backgroundColor: StoryModeColors.document,
                    color: '#241a0f',
                    border: '2px solid #2c1f12',
                    transform: 'rotate(-0.6deg)',
                  }}
                  data-testid="board-sonntagsfrage"
                >
                  <Icon name="mission" size={12} title="Sonntagsfrage" />
                  <span className="text-[11px] font-bold">ZIEL: SONNTAGSFRAGE</span>
                  <span className="text-[11px]">
                    {sonntagsfrage.pollPct.toFixed(1)} % · über {sonntagsfrage.thresholdPct.toFixed(0)} % am Wahltag
                  </span>
                </div>
              )}
              {sonntagsfrage && abwehr !== undefined && (
                <div
                  className="px-3 py-1.5 inline-flex items-center gap-2"
                  style={{
                    backgroundColor: StoryModeColors.oldPaper,
                    color: '#241a0f',
                    border: '2px solid #6b5436',
                    transform: 'rotate(0.7deg)',
                  }}
                  data-testid="board-abwehr"
                >
                  <Icon name="risk" size={12} title="Abwehr" />
                  <span className="text-[11px] font-bold">ABWEHR</span>
                  <span className="text-[11px]">{Math.round(abwehr)}/100 — bei 100 ist Schluss</span>
                </div>
              )}
              {sortedObjectives.map((o, i) => (
                <div
                  key={o.id}
                  className="px-3 py-1.5 inline-flex items-center gap-2"
                  style={{
                    backgroundColor: o.isPrimary ? StoryModeColors.document : StoryModeColors.oldPaper,
                    color: '#241a0f',
                    border: `2px solid ${o.isPrimary ? '#2c1f12' : '#6b5436'}`,
                    transform: `rotate(${(i % 2 ? 0.7 : -0.6)}deg)`,
                  }}
                >
                  <Icon name="mission" size={12} title="Ziel" />
                  <span className="text-[11px] font-bold">{o.isPrimary ? 'ZIEL' : 'Nebenziel'}: {o.label_de}</span>
                  {/* B22: „100/40" las sich als „100 von 40". Halte-Ziele (survival)
                      führen kein lebendes currentValue — dort nur die Marke. */}
                  <span className="text-[11px]">
                    {o.category === 'survival'
                      ? `unter ${o.targetValue} halten`
                      : `Stand ${Math.round(o.currentValue)} · Ziel unter ${o.targetValue}`}
                    {o.completed ? ' ✓' : ''}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Rote Fäden: Gelegenheits-Fenster mit Ablauf */}
          {threads.length > 0 && (
            <div className="mb-3 flex flex-col gap-1">
              {threads.map((t) => {
                const urgent = t.expiresIn <= 1;
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-2 px-2 py-1 text-xs"
                    style={{
                      backgroundColor: 'rgba(20,8,8,0.6)',
                      borderLeft: `4px solid ${urgent ? StoryModeColors.danger : StoryModeColors.ministryRed}`,
                      color: StoryModeColors.document,
                      animation: urgent ? 'nb-thread-pulse 1.2s ease-in-out infinite' : undefined,
                    }}
                    title={t.hint}
                  >
                    {/* v3: danger/warning sind Tinten — auf dem dunklen Faden-Streifen
                        bleiben die hellen v2-Signalwerte (diegetisch). */}
                    <span style={{ color: '#E5484D' }}>⟜</span>
                    <span className="font-bold">{t.name}</span>
                    <span style={{ color: '#d9c6a3' }}>{t.hint}</span>
                    <span className="ml-auto font-bold" style={{ color: urgent ? '#E5484D' : '#F0B429' }}>
                      läuft ab in {t.expiresIn} {t.expiresIn === 1 ? 'Phase' : 'Phasen'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Spuren (Narrative) mit angehefteten Karten */}
          <div className="flex flex-col gap-2 mb-4">
            {Array.from({ length: slots }).map((_, spur) => {
              const cards = queueBySpur[spur] ?? [];
              return (
                <div
                  key={spur}
                  className="px-2 py-2 min-h-[64px] flex items-center gap-2 flex-wrap"
                  style={{
                    border: '2px dashed rgba(0,0,0,0.35)',
                    backgroundColor: 'rgba(0,0,0,0.12)',
                  }}
                >
                  <span className="text-[10px] font-bold tracking-widest w-14 shrink-0" style={{ color: '#e6d3ad' }}>
                    {SPUR_LABELS[spur]}
                  </span>
                  {cards.length === 0 ? (
                    <span className="text-[11px]" style={{ color: '#c9b48f' }}>
                      Nichts angeheftet — Maßnahmen wählt das Terminal [A], „Anheften" legt sie hierher.
                    </span>
                  ) : (
                    cards.map((q) => (
                      <PinnedCard key={q.id} q={q} onUnpin={() => onUnpin(q.id)} />
                    ))
                  )}
                </div>
              );
            })}
            {slots < 3 && (
              <div
                className="px-2 py-2 min-h-[40px] flex items-center"
                style={{ border: '2px dashed rgba(0,0,0,0.25)', opacity: 0.5 }}
              >
                <span className="text-[10px] font-bold tracking-widest w-14 shrink-0" style={{ color: '#bfa988' }}>SPUR C</span>
                <span className="text-[11px]" style={{ color: '#bfa988' }}>
                  Dritte Spur schaltet mit dem Gebäude-Wachstum frei (K40).
                </span>
              </div>
            )}
          </div>

          {/* N3 (§4.1): KEIN Zweitkatalog mehr — das Terminal wählt, die Tafel plant. */}
          <div className="text-[11px] px-2 py-1.5 inline-block" style={{ color: '#241a0f', backgroundColor: '#c9b48f' }}>
            Maßnahmen WÄHLT das Vorgangs-Terminal am Schreibtisch [A] — „Anheften" schickt sie auf diese Tafel.
          </div>
        </div>

        {/* Fuß: Plan-Kosten + Ausspielen/Leeren */}
        <div className="flex items-center gap-3 px-4 py-2 shrink-0 flex-wrap" style={{ backgroundColor: '#2c1f12' }}>
          <span className="text-[11px]" style={{ color: '#c9b48f' }}>
            {queue.length} angeheftet
          </span>
          {/* v3: danger ist Tinte — Überzieh-Warnung auf dunkler Fußleiste in hellem v2-Rot. */}
          <span className="text-[11px] flex items-center gap-2" style={{ color: StoryModeColors.document }}>
            <span className={planCost.budget > resources.budget ? '' : ''} style={{ color: planCost.budget > resources.budget ? '#E5484D' : '#d9c6a3' }}>
              <Icon name="budget" size={12} title="Budget" /> {planCost.budget}K/{resources.budget}K
            </span>
            <span style={{ color: planCost.actionPoints > resources.actionPoints ? '#E5484D' : '#d9c6a3' }}>
              <Icon name="mission" size={12} title="AP" /> {planCost.actionPoints}/{resources.actionPoints} AP
            </span>
          </span>
          <span className="ml-auto flex gap-2">
            <button
              onClick={() => { if (canPlay) { playSound('click'); onPlay(); } }}
              disabled={!canPlay}
              className="px-4 py-1.5 border-2 font-bold text-sm transition-all"
              style={{
                // v3 §4.7: Stempel-Knopf (Papier + Erfolgs-Ring) statt Grün-Fläche.
                backgroundColor: canPlay ? StoryModeColors.surfaceLight : StoryModeColors.lightConcrete,
                borderColor: canPlay ? StoryModeColors.success : StoryModeColors.borderLight,
                color: canPlay ? StoryModeColors.success : StoryModeColors.textMuted,
                cursor: canPlay ? 'pointer' : 'not-allowed',
                opacity: canPlay ? 1 : 0.6,
              }}
              title={canPlay ? 'Geplante Sendungen ausspielen' : 'Nichts geplant oder zu teuer'}
            >
              AUSSPIELEN ▸
            </button>
            <button
              onClick={() => { if (queue.length) { playSound('click'); onClear(); } }}
              className="px-3 py-1.5 border-2 font-bold text-sm transition-all hover:brightness-110"
              style={{ backgroundColor: StoryModeColors.surfaceLight, borderColor: StoryModeColors.ministryRed, color: StoryModeColors.ministryRed }}
              title="Tafel leeren"
            >
              LEEREN
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Angeheftete Karte (Queue-Eintrag) ────────────────────────────────────────

function PinnedCard({ q, onUnpin }: { q: QueuedAction; onUnpin: () => void }): React.JSX.Element {
  // Leichte Zufalls-Drehung pro Karte → „angeheftet"-Gefühl (deterministisch).
  // Statische Drehung außen, Anheft-Animation (Skalierung) innen — kein Konflikt
  // der transform-Eigenschaft, kein CSS-Custom-Property nötig.
  let h = 0;
  for (const c of q.id) h = (h * 31 + c.charCodeAt(0)) % 13;
  const rot = (h - 6) * 0.5;
  return (
    <div style={{ transform: `rotate(${rot}deg)`, animation: 'nb-pin-in 220ms ease-out' }}>
      <div
        className="relative px-2 py-1"
        style={{ backgroundColor: StoryModeColors.document, color: '#241a0f', border: `2px solid ${LEGAL_COLOR[q.legality]}` }}
      >
        {/* Pin-Nadel */}
        <span style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, borderRadius: 8, backgroundColor: StoryModeColors.ministryRed, border: '1px solid #2c1f12' }} />
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold max-w-[150px] truncate" title={q.label}>{q.label}</span>
          <button onClick={onUnpin} aria-label={`${q.label} lösen`} title="Lösen" className="text-xs" style={{ color: StoryModeColors.danger }}>✕</button>
        </div>
      </div>
    </div>
  );
}

export default NarrativeBoard;
