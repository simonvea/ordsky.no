/* eslint-disable no-param-reassign */
import produce from 'immer';
import { WordsState, WordsActions, initialState } from './wordsReducer.types';

export const wordsReducer = produce(
  // eslint-disable-next-line consistent-return
  (draft: WordsState = initialState, action: WordsActions) => {
    switch (action.type) {
      case 'WORDS_SET_TEXT':
        draft.text = action.data;
        break;
      case 'WORDS_CLEAR':
        draft.text = '';
        break;
      case 'WORDS_START_COUNT':
        draft.loading = true;
        delete draft.wordCount;
        break;
      case 'WORDS_FINISH_COUNT':
        draft.wordCount = action.data;
        draft.loading = false;
        break;
      case 'WORDS_ERROR':
        draft.error = action.error;
        draft.loading = false;
        break;
      default:
        return draft;
    }
  }
);
/* eslint-enable no-param-reassign */
