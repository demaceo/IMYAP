import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface ConversionResult {
  success: boolean;
  url?: string;
  error?: string;
}

interface ResultDisplayProps {
  result: ConversionResult;
  onCopyLink: () => void;
  onOpenLink: () => void;
  onReset: () => void;
}

/**
 * Result display component showing success or error state
 */
const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  onCopyLink,
  onOpenLink,
  onReset,
}) => {
  return (
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
              onPress={onCopyLink}
              accessible={true}
              accessibilityLabel="Copy link"
              accessibilityHint="Copies the converted playlist link to clipboard"
              accessibilityRole="button">
              <Text style={styles.secondaryButtonText}>Copy Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onOpenLink}
              accessible={true}
              accessibilityLabel="Open link"
              accessibilityHint="Opens the converted playlist in your browser or app"
              accessibilityRole="button">
              <Text style={styles.secondaryButtonText}>Open Link</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={onReset}
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
            onPress={onReset}
            accessible={true}
            accessibilityLabel="Try again"
            accessibilityRole="button">
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    columnGap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1DB954',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    minHeight: 56,
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
    minHeight: 56,
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
    minHeight: 56,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ResultDisplay;
