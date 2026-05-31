/**
 * Unified Round Modal (Phase 0.2)
 *
 * Combines RoundSummary + EventChoiceModal into ONE unified flow.
 * Eliminates "modal hell" by showing all end-of-round information in sequence.
 *
 * Flow:
 * 1. Round Summary (always)
 * 2. Event Notification (if event exists)
 * 3. Event Choices (if choices required)
 * → User clicks "Continue" ONCE
 *
 * Benefits:
 * - No modal stacking
 * - Clear information flow
 * - One button instead of multiple clicks
 * - Better UX (single context)
 */

import { useState, useEffect } from 'react';
import { formatPercent } from '@/utils';
import { trustToHex } from '@/utils/colors';
import { cn } from '@/utils/cn';
import { canAffordChoice } from '@/game-logic/event-chain-system';
import type {
  RoundSummary,
  ActionRecord,
  ImpactVisualization,
} from '@/game-logic/types/narrative';
import type { GameEvent, Resources } from '@/game-logic/types';

// ============================================
// TYPES
// ============================================

export interface UnifiedRoundModalProps {
  // Round summary data (always shown)
  summary: RoundSummary;
  impactVisualizations?: ImpactVisualization[];

  // Event data (optional)
  event?: GameEvent | null;
  resources?: Resources;

  // Callbacks
  onContinue: () => void;
  onEventChoice?: (choiceIndex: number) => void;
}

type ModalStep = 'summary' | 'event' | 'choices';

// ============================================
// CONSTANTS
// ============================================

const IMPACT_COLORS = {
  minimal: '#9CA3AF',
  minor: '#60A5FA',
  moderate: '#F59E0B',
  significant: '#EF4444',
  major: '#DC2626',
  devastating: '#7F1D1D',
};

const IMPACT_LABELS = {
  minimal: 'Minimal Impact',
  minor: 'Minor Impact',
  moderate: 'Moderate Impact',
  significant: 'Significant Impact',
  major: 'Major Impact',
  devastating: 'Devastating Impact',
};

// ============================================
// MAIN COMPONENT
// ============================================

export function UnifiedRoundModal({
  summary,
  impactVisualizations = [],
  event,
  resources,
  onContinue,
  onEventChoice,
}: UnifiedRoundModalProps) {
  // Determine flow steps
  const hasEvent = event !== null && event !== undefined;
  const hasChoices = hasEvent && event.playerChoice && event.playerChoice.length > 0;

  // Step state
  const [currentStep, setCurrentStep] = useState<ModalStep>('summary');

  // Auto-advance logic
  useEffect(() => {
    // Start with summary
    setCurrentStep('summary');
  }, [summary.round]);

  const handleNext = () => {
    if (currentStep === 'summary') {
      if (hasEvent) {
        setCurrentStep('event');
      } else {
        // No event → Continue directly
        onContinue();
      }
    } else if (currentStep === 'event') {
      if (hasChoices) {
        setCurrentStep('choices');
      } else {
        // No choices → Continue
        onContinue();
      }
    }
  };

  const handleChoice = (choiceIndex: number) => {
    if (onEventChoice) {
      onEventChoice(choiceIndex);
    }
    // After choice, continue
    onContinue();
  };

  // Calculate data
  const totalTrustChange =
    summary.networkBefore.averageTrust - summary.networkAfter.averageTrust;
  const allActions = [...summary.playerActions, ...summary.automaticEvents];

  return (
    // Phase 1: Using CSS variable for z-index
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* STEP 1: ROUND SUMMARY */}
        {currentStep === 'summary' && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-bold">Round {summary.round} Summary</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-300">Network Trust</p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: trustToHex(summary.networkAfter.averageTrust) }}
                  >
                    {formatPercent(summary.networkAfter.averageTrust)}
                    <span className="text-lg ml-2">
                      ({totalTrustChange > 0 ? '+' : ''}
                      {formatPercent(totalTrustChange)})
                    </span>
                  </p>
                </div>
              </div>

              {/* Round Narrative */}
              <p className="text-gray-200 text-lg leading-relaxed">
                {summary.roundNarrative}
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Key Moments */}
              {summary.keyMoments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    Key Moments
                  </h3>
                  <div className="space-y-2">
                    {summary.keyMoments.map((moment, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg"
                      >
                        <p className="text-gray-800 font-medium">{moment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions Detail */}
              {allActions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    What Happened
                  </h3>
                  <div className="space-y-4">
                    {allActions.slice(0, 5).map((action: ActionRecord) => (
                      <div
                        key={action.id}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className="px-4 py-3 border-l-4"
                          style={{
                            borderLeftColor: IMPACT_COLORS[action.impactLevel],
                            backgroundColor: `${IMPACT_COLORS[action.impactLevel]}10`,
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-gray-900 text-lg">
                              {action.headline}
                            </h4>
                            <span
                              className="text-xs font-medium px-2 py-1 rounded"
                              style={{
                                backgroundColor: `${IMPACT_COLORS[action.impactLevel]}20`,
                                color: IMPACT_COLORS[action.impactLevel],
                              }}
                            >
                              {IMPACT_LABELS[action.impactLevel]}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-2">{action.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consequences */}
              {summary.consequences.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    Consequences
                  </h3>
                  <div className="space-y-2">
                    {summary.consequences.map((consequence, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg"
                      >
                        <p className="text-gray-800">{consequence}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {hasEvent ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-pulse">⚠️</span>
                      An event has occurred...
                    </span>
                  ) : (
                    <span>Ready to continue</span>
                  )}
                </div>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  {hasEvent ? 'Next →' : 'Continue'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* STEP 2: EVENT NOTIFICATION */}
        {currentStep === 'event' && event && (
          <>
            <div className="relative p-8 border-b border-orange-500/20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse" />

              <div className="flex items-start gap-4">
                <div className="text-5xl">⚠️</div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{event.name}</h2>
                  <p className="text-gray-200 text-lg leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>

              {hasChoices && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-sm text-yellow-200">
                    <span className="font-bold">⏳ Critical Decision:</span> Your choice will
                    have lasting consequences.
                  </p>
                </div>
              )}
            </div>

            <div className="flex-1 p-8">
              {/* Event details could go here */}
              <div className="text-center text-gray-600">
                {hasChoices ? (
                  <p>This event requires your decision...</p>
                ) : (
                  <p>The campaign continues...</p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  {hasChoices ? 'Make Decision →' : 'Continue'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* STEP 3: EVENT CHOICES */}
        {currentStep === 'choices' && event && hasChoices && resources && (
          <>
            <div className="p-6 border-b border-orange-500/20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
              <h2 className="text-2xl font-bold">Choose Your Response</h2>
              <p className="text-gray-300 mt-1">
                Select the best strategy for your campaign
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {event.playerChoice!.map((choice, index) => {
                const affordable =
                  !choice.cost || canAffordChoice({ resources }, choice);

                return (
                  <button
                    key={index}
                    onClick={() => affordable && handleChoice(index)}
                    disabled={!affordable}
                    className={cn(
                      'w-full text-left p-5 rounded-xl border-2 transition-all duration-200',
                      affordable
                        ? 'bg-white border-gray-300 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer'
                        : 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed',
                      'group'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                            {String.fromCharCode(65 + index)}. {choice.text}
                          </span>
                        </div>
                        {choice.consequence && (
                          <p className="text-sm text-gray-600 italic">
                            → {choice.consequence}
                          </p>
                        )}
                      </div>
                      {!affordable && (
                        <div className="flex-shrink-0 px-3 py-1 bg-red-100 border border-red-300 rounded-full">
                          <span className="text-xs text-red-700 font-medium">
                            Cannot Afford
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Cost */}
                    {choice.cost && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500 font-medium">Cost:</div>
                        {choice.cost.money !== undefined && choice.cost.money > 0 && (
                          <div
                            className={cn(
                              'flex items-center gap-1 px-2 py-1 rounded-md text-xs',
                              resources.money >= choice.cost.money
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            )}
                          >
                            <span>💰</span>
                            <span className="font-medium">{choice.cost.money}</span>
                          </div>
                        )}
                        {choice.cost.attention !== undefined && choice.cost.attention > 0 && (
                          <div
                            className={cn(
                              'flex items-center gap-1 px-2 py-1 rounded-md text-xs',
                              resources.attention >= choice.cost.attention
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            )}
                          >
                            <span>👁️</span>
                            <span className="font-medium">{choice.cost.attention}</span>
                          </div>
                        )}
                        {choice.cost.infrastructure !== undefined &&
                          choice.cost.infrastructure > 0 && (
                            <div
                              className={cn(
                                'flex items-center gap-1 px-2 py-1 rounded-md text-xs',
                                resources.infrastructure >= choice.cost.infrastructure
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              )}
                            >
                              <span>🏗️</span>
                              <span className="font-medium">{choice.cost.infrastructure}</span>
                            </div>
                          )}
                      </div>
                    )}

                    {affordable && (
                      <div className="mt-2 text-xs text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to choose
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <span>💰</span>
                    <span className="font-medium">{resources.money}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>👁️</span>
                    <span className="font-medium">{Math.round(resources.attention)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🏗️</span>
                    <span className="font-medium">{resources.infrastructure}</span>
                  </div>
                </div>
                <div className="text-gray-500 text-xs">
                  Press 1-{event.playerChoice!.length} to choose
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UnifiedRoundModal;
