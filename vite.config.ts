import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
  },
  server: {
    proxy: {
      "/ws": "ws://localhost:3000",
      "/api": "http://localhost:3000",
    },
  },
  ssr: {
    // Its CJS build loses the default export when Node imports it externally.
    noExternal: ["styled-components"],
  },
  plugins: [react()],
});
