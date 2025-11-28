import React from 'react';
import {render, screen} from '@testing-library/react-native';
import Footer from '../../src/components/Footer';

describe('Footer Component', () => {
  it('renders correctly', () => {
    render(<Footer />);

    expect(screen.getByText('Supported platforms: Apple Music ↔ Spotify')).toBeTruthy();
    expect(screen.getByText('Note: This is a demo version. API integration required for full functionality.')).toBeTruthy();
  });

  it('displays platform support information', () => {
    render(<Footer />);

    const supportText = screen.getByText(/Apple Music.*Spotify/);
    expect(supportText).toBeTruthy();
  });

  it('displays demo note', () => {
    render(<Footer />);

    const noteText = screen.getByText(/demo version/i);
    expect(noteText).toBeTruthy();
  });
});
