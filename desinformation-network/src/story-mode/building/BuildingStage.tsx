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
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { getBuildingLayout, STAGE, wallFootY, type RoomLayout } from './buildingLayout';
import { snapPixelScale, snapToDevicePixel } from './pixelScale';
import { useDpr } from '../hooks/usePixelFit';
import { NAV_SPEED } from './BuildingNavigator';
import { useDayClockStore } from '../stores/dayClockStore';
import { usePlayerProfile, playerWalkSheetId, playerIdleSheetId } from '../stores/playerProfileStore';
import { skyGradientForMinutes, skylineLayersForMinutes } from './skyTime';
import { FLOOR_DECOR, DECOR_HEIGHT, FLOOR_AMBIENT, AMBIENT_HEIGHT, POSTER_SLOGANS, shredderLine, coffeeLine, volksbrauseLine, employeeOfMonth, plantAsset, plantLine, type AmbientFigure } from './corridorDecor';
import { createAmbientLife, tickAmbientLife, sampleAmbient, nudgeAmbient, ambientWalkFrameTimeMs, AMBIENT_AGENTS, type AmbientFigureSnapshot } from './ambientLife';
import type { NavigatorState } from './useNavigator';
import { StoryModeColors, scrim } from '../theme';
import { useAssets } from '../assets/useAssets';
import { PixelSprite } from '../assets/PixelSprite';
import { playSound } from '../utils/SoundSystem';
import { publishVqa } from '../harness/vqaHook';

/**
 * Lauf-Takt an die Navigator-Geschwindigkeit koppeln (kein „Foot Sliding"):
 * Ein voller 8-Frame-Zyklus = 2 Schritte ≈ 1,5 Körperbreiten (×4-Skalierung).
 */
const WALK_CYCLE_STRIDE_PX = 192;
const WALK_FRAME_TIME_MS = Math.round((WALK_CYCLE_STRIDE_PX / NAV_SPEED.walkPxPerSecond) * 1000 / 8);

// Welt-Ebene: Signal-/Hover-Farben bleiben HELL (die Welt ist dunkel; die
// v3.1-Papier-Tinten sind dafür zu dunkel — §4.7 gilt der Bedienung, nicht der Welt).
const WORLD_AMBER = '#F0B429';
const WORLD_RED = '#E5484D';

/** Wie viel breiter als das Gebäude der Bildausschnitt ist (Stadt links/rechts). */
const CITY_MARGIN_FACTOR = 1.45;

/** Native Höhe der Skyline-/Untergrund-Bänder (2016×864) — für welt-kohärente Skalierung. */
const CITY_BAND_NATIVE_H = 864;
const STREET_BAND_NATIVE_H = 192;

/**
 * Welt-verankerte Text-/Bedien-Beschriftung (E35, Memo §1 „Mischbetrieb"):
 * Position in Welt-Koordinaten, Rasterung NATIV — der Wrapper kehrt die
 * Bühnen-Skalierung um; Inhalte positionieren sich in css-px relativ zum Anker.
 * Ohne dies rastert die Pixel-Font im herunterskalierten Welt-Layer matschig (B1).
 */
function WorldAnchor({ x, y, scale, z, children }: { x: number; y: number; scale: number; z?: number; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: 0, height: 0, zIndex: z,
        transform: `scale(${1 / scale})`, transformOrigin: 'top left', pointerEvents: 'none',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Bodenschatten unter einer stehenden Figur (P5, Fremdmodell-Durchgang 2026-08-22).
 *
 * Die Figuren standen bereits mit gap = 0 EXAKT auf der Wand-Fuß-Linie
 * (nachgemessen in allen acht geometry/building_*.json) — der „freigestellt"-
 * Eindruck kam also nicht aus einem Platzierungsfehler, sondern rein daraus, dass
 * nichts den Bodenkontakt zeigte. Deshalb ergänzt, nicht verschoben.
 *
 * Kein Asset: eine gequetschte radiale Ellipse auf der Standlinie, `screen`-frei
 * und ohne Weichzeichner, damit die Pixel-Kante der Welt nicht aufweicht.
 */
function Bodenschatten({ x, y, breite, staerke = 0.4 }: { x: number; y: number; breite: number; staerke?: number }) {
  const h = Math.max(4, Math.round(breite * 0.22));
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        left: x - breite / 2,
        top: y - h / 2,
        width: breite,
        height: h,
        background: `radial-gradient(ellipse at center, rgba(18,14,9,${staerke}) 0%, rgba(18,14,9,${staerke * 0.55}) 55%, rgba(18,14,9,0) 78%)`,
        pointerEvents: 'none',
        zIndex: 3,
      }}
    />
  );
}

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
  /** P7/§14.4: Entdeckungsdruck (0–100) — speist den Reißwolf-Kommentar. */
  risk?: number;
  /** P7/§14.4: moralische Last (0–100) — welke/grüne Büropflanze + Pflanzen-Kommentar. */
  moralWeight?: number;
  /** P7/§14.4: Aufmerksamkeit (0–100) — speist mit Risiko/Moral die Kaffeeküchen-Wirtschaftslage. */
  attention?: number;
  /** P7/§14.4: aktiver Auftrag — das „Etikett" der Volksbrause reagiert aufs Narrativ. */
  auftragId?: string;
}

const layout = getBuildingLayout();

/** Globale Keyframes der Bühne (einmalig, Präfix bs-).
 *  LB: Die früheren Statisten-Keyframes (bs-walk-move/-flip, bs-door-traffic)
 *  sind entfallen — Bewegung kommt jetzt aus ambientLife (echte Routen). */
const STAGE_KEYFRAMES = `
  @keyframes bs-blink { 0%,100%{opacity:1} 50%{opacity:.15} }
  @keyframes bs-glow { 0%,100%{box-shadow:0 0 6px 2px rgba(255,200,80,.25)} 50%{box-shadow:0 0 10px 3px rgba(255,200,80,.5)} }
  /* P5: Der Spieler-Marker atmet um GANZE Pixel — ein Sub-Pixel-Schweben würde
     die Pixel-Kante genau da aufweichen, wo sie am meisten auffällt. */
  @keyframes bs-marker-schweben { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-2px)} }
`;

/** Tür eines Raums — sanftes Überblenden zwischen Zu/Auf (R2: kein harter Bild-Tausch). */
function RoomDoor({ room, open }: { room: RoomLayout; open: boolean }) {
  const assets = useAssets();
  const closedUrl = assets.imageUrl('bld_door_closed');
  const openUrl = assets.imageUrl('bld_door_open');
  const base: CSSProperties = {
    position: 'absolute',
    left: room.doorX - STAGE.doorWidth / 2,
    top: wallFootY(room) - STAGE.doorHeight,
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
function AmbientPerson({ a, left, top, height, viewScale }: { a: AmbientFigure; left: number; top: number; height: number; viewScale: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'absolute', left, top, transform: 'translateX(-50%)', zIndex: 5 }}>
      {open && (
        // Sprechblase welt-verankert über der Figurenmitte, aber nativ gerastert (B1/E35).
        <WorldAnchor x={(height / 96) * 48 / 2} y={0} scale={viewScale} z={7}>
          <div
            style={{
              position: 'absolute', bottom: 8, left: 0, transform: 'translateX(-50%)',
              width: 170, backgroundColor: 'rgba(12,12,16,0.94)', border: `1px solid ${StoryModeColors.borderLight}`,
              color: '#e8e4d8', fontFamily: "'VT323', monospace", fontSize: 12, lineHeight: 1.4, padding: '6px 8px',
            }}
            data-testid="ambient-bubble"
          >
            <span style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: '#a89f8c', marginBottom: 2 }}>{a.who}</span>
            {a.line}
          </div>
        </WorldAnchor>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`${a.who} ansprechen`}
        title={`${a.who} ansprechen`}
        // flex-end: Sprite-Unterkante = Container-Unterkante = Wand-Fuß-Linie
        // (sonst steht die Figur um die Skalierungs-Differenz zu hoch — Review B6).
        style={{ width: (height / 96) * 48, height, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      >
        <PixelSprite sheetId={a.figure} animation="idle" fallback="" scale={height / 96} title={a.who} />
      </button>
    </div>
  );
}

/** Basis-Saat für die Ambient-Routen: reproduzierbare Abläufe (auch für die
 *  Visual-Review-Ernte); Varianz kommt aus dem PRNG innerhalb des Tages. */
const AMBIENT_SEED = 0x1b2026;
/** Mount-Zähler für die Saat-Ableitung je Bühnen-Mount (s. AmbientLifeLayer). */
let ambientMountSeq = 0;

/** prefers-reduced-motion, re-subscribed und jsdom-sicher (kein matchMedia dort). */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

const figuresEqual = (a: AmbientFigureSnapshot[], b: AmbientFigureSnapshot[]) =>
  a.length === b.length &&
  a.every((f, i) => f.id === b[i].id && f.x === b[i].x && f.floorLevel === b[i].floorLevel && f.anim === b[i].anim && f.facing === b[i].facing);

/**
 * LB „Lebendiges Gebäude" (Plan §3b c): Abspielkopf der ambientLife-Routen.
 * Eigene Komponente, damit der 60-Hz-Takt NUR diesen kleinen Teilbaum rendert;
 * die Bühne selbst erfährt nur die (seltenen) Tür-Fenster über onDoorsChange.
 * Figuren erscheinen/verschwinden ausschließlich durch Türen — kein Fade.
 */
function AmbientLifeLayer({ onDoorsChange }: { onDoorsChange: (roomIds: string[]) => void }) {
  const assets = useAssets();
  const [figures, setFigures] = useState<AmbientFigureSnapshot[]>([]);
  const doorsKeyRef = useRef('');
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      // Ruhe-Modus: keine laufenden Statisten (stehende bleiben — statisch, klickbar).
      setFigures([]);
      if (doorsKeyRef.current !== '') {
        doorsKeyRef.current = '';
        onDoorsChange([]);
      }
      return;
    }
    // Saat je Mount ableiten: Büro↔Gebäude remountet die Bühne — mit fester
    // Saat wiederholte sich exakt dieselbe Choreographie bei jeder Rückkehr
    // (Review [hoch]). Identische Interaktions-Folge (Ernte) bleibt deterministisch.
    const state = createAmbientLife((AMBIENT_SEED ^ (ambientMountSeq++ * 0x85ebca6b)) >>> 0);
    // Epoche verankern: ambientLife rechnet ab 0, rAF liefert Zeit seit
    // Seitenladen — ohne Offset wären beim (Re-)Mount alle firstAppearanceMs-
    // Termine längst verstrichen → Massen-Auftritt im ersten Frame (Review [hoch]).
    const epoch = performance.now();
    // Ernte-Hilfe (?vqa=1): Auftritt auf einer Ziel-Etage sofort fällig stellen.
    publishVqa({ ambientNudge: (level: number) => nudgeAmbient(state, level, performance.now() - epoch) });
    let raf = 0;
    let cancelled = false;
    const loop = (rafNow: number) => {
      const now = rafNow - epoch;
      tickAmbientLife(state, now);
      const snap = sampleAmbient(state, now);
      setFigures((prev) => (figuresEqual(prev, snap.figures) ? prev : snap.figures));
      const key = snap.openDoorRoomIds.join('|');
      if (key !== doorsKeyRef.current) {
        doorsKeyRef.current = key;
        onDoorsChange(snap.openDoorRoomIds);
      }
      raf = window.requestAnimationFrame(loop);
    };
    // Sheets VORLADEN, bevor die Uhr startet: Die Walk-Sheets laden sonst erst
    // beim allerersten Auftritt — die Figur wäre während des Tür-Beats noch
    // unsichtbar (Bild lädt) und „ploppt" dann mitten im Flur ein (Vision-
    // Review Etappe 3: las wie Fade-in bei geschlossener Tür). 4-s-Deckel,
    // damit ein hängendes Bild die Belebung nicht dauerhaft blockiert.
    const sheetUrls = AMBIENT_AGENTS.flatMap((a) => [a.walkSheet, a.idleSheet])
      .map((id) => assets.imageUrl(id))
      .filter((u): u is string => !!u);
    const preload = Promise.all(
      sheetUrls.map(
        (url) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = url;
          }),
      ),
    );
    const deadline = new Promise<void>((resolve) => window.setTimeout(resolve, 4000));
    Promise.race([preload, deadline]).then(() => {
      if (!cancelled) raf = window.requestAnimationFrame(loop);
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
    };
  }, [reduced, onDoorsChange, assets]);

  return (
    <>
      {figures.map((f) => {
        const floor = layout.floors.find((fl) => fl.level === f.floorLevel);
        if (!floor || !assets.imageUrl(f.sheet)) return null;
        return (
          <Fragment key={f.id}>
          <Bodenschatten x={f.x} y={wallFootY(floor)} breite={(AMBIENT_HEIGHT / 96) * 40} staerke={0.3} />
          <div
            data-bs-walker={f.id}
            aria-hidden
            style={{
              position: 'absolute',
              left: f.x,
              top: wallFootY(floor) - AMBIENT_HEIGHT, // Füße auf die Wand-Fuß-Linie (B6)
              width: (AMBIENT_HEIGHT / 96) * 48,
              height: AMBIENT_HEIGHT,
              transform: 'translateX(-50%)',
              zIndex: 5, // vor der Tür (4), hinter dem Avatar (6): tritt sichtbar aus dem Türrahmen
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              lineHeight: 0,
            }}
          >
            <PixelSprite
              sheetId={f.sheet}
              animation={f.anim}
              fallback=""
              flip={f.facing === -1}
              scale={AMBIENT_HEIGHT / 96}
              frameTimeMs={f.anim === 'walk' ? ambientWalkFrameTimeMs(f.speedPxS, AMBIENT_HEIGHT) : undefined}
              title=""
            />
          </div>
          </Fragment>
        );
      })}
    </>
  );
}

export function BuildingStage({ npcs, nav, onRoomClick, onOpenDirectory, interactive = true, month, pfoertnerLine, risk = 0, moralWeight = 0, attention = 0, auftragId = 'keil' }: BuildingStageProps) {
  const assets = useAssets();
  const npcById = new Map(npcs.map((n) => [n.id, n]));
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ scale: 1, h: 600, w: 800 });
  const [hoverRoom, setHoverRoom] = useState<string | null>(null);
  const [hoverShaft, setHoverShaft] = useState(false);
  const [pfoertnerOpen, setPfoertnerOpen] = useState(false); // Strang 5: Pförtner-Sprechblase
  // LB: Türen, die gerade von Ambient-Statisten benutzt werden (RoomDoor-Blende).
  const [ambientDoors, setAmbientDoors] = useState<string[]>([]);
  // P7/§14.4: angeklicktes Detail-Objekt (Plakat/Reißwolf/Kaffeeküche/Automat/…): Vergrößerung + Spruch.
  const [poster, setPoster] = useState<{ url: string; titel_de: string; slogan_de: string } | null>(null);
  // P7/§14.4 (#8): bei jedem Klick auf die „Mitarbeiter des Monats"-Wand wechselt der Deckname.
  const [employeeClicks, setEmployeeClicks] = useState(0);

  // Schritt-Sound auf den Kontakt-Frames des Laufzyklus (Frame 0 und 4).
  const handleWalkFrame = useCallback((frame: number) => {
    if (frame === 0 || frame === 4) playSound('footsteps');
  }, []);

  // dpr über den re-subscribenden Hook (Review-Fix: eine feste dppx-Query erkennt
  // nur den ERSTEN Wechsel — useDpr registriert nach jedem Wechsel neu, Memo §1).
  const dpr = useDpr();
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () =>
      setView({
        // Gebäude schmaler als der Schirm: Stadt bleibt links/rechts sichtbar.
        // §4.1/B1: nur pixel-saubere Faktoren (physisch ganzzahlig bzw. Stammbruch) —
        // der frühere freie Float (~0,544) hat die gesamte Welt-Ebene weichgezeichnet.
        scale: snapPixelScale(el.clientWidth / (layout.width * CITY_MARGIN_FACTOR), dpr),
        h: el.clientHeight,
        w: el.clientWidth,
      });
    update();
    const obs = new ResizeObserver(update);
    obs.observe(el);
    return () => obs.disconnect();
  }, [dpr]);

  // Kamera: Etage des Avatars vertikal zentrieren (geklemmt auf Gebäudegrenzen).
  // Offsets auf ganze Geräte-Pixel gerundet, damit das Sampling-Raster stabil liegt.
  const avatarFloor = layout.floors.find((f) => f.level === Math.round(nav.pos.floorLevel));
  const focusY = (avatarFloor ? avatarFloor.y + STAGE.floorHeight / 2 : layout.height / 2) * view.scale;
  const stageH = layout.height * view.scale;
  const cameraY = snapToDevicePixel(Math.max(0, Math.min(Math.max(0, stageH - view.h), focusY - view.h / 2)));
  const stageLeft = snapToDevicePixel((view.w - layout.width * view.scale) / 2);

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
  // Tageszeit-Skylines (Dämmerung/Nacht) blenden über die Basis ein — siehe skylineLayersForMinutes.
  const cityDuskUrl = assets.imageUrl('bld_city_far_dusk');
  const cityNightUrl = assets.imageUrl('bld_city_far_night');
  const streetUrl = assets.imageUrl('bld_street');
  const undergroundUrl = assets.imageUrl('bld_underground');
  // Tageszeit-Himmel (gegen „schwarzer Himmel zu groß"): Verlauf folgt der Tagesuhr,
  // die chroma-freigestellte Skyline liegt davor.
  const skyMinutes = useDayClockStore((s) => s.minutes);
  // Avatar-Sheets folgen der Geschlechter-Wahl aus der Personalakte (P2-9).
  const portraitId = usePlayerProfile((s) => s.portraitId);
  const avatarWalkSheet = playerWalkSheetId(portraitId);
  const avatarIdleSheet = playerIdleSheetId(portraitId);
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
    : (avatarFloorLayout ? wallFootY(avatarFloorLayout) - STAGE.avatarSize : 0); // Füße auf der Wand-Fuß-Linie

  // Stadt-Geometrie (im Container-Maß, hinter der skalierten Bühne).
  const groundScreenY = snapToDevicePixel((layout.height - STAGE.groundHeight) * view.scale - cameraY);
  // Untergrund: Erde/Rohre hinter & unter dem Keller (unterste Etage), damit die
  // Skyline nicht „hängt" und der Keller als unterirdisch lesbar wird (Owner-Befund).
  const lowestFloorY = layout.floors.length > 0 ? layout.floors[layout.floors.length - 1].y : layout.height - STAGE.floorHeight;
  const undergroundTopY = snapToDevicePixel((lowestFloorY - STAGE.slabHeight) * view.scale - cameraY);

  // P13: Wo hört der freie Himmel auf? Das Skyline-Band beginnt an der Bodenlinie
  // und ist CITY_BAND_NATIVE_H hoch; seine obersten 38 % sind wegmaskiert
  // (`mask: linear-gradient(to top, #000 62%, transparent)`), dort scheint der
  // Himmel also noch durch. Ab da deckt die Stadt. Genau dieser Anteil geht in den
  // Verlauf — sonst landet der helle Horizont-Stützpunkt hinter der Skyline.
  const himmelBisY = groundScreenY - CITY_BAND_NATIVE_H * view.scale * 0.62;
  const sichtbarerHimmel = view.h > 0 ? himmelBisY / view.h : 1;

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: skyGradientForMinutes(skyMinutes, 540, sichtbarerHimmel), transition: 'background 800ms linear' }}
      data-testid="building-stage"
    >
      <style>{STAGE_KEYFRAMES}</style>

      {/* ───── Stadt: Skyline hinter dem Haus (Tag/Dämmerung/Nacht überblendet) ───── */}
      {cityUrl && (() => {
        const skyline = skylineLayersForMinutes(skyMinutes);
        // Gemeinsame Geometrie/Maske für alle Tageszeit-Skylines; nur die Opazität unterscheidet sie.
        const layerStyle = (url: string, opacity: number): CSSProperties => ({
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: Math.max(0, view.h - groundScreenY),
          // Skyline im WELT-Maßstab (native 864 × Bühnen-Scale): eine Stadt, ein
          // Faktor — und pixel-sauber statt des früheren freien Deckels (B1).
          height: CITY_BAND_NATIVE_H * view.scale,
          backgroundImage: `url(${url})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: 'center bottom',
          imageRendering: 'pixelated',
          opacity,
          transition: 'opacity 1200ms linear',
          // Natürlicher Übergang Stadt → Himmel: oberer Rand sanft ausblenden (kein harter Schnitt).
          WebkitMaskImage: 'linear-gradient(to top, #000 62%, transparent 100%)',
          maskImage: 'linear-gradient(to top, #000 62%, transparent 100%)',
          pointerEvents: 'none',
        });
        return (
          <>
            <div aria-hidden style={layerStyle(cityUrl, 0.95)} />
            {cityDuskUrl && <div aria-hidden style={layerStyle(cityDuskUrl, skyline.dusk)} />}
            {cityNightUrl && <div aria-hidden style={layerStyle(cityNightUrl, skyline.night)} />}
          </>
        );
      })()}
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
                // Band im Welt-Maßstab (statt „100 % der Restfläche" = freier Faktor);
                // unterhalb füllt die backgroundColor die Erde auf.
                backgroundSize: `auto ${(undergroundUrl ? CITY_BAND_NATIVE_H : STREET_BAND_NATIVE_H) * view.scale}px`,
                backgroundPosition: 'center top',
                imageRendering: 'pixelated',
              }
            : { borderTop: '3px solid #2c2d35' }),
          pointerEvents: 'none',
        }}
      />

      {/* ───── Das Gebäude (pixel-saubere Bühne, mittig) ─────
          Zwei Ebenen (Memo §1): außen NUR die Kamerafahrt (transition),
          innen NUR die statische Skalierung — so interpoliert die Transition
          nie den Scale (Zwischenwerte = Matsch) und Offsets bleiben ganzzahlig. */}
      <div
        style={{
          position: 'absolute',
          left: stageLeft,
          top: 0,
          width: layout.width * view.scale,
          height: layout.height * view.scale,
          transform: `translateY(${-cameraY}px)`,
          transition: 'transform 700ms ease-in-out',
        }}
      >
      <div
        data-testid="building-stage-world"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: layout.width,
          height: layout.height,
          transform: `scale(${view.scale})`,
          transformOrigin: 'top left',
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
              backgroundColor: WORLD_RED,
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
                // P7/§14.4 (#4): die große Büropflanze welkt sichtbar je nach moralischer Last.
                const displayId = plantAsset(d.id, moralWeight);
                const url = assets.imageUrl(displayId);
                if (!url) return null;
                const h = DECOR_HEIGHT[d.id] ?? 48;
                const playableW = layout.shaft.x - STAGE.pillarWidth;
                const cx = STAGE.pillarWidth + d.xFrac * playableW;
                const baseline = wallFootY(floor); // Wand-Fuß-Linie
                const top = d.mount === 'floor'
                  ? baseline - h
                  // Wand-Objekte oberes Drittel; yOffset = per-Objekt-Korrektur
                  // (B12b: z. B. Wanduhr auf 2,0 m statt Brusthöhe).
                  : floor.y + STAGE.floorHeight * 0.36 - h / 2 + (d.yOffset ?? 0);
                // P7/§14.4: anklickbare, state-reaktive Umgebung — alle nutzen dasselbe Detail-Overlay.
                // Plakate (Spruch), Reißwolf (Entdeckungsdruck), Kaffeeküche (Wirtschaftslage),
                // Volksbrause (Narrativ/Auftrag), Mitarbeiter-Wand (Deckname zyklisch), Pflanze (Moral).
                const slogan = POSTER_SLOGANS[d.id];
                const isPlant = d.id === 'prop_plant_tall' || d.id === 'prop_plant_small';
                const isEmployee = d.id === 'prop_employee_wall';
                const detail = slogan
                  ? { url, titel_de: slogan.titel_de, slogan_de: slogan.slogan_de }
                  : d.id === 'prop_shredder'
                    ? { url, titel_de: 'AKTENVERNICHTER', slogan_de: shredderLine(risk) }
                  : d.id === 'prop_coffee_station'
                    ? { url, titel_de: 'KAFFEEKÜCHE', slogan_de: coffeeLine(risk, attention, moralWeight) }
                  : d.id === 'prop_vending'
                    ? { url, titel_de: 'VOLKSBRAUSE', slogan_de: volksbrauseLine(auftragId) }
                  : isEmployee
                    ? { url, titel_de: 'MITARBEITER DES MONATS', slogan_de: employeeOfMonth(employeeClicks).spruch }
                  : isPlant
                    ? { url, titel_de: 'BÜROPFLANZE', slogan_de: plantLine(moralWeight) }
                    : null;
                const clickable = interactive && !!detail;
                // Mitarbeiter-Wand: Klick zeigt den aktuellen Deckname und schaltet auf den nächsten weiter.
                const onDetailClick = isEmployee
                  ? () => { setPoster(detail); setEmployeeClicks((c) => c + 1); }
                  : detail
                    ? () => setPoster(detail)
                    : undefined;
                return (
                  <img
                    key={`${floor.id}-decor-${i}`}
                    src={url}
                    alt={detail ? detail.titel_de : ''}
                    aria-hidden={detail ? undefined : true}
                    title={clickable ? 'Ansehen' : undefined}
                    onClick={clickable ? onDetailClick : undefined}
                    style={{
                      position: 'absolute',
                      left: cx,
                      top,
                      height: h,
                      width: 'auto',
                      transform: 'translateX(-50%)',
                      imageRendering: 'pixelated',
                      pointerEvents: clickable ? 'auto' : 'none',
                      cursor: clickable ? 'pointer' : undefined,
                      zIndex: 2,
                    }}
                  />
                );
              })}
              {/* Strang 5: stehende Flavor-Statisten (Reinigung/Kollege) — Lebendigkeit. */}
              {!isLobby && (FLOOR_AMBIENT[floor.id] ?? []).map((a, i) => {
                if (!assets.imageUrl(a.figure)) return null;
                const cx = STAGE.pillarWidth + a.xFrac * (layout.shaft.x - STAGE.pillarWidth);
                const top = wallFootY(floor) - AMBIENT_HEIGHT;
                return <AmbientPerson key={`${floor.id}-amb-${i}`} a={a} left={cx} top={top} height={AMBIENT_HEIGHT} viewScale={view.scale} />;
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
              {/* Etagen-Schild — welt-verankert, nativ gerastert (B1/E35).

                  P12 (Fremdmodell-Durchgang 2026-08-22): Der Anker sitzt jetzt auf
                  `floor.y`, der Abstand steht in CSS-px. Vorher war das +8 ein
                  WELT-Offset — WorldAnchor kehrt die Bühnen-Skalierung für seine
                  Kinder aber um, das Türschild darunter rechnete also in CSS-px.
                  Zwei Ebenen, zwei Maßeinheiten: Bei 1280 px sah das zufällig fast
                  richtig aus, bei jedem anderen Zoom liefen die Schilder auseinander.
                  4 CSS-px ≙ dem bisherigen Welt-Offset bei Bühnen-Scale ½. */}
              <WorldAnchor x={STAGE.pillarWidth + 8} y={floor.y} scale={view.scale} z={5}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    whiteSpace: 'nowrap',
                    padding: '2px 6px',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1,
                    color: '#c8c8b8',
                    backgroundColor: 'rgba(10,10,14,0.72)',
                    border: '1px solid #34353d',
                  }}
                >
                  {floor.label_de}
                </div>
              </WorldAnchor>
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
            ? WORLD_RED
            : npc && !npc.available
              ? '#444'
              : '#ffd479';
          return (
            <div key={room.id}>
              <RoomDoor room={room} open={nav.openDoorRoomId === room.id || ambientDoors.includes(room.id)} />
              {/* Türschild über der Tür — welt-verankert, nativ gerastert (B1/E35).
                  Sitzt in der DECKEN-Band-Spur (bottom 20), damit es nicht mit dem
                  Etagen-Schild kollidiert — native Rasterung braucht 2× Welt-Platz. */}
              <WorldAnchor x={room.doorX} y={wallFootY(room) - STAGE.doorHeight} scale={view.scale} z={5}>
                <span
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 0,
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: hovered || isTarget ? '#0d0d0d' : '#e8e4d8',
                    backgroundColor: hovered || isTarget ? WORLD_AMBER : 'rgba(10,10,14,0.78)',
                    border: `1px solid ${npc?.inCrisis ? WORLD_RED : '#3a3b43'}`,
                    padding: '1px 4px',
                    transition: 'background-color 140ms ease, color 140ms ease',
                  }}
                >
                  {room.label_de}
                  {npc ? ` · ${npc.name.split(' ')[0]}` : ''}
                </span>
              </WorldAnchor>
              {/* Status-Lampe neben der Tür (Krise blinkt rot) */}
              <span
                style={{
                  position: 'absolute',
                  left: room.doorX + STAGE.doorWidth / 2 + 8,
                  top: wallFootY(room) - STAGE.doorHeight + 10,
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
                  top: wallFootY(room) - STAGE.doorHeight - 40,
                  width: STAGE.doorWidth + 48,
                  height: STAGE.doorHeight + 40,
                  background: 'transparent',
                  border: hovered ? `2px solid ${WORLD_AMBER}` : '2px solid transparent',
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
          const pBottom = wallFootY(lobby);
          return (
            <div style={{ position: 'absolute', left: px, top: pBottom - pH, transform: 'translateX(-50%)', zIndex: 5 }}>
              {pfoertnerOpen && pfoertnerLine && (
                // Sprechblase welt-verankert über der Figurenmitte, nativ gerastert (B1/E35).
                <WorldAnchor x={(48 * 1.2) / 2} y={0} scale={view.scale} z={7}>
                  <div
                    style={{
                      // Öffnet nach UNTEN-rechts in die leere Hallenfläche — nach oben
                      // verdeckte die Blase das EG-Etagen-Schild (Vision-Review Etappe 1).
                      position: 'absolute', top: -4, left: 36,
                      width: 230, backgroundColor: 'rgba(12,12,16,0.94)',
                      border: `1px solid ${StoryModeColors.borderLight}`, color: '#e8e4d8',
                      fontFamily: "'VT323', monospace", fontSize: 12, lineHeight: 1.4, padding: '6px 8px',
                    }}
                  >
                    <span style={{ display: 'block', fontSize: 10, letterSpacing: 1, color: '#a89f8c', marginBottom: 2 }}>PFÖRTNER</span>
                    {pfoertnerLine}
                  </div>
                </WorldAnchor>
              )}
              <button
                onClick={() => setPfoertnerOpen((o) => !o)}
                aria-label="Pförtner ansprechen"
                title="Pförtner ansprechen"
                style={{ width: 48 * 1.2, height: pH, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
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
              {/* R5: sanftes Überblenden Türen auf/zu statt hartem Bild-Tausch.
                  B9-Z-Ordnung: offenes Kabinenbild UNTER dem Avatar, geschlossene
                  Türen DARÜBER — so verdecken zugefahrene Türen die Figur, statt
                  dass die Türnaht durch sie hindurchläuft. */}
              <img src={cabinOpenUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', imageRendering: 'pixelated', opacity: nav.cabinDoorsOpen ? 1 : 0, transition: 'opacity 300ms ease', zIndex: 1 }} />
              {nav.avatarInCabin && (
                <span style={{ position: 'absolute', left: '50%', bottom: 22, transform: 'translateX(-50%)', zIndex: 2 }}>
                  <PixelSprite sheetId={avatarIdleSheet} animation="idle" fallback="•" scale={2} title="Sie" />
                </span>
              )}
              <img src={cabinClosedUrl} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill', imageRendering: 'pixelated', opacity: nav.cabinDoorsOpen ? 0 : 1, transition: 'opacity 300ms ease', zIndex: 3 }} />
            </>
          ) : (
            <>
              <div style={{ width: '100%', height: '100%', backgroundColor: '#2a2b33', border: '3px solid #44454d', boxSizing: 'border-box' }} />
              {nav.avatarInCabin && (
                <span style={{ position: 'absolute', left: '50%', bottom: 22, transform: 'translateX(-50%)', zIndex: 2 }}>
                  <PixelSprite sheetId={avatarIdleSheet} animation="idle" fallback="•" scale={2} title="Sie" />
                </span>
              )}
            </>
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
              border: `2px solid ${hoverShaft ? WORLD_AMBER : 'transparent'}`,
              cursor: 'pointer',
              zIndex: 5,
            }}
          >
            {/* Ruf-Plakette am Schachtkopf (über der Traufe) — welt-verankert, nativ
                gerastert (B1); sitzt ÜBER der Türschild-Spur von Etage 4, sonst
                kollidieren beide seit der nativen Rasterung. */}
            <WorldAnchor x={layout.shaft.w / 2} y={-48} scale={view.scale}>
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  transform: 'translateX(-50%)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  padding: '2px 6px',
                  color: hoverShaft ? '#0d0d0d' : '#c8c8b8',
                  backgroundColor: hoverShaft ? WORLD_AMBER : 'rgba(10,10,14,0.8)',
                  border: `1px solid ${StoryModeColors.borderLight}`,
                  whiteSpace: 'nowrap',
                  // WorldAnchor nimmt den Teilbaum aus dem Hit-Testing — die Plakette
                  // selbst bleibt klickbar (bubbelt zum Schacht-Button, Review-Fix).
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                }}
              >
                ETAGEN ▲▼
              </span>
            </WorldAnchor>
          </button>
        )}

        {/* LB: Routen-Statisten (erscheinen/verschwinden durch Türen, ambientLife) */}
        <AmbientLifeLayer onDoorsChange={setAmbientDoors} />

        {/* Avatar (läuft/steht) + Bodenschatten + Spieler-Marker.

            P5: Die einzige eingebaute Unterscheidung zwischen Avatar und Statisten
            war ein Höhen-Delta (128 gegen 112/116 px) — das drückt der Bühnen-Scale ½
            auf 6–8 Bildschirm-Pixel zusammen, bei identischer Blaugrau-Palette.
            Der Stil-Guide VERBIETET der Spielfigur auffällige Merkmale
            (game-style-guide.md:55-58), die Unterscheidung muss also aus dem
            Renderer kommen und nicht aus dem Sprite. Deshalb ein Marker darüber,
            nicht ein bunteres Sprite. */}
        {!nav.avatarInCabin && (
          <>
          <Bodenschatten x={nav.pos.x} y={avatarY + STAGE.avatarSize} breite={STAGE.avatarSize * 0.42} />
          <WorldAnchor x={nav.pos.x} y={avatarY} scale={view.scale} z={7}>
            <div
              aria-hidden
              style={{
                position: 'absolute',
                left: 0,
                // Über dem Kopf: der Anker sitzt an der Sprite-Oberkante, der
                // Marker eine Zeile darüber. CSS-px, damit er bei jedem Zoom
                // gleich groß bleibt (der Anker kehrt die Bühnen-Skalierung um).
                bottom: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                lineHeight: 1,
                animation: 'bs-marker-schweben 2.4s ease-in-out infinite',
              }}
            >
              <span
                style={{
                  fontFamily: "'Silkscreen', ui-monospace, monospace",
                  fontSize: 10,
                  letterSpacing: 1,
                  color: StoryModeColors.document,
                  backgroundColor: 'rgba(24,20,14,0.82)',
                  border: `1px solid ${StoryModeColors.borderLight}`,
                  padding: '1px 4px',
                }}
              >
                SIE
              </span>
              {/* Pixel-Dreieck, das auf den Kopf zeigt — harte Kante, kein Glow. */}
              <span
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: `5px solid ${StoryModeColors.borderLight}`,
                }}
              />
            </div>
          </WorldAnchor>
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
              sheetId={nav.mode === 'walk' ? avatarWalkSheet : avatarIdleSheet}
              animation={nav.mode === 'walk' ? 'walkRight' : 'idle'}
              fallback="•"
              flip={nav.facing === -1}
              scale={2}
              title="Sie"
              frameTimeMs={nav.mode === 'walk' ? WALK_FRAME_TIME_MS : undefined}
              onFrame={nav.mode === 'walk' ? handleWalkFrame : undefined}
            />
          </span>
          </>
        )}
      </div>
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
            background: scrim('leicht'), cursor: 'pointer', padding: 24,
          }}
        >
          <img
            src={poster.url}
            alt={`Plakat: ${poster.titel_de}`}
            style={{
              maxHeight: '52vh', maxWidth: '88vw', width: 'auto',
              imageRendering: 'pixelated',
              border: `4px solid ${StoryModeColors.ministryRed}`,
            }}
          />
          <div style={{ maxWidth: 520, textAlign: 'center' }}>
            <div style={{ fontFamily: "'VT323', monospace", fontWeight: 900, letterSpacing: 3, color: WORLD_AMBER, fontSize: 14, marginBottom: 6 }}>
              {poster.titel_de}
            </div>
            <div style={{ fontFamily: "'VT323', monospace", color: '#e8e4d8', fontSize: 13, lineHeight: 1.5, fontStyle: 'italic' }}>
              „{poster.slogan_de}"
            </div>
            <div style={{ fontFamily: "'VT323', monospace", color: '#a89f8c', fontSize: 10, marginTop: 12 }}>
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
