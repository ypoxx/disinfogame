/**
 * BuildingStage — der Pixel-Querschnitt des Agentur-Gebäudes.
 *
 * Komponiert die Bühne aus building.json (via buildingLayout) und den
 * Baukasten-Assets (bld_*, room_*, elevator_cabin_*); Avatar, Kabine und
 * Türen kommen animiert vom Navigator. Jedes Bild hat einen CSS-Fallback —
 * ohne Manifest bleibt die Bühne ein dunkles Skelett, aber funktional.
 *
 * Kamera: Breite wird in den Container eingepasst, vertikal folgt die
 * Kamera weich der Etage des Avatars (CSS-Transition).
 * Konzept: docs/PLAYER_ENTRY_AND_BUILDING_PLAN.md §3.
 */
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { getBuildingLayout, STAGE, type RoomLayout } from './buildingLayout';
import type { NavigatorState } from './useNavigator';
import { StoryModeColors } from '../theme';
import { useAssets } from '../assets/useAssets';
import { useSprite } from '../assets/useSprite';

export interface StageNpc {
  id: string;
  name: string;
  morale: number;
  available: boolean;
  inCrisis?: boolean;
}

export interface BuildingStageProps {
  npcs: StageNpc[];
  nav: NavigatorState;
  /** Klick auf einen Raum (roomId). Fehlt der Handler, ist die Bühne passiv (Sequenz-Modus). */
  onRoomClick?: (roomId: string) => void;
  /** Raum-Interaktion sperren (z. B. während Ankunfts-Sequenz). */
  interactive?: boolean;
}

const layout = getBuildingLayout();

/** Globale Keyframes der Bühne (einmalig, Präfix bs-). */
const STAGE_KEYFRAMES = `
  @keyframes bs-blink { 0%,100%{opacity:1} 50%{opacity:.15} }
  @keyframes bs-flicker { 0%,100%{opacity:.85} 42%{opacity:.35} 50%{opacity:.75} 58%{opacity:.25} }
  @keyframes bs-glow { 0%,100%{box-shadow:0 0 6px 2px rgba(255,200,80,.25)} 50%{box-shadow:0 0 10px 3px rgba(255,200,80,.5)} }
  @keyframes bs-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
  @keyframes bs-smoke { 0%{transform:translateY(0);opacity:.35} 100%{transform:translateY(-26px);opacity:0} }
`;

function moraleColor(morale: number): string {
  if (morale < 30) return StoryModeColors.danger;
  if (morale < 60) return StoryModeColors.warning;
  return StoryModeColors.success;
}

/** Animiertes Sprite (Sheet ×2 skaliert) mit Emoji-Fallback. */
function PixelSprite({
  sheetId,
  animation,
  fallback,
  flip = false,
  title,
}: {
  sheetId: string;
  animation: string;
  fallback: ReactNode;
  flip?: boolean;
  title?: string;
}) {
  const assets = useAssets();
  const sprite = useSprite(assets.sheet(sheetId), animation);
  if (!sprite) {
    return (
      <span style={{ fontSize: 28, animation: 'bs-bob 2.6s ease-in-out infinite' }} title={title}>
        {fallback}
      </span>
    );
  }
  return (
    <span
      style={{
        ...sprite.style,
        imageRendering: 'pixelated',
        transform: `scale(2) ${flip ? 'scaleX(-1)' : ''}`,
        transformOrigin: 'bottom center',
      }}
      title={title}
      aria-label={title}
    />
  );
}

/** Tür eines Raums (offen/zu) — Bild-Asset oder CSS-Fallback. */
function RoomDoor({ room, open }: { room: RoomLayout; open: boolean }) {
  const assets = useAssets();
  const url = assets.imageUrl(open ? 'bld_door_open' : 'bld_door_closed');
  const style: CSSProperties = {
    position: 'absolute',
    left: room.doorX - STAGE.doorWidth / 2,
    top: room.y + room.h - STAGE.doorHeight,
    width: STAGE.doorWidth,
    height: STAGE.doorHeight,
    pointerEvents: 'none',
    zIndex: 4,
  };
  if (url) {
    return <img src={url} alt="" style={{ ...style, imageRendering: 'pixelated', objectFit: 'contain' }} />;
  }
  return (
    <div
      style={{
        ...style,
        backgroundColor: open ? '#3b2a17' : '#241a0f',
        border: '3px solid #111',
        boxSizing: 'border-box',
      }}
    />
  );
}

export function BuildingStage({ npcs, nav, onRoomClick, interactive = true }: BuildingStageProps) {
  const assets = useAssets();
  const npcById = new Map(npcs.map((n) => [n.id, n]));
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ scale: 1, h: 600 });
  const [hoverRoom, setHoverRoom] = useState<string | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () =>
      setView({ scale: Math.max(0.2, el.clientWidth / layout.width), h: el.clientHeight });
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Kamera: Etage des Avatars vertikal zentrieren (geklemmt auf Gebäudegrenzen).
  const avatarFloor = layout.floors.find((f) => f.level === Math.round(nav.pos.floorLevel));
  const focusY = (avatarFloor ? avatarFloor.y + STAGE.floorHeight / 2 : layout.height / 2) * view.scale;
  const stageH = layout.height * view.scale;
  const cameraY = Math.max(0, Math.min(stageH - view.h, focusY - view.h / 2));

  const pillarUrl = assets.imageUrl('bld_facade_pillar');
  const slabUrl = assets.imageUrl('bld_floor_slab');
  const shaftUrl = assets.imageUrl('bld_shaft');
  const roofUrl = assets.imageUrl('bld_roof');
  const cabinUrl = assets.imageUrl(nav.cabinDoorsOpen ? 'elevator_cabin_open' : 'elevator_cabin_closed');

  const cabinH = 200;
  const cabinW = 150;
  // Kabinen-y aus dem (ggf. gebrochenen) Level interpolieren — Levels sind fortlaufend, oberste Etage zuerst.
  const topFloor = layout.floors[0];
  const cabinTopY = topFloor.y + (topFloor.level - nav.cabinLevel) * (STAGE.floorHeight + STAGE.slabHeight);

  const avatarFloorLayout = layout.floors.find((f) => f.level === nav.pos.floorLevel) ?? avatarFloor;
  const avatarY = nav.avatarInCabin
    ? cabinTopY + STAGE.floorHeight - STAGE.avatarSize - 10
    : (avatarFloorLayout?.walkY ?? 0);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: 'linear-gradient(#05070d 0%, #0a0f1c 55%, #11131c 100%)' }}
      data-testid="building-stage"
    >
      <style>{STAGE_KEYFRAMES}</style>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: layout.width,
          height: layout.height,
          transform: `translateX(-50%) scale(${view.scale}) translateY(${-cameraY / view.scale}px)`,
          transformOrigin: 'top center',
          transition: 'transform 700ms ease-in-out',
        }}
      >
        {/* Dach mit Antenne */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: layout.width, height: STAGE.roofHeight }}>
          {roofUrl ? (
            <img
              src={roofUrl}
              alt=""
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '160%',
                objectFit: 'cover',
                objectPosition: 'bottom',
                imageRendering: 'pixelated',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 40,
                backgroundColor: '#23242a',
                borderTop: '4px solid #2e3038',
              }}
            />
          )}
          {/* Antennen-Warnlicht (Mikro-Animation, sitzt auf dem Dachbild) */}
          <span
            style={{
              position: 'absolute',
              left: '47.5%',
              top: roofUrl ? 8 : -8,
              width: 8,
              height: 8,
              borderRadius: 8,
              backgroundColor: StoryModeColors.danger,
              animation: 'bs-blink 1.8s ease-in-out infinite',
            }}
          />
        </div>

        {/* Fassaden-Pfeiler links/rechts */}
        {[0, layout.width - STAGE.pillarWidth].map((x) => (
          <div
            key={x}
            style={{
              position: 'absolute',
              left: x,
              top: STAGE.roofHeight,
              width: STAGE.pillarWidth,
              height: layout.height - STAGE.roofHeight,
              backgroundColor: '#1d1e24',
              ...(pillarUrl
                ? {
                    backgroundImage: `url(${pillarUrl})`,
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: `${STAGE.pillarWidth}px auto`,
                    imageRendering: 'pixelated',
                  }
                : {}),
            }}
          />
        ))}

        {/* Etagen */}
        {layout.floors.map((floor) => (
          <div key={floor.id}>
            {/* Decken-Platte über der Etage */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: floor.y - STAGE.slabHeight,
                width: layout.width,
                height: STAGE.slabHeight,
                backgroundColor: '#23242c',
                ...(slabUrl
                  ? {
                      backgroundImage: `url(${slabUrl})`,
                      backgroundRepeat: 'repeat-x',
                      backgroundSize: `auto ${STAGE.slabHeight}px`,
                      imageRendering: 'pixelated',
                    }
                  : {}),
                zIndex: 3,
              }}
            />
            {/* Etagen-Schild */}
            <div
              style={{
                position: 'absolute',
                left: STAGE.pillarWidth + 6,
                top: floor.y + 6,
                padding: '2px 6px',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                color: '#c8c8b8',
                backgroundColor: 'rgba(10,10,14,0.72)',
                border: '1px solid #34353d',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            >
              {floor.label_de}
            </div>
          </div>
        ))}

        {/* Räume */}
        {layout.rooms.map((room) => {
          const npc = room.npcId ? npcById.get(room.npcId) : undefined;
          const clickable = interactive && !!onRoomClick && (room.npcId ? (npc?.available ?? true) : true);
          const bgUrl = assets.imageUrl(`room_${room.id}`);
          const hovered = hoverRoom === room.id;
          const isTarget = nav.targetRoomId === room.id;
          return (
            <button
              key={room.id}
              onClick={() => clickable && onRoomClick?.(room.id)}
              onMouseEnter={() => setHoverRoom(room.id)}
              onMouseLeave={() => setHoverRoom((h) => (h === room.id ? null : h))}
              disabled={!clickable}
              title={room.npcId ? `${room.label_de} — ${npc?.name ?? ''}` : room.label_de}
              style={{
                position: 'absolute',
                left: room.x,
                top: room.y,
                width: room.w,
                height: room.h,
                padding: 0,
                textAlign: 'left',
                backgroundColor: '#15161c',
                ...(bgUrl
                  ? {
                      backgroundImage: `linear-gradient(rgba(8,8,12,${hovered ? 0.08 : 0.28}), rgba(8,8,12,${hovered ? 0.18 : 0.42})), url(${bgUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center bottom',
                      imageRendering: 'pixelated',
                    }
                  : {}),
                border: `3px solid ${npc?.inCrisis ? StoryModeColors.danger : hovered || isTarget ? StoryModeColors.warning : '#2c2d35'}`,
                boxSizing: 'border-box',
                cursor: clickable ? 'pointer' : 'default',
                transition: 'border-color 160ms ease',
                zIndex: 2,
              }}
            >
              {/* Raum-Schild */}
              <span
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '2px 8px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#e8e4d8',
                  backgroundColor: 'rgba(10,10,14,0.78)',
                  border: '1px solid #3a3b43',
                }}
              >
                <span aria-hidden>{room.icon}</span> {room.label_de}
                {npc?.inCrisis && (
                  <span style={{ color: '#fff', backgroundColor: StoryModeColors.danger, padding: '0 4px', fontSize: 10 }}>
                    KRISE
                  </span>
                )}
              </span>

              {/* NPC-Figur + Moral */}
              {room.npcId && (
                <span
                  style={{
                    position: 'absolute',
                    left: 56,
                    bottom: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    opacity: npc?.available === false ? 0.35 : 1,
                  }}
                >
                  <PixelSprite sheetId={`figure_${room.npcId}`} animation="idle" fallback="🧍" title={npc?.name} />
                  <span style={{ width: 44, height: 4, backgroundColor: '#222' }}>
                    <span
                      style={{
                        display: 'block',
                        width: `${Math.max(0, Math.min(100, npc?.morale ?? 0))}%`,
                        height: '100%',
                        backgroundColor: moraleColor(npc?.morale ?? 0),
                      }}
                    />
                  </span>
                </span>
              )}

              {/* Ambiente-Mikroanimationen je Raum */}
              {room.id === 'medien_zentrum' && (
                <span
                  style={{
                    position: 'absolute',
                    left: 10,
                    bottom: 10,
                    fontSize: 11,
                    fontWeight: 700,
                    color: StoryModeColors.danger,
                    animation: 'bs-blink 1.4s ease-in-out infinite',
                  }}
                >
                  ● ON AIR
                </span>
              )}
              {room.id === 'cyber_lab' && (
                <span
                  style={{
                    position: 'absolute',
                    left: 12,
                    bottom: 12,
                    width: 26,
                    height: 16,
                    backgroundColor: '#15391c',
                    border: '1px solid #2c6b38',
                    animation: 'bs-flicker 1.3s steps(2) infinite',
                  }}
                />
              )}
              {room.id === 'finanzen' && (
                <span
                  style={{
                    position: 'absolute',
                    left: 14,
                    bottom: 14,
                    width: 10,
                    height: 10,
                    borderRadius: 10,
                    backgroundColor: '#ffd479',
                    animation: 'bs-glow 2.8s ease-in-out infinite',
                  }}
                />
              )}
            </button>
          );
        })}

        {/* Türen (über den Räumen, unter dem Avatar) */}
        {layout.rooms.map((room) => (
          <RoomDoor key={`door-${room.id}`} room={room} open={nav.openDoorRoomId === room.id} />
        ))}

        {/* Fahrstuhl-Schacht + Kabine */}
        <div
          style={{
            position: 'absolute',
            left: layout.shaft.x,
            top: layout.shaft.topY - STAGE.slabHeight,
            width: layout.shaft.w,
            height: layout.shaft.bottomY - layout.shaft.topY + STAGE.slabHeight,
            backgroundColor: '#0c0d12',
            ...(shaftUrl
              ? {
                  backgroundImage: `url(${shaftUrl})`,
                  backgroundRepeat: 'repeat-y',
                  backgroundSize: `${layout.shaft.w}px auto`,
                  imageRendering: 'pixelated',
                }
              : {}),
            borderLeft: '3px solid #2c2d35',
            borderRight: '3px solid #2c2d35',
            boxSizing: 'border-box',
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: layout.shaft.x + (layout.shaft.w - cabinW) / 2,
            top: cabinTopY + STAGE.floorHeight - cabinH,
            width: cabinW,
            height: cabinH,
            zIndex: 3,
          }}
        >
          {cabinUrl ? (
            <img
              src={cabinUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#2a2b33', border: '3px solid #44454d', boxSizing: 'border-box' }} />
          )}
          {/* Avatar in der Kabine */}
          {nav.avatarInCabin && (
            <span style={{ position: 'absolute', left: '50%', bottom: 18, transform: 'translateX(-50%)', zIndex: 4 }}>
              <PixelSprite sheetId="player_idle" animation="idle" fallback="🕵️" title="Sie" />
            </span>
          )}
        </div>

        {/* Avatar (läuft/steht) */}
        {!nav.avatarInCabin && (
          <span
            style={{
              position: 'absolute',
              left: nav.pos.x - STAGE.avatarSize / 2,
              top: avatarY,
              width: STAGE.avatarSize,
              height: STAGE.avatarSize,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              zIndex: 6,
              pointerEvents: 'none',
            }}
            data-testid="building-avatar"
          >
            <PixelSprite
              sheetId={nav.mode === 'walk' ? 'player_walk' : 'player_idle'}
              animation={nav.mode === 'walk' ? 'walkRight' : 'idle'}
              fallback="🕵️"
              flip={nav.facing === -1}
              title="Sie"
            />
          </span>
        )}

        {/* Boden vor dem Gebäude */}
        <div
          style={{
            position: 'absolute',
            left: -60,
            top: layout.height - STAGE.groundHeight,
            width: layout.width + 120,
            height: STAGE.groundHeight,
            backgroundColor: '#101116',
            borderTop: '3px solid #2c2d35',
          }}
        />
      </div>
    </div>
  );
}

export default BuildingStage;
