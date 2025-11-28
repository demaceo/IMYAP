/**
 * Simple logging utility
 *
 * This provides a centralized way to handle logging in the application.
 * In production, this can be easily extended to integrate with services like:
 * - Sentry (error tracking)
 * - Firebase Crashlytics
 * - Bugsnag
 * - LogRocket
 */

/**
 * Log an error with context
 * @param message - Error message or description
 * @param error - Optional error object
 */
export const logError = (message: string, error?: unknown): void => {
  if (__DEV__) {
    // In development, log to console
    console.error(`[ERROR] ${message}`, error || '');
  } else {
    // In production, you would send to an error tracking service
    // Example: Sentry.captureException(error, { extra: { message } });
    // For now, we just suppress console logs in production
  }
};

/**
 * Log a warning
 * @param message - Warning message
 */
export const logWarning = (message: string): void => {
  if (__DEV__) {
    console.warn(`[WARNING] ${message}`);
  }
};

/**
 * Log info (development only)
 * @param message - Info message
 */
export const logInfo = (message: string): void => {
  if (__DEV__) {
    console.log(`[INFO] ${message}`);
  }
};

/**
 * Log debug information (development only)
 * @param message - Debug message
 * @param data - Optional debug data
 */
export const logDebug = (message: string, data?: unknown): void => {
  if (__DEV__) {
    console.log(`[DEBUG] ${message}`, data || '');
  }
};

export default {
  logError,
  logWarning,
  logInfo,
  logDebug,
};
