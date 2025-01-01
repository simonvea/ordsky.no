/* eslint-disable unicorn/explicit-length-check */
import React, { FormEvent } from 'react';
import styled from 'styled-components';
import { Button, SecondaryButton } from '../common/atoms/Button';
import { Container } from '../common/atoms/Container';
import { WordsInput } from '../common/organisms/WordsInput';
import { WordCount } from '../common/core/cloud.types';
import { useWords } from './services/useWords';
import { NavButton } from '../common/atoms/NavButton';

type WordsFormProps = {
  onSubmit: (wordCount: WordCount) => void;
};

const Titles = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: stretch;
`;

const RowNumber = styled.div`
  width: 25px;
`;

type InputTitleProps = {
  small?: boolean;
};

const InputTitle = styled.h3<InputTitleProps>`
  font-size: 22px;
  text-align: center;
  width: 184px;
  margin: 0 15px;
  padding: 0 7px;
`;

const SmallInputTitle = styled(InputTitle)`
  width: 70px;
`;

const TinyInputTitle = styled(InputTitle)`
  width: 19px;
  padding: 0;
  margin: 0;
`;

export const WordsForm: React.FC<WordsFormProps> = function WordsForm({
  onSubmit,
}) {
  const {
    state: { inputs },
    actions: { addInput, clearInputs, updateSize, updateWord, removeInput },
  } = useWords();

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const wordCount: WordCount = inputs
      .filter((input) => input.word !== '')
      .map((input) => ({ text: input.word, count: Number(input.size) }))
      .sort((a, b) => b.count - a.count);

    onSubmit(wordCount);
  };

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <Titles>
          <RowNumber />
          <InputTitle>Ord</InputTitle>
          <SmallInputTitle>Antall</SmallInputTitle>
          <TinyInputTitle />
        </Titles>
        {inputs.map((input, index) => (
          <WordsInput
            number={index + 1}
            key={input.key}
            size={input.size}
            word={input.word}
            onWordChange={(newWord: string) => updateWord(input.key, newWord)}
            onSizeChange={(newSize) => updateSize(input.key, newSize)}
            onRemove={() => removeInput(input.key)}
          />
        ))}
        <Container>
          <Button type="button" $outline onClick={addInput}>
            Legg til et ord
          </Button>
          <NavButton to="/text" $outline>
            ... eller lim inn en tekst
          </NavButton>
        </Container>
      </section>
      <Container>
        <SecondaryButton type="button" onClick={clearInputs}>
          Tøm liste
        </SecondaryButton>
        <Button type="submit" disabled={!inputs[0].word || !inputs[0].size}>
          Lag ordsky
        </Button>
      </Container>
    </form>
  );
};
/* eslint-enable unicorn/explicit-length-check */
