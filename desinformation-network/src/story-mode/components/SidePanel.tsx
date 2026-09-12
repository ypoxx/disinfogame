import { StoryModeColors } from '../theme';
import { usePanelStore } from '../stores/panelStore';

// N3 (PLAN 2026-07-07): Die Tab-Bar ist entfallen — sie war das vierte parallele
// Navigationssystem (neben Büro-Hotspots, Hotkeys und Berater-Leiste). Panels
// öffnen über die Büro-Objekte bzw. die Hotkeys (N/S/P/M/E, ?-Hilfe); jedes
// Panel bringt seinen eigenen Kopf mit Titel + Schließen mit.

// ============================================
// SIDE PANEL CONTAINER
// ============================================

/**
 * Breite der Seitenspalte. Stand vorher dreimal als nackte Zahl im Code — einmal
 * hier, einmal als Versatz der Berater-Leiste, und nirgends für die
 * Unterkanten-Streifen (Morgenbriefing, Dialogbox), die deshalb UNTER dem
 * geöffneten Panel durchliefen und ihm den Fuß abschnitten.
 */
export const SEITENPANEL_BREITE_PX = 420;

interface SidePanelProps {
  children: React.ReactNode;
}

export function SidePanel({ children }: SidePanelProps) {
  const activePanel = usePanelStore((s) => s.activePanel);

  if (!activePanel) return null;

  return (
    <div
      className="h-full flex flex-col border-l-4 animate-slide-in-right"
      style={{
        width: `${SEITENPANEL_BREITE_PX}px`,
        minWidth: `${SEITENPANEL_BREITE_PX}px`,
        backgroundColor: StoryModeColors.surface,
        borderColor: StoryModeColors.border,
      }}
    >
      {/* Panel Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}

export default SidePanel;
