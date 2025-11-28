import React from 'react';
import {render, screen} from '@testing-library/react-native';
import Header from '../../src/components/Header';

describe('Header Component', () => {
  it('renders correctly', () => {
    render(<Header />);

    expect(screen.getByText('IMYAP')).toBeTruthy();
    expect(screen.getByText('i made you a playlist')).toBeTruthy();
  });

  it('has correct accessibility labels', () => {
    render(<Header />);

    const logo = screen.getByLabelText('IMYAP - I Made You A Playlist');
    expect(logo).toBeTruthy();

    const tagline = screen.getByLabelText('Convert playlists between Apple Music and Spotify');
    expect(tagline).toBeTruthy();
  });
});
