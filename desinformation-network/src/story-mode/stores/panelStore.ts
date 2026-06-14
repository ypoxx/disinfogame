import { create } from 'zustand';

// ============================================
// TYPES
// ============================================

export type PanelId = 'actions' | 'npcs' | 'news' | 'events' | 'mission' | 'stats';
// Strang 2/2e: kein Dashboard mehr — nur noch Welt (Gebäude) und Raum-Nahsicht (Büro).
export type ViewMode = 'office' | 'building';

interface PanelState {
  // Active panel in the right sidebar (null = closed)
  activePanel: PanelId | null;
  setActivePanel: (panel: PanelId | null) => void;
  togglePanel: (panel: PanelId) => void;

  // View mode: Gebäude-Querschnitt oder Büro-Nahsicht (diegetischer Wechsel, 2c)
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Broadcast-Leiste (Taste B): permanent sichtbar (Strang 2/2d) — der Streifen
  // ist immer da; `broadcastExpanded` schaltet nur zwischen Kompakt und Vollbild.
  broadcastExpanded: boolean;
  toggleBroadcast: () => void;
  setBroadcastExpanded: (open: boolean) => void;

  // Advisor panel (already exists as floating, keep independent)
  advisorCollapsed: boolean;
  toggleAdvisor: () => void;

  // Action queue widget
  queueCollapsed: boolean;
  toggleQueue: () => void;

  // Reset all UI state (call on game restart)
  resetUI: () => void;
}

// ============================================
// STORE
// ============================================

export const usePanelStore = create<PanelState>((set) => ({
  activePanel: null,
  setActivePanel: (panel) => set({ activePanel: panel }),
  togglePanel: (panel) =>
    set((state) => ({
      activePanel: state.activePanel === panel ? null : panel,
    })),

  viewMode: 'building',
  setViewMode: (mode) => set({ viewMode: mode }),

  broadcastExpanded: false,
  toggleBroadcast: () => set((state) => ({ broadcastExpanded: !state.broadcastExpanded })),
  setBroadcastExpanded: (open) => set({ broadcastExpanded: open }),

  // Standard eingeklappt (schmaler Rand-Tab statt großer Floating-Sidebar): Empfehlungen
  // kommen jetzt diegetisch im NPC-Gespräch (P1a). Auf Knopfdruck wieder ausklappbar (A1).
  advisorCollapsed: true,
  toggleAdvisor: () =>
    set((state) => ({ advisorCollapsed: !state.advisorCollapsed })),

  queueCollapsed: false,
  toggleQueue: () =>
    set((state) => ({ queueCollapsed: !state.queueCollapsed })),

  resetUI: () =>
    set({
      activePanel: null,
      viewMode: 'building',
      broadcastExpanded: false,
      advisorCollapsed: true,
      queueCollapsed: false,
    }),
}));

// ============================================
// PANEL METADATA
// ============================================

// icon-Felder sind jetzt IconName-Strings (kein Emoji) — SidePanel rendert sie via <Icon>.
export const PANEL_META: Record<PanelId, { icon: string; label: string; shortcut: string }> = {
  actions: { icon: 'actions', label: 'AKTIONEN', shortcut: 'A' },
  npcs: { icon: 'npcs', label: 'KONTAKTE', shortcut: 'P' },
  news: { icon: 'news', label: 'NACHRICHTEN', shortcut: 'N' },
  events: { icon: 'events', label: 'EREIGNISSE', shortcut: 'E' },
  mission: { icon: 'mission', label: 'MISSION', shortcut: 'M' },
  stats: { icon: 'stats', label: 'STATISTIK', shortcut: 'S' },
};
