import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

/**
 * Header component displaying the app logo and tagline
 */
const Header: React.FC = () => {
  return (
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
  );
};

const styles = StyleSheet.create({
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
});

export default Header;
