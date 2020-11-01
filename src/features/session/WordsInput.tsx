import React from 'react';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from '../../components/atoms/Input';
// import { Label } from '../../components/atoms/Label';
import { Form } from '../../components/atoms/Form';
import { Row } from '../../components/atoms/Row';

import {
  Button,
  SecondaryButton,
  IconButton,
} from '../../components/atoms/Button';
import { formsReducer, initialState } from './wordsInputReducer';

type WordsInputProps = {
  onSubmit: (words: string[]) => void;
};

export const WordsInput: React.FC<WordsInputProps> = ({ onSubmit }) => {
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
      word,
    };

    dispatch({
      type: 'WORDS_UPDATE_INPUT',
      input,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const words = inputs.map((input) => input.word);
    onSubmit(words);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {inputs.map(({ key, word }) => (
        <Row key={key}>
          <Input
            value={word}
            onChange={({ target }) => onWordChange(key, target.value)}
            placeholder="Skriv inn et ord..."
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
        <Button type="submit">Send inn ord</Button>
      </Row>
    </Form>
  );
};
