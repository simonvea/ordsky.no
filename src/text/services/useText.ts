import { useContext } from 'react';
import { TextContext } from '../state/textContext';

interface UseText {
  state: { text: string };
  actions: {
    updateText: (text: string) => void;
    clearText: () => void;
  };
}

export const useText = (): UseText => useContext(TextContext);
