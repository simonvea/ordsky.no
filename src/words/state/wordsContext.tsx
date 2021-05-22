import React, { createContext, useReducer, Reducer, useCallback } from 'react';
import { formsReducer } from './wordsReducer';
import { initialState, WordsState, WordsActions } from './wordsReducer.types';

export interface Context {
  state: WordsState;
  actions: {
    updateWord: (key: string, word: string) => void;
    updateSize: (key: string, size: string) => void;
    addInput: () => void;
    removeInput: (key: string) => void;
    clearInputs: () => void;
  };
}

export const WordsContext = createContext({} as Context);

export const WordsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<WordsState, WordsActions>>(
    formsReducer,
    initialState
  );

  const addInput = useCallback(
    (): void => dispatch({ type: 'WORDS_ADD_INPUT' }),
    []
  );

  const removeInput = useCallback(
    (key: string): void => dispatch({ type: 'WORDS_REMOVE_INPUT', key }),
    []
  );

  const updateWord = useCallback(
    (key: string, word: string): void => {
      const oldInput = state.inputs.find((input) => input.key === key);
      if (oldInput) {
        dispatch({ type: 'WORDS_UPDATE_INPUT', input: { ...oldInput, word } });
      }
    },
    [state.inputs]
  );

  const updateSize = (key: string, size: string): void => {
    const oldInput = state.inputs.find((input) => input.key === key);
    if (oldInput) {
      dispatch({
        type: 'WORDS_UPDATE_INPUT',
        input: { ...oldInput, size },
      });
    }
  };

  const clearInputs = useCallback(
    (): void => dispatch({ type: 'WORDS_CLEAR_INPUTS' }),
    []
  );

  const actions = {
    addInput,
    removeInput,
    updateWord,
    updateSize,
    clearInputs,
  };

  return (
    <WordsContext.Provider value={{ state, actions }}>
      {children}
    </WordsContext.Provider>
  );
};
