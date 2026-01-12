import { useState, useEffect } from 'react';
import { StoryModeColors } from './theme';
import { DialogBox } from './components/DialogBox';
import { StoryHUD } from './components/StoryHUD';
import { ActionPanel } from './components/ActionPanel';
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
import { useStoryGameState } from './hooks/useStoryGameState';
import { OfficeScreen } from './OfficeScreen';

// ============================================
// TYPES
// ============================================

interface StoryModeGameProps {
  onExit: () => void;
}

// ============================================
// INTRO SCREEN
// ============================================

function IntroScreen({ onStart, onLoadGame, hasSave }: {
  onStart: () => void;
  onLoadGame: () => void;
  hasSave: boolean;
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: StoryModeColors.background }}
    >
      <div
        className="max-w-2xl w-full mx-4 border-8"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.sovietRed,
          boxShadow: '16px 16px 0px 0px rgba(0,0,0,0.9)',
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 border-b-4 text-center"
          style={{
            backgroundColor: StoryModeColors.sovietRed,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="text-4xl mb-2">☭</div>
          <h1
            className="font-bold text-3xl tracking-wider"
            style={{ color: StoryModeColors.warning }}
          >
            OPERATION: WESTUNION
          </h1>
          <p className="text-white/80 mt-2 text-sm">
            Ein Desinformations-Planspiel
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div
            className="mb-6 text-center font-mono text-sm"
            style={{ color: StoryModeColors.textSecondary }}
          >
            <p className="mb-4">
              Sie sind der neue Leiter der Abteilung für Sonderoperationen.
            </p>
            <p className="mb-4">
              Ihre Mission: Die politische Landschaft von Westunion
              zu destabilisieren und das Vertrauen in demokratische
              Institutionen zu untergraben.
            </p>
            <p>
              Sie haben <span style={{ color: StoryModeColors.warning }}>10 Jahre</span> Zeit.
              Wählen Sie weise.
            </p>
          </div>

          {/* Warning */}
          <div
            className="border-2 p-4 mb-6 text-center text-xs"
            style={{
              backgroundColor: StoryModeColors.background,
              borderColor: StoryModeColors.warning,
              color: StoryModeColors.warning,
            }}
          >
            ⚠️ BILDUNGSZWECK: Dieses Spiel dient dem Verständnis von
            Desinformationstaktiken und deren Gegenmaßnahmen.
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onStart}
              className="w-full py-4 border-4 font-bold text-lg transition-all hover:brightness-110 active:translate-y-1"
              style={{
                backgroundColor: StoryModeColors.sovietRed,
                borderColor: StoryModeColors.darkRed,
                color: '#fff',
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,0.8)',
              }}
            >
              NEUE MISSION STARTEN
            </button>

            {hasSave && (
              <button
                onClick={onLoadGame}
                className="w-full py-3 border-4 font-bold transition-all hover:brightness-110 active:translate-y-1"
                style={{
                  backgroundColor: StoryModeColors.agencyBlue,
                  borderColor: StoryModeColors.darkBlue,
                  color: StoryModeColors.warning,
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
                }}
              >
                SPEICHERSTAND LADEN
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-3 border-t-4 text-center text-xs"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
            color: StoryModeColors.textMuted,
          }}
        >
          Basierend auf dem DISARM-Framework | Propaganda-Simulation
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAUSE MENU
// ============================================

import { useState as usePauseState } from 'react';
import { isSoundEnabled, setSoundEnabled, getSoundVolume, setSoundVolume, playSound } from './utils/SoundSystem';

function PauseMenu({ onResume, onSave, onExit }: {
  onResume: () => void;
  onSave: () => void;
  onExit: () => void;
}) {
  const [soundOn, setSoundOn] = usePauseState(isSoundEnabled());
  const [volume, setVolume] = usePauseState(getSoundVolume());

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
              backgroundColor: StoryModeColors.sovietRed,
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
                  style={{ accentColor: StoryModeColors.sovietRed }}
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
    handleConsequenceChoice,
    interactWithNpc,
    markNewsAsRead,
    toggleNewsPinned,
    saveGame,
    loadGame,
    hasSaveGame,
  } = useStoryGameState();

  const [showActionPanel, setShowActionPanel] = useState(false);
  const [showNewsPanel, setShowNewsPanel] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [showNpcPanel, setShowNpcPanel] = useState(false);
  const [showMissionPanel, setShowMissionPanel] = useState(false);
  const [showEventsPanel, setShowEventsPanel] = useState(false);
  const [showActionFeedback, setShowActionFeedback] = useState(false);
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [selectedAdvisorNpc, setSelectedAdvisorNpc] = useState<string | null>(null);
  const [advisorCollapsed, setAdvisorCollapsed] = useState(false);
  const [highlightActionId, setHighlightActionId] = useState<string | null>(null);

  // Count world events
  const worldEventCount = state.newsEvents.filter(e => e.type === 'world_event').length;

  // Tutorial system
  const tutorial = useTutorial();

  // Auto-start tutorial on first play
  useEffect(() => {
    if (state.gamePhase === 'playing' && tutorial.shouldShowTutorial() && !tutorial.isActive) {
      tutorial.start();
    }
  }, [state.gamePhase, tutorial]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // First priority: close dialog if open
        if (state.currentDialog) {
          dismissDialog();
          return;
        }
        // Second priority: toggle pause
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
      // Encyclopedia shortcut (i for info)
      if (e.key === 'i' || e.key === 'I') {
        setShowEncyclopedia(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.gamePhase, state.currentDialog, pauseGame, resumeGame, continueDialog, dismissDialog]);

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

  // Intro Screen
  if (state.gamePhase === 'intro') {
    return (
      <IntroScreen
        onStart={startGame}
        onLoadGame={handleLoad}
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
      <GameEndScreen
        endData={{
          ...state.gameEnd,
          trustHistory: state.trustHistory,
          actors: chartActors,
        }}
        onRestart={resetGame}
        onMainMenu={onExit}
      />
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
        onEndPhase={endPhase}
        onOpenMenu={pauseGame}
      />

      {/* Office Scene (with padding for HUD) */}
      <div className="pt-16 h-full">
        <OfficeScreen
          onExit={pauseGame}
          onOpenActions={() => setShowActionPanel(true)}
          onOpenNews={() => setShowNewsPanel(true)}
          onOpenStats={() => setShowStatsPanel(true)}
          onOpenNpcs={() => setShowNpcPanel(true)}
          onOpenMission={() => setShowMissionPanel(true)}
          onOpenEvents={() => setShowEventsPanel(true)}
          onEndPhase={endPhase}
          resources={state.resources}
          phase={state.storyPhase}
          newsEvents={state.newsEvents}
          objectives={state.objectives}
          unreadNewsCount={state.unreadNewsCount}
          worldEventCount={worldEventCount}
        />
      </div>

      {/* Dialog Box */}
      {state.currentDialog && (
        <DialogBox
          isVisible={true}
          message={{
            speaker: state.currentDialog.speaker,
            speakerTitle: state.currentDialog.speakerTitle,
            text: state.currentDialog.text,
            mood: state.currentDialog.mood,
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

      {/* Action Panel */}
      <ActionPanel
        isVisible={showActionPanel}
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
          setShowActionPanel(false);
          setHighlightActionId(null);
          if (result) {
            setShowActionFeedback(true);
          }
        }}
        onClose={() => {
          setShowActionPanel(false);
          setHighlightActionId(null);
        }}
        recommendations={state.recommendations}
        highlightActionId={highlightActionId}
      />

      {/* News Panel */}
      <NewsPanel
        isVisible={showNewsPanel}
        newsEvents={state.newsEvents}
        onMarkAsRead={markNewsAsRead}
        onTogglePinned={toggleNewsPinned}
        onClose={() => setShowNewsPanel(false)}
      />

      {/* Stats Panel */}
      <StatsPanel
        isVisible={showStatsPanel}
        resources={state.resources}
        phase={state.storyPhase}
        objectives={state.objectives}
        onClose={() => setShowStatsPanel(false)}
      />

      {/* NPC Panel */}
      <NpcPanel
        isVisible={showNpcPanel}
        npcs={state.npcs}
        onSelectNpc={(npcId) => {
          setShowNpcPanel(false);
          interactWithNpc(npcId);
        }}
        onClose={() => setShowNpcPanel(false)}
      />

      {/* Mission Panel */}
      <MissionPanel
        isVisible={showMissionPanel}
        phase={state.storyPhase}
        objectives={state.objectives}
        onClose={() => setShowMissionPanel(false)}
      />

      {/* Events Panel (World Events) */}
      <EventsPanel
        isVisible={showEventsPanel}
        worldEvents={state.newsEvents}
        currentPhase={state.storyPhase.number}
        onClose={() => setShowEventsPanel(false)}
      />

      {/* Action Feedback Dialog */}
      <ActionFeedbackDialog
        isVisible={showActionFeedback}
        result={state.lastActionResult}
        onClose={() => setShowActionFeedback(false)}
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
      {state.gamePhase === 'playing' && (
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
          onToggleCollapse={() => setAdvisorCollapsed(!advisorCollapsed)}
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
            setShowActionPanel(true);
            setSelectedAdvisorNpc(null);
          }}
        />
      )}
    </div>
  );
}

export default StoryModeGame;
