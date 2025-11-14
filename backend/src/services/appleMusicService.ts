import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

export class AppleMusicService {
  private developerToken: string | null = null;
  private tokenExpiry: number = 0;

  /**
   * Generate Apple Music Developer Token (valid for 6 months)
   */
  private generateDeveloperToken(): string {
    const teamId = process.env.APPLE_TEAM_ID;
    const keyId = process.env.APPLE_KEY_ID;
    const privateKeyPath = process.env.APPLE_PRIVATE_KEY_PATH;

    if (!teamId || !keyId || !privateKeyPath) {
      throw new Error('Apple Music credentials not configured');
    }

    const privateKey = fs.readFileSync(path.resolve(privateKeyPath), 'utf8');

    const token = jwt.sign({}, privateKey, {
      algorithm: 'ES256',
      expiresIn: '180d', // 6 months
      issuer: teamId,
      header: {
        alg: 'ES256',
        kid: keyId,
      },
    });

    return token;
  }

  /**
   * Get or refresh developer token
   */
  getDeveloperToken(): string {
    const now = Date.now();

    // Generate new token if expired or doesn't exist
    if (!this.developerToken || now >= this.tokenExpiry) {
      this.developerToken = this.generateDeveloperToken();
      this.tokenExpiry = now + 180 * 24 * 60 * 60 * 1000; // 180 days
    }

    return this.developerToken;
  }

  /**
   * Parse Apple Music URL and extract playlist/song ID
   */
  parseAppleMusicUrl(
    url: string,
  ): {type: 'playlist' | 'song'; id: string; storefront: string} | null {
    const playlistMatch = url.match(
      /music\.apple\.com\/([a-z]{2})\/playlist\/[^/]+\/pl\.([a-zA-Z0-9-]+)/,
    );
    if (playlistMatch) {
      return {
        type: 'playlist',
        id: playlistMatch[2],
        storefront: playlistMatch[1],
      };
    }

    const songMatch = url.match(
      /music\.apple\.com\/([a-z]{2})\/(?:album\/[^/]+\/)?(\d+)/,
    );
    if (songMatch) {
      return {type: 'song', id: songMatch[2], storefront: songMatch[1]};
    }

    return null;
  }

  /**
   * Get playlist details and tracks from Apple Music
   */
  async getPlaylist(
    playlistId: string,
    storefront: string = 'us',
  ): Promise<{
    name: string;
    description: string;
    tracks: Array<{name: string; artist: string; album: string; isrc?: string}>;
  }> {
    const token = this.getDeveloperToken();

    const response = await axios.get(
      `https://api.music.apple.com/v1/catalog/${storefront}/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          include: 'tracks',
        },
      },
    );

    const playlist = response.data.data[0];
    const tracks = playlist.relationships.tracks.data.map((track: any) => ({
      name: track.attributes.name,
      artist: track.attributes.artistName,
      album: track.attributes.albumName,
      isrc: track.attributes.isrc,
    }));

    return {
      name: playlist.attributes.name,
      description: playlist.attributes.description?.standard || '',
      tracks,
    };
  }

  /**
   * Get song details from Apple Music
   */
  async getSong(
    songId: string,
    storefront: string = 'us',
  ): Promise<{
    name: string;
    artist: string;
    album: string;
    isrc?: string;
  }> {
    const token = this.getDeveloperToken();

    const response = await axios.get(
      `https://api.music.apple.com/v1/catalog/${storefront}/songs/${songId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const song = response.data.data[0];

    return {
      name: song.attributes.name,
      artist: song.attributes.artistName,
      album: song.attributes.albumName,
      isrc: song.attributes.isrc,
    };
  }

  /**
   * Search for a track on Apple Music
   */
  async searchTrack(
    trackName: string,
    artistName: string,
    storefront: string = 'us',
  ): Promise<string | null> {
    const token = this.getDeveloperToken();

    const query = `${trackName} ${artistName}`;
    const response = await axios.get(
      `https://api.music.apple.com/v1/catalog/${storefront}/search`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          term: query,
          types: 'songs',
          limit: 1,
        },
      },
    );

    if (response.data.results?.songs?.data.length > 0) {
      const song = response.data.results.songs.data[0];
      return `https://music.apple.com/${storefront}/song/${song.id}`;
    }

    return null;
  }

  /**
   * Note: Creating playlists requires user authentication (MusicKit JS)
   * This would need to be implemented in the frontend with user tokens
   * For now, we return a search URL as a fallback
   */
  async createPlaylistUrl(
    tracks: Array<{name: string; artist: string}>,
    storefront: string = 'us',
  ): Promise<string> {
    // Since we can't create playlists without user authentication,
    // return a deep link that opens Apple Music with search results
    const firstTrack = tracks[0];
    if (firstTrack) {
      const searchUrl = await this.searchTrack(
        firstTrack.name,
        firstTrack.artist,
        storefront,
      );
      if (searchUrl) {
        return searchUrl;
      }
    }

    return `https://music.apple.com/${storefront}/browse`;
  }
}
