/**
 * BuildingView — TVTower-Querschnitt (Track A-1, 2026-05-31)
 *
 * Datengetriebene Gebäude-Ansicht: Etagen + Räume aus `data/building.json`,
 * jeder Raum verweist auf einen NPC und sitzt in einer Spalte (`col`, 1=A).
 * CSS-first (noch keine Grafik) — dient zugleich als sichtbare Skizze UND
 * lebende Dokumentation der Struktur.
 *
 * Koordinatensystem (Entwickler-Overlay, ein-/ausschaltbar):
 *   Zelle = <Spalte><Etage>, z. B. B2 = Medien-Zentrum, A0 = Finanzen (Keller).
 *   Damit lässt sich über Positionen reden, ohne Screenshots. Später legt sich
 *   dasselbe Raster über das HUD (Sendung/Publikum) und echte Assets.
 *   Konzept: docs/story-mode/BROADCAST_AND_AUDIENCE_CONCEPT.md
 *
 * Klick auf einen Raum -> öffnet den NPC-Dialog (bestehende Logik via `onRoomClick`).
 * Der klassische `OfficeScreen` bleibt über den View-Umschalter erreichbar.
 *
 * Plan & nächste Schritte: docs/BUILDING_AND_ASSETS.md · Bauplan: ../BUILDING_CONCEPT.md
 */
import { useState } from 'react';
import buildingData from '../data/building.json';
import { StoryModeColors } from '../theme';
import { useAssets } from '../assets/useAssets';
import { useSprite } from '../assets/useSprite';

interface BuildingFloor {
  id: string;
  level: number;
  label_de: string;
  label_en?: string;
}

interface BuildingRoom {
  id: string;
  floor: string;
  /** Räume ohne npcId sind begehbare Orte (Lobby, Spielerbüro) — hier (noch) nicht klickbar. */
  npcId?: string;
  icon: string;
  label_de: string;
  label_en?: string;
  /** 1-basierte Spalte (1=A) für das Koordinatensystem. */
  col?: number;
  colSpan?: number;
}

/** Minimaler NPC-Ausschnitt, den die Ansicht braucht (NPCState ist strukturell kompatibel). */
interface BuildingNpc {
  id: string;
  name: string;
  morale: number;
  available: boolean;
  inCrisis?: boolean;
}

interface BuildingViewProps {
  npcs: BuildingNpc[];
  /** Wird mit der npcId des Raums aufgerufen (öffnet den NPC-Dialog). */
  onRoomClick: (npcId: string) => void;
}

const floors = (buildingData.floors as BuildingFloor[])
  .slice()
  .sort((a, b) => b.level - a.level); // oberste Etage zuerst (Querschnitt)
const rooms = buildingData.rooms as BuildingRoom[];

/** Anzahl Spalten = größte vorkommende `col` (mind. 1). */
const colCount = Math.max(1, ...rooms.map((r) => r.col ?? 1));
/** 1 -> "A", 2 -> "B", ... */
const colLetter = (col: number): string => String.fromCharCode(64 + col);

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
  gap: '0.75rem',
} as const;

function moraleColor(morale: number): string {
  if (morale < 30) return StoryModeColors.danger;
  if (morale < 60) return StoryModeColors.warning;
  return StoryModeColors.success;
}

/** Fahrstuhl-Schacht mit ambient animierter Kabine (CSS-only). Adressierbar als „L". */
function ElevatorShaft({ showCoords }: { showCoords: boolean }) {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-12 flex flex-col">
      <div className="relative flex-1 border-2" style={{ borderColor: '#2a2a2a', backgroundColor: '#101010' }}>
        {showCoords && (
          <span
            className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[10px] font-bold z-10"
            style={{ color: StoryModeColors.warning }}
          >
            L
          </span>
        )}
        {/* Status-LED */}
        <span
          className="absolute top-1 right-1 rounded-full"
          style={{ width: 6, height: 6, backgroundColor: StoryModeColors.danger, animation: 'bv-blink 1.4s ease-in-out infinite' }}
        />
        {/* Kabine (fährt) */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: 30,
            height: '26%',
            top: '2%',
            backgroundColor: '#2a2a2a',
            border: '2px solid #444',
            animation: 'bv-elevator 9s ease-in-out infinite',
          }}
          title="Fahrstuhl (L)"
        >
          <div className="h-full mx-auto" style={{ width: 1, backgroundColor: '#111' }} />
        </div>
      </div>
    </div>
  );
}

/**
 * Figur im Raum: animiertes Sprite (figure_<npcId>, Animation "idle") aus dem
 * Asset-Manifest — fehlt es, bleibt das bisherige 🧍-Emoji.
 */
function RoomFigure({ npcId, title }: { npcId: string; title: string }) {
  const assets = useAssets();
  const sprite = useSprite(assets.sheet(`figure_${npcId}`), 'idle');
  if (sprite) {
    return <span style={sprite.style} title={title} aria-label={title} />;
  }
  return (
    <span className="text-base" style={{ animation: 'bv-bob 3s ease-in-out infinite' }} title={title}>
      🧍
    </span>
  );
}

/** Kleine ambiente Animation je Raum (CSS-only). */
function RoomAmbient({ roomId }: { roomId: string }) {
  if (roomId === 'medien_zentrum') {
    return (
      <span className="text-[9px] font-bold" style={{ color: StoryModeColors.danger, animation: 'bv-blink 1.4s ease-in-out infinite' }} title="Sendung läuft">
        ● ON AIR
      </span>
    );
  }
  if (roomId === 'cyber_lab') {
    return (
      <span className="text-[10px]" style={{ animation: 'bv-flicker 1.1s steps(2) infinite' }} title="Monitore">
        🟩
      </span>
    );
  }
  return null;
}

export function BuildingView({ npcs, onRoomClick }: BuildingViewProps) {
  const npcById = new Map(npcs.map((n) => [n.id, n]));
  const [showCoords, setShowCoords] = useState(false);
  const assets = useAssets();

  return (
    <div className="h-full w-full overflow-auto p-6" style={{ backgroundColor: '#0d0d0d' }}>
      <style>{`
        @keyframes bv-elevator { 0%,12%{top:2%} 30%,42%{top:38%} 60%,72%{top:74%} 90%,100%{top:2%} }
        @keyframes bv-blink { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes bv-flicker { 0%,100%{opacity:1} 45%{opacity:.4} 50%{opacity:.9} 55%{opacity:.3} }
        @keyframes bv-bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
      `}</style>
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-wide" style={{ color: StoryModeColors.warning }}>
              🏢 AGENTUR-GEBÄUDE
            </h2>
            <p className="text-xs" style={{ color: '#888' }}>
              Klicke einen Raum, um die Person zu sprechen. (Skizze — der klassische „Büro"-Blick bleibt oben umschaltbar.)
            </p>
          </div>
          <button
            onClick={() => setShowCoords((v) => !v)}
            aria-pressed={showCoords}
            className="shrink-0 px-2 py-1 text-xs font-semibold rounded border-2 transition-colors"
            style={{
              borderColor: showCoords ? StoryModeColors.warning : '#3a3a3a',
              backgroundColor: showCoords ? StoryModeColors.warning : 'transparent',
              color: showCoords ? '#0d0d0d' : '#aaa',
            }}
            title="Entwickler-Raster ein-/ausblenden (Spalte A–… × Etage)"
          >
            🧭 Koordinaten
          </button>
        </div>

        {/* Spaltenkopf (A, B, …) — nur mit Overlay; auf die Etagen-Spalten ausgerichtet */}
        {showCoords && (
          <div className="mb-1 flex gap-2 pr-14">
            <div className="shrink-0 w-8" />
            <div className="flex-1 px-3" style={gridStyle}>
              {Array.from({ length: colCount }, (_, i) => (
                <div
                  key={i}
                  className="text-center text-xs font-bold"
                  style={{ color: StoryModeColors.warning }}
                >
                  {colLetter(i + 1)}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative flex flex-col gap-3 pr-14">
          {floors.map((floor) => {
            const floorRooms = rooms.filter((r) => r.floor === floor.id);
            const byCol = new Map(floorRooms.map((r) => [r.col ?? 1, r]));
            return (
              <div key={floor.id} className="flex items-stretch gap-2">
                {/* Etagen-Nummer (Zeilen-Koordinate) — nur mit Overlay */}
                {showCoords && (
                  <div
                    className="shrink-0 w-8 flex items-center justify-center text-sm font-bold"
                    style={{ color: StoryModeColors.warning }}
                    title={floor.label_de}
                  >
                    {floor.level}
                  </div>
                )}
                <div
                  className="flex-1 border-2"
                  style={{ borderColor: '#2a2a2a', backgroundColor: '#141414' }}
                >
                  <div
                    className="px-3 py-1 text-xs font-semibold tracking-wider"
                    style={{ backgroundColor: '#1f1f1f', color: '#aaa', borderBottom: '1px solid #2a2a2a' }}
                  >
                    {floor.label_de}
                  </div>

                  <div className="p-3" style={gridStyle}>
                    {Array.from({ length: colCount }, (_, i) => {
                      const col = i + 1;
                      const room = byCol.get(col);
                      const code = `${colLetter(col)}${floor.level}`;

                      if (!room) {
                        // Leere, aber adressierbare Zelle (nur im Overlay sichtbar).
                        return (
                          <div
                            key={`empty-${col}`}
                            className="border-2 border-dashed flex items-center justify-center"
                            style={{ minHeight: 96, borderColor: showCoords ? '#2f2f2f' : 'transparent' }}
                          >
                            {showCoords && (
                              <span className="text-[10px]" style={{ color: '#444' }}>
                                {code}
                              </span>
                            )}
                          </div>
                        );
                      }

                      const npc = room.npcId ? npcById.get(room.npcId) : undefined;
                      const available = room.npcId ? (npc?.available ?? true) : false;
                      // Raum-Hintergrund aus dem Asset-Manifest (room_<id>);
                      // dunkler Verlauf hält Text/Badges lesbar. Ohne Asset: CSS-Look.
                      const bgUrl = assets.imageUrl(`room_${room.id}`);
                      return (
                        <button
                          key={room.id}
                          onClick={() => room.npcId && onRoomClick(room.npcId)}
                          disabled={!available}
                          className="relative flex flex-col items-start text-left border-2 p-3 transition-transform hover:-translate-y-0.5"
                          style={{
                            borderColor: npc?.inCrisis ? StoryModeColors.danger : '#3a3a3a',
                            backgroundColor: '#1a1a1a',
                            ...(bgUrl
                              ? {
                                  backgroundImage: `linear-gradient(rgba(10,10,10,0.45), rgba(10,10,10,0.7)), url(${bgUrl})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  imageRendering: 'pixelated',
                                  minHeight: 120,
                                }
                              : {}),
                            opacity: available ? 1 : 0.45,
                            cursor: available ? 'pointer' : 'not-allowed',
                          }}
                          title={available ? `${room.label_de} (${code}) öffnen` : 'Aktuell nicht verfügbar'}
                        >
                          {showCoords && (
                            <span
                              className="absolute top-1 right-1 text-[10px] font-bold px-1 rounded"
                              style={{ backgroundColor: StoryModeColors.warning, color: '#0d0d0d' }}
                            >
                              {code}
                            </span>
                          )}
                          <div className="flex items-center gap-2 w-full">
                            <span style={{ fontSize: 22 }}>{room.icon}</span>
                            <span className="text-sm font-bold" style={{ color: '#eee' }}>
                              {room.label_de}
                            </span>
                            <span className="ml-auto flex items-center gap-1">
                              <RoomAmbient roomId={room.id} />
                              {room.npcId && <RoomFigure npcId={room.npcId} title={npc?.name ?? room.npcId} />}
                            </span>
                          </div>
                          <div className="text-xs mt-1" style={{ color: '#9aa' }}>
                            {npc?.name ?? room.label_de}
                          </div>
                          <div className="flex items-center gap-2 mt-2 w-full">
                            <div className="flex-1 h-1.5" style={{ backgroundColor: '#333' }}>
                              <div
                                className="h-full transition-all"
                                style={{
                                  width: `${Math.max(0, Math.min(100, npc?.morale ?? 0))}%`,
                                  backgroundColor: moraleColor(npc?.morale ?? 0),
                                }}
                              />
                            </div>
                            {npc?.inCrisis && (
                              <span
                                className="text-[10px] font-bold px-1"
                                style={{ backgroundColor: StoryModeColors.danger, color: '#fff' }}
                              >
                                KRISE
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Fahrstuhl-Schacht (L) — ambiente CSS-Animation rechts neben den Etagen */}
          <ElevatorShaft showCoords={showCoords} />
        </div>

        {showCoords && (
          <p className="mt-3 text-[11px]" style={{ color: '#666' }}>
            🧭 Raster: <b>Spalte</b> (A–{colLetter(colCount)}) × <b>Etage</b> (0 = Keller). Zelle ={' '}
            <code>&lt;Spalte&gt;&lt;Etage&gt;</code> — z. B. <b>B2</b> = Medien-Zentrum, <b>A0</b> = Finanzen.
          </p>
        )}
      </div>
    </div>
  );
}

export default BuildingView;
