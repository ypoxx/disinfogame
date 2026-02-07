import { StoryModeColors } from '../theme';
import { usePanelStore, PANEL_META, type PanelId } from '../stores/panelStore';
import type { StoryResources, StoryPhase, NewsEvent, Objective, NPCState } from '../../game-logic/StoryEngineAdapter';

// ============================================
// TYPES
// ============================================

interface DashboardViewProps {
  resources: StoryResources;
  phase: StoryPhase;
  objectives: Objective[];
  newsEvents: NewsEvent[];
  npcs: NPCState[];
  unreadNewsCount: number;
  worldEventCount: number;
  onEndPhase: () => void;
}

// ============================================
// RESOURCE CARD
// ============================================

function ResourceCard({ icon, label, value, format, color, danger }: {
  icon: string;
  label: string;
  value: number;
  format: 'currency' | 'percent' | 'number';
  color: string;
  danger?: boolean;
}) {
  const formatted = format === 'currency' ? `$${value}K`
    : format === 'percent' ? `${Math.round(value)}%`
    : `${value}`;

  return (
    <div
      className="p-3 border-2"
      style={{
        backgroundColor: StoryModeColors.surface,
        borderColor: danger ? StoryModeColors.danger : StoryModeColors.border,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-bold" style={{ color: StoryModeColors.textSecondary }}>{label}</span>
      </div>
      <div className="text-xl font-bold" style={{ color: danger ? StoryModeColors.danger : color }}>
        {formatted}
      </div>
    </div>
  );
}

// ============================================
// OBJECTIVES WIDGET
// ============================================

function ObjectivesWidget({ objectives }: { objectives: Objective[] }) {
  const primary = objectives.filter(o => o.type === 'primary');
  const completed = objectives.filter(o => o.completed).length;

  return (
    <div
      className="p-3 border-2"
      style={{
        backgroundColor: StoryModeColors.surface,
        borderColor: StoryModeColors.border,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: StoryModeColors.textSecondary }}>
          MISSIONSZIELE
        </span>
        <span className="text-xs" style={{ color: StoryModeColors.textMuted }}>
          {completed}/{objectives.length} erledigt
        </span>
      </div>
      <div className="space-y-2">
        {primary.slice(0, 4).map(obj => {
          const progress = Math.min(100, (obj.currentValue / obj.targetValue) * 100);
          return (
            <div key={obj.id}>
              <div className="flex justify-between text-xs mb-0.5">
                <span style={{ color: obj.completed ? StoryModeColors.success : StoryModeColors.textPrimary }}>
                  {obj.completed ? '✓ ' : ''}{obj.label_de}
                </span>
                <span style={{ color: StoryModeColors.textMuted }}>
                  {obj.currentValue}/{obj.targetValue}
                </span>
              </div>
              <div className="h-1.5 bg-black/30 overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: obj.completed ? StoryModeColors.success : StoryModeColors.militaryOlive,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// NEWS FEED WIDGET
// ============================================

function NewsFeedWidget({ newsEvents, unreadCount }: { newsEvents: NewsEvent[]; unreadCount: number }) {
  const { togglePanel } = usePanelStore();
  const recent = [...newsEvents].sort((a, b) => b.phase - a.phase).slice(0, 5);

  const getTypeIcon = (type: NewsEvent['type']) => {
    switch (type) {
      case 'action_result': return '📰';
      case 'consequence': return '⚡';
      case 'world_event': return '🌍';
      case 'npc_event': return '👤';
      default: return '📰';
    }
  };

  return (
    <div
      className="p-3 border-2 cursor-pointer hover:brightness-110 transition-all"
      style={{
        backgroundColor: StoryModeColors.surface,
        borderColor: StoryModeColors.border,
      }}
      onClick={() => togglePanel('news')}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: StoryModeColors.textSecondary }}>
          NACHRICHTEN
        </span>
        {unreadCount > 0 && (
          <span
            className="px-2 py-0.5 text-xs font-bold"
            style={{
              backgroundColor: StoryModeColors.danger,
              color: '#fff',
            }}
          >
            {unreadCount} NEU
          </span>
        )}
      </div>
      <div className="space-y-1">
        {recent.map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <span>{getTypeIcon(item.type)}</span>
            <span
              className="truncate"
              style={{
                color: item.read ? StoryModeColors.textMuted : StoryModeColors.textPrimary,
                fontWeight: item.read ? 'normal' : 'bold',
              }}
            >
              {item.headline_de}
            </span>
          </div>
        ))}
        {recent.length === 0 && (
          <div className="text-xs" style={{ color: StoryModeColors.textMuted }}>
            Keine Nachrichten
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// NPC STATUS WIDGET
// ============================================

function NpcStatusWidget({ npcs }: { npcs: NPCState[] }) {
  const { togglePanel } = usePanelStore();

  const getMoraleColor = (morale: number) => {
    if (morale >= 80) return StoryModeColors.success;
    if (morale >= 50) return StoryModeColors.warning;
    return StoryModeColors.danger;
  };

  return (
    <div
      className="p-3 border-2 cursor-pointer hover:brightness-110 transition-all"
      style={{
        backgroundColor: StoryModeColors.surface,
        borderColor: StoryModeColors.border,
      }}
      onClick={() => togglePanel('npcs')}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: StoryModeColors.textSecondary }}>
          KONTAKTE
        </span>
        <span className="text-xs" style={{ color: StoryModeColors.textMuted }}>
          {npcs.filter(n => n.available).length}/{npcs.length} aktiv
        </span>
      </div>
      <div className="space-y-1.5">
        {npcs.slice(0, 5).map(npc => (
          <div key={npc.id} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: npc.available ? getMoraleColor(npc.morale) : StoryModeColors.textMuted }}
            />
            <span
              className="text-xs flex-1 truncate"
              style={{ color: npc.available ? StoryModeColors.textPrimary : StoryModeColors.textMuted }}
            >
              {npc.name}
            </span>
            <span className="text-xs font-bold" style={{ color: getMoraleColor(npc.morale) }}>
              {npc.morale}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// QUICK ACTION BUTTONS
// ============================================

function QuickActions() {
  const { togglePanel } = usePanelStore();
  const panels: PanelId[] = ['actions', 'npcs', 'news', 'events', 'mission', 'stats'];

  return (
    <div className="grid grid-cols-3 gap-2">
      {panels.map(id => {
        const meta = PANEL_META[id];
        return (
          <button
            key={id}
            onClick={() => togglePanel(id)}
            className="p-2 border-2 text-center transition-all hover:brightness-125 active:translate-y-0.5"
            style={{
              backgroundColor: StoryModeColors.surface,
              borderColor: StoryModeColors.border,
              boxShadow: '2px 2px 0px 0px rgba(0,0,0,0.5)',
            }}
          >
            <div className="text-xl">{meta.icon}</div>
            <div className="text-[9px] font-bold mt-0.5" style={{ color: StoryModeColors.textSecondary }}>
              {meta.label}
            </div>
            <div className="text-[8px] mt-0.5" style={{ color: StoryModeColors.textMuted }}>
              [{meta.shortcut}]
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// MAIN DASHBOARD VIEW
// ============================================

export function DashboardView({
  resources,
  phase,
  objectives,
  newsEvents,
  npcs,
  unreadNewsCount,
  onEndPhase,
}: DashboardViewProps) {
  return (
    <div
      className="h-full overflow-y-auto p-4 font-mono"
      style={{ backgroundColor: StoryModeColors.background }}
    >
      {/* Phase Header */}
      <div
        className="mb-4 p-3 border-2 flex items-center justify-between"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border,
        }}
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl">☭</span>
          <div>
            <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
              OPERATIONSZENTRALE
            </div>
            <div className="font-bold" style={{ color: StoryModeColors.sovietRed }}>
              JAHR {phase.year} — MONAT {phase.month} — PHASE {phase.number}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
              AKTIONSPUNKTE
            </div>
            <div className="font-bold text-xl" style={{ color: StoryModeColors.warning }}>
              {resources.actionPointsRemaining}/{resources.actionPointsMax}
            </div>
          </div>
          <button
            onClick={onEndPhase}
            className="px-4 py-2 border-4 font-bold hover:brightness-110 transition-all active:translate-y-0.5"
            style={{
              backgroundColor: StoryModeColors.sovietRed,
              borderColor: StoryModeColors.darkRed,
              color: '#fff',
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.8)',
            }}
          >
            PHASE BEENDEN →
          </button>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        <ResourceCard icon="💰" label="BUDGET" value={resources.budget} format="currency" color={StoryModeColors.warning} danger={resources.budget < 20} />
        <ResourceCard icon="⚡" label="KAPAZITÄT" value={resources.capacity} format="number" color={StoryModeColors.agencyBlue} />
        <ResourceCard icon="⚠️" label="RISIKO" value={resources.risk} format="percent" color={StoryModeColors.sovietRed} danger={resources.risk > 60} />
        <ResourceCard icon="👁️" label="AUFMERKSAMKEIT" value={resources.attention} format="percent" color={StoryModeColors.danger} danger={resources.attention > 70} />
        <ResourceCard icon="💀" label="MORAL" value={resources.moralWeight} format="number" color={StoryModeColors.sovietRed} danger={resources.moralWeight > 60} />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column: Objectives + Quick Actions */}
        <div className="space-y-4">
          <ObjectivesWidget objectives={objectives} />
          <QuickActions />
        </div>

        {/* Center Column: News Feed */}
        <div>
          <NewsFeedWidget newsEvents={newsEvents} unreadCount={unreadNewsCount} />
        </div>

        {/* Right Column: NPC Status */}
        <div>
          <NpcStatusWidget npcs={npcs} />
        </div>
      </div>

      {/* View Toggle Hint */}
      <div
        className="mt-4 text-center text-xs py-2"
        style={{ color: StoryModeColors.textMuted }}
      >
        [V] Büro-Ansicht | [ESC] Panel schließen | Tastenkürzel: A/N/S/P/M/E
      </div>
    </div>
  );
}

export default DashboardView;
