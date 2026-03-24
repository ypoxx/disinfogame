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
// SIDE PANEL — CENTERED MODAL (replaces push sidebar)
// ============================================

interface SidePanelProps {
  children: React.ReactNode;
}

export function SidePanel({ children }: SidePanelProps) {
  const { activePanel, setActivePanel } = usePanelStore();

  if (!activePanel) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onClick={() => setActivePanel(null)}
      />

      {/* Centered Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="w-full max-w-2xl flex flex-col border-4 pointer-events-auto animate-slide-in-right relative"
          style={{
            maxHeight: 'calc(100vh - 8rem)',
            backgroundColor: StoryModeColors.surface,
            borderColor: StoryModeColors.border,
            boxShadow: '12px 12px 0px 0px rgba(0,0,0,0.7)',
          }}
        >
          {/* Tab Bar */}
          <TabBar />

          {/* Close button */}
          <button
            onClick={() => setActivePanel(null)}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center font-bold text-lg hover:brightness-125 transition-all z-10"
            style={{
              color: StoryModeColors.textSecondary,
            }}
            title="Schließen [ESC]"
          >
            ✕
          </button>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default SidePanel;
