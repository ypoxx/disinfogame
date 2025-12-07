import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { formatPercent } from '@/utils';
import type { PostGameAnalysis as PostGameAnalysisType, TechniqueUsageStats, TimelineEvent, EducationalInsight, ReflectionQuestion } from '@/game-logic/types';
import { techniqueCategories } from '@/data/educational-content';

// ============================================
// PROPS
// ============================================

type Props = {
  analysis: PostGameAnalysisType;
  onClose: () => void;
  onPlayAgain: () => void;
};

type TabType = 'overview' | 'techniques' | 'timeline' | 'insights' | 'questions';

// ============================================
// SUB-COMPONENTS
// ============================================

function StatCard({ label, value, subValue, color = 'text-white' }: {
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
}) {
  return (
    <div className="bg-gray-800/60 rounded-lg p-4">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {subValue && <p className="text-gray-500 text-xs mt-1">{subValue}</p>}
    </div>
  );
}

function TechniqueCard({ stat }: { stat: TechniqueUsageStats }) {
  const categoryInfo = techniqueCategories[stat.category as keyof typeof techniqueCategories] || {
    name: stat.category,
    color: '#6B7280',
  };

  return (
    <div className="bg-gray-800/60 rounded-lg p-4 border-l-4" style={{ borderColor: categoryInfo.color }}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-white">{stat.name}</h4>
          <p className="text-xs text-gray-400">{categoryInfo.name}</p>
        </div>
        <span className="bg-gray-700 px-2 py-1 rounded text-sm text-gray-300">
          {stat.timesUsed}x
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
        <div>
          <p className="text-gray-500">Trust-Wirkung</p>
          <p className={stat.totalTrustImpact < 0 ? 'text-red-400' : 'text-green-400'}>
            {stat.totalTrustImpact > 0 ? '+' : ''}{formatPercent(stat.totalTrustImpact)}
          </p>
        </div>
        <div>
          <p className="text-gray-500">Ressourcen</p>
          <p className="text-blue-400">{stat.resourcesSpent}</p>
        </div>
      </div>

      {stat.realWorldExample && (
        <p className="mt-3 text-xs text-gray-400 italic border-t border-gray-700 pt-2">
          Real: {stat.realWorldExample}
        </p>
      )}
    </div>
  );
}

function TimelineItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const impactColors = {
    positive: 'bg-green-500',
    negative: 'bg-red-500',
    neutral: 'bg-gray-500',
  };

  const typeIcons = {
    ability_used: '🎯',
    event_triggered: '⚡',
    defensive_spawn: '🛡️',
    escalation_change: '📈',
    milestone: '🏆',
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${impactColors[event.impact]}`} />
        {!isLast && <div className="w-0.5 h-full bg-gray-700 mt-1" />}
      </div>
      <div className="pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Runde {event.round}</span>
          <span>{typeIcons[event.type]}</span>
        </div>
        <h4 className="font-medium text-white">{event.title}</h4>
        <p className="text-sm text-gray-400">{event.description}</p>
        {event.trustChange !== undefined && (
          <p className={`text-sm mt-1 ${event.trustChange < 0 ? 'text-red-400' : 'text-green-400'}`}>
            Trust: {event.trustChange > 0 ? '+' : ''}{formatPercent(event.trustChange)}
          </p>
        )}
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: EducationalInsight }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-800/60 rounded-lg p-4">
      <h4 className="font-semibold text-white mb-2">{insight.title}</h4>
      <p className="text-sm text-gray-300">{insight.description}</p>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-gray-700 pt-3">
          <div>
            <p className="text-xs text-gray-500 uppercase">Realworld-Bezug</p>
            <p className="text-sm text-gray-300">{insight.realWorldConnection}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Gegenstrategie</p>
            <p className="text-sm text-green-300">{insight.counterStrategy}</p>
          </div>
          {insight.learnMoreUrl && (
            <a
              href={insight.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              Mehr erfahren →
            </a>
          )}
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-gray-400 hover:text-white mt-2"
      >
        {expanded ? 'Weniger' : 'Mehr erfahren'}
      </button>
    </div>
  );
}

function QuestionCard({ question, index }: { question: ReflectionQuestion; index: number }) {
  return (
    <div className="bg-gray-800/60 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="bg-yellow-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
          {index + 1}
        </span>
        <div>
          <p className="text-white font-medium">{question.question}</p>
          <p className="text-xs text-gray-400 mt-1">{question.context}</p>
          {question.relatedTechnique && (
            <span className="inline-block mt-2 text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
              Technik: {question.relatedTechnique}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function PostGameAnalysis({ analysis, onClose, onPlayAgain }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Übersicht', icon: '📊' },
    { id: 'techniques', label: 'Techniken', icon: '🎯' },
    { id: 'timeline', label: 'Zeitverlauf', icon: '📈' },
    { id: 'insights', label: 'Erkenntnisse', icon: '💡' },
    { id: 'questions', label: 'Reflexion', icon: '🤔' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Kampagnen-Analyse</h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Score Banner */}
                <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-6 text-center">
                  <p className="text-gray-400 uppercase text-sm tracking-wider">Endpunktzahl</p>
                  <p className="text-5xl font-bold text-yellow-400 my-2">
                    {analysis.score.toLocaleString()}
                  </p>
                  <p className="text-xl text-gray-300 capitalize">
                    {analysis.victoryType.replace(/_/g, ' ')}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    label="Runden gespielt"
                    value={analysis.roundsPlayed}
                    subValue={`von 32`}
                  />
                  <StatCard
                    label="Durchschn. Trust"
                    value={formatPercent(analysis.finalAverageTrust)}
                    color={analysis.finalAverageTrust < 0.4 ? 'text-red-400' : 'text-green-400'}
                  />
                  <StatCard
                    label="Kompromittiert"
                    value={`${analysis.actorsCompromised}/${analysis.totalActors}`}
                    subValue={formatPercent(analysis.actorsCompromised / analysis.totalActors)}
                    color="text-red-400"
                  />
                  <StatCard
                    label="Eskalation"
                    value={`Level ${analysis.escalationLevel}`}
                    color={
                      analysis.escalationLevel <= 2 ? 'text-green-400' :
                      analysis.escalationLevel <= 4 ? 'text-yellow-400' : 'text-red-400'
                    }
                  />
                </div>

                {/* Resource Usage */}
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    label="Fähigkeiten eingesetzt"
                    value={analysis.totalAbilitiesUsed}
                  />
                  <StatCard
                    label="Ressourcen ausgegeben"
                    value={analysis.totalResourcesSpent}
                    color="text-blue-400"
                  />
                </div>

                {/* Category Breakdown */}
                <div className="bg-gray-800/60 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-4">Vertrauens-Veränderung nach Kategorie</h3>
                  <div className="space-y-3">
                    {Object.entries(analysis.categoryBreakdown).map(([category, data]) => {
                      const change = data.final - data.initial;
                      return (
                        <div key={category} className="flex items-center gap-4">
                          <span className="w-28 text-gray-400 capitalize">{category}</span>
                          <div className="flex-1 bg-gray-700 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 transition-all"
                              style={{ width: `${(1 - data.final) * 100}%` }}
                            />
                          </div>
                          <span className={`text-sm w-16 text-right ${change < 0 ? 'text-red-400' : 'text-green-400'}`}>
                            {change > 0 ? '+' : ''}{formatPercent(change)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Highlights */}
                {(analysis.mostEffectiveTechnique || analysis.mostUsedTechnique) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.mostEffectiveTechnique && (
                      <div className="bg-red-900/30 rounded-lg p-4 border border-red-800">
                        <p className="text-red-400 text-sm uppercase mb-1">Effektivste Technik</p>
                        <p className="text-white font-semibold">{analysis.mostEffectiveTechnique.name}</p>
                        <p className="text-gray-400 text-sm">
                          {formatPercent(analysis.mostEffectiveTechnique.totalTrustImpact)} Trust-Veränderung
                        </p>
                      </div>
                    )}
                    {analysis.mostUsedTechnique && (
                      <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-800">
                        <p className="text-blue-400 text-sm uppercase mb-1">Meistgenutzte Technik</p>
                        <p className="text-white font-semibold">{analysis.mostUsedTechnique.name}</p>
                        <p className="text-gray-400 text-sm">
                          {analysis.mostUsedTechnique.timesUsed}x eingesetzt
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Techniques Tab */}
            {activeTab === 'techniques' && (
              <div className="space-y-4">
                <p className="text-gray-400 mb-4">
                  Übersicht aller eingesetzten Manipulationstechniken und ihre Wirksamkeit.
                </p>
                {analysis.techniqueStats.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Keine Techniken eingesetzt.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.techniqueStats
                      .sort((a, b) => b.timesUsed - a.timesUsed)
                      .map(stat => (
                        <TechniqueCard key={stat.abilityId} stat={stat} />
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <p className="text-gray-400 mb-4">
                  Chronologischer Verlauf Ihrer Kampagne.
                </p>
                {analysis.timeline.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Keine Ereignisse aufgezeichnet.
                  </p>
                ) : (
                  <div className="bg-gray-800/40 rounded-lg p-4">
                    {analysis.timeline.map((event, index) => (
                      <TimelineItem
                        key={`${event.round}-${event.type}-${index}`}
                        event={event}
                        isLast={index === analysis.timeline.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Insights Tab */}
            {activeTab === 'insights' && (
              <div className="space-y-4">
                <p className="text-gray-400 mb-4">
                  Lernerkenntnisse basierend auf Ihrer Kampagne.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.insights.map(insight => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </div>
            )}

            {/* Reflection Questions Tab */}
            {activeTab === 'questions' && (
              <div className="space-y-4">
                <p className="text-gray-400 mb-4">
                  Fragen zur Selbstreflexion nach dem Spiel.
                </p>
                <div className="space-y-4">
                  {analysis.reflectionQuestions.map((question, index) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-800">
            <Button
              onClick={onPlayAgain}
              variant="primary"
              size="lg"
              className="font-semibold"
            >
              Nochmal spielen
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              size="lg"
              className="font-semibold"
            >
              Schließen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
