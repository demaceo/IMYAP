import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

interface URLInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

/**
 * URL Input component for entering playlist URLs
 */
const URLInput: React.FC<URLInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  disabled = false,
}) => {
  return (
    <View>
      <Text style={styles.instructionText} accessible={true}>
        Paste a playlist or song URL from Apple Music or Spotify
      </Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="https://music.apple.com/... or https://open.spotify.com/..."
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
        editable={!disabled}
        accessible={true}
        accessibilityLabel="Playlist URL input field"
        accessibilityHint="Enter the URL of an Apple Music or Spotify playlist or song"
        accessibilityRole="text"
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default URLInput;
