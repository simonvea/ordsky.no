import { WordCount } from '../utils/countWords';

export const initialState = {
  loading: false,
  text: '',
  wordCount: {},
};

export interface WordsState {
  loading: boolean;
  text: string;
  wordCount?: WordCount;
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
      type: 'WORDS_ERROR';
      error: string;
    };
