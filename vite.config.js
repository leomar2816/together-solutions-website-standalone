import { fileURLToPath } from "node:url";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Static build for Apache/Bluehost: TanStack Start in SPA mode prerenders one HTML shell
// (dist/client/index.html) and the client renders every route. The backend is the PHP API
// in public/api, copied into dist/client/api with the rest of public/.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    // Local dev: `npm run api` serves the PHP API on :8044.
    proxy: { "/api": "http://127.0.0.1:8044", "/uploads": "http://127.0.0.1:8044" },
  },
  plugins: [
    tanstackStart({
      srcDirectory: "src",
      spa: { enabled: true, prerender: { outputPath: "/index" } },
    }),
    react(),
  ],
});
