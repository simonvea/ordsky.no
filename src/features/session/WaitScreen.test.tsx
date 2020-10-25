import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { WaitScreen } from './WaitScreen';

const mockHistoryPush = jest.fn();
const onQuitMock = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('WaitPage component', () => {
  beforeEach(() => {
    mockHistoryPush.mockClear();
    onQuitMock.mockClear();
  });
  it('when no words input displays "Venter på ord"', () => {
    // Arrange
    const { getByText } = render(
      <WaitScreen
        numberOfEntries={0}
        onCreateWordCloud={() => {}}
        onQuit={onQuitMock}
      />
    );

    // Act
    const text = getByText(/venter på ord/i);

    // Assert
    expect(text).toBeInTheDocument();
  });

  it('when numberOfEntries is 1, displays "1 har lagt inn ord."', () => {
    // Arrange
    const { getByText } = render(
      <WaitScreen
        numberOfEntries={1}
        onCreateWordCloud={() => {}}
        onQuit={onQuitMock}
      />
    );

    // Act
    const text = getByText(/1 har lagt inn ord./i);

    // Assert
    expect(text).toBeInTheDocument();
  });

  it('when isAdmin is false, "lag ordsky" button is not rendered', () => {
    // Arrange
    const { queryByText } = render(
      <WaitScreen
        numberOfEntries={10}
        onCreateWordCloud={() => {}}
        onQuit={onQuitMock}
      />
    );

    // Act
    const text = queryByText(/lag ordsky/i);

    // Assert
    expect(text).not.toBeInTheDocument();
  });

  it('when clicking avslutt, then gets sendt back to /session', () => {
    // Arrange
    mockHistoryPush.mockClear();
    const { getByText } = render(
      <WaitScreen
        numberOfEntries={10}
        isAdmin
        onCreateWordCloud={() => {}}
        onQuit={onQuitMock}
      />
    );

    const text = getByText(/avslutt/i);

    // Act
    fireEvent.click(text);

    // Assert
    expect(mockHistoryPush).toHaveBeenCalledWith('/session');
  });

  it('when clicking avslutt, then calls onQuit prop', () => {
    const { getByText } = render(
      <WaitScreen
        numberOfEntries={10}
        isAdmin
        onCreateWordCloud={() => {}}
        onQuit={onQuitMock}
      />
    );

    const text = getByText(/avslutt/i);

    // Act
    fireEvent.click(text);

    // Assert
    expect(onQuitMock).toHaveBeenCalled();
  });

  describe('given isAdmin', () => {
    it('when numberOfEntries is 0, then "lag ordsky" button is disabled', () => {
      // Arrange
      const { getByText } = render(
        <WaitScreen
          numberOfEntries={0}
          isAdmin
          onCreateWordCloud={() => {}}
          onQuit={onQuitMock}
        />
      );

      // Act
      const text = getByText(/lag ordsky/i);

      // Assert
      expect(text).toBeDisabled();
    });

    it('when clicking "Lag ordsky", calls onCreateWordCloud prop', () => {
      // Arrange
      const onCreateMock = jest.fn();
      const { getByText } = render(
        <WaitScreen
          numberOfEntries={10}
          isAdmin
          onCreateWordCloud={onCreateMock}
          onQuit={onQuitMock}
        />
      );

      const text = getByText(/lag ordsky/i);

      // Act
      fireEvent.click(text);

      // Assert
      expect(onCreateMock).toHaveBeenCalled();
    });
  });
});
