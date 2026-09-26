/* eslint-disable unicorn/explicit-length-check */
import React, { FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '../common/atoms/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { WordsInput } from '../common/organisms/WordsInput';
import { WordCount } from '../common/core/cloud.types';
import { useWords } from './services/useWords';
import { NavButton } from '../common/atoms/Button';
import { Details } from '../common/atoms/Details';
import { Summary } from '../common/atoms/Summary';
import { InfoText } from '../common/atoms/InfoText';

type WordsFormProps = {
  onSubmit: (wordCount: WordCount) => void;
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 480px;
`;

const ColumnHeaders = styled.div`
  display: grid;
  grid-template-columns: var(--words-grid);
  gap: 0.5rem;
  width: 100%;
  color: var(--on-surface-variant);
  font-size: 0.875rem;
  font-weight: 500;
`;

const Rows = styled.div`
  width: 100%;
  /* Shared by the header and each row so the columns line up. */
  --words-grid: 1.75rem minmax(0, 1fr) 5.5rem 48px;
`;

const AddRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;
  margin: 0.5rem 0 2rem;
  padding-left: 2.25rem;
`;

const PasteHint = styled.p`
  margin: 1.5rem 0 0;
  color: var(--on-surface-variant);
  text-align: center;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  width: 100%;
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
      .toSorted((a, b) => b.count - a.count);

    onSubmit(wordCount);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Rows>
        <ColumnHeaders aria-hidden="true">
          <span />
          <span>Ord</span>
          <span>Antall</span>
        </ColumnHeaders>
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
      </Rows>
      <AddRow>
        <Button type="button" $variant="tonal" $small onClick={addInput}>
          <FontAwesomeIcon icon={faPlus} />
          Legg til ord
        </Button>
      </AddRow>
      <Actions>
        <Button type="button" $variant="text" onClick={clearInputs}>
          Tøm liste
        </Button>
        <Button type="submit" disabled={!inputs[0].word || !inputs[0].size}>
          Lag ordsky
        </Button>
      </Actions>
      <PasteHint>
        Har du en ferdig tekst?{' '}
        <NavButton to="/text" $variant="text" $small>
          Lim den inn i stedet
        </NavButton>
      </PasteHint>
      <Details>
        <Summary>Hvordan fungerer ordsky genereringen?</Summary>
        <InfoText>
          Når du legger til ord manuelt, kan du justere frekvensen for hvert
          ord. Størrelsen på hvert ord beregnes basert på frekvensen du angir
          relativt til de andre ordene.
        </InfoText>
        <InfoText>
          Ordskyen skapes ved å plassere det viktigste ordet midt på siden.
          Deretter plasseres de neste viktigste ordene ett etter ett. Hvis et
          ord overlapper med et annet, flyttes det forsiktig til en ledig plass.
          Denne prosessen gjentas til alle ordene er plassert uten overlapping.
        </InfoText>
      </Details>
    </Form>
  );
};
/* eslint-enable unicorn/explicit-length-check */
