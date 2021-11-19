import { useReducer, useCallback } from 'react';
import { createCloudFromWordCount } from '../core/wordCountToCloudInput';
import { countWords } from '../core/countWords';
import { CloudState } from './cloudReducer.types';
import { wordsReducer, initialState } from './cloudReducer';
import { logger } from '../core/analytics';
import { WordCount } from '../core/cloud.types';

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
        const data = await createCloudFromWordCount(wordCount);

        dispatch({ type: 'CLOUD_CREATED', data });

        logger.logEvent('words_cloud_created');
      } catch (error) {
        dispatch({ type: 'CLOUD_ERROR', error: (error as Error).message });
        logger.logError({
          description: `Error while creating cloud from words: ${
            (error as Error).message
          }`,
          fatal: false,
          error: error as Error,
        });
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

        dispatch({ type: 'CLOUD_CREATE' });

        const data = await createCloudFromWordCount(wordCount);

        dispatch({ type: 'CLOUD_CREATED', data });

        logger.logEvent('text_cloud_created');
      } catch (error) {
        dispatch({ type: 'CLOUD_ERROR', error: (error as Error).message });
        logger.logError({
          description: `Error while creating cloud from text: ${
            (error as Error).message
          }`,
          fatal: false,
          error: error as Error,
        });
      }
    },
    [dispatch]
  );

  const reset = useCallback(
    (): void => dispatch({ type: 'CLOUD_RESET' }),
    [dispatch]
  );

  return {
    state,
    actions: {
      createCloudFromWords,
      createCloudFromText,
      reset,
    },
  };
};
