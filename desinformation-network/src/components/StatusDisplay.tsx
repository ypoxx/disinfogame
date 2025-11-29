import type { GameState, NetworkMetrics } from '@/game-logic/types';
import { cn } from '@/utils/cn';
import { formatPercent, formatRound } from '@/utils';
import { trustToHex } from '@/utils/colors';

// ============================================
// TYPES
// ============================================

type StatusDisplayProps = {
  gameState: GameState;
  networkMetrics: NetworkMetrics;
  compact?: boolean;
};

// ============================================
// SUB-COMPONENTS
// ============================================

function ProgressToVictory({ 
  lowTrustCount, 
  totalActors,
  threshold = 0.75,
}: { 
  lowTrustCount: number; 
  totalActors: number;
  threshold?: number;
}) {
  const required = Math.ceil(totalActors * threshold);
  const progress = lowTrustCount / required;
  
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">Victory Progress</span>
        <span className="font-semibold text-gray-900">
          {lowTrustCount} / {required}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-2 rounded-full transition-all duration-500",
            progress >= 1 ? "bg-red-500" : "bg-blue-500"
          )}
          style={{ width: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {required - lowTrustCount > 0 
          ? `${required - lowTrustCount} more actors needed below 40% trust`
          : 'Victory threshold reached!'
        }
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  color,
  subtext,
  icon,
}: {
  label: string;
  value: string;
  color?: string;
  subtext?: string;
  icon?: string;
}) {
  return (
    <div className="bg-white rounded-lg p-3 border border-gray-200">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <p 
        className="text-xl font-bold"
        style={{ color: color || '#1F2937' }}
      >
        {value}
      </p>
      {subtext && (
        <p className="text-xs text-gray-400 mt-1">{subtext}</p>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function StatusDisplay({
  gameState,
  networkMetrics,
  compact = false,
}: StatusDisplayProps) {
  const roundsRemaining = gameState.maxRounds - gameState.round;
  const trustColor = trustToHex(networkMetrics.averageTrust);
  
  // Calculate threat level
  const threatLevel = networkMetrics.averageTrust < 0.4 
    ? 'Critical' 
    : networkMetrics.averageTrust < 0.6 
      ? 'Elevated' 
      : 'Normal';
  
  const threatColor = 
    threatLevel === 'Critical' ? '#EF4444' :
    threatLevel === 'Elevated' ? '#F59E0B' : 
    '#22C55E';

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="px-3 py-1 bg-gray-100 rounded-lg">
          <span className="text-gray-500">Round:</span>{' '}
          <span className="font-semibold">{gameState.round}/{gameState.maxRounds}</span>
        </div>
        <div className="px-3 py-1 bg-blue-50 rounded-lg">
          <span className="text-blue-600">💰</span>{' '}
          <span className="font-semibold text-blue-700">{gameState.resources.money}</span>
        </div>
        <div className="px-3 py-1 bg-red-50 rounded-lg">
          <span className="text-red-600">👁️</span>{' '}
          <span className="font-semibold text-red-700">{Math.round(gameState.resources.attention)}</span>
        </div>
        <div className="px-3 py-1 rounded-lg" style={{ backgroundColor: `${trustColor}20` }}>
          <span style={{ color: trustColor }}>Avg Trust:</span>{' '}
          <span className="font-semibold" style={{ color: trustColor }}>
            {formatPercent(networkMetrics.averageTrust)}
          </span>
        </div>
        <div className="px-3 py-1 bg-red-50 rounded-lg">
          <span className="text-red-600">Low Trust:</span>{' '}
          <span className="font-semibold text-red-700">
            {networkMetrics.lowTrustCount}/{gameState.network.actors.length}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Game Status</h2>
        <div 
          className="px-3 py-1 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: `${threatColor}20`,
            color: threatColor,
          }}
        >
          {threatLevel} Threat
        </div>
      </div>

      {/* Round & Resources */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Round"
          value={`${gameState.round} / ${gameState.maxRounds}`}
          subtext={`${roundsRemaining} rounds remaining`}
          icon="📅"
        />
        <MetricCard
          label="Resources"
          value={gameState.resources.toString()}
          color="#3B82F6"
          subtext="+20 per round"
          icon="💰"
        />
      </div>

      {/* Network Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Average Trust"
          value={formatPercent(networkMetrics.averageTrust)}
          color={trustColor}
          icon="📊"
        />
        <MetricCard
          label="Polarization"
          value={formatPercent(networkMetrics.polarizationIndex)}
          color={networkMetrics.polarizationIndex > 0.6 ? '#F59E0B' : '#6B7280'}
          icon="⚡"
        />
      </div>

      {/* Trust Distribution */}
      <div className="bg-gray-50 rounded-lg p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Trust Distribution</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-1">
            <div 
              className="h-6 rounded-l bg-red-500 transition-all"
              style={{ width: `${(networkMetrics.lowTrustCount / gameState.network.actors.length) * 100}%` }}
            />
            <div 
              className="h-6 bg-yellow-500 transition-all"
              style={{ 
                width: `${((gameState.network.actors.length - networkMetrics.lowTrustCount - networkMetrics.highTrustCount) / gameState.network.actors.length) * 100}%` 
              }}
            />
            <div 
              className="h-6 rounded-r bg-green-500 transition-all"
              style={{ width: `${(networkMetrics.highTrustCount / gameState.network.actors.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span className="text-red-600">Low: {networkMetrics.lowTrustCount}</span>
          <span className="text-yellow-600">
            Medium: {gameState.network.actors.length - networkMetrics.lowTrustCount - networkMetrics.highTrustCount}
          </span>
          <span className="text-green-600">High: {networkMetrics.highTrustCount}</span>
        </div>
      </div>

      {/* Victory Progress */}
      <ProgressToVictory
        lowTrustCount={networkMetrics.lowTrustCount}
        totalActors={gameState.network.actors.length}
      />

      {/* Defensive Actors Warning */}
      {gameState.defensiveActorsSpawned > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛡️</span>
            <div>
              <p className="text-sm font-medium text-green-800">
                {gameState.defensiveActorsSpawned} Defensive Actor{gameState.defensiveActorsSpawned > 1 ? 's' : ''} Active
              </p>
              <p className="text-xs text-green-600">
                They're working to restore trust in the network
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Time Warning */}
      {roundsRemaining <= 8 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">⏰</span>
            <div>
              <p className="text-sm font-medium text-orange-800">
                {roundsRemaining} Rounds Remaining
              </p>
              <p className="text-xs text-orange-600">
                Act quickly to achieve victory
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusDisplay;
