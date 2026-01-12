/**
 * Action Queue Widget - Shows queued actions for batch execution
 *
 * Allows players to plan multiple actions before executing them as a batch.
 * Displays total costs and provides queue management controls.
 */

import React from 'react';
import { StoryModeColors } from '../theme';
import type { QueuedAction } from '../hooks/useStoryGameState';

// ============================================
// TYPES
// ============================================

interface ActionQueueWidgetProps {
  queue: QueuedAction[];
  currentResources: {
    budget: number;
    capacity: number;
    actionPoints: number;
  };
  onRemove: (queueItemId: string) => void;
  onClear: () => void;
  onExecute: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function ActionQueueWidget({
  queue,
  currentResources,
  onRemove,
  onClear,
  onExecute,
  isCollapsed = false,
  onToggleCollapse,
}: ActionQueueWidgetProps) {
  // Calculate total costs
  const totalCosts = queue.reduce(
    (acc, action) => ({
      budget: acc.budget + (action.costs.budget || 0),
      capacity: acc.capacity + (action.costs.capacity || 0),
      actionPoints: acc.actionPoints + (action.costs.actionPoints || 0),
    }),
    { budget: 0, capacity: 0, actionPoints: 0 }
  );

  // Check if player can afford the queue
  const canAfford =
    totalCosts.budget <= currentResources.budget &&
    totalCosts.capacity <= currentResources.capacity &&
    totalCosts.actionPoints <= currentResources.actionPoints;

  const isEmpty = queue.length === 0;

  // Collapsed view
  if (isCollapsed) {
    return (
      <div
        className="fixed bottom-4 right-4 w-12 h-12 border-2 flex items-center justify-center cursor-pointer hover:brightness-110 transition-all"
        style={{
          backgroundColor: StoryModeColors.militaryOlive,
          borderColor: StoryModeColors.darkOlive,
          boxShadow: '4px 4px 0px rgba(0,0,0,0.7)',
          zIndex: 45,
        }}
        onClick={onToggleCollapse}
        title={`${queue.length} Aktion${queue.length !== 1 ? 'en' : ''} in Warteschlange`}
      >
        <div className="relative">
          <span className="text-2xl">📋</span>
          {queue.length > 0 && (
            <span
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border"
              style={{
                backgroundColor: StoryModeColors.sovietRed,
                borderColor: StoryModeColors.darkRed,
                color: '#fff',
              }}
            >
              {queue.length}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full view
  return (
    <div
      className="fixed bottom-4 right-4 w-96 max-h-[60vh] border-4 flex flex-col"
      style={{
        backgroundColor: StoryModeColors.surface,
        borderColor: StoryModeColors.darkOlive,
        boxShadow: '8px 8px 0px rgba(0,0,0,0.7)',
        zIndex: 45,
      }}
    >
      {/* Header */}
      <div
        className="border-b-2 p-3 flex items-center justify-between"
        style={{
          backgroundColor: StoryModeColors.militaryOlive,
          borderColor: StoryModeColors.darkOlive,
        }}
      >
        <div className="flex-1">
          <h3
            className="font-bold text-sm tracking-wider"
            style={{ color: StoryModeColors.warning }}
          >
            📋 AKTIONEN-WARTESCHLANGE
          </h3>
          <p
            className="text-xs mt-0.5"
            style={{ color: StoryModeColors.textSecondary }}
          >
            {queue.length} Aktion{queue.length !== 1 ? 'en' : ''} geplant
          </p>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:brightness-110 transition-all text-xl"
            style={{ color: StoryModeColors.warning }}
            title="Einklappen"
          >
            ▼
          </button>
        )}
      </div>

      {/* Queue List */}
      <div
        className="flex-1 overflow-y-auto p-2 space-y-2"
        style={{ backgroundColor: StoryModeColors.background }}
      >
        {isEmpty ? (
          <div
            className="text-center py-8"
            style={{ color: StoryModeColors.textSecondary }}
          >
            <div className="text-3xl mb-2">📋</div>
            <p className="text-sm">Keine Aktionen geplant</p>
            <p className="text-xs mt-1">
              Wähle Aktionen im Terminal
            </p>
          </div>
        ) : (
          queue.map((action, index) => (
            <div
              key={action.id}
              className="border-2 p-2"
              style={{
                backgroundColor: StoryModeColors.surfaceLight,
                borderColor:
                  action.legality === 'illegal'
                    ? StoryModeColors.danger
                    : action.legality === 'grey'
                    ? StoryModeColors.warning
                    : StoryModeColors.success,
                boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
              }}
            >
              {/* Action Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="font-bold text-xs px-1.5 py-0.5 border"
                    style={{
                      backgroundColor: StoryModeColors.background,
                      borderColor: StoryModeColors.borderLight,
                      color: StoryModeColors.textSecondary,
                    }}
                  >
                    #{index + 1}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: StoryModeColors.textPrimary }}
                  >
                    {action.label}
                  </span>
                </div>

                <button
                  onClick={() => onRemove(action.id)}
                  className="px-2 py-0.5 text-xs hover:brightness-110 transition-all"
                  style={{ color: StoryModeColors.danger }}
                  title="Entfernen"
                >
                  ✕
                </button>
              </div>

              {/* Costs */}
              <div className="flex flex-wrap gap-1">
                {action.costs.budget && action.costs.budget > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 border"
                    style={{
                      backgroundColor: StoryModeColors.background,
                      borderColor: StoryModeColors.warning,
                      color: StoryModeColors.warning,
                    }}
                  >
                    💰 ${action.costs.budget}K
                  </span>
                )}
                {action.costs.capacity && action.costs.capacity > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 border"
                    style={{
                      backgroundColor: StoryModeColors.background,
                      borderColor: StoryModeColors.agencyBlue,
                      color: StoryModeColors.agencyBlue,
                    }}
                  >
                    ⚡ {action.costs.capacity}
                  </span>
                )}
                {action.costs.actionPoints && action.costs.actionPoints > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 border"
                    style={{
                      backgroundColor: StoryModeColors.background,
                      borderColor: StoryModeColors.textPrimary,
                      color: StoryModeColors.textPrimary,
                    }}
                  >
                    🎯 {action.costs.actionPoints} AP
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer with totals and actions */}
      {!isEmpty && (
        <div
          className="border-t-2 p-3"
          style={{
            backgroundColor: StoryModeColors.concrete,
            borderColor: StoryModeColors.borderLight,
          }}
        >
          {/* Total Costs */}
          <div className="mb-3">
            <div
              className="text-xs font-bold mb-2"
              style={{ color: StoryModeColors.textSecondary }}
            >
              GESAMTKOSTEN:
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className="text-xs px-2 py-1 border"
                style={{
                  backgroundColor:
                    totalCosts.budget > currentResources.budget
                      ? 'rgba(255, 0, 0, 0.1)'
                      : StoryModeColors.background,
                  borderColor:
                    totalCosts.budget > currentResources.budget
                      ? StoryModeColors.danger
                      : StoryModeColors.warning,
                  color:
                    totalCosts.budget > currentResources.budget
                      ? StoryModeColors.danger
                      : StoryModeColors.warning,
                  fontWeight: 'bold',
                }}
              >
                💰 ${totalCosts.budget}K / ${currentResources.budget}K
              </span>
              <span
                className="text-xs px-2 py-1 border"
                style={{
                  backgroundColor:
                    totalCosts.capacity > currentResources.capacity
                      ? 'rgba(255, 0, 0, 0.1)'
                      : StoryModeColors.background,
                  borderColor:
                    totalCosts.capacity > currentResources.capacity
                      ? StoryModeColors.danger
                      : StoryModeColors.agencyBlue,
                  color:
                    totalCosts.capacity > currentResources.capacity
                      ? StoryModeColors.danger
                      : StoryModeColors.agencyBlue,
                  fontWeight: 'bold',
                }}
              >
                ⚡ {totalCosts.capacity} / {currentResources.capacity}
              </span>
              <span
                className="text-xs px-2 py-1 border"
                style={{
                  backgroundColor:
                    totalCosts.actionPoints > currentResources.actionPoints
                      ? 'rgba(255, 0, 0, 0.1)'
                      : StoryModeColors.background,
                  borderColor:
                    totalCosts.actionPoints > currentResources.actionPoints
                      ? StoryModeColors.danger
                      : StoryModeColors.textPrimary,
                  color:
                    totalCosts.actionPoints > currentResources.actionPoints
                      ? StoryModeColors.danger
                      : StoryModeColors.textPrimary,
                  fontWeight: 'bold',
                }}
              >
                🎯 {totalCosts.actionPoints} / {currentResources.actionPoints} AP
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onExecute}
              disabled={!canAfford}
              className={`
                flex-1 px-3 py-2 border-2 font-bold text-sm transition-all
                ${canAfford ? 'hover:brightness-110 active:translate-y-0.5' : 'opacity-50 cursor-not-allowed'}
              `}
              style={{
                backgroundColor: canAfford ? StoryModeColors.success : StoryModeColors.border,
                borderColor: canAfford ? '#15803d' : StoryModeColors.borderLight,
                color: '#fff',
                boxShadow: canAfford ? '2px 2px 0px rgba(0,0,0,0.5)' : 'none',
              }}
              title={canAfford ? 'Alle Aktionen ausführen' : 'Nicht genügend Ressourcen'}
            >
              ▶ AUSFÜHREN
            </button>
            <button
              onClick={onClear}
              className="px-3 py-2 border-2 font-bold text-sm transition-all hover:brightness-110 active:translate-y-0.5"
              style={{
                backgroundColor: StoryModeColors.sovietRed,
                borderColor: StoryModeColors.darkRed,
                color: '#fff',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.5)',
              }}
              title="Warteschlange leeren"
            >
              🗑 LEEREN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActionQueueWidget;
