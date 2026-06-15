/**
 * BuildingStage — der Pixel-Querschnitt des Ministeriums (K6-Rework).
 *
 * Verfassungs-Regeln (GESAMTKONZEPT_VISUELL.md):
 * - KEIN Röntgenblick: Etagen sind Flure (bld_corridor) mit TÜREN; Räume
 *   öffnen sich erst beim Betreten (Raum-Nahsicht). Einzige Ausnahme ist die
 *   Lobby (Eingangshalle = der „Flur" des Erdgeschosses).
 * - Proportionen: Avatar ×4 (≈ 57 % der Etagenhöhe), Tür ≈ 1,15 Avatarhöhen.
 * - Das Gebäude steht in einer Stadt: Skyline + Straße laufen hinter/unter dem
 *   Haus über die volle Breite, das Haus selbst ist schmaler als der Schirm.
 * - Kamera folgt der Etage des Avatars (vertikal, weich).
 * Jedes Bild hat einen CSS-Fallback — ohne Manifest bleibt die Bühne funktional.
 */
import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { getBuildingLayout, STAGE, type RoomLayout } from './buildingLayout';
import { NAV_SPEED } from './BuildingNavigator';
import { useDayClockStore } from '../stores/dayClockStore';
import { skyGradientForMinutes } from './skyTime';
import { FLOOR_DECOR, DECOR_HEIGHT, FLOOR_AMBIENT, AMBIENT_HEIGHT, FLOOR_WALKERS, DOOR_TRAFFIC, POSTER_SLOGANS, type AmbientFigure } from './corridorDecor';
import type { NavigatorState } from './useNavigator';
import { StoryModeColors } from '../theme';
import { useAssets } from '../assets/useAssets';
import { PixelSprite } from '../assets/PixelSprite';
import { playSound } from '../utils/SoundSystem';

/**
 * Lauf-Takt an die Navigator-Geschwindigkeit koppeln (kein „Foot Sliding"):
 * Ein voller 8-Frame-Zyklus = 2 Schritte ≈ 1,5 Körperbreiten (×4-Skalierung).
 */
const WALK_CYCLE_STRIDE_PX = 192;
const WALK_FRAME_TIME_MS = Math.round((WALK_CYCLE_STRIDE_PX / NAV_SPEED.walkPxPerSecond) * 1000 / 8);

/** Wie viel breiter als das Gebäude der Bildausschnitt ist (Stadt links/rechts). */
const CITY_MARGIN_FACTOR = 1.45;

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
  /** Klick auf eine Tür (roomId). Fehlt der Handler, ist die Bühne passiv (Sequenz-Modus). */
  onRoomClick?: (roomId: string) => void;
  /** Klick auf den Fahrstuhl öffnet das Etagen-Tableau (diegetische Navigation, 2c). */
  onOpenDirectory?: () => void;
  /** Raum-Interaktion sperren (z. B. während Ankunfts-Sequenz). */
  interactive?: boolean;
  /** Aktueller Monat (1–12 oder kumulativ) für die Jahreszeiten-Stimmung. */
  month?: number;
  /** Strang 5: aktueller Stimmungs-Hinweis des Pförtners (Lobby), klickbar. */
  pfoertnerLine?: string;
}

const layout = getBuildingLayout();

/** Globale Keyframes der Bühne (einmalig, Präfix bs-). */
const STAGE_KEYFRAMES = `
  @keyframes bs-blink { 0%,100%{opacity:1} 50%{opacity:.15} }
  @keyframes bs-glow { 0%,100%{box-shadow:0 0 6px 2px rgba(255,200,80,.25)} 50%{box-shadow:0 0 10px 3px rgba(255,200,80,.5)} }
  /* Strang 5: Statist pendelt im Flur (Bewegung), Sprite klappt am Wendepunkt. */
  @keyframes bs-walk-move { 0%{transform:translateX(0)} 50%{transform:translateX(var(--bs-walk-d))} 100%{transform:translateX(0)} }
  @keyframes bs-walk-flip { 0%,49%{transform:scaleX(1)} 50%,99%{transform:scaleX(-1)} 100%{transform:scaleX(1)} }
  /* Strang 5: Tür-Dummy taucht kurz auf (ein-/ausgehen) und verschwindet wieder. */
  @keyframes bs-door-traffic { 0%,7%{opacity:0} 13%,40%{opacity:1} 47%,100%{opacity:0} }
  @media (prefers-reduced-motion: reduce) { [data-bs-walker]{animation:none !important} [data-bs-walker] *{animation:none !important} [data-bs-dummy]{opacity:0 !important;animation:none !important} }
`;

/** Tür eines Raums — sanftes Überblenden zwischen Zu/Auf (R2: kein harter Bild-Tausch). */
function RoomDoor({ room, open }: { room: RoomLayout; open: boolean }) {
  const assets = useAssets();
  const closedUrl = assets.imageUrl('bld_door_closed');
  const openUrl = assets.imageUrl('bld_door_open');
  const base: CSSProperties = {
    position: 'absolute',
    left: room.doorX - STAGE.doorWidth / 2,
    top: room.y + room.h - STAGE.doorHeight - STAGE.floorStrip,
    width: STAGE.doorWidth,
    height: STAGE.doorHeight,
    pointerEvents: 'none',
    zIndex: 4,
  };
  if (closedUrl && openUrl) {
    const img = (url: string, vis: boolean): CSSProperties => ({
      ...base, imageRendering: 'pixelated', objectFit: 'fill', opacity: vis ? 1 : 0, transition: 'opacity 240ms ease',
    });
    return (
      <>
        <img src={closedUrl} alt="" style={img(closedUrl, !open)} />
        <img src={openUrl} alt="" style={img(openUrl, open)} />
      </>
    );
  }
  return (
    <div style={{ ...base, backgroundColor: open ? '#3b2a17' : '#241a0f', border: '4px solid #111', boxSizing: 'border-box' }} />
  );
}

/** Strang 5: anklickbarer Flur-Statist mit Flavor-Sprechblase (Mini-Dialog, D13). */
function AmbientPerson({ a, left, top, height }: { a: AmbientFigure; left: number; top: number; height: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'absolute', left, top, transform: 'translateX(-50%)', zIndex: 5 }}>
      {open && (
        <div
          style={{
            position: 'absolute', bottom: height + 6, left: '50%', transform: 'translateX(-50%)',
            width: 230, backgroundColor: 'rgba(12,12,16,0.94)', border: `1px solid ${StoryModeColors.borderLight}`,
            color: '#e8e4d8', fontFamily: 'monospace', fontSize: 11, lineHeight: 1.4, padding: '6px 8px', zIndex: 7,
          }}
        >
          <span style={{ display: 'block', fontSize: 8, letterSpacing: 1, color: StoryModeColors.textMuted, marginBottom: 2 }}>{a.who}</span>
          {a.line}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`${a.who} ansprechen`}
        title={`${a.who} ansprechen`}
        style={{ width: (height / 96) * 48, height, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <PixelSprite sheetId={a.figure} animation="idle" fallback="" scale={height / 96} title={a.who} />
      </button>
    </div>
  );
}

/** Strang 5 (Bewegung): ein Statist, der zwischen zwei Punkten im Flur hin- und herläuft. */
function AmbientWalker({ figureWalk, leftA, d, top, height }: { figureWalk: string; leftA: number; d: number; top: number; height: number }) {
  const dur = Math.max(6, Math.round(d / 26)); // ~26 px/s, ruhiges Tempo
  const outer = {
    position: 'absolute', left: leftA, top, zIndex: 2, pointerEvents: 'none',
    animation: `bs-walk-move ${dur}s linear infinite`, '--bs-walk-d': `${d}px`,
  } as CSSProperties;
  return (
    <div data-bs-walker="" aria-hidden style={outer}>
      <div style={{ animation: `bs-walk-flip ${dur}s linear infinite` }}>
        <PixelSprite sheetId={figureWalk} animation="walk" fallback="" scale={height / 96} title="" />
      </div>
    </div>
  );
}

/** Strang 5 (Bewegung): Tür-Dummy, der periodisch an einer Tür auftaucht und verschwindet. */
function DoorDummy({ figure, left, top, height, delayS }: { figure: string; left: number; top: number; height: number; delayS: number }) {
  return (
    <div
      data-bs-dummy=""
      aria-hidden
      style={{
        position: 'absolute', left, top, transform: 'translateX(-50%)', zIndex: 2, pointerEvents: 'none',
        animation: `bs-door-traffic 17s ease-in-out ${delayS}s infinite`, opacity: 0,
      }}
    >
      <PixelSprite sheetId={figure} animation="idle" fallback="" scale={height / 96} title="" />
    </div>
  );
}

export function BuildingStage({ npcs, nav, onRoomClick, onOpenDirectory, interactive = true, month, pfoertnerLine }: BuildingStageProps) {
  const assets = useAssets();
  const npcById = new Map(npcs.map((n) => [n.id, n]));
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ scale: 1, h: 600, w: 800 });
  const [hoverRoom, setHoverRoom] = useState<string | null>(null);
  const [hoverShaft, setHoverShaft] = useState(false);
  const [pfoertnerOpen, setPfoertnerOpen] = useState(false); // Strang 5: Pförtner-Sprechblase
  // P7/§14.4: angeklicktes Propaganda-Plakat (Vergrößerung + Spruch).
  const [poster, setPoster] = useState<{ url: string; titel_de: string; slogan_de: string } | null>(null);

  // Schritt-Sound auf den Kontakt-Frames des Laufzyklus (Frame 0 und 4).
  const handleWalkFrame = useCallback((frame: number) => {
    if (frame === 0 || frame === 4) playSound('footsteps');
  }, []);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () =>
      setView({
        // Gebäude schmaler als der Schirm: Stadt bleibt links/rechts sichtbar.
        scale: Math.max(0.15, el.clientWidth / (layout.width * CITY_MARGIN_FACTOR)),
        h: el.clientHeight,
        w: el.clientWidth,
      });
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Kamera: Etage des Avatars vertikal zentrieren (geklemmt auf Gebäudegrenzen).
  const avatarFloor = layout.floors.find((f) => f.level === Math.round(nav.pos.floorLevel));
  const focusY = (avatarFloor ? avatarFloor.y + STAGE.floorHeight / 2 : layout.height / 2) * view.scale;
  const stageH = layout.height * view.scale;
  const cameraY = Math.max(0, Math.min(Math.max(0, stageH - view.h), focusY - view.h / 2));

  const pillarUrl = assets.imageUrl('bld_facade_pillar');
  const slabUrl = assets.imageUrl('bld_floor_slab');
  const shaftUrl = assets.imageUrl('bld_shaft');
  const roofUrl = assets.imageUrl('bld_roof');
  const corridorUrl = assets.imageUrl('bld_corridor');
  // Mehr Abwechslung statt 1 Flur ×N: Variante je Etage (Owner-Hinweis).
  const corridorIds = ['bld_corridor', 'bld_corridor_2', 'bld_corridor_3'] as const;
  const corridorUrlFor = (level: number) =>
    assets.imageUrl(level === -1 ? 'bld_corridor_keller' : corridorIds[(((level % 3) + 3) % 3)]) ?? corridorUrl;
  const lobbyUrl = assets.imageUrl('room_lobby');
  const cityUrl = assets.imageUrl('bld_city_far');
  const streetUrl = assets.imageUrl('bld_street');
  const undergroundUrl = assets.imageUrl('bld_underground');
  // Tageszeit-Himmel (gegen „schwarzer Himmel zu groß"): Verlauf folgt der Tagesuhr,
  // die chroma-freigestellte Skyline liegt davor.
  const skyMinutes = useDayClockStore((s) => s.minutes);
  const cabinClosedUrl = assets.imageUrl('elevator_cabin_closed');
  const cabinOpenUrl = assets.imageUrl('elevator_cabin_open');

  // Kabinen-Geometrie: füllt den Schacht (R5: keine „Briefmarke"); Höhe = Etagenhöhe.
  const cabinH = STAGE.floorHeight;
  const cabinW = 170;
  const topFloor = layout.floors[0];
  const cabinTopY = topFloor.y + (topFloor.level - nav.cabinLevel) * (STAGE.floorHeight + STAGE.slabHeight);

  const avatarFloorLayout = layout.floors.find((f) => f.level === nav.pos.floorLevel) ?? avatarFloor;
  const avatarY = nav.avatarInCabin
    ? cabinTopY + STAGE.floorHeight - STAGE.avatarSize - 10
    : (avatarFloorLayout?.walkY ?? 0) - STAGE.floorStrip; // Füße auf der Wand-Fuß-Linie

  // Stadt-Geometrie (im Container-Maß, hinter der skalierten Bühne).
  const groundScreenY = (layout.height - STAGE.groundHeight) * view.scale - cameraY;
  // Untergrund: Erde/Rohre hinter & unter dem Keller (unterste Etage), damit die
  // Skyline nicht „hängt" und der Keller als unterirdisch lesbar wird (Owner-Befund).
  const lowestFloorY = layout.floors.length > 0 ? layout.floors[layout.floors.length - 1].y : layout.height - STAGE.floorHeight;
  const undergroundTopY = (lowestFloorY - STAGE.slabHeight) * view.scale - cameraY;

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: skyGradientForMinutes(skyMinutes), transition: 'background 800ms linear' }}
      data-testid="building-stage"
    >
      <style>{STAGE_KEYFRAMES}</style>

      {/* ───── Stadt: Skyline hinter dem Haus, Straße unter dem Haus (volle Breite) ───── */}
      {cityUrl && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: Math.max(0, view.h - groundScreenY),
            // Skyline groß, aber Anzeige unter Native-Höhe (864) → scharf statt hochskaliert.
            height: Math.min(view.h * 0.72, 760),
            backgroundImage: `url(${cityUrl})`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'center bottom',
            imageRendering: 'pixelated',
            opacity: 0.95,
            // Natürlicher Übergang Stadt → Himmel: oberer Rand sanft ausblenden (kein harter Schnitt).
            WebkitMaskImage: 'linear-gradient(to top, #000 62%, transparent 100%)',
            maskImage: 'linear-gradient(to top, #000 62%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Untergrund: Erde/Rohre hinter dem Keller und darunter (statt „nichts"/Straße). */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: undergroundTopY,
          height: Math.max(0, view.h - undergroundTopY),
          backgroundColor: '#1a1510',
          ...((undergroundUrl || streetUrl)
            ? {
                backgroundImage: `url(${undergroundUrl ?? streetUrl})`,
                backgroundRepeat: 'repeat-x',
                backgroundSize: 'auto 100%',
                backgroundPosition: 'center top',
                imageRendering: 'pixelated',
              }
            : { borderTop: '3px solid #2c2d35' }),
          pointerEvents: 'none',
        }}
      />

      {/* ───── Das Gebäude (skalierte Bühne, mittig) ───── */}
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
              height: layout.height - STAGE.roofHeight - STAGE.groundHeight,
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

        {/* Etagen: Flure (kein Röntgenblick) — EG zeigt die Lobby als Eingangshalle */}
        {layout.floors.map((floor) => {
          const isLobby = floor.level === layout.entryFloorLevel;
          const bgUrl = isLobby ? lobbyUrl : corridorUrlFor(floor.level);
          return (
            <div key={floor.id}>
              {/* Flur-Hintergrund über die volle Etagen-Breite */}
              <div
                style={{
                  position: 'absolute',
                  left: STAGE.pillarWidth,
                  top: floor.y,
                  width: layout.shaft.x - STAGE.pillarWidth,
                  height: STAGE.floorHeight,
                  backgroundColor: '#191a20',
                  ...(bgUrl
                    ? {
                        backgroundImage: `linear-gradient(rgba(8,8,12,0.12), rgba(8,8,12,0.22)), url(${bgUrl})`,
                        // EG/Lobby = EINE durchgehende Eingangshalle (kein Kacheln, sah aus wie ein Bug);
                        // Flure dürfen weiter horizontal kacheln (3 Varianten je Etage).
                        backgroundRepeat: isLobby ? 'no-repeat' : 'repeat-x',
                        backgroundSize: isLobby ? 'cover' : 'auto 100%',
                        backgroundPosition: isLobby ? 'center bottom' : 'left bottom',
                        imageRendering: 'pixelated',
                      }
                    : { borderBottom: '2px solid #2c2d35' }),
                  zIndex: 1,
                }}
              />
              {/* Frei platzierte Flur-Deko (R4): Bodensteher auf der Bodenlinie,
                  Wand-Objekte auf Wandhöhe — datengetrieben, reale Proportionen. */}
              {!isLobby && (FLOOR_DECOR[floor.id] ?? []).map((d, i) => {
                const url = assets.imageUrl(d.id);
                if (!url) return null;
                const h = DECOR_HEIGHT[d.id] ?? 48;
                const playableW = layout.shaft.x - STAGE.pillarWidth;
                const cx = STAGE.pillarWidth + d.xFrac * playableW;
                const baseline = floor.y + STAGE.floorHeight - STAGE.floorStrip; // Wand-Fuß-Linie
                const top = d.mount === 'floor'
                  ? baseline - h
                  : floor.y + STAGE.floorHeight * 0.36 - h / 2; // Wand-Objekte oberes Drittel
                // P7/§14.4: Propaganda-Plakate sind anklickbar (Vergrößerung + Spruch).
                const slogan = POSTER_SLOGANS[d.id];
                const clickablePoster = interactive && !!slogan;
                return (
                  <img
                    key={`${floor.id}-decor-${i}`}
                    src={url}
                    alt={slogan ? `Plakat: ${slogan.titel_de}` : ''}
                    aria-hidden={slogan ? undefined : true}
                    title={clickablePoster ? 'Plakat ansehen' : undefined}
                    onClick={clickablePoster ? () => setPoster({ url, ...slogan }) : undefined}
                    style={{
                      position: 'absolute',
                      left: cx,
                      top,
                      height: h,
                      width: 'auto',
                      transform: 'translateX(-50%)',
                      imageRendering: 'pixelated',
                      pointerEvents: clickablePoster ? 'auto' : 'none',
                      cursor: clickablePoster ? 'pointer' : undefined,
                      zIndex: 2,
                    }}
                  />
                );
              })}
              {/* Strang 5: stehende Flavor-Statisten (Reinigung/Kollege) — Lebendigkeit. */}
              {!isLobby && (FLOOR_AMBIENT[floor.id] ?? []).map((a, i) => {
                if (!assets.imageUrl(a.figure)) return null;
                const cx = STAGE.pillarWidth + a.xFrac * (layout.shaft.x - STAGE.pillarWidth);
                const top = floor.y + STAGE.floorHeight - STAGE.floorStrip - AMBIENT_HEIGHT;
                return <AmbientPerson key={`${floor.id}-amb-${i}`} a={a} left={cx} top={top} height={AMBIENT_HEIGHT} />;
              })}
              {/* Strang 5 (Bewegung): hin- und herlaufender Statist (z. B. Reinigung). */}
              {!isLobby && (FLOOR_WALKERS[floor.id] ?? []).map((w, i) => {
                if (!assets.imageUrl(w.figureWalk)) return null;
                const playableW = layout.shaft.x - STAGE.pillarWidth;
                const xA = STAGE.pillarWidth + w.xFracA * playableW;
                const xB = STAGE.pillarWidth + w.xFracB * playableW;
                const top = floor.y + STAGE.floorHeight - STAGE.floorStrip - AMBIENT_HEIGHT;
                return (
                  <AmbientWalker
                    key={`${floor.id}-walk-${i}`}
                    figureWalk={w.figureWalk}
                    leftA={Math.min(xA, xB)}
                    d={Math.abs(xB - xA)}
                    top={top}
                    height={AMBIENT_HEIGHT}
                  />
                );
              })}
              {/* Strang 5 (Bewegung): Tür-Dummies — taucht periodisch an einer Tür auf. */}
              {!isLobby && (DOOR_TRAFFIC[floor.id] ?? []).map((dm, i) => {
                if (!assets.imageUrl(dm.figure)) return null;
                const cx = STAGE.pillarWidth + dm.xFrac * (layout.shaft.x - STAGE.pillarWidth);
                const top = floor.y + STAGE.floorHeight - STAGE.floorStrip - AMBIENT_HEIGHT;
                return <DoorDummy key={`${floor.id}-dummy-${i}`} figure={dm.figure} left={cx} top={top} height={AMBIENT_HEIGHT} delayS={dm.delayS} />;
              })}
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
                  left: STAGE.pillarWidth + 8,
                  top: floor.y + 8,
                  padding: '3px 8px',
                  fontSize: 14,
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
          );
        })}

        {/* Türen + Türschilder (Räume öffnen sich erst beim Betreten) */}
        {layout.rooms.map((room) => {
          if (room.id === 'lobby') return null; // Lobby ist die offene Eingangshalle
          const npc = room.npcId ? npcById.get(room.npcId) : undefined;
          const clickable = interactive && !!onRoomClick && (room.npcId ? (npc?.available ?? true) : true);
          const hovered = hoverRoom === room.id;
          const isTarget = nav.targetRoomId === room.id;
          const lampColor = npc?.inCrisis
            ? StoryModeColors.danger
            : npc && !npc.available
              ? '#444'
              : '#ffd479';
          return (
            <div key={room.id}>
              <RoomDoor room={room} open={nav.openDoorRoomId === room.id} />
              {/* Türschild über der Tür */}
              <span
                style={{
                  position: 'absolute',
                  left: room.doorX - 110,
                  width: 220,
                  top: room.y + room.h - STAGE.doorHeight - STAGE.floorStrip - 34,
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: hovered || isTarget ? '#0d0d0d' : '#e8e4d8',
                  backgroundColor: hovered || isTarget ? StoryModeColors.warning : 'rgba(10,10,14,0.78)',
                  border: `1px solid ${npc?.inCrisis ? StoryModeColors.danger : '#3a3b43'}`,
                  padding: '2px 4px',
                  zIndex: 5,
                  pointerEvents: 'none',
                  transition: 'background-color 140ms ease, color 140ms ease',
                }}
              >
                {room.label_de}
                {npc ? ` · ${npc.name.split(' ')[0]}` : ''}
              </span>
              {/* Status-Lampe neben der Tür (Krise blinkt rot) */}
              <span
                style={{
                  position: 'absolute',
                  left: room.doorX + STAGE.doorWidth / 2 + 8,
                  top: room.y + room.h - STAGE.doorHeight - STAGE.floorStrip + 10,
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  backgroundColor: lampColor,
                  animation: npc?.inCrisis ? 'bs-blink 0.9s ease-in-out infinite' : 'bs-glow 3s ease-in-out infinite',
                  zIndex: 5,
                  pointerEvents: 'none',
                }}
                title={npc?.inCrisis ? 'KRISE' : undefined}
              />
              {/* Klickfläche rund um die Tür */}
              <button
                onClick={() => clickable && onRoomClick?.(room.id)}
                onMouseEnter={() => setHoverRoom(room.id)}
                onMouseLeave={() => setHoverRoom((h) => (h === room.id ? null : h))}
                disabled={!clickable}
                aria-label={`${room.label_de}${npc ? ` — ${npc.name}` : ''} betreten`}
                title={npc ? `${room.label_de} — ${npc.name}` : room.label_de}
                style={{
                  position: 'absolute',
                  left: room.doorX - STAGE.doorWidth / 2 - 24,
                  top: room.y + room.h - STAGE.doorHeight - STAGE.floorStrip - 40,
                  width: STAGE.doorWidth + 48,
                  height: STAGE.doorHeight + 40,
                  background: 'transparent',
                  border: hovered ? `2px solid ${StoryModeColors.warning}` : '2px solid transparent',
                  cursor: clickable ? 'pointer' : 'default',
                  zIndex: 6,
                }}
              />
            </div>
          );
        })}

        {/* Strang 5: Pförtner in der Lobby — „Stimme des eigenen Landes", klickbar. */}
        {(() => {
          const lobby = layout.floors.find((f) => f.level === layout.entryFloorLevel);
          if (!lobby || !assets.imageUrl('figure_pfoertner')) return null;
          const pH = 116; // Pförtner etwas kleiner als der Avatar (älterer Mann)
          const px = STAGE.pillarWidth + 0.13 * (layout.shaft.x - STAGE.pillarWidth);
          const pBottom = lobby.y + STAGE.floorHeight - STAGE.floorStrip;
          return (
            <div style={{ position: 'absolute', left: px, top: pBottom - pH, transform: 'translateX(-50%)', zIndex: 5 }}>
              {pfoertnerOpen && pfoertnerLine && (
                <div
                  style={{
                    position: 'absolute', bottom: pH + 6, left: '50%', transform: 'translateX(-50%)',
                    width: 240, maxWidth: 240, backgroundColor: 'rgba(12,12,16,0.94)',
                    border: `1px solid ${StoryModeColors.borderLight}`, color: '#e8e4d8',
                    fontFamily: 'monospace', fontSize: 11, lineHeight: 1.4, padding: '6px 8px', zIndex: 7,
                  }}
                >
                  <span style={{ display: 'block', fontSize: 8, letterSpacing: 1, color: StoryModeColors.textMuted, marginBottom: 2 }}>PFÖRTNER</span>
                  {pfoertnerLine}
                </div>
              )}
              <button
                onClick={() => setPfoertnerOpen((o) => !o)}
                aria-label="Pförtner ansprechen"
                title="Pförtner ansprechen"
                style={{ width: 48 * 1.2, height: pH, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <PixelSprite sheetId="figure_pfoertner" animation="idle" fallback="" scale={1.2} title="Pförtner" />
              </button>
            </div>
          );
        })()}

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
          {cabinClosedUrl && cabinOpenUrl ? (
            <>
              {/* R5: sanftes Überblenden Türen auf/zu statt hartem Bild-Tausch */}
              <img src={cabinClosedUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', imageRendering: 'pixelated', opacity: nav.cabinDoorsOpen ? 0 : 1, transition: 'opacity 300ms ease' }} />
              <img src={cabinOpenUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', imageRendering: 'pixelated', opacity: nav.cabinDoorsOpen ? 1 : 0, transition: 'opacity 300ms ease' }} />
            </>
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#2a2b33', border: '3px solid #44454d', boxSizing: 'border-box' }} />
          )}
          {nav.avatarInCabin && (
            <span style={{ position: 'absolute', left: '50%', bottom: 22, transform: 'translateX(-50%)', zIndex: 4 }}>
              <PixelSprite sheetId="player_idle" animation="idle" fallback="•" scale={3} title="Sie" />
            </span>
          )}
        </div>

        {/* Fahrstuhl-Ruf: Klick öffnet das Etagen-Tableau (diegetische Navigation, 2c) */}
        {interactive && onOpenDirectory && (
          <button
            onClick={onOpenDirectory}
            onMouseEnter={() => setHoverShaft(true)}
            onMouseLeave={() => setHoverShaft(false)}
            aria-label="Etagen-Tableau öffnen (Taste F)"
            title="Etagen wählen (F)"
            style={{
              position: 'absolute',
              left: layout.shaft.x,
              top: layout.shaft.topY - STAGE.slabHeight,
              width: layout.shaft.w,
              height: layout.shaft.bottomY - layout.shaft.topY + STAGE.slabHeight,
              background: hoverShaft ? 'rgba(240,180,41,0.06)' : 'transparent',
              border: `2px solid ${hoverShaft ? StoryModeColors.warning : 'transparent'}`,
              cursor: 'pointer',
              zIndex: 5,
            }}
          >
            {/* Ruf-Plakette oben am Schacht — macht den Fahrstuhl als Bedienelement kenntlich */}
            <span
              style={{
                position: 'absolute',
                left: '50%',
                top: 6,
                transform: 'translateX(-50%)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                padding: '2px 6px',
                color: hoverShaft ? '#0d0d0d' : '#c8c8b8',
                backgroundColor: hoverShaft ? StoryModeColors.warning : 'rgba(10,10,14,0.8)',
                border: `1px solid ${StoryModeColors.borderLight}`,
                whiteSpace: 'nowrap',
              }}
            >
              ETAGEN ▲▼
            </span>
          </button>
        )}

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
              fallback="•"
              flip={nav.facing === -1}
              scale={4}
              title="Sie"
              frameTimeMs={nav.mode === 'walk' ? WALK_FRAME_TIME_MS : undefined}
              onFrame={nav.mode === 'walk' ? handleWalkFrame : undefined}
            />
          </span>
        )}
      </div>

      {/* Tag/Nacht-Tönung (H30): aus der Tages-Uhr — kühler Morgen, neutraler Mittag,
          zum Redaktionsschluss hin tiefblaue Abend-/Nacht-Stimmung über der Stadt. */}
      <DayNightTint />
      <SeasonOverlay month={month} />

      {/* P7/§14.4 (#1): Propaganda-Plakat vergrößert — trockener Ministeriums-Humor. */}
      {poster && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Plakat: ${poster.titel_de}`}
          onClick={() => setPoster(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1200,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
            background: 'rgba(0,0,0,0.82)', cursor: 'pointer', padding: 24,
          }}
        >
          <img
            src={poster.url}
            alt={`Plakat: ${poster.titel_de}`}
            style={{
              maxHeight: '52vh', maxWidth: '88vw', width: 'auto',
              imageRendering: 'pixelated',
              border: `4px solid ${StoryModeColors.ministryRed}`,
              boxShadow: '8px 8px 0 0 rgba(0,0,0,0.6)',
            }}
          />
          <div style={{ maxWidth: 520, textAlign: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontWeight: 900, letterSpacing: 3, color: StoryModeColors.warning, fontSize: 14, marginBottom: 6 }}>
              {poster.titel_de}
            </div>
            <div style={{ fontFamily: 'monospace', color: '#e8e4d8', fontSize: 13, lineHeight: 1.5, fontStyle: 'italic' }}>
              „{poster.slogan_de}"
            </div>
            <div style={{ fontFamily: 'monospace', color: StoryModeColors.textMuted, fontSize: 10, marginTop: 12 }}>
              (Klicken zum Schließen)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Jahreszeiten-Stimmung (D15, „sanft lebendig"): Schnee im Winter, Regen im Herbst. */
function SeasonOverlay({ month }: { month?: number }) {
  if (month == null) return null;
  const m = (((Math.floor(month) - 1) % 12) + 12) % 12 + 1; // → 1..12
  const winter = m === 12 || m === 1 || m === 2;
  const autumn = m >= 9 && m <= 11;
  if (!winter && !autumn) return null;
  const css = winter
    ? {
        backgroundImage:
          'radial-gradient(1.5px 1.5px at 20px 30px, rgba(255,255,255,0.85), transparent),' +
          'radial-gradient(1.5px 1.5px at 80px 70px, rgba(255,255,255,0.65), transparent),' +
          'radial-gradient(1px 1px at 50px 130px, rgba(255,255,255,0.75), transparent)',
        backgroundSize: '130px 170px',
        animation: 'bs-snow 9s linear infinite',
      }
    : {
        backgroundImage:
          'repeating-linear-gradient(74deg, rgba(170,190,220,0.16) 0 1px, transparent 1px 9px)',
        backgroundSize: '120px 120px',
        animation: 'bs-rain 0.55s linear infinite',
      };
  return (
    <>
      <style>{`@keyframes bs-snow{from{background-position:0 0,0 0,0 0}to{background-position:18px 170px,-14px 170px,8px 170px}}@keyframes bs-rain{from{background-position:0 0}to{background-position:-26px 120px}}`}</style>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...css }} />
    </>
  );
}

/** Sanfte Tag/Nacht-Tönung der Bühne, gesteuert von der Tages-Uhr (09:00–18:00). */
function DayNightTint() {
  const minutes = useDayClockStore((s) => s.minutes);
  const t = Math.max(0, Math.min(1, minutes / 540)); // 0 = 09:00, 1 = 18:00
  let alpha = 0;
  let rgb = '14,22,48'; // Nacht-Blau
  if (t < 0.15) {
    alpha = 0.14 * (1 - t / 0.15); // kühler Morgen-Hauch
    rgb = '44,74,120';
  } else if (t >= 0.6) {
    alpha = ((t - 0.6) / 0.4) * 0.52; // Abend → Nacht
    rgb = '14,22,48';
  }
  if (alpha <= 0.005) return null;
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: `rgba(${rgb},${alpha.toFixed(3)})`,
        pointerEvents: 'none',
        transition: 'background-color 600ms linear',
      }}
    />
  );
}

export default BuildingStage;
