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

interface BuildingFloor {
  id: string;
  level: number;
  label_de: string;
  label_en?: string;
}

interface BuildingRoom {
  id: string;
  floor: string;
  npcId: string;
  icon: string;
  label_de: string;
  label_en?: string;
  /** 1-basierte Spalte (1=A) für das Koordinatensystem. */
  col?: number;
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

export function BuildingView({ npcs, onRoomClick }: BuildingViewProps) {
  const npcById = new Map(npcs.map((n) => [n.id, n]));
  const [showCoords, setShowCoords] = useState(false);

  return (
    <div className="h-full w-full overflow-auto p-6" style={{ backgroundColor: '#0d0d0d' }}>
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
          <div className="mb-1 flex gap-2">
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

        <div className="flex flex-col gap-3">
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

                      const npc = npcById.get(room.npcId);
                      const available = npc?.available ?? true;
                      return (
                        <button
                          key={room.id}
                          onClick={() => onRoomClick(room.npcId)}
                          disabled={!available}
                          className="relative flex flex-col items-start text-left border-2 p-3 transition-transform hover:-translate-y-0.5"
                          style={{
                            borderColor: npc?.inCrisis ? StoryModeColors.danger : '#3a3a3a',
                            backgroundColor: '#1a1a1a',
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
                          </div>
                          <div className="text-xs mt-1" style={{ color: '#9aa' }}>
                            {npc?.name ?? room.npcId}
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
