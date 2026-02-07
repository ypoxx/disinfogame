import { StoryModeColors } from '../theme';
import { usePanelStore, PANEL_META, type PanelId } from '../stores/panelStore';

// ============================================
// TAB BAR
// ============================================

function TabBar() {
  const { activePanel, togglePanel } = usePanelStore();
  const panels: PanelId[] = ['actions', 'npcs', 'news', 'events', 'mission', 'stats'];

  return (
    <div
      className="flex border-b-4"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
      }}
    >
      {panels.map((id) => {
        const meta = PANEL_META[id];
        const isActive = activePanel === id;
        return (
          <button
            key={id}
            onClick={() => togglePanel(id)}
            className="flex-1 py-2 px-1 text-center transition-all hover:brightness-125 relative"
            style={{
              backgroundColor: isActive ? StoryModeColors.surface : 'transparent',
              borderBottom: isActive ? `3px solid ${StoryModeColors.sovietRed}` : '3px solid transparent',
            }}
            title={`${meta.label} [${meta.shortcut}]`}
          >
            <div className="text-lg leading-none">{meta.icon}</div>
            <div
              className="text-[9px] font-bold mt-0.5 tracking-wider"
              style={{
                color: isActive ? StoryModeColors.textPrimary : StoryModeColors.textMuted,
              }}
            >
              {meta.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// SIDE PANEL CONTAINER
// ============================================

interface SidePanelProps {
  children: React.ReactNode;
}

export function SidePanel({ children }: SidePanelProps) {
  const { activePanel, setActivePanel } = usePanelStore();

  if (!activePanel) return null;

  return (
    <div
      className="h-full flex flex-col border-l-4 animate-slide-in-right"
      style={{
        width: '420px',
        minWidth: '420px',
        backgroundColor: StoryModeColors.surface,
        borderColor: StoryModeColors.border,
      }}
    >
      {/* Tab Bar */}
      <TabBar />

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}

export default SidePanel;
