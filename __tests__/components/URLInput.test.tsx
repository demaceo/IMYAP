import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import URLInput from '../../src/components/URLInput';

describe('URLInput Component', () => {
  const mockOnChangeText = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <URLInput
        value=""
        onChangeText={mockOnChangeText}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(screen.getByText('Paste a playlist or song URL from Apple Music or Spotify')).toBeTruthy();
    expect(screen.getByPlaceholderText('https://music.apple.com/... or https://open.spotify.com/...')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    render(
      <URLInput
        value=""
        onChangeText={mockOnChangeText}
        onSubmit={mockOnSubmit}
      />,
    );

    const input = screen.getByPlaceholderText('https://music.apple.com/... or https://open.spotify.com/...');
    fireEvent.changeText(input, 'https://music.apple.com/test');

    expect(mockOnChangeText).toHaveBeenCalledWith('https://music.apple.com/test');
  });

  it('calls onSubmit when submit is pressed', () => {
    render(
      <URLInput
        value="https://music.apple.com/test"
        onChangeText={mockOnChangeText}
        onSubmit={mockOnSubmit}
      />,
    );

    const input = screen.getByPlaceholderText('https://music.apple.com/... or https://open.spotify.com/...');
    fireEvent(input, 'submitEditing');

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    render(
      <URLInput
        value=""
        onChangeText={mockOnChangeText}
        onSubmit={mockOnSubmit}
        disabled={true}
      />,
    );

    const input = screen.getByPlaceholderText('https://music.apple.com/... or https://open.spotify.com/...');
    expect(input.props.editable).toBe(false);
  });

  it('has correct accessibility properties', () => {
    render(
      <URLInput
        value=""
        onChangeText={mockOnChangeText}
        onSubmit={mockOnSubmit}
      />,
    );

    const input = screen.getByLabelText('Playlist URL input field');
    expect(input).toBeTruthy();
    expect(input.props.accessibilityHint).toBe('Enter the URL of an Apple Music or Spotify playlist or song');
  });
});
