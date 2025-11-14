# IMYAP - AI Coding Agent Instructions

## Architecture Overview

**IMYAP** is a React Native mobile app (iOS/Android) with a Node.js/Express backend that converts playlists between Spotify and Apple Music. The architecture is deliberately split: frontend handles UI/UX and calls backend API at `http://localhost:3001` for all conversion logic.

### Key Components

- **Frontend**: React Native 0.73 + TypeScript, single-screen app (`App.tsx`)
- **Backend**: Express + TypeScript service layer with Spotify OAuth and Apple Music JWT auth
- **Data Flow**: Mobile app → HTTP POST `/api/convert` → Service orchestration → External APIs → Response

### Service Layer Pattern

The backend uses a **3-tier service architecture** (`backend/src/services/`):

1. `spotifyService.ts` - Spotify Web API wrapper (OAuth, playlists, tracks, search)
2. `appleMusicService.ts` - Apple Music API client (JWT token generation, catalog access)
3. `conversionService.ts` - Orchestrates cross-platform conversion, handles platform detection

**Important**: Services use dependency injection pattern. `ConversionService` instantiates both `SpotifyService` and `AppleMusicService` in constructor - maintain this pattern when adding services.

## Code Style & Conventions

### Formatting (Critical)

- **2-space indentation** for ALL files (enforced by Prettier)
- No spaces in imports: `import {Router}` not `import { Router }`
- No spaces in object literals: `{url, accessToken}` not `{ url, accessToken }`
- Single quotes for strings
- Run formatter: `npx prettier --write .` before commits

### TypeScript Patterns

- Interfaces for request/response types (see `ConversionRequest`, `ConversionResult`)
- Explicit return types on all async functions
- Type guards for platform detection (`Platform = 'apple' | 'spotify' | 'unknown'`)
- Session type augmentation in `backend/src/types/session.d.ts` for Express sessions

### Error Handling Convention

Backend services return structured error codes:

```typescript
{success: false, error: string, errorCode: 'AUTH_REQUIRED' | 'NO_MATCH' | 'INVALID_URL' | ...}
```

Frontend maps error codes to user-friendly Alert dialogs. Always include `errorCode` in error responses.

## Development Workflows

### Dual-Process Development

**Always run both processes concurrently**:

```bash
# Terminal 1: Backend (REQUIRED for conversions)
cd backend && npm run dev  # http://localhost:3001

# Terminal 2: React Native (iOS or Android)
npm run ios  # or npm run android
```

### Backend Development Commands

```bash
cd backend
npm run dev           # ts-node-dev with hot reload
npm run prisma:studio # Database GUI at http://localhost:5555
npm run prisma:generate  # After schema.prisma changes
```

### Mobile Development

```bash
npm start -- --reset-cache  # Clear Metro cache
npm run ios -- --device "iPhone 14 Pro"  # Specific device
cd ios && pod install && cd ..  # After dependency changes
```

## Critical Integration Points

### Spotify Authentication Flow

OAuth 2.0 Authorization Code flow with session-based token storage:

1. User triggers: `GET /auth/spotify/login` → redirects to Spotify
2. Spotify redirects to: `GET /auth/spotify/callback?code=...`
3. Backend exchanges code for tokens, stores in `express-session`
4. Conversion endpoint reads from `req.session.spotifyAccessToken`

**Session Fields**: `spotifyAccessToken`, `spotifyRefreshToken`, `spotifyExpiry` (defined in `session.d.ts`)

### Apple Music Authentication

JWT-based developer tokens (no user auth):

- Private key (`.p8` file) stored in `backend/keys/`
- Token generated via `jsonwebtoken` with ES256 algorithm
- Cached for 180 days in `AppleMusicService` instance
- Set env vars: `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY_PATH`

### URL Validation Pattern

```typescript
// frontend/src/utils/urlValidation.ts
detectPlatform(url) → 'apple' | 'spotify' | 'unknown'
validateUrl(url) → boolean (HTTPS only)
```

Backend performs same validation in `ConversionService.convert()` - maintain consistency.

## Known Limitations & Workarounds

### Apple Music Playlist Creation

**Current**: Cannot create Apple Music playlists (requires user MusicKit token)
**Workaround**: `AppleMusicService.createPlaylistUrl()` returns search URL for first track
**Future**: Implement MusicKit JS in React Native WebView

### Track Matching Strategy

**Current**: Basic name/artist string search via `/search` endpoints
**Issue**: ~70% match rate due to naming variations
**Better approach**: Use ISRC (International Standard Recording Code) when available - both services expose `isrc` in track metadata. Priority improvement.

### Spotify API Without OAuth

Spotify search/get endpoints work without user auth BUT playlist creation requires OAuth. If user hasn't authenticated via `/auth/spotify/login`, backend returns `errorCode: 'AUTH_REQUIRED'`.

## Environment Setup Critical Path

### Backend `.env` Requirements

```bash
# Spotify (required for Spotify → Apple Music)
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REDIRECT_URI=http://localhost:3001/auth/spotify/callback

# Apple Music (required for conversions to Apple Music)
APPLE_TEAM_ID=...         # From Apple Developer Account
APPLE_KEY_ID=...          # From MusicKit Key
APPLE_PRIVATE_KEY_PATH=./keys/AuthKey_XXX.p8

# Session (required)
SESSION_SECRET=...        # Random 32+ char string

# Database
DATABASE_URL=file:./dev.db  # SQLite for local dev
```

### Obtaining Apple Music Credentials

1. <https://developer.apple.com/account/resources/authkeys/list>
2. Create "MusicKit Key" (not "Sign in with Apple")
3. Download `.p8` file to `backend/keys/`
4. Key ID is in filename: `AuthKey_KEYID.p8`
5. Team ID: Top-right of Apple Developer dashboard

## Testing & Validation

### Manual Testing Flow

```bash
# 1. Start backend
cd backend && npm run dev

# 2. Test health check
curl http://localhost:3001/health

# 3. Test conversion (no auth needed for Spotify → Apple Music)
curl -X POST http://localhost:3001/api/convert \
  -H "Content-Type: application/json" \
  -d '{"url":"https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"}'

# 4. Expected response:
{"success":true,"url":"https://music.apple.com/us/song/..."}
```

### Frontend Testing

- Unit tests: `npm test` (Jest + React Test Renderer)
- URL validation tests: `__tests__/urlValidation.test.ts`
- No E2E tests yet - manual testing via iOS Simulator/Android Emulator

## File Organization Logic

### Backend Service Responsibilities

- `spotifyService.ts`: All Spotify Web API calls (9 methods: auth, parse, get, search, create)
- `appleMusicService.ts`: All Apple Music API calls (7 methods: JWT, parse, get, search)
- `conversionService.ts`: Platform detection, orchestration, error handling - NO direct API calls

### Route-to-Service Mapping

- `authRoutes.ts` (`/auth/spotify/*`) → `SpotifyService` only
- `convertRoutes.ts` (`/api/convert`) → `ConversionService` only
- Routes are thin layers: validate input → call service → return response

### Frontend Structure

- `App.tsx`: All UI (540 lines, intentionally monolithic for simplicity)
- `src/utils/urlValidation.ts`: Shared validation logic
- Keep frontend simple - avoid premature navigation/state management libraries

## Common Pitfalls

1. **Indentation errors**: Auto-formatter reverts 4-space to 2-space. Run `npx prettier --write backend/src` frequently.

2. **Missing `npm install`**: "Cannot find module" errors resolve with `cd backend && npm install` + `npm run prisma:generate`.

3. **Hardcoded localhost**: Mobile app uses `http://localhost:3001` - won't work on physical devices. For device testing, replace with computer's IP (e.g., `http://192.168.1.100:3001`).

4. **Spotify redirect URI mismatch**: Must exactly match in Spotify Dashboard and `.env`. Include protocol (`http://`) and port (`:3001`).

5. **Apple Music 401 errors**: JWT expires after 180 days. Check `AppleMusicService.tokenExpiry` and regenerate if expired.

## Quick Reference Commands

```bash
# Fresh setup
npm install && cd backend && npm install && npm run prisma:generate && cd ..

# Reset everything
rm -rf node_modules backend/node_modules backend/dev.db && npm install && cd backend && npm install && cd ..

# Format all code
npx prettier --write .

# Check backend errors
cd backend && npx tsc --noEmit

# View database
cd backend && npm run prisma:studio
```

## Product Roadmap & Priorities

### Phase 1: User Authentication (High Priority)

Implement user accounts to enable conversion history and cross-device sync:

1. **Backend**: Activate Prisma models (`User`, `Conversion`) currently in schema
2. **Auth System**: Add JWT-based authentication or extend Spotify OAuth to user management
3. **Database**: Uncomment Prisma usage in `authRoutes.ts`, store user sessions
4. **API Endpoints**:
   - `POST /auth/register` - Create account
   - `POST /auth/login` - Login with credentials
   - `GET /api/conversions` - User's conversion history
5. **Frontend**: Add login/signup screens, persist auth tokens in secure storage

### Phase 2: Platform Expansion (High Priority)

Add support for additional music streaming platforms:

**Priority Order**: YouTube Music → Tidal → Deezer → Amazon Music

**Implementation Pattern** (using YouTube Music as example):

1. Create `backend/src/services/youtubeMusicService.ts` following existing service patterns
2. Add platform detection in `ConversionService.convert()` (line ~30)
3. Add conversion methods: `convertFromYouTubeMusic()` and reverse
4. Update `urlValidation.ts` with new URL patterns:
   ```typescript
   youtubeMusic: /^https:\/\/(music\.youtube\.com)\/.*/i;
   ```
5. Update TypeScript types: `Platform = 'apple' | 'spotify' | 'youtube' | ...`
6. Test cross-platform conversions (e.g., Spotify → YouTube Music, Apple → YouTube Music)

### Phase 3: Production Deployment (High Priority)

Prepare for App Store & Google Play distribution:

**iOS App Store**:

- Configure signing certificates & provisioning profiles in Xcode
- Update `Info.plist` with privacy descriptions (NSMicrophoneUsageDescription, etc.)
- Create App Store Connect listing with screenshots
- Replace localhost URLs with production API endpoint
- Enable production environment variables in `.env`

**Google Play Store**:

- Generate signed APK/AAB with keystore
- Configure `android/app/build.gradle` for release builds
- Create Play Console listing
- Enable production API endpoint in release builds
- Test on various Android devices (API levels 23+)

**Production Backend**:

- Deploy to cloud platform (AWS, Google Cloud, or Heroku)
- Set up SSL/TLS certificates for HTTPS
- Configure production environment variables
- Switch from SQLite to PostgreSQL for scalability
- Set up monitoring & error tracking (Sentry, LogRocket)
- Update CORS origins to allow mobile apps

### Track Matching Improvements (Lower Priority)

Enhance conversion accuracy using ISRC codes:

- Both Spotify and Apple Music expose `isrc` in track metadata
- Modify search logic to prioritize ISRC matching over name/artist
- Fallback to string search when ISRC unavailable
- Expected improvement: 70% → 95% match rate

## When Extending the System

### Adding a New Music Platform Service

Follow the established 3-tier pattern:

1. **Service Layer**: Create `backend/src/services/newPlatformService.ts`
   - Authentication method (OAuth, JWT, API key)
   - `parseUrl()` - Extract playlist/track IDs from URLs
   - `getPlaylist()` / `getTrack()` - Fetch metadata
   - `searchTrack()` - Find tracks by name/artist/ISRC
   - `createPlaylist()` - Create new playlists with tracks

2. **Conversion Logic**: Update `conversionService.ts`
   - Add platform detection in `convert()` method
   - Implement `convertFromNewPlatform()` and `convertToNewPlatform()` methods
   - Handle platform-specific error codes

3. **Frontend Integration**: Update `urlValidation.ts`
   - Add URL regex pattern for new platform
   - Update `Platform` type definition
   - Add to `getTargetPlatformName()` mapping

4. **Testing**: Ensure cross-compatibility with all existing platforms
