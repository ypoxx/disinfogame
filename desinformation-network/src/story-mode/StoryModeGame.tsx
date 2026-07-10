import { useState, useEffect, useRef, useCallback } from 'react';
import { StoryModeColors, stampCtaStyle } from './theme';
import { GAME_VERSION } from './version';
import { DialogBox } from './components/DialogBox';
import { StoryHUD } from './components/StoryHUD';
import { TerminalView } from './components/TerminalView';
import { QueuePinChip } from './components/QueuePinChip';
import { istPlanLeistbar } from './utils/queueAffordability';
import { NewsPanel } from './components/NewsPanel';
import { StatsPanel } from './components/StatsPanel';
import { NpcPanel } from './components/NpcPanel';
import { MissionPanel } from './components/MissionPanel';
import { ActionFeedbackDialog } from './components/ActionFeedbackDialog';
import { ConsequenceModal } from './components/ConsequenceModal';
import { DecisionBeatModal } from './components/DecisionBeatModal';
import { getDecisionBeat, recommendForState } from './engine/DecisionBeats';
import { EventsPanel } from './components/EventsPanel';
import { TutorialOverlay, useTutorial } from './components/TutorialOverlay';
import { GameEndScreen } from './components/GameEndScreen';
import { WahlabendScene } from './components/WahlabendScene';
import { MethodenDossier } from './components/MethodenDossier';
import { AdvisorPanel } from './components/AdvisorPanel';
import { AdvisorDetailModal } from './components/AdvisorDetailModal';
import { BetrayalWarningBadge } from './components/BetrayalWarningBadge';
import { GrievanceModal } from './components/GrievanceModal';
import { BetrayalEventModal } from './components/BetrayalEventModal';
import { StageCountermeasureModal } from './components/StageCountermeasureModal';
import { CrisisModal } from './components/CrisisModal';
import { BetrayalIndicators } from './components/BetrayalIndicators';
import { ConsequenceTimeline } from './components/ConsequenceTimeline';
import { useStoryGameState } from './hooks/useStoryGameState';
import type { ActionResult } from '../game-logic/StoryEngineAdapter';
import { PlayerOfficeView } from './components/PlayerOfficeView';
import { TitleScreen } from './components/TitleScreen';
import { ArrivalSequence } from './components/ArrivalSequence';
import { AuftragSelect } from './components/AuftragSelect';
import { AvatarChoice } from './components/AvatarChoice';
import { BuildingView } from './building/BuildingView';
import { pfoertnerLine as computePfoertnerLine, dominantMood } from './building/pfoertner';
import { BroadcastBar } from './broadcast/BroadcastBar';
import { useAudienceBroadcast } from './broadcast/useAudienceBroadcast';
import { NpcRoomView } from './building/NpcRoomView';
import { NewsroomView, derivePosts } from './components/NewsroomView';
import { deriveGegenseite } from './engine/Gegenseite';
import { FokusgruppeView } from './components/FokusgruppeView';
import { FokusgruppePreTest, FOKUSGRUPPE_COST } from './components/FokusgruppePreTest';
import personasJson from './data/personas.json';
import type { Persona } from './audience/fokusgruppeModel';
import { OperationsAkteView } from './components/OperationsAkteView';
import { loadTargets, loadCarriers, loadPlatforms } from './battlefield/BattlefieldChain';
import { DayClock } from './components/DayClock';
import { Icon } from './components/Icon';
import { MorningBriefing } from './components/MorningBriefing';
import { DayReport } from './components/DayReport';
import { EndReport } from './components/EndReport';
import { classifyMethods, withEpisodeLearnings } from './engine/DisinfoMethodAtlas';
import { useDayClockStore, TIME_COST } from './stores/dayClockStore';
import { installVqaBase, publishVqa } from './harness/vqaHook';
import { usePanelStore } from './stores/panelStore';
import { useDirectorStore } from './stores/directorStore';
import { SidePanel } from './components/SidePanel';
import { LagebildView } from './components/LagebildView';
import { NarrativeBoard } from './components/NarrativeBoard';
import { initAssetRegistry, useAssets, warmImageCache } from './assets';
import { playMusicPool, playAmbience, isSoundEnabled, setSoundEnabled, getSoundVolume, setSoundVolume, playSound, setChannelVolume, getChannelVolume, type SoundChannel } from './utils/SoundSystem';
import { ambienceForContext, musicPoolForState } from './utils/soundDirector';

// ============================================
// TYPES
// ============================================

interface StoryModeGameProps {
  onExit: () => void;
}

// ============================================
// PAUSE MENU
// ============================================

function PauseMenu({ onResume, onSave, onExit }: {
  onResume: () => void;
  onSave: () => void;
  onExit: () => void;
}) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [volume, setVolume] = useState(getSoundVolume());
  // F37: Mixer-Kanäle (lokaler Spiegel des SoundSystem-Zustands).
  const [channels, setChannels] = useState<Record<SoundChannel, number>>({
    music: getChannelVolume('music'),
    sfx: getChannelVolume('sfx'),
    voice: getChannelVolume('voice'),
  });
  const handleChannel = (ch: SoundChannel, v: number) => {
    setChannels((prev) => ({ ...prev, [ch]: v }));
    setChannelVolume(ch, v);
  };

  const handleSoundToggle = () => {
    const newValue = !soundOn;
    setSoundOn(newValue);
    setSoundEnabled(newValue);
    if (newValue) {
      playSound('click');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setSoundVolume(newVolume);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
    >
      {/* PIXEL-Regler „Dienstplan-Tafel" (Plan L1, §4.7): eckiger Tinten-Schieber auf
          segmentierter Leiste. Die repeating-linear-gradient-Stopps sind HARTE Kanten
          (Pixel-Raster als Skalen-Striche), kein weicher Verlauf — §4.6-konform. */}
      <style>{`
        input[type="range"].bs-pixel-range {
          -webkit-appearance: none;
          appearance: none;
          height: 18px;
          background: transparent;
          cursor: pointer;
        }
        input[type="range"].bs-pixel-range:focus-visible {
          outline: 2px solid ${StoryModeColors.agencyBlue};
          outline-offset: 1px;
        }
        input[type="range"].bs-pixel-range::-webkit-slider-runnable-track {
          height: 10px;
          border: 2px solid ${StoryModeColors.border};
          border-radius: 0;
          background-color: ${StoryModeColors.surface};
          background-image: repeating-linear-gradient(
            to right,
            ${StoryModeColors.textSecondary} 0 2px,
            transparent 2px 8px
          );
        }
        input[type="range"].bs-pixel-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 18px;
          margin-top: -6px;
          border: 2px solid ${StoryModeColors.textPrimary};
          border-radius: 0;
          background: ${StoryModeColors.darkConcrete};
          box-shadow: none;
        }
        input[type="range"].bs-pixel-range::-moz-range-track {
          height: 6px;
          border: 2px solid ${StoryModeColors.border};
          border-radius: 0;
          background-color: ${StoryModeColors.surface};
          background-image: repeating-linear-gradient(
            to right,
            ${StoryModeColors.textSecondary} 0 2px,
            transparent 2px 8px
          );
        }
        input[type="range"].bs-pixel-range::-moz-range-thumb {
          width: 10px;
          height: 18px;
          border: 2px solid ${StoryModeColors.textPrimary};
          border-radius: 0;
          background: ${StoryModeColors.darkConcrete};
          box-shadow: none;
        }
      `}</style>
      <div
        className="w-80 border-4"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.border,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
        }}
      >
        <div
          className="px-6 py-4 border-b-4 text-center font-bold"
          style={{
            // v3 §4.7: Kraftband (statt Groß-Blau) → helle Beschriftung.
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
            color: StoryModeColors.surfaceLight,
          }}
        >
          PAUSE
        </div>

        <div className="p-4 flex flex-col gap-3">
          <button
            onClick={onResume}
            className="w-full py-3 font-bold transition-all hover:brightness-95 active:translate-y-0.5"
            style={stampCtaStyle}
          >
            FORTSETZEN
          </button>
          <button
            onClick={onSave}
            className="w-full py-3 border-2 font-bold transition-all hover:brightness-95 active:translate-y-0.5"
            style={{
              // v3 §4.7: Papier-Knopf mit Tinten-Rahmen statt Oliv-Fläche.
              backgroundColor: StoryModeColors.surfaceLight,
              borderColor: StoryModeColors.militaryOlive,
              color: StoryModeColors.darkOlive,
            }}
          >
            SPEICHERN
          </button>

          {/* Sound Settings — v3: „Dienstplan-Tafel" aus Papier (Karteikarte statt Dunkelfläche) */}
          <div
            className="w-full p-3 border-2"
            style={{
              backgroundColor: StoryModeColors.surfaceLight,
              borderColor: StoryModeColors.borderLight,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm font-bold"
                style={{ color: StoryModeColors.textSecondary }}
              >
                SOUND
              </span>
              <button
                onClick={handleSoundToggle}
                className="px-3 py-1 border-2 text-xs font-bold transition-all hover:brightness-110"
                style={{
                  backgroundColor: soundOn ? StoryModeColors.militaryOlive : StoryModeColors.concrete,
                  borderColor: soundOn ? StoryModeColors.darkOlive : StoryModeColors.borderLight,
                  color: soundOn ? StoryModeColors.surfaceLight : StoryModeColors.textSecondary,
                }}
              >
                {soundOn ? 'AN' : 'AUS'}
              </button>
            </div>
            {soundOn && (
              <div className="flex items-center gap-2">
                <Icon name="soundOff" size={14} title="Leise" fallback="-" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 bs-pixel-range"
                />
                <Icon name="soundOn" size={14} title="Laut" fallback="+" />
              </div>
            )}
            {/* F37: Mixer — getrennte Lautstärke für Musik / Effekte / Stimmen */}
            {soundOn && (
              <div className="mt-3 pt-2 flex flex-col gap-1.5" style={{ borderTop: `1px solid ${StoryModeColors.borderLight}` }}>
                {([['music', 'MUSIK'], ['sfx', 'EFFEKTE'], ['voice', 'STIMMEN']] as Array<[SoundChannel, string]>).map(([ch, label]) => (
                  <div key={ch} className="flex items-center gap-2">
                    <span className="text-[10px] w-16 shrink-0" style={{ color: StoryModeColors.textSecondary }}>
                      {label}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={channels[ch]}
                      onChange={(e) => handleChannel(ch, parseFloat(e.target.value))}
                      aria-label={`Lautstärke ${label}`}
                      className="flex-1 bs-pixel-range"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onExit}
            className="w-full py-3 border-2 font-bold transition-all hover:brightness-110 active:translate-y-0.5"
            style={{
              backgroundColor: StoryModeColors.concrete,
              borderColor: StoryModeColors.borderLight,
              color: StoryModeColors.textPrimary,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
            }}
          >
            BEENDEN
          </button>

          {/* Versionsnummer unten im Pausemenü */}
          <div
            className="text-center text-xs"
            style={{ color: StoryModeColors.textMuted, letterSpacing: '0.06em' }}
          >
            v{GAME_VERSION}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN STORY MODE GAME
// ============================================

export function StoryModeGame({ onExit }: StoryModeGameProps) {
  const {
    state,
    startGame,
    skipTutorial,
    chooseAuftrag,
    commissionFokusgruppe,
    continueDialog,
    dismissDialog,
    handleDialogChoice,
    pauseGame,
    resumeGame,
    resetGame,
    endPhase,
    executeAction,
    playOperation,
    buildCarrier,
    acquireKompromat,
    addToQueue,
    removeFromQueue,
    clearQueue,
    reorderQueue,
    executeQueue,
    handleConsequenceChoice,
    decisionBeatResult,
    handleDecisionBeatChoice,
    closeDecisionBeat,
    interactWithNpc,
    markNewsAsRead,
    toggleNewsPinned,
    acknowledgeBetrayal,
    dismissBetrayalWarnings,
    addressGrievance,
    resolveStageCountermeasure,
    dismissStageCountermeasure,
    resolveCrisis,
    dismissCrisis,
    saveGame,
    loadGame,
    hasSaveGame,
  } = useStoryGameState();

  // Panel state from Zustand store (replaces 8 individual useState hooks)
  const {
    activePanel, togglePanel, setActivePanel,
    broadcastExpanded, toggleBroadcast, setBroadcastExpanded,
    advisorCollapsed, toggleAdvisor,
    viewMode, setViewMode,
    resetUI,
  } = usePanelStore();

  const [showActionFeedback, setShowActionFeedback] = useState(false);
  // T2/#26: Tastenkürzel-Hilfe (Taste „?") — die Hotkeys waren nirgends erklärt.
  const [showShortcuts, setShowShortcuts] = useState(false);
  // Spine Slice 2: der vom Director gekürte Beat → Marinas Vorgriff im Morgenbriefing.
  const directorBeat = useDirectorStore((s) => s.currentBeat);
  // Spine Slice 4: ein offener Entscheidungs-Beat, den die UI nach dem Briefing präsentiert.
  const pendingDecisionBeatId = useDirectorStore((s) => s.pendingDecisionBeatId);
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [selectedAdvisorNpc, setSelectedAdvisorNpc] = useState<string | null>(null);
  const [highlightActionId, setHighlightActionId] = useState<string | null>(null);
  // L2 „Herzstück 1": Vollbild-Terminal WÄHLT Maßnahmen (ersetzt die Aktionen-
  // Seitenleiste ersatzlos — geplant/gezeigt wird am Korkbrett, Plan §4.1).
  const [showTerminal, setShowTerminal] = useState(false);
  const [batchActionResults, setBatchActionResults] = useState<ActionResult[] | null>(null);
  const [selectedGrievanceNpc, setSelectedGrievanceNpc] = useState<string | null>(null);
  // Geführter Einstieg: Title → Ankunfts-Sequenz (Lobby/Fahrstuhl/Zentrale) → Direktor-Dialog.
  const [showArrival, setShowArrival] = useState(false);
  const [showAvatarChoice, setShowAvatarChoice] = useState(false);
  // K1-Tagesschleife: Heimweg-Ritual, Tagesfazit, Morgenbriefing; K8: End-Report.
  const [walkHome, setWalkHome] = useState(false);
  const [showDayReport, setShowDayReport] = useState(false);
  const [briefedPhase, setBriefedPhase] = useState<number | null>(null);
  const [showEndReport, setShowEndReport] = useState(false);
  // Etappe 5 (Paket C): der Wahlabend (§9, ein TV-Set, drei Enden) läuft VOR dem
  // GameEndScreen. Erst wenn die Szene durch ist, erscheinen Endscreen + Auto-Report.
  const [electionNightDone, setElectionNightDone] = useState(false);
  // P7/B4 (SOUL §5): „End-Report IST der Lernmoment" → bei Spielende automatisch öffnen,
  // statt ihn hinter einem optionalen Knopf zu verstecken. Schließbar (kein Hard-Trap),
  // re-armt sich für die nächste Partie. Etappe 5: erst NACH dem Wahlabend öffnen.
  const endReportAutoOpened = useRef(false);
  useEffect(() => {
    if (state.gamePhase === 'ended' && state.gameEnd) {
      if (electionNightDone && !endReportAutoOpened.current) {
        endReportAutoOpened.current = true;
        setShowEndReport(true);
      }
    } else {
      endReportAutoOpened.current = false;
      if (electionNightDone) setElectionNightDone(false);
    }
  }, [state.gamePhase, state.gameEnd, electionNightDone]);
  const [showNewsroom, setShowNewsroom] = useState(false);
  const [showFokusgruppe, setShowFokusgruppe] = useState(false);
  // Fokusgruppe Pre-Test (beauftragbare Befragung + Sample-Bias) — analyse-Raum.
  const [showPreTest, setShowPreTest] = useState(false);
  // P1-9: Auftrags-Wahl ist der Abschluss des Direktor-Dialogs (Intro-Schritt nach der
  // Ankunfts-Sequenz), nicht mehr ein Overlay über der bereits laufenden Welt. Bei Neustart
  // (→ 'intro') re-armt der Schritt; geladene Spielstände überspringen ihn (Auftrag steht schon).
  const [showAuftrag, setShowAuftrag] = useState(false);
  useEffect(() => {
    if (state.gamePhase === 'intro') setShowAuftrag(false);
  }, [state.gamePhase]);
  // P2: Operations-Akte (Operationszentrale, Etage 4) — Verbreiter×Plattform-Operation.
  const [showOperationsAkte, setShowOperationsAkte] = useState(false);
  // 2f: Narrativ-Tafel (Korkbrett) — diegetisches Planungs-Herzstück, Pinnwand im Büro.
  const [showBoard, setShowBoard] = useState(false);
  // 2e: Lagebild — „auf einen Blick"-Übersicht am Wand-Monitor (löst das Dashboard ab).
  const [showLagebild, setShowLagebild] = useState(false);
  // 2g/E1/I32: HUD nicht dauerhaft — nur auf Knopfdruck (Taste H). Standard aus;
  // ein dezenter, immer auffindbarer Einstieg (Pause + HUD) bleibt sichtbar.
  const [hudVisible, setHudVisible] = useState(false);
  // Büro-Hotspot-Hinweise nur beim allerersten Besuch (über Sessions persistiert).
  const [showOfficeHints] = useState<boolean>(() => {
    try {
      return !window.localStorage.getItem('storyMode_officeHintsSeen');
    } catch {
      return true;
    }
  });

  // Count world events
  const worldEventCount = state.newsEvents.filter(e => e.type === 'world_event').length;

  // Publikum/Broadcast (Taste B) — reine Anzeige-Schicht über audienceModel.
  const audience = useAudienceBroadcast(state.lastActionResult, state.storyPhase.number, state.resources.risk, {
    activeEpisodes: state.activeEpisodes,
    society: { polarisierung: state.resources.polarisierung, zynismus: state.resources.zynismus },
  });

  // Auto-Peek (2d): Der Streifen ist permanent sichtbar; jede neue „Sendung" klappt
  // kurz das volle Wohnzimmer aus, damit der Feedback-Loop (Tat → Publikum reagiert)
  // sichtbar wird, und klappt dann wieder ein. Manuelles Umschalten (B) gewinnt.
  const lastPeekedItem = useRef<string | null>(null);
  useEffect(() => {
    if (!audience.lastItem || audience.lastItem.id === lastPeekedItem.current) return;
    lastPeekedItem.current = audience.lastItem.id;
    setBroadcastExpanded(true);
    const timer = window.setTimeout(() => setBroadcastExpanded(false), 4500);
    return () => window.clearTimeout(timer);
  }, [audience.lastItem, setBroadcastExpanded]);

  // K1: Aktionen und Gespräche kosten Spielzeit (Ereignis-Uhr, kein Echtzeit-Ticken).
  const lastActionCountRef = useRef(state.completedActions.length);
  useEffect(() => {
    const n = state.completedActions.length;
    if (n > lastActionCountRef.current && state.gamePhase === 'playing') {
      useDayClockStore.getState().advance(TIME_COST.action * (n - lastActionCountRef.current));
    }
    lastActionCountRef.current = n;
  }, [state.completedActions.length, state.gamePhase]);
  const dialogWasOpenRef = useRef(false);
  useEffect(() => {
    const open = !!state.currentDialog;
    if (open && !dialogWasOpenRef.current && state.gamePhase === 'playing') {
      useDayClockStore.getState().advance(TIME_COST.dialog);
    }
    dialogWasOpenRef.current = open;
  }, [state.currentDialog, state.gamePhase]);

  // K1: Tagesende → diegetischer Heimweg (Avatar zur Lobby) → Tagesfazit.
  const dayEnded = useDayClockStore((s) => s.dayEnded);
  const requestEndDay = () => {
    if (showDayReport || walkHome) return;
    setActivePanel(null);
    setViewMode('building');
    setWalkHome(true);
  };
  useEffect(() => {
    if (dayEnded && state.gamePhase === 'playing' && !state.currentDialog && !showDayReport && !walkHome) {
      requestEndDay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dayEnded, state.gamePhase, state.currentDialog]);

  // VQA-Ernte (nur mit ?vqa=1 aktiv, sonst no-op): Engine + Steuer-Callbacks für
  // die Playwright-Screenshot-Ernte exponieren (scripts/visual-review/).
  useEffect(() => {
    installVqaBase();
    publishVqa({
      engine: state.engine,
      gamePhase: state.gamePhase,
      gameEnd: state.gameEnd,
      hasDialog: !!state.currentDialog,
      viewMode,
      startGame,
      chooseAuftrag,
      endPhase,
      requestEndDay,
      interactWithNpc,
      continueDialog,
      dismissDialog,
      pauseGame,
      resumeGame,
      ui: {
        setViewMode,
        setActivePanel,
        setBroadcastExpanded,
        setHudVisible,
        setShowNewsroom,
        setShowLagebild,
        setShowBoard,
        setShowFokusgruppe,
        setShowPreTest,
        setShowOperationsAkte,
        setShowDayReport,
        setWalkHome,
        setShowEndReport,
        setElectionNightDone,
      },
    });
  });

  // Vertrauens-Fortschritt (Ministerium Institutionen) fürs Briefing/Fazit.
  const destabObjective = state.objectives.find((o) => o.type === 'primary');
  const trustProgress = destabObjective
    ? Math.max(0, Math.min(1, (100 - destabObjective.currentValue) / Math.max(1, 100 - destabObjective.targetValue)))
    : 0;

  // T1: EINE Quelle für den Strang-Stand — Tafel-Stummel und Tagesfazit lesen
  // dieselbe Ableitung (der Abschluss-Check selbst lebt im Hook, P0-1).
  const strangStatus = (state.activeEpisodes ?? []).map((ep) => ({
    id: ep.id,
    titel: ep.titel_de,
    wendung: ep.wendung_de,
    aktionen: ep.einklink_aktionen,
    erledigt: ep.einklink_aktionen.filter((id) => state.completedActions.includes(id)),
  }));

  // T4: stockt eine Spur? Aktiver Strang mit offenen Sendungen, von denen keine
  // angeheftet ist — der Kurator erinnert im Morgenbriefing an die Tafel.
  const stockendeSpur = strangStatus.find((s) => {
    const offen = s.aktionen.filter((id) => !s.erledigt.includes(id));
    return offen.length > 0 && !offen.some((id) => state.actionQueue.some((q) => q.actionId === id));
  });

  // Tutorial system
  const tutorial = useTutorial();

  // Asset-Manifest laden (public/assets/assets.json) — fehlt es, bleibt der CSS-Look.
  // Direkt danach den Browser-Cache vorwärmen: Bilder werden im Hintergrund
  // geladen (Räume/Porträts zuerst), damit sie beim Betreten sofort da sind
  // statt erst beim Erscheinen nachzuladen. Läuft schon im Titelbildschirm.
  useEffect(() => {
    void initAssetRegistry().then((registry) => warmImageCache(registry));
  }, []);

  // Hintergrundmusik (music_theme_main), sobald gespielt wird — No-op ohne Asset.
  // Der Start liegt nach einem Klick (Spielstart), erfüllt also die Autoplay-Policy.
  // `assets` in den Deps: Lädt das Manifest erst NACH dem Spielstart, wiederholt
  // der Effekt den Versuch (sonst bliebe die Musik bis zum Phasenwechsel stumm).
  const assets = useAssets();
  useEffect(() => {
    if (state.gamePhase === 'playing' || state.gamePhase === 'tutorial') {
      // Adaptive Musik (J34/J35): Krise immer angespannt, sonst nach Lage (Risiko).
      // Pool → das ruhige Band rotiert zwischen mehreren Tracks (hörbare Abwechslung).
      const pool = state.activeCrisis ? ['music_tense'] : musicPoolForState({ risk: state.resources.risk });
      playMusicPool(pool);
    } else if (state.gamePhase === 'ended') {
      // Ende: hoffnungsvolle Enden hell, sonst düster.
      const won = state.gameEnd?.type === 'victory';
      playMusicPool(musicPoolForState({ risk: state.resources.risk, gameEnded: true, won }));
    }
  }, [state.gamePhase, state.activeCrisis, state.resources.risk, state.gameEnd, assets]);

  // F36: Raum-Klangkulisse je nach aktuellem Ort (zweiter, leiser Loop unter der Musik; Ducking aktiv).
  const ambienceOverlay = showNewsroom ? 'newsroom'
    : (showFokusgruppe || showPreTest) ? 'fokusgruppe'
    : showOperationsAkte ? 'akte'
    : showLagebild ? 'lagebild'
    : showBoard ? 'board'
    : broadcastExpanded ? 'broadcast' // Publikums-Wohnzimmer-Kulisse (Luxus-Sound-Review)
    : null;
  useEffect(() => {
    const active = state.gamePhase === 'playing' || state.gamePhase === 'tutorial';
    playAmbience(ambienceForContext({
      viewMode,
      overlay: ambienceOverlay,
      dialogNpcId: state.currentDialog ? state.activeNpcId : null,
      active,
    }));
  }, [state.gamePhase, viewMode, ambienceOverlay, state.currentDialog, state.activeNpcId, assets]);

  // Luxus-Sound-Review (L6): Fernschreiber-Ausdruck, wenn das Tagesfazit erscheint.
  useEffect(() => {
    if (showDayReport) playSound('teletype');
  }, [showDayReport]);

  // Erster Büro-Besuch gesehen → Hinweise künftig nicht mehr zeigen.
  useEffect(() => {
    if (viewMode === 'office') {
      try {
        window.localStorage.setItem('storyMode_officeHintsSeen', '1');
      } catch {
        // localStorage nicht verfügbar — Hinweise erscheinen dann erneut.
      }
    }
  }, [viewMode]);

  // Kein Auto-Start des 13-Schritt-Text-Tutorials mehr: Das Onboarding ist jetzt
  // diegetisch (Ankunfts-Sequenz → Direktor-Dialog → Büro-Hotspot-Hinweise ①②③).
  // Das Overlay bleibt über das Pausenmenü/Hilfe erreichbar (tutorial.start()).
  // Review-Befund: Doppel-Onboarding zerstörte den Einstieg (Game-Design-Gutachten B1).

  // E4-Wächter: EIN Prädikat für „ein Vollbild-Overlay/Ablauf blockiert gerade" —
  // Hotkeys (A/T) und der Angeheftet-Chip teilen es, damit Tafel/Terminal nie
  // unsichtbar UNTER einem Overlay mounten (Terminal/Tafel selbst sind ausgenommen,
  // ihre Fälle behandelt der Handler explizit).
  const vollbildOverlayOffen =
    showNewsroom || showLagebild || showOperationsAkte || showFokusgruppe ||
    showPreTest || showEncyclopedia || showShortcuts || showDayReport ||
    walkHome || showActionFeedback ||
    // Codex-Review #106: Pflicht-Modals zählen mit — Krise (z-70), Verrat und
    // anstehender Entscheidungs-Beat laufen in gamePhase 'playing'; T/A dürfen
    // die Tafel/das Terminal nicht darüber mounten (z-80 verdeckte die Wahl).
    !!state.activeCrisis || !!state.activeBetrayalEvent || !!pendingDecisionBeatId;

  // §4.1-Sprung: Tafel (plant) → Terminal (wählt) — Taste A und Tafel-Knopf
  // müssen sich identisch verhalten, darum EIN Handler.
  const openTerminalFromBoard = useCallback(() => {
    setShowBoard(false);
    setShowTerminal(true);
  }, []);

  // Keyboard shortcuts (centralized - replaces OfficeScreen's duplicate handler)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        // T2/#26: zuerst die Tastenkürzel-Hilfe schließen.
        if (showShortcuts) {
          setShowShortcuts(false);
          return;
        }
        // L2: Terminal vor Panel/Pause — normalerweise fängt der Capture-Listener
        // des Terminals das Esc schon ab (stopImmediatePropagation); dieser Zweig
        // ist die Absicherung, damit die Kette das Terminal KENNT (Review E4 [hoch]:
        // Esc schloss das Terminal UND öffnete das Pausenmenü).
        if (showTerminal) {
          setShowTerminal(false);
          setHighlightActionId(null);
          return;
        }
        // T1: dieselbe Absicherung für die Tafel — ihr Capture-Listener fängt Esc
        // normalerweise ab, aber die Kette muss sie kennen (E4-Muster Terminal).
        if (showBoard) {
          setShowBoard(false);
          return;
        }
        // First priority: close active sidebar panel
        if (activePanel) {
          setActivePanel(null);
          return;
        }
        // Second priority: close dialog if open
        if (state.currentDialog) {
          dismissDialog();
          return;
        }
        // Third priority: toggle pause
        if (state.gamePhase === 'playing') {
          pauseGame();
        } else if (state.gamePhase === 'paused') {
          resumeGame();
        }
      }
      if (e.key === ' ' && state.currentDialog) {
        e.preventDefault();
        continueDialog();
      }
      // Dialog-Antworten per Zifferntaste (die Optionen zeigen [1]–[4])
      if (state.currentDialog?.choices && /^[1-9]$/.test(e.key)) {
        const choice = state.currentDialog.choices[Number(e.key) - 1];
        if (choice) {
          e.preventDefault();
          handleDialogChoice(choice.id);
        }
      }
      // Panel & view shortcuts (only when playing and no dialog open)
      if (state.gamePhase === 'playing' && !state.currentDialog) {
        const key = e.key.toLowerCase();
        // Am offenen Terminal wirkt nur A (schließen) — andere Panel-Hotkeys
        // öffneten sonst unsichtbar HINTER dem Schirm Seitenleisten-Reiter (E4).
        if (showTerminal && key !== 'a') return;
        // An der offenen Tafel wirken nur T (schließen) und A (Sprung ins
        // Terminal — der §4.1-Weg „wählen dort, planen hier"); E4-Muster.
        if (showBoard && key !== 't' && key !== 'a') return;
        switch (key) {
          // L2: A öffnet das Vorgangs-Terminal (die Aktionen-Seitenleiste ist Geschichte).
          case 'a': {
            if (showTerminal) {
              // Beim Schließen per A den Berater-Sprung mit nullen (staler Highlight, E4).
              setShowTerminal(false);
              setHighlightActionId(null);
            } else if (showBoard) {
              // Tafel → Terminal: wählen und anheften, dann zurück planen.
              openTerminalFromBoard();
            } else if (!vollbildOverlayOffen) {
              // Nicht unsichtbar UNTER einem anderen Vollbild-Overlay mounten
              // (Overlay-Stack, E4 — geteiltes Prädikat, s. vollbildOverlayOffen).
              setShowTerminal(true);
            }
            break;
          }
          // T1: T öffnet/schließt die Narrativ-Tafel (planen) — Overlay-Stack wie A.
          case 't': {
            if (showBoard) {
              setShowBoard(false);
            } else if (!vollbildOverlayOffen) {
              setShowBoard(true);
            }
            break;
          }
          case 'n': togglePanel('news'); break;
          case 's': togglePanel('stats'); break;
          case 'p': togglePanel('npcs'); break;
          case 'm': togglePanel('mission'); break;
          case 'e': togglePanel('events'); break;
          case 'b': toggleBroadcast(); break;
          case 'i': setShowEncyclopedia(prev => !prev); break;
          case 'h': setHudVisible(v => !v); break;
          case '?': setShowShortcuts(v => !v); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.gamePhase, state.currentDialog, pauseGame, resumeGame, continueDialog, dismissDialog, handleDialogChoice, activePanel, togglePanel, setActivePanel, toggleBroadcast, showEncyclopedia, setShowEncyclopedia, showShortcuts, setShowShortcuts, showTerminal, showNewsroom, showBoard, showLagebild, showOperationsAkte, showFokusgruppe, showPreTest, vollbildOverlayOffen, openTerminalFromBoard]);

  // K9 Stufe 1: Autosave bei jedem Phasenwechsel (nur während 'playing').
  // saveGame kommt aus useStoryGameState und wird auch im Pausemenü genutzt.
  useEffect(() => {
    if (state.gamePhase !== 'playing') return;
    const success = saveGame();
    setSaveMessage(success ? 'Automatisch gespeichert' : null);
  // storyPhase.number als einzige Dep — kein Loop durch saveMessage-Änderung.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.storyPhase.number]);

  // K9 Stufe 1: Verlassen-Schutz — Browser-Standard-Dialog bei aktivem Spiel.
  useEffect(() => {
    const aktivePhase =
      state.gamePhase === 'playing' ||
      state.gamePhase === 'tutorial' ||
      state.gamePhase === 'consequence';

    if (!aktivePhase) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent): void => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.gamePhase]);

  // Save message timeout
  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  const handleSave = () => {
    const success = saveGame();
    setSaveMessage(success ? 'Spielstand gespeichert!' : 'Speichern fehlgeschlagen!');
  };

  const handleLoad = () => {
    loadGame();
  };

  // ============================================
  // RENDER
  // ============================================

  // Einstieg: Title → Avatar-Wahl → überspringbare Ankunfts-Sequenz → Direktor-Dialog.
  if (state.gamePhase === 'intro') {
    if (showArrival) {
      return (
        <ArrivalSequence
          npcs={state.npcs}
          onDone={() => {
            // Direktor empfangen → er erteilt jetzt den Auftrag (P1-9), DANN öffnet sich die Welt.
            setShowArrival(false);
            setShowAuftrag(true);
          }}
        />
      );
    }
    if (showAuftrag) {
      return (
        <AuftragSelect
          onChoose={(id) => { chooseAuftrag(id); setShowAuftrag(false); startGame(); }}
        />
      );
    }
    if (showAvatarChoice) {
      return <AvatarChoice onConfirm={() => { setShowAvatarChoice(false); setShowArrival(true); }} />;
    }
    return (
      <TitleScreen
        onNewGame={() => setShowAvatarChoice(true)}
        onContinue={handleLoad}
        hasSave={hasSaveGame()}
      />
    );
  }

  // Etappe 5 (Paket C): Wahlabend zuerst — „Ein TV-Set, drei Enden" (Zielbild §9).
  // Der Balken kippt (Sieg), bleibt stehen (Wahlabend verloren) oder die Sondersendung
  // zeigt die eigenen Maschen als Beweismittel (Land hält stand / Enttarnt).
  if (state.gamePhase === 'ended' && state.gameEnd && !electionNightDone) {
    const wa = state.engine.getWahlabendData();
    const branch = state.gameEnd.branch
      ?? (state.gameEnd.type === 'victory' ? 'victory' : 'timeout');
    const playerHeadlines = state.newsEvents
      .filter((e) => e.type === 'action_result')
      .slice(0, 4)
      .map((e) => e.headline_de);
    return (
      <WahlabendScene
        branch={branch}
        partyName={wa.partyName}
        startPollPct={wa.startPollPct}
        finalPollPct={wa.finalPollPct}
        thresholdPct={wa.thresholdPct}
        audience={audience.country.segments.map((seg) => ({
          label: seg.label_de,
          belief: seg.belief,
          mood: seg.mood,
        }))}
        playerHeadlines={playerHeadlines}
        onComplete={() => setElectionNightDone(true)}
      />
    );
  }

  // Game End Screen (uses elaborate component from components/GameEndScreen.tsx)
  if (state.gamePhase === 'ended' && state.gameEnd) {
    // Convert ExtendedActors to Actor format for TrustEvolutionChart
    const chartActors = state.extendedActors.map(actor => ({
      id: actor.id,
      name: actor.name,
      category: actor.category as 'media' | 'expert' | 'lobby' | 'organization' | 'infrastructure' | 'defensive',
      trust: actor.currentTrust ?? actor.baseTrust,
      baseTrust: actor.baseTrust,
      tier: actor.tier as 1 | 2 | 3,
      resilience: actor.resilience,
      influenceRadius: actor.influenceRadius ?? 0.5,
      emotionalState: actor.emotionalState ?? 0.5,
      recoveryRate: actor.recoveryRate ?? 0.02,
      renderPriority: actor.tier === 1 ? 10 : actor.tier === 2 ? 5 : 2,
      awareness: 0,
      position: { x: 0, y: 0 },
      color: actor.color ?? '#6B7280',
      size: actor.tier === 1 ? 40 : actor.tier === 2 ? 30 : 20,
      connections: [],
      abilities: actor.abilities ?? [],
      activeEffects: [],
      cooldowns: {},
      vulnerabilities: actor.vulnerabilities,
      resistances: actor.resistances,
    }));

    return (
      <>
        <GameEndScreen
          endData={{
            ...state.gameEnd,
            trustHistory: state.trustHistory,
            actors: chartActors,
          }}
          onRestart={() => { resetUI(); resetGame(); }}
          onMainMenu={() => { resetUI(); onExit(); }}
        />
        {/* K8: Zugang zum vollständigen End-Report — „der größte edukative Teil" */}
        <button
          onClick={() => setShowEndReport(true)}
          className="fixed bottom-4 right-4 z-50 px-4 py-3 border-4 font-bold transition-all hover:brightness-110 active:translate-y-0.5"
          style={{
            // v3 §4.7: Kraftband-Knopf mit heller Schrift (warning war Tinte auf Blau).
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
            color: StoryModeColors.document,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
          }}
        >
          VOLLSTÄNDIGER LAGEBERICHT ▸
        </button>
        {showEndReport && (() => {
          // Vollständiger Katalog (auch bereits gespielte Aktionen) → korrekte
          // Legalitäts-Bilanz UND der Bildungs-Kern: reale Methoden hinter den Mechaniken.
          const actionCatalog = state.getActionCatalog();
          const opsSummary = state.getOperationsSummary();
          // P4-Politur: die in abgeschlossenen Episoden vermittelten Lernmomente explizit
          // ausweisen (lernmoment_id → Atlas), zusätzlich zur Tag-Klassifikation der Aktionen.
          const methodsUsed = withEpisodeLearnings(
            classifyMethods({
              completedActionIds: state.completedActions,
              catalog: actionCatalog,
              carriersUsed: opsSummary.carriersUsed,
              platformsUsed: opsSummary.platformsUsed,
              operationsPlayed: opsSummary.operationsPlayed,
              kompromatAcquired: opsSummary.kompromatAcquired,
            }),
            state.engine.getEpisodeLernmomentIds(),
          );
          return (
            <EndReport
              endType={state.gameEnd.type}
              endTitle={state.gameEnd.title_de}
              endNarrative={state.gameEnd.description_de}
              phasesPlayed={state.storyPhase.number}
              completedActionIds={state.completedActions}
              actionsCatalog={actionCatalog}
              trustHistory={state.trustHistory}
              laeuferHistorie={state.engine.getLaeuferHistorie()}
              winThreshold={state.engine.getWinThreshold()}
              finalResources={{
                budget: state.resources.budget,
                risk: state.resources.risk,
                moralWeight: state.resources.moralWeight,
              }}
              methodsUsed={methodsUsed}
              operationsSummary={opsSummary}
              endingStyle={state.gameEnd.assembledEnding ? {
                category: state.gameEnd.assembledEnding.category,
                tone: state.gameEnd.assembledEnding.tone,
                narrative_de: state.gameEnd.assembledEnding.fullNarrative_de,
                // replayHints interleaven de/en → gerade Indizes = deutsch
                replayHints_de: state.gameEnd.assembledEnding.replayHints.filter((_, i) => i % 2 === 0),
              } : undefined}
              onClose={() => setShowEndReport(false)}
            />
          );
        })()}
      </>
    );
  }

  // Main Game View
  return (
    <div
      className="fixed inset-0 font-mono"
      style={{ backgroundColor: StoryModeColors.background }}
    >
      {/* HUD (E1/I32): nur auf Knopfdruck — Taste H, Standard aus, „nicht dauerhaft" */}
      {hudVisible && (
      <StoryHUD
        resources={{
          budget: state.resources.budget,
          capacity: state.resources.capacity,
          risk: state.resources.risk,
          attention: state.resources.attention,
          moralWeight: state.resources.moralWeight,
        }}
        phase={{
          current: state.storyPhase.number,
          year: state.storyPhase.year,
          month: state.storyPhase.month,
          electionDay: state.storyPhase.electionDay,
          actionPoints: state.resources.actionPointsRemaining,
          maxActionPoints: state.resources.actionPointsMax,
        }}
        objectives={state.objectives.map(o => ({
          id: o.id,
          title: o.label_de,
          // B22: richtungs-bewusster Engine-Fortschritt (0–100), NICHT currentValue —
          // beim Senk-Ziel (Vertrauen 100→40) wäre der Balken sonst ab Start voll.
          progress: o.progress,
          target: o.targetValue,
          isCompleted: o.completed,
          isPrimary: o.type === 'primary',
        }))}
        sonntagsfrage={(() => {
          const wa = state.engine.getWahlabendData();
          return { pollPct: wa.finalPollPct, thresholdPct: wa.thresholdPct, auftragTitel: state.engine.getAuftrag().titel_de };
        })()}
        abwehr={state.engine.getAbwehr()}
        abwehrStageInfo={state.engine.getAbwehrStageInfo()}
        exposureCountdown={state.engine.getExposureCountdown()}
        onEndPhase={requestEndDay}
        onOpenMenu={pauseGame}
        onHideHud={() => setHudVisible(false)}
      />
      )}

      {/* Dezenter, IMMER auffindbarer Einstieg (E1): Pause + HUD einblenden, wenn HUD aus */}
      {!hudVisible && (state.gamePhase === 'playing' || state.gamePhase === 'tutorial') && (
        <div className="fixed top-1.5 right-1.5 z-50 flex gap-1">
          <button
            onClick={pauseGame}
            aria-label="Pause / Menü"
            title="Pause / Menü (Esc)"
            className="w-8 h-8 flex items-center justify-center border-2 font-bold hover:brightness-125"
            style={{ backgroundColor: StoryModeColors.darkConcrete, borderColor: StoryModeColors.borderLight, color: StoryModeColors.lightConcrete }}
          >
            ☰
          </button>
          <button
            onClick={() => setHudVisible(true)}
            aria-label="HUD einblenden"
            title="HUD einblenden (H)"
            className="h-8 px-2 flex items-center gap-1 border-2 text-xs font-bold hover:brightness-125"
            style={{ backgroundColor: StoryModeColors.darkConcrete, borderColor: StoryModeColors.borderLight, color: StoryModeColors.lightConcrete }}
          >
            <Icon name="stats" size={12} title="HUD" fallback="HUD" /> HUD · H
          </button>
        </div>
      )}

      {/* Main Layout (Padding nur, wenn HUD sichtbar) */}
      <div className={`${hudVisible ? 'pt-[52px]' : ''} h-full flex flex-col`}>
        {/* Sub-HUD Bar: Betrayal + Consequence — Teil des HUD-Rands, nur mit HUD sichtbar */}
        {hudVisible && (state.gamePhase === 'playing' || state.gamePhase === 'tutorial') && (
          <div
            className="flex items-center gap-2 px-4 py-1 shrink-0 z-30"
            style={{
              backgroundColor: StoryModeColors.background,
              borderBottom: `2px solid ${StoryModeColors.border}`,
            }}
          >
            <BetrayalIndicators
              npcs={state.npcs}
              betrayalStates={state.betrayalStates}
            />
            <div className="flex-1">
              <ConsequenceTimeline
                pendingConsequences={state.engine.getPendingConsequences()}
                currentPhase={state.storyPhase.number}
              />
            </div>
          </div>
        )}

        {/* Content area: Office/Dashboard + SidePanel */}
        <div className="flex-1 flex min-h-0">
        {/* Main content area (Office or Dashboard) - transition prevents layout shift */}
        <div className="relative flex-1 h-full overflow-hidden flex flex-col transition-all duration-300">
          {/* Welt-Ansicht + Overlays; darunter der permanente Broadcast-Streifen (2d).
              Strang 2/2c: kein View-Umschalter (§4.4) — Ortswechsel diegetisch über
              Türen (Büro) und das Fahrstuhl-/Etagen-Tableau (Gebäude). */}
          <div className="relative flex-1 min-h-0">
          {viewMode === 'building' ? (
            <BuildingView
              npcs={state.npcs}
              month={state.storyPhase.month}
              locked={!!state.currentDialog}
              pfoertnerLine={computePfoertnerLine({
                risk: state.resources.risk,
                publicMood: dominantMood(audience.country.segments.map((s) => s.mood)),
                lastHeadline: audience.lastItem?.headline ?? null,
              })}
              risk={state.resources.risk}
              moralWeight={state.resources.moralWeight}
              attention={state.resources.attention}
              auftragId={state.engine.getAuftragId()}
              onRoomClick={(npcId) => {
                setActivePanel(null);
                interactWithNpc(npcId);
              }}
              onEnterOffice={() => setViewMode('office')}
              onEnterRoom={(roomId) => {
                if (roomId === 'newsroom') setShowNewsroom(true);
                else if (roomId === 'analyse') setShowPreTest(true);
                else if (roomId === 'operations') setShowOperationsAkte(true);
              }}
              walkHome={walkHome}
              onArrivedHome={() => {
                setWalkHome(false);
                setShowDayReport(true);
              }}
            />
          ) : (
            <PlayerOfficeView
              onOpenActions={() => setShowTerminal(true)}
              onOpenNews={() => togglePanel('news')}
              onOpenLagebild={() => setShowLagebild(true)}
              onOpenNpcs={() => togglePanel('npcs')}
              onOpenBoard={() => setShowBoard(true)}
              onOpenEvents={() => togglePanel('events')}
              onEndPhase={requestEndDay}
              onExitToBuilding={() => setViewMode('building')}
              unreadNewsCount={state.unreadNewsCount}
              worldEventCount={worldEventCount}
              showTutorialHints={showOfficeHints}
            />
          )}

          {/* Raum-Nahsicht: NPC groß im Raum, sobald ein Gespräch läuft (K6.5) */}
          {state.currentDialog && state.activeNpcId && viewMode === 'building' && (
            <NpcRoomView npcId={state.activeNpcId} mood={state.currentDialog.mood} />
          )}

          {/* Tagesuhr (K1): Handlungen kosten Zeit, 18:00 = Redaktionsschluss */}
          {(state.gamePhase === 'playing' || state.gamePhase === 'tutorial') && (
            <div className="absolute top-2 right-2 z-40">
              <DayClock />
            </div>
          )}
          </div>

          {/* Broadcast permanent (2d): Dauer-Streifen am Welt-Rand, per B ausklappbar */}
          {(state.gamePhase === 'playing' || state.gamePhase === 'tutorial') && (
            <BroadcastBar
              audience={audience}
              expanded={broadcastExpanded}
              onToggle={toggleBroadcast}
              wohnzimmerAlphabet={state.engine.getWohnzimmerAlphabet()}
            />
          )}
        </div>

        {/* Sidebar Panel System (L2: Aktionen leben jetzt im Vorgangs-Terminal) */}
        <SidePanel>
          {activePanel === 'news' && (
            <NewsPanel
              isVisible={true}
              variant="sidebar"
              newsEvents={state.newsEvents}
              onMarkAsRead={markNewsAsRead}
              onTogglePinned={toggleNewsPinned}
              onClose={() => setActivePanel(null)}
            />
          )}
          {activePanel === 'stats' && (
            <StatsPanel
              isVisible={true}
              variant="sidebar"
              resources={state.resources}
              phase={state.storyPhase}
              objectives={state.objectives}
              onClose={() => setActivePanel(null)}
            />
          )}
          {activePanel === 'npcs' && (
            <NpcPanel
              isVisible={true}
              variant="sidebar"
              npcs={state.npcs}
              onSelectNpc={(npcId) => {
                setActivePanel(null);
                interactWithNpc(npcId);
              }}
              onClose={() => setActivePanel(null)}
            />
          )}
          {activePanel === 'mission' && (
            <MissionPanel
              isVisible={true}
              variant="sidebar"
              phase={state.storyPhase}
              objectives={state.objectives}
              auftrag={state.engine.getAuftrag()}
              societyValues={state.resources}
              vertrauen={state.objectives.find((o) => o.id === 'obj_destabilize')?.currentValue}
              onClose={() => setActivePanel(null)}
            />
          )}
          {activePanel === 'events' && (
            <EventsPanel
              isVisible={true}
              variant="sidebar"
              worldEvents={state.newsEvents}
              currentPhase={state.storyPhase.number}
              onClose={() => setActivePanel(null)}
            />
          )}
        </SidePanel>
      </div>
      </div>

        {/* L2 „Herzstück 1": Vorgangs-Terminal — WÄHLT Maßnahmen (M1-Karten,
            M2-Kuratierung + ARCHIV); geplant wird am Korkbrett (Plan §4.1). */}
        {showTerminal && (
          <TerminalView
            actions={state.availableActions.map(a => ({
              id: a.id,
              phase: a.phase,
              label_de: a.label_de,
              label_en: a.label_en,
              narrative_de: a.narrative_de,
              costs: {
                budget: a.costs.budget,
                capacity: a.costs.capacity,
                risk: a.costs.risk,
                attention: a.costs.attention,
                moral_weight: a.costs.moralWeight,
              },
              npc_affinity: a.npcAffinity,
              legality: a.legality,
              tags: a.tags,
              prerequisites: a.prerequisites,
              disarm_ref: a.disarmRef,
              effects: a.effects,
              isUnlocked: a.available,
              isUsed: !a.available && a.unavailableReason === 'Already used',
              // T1: Sperr-Grund war nur auf der Tafel sichtbar — zieht ins ARCHIV um.
              unavailableReason: a.unavailableReason,
            }))}
            episodeActionIds={Array.from(
              new Set((state.activeEpisodes ?? []).flatMap((ep) => ep.einklink_aktionen)),
            )}
            availableResources={{
              budget: state.resources.budget,
              capacity: state.resources.capacity,
              actionPoints: state.resources.actionPointsRemaining,
            }}
            onExecuteAction={(actionId) => {
              const result = executeAction(actionId);
              setShowTerminal(false);
              setHighlightActionId(null);
              if (result) {
                setShowActionFeedback(true);
              }
            }}
            onAddToQueue={(actionId) => {
              addToQueue(actionId);
            }}
            queueCount={state.actionQueue.length}
            onClose={() => {
              setShowTerminal(false);
              setHighlightActionId(null);
            }}
            recommendations={state.recommendations}
            highlightActionId={highlightActionId}
            getMaschenVorschau={(actionId) => state.engine.getMaschenVorschau(actionId)}
          />
        )}

        {/* Newsroom (K5/B15): Social-Feed-Monitor, betreten über den Newsroom-Raum */}
        {showNewsroom && (
          <NewsroomView
            posts={derivePosts(state.newsEvents, audience.history)}
            trending={audience.country.segments
              .slice()
              .sort((a, b) => b.belief - a.belief)
              .slice(0, 5)
              .map((seg) => ({
                topic: seg.label_de,
                volume: Math.round(seg.belief * 100),
                rising: seg.mood === 'wuetend' || seg.mood === 'misstrauisch',
              }))}
            gegenseite={{
              ...deriveGegenseite({
                attention: state.resources.attention,
                risk: state.resources.risk,
                carriersBurned: state.getOperationsSummary().carriersBurned,
                phase: state.storyPhase.number,
                // Etappe 3 Paket D: höchste bereits gezündete Abwehr-Stufe benennt die Gegenseite.
                abwehrStage: state.engine.getAbwehrStageInfo().fired.slice(-1)[0] ?? 0,
              }),
              portraitId: 'portrait_factcheckerin',
            }}
            onClose={() => setShowNewsroom(false)}
          />
        )}

        {/* Fokusgruppe (K4/B14): benannte Personas kommentieren die letzte Kampagne */}
        {showFokusgruppe && (
          <FokusgruppeView
            segments={audience.country.segments.map((seg) => ({
              id: seg.id,
              label_de: seg.label_de,
              milieu: seg.milieu,
              mood: seg.mood,
              belief: seg.belief,
              vulnerabilities: seg.vulnerabilities,
            }))}
            lastHeadline={audience.lastItem?.headline ?? null}
            episodeHints={(state.activeEpisodes ?? []).map((ep) => ep.titel_de)}
            onClose={() => setShowFokusgruppe(false)}
          />
        )}

        {/* Fokusgruppe Pre-Test (beauftragbar): Appell + Stichprobe testen, Sample-Bias aufdecken. */}
        {showPreTest && (
          <FokusgruppePreTest
            personas={personasJson.personas as unknown as Persona[]}
            budget={state.resources.budget}
            onCommission={() => { if (commissionFokusgruppe(FOKUSGRUPPE_COST)) endPhase(); }}
            onClose={() => setShowPreTest(false)}
          />
        )}

        {/* Operations-Akte (P2): Verbreiter×Plattform-Operation gegen ein fiktives Ziel.
            Faktencheck/Sättigung speisen sich aus der Lage (attention/risk → 0..1). */}
        {showOperationsAkte && (
          <OperationsAkteView
            targets={loadTargets()}
            carriers={loadCarriers()}
            platforms={loadPlatforms()}
            backdropUrl={assets.imageUrl('room_operations') ?? undefined}
            factcheckPressure={state.resources.attention / 100}
            saturation={state.resources.risk / 100}
            carrierStates={state.carrierStates}
            acquiredKompromat={state.acquiredKompromat}
            onBuildCarrier={(id) => buildCarrier(id)}
            onAcquireKompromat={(targetId, vulnId) => acquireKompromat(targetId, vulnId)}
            onAusspielen={(params) => {
              playOperation(params);
              setShowOperationsAkte(false);
              setBroadcastExpanded(true);
            }}
            onClose={() => setShowOperationsAkte(false)}
          />
        )}

        {/* Narrativ-Tafel (T1 „Wahrmachen"): Spuren = aktive Episoden-Stränge,
            Karten hängen an ihrem Strang (einklink_aktionen), Fortschritt als
            Stummel; gewählt wird am Terminal (§4.1), hier wird geplant/gesendet. */}
        {showBoard && (
          <NarrativeBoard
            objectives={state.objectives.map((o) => ({
              id: o.id,
              label_de: o.label_de,
              currentValue: o.currentValue,
              targetValue: o.targetValue,
              completed: o.completed,
              isPrimary: o.type === 'primary',
              category: o.category,
            }))}
            strands={strangStatus}
            windows={(state.comboHints ?? []).map((h) => ({
              id: h.comboId,
              name: h.comboName,
              hint: h.hint_de,
              expiresIn: h.expiresIn,
              // T2/L3: der nächste Schritt wandert vom Floating-Widget auf den Zettel.
              nextAction: h.nextAction_de,
            }))}
            // T2-Luxus: Kork-Kachel (Fallback = CSS-Punktraster in der Komponente).
            korkUrl={assets.imageUrl('ui_cork_tile') ?? undefined}
            // T3/T4: Brett-Kapazität + Akt-Band + Umfrage-Horizont aus der Engine.
            slots={state.engine.getNarrativeSlots()}
            akt={{ nummer: state.engine.getAkt().nummer, titel: state.engine.getAkt().titel_de }}
            naechsteSonntagsfrageIn={state.engine.getNaechsteSonntagsfrageIn()}
            queue={state.actionQueue}
            resources={{
              budget: state.resources.budget,
              capacity: state.resources.capacity,
              actionPoints: state.resources.actionPointsRemaining,
            }}
            onUnpin={(queueItemId) => removeFromQueue(queueItemId)}
            onOpenTerminal={openTerminalFromBoard}
            onPlay={async () => {
              const results = await executeQueue();
              // Tafel schließen, BEVOR das Feedback-Modal aufgeht — sonst schluckt
              // ihr Capture-Esc-Listener das Esc des darüberliegenden Modals.
              setShowBoard(false);
              if (results && results.length > 0) {
                const valid = results.filter((r) => r !== null);
                if (valid.length > 0) {
                  setBatchActionResults(valid as ActionResult[]);
                  setShowActionFeedback(true);
                }
              }
            }}
            onClear={clearQueue}
            onClose={() => setShowBoard(false)}
          />
        )}

        {/* Lagebild (2e): „auf einen Blick"-Übersicht am Wand-Monitor (Dashboard abgelöst) */}
        {showLagebild && (
          <LagebildView
            resources={state.resources}
            phase={state.storyPhase}
            objectives={state.objectives}
            newsEvents={state.newsEvents}
            npcs={state.npcs}
            unreadNewsCount={state.unreadNewsCount}
            worldEventCount={worldEventCount}
            vertrauen={state.objectives.find(o => o.id === 'obj_destabilize')?.currentValue ?? 100}
            auftrag={{ titel_de: state.engine.getAuftrag().titel_de, progress: state.engine.getAuftragProgress() }}
            onClose={() => setShowLagebild(false)}
          />
        )}

        {/* Tagesfazit (A4-Pflichtmoment): erscheint nach dem Heimweg */}
        {showDayReport && (
          <DayReport
            phase={state.storyPhase.number}
            headline={audience.lastItem?.headline ?? null}
            tierLabel={audience.lastItem ? audience.lastItem.tier.toUpperCase() : null}
            audienceSegments={audience.country.segments.map((seg) => ({
              label: seg.label_de,
              belief: seg.belief,
              mood: seg.mood,
            }))}
            counterHeadlines={state.newsEvents
              .filter((e) => e.type === 'world_event' || e.type === 'consequence')
              .slice(0, 3)
              .map((e) => e.headline_de)}
            resources={{
              risk: state.resources.risk,
              budget: state.resources.budget,
              attention: state.resources.attention,
            }}
            trustProgress={trustProgress}
            // T1: Strang-Stand am Abend (KONZEPT 2026-07-07 §4.1). Heute ausgespielte
            // Stränge verlassen activeEpisodes sofort (P0-1) — sie kommen aus dem
            // Abschluss-Log, sonst fehlte genau am Payoff-Tag das „ausgespielt ✓".
            straenge={[
              ...strangStatus.map((s) => ({
                id: s.id,
                titel: s.titel,
                done: s.erledigt.length,
                total: s.aktionen.length,
              })),
              ...state.episodeAbschluesse
                .filter((a) => a.phase === state.storyPhase.number)
                .map((a) => ({ id: a.id, titel: a.titel_de, done: a.total, total: a.total })),
            ]}
            // VORSCHAU statt Rückblick: Das Tagesfazit erscheint VOR endPhase — es
            // weist die KOMMENDE Nacht aus (deterministisch aus dem Ist-Zustand).
            nightReport={state.engine.getNightPreview()}
            // Etappe 5 (E18): kommt in der nächsten Nacht eine Tranche der Zentrale? (sonst null)
            tranchePreview={state.engine.getTranchePreview()}
            onNextDay={() => {
              endPhase();
              useDayClockStore.getState().resetDay();
              setShowDayReport(false);
            }}
          />
        )}

        {/* Morgenbriefing beim Direktor (K1) — einmal je Tag. T2/#7: auch an Tag 1,
            aber erst NACH der Auftragswahl (gerichtete Eröffnung der Kern-Schleife). */}
        {state.gamePhase === 'playing' &&
          !showDayReport &&
          !walkHome &&
          !state.currentDialog &&
          (state.storyPhase.number > 1 || !showAuftrag) &&
          briefedPhase !== state.storyPhase.number && (
            <MorningBriefing
              phase={state.storyPhase.number}
              risk={state.resources.risk}
              trustProgress={trustProgress}
              budget={state.resources.budget}
              attention={state.resources.attention}
              auftragTitel={state.engine.getAuftrag().titel_de}
              beatHook={directorBeat?.vorgriffZeile_de}
              spurHinweis={stockendeSpur
                ? `Spur „${stockendeSpur.titel}" stockt — keine Sendung geplant. Die passenden Maßnahmen liegen im Terminal obenan.`
                : undefined}
              onDone={() => setBriefedPhase(state.storyPhase.number)}
            />
          )}

      {/* Dialog Box */}
      {state.currentDialog && (
        <DialogBox
          isVisible={true}
          message={{
            speaker: state.currentDialog.speaker,
            speakerTitle: state.currentDialog.speakerTitle,
            text: state.currentDialog.text,
            mood: state.currentDialog.mood,
            voiceAssetId: state.currentDialog.voiceAssetId,
            choices: state.currentDialog.choices?.map(c => ({
              id: c.id,
              text: c.text,
              cost: c.cost,
              disabled: c.disabled,
              disabledReason: c.disabledReason,
            })),
          }}
          onChoice={handleDialogChoice}
          onContinue={continueDialog}
          onClose={dismissDialog}
        />
      )}

      {/* Action Feedback Dialog */}
      <ActionFeedbackDialog
        isVisible={showActionFeedback}
        result={batchActionResults || state.lastActionResult}
        npcs={state.npcs}
        audienceSegments={audience.country.segments.map((seg) => ({
          label: seg.label_de,
          mood: seg.mood,
          belief: seg.belief,
        }))}
        onClose={() => {
          setShowActionFeedback(false);
          setBatchActionResults(null);
        }}
      />

      {/* T2/#26: Tastenkürzel-Hilfe (Taste „?") — die Hotkeys waren nirgends erklärt. */}
      {showShortcuts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={() => setShowShortcuts(false)}
          role="button"
          aria-label="Tastenkürzel schließen"
        >
          <div
            className="mx-4 max-w-md w-full border-4 p-6"
            style={{ backgroundColor: StoryModeColors.surface, borderColor: StoryModeColors.border }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* v3 §4.7: Akten-Rahmen statt Alarm-Rot (Rot-Disziplin, P5-Befund). */}
            <h2 className="font-bold text-lg mb-4" style={{ color: StoryModeColors.textPrimary }}>
              TASTENKÜRZEL
            </h2>
            <div className="grid grid-cols-1 gap-1 text-sm">
              {([
                ['A', 'Terminal / Aktionen'],
                ['T', 'Narrativ-Tafel (Sendeplan)'],
                ['N', 'Nachrichten'],
                ['S', 'Statistik'],
                ['P', 'Personal (NPCs)'],
                ['M', 'Mission & Auftrag'],
                ['E', 'Ereignisse'],
                ['B', 'Sendung (Broadcast)'],
                ['I', 'Methoden-Dossier'],
                ['F', 'Etagen-Verzeichnis'],
                ['H', 'HUD ein/aus'],
                ['Leertaste', 'Dialog weiter'],
                ['Esc', 'Schließen / Pause'],
                ['?', 'Diese Hilfe'],
              ] as [string, string][]).map(([k, d]) => (
                <div
                  key={k}
                  className="flex justify-between border-b py-1"
                  style={{ borderColor: StoryModeColors.border }}
                >
                  <span className="font-bold" style={{ color: StoryModeColors.warning }}>{k}</span>
                  <span style={{ color: StoryModeColors.textSecondary }}>{d}</span>
                </div>
              ))}
            </div>
            <div className="text-xs mt-4 text-center" style={{ color: StoryModeColors.textMuted }}>
              Klick oder Esc zum Schließen
            </div>
          </div>
        </div>
      )}

      {/* Consequence Modal */}
      {state.gamePhase === 'consequence' && state.activeConsequence && (
        <ConsequenceModal
          isVisible={true}
          consequence={state.activeConsequence}
          currentPhase={state.storyPhase.number}
          onChoice={handleConsequenceChoice}
        />
      )}

      {/* Decision Beat Modal (Spine Slice 4): nach dem Morgenbriefing präsentiert, wenn
          kein anderes Overlay blockiert. Marina hat den Beat im Briefing vorweggenommen. */}
      {pendingDecisionBeatId &&
        state.gamePhase === 'playing' &&
        briefedPhase === state.storyPhase.number &&
        !state.currentDialog &&
        !showDayReport &&
        !walkHome &&
        !state.activeCrisis &&
        !state.activeConsequence &&
        (() => {
          const beat = getDecisionBeat(pendingDecisionBeatId) ?? null;
          // Berater-Empfehlung für die aktuelle Lage (strategie-/lage-/geschichte-relativ).
          const recommendedOptionId = beat
            ? recommendForState(beat, {
                auftragId: state.engine.getAuftrag().id,
                risk: state.resources.risk,
                attention: state.resources.attention,
                budget: state.resources.budget,
                inoculation: beat.themaId ? state.engine.getInoculation(beat.themaId) : 0,
              }).id
            : undefined;
          return (
            <DecisionBeatModal
              isVisible={true}
              beat={beat}
              result={decisionBeatResult}
              recommendedOptionId={recommendedOptionId}
              onChoose={(optionId) => handleDecisionBeatChoice(pendingDecisionBeatId, optionId)}
              onClose={closeDecisionBeat}
            />
          );
        })()}

      {/* Pause Menu */}
      {state.gamePhase === 'paused' && (
        <PauseMenu
          onResume={resumeGame}
          onSave={handleSave}
          onExit={onExit}
        />
      )}

      {/* Save Message */}
      {saveMessage && (
        <div
          className="fixed bottom-4 right-4 px-4 py-2 border-2 font-bold animate-fade-in z-50"
          style={{
            // v3 §4.7: Papier-Quittung mit Erfolgs-Tinte (Oliv-Fläche + warning war 1,5:1).
            backgroundColor: StoryModeColors.surfaceLight,
            borderColor: StoryModeColors.success,
            color: StoryModeColors.success,
          }}
        >
          {saveMessage}
        </div>
      )}

      {/* Tutorial Overlay */}
      {tutorial.isActive && tutorial.currentStepData && (
        <TutorialOverlay
          step={tutorial.currentStepData}
          currentStep={tutorial.currentStep}
          totalSteps={tutorial.totalSteps}
          onNext={tutorial.next}
          onSkip={tutorial.skip}
          onComplete={tutorial.complete}
        />
      )}

      {/* Methoden-Dossier (P1-5: Taste I) — deutscher Atlas der realen Desinfo-Muster,
          aus einem Guss mit dem End-Report (löst die alte englische Pro-Mode-Encyclopedia ab) */}
      <MethodenDossier
        isOpen={showEncyclopedia}
        onClose={() => setShowEncyclopedia(false)}
      />

      {/* Advisor Panel — während eines Gesprächs ausgeblendet (freie Sicht aufs NPC-Gespräch
          + dessen Maßnahmen-Optionen; Empfehlungen erscheinen jetzt diegetisch im Dialog). */}
      {(state.gamePhase === 'playing' || state.gamePhase === 'tutorial') && !state.currentDialog && (
        <AdvisorPanel
          npcs={state.npcs.map(npc => ({
            id: npc.id,
            name: npc.name,
            title_de: npc.role_de,
            morale: npc.morale,
            relationshipLevel: npc.relationshipLevel || 0,
            available: npc.available,
          }))}
          recommendations={state.recommendations}
          onSelectNpc={(npcId) => setSelectedAdvisorNpc(npcId)}
          isCollapsed={advisorCollapsed}
          onToggleCollapse={toggleAdvisor}
          betrayalStates={state.betrayalStates}
          onOpenGrievances={(npcId) => setSelectedGrievanceNpc(npcId)}
        />
      )}

      {/* Advisor Detail Modal */}
      {selectedAdvisorNpc && (
        <AdvisorDetailModal
          npc={state.npcs.find(n => n.id === selectedAdvisorNpc)
            ? {
                id: state.npcs.find(n => n.id === selectedAdvisorNpc)!.id,
                name: state.npcs.find(n => n.id === selectedAdvisorNpc)!.name,
                title_de: state.npcs.find(n => n.id === selectedAdvisorNpc)!.role_de,
                morale: state.npcs.find(n => n.id === selectedAdvisorNpc)!.morale,
                relationshipLevel: state.npcs.find(n => n.id === selectedAdvisorNpc)!.relationshipLevel || 0,
                available: state.npcs.find(n => n.id === selectedAdvisorNpc)!.available,
              }
            : null}
          recommendations={state.recommendations}
          onClose={() => setSelectedAdvisorNpc(null)}
          onSelectAction={(actionId) => {
            // L2: Berater-Sprung landet im Terminal (Archiv öffnet + scrollt hin).
            setHighlightActionId(actionId);
            setShowTerminal(true);
            setSelectedAdvisorNpc(null);
          }}
        />
      )}

      {/* Angeheftet-Chip (F-D): die Queue wird an der Tafel verwaltet (EIN
          Planungsort, §4.1) — hier nur die Sprungmarke. Im Gespräch, am Terminal,
          an offener Tafel, bei Broadcast-Vollbild UND unter jedem Vollbild-Overlay
          aus (gleiches E4-Prädikat wie die Hotkeys — der Klick darf die Tafel
          nicht unter Report/Heimweg/Modal mounten). */}
      {state.gamePhase === 'playing' && !state.currentDialog && !showTerminal && !showBoard &&
        !broadcastExpanded && !vollbildOverlayOffen && state.actionQueue.length > 0 && (
        <QueuePinChip
          count={state.actionQueue.length}
          warnung={!istPlanLeistbar(state.actionQueue, {
            budget: state.resources.budget,
            capacity: state.resources.capacity,
            actionPoints: state.resources.actionPointsRemaining,
          })}
          onOpenBoard={() => setShowBoard(true)}
        />
      )}

      {/* T2/L3: Das Combo-Hints-Widget ist als Zettel in der Narrativ-Tafel
          aufgegangen (V6 zu, EIN Planungsort) — archive/story-mode-drafts/. */}

      {/* Betrayal System Modals */}
      {state.activeBetrayalEvent && (
        <BetrayalEventModal
          isVisible={true}
          event={state.activeBetrayalEvent}
          onAcknowledge={acknowledgeBetrayal}
        />
      )}

      {/* Etappe 3 (Paket B): Stufen-Gegenmaßnahme (Abwehr 25/50/75) */}
      {state.activeStageCountermeasure && (
        <StageCountermeasureModal
          offer={state.activeStageCountermeasure}
          onResolve={resolveStageCountermeasure}
          onClose={dismissStageCountermeasure}
        />
      )}

      {selectedGrievanceNpc && state.betrayalStates.get(selectedGrievanceNpc) && (
        <GrievanceModal
          isVisible={true}
          betrayalState={state.betrayalStates.get(selectedGrievanceNpc)!}
          npcName={state.npcs.find(n => n.id === selectedGrievanceNpc)?.name || selectedGrievanceNpc}
          onClose={() => setSelectedGrievanceNpc(null)}
          onAddressGrievance={(grievanceId) => {
            addressGrievance(selectedGrievanceNpc, grievanceId);
            setSelectedGrievanceNpc(null);
          }}
        />
      )}

      {/* Crisis System Modal */}
      {state.activeCrisis && (
        <CrisisModal
          isVisible={true}
          crisis={state.activeCrisis.crisis}
          currentResources={{
            budget: state.resources.budget,
            attention: state.resources.attention,
            risk: state.resources.risk,
          }}
          phasesRemaining={
            state.activeCrisis.expiresPhase
              ? state.activeCrisis.expiresPhase - state.storyPhase.number
              : undefined
          }
          onSelectChoice={resolveCrisis}
          onDismiss={dismissCrisis}
        />
      )}
    </div>
  );
}

export default StoryModeGame;
