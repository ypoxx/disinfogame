import type { ActorCategory } from '@/game-logic/types';

/**
 * Trust color scale
 * Red (low trust) → Yellow (medium) → Green (high trust)
 */
const TRUST_COLORS = {
  low: { r: 239, g: 68, b: 68 },     // #EF4444 - Red
  medium: { r: 234, g: 179, b: 8 },  // #EAB308 - Yellow
  high: { r: 34, g: 197, b: 94 },    // #22C55E - Green
};

/**
 * Actor category colors
 */
const CATEGORY_COLORS: Record<ActorCategory, string> = {
  media: '#3B82F6',       // Blue
  expert: '#8B5CF6',      // Purple
  lobby: '#EC4899',       // Pink
  organization: '#14B8A6', // Teal
  infrastructure: '#6B7280', // Gray
  defensive: '#22C55E',   // Green
};

/**
 * Convert trust value (0-1) to RGB color
 * Uses linear interpolation between red, yellow, and green
 */
export function trustToColor(trust: number): { r: number; g: number; b: number } {
  const clampedTrust = Math.max(0, Math.min(1, trust));
  
  if (clampedTrust < 0.5) {
    // Red to Yellow (0 to 0.5)
    const t = clampedTrust * 2;
    return {
      r: Math.round(TRUST_COLORS.low.r + (TRUST_COLORS.medium.r - TRUST_COLORS.low.r) * t),
      g: Math.round(TRUST_COLORS.low.g + (TRUST_COLORS.medium.g - TRUST_COLORS.low.g) * t),
      b: Math.round(TRUST_COLORS.low.b + (TRUST_COLORS.medium.b - TRUST_COLORS.low.b) * t),
    };
  } else {
    // Yellow to Green (0.5 to 1)
    const t = (clampedTrust - 0.5) * 2;
    return {
      r: Math.round(TRUST_COLORS.medium.r + (TRUST_COLORS.high.r - TRUST_COLORS.medium.r) * t),
      g: Math.round(TRUST_COLORS.medium.g + (TRUST_COLORS.high.g - TRUST_COLORS.medium.g) * t),
      b: Math.round(TRUST_COLORS.medium.b + (TRUST_COLORS.high.b - TRUST_COLORS.medium.b) * t),
    };
  }
}

/**
 * Convert trust value (0-1) to hex color string
 */
export function trustToHex(trust: number): string {
  const { r, g, b } = trustToColor(trust);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Convert trust value (0-1) to CSS rgba string
 */
export function trustToRgba(trust: number, alpha: number = 1): string {
  const { r, g, b } = trustToColor(trust);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Get color for actor category
 * Accepts string for convenience when iterating Object.keys()
 */
export function getCategoryColor(category: ActorCategory | string): string {
  return CATEGORY_COLORS[category as ActorCategory] || '#6B7280'; // Gray fallback
}

/**
 * Get lighter version of category color (for backgrounds)
 */
export function getCategoryColorLight(category: ActorCategory): string {
  const lightColors: Record<ActorCategory, string> = {
    media: '#DBEAFE',       // Blue-100
    expert: '#EDE9FE',      // Purple-100
    lobby: '#FCE7F3',       // Pink-100
    organization: '#CCFBF1', // Teal-100
    infrastructure: '#F3F4F6', // Gray-100
    defensive: '#DCFCE7',   // Green-100
  };
  return lightColors[category] || '#F3F4F6';
}

/**
 * Get trust level label
 */
export function getTrustLabel(trust: number): string {
  if (trust < 0.3) return 'Very Low';
  if (trust < 0.4) return 'Low';
  if (trust < 0.6) return 'Medium';
  if (trust < 0.7) return 'High';
  return 'Very High';
}

/**
 * Get trust level CSS class (for Tailwind)
 */
export function getTrustClass(trust: number): string {
  if (trust < 0.3) return 'text-red-600 bg-red-100';
  if (trust < 0.4) return 'text-red-500 bg-red-50';
  if (trust < 0.6) return 'text-yellow-600 bg-yellow-100';
  if (trust < 0.7) return 'text-green-500 bg-green-50';
  return 'text-green-600 bg-green-100';
}

/**
 * Get connection strength color (for network edges)
 */
export function getConnectionColor(strength: number): string {
  const alpha = 0.2 + strength * 0.6; // 0.2 to 0.8
  return `rgba(107, 114, 128, ${alpha})`; // Gray with variable opacity
}

/**
 * Get animation color for ability effects
 */
export function getAbilityColor(abilityType: string): string {
  const abilityColors: Record<string, string> = {
    agenda_setting: '#3B82F6',    // Blue
    scandalize: '#EF4444',        // Red
    undermine_authority: '#8B5CF6', // Purple
    sow_doubt: '#F59E0B',         // Amber
    astroturfing: '#EC4899',      // Pink
    emotional_appeal: '#EF4444',  // Red
    conspiracy_framing: '#6366F1', // Indigo
    divide_conquer: '#14B8A6',    // Teal
    fact_check: '#22C55E',        // Green
    media_literacy: '#06B6D4',    // Cyan
    regulate: '#F97316',          // Orange
  };
  return abilityColors[abilityType] || '#6B7280';
}

// ============================================
// GAME STATE COLORS (Week 5: UX Design)
// ============================================

/**
 * Crisis escalation colors
 * Used for crisis moments and escalating danger
 */
export const CRISIS_COLORS = {
  level1: '#F59E0B', // Amber - Minor crisis
  level2: '#F97316', // Orange - Moderate crisis
  level3: '#EF4444', // Red - Severe crisis
  level4: '#DC2626', // Dark Red - Critical crisis
  level5: '#991B1B', // Darkest Red - Catastrophic
} as const;

export function getCrisisColor(level: number): string {
  if (level <= 1) return CRISIS_COLORS.level1;
  if (level <= 2) return CRISIS_COLORS.level2;
  if (level <= 3) return CRISIS_COLORS.level3;
  if (level <= 4) return CRISIS_COLORS.level4;
  return CRISIS_COLORS.level5;
}

/**
 * Combo progress colors
 * Used for combo meter and combo activation feedback
 */
export const COMBO_COLORS = {
  inactive: '#4B5563',    // Gray - No combo active
  building: '#3B82F6',    // Blue - Building up
  ready: '#8B5CF6',       // Purple - Ready to activate
  active: '#F59E0B',      // Amber - Active combo
  maxed: '#22C55E',       // Green - Maximum combo
  glow: 'rgba(139, 92, 246, 0.4)', // Purple glow
} as const;

export function getComboColor(progress: number, isActive: boolean): string {
  if (isActive) return COMBO_COLORS.active;
  if (progress >= 1) return COMBO_COLORS.maxed;
  if (progress >= 0.75) return COMBO_COLORS.ready;
  if (progress > 0) return COMBO_COLORS.building;
  return COMBO_COLORS.inactive;
}

/**
 * Betrayal/Warning colors
 * Used for NPC betrayal warnings and relationship damage
 */
export const BETRAYAL_COLORS = {
  warning: '#FBBF24',     // Yellow - Early warning
  danger: '#F97316',      // Orange - Relationship strained
  critical: '#EF4444',    // Red - Near betrayal
  betrayed: '#7C2D12',    // Dark brown-red - Betrayal complete
  text: '#FEF3C7',        // Cream text on warning bg
} as const;

export function getBetrayalColor(relationshipLevel: number): string {
  if (relationshipLevel >= 0.7) return 'transparent'; // Good relationship
  if (relationshipLevel >= 0.4) return BETRAYAL_COLORS.warning;
  if (relationshipLevel >= 0.2) return BETRAYAL_COLORS.danger;
  if (relationshipLevel > 0) return BETRAYAL_COLORS.critical;
  return BETRAYAL_COLORS.betrayed;
}

/**
 * Opportunity colors
 * Used for highlighting time-limited opportunities
 */
export const OPPORTUNITY_COLORS = {
  available: '#22C55E',   // Green - Available now
  expiring: '#F59E0B',    // Amber - Expiring soon
  urgent: '#EF4444',      // Red - Last chance
  glow: 'rgba(34, 197, 94, 0.3)', // Green glow
  border: '#16A34A',      // Darker green border
} as const;

export function getOpportunityColor(turnsRemaining: number): string {
  if (turnsRemaining <= 1) return OPPORTUNITY_COLORS.urgent;
  if (turnsRemaining <= 3) return OPPORTUNITY_COLORS.expiring;
  return OPPORTUNITY_COLORS.available;
}

/**
 * Resource change colors
 * Used for animating resource value changes
 */
export const RESOURCE_CHANGE_COLORS = {
  increase: '#22C55E',    // Green - Gained
  decrease: '#EF4444',    // Red - Lost
  neutral: '#6B7280',     // Gray - No change
} as const;

export function getResourceChangeColor(delta: number): string {
  if (delta > 0) return RESOURCE_CHANGE_COLORS.increase;
  if (delta < 0) return RESOURCE_CHANGE_COLORS.decrease;
  return RESOURCE_CHANGE_COLORS.neutral;
}
