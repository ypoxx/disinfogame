/**
 * FloorDirectory — das diegetische Etagen-Tableau (Strang 2 / 2c).
 *
 * Ersetzt den abgeschafften View-Umschalter (§4.4: „View-Umschalter entfällt;
 * Ortswechsel diegetisch"). Wirkt wie das Tableau im Fahrstuhl / ein Gebäude-
 * Wegweiser: alle Etagen mit ihren Räumen, Auswahl schickt den Avatar über die
 * vorhandene Navigations-Engine dorthin (laufen → Fahrstuhl → Tür).
 *
 * Voll tastaturbedienbar (E33): ↑/↓ wählt, Enter betritt, Esc schließt, Ziffern
 * 1–9 springen direkt. Reiner Pixel-Look (PixelFrame), keine Emojis/Web-Pillen.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getBuildingLayout } from './buildingLayout';
import type { StageNpc } from './BuildingStage';
import { PixelFrame } from '../components/PixelFrame';
import { StoryModeColors } from '../theme';
import { playSound } from '../utils/SoundSystem';

interface FloorDirectoryProps {
  npcs: StageNpc[];
  /** Raum betreten (Avatar läuft hin). */
  onSelect: (roomId: string) => void;
  onClose: () => void;
  /** Etage, auf der der Avatar gerade steht (Hervorhebung). */
  currentFloorLevel?: number;
}

interface Entry {
  roomId: string;
  floorLabel: string;
  floorLevel: number;
  roomLabel: string;
  npcName?: string;
  selectable: boolean;
  inCrisis?: boolean;
}

export function FloorDirectory({ npcs, onSelect, onClose, currentFloorLevel }: FloorDirectoryProps): React.JSX.Element {
  const layout = getBuildingLayout();
  const npcById = useMemo(() => new Map(npcs.map((n) => [n.id, n])), [npcs]);

  // Flache, wählbare Liste in Anzeige-Reihenfolge (oberste Etage zuerst).
  const entries = useMemo<Entry[]>(() => {
    const list: Entry[] = [];
    for (const floor of layout.floors) {
      const rooms = layout.rooms.filter((r) => r.floorLevel === floor.level);
      for (const room of rooms) {
        const npc = room.npcId ? npcById.get(room.npcId) : undefined;
        // NPC-Räume nur betretbar, wenn verfügbar (wie in der Bühne); Sonderräume immer.
        const selectable = room.npcId ? (npc?.available ?? true) : true;
        list.push({
          roomId: room.id,
          floorLabel: floor.label_de,
          floorLevel: floor.level,
          roomLabel: room.label_de,
          npcName: npc?.name.split(' ')[0],
          selectable,
          inCrisis: npc?.inCrisis,
        });
      }
    }
    return list;
  }, [layout, npcById]);

  // Indizes der wählbaren Einträge (für Tastatur-Navigation).
  const selectableIdx = useMemo(() => entries.map((e, i) => (e.selectable ? i : -1)).filter((i) => i >= 0), [entries]);
  const [cursor, setCursor] = useState<number>(() => {
    // Startauswahl: erster wählbarer Raum der aktuellen Etage, sonst erster überhaupt.
    const here = entries.findIndex((e) => e.selectable && e.floorLevel === currentFloorLevel);
    return here >= 0 ? here : (selectableIdx[0] ?? 0);
  });

  const moveCursor = useCallback(
    (dir: 1 | -1) => {
      if (selectableIdx.length === 0) return;
      const pos = selectableIdx.indexOf(cursor);
      const nextPos = pos < 0 ? 0 : (pos + dir + selectableIdx.length) % selectableIdx.length;
      setCursor(selectableIdx[nextPos]);
      playSound('click');
    },
    [cursor, selectableIdx],
  );

  const choose = useCallback(
    (idx: number) => {
      const e = entries[idx];
      if (!e || !e.selectable) return;
      playSound('doorOpen');
      onSelect(e.roomId);
      onClose();
    },
    [entries, onSelect, onClose],
  );

  // Tastatur (E33): ↑/↓, Enter, Esc, Ziffern.
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'ArrowDown') { ev.preventDefault(); ev.stopPropagation(); moveCursor(1); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); ev.stopPropagation(); moveCursor(-1); }
      else if (ev.key === 'Enter') { ev.preventDefault(); ev.stopPropagation(); choose(cursor); }
      else if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); onClose(); }
      else if (/^[1-9]$/.test(ev.key)) {
        const n = Number(ev.key) - 1;
        const target = selectableIdx[n];
        if (target !== undefined) { ev.preventDefault(); ev.stopPropagation(); choose(target); }
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [moveCursor, choose, cursor, selectableIdx, onClose]);

  let renderedFloor = -999;
  let selectableCounter = 0;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.78)', zIndex: 45 }}
      onClick={onClose}
      data-testid="floor-directory"
    >
      <PixelFrame
        variant="standard"
        className="w-full max-w-md max-h-[82vh] flex flex-col overflow-hidden"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Kopf */}
        <div
          className="px-4 py-3 flex items-center justify-between shrink-0"
          style={{ backgroundColor: StoryModeColors.darkConcrete, borderBottom: `2px solid ${StoryModeColors.border}` }}
        >
          <span className="font-bold tracking-wider" style={{ color: StoryModeColors.textPrimary }}>
            GEBÄUDE — ETAGEN
          </span>
          <button
            onClick={onClose}
            aria-label="Schließen"
            title="Schließen (Esc)"
            className="w-7 h-7 flex items-center justify-center border-2 hover:brightness-125 transition-all"
            style={{ borderColor: StoryModeColors.borderLight, color: StoryModeColors.textSecondary, background: 'transparent' }}
          >
            ✕
          </button>
        </div>

        {/* Liste */}
        <div className="flex-1 min-h-0 overflow-y-auto py-1" role="listbox" aria-label="Etagen und Räume">
          {entries.map((e, i) => {
            const newFloor = e.floorLevel !== renderedFloor;
            renderedFloor = e.floorLevel;
            const hotkey = e.selectable ? ++selectableCounter : null;
            const isCursor = i === cursor;
            const isHere = e.floorLevel === currentFloorLevel;
            return (
              <div key={e.roomId}>
                {newFloor && (
                  <div
                    className="px-4 pt-2 pb-1 text-[10px] tracking-widest"
                    style={{ color: isHere ? StoryModeColors.warning : StoryModeColors.textMuted }}
                  >
                    {e.floorLabel.toUpperCase()}{isHere ? '  ◂ HIER' : ''}
                  </div>
                )}
                <button
                  role="option"
                  aria-selected={isCursor}
                  disabled={!e.selectable}
                  onClick={() => choose(i)}
                  onMouseEnter={() => e.selectable && setCursor(i)}
                  className="w-full text-left px-4 py-2 flex items-center gap-2 transition-colors"
                  style={{
                    backgroundColor: isCursor ? StoryModeColors.surfaceLight : 'transparent',
                    borderLeft: `3px solid ${isCursor ? StoryModeColors.ministryRed : 'transparent'}`,
                    color: e.selectable ? StoryModeColors.textPrimary : StoryModeColors.textMuted,
                    cursor: e.selectable ? 'pointer' : 'default',
                    opacity: e.selectable ? 1 : 0.5,
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center text-[10px] w-5 h-5 shrink-0 border"
                    style={{ borderColor: StoryModeColors.borderLight, color: StoryModeColors.textSecondary }}
                  >
                    {hotkey ?? '–'}
                  </span>
                  <span className="flex-1 text-sm">
                    {e.roomLabel}
                    {e.npcName ? <span style={{ color: StoryModeColors.textSecondary }}> · {e.npcName}</span> : null}
                  </span>
                  {e.inCrisis && (
                    <span className="text-[10px] font-bold" style={{ color: StoryModeColors.danger }}>KRISE</span>
                  )}
                  {!e.selectable && !e.inCrisis && (
                    <span className="text-[10px]" style={{ color: StoryModeColors.textMuted }}>—</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Fuß: Tastatur-Hinweis */}
        <div
          className="px-4 py-2 shrink-0 text-[10px]"
          style={{ borderTop: `2px solid ${StoryModeColors.border}`, color: StoryModeColors.textMuted }}
        >
          ↑↓ wählen · Enter betreten · 1–9 direkt · Esc schließen
        </div>
      </PixelFrame>
    </div>
  );
}

export default FloorDirectory;
