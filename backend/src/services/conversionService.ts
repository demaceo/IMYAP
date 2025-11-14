import {SpotifyService} from './spotifyService';
import {AppleMusicService} from './appleMusicService';

interface ConversionRequest {
  url: string;
  accessToken?: string;
}

interface ConversionResult {
  success: boolean;
  url?: string;
  error?: string;
  errorCode?: string;
}

export class ConversionService {
  private spotifyService: SpotifyService;
  private appleMusicService: AppleMusicService;

  constructor() {
    this.spotifyService = new SpotifyService();
    this.appleMusicService = new AppleMusicService();
  }

  /**
   * Main conversion method
   */
  async convert(request: ConversionRequest): Promise<ConversionResult> {
    try {
      const {url, accessToken} = request;

      // Determine source and target platforms
      const isSpotifySource = url.includes('spotify.com');
      const isAppleMusicSource = url.includes('music.apple.com');

      if (!isSpotifySource && !isAppleMusicSource) {
        return {
          success: false,
          error: 'Invalid URL. Must be a Spotify or Apple Music URL.',
          errorCode: 'INVALID_URL',
        };
      }

      if (isSpotifySource) {
        return await this.convertFromSpotify(url);
      } else {
        return await this.convertFromAppleMusic(url, accessToken);
      }
    } catch (error: any) {
      console.error('Conversion error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
        errorCode: 'CONVERSION_ERROR',
      };
    }
  }

  /**
   * Convert from Spotify to Apple Music
   */
  private async convertFromSpotify(url: string): Promise<ConversionResult> {
    try {
      // Parse Spotify URL
      const parsed = this.spotifyService.parseSpotifyUrl(url);
      if (!parsed) {
        return {
          success: false,
          error: 'Invalid Spotify URL format',
          errorCode: 'INVALID_SPOTIFY_URL',
        };
      }

      // Get source content
      let tracks: Array<{name: string; artist: string; album: string}>;

      if (parsed.type === 'playlist') {
        const playlist = await this.spotifyService.getPlaylist(parsed.id);
        tracks = playlist.tracks;
      } else {
        const track = await this.spotifyService.getTrack(parsed.id);
        tracks = [track];
      }

      if (tracks.length === 0) {
        return {
          success: false,
          error: 'No tracks found in source',
          errorCode: 'NO_TRACKS',
        };
      }

      // Search for first track on Apple Music (naive approach)
      const firstTrack = tracks[0];
      const appleMusicUrl = await this.appleMusicService.searchTrack(
        firstTrack.name,
        firstTrack.artist,
      );

      if (!appleMusicUrl) {
        return {
          success: false,
          error: 'Could not find matching track on Apple Music',
          errorCode: 'NO_MATCH',
        };
      }

      return {
        success: true,
        url: appleMusicUrl,
      };
    } catch (error: any) {
      console.error('Spotify conversion error:', error);

      if (error.statusCode === 401) {
        return {
          success: false,
          error: 'Authentication required. Please log in with Spotify.',
          errorCode: 'AUTH_REQUIRED',
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to convert from Spotify',
        errorCode: 'SPOTIFY_ERROR',
      };
    }
  }

  /**
   * Convert from Apple Music to Spotify
   */
  private async convertFromAppleMusic(
    url: string,
    accessToken?: string,
  ): Promise<ConversionResult> {
    try {
      // Check for Spotify authentication
      if (!accessToken) {
        return {
          success: false,
          error: 'Spotify authentication required to create playlists',
          errorCode: 'AUTH_REQUIRED',
        };
      }

      // Set access token
      this.spotifyService.setAccessToken(accessToken);

      // Parse Apple Music URL
      const parsed = this.appleMusicService.parseAppleMusicUrl(url);
      if (!parsed) {
        return {
          success: false,
          error: 'Invalid Apple Music URL format',
          errorCode: 'INVALID_APPLE_URL',
        };
      }

      // Get source content
      let tracks: Array<{name: string; artist: string; album: string}>;
      let playlistName = 'Converted Playlist';
      let playlistDescription = 'Converted from Apple Music';

      if (parsed.type === 'playlist') {
        const playlist = await this.appleMusicService.getPlaylist(
          parsed.id,
          parsed.storefront,
        );
        tracks = playlist.tracks;
        playlistName = playlist.name;
        playlistDescription = `Converted from Apple Music: ${playlist.description}`;
      } else {
        const song = await this.appleMusicService.getSong(
          parsed.id,
          parsed.storefront,
        );
        tracks = [song];
        playlistName = `${song.name} - ${song.artist}`;
      }

      if (tracks.length === 0) {
        return {
          success: false,
          error: 'No tracks found in source',
          errorCode: 'NO_TRACKS',
        };
      }

      // Search for tracks on Spotify
      const spotifyTrackIds: string[] = [];
      for (const track of tracks) {
        const trackId = await this.spotifyService.searchTrack(
          track.name,
          track.artist,
        );
        if (trackId) {
          spotifyTrackIds.push(trackId);
        }
      }

      if (spotifyTrackIds.length === 0) {
        return {
          success: false,
          error: 'Could not find any matching tracks on Spotify',
          errorCode: 'NO_MATCH',
        };
      }

      // Create playlist on Spotify
      const userId = await this.spotifyService.getUserId();
      const playlistUrl = await this.spotifyService.createPlaylist(
        userId,
        playlistName,
        playlistDescription,
        spotifyTrackIds,
      );

      return {
        success: true,
        url: playlistUrl,
      };
    } catch (error: any) {
      console.error('Apple Music conversion error:', error);

      if (error.statusCode === 401) {
        return {
          success: false,
          error: 'Spotify authentication expired. Please log in again.',
          errorCode: 'AUTH_EXPIRED',
        };
      }

      return {
        success: false,
        error: error.message || 'Failed to convert from Apple Music',
        errorCode: 'APPLE_ERROR',
      };
    }
  }
}
