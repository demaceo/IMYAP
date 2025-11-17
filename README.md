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

### For iOS Development

- **macOS** (required for iOS development)
- **Xcode** (latest version from the App Store)
- **CocoaPods**: `sudo gem install cocoapods`

### For Android Development

- **Android Studio** (latest version)
- **Android SDK** (API level 23 or higher)
- **Java Development Kit (JDK)** 11 or higher

## Installation

### Frontend Setup

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

### Backend Setup

4. Install backend dependencies:

```bash
cd backend
npm install
```

5. Configure environment variables:

```bash
cp .env.example .env
# Edit .env with your API credentials
```

6. Set up Spotify API:
   - Go to <https://developer.spotify.com/dashboard>
   - Create a new app
   - Add redirect URI: `http://127.0.0.1:3001/auth/spotify/callback`
   - Copy Client ID and Client Secret to backend/.env

7. Set up Apple Music API:
   - Go to <https://developer.apple.com/account>
   - Create a MusicKit key
   - Download the `.p8` file to `backend/keys/`
   - Update APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_PRIVATE_KEY_PATH in backend/.env

8. Initialize the database:

```bash
npm run prisma:generate
npm run prisma:migrate
cd ..
```

## Running the App

### Start the Backend Server

First, start the backend server (required for playlist conversion):

```bash
cd backend
npm run dev
# Server will start on http://localhost:3001
```

Keep this terminal running and open a new terminal for the mobile app.

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

The app now includes a fully functional backend that handles playlist conversion:

### Backend Features

- ✅ Spotify OAuth authentication
- ✅ Apple Music API integration with developer token generation
- ✅ Playlist parsing and track matching
- ✅ Cross-platform conversion (Spotify ↔ Apple Music)
- ✅ RESTful API endpoint (`POST /convert`)

### Setup Requirements

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) credentials
- [Apple Music API](https://developer.apple.com/documentation/applemusicapi/) credentials
- Backend server running on <http://localhost:3001>

### Current Limitations

- Apple Music playlist creation requires user authentication (not yet implemented)
- Track matching uses basic name/artist search (ISRC matching coming soon)
- Single-track conversions and partial playlist results are supported

## Project Structure

```
IMYAP/
├── App.tsx                 # Main application component
├── index.js               # Entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── babel.config.js        # Babel configuration
├── metro.config.js        # Metro bundler configuration
├── src/
│   └── utils/
│       └── urlValidation.ts  # URL validation utilities
├── backend/               # Backend API server
│   ├── src/
│   │   ├── server.ts      # Express server entry point
│   │   ├── routes/
│   │   │   ├── authRoutes.ts      # Spotify OAuth routes
│   │   │   └── convertRoutes.ts   # Conversion endpoint
│   │   ├── services/
│   │   │   ├── spotifyService.ts      # Spotify API client
│   │   │   ├── appleMusicService.ts   # Apple Music API client
│   │   │   └── conversionService.ts   # Conversion logic
│   │   └── types/
│   │       └── session.d.ts       # TypeScript session types
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── package.json       # Backend dependencies
│   └── tsconfig.json      # Backend TypeScript config
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

### Frontend

- **React Native** 0.73.0 - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **React Navigation** - Navigation library
- **React Native Gesture Handler** - Touch gesture handling

### Backend

- **Node.js** 18+ - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe backend development
- **Prisma** - Database ORM
- **Spotify Web API Node** - Spotify API client
- **Axios** - HTTP client for Apple Music API
- **jsonwebtoken** - JWT generation for Apple Music

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
