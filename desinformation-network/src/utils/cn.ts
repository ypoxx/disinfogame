import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge for conditional class names
 * 
 * @example
 * cn('base-class', isActive && 'active-class', isDisabled && 'disabled-class')
 * cn('px-4 py-2', variant === 'primary' && 'bg-blue-500')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
