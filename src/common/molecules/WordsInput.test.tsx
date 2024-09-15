import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { WordsInput } from './WordsInput';

describe('WordsInput component', () => {
  it('when clicking "legg til et nytt ord", then one additional input is visible', async () => {
    // Arrange
    render(<WordsInput title="124124" onSubmit={jest.fn} onQuit={jest.fn} />);

    const button = await screen.getByText(/legg til et nytt ord/i);
    const fieldsBefore =
      await screen.getAllByPlaceholderText(/skriv inn et ord/i);
    expect(fieldsBefore.length).toBe(1);

    // Act
    await userEvent.click(button);

    // Assert
    const fieldsAfter =
      await screen.getAllByPlaceholderText(/skriv inn et ord/i);

    expect(fieldsAfter.length).toBe(2);
  });

  it('when clicking "send inn ord", then calls onSubmit prop with words', async () => {
    // Arrange
    const words = ['fantastic', 'bad'];

    const mockSubmit = jest.fn();

    render(
      <WordsInput title="124124" onSubmit={mockSubmit} onQuit={jest.fn} />
    );

    const addFieldsButton = await screen.getByText(/legg til et nytt ord/i);
    const submitButton = await screen.getByText(/send inn ord/i);
    const fieldsBefore =
      await screen.getAllByPlaceholderText(/skriv inn et ord/i);

    // Act
    fireEvent.change(fieldsBefore[0], { target: { value: words[0] } });
    await userEvent.click(addFieldsButton);
    const fieldsAfter =
      await screen.getAllByPlaceholderText(/skriv inn et ord/i);
    fireEvent.change(fieldsAfter[1], { target: { value: words[1] } });
    await userEvent.click(submitButton);

    // Assert
    expect(mockSubmit).toHaveBeenCalledWith(words);
  });
});
