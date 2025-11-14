# IMYAP Backend

Backend API for the IMYAP playlist converter.

## Prerequisites

- Node.js 18+
- npm or yarn
- Spotify Developer Account
- Apple Developer Account

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**
Copy `.env.example` to `.env` and fill in your API credentials:

```bash
cp .env.example .env
```

Required environment variables:

- `SPOTIFY_CLIENT_ID` - From Spotify Developer Dashboard
- `SPOTIFY_CLIENT_SECRET` - From Spotify Developer Dashboard
- `SPOTIFY_REDIRECT_URI` - Your callback URL (e.g., <http://localhost:3001/auth/spotify/callback>)
- `APPLE_TEAM_ID` - From Apple Developer Account
- `APPLE_KEY_ID` - From Apple Music API Key
- `APPLE_PRIVATE_KEY_PATH` - Path to your .p8 key file
- `SESSION_SECRET` - Random string for session encryption

3. **Set up Apple Music credentials:**
   - Go to <https://developer.apple.com/account>
   - Create a MusicKit key
   - Download the `.p8` file
   - Place it in `backend/keys/` directory
   - Update `APPLE_PRIVATE_KEY_PATH` in `.env`

4. **Set up Spotify credentials:**
   - Go to <https://developer.spotify.com/dashboard>
   - Create a new app
   - Add redirect URI: `http://localhost:3001/auth/spotify/callback`
   - Copy Client ID and Client Secret to `.env`

5. **Initialize database:**

```bash
npm run prisma:generate
npm run prisma:migrate
```

## Running

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

```
GET /health
```

### Convert Playlist

```
POST /api/convert
Content-Type: application/json

{
  "url": "https://open.spotify.com/playlist/..."
}
```

### Spotify Authentication

```
GET /auth/spotify/login
GET /auth/spotify/callback
GET /auth/spotify/status
POST /auth/spotify/logout
```

## Architecture

```
backend/
├── src/
│   ├── server.ts              # Express app entry point
│   ├── routes/
│   │   ├── authRoutes.ts      # Spotify OAuth routes
│   │   └── convertRoutes.ts   # Conversion endpoint
│   ├── services/
│   │   ├── spotifyService.ts      # Spotify API integration
│   │   ├── appleMusicService.ts   # Apple Music API integration
│   │   └── conversionService.ts   # Conversion logic
│   └── types/
│       └── session.d.ts       # TypeScript session types
├── prisma/
│   └── schema.prisma          # Database schema
└── package.json
```

## Testing

You can test the API using curl or Postman:

```bash
# Health check
curl http://localhost:3001/health

# Convert playlist
curl -X POST http://localhost:3001/api/convert \
  -H "Content-Type: application/json" \
  -d '{"url": "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"}'
```

## Troubleshooting

### "Apple Music credentials not configured"

- Ensure you've downloaded the .p8 key file
- Check that `APPLE_PRIVATE_KEY_PATH` points to the correct file
- Verify `APPLE_TEAM_ID` and `APPLE_KEY_ID` are correct

### "Spotify authentication failed"

- Verify your Spotify Client ID and Secret
- Check that redirect URI matches exactly in Spotify Dashboard
- Make sure user has granted necessary permissions

### Database errors

- Run `npm run prisma:generate` to regenerate Prisma client
- Run `npm run prisma:migrate` to apply migrations

## License

ISC
