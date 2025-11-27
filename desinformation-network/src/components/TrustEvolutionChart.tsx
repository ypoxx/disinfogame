import { useMemo } from 'react';
import { formatPercent } from '@/utils';
import { getCategoryColor } from '@/utils/colors';
import type { Actor } from '@/game-logic/types';

interface TrustHistoryPoint {
  round: number;
  actorTrust: Record<string, number>; // actorId → trust value
  averageTrust: number;
  event?: {
    type: string;
    description: string;
    actorId?: string;
  };
}

interface TrustEvolutionChartProps {
  history: TrustHistoryPoint[];
  actors: Actor[];
  selectedActorId?: string | null;
  showAnnotations?: boolean;
}

export function TrustEvolutionChart({
  history,
  actors,
  selectedActorId,
  showAnnotations = true
}: TrustEvolutionChartProps) {
  // Calculate chart dimensions
  const width = 800;
  const height = 400;
  const padding = { top: 40, right: 160, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxRounds = history.length;

  // Generate paths for each actor
  const actorPaths = useMemo(() => {
    return actors.map(actor => {
      const points = history.map((point, i) => {
        const x = padding.left + (i / (maxRounds - 1)) * chartWidth;
        const trust = point.actorTrust[actor.id] || actor.trust;
        const y = padding.top + (1 - trust) * chartHeight;
        return { x, y, trust };
      });

      const pathData = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

      return {
        actor,
        points,
        pathData,
        color: getCategoryColor(actor.category),
        finalTrust: points[points.length - 1].trust
      };
    });
  }, [history, actors, maxRounds, chartWidth, chartHeight]);

  // Key moments (significant trust drops)
  const keyMoments = useMemo(() => {
    return history
      .map((point, i) => {
        if (i === 0 || !point.event) return null;
        const prevPoint = history[i - 1];
        const trustDrop = prevPoint.averageTrust - point.averageTrust;
        if (Math.abs(trustDrop) > 0.1) {
          return {
            round: point.round,
            x: padding.left + (i / (maxRounds - 1)) * chartWidth,
            trustDrop,
            event: point.event
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [history, maxRounds, chartWidth]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Trust Evolution Over Time</h3>
        <p className="text-sm text-gray-600">
          How your manipulation campaign affected trust across the network
        </p>
      </div>

      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        <g className="grid">
          {[0, 0.25, 0.5, 0.75, 1].map(value => {
            const y = padding.top + (1 - value) * chartHeight;
            return (
              <g key={value}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {formatPercent(value)}
                </text>
              </g>
            );
          })}
        </g>

        {/* Round labels */}
        <g className="x-axis">
          {history.filter((_, i) => i % Math.ceil(maxRounds / 8) === 0).map((point, i) => {
            const x = padding.left + (point.round / (maxRounds - 1)) * chartWidth;
            return (
              <text
                key={i}
                x={x}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                R{point.round}
              </text>
            );
          })}
        </g>

        {/* Actor trust lines */}
        <g className="lines">
          {actorPaths.map(({ actor, pathData, color }) => {
            const isSelected = selectedActorId === actor.id;
            const opacity = selectedActorId ? (isSelected ? 1 : 0.2) : 0.7;

            return (
              <path
                key={actor.id}
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth={isSelected ? 3 : 2}
                opacity={opacity}
                className="transition-all duration-300"
              />
            );
          })}
        </g>

        {/* Key moments annotations */}
        {showAnnotations && keyMoments.map((moment, i) => (
          <g key={i} className="annotation">
            <line
              x1={moment.x}
              y1={padding.top}
              x2={moment.x}
              y2={height - padding.bottom}
              stroke="#EF4444"
              strokeWidth={1}
              strokeDasharray="2 2"
              opacity={0.5}
            />
            <circle
              cx={moment.x}
              cy={padding.top - 10}
              r={4}
              fill="#EF4444"
            />
            <foreignObject
              x={moment.x - 60}
              y={padding.top - 50}
              width={120}
              height={40}
            >
              <div className="text-xs text-center">
                <p className="font-semibold text-red-600">
                  Round {moment.round}
                </p>
                <p className="text-gray-600 truncate">
                  {moment.event?.description}
                </p>
              </div>
            </foreignObject>
          </g>
        ))}

        {/* Legend */}
        <g className="legend" transform={`translate(${padding.left + chartWidth + 20}, ${padding.top})`}>
          <text className="text-sm font-semibold fill-gray-900" y={0}>
            Actors
          </text>
          {actorPaths.slice(0, 8).map(({ actor, color, finalTrust }, i) => {
            const y = 20 + i * 24;
            const isSelected = selectedActorId === actor.id;

            return (
              <g
                key={actor.id}
                transform={`translate(0, ${y})`}
                className="cursor-pointer"
                opacity={selectedActorId ? (isSelected ? 1 : 0.4) : 1}
              >
                <line
                  x1={0}
                  y1={0}
                  x2={20}
                  y2={0}
                  stroke={color}
                  strokeWidth={isSelected ? 3 : 2}
                />
                <text x={25} y={4} className="text-xs fill-gray-700">
                  {actor.name.slice(0, 12)}
                </text>
                <text x={25} y={14} className="text-xs fill-gray-500">
                  {formatPercent(finalTrust)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-500 mb-1">Total Trust Decline</p>
          <p className="text-2xl font-bold text-red-600">
            -{formatPercent(history[0]?.averageTrust - history[history.length - 1]?.averageTrust || 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Steepest Drop</p>
          <p className="text-2xl font-bold text-orange-600">
            Round {keyMoments[0]?.round || '-'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Recovery Time</p>
          <p className="text-2xl font-bold text-gray-600">
            3-6 months
          </p>
          <p className="text-xs text-gray-400">Estimated</p>
        </div>
      </div>
    </div>
  );
}

// Heat map visualization
interface NetworkHeatMapProps {
  actors: Actor[];
  mode: 'trust' | 'activity' | 'propagation';
  actorMetrics?: Record<string, { timesTargeted: number; propagationCount: number }>;
}

export function NetworkHeatMap({ actors, mode, actorMetrics }: NetworkHeatMapProps) {
  const getHeatColor = (value: number, mode: string) => {
    if (mode === 'trust') {
      if (value > 0.7) return '#10B981'; // green
      if (value > 0.4) return '#F59E0B'; // yellow
      return '#EF4444'; // red
    } else {
      const intensity = Math.min(value / 10, 1);
      return `rgba(239, 68, 68, ${intensity})`;
    }
  };

  const getValue = (actor: Actor) => {
    switch (mode) {
      case 'trust':
        return actor.trust;
      case 'activity':
        return actorMetrics?.[actor.id]?.timesTargeted || 0;
      case 'propagation':
        return actorMetrics?.[actor.id]?.propagationCount || 0;
      default:
        return 0;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Network Heat Map
          {mode === 'trust' && ' - Trust Levels'}
          {mode === 'activity' && ' - Targeting Activity'}
          {mode === 'propagation' && ' - Propagation Impact'}
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {actors.map(actor => {
          const value = getValue(actor);
          const color = getHeatColor(value, mode);

          return (
            <div
              key={actor.id}
              className="aspect-square rounded-lg border-2 border-white shadow-sm flex flex-col items-center justify-center p-2 transition-transform hover:scale-105"
              style={{ backgroundColor: color }}
            >
              <p className="text-xs font-semibold text-white drop-shadow-md text-center">
                {actor.name}
              </p>
              <p className="text-lg font-bold text-white drop-shadow-md">
                {mode === 'trust' ? formatPercent(value) : `${Math.round(value)}×`}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">Legend:</span>
          {mode === 'trust' ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500" />
                <span className="text-xs text-gray-600">High (70-100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500" />
                <span className="text-xs text-gray-600">Medium (40-70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span className="text-xs text-gray-600">Low (0-40%)</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100" />
                <span className="text-xs text-gray-600">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span className="text-xs text-gray-600">High</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
