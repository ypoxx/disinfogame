/**
 * LeftSidebar Component
 *
 * Collapsible sidebar with tabs for Topology, Combos, and Filters.
 * Shows strategic analysis and network filtering tools.
 */

import { useState, memo } from 'react';
import type { Actor, GameState, NetworkTopology, ComboProgress } from '@/game-logic/types';
import type { ComboDefinition } from '@/game-logic/combo-system';
import type { ActorFilters } from '@/components/FilterControls';
import { cn } from '@/utils/cn';
import { Z_INDEX, LAYOUT, LEFT_SIDEBAR_TABS, ANIMATION } from '@/utils/layout-constants';
import { TopologyOverlay } from '@/components/TopologyOverlay';
import { ComboTracker } from '@/components/ComboTracker';
import { FilterControls } from '@/components/FilterControls';

// ============================================
// TYPES
// ============================================

export interface LeftSidebarProps {
  topology: NetworkTopology | undefined;
  actors: Actor[];
  activeCombos: ComboProgress[];
  comboDefinitions: ComboDefinition[];
  currentRound: number;
  filters: ActorFilters;
  onFiltersChange: (filters: ActorFilters) => void;
  defaultCollapsed?: boolean;
}

type TabId = 'topology' | 'combos' | 'filters';

// ============================================
// COMPONENT
// ============================================

function LeftSidebarComponent({
  topology,
  actors,
  activeCombos,
  comboDefinitions,
  currentRound,
  filters,
  onFiltersChange,
  defaultCollapsed = false,
}: LeftSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<TabId>('topology');

  // Auto-select combo tab when combos are active
  const hasActiveCombos = activeCombos.length > 0;

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleTabClick = (tabId: TabId) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    setActiveTab(tabId);
  };

  return (
    <div
      className={cn(
        "fixed left-0 bg-white/95 backdrop-blur border-r border-gray-200 shadow-xl transition-all duration-300 flex",
        "animate-slide-in-left"
      )}
      style={{
        top: LAYOUT.topBar.height,
        bottom: 0,
        width: isCollapsed ? LAYOUT.sidebar.widthCollapsed : LAYOUT.sidebar.widthExpanded,
        zIndex: Z_INDEX.sidebars,
        transitionDuration: `${ANIMATION.sidebarToggle}ms`,
      }}
    >
      {/* Tab Icons Strip */}
      <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col py-2">
        {/* Collapse Toggle */}
        <button
          onClick={handleToggleCollapse}
          className="flex items-center justify-center h-12 hover:bg-gray-200 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="text-lg">
            {isCollapsed ? '→' : '←'}
          </span>
        </button>

        <div className="h-px bg-gray-300 my-2 mx-2" />

        {/* Tab Buttons */}
        {LEFT_SIDEBAR_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const badge = tab.id === 'combos' ? activeCombos.length : undefined;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as TabId)}
              className={cn(
                "relative flex items-center justify-center h-12 transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700 border-l-2 border-blue-600"
                  : "hover:bg-gray-200 text-gray-600"
              )}
              title={tab.label}
            >
              <span className="text-xl">{tab.icon}</span>
              {badge !== undefined && badge > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tab Header */}
          <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 text-sm">
              {LEFT_SIDEBAR_TABS.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-xs text-gray-500">
              {LEFT_SIDEBAR_TABS.find(t => t.id === activeTab)?.description}
            </p>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'topology' && (
              <div className="animate-fade-in">
                <TopologyOverlay
                  topology={topology}
                  actors={actors}
                  collapsed={false}
                  onToggleCollapse={undefined}
                />
              </div>
            )}

            {activeTab === 'combos' && (
              <div className="animate-fade-in">
                {activeCombos.length > 0 ? (
                  <ComboTracker
                    activeCombos={activeCombos}
                    comboDefinitions={comboDefinitions}
                    actors={actors}
                    currentRound={currentRound}
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-3">🎯</div>
                    <p className="text-sm text-gray-600 font-medium mb-2">
                      No Active Combos
                    </p>
                    <p className="text-xs text-gray-500">
                      Use ability sequences on the same target to trigger powerful combos!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'filters' && (
              <div className="animate-fade-in">
                <FilterControls
                  actors={actors}
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  collapsed={false}
                  onToggleCollapse={undefined}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const LeftSidebar = memo(LeftSidebarComponent);
