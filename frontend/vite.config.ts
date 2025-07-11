import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // ► redirige API a tu back (FastAPI en :8000)
      "/api": "http://localhost:8000"
    }
  }
});
