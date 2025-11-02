import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
  },
  server: {
    proxy: {
      "/ws": "http://localhost:3000",
      "/api": "http://localhost:3000",
    },
  },
  plugins: [react()],
});
