/**
 * News Feed Component
 *
 * Shows live news, trending topics, and public reactions based on player's decisions.
 * Accessed via smartphone in office.
 */

import { useState } from 'react';
import { StoryModeColors } from '../theme';
import type { StoryModeState } from '../types';

interface NewsFeedProps {
  storyState: StoryModeState;
  onClose: () => void;
}

type NewsCategory = 'politics' | 'scandal' | 'health' | 'tech' | 'economy';

interface NewsItem {
  id: string;
  category: NewsCategory;
  headline: string;
  source: string;
  sourceBias: 'government' | 'independent' | 'opposition';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  sentiment: 'positive' | 'negative' | 'neutral';
}

export function NewsFeed({ storyState, onClose }: NewsFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'all'>('all');

  // Generate dynamic news based on story state
  const generateNews = (): NewsItem[] => {
    const news: NewsItem[] = [];

    // Pandemic-related news
    if (storyState.flags.pandemic_minimized) {
      news.push({
        id: 'pandemic-denial',
        category: 'health',
        headline: 'Regierung: "Pandemie ist unter Kontrolle" - Experten widersprechen',
        source: 'Unabhängige Zeitung',
        sourceBias: 'independent',
        engagement: { likes: 1200, shares: 450, comments: 230 },
        sentiment: 'negative',
      });
    }

    if (storyState.flags.pandemic_truth) {
      news.push({
        id: 'pandemic-truth',
        category: 'health',
        headline: 'PM gesteht Pandemie-Ernst ein: 200 Neuinfektionen täglich',
        source: 'Staatliche Nachrichten',
        sourceBias: 'government',
        engagement: { likes: 3400, shares: 890, comments: 120 },
        sentiment: 'neutral',
      });
    }

    if (storyState.flags.pandemic_denial_doubled) {
      news.push({
        id: 'pandemic-denial-2',
        category: 'health',
        headline: 'BREAKING: Regierung nennt Pandemie-Berichterstattung "Medienhysterie"',
        source: 'Opposition Daily',
        sourceBias: 'opposition',
        engagement: { likes: 8900, shares: 2300, comments: 890 },
        sentiment: 'negative',
      });
    }

    // Bot network / sex scandal
    if (storyState.flags.bot_network_activated) {
      news.push({
        id: 'bot-activity',
        category: 'tech',
        headline: 'Verdächtige Social-Media-Aktivität: Tausende neue Accounts über Nacht',
        source: 'Tech Watch',
        sourceBias: 'independent',
        engagement: { likes: 670, shares: 120, comments: 45 },
        sentiment: 'neutral',
      });
    }

    if (storyState.flags.volkov_sex_scandal) {
      news.push({
        id: 'sex-scandal',
        category: 'scandal',
        headline: '💥 SKANDAL: Oppositionsführer in Affäre verwickelt? Fotos aufgetaucht',
        source: 'Boulevard News',
        sourceBias: 'government',
        engagement: { likes: 45000, shares: 12000, comments: 3400 },
        sentiment: 'negative',
      });
      news.push({
        id: 'sex-scandal-denial',
        category: 'scandal',
        headline: 'Oppositionsführer: "Fotos sind Fälschung - politisches Komplott"',
        source: 'Opposition Daily',
        sourceBias: 'opposition',
        engagement: { likes: 23000, shares: 5600, comments: 1890 },
        sentiment: 'positive',
      });
    }

    if (storyState.flags.volkov_tax_campaign) {
      news.push({
        id: 'tax-scandal',
        category: 'scandal',
        headline: 'Steuerskandal: Opposition soll Millionen verschleiert haben',
        source: 'Investigativ Report',
        sourceBias: 'government',
        engagement: { likes: 12000, shares: 3400, comments: 890 },
        sentiment: 'negative',
      });
    }

    // Economy
    if (storyState.flags.economy_truth) {
      news.push({
        id: 'economy-honest',
        category: 'economy',
        headline: 'Regierung kündigt harte Sparmaßnahmen an - Wirtschaft schrumpft 6%',
        source: 'Wirtschafts Woche',
        sourceBias: 'independent',
        engagement: { likes: 2300, shares: 670, comments: 450 },
        sentiment: 'neutral',
      });
    }

    if (storyState.flags.economy_blamed) {
      news.push({
        id: 'economy-blame',
        category: 'economy',
        headline: 'PM: "Wirtschaftskrise ist Erbe der Opposition"',
        source: 'Staatliche Nachrichten',
        sourceBias: 'government',
        engagement: { likes: 890, shares: 230, comments: 120 },
        sentiment: 'positive',
      });
    }

    // Clean campaign
    if (storyState.flags.clean_campaign) {
      news.push({
        id: 'clean-campaign',
        category: 'politics',
        headline: 'Regierung setzt auf positive Kampagne: "Fakten statt Hetze"',
        source: 'Zentrale Presse',
        sourceBias: 'government',
        engagement: { likes: 5600, shares: 1200, comments: 340 },
        sentiment: 'positive',
      });
    }

    // Journalist discredited
    if (storyState.flags.journalist_discredited) {
      news.push({
        id: 'journalist-discredited',
        category: 'politics',
        headline: 'Bekannte Journalistin verliert Job nach Fake-News-Vorwürfen',
        source: 'Media Insider',
        sourceBias: 'government',
        engagement: { likes: 3400, shares: 890, comments: 560 },
        sentiment: 'negative',
      });
    }

    // Default news if nothing has happened yet
    if (news.length === 0) {
      news.push(
        {
          id: 'default-1',
          category: 'politics',
          headline: 'Wahlkampf beginnt: Alle Parteien mobilisieren ihre Basis',
          source: 'Zentrale Presse',
          sourceBias: 'independent',
          engagement: { likes: 1200, shares: 340, comments: 89 },
          sentiment: 'neutral',
        },
        {
          id: 'default-2',
          category: 'economy',
          headline: 'Börse reagiert nervös auf bevorstehende Wahlen',
          source: 'Wirtschafts Woche',
          sourceBias: 'independent',
          engagement: { likes: 890, shares: 120, comments: 45 },
          sentiment: 'neutral',
        },
      );
    }

    return news;
  };

  const news = generateNews();

  // Generate trending topics based on flags
  const getTrendingTopics = (): string[] => {
    const topics: string[] = [];

    if (storyState.flags.volkov_sex_scandal) {
      topics.push('#SexScandal', '#OppositionAffäre', '#BildBeweise');
    }
    if (storyState.flags.pandemic_minimized || storyState.flags.pandemic_denial_doubled) {
      topics.push('#PandemieLeugnung', '#CovidLüge');
    }
    if (storyState.flags.bot_network_activated) {
      topics.push('#BotArmy', '#FakeAccounts');
    }
    if (storyState.flags.economy_blamed) {
      topics.push('#OppositionSchuld', '#WirtschaftskriseFake');
    }
    if (storyState.flags.clean_campaign) {
      topics.push('#PositiverWahlkampf', '#FaktenStattHetze');
    }

    // Default trending
    if (topics.length === 0) {
      topics.push('#Wahlkampf2024', '#Politics', '#Breaking');
    }

    return topics;
  };

  const trendingTopics = getTrendingTopics();

  // Calculate public sentiment based on moral alignment and attention
  const calculatePublicSentiment = (): number => {
    return Math.max(
      0,
      Math.min(100, 50 + storyState.moralAlignment / 2 - storyState.resources.attention / 3)
    );
  };

  const publicSentiment = calculatePublicSentiment();

  // Filter news by category
  const filteredNews =
    selectedCategory === 'all' ? news : news.filter((n) => n.category === selectedCategory);

  const getCategoryColor = (category: NewsCategory): string => {
    switch (category) {
      case 'politics':
        return StoryModeColors.agencyBlue;
      case 'scandal':
        return StoryModeColors.sovietRed;
      case 'health':
        return StoryModeColors.danger;
      case 'tech':
        return StoryModeColors.warning;
      case 'economy':
        return StoryModeColors.militaryOlive;
    }
  };

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral'): string => {
    switch (sentiment) {
      case 'positive':
        return StoryModeColors.militaryOlive;
      case 'negative':
        return StoryModeColors.danger;
      case 'neutral':
        return StoryModeColors.textSecondary;
    }
  };

  const getBiasIcon = (bias: 'government' | 'independent' | 'opposition'): string => {
    switch (bias) {
      case 'government':
        return '🏛️';
      case 'independent':
        return '📰';
      case 'opposition':
        return '🔴';
    }
  };

  return (
    <div
      className="fixed inset-0 font-mono flex flex-col"
      style={{
        backgroundColor: StoryModeColors.background,
        color: StoryModeColors.textPrimary,
      }}
    >
      {/* Header */}
      <div
        className="border-b-4 p-4 flex justify-between items-center"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">📱</span>
          <div>
            <h1 className="text-xl font-bold">SOCIAL MEDIA FEED</h1>
            <p className="text-xs" style={{ color: StoryModeColors.textSecondary }}>
              Live News & Trending Topics
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 font-bold border-2 transition-all hover:translate-x-1"
          style={{
            backgroundColor: StoryModeColors.concrete,
            borderColor: StoryModeColors.borderLight,
            color: StoryModeColors.textPrimary,
            boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.8)',
          }}
        >
          ← ZURÜCK
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Trending Topics Banner */}
          <div
            className="border-4 p-4"
            style={{
              backgroundColor: StoryModeColors.darkConcrete,
              borderColor: StoryModeColors.border,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔥</span>
              <span className="font-bold">TRENDING JETZT</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic, i) => (
                <div
                  key={i}
                  className="px-3 py-1 border-2 text-xs font-bold"
                  style={{
                    backgroundColor: StoryModeColors.sovietRed,
                    borderColor: StoryModeColors.border,
                    color: '#FFFFFF',
                  }}
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>

          {/* Public Sentiment Gauge */}
          <div
            className="border-4"
            style={{
              backgroundColor: StoryModeColors.concrete,
              borderColor: StoryModeColors.border,
            }}
          >
            <div
              className="p-3 border-b-4 flex items-center gap-2 font-bold"
              style={{
                backgroundColor: StoryModeColors.darkConcrete,
                borderColor: StoryModeColors.border,
              }}
            >
              <span>📊</span>
              <span>ÖFFENTLICHE STIMMUNG</span>
            </div>
            <div className="p-4">
              <div className="flex justify-between text-xs mb-2">
                <span style={{ color: StoryModeColors.textSecondary }}>Gegen Regierung</span>
                <span style={{ color: StoryModeColors.textPrimary }}>
                  {Math.round(publicSentiment)}%
                </span>
                <span style={{ color: StoryModeColors.textSecondary }}>Pro Regierung</span>
              </div>
              <div
                className="h-8 border-2 relative"
                style={{
                  backgroundColor: StoryModeColors.darkConcrete,
                  borderColor: StoryModeColors.border,
                }}
              >
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${publicSentiment}%`,
                    backgroundColor:
                      publicSentiment > 60
                        ? StoryModeColors.militaryOlive
                        : publicSentiment > 40
                          ? StoryModeColors.warning
                          : StoryModeColors.danger,
                  }}
                />
              </div>
              <div className="text-xs mt-2 text-center" style={{ color: StoryModeColors.textSecondary }}>
                Basierend auf Social Media Analyse ({Math.round(storyState.resources.infrastructure * 10000)} Posts gescannt)
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <CategoryButton
              label="ALLE"
              active={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
            />
            <CategoryButton
              label="POLITIK"
              active={selectedCategory === 'politics'}
              onClick={() => setSelectedCategory('politics')}
              color={StoryModeColors.agencyBlue}
            />
            <CategoryButton
              label="SKANDAL"
              active={selectedCategory === 'scandal'}
              onClick={() => setSelectedCategory('scandal')}
              color={StoryModeColors.sovietRed}
            />
            <CategoryButton
              label="GESUNDHEIT"
              active={selectedCategory === 'health'}
              onClick={() => setSelectedCategory('health')}
              color={StoryModeColors.danger}
            />
            <CategoryButton
              label="TECH"
              active={selectedCategory === 'tech'}
              onClick={() => setSelectedCategory('tech')}
              color={StoryModeColors.warning}
            />
            <CategoryButton
              label="WIRTSCHAFT"
              active={selectedCategory === 'economy'}
              onClick={() => setSelectedCategory('economy')}
              color={StoryModeColors.militaryOlive}
            />
          </div>

          {/* News Items */}
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <NewsItemCard key={item.id} item={item} />
            ))}

            {filteredNews.length === 0 && (
              <div
                className="border-4 p-8 text-center"
                style={{
                  backgroundColor: StoryModeColors.concrete,
                  borderColor: StoryModeColors.border,
                  color: StoryModeColors.textSecondary,
                }}
              >
                Keine News in dieser Kategorie
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function CategoryButton({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 border-2 font-bold text-xs whitespace-nowrap transition-all"
      style={{
        backgroundColor: active
          ? color || StoryModeColors.agencyBlue
          : StoryModeColors.concrete,
        borderColor: StoryModeColors.border,
        color: active ? '#FFFFFF' : StoryModeColors.textPrimary,
        boxShadow: active ? '0 0 8px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      {label}
    </button>
  );
}

function NewsItemCard({ item }: { item: NewsItem }) {
  const getCategoryColor = (category: NewsCategory): string => {
    switch (category) {
      case 'politics':
        return StoryModeColors.agencyBlue;
      case 'scandal':
        return StoryModeColors.sovietRed;
      case 'health':
        return StoryModeColors.danger;
      case 'tech':
        return StoryModeColors.warning;
      case 'economy':
        return StoryModeColors.militaryOlive;
    }
  };

  const getBiasIcon = (bias: 'government' | 'independent' | 'opposition'): string => {
    switch (bias) {
      case 'government':
        return '🏛️';
      case 'independent':
        return '📰';
      case 'opposition':
        return '🔴';
    }
  };

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral'): string => {
    switch (sentiment) {
      case 'positive':
        return StoryModeColors.militaryOlive;
      case 'negative':
        return StoryModeColors.danger;
      case 'neutral':
        return StoryModeColors.textSecondary;
    }
  };

  return (
    <div
      className="border-4"
      style={{
        backgroundColor: StoryModeColors.concrete,
        borderColor: StoryModeColors.border,
      }}
    >
      {/* Header with category and source */}
      <div
        className="px-3 py-2 border-b-2 flex justify-between items-center"
        style={{
          backgroundColor: StoryModeColors.darkConcrete,
          borderColor: StoryModeColors.border,
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="px-2 py-1 border text-xs font-bold"
            style={{
              backgroundColor: getCategoryColor(item.category),
              borderColor: StoryModeColors.border,
              color: '#FFFFFF',
            }}
          >
            {item.category.toUpperCase()}
          </div>
          <div className="text-xs flex items-center gap-1" style={{ color: StoryModeColors.textSecondary }}>
            <span>{getBiasIcon(item.sourceBias)}</span>
            <span>{item.source}</span>
          </div>
        </div>
        <div
          className="text-xs font-bold"
          style={{ color: getSentimentColor(item.sentiment) }}
        >
          {item.sentiment === 'positive' && '📈'}
          {item.sentiment === 'negative' && '📉'}
          {item.sentiment === 'neutral' && '━'}
        </div>
      </div>

      {/* Headline */}
      <div className="p-4">
        <div className="text-sm font-bold mb-3" style={{ color: StoryModeColors.textPrimary }}>
          {item.headline}
        </div>

        {/* Engagement Stats */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1" style={{ color: StoryModeColors.textSecondary }}>
            <span>👍</span>
            <span>{item.engagement.likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1" style={{ color: StoryModeColors.textSecondary }}>
            <span>🔄</span>
            <span>{item.engagement.shares.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1" style={{ color: StoryModeColors.textSecondary }}>
            <span>💬</span>
            <span>{item.engagement.comments.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
