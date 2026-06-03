import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// On GitHub Pages the site is served from /<repo>/, so the production build
// needs that base path. Locally (dev / preview) we serve from root.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/dsa-visualizer/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
