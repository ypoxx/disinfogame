import { useState, useEffect, useRef } from 'react';
import { StoryModeColors } from './theme';
import { GAME_VERSION } from './version';
import { DialogBox } from './components/DialogBox';
import { StoryHUD } from './components/StoryHUD';
import { ActionPanel } from './components/ActionPanel';
import { ActionQueueWidget } from './components/ActionQueueWidget';
import { NewsPanel } from './components/NewsPanel';
import { StatsPanel } from './components/StatsPanel';
import { NpcPanel } from './components/NpcPanel';
import { MissionPanel } from './components/MissionPanel';
import { ActionFeedbackDialog } from './components/ActionFeedbackDialog';
import { ConsequenceModal } from './components/ConsequenceModal';
import { EventsPanel } from './components/EventsPanel';
import { TutorialOverlay, useTutorial } from './components/TutorialOverlay';
import { GameEndScreen } from './components/GameEndScreen';
import { Encyclopedia } from '@/components/Encyclopedia';
import { AdvisorPanel } from './components/AdvisorPanel';
import { AdvisorDetailModal } from './components/AdvisorDetailModal';
import { BetrayalWarningBadge } from './components/BetrayalWarningBadge';
import { GrievanceModal } from './components/GrievanceModal';
import { BetrayalEventModal } from './components/BetrayalEventModal';
import { ComboHintsWidget } from './components/ComboHintsWidget';
import { CrisisModal } from './components/CrisisModal';
import { BetrayalIndicators } from './components/BetrayalIndicators';
import { ConsequenceTimeline } from './components/ConsequenceTimeline';
import { useStoryGameState } from './hooks/useStoryGameState';
import type { ActionResult } from '../game-logic/StoryEngineAdapter';
import { PlayerOfficeView } from './components/PlayerOfficeView';
import { TitleScreen } from './components/TitleScreen';
import { ArrivalSequence } from './components/ArrivalSequence';
import { BuildingView } from './building/BuildingView';
import { BroadcastBar } from './broadcast/BroadcastBar';
import { useAudienceBroadcast } from './broadcast/useAudienceBroadcast';
import { NpcRoomView } from './building/NpcRoomView';
import { DayClock } from './components/DayClock';
import { MorningBriefing } from './components/MorningBriefing';
import { DayReport } from './components/DayReport';
import { EndReport } from './components/EndReport';
import { useDayClockStore, TIME_COST } from './stores/dayClockStore';
import { usePanelStore } from './stores/panelStore';
import { SidePanel } from './components/SidePanel';
import { DashboardView } from './components/DashboardView';
import { initAssetRegistry, useAssets } from './assets';
import { playMusic, stopMusic, isSoundEnabled, setSoundEnabled, getSoundVolume, setSoundVolume, playSound } from './utils/SoundSystem';

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
      <div
        className="w-80 border-4"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.border,
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.9)',
        }}
      >
        <div
          className="px-6 py-4 border-b-4 text-center font-bold"
          style={{
            backgroundColor: StoryModeColors.agencyBlue,
            borderColor: StoryModeColors.border,
            color: StoryModeColors.warning,
          }}
        >
          PAUSE
        </div>

        <div className="p-4 flex flex-col gap-3">
          <button
            onClick={onResume}
            className="w-full py-3 border-2 font-bold transition-all hover:brightness-110 active:translate-y-0.5"
            style={{
              backgroundColor: StoryModeColors.ministryRed,
              borderColor: StoryModeColors.darkRed,
              color: '#fff',
              boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.8)',
            }}
          >
            FORTSETZEN
          </button>
          <button
            onClick={onSave}
            className="w-full py-3 border-2 font-bold transition-all hover:brightness-110 active:translate-y-0.5"
            style={{
              backgroundColor: StoryModeColors.militaryOlive,
              borderColor: StoryModeColors.darkOlive,
              color: StoryModeColors.warning,
              boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.8)',
            }}
          >
            SPEICHERN
          </button>

          {/* Sound Settings */}
          <div
            className="w-full p-3 border-2"
            style={{
              backgroundColor: StoryModeColors.background,
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
                  color: soundOn ? StoryModeColors.warning : StoryModeColors.textSecondary,
                }}
              >
                {soundOn ? 'AN' : 'AUS'}
              </button>
            </div>
            {soundOn && (
              <div className="flex items-center gap-2">
                <span
                  className="text-xs"
                  style={{ color: StoryModeColors.textSecondary }}
                >
                  🔈
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1"
                  style={{ accentColor: StoryModeColors.ministryRed }}
                />
                <span
                  className="text-xs"
                  style={{ color: StoryModeColors.textSecondary }}
                >
                  🔊
                </span>
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
              boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.8)',
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
    continueDialog,
    dismissDialog,
    handleDialogChoice,
    pauseGame,
    resumeGame,
    resetGame,
    endPhase,
    executeAction,
    addToQueue,
    removeFromQueue,
    clearQueue,
    reorderQueue,
    executeQueue,
    handleConsequenceChoice,
    interactWithNpc,
    markNewsAsRead,
    toggleNewsPinned,
    acknowledgeBetrayal,
    dismissBetrayalWarnings,
    addressGrievance,
    resolveCrisis,
    dismissCrisis,
    saveGame,
    loadGame,
    hasSaveGame,
  } = useStoryGameState();

  // Panel state from Zustand store (replaces 8 individual useState hooks)
  const {
    activePanel, togglePanel, setActivePanel,
    broadcastOpen, toggleBroadcast, setBroadcastOpen,
    advisorCollapsed, toggleAdvisor,
    queueCollapsed, toggleQueue,
    viewMode, toggleViewMode, setViewMode,
    resetUI,
  } = usePanelStore();

  const [showActionFeedback, setShowActionFeedback] = useState(false);
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [selectedAdvisorNpc, setSelectedAdvisorNpc] = useState<string | null>(null);
  const [highlightActionId, setHighlightActionId] = useState<string | null>(null);
  const [batchActionResults, setBatchActionResults] = useState<ActionResult[] | null>(null);
  const [selectedGrievanceNpc, setSelectedGrievanceNpc] = useState<string | null>(null);
  // Geführter Einstieg: Title → Ankunfts-Sequenz (Lobby/Fahrstuhl/Zentrale) → Direktor-Dialog.
  const [showArrival, setShowArrival] = useState(false);
  // K1-Tagesschleife: Heimweg-Ritual, Tagesfazit, Morgenbriefing; K8: End-Report.
  const [walkHome, setWalkHome] = useState(false);
  const [showDayReport, setShowDayReport] = useState(false);
  const [briefedPhase, setBriefedPhase] = useState<number | null>(null);
  const [showEndReport, setShowEndReport] = useState(false);
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
  const audience = useAudienceBroadcast(state.lastActionResult, state.storyPhase.number, state.resources.risk);

  // Auto-Peek: Jede neue „Sendung" blendet die Leiste kurz ein, damit der zentrale
  // Feedback-Loop (Tat → Publikum reagiert) sichtbar ist, ohne dass der Spieler B
  // kennen muss (Review-Befund A1). Manuelles Öffnen/Schließen gewinnt immer.
  const lastPeekedItem = useRef<string | null>(null);
  useEffect(() => {
    if (!audience.lastItem || audience.lastItem.id === lastPeekedItem.current) return;
    lastPeekedItem.current = audience.lastItem.id;
    setBroadcastOpen(true);
    const timer = window.setTimeout(() => setBroadcastOpen(false), 4500);
    return () => window.clearTimeout(timer);
  }, [audience.lastItem, setBroadcastOpen]);

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

  // Vertrauens-Fortschritt (Ministerium ↔ Institutionen) fürs Briefing/Fazit.
  const destabObjective = state.objectives.find((o) => o.type === 'primary');
  const trustProgress = destabObjective
    ? Math.max(0, Math.min(1, (100 - destabObjective.currentValue) / Math.max(1, 100 - destabObjective.targetValue)))
    : 0;

  // Tutorial system
  const tutorial = useTutorial();

  // Asset-Manifest laden (public/assets/assets.json) — fehlt es, bleibt der CSS-Look.
  useEffect(() => {
    void initAssetRegistry();
  }, []);

  // Hintergrundmusik (music_theme_main), sobald gespielt wird — No-op ohne Asset.
  // Der Start liegt nach einem Klick (Spielstart), erfüllt also die Autoplay-Policy.
  // `assets` in den Deps: Lädt das Manifest erst NACH dem Spielstart, wiederholt
  // der Effekt den Versuch (sonst bliebe die Musik bis zum Phasenwechsel stumm).
  const assets = useAssets();
  useEffect(() => {
    if (state.gamePhase === 'playing' || state.gamePhase === 'tutorial') {
      // Situative Musik: Krise → angespannter Loop, sonst Büro-Ambience.
      playMusic(state.activeCrisis ? 'music_tense' : 'music_gameplay');
    } else if (state.gamePhase === 'ended') {
      stopMusic();
    }
  }, [state.gamePhase, state.activeCrisis, assets]);

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

  // Keyboard shortcuts (centralized - replaces OfficeScreen's duplicate handler)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
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
        switch (e.key.toLowerCase()) {
          case 'a': togglePanel('actions'); break;
          case 'n': togglePanel('news'); break;
          case 's': togglePanel('stats'); break;
          case 'p': togglePanel('npcs'); break;
          case 'm': togglePanel('mission'); break;
          case 'e': togglePanel('events'); break;
          case 'v': toggleViewMode(); break;
          case 'b': toggleBroadcast(); break;
          case 'i': setShowEncyclopedia(prev => !prev); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.gamePhase, state.currentDialog, pauseGame, resumeGame, continueDialog, dismissDialog, handleDialogChoice, activePanel, togglePanel, setActivePanel, toggleViewMode, toggleBroadcast, setShowEncyclopedia]);

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

  // Einstieg: Title-Screen → überspringbare Ankunfts-Sequenz → Direktor-Dialog (startGame).
  if (state.gamePhase === 'intro') {
    if (showArrival) {
      return (
        <ArrivalSequence
          npcs={state.npcs}
          onDone={() => {
            setShowArrival(false);
            startGame();
          }}
        />
      );
    }
    return (
      <TitleScreen
        onNewGame={() => setShowArrival(true)}
        onContinue={handleLoad}
        hasSave={hasSaveGame()}
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
            backgroundColor: StoryModeColors.agencyBlue,
            borderColor: StoryModeColors.darkBlue,
            color: StoryModeColors.warning,
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
          }}
        >
          VOLLSTÄNDIGER LAGEBERICHT ▸
        </button>
        {showEndReport && (
          <EndReport
            endType={state.gameEnd.type}
            endTitle={state.gameEnd.title_de}
            endNarrative={state.gameEnd.description_de}
            phasesPlayed={state.storyPhase.number}
            completedActionIds={state.completedActions}
            actionsCatalog={state.availableActions.map((act) => ({
              id: act.id,
              label: act.label_de,
              legality: act.legality,
              phase: act.phase,
              tags: act.tags,
            }))}
            trustHistory={state.trustHistory}
            finalResources={{
              budget: state.resources.budget,
              risk: state.resources.risk,
              moralWeight: state.resources.moralWeight,
            }}
            onClose={() => setShowEndReport(false)}
          />
        )}
      </>
    );
  }

  // Main Game View
  return (
    <div
      className="fixed inset-0 font-mono"
      style={{ backgroundColor: StoryModeColors.background }}
    >
      {/* HUD */}
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
          actionPoints: state.resources.actionPointsRemaining,
          maxActionPoints: state.resources.actionPointsMax,
        }}
        objectives={state.objectives.map(o => ({
          id: o.id,
          title: o.label_de,
          progress: o.currentValue,
          target: o.targetValue,
          isCompleted: o.completed,
          isPrimary: o.type === 'primary',
        }))}
        onEndPhase={requestEndDay}
        onOpenMenu={pauseGame}
      />

      {/* Main Layout (with padding for HUD) */}
      <div className="pt-[52px] h-full flex flex-col">
        {/* Sub-HUD Bar: Betrayal Indicators + Consequence Timeline (in-flow, not fixed) */}
        {(state.gamePhase === 'playing' || state.gamePhase === 'tutorial') && (
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
        <div className="relative flex-1 h-full overflow-hidden transition-all duration-300">
          {/* View-Umschalter: Gebäude / Büro / Dashboard + Broadcast-Leiste */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 flex gap-1 p-1 rounded-lg bg-black/60">
            {(['building', 'office', 'dashboard'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2 py-1 text-xs font-semibold rounded text-white transition-colors ${viewMode === mode ? 'bg-red-700' : 'hover:bg-white/10'}`}
              >
                {mode === 'building' ? '🏢 Gebäude (V)' : mode === 'office' ? '🗂️ Büro' : '📊 Dashboard'}
              </button>
            ))}
            <span className="w-px self-stretch bg-white/20" aria-hidden />
            <button
              onClick={toggleBroadcast}
              aria-pressed={broadcastOpen}
              className={`px-2 py-1 text-xs font-semibold rounded text-white transition-colors ${broadcastOpen ? 'bg-red-700' : 'hover:bg-white/10'}`}
              title="Sendung & Publikum (B)"
            >
              📡 Sendung (B)
            </button>
          </div>

          {viewMode === 'building' ? (
            <BuildingView
              npcs={state.npcs}
              onRoomClick={(npcId) => {
                setActivePanel(null);
                interactWithNpc(npcId);
              }}
              onEnterOffice={() => setViewMode('office')}
              walkHome={walkHome}
              onArrivedHome={() => {
                setWalkHome(false);
                setShowDayReport(true);
              }}
            />
          ) : viewMode === 'office' ? (
            <PlayerOfficeView
              onOpenActions={() => togglePanel('actions')}
              onOpenNews={() => togglePanel('news')}
              onOpenStats={() => togglePanel('stats')}
              onOpenNpcs={() => togglePanel('npcs')}
              onOpenMission={() => togglePanel('mission')}
              onOpenEvents={() => togglePanel('events')}
              onEndPhase={requestEndDay}
              onExitToBuilding={() => setViewMode('building')}
              unreadNewsCount={state.unreadNewsCount}
              worldEventCount={worldEventCount}
              showTutorialHints={showOfficeHints}
            />
          ) : (
            <DashboardView
              resources={state.resources}
              phase={state.storyPhase}
              objectives={state.objectives}
              newsEvents={state.newsEvents}
              npcs={state.npcs}
              unreadNewsCount={state.unreadNewsCount}
              worldEventCount={worldEventCount}
              onEndPhase={requestEndDay}
            />
          )}

          {/* Broadcast-Leiste (B): Sendung + Publikum, reine Anzeige-Schicht */}
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

          {broadcastOpen && <BroadcastBar audience={audience} onClose={toggleBroadcast} />}
        </div>

        {/* Sidebar Panel System */}
        <SidePanel>
          {activePanel === 'actions' && (
            <ActionPanel
              isVisible={true}
              variant="sidebar"
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
                isUnlocked: a.available,
                isUsed: !a.available && a.unavailableReason === 'Already used',
              }))}
              currentPhase={state.storyPhase.year <= 7 ? `ta0${state.storyPhase.year}` : 'targeting'}
              availableResources={{
                budget: state.resources.budget,
                capacity: state.resources.capacity,
                actionPoints: state.resources.actionPointsRemaining,
              }}
              onSelectAction={(actionId) => {
                const result = executeAction(actionId);
                setActivePanel(null);
                setHighlightActionId(null);
                if (result) {
                  setShowActionFeedback(true);
                }
              }}
              onAddToQueue={(actionId) => {
                addToQueue(actionId);
              }}
              onClose={() => {
                setActivePanel(null);
                setHighlightActionId(null);
              }}
              recommendations={state.recommendations}
              highlightActionId={highlightActionId}
            />
          )}
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
            onNextDay={() => {
              endPhase();
              useDayClockStore.getState().resetDay();
              setShowDayReport(false);
            }}
          />
        )}

        {/* Morgenbriefing beim Direktor (K1) — einmal je Tag, ab Tag 2 */}
        {state.gamePhase === 'playing' &&
          !showDayReport &&
          !walkHome &&
          !state.currentDialog &&
          state.storyPhase.number > 1 &&
          briefedPhase !== state.storyPhase.number && (
            <MorningBriefing
              phase={state.storyPhase.number}
              risk={state.resources.risk}
              trustProgress={trustProgress}
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
        onClose={() => {
          setShowActionFeedback(false);
          setBatchActionResults(null);
        }}
      />

      {/* Consequence Modal */}
      {state.gamePhase === 'consequence' && state.activeConsequence && (
        <ConsequenceModal
          isVisible={true}
          consequence={state.activeConsequence}
          currentPhase={state.storyPhase.number}
          onChoice={handleConsequenceChoice}
        />
      )}

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
            backgroundColor: StoryModeColors.militaryOlive,
            borderColor: StoryModeColors.darkOlive,
            color: StoryModeColors.warning,
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
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

      {/* Encyclopedia Modal (Press 'I' to toggle) */}
      <Encyclopedia
        isOpen={showEncyclopedia}
        onClose={() => setShowEncyclopedia(false)}
      />

      {/* Advisor Panel */}
      {(state.gamePhase === 'playing' || state.gamePhase === 'tutorial') && (
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
            setHighlightActionId(actionId);
            setActivePanel('actions');
            setSelectedAdvisorNpc(null);
          }}
        />
      )}

      {/* Action Queue Widget */}
      {state.gamePhase === 'playing' && (
        <ActionQueueWidget
          queue={state.actionQueue}
          currentResources={{
            budget: state.resources.budget,
            capacity: state.resources.capacity,
            actionPoints: state.resources.actionPointsRemaining,
          }}
          onRemove={removeFromQueue}
          onClear={clearQueue}
          onExecute={async () => {
            const results = await executeQueue();
            if (results && results.length > 0) {
              const validResults = results.filter(r => r !== null);
              if (validResults.length > 0) {
                setBatchActionResults(validResults as ActionResult[]);
                setShowActionFeedback(true);
              }
            }
          }}
          isCollapsed={queueCollapsed}
          onToggleCollapse={toggleQueue}
        />
      )}

      {/* Combo Hints Widget */}
      {(state.gamePhase === 'playing' || state.gamePhase === 'tutorial') && state.comboHints && state.comboHints.length > 0 && (
        <div
          className="fixed bottom-4 left-4 w-80 z-20"
          style={{ maxHeight: '40vh', overflowY: 'auto' }}
        >
          <ComboHintsWidget hints={state.comboHints} />
        </div>
      )}

      {/* Betrayal System Modals */}
      {state.activeBetrayalEvent && (
        <BetrayalEventModal
          isVisible={true}
          event={state.activeBetrayalEvent}
          onAcknowledge={acknowledgeBetrayal}
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
