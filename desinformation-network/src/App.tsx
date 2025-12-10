import { useState, useEffect, useMemo } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { cn } from '@/utils/cn';
import { formatPercent } from '@/utils';
import { trustToHex } from '@/utils/colors';

// NEW: Layout Components
import { TopBar, LeftSidebar, RightSidebar, ResizableBottomPanel } from '@/components/layout';
import { LAYOUT } from '@/utils/layout-constants';

// Network & UI Components
import { NetworkVisualization } from '@/components/NetworkVisualization';
import { RoundSummary } from '@/components/RoundSummary';
import { TutorialOverlay, TutorialProgress } from '@/components/TutorialOverlay';
import { GameStatistics } from '@/components/GameStatistics';
import { EventNotification } from '@/components/EventNotification';
import { EventChoiceModal } from '@/components/EventChoiceModal';

// Filters
import {
  type ActorFilters,
  createDefaultFilters,
  applyFilters
} from '@/components/FilterControls';

// Types
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

  // Filter state
  const [actorFilters, setActorFilters] = useState<ActorFilters>(createDefaultFilters());

  // Sidebar state
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

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
  // MAIN GAME VIEW (NEW LAYOUT)
  // ============================================

  const selectedActor = uiState.selectedActor
    ? getActor(uiState.selectedActor.actorId) ?? null
    : null;

  // Calculate network visualization bounds (accounting for sidebars)
  const leftSidebarWidth = leftSidebarCollapsed ? LAYOUT.sidebar.widthCollapsed : LAYOUT.sidebar.widthExpanded;
  const rightSidebarWidth = rightSidebarCollapsed ? LAYOUT.sidebar.widthCollapsed : LAYOUT.sidebar.widthExpanded;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <TopBar
        round={gameState.round}
        maxRounds={gameState.maxRounds}
        resources={gameState.resources}
        detectionRisk={gameState.detectionRisk}
        networkMetrics={networkMetrics}
        victoryThreshold={0.75}
        trustThreshold={0.40}
        onAdvanceRound={advanceRound}
        onOpenSettings={undefined}
        onOpenEncyclopedia={toggleEncyclopedia}
      />

      {/* Left Sidebar */}
      <LeftSidebar
        topology={gameState.topology}
        actors={gameState.network.actors}
        activeCombos={gameState.activeCombos}
        comboDefinitions={comboDefinitions}
        currentRound={gameState.round}
        filters={actorFilters}
        onFiltersChange={setActorFilters}
        defaultCollapsed={leftSidebarCollapsed}
      />

      {/* Right Sidebar */}
      <RightSidebar
        reactions={gameState.actorReactions || []}
        actors={gameState.network.actors}
        currentRound={gameState.round}
        statistics={statistics}
        onOpenEncyclopedia={toggleEncyclopedia}
        defaultCollapsed={rightSidebarCollapsed}
      />

      {/* Network Visualization (Main Content) */}
      <div
        className="absolute bg-gray-900"
        style={{
          top: LAYOUT.topBar.height,
          left: leftSidebarWidth,
          right: rightSidebarWidth,
          bottom: 0,
        }}
      >
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

      {/* Bottom Panel (Actor Details) */}
      <ResizableBottomPanel
        actor={selectedActor}
        abilities={selectedActor ? getActorAbilities(selectedActor.id) : []}
        resources={gameState.resources}
        canUseAbility={canUseAbility}
        onSelectAbility={selectAbility}
        selectedAbilityId={uiState.selectedAbility?.abilityId || null}
        targetingMode={uiState.targetingMode}
        onCancel={handleCloseActorPanel}
        addNotification={addNotification}
        getValidTargets={getValidTargets}
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

      {/* Event Choice Modal */}
      {gameState.pendingEventChoice && (
        <EventChoiceModal
          event={gameState.pendingEventChoice.event}
          resources={gameState.resources}
          onChoose={makeEventChoice}
        />
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
