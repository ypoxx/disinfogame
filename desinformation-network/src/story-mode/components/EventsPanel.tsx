import { StoryModeColors } from '../theme';
import type { NewsEvent } from '../../game-logic/StoryEngineAdapter';

interface EventsPanelProps {
  isVisible: boolean;
  worldEvents: NewsEvent[];
  currentPhase: number;
  onClose: () => void;
}

export function EventsPanel({
  isVisible,
  worldEvents,
  currentPhase,
  onClose,
}: EventsPanelProps) {
  if (!isVisible) return null;

  // Filter only world_event type
  const events = worldEvents.filter(e => e.type === 'world_event');

  // Sort by phase (newest first)
  const sortedEvents = [...events].sort((a, b) => b.phase - a.phase);

  // Group by category based on headline keywords
  const getEventCategory = (event: NewsEvent): string => {
    const headline = event.headline_de.toLowerCase();
    if (headline.includes('wahl') || headline.includes('politisch')) return 'political';
    if (headline.includes('medien') || headline.includes('presse')) return 'media';
    if (headline.includes('wirtschaft') || headline.includes('krise')) return 'economic';
    if (headline.includes('sicherheit') || headline.includes('leak')) return 'security';
    if (headline.includes('protest') || headline.includes('bewegung')) return 'social';
    if (headline.includes('diplomat') || headline.includes('international')) return 'diplomatic';
    return 'other';
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'political': return '🏛️';
      case 'media': return '📺';
      case 'economic': return '📉';
      case 'security': return '🔒';
      case 'social': return '✊';
      case 'diplomatic': return '🌐';
      default: return '🌍';
    }
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'political': return 'POLITISCH';
      case 'media': return 'MEDIEN';
      case 'economic': return 'WIRTSCHAFT';
      case 'security': return 'SICHERHEIT';
      case 'social': return 'SOZIAL';
      case 'diplomatic': return 'DIPLOMATISCH';
      default: return 'SONSTIGES';
    }
  };

  const getSeverityColor = (severity: NewsEvent['severity']) => {
    switch (severity) {
      case 'danger': return StoryModeColors.danger;
      case 'warning': return StoryModeColors.warning;
      case 'success': return StoryModeColors.success;
      case 'info': return StoryModeColors.agencyBlue;
      default: return StoryModeColors.textSecondary;
    }
  };

  const getSeverityLabel = (severity: NewsEvent['severity']): string => {
    switch (severity) {
      case 'danger': return 'GEFAHR';
      case 'warning': return 'WARNUNG';
      case 'success': return 'VORTEIL';
      case 'info': return 'INFO';
      default: return '';
    }
  };

  // Group events by category
  const groupedEvents = sortedEvents.reduce((acc, event) => {
    const category = getEventCategory(event);
    if (!acc[category]) acc[category] = [];
    acc[category].push(event);
    return acc;
  }, {} as Record<string, NewsEvent[]>);

  const categoryOrder = ['political', 'media', 'economic', 'security', 'social', 'diplomatic', 'other'];
  const orderedCategories = categoryOrder.filter(cat => groupedEvents[cat]?.length > 0);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[85vh] mx-4 border-4 flex flex-col"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.militaryOlive,
          boxShadow: '12px 12px 0px 0px rgba(0,0,0,0.9)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b-4 flex justify-between items-center"
          style={{
            backgroundColor: StoryModeColors.militaryOlive,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌍</span>
            <div>
              <h2 className="font-bold text-xl" style={{ color: StoryModeColors.warning }}>
                WELT-EREIGNISSE
              </h2>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Phase {currentPhase} - Externe Faktoren
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1 font-bold border-2 transition-all hover:brightness-110"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              borderColor: StoryModeColors.border,
              color: StoryModeColors.textPrimary,
            }}
          >
            SCHLIESSEN [ESC]
          </button>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto p-4">
          {sortedEvents.length === 0 ? (
            <div
              className="text-center py-12"
              style={{ color: StoryModeColors.textMuted }}
            >
              <div className="text-4xl mb-4">🌐</div>
              <div className="font-bold mb-2">Keine Weltereignisse</div>
              <div className="text-sm">
                Die Welt ist ruhig... vorerst.
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orderedCategories.map(category => (
                <div key={category}>
                  {/* Category Header */}
                  <div
                    className="flex items-center gap-2 mb-3 pb-2 border-b-2"
                    style={{ borderColor: StoryModeColors.border }}
                  >
                    <span className="text-lg">{getCategoryIcon(category)}</span>
                    <span
                      className="font-bold text-sm tracking-wider"
                      style={{ color: StoryModeColors.textSecondary }}
                    >
                      {getCategoryLabel(category)}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5"
                      style={{
                        backgroundColor: StoryModeColors.darkConcrete,
                        color: StoryModeColors.textMuted,
                      }}
                    >
                      {groupedEvents[category].length}
                    </span>
                  </div>

                  {/* Events in Category */}
                  <div className="space-y-3 ml-2">
                    {groupedEvents[category].map(event => (
                      <div
                        key={event.id}
                        className="border-l-4 pl-4 py-3 transition-all"
                        style={{
                          borderLeftColor: getSeverityColor(event.severity),
                          backgroundColor: 'rgba(0,0,0,0.2)',
                        }}
                      >
                        {/* Event Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="font-bold text-xs px-2 py-0.5"
                              style={{
                                backgroundColor: getSeverityColor(event.severity),
                                color: event.severity === 'warning' ? StoryModeColors.background : '#fff',
                              }}
                            >
                              {getSeverityLabel(event.severity)}
                            </span>
                            {!event.read && (
                              <span
                                className="text-xs px-2 py-0.5 animate-pulse"
                                style={{
                                  backgroundColor: StoryModeColors.sovietRed,
                                  color: '#fff',
                                }}
                              >
                                NEU
                              </span>
                            )}
                          </div>
                          <span
                            className="text-xs whitespace-nowrap"
                            style={{ color: StoryModeColors.textMuted }}
                          >
                            Phase {event.phase}
                          </span>
                        </div>

                        {/* Headline */}
                        <h3
                          className="font-bold mb-2"
                          style={{ color: StoryModeColors.textPrimary }}
                        >
                          {event.headline_de}
                        </h3>

                        {/* Description */}
                        <p
                          className="text-sm"
                          style={{ color: StoryModeColors.textSecondary }}
                        >
                          {event.description_de}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t-4 flex justify-between items-center"
          style={{
            backgroundColor: StoryModeColors.darkConcrete,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="text-xs" style={{ color: StoryModeColors.textMuted }}>
            {events.length} Ereignis{events.length !== 1 ? 'se' : ''} insgesamt
          </div>
          <div className="flex gap-4 text-xs">
            <span style={{ color: StoryModeColors.success }}>● Vorteil</span>
            <span style={{ color: StoryModeColors.warning }}>● Warnung</span>
            <span style={{ color: StoryModeColors.danger }}>● Gefahr</span>
            <span style={{ color: StoryModeColors.agencyBlue }}>● Info</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsPanel;
