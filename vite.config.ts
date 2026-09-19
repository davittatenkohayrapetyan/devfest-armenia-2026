import { defineConfig } from "vite";

// The internal board view is excluded from deployment builds. It is unlinked and noindex,
// but "not deployed at all" is the only version of private that does not rely on obscurity.
// Set by scripts/build-deploy.mjs; a normal `npm run build` keeps the page for local review.
const omitProgress = process.env.OMIT_PROGRESS === "1";

// Absolute URLs for Open Graph and the sitemap need an origin. Default to the local container
// so a dev build is complete and self-consistent; scripts/build-deploy.mjs refuses to ship
// while this is still localhost, which turns "forgot to set the domain" into a hard failure
// rather than a social card that 404s.
process.env.VITE_SITE_URL ??= "http://localhost:3026";

/**
 * Injects the analytics tag into the public page only, and only when a domain is configured
 * (ADR-012). No variable set — as in every local and preview build — means no script tag at
 * all, rather than a tag pointing at nothing. The internal board view never gets it.
 */
function analytics() {
  const domain = process.env.VITE_ANALYTICS_DOMAIN;
  const src = process.env.VITE_ANALYTICS_SRC ?? "https://plausible.io/js/script.outbound-links.js";
  return {
    name: "analytics-tag",
    transformIndexHtml(html: string, ctx: { path: string }) {
      if (!domain || !ctx.path.endsWith("/index.html") || ctx.path.includes("implementation-progress")) {
        return html;
      }
      const tag = `    <script defer data-domain="${domain}" src="${src}"></script>
`;
      return html.replace("  </head>", tag + "  </head>");
    },
  };
}

export default defineConfig({
  plugins: [analytics()],
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
