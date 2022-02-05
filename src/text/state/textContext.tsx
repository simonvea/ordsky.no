import React, { createContext, useMemo } from "react";

export interface Context {
  state: { text: string };
  actions: {
    updateText: (text: string) => void;
    clearText: () => void;
  };
}

export const TextContext = createContext({} as Context);

type ProviderProps = {
  children: React.ReactNode;
};

export function TextProvider({ children }: ProviderProps): React.ReactElement {
  const [text, updateText] = React.useState("");

  const clearText = (): void => updateText("");

  const context = useMemo(
    () => ({ state: { text }, actions: { updateText, clearText } }),
    [text]
  );

  return (
    <TextContext.Provider value={context}>{children}</TextContext.Provider>
  );
}
