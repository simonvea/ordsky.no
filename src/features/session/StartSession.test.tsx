import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { StartSession } from './StartSession';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mockId = 'asfgr';

jest.mock('./helpers', () => ({
  generateId: () => mockId,
}));

const onNewSession = jest.fn();

describe('StartSession component', () => {
  beforeEach(() => {
    onNewSession.mockClear();
    mockHistoryPush.mockClear();
  });
  it('when clicking start new session, then onNewSession prop gets called', () => {
    // Arrange
    const { getByTestId } = render(
      <StartSession onNewSession={onNewSession} />
    );

    const button = getByTestId('start-session-btn');

    // Act
    fireEvent.click(button);

    // Assert
    expect(onNewSession).toHaveBeenCalled();
  });

  it('when clicking start new session, then history gets pushed to /session/mockId', () => {
    // Arrange
    const { getByTestId } = render(
      <StartSession onNewSession={onNewSession} />
    );

    const button = getByTestId('start-session-btn');

    // Act
    fireEvent.click(button);

    // Assert
    expect(mockHistoryPush).toHaveBeenCalledWith(`/session/${mockId}`);
  });

  it('when no input Id, button is disabled', () => {
    // Arrange
    const { getByTestId } = render(
      <StartSession onNewSession={onNewSession} />
    );

    const button = getByTestId('join-session-btn');

    // Assert
    expect(button).toBeDisabled();
  });

  describe('given input with length equal to 5', () => {
    it('when clicking join session, then history get pushed to /session/inputId', () => {
      // Arrange
      const { getByTestId, getByLabelText } = render(
        <StartSession onNewSession={onNewSession} />
      );

      const button = getByTestId('join-session-btn');
      const input = getByLabelText(/skriv inn en id:/i);

      // Act
      fireEvent.change(input, { target: { value: mockId } });
      fireEvent.click(button);

      // Assert
      expect(mockHistoryPush).toHaveBeenCalledWith(`/session/${mockId}`);
    });
  });
});
