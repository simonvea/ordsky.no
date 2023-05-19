import React, { ChangeEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Label } from '../atoms/Label';
import { IconButton } from '../atoms/Button';
import { Input } from '../atoms/Input';

const WordsInputContainer = styled.section`
  margin: 5px;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
`;

const RowNumber = styled.h2`
  width: 25px;
`;

const Validation = styled.span`
  margin: 0;
  margin-left: 50px;
  height: 10px;
  width: inherit;
  padding: 0px;
  font-size: 0.8em;
  padding: 2px;
  color: red;
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
        <RowNumber>{`${number}.`}</RowNumber>
        <Label htmlFor={`${number}-word`}>
          <Input
            $warning={validationError}
            type="text"
            value={word}
            onChange={handleWordChange}
            placeholder="Skriv inn ord..."
            id={`${number}-word`}
          />
        </Label>
        <Label htmlFor={`${number}-size`}>
          <Input
            $small
            $warning={!!word && !size}
            type="number"
            value={size}
            onChange={handleSizehange}
            placeholder="Antall"
            id={`${number}-size`}
            min="0"
          />
        </Label>
        <IconButton
          type="button"
          onClick={onRemove}
          aria-label="Remove input row"
        >
          <FontAwesomeIcon
            icon={faMinusSquare}
            color="rgb(217, 83, 79)"
            size="lg"
          />
        </IconButton>
      </WordsInputContainer>
      <div>
        <Validation>{validationError && 'Kun ett ord per linje'}</Validation>
      </div>
    </>
  );
};
