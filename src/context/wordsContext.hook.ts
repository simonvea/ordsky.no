import { useContext, useCallback } from 'react';
import { WordsContext } from './wordsContext';
import { WordsState } from './wordsReducer.types';
import { countWords as wordCounter } from '../utils/countWords';
import { apiService } from '../services/API';

export interface UseWordsContext {
  state: WordsState;
  createCloud: (text: string) => Promise<void>;
}

export const useWordsContext = (): UseWordsContext => {
  const { state, dispatch } = useContext(WordsContext);

  const createCloud = useCallback(
    async (text: string): Promise<void> => {
      dispatch({ type: 'WORDS_START_COUNT' });
      const data = await wordCounter(text);
      dispatch({ type: 'WORDS_FINISH_COUNT', data });

      dispatch({ type: 'CLOUD_CREATE' });
      try {
        const cloud = await apiService.createCloud(data);
        dispatch({ type: 'CLOUD_CREATED', data: cloud });
      } catch (error) {
        dispatch({ type: 'CLOUD_ERROR', error: (error as Error).message });
      }
    },
    [dispatch]
  );

  return {
    state,
    createCloud,
  };
};
