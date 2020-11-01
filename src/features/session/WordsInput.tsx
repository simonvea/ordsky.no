import React from 'react';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from '../../components/atoms/Input';
import { Form } from '../../components/atoms/Form';
import { Row } from '../../components/atoms/Row';
import { Title } from '../../components/atoms/Title';
import {
  Button,
  SecondaryButton,
  IconButton,
} from '../../components/atoms/Button';
import { formsReducer, initialState } from './wordsInputReducer';

type WordsInputProps = {
  id: string;
  onSubmit: (words: string[]) => void;
};

export const WordsInput: React.FC<WordsInputProps> = ({ id, onSubmit }) => {
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
    const words = inputs.map((input) => input.word);
    onSubmit(words);
  };

  const addInputOnEnterKey = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === 'Enter') {
      addWordWorm();
    }
  };

  return (
    <>
      <Title>Kode: {id.toUpperCase()}</Title>

      <Form onSubmit={disableSubmit}>
        {inputs.map(({ key, word }) => (
          <Row key={key}>
            <Input
              value={word}
              onChange={({ target }) => onWordChange(key, target.value)}
              onKeyDown={addInputOnEnterKey}
              placeholder="Skriv inn et ord..."
              ref={(input) => input && input.focus()} // This ends up focusing the last input, which is what we want :D
            />
            <IconButton
              type="button"
              onClick={() => removeWordForm(key)}
              disabled={inputs.length < 2}
              aria-label="Remove input row"
            >
              <FontAwesomeIcon
                icon={faMinusSquare}
                color="rgb(217, 83, 79)"
                size="lg"
              />
            </IconButton>
          </Row>
        ))}
        <Row>
          <SecondaryButton type="button" onClick={addWordWorm}>
            Legg til et nytt ord
          </SecondaryButton>
          <Button type="button" onClick={handleSubmit}>
            Send inn ord
          </Button>
        </Row>
      </Form>
    </>
  );
};
