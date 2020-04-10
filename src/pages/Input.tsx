import React, { useState } from 'react';
import { WordsForm } from '../components/WordsForm';
import { TextForm } from '../components/TextForm';

export const Input: React.FC = function Input() {
  const [isWordsForm, setWordsForm] = useState(true);
  const toggleWordsForm = (): void => setWordsForm(!isWordsForm);
  return (
    <section>
      {isWordsForm ? (
        <WordsForm changeToTextForm={toggleWordsForm} />
      ) : (
        <TextForm changeToWordsForm={toggleWordsForm} />
      )}
    </section>
  );
};
