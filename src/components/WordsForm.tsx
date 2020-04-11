import React, { FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { WordsInput } from './WordsInput';
import './WordsForm.css';
import { useFormsContext } from '../context/form/formsContext.hook';
import { useCloudContext } from '../context/cloud/cloudContext.hook';

type WordsFormProps = {
  changeToTextForm: () => void;
};

export const WordsForm: React.FC<WordsFormProps> = function WordsForm({
  changeToTextForm,
}) {
  const { state, addInput, clearInputs } = useFormsContext();
  const { createCloudFromWords } = useCloudContext();
  const history = useHistory();

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
    createCloudFromWords(state.inputs);
    history.push('/ordsky');
  };

  return (
    <form onSubmit={onSubmit}>
      <section className="word-form__inputs-container">
        <section className="word-form__input-titles-container">
          <div className="word-form__row-number" />
          <h3 className="word-form__input-title">Ord</h3>
          <h3 className="word-form__input-title word-form__input-title--small">
            Antall
          </h3>
          <div className="word-form__input-title word-form__input-title--tiny" />
        </section>
        {state.inputs.map((input, index) => (
          <WordsInput number={index + 1} key={input.key} inputKey={input.key} />
        ))}
        <div className="flex-container">
          <button
            type="button"
            className="button button--outline"
            onClick={addInput}
          >
            Legg til et ord
          </button>
          <button
            type="button"
            className="button button--outline"
            onClick={() => changeToTextForm()}
          >
            ... eller lim inn en tekst
          </button>
        </div>
      </section>
      <div className="flex-container">
        <button
          type="button"
          className="button button--secondary"
          onClick={clearInputs}
        >
          Tøm liste
        </button>
        <button
          type="submit"
          className="button"
          disabled={!state.inputs[0].word && !state.inputs[0].size}
        >
          Lag ordsky
        </button>
      </div>
    </form>
  );
};
