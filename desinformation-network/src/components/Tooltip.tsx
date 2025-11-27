import { ReactNode } from 'react';

type TooltipProps = {
  children: ReactNode;
  content: string | ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
};

export function Tooltip({ children, content, position = 'top', className = '' }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className={`relative group ${className}`}>
      {children}
      <div className={`
        absolute ${positionClasses[position]}
        invisible group-hover:visible
        bg-gray-900 text-white text-xs rounded-lg py-2 px-3
        whitespace-nowrap z-50 shadow-lg
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none
      `}>
        {content}
        <div className={`
          absolute w-2 h-2 bg-gray-900 transform rotate-45
          ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
          ${position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
          ${position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
          ${position === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}
        `} />
      </div>
    </div>
  );
}

export default Tooltip;
