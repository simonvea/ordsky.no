import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ErrorScreen } from './ErrorScreen';

describe('ErrorScreen component', () => {
  it('when error message in props, then displays error message', () => {
    // Arrange
    const message = 'An error has occured';
    const { queryByText } = render(
      <ErrorScreen message={message} onReset={jest.fn()} />
    );

    // Act
    const hasText = queryByText(message);

    // Assert
    expect(hasText).toBeTruthy();
  });

  it('when error message is not in props, then displays a generic message', () => {
    // Arrange
    const message = 'Oups, noe galt har skjedd. Beklager.';
    const { queryByText } = render(<ErrorScreen onReset={jest.fn()} />);

    // Act
    const hasText = queryByText(message);

    // Assert
    expect(hasText).toBeTruthy();
  });

  it('when clicking "Prøv igjen", then calls onReset prop', () => {
    // Arrange
    const onResetMock = jest.fn();
    const { getByText } = render(<ErrorScreen onReset={onResetMock} />);

    const button = getByText(/prøv igjen/i);
    // Act
    fireEvent.click(button);

    // Assert
    expect(onResetMock).toHaveBeenCalled();
  });
});
