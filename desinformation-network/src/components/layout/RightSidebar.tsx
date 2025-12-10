/**
 * RightSidebar Component
 *
 * Collapsible sidebar with tabs for Reactions, Statistics, and Encyclopedia.
 * Shows game feedback and educational content.
 */

import { useState, memo } from 'react';
import type { Actor, ActorReaction, GameStatistics } from '@/game-logic/types';
import { cn } from '@/utils/cn';
import { Z_INDEX, LAYOUT, RIGHT_SIDEBAR_TABS, ANIMATION } from '@/utils/layout-constants';
import { ActorReactionsOverlay } from '@/components/ActorReactionsOverlay';
import { GameStatistics as GameStatisticsComponent } from '@/components/GameStatistics';

// ============================================
// TYPES
// ============================================

export interface RightSidebarProps {
  reactions: ActorReaction[];
  actors: Actor[];
  currentRound: number;
  statistics: GameStatistics;
  onOpenEncyclopedia?: () => void;
  defaultCollapsed?: boolean;
}

type TabId = 'reactions' | 'statistics' | 'encyclopedia';

// ============================================
// COMPONENT
// ============================================

function RightSidebarComponent({
  reactions,
  actors,
  currentRound,
  statistics,
  onOpenEncyclopedia,
  defaultCollapsed = false,
}: RightSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeTab, setActiveTab] = useState<TabId>('reactions');

  // Count recent reactions (last 3 rounds)
  const recentReactions = reactions.filter(r => currentRound - r.round <= 3);

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
        "fixed right-0 bg-white/95 backdrop-blur border-l border-gray-200 shadow-xl transition-all duration-300 flex",
        "animate-slide-in-right"
      )}
      style={{
        top: LAYOUT.topBar.height,
        bottom: 0,
        width: isCollapsed ? LAYOUT.sidebar.widthCollapsed : LAYOUT.sidebar.widthExpanded,
        zIndex: Z_INDEX.sidebars,
        transitionDuration: `${ANIMATION.sidebarToggle}ms`,
      }}
    >
      {/* Tab Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tab Header */}
          <div className="bg-gradient-to-r from-white to-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-bold text-gray-900 text-sm">
              {RIGHT_SIDEBAR_TABS.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-xs text-gray-500">
              {RIGHT_SIDEBAR_TABS.find(t => t.id === activeTab)?.description}
            </p>
          </div>

          {/* Tab Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'reactions' && (
              <div className="animate-fade-in">
                {recentReactions.length > 0 ? (
                  <ActorReactionsOverlay
                    reactions={reactions}
                    actors={actors}
                    currentRound={currentRound}
                    collapsed={false}
                    onToggleCollapse={undefined}
                  />
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="text-sm text-gray-600 font-medium mb-2">
                      No Recent Reactions
                    </p>
                    <p className="text-xs text-gray-500">
                      Actors will react when they detect manipulation attempts.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'statistics' && (
              <div className="animate-fade-in">
                <div className="space-y-4">
                  {/* Quick Stats */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                    <h4 className="text-xs font-bold text-gray-700 mb-3">Overview</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-gray-500">Rounds Played</p>
                        <p className="text-lg font-bold text-gray-900">{statistics.totalRounds}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">Abilities Used</p>
                        <p className="text-lg font-bold text-gray-900">{statistics.totalAbilitiesUsed}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">Money Spent</p>
                        <p className="text-lg font-bold text-yellow-600">{statistics.totalMoneySpent}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500">Peak Detection</p>
                        <p className="text-lg font-bold text-red-600">
                          {Math.round(statistics.peakDetectionRisk * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Most Used Ability */}
                  {statistics.mostUsedAbility && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="text-xs font-bold text-gray-700 mb-2">Most Used Ability</h4>
                      <p className="text-sm font-semibold text-purple-900">
                        {statistics.mostUsedAbility.name}
                      </p>
                      <p className="text-xs text-purple-600">
                        Used {statistics.mostUsedAbility.timesUsed} times
                      </p>
                    </div>
                  )}

                  {/* Achievements */}
                  {statistics.achievements.length > 0 && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="text-xs font-bold text-gray-700 mb-2">Achievements</h4>
                      <div className="space-y-1">
                        {statistics.achievements.map((achievement, idx) => (
                          <div key={idx} className="text-xs text-yellow-900 flex items-start gap-2">
                            <span>🏆</span>
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'encyclopedia' && (
              <div className="animate-fade-in">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">📚</div>
                  <p className="text-sm text-gray-600 font-medium mb-3">
                    Learn About Manipulation Techniques
                  </p>
                  <button
                    onClick={onOpenEncyclopedia}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Open Encyclopedia
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Icons Strip */}
      <div className="w-12 bg-gray-50 border-l border-gray-200 flex flex-col py-2">
        {/* Collapse Toggle */}
        <button
          onClick={handleToggleCollapse}
          className="flex items-center justify-center h-12 hover:bg-gray-200 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="text-lg">
            {isCollapsed ? '←' : '→'}
          </span>
        </button>

        <div className="h-px bg-gray-300 my-2 mx-2" />

        {/* Tab Buttons */}
        {RIGHT_SIDEBAR_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const badge = tab.id === 'reactions' ? recentReactions.length : undefined;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as TabId)}
              className={cn(
                "relative flex items-center justify-center h-12 transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
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
    </div>
  );
}

export const RightSidebar = memo(RightSidebarComponent);
