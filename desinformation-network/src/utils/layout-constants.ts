/**
 * Layout Constants & Z-Index System
 *
 * Defines the visual hierarchy and spacing for the new layout system.
 */

// ============================================
// Z-INDEX HIERARCHY
// ============================================

export const Z_INDEX = {
  network: 0,                // Network visualization (base layer)
  bottomPanel: 10,           // Actor details panel
  sidebars: 20,              // Left/right sidebars
  topBar: 30,                // Game status bar
  modalOverlays: 40,         // Event modals, targeting overlay
  notifications: 50,         // Floating notifications
  tutorial: 60,              // Tutorial overlay (highest)
} as const;

// ============================================
// LAYOUT DIMENSIONS
// ============================================

export const LAYOUT = {
  topBar: {
    height: 60,              // Top bar height in px
  },
  sidebar: {
    widthExpanded: 280,      // Expanded sidebar width
    widthCollapsed: 48,      // Collapsed sidebar (icon strip)
    iconSize: 24,            // Tab icon size
  },
  bottomPanel: {
    minHeight: 200,          // Minimum bottom panel height
    defaultHeight: 300,      // Default height when opened
    maxHeight: 0.5,          // Max height as viewport fraction (50vh)
    resizeHandleHeight: 8,   // Drag handle height
  },
} as const;

// ============================================
// RESPONSIVE BREAKPOINTS
// ============================================

export const BREAKPOINTS = {
  mobile: 768,               // Below: mobile view
  tablet: 1024,              // 768-1024: tablet view
  laptop: 1440,              // 1024-1440: laptop view
  desktop: 1440,             // Above: desktop view (full features)
} as const;

// ============================================
// SIDEBAR TAB DEFINITIONS
// ============================================

export type SidebarTab = {
  id: string;
  label: string;
  icon: string;
  description: string;
  badge?: number;          // Optional badge count
};

export const LEFT_SIDEBAR_TABS: SidebarTab[] = [
  {
    id: 'topology',
    label: 'Network Analysis',
    icon: '📊',
    description: 'Central actors and bottlenecks',
  },
  {
    id: 'combos',
    label: 'Active Combos',
    icon: '🎯',
    description: 'Ability combinations in progress',
  },
  {
    id: 'filters',
    label: 'Actor Filters',
    icon: '🔍',
    description: 'Filter network by tier, category, trust',
  },
];

export const RIGHT_SIDEBAR_TABS: SidebarTab[] = [
  {
    id: 'reactions',
    label: 'Actor Reactions',
    icon: '⚠️',
    description: 'Actors fighting back',
  },
  {
    id: 'statistics',
    label: 'Statistics',
    icon: '📈',
    description: 'Game statistics and progress',
  },
  {
    id: 'encyclopedia',
    label: 'Encyclopedia',
    icon: '📚',
    description: 'Learn about techniques',
  },
];

// ============================================
// ANIMATION DURATIONS
// ============================================

export const ANIMATION = {
  sidebarToggle: 300,        // Sidebar collapse/expand duration (ms)
  bottomPanelSlide: 400,     // Bottom panel slide duration (ms)
  tabSwitch: 200,            // Tab switch fade duration (ms)
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get current breakpoint based on window width
 */
export function getCurrentBreakpoint(width: number): 'mobile' | 'tablet' | 'laptop' | 'desktop' {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  if (width < BREAKPOINTS.desktop) return 'laptop';
  return 'desktop';
}

/**
 * Check if viewport is at least a certain breakpoint
 */
export function isAtLeast(
  currentWidth: number,
  breakpoint: keyof typeof BREAKPOINTS
): boolean {
  return currentWidth >= BREAKPOINTS[breakpoint];
}

/**
 * Calculate available network space
 */
export function calculateNetworkSpace(
  viewportWidth: number,
  viewportHeight: number,
  leftSidebarExpanded: boolean,
  rightSidebarExpanded: boolean,
  bottomPanelHeight: number
): { width: number; height: number } {
  const leftWidth = leftSidebarExpanded ? LAYOUT.sidebar.widthExpanded : LAYOUT.sidebar.widthCollapsed;
  const rightWidth = rightSidebarExpanded ? LAYOUT.sidebar.widthExpanded : LAYOUT.sidebar.widthCollapsed;

  return {
    width: viewportWidth - leftWidth - rightWidth,
    height: viewportHeight - LAYOUT.topBar.height - bottomPanelHeight,
  };
}
