import { useEffect, useState } from 'react';
import type { TutorialStep } from '@/game-logic/types/tutorial';
import { AnimatedArrow } from './tutorial/AnimatedArrow';
import { AnimatedHand } from './tutorial/AnimatedHand';

interface TutorialOverlayProps {
  step: TutorialStep | null;
  onNext: () => void;
  onSkip: () => void;
  highlightElement?: HTMLElement | null;
  overlayType?: 'modal' | 'arrow' | 'hand' | 'highlight';
  arrowPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export function TutorialOverlay({
  step,
  onNext,
  onSkip,
  highlightElement,
  overlayType = 'modal',
  arrowPosition = 'top'
}: TutorialOverlayProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (highlightElement) {
      const rect = highlightElement.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 20,
        left: rect.left + rect.width / 2
      });
    }
  }, [highlightElement]);

  if (!step) return null;

  return (
    <>
      {/* Backdrop overlay - only for modal and highlight types */}
      {(overlayType === 'modal' || overlayType === 'highlight') && (
        <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" />
      )}

      {/* PHASE 2: Animated Arrow */}
      {overlayType === 'arrow' && highlightElement && (
        <AnimatedArrow position={arrowPosition} targetElement={highlightElement} />
      )}

      {/* PHASE 2: Animated Hand */}
      {overlayType === 'hand' && highlightElement && (
        <AnimatedHand position={arrowPosition} targetElement={highlightElement} />
      )}

      {/* Highlight spotlight */}
      {(overlayType === 'highlight' || overlayType === 'modal') && highlightElement && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            top: highlightElement.getBoundingClientRect().top - 8,
            left: highlightElement.getBoundingClientRect().left - 8,
            width: highlightElement.getBoundingClientRect().width + 16,
            height: highlightElement.getBoundingClientRect().height + 16,
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.6)',
            borderRadius: '12px',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
      )}

      {/* Tutorial message card - PHASE 2: Only show for modal and highlight types */}
      {(overlayType === 'modal' || overlayType === 'highlight') && (
        <div
          className="fixed z-50 max-w-md animate-slide-up"
          style={{
            top: highlightElement ? position.top : '50%',
            left: highlightElement ? position.left : '50%',
            transform: highlightElement ? 'translateX(-50%)' : 'translate(-50%, -50%)'
          }}
        >
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-500 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🎓</span>
                {step.title}
              </h3>
              <button
                onClick={onSkip}
                className="text-blue-100 hover:text-white text-sm transition-colors"
              >
                Skip Tutorial
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="prose prose-sm max-w-none">
              {step.message.split('\n\n').map((paragraph, i) => {
                // Check if paragraph has bold markers
                if (paragraph.includes('**')) {
                  const parts = paragraph.split('**');
                  return (
                    <p key={i} className="mb-3 text-gray-700 leading-relaxed">
                      {parts.map((part, j) =>
                        j % 2 === 1 ? (
                          <strong key={j} className="font-semibold text-gray-900">
                            {part}
                          </strong>
                        ) : (
                          part
                        )
                      )}
                    </p>
                  );
                }
                return (
                  <p key={i} className="mb-3 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Action hint */}
            {step.action && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <span className="font-medium">
                    {getActionHint(step.action)}
                  </span>
                </p>
              </div>
            )}

            {/* Next button (always shown for manual progression) */}
            <button
              onClick={onNext}
              className="mt-4 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              Continue →
            </button>
          </div>
        </div>

        {/* Pointer arrow (when highlighting element) */}
        {highlightElement && (
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-500 rotate-45 border-t-2 border-l-2 border-blue-500"
          />
        )}
      </div>
      )}
    </>
  );
}

function getActionHint(action: string): string {
  switch (action) {
    case 'click_actor':
      return 'Click on any actor in the network';
    case 'hover_ability':
      return 'Hover over an ability to see details';
    case 'select_ability':
      return 'Click on an ability to use it';
    case 'select_target':
      return 'Click on an actor to target them';
    case 'end_round':
      return 'Click the "End Round" button';
    default:
      return 'Follow the instructions above';
  }
}

// Tooltip component for ability hovers during tutorial
interface TutorialTooltipProps {
  abilityName: string;
  effect: string;
  cost: number;
  example: string;
  tactics: string[];
}

export function TutorialTooltip({ abilityName, effect, cost, example, tactics }: TutorialTooltipProps) {
  return (
    <div className="absolute z-50 bg-white rounded-lg shadow-2xl border-2 border-blue-400 p-4 max-w-sm transform -translate-y-full -translate-x-1/2 left-1/2 bottom-full mb-2">
      <div className="mb-2">
        <h4 className="font-bold text-gray-900 text-lg">{abilityName}</h4>
        <p className="text-sm text-gray-600 mt-1">{effect}</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Cost:</span>
          <span className="font-semibold text-blue-600">{cost} resources</span>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Example:</p>
          <p className="text-sm text-gray-700 italic">"{example}"</p>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Tactics:</p>
          <ul className="space-y-1">
            {tactics.map((tactic, i) => (
              <li key={i} className="text-xs text-gray-700 flex items-start gap-1">
                <span className="text-blue-500">•</span>
                <span>{tactic}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pointer arrow */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-blue-400 rotate-45 -mt-2" />
    </div>
  );
}

// Progress indicator for tutorial
interface TutorialProgressProps {
  currentStep: number;
  totalSteps: number;
  round: number;
}

export function TutorialProgress({ currentStep, totalSteps, round }: TutorialProgressProps) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-blue-200 px-4 py-2">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎓</span>
        <div>
          <p className="text-xs text-gray-500">Tutorial</p>
          <p className="text-sm font-semibold text-gray-900">
            Step {currentStep + 1} / {totalSteps}
          </p>
          <p className="text-xs text-blue-600">Round {round}</p>
        </div>
        <div className="ml-2">
          <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
