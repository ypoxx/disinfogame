import { useMemo } from 'react';
import type { GameStatistics as GameStatsType } from '@/game-logic/types';
import { formatPercent } from '@/utils';
import { trustToHex } from '@/utils/colors';
import { cn } from '@/utils/cn';

type GameStatisticsProps = {
  statistics: GameStatsType;
  onClose: () => void;
};

// Simple line chart component using SVG
function LineChart({
  data,
  width = 600,
  height = 200,
  color = '#3B82F6',
  label = '',
}: {
  data: Array<{ x: number; y: number }>;
  width?: number;
  height?: number;
  color?: string;
  label?: string;
}) {
  const points = useMemo(() => {
    if (data.length === 0) return '';

    const xMin = Math.min(...data.map(d => d.x));
    const xMax = Math.max(...data.map(d => d.x));
    const yMin = Math.min(...data.map(d => d.y), 0);
    const yMax = Math.max(...data.map(d => d.y), 1);

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const xScale = (x: number) => padding + ((x - xMin) / (xMax - xMin || 1)) * chartWidth;
    const yScale = (y: number) => height - padding - ((y - yMin) / (yMax - yMin || 1)) * chartHeight;

    return data.map((d, i) => {
      const x = xScale(d.x);
      const y = yScale(d.y);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
  }, [data, width, height]);

  const gridLines = useMemo(() => {
    const lines = [];
    const yMin = Math.min(...data.map(d => d.y), 0);
    const yMax = Math.max(...data.map(d => d.y), 1);
    const padding = 40;
    const chartHeight = height - padding * 2;

    for (let i = 0; i <= 4; i++) {
      const y = height - padding - (i / 4) * chartHeight;
      const value = yMin + (i / 4) * (yMax - yMin);
      lines.push({ y, value });
    }
    return lines;
  }, [data, height]);

  return (
    <div className="relative">
      {label && <p className="text-sm text-gray-400 mb-2">{label}</p>}
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={40}
              y1={line.y}
              x2={width - 40}
              y2={line.y}
              stroke="#374151"
              strokeWidth="1"
              strokeDasharray="4"
            />
            <text
              x={35}
              y={line.y + 4}
              textAnchor="end"
              fill="#9CA3AF"
              fontSize="10"
            >
              {formatPercent(line.value)}
            </text>
          </g>
        ))}

        {/* Chart line */}
        <path
          d={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const xMin = Math.min(...data.map(d => d.x));
          const xMax = Math.max(...data.map(d => d.x));
          const yMin = Math.min(...data.map(d => d.y), 0);
          const yMax = Math.max(...data.map(d => d.y), 1);
          const padding = 40;
          const chartWidth = width - padding * 2;
          const chartHeight = height - padding * 2;
          const x = padding + ((d.x - xMin) / (xMax - xMin || 1)) * chartWidth;
          const y = height - padding - ((d.y - yMin) / (yMax - yMin || 1)) * chartHeight;

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    </div>
  );
}

// Bar chart component
function BarChart({
  data,
  width = 400,
  height = 200,
  colors = ['#3B82F6', '#EF4444', '#8B5CF6'],
}: {
  data: Array<{ label: string; value: number }>;
  width?: number;
  height?: number;
  colors?: string[];
}) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const padding = 40;
  const chartHeight = height - padding * 2;
  const barWidth = (width - padding * 2) / data.length - 10;

  return (
    <svg width={width} height={height}>
      {data.map((d, i) => {
        const barHeight = (d.value / maxValue) * chartHeight;
        const x = padding + i * ((width - padding * 2) / data.length);
        const y = height - padding - barHeight;

        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={colors[i % colors.length]}
              rx="4"
            />
            <text
              x={x + barWidth / 2}
              y={height - padding + 15}
              textAnchor="middle"
              fill="#9CA3AF"
              fontSize="10"
            >
              {d.label}
            </text>
            <text
              x={x + barWidth / 2}
              y={y - 5}
              textAnchor="middle"
              fill="white"
              fontSize="12"
              fontWeight="bold"
            >
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function GameStatistics({ statistics, onClose }: GameStatisticsProps) {
  const trustEvolutionData = statistics.trustEvolution.map(point => ({
    x: point.round,
    y: point.trust,
  }));

  const resourceSpendingData = [
    { label: 'Money', value: statistics.totalMoneySpent },
    { label: 'Attention', value: Math.round(statistics.totalAttentionGenerated) },
    { label: 'Infrastructure', value: statistics.infrastructureBuilt },
  ];

  const finalTrust = statistics.trustEvolution[statistics.trustEvolution.length - 1]?.trust || 0;
  const trustColor = trustToHex(finalTrust);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-6xl w-full border border-gray-700 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {statistics.victory ? '🎭 Campaign Complete' : '✨ Campaign Statistics'}
            </h2>
            <p className="text-gray-400">
              {statistics.victory
                ? 'You successfully undermined public trust'
                : 'Society prevailed against your campaign'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Total Rounds</p>
            <p className="text-3xl font-bold text-white">{statistics.totalRounds}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Final Trust</p>
            <p className="text-3xl font-bold" style={{ color: trustColor }}>
              {formatPercent(finalTrust)}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Money Spent</p>
            <p className="text-3xl font-bold text-yellow-400">
              💰 {statistics.totalMoneySpent}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">Peak Detection</p>
            <p className="text-3xl font-bold text-red-400">
              {formatPercent(statistics.peakDetectionRisk)}
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trust Evolution Chart */}
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Trust Evolution</h3>
            <LineChart
              data={trustEvolutionData}
              color="#EF4444"
              label="Average network trust over time"
            />
          </div>

          {/* Resource Spending */}
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Resource Spending</h3>
            <BarChart
              data={resourceSpendingData}
              colors={['#F59E0B', '#EF4444', '#8B5CF6']}
            />
          </div>
        </div>

        {/* Abilities Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Most Used Ability */}
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Most Used Ability</h3>
            {statistics.mostUsedAbility ? (
              <div>
                <p className="text-2xl font-bold text-blue-400 mb-2">
                  {statistics.mostUsedAbility.name}
                </p>
                <p className="text-gray-400">
                  Used <span className="text-white font-semibold">{statistics.mostUsedAbility.timesUsed}</span> times
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No abilities used</p>
            )}
          </div>

          {/* Most Effective Ability */}
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Most Effective Ability</h3>
            {statistics.mostEffectiveAbility ? (
              <div>
                <p className="text-2xl font-bold text-green-400 mb-2">
                  {statistics.mostEffectiveAbility.name}
                </p>
                <p className="text-gray-400">
                  Average impact: <span className="text-white font-semibold">
                    {Math.round(statistics.mostEffectiveAbility.avgTrustDelta * 100)}%
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No abilities used</p>
            )}
          </div>
        </div>

        {/* Achievements */}
        {statistics.achievements.length > 0 && (
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Achievements</h3>
            <div className="flex flex-wrap gap-3">
              {statistics.achievements.map((achievement, i) => (
                <div
                  key={i}
                  className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg px-4 py-2"
                >
                  <p className="text-yellow-400 font-medium">🏆 {achievement}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Round History Table */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Round History</h3>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="text-left p-3 text-gray-400">Round</th>
                  <th className="text-left p-3 text-gray-400">Avg Trust</th>
                  <th className="text-left p-3 text-gray-400">Low Trust Count</th>
                  <th className="text-left p-3 text-gray-400">Actions</th>
                  <th className="text-left p-3 text-gray-400">Resources Spent</th>
                </tr>
              </thead>
              <tbody>
                {statistics.roundHistory.map((round) => (
                  <tr key={round.round} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-3 text-white font-semibold">{round.round}</td>
                    <td className="p-3" style={{ color: trustToHex(round.averageTrust) }}>
                      {formatPercent(round.averageTrust)}
                    </td>
                    <td className="p-3 text-red-400">{round.lowTrustCount}</td>
                    <td className="p-3 text-gray-300">{round.actionsPerformed}</td>
                    <td className="p-3 text-yellow-400">💰 {round.resourcesSpent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Close Statistics
          </button>
        </div>
      </div>
    </div>
  );
}
