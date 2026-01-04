/**
 * Logger Utility
 *
 * Centralized logging that can be disabled in production.
 * All console.log statements in the codebase should use this instead.
 *
 * Usage:
 *   import { logger } from '@/utils/logger';
 *   logger.log('Message');
 *   logger.warn('Warning');
 *   logger.error('Error');
 *   logger.debug('Debug info');  // Only in development
 *   logger.group('Group name');
 *   logger.groupEnd();
 */

type LogLevel = 'debug' | 'log' | 'warn' | 'error' | 'none';

interface LoggerConfig {
  level: LogLevel;
  enableInProduction: boolean;
  prefix?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  log: 1,
  warn: 2,
  error: 3,
  none: 4,
};

class Logger {
  private config: LoggerConfig;
  private isProduction: boolean;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.isProduction = import.meta.env?.PROD ?? process.env.NODE_ENV === 'production';
    this.config = {
      level: this.isProduction ? 'warn' : 'debug',
      enableInProduction: false,
      prefix: '[DisInfo]',
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isProduction && !this.config.enableInProduction) {
      // In production, only log warnings and errors by default
      return LOG_LEVELS[level] >= LOG_LEVELS.warn;
    }
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level];
  }

  private formatMessage(message: unknown): string {
    if (typeof message === 'string') {
      return this.config.prefix ? `${this.config.prefix} ${message}` : message;
    }
    return String(message);
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage(args[0]), ...args.slice(1));
    }
  }

  log(...args: unknown[]): void {
    if (this.shouldLog('log')) {
      console.log(this.formatMessage(args[0]), ...args.slice(1));
    }
  }

  info(...args: unknown[]): void {
    this.log(...args);
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage(args[0]), ...args.slice(1));
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage(args[0]), ...args.slice(1));
    }
  }

  group(label: string): void {
    if (this.shouldLog('log')) {
      console.group(this.formatMessage(label));
    }
  }

  groupEnd(): void {
    if (this.shouldLog('log')) {
      console.groupEnd();
    }
  }

  groupCollapsed(label: string): void {
    if (this.shouldLog('log')) {
      console.groupCollapsed(this.formatMessage(label));
    }
  }

  table(data: unknown): void {
    if (this.shouldLog('debug')) {
      console.table(data);
    }
  }

  time(label: string): void {
    if (this.shouldLog('debug')) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.shouldLog('debug')) {
      console.timeEnd(label);
    }
  }

  /**
   * Create a child logger with a specific prefix
   */
  child(prefix: string): Logger {
    return new Logger({
      ...this.config,
      prefix: `${this.config.prefix} [${prefix}]`,
    });
  }

  /**
   * Temporarily enable/disable logging
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }
}

// Default logger instance
export const logger = new Logger();

// Named loggers for different subsystems
export const gameLogger = logger.child('Game');
export const storyLogger = logger.child('Story');
export const uiLogger = logger.child('UI');
export const networkLogger = logger.child('Network');

export default logger;
