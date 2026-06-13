/**
 * NpcRoomView — Raum-Nahsicht beim Betreten (K6.5, MadTV-Prinzip).
 *
 * Vollbild-Innenraum (room_<id>) mit dem NPC GROSS im Bild (Porträt-Halbfigur,
 * Mimik folgt der Dialog-Stimmung) — kein Mini-Avatar im Raum. Die DialogBox
 * des Spiels legt sich darunter; diese Komponente ist reine Kulisse.
 */
import { getBuildingLayout } from './buildingLayout';
import { useAssets } from '../assets/useAssets';

export interface NpcRoomViewProps {
  npcId: string;
  mood?: 'neutral' | 'happy' | 'angry' | 'worried' | 'suspicious';
}

export function NpcRoomView({ npcId, mood = 'neutral' }: NpcRoomViewProps) {
  const assets = useAssets();
  const room = getBuildingLayout().rooms.find((r) => r.npcId === npcId);
  const bgUrl = room ? assets.imageUrl(`room_${room.id}`) : null;
  const portraitUrl =
    (mood !== 'neutral' ? assets.imageUrl(`portrait_${npcId}_${mood}`) : null) ??
    assets.imageUrl(`portrait_${npcId}`);

  return (
    <div
      className="absolute inset-0 z-20"
      style={{
        backgroundColor: '#101116',
        ...(bgUrl
          ? {
              backgroundImage: `url(${bgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center bottom',
              imageRendering: 'pixelated',
            }
          : {}),
      }}
      data-testid="npc-room-view"
      aria-hidden
    >
      {/* Lesbarkeits-Verlauf hinter der DialogBox */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '45%',
          background: 'linear-gradient(transparent, rgba(5,7,13,0.82))',
        }}
      />
      {/* NPC groß im Raum (Halbfigur rechts der Mitte) */}
      {portraitUrl && (
        <img
          src={portraitUrl}
          alt=""
          style={{
            position: 'absolute',
            right: '12%',
            bottom: '18%',
            height: '52%',
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.6))',
          }}
        />
      )}
    </div>
  );
}

export default NpcRoomView;
