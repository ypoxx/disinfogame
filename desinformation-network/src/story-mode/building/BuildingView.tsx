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
import { useCallback, useEffect, useRef } from 'react';
import { BuildingStage, type StageNpc } from './BuildingStage';
import { useNavigator } from './useNavigator';
import { roomById } from './buildingLayout';

interface BuildingViewProps {
  npcs: StageNpc[];
  /** Ankunft an einem NPC-Raum (öffnet den Dialog). */
  onRoomClick: (npcId: string) => void;
  /** Ankunft am Spielerbüro (öffnet die Büro-Ansicht). */
  onEnterOffice?: () => void;
  /** Ankunft an einem begehbaren Spezial-Raum ohne NPC (Newsroom, Analyse …). */
  onEnterRoom?: (roomId: string) => void;
  /** K1-Heimweg: Avatar geht sichtbar zur Lobby, dann feuert onArrivedHome. */
  walkHome?: boolean;
  onArrivedHome?: () => void;
}

export function BuildingView({ npcs, onRoomClick, onEnterOffice, onEnterRoom, walkHome = false, onArrivedHome }: BuildingViewProps) {
  const nav = useNavigator();

  // Heimweg-Ritual (Redaktionsschluss): einmalig zur Lobby laufen.
  const walkingHomeRef = useRef(false);
  useEffect(() => {
    if (walkHome && !walkingHomeRef.current) {
      walkingHomeRef.current = true;
      nav.goTo('lobby', () => {
        walkingHomeRef.current = false;
        onArrivedHome?.();
      });
    }
    if (!walkHome) walkingHomeRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walkHome]);

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
        } else {
          onEnterRoom?.(arrivedId);
        }
      });
    },
    [nav, onRoomClick, onEnterOffice, onEnterRoom]
  );

  return (
    <div className="h-full w-full" data-testid="building-view">
      <BuildingStage npcs={npcs} nav={nav} onRoomClick={handleRoomClick} />
    </div>
  );
}

export default BuildingView;
