/**
 * @format
 */

import {
  detectPlatform,
  validateUrl,
  validateUrlDetailed,
  getTargetPlatformName,
} from '../src/utils/urlValidation';

describe('URL Validation Utilities', () => {
  describe('detectPlatform', () => {
    it('should detect Apple Music URLs', () => {
      const urls = [
        'https://music.apple.com/us/playlist/test/pl.123',
        'https://itunes.apple.com/us/album/test/123',
        'https://music.apple.com/playlist/test',
      ];

      urls.forEach(url => {
        expect(detectPlatform(url)).toBe('apple');
      });
    });

    it('should detect Spotify URLs', () => {
      const urls = [
        'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
        'https://play.spotify.com/track/123abc',
        'https://open.spotify.com/album/test',
      ];

      urls.forEach(url => {
        expect(detectPlatform(url)).toBe('spotify');
      });
    });

    it('should return unknown for invalid URLs', () => {
      const urls = [
        'https://youtube.com/watch?v=test',
        'https://soundcloud.com/artist/track',
        'not a url',
        '',
      ];

      urls.forEach(url => {
        expect(detectPlatform(url)).toBe('unknown');
      });
    });

    it('should reject HTTP URLs (HTTPS only for security)', () => {
      const urls = [
        'http://music.apple.com/playlist/test',
        'http://open.spotify.com/album/test',
      ];

      urls.forEach(url => {
        expect(detectPlatform(url)).toBe('unknown');
      });
    });

    it('should handle URLs with whitespace', () => {
      expect(detectPlatform('  https://music.apple.com/test  ')).toBe('apple');
      expect(detectPlatform('  https://open.spotify.com/test  ')).toBe(
        'spotify',
      );
    });
  });

  describe('validateUrl', () => {
    it('should validate Apple Music URLs', () => {
      expect(validateUrl('https://music.apple.com/us/playlist/test')).toBe(
        true,
      );
      expect(validateUrl('https://itunes.apple.com/album/test')).toBe(true);
    });

    it('should validate Spotify URLs', () => {
      expect(validateUrl('https://open.spotify.com/playlist/test')).toBe(true);
      expect(validateUrl('https://play.spotify.com/track/test')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('https://youtube.com/watch')).toBe(false);
      expect(validateUrl('not a url')).toBe(false);
      expect(validateUrl('')).toBe(false);
    });
  });

  describe('validateUrlDetailed', () => {
    it('should return detailed validation for Apple Music', () => {
      const result = validateUrlDetailed(
        'https://music.apple.com/playlist/test',
      );
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe('apple');
    });

    it('should return detailed validation for Spotify', () => {
      const result = validateUrlDetailed(
        'https://open.spotify.com/playlist/test',
      );
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe('spotify');
    });

    it('should return invalid for unknown URLs', () => {
      const result = validateUrlDetailed('https://youtube.com/watch');
      expect(result.isValid).toBe(false);
      expect(result.platform).toBe('unknown');
    });
  });

  describe('getTargetPlatformName', () => {
    it('should return Spotify for Apple Music', () => {
      expect(getTargetPlatformName('apple')).toBe('Spotify');
    });

    it('should return Apple Music for Spotify', () => {
      expect(getTargetPlatformName('spotify')).toBe('Apple Music');
    });

    it('should return Apple Music for unknown platform', () => {
      expect(getTargetPlatformName('unknown')).toBe('Apple Music');
    });
  });
});
