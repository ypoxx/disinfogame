import { useState } from 'react';
import { StoryModeColors } from './theme';

interface OfficeScreenProps {
  onExit: () => void;
}

type Interaction = {
  title: string;
  description: string;
};

export function OfficeScreen({ onExit }: OfficeScreenProps) {
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);
  const [emailNotification, setEmailNotification] = useState(true);

  const showNote = (title: string, description: string) => {
    setSelectedInteraction({ title, description });
  };

  const closeNote = () => {
    setSelectedInteraction(null);
  };

  const playSound = (soundName: string) => {
    console.log(`🔊 [SOUND: ${soundName}]`);
    // Placeholder for actual sound implementation
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
        className="border-b-4 p-3 flex justify-between items-center z-20"
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

      {/* Main Office View - Isometric-ish perspective */}
      <div className="flex-1 relative">
        {/* Back Wall with TV Screen */}
        <div
          className="absolute top-0 left-0 right-0 h-48 border-b-4"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
            background: `linear-gradient(to bottom, ${StoryModeColors.darkConcrete} 0%, ${StoryModeColors.concrete} 100%)`
          }}
        >
          {/* TV Screen on Wall */}
          <div
            className="absolute top-8 left-1/2 transform -translate-x-1/2 w-96 border-8 cursor-pointer hover:brightness-110 transition-all"
            style={{
              height: '140px',
              backgroundColor: '#1a1a1a',
              borderColor: StoryModeColors.darkConcrete,
              boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.6)'
            }}
            onClick={() => showNote(
              '📺 CAMPAIGN ANALYTICS - TV DISPLAY',
              'PLACEHOLDER: Interactive campaign dashboard\n\n' +
              '████████████ Trust Decrease: 15%\n' +
              '██████          Bot Reach: 45K\n' +
              '████████████████ Engagement: 89%\n' +
              '████            Detection Risk: 8%\n\n' +
              'Would show:\n' +
              '→ Real-time campaign performance bars\n' +
              '→ Network trust degradation graph\n' +
              '→ Reach vs. exposure metrics\n' +
              '→ Target demographics breakdown\n' +
              '→ Comparative analysis vs. previous days\n\n' +
              '🔔 [SOUND: Screen beep]'
            )}
          >
            <div
              className="p-4 h-full flex flex-col justify-center"
              style={{ backgroundColor: StoryModeColors.agencyBlue }}
            >
              <div className="text-center mb-2 font-bold" style={{ color: StoryModeColors.warning }}>
                ═══ CAMPAIGN STATUS ═══
              </div>
              <div className="space-y-1 text-xs" style={{ color: StoryModeColors.textPrimary }}>
                <div className="flex justify-between">
                  <span>TRUST ▼</span>
                  <span style={{ color: StoryModeColors.sovietRed }}>-15% ████████</span>
                </div>
                <div className="flex justify-between">
                  <span>REACH</span>
                  <span style={{ color: StoryModeColors.success }}>45K ██████</span>
                </div>
                <div className="flex justify-between">
                  <span>ENGAGE</span>
                  <span style={{ color: StoryModeColors.warning }}>89% ████████████</span>
                </div>
              </div>
              <div className="text-center mt-2 text-xs" style={{ color: StoryModeColors.textMuted }}>
                [Click for details]
              </div>
            </div>
          </div>

          {/* Door on the side */}
          <div
            className="absolute top-4 right-12 w-32 border-4 cursor-pointer hover:brightness-110 transition-all"
            style={{
              height: '180px',
              backgroundColor: StoryModeColors.militaryOlive,
              borderColor: StoryModeColors.border,
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)'
            }}
            onClick={() => showNote(
              '🚪 DOOR - EVENT ENTRANCE',
              'PLACEHOLDER: Random event system\n\n' +
              'When important events occur, an NPC will appear here:\n\n' +
              '→ Superior bringing urgent orders\n' +
              '→ IT warning about security breach\n' +
              '→ Finance auditor questioning expenses\n' +
              '→ Rival operative with "friendly" advice\n' +
              '→ Journalist who somehow found your office\n\n' +
              'Each visitor triggers a decision event.\n' +
              'Some are time-sensitive (must respond within X AP).\n\n' +
              'The door stays empty until an event triggers.\n' +
              'Visual: Person sprite would appear in doorway.\n\n' +
              '🔔 [SOUND: Door knock/open]'
            )}
          >
            <div className="h-full flex flex-col items-center justify-center text-center p-2">
              <div className="text-4xl mb-2">🚪</div>
              <div className="text-xs font-bold" style={{ color: StoryModeColors.textSecondary }}>
                [EVENT DOOR]
              </div>
              <div className="text-xs mt-2" style={{ color: StoryModeColors.textMuted }}>
                Currently closed
              </div>
            </div>
          </div>
        </div>

        {/* Desk Surface */}
        <div
          className="absolute top-48 left-0 right-0 bottom-0 p-8"
          style={{
            backgroundColor: StoryModeColors.concrete,
            background: `linear-gradient(to bottom, ${StoryModeColors.lightConcrete} 0%, ${StoryModeColors.concrete} 100%)`
          }}
        >
          {/* Computer Monitor (Center) */}
          <div
            className="absolute top-12 left-1/2 transform -translate-x-1/2 w-[480px] cursor-pointer hover:brightness-110 transition-all"
            onClick={() => {
              setEmailNotification(false);
              playSound('Email notification click');
              showNote(
                '💻 COMPUTER - EMAIL SYSTEM',
                'PLACEHOLDER: Full email interface\n\n' +
                '📧 INBOX (3 unread)\n\n' +
                '═══════════════════════════\n' +
                'FROM: DIRECTOR\n' +
                'SUBJECT: First Day - Choose Focus\n' +
                'PRIORITY: URGENT\n' +
                '═══════════════════════════\n\n' +
                'Welcome to your first day as Information Operations Coordinator.\n\n' +
                'Your mission: Destabilize public trust in [TARGET REGION] institutions.\n\n' +
                'Choose your initial approach:\n\n' +
                '[BUTTON] → Focus on domestic influencers (Cost: 2 AP)\n' +
                '[BUTTON] → Target international audience (Cost: 3 AP) \n' +
                '[BUTTON] → Request more intelligence first (Cost: 1 AP)\n\n' +
                'Each choice has different long-term implications.\n\n' +
                '🔔 [SOUND: Keyboard typing when making choice]'
              );
            }}
          >
            {/* Monitor Frame */}
            <div
              className="border-8 relative"
              style={{
                backgroundColor: '#000',
                borderColor: StoryModeColors.darkConcrete,
                boxShadow: '6px 6px 0px 0px rgba(0,0,0,0.8)'
              }}
            >
              {/* Screen */}
              <div
                className="p-6 relative"
                style={{
                  height: '280px',
                  backgroundColor: StoryModeColors.agencyBlue
                }}
              >
                {/* Email notification badge */}
                {emailNotification && (
                  <div
                    className="absolute top-2 right-2 px-3 py-1 border-2 font-bold animate-pulse"
                    style={{
                      backgroundColor: StoryModeColors.sovietRed,
                      borderColor: StoryModeColors.darkRed,
                      color: '#fff'
                    }}
                  >
                    🔔 3 NEW
                  </div>
                )}

                <div className="text-center mb-4 font-bold text-lg" style={{ color: StoryModeColors.warning }}>
                  ╔═══════════════════════╗
                  <br />
                  ║   SECURE TERMINAL    ║
                  <br />
                  ╚═══════════════════════╝
                </div>

                <div className="space-y-3 text-xs">
                  <div
                    className="p-3 border-2"
                    style={{
                      backgroundColor: StoryModeColors.darkConcrete,
                      borderColor: StoryModeColors.sovietRed
                    }}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-bold">📧 DIRECTOR</span>
                      <span style={{ color: StoryModeColors.danger }}>URGENT</span>
                    </div>
                    <div style={{ color: StoryModeColors.textSecondary }}>
                      First Day - Choose Campaign Focus
                    </div>
                  </div>

                  <div
                    className="p-3 border-2"
                    style={{
                      backgroundColor: StoryModeColors.darkConcrete,
                      borderColor: StoryModeColors.warning
                    }}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-bold">💰 FINANCE</span>
                      <span style={{ color: StoryModeColors.warning }}>PENDING</span>
                    </div>
                    <div style={{ color: StoryModeColors.textSecondary }}>
                      Budget Allocation - $50,000
                    </div>
                  </div>

                  <div
                    className="p-3 border-2"
                    style={{
                      backgroundColor: StoryModeColors.darkConcrete,
                      borderColor: StoryModeColors.agencyBlue
                    }}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-bold">🗺️ INTEL</span>
                      <span style={{ color: StoryModeColors.agencyBlue }}>INFO</span>
                    </div>
                    <div style={{ color: StoryModeColors.textSecondary }}>
                      Target Network Analysis Ready
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-2 left-0 right-0 text-center text-xs" style={{ color: StoryModeColors.textMuted }}>
                  [Click to open email client]
                </div>
              </div>
            </div>

            {/* Monitor Stand */}
            <div
              className="mx-auto w-24 h-6 border-4"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.border
              }}
            />
            <div
              className="mx-auto w-32 h-3"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderTop: `4px solid ${StoryModeColors.border}`
              }}
            />
          </div>

          {/* Telephone (Left side of desk) */}
          <div
            className="absolute top-24 left-12 w-48 cursor-pointer hover:scale-105 transition-all"
            onClick={() => {
              playSound('Phone dial tone');
              showNote(
                '☎️ OFFICE TELEPHONE - TEAM CONTACTS',
                'PLACEHOLDER: NPC calling system\n\n' +
                '═══ SPEED DIAL ═══\n\n' +
                '[1] 🤖 VOLKOV - Bot Farm Chief\n' +
                '    "The machines are ready, boss."\n' +
                '    • Request bot campaign\n' +
                '    • Check capacity\n' +
                '    • Discuss strategy\n\n' +
                '[2] 📺 CHEN - Media Buyer\n' +
                '    "I can get your message anywhere."\n' +
                '    • Purchase ad placements\n' +
                '    • Target demographics\n' +
                '    • Budget allocation\n\n' +
                '[3] 🔍 KESSLER - Intelligence\n' +
                '    "I see everything they don\'t hide well."\n' +
                '    • Network analysis\n' +
                '    • Vulnerability reports\n' +
                '    • Defensive actor warnings\n\n' +
                'Each call costs 1 AP.\n' +
                'Some NPCs may call YOU with urgent info.\n\n' +
                '🔔 [SOUND: Phone ringing / dial tone / hang up]'
              );
            }}
          >
            <div
              className="p-4 border-4"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.border,
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)'
              }}
            >
              <div className="text-center text-4xl mb-2">☎️</div>
              <div className="text-center font-bold text-xs mb-2" style={{ color: StoryModeColors.warning }}>
                SECURE LINE
              </div>
              <div className="space-y-1 text-xs" style={{ color: StoryModeColors.textSecondary }}>
                <div>[1] VOLKOV</div>
                <div>[2] CHEN</div>
                <div>[3] KESSLER</div>
              </div>
              <div className="text-center mt-2 text-xs" style={{ color: StoryModeColors.textMuted }}>
                [Click to dial]
              </div>
            </div>
          </div>

          {/* Smartphone (Right side of desk) */}
          <div
            className="absolute top-24 right-12 w-44 cursor-pointer hover:scale-105 transition-all"
            onClick={() => {
              playSound('Phone notification');
              showNote(
                '📱 SMARTPHONE - NEWS FEED',
                'PLACEHOLDER: Live news ticker\n\n' +
                '═══ BREAKING NEWS ═══\n\n' +
                '⚡ 08:15 - TRENDING: #ElectionDebate\n' +
                '   Public trust in candidates: 67%\n\n' +
                '⚡ 08:03 - SOCIAL: Viral video reaches 2M views\n' +
                '   Sentiment: 45% positive, 55% negative\n\n' +
                '⚡ 07:52 - POLITICS: Minister denies allegations\n' +
                '   Media coverage: High\n\n' +
                '⚡ 07:41 - ECONOMY: Market uncertainty grows\n' +
                '   Public confidence: 58% (-3%)\n\n' +
                '═══════════════════\n\n' +
                'Would show real-time events in target region:\n' +
                '→ Trending topics (campaign opportunities)\n' +
                '→ Public sentiment shifts\n' +
                '→ Defensive responses to your campaigns\n' +
                '→ Random events affecting strategy\n\n' +
                'News affects campaign effectiveness.\n' +
                'Timing your actions with news cycles = bonus.\n\n' +
                '🔔 [SOUND: Phone buzz/notification]'
              );
            }}
          >
            <div
              className="border-8 rounded-lg"
              style={{
                height: '280px',
                backgroundColor: '#000',
                borderColor: StoryModeColors.darkConcrete,
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)'
              }}
            >
              <div
                className="p-3 h-full overflow-hidden"
                style={{ backgroundColor: StoryModeColors.surface }}
              >
                <div className="text-center mb-2 text-xs font-bold" style={{ color: StoryModeColors.danger }}>
                  ⚡ LIVE NEWS ⚡
                </div>

                <div className="space-y-2 text-xs">
                  <div
                    className="p-2 border-l-4"
                    style={{
                      backgroundColor: StoryModeColors.darkConcrete,
                      borderColor: StoryModeColors.sovietRed
                    }}
                  >
                    <div className="font-bold mb-1">08:15 BREAKING</div>
                    <div style={{ color: StoryModeColors.textSecondary }}>
                      #ElectionDebate trending
                    </div>
                  </div>

                  <div
                    className="p-2 border-l-4"
                    style={{
                      backgroundColor: StoryModeColors.darkConcrete,
                      borderColor: StoryModeColors.warning
                    }}
                  >
                    <div className="font-bold mb-1">08:03 VIRAL</div>
                    <div style={{ color: StoryModeColors.textSecondary }}>
                      Video: 2M views
                    </div>
                  </div>

                  <div
                    className="p-2 border-l-4"
                    style={{
                      backgroundColor: StoryModeColors.darkConcrete,
                      borderColor: StoryModeColors.agencyBlue
                    }}
                  >
                    <div className="font-bold mb-1">07:52 POLITICS</div>
                    <div style={{ color: StoryModeColors.textSecondary }}>
                      Minister statement
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-0 right-0 text-center text-xs" style={{ color: StoryModeColors.textMuted }}>
                  [Tap for details]
                </div>
              </div>
            </div>
          </div>

          {/* Desk Items Bottom */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button
              onClick={() => {
                playSound('Button click');
                showNote(
                  '📅 CALENDAR',
                  'PLACEHOLDER: Mission timeline\n\n' +
                  '═══ 30-DAY CAMPAIGN ═══\n\n' +
                  'DAY 01 ◄ YOU ARE HERE\n' +
                  '│ └─ Choose initial strategy\n' +
                  '│\n' +
                  'DAY 05\n' +
                  '│ └─ ⚠️ First evaluation checkpoint\n' +
                  '│\n' +
                  'DAY 10\n' +
                  '│ └─ ⚠️ Mid-campaign review\n' +
                  '│\n' +
                  'DAY 15\n' +
                  '│ └─ Budget renewal decision\n' +
                  '│\n' +
                  'DAY 30\n' +
                  '└─ 🎯 FINAL OBJECTIVE DEADLINE\n\n' +
                  'View upcoming events, deadlines, milestones.\n' +
                  'Plan your AP spending across days.\n\n' +
                  '🔔 [SOUND: Page flip]'
                );
              }}
              className="p-4 border-4 hover:brightness-110 transition-all"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.border,
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
                color: StoryModeColors.textPrimary
              }}
            >
              <div className="text-2xl mb-1">📅</div>
              <div className="text-xs font-bold">CALENDAR</div>
            </button>

            <button
              onClick={() => {
                playSound('Button click');
                showNote(
                  '📖 MANUAL',
                  'PLACEHOLDER: In-game encyclopedia\n\n' +
                  '═══ OPERATIONAL MANUAL ═══\n\n' +
                  '📚 SECTIONS:\n\n' +
                  '→ Technique Glossary\n' +
                  '   (Astroturfing, Sockpuppets, etc.)\n\n' +
                  '→ System Mechanics\n' +
                  '   (How AP, Heat, Trust work)\n\n' +
                  '→ Team Profiles\n' +
                  '   (Volkov, Chen, Kessler bios)\n\n' +
                  '→ Campaign Types\n' +
                  '   (Bot swarms, Ad buys, etc.)\n\n' +
                  '→ Risk Management\n' +
                  '   (Avoiding detection)\n\n' +
                  'Like Papers Please rulebook.\n' +
                  'Reference anytime without AP cost.\n\n' +
                  '🔔 [SOUND: Book open]'
                );
              }}
              className="p-4 border-4 hover:brightness-110 transition-all"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.border,
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
                color: StoryModeColors.textPrimary
              }}
            >
              <div className="text-2xl mb-1">📖</div>
              <div className="text-xs font-bold">MANUAL</div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div
        className="border-t-4 p-3 text-xs z-20"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border
        }}
      >
        <div className="flex justify-between items-center">
          <div style={{ color: StoryModeColors.textSecondary }}>
            💡 TIP: Check your emails on the computer. Each action costs AP. Choose wisely.
          </div>
          <button
            onClick={() => {
              playSound('End day transition');
              showNote(
                'END DAY',
                'PLACEHOLDER: Day transition system\n\n' +
                'When you end the day:\n\n' +
                '→ All active campaigns run automatically\n' +
                '→ Network effects propagate (trust changes)\n' +
                '→ Random events may occur\n' +
                '→ Resources regenerate\n' +
                '→ New emails arrive tomorrow morning\n' +
                '→ News feed updates\n' +
                '→ Heat level adjusts based on activity\n\n' +
                'You get 12 AP per day.\n' +
                'Unused AP = wasted opportunity.\n' +
                'But rushing = higher heat = detection risk.\n\n' +
                'Time pressure: Balance speed vs. stealth.\n\n' +
                '🔔 [SOUND: Clock chime, transition music]'
              );
            }}
            className="px-6 py-2 border-4 font-bold hover:brightness-110 transition-all"
            style={{
              backgroundColor: StoryModeColors.sovietRed,
              borderColor: StoryModeColors.darkRed,
              color: '#fff',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)'
            }}
          >
            END DAY →
          </button>
        </div>
      </div>

      {/* Note/Description Modal */}
      {selectedInteraction && (
        <div className="absolute inset-0 flex items-center justify-center p-8 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div
            className="max-w-3xl w-full border-8"
            style={{
              backgroundColor: StoryModeColors.surface,
              borderColor: StoryModeColors.border,
              boxShadow: '12px 12px 0px 0px rgba(0,0,0,0.9)'
            }}
          >
            <div
              className="border-b-4 p-4 font-bold flex justify-between items-center"
              style={{
                backgroundColor: StoryModeColors.agencyBlue,
                borderColor: StoryModeColors.border,
                color: StoryModeColors.warning
              }}
            >
              <span>{selectedInteraction.title}</span>
              <button
                onClick={closeNote}
                className="px-3 py-1 border-2 font-bold hover:brightness-110 transition-all"
                style={{
                  backgroundColor: StoryModeColors.sovietRed,
                  borderColor: StoryModeColors.darkRed,
                  color: '#fff'
                }}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div
                className="text-sm whitespace-pre-wrap leading-relaxed font-mono"
                style={{ color: StoryModeColors.textPrimary }}
              >
                {selectedInteraction.description}
              </div>
              <div
                className="mt-6 pt-4 border-t-4"
                style={{ borderColor: StoryModeColors.borderLight }}
              >
                <button
                  onClick={closeNote}
                  className="px-6 py-2 border-4 font-bold hover:brightness-110 transition-all"
                  style={{
                    backgroundColor: StoryModeColors.agencyBlue,
                    borderColor: StoryModeColors.darkBlue,
                    color: StoryModeColors.warning,
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)'
                  }}
                >
                  CLOSE [ESC]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
