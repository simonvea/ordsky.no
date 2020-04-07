import { useContext } from 'react';
import { WordsContext } from './wordsContext';
import { WordsState } from './wordsReducer.types';
import { countWords } from '../utils/countWords';

export interface UseWordsContext {
  state: WordsState;
  onSubmit: (text: string) => void;
}

export const useWordsContext = (): UseWordsContext => {
  const { state, dispatch } = useContext(WordsContext);

  const onSubmit = (text: string): void => {
    dispatch({ type: 'WORDS_START_COUNT' });
    const data = countWords(text);
    dispatch({ type: 'WORDS_FINISH_COUNT', data });
  };

  return { state, onSubmit };
};
