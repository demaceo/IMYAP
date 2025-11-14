import SpotifyWebApi from 'spotify-web-api-node';

export class SpotifyService {
  private spotifyApi: SpotifyWebApi;

  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    });
  }

  /**
   * Get authorization URL for Spotify OAuth
   */
  getAuthUrl(): string {
    const scopes = [
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-modify-private',
    ];
    return this.spotifyApi.createAuthorizeURL(scopes, 'state');
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(
    code: string,
  ): Promise<{accessToken: string; refreshToken: string; expiresIn: number}> {
    const data = await this.spotifyApi.authorizationCodeGrant(code);
    this.spotifyApi.setAccessToken(data.body.access_token);
    this.spotifyApi.setRefreshToken(data.body.refresh_token);

    return {
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
    };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    this.spotifyApi.setRefreshToken(refreshToken);
    const data = await this.spotifyApi.refreshAccessToken();
    const newAccessToken = data.body.access_token;
    this.spotifyApi.setAccessToken(newAccessToken);
    return newAccessToken;
  }

  /**
   * Set access token for API calls
   */
  setAccessToken(token: string): void {
    this.spotifyApi.setAccessToken(token);
  }

  /**
   * Parse Spotify URL and extract playlist/track ID
   */
  parseSpotifyUrl(
    url: string,
  ): {type: 'playlist' | 'track'; id: string} | null {
    const playlistMatch = url.match(/spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
    if (playlistMatch) {
      return {type: 'playlist', id: playlistMatch[1]};
    }

    const trackMatch = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    if (trackMatch) {
      return {type: 'track', id: trackMatch[1]};
    }

    return null;
  }

  /**
   * Get playlist details and tracks
   */
  async getPlaylist(playlistId: string): Promise<{
    name: string;
    description: string;
    tracks: Array<{name: string; artist: string; album: string; isrc?: string}>;
  }> {
    const playlist = await this.spotifyApi.getPlaylist(playlistId);

    const tracks = playlist.body.tracks.items.map((item: any) => ({
      name: item.track?.name || '',
      artist: item.track?.artists?.[0]?.name || '',
      album: item.track?.album?.name || '',
      isrc: item.track?.external_ids?.isrc,
    }));

    return {
      name: playlist.body.name,
      description: playlist.body.description || '',
      tracks,
    };
  }

  /**
   * Get track details
   */
  async getTrack(
    trackId: string,
  ): Promise<{name: string; artist: string; album: string; isrc?: string}> {
    const track = await this.spotifyApi.getTrack(trackId);

    return {
      name: track.body.name,
      artist: track.body.artists[0]?.name || '',
      album: track.body.album.name,
      isrc: track.body.external_ids?.isrc,
    };
  }

  /**
   * Search for a track on Spotify
   */
  async searchTrack(
    trackName: string,
    artistName: string,
  ): Promise<string | null> {
    const query = `track:${trackName} artist:${artistName}`;
    const result = await this.spotifyApi.searchTracks(query, {limit: 1});

    if (result.body.tracks?.items && result.body.tracks.items.length > 0) {
      return result.body.tracks.items[0].id;
    }

    return null;
  }

  /**
   * Create a new playlist
   */
  async createPlaylist(
    _userId: string,
    name: string,
    description: string,
    trackIds: string[],
  ): Promise<string> {
    const playlist = await this.spotifyApi.createPlaylist(name, {
      description,
      public: false,
    });

    const playlistId = playlist.body.id;

    // Add tracks in batches of 100 (Spotify API limit)
    const batchSize = 100;
    for (let i = 0; i < trackIds.length; i += batchSize) {
      const batch = trackIds.slice(i, i + batchSize);
      const uris = batch.map(id => `spotify:track:${id}`);
      await this.spotifyApi.addTracksToPlaylist(playlistId, uris);
    }

    return `https://open.spotify.com/playlist/${playlistId}`;
  }

  /**
   * Get current user's Spotify ID
   */
  async getUserId(): Promise<string> {
    const me = await this.spotifyApi.getMe();
    return me.body.id;
  }
}
