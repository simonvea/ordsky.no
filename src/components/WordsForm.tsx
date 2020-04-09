import React, { useState, FormEvent, ChangeEvent } from 'react';
import { WordsInput } from './WordsInput';
import './WordsForm.css';

type Input = { key: string; word: string; size: string };

export const WordsForm: React.FC = function WordsForm() {
  const [inputs, setInputs] = useState<Array<Input>>([
    { key: 'input-0', word: '', size: '' },
  ]);

  const addInput = (): void => {
    const key = `input-${inputs.length}`;
    const newInput: Input = { key, word: '', size: '' };
    setInputs([...inputs, newInput]);
  };

  const handleWordChange = (key: string): ((word: string) => void) => {
    const updateWord = (word: string): void => {
      const updatedInputs = inputs;
      const index = inputs.findIndex((input) => input.key === key);
      updatedInputs[index] = { ...updatedInputs[index], word };
      setInputs(updatedInputs);
    };

    return updateWord;
  };

  const handleSizeChange = (key: string): ((size: string) => void) => {
    const updateSize = (size: string): void => {
      const updatedInputs = inputs;
      const index = inputs.findIndex((input) => input.key === key);
      updatedInputs[index] = { ...updatedInputs[index], size };
      setInputs(updatedInputs);
    };

    return updateSize;
  };

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
    console.log(inputs);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        {inputs.map((input) => (
          <WordsInput
            key={input.key}
            onChangeWord={handleWordChange(input.key)}
            onChangeSize={handleSizeChange(input.key)}
          />
        ))}
        <button
          type="button"
          className="button button--outline"
          onClick={addInput}
        >
          Legg til ord
        </button>
        <button type="submit" className="button">
          Lag ordsky
        </button>
      </form>
    </>
  );
};
