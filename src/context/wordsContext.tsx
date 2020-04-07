import React, { createContext, useReducer, Dispatch, Reducer } from 'react';
import { wordsReducer } from './wordsReducer';
import { initialState, WordsState, WordsActions } from './wordsReducer.types';

export interface WordsContext {
  state: WordsState;
  dispatch: Dispatch<WordsActions>;
}

export const WordsContext = createContext({} as WordsContext);

export const WordsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<WordsState, WordsActions>>(
    wordsReducer,
    initialState
  );
  return (
    <WordsContext.Provider value={{ state, dispatch }}>
      {children}
    </WordsContext.Provider>
  );
};
