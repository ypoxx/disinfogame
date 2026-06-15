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
import { useCallback, useEffect, useRef, useState } from 'react';
import { BuildingStage, type StageNpc } from './BuildingStage';
import { FloorDirectory } from './FloorDirectory';
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
  /** Aktueller Monat für die Jahreszeiten-Stimmung. */
  month?: number;
  /** Interaktion gesperrt (z. B. während ein Dialog läuft): kein Etagen-Tableau. */
  locked?: boolean;
  /** Strang 5: Stimmungs-Hinweis des Pförtners (Lobby). */
  pfoertnerLine?: string;
  /** P7/§14.4: Entdeckungsdruck (0–100) für den Reißwolf-Kommentar. */
  risk?: number;
  /** P7/§14.4: moralische Last (welke/grüne Pflanze). */
  moralWeight?: number;
  /** P7/§14.4: Aufmerksamkeit (Kaffeeküchen-Wirtschaftslage). */
  attention?: number;
  /** P7/§14.4: aktiver Auftrag (Volksbrause-Etikett). */
  auftragId?: string;
}

export function BuildingView({ npcs, onRoomClick, onEnterOffice, onEnterRoom, walkHome = false, onArrivedHome, month, locked = false, pfoertnerLine, risk, moralWeight, attention, auftragId }: BuildingViewProps) {
  const nav = useNavigator();
  const [directoryOpen, setDirectoryOpen] = useState(false);

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

  // Tastatur-Einstieg ins Etagen-Tableau (E33): Taste F — nur wenn nicht gesperrt
  // (kein Dialog) und nicht in einem Textfeld.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 'f' && !locked && !directoryOpen) {
        e.preventDefault();
        setDirectoryOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [locked, directoryOpen]);

  // Sperrt der Dialog die Interaktion, schließt sich ein offenes Tableau.
  useEffect(() => {
    if (locked && directoryOpen) setDirectoryOpen(false);
  }, [locked, directoryOpen]);

  return (
    <div className="h-full w-full" data-testid="building-view">
      <BuildingStage
        npcs={npcs}
        nav={nav}
        onRoomClick={handleRoomClick}
        onOpenDirectory={locked ? undefined : () => setDirectoryOpen(true)}
        month={month}
        pfoertnerLine={pfoertnerLine}
        risk={risk}
        moralWeight={moralWeight}
        attention={attention}
        auftragId={auftragId}
      />
      {directoryOpen && (
        <FloorDirectory
          npcs={npcs}
          currentFloorLevel={Math.round(nav.pos.floorLevel)}
          onSelect={(roomId) => handleRoomClick(roomId)}
          onClose={() => setDirectoryOpen(false)}
        />
      )}
    </div>
  );
}

export default BuildingView;
