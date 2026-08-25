import { defineConfig } from "vite";
import { resolve } from "node:path";

/**
 * Two entry points: the marketing site (`/`) and the dashboard (`/dashboard.html`).
 * Both are plain HTML + ES modules; there is no framework here on purpose, so the
 * rendered result is exactly what the stylesheets say it is.
 */
export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        dashboard: resolve(import.meta.dirname, "dashboard.html"),
      },
    },
  },
  server: {
    port: Number(process.env.PORT ?? 5173),
    host: "127.0.0.1",
  },
});
