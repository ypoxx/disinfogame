/**
 * TopBar Component
 *
 * Persistent top bar showing game status, resources, and primary actions.
 * Responsive design with progressive disclosure.
 */

import { memo } from 'react';
import type { Resources } from '@/game-logic/types';
import type { NetworkMetrics } from '@/game-logic/types';
import { formatPercent } from '@/utils';
import { trustToHex } from '@/utils/colors';
import { cn } from '@/utils/cn';
import { Z_INDEX, LAYOUT } from '@/utils/layout-constants';

// ============================================
// TYPES
// ============================================

export interface TopBarProps {
  round: number;
  maxRounds: number;
  resources: Resources;
  detectionRisk: number;
  networkMetrics: NetworkMetrics;
  victoryThreshold: number;
  trustThreshold: number;
  onAdvanceRound: () => void;
  onOpenSettings?: () => void;
  onOpenEncyclopedia?: () => void;
}

// ============================================
// COMPONENT
// ============================================

function TopBarComponent({
  round,
  maxRounds,
  resources,
  detectionRisk,
  networkMetrics,
  victoryThreshold,
  trustThreshold,
  onAdvanceRound,
  onOpenSettings,
  onOpenEncyclopedia,
}: TopBarProps) {
  // Calculate victory progress
  const nonDefensiveActors = 58; // TODO: Get from actual game state
  const targetActorCount = Math.ceil(nonDefensiveActors * victoryThreshold);
  const progressPercent = (networkMetrics.lowTrustCount / targetActorCount) * 100;

  return (
    <div
      className="fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-xl"
      style={{
        height: LAYOUT.topBar.height,
        zIndex: Z_INDEX.topBar,
      }}
    >
      <div className="h-full px-6 flex items-center justify-between gap-6">
        {/* Left Section: Game Info */}
        <div className="flex items-center gap-6">
          {/* Game Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center text-xl">
              🎭
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none">
                Desinformation Network
              </h1>
              <p className="text-xs text-gray-400">
                Round {round} / {maxRounds}
              </p>
            </div>
          </div>

          {/* Resources */}
          <div className="hidden md:flex items-center gap-4">
            {/* Money */}
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
              <span className="text-yellow-400">💰</span>
              <span className="text-sm font-bold text-yellow-300">{resources.money}</span>
            </div>

            {/* Attention */}
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
              <span className="text-red-400">👁️</span>
              <span className={cn(
                "text-sm font-bold",
                resources.attention > 80 ? "text-red-400" : "text-red-300"
              )}>
                {Math.round(resources.attention)}
              </span>
            </div>

            {/* Infrastructure */}
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg px-3 py-2">
              <span className="text-purple-400">🔧</span>
              <span className="text-sm font-bold text-purple-300">{resources.infrastructure}</span>
            </div>
          </div>
        </div>

        {/* Center Section: Victory Progress */}
        <div className="flex-1 max-w-md hidden lg:block">
          <div className="bg-gray-800/50 rounded-lg px-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Victory Progress</span>
              <span className="text-xs font-bold text-white">
                {networkMetrics.lowTrustCount} / {targetActorCount}
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500 rounded-full",
                  progressPercent >= 100
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : progressPercent >= 75
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                    : "bg-gradient-to-r from-red-500 to-red-600"
                )}
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] text-gray-500">
                Actors below {formatPercent(trustThreshold)} trust
              </span>
              <span className={cn(
                "text-[10px] font-bold",
                progressPercent >= 100 ? "text-green-400" : "text-gray-400"
              )}>
                {Math.round(progressPercent)}%
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          {/* Network Stats (Compact) */}
          <div className="hidden xl:flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
            <div className="text-center">
              <div className="text-[10px] text-gray-400">Avg Trust</div>
              <div
                className="text-sm font-bold"
                style={{ color: trustToHex(networkMetrics.averageTrust) }}
              >
                {formatPercent(networkMetrics.averageTrust)}
              </div>
            </div>
            <div className="w-px h-8 bg-gray-700" />
            <div className="text-center">
              <div className="text-[10px] text-gray-400">Detection</div>
              <div className={cn(
                "text-sm font-bold",
                detectionRisk > 0.7 ? "text-red-400" : "text-gray-300"
              )}>
                {formatPercent(detectionRisk)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Encyclopedia (Optional) */}
            {onOpenEncyclopedia && (
              <button
                onClick={onOpenEncyclopedia}
                className="hidden lg:flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
                title="Open Encyclopedia"
              >
                📚
              </button>
            )}

            {/* Settings (Optional) */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="hidden sm:flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                title="Settings"
              >
                ⚙️
              </button>
            )}

            {/* End Round - Primary Action */}
            <button
              onClick={onAdvanceRound}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <span className="hidden sm:inline">End Round</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const TopBar = memo(TopBarComponent);
