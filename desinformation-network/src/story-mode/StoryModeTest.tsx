import { useState } from 'react';
import { OfficeScreen } from './OfficeScreen';

interface StoryModeTestProps {
  onExit: () => void;
}

export function StoryModeTest({ onExit }: StoryModeTestProps) {
  return (
    <div className="fixed inset-0 bg-[#2d2d2d] font-mono">
      {/* Papers Please style container */}
      <div className="h-full flex flex-col">
        <OfficeScreen onExit={onExit} />
      </div>
    </div>
  );
}
