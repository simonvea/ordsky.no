import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../common/atoms/Button';
import { Input } from '../../common/atoms/Input';

interface FilterManagerProps {
  filter: string[];
  setFilter: (filter: string[]) => void;
}

const Description = styled.p`
  color: var(--on-surface-variant);
  margin: 0 0 1rem;
`;

const AddForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const WordInput = styled(Input)`
  flex: 1;
  width: auto;
  margin: 0;

  @media only screen and (min-width: 768px) {
    width: auto;
  }
`;

const ChipList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 40vh;
  overflow-y: auto;
`;

// Material 3 input chip: a label with a trailing remove button.
const Chip = styled.li`
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding-left: 12px;
  border: 1px solid var(--outline);
  border-radius: 8px;
  font-size: 0.875rem;
`;

const ChipRemove = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: none;
  color: var(--on-surface-variant);
  cursor: pointer;

  &:hover {
    color: var(--text-color-primary);
    background-color: rgba(255, 255, 255, 0.08);
  }

  &:focus-visible {
    outline: var(--button-focus-outline);
  }
`;

const Empty = styled.p`
  color: var(--on-surface-variant);
  font-style: italic;
`;

export const FilterManager: React.FC<FilterManagerProps> = ({
  filter,
  setFilter,
}) => {
  const [newWords, setNewWords] = useState('');

  const addWords = (event: FormEvent): void => {
    event.preventDefault();
    const wordsArray = newWords
      .toUpperCase()
      .split(/[,\s]+/)
      .filter((word) => word && !filter.includes(word));
    setFilter([...filter, ...new Set(wordsArray)]);
    setNewWords('');
  };

  const removeWord = (word: string): void => {
    setFilter(filter.filter((w) => w !== word));
  };

  return (
    <>
      <Description>
        Disse ordene tas ikke med i ordskyen. Vanlige småord som «og» og «det»
        er lagt inn fra før.
      </Description>
      <AddForm onSubmit={addWords}>
        <WordInput
          value={newWords}
          onChange={(e) => setNewWords(e.target.value)}
          placeholder="Ord, skilt med komma"
          aria-label="Ord som skal ignoreres"
        />
        <Button type="submit" $variant="tonal" disabled={!newWords.trim()}>
          Legg til
        </Button>
      </AddForm>
      {filter.length === 0 ? (
        <Empty>Ingen ord blir ignorert.</Empty>
      ) : (
        <ChipList aria-label="Ignorerte ord">
          {filter.map((word) => (
            <Chip key={word}>
              {word.toLowerCase()}
              <ChipRemove
                type="button"
                aria-label={`Fjern ${word.toLowerCase()}`}
                onClick={() => removeWord(word)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </ChipRemove>
            </Chip>
          ))}
        </ChipList>
      )}
    </>
  );
};
