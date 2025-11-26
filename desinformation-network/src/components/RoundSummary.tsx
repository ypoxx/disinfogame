import { formatPercent } from '@/utils';
import { trustToHex } from '@/utils/colors';
import type { RoundSummary, ActionRecord, ImpactVisualization } from '@/game-logic/types/narrative';
import { cn } from '@/utils/cn';

type RoundSummaryProps = {
  summary: RoundSummary;
  impactVisualizations: ImpactVisualization[];
  onContinue: () => void;
};

const IMPACT_COLORS = {
  minimal: '#9CA3AF',
  minor: '#60A5FA',
  moderate: '#F59E0B',
  significant: '#EF4444',
  major: '#DC2626',
  devastating: '#7F1D1D',
};

const IMPACT_LABELS = {
  minimal: 'Minimal Impact',
  minor: 'Minor Impact',
  moderate: 'Moderate Impact',
  significant: 'Significant Impact',
  major: 'Major Impact',
  devastating: 'Devastating Impact',
};

export function RoundSummary({ summary, impactVisualizations, onContinue }: RoundSummaryProps) {
  const totalTrustChange = summary.networkBefore.averageTrust - summary.networkAfter.averageTrust;
  const playerActions = summary.playerActions;
  const allActions = [...summary.playerActions, ...summary.automaticEvents];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold">Round {summary.round} Summary</h2>
            <div className="text-right">
              <p className="text-sm text-gray-300">Network Trust</p>
              <p className="text-2xl font-bold" style={{ color: trustToHex(summary.networkAfter.averageTrust) }}>
                {formatPercent(summary.networkAfter.averageTrust)}
                <span className="text-lg ml-2">
                  ({totalTrustChange > 0 ? '+' : ''}{formatPercent(totalTrustChange)})
                </span>
              </p>
            </div>
          </div>

          {/* Round Narrative */}
          <p className="text-gray-200 text-lg leading-relaxed">
            {summary.roundNarrative}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Key Moments */}
          {summary.keyMoments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Key Moments
              </h3>
              <div className="space-y-2">
                {summary.keyMoments.map((moment, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <p className="text-gray-800 font-medium">{moment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions Detail */}
          {allActions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                What Happened
              </h3>
              <div className="space-y-4">
                {allActions.map((action, idx) => (
                  <div
                    key={action.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Action Header */}
                    <div
                      className="px-4 py-3 border-l-4"
                      style={{
                        borderLeftColor: IMPACT_COLORS[action.impactLevel],
                        backgroundColor: `${IMPACT_COLORS[action.impactLevel]}10`,
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-gray-900 text-lg">{action.headline}</h4>
                        <span
                          className="px-2 py-1 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: IMPACT_COLORS[action.impactLevel],
                            color: 'white',
                          }}
                        >
                          {IMPACT_LABELS[action.impactLevel]}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-2 leading-relaxed">
                        {action.description}
                      </p>
                    </div>

                    {/* Examples */}
                    {action.examples.length > 0 && (
                      <div className="px-4 py-3 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-600 mb-2">Concrete Examples:</p>
                        <ul className="space-y-1.5">
                          {action.examples.map((example, exIdx) => (
                            <li key={exIdx} className="text-sm text-gray-600 flex gap-2">
                              <span className="text-gray-400 flex-shrink-0">•</span>
                              <span className="italic">{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Impact Stats */}
                    <div className="px-4 py-2 bg-white border-t border-gray-100">
                      <div className="flex gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Actors Affected:</span>{' '}
                          <span className="font-semibold text-gray-900">
                            {Object.keys(action.trustChanges).length}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Trust Impact:</span>{' '}
                          <span className="font-semibold text-red-600">
                            {formatPercent(
                              Object.values(action.trustChanges).reduce((sum, v) => sum + v, 0) /
                              Math.max(Object.keys(action.trustChanges).length, 1)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Most Affected Actors */}
          {impactVisualizations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">👥</span>
                Most Affected Actors
              </h3>
              <div className="space-y-3">
                {impactVisualizations.slice(0, 5).map((impact) => (
                  <div key={impact.actorId} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{impact.actorName}</h4>
                        <p className="text-sm text-gray-500 italic mt-1">{impact.narrative}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Trust Change</p>
                        <p className={cn(
                          "text-xl font-bold",
                          impact.changes.trust < 0 ? "text-red-600" : "text-green-600"
                        )}>
                          {impact.changes.trust > 0 ? '+' : ''}{formatPercent(impact.changes.trust)}
                        </p>
                      </div>
                    </div>

                    {/* Before/After Visualization */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Before</p>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${impact.before.trust * 100}%`,
                              backgroundColor: trustToHex(impact.before.trust),
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{formatPercent(impact.before.trust)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">After</p>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${impact.after.trust * 100}%`,
                              backgroundColor: trustToHex(impact.after.trust),
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{formatPercent(impact.after.trust)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consequences */}
          {summary.consequences.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                Consequences
              </h3>
              <div className="space-y-2">
                {summary.consequences.map((consequence, idx) => (
                  <div key={idx} className="p-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                    <p className="text-gray-800">{consequence}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Network Metrics */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Network Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Low Trust Actors</p>
                <p className="text-2xl font-bold text-red-600">
                  {summary.networkAfter.lowTrustCount}
                  <span className="text-sm text-gray-500 ml-1">
                    ({summary.networkAfter.lowTrustCount - summary.networkBefore.lowTrustCount > 0 ? '+' : ''}
                    {summary.networkAfter.lowTrustCount - summary.networkBefore.lowTrustCount})
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Polarization</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatPercent(summary.networkAfter.polarization)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Actors Affected</p>
                <p className="text-2xl font-bold text-blue-600">
                  {summary.actorsAffected}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onContinue}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            Continue to Round {summary.round + 1} →
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoundSummary;
