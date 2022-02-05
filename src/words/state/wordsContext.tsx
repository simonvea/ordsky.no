import React, {
  createContext,
  useReducer,
  Reducer,
  useCallback,
  useMemo,
} from "react";
import { formsReducer } from "./wordsReducer";
import { initialState, WordsState, WordsActions } from "./wordsReducer.types";

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

type ProviderProps = {
  children: React.ReactNode;
};

export function WordsProvider({ children }: ProviderProps): React.ReactElement {
  const [state, dispatch] = useReducer<Reducer<WordsState, WordsActions>>(
    formsReducer,
    initialState
  );

  const addInput = useCallback(
    (): void => dispatch({ type: "WORDS_ADD_INPUT" }),
    []
  );

  const removeInput = useCallback(
    (key: string): void => dispatch({ type: "WORDS_REMOVE_INPUT", key }),
    []
  );

  const updateWord = useCallback(
    (key: string, word: string): void => {
      const oldInput = state.inputs.find((input) => input.key === key);
      if (oldInput) {
        dispatch({ type: "WORDS_UPDATE_INPUT", input: { ...oldInput, word } });
      }
    },
    [state.inputs]
  );

  const updateSize = (key: string, size: string): void => {
    const oldInput = state.inputs.find((input) => input.key === key);
    if (oldInput) {
      dispatch({
        type: "WORDS_UPDATE_INPUT",
        input: { ...oldInput, size },
      });
    }
  };

  const clearInputs = useCallback(
    (): void => dispatch({ type: "WORDS_CLEAR_INPUTS" }),
    []
  );

  const actions = {
    addInput,
    removeInput,
    updateWord,
    updateSize,
    clearInputs,
  };

  const context = useMemo(() => ({ state, actions }), [state]);

  return (
    <WordsContext.Provider value={context}>{children}</WordsContext.Provider>
  );
}
