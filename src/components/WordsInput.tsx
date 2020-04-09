import React, { ChangeEvent, useState } from 'react';

export type WordsInputProps = {
  onChangeWord: (word: string) => void;
  onChangeSize: (size: string) => void;
};

export const WordsInput: React.FC<WordsInputProps> = function WordsInput({
  onChangeWord,
  onChangeSize,
}) {
  const [word, setWord] = useState('');
  const [size, setSize] = useState('');

  const handleWordChange = ({
    target,
  }: ChangeEvent<HTMLInputElement>): void => {
    setWord(target.value);
    onChangeWord(target.value);
  };

  const handleSizehange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    setSize(target.value);
    onChangeSize(target.value);
  };

  return (
    <div className="word-form__inputs">
      <input type="text" value={word} onChange={handleWordChange} />
      <input type="text" value={size} onChange={handleSizehange} />
    </div>
  );
};
