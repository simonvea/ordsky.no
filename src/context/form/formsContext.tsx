import React, { createContext, useReducer, Dispatch, Reducer } from 'react';
import { formsReducer } from './formsReducer';
import { initialState, FormsState, FormsActions } from './formsReducer.types';

export interface Context {
  state: FormsState;
  dispatch: Dispatch<FormsActions>;
}

export const FormsContext = createContext({} as Context);

export const FormsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<FormsState, FormsActions>>(
    formsReducer,
    initialState
  );
  return (
    <FormsContext.Provider value={{ state, dispatch }}>
      {children}
    </FormsContext.Provider>
  );
};
