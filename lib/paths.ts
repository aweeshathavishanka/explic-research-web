/**
 * URL for a file in /public. Correct for every export target: a domain root
 * ("/images/a.webp"), a subdirectory via NEXT_BASE_PATH ("/explic/images/a.webp"),
 * and the portable offline copy ("./images/a.webp", relative to index.html).
 * `PUBLIC_ASSET_BASE` is inlined at build time by next.config.ts.
 */
export function publicAsset(path: string) {
  return `${process.env.PUBLIC_ASSET_BASE ?? ""}/${path.replace(/^\/+/, "")}`;
}
