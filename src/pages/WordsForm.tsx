import React, { FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { WordsInput } from '../components/WordsInput';
import './WordsForm.css';
import { useFormsContext } from '../context/form/formsContext.hook';
import { useCloudContext } from '../context/cloud/cloudContext.hook';
import { wordsInputToCloudInput } from '../utils/cloud/createCloud';

type WordsFormProps = Record<string, unknown>;

export const WordsForm: React.FC<WordsFormProps> = function WordsForm() {
  const { state, addInput, clearInputs } = useFormsContext();
  const { createCloud } = useCloudContext();
  const history = useHistory();

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const inputs = state.inputs.filter((input) => input.word !== '');
    const cloudInput = wordsInputToCloudInput(inputs);
    createCloud(cloudInput);
    history.push('/visualization/words');
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
          <Link
            type="button"
            className="button button--outline"
            to="/text-input"
          >
            ... eller lim inn en tekst
          </Link>
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
          disabled={!state.inputs[0].word || !state.inputs[0].size}
        >
          Lag ordsky
        </button>
      </div>
    </form>
  );
};
