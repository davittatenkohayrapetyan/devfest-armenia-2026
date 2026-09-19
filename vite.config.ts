import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? "/",
  server: { host: true, port: 3025 },
  preview: { host: true, port: 3026 },
  build: { outDir: "dist", sourcemap: false },
});
