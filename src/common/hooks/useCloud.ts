import { useReducer, useCallback } from 'react';
import { CloudInput, WordCount } from '../core/cloud.types';
import { createCloud } from '../core/createCloud';
import { wordCountToCloudInput } from '../core/wordCountToCloudInput';
import { countWords } from '../core/countWords';
import { CloudState } from './cloudReducer.types';
import { wordsReducer, initialState } from './cloudReducer';

export interface UseWordsContext {
  state: CloudState;
  actions: {
    createCloudFromWords: (words: WordCount) => void;
    createCloudFromText: (text: string) => Promise<void>;
    reset: () => void;
  };
}

export const useCloud = (): UseWordsContext => {
  const [state, dispatch] = useReducer(wordsReducer, initialState);

  const createCloudFromWords = useCallback(
    async (wordCount: WordCount): Promise<void> => {
      dispatch({ type: 'CLOUD_CREATE' });
      try {
        const cloudInput: CloudInput[] = wordCountToCloudInput(wordCount);

        const data = await createCloud(cloudInput);

        dispatch({ type: 'CLOUD_CREATED', data });
      } catch (error) {
        dispatch({ type: 'CLOUD_ERROR', error: (error as Error).message });
      }
    },
    [dispatch]
  );

  const createCloudFromText = useCallback(
    async (text: string): Promise<void> => {
      dispatch({ type: 'CLOUD_START_COUNT' });

      try {
        const wordCount = await countWords(text);
        dispatch({ type: 'CLOUD_FINISH_COUNT', data: wordCount });

        createCloudFromWords(wordCount);
      } catch (error) {
        dispatch({ type: 'CLOUD_ERROR', error: (error as Error).message });
      }
    },
    [dispatch]
  );

  const reset = useCallback((): void => dispatch({ type: 'CLOUD_RESET' }), [
    dispatch,
  ]);

  return {
    state,
    actions: {
      createCloudFromWords,
      createCloudFromText,
      reset,
    },
  };
};
