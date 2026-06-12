/**
 * BuildingView — spielbare Gebäude-Ansicht (MadTV-Prinzip).
 *
 * Dünner Wrapper: BuildingStage (Pixel-Querschnitt) + useNavigator (Avatar).
 * Klick auf einen Raum schickt den Avatar dorthin (laufen/Fahrstuhl/Tür);
 * bei Ankunft öffnet sich der NPC-Dialog bzw. das Spielerbüro.
 *
 * Das frühere CSS-Skelett (Track A-1) liegt unter
 * archive/story-mode-drafts/ — Konzept: docs/PLAYER_ENTRY_AND_BUILDING_PLAN.md.
 */
import { useCallback } from 'react';
import { BuildingStage, type StageNpc } from './BuildingStage';
import { useNavigator } from './useNavigator';
import { roomById } from './buildingLayout';

interface BuildingViewProps {
  npcs: StageNpc[];
  /** Ankunft an einem NPC-Raum (öffnet den Dialog). */
  onRoomClick: (npcId: string) => void;
  /** Ankunft am Spielerbüro (öffnet die Büro-Ansicht). */
  onEnterOffice?: () => void;
}

export function BuildingView({ npcs, onRoomClick, onEnterOffice }: BuildingViewProps) {
  const nav = useNavigator();

  const handleRoomClick = useCallback(
    (roomId: string) => {
      const room = roomById(roomId);
      if (!room) return;
      nav.goTo(roomId, (arrivedId) => {
        const arrived = roomById(arrivedId);
        if (arrived?.npcId) {
          onRoomClick(arrived.npcId);
        } else if (arrivedId === 'spieler_buero') {
          onEnterOffice?.();
        }
      });
    },
    [nav, onRoomClick, onEnterOffice]
  );

  return (
    <div className="h-full w-full" data-testid="building-view">
      <BuildingStage npcs={npcs} nav={nav} onRoomClick={handleRoomClick} />
    </div>
  );
}

export default BuildingView;
