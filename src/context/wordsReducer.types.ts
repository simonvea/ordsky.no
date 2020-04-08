import { WordCount } from '../utils/countWords';
import { Cloud } from '../utils/createCloud';

export const initialState = {
  loading: false,
  text: '',
  wordCount: {},
};

export interface WordsState {
  loading: boolean;
  text: string;
  wordCount?: WordCount;
  cloud?: Cloud[];
  error?: string;
}

export type WordsActions =
  | { type: 'WORDS_SET_TEXT'; data: string }
  | { type: 'WORDS_CLEAR' }
  | {
      type: 'WORDS_START_COUNT';
    }
  | {
      type: 'WORDS_FINISH_COUNT';
      data: WordCount;
    }
  | {
      type: 'CLOUD_ERROR';
      error: string;
    }
  | { type: 'CLOUD_CREATE' }
  | { type: 'CLOUD_CREATED'; data: Cloud[] };
