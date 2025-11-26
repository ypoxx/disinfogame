import { useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { cn } from '@/utils/cn';
import { formatPercent, formatRound } from '@/utils';
import { trustToHex, getCategoryColor, getTrustLabel } from '@/utils/colors';

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
        {/* Canvas Area (Placeholder) */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-2xl shadow-soft h-full p-6">
            <div className="text-center text-gray-400 h-full flex flex-col items-center justify-center">
              <p className="text-lg mb-4">Network Canvas</p>
              <p className="text-sm mb-8">(GameCanvas component will render here)</p>
              
              {/* Temporary Actor List */}
              <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
                {gameState.network.actors.map(actor => (
                  <button
                    key={actor.id}
                    onClick={() => selectActor(actor.id)}
                    onMouseEnter={() => hoverActor(actor.id)}
                    onMouseLeave={() => hoverActor(null)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-left",
                      uiState.selectedActor?.actorId === actor.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300",
                      uiState.targetingMode && uiState.validTargets.includes(actor.id)
                        && "ring-2 ring-red-400 ring-offset-2"
                    )}
                  >
                    <div 
                      className="w-3 h-3 rounded-full mb-2"
                      style={{ backgroundColor: getCategoryColor(actor.category) }}
                    />
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {actor.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {actor.category}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div 
                        className="h-2 rounded-full flex-1"
                        style={{ 
                          backgroundColor: '#e5e7eb',
                        }}
                      >
                        <div 
                          className="h-2 rounded-full transition-all"
                          style={{ 
                            width: `${actor.trust * 100}%`,
                            backgroundColor: trustToHex(actor.trust),
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium" style={{ color: trustToHex(actor.trust) }}>
                        {formatPercent(actor.trust)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
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
                <div className="space-y-2">
                  {getActorAbilities(selectedActor.id).map(ability => {
                    const cooldown = selectedActor.cooldowns[ability.id] || 0;
                    const canUse = canUseAbility(ability.id);
                    const isSelected = uiState.selectedAbility?.abilityId === ability.id;
                    
                    return (
                      <button
                        key={ability.id}
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
                        {cooldown > 0 && (
                          <p className="text-xs text-orange-600">
                            Cooldown: {cooldown} rounds
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cancel Button */}
              {uiState.targetingMode && (
                <button
                  onClick={cancelAbility}
                  className="w-full mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
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

      {/* Targeting Mode Indicator */}
      {uiState.targetingMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-600 text-white rounded-full shadow-lg">
          Select a target for{' '}
          <span className="font-semibold">
            {getActorAbilities(uiState.selectedAbility?.sourceActorId || '')
              .find(a => a.id === uiState.selectedAbility?.abilityId)?.name}
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
