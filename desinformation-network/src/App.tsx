import { useState, useEffect, useMemo } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { cn } from '@/utils/cn';
import { formatPercent } from '@/utils';
import { trustToHex, getCategoryColor, getTrustLabel } from '@/utils/colors';
import { NetworkVisualization } from '@/components/NetworkVisualization';
import { UnifiedRoundModal } from '@/components/UnifiedRoundModal';
import { VictoryProgressBar } from '@/components/VictoryProgressBar';
import { TutorialOverlay, TutorialProgress } from '@/components/TutorialOverlay';
import { CompactSidePanel } from '@/components/CompactSidePanel';
import { GameStatistics } from '@/components/GameStatistics';
import { EventNotification } from '@/components/EventNotification';
import {
  FilterControls,
  type ActorFilters,
  createDefaultFilters,
  applyFilters
} from '@/components/FilterControls';
import { ComboTracker } from '@/components/ComboTracker';
import { TopologyOverlay } from '@/components/TopologyOverlay';
import { TrustAwarenessDualGraph } from '@/components/TrustAwarenessDualGraph';
import { NodeSizeLegend } from '@/components/NodeSizeLegend';
import { NotificationToast, useToastNotifications, actorReactionToToast } from '@/components/NotificationToast';
import type { RoundSummary as RoundSummaryType } from '@/game-logic/types/narrative';
import { NarrativeGenerator } from '@/game-logic/NarrativeGenerator';
import { createInitialTutorialState } from '@/game-logic/types/tutorial';
import type { TutorialState } from '@/game-logic/types/tutorial';
import * as Audio from '@/utils/audio'; // PHASE 1.2: Sound effects

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

  // PHASE 1.4: Trust vs. Awareness Dual-Graph state
  const [dualGraphCollapsed, setDualGraphCollapsed] = useState(false);

  // Progressive UI Reveal (Phase 0.4: Show advanced features only when relevant)
  const [advancedFeaturesUnlocked, setAdvancedFeaturesUnlocked] = useState(false);

  // Toast notification system (Phase 0: Fix position conflicts)
  const { notifications, addNotification: addToast, dismissNotification } = useToastNotifications();

  // PHASE 1.2: Smart Information Layering - Auto-hide combo tracker
  const [comboTrackerVisible, setComboTrackerVisible] = useState(true);

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

  // PHASE 1.2: Initialize audio on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      Audio.initializeAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

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

      // PHASE 1.2: Play round complete sound
      Audio.playRoundComplete();
    }

    setPreviousRound(gameState.round);
    setNetworkBefore(networkMetrics);
  }, [gameState.round, gameState.phase]);

  const handleContinue = () => {
    setShowRoundSummary(false);
    // PHASE 1.2: Play UI click sound
    Audio.playUIClick();
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

  // Convert actor reactions to toast notifications (Phase 0: Fix position conflicts)
  useEffect(() => {
    if (gameState.actorReactions && gameState.actorReactions.length > 0) {
      // Get new reactions (not already shown)
      const newReactions = gameState.actorReactions.slice(-3); // Last 3 reactions

      newReactions.forEach(reaction => {
        const actor = gameState.network.actors.find(a => a.id === reaction.actorId);
        if (actor) {
          const toast = actorReactionToToast(reaction, actor);
          addToast(toast);

          // PHASE 1.2: Play actor reaction sound
          Audio.playActorReaction();
        }
      });
    }
  }, [gameState.actorReactions, addToast]); // Only trigger when reactions change

  // Progressive UI Reveal: Unlock advanced features at Round 5 (Phase 0.4)
  useEffect(() => {
    if (gameState.phase === 'playing' && gameState.round >= 5 && !advancedFeaturesUnlocked) {
      setAdvancedFeaturesUnlocked(true);

      // Show notification about new features
      addToast({
        type: 'success',
        title: 'New Features Unlocked! 🎉',
        message: 'Advanced tools are now available: Filters, Network Topology, and Trust vs. Awareness Graph',
        duration: 8000,
      });

      // PHASE 1.2: Play feature unlock sound
      Audio.playFeatureUnlock();
    }
  }, [gameState.round, gameState.phase, advancedFeaturesUnlocked, addToast]);

  // PHASE 1.2: Auto-hide Combo Tracker after 5 seconds of inactivity
  useEffect(() => {
    if (gameState.activeCombos.length > 0) {
      // Show combo tracker when combos are active
      setComboTrackerVisible(true);

      // Set timer to hide after 5 seconds
      const timer = setTimeout(() => {
        setComboTrackerVisible(false);
      }, 5000);

      // Cleanup timer if combos change before it expires
      return () => clearTimeout(timer);
    } else {
      // Hide when no combos
      setComboTrackerVisible(false);
    }
  }, [gameState.activeCombos]);

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
          
          <button
            onClick={startGame}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-semibold rounded-xl transition-colors shadow-lg"
          >
            Start Game
          </button>
          
          <p className="mt-6 text-gray-500 text-sm">
            Seed: {gameState.seed}
          </p>
        </div>
      </div>
    );
  }

  // Victory Screen
  if (gameState.phase === 'victory') {
    // PHASE 1.2: Play victory sound once
    useEffect(() => {
      Audio.playVictory();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    // PHASE 1.2: Play defeat sound once
    useEffect(() => {
      Audio.playDefeat();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      {/* Floating HUD - Top Left */}
      <div className="fixed top-6 left-6 z-40 flex flex-col gap-3 animate-fade-in">
        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-xl px-4 py-3 shadow-xl transition-all hover:bg-gray-900/80 hover:shadow-2xl hover:shadow-blue-500/10">
          <h1 className="text-base font-bold text-white mb-2">
            Desinformation Network
          </h1>
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Round:</span>
              <span className="font-semibold text-white">{gameState.round}/{gameState.maxRounds}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">💰</span>
              <span className="font-semibold text-yellow-300">{gameState.resources.money}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-400">👁️</span>
              <span className="font-semibold text-red-300">{Math.round(gameState.resources.attention)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">🔧</span>
              <span className="font-semibold text-purple-300">{gameState.resources.infrastructure}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating HUD - Top Right */}
      <div className="fixed top-6 right-6 z-40 flex flex-col gap-3 animate-fade-in">
        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-xl px-4 py-3 shadow-xl min-w-[200px] transition-all hover:bg-gray-900/80 hover:shadow-2xl hover:shadow-purple-500/10">
          <VictoryProgressBar
            metrics={networkMetrics}
            round={gameState.round}
            maxRounds={gameState.maxRounds}
            victoryThreshold={0.75}
            trustThreshold={0.40}
          />
        </div>
        <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-xl px-4 py-3 shadow-xl transition-all hover:bg-gray-900/80 hover:shadow-2xl hover:shadow-blue-500/10">
          <div className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Avg Trust:</span>
              <span
                className="font-semibold transition-colors"
                style={{ color: trustToHex(networkMetrics.averageTrust) }}
              >
                {formatPercent(networkMetrics.averageTrust)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Low Trust:</span>
              <span className="font-semibold text-red-400 transition-all">
                {networkMetrics.lowTrustCount}/{gameState.network.actors.length}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={advanceRound}
          className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-green-600/30 hover:scale-105 active:scale-95"
        >
          End Round →
        </button>
      </div>

      {/* Network Visualization (left side, minus 300px for side panel) */}
      <div className="absolute inset-y-0 left-0 right-[300px] w-auto h-full">
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
        <div className="absolute top-20 right-[320px] z-20 animate-fade-in">
          <FilterControls
            actors={gameState.network.actors}
            filters={actorFilters}
            onFiltersChange={setActorFilters}
            collapsed={filterCollapsed}
            onToggleCollapse={() => setFilterCollapsed(!filterCollapsed)}
          />
        </div>
      )}

      {/* Combo Tracker (Phase 4: Combo System + PHASE 1.2: Auto-hide) */}
      {gameState.activeCombos.length > 0 && (
        <>
          <div className={cn(
            "absolute top-20 left-4 z-20 transition-all duration-300",
            comboTrackerVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
          )}>
            <ComboTracker
              activeCombos={gameState.activeCombos}
              comboDefinitions={comboDefinitions}
              actors={gameState.network.actors}
              currentRound={gameState.round}
            />
          </div>
          {/* Toggle button to show/hide manually - PHASE 1.2 */}
          {!comboTrackerVisible && (
            <button
              onClick={() => setComboTrackerVisible(true)}
              className="absolute top-20 left-4 z-20 bg-purple-600/90 hover:bg-purple-600 text-white px-3 py-2 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
              title="Show Active Combos"
            >
              🎯 Combos ({gameState.activeCombos.length})
            </button>
          )}
        </>
      )}

      {/* Topology Overlay (Phase 4.2: Network Topology Analysis) - Progressive Reveal: Only shown from Round 5+ */}
      {gameState.topology && advancedFeaturesUnlocked && (
        <div className={cn(
          "absolute left-4 z-20 animate-fade-in",
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

      {/* PHASE 1.4: Trust vs. Awareness Dual-Graph - Progressive Reveal: Only shown from Round 5+ */}
      {advancedFeaturesUnlocked && (
        <div className="absolute bottom-4 right-4 z-20 animate-fade-in">
          <TrustAwarenessDualGraph
            actors={gameState.network.actors}
            selectedActorId={uiState.selectedActor?.actorId || null}
            onActorClick={selectActor}
            collapsed={dualGraphCollapsed}
            onToggleCollapse={() => setDualGraphCollapsed(!dualGraphCollapsed)}
          />
        </div>
      )}

      {/* Node Size Legend (Phase 1.1: Visual Hierarchy) */}
      <div className="absolute bottom-6 left-6 z-20 animate-fade-in">
        <NodeSizeLegend />
      </div>

      {/* Toast Notifications (Phase 0: Replaces ActorReactionsOverlay to fix position conflicts) */}
      <NotificationToast
        notifications={notifications}
        onDismiss={dismissNotification}
        maxVisible={3}
      />

      {/* Compact Side Panel (Phase 0.3: Replaces Bottom Sheet) */}
      <CompactSidePanel
        actor={selectedActor}
        abilities={selectedActor ? getActorAbilities(selectedActor.id) : []}
        resources={gameState.resources}
        canUseAbility={canUseAbility}
        onSelectAbility={selectAbility}
        onCancel={handleCloseActorPanel}
        selectedAbilityId={uiState.selectedAbility?.abilityId || null}
        targetingMode={uiState.targetingMode}
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

      {/* Event Notification */}
      {uiState.currentEvent && (
        <EventNotification
          event={uiState.currentEvent}
          onClose={dismissCurrentEvent}
        />
      )}
    </div>
  );
}

export default App;
