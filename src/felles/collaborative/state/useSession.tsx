import { useContext, useCallback, useEffect, useRef, useState } from "react";
import { generateId } from "../helpers";
import { SessionContext } from "./SessionProvider";
import { SessionState } from "./SessionReducer";
import { SessionEvents } from "../services/SessionsService";

export interface SessionActions {
  startSession: () => void;
  joinSession: (id: string) => Promise<void>;
  addWordsToSession: (words: string[]) => void;
  createCloud: (id: string) => void;
  endSession: () => void;
}

export type UseSessionContext = {
  state: SessionState & { isLoading: boolean };
  actions: SessionActions;
};

export const useSession = (): UseSessionContext => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch } = context;
  const serviceRef = state.serviceRef;

  const socketHandler = useCallback(
    (event: SessionEvents): void => {
      console.log("EVENT!", event);
      switch (event.type) {
        case "WORDS_ADDED": {
          dispatch({
            type: "WORDS_ADDED",
            totalEntries: event.numberOfEntries,
          });
          break;
        }
        case "CLOUD_CREATED": {
          dispatch({
            type: "CLOUD_CREATED",
            cloud: event.cloud,
            wordCount: event.wordCount,
          });
          break;
        }
      }
    },
    [dispatch],
  );

  const startSession = useCallback(async () => {
    try {
      const id = generateId();

      serviceRef.current.subscribe(socketHandler);

      serviceRef.current.startSession(id);

      dispatch({ type: "SESSION_STARTED", id });
    } catch (error) {
      dispatch({ type: "ERROR", error: error as Error });
    }
  }, [serviceRef, dispatch]);

  const joinSession = useCallback(
    async (id: string) => {
      try {
        const exists = await serviceRef.current.isLiveSession(id);

        if (!exists) {
          throw new Error("Session does not exist");
        }

        serviceRef.current.subscribe(socketHandler);

        serviceRef.current.joinSession(id);

        dispatch({ type: "SESSION_JOINED", id });
      } catch (error) {
        dispatch({ type: "ERROR", error: error as Error });
      }
    },
    [serviceRef, dispatch],
  );

  const addWordsToSession = useCallback(
    (words: string[]) => {
      try {
        const id = state.id;

        serviceRef.current.saveWords({ id, words });

        dispatch({ type: "WORDS_SENT" });
      } catch (error) {
        dispatch({ type: "ERROR", error: error as Error });
      }
    },
    [state.id, serviceRef, dispatch],
  );

  const createCloud = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);

        const words = await serviceRef.current.getAllWords(id);
        const cloudData = await serviceRef.current.createCloud(words);

        serviceRef.current.saveCloudAndWordCount({ id, ...cloudData });

        dispatch({
          type: "CLOUD_CREATED",
          cloud: cloudData.cloud,
          wordCount: cloudData.wordCount,
        });
      } catch (error) {
        dispatch({ type: "ERROR", error: error as Error });
      } finally {
        setIsLoading(false);
      }
    },
    [serviceRef, setIsLoading, dispatch],
  );

  const endSession = useCallback(() => {
    dispatch({ type: "SESSION_ENDED" });
  }, [serviceRef, dispatch]);

  return {
    state: { ...state, isLoading },
    actions: {
      startSession,
      addWordsToSession,
      createCloud,
      endSession,
      joinSession,
    },
  };
};
