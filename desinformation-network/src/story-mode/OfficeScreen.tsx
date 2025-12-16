import { useState } from 'react';

interface OfficeScreenProps {
  onExit: () => void;
}

type Interaction = {
  title: string;
  description: string;
};

export function OfficeScreen({ onExit }: OfficeScreenProps) {
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);

  const showNote = (title: string, description: string) => {
    setSelectedInteraction({ title, description });
  };

  const closeNote = () => {
    setSelectedInteraction(null);
  };

  return (
    <div className="h-full flex flex-col bg-[#3d3d3d] text-[#d4d4d4] relative">
      {/* Header Bar - Papers Please style */}
      <div className="bg-[#2d2d2d] border-b-2 border-[#1a1a1a] p-4 flex justify-between items-center">
        <div className="flex gap-8 text-sm">
          <div>
            <span className="text-[#888]">DAY:</span>{' '}
            <span className="text-[#4a9eff]">1</span>
          </div>
          <div>
            <span className="text-[#888]">TIME:</span>{' '}
            <span className="text-[#4a9eff]">08:00</span>
          </div>
          <div>
            <span className="text-[#888]">ACTION POINTS:</span>{' '}
            <span className="text-[#ffaa00]">12/12</span>
          </div>
        </div>
        <button
          onClick={onExit}
          className="px-4 py-2 bg-[#555] hover:bg-[#666] border-2 border-[#777] text-[#ddd] font-bold transition-colors"
          style={{ imageRendering: 'pixelated' }}
        >
          ← EXIT TEST
        </button>
      </div>

      {/* Main Office Area */}
      <div className="flex-1 flex">
        {/* Left Side - NPC Doors */}
        <div className="w-48 bg-[#2d2d2d] border-r-2 border-[#1a1a1a] p-4 flex flex-col gap-3">
          <div className="text-xs text-[#888] mb-2">YOUR TEAM:</div>

          <button
            onClick={() => showNote(
              'VOLKOV (Bot-Farm Chief)',
              'PLACEHOLDER: Would open dialogue with Volkov. You can request bot campaigns, discuss capacity, or hear his cynical commentary on the work.'
            )}
            className="w-full p-3 bg-[#4a4a4a] hover:bg-[#5a5a5a] border-2 border-[#666] text-left transition-colors"
          >
            <div className="text-xs text-[#888]">TECH</div>
            <div className="font-bold">🤖 VOLKOV</div>
            <div className="text-xs text-[#4a9eff]">Available</div>
          </button>

          <button
            onClick={() => showNote(
              'CHEN (Media Buyer)',
              'PLACEHOLDER: Would show Chen\'s interface. Purchase ad placements, target demographics, manage budget allocation.'
            )}
            className="w-full p-3 bg-[#4a4a4a] hover:bg-[#5a5a5a] border-2 border-[#666] text-left transition-colors"
          >
            <div className="text-xs text-[#888]">MEDIA</div>
            <div className="font-bold">📺 CHEN</div>
            <div className="text-xs text-[#4a9eff]">Available</div>
          </button>

          <button
            onClick={() => showNote(
              'KESSLER (Intel)',
              'PLACEHOLDER: Would show intelligence reports. Network analysis, trending topics, defensive actor movements.'
            )}
            className="w-full p-3 bg-[#4a4a4a] hover:bg-[#5a5a5a] border-2 border-[#666] text-left transition-colors"
          >
            <div className="text-xs text-[#888]">INTEL</div>
            <div className="font-bold">🔍 KESSLER</div>
            <div className="text-xs text-[#4a9eff]">Available</div>
          </button>

          <div className="flex-1" />

          <div className="p-3 bg-[#3a3a3a] border-2 border-[#555]">
            <div className="text-xs text-[#888] mb-2">RESOURCES:</div>
            <div className="text-xs space-y-1">
              <div>💰 <span className="text-[#ffaa00]">$50,000</span></div>
              <div>🏗️ <span className="text-[#4a9eff]">INFRA: 3</span></div>
              <div>👁️ <span className="text-[#ff5555]">HEAT: 5%</span></div>
            </div>
          </div>
        </div>

        {/* Center - Desk/Workspace */}
        <div className="flex-1 flex flex-col">
          {/* Desk Surface */}
          <div className="flex-1 bg-[#4a4a4a] p-8 relative">
            {/* Inbox */}
            <div className="absolute top-8 left-8 w-96 bg-[#2d2d2d] border-4 border-[#1a1a1a] shadow-2xl">
              <div className="bg-[#3d3d3d] border-b-2 border-[#1a1a1a] p-2 font-bold text-sm flex justify-between items-center">
                <span>📬 INBOX (3 new)</span>
                <span className="text-xs text-[#888]">PRIORITY: HIGH</span>
              </div>
              <div className="p-4 space-y-3">
                <button
                  onClick={() => showNote(
                    'EMAIL: Urgent - First Orders',
                    'PLACEHOLDER: Would display full email content with choices.\n\n' +
                    'FROM: Director\n' +
                    'SUBJECT: Your first day - choose your campaign focus\n\n' +
                    'You would see the full email text here with 2-3 choice buttons below:\n' +
                    '→ Focus on domestic targets (costs 2 AP)\n' +
                    '→ Focus on international audience (costs 3 AP)\n' +
                    '→ Request more intel first (costs 1 AP)'
                  )}
                  className="w-full p-3 bg-[#3a3a3a] hover:bg-[#4a4a4a] border-2 border-[#555] text-left transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm">📧 First Orders</span>
                    <span className="text-xs text-[#ff5555]">URGENT</span>
                  </div>
                  <div className="text-xs text-[#888]">From: DIRECTOR</div>
                  <div className="text-xs text-[#aaa] mt-1">Choose your campaign focus...</div>
                </button>

                <button
                  onClick={() => showNote(
                    'EMAIL: Budget Allocation',
                    'PLACEHOLDER: Would show budget allocation interface.\n\n' +
                    'FROM: Finance\n' +
                    'SUBJECT: Initial budget - $50,000 available\n\n' +
                    'Allocate your starting budget across:\n' +
                    '→ Bot infrastructure (improves reach)\n' +
                    '→ Content creation (improves quality)\n' +
                    '→ Ad buys (immediate impact)\n' +
                    '→ Save for later\n\n' +
                    'Each choice would have different strategic implications.'
                  )}
                  className="w-full p-3 bg-[#3a3a3a] hover:bg-[#4a4a4a] border-2 border-[#555] text-left transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm">💰 Budget</span>
                    <span className="text-xs text-[#ffaa00]">PENDING</span>
                  </div>
                  <div className="text-xs text-[#888]">From: FINANCE</div>
                  <div className="text-xs text-[#aaa] mt-1">$50,000 to allocate...</div>
                </button>

                <button
                  onClick={() => showNote(
                    'EMAIL: Target Network Analysis',
                    'PLACEHOLDER: Would show network visualization mini-map.\n\n' +
                    'FROM: Kessler (Intel)\n' +
                    'SUBJECT: Initial network scan complete\n\n' +
                    'Would display:\n' +
                    '→ Mini-map of target network (like Pro Mode but in Papers Please style)\n' +
                    '→ Key nodes highlighted\n' +
                    '→ Vulnerability assessment\n' +
                    '→ Recommended first targets\n\n' +
                    'This bridges Story Mode with the Pro Mode network view.'
                  )}
                  className="w-full p-3 bg-[#3a3a3a] hover:bg-[#4a4a4a] border-2 border-[#555] text-left transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm">🗺️ Network</span>
                    <span className="text-xs text-[#4a9eff]">INFO</span>
                  </div>
                  <div className="text-xs text-[#888]">From: KESSLER</div>
                  <div className="text-xs text-[#aaa] mt-1">Target analysis ready...</div>
                </button>
              </div>
            </div>

            {/* Campaign Board (right side) */}
            <div className="absolute top-8 right-8 w-80 bg-[#2d2d2d] border-4 border-[#1a1a1a] shadow-2xl">
              <div className="bg-[#3d3d3d] border-b-2 border-[#1a1a1a] p-2 font-bold text-sm">
                📊 ACTIVE CAMPAIGNS
              </div>
              <div className="p-4">
                <div className="text-center text-[#888] text-sm py-8">
                  No campaigns running yet.
                  <br />
                  <br />
                  Check your inbox to start.
                </div>
                <button
                  onClick={() => showNote(
                    'Campaign System',
                    'PLACEHOLDER: This area would show your active campaigns.\n\n' +
                    'Each campaign would display:\n' +
                    '→ Campaign name and type\n' +
                    '→ Target audience\n' +
                    '→ Current reach/engagement\n' +
                    '→ Budget spent\n' +
                    '→ Time remaining\n\n' +
                    'You could click to see details, pause, or modify campaigns.\n\n' +
                    'Campaigns run automatically between days, like in Papers Please how time progresses.'
                  )}
                  className="w-full p-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] border-2 border-[#555] text-xs transition-colors"
                >
                  ℹ️ How campaigns work
                </button>
              </div>
            </div>

            {/* Desk Items (bottom) */}
            <div className="absolute bottom-8 left-8 right-8 flex gap-4 justify-center">
              <button
                onClick={() => showNote(
                  'Calendar',
                  'PLACEHOLDER: Would show the mission calendar.\n\n' +
                  'Day 1 of 30-day campaign.\n\n' +
                  '→ View upcoming events\n' +
                  '→ See deadlines\n' +
                  '→ Track milestones\n' +
                  '→ End day when ready (time pressure mechanic)'
                )}
                className="p-4 bg-[#2d2d2d] hover:bg-[#3d3d3d] border-2 border-[#555] transition-colors"
              >
                <div className="text-2xl">📅</div>
                <div className="text-xs mt-1">Calendar</div>
              </button>

              <button
                onClick={() => showNote(
                  'Reports',
                  'PLACEHOLDER: Would show analytics and reports.\n\n' +
                  '→ Campaign performance\n' +
                  '→ Network changes (trust metrics)\n' +
                  '→ Resource usage\n' +
                  '→ Risk assessment\n\n' +
                  'This is the "under the hood" view - connects to the game engine.'
                )}
                className="p-4 bg-[#2d2d2d] hover:bg-[#3d3d3d] border-2 border-[#555] transition-colors"
              >
                <div className="text-2xl">📈</div>
                <div className="text-xs mt-1">Reports</div>
              </button>

              <button
                onClick={() => showNote(
                  'Manual',
                  'PLACEHOLDER: Would show the in-game manual/encyclopedia.\n\n' +
                  '→ Technique glossary\n' +
                  '→ How systems work\n' +
                  '→ NPC bios\n' +
                  '→ Tutorial reference\n\n' +
                  'Like Papers Please rulebook - you can reference it anytime.'
                )}
                className="p-4 bg-[#2d2d2d] hover:bg-[#3d3d3d] border-2 border-[#555] transition-colors"
              >
                <div className="text-2xl">📖</div>
                <div className="text-xs mt-1">Manual</div>
              </button>
            </div>
          </div>

          {/* Bottom Status Bar */}
          <div className="bg-[#2d2d2d] border-t-2 border-[#1a1a1a] p-3 text-xs text-[#888]">
            <div className="flex justify-between items-center">
              <div>
                💡 TIP: Start by reading your emails. Each action costs Action Points.
              </div>
              <button
                onClick={() => showNote(
                  'End Day',
                  'PLACEHOLDER: Would end the current day.\n\n' +
                  'When you click "End Day":\n' +
                  '→ Campaigns run automatically\n' +
                  '→ Network effects propagate\n' +
                  '→ Random events may occur\n' +
                  '→ Resources regenerate\n' +
                  '→ New emails arrive\n\n' +
                  'Time pressure: You have limited Action Points per day.\n' +
                  'Choose wisely what to do each day.'
                )}
                className="px-4 py-1 bg-[#4a9eff] hover:bg-[#5aafff] text-[#1a1a1a] font-bold border-2 border-[#3a8eef] transition-colors"
              >
                END DAY →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Note/Description Modal */}
      {selectedInteraction && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-8 z-50">
          <div className="bg-[#2d2d2d] border-4 border-[#1a1a1a] max-w-2xl w-full shadow-2xl">
            <div className="bg-[#3d3d3d] border-b-2 border-[#1a1a1a] p-3 font-bold flex justify-between items-center">
              <span>{selectedInteraction.title}</span>
              <button
                onClick={closeNote}
                className="px-3 py-1 bg-[#555] hover:bg-[#666] border-2 border-[#777] text-sm transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="text-sm text-[#d4d4d4] whitespace-pre-wrap leading-relaxed">
                {selectedInteraction.description}
              </div>
              <div className="mt-6 pt-4 border-t-2 border-[#3a3a3a]">
                <button
                  onClick={closeNote}
                  className="px-6 py-2 bg-[#4a9eff] hover:bg-[#5aafff] text-[#1a1a1a] font-bold border-2 border-[#3a8eef] transition-colors"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
