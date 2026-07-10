/**
 * NarrativeBoard — die Narrativ-Tafel (Korkbrett): der Sendeplan des Spiels.
 * T1 „Wahrmachen" (KONZEPT_2026-07-07_NARRATIV_TAFEL_INTEGRATION.md):
 *
 *  - SPUREN = aktive Episoden-Stränge (F7=A / BAUPLAN P4): Karten hängen an der
 *    Spur ihrer Episode — Zuordnung über `einklink_aktionen` (Daten, keine
 *    index-Rotation). Alles andere liegt auf der Spur TAGESGESCHÄFT.
 *  - Fortschritt je Strang als abgestempelte Stummel (zählbar, kein Balken — E6).
 *  - Rote Fäden = NUR echte Gelegenheits-Fenster mit Verfall (kein Füllwert).
 *  - Das Karten-Deck wohnt im Terminal (§4.1: Terminal WÄHLT, Tafel PLANT) —
 *    von hier führt nur der Sprung dorthin (Taste A / Knopf).
 *
 * A1: nichts geht verloren — Lösen = removeFromQueue, AUSSPIELEN = executeQueue,
 * LEEREN = clearQueue; Anheften geschieht am Terminal (addToQueue). Engine unangetastet.
 * Esc schließt (E33, Capture + Stop — Muster PixelModal).
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { StoryModeColors } from '../theme';
import { Icon } from './Icon';
import { playSound } from '../utils/SoundSystem';
import { isQueueBudgetFeasible, istPlanLeistbar } from '../utils/queueAffordability';
import { formatAbwehr, formatPollPct, formatSchwellePct } from '../utils/rennen';
import type { QueuedAction } from '../hooks/useStoryGameState';

const LEGAL_COLOR: Record<QueuedAction['legality'], string> = {
  legal: StoryModeColors.success,
  grey: StoryModeColors.warning,
  illegal: StoryModeColors.danger,
};

/** Pin-Nadel der angehefteten Karten — auch der QueuePinChip zitiert sie. */
export const PIN_NEEDLE_STYLE: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 8,
  backgroundColor: StoryModeColors.ministryRed,
  border: '1px solid #2c1f12',
};

/** Papier-Notiz am Kork (Ziel-Zettel, Karteireiter, Hinweis) — leicht schief gepinnt. */
function noteStyle(primary: boolean, rotationDeg: number): React.CSSProperties {
  return {
    backgroundColor: primary ? StoryModeColors.document : StoryModeColors.oldPaper,
    color: '#241a0f',
    border: `2px solid ${primary ? '#2c1f12' : '#6b5436'}`,
    transform: `rotate(${rotationDeg}deg)`,
  };
}

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

/** Ein aktiver Episoden-Strang am Brett (das „Warum" der Kampagne). */
export interface BoardStrand {
  id: string;
  titel: string;
  /** Die Wendungs-/Dilemma-Frage der Episode — nur hier nachlesbar. */
  wendung: string;
  /** Einklink-Aktionen des Strangs (bestimmen Karten-Zuordnung + Stummel). */
  aktionen: string[];
  /** Bereits gespielte Einklink-Aktionen (Teilmenge von `aktionen`). */
  erledigt: string[];
}

/** Gelegenheits-Fenster (Combo) mit echtem Verfallsdatum. */
export interface BoardWindow {
  id: string;
  name: string;
  hint: string;
  expiresIn: number; // Tage bis Verfall
  /** T2: nächster Schritt des Fensters (übernimmt das alte ComboHints-Widget). */
  nextAction?: string;
}

interface NarrativeBoardProps {
  objectives: BoardObjective[];
  strands: BoardStrand[];
  windows: BoardWindow[];
  queue: QueuedAction[];
  resources: { budget: number; capacity: number; actionPoints: number };
  /** T3: Spuren des Bretts (Start 2; die dritte genehmigt die Zentrale mit Akt 3). */
  slots?: number;
  /** T4: Akt-Dramaturgie der Kampagne (Zielbild §8) als Band über den Spuren. */
  akt?: { nummer: number; titel: string };
  /** T4: Tage bis zur nächsten Sonntagsfrage (0 = heute Abend; null = ausblenden). */
  naechsteSonntagsfrageIn?: number | null;
  /** T2-Luxus: echte Kork-Kachel (ui_cork_tile); ohne Asset bleibt das CSS-Punktraster. */
  korkUrl?: string;
  /** N2 (main, PLAN 2026-07-07): das Wettrennen als Kopf-Notiz — die zwei Läufer
   *  ersetzen das Alt-Vokabular („destabilisieren unter 40"). */
  sonntagsfrage?: { pollPct: number; thresholdPct: number };
  abwehr?: number;
  onUnpin: (queueItemId: string) => void;
  onPlay: () => void;
  onClear: () => void;
  /** Sprung ins Terminal — dort wird gewählt und angeheftet (§4.1). */
  onOpenTerminal: () => void;
  onClose: () => void;
}

const KEYFRAMES = `
  @keyframes nb-pin-in { 0% { transform: scale(0.7); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
  @keyframes nb-thread-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }
`;

// ─── Karten-Zuordnung (pur, getestet) ────────────────────────────────────────

export interface KartenVerteilung {
  /** strandId → angeheftete Karten dieses Strangs (Queue-Reihenfolge bleibt). */
  byStrand: Map<string, QueuedAction[]>;
  /** Karten ohne Strang-Bezug (freies Tagesgeschäft). */
  tagesgeschaeft: QueuedAction[];
}

/**
 * Verteilt die flache Engine-Queue auf die Strang-Spuren: eine Karte gehört zum
 * ERSTEN Strang, dessen `einklink_aktionen` ihre actionId enthalten (Aktionen in
 * mehreren Strängen sind Daten-Grenzfall — first wins, deterministisch).
 */
export function verteileKarten(queue: QueuedAction[], strands: BoardStrand[]): KartenVerteilung {
  const byStrand = new Map<string, QueuedAction[]>(strands.map((s) => [s.id, []]));
  const tagesgeschaeft: QueuedAction[] = [];
  for (const q of queue) {
    const strand = strands.find((s) => s.aktionen.includes(q.actionId));
    if (strand) byStrand.get(strand.id)!.push(q);
    else tagesgeschaeft.push(q);
  }
  return { byStrand, tagesgeschaeft };
}

// ─── Komponente ───────────────────────────────────────────────────────────────

export function NarrativeBoard({
  objectives,
  strands,
  windows,
  queue,
  resources,
  slots = 2,
  akt,
  naechsteSonntagsfrageIn = null,
  korkUrl,
  sonntagsfrage,
  abwehr,
  onUnpin,
  onPlay,
  onClear,
  onOpenTerminal,
  onClose,
}: NarrativeBoardProps): React.JSX.Element {
  // Esc schließt (E33) — Capture + Stop, damit nicht zusätzlich das Pausemenü greift.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopImmediatePropagation(); onClose(); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  const verteilung = useMemo(() => verteileKarten(queue, strands), [queue, strands]);

  // Missionsziele zuerst die primären (Anker des Sendeplans).
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
  // Leistbarkeit: EIN Prädikat (Budget prefix-genau — Kredite zählen an ihrer
  // Position, Codex-Review #80); die Warnfarbe unten nutzt DIESELBE Budget-Prüfung,
  // sonst zeigte der Fuß „passt", während AUSSPIELEN gesperrt ist.
  const canPlay = queue.length > 0 && istPlanLeistbar(queue, resources);
  const budgetOk = isQueueBudgetFeasible(queue, resources.budget);

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
            <span className="text-[11px]" style={{ color: '#c9b48f' }}>Sendeplan — was heute auf Sendung geht</span>
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

        {/* Korkfläche — echte Kachel (ui_cork_tile), CSS-Punktraster als Fallback. */}
        <div
          className="flex-1 min-h-0 overflow-y-auto p-4"
          style={{
            backgroundColor: '#7a5a36',
            backgroundImage: korkUrl
              ? `url(${korkUrl})`
              : 'radial-gradient(rgba(0,0,0,0.16) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: korkUrl ? '512px 512px' : '6px 6px, 6px 6px',
            backgroundPosition: korkUrl ? undefined : '0 0, 3px 3px',
            imageRendering: 'pixelated',
          }}
        >
          {/* Missionsziele als Kopf-Notizen (volle Messung wohnt in der Akte — Taste M) */}
          {(sortedObjectives.length > 0 || naechsteSonntagsfrageIn !== null || sonntagsfrage) && (
            <div className="mb-3 flex flex-wrap gap-2">
              {/* N2 (main): die zwei Läufer des Rennens als Kopf-Notizen. */}
              {sonntagsfrage && (
                <div
                  className="px-3 py-1.5 inline-flex items-center gap-2"
                  style={noteStyle(true, -0.6)}
                  data-testid="board-sonntagsfrage"
                >
                  <Icon name="mission" size={12} title="Sonntagsfrage" />
                  <span className="text-[11px] font-bold">ZIEL: SONNTAGSFRAGE</span>
                  <span className="text-[11px]">
                    {formatPollPct(sonntagsfrage.pollPct)} · über {formatSchwellePct(sonntagsfrage.thresholdPct)} am Wahltag
                  </span>
                </div>
              )}
              {sonntagsfrage && abwehr !== undefined && (
                <div
                  className="px-3 py-1.5 inline-flex items-center gap-2"
                  style={noteStyle(false, 0.7)}
                  data-testid="board-abwehr"
                >
                  <Icon name="risk" size={12} title="Abwehr" />
                  <span className="text-[11px] font-bold">ABWEHR</span>
                  <span className="text-[11px]">{formatAbwehr(abwehr)} — bei 100 ist Schluss</span>
                </div>
              )}
              {sortedObjectives.map((o, i) => (
                <div
                  key={o.id}
                  className="px-3 py-1.5 inline-flex items-center gap-2"
                  style={noteStyle(o.isPrimary, i % 2 ? 0.7 : -0.6)}
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
              {/* T4: der Wochen-Spannungsbogen als Planungshorizont — schaffe ich
                  den Strang, bevor die nächste Umfrage misst? */}
              {naechsteSonntagsfrageIn !== null && (
                <div className="px-3 py-1.5 inline-flex items-center gap-2" style={noteStyle(false, 0.5)}>
                  <span className="text-[11px]">
                    {naechsteSonntagsfrageIn === 0
                      ? 'Sonntagsfrage: heute Abend'
                      : `Nächste Sonntagsfrage in ${naechsteSonntagsfrageIn} ${naechsteSonntagsfrageIn === 1 ? 'Tag' : 'Tagen'}`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Gelegenheits-Fenster als Zettel am Kork (T2/L3: das ComboHints-Widget
              ist hier aufgegangen — V6 zu), mit rotem Verfallsfaden am Rand. */}
          {windows.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {windows.map((w, i) => {
                const urgent = w.expiresIn <= 1;
                return (
                  <div
                    key={w.id}
                    className="px-2 py-1 inline-flex flex-col text-xs max-w-sm"
                    style={{
                      ...noteStyle(false, i % 2 ? 0.6 : -0.7),
                      borderLeft: `4px solid ${urgent ? StoryModeColors.danger : StoryModeColors.ministryRed}`,
                      animation: urgent ? 'nb-thread-pulse 1.2s ease-in-out infinite' : undefined,
                    }}
                    title={w.hint}
                  >
                    <span className="flex items-center gap-2">
                      <span style={{ color: StoryModeColors.ministryRed }}>⟜</span>
                      <span className="font-bold text-[11px]">{w.name}</span>
                      {/* expiresIn kommt als Phasen; seit dem Zielbild gilt 1 Phase = 1 Tag. */}
                      <span className="ml-auto font-bold text-[10px]" style={{ color: urgent ? StoryModeColors.danger : '#8a5a12' }}>
                        läuft ab in {w.expiresIn} {w.expiresIn === 1 ? 'Tag' : 'Tagen'}
                      </span>
                    </span>
                    <span className="text-[10px]" style={{ color: '#5a3a12' }}>{w.hint}</span>
                    {w.nextAction && (
                      <span className="text-[10px] italic" style={{ color: '#5a3a12' }}>
                        Nächster Schritt: {w.nextAction}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* T4: Akt-Band — beantwortet die Mittelspiel-Frage „Was mache ich JETZT?"
              (Zielbild §8: Keil → Zweifel → Wahl). */}
          {akt && (
            <div
              className="mb-2 px-3 py-1 inline-block font-bold text-[11px] tracking-widest"
              style={{ backgroundColor: '#2c1f12', color: StoryModeColors.document }}
              data-testid="akt-band"
            >
              AKT {akt.nummer} — {akt.titel.toUpperCase()}
            </div>
          )}

          {/* Spuren = aktive Episoden-Stränge; freie Spuren zeigen die Kapazität
              (T3/B6: Fokus ist eine Ressource — das Brett trägt nicht alles). */}
          <div className="flex flex-col gap-3 mb-4">
            {strands.map((strand) => (
              <StrandLane
                key={strand.id}
                strand={strand}
                cards={verteilung.byStrand.get(strand.id) ?? []}
                onUnpin={onUnpin}
              />
            ))}
            {Array.from({ length: Math.max(0, slots - strands.length) }).map((_, i) => (
              <div
                key={`frei-${i}`}
                className="px-2 py-2 min-h-[48px] flex items-center gap-2"
                style={{ border: '2px dashed rgba(0,0,0,0.35)', backgroundColor: 'rgba(0,0,0,0.08)' }}
                data-testid="lane-frei"
              >
                <span className="text-[10px] font-bold tracking-widest w-28 shrink-0" style={{ color: '#bfa988' }}>
                  FREIE SPUR
                </span>
                <span className="text-[11px]" style={{ color: '#c9b48f' }}>
                  {strands.length === 0 && i === 0
                    ? 'Noch kein Strang auf dem Brett — das Team bietet Episoden an, wenn die Lage passt.'
                    : 'Platz für einen weiteren Strang.'}
                </span>
              </div>
            ))}
            {/* F-B: Die dritte Spur ist keine Gebäude-Mechanik mehr, sondern hängt
                diegetisch am Endspurt der Kampagne. */}
            {slots < 3 && (
              <div
                className="px-2 py-1.5 flex items-center gap-2"
                style={{ border: '2px dashed rgba(0,0,0,0.2)', opacity: 0.55 }}
                data-testid="lane-gesperrt"
              >
                <span className="text-[10px] font-bold tracking-widest w-28 shrink-0" style={{ color: '#bfa988' }}>
                  DRITTE SPUR
                </span>
                <span className="text-[11px]" style={{ color: '#bfa988' }}>
                  Genehmigt die Zentrale, sobald der Endspurt beginnt (Akt 3).
                </span>
              </div>
            )}

            {/* Tagesgeschäft: alles Geplante ohne Strang-Bezug */}
            <div
              className="px-2 py-2 min-h-[64px] flex items-center gap-2 flex-wrap"
              style={{
                border: '2px dashed rgba(0,0,0,0.35)',
                backgroundColor: 'rgba(0,0,0,0.12)',
              }}
              data-testid="lane-tagesgeschaeft"
            >
              <span className="text-[10px] font-bold tracking-widest w-28 shrink-0" style={{ color: '#e6d3ad' }}>
                TAGESGESCHÄFT
              </span>
              {verteilung.tagesgeschaeft.length === 0 ? (
                <span className="text-[11px]" style={{ color: '#c9b48f' }}>
                  Noch nichts angeheftet — Maßnahmen wählst du am Terminal (A).
                </span>
              ) : (
                verteilung.tagesgeschaeft.map((q) => (
                  <PinnedCard key={q.id} q={q} onUnpin={() => onUnpin(q.id)} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Fuß: Plan-Kosten + Terminal-Sprung + Ausspielen/Leeren */}
        <div className="flex items-center gap-3 px-4 py-2 shrink-0 flex-wrap" style={{ backgroundColor: '#2c1f12' }}>
          <button
            onClick={() => { playSound('typewriter'); onOpenTerminal(); }}
            className="px-3 py-1.5 border-2 font-bold text-[11px] hover:brightness-110"
            style={{ backgroundColor: StoryModeColors.surfaceLight, borderColor: StoryModeColors.militaryOlive, color: StoryModeColors.darkOlive }}
            title="Maßnahmen wählen und anheften — am Vorgangs-Terminal (Taste A)"
          >
            MASSNAHMEN WÄHLEN → TERMINAL (A)
          </button>
          <span className="text-[11px]" style={{ color: '#c9b48f' }}>
            {queue.length} angeheftet
          </span>
          {/* v3: danger ist Tinte — Überzieh-Warnung auf dunkler Fußleiste in hellem v2-Rot. */}
          <span className="text-[11px] flex items-center gap-2" style={{ color: StoryModeColors.document }}>
            <span style={{ color: budgetOk ? '#d9c6a3' : '#E5484D' }}>
              <Icon name="budget" size={12} title="Budget" /> {planCost.budget}K/{resources.budget}K
            </span>
            <span style={{ color: planCost.actionPoints > resources.actionPoints ? '#E5484D' : '#d9c6a3' }}>
              <Icon name="mission" size={12} title="AP" /> {planCost.actionPoints}/{resources.actionPoints} AP
            </span>
            {planCost.capacity > 0 && (
              <span style={{ color: planCost.capacity > resources.capacity ? '#E5484D' : '#d9c6a3' }}>
                <Icon name="capacity" size={12} title="Kapazität" /> {planCost.capacity}/{resources.capacity}
              </span>
            )}
          </span>
          <span className="ml-auto flex gap-2">
            <button
              // T2-SFX: Ausspielen = Stempelschlag (sfx_stamp — „VOLLZOGEN."-Ton, E8).
              onClick={() => { if (canPlay) { playSound('stamp'); onPlay(); } }}
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

// ─── Strang-Spur (Karteireiter + Stummel + angeheftete Karten) ────────────────

function StrandLane({
  strand,
  cards,
  onUnpin,
}: {
  strand: BoardStrand;
  cards: QueuedAction[];
  onUnpin: (queueItemId: string) => void;
}): React.JSX.Element {
  const total = strand.aktionen.length;
  const done = strand.erledigt.length;

  // T2: echte rote Fäden vom Karteireiter zu jeder angehefteten Karte — die
  // Detektiv-Korkwand, die die Metapher verspricht. Gemessen statt geraten
  // (flex-wrap bricht unvorhersehbar um); statisch, kein Puls (reduced-motion).
  const laneRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLElement>());
  const [faeden, setFaeden] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  useLayoutEffect(() => {
    const messen = () => {
      const lane = laneRef.current;
      const head = headRef.current;
      if (!lane || !head || cards.length === 0) { setFaeden([]); return; }
      const lr = lane.getBoundingClientRect();
      const hr = head.getBoundingClientRect();
      // Der Faden hängt an der rechten Unterkante des Reiters …
      const hx = hr.right - lr.left - 6;
      const hy = hr.bottom - lr.top - 4;
      const segs: { x1: number; y1: number; x2: number; y2: number }[] = [];
      for (const q of cards) {
        const el = cardRefs.current.get(q.id);
        if (!el) continue;
        const cr = el.getBoundingClientRect();
        // … und endet an der Pin-Nadel der Karte (obere Mitte).
        segs.push({ x1: hx, y1: hy, x2: cr.left - lr.left + cr.width / 2, y2: cr.top - lr.top + 2 });
      }
      setFaeden(segs);
    };
    messen();
    window.addEventListener('resize', messen);
    return () => window.removeEventListener('resize', messen);
  }, [cards]);

  return (
    <div
      ref={laneRef}
      className="relative px-2 py-2 flex flex-col gap-2"
      style={{
        border: `2px dashed ${StoryModeColors.ministryRed}`,
        backgroundColor: 'rgba(0,0,0,0.12)',
      }}
      data-testid={`lane-strand-${strand.id}`}
    >
      {faeden.length > 0 && (
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: 'none' }}
          aria-hidden
          data-testid="strang-faeden"
        >
          {faeden.map((f, i) => (
            <line
              key={i}
              x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2}
              stroke={StoryModeColors.ministryRed}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.75}
            />
          ))}
        </svg>
      )}
      {/* Karteireiter: Titel gestempelt, Wendung als Randnotiz — die Dilemma-Frage
          ist sonst nirgends nachlesbar (sie fiel bisher nach dem Dialog weg). */}
      <div className="flex items-start gap-2 flex-wrap">
        <div ref={headRef} className="px-2 py-1 inline-flex flex-col" style={noteStyle(true, -0.4)}>
          <span className="text-[11px] font-bold tracking-wider uppercase">⟜ {strand.titel}</span>
          <span className="text-[10px] italic" style={{ color: '#5a3a12' }}>{strand.wendung}</span>
        </div>
        {/* Fortschritt als zählbare Stummel: gesendet = gestempelt, offen = Pin-Loch. */}
        <div className="flex items-center gap-1 pt-1" title={`${done} von ${total} Sendungen dieses Strangs ausgespielt`}>
          {strand.aktionen.map((aktionId) => {
            const gesendet = strand.erledigt.includes(aktionId);
            return gesendet ? (
              <span
                key={aktionId}
                className="w-4 h-5 flex items-center justify-center text-[10px] font-bold"
                style={{
                  backgroundColor: StoryModeColors.oldPaper,
                  color: StoryModeColors.success,
                  border: `1px solid ${StoryModeColors.success}`,
                  transform: 'rotate(2deg)',
                }}
                aria-label="Sendung ausgespielt"
              >
                ✓
              </span>
            ) : (
              <span
                key={aktionId}
                className="w-4 h-5"
                style={{ border: '1px dashed rgba(0,0,0,0.45)', backgroundColor: 'rgba(0,0,0,0.1)' }}
                aria-label="Sendung offen"
              />
            );
          })}
          <span className="text-[10px] font-bold ml-1" style={{ color: '#e6d3ad' }}>{done}/{total}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap min-h-[36px]">
        {cards.length === 0 ? (
          <span className="text-[11px]" style={{ color: '#c9b48f' }}>
            Keine Sendung dieses Strangs geplant — die passenden Maßnahmen liegen im Terminal obenan (● Strang).
          </span>
        ) : (
          cards.map((q) => (
            <span
              key={q.id}
              ref={(el) => {
                if (el) cardRefs.current.set(q.id, el);
                else cardRefs.current.delete(q.id);
              }}
            >
              <PinnedCard q={q} onUnpin={() => onUnpin(q.id)} />
            </span>
          ))
        )}
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
        <span style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%)', ...PIN_NEEDLE_STYLE }} />
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold max-w-[150px] truncate" title={q.label}>{q.label}</span>
          <button
            onClick={() => { playSound('pin'); onUnpin(); }}
            aria-label={`${q.label} lösen`}
            title="Lösen"
            className="text-xs"
            style={{ color: StoryModeColors.danger }}
          >
            ✕
          </button>
        </div>
        {/* Einzelkosten je Karte — beim Trimmen eines überzogenen Plans muss
            ablesbar sein, WELCHE Karte teuer ist (das konnte das alte Widget). */}
        {(!!q.costs.budget || !!q.costs.actionPoints || !!q.costs.capacity) && (
          <div className="flex gap-1.5 text-[9px]" style={{ color: '#5a3a12' }}>
            {!!q.costs.budget && <span>{q.costs.budget}K</span>}
            {!!q.costs.actionPoints && <span>{q.costs.actionPoints} AP</span>}
            {!!q.costs.capacity && <span>{q.costs.capacity} Kap.</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default NarrativeBoard;
