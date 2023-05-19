/* eslint-disable no-param-reassign */
import { produce } from 'immer';

export type WordsInput = { key: string; word: string };

export const initialState = {
  inputs: [{ key: 'input-0', word: '' }],
  addedInputs: 1,
  text: '',
};

export interface FormsState {
  inputs: WordsInput[];
  addedInputs: number;
  text: string;
}

export type FormsActions =
  | { type: 'WORDS_ADD_INPUT' }
  | { type: 'WORDS_REMOVE_INPUT'; key: string }
  | {
      type: 'WORDS_UPDATE_INPUT';
      input: WordsInput;
    }
  | { type: 'WORDS_CLEAR_INPUTS' };

/* eslint-disable default-case */
export const formsReducer = produce(
  // eslint-disable-next-line consistent-return
  (draft: FormsState, action: FormsActions) => {
    switch (action.type) {
      case 'WORDS_ADD_INPUT': {
        const key = `input-${draft.addedInputs}`;
        const newInput: WordsInput = { key, word: '' };
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
        draft.inputs = [{ key: 'input-0', word: '' }];
        break;
    }
  }
);
/* eslint-enable default-case */
/* eslint-enable no-param-reassign */
