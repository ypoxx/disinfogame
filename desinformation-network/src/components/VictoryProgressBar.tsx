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

  const darkPaceColor = {
    'ahead': 'text-green-400',
    'on-track': 'text-blue-400',
    'behind': 'text-orange-400'
  }[paceStatus];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">Victory Progress</h3>
        <div className={`text-xs font-semibold ${darkPaceColor} flex items-center gap-1`}>
          <span>{paceIcon}</span>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Compromised</span>
          <span className="font-semibold text-white">
            {currentActors} / {targetActors}
          </span>
        </div>

        <div className="h-6 bg-gray-800 rounded-full overflow-hidden relative">
          {/* Progress fill */}
          <div
            className={`h-full transition-all duration-1000 ease-out ${
              progress >= 1
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />

          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-md">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Target: {formatPercent(victoryThreshold)} below {formatPercent(trustThreshold)}
        </p>
      </div>

      {/* Stats Grid - compact for dark theme HUD */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-700 text-center">
        <div>
          <p className="text-[10px] text-gray-500 uppercase">Round</p>
          <p className="text-sm font-bold text-white">{round}<span className="text-gray-500 font-normal">/{maxRounds}</span></p>
        </div>

        <div>
          <p className="text-[10px] text-gray-500 uppercase">Avg Trust</p>
          <p className="text-sm font-bold text-red-400">{formatPercent(metrics.averageTrust)}</p>
        </div>

        <div>
          <p className="text-[10px] text-gray-500 uppercase">Est. Win</p>
          <p className="text-sm font-bold text-blue-400">
            {roundsToVictory < maxRounds ? `R${round + roundsToVictory}` : '?'}
          </p>
        </div>
      </div>

      {/* Milestone indicators - dark theme */}
      {round % 8 === 0 && round > 0 && (
        <div className="mt-3 p-2 bg-blue-900/30 rounded-lg border border-blue-700/50">
          <p className="text-xs font-semibold text-blue-300 mb-1">
            Checkpoint {round}
          </p>
          <p className="text-[10px] text-blue-400">
            {paceStatus === 'ahead' && `Excellent progress!`}
            {paceStatus === 'on-track' && `On track to win.`}
            {paceStatus === 'behind' && `Focus on high-trust actors.`}
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
