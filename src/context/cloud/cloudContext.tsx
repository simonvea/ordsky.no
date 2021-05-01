import React, { createContext, useReducer, Dispatch } from 'react';
import { wordsReducer, initialState } from './cloudReducer';
import { CloudState, CloudActions } from './cloudReducer.types';

export interface WordsContext {
  state: CloudState;
  dispatch: Dispatch<CloudActions>;
}

export const CloudContext = createContext({} as WordsContext);

export const CloudProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(wordsReducer, initialState);

  return (
    <CloudContext.Provider value={{ state, dispatch }}>
      {children}
    </CloudContext.Provider>
  );
};
