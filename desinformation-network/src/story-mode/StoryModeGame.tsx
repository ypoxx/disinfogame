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
// GAME END SCREEN
// ============================================

function GameEndScreen({ gameEnd, stats, onRestart, onExit }: {
  gameEnd: {
    type: string;
    title_de: string;
    description_de: string;
    epilogue_de: string;
  };
  stats: {
    phasesPlayed: number;
    actionsExecuted: number;
    moralWeight: number;
  };
  onRestart: () => void;
  onExit: () => void;
}) {
  const isVictory = gameEnd.type === 'victory';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: StoryModeColors.background }}
    >
      <div
        className="max-w-2xl w-full mx-4 border-8"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: isVictory ? StoryModeColors.militaryOlive : StoryModeColors.danger,
          boxShadow: '16px 16px 0px 0px rgba(0,0,0,0.9)',
        }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 border-b-4 text-center"
          style={{
            backgroundColor: isVictory ? StoryModeColors.militaryOlive : StoryModeColors.danger,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="text-4xl mb-2">{isVictory ? '🎖️' : '💀'}</div>
          <h1
            className="font-bold text-2xl tracking-wider"
            style={{ color: isVictory ? StoryModeColors.warning : '#fff' }}
          >
            {gameEnd.title_de}
          </h1>
        </div>

        {/* Content */}
        <div className="p-8">
          <p
            className="text-center mb-6 font-mono"
            style={{ color: StoryModeColors.textPrimary }}
          >
            {gameEnd.description_de}
          </p>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-4 mb-6 p-4 border-2"
            style={{
              backgroundColor: StoryModeColors.background,
              borderColor: StoryModeColors.borderLight,
            }}
          >
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: StoryModeColors.warning }}
              >
                {Math.floor(stats.phasesPlayed / 12)}
              </div>
              <div
                className="text-xs"
                style={{ color: StoryModeColors.textSecondary }}
              >
                JAHRE
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: StoryModeColors.agencyBlue }}
              >
                {stats.actionsExecuted}
              </div>
              <div
                className="text-xs"
                style={{ color: StoryModeColors.textSecondary }}
              >
                AKTIONEN
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: StoryModeColors.sovietRed }}
              >
                {stats.moralWeight}
              </div>
              <div
                className="text-xs"
                style={{ color: StoryModeColors.textSecondary }}
              >
                MORAL. LAST
              </div>
            </div>
          </div>

          {/* Epilogue */}
          <div
            className="p-4 mb-6 border-l-4 font-mono text-sm italic"
            style={{
              backgroundColor: StoryModeColors.background,
              borderColor: StoryModeColors.document,
              color: StoryModeColors.textSecondary,
            }}
          >
            "{gameEnd.epilogue_de}"
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onRestart}
              className="flex-1 py-3 border-4 font-bold transition-all hover:brightness-110 active:translate-y-1"
              style={{
                backgroundColor: StoryModeColors.sovietRed,
                borderColor: StoryModeColors.darkRed,
                color: '#fff',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
              }}
            >
              NOCHMAL SPIELEN
            </button>
            <button
              onClick={onExit}
              className="flex-1 py-3 border-4 font-bold transition-all hover:brightness-110 active:translate-y-1"
              style={{
                backgroundColor: StoryModeColors.concrete,
                borderColor: StoryModeColors.borderLight,
                color: StoryModeColors.textPrimary,
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
              }}
            >
              ZUM HAUPTMENÜ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAUSE MENU
// ============================================

function PauseMenu({ onResume, onSave, onExit }: {
  onResume: () => void;
  onSave: () => void;
  onExit: () => void;
}) {
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
  const [showActionFeedback, setShowActionFeedback] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.gamePhase, state.currentDialog, pauseGame, resumeGame, continueDialog]);

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

  // Game End Screen
  if (state.gamePhase === 'ended' && state.gameEnd) {
    return (
      <GameEndScreen
        gameEnd={state.gameEnd}
        stats={state.gameEnd.stats}
        onRestart={resetGame}
        onExit={onExit}
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
          onEndPhase={endPhase}
          resources={state.resources}
          phase={state.storyPhase}
          newsEvents={state.newsEvents}
          objectives={state.objectives}
          unreadNewsCount={state.unreadNewsCount}
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
          if (result) {
            setShowActionFeedback(true);
          }
        }}
        onClose={() => setShowActionPanel(false)}
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
    </div>
  );
}

export default StoryModeGame;
