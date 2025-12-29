import { useState, useEffect } from 'react';
import { StoryModeColors } from './theme';
import type { StoryResources, StoryPhase, NewsEvent, Objective } from '../game-logic/StoryEngineAdapter';

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
// CSS OFFICE FURNITURE COMPONENTS
// ============================================

function WallTV({ isHovered, onClick }: { isHovered: boolean; onClick: () => void }) {
  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        top: '5%',
        left: '8%',
        width: '35%',
        height: '28%',
      }}
      onClick={onClick}
    >
      {/* TV Frame */}
      <div
        className="w-full h-full border-8 relative"
        style={{
          backgroundColor: '#1a1a1a',
          borderColor: isHovered ? StoryModeColors.agencyBlue : '#333',
          boxShadow: isHovered
            ? `0 0 30px ${StoryModeColors.agencyBlue}, inset 0 0 20px rgba(74, 157, 255, 0.3)`
            : '8px 8px 0 rgba(0,0,0,0.5)',
        }}
      >
        {/* Screen Content - Stats Bars */}
        <div className="absolute inset-2 p-2 overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
          <div className="text-xs font-bold mb-2" style={{ color: StoryModeColors.agencyBlue }}>
            CAMPAIGN METRICS
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs w-16" style={{ color: StoryModeColors.textMuted }}>TRUST</span>
              <div className="flex-1 h-3 bg-black">
                <div className="h-full" style={{ width: '65%', backgroundColor: StoryModeColors.danger }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs w-16" style={{ color: StoryModeColors.textMuted }}>REACH</span>
              <div className="flex-1 h-3 bg-black">
                <div className="h-full" style={{ width: '45%', backgroundColor: StoryModeColors.agencyBlue }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs w-16" style={{ color: StoryModeColors.textMuted }}>RISK</span>
              <div className="flex-1 h-3 bg-black">
                <div className="h-full" style={{ width: '25%', backgroundColor: StoryModeColors.warning }} />
              </div>
            </div>
          </div>
          {/* Scan line effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }}
          />
        </div>
        {/* Power LED */}
        <div
          className="absolute bottom-2 right-2 w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: StoryModeColors.success }}
        />
      </div>
      {/* Label */}
      {isHovered && (
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 border-2 font-bold text-xs whitespace-nowrap z-10"
          style={{
            backgroundColor: StoryModeColors.agencyBlue,
            borderColor: StoryModeColors.darkBlue,
            color: StoryModeColors.warning,
          }}
        >
          KAMPAGNEN-STATISTIK
        </div>
      )}
    </div>
  );
}

function DeskComputer({ isHovered, hasNotification, onClick }: { isHovered: boolean; hasNotification: boolean; onClick: () => void }) {
  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        top: '35%',
        left: '30%',
        width: '28%',
        height: '38%',
      }}
      onClick={onClick}
    >
      {/* Monitor */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 border-6"
        style={{
          width: '85%',
          height: '60%',
          backgroundColor: '#1a1a1a',
          borderColor: isHovered ? StoryModeColors.sovietRed : '#444',
          boxShadow: isHovered
            ? `0 0 30px ${StoryModeColors.sovietRed}`
            : '6px 6px 0 rgba(0,0,0,0.5)',
        }}
      >
        {/* Screen */}
        <div
          className="absolute inset-2 p-3"
          style={{
            backgroundColor: '#0d1117',
            border: `2px solid ${isHovered ? StoryModeColors.sovietRed : '#333'}`,
          }}
        >
          <div className="text-xs font-bold mb-1" style={{ color: StoryModeColors.sovietRed }}>
            SECURE TERMINAL
          </div>
          <div className="text-xs" style={{ color: StoryModeColors.textMuted }}>
            {'>'} AKTIONEN VERFÜGBAR_
          </div>
          <div className="text-xs mt-2" style={{ color: StoryModeColors.success }}>
            [KLICKEN ZUM ÖFFNEN]
          </div>
        </div>
      </div>
      {/* Monitor Stand */}
      <div
        className="absolute bottom-[35%] left-1/2 transform -translate-x-1/2"
        style={{
          width: '15%',
          height: '8%',
          backgroundColor: '#333',
        }}
      />
      {/* Keyboard */}
      <div
        className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2"
        style={{
          width: '70%',
          height: '12%',
          backgroundColor: '#2a2a2a',
          borderRadius: '2px',
          border: '2px solid #444',
        }}
      />
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

function DeskPhone({ isHovered, onClick }: { isHovered: boolean; onClick: () => void }) {
  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        top: '55%',
        left: '8%',
        width: '16%',
        height: '20%',
      }}
      onClick={onClick}
    >
      {/* Phone Base */}
      <div
        className="w-full h-full border-4 relative"
        style={{
          backgroundColor: '#2d2d2d',
          borderColor: isHovered ? StoryModeColors.warning : '#444',
          boxShadow: isHovered
            ? `0 0 25px ${StoryModeColors.warning}`
            : '4px 4px 0 rgba(0,0,0,0.5)',
          borderRadius: '4px',
        }}
      >
        {/* Handset */}
        <div
          className="absolute top-2 left-1/2 transform -translate-x-1/2"
          style={{
            width: '80%',
            height: '25%',
            backgroundColor: '#1a1a1a',
            borderRadius: '20px',
          }}
        />
        {/* Dial Buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 grid grid-cols-3 gap-1">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <div
              key={n}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#555' }}
            />
          ))}
        </div>
      </div>
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

function Smartphone({ isHovered, unreadCount, onClick }: { isHovered: boolean; unreadCount: number; onClick: () => void }) {
  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        top: '58%',
        left: '62%',
        width: '10%',
        height: '22%',
      }}
      onClick={onClick}
    >
      {/* Phone Body */}
      <div
        className="w-full h-full border-4 relative"
        style={{
          backgroundColor: '#1a1a1a',
          borderColor: isHovered ? StoryModeColors.danger : '#333',
          boxShadow: isHovered
            ? `0 0 25px ${StoryModeColors.danger}`
            : '4px 4px 0 rgba(0,0,0,0.5)',
          borderRadius: '8px',
        }}
      >
        {/* Screen */}
        <div
          className="absolute inset-1 rounded"
          style={{ backgroundColor: '#0a0a0a' }}
        >
          <div className="p-1">
            <div className="text-[8px] font-bold" style={{ color: StoryModeColors.danger }}>
              NEWS
            </div>
            <div className="text-[6px] mt-1" style={{ color: StoryModeColors.textMuted }}>
              Breaking...
            </div>
          </div>
        </div>
        {/* Home Button */}
        <div
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border"
          style={{ borderColor: '#444' }}
        />
      </div>
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

function OfficeDoor({ isHovered, eventCount, onClick }: { isHovered: boolean; eventCount: number; onClick: () => void }) {
  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        top: '8%',
        left: '78%',
        width: '18%',
        height: '55%',
      }}
      onClick={onClick}
    >
      {/* Door Frame */}
      <div
        className="w-full h-full border-8 relative"
        style={{
          backgroundColor: '#3d3d3d',
          borderColor: isHovered ? StoryModeColors.militaryOlive : '#555',
          boxShadow: isHovered
            ? `0 0 30px ${StoryModeColors.militaryOlive}`
            : 'inset 4px 4px 10px rgba(0,0,0,0.5)',
        }}
      >
        {/* Door Panel */}
        <div
          className="absolute inset-2"
          style={{
            backgroundColor: '#4a4a4a',
            border: '4px solid #333',
          }}
        >
          {/* Door Handle */}
          <div
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-8 rounded"
            style={{ backgroundColor: isHovered ? StoryModeColors.warning : '#888' }}
          />
          {/* Window - shows world map silhouette */}
          <div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1/2 h-1/4 flex items-center justify-center"
            style={{
              backgroundColor: '#1a1a1a',
              border: '2px solid #555',
            }}
          >
            <span className="text-lg opacity-60">🌍</span>
          </div>
        </div>
        {/* Sign */}
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-2 py-1 text-[8px] font-bold"
          style={{
            backgroundColor: StoryModeColors.militaryOlive,
            color: StoryModeColors.warning,
          }}
        >
          WELT
        </div>
      </div>
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

function MissionFolder({ isHovered, onClick }: { isHovered: boolean; onClick: () => void }) {
  return (
    <div
      className="absolute cursor-pointer transition-all duration-200"
      style={{
        top: '65%',
        left: '25%',
        width: '12%',
        height: '15%',
      }}
      onClick={onClick}
    >
      {/* Folder */}
      <div
        className="w-full h-full relative"
        style={{
          backgroundColor: isHovered ? StoryModeColors.sovietRed : '#8B4513',
          boxShadow: isHovered
            ? `0 0 20px ${StoryModeColors.sovietRed}`
            : '3px 3px 0 rgba(0,0,0,0.5)',
          clipPath: 'polygon(0 10%, 30% 10%, 35% 0, 100% 0, 100% 100%, 0 100%)',
        }}
      >
        {/* Tab */}
        <div
          className="absolute top-0 left-[30%] w-[40%] h-[15%]"
          style={{
            backgroundColor: isHovered ? StoryModeColors.darkRed : '#654321',
          }}
        />
        {/* Label */}
        <div
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-[8px] font-bold text-center"
          style={{ color: '#fff' }}
        >
          GEHEIM
        </div>
        {/* Star */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 text-lg">
          ☭
        </div>
      </div>
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
  onEndPhase,
  resources,
  phase,
  unreadNewsCount = 0,
  worldEventCount = 0,
}: OfficeScreenProps) {
  const [hoverArea, setHoverArea] = useState<HoverArea>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'a' && onOpenActions) onOpenActions();
      if (e.key === 'n' && onOpenNews) onOpenNews();
      if (e.key === 's' && onOpenStats) onOpenStats();
      if (e.key === 'p' && onOpenNpcs) onOpenNpcs();
      if (e.key === 'm' && onOpenMission) onOpenMission();
      if (e.key === 'e' && onOpenEvents) onOpenEvents();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenActions, onOpenNews, onOpenStats, onOpenNpcs, onOpenMission, onOpenEvents]);

  return (
    <div
      className="h-full flex flex-col font-mono text-sm relative overflow-hidden"
      style={{
        backgroundColor: StoryModeColors.background,
        color: StoryModeColors.textPrimary,
      }}
    >
      {/* Header Bar - Status */}
      <div
        className="border-b-4 p-3 flex justify-between items-center z-20 relative"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border,
        }}
      >
        <div className="flex gap-6 text-xs font-bold">
          <div>
            <span style={{ color: StoryModeColors.textSecondary }}>PHASE:</span>{' '}
            <span style={{ color: StoryModeColors.sovietRed }}>
              {phase ? `Y${phase.year} M${phase.month}` : 'Y1 M1'}
            </span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.textSecondary }}>AP:</span>{' '}
            <span style={{ color: StoryModeColors.warning }}>
              {resources ? `${resources.actionPointsRemaining}/${resources.actionPointsMax}` : '5/5'}
            </span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.warning }}>💰 ${resources?.budget ?? 100}K</span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.agencyBlue }}>⚡ {resources?.capacity ?? 5}</span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.danger }}>⚠️ {resources?.risk ?? 0}%</span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.sovietRed }}>💀 {resources?.moralWeight ?? 0}</span>
          </div>
        </div>
        <button
          onClick={onExit}
          className="px-4 py-1 font-bold border-2 transition-all active:translate-y-0.5"
          style={{
            backgroundColor: StoryModeColors.concrete,
            borderColor: StoryModeColors.borderLight,
            color: StoryModeColors.textPrimary,
            boxShadow: '2px 2px 0px 0px rgba(0,0,0,0.8)',
          }}
        >
          MENU [ESC]
        </button>
      </div>

      {/* Main Office Scene */}
      <div
        className="flex-1 relative"
        style={{
          background: `linear-gradient(180deg,
            ${StoryModeColors.darkConcrete} 0%,
            ${StoryModeColors.concrete} 40%,
            #4a4a4a 60%,
            ${StoryModeColors.darkConcrete} 100%)`,
        }}
      >
        {/* Wall Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              rgba(0,0,0,0.1) 50px,
              rgba(0,0,0,0.1) 51px
            )`,
          }}
        />

        {/* Desk Surface */}
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '5%',
            right: '5%',
            height: '40%',
            background: `linear-gradient(180deg, #5a4a3a 0%, #4a3a2a 50%, #3a2a1a 100%)`,
            borderTop: `6px solid ${StoryModeColors.border}`,
            boxShadow: 'inset 0 5px 15px rgba(0,0,0,0.3)',
          }}
        />

        {/* Interactive Elements */}
        <WallTV
          isHovered={hoverArea === 'tv'}
          onClick={() => {
            console.log('📺 [Story Mode] Wall TV clicked');
            setHoverArea(null);
            if (onOpenStats) {
              console.log('📺 [Story Mode] Opening stats panel');
              onOpenStats();
            } else {
              console.warn('⚠️ [Story Mode] onOpenStats callback not provided');
            }
          }}
        />

        <DeskComputer
          isHovered={hoverArea === 'computer'}
          hasNotification={true}
          onClick={() => {
            setHoverArea(null);
            if (onOpenActions) onOpenActions();
          }}
        />

        <DeskPhone
          isHovered={hoverArea === 'phone'}
          onClick={() => {
            console.log('📱 [Story Mode] Desk phone clicked');
            setHoverArea(null);
            if (onOpenNpcs) {
              console.log('📱 [Story Mode] Opening NPC panel');
              onOpenNpcs();
            } else {
              console.warn('⚠️ [Story Mode] onOpenNpcs callback not provided');
            }
          }}
        />

        <Smartphone
          isHovered={hoverArea === 'smartphone'}
          unreadCount={unreadNewsCount}
          onClick={() => {
            setHoverArea(null);
            if (onOpenNews) onOpenNews();
          }}
        />

        <OfficeDoor
          isHovered={hoverArea === 'door'}
          eventCount={worldEventCount}
          onClick={() => {
            setHoverArea(null);
            if (onOpenEvents) onOpenEvents();
          }}
        />

        <MissionFolder
          isHovered={hoverArea === 'folder'}
          onClick={() => {
            setHoverArea(null);
            if (onOpenMission) onOpenMission();
          }}
        />

        {/* Hover Detection Overlays */}
        <div
          className="absolute"
          style={{ top: '5%', left: '8%', width: '35%', height: '28%' }}
          onMouseEnter={() => setHoverArea('tv')}
          onMouseLeave={() => setHoverArea(null)}
        />
        <div
          className="absolute"
          style={{ top: '35%', left: '30%', width: '28%', height: '38%' }}
          onMouseEnter={() => setHoverArea('computer')}
          onMouseLeave={() => setHoverArea(null)}
        />
        <div
          className="absolute"
          style={{ top: '55%', left: '8%', width: '16%', height: '20%' }}
          onMouseEnter={() => setHoverArea('phone')}
          onMouseLeave={() => setHoverArea(null)}
        />
        <div
          className="absolute"
          style={{ top: '58%', left: '62%', width: '10%', height: '22%' }}
          onMouseEnter={() => setHoverArea('smartphone')}
          onMouseLeave={() => setHoverArea(null)}
        />
        <div
          className="absolute"
          style={{ top: '8%', left: '78%', width: '18%', height: '55%' }}
          onMouseEnter={() => setHoverArea('door')}
          onMouseLeave={() => setHoverArea(null)}
        />
        <div
          className="absolute"
          style={{ top: '65%', left: '25%', width: '12%', height: '15%' }}
          onMouseEnter={() => setHoverArea('folder')}
          onMouseLeave={() => setHoverArea(null)}
        />

        {/* Bottom Action Bar */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center"
          style={{
            backgroundColor: 'rgba(45, 45, 45, 0.95)',
            borderTop: `4px solid ${StoryModeColors.border}`,
          }}
        >
          <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
            <span className="mr-4">💡 Klicke auf Objekte | Tastenkürzel:</span>
            <span className="mr-2">[A] Aktionen</span>
            <span className="mr-2">[N] News</span>
            <span className="mr-2">[S] Stats</span>
            <span className="mr-2">[P] NPCs</span>
            <span className="mr-2">[M] Mission</span>
            <span>[E] Events</span>
          </div>
          <button
            onClick={onEndPhase}
            className="px-6 py-2 border-4 font-bold hover:brightness-110 transition-all active:translate-y-0.5"
            style={{
              backgroundColor: StoryModeColors.sovietRed,
              borderColor: StoryModeColors.darkRed,
              color: '#fff',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
            }}
          >
            PHASE BEENDEN →
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfficeScreen;
