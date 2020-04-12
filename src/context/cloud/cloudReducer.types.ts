import { WordCount } from '../form/formsReducer.types';
import { Cloud } from '../../utils/cloud/cloud.types';

export const initialState = {
  loading: false,
  wordCount: {},
};

export interface CloudState {
  loading: boolean;
  wordCount?: WordCount;
  cloud?: Cloud[];
  error?: string;
}

export type CloudActions =
  | {
      type: 'CLOUD_START_COUNT';
    }
  | {
      type: 'CLOUD_FINISH_COUNT';
      data: WordCount;
    }
  | {
      type: 'CLOUD_ERROR';
      error: string;
    }
  | { type: 'CLOUD_CREATE' }
  | { type: 'CLOUD_CREATED'; data: Cloud[] };
