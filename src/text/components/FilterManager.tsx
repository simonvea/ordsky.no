import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface FilterManagerProps {
  filter: string[];
  setFilter: (filter: string[]) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: #424242;
  padding: 1rem;
  border-radius: 8px;
`;

const Description = styled.p`
  color: var(--text-color-primary);
  font-size: 0.875rem;
  text-align: left;
  margin: 0 0 1rem 0;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #333;
  color: var(--text-color-primary);
  resize: none;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: var(--primary-color);
  color: var(--text-color-primary);
  cursor: pointer;
  &:hover {
    background-color: var(--primary-color-dark);
  }
`;

const FilterList = styled.ul`
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #333;
  border-radius: 8px;
  padding: 0.5rem;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem;
  border-bottom: 1px solid #555;
`;

const ListItemText = styled.span`
  color: var(--text-color-primary);
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color-primary);
  cursor: pointer;
  &:hover {
    color: var(--primary-color-light);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #333;
  color: var(--text-color-primary);
`;

export const FilterManager: React.FC<FilterManagerProps> = ({
  filter,
  setFilter,
}) => {
  const [newWords, setNewWords] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const addWords = (): void => {
    const wordsArray = newWords.toUpperCase().split(/,/).filter(Boolean);
    setFilter([...filter, ...wordsArray]);
    setNewWords('');
  };

  const removeWord = (word: string): void => {
    setFilter(filter.filter((w) => w !== word));
  };

  const filteredWords = filter.filter((word) =>
    word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <TextArea
        value={newWords}
        onChange={(e) => setNewWords(e.target.value)}
        placeholder="Legg til ord å ignorere (separert med komma)"
        rows={2}
      />
      <Button onClick={addWords}>Legg til</Button>
      <SearchInput
        type="text"
        placeholder="Søk eksisterende filter..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FilterList>
        {filteredWords.map((word) => (
          <ListItem key={word}>
            <ListItemText>{word}</ListItemText>
            <DeleteButton onClick={() => removeWord(word)}>Fjern</DeleteButton>
          </ListItem>
        ))}
      </FilterList>
    </Container>
  );
};
