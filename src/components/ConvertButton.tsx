import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator, StyleSheet} from 'react-native';

interface ConvertButtonProps {
  onPress: () => void;
  isLoading: boolean;
  disabled: boolean;
}

/**
 * Convert button component with loading state
 */
const ConvertButton: React.FC<ConvertButtonProps> = ({
  onPress,
  isLoading,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityLabel="Convert playlist"
      accessibilityHint="Converts your playlist to the other platform"
      accessibilityRole="button"
      accessibilityState={{disabled}}>
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" testID="activity-indicator" />
      ) : (
        <Text style={styles.buttonText}>Convert</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default ConvertButton;
