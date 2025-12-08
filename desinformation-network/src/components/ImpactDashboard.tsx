import type { SocietalImpact } from '@/game-logic/ConsequenceGenerator';
import { cn } from '@/utils/cn';

// ============================================
// IMPACT DASHBOARD - Sprint 4
// Shows the societal cost of player actions
// "Tracker der gesellschaftlichen Zerstörung"
// ============================================

type ImpactDashboardProps = {
  impact: SocietalImpact;
  isExpanded?: boolean;
  onToggle?: () => void;
};

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return n.toString();
}

function ImpactBar({
  label,
  value,
  maxValue = 1,
  color,
  icon,
  inverse = false,
}: {
  label: string;
  value: number;
  maxValue?: number;
  color: string;
  icon: string;
  inverse?: boolean;
}) {
  const percentage = (value / maxValue) * 100;
  const displayValue = inverse ? maxValue - value : value;
  const isWarning = inverse ? value < 0.4 : value > 0.6;
  const isCritical = inverse ? value < 0.25 : value > 0.8;

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-400 flex items-center gap-1">
          <span>{icon}</span>
          {label}
        </span>
        <span className={cn(
          'font-mono',
          isCritical ? 'text-red-400' :
          isWarning ? 'text-yellow-400' :
          'text-gray-300'
        )}>
          {Math.round(displayValue * 100)}%
        </span>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-500 rounded-full',
            isCritical ? 'bg-red-500' :
            isWarning ? 'bg-yellow-500' :
            color
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function ImpactDashboard({ impact, isExpanded = false, onToggle }: ImpactDashboardProps) {
  // Calculate overall "destruction score"
  const destructionScore = (
    (1 - impact.trustInInstitutions) * 0.3 +
    impact.polarizationLevel * 0.3 +
    impact.misinformationSpread * 0.2 +
    Math.min(impact.silencedVoices / 5, 1) * 0.2
  );

  const scoreColor = destructionScore > 0.6 ? 'text-red-400' :
                     destructionScore > 0.4 ? 'text-yellow-400' :
                     'text-gray-400';

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl shadow-xl overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">💀</span>
          <span className="text-sm font-medium text-gray-300">Gesellschaftlicher Schaden</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-bold', scoreColor)}>
            {Math.round(destructionScore * 100)}%
          </span>
          <span className="text-gray-500 text-xs">
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-700/50">
          {/* Key Stats */}
          <div className="pt-3 grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-white">
                {formatNumber(impact.livesAffected)}
              </div>
              <div className="text-[10px] text-gray-500">Menschen betroffen</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-white">
                {impact.silencedVoices}
              </div>
              <div className="text-[10px] text-gray-500">Stimmen verstummt</div>
            </div>
          </div>

          {/* Impact Bars */}
          <div className="space-y-2.5 pt-2">
            <ImpactBar
              label="Vertrauen in Institutionen"
              value={impact.trustInInstitutions}
              color="bg-blue-500"
              icon="🏛️"
              inverse={true}
            />
            <ImpactBar
              label="Polarisierung"
              value={impact.polarizationLevel}
              color="bg-orange-500"
              icon="⚡"
            />
            <ImpactBar
              label="Desinformation"
              value={impact.misinformationSpread}
              color="bg-purple-500"
              icon="📱"
            />
          </div>

          {/* Economic Cost */}
          <div className="pt-2 border-t border-gray-700/50">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500">Volkswirtschaftlicher Schaden</span>
              <span className="text-red-400 font-mono">
                ~{impact.economicCost.toFixed(1)} Mio. €
              </span>
            </div>
          </div>

          {/* Warning */}
          {destructionScore > 0.5 && (
            <div className={cn(
              'text-[10px] p-2 rounded mt-2',
              destructionScore > 0.7
                ? 'bg-red-900/30 text-red-300'
                : 'bg-yellow-900/30 text-yellow-300'
            )}>
              {destructionScore > 0.7
                ? '⚠️ Kritisch: Die Gesellschaft wird Jahrzehnte brauchen, um sich zu erholen.'
                : '⚠️ Warnung: Die Auswirkungen werden lange spürbar sein.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImpactDashboard;
