import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/health": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/login": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/logout": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/signup": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/profile": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/request": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/user": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/chat": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/socket.io": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
