import React, { ChangeEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { useFormsContext } from '../context/form/formsContext.hook';

export type WordsInputProps = {
  number: number;
  inputKey: string;
};

export const WordsInput: React.FC<WordsInputProps> = function WordsInput({
  number,
  inputKey,
}) {
  const { state, updateSize, updateWord, removeInput } = useFormsContext();
  const [validationError, setValidationError] = useState(false);

  const { word, size } = state.inputs.find(
    (input) => input.key === inputKey
  ) || { word: '', size: '' };

  const handleWordChange = ({
    target,
  }: ChangeEvent<HTMLInputElement>): void => {
    if (target.value.includes(' ')) {
      setValidationError(true);
      updateWord(inputKey, word);
    } else {
      if (validationError) setValidationError(false);
      updateWord(inputKey, target.value);
    }
  };

  const handleSizehange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    updateSize(inputKey, target.value);
  };

  return (
    <>
      <div className="word-form__inputs">
        <h2 className="word-form__row-number">{`${number}.`}</h2>
        <label htmlFor={`${inputKey}-word`}>
          <input
            className={`word-form__input ${
              validationError && 'word-form__input--warning'
            }`}
            type="text"
            value={word}
            onChange={handleWordChange}
            placeholder="Skriv inn ord..."
            id={`${inputKey}-word`}
          />
        </label>
        <label htmlFor={`${inputKey}-size`}>
          <input
            className={`word-form__input word-form__input--small ${
              word && !size && 'word-form__input--warning'
            }`}
            type="number"
            value={size}
            onChange={handleSizehange}
            placeholder="Antall"
            id={`${inputKey}-size`}
          />
        </label>
        <button
          type="button"
          onClick={() => removeInput(inputKey)}
          disabled={state.inputs.length < 2}
          className="button button--icon"
          aria-label="Remove input row"
        >
          <FontAwesomeIcon
            icon={faMinusSquare}
            color="rgb(217, 83, 79)"
            size="lg"
          />
        </button>
      </div>
      <div>
        <span className="word-form__validation">
          {validationError && 'Kun ett ord per linje'}
        </span>
      </div>
    </>
  );
};
