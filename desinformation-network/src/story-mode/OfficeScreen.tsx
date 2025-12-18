import { useState } from 'react';
import { StoryModeColors } from './theme';

interface OfficeScreenProps {
  onExit: () => void;
}

type Interaction = {
  title: string;
  description: string;
};

type HoverArea = 'computer' | 'phone' | 'smartphone' | 'tv' | 'door' | null;

export function OfficeScreen({ onExit }: OfficeScreenProps) {
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);
  const [hoverArea, setHoverArea] = useState<HoverArea>(null);
  const [emailNotification] = useState(true);

  const showNote = (title: string, description: string) => {
    setSelectedInteraction({ title, description });
  };

  const closeNote = () => {
    setSelectedInteraction(null);
  };

  const playSound = (soundName: string) => {
    console.log(`🔊 [SOUND: ${soundName}]`);
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

      {/* Main Office Scene - AI Image Background with Clickable Areas */}
      <div
        className="flex-1 relative"
        style={{
          backgroundImage: 'url(/office-brutalist-scene.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          // Fallback gradient if image not loaded
          background: `linear-gradient(135deg, ${StoryModeColors.darkConcrete} 0%, ${StoryModeColors.concrete} 50%, ${StoryModeColors.darkConcrete} 100%)`
        }}
      >
        {/* Placeholder message if image not loaded */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="text-center p-8 border-4"
            style={{
              backgroundColor: 'rgba(61, 61, 61, 0.9)',
              borderColor: StoryModeColors.sovietRed,
              color: StoryModeColors.textPrimary
            }}
          >
            <div className="text-2xl mb-4">📷</div>
            <div className="font-bold mb-2">AI-GENERATED OFFICE SCENE</div>
            <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
              Place your AI-generated image at:<br />
              <code>/public/office-brutalist-scene.jpg</code>
              <br /><br />
              Interactive areas are still clickable!
            </div>
          </div>
        </div>

        {/* TV Screen - Top Left */}
        <div
          className="absolute cursor-pointer transition-all"
          style={{
            top: '8%',
            left: '15%',
            width: '28%',
            height: '20%',
            backgroundColor: hoverArea === 'tv' ? 'rgba(74, 157, 255, 0.3)' : 'transparent',
            border: hoverArea === 'tv' ? `3px solid ${StoryModeColors.agencyBlue}` : 'none',
            boxShadow: hoverArea === 'tv' ? `0 0 20px ${StoryModeColors.agencyBlue}` : 'none',
            borderRadius: '8px'
          }}
          onMouseEnter={() => setHoverArea('tv')}
          onMouseLeave={() => setHoverArea(null)}
          onClick={() => {
            playSound('Screen beep');
            showNote(
              '📺 CAMPAIGN ANALYTICS - WALL DISPLAY',
              'PLACEHOLDER: Interactive campaign dashboard\n\n' +
              '████████████ Trust Decrease: 15%\n' +
              '██████          Bot Reach: 45K\n' +
              '████████████████ Engagement: 89%\n' +
              '████            Detection Risk: 8%\n\n' +
              'Would show:\n' +
              '→ Real-time campaign performance bars\n' +
              '→ Network trust degradation graph (like Pro Mode metrics)\n' +
              '→ Reach vs. exposure trade-offs\n' +
              '→ Target demographics breakdown\n' +
              '→ Comparative analysis vs. previous days\n' +
              '→ Clickable bars to drill down into details\n\n' +
              'This bridges Story Mode visuals with Pro Mode analytics.\n\n' +
              '🔔 [SOUND: Screen beep, data refresh]'
            );
          }}
        >
          {hoverArea === 'tv' && (
            <div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 border-2 font-bold text-xs whitespace-nowrap"
              style={{
                backgroundColor: StoryModeColors.agencyBlue,
                borderColor: StoryModeColors.darkBlue,
                color: StoryModeColors.warning
              }}
            >
              📺 CAMPAIGN STATS
            </div>
          )}
        </div>

        {/* Computer Monitor - Center */}
        <div
          className="absolute cursor-pointer transition-all"
          style={{
            top: '38%',
            left: '35%',
            width: '30%',
            height: '32%',
            backgroundColor: hoverArea === 'computer' ? 'rgba(196, 30, 58, 0.3)' : 'transparent',
            border: hoverArea === 'computer' ? `3px solid ${StoryModeColors.sovietRed}` : 'none',
            boxShadow: hoverArea === 'computer' ? `0 0 20px ${StoryModeColors.sovietRed}` : 'none',
            borderRadius: '8px'
          }}
          onMouseEnter={() => setHoverArea('computer')}
          onMouseLeave={() => setHoverArea(null)}
          onClick={() => {
            playSound('Email notification click');
            showNote(
              '💻 SECURE TERMINAL - EMAIL SYSTEM',
              'PLACEHOLDER: Full email interface\n\n' +
              '📧 INBOX (3 unread)\n\n' +
              '═══════════════════════════\n' +
              'FROM: DIRECTOR\n' +
              'SUBJECT: First Day - Choose Campaign Focus\n' +
              'PRIORITY: 🔴 URGENT\n' +
              'RECEIVED: 08:00\n' +
              '═══════════════════════════\n\n' +
              'Welcome to your first day as Information Operations Coordinator.\n\n' +
              'Your mission: Destabilize public trust in [TARGET REGION] institutions within 30 days.\n\n' +
              'Choose your initial approach:\n\n' +
              '[BUTTON] → Focus on domestic influencers (Cost: 2 AP, Risk: Low)\n' +
              '[BUTTON] → Target international audience (Cost: 3 AP, Risk: Medium)\n' +
              '[BUTTON] → Request more intelligence first (Cost: 1 AP, Risk: None)\n\n' +
              'Each choice affects:\n' +
              '- Available campaign types\n' +
              '- NPC relationships\n' +
              '- Long-term strategy options\n\n' +
              'The notification badge (1) would disappear after reading.\n\n' +
              '🔔 [SOUND: Keyboard typing, email swoosh]'
            );
          }}
        >
          {/* Email Notification Badge */}
          {emailNotification && (
            <div
              className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center border-2 font-bold animate-pulse"
              style={{
                backgroundColor: StoryModeColors.sovietRed,
                borderColor: StoryModeColors.darkRed,
                color: '#fff',
                borderRadius: '50%'
              }}
            >
              1
            </div>
          )}
          {hoverArea === 'computer' && (
            <div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 border-2 font-bold text-xs whitespace-nowrap"
              style={{
                backgroundColor: StoryModeColors.sovietRed,
                borderColor: StoryModeColors.darkRed,
                color: '#fff'
              }}
            >
              💻 SECURE TERMINAL
            </div>
          )}
        </div>

        {/* Telephone - Left Side */}
        <div
          className="absolute cursor-pointer transition-all"
          style={{
            top: '50%',
            left: '10%',
            width: '18%',
            height: '18%',
            backgroundColor: hoverArea === 'phone' ? 'rgba(212, 160, 23, 0.3)' : 'transparent',
            border: hoverArea === 'phone' ? `3px solid ${StoryModeColors.warning}` : 'none',
            boxShadow: hoverArea === 'phone' ? `0 0 20px ${StoryModeColors.warning}` : 'none',
            borderRadius: '8px'
          }}
          onMouseEnter={() => setHoverArea('phone')}
          onMouseLeave={() => setHoverArea(null)}
          onClick={() => {
            playSound('Phone dial tone');
            showNote(
              '☎️ SECURE LINE - TEAM CONTACTS',
              'PLACEHOLDER: NPC calling system\n\n' +
              '═══ SPEED DIAL ═══\n\n' +
              '[1] 🤖 VOLKOV - Bot Farm Chief\n' +
              '    STATUS: Available\n' +
              '    "The machines are ready, boss. Just point me at the target."\n\n' +
              '    Available options:\n' +
              '    • Request coordinated bot campaign (2 AP)\n' +
              '    • Check current capacity (0 AP)\n' +
              '    • Discuss new tactics (1 AP)\n' +
              '    • Emergency: Shut down detected bots (1 AP, urgent)\n\n' +
              '[2] 📺 CHEN - Media Buyer\n' +
              '    STATUS: Available\n' +
              '    "I can get your message anywhere. Money talks."\n\n' +
              '    Available options:\n' +
              '    • Purchase ad placements (3 AP, high cost)\n' +
              '    • Target specific demographics (2 AP)\n' +
              '    • Review budget allocation (0 AP)\n\n' +
              '[3] 🔍 KESSLER - Intelligence Analyst\n' +
              '    STATUS: Available\n' +
              '    "I see everything they think they hide."\n\n' +
              '    Available options:\n' +
              '    • Request network analysis (1 AP)\n' +
              '    • Get vulnerability report (2 AP)\n' +
              '    • Warning: Defensive actors detected (0 AP, alert)\n\n' +
              'Each call costs AP. Choose wisely.\n' +
              'NPCs may call YOU with urgent info (interrupts).\n\n' +
              '🔔 [SOUND: Phone ringing, dial tone, hang up click]'
            );
          }}
        >
          {hoverArea === 'phone' && (
            <div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 border-2 font-bold text-xs whitespace-nowrap"
              style={{
                backgroundColor: StoryModeColors.warning,
                borderColor: '#A37F1A',
                color: StoryModeColors.background
              }}
            >
              ☎️ SECURE LINE
            </div>
          )}
        </div>

        {/* Smartphone - Right Side */}
        <div
          className="absolute cursor-pointer transition-all"
          style={{
            top: '56%',
            left: '68%',
            width: '14%',
            height: '22%',
            backgroundColor: hoverArea === 'smartphone' ? 'rgba(255, 68, 68, 0.3)' : 'transparent',
            border: hoverArea === 'smartphone' ? `3px solid ${StoryModeColors.danger}` : 'none',
            boxShadow: hoverArea === 'smartphone' ? `0 0 20px ${StoryModeColors.danger}` : 'none',
            borderRadius: '8px'
          }}
          onMouseEnter={() => setHoverArea('smartphone')}
          onMouseLeave={() => setHoverArea(null)}
          onClick={() => {
            playSound('Phone notification buzz');
            showNote(
              '📱 LIVE NEWS FEED - INTELLIGENCE',
              'PLACEHOLDER: Real-time news ticker\n\n' +
              '═══ BREAKING NEWS - TARGET REGION ═══\n\n' +
              '⚡ 08:15 - TRENDING: #ElectionDebate\n' +
              '   Public trust in candidates: 67% (-2% since yesterday)\n' +
              '   💡 OPPORTUNITY: High engagement, low defenses\n' +
              '   Recommended: Launch bot campaign now (bonus effectiveness)\n\n' +
              '⚡ 08:03 - VIRAL: Scandal video reaches 2M views\n' +
              '   Sentiment: 45% positive, 55% negative\n' +
              '   💡 OPPORTUNITY: Amplify negative sentiment\n' +
              '   Risk: High attention = detection risk\n\n' +
              '⚡ 07:52 - POLITICS: Minister denies corruption allegations\n' +
              '   Media coverage: Very High\n' +
              '   💡 OPPORTUNITY: Seed doubt with targeted ads\n\n' +
              '⚡ 07:41 - ECONOMY: Market uncertainty grows\n' +
              '   Public confidence: 58% (-3% this week)\n' +
              '   ⚠️ WARNING: Economic instability attracts investigators\n\n' +
              '═══════════════════════════════\n\n' +
              'News Feed shows:\n' +
              '→ Trending topics = campaign opportunities\n' +
              '→ Public sentiment shifts in real-time\n' +
              '→ Defensive responses to your campaigns\n' +
              '→ Random events affecting strategy\n\n' +
              'TIMING BONUS: Launch campaigns during relevant news = +25% effectiveness\n\n' +
              'News updates every turn (day).\n\n' +
              '🔔 [SOUND: Phone buzz, notification ping]'
            );
          }}
        >
          {hoverArea === 'smartphone' && (
            <div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 border-2 font-bold text-xs whitespace-nowrap"
              style={{
                backgroundColor: StoryModeColors.danger,
                borderColor: '#CC0000',
                color: '#fff'
              }}
            >
              📱 LIVE NEWS
            </div>
          )}
        </div>

        {/* Door - Right Side */}
        <div
          className="absolute cursor-pointer transition-all"
          style={{
            top: '15%',
            left: '75%',
            width: '16%',
            height: '35%',
            backgroundColor: hoverArea === 'door' ? 'rgba(74, 93, 35, 0.3)' : 'transparent',
            border: hoverArea === 'door' ? `3px solid ${StoryModeColors.militaryOlive}` : 'none',
            boxShadow: hoverArea === 'door' ? `0 0 20px ${StoryModeColors.militaryOlive}` : 'none',
            borderRadius: '8px'
          }}
          onMouseEnter={() => setHoverArea('door')}
          onMouseLeave={() => setHoverArea(null)}
          onClick={() => {
            playSound('Door knock');
            showNote(
              '🚪 SECURITY DOOR - EVENT SYSTEM',
              'PLACEHOLDER: Random event entrance\n\n' +
              'Currently: CLOSED (No active events)\n\n' +
              'When critical events occur, an NPC appears here:\n\n' +
              '👤 POSSIBLE VISITORS:\n\n' +
              '→ 👔 DIRECTOR: Urgent orders, strategy changes\n' +
              '   "The higher-ups want results. Now."\n\n' +
              '→ 🖥️ IT SECURITY: Warning about detection\n' +
              '   "We have a problem. They\'re looking for us."\n\n' +
              '→ 💰 FINANCE AUDITOR: Questioning expenses\n' +
              '   "I need to see receipts for these \'consultant fees\'."\n\n' +
              '→ 🎭 RIVAL OPERATIVE: "Friendly" advice\n' +
              '   "Nice campaign. Shame if something... disrupted it."\n\n' +
              '→ 📰 JOURNALIST: Investigative reporter\n' +
              '   "I know what you\'re doing. Care to comment?"\n\n' +
              'EVENT MECHANICS:\n' +
              '- NPC sprite appears in doorway\n' +
              '- Dialogue choices presented\n' +
              '- Some events are TIME-SENSITIVE (must respond within X AP)\n' +
              '- Choices affect: Heat level, NPC relationships, story branches\n' +
              '- Door pulses/glows when event is active\n\n' +
              'Like Papers Please inspector visits - creates tension!\n\n' +
              '🔔 [SOUND: Door knock, footsteps, door creak]'
            );
          }}
        >
          {hoverArea === 'door' && (
            <div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 border-2 font-bold text-xs whitespace-nowrap"
              style={{
                backgroundColor: StoryModeColors.militaryOlive,
                borderColor: StoryModeColors.darkOlive,
                color: StoryModeColors.warning
              }}
            >
              🚪 EVENT DOOR
            </div>
          )}
        </div>

        {/* Desk Items - Soviet Folder */}
        <div
          className="absolute cursor-pointer transition-all"
          style={{
            top: '58%',
            left: '28%',
            width: '12%',
            height: '12%',
            backgroundColor: hoverArea === 'folder' ? 'rgba(196, 30, 58, 0.3)' : 'transparent',
            border: hoverArea === 'folder' ? `3px solid ${StoryModeColors.sovietRed}` : 'none',
            boxShadow: hoverArea === 'folder' ? `0 0 20px ${StoryModeColors.sovietRed}` : 'none',
            borderRadius: '8px'
          }}
          onMouseEnter={() => setHoverArea('folder' as HoverArea)}
          onMouseLeave={() => setHoverArea(null)}
          onClick={() => {
            playSound('Page flip');
            showNote(
              '📕 CLASSIFIED DOSSIER - MISSION BRIEFING',
              'PLACEHOLDER: Mission documents & objectives\n\n' +
              '═══ OPERATION DOSSIER ═══\n\n' +
              '🌟 MISSION: DESTABILIZE\n' +
              'TARGET: [REDACTED] Democratic Institutions\n' +
              'TIMELINE: 30 Days\n' +
              'BUDGET: $50,000 (renewable based on results)\n\n' +
              'PRIMARY OBJECTIVE:\n' +
              '→ Reduce public trust below 40% threshold\n' +
              '→ Target: 75% of population affected\n\n' +
              'SECONDARY OBJECTIVES:\n' +
              '→ Maintain operational security (Heat < 80%)\n' +
              '→ Maximize ROI (efficiency scoring)\n' +
              '→ Avoid attribution (no direct links to source)\n\n' +
              'SUCCESS METRICS:\n' +
              '- Trust degradation rate\n' +
              '- Campaign reach vs. cost\n' +
              '- Detection avoidance\n' +
              '- Network effect propagation\n\n' +
              'FAILURE CONDITIONS:\n' +
              '❌ Exposure > 90% (operation shut down)\n' +
              '❌ Time runs out (30 days)\n' +
              '❌ Budget exhausted with no results\n\n' +
              'This connects to the Pro Mode victory conditions!\n\n' +
              '🔔 [SOUND: Page rustle, stamp]'
            );
          }}
        />

        {/* Bottom Action Bar - Overlay on image */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center"
          style={{
            backgroundColor: 'rgba(45, 45, 45, 0.95)',
            borderTop: `4px solid ${StoryModeColors.border}`
          }}
        >
          <div style={{ color: StoryModeColors.textSecondary }} className="text-xs">
            💡 TIP: Hover over any element to see interactions. Click to view details.
          </div>
          <button
            onClick={() => {
              playSound('End day transition');
              showNote(
                'END DAY - TIME ADVANCEMENT',
                'PLACEHOLDER: Day transition system\n\n' +
                '⏰ END DAY SEQUENCE:\n\n' +
                '1. CAMPAIGN EXECUTION\n' +
                '   → All active campaigns run automatically\n' +
                '   → Bot swarms deploy\n' +
                '   → Ads reach target audiences\n' +
                '   → Content spreads through network\n\n' +
                '2. NETWORK PROPAGATION\n' +
                '   → Trust changes ripple through connections\n' +
                '   → Like Pro Mode network mechanics\n' +
                '   → Results shown on TV screen\n\n' +
                '3. RANDOM EVENTS\n' +
                '   → News stories break\n' +
                '   → Defensive actors may spawn\n' +
                '   → Budget changes\n' +
                '   → NPC status updates\n\n' +
                '4. RESOURCE REGENERATION\n' +
                '   → AP resets to 12\n' +
                '   → Heat level adjusts\n' +
                '   → New emails arrive\n\n' +
                '5. NEW DAY BEGINS\n' +
                '   → Day counter increments\n' +
                '   → Fresh opportunities\n' +
                '   → Time pressure increases\n\n' +
                'STRATEGY:\n' +
                '- Unused AP = wasted opportunity\n' +
                '- But rushing = higher heat = detection\n' +
                '- Balance speed vs. stealth\n\n' +
                'You have 12 AP per day. Use them wisely.\n\n' +
                '🔔 [SOUND: Clock chime, transition whoosh, new day jingle]'
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

      {/* Modal - Unchanged from previous version */}
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
