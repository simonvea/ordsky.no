import React, { createContext } from 'react';

export interface Context {
  state: { text: string };
  actions: {
    updateText: (text: string) => void;
    clearText: () => void;
  };
}

export const TextContext = createContext({} as Context);

export const TextProvider: React.FC = ({ children }) => {
  const [text, updateText] = React.useState('');

  const clearText = (): void => updateText('');

  return (
    <TextContext.Provider
      value={{ state: { text }, actions: { updateText, clearText } }}
    >
      {children}
    </TextContext.Provider>
  );
};
