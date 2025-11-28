/**
 * Environment Configuration
 *
 * This module provides a centralized way to access environment variables.
 *
 * Setup Instructions:
 * 1. Copy .env.example to .env in the project root
 * 2. Fill in your actual API keys and secrets
 * 3. Install react-native-config: npm install react-native-config
 * 4. Follow platform-specific setup:
 *    - iOS: cd ios && pod install
 *    - Android: See react-native-config documentation
 * 5. Uncomment the import below and update getEnvVar function
 *
 * For now, this file provides a mock implementation that can be
 * easily upgraded to use react-native-config when needed.
 */

// import Config from 'react-native-config';

interface EnvConfig {
  // Apple Music API
  APPLE_MUSIC_API_KEY?: string;
  APPLE_MUSIC_TEAM_ID?: string;
  APPLE_MUSIC_KEY_ID?: string;

  // Spotify API
  SPOTIFY_CLIENT_ID?: string;
  SPOTIFY_CLIENT_SECRET?: string;
  SPOTIFY_REDIRECT_URI?: string;

  // API Configuration
  API_ENV?: string;
  API_BASE_URL?: string;

  // Feature Flags
  ENABLE_ANALYTICS?: string;
  ENABLE_ERROR_REPORTING?: string;

  // Debug
  DEBUG_MODE?: string;
}

/**
 * Get environment variable value
 * @param key - Environment variable key
 * @param defaultValue - Default value if not found
 * @returns Environment variable value or default
 */
export const getEnvVar = (
  key: keyof EnvConfig,
  defaultValue: string = '',
): string => {
  // TODO: Replace this with actual react-native-config when ready
  // return Config[key] || defaultValue;

  // For now, return defaults or empty string
  return defaultValue;
};

/**
 * Check if environment variable is enabled (for boolean flags)
 * @param key - Environment variable key
 * @returns true if enabled, false otherwise
 */
export const isEnvEnabled = (key: keyof EnvConfig): boolean => {
  const value = getEnvVar(key, 'false').toLowerCase();
  return value === 'true' || value === '1' || value === 'yes';
};

/**
 * Get all environment configuration (useful for debugging in development)
 * WARNING: Never expose this in production!
 */
export const getAllEnv = (): EnvConfig => {
  if (__DEV__) {
    // TODO: Replace with actual Config object when using react-native-config
    // return Config as EnvConfig;
    return {};
  }
  return {};
};

export default {
  getEnvVar,
  isEnvEnabled,
  getAllEnv,
};
