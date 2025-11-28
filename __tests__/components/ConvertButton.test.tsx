import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import ConvertButton from '../../src/components/ConvertButton';

describe('ConvertButton Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when not loading', () => {
    render(
      <ConvertButton
        onPress={mockOnPress}
        isLoading={false}
        disabled={false}
      />,
    );

    expect(screen.getByText('Convert')).toBeTruthy();
  });

  it('shows loading indicator when loading', () => {
    render(
      <ConvertButton
        onPress={mockOnPress}
        isLoading={true}
        disabled={true}
      />,
    );

    expect(screen.queryByText('Convert')).toBeNull();
    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    render(
      <ConvertButton
        onPress={mockOnPress}
        isLoading={false}
        disabled={false}
      />,
    );

    const button = screen.getByText('Convert');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalled();
  });

  it('does not call onPress when disabled', () => {
    render(
      <ConvertButton
        onPress={mockOnPress}
        isLoading={false}
        disabled={true}
      />,
    );

    const button = screen.getByLabelText('Convert playlist');
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('has correct accessibility properties', () => {
    render(
      <ConvertButton
        onPress={mockOnPress}
        isLoading={false}
        disabled={false}
      />,
    );

    const button = screen.getByLabelText('Convert playlist');
    expect(button).toBeTruthy();
    expect(button.props.accessibilityHint).toBe('Converts your playlist to the other platform');
  });
});
