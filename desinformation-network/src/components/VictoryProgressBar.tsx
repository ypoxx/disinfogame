import { formatPercent } from '@/utils';
import type { NetworkMetrics } from '@/game-logic/types';

interface VictoryProgressBarProps {
  metrics: NetworkMetrics;
  round: number;
  maxRounds: number;
  victoryThreshold: number; // e.g., 0.75 = 75% of actors
  trustThreshold: number;    // e.g., 0.40 = below 40% trust
}

export function VictoryProgressBar({
  metrics,
  round,
  maxRounds,
  victoryThreshold,
  trustThreshold
}: VictoryProgressBarProps) {
  const totalActors = metrics.lowTrustCount + metrics.highTrustCount;
  const targetActors = Math.ceil(totalActors * victoryThreshold);
  const currentActors = metrics.lowTrustCount;
  const progress = currentActors / targetActors;

  // Calculate pace
  const expectedProgress = (round / maxRounds) * targetActors;
  const paceStatus = currentActors > expectedProgress ? 'ahead' : currentActors < expectedProgress * 0.7 ? 'behind' : 'on-track';

  // Estimate rounds to victory
  const roundsToVictory = currentActors > 0
    ? Math.ceil((targetActors - currentActors) * (round / currentActors))
    : maxRounds;

  const paceColor = {
    'ahead': 'text-green-600',
    'on-track': 'text-blue-600',
    'behind': 'text-orange-600'
  }[paceStatus];

  const paceIcon = {
    'ahead': '🟢',
    'on-track': '🔵',
    'behind': '🟡'
  }[paceStatus];

  const paceText = {
    'ahead': 'Ahead of schedule',
    'on-track': 'On track',
    'behind': 'Behind schedule'
  }[paceStatus];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Victory Progress</h3>
        <div className={`text-sm font-semibold ${paceColor} flex items-center gap-1`}>
          <span>{paceIcon}</span>
          <span>{paceText}</span>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Actors Compromised</span>
          <span className="font-semibold text-gray-900">
            {currentActors} / {targetActors}
          </span>
        </div>

        <div className="h-8 bg-gray-200 rounded-full overflow-hidden relative">
          {/* Progress fill */}
          <div
            className={`h-full transition-all duration-1000 ease-out ${
              progress >= 1
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />

          {/* Target line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white/50"
            style={{ left: '100%' }}
          />

          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white drop-shadow-md">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Target: Reduce {formatPercent(victoryThreshold)} of actors below {formatPercent(trustThreshold)} trust
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500 mb-1">Current Round</p>
          <p className="text-lg font-bold text-gray-900">{round}</p>
          <p className="text-xs text-gray-400">of {maxRounds}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Avg Network Trust</p>
          <p className="text-lg font-bold text-red-600">{formatPercent(metrics.averageTrust)}</p>
          <p className="text-xs text-gray-400">
            {metrics.averageTrust < 0.5 ? 'Compromised' : 'Stable'}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Est. Victory</p>
          <p className="text-lg font-bold text-blue-600">
            {roundsToVictory < maxRounds ? `~Round ${round + roundsToVictory}` : 'Uncertain'}
          </p>
          <p className="text-xs text-gray-400">At current pace</p>
        </div>
      </div>

      {/* Milestone indicators */}
      {round % 8 === 0 && round > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-1">
            🎯 Round {round} Checkpoint
          </p>
          <p className="text-xs text-blue-700">
            {paceStatus === 'ahead' && `Excellent! You're ahead of 73% of players.`}
            {paceStatus === 'on-track' && `Good progress! Keep up the strategy.`}
            {paceStatus === 'behind' && `Try focusing on high-trust actors for bigger impact.`}
          </p>
        </div>
      )}
    </div>
  );
}

// Mini version for header
export function VictoryProgressMini({
  metrics,
  victoryThreshold,
  trustThreshold
}: Omit<VictoryProgressBarProps, 'round' | 'maxRounds'>) {
  const totalActors = metrics.lowTrustCount + metrics.highTrustCount;
  const targetActors = Math.ceil(totalActors * victoryThreshold);
  const currentActors = metrics.lowTrustCount;
  const progress = currentActors / targetActors;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
      </div>
      <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
        {currentActors}/{targetActors}
      </span>
    </div>
  );
}
