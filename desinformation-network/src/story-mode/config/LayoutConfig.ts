/**
 * Layout Configuration for Story Mode UI
 *
 * Defines the positioning and visibility of all UI elements.
 * This centralizes layout decisions and makes changes easy.
 */

// ============================================
// LAYOUT ZONES
// ============================================

export type LayoutZone =
  | 'top-bar'           // HUD, resources, phase indicator
  | 'left-sidebar'      // Advisor Panel
  | 'right-sidebar'     // News, Stats, etc.
  | 'bottom-left'       // Combo Hints
  | 'bottom-right'      // Action Queue
  | 'center'            // Office Scene
  | 'overlay'           // Modals, Dialogs
  | 'floating';         // Tooltips, temporary notifications

export interface LayoutSlot {
  zone: LayoutZone;
  priority: number;     // Higher = rendered on top
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  size?: {
    width?: string;
    maxWidth?: string;
    height?: string;
    maxHeight?: string;
  };
  zIndex: number;
}

// ============================================
// WIDGET LAYOUT CONFIGURATION
// ============================================

export const WIDGET_LAYOUTS: Record<string, LayoutSlot> = {
  // =====================================
  // TOP BAR
  // =====================================
  storyHUD: {
    zone: 'top-bar',
    priority: 100,
    position: { top: '0', left: '0', right: '0' },
    size: { height: '64px' },
    zIndex: 40,
  },

  // =====================================
  // LEFT SIDEBAR
  // =====================================
  advisorPanel: {
    zone: 'left-sidebar',
    priority: 90,
    position: { top: '80px', left: '16px' },
    size: { width: '320px', maxHeight: '60vh' },
    zIndex: 30,
  },

  // =====================================
  // BOTTOM LEFT
  // =====================================
  comboHints: {
    zone: 'bottom-left',
    priority: 80,
    position: { bottom: '16px', left: '16px' },
    size: { width: '320px', maxHeight: '40vh' },
    zIndex: 20,
  },

  // =====================================
  // BOTTOM RIGHT
  // =====================================
  actionQueue: {
    zone: 'bottom-right',
    priority: 85,
    position: { bottom: '16px', right: '16px' },
    size: { width: '400px', maxHeight: '50vh' },
    zIndex: 25,
  },

  // =====================================
  // CENTER (Main Game Area)
  // =====================================
  officeScene: {
    zone: 'center',
    priority: 10,
    position: { top: '64px', left: '0', right: '0', bottom: '0' },
    zIndex: 1,
  },

  // =====================================
  // OVERLAYS (Modals)
  // =====================================
  dialogBox: {
    zone: 'overlay',
    priority: 200,
    position: { bottom: '0', left: '0', right: '0' },
    size: { height: 'auto', maxHeight: '50vh' },
    zIndex: 50,
  },

  crisisModal: {
    zone: 'overlay',
    priority: 250,
    position: {},  // Centered by component
    zIndex: 60,
  },

  betrayalModal: {
    zone: 'overlay',
    priority: 260,
    position: {},  // Centered by component
    zIndex: 65,
  },

  pauseMenu: {
    zone: 'overlay',
    priority: 300,
    position: {},  // Centered by component
    zIndex: 70,
  },

  // =====================================
  // PANELS (Slide-in)
  // =====================================
  actionPanel: {
    zone: 'right-sidebar',
    priority: 150,
    position: { top: '80px', right: '0' },
    size: { width: '480px', maxHeight: 'calc(100vh - 100px)' },
    zIndex: 45,
  },

  newsPanel: {
    zone: 'right-sidebar',
    priority: 150,
    position: { top: '80px', right: '0' },
    size: { width: '400px', maxHeight: 'calc(100vh - 100px)' },
    zIndex: 45,
  },

  npcPanel: {
    zone: 'right-sidebar',
    priority: 150,
    position: { top: '80px', right: '0' },
    size: { width: '400px', maxHeight: 'calc(100vh - 100px)' },
    zIndex: 45,
  },
};

// ============================================
// RESPONSIVE BREAKPOINTS
// ============================================

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1280,
  wide: 1536,
};

// ============================================
// LAYOUT HELPERS
// ============================================

/**
 * Get all widgets in a specific zone
 */
export function getWidgetsInZone(zone: LayoutZone): string[] {
  return Object.entries(WIDGET_LAYOUTS)
    .filter(([_, config]) => config.zone === zone)
    .sort((a, b) => b[1].priority - a[1].priority)
    .map(([name]) => name);
}

/**
 * Get CSS styles for a widget
 */
export function getWidgetStyles(widgetName: string): React.CSSProperties {
  const layout = WIDGET_LAYOUTS[widgetName];
  if (!layout) return {};

  return {
    position: 'fixed' as const,
    ...layout.position,
    ...layout.size,
    zIndex: layout.zIndex,
  };
}

/**
 * Check if widget should be visible based on screen width
 */
export function isWidgetVisibleOnScreen(
  widgetName: string,
  screenWidth: number
): boolean {
  // Hide sidebars on mobile
  const layout = WIDGET_LAYOUTS[widgetName];
  if (!layout) return true;

  if (screenWidth < BREAKPOINTS.tablet) {
    if (layout.zone === 'left-sidebar' || layout.zone === 'right-sidebar') {
      return false;
    }
  }

  return true;
}
