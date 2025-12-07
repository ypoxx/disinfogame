import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { formatPercent } from '@/utils';
import { trustToHex } from '@/utils/colors';
import { Button } from '@/components/ui/Button';
import { NetworkVisualization, type TrustChange } from '@/components/NetworkVisualization';
import { RoundSummary } from '@/components/RoundSummary';
import { VictoryProgressBar } from '@/components/VictoryProgressBar';
import { TutorialOverlay, TutorialProgress } from '@/components/TutorialOverlay';
import { BottomSheet } from '@/components/BottomSheet';
import type { RoundSummary as RoundSummaryType } from '@/game-logic/types/narrative';
import { NarrativeGenerator } from '@/game-logic/NarrativeGenerator';
import { createInitialTutorialState } from '@/game-logic/types/tutorial';
import type { TutorialState } from '@/game-logic/types/tutorial';

// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
  const {
    gameState,
    uiState,
    networkMetrics,
    startGame,
    advanceRound,
    resetGame,
    undoAction,
    selectActor,
    hoverActor,
    getActor,
    selectAbility,
    cancelAbility,
    canUseAbility,
    getActorAbilities,
    toggleEncyclopedia,
    addNotification,
  } = useGameState();

  // Pause state
  const [isPaused, setIsPaused] = useState(false);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Trust change tracking for floating numbers
  const [trustChanges, setTrustChanges] = useState<TrustChange[]>([]);
  const previousTrustValues = useRef<Map<string, number>>(new Map());

  // Track trust changes when actors update
  useEffect(() => {
    const currentTrust = new Map<string, number>();
    const changes: TrustChange[] = [];
    const now = Date.now();

    gameState.network.actors.forEach(actor => {
      currentTrust.set(actor.id, actor.trust);

      const prevTrust = previousTrustValues.current.get(actor.id);
      if (prevTrust !== undefined && prevTrust !== actor.trust) {
        const delta = actor.trust - prevTrust;
        // Only show significant changes (> 0.5%)
        if (Math.abs(delta) > 0.005) {
          changes.push({
            actorId: actor.id,
            delta,
            timestamp: now,
          });
        }
      }
    });

    if (changes.length > 0) {
      setTrustChanges(prev => [...prev, ...changes]);
    }

    previousTrustValues.current = currentTrust;
  }, [gameState.network.actors]);

  // Clean up old trust changes (older than 3 seconds)
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setTrustChanges(prev => prev.filter(c => now - c.timestamp < 3000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Only handle during playing phase
      if (gameState.phase !== 'playing') return;

      switch (e.key) {
        case 'Escape':
          if (isPaused) {
            setIsPaused(false);
          } else if (uiState.targetingMode) {
            cancelAbility();
          } else if (uiState.selectedActor) {
            selectActor(null);
          }
          break;
        case 'Enter':
          if (!uiState.targetingMode && !isPaused) {
            advanceRound();
          }
          break;
        case ' ':
          e.preventDefault();
          togglePause();
          break;
        case 'z':
          if ((e.ctrlKey || e.metaKey) && !isPaused) {
            undoAction();
            addNotification('info', 'Action undone');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.phase, isPaused, uiState.targetingMode, uiState.selectedActor, cancelAbility, selectActor, advanceRound, togglePause, undoAction, addNotification]);

  // Round summary state
  const [showRoundSummary, setShowRoundSummary] = useState(false);
  const [currentRoundSummary, setCurrentRoundSummary] = useState<RoundSummaryType | null>(null);
  const [previousRound, setPreviousRound] = useState(0);
  const [networkBefore, setNetworkBefore] = useState(networkMetrics);

  // Tutorial state - load from localStorage if previously skipped/completed
  const [tutorialState, setTutorialState] = useState<TutorialState>(() => {
    const saved = localStorage.getItem('tutorial-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.skipped || parsed.completed) {
          return {
            ...createInitialTutorialState(),
            skipped: parsed.skipped || false,
            completed: parsed.completed || false,
            active: false
          };
        }
      } catch (e) {
        // Ignore parse errors, use default state
      }
    }
    return createInitialTutorialState();
  });
  const [showTutorial, setShowTutorial] = useState(false);

  // Track round changes and generate summaries
  useEffect(() => {
    if (gameState.phase === 'playing' && gameState.round > previousRound && previousRound > 0) {
      // Round just advanced - generate summary
      const summary: RoundSummaryType = {
        round: previousRound,
        playerActions: [],
        automaticEvents: [],
        networkBefore: {
          averageTrust: networkBefore.averageTrust,
          lowTrustCount: networkBefore.lowTrustCount,
          highTrustCount: networkBefore.highTrustCount,
          polarization: networkBefore.polarizationIndex,
        },
        networkAfter: {
          averageTrust: networkMetrics.averageTrust,
          lowTrustCount: networkMetrics.lowTrustCount,
          highTrustCount: networkMetrics.highTrustCount,
          polarization: networkMetrics.polarizationIndex,
        },
        totalTrustChange: networkBefore.averageTrust - networkMetrics.averageTrust,
        actorsAffected: Math.abs(networkMetrics.lowTrustCount - networkBefore.lowTrustCount),
        propagationDepth: 1,
        roundNarrative: NarrativeGenerator.generateRoundNarrative(
          [],
          { averageTrust: networkBefore.averageTrust, polarization: networkBefore.polarizationIndex },
          { averageTrust: networkMetrics.averageTrust, polarization: networkMetrics.polarizationIndex }
        ),
        keyMoments: [],
        consequences: NarrativeGenerator.generateConsequences(
          { averageTrust: networkBefore.averageTrust, lowTrustCount: networkBefore.lowTrustCount },
          { averageTrust: networkMetrics.averageTrust, lowTrustCount: networkMetrics.lowTrustCount, polarization: networkMetrics.polarizationIndex },
          []
        ),
      };

      setCurrentRoundSummary(summary);
      setShowRoundSummary(true);
    }

    setPreviousRound(gameState.round);
    setNetworkBefore(networkMetrics);
  }, [gameState.round, gameState.phase]);

  const handleContinue = () => {
    setShowRoundSummary(false);
  };

  // Tutorial handlers - persist state to localStorage
  const handleTutorialNext = () => {
    setTutorialState(prev => {
      const nextStep = prev.currentStep + 1;
      if (nextStep >= prev.steps.length) {
        // Tutorial completed - save to localStorage
        localStorage.setItem('tutorial-state', JSON.stringify({ skipped: false, completed: true }));
        return { ...prev, active: false, completed: true };
      }
      return {
        ...prev,
        currentStep: nextStep,
        steps: prev.steps.map((step, i) =>
          i === prev.currentStep ? { ...step, completed: true } : step
        )
      };
    });
  };

  const handleTutorialSkip = () => {
    // Save skip status to localStorage
    localStorage.setItem('tutorial-state', JSON.stringify({ skipped: true, completed: false }));
    setTutorialState(prev => ({
      ...prev,
      active: false,
      skipped: true,
      completed: false
    }));
    setShowTutorial(false);
  };

  // Show tutorial when game starts
  useEffect(() => {
    if (gameState.phase === 'playing' && gameState.round === 1 && !tutorialState.skipped && !tutorialState.completed) {
      setShowTutorial(true);
    }
  }, [gameState.phase, gameState.round, tutorialState.skipped, tutorialState.completed]);

  // Tutorial is now fully manual - all steps use Continue button

  // ============================================
  // SCREENS
  // ============================================

  // Start Screen
  if (gameState.phase === 'start') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Desinformation Network
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            An educational strategy game about the mechanics of manipulation.
            Learn how disinformation spreads by playing as the attacker.
          </p>
          
          <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-white mb-3">Objective</h2>
            <p className="text-gray-300 mb-4">
              Reduce <span className="text-red-400 font-semibold">75% of actors' trust below 40%</span> within 32 rounds.
            </p>
            
            <h2 className="text-lg font-semibold text-white mb-3">How to Play</h2>
            <ul className="text-gray-300 space-y-2">
              <li>• Click on actors in the network to select them</li>
              <li>• Use their abilities to manipulate trust</li>
              <li>• Watch effects propagate through connections</li>
              <li>• Manage your resources wisely</li>
              <li>• Beware of defensive actors that may spawn</li>
            </ul>
          </div>
          
          <Button
            onClick={startGame}
            variant="primary"
            size="xl"
            className="shadow-lg font-semibold"
          >
            Start Game
          </Button>
          
          <p className="mt-6 text-gray-500 text-sm">
            Seed: {gameState.seed}
          </p>
        </div>
      </div>
    );
  }

  // Victory Screen
  if (gameState.phase === 'victory') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-gray-900 flex items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <div className="text-6xl mb-6">🎭</div>
          <h1 className="text-5xl font-bold text-red-400 mb-4">
            Victory (?)
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            You've successfully undermined public trust in {gameState.round} rounds.
            But at what cost to society?
          </p>
          
          <div className="bg-gray-800/50 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Final Statistics</h2>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-gray-400">Rounds Played</p>
                <p className="text-2xl text-white">{gameState.round}</p>
              </div>
              <div>
                <p className="text-gray-400">Average Trust</p>
                <p className="text-2xl text-red-400">{formatPercent(networkMetrics.averageTrust)}</p>
              </div>
              <div>
                <p className="text-gray-400">Actors Compromised</p>
                <p className="text-2xl text-white">{networkMetrics.lowTrustCount}</p>
              </div>
              <div>
                <p className="text-gray-400">Polarization</p>
                <p className="text-2xl text-yellow-400">{formatPercent(networkMetrics.polarizationIndex)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={resetGame}
              variant="secondary"
              size="lg"
              className="font-semibold"
            >
              Play Again
            </Button>
            <Button
              onClick={toggleEncyclopedia}
              variant="primary"
              size="lg"
              className="font-semibold"
            >
              Learn About Techniques
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Defeat Screen
  if (gameState.phase === 'defeat') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-gray-900 flex items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <div className="text-6xl mb-6">✨</div>
          <h1 className="text-5xl font-bold text-green-400 mb-4">
            Society Prevailed
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {gameState.defeatReason === 'time_out'
              ? "Time ran out before you could complete your campaign."
              : "Defensive mechanisms restored public trust."}
          </p>
          
          <div className="bg-gray-800/50 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Final Statistics</h2>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-gray-400">Rounds Played</p>
                <p className="text-2xl text-white">{gameState.round}</p>
              </div>
              <div>
                <p className="text-gray-400">Average Trust</p>
                <p className="text-2xl text-green-400">{formatPercent(networkMetrics.averageTrust)}</p>
              </div>
            </div>
          </div>
          
          <Button
            onClick={resetGame}
            variant="secondary"
            size="lg"
            className="font-semibold"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN GAME VIEW
  // ============================================

  const selectedActor = uiState.selectedActor
    ? getActor(uiState.selectedActor.actorId) ?? null
    : null;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col relative overflow-hidden">
      {/* Floating HUD - Top Left */}
      <div className="fixed top-6 left-6 z-40 flex flex-col gap-3">
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
          <h1 className="text-lg font-bold text-white mb-2">
            Desinformation Network
          </h1>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Round:</span>
              <span className="font-semibold text-white">{gameState.round}/{gameState.maxRounds}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">Resources:</span>
              <span className="font-semibold text-blue-300">{gameState.resources}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating HUD - Top Right */}
      <div className="fixed top-6 right-6 z-40 flex flex-col gap-3">
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 shadow-xl min-w-[200px]">
          <VictoryProgressBar
            metrics={networkMetrics}
            round={gameState.round}
            maxRounds={gameState.maxRounds}
            victoryThreshold={0.75}
            trustThreshold={0.40}
          />
        </div>
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Avg Trust:</span>
              <span
                className="font-semibold"
                style={{ color: trustToHex(networkMetrics.averageTrust) }}
              >
                {formatPercent(networkMetrics.averageTrust)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Low Trust:</span>
              <span className="font-semibold text-red-400">
                {networkMetrics.lowTrustCount}/{gameState.network.actors.length}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={togglePause}
            variant="secondary"
            size="md"
            className="font-semibold"
            title="Pause (Space)"
          >
            {isPaused ? '▶' : '⏸'}
          </Button>
          <Button
            onClick={() => {
              undoAction();
              addNotification('info', 'Action undone');
            }}
            variant="secondary"
            size="md"
            className="font-semibold"
            title="Undo (Ctrl+Z)"
          >
            ↶
          </Button>
        </div>
        <Button
          onClick={advanceRound}
          variant="success"
          size="md"
          className="font-semibold"
          disabled={isPaused}
        >
          End Round →
        </Button>
      </div>

      {/* Fullscreen Network Visualization */}
      <div className="flex-1 w-full h-full">
        <NetworkVisualization
          actors={gameState.network.actors}
          connections={gameState.network.connections}
          selectedActorId={uiState.selectedActor?.actorId || null}
          hoveredActorId={uiState.hoveredActor}
          targetingMode={uiState.targetingMode}
          validTargets={uiState.validTargets}
          trustChanges={trustChanges}
          onActorClick={selectActor}
          onActorHover={hoverActor}
        />
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        actor={selectedActor}
        abilities={selectedActor ? getActorAbilities(selectedActor.id) : []}
        resources={gameState.resources}
        canUseAbility={canUseAbility}
        onSelectAbility={selectAbility}
        onCancel={cancelAbility}
        onClose={() => selectActor(null)}
        selectedAbilityId={uiState.selectedAbility?.abilityId || null}
        targetingMode={uiState.targetingMode}
        addNotification={addNotification}
      />

      {/* Round Summary Modal */}
      {showRoundSummary && currentRoundSummary && (
        <RoundSummary
          summary={currentRoundSummary}
          impactVisualizations={[]}
          onContinue={handleContinue}
        />
      )}

      {/* Tutorial Overlay */}
      {tutorialState.active && showTutorial && (
        <>
          <TutorialProgress
            currentStep={tutorialState.currentStep}
            totalSteps={tutorialState.steps.length}
            round={gameState.round}
          />
          <TutorialOverlay
            step={tutorialState.steps[tutorialState.currentStep]}
            onNext={handleTutorialNext}
            onSkip={handleTutorialSkip}
          />
        </>
      )}

      {/* Pause Overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-6xl mb-4">⏸</div>
            <h2 className="text-4xl font-bold text-white mb-4">Paused</h2>
            <p className="text-gray-400 mb-6">Press Space or click to continue</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={togglePause}
                variant="primary"
                size="lg"
                className="font-semibold"
              >
                Resume Game
              </Button>
              <Button
                onClick={resetGame}
                variant="secondary"
                size="lg"
                className="font-semibold"
              >
                Reset Game
              </Button>
            </div>
            <div className="mt-8 text-sm text-gray-500">
              <p>Keyboard Shortcuts:</p>
              <p className="mt-2">Space - Pause/Resume | Escape - Cancel | Ctrl+Z - Undo | Enter - End Round</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
