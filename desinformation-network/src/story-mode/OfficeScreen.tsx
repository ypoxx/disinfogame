import { useState } from 'react';
import { StoryModeColors } from './theme';
import type { StoryResources, StoryPhase, NewsEvent, Objective } from '../game-logic/StoryEngineAdapter';
import { NewsTV } from './components/NewsTV';

// ============================================
// TYPES
// ============================================

interface OfficeScreenProps {
  onExit: () => void;
  onOpenActions?: () => void;
  onOpenNews?: () => void;
  onOpenStats?: () => void;
  onOpenNpcs?: () => void;
  onOpenMission?: () => void;
  onOpenEvents?: () => void;
  onEndPhase?: () => void;
  resources?: StoryResources;
  phase?: StoryPhase;
  newsEvents?: NewsEvent[];
  objectives?: Objective[];
  unreadNewsCount?: number;
  worldEventCount?: number;
}

type HoverArea = 'computer' | 'phone' | 'smartphone' | 'tv' | 'door' | 'folder' | null;

// ============================================
// INTERACTIVE HOTSPOT COMPONENTS (overlay on background image)
// ============================================

function DeskComputer({ isHovered, hasNotification, onClick, onMouseEnter, onMouseLeave }: { isHovered: boolean; hasNotification: boolean; onClick: () => void; onMouseEnter: () => void; onMouseLeave: () => void }) {
  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        top: '35%',
        left: '32%',
        width: '22%',
        height: '32%',
        zIndex: 10,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Transparent hotspot over the monitor area in background image */}
      <div
        className="w-full h-full relative rounded"
        style={{
          border: isHovered ? `3px solid ${StoryModeColors.sovietRed}` : '3px solid transparent',
          boxShadow: isHovered ? `0 0 30px ${StoryModeColors.sovietRed}, inset 0 0 20px rgba(178, 34, 52, 0.15)` : 'none',
          backgroundColor: isHovered ? 'rgba(178, 34, 52, 0.06)' : 'transparent',
        }}
      >
        {/* Terminal text overlay on the monitor screen area */}
        <div
          className="absolute p-2"
          style={{
            top: '8%',
            left: '12%',
            right: '12%',
            bottom: '45%',
            backgroundColor: isHovered ? 'rgba(13, 17, 23, 0.85)' : 'rgba(13, 17, 23, 0.6)',
          }}
        >
          <div className="text-[10px] font-bold mb-0.5" style={{ color: StoryModeColors.sovietRed }}>
            SICHERES TERMINAL
          </div>
          <div className="text-[9px]" style={{ color: StoryModeColors.textMuted }}>
            {'>'} AKTIONEN VERFÜGBAR_
          </div>
          <div className="text-[9px] mt-1" style={{ color: StoryModeColors.success }}>
            [KLICKEN ZUM ÖFFNEN]
          </div>
        </div>
      </div>
      {/* Notification Badge */}
      {hasNotification && (
        <div
          className="absolute top-0 right-[5%] w-8 h-8 flex items-center justify-center border-2 font-bold animate-pulse z-10"
          style={{
            backgroundColor: StoryModeColors.sovietRed,
            borderColor: StoryModeColors.darkRed,
            color: '#fff',
            borderRadius: '50%',
          }}
        >
          !
        </div>
      )}
      {/* Label */}
      {isHovered && (
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 border-2 font-bold text-xs whitespace-nowrap z-10"
          style={{
            backgroundColor: StoryModeColors.sovietRed,
            borderColor: StoryModeColors.darkRed,
            color: '#fff',
          }}
        >
          AKTIONEN PLANEN
        </div>
      )}
    </div>
  );
}

function DeskPhone({ isHovered, onClick, onMouseEnter, onMouseLeave }: { isHovered: boolean; onClick: () => void; onMouseEnter: () => void; onMouseLeave: () => void }) {
  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        top: '48%',
        left: '10%',
        width: '13%',
        height: '18%',
        zIndex: 10,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Transparent hotspot — phone is visible in background image */}
      <div
        className="w-full h-full relative rounded"
        style={{
          border: isHovered ? `3px solid ${StoryModeColors.warning}` : '3px solid transparent',
          boxShadow: isHovered ? `0 0 25px ${StoryModeColors.warning}, inset 0 0 15px rgba(212, 160, 23, 0.2)` : 'none',
          backgroundColor: isHovered ? 'rgba(212, 160, 23, 0.08)' : 'transparent',
        }}
      />
      {/* Label */}
      {isHovered && (
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 border-2 font-bold text-xs whitespace-nowrap z-10"
          style={{
            backgroundColor: StoryModeColors.warning,
            borderColor: '#A37F1A',
            color: StoryModeColors.background,
          }}
        >
          NPC-KONTAKTE
        </div>
      )}
    </div>
  );
}

function Smartphone({ isHovered, unreadCount, onClick, onMouseEnter, onMouseLeave }: { isHovered: boolean; unreadCount: number; onClick: () => void; onMouseEnter: () => void; onMouseLeave: () => void }) {
  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        top: '52%',
        left: '57%',
        width: '10%',
        height: '18%',
        zIndex: 10,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Transparent hotspot — smartphone visible in background image */}
      <div
        className="w-full h-full relative rounded"
        style={{
          border: isHovered ? `3px solid ${StoryModeColors.danger}` : '3px solid transparent',
          boxShadow: isHovered ? `0 0 25px ${StoryModeColors.danger}, inset 0 0 15px rgba(255, 68, 68, 0.2)` : 'none',
          backgroundColor: isHovered ? 'rgba(255, 68, 68, 0.08)' : 'transparent',
        }}
      />
      {/* Notification Badge */}
      {unreadCount > 0 && (
        <div
          className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center border-2 font-bold text-xs animate-pulse z-10"
          style={{
            backgroundColor: StoryModeColors.danger,
            borderColor: '#CC0000',
            color: '#fff',
            borderRadius: '50%',
          }}
        >
          {unreadCount}
        </div>
      )}
      {/* Label */}
      {isHovered && (
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 border-2 font-bold text-xs whitespace-nowrap z-10"
          style={{
            backgroundColor: StoryModeColors.danger,
            borderColor: '#CC0000',
            color: '#fff',
          }}
        >
          NACHRICHTEN
        </div>
      )}
    </div>
  );
}

function OfficeDoor({ isHovered, eventCount, onClick, onMouseEnter, onMouseLeave }: { isHovered: boolean; eventCount: number; onClick: () => void; onMouseEnter: () => void; onMouseLeave: () => void }) {
  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        top: '5%',
        left: '76%',
        width: '16%',
        height: '65%',
        zIndex: 10,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Transparent hotspot — door visible in background image */}
      <div
        className="w-full h-full relative rounded"
        style={{
          border: isHovered ? `3px solid ${StoryModeColors.militaryOlive}` : '3px solid transparent',
          boxShadow: isHovered ? `0 0 30px ${StoryModeColors.militaryOlive}, inset 0 0 20px rgba(107, 142, 35, 0.15)` : 'none',
          backgroundColor: isHovered ? 'rgba(107, 142, 35, 0.08)' : 'transparent',
        }}
      />
      {/* Event Counter Badge */}
      {eventCount > 0 && (
        <div
          className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center border-2 font-bold text-xs z-10"
          style={{
            backgroundColor: StoryModeColors.militaryOlive,
            borderColor: StoryModeColors.darkOlive,
            color: StoryModeColors.warning,
            borderRadius: '50%',
          }}
        >
          {eventCount}
        </div>
      )}
      {/* Label */}
      {isHovered && (
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 border-2 font-bold text-xs whitespace-nowrap z-10"
          style={{
            backgroundColor: StoryModeColors.militaryOlive,
            borderColor: StoryModeColors.darkOlive,
            color: StoryModeColors.warning,
          }}
        >
          WELT-EREIGNISSE
        </div>
      )}
    </div>
  );
}

function MissionFolder({ isHovered, onClick, onMouseEnter, onMouseLeave }: { isHovered: boolean; onClick: () => void; onMouseEnter: () => void; onMouseLeave: () => void }) {
  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        top: '55%',
        left: '22%',
        width: '10%',
        height: '14%',
        zIndex: 10,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Transparent hotspot — folder visible in background image */}
      <div
        className="w-full h-full relative rounded"
        style={{
          border: isHovered ? `3px solid ${StoryModeColors.sovietRed}` : '3px solid transparent',
          boxShadow: isHovered ? `0 0 20px ${StoryModeColors.sovietRed}, inset 0 0 15px rgba(178, 34, 52, 0.2)` : 'none',
          backgroundColor: isHovered ? 'rgba(178, 34, 52, 0.08)' : 'transparent',
        }}
      />
      {/* Label */}
      {isHovered && (
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 border-2 font-bold text-xs whitespace-nowrap z-10"
          style={{
            backgroundColor: StoryModeColors.sovietRed,
            borderColor: StoryModeColors.darkRed,
            color: '#fff',
          }}
        >
          MISSION BRIEFING
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function OfficeScreen({
  onExit,
  onOpenActions,
  onOpenNews,
  onOpenStats,
  onOpenNpcs,
  onOpenMission,
  onOpenEvents,
  resources,
  phase,
  newsEvents = [],
  unreadNewsCount = 0,
  worldEventCount = 0,
}: OfficeScreenProps) {
  const [hoverArea, setHoverArea] = useState<HoverArea>(null);

  // Keyboard shortcuts removed - centralized in StoryModeGame.tsx

  return (
    <div
      className="h-full flex flex-col font-mono text-sm relative overflow-hidden"
      style={{
        backgroundColor: StoryModeColors.background,
        color: StoryModeColors.textPrimary,
      }}
    >
      {/* Status bar removed - info already shown in StoryHUD */}

      {/* Main Office Scene — KI background + CSS screen overlays */}
      <div
        className="flex-1 relative"
        style={{
          backgroundColor: StoryModeColors.background,
        }}
      >
        {/* KI-generated background image */}
        <img
          src="/office-brutalist-scene.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: 'center center',
            imageRendering: 'auto',
          }}
          draggable={false}
        />

        {/* Subtle vignette overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 90% 80% at 50% 45%, transparent 50%, rgba(0,0,0,0.4) 100%)',
          }}
        />

        {/* Interactive Elements */}
        <NewsTV
          isHovered={hoverArea === 'tv'}
          resources={resources}
          newsEvents={newsEvents || []}
          onClick={() => {
            setHoverArea(null);
            if (onOpenStats) onOpenStats();
          }}
          onMouseEnter={() => setHoverArea('tv')}
          onMouseLeave={() => setHoverArea(null)}
        />

        <DeskComputer
          isHovered={hoverArea === 'computer'}
          hasNotification={true}
          onClick={() => {
            setHoverArea(null);
            if (onOpenActions) onOpenActions();
          }}
          onMouseEnter={() => setHoverArea('computer')}
          onMouseLeave={() => setHoverArea(null)}
        />

        <DeskPhone
          isHovered={hoverArea === 'phone'}
          onClick={() => {
            setHoverArea(null);
            if (onOpenNpcs) onOpenNpcs();
          }}
          onMouseEnter={() => setHoverArea('phone')}
          onMouseLeave={() => setHoverArea(null)}
        />

        <Smartphone
          isHovered={hoverArea === 'smartphone'}
          unreadCount={unreadNewsCount}
          onClick={() => {
            setHoverArea(null);
            if (onOpenNews) onOpenNews();
          }}
          onMouseEnter={() => setHoverArea('smartphone')}
          onMouseLeave={() => setHoverArea(null)}
        />

        <OfficeDoor
          isHovered={hoverArea === 'door'}
          eventCount={worldEventCount}
          onClick={() => {
            setHoverArea(null);
            if (onOpenEvents) onOpenEvents();
          }}
          onMouseEnter={() => setHoverArea('door')}
          onMouseLeave={() => setHoverArea(null)}
        />

        <MissionFolder
          isHovered={hoverArea === 'folder'}
          onClick={() => {
            setHoverArea(null);
            if (onOpenMission) onOpenMission();
          }}
          onMouseEnter={() => setHoverArea('folder')}
          onMouseLeave={() => setHoverArea(null)}
        />

        {/* Bottom Shortcut Hints (minimal — PHASE BEENDEN only in HUD) */}
        <div
          className="absolute bottom-0 left-0 right-0 py-2 px-4 text-center"
          style={{
            backgroundColor: 'rgba(45, 45, 45, 0.7)',
          }}
        >
          <span className="text-xs" style={{ color: StoryModeColors.textMuted }}>
            Tastenkürzel: [A] Aktionen [N] News [S] Stats [P] NPCs [M] Mission [E] Events
          </span>
        </div>
      </div>
    </div>
  );
}

export default OfficeScreen;
