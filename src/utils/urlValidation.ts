/**
 * URL validation and detection utilities for IMYAP
 */

export type Platform = 'apple' | 'spotify' | 'unknown';

export interface URLValidationResult {
  isValid: boolean;
  platform: Platform;
  type?: 'playlist' | 'song' | 'album';
}

/**
 * URL patterns for supported platforms
 */
const URL_PATTERNS = {
  appleMusic: /^https?:\/\/(music\.apple\.com|itunes\.apple\.com)\/.*/i,
  spotify: /^https?:\/\/(open\.spotify\.com|play\.spotify\.com)\/.*/i,
};

/**
 * Detects which platform a URL belongs to
 * @param url - The URL to check
 * @returns The platform ('apple', 'spotify', or 'unknown')
 */
export const detectPlatform = (url: string): Platform => {
  const trimmedUrl = url.trim();

  if (URL_PATTERNS.appleMusic.test(trimmedUrl)) {
    return 'apple';
  } else if (URL_PATTERNS.spotify.test(trimmedUrl)) {
    return 'spotify';
  }

  return 'unknown';
};

/**
 * Validates if a URL is from a supported platform
 * @param url - The URL to validate
 * @returns true if the URL is valid, false otherwise
 */
export const validateUrl = (url: string): boolean => {
  const trimmedUrl = url.trim();
  return (
    URL_PATTERNS.appleMusic.test(trimmedUrl) ||
    URL_PATTERNS.spotify.test(trimmedUrl)
  );
};

/**
 * Validates a URL and returns detailed information
 * @param url - The URL to validate
 * @returns Validation result with platform information
 */
export const validateUrlDetailed = (url: string): URLValidationResult => {
  const trimmedUrl = url.trim();
  const platform = detectPlatform(trimmedUrl);
  const isValid = platform !== 'unknown';

  return {
    isValid,
    platform,
  };
};

/**
 * Gets the target platform name for conversion
 * @param sourcePlatform - The source platform
 * @returns The target platform name
 */
export const getTargetPlatformName = (sourcePlatform: Platform): string => {
  return sourcePlatform === 'apple' ? 'Spotify' : 'Apple Music';
};
