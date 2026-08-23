/**
 * TerminalView — L2 „Herzstück 1" (Plan §2/§4): der Vollbild-Röhren-Arbeitsplatz
 * am Schreibtisch ERSETZT die Aktionen-Seitenleiste. Das Terminal WÄHLT
 * Maßnahmen; geplant/gezeigt wird am Korkbrett (UX-Entscheid §4.1).
 *
 * M2: Die Eingangstür zeigt die kuratierten VORGÄNGE (3–8, terminalCuration);
 * der volle Katalog liegt eine Schublade tiefer (ARCHIV, mit Filter + Suche).
 * M1: Jede Karte (ActionCard, „Vorgangsblatt") trägt Wirkung + Preis +
 * FRISCH/BEKANNT/VERBRANNT-Stempel VOR dem Klick.
 *
 * CRT-Diegese (Memo §2.6, Stil-Bibel §4.7-Ausnahme Welt-Objekt): dunkler
 * Phosphor-Schirm mit VOLLTON-Text; Scanlines liegen als SEPARATER,
 * abschaltbarer Layer über dem Schirm (nie in den Text gebacken). Die
 * Vorgangsblätter selbst bleiben Papier — Dokumente, die das System aufruft.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StoryModeColors } from '../theme';
import { Icon } from './Icon';
import type { AdvisorRecommendation } from '../engine/AdvisorRecommendation';
import { ActionCard, type MaschenVorschau, type StoryAction } from './ActionCard';
import { kuratiereVorgaenge, istLeistbar } from './terminalCuration';
import { playSound } from '../utils/SoundSystem';
import { useAssets } from '../assets/useAssets';
import { Leerzustand } from './Leerzustand';

// Phosphor-Palette des Schirms (Welt-Objekt, bewusst NICHT die Papier-Tinten —
// wie die dunkel-diegetischen Newsroom-CRTs, Etappe-2-Review bestätigt).
const CRT = {
  bezel: '#241e18', // Gehäuse: dunkles Bakelit
  bezelEdge: '#3a3128',
  screen: '#0a120d', // Schirm-Grund
  green: '#8CF2B0', // Volltontext
  // Sekundär-TEXT heller als die Rahmen: #4E8F68 lag bei ~4,9:1 — für die
  // 10-px-Pixelfont zu schwach (Vision-Review L2); #6FBF8F ≈ 8,7:1.
  textDim: '#6FBF8F',
  greenDim: '#4E8F68', // Rahmen/Trenner (kein Fließtext)
  grid: '#16241b', // Trennlinien auf dem Schirm
  amber: '#F0B429',
} as const;

type FilterTab = 'all' | 'legal' | 'grey' | 'illegal' | 'unlocked';
const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'ALLE' },
  { id: 'legal', label: 'LEGAL' },
  { id: 'grey', label: 'GRAUZONE' },
  { id: 'illegal', label: 'ILLEGAL' },
  { id: 'unlocked', label: 'NEU' },
];

export interface TerminalViewProps {
  actions: StoryAction[];
  /** Aktionen der aktiven Episoden-Stränge (M2: Tür-Auswahl + ●-STRANG-Stempel). */
  episodeActionIds?: string[];
  recommendations?: AdvisorRecommendation[];
  availableResources: { budget: number; capacity: number; actionPoints: number };
  onExecuteAction: (actionId: string) => void;
  onAddToQueue?: (actionId: string) => void;
  /** Anzahl angehefteter Vorgänge (Korkbrett-Warteschlange) — Anheft-Feedback,
   *  da das Floating-Widget am Terminal ausgeblendet ist. */
  queueCount?: number;
  onClose: () => void;
  getMaschenVorschau?: (actionId: string) => MaschenVorschau | null;
  /** Vom Berater angesprungene Aktion: Archiv öffnet und scrollt dorthin. */
  highlightActionId?: string | null;
}

export function TerminalView({
  actions,
  episodeActionIds = [],
  recommendations = [],
  availableResources,
  onExecuteAction,
  onAddToQueue,
  queueCount = 0,
  onClose,
  getMaschenVorschau,
  highlightActionId = null,
}: TerminalViewProps) {
  const recommendedActionIds = useMemo(() => {
    const ids = new Set<string>();
    for (const rec of recommendations) rec.suggestedActions?.forEach((id) => ids.add(id));
    return ids;
  }, [recommendations]);
  const episodeActionIdSet = useMemo(() => new Set(episodeActionIds), [episodeActionIds]);

  // M2: kuratierte Tür-Auswahl (3–8 Vorgänge).
  const kuratiert = useMemo(
    () =>
      kuratiereVorgaenge({
        actions,
        episodeActionIds,
        recommendedActionIds: [...recommendedActionIds],
        resources: availableResources,
        getMaschenVorschau,
      }),
    [actions, episodeActionIds, recommendedActionIds, availableResources, getMaschenVorschau],
  );
  const kuratiertIds = useMemo(() => new Set(kuratiert.map((a) => a.id)), [kuratiert]);

  // ARCHIV-Schublade: springt auf, wenn eine angesprungene Aktion nicht in der Tür liegt.
  const [archiv, setArchiv] = useState<boolean>(
    () => !!highlightActionId && !kuratiertIds.has(highlightActionId),
  );
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Porträt-Zeile (Plan L2): im Archiv nach NPC-Affinität filtern.
  const [npcFilter, setNpcFilter] = useState<string | null>(null);
  const assets = useAssets();
  const npcIds = useMemo(() => {
    const ids = new Set<string>();
    for (const a of actions) a.npc_affinity.forEach((n) => ids.add(n));
    return [...ids].sort();
  }, [actions]);
  // Memo §2.6: Scanlines als separater, ABSCHALTBARER Layer (nie im Text).
  // Die Wahl wird persistiert — wer die Röhre abschaltet (Flimmer-Empfindlichkeit),
  // soll sie nicht bei jedem Öffnen erneut abschalten müssen (Review E4).
  const [roehre, setRoehre] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem('storyMode_terminalRoehre') !== 'aus';
    } catch {
      return true;
    }
  });
  const toggleRoehre = () => {
    setRoehre((r) => {
      try {
        window.localStorage.setItem('storyMode_terminalRoehre', r ? 'aus' : 'an');
      } catch {
        // Privacy-Modus o. Ä.: Wahl gilt dann nur für diese Sitzung.
      }
      return !r;
    });
  };
  const highlightedRef = useRef<HTMLDivElement>(null);

  const tvOnPlayed = useRef(false);
  useEffect(() => {
    // Ref-Guard: StrictMode mountet doppelt — der Einschalt-Klang soll einmal spielen.
    if (tvOnPlayed.current) return;
    tvOnPlayed.current = true;
    playSound('tvOn'); // Einschalt-Klang des Arbeitsplatzes (L7 liefert Feinschliff-SFX)
  }, []);

  useEffect(() => {
    // Berater-Sprung auch bei BEREITS offenem Terminal: der useState-Initializer
    // läuft nur beim Mount — ohne diesen Effect verpuffte ein späterer Sprung
    // auf eine Nicht-Tür-Aktion (Review E4, logic).
    if (highlightActionId && !kuratiertIds.has(highlightActionId)) setArchiv(true);
  }, [highlightActionId, kuratiertIds]);

  useEffect(() => {
    // Optional chaining: jsdom (Tests) kennt scrollIntoView nicht.
    if (highlightActionId && highlightedRef.current) {
      highlightedRef.current.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightActionId, archiv]);

  // Escape schließt — als CAPTURE-Listener mit stopImmediatePropagation
  // (Muster NarrativeBoard/PixelModal E33): sonst liefe derselbe Tastendruck in
  // die Esc-Kette von StoryModeGame weiter und öffnete ZUSÄTZLICH das
  // Pausenmenü (Review E4 [hoch], inkl. korrumpierter Ernte-Shots).
  // Im ARCHIV-Suchfeld leert die erste Esc-Stufe nur die Suche.
  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key !== 'Escape') return;
      e.stopImmediatePropagation();
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' && searchQuery) {
        setSearchQuery('');
        return;
      }
      onClose();
    },
    [onClose, searchQuery],
  );
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [handleKeyDown]);

  const archivListe = useMemo(() => {
    let result = actions;
    if (activeTab !== 'all') {
      result =
        activeTab === 'unlocked'
          ? result.filter((a) => a.isUnlocked && !a.isUsed)
          : result.filter((a) => a.legality === activeTab);
    }
    if (npcFilter) {
      result = result.filter((a) => a.npc_affinity.includes(npcFilter));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.label_de.toLowerCase().includes(q) ||
          a.narrative_de?.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    // Gleiche Vorsortierung wie die Tür: Strang → Empfehlung → Rest (stabil).
    const rank = (id: string) => (episodeActionIdSet.has(id) ? 0 : recommendedActionIds.has(id) ? 1 : 2);
    return [...result].sort((a, b) => rank(a.id) - rank(b.id));
  }, [actions, activeTab, searchQuery, npcFilter, episodeActionIdSet, recommendedActionIds]);

  const liste = archiv ? archivListe : kuratiert;

  const canAfford = (a: StoryAction) =>
    istLeistbar(a, availableResources) && availableResources.actionPoints > 0;

  const modeButton = (label: string, active: boolean, onClick: () => void, count: number) => (
    <button
      onClick={onClick}
      className="px-3 py-1 text-xs font-bold border-2"
      style={{
        backgroundColor: active ? CRT.green : 'transparent',
        borderColor: active ? CRT.green : CRT.greenDim,
        color: active ? CRT.screen : CRT.textDim,
      }}
    >
      {label} ({count})
    </button>
  );

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center p-4"
      // Der Raum hinter dem Monitor dunkelt ab (Blick in die Röhre).
      style={{ backgroundColor: 'rgba(8, 7, 5, 0.9)' }}
      data-testid="terminal-view"
    >
      {/* Gehäuse (Bakelit-Bezel) */}
      <div
        className="relative flex flex-col w-full h-full max-w-5xl"
        style={{
          backgroundColor: CRT.bezel,
          border: `3px solid ${CRT.bezelEdge}`,
          padding: 10,
          imageRendering: 'pixelated',
        }}
      >
        {/* Schirm */}
        <div
          className="relative flex flex-col flex-1 min-h-0"
          style={{ backgroundColor: CRT.screen, border: `2px solid ${CRT.grid}` }}
        >
          {/* Placeholder in Phosphor-Ton: Browser-Default-Grau wäre Fremdfarbe (Review E4). */}
          <style>{`.crt-suchfeld::placeholder { color: ${CRT.greenDim}; opacity: 1; }`}</style>

          {/* Kopfzeile */}
          <div
            className="flex items-center justify-between px-3 py-2 border-b-2"
            style={{ borderColor: CRT.grid }}
          >
            <div className="min-w-0">
              <div className="font-bold text-sm truncate" style={{ color: CRT.green }}>
                VORGANGS-TERMINAL · ABT. SONDEROPERATIONEN
              </div>
              <div className="text-[10px]" style={{ color: CRT.textDim }}>
                {archiv
                  ? 'ARCHIV: vollständiger Maßnahmen-Katalog'
                  : 'HEUTE RELEVANT: Strang · Empfehlung · frische Maschen'}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={toggleRoehre}
                className="px-2 py-1 text-[10px] font-bold border"
                style={{ borderColor: CRT.greenDim, color: roehre ? CRT.green : CRT.textDim }}
                title="Scanline-Layer an/aus (Memo §2.6)"
              >
                RÖHRE {roehre ? 'AN' : 'AUS'}
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  onClose();
                }}
                className="px-3 py-1 text-xs font-bold border-2"
                style={{ borderColor: CRT.green, color: CRT.green, backgroundColor: 'transparent' }}
              >
                ✕ AUS (ESC)
              </button>
            </div>
          </div>

          {/* Modus-Zeile: Tür-Auswahl vs. Archiv-Schublade (+ Filter im Archiv) */}
          <div
            className="flex flex-wrap items-center gap-2 px-3 py-2 border-b-2"
            style={{ borderColor: CRT.grid }}
          >
            {modeButton('VORGÄNGE', !archiv, () => { setArchiv(false); playSound('click'); }, kuratiert.length)}
            {modeButton('ARCHIV', archiv, () => { setArchiv(true); playSound('click'); }, actions.length)}
            {archiv && (
              <>
                {/* Sicht-Trenner als Kante statt Glyph (das „·"/„│" las als Stray-
                    Pixel, Vision-Review) — greift die Grid-Farbe des Schirms auf. */}
                <span
                  aria-hidden
                  className="self-stretch mx-1"
                  style={{ width: 2, backgroundColor: CRT.grid }}
                />
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="px-2 py-0.5 text-[10px] font-bold border"
                    style={{
                      // Aktive Fläche VOLLTON-grün: screen-Tinte auf greenDim lag bei 4,9:1.
                      backgroundColor: activeTab === tab.id ? CRT.green : 'transparent',
                      borderColor: activeTab === tab.id ? CRT.green : CRT.greenDim,
                      color: activeTab === tab.id ? CRT.screen : CRT.textDim,
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
                <input
                  type="text"
                  placeholder="SUCHBEGRIFF_"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Vorgänge durchsuchen"
                  className="crt-suchfeld flex-1 min-w-32 px-2 py-0.5 text-xs border"
                  style={{
                    backgroundColor: 'transparent',
                    borderColor: CRT.greenDim,
                    color: CRT.green,
                  }}
                />
              </>
            )}
          </div>

          {/* Porträt-Zeile (Plan L2): Zuträger-Filter — wessen Vorgänge? */}
          {archiv && npcIds.length > 0 && (
            <div
              className="flex flex-wrap items-center gap-2 px-3 py-1.5 border-b-2"
              style={{ borderColor: CRT.grid }}
            >
              <span className="text-[10px]" style={{ color: CRT.textDim }}>
                ZUTRÄGER:
              </span>
              {npcIds.map((npcId) => {
                const url = assets.imageUrl(`portrait_${npcId}`);
                const active = npcFilter === npcId;
                return (
                  <button
                    key={npcId}
                    onClick={() => {
                      setNpcFilter((f) => (f === npcId ? null : npcId));
                      playSound('click');
                    }}
                    aria-label={`Nach ${npcId} filtern`}
                    aria-pressed={active}
                    className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold border capitalize"
                    style={{
                      backgroundColor: active ? CRT.green : 'transparent',
                      borderColor: active ? CRT.green : CRT.greenDim,
                      color: active ? CRT.screen : CRT.textDim,
                    }}
                    title={`Vorgänge mit ${npcId}-Vorteil`}
                  >
                    {url && (
                      <img
                        src={url}
                        alt=""
                        width={18}
                        height={18}
                        style={{ imageRendering: 'pixelated', objectFit: 'cover' }}
                      />
                    )}
                    {npcId}
                  </button>
                );
              })}
            </div>
          )}

          {/* Vorgangs-Liste: Papier-Blätter, die der Schirm „aufgerufen" hat */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3">
            {liste.length === 0 ? (
              <div className="h-full min-h-[9rem] flex flex-col items-center justify-center text-center py-10" style={{ color: CRT.textDim }}>
                {/* P9: Der Terminal bleibt bewusst bei seiner eigenen CRT-Palette —
                    aber zentriert wie alle anderen Leerzustände auch. */}
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>KEIN VORGANG FÜR DIESE ABFRAGE</div>
                <div style={{ fontSize: 12 }}>Andere Abteilung wählen oder Filter zurücksetzen.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {liste.map((action) => {
                  const isHighlighted = highlightActionId === action.id;
                  return (
                    <ActionCard
                      key={action.id}
                      action={action}
                      canAfford={canAfford(action)}
                      onSelect={() => {
                        playSound('typewriter');
                        onExecuteAction(action.id);
                      }}
                      onAddToQueue={
                        onAddToQueue
                          ? () => {
                              // T2-SFX: Anheften klingt nach Pinnnadel im Kork (sfx_pin,
                              // Klang-Ernte #98), nicht nach Terminal-Tastatur.
                              playSound('pin');
                              onAddToQueue(action.id);
                            }
                          : undefined
                      }
                      isRecommended={recommendedActionIds.has(action.id)}
                      isEpisodeRelevant={episodeActionIdSet.has(action.id)}
                      isHighlighted={isHighlighted}
                      actionRef={isHighlighted ? highlightedRef : undefined}
                      getMaschenVorschau={getMaschenVorschau}
                    />
                  );
                })}
              </div>
            )}
            {!archiv && (
              <div className="text-center mt-3 text-[10px]" style={{ color: CRT.textDim }}>
                WEITERE MASSNAHMEN: SCHUBLADE „ARCHIV" — GEPLANT WIRD AM KORKBRETT.
              </div>
            )}
          </div>

          {/* Fußzeile: Kasse/Kapazität/AP als Systemzeile */}
          <div
            className="flex items-center justify-between px-3 py-1.5 border-t-2 text-xs"
            style={{ borderColor: CRT.grid, color: CRT.green }}
          >
            <div className="flex gap-4">
              <span>
                <Icon name="budget" size={14} title="Budget" /> {availableResources.budget}K
              </span>
              <span>
                <Icon name="capacity" size={14} title="Kapazität" /> {availableResources.capacity}
              </span>
              <span>
                <Icon name="mission" size={14} title="Aktionspunkte" /> {availableResources.actionPoints} AP
              </span>
              <span style={{ color: queueCount > 0 ? CRT.green : CRT.textDim }} data-testid="terminal-queue-count">
                <Icon name="actions" size={14} title="Angeheftet" /> ANGEHEFTET: {queueCount}
              </span>
            </div>
            <span style={{ color: availableResources.actionPoints > 0 ? CRT.textDim : CRT.amber }}>
              {availableResources.actionPoints > 0 ? 'SYSTEM BEREIT' : 'KEINE AKTIONSPUNKTE — PHASE BEENDEN'}
            </span>
          </div>

          {/* Scanline-Layer: SEPARAT über dem Schirm, abschaltbar, nie im Text (Memo §2.6). */}
          {roehre && (
            <div
              aria-hidden
              data-testid="terminal-scanlines"
              className="absolute inset-0"
              style={{
                pointerEvents: 'none',
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(4, 10, 6, 0.28) 0px, rgba(4, 10, 6, 0.28) 1px, transparent 1px, transparent 3px)',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TerminalView;
