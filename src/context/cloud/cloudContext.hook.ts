import { useContext } from 'react';
import { CloudContext } from './cloudContext';
import { CloudState } from './cloudReducer.types';
import { generateCloud } from '../../utils/cloud/createCloud';
import { Cloud, CloudInput } from '../../utils/cloud/cloud.types';
import { countWords } from '../../utils/countWords';
import { wordCountToCloudInput } from '../../utils/cloud/wordCountToCloudInput';

export interface UseWordsContext {
  state: CloudState;
  createCloud: (cloudInput: CloudInput[]) => void;
  createCloudAsync: (text: string) => Promise<void>;
}

export const useCloudContext = (): UseWordsContext => {
  const { state, dispatch } = useContext(CloudContext);

  const createCloudAsync = async (text: string): Promise<void> => {
    dispatch({ type: 'CLOUD_START_COUNT' });
    try {
      const wordCount = await countWords(text);
      dispatch({ type: 'CLOUD_FINISH_COUNT', data: wordCount });
      dispatch({ type: 'CLOUD_CREATE' });

      const cloudInput = wordCountToCloudInput(wordCount);

      const callback = (data: Cloud[]): void =>
        dispatch({ type: 'CLOUD_CREATED', data });

      generateCloud(cloudInput, callback);
    } catch (error) {
      dispatch({ type: 'CLOUD_ERROR', error: (error as Error).message });
    }
  };

  const createCloud = (cloudInput: CloudInput[]): void => {
    dispatch({ type: 'CLOUD_CREATE' });
    try {
      const callback = (data: Cloud[]): void =>
        dispatch({ type: 'CLOUD_CREATED', data });
      generateCloud(cloudInput, callback);
    } catch (error) {
      dispatch({ type: 'CLOUD_ERROR', error: (error as Error).message });
    }
  };

  return {
    state,
    createCloud,
    createCloudAsync,
  };
};
