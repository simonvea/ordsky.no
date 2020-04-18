export type WordsInput = { key: string; word: string; size: string };

export const initialState = {
  inputs: [{ key: 'input-0', word: '', size: '1' }],
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
  | { type: 'WORDS_CLEAR_INPUTS' }
  | { type: 'WORDS_SET_TEXT'; text: string }
  | { type: 'WORDS_CLEAR' };
