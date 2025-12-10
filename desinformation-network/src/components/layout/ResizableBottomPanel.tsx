/**
 * ResizableBottomPanel Component
 *
 * Slide-up panel for actor details and abilities.
 * User can resize by dragging the handle. Auto-hides when no actor selected.
 */

import { useState, useRef, useEffect, useCallback, memo } from 'react';
import type { Actor, Ability, Resources } from '@/game-logic/types';
import { cn } from '@/utils/cn';
import { Z_INDEX, LAYOUT, ANIMATION } from '@/utils/layout-constants';
import { ActorPanel } from '@/components/ActorPanel';

// ============================================
// TYPES
// ============================================

export interface ResizableBottomPanelProps {
  actor: Actor | null;
  abilities: Ability[];
  resources: Resources;
  canUseAbility: (abilityId: string) => boolean;
  onSelectAbility: (abilityId: string) => void;
  selectedAbilityId: string | null;
  targetingMode: boolean;
  onCancel: () => void;
  addNotification: (type: 'info' | 'warning' | 'success' | 'error', message: string) => void;
  getValidTargets: (abilityId: string) => Actor[];
}

// ============================================
// COMPONENT
// ============================================

function ResizableBottomPanelComponent({
  actor,
  abilities,
  resources,
  canUseAbility,
  onSelectAbility,
  selectedAbilityId,
  targetingMode,
  onCancel,
  addNotification,
  getValidTargets,
}: ResizableBottomPanelProps) {
  const [height, setHeight] = useState(LAYOUT.bottomPanel.defaultHeight);
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

  // Auto-hide when no actor selected
  const isVisible = actor !== null;

  // Calculate max height based on viewport
  const maxHeight = typeof window !== 'undefined'
    ? window.innerHeight * LAYOUT.bottomPanel.maxHeight
    : 500;

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startY.current = clientY;
    startHeight.current = height;
  }, [height]);

  // Handle resize move
  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      const deltaY = startY.current - clientY;
      const newHeight = startHeight.current + deltaY;

      // Clamp height
      const clampedHeight = Math.max(
        LAYOUT.bottomPanel.minHeight,
        Math.min(newHeight, maxHeight)
      );

      setHeight(clampedHeight);
    };

    const handleEnd = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isResizing, maxHeight]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop when panel is open (optional, for mobile) */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity md:hidden"
        style={{
          zIndex: Z_INDEX.bottomPanel - 1,
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? 'auto' : 'none',
        }}
        onClick={onCancel}
      />

      {/* Bottom Panel */}
      <div
        ref={panelRef}
        className={cn(
          "fixed left-0 right-0 bottom-0 bg-white border-t border-gray-300 shadow-2xl transition-transform",
          isVisible ? "translate-y-0" : "translate-y-full"
        )}
        style={{
          height: height,
          zIndex: Z_INDEX.bottomPanel,
          transitionDuration: isResizing ? '0ms' : `${ANIMATION.bottomPanelSlide}ms`,
        }}
      >
        {/* Resize Handle */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 flex items-center justify-center cursor-ns-resize hover:bg-blue-100 transition-colors group",
            isResizing && "bg-blue-200"
          )}
          style={{ height: LAYOUT.bottomPanel.resizeHandleHeight }}
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
        >
          <div className={cn(
            "w-12 h-1 bg-gray-400 rounded-full transition-colors",
            isResizing ? "bg-blue-600" : "group-hover:bg-gray-600"
          )} />
        </div>

        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-2 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900 z-10"
          aria-label="Close panel"
        >
          ✕
        </button>

        {/* Targeting Mode Banner */}
        {targetingMode && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 flex items-center gap-3 shadow-lg" style={{ marginTop: LAYOUT.bottomPanel.resizeHandleHeight }}>
            <span className="text-xl animate-pulse">🎯</span>
            <div className="flex-1">
              <div className="font-bold text-sm">SELECT A TARGET</div>
              <div className="text-xs text-red-100">
                Click on a highlighted actor in the network to apply the ability
              </div>
            </div>
            <button
              onClick={onCancel}
              className="px-3 py-1 bg-red-800 hover:bg-red-900 rounded font-medium text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className="h-full overflow-y-auto px-6 pb-6"
          style={{
            paddingTop: targetingMode
              ? LAYOUT.bottomPanel.resizeHandleHeight + 56 // handle + banner
              : LAYOUT.bottomPanel.resizeHandleHeight + 16, // handle + padding
          }}
        >
          {actor && (
            <ActorPanel
              actor={actor}
              abilities={abilities}
              canUseAbility={canUseAbility}
              onSelectAbility={onSelectAbility}
              selectedAbilityId={selectedAbilityId}
              targetingMode={targetingMode}
              onCancelAbility={onCancel}
            />
          )}
        </div>
      </div>
    </>
  );
}

export const ResizableBottomPanel = memo(ResizableBottomPanelComponent);
