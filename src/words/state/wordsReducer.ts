/* eslint-disable no-param-reassign */
import { produce } from 'immer';
import {
  WordsState,
  WordsActions,
  initialState,
  WordsInput,
} from './wordsReducer.types';

export const formsReducer = produce(
  // eslint-disable-next-line consistent-return
  (draft: WordsState, action: WordsActions) => {
    switch (action.type) {
      case 'WORDS_ADD_INPUT': {
        const key = `input-${draft.addedInputs}`;
        const newInput: WordsInput = { key, word: '', size: '1' };
        draft.inputs.push(newInput);
        draft.addedInputs += 1;
        break;
      }
      case 'WORDS_REMOVE_INPUT':
        draft.inputs = draft.inputs.filter((input) => input.key !== action.key);
        if (draft.inputs.length === 0) {
          draft.inputs = initialState.inputs;
        }
        break;
      case 'WORDS_UPDATE_INPUT': {
        draft.inputs = draft.inputs.map((input) =>
          input.key === action.input.key ? action.input : input
        );
        break;
      }
      case 'WORDS_CLEAR_INPUTS':
        draft.inputs = [{ key: 'input-0', word: '', size: '1' }];
        break;
      default:
        return draft;
    }
  }
);
/* eslint-enable no-param-reassign */
