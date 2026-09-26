import React, { ChangeEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { IconButton } from '../atoms/Button';
import { Input } from '../atoms/Input';

const WordsInputContainer = styled.div`
  display: grid;
  grid-template-columns: var(--words-grid);
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.5rem;
`;

const RowNumber = styled.span`
  color: var(--on-surface-variant);
  text-align: right;
`;

const FieldInput = styled(Input)`
  width: 100%;
  margin: 0;

  @media only screen and (min-width: 768px) {
    width: 100%;
  }
`;

const Validation = styled.span`
  display: block;
  min-height: 0.5rem;
  padding-left: 2.25rem;
  font-size: 0.875rem;
  color: var(--error-color);
`;

export type WordsInputProps = {
  number: number;
  word: string;
  size: string;
  onWordChange: (word: string) => void;
  onSizeChange: (size: string) => void;
  onRemove: () => void;
};

export const WordsInput: React.FC<WordsInputProps> = function WordsInput({
  number,
  word,
  size,
  onWordChange,
  onSizeChange,
  onRemove,
}) {
  const [validationError, setValidationError] = useState(false);

  const handleWordChange = ({
    target,
  }: ChangeEvent<HTMLInputElement>): void => {
    if (target.value.includes(' ')) {
      setValidationError(true);
      onWordChange(word);
    } else {
      if (validationError) setValidationError(false);
      onWordChange(target.value);
    }
  };

  const handleSizehange = ({ target }: ChangeEvent<HTMLInputElement>): void => {
    onSizeChange(target.value);
  };

  return (
    <>
      <WordsInputContainer>
        <RowNumber aria-hidden="true">{`${number}.`}</RowNumber>
        <FieldInput
          $warning={validationError}
          type="text"
          value={word}
          onChange={handleWordChange}
          placeholder="Skriv inn ord"
          id={`${number}-word`}
          aria-label={`Ord ${number}`}
          aria-invalid={validationError}
          aria-describedby={`${number}-error`}
        />
        <FieldInput
          $warning={!!word && !size}
          type="number"
          inputMode="numeric"
          value={size}
          onChange={handleSizehange}
          placeholder="Antall"
          id={`${number}-size`}
          aria-label={`Antall for ord ${number}`}
          min="1"
        />
        <IconButton
          type="button"
          onClick={onRemove}
          aria-label={`Fjern ord ${number}`}
        >
          <FontAwesomeIcon icon={faXmark} />
        </IconButton>
      </WordsInputContainer>
      <Validation id={`${number}-error`} role="alert">
        {validationError && 'Kun ett ord per linje'}
      </Validation>
    </>
  );
};
