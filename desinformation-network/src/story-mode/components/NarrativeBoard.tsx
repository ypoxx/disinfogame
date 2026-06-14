/**
 * NarrativeBoard — die Narrativ-Tafel (Korkbrett) als diegetisches Planungs-
 * Herzstück (Strang 2 / 2f). Sie ist unser „Sendeplan" (GESAMTKONZEPT §2):
 *
 *  - 2–3 laufende Narrative als SPUREN (E2: Start 2, max 3 via Gebäude-Wachstum).
 *  - Maßnahmen-Karten werden an eine Spur ANGEHEFTET (ziehen ODER „Anheften"/Enter).
 *  - Gelegenheits-Fenster als ROTE FÄDEN mit Ablaufdatum (Combos mit Verfall).
 *  - Die heutige Aktions-Liste ist hier INHALT, kein paralleles Panel (D-D).
 *
 * A1: nichts geht verloren — Anheften = addToQueue, Lösen = removeFromQueue,
 * „Sofort" = executeAction, „Ausspielen" = executeQueue. Engine unangetastet.
 * Voll tastaturbedienbar (E33): Karten sind fokussierbar, Enter heftet an.
 * Ziehen ist die Zusatz-Geste, nicht die einzige (kein „verkleidetes Dropdown").
 */
import { useEffect, useMemo, useState, type DragEvent } from 'react';
import { StoryModeColors } from '../theme';
import { Icon } from './Icon';
import { playSound } from '../utils/SoundSystem';
import { isQueueBudgetFeasible } from '../utils/queueAffordability';
import type { QueuedAction } from '../hooks/useStoryGameState';

// ─── Typen ────────────────────────────────────────────────────────────────────

export interface BoardAction {
  id: string;
  label_de: string;
  narrative_de: string;
  costs: { budget?: number; capacity?: number; actionPoints?: number };
  legality: 'legal' | 'grey' | 'illegal';
  available: boolean;
  unavailableReason?: string;
  /** Zuständiger NPC/Büro (Anzeige) — gruppiert das Deck (Entscheidung 1). */
  npc?: string;
}

export interface BoardObjective {
  id: string;
  label_de: string;
  currentValue: number;
  targetValue: number;
  completed: boolean;
  isPrimary: boolean;
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
  actions: BoardAction[];
  queue: QueuedAction[];
  threads: BoardThread[];
  resources: { budget: number; capacity: number; actionPoints: number };
  /** E2: gleichzeitige Narrativ-Spuren (Start 2, max 3). */
  narrativeSlots?: number;
  onPin: (actionId: string) => void;
  onUnpin: (queueItemId: string) => void;
  onExecuteNow: (actionId: string) => void;
  onPlay: () => void;
  onClear: () => void;
  onClose: () => void;
}

const LEGAL_COLOR: Record<BoardAction['legality'], string> = {
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
  actions,
  queue,
  threads,
  resources,
  narrativeSlots = 2,
  onPin,
  onUnpin,
  onExecuteNow,
  onPlay,
  onClear,
  onClose,
}: NarrativeBoardProps): React.JSX.Element {
  const slots = Math.max(1, Math.min(3, narrativeSlots));
  const [dragOverSpur, setDragOverSpur] = useState<number | null>(null);
  const [focusSpur, setFocusSpur] = useState(0); // Ziel-Spur für „Anheften"/Enter (Tastatur)

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

  // Missionsziele zuerst die primären (Anker des Sendeplans).
  const sortedObjectives = useMemo(
    () => [...objectives].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)).slice(0, 4),
    [objectives],
  );

  // Deck nach zuständigem NPC/Büro gruppieren (Entscheidung 1: Maßnahmen je Büro,
  // nicht als flache Gesamtliste). Reihenfolge stabil nach erstem Auftreten.
  const actionsByNpc = useMemo(() => {
    const groups = new Map<string, BoardAction[]>();
    for (const a of actions) {
      const key = a.npc || 'Ministerium';
      const list = groups.get(key);
      if (list) list.push(a);
      else groups.set(key, [a]);
    }
    return Array.from(groups.entries());
  }, [actions]);

  const pin = (actionId: string, spur: number) => {
    setFocusSpur(spur);
    playSound('paper');
    onPin(actionId);
  };

  const onDrop = (e: DragEvent, spur: number) => {
    e.preventDefault();
    setDragOverSpur(null);
    const actionId = e.dataTransfer.getData('text/actionId');
    if (actionId) pin(actionId, spur);
  };

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
            <span className="text-[11px]" style={{ color: '#c9b48f' }}>Sendeplan des Ministeriums</span>
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
          {/* Missionsziele als Kopf-Notizen (volle Mission bleibt auf der Tafel — A1) */}
          {sortedObjectives.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
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
                  <span className="text-[11px]">{o.currentValue}/{o.targetValue}{o.completed ? ' ✓' : ''}</span>
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
                    <span style={{ color: StoryModeColors.danger }}>⟜</span>
                    <span className="font-bold">{t.name}</span>
                    <span style={{ color: '#d9c6a3' }}>{t.hint}</span>
                    <span className="ml-auto font-bold" style={{ color: urgent ? StoryModeColors.danger : StoryModeColors.warning }}>
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
              const isFocus = spur === focusSpur;
              const isOver = dragOverSpur === spur;
              return (
                <div
                  key={spur}
                  onDragOver={(e) => { e.preventDefault(); setDragOverSpur(spur); }}
                  onDragLeave={() => setDragOverSpur((s) => (s === spur ? null : s))}
                  onDrop={(e) => onDrop(e, spur)}
                  onClick={() => setFocusSpur(spur)}
                  className="px-2 py-2 min-h-[64px] flex items-center gap-2 flex-wrap"
                  style={{
                    border: `2px dashed ${isOver ? StoryModeColors.warning : isFocus ? StoryModeColors.ministryRed : 'rgba(0,0,0,0.35)'}`,
                    backgroundColor: isOver ? 'rgba(240,180,41,0.10)' : 'rgba(0,0,0,0.12)',
                  }}
                >
                  <span className="text-[10px] font-bold tracking-widest w-14 shrink-0" style={{ color: '#e6d3ad' }}>
                    {SPUR_LABELS[spur]}
                  </span>
                  {cards.length === 0 ? (
                    <span className="text-[11px]" style={{ color: '#c9b48f' }}>
                      Karte hierher ziehen oder „Anheften" — heutige Sendung dieser Spur.
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

          {/* Karten-Deck: verfügbare Maßnahmen, nach zuständigem Büro/NPC gruppiert */}
          <div className="text-[10px] font-bold tracking-widest mb-1" style={{ color: '#e6d3ad' }}>
            MASSNAHMEN — je Büro; auf eine Spur ziehen oder „Anheften"
          </div>
          {actions.length === 0 && (
            <span className="text-[11px]" style={{ color: '#c9b48f' }}>Aktuell keine Maßnahmen verfügbar.</span>
          )}
          {actionsByNpc.map(([npc, list]) => (
            <div key={npc} className="mb-3">
              <div
                className="text-[11px] font-bold mb-1 px-1 inline-block"
                style={{ color: '#241a0f', backgroundColor: '#c9b48f' }}
              >
                {npc}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {list.map((a) => (
                  <ActionCard
                    key={a.id}
                    action={a}
                    onPin={() => pin(a.id, focusSpur)}
                    onExecuteNow={() => a.available && onExecuteNow(a.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Fuß: Plan-Kosten + Ausspielen/Leeren */}
        <div className="flex items-center gap-3 px-4 py-2 shrink-0 flex-wrap" style={{ backgroundColor: '#2c1f12' }}>
          <span className="text-[11px]" style={{ color: '#c9b48f' }}>
            {queue.length} angeheftet
          </span>
          <span className="text-[11px] flex items-center gap-2" style={{ color: StoryModeColors.document }}>
            <span className={planCost.budget > resources.budget ? '' : ''} style={{ color: planCost.budget > resources.budget ? StoryModeColors.danger : '#d9c6a3' }}>
              <Icon name="budget" size={12} title="Budget" /> ${planCost.budget}K/${resources.budget}K
            </span>
            <span style={{ color: planCost.actionPoints > resources.actionPoints ? StoryModeColors.danger : '#d9c6a3' }}>
              <Icon name="mission" size={12} title="AP" /> {planCost.actionPoints}/{resources.actionPoints} AP
            </span>
          </span>
          <span className="ml-auto flex gap-2">
            <button
              onClick={() => { if (canPlay) { playSound('click'); onPlay(); } }}
              disabled={!canPlay}
              className="px-4 py-1.5 border-2 font-bold text-sm transition-all"
              style={{
                backgroundColor: canPlay ? StoryModeColors.success : StoryModeColors.darkConcrete,
                borderColor: canPlay ? '#15803d' : StoryModeColors.borderLight,
                color: '#fff',
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
              style={{ backgroundColor: StoryModeColors.ministryRed, borderColor: StoryModeColors.darkRed, color: '#fff' }}
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

// ─── Maßnahmen-Karte (Deck) ───────────────────────────────────────────────────

function ActionCard({ action, onPin, onExecuteNow }: { action: BoardAction; onPin: () => void; onExecuteNow: () => void }): React.JSX.Element {
  const dis = !action.available;
  const onDragStart = (e: DragEvent) => {
    if (dis) { e.preventDefault(); return; }
    e.dataTransfer.setData('text/actionId', action.id);
    e.dataTransfer.effectAllowed = 'copy';
  };
  return (
    <div
      draggable={!dis}
      onDragStart={onDragStart}
      className="flex flex-col gap-1 p-2"
      style={{
        backgroundColor: dis ? '#b6a988' : StoryModeColors.oldPaper,
        color: '#241a0f',
        border: `2px solid ${LEGAL_COLOR[action.legality]}`,
        cursor: dis ? 'not-allowed' : 'grab',
        opacity: dis ? 0.6 : 1,
      }}
      title={dis ? (action.unavailableReason || 'Nicht verfügbar') : action.narrative_de}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-bold leading-tight">{action.label_de}</span>
        <span className="text-[9px] px-1 shrink-0" style={{ backgroundColor: LEGAL_COLOR[action.legality], color: '#0d0d0d' }}>
          {action.legality === 'legal' ? 'LEGAL' : action.legality === 'grey' ? 'GRAU' : 'ILLEGAL'}
        </span>
      </div>
      <div className="flex flex-wrap gap-1 text-[10px]">
        {!!action.costs.budget && <span style={{ color: '#5a3a12' }}><Icon name="budget" size={10} title="Budget" /> ${action.costs.budget}K</span>}
        {!!action.costs.actionPoints && <span style={{ color: '#5a3a12' }}><Icon name="mission" size={10} title="AP" /> {action.costs.actionPoints} AP</span>}
        {!!action.costs.capacity && <span style={{ color: '#5a3a12' }}><Icon name="capacity" size={10} title="Kapazität" /> {action.costs.capacity}</span>}
      </div>
      <div className="flex gap-1 mt-0.5">
        <button
          onClick={onPin}
          disabled={dis}
          className="flex-1 px-2 py-1 text-[11px] font-bold border-2 hover:brightness-110 disabled:opacity-50"
          style={{ backgroundColor: StoryModeColors.militaryOlive, borderColor: StoryModeColors.darkOlive, color: StoryModeColors.document, cursor: dis ? 'not-allowed' : 'pointer' }}
          title="An die fokussierte Spur anheften (Enter)"
        >
          ANHEFTEN
        </button>
        <button
          onClick={onExecuteNow}
          disabled={dis}
          className="px-2 py-1 text-[11px] font-bold border-2 hover:brightness-110 disabled:opacity-50"
          style={{ backgroundColor: StoryModeColors.ministryRed, borderColor: StoryModeColors.darkRed, color: '#fff', cursor: dis ? 'not-allowed' : 'pointer' }}
          title="Sofort ausspielen"
        >
          SOFORT
        </button>
      </div>
    </div>
  );
}

export default NarrativeBoard;
