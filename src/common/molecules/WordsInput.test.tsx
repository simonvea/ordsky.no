import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { WordsInput } from './WordsInput';

describe('WordsInput component', () => {
  it('when clicking "legg til et nytt ord", then one additional input is visible', () => {
    // Arrange
    const { getByText, getAllByPlaceholderText } = render(
      <WordsInput title="124124" onSubmit={jest.fn} onQuit={jest.fn} />
    );

    const button = getByText(/legg til et nytt ord/i);
    const fieldsBefore = getAllByPlaceholderText(/skriv inn et ord/i);
    expect(fieldsBefore.length).toBe(1);

    // Act
    fireEvent.click(button);

    // Assert
    const fieldsAfter = getAllByPlaceholderText(/skriv inn et ord/i);

    expect(fieldsAfter.length).toBe(2);
  });

  it('when clicking "send inn ord", then calls onSubmit prop with words', () => {
    // Arrange
    const words = ['fantastic', 'bad'];

    const mockSubmit = jest.fn();

    const { getByText, getAllByPlaceholderText } = render(
      <WordsInput title="124124" onSubmit={mockSubmit} onQuit={jest.fn} />
    );

    const addFieldsButton = getByText(/legg til et nytt ord/i);
    const submitButton = getByText(/send inn ord/i);
    const fieldsBefore = getAllByPlaceholderText(/skriv inn et ord/i);

    // Act
    fireEvent.change(fieldsBefore[0], { target: { value: words[0] } });
    fireEvent.click(addFieldsButton);
    const fieldsAfter = getAllByPlaceholderText(/skriv inn et ord/i);
    fireEvent.change(fieldsAfter[1], { target: { value: words[1] } });
    fireEvent.click(submitButton);

    // Assert
    expect(mockSubmit).toHaveBeenCalledWith(words);
  });
});
