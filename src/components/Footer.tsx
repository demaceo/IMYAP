import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

/**
 * Footer component with platform support information
 */
const Footer: React.FC = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText} accessible={true}>
        Supported platforms: Apple Music ↔ Spotify
      </Text>
      <Text style={styles.footerNote} accessible={true}>
        Note: This is a demo version. API integration required for full
        functionality.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Footer;
