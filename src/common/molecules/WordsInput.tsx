import React from 'react';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from '../atoms/Input';
import { Title } from '../atoms/Title';
import { Button, IconButton } from '../atoms/Button';
import { formsReducer, initialState } from './wordsInputReducer';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 420px;
`;

const Hint = styled.p`
  color: var(--on-surface-variant);
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const WordField = styled(Input)`
  flex: 1;
  width: auto;
  margin: 0;

  @media only screen and (min-width: 768px) {
    width: auto;
  }
`;

const AddRow = styled.div`
  margin: 0.25rem 0 1.5rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

type WordsInputProps = {
  title?: string;
  onSubmit: (words: string[]) => void;
  onQuit: () => void;
};

function WordsInput({
  title,
  onSubmit,
  onQuit,
}: WordsInputProps): React.ReactElement {
  const [state, dispatch] = React.useReducer(formsReducer, initialState);

  const { inputs } = state;

  const addWordWorm = (): void => {
    dispatch({ type: 'WORDS_ADD_INPUT' });
  };

  const removeWordForm = (key: string): void => {
    dispatch({ type: 'WORDS_REMOVE_INPUT', key });
  };

  const onWordChange = (key: string, word: string): void => {
    const input = {
      key,
      word: word.trim(),
    };

    dispatch({
      type: 'WORDS_UPDATE_INPUT',
      input,
    });
  };

  const disableSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
  };

  const handleSubmit = (): void => {
    const words = inputs.map((input) => input.word).filter((word) => !!word);
    onSubmit(words);
  };

  const addInputOnEnterKey = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === 'Enter') {
      addWordWorm();
    }
  };

  return (
    <Container>
      {title && <Title>{title}</Title>}
      <Hint>Ett ord per felt. Trykk Enter for å legge til et nytt felt.</Hint>

      <Form onSubmit={disableSubmit}>
        {inputs.map(({ key, word }, index) => (
          <Row key={key}>
            <WordField
              value={word}
              onChange={({ target }) => onWordChange(key, target.value)}
              onKeyDown={addInputOnEnterKey}
              placeholder="Skriv inn et ord"
              aria-label={`Ord ${index + 1}`}
              ref={(input) => (input && input.focus()) || undefined} // This ends up focusing the last input, which is what we want :D
            />
            <IconButton
              type="button"
              onClick={() => removeWordForm(key)}
              disabled={inputs.length < 2}
              aria-label={`Fjern ord ${index + 1}`}
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </Row>
        ))}
        <AddRow>
          <Button type="button" $variant="tonal" $small onClick={addWordWorm}>
            <FontAwesomeIcon icon={faPlus} />
            Legg til et nytt ord
          </Button>
        </AddRow>
        <Actions>
          <Button type="button" $variant="text" onClick={onQuit}>
            Avslutt
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Send inn ord
          </Button>
        </Actions>
      </Form>
    </Container>
  );
}

WordsInput.defaultProps = {
  title: '',
};

export { WordsInput };
