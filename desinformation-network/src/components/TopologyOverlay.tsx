/**
 * Network Topology Overlay
 *
 * Displays key network information: central actors, bottlenecks, and
 * network fragility. Helps players identify strategic targets.
 */

import { useMemo, memo } from 'react';
import type { Actor, NetworkTopology } from '@/game-logic/types';
import { getTopCentralActors, getCriticalBottlenecks, calculateNetworkFragility } from '@/utils/network/topology-analysis';
import { cn } from '@/utils/cn';

// ============================================
// TYPES
// ============================================

export interface TopologyOverlayProps {
  topology: NetworkTopology | undefined;
  actors: Actor[];
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// ============================================
// COMPONENT
// ============================================

function TopologyOverlayComponent({
  topology,
  actors,
  collapsed = false,
  onToggleCollapse,
}: TopologyOverlayProps) {
  // Calculate key metrics
  const { centralActors, bottlenecks, fragility } = useMemo(() => {
    if (!topology) {
      return { centralActors: [], bottlenecks: [], fragility: 0 };
    }

    const central = getTopCentralActors(topology, 5);
    const critical = getCriticalBottlenecks(topology, 0.3);
    const networkFragility = calculateNetworkFragility(topology);

    return {
      centralActors: central,
      bottlenecks: critical,
      fragility: networkFragility,
    };
  }, [topology]);

  // Map actor IDs to actors
  const getActorName = (actorId: string) => {
    return actors.find(a => a.id === actorId)?.name || 'Unknown';
  };

  if (!topology) {
    return null;
  }

  if (collapsed) {
    return (
      <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg p-3">
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Topology
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg p-4 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Network Topology</h3>
            <p className="text-xs text-gray-500">Strategic analysis</p>
          </div>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-gray-600"
            title="Collapse"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Network Fragility Indicator */}
      <div className="mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-700">Network Fragility</span>
          <span className={cn(
            "text-xs font-bold",
            fragility > 0.7 ? "text-red-600" :
            fragility > 0.4 ? "text-yellow-600" :
            "text-green-600"
          )}>
            {(fragility * 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500 rounded-full",
              fragility > 0.7 ? "bg-red-500" :
              fragility > 0.4 ? "bg-yellow-500" :
              "bg-green-500"
            )}
            style={{ width: `${fragility * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {fragility > 0.7 ? "Very vulnerable to disruption" :
           fragility > 0.4 ? "Moderately resilient" :
           "Highly resilient network"}
        </p>
      </div>

      {/* Most Central Actors */}
      <div className="mb-4">
        <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
          <span className="text-indigo-600">⭐</span>
          Most Central Actors
        </h4>
        <div className="space-y-1.5">
          {centralActors.slice(0, 3).map((item, index) => {
            const actor = actors.find(a => a.id === item.actorId);
            if (!actor) return null;

            return (
              <div
                key={item.actorId}
                className="flex items-center gap-2 bg-indigo-50 rounded p-2"
              >
                <div className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                  index === 0 ? "bg-yellow-500 text-white" :
                  index === 1 ? "bg-gray-400 text-white" :
                  "bg-orange-600 text-white"
                )}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 truncate">
                    {actor.name}
                  </div>
                  <div className="text-[10px] text-gray-600">
                    Influence: {(item.score * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="flex-shrink-0 text-xs text-gray-500">
                  {Math.round(actor.trust * 100)}%
                </div>
              </div>
            );
          })}
        </div>
        {centralActors.length > 3 && (
          <div className="text-xs text-gray-500 mt-1 text-center">
            +{centralActors.length - 3} more
          </div>
        )}
      </div>

      {/* Critical Bottlenecks */}
      {bottlenecks.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
            <span className="text-red-600">🎯</span>
            Critical Bottlenecks
          </h4>
          <div className="space-y-1.5">
            {bottlenecks.slice(0, 3).map((bottleneck) => {
              const actor = actors.find(a => a.id === bottleneck.actorId);
              if (!actor) return null;

              return (
                <div
                  key={bottleneck.actorId}
                  className="flex items-center gap-2 bg-red-50 rounded p-2 border border-red-200"
                >
                  <div className="flex-shrink-0">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-900 truncate">
                      {actor.name}
                    </div>
                    <div className="text-[10px] text-gray-600">
                      {bottleneck.connectsComponents ? "Bridges components" : "Key connector"}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-xs font-bold text-red-600">
                    {(bottleneck.importance * 100).toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>
          {bottlenecks.length > 3 && (
            <div className="text-xs text-gray-500 mt-1 text-center">
              +{bottlenecks.length - 3} more
            </div>
          )}
        </div>
      )}

      {/* Strategy Hint */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-600 bg-blue-50 rounded p-2">
          <span className="font-semibold text-blue-700">💡 Strategy:</span>{" "}
          {fragility > 0.5
            ? "Target bottlenecks to fragment the network!"
            : "Central actors have the most influence on the network."}
        </div>
      </div>
    </div>
  );
}


// PHASE 5: Performance - Wrap with React.memo
export const TopologyOverlay = memo(TopologyOverlayComponent);
