import { useState } from 'react';
import { StoryModeColors } from './theme';

interface OfficeScreenProps {
  onExit: () => void;
}

type Interaction = {
  title: string;
  description: string;
};

type HoverArea = 'computer' | 'phone' | 'smartphone' | 'tv' | 'door' | 'folder' | 'notification' | null;

export function OfficeScreen({ onExit }: OfficeScreenProps) {
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);
  const [hoverArea, setHoverArea] = useState<HoverArea>(null);

  const showNote = (title: string, description: string) => {
    setSelectedInteraction({ title, description });
  };

  const closeNote = () => {
    setSelectedInteraction(null);
  };

  const playSound = (soundName: string) => {
    console.log(`🔊 [SOUND: ${soundName}]`);
  };

  // Polygon coordinates (normalized 0-1, will scale with viewBox)
  const polygons = {
    tv: '229,164 598,49 596,237 233,365',
    computer: '580,327 916,414 915,603 581,499',
    notification: '825,402 870,413 869,458 824,445',
    phone: '396,453 544,483 480,592 339,553',
    smartphone: '1041,651 1100,661 1049,746 989,724',
    door: '1010,101 1230,172 1228,589 1008,503',
    folder: '524,625 658,666 546,747 420,701',
  };

  const getPolygonColor = (id: HoverArea): string => {
    switch(id) {
      case 'tv': return StoryModeColors.agencyBlue;
      case 'computer': return StoryModeColors.sovietRed;
      case 'notification': return StoryModeColors.sovietRed;
      case 'phone': return StoryModeColors.warning;
      case 'smartphone': return StoryModeColors.danger;
      case 'door': return StoryModeColors.militaryOlive;
      case 'folder': return StoryModeColors.sovietRed;
      default: return 'transparent';
    }
  };

  const handlePolygonClick = (id: HoverArea) => {
    playSound('Click');

    switch(id) {
      case 'tv':
        showNote(
          '📺 CAMPAIGN ANALYTICS - WALL DISPLAY',
          'PLACEHOLDER: Interactive campaign dashboard\n\n' +
          'Would show real-time campaign performance bars, network trust degradation graph (like Pro Mode metrics), reach vs. exposure trade-offs, target demographics breakdown, and comparative analysis vs. previous days.\n\n' +
          '🔔 [SOUND: Screen beep, data refresh]'
        );
        break;
      case 'computer':
        showNote(
          '💻 SECURE TERMINAL - EMAIL SYSTEM',
          'PLACEHOLDER: Full email interface\n\n' +
          '📧 INBOX (3 unread)\n\n' +
          'FROM: DIRECTOR\n' +
          'SUBJECT: First Day - Choose Campaign Focus\n\n' +
          'Your mission: Destabilize public trust within 30 days.\n\n' +
          'Choose your initial approach:\n' +
          '→ Focus on domestic influencers (Cost: 2 AP, Risk: Low)\n' +
          '→ Target international audience (Cost: 3 AP, Risk: Medium)\n' +
          '→ Request more intelligence first (Cost: 1 AP, Risk: None)\n\n' +
          '🔔 [SOUND: Keyboard typing, email swoosh]'
        );
        break;
      case 'notification':
        showNote(
          '🔴 EMAIL NOTIFICATION',
          'PLACEHOLDER: Notification badge\n\n' +
          '1 new urgent email from DIRECTOR\n\n' +
          'Click computer monitor to read emails.\n' +
          'Badge disappears after reading.\n\n' +
          '🔔 [SOUND: Notification ping]'
        );
        break;
      case 'phone':
        showNote(
          '☎️ SECURE LINE - TEAM CONTACTS',
          'PLACEHOLDER: NPC calling system\n\n' +
          '═══ SPEED DIAL ═══\n\n' +
          '[1] 🤖 VOLKOV - Bot Farm Chief\n' +
          '[2] 📺 CHEN - Media Buyer\n' +
          '[3] 🔍 KESSLER - Intelligence Analyst\n\n' +
          'Each call costs 1 AP. NPCs may call YOU with urgent info.\n\n' +
          '🔔 [SOUND: Phone ringing, dial tone]'
        );
        break;
      case 'smartphone':
        showNote(
          '📱 LIVE NEWS FEED',
          'PLACEHOLDER: Real-time news ticker\n\n' +
          '⚡ 08:15 - TRENDING: #ElectionDebate\n' +
          'Public trust: 67% (-2%)\n' +
          '💡 OPPORTUNITY: High engagement\n\n' +
          '⚡ 08:03 - VIRAL: Scandal video 2M views\n' +
          'Sentiment: 55% negative\n\n' +
          'TIMING BONUS: Launch campaigns during relevant news = +25% effectiveness\n\n' +
          '🔔 [SOUND: Phone buzz]'
        );
        break;
      case 'door':
        showNote(
          '🚪 SECURITY DOOR - EVENT SYSTEM',
          'PLACEHOLDER: Random event entrance\n\n' +
          'When critical events occur, an NPC appears here:\n' +
          '👔 DIRECTOR: Urgent orders\n' +
          '🖥️ IT SECURITY: Detection warning\n' +
          '💰 FINANCE AUDITOR: Questioning expenses\n' +
          '🎭 RIVAL OPERATIVE: "Friendly" advice\n' +
          '📰 JOURNALIST: Investigating\n\n' +
          'Some events are TIME-SENSITIVE.\n\n' +
          '🔔 [SOUND: Door knock, footsteps]'
        );
        break;
      case 'folder':
        showNote(
          '📕 CLASSIFIED DOSSIER',
          'PLACEHOLDER: Mission briefing\n\n' +
          '🌟 MISSION: DESTABILIZE\n' +
          'TARGET: Democratic Institutions\n' +
          'TIMELINE: 30 Days\n' +
          'BUDGET: $50,000\n\n' +
          'PRIMARY OBJECTIVE:\n' +
          '→ Reduce public trust below 40%\n' +
          '→ Target: 75% of population affected\n\n' +
          'FAILURE CONDITIONS:\n' +
          '❌ Exposure > 90%\n' +
          '❌ Time runs out\n\n' +
          '🔔 [SOUND: Page rustle]'
        );
        break;
    }
  };

  return (
    <div
      className="h-full flex flex-col font-mono text-sm relative overflow-hidden"
      style={{
        backgroundColor: StoryModeColors.background,
        color: StoryModeColors.textPrimary
      }}
    >
      {/* Header Bar - Status */}
      <div
        className="border-b-4 p-3 flex justify-between items-center z-20 relative"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border
        }}
      >
        <div className="flex gap-6 text-xs font-bold">
          <div>
            <span style={{ color: StoryModeColors.textSecondary }}>DAY:</span>{' '}
            <span style={{ color: StoryModeColors.sovietRed }}>01</span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.textSecondary }}>TIME:</span>{' '}
            <span style={{ color: StoryModeColors.document }}>08:00</span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.textSecondary }}>AP:</span>{' '}
            <span style={{ color: StoryModeColors.warning }}>12/12</span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.textSecondary }}>💰</span>{' '}
            <span style={{ color: StoryModeColors.warning }}>$50K</span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.textSecondary }}>🏗️</span>{' '}
            <span style={{ color: StoryModeColors.agencyBlue }}>INFRA:3</span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.textSecondary }}>👁️</span>{' '}
            <span style={{ color: StoryModeColors.danger }}>HEAT:5%</span>
          </div>
        </div>
        <button
          onClick={onExit}
          className="px-4 py-1 font-bold border-2 transition-all active:translate-y-0.5"
          style={{
            backgroundColor: StoryModeColors.concrete,
            borderColor: StoryModeColors.borderLight,
            color: StoryModeColors.textPrimary,
            boxShadow: '2px 2px 0px 0px rgba(0,0,0,0.8)'
          }}
        >
          ← EXIT
        </button>
      </div>

      {/* Main Office Scene with SVG Overlay */}
      <div className="flex-1 relative">
        {/* Background Image */}
        <img
          src="/office-brutalist-scene.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            background: `linear-gradient(135deg, ${StoryModeColors.darkConcrete} 0%, ${StoryModeColors.concrete} 50%, ${StoryModeColors.darkConcrete} 100%)`
          }}
        />

        {/* Pulsing Notification Badge - Positioned on drawn notification */}
        <svg
          viewBox="0 0 1536 1024"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <polygon
            points={polygons.notification}
            fill="none"
            stroke={StoryModeColors.sovietRed}
            strokeWidth="4"
            className="animate-pulse"
            style={{
              filter: `drop-shadow(0 0 8px ${StoryModeColors.sovietRed})`
            }}
          />
        </svg>

        {/* SVG Overlay for Clickable Polygons */}
        <svg
          viewBox="0 0 1536 1024"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: 'none', zIndex: 5 }}
        >
          <g style={{ pointerEvents: 'auto' }}>
            {/* TV Screen */}
            <polygon
              points={polygons.tv}
              fill={hoverArea === 'tv' ? 'rgba(74, 157, 255, 0.25)' : 'transparent'}
              stroke={hoverArea === 'tv' ? StoryModeColors.agencyBlue : 'transparent'}
              strokeWidth="4"
              className="cursor-pointer transition-all"
              style={{
                filter: hoverArea === 'tv' ? `drop-shadow(0 0 12px ${StoryModeColors.agencyBlue})` : 'none'
              }}
              onMouseEnter={() => setHoverArea('tv')}
              onMouseLeave={() => setHoverArea(null)}
              onClick={() => handlePolygonClick('tv')}
            />

            {/* Computer Monitor */}
            <polygon
              points={polygons.computer}
              fill={hoverArea === 'computer' ? 'rgba(196, 30, 58, 0.25)' : 'transparent'}
              stroke={hoverArea === 'computer' ? StoryModeColors.sovietRed : 'transparent'}
              strokeWidth="4"
              className="cursor-pointer transition-all"
              style={{
                filter: hoverArea === 'computer' ? `drop-shadow(0 0 12px ${StoryModeColors.sovietRed})` : 'none'
              }}
              onMouseEnter={() => setHoverArea('computer')}
              onMouseLeave={() => setHoverArea(null)}
              onClick={() => handlePolygonClick('computer')}
            />

            {/* Notification Badge - Clickable */}
            <polygon
              points={polygons.notification}
              fill={hoverArea === 'notification' ? 'rgba(196, 30, 58, 0.4)' : 'transparent'}
              stroke="transparent"
              strokeWidth="3"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoverArea('notification')}
              onMouseLeave={() => setHoverArea(null)}
              onClick={() => handlePolygonClick('notification')}
            />

            {/* Telephone */}
            <polygon
              points={polygons.phone}
              fill={hoverArea === 'phone' ? 'rgba(212, 160, 23, 0.25)' : 'transparent'}
              stroke={hoverArea === 'phone' ? StoryModeColors.warning : 'transparent'}
              strokeWidth="4"
              className="cursor-pointer transition-all"
              style={{
                filter: hoverArea === 'phone' ? `drop-shadow(0 0 12px ${StoryModeColors.warning})` : 'none'
              }}
              onMouseEnter={() => setHoverArea('phone')}
              onMouseLeave={() => setHoverArea(null)}
              onClick={() => handlePolygonClick('phone')}
            />

            {/* Smartphone */}
            <polygon
              points={polygons.smartphone}
              fill={hoverArea === 'smartphone' ? 'rgba(255, 68, 68, 0.25)' : 'transparent'}
              stroke={hoverArea === 'smartphone' ? StoryModeColors.danger : 'transparent'}
              strokeWidth="4"
              className="cursor-pointer transition-all"
              style={{
                filter: hoverArea === 'smartphone' ? `drop-shadow(0 0 12px ${StoryModeColors.danger})` : 'none'
              }}
              onMouseEnter={() => setHoverArea('smartphone')}
              onMouseLeave={() => setHoverArea(null)}
              onClick={() => handlePolygonClick('smartphone')}
            />

            {/* Door */}
            <polygon
              points={polygons.door}
              fill={hoverArea === 'door' ? 'rgba(74, 93, 35, 0.25)' : 'transparent'}
              stroke={hoverArea === 'door' ? StoryModeColors.militaryOlive : 'transparent'}
              strokeWidth="4"
              className="cursor-pointer transition-all"
              style={{
                filter: hoverArea === 'door' ? `drop-shadow(0 0 12px ${StoryModeColors.militaryOlive})` : 'none'
              }}
              onMouseEnter={() => setHoverArea('door')}
              onMouseLeave={() => setHoverArea(null)}
              onClick={() => handlePolygonClick('door')}
            />

            {/* Folder */}
            <polygon
              points={polygons.folder}
              fill={hoverArea === 'folder' ? 'rgba(196, 30, 58, 0.25)' : 'transparent'}
              stroke={hoverArea === 'folder' ? StoryModeColors.sovietRed : 'transparent'}
              strokeWidth="4"
              className="cursor-pointer transition-all"
              style={{
                filter: hoverArea === 'folder' ? `drop-shadow(0 0 12px ${StoryModeColors.sovietRed})` : 'none'
              }}
              onMouseEnter={() => setHoverArea('folder')}
              onMouseLeave={() => setHoverArea(null)}
              onClick={() => handlePolygonClick('folder')}
            />
          </g>
        </svg>

        {/* Placeholder message - Bottom Right */}
        <div className="absolute bottom-4 right-4 pointer-events-none max-w-sm z-20">
          <div
            className="text-center p-3 border-4"
            style={{
              backgroundColor: 'rgba(61, 61, 61, 0.95)',
              borderColor: StoryModeColors.sovietRed,
              color: StoryModeColors.textPrimary
            }}
          >
            <div className="text-sm mb-1">📷</div>
            <div className="font-bold text-xs">AI OFFICE SCENE</div>
            <div className="text-xs mt-1" style={{ color: StoryModeColors.textSecondary }}>
              /public/office-brutalist-scene.jpg
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div
          className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center z-20"
          style={{
            backgroundColor: 'rgba(45, 45, 45, 0.95)',
            borderTop: `4px solid ${StoryModeColors.border}`
          }}
        >
          <div style={{ color: StoryModeColors.textSecondary }} className="text-xs">
            💡 TIP: Hover over objects to highlight. Click to view details.
          </div>
          <button
            onClick={() => {
              playSound('End day transition');
              showNote(
                'END DAY - TIME ADVANCEMENT',
                'PLACEHOLDER: Day transition system\n\n' +
                'When you end the day:\n' +
                '→ All campaigns run automatically\n' +
                '→ Network effects propagate\n' +
                '→ Random events may occur\n' +
                '→ AP resets to 12\n' +
                '→ New emails arrive\n\n' +
                'Balance speed vs. stealth.\n\n' +
                '🔔 [SOUND: Clock chime]'
              );
            }}
            className="px-4 py-2 border-4 font-bold hover:brightness-110 transition-all text-xs"
            style={{
              backgroundColor: StoryModeColors.sovietRed,
              borderColor: StoryModeColors.darkRed,
              color: '#fff',
              boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.8)'
            }}
          >
            END DAY →
          </button>
        </div>
      </div>

      {/* Modal - Fixed Height with Scroll */}
      {selectedInteraction && (
        <div
          className="absolute inset-0 flex items-center justify-center p-4 z-50"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={closeNote}
        >
          <div
            className="max-w-2xl w-full border-8 flex flex-col"
            style={{
              backgroundColor: StoryModeColors.surface,
              borderColor: StoryModeColors.border,
              boxShadow: '12px 12px 0px 0px rgba(0,0,0,0.9)',
              maxHeight: '80vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div
              className="border-b-4 p-3 font-bold flex justify-between items-center flex-shrink-0"
              style={{
                backgroundColor: StoryModeColors.agencyBlue,
                borderColor: StoryModeColors.border,
                color: StoryModeColors.warning
              }}
            >
              <span className="text-sm">{selectedInteraction.title}</span>
              <button
                onClick={closeNote}
                className="px-2 py-1 border-2 font-bold hover:brightness-110 transition-all text-xs"
                style={{
                  backgroundColor: StoryModeColors.sovietRed,
                  borderColor: StoryModeColors.darkRed,
                  color: '#fff'
                }}
              >
                ✕
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="p-4 overflow-y-auto flex-1">
              <div
                className="text-xs whitespace-pre-wrap leading-relaxed font-mono"
                style={{ color: StoryModeColors.textPrimary }}
              >
                {selectedInteraction.description}
              </div>
            </div>

            {/* Footer - Fixed */}
            <div
              className="p-3 border-t-4 flex-shrink-0"
              style={{ borderColor: StoryModeColors.borderLight }}
            >
              <button
                onClick={closeNote}
                className="px-4 py-2 border-4 font-bold hover:brightness-110 transition-all text-xs w-full"
                style={{
                  backgroundColor: StoryModeColors.agencyBlue,
                  borderColor: StoryModeColors.darkBlue,
                  color: StoryModeColors.warning,
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)'
                }}
              >
                CLOSE [ESC / CLICK OUTSIDE]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
