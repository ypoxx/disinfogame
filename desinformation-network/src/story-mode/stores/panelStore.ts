import { create } from 'zustand';

// ============================================
// TYPES
// ============================================

export type PanelId = 'actions' | 'npcs' | 'news' | 'events' | 'mission' | 'stats';
export type ViewMode = 'office' | 'dashboard';

interface PanelState {
  // Active panel in the right sidebar (null = closed)
  activePanel: PanelId | null;
  setActivePanel: (panel: PanelId | null) => void;
  togglePanel: (panel: PanelId) => void;

  // View mode: Office scene or Dashboard
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;

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

  viewMode: 'office',
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === 'office' ? 'dashboard' : 'office',
    })),

  advisorCollapsed: false,
  toggleAdvisor: () =>
    set((state) => ({ advisorCollapsed: !state.advisorCollapsed })),

  queueCollapsed: false,
  toggleQueue: () =>
    set((state) => ({ queueCollapsed: !state.queueCollapsed })),

  resetUI: () =>
    set({
      activePanel: null,
      viewMode: 'office',
      advisorCollapsed: false,
      queueCollapsed: false,
    }),
}));

// ============================================
// PANEL METADATA
// ============================================

export const PANEL_META: Record<PanelId, { icon: string; label: string; shortcut: string }> = {
  actions: { icon: '📋', label: 'AKTIONEN', shortcut: 'A' },
  npcs: { icon: '👥', label: 'KONTAKTE', shortcut: 'P' },
  news: { icon: '📰', label: 'NACHRICHTEN', shortcut: 'N' },
  events: { icon: '🌍', label: 'EREIGNISSE', shortcut: 'E' },
  mission: { icon: '📁', label: 'MISSION', shortcut: 'M' },
  stats: { icon: '📊', label: 'STATISTIK', shortcut: 'S' },
};
