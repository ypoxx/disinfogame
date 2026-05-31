/**
 * Filter Controls Component
 *
 * Provides filtering UI for network visualization with 58 actors.
 * Allows filtering by tier, category, trust level, and manipulation status.
 */

import { useState, useMemo } from 'react';
import type { Actor, ActorCategory } from '@/game-logic/types';
import type { ActorTier } from '@/game-logic/types';
import { cn } from '@/utils/cn';
import { getCategoryColor } from '@/utils/colors';

// ============================================
// TYPES
// ============================================

export interface ActorFilters {
  tiers: Set<ActorTier>;
  categories: Set<ActorCategory>;
  trustRange: { min: number; max: number };
  showOnlyManipulated: boolean;
  searchQuery: string;
}

export interface FilterControlsProps {
  actors: Actor[];
  filters: ActorFilters;
  onFiltersChange: (filters: ActorFilters) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// ============================================
// CONSTANTS
// ============================================

const TIER_LABELS: Record<ActorTier, string> = {
  1: 'Core',
  2: 'Secondary',
  3: 'Background',
};

const TIER_DESCRIPTIONS: Record<ActorTier, string> = {
  1: 'Main actors, always visible',
  2: 'Important supporting actors',
  3: 'Contextual background actors',
};

const CATEGORY_LABELS: Record<string, string> = {
  media: 'Media',
  expert: 'Experts',
  lobby: 'Lobby',
  organization: 'Organizations',
  infrastructure: 'Infrastructure',
  defensive: 'Defensive',
};

const TRUST_PRESETS = [
  { label: 'All', min: 0, max: 1 },
  { label: 'High Trust', min: 0.7, max: 1 },
  { label: 'Medium Trust', min: 0.4, max: 0.7 },
  { label: 'Low Trust', min: 0, max: 0.4 },
  { label: 'Manipulated', min: 0, max: 0.3 },
];

// ============================================
// MAIN COMPONENT
// ============================================

export function FilterControls({
  actors,
  filters,
  onFiltersChange,
  collapsed = false,
  onToggleCollapse,
}: FilterControlsProps) {
  const [activeTab, setActiveTab] = useState<'tier' | 'category' | 'trust'>('tier');

  // Calculate filter statistics
  const stats = useMemo(() => {
    const total = actors.length;
    const filtered = actors.filter(actor => {
      if (!filters.tiers.has(actor.tier || 1)) return false;
      if (!filters.categories.has(actor.category as ActorCategory)) return false;
      if (actor.trust < filters.trustRange.min || actor.trust > filters.trustRange.max) return false;
      if (filters.showOnlyManipulated && actor.trust > 0.3) return false;
      if (filters.searchQuery && !actor.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
      return true;
    }).length;

    return { total, filtered, hidden: total - filtered };
  }, [actors, filters]);

  // Get unique categories from actors
  const availableCategories = useMemo(() => {
    const categories = new Set<ActorCategory>();
    actors.forEach(a => categories.add(a.category as ActorCategory));
    return Array.from(categories);
  }, [actors]);

  // Get available tiers from actors
  const availableTiers = useMemo(() => {
    const tiers = new Set<ActorTier>();
    actors.forEach(a => tiers.add(a.tier || 1));
    return Array.from(tiers).sort();
  }, [actors]);

  // Toggle functions
  const toggleTier = (tier: ActorTier) => {
    const newTiers = new Set(filters.tiers);
    if (newTiers.has(tier)) {
      newTiers.delete(tier);
    } else {
      newTiers.add(tier);
    }
    onFiltersChange({ ...filters, tiers: newTiers });
  };

  const toggleCategory = (category: ActorCategory) => {
    const newCategories = new Set(filters.categories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const setTrustPreset = (min: number, max: number) => {
    onFiltersChange({ ...filters, trustRange: { min, max } });
  };

  const toggleShowOnlyManipulated = () => {
    onFiltersChange({
      ...filters,
      showOnlyManipulated: !filters.showOnlyManipulated,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      tiers: new Set([1, 2, 3]),
      categories: new Set(availableCategories),
      trustRange: { min: 0, max: 1 },
      showOnlyManipulated: false,
      searchQuery: '',
    });
  };

  if (collapsed) {
    return (
      <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg p-3">
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters ({stats.filtered}/{stats.total})
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg p-4 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-gray-600"
            title="Collapse filters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Statistics */}
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Showing</span>
          <span className="text-lg font-bold text-blue-600">
            {stats.filtered} / {stats.total}
          </span>
        </div>
        {stats.hidden > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            {stats.hidden} actor{stats.hidden !== 1 ? 's' : ''} hidden by filters
          </p>
        )}
      </div>

      {/* Search Box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search actors..."
          value={filters.searchQuery}
          onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {(['tier', 'category', 'trust'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-2 text-sm font-medium capitalize transition-colors',
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-3 mb-4">
        {/* Tier Filter */}
        {activeTab === 'tier' && (
          <div className="space-y-2">
            {availableTiers.map((tier) => (
              <label
                key={tier}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.tiers.has(tier)}
                  onChange={() => toggleTier(tier)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      Tier {tier}: {TIER_LABELS[tier]}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {actors.filter(a => (a.tier || 1) === tier).length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{TIER_DESCRIPTIONS[tier]}</p>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Category Filter */}
        {activeTab === 'category' && (
          <div className="space-y-2">
            {availableCategories.map((category) => {
              const color = getCategoryColor(category);
              const count = actors.filter(a => a.category === category).length;

              return (
                <label
                  key={category}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.has(category)}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="flex-1 font-medium text-gray-900">
                    {CATEGORY_LABELS[category] || category}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        )}

        {/* Trust Filter */}
        {activeTab === 'trust' && (
          <div className="space-y-3">
            {/* Preset buttons */}
            <div className="flex flex-wrap gap-2">
              {TRUST_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setTrustPreset(preset.min, preset.max)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                    filters.trustRange.min === preset.min && filters.trustRange.max === preset.max
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom range sliders */}
            <div className="space-y-2">
              <label className="block">
                <span className="text-xs text-gray-600">Min Trust: {(filters.trustRange.min * 100).toFixed(0)}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.trustRange.min * 100}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    trustRange: { ...filters.trustRange, min: parseInt(e.target.value) / 100 }
                  })}
                  className="w-full"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-600">Max Trust: {(filters.trustRange.max * 100).toFixed(0)}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.trustRange.max * 100}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    trustRange: { ...filters.trustRange, max: parseInt(e.target.value) / 100 }
                  })}
                  className="w-full"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Quick Toggles */}
      <div className="space-y-2 mb-4 pt-4 border-t border-gray-200">
        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showOnlyManipulated}
            onChange={toggleShowOnlyManipulated}
            className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
          />
          <div className="flex-1">
            <span className="font-medium text-gray-900">Show Only Manipulated</span>
            <p className="text-xs text-gray-500">Actors below 30% trust</p>
          </div>
        </label>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
      >
        Reset All Filters
      </button>
    </div>
  );
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Apply filters to actors array
 */
export function applyFilters(actors: Actor[], filters: ActorFilters): Actor[] {
  return actors.filter(actor => {
    // Tier filter
    if (!filters.tiers.has(actor.tier || 1)) return false;

    // Category filter
    if (!filters.categories.has(actor.category as ActorCategory)) return false;

    // Trust range filter
    if (actor.trust < filters.trustRange.min || actor.trust > filters.trustRange.max) return false;

    // Manipulated filter
    if (filters.showOnlyManipulated && actor.trust > 0.3) return false;

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (!actor.name.toLowerCase().includes(query)) return false;
    }

    return true;
  });
}

/**
 * Create default filters (show all)
 */
export function createDefaultFilters(): ActorFilters {
  return {
    tiers: new Set([1, 2, 3]),
    categories: new Set(['media', 'expert', 'lobby', 'organization', 'infrastructure', 'defensive'] as ActorCategory[]),
    trustRange: { min: 0, max: 1 },
    showOnlyManipulated: false,
    searchQuery: '',
  };
}
