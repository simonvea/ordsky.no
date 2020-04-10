import React, { createContext, useReducer, Dispatch, Reducer } from 'react';
import { wordsReducer } from './cloudReducer';
import { initialState, CloudState, CloudActions } from './cloudReducer.types';

export interface WordsContext {
  state: CloudState;
  dispatch: Dispatch<CloudActions>;
}

export const CloudContext = createContext({} as WordsContext);

export const CloudProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<CloudState, CloudActions>>(
    wordsReducer,
    initialState
  );
  return (
    <CloudContext.Provider value={{ state, dispatch }}>
      {children}
    </CloudContext.Provider>
  );
};
