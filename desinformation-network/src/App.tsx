import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { cn } from '@/utils/cn';
import { formatPercent } from '@/utils';
import { trustToHex, getCategoryColor, getTrustLabel } from '@/utils/colors';
import { NetworkVisualization } from '@/components/NetworkVisualization';
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

  // Round summary state
  const [showRoundSummary, setShowRoundSummary] = useState(false);
  const [currentRoundSummary, setCurrentRoundSummary] = useState<RoundSummaryType | null>(null);
  const [previousRound, setPreviousRound] = useState(0);
  const [networkBefore, setNetworkBefore] = useState(networkMetrics);

  // Tutorial state
  const [tutorialState, setTutorialState] = useState<TutorialState>(createInitialTutorialState());
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
              onClick={toggleEncyclopedia}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
            >
              Learn About Techniques
            </button>
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
          
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-colors"
          >
            Try Again
          </button>
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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Floating HUD - Top Left */}
      <div className="fixed top-6 left-6 z-40 flex flex-col gap-3 animate-fade-in">
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 shadow-xl transition-all hover:shadow-2xl hover:shadow-blue-500/10">
          <h1 className="text-lg font-bold text-white mb-2">
            Desinformation Network
          </h1>
          <div className="flex flex-col gap-2 text-sm">
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
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 shadow-xl min-w-[200px] transition-all hover:shadow-2xl hover:shadow-purple-500/10">
          <VictoryProgressBar
            metrics={networkMetrics}
            round={gameState.round}
            maxRounds={gameState.maxRounds}
            victoryThreshold={0.75}
            trustThreshold={0.40}
          />
        </div>
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 shadow-xl transition-all hover:shadow-2xl hover:shadow-blue-500/10">
          <div className="flex flex-col gap-2 text-sm">
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

      {/* Fullscreen Network Visualization */}
      <div className="absolute inset-0 w-full h-full">
        <NetworkVisualization
          actors={gameState.network.actors}
          connections={gameState.network.connections}
          selectedActorId={uiState.selectedActor?.actorId || null}
          hoveredActorId={uiState.hoveredActor}
          targetingMode={uiState.targetingMode}
          validTargets={uiState.validTargets}
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
    </div>
  );
}

export default App;
