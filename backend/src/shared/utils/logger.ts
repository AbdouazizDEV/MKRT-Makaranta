/**
 * Logger simple pour l'application
 * En production, utiliser un logger plus robuste (Winston, Pino, etc.)
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message: string, ...args: unknown[]): void => {
    if (isDevelopment) {
      console.log(`ℹ️  ${message}`, ...args);
    }
  },

  error: (message: string, ...args: unknown[]): void => {
    console.error(`❌ ${message}`, ...args);
  },

  warn: (message: string, ...args: unknown[]): void => {
    console.warn(`⚠️  ${message}`, ...args);
  },

  debug: (message: string, ...args: unknown[]): void => {
    if (isDevelopment) {
      console.debug(`🔍 ${message}`, ...args);
    }
  },
};
