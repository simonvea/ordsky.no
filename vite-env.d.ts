/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SESSION_WEBSOCKET_URL: string;
  readonly VITE_SESSION_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
