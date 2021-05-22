import { useContext } from 'react';
import { WordsContext, Context } from '../state/wordsContext';

export const useWords = (): Context => {
  const { state, actions } = useContext(WordsContext);

  const updateSize = (key: string, size: string): void => {
    const number = Number(size);
    const newSize = number < 0 ? '0' : size;
    actions.updateSize(key, newSize);
  };

  return {
    state,
    actions: {
      ...actions,
      updateSize,
    },
  };
};
