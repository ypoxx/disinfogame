import { useMemo } from 'react';
import { StoryModeColors } from './theme';
import type { StoryResources, StoryPhase, NewsEvent, Objective } from '../game-logic/StoryEngineAdapter';
import { NewsTV } from './components/NewsTV';
import { RoomRenderer } from './components/RoomRenderer';
import { getRoomById } from './config/building';

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

// ============================================
// ACTION → CALLBACK MAPPING
// Maps building.ts interactable actions to component callbacks
// ============================================

function useActionMap(props: OfficeScreenProps): Record<string, () => void> {
  return useMemo(
    () => ({
      open_actions: () => props.onOpenActions?.(),
      open_news: () => props.onOpenNews?.(),
      open_stats: () => props.onOpenStats?.(),
      open_npcs: () => props.onOpenNpcs?.(),
      open_mission: () => props.onOpenMission?.(),
      open_events: () => props.onOpenEvents?.(),
      exit_room: () => props.onExit(),
    }),
    [props.onOpenActions, props.onOpenNews, props.onOpenStats, props.onOpenNpcs, props.onOpenMission, props.onOpenEvents, props.onExit]
  );
}

// ============================================
// MAIN COMPONENT
// Now uses RoomRenderer with building.ts config
// Falls back to KI background image until pixel-art assets are available
// ============================================

export function OfficeScreen(props: OfficeScreenProps) {
  const {
    resources,
    newsEvents = [],
    unreadNewsCount = 0,
    worldEventCount = 0,
  } = props;

  const actionMap = useActionMap(props);
  const room = getRoomById('player_office');

  // Build badges map from props
  const badges = useMemo(
    () => ({
      computer: 1, // Always show notification on computer
      smartphone: unreadNewsCount,
      door: worldEventCount,
    }),
    [unreadNewsCount, worldEventCount]
  );

  // NewsTV as custom overlay for the 'tv' interactable
  const customOverlays = useMemo(
    () => ({
      tv: (
        <NewsTV
          isHovered={false} // RoomRenderer handles hover state
          resources={resources}
          newsEvents={newsEvents}
          onClick={() => actionMap.open_stats?.()}
          onMouseEnter={() => {}} // Handled by RoomRenderer
          onMouseLeave={() => {}}
        />
      ),
    }),
    [resources, newsEvents, actionMap]
  );

  if (!room) {
    return (
      <div className="h-full flex items-center justify-center" style={{ color: StoryModeColors.danger }}>
        Raum &quot;player_office&quot; nicht gefunden in building.ts
      </div>
    );
  }

  function handleInteract(action: string) {
    const handler = actionMap[action];
    if (handler) {
      handler();
    }
  }

  return (
    <div
      className="h-full flex flex-col font-mono text-sm relative overflow-hidden"
      style={{
        backgroundColor: StoryModeColors.background,
        color: StoryModeColors.textPrimary,
      }}
    >
      <div className="flex-1 relative">
        <RoomRenderer
          room={room}
          onInteract={handleInteract}
          fallbackImage="/office-brutalist-scene.jpg"
          badges={badges}
          customOverlays={customOverlays}
        />
      </div>
    </div>
  );
}

export default OfficeScreen;
