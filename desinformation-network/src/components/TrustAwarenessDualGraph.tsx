/**
 * Trust vs. Awareness Dual-Graph Component
 *
 * Democracy 4-inspired dual Y-axis visualization showing the relationship
 * between Trust (left axis) and Awareness (right axis) for all actors.
 *
 * Key insights:
 * - Trust and Awareness are inversely related
 * - As actors are manipulated, trust drops and awareness rises
 * - High awareness + low trust = actors are resistant to further manipulation
 */

import { useMemo, useState } from 'react';
import type { Actor } from '@/game-logic/types';
import { trustToHex } from '@/utils/colors';
import { cn } from '@/utils/cn';

interface TrustAwarenessDualGraphProps {
  actors: Actor[];
  selectedActorId?: string | null;
  onActorClick?: (actorId: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function TrustAwarenessDualGraph({
  actors,
  selectedActorId,
  onActorClick,
  collapsed = false,
  onToggleCollapse,
}: TrustAwarenessDualGraphProps) {
  const [hoveredActorId, setHoveredActorId] = useState<string | null>(null);

  // Sort actors by trust (descending) for better visualization
  const sortedActors = useMemo(() => {
    return [...actors].sort((a, b) => b.trust - a.trust);
  }, [actors]);

  // Calculate statistics
  const stats = useMemo(() => {
    const avgTrust = actors.reduce((sum, a) => sum + a.trust, 0) / actors.length;
    const avgAwareness = actors.reduce((sum, a) => sum + (a.awareness || 0), 0) / actors.length;
    const highAwareness = actors.filter(a => (a.awareness || 0) > 0.7).length;
    const lowTrust = actors.filter(a => a.trust < 0.4).length;

    return { avgTrust, avgAwareness, highAwareness, lowTrust };
  }, [actors]);

  if (collapsed) {
    return (
      <div className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur rounded-lg shadow-2xl p-3 border border-indigo-500/30">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-between text-white hover:text-indigo-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <span className="text-sm font-bold">Trust vs. Awareness</span>
          </div>
          <span className="text-lg">▼</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur rounded-lg shadow-2xl p-4 w-96 border border-indigo-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-indigo-500/30">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <div>
            <h3 className="text-sm font-bold text-white">Trust vs. Awareness</h3>
            <p className="text-xs text-indigo-300">Actor Manipulation Overview</p>
          </div>
        </div>
        <button
          onClick={onToggleCollapse}
          className="text-indigo-300 hover:text-white transition-colors p-1"
        >
          <span className="text-lg">▲</span>
        </button>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-black/30 rounded p-2">
          <div className="text-xs text-green-400 font-semibold">Avg Trust</div>
          <div className="text-lg font-bold text-white">
            {Math.round(stats.avgTrust * 100)}%
          </div>
        </div>
        <div className="bg-black/30 rounded p-2">
          <div className="text-xs text-orange-400 font-semibold">Avg Awareness</div>
          <div className="text-lg font-bold text-white">
            {Math.round(stats.avgAwareness * 100)}%
          </div>
        </div>
      </div>

      {/* Dual-Axis Graph */}
      <div className="bg-black/40 rounded-lg p-3 mb-2">
        {/* Y-Axis Labels */}
        <div className="flex justify-between mb-2 text-xs">
          <span className="text-green-400 font-semibold">Trust →</span>
          <span className="text-orange-400 font-semibold">← Awareness</span>
        </div>

        {/* Graph Area */}
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {sortedActors.map((actor) => {
            const isSelected = actor.id === selectedActorId;
            const isHovered = actor.id === hoveredActorId;
            const awareness = actor.awareness || 0;

            return (
              <div
                key={actor.id}
                className={cn(
                  'relative h-6 rounded cursor-pointer transition-all',
                  isSelected && 'ring-2 ring-blue-400',
                  isHovered && 'bg-white/10'
                )}
                onMouseEnter={() => setHoveredActorId(actor.id)}
                onMouseLeave={() => setHoveredActorId(null)}
                onClick={() => onActorClick?.(actor.id)}
              >
                {/* Trust Bar (from left) */}
                <div
                  className="absolute left-0 top-0 h-full rounded-l transition-all"
                  style={{
                    width: `${actor.trust * 50}%`,
                    backgroundColor: trustToHex(actor.trust),
                    opacity: 0.8,
                  }}
                />

                {/* Awareness Bar (from right) */}
                <div
                  className="absolute right-0 top-0 h-full rounded-r transition-all"
                  style={{
                    width: `${awareness * 50}%`,
                    backgroundColor: `rgba(251, 146, 60, ${awareness})`, // Orange
                    opacity: 0.8,
                  }}
                />

                {/* Actor Name (centered) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs font-semibold text-white drop-shadow-lg truncate px-2">
                    {actor.name}
                  </span>
                </div>

                {/* Hover Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 whitespace-nowrap">
                    <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg">
                      <div className="font-semibold">{actor.name}</div>
                      <div className="text-green-400">
                        Trust: {Math.round(actor.trust * 100)}%
                      </div>
                      <div className="text-orange-400">
                        Awareness: {Math.round(awareness * 100)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* X-Axis Scale */}
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>0%</span>
          <span className="text-gray-300">50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Insight Box */}
      <div className="bg-indigo-500/20 rounded-lg p-2 border border-indigo-400/30">
        <div className="flex items-start gap-2">
          <span className="text-lg">💡</span>
          <div className="text-xs text-indigo-200">
            <div className="font-semibold text-white mb-1">Key Insight:</div>
            {stats.highAwareness > 0 ? (
              <div>
                <span className="text-orange-400 font-semibold">{stats.highAwareness}</span> actors
                have high awareness and are resistant to manipulation.
              </div>
            ) : (
              <div>
                No actors are highly aware yet. Continue manipulating to increase awareness.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
