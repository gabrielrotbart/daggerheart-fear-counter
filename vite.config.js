import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  server: { host: "0.0.0.0", cors: true }
});