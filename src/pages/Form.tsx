import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useWordsContext } from '../context/wordsContext.hook';
import { useNotification } from '../hooks';

export const TextForm: React.FC = function TextForm() {
  const [text, setText] = useState('');
  const [notification, notify] = useNotification(
    'Du må legge inn tekst før du kan generere en ordsky.',
    10
  );
  const history = useHistory();
  const { state, onSubmit } = useWordsContext();
  const { loading } = state;

  const onChange = ({ target }: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(target.value);
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    if (!text) {
      notify();
      return;
    }
    onSubmit(text);
  };
  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <textarea
          name="text"
          className="form__textarea"
          rows={5}
          placeholder="Lim inn tekst her"
          value={text}
          onChange={onChange}
        />
        <div className="notification">{notification || null}</div>
        <div className="flex-container">
          <button
            type="button"
            className="button button--outline"
            onClick={() => setText('')}
          >
            Tøm
          </button>
          <button
            type="submit"
            id="submit"
            className="button"
            disabled={!text || loading}
          >
            Generer ordsky
          </button>
          <button
            type="button"
            className="button button--outline"
            onClick={() => history.goBack()}
          >
            Tilbake
          </button>
        </div>
      </form>
    </div>
  );
};
