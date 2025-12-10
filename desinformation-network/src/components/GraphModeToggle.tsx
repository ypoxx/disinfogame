/**
 * Graph Mode Toggle (Phase 1.3: Dual-Graph System)
 *
 * Toggle between Trust-based and Awareness-based network visualization.
 * Inspired by Democracy 4's dual-graph system.
 *
 * Features:
 * - Trust Mode: Shows trust levels (default)
 * - Awareness Mode: Shows actor awareness of disinformation
 * - Smooth transitions
 * - Clear visual indicator
 */

import { useState } from 'react';
import { cn } from '@/utils/cn';

export type GraphMode = 'trust' | 'awareness';

interface GraphModeToggleProps {
  mode: GraphMode;
  onModeChange: (mode: GraphMode) => void;
}

export function GraphModeToggle({ mode, onModeChange }: GraphModeToggleProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isExpanded) {
    return (
      <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-xl animate-fade-in">
        <button
          onClick={() => setIsExpanded(true)}
          className="p-3 hover:bg-gray-800/50 transition-colors flex items-center gap-2"
          aria-label="Expand graph mode toggle"
        >
          <span className="text-gray-400 text-sm">📊</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-xl px-4 py-3 shadow-xl transition-all animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span>📊</span>
          <span>Graph Mode</span>
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-white transition-colors text-xs"
          aria-label="Collapse toggle"
        >
          ▼
        </button>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onModeChange('trust')}
          className={cn(
            "flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all",
            mode === 'trust'
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white"
          )}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-base">💙</span>
            <span>Trust</span>
          </div>
        </button>

        <button
          onClick={() => onModeChange('awareness')}
          className={cn(
            "flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all",
            mode === 'awareness'
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
              : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white"
          )}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-base">👁️</span>
            <span>Awareness</span>
          </div>
        </button>
      </div>

      {/* Description */}
      <div className="mt-3 pt-3 border-t border-gray-700/50">
        {mode === 'trust' ? (
          <p className="text-[10px] text-gray-400 leading-relaxed">
            <span className="font-semibold text-blue-400">Trust Mode:</span> Colors show trust levels (green = high, red = low)
          </p>
        ) : (
          <p className="text-[10px] text-gray-400 leading-relaxed">
            <span className="font-semibold text-purple-400">Awareness Mode:</span> Colors show awareness of manipulation (purple = aware, orange = unaware)
          </p>
        )}
      </div>
    </div>
  );
}

export default GraphModeToggle;
