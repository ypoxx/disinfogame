import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { trustToHex } from '@/utils/colors';

// ============================================
// PROGRESS BAR COMPONENT
// ============================================

type ProgressBarProps = HTMLAttributes<HTMLDivElement> & {
  value: number;          // 0-1 normalized
  max?: number;           // Default 1
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside' | 'none';
  size?: 'sm' | 'md' | 'lg';
  colorMode?: 'trust' | 'fixed';
  fixedColor?: string;
  animated?: boolean;
};

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value,
      max = 1,
      showLabel = false,
      labelPosition = 'outside',
      size = 'md',
      colorMode = 'trust',
      fixedColor,
      animated = true,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const normalizedValue = value / max;

    const sizeStyles = {
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-3',
    };

    const barColor = colorMode === 'trust' 
      ? trustToHex(normalizedValue)
      : fixedColor || '#3B82F6';

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && labelPosition === 'outside' && (
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium" style={{ color: barColor }}>
              {Math.round(percentage)}%
            </span>
          </div>
        )}
        
        <div
          className={cn(
            'w-full bg-gray-100 rounded-full overflow-hidden',
            sizeStyles[size]
          )}
        >
          <div
            className={cn(
              'h-full rounded-full',
              animated && 'transition-all duration-300 ease-out'
            )}
            style={{
              width: `${percentage}%`,
              backgroundColor: barColor,
            }}
          >
            {showLabel && labelPosition === 'inside' && size === 'lg' && (
              <span className="px-2 text-xs font-medium text-white">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

// ============================================
// TRUST BAR COMPONENT (specialized)
// ============================================

type TrustBarProps = HTMLAttributes<HTMLDivElement> & {
  trust: number;          // 0-1 normalized
  baseTrust?: number;     // For showing change
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

export const TrustBar = forwardRef<HTMLDivElement, TrustBarProps>(
  (
    {
      className,
      trust,
      baseTrust,
      showLabel = true,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const percentage = Math.round(trust * 100);
    const color = trustToHex(trust);
    const changed = baseTrust !== undefined && trust !== baseTrust;
    const changeAmount = baseTrust !== undefined 
      ? Math.round((trust - baseTrust) * 100) 
      : 0;

    const sizeStyles = {
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-3',
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && (
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Trust</span>
            <div className="flex items-center gap-1">
              <span className="font-medium" style={{ color }}>
                {percentage}%
              </span>
              {changed && (
                <span 
                  className={cn(
                    'text-xs',
                    changeAmount > 0 ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  ({changeAmount > 0 ? '+' : ''}{changeAmount})
                </span>
              )}
            </div>
          </div>
        )}
        
        <div
          className={cn(
            'w-full bg-gray-100 rounded-full overflow-hidden relative',
            sizeStyles[size]
          )}
        >
          {/* Base trust marker */}
          {baseTrust !== undefined && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
              style={{ left: `${baseTrust * 100}%` }}
            />
          )}
          
          {/* Current trust fill */}
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>
    );
  }
);

TrustBar.displayName = 'TrustBar';

export default ProgressBar;
