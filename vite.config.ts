import { defineConfig } from "vite";

// The internal board view is excluded from deployment builds. It is unlinked and noindex,
// but "not deployed at all" is the only version of private that does not rely on obscurity.
// Set by scripts/build-deploy.mjs; a normal `npm run build` keeps the page for local review.
const omitProgress = process.env.OMIT_PROGRESS === "1";

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
        ...(omitProgress ? {} : { progress: "implementation-progress/index.html" }),
      },
    },
  },
});
