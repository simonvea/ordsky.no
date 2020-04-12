import React, { FormEvent, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { useCloudContext } from '../context/cloud/cloudContext.hook';
import { useNotification } from '../hooks';
import { useFormsContext } from '../context/form/formsContext.hook';

export type TextFormProps = {
  changeToWordsForm: () => void;
};

export const TextForm: React.FC<TextFormProps> = function TextForm({
  changeToWordsForm,
}) {
  const [notification, notify] = useNotification(
    'Du må legge inn tekst før du kan generere en ordsky.',
    10
  );
  const {
    createCloudAsync,
    state: { loading },
  } = useCloudContext();
  const {
    state: { text },
    updateText,
    clearText,
  } = useFormsContext();
  const history = useHistory();

  const onChange = ({ target }: ChangeEvent<HTMLTextAreaElement>): void => {
    updateText(target.value);
  };

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (!text) {
      notify();
      return;
    }
    createCloudAsync(text);
    history.push('/ordsky');
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
        <div className="notification">{notification && notification}</div>
        <div className="flex-container">
          <button
            type="button"
            className="button button--secondary"
            onClick={clearText}
          >
            Tøm
          </button>
          <button
            type="submit"
            id="submit"
            className="button"
            disabled={loading}
          >
            Generer ordsky
          </button>
          <button
            type="button"
            className="button button--outline"
            onClick={changeToWordsForm}
          >
            Tilbake til ordskjema
          </button>
        </div>
      </form>
    </div>
  );
};
