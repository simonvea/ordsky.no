import { useContext } from 'react';
import { TextContext } from '../state/textContext';

interface UseText {
  state: { text: string; filter: string[] };
  actions: {
    updateText: (text: string) => void;
    clearText: () => void;
    updateFilter: (filter: string[]) => void;
  };
}

export const useText = (): UseText => useContext(TextContext);
