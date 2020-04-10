import { useContext, useCallback } from 'react';
import { CloudContext } from './cloudContext';
import { CloudState } from './cloudReducer.types';
import {
  countWords as wordCounter,
  wordInputsToWordCount,
} from '../../utils/countWords';
import { apiService } from '../../services/API';
import { WordsInput } from '../form/formsReducer.types';

export interface UseWordsContext {
  state: CloudState;
  createCloud: (text: string) => Promise<void>;
  createCloudFromWords: (words: WordsInput[]) => void;
}

export const useCloudContext = (): UseWordsContext => {
  const { state, dispatch } = useContext(CloudContext);

  const createCloud = useCallback(
    async (text: string): Promise<void> => {
      dispatch({ type: 'CLOUD_START_COUNT' });
      const data = await wordCounter(text);
      dispatch({ type: 'CLOUD_FINISH_COUNT', data });

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

  const createCloudFromWords = async (words: WordsInput[]): Promise<void> => {
    const wordCount = wordInputsToWordCount(words);
    dispatch({ type: 'CLOUD_CREATE' });
    try {
      const cloud = await apiService.createCloud(wordCount);
      dispatch({ type: 'CLOUD_CREATED', data: cloud });
    } catch (error) {
      dispatch({ type: 'CLOUD_ERROR', error: (error as Error).message });
    }
  };

  return {
    state,
    createCloud,
    createCloudFromWords,
  };
};
