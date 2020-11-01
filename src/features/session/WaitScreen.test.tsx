import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { WaitScreen } from './WaitScreen';

const onQuitMock = jest.fn();

const mockId = '4s6fe';

describe('WaitPage component', () => {
  beforeEach(() => {
    onQuitMock.mockClear();
  });

  it('displays the id from url as uppercase', () => {
    // Arrange
    const { getByText } = render(
      <WaitScreen
        id={mockId}
        numberOfEntries={0}
        onCreateWordCloud={() => {}}
        onQuit={onQuitMock}
      />
    );

    // Act
    const text = getByText(`Kode: ${mockId.toUpperCase()}`);

    // Assert
    expect(text).toBeInTheDocument();
  });

  it('when no words input displays "Venter på ord"', () => {
    // Arrange
    const { getByText } = render(
      <WaitScreen
        id={mockId}
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
        id={mockId}
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
        id={mockId}
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

  it('when clicking avslutt, then calls onQuit prop', () => {
    const { getByText } = render(
      <WaitScreen
        id={mockId}
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

  it('when loading prop is true, displays a "Lager ordsky..." message', () => {
    // Arrange
    const { queryByText } = render(
      <WaitScreen
        id={mockId}
        numberOfEntries={0}
        isAdmin
        onCreateWordCloud={() => {}}
        onQuit={onQuitMock}
        loading
      />
    );

    // Act
    const text = queryByText(/lager ordsky/i);

    // Assert
    expect(text).toBeTruthy();
  });

  describe('given isAdmin', () => {
    it('when numberOfEntries is 0, then "lag ordsky" button is disabled', () => {
      // Arrange
      const { getByText } = render(
        <WaitScreen
          id={mockId}
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
          id={mockId}
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

    it('when loading prop is true, then "lag ordsky" button is disabled', () => {
      // Arrange
      const { getByText } = render(
        <WaitScreen
          id={mockId}
          numberOfEntries={5}
          isAdmin
          onCreateWordCloud={() => {}}
          onQuit={onQuitMock}
          loading
        />
      );

      // Act
      const text = getByText(/lag ordsky/i);

      // Assert
      expect(text).toBeDisabled();
    });
  });
});
