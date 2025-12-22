/**
 * OfficeScreen - Main Hub for Story Mode
 *
 * This is the player's office where they interact with emails, NPCs, and objects.
 * Fully integrated with Story Mode state and game engine.
 */

import { useState } from 'react';
import { StoryModeColors } from './theme';
import { useStoryModeState } from './useStoryModeState';
import {
  InboxScreen,
  EmailModal,
  NPCDialog,
  TargetingScreen,
  DaySummary,
  AnalyticsDashboard,
  NewsFeed,
  MissionBriefing,
} from './components';
import { day1Emails } from './data/day1-emails';
import { day2Emails } from './data/day2-emails';
import { npcs } from './data/npcs';

interface OfficeScreenProps {
  onExit: () => void;
}

type HoverArea = 'computer' | 'phone' | 'smartphone' | 'tv' | 'door' | 'folder' | 'notification' | null;
type OfficeAuxScreen = 'analytics' | 'newsfeed' | 'briefing' | null;

export function OfficeScreen({ onExit }: OfficeScreenProps) {
  const [hoverArea, setHoverArea] = useState<HoverArea>(null);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [auxScreen, setAuxScreen] = useState<OfficeAuxScreen>(null);

  // Combine all emails from all days
  const allEmails = [...day1Emails, ...day2Emails];

  // Story Mode State Hook (integrates with game engine)
  const storyMode = useStoryModeState(allEmails, npcs);

  // Polygon coordinates for clickable areas (from user's manual adjustment)
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
    switch (id) {
      case 'tv':
        return StoryModeColors.agencyBlue;
      case 'computer':
      case 'notification':
        return StoryModeColors.sovietRed;
      case 'phone':
        return StoryModeColors.warning;
      case 'smartphone':
        return StoryModeColors.danger;
      case 'door':
        return StoryModeColors.militaryOlive;
      case 'folder':
        return StoryModeColors.sovietRed;
      default:
        return 'transparent';
    }
  };

  const handlePolygonClick = (id: HoverArea) => {
    switch (id) {
      case 'computer':
      case 'notification':
        // Open inbox
        storyMode.goToLocation('inbox');
        break;

      case 'phone':
        // Show NPC selection (for now, just open Volkov if available)
        const availableNPCs = storyMode.getAvailableNPCs();
        if (availableNPCs.length > 0) {
          storyMode.talkToNPC(availableNPCs[0].id);
        }
        break;

      case 'door':
        // Future: Show event NPCs
        break;

      case 'tv':
        // Show analytics dashboard
        setAuxScreen('analytics');
        break;

      case 'smartphone':
        // Show news feed
        setAuxScreen('newsfeed');
        break;

      case 'folder':
        // Show mission briefing
        setAuxScreen('briefing');
        break;
    }
  };

  // Get current email object if one is selected
  const selectedEmailObject = currentEmail
    ? allEmails.find((e) => e.id === currentEmail)
    : null;

  // Render different screens based on location
  if (storyMode.storyState.currentLocation === 'inbox') {
    const availableEmails = storyMode.getAvailableEmails();

    if (currentEmail && selectedEmailObject) {
      // Show email modal
      return (
        <EmailModal
          email={selectedEmailObject}
          onChoose={(choiceId) => {
            storyMode.makeEmailChoice(currentEmail, choiceId);
            setCurrentEmail(null);
          }}
          onClose={() => {
            setCurrentEmail(null);
            storyMode.goToOffice();
          }}
          canAfford={storyMode.canAfford}
        />
      );
    }

    // Show inbox screen
    return (
      <InboxScreen
        emails={availableEmails}
        onSelectEmail={(emailId) => setCurrentEmail(emailId)}
        onClose={() => storyMode.goToOffice()}
      />
    );
  }

  // Show NPC Dialog
  if (storyMode.storyState.currentLocation.startsWith('npc-')) {
    const npcId = storyMode.storyState.currentLocation.replace('npc-', '');
    const npc = npcs.find((n) => n.id === npcId);
    const dialog = storyMode.getCurrentNPCDialog();

    if (npc) {
      return (
        <NPCDialog
          npc={npc}
          dialog={dialog}
          relationship={storyMode.getRelationship(npcId)}
          onChooseOption={(optionId) => storyMode.chooseDialogOption(optionId)}
          onClose={() => storyMode.goToOffice()}
        />
      );
    }
  }

  // Show Targeting Screen
  if (storyMode.targetingMode) {
    return (
      <TargetingScreen
        targetingMode={storyMode.targetingMode}
        onSelectTarget={(actorId) => storyMode.selectTarget(actorId)}
        onCancel={() => storyMode.cancelTargeting()}
      />
    );
  }

  // Show Day Summary
  if (storyMode.storyState.currentLocation === 'day-summary') {
    const summary = storyMode.getDaySummary();
    if (summary) {
      return (
        <DaySummary
          summary={summary}
          onContinue={() => storyMode.advanceToNextDay()}
        />
      );
    }
  }

  // Show Analytics Dashboard
  if (auxScreen === 'analytics') {
    return (
      <AnalyticsDashboard
        storyState={storyMode.storyState}
        networkMetrics={storyMode.networkMetrics}
        onClose={() => setAuxScreen(null)}
      />
    );
  }

  // Show News Feed
  if (auxScreen === 'newsfeed') {
    return (
      <NewsFeed
        storyState={storyMode.storyState}
        onClose={() => setAuxScreen(null)}
      />
    );
  }

  // Show Mission Briefing
  if (auxScreen === 'briefing') {
    return (
      <MissionBriefing
        storyState={storyMode.storyState}
        onClose={() => setAuxScreen(null)}
      />
    );
  }

  // Main Office View
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
            <span style={{ color: StoryModeColors.textSecondary }}>DAY:</span>{' '}
            <span style={{ color: StoryModeColors.sovietRed }}>{storyMode.storyState.currentDay.toString().padStart(2, '0')}</span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.textSecondary }}>TIME:</span>{' '}
            <span style={{ color: StoryModeColors.document }}>08:00</span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.textSecondary }}>AP:</span>{' '}
            <span style={{ color: StoryModeColors.warning }}>
              {storyMode.storyState.actionsToday}/{storyMode.storyState.maxActionsPerDay}
            </span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.textSecondary }}>💰</span>{' '}
            <span style={{ color: StoryModeColors.warning }}>${storyMode.storyState.resources.money}K</span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.textSecondary }}>🏭</span>{' '}
            <span style={{ color: StoryModeColors.agencyBlue }}>INFRA:{storyMode.storyState.resources.infrastructure}</span>
          </div>
          <div>
            <span style={{ color: StoryModeColors.textSecondary }}>👁️</span>{' '}
            <span style={{ color: StoryModeColors.danger }}>HEAT:{storyMode.storyState.resources.attention}%</span>
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
            background: `linear-gradient(135deg, ${StoryModeColors.darkConcrete} 0%, ${StoryModeColors.concrete} 50%, ${StoryModeColors.darkConcrete} 100%)`,
          }}
        />

        {/* Pulsing Notification Badge (if unread emails) */}
        {storyMode.storyState.unreadEmails > 0 && (
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
                filter: `drop-shadow(0 0 8px ${StoryModeColors.sovietRed})`,
              }}
            />
          </svg>
        )}

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
                filter: hoverArea === 'tv' ? `drop-shadow(0 0 12px ${StoryModeColors.agencyBlue})` : 'none',
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
                filter: hoverArea === 'computer' ? `drop-shadow(0 0 12px ${StoryModeColors.sovietRed})` : 'none',
              }}
              onMouseEnter={() => setHoverArea('computer')}
              onMouseLeave={() => setHoverArea(null)}
              onClick={() => handlePolygonClick('computer')}
            />

            {/* Notification Badge - Clickable */}
            {storyMode.storyState.unreadEmails > 0 && (
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
            )}

            {/* Telephone */}
            <polygon
              points={polygons.phone}
              fill={hoverArea === 'phone' ? 'rgba(212, 160, 23, 0.25)' : 'transparent'}
              stroke={hoverArea === 'phone' ? StoryModeColors.warning : 'transparent'}
              strokeWidth="4"
              className="cursor-pointer transition-all"
              style={{
                filter: hoverArea === 'phone' ? `drop-shadow(0 0 12px ${StoryModeColors.warning})` : 'none',
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
                filter: hoverArea === 'smartphone' ? `drop-shadow(0 0 12px ${StoryModeColors.danger})` : 'none',
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
                filter: hoverArea === 'door' ? `drop-shadow(0 0 12px ${StoryModeColors.militaryOlive})` : 'none',
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
                filter: hoverArea === 'folder' ? `drop-shadow(0 0 12px ${StoryModeColors.sovietRed})` : 'none',
              }}
              onMouseEnter={() => setHoverArea('folder')}
              onMouseLeave={() => setHoverArea(null)}
              onClick={() => handlePolygonClick('folder')}
            />
          </g>
        </svg>

        {/* Hover Hint */}
        {hoverArea && (
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 border-4 font-bold text-xs z-20"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              borderColor: getPolygonColor(hoverArea),
              color: getPolygonColor(hoverArea),
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
            }}
          >
            {hoverArea === 'computer' && `📧 INBOX (${storyMode.storyState.unreadEmails} unread)`}
            {hoverArea === 'notification' && '🔴 NEUE NACHRICHT'}
            {hoverArea === 'phone' && '☎️ TEAM KONTAKTE'}
            {hoverArea === 'tv' && '📺 ANALYTICS'}
            {hoverArea === 'smartphone' && '📱 NEWS FEED'}
            {hoverArea === 'door' && '🚪 EVENTS'}
            {hoverArea === 'folder' && '📕 MISSION BRIEFING'}
          </div>
        )}
      </div>

      {/* Footer - End Day Button */}
      {storyMode.canEndDay() && (
        <div
          className="p-3 border-t-4 flex justify-center z-20 relative"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
          }}
        >
          <button
            onClick={() => storyMode.endDay()}
            className="px-8 py-3 font-bold border-4 transition-all hover:translate-y-1"
            style={{
              backgroundColor: StoryModeColors.sovietRed,
              borderColor: StoryModeColors.border,
              color: '#FFFFFF',
              boxShadow: '0px 4px 0px 0px rgba(0,0,0,0.8)',
            }}
          >
            ⏰ TAG BEENDEN →
          </button>
        </div>
      )}
    </div>
  );
}
