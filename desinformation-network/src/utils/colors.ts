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
 */
export function getCategoryColor(category: ActorCategory): string {
  return CATEGORY_COLORS[category] || '#6B7280'; // Gray fallback
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

/**
 * PHASE 1.3: Dual-Graph System - Awareness colors
 * Orange (low awareness/unaware) → Purple (high awareness/aware)
 */
const AWARENESS_COLORS = {
  low: { r: 249, g: 115, b: 22 },    // #F97316 - Orange (unaware)
  medium: { r: 168, g: 85, b: 247 }, // #A855F7 - Purple-400
  high: { r: 139, g: 92, b: 246 },   // #8B5CF6 - Purple (aware)
};

/**
 * Convert awareness value (0-1) to RGB color
 * Low awareness (unaware) = Orange, High awareness (aware) = Purple
 */
export function awarenessToColor(awareness: number): { r: number; g: number; b: number } {
  const clampedAwareness = Math.max(0, Math.min(1, awareness));

  if (clampedAwareness < 0.5) {
    // Orange to Purple-400 (0 to 0.5)
    const t = clampedAwareness * 2;
    return {
      r: Math.round(AWARENESS_COLORS.low.r + (AWARENESS_COLORS.medium.r - AWARENESS_COLORS.low.r) * t),
      g: Math.round(AWARENESS_COLORS.low.g + (AWARENESS_COLORS.medium.g - AWARENESS_COLORS.low.g) * t),
      b: Math.round(AWARENESS_COLORS.low.b + (AWARENESS_COLORS.medium.b - AWARENESS_COLORS.low.b) * t),
    };
  } else {
    // Purple-400 to Purple (0.5 to 1)
    const t = (clampedAwareness - 0.5) * 2;
    return {
      r: Math.round(AWARENESS_COLORS.medium.r + (AWARENESS_COLORS.high.r - AWARENESS_COLORS.medium.r) * t),
      g: Math.round(AWARENESS_COLORS.medium.g + (AWARENESS_COLORS.high.g - AWARENESS_COLORS.medium.g) * t),
      b: Math.round(AWARENESS_COLORS.medium.b + (AWARENESS_COLORS.high.b - AWARENESS_COLORS.medium.b) * t),
    };
  }
}

/**
 * Convert awareness value (0-1) to hex color string
 */
export function awarenessToHex(awareness: number): string {
  const { r, g, b } = awarenessToColor(awareness);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Get awareness level label
 */
export function getAwarenessLabel(awareness: number): string {
  if (awareness < 0.3) return 'Unaware';
  if (awareness < 0.5) return 'Slightly Aware';
  if (awareness < 0.7) return 'Moderately Aware';
  if (awareness < 0.9) return 'Very Aware';
  return 'Highly Aware';
}
