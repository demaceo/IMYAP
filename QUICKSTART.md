# Quick Start Guide

Get IMYAP running on your machine in 5 minutes!

## Prerequisites

Make sure you have:

- Node.js 18+ installed
- npm or yarn
- For iOS: macOS with Xcode and CocoaPods
- For Android: Android Studio with SDK

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/demaceo/IMYAP.git
cd IMYAP

# 2. Install frontend dependencies
npm install

# 3. (iOS only) Install iOS pods
cd ios && pod install && cd ..

# 4. Install backend dependencies
cd backend
npm install

# 5. Set up environment variables
cp .env.example .env
# Edit backend/.env with your Spotify and Apple Music API credentials

# 6. Initialize the database
npm run prisma:generate
npm run prisma:migrate
cd ..
```

## API Setup

### Spotify API (Required)

1. Go to <https://developer.spotify.com/dashboard>
2. Create a new app
3. Add redirect URI: `http://localhost:3001/auth/spotify/callback`
4. Copy Client ID and Client Secret to `backend/.env`

### Apple Music API (Required)

1. Go to <https://developer.apple.com/account>
2. Create a MusicKit key
3. Download the `.p8` file to `backend/keys/`
4. Update APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY_PATH in `backend/.env`

## Running the App

### Step 1: Start the Backend Server

```bash
cd backend
npm run dev
# Backend will run on http://localhost:3001
```

Keep this terminal running.

### Step 2: Start the Mobile App

Open a new terminal and run:

#### iOS (macOS required)

```bash
npm run ios
```

#### Android

```bash
# Make sure you have an emulator running or device connected
npm run android
```

## Development

### Start Metro Bundler

```bash
npm start
```

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

## Using the App

1. **Launch the app** on your device/emulator
2. **Copy a playlist URL** from Apple Music or Spotify
   - Apple Music example: `https://music.apple.com/us/playlist/...`
   - Spotify example: `https://open.spotify.com/playlist/...`
3. **Paste the URL** into the input field
4. **Tap "Convert"** and wait for the result
5. **Copy or open** the converted link

## Troubleshooting

### Backend Issues

```bash
# Connection refused / Backend not responding
# Make sure backend is running on port 3001
cd backend
npm run dev

# Check backend health
curl http://localhost:3001/health

# Database issues
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### iOS Build Issues

```bash
# Clean build
cd ios
rm -rf build Pods Podfile.lock
pod install
cd ..
```

### Android Build Issues

```bash
# Clean Gradle
cd android
./gradlew clean
cd ..
```

### Metro Issues

```bash
# Reset Metro cache
npm start -- --reset-cache
```

### Node Modules Issues

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [backend/README.md](backend/README.md) for backend API docs
- See [DESIGN.md](DESIGN.md) for UI/UX details
- Review [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Check [SUMMARY.md](SUMMARY.md) for project overview

## Need Help?

- Check the [README](README.md) troubleshooting section
- Review [React Native docs](https://reactnative.dev/docs/getting-started)
- Open an issue on GitHub

---

Happy coding! 🎵
