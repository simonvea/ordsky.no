import React, { createContext, useEffect, useMemo } from 'react';
import filterData from '../../common/core/filter.json';

export interface Context {
  state: { text: string; filter: string[] };
  actions: {
    updateText: (text: string) => void;
    clearText: () => void;
    updateFilter: (filter: string[]) => void;
  };
}

export const TextContext = createContext({} as Context);

type ProviderProps = {
  children: React.ReactNode;
};

export function TextProvider({ children }: ProviderProps): React.ReactElement {
  const [text, updateText] = React.useState('');
  const [filter, setFilter] = React.useState<string[]>([]);

  useEffect(() => {
    setFilter(filterData);
  }, []);

  const clearText = (): void => updateText('');
  const updateFilter = (newFilter: string[]): void => setFilter(newFilter);

  const context = useMemo(
    () => ({
      state: { text, filter },
      actions: { updateText, clearText, updateFilter },
    }),
    [text, filter]
  );

  return (
    <TextContext.Provider value={context}>{children}</TextContext.Provider>
  );
}
