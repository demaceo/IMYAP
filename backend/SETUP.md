# Backend Setup Instructions

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Spotify API (Get from https://developer.spotify.com/dashboard)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3001/auth/spotify/callback

# Apple Music API (Get from https://developer.apple.com/account)
APPLE_TEAM_ID=your_team_id
APPLE_KEY_ID=your_key_id
APPLE_PRIVATE_KEY_PATH=./keys/AuthKey_XXXXXXXXXX.p8

# Session Secret (Generate a random string)
SESSION_SECRET=generate_random_string_here
```

### 3. Get Spotify Credentials

1. Go to <https://developer.spotify.com/dashboard>
2. Click "Create app"
3. Fill in:
   - App name: IMYAP Backend
   - App description: Playlist converter backend
   - Redirect URI: `http://localhost:3001/auth/spotify/callback`
4. Copy Client ID and Client Secret to `.env`

### 4. Get Apple Music Credentials

1. Go to <https://developer.apple.com/account>
2. Navigate to Certificates, Identifiers & Profiles
3. Click Keys → Create a new key
4. Select "MusicKit" checkbox
5. Download the `.p8` file
6. Create `backend/keys/` directory
7. Move the `.p8` file to `backend/keys/`
8. Update `.env` with:
   - APPLE_TEAM_ID (10-character team ID)
   - APPLE_KEY_ID (10-character key ID from filename)
   - APPLE_PRIVATE_KEY_PATH (path to .p8 file)

### 5. Initialize Database

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 6. Start the Server

```bash
npm run dev
```

Server will start at <http://localhost:3001>

## Testing the Backend

### Health Check

```bash
curl http://localhost:3001/health
```

### Test Conversion (without auth)

```bash
curl -X POST http://localhost:3001/api/convert \
  -H "Content-Type: application/json" \
  -d '{"url": "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"}'
```

### Spotify OAuth Flow

1. Visit: <http://localhost:3001/auth/spotify/login>
2. Authorize the app
3. You'll be redirected to the frontend with a session

## Production Deployment

### Environment Variables

Update these for production:

- Change `NODE_ENV=production`
- Use PostgreSQL or MySQL instead of SQLite
- Set `SESSION_SECRET` to a strong random value
- Use HTTPS URLs for redirect URIs
- Set `FRONTEND_URL` to your production domain

### Database Migration

```bash
# For production database
DATABASE_URL="postgresql://user:password@host:5432/dbname" npm run prisma:migrate
```

### Build and Run

```bash
npm run build
npm start
```

## Troubleshooting

### "Cannot find module 'express'"

```bash
npm install
```

### "Apple Music credentials not configured"

- Verify `.p8` file exists in `keys/` directory
- Check file path in `.env`
- Ensure APPLE_TEAM_ID and APPLE_KEY_ID are correct

### "Spotify authentication failed"

- Verify Client ID and Secret in `.env`
- Check redirect URI matches exactly in Spotify Dashboard
- Make sure you're using the callback URL with `/auth/spotify/callback`

### Database errors

```bash
npm run prisma:generate
npm run prisma:migrate
```

### Port already in use

Change PORT in `.env`:

```env
PORT=3002
```

## API Documentation

### POST /api/convert

Convert a playlist URL

**Request:**

```json
{
  "url": "https://open.spotify.com/playlist/..."
}
```

**Response (Success):**

```json
{
  "success": true,
  "url": "https://music.apple.com/..."
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Error message",
  "errorCode": "ERROR_CODE"
}
```

**Error Codes:**

- `AUTH_REQUIRED` - Spotify authentication needed
- `AUTH_EXPIRED` - Session expired
- `INVALID_URL` - Invalid URL format
- `NO_MATCH` - No matching tracks found
- `NO_TRACKS` - No tracks in source playlist

### GET /auth/spotify/login

Initiate Spotify OAuth flow

### GET /auth/spotify/callback

OAuth callback endpoint (handled automatically)

### GET /auth/spotify/status

Check authentication status

**Response:**

```json
{
  "authenticated": true,
  "needsRefresh": false
}
```

### POST /auth/spotify/logout

Clear session

---

For more details, see [backend/README.md](./README.md)
