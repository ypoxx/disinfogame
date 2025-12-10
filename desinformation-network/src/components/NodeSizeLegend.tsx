/**
 * Node Size Legend (Phase 1.1: Visual Hierarchy)
 *
 * Explains the tier-based node sizing system to users.
 * Shows that larger nodes represent more influential actors.
 *
 * Features:
 * - Collapsible panel
 * - Visual size comparison
 * - Tier descriptions
 */

import { useState } from 'react';
import { cn } from '@/utils/cn';

export function NodeSizeLegend() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-xl animate-fade-in">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-3 hover:bg-gray-800/50 transition-colors flex items-center gap-2"
          aria-label="Expand node size legend"
        >
          <span className="text-gray-400 text-sm">📏</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-xl px-4 py-3 shadow-xl transition-all animate-fade-in min-w-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span>📏</span>
          <span>Node Size</span>
        </h3>
        <button
          onClick={() => setIsCollapsed(true)}
          className="text-gray-400 hover:text-white transition-colors text-xs"
          aria-label="Collapse legend"
        >
          ▼
        </button>
      </div>

      {/* Size examples */}
      <div className="space-y-2.5">
        {/* Tier 3 - Largest */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10">
            <div
              className="rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg"
              style={{ width: '32px', height: '32px' }}
            >
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{ margin: '4px' }}
              >
                <div className="w-full h-full rounded-full bg-green-500 opacity-70" />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white">Tier 3</p>
            <p className="text-[10px] text-gray-400">High influence</p>
          </div>
        </div>

        {/* Tier 2 - Medium */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10">
            <div
              className="rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-md"
              style={{ width: '24px', height: '24px' }}
            >
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{ margin: '3px' }}
              >
                <div className="w-full h-full rounded-full bg-yellow-500 opacity-70" />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white">Tier 2</p>
            <p className="text-[10px] text-gray-400">Medium influence</p>
          </div>
        </div>

        {/* Tier 1 - Smallest */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10">
            <div
              className="rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm"
              style={{ width: '17px', height: '17px' }}
            >
              <div
                className="absolute inset-0 rounded-full flex items-center justify-center"
                style={{ margin: '2px' }}
              >
                <div className="w-full h-full rounded-full bg-red-500 opacity-70" />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-white">Tier 1</p>
            <p className="text-[10px] text-gray-400">Low influence</p>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-3 pt-3 border-t border-gray-700/50">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Larger nodes = more influential actors in the network
        </p>
      </div>
    </div>
  );
}

export default NodeSizeLegend;
