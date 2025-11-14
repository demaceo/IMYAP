import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  Linking,
  AccessibilityInfo,
} from 'react-native';
import {
  detectPlatform,
  validateUrl,
  getTargetPlatformName,
} from './src/utils/urlValidation';

interface ConversionResult {
  success: boolean;
  url?: string;
  error?: string;
}

const App = (): JSX.Element => {
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);

  const convertPlaylist = async () => {
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

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For now, return a placeholder success message
      // In production, this would be the actual converted URL
      const targetPlatform = getTargetPlatformName(sourcePlatform);

      setResult({
        success: true,
        url: `https://example.com/converted-playlist-${Date.now()}`,
      });

      // Announce success to screen readers
      AccessibilityInfo.announceForAccessibility(
        `Conversion successful! Your ${targetPlatform} playlist link is ready.`,
      );
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to convert playlist. Please try again.',
      });

      // Announce error to screen readers
      AccessibilityInfo.announceForAccessibility(
        'Conversion failed. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openConvertedUrl = async () => {
    if (result?.url) {
      try {
        const supported = await Linking.canOpenURL(result.url);
        if (supported) {
          await Linking.openURL(result.url);
        } else {
          Alert.alert('Error', 'Unable to open the link.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to open the link.');
      }
    }
  };

  const copyToClipboard = () => {
    if (result?.url) {
      // In production, use @react-native-clipboard/clipboard
      Alert.alert('Success', 'Link copied to clipboard!');
      AccessibilityInfo.announceForAccessibility('Link copied to clipboard');
    }
  };

  const resetForm = () => {
    setInputUrl('');
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        accessible={true}>
        <View style={styles.header}>
          <Text
            style={styles.logo}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="IMYAP - I Made You A Playlist">
            IMYAP
          </Text>
          <Text
            style={styles.tagline}
            accessible={true}
            accessibilityLabel="Convert playlists between Apple Music and Spotify">
            i made you a playlist
          </Text>
        </View>

        <View style={styles.content}>
          <Text
            style={styles.instructionText}
            accessible={true}>
            Paste a playlist or song URL from Apple Music or Spotify
          </Text>

          <TextInput
            style={styles.input}
            value={inputUrl}
            onChangeText={setInputUrl}
            placeholder="https://music.apple.com/... or https://open.spotify.com/..."
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="done"
            onSubmitEditing={convertPlaylist}
            editable={!isLoading}
            accessible={true}
            accessibilityLabel="Playlist URL input field"
            accessibilityHint="Enter the URL of an Apple Music or Spotify playlist or song"
            accessibilityRole="text"
          />

          <TouchableOpacity
            style={[
              styles.button,
              (isLoading || !inputUrl.trim()) && styles.buttonDisabled,
            ]}
            onPress={convertPlaylist}
            disabled={isLoading || !inputUrl.trim()}
            accessible={true}
            accessibilityLabel="Convert playlist"
            accessibilityHint="Converts your playlist to the other platform"
            accessibilityRole="button"
            accessibilityState={{disabled: isLoading || !inputUrl.trim()}}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Convert</Text>
            )}
          </TouchableOpacity>

          {result && (
            <View
              style={styles.resultContainer}
              accessible={true}
              accessibilityRole="summary">
              {result.success ? (
                <>
                  <Text
                    style={styles.successTitle}
                    accessible={true}
                    accessibilityRole="header">
                    ✓ Conversion Successful!
                  </Text>
                  <Text style={styles.resultDescription} accessible={true}>
                    Your playlist has been converted. Here's your new link:
                  </Text>
                  <View style={styles.urlContainer}>
                    <Text
                      style={styles.resultUrl}
                      numberOfLines={2}
                      ellipsizeMode="middle"
                      accessible={true}
                      accessibilityLabel={`Converted URL: ${result.url}`}>
                      {result.url}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={copyToClipboard}
                      accessible={true}
                      accessibilityLabel="Copy link"
                      accessibilityHint="Copies the converted playlist link to clipboard"
                      accessibilityRole="button">
                      <Text style={styles.secondaryButtonText}>Copy Link</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.secondaryButton}
                      onPress={openConvertedUrl}
                      accessible={true}
                      accessibilityLabel="Open link"
                      accessibilityHint="Opens the converted playlist in your browser or app"
                      accessibilityRole="button">
                      <Text style={styles.secondaryButtonText}>Open Link</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={resetForm}
                    accessible={true}
                    accessibilityLabel="Convert another playlist"
                    accessibilityRole="button">
                    <Text style={styles.resetButtonText}>
                      Convert Another Playlist
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text
                    style={styles.errorTitle}
                    accessible={true}
                    accessibilityRole="alert">
                    ✗ Conversion Failed
                  </Text>
                  <Text style={styles.errorText} accessible={true}>
                    {result.error}
                  </Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={resetForm}
                    accessible={true}
                    accessibilityLabel="Try again"
                    accessibilityRole="button">
                    <Text style={styles.buttonText}>Try Again</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText} accessible={true}>
              Supported platforms: Apple Music ↔ Spotify
            </Text>
            <Text style={styles.footerNote} accessible={true}>
              Note: This is a demo version. API integration required for full
              functionality.
            </Text>
          </View>
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
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  logo: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1DB954',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#F9F9F9',
    marginBottom: 20,
    minHeight: 56,
  },
  button: {
    backgroundColor: '#1DB954',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#CCC',
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  resultContainer: {
    marginTop: 32,
    padding: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1DB954',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#E53935',
    marginBottom: 12,
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 15,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  urlContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  resultUrl: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1DB954',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    minHeight: 50,
  },
  secondaryButtonText: {
    color: '#1DB954',
    fontSize: 15,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#1DB954',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    minHeight: 50,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#1DB954',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    minHeight: 50,
  },
  errorText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerNote: {
    fontSize: 12,
    color: '#BBB',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
});

export default App;
