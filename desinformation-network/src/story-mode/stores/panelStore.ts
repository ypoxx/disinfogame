import { create } from 'zustand';

// ============================================
// TYPES
// ============================================

export type PanelId = 'actions' | 'npcs' | 'news' | 'events' | 'mission' | 'stats';
export type ViewMode = 'office' | 'dashboard' | 'building';

interface PanelState {
  // Active panel in the right sidebar (null = closed)
  activePanel: PanelId | null;
  setActivePanel: (panel: PanelId | null) => void;
  togglePanel: (panel: PanelId) => void;

  // View mode: Office scene or Dashboard
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;

  // Broadcast-Leiste (Taste B): „Ministerium sendet" + Publikum
  broadcastOpen: boolean;
  toggleBroadcast: () => void;
  setBroadcastOpen: (open: boolean) => void;

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
  toggleViewMode: () =>
    set((state) => ({
      viewMode:
        state.viewMode === 'building' ? 'office' : state.viewMode === 'office' ? 'dashboard' : 'building',
    })),

  broadcastOpen: false,
  toggleBroadcast: () => set((state) => ({ broadcastOpen: !state.broadcastOpen })),
  setBroadcastOpen: (open) => set({ broadcastOpen: open }),

  advisorCollapsed: false,
  toggleAdvisor: () =>
    set((state) => ({ advisorCollapsed: !state.advisorCollapsed })),

  queueCollapsed: false,
  toggleQueue: () =>
    set((state) => ({ queueCollapsed: !state.queueCollapsed })),

  resetUI: () =>
    set({
      activePanel: null,
      viewMode: 'building',
      broadcastOpen: false,
      advisorCollapsed: false,
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
