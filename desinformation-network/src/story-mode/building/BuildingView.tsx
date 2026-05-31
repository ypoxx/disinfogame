/**
 * BuildingView — TVTower-Querschnitt (Track A-1, 2026-05-31)
 *
 * Erste *datengetriebene* Gebäude-Ansicht: Etagen + Räume aus `data/building.json`,
 * jeder Raum verweist auf einen NPC. CSS-first (noch keine Grafik) — dient zugleich
 * als sichtbare Skizze UND lebende Dokumentation der Struktur.
 *
 * Klick auf einen Raum -> öffnet den NPC-Dialog (bestehende Logik via `onRoomClick`).
 * Der klassische `OfficeScreen` bleibt über den View-Umschalter erreichbar (Abzweigung).
 *
 * Plan & nächste Schritte: docs/BUILDING_AND_ASSETS.md · Bauplan: ../BUILDING_CONCEPT.md
 */
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

function moraleColor(morale: number): string {
  if (morale < 30) return StoryModeColors.danger;
  if (morale < 60) return StoryModeColors.warning;
  return StoryModeColors.success;
}

export function BuildingView({ npcs, onRoomClick }: BuildingViewProps) {
  const npcById = new Map(npcs.map((n) => [n.id, n]));

  return (
    <div className="h-full w-full overflow-auto p-6" style={{ backgroundColor: '#0d0d0d' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-wide" style={{ color: StoryModeColors.warning }}>
            🏢 AGENTUR-GEBÄUDE
          </h2>
          <p className="text-xs" style={{ color: '#888' }}>
            Klicke einen Raum, um die Person zu sprechen. (Skizze — der klassische „Büro"-Blick bleibt oben umschaltbar.)
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {floors.map((floor) => {
            const floorRooms = rooms.filter((r) => r.floor === floor.id);
            return (
              <div
                key={floor.id}
                className="border-2"
                style={{ borderColor: '#2a2a2a', backgroundColor: '#141414' }}
              >
                <div
                  className="px-3 py-1 text-xs font-semibold tracking-wider"
                  style={{ backgroundColor: '#1f1f1f', color: '#aaa', borderBottom: '1px solid #2a2a2a' }}
                >
                  {floor.label_de}
                </div>

                <div className="flex flex-wrap gap-3 p-3">
                  {floorRooms.map((room) => {
                    const npc = npcById.get(room.npcId);
                    const available = npc?.available ?? true;
                    return (
                      <button
                        key={room.id}
                        onClick={() => onRoomClick(room.npcId)}
                        disabled={!available}
                        className="flex flex-col items-start text-left border-2 p-3 transition-transform hover:-translate-y-0.5"
                        style={{
                          width: 180,
                          borderColor: npc?.inCrisis ? StoryModeColors.danger : '#3a3a3a',
                          backgroundColor: '#1a1a1a',
                          opacity: available ? 1 : 0.45,
                          cursor: available ? 'pointer' : 'not-allowed',
                        }}
                        title={available ? `${room.label_de} öffnen` : 'Aktuell nicht verfügbar'}
                      >
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
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BuildingView;
