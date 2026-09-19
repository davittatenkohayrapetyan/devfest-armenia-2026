import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? "/",
  server: { host: true, port: 3025 },
  preview: { host: true, port: 3026 },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      input: {
        // The event site. Must stay first: it is the default document.
        main: "index.html",
        // Internal board view (DF-48). A real entry, not a client-side route: nginx does
        // try_files $uri $uri/ /index.html, so a route would serve the event page instead.
        progress: "implementation-progress/index.html",
      },
    },
  },
});
