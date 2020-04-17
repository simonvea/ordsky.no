import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CloudContext } from './cloudContext';
import { CloudState } from './cloudReducer.types';
import { generateCloud } from '../../utils/cloud/createCloud';
import { Cloud, CloudInput, CloudConfig } from '../../utils/cloud/cloud.types';
import { apiService } from '../../services/API';
import { countWords } from '../../utils/countWords';

export interface UseWordsContext {
  state: CloudState;
  createCloud: (cloudInput: CloudInput[]) => void;
  createCloudAsync: (text: string) => Promise<void>;
}

export const useCloudContext = (): UseWordsContext => {
  const { state, dispatch } = useContext(CloudContext);
  const history = useHistory();

  const createCloudAsync = async (text: string): Promise<void> => {
    dispatch({ type: 'CLOUD_START_COUNT' });
    try {
      const wordCount = await countWords(text);
      dispatch({ type: 'CLOUD_FINISH_COUNT', data: wordCount });
      dispatch({ type: 'CLOUD_CREATE' });
      const config: CloudConfig = {
        svgHeight: 300,
        svgWidth: 500,
      };
      const data = await apiService.createCloud(wordCount, config);
      dispatch({ type: 'CLOUD_CREATED', data });
    } catch (error) {
      dispatch({ type: 'CLOUD_ERROR', error: (error as Error).message });
    }
  };

  const createCloud = (cloudInput: CloudInput[]): void => {
    dispatch({ type: 'CLOUD_CREATE' });
    history.push('/ordsky');
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
