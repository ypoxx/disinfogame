import { StoryModeColors } from '../theme';
import { Icon } from './Icon';
import type { NewsEvent } from '../../game-logic/StoryEngineAdapter';

interface NewsPanelProps {
  isVisible: boolean;
  newsEvents: NewsEvent[];
  onMarkAsRead: (newsId: string) => void;
  onTogglePinned: (newsId: string) => void;
  onClose: () => void;
  variant?: 'modal' | 'sidebar';
}

export function NewsPanel({
  isVisible,
  newsEvents,
  onMarkAsRead,
  onTogglePinned,
  onClose,
  variant = 'modal',
}: NewsPanelProps) {
  if (!isVisible) return null;

  const sortedNews = [...newsEvents].sort((a, b) => {
    // Pinned first, then by phase (newest first)
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.phase - a.phase;
  });

  const getTypeIcon = (type: NewsEvent['type']): JSX.Element => {
    switch (type) {
      case 'action_result': return <Icon name="news" size={16} title="Aktionsergebnis" />;
      case 'consequence': return <Icon name="capacity" size={16} title="Konsequenz" />;
      case 'world_event': return <Icon name="events" size={16} title="Weltereignis" />;
      case 'npc_event': return <Icon name="npcs" size={16} title="NPC-Ereignis" />;
      default: return <Icon name="news" size={16} title="Nachricht" />;
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

  const newsListContent = (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sortedNews.length === 0 ? (
            <div
              className="text-center py-8"
              style={{ color: StoryModeColors.textMuted }}
            >
              Keine Nachrichten vorhanden.
            </div>
          ) : (
            sortedNews.map(news => {
              const isDefensiveAI = news.id.startsWith('defensive_');
              return (
              <div
                key={news.id}
                className={`border-2 p-4 cursor-pointer transition-all hover:brightness-110 ${
                  !news.read ? 'border-l-4' : ''
                } ${isDefensiveAI && !news.read ? 'animate-pulse-soft' : ''}`}
                style={{
                  backgroundColor: news.read
                    ? StoryModeColors.background
                    : StoryModeColors.darkConcrete,
                  borderColor: news.read
                    ? StoryModeColors.border
                    : getSeverityColor(news.severity),
                  borderLeftColor: !news.read ? getSeverityColor(news.severity) : undefined,
                }}
                onClick={() => onMarkAsRead(news.id)}
              >
                {/* News Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>{getTypeIcon(news.type)}</span>
                    <span
                      className="font-bold text-xs uppercase"
                      style={{ color: getSeverityColor(news.severity) }}
                    >
                      {news.type.replace('_', ' ')}
                    </span>
                    {isDefensiveAI && (
                      <span className="text-xs px-2 py-0.5 font-bold" style={{
                        backgroundColor: StoryModeColors.ministryRed,
                        color: '#fff',
                      }}>
                        DEFENSIVE AI
                      </span>
                    )}
                    {news.pinned && (
                      <span className="text-xs px-2 py-0.5" style={{
                        backgroundColor: StoryModeColors.warning,
                        color: StoryModeColors.background,
                      }}>
                        GEPINNT
                      </span>
                    )}
                    {!news.read && (
                      <span className="text-xs px-2 py-0.5" style={{
                        backgroundColor: StoryModeColors.danger,
                        color: '#fff',
                      }}>
                        NEU
                      </span>
                    )}
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: StoryModeColors.textMuted }}
                  >
                    Phase {news.phase}
                  </span>
                </div>

                {/* Headline */}
                <h3
                  className="font-bold mb-2"
                  style={{ color: StoryModeColors.textPrimary }}
                >
                  {news.headline_de}
                </h3>

                {/* Content */}
                <p
                  className="text-sm mb-3"
                  style={{ color: StoryModeColors.textSecondary }}
                >
                  {news.description_de}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePinned(news.id);
                    }}
                    className="px-3 py-1 text-xs font-bold border-2 transition-all hover:brightness-110"
                    style={{
                      backgroundColor: news.pinned
                        ? StoryModeColors.warning
                        : StoryModeColors.concrete,
                      borderColor: news.pinned
                        ? '#A37F1A'
                        : StoryModeColors.borderLight,
                      color: news.pinned
                        ? StoryModeColors.background
                        : StoryModeColors.textPrimary,
                    }}
                  >
                    {news.pinned ? 'ANGEPINNT' : 'ANPINNEN'}
                  </button>
                </div>
              </div>
            );
            })
          )}
        </div>

  );

  const footerContent = (
    <div
      className="px-3 py-2 border-t-2 text-xs"
      style={{
        backgroundColor: StoryModeColors.darkConcrete,
        borderColor: StoryModeColors.border,
        color: StoryModeColors.textMuted,
      }}
    >
      {newsEvents.filter(n => !n.read).length} ungelesene Nachrichten
    </div>
  );

  // Sidebar variant
  if (variant === 'sidebar') {
    return (
      <div className="flex flex-col h-full">
        <div
          className="px-3 py-2 border-b-2 flex items-center gap-2"
          style={{
            backgroundColor: StoryModeColors.danger,
            borderColor: StoryModeColors.border,
          }}
        >
          <Icon name="news" size={18} title="Nachrichten" />
          <h2 className="font-bold text-sm" style={{ color: '#fff' }}>
            NACHRICHTEN-FEED
          </h2>
        </div>
        {newsListContent}
        {footerContent}
      </div>
    );
  }

  // Modal variant
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[80vh] mx-4 border-2 flex flex-col"
        style={{
          backgroundColor: StoryModeColors.surface,
          borderColor: StoryModeColors.danger,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="px-6 py-4 border-b-2 flex justify-between items-center"
          style={{
            backgroundColor: StoryModeColors.danger,
            borderColor: StoryModeColors.border,
          }}
        >
          <div className="flex items-center gap-3">
            <Icon name="news" size={24} title="Nachrichten" />
            <h2 className="font-bold text-xl" style={{ color: '#fff' }}>
              NACHRICHTEN-FEED
            </h2>
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
        {newsListContent}
        {footerContent}
      </div>
    </div>
  );
}

export default NewsPanel;
