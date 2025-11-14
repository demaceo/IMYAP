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

# 2. Install dependencies
npm install

# 3. (iOS only) Install iOS pods
cd ios && pod install && cd ..
```

## Running the App

### iOS (macOS required)
```bash
npm run ios
```

### Android
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
- Check [DESIGN.md](DESIGN.md) for UI/UX details
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Review [SUMMARY.md](SUMMARY.md) for project overview

## Need Help?

- Check the [README](README.md) troubleshooting section
- Review [React Native docs](https://reactnative.dev/docs/getting-started)
- Open an issue on GitHub

## API Integration (For Production)

To enable actual conversion:

1. Get Apple Music API credentials from [Apple Developer](https://developer.apple.com/documentation/applemusicapi/)
2. Get Spotify API credentials from [Spotify for Developers](https://developer.spotify.com/)
3. Set up a backend service to handle conversion
4. Update `App.tsx` → `convertPlaylist()` function

---

Happy coding! 🎵
