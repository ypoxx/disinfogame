import type { RiskState } from '@/game-logic/types';
import { cn } from '@/utils/cn';

// ============================================
// RISK METER - Sprint 2
// Shows player's exposure level and detection risk
// ============================================

type RiskMeterProps = {
  riskState: RiskState;
};

const EXPOSURE_COLORS = {
  hidden: { bg: 'bg-green-500', text: 'text-green-400', label: 'Hidden' },
  suspected: { bg: 'bg-yellow-500', text: 'text-yellow-400', label: 'Suspected' },
  known: { bg: 'bg-orange-500', text: 'text-orange-400', label: 'Known' },
  exposed: { bg: 'bg-red-500', text: 'text-red-400', label: 'Exposed!' },
};

export function RiskMeter({ riskState }: RiskMeterProps) {
  const { exposure, exposureLevel, detectionHistory } = riskState;
  const colorConfig = EXPOSURE_COLORS[exposureLevel];
  const recentDetections = detectionHistory.filter(
    (d) => d.wasDetected
  ).length;

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl px-4 py-3 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm font-medium">Exposure Risk</span>
        <span className={cn('text-xs font-bold', colorConfig.text)}>
          {colorConfig.label}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
        <div
          className={cn(
            'h-full transition-all duration-500',
            colorConfig.bg,
            exposureLevel === 'exposed' && 'animate-pulse'
          )}
          style={{ width: `${exposure * 100}%` }}
        />

        {/* Threshold markers */}
        <div className="absolute inset-0 flex">
          <div className="w-[15%] border-r border-gray-600/50" />
          <div className="w-[20%] border-r border-gray-600/50" />
          <div className="w-[25%] border-r border-gray-600/50" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between text-[10px] text-gray-500">
        <span>{Math.round(exposure * 100)}% exposed</span>
        {recentDetections > 0 && (
          <span className="text-orange-400">
            {recentDetections} detection{recentDetections !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Warning for high exposure */}
      {exposureLevel === 'known' && (
        <div className="mt-2 text-[10px] text-orange-300 bg-orange-900/20 rounded px-2 py-1">
          ⚠️ High risk of detection
        </div>
      )}
      {exposureLevel === 'exposed' && (
        <div className="mt-2 text-[10px] text-red-300 bg-red-900/20 rounded px-2 py-1 animate-pulse">
          🚨 Extremely high risk! Every action likely to be detected
        </div>
      )}
    </div>
  );
}

export default RiskMeter;
