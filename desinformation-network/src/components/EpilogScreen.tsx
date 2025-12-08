import { useState } from 'react';
import type { EpilogData, EpilogEntry } from '@/game-logic/EpilogGenerator';
import { cn } from '@/utils/cn';

// ============================================
// EPILOG SCREEN - Sprint 4
// Shows what happens 6 months, 2 years, 10 years later
// ============================================

type EpilogScreenProps = {
  epilog: EpilogData;
  onClose: () => void;
  onPlayAgain: () => void;
};

type TimeframeKey = '6_months' | '2_years' | '10_years';

const TIMEFRAME_LABELS: Record<TimeframeKey, { label: string; description: string }> = {
  '6_months': { label: '6 Monate später', description: 'Die unmittelbaren Folgen' },
  '2_years': { label: '2 Jahre später', description: 'Die mittelfristigen Auswirkungen' },
  '10_years': { label: '10 Jahre später', description: 'Die Generation danach' },
};

const SEVERITY_COLORS: Record<EpilogEntry['severity'], string> = {
  neutral: 'border-gray-600 bg-gray-800/30',
  concerning: 'border-yellow-600/50 bg-yellow-900/20',
  severe: 'border-orange-500/50 bg-orange-900/20',
  catastrophic: 'border-red-500/50 bg-red-900/20',
};

function EpilogEntryCard({ entry }: { entry: EpilogEntry }) {
  return (
    <div className={cn(
      'border rounded-lg p-4 transition-all hover:scale-[1.01]',
      SEVERITY_COLORS[entry.severity]
    )}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{entry.icon}</span>
        <p className="text-gray-200 text-sm leading-relaxed">{entry.text}</p>
      </div>
    </div>
  );
}

export function EpilogScreen({ epilog, onClose, onPlayAgain }: EpilogScreenProps) {
  const [currentTimeframe, setCurrentTimeframe] = useState<TimeframeKey>('6_months');
  const [showFinalStatement, setShowFinalStatement] = useState(false);

  const timeframes: TimeframeKey[] = ['6_months', '2_years', '10_years'];
  const currentIndex = timeframes.indexOf(currentTimeframe);

  const entries = {
    '6_months': epilog.entries.sixMonths,
    '2_years': epilog.entries.twoYears,
    '10_years': epilog.entries.tenYears,
  }[currentTimeframe];

  const handleNext = () => {
    if (currentIndex < timeframes.length - 1) {
      setCurrentTimeframe(timeframes[currentIndex + 1]);
    } else {
      setShowFinalStatement(true);
    }
  };

  const handlePrevious = () => {
    if (showFinalStatement) {
      setShowFinalStatement(false);
    } else if (currentIndex > 0) {
      setCurrentTimeframe(timeframes[currentIndex - 1]);
    }
  };

  // Final Statement Screen
  if (showFinalStatement) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
        <div className="max-w-2xl text-center">
          {/* Fade in effect */}
          <div className="animate-fade-in">
            <p className="text-2xl text-gray-200 leading-relaxed mb-12 italic">
              "{epilog.finalStatement}"
            </p>

            {/* Statistics Summary */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div>
                <div className="text-3xl font-bold text-red-400">
                  {(epilog.societalImpact.livesAffected / 1000000).toFixed(1)}M
                </div>
                <div className="text-gray-500 text-sm">Menschen beeinflusst</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-400">
                  {epilog.societalImpact.silencedVoices}
                </div>
                <div className="text-gray-500 text-sm">Stimmen verstummt</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">
                  {epilog.roundsPlayed}
                </div>
                <div className="text-gray-500 text-sm">Runden gespielt</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handlePrevious}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
              >
                ← Zurück
              </button>
              <button
                onClick={onPlayAgain}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
              >
                Nochmal spielen
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  // Timeline Screen
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            {epilog.gameResult === 'victory' ? 'Du hast gewonnen.' : 'Die Gesellschaft hat sich gewehrt.'}
          </h1>
          <p className="text-gray-400">
            Aber die Geschichte endet hier nicht. Lass uns sehen, was als nächstes passiert...
          </p>
        </div>
      </div>

      {/* Timeline Navigation */}
      <div className="px-6 py-4 border-b border-gray-700/30">
        <div className="max-w-4xl mx-auto flex gap-2">
          {timeframes.map((tf, i) => (
            <button
              key={tf}
              onClick={() => setCurrentTimeframe(tf)}
              className={cn(
                'flex-1 py-3 px-4 rounded-lg transition-all text-sm',
                currentTimeframe === tf
                  ? 'bg-white/10 text-white font-semibold'
                  : i <= currentIndex
                    ? 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                    : 'bg-gray-900/50 text-gray-600 cursor-not-allowed'
              )}
              disabled={i > currentIndex}
            >
              {TIMEFRAME_LABELS[tf].label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Timeframe Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-1">
              {TIMEFRAME_LABELS[currentTimeframe].label}
            </h2>
            <p className="text-gray-500 text-sm">
              {TIMEFRAME_LABELS[currentTimeframe].description}
            </p>
          </div>

          {/* Entries */}
          <div className="space-y-4">
            {entries.map((entry, i) => (
              <div
                key={i}
                className="animate-slide-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <EpilogEntryCard entry={entry} />
              </div>
            ))}
          </div>

          {entries.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              Die Auswirkungen sind noch nicht vollständig sichtbar...
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-6 border-t border-gray-700/50">
        <div className="max-w-4xl mx-auto flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={cn(
              'px-6 py-3 rounded-xl transition-colors',
              currentIndex === 0
                ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            )}
          >
            ← Zurück
          </button>

          <div className="flex items-center gap-2">
            {timeframes.map((tf, i) => (
              <div
                key={tf}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  i === currentIndex ? 'bg-white w-4' :
                  i < currentIndex ? 'bg-gray-500' : 'bg-gray-700'
                )}
              />
            ))}
            <div
              className={cn(
                'w-2 h-2 rounded-full transition-all ml-2',
                showFinalStatement ? 'bg-white w-4' : 'bg-gray-700'
              )}
            />
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
          >
            {currentIndex === timeframes.length - 1 ? 'Fazit →' : 'Weiter →'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default EpilogScreen;
