import type { NextConfig } from "next";

/*
 * Where the exported site will live. Each target is a separate build:
 *
 *   npm run build                          domain root     https://host/
 *   NEXT_BASE_PATH=/explic npm run build   subdirectory    https://host/explic/
 *   EXPORT_PORTABLE=1 npm run build        offline copy, index.html opened from disk
 *
 * `npm run build:submission` builds and zips the hosting and offline targets into dist/.
 */
const basePath = (process.env.NEXT_BASE_PATH ?? "").replace(/\/+$/, "");
if (basePath && !/^\/[\w\-.~/]+$/.test(basePath)) {
  throw new Error(`NEXT_BASE_PATH must look like "/explic", got "${basePath}"`);
}
const portable = process.env.EXPORT_PORTABLE === "1";
if (portable && basePath) {
  throw new Error("EXPORT_PORTABLE and NEXT_BASE_PATH cannot be combined");
}

const nextConfig: NextConfig = {
  // Static HTML/CSS/JS export for ordinary static hosting (no Node.js server).
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: basePath || undefined,
  // Portable: "./_next/..." resolves beside index.html, wherever the folder is opened from.
  assetPrefix: portable ? "." : undefined,
  // Prefix for files in /public referenced from our own code (see lib/paths.ts).
  env: {
    PUBLIC_ASSET_BASE: portable ? "." : basePath,
  },
  experimental: {
    agentFeedback: true,
  },
  // cacheComponents / partialPrefetching are omitted: they enable Partial
  // Prerendering, which requires a server and fails with `output: "export"`.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
