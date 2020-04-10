/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  FormsState,
  FormsActions,
  initialState,
  WordsInput,
} from './formsReducer.types';

export const formsReducer = produce(
  // eslint-disable-next-line consistent-return
  (draft: FormsState = initialState, action: FormsActions) => {
    switch (action.type) {
      case 'WORDS_ADD_INPUT': {
        const key = `input-${draft.addedInputs}`;
        const newInput: WordsInput = { key, word: '', size: '' };
        draft.inputs.push(newInput);
        draft.addedInputs += 1;
        break;
      }
      case 'WORDS_REMOVE_INPUT':
        draft.inputs = draft.inputs.filter((input) => input.key !== action.key);
        break;
      case 'WORDS_UPDATE_INPUT': {
        draft.inputs = draft.inputs.map((input) =>
          input.key === action.input.key ? action.input : input
        );
        break;
      }
      case 'WORDS_CLEAR_INPUTS':
        draft.inputs = [{ key: 'input-0', word: '', size: '' }];
        break;
      case 'WORDS_SET_TEXT':
        draft.text = action.text;
        break;
      case 'WORDS_CLEAR':
        draft.text = '';
        break;
      default:
        return draft;
    }
  }
);
/* eslint-enable no-param-reassign */
