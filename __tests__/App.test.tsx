/**
 * @format
 */

import 'react-native';
import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react-native';
import App from '../App';

// Mock modules
jest.mock('@react-native-clipboard/clipboard', () => ({
  default: {
    setString: jest.fn(),
    getString: jest.fn(),
  },
}));

jest.mock('../src/utils/logger', () => ({
  logError: jest.fn(),
  logWarning: jest.fn(),
  logInfo: jest.fn(),
  logDebug: jest.fn(),
}));

// Mock AccessibilityInfo
jest.mock('react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo', () => ({
  announceForAccessibility: jest.fn(),
}));

describe('App Component', () => {
  it('renders correctly', () => {
    render(<App />);

    expect(screen.getByText('IMYAP')).toBeTruthy();
    expect(screen.getByText('i made you a playlist')).toBeTruthy();
    expect(screen.getByPlaceholderText(/https:\/\/music.apple.com/)).toBeTruthy();
    expect(screen.getByText('Convert')).toBeTruthy();
  });

  it('displays header with correct text', () => {
    render(<App />);

    const header = screen.getByLabelText('IMYAP - I Made You A Playlist');
    expect(header).toBeTruthy();
  });

  it('has URL input field', () => {
    render(<App />);

    const input = screen.getByLabelText('Playlist URL input field');
    expect(input).toBeTruthy();
  });

  it('has convert button that is initially disabled', () => {
    render(<App />);

    const button = screen.getByLabelText('Convert playlist');
    expect(button).toBeTruthy();
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('enables convert button when URL is entered', () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/https:\/\/music.apple.com/);
    fireEvent.changeText(input, 'https://music.apple.com/us/playlist/test/123');

    const button = screen.getByLabelText('Convert playlist');
    expect(button.props.accessibilityState.disabled).toBe(false);
  });

  it('shows loading state when converting', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/https:\/\/music.apple.com/);
    fireEvent.changeText(input, 'https://music.apple.com/us/playlist/test/123');

    const button = screen.getByText('Convert');
    fireEvent.press(button);

    await waitFor(() => {
      expect(screen.getByTestId('activity-indicator')).toBeTruthy();
    });
  });

  it('displays footer information', () => {
    render(<App />);

    const footerTexts = screen.getAllByText(/Apple Music.*Spotify/);
    expect(footerTexts.length).toBeGreaterThan(0);
    expect(screen.getByText(/demo version/i)).toBeTruthy();
  });
});
