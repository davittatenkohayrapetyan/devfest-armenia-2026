// Generates public/robots.txt and public/sitemap.xml. Run by prebuild.
//
// Both need an absolute origin, which only exists once the deployment domain is known.
// VITE_SITE_URL supplies it; vite.config.ts defaults it to the local container so a dev build
// works, and scripts/build-deploy.mjs refuses to produce a deployable dist while it still
// points at localhost. A sitemap full of localhost URLs is worse than no sitemap.
//
// The internal board view is deliberately absent from both files. It is not in the sitemap
// because it is not public, and it is not in robots.txt either — a Disallow line is a published
// list of the paths you did not want found.
import { writeFileSync } from "node:fs";

const origin = (process.env.VITE_SITE_URL ?? "http://localhost:3026").replace(/\/+$/, "");
const today = new Date().toISOString().slice(0, 10);

const robots = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

// Single-page site: one URL. Sections are anchors on it, not separate documents, and listing
// anchors in a sitemap tells a crawler nothing it cannot already see.
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

writeFileSync("public/robots.txt", robots, "utf8");
writeFileSync("public/sitemap.xml", xml, "utf8");
console.log(`SEO files generated for ${origin}`);
