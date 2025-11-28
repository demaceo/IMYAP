import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import ResultDisplay from '../../src/components/ResultDisplay';

describe('ResultDisplay Component', () => {
  const mockOnCopyLink = jest.fn();
  const mockOnOpenLink = jest.fn();
  const mockOnReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success State', () => {
    const successResult = {
      success: true,
      url: 'https://open.spotify.com/playlist/test',
    };

    it('renders success state correctly', () => {
      render(
        <ResultDisplay
          result={successResult}
          onCopyLink={mockOnCopyLink}
          onOpenLink={mockOnOpenLink}
          onReset={mockOnReset}
        />,
      );

      expect(screen.getByText('✓ Conversion Successful!')).toBeTruthy();
      expect(screen.getByText("Your playlist has been converted. Here's your new link:")).toBeTruthy();
      expect(screen.getByText(successResult.url)).toBeTruthy();
    });

    it('shows action buttons in success state', () => {
      render(
        <ResultDisplay
          result={successResult}
          onCopyLink={mockOnCopyLink}
          onOpenLink={mockOnOpenLink}
          onReset={mockOnReset}
        />,
      );

      expect(screen.getByText('Copy Link')).toBeTruthy();
      expect(screen.getByText('Open Link')).toBeTruthy();
      expect(screen.getByText('Convert Another Playlist')).toBeTruthy();
    });

    it('calls onCopyLink when Copy Link is pressed', () => {
      render(
        <ResultDisplay
          result={successResult}
          onCopyLink={mockOnCopyLink}
          onOpenLink={mockOnOpenLink}
          onReset={mockOnReset}
        />,
      );

      const copyButton = screen.getByText('Copy Link');
      fireEvent.press(copyButton);

      expect(mockOnCopyLink).toHaveBeenCalled();
    });

    it('calls onOpenLink when Open Link is pressed', () => {
      render(
        <ResultDisplay
          result={successResult}
          onCopyLink={mockOnCopyLink}
          onOpenLink={mockOnOpenLink}
          onReset={mockOnReset}
        />,
      );

      const openButton = screen.getByText('Open Link');
      fireEvent.press(openButton);

      expect(mockOnOpenLink).toHaveBeenCalled();
    });

    it('calls onReset when Convert Another Playlist is pressed', () => {
      render(
        <ResultDisplay
          result={successResult}
          onCopyLink={mockOnCopyLink}
          onOpenLink={mockOnOpenLink}
          onReset={mockOnReset}
        />,
      );

      const resetButton = screen.getByText('Convert Another Playlist');
      fireEvent.press(resetButton);

      expect(mockOnReset).toHaveBeenCalled();
    });
  });

  describe('Error State', () => {
    const errorResult = {
      success: false,
      error: 'Network error occurred',
    };

    it('renders error state correctly', () => {
      render(
        <ResultDisplay
          result={errorResult}
          onCopyLink={mockOnCopyLink}
          onOpenLink={mockOnOpenLink}
          onReset={mockOnReset}
        />,
      );

      expect(screen.getByText('✗ Conversion Failed')).toBeTruthy();
      expect(screen.getByText(errorResult.error!)).toBeTruthy();
      expect(screen.getByText('Try Again')).toBeTruthy();
    });

    it('does not show action buttons in error state', () => {
      render(
        <ResultDisplay
          result={errorResult}
          onCopyLink={mockOnCopyLink}
          onOpenLink={mockOnOpenLink}
          onReset={mockOnReset}
        />,
      );

      expect(screen.queryByText('Copy Link')).toBeNull();
      expect(screen.queryByText('Open Link')).toBeNull();
      expect(screen.queryByText('Convert Another Playlist')).toBeNull();
    });

    it('calls onReset when Try Again is pressed', () => {
      render(
        <ResultDisplay
          result={errorResult}
          onCopyLink={mockOnCopyLink}
          onOpenLink={mockOnOpenLink}
          onReset={mockOnReset}
        />,
      );

      const tryAgainButton = screen.getByText('Try Again');
      fireEvent.press(tryAgainButton);

      expect(mockOnReset).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility roles for success state', () => {
      const successResult = {
        success: true,
        url: 'https://open.spotify.com/playlist/test',
      };

      render(
        <ResultDisplay
          result={successResult}
          onCopyLink={mockOnCopyLink}
          onOpenLink={mockOnOpenLink}
          onReset={mockOnReset}
        />,
      );

      const copyButton = screen.getByLabelText('Copy link');
      const openButton = screen.getByLabelText('Open link');

      expect(copyButton).toBeTruthy();
      expect(openButton).toBeTruthy();
    });

    it('has correct accessibility role for error state', () => {
      const errorResult = {
        success: false,
        error: 'Test error',
      };

      render(
        <ResultDisplay
          result={errorResult}
          onCopyLink={mockOnCopyLink}
          onOpenLink={mockOnOpenLink}
          onReset={mockOnReset}
        />,
      );

      const tryAgainButton = screen.getByLabelText('Try again');
      expect(tryAgainButton).toBeTruthy();
    });
  });
});
