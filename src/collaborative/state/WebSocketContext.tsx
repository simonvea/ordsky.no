import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { Cloud, WordCount } from '../../common/core/cloud.types';

interface WebSocketContext {
  ensureOpenSocket: () => Promise<void>;
  send: (message: string) => void;
  subscribe: (callback: (data: any) => void) => void;
  close: () => void;
}

type SocketEvent =
  | { type: 'WORDS_ADDED'; numberOfEntries: number }
  | { type: 'CLOUD_CREATED'; cloud: Cloud[]; wordCount: WordCount }
  | { type: 'ERROR'; error: Error };

const WebSocketContext = createContext<WebSocketContext | undefined>(undefined);

export const WebSocketProvider: React.FC<{
  url: string;
  children: React.ReactNode;
}> = ({ url, children }) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      ws.current?.close();
    };
  }, []);

  const ensureOpenSocket = useCallback(async (): Promise<void> => {
    if (ws.current?.OPEN) {
      console.debug('WebSocket already open');
      return;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const error = setTimeout(
        () => reject(new Error('Unable to initialize websocket in time')),
        4000
      );
      ws.current = new WebSocket(url);

      ws.current?.addEventListener('open', () => {
        clearTimeout(error);
        resolve();
      });
    });

    await promise;

    ws.current?.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });

    return;
  }, [ws.current]);

  const close = useCallback((): void => ws.current?.close(), [ws.current]);

  const send = useCallback(
    (message: string): undefined => {
      ws.current?.send(message);
    },
    [ws.current]
  );

  const subscribe = useCallback(
    (callback: ({}: SocketEvent) => void): void => {
      ws.current?.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        callback(data);
      });
    },
    [ws.current, ensureOpenSocket]
  );

  return (
    <WebSocketContext.Provider
      value={{ ensureOpenSocket, send, subscribe, close }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContext => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
