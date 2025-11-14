# IMYAP - I Made You A Playlist

A cross-platform mobile application (iOS & Android) that converts playlists and songs between Apple Music and Spotify.

## Features

- ✨ Convert playlists from Apple Music to Spotify
- ✨ Convert playlists from Spotify to Apple Music
- ✨ Convert individual songs between platforms
- ♿ Accessible UI following WCAG guidelines
- 🎨 Clean, modern, and polished interface
- 📱 Native iOS and Android support

## Screenshots

[Screenshots will be added here]

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **React Native CLI**: `npm install -g react-native-cli`

### For iOS Development:
- **macOS** (required for iOS development)
- **Xcode** (latest version from the App Store)
- **CocoaPods**: `sudo gem install cocoapods`

### For Android Development:
- **Android Studio** (latest version)
- **Android SDK** (API level 23 or higher)
- **Java Development Kit (JDK)** 11 or higher

## Installation

1. Clone the repository:
```bash
git clone https://github.com/demaceo/IMYAP.git
cd IMYAP
```

2. Install dependencies:
```bash
npm install
```

3. For iOS, install CocoaPods dependencies:
```bash
cd ios
pod install
cd ..
```

## Running the App

### iOS
```bash
npm run ios
# or
react-native run-ios
```

To run on a specific device:
```bash
react-native run-ios --device "iPhone 14 Pro"
```

### Android
Make sure you have an Android emulator running or a device connected, then:
```bash
npm run android
# or
react-native run-android
```

## Development

### Start Metro Bundler
```bash
npm start
```

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

## Usage

1. **Open the app** on your iOS or Android device
2. **Paste a URL** from Apple Music or Spotify into the input field
   - Apple Music: `https://music.apple.com/...`
   - Spotify: `https://open.spotify.com/...`
3. **Tap "Convert"** to convert the playlist
4. **Receive your converted link** ready to use on the other platform
5. **Copy or open** the link directly from the app

## Accessibility Features

- Full VoiceOver/TalkBack support
- High contrast colors for readability
- Touch target sizes meet WCAG AA standards (44x44pt minimum)
- Semantic labels for all interactive elements
- Screen reader announcements for state changes
- Keyboard navigation support

## API Integration

**Note:** This is a demo version with placeholder conversion logic. For full functionality, you'll need to:

1. Set up authentication with the Apple Music API
2. Set up authentication with the Spotify Web API
3. Implement a backend service to handle the conversion logic
4. Update the `convertPlaylist` function in `App.tsx` to call your backend API

### Required APIs:
- [Apple Music API](https://developer.apple.com/documentation/applemusicapi/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)

## Project Structure

```
IMYAP/
├── App.tsx                 # Main application component
├── index.js               # Entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── babel.config.js        # Babel configuration
├── metro.config.js        # Metro bundler configuration
├── android/               # Android native code
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/
│   ├── build.gradle
│   └── settings.gradle
└── ios/                   # iOS native code
    ├── Podfile
    └── IMYAP/
        ├── AppDelegate.h
        ├── AppDelegate.mm
        ├── Info.plist
        └── main.m
```

## Technology Stack

- **React Native** 0.73.0 - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **React Navigation** - Navigation library (ready to integrate)
- **React Native Gesture Handler** - Touch gesture handling

## Troubleshooting

### iOS Build Issues
- Clean build folder: Product → Clean Build Folder in Xcode
- Reinstall pods: `cd ios && pod deintegrate && pod install`
- Reset Metro cache: `npm start -- --reset-cache`

### Android Build Issues
- Clean Gradle: `cd android && ./gradlew clean`
- Reset cache: `npm start -- --reset-cache`
- Check Android SDK path in `local.properties`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues and questions, please open an issue on the GitHub repository.

---

**Made with ❤️ for music lovers everywhere**
