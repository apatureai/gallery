/**
 * Static preview server for `dist/`.
 *
 * Vite's own `vite preview` would do, but CI wants three guarantees that are
 * easier to state directly than to configure: bind loopback only, honour `PORT`
 * (Apature Gate's supervisor sets it from `GATE_LOCAL_SERVE_URL`), and answer
 * `/dashboard.html` and `/` without a rewrite plugin.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..", "dist");
const port = Number(process.env.PORT ?? 4173);
const host = process.env.HOST ?? "127.0.0.1";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

async function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  let candidate = join(root, clean);
  if (!candidate.startsWith(root)) return null;
  try {
    const info = await stat(candidate);
    if (info.isDirectory()) candidate = join(candidate, "index.html");
  } catch {
    if (!extname(candidate)) candidate = `${candidate}.html`;
  }
  try {
    await stat(candidate);
    return candidate;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${host}:${port}`);
  const file = await resolveFile(url.pathname);

  if (!file) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404 Not Found\n");
    return;
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": TYPES[extname(file)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch (error) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end(`500 ${error instanceof Error ? error.message : "error"}\n`);
  }
});

server.listen(port, host, () => {
  console.log(`Meridian preview on http://${host}:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
