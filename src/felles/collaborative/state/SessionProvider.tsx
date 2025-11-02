import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
  useRef,
  RefObject,
  useEffect,
} from "react";
import {
  sessionReducer,
  SessionState,
  initialState,
  SessionEvent,
} from "./SessionReducer";
import { OrdskyService } from "../services/OrdskyService";

interface SessionProviderProps {
  children: ReactNode;
}

type SessionContext = {
  state: SessionState & { serviceRef: RefObject<OrdskyService> };
  dispatch: Dispatch<SessionEvent>;
};

export const SessionContext = createContext<SessionContext | undefined>(
  undefined,
);

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const serviceRef = useRef<OrdskyService>(
    new OrdskyService(
      import.meta.env.VITE_SESSION_API_URL || "",
      import.meta.env.VITE_SESSION_WEBSOCKET_URL || "/ws",
    ),
  );

  useEffect(() => {
    return () => {
      if (serviceRef.current.isLive()) return serviceRef.current.disconnect();
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{ state: { ...state, serviceRef }, dispatch }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContext => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
