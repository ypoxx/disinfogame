import { useState, useEffect, useMemo } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { cn } from '@/utils/cn';
import { formatPercent } from '@/utils';
import { NetworkVisualization } from '@/components/NetworkVisualization';
import { UnifiedRoundModal } from '@/components/UnifiedRoundModal';
import { TutorialOverlay, TutorialProgress } from '@/components/TutorialOverlay';
import { UnifiedRightPanel } from '@/components/UnifiedRightPanel';
import { GameStatistics } from '@/components/GameStatistics';
// EventNotification removed in Phase 1 - consolidated into NotificationToast
import {
  FilterControls,
  type ActorFilters,
  createDefaultFilters,
  applyFilters
} from '@/components/FilterControls';
import { ComboTracker } from '@/components/ComboTracker';
import { TopologyOverlay } from '@/components/TopologyOverlay';
import { NotificationToast, useToastNotifications, actorReactionToToast } from '@/components/NotificationToast';
import type { RoundSummary as RoundSummaryType } from '@/game-logic/types/narrative';
import { NarrativeGenerator } from '@/game-logic/NarrativeGenerator';
import { createInitialTutorialState } from '@/game-logic/types/tutorial';
import type { TutorialState } from '@/game-logic/types/tutorial';
import { StoryModeTest } from '@/story-mode/StoryModeTest';

// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
  const {
    gameState,
    uiState,
    networkMetrics,
    statistics,
    comboDefinitions,
    startGame,
    advanceRound,
    resetGame,
    selectActor,
    hoverActor,
    getActor,
    selectAbility,
    cancelAbility,
    canUseAbility,
    getActorAbilities,
    getValidTargets,
    toggleEncyclopedia,
    addNotification,
    dismissCurrentEvent,
    makeEventChoice,
  } = useGameState();

  // Round summary state
  const [showRoundSummary, setShowRoundSummary] = useState(false);
  const [currentRoundSummary, setCurrentRoundSummary] = useState<RoundSummaryType | null>(null);
  const [previousRound, setPreviousRound] = useState(0);
  const [networkBefore, setNetworkBefore] = useState(networkMetrics);

  // Tutorial state
  const [tutorialState, setTutorialState] = useState<TutorialState>(createInitialTutorialState());
  const [showTutorial, setShowTutorial] = useState(false);

  // Statistics state
  const [showStatistics, setShowStatistics] = useState(false);

  // Filter state (Phase 2: UX Layer)
  const [actorFilters, setActorFilters] = useState<ActorFilters>(createDefaultFilters());
  const [filterCollapsed, setFilterCollapsed] = useState(false);

  // Topology state (Phase 4.2: Network Topology Analysis)
  const [topologyCollapsed, setTopologyCollapsed] = useState(false);

  // Progressive UI Reveal (Phase 0.4: Show advanced features only when relevant)
  const [advancedFeaturesUnlocked, setAdvancedFeaturesUnlocked] = useState(false);

  // Toast notification system (Phase 0: Fix position conflicts)
  const { notifications, notificationHistory, addNotification: addToast, dismissNotification, clearHistory } = useToastNotifications();

  // Story Mode Test state
  const [showStoryModeTest, setShowStoryModeTest] = useState(false);

  // Apply filters to actors
  const filteredActors = useMemo(
    () => applyFilters(gameState.network.actors, actorFilters),
    [gameState.network.actors, actorFilters]
  );

  // Filter connections to only show connections between visible actors
  const filteredConnections = useMemo(() => {
    const visibleActorIds = new Set(filteredActors.map(a => a.id));
    return gameState.network.connections.filter(
      conn => visibleActorIds.has(conn.sourceId) && visibleActorIds.has(conn.targetId)
    );
  }, [filteredActors, gameState.network.connections]);

  // Handler to close actor panel completely
  const handleCloseActorPanel = () => {
    cancelAbility(); // Cancel any selected ability
    selectActor(null); // Deselect actor
  };

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

  // Tutorial handlers
  const handleTutorialNext = () => {
    setTutorialState(prev => {
      const nextStep = prev.currentStep + 1;
      if (nextStep >= prev.steps.length) {
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

  // Track shown reactions to prevent duplicates (Bug Fix)
  const [shownReactionCount, setShownReactionCount] = useState(0);

  // Convert actor reactions to toast notifications (Phase 0: Fix position conflicts)
  // BUG FIX: Only show NEW reactions, not all last 3 on every change
  useEffect(() => {
    if (gameState.actorReactions && gameState.actorReactions.length > shownReactionCount) {
      // Only get actually NEW reactions since last check
      const newReactions = gameState.actorReactions.slice(shownReactionCount);

      newReactions.forEach(reaction => {
        const actor = gameState.network.actors.find(a => a.id === reaction.actorId);
        if (actor) {
          const toast = actorReactionToToast(reaction, actor);
          addToast(toast);
        }
      });

      // Update counter to prevent showing same reactions again
      setShownReactionCount(gameState.actorReactions.length);
    }
  }, [gameState.actorReactions, shownReactionCount, addToast, gameState.network.actors]);

  // Reset reaction counter when game resets
  useEffect(() => {
    if (gameState.phase === 'start' || gameState.round === 1) {
      setShownReactionCount(0);
    }
  }, [gameState.phase, gameState.round]);

  // Progressive UI Reveal: Unlock advanced features at Round 5 (Phase 0.4)
  useEffect(() => {
    if (gameState.phase === 'playing' && gameState.round >= 5 && !advancedFeaturesUnlocked) {
      setAdvancedFeaturesUnlocked(true);

      // Show notification about new features
      addToast({
        type: 'success',
        title: 'New Features Unlocked! 🎉',
        message: 'Advanced tools are now available: Filters and Network Topology',
        duration: 8000,
      });
    }
  }, [gameState.round, gameState.phase, advancedFeaturesUnlocked, addToast]);

  // ============================================
  // SCREENS
  // ============================================

  // Story Mode Test (overrides everything)
  if (showStoryModeTest) {
    return <StoryModeTest onExit={() => setShowStoryModeTest(false)} />;
  }

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
          
          <div className="flex flex-col gap-4 items-center">
            <button
              onClick={startGame}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-xl transition-colors shadow-lg"
            >
              Start Game
            </button>

            <button
              onClick={() => setShowStoryModeTest(true)}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-xl font-semibold rounded-xl transition-colors shadow-lg"
            >
              📖 Story Mode Test
            </button>

            <p className="text-gray-400 text-sm max-w-md">
              Story Mode is a visual prototype showing how the same game could be played with a narrative, office-simulation interface inspired by Papers Please.
            </p>
          </div>

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
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={() => setShowStatistics(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
            >
              📊 View Statistics
            </button>
            <button
              onClick={toggleEncyclopedia}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Learn About Techniques
            </button>
          </div>
        </div>

        {/* Statistics Modal */}
        {showStatistics && (
          <GameStatistics
            statistics={statistics}
            onClose={() => setShowStatistics(false)}
          />
        )}
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
              : gameState.defeatReason === 'exposure'
              ? "You were exposed! Too much attention drew investigation and your campaign was shut down."
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
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => setShowStatistics(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors"
            >
              📊 View Statistics
            </button>
          </div>
        </div>

        {/* Statistics Modal */}
        {showStatistics && (
          <GameStatistics
            statistics={statistics}
            onClose={() => setShowStatistics(false)}
          />
        )}
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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Floating HUD - Top Left (Game Title only) - Phase 1: z-hud */}
      <div className="fixed top-6 left-6 z-[var(--z-hud)] animate-fade-in">
        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-xl px-4 py-3 shadow-xl">
          <h1 className="text-base font-bold text-white">
            Desinformation Network
          </h1>
        </div>
      </div>

      {/* Network Visualization (left side, minus 320px for unified panel) */}
      <div className="absolute inset-y-0 left-0 right-[320px] w-auto h-full">
        <NetworkVisualization
          actors={filteredActors}
          connections={filteredConnections}
          selectedActorId={uiState.selectedActor?.actorId || null}
          hoveredActorId={uiState.hoveredActor}
          targetingMode={uiState.targetingMode}
          validTargets={uiState.validTargets}
          onActorClick={selectActor}
          onActorHover={hoverActor}
        />
      </div>

      {/* Filter Controls (Phase 2: UX Layer) - Progressive Reveal: Only shown from Round 5+ */}
      {advancedFeaturesUnlocked && (
        <div className="absolute top-20 right-[340px] z-[var(--z-panel)] animate-fade-in">
          <FilterControls
            actors={gameState.network.actors}
            filters={actorFilters}
            onFiltersChange={setActorFilters}
            collapsed={filterCollapsed}
            onToggleCollapse={() => setFilterCollapsed(!filterCollapsed)}
          />
        </div>
      )}

      {/* Combo Tracker (Phase 4: Combo System) */}
      {gameState.activeCombos.length > 0 && (
        <div className="absolute top-20 left-4 z-[var(--z-panel)]">
          <ComboTracker
            activeCombos={gameState.activeCombos}
            comboDefinitions={comboDefinitions}
            actors={gameState.network.actors}
            currentRound={gameState.round}
          />
        </div>
      )}

      {/* Topology Overlay (Phase 4.2: Network Topology Analysis) - Progressive Reveal: Only shown from Round 5+ */}
      {gameState.topology && advancedFeaturesUnlocked && (
        <div className={cn(
          "absolute left-4 z-[var(--z-panel)] animate-fade-in",
          gameState.activeCombos.length > 0 ? "top-96" : "top-20"
        )}>
          <TopologyOverlay
            topology={gameState.topology}
            actors={gameState.network.actors}
            collapsed={topologyCollapsed}
            onToggleCollapse={() => setTopologyCollapsed(!topologyCollapsed)}
          />
        </div>
      )}

      {/* Toast Notifications (Phase 0: Replaces ActorReactionsOverlay to fix position conflicts) */}
      <NotificationToast
        notifications={notifications}
        onDismiss={dismissNotification}
        maxVisible={2}
        notificationHistory={notificationHistory}
        onClearHistory={clearHistory}
      />

      {/* Unified Right Panel (Phase 3.2: Integrates Victory, Resources, Actions, Actor Details) */}
      <UnifiedRightPanel
        // Game State
        round={gameState.round}
        maxRounds={gameState.maxRounds}
        resources={gameState.resources}
        networkMetrics={networkMetrics}
        victoryThreshold={0.75}
        trustThreshold={0.40}
        // Actor State
        selectedActor={selectedActor}
        abilities={selectedActor ? getActorAbilities(selectedActor.id) : []}
        selectedAbilityId={uiState.selectedAbility?.abilityId || null}
        targetingMode={uiState.targetingMode}
        // Callbacks
        onAdvanceRound={advanceRound}
        onSelectAbility={selectAbility}
        onCancelAbility={cancelAbility}
        onClosePanel={handleCloseActorPanel}
        canUseAbility={canUseAbility}
        addNotification={addNotification}
        getValidTargets={getValidTargets}
      />

      {/* Unified Round Modal (Phase 0.2: Combines Round Summary + Event Choice) */}
      {(showRoundSummary && currentRoundSummary) || gameState.pendingEventChoice ? (
        <UnifiedRoundModal
          summary={currentRoundSummary || {
            round: gameState.round - 1,
            playerActions: [],
            automaticEvents: [],
            networkBefore: {
              averageTrust: networkMetrics.averageTrust,
              lowTrustCount: networkMetrics.lowTrustCount,
              highTrustCount: networkMetrics.highTrustCount,
              polarization: networkMetrics.polarizationIndex,
            },
            networkAfter: {
              averageTrust: networkMetrics.averageTrust,
              lowTrustCount: networkMetrics.lowTrustCount,
              highTrustCount: networkMetrics.highTrustCount,
              polarization: networkMetrics.polarizationIndex,
            },
            totalTrustChange: 0,
            actorsAffected: 0,
            propagationDepth: 1,
            roundNarrative: 'An event has occurred...',
            keyMoments: [],
            consequences: [],
          }}
          impactVisualizations={[]}
          event={gameState.pendingEventChoice?.event || null}
          resources={gameState.resources}
          onContinue={handleContinue}
          onEventChoice={makeEventChoice}
        />
      ) : null}

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

      {/* EventNotification removed in Phase 1 - events now handled via UnifiedRoundModal */}
    </div>
  );
}

export default App;
