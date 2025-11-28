import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  Linking,
  AccessibilityInfo,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  detectPlatform,
  validateUrl,
  getTargetPlatformName,
} from './src/utils/urlValidation';
import {logError} from './src/utils/logger';
import {
  Header,
  URLInput,
  ConvertButton,
  ResultDisplay,
  Footer,
} from './src/components';

interface ConversionResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Main App component for IMYAP playlist converter
 */
const App = (): JSX.Element => {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);

  /**
   * Convert playlist from one platform to another
   */
  const convertPlaylist = useCallback(async () => {
    // Clear previous results
    setResult(null);

    // Validate input
    const trimmedUrl = inputUrl.trim();
    if (!trimmedUrl) {
      Alert.alert(
        'Missing URL',
        'Please enter a playlist or song URL from Apple Music or Spotify.',
        [{text: 'OK', style: 'default'}],
        {cancelable: true},
      );
      return;
    }

    if (!validateUrl(trimmedUrl)) {
      Alert.alert(
        'Invalid URL',
        'Please enter a valid Apple Music or Spotify URL.\n\nExample formats:\n• music.apple.com/...\n• open.spotify.com/...',
        [{text: 'OK', style: 'default'}],
        {cancelable: true},
      );
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - In production, this would call a backend service
      // that uses Apple Music API and Spotify API to convert playlists
      const sourcePlatform = detectPlatform(trimmedUrl);
      const targetPlatform = getTargetPlatformName(sourcePlatform);

      // Simulate network delay (intentionally slow to demonstrate loading state in demo)
      await new Promise(resolve => setTimeout(resolve, 500));

      // For now, return a placeholder success message with a valid URL format
      // In production, this would be the actual converted URL from the API
      // Using a valid platform URL pattern for testing purposes
      const convertedUrl =
        sourcePlatform === 'apple'
          ? `https://open.spotify.com/playlist/demo-${Date.now()}`
          : `https://music.apple.com/us/playlist/demo-${Date.now()}`;

      setResult({
        success: true,
        url: convertedUrl,
      });

      // Announce success to screen readers
      AccessibilityInfo.announceForAccessibility(
        `Conversion successful! Your ${targetPlatform} playlist link is ready.`,
      );
    } catch (error) {
      // Log the actual error for debugging
      logError('Playlist conversion error:', error);

      // Determine error type and set a more specific message
      let errorMessage = 'Failed to convert playlist. Please try again.';
      if (error && typeof error === 'object') {
        const err = error as Error;
        if (err.name === 'TimeoutError') {
          errorMessage =
            'The conversion request timed out. Please check your internet connection and try again.';
        } else if (err.message?.toLowerCase().includes('network')) {
          errorMessage =
            'Network error occurred. Please check your connection and try again.';
        } else if (err.message) {
          errorMessage = err.message;
        }
      }

      setResult({
        success: false,
        error: errorMessage,
      });

      // Announce error to screen readers
      AccessibilityInfo.announceForAccessibility(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [inputUrl]);

  /**
   * Open the converted URL in the browser or app
   */
  const openConvertedUrl = useCallback(async () => {
    if (result?.url) {
      try {
        const supported = await Linking.canOpenURL(result.url);
        if (supported) {
          await Linking.openURL(result.url);
        } else {
          Alert.alert('Error', 'Unable to open the link.');
        }
      } catch (error) {
        logError('Failed to open converted URL:', error);
        Alert.alert('Error', 'Failed to open the link.');
      }
    }
  }, [result?.url]);

  /**
   * Copy the converted URL to clipboard
   */
  const copyToClipboard = useCallback(() => {
    if (result?.url) {
      Clipboard.setString(result.url);
      Alert.alert('Success', 'Link copied to clipboard!');
      AccessibilityInfo.announceForAccessibility('Link copied to clipboard');
    }
  }, [result?.url]);

  /**
   * Reset the form to initial state
   */
  const resetForm = useCallback(() => {
    setInputUrl('');
    setResult(null);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        accessible={true}>
        <Header />

        <View style={styles.content}>
          <URLInput
            value={inputUrl}
            onChangeText={setInputUrl}
            onSubmit={convertPlaylist}
            disabled={isLoading}
          />

          <ConvertButton
            onPress={convertPlaylist}
            isLoading={isLoading}
            disabled={isLoading || !inputUrl.trim()}
          />

          {result && (
            <ResultDisplay
              result={result}
              onCopyLink={copyToClipboard}
              onOpenLink={openConvertedUrl}
              onReset={resetForm}
            />
          )}

          <Footer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
});

export default App;
