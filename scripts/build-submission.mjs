// Builds both submission distributions from the same source and zips them:
//
//   dist/hosting/   static export for a web server
//   dist/offline/   portable copy: extract, then double-click index.html (file://)
//   dist/explic-research-website.zip
//   dist/explic-research-website-offline.zip
//
// Usage:
//   npm run build:submission
//   NEXT_BASE_PATH=/explic npm run build:submission   # hosting build for https://host/explic/
//
// Runs on macOS, Linux, and Windows with Node.js 22+; no zip tool is needed.
// out/ is left holding the normal hosting export, exactly as `npm run build` produces it.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "out");
const DIST = path.join(ROOT, "dist");
const NEXT_BIN = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");
const SIZE_LIMIT = 20 * 1024 * 1024; // SLIIT hosting allocation
const BASE_PATH = (process.env.NEXT_BASE_PATH ?? "").replace(/\/+$/, "");

const TARGETS = {
  hosting: { dir: path.join(DIST, "hosting"), zip: path.join(DIST, "explic-research-website.zip") },
  offline: { dir: path.join(DIST, "offline"), zip: path.join(DIST, "explic-research-website-offline.zip") },
};

function fail(message) {
  console.error(`\nbuild:submission failed: ${message}`);
  process.exit(1);
}

function walk(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full, base) : [path.relative(base, full)];
  });
}

const dirSize = (dir) => walk(dir).reduce((sum, f) => sum + fs.statSync(path.join(dir, f)).size, 0);
const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

function nextBuild(env) {
  fs.rmSync(path.join(ROOT, ".next"), { recursive: true, force: true });
  fs.rmSync(OUT, { recursive: true, force: true });
  const result = spawnSync(process.execPath, [NEXT_BIN, "build"], {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) fail("next build exited with an error");
}

/* ------------------------------------------------------------------ */
/* Offline fix-ups                                                     */
/* ------------------------------------------------------------------ */

// Files only a server or client-side navigation would request. The offline page
// never fetches them, so they are left out of the portable copy.
function pruneOffline(dir) {
  for (const name of ["404", "404.html", "_not-found", "index.txt"]) {
    fs.rmSync(path.join(dir, name), { recursive: true, force: true });
  }
  for (const name of fs.readdirSync(dir)) {
    if (/^__next\..*\.txt$/.test(name)) fs.rmSync(path.join(dir, name));
  }
}

// 1. Favicon: Next.js prefixes metadata icons with basePath, not assetPrefix, so
//    "/icon.svg" would point at the root of the drive. Make it relative.
// 2. Font preload hints: browsers refuse CORS preloads from file:// pages and log an
//    error. The fonts still load through the stylesheet's @font-face rules, so the
//    hints are dropped, both as <link> tags and as the matching ":HL" rows in the
//    embedded React data (React would otherwise re-insert them on hydration).
function fixOfflineHtml(dir) {
  for (const file of walk(dir).filter((f) => f.endsWith(".html"))) {
    const full = path.join(dir, file);
    const html = fs
      .readFileSync(full, "utf8")
      .replaceAll('"/icon.svg', '"./icon.svg')
      .replace(/<link rel="preload" href="[^"]+\.woff2" as="font"[^>]*\/>/g, "")
      .replace(/:HL\[\\"[^"\\]+\.woff2\\",\\"font\\",\{[^}]*\}\]\\n/g, "");
    fs.writeFileSync(full, html);
  }
}

// HOW-TO-RUN.md, written into each ZIP and into dist/. `version` names the copy it ships in.
function howToRun(version) {
  const intro = {
    offline: "You are reading this inside the **offline version**. Extract the ZIP, then double-click `index.html`.",
    hosting: "You are reading this inside the **hosting version**. Upload it to a web server; it does not open by double-clicking.",
    all: "Two versions of the website are provided. Pick the one that matches how you will open it.",
  }[version];
  return `# How to run the Explic research website

Explic: Detecting and Explaining AI-Generated Voice and Text. SLIIT Research Group R26-IT-038.

${intro}

| ZIP file | Use it to | Needs a server? |
| --- | --- | --- |
| \`explic-research-website-offline.zip\` | View the site on a computer | No |
| \`explic-research-website.zip\` | Publish the site on a web server | Yes |

## Offline version

1. Extract the **whole** ZIP into a folder.
   On Windows, right-click the ZIP and choose **Extract All**. Do not open \`index.html\` from inside the ZIP: Windows copies only that one file and the page loses its styles.
2. Open the extracted folder and double-click \`index.html\`.

The site opens in your default browser (Chrome, Edge, Firefox or Safari). Nothing needs to be installed.

Keep the folder structure as it is: \`index.html\` needs the \`_next\`, \`images\` and \`licenses\` folders beside it.

**Internet connection.** The layout, fonts, navigation, assessment timeline, document filters and animated background all work offline. The hero video, team photos, and the Google Drive and Canva documents are hosted online. Without a connection, the page shows a local research figure in place of the video and initials in place of the photos.

## Hosting version

1. Extract the ZIP.
2. Upload the **contents** of the extracted folder (\`index.html\`, \`_next/\`, \`images/\`, ...) to the folder that the site's address points to.
3. Open the site through its \`http://\` or \`https://\` address.

Double-clicking \`index.html\` from this version shows an unstyled page. That is expected: it loads its styles from the server root (\`/_next/...\`), which on a computer means the root of the drive. Use the offline version for that.

### Preview it locally

From a terminal in the extracted folder:

\`\`\`bash
# Windows
py -m http.server 8000

# macOS or Linux
python3 -m http.server 8000
\`\`\`

Then open <http://localhost:8000/>.

### Hosting in a subfolder

This build expects to sit at the root of a domain, such as \`https://example.lk/\`. If the site's address is a subfolder, such as \`https://example.lk/~group/explic/\`, rebuild it for that folder from the source project (see below):

\`\`\`bash
NEXT_BASE_PATH=/~group/explic npm run build:submission
\`\`\`

## Running the source project

For working on the website itself. Requires [Node.js](https://nodejs.org/) 22 or newer.

\`\`\`bash
npm install                # once, to install dependencies
npm run dev                # development server at http://localhost:3000
npm run build:submission   # build both ZIP files into dist/
\`\`\`

| Command | What it does |
| --- | --- |
| \`npm run dev\` | Runs the site locally with live reload |
| \`npm run build\` | Builds the hosting version into \`out/\` |
| \`npm run build:submission\` | Builds, checks and zips both versions into \`dist/\` |
| \`npm run lint\` | Checks the code for problems |

Both versions are built from the same source, so content edits (for example in \`data/\`) appear in both after rebuilding.
`;
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

function validate(name, dir, { portable }) {
  const errors = [];
  const files = walk(dir);
  if (!files.includes("index.html")) errors.push("index.html missing at the root");

  const exists = (target) => {
    const clean = decodeURIComponent(target.split(/[?#]/)[0]);
    const full = path.join(dir, clean);
    return fs.existsSync(full) && (fs.statSync(full).isFile() || fs.existsSync(path.join(full, "index.html")));
  };

  for (const file of files.filter((f) => f.endsWith(".html"))) {
    const html = fs.readFileSync(path.join(dir, file), "utf8");
    const fileDir = path.dirname(file);
    for (const [, ref] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|tel:|data:|#)/.test(ref)) continue;
      if (portable) {
        if (ref.startsWith("/")) errors.push(`${file}: root-relative URL ${ref}`);
        else if (!exists(path.join(fileDir, ref))) errors.push(`${file}: missing ${ref}`);
      } else {
        const local = BASE_PATH && ref.startsWith(BASE_PATH) ? ref.slice(BASE_PATH.length) : ref;
        if (!exists(local.replace(/^\//, ""))) errors.push(`${file}: missing ${ref}`);
      }
    }
    if (portable) {
      if (/<script[^>]+type="module"/.test(html)) errors.push(`${file}: ES module script (blocked under file://)`);
      if (/\.woff2[^"]*" as="font"|\.woff2\\",\\"font\\"/.test(html)) errors.push(`${file}: font preload left`);
      if (/\\?"\/_next\//.test(html)) errors.push(`${file}: root-relative /_next/ reference in page data`);
    }
  }

  for (const file of files.filter((f) => f.endsWith(".css"))) {
    const css = fs.readFileSync(path.join(dir, file), "utf8");
    for (const [, raw] of css.matchAll(/url\(([^)]+)\)/g)) {
      const ref = raw.replace(/["']/g, "");
      if (/^(https?:|data:)/.test(ref)) continue;
      if (ref.startsWith("/")) errors.push(`${file}: root-relative url(${ref})`);
      else if (!exists(path.join(path.dirname(file), ref))) errors.push(`${file}: missing url(${ref})`);
    }
  }

  if (portable) {
    // Lazy-loaded chunks (e.g. the hero background) must be fetched relative to index.html.
    const runtime = files.filter((f) => f.endsWith(".js")).some((f) => fs.readFileSync(path.join(dir, f), "utf8").includes('"./_next/"'));
    if (!runtime) errors.push('JS runtime does not use the relative chunk base "./_next/"');
  }

  const banned = files.filter((f) => /(^|[\\/])(node_modules|\.next)[\\/]|\.(mp4|mov|pptx|pdf|zip)$/i.test(f));
  if (banned.length) errors.push(`unexpected files: ${banned.join(", ")}`);

  const bytes = dirSize(dir);
  if (bytes > SIZE_LIMIT) errors.push(`extracted size ${mb(bytes)} exceeds 20 MB`);

  if (errors.length) fail(`${name} validation:\n  ${errors.join("\n  ")}`);
  console.log(`✓ ${name}: ${files.length} files validated`);
}

/* ------------------------------------------------------------------ */
/* ZIP (deflate, written directly so no zip tool is required)          */
/* ------------------------------------------------------------------ */

function dosDateTime(date) {
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: (Math.max(date.getFullYear(), 1980) - 1980) << 9 | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

function writeZip(srcDir, zipPath) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  for (const file of walk(srcDir).sort()) {
    const full = path.join(srcDir, file);
    const name = Buffer.from(file.split(path.sep).join("/"), "utf8");
    const data = fs.readFileSync(full);
    const deflated = zlib.deflateRawSync(data, { level: 9 });
    const stored = deflated.length >= data.length;
    const body = stored ? data : deflated;
    const crc = zlib.crc32(data);
    const { time, date } = dosDateTime(fs.statSync(full).mtime);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt16LE(stored ? 0 : 8, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    locals.push(local, name, body);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4); // version made by
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(stored ? 0 : 8, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(body.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, name);

    offset += local.length + name.length + body.length;
  }
  const centralSize = centrals.reduce((sum, b) => sum + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(centrals.length / 2, 8);
  end.writeUInt16LE(centrals.length / 2, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  fs.writeFileSync(zipPath, Buffer.concat([...locals, ...centrals, end]));
}

/* ------------------------------------------------------------------ */
/* Build                                                               */
/* ------------------------------------------------------------------ */

if (!fs.existsSync(NEXT_BIN)) fail("dependencies are not installed. Run `npm install` first.");
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

console.log("\n==> 1/2 Offline build (file://)\n");
nextBuild({ EXPORT_PORTABLE: "1", NEXT_BASE_PATH: "" });
fs.cpSync(OUT, TARGETS.offline.dir, { recursive: true });
pruneOffline(TARGETS.offline.dir);
fixOfflineHtml(TARGETS.offline.dir);
fs.writeFileSync(path.join(TARGETS.offline.dir, "HOW-TO-RUN.md"), howToRun("offline"));

console.log(`\n==> 2/2 Hosting build${BASE_PATH ? ` (base path ${BASE_PATH})` : ""}\n`);
nextBuild({ EXPORT_PORTABLE: "", NEXT_BASE_PATH: BASE_PATH });
fs.cpSync(OUT, TARGETS.hosting.dir, { recursive: true });
fs.writeFileSync(path.join(TARGETS.hosting.dir, "HOW-TO-RUN.md"), howToRun("hosting"));

console.log("\n==> Validating\n");
validate("hosting", TARGETS.hosting.dir, { portable: false });
validate("offline", TARGETS.offline.dir, { portable: true });

console.log("\n==> Packaging\n");
const rows = [];
for (const [name, t] of Object.entries(TARGETS)) {
  writeZip(t.dir, t.zip);
  const extracted = dirSize(t.dir);
  const zipped = fs.statSync(t.zip).size;
  rows.push({ name, zip: path.relative(ROOT, t.zip), files: walk(t.dir).length, extracted: mb(extracted), zipped: mb(zipped), "under 20 MB": extracted <= SIZE_LIMIT ? "yes" : "NO" });
}
console.table(rows);
fs.writeFileSync(path.join(DIST, "HOW-TO-RUN.md"), howToRun("all"));
console.log(`Folders: ${path.relative(ROOT, TARGETS.hosting.dir)}/ and ${path.relative(ROOT, TARGETS.offline.dir)}/`);
