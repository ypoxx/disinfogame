import { useState } from 'react';
import { OfficeScreen } from './OfficeScreen';
import { StoryModeGame } from './StoryModeGame';

interface StoryModeTestProps {
  onExit: () => void;
}

/**
 * Story Mode Entry Point
 *
 * Toggle between:
 * - useFullGame = true: Complete story mode with HUD, dialogs, and game state
 * - useFullGame = false: Original office screen prototype for testing
 */
export function StoryModeTest({ onExit }: StoryModeTestProps) {
  const [useFullGame] = useState(true); // Toggle for development

  if (useFullGame) {
    return <StoryModeGame onExit={onExit} />;
  }

  // Original prototype for quick testing
  return (
    <div className="fixed inset-0 bg-[#2d2d2d] font-mono">
      <div className="h-full flex flex-col">
        <OfficeScreen onExit={onExit} />
      </div>
    </div>
  );
}
