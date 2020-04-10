import { useContext } from 'react';
import { FormsContext } from './formsContext';
import { FormsState } from './formsReducer.types';

export interface UseFormsContext {
  state: FormsState;
  updateWord: (key: string, word: string) => void;
  updateSize: (key: string, size: string) => void;
  addInput: () => void;
  removeInput: (key: string) => void;
  clearInputs: () => void;
  updateText: (text: string) => void;
  clearText: () => void;
}

export const useFormsContext = (): UseFormsContext => {
  const { state, dispatch } = useContext(FormsContext);

  const addInput = (): void => dispatch({ type: 'WORDS_ADD_INPUT' });

  const removeInput = (key: string): void =>
    dispatch({ type: 'WORDS_REMOVE_INPUT', key });

  const updateWord = (key: string, word: string): void => {
    const oldInput = state.inputs.find((input) => input.key === key);
    if (oldInput) {
      dispatch({ type: 'WORDS_UPDATE_INPUT', input: { ...oldInput, word } });
    }
  };

  const updateSize = (key: string, size: string): void => {
    const oldInput = state.inputs.find((input) => input.key === key);
    if (oldInput) {
      dispatch({ type: 'WORDS_UPDATE_INPUT', input: { ...oldInput, size } });
    }
  };

  const clearInputs = (): void => dispatch({ type: 'WORDS_CLEAR_INPUTS' });

  const updateText = (text: string): void =>
    dispatch({ type: 'WORDS_SET_TEXT', text });

  const clearText = (): void => dispatch({ type: 'WORDS_CLEAR' });

  return {
    state,
    addInput,
    removeInput,
    updateWord,
    updateSize,
    clearInputs,
    updateText,
    clearText,
  };
};
