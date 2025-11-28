import { useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { cn } from '@/utils/cn';
import { formatPercent } from '@/utils';
import { trustToHex, getCategoryColor, getTrustLabel } from '@/utils/colors';
import { NetworkVisualization } from '@/components/NetworkVisualization';
import { RoundSummary } from '@/components/RoundSummary';
import { VictoryProgressBar } from '@/components/VictoryProgressBar';
import { TutorialOverlay, TutorialProgress } from '@/components/TutorialOverlay';
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
    ? getActor(uiState.selectedActor.actorId)
    : null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Game Info */}
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-gray-900">
              Desinformation Network
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="px-3 py-1 bg-gray-100 rounded-lg">
                <span className="text-gray-500">Round:</span>{' '}
                <span className="font-semibold">{gameState.round}/{gameState.maxRounds}</span>
              </div>
              <div className="px-3 py-1 bg-blue-50 rounded-lg">
                <span className="text-blue-600">Resources:</span>{' '}
                <span className="font-semibold text-blue-700">{gameState.resources}</span>
              </div>
            </div>
          </div>
          
          {/* Right: Metrics & Actions */}
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-500">Avg Trust:</span>{' '}
              <span 
                className="font-semibold"
                style={{ color: trustToHex(networkMetrics.averageTrust) }}
              >
                {formatPercent(networkMetrics.averageTrust)}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Low Trust:</span>{' '}
              <span className="font-semibold text-red-600">
                {networkMetrics.lowTrustCount}/{gameState.network.actors.length}
              </span>
            </div>
            
            <button
              onClick={advanceRound}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              End Round →
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Network Visualization */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow-soft h-full overflow-hidden">
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
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          {/* Victory Progress */}
          <div className="mb-6">
            <VictoryProgressBar
              metrics={networkMetrics}
              round={gameState.round}
              maxRounds={gameState.maxRounds}
              victoryThreshold={0.75}
              trustThreshold={0.40}
            />
          </div>

          {selectedActor ? (
            <>
              {/* Actor Details */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: getCategoryColor(selectedActor.category) + '20' }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: getCategoryColor(selectedActor.category) }}
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedActor.name}
                    </h2>
                    <p className="text-sm text-gray-500 capitalize">
                      {selectedActor.category}
                    </p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Trust</span>
                      <span 
                        className="font-medium"
                        style={{ color: trustToHex(selectedActor.trust) }}
                      >
                        {formatPercent(selectedActor.trust)} ({getTrustLabel(selectedActor.trust)})
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${selectedActor.trust * 100}%`,
                          backgroundColor: trustToHex(selectedActor.trust),
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Resilience</span>
                    <span className="font-medium text-gray-900">
                      {formatPercent(selectedActor.resilience)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Emotional State</span>
                    <span className="font-medium text-gray-900">
                      {formatPercent(selectedActor.emotionalState)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Abilities */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Abilities
                </h3>
                {getActorAbilities(selectedActor.id).length === 0 ? (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 text-center mb-2">
                      No abilities available
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      This actor is a defensive/neutral entity and cannot be used to spread disinformation.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getActorAbilities(selectedActor.id).map(ability => {
                    const cooldown = selectedActor.cooldowns[ability.id] || 0;
                    const canUse = canUseAbility(ability.id);
                    const isSelected = uiState.selectedAbility?.abilityId === ability.id;

                    // Build effect description
                    const effects: string[] = [];
                    if (ability.effects.trustDelta) {
                      const sign = ability.effects.trustDelta < 0 ? '' : '+';
                      effects.push(`${sign}${Math.round(ability.effects.trustDelta * 100)}% trust`);
                    }
                    if (ability.effects.emotionalDelta) {
                      effects.push(`+${Math.round(ability.effects.emotionalDelta * 100)}% emotional`);
                    }
                    if (ability.effects.resilienceDelta) {
                      effects.push(`${ability.effects.resilienceDelta < 0 ? '' : '+'}${Math.round(ability.effects.resilienceDelta * 100)}% resilience`);
                    }
                    if (ability.effects.propagates) {
                      effects.push('propagates to connected actors');
                    }

                    return (
                      <div key={ability.id} className="group relative">
                        <button
                          onClick={() => canUse && selectAbility(ability.id)}
                          disabled={!canUse}
                          className={cn(
                            "w-full p-3 rounded-lg border text-left transition-all",
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : canUse
                                ? "border-gray-200 bg-white hover:border-gray-300"
                                : "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
                          )}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-gray-900 text-sm">
                              {ability.name}
                            </span>
                            <span className="text-xs text-blue-600 font-medium">
                              {ability.resourceCost} pts
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            {ability.description}
                          </p>
                          {effects.length > 0 && (
                            <p className="text-xs text-gray-400 mb-1">
                              Effects: {effects.join(', ')}
                            </p>
                          )}
                          {cooldown > 0 && (
                            <p className="text-xs text-orange-600">
                              Cooldown: {cooldown} rounds
                            </p>
                          )}
                        </button>

                        {/* Hover tooltip for additional info */}
                        {canUse && (
                          <div className="invisible group-hover:visible absolute left-full ml-2 top-0 z-50 w-64 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl pointer-events-none">
                            <div className="font-bold mb-1">{ability.name}</div>
                            <div className="text-gray-300 mb-2">{ability.description}</div>
                            <div className="space-y-1 text-[11px]">
                              <div className="text-blue-300">Target: {ability.targetType}</div>
                              {ability.targetCategory && (
                                <div className="text-blue-300">Category: {ability.targetCategory}</div>
                              )}
                              <div className="text-yellow-300">Cost: {ability.resourceCost} resources</div>
                              <div className="text-purple-300">Cooldown: {ability.cooldown} rounds</div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  </div>
                )}
              </div>

              {/* Targeting Mode Panel */}
              {uiState.targetingMode && uiState.selectedAbility && (
                <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg animate-pulse">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🎯</span>
                    <h4 className="font-bold text-red-900">Select a Target!</h4>
                  </div>
                  <p className="text-sm text-red-800 mb-3">
                    Click on any highlighted actor in the network to apply{' '}
                    <span className="font-semibold">
                      {getActorAbilities(uiState.selectedAbility.sourceActorId)
                        .find(a => a.id === uiState.selectedAbility?.abilityId)?.name}
                    </span>
                  </p>
                  <div className="text-xs text-red-700 mb-3">
                    Valid targets are marked with a red pulsing ring
                  </div>
                  <button
                    onClick={cancelAbility}
                    className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-900 font-medium rounded-lg transition-colors border border-red-300"
                  >
                    Cancel Targeting
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <p className="mb-2">No actor selected</p>
              <p className="text-sm">Click on an actor to see details</p>
            </div>
          )}
        </div>
      </div>

      {/* Targeting Mode Indicator - Large Central Banner */}
      {uiState.targetingMode && uiState.selectedAbility && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-8 py-4 bg-red-600 text-white rounded-xl shadow-2xl animate-pulse z-50 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <div className="font-bold text-lg mb-1">
                SELECT A TARGET NOW
              </div>
              <div className="text-sm text-red-100">
                Click on any highlighted actor to apply{' '}
                <span className="font-semibold">
                  {uiState.selectedAbility && getActorAbilities(uiState.selectedAbility.sourceActorId)
                    .find(a => a.id === uiState.selectedAbility?.abilityId)?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
